import { GameBoard } from './game-board';

class Player {
  name: string;
  gameBoard: GameBoard;
  constructor(name: string, gameBoard: GameBoard) {
    this.name = name;
    this.gameBoard = gameBoard;
  }
  resetGameBoard() {
    this.gameBoard = new GameBoard();
  }
}

class BotAI extends Player {
  attackHistory: [number, number][] = [];
  getRandomCoord() {
    return Math.floor(Math.random() * this.gameBoard.SIZE);
  }
  searchAttackHistory(coord: [number, number]) {
    return this.attackHistory.find(
      (c) => c[0] === coord[0] && c[1] === coord[1]
    );
  }
  getTarget() {
    // get random coord on player board
    let randCoord: [number, number] = [
      this.getRandomCoord(),
      this.getRandomCoord()
    ];
    // check if coord is in attacks array, if so, get new coord
    while (this.searchAttackHistory(randCoord)) {
      randCoord = [this.getRandomCoord(), this.getRandomCoord()];
    }
    return randCoord;
  }
}

export const humanPlayer = new Player('Human', new GameBoard());
export const botPlayer = new BotAI('Bot', new GameBoard());
