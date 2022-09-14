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
    startCoord: [number, number],
    isHorizontal: boolean
  ): boolean {
    // if coord is on board
    if (this.getCoord(startCoord)) {
      // check if length is clear in direction
      if (isHorizontal) {
        if (startCoord[0] + length < this.SIZE) {
          return true;
        }
      } else if (startCoord[1] + length < this.SIZE) {
        return true;
      }
    }
    return false;
  }
  placeShip(coord: [number, number], length: number, isHorizontal: boolean) {
    // if ship is in bounds, set has ship to true
    const ship = createShip(length);
    this.ships.push(ship);
    const coordObj = this.getCoord(coord);
    if (coordObj) {
      coordObj.ship = ship;
      coordObj.shipIndex = 0;
      // mark hasShip true for ship length
      for (let i = 1; i < length; i++) {
        let nextShipCoord = null;
        if (isHorizontal) {
          nextShipCoord = this.getCoord([coord[0] + i, coord[1]]);
        } else {
          nextShipCoord = this.getCoord([coord[0], coord[1] + i]);
        }
        if (nextShipCoord) {
          nextShipCoord.ship = ship;
          nextShipCoord.shipIndex = i;
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
  shipOverlap(
    length: number,
    startCoord: [number, number],
    isHorizontal: boolean
  ) {
    // check if ship will overlap another ship
    const coordObj = this.getCoord(startCoord);
    if (coordObj && coordObj.ship !== null) {
      return true;
    }
    for (let i = 1; i < length; i++) {
      if (isHorizontal) {
        const nextCoord = this.getCoord([startCoord[0] + i, startCoord[1]]);
        if (nextCoord && nextCoord.ship !== null) {
          return true;
        }
      } else {
        const nextCoord = this.getCoord([startCoord[0], startCoord[1] + i]);
        if (nextCoord && nextCoord.ship !== null) {
          return true;
        }
      }
    }
    return false;
  }
  validShipPlacement(
    length: number,
    startCoord: [number, number],
    isHorizontal: boolean
  ) {
    return (
      this.shipInBounds(length, startCoord, isHorizontal) &&
      !this.shipOverlap(length, startCoord, isHorizontal)
    );
  }
  randomShipPlacement(length: number) {
    let startCoord = this.getRandomCoord();
    let isHorizontal = this.getRandomDirection();
    while (!this.validShipPlacement(length, startCoord, isHorizontal)) {
      startCoord = this.getRandomCoord();
      isHorizontal = this.getRandomDirection();
    }
    // console.log('PLACE SHIP: ', startCoord, length, isHorizontal);
    this.placeShip(startCoord, length, isHorizontal);
  }
  placeShipsRandomly() {
    // 1 4-length ship
    this.randomShipPlacement(4); // 4
    // 2 3-length ships
    for (let i = 0; i < 2; i++) {
      // 6
      this.randomShipPlacement(3);
    }
    // 3 2-length ships
    for (let i = 0; i < 3; i++) {
      // 6
      this.randomShipPlacement(2);
    }
    // 4 1-length ships
    for (let i = 0; i < 4; i++) {
      // 4
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
    // console.log(ship.hits);
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
