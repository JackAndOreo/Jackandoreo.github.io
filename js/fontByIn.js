class FontByIn {
    constructor(target, texts, fontSize) {
        this.target = target;  //文字
        this.texts = texts;
        this.textsLength = null;
        this.fontSize = fontSize;  //文字
        this.init();
    }

    init() {
        this.appendHtml();
        this.appendCss();
    }

    processText() {
        let textArr = this.texts.split('');
        this.textsLength = textArr.length;
        let newTextHtml = `<div class="single_text_container">`;

        for (let i = 0; i < textArr.length; i++) {
            let spaceClass = (textArr[i] === ' ') ? ' space' : '';
            let textHtml = `<span class="single_text single_text_${i} ${spaceClass}">${textArr[i]}</span>`;
            newTextHtml += textHtml;
        }

        newTextHtml += `</div>`;

        return newTextHtml;
    }

    appendHtml() {
        let html = this.processText();

        $(`${this.target}`).append(html);
    }

    appendCss() {
        let cssContent = ``;
        for (let i = 0; i < this.textsLength; i++) {
            let css = `.single_text_${i} {
                animation: fontByIn .06s linear forwards ${i * 0.05}s; 
            }`;
            cssContent += css; 
        }

        let baseCss = `.single_text {
            font-size: ${this.fontSize}px;
            opacity: 0;
        }`;

        let animation = `@keyframes fontByIn {
            0% {
                opacity: 0;
                text-indent:
            }
            100% {
                opacity: 1;
            }
        }`;

        let cssHtml = `<style type="text/css" id="fontByIn">
            ${baseCss}
            ${animation}
            ${cssContent}
        </style>`

        $('head').append(cssHtml);
    }
}