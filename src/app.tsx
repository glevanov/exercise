import { useEffect, useState } from "preact/hooks";

import styles from "./app.module.css";
import { RoutineMachine } from "./routines/routine-machine";
import { Status } from "./components/status/status";
import { StartButton } from "./components/start-button/start-button";
import { RoutineName } from "./routines/types";
import { routines } from "./routines/const";
import { playAudio } from "./lib/play-audio";

export type RunState = "idle" | "running" | "done";

export const App = () => {
  const [text, updateText] = useState<string>("Idle");
  const [state, updateState] = useState<RunState>("idle");
  const [selectedRoutine, setSelectedRoutine] = useState<RoutineName>("core");
  const [routine, setRoutine] = useState<RoutineMachine | null>(null);

  const handleClick = (): void => {
    if (state === "running") {
      routine?.stop();
      setRoutine(null);
    } else {
      const newRoutine = new RoutineMachine({
        routine: routines[selectedRoutine],
        updateState,
        updateText,
        playAudio,
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
          <select
            value={selectedRoutine}
            onChange={(evt) =>
              setSelectedRoutine(evt.currentTarget.value as RoutineName)
            }
          >
            <option value="core">Core</option>
            <option value="test">Test</option>
          </select>
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
