export const MAX_SEED = 10000;

export function createRandomSeed() {
  return Math.floor(Math.random() * MAX_SEED);
}
