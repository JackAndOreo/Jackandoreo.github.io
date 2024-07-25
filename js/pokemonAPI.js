
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

        var nameHtml = this.generateName();
        var typeHtml = this.generateType();
        var abilityHtml = this.generateAbility();
        var heldHtml = this.generateHeld();
        var strengthHtml = this.generateStrength();
        var imgHtml = this.generateImg();
        this.generateImg();

        var html = `<div class="book_border df_jc_ac" data-order="${this.index}" data-gif="${this.apiData.sprites.other.showdown.front_default}">
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
        var imgHtml = `<div class="pm_shiny bg_img"></div>
                    <img class="pm_img_default"src="${this.apiData.sprites.other['official-artwork'].front_default}" alt="${this.apiData.name}">
                    <img class="pm_img_shiny" src="${this.apiData.sprites.other['official-artwork'].front_shiny}" alt="${this.apiData.name}">`;

        return imgHtml;
    }

    generateName() {
        var name = this.apiData.name;
        var id = this.apiData.id;

        var newName = name.charAt(0).toUpperCase() + name.slice(1);
        var newId = id.toString().padStart(3, '0');

        var nameHtml = `<div class="pm_order">${newId}</div>
                        <div class="pm_name">${newName}</div>`

        return nameHtml;
    }

    generateType() {
        var types = this.apiData.types;
        var typeHtml = "";

        for (let type of types) {
            var typeName = type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1);
            typeHtml += `<div class="type" data-pmtype="${typeName}">${typeName}</div>`;
        }

        return typeHtml;
    }

    generateAbility() {
        var abilities = this.apiData.abilities;
        var abilityHtml = "";

        for (let ability of abilities) {
            if (!ability.is_hidden) {
                var abilityName = ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1);
                abilityHtml += `<div class="extension_value" data-ability="${abilityName}">${abilityName}</div>`
            }
        }

        return abilityHtml;
    }

    generateHeld() {
        var held = this.apiData.held_items;
        var heldHtml = "";
        if (held.length > 0) {
            var heldName = held[0].item.name.charAt(0).toUpperCase() + held[0].item.name.slice(1);
            heldHtml = `<div class="extension_value" data-held="${heldName}">${heldName}</div>`;
        } else {
            heldHtml = `<div class="extension_value">-</div>`;
        }

        return heldHtml;
    }

    generateStrength() {
        var strengths = this.apiData.stats;
        var strengthHtml = ``;

        for (let strength of strengths) {
            var statName = strength.stat.name.charAt(0).toUpperCase() + strength.stat.name.slice(1);

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
            var bar = $(strength).find('.strength_bar');
            var width = parseInt($(strength).data('strength'));
            bar.css({
                width: `${width}px`,
            })
        }
    }
}

let promises = [];
let randomArray = [];
let indices = Array.from({length: 151}, (_, i) => i + 1);


for (let i = 1; i < 152; i++) {
    let promise = new Promise((resolve, reject) => {
        new PokemonOperation(i, resolve);
        var possibility = Math.random();
        if (possibility < 0.125 && randomArray.length < 16) {
            randomArray.push(i);
        }
    });
    promises.push(promise);
}

Promise.all(promises).then(() => {


    // 重整順序
    var allbooks = $('.book_border').toArray().sort((a, b) => {
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

    var spinItems = $('.spin_item');
    for (let i = 0; i < randomArray.length; i++) {
        var order = randomArray[i];
        var img = $(`.book_border[data-order="${order}"] .pm_img img`).attr('src');
        var name = $(`.book_border[data-order="${order}"] .pm_name`).text();
        var imgHtml = `<img src="${img}" alt="${name}" data-order="${order}">`;
        $(spinItems[i]).append(imgHtml);
    }

    for (let item of spinItems) {
        let index = $(item).find('img').data('order');
        let target = ($(`.book_border[data-order="${index}"]`));
        $(item).off('click').on('click', function () {
            new PopModel({
                target: target,
                showAnimation: true,
                onShow: function() {
                    $('.popout_box .pm_shiny').off().on('click', function() {
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
            onShow: function() {
                $('.popout_box .pm_shiny').off().on('click', function() {
                    $('.popout_box .pm_img').toggleClass('switch');
                })
            },
        });
    });
});
