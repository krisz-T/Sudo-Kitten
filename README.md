# Sudo-Kitten 🐱

Sudo-Kitten is a Sudoku-inspired puzzle game with an adorable twist! Solve Sudoku puzzles to progressively unblur a picture of a kitten, and celebrate your victory with a confetti-filled surprise.

## Features
- **Sudoku Gameplay**: Classic Sudoku mechanics with three difficulty levels—Easy, Medium, and Hard.
- **Kitten Images**: Each game reveals one of several randomly selected kitten images as you make progress.
- **Dynamic Themes**: Choose from various themes (Orange, Blue, Green, Dark, and Light) to customize your experience.
- **Progressive Unblur**: The kitten image becomes clearer as you correctly solve more cells.
- **Victory Celebration**: Complete the puzzle to unlock a celebration screen with confetti and your unblurred kitten.

## How to Play
1. Select a difficulty level.
2. Solve the Sudoku puzzle by filling each cell with a number from 1 to 9:
   - Each row, column, and 3x3 grid must contain all numbers from 1 to 9 without duplicates.
3. Watch as the kitten image becomes clearer with each correct answer.
4. Complete the puzzle to save the kitten!

## Controls
- **Mouse**: Click on a cell to input a number.
- **Keyboard**:
  - Use Arrow Keys (`↑ ↓ ← →`) to navigate between cells.
  - Type numbers 1–9 to fill in a cell.
- **Shortcuts**:
  - `Ctrl + Shift + D`: Enable developer options.

## Installation
1. Clone the repository or download the source files.
2. Open `index.html` in any modern web browser to start playing.

## Customization
### Adding Kitten Images
To add more kitten images, place the image files in the `kittens/` directory and update the `kittenImages` array in the JavaScript code:
```javascript
const kittenImages = [
    'kittens/kitten1.jpg',
    'kittens/kitten2.jpg',
    'kittens/kitten3.jpg',
    ...
];
```
## Modifying Themes
Edit the `themes` object in the `applyTheme` function to create or modify themes:
```javascript
const themes = {
    yourThemeName: {
        bgColor: '#yourBackgroundColor',
        textColor: '#yourTextColor',
        ...
    }
};
```
##Developer Notes
- **Confetti Effects**: The confetti animation is implemented with pure CSS and JavaScript for a lightweight and customizable effect.
- **Grid Generation**: The Sudoku grid is generated with valid solutions using a custom backtracking algorithm.
- **Progress Tracking**: The kitten's blur is updated based on the percentage of correctly filled cells.
