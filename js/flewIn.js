class FlewIn {
    constructor(target, options = {}) {
        this.target = target;
        this.options = {
            topDistance: options.topDistance || 50,
            flewDistanceRatio: options.flewDistanceRatio || 0.75,
            flewInDirection: options.flewInDirection || 'left',
            flewInDuration: options.flewInDuration || 2,
            delay: options.delay || 0,
            fadeIn: options.fadeIn !== undefined ? options.fadeIn : true,
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
        let flewDistance = this.options.flewDistanceRatio * this.target.width();
        switch (direction) {
            case "left":
                this.transCss = `translateX(-${flewDistance}px)`;
                break;
            case "right":
                this.transCss = `translateX(${flewDistance}px)`;
                break;
            case "top":
                this.transCss = `translateY(-${flewDistance}px)`;
                break;
            case "bottom":
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
            if (scrollAt > midOffset) {
                $(target).addClass(`${this.transCssClass}`);
            } else {
                $(target).removeClass(`${this.transCssClass}`);
            }
        }
    }

    inputAnimateToDom() {
        let opacity = this.options.fadeIn == true ? 0 : 1;
        let animationName = `${this.options.flewInDirection}In`;

        if (!$(`style#${animationName}`).length) {
            let cssAnimation = `
            <style type="text/css" id="${animationName}">
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

