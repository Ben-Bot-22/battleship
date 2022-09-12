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
  receiveAttack(coord: [number, number]) {
    // check if ship is hit
    const coordObj = this.getCoord(coord);
    if (coordObj) {
      coordObj.attacked = true;
      if (coordObj.ship !== null && coordObj.shipIndex !== null) {
        coordObj.ship.hit(coordObj.shipIndex);
      }
    }
  }
  allShipsSunk(): boolean {
    for (const ship of this.ships) {
      if (!ship.isSunk()) return false;
    }
    return true;
  }
}

// const gameBoard = new GameBoard();
// gameBoard.placeShip([0, 0], 3, true);
// console.log('hello world, love Game Board');

/*
TODO:
*/
