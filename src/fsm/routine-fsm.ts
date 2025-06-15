import { assign, setup } from "xstate";

import { playAudio } from "../lib/play-audio";
import { acquireWakeLock, releaseWakeLock } from "../lib/wake-lock";
import type { Routine } from "../routines/types";

const SECOND = 1000;

type RoutineContext = {
  routine: Routine;
  currentIndex: number;
  currentText: string;
  startTimer: boolean;
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
    startTimer: false,
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
          startTimer: false,
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
          startTimer: true,
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
