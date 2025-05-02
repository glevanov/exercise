import { RunState } from "../app";
import styles from "./start-button.module.css";

interface StartButtonProps {
  handleClick: () => void;
  state: RunState;
}

export const StartButton = ({ handleClick, state }: StartButtonProps) => {
  return (
    <button class={styles.button} onClick={handleClick}>
      {state === "running" ? "Stop" : "Start"}
    </button>
  );
};
