import { createSignal, onCleanup } from "solid-js";
import "./App.css";
import { testRoutine } from "./routines/test-routine";
import { RoutineMachine } from "./routine-machine";

export type RunState = "idle" | "running" | "done";

function App() {
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
    <>
      <h1>Exercise</h1>

      <p>Currently doing: {text()}</p>
      <div class="card">
        <button onClick={handleClick}>
          {state() === "running" ? "Stop" : "Start"}
        </button>
      </div>
    </>
  );
}

export default App;
