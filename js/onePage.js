class OnePage {
    constructor(targets, scrollHold = 200, d4PageControl = true) {
        this.targetClass = targets;
        this.targets = $(`.${targets}`);
        this.totalPages = this.targets.length;
        this.scrollHold = scrollHold; // 滾動距離（速度）
        this.d4PageControl = d4PageControl; // 是否要有點點滾動條
        this.currentPageIndex = 0;
        this.accumulatedScroll = 0;
        this.init();
    }

    init() {
        this.generateCss();
        if (this.d4PageControl) {
            this.generatePageControl();
        }

        $(document).on('wheel', (event) => {
            if ($(event.target).attr('class').includes(`${this.targetClass}`)) {
                this.handleScroll(event);
            }
        });
        this.showPage(this.currentPageIndex); // 初始化顯示第一頁
        this.updateScrollIndicator();
    }

    generatePageControl() {
        let dotHtml = '';
        for (let i = 0; i < this.totalPages; i++) {
            dotHtml += `<div class="dot" data-index="${i}"></div>`;
        }

        let pageHtml = `<div class="scroll-indicator">${dotHtml}</div>`;
        $('body').append(pageHtml);

        this.scrollDots = $('.scroll-indicator .dot');
    }

    handleScroll(event) {
        this.accumulatedScroll += event.originalEvent.deltaY;

        if (this.accumulatedScroll >= this.scrollHold) {
            this.switchPage(1);
            this.accumulatedScroll = 0;
        } else if (this.accumulatedScroll <= -this.scrollHold) {
            this.switchPage(-1);
            this.accumulatedScroll = 0;
        }
    }

    switchPage(direction) {
        // 如果在第一頁或最後一頁，不做任何操作
        if ((this.currentPageIndex === 0 && direction === -1) ||
            (this.currentPageIndex === this.totalPages - 1 && direction === 1)) {
            return;
        }

        this.targets.eq(this.currentPageIndex).addClass('hidden');
        this.currentPageIndex += direction;
        this.targets.eq(this.currentPageIndex).removeClass('hidden');
        this.updateScrollIndicator();
    }

    updateScrollIndicator() {
        if (this.d4PageControl) {
            this.scrollDots.removeClass('active');
            this.scrollDots.eq(this.currentPageIndex).addClass('active');
        }
    }

    showPage(index) {
        this.targets.addClass('hidden'); 
        this.targets.eq(index).removeClass('hidden');
    }

    generateCss() {
        const style = document.createElement('style');
        style.textContent = `
            body,
            html {
                margin: 0;
                padding: 0;
                overflow: hidden;
                height: 100%;
            }
            .${this.targetClass} {
                position: absolute;
                width: 100%;
                height: 100%;
                opacity: 1;
                transition: opacity 1s ease-in-out;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 2rem;
                color: white;
            }
            .hidden {
                opacity: 0;
                pointer-events: none;
            }
        `;

        if (this.d4PageControl) {
            style.textContent += `
                .scroll-indicator {
                    position: fixed;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .scroll-indicator div {
                    width: 10px;
                    height: 10px;
                    margin: 5px 0;
                    border-radius: 50%;
                    background-color: rgba(0, 0, 0, 0.2);
                }
                .scroll-indicator .active {
                    background-color: rgba(0, 0, 0, 0.8);
                }
            `;
        }

        document.head.appendChild(style);
    }
}

new OnePage('porfolio_container');

// 暫定重做