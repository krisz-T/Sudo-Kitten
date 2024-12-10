let board = [];
let solution = [];
let previousDifficulty = 'easy';

const kittenImages = [
    'kittens/kitten1.jpg',
    'kittens/kitten2.jpg',
    'kittens/kitten3.jpg',
    'kittens/kitten4.jpg',
    'kittens/kitten5.jpg',
    'kittens/kitten6.jpg',
    'kittens/kitten7.jpg',
    'kittens/kitten8.jpg',
    'kittens/kitten9.jpg',
    'kittens/kitten10.jpg',
    'kittens/impostor.jpg'
];

function setRandomKitten() {
    const randomIndex = Math.floor(Math.random() * kittenImages.length);
    const kittenImg = document.getElementById('kitten');
    const victoryKittenImg = document.getElementById('victory-kitten');
    
    kittenImg.src = kittenImages[randomIndex];
    victoryKittenImg.src = kittenImages[randomIndex];
}

function generateSudoku(difficulty) {
    const grid = Array(9).fill().map(() => Array(9).fill(0));
    fillDiagonal(grid);
    solveSudoku(grid);
    solution = grid.map(row => [...row]);
    
    const removes = {
        'easy': 30,
        'medium': 45,
        'hard': 55
    };
    
    removeNumbers(grid, removes[difficulty]);
    return grid;
}

function fillDiagonal(grid) {
    for(let box = 0; box < 9; box += 3) {
        fillBox(grid, box, box);
    }
}

function fillBox(grid, startRow, startCol) {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    numbers = shuffle(numbers);
    
    let index = 0;
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            grid[startRow + i][startCol + j] = numbers[index++];
        }
    }
}

function shuffle(array) {
    for(let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function isValid(grid, row, col, num) {
    for(let x = 0; x < 9; x++) {
        if(grid[row][x] === num) return false;
    }
    
    for(let x = 0; x < 9; x++) {
        if(grid[x][col] === num) return false;
    }
    
    let startRow = row - row % 3;
    let startCol = col - col % 3;
    
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            if(grid[i + startRow][j + startCol] === num) return false;
        }
    }
    
    return true;
}

function solveSudoku(grid) {
    let row = 0;
    let col = 0;
    let isEmpty = false;
    
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            if(grid[i][j] === 0) {
                row = i;
                col = j;
                isEmpty = true;
                break;
            }
        }
        if(isEmpty) break;
    }
    
    if(!isEmpty) return true;
    
    for(let num = 1; num <= 9; num++) {
        if(isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if(solveSudoku(grid)) return true;
            grid[row][col] = 0;
        }
    }
    return false;
}

function removeNumbers(grid, count) {
    let removed = 0;
    while(removed < count) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if(grid[row][col] !== 0) {
            grid[row][col] = 0;
            removed++;
        }
    }
}

function createBoard() {
    const boardDiv = document.getElementById('board');
    boardDiv.innerHTML = '';
    
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            const input = document.createElement('input');
            input.maxLength = 1;
            input.dataset.row = i;
            input.dataset.col = j;
            
            if(board[i][j] !== 0) {
                input.value = board[i][j];
                input.readOnly = true;
                input.classList.add('initial');
            }
            
            input.addEventListener('input', function(e) {
                if(!/^[1-9]$/.test(e.target.value)) {
                    e.target.value = '';
                }
                // Reset color when typing new number
                if(!this.classList.contains('initial')) {
                    this.style.color = 'var(--text-color)';
                }
                updateKittenVisibility();
            });
            
            input.addEventListener('keydown', function(e) {
                // If key is a number 1-9, clear the cell first
                if ((e.key >= '1' && e.key <= '9') && !this.readOnly) {
                    this.value = '';
                }
                handleKeyPress(e, this);
            });
            
            cell.appendChild(input);
            boardDiv.appendChild(cell);
        }
    }
    updateKittenVisibility();
}

function updateKittenVisibility() {
    const inputs = document.querySelectorAll('.cell input');
    let correctCells = 0;
    
    inputs.forEach(input => {
        if(input.value) {
            const row = parseInt(input.dataset.row);
            const col = parseInt(input.dataset.col);
            if(parseInt(input.value) === solution[row][col]) {
                correctCells++;
            }
        }
    });
    
    const progress = (correctCells / 81) * 100;
    const blurAmount = Math.max(20 - (progress / 5), 0);
    
    const kittenImg = document.getElementById('kitten');
    kittenImg.style.filter = `blur(${blurAmount}px)`;
    document.getElementById('progress-text').textContent = 
        `Save the kitten: ${Math.round(progress)}% complete`;
}

function handleKeyPress(event, input) {
    const row = parseInt(input.dataset.row);
    const col = parseInt(input.dataset.col);
    
    switch(event.key) {
        case 'ArrowUp':
            if(row > 0) {
                moveFocus(row-1, col);
            }
            break;
        case 'ArrowDown':
            if(row < 8) {
                moveFocus(row+1, col);
            }
            break;
        case 'ArrowLeft':
            if(col > 0) {
                moveFocus(row, col-1);
            }
            break;
        case 'ArrowRight':
            if(col < 8) {
                moveFocus(row, col+1);
            }
            break;
    }
}

function moveFocus(row, col) {
    const nextInput = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
    if (nextInput) {
        nextInput.focus();
        // Force cursor to start
        nextInput.setSelectionRange(0, 0);
        // Then move to end
        requestAnimationFrame(() => {
            nextInput.setSelectionRange(1, 1);
        });
    }
}

function checkSolution() {
    let correct = true;
    let empty = false;
    const inputs = document.querySelectorAll('.cell input');
    
    inputs.forEach(input => {
        if (!input.classList.contains('initial')) {
            input.style.color = 'var(--text-color)';
        }
    });
    
    inputs.forEach(input => {
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        const value = input.value;
        
        if(!value) {
            empty = true;
            correct = false;
        } else if(parseInt(value) !== solution[row][col]) {
            correct = false;
            input.style.color = 'red';
        }
    });
    
    if(empty) {
        alert('Please fill in all cells!');
    } else if(correct) {
        showVictoryModal();
    } else {
        alert('Some numbers are incorrect. Keep trying!');
    }
}

function showVictoryModal() {
    const modal = document.getElementById('victory-modal');
    modal.style.display = 'block';
    
    // Copy the unblurred kitten image
    const victoryKitten = document.getElementById('victory-kitten');
    victoryKitten.style.filter = 'blur(0)';
}

function closeVictoryModal() {
    const modal = document.getElementById('victory-modal');
    modal.style.display = 'none';
    newGame();
}

function initializeThemes() {
    const themeSelect = document.getElementById('theme-select');
    const savedTheme = localStorage.getItem('sudokuTheme') || 'orange';
    
    // Apply theme on load
    applyTheme(savedTheme);
    themeSelect.value = savedTheme;
    
    themeSelect.addEventListener('change', function(e) {
        applyTheme(e.target.value);
    });
}

function applyTheme(theme) {
    console.log('Applying theme:', theme);
    const root = document.documentElement;
    
    const themes = {
        orange: {
            bgColor: '#1a1a1a',
            textColor: '#ffa07a',
            gridColor: '#ff7f50',
            cellBg: '#2a2a2a',
            cellHover: '#3a3a3a',
            buttonBg: '#ff7f50',
            buttonText: '#1a1a1a'
        },
        blue: {
            bgColor: '#1a1a1a',
            textColor: '#87ceeb',
            gridColor: '#4169e1',
            cellBg: '#2a2a2a',
            cellHover: '#3a3a3a',
            buttonBg: '#4169e1',
            buttonText: '#ffffff'
        },
        green: {
            bgColor: '#1a1a1a',
            textColor: '#90ee90',
            gridColor: '#32cd32',
            cellBg: '#2a2a2a',
            cellHover: '#3a3a3a',
            buttonBg: '#32cd32',
            buttonText: '#1a1a1a'
        },
        dark: {
            bgColor: '#121212',
            textColor: '#ffffff',
            gridColor: '#404040',
            cellBg: '#1e1e1e',
            cellHover: '#2a2a2a',
            buttonBg: '#404040',
            buttonText: '#ffffff'
        },
        light: {
            bgColor: '#ffffff',
            textColor: '#333333',
            gridColor: '#666666',
            cellBg: '#f0f0f0',
            cellHover: '#e0e0e0',
            buttonBg: '#666666',
            buttonText: '#ffffff'
        }
    };

    const selectedTheme = themes[theme];
    if (selectedTheme) {
        root.style.setProperty('--bg-color', selectedTheme.bgColor);
        root.style.setProperty('--text-color', selectedTheme.textColor);
        root.style.setProperty('--grid-color', selectedTheme.gridColor);
        root.style.setProperty('--cell-bg', selectedTheme.cellBg);
        root.style.setProperty('--cell-hover', selectedTheme.cellHover);
        root.style.setProperty('--button-bg', selectedTheme.buttonBg);
        root.style.setProperty('--button-text', selectedTheme.buttonText);
        updateSelectArrow(selectedTheme.gridColor);
    }
    
    localStorage.setItem('sudokuTheme', theme);
}

function confirmDifficultyChange() {
    const modal = document.getElementById('difficulty-modal');
    modal.style.display = 'none';
    previousDifficulty = document.getElementById('difficulty-select').value;
    newGame();
}

function cancelDifficultyChange() {
    const difficultySelect = document.getElementById('difficulty-select');
    difficultySelect.value = previousDifficulty;
    const modal = document.getElementById('difficulty-modal');
    modal.style.display = 'none';
}

function showVictoryModal() {
    const modal = document.getElementById('victory-modal');
    modal.style.display = 'block';
    
    const victoryKitten = document.getElementById('victory-kitten');
    victoryKitten.style.filter = 'blur(0)';
    
    // Create confetti
    createConfetti();
}

function createConfetti() {
    const colors = ['#ff718d', '#fdff6a', '#71ff7b', '#71b7ff', '#ff71e8'];
    const confettiCount = 150;
    
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    document.body.appendChild(confetti);
    
    for(let i = 0; i < confettiCount; i++) {
        const particle = document.createElement('div');
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}vw;
            top: -20px;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 5 + 3}px;
            background: ${randomColor};
            border-radius: ${Math.random() * 5}px;
            transform: rotate(${Math.random() * 360}deg);
            opacity: ${Math.random() * 0.5 + 0.5};
            animation: confettiFall ${Math.random() * 2 + 2}s linear infinite;
        `;
        confetti.appendChild(particle);
    }
    
    setTimeout(() => {
        confetti.style.transition = 'opacity 1s';
        confetti.style.opacity = '0';
        setTimeout(() => confetti.remove(), 1000);
    }, 4000);
}

const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg) scale(1);
        }
        100% {
            transform: translateY(100vh) rotate(360deg) scale(0);
        }
    }
`;
document.head.appendChild(confettiStyle);

function newGame() {
    const difficulty = document.getElementById('difficulty-select').value;
    board = generateSudoku(difficulty);
    createBoard();
    setRandomKitten();
}

window.onload = function() {
    newGame();
    initializeThemes();
    previousDifficulty = document.getElementById('difficulty-select').value;
    
    document.getElementById('difficulty-select').addEventListener('change', function(e) {
        const modal = document.getElementById('difficulty-modal');
        modal.style.display = 'block';
    });
}

function revealSolution() {
    const inputs = document.querySelectorAll('.cell input');
    inputs.forEach(input => {
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        input.value = solution[row][col];
    });
    updateKittenVisibility();
}

function updateSelectArrow(color) {
    const encodedColor = encodeURIComponent(color);
    const arrowSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12'%3E%3Cpath fill='${encodedColor}' d='M0 3l6 6 6-6z'/%3E%3C/svg%3E")`;
    
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.style.backgroundImage = arrowSvg;
    });
}

document.addEventListener('keydown', function(e) {
    // Enable when pressing Ctrl + Shift + D
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        document.querySelector('.dev-button').style.display = 'inline-block';
    }
});