class FlewIn {
    constructor(target, selector, options = {}) {
        this.target = target;
        this.selector = selector;
        this.options = {
            topDistance: options.topDistance || 50,  // 觸發距離（以飛行目標再往上）
            flewDistanceRatio: options.flewDistanceRatio || 0.75,  // 飛行距離（以飛行目標為單位）
            flewInDirection: options.flewInDirection || 'left',
            flewInDuration: options.flewInDuration || 2, // 動畫時間
            delay: options.delay || 0,
            fadeIn: options.fadeIn !== undefined ? options.fadeIn : true,  // 是否要淡入淡出
            repeat: options.repeat || false, 
        };
        this.transCss = "";
        this.transCssClass = `${this.options.flewInDirection}Flw`;
        this.init();
    }

    init() {
        this.handleInitTarget(this.options.flewInDirection);
        $(window).on('scroll', () => this.handleScroll());
        this.inputAnimateToDom();
    }

    handleInitTarget(direction) {
        let flewDistance = null;
        switch (direction) {
            case "left":
                flewDistance = this.options.flewDistanceRatio * this.target.width();
                this.transCss = `translateX(-${flewDistance}px)`;
                break;
            case "right":
                flewDistance = this.options.flewDistanceRatio * this.target.width();
                this.transCss = `translateX(${flewDistance}px)`;
                break;
            case "top":
                flewDistance = this.options.flewDistanceRatio * this.target.height();
                this.transCss = `translateY(-${flewDistance}px)`;
                break;
            case "bottom":
                flewDistance = this.options.flewDistanceRatio * this.target.height();
                this.transCss = `translateY(${flewDistance}px)`;
                break;
        }

        this.target.css({
            'transform': this.transCss
        })
    }

    handleScroll() {
        for (let target of this.target) {
            let midOffset = $(target).offset().top + this.options.topDistance;
            let scrollAt = $(window).scrollTop() + $(window).innerHeight();
            // console.log(`上方距離:${midOffset}`, `當前位置:${scrollAt}`);
            if (scrollAt > midOffset) {
                $(target).addClass(`${this.transCssClass}`);
            } else if (this.options.repeat === false) {
                return;
            } else {
                $(target).removeClass(`${this.transCssClass}`);
            }
        }
    }

    inputAnimateToDom() {
        let opacity = this.options.fadeIn == true ? 0 : 1;
        let animationName = `${this.options.flewInDirection}In`;
        let selectorText = this.selector.trim();

        if (selectorText.startsWith('.')) {
            selectorText = selectorText.substring(1);
        } else if (selectorText.startsWith('#')) {
            selectorText = selectorText.substring(1);
        }

        if (!$(`style#${animationName}`).length) {
            let cssAnimation = `
            <style type="text/css" id="${selectorText}_${animationName}">
                ${this.selector} {
                    opacity: ${opacity};
                }
                .${this.transCssClass} {
                    animation: ${animationName} ${this.options.flewInDuration}s ${this.options.delay}s ease-in-out forwards;
                }
                @keyframes ${animationName} {
                    0% {
                        opacity: ${opacity};
                        transform: ${this.transCss};
                    }
                    100% {
                        opacity: 1;
                        transform: unset;
                    }
                }
            </style>`;

            $('head').append(cssAnimation);
        }
    }
}

// 示例：
// let flewOption = {
//     topDistance: 50,
//     flewDistanceRatio: 0.25,
//     flewInDirection: 'top',
//     flewInDuration: 1,
//     delay: 0,
//     fadeIn: true,
//     repeat: false,
// };

// new FlewIn($('.portfolio_content'), flewOption);


// 目前小問題
// 目標需要補上opacity: 0