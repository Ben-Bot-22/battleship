import { humanPlayer, botPlayer } from './player';
import { endGame } from './index';

const playerGridDiv: HTMLElement = document.getElementById('player-grid')!;
const botGridDiv: HTMLElement = document.getElementById('bot-grid')!;
const botStats: HTMLElement = document.getElementById('bot-stats')!;
const playerStats: HTMLElement = document.getElementById('player-stats')!;

export function createPlayerGrid() {
  createGrid(playerGridDiv);
}

export function createBotGrid() {
  createGrid(botGridDiv, true);
}

function createGrid(div: HTMLElement, isBot = false) {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const coord = document.createElement('div');
      coord.classList.add('coord');
      coord.dataset.row = `${row}`;
      coord.dataset.col = `${col}`;
      if (isBot) {
        coord.classList.add('bot');
        // add attack to track mouse over bot grid
        coord.addEventListener('click', attack);
      } else {
        coord.classList.add('player');
      }
      if (div != null) div.appendChild(coord);
    }
  }
}

function attack(e: Event) {
  const target = e.target as HTMLDivElement;
  const row = parseInt(target.dataset.row!);
  const col = parseInt(target.dataset.col!);
  const shipHit = botPlayer.gameBoard.receiveAttack([row, col]);
  target.classList.add('attacked');
  if (shipHit) {
    let message = 'Player hit a ship!';
    if (botPlayer.gameBoard.isShipAtCoordSunk([row, col])) {
      botStats.innerHTML = `${botPlayer.gameBoard.numShipsSunk()} sunk / 10`;
      message = 'You sank a ship!';
    }
    target.innerHTML = '<span>X</span>';
    alert(message);
  }
  if (botPlayer.gameBoard.allShipsSunk()) {
    endGame('Player');
  } else {
    botAttack();
  }
}

export function botAttack() {
  const coord = botPlayer.getTarget();
  const shipHit = humanPlayer.gameBoard.receiveAttack(coord);
  // get HTML element with id of bot and data-row and data-col
  const target = document.querySelector(
    `div.player[data-row="${coord[0]}"][data-col="${coord[1]}"]`
  );
  // console.log(target);
  if (target !== null) target.classList.add('attacked');
  if (shipHit) {
    let message = 'Bot hit a ship!';
    if (humanPlayer.gameBoard.isShipAtCoordSunk(coord)) {
      //   increment 0 sunk at the bottom of BOT grid
      playerStats.innerHTML = `${humanPlayer.gameBoard.numShipsSunk()} sunk / 10`;
      message = 'Bot sank a ship!';
    }
    if (target !== null) target.innerHTML = '<span>X</span>';
    alert(message);
  }
  if (humanPlayer.gameBoard.allShipsSunk()) {
    endGame('Bot');
  }
}

export function resetDOM() {
  // remove ship classes from all coords
  const coords = document.querySelectorAll('.coord');
  coords.forEach((coord) => {
    // remove attacked, remove x, remove ship
    coord.classList.remove('attacked');
    coord.innerHTML = '';
    coord.classList.remove('ship');
  });
}

export function displayPlayerShips() {
  // for each coordinate in player gameboard, add ship class
  for (const coord of humanPlayer.gameBoard.board) {
    if (coord.ship !== null) {
      // get HTML element with id of player and data-row and data-col
      const target = document.querySelector(
        `div#player-grid div[data-row="${coord.coord[0]}"][data-col="${coord.coord[1]}"]`
      );
      if (target !== null) target.classList.add('ship');
    }
  }
}

// Visibility of bot ships for testing purposes
export function displayBotShips() {
  // for each coordinate in player gameboard, add ship class
  for (const coord of botPlayer.gameBoard.board) {
    if (coord.ship !== null) {
      // get HTML element with id of player and data-row and data-col
      const target = document.querySelector(
        `div#bot-grid div[data-row="${coord.coord[0]}"][data-col="${coord.coord[1]}"]`
      );
      if (target !== null) target.classList.add('ship');
    }
  }
}
