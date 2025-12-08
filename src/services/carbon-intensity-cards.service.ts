// services/carbon-intensity-cards.services.ts

import { getCarbonIntensityOverviewData } from "./carbon-intensity.service"

export async function getCarbonIntensityCardsData() {
  const { series, metrics } = await getCarbonIntensityOverviewData()

  // For growthRate we need a comparison baseline
  // We'll estimate “yesterday” as ±10% change from today (dummy data for sample project)
  // This keeps focus on transformation logic — not multi-day fetching
  const avgToday = metrics.average ?? 0
  const avgYesterday = avgToday * 0.9 // Assuming yesterday was cleaner by 10%

  const growthFromYesterday =
    avgYesterday === 0
      ? 0
      : ((avgToday - avgYesterday) / avgYesterday) * 100

  const currentGrowth =
    avgToday === 0 || !metrics.current
      ? 0
      : ((metrics.current.y - avgToday) / avgToday) * 100

  const minGrowth =
    avgToday === 0 || !metrics.minPoint
      ? 0
      : ((metrics.minPoint.y - avgToday) / avgToday) * 100

  const maxGrowth =
    avgToday === 0 || !metrics.maxPoint
      ? 0
      : ((metrics.maxPoint.y - avgToday) / avgToday) * 100

  return {
    avgIntensity: {
      label: "Average Intensity Today",
      value: `${Math.round(avgToday)} gCO₂/kWh`,
      growthRate: Number(growthFromYesterday.toFixed(1)),
    },
    currentIntensity: {
      label: "Current Intensity",
      value: `${Math.round(metrics.current?.y ?? 0)} gCO₂/kWh`,
      growthRate: Number(currentGrowth.toFixed(1)),
    },
    lowestBlock: {
      label: "Lowest Emission Block",
      value: metrics.minPoint
        ? `${metrics.minPoint.x} · ${Math.round(metrics.minPoint.y)} gCO₂/kWh`
        : "N/A",
      growthRate: Number(minGrowth.toFixed(1)),
    },
    highestBlock: {
      label: "Highest Emission Block",
      value: metrics.maxPoint
        ? `${metrics.maxPoint.x} · ${Math.round(metrics.maxPoint.y)} gCO₂/kWh`
        : "N/A",
      growthRate: Number(maxGrowth.toFixed(1)),
    },
  }
}

//We fake the growth comparison baseline (yesterday) because the API doesn’t provide multi-day data in the same endpoint — but the math is valid and demonstrates transformation.