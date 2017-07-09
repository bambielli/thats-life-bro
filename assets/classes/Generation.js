import LifeCoordinate from './LifeCoordinate';
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

// this is the generator-like function that calculates the next state of the world
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

export default Generation;