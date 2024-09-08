<template>
    <div class="sudoku_game_body">
        <h2>數獨</h2>
        <button class="intro_btn" @click="showPopup">遊戲說明</button>
        <popModel ref="popup" backgroundClose showAnimation @onShow="handleShow" @onClose="handleClose">
            <div class="game_intro_container">
                <h3>遊戲說明</h3>
                <p>＊遊戲難度分為初級、中級、高級。</p>
                <p>＊預設難度為［初級］。</p>
                <p>＊可以使用［提示］按鈕獲得隨機一個位置的正確數字，最多可以使用 3 次。</p>
                <p>＊全部位置的數字皆填寫正確則成功。</p>
            </div>
        </popModel>
        <div class="sudoku_setting_container">
            <!-- 數獨控制 -->
            <div class="sudoku_button_container df_jc_ac">
                <button @click="generateSudoku">生成數獨</button>
                <p>難度</p>
                <input type="radio" id="easy" value="easy" v-model="difficulty">
                <label for="easy">初</label>
                <input type="radio" id="medium" value="medium" v-model="difficulty">
                <label for="medium">中</label>
                <input type="radio" id="hard" value="hard" v-model="difficulty">
                <label for="hard">高</label>
                <button v-if="hasSudoku" @click="hint">提示</button>
            </div>
            <!-- 數獨 -->
            <div class="sudoku_grid">
                <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="sudoku_row">
                    <input v-for="(cell, colIndex) in row" :key="colIndex" type="text"
                        v-model="grid[rowIndex][colIndex]" :disabled="isGivenCell(rowIndex, colIndex)" maxlength="1"
                        :class="{ 'hint': hintCells.some(([r, c]) => r === rowIndex && c === colIndex) }"
                        class="sudoku_cell" @input="validateInput($event, rowIndex, colIndex)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import popModel from './popModel.vue';

// 引入彈出視窗
const popup = ref(null);

const showPopup = () => {
    popup.value.show();
};

const handleShow = () => {
    console.log('彈出層顯示');
};

const handleClose = () => {
    console.log('彈出層關閉');
};

// 數獨處理

class Sudoku {
    constructor() {
        this.grid = Array.from({ length: 9 }, () => Array(9).fill(0));
        this.numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.generateSudoku();
    }

    generateSudoku() {
        this.fillGrid();
        this.printGrid();
    }

    fillGrid() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === 0) {
                    const shuffledNumbers = this.shuffleArray([...this.numbers]);
                    for (let num of shuffledNumbers) {
                        if (this.isValidPlacement(num, row, col)) {
                            this.grid[row][col] = num;
                            if (this.fillGrid()) {
                                return true;
                            } else {
                                this.grid[row][col] = 0;
                            }
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    isValidPlacement(num, row, col) {
        // 檢查該行
        if (this.grid[row].includes(num)) {
            return false;
        }

        // 檢查該列
        for (let i = 0; i < 9; i++) {
            if (this.grid[i][col] === num) {
                return false;
            }
        }

        // 檢查3x3宮格
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.grid[startRow + i][startCol + j] === num) {
                    return false;
                }
            }
        }

        return true;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    printGrid() {
        this.grid.forEach(row => console.log(row.join(' ')));
    }
}

const grid = ref([]);
const givenCells = ref([]);
const difficulty = ref('easy');
let thisSudoku = null;
const hasSudoku = ref(false);
let sudokuCompleted = false;

const createEmptyGrid = () => {
    let grid = Array.from({ length: 9 }, () => {
        return Array(9).fill("");
    });
    return grid;
};

const generateSudoku = () => {
    grid.value = createEmptyGrid();
    console.time('Sudoku Generation Time');
    thisSudoku = new Sudoku();
    console.timeEnd('Sudoku Generation Time');
    grid.value = thisSudoku.grid;

    // 清空提示紀錄
    hintNum.value = 0;
    hintCells.value = [];

    applyDifficulty();
    hasSudoku.value = true;
    sudokuCompleted = false;
};

const applyDifficulty = () => {
    let cellsToFill;
    if (difficulty.value === 'easy') {
        cellsToFill = randomInt(36, 40);
    } else if (difficulty.value === 'medium') {
        cellsToFill = randomInt(31, 35);
    } else if (difficulty.value === 'hard') {
        cellsToFill = randomInt(27, 30);
    }

    grid.value = createEmptyGrid();

    const cellsToKeep = [];
    while (cellsToKeep.length < cellsToFill) {
        let row, col;
        do {
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
        } while (cellsToKeep.some(([r, c]) => r === row && c === col));

        cellsToKeep.push([row, col]);
    }

    cellsToKeep.forEach(([row, col]) => {
        grid.value[row][col] = thisSudoku.grid[row][col];
    });

    givenCells.value = cellsToKeep;
};

const isGivenCell = (row, col) => {
    return givenCells.value.some(([r, c]) => r === row && c === col);
};

const randomInt = (min, max) => {
    let num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

// 提示功能

const hintCells = ref([]);
const hintNum = ref(0);

const hint = () => {
    if (hintNum.value >= 3) {
        alert('已達提示上限！');
        return;
    }
    hintNum.value++;

    const emptyCells = [];
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid.value[row][col] === "") {
                emptyCells.push([row, col]);
            }
        }
    }

    if (emptyCells.length > 0) {
        const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

        grid.value[row][col] = thisSudoku.grid[row][col];
        hintCells.value.push([row, col]);
    }
};

const validateInput = (event, row, col) => {
    const input = event.target;
    const value = input.value;

    if (!/^[1-9]$/.test(value)) {
        input.value = "";
        grid.value[row][col] = "";
        return;
    }

    grid.value[row][col] = value;

    if (!sudokuCompleted && isSudokuCompleted()) {
        sudokuCompleted = true;
        setTimeout(() => {
            alert('恭喜，成功完成！');
        }, 150);
    }
};

const isSudokuCompleted = () => {
    return grid.value.flat().every(cell => cell !== "");
};

// 直接先生成一個簡單的
generateSudoku();

</script>

<style scoped>
p,
h2,
div,
button {
    font-family: var(--chinese-font);
    letter-spacing: 0.5px;
}

h2 {
    text-align: center;
    margin: 18px 0;
}

.intro_btn {
    display: block;
    margin: 0 auto;
    font-size: 1.25rem;
    border: none;
    background: transparent;
    cursor: pointer;
    color: #262689;
    font-weight: 600;
    text-decoration: underline;
}

.game_intro_container {
    padding: 0 12px;
}

.game_intro_container h3 {
    text-align: center;
    margin: 4px 0 16px;
}

.sudoku_button_container {
    margin: 16px 0;
}

.sudoku_button_container p::after {
    content: "選擇";
}

.sudoku_button_container label::after {
    content: "級";
}

.sudoku_button_container button {
    margin: 10px;
    font-size: 1.1rem;
    font-weight: 500;
    color: #f0f0f0;
    background: #333;
    border: 0;
    border-radius: 4px;
    padding: 4px 8px;
    cursor: pointer;
}


/* 數獨 */

.sudoku_grid {
    display: grid;
    grid-template-rows: repeat(9, 1fr);
    justify-items: center;
    width: fit-content;
    margin: 0 auto;
    border: 2px solid #333;
}

.sudoku_row {
    display: flex;
}

.sudoku_row:nth-child(3) input,
.sudoku_row:nth-child(6) input {
    border-bottom: 2px solid #333;
}

.sudoku_cell {
    width: 40px;
    height: 40px;
    text-align: center;
    font-size: 1.5rem;
    border: 1px solid #999;
    border-bottom: 0px;
    color: #3434f4;
}

.sudoku_cell:nth-child(3),
.sudoku_cell:nth-child(6) {
    border-right: 2px solid #333;
}

.sudoku_cell.hint {
    color: #359f9f;
}

.sudoku_cell:disabled {
    background-color: #d5e3ee;
    color: rgb(84, 84, 84);
}

@media screen and (max-width: 768px) {
    h2 {
        font-size: 22px;
        transition: all .25s ease-in;
    }

    .intro_btn {
        font-size: 1.15rem;
        transition: all .25s ease-in;
    }

    .sudoku_button_container p::after {
        display: none;
    }

    .sudoku_button_container label::after {
        display: none
    }

    .sudoku_button_container button {
        font-size: 1rem;
        transition: all .25s ease-in;
    }
}

@media screen and (max-width: 580px) {
    .sudoku_grid {
        margin-top: 40px;
    }
    .sudoku_cell {
        width: 32px;
        height: 32px;
        font-size: 1.2rem;
    }
    .sudoku_setting_container {
        height: calc(100% - 112px);
        display: flex;
        flex-direction: column;
    }
}

</style>