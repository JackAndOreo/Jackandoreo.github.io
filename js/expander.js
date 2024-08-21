class Expander {
    constructor(target, expandOptions, expandOptionsLink, bgImage) {
        this.target = target; // jQuery 物件
        this.expandOptions = expandOptions; // 字串陣列
        this.expandOptionsLink = expandOptionsLink; // 字串陣列
        this.originalWidth = this.target.width();
        this.newTargetWidth = 0;
        this.optionLength = this.expandOptions.length;
        this.animationInProgress = false; // 是否正在進行動畫
        this.bgImage = bgImage;
        this.init();
    }

    init() {
        this.setupHiddenBox();
        this.mouselistener();
    }

    setupHiddenBox() {
        $('body').append(`<div class="hiddenBox optionBox"></div>`);
        let hiddenBox = $('.hiddenBox');
        let html = this.generateHtml();
        hiddenBox.append(html);
        this.newTargetWidth = hiddenBox[0].scrollWidth;
        hiddenBox.hide();
    }

    mouselistener() {
        if ($('body').hasClass('isMobile')) {
            this.expansion();
            return;
        }

        this.target.on('mouseover', () => this.expansion());
        this.target.on('mouseleave', () => this.collapse());

        this.target[0].addEventListener('touchstart', () => this.expansion(), { passive: true });
        this.target[0].addEventListener('touchend', () => this.collapse(), { passive: true });
    }

    generateHtml() {
        let html = '';
        for (let i = 0; i < this.expandOptions.length; i++) {
            if (this.expandOptionsLink[i].includes('https')) {
                html += `<div class="option"><a href="${this.expandOptionsLink[i]}" target="_blank" rel="">${this.expandOptions[i]}</a></div>`;
            } else {
                html += `<div class="option" data-link="${this.expandOptionsLink[i]}">${this.expandOptions[i]}</div>`;
            }
        }
        return `<div class="optionBox">${html}</div>`;
    }

    expansion() {
        if (this.animationInProgress || this.target.find('.option').length > 0) {
            return;
        }

        let html = this.generateHtml();
        this.target.append(html);

        this.setUpOnclick();
        this.animateWidth(this.newTargetWidth);
    }

    collapse() {
        if (this.animationInProgress) {
            return;
        }

        this.target.find('.optionBox').remove();
        this.animateWidth(this.originalWidth, this.bgImage);
    }

    animateWidth(width, bgImage = "none") {
        this.animationInProgress = true;

        this.target.css('backgroundImage', bgImage);
        this.target.animate({
            width: `${width}px`,
        }, 75 * this.optionLength, () => {
            this.animationInProgress = false;
        });
    }

    setUpOnclick() {
        let options = this.target.find('.option');

        options.off('click').on('click', (e) => {
            let targetLink = $(e.target).data('link');
            let targetElement = $(targetLink);

            if (targetElement.length) {
                $('html, body').animate({
                    scrollTop: targetElement.offset().top
                }, 800);
            }
        });
    }
}