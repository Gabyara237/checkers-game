# American Checkers Game
A functional American Checkers game built with JavaScript. Features mandatory captures, king promotion, and complete rule enforcement.

## Description

This is a browser-based implementation of American Checkers that faithfully recreates the classic game experience. The project implements official game rules including mandatory capture enforcement, automatic king promotion, and the 40-move draw rule.

Players receive visual feedback for available moves, with green highlights showing where pieces can move. The game automatically enforces mandatory captures, preventing players from making illegal moves. When a piece reaches the opponent's back row, it's automatically crowned as a king, gaining the ability to move in both directions.

Built entirely with JavaScript, HTML, and CSS. This project demonstrates:
* Complex game state management
* Conditional logic and move validation
* DOM manipulation and event handling
* CSS animations and visual feedback
* Algorithm development for capture detection

This game is deployed at: [Play the game here!](https://gabyara237.github.io/checkers-game/)

## Screenshots
![Checkers board](https://i.postimg.cc/k5K8vJ99/Screenshot_2025_11_20_at_11_17_37_PM.png) 

*Main game interface showing the checkerboard and game status*

## Features Showcase

### Rules Overlay
![Rules Screen](https://i.postimg.cc/FHCzk169/Screenshot-2025-11-20-at-11-51-19-PM.png)

*Players can review the rules before starting*

### Game Interface
![Main Game](https://i.postimg.cc/k5K8vJ99/Screenshot_2025_11_20_at_11_17_37_PM.png)

*Clean, intuitive game board with turn indicator*

### Available Moves
![Move Highlighting](https://i.postimg.cc/7L07nHDq/Screenshot_2025_11_20_at_11_18_17_PM.png)

*Green highlights show where selected piece can move*

### Mandatory Captures
![Capture Move](https://i.postimg.cc/QtD762xH/Screenshot_2025_11_20_at_11_18_31_PM.png)

*Captures are enforced - only capture options shown when available*

### King Promotion
![King Piece](https://i.postimg.cc/FK3cVrm5/Screenshot_2025_11_20_at_11_19_02_PM.png)

*Pieces are crowned when reaching the opposite end*


## Getting started

### How to play ?

1. Open **index.html** in your web browser
2. Read the rules in the overlay
3. Click **"PLAY NOW"** to start
4. White pieces move first
5. Click on a piece to see available moves (highlighted in green)
6. Click on a highlighted square to move
7. Captures are mandatory!

### Game Rules

* **Movement:** Pieces move diagonally forward on dark squares
* **Capturing:** Jump over opponent pieces diagonally **(mandatory!)**
* **King Promotion:** Reach the opponent's back row to crown your piece
* **Kings:** Move diagonally forward ***AND*** backward
* **Victory:** Capture all opponent pieces or block all their moves
* **Draw:** 40 consecutive king-only moves without captures

## Features

* Implementation of American Checkers rules
* Mandatory capture enforcement
* King promotion **(crowning)**
* King bidirectional movement and captures
* Draw detection **(40-move rule)**
* Visual feedback for available moves
* Smooth piece capture animations
* Turn indicator with piece icons
* Rules overlay
* Game reset functionality

## Technologies Used

* HTML
* CSS
* JavaScript

## Key Functions

* **`initializeBoard()`** - Sets up initial piece positions
* **`availableMovements()`** - Calculates valid moves for selected piece
* **`iterateOverMovementOptions()`** - Detects captures and highlights available moves
* **`movePiece()`** - Handles piece movement and capture execution
* **`checkCrowning()`** - Promotes pieces to kings
* **`checkWinner()`** - Determines game end conditions
* **`manageGameTurns()`** - Controls turn alternation and piece availability

## Installation

No installation required! Simply:

1. Clone the repository:

```bash
git clone https://github.com/Gabyara237/checkers-game.git
```
2. Open ` index.html ` in your browser


## Future Enhancements

* AI opponent
* Move history and undo functionality
* Timer for timed games
* Score tracking across multiple games
* Sound effects
* Responsive design for mobile devices
* Multiplayer over network

## Attributions

* **Game Piece Graphics:**  
Images sourced from [Freepik](https://www.freepik.com) and used under the Freepik Free License.

* **Game Rules:**  
Based on official American Checkers (Draughts) rules from the World Checkers/Draughts Federation.