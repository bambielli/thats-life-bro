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

import Coordinate from 'surrounding-coordinates'; // generic coordinate class with x, y fields and getSurroundingCoordinates method on prototype

/**
 * LifeCoordinate class
 * @param {number} x
 * @param {number} y
 * @param {boolean} isAlive
 */
function LifeCoordinate(x, y, isAlive) {
    Coordinate.call(this, x, y);
    this.isAlive = isAlive;
}
LifeCoordinate.prototype = Object.create(Coordinate.prototype);
LifeCoordinate.prototype.constructor = LifeCoordinate;
LifeCoordinate.prototype.toString = function() {
    const display = this.isAlive ? 'TRUE' : '-'
    return `${display}`
}



/**
 * GENERATION CLASS
 */
function Generation(n) {
    this.state = this.newDeadState(n)
}

Generation.prototype.newDeadState = function (n) {
    const newDeadState = [];
    for (let y = 0; y < n; y++) {
        const row = [];
        for (let x = 0; x < n; x++) {
            row.push(new LifeCoordinate(x, y, false)); // all squares start as dead
        }
        newDeadState.push(row);
    }
    return newDeadState;
}

Generation.prototype.findSurroundingLivingCoordinates = function (coordinate) {
    const surroundingCoords = coordinate.findSurroundingCoordinates(this.state.length);
    const livingCoords = [];
    surroundingCoords.forEach((coord) => {
        const activeCoord = this.state[coord.y][coord.x];
        if (activeCoord.isAlive) {
            livingCoords.push(activeCoord);
        }
    });
    return livingCoords;

}

Generation.prototype.prettyPrint = function() {
    const stringifiedState = this.state.map((row) => {
        return row.map((col) => {
            return col.toString();
        })
    });
    console.table(stringifiedState);
}

Generation.prototype.next = function () {
    // get a fresh dead copy of the world
    const nextGen = this.newDeadState(this.state.length);
    const diff = [];
    // iterate through all items in the world, and check to see if the cell lives or dies.
    this.state.forEach((row) => {
        row.forEach((coord) => {
            const livingCoords = this.findSurroundingLivingCoordinates(coord);
            if (livingCoords.length < 2 || livingCoords.length > 3) { // underpopulation
                if (coord.isAlive !== false) {
                    diff.push(nextGen[coord.y][coord.x]);
                }
            } else if (livingCoords.length === 3) { // reproduction
                if (coord.isAlive !== true) {
                    diff.push(nextGen[coord.y][coord.x]);
                }
                nextGen[coord.y][coord.x].isAlive = true;
            } else { // stability
                nextGen[coord.y][coord.x].isAlive = coord.isAlive;
            }
        });
    });

    this.state = nextGen;
    return diff;
}

Generation.prototype.toggleAlive = function (x, y) {
    this.state[y][x].isAlive = !this.state[y][x].isAlive;
    this.prettyPrint();
    return this.state[y][x].isAlive;
}

module.exports = {
    Generation,
    LifeCoordinate
}


