import { fireEvent, render } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";

import { StartButton } from "./start-button";

describe("StartButton", () => {
  it("renders in start state by default", () => {
    const handleClick = vi.fn();
    const { getByRole } = render(
      <StartButton handleClick={handleClick} shouldStop={false} />,
    );

    const button = getByRole("button");
    expect(button).toHaveTextContent("Start");
  });

  it("renders in stop state when shouldStop is true", () => {
    const handleClick = vi.fn();
    const { getByRole } = render(
      <StartButton handleClick={handleClick} shouldStop={true} />,
    );

    const button = getByRole("button");
    expect(button).toHaveTextContent("Stop");
  });

  it("calls handleClick when clicked", () => {
    const handleClick = vi.fn();
    const { getByRole } = render(
      <StartButton handleClick={handleClick} shouldStop={false} />,
    );

    const button = getByRole("button");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
