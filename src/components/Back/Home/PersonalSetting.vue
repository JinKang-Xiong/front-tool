<template>
    <div class="personal-content">
        <div class="personal-left">
            <a-menu mode="vertical" :theme="theme">
                <a-menu-item key="sub1" @click="baselink">
                    基础设置
                </a-menu-item>
                <a-menu-item key="sub2" @click="safetylink">
                    安全设置
                </a-menu-item>
            </a-menu>
        </div>
        <div class="personal-right">
            <router-view></router-view>
        </div>
    </div>
</template>


<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()
const baselink = () => {
    router.push({ name: 'basicfrom' })
}
const safetylink = () => {
    router.push({ name: 'safetyfrom' })
}
</script>

<style scoped>
.personal-left {
    width: 20%;
    height: 400px;
}

.personal-content {
    display: flex;
    justify-content: space-between;
}

.personal-right {
    width: 78%;
    height: 400px;
}
</style>