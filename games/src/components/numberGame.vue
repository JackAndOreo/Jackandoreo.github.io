<template>
    <div class="number_game_body">
        <h2>猜數字遊戲</h2>
        <button @click="showPopup">遊戲說明</button>
        <popModel ref="popup" width="400" height="300" backgroundClose showAnimation @onShow="handleShow" @onClose="handleClose">
            <div class="game_intro_container">
            <p>＊猜一個四位數字，四位數中不會有重複的數字。</p>
            <p>＊每猜一次都可以獲得提示，提示以XAXB的方式進行，</p>
            <p>＊X表示位置正確的數的個數，Y表示數字正確而位置不對的數的個數。</p>
            <p>＊最多猜測8次，否則遊戲失敗。</p>
        </div>
        </popModel>
        <input type="text" class="number_game_input" v-model="inputValue" @input="validateInput" placeholder="請輸入數字"
            maxlength="4" :disabled="isGameOver" />
        <div class="number_button_container df_jc_ac">
            <button class="number_button guess_btn" @click="makeGuess" :disabled="isGameOver">猜猜看</button>
            <button class="number_button again_btn" @click="resetGame">再玩一次</button>
        </div>
        <div class="record_box">
            <div class="guess">
                <p>猜測紀錄</p>
                <p v-for="(guess, index) in guesses" :key="index">{{ guess }}</p>
            </div>
            <div class="record">
                <p>答案紀錄</p>
                <p v-for="(record, index) in records" :key="index">{{ record }}</p>
            </div>
            <div v-if="resultMessage != ''" class="message">{{ resultMessage }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import popModel from './popModel.vue';

// 彈窗引用

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

// 處理猜數字

let inputValue = ref('');
let resultMessage = ref('');
let guesses = ref([]);
let records = ref([]);
let correctAnswer = '';
let guessCount = ref(0);
let maxGuesses = 8;
let isGameOver = ref(false);
let numArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function validateInput(event) {
    let value = event.target.value;

    let uniqueDigits = [...new Set(value.replace(/\D/g, ''))];

    inputValue.value = uniqueDigits.join('');
}

function generateAnswer() {
    numArray.sort(() => 0.5 - Math.random());
    correctAnswer = numArray.slice(0, 4).join('');
    console.log('Correct Answer:', correctAnswer);
}

generateAnswer();

function makeGuess() {
    let guess = inputValue.value;
    if (guess.length !== 4) {
        resultMessage.value = '請輸入4位數字!';
        return;
    }

    guesses.value.push(guess);
    guessCount.value++;

    let A = 0;
    let B = 0;

    for (let i = 0; i < 4; i++) {
        if (guess.charAt(i) === correctAnswer.charAt(i)) {
            A++;
        } else if (correctAnswer.includes(guess.charAt(i))) {
            B++;
        }
    }

    records.value.push(`${A}A${B}B`);

    if (A == 4) {
        resultMessage.value = "BINGO！請點擊［再玩一次］重新開始。";
        isGameOver.value = true;
    } else if (guessCount.value === maxGuesses) {
        resultMessage.value = '遊戲失敗！';
    }

    inputValue.value = '';

}

function resetGame() {
    inputValue.value = '';
    resultMessage.value = '';
    guesses.value = [];
    records.value = [];
    isGameOver.value = false;
    generateAnswer();
}

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

.game_intro_container {
    padding: 0 20px;
}

.number_game_input {
    display: block;
    margin: 16px auto;
    min-width: 160px;
    max-width: 160px;
    height: 40px;
    font-size: 1.25rem;
    border: 2px solid #333;
    text-align: center;
}

.number_button {
    margin: 0 10px;
    font-size: 1.1rem;
    font-weight: 500;
    color: #f0f0f0;
    background: #333;
    border: 0;
    border-radius: 4px;
    padding: 4px 8px;
    cursor: pointer;
}

.record_box {
    display: grid;
    grid-template-areas: 'a b'
        'c c';

}

.record_box>div {
    margin: 0 auto;
}

.guess {
    grid-area: a;
    overflow-y: auto;
    width: 100%;
}

.record {
    grid-area: b;
    overflow-y: auto;
    width: 100%;
}

.guess>p:first-child,
.record>p:first-child {
    font-weight: 600;
    margin: 8px 0;
}

.message {
    grid-area: c;
    padding: 12px 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #6a0f0f;
}

.guess p,
.record p {
    text-align: center;
    font-size: 1.1rem;
    letter-spacing: 1px;
    margin: 4px 0;
}
</style>