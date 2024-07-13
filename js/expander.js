class Expander {
    constructor(target, expandOptions, bgImage) {
        this.target = target; // jQuery 物件
        this.expandOptions = expandOptions; // 字串陣列
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
        this.target.on('mouseover', () => this.expansion());
        this.target.on('mouseleave', () => this.collapse());

        this.target[0].addEventListener('touchstart', () => this.expansion(), { passive: true });
        this.target[0].addEventListener('touchend', () => this.collapse(), { passive: true });

    }

    generateHtml() {
        let html = '';
        for (let option of this.expandOptions) {
            html += `<div class="option">${option}</div>`;
        }
        return `<div class="optionBox">${html}</div>`;
    }

    expansion() {
        if (this.animationInProgress || this.target.find('.option').length > 0) {
            return;
        }

        let html = this.generateHtml();
        this.target.append(html);

        console.log(this.newTargetWidth);
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
}