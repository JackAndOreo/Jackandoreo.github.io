class TypeMachine {
    constructor(target, textContent, typeSpeed, delay = null, inputCursor = true) {
        this.target = target;
        this.textContent = textContent;
        this.typeSpeed = typeSpeed; // 輸入速度毫秒
        this.delay = delay; // 延遲毫秒
        this.inputCursor = inputCursor; // 是否要有鍵號
        this.cursorGenerated = false;  // 驗證是否有添加cursor 但忘記為甚麼加了
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
                $(`${this.target}`).addClass('cursor_hidden');
            }.bind(this), this.typeSpeed * 10);
        }
    }

    generateCursor() {
        // if (this.cursorGenerated) return;
        this.cursorGenerated = true;

        let fontSize = $(`${this.target}`).css('font-size');
        fontSize = parseInt(fontSize.replace("px", "").trim());

        let cursor = `<span class="cursor_blink">|</span>`;
        console.log($(`${this.target}`));
        $(`${this.target}`).append(cursor);

        let cssContent = `<style type="text/css">
            ${this.target} .cursor_blink {
                font-size: ${fontSize - 4}px;
                animation: cursorBlink 1s infinite;
            }
            ${this.target} {
                display: inline-block;
            }
            @keyframes cursorBlink {
                0%, 100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0;
                }
            }
            ${this.target}.cursor_hidden .cursor_blink {
                display: none;
            }
        </style>`;

        $('head').append(cssContent);
    }
}
