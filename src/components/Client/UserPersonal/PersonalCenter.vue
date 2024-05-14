<template>
    <div class="client-personal">
        <a-typography-title :level="4">个人中心</a-typography-title>
        <div class="personal-content">
            <div class="personal-left">
                <a-menu mode="vertical" :theme="theme">
                    <a-menu-item key="sub1" @click="baselink">
                        基础资料
                    </a-menu-item>
                    <a-menu-item key="sub2" @click="safetylink">
                        修改密码
                    </a-menu-item>
                    <a-menu-item key="sub3" @click="emaillink">
                        修改邮箱
                    </a-menu-item>
                    <a-menu-item key="sub4" @click="phonelink">
                        修改手机
                    </a-menu-item>
                </a-menu>
            </div>
            <div class="personal-right">
                <div class="personal-basic" v-if="showright == 1">
                    <a-row>
                        <a-col :span="3">
                            <a-image :src="'/api' + src"></a-image>
                        </a-col>
                        <a-col :span="4" offset="1">
                            <p style="font-size: 20px; font-weight: 500;">{{
                                counter.clientlogin.username ? counter.clientlogin.username : '' }}</p>
                            <a-button style="margin-top: 20px;" type="primary" size="small"
                                @click="showMyUpload">修改头像</a-button>
                            <myUpload v-model="showDialog" :url="baseuploadurl" @crop-upload-success="cropUploadSuccess"
                                :params="params" />

                        </a-col>
                    </a-row>
                    <div class="basic-item">
                        <a-typography-title :level="5">基础信息</a-typography-title>
                        <ul>
                            <li>账号：{{ counter.clientlogin.userAccount }}</li>
                            <li>性别：{{ counter.clientlogin.gender == 0 ? '女' : '男' }}</li>
                            <li>邮箱：{{ counter.clientlogin.email }}</li>
                            <li>电话：{{ counter.clientlogin.phone }}</li>
                        </ul>

                    </div>
                    <a-row style="margin-top: 40px;">
                        <a-col :span="2" offset="22">
                            <a-button type="primary" @click="showModalBasic">修改基础信息</a-button>
                        </a-col>
                    </a-row>
                    <a-modal v-model:visible="visibleBasic" title="基础信息" okText="确定" cancelText="取消" @ok="handleOk">
                        <a-form :model="formStateBasic">
                            <a-form-item name="username" label="用户名">
                                <a-input v-model:value="formStateBasic.userName"></a-input>
                            </a-form-item>
                            <a-form-item name="gender" label="性别">
                                <a-radio-group v-model:value="formStateBasic.gender">
                                    <a-radio :value="1">男</a-radio>
                                    <a-radio :value="0">女</a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </a-form>
                    </a-modal>
                </div>
                <div class="personal-password" v-if="showright == 2">
                    <a-form :model="formStatePassword" name="修改密码" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                        <a-form-item label="输入旧密码" name="oldPassword"
                            :rules="[{ require: true, min: 6, message: '长度至少要大于6个字符' }]">
                            <a-input-password name="oldPassword" v-model:value="formStatePassword.oldPassword"
                                placeholder="请输入旧密码" />
                        </a-form-item>
                        <a-form-item label="输入新密码" name="newPassword"
                            :rules="[{ require: true, min: 6, message: '长度至少要大于6个字符' }]">
                            <a-input-password name="newPassword" v-model:value="formStatePassword.newPassword"
                                placeholder="请输入新密码"></a-input-password>
                        </a-form-item>
                        <a-form-item label="输入新密码" name="checkNewPassword"
                            :rules="[{ require: true, min: 6, message: '长度至少要大于6个字符' }]">
                            <a-input-password name="checkNewPassword" v-model:value="formStatePassword.checkNewPassword"
                                placeholder="请输入新密码"></a-input-password>
                        </a-form-item>
                        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                            <a-button type="primary" html-type="submit" @click="updatePassword">提交</a-button>
                        </a-form-item>
                    </a-form>
                </div>
                <div class="personal-email" v-if="showright == 3">
                    <a-steps :current="current">
                        <a-step v-for="item in steps" :key="item.title" :title="item.title" />
                    </a-steps>
                    <div class="steps-content">
                        <div class="steps-content-first" v-if="current == 0">
                            <a-row>
                                <a-col :span="22" push="2" style="font-size: 16px;">
                                    验证码将发送到邮箱：{{ counter.clientlogin.email }}
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
                                            valueStyle="font-size:20px;color:white" style="margin-top: -3px;"
                                            @finish="onFinish" />
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
                            <a-form :model="updatePasswordformState" name="updateemail" :label-col="{ span: 8 }"
                                :wrapper-col="{ span: 16 }" autocomplete="off" @finish="updateemail">
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
                <div class="personal-phone" v-if="showright == 4">
                    <a-steps :current="currentPhone">
                        <a-step v-for="item in stepsPhone" :key="item.title" :title="item.title" />
                    </a-steps>
                    <div class="steps-content">
                        <div class="steps-content-first" v-if="currentPhone == 0">
                            <a-row>
                                <a-col :span="22" push="2" style="font-size: 16px;">
                                    验证码将发送到手机：{{ counter.clientlogin.phone }}
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
                                            valueStyle="font-size:20px;color:white" style="margin-top: -3px;"
                                            @finish="onFinishPhone" />
                                    </a-button>
                                </a-col>
                            </a-row>
                            <a-row style="margin-top: 50px;">
                                <a-col :span="4" push="3">
                                    <a-button type="primary" :disabled="isButtonPhone"
                                        @click="validateCheckPhone">下一步</a-button>
                                </a-col>
                            </a-row>
                        </div>
                        <div class="steps-content-second" v-if="currentPhone == 1">
                            <a-form :model="updatePasswordformStatePhone" name="updateemail" :label-col="{ span: 8 }"
                                :wrapper-col="{ span: 16 }" autocomplete="off" @finish="updateemailPhone">
                                <a-form-item label="新手机号" name="newPhone"
                                    :rules="[{ required: true, message: '请输入您的手机号' }]">
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
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue'
import { phoneUserUpdateAPI, phoneUserVerifyAPI, emailUserUpdateAPI, emailUserVerifyAPI, UserCurrentAPI, UpdateUserBaseAPI, UpdateUserPasswordByPasswordAPI } from '../../../api/clientApi.js'
import { useclientStore } from '../../../stores/count.js'
import myUpload from 'vue-image-crop-upload'
const router = useRouter()
const counter = useclientStore()

const fetchcurrent = () => {
    const token = localStorage.getItem('tokenuser')
    UserCurrentAPI({}, token).then((res) => {
        if (res.code == 0) {
            counter.clientlogin = res.data
            src.value = res.data.avatarUrl
        } else {
            message.error("修改失败")
        }

    })
}

/**
 * 1-展示基础资料
 * 2-展示修改密码
 * 3-展示修改邮箱
 * 4-展示修改手机
 */
//#region 修改基础信息
const showright = ref(1)
const baselink = () => {
    showright.value = 1
}
const visibleBasic = ref(false)
const formStateBasic = reactive({
    userName: '',
    gender: '',
})
const showModalBasic = () => {
    visibleBasic.value = true
    formStateBasic.userName = counter.clientlogin.username
    formStateBasic.gender = counter.clientlogin.gender
}

const showDialog = ref(false)
const params = reactive({
    id: counter.clientlogin.id
})
const showMyUpload = () => {
    console.log('应该打开')
    showDialog.value = !showDialog.value
}
const baseuploadurl = ref('/api/user/updateAvatar')

const updateshowDialog = () => {
    showDialog.value = !showDialog.value
}

const src = ref(counter.clientlogin.avatarUrl)
const cropUploadSuccess = (jsonData, field) => {
    showDialog.value = !showDialog.value
    if (jsonData.code == 0) {
        fetchcurrent()
    } else {
        message.error('修改失败')
    }

}
const handleOk = () => {
    UpdateUserBaseAPI({ username: formStateBasic.userName, gender: formStateBasic.gender, id: counter.clientlogin.id }).then(res => {
        if (res.code == 0) {
            visibleBasic.value = false
            fetchcurrent()
        } else {
            message.error('修改失败')
        }
    })
}
//#endregion

//#region 修改密码
const safetylink = () => {
    showright.value = 2
}
const formStatePassword = reactive({
    oldPassword: '',
    newPassword: '',
    checkNewPassword: ''
})
const updatePassword = () => {
    UpdateUserPasswordByPasswordAPI({
        id: counter.clientlogin.id,
        oldPassword: formStatePassword.oldPassword,
        newPassword: formStatePassword.newPassword,
        checkNewPassword: formStatePassword.checkNewPassword
    }).then(res => {
        if (res.code == 0) {
            message.success('修改成功')
            localStorage.removeItem('tokenuser')
            router.push('/client/login')
            formStatePassword.oldPassword = ''
            formStatePassword.newPassword = ''
            formStatePassword.checkNewPassword = ''

        }
    })
}
//#endregion

//#region 修改邮箱
const emaillink = () => {
    showright.value = 3
}
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
    emailUserVerifyAPI({ email: counter.clientlogin.email }).then(res => {
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
const updatePasswordformState = reactive({
    newEmail: '',
})

const updateemail = () => {
    console.log('执行')
    emailUserUpdateAPI({ id: counter.clientlogin.id, email: updatePasswordformState.newEmail })
        .then(res => {
            if (res.code == 0) {
                current.value++;
                fetchcurrent()
            }
        })
}

const GoLogin = () => {

    showright.value = 1
}

//#endregion

//#region 修改手机号
const phonelink = () => {
    showright.value = 4
}
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
    phoneUserVerifyAPI({ phone: counter.clientlogin.phone }).then(res => {
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
    phoneUserUpdateAPI({ id: counter.clientlogin.id, phone: updatePasswordformStatePhone.newPhone })
        .then(res => {
            if (res.code == 0) {
                currentPhone.value++;
                fetchcurrent()
            }
        })
}

const GoLoginPhone = () => {
    showright.value = 1
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

.personal-password {
    padding-left: 100px;
    padding-right: 100px;
}

.basic-item {
    margin-top: 40px;
}

.basic-item ul {
    margin-top: 20px;
    list-style: none;
    padding: 0px;
}

.basic-item li {
    height: 60px;
    line-height: 60px;
    font-size: 17px;
}

.client-personal {
    width: 70%;
    margin: 0px auto;
}

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