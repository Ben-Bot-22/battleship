/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/dom.ts":
/*!********************!*\
  !*** ./src/dom.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.displayBotShips = exports.displayPlayerShips = exports.resetDOM = exports.botAttack = exports.createBotGrid = exports.createPlayerGrid = void 0;
const player_1 = __webpack_require__(/*! ./player */ "./src/player.ts");
const index_1 = __webpack_require__(/*! ./index */ "./src/index.ts");
const playerGridDiv = document.getElementById('player-grid');
const botGridDiv = document.getElementById('bot-grid');
const botStats = document.getElementById('bot-stats');
const playerStats = document.getElementById('player-stats');
function createPlayerGrid() {
    createGrid(playerGridDiv);
}
exports.createPlayerGrid = createPlayerGrid;
function createBotGrid() {
    createGrid(botGridDiv, true);
}
exports.createBotGrid = createBotGrid;
function createGrid(div, isBot = false) {
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            const coord = document.createElement('div');
            coord.classList.add('coord');
            coord.dataset.row = `${row}`;
            coord.dataset.col = `${col}`;
            if (isBot) {
                coord.classList.add('bot');
                coord.addEventListener('click', attack);
            }
            else {
                coord.classList.add('player');
            }
            if (div != null)
                div.appendChild(coord);
        }
    }
}
function attack(e) {
    const target = e.target;
    const row = parseInt(target.dataset.row);
    const col = parseInt(target.dataset.col);
    const shipHit = player_1.botPlayer.gameBoard.receiveAttack([row, col]);
    target.classList.add('attacked');
    if (shipHit) {
        let message = 'Player hit a ship!';
        if (player_1.botPlayer.gameBoard.isShipAtCoordSunk([row, col])) {
            botStats.innerHTML = `${player_1.botPlayer.gameBoard.numShipsSunk()} sunk / 10`;
            message = 'You sank a ship!';
        }
        target.innerHTML = '<span>X</span>';
        alert(message);
    }
    if (player_1.botPlayer.gameBoard.allShipsSunk()) {
        (0, index_1.endGame)('Player');
    }
    else {
        botAttack();
    }
}
function botAttack() {
    const coord = player_1.botPlayer.getTarget();
    const shipHit = player_1.humanPlayer.gameBoard.receiveAttack(coord);
    const target = document.querySelector(`div.player[data-row="${coord[0]}"][data-col="${coord[1]}"]`);
    if (target !== null)
        target.classList.add('attacked');
    if (shipHit) {
        let message = 'Bot hit a ship!';
        if (player_1.humanPlayer.gameBoard.isShipAtCoordSunk(coord)) {
            playerStats.innerHTML = `${player_1.humanPlayer.gameBoard.numShipsSunk()} sunk / 10`;
            message = 'Bot sank a ship!';
        }
        if (target !== null)
            target.innerHTML = '<span>X</span>';
        alert(message);
    }
    if (player_1.humanPlayer.gameBoard.allShipsSunk()) {
        (0, index_1.endGame)('Bot');
    }
}
exports.botAttack = botAttack;
function resetDOM() {
    const coords = document.querySelectorAll('.coord');
    coords.forEach((coord) => {
        coord.classList.remove('attacked');
        coord.innerHTML = '';
        coord.classList.remove('ship');
    });
}
exports.resetDOM = resetDOM;
function displayPlayerShips() {
    for (const coord of player_1.humanPlayer.gameBoard.board) {
        if (coord.ship !== null) {
            const target = document.querySelector(`div#player-grid div[data-row="${coord.coord[0]}"][data-col="${coord.coord[1]}"]`);
            if (target !== null)
                target.classList.add('ship');
        }
    }
}
exports.displayPlayerShips = displayPlayerShips;
function displayBotShips() {
    for (const coord of player_1.botPlayer.gameBoard.board) {
        if (coord.ship !== null) {
            const target = document.querySelector(`div#bot-grid div[data-row="${coord.coord[0]}"][data-col="${coord.coord[1]}"]`);
            if (target !== null)
                target.classList.add('ship');
        }
    }
}
exports.displayBotShips = displayBotShips;


/***/ }),

/***/ "./src/game-board.ts":
/*!***************************!*\
  !*** ./src/game-board.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameBoard = exports.Coordinate = void 0;
const ship_1 = __webpack_require__(/*! ./ship */ "./src/ship.ts");
class Coordinate {
    constructor(coord) {
        this.ship = null;
        this.shipIndex = null;
        this.coord = coord;
        this.attacked = false;
        this.ship = null;
        this.shipIndex = null;
    }
}
exports.Coordinate = Coordinate;
class GameBoard {
    constructor() {
        this.board = [];
        this.ships = [];
        this.SIZE = 10;
        for (let i = 0; i < this.SIZE; i++) {
            for (let j = 0; j < this.SIZE; j++) {
                const coord = new Coordinate([i, j]);
                this.board.push(coord);
            }
        }
    }
    getCoord(coord) {
        return this.board.find((c) => c.coord[0] === coord[0] && c.coord[1] === coord[1]);
    }
    shipInBounds(length, startCoord, isHorizontal) {
        if (this.getCoord(startCoord)) {
            if (isHorizontal) {
                if (startCoord[0] + length < this.SIZE) {
                    return true;
                }
            }
            else if (startCoord[1] + length < this.SIZE) {
                return true;
            }
        }
        return false;
    }
    placeShip(coord, length, isHorizontal) {
        const ship = (0, ship_1.createShip)(length);
        this.ships.push(ship);
        const coordObj = this.getCoord(coord);
        if (coordObj) {
            coordObj.ship = ship;
            coordObj.shipIndex = 0;
            for (let i = 1; i < length; i++) {
                let nextShipCoord = null;
                if (isHorizontal) {
                    nextShipCoord = this.getCoord([coord[0] + i, coord[1]]);
                }
                else {
                    nextShipCoord = this.getCoord([coord[0], coord[1] + i]);
                }
                if (nextShipCoord) {
                    nextShipCoord.ship = ship;
                    nextShipCoord.shipIndex = i;
                }
            }
        }
    }
    getRandomCoord() {
        return [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
    }
    getRandomDirection() {
        return Math.random() < 0.5;
    }
    shipOverlap(length, startCoord, isHorizontal) {
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
            }
            else {
                const nextCoord = this.getCoord([startCoord[0], startCoord[1] + i]);
                if (nextCoord && nextCoord.ship !== null) {
                    return true;
                }
            }
        }
        return false;
    }
    validShipPlacement(length, startCoord, isHorizontal) {
        return (this.shipInBounds(length, startCoord, isHorizontal) &&
            !this.shipOverlap(length, startCoord, isHorizontal));
    }
    randomShipPlacement(length) {
        let startCoord = this.getRandomCoord();
        let isHorizontal = this.getRandomDirection();
        while (!this.validShipPlacement(length, startCoord, isHorizontal)) {
            startCoord = this.getRandomCoord();
            isHorizontal = this.getRandomDirection();
        }
        this.placeShip(startCoord, length, isHorizontal);
    }
    placeShipsRandomly() {
        this.randomShipPlacement(4);
        for (let i = 0; i < 2; i++) {
            this.randomShipPlacement(3);
        }
        for (let i = 0; i < 3; i++) {
            this.randomShipPlacement(2);
        }
        for (let i = 0; i < 4; i++) {
            this.randomShipPlacement(1);
        }
    }
    receiveAttack(coord) {
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
    isShipAtCoordSunk(coord) {
        const coordObj = this.getCoord(coord);
        if (coordObj) {
            if (coordObj.ship !== null) {
                return this.isSunk(coordObj.ship);
            }
        }
        return false;
    }
    isSunk(ship) {
        for (const hit of ship.hits) {
            if (!hit) {
                return false;
            }
        }
        return true;
    }
    numShipsSunk() {
        let sunk = 0;
        for (const ship of this.ships) {
            if (this.isSunk(ship)) {
                sunk++;
            }
        }
        return sunk;
    }
    allShipsSunk() {
        for (const ship of this.ships) {
            const sunk = this.isSunk(ship);
            if (!sunk)
                return false;
        }
        return true;
    }
}
exports.GameBoard = GameBoard;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.endGame = void 0;
const player_1 = __webpack_require__(/*! ./player */ "./src/player.ts");
const dom_1 = __webpack_require__(/*! ./dom */ "./src/dom.ts");
function initGame() {
    (0, dom_1.createPlayerGrid)();
    (0, dom_1.createBotGrid)();
    player_1.humanPlayer.gameBoard.placeShipsRandomly();
    player_1.botPlayer.gameBoard.placeShipsRandomly();
    (0, dom_1.displayPlayerShips)();
}
function resetGame() {
    player_1.humanPlayer.resetGameBoard();
    player_1.botPlayer.resetGameBoard();
    (0, dom_1.resetDOM)();
    player_1.humanPlayer.gameBoard.placeShipsRandomly();
    player_1.botPlayer.gameBoard.placeShipsRandomly();
    (0, dom_1.displayPlayerShips)();
}
function endGame(winner) {
    alert(`${winner} wins!`);
    alert('Play again?');
    resetGame();
}
exports.endGame = endGame;
initGame();


/***/ }),

/***/ "./src/player.ts":
/*!***********************!*\
  !*** ./src/player.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.botPlayer = exports.humanPlayer = void 0;
const game_board_1 = __webpack_require__(/*! ./game-board */ "./src/game-board.ts");
class Player {
    constructor(name, gameBoard) {
        this.name = name;
        this.gameBoard = gameBoard;
    }
    resetGameBoard() {
        this.gameBoard = new game_board_1.GameBoard();
    }
}
class BotAI extends Player {
    constructor() {
        super(...arguments);
        this.attackHistory = [];
    }
    getRandomCoord() {
        return Math.floor(Math.random() * this.gameBoard.SIZE);
    }
    searchAttackHistory(coord) {
        return this.attackHistory.find((c) => c[0] === coord[0] && c[1] === coord[1]);
    }
    getTarget() {
        let randCoord = [
            this.getRandomCoord(),
            this.getRandomCoord()
        ];
        while (this.searchAttackHistory(randCoord)) {
            randCoord = [this.getRandomCoord(), this.getRandomCoord()];
        }
        return randCoord;
    }
}
exports.humanPlayer = new Player('Human', new game_board_1.GameBoard());
exports.botPlayer = new BotAI('Bot', new game_board_1.GameBoard());


/***/ }),

/***/ "./src/ship.ts":
/*!*********************!*\
  !*** ./src/ship.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createShip = void 0;
function createShip(length, hits = []) {
    for (let i = 0; i < length; i++) {
        hits.push(false);
    }
    return {
        length,
        hits,
        hit(index) {
            hits[index] = true;
        }
    };
}
exports.createShip = createShip;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map