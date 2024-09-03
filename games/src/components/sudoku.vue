<template>
    <div class="sudoku_game_body">
        <h2>數獨</h2>
        <button class="intro_btn" @click="showPopup">遊戲說明</button>
        <popModel ref="popup" backgroundClose showAnimation @onShow="handleShow" @onClose="handleClose">
            <div class="game_intro_container">
                <h3>遊戲說明</h3>
                <p>＊</p>
            </div>
        </popModel>
        <div class="sudoku_setting_container">
            <!-- 數獨控制 -->
            <div class="sudoku_button_container df_jc_ac">
                <button @click="generateSudoku">生成數獨</button>
                <p>難度選擇</p>
                <input type="radio" id="easy" value="easy" v-model="difficulty">
                <label for="easy">初级</label>
                <input type="radio" id="medium" value="medium" v-model="difficulty">
                <label for="medium">中级</label>
                <input type="radio" id="hard" value="hard" v-model="difficulty">
                <label for="hard">高级</label>
                <button @click="hint">提示</button>
            </div>
            <!-- 數獨 -->
            <div class="sudoku_grid">
                <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="sudoku_row">
                    <input v-for="(cell, colIndex) in row" :key="colIndex" type="text"
                        v-model="grid[rowIndex][colIndex]" :disabled="isGivenCell(rowIndex, colIndex)" maxlength="1"
                        :class="{ 'hint': hintCell && hintCell[0] === rowIndex && hintCell[1] === colIndex }"
                        class="sudoku_cell" />
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
    hintNum.value = 0;
    applyDifficulty();
};

const applyDifficulty = () => {
    let cellsToFill;
    if (difficulty.value === 'easy') {
        cellsToFill = randomInt(36, 40);
    } else if (difficulty.value === 'medium') {
        cellsToFill = randomInt(31, 35);
    } else {
        cellsToFill = randomInt(29, 30);
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

const hintCell = ref(null);
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

        hintCell.value = [row, col];
    }
};

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


/* 數獨 */

.sudoku_grid {
    display: grid;
    grid-template-rows: repeat(9, 1fr);
}

.sudoku_row {
    display: flex;
}

.sudoku_cell {
    width: 40px;
    height: 40px;
    text-align: center;
    font-size: 1.5rem;
}
</style>