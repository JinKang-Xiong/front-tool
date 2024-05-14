<script setup>
import { useCountStore } from '../stores/count';
import { message } from 'ant-design-vue'
const counter = useCountStore()

counter.count++

function success() {
    message.success('弹出')
}

</script>


<template>
    <h1>{{ counter.count }}</h1>
    <button @click="success">点击弹出</button>
</template>