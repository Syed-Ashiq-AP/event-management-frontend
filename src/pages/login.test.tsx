import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginPage } from "./login";

const getUser = vi.fn();

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock("@/hooks/use-user", () => ({
  useUser: () => ({
    getUser,
  }),
}));

vi.mock("@/lib/providers", () => ({
  handleGithub: vi.fn(),
  handleGoogle: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the available login methods", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/welcome back/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /login with github/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /login with google/i })).toBeTruthy();
    expect(screen.getByLabelText(/email/i)).toBeTruthy();
    expect(screen.getByLabelText(/password/i)).toBeTruthy();
  });

  it("submits email credentials and refreshes the current user", async () => {
    vi.mocked(axios.post).mockResolvedValue({ status: 200 });
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/email/i), "person@example.com");
    await user.type(screen.getByLabelText(/password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /^log in$/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/auth/sign-in/email"),
        {
          email: "person@example.com",
          password: "secret123",
        },
        { withCredentials: true },
      );
    });
    expect(getUser).toHaveBeenCalled();
  });
});
