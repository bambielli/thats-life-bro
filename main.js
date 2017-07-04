import { Generation, LifeCoordinate } from './game-of-life';

let generation;

function resetView() {
    const table = document.getElementById('grid');
    // remove old grid, if it exists
    while(table.firstChild) {
        table.removeChild(table.firstChild);
    }
    document.getElementById('stable').classList.add('hidden');
    document.getElementById('nextbtn').classList.remove('hidden');
    document.getElementById('go').classList.remove('hidden')

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

// generates nxn matrix of columns
function generateRow (numCols, rowNum) {
    const tableRow = document.createElement('tr')
    for (let colNum = 0; colNum < numCols; colNum++) {
        const col = document.createElement('td')
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
