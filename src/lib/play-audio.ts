export type Source = "step" | "done";

const sources: Readonly<Record<Source, HTMLAudioElement>> = {
  step: new Audio("step.mp3"),
  done: new Audio("done.mp3"),
};

/**
 * Internal function to play audio.
 */
export const playAudio = async (source: Source) => {
  for (const key in sources) {
    const audio = sources[key as Source];
    audio.pause();
    audio.currentTime = 0;
  }
  const target = sources[source];
  await target.play();
};
