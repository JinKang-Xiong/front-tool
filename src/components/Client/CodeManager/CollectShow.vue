<template>
    <div class="collect-show-content">
        <a-typography-title :level="3">{{ props.collectName }}</a-typography-title>
        <div class="collect-code-content">
            <a-list item-layout="vertical" :data-source="CollectShowData">
                <template #renderItem="{ item }">
                    <a-list-item id="codeList" @click="RouterCollectResult(item._id, item.codeList.codeuuid)">
                        <a-list-item-meta :description="item.codeList.codeDescription">
                            <template #title>
                                <span>{{ item.codeList.codeTitle }}</span>
                            </template>
                        </a-list-item-meta>
                        <template #actions>
                            <a-space>
                                <span>
                                    <field-time-outlined style="margin-right: 8px;" />{{ item.codeList.codeCreateTime }}
                                </span>
                                <span type="" style="padding: 4px;">
                                    <StarOutlined />{{ item.codeList.collectNumber }}
                                </span>
                                <span type="" style="padding: 4px;">
                                    <LikeOutlined />{{ item.codeList.likeNumber }}
                                </span>
                            </a-space>
                            <a-space style="margin-left: 600px;">
                                <a-tag color="blue" v-for="item in item.codeList.codeTag">{{ item }}</a-tag>
                            </a-space>
                        </template>
                    </a-list-item>

                </template>
            </a-list>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue'
import { FindCollectCodeSnippet } from '../../../api/clientApi.js'
import { StarOutlined, LikeOutlined, StarFilled, StarTwoTone, FieldTimeOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
const router = useRouter()

const props = defineProps(['_id', 'userId', 'collectName'])

onMounted(() => {
    fetchcollect({ _id: props._id, userId: props.userId })
})

const CollectShowData = ref([])
const fetchcollect = (query) => {
    FindCollectCodeSnippet(query).then(res => {
        if (res.code == 0) {
            res.data.forEach(element => {
                let data = new Date(element.codeList.codeCreateTime)
                element.codeList.codeCreateTime = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate()

            });
            CollectShowData.value = [...res.data]

            console.log(CollectShowData.value)
        }
    })
}

const RouterCollectResult = (_id, codeuuid) => {
    router.push({ name: 'searchresult', params: { _id, codeuuid } })
}

</script>

<style scoped>
.collect-show-content {
    width: 70%;
    margin-left: 30px;
}

#codeList:hover {
    background-color: rgb(247, 248, 250);
    cursor: pointer;
}
</style>