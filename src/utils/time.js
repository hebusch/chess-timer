export default function formatTime(time) {
  const minutes = Math.floor(time / 60000);
  let seconds = Math.floor((time % 60000) / 1000);
  let milliseconds = Math.floor((time % 60000) % 1000);

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  if (milliseconds < 10) {
    milliseconds = `00${milliseconds}`;
  } else if (milliseconds < 100) {
    milliseconds = `0${milliseconds}`;
  }

  return `${minutes}:${seconds}:${milliseconds}`;
}
