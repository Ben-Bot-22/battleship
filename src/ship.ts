type Ship = {
  length: number
  hits: boolean[]
  hit: (index: number) => void
  isSunk: () => boolean 
}

function createShip(length: number, hits: boolean[]): Ship {
  for (let i = 0; i < length; i++) {
    hits.push(false);
  }
  return {
    length,
    hits,
    hit(index: number) {
      hits[index] = true;
    },
    isSunk() {
      for (const hit in hits) {
        if (!hit) 
          return false; 
      }
      return true;
    }
  }
}

/*
TODO:

*/