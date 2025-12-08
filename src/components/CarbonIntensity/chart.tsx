// components/carbon-intensity-overview/chart.tsx
"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import type { CarbonIntensityPoint } from "@/services/carbon-intensity.service";

type PropsType = {
  data: CarbonIntensityPoint[];
};

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function CarbonIntensityOverviewChart({ data }: PropsType) {
  const isMobile = useIsMobile();

  const options: ApexOptions = {
    legend: {
      show: false,
    },
    colors: ["#5750F1"],
    chart: {
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
    },
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 320,
          },
        },
      },
    ],
    stroke: {
      curve: "smooth",
      width: isMobile ? 2 : 3,
    },
    grid: {
      strokeDashArray: 5,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      marker: {
        show: true,
      },
      y: {
        formatter: (value: number) => `${Math.round(value)} gCO₂/kWh`,
      },
    },
     xaxis: {
      type: "category",
      tickAmount: isMobile ? 4 : 6, // show only a handful of labels
      labels: {
        show: true,
        rotate: 0,
        hideOverlappingLabels: true,
        trim: false,
        style: {
          fontSize: isMobile ? "9px" : "12px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `${Math.round(value)}`,
        style: {
          fontSize: "10px",
        },
      },
    },
  };

  return (
    <div className="-ml-4 -mr-5 h-[310px]">
      <Chart
        options={options}
        series={[
          {
            name: "Carbon Intensity",
            data,
          },
        ]}
        type="area"
        height={310}
      />
    </div>
  );
}
