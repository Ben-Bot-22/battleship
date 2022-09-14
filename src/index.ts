// import { GameBoard } from './game-board';
import { humanPlayer, botPlayer } from './player';
import {
  createPlayerGrid,
  createBotGrid,
  displayPlayerShips,
  displayBotShips
} from './dom';

function initGame() {
  createPlayerGrid();
  createBotGrid();
  humanPlayer.gameBoard.placeShipsRandomly();
  botPlayer.gameBoard.placeShipsRandomly();
  displayPlayerShips();
  // displayBotShips();
}

function resetGame() {
  // reset gameboards
  // delete divs and repopulate
  // reset players
}

export function endGame(winner: string) {
  alert(`${winner} wins!`);
  resetGame();
  initGame();
}

initGame();
