<template>
    <div id="codestore-content">
        <!-- <div class="codestore-top">
            <a-collapse v-model:activeKey="activeKey" :bordered="false">
                <template #expandIcon="{ isActive }">
                    <caret-right-outlined :rotate="isActive ? 90 : 0" />
                </template>
<a-collapse-panel key="1" header="常用代码库" :style="customStyle">
    <p>{{ text }}</p>
</a-collapse-panel>

</a-collapse>
</div> -->
        <div v-if="!defaultGroup" class="default-store">
            <a-typography-title :level="5">还没有默认分组喔，请先创建吧</a-typography-title>
            <a-button type="primary" size="large" style="margin-top: 20px;" @click="addDefault">创建默认分组</a-button>
        </div>
        <div v-if="defaultGroup" class="codestore-bootom">
            <a-row style="margin-top: 10px; margin-bottom: 10px; ">
                <a-dropdown :trigger="['click']" placement="bottomLeft">
                    <a-col :span="1" offset="23">
                        <a-button type="primary">
                            <plus-outlined />
                            <down-outlined />

                        </a-button>
                    </a-col>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item key="0" @click="AddGroup">
                                新建分组
                            </a-menu-item>
                            <a-menu-item key="1" @click="DefaultAddStore">
                                新建代码库
                            </a-menu-item>

                        </a-menu>
                    </template>
                </a-dropdown>

            </a-row>
            <div class="codestore-bootom-content">
                <div class="codestore-group" v-for="(elgroup, index) in groupData" :key="index">

                    <a-row style="margin-bottom: 10px; height: 32px;">
                        <a-col :span="4" style="padding-left: 20px;">
                            <a-typography-text ellipsis="true" strong @click="EditGroup(index)"
                                v-if="ShowEditGroup != index">{{
            elgroup.groupName }}</a-typography-text>
                            <a-input v-else v-model:value="elgroup.groupName" placeholder="修改组名">
                                <template #addonAfter>
                                    <check-outlined @click="EditGroupHidden(elgroup._id, elgroup.groupName)" />
                                </template>
                            </a-input>
                        </a-col>
                        <a-col :span="2" offset="18" class="showEditGroup">
                            <a-space>
                                <a-dropdown :trigger="['click']" placement="bottomLeft">
                                    <a-button type="">
                                        <plus-outlined />
                                        <down-outlined />

                                    </a-button>

                                    <template #overlay>
                                        <a-menu>
                                            <a-menu-item key="0" @click="AddGroup">
                                                新建分组
                                            </a-menu-item>

                                            <a-menu-item key="1" @click="AddStoreShowMoel(elgroup._id)">
                                                新建代码库
                                            </a-menu-item>

                                        </a-menu>
                                    </template>
                                </a-dropdown>
                                <a-popconfirm placement="topRight" ok-text="确定" cancel-text="取消"
                                    @confirm="deleteGroup(elgroup._id, elgroup.isDelete, elgroup.firstGroup)"
                                    @cancel="cancel">
                                    <template #title>
                                        <p>是否删除代码分组</p>
                                        <P>并将其下代码库移动默认分组中</P>
                                    </template>
                                    <a-button type="" danger><rest-outlined /></a-button>
                                </a-popconfirm>
                            </a-space>

                        </a-col>
                    </a-row>
                    <div class="codestore-bottom-group-content">

                        <div v-if="storeData[elgroup._id] == undefined ? true : false"
                            style="display: flex; justify-content: center; align-items: center; width: 250px; height: 120px; border: 1px dashed grey;"
                            @click="AddStoreShowMoel(elgroup._id)">
                            <div>
                                <plus-outlined style="font-size: 30px;" /><br>
                                <span>新建 </span>

                            </div>
                        </div>
                        <a-card hoverable style="width: 280px; margin-left: 22px; height: 304px; margin-top: 15px;"
                            v-for="(el, index) in  storeData[elgroup._id] " :key="index">

                            <template #actions>
                                <a-popconfirm title="是否删除代码库" ok-text="确定" cancel-text="取消"
                                    @confirm="deleteStore(el._id)" @cancel="cancel">
                                    <close-outlined key="setting"></close-outlined>
                                </a-popconfirm>
                                <edit-outlined v-if="showStoreTitle != index" key="edit"
                                    @click="ShowEditStore(index)" />
                                <check-outlined v-else
                                    @click="editStore(el._id, el.storeName, el.storeDescription)"></check-outlined>
                                <ellipsis-outlined key="content" />
                            </template>
                            <a-card-meta>
                                <template #title>
                                    <a v-if="showStoreTitle != index" @click="routerCodeSnippet(el._id)">{{ el.storeName
                                        }}</a>
                                    <a-input v-else v-model:value="el.storeName" placeholder="请输入标题" />
                                </template>
                                <template #description>
                                    <span v-if="showStoreTitle != index"> {{ el.storeDescription.length > 10 ?
            el.storeDescription.slice(0,
                10) + '...' :
            el.storeDescription }}

                                    </span>
                                    <a-input v-else size="small" v-model:value="el.storeDescription" :bordered="false"
                                        placeholder="请输入简介" />

                                </template>
                                <template #avatar>
                                    <MyIcon type="icon-jishiben" style="font-size: 30px;"></MyIcon>
                                </template>
                            </a-card-meta>
                            <a-row style="padding-top: 20px; height: 158px;">
                                <a-col :span="22">
                                    <a-list item-layout="horizontal" :data-source="el.codeList" :split="false">
                                        <template #renderItem="{ item }">
                                            <a-list-item>
                                                <a-list-item-meta :description="item.codeTitle">
                                                </a-list-item-meta>
                                                <template #extra>
                                                    <span
                                                        style=" color: rgba(0, 0, 0, 0.45);font-size: 14px;line-height: 1.5715;">{{
            item.codeCreateTime.slice(0, 10) }}</span>
                                                </template>
                                            </a-list-item>
                                        </template>
                                    </a-list>
                                </a-col>

                            </a-row>
                        </a-card>
                    </div>
                </div>


            </div>

        </div>
        <a-modal v-model:visible="AddStorevisible" title="新建代码库" @ok="handleOkAddStore" okText="确定" cancelText="取消">
            <p>名称</p>
            <a-input v-model:value="AddStoreName" placeholder="如：页面布局" />
            <p>简介</p>
            <a-textarea v-model:value="AddStoreDescription" placeholder="如：关于开发页面的组件代码" :rows="3" />
        </a-modal>
    </div>
</template>

<script setup>
import { SettingOutlined, RestOutlined, CaretRightOutlined, DownOutlined, PlusOutlined, CheckOutlined, CloseOutlined, EditOutlined, EllipsisOutlined, createFromIconfontCN, CloseSquareTwoTone } from '@ant-design/icons-vue';
import { FindAllStoreAPI, DeleteCodeStoreAPI, DeleteGroupAPI, AddGroupAPI, UpdateGroupNameAPI, UpdateStoreAPI, FindAllGroupAPI, AddStoreAPI } from '../../../api/clientApi'
import { onMounted, ref } from 'vue'
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { AddMemoAPI } from '../../../api/clientApi';
import { useclientStore } from '../../../stores/count.js'

const counter = useclientStore()
const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4158111_1ruumo6bmni.js', // 在 iconfont.cn 上生成
});
const router = useRouter()
onMounted(() => {

    feth({ userId: counter.clientlogin.id })
    fethgroup({ userId: counter.clientlogin.id })
})

//#region 分组的操作
const addDefault = () => {
    AddGroupAPI({ groupName: '默认分组', userId: counter.clientlogin.id, isDelete: 1, firstGroup: 1 }).then(res => {
        if (res.code == 0) {
            message.success('创建成功')
            fethgroup({ userId: counter.clientlogin.id })
        }
    })
}
const groupData = ref()

const fethgroup = (query) => {
    FindAllGroupAPI(query).then(res => {
        if (res.code == 0) {
            groupData.value = res.data
            res.data.forEach(item => {
                if (item.firstGroup == 1 && item.isDelete == 1) {
                    defaultGroup.value = item
                }
            })
        }
    })
}
const AddStorevisible = ref(false)
const currentGroupId = ref()
const defaultGroup = ref()
const AddStoreShowMoel = (groupId) => {
    AddStorevisible.value = true
    currentGroupId.value = groupId
}
const AddStoreName = ref()
const AddStoreDescription = ref()
const handleOkAddStore = () => {
    AddStoreAPI({
        storeName: AddStoreName.value,
        storeDescription: AddStoreDescription.value,
        groupId: currentGroupId.value == -1 ? defaultGroup.value._id : currentGroupId.value,
        userId: counter.clientlogin.id
    }).then(res => {
        if (res.code == 0) {
            message.success('增加成功')
            AddStorevisible.value = false
            AddStoreName.value = ''
            AddStoreDescription.value = ''
            feth({ userId: counter.clientlogin.id })
        }
    })
}
const DefaultAddStore = () => {
    console.log("执行啦")
    AddStorevisible.value = true
    console.log(AddStorevisible.value);
    currentGroupId.value = -1
    console.log(defaultGroup.value)
}
//编辑分组标题
const ShowEditGroup = ref()
const InputFocus = ref()
const EditGroup = (index) => {
    ShowEditGroup.value = index
}
const EditGroupHidden = (_id, groupName) => {
    UpdateGroupNameAPI({ _id, groupName }).then(res => {
        if (res.code == 0) {
            message.success('编辑成功')
            console.log("点击消失")
            ShowEditGroup.value = -1
            fethgroup({ userId: counter.clientlogin.id })
        }
    })

}

const AddGroup = () => {
    AddGroupAPI({ groupName: '新建组名', userId: counter.clientlogin.id, isDelete: 0, firstGroup: 0 }).then(res => {
        if (res.code == 0) {
            message.success('创建成功')
            fethgroup({ userId: counter.clientlogin.id })
        }
    })
}

const deleteGroup = (_id, isDelete, firstGroup) => {
    DeleteGroupAPI({ _id, userId: counter.clientlogin.id, deleteStatus: 0, isDelete, firstGroup }).then(res => {
        if (res.code == 0) {
            message.success("删除代码片段成功")
            fethgroup({ userId: counter.clientlogin.id })
            feth({ userId: counter.clientlogin.id })
        }
    })
}

//#endregion






const showStoreTitle = ref(-1)
const ShowEditStore = (index) => {
    showStoreTitle.value = index
}
const editStore = (_id, storeName, storeDescription) => {
    showStoreTitle.value = -1
    UpdateStoreAPI({ _id, storeName, storeDescription }).then(res => {
        if (res.code == 0) {
            message.success("编辑成功")
            feth({ userId: counter.clientlogin.id })
        }
    })
}
const storeData = ref()

const feth = (query) => {
    FindAllStoreAPI(query).then(res => {
        if (res.code == 0) {
            // storeData.value = res.data

            var newdata = {}
            res.data.forEach(function (item) {
                var groupId = item.groupId;

                // 检查newdata对象是否已经有当前group的键，若没有则新建一个数组来保存对应的对象
                if (!newdata[groupId]) {
                    newdata[groupId] = [];
                }

                // 将当前对象添加到对应group的数组中
                newdata[groupId].push(item);
            });
            storeData.value = newdata
            console.log("--------storeData----");
            console.log(storeData.value);


        }
    })
}


const routerCodeSnippet = (_id) => {
    router.push({ name: 'codeshow', params: { _id: _id } });
}

//删除代码库
const deleteStore = (_id) => {
    DeleteCodeStoreAPI({ _id }).then(res => {
        if (res.code == 0) {
            message.success('删除成功')
            feth({ userId: counter.clientlogin.id })
        }
    })
}
</script>

<style>
.default-store {
    width: 250px;
    height: 150px;
    text-align: center;
    margin: 200px auto;
}

.codestore-group {
    margin-top: 40px;
}

.codestore-group:hover .showEditGroup {
    display: block;
}

.showEditGroup {
    display: none;
}

.codestore-bottom-group-content {
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid rgb(208, 215, 222);
    padding-bottom: 15px;
    /* align-items: center; */
    /* align-content: space-around; */
}

#codestore-content {
    padding: 20px;
    overflow: auto;
    height: 600px;
}


#codestore-content::-webkit-scrollbar {
    width: 8px;
    /* 纵向滚动条宽度 */
    height: 8px;
    /* 横向滚动条高度 */
    background-color: white;
    /* 滚动条整体背景，一般被覆盖着 */
}

/* 滚动条里面的滑块 */
#codestore-content::-webkit-scrollbar-thumb {
    border-radius: 10px;
    /* 滚动条滑块阴影 */
    background-color: rgba(216, 218, 217);
    /* 滚动条滑块颜色 */
}

/* 滚动条的轨道（里面装有Thumb） */
#codestore-content::-webkit-scrollbar-track {
    /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
    /* 滚动条轨道阴影 */
    border-radius: 10px;
    /* 滚动条轨道圆角 */
    background-color: white;
    /* 滚动条轨道背景 */
}
</style>