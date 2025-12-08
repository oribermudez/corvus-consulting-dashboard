// services/carbon-regional.services.ts

export type RegionalIntensity = {
  id: number
  name: string
  code: string
  forecast: number
  index: string
}

export async function getCarbonRegionalData(): Promise<RegionalIntensity[]> {
  const res = await fetch("https://api.carbonintensity.org.uk/regional", {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch regional intensity data")
  }

  const json = await res.json()
  const regions = json.data?.[0]?.regions ?? []

  return regions.map((r: any) => ({
    id: r.regionid,
    name: r.shortname,
    code: r.dnoregion,
    forecast: r.intensity?.forecast ?? 0,
    index: r.intensity?.index ?? "unknown",
  }))
}
