
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense } from "react";
import { CarbonIntensityOverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { CarbonIntensityOverview } from "@/components/CarbonIntensity"

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function Home({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <div className="mt-4">
          <CarbonIntensityOverviewCardsGroup/>
        </div>
      </Suspense>
      <CarbonIntensityOverview className="col-span-12 xl:col-span-5 mt-4" />
    </>
  );
}
