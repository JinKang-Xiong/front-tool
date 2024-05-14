<template>
    <div class="count-down">
        <slot class="currentTime">
            <span>{{ currentTime.format }}</span>
        </slot>
    </div>
</template>

<script setup>
import useCountDown from './composable/useCountDown'
import { ref, computed, onMounted } from 'vue'
const props = defineProps({
    time: {
        type: Number,
        default: 0
    },
    format: {
        type: String,
        default: 'mm:ss'
    },
    immediate: {
        type: Boolean,
        default: true
    }
})

const emits = defineEmits(['finish'])

const { start, currentTime } = useCountDown({
    ...props,
    onFinsh: () => emits('finish'),
})
onMounted(() => {
    if (props.immediate) {
        console.log('需要执行')
        start()
    }
})

defineExpose({
    start,
    currentTime,
})

</script>