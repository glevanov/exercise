import { JSX } from "preact";
import cn from "classnames";

import styles from "./status.module.css";

interface StatusProps extends JSX.HTMLAttributes<HTMLParagraphElement> {
  text: string;
}

export const Status = ({ text, className }: StatusProps) => {
  return (
    <p className={cn(className, styles.status)}>
      Currently doing:
      <br />
      {text}
    </p>
  );
};
