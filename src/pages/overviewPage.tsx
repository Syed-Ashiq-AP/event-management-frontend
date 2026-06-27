import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-user";
import { useEffect, useRef, useState } from "react";

export const OverviewPage = () => {
  const { getAnalytics, status } = useUser();

  const didMount = useRef(false);

  const [analytics, setAnalytics] = useState({
    eventsCount: 0,
    registrationsCount: 0,
    attendanceCount: 0,
  });

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
    <div className="flex flex-col space-y-4 p-4 px-12 bg-background w-full flex-1">
      <h2 className="font-bold text-3xl">Events Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full">
        <Card className="w-full">
          <CardHeader>
            <CardDescription>Events</CardDescription>
            <CardTitle className="font-bold text-lg">
              {status !== "IDLE" ? (
                <Skeleton className="w-5 h-9 bg-gray-300" />
              ) : (
                analytics.eventsCount
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardDescription>Event Registrations</CardDescription>
            <CardTitle className="font-bold text-lg">
              {status !== "IDLE" ? (
                <Skeleton className="w-5 h-9 bg-gray-300" />
              ) : (
                analytics.registrationsCount
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardDescription>Attendance Count</CardDescription>
            <CardTitle className="font-bold text-lg">
              {status !== "IDLE" ? (
                <Skeleton className="w-5 h-9 bg-gray-300" />
              ) : (
                analytics.attendanceCount
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};
