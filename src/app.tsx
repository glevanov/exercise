import { createSignal, onCleanup } from "solid-js";
import styles from "./app.module.css";
import { testRoutine } from "./routines/test-routine";
import { RoutineMachine } from "./routine-machine";
import { Status } from "./components/status";
import { StartButton } from "./components/start-button";

export type RunState = "idle" | "running" | "done";

export const App = () => {
  const [text, updateText] = createSignal<string>("Idle");
  const [state, updateState] = createSignal<RunState>("idle");
  const [routine, setRoutine] = createSignal<RoutineMachine | null>(null);

  const handleClick = (): void => {
    if (state() === "running") {
      routine()?.stop();
      setRoutine(null);
    } else {
      const newRoutine = new RoutineMachine({
        routine: testRoutine,
        updateState,
        updateText,
      });
      setRoutine(newRoutine);
      newRoutine.start();
    }
  };

  onCleanup(() => {
    routine()?.stop();
  });

  return (
    <main class={styles.screen}>
      <div class={styles.content}>
        <Status text={text()} />
        <StartButton onClick={handleClick} state={state()} />
      </div>
    </main>
  );
};
