const formatter = new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 });

export default function DurationFormatter(duration: number) {
  const hour = Math.floor(duration / 3600);
  const minute = Math.floor((duration - hour * 3600) / 60);
  const second = duration % 60;
  if (hour > 0) {
    return `${hour}:${formatter.format(minute)}:${formatter.format(second)}`;
  }
  return `${minute}:${formatter.format(second)}`;
}
