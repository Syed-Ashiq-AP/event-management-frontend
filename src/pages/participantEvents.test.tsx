import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ParticipantEvents } from "./participantEvents";

const getEvents = vi.fn();
const registerEvent = vi.fn();

const event = {
  id: "event-1",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  title: "Campus Hackathon",
  description: "Build in a weekend.",
  location: "Main Hall",
  status: "OPEN",
  eventDate: "2026-08-20T10:00:00.000Z",
  userId: "user-1",
  registrations: [],
} satisfies UserEvent;

vi.mock("@/hooks/use-user", () => ({
  useUser: () => ({
    status: "IDLE",
    getEvents,
    registerEvent,
  }),
}));

describe("ParticipantEvents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getEvents.mockResolvedValue([event]);
  });

  it("renders search and sort controls with participant events", async () => {
    render(
      <MemoryRouter>
        <ParticipantEvents />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Campus Hackathon")).toBeTruthy();
    expect(screen.getByPlaceholderText(/search events/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /date/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /asc/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /desc/i })).toBeTruthy();
  });
});
