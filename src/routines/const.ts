import { coreRoutine } from "./core-routine";
import { testRoutine } from "./test-routine";
import { type Routine, RoutineName } from "./types";

export const routines: Record<RoutineName, Routine> = {
  core: coreRoutine,
  test: testRoutine,
} as const;
