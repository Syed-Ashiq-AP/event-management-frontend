import {
  CardContent,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-user";
import { useEffect, useMemo, useRef, useState } from "react";
import { Cell, Pie, PieChart } from "recharts";

const chartConfig = {
  events: {
    label: "Events",
    color: "var(--chart-1)",
  },
  registrations: {
    label: "Registrations",
    color: "var(--chart-2)",
  },
  attendance: {
    label: "Attendance",
    color: "var(--chart-3)",
  },
  pending: {
    label: "Pending check-ins",
    color: "var(--chart-4)",
  },
} as const;

export const OverviewPage = () => {
  const { getAnalytics, status } = useUser();

  const didMount = useRef(false);

  const [analytics, setAnalytics] = useState({
    eventsCount: 0,
    registrationsCount: 0,
    attendanceCount: 0,
  });

  const pendingCheckIns = Math.max(
    analytics.registrationsCount - analytics.attendanceCount,
    0,
  );
  const attendanceRate = analytics.registrationsCount
    ? Math.round(
        (analytics.attendanceCount / analytics.registrationsCount) * 100,
      )
    : 0;
  const registrationsPerEvent = analytics.eventsCount
    ? (analytics.registrationsCount / analytics.eventsCount).toFixed(1)
    : "0.0";

  const overviewCards = [
    {
      label: "Events",
      value: analytics.eventsCount,
      helper: "Published events",
    },
    {
      label: "Registrations",
      value: analytics.registrationsCount,
      helper: "Total signups",
    },
    {
      label: "Attendance",
      value: analytics.attendanceCount,
      helper: "Marked present",
    },
    {
      label: "Pending check-ins",
      value: pendingCheckIns,
      helper: "Registrations not checked in",
    },
    {
      label: "Attendance rate",
      value: `${attendanceRate}%`,
      helper: "Attendance / registrations",
    },
    {
      label: "Avg. registrations / event",
      value: registrationsPerEvent,
      helper: "Registrations divided by events",
    },
  ];

  const chartData = useMemo(
    () => [
      {
        metric: "events",
        value: analytics.eventsCount,
        fill: "var(--chart-1)",
      },
      {
        metric: "registrations",
        value: analytics.registrationsCount,
        fill: "var(--chart-2)",
      },
      {
        metric: "attendance",
        value: analytics.attendanceCount,
        fill: "var(--chart-3)",
      },
      {
        metric: "pending",
        value: pendingCheckIns,
        fill: "var(--chart-4)",
      },
    ],
    [analytics, pendingCheckIns],
  );

  const chartCenterValue = `${attendanceRate}%`;

  useEffect(() => {
    if (didMount.current) return;

    const fetchAnalytics = async () => {
      const analytics = await getAnalytics();
      if (!analytics) return;
      setAnalytics(analytics);
    };

    fetchAnalytics();
    didMount.current = true;
  }, []);

  return (
    <div className="flex flex-col space-y-6 p-4 px-12 bg-background w-full flex-1">
      <div className="space-y-1">
        <h2 className="font-bold text-3xl">Events Overview</h2>
        <p className="text-sm text-muted-foreground">
          Track event activity, registrations, and attendance in one place.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        {overviewCards.map((card) => (
          <Card key={card.label} className="w-full">
            <CardHeader className="space-y-2">
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className="font-bold text-lg">
                {status !== "IDLE" ? (
                  <Skeleton className="w-16 h-9 bg-gray-300" />
                ) : (
                  card.value
                )}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{card.helper}</p>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card className="w-full">
          <CardHeader>
            <CardDescription>Analytics breakdown</CardDescription>
            <CardTitle className="font-bold text-lg">
              Activity distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-[320px]">
            {status !== "IDLE" ? (
              <Skeleton className="h-[320px] w-full bg-gray-300" />
            ) : (
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[320px] w-full"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="metric"
                    innerRadius={70}
                    outerRadius={110}
                    strokeWidth={5}
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.metric} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardDescription>Attendance snapshot</CardDescription>
            <CardTitle className="font-bold text-lg">
              {status !== "IDLE" ? (
                <Skeleton className="w-16 h-9 bg-gray-300" />
              ) : (
                chartCenterValue
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border/60 bg-muted/40 p-4">
              <p className="text-sm font-medium">Attendance rate</p>
              <p className="text-sm text-muted-foreground">
                {attendanceRate}% of registrations are marked present.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border/60 p-4">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-semibold">{pendingCheckIns}</p>
              </div>
              <div className="rounded-lg border border-border/60 p-4">
                <p className="text-sm text-muted-foreground">Per event</p>
                <p className="text-2xl font-semibold">
                  {registrationsPerEvent}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
