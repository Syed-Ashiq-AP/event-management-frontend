import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Header } from "./header";

let currentUser: { role: "PARTICIPANT" | "ORGANIZER"; name: string } | undefined;

vi.mock("@/hooks/use-user", () => ({
  useUser: () => ({
    user: currentUser,
    status: "IDLE",
    logOut: vi.fn(),
  }),
}));

describe("Header", () => {
  beforeEach(() => {
    currentUser = undefined;
  });

  it("shows participant navigation", () => {
    currentUser = { role: "PARTICIPANT", name: "Test User" };

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /my registrations/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /^events$/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /my certificates/i })).toBeTruthy();
  });

  it("shows organizer navigation", () => {
    currentUser = { role: "ORGANIZER", name: "Test User" };

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /dashboard/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /my events/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /organize event/i })).toBeTruthy();
  });
});
