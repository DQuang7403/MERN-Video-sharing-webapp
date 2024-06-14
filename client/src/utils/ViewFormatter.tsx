const VIEW_FORMATER = new Intl.NumberFormat("en-US", {
  notation: "compact",
});
export default function ViewFormatter(num: number) {
  return VIEW_FORMATER.format(num);
}
