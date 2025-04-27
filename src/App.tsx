import { createSignal } from "solid-js";
import "./App.css";
import { testRoutine } from "./routines/test-routine";
import { RoutineMachine } from "./routine-machine";

export type RunState = "idle" | "running" | "done";

function App() {
  const [text, updateText] = createSignal<string>("Idle");
  const [state, updateState] = createSignal<RunState>("idle");

  const handleClick = () => {
    const routine = new RoutineMachine({
      routine: testRoutine,
      updateState,
      updateText,
    });
    routine.start();
  };

  return (
    <>
      <h1>Exercise</h1>

      <p>Currently doing: {text()}</p>
      <div class="card">
        <button onClick={handleClick}>
          {["idle", "done"].includes(state()) ? "Start" : "Stop"}
        </button>
      </div>
    </>
  );
}

export default App;
