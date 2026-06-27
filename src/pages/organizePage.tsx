import { EventForm } from "@/components/forms/event";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const OrganizePage = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="w-full max-w-sm mx-10">
        <CardHeader>
          <CardTitle>Organize Event</CardTitle>
          <CardDescription>Organize new event</CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm update={false} />
        </CardContent>
      </Card>
    </div>
  );
};
