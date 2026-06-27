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
import { downloadCertificate } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export const CertificatesPage = () => {
  const { user, getCertificates, status } = useUser();

  const didMount = useRef(false);
  const [certificates, setCertificates] = useState<UserCertificate[]>([]);

  const fetchCertificates = async () => {
    const certs = await getCertificates();
    setCertificates(certs);
  };
  useEffect(() => {
    if (didMount.current) return;
    fetchCertificates();
    didMount.current = true;
  }, []);

  return (
    <div className="bg-background flex-1 flex flex-col space-y-4 items-stretch p-4">
      <h2 className="font-bold text-3xl">My Certificates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
        {!user || status !== "IDLE"
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton className="w-full h-16 bg-gray-300" key={i} />
            ))
          : certificates.map((certificate, i) => {
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
