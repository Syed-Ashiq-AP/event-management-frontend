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

export const RegistrationsPage = () => {
  const { getRegistrations, cancelEvent, user, status } = useUser();

  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);

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
                  const canceled = await cancelEvent(row.original.id);
                  if (canceled) {
                    fetchRegistrations();
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
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: registrations,
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
          <h2 className="font-bold text-3xl">Events</h2>
          <Card className=" mx-20">
            <CardContent>
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
