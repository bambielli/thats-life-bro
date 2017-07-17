# thats-life-bro

A client for playing [Conway's Game of Life.](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)

The size of the grid is customizable between 1x1 and 30x30 squares.
It is not infinite, and cells at the edge do not wrap.

Rules that determine if a cell lives or dies in the next generation are:

1. *underpopulation* - Any live cell with fewer than two live neighbors dies
2. *overpopulation* - Any live cell with more than three live neighbors dies
3. *reproduction* - Any dead cell with exactly three live neighbors becomes a live cell
4. *stabilization* - Any live cell with two or three live neighbors lives on to the next generation

Committed the bundle so this will work with github pages hosting.

[Check it out live here](http://www.bambielli.com/thats-life-bro/)
