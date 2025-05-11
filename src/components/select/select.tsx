import type { JSX } from "preact";

import styles from "./select.module.css";

type OptionValue = string | number;

interface SelectProps<Value extends OptionValue> {
  value: Value;
  options: {
    value: Value;
    label: string;
  }[];
  onChange: JSX.GenericEventHandler<HTMLSelectElement>;
}
export const Select = <Value extends OptionValue>({
  value,
  options,
  onChange,
}: SelectProps<Value>) => {
  return (
    <select value={value} onChange={onChange} className={styles.select}>
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
