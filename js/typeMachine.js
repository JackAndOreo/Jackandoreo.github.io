class TypeMachine {
    constructor(target, textContent, typeSpeed, delay = null, inputCursor = true) {
        this.target = target; 
        this.textContent = textContent;  
        this.typeSpeed = typeSpeed;  // 輸入速度毫秒
        this.delay = delay;  // 延遲毫秒
        this.inputCursor = inputCursor;  // 是否要有鍵號
        this.init();
    }

    init() {
        if (this.delay) {
            setTimeout(() => {
                this.typeEvent();
                if (this.inputCursor) this.generateCursor();
            }, this.delay);
            return;
        }
        this.typeEvent();
        if (this.inputCursor) this.generateCursor();
    }

    typeEvent(index = 0) {
        $(`${this.target}`).text(this.textContent.slice(0, index));
        index++;
        if (index <= this.textContent.length) {
            setTimeout(function () {
                this.typeEvent(index);
                if (this.inputCursor) this.generateCursor();
            }.bind(this), this.typeSpeed);
        } else if (this.inputCursor) {
            setTimeout(function () {
                $(`${this.target}`).addClass('cursor-hidden');
            }.bind(this), this.typeSpeed * 10);
        }
    }

    generateCursor() {
        let fontSize = $(`${this.target}`).css('font-size');
        fontSize = parseInt(fontSize.replace("px", "").trim());

        let cssContent = `<style type="text/css">
            ${this.target}::after {
                content: "|";
                font-size: ${fontSize - 3}px;
                animation: cursorBlink 1s infinite;
            }
            ${this.target} {
                display: flex;
            }
            @keyframes cursorBlink {
                0%, 100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0;
                }
            }
            ${this.target}.cursor-hidden::after {
                display: none;
            }
        </style>`;

        $('head').append(cssContent);
    }
}