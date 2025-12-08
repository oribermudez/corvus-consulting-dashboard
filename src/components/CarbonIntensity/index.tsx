// components/carbon-intensity-overview/index.tsx

import { cn } from "@/lib/utils";
import { getCarbonIntensityOverviewData } from "@/services/carbon-intensity.service";
import { CarbonIntensityOverviewChart } from "./chart";

type PropsType = {
  className?: string;
};

function formatNumber(value?: number) {
  if (value == null) return "N/A";
  return `${Math.round(value)} gCO₂/kWh`;
}

export async function CarbonIntensityOverview({ className }: PropsType) {
  const { series, metrics } = await getCarbonIntensityOverviewData();

  return (
    <div
      className={cn(
        "grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      {/* Header (same structure) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Carbon Intensity Overview
        </h2>

        <span className="text-sm font-medium text-dark-6 dark:text-dark-6">
          Today · Great Britain
        </span>
      </div>

      {/* Chart */}
      <CarbonIntensityOverviewChart data={series} />

      {/* Metrics – same <dl> style adapted */}
      <dl className="grid divide-stroke text-center dark:divide-dark-3 sm:grid-cols-2 sm:divide-x [&>div]:flex [&>div]:flex-col-reverse [&>div]:gap-1">
        <div className="dark:border-dark-3 max-sm:mb-3 max-sm:border-b max-sm:pb-3">
          <dt className="text-xl font-bold text-dark dark:text-white">
            {formatNumber(metrics.average)}
          </dt>
          <dd className="font-medium dark:text-dark-6">
            Average intensity today
          </dd>
        </div>

        <div>
          <dt className="text-xl font-bold text-dark dark:text-white">
            {metrics.minPoint
              ? `${metrics.minPoint.x} · ${formatNumber(metrics.minPoint.y)}`
              : "N/A"}
          </dt>
          <dd className="font-medium dark:text-dark-6">
            Lowest emission time block
          </dd>
        </div>
      </dl>

      {/* Optional: tiny explanation paragraph (helps for submission) */}
      <p className="mt-2 text-xs text-dark-6 dark:text-dark-6">
        Data is fetched from the public Carbon Intensity API for Great Britain.
        From the raw half-hourly forecast series, the dashboard computes the
        daily average intensity and identifies the lowest-emission time block.
        This transformation turns raw data into an actionable insight, which is
        the kind of pattern that could be applied to compliance and reporting
        datasets in Corvus&apos; work.
      </p>
    </div>
  );
}
