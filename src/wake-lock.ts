let wakeLock: WakeLockSentinel | null = null;

const handleVisibilityChange = async () => {
  if (wakeLock !== null && document.visibilityState === "visible") {
    wakeLock = await navigator.wakeLock.request("screen");
  }
};

export const acquireWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    document.addEventListener("visibilitychange", handleVisibilityChange);
  } catch (err) {}
};

export const releaseWakeLock = async () => {
  await wakeLock?.release();
  wakeLock = null;
  document.removeEventListener("visibilitychange", handleVisibilityChange);
};
