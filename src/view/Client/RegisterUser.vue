<template>
    <div class="main">
        <div class="main-left">
            <div class="main-left-title">
                <h1>注册一个，和大家一起</h1>
            </div>
            <div class="main-left-img">
                <img src="../../../public/images/undraw_coffee_with_friends_3cbj.svg">
            </div>

        </div>
        <div class="main-right">
            <div class="main-right-form">
                <p class="login-text">用户注册</p>
                <a-form :model="user" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
                    <a-form-item has-feedback label="用户名" name="username">
                        <a-input v-model:value="user.username" />
                    </a-form-item>
                    <a-form-item has-feedback label="账号" name="userAccount">
                        <a-input v-model:value="user.userAccount" />
                    </a-form-item>
                    <a-form-item has-feedback label="密码" name="userPassword">
                        <!-- <a-input v-model:value="user.password" type="password" /> -->
                        <a-input-password v-model:value="user.userPassword" placeholder="输入密码" />
                    </a-form-item>
                    <a-form-item has-feedback label="重复密码" name="checkPassword">
                        <!-- <a-input v-model:value="user.repeatpassword" type="password" /> -->
                        <a-input-password v-model:value="user.checkPassword" placeholder="再次输入密码" />
                    </a-form-item>
                    <a-form-item label="性别">
                        <a-radio-group v-model:value="user.gender">
                            <a-radio :value='1'>男</a-radio>
                            <a-radio :value='2'>女</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item has-feedback label="邮箱" name="email">
                        <a-input v-model:value="user.email" />
                    </a-form-item>
                    <a-form-item has-feedback label="手机号" name="phone">
                        <a-input v-model:value="user.phone" />
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 20, offset: 10 }">
                        <a-button type="primary" @click="onSubmit">注册</a-button>
                        <a-button style="margin-left: 10px" @click="Routerback">取消</a-button>
                    </a-form-item>
                </a-form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { UserRegisterAPI, UserLoginAPI } from '../../api/clientApi.js'
import { reactive, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue'

const router = useRouter()
const user = reactive({
    username: '',
    userAccount: '',
    userPassword: '',
    checkPassword: '',
    gender: null,
    email: '',
    phone: ''
});
const labelCol = reactive({
    style: {
        width: '100px',
    },
})
const wrapperCol = reactive({
    span: 20,
},)
const onSubmit = () => {
    console.log('submit!', toRaw(user));
    UserRegisterAPI(user).then(res => {
        if (res.code == 0) {
            message.success('注册成功')
            router.push('/client/login')
        } else {
            message.error('注册失败', res.description)
        }
    })


};



//账号验证长度不下于4位
let checkUserAccount = async (rule, value) => {
    console.log(value)
    if (value.length < 4) {
        return Promise.reject('账户长度必须要大于4位')
    }
    return Promise.resolve()
}

//密码长度要大于六位
let checkUserPassword = async (rule, value) => {
    console.log('在输入')
    if (value === '') {
        return Promise.reject('请输入密码')
    }
    if (value.length < 6) {
        return Promise.reject('密码长度必须大于六位')
    }
    return Promise.resolve()
}

//验证两次密码输入一致
let checkedUserPassword2 = async (rule, value) => {
    if (value === '') {
        return Promise.reject('请输入密码')
    }
    if (value.length < 6) {
        return Promise.reject('密码长度必须大于六位')
    }
    if (value !== user.userPassword) {
        return Promise.reject("两次密码输入不一致")
    }

    return Promise.resolve()
}

//验证邮箱格式是否正确
let checkUserEmail = async (rule, value) => {
    let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if (!reg.test(value)) {
        return Promise.reject("邮箱的格式不正确,正确格式如下:xxxx@xxx.xxx")
    }
    return Promise.resolve()
}

//验证手机号是否正确
/**
 * 1 表示手机号码首位必须为1
 * [3-9] 表示第二位可以是 3 到 9 中的任意一位
 * \d{9} 表示后面跟的9位都是数字
 */
let checkUserPhone = async (rule, value) => {
    let reg = /^1[3-9]\d{9}$/;
    if (!reg.test(value)) {
        return Promise.reject("手机号输入错误")
    }
    return Promise.resolve()
}



const rules = {
    username: [
        {
            required: true,
            message: '用户名不能为空'
        }
    ],
    userAccount: [
        {
            required: true,
            validator: checkUserAccount,
            trigger: 'change'
        }
    ],
    userPassword: [
        {
            required: true,
            validator: checkUserPassword,
            trigger: 'change'
        }
    ],
    checkPassword: [
        {
            required: true,
            validator: checkedUserPassword2,
            trigger: 'change'
        }
    ],
    email: [
        {
            required: true,
            validator: checkUserEmail,
            trigger: 'change'
        }
    ],
    phone: [
        {
            validator: checkUserPhone,
            trigger: 'change'
        }
    ],


}

const Routerback = () => {
    router.back()
}

</script>
<style>
.main {
    width: 1000px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 2px solid black;
    height: 600px;
    margin: 70px auto;
    border-radius: 10px;
}

.main-left {
    width: 50%;
    height: 600px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.main-left-title {
    width: 100%;
    /* border: 1px solid black;s */
    height: 120px;
    text-align: center;
    line-height: 91px;

}

.main-left-img {
    width: 100%;
    height: 500px;
    /* border: 1px solid black; */


}

.main-left img {
    width: 450px;
    margin-top: 182px;

}

.main-right {
    width: 50%;
    height: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.login-text {
    height: 60px;
    width: 80%;
    margin: 0 auto;
    text-align: center;
    font-size: 20px;
    font-family: "微软雅黑";
    font-weight: 600;
    line-height: 30px;
}

.main-right-form {
    width: 70%;
    height: 500px;
    margin: 0px auto;
}
</style>