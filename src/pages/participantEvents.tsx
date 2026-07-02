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
import { DataTableToolbar } from "@/components/data-table-toolbar";
import { filterRows, sortRows, type SortConfig } from "@/lib/data-table";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const ParticipantEvents = () => {
  const navigate = useNavigate();
  const { getEvents, registerEvent, status } = useUser();

  const [events, setEvents] = useState<UserEvent[]>([]);
  const [eventSearch, setEventSearch] = useState("");
  const [eventSort, setEventSort] = useState<SortConfig>({
    field: "eventDate",
    direction: "desc",
  });

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

  const visibleEvents = useMemo(() => {
    const filteredEvents = filterRows(events, eventSearch, [
      (event) => event.title,
      (event) => event.user.name,
      (event) => event.location,
      (event) => event.description,
      (event) => new Date(event.eventDate).toLocaleString(),
      (event) => (event.registrations.length > 0 ? "registered" : "available"),
    ]);

    return sortRows(filteredEvents, eventSort, {
      title: (event) => event.title,
      organizer: (event) => event.user.name,
      eventDate: (event) => new Date(event.eventDate),
      location: (event) => event.location,
      registered: (event) => event.registrations.length,
    });
  }, [events, eventSearch, eventSort]);

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
      <div className="px-2">
        <DataTableToolbar
          searchValue={eventSearch}
          onSearchValueChange={setEventSearch}
          searchPlaceholder="Search events..."
          currentSortFieldLabel={
            eventSort
              ? {
                  title: "Title",
                  organizer: "Organizer",
                  eventDate: "Date",
                  location: "Location",
                  registered: "Registration",
                }[eventSort.field]
              : undefined
          }
          currentSortDirection={eventSort?.direction}
          sortOptions={[
            { field: "title", label: "Title" },
            { field: "organizer", label: "Organizer" },
            { field: "eventDate", label: "Date" },
            { field: "location", label: "Location" },
            { field: "registered", label: "Registration" },
          ]}
          onSortFieldChange={(field) =>
            setEventSort({ field, direction: eventSort?.direction ?? "asc" })
          }
          onSortDirectionChange={(direction) =>
            setEventSort({
              field: eventSort?.field ?? "eventDate",
              direction,
            })
          }
          onClearSort={() => setEventSort(null)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
        {status !== "IDLE" ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="bg-gray-300 h-18 w-full" />
          ))
        ) : visibleEvents.length === 0 ? (
          <div className="col-span-full rounded-md border p-6 text-center text-sm text-muted-foreground">
            No results.
          </div>
        ) : (
          visibleEvents.map((event, i) => {
            const eventDate = new Date(event.eventDate).toLocaleString();
            const registered = event.registrations.length > 0;
            return (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>
                    {eventDate} - {event.location} · {event.user.name}
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
                          <span>
                            <b>Organizer: </b>
                            {event.user.name}
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
          })
        )}
      </div>
    </div>
  );
};
