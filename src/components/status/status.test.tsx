import { render } from "@testing-library/preact";
import { describe, it, expect } from "vitest";

import { Status } from "./status";

describe("Status", () => {
  it("renders the status text", () => {
    const { getByText } = render(<Status text="Snakes on a Plane" />);
    expect(getByText("Snakes on a Plane", { exact: false })).not.toBeNull();
  });
});
