<template>
    <div id="analyst-content">
        <a-row>
            <a-col :span="6">
                <div class="statistic-div">
                    <a-statistic title="用户总数" :value="userTotal" style=" " valueStyle="font-size:30px;" />
                    <a-statistic title="同期比" :value="dailyYear < 0 ? -dailyYear : dailyYear" :precision="2" suffix="%"
                        class="demo-class" :value-style="dailyYear < 0 ? { color: '#cf1322' } : { color: '#3f8600' }">
                        <template #prefix v-if="dailyYear < 0 ? false : true">
                            <arrow-up-outlined />
                        </template>
                        <template #prefix v-if="dailyYear < 0 ? true : false">
                            <arrow-down-outlined />
                        </template>
                    </a-statistic>
                </div>

            </a-col>
            <a-col :span="6">
                <div class="statistic-div">
                    <a-statistic title="公共资源总数" :value="userPublicSum" valueStyle="font-size:30px;" />
                    {{ }}
                </div>
            </a-col>
            <a-col :span="6">
                <div class="statistic-div">
                    <a-statistic title="管理员总数" :value="bigManagerTotal" style="" valueStyle="font-size:30px;" />

                </div>
            </a-col>
            <a-col :span="6">
                <div class="statistic-div">
                    <a-statistic title="异常账号率" :precision="2" suffix="%" :value="abnormalRate" style=""
                        valueStyle="font-size:30px;" />
                    <div class="progress-content">
                        <a-progress :percent="abnormalRate" :showInfo="false" size="small" strokeColor="#FF4D4F" />
                    </div>
                </div>

            </a-col>
        </a-row>

        <div class="tabs-content">
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="1" tab="用户量" forceRender="true">
                    <div class="tabs-show">
                        <div id="tabs-bar">

                        </div>
                        <div class="tab-sort">
                            <p style="font-size: 17px;">登录次数排行</p>
                            <a-list item-layout="horizontal" :data-source="dataTab">
                                <template #renderItem="{ item, index }">
                                    <a-list-item>
                                        <a-list-item-meta>
                                            <template #title>
                                                <span>{{ item.username }}</span>
                                            </template>
                                            <template #avatar>
                                                <a-avatar
                                                    :style="index < 3 ? { backgroundColor: '#54585F', color: 'white' } : { backgroundColor: 'white', color: 'black' }">{{
                                                        index
                                                        + 1 }}</a-avatar>
                                            </template>


                                        </a-list-item-meta>
                                        <template #extra>
                                            <span>{{ item.loginTotal }}次</span>
                                        </template>
                                    </a-list-item>
                                </template>
                            </a-list>
                        </div>
                    </div>
                </a-tab-pane>
                <a-tab-pane key="2" disabled="false" tab="贡献量" forceRender="true">贡献量</a-tab-pane>
                <template #tabBarExtraContent>
                    <a-space :size="32">
                        <a @click="showdatamonth">月周期</a>
                        <a @click="showdatayear">年周期</a>
                        <a-range-picker v-model:value="value1" :placeholder="['开始时间', '结束时间']" disabled="true" />
                    </a-space>
                </template>
            </a-tabs>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons-vue';
import { UserTotalAPI, UserPublicSumAPI, UserAbnormalAPI, BigManagerTotalAPI, UserSortAPI } from '../../../api/backApi.js'
import * as echarts from 'echarts';
import { useCountStore } from '../../../stores/count.js'
import { endsWith } from 'lodash-es';
const counter = useCountStore();
onMounted(() => {


    initeCharts()

    UserTotalAPI().then((res) => {
        userTotal.value = res.data.length;
        counter.userlist = [...res.data]
    })
    UserPublicSumAPI().then((res) => {
        userPublicSum.value = res.data;
    })
    UserAbnormalAPI().then((res) => {
        userAbnormal.value = res.data;
    })
    BigManagerTotalAPI().then((res) => {
        bigManagerTotal.value = res.data;
    })
    UserSortAPI({ range: 7 }).then((res) => {
        console.log(res.data);
        dataTab.value = [...res.data]
        console.log(dataTab);

    })

})

//#region 总数的统计
const userTotal = ref();
const userPublicSum = ref();
const userAbnormal = ref();
const bigManagerTotal = ref();


const abnormalRate = computed(() => {
    return (userAbnormal.value / userTotal.value) * 100;
})

const dailyYear = computed(() => {
    let dailyDatas = counter.userlist.map(v => new Date(v.createTime))
    let date = new Date()
    var newdate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    var predate = (date.getFullYear() - 1) + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    var dailyResuilt = {};
    dailyResuilt[newdate] = 0;
    dailyResuilt[predate] = 0
    dailyDatas.forEach((el) => {
        let newdate1 = el.getFullYear() + '-' + (el.getMonth() + 1) + '-' + el.getDate()
        if (newdate1 == newdate) {
            dailyResuilt[newdate]++;
        }
        if (newdate1 == predate) {
            dailyResuilt[predate]++;
        }
    })
    if (dailyResuilt[predate] == 0) {
        return dailyResuilt[newdate] * 100
    }

    return (dailyResuilt[newdate] - dailyResuilt[predate]) / dailyResuilt[predate] * 100;
})
// #endregion


//#region 统计柱形图
let date = new Date();
let endTime = date.getFullYear()
console.log(endTime);

const activeKey = ref('1')
// 基于准备好的dom，初始化echarts实例
const initeCharts = () => {
    console.log("执行init");
    var myChart = echarts.init(document.getElementById('tabs-bar'));

    myChart.setOption({
        title: {
            text: '注册的用户量'
        },
        tooltip: {},
        xAxis: {
            data: []
        },
        yAxis: {},
        series: [
            {
                name: '注册的用户量',
                type: 'bar',
                data: []
            }
        ]
    });
    UserTotalAPI({ endTime: endTime }).then((res) => {
        console.log("柱形图数据");
        console.log(res.data);
        let newdata = {}
        let dates = res.data.map(v => new Date(v.createTime))
        dates.sort((a, b) => {
            return a - b;
        })
        dates.forEach(element => {
            let month = (element.getMonth() + 1) + '月'
            if (newdata[month]) {
                newdata[month]++;
            } else {
                newdata[month] = 1;
            }

        });
        myChart.setOption({
            xAxis: {
                data: [...Object.keys(newdata)]
            },
            series: [
                {
                    name: '注册的用户量',
                    type: 'bar',
                    color: '#3AA0FF',
                    data: [...Object.values(newdata)]
                }
            ]
        })

    })
}
//点击年按钮改变数据
const showdatayear = () => {
    var myChart = echarts.init(document.getElementById('tabs-bar'));
    let userlist = {}
    let userdatas = counter.userlist.map(v => new Date(v.createTime))
    userdatas.sort((a, b) => {
        return a - b;
    })

    userdatas.forEach((el) => {
        const year = el.getFullYear() + '年';
        if (userlist[year]) {
            userlist[year]++
        } else {
            userlist[year] = 1
        }
    })
    myChart.setOption({
        xAxis: {
            data: [...Object.keys(userlist)]
        },
        series: [
            {
                name: '注册的用户量',
                type: 'bar',
                color: '#3AA0FF',
                data: [...Object.values(userlist)]
            }
        ]
    })

}

const showdatamonth = () => {
    initeCharts()
}
//#endregion

//#region 登录次数排行排
let dataTab = ref([])

//#endregion

</script>

<style scoped>
#analyst-content {
    background-color: rgb(240, 242, 245);
    height: 900px;
    margin: -25px;
    padding: 20px;
}

.statistic-div {
    background-color: rgb(255, 255, 255);
    height: 150px;
    margin: 15px;
    padding: 10px;
}

.progress-content {
    margin-top: 10px;
}

.tabs-content {
    background-color: rgb(255, 255, 255);
    margin: 15px;
    font-size: 25px;
}

.tabs-show {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
}

#tabs-bar {
    width: 70%;
    height: 400px;
}

.tab-sort {
    width: 28%;
}
</style>