import { Ship, createShip } from './ship';

export class Coordinate {
  coord: [number, number];
  attacked: boolean;
  ship: Ship | null = null;
  shipIndex: number | null = null;
  constructor(coord: [number, number]) {
    this.coord = coord;
    this.attacked = false;
    this.ship = null;
    this.shipIndex = null;
  }
}

export class GameBoard {
  board: Coordinate[] = [];
  ships: Ship[] = [];
  SIZE = 10;
  constructor() {
    for (let i = 0; i < this.SIZE; i++) {
      for (let j = 0; j < this.SIZE; j++) {
        const coord = new Coordinate([i, j]);
        this.board.push(coord);
      }
    }
  }
  getCoord(coord: [number, number]) {
    return this.board.find(
      (c) => c.coord[0] === coord[0] && c.coord[1] === coord[1]
    );
  }
  shipInBounds(
    length: number,
    coord: [number, number],
    isHorizontal: boolean
  ): boolean {
    // if coord is on board
    if (this.getCoord(coord)) {
      // check if length is clear in direction
      if (isHorizontal) {
        if (coord[0] + length < this.SIZE) {
          return true;
        }
      } else if (coord[1] + length < this.SIZE) {
        return true;
      }
    }
    return false;
  }
  placeShip(coord: [number, number], length: number, isHorizontal: boolean) {
    // if ship is in bounds, set has ship to true
    if (this.shipInBounds(length, coord, isHorizontal)) {
      const ship = createShip(length);
      this.ships.push(ship);
      const coordObj = this.getCoord(coord);
      if (coordObj) {
        // mark hasShip true for ship length
        for (let i = 0; i < length; i++) {
          let coordObj = null;
          if (isHorizontal) {
            coordObj = this.getCoord([coord[0] + i, coord[1]]);
          } else {
            coordObj = this.getCoord([coord[0], coord[1] + i]);
          }
          if (coordObj) {
            coordObj.ship = ship;
            coordObj.shipIndex = i;
          }
        }
      }
    }
  }
  getRandomCoord(): [number, number] {
    return [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
  }
  getRandomDirection() {
    return Math.random() < 0.5;
  }
  randomShipPlacement(length: number) {
    let coord = this.getRandomCoord();
    let isHorizontal = this.getRandomDirection();
    while (!this.shipInBounds(length, coord, isHorizontal)) {
      coord = this.getRandomCoord();
      isHorizontal = this.getRandomDirection();
    }
    this.placeShip(coord, length, isHorizontal);
  }
  placeShipsRandomly() {
    // 1 4-length ship
    this.randomShipPlacement(4);
    // 2 3-length ships
    for (let i = 0; i < 2; i++) {
      this.randomShipPlacement(3);
    }
    // 3 2-length ships
    for (let i = 0; i < 3; i++) {
      this.randomShipPlacement(2);
    }
    // 4 1-length ships
    for (let i = 0; i < 4; i++) {
      this.randomShipPlacement(1);
    }
  }
  receiveAttack(coord: [number, number]) {
    // check if ship is hit
    const coordObj = this.getCoord(coord);
    if (coordObj) {
      coordObj.attacked = true;
      if (coordObj.ship !== null && coordObj.shipIndex !== null) {
        coordObj.ship.hit(coordObj.shipIndex);
        return true;
      }
    }
    return false;
  }
  isShipAtCoordSunk(coord: [number, number]): boolean {
    const coordObj = this.getCoord(coord);
    if (coordObj) {
      if (coordObj.ship !== null) {
        return this.isSunk(coordObj.ship);
      }
    }
    return false;
  }
  isSunk(ship: Ship) {
    for (const hit of ship.hits) {
      if (!hit) {
        return false;
      }
    }
    return true;
  }
  numShipsSunk(): number {
    let sunk = 0;
    for (const ship of this.ships) {
      if (this.isSunk(ship)) {
        sunk++;
      }
    }
    return sunk;
  }
  allShipsSunk(): boolean {
    for (const ship of this.ships) {
      const sunk = this.isSunk(ship);
      if (!sunk) return false;
    }
    return true;
  }
}
