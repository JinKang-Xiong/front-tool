<template>
    <div class="note-updateTime">
        <a-timeline mode="alternate">
            <a-timeline-item v-for="(item, index) in timeList" :color="item.color == 0 ? 'green' : 'blue'">
                {{ item.color == 0 ? '创建' : '修改' }}{{ item.name }}在{{ item.time }}
            </a-timeline-item>
        </a-timeline>
    </div>
</template>

<script setup>
import { FindUpdateTimeAPI } from '../../../api/clientApi.js'
import { ref, onMounted } from 'vue'
import { useclientStore } from '../../../stores/count.js'

const counter = useclientStore()

onMounted(() => {
    fetchTime({ userId: counter.clientlogin.id })
})


const timeList = ref([])
const fetchTime = (query) => {
    FindUpdateTimeAPI(query).then(res => {
        if (res.code == 0) {
            res.data.forEach(element => {
                let date = new Date(element.time)
                element.time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            })

            timeList.value = [...res.data]
        }
    })
}


</script>

<style scoped>
.note-updateTime {
    padding-top: 30px;
}
</style>