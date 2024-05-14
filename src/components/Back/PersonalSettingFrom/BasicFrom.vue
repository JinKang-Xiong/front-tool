<template>
    <h1>基础设置</h1>
    <br />
    <div class="basicfrom-content">
        <div class="basicfrom-from">
            <a-form :model="formState" :rules="rules" @finish="handFinish" @finishFailed="handFinishFailed" labelWrap=true>
                <a-form-item has-feedback label="用户名" name="bigManagerName" style="display: block;">
                    <a-input v-model:value="formState.bigManagerName" placeholder="请输入您的用户名"></a-input>
                </a-form-item>
                <a-form-item has-feedback label="年龄" name="age" style="display: block;">
                    <a-input type="number" v-model:value.number="formState.age" placeholder="请输入您的年龄"></a-input>
                </a-form-item>
                <a-form-item has-feedback label="性别" name="gender" style="display: block;">
                    <a-radio-group v-model:value="formState.gender">
                        <a-radio :value="1">男</a-radio>
                        <a-radio :value="0">女</a-radio>
                    </a-radio-group>
                </a-form-item>
                <br />
                <a-form-item>
                    <a-button type="primary" htmlType="submit">更新基本信息</a-button>
                </a-form-item>
            </a-form>
        </div>
        <div class="basicfrom-avatar">
            <div>
                <a-avatar :size="164"
                    :src="counter.userlogin.avatarStatus == 0 ? '/api/' + src : '/api/images/avatar/errImage.jpg'" alt="头像">

                </a-avatar>
            </div>
            <div style="margin-top: 30px;">
                <a-button type="dashed" @click="updateshowDialog">上传头像</a-button>
            </div>
            <myUpload v-model="showDialog" :url="baseuploadurl" @crop-upload-success="cropUploadSuccess" :params="params" />

        </div>
    </div>
</template>

<script setup>
import { reactive, ref, resolveComponent } from 'vue'
import myUpload from 'vue-image-crop-upload'
import { ManagerCurrent, BigManagerUpdateBasic } from '../../../api/backApi.js';
import { useCountStore } from '../../../stores/count.js';
import { message } from 'ant-design-vue';
const counter = useCountStore()


//#region 基础信息表单提交
const formState = reactive({
    bigManagerName: counter.userlogin.bigManagerName,
    age: counter.userlogin.age,
    gender: counter.userlogin.gender
})

const handFinish = () => {
    BigManagerUpdateBasic({ ...formState, id: counter.userlogin.id }).then((res) => {
        if (res.code == 0) {
            message.success("修改成功")
            const token = localStorage.getItem('token')
            ManagerCurrent({}, token).then((res) => {
                if (res.code == 0)
                    counter.userlogin.userlogin = res.data
            })
        } else {
            message.error("修改失败")
        }
    }).catch((err) => {
        message.error(err)
    })
}

//#endregion

//#region 修改头像的功能
const src = ref(counter.userlogin.avatarUrl)
const params = reactive({
    id: counter.userlogin.id
})
const showDialog = ref(false)
const baseuploadurl = ref('/api/bigmanager/updateAvatar')

const updateshowDialog = () => {
    showDialog.value = !showDialog.value
}

const cropUploadSuccess = (jsonData, field) => {
    showDialog.value = !showDialog.value
    const token = localStorage.getItem('token')
    if (jsonData.code == 0) {
        ManagerCurrent({}, token).then((res) => {
            if (res.code == 0) {
                message.success("修改成功")
                counter.userlogin = res.data
                src.value = res.data.avatarUrl
            } else {
                message.error("修改失败")
            }

        })
    } else {
        message.error("修改失败")
    }

}

//#endregion

</script>


<style scoped>
.basicfrom-content {
    display: flex;
    justify-content: space-between;
}

.basicfrom-from {
    width: 60%;
}

.basicfrom-avatar {
    width: 38%;
    display: flex;
    align-items: center;
    flex-direction: column;
}
</style>