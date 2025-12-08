"use client"

import jsVectorMap from "jsvectormap"
import "jsvectormap/dist/maps/world.js"
import { useEffect } from "react"

export default function Map() {
  useEffect(() => {
    async function init() {
      const res = await fetch("https://api.carbonintensity.org.uk/intensity")
      const json = await res.json()

      const forecast = json?.data?.[0]?.intensity?.forecast ?? 0
      const index = json?.data?.[0]?.intensity?.index ?? "unknown"

      const palette: Record<string, string> = {
        low: "#22c55e",
        moderate: "#eab308",
        high: "#ef4444",
        unknown: "#9ca3af",
      }

      const color = palette[index] ?? palette.unknown

      const map = new jsVectorMap({
        selector: "#mapOne",
        map: "world",
        zoomButtons: true,
        regionStyle: {
          initial: {
            fill: "#C8D0D8",
          },
        },
        series: {
          regions: [
            {
              attribute: "fill",
              values: {
                GB: color,
              },
            },
          ],
        },
        labels: {
          regions: {
            render(code: string) {
              if (code === "GB") {
                return `UK: ${forecast} gCO₂/kWh (${index})`
              }
              return code
            },
          },
        },
      })

      return () => {
        if (map && map.destroy) map.destroy()
      }
    }

    init()
  }, [])

  return (
    <div className="h-[422px]">
      <div id="mapOne" className="mapOne map-btn" />
    </div>
  )
}
