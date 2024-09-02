<template>
    <div v-if="isVisible" class="popout_container">
        <div class="popout_background" @click="handleBackgroundClick"></div>
        <div class="popout_box" :style="{ width: width + 'px', height: height + 'px' }">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onUnmounted, defineExpose, nextTick } from 'vue';

const props = defineProps({
    width: {
        type: [String, Number],
        default: 'auto'
    },
    height: {
        type: [String, Number],
        default: 'auto'
    },
    backgroundClose: {
        type: Boolean,
        default: true
    },
    bgColor: {
        type: String,
        default: 'rgba(0, 0, 0, 0.5)'
    },
    showAnimation: {
        type: Boolean,
        default: true
    },
    onShow: Function,
    onClose: Function
});

const isVisible = ref(false);

const show = () => {
    isVisible.value = true;
    if (props.onShow) props.onShow();
};

const close = () => {
    isVisible.value = false;
    if (props.onClose) props.onClose();
};

const handleBackgroundClick = () => {
    if (props.backgroundClose) {
        close();
    }
};

watch(isVisible, async (newValue) => {
    if (newValue) {
        // 等待 DOM 更新完成
        await nextTick();

        const container = document.querySelector('.popout_container');
        const background = document.querySelector('.popout_background');

        document.body.style.overflow = 'hidden';
        if (props.showAnimation) {
            if (container && background) {
                container.style.opacity = 0;
                background.style.opacity = 0;
                container.style.display = 'flex';
                background.style.display = 'block';
                requestAnimationFrame(() => {
                    container.style.transition = 'opacity 0.3s';
                    background.style.transition = 'opacity 0.3s';
                    container.style.opacity = 1;
                    background.style.opacity = 1;
                });
            }
        } else {
            if (container && background) {
                container.style.display = 'flex';
                background.style.display = 'block';
            }
        }
    } else {
        document.body.style.overflow = 'unset';
        if (props.showAnimation) {
            const container = document.querySelector('.popout_container');
            const background = document.querySelector('.popout_background');

            if (container && background) {
                container.style.opacity = 0;
                background.style.opacity = 0;
                setTimeout(() => {
                    container.style.display = 'none';
                    background.style.display = 'none';
                }, 300);
            }
        } else {
            const container = document.querySelector('.popout_container');
            const background = document.querySelector('.popout_background');

            if (container && background) {
                container.style.display = 'none';
                background.style.display = 'none';
            }
        }
    }
});

onUnmounted(() => {
    document.body.style.overflow = 'unset';
});

defineExpose({
    show,
    close
});
</script>

<style scoped>
.popout_container {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    justify-content: center;
    align-items: center;
    display: none;
    z-index: 99;
}

.popout_background {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: var(--bgColor, rgba(0, 0, 0, 0.5));
    z-index: 99;
}

.popout_box {
    position: relative;
    z-index: 100;
    background: #f0f0f0;
    border-radius: 12px;
    padding: 16px 16px 24px;
    max-width: 400px;
}

</style>