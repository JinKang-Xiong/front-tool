<template>
    <div>
        <a-row style="">
            <a-col :span="2" offset="4">
                <a-space>
                    <left-outlined @click="RouterCodeShow" />
                    <span style="font-weight: 600; font-size: 18px;">增加代码</span>
                </a-space>

            </a-col>
        </a-row>
        <div class="add-code">

            <a-row style="height: 50px; padding-top: 2px;">
                <a-col :span="22">
                    <a-input v-model:value="CodeSnippet.codeTitle" :bordered="false" placeholder="请输入代码片段标题" size="large" />
                </a-col>
            </a-row>
            <a-row style="margin-top: 10px;">
                <a-col :span="24">
                    <a-textarea :auto-size="{ minRows: 4, maxRows: 6 }" v-model:value="CodeSnippet.codeDescription"
                        placeholder="请输入代码片段的描述" allow-clear /> </a-col>
            </a-row>
            <a-row style="margin: 10px 4px;">
                <span style="margin-right: 10px;">可见范围</span>
                <a-radio-group v-model:value="CodeSnippet.codeIsPrivate">
                    <a-radio :value="1">私有性</a-radio>
                    <a-radio :value="2">公共性</a-radio>
                </a-radio-group>
            </a-row>
            <a-row style="margin: 10px 2px;">
                <template v-for="(  tag, index  ) in   state.tags  " :key="tag">
                    <a-tooltip v-if="tag.length > 20" :title="tag">
                        <a-tag :closable="index !== 0" @close="handleClose(tag)">
                            {{ `${tag.slice(0, 20)}...` }}
                        </a-tag>
                    </a-tooltip>
                    <a-tag v-else :closable="index !== 0" @close="handleClose(tag)">
                        {{ tag }}
                    </a-tag>
                </template>
                <a-input v-if="state.inputVisible" ref="inputRef" :bordered="false" placeholder="请输入标签"
                    v-model:value="state.inputValue" type="text" size="small" :style="{ width: '100px' }"
                    @blur="handleInputConfirm" @keyup.enter="handleInputConfirm">
                    <template #suffix>
                        <span @click="handleInputConfirm">
                            <check-outlined />
                        </span>

                    </template>
                </a-input>
                <a-tag v-else style="background: #fff; border-style: dashed" @click="showInput">
                    <a-tooltip>
                        <template #title>输入完成按下回车也可</template>
                        <plus-outlined style="font-size: 16px;" /><span style="font-size: 16px;">增加标签</span>
                    </a-tooltip>

                </a-tag>
            </a-row>
            <div>
                <my-ace-editor @accept-languang="languageCode" :width="920" :height="500"
                    v-model:content="CodeSnippet.codeSnippet" :languageMoel="CodeSnippet.codeLanguage"></my-ace-editor>
            </div>
            <div class="addCode-upload">
                <a-upload v-model:fileList="fileList" name="file" :multiple="true" :before-upload="beforeUpload"
                    :customRequest="customUpload" action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    @change="handleChange" @drop="handleDrop" list-type="picture-card" @preview="handlePreview">
                    <div v-if="fileList.length < 8">
                        <plus-outlined />
                        <div style="margin-top: 8px">上传运行结果图</div>
                    </div>
                </a-upload>

                <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
                    <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
            </div>
            <a-row style="margin-top: 20px;">
                <a-col :span="5">
                    <a-space>
                        <a-button type="primary" @click=AddCodeSnippet>确定</a-button>
                        <a-button type="" @click="RouterCodeShow">取消</a-button>
                    </a-space>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, reactive, nextTick } from 'vue'
import { PlusOutlined, LeftOutlined, CheckOutlined, StarOutlined, StarFilled, StarTwoTone } from '@ant-design/icons-vue';
import { AddCodeSnippetAPI } from '../../../api/clientApi';
import { message } from 'ant-design-vue';
import MyAceEditor from '../MyAceEditor.vue';
import { useRouter } from 'vue-router'
const props = defineProps(['_id'])
const router = useRouter()

const CodeSnippet = ref({
    codeTitle: '',
    codeSnippet: '',
    codeDescription: '',
    codeLanguage: 'javascript',
    codeIsPrivate: null
})

//#region 增加标签
const inputRef = ref();
const state = reactive({
    tags: '',
    inputVisible: false,
    inputValue: '',
});
const handleClose = removedTag => {
    const tags = state.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    state.tags = tags;
};
const showInput = () => {
    state.inputVisible = true;
    nextTick(() => {
        inputRef.value.focus();
    });
};
const handleInputConfirm = () => {
    const inputValue = state.inputValue;
    let tags = state.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue];
    }
    console.log(tags);

    // 将一个或多个源对象中的属性复制到目标对象
    Object.assign(state, {
        tags,
        inputVisible: false,
        inputValue: '',
    });
    console.log(state);

};

//#endregion

//#region 
//图片上传的临时存放
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
const fileList = ref([])

//模态框的出现
const handlePreview = async file => {
    console.log("模态框的出现");

    console.log(file);

    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
    previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};
const handleCancel = () => {
    previewVisible.value = false;
    previewTitle.value = '';
};

//自定义请求方式
const customUpload = async (fileinfo) => {
    console.log("----自定义请求方式-----");
    console.log(fileList.value);


    let { file } = fileinfo
    console.log(file);
    try {
        const url = await fileToBase64(file)
        fileList.value.forEach(item => {
            if (file.uid == item.uid) {
                item.url = url
                item.status = 'done'
            }
        })
        console.log(fileList.value);

    } catch (error) {
        message.error(error.message)
        console.log(error)
    }
}

//转换为base64的编码格式
const fileToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file)
    return new Promise((resolve, reject) => {
        reader.onload = function (e) {
            if (this.result) {
                resolve(this.result)
            } else {
                reject("图片转换错误，请稍后重试")
            }
        }
    })
}

//上传前进行拦截器的判断
const beforeUpload = file => {
    console.log("上传前的拦截");
    console.log(file);

    const { type, size } = file;
    const limitType = type === 'image/jpeg' || type === 'image/png';
    if (!limitType) {
        message.error('请上传 JPG、PNG 格式图片!');
    }
    const limitSize = size / 1024 / 1024 < 6;
    if (!limitSize) {
        message.error('图片不可大于 6MB!');
    }
    return limitType && limitSize;
}
const uploadProcess = ref()
//将文件转换为二进制来传递
const formDataFun = () => {
    let formData = new FormData()
    fileList.value.forEach((item, index) => {
        console.log(item);
        let dataURL = item.url


        //将base64编码的图片解码为二进制的数据
        const binaryData = atob(item.url.split(',')[1]);

        //创建一个Uint8Array数组来存储二进制数据
        const arrayBuffer = new Uint8Array(binaryData.length)
        for (let i = 0; i < binaryData.length; i++) {
            arrayBuffer[i] = binaryData.charCodeAt(i);
        }

        const blob = new Blob([arrayBuffer], { type: item.type })
        formData.append('file', blob, `images${index + 1}.jpg`)

    })

    return formData
}
//#endregion

const AddCodeSnippet = () => {
    let formData = formDataFun()
    formData.set('_id', props._id)
    formData.set('codeTitle', CodeSnippet.value.codeTitle)
    formData.set('codeDescription', CodeSnippet.value.codeDescription)
    formData.set('codeSnippet', CodeSnippet.value.codeSnippet)
    formData.set('codeTag', state.tags)
    formData.set('codeLanguage', CodeSnippet.value.codeLanguage)
    console.log(formData);
    AddCodeSnippetAPI(formData).then(res => {
        if (res.code == 0) {
            message.success("增加片段成功")
            router.back()
        }
    })
}

const RouterCodeShow = () => {
    // router.push({ name: 'codeshow', params: { _id: props._id } })
    router.back()
}
</script>

<style scoped>
.add-code {
    width: 71%;
    margin-left: 220px;
    margin-top: 20px;
    border: 2px solid rgb(243, 243, 243);
    padding: 2px;
    /* background-color: rgb(243, 243, 243); */
}
</style>