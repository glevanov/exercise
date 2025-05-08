import cn from "classnames";

import { RunState } from "../app";
import styles from "./start-button.module.css";

interface StartButtonProps {
  handleClick: () => void;
  state: RunState;
}

export const StartButton = ({ handleClick, state }: StartButtonProps) => {
  const shouldStop = state === "running";

  return (
    <button
      class={cn(styles.button, shouldStop ? styles.stop : styles.start)}
      onClick={handleClick}
    >
      {shouldStop ? "Stop" : "Start"}
    </button>
  );
};
