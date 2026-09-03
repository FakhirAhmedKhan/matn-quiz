export function getRandomInt(min: number, max: number): number {
  const safeMin = Math.ceil(min);
  const safeMax = Math.floor(max);

  return Math.floor(Math.random() * (safeMax - safeMin + 1)) + safeMin;
}
