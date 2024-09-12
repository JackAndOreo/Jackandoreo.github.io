class DeviceDetector {
    constructor() {
        this.init();
    }

    init() {
        this.checkSafari();
        this.checkMobile();
        this.checkChrome();
        this.checkTouch();
    }

    checkSafari() {
        let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        $("body").addClass(isSafari ? "isSafari" : "notSafari");
    }

    checkMobile() {
        let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        $("body").addClass(isMobile ? "isMobile" : "notMobile");
    }

    checkChrome() {
        let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        $("body").addClass(isChrome ? "isChrome" : "notChrome");
    }

    checkTouch() {
        let isTouch = 'ontouchstart' in window || navigator.maxTouchPoints;
        $("body").addClass(isTouch ? 'isTouch' : 'notTouch');
    }

    safariViewHeight(selector) {
        let windowsVH = window.innerHeight / 100;
        document.querySelector(`${selector}`).style.setProperty('--vh', windowsVH + 'px');
        window.addEventListener('resize', function() {
            document.querySelector(`${selector}`).style.setProperty('--vh', windowsVH + 'px');
        });
    }
}

const detector = new DeviceDetector();