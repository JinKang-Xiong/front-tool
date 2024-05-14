<template>
    <div class="forget-password-big">
        <a-row>
            <a-col :span="24" style="text-align: center;">
                <a-typography-title :level="4">工具箱管理系统</a-typography-title>
            </a-col>
        </a-row>
        <div style="margin-top: 20px; width: 400px; margin: 20px auto;">
            <a-form :model="forgetState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
                autocomplete="off" @finish="updatePassword">
                <a-form-item label="QQ邮箱" name="email"
                    :rules="[{ require: true, message: '请输入正确的QQ邮箱', pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[qq]+\.([a-zA-Z]{2,4})$/ }]">
                    <a-input v-model:value="forgetState.email" placeholder="注册时的QQ邮箱"></a-input>
                </a-form-item>
                <a-form-item label="验证码">
                    <a-space>
                        <a-input @change="changeNewButton" v-model:value="validateValue" />
                        <a-button type="primary" @click="sendValidate" block="true">
                            <span v-if="isText">获取验证码</span>
                            <a-statistic-countdown v-if="!isText" format="ss" :value="deadline"
                                valueStyle="font-size:20px;color:white" style="margin-top: -3px;" @finish="onFinish" />
                        </a-button>
                    </a-space>
                </a-form-item>
                <a-form-item label="新密码" name="newPassword" :rules="[{ required: true, message: '请输入您的新密码' }]">
                    <a-input-password v-model:value="forgetState.newPassword" />
                </a-form-item>

                <a-form-item label="确认新密码" name="checkNewPassword" :rules="[{ required: true, message: '请确认您的密码' }]">
                    <a-input-password v-model:value="forgetState.checkNewPassword" />
                </a-form-item>
                <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                    <a-space>
                        <a-button type="primary" html-type="submit">提交</a-button>
                        <a-button type="" @click="router.back()">取消</a-button>
                    </a-space>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useCountStore } from '../../stores/count.js';
import { updatePasswordUserByEmail, emailUserVerifyForgetAPI } from '../../api/backApi.js';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
const counter = useCountStore()
const router = useRouter()

// #region 修改密码的第一步
const email = ref()
const current = ref(0);
const validateValue = ref()
const deadline = ref(Date.now())
const isButton = ref(true) //????
const isText = ref(true)

const changeNewButton = () => {

    if (validateValue.value.length > 0) {
        isButton.value = false
    } else {
        isButton.value = true
    }
}

const sendValidate = () => {
    emailUserVerifyForgetAPI({ email: forgetState.email }).then(res => {
        if (res.code == 0) {
            message.success("发送成功")
            isText.value = !isText.value
            deadline.value = Date.now() + 60 * 1000;
        } else {
            message.error("邮箱错误")
        }
    })
}

const onFinish = () => {
    console.log("倒计时完成");
    isText.value = !isText.value
}

// #endregion

// #region 修改密码第二步和第三步
const forgetState = reactive({
    email: '',
    newPassword: '',
    checkNewPassword: '',
})

const updatePassword = () => {
    updatePasswordUserByEmail({
        verfity: validateValue.value,
        email: forgetState.email,
        password: forgetState.newPassword,
        checkPassword: forgetState.checkNewPassword
    }).then(res => {
        if (res.code == 0) {
            message.success('修改成功')
            router.back()
        } else {
            message.error('验证码错误')
        }
    })
}


//#endregion
</script>

<style scoped>
.forget-password-big {
    width: 60%;
    margin: 10px auto;
    padding-top: 50px;
}

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