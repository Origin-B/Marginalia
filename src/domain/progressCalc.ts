export default function progressCalc(
  currantPage: number,
  totalPage: number,
): number {
  if (totalPage < currantPage) return 0;

  if (totalPage <= 0 || currantPage < 0) return 0;

  return Math.trunc((currantPage / totalPage) * 100);
}
