import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-user";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const ParticipantEvents = () => {
  const navigate = useNavigate();
  const { getEvents, registerEvent, status } = useUser();

  const [events, setEvents] = useState<UserEvent[]>([]);

  const didMount = useRef(false);
  const fetchEvents = async () => {
    const events = await getEvents();
    setEvents(events);
  };
  useEffect(() => {
    if (didMount.current) return;
    fetchEvents();
    didMount.current = true;
  }, []);

  const handleRegister = async (id: string) => {
    const registered = await registerEvent(id);
    if (registered) {
      toast.success("Registered Successfully!");
      navigate("/");
    }
  };

  return (
    <div className="bg-background flex-1 flex flex-col space-y-4 items-stretch p-4">
      <h2 className="font-bold text-3xl">Events</h2>
      <div className="grid grid-cols-4 gap-4 p-2">
        {status !== "IDLE"
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="bg-gray-300 h-18 w-full" />
            ))
          : events.map((event, i) => {
              const eventDate = new Date(event.eventDate).toLocaleString();
              const registered = event.registrations.length > 0;
              return (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>
                      {eventDate} - {event.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex w-full justify-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size={"lg"} disabled={registered}>
                            {registered ? "Registered" : "View"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{event.title}</DialogTitle>
                          </DialogHeader>
                          <div className="flex flex-col space-y-4">
                            <span>
                              <b>Date: </b>
                              {eventDate}
                            </span>
                            <span>
                              <b>Venue: </b>
                              {event.location}
                            </span>
                          </div>
                          <span>{event.description}</span>
                          <DialogFooter>
                            <Button
                              size={"lg"}
                              onClick={() => handleRegister(event.id)}
                            >
                              Reigister
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>
    </div>
  );
};
