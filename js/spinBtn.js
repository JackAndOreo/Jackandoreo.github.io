// 捨棄

class SpinBtn {
    constructor(putInBtns, targetLocation, basicCss = true) {
        this.putInBtns = putInBtns;    // 字串或字串陣列
        this.targetLocation = targetLocation;
        this.basicCss = basicCss;
        this.init();
    }

    init() {
        this.initHtml();
        console.log(1);
        this.initEvent();
    }

    initHtml() {
        let cardHtml = this.getCardHtml();
        console.log(cardHtml);
        if (cardHtml) {
            let containerHtml = `<div class="spin_container">${cardHtml}</div>`;
            this.targetLocation.append(containerHtml);
        }
    }

    initEvent() {
        $('.spin_container .spin_card').off().on('click',this.spinExpand.bind(this));
    }

    getCardHtml() {
        let putInBtnsArray = Array.isArray(this.putInBtns) ? this.putInBtns : this.putInBtns.split(',');
        if (!putInBtnsArray.length) return '';
    
        let cardHtml = '';
        let i = 0;
        for (let btn of putInBtnsArray) {
            let $btns = $(`${btn.trim()}`);
            console.log(btn, $btns);
            $btns.each(function() {
                let $btn = $(this);
                let $copyItem = $btn.clone(true); 
                i++;
                cardHtml += `<div class="spin_card spin_card${i}">${$copyItem.prop('outerHTML')}</div>`;
                $btn.hide();
            });
        }
        return cardHtml;
    }

    spinExpand() {
        $('.spin_container .spin_card').toggleClass('isActive');
        $('.spin_container .spin_card').off().on('click', function(){
            $('.spin_container .spin_card').toggleClass('isActive');
            $('.spin_container .spin_card').toggleClass('noActive');
        })
    }
}