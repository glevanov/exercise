import { act, render } from "@testing-library/preact";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CountdownTimer } from "./countdown-timer";

describe("CountdownTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("renders with the initial time formatted", () => {
    const { getByText } = render(<CountdownTimer seconds={63} />);
    expect(getByText("01:03")).toBeInTheDocument();
  });

  it("counts down each second", () => {
    const { getByText } = render(<CountdownTimer seconds={3} />);
    expect(getByText("00:03")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(getByText("00:02")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(getByText("00:01")).toBeInTheDocument();
  });

  it("stops at 0 and clears the interval", () => {
    const { getByText } = render(<CountdownTimer seconds={3} />);

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(getByText("00:01")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(getByText("00:00")).toBeInTheDocument();
  });

  it("cleans up interval on unmount", () => {
    const clearIntervalSpy = vi.spyOn(global, "clearInterval");

    const { unmount } = render(<CountdownTimer seconds={60} />);
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
