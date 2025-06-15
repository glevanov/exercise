import cn from "classnames";
import type { JSX } from "preact";
import { useEffect, useRef, useState } from "react";

import styles from "./countdown-timer.module.css";
import { formatTime } from "./format-time";

interface CountdownTimerProps extends JSX.HTMLAttributes<HTMLParagraphElement> {
  seconds: number;
}
export const CountdownTimer = ({ seconds, className }: CountdownTimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState(seconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          intervalRef.current !== null && clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [seconds]);

  return (
    <p className={cn(className, styles.timer)}>{formatTime(secondsLeft)}</p>
  );
};
