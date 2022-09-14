export type Ship = {
  length: number;
  hits: boolean[];
  hit: (index: number) => void;
};

export function createShip(length: number, hits: boolean[] = []): Ship {
  for (let i = 0; i < length; i++) {
    hits.push(false);
  }
  return {
    length,
    hits,
    hit(index: number) {
      hits[index] = true;
    }
  };
}
