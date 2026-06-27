type Status = "OPEN" | "CLOSED" | "IN_PROGRESS" | "COMPLETED";

type UserEvent = {
  id: string;
  createdAt: Date;
  title: string;
  description: string;
  location: string;
  status: Status;
  eventDate: string;
  userId: string;
  registrations: { id: string }[];
};

type EventForm = {
  title: string;
  description: string;
  location: string;
  status: Status;
  eventDate: string;
};

type EventUpdate = {
  id: string;
  createdAt: Date;
  title: string;
  description: string;
  location: string;
  status: Status;
  eventDate: string;
  userId: string;
};

type UserRegistration = {
  event: {
    id: string;
    userId: string;
    createdAt: Date;
    title: string;
    description: string | null;
    location: string;
    status: Status;
    eventDate: Date;
  };
  id: string;
  registeredAt: Date;
  attended: boolean;
  userId: string;
  eventId: string;
};

type UserCertificate = {
  event: {
    id: string;
    userId: string;
    createdAt: Date;
    title: string;
    description: string | null;
    location: string;
    status: Status;
    eventDate: Date;
    user: {
      name: string;
    };
  };
  id: string;
  registeredAt: Date;
  attended: boolean;
  userId: string;
  eventId: string;
};

type APIStatus = "IDLE" | "SETTING_UP" | "LOADING";
