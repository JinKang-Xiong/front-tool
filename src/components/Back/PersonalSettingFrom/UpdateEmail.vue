<template>
    <div id="update-email">
        <h1>修改邮箱</h1>
        <div style="margin-top: 20px;">
            <a-steps :current="current">
                <a-step v-for="item in steps" :key="item.title" :title="item.title" />
            </a-steps>
            <div class="steps-content">
                <div class="steps-content-first" v-if="current == 0">
                    <a-row>
                        <a-col :span="22" push="2" style="font-size: 16px;">
                            验证码将发送到邮箱：{{ counter.userlogin.email }}
                        </a-col>
                    </a-row>
                    <a-row style="margin-top: 30px;">
                        <a-col :span="4" push="3" style="text-align: center; line-height: 31px; font-size: 16px;">
                            <span>验证码：</span>
                        </a-col>
                        <a-col :span="6" push="3">

                            <a-input @change="changeNewButton" v-model:value="EmailvalidateValue" />
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
                        <a-form-item label="新邮箱" name="newEmail" :rules="[{ required: true, message: '请输入您的新邮箱' }]">
                            <a-input v-model:value="updatePasswordformState.newEmail" />
                        </a-form-item>
                        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                            <a-button type="primary" html-type="submit">提交</a-button>
                        </a-form-item>
                    </a-form>
                </div>
                <div class="steps-content-three" v-if="current == 2">
                    <a-result status="success" title="您已经成功修改">
                        <template #extra>
                            <a-button key="console" type="primary" @click="GoLogin">返回</a-button>
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
import { EmailVaildateAPI, UpdateEmail } from '../../../api/backApi.js';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
const counter = useCountStore()
const router = useRouter()

// #region 修改密码的第一步
const isupdate = ref(true)
const current = ref(0);
const EmailvalidateValue = ref()
const deadline = ref(Date.now())
const isButton = ref(true) //????
const isText = ref(true)
const steps = [{
    title: '验证',
    content: 'First-content',
}, {
    title: '修改邮箱',
    content: 'Second-content',
}, {
    title: '完成',
    content: 'Last-content',
}]

const changeNewButton = () => {

    if (EmailvalidateValue.value.length > 0) {
        isButton.value = false
    } else {
        isButton.value = true
    }
}

const sendValidate = () => {

    EmailVaildateAPI({ email: counter.userlogin.email }).then(res => {
        if (res.code == 0) {
            message.success("发送成功")
            isText.value = !isText.value
            deadline.value = Date.now() + 60 * 1000;
            counter.emailValidatechek = res.data
            var time = setTimeout(() => {
                counter.emailValidatechek = ''
            }, 300000)
        }
    })
}

const onFinish = () => {
    console.log("倒计时完成");
    isText.value = !isText.value
}
const validateCheck = () => {
    if (counter.emailValidatechek == EmailvalidateValue.value) {
        current.value++;

        console.log("这步完成啦，下一步啦");
    } else {
        message.error("验证码错误")
    }
}
// #endregion

// #region 修改密码第二步和第三步
const updatePasswordformState = reactive({
    newEmail: '',
})

const updatePassword = () => {
    UpdateEmail({ id: counter.userlogin.id, email: updatePasswordformState.newEmail })
        .then(res => {
            if (res.code == 0) {
                current.value++;
            }
        })
}

const GoLogin = () => {
    router.push({ name: 'safetyfrom' })
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