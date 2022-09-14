// import { GameBoard } from './game-board';
import { humanPlayer, botPlayer } from './player';
import {
  createPlayerGrid,
  createBotGrid,
  displayPlayerShips,
  displayBotShips,
  resetDOM
} from './dom';

function initGame() {
  createPlayerGrid();
  createBotGrid();
  humanPlayer.gameBoard.placeShipsRandomly();
  botPlayer.gameBoard.placeShipsRandomly();
  displayPlayerShips();
  // displayBotShips(); // testing purposes
}

function resetGame() {
  // reset gameboards for both players
  humanPlayer.resetGameBoard();
  botPlayer.resetGameBoard();
  resetDOM();
  humanPlayer.gameBoard.placeShipsRandomly();
  botPlayer.gameBoard.placeShipsRandomly();
  displayPlayerShips();
  // displayBotShips(); // testing purposes
}

export function endGame(winner: string) {
  alert(`${winner} wins!`);
  alert('Play again?');
  resetGame();
}

initGame();
