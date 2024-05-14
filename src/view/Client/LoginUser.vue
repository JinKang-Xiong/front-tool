<template>
    <div class="main">
        <div class="main-left">
            <div class="main-left-title">
                <h1>欢迎来到！用户中心</h1>
            </div>
            <div class="main-left-img">
                <img src="../../../public/images/undraw_work_time_re_hdyv.svg">
            </div>

        </div>
        <div class="main-right">
            <div class="main-right-form">
                <p class="login-text">用户登录</p>
                <a-form :model="formState" name="normal_login" class="login-form" @finish="onFinish"
                    @finishFailed="onFinishFailed">
                    <a-form-item label="账号" name="username"
                        :rules="[{ required: true, message: 'Please input your username!' }]">
                        <a-input v-model:value="formState.username">
                            <template #prefix>
                                <UserOutlined class="site-form-item-icon" />
                            </template>
                        </a-input>
                    </a-form-item>

                    <a-form-item label="密码" name="password"
                        :rules="[{ required: true, message: 'Please input your password!' }]">
                        <a-input-password v-model:value="formState.password">
                            <template #prefix>
                                <LockOutlined class="site-form-item-icon" />
                            </template>
                        </a-input-password>
                    </a-form-item>

                    <a-form-item>
                        <a-space :size="200">
                            <a-form-item name="remember" no-style>
                                <a-checkbox v-model:checked="formState.remember">记住密码</a-checkbox>
                            </a-form-item>
                            <a class="login-form-forgot" @click="RouterForget">忘记密码</a>
                        </a-space>

                    </a-form-item>

                    <a-form-item>
                        <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button" block>
                            Log in
                        </a-button>

                    </a-form-item>
                    <a-form-item>
                        Or
                        <!-- <a href="" style="font-size: 15px;">注册用户</a> -->
                        <router-link to="/client/register" style="font-size: 15px;">注册用户</router-link>
                    </a-form-item>
                </a-form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue';
import { useCountStore } from '../../stores/count.js';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue'
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router'
import { UserLoginAPI } from '../../api/clientApi';
const router = useRouter()
const countStore = useCountStore()

const formState = reactive({
    username: '',
    password: '',
    remember: false,
});
const onFinish = values => {
    console.log('Success:', values);
    const successlogin = UserLoginAPI({ useraccount: formState.username, userpassword: formState.password, isRemerber: formState.remember });
    console.log(successlogin)
    successlogin.then((res) => {
        console.log(res.data);
        if (res.code != 0) {
            router.push('/client/login')
            message.error('登陆失败')
            return
        }
        message.success("登录成功")
        localStorage.setItem("tokenuser", res.data)
        router.push('/client/home/myhome')
    })
};
const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
};
const disabled = computed(() => {
    return !(formState.username && formState.password);
});
onMounted(() => {
    var localuserlogin = JSON.parse(localStorage.getItem('userlogin'))
    console.log("localuserlogin", localuserlogin)
    // var isremember=formState.remember;
    if (localuserlogin) {
        router.push('/home');
    }
})

const RouterForget = () => {
    router.push("/client/forgetpassword")
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
    width: 500px;
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
    height: 400px;
    margin: 0px auto;
}


#components-form-demo-normal-login .login-form {
    max-width: 300px;
}

#components-form-demo-normal-login .login-form-forgot {
    float: right;
}

#components-form-demo-normal-login .login-form-button {
    width: 100%;
}
</style>