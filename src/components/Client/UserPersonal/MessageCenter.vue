<template>
    <div class="message-content">
        <a-row>
            <a-col :span="24">
                <a-typography-title :level="4">系统消息</a-typography-title>
            </a-col>
        </a-row>
        <a-row style="margin-bottom: 10px; margin-top: 10px;">
            <a-col :span="2">
                <a-typography-text type="secondary">共{{ messageList.length }}条内容</a-typography-text>
            </a-col>
            <a-col :span="3" offset="19" style="text-align: right;">
                <a-popconfirm title="确定删除所有的内容吗" ok-text="确定" cancel-text="取消" @confirm="confirmDeleteAll" @cancel="cancel">
                    <a>清空所有内容</a>
                </a-popconfirm>
            </a-col>
        </a-row>
        <a-list class="demo-loadmore-list" item-layout="horizontal" :data-source="messageList">
            <template #renderItem="{ item, index }">
                <a-list-item @mouseenter="ShowDelete(index)" @mouseleave="HiddenDelete(index)">
                    <template #actions>
                        <a-popconfirm title="确定要删除吗？" ok-text="确定" cancel-text="取消" @confirm="DeleteMessage(item._id)"
                            @cancel="cancel">
                            <div style="width: 28px; height: 22px;">
                                <a key="list-loadmore-more" v-if="showDeleteValue == index">删除</a>
                            </div>
                        </a-popconfirm>
                    </template>
                    <a-list-item-meta :description="item.createTime">
                        <template #title>
                            <a href="https://www.antdv.com/">{{ item.message }}</a>
                        </template>
                        <template #avatar>
                            <a-avatar>
                                <template #icon>
                                    <img src="../../../assets/Client/images/logo.png">
                                </template>
                            </a-avatar>
                        </template>
                    </a-list-item-meta>
                </a-list-item>
            </template>
        </a-list>
    </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import { FindAllMessageAPI, DeleteMessageAllAPI, DeleteMessageOneAPI, UpdateAllMessageStatusAPI } from '../../../api/clientApi.js'
import { useclientStore } from '../../../stores/count.js'
import { message } from 'ant-design-vue';
const emit = defineEmits(['messageShow'])

onMounted(() => {
    UpdateAllMessageStatus()
    fetchmessage({ userId: counter.clientlogin.id })

})
const counter = useclientStore()
const showDeleteValue = ref(-1)
const messageList = ref([])
const fetchmessage = (query) => {
    FindAllMessageAPI(query).then(res => {
        if (res.code == 0) {
            res.data.forEach(element => {
                let date = new Date(element.createTime)
                element.createTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            });
            messageList.value = [...res.data]
        }
    })
}
const ShowDelete = (item) => {
    showDeleteValue.value = item
}
const HiddenDelete = () => {
    showDeleteValue.value = -1
}

const DeleteMessage = (_id) => {
    DeleteMessageOneAPI({ _id, userId: counter.clientlogin.id }).then(res => {
        if (res.code == 0) {
            message.success('删除成功')
            fetchmessage({ userId: counter.clientlogin.id })
        }
    })
}

const UpdateAllMessageStatus = () => {
    UpdateAllMessageStatusAPI({ userId: counter.clientlogin.id }).then(res => {
        if (res.code == 0) {
            console.log('执行触发')
            emit('messageShow')
        }
    })
}

const confirmDeleteAll = () => {
    DeleteMessageAllAPI({ userId: counter.clientlogin.id }).then(res => {
        if (res.code == 0) {
            message.success('清除全部')
            fetchmessage({ userId: counter.clientlogin.id })

        }
    })
}


</script>


<style scoped>
.message-content {
    width: 70%;
    margin: 20px auto;
}
</style>