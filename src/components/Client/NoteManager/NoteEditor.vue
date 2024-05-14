<template>
    <a-row>
        <a-col :span="22">
            <a-input v-model:value="noteState.noteName" style="font-size: 18px;" :bordered="false" placeholder="请输入笔记标题"
                size="large"></a-input>
        </a-col>
        <a-col :span="2" style="line-height: 42px;">
            <a-space>
                <a-button type="primary" @click="visiblesave = true">保存</a-button>
                <a-button type="" @click="RouterBack">返回</a-button>
            </a-space>
        </a-col>
        <a-modal v-model:visible="visiblesave" title="保存笔记" @ok="handleOkAddNote" okText="确定" cancelText="取消">
            <a-row>
                <a-col :span="24">
                    <span>笔记本：</span>
                    <a-select v-model:value="noteState.notebookId" style="width: 120px" :options="optionsnotebook">
                        <template #dropdownRender="{ menuNode: menu }">
                            <v-nodes :vnodes="menu" />
                            <a-divider style="margin: 4px 0" />
                            <div style="padding: 4px 8px; cursor: pointer" @mousedown="e => e.preventDefault()"
                                @click="addItem">
                                <plus-outlined />
                                新建笔记本
                            </div>
                            <a-modal v-model:visible="visibleaddnotebook" title="新建笔记" @ok="handleOkAddNoteBook" okText="确定"
                                cancelText="取消">
                                <a-form>
                                    <a-form-item label="笔记本名">
                                        <a-input v-model:value="notebookName"></a-input>
                                    </a-form-item>
                                    <a-form-item label="笔记本简介">
                                        <a-textarea :autosize="{ minRows: 3, maxRows: 6 }"
                                            v-model:value="notebookDescription" show-count :maxlength="100" />
                                    </a-form-item>
                                </a-form>
                            </a-modal>
                        </template>
                    </a-select>
                </a-col>
            </a-row>
            <a-row style="margin-top: 20px;">
                <a-col :span="24">
                    <span>标签：</span>
                    <template v-for="(tag, index) in state.tags" :key="tag">
                        <a-tooltip v-if="tag.length > 20" :title="tag">
                            <a-tag :closable="index !== 0" @close="handleClose(tag)">
                                {{ `${tag.slice(0, 20)}...` }}
                            </a-tag>
                        </a-tooltip>
                        <a-tag v-else :closable="true" @close="handleClose(tag)"
                            style="height: 28px; line-height: 28px; font-size: 14px;">
                            {{ tag }}
                        </a-tag>
                    </template>
                    <a-input v-if="state.inputVisible" ref="inputRef" v-model:value="state.inputValue" type="text"
                        size="small" :style="{ width: '78px', height: '28px' }" @blur="handleInputConfirm"
                        @keyup.enter="handleInputConfirm" />
                    <a-tag v-else
                        style="background: #fff; border-style: dashed;height: 28px; line-height: 28px; font-size: 14px;"
                        @click="showInput">
                        <plus-outlined />
                        新建标签
                    </a-tag>
                </a-col>
            </a-row>
            <a-row style="margin-top: 20px;">
                <a-col :span="24">
                    <span>书籍：</span>
                    <a-select v-model:value="noteState.bookId" mode="multiple" style="width: 400px;" placeholder="请选择绑定的书籍"
                        @change="handleChange" :options="optionsbook"></a-select>
                </a-col>
            </a-row>
            <a-row style="margin-top: 20px;">
                <a-col :span="24">
                    <span>可见范围：</span>
                    <a-radio-group v-model:value="noteState.isPartPublic">
                        <a-radio :value="0">私有性</a-radio>
                        <a-radio :value="1">公有性</a-radio>
                    </a-radio-group>
                </a-col>
            </a-row>
        </a-modal>
    </a-row>

    <v-md-editor v-model="noteState.noteContent" height="800px"
        left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code |emoji|tip"></v-md-editor>
</template>

<script setup>
import { ref, defineProps, reactive, nextTick, onMounted } from 'vue'
import { SettingOutlined, EditOutlined, CloseOutlined, PlusOutlined, EllipsisOutlined, createFromIconfontCN } from '@ant-design/icons-vue';
import { AddNoteBookAPI, FindAllNoteBookAPI, FindAllBookAPI, AddNoteAPI, FindNoteByIdAPI, UpdateNoteAPI } from '../../../api/clientApi.js'
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { useclientStore } from '../../../stores/count.js'

const counter = useclientStore()
const router = useRouter()
const props = defineProps(['_id'])
onMounted(() => {
    fetchnotebook({ userId: counter.clientlogin.id, isDefault: 0 })
    fetchbook({ userId: counter.clientlogin.id })
    if (props._id != 'new') {
        console.log('执行啦获取Note方法')
        fetchnote({ _id: props._id, userId: counter.clientlogin.id })
    }
})

//查询用户全部笔记本
const fetchnotebook = (query) => {
    FindAllNoteBookAPI(query).then(res => {
        if (res.code == 0) {
            res.data.forEach(item => {
                optionsnotebook.value.push({ value: item._id, label: item.notebookName })
            })
        }
    })
}
//查询用户的全部书籍
const fetchbook = (query) => {
    FindAllBookAPI(query).then(res => {
        if (res.code == 0) {
            res.data.forEach(item => {
                optionsbook.value.push({ value: item._id, label: item.bookName })
            })
        }
    })
}

//根据id查询笔记
const fetchnote = (query) => {
    FindNoteByIdAPI(query).then(res => {
        if (res.code == 0) {
            noteState.noteName = res.data.noteName
            noteState.noteContent = res.data.noteContent
            noteState.bookId = [...res.data.bookId]
            noteState.isPartPublic = res.data.isPartPublic
            noteState.notebookId = res.data.notebookId
            oldNotebookId.value = res.data.notebookId
            state.tags = [...res.data.noteTag]
        }
    })
}

//#region 创建笔记
const noteState = reactive({
    noteName: '',
    noteContent: '',
    bookId: [],
    isPartPublic: null,
    notebookId: null
})

const oldNotebookId = ref()
//笔记本
const notebookName = ref()
const notebookDescription = ref()
const handleOkAddNoteBook = () => {
    AddNoteBookAPI({ userId: counter.clientlogin.id, notebookName: notebookName.value, notebookDescription: notebookDescription.value, isDefault: 0 }).then(res => {
        if (res.code == 0) {
            visibleaddnotebook.value = false
            optionsnotebook.value.push({ value: res.data._id, label: res.data.notebookName })
        }
    })
}
const VNodes = (_, { attrs }) => {
    return attrs.vnodes;
};
const optionsnotebook = ref([{

}])
const visibleaddnotebook = ref(false)
const addItem = () => {
    console.log('addItem');
    visibleaddnotebook.value = true
};

//笔记标签
const visiblesave = ref(false)
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

//笔记书籍
const optionsbook = ref([])

const handleOkAddNote = () => {
    if (props._id == 'new') {
        AddNoteAPI({
            noteName: noteState.noteName,
            noteContent: noteState.noteContent,
            noteTag: state.tags,
            userId: counter.clientlogin.id,
            bookId: noteState.bookId,
            isPartPublic: noteState.isPartPublic,
            notebookId: noteState.notebookId
        }).then(res => {
            if (res.code == 0) {
                router.push({ name: 'noteshow' })
            }
        })
    } else {
        UpdateNoteAPI({
            _id: props._id,
            noteName: noteState.noteName,
            noteContent: noteState.noteContent,
            noteTag: state.tags,
            isPartPublic: noteState.isPartPublic,
            bookId: noteState.bookId,
            userId: counter.clientlogin.id,
            notebookId: noteState.notebookId,
            oldnotebookId: oldNotebookId.value
        }).then(res => {
            if (res.code == 0) {
                if (res.data == '抱歉，可见范围修改失败') {
                    message.error('抱歉，可见范围修改失败')
                } else {
                    message.success('修改成功')
                }
                router.push({ name: 'noteshow' })

            }
        })
    }

}
//#endregion

const RouterBack = () => {
    router.back()
}

</script>