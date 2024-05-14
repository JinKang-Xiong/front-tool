<template>
    <a-layout style="min-height: 100vh">
        <a-layout-sider v-model:collapsed="collapsed" collapsible class="" :width="250">
            <div class="logo">
                <p>工具箱中心</p>
            </div>
            <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
                <!-- <a-menu-item key="1" @click="UserWorkRouter" disabled="false">
                    <pie-chart-outlined />
                    <span>工作台</span>
                </a-menu-item> -->
                <a-menu-item key="2" @click="UserAnalystRouter">
                    <pie-chart-outlined />
                    <span>统计与分析</span>
                </a-menu-item>
                <a-menu-item key="3" @click="UserManageRouter">
                    <desktop-outlined />
                    <span>用户中心</span>
                </a-menu-item>
                <a-menu-item key="4" @click="ManagerRouter" v-if="counter.userlogin.manageRole == 0">
                    <desktop-outlined />
                    <span>管理员中心</span>
                </a-menu-item>
                <a-sub-menu key="sub1">
                    <template #title>
                        <span>
                            <user-outlined />
                            <span>资源审核</span>
                        </span>
                    </template>
                    <a-menu-item key="5" @click="RouterCodeCheck">代码片段审核</a-menu-item>
                    <a-menu-item key="6" @click="RouterBookCheck">书籍审核</a-menu-item>
                    <a-menu-item key="7" @click="RouterNoteCheck">笔记审核</a-menu-item>
                </a-sub-menu>

            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0">
                <a-dropdown>
                    <div class="ant-dropdown-link header-personal" @click.prevent>
                        <a-avatar size="small"
                            :src="counter.userlogin.avatarStatus == 0 ? '/api/' + counter.userlogin.avatarUrl : '/api/images/avatar/errImage.jpg'">
                            <!-- <template #icon>
                                <UserOutlined />
                            </template> -->

                        </a-avatar>
                        <DownOutlined />

                        <span style="margin: 0px 10px;">
                            {{ counter.userlogin.bigManagerName }}
                        </span>
                    </div>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item>
                                <router-link :to="{ name: 'basicfrom' }">个人设置</router-link>
                            </a-menu-item>
                            <a-menu-item>
                                <a @click="loginout">退出登录</a>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </a-layout-header>
            <a-layout-content style="margin: 0 16px">
                <div :style="{ padding: '24px', background: '#fff', minHeight: '740px' }">
                    <router-view></router-view>
                </div>
            </a-layout-content>
            <a-layout-footer style="text-align: center">
                Ant Design ©2018 Created by Ant UED
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>
<script setup>
import { PieChartOutlined, DesktopOutlined, UserOutlined, TeamOutlined, FileOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCountStore } from '../../stores/count.js'
const router = useRouter();
const counter = useCountStore();

const collapsed = ref(false)
const selectedKeys = ref(['2'])


function UserWorkRouter() {
    router.push('/back/home/userwork')
}

function UserAnalystRouter() {
    router.push('/back/home/useranalyst')
}

function UserManageRouter() {
    router.push('/back/home/usermanage')
}
const ManagerRouter = () => {
    router.push('/back/home/managercenter')
}

const RouterCodeCheck = () => {
    router.push({ name: 'codecheck' })
}

const RouterBookCheck = () => {
    router.push({ name: 'bookcheck' })
}

const RouterNoteCheck = () => {
    router.push({ name: 'notecheck' })
}

const loginout = () => {
    localStorage.removeItem('token')
    counter.userlogin = {}
    router.push('/back/login')
}

</script>
<style>
.logo {
    height: 40px;
    margin: 10px;
    margin-bottom: 20px;
    background: black;
    overflow: hidden;
}

.logo p {
    text-align: center;
    line-height: 40px;
    color: white;
    font-size: 20px;
    font-weight: 600;
}

.site-layout .site-layout-background {
    background: #fff;
}

.ant-layout-sider {}

[data-theme='dark'] .site-layout .site-layout-background {
    background: #141414;
}

.header-personal {
    text-align: center;
    height: 60px;
    float: right;
    margin-right: 15px;
}
</style>