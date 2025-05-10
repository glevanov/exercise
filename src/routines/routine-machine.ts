import { RunState } from "../app";
import { Routine } from "./types";
import { acquireWakeLock, releaseWakeLock } from "../lib/wake-lock";
import { type Source } from "../lib/play-audio";

const SECOND = 1000;

type Options = {
  routine: Routine;
  updateText: (value: string) => void;
  updateState: (value: RunState) => void;
  playAudio: (target: Source) => Promise<void>;
};

export class RoutineMachine {
  private readonly updateText: (value: string) => void;
  private readonly updateState: (value: RunState) => void;
  private readonly routine: Routine;
  private readonly playAudio: (target: Source) => Promise<void>;
  private currentIndex: number;
  private stopped: boolean;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor({ updateText, routine, updateState, playAudio }: Options) {
    this.updateText = updateText;
    this.updateState = updateState;
    this.playAudio = playAudio;
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
      void this.playAudio("done");
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
    void this.playAudio("step");

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
