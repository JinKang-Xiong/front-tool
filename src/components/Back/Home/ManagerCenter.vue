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
    <a-row>
        <a-col :span="2">
            <a-button type="primary" shape="round" @click="showModal">新增</a-button>
        </a-col>
    </a-row>
    <div class="add-big-manager-model">
        <a-modal v-model:visible="visible" keyboard="true" style="top: 40px;" title="新增管理员"
            :confirm-loading="confirmLoading" @ok="handleFinishAdd" okText="提交" cancelText="取消">
            <div>
                <a-form ref="formRefAdd" name="custom-validation" :model="formStateAdd" :rules="rulesAdd" v-bind="layoutAdd"
                    @finish="handleFinishAdd" @validate="handleValidateAdd" @finishFailed="handleFinishFailedAdd">
                    <a-form-item has-feedback label="用户名" name="bigManagerName">
                        <a-input v-model:value="formStateAdd.bigManagerName" autocomplete="off" />
                    </a-form-item>
                    <a-form-item has-feedback label="账号" name="bigManagerAccount">
                        <a-input v-model:value="formStateAdd.bigManagerAccount" autocomplete="off" />
                    </a-form-item>
                    <a-form-item has-feedback label="密码" name="bigManagerPassword">
                        <a-input-password v-model:value="formStateAdd.bigManagerPassword" autocomplete="off" />
                    </a-form-item>
                    <a-form-item has-feedback label="性别" name="gender">
                        <a-select v-model:value="formStateAdd.gender" style="width: 120px">
                            <a-select-option :value="0">女</a-select-option>
                            <a-select-option :value="1">男</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item has-feedback label="年龄" name="age">
                        <a-input-number v-model:value="formStateAdd.age" type="number" autocomplete="off" />
                    </a-form-item>
                    <a-form-item has-feedback label="邮箱" name="email">
                        <a-input v-model:value="formStateAdd.email" autocomplete="off" />
                    </a-form-item>
                    <a-form-item has-feedback label="手机号码" name="phone">
                        <a-input v-model:value="formStateAdd.phone" autocomplete="off" />
                    </a-form-item>
                    <!-- <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                        <a-button type="primary" html-type="submit">提交</a-button>
                        <a-button style="margin-left: 10px" @click="resetForm">取消</a-button>
                    </a-form-item> -->
                </a-form>
            </div>
        </a-modal>
    </div>
    <div class="usermanage-list">
        <a-table :columns="columns" :row-key="record => record.id" :data-source="dataSource" :loading="loading"
            :pagination="pagination" @change="handleTableChange">
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'avatarUrl'">
                    <div style="width: 80px ;height: 80px;  overflow: hidden;">
                        <a-image :width="80" :height="80"
                            :src="record.avatarStatus == 0 ? record.avatarUrl : '/api/images/avatar/errImage.jpg'" />
                    </div>
                </template>
                <!-- <template v-if="column.dataIndex === 'gender'">
                    {{ text == '1' ? '男' : '女' }}
                </template> -->
                <template v-if="column.dataIndex === 'edit'">
                    <a @click="editShow(record.id)">编辑</a>
                </template>
                <template v-if="column.dataIndex === 'operation'">
                    <a-popconfirm v-if="dataSource.length" title="Sure to delete?" @confirm="onDelete(record.id)">
                        <a>注销</a>
                    </a-popconfirm>
                </template>
            </template>

        </a-table>
        <a-modal v-model:visible="editVisible" title="修改管理员" @ok="handleOkEdit" okText="确认" cancelText="取消">
            <a-form :model="formStateEdit" name="编辑管理员" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
                autocomplete="off" @finish="onFinishEdit" @finishFailed="onFinishFailed">
                <a-form-item label="管理员用户名" name="bigManagerName" :rules="[{ required: true, message: '请填写用户名' }]">
                    <a-input v-model:value="formStateEdit.bigManagerName" />
                </a-form-item>
                <a-form-item label="管理员账号" name="bigManagerAccount">
                    {{ formStateEdit.bigManagerAccount }}
                </a-form-item>
                <a-form-item label="性别" name="gender" :rules="[{ required: true, message: '请选择性别' }]">
                    <a-select ref="select" v-model:value="formStateEdit.gender" style="width: 120px">
                        <a-select-option :value="1">男</a-select-option>
                        <a-select-option :value="0">女</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="年龄" name="age" :rules="[{ required: true, message: '请填写正确的年龄' }]">
                    <a-input-number id="inputNumber" v-model:value="formStateEdit.age" :min="0" :max="120" />
                </a-form-item>
                <a-form-item label="邮箱" name="email" :rules="[{ required: true, message: '请填写正确邮箱' }]">
                    <a-input v-model:value="formStateEdit.email" />
                </a-form-item>

                <a-form-item label="手机号码" name="phone" :rules="[{ required: true, message: '请填写正确手机号码' }]">
                    <a-input v-model:value="formStateEdit.phone" />
                </a-form-item>
                <a-form-item label="头像状态" name="avatarStatus" :rules="[{ required: true, message: '请选择状态' }]">
                    <a-select ref="select" v-model:value="formStateEdit.avatarStatus" style="width: 120px">
                        <a-select-option :value="1">不可展示</a-select-option>
                        <a-select-option :value="0">可展示</a-select-option>
                    </a-select>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { DownOutlined, UpOutlined, CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
import { BigManagerAdd, BigManagerSearch, BigManagerDelete, QueryByIdAPI, UpdateBigManagerAPI } from '../../../api/backApi'
import { cloneDeep } from 'lodash-es';
import { message } from 'ant-design-vue'
onMounted(() => {
    feth({ current: current.value, pageSize: pageSize.value, bigManager: {} })
})


//#region 搜索功能
const expand = ref(false);
const formRef = ref();
const formState = reactive({
    bigManagerName: '',
    bigManagerAccount: '',
    email: '',
    phone: '',
});
const forinputname = reactive([
    { inputlabel: '用户名', inputvalue: 'bigManagerName' },
    { inputlabel: '账号', inputvalue: 'bigManagerAccount' },
    { inputlabel: '邮箱', inputvalue: 'email' },
    { inputlabel: '电话', inputvalue: 'phone' },
])
const onFinish = values => {
    console.log('Received values of form: ', values);
    console.log('formState: ', formState);
    current.value = 1;
    pageSize.value = 10;
    feth({ current: current.value, pageSize: pageSize.value, bigManager: formState })
};

const resetUser = () => {
    formState.bigManagerName = ''
    formState.bigManagerAccount = ''
    formState.email = ''
    formState.phone = ''
    current.value = 1;
    pageSize.value = 10;
    feth({ current: current.value, pageSize: pageSize.value, bigManager: {} })
}

//#endregion


//#region 新增用户功能

//检查年龄的格式

const visible = ref(false);
const showModal = () => {
    visible.value = true;
};

const formRefAdd = ref();
const formStateAdd = reactive({
    bigManagerName: '',
    bigManagerAccount: '',
    gender: null,
    age: null,
    bigManagerPassword: '',
    email: '',
    phone: '',
})

let checkAge = async (_rule, value) => {

    if (value <= 0 || value >= 120) {
        return Promise.reject("请输入正确的年龄")


    } else {
        return Promise.resolve()
    }
}
const rulesAdd = {
    bigManagerName: [{
        required: true,
        trigger: 'change',
        message: '用户名不能为空'
    }],
    bigManagerAccount: [{
        required: true,
        min: 6,
        message: '账号长度不可小于6',
        trigger: 'change'

    }],
    gender: [{
        required: true,
        trigger: 'change'
    }],
    age: [{
        required: true,
        validator: checkAge,
        trigger: 'change'
    }],
    bigManagerPassword: [{
        required: true,
        min: 6,
        message: '密码长度不可小于6',
        trigger: 'change'
    }],
    email: [{
        required: true,
        trigger: 'change',
        pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
        message: '请输入正确的邮箱'
    }],
    phone: [{
        required: true,
        trigger: 'change',
        pattern: /^1[3-9]\d{9}$/,
        len: 11,
        message: '请输入正确的手机格式'

    }]

}
const layoutAdd = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 14,
    },
};


const handleFinishAdd = values => {
    BigManagerAdd(formStateAdd).then((res) => {
        if (res.code == 0) {
            message.success("新增成功");
            formStateAdd.bigManagerName = '';
            formStateAdd.bigManagerAccount = '';
            formStateAdd.gender = null;
            formStateAdd.age = null;
            formStateAdd.bigManagerPassword = '';
            formStateAdd.email = '';
            formStateAdd.phone = '';
            visible.value = !visible.value
        } else {
            message.error('新增失败');
        }
    })
};

//#endregion

// #region 表格的数据和函数
const columns = [
    {
        title: '用户名',
        dataIndex: 'bigManagerName'
    },
    {
        title: '账号',
        dataIndex: 'bigManagerAccount'
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
        title: '年龄',
        dataIndex: 'age',

    },
    {
        title: '邮箱',
        dataIndex: 'email',
        ellipsis: true,
    },
    {
        title: '电话',
        dataIndex: 'phone'
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
        title: '权限',
        dataIndex: 'managerRole'
    },
    {
        title: '编辑',
        dataIndex: 'edit'
    },
    {
        title: '操作',
        dataIndex: 'operation'
    }
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
    feth({ ...pageObject, bigManager: formState })
};

function feth(param = {}) {
    loading.value = true;
    console.log(param);
    BigManagerSearch(param).then((res) => {
        loading.value = false
        console.log(res);
        console.log(res.data.records);
        res.data.records.forEach((item) => {
            item.gender = item.gender == 1 ? '男' : '女';
            item.managerRole = item.managerRole == 1 ? '管理员' : '大管理员';
        })
        dataSource.value = [...res.data.records]
        total.value = res.data.total;
        console.log(total.value);
    });

}

// #endregion 


// #region 编辑和注销的功能
const formStateEdit = reactive({
    id: null,
    bigManagerName: '',
    bigManagerAccount: '',
    avatarStatus: null,
    gender: null,
    age: null,
    email: '',
    phone: '',
})
const editVisible = ref(false)

const editShow = (id) => {
    editVisible.value = !editVisible.value

    QueryByIdAPI({ id }).then(res => {
        if (res.code == 0) {
            formStateEdit.id = id
            formStateEdit.bigManagerName = res.data.bigManagerName;
            formStateEdit.bigManagerAccount = res.data.bigManagerAccount;
            formStateEdit.avatarStatus = res.data.avatarStatus;
            formStateEdit.gender = res.data.gender;
            formStateEdit.age = res.data.age;
            formStateEdit.email = res.data.email;
            formStateEdit.phone = res.data.phone;
        }
    })
}

const handleOkEdit = () => {
    UpdateBigManagerAPI(formStateEdit).then(res => {
        if (res.code == 0) {
            message.success("修改成功")
            editVisible.value = !editVisible.value
            feth({ current: current.value, pageSize: pageSize.value, bigManager: {} })

        } else {
            message.error("修改失败:" + res.decription);
        }

    })
}

const onDelete = id => {
    BigManagerDelete({ id, statusDelete: 1 }).then((res) => {
        if (res.code == 40101) {
            message.error(res.message)
        }
        if (res.code == 0) {
            message.success('注销成功')
        }
        feth({ current: current.value, pageSize: pageSize.value, bigManager: {} })
    })
};
// #endregion

</script>

<style lang="css">
.usermanage-search {
    /* border: 1px solid black; */
    margin-bottom: 20px;
}

.usermanage-list {
    margin-top: 20px;
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