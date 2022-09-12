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

  it('recieveAttack()', () => {
    const board = new GameBoard();
    board.placeShip([0, 0], 3, true);
    board.receiveAttack([0, 0]);
    expect(board.ships[0].hits[0]).toBe(true);
  });

  it('allShipsSunk()', () => {
    const board = new GameBoard();
    board.placeShip([0, 0], 3, true);
    board.receiveAttack([0, 0]);
    board.receiveAttack([1, 0]);
    board.receiveAttack([2, 0]);
    expect(board.allShipsSunk()).toBe(true);
  });
});

/*
TODO: 

*/
