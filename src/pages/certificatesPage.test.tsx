import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CertificatesPage } from "./certificatesPage";

const getCertificates = vi.fn();

const certificate = {
  id: "certificate-1",
  registeredAt: new Date("2026-02-01T00:00:00.000Z"),
  attended: true,
  userId: "user-1",
  eventId: "event-1",
  event: {
    id: "event-1",
    userId: "organizer-1",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    title: "Testing Masterclass",
    description: "Advanced testing patterns.",
    location: "Conference Hall",
    status: "COMPLETED",
    eventDate: new Date("2026-10-05T09:00:00.000Z"),
    user: {
      name: "Organizer Name",
    },
  },
} satisfies UserCertificate;

vi.mock("@/hooks/use-user", () => ({
  useUser: () => ({
    user: { id: "user-1", name: "Test User", role: "PARTICIPANT" },
    status: "IDLE",
    getCertificates,
  }),
}));

vi.mock("@/lib/utils", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/utils")>("@/lib/utils");

  return {
    ...actual,
    downloadCertificate: vi.fn(),
  };
});

describe("CertificatesPage", () => {
  it("renders certificates available to the user", async () => {
    getCertificates.mockResolvedValue([certificate]);

    render(<CertificatesPage />);

    expect(screen.getByText(/my certificates/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/search certificates/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /date/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /asc/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /desc/i })).toBeTruthy();
    expect(await screen.findByText("Testing Masterclass")).toBeTruthy();
    expect(screen.getByText(/conference hall/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /download/i })).toBeTruthy();
  });
});
