import type { JSX } from "preact";
import cn from "classnames";

import styles from "./start-button.module.css";

interface StartButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  handleClick: JSX.MouseEventHandler<HTMLButtonElement>;
  shouldStop: boolean;
}

export const StartButton = ({
  handleClick,
  shouldStop,
  className,
}: StartButtonProps) => {
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
