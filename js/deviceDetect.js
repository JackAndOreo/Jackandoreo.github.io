class DeviceDetector {
    constructor() {
        this.init();
    }

    init() {
        this.checkSafari();
        this.checkMobile();
    }

    checkSafari() {
        let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        $("body").addClass(isSafari ? "isSafari" : "notSafari");
    }

    checkMobile() {
        let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        $("body").addClass(isMobile ? "isMobile" : "notMobile");
    }
}