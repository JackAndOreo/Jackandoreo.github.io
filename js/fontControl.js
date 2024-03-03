
class lmFontCtrl {
    constructor(fontSizeVariableNames, fontSizeUnit, smallRate, BigRate){
        this.fontCtrl = {
            sml: smallRate,
            mid: 1,
            big: BigRate
        };
        this.fontSizeUnit = fontSizeUnit;
        this.saveData = {};
        this.saveDisplay = "";
        this.variableNames = fontSizeVariableNames;
        this.animationTargets = [
            "fixedFontCtrl",
            "fontBtnContainer",
            "putAwayBtn"
        ]
        this.init();
    }

    init(){
        this.initEvent();
    }

    initEvent(){
        $('.fontBox').off().on('click', this.ctrlSize.bind(this));
        $('.putAwayBtn').off().on('click',this.callBtns.bind(this));
        this.getSavedSelect();
        this.getSavedDisplay();
    }

    ctrlSize(e) {
        let em = e.currentTarget;
        let selectSize = $(em).attr('data-val');
    
        this.changeFontSize(selectSize);
    }

    getSavedSelect() {
        var data = localStorage.getItem("fontSize");
        if(data != "null" && data != null) {
            this.changeFontSize(data);
        }
    }

    getSavedDisplay() {
        var displayPattern = localStorage.getItem("fontSizeDisplay");
        if (displayPattern === "1" ) {
            this.callBtns();
        } else if (displayPattern === "0") {
        }
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

            localStorage.setItem("fontSize", value);
            
            // element.style.setProperty(variable, `${newSize}${this.fontSizeUnit}`);

            // 修復在safari中，修改CSS變數會有延遲的問題
            requestAnimationFrame(() => {
                element.style.setProperty(variable, `${newSize}${this.fontSizeUnit}`);
            });
        }
    }

    putAwayBtns() {
        for(let target of this.animationTargets) {
            $(`.${target}`).addClass('right');
            $(`.${target}`).removeClass('left');
            $(`.${target}`).removeClass('default');
        }
        $('.putAwayBtn').off().on('click',this.callBtns.bind(this));
        localStorage.setItem("fontSizeDisplay", "0");
    }

    callBtns() {
        for(let target of this.animationTargets) {
            $(`.${target}`).addClass('left');
            $(`.${target}`).removeClass('right');
            $(`.${target}`).removeClass('default');
        }
        $('.putAwayBtn').off().on('click',this.putAwayBtns.bind(this));
        localStorage.setItem("fontSizeDisplay", "1");
    }
}