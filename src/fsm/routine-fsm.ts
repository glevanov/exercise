import { assign, setup } from "xstate";
import type { Routine } from "../routines/types";
import { acquireWakeLock, releaseWakeLock } from "../lib/wake-lock";
import { playAudio } from "../lib/play-audio";

const SECOND = 1000;

type RoutineContext = {
  routine: Routine;
  currentIndex: number;
  currentText: string;
};

type StartEvent = { type: "START"; routine: Routine };
type StopEvent = { type: "STOP" };

export const routineFsm = setup({
  types: {
    context: {} as RoutineContext,
    events: {} as StartEvent | StopEvent,
  },
  delays: {
    stepDelay: ({ context }) => {
      return context.routine[context.currentIndex].duration * SECOND;
    },
  },
  actions: {
    acquireWakeLock: () => {
      void acquireWakeLock();
    },
    releaseWakeLock: () => {
      void releaseWakeLock();
    },
    playStepSound: () => {
      void playAudio("step");
    },
    playDoneSound: () => {
      void playAudio("done");
    },
  },
}).createMachine({
  id: "routine",
  initial: "idle",
  context: {
    routine: [],
    currentIndex: 0,
    currentText: "Idle",
  },
  states: {
    idle: {
      entry: assign({
        currentText: "Idle",
      }),
      on: {
        START: {
          actions: assign({
            routine: ({ event }) => event.routine,
          }),
          target: "getReady",
        },
      },
    },
    getReady: {
      entry: [
        "acquireWakeLock",
        assign({
          currentText: "Get ready",
          currentIndex: 0,
        }),
      ],
      after: {
        [2 * SECOND]: "running",
      },
      on: {
        STOP: {
          target: "done",
        },
      },
    },
    running: {
      entry: [
        assign({
          currentText: ({ context }) => {
            const step = context.routine[context.currentIndex];
            return step.type === "exercise" ? step.name : "Break";
          },
        }),
        "playStepSound",
      ],
      after: {
        stepDelay: {
          target: "checkNext",
        },
      },
      on: {
        STOP: {
          target: "done",
        },
      },
    },
    checkNext: {
      always: [
        {
          target: "running",
          guard: ({ context }) =>
            context.currentIndex < context.routine.length - 1,
          actions: assign({
            currentIndex: ({ context }) => context.currentIndex + 1,
          }),
        },
        {
          target: "done",
          actions: ["playDoneSound"],
        },
      ],
    },
    done: {
      entry: [
        "releaseWakeLock",
        assign({
          currentText: "Done",
        }),
      ],
      on: {
        START: {
          actions: assign({
            routine: ({ event }) => event.routine,
          }),
          target: "getReady",
        },
      },
    },
  },
});
