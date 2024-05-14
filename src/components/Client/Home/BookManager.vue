<template>
    <div class="book-content">
        <a-row>
            <a-col :span="11" style="" offset="1">
                <div style="text-align: center;margin-top: 80px;">
                    <a-typography-title :level="2">我的书库</a-typography-title>
                    <a-typography-text type="secondary" style="font-size: 20px;">书籍是你的宝藏之一</a-typography-text>
                </div>

            </a-col>
            <a-col :span="12">
                <img src="../../../assets/Client/images/booklogo3.svg" style="width: 340px ;height: 250px;">
            </a-col>
        </a-row>
        <div class="books">
            <a-row>
                <a-col :span="4">
                    <div style="border-right: 1px solid rgb(208, 215, 222);width: 95%;">
                        <a-typography-title :level="5"
                            style="text-align: center;margin: 15px 0px;">书籍标签</a-typography-title>
                        <ul class="book-tag">
                            <li :style="{ backgroundColor: notebookColor == -1 ? 'rgb(230,247,255)' : '' }"
                                @click="showAllBook">全部书籍</li>
                            <li :style="{ backgroundColor: notebookColor == index ? 'rgb(230, 247, 255)' : '' }"
                                v-for="(item, index) in booksTag" @click="SearchByTag(item, index)">
                                {{ item }}
                            </li>
                        </ul>

                    </div>

                </a-col>
                <a-col :span="18">
                    <a-row style="margin-top: 10px;">
                        <a-col :span="4">
                            <a-button size="large" type="primary" @click="visibleUpDownBook = true">上传书籍</a-button>
                        </a-col>
                        <a-modal v-model:visible="visibleUpDownBook" title="上传书籍" @ok="handleOkAddBook" okText="确定"
                            cancelText="取消">
                            <a-spin :spinning="spinning" tip="上传中...">
                                <a-form :model="formDataBook" name="basic" autocomplete="off">
                                    <a-form-item name="upload" label="上传文件">
                                        <a-upload v-model:file-list="fileList1" name="file"
                                            :before-upload="beforeUpload1" :customRequest="customUpload1"
                                            :headers="headers" @change="handleChange">
                                            <a-button>
                                                <upload-outlined></upload-outlined>
                                                上传
                                            </a-button>
                                        </a-upload>
                                    </a-form-item>
                                    <a-form-item name="bookName" label="书籍名称">
                                        <a-input v-model:value="formDataBook.bookName"></a-input>
                                    </a-form-item>
                                    <a-form-item name="bookDescription" label="书籍描述">
                                        <a-textarea :autosize="{ minRows: 3, maxRows: 6 }"
                                            v-model:value="formDataBook.bookDescription" show-count :maxlength="100" />
                                    </a-form-item>
                                    <a-form-item name="bookTag" label="书籍标签">
                                        <template v-for="(tag, index) in state.tags" :key="tag">
                                            <a-tooltip v-if="tag.length > 20" :title="tag">
                                                <a-tag :closable="index !== 0" @close="handleClose(tag)">
                                                    {{ `${tag.slice(0, 20)}...` }}
                                                </a-tag>
                                            </a-tooltip>
                                            <a-tag v-else :closable="true" @close="handleClose(tag)">
                                                {{ tag }}
                                            </a-tag>
                                        </template>
                                        <a-input v-if="state.inputVisible" ref="inputRef"
                                            v-model:value="state.inputValue" type="text" size="small"
                                            :style="{ width: '78px' }" @blur="handleInputConfirm"
                                            @keyup.enter="handleInputConfirm" />
                                        <a-tag v-else style="background: #fff; border-style: dashed" @click="showInput">
                                            <plus-outlined />
                                            新建标签
                                        </a-tag>
                                    </a-form-item>
                                    <a-form-item name="bookImg" label="添加封面">
                                        <a-upload v-model:fileList="fileList" name="file" :multiple="true"
                                            :before-upload="beforeUpload" :customRequest="customUpload"
                                            list-type="picture-card" @preview="handlePreview">
                                            <div v-if="fileList.length < 1">
                                                <plus-outlined />
                                                <div style="margin-top: 8px">上传书籍封面</div>
                                            </div>
                                        </a-upload>

                                        <a-modal :visible="previewVisible" :title="previewTitle" :footer="null"
                                            @cancel="handleCancel">
                                            <img alt="example" style="width: 100%" :src="previewImage" />
                                        </a-modal>
                                    </a-form-item>
                                    <a-form-item name="isPrivate" label="可见范围">
                                        <a-radio-group v-model:value="formDataBook.isPrivate"
                                            @change="ShowShareViewPoint">
                                            <a-radio :value="0">私有</a-radio>
                                            <a-radio :value="1">公有</a-radio>
                                        </a-radio-group>
                                    </a-form-item>
                                    <a-form-item name="shareViewPoint" label="分享寄语" v-if="visibleShareViewPoint">
                                        <a-textarea :autosize="{ minRows: 3, maxRows: 6 }"
                                            v-model:value="formDataBook.shareViewPoint" show-count :maxlength="100" />
                                    </a-form-item>

                                </a-form>
                            </a-spin>
                        </a-modal>
                        <a-col :span="18">
                            <a-input-search size="large" v-model:value="inputValue" placeholder="输入标签或者书名" enter-button
                                @search="onSearch" />
                        </a-col>
                    </a-row>
                    <a-typography-title :level="4" style="margin: 20px 0px;">我的书籍</a-typography-title>
                    <div class="book-list">
                        <div class="book-item" v-for="(item, index) in booksData">
                            <div class="item-img" @click="routerBookItem(item._id)">
                                <img :src="item.bookImg" style="width:100px; height: 120px;">
                            </div>
                            <div class="item-text">
                                <div style="font-size: 14px; cursor: pointer;" @click="routerBookItem(item._id)">
                                    {{ item.bookName }}
                                </div>
                                <div style="margin-top: 5px;">
                                    <a-tag v-if="item.isPrivate == 0">私有性</a-tag>
                                    <a-tag v-else-if="item.isPrivate == 1">公有性</a-tag>
                                    <a-tag v-else>监控中</a-tag>
                                </div>
                            </div>
                            <div class="item-operation" style="margin-left: 10px;">
                                <a-popconfirm title="您确定删除吗" ok-text="确定" cancel-text="取消"
                                    @confirm="confirmDeleteBook(item._id)" @cancel="cancel">
                                    <close-outlined style="color: rgb(255, 77, 79);" />
                                </a-popconfirm>

                            </div>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script setup>
import { UploadOutlined, PlusOutlined, CloseOutlined, StarOutlined } from '@ant-design/icons-vue';
import { FindAllBookAPI, SearchByTagAPI, SearchByTagAndNameAPI, DeleteBookAPI } from '../../../api/clientApi.js'
import { ref, reactive, nextTick, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { AddBookAPI } from '../../../api/clientApi';
import { useclientStore } from '../../../stores/count.js'

const counter = useclientStore()
const router = useRouter()
onMounted(() => {
    fecthbook({ userId: counter.clientlogin.id })
})
const routerBookItem = (_id) => {
    router.push({ name: 'bookitem', params: { _id } })
}

const showDelete = ref(1)
//总书籍数据
const booksData = ref([])
//总标签
const booksTag = ref([])
//查询用户全部书籍信息
const fecthbook = (query) => {
    FindAllBookAPI(query).then(res => {
        if (res.code == 0) {
            booksData.value = [...res.data]
            let tagArr = []
            res.data.forEach(item => {
                item.bookTag.forEach(el => {
                    if (!tagArr.includes(el)) {
                        tagArr.push(el)
                    }
                })
            })
            booksTag.value = [...tagArr]
        }
    })
}


//#region 上传书籍
const formDataBook = reactive({
    file: '',
    bookName: '',
    bookDescription: '',
    bookImg: '',
    isPrivate: 0,
    shareViewPoint: ''
})
const visibleUpDownBook = ref(false)

const inputRef = ref();
const state = reactive({
    tags: [],
    inputVisible: false,
    inputValue: '',
});
const handleClose = removedTag => {
    const tags = state.tags.filter(tag => tag !== removedTag);
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
    Object.assign(state, {
        tags,
        inputVisible: false,
        inputValue: '',
    });
};

const visibleShareViewPoint = ref(false)
const ShowShareViewPoint = () => {
    if (formDataBook.isPrivate == 1) {
        visibleShareViewPoint.value = true
    } else {
        visibleShareViewPoint.value = false
    }
}
//#endregion

//#region 上传图片和文件
const visibleAddPicture = ref(false)
//图片上传的临时存放
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
const fileList = ref([])
const fileList1 = ref([])

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

//图片自定义请求方式
const customUpload = async (fileinfo) => {
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
    } catch (error) {
        message.error(error.message)
        console.log(error)
    }
}
//PDF文件自定义请求方式
const customUpload1 = async (fileinfo) => {
    let { file } = fileinfo
    console.log(file);
    try {
        const url = await fileToBase64(file)
        fileList1.value.forEach(item => {
            if (file.uid == item.uid) {
                item.url = url
                item.status = 'done'
            }
        })

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

//图片上传前进行拦截器的判断
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
//文件上传前进行拦截器的判断
const beforeUpload1 = file => {
    console.log("上传前的拦截");
    console.log(file);

    const { type, size, name } = file;
    formDataBook.bookName = name.slice(0, -3)
    const limitType = type === 'application/pdf';
    if (!limitType) {
        message.error('请上传PDF的文件');
    }
    const limitSize = size / 1024 / 1024 < 100;
    if (!limitSize) {
        message.error('文件不可大于 100MB!');
    }
    return limitType && limitSize;
}

//将文件转换为二进制来传递
const formDataFun = (item) => {
    let formData = new FormData()
    item.forEach((item, index) => {
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
        if (item.type === 'image/jpeg' || item.type === 'image/png') {
            formData.append('file', blob, `images${index + 1}.jpg`)
            return
        }
        if (item.type === 'application/pdf') {
            formData.append('file', blob, `application${index + 1}.pdf`)
            return
        }

    })
    return formData
}

const spinning = ref(false)
const handleOkAddBook = () => {
    let newFileList = [...fileList1.value, ...fileList.value]
    let formData = formDataFun(newFileList)
    formData.set('bookName', formDataBook.bookName)
    formData.set('bookDescription', formDataBook.bookDescription)
    formData.set('bookTag', state.tags)
    formData.set('userId', counter.clientlogin.id)
    formData.set('isPrivate', formDataBook.isPrivate)
    formData.set('shareViewPoint', formDataBook.shareViewPoint)
    spinning.value = true
    AddBookAPI(formData).then(res => {
        if (res.code == 0) {
            spinning.value = false
            message.success('增加成功')
            visibleUpDownBook.value = false
            fecthbook({ userId: counter.clientlogin.id })
            formDataBook.bookName = '';
            formDataBook.bookDescription = '';
            formDataBook.isPrivate = 0;
            formDataBook.shareViewPoint = ''
            state.tags = []
            fileList.value = []
            fileList1.value = []
        }
    })

}
//#endregion

//删除书籍
const confirmDeleteBook = (_id) => {
    DeleteBookAPI({ _id, userId: counter.clientlogin.id }).then(res => {
        if (res.code == 0) {
            message.success('删除成功')
            fecthbook({ userId: counter.clientlogin.id })
        }
    })
}

//点击标签查询
const SearchByTag = (bookTag, index) => {
    notebookColor.value = index
    SearchByTagAPI({ userId: counter.clientlogin.id, bookTag }).then(res => {
        if (res.code == 0) {
            booksData.value = [...res.data]
        }
    })
}

//点击搜索
const inputValue = ref()
const onSearch = () => {
    SearchByTagAndNameAPI({ userId: counter.clientlogin.id, inputValue: inputValue.value }).then(res => {
        if (res.code == 0) {
            booksData.value = [...res.data]
        }
    })
}

watch(inputValue, (newValue, oldValue) => {
    if (oldValue && !newValue) {
        fecthbook({ userId: counter.clientlogin.id })
    }
})

const notebookColor = ref()
const showAllBook = () => {
    notebookColor.value = -1
    fecthbook({ userId: counter.clientlogin.id })
}

</script>

<style scoped>
.book-list {
    display: flex;
    margin-top: 20px;
    flex-wrap: wrap;
}

.book-item {
    display: flex;
    width: 280px;
    height: 120px;
    margin-left: 10px;
    margin-top: 10px;
    overflow: hidden;
}

.item-img {
    width: 100px;
    height: 120px;
    cursor: pointer;

}

.item-text {
    width: 140px;
    margin-left: 10px;
}

.books {
    width: 84%;
    margin: 0px auto;
    border-top: 1px solid rgb(208, 215, 222);
}

.book-tag {
    list-style: none;
    padding: 0px;

}

.book-tag li {
    height: 35px;
    text-align: center;
    cursor: pointer;
    line-height: 40px;
}

.book-tag li:hover {
    background-color: rgb(230, 247, 255);
}
</style>