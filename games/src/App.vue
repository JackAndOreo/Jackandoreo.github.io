<template>
    <div id="game_center_body">
        <!-- Loading page -->
        <div v-if="isLoading" id="loading_page" class="df_jc_ac">
            <div class="loading_layer"></div>
            <div class="loading_box df_jc_ac">
                <div class="loading_border loading_top_border"></div>
                <div class="loading_border loading_btm_border"></div>
                <div class="loading_text_container df_jc_ac">
                    <div class="loading_text">
                        Loading...
                    </div>
                </div>
                <div class="loading_bar_container df_jc_ac">
                    <div class="loading_bar df_jc_ac">
                        <div v-for="n in displayedCubes" :key="n"
                            :class="['loading_bar_cube', { loaded: n < displayedCubes }]"></div>
                    </div>
                    <div class="loading_bar_layor"></div>
                </div>
            </div>
        </div>
        <!-- GAME BODY START -->
        <div id="center_body" v-else>
            <!-- LOGO -->
            <div id="zoomIn">
                <div class="logo_container">
                    <a href="/../Jackandoreo.github.io/index.html" rel="noopener noreferrer">
                        <div class="logo">Liam</div>
                        <div class="logo_text">Front-end Developer</div>
                    </a>
                </div>
            </div>
            <!-- MAIN BODY -->
            <div id="main_body" class="df_jc_ac" :class="{ ready_filter: !isLoading }">
                <div id="game_bg" class="bg_img"></div>
                <div class="game_menu_container" :class="{ activated: activatedMenu, firstActivated: firstActivated }">>
                    <div class="game_menu_title_container">
                        <div class="game_menu_title">GAME CENTER</div>
                    </div>
                    <!-- 手機板 -->
                    <div class="game_menu_option_container_mobile bg_img" :class="{ leftMenuActive: isLeftMenuActive }"
                        @click="toggleMenu()">
                        <div class="mobile_menu_container">
                            <div class="option_btn" :class="{ active: selectedMenu === 'game' }"
                                @click="menuSelect('game')">GAMES</div>
                            <div class="option_btn" :class="{ active: selectedMenu === 'options' }"
                                @click="menuSelect('options')">OPTIONS</div>
                            <div class="option_btn" :class="{ active: selectedMenu === 'leave' }"
                                @click="menuSelect('leave')">LEAVE</div>
                        </div>
                        <div class="mobile_menu_shadow"></div>
                    </div>
                    <!-- 一般目錄 -->
                    <div class="game_menu_option_container">
                        <div class="option_btn" :class="{ active: selectedMenu === 'game' }"
                            @click="menuSelect('game')">GAMES</div>
                        <div class="option_btn" :class="{ active: selectedMenu === 'options' }"
                            @click="menuSelect('options')">OPTIONS</div>
                        <div class="option_btn" :class="{ active: selectedMenu === 'leave' }"
                            @click="menuSelect('leave')">LEAVE</div>
                    </div>
                </div>
                <div v-if="selectedMenu === 'game'" class="games_container df_jc_ac">
                    <div v-if="selectedGame === ''" class="games_body container_body">
                        <div class="games_card" @click="gameSelect('numbers')">
                            <div class="games_img">
                                <img src="/img/smallGameBg1.jpg" alt="">
                            </div>
                            <div class="games_title_bg"></div>
                            <div class="games_title">猜數字遊戲</div>
                        </div>
                        <div class="games_card" @click="gameSelect('slot')">
                            <div class="games_img">
                                <img src="/img/smallGameBg1.jpg" alt="">
                            </div>
                            <div class="games_title_bg"></div>
                            <div class="games_title">抽獎機</div>
                        </div>
                        <!-- <div class="games_card" @click="gameSelect('dice')">
                            <div class="games_img">
                                <img src="/img/Technic2.jpg" alt="">
                            </div>
                            <div class="games_title_bg"></div>
                            <div class="games_title">骰盅</div>
                        </div> -->
                        <div class="games_card" @click="gameSelect('sudoku')">
                            <div class="games_img">
                                <img src="/img/smallGameBg1.jpg" alt="">
                            </div>
                            <div class="games_title_bg"></div>
                            <div class="games_title">數獨</div>
                        </div>
                    </div>
                    <numberGame v-if="selectedGame === 'numbers'" class="container_body"></numberGame>
                    <slotGame v-if="selectedGame === 'slot'" class="container_body"></slotGame>
                    <sudoku v-if="selectedGame === 'sudoku'" class="container_body"></sudoku>
                </div>
                <div v-if="selectedMenu === 'options'" class="options_container">
                    <!-- Option -->
                    <div class="options_body container_body">
                        <p>There is nothing here yet.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import numberGame from './components/numberGame.vue';
import slotGame from './components/slotGame.vue';
import sudoku from './components/sudoku.vue';

// 確認加載狀態
// 預先加載背景圖片
const isLoading = ref(true);
const progress = ref(0); // 加載進度(0 - 100)
const totalCubes = 10; // 總共顯示的 cube 數量
const displayedCubes = ref(0);

const imagesToPreload = ['/img/Technic2.jpg', '/vuegame/img/Technic2.jpg'];

const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = () => reject(src); // 失敗時，reject 並傳回圖片路徑
    });
};

const updateLoadingProgress = () => {
    displayedCubes.value = Math.round((progress.value / 100) * totalCubes);
};

const simulateLoading = (loadingDuration = 2000) => {
    const interval = 100; // 每次進度更新的間隔
    const step = (100 / (loadingDuration / interval));

    const loadingInterval = setInterval(() => {
        if (progress.value < 100) {
            progress.value += step;
            updateLoadingProgress();
        } else {
            clearInterval(loadingInterval);
            isLoading.value = false;
        }
    }, interval);
};

onMounted(async () => {
    for (const imagePath of imagesToPreload) {
        try {
            await preloadImage(imagePath);
            simulateLoading(); 
            break; // 成功加載一張圖片就退出
        } catch (errorPath) {
            console.error(`圖片加載失敗，路徑: ${errorPath}`); // 打印失敗的圖片路徑
        }
    }
    simulateLoading(3000);
});

// 處理目錄選擇功能

const selectedMenu = ref('');
const firstActivated = ref(false);
const activatedMenu = ref(false);

function menuSelect(value) {
    const isMobile = window.innerWidth <= 600 ? true : false;
    if (value === "leave") {
        if (selectedMenu.value === "") {
            // 返回LIAM首頁
            window.location.href = 'https://jackandoreo.github.io/index.html';
        } else {
            // 返回遊戲中心首頁
            resetState();
        }
    } else {
        if (selectedMenu.value !== "") {
            // 進入菜單頁
            selectedMenu.value = value;
            selectedGame.value = "";
        } else if (isMobile) {
            // 手機版直接套用手機板菜單class
            selectedMenu.value = value;
            activatedMenu.value = true;
            firstActivated.value = false;
            selectedGame.value = "";
        } else {
            // 一般情況（動畫）
            selectedMenu.value = value;
            firstActivated.value = true;
            selectedGame.value = "";
            setTimeout(() => {
                firstActivated.value = false;
                activatedMenu.value = true;
            }, 500);
        }
    }
}

function resetState() {
    selectedMenu.value = '';
    activatedMenu.value = false;
    selectedGame.value = '';
}

// 處理手機板側邊欄

const isLeftMenuActive = ref(false);

function toggleMenu() {
    isLeftMenuActive.value = !isLeftMenuActive.value;
}


// 處理遊戲選擇功能

const selectedGame = ref('');

function gameSelect(value) {
    selectedGame.value = value;
    // console.log(selectedGame.value);
}

// 處理Safari 100vh相關問題

function detectBrowser() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
    const isChrome = /chrome/i.test(userAgent) && !isSafari;

    return { isSafari, isChrome };
}

function setVHProperty() {
    const windowsVH = window.innerHeight / 100;
    document.documentElement.style.setProperty('--vh', `${windowsVH}px`);
}

onMounted(() => {
    const { isSafari, isChrome } = detectBrowser();

    if (isSafari || isChrome) {
        setVHProperty();
    }

    if (isSafari) {
        document.body.classList.add('isSafari');
    }
});

</script>

<style scoped>
/* LOGO */

#zoomIn {
    position: absolute;
    z-index: 99;
}

.logo_container {
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
    margin: 0 0 0 16px;
    filter: invert(100%) sepia(4%) saturate(214%) hue-rotate(292deg) brightness(112%) contrast(88%);
}

.logo {
    font-family: "Knewave", system-ui;
    font-weight: 400;
    font-style: normal;
    font-size: 48px;
    transition: all 0.25s ease-in;
}

.logo_text {
    font-family: 'Inter';
    white-space: nowrap;
    font-size: 13px;
    transition: all 0.25s ease-in;
}

@media screen and (max-width: 600px) {
    .logo {
        font-size: 36px;
    }

    .logo_text {
        font-size: 12px;
    }
}


/* 主區塊 MENU */

#main_body {
    width: 100%;
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
    flex-direction: column;
    position: relative;
    overflow: hidden;
    padding: 40px;
}

#main_body.ready_filter {
    animation: bodyFilter .2s ease-in forwards .75s;
}

@keyframes bodyFilter {
    0% {
        background-color: transparent;
    }
    100% {
        background-color: #f16bd7;
    }
}

#game_bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url(/img/Technic2.jpg);
    background-size: cover;
    filter: blur(0.3px) contrast(0.9);
    opacity: 0.92;
    user-select: none;
    left: 0;
    top: 0;
}

.game_menu_container {
    height: clamp(45vh, 380px, 60vh);
}

.game_menu_container.firstActivated {
    height: unset;
}

.game_menu_container.activated {
    height: unset;
}

.game_menu_title_container {
    transform-style: preserve-3d;
    perspective: 320px;
}

.game_menu_title {
    font-size: 5.8rem;
    font-family: "New Amsterdam", sans-serif;
    transform: rotateY(15deg) translateX(5px) translateZ(95px);
    text-shadow: 5px 5px 3px #1e1e1e;
    color: #e5e5e5;
    user-select: none;
    /* margin-bottom: 80%; */
}


.game_menu_option_container {
    position: absolute;
    left: calc((100% - 350px) / 2);
    top: calc((100% - 224px) / 2 + 50px);
    max-width: 350px;
    font-size: 3.35rem;
    font-family: "New Amsterdam", sans-serif;
    z-index: 3;
}

.option_btn {
    margin: 20px 0;
    letter-spacing: 1px;
    cursor: pointer;
    width: fit-content;
    color: #e5e5e5;
    text-shadow: 0 0 6px black;
}

.option_btn:hover {
    font-weight: 600;
    text-shadow: 3px 3px 3px #33333347;
}

.option_btn:active {
    font-weight: 600;
    text-shadow: 3px 3px 3px #33333347;
}

@media screen and (max-width: 600px) {
    .game_menu_container {
        height: clamp(42vh, 360px, 56vh);
    }

    .game_menu_container.activated {
        height: unset;
    }

    .game_menu_title {
        font-size: 3.6rem;
        transition: all 0.25s ease-in;
        transform: rotateY(15deg) translateX(-10px) translateZ(90px);
        /* margin-bottom: 105%; */
    }

    .game_menu_option {
        font-size: 2.25rem;
        transition: all 0.25s ease-in;
    }

    .game_menu_option p {
        padding-left: 40px;
    }

    .game_menu_option_container {
        left: calc((100% - 350px) / 2 + 28px);
        transition: all .25s ease-in;
    }
}

/* 處理按鈕點擊後 */

.game_menu_container.firstActivated .game_menu_title_container {
    display: none;
}

.game_menu_container.activated .game_menu_title_container {
    display: none;
}

.game_menu_container.firstActivated .game_menu_option_container {
    animation: menuActivated .33s linear forwards;
}

.game_menu_container.activated .game_menu_option_container {
    left: 20px;
    top: 125px;
    font-size: 1.85rem;
}


@keyframes menuActivated {
    0% {
        left: calc((100% - 350px) / 2);
        top: calc((100% - 224px) / 2 + 50px);
        font-size: 3.35rem;
    }

    100% {
        left: 20px;
        top: 125px;
        font-size: 1.85rem;
    }
}

.option_btn.active {
    position: relative;
    font-weight: bold;
    animation: optionActivated .3s forwards .33s;
}

@keyframes optionActivated {
    0% {
        text-indent: 0px;
    }

    100% {
        text-indent: 20px;
    }
}

.option_btn.active::before {
    content: "";
    position: absolute;
    height: 1px;
    width: 0px;
    left: 2px;
    background-color: #fff;
    top: calc(50% - .5px);
    animation: optionActivatedLine .3s forwards .4s;
}

@keyframes optionActivatedLine {
    0% {
        width: 0px;
    }

    100% {
        width: 14px;
    }
}

/* 處理手機板目錄 */

.game_menu_option_container_mobile {
    display: none;
}

@media screen and (max-width: 600px) {
    .game_menu_option_container:has(.active) {
        display: none;
    }

    .game_menu_container.activated .game_menu_option_container_mobile {
        display: block;
        position: absolute;
        left: 0;
        top: 30vh;
        height: 33vh;
        width: 20px;
        background-color: #d9d9d9;
        cursor: pointer;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        background-image: url(/img/arrow_right.svg);
        background-size: 30px;
    }

    .mobile_menu_container {
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        height: calc(var(--vh, 1vh) * 100);
        width: 190px;
        background-color: #d9d9d9;
        z-index: 101;
        box-shadow: 0 0 13px -4px #333;
        transform: translateX(-200px);

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
    }

    .leftMenuActive .mobile_menu_container {
        animation: leftMobMenuIn .5s ease-in-out forwards;
    }

    @keyframes leftMobMenuIn {
        0% {
            transform: translateX(-200px);
        }

        100% {
            transform: translateX(0px);
        }
    }

    .mobile_menu_container .option_btn {
        color: #333;
        text-shadow: unset;
        font-family: "New Amsterdam", sans-serif;
        font-size: 1.75rem;
        padding-left: 24px;
    }

    .mobile_menu_container .option_btn.active::before {
        left: 24px;
        background-color: #333;
    }

    .mobile_menu_shadow {
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        height: calc(var(--vh, 1vh) * 100);
        width: 100vw;
        background-color: #333;
        z-index: 100;
        transform: translateX(-100%);
        opacity: 0.75;
    }

    .leftMenuActive .mobile_menu_shadow {
        animation: leftMobMenuBgIn .5s ease-in-out forwards;
    }

    @keyframes leftMobMenuBgIn {
        0% {
            transform: translateX(-100%);
            opacity: 0.75;
        }

        100% {
            transform: translateX(0%);
            opacity: 0.525;
        }
    }
}


/* 遊戲頁 */

.games_container {
    width: calc(90% - 90px);
    height: 100%;
    background-color: #ffffff70;
    position: relative;
    align-self: flex-end;
    border-radius: 25px;
    padding: 16px;
}

.games_body {
    display: grid;
    row-gap: 20px;
    column-gap: 20px;
    padding: 20px;
    grid-template-columns: repeat(auto-fill, minmax(215px, 1fr));
}

.container_body {
    width: 100%;
    height: 100%;
    background-color: #cbcacac2;
    border-radius: 20px;
    box-shadow: 0px 0px 11px -2px #6e6e6e;
}

.games_card {
    position: relative;
    /* aspect-ratio: 1; */
    border-radius: 15px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    cursor: pointer;
    max-height: 260px;
}

.games_img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}

.games_img img {
    height: 100%;
    object-fit: cover;
    filter: hue-rotate(48deg);
}

.games_title_bg {
    background-image: linear-gradient(0deg, #1b1b1b 48%, #1b1b1b, transparent, transparent);
    width: 100%;
    position: relative;
    height: 64px;
}

.games_title {
    position: absolute;
    font-size: 1.25rem;
    font-family: var(--chinese-font);
    font-weight: 500;
    color: #f0f0f0;
    left: 12px;
    bottom: 12px;
    letter-spacing: 0.5px;
}

@media screen and (max-width: 768px) {
    #main_body {
        padding: 40px 26px;
    }

    .games_container {
        width: calc(90% - 64px);
    }
}

@media screen and (max-width: 600px) {
    #main_body {
        padding: 65px 20px 40px;
    }

    .games_container {
        width: 100%;
        padding: 12px;
    }
}

/* Option 選項頁 */

.options_container {
    width: calc(90% - 90px);
    height: 100%;
    background-color: #ffffff70;
    position: relative;
    align-self: flex-end;
    border-radius: 25px;
    padding: 16px;
}

.options_body {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    color: #333;
    font-family: "New Amsterdam", sans-serif;
}

@media screen and (max-width: 768px) {
    .options_container {
        width: calc(90% - 64px);
    }
}

@media screen and (max-width: 600px) {
    .options_container {
        width: 100%;
    }
}

/* 載入頁 */

#loading_page {
    width: 100%;
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
    position: relative;
    background-color: #031221;
}

.loading_layer {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0.3;
    /* background-image: linear-gradient(45deg, #333, #888, #444, #777, #333); */
}

.loading_box {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-column-gap: 16px;
    -moz-column-gap: 16px;
    column-gap: 16px;
    position: relative;
    flex-direction: column;
    width: 100%;
    height: 80%;
}

.loading_border {
    position: absolute;
    width: 100%;
    height: 3px;
    box-shadow: 0 0px 37px 1px #03e9e7;
    background: #03e9e7;
}

.loading_top_border {
    top: 0;
    left: 0;
}

.loading_btm_border {
    bottom: 0;
    left: 0;
}

.loading_bar_container {
    width: 285px;
    height: 48px;
    background: #888;
    clip-path: polygon(11% 0, 100% 0%, 89% 100%, 0% 100%);
    position: relative;
    z-index: 2;
}

.loading_bar {
    width: calc(100% - 20px);
    height: calc(100% - 8px);
    background: #333;
    clip-path: polygon(12% 0, 100% 0%, 88% 100%, 0% 100%);
    column-gap: 2px;
    justify-content: flex-start;
}

.loading_bar_cube {
    width: calc((100% - 28px) / 10);
    height: calc(100% - 8px);
    background-color: #40c3c2;
    filter: contrast(0.2);
}

.loading_bar_cube.loaded {
    filter: unset;
}

.loading_text {
    color: #fff;
    font-size: 2.1rem;
    font-family: "Pixelify Sans", sans-serif;
    font-optical-sizing: auto;
    font-weight: 500;
    font-style: normal;
    margin-bottom: 8px;
}
</style>
