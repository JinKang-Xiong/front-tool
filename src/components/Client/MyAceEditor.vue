<template>
    <div class="code-content-item" @focus="handleFocus">
        <a-row style="height: 50px; padding-top: 2px;">
            <a-col :span="20">
                <!-- <a-input v-model:value="CodeData.codeTitle" :bordered="false" placeholder="请输入代码片段标题" size="large" /> -->
                <input id="inputTitle" v-model="CodeData.codeTitle" ref="backTitleColor" placeholder="请输入代码片段标题">
            </a-col>
            <a-col :span="4" style="line-height: 48px; text-align: center;">
                <a-space :size="18">
                    <a-tooltip>
                        <template #title>为代码片段添加一些描述</template>
                        <highlight-outlined @click="ShowDescription" />
                    </a-tooltip>
                    <a-tooltip>
                        <template #title>修改查看范围</template>
                        <edit-outlined @click="updateSnippetIsPrivateModel(CodeData.codeIsPrivate)"></edit-outlined>
                    </a-tooltip>
                    <a-tooltip>
                        <template #title>删除</template>
                        <close-outlined style="color: red;" @click="deleteSnippet(CodeData.codeuuid)" />
                    </a-tooltip>
                </a-space>
                <a-modal v-model:visible="visibleUpdateSnippetIsPrivate" title="编辑代码片段"
                    @ok="updateSnippetIsPrivate(CodeData.codeuuid)" okText="确定" cancelText="取消">
                    <span>代码可见范围</span>
                    <a-select v-model:value="isPrivate" style="width: 200px" @focus="focus" @change="handleChange">
                        <a-select-option :value="1">公开性</a-select-option>
                        <a-select-option :value="0">私有性</a-select-option>
                        <a-select-option :value="2">监控中</a-select-option>
                    </a-select>
                </a-modal>
            </a-col>
        </a-row>
        <a-row v-if="isDescription">
            <a-textarea v-model:value="CodeData.codeDescription" :autosize="{ minRows: 3, maxRows: 6 }"
                placeholder="请输入一些描述" :bordered="false" />
        </a-row>
        <a-row style="margin-top: 10px;">
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
            <a-input v-if="state.inputVisible" ref="inputRef" :bordered="false" placeholder="请输入标签,按下回车即可保存"
                v-model:value="state.inputValue" type="text" size="small" :style="{ width: '200px' }"
                @blur="handleInputConfirm" @keyup.enter="handleInputConfirm" />
            <a-tag v-else style="background: #fff; border-style: dashed" @click="showInput">
                <plus-outlined />
                新建标签
            </a-tag>
        </a-row>
        <div class="ace-editor-content">
            <a-row>
                <a-col :span="2" offset="22" style="padding-left: 30px;">
                    <a-switch style="margin-left: 5px;" v-model:checked="checked1" checked-children="黑夜"
                        un-checked-children="白天" @click="ChangeAceBackColor" />
                </a-col>
            </a-row>
            <div class="copyioce" :style="{ color: copyBackColor }" @click="CopySnippet">
                <copy-outlined />
            </div>
            <div id="my-ace-editor" ref="editorRef" :style="{ width: '1000px', height: '550px' }">

            </div>
            <div id="my-ace-editor-language">
                <a-row>
                    <a-col :span="3" offset="21" style="padding-left: 20px;">
                        <a-select ref="select" v-model:value="modeValue" style="width: 105px" @focus="focus"
                            size="small" @change="handleChange" :options="modeArray"
                            :field-names="{ label: 'name', value: 'path' }">
                        </a-select></a-col>
                </a-row>
            </div>
        </div>
        <a-row>
            <a-col :span="2">
                <a-button type="primary" @click="UpdateSnippet">保存</a-button>
            </a-col>
            <a-col :span="4">
                <a-space>
                    <a-button type="" @click="visibleAddPicture = true">上传图片</a-button>
                    <a-button type="" @click="visibleCodeRunResult = true">查看图片</a-button>
                </a-space>
                <a-drawer title="代码运行结果图" :placement="placement" :closable="false" :visible="visibleCodeRunResult"
                    @close="onClose">
                    <a-row v-for="item in CodeData.codeRunResult" style="margin-top: 5px;">
                        <a-col :span="21"> <a-image :width="280" :src="item" />
                        </a-col>
                        <a-col :span="3">
                            <a-button type="text" danger style="padding: 4px;"
                                @click="DeleteCodeRunResult(item)"><close-outlined /></a-button>
                        </a-col>
                    </a-row>


                </a-drawer>
            </a-col>
            <a-modal v-model:visible="visibleAddPicture" title="上传图片" @ok="handleOkAddPicture" okText="确定"
                cancelText="取消">
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
            </a-modal>
        </a-row>
    </div>
</template>


<script setup>
import { StarOutlined, EditOutlined, CopyOutlined, HighlightOutlined, CloseOutlined, EllipsisOutlined, LeftOutlined, PlusOutlined, SearchOutlined, FolderOpenOutlined, FolderOutlined, RightOutlined, SmileOutlined, SettingOutlined, AppstoreOutlined, UserOutlined, GoldOutlined, CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons-vue';
import { ref, onMounted, defineProps, onBeforeUnmount, watch, watchEffect, reactive, } from 'vue'
import { FindBycodeuuidAPI, UpdateSnippetAPI, UpdateSnippetIsPrivateAPI, DeleteSnippetAPI, AddCodeRunResultAPI, DeleteCodeRunResultAPI } from '../../api/clientApi.js'
import { message } from 'ant-design-vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import * as ace from 'ace-builds'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-min-noconflict/mode-html'
import 'ace-builds/src-noconflict/mode-css'
import 'ace-builds/src-noconflict/mode-scss'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-text'
import 'ace-builds/src-noconflict/ext-language_tools'
//主题的包
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-min-noconflict/theme-chrome'
//语法提示的包
import 'ace-builds/src-noconflict/snippets/javascript'
import 'ace-builds/src-noconflict/snippets/html'
import 'ace-builds/src-noconflict/snippets/css'
import 'ace-builds/src-noconflict/snippets/scss'
import 'ace-builds/src-noconflict/snippets/json'
import 'ace-builds/src-noconflict/snippets/java'
import 'ace-builds/src-noconflict/snippets/text'
import { useclientStore } from '../../stores/count.js'

const counter = useclientStore()
const props = defineProps(['_id', 'codeuuid'])
const emit = defineEmits(['deleteCode'])
const router = useRouter()
const editorRef = ref()
let editor
onMounted(() => {

    fetchCode({ _id: props._id, codeuuid: props.codeuuid, })

})
onBeforeUnmount(() => {
    editor.destroy()
})

//#region 初始化数据
const CodeData = ref({

})
const backTitleColor = ref()
const fetchCode = (query) => {
    FindBycodeuuidAPI(query).then(res => {
        if (res.code == 0) {
            CodeData.value = { ...res.data[0].codeList }
            state.tags = [...CodeData.value.codeTag]
            backTitleColor.value.select()
            modeValue.value = CodeData.value.codeLanguage
            isPrivate.value = CodeData.value.codeIsPrivate
            if (CodeData.value.codeDescription) {
                isDescription.value = true
            } else {
                isDescription.value = false
            }
            //初始化编辑器
            editor = ace.edit(editorRef.value)

            //更换语言高亮
            editor.session.setMode('ace/mode/' + CodeData.value.codeLanguage)

            editor.setValue(CodeData.value.codeSnippet ? CodeData.value.codeSnippet : '')
            //更换主题
            editor.setTheme("ace/theme/monokai")

            // 示例：设置字体大小
            editor.setFontSize("14px");

            // 示例：设置其他选项
            editor.setOptions({
                showLineNumbers: true,
                showGutter: true,
                useWrapMode: true,
                highlightActiveLine: true,
                enableSnippets: true,
                enableLiveAutocompletion: true,
                enableBasicAutocompletion: true
            });


            ace.require("ace/ext/language_tools");

            editor.session.on("change", change)

        }
    })
}
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



//修改代码片段得可见范围
const isPrivate = ref()
const visibleUpdateSnippetIsPrivate = ref(false)
const updateSnippetIsPrivateModel = (codeIsPrivate) => {
    // UpdateSnippetIsPrivateAPI({_id:CodeStoreItem.value._id,userId:CodeStoreItem.value.userId,codeuuid})
    visibleUpdateSnippetIsPrivate.value = true
    isPrivate.value = codeIsPrivate

}
const updateSnippetIsPrivate = (codeuuid) => {
    UpdateSnippetIsPrivateAPI({ _id: props._id, userId: counter.clientlogin.id, codeuuid: props.codeuuid, isPrivate: isPrivate.value }).then(res => {
        if (res.code == 0) {
            if (res.data == '抱歉，可见范围修改失败') {
                message.error('抱歉，可见范围修改失败')
            } else {
                message.success('修改成功')
            }
            visibleUpdateSnippetIsPrivate.value = false
            emit('deleteCode')
        }
    })
}
//修改代码片段
const UpdateSnippet = () => {
    UpdateSnippetAPI({
        _id: props._id,
        codeuuid: props.codeuuid,
        codeTitle: CodeData.value.codeTitle,
        codeDescription: CodeData.value.codeDescription,
        codeTag: state.tags,
        codeSnippet: CodeData.value.codeSnippet,
        codeLanguage: CodeData.value.codeLanguage
    }).then(res => {
        if (res.code == 0) {
            message.success('保存成功')
            fetchCode({ _id: props._id, codeuuid: props.codeuuid })
            emit('deleteCode')
        }
    })
}

//删除代码片段
const deleteSnippet = (codeuuid) => {
    DeleteSnippetAPI({ _id: props._id, codeuuid: props.codeuuid }).then(res => {
        if (res.code == 0) {
            message.success("删除成功")
            emit('deleteCode')
            router.push({ name: 'codeshow', params: { _id: props._id } })

        }
    })
}
const isDescription = ref(false)
const ShowDescription = () => {
    if (!isDescription.value) {
        isDescription.value = true

    } else {
        isDescription.value = false
    }
}

const change = () => {
    console.log('内容已经改变')
    console.log(editor.getValue())
    CodeData.value.codeSnippet = editor.getValue()
}

const modeArray = ref([{
    name: 'JavaScript',
    path: 'ace/mode/javascript'
}, {
    name: 'HTML',
    path: 'ace/mode/html'
}, {
    name: 'CSS',
    path: 'ace/mode/css'
}, {
    name: 'SCSS',
    path: 'ace/mode/scss'
}, {
    name: 'Json',
    path: 'ace/mode/json'
}, {
    name: 'Java',
    path: 'ace/mode/java'
}, {
    name: 'Text',
    path: 'ace/mode/text'
}])

const modeValue = ref()

const handleChange = () => {
    console.log('选择啦');
    console.log(modeValue.value);
    editor.session.setMode(modeValue.value)
    const languageArr = modeValue.value.split('/')
    CodeData.value.codeLanguage = languageArr[2]
}

const checked1 = ref(true)
const copyBackColor = ref('white')
const CopySnippet = () => {
    navigator.clipboard.writeText(CodeData.value.codeSnippet).then(() => {
        message.success("复制成功")
    }).catch(err => {
        message.error("复制失败")
    })
}
const ChangeAceBackColor = () => {
    if (checked1.value == false) {
        editor.setTheme("ace/theme/chrome")
        copyBackColor.value = 'black'
    }
    if (checked1.value == true) {
        editor.setTheme("ace/theme/monokai")
        copyBackColor.value = 'white'
    }
}

watch(() => [props._id, props.codeuuid], (newValue, oldValue) => {
    fetchCode({ _id: newValue[0], codeuuid: newValue[1] })

})

//#region 上传图片
const visibleAddPicture = ref(false)
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
const handleOkAddPicture = () => {
    let formData = formDataFun()
    formData.set('_id', props._id)
    formData.set('codeuuid', props.codeuuid)
    console.log(formData);
    AddCodeRunResultAPI(formData).then(res => {
        if (res.code == 0) {
            message.success('上传成功')
            visibleAddPicture.value = false
            fetchCode({ _id: props._id, codeuuid: props.codeuuid, })

        }
    })
}
//#endregion

//#region 查看图片和删除图片
const visibleCodeRunResult = ref(false)
const onClose = () => {
    visibleCodeRunResult.value = false;
};

const DeleteCodeRunResult = (codeRunResult) => {
    DeleteCodeRunResultAPI({ _id: props._id, codeuuid: props.codeuuid, codeRunResult }).then(res => {
        if (res.code == 0) {
            message.success('删除成功')
            fetchCode({ _id: props._id, codeuuid: props.codeuuid, })
        } else {
            message.error('删除失败')
        }
    })
}
</script>


<style scoped>
#inputTitle {
    border: none;
    outline: none;
    width: 800px;
    font-size: 19px;
}

.ace-editor-content {
    width: 1000px;
    position: relative;

}

#my-ace-editor-language {
    margin-top: 2px;
}

.copyioce {
    position: absolute;
    left: 975px;
    cursor: pointer;
    z-index: 8;
}
</style>