import { useUser } from "@/hooks/use-user";
import React, { useEffect, useRef, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DataTableToolbar } from "@/components/data-table-toolbar";
import { IoEllipsisHorizontal } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EventForm } from "@/components/forms/event";
import { Scanner } from "@yudiel/react-qr-scanner";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { MdEmojiEvents } from "react-icons/md";
import { filterRows, sortRows, type SortConfig } from "@/lib/data-table";

export const OrganizerEvents = () => {
  const { getEvents, getEventParticipants, cancelEvent, setAttended, status } =
    useUser();
  const didMount = useRef(false);

  const [events, setEvents] = useState<UserEvent[]>([]);
  const [eventSearch, setEventSearch] = useState("");
  const [eventSort, setEventSort] = useState<SortConfig>({
    field: "eventDate",
    direction: "desc",
  });
  const [participantDialogOpen, setParticipantDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<UserEvent | null>(null);
  const [participantSearch, setParticipantSearch] = useState("");
  const [participantSort, setParticipantSort] = useState<SortConfig>({
    field: "registeredAt",
    direction: "desc",
  });
  const [participants, setParticipants] = useState<UserEventParticipant[]>([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);

  const [rowSelection, setRowSelection] = React.useState({});

  const fetchEvents = async () => {
    const events = await getEvents();
    setEvents(events);
  };
  useEffect(() => {
    if (didMount.current) return;
    fetchEvents();
    didMount.current = true;
  }, []);

  const openParticipantsDialog = async (event: UserEvent) => {
    setSelectedEvent(event);
    setParticipantSearch("");
    setParticipantSort({ field: "registeredAt", direction: "desc" });
    setParticipantDialogOpen(true);
    setParticipantsLoading(true);
    try {
      const eventParticipants = await getEventParticipants(event.id);
      setParticipants(eventParticipants);
    } finally {
      setParticipantsLoading(false);
    }
  };

  const visibleEvents = React.useMemo(() => {
    const filteredEvents = filterRows(events, eventSearch, [
      (event) => event.title,
      (event) => event.location,
      (event) => event.status,
      (event) => new Date(event.eventDate).toLocaleString(),
    ]);

    return sortRows(filteredEvents, eventSort, {
      title: (event) => event.title,
      eventDate: (event) => new Date(event.eventDate),
      location: (event) => event.location,
      status: (event) => event.status,
    });
  }, [events, eventSearch, eventSort]);

  const visibleParticipants = React.useMemo(() => {
    const filteredParticipants = filterRows(participants, participantSearch, [
      (participant) => participant.user.name,
      (participant) => participant.user.email,
      (participant) => (participant.attended ? "marked" : "pending"),
      (participant) => new Date(participant.registeredAt).toLocaleString(),
    ]);

    return sortRows(filteredParticipants, participantSort, {
      name: (participant) => participant.user.name,
      email: (participant) => participant.user.email,
      registeredAt: (participant) => new Date(participant.registeredAt),
      attended: (participant) => participant.attended,
    });
  }, [participants, participantSearch, participantSort]);

  const columns: ColumnDef<UserEvent>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "eventDate",
      header: "Date",
      cell: ({ row }) => {
        return new Date(row.getValue("eventDate")).toLocaleString();
      },
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      size: 10,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                aria-label="Open event actions"
              >
                <IoEllipsisHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={"ghost"} className="w-full justify-start">
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Event</DialogTitle>
                  </DialogHeader>
                  <EventForm
                    onUpdate={() => fetchEvents()}
                    value={row.original as EventUpdate}
                    update
                  />
                </DialogContent>
              </Dialog>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  void openParticipantsDialog(row.original);
                }}
              >
                Participants
              </DropdownMenuItem>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={"ghost"} className="w-full justify-start">
                    Attendance
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Event Attendance</DialogTitle>
                    <DialogDescription>
                      Use Mobile Browser to access web cam and scan QR
                      Codes{" "}
                    </DialogDescription>
                  </DialogHeader>
                  <Scanner
                    onScan={async (result) => {
                      const id = result.at(0)?.rawValue;
                      if (!id) {
                        toast.error("Failed to scan!");
                        return;
                      }
                      const setted = await setAttended(id);
                      if (setted) {
                        toast.success("Marked Attendance!");
                      } else {
                        toast.error("Failed to mark Attendance!");
                      }
                    }}
                    onError={(error) => console.log(error?.message)}
                  />
                </DialogContent>
              </Dialog>
              <DropdownMenuItem
                variant={"destructive"}
                onClick={async () => {
                  const canceled = await cancelEvent(row.original.id);
                  if (canceled) {
                    fetchEvents();
                  }
                }}
              >
                Cancel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: visibleEvents,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  return (
    <div className="bg-background flex-1 flex flex-col space-y-4 items-stretch p-4">
      <h2 className="font-bold text-3xl">Events</h2>
      <Card className=" md:mx-20">
        <CardContent>
          {status !== "IDLE" ? (
            <Skeleton className="bg-gray-300 h-full w-full" />
          ) : events.length === 0 ? (
            <Empty className="w-full h-full">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MdEmojiEvents />
                </EmptyMedia>
                <EmptyTitle>No Registrations Yet</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t registered to any Events yet. Get started by
                  registering your first event.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="flex-row justify-center gap-2">
                <Button>
                  <a href={"/events"}>Go to events</a>
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <>
              <DataTableToolbar
                searchValue={eventSearch}
                onSearchValueChange={setEventSearch}
                searchPlaceholder="Search events..."
                currentSortFieldLabel={
                  eventSort
                    ? {
                        title: "Title",
                        eventDate: "Date",
                        location: "Location",
                        status: "Status",
                      }[eventSort.field]
                    : undefined
                }
                currentSortDirection={eventSort?.direction}
                sortOptions={[
                  { field: "title", label: "Title" },
                  { field: "eventDate", label: "Date" },
                  { field: "location", label: "Location" },
                  { field: "status", label: "Status" },
                ]}
                onSortFieldChange={(field) =>
                  setEventSort({
                    field,
                    direction: eventSort?.direction ?? "asc",
                  })
                }
                onSortDirectionChange={(direction) =>
                  setEventSort({
                    field: eventSort?.field ?? "eventDate",
                    direction,
                  })
                }
                onClearSort={() => setEventSort(null)}
              />
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
      <Dialog
        open={participantDialogOpen}
        onOpenChange={setParticipantDialogOpen}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Participants{selectedEvent ? ` - ${selectedEvent.title}` : ""}
            </DialogTitle>
            <DialogDescription>
              People registered for this event, sorted by registration time.
            </DialogDescription>
          </DialogHeader>
          {participantsLoading ? (
            <div className="space-y-3 py-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : participants.length === 0 ? (
            <Empty className="py-10">
              <EmptyHeader>
                <EmptyTitle>No participants yet</EmptyTitle>
                <EmptyDescription>
                  Nobody has registered for this event yet.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              <DataTableToolbar
                searchValue={participantSearch}
                onSearchValueChange={setParticipantSearch}
                searchPlaceholder="Search participants..."
                currentSortFieldLabel={
                  participantSort
                    ? {
                        name: "Name",
                        email: "Email",
                        registeredAt: "Registered",
                        attended: "Attendance",
                      }[participantSort.field]
                    : undefined
                }
                currentSortDirection={participantSort?.direction}
                sortOptions={[
                  { field: "name", label: "Name" },
                  { field: "email", label: "Email" },
                  { field: "registeredAt", label: "Registered" },
                  { field: "attended", label: "Attendance" },
                ]}
                onSortFieldChange={(field) =>
                  setParticipantSort({
                    field,
                    direction: participantSort?.direction ?? "asc",
                  })
                }
                onSortDirectionChange={(direction) =>
                  setParticipantSort({
                    field: participantSort?.field ?? "registeredAt",
                    direction,
                  })
                }
                onClearSort={() => setParticipantSort(null)}
              />
              <ScrollArea className="max-h-[60vh] rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleParticipants.length ? (
                      visibleParticipants.map((participant) => (
                        <TableRow key={participant.id}>
                          <TableCell className="font-medium">
                            {participant.user.name}
                          </TableCell>
                          <TableCell>{participant.user.email}</TableCell>
                          <TableCell>
                            {new Date(
                              participant.registeredAt,
                            ).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {participant.attended ? "Marked" : "Pending"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
