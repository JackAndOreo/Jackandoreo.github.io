class FontCtrl {
    constructor(fontSizeVariableNames, fontSizeUnit, smallRate, BigRate, appendLocation) {
        this.fontCtrl = {
            sml: smallRate,
            mid: 1,
            big: BigRate
        };
        this.fontSizeUnit = fontSizeUnit;
        this.appendLocation = appendLocation;
        this.saveData = {};
        this.variableNames = fontSizeVariableNames;
        this.init();
    }

    init() {
        this.initHtml();
        this.initEvent();
    }

    initHtml() {
        let fontBtnsHtml =
        `<div class="FontCtrl default">
            <div class="fontBtnContainer default">
                <div class="fontBox" data-val="sml">
                    <div class="smallFt">S</div>
                </div>
                <div class="fontBox" data-val="mid">
                    <div class="midFt">M</div>
                </div>
                <div class="fontBox" data-val="big">
                    <div class="bigFt">L</div>
                </div>
            </div>
        </div>`;

        this.appendLocation.append(fontBtnsHtml);
    }

    initEvent() {
        $('.fontBox').off().on('click', this.ctrlSize.bind(this));
    }

    ctrlSize(e) {
        let em = e.currentTarget;
        let selectSize = $(em).attr('data-val');

        this.changeFontSize(selectSize);
    }

    changeFontSize(value) {
        let element = document.documentElement;
        for (let variable of this.variableNames) {
            if (!this.saveData[variable]) {
                let currentFontSize = getComputedStyle(element).getPropertyValue(variable).trim();
                currentFontSize = parseFloat(currentFontSize.split(`${this.fontSizeUnit}`)[0]);
                this.saveData[variable] = currentFontSize;
            }

            let newSize = this.saveData[variable] * this.fontCtrl[value];

            // 修復在safari中，修改CSS變數會有延遲的問題
            requestAnimationFrame(() => {
                element.style.setProperty(variable, `${newSize}${this.fontSizeUnit}`);
            });
        }
    }
}