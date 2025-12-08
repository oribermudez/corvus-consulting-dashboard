// services/carbon-intensity.services.ts

export type CarbonIntensityPoint = {
  x: string // time label, e.g. "13:00"
  y: number // forecast value in gCO2/kWh
}

export type CarbonIntensityOverviewData = {
  series: CarbonIntensityPoint[]
  metrics: {
    current?: CarbonIntensityPoint & { index: string }
    average?: number
    minPoint?: CarbonIntensityPoint
    maxPoint?: CarbonIntensityPoint
  }
}

/**
 * Fetch today’s half-hourly carbon intensity for Great Britain
 * and return chart-ready data plus simple metrics.
 */
export async function getCarbonIntensityOverviewData(): Promise<CarbonIntensityOverviewData> {
  const res = await fetch("https://api.carbonintensity.org.uk/intensity/date", {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch carbon intensity data")
  }

  const json = await res.json()

  type ApiItem = {
    from: string
    to: string
    intensity: {
      forecast: number
      index: string
    }
  }

  const items: ApiItem[] = json.data ?? []

  const series: CarbonIntensityPoint[] = items.map((item) => {
    const from = new Date(item.from)
    const hours = from.getHours().toString().padStart(2, "0")
    const minutes = from.getMinutes().toString().padStart(2, "0")

    return {
      x: `${hours}:${minutes}`,
      y: item.intensity?.forecast ?? 0,
    }
  })

  const metrics: CarbonIntensityOverviewData["metrics"] = {}

  if (items.length > 0) {
    const now = new Date()

    // find current block
    const currentIdx = items.findIndex(
      (item) =>
        new Date(item.from) <= now && now <= new Date(item.to),
    )

    const currentItem = currentIdx >= 0 ? items[currentIdx] : items[0]
    const currentLabel = series[currentIdx >= 0 ? currentIdx : 0]?.x ?? ""

    metrics.current = {
      x: currentLabel,
      y: currentItem.intensity?.forecast ?? 0,
      index: currentItem.intensity?.index ?? "unknown",
    }

    // average
    const sum = series.reduce((acc, p) => acc + p.y, 0)
    metrics.average = sum / series.length

    // min / max on series
    let minPoint = series[0]
    let maxPoint = series[0]

    for (const p of series) {
      if (p.y < minPoint.y) minPoint = p
      if (p.y > maxPoint.y) maxPoint = p
    }

    metrics.minPoint = minPoint
    metrics.maxPoint = maxPoint
  }

  return { series, metrics }
}
