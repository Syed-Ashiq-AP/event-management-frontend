import { authClient } from "@/lib/providers";
import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;
type UserContext = {
  user?: User;
  getRegistrations: () => Promise<UserRegistration[]>;
  getEvents: () => Promise<UserEvent[]>;
  getEventParticipants: (eventId: string) => Promise<UserEventParticipant[]>;
  getAnalytics: () => Promise<{
    eventsCount: 0;
    registrationsCount: 0;
    attendanceCount: 0;
  } | null>;
  createEvent: (value: EventForm) => Promise<boolean>;
  cancelEvent: (eventId: string) => Promise<boolean>;
  updateEvent: (value: EventUpdate) => Promise<boolean>;
  registerEvent: (eventId: string) => Promise<boolean>;
  setAttended: (registerId: string) => Promise<boolean>;
  getCertificates: () => Promise<UserCertificate[]>;
  logOut: () => Promise<void>;
  getUser: () => Promise<void>;
  status: APIStatus;
};

type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
  role?: "PARTICIPANT" | "ORGANIZER";
};

const userContext = createContext<UserContext | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const didMount = useRef(false);

  const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
  });

  const [user, setUser] = useState<User | undefined>(undefined);

  const [status, setStatus] = useState<APIStatus>("IDLE");

  const getRegistrations = useCallback(async () => {
    setStatus("LOADING");
    const { data } = await api.get(`${API_URL}/registrations`);
    if (data.success) {
      setStatus("IDLE");
      return data.registrations as UserRegistration[];
    } else {
      toast(data.error);
      setStatus("IDLE");
      return [] as UserRegistration[];
    }
  }, [user]);

  const getEvents = useCallback(async () => {
    setStatus("LOADING");
    const { data } = await api.get(`${API_URL}/events`);
    if (data.success) {
      setStatus("IDLE");
      return data.events as UserEvent[];
    } else {
      toast(data.error);
      setStatus("IDLE");
      return [] as UserEvent[];
    }
  }, [user]);

  const getEventParticipants = useCallback(
    async (eventId: string) => {
      const { data } = await api.get(
        `${API_URL}/events/${eventId}/participants`,
      );
      if (data.success) {
        return data.participants as UserEventParticipant[];
      } else {
        toast(data.error);
        return [] as UserEventParticipant[];
      }
    },
    [user],
  );

  const getAnalytics = useCallback(async () => {
    setStatus("LOADING");
    const { data } = await api.get(`${API_URL}/analytics`);
    if (data.success) {
      setStatus("IDLE");
      return data.analytics;
    } else {
      toast(data.error);
      setStatus("IDLE");
      return null;
    }
  }, [user]);

  const createEvent = useCallback(
    async (value: EventForm) => {
      if (!user) return;
      setStatus("LOADING");
      try {
        const { data } = await api.post(`${API_URL}/events`, {
          userId: user.id,
          ...value,
        });
        if (!data.success) {
          toast(data.error ?? "Failed to create event");
        }
        return data.success;
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.error
          : undefined;
        toast(
          message === "EVENT_ALREADY_EXISTS"
            ? "An event with the same title, date, and location already exists."
            : "Failed to create event",
        );
        return false;
      } finally {
        setStatus("IDLE");
      }
    },
    [user],
  );

  const cancelEvent = useCallback(
    async (eventId: string) => {
      if (!user) return;
      setStatus("LOADING");
      const { data } = await api.delete(`${API_URL}/events/${eventId}`);
      setStatus("IDLE");
      return data.success;
    },
    [user],
  );

  const updateEvent = useCallback(
    async (value: EventUpdate) => {
      if (!user) return;
      setStatus("LOADING");
      try {
        const { id: _, ...formValue } = value;
        const { data } = await api.put(
          `${API_URL}/events/${value.id}`,
          formValue,
        );
        if (!data.success) {
          toast(data.error ?? "Failed to update event");
        }
        return data.success;
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.error
          : undefined;
        toast(
          message === "EVENT_ALREADY_EXISTS"
            ? "An event with the same title, date, and location already exists."
            : "Failed to update event",
        );
        return false;
      } finally {
        setStatus("IDLE");
      }
    },
    [user],
  );

  const registerEvent = useCallback(
    async (eventId: string) => {
      if (!user) return;
      setStatus("LOADING");
      const { data } = await api.post(`${API_URL}/events/${eventId}`);
      setStatus("IDLE");
      return data.success;
    },
    [user],
  );

  const setAttended = useCallback(
    async (registerId: string) => {
      if (!user) return;
      setStatus("LOADING");
      const { data } = await api.put(`${API_URL}/registrations/${registerId}`);
      setStatus("IDLE");
      return data.success;
    },
    [user],
  );

  const getCertificates = useCallback(async () => {
    setStatus("LOADING");
    const { data } = await api.get(`${API_URL}/certificates`);
    if (data.success) {
      setStatus("IDLE");
      return data.certificates as UserCertificate[];
    } else {
      toast(data.error);
      setStatus("IDLE");
      return [] as UserCertificate[];
    }
  }, [user]);
  const getUser = async () => {
    const { data } = await authClient.getSession();
    if (data && data.user) {
      const userData = data.user as User;
      if (!userData.role) {
        setStatus("SETTING_UP");
        toast.info("Setting up your account, pleast wait!");
        const userRole = localStorage.getItem("user-role") as User["role"];

        const { data } = await api.put(`${API_URL}/set-up`, {
          id: userData.id,
          role: userRole ?? "PARTICIPANT",
        });
        if (data.success) {
          setUser(data.user);
          localStorage.removeItem("user-role");
        }
      } else {
        setUser(userData);
      }
    } else if (!["/sign-in", "/sign-up"].includes(pathname)) {
      navigate("/sign-in");
    }
    setStatus("IDLE");
  };
  const logOut = async () => {
    setStatus("LOADING");
    const logout = await authClient.signOut();
    if (logout.data && logout.data.success) {
      location.reload();
    }
  };

  useEffect(() => {
    if (didMount.current) return;
    setStatus("LOADING");

    if (!pathname.includes("error")) {
      getUser();
    } else {
      setStatus("IDLE");
    }

    didMount.current = true;
  }, []);

  const value = useMemo(
    () => ({
      user,
      getRegistrations,
      getEvents,
      getEventParticipants,
      getAnalytics,
      createEvent,
      cancelEvent,
      updateEvent,
      registerEvent,
      setAttended,
      getCertificates,
      logOut,
      getUser,
      status,
    }),
    [
      getRegistrations,
      getEvents,
      getEventParticipants,
      getAnalytics,
      createEvent,
      cancelEvent,
      updateEvent,
      logOut,
      registerEvent,
      setAttended,
      getCertificates,
      getUser,
      user,
      status,
    ],
  );
  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};

export const useUser = () => {
  const usercontext = useContext(userContext);
  if (usercontext === undefined) return {} as UserContext;
  if (!useContext) {
    throw Error("userProvider not used");
  }
  return usercontext;
};
