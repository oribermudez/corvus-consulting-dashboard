"use client"

import { useState } from "react"
import UploadCSV from "@/components/DataCleaner/upload-csv"
import CleanResults from "@/components/DataCleaner/results"
import { EmissionsTable } from "@/components/DataCleaner/emissions-table"
import { cleanEmissionsCSV } from "@/lib/clean-emissions"

function CleaningCriteriaNotice() {
  return (
    <div className="mt-4 rounded-[10px] border border-[#E2E8F0] bg-white p-4 text-xs text-dark-6 dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6">
      <p className="font-semibold text-dark dark:text-white">
        Cleaning rules
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-4">
        <li>
          Trims extra spaces and normalizes text (for example:{" "}
          <code>Open</code> → <code>open</code>).
        </li>
        <li>
          Converts emissions to a single unit:{" "}
          <strong>tonnes CO₂</strong> (from <code>kg</code> when needed).
        </li>
        <li>
          Keeps only rows with all required fields:
          <ul className="mt-1 ml-4 list-disc">
            <li>Facility name</li>
            <li>Date</li>
            <li>Emissions value (numeric)</li>
          </ul>
        </li>
        <li>
          Rows missing required fields are{" "}
          <strong>removed</strong> and counted in the “Removed rows” metric.
        </li>
      </ul>
    </div>
  )
}

export default function DataCleanerPage() {
  const [result, setResult] =
    useState<ReturnType<typeof cleanEmissionsCSV> | null>(null)

  const handleUpload = (raw: string) => {
    const cleaned = cleanEmissionsCSV(raw)
    setResult(cleaned)
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-body-2xlg font-bold text-dark dark:text-white">
        Emissions Data Cleaner
      </h1>

      <p className="text-sm text-dark-6 dark:text-dark-6">
        Upload a CSV with facility emissions. The tool will clean the data,
        standardize units, and show a clear summary of the changes.
      </p>

      <CleaningCriteriaNotice />

      <UploadCSV onFileLoaded={handleUpload} />

      {result && (
        <>
          <CleanResults
            data={result.cleanedRows}
            metrics={result.metrics}
            onReset={() => setResult(null)}
          />

          <EmissionsTable data={result.cleanedRows as any} />
        </>
      )}
    </div>
  )
}
