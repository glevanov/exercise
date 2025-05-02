import { RunState } from "../app";
import styles from "./start-button.module.css";

interface StartButtonProps {
  onClick: () => void;
  state: RunState;
}

export const StartButton = ({ onClick, state }: StartButtonProps) => {
  return (
    <button class={styles.button} onClick={onClick}>
      {state === "running" ? "Stop" : "Start"}
    </button>
  );
};
