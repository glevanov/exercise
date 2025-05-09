import { useState, useEffect } from "preact/hooks";

import styles from "./app.module.css";
import { coreRoutine } from "./routines/core-routine";
import { RoutineMachine } from "./routine-machine";
import { Status } from "./components/status";
import { StartButton } from "./components/start-button";

export type RunState = "idle" | "running" | "done";

const playStep = () => {
  const audio = new Audio("step.mp3");
  void audio.play();
};
const playDone = () => {
  const audio = new Audio("done.mp3");
  void audio.play();
};

export const App = () => {
  const [text, updateText] = useState<string>("Idle");
  const [state, updateState] = useState<RunState>("idle");
  const [routine, setRoutine] = useState<RoutineMachine | null>(null);

  const handleClick = (): void => {
    if (state === "running") {
      routine?.stop();
      setRoutine(null);
    } else {
      const newRoutine = new RoutineMachine({
        routine: coreRoutine,
        updateState,
        updateText,
        playStep,
        playDone,
      });
      setRoutine(newRoutine);
      newRoutine.start();
    }
  };

  useEffect(() => {
    return () => {
      routine?.stop();
    };
  }, []);

  return (
    <main className={styles.screen}>
      <section className={styles.content}>
        <div className={styles.top}>
          <Status text={text} />
        </div>
        <StartButton
          className={styles.button}
          handleClick={handleClick}
          state={state}
        />
      </section>
    </main>
  );
};
