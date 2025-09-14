"use client";

import type { ButtonProps, CardProps } from "@heroui/react";

import React from "react";
import { ResponsiveContainer, RadialBarChart, RadialBar, Cell, Tooltip } from "recharts";
import {
  Card,
} from "@heroui/react";

type ChartData = {
  name: string;
  value: number;
  valueText: string;
  [key: string]: string | number;
};

type DailyStatsChartProps = {
  title: string;
  color: ButtonProps["color"];
  categories: string[];
  chartData: ChartData[];
  unit?: string;
  unitTitle?: string;
  total?: number;
};

// 模拟今日统计数据
const dailyStatsData: DailyStatsChartProps = {
  title: "今日统计",
  categories: ["TCP In", "TCP Out", "UDP In", "UDP Out"],
  color: "success",
  unit: "GB",
  unitTitle: "总流量",
  total: 245,
  chartData: [
    { name: "TCP In", value: 85, valueText: "85 GB" },
    { name: "TCP Out", value: 68, valueText: "68 GB" },
    { name: "UDP In", value: 52, valueText: "52 GB" },
    { name: "UDP Out", value: 40, valueText: "40 GB" },
  ],
};

const colorIndexMap = (index: number) => {
  const mapIndex: Record<number, number> = {
    0: 300,
    1: 500,
    2: 700,
    3: 900,
  };

  return mapIndex[index] ?? 200;
};

const formatTotal = (value: number | undefined) => {
  return value?.toLocaleString() ?? "0";
};

export function DailyStatsChart() {
  const { title, categories, color, chartData, unit, total, unitTitle } = dailyStatsData;

  return (
    <Card className="h-full min-h-[300px] dark:border-default-100 border border-transparent">
      <div className="flex flex-col gap-y-2 p-5 pb-0">
        <div className="flex flex-col gap-y-0">
          <span className="text-base font-semibold text-foreground">{title}</span>
        </div>
      </div>
      <div className="flex h-full flex-col flex-col-reverse flex-wrap gap-3 sm:flex-row sm:flex-nowrap">
        <div className="text-tiny text-default-500 flex flex-col justify-center gap-y-2 pb-4 pl-5 lg:pb-0">
          {categories.map((category, index) => {
            const title = category;
            const valueText = chartData.find((c) => c.name === title)?.valueText;

            return (
              <div key={index} className="flex flex-col items-start gap-y-0">
                <span className="text-small text-default-500 font-medium capitalize">
                  {category}
                </span>
                <span className="text-small text-foreground font-semibold">{valueText}</span>
              </div>
            );
          })}
        </div>
        <ResponsiveContainer
          className="[&_.recharts-surface]:outline-hidden"
          height={200}
          width="100%"
        >
          <RadialBarChart
            barSize={10}
            cx="50%"
            cy="50%"
            data={chartData}
            endAngle={-270}
            innerRadius={90}
            outerRadius={54}
            startAngle={90}
          >
            <Tooltip
              content={({ payload }) => (
                <div className="rounded-medium bg-background text-tiny shadow-small flex h-8 min-w-[120px] items-center gap-x-2 px-1">
                  {payload?.map((p) => {
                    const name = p.payload.name;
                    const value = p.value;
                    const index = chartData.findIndex((c) => c.name === name);

                    return (
                      <div key={`${index}-${name}`} className="flex w-full items-center gap-x-2">
                        <div
                          className="h-2 w-2 flex-none rounded-full"
                          style={{
                            backgroundColor: `hsl(var(--heroui-${color}-${colorIndexMap(index)}))`,
                          }}
                        />
                        <div className="text-default-700 flex w-full items-center justify-between gap-x-2 pr-1 text-xs">
                          <span className="text-default-500">{name}</span>
                          <span className="text-default-700 font-mono font-medium">
                            {formatTotal(value as number)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              cursor={false}
            />
            <RadialBar
              animationDuration={1000}
              animationEasing="ease"
              background={{ fill: "hsl(var(--heroui-default-100))" }}
              cornerRadius={12}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(var(--heroui-${color}-${colorIndexMap(index)}))`}
                />
              ))}
            </RadialBar>
            <g>
              <text textAnchor="middle" x="50%" y="48%">
                <tspan className="fill-default-500 text-[0.6rem]" dy="-0.5em" x="50%">
                  {unitTitle}
                </tspan>
                <tspan className="fill-foreground text-tiny font-semibold" dy="1.5em" x="50%">
                  {formatTotal(total)} {unit}
                </tspan>
              </text>
            </g>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}