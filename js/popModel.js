class PopModel {
    constructor({  // positionX Y暫捨棄 // X按鈕待補
        target, 
        width = "auto",
        height = "auto",
        backgroundClose = true,
        bgColor = 'rgba(0, 0, 0, 0.5)',
        showAnimation = true,
        onShow = null,
        onClose = null,
    }) {
        this.target = target;  //jQ
        this.width = width;  // 彈出視縮是否要自訂大小
        this.height = height;
        this.backgroundClose = backgroundClose;
        this.bgColor = bgColor;  // 背景色控制
        this.showAnimation = showAnimation;  // 是否動畫
        this.onShow = onShow;  // 是否自定義開始事件
        this.onClose = onClose;  // 是否自定義關閉事件
        this.init();
    }

    init() {
        $('body').css('position', 'relative');
        this.generatePopContent();
        this.generatePopBg();
    }

    generatePopContent() {
        let copyTarget = $(this.target).clone().show();
        let popHtml = `
            <div class="popout_container">
                <div class="popout_box"></div>
                <div class="popout_background"></div>
            </div>`;

        if ($('.popout_container').length === 0) {
            $('body').append(popHtml);
        } else {
            $('.popout_box').empty();
        }
        $('.popout_box').append(copyTarget);
    }

    generatePopBg() {
        let $popoutBackground = $('.popout_background');
        let $popoutContainer = $('.popout_container');
        let $popoutBox = $('.popout_box');

        $popoutBackground.css({
            position: 'fixed',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            background: this.bgColor,
            zIndex: 102,
        });

        $popoutContainer.css({
            position: 'fixed',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            zIndex: 101,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        });

        $popoutBox.css({
            position: 'relative',
            width: `${this.width}px`,
            height: `${this.height}px`,
            zIndex: 103,
        });

        $('body').css('overflow', 'hidden');  // 鎖定滾動

        if (this.backgroundClose) {
            $popoutBackground.off().on('click', () => this.close());
        }

        if (this.showAnimation) {
            $popoutBackground.fadeIn(() => {
                $popoutContainer.fadeIn(() => {
                    if (this.onShow) this.onShow();
                });
            });
        } else {
            $popoutBackground.show();
            $popoutContainer.show();
            if (this.onShow) this.onShow();
        }
    }

    close() {
        if (this.onClose) this.onClose();
        $('body').css('overflow', 'unset');
        if (this.showAnimation) {
            $('.popout_background').fadeOut(() => $('.popout_background').remove());
            $('.popout_container').fadeOut(() => $('.popout_container').remove());
        } else {
            $('.popout_background').remove();
            $('.popout_container').remove();
        }
    }
}
