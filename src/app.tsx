import { useEffect, useState } from "preact/hooks";

import styles from "./app.module.css";
import { Status } from "./components/status/status";
import { StartButton } from "./components/start-button/start-button";
import { RoutineName } from "./routines/types";
import { routines } from "./routines/const";
import { Select } from "./components/select/select";
import { routineFsm } from "./fsm/routine-fsm";
import { useMachine } from "@xstate/react";

const options = [
  { value: "core", label: "Core" },
  { value: "test", label: "Test" },
];

export const App = () => {
  const [selectedRoutine, setSelectedRoutine] = useState<RoutineName>("core");

  const [state, send] = useMachine(routineFsm);

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
