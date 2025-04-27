import { Break, Routine } from "./types";

const basicBreak: Break = { type: "break", duration: 3 };

export const coreRoutine: Routine = [
  { type: "exercise", name: "Plank", duration: 30 },
  basicBreak,
  { type: "exercise", name: "Side Plank (Left)", duration: 30 },
  basicBreak,
  { type: "exercise", name: "Hollow Body", duration: 30 },
  basicBreak,
  { type: "exercise", name: "Side Plank (Right)", duration: 30 },
];
