<template>
    <div class="mysearch-content">
        <a-row>
            <a-col :span="12" style="text-align: center">
                <a-typography-title :level="2" style="margin-top: 100px;">公共搜索</a-typography-title>
                <a-typography-text type="secondary" style="font-size: 20px;">书籍，笔记，代码等待你的寻找——《搜索物语》</a-typography-text>
            </a-col>
            <a-col :span="12" style="text-align: center;">
                <img style="width: 350px;" src="../../../assets/Client/images/searchlogo.svg">
            </a-col>
        </a-row>
        <a-row style="margin-top: 40px;">
            <a-col :span="22" offset="1">
                <a-space>
                    <a-select v-model:value="searchValue" show-search placeholder="请输入你要搜索的标题或标签" style="width: 600px;"
                        size="large" :default-active-first-option="false" :show-arrow="false" :filter-option="false"
                        :not-found-content="null" @search="handleSearch" @change="handleChange">
                        <template #suffixIcon><search-outlined /></template>
                        <a-select-option v-for="(option, index) in searchData" :key="option.value" :value="option.value">
                            <a-row>
                                <a-col :span="20">{{ option.label }}</a-col>
                            </a-row>
                        </a-select-option>

                    </a-select>
                    <a-select ref="select" size="large" v-model:value="searchType" style="width: 100px" @focus="focus">
                        <a-select-option :value="0">代码</a-select-option>
                        <a-select-option :value="1">书籍</a-select-option>
                        <a-select-option :value="2">笔记</a-select-option>
                    </a-select>
                </a-space>

            </a-col>
        </a-row>
    </div>
</template>

<script setup>
import { MenuUnfoldOutlined, SearchOutlined, CodeOutlined, CoffeeOutlined, DatabaseOutlined, UserOutlined, PlusOutlined, CaretDownOutlined, CloseOutlined, ReadOutlined, PictureOutlined } from '@ant-design/icons-vue';
import { ref, onMounted, inject } from 'vue';
import { SearchByCodeAPI } from '../../../api/clientApi'
import { useRouter } from 'vue-router';
const router = useRouter()
//#region 搜索功能
const searchValue = ref()
const searchData = ref([])
const searchType = ref(0)

const handleSearch = (value) => {
    console.log('输出流')
    switch (searchType.value) {
        case 0:
            let data = []
            data.push({
                value: value + ',' + 'keyId',
                label: value,
                codeTag: '',
                title: value
            })
            // res.data.forEach(item => {
            //     data.push({
            //         value: item.codeList.codeuuid + ',' + item._id,
            //         label: item.codeList.codeTitle,
            //         title: item.codeList.codeTitle,
            //         codeTag: item.codeList.codeTag
            //     })
            // })
            searchData.value = [...data]
            break;
        case 1:
            searchData.value = [{
                value: value,
                label: value
            }]
            break;
        case 2:
            searchData.value = [{
                value: value,
                label: value
            }]
            break;


    }

}
const handleChange = (value) => {
    switch (searchType.value) {
        case 0:
            console.log(value);
            const IdArr = value.split(',')
            if (IdArr[1] == 'keyId') {
                router.push({ name: 'searchpublic', params: { searchByCodeValue: IdArr[0] } })
            } else {
                router.push({ name: 'searchresult', params: { _id: IdArr[1], codeuuid: IdArr[0] } })
            }
            break;
        case 1:
            router.push({ name: 'searchpublicbook', params: { inputValue: value } })
            break;
        case 2:
            router.push({ name: 'searchpublicnote', params: { inputValue: value } })
            break;
    }


}
//#endregion
</script>

<style scoped>
.mysearch-content {
    width: 60%;
    margin: 0px auto;
}
</style>