<template>
    <div class="note-title">
        <a-row>
            <a-col :span="22"> <span style="font-size: 20px; font-weight: 600;">{{ noteName }}</span></a-col>
            <a-col :span="2"><a-button type="" @click="RouterBack">返回</a-button></a-col>
        </a-row>

    </div>
    <div class="note-read">
        <!-- <v-md-preview :text="noteContent"></v-md-preview> -->
        <!-- <v-md-preview :text="noteContent"></v-md-preview> -->
        <v-md-editor :model-value="noteContent" mode="preview"></v-md-editor>
    </div>
</template>

<script setup>
import { StarOutlined, StarFilled, StarTwoTone, LeftOutlined } from '@ant-design/icons-vue';
import { defineProps, ref, onMounted } from 'vue'
import { FindNoteByIdAPI } from '../../../api/clientApi.js'
import { useRouter } from 'vue-router';
import { useclientStore } from '../../../stores/count.js'

const counter = useclientStore()
const router = useRouter()
onMounted(() => {
    fetchnote({ userId: counter.clientlogin.id, _id: props._id })
})

const props = defineProps(['_id'])


const note = ref()
const noteContent = ref()
const noteName = ref()
const fetchnote = (query) => {
    FindNoteByIdAPI(query).then(res => {
        if (res.code == 0) {
            note.value = res.data
            noteContent.value = res.data.noteContent
            noteName.value = res.data.noteName
        }
    })
}
const RouterBack = () => {
    router.back()
}

</script>


<style scoped>
.note-title {
    width: 90%;
    margin: 0px auto;
    padding: 0 2.5rem;
}

.note-read {
    width: 90%;
    margin: 0px auto;
}
</style>