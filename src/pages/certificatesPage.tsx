import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-user";
import { DataTableToolbar } from "@/components/data-table-toolbar";
import { filterRows, sortRows, type SortConfig } from "@/lib/data-table";
import { downloadCertificate } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

export const CertificatesPage = () => {
  const { user, getCertificates, status } = useUser();

  const didMount = useRef(false);
  const [certificates, setCertificates] = useState<UserCertificate[]>([]);
  const [certificateSearch, setCertificateSearch] = useState("");
  const [certificateSort, setCertificateSort] = useState<SortConfig>({
    field: "eventDate",
    direction: "desc",
  });

  const fetchCertificates = async () => {
    const certs = await getCertificates();
    setCertificates(certs);
  };
  useEffect(() => {
    if (didMount.current) return;
    fetchCertificates();
    didMount.current = true;
  }, []);

  const visibleCertificates = useMemo(() => {
    const filteredCertificates = filterRows(certificates, certificateSearch, [
      (certificate) => certificate.event.title,
      (certificate) => certificate.event.location,
      (certificate) => certificate.event.description ?? "",
      (certificate) => new Date(certificate.event.eventDate).toLocaleString(),
      (certificate) => certificate.event.status,
    ]);

    return sortRows(filteredCertificates, certificateSort, {
      title: (certificate) => certificate.event.title,
      eventDate: (certificate) => new Date(certificate.event.eventDate),
      location: (certificate) => certificate.event.location,
      status: (certificate) => certificate.event.status,
    });
  }, [certificates, certificateSearch, certificateSort]);

  return (
    <div className="bg-background flex-1 flex flex-col space-y-4 items-stretch p-4">
      <h2 className="font-bold text-3xl">My Certificates</h2>
      <div className="px-2">
        <DataTableToolbar
          searchValue={certificateSearch}
          onSearchValueChange={setCertificateSearch}
          searchPlaceholder="Search certificates..."
          currentSortFieldLabel={
            certificateSort
              ? {
                  title: "Title",
                  eventDate: "Date",
                  location: "Location",
                  status: "Status",
                }[certificateSort.field]
              : undefined
          }
          currentSortDirection={certificateSort?.direction}
          sortOptions={[
            { field: "title", label: "Title" },
            { field: "eventDate", label: "Date" },
            { field: "location", label: "Location" },
            { field: "status", label: "Status" },
          ]}
          onSortFieldChange={(field) =>
            setCertificateSort({
              field,
              direction: certificateSort?.direction ?? "asc",
            })
          }
          onSortDirectionChange={(direction) =>
            setCertificateSort({
              field: certificateSort?.field ?? "eventDate",
              direction,
            })
          }
          onClearSort={() => setCertificateSort(null)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
        {!user || status !== "IDLE"
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton className="w-full h-16 bg-gray-300" key={i} />
            ))
          : visibleCertificates.length === 0 ? (
              <div className="col-span-full rounded-md border p-6 text-center text-sm text-muted-foreground">
                No results.
              </div>
            ) : visibleCertificates.map((certificate, i) => {
              const { event } = certificate;
              const eventDate = new Date(event.eventDate).toLocaleString();
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
                      <Button
                        size={"lg"}
                        onClick={() => downloadCertificate(user, certificate)}
                      >
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>
    </div>
  );
};
