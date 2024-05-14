<template>
    <div class="myhome-content">
        <div class="home-left">
            <!-- <a-typography-title :level="4">常用仓库</a-typography-title> -->
            <div class="left-code">
                <a-typography-title :level="5">代码片段库</a-typography-title>
                <ul>
                    <li class="show-delete" v-for="item in fastState.codearr" v-if="fastState">
                        <a-space :size="15">
                            <span @click="RouterCode(item.storeId)">{{ item.storeName }}</span>
                            <a-popconfirm title="确定删除吗" ok-text="Yes" cancel-text="No" @confirm="confirmFastCode(item)"
                                @cancel="cancel">
                                <span class="span1" style="color: red"><close-outlined /></span>
                            </a-popconfirm>
                        </a-space>

                    </li>
                </ul>
            </div>
            <div class="left-center">
                <a-typography-title :level="5">笔记库</a-typography-title>
                <ul>
                    <li class="show-delete" v-for="item in fastState.notebookarr" v-if="fastState">
                        <a-space :size="15">
                            <span @click="RouterNoteBook(item.storeId)">{{ item.storeName }}</span>
                            <a-popconfirm title="确定删除吗" ok-text="Yes" cancel-text="No" @confirm="confirmFastNoteBook(item)"
                                @cancel="cancel">
                                <span class="span1" style="color: red;"><close-outlined /></span>
                            </a-popconfirm>
                        </a-space>

                    </li>
                </ul>
            </div>
            <div class="left-right">
                <a-typography-title :level="5">书籍库</a-typography-title>
                <ul>
                    <li class="show-delete" v-for="item in fastState.bookarr" v-if="fastState">
                        <a-space :size="15">
                            <span @click="RouterBook(item.storeId)">{{ item.storeName }}</span>
                            <a-popconfirm title="确定删除吗" ok-text="Yes" cancel-text="No" @confirm="confirmFastBook(item)"
                                @cancel="cancel">
                                <span class="span1" style="color: red;"><close-outlined /></span>
                            </a-popconfirm>
                        </a-space>

                    </li>
                </ul>
            </div>
            <a-row style="margin-top: 20px;">
                <a-col :span="8">
                    <a-button type="primary" @click="showFastOpenModal">添加常用仓库</a-button>
                </a-col>
                <a-modal v-model:visible="visibleFastOpen" okText="确定" cancelText="取消" title="我的仓库" @cancel="CancelFastOpen"
                    @ok="handleOkFastOpen">
                    <p>代码库</p>
                    <a-checkbox-group v-model:value="codevalue" style="width: 100%">
                        <a-row v-for="item in codearr">
                            <a-checkbox :value="item.mask + item.storeId">{{ item.storeName }}</a-checkbox>
                        </a-row>
                    </a-checkbox-group>
                    <p>笔记库</p>
                    <a-checkbox-group v-model:value="notebookvalue" style="width: 100%">
                        <a-row v-for="item in notebookarr">
                            <a-checkbox :value="item.mask + item.storeId">{{ item.storeName }}</a-checkbox>
                        </a-row>
                    </a-checkbox-group>
                    <p>书籍库</p>
                    <a-checkbox-group v-model:value="bookvalue" style="width: 100%">
                        <a-row v-for="item in bookarr">
                            <a-checkbox :value="item.mask + item.storeId">{{ item.storeName }}</a-checkbox>
                        </a-row>
                    </a-checkbox-group>
                </a-modal>
            </a-row>
        </div>
        <div class="home-center">
            <a-row>
                <a-col :span="8">
                    <a-statistic title="公共资源数" :value="resourcePublic"
                        style="margin-right: 50px;background-color: white;" />
                </a-col>
                <a-col :span="8">
                    <a-statistic title="私有资源数" :value="resourcePrivate"
                        style="margin-right: 50px;background-color: white;" />
                </a-col>
                <a-col :span="8">
                    <a-statistic title="未归档小灵" :value="unfinshmemo" style="margin-right: 50px;background-color: white;">
                        <template #suffix>
                            <span>/ {{ memoTotal }}</span>
                        </template>
                    </a-statistic>
                </a-col>
            </a-row>
            <div id="create-analyse">

            </div>
        </div>
        <div class="home-right">
            <div class="right-content">
                <div class="public-book">
                    <a-typography-title :level="5">热门书籍资源</a-typography-title>
                    <a-row>
                        <a-col :span="7" offset="1" v-for="(item, index) in  hotpublicbook ">
                            <div class="book-content">
                                <div class="book-img">
                                    <img :src="item.bookImg">
                                </div>
                                <div class="book-title">
                                    <a-tooltip>
                                        <template #title>{{ item.bookName }}</template>
                                        <a @click="RouterHotBook(item._id)">{{ item.bookName.slice(0, 25) }}...</a>
                                    </a-tooltip>
                                </div>
                            </div>
                        </a-col>
                    </a-row>
                </div>
                <div class="public-code">
                    <a-typography-title :level="5">热门代码片段</a-typography-title>

                    <a-list item-layout="vertical" size="large" :data-source="hotpubliccode">
                        <template #renderItem="{ item }">
                            <a-list-item key="item.title" style="margin-top: 20px; border: 1px solid rgb(208, 215, 222);">

                                <template #actions>
                                    <a-space :size="25">
                                        <span type="text"><star-outlined style="margin-right: 8px;" />{{
                                            item.codeList.collectNumber }}</span>
                                        <span type="text"><like-outlined style="margin-right: 8px;" />{{
                                            item.codeList.likeNumber }}</span>
                                    </a-space>

                                    <span>
                                        <field-time-outlined style="margin-right: 8px;" />{{ item.codeList.codeCreateTime }}
                                    </span>
                                    <a-space>
                                        <a-tag v-for="( el, index ) in  item.codeList.codeTag.slice(0, 2) " color="blue">{{
                                            el
                                        }}</a-tag>
                                    </a-space>
                                </template>
                                <a-list-item-meta>
                                    <template #title>
                                        <a @click="RouterHotCode(item._id, item.codeList.codeuuid)">{{
                                            item.codeList.codeTitle }}</a>
                                    </template>
                                    <template #description>
                                        <span>{{ item.codeList.codeDescription }}</span>
                                    </template>
                                </a-list-item-meta>

                            </a-list-item>
                        </template>
                    </a-list>
                </div>
                <div class="public-note">
                    <a-typography-title :level="5">热门笔记资源</a-typography-title>
                    <a-list item-layout="vertical" size="large" :data-source="hotpublicnote">
                        <template #renderItem="{ item }">
                            <a-list-item key="item.title" style="margin-top: 20px; border: 1px solid rgb(208, 215, 222);">
                                <template #actions>
                                    <a-space :size="25">
                                        <span type="text"><star-outlined style="margin-right: 8px;" />{{ item.collectNumber
                                        }}</span>
                                        <span type="text"><like-outlined style="margin-right: 8px;" />{{ item.likeNumber
                                        }}</span> </a-space>
                                    <span>
                                        <field-time-outlined style="margin-right: 8px;" />{{ item.createTime }}
                                    </span>
                                    <a-space>
                                        <a-tag v-for="( el, index ) in  item.noteTag.slice(0, 2) " color="blue">{{ el
                                        }}</a-tag>
                                    </a-space>
                                </template>
                                <a-list-item-meta>
                                    <template #title>
                                        <a @click="RouterHotNote(item._id)">{{ item.noteName }}</a>
                                    </template>
                                </a-list-item-meta>
                            </a-list-item>
                        </template>

                    </a-list>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue';
import { StarOutlined, LikeOutlined, ExclamationCircleOutlined, CloseOutlined, FieldTimeOutlined } from '@ant-design/icons-vue';
import { DeleteFastOpenAPI, CountMemoAPI, CountCreateTotalByMonthConAPI, CountPrivateTotalByUserConAPI, FindHotPublicNote, FindHotPublicCode, FindHotPublicBook, FindAllStoreAPI, AddFastOpenAPI, FindAllNoteBookAPI, FindAllBookAPI, FindFastOpenByUserAPI } from '../../../api/clientApi.js'
import { useclientStore } from '../../../stores/count.js'
import * as echarts from 'echarts';
import { useRouter } from 'vue-router';

const counter = useclientStore()
const router = useRouter()
onMounted(() => {
    fetchfast({ userId: counter.clientlogin.id })
    fetchhotbook()
    fetchhotcode()
    fetchhotnote()
    fetchresource({ userId: counter.clientlogin.id })
    fetchmemo({ userId: counter.clientlogin.id })
    initCharts({ userId: counter.clientlogin.id, year: 2023 })
})

//#region 快捷仓库
const codevalue = ref([])
const notebookvalue = ref([])
const bookvalue = ref([])
const fastState = ref([])
const fetchfast = (query) => {
    FindFastOpenByUserAPI(query).then(res => {
        if (res.code == 0) {
            fastState.value = res.data
        }
    })
}

//获取用户代码库
const codearr = ref([])
const fetchcode = (query) => {
    FindAllStoreAPI(query).then(res => {
        if (res.code == 0) {
            res.data.forEach(item => {
                let shouldSkip1 = false;
                if (fastState.value) {
                    fastState.value.codearr.forEach(el => {
                        if (el.storeId == item._id) {
                            console.log('应该移出')
                            shouldSkip1 = true
                            return
                        }
                    })
                }
                if (shouldSkip1) {
                    return; // 跳出外层循环
                }
                codearr.value.push({ mask: 0, storeName: item.storeName, storeId: item._id })
            })
        }
    })
}

//获取用户笔记库
const notebookarr = ref([])
const fetchnotebook = (query) => {
    FindAllNoteBookAPI(query).then(res => {
        if (res.code == 0) {
            res.data.forEach(item => {
                let shouldSkip2 = false;
                if (fastState.value) {
                    fastState.value.notebookarr.forEach(el => {
                        if (el.storeId == item._id) {
                            console.log('应该移出')
                            shouldSkip2 = true
                            return
                        }
                    })
                }
                if (shouldSkip2) {
                    return; // 跳出外层循环
                }
                notebookarr.value.push({ mask: 1, storeName: item.notebookName, storeId: item._id })
            })
        }
    })
}

//获取用户书籍库
const bookarr = ref([])
const fetchbook = (query) => {
    FindAllBookAPI(query).then(res => {
        if (res.code == 0) {
            res.data.forEach(item => {
                let shouldSkip3 = false;
                if (fastState.value) {
                    fastState.value.bookarr.forEach(el => {
                        if (el.storeId == item._id) {
                            console.log('应该移出')
                            shouldSkip3 = true
                            return
                        }
                    })
                }
                if (shouldSkip3) {
                    return; // 跳出外层循环
                }
                bookarr.value.push({ mask: 2, storeName: item.bookName, storeId: item._id })
            })
        }
    })
}

const visibleFastOpen = ref(false)
const showFastOpenModal = () => {
    fetchbook({ userId: counter.clientlogin.id })
    fetchcode({ userId: counter.clientlogin.id })
    fetchnotebook({ userId: counter.clientlogin.id, isDefault: 0 })
    visibleFastOpen.value = true
    codevalue.value = []
    notebookvalue.value = []
    bookvalue.value = []

}

const CancelFastOpen = () => {
    codearr.value = []
    notebookarr.value = []
    bookarr.value = []
}

const handleOkFastOpen = () => {
    let store = []
    if (codevalue.value.length > 0) {
        codevalue.value.forEach(item => {
            store.push({ mark: Number(item.slice(0, 1)), storeId: item.slice(1) })
        })
    }
    if (notebookvalue.value.length > 0) {
        notebookvalue.value.forEach(item => {
            store.push({ mark: Number(item.slice(0, 1)), storeId: item.slice(1) })
        })
    }
    if (bookvalue.value.length > 0) {
        bookvalue.value.forEach(item => {
            store.push({ mark: Number(item.slice(0, 1)), storeId: item.slice(1) })
        })
    }
    if (!fastState.value) {
        console.log(store)
        AddFastOpenAPI({ _id: '', store, userId: counter.clientlogin.id }).then(res => {
            if (res.code == 0) {
                message.success('添加成功')
                fetchfast({ userId: counter.clientlogin.id })
                codearr.value = []
                notebookarr.value = []
                bookarr.value = []
                visibleFastOpen.value = false
            }
        })

    } else {
        AddFastOpenAPI({ _id: fastState.value._id, store, userId: counter.clientlogin.id }).then(res => {
            if (res.code == 0) {
                message.success('添加成功')
                fetchfast({ userId: counter.clientlogin.id })
                codearr.value = []
                notebookarr.value = []
                bookarr.value = []
                visibleFastOpen.value = false
            }
        })
    }
}

//路由跳转
const RouterCode = (_id) => {
    router.push({ name: 'codeshow', params: { _id: _id } });
}

const RouterNoteBook = (_id) => {
    router.push({ name: 'notebookitemshow', params: { _id } })
}

const RouterBook = (_id) => {
    router.push({ name: 'bookitem', params: { _id } })
}
const confirmFastCode = (item) => {
    DeleteFastOpenAPI({ _id: fastState.value._id, mark: 0, storeId: item.storeId })
    fetchfast({ userId: counter.clientlogin.id })
}
const confirmFastNoteBook = (item) => {
    DeleteFastOpenAPI({ _id: fastState.value._id, mark: 1, storeId: item.storeId })
    fetchfast({ userId: counter.clientlogin.id })
}
const confirmFastBook = (item) => {
    DeleteFastOpenAPI({ _id: fastState.value._id, mark: 2, storeId: item.storeId })
    fetchfast({ userId: counter.clientlogin.id })
}
//#endregion


//#region 公共库资源推荐
const hotpublicbook = ref([])
const fetchhotbook = () => {
    FindHotPublicBook().then(res => {
        if (res.code == 0) {
            hotpublicbook.value = [...res.data]
        }
    })
}

const hotpubliccode = ref([])
const fetchhotcode = () => {
    FindHotPublicCode().then(res => {
        if (res.code == 0) {
            res.data.forEach(item => {
                let data = new Date(item.codeList.codeCreateTime)
                item.codeList.codeCreateTime = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate()
            })
            hotpubliccode.value = [...res.data]
        }
    })
}

const hotpublicnote = ref([])
const fetchhotnote = () => {
    FindHotPublicNote().then(res => {
        if (res.code == 0) {
            res.data.forEach(item => {
                let data = new Date(item.createTime)
                item.createTime = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate()
            })
            hotpublicnote.value = [...res.data]
        }
    })
}

const RouterHotBook = (_id) => {
    router.push({ name: 'searchresultbook', params: { _id } })
}

const RouterHotCode = (_id, codeuuid) => {
    router.push({ name: 'searchresult', params: { _id, codeuuid } })
}

const RouterHotNote = (_id) => {
    router.push({ name: 'searchresultnote', params: { _id } })
}

//#endregion


//#region 统计个人情况
const resourcePrivate = ref(0)
const resourcePublic = ref(0)
const fetchresource = (query) => {
    CountPrivateTotalByUserConAPI(query).then(res => {
        if (res.code == 0) {
            resourcePrivate.value = res.data.privateTotal
            resourcePublic.value = res.data.publicTotal
        }
    })
}

const memoTotal = ref(0)
const unfinshmemo = ref(0)
const fetchmemo = (query) => {
    CountMemoAPI(query).then(res => {
        if (res.code == 0) {
            memoTotal.value = res.data.memototal
            unfinshmemo.value = res.data.unfinished
        }
    })
}

const initCharts = (query) => {
    var myChart = echarts.init(document.getElementById('create-analyse'));
    myChart.resize({
        width: 640,
    });
    myChart.setOption({
        title: {
            text: '我的资源数'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['代码片段库', '图库', '笔记库', '书籍库']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
            type: 'value'
        },
    })
    CountCreateTotalByMonthConAPI(query).then(res => {
        let codeanlyarr = []
        let pictureanlyarr = []
        let noteanlyarr = []
        let bookanlyarr = []
        if (res.code == 0) {
            res.data.forEach(item => {
                codeanlyarr.push(item.codeCount)
                pictureanlyarr.push(item.pictureCount)
                noteanlyarr.push(item.noteCount)
                bookanlyarr.push(item.bookCount)
            })
        }
        myChart.setOption({
            series: [
                {
                    name: '代码片段库',
                    type: 'line',
                    stack: 'Total',
                    data: codeanlyarr
                },
                {
                    name: '图库',
                    type: 'line',
                    stack: 'Total',
                    data: pictureanlyarr
                },
                {
                    name: '笔记库',
                    type: 'line',
                    stack: 'Total',
                    data: noteanlyarr
                },
                {
                    name: '书籍库',
                    type: 'line',
                    stack: 'Total',
                    data: bookanlyarr
                },
            ]
        })

    })
}

//#endregion

</script>
<style scoped>
#create-analyse {
    width: 100%;
    height: 500px;
    margin-top: 30px;
}

.home-center {
    padding: 5px 10px;
}

.right-content {
    overflow-y: auto;
    height: 640px;
}

.right-content::-webkit-scrollbar {
    width: 8px;
    /* 纵向滚动条宽度 */
    height: 8px;
    /* 横向滚动条高度 */
    background-color: white;
    /* 滚动条整体背景，一般被覆盖着 */
}

/* 滚动条里面的滑块 */
.right-content::-webkit-scrollbar-thumb {
    border-radius: 10px;
    /* 滚动条滑块阴影 */
    background-color: rgba(216, 218, 217);
    /* 滚动条滑块颜色 */
}

/* 滚动条的轨道（里面装有Thumb） */
.right-content::-webkit-scrollbar-track {
    /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
    /* 滚动条轨道阴影 */
    border-radius: 10px;
    /* 滚动条轨道圆角 */
    background-color: white;
    /* 滚动条轨道背景 */
}

.public-note {
    margin-top: 20px;
}

.public-code {
    margin-top: 20px;
}

.home-center {
    width: 50%;
}

.public-book {
    height: 240px;
    margin-top: 10px;
}

.book-content {
    height: 200px;
    width: 120px;
}

.book-content .book-img {
    height: 130px;
}

.book-img img {
    height: 120px;
    width: 120px;
}

.home-right {
    width: 30%;
    background-color: white;
    border: 1px solid rgb(208, 215, 222);
    padding: 10px;
}

.myhome-content {
    margin: 10px auto;
    height: 640px;
    display: flex;
    background-color: rgb(246, 248, 250);
}

.home-left {
    width: 20%;
    background-color: white;
    border: 1px solid rgb(208, 215, 222);
    padding: 10px;
}

.home-left ul {
    list-style: none;
    padding: 0px;
    margin: 0px;
}

.home-left li {
    height: 40px;
    cursor: pointer;
    height: 40px;
    font-size: 16px;
}

.home-left li:hover {
    text-decoration: underline;
}

.left-code {
    margin-top: 10px;
    border-bottom: 1px solid rgb(208, 215, 222);
}

.left-center {
    margin-top: 10px;
    border-bottom: 1px solid rgb(208, 215, 222);
}

.left-right {
    margin-top: 10px;
    border-bottom: 1px solid rgb(208, 215, 222);
}

.show-delete .span1 {
    display: none;
}

.show-delete:hover .span1 {
    display: inline;
}
</style>