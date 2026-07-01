import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("@/lib/providers", () => ({
  authClient: {
    getSession: vi.fn().mockResolvedValue({ data: null }),
    signOut: vi.fn().mockResolvedValue({ data: { success: true } }),
  },
  handleGithub: vi.fn(),
  handleGoogle: vi.fn(),
}));

describe("App", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
  });

  it("redirects unauthenticated users to the login page", async () => {
    render(<App />);

    expect(await screen.findByText(/welcome back/i)).toBeTruthy();
  });
});
