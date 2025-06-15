import cn from "classnames";
import { JSX } from "preact";

import styles from "./status.module.css";

interface StatusProps extends JSX.HTMLAttributes<HTMLParagraphElement> {
  text: string;
}

export const Status = ({ text, className }: StatusProps) => {
  return <p className={cn(className, styles.status)}>{text}</p>;
};
