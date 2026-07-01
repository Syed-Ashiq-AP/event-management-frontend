import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EventsPage } from "./eventsPage";

const getEvents = vi.fn();
const registerEvent = vi.fn();
let currentUser: { role: "PARTICIPANT" | "ORGANIZER" } | undefined;

const event = {
  id: "event-1",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  title: "Frontend Testing Day",
  description: "Learn how to test React apps.",
  location: "Auditorium",
  status: "OPEN",
  eventDate: "2026-08-20T10:00:00.000Z",
  userId: "user-1",
  registrations: [],
} satisfies UserEvent;

vi.mock("@yudiel/react-qr-scanner", () => ({
  Scanner: () => <div>QR scanner</div>,
}));

vi.mock("@/hooks/use-user", () => ({
  useUser: () => ({
    user: currentUser,
    status: "IDLE",
    getEvents,
    registerEvent,
    cancelEvent: vi.fn(),
    setAttended: vi.fn(),
  }),
}));

describe("EventsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getEvents.mockResolvedValue([event]);
    currentUser = undefined;
  });

  it("shows participant event cards", async () => {
    currentUser = { role: "PARTICIPANT" };

    render(
      <MemoryRouter>
        <EventsPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Frontend Testing Day")).toBeTruthy();
    expect(screen.getByText(/auditorium/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /view/i })).toBeTruthy();
  });

  it("shows organizer events in a table", async () => {
    currentUser = { role: "ORGANIZER" };

    render(
      <MemoryRouter>
        <EventsPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Frontend Testing Day")).toBeTruthy();
    await waitFor(() => expect(getEvents).toHaveBeenCalled());
    expect(screen.getByRole("columnheader", { name: /title/i })).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: /status/i })).toBeTruthy();
  });
});
