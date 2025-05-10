import { type Routine, RoutineName } from "./types";
import { coreRoutine } from "./core-routine";
import { testRoutine } from "./test-routine";

export const routines: Record<RoutineName, Routine> = {
  core: coreRoutine,
  test: testRoutine,
} as const;
