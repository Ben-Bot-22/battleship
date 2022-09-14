/* eslint-disable */
import { GameBoard } from '../game-board';
// import { Ship } from '../ship';

describe('GameBoard', () => {
  it('Place ship: valid', () => {
    const board = new GameBoard();
    board.placeShip([0, 0], 3, true);
    expect(board.ships.length).toBe(1);
  });

  it('Place ship: invalid', () => {
    const board = new GameBoard();
    board.placeShip([9, 9], 3, true);
    expect(board.ships.length).toBe(0);
  });

  it('receiveAttack()', () => {
    const board = new GameBoard();
    board.placeShip([0, 0], 3, true);
    board.receiveAttack([0, 0]);
    expect(board.ships[0].hits[0]).toBe(true);
  });

  it('allShipsSunk()', () => {
    const board = new GameBoard();
    board.placeShipsRandomly();
    board.receiveAttack([0, 0]);
    board.receiveAttack([1, 0]);
    board.receiveAttack([2, 0]);
    expect(board.allShipsSunk()).toBe(false);
  });

  it('allShipsSunk()', () => {
    const board = new GameBoard();
    board.placeShipsRandomly();
    for (const ship of board.ships) {
      for (let i = 0; i < ship.length; i++) {
        ship.hits[i] = true;
      }
    }
    expect(board.allShipsSunk()).toBe(true);
  });

  // num ships sunk: 1
  it('numShipsSunk()', () => {
    const board = new GameBoard();
    board.placeShipsRandomly();
    const ship = board.ships[0];
    for (let i = 0; i < ship.length; i++) {
      ship.hits[i] = true;
    }
    expect(board.numShipsSunk()).toBe(1);
  });

  // num ships sunk: all sunk
  it('allShipsSunk()', () => {
    const board = new GameBoard();
    board.placeShipsRandomly();
    // for each coordinate in gameboard
    for (const coord of board.board) {
      //  if coordinate has a ship
      if (coord.ship !== null) {
        // gameboard receiveAttack at coordinate
        board.receiveAttack(coord.coord);
      }
    }
    expect(board.allShipsSunk()).toBe(true);
  });

  it('allShipsSunk() COUNT', () => {
    const board = new GameBoard();
    let count = 0;
    board.placeShipsRandomly();
    // for each coordinate in gameboard
    for (const coord of board.board) {
      //  if coordinate has a ship
      if (coord.ship !== null) {
        // gameboard receiveAttack at coordinate
        board.receiveAttack(coord.coord);
        count++;
      }
    }
    expect(count).toBe(20);
  });
});
