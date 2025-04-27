import { RunState } from "./App";
import { Routine } from "./routines/types";

const SECOND = 1000;

type Options = {
  routine: Routine;
  updateText: (value: string) => void;
  updateState: (value: RunState) => void;
};

export class RoutineMachine {
  private readonly updateText: (value: string) => void;
  private readonly updateState: (value: RunState) => void;
  private readonly routine: Routine;
  private currentIndex: number;
  private stopped: boolean;

  constructor({ updateText, routine, updateState }: Options) {
    this.updateText = updateText;
    this.updateState = updateState;
    this.routine = routine;
    this.currentIndex = 0;
    this.stopped = false;
  }

  doExercise() {
    if (this.stopped || this.currentIndex >= this.routine.length) {
      this.stop();
      return;
    }

    const step = this.routine[this.currentIndex];
    if (step.type === "break") {
      this.updateText("Break");
    } else if (step.type === "exercise") {
      this.updateText(step.name);
    }

    setTimeout(() => {
      this.currentIndex++;
      this.doExercise();
    }, step.duration * SECOND);
  }

  start() {
    this.updateState("running");
    this.stopped = false;
    this.currentIndex = 0;
    this.updateText("Get ready");
    setTimeout(() => {
      this.doExercise();
    }, 2 * SECOND);
  }

  stop() {
    this.stopped = true;
    this.updateState("done");
    this.updateText("Done");
  }
}
