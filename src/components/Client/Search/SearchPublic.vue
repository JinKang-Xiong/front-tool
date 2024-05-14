<template>
    <div class="search-public-content">
        <a-row>
            <a-col :span="5" style="font-weight: 600;">
                结果：{{ searchList.length }}
            </a-col>
        </a-row>
        <a-list item-layout="vertical" size="large" :data-source="searchList">
            <template #renderItem="{ item }">
                <a-list-item key="item.title" style="margin-top: 20px; border: 1px solid rgb(208, 215, 222);">
                    <template #actions>

                        <a-space :size="25">
                            <span type="text"><star-outlined style="margin-right: 8px;" />{{
                                item.codeList.collectNumber
                            }}</span>
                            <span type="text"><like-outlined style="margin-right: 8px;" />{{
                                item.codeList.likeNumber
                            }}</span>
                            <span type="text"><exclamation-circle-outlined style="margin-right: 8px;" />{{
                                item.codeList.tipoffNumber }}</span>
                        </a-space>

                        <span>
                            <field-time-outlined style="margin-right: 8px;" />{{ item.codeList.codeCreateTime }}
                        </span>

                    </template>

                    <a-list-item-meta>
                        <template #title>
                            <a @click="RouterSearchResult(item._id, item.codeList.codeuuid)">{{ item.codeList.codeTitle
                            }}</a>
                        </template>
                    </a-list-item-meta>
                    <a-tag v-for="(el, index) in item.codeList.codeTag" color="blue">{{ el }}</a-tag>
                </a-list-item>
            </template>
        </a-list>
    </div>
</template>


<script setup>
import { defineProps, onMounted, ref, watch } from 'vue'
import { StarOutlined, LikeOutlined, ExclamationCircleOutlined, FieldTimeOutlined } from '@ant-design/icons-vue';
import { SearchByCodeAPI, FindBycodeuuidAPI } from '../../../api/clientApi.js'
import { useRouter } from 'vue-router'
const router = useRouter()
const prop = defineProps(['searchByCodeValue'])
onMounted(() => {
    feth({ searchByCodeValue: prop.searchByCodeValue })
})
const searchList = ref([])
const feth = (query) => {
    console.log('重新执行啦这个页面吗')
    SearchByCodeAPI(query).then(res => {
        if (res.code == 0) {
            res.data.forEach(item => {
                let data = new Date(item.codeList.codeCreateTime)
                item.codeList.codeCreateTime = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate()
            })
            searchList.value = [...res.data]
        }
    })
}

const RouterSearchResult = (_id, codeuuid) => {
    router.push({ name: 'searchresult', params: { _id, codeuuid } })

}

watch(() => prop.searchByCodeValue, (newValue, oldValue) => {
    feth({ searchByCodeValue: newValue })
})
</script>

<style>
.search-public-content {
    width: 65%;
    margin: 20px auto;
}
</style>

