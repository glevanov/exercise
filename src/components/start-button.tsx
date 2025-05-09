import { JSX } from "preact";
import cn from "classnames";

import { RunState } from "../app";
import styles from "./start-button.module.css";

interface StartButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  handleClick: () => void;
  state: RunState;
}

export const StartButton = ({
  handleClick,
  state,
  className,
}: StartButtonProps) => {
  const shouldStop = state === "running";

  return (
    <button
      className={cn(
        className,
        styles.button,
        shouldStop ? styles.stop : styles.start,
      )}
      onClick={handleClick}
    >
      {shouldStop ? "Stop" : "Start"}
    </button>
  );
};
