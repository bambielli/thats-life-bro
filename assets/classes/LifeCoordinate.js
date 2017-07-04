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

export default LifeCoordinate;