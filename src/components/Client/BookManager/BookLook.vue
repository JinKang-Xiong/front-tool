<template>
    <div>
        <myPdf :pdfUrl="pdfUrl" v-if="pdfUrl"></myPdf>
    </div>
</template>

<script setup>
import { ref, reactive, defineProps, onMounted } from 'vue'
import { message } from 'ant-design-vue';
import myPdf from '../../pdfPreview/MyPDF.vue'
import { FindBookByIdAPI, UpdateBookAPI } from '../../../api/clientApi.js'
import { useclientStore } from '../../../stores/count.js'

const counter = useclientStore()
const props = defineProps(['_id'])
onMounted(() => {
    fecthinit({ _id: props._id })
})
const initData = ref({})
const pdfUrl = ref()
const fecthinit = (query) => {
    FindBookByIdAPI(query).then(res => {
        if (res.code == 0) {
            initData.value = { ...res.data }
            pdfUrl.value = res.data.bookUrl
        }
    })
}
</script>


<style scoped></style>