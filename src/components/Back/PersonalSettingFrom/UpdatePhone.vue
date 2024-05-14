<template>
    <div>
        <a-steps :current="currentPhone">
            <a-step v-for="item in stepsPhone" :key="item.title" :title="item.title" />
        </a-steps>
        <div class="steps-content">
            <div class="steps-content-first" v-if="currentPhone == 0">
                <a-row>
                    <a-col :span="22" push="2" style="font-size: 16px;">
                        验证码将发送到手机：{{ counter.userlogin.phone }}
                    </a-col>
                </a-row>
                <a-row style="margin-top: 30px;">
                    <a-col :span="4" push="3" style="text-align: center; line-height: 31px; font-size: 16px;">
                        <span>验证码：</span>
                    </a-col>
                    <a-col :span="6" push="3">
                        <a-input @change="changeNewButtonPhone" v-model:value="PhonevalidateValue" />
                    </a-col>
                    <a-col :span="6" push="4">
                        <a-button type="primary" @click="sendValidatePhone" block="true">
                            <span v-if="isTextPhone">获取验证码</span>
                            <a-statistic-countdown v-if="!isTextPhone" format="ss" :value="deadlinePhone"
                                valueStyle="font-size:20px;color:white" style="margin-top: -3px;" @finish="onFinishPhone" />
                        </a-button>
                    </a-col>
                </a-row>
                <a-row style="margin-top: 50px;">
                    <a-col :span="4" push="3">
                        <a-button type="primary" :disabled="isButtonPhone" @click="validateCheckPhone">下一步</a-button>
                    </a-col>
                </a-row>
            </div>
            <div class="steps-content-second" v-if="currentPhone == 1">
                <a-form :model="updatePasswordformStatePhone" name="updateemail" :label-col="{ span: 8 }"
                    :wrapper-col="{ span: 16 }" autocomplete="off" @finish="updateemailPhone">
                    <a-form-item label="新手机号" name="newPhone" :rules="[{ required: true, message: '请输入您的手机号' }]">
                        <a-input v-model:value="updatePasswordformStatePhone.newPhone" />
                    </a-form-item>
                    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                        <a-button type="primary" html-type="submit">提交</a-button>
                    </a-form-item>
                </a-form>
            </div>
            <div class="steps-content-three" v-if="currentPhone == 2">
                <a-result status="success" title="您已经成功修改">
                    <template #extra>
                        <a-button key="console" type="primary" @click="GoLoginPhone">返回</a-button>
                    </template>
                </a-result>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useCountStore } from '../../../stores/count';
import { VaildateCheckAPI, UpdatePhoneAPI, UpdatePasswordByPhoneAPI } from '../../../api/backApi.js';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
const counter = useCountStore()
const router = useRouter()

const currentPhone = ref(0);
const PhonevalidateValue = ref()
const deadlinePhone = ref(Date.now())
const isButtonPhone = ref(true) //????
const isTextPhone = ref(true)
const stepsPhone = [{
    title: '验证',
    content: 'First-content',
}, {
    title: '修改手机',
    content: 'Second-content',
}, {
    title: '完成',
    content: 'Last-content',
}]

const changeNewButtonPhone = () => {

    if (PhonevalidateValue.value.length > 0) {
        isButtonPhone.value = false
    } else {
        isButtonPhone.value = true
    }
}

const sendValidatePhone = () => {
    VaildateCheckAPI({ phone: counter.userlogin.phone }).then(res => {
        if (res.code == 0) {
            message.success("发送成功")
            isTextPhone.value = !isTextPhone.value
            deadlinePhone.value = Date.now() + 60 * 1000;
            counter.PhoneValidatechek = res.data
            var time = setTimeout(() => {
                counter.PhoneValidatechek = ''
            }, 300000)
        }
    })
}

const onFinishPhone = () => {
    console.log("倒计时完成");
    isTextPhone.value = !isTextPhone.value

}
const validateCheckPhone = () => {
    if (counter.PhoneValidatechek == PhonevalidateValue.value) {
        currentPhone.value++;
        console.log("这步完成啦，下一步啦");
    } else {
        message.error("验证码错误")
    }
}
const updatePasswordformStatePhone = reactive({
    newPhone: '',
})

const updateemailPhone = () => {
    UpdatePhoneAPI({ id: counter.userlogin.id, phone: updatePasswordformStatePhone.newPhone })
        .then(res => {
            if (res.code == 0) {
                currentPhone.value++;
                fetchcurrent()
            }
        })
}

const GoLoginPhone = () => {
    router.push({ name: 'safetyfrom' })
}
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