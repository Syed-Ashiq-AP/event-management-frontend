import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OrganizePage } from "./organizePage";

const createEvent = vi.fn();

vi.mock("@/hooks/use-user", () => ({
  useUser: () => ({
    createEvent,
  }),
}));

describe("OrganizePage", () => {
  it("creates an event from the form", async () => {
    createEvent.mockResolvedValue(true);
    const user = userEvent.setup();

    render(<OrganizePage />);

    await user.type(screen.getByLabelText(/title/i), "Tech Meetup");
    await user.type(
      screen.getByLabelText(/description/i),
      "A practical frontend testing workshop.",
    );
    await user.type(screen.getByLabelText(/location/i), "Main Hall");
    await user.click(screen.getByRole("button", { name: /^organize event$/i }));

    await waitFor(() => {
      expect(createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Tech Meetup",
          description: "A practical frontend testing workshop.",
          location: "Main Hall",
          status: "OPEN",
        }),
      );
    });
  });
});
