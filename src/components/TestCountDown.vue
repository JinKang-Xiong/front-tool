<template>
    {{ timelocal }}
    <CountDown ref="countdown" :time="Number(timelocal)" format="mm:ss"></CountDown>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import CountDown from './CountDown/index.vue'
import { useclientStore } from '../stores/count.js'
import { time } from 'echarts';
const countdown = ref()
const count = useclientStore()
const timelocal = ref(localStorage.getItem('countDownTime'))
console.log(timelocal)
if (!timelocal.value) {
    console.log("浏览器本地存储无");
    timelocal.value = 10000
}
console.log(timelocal.value == 0);





</script>