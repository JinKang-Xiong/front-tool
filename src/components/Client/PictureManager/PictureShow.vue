<template>
    <div class="picture-content-show">
        <div class="picture-title-show">
            <a-divider style="">
                <a-typography-title :level="3">{{ !pictureStore ? '' : pictureStore.storeName }}<span
                        style="cursor: pointer;" @click="EditStoreModal"><edit-outlined /></span></a-typography-title>
            </a-divider>
            <a-modal v-model:visible="visibleEditStorePicture" title="新建图库" @ok="handleOkEditStorePicture" okText="确定"
                cancelText="取消">
                <p>图库名称</p>
                <a-input v-model:value="EditStoreName" placeholder="如：动漫图库" />
                <p>图库简介</p>
                <a-textarea v-model:value="EditStoreDescription" placeholder="如：关于首页轮播的动漫网站元素" :rows="3" />
            </a-modal>
        </div>
        <a-row>
            <a-col :span="2" offset="1">
                <a-button type="text" @click="backPictureShow"><left-outlined />返回</a-button>
            </a-col>
            <a-col :span="6" offset="14" style="text-align: center;">
                <a-space :size="16">
                    <a-button type="" @click="showDrawerUpload">上传图片</a-button>
                    <a-popconfirm title="确定删除吗，图库的图片也将全部删除喔！！！" ok-text="确定" cancel-text="取消" @confirm="DeleteStorePicture"
                        @cancel="cancel">
                        <template #icon><question-circle-outlined style="color: red" /></template>
                        <a-button type="" danger>删除图库</a-button>
                    </a-popconfirm>

                    <span>总共{{ !pictureList ? 0 : pictureList.length }}个结果</span>
                </a-space>

            </a-col>

            <a-drawer :height="450" title="图片上传" placement="top" :closable="false" :visible="visibleUpload"
                @close="onClose">
                <div class="upload-dragger">
                    <a-upload-dragger v-model:fileList="fileList" name="file" :multiple="true" :before-upload="beforeUpload"
                        :customRequest="customUpload" action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        @change="handleChange" @drop="handleDrop" list-type="picture-card" @preview="handlePreview">
                        <p class="ant-upload-drag-icon">
                            <inbox-outlined></inbox-outlined>
                        </p>
                        <p class="ant-upload-text">Click or drag file to this area to upload</p>
                        <p class="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                            band files
                        </p>
                    </a-upload-dragger>

                    <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
                        <img alt="example" style="width: 100%" :src="previewImage" />
                    </a-modal>
                </div>
                <div style="width: 70%; margin: 20px auto;">
                    <a-progress :percent="uploadProcess" :show-info="false" />
                </div>
                <a-row>
                    <a-col :span="1" offset="11">
                        <a-button type="primary" @click="AddPicture">上传</a-button>
                    </a-col>
                    <a-col :span="1" style="margin-left: 15px;">
                        <a-button type="" @click="HidderDrawer">取消</a-button>
                    </a-col>
                </a-row>
            </a-drawer>

        </a-row>
        <div class="picture-store-list-show" @scroll="">
            <div class="picture-store-item" v-for="(item, index) in pictureList">
                <a-card hoverable style="width: 300px;" :key="index">
                    <template #cover>

                        <a-skeleton :loading="loadingImg" :active="true" avatar>
                            <a-image :width="300" :src="item.pictureUrl" :placeholder="true" />

                        </a-skeleton>


                    </template>

                    <template #actions>
                        <copy-outlined key="copy" @click="CopyPictureLink(item.pictureUrl)" />
                        <download-outlined key="downup" @click="downloadPicture(item.pictureUrl, item.pictureName)" />
                        <a-popover trigger="hover">
                            <template #content>
                                <a-row>
                                    <a-col :span="20">
                                        <a-button type="text" @click="showMovePictureModal">移动</a-button>
                                    </a-col>
                                    <a-modal v-model:visible="visiblePicture" title="移动图片"
                                        @ok="handleOkMovePicture(item.pictureuuid)" okText="确定" cancelText="取消">
                                        <a-row>
                                            <a-col :span="20">
                                                图片库：
                                                <a-select ref="select" v-model:value="NewStorePicture" style="width: 320px"
                                                    @focus="focus" @change="handleChange">
                                                    <a-select-option :value="item._id"
                                                        v-for="(item, index) in userStorePicture">{{ item.storeName
                                                        }}</a-select-option>

                                                </a-select>
                                            </a-col>
                                        </a-row>

                                    </a-modal>
                                </a-row>
                                <a-row>
                                    <a-col :span="20">
                                        <a-popconfirm title="确定删除吗" ok-text="确定" cancel-text="取消"
                                            @confirm="DeletePicture(item.pictureuuid)" @cancel="cancel">
                                            <a-button type="text" danger>删除</a-button>
                                        </a-popconfirm>

                                    </a-col>
                                </a-row>
                            </template>
                            <ellipsis-outlined key="ellipsis" />
                        </a-popover>

                    </template>
                </a-card>
            </div>

        </div>
    </div>
</template>

<script setup>
import { PlusOutlined, PictureOutlined, EditOutlined, CopyOutlined, EllipsisOutlined, DownloadOutlined, QuestionCircleOutlined, LeftOutlined, InboxOutlined } from '@ant-design/icons-vue';
import { ref, defineProps, onMounted } from 'vue'
import { message } from 'ant-design-vue';
import { UploadFileAPI, FindAllPictureAPI, DownPictureAPI, FindPictureCountAPI, MovePicture, UpdateStorePictureAPI, DeleteStorePictureAPI, DeletePictureAPI, FindAllStorePictureAPI } from '../../../api/clientApi.js'
import { useRouter } from 'vue-router';
import { useclientStore } from '../../../stores/count.js'

const counter = useclientStore()
const visibleUpload = ref(false)
const router = useRouter()
const prop = defineProps(['_id'])
const limtDataIndex = ref(10)
const loadingImg = ref(true)
const restartPicture = ref(false)
onMounted(() => {
    fethPicture({ _id: prop._id, userId: counter.clientlogin.id, limtDataIndex: 0, countData: 10 })

    window.addEventListener('scroll', handleScroll);
})
const b = ref()

const pictureList = ref([])
const pictureStore = ref()
const pictureListCount = ref(0)
const fethCount = (query) => {
    FindPictureCountAPI({ _id: pictureStore.value._id, userId: counter.clientlogin.id }).then(res => {
        if (res.code == 0) {
            pictureListCount.value = res.data[0].arrayLength
        }
    })
}
const fethPicture = (query) => {
    FindAllPictureAPI(query).then(res => {
        if (res.code == 0) {
            console.log("图片库的值");
            console.log(res.data);

            pictureStore.value = res.data[0]
            if (res.data[0].pictureList.length == 0) {
                pictureList.value = []
                return
            }
            if (!restartPicture.value) {
                pictureList.value = [...pictureList.value, ...res.data[0].pictureList]
            } else {
                pictureList.value = [...res.data[0].pictureList]
                restartPicture.value = false
            }
            loadingImg.value = false
            fethCount()
        }
    })
}
const showDrawerUpload = () => {
    visibleUpload.value = true
}
const onClose = () => {
    visibleUpload.value = false;
};
const backPictureShow = () => {
    router.push({ name: 'picture' })
}

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
//#endregion

//增加图片
const uploadProcess = ref()
const HidderDrawer = () => {
    visibleUpload.value = false
}
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
const AddPicture = () => {
    let formData = formDataFun()
    formData.set('_id', prop._id)
    console.log(formData);
    UploadFileAPI(formData).then(res => {
        console.log(res);
        if (res.code == 0) {
            fileList.value = []
            restartPicture.value = true
            limtDataIndex.value = 10
            fethPicture({ _id: prop._id, userId: counter.clientlogin.id, limtDataIndex: 0, countData: 10 })
            visibleUpload.value = false

        }
    })
}

//修改图库
const visibleEditStorePicture = ref(false)
const EditStoreName = ref()
const EditStoreDescription = ref()
const EditStoreModal = () => {
    visibleEditStorePicture.value = true
    EditStoreName.value = pictureStore.value.storeName
    EditStoreDescription.value = pictureStore.value.storeDescription
}
const handleOkEditStorePicture = () => {
    UpdateStorePictureAPI({
        _id: pictureStore.value._id,
        storeName: EditStoreName.value,
        storeDescription: EditStoreDescription.value
    }).then(res => {
        if (res.code == 0) {
            message.success('修改成功')
            visibleEditStorePicture.value = false
            restartPicture.value = true
            limtDataIndex.value = 10
            fethPicture({ _id: prop._id, userId: counter.clientlogin.id, limtDataIndex: 0, countData: 10 })
        }
    })
}

//删除图库
const DeleteStorePicture = () => {
    DeleteStorePictureAPI({ _id: pictureStore.value._id }).then(res => {
        if (res.code == 0) {
            message.success("删除成功")
            router.push({ name: 'picture' })
        }
    })
}

//复制图片链接
const CopyPictureLink = (url) => {
    navigator.clipboard.writeText(url).then(() => {
        message.success("复制成功")
    }).catch(err => {
        message.error("复制失败")
    })
}

//删除图片
const DeletePicture = (pictureuuid) => {
    DeletePictureAPI({ _id: pictureStore.value._id, pictureuuid }).then(res => {
        if (res.code == 0) {
            message.success('删除成功')
            restartPicture.value = true
            limtDataIndex.value = 10
            fethPicture({ _id: prop._id, userId: counter.clientlogin.id, limtDataIndex: 0, countData: 10 })
        }
    })
}

//移动图片
const userStorePicture = ref([])
const visiblePicture = ref()
const NewStorePicture = ref()
const showMovePictureModal = () => {
    FindAllStorePictureAPI({ userId: counter.clientlogin.id }).then(res => {
        if (res.code == 0) {
            res.data.forEach(item => {
                if (item._id != pictureStore.value._id) {
                    let obj = { _id: item._id, storeName: item.storeName }
                    userStorePicture.value.push(obj)
                }

            })
            visiblePicture.value = true
            console.log(userStorePicture.value);


        }
    })

}
const handleOkMovePicture = (pictureuuid) => {
    MovePicture({ oldid: pictureStore.value._id, newid: NewStorePicture.value, pictureuuid }).then(res => {
        if (res.code == 0) {
            visiblePicture.value = false
            message.success("图片移动成功")
            restartPicture.value = true
            limtDataIndex.value = 10
            fethPicture({ _id: prop._id, userId: counter.clientlogin.id, limtDataIndex: 0, countData: 10 })


        }
    })
}

//捕获滚动事件
function handleScroll(event) {
    console.log('执行滚动函数');

    const scrollPosition = window.scrollY;

    // 获取整个文档的高度，包括滚动不可见部分
    const documentHeight = document.documentElement.scrollHeight;

    // 获取视口（可见部分）的高度
    const viewportHeight = window.innerHeight;

    // 计算用户已滚动的距离
    // scrollData.scrolledDistance = scrollPosition;

    // 计算视口底部距离文档底部的距离
    b.value = documentHeight - (scrollPosition + viewportHeight);

    if (b.value < 225) {
        console.log("到底啦")

        if (pictureListCount.value - limtDataIndex.value >= 10) {

            fethPicture({ _id: prop._id, userId: counter.clientlogin.id, limtDataIndex: limtDataIndex.value, countData: 10 })
            limtDataIndex.value = limtDataIndex.value + 10
            return
        }
        if (pictureListCount.value - limtDataIndex.value < 10 && pictureListCount.value - limtDataIndex.value > 0) {

            let remainIndex = parseInt(pictureListCount.value / 10)
            let remainCount = pictureListCount.value % 10

            fethPicture({ _id: prop._id, userId: counter.clientlogin.id, limtDataIndex: remainIndex * 10, countData: remainCount })
            limtDataIndex.value = limtDataIndex.value + 10
            return
        }
    }

    // 判断是否滚动到了容器底部

    // 执行加载更多图片的操作



}

//图片下载、
const downloadPicture = (url, pictureName) => {
    DownPictureAPI(url).then(res => {
        console.log(res);

        let newUrl = window.URL.createObjectURL(res)
        let link = document.createElement("a");
        link.target = "_blank";
        link.href = newUrl
        link.download = pictureName;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        link = null;
        window.URL.revokeObjectURL(newUrl)
    })
}

</script>

<style scoped>
.upload-dragger {
    width: 70%;
    margin: 10px auto;
}

.picture-title-show {
    width: 100%;
    height: 60px;
    text-align: center;
    line-height: 60px;
}

/* .picture-store-list {
    display: flex;
    flex-wrap: wrap;
    width: 1400px;
    margin: 20px auto;
    border-top: 1px solid grey;
} */

.picture-store-list-show {
    width: 1400px;
    border-top: 1px solid rgb(208, 215, 222);
    margin: 20px auto;
    column-count: 4;
    column-gap: 20px;
    padding: 10px;
    overflow-y: auto;
}

.picture-store-item {
    break-inside: avoid;
    padding-top: 10px;
}
</style>