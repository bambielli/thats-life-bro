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

import Generation from './classes/Generation';
import LifeCoordinate from './classes/LifeCoordinate';

let generation;

function resetView() {
    const table = document.getElementById('grid');
    // remove old grid, if it exists
    while(table.firstChild) {
        table.removeChild(table.firstChild);
    }
    document.getElementById('stable').classList.add('hidden');
    document.getElementById('nextbtn').classList.remove('hidden');
    document.getElementById('go').classList.remove('hidden');
    document.getElementById('controls').classList.remove('hidden');
    document.querySelector('.grid').classList.remove('hidden');

}

window.generateGrid = function() {
    const table = document.getElementById('grid');
    const n = document.getElementById('grid-size').value;
    if (n && !isNaN(parseInt(n))) {
        resetView();
        generation = new Generation(n);
        const tbody = document.createElement('tbody');
        for (let rowNum = 0; rowNum < n; rowNum++) {
            const row = generateRow(n, rowNum);
            tbody.appendChild(row);
        }
        table.appendChild(tbody);
    }
}

function parseId(str) {
    return str.split('-').map((item) => parseInt(item));
}

function generateCell() {

}

// generates nxn matrix of columns
function generateRow (numCols, rowNum) {
    const tableRow = document.createElement('tr')
    for (let colNum = 0; colNum < numCols; colNum++) {
        const col = document.createElement('td');
        col.classList.add('cell');
        col.setAttribute('id', `${colNum}-${rowNum}`);
        // attach a toggle callback
        col.onclick = function() {
            const cell = parseId(this.id);
            const alive = generation.toggleAlive(cell[0], cell[1]);
            alive ? this.classList.add('alive') : this.classList.remove('alive');
        }
        tableRow.appendChild(col);
    }
    return tableRow;
}

window.nextGeneration = function() {
    const diff = generation.next();
    if (diff.length === 0) {
        document.getElementById('stable').classList.remove('hidden');
        if (intervalId) {
            window.stop();
        }
    } else {
        document.getElementById('stable').classList.add('hidden');
        updateGrid(diff);
    }
}

// called after nextGeneration is generated, to update the dom to match new state of the world.
// more efficient would be if next() returned only the cells that needed to update.
function updateGrid(diff) {
    // grab the table, iterate through coords, update table with coord stuff
    const table = document.getElementById('grid');
    diff.forEach((coord) => {
        const cell = document.getElementById(`${coord.x}-${coord.y}`);
        coord.isAlive ? cell.classList.add('alive') : cell.classList.remove('alive');
    })
}

let intervalId;

window.autoRun = function () {
    intervalId = setInterval(function() {
       window.nextGeneration();
    }, 500)
    document.getElementById('stop').classList.remove('hidden')
    document.getElementById('nextbtn').classList.add('hidden');
    document.getElementById('go').classList.add('hidden')
}

window.stop = function () {
    clearInterval(intervalId);
    intervalId = undefined;
    document.getElementById('stop').classList.add('hidden')
    document.getElementById('go').classList.remove('hidden')
    document.getElementById('nextbtn').classList.remove('hidden');
}
