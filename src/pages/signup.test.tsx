import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SignUpPage } from "./signup";
import { handleGithub } from "@/lib/providers";

vi.mock("@/hooks/use-user", () => ({
  useUser: () => ({
    getUser: vi.fn(),
  }),
}));

vi.mock("@/lib/providers", () => ({
  handleGithub: vi.fn(),
  handleGoogle: vi.fn(),
}));

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("SignUpPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders account fields and social sign-up actions", () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/welcome/i)).toBeTruthy();
    expect(screen.getByLabelText(/user role/i)).toBeTruthy();
    expect(screen.getByLabelText(/^name$/i)).toBeTruthy();
    expect(screen.getByLabelText(/email/i)).toBeTruthy();
    expect(screen.getByLabelText(/password/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /sign up with github/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /sign up with google/i })).toBeTruthy();
  });

  it("stores the selected role before GitHub sign-up", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByLabelText(/user role/i));
    await user.click(await screen.findByText("Organizer"));
    await user.click(screen.getByRole("button", { name: /sign up with github/i }));

    expect(localStorage.getItem("user-role")).toBe("ORGANIZER");
    expect(handleGithub).toHaveBeenCalledWith(true);
  });
});
