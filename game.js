// Global HTML Page Elements
canvas = document.getElementById("canvas");
context = canvas.getContext("2d");
textGeneration = document.getElementById("generation");
rect = canvas.getBoundingClientRect();

// Game
class Game {
    constructor() {
        this.currentGeneration = 0;
    }

    // Game Loop
    start() {

        // Prevent multiple loops
        if (this.started)
            return;
            
        // Start Game Loop (Every 700ms)
        this.started = true;
        this.step();

        this.timer = setInterval(function(){
            game.step();
          }, 700);

    }

    stop() {
        this.started = false;
        clearInterval(this.timer);
    }


    // Step forward 1 generation
    step() {

        // Move to next generation
        this.currentGeneration++;
        textGeneration.innerHTML = "Generation " + this.currentGeneration;

        // Define Arrays for Dead and Alive cells
        // Arrays contain #Position in original cell array
        var cellsToBeKilled = new Array();
        var cellsToBeBorn = new Array();

        // Step all cells, add them to appropiate arrays
        for (var i = 0; i < grid.cells.length; i++) {
            grid.cells[i].step(cellsToBeKilled, cellsToBeBorn);
        }

        // Kill Cells
        for (var i = 0; i < cellsToBeKilled.length; i++) {
            grid.cells[cellsToBeKilled[i]].setDead();
        }

        // Birth Cells
        for (var i = 0; i < cellsToBeBorn.length; i++) {
            grid.cells[cellsToBeBorn[i]].setAlive();
        }

        // Draw
        grid.draw();
    }

}

// Grid
class Grid {
    constructor(width, height) {
        this.width = Math.floor(width);
        this.height = Math.floor(height);

        // Define Cell Array
        this.cells = new Array();

        // Create Cells in Array
        for(var i = 0; i < width; i++) {
            for(var j = 0; j < height; j++) {
                this.cells.push(new Cell(i, j, this));
            }
        }

    }

    // Return Cell Object from Coordinates
    getCell(x, y) {

        // x = Number of columns
        // y = positions from left to right
        var cellTarget = this.cells[(this.width * x) + y];

        return cellTarget;
    }

    // Check if Cell is alive from Coordinates
    getCellIsAlive(x, y) {
        
        var cellTarget = this.getCell(x, y);

        // Return false if position doesn't exist
        if (!cellTarget)
            return false;

        if (cellTarget.isAlive())
            return true;
            else return false;
    }

    draw() {
        
        // Clear Grid
        this.clear();

        // Draw Grid
        for(var i = 0; i < this.width; i++) {
            for(var j = 0; j < this.height; j++) {

                // Check if alive, set cell color
                if (this.getCell(i, j).isAlive())
                    context.fillStyle = "#FF0000";
                else
                    context.fillStyle = "#c4c4c4";

                // Draw cell
                context.fillRect((i * 20), (j * 20), 19, 19);
            }
        }
    }

    // Clear Grid
    clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

}

// Cell
class Cell {
    constructor(x, y, grid) {
        this.x = x;
        this.y = y
        this.grid = grid;

        this.alive = false;
    };

    // Count number of alive neighbours
    // Set self to alive or dead
    step(cellsToBeKilled, cellsToBeBorn) {

        // Check number of alive neighbours
        var x = this.x;
        var y = this.y;
        var count = 0;

        if (grid.getCellIsAlive(x + 1, y)) count++;
        if (grid.getCellIsAlive(x - 1, y)) count++;
        if (grid.getCellIsAlive(x, y + 1)) count++;
        if (grid.getCellIsAlive(x, y - 1)) count++;

        if (grid.getCellIsAlive(x + 1, y + 1)) count++;
        if (grid.getCellIsAlive(x - 1, y - 1)) count++;
        if (grid.getCellIsAlive(x + 1, y - 1)) count++;
        if (grid.getCellIsAlive(x - 1, y + 1)) count++;

        // Determine if alive or dead
        if (this.isAlive()) {
            // Underpopulation || Overcrowding
            if (count < 2 || count > 3)
                cellsToBeKilled.push((grid.width * x) + y)
        } else {
            // Creation of Life
            if (count == 3)
                cellsToBeBorn.push((grid.width * x) + y);
        }

    }

    isAlive() {
        if (this.alive)
            return true;
            else return false;
    }

    setAlive() {
        this.alive = true;
    }

    setDead() {
        this.alive = false;
    }

}

// Initiate Game
var game = new Game();
var grid = new Grid(25, 25);

grid.draw();

// Draw on Grid [With M1 Click]
canvas.addEventListener("mousedown", function getCursorPosition() {
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    // Get Cell target
    // Divide by Grid Cell Size
    var gridX = Math.floor(x / 20);
    var gridY = Math.floor(y / 20);
    console.log("gridX: " + gridX + " gridY: " + gridY);

    // Set Cell to Alive, draw scene
    grid.getCell(gridX, gridY).setAlive();
    grid.draw();
});

// Recalculate canvas coordinates upon window resize
window.addEventListener("resize", function(){
    rect = canvas.getBoundingClientRect();
 });