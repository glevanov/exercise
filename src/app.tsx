import { useMachine } from "@xstate/react";
import { useEffect, useState } from "preact/hooks";

import styles from "./app.module.css";
import { CountdownTimer } from "./components/countdown-timer/countdown-timer";
import { Select } from "./components/select/select";
import { StartButton } from "./components/start-button/start-button";
import { Status } from "./components/status/status";
import { routineFsm } from "./fsm/routine-fsm";
import { routines } from "./routines/const";
import { Break, Exercise, RoutineName } from "./routines/types";

const options = [
  { value: "core", label: "Core" },
  { value: "test", label: "Test" },
];

export const App = () => {
  const [selectedRoutine, setSelectedRoutine] = useState<RoutineName>("core");

  const [state, send] = useMachine(routineFsm);
  const currentStep: Exercise | Break | null =
    state.context.routine[state.context.currentIndex] ?? null;

  const isRunning =
    state.matches("running") ||
    state.matches("getReady") ||
    state.matches("checkNext");

  const handleClick = (): void => {
    if (isRunning) {
      send({ type: "STOP" });
    } else {
      send({ type: "START", routine: routines[selectedRoutine] });
    }
  };

  useEffect(() => {
    return () => {
      send({ type: "STOP" });
    };
  }, []);

  return (
    <main className={styles.screen}>
      <section className={styles.content}>
        <div className={styles.top}>
          <Select
            value={selectedRoutine}
            options={options}
            onChange={(evt) =>
              setSelectedRoutine(evt.currentTarget.value as RoutineName)
            }
          />
          <Status text={state.context.currentText} />
          <CountdownTimer
            key={state.context.startTimer ? state.context.currentIndex : "idle"}
            seconds={state.context.startTimer ? currentStep?.duration : 0}
          />
          {state.context.nextText.length > 0 ? (
            <Status text={`Next: ${state.context.nextText}`} />
          ) : null}
        </div>
        <StartButton
          className={styles.button}
          handleClick={handleClick}
          shouldStop={isRunning}
        />
      </section>
    </main>
  );
};
