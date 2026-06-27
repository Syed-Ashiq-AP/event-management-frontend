import { useUser } from "@/hooks/use-user";
import { OrganizerEvents } from "./organizerEvents";
import { ParticipantEvents } from "./participantEvents";

export const EventsPage = () => {
  const { user } = useUser();

  if (!user || !user.role) return;

  if (user.role === "ORGANIZER") return <OrganizerEvents />;
  if (user.role === "PARTICIPANT") return <ParticipantEvents />;
};
