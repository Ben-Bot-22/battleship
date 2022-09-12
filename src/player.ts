import { GameBoard } from './game-board';

// type player = {
//   name: string;
//   gameBoard: GameBoard;
// };
export class Player {
  name: string;
  gameBoard: GameBoard;
  constructor(name: string, gameBoard: GameBoard) {
    this.name = name;
    this.gameBoard = gameBoard;
  }
}

export class BotAI extends Player {
  attackHistory: [number, number][] = [];
  getRandomCoord() {
    return Math.floor(Math.random() * this.gameBoard.board.length);
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

/*
TODO:
Players can take turns playing the game by attacking the enemy Game Board.

The game is played against the computer, so make ‘computer’ players capable of
making random plays.
The AI does not have to be smart, but it should know
whether or not a given move is legal.
(i.e. it shouldn’t shoot the same coordinate twice).
*/
