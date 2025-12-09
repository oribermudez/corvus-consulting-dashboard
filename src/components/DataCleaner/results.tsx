"use client"

import { saveAs } from "file-saver"

export default function CleanResults({ data, metrics }: any) {
  const downloadCSV = () => {
    const csv = [
      "facility_name,date,emissions_tonnes,status",
      ...data.map((r: any) =>
        `${r.facility_name},${r.date},${r.emissions_tonnes},${r.status}`
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    saveAs(blob, "cleaned_emissions.csv")
  }

  return (
    <div className="mt-6 space-y-8">
      {/* Metrics Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card label="Valid Rows" value={metrics.cleaned} />
        <Card label="Removed rows (missing required fields)" value={metrics.removedRows} />
        <Card label="Unit Conversions" value={metrics.convertedCount} />
      </div>

      {/* Download Button */}
      <button
        onClick={downloadCSV}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark"
      >
        Download Clean CSV
      </button>
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
