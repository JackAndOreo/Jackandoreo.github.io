
class PokemonOperation {
    constructor(index, onComplete) {
        this.index = index;
        this.apiData = null;
        this.onComplete = onComplete;
        this.init();
    }

    init() {
        this.fetchPokemonData();
    }

    fetchPokemonData() {
        const url = `https://pokeapi.co/api/v2/pokemon/${this.index}/`;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                this.apiData = data;
                this.renderPokemon();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    renderPokemon() {
        if (!this.apiData) {
            console.error('No data available to render.');
            return;
        }

        let nameHtml = this.generateName();
        let typeHtml = this.generateType();
        let abilityHtml = this.generateAbility();
        let heldHtml = this.generateHeld();
        let strengthHtml = this.generateStrength();
        let imgHtml = this.generateImg();
        this.generateImg();

        let html = `<div class="book_border df_jc_ac" data-order="${this.index}" data-gif="${this.apiData.sprites.other.showdown.front_default}">
            <div class="book">
                <div class="pm_img">
                    ${imgHtml}
                </div>
                <div class="pm_text">
                    <div class="pm_title">
                        ${nameHtml}
                    </div>
                    <div class="pm_type">
                        ${typeHtml}
                    </div>
                </div>
                <div class="pm_extension">
                    <div class="extension">
                        <div class="extension_title">Abilities</div>
                        ${abilityHtml}
                    </div>
                    <div class="extension">
                        <div class="extension_title" data-held="">Held item</div>
                        ${heldHtml}
                    </div>
                    <div class="strength_box">
                        ${strengthHtml}
                    </div>
                </div>
            </div>
        </div>`;

        $('#pokemon_body .book_box').append(html);
        this.setStatLength();

        // onComplete
        if (typeof this.onComplete === 'function') {
            this.onComplete();
        }
    }

    generateImg() {
        let imgHtml = `<div class="pm_shiny bg_img"></div>
                    <img class="pm_img_default"src="${this.apiData.sprites.other['official-artwork'].front_default}" alt="${this.apiData.name}">
                    <img class="pm_img_shiny" src="${this.apiData.sprites.other['official-artwork'].front_shiny}" alt="${this.apiData.name}">`;

        return imgHtml;
    }

    generateName() {
        let name = this.apiData.name;
        let id = this.apiData.id;

        let newName = name.charAt(0).toUpperCase() + name.slice(1);
        let newId = id.toString().padStart(3, '0');

        let nameHtml = `<div class="pm_order">${newId}</div>
                        <div class="pm_name">${newName}</div>`

        return nameHtml;
    }

    generateType() {
        let types = this.apiData.types;
        let typeHtml = "";

        for (let type of types) {
            let typeName = type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1);
            typeHtml += `<div class="type" data-pmtype="${typeName}">${typeName}</div>`;
        }

        return typeHtml;
    }

    generateAbility() {
        let abilities = this.apiData.abilities;
        let abilityHtml = "";

        for (let ability of abilities) {
            if (!ability.is_hidden) {
                let abilityName = ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1);
                abilityHtml += `<div class="extension_value" data-ability="${abilityName}">${abilityName}</div>`
            }
        }

        return abilityHtml;
    }

    generateHeld() {
        let held = this.apiData.held_items;
        let heldHtml = "";
        if (held.length > 0) {
            let heldName = held[0].item.name.charAt(0).toUpperCase() + held[0].item.name.slice(1);
            heldHtml = `<div class="extension_value" data-held="${heldName}">${heldName}</div>`;
        } else {
            heldHtml = `<div class="extension_value">-</div>`;
        }

        return heldHtml;
    }

    generateStrength() {
        let strengths = this.apiData.stats;
        let strengthHtml = ``;

        for (let strength of strengths) {
            let statName = strength.stat.name.charAt(0).toUpperCase() + strength.stat.name.slice(1);

            strengthHtml += `<div class="strength" data-strength="${strength.base_stat}">
                                <div class="strength_title">${statName}</div>
                                <div class="strength_value">${strength.base_stat}</div>
                                <div class="strength_bar"></div>
                            </div>`
        }

        return strengthHtml;
    }

    setStatLength() {
        let strengths = $(`.book_border[data-order="${this.index}"] .strength`);
        for (let strength of strengths) {
            let bar = $(strength).find('.strength_bar');
            let width = parseInt($(strength).data('strength')) * 0.8;
            bar.css({
                width: `${width}px`,
            })
        }
    }
}

let promises = [];
let randomArray = [];

let ranges = [
    [1, 151],
    [152, 251],
    [252, 386],
    [387, 493],
    [494, 649]
];

let selectedRange = ranges[Math.floor(Math.random() * ranges.length)];
let indices = Array.from({ length: selectedRange[1] - selectedRange[0] + 1 }, (_, i) => i + selectedRange[0]);
console.log(selectedRange);

for (let i = selectedRange[0]; i <= selectedRange[1]; i++) {
    let promise = new Promise((resolve, reject) => {
        new PokemonOperation(i, resolve);
        let possibility = Math.random();
        if (possibility < 0.125 && randomArray.length < 16) {
            randomArray.push(i);
        }
    });
    promises.push(promise);
}

Promise.all(promises).then(() => {


    // 重整順序
    let allbooks = $('.book_border').toArray().sort((a, b) => {
        return $(a).data('order') - $(b).data('order');
    });

    $('#pokemon_body .book_box').empty();

    allbooks.forEach(book => {
        $('#pokemon_body .book_box').append(book);
        if ($('body').hasClass('isMobile')) {

        } else {
            new FollowImg($(book), 8, 8, 54, 54);
        }
    });

    // 處理轉圈圈
    // 檢查數量
    while (randomArray.length < 16) {
        let remainingIndices = indices.filter(index => !randomArray.includes(index));
        let randomIndex = Math.floor(Math.random() * remainingIndices.length);
        randomArray.push(remainingIndices[randomIndex]);
    }

    let spinItems = $('.spin_item');
    for (let i = 0; i < randomArray.length; i++) {
        let order = randomArray[i];
        let img = $(`.book_border[data-order="${order}"] .pm_img img`).attr('src');
        let name = $(`.book_border[data-order="${order}"] .pm_name`).text();
        let imgHtml = `<img src="${img}" alt="${name}" data-order="${order}">`;
        $(spinItems[i]).append(imgHtml);
    }

    for (let item of spinItems) {
        let index = $(item).find('img').data('order');
        let target = ($(`.book_border[data-order="${index}"]`));
        $(item).off('click').on('click', function () {
            new PopModel({
                target: target,
                showAnimation: true,
                onShow: function () {
                    $('.popout_box .pm_shiny').off().on('click', function () {
                        $('.popout_box .pm_img').toggleClass('switch');
                    })
                },
            });
        })
    }


    // 處理POP OUT
    $('.book_border').off('click').on('click', function () {
        new PopModel({
            target: this,
            showAnimation: true,
            onShow: function () {
                $('.popout_box .pm_shiny').off().on('click', function () {
                    $('.popout_box .pm_img').toggleClass('switch');
                })
            },
        });
    });

    // LOADING完成 
    // 確保圖片都下載完成
    let pmImgs = $('.pm_img img');
    // console.log(pmImgs.length);
    let loadedImagesCount = 0;

    pmImgs.each((index, img) => {
        $(img).on('load', () => {
            loadedImagesCount++;
            // console.log(loadedImagesCount);

            if (loadedImagesCount >= (pmImgs.length / 2)) {
                $('#loading_page').hide();
                $('#pokemon_body').css({
                    display: 'flex',
                });
                $('#zoomIn').show();
                // 原本想要製作圖鑑展開動畫，捨棄
                // let currentHeight = $('.handbook_part').innerHeight();
                // $('.handbook_part').css('--book-height', `${currentHeight}px`);
                // let animationDuration = Math.floor(currentHeight / 600);
                // $('.handbook_part').css('--animation-duration', `${animationDuration}s`);
                // console.log(currentHeight, animationDuration);

                // $('.handbook_part').addClass('started');
            }
        });
    });
});


// 可以使用/generation/1/，但回傳後仍要用裡面的資料逐一去跑API。
// 可以使用/type/water，但與上面的篩選沒辦法同時使用。
