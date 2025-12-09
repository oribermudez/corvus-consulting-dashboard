"use client"

import { useState } from "react"
import InputGroup from "@/components/FormElements/InputGroup"

export default function UploadCSV({ onFileLoaded }: { onFileLoaded: (data: string) => void }) {
  const [fileName, setFileName] = useState("")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      onFileLoaded(text)
    }
    reader.readAsText(file)
  }

  return (
    <div className="mt-5 bg-white p-6 rounded-lg shadow dark:bg-gray-dark">
      <InputGroup
        label="Upload Emissions CSV"
        type="file"
        placeholder={fileName || "Choose CSV file"}
        handleChange={handleFileUpload}
        fileStyleVariant="style1"
        required
      />
    </div>
  )
}
