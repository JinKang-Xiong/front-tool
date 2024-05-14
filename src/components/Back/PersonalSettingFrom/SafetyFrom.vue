<template>
    <div id="safety-content">
        <h1 style="font-size: 21px; font-weight: 500; margin-bottom: 15px;">安全设置</h1>
        <a-list item-layout="horizontal" :data-source="data">
            <template #renderItem="{ item }">
                <a-list-item>
                    <a-list-item-meta>
                        <template #title>
                            <a href="https://www.antdv.com/">{{ item.title }}</a>
                        </template>
                        <template #description>
                            <p>{{ item.description }}</p>
                        </template>
                    </a-list-item-meta>
                    <template #extra>
                        <a @click="updateSafty(item.routerName)">{{ item.extra }}</a>
                    </template>
                </a-list-item>
            </template>
        </a-list>
    </div>
</template>
<script setup>
import { reactive, ref } from 'vue';
import { useCountStore } from '../../../stores/count';
import { VaildateCheckAPI, UpdatePasswordByPhoneAPI } from '../../../api/backApi.js';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
const counter = useCountStore()
const router = useRouter()
const data = reactive([{
    title: '账户密码',
    description: '当前密码正常',
    extra: '修改密码',
    routerName: 'updatepassword'
}, {
    title: '手机号码',
    description: `${counter.userlogin.phone.slice(0, 3)} **** ${counter.userlogin.phone.slice(-4)}`,
    extra: '修改手机',
    routerName: 'updatephone'
}, {
    title: '电子邮箱',
    description: `${counter.userlogin.email}`,
    extra: '修改邮箱',
    routerName: 'updateemail'
}]);
const updateSafty = (routerName) => {
    router.push({ name: routerName })
}

</script>

<style scoped>
#safety-content {
    width: 95%;
}

#safety-header {
    margin-bottom: 20px;
}
</style>