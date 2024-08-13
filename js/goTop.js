class goTop {
    constructor(options = {}) {
        const defaultOptions = {
            generateHeight: 200,
            scrollDuration: 600,
            buttonText: '↑',
            buttonClass: 'goTop',
            container: 'body'
        };
        
        this.options = { ...defaultOptions, ...options };
        
        this.init();
    }

    init() {
        this.generateHtml();
        this.bindEvents();
    }

    generateHtml() {
        const { buttonClass, buttonText, container } = this.options;
        let goTopHtml = `<div class="${buttonClass}">${buttonText}</div>`;
        $(container).append(goTopHtml);
        this.goTopElement = $(`.${buttonClass}`); 
    }

    bindEvents() {
        $(window).on('scroll', () => this.showGoTop());
        this.goTopElement.on('click', () => this.scrollToTop());
    }

    showGoTop() {
        const { generateHeight } = this.options;
        if ($(window).scrollTop() > generateHeight) {
            if (!this.goTopElement.is(':visible')) {
                this.goTopElement.fadeIn();
            }
        } else {
            if (this.goTopElement.is(':visible')) {
                this.goTopElement.fadeOut();
            }
        }
    }

    scrollToTop() {
        const { scrollDuration } = this.options;
        $('html, body').animate({ scrollTop: 0 }, scrollDuration);
    }
}