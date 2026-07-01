import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OverviewPage } from "./overviewPage";

const getAnalytics = vi.fn();

vi.mock("@/hooks/use-user", () => ({
  useUser: () => ({
    status: "IDLE",
    getAnalytics,
  }),
}));

describe("OverviewPage", () => {
  it("renders organizer analytics", async () => {
    getAnalytics.mockResolvedValue({
      eventsCount: 3,
      registrationsCount: 12,
      attendanceCount: 8,
    });

    render(<OverviewPage />);

    expect(screen.getByText(/events overview/i)).toBeTruthy();
    expect(await screen.findByText("3")).toBeTruthy();
    expect(screen.getByText("12")).toBeTruthy();
    expect(screen.getByText("8")).toBeTruthy();
  });
});
