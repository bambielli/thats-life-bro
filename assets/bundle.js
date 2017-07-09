/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Generation = __webpack_require__(6);

var _Generation2 = _interopRequireDefault(_Generation);

var _LifeCoordinate = __webpack_require__(7);

var _LifeCoordinate2 = _interopRequireDefault(_LifeCoordinate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Game of life rules:
    1. If a live cell in the grid is bordered by fewer than 2 neighbors, it dies in next generation (underpopulation)
    2. If a live cell in the grid is bordered by 2 or 3 neighbors, it lives to the next generation
    3. If a live cell is bordered by more than 3 neighbors, it dies (overpopulation)
    4. If a dead cell is bordered by exactly 3 neighbors, it becomes a live cell (reproduction)

    Initial pattern constitutes the “seed” of the system. Generation next is created by applying the above rules simultaneously to every cell in the seed to come up with the next generation.
    In other words, the order of calculation of cells for a new generation cannot effect whether a cell lives or dies for the gen++ calculation.

    My initial thoughts for how to model this game:

    The grid can be modeled like a coordinate system, each square representing a single coordinate.
    Class Coordinate(x, y, isAlive) <-- I think livingNeighbors will be calculated on demand.

    Need some method for returning the list of valid neighbors for a coordinate. My coordinate package does this already!

    Shouldn't pre-compute all possible generations... we should use some sort of generator-like functionality
    that we can request the .next() generation from. Generator can store the current generation, produce the next one,
    and overwrite the previous one.
 */

var generation = void 0;

function resetView() {
    var table = document.getElementById('grid');
    // remove old grid, if it exists
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    document.getElementById('stable').classList.add('hidden');
    document.getElementById('nextbtn').classList.remove('hidden');
    document.getElementById('go').classList.remove('hidden');
    document.getElementById('controls').classList.remove('hidden');
    document.querySelector('.grid').classList.remove('hidden');
}

window.generateGrid = function () {
    var table = document.getElementById('grid');
    var n = document.getElementById('grid-size').value;
    if (n && !isNaN(parseInt(n))) {
        resetView();
        generation = new _Generation2.default(n);
        var tbody = document.createElement('tbody');
        for (var rowNum = 0; rowNum < n; rowNum++) {
            var row = generateRow(n, rowNum);
            tbody.appendChild(row);
        }
        table.appendChild(tbody);
    }
};

function parseId(str) {
    return str.split('-').map(function (item) {
        return parseInt(item);
    });
}

function generateCell() {}

// generates nxn matrix of columns
function generateRow(numCols, rowNum) {
    var tableRow = document.createElement('tr');
    for (var colNum = 0; colNum < numCols; colNum++) {
        var col = document.createElement('td');
        col.classList.add('cell');
        col.setAttribute('id', colNum + '-' + rowNum);
        // attach a toggle callback
        col.onclick = function () {
            var cell = parseId(this.id);
            var alive = generation.toggleAlive(cell[0], cell[1]);
            alive ? this.classList.add('alive') : this.classList.remove('alive');
        };
        tableRow.appendChild(col);
    }
    return tableRow;
}

window.nextGeneration = function () {
    var diff = generation.next();
    if (diff.length === 0) {
        document.getElementById('stable').classList.remove('hidden');
        if (intervalId) {
            window.stop();
        }
    } else {
        document.getElementById('stable').classList.add('hidden');
        updateGrid(diff);
    }
};

// called after nextGeneration is generated, to update the dom to match new state of the world.
// more efficient would be if next() returned only the cells that needed to update.
function updateGrid(diff) {
    // grab the table, iterate through coords, update table with coord stuff
    var table = document.getElementById('grid');
    diff.forEach(function (coord) {
        var cell = document.getElementById(coord.x + '-' + coord.y);
        coord.isAlive ? cell.classList.add('alive') : cell.classList.remove('alive');
    });
}

var intervalId = void 0;

window.autoRun = function () {
    intervalId = setInterval(function () {
        window.nextGeneration();
    }, 500);
    document.getElementById('stop').classList.remove('hidden');
    document.getElementById('nextbtn').classList.add('hidden');
    document.getElementById('go').classList.add('hidden');
};

window.stop = function () {
    clearInterval(intervalId);
    intervalId = undefined;
    document.getElementById('stop').classList.add('hidden');
    document.getElementById('go').classList.remove('hidden');
    document.getElementById('nextbtn').classList.remove('hidden');
};

/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @function Coordinate - a Coordinate class, representing the x,y coordinates of a square in a 2d matrix
 * @param {integer} x
 * @param {integer} y
 * @return {Array<Coordinate>}
 */
function Coordinate(x, y) {
    this.x = x;
    this.y = y;
}

/**
 * @function findSurroundingCoordinates - returns array of valid coordinates surrounding the given coordinate in a square matrix
 * @param {integer} matrixSize - size of your square matrix
 * @return {Array<Coordinate>}
 */
Coordinate.prototype.findSurroundingCoordinates = function (matrixSize) {
    var surroundingCoordinates = [new Coordinate(this.x - 1, this.y - 1), new Coordinate(this.x, this.y - 1), new Coordinate(this.x + 1, this.y - 1), new Coordinate(this.x - 1, this.y), new Coordinate(this.x + 1, this.y), new Coordinate(this.x - 1, this.y + 1), new Coordinate(this.x, this.y + 1), new Coordinate(this.x + 1, this.y + 1)];

    // filters out coordinates that are not valid (i.e. outside the bounds of the matrix)
    return surroundingCoordinates.filter(function (item) {
        if (item.x >= 0 && item.y >= 0 && item.x < matrixSize && item.y < matrixSize) {
            return item;
        }
    });
};

exports.default = Coordinate;

/***/ }),
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _LifeCoordinate = __webpack_require__(7);

var _LifeCoordinate2 = _interopRequireDefault(_LifeCoordinate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * GENERATION CLASS
 */
function Generation(n) {
    this.state = this.newDeadState(n);
}

Generation.prototype.newDeadState = function (n) {
    var newDeadState = [];
    for (var y = 0; y < n; y++) {
        var row = [];
        for (var x = 0; x < n; x++) {
            row.push(new _LifeCoordinate2.default(x, y, false)); // all squares start as dead
        }
        newDeadState.push(row);
    }
    return newDeadState;
};

Generation.prototype.findSurroundingLivingCoordinates = function (coordinate) {
    var _this = this;

    var surroundingCoords = coordinate.findSurroundingCoordinates(this.state.length);
    var livingCoords = [];
    surroundingCoords.forEach(function (coord) {
        var activeCoord = _this.state[coord.y][coord.x];
        if (activeCoord.isAlive) {
            livingCoords.push(activeCoord);
        }
    });
    return livingCoords;
};

Generation.prototype.prettyPrint = function () {
    var stringifiedState = this.state.map(function (row) {
        return row.map(function (col) {
            return col.toString();
        });
    });
    console.table(stringifiedState);
};

Generation.prototype.next = function () {
    var _this2 = this;

    // get a fresh dead copy of the world
    var nextGen = this.newDeadState(this.state.length);
    var diff = [];
    // iterate through all items in the world, and check to see if the cell lives or dies.
    this.state.forEach(function (row) {
        row.forEach(function (coord) {
            var livingCoords = _this2.findSurroundingLivingCoordinates(coord);
            if (livingCoords.length < 2 || livingCoords.length > 3) {
                // underpopulation
                if (coord.isAlive !== false) {
                    diff.push(nextGen[coord.y][coord.x]);
                }
            } else if (livingCoords.length === 3) {
                // reproduction
                if (coord.isAlive !== true) {
                    diff.push(nextGen[coord.y][coord.x]);
                }
                nextGen[coord.y][coord.x].isAlive = true;
            } else {
                // stability
                nextGen[coord.y][coord.x].isAlive = coord.isAlive;
            }
        });
    });

    this.state = nextGen;
    return diff;
};

Generation.prototype.toggleAlive = function (x, y) {
    this.state[y][x].isAlive = !this.state[y][x].isAlive;
    this.prettyPrint();
    return this.state[y][x].isAlive;
};

exports.default = Generation;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _surroundingCoordinates = __webpack_require__(3);

var _surroundingCoordinates2 = _interopRequireDefault(_surroundingCoordinates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// generic coordinate class with x, y fields and getSurroundingCoordinates method on prototype

/**
 * LifeCoordinate class
 * @param {number} x
 * @param {number} y
 * @param {boolean} isAlive
 */
function LifeCoordinate(x, y, isAlive) {
    _surroundingCoordinates2.default.call(this, x, y);
    this.isAlive = isAlive;
}
LifeCoordinate.prototype = Object.create(_surroundingCoordinates2.default.prototype);
LifeCoordinate.prototype.constructor = LifeCoordinate;
LifeCoordinate.prototype.toString = function () {
    var display = this.isAlive ? 'TRUE' : '-';
    return '' + display;
};

exports.default = LifeCoordinate;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map