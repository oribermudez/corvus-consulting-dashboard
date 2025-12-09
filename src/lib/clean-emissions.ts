// lib/clean-emissions.ts

// Detect delimiter: semicolon (;) or comma (,)
const detectDelimiter = (headerLine: string): string => {
  const semicolons = (headerLine.match(/;/g) || []).length
  const commas = (headerLine.match(/,/g) || []).length

  if (semicolons > commas) return ";"
  return ","
}

// Converts kg to tonnes
const convertToTonnes = (value: number, unit: string) => {
  const normalized = unit.toLowerCase().trim()
  if (normalized === "kg") return value / 1000
  return value // assume already in tonnes (e.g. tCO2)
}

// Normalize facility name: trim, collapse spaces, Title Case
const normalizeFacilityName = (name: string) =>
  name
    .trim()
    .replace(/\s+/g, " ") // collapse multiple spaces into one
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Title Case

export function cleanEmissionsCSV(raw: string) {
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0)

  if (lines.length === 0) {
    return {
      cleanedRows: [],
      metrics: {
        total: 0,
        cleaned: 0,
        removedRows: 0,
        convertedCount: 0,
      },
    }
  }

  const delimiter = detectDelimiter(lines[0])

  const parseRow = (line: string) =>
    line.split(delimiter).map((cell) => cell.trim())

  const headerCells = parseRow(lines[0]).map((h) => h.toLowerCase())

  const facilityIndex = headerCells.findIndex((h) => h.includes("facility"))
  const dateIndex = headerCells.findIndex((h) => h.includes("date"))
  const emissionsIndex = headerCells.findIndex((h) => h.startsWith("emissions"))
  const unitIndex = headerCells.findIndex((h) => h.includes("unit"))
  const statusIndex = headerCells.findIndex((h) => h.includes("status"))

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

    const rawFacility = cols[facilityIndex]
    const date = cols[dateIndex]?.trim()
    const emissionsRaw = cols[emissionsIndex]
    const unit = cols[unitIndex] ?? ""
    const statusRaw = cols[statusIndex] ?? ""

    const facility = rawFacility ? normalizeFacilityName(rawFacility) : ""
    const emissions = parseFloat(emissionsRaw)

    // REMOVE invalid rows
    if (!facility || !date || isNaN(emissions)) {
      removedRows++
      continue
    }

    const valueInTonnes = convertToTonnes(emissions, unit)
    if (unit.toLowerCase().trim() === "kg") convertedCount++

    cleanedRows.push({
      facility_name: facility,
      date,
      emissions_tonnes: valueInTonnes.toFixed(3),
      status: statusRaw.toLowerCase().trim(),
      original_emissions: emissionsRaw,
      original_unit: unit,
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
