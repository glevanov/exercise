import { describe, expect, it } from "vitest";

import { formatTime } from "./format-time";

describe("formatTime", () => {
  it("formats 0 seconds", () => {
    expect(formatTime(0)).toBe("00:00");
  });

  it("formats seconds less than 10 with leading zero", () => {
    expect(formatTime(1)).toBe("00:01");
    expect(formatTime(5)).toBe("00:05");
    expect(formatTime(7)).toBe("00:07");
  });

  it("formats seconds between 10 and 59", () => {
    expect(formatTime(13)).toBe("00:13");
    expect(formatTime(45)).toBe("00:45");
    expect(formatTime(59)).toBe("00:59");
  });

  it("formats 1 minute", () => {
    expect(formatTime(60)).toBe("01:00");
  });

  it("formats values longer than 1 minute", () => {
    expect(formatTime(125)).toBe("02:05");
    expect(formatTime(659)).toBe("10:59");
    expect(formatTime(3600)).toBe("60:00");
  });
});
