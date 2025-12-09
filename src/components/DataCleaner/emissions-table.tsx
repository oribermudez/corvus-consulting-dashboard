"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type EmissionRow = {
  facility_name: string
  date: string
  emissions_tonnes: string
  status: string
  original_emissions: string
  original_unit: string
}

export function EmissionsTable({ data }: { data: EmissionRow[] }) {
  if (!data.length) return null

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead className="min-w-[160px] xl:pl-7.5">
              Facility
            </TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Original</TableHead>
            <TableHead>Cleaned (tCO₂)</TableHead>
            <TableHead className="text-right xl:pr-7.5">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={index}
              className="border-[#eee] dark:border-dark-3"
            >
              <TableCell className="min-w-[160px] xl:pl-7.5">
                <h5 className="text-dark dark:text-white">
                  {item.facility_name}
                </h5>
              </TableCell>

              <TableCell>
                <p className="text-dark dark:text-white">{item.date}</p>
              </TableCell>

              <TableCell>
                <p className="text-sm text-dark-6 dark:text-dark-6">
                  {item.original_emissions} {item.original_unit || ""}
                </p>
              </TableCell>

              <TableCell>
                <p className="text-sm font-medium text-dark dark:text-white">
                  {item.emissions_tonnes} tCO₂
                </p>
              </TableCell>

              <TableCell className="text-right xl:pr-7.5">
                <span
                  className={cn(
                    "inline-flex rounded-full px-3.5 py-1 text-sm font-medium",
                    item.status === "open" &&
                      "bg-[#FFA70B]/[0.08] text-[#FFA70B]",
                    item.status === "closed" &&
                      "bg-[#219653]/[0.08] text-[#219653]",
                  )}
                >
                  {item.status || "-"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
