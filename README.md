# Game of Life

A recreation of Conway's Game of Life, using JavaScript, HTML5 and CSS.

[Live Demo](https://lewishopkins.co.uk/game-of-life/)

## Overview

The game consists of three classes within game.js:

- Game - Holds the surface-level methods (Start, Stop, Step) which communicate with the other classes. The 'Start' method acts as the game loop.
- Grid - Creates and holds all Cells in an array, and handles converting the data into a visual grid on the HTML page.
- Cell - The class for each individual cell on the grid, contains methods to determine if the cell is alive (and if the cell should live in the next step).

The graphics for this project are created using a HTML5 Canvas.

Many methods within the classes are modular, so that they may be reused or modified without having to change many areas of the code. For example, Cells have a setAlive() function so that it may be shared by both game.Step(), and by the "Draw on Grid with Mouse" function in different ways.