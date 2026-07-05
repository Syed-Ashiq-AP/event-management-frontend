import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/hooks/use-user";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import React, { useEffect, useRef, useState } from "react";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { MdEmojiEvents } from "react-icons/md";
import QRCode from "react-qr-code";
import {
  filterRows,
  getSortLabel,
  sortRows,
  type SortConfig,
} from "@/lib/data-table";
import { toast } from "sonner";

export const RegistrationsPage = () => {
  const { getRegistrations, cancelEvent, user, status } = useUser();

  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [registrationSearch, setRegistrationSearch] = useState("");
  const [registrationSort, setRegistrationSort] = useState<SortConfig>({
    field: "eventDate",
    direction: "desc",
  });

  const didMount = useRef(false);

  const fetchRegistrations = async () => {
    const regs = await getRegistrations();
    setRegistrations(regs);
  };

  useEffect(() => {
    if (!user) return;
    if (didMount.current) return;
    fetchRegistrations();
    didMount.current = true;
  }, [user]);

  const visibleRegistrations = React.useMemo(() => {
    const filteredRegistrations = filterRows(
      registrations,
      registrationSearch,
      [
        (registration) => registration.event.title,
        (registration) => registration.event.location,
        (registration) => registration.event.status,
        (registration) =>
          new Date(registration.event.eventDate).toLocaleString(),
        (registration) => registration.event.description ?? "",
      ],
    );

    return sortRows(filteredRegistrations, registrationSort, {
      title: (registration) => registration.event.title,
      eventDate: (registration) => new Date(registration.event.eventDate),
      location: (registration) => registration.event.location,
      status: (registration) => registration.event.status,
    });
  }, [registrations, registrationSearch, registrationSort]);

  const columns: ColumnDef<UserRegistration>[] = [
    {
      accessorKey: "event.title",
      header: "Title",
    },
    {
      accessorKey: "event.eventDate",
      header: "Date",
      cell: ({ row }) => {
        return new Date(row.original.event.eventDate).toLocaleString();
      },
    },
    {
      accessorKey: "event.location",
      header: "Location",
    },
    {
      accessorKey: "event.status",
      header: "Status",
    },
    {
      id: "actions",
      size: 10,
      cell: ({ row }) => {
        const event = row.original.event;
        const eventDate = new Date(event.eventDate).toLocaleString();
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
                    Details
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
                    <DialogTitle>{event.title}</DialogTitle>
                    <DialogDescription>
                      Scan the QR Code to verify your attendance
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col space-y-4">
                    <QRCode value={row.original.id} />
                  </div>
                </DialogContent>
              </Dialog>
              <DropdownMenuItem
                variant={"destructive"}
                onClick={async () => {
                  const cancelled = await cancelEvent(row.original.id);
                  if (cancelled) {
                    fetchRegistrations();
                    toast.success("Registration was successfully cancelled!");
                    return;
                  }
                  toast.error("Failed to cancel registration!");
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
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: visibleRegistrations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  return (
    <div className="w-full h-full flex-1 bg-background">
      {status !== "IDLE" ? (
        <Skeleton className="bg-gray-300 h-full w-full" />
      ) : registrations.length === 0 ? (
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
        <div className="bg-background flex-1 flex flex-col space-y-4 items-stretch p-4">
          <h2 className="font-bold text-3xl">Registrations</h2>
          <Card className=" md:mx-20">
            <CardContent>
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <Input
                  value={registrationSearch}
                  onChange={(event) =>
                    setRegistrationSearch(event.target.value)
                  }
                  placeholder="Search registrations..."
                  className="md:max-w-sm"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-between md:min-w-40"
                    >
                      {getSortLabel(registrationSort, {
                        title: "Title",
                        eventDate: "Date",
                        location: "Location",
                        status: "Status",
                      })}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuItem
                      onSelect={() =>
                        setRegistrationSort({
                          field: "title",
                          direction: "asc",
                        })
                      }
                    >
                      Title Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() =>
                        setRegistrationSort({
                          field: "title",
                          direction: "desc",
                        })
                      }
                    >
                      Title Desc
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() =>
                        setRegistrationSort({
                          field: "eventDate",
                          direction: "asc",
                        })
                      }
                    >
                      Date Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() =>
                        setRegistrationSort({
                          field: "eventDate",
                          direction: "desc",
                        })
                      }
                    >
                      Date Desc
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() =>
                        setRegistrationSort({
                          field: "location",
                          direction: "asc",
                        })
                      }
                    >
                      Location Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() =>
                        setRegistrationSort({
                          field: "location",
                          direction: "desc",
                        })
                      }
                    >
                      Location Desc
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() =>
                        setRegistrationSort({
                          field: "status",
                          direction: "asc",
                        })
                      }
                    >
                      Status Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() =>
                        setRegistrationSort({
                          field: "status",
                          direction: "desc",
                        })
                      }
                    >
                      Status Desc
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setRegistrationSort(null)}
                    >
                      Clear sort
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
