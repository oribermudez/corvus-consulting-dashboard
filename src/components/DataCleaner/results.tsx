"use client"

import jsPDF from "jspdf"
import { saveAs } from "file-saver"

type Metrics = {
  total: number
  cleaned: number
  removedRows: number
  convertedCount: number
}

type Row = {
  facility_name: string
  date: string
  emissions_tonnes: string
  status: string
  original_emissions: string
  original_unit: string
}

export default function CleanResults({
  data,
  metrics,
  onReset,
}: {
  data: Row[]
  metrics: Metrics
  onReset?: () => void
}) {
  const downloadCSV = () => {
    const csv = [
      "facility_name,date,emissions_tonnes,status",
      ...data.map((r) =>
        `${r.facility_name},${r.date},${r.emissions_tonnes},${r.status}`,
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    saveAs(blob, "cleaned_emissions.csv")
  }

  const downloadPDF = () => {
    const doc = new jsPDF()

    // Title
    doc.setFontSize(16)
    doc.text("Emissions Data Cleaning Report", 14, 20)

    // Timestamp
    doc.setFontSize(10)
    const generatedAt = new Date().toLocaleString()
    doc.text(`Generated: ${generatedAt}`, 14, 28)

    // Summary
    doc.setFontSize(12)
    doc.text("Summary", 14, 40)
    doc.setFontSize(10)
    doc.text(`Total rows (original): ${metrics.total}`, 14, 48)
    doc.text(`Valid rows kept: ${metrics.cleaned}`, 14, 54)
    doc.text(
      `Removed rows (missing required fields): ${metrics.removedRows}`,
      14,
      60,
    )
    doc.text(
      `Unit conversions applied (kg to tonnes CO2): ${metrics.convertedCount}`,
      14,
      66,
    )

    // Aggregate insights
    const totalEmissions = data.reduce(
      (sum, row) => sum + parseFloat(row.emissions_tonnes || "0"),
      0,
    )

    const topEmitter =
      data.length > 0
        ? data.reduce((max, row) =>
            parseFloat(row.emissions_tonnes) >
            parseFloat(max.emissions_tonnes)
              ? row
              : max,
          )
        : null

    let y = 80
    doc.setFontSize(12)
    doc.text("Key Insights", 14, y)
    y += 8
    doc.setFontSize(10)
    doc.text(
      `Total emissions (tonnes CO2): ${totalEmissions.toFixed(3)}`,
      14,
      y,
    )
    y += 6

    if (topEmitter) {
      doc.text(
        `Highest-emitting facility: ${topEmitter.facility_name} (${parseFloat(
          topEmitter.emissions_tonnes,
        ).toFixed(3)} tCO2)`,
        14,
        y,
      )
      y += 10
    } else {
      y += 4
    }

    // Sample cleaned rows
    doc.setFontSize(12)
    doc.text("Sample cleaned records", 14, y)
    y += 8
    doc.setFontSize(9)
    doc.text("Facility", 14, y)
    doc.text("Date", 70, y)
    doc.text("Emissions (tCO2)", 110, y)
    doc.text("Status", 160, y)
    y += 4
    doc.setLineWidth(0.1)
    doc.line(14, y, 200, y)
    y += 4

    const sampleRows = data.slice(0, 5)
    sampleRows.forEach((row) => {
      if (y > 270) {
        doc.addPage()
        y = 20
      }

      doc.text(row.facility_name, 14, y)
      doc.text(row.date, 70, y)
      doc.text(`${row.emissions_tonnes} tCO2`, 110, y)
      doc.text(row.status || "-", 160, y)
      y += 5
    })

    doc.save("emissions_cleaning_report.pdf")
  }

  const handleClear = () => {
    if (onReset) onReset()
    if (typeof window !== "undefined") {
      window.location.reload()
    }
  }

  return (
    <div className="mt-6 space-y-8">
      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card label="Valid Rows" value={metrics.cleaned} />
        <Card
          label="Removed rows (missing required fields)"
          value={metrics.removedRows}
        />
        <Card
          label="Unit Conversions (kg to tCO2)"
          value={metrics.convertedCount}
        />
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={downloadCSV}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Download Clean CSV
        </button>

        <button
          onClick={downloadPDF}
          className="rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
        >
          Download PDF Report
        </button>

        <button
          onClick={handleClear}
          className="rounded-md border border-stroke px-4 py-2 text-sm font-medium text-dark-5 hover:bg-[#F3F4F6] dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-2"
        >
          Clear Results
        </button>
      </div>
    </div>
  )
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[10px] bg-white p-4 shadow-1 dark:bg-dark-2">
      <p className="text-sm text-dark-6 dark:text-dark-6">{label}</p>
      <p className="text-xl font-bold text-dark dark:text-white">{value}</p>
    </div>
  )
}
