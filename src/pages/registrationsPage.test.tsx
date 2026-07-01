import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RegistrationsPage } from "./registationsPage";

const getRegistrations = vi.fn();

const registration = {
  id: "registration-1",
  registeredAt: new Date("2026-01-02T00:00:00.000Z"),
  attended: false,
  userId: "user-1",
  eventId: "event-1",
  event: {
    id: "event-1",
    userId: "organizer-1",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    title: "React Basics",
    description: "Learn React fundamentals.",
    location: "Room 101",
    status: "OPEN",
    eventDate: new Date("2026-09-15T14:00:00.000Z"),
  },
} satisfies UserRegistration;

vi.mock("@/hooks/use-user", () => ({
  useUser: () => ({
    user: { id: "user-1", role: "PARTICIPANT" },
    status: "IDLE",
    getRegistrations,
    cancelEvent: vi.fn(),
  }),
}));

describe("RegistrationsPage", () => {
  it("renders the participant's registrations", async () => {
    getRegistrations.mockResolvedValue([registration]);

    render(<RegistrationsPage />);

    expect(await screen.findByText("React Basics")).toBeTruthy();
    expect(screen.getByText("Room 101")).toBeTruthy();
    expect(screen.getByText("OPEN")).toBeTruthy();
  });
});
