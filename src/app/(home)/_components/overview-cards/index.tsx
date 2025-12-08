// components/carbon-intensity-overview/cards-group.tsx

import { getCarbonIntensityCardsData } from "@/services/carbon-intensity-cards.service"
import { OverviewCard } from "./card"
import * as icons from "./icons"

export async function CarbonIntensityOverviewCardsGroup() {
  const {
    avgIntensity,
    currentIntensity,
    lowestBlock,
    highestBlock,
  } = await getCarbonIntensityCardsData()

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard label={avgIntensity.label} data={avgIntensity} Icon={icons.Views} />

      <OverviewCard label={currentIntensity.label} data={currentIntensity} Icon={icons.Profit} />

      <OverviewCard label={lowestBlock.label} data={lowestBlock} Icon={icons.Product} />

      <OverviewCard label={highestBlock.label} data={highestBlock} Icon={icons.Users} />
    </div>
  )
}
