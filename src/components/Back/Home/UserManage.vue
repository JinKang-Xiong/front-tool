<template>
    <div class="usermanage-search">
        <a-form ref="formRef" name="advanced_search" class="ant-advanced-search-form" :model="formState" @finish="onFinish">
            <a-row :gutter="24">
                <template v-for="(item, i) in forinputname" :key="i">
                    <a-col v-show="expand || i <= 1" :span="7">
                        <a-form-item :name="item.inputvalue" :label="item.inputlabel"
                            :rules="[{ required: false, message: '请输入' }]">
                            <a-input v-model:value="formState[item.inputvalue]" placeholder=""></a-input>
                        </a-form-item>
                    </a-col>
                </template>
                <a-col :span="5" style="text-align: right" v-show="!expand">
                    <a-button type="primary" html-type="submit">查询</a-button>
                    <a-button style="margin: 0 8px" @click="resetUser">重置</a-button>
                    <a style="font-size: 12px" @click="expand = !expand">
                        <template v-if="expand">
                            <UpOutlined />
                        </template>
                        <template v-else>
                            <DownOutlined />
                        </template>
                        下拉
                    </a>
                </a-col>
            </a-row>
            <a-row v-show="expand">
                <a-col :span="24" style="text-align: right">
                    <a-button type="primary" html-type="submit">查询</a-button>
                    <a-button style="margin: 0 8px" @click="resetUser">重置</a-button>
                    <a style="font-size: 12px" @click="expand = !expand">
                        <template v-if="expand">
                            <UpOutlined />
                        </template>
                        <template v-else>
                            <DownOutlined />
                        </template>
                        收起
                    </a>
                </a-col>
            </a-row>
        </a-form>
    </div>
    <div class="usermanage-list">
        <a-table :columns="columns" :row-key="record => record.id" :data-source="dataSource" :loading="loading"
            :pagination="pagination" @change="handleTableChange">
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'avatarUrl'">
                    <div style="width: 80px ;height: 80px;  overflow: hidden;">
                        <a-image :width="80" :height="80" :src="record.avatarUrl" />
                    </div>
                </template>
                <template v-if="column.dataIndex === 'userStatus'">
                    <div class="editable-cell">
                        <div v-if="editableData[record.id]" class="editable-cell-input-wrapper">
                            <a-select v-model:value="editableData[record.id].userStatus" @pressEnter="save(record.id)"
                                style="
                                width:70px">
                                <a-select-option key=" 1" value="运行">运行</a-select-option>
                                <a-select-option key="2" value="异常">异常</a-select-option>
                            </a-select>
                            <!-- <a-input v-model:value="editableData[record.id].userStatus" @pressEnter="save(record.id)" /> -->
                            <check-outlined class="editable-cell-icon-check" @click="save(record.id)" />
                        </div>
                        <div v-else class="editable-cell-text-wrapper">
                            <a-badge :status="text == '运行' ? 'success' : 'error'" />
                            {{ text }}
                            <edit-outlined class="editable-cell-icon" @click="edit(record.id)" />
                        </div>
                    </div>
                </template>
                <!-- <template v-if="column.dataIndex === 'gender'">
                    {{ text == '1' ? '男' : '女' }}
                </template> -->
                <template v-if="column.dataIndex === 'operation'">
                    <a-popconfirm v-if="dataSource.length" title="Sure to delete?" @confirm="onDelete(record.id)">
                        <a>注销</a>
                    </a-popconfirm>
                </template>
            </template>

        </a-table>
    </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { DownOutlined, UpOutlined, CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
import { UserManagePage, UserEdit, UserDelete } from '../../../api/backApi'
import { cloneDeep } from 'lodash-es';
import { message } from 'ant-design-vue'
onMounted(() => {
    feth({ current: current.value, pageSize: pageSize.value, user: {} })
})


//#region 搜索功能
const expand = ref(false);
const formRef = ref();
const formState = reactive({
    username: '',
    userAccount: '',
    email: '',
    phone: '',
});
const forinputname = reactive([
    { inputlabel: '用户名', inputvalue: 'username' },
    { inputlabel: '账号', inputvalue: 'userAccount' },
    { inputlabel: '邮箱', inputvalue: 'email' },
    { inputlabel: '电话', inputvalue: 'phone' },
])
const onFinish = values => {
    console.log('Received values of form: ', values);
    console.log('formState: ', formState);
    current.value = 1;
    pageSize.value = 10;
    feth({ current: current.value, pageSize: pageSize.value, user: formState })
};

const resetUser = () => {
    console.log("点击重置");

    formState.username = ''
    formState.userAccount = ''
    formState.email = ''
    formState.phone = ''
    current.value = 1;
    pageSize.value = 10;
    feth({ current: current.value, pageSize: pageSize.value, user: {} })
}

//#endregion


// #region 表格的数据和函数
const columns = [
    {
        title: '用户名',
        dataIndex: 'username'
    },
    {
        title: '账号',
        dataIndex: 'userAccount'
    },
    {
        title: '用户头像',
        dataIndex: 'avatarUrl'
    },
    {
        title: '性别',
        dataIndex: 'gender'
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        ellipsis: true,
    },
    {
        title: '状态',
        dataIndex: 'userStatus',
        width: 130
    },
    {
        title: '联系方式',
        dataIndex: 'phone',
        ellipsis: true
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        ellipsis: true,
    },
    {
        title: '修改时间',
        dataIndex: 'updateTime',
        ellipsis: true,
    },
    {
        title: '登录次数',
        dataIndex: 'loginTotal'
    },
    {
        title: '公共贡献',
        dataIndex: 'publicContribution',
        width: 100
    },
    {
        title: '操作',
        dataIndex: 'operation',
    },
];
const current = ref(1)
const pageSize = ref(10)
const loading = ref(true)
const dataSource = ref([])
const total = ref()
const pagination = computed(() => ({
    total: total.value,
    current: current.value,
    pageSize: pageSize.value,
}));

const handleTableChange = (pag, filters, sorter) => {
    console.log(pag);
    console.log(filters);
    console.log(sorter);
    current.value = pag.current;
    pageSize.value = pag.pageSize;
    const pageObject = {
        current: pag.current,
        pageSize: pag.pageSize
    }
    feth({ ...pageObject, user: formState })
};

function feth(param = {}) {
    loading.value = true;
    console.log(param);
    UserManagePage(param).then((res) => {
        loading.value = false
        console.log(res);
        console.log(res.data.records);
        res.data.records.forEach((item) => {
            item.gender = item.gender == '1' ? '男' : '女';
            item.userStatus = item.userStatus == '0' ? '运行' : '异常';
            item.userRole = item.userRole == '1' ? '管理员' : '用户'
        })
        dataSource.value = [...res.data.records]
        total.value = res.data.total;
        console.log(total.value);
    });

}

// #endregion 


// #region 编辑和注销的功能
const editableData = reactive({});
const edit = id => {
    editableData[id] = cloneDeep((dataSource.value.filter(item => id === item.id)[0]));
};
const save = id => {
    const userStatusNumber = editableData[id].userStatus == '运行' ? 0 : 1
    UserEdit({ id, userStatus: userStatusNumber }).then((res) => {
        console.log(res);
        if (res.code == 40101) {
            message.error(res.message)
        }
        if (res.code == 0) {
            message.success('修改成功')
        }
        feth({ current: current.value, pageSize: pageSize.value, user: {} })
        delete editableData[id];
    })

};
const onDelete = id => {
    UserDelete({ id }).then((res) => {
        if (res.code == 40101) {
            message.error(res.message)
        }
        if (res.code == 0) {
            message.success('注销成功')
        }
        feth({ current: current.value, pageSize: pageSize.value, user: {} })
    })
};
// #endregion

</script>

<style lang="css">
.usermanage-search {
    /* border: 1px solid black; */
    margin-bottom: 20px;
}

.ant-image-preview-body {
    height: 100vh;
}

#components-form-demo-advanced-search .ant-form {
    max-width: none;
}

#components-form-demo-advanced-search .search-result-list {
    margin-top: 16px;
    border: 1px dashed #e9e9e9;
    border-radius: 2px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: center;
    padding-top: 80px;
}

[data-theme='dark'] .ant-advanced-search-form {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid #434343;
    padding: 24px;
    border-radius: 2px;
}

[data-theme='dark'] #components-form-demo-advanced-search .search-result-list {
    border: 1px dashed #434343;
    background: rgba(255, 255, 255, 0.04);
}
</style>
<style lang="less">
.editable-cell {
    position: relative;

    .editable-cell-input-wrapper,
    .editable-cell-text-wrapper {
        padding-right: 24px;
    }

    .editable-cell-text-wrapper {
        padding: 5px 24px 5px 5px;
    }

    .editable-cell-icon,
    .editable-cell-icon-check {
        position: absolute;
        right: 0;
        width: 20px;
        cursor: pointer;
    }

    .editable-cell-icon {
        margin-top: 4px;
        display: none;
    }

    .editable-cell-icon-check {
        line-height: 28px;
    }

    .editable-cell-icon:hover,
    .editable-cell-icon-check:hover {
        color: #108ee9;
    }

    .editable-add-btn {
        margin-bottom: 8px;
    }
}

.editable-cell:hover .editable-cell-icon {
    display: inline-block;
}
</style>