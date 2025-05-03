import { RunState } from "./app";
import { Routine } from "./routines/types";
import { acquireWakeLock, releaseWakeLock } from "./wake-lock";

const SECOND = 1000;

type Options = {
  routine: Routine;
  updateText: (value: string) => void;
  updateState: (value: RunState) => void;
  playStep: () => void;
  playDone: () => void;
};

export class RoutineMachine {
  private readonly updateText: (value: string) => void;
  private readonly updateState: (value: RunState) => void;
  private readonly routine: Routine;
  private readonly playStep: () => void;
  private readonly playDone: () => void;
  private currentIndex: number;
  private stopped: boolean;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor({
    updateText,
    routine,
    updateState,
    playStep,
    playDone,
  }: Options) {
    this.updateText = updateText;
    this.updateState = updateState;
    this.playStep = playStep;
    this.playDone = playDone;
    this.routine = routine;
    this.currentIndex = 0;
    this.stopped = false;
  }

  doExercise(): void {
    if (this.stopped) {
      void releaseWakeLock();
      return;
    }

    if (this.currentIndex === this.routine.length) {
      this.stop();
      this.playDone();
      return;
    }

    const step = this.routine[this.currentIndex];

    switch (step.type) {
      case "break":
        this.updateText("Break");
        break;
      case "exercise":
        this.updateText(step.name);
        break;
    }
    this.playStep();

    this.timeoutId = setTimeout(() => {
      this.currentIndex++;
      this.doExercise();
    }, step.duration * SECOND);
  }

  start(): void {
    this.updateState("running");
    this.stopped = false;
    this.currentIndex = 0;
    this.updateText("Get ready");
    void acquireWakeLock();
    this.timeoutId = setTimeout(() => {
      this.doExercise();
    }, 2 * SECOND);
  }

  stop(): void {
    this.stopped = true;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.updateState("done");
    this.updateText("Done");
    void releaseWakeLock();
  }
}
