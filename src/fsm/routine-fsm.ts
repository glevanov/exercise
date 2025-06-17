import { assign, setup } from "xstate";

import { playAudio } from "../lib/play-audio";
import { acquireWakeLock, releaseWakeLock } from "../lib/wake-lock";
import type { Routine } from "../routines/types";

const SECOND = 1000;

type RoutineContext = {
  routine: Routine;
  currentIndex: number;
  currentText: string;
  nextText: string;
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
    nextText: "",
    startTimer: false,
  },
  states: {
    idle: {
      entry: assign({
        currentText: "Idle",
        nextText: "",
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
          nextText: ({ context }) => {
            const next = context.routine[0];
            return "name" in next ? next.name : "";
          },
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
          nextText: ({ context }) => {
            for (
              let i = context.currentIndex + 1;
              i < context.routine.length;
              i++
            ) {
              const nextStep = context.routine[i];
              if (nextStep !== undefined && nextStep.type === "exercise") {
                return nextStep.name;
              }
            }
            return "";
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
          nextText: "",
          startTimer: false,
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
