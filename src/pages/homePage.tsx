import { useUser } from "@/hooks/use-user";
import { RegistrationsPage } from "./registationsPage";
import { OverviewPage } from "./overviewPage";

export const HomePage = () => {
  const { user } = useUser();

  if (!user || !user.role) return;
  if (user.role === "PARTICIPANT") return <RegistrationsPage />;
  if (user.role === "ORGANIZER") return <OverviewPage />;
};
