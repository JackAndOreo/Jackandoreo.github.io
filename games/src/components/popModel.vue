<template>
    <div v-if="isVisible" class="popout_container">
        <div class="popout_background" @click="handleBackgroundClick"></div>
        <div class="popout_box" :style="{ width: width + 'px', height: height + 'px' }">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';

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

watch(isVisible, (newValue) => {
    if (newValue) {
        document.body.style.overflow = 'hidden';
        if (props.showAnimation) {
            const container = document.querySelector('.popout_container');
            const background = document.querySelector('.popout_background');
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
        } else {
            document.querySelector('.popout_container').style.display = 'flex';
            document.querySelector('.popout_background').style.display = 'block';
        }
    } else {
        document.body.style.overflow = 'unset';
        if (props.showAnimation) {
            const container = document.querySelector('.popout_container');
            const background = document.querySelector('.popout_background');
            container.style.opacity = 0;
            background.style.opacity = 0;
            setTimeout(() => {
                container.style.display = 'none';
                background.style.display = 'none';
            }, 300);
        } else {
            document.querySelector('.popout_container').style.display = 'none';
            document.querySelector('.popout_background').style.display = 'none';
        }
    }
});

onUnmounted(() => {
    document.body.style.overflow = 'unset';
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
}
</style>