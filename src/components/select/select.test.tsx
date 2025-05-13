import { render, fireEvent } from "@testing-library/preact";
import { Select } from "./select";
import { vi, describe, it, expect } from "vitest";

describe("Select", () => {
  const options = [
    { value: "walls", label: "Walls" },
    { value: "roof", label: "Roof" },
    { value: "floor", label: "Floor" },
    { value: "door", label: "Door" },
  ];

  it("renders all options and applies the selected value", () => {
    const { getByRole, getByText } = render(
      <Select value="walls" options={options} onChange={() => {}} />,
    );

    const select = getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("walls");

    options.forEach(({ label }) => {
      expect(getByText(label)).toBeInTheDocument();
    });
  });

  it("calls onChange when a different option is selected", () => {
    const handleChange = vi.fn();
    const { getByRole } = render(
      <Select value="roof" options={options} onChange={handleChange} />,
    );

    const select = getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "door" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(select.value).toBe("door");
  });
});
