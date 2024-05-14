<template>
    <div id="update-password">
        <h1>修改密码</h1>
        <div style="margin-top: 20px;">
            <a-steps :current="current">
                <a-step v-for="item in steps" :key="item.title" :title="item.title" />
            </a-steps>
            <div class="steps-content">
                <div class="steps-content-first" v-if="current == 0">
                    <a-row>
                        <a-col :span="18" push="3" style="font-size: 16px;">
                            验证码将发送到手机：{{ counter.userlogin.phone }}
                        </a-col>
                    </a-row>
                    <a-row style="margin-top: 30px;">
                        <a-col :span="4" push="3" style="text-align: center; line-height: 31px; font-size: 16px;">
                            <span>验证码：</span>
                        </a-col>
                        <a-col :span="6" push="3">

                            <a-input @change="changeNewButton" v-model:value="validateValue" />
                        </a-col>
                        <a-col :span="6" push="4">
                            <a-button type="primary" @click="sendValidate" block="true">
                                <span v-if="isText">获取验证码</span>
                                <a-statistic-countdown v-if="!isText" format="ss" :value="deadline"
                                    valueStyle="font-size:20px;color:white" style="margin-top: -3px;" @finish="onFinish" />
                            </a-button>
                        </a-col>
                    </a-row>
                    <a-row style="margin-top: 50px;">
                        <a-col :span="4" push="3">
                            <a-button type="primary" :disabled="isButton" @click="validateCheck">下一步</a-button>
                        </a-col>
                    </a-row>
                </div>
                <div class="steps-content-second" v-if="current == 1">
                    <a-form :model="updatePasswordformState" name="basic" :label-col="{ span: 8 }"
                        :wrapper-col="{ span: 16 }" autocomplete="off" @finish="updatePassword">
                        <a-form-item label="新密码" name="newPassword" :rules="[{ required: true, message: '请输入您的新密码' }]">
                            <a-input-password v-model:value="updatePasswordformState.newPassword" />
                        </a-form-item>

                        <a-form-item label="确认新密码" name="checkNewPassword"
                            :rules="[{ required: true, message: '请确认您的密码' }]">
                            <a-input-password v-model:value="updatePasswordformState.checkNewPassword" />
                        </a-form-item>
                        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                            <a-button type="primary" html-type="submit">提交</a-button>
                        </a-form-item>
                    </a-form>
                </div>
                <div class="steps-content-three" v-if="current == 2">
                    <a-result status="success" title="您已经成功修改，请重新登录" sub-title="三秒后会返回登录首页">
                        <template #extra>
                            <a-button key="console" type="primary" @click="GoLogin">去登录</a-button>
                        </template>
                    </a-result>
                </div>
            </div>
        </div>
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

// #region 修改密码的第一步
const isupdate = ref(true)
const current = ref(0);
const validateValue = ref()
const deadline = ref(Date.now())
const isButton = ref(true) //????
const isText = ref(true)
const steps = [{
    title: '验证',
    content: 'First-content',
}, {
    title: '修改密码',
    content: 'Second-content',
}, {
    title: '完成',
    content: 'Last-content',
}]

const changeNewButton = () => {

    if (validateValue.value.length > 0) {
        isButton.value = false
    } else {
        isButton.value = true
    }
}

const sendValidate = () => {

    VaildateCheckAPI({ phone: counter.userlogin.phone }).then(res => {
        if (res.code == 0) {
            message.success("发送成功")
            isText.value = !isText.value
            deadline.value = Date.now() + 60 * 1000;
            counter.validatechek = res.data
            var time = setTimeout(() => {
                counter.validatechek = ''
            }, 300000)
        }
    })
}

const onFinish = () => {
    console.log("倒计时完成");
    isText.value = !isText.value
}
const validateCheck = () => {

    if (counter.validatechek == validateValue.value) {
        current.value++;
        console.log("这步完成啦，下一步啦");
    } else {
        message.error("验证码错误")
    }
}
// #endregion

// #region 修改密码第二步和第三步
const updatePasswordformState = reactive({
    newPassword: '',
    checkNewPassword: '',
})

const updatePassword = () => {
    UpdatePasswordByPhoneAPI({ id: counter.userlogin.id, newPassword: updatePasswordformState.newPassword, checkNewPassword: updatePasswordformState.checkNewPassword })
        .then(res => {
            if (res.code == 0) {
                current.value++;
                setTimeout(() => {
                    localStorage.removeItem('token')
                    counter.userlogin = {}
                    router.push('/back/login')
                }, 3 * 1000)
            }
        })
}

const GoLogin = () => {
    localStorage.removeItem('token')
    counter.userlogin = {}
    router.push('/back/login')
}

//#endregion
</script>

<style scoped>
.steps-content-first {
    width: 400px;
    height: 200px;
    /* border: 1px solid black; */
    margin: 30px auto;
    padding-top: 30px;
}

.steps-content-second {
    width: 400px;
    height: 200px;
    /* border: 1px solid black; */
    margin: 30px auto;
    padding-top: 30px;
}
</style>