import cn from "classnames";

import { CountdownTimer } from "../countdown-timer/countdown-timer";
import styles from "./tableau.module.css";

interface TableauProps {
  currentText: string;
  nextText: string;
  startTimer: boolean;
  currentIndex: number;
  duration: number;
}
export const Tableau = ({
  currentText,
  nextText,
  startTimer,
  currentIndex,
  duration,
}: TableauProps) => {
  return (
    <div className={styles.tableau}>
      <p className={cn(styles.current, styles.text, styles.clamp)}>
        {currentText}
      </p>
      <CountdownTimer
        className={styles.timer}
        key={startTimer ? currentIndex : "idle"}
        seconds={startTimer ? duration : 0}
      />
      {nextText.length > 0 ? (
        <p className={cn(styles.next, styles.text)}>
          Next:
          <span className={cn(styles.nextText, styles.clamp)}>{nextText}</span>
        </p>
      ) : null}
    </div>
  );
};
