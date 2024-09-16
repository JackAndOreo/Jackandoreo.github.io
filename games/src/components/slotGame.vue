<template>
    <div class="slot_game_body">
        <h2>抽獎機</h2>
        <button class="intro_btn" @click="showPopup">遊戲說明</button>
        <popModel ref="popup" backgroundClose showAnimation @onShow="handleShow" @onClose="handleClose">
            <div class="game_intro_container">
                <h3>遊戲說明</h3>
                <p>＊請輸入一個最大值來啟動拉霸抽獎機。</p>
                <p>＊最高可以輸入 999 。</p>
                <p>＊抽獎機將隨機從 1 到設定的數字中抽取一個數字。</p>
                <p>＊可以用作抽獎活動使用。</p>
                <!-- <p>＊可以開啟連續抽取模式，並設定抽取次數，以達到自動連續抽取的效果。</p> -->
            </div>
        </popModel>
        <div class="slot_setting_container">
            <input type="text" v-model="maxValue" class="slot_game_input" placeholder="請輸入最大值" :max="999"
                @input="validateMaxValue" />
            <!-- 連續抽取選項 -->
            <!-- <div class="nonestop_setting df_jc_ac">
                <input type="checkbox" v-model="isNonStop" id="nonstop_checkbox">
                <label for="nonstop_checkbox">是否連續抽取</label>
            </div>
            <input type="text" v-model="drawCount" v-if="isNonStop" placeholder="請輸入次數" /> -->

            <!-- 抽獎拉霸機控制 -->
            <div class="slot_button_container df_jc_ac">
                <button @click="startSlotMachine">啟動</button>
                <button @click="resetSlotMachine">重置</button>
            </div>
            <!-- 抽獎拉霸機 -->
            <div class="slot_machine df_jc_ac">
                <div v-for="(slot, index) in slots" :key="index" class="slot_card_container">
                    <div class="slot_card df_jc_ac" :class="{ spin: isSpinning }" :style="getSlotStyle(index)">
                        <div v-for="number in numbers" :key="number">{{ number }}</div>
                    </div>
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
    
};

const handleClose = () => {
    
};

// 抽獎機功能

const maxValue = ref('');
const slots = ref([0, 0, 0]); // 初始三個slot
const isSpinning = ref(false); // 控制動畫
const numbers = Array.from({ length: 10 }, (_, i) => i); // 0到9的數字

const startSlotMachine = () => {
    if (!maxValue.value || maxValue.value < 1) {
        alert('請輸入有效的最大值');
        return;
    }

    isSpinning.value = true;

    setTimeout(() => {
        isSpinning.value = false;
        const result = getRandomNumber(maxValue.value);
        updateSlots(result);
    }, 2000);
};

const validateMaxValue = () => {
    maxValue.value = maxValue.value.replace(/\D/g, '');

    if (maxValue.value > 999) {
        maxValue.value = 999;
    }
};

const getRandomNumber = (max) => {
    return Math.floor(Math.random() * max) + 1;
};

const updateSlots = (result) => {
    const resultStr = result.toString().padStart(3, '0');
    slots.value = resultStr.split('').map(Number);
};

const getSlotStyle = (index) => {
    if (isSpinning.value) {
        return {
            transform: `translateY(-400%)`,
        };
    }
    return {
        transform: `translateY(-${slots.value[index] * 10}%)`,
    };
};

const resetSlotMachine = () => {
    slots.value = [0, 0, 0];
    isSpinning.value = false;
    maxValue.value = "";
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

.slot_setting_container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 1px;
}

.slot_setting_container input[type="text"] {
    display: block;
    margin: 16px auto;
    min-width: 160px;
    max-width: 160px;
    height: 40px;
    font-size: 1.25rem;
    border: 2px solid #333;
    text-align: center;
}

.slot_button_container button {
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

.nonestop_setting {
    margin-bottom: 14px;
}

.nonestop_setting input {
    display: block;
    margin: 6px;
    width: 16px;
    height: 16px;
    opacity: 0;
    cursor: pointer;
}

.nonestop_setting label {
    display: block;
    margin: 0;
    font-size: 1.15rem;
    position: relative;
}

.nonestop_setting label::before {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    position: absolute;
    top: 3px;
    left: -24px;
    content: "";
    pointer-events: none;
    box-sizing: border-box;
    opacity: 1;
    background: #FFF;
    border: 1px solid #575757;
}

.nonestop_setting label::after {
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    position: absolute;
    top: 7px;
    left: -20px;
    content: "";
    pointer-events: none;
    box-sizing: border-box;
    opacity: 1;
    background: #fff;
}

.nonestop_setting input:checked+label::before {
    background: #262689;
}

/* 抽獎拉霸機 */

.slot_machine {
    display: flex;
    gap: 8px;
    margin: 32px 0 16px;
}

.slot_card_container {
    height: 50px;
    width: 50px;
    overflow: hidden;
    border: 2px solid #333;
    position: relative;
}

.slot_card {
    display: flex;
    flex-direction: column;
    transition: transform 1s ease-in-out;
    font-size: 1.75rem;
}

.slot_card div {
    height: 50px;
    width: 100%;
    line-height: 46px;
    text-align: center;
}

.slot_card.spin {
    animation: spin 0.5s linear infinite;
}

@keyframes spin {
    0% {
        transform: translateY(0);
    }

    100% {
        transform: translateY(-100%);
    }
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

    .slot_setting_container input[type="text"] {
        font-size: 1.15rem;
        height: 36px;
        transition: all .25s ease-in;
    }

    .slot_button_container button {
        font-size: 1rem;
        transition: all .25s ease-in;
    }
}
</style>