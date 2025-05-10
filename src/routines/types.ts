export type Exercise = { type: "exercise"; name: string; duration: number };
export type Break = { type: "break"; duration: number };

export type Routine = (Exercise | Break)[];

export type RoutineName = "core" | "test";
