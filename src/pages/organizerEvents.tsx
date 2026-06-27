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
import { IoEllipsisHorizontal } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EventForm } from "@/components/forms/event";
import { Scanner } from "@yudiel/react-qr-scanner";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { MdEmojiEvents } from "react-icons/md";

export const OrganizerEvents = () => {
  const { getEvents, cancelEvent, setAttended, status } = useUser();
  const didMount = useRef(false);

  const [events, setEvents] = useState<UserEvent[]>([]);

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
              <Button variant="ghost" className="h-8 w-8 p-0">
                <IoEllipsisHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={"ghost"} className="w-full  justify-start">
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={"ghost"} className="w-full  justify-start">
                    Attendance
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Event Attendance</DialogTitle>
                  </DialogHeader>
                  <Scanner
                    onScan={async (result) => {
                      const id = result.at(0)?.format;
                      console.log(id);
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
    data: events,
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};
