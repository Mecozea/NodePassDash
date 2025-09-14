"use client";

import type {ButtonProps, CardProps, RadioProps} from "@heroui/react";

import React from "react";
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer} from "recharts";
import {
  Card,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Divider,
  VisuallyHidden,
  useRadio,
  RadioGroup,
  cn,
} from "@heroui/react";
import {Icon} from "@iconify/react";

type ChartData = {
  weekday: string;
  [key: string]: string | number;
};

type BarChartProps = {
  title: string;
  color: ButtonProps["color"];
  categories: string[];
  chartData: ChartData[];
};

const data: BarChartProps[] = [
  {
    title: "Operating Systems",
    categories: ["Android", "iOS", "Web", "Windows"],
    color: "default",
    chartData: [
      {
        weekday: "Mon",
        android: 20,
        ios: 30,
        web: 20,
        windows: 10,
      },
      {
        weekday: "Tue",
        android: 35,
        ios: 35,
        web: 20,
        windows: 10,
      },
      {
        weekday: "Wed",
        android: 15,
        ios: 25,
        web: 20,
        windows: 10,
      },
      {
        weekday: "Thu",
        android: 12,
        ios: 35,
        web: 10,
        windows: 10,
      },
      {
        weekday: "Fri",
        android: 12,
        ios: 15,
        web: 20,
        windows: 10,
      },
      {
        weekday: "Sat",
        android: 35,
        ios: 25,
        web: 10,
        windows: 6,
      },
      {
        weekday: "Sun",
        android: 40,
        ios: 30,
        web: 20,
        windows: 10,
      },
    ],
  },
  {
    title: "Browser Usage",
    categories: ["Chrome", "Firefox", "Safari", "Edge"],
    color: "primary",
    chartData: [
      {
        weekday: "Mon",
        chrome: 45,
        firefox: 20,
        safari: 12,
        edge: 8,
      },
      {
        weekday: "Tue",
        chrome: 40,
        firefox: 10,
        safari: 12,
        edge: 8,
      },
      {
        weekday: "Wed",
        chrome: 52,
        firefox: 12,
        safari: 15,
        edge: 10,
      },
      {
        weekday: "Thu",
        chrome: 28,
        firefox: 12,
        safari: 12,
        edge: 8,
      },
      {
        weekday: "Fri",
        chrome: 30,
        firefox: 12,
        safari: 12,
        edge: 8,
      },
      {
        weekday: "Sat",
        chrome: 45,
        firefox: 32,
        safari: 8,
        edge: 5,
      },
      {
        weekday: "Sun",
        chrome: 68,
        firefox: 17,
        safari: 10,
        edge: 5,
      },
    ],
  },
  {
    title: "Device Types",
    categories: ["Mobile", "Tablet", "Desktop", "Other"],
    color: "secondary",
    chartData: [
      {
        weekday: "Mon",
        mobile: 25,
        tablet: 10,
        desktop: 20,
        other: 20,
      },
      {
        weekday: "Tue",
        mobile: 40,
        tablet: 10,
        desktop: 30,
        other: 20,
      },
      {
        weekday: "Wed",
        mobile: 10,
        tablet: 50,
        desktop: 20,
        other: 20,
      },
      {
        weekday: "Thu",
        mobile: 40,
        tablet: 20,
        desktop: 20,
        other: 10,
      },
      {
        weekday: "Fri",
        mobile: 15,
        tablet: 30,
        desktop: 20,
        other: 10,
      },
      {
        weekday: "Sat",
        mobile: 50,
        tablet: 20,
        desktop: 10,
        other: 20,
      },
      {
        weekday: "Sun",
        mobile: 50,
        tablet: 10,
        desktop: 20,
        other: 20,
      },
    ],
  },
];

export default function Component() {
  return (
    <dl className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
      {data.map((item, index) => (
        <BarChartCard key={index} {...item} />
      ))}
    </dl>
  );
}

const formatWeekday = (weekday: string) => {
  const day =
    {
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
      Sun: 0,
    }[weekday] ?? 0;

  return new Intl.DateTimeFormat("en-US", {weekday: "long"}).format(new Date(2024, 0, day));
};

const BarChartCard = React.forwardRef<HTMLDivElement, Omit<CardProps, "children"> & BarChartProps>(
  ({className, title, categories, color, chartData, ...props}, ref) => {
    return (
      <Card
        ref={ref}
        className={cn("dark:border-default-100 h-[300px] border border-transparent", className)}
        {...props}
      >
        <div className="flex flex-col gap-y-4 p-4">
          <dt>
            <h3 className="text-small text-default-500 font-medium">{title}</h3>
          </dt>
          <dd className="text-tiny text-default-500 flex w-full justify-end gap-4">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: `hsl(var(--heroui-${color}-${(index + 1) * 200}))`,
                  }}
                />
                <span className="capitalize">{category}</span>
              </div>
            ))}
          </dd>
        </div>
        <ResponsiveContainer
          className="[&_.recharts-surface]:outline-hidden"
          height="100%"
          width="100%"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              right: 14,
              left: -8,
              bottom: 5,
            }}
          >
            <XAxis
              dataKey="weekday"
              strokeOpacity={0.25}
              style={{fontSize: "var(--heroui-font-size-tiny)", color: "red"}}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              style={{fontSize: "var(--heroui-font-size-tiny)"}}
              tickLine={false}
            />
            <Tooltip
              content={({label, payload}) => (
                <div className="rounded-medium bg-background text-tiny shadow-small flex h-auto min-w-[120px] items-center gap-x-2 p-2">
                  <div className="flex w-full flex-col gap-y-1">
                    <span className="text-foreground font-medium">{formatWeekday(label)}</span>
                    {payload?.map((p, index) => {
                      const name = p.name;
                      const value = p.value;
                      const category = categories.find((c) => c.toLowerCase() === name) ?? name;

                      return (
                        <div key={`${index}-${name}`} className="flex w-full items-center gap-x-2">
                          <div
                            className="h-2 w-2 flex-none rounded-full"
                            style={{
                              backgroundColor: `hsl(var(--heroui-${color}-${(index + 1) * 200}))`,
                            }}
                          />
                          <div className="text-default-700 flex w-full items-center justify-between gap-x-2 pr-1 text-xs">
                            <span className="text-default-500">{category}</span>
                            <span className="text-default-700 font-mono font-medium">{value}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              cursor={false}
            />
            {categories.map((category, index) => (
              <Bar
                key={`${category}-${index}`}
                animationDuration={450}
                animationEasing="ease"
                barSize={24}
                dataKey={category.toLowerCase()}
                fill={`hsl(var(--heroui-${color}-${(index + 1) * 200}))`}
                radius={index === categories.length - 1 ? [4, 4, 0, 0] : 0}
                stackId="bars"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>

        <Divider className="bg-default-100 mx-auto w-full max-w-[calc(100%-2rem)]" />

        <RadioGroup
          aria-label="Time Range"
          className="flex gap-x-2 p-4"
          defaultValue="7"
          orientation="horizontal"
        >
          <ButtonRadioItem value="7">7 days</ButtonRadioItem>
          <ButtonRadioItem value="14">14 days</ButtonRadioItem>
          <ButtonRadioItem value="30">30 days</ButtonRadioItem>
        </RadioGroup>

        <Dropdown
          classNames={{
            content: "min-w-[120px]",
          }}
          placement="bottom-end"
        >
          <DropdownTrigger>
            <Button
              isIconOnly
              className="absolute top-2 right-2 w-auto rounded-full"
              size="sm"
              variant="light"
            >
              <Icon height={16} icon="solar:menu-dots-bold" width={16} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            itemClasses={{
              title: "text-tiny",
            }}
            variant="flat"
          >
            <DropdownItem key="view-details">View Details</DropdownItem>
            <DropdownItem key="export-data">Export Data</DropdownItem>
            <DropdownItem key="set-alert">Set Alert</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Card>
    );
  },
);

BarChartCard.displayName = "BarChartCard";

const ButtonRadioItem = React.forwardRef<
  HTMLInputElement,
  Omit<RadioProps, "color"> & {
    color?: ButtonProps["color"];
    size?: ButtonProps["size"];
    variant?: ButtonProps["variant"];
  }
>(({children, color, size = "sm", variant, ...props}, ref) => {
  const {Component, isSelected, getBaseProps, getInputProps} = useRadio(props);

  return (
    <Component {...getBaseProps()} ref={ref}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <Button
        disableRipple
        className={cn("text-default-500 pointer-events-none", {
          "text-foreground": isSelected,
        })}
        color={color}
        size={size}
        variant={variant || isSelected ? "solid" : "flat"}
      >
        {children}
      </Button>
    </Component>
  );
});

ButtonRadioItem.displayName = "ButtonRadioItem";
