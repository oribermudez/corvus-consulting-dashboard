// lib/clean-emissions.ts

// Detect delimiter: ; or ,
const detectDelimiter = (headerLine: string): string => {
  const semicolons = (headerLine.match(/;/g) || []).length
  const commas = (headerLine.match(/,/g) || []).length
  return semicolons > commas ? ";" : ","
}

// Convert kg → tCO2
const convertToTonnes = (value: number, unit: string) => {
  const u = unit.toLowerCase().trim()
  if (u === "kg") return value / 1000
  return value
}

// Normalize final unit always to tCO2
const normalizeUnit = (unit: string): string => {
  const u = unit.toLowerCase().trim()
  if (["kg", "t", "tonnes", "tons", "tco2"].includes(u)) return "tCO2"
  return "tCO2" // assume reporting standard
}

// Normalize facility name (TitleCase)
const normalizeFacilityName = (name: string) =>
  name
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())

// Normalize date → YYYY-MM-DD
const normalizeDate = (date: string): string | null => {
  const trimmed = date.trim()

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed

  // DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    const [day, month, year] = trimmed.split("/")
    return `${year}-${month}-${day}`
  }

  return null
}

export function cleanEmissionsCSV(raw: string) {
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0)

  if (lines.length === 0) {
    return {
      cleanedRows: [],
      metrics: { total: 0, cleaned: 0, removedRows: 0, convertedCount: 0 },
    }
  }

  const delimiter = detectDelimiter(lines[0])
  const parseRow = (line: string) =>
    line.split(delimiter).map((c) => c.trim())

  const headers = parseRow(lines[0]).map((h) => h.toLowerCase())
  const facilityIndex = headers.findIndex((h) => h.includes("facility"))
  const dateIndex = headers.findIndex((h) => h.includes("date"))
  const emissionsIndex = headers.findIndex((h) => h.startsWith("emissions"))
  const unitIndex = headers.findIndex((h) => h.includes("unit"))
  const statusIndex = headers.findIndex((h) => h.includes("status"))

  let convertedCount = 0
  let removedRows = 0

  const cleanedRows: {
    facility_name: string
    date: string
    emissions_tonnes: string
    status: string
    original_emissions: string
    original_unit: string
  }[] = []

  for (let i = 1; i < lines.length; i++) {
    const cols = parseRow(lines[i])

    const facilityRaw = cols[facilityIndex]
    const dateRaw = cols[dateIndex]
    const emissionsRaw = cols[emissionsIndex]
    const unitRaw = cols[unitIndex] ?? ""
    const statusRaw = cols[statusIndex] ?? ""

    const facility = normalizeFacilityName(facilityRaw || "")
    const date = normalizeDate(dateRaw || "")
    const emissions = parseFloat(emissionsRaw)

    if (!facility || !date || isNaN(emissions)) {
      removedRows++
      continue
    }

    const valueInTonnes = convertToTonnes(emissions, unitRaw)
    if (unitRaw.toLowerCase().trim() === "kg") convertedCount++

    cleanedRows.push({
      facility_name: facility,
      date,
      emissions_tonnes: valueInTonnes.toFixed(3),
      status: statusRaw.toLowerCase().trim(),
      original_emissions: emissionsRaw,
      original_unit: normalizeUnit(unitRaw),
    })
  }

  return {
    cleanedRows,
    metrics: {
      total: cleanedRows.length + removedRows,
      cleaned: cleanedRows.length,
      removedRows,
      convertedCount,
    },
  }
}
