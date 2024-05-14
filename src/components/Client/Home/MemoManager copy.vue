<template>
    <div class="memo-content">
        <a-row>
            <a-col :span="7" offset="2">
                <a-tabs v-model:activeKey="activeKey" @change="ismemoAndTaskMethod">

                    <a-tab-pane key="1" tab="灵感录">
                        <div class="memo-content-left">
                            <div class="memo-input">
                                <a-row style="margin: 20px 5px 0px 5px; ">
                                    <!-- <a-col :span="2" offset="1">
                                        <picture-outlined style="font-size: 20px;"></picture-outlined>
                                    </a-col> -->
                                    <a-col :span="2" offset="1" @click="addmemo(listFromState.memodatas)">
                                        <carry-out-outlined style="font-size: 20px;"></carry-out-outlined>
                                    </a-col>
                                </a-row>
                                <div class="memo-input-content" @click="refIndex = -1">
                                    <!-- <button @click="getContent">获取内容</button> -->
                                    <a-input @change="addmemotext(listFromState.memodatas)" :bordered="false"
                                        v-if="listFromState.memodatas.length == 0" placeholder="记你想记得..." auto-size>

                                    </a-input>
                                    <a-row type="flex" justify="center" align="top"
                                        v-for="(item, index) in listFromState.memodatas" :key="index">
                                        <a-col :span="2" v-if="!item.isCheck" style="padding-top: 6px;">
                                            <a-checkbox v-model:checked="item.firstcheck"></a-checkbox>
                                        </a-col>
                                        <a-col :span="21">
                                            <div @keyup.delete="deleteCheckbox(index, listFromState.memodatas)"
                                                @keyup.enter="addmemoEnter(index, listFromState.memodatas)"
                                                id="memo-textarea" @keydown.enter.prevent contenteditable="true"
                                                v-contenteditable:[index]="{ lastinput: item.lastinput, data: listFromState.memodatas }"
                                                :ref="refIndex == -1 ? 'itemRefs' : ''">
                                            </div>

                                        </a-col>
                                    </a-row>
                                </div>
                                <a-row>
                                    <a-col :span="11" offset="1">
                                        <a-popover title="为你的灵感添加标签" trigger="click" placement="topLeft">
                                            <template #content>
                                                <a-row>
                                                    <a-col :span="22">
                                                        <a-input style="padding: 4px;" v-model:value="valueTag"
                                                            :bordered="false" placeholder="Borderless"
                                                            @change="showOldTag" />
                                                    </a-col>
                                                </a-row>
                                                <a-row v-if="!isShowOldTag">
                                                    <a-col :span="22" @click="addNewTag(NewdataListTag)">
                                                        <a-button type="text" block="true">
                                                            <plus-outlined></plus-outlined>
                                                            创建标签：{{ valueTag }}
                                                        </a-button>
                                                    </a-col>
                                                </a-row>
                                                <a-row v-if="isShowOldTag"
                                                    style="margin-top: 10px; margin-bottom: 10px; padding-left: 2px;">
                                                    <a-col :span="18">
                                                        <span style="font-size: 10px;">以下是标签</span>
                                                    </a-col>
                                                </a-row>
                                                <div class="scroll-oldTag" v-if="isShowOldTag">
                                                    <a-list size="small" item-layout="horizontal"
                                                        :data-source="OlddataListTag">
                                                        <template #renderItem="{ item }">
                                                            <a-list-item style="margin-top: 5px; cursor: pointer;"
                                                                @click="oldAddNewTag(item, NewdataListTag)">
                                                                {{ item }}
                                                            </a-list-item>
                                                        </template>
                                                    </a-list>
                                                </div>

                                            </template>

                                            <a-button shape="round">
                                                <a-space>
                                                    <plus-outlined />
                                                    <span>添加标签</span>
                                                </a-space>
                                            </a-button>
                                        </a-popover>
                                    </a-col>
                                </a-row>
                                <div class="showTag">
                                    <a-tag closable @close="deleteNewTag(index, NewdataListTag)"
                                        v-for="(item, index) in  NewdataListTag " :color="colorTag[index]">
                                        {{ item }}
                                    </a-tag>
                                </div>
                            </div>
                            <a-row>
                                <a-col :span="2">
                                    <a-button type="primary" @click="addMemoNode">小灵一下</a-button>
                                </a-col>
                            </a-row>
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="任务录" force-render>
                        <div class="task-content-left">
                            <a-row>
                                <a-col :span="3">
                                    <a-button type="primary" @click="addTaskItem">
                                        <plus-outlined />
                                        添加
                                    </a-button>
                                    <a-modal v-model:visible="visibleAdd" title="新建任务" @ok="handleOkAdd" okText="确定"
                                        cancelText="取消">
                                        <a-row>
                                            <a-col :span="12" style="border-bottom: 1px solid black;">
                                                <a-input v-model:value="NewtaskNoedata.taskName" :bordered="false"
                                                    placeholder="请输入任务名称" />
                                            </a-col>
                                        </a-row>
                                        <a-row style="margin-top: 20px;">
                                            <a-radio-group v-model:value="NewtaskNoedata.taskDirection"
                                                button-style="solid">
                                                <a-space>
                                                    <a-radio-button value="倒计时"
                                                        @click="lastTimeShow = true">倒计时</a-radio-button>
                                                    <a-radio-button value="正向计时"
                                                        @click="lastTimeShow = false">正向计时</a-radio-button>
                                                </a-space>
                                            </a-radio-group>
                                        </a-row>
                                        <a-row style="margin-top: 20px;">
                                            <a-radio-group v-model:value="NewtaskNoedata.taskTime" v-if="lastTimeShow">
                                                <a-space>
                                                    <a-radio-button :value="25"
                                                        @click="isSelect = false">25分钟</a-radio-button>
                                                    <a-radio-button :value="60"
                                                        @click="isSelect = false">60分钟</a-radio-button>
                                                    <a-popover title="自定义时间" trigger="click" v-model:visible="visibleMyTime"
                                                        @click="NewtaskNoedata.taskTime = null">
                                                        <template #content>
                                                            <a-input-number v-model:value="myTime" :bordered="false"
                                                                placeholder="请输入想要的时间"></a-input-number>
                                                            <a-button type="text" @click="confirmMyTime">确定</a-button>
                                                        </template>
                                                        <a-button type="" :value="myTime" :class="{ selected: isSelect }">{{
                                                            myTime
                                                            ?
                                                            myTime + '分钟' : '自定义' }}
                                                        </a-button>
                                                    </a-popover>
                                                </a-space>
                                            </a-radio-group>
                                        </a-row>
                                    </a-modal>
                                </a-col>
                            </a-row>
                            <div class="task-list-left">
                                <div class="task-item-left" style="cursor: pointer;" v-for="(item, index) in  taskNowdata  "
                                    :style="{ backgroundImage: `url(${item.taskBackImg})` }">
                                    <a-row>
                                        <a-col :span="16" @click="showEditTaskShowModal(item, index)">
                                            <a-typography-title style="color: white;" :level="5"
                                                :delete="item.taskStatus == 2 ? ture : false">{{
                                                    item.taskName
                                                }}</a-typography-title>
                                            <a-typography-text style="color: white;">
                                                <a-space>
                                                    <span> {{ item.taskDirection == '正向计时' ?
                                                        '正向计时' : item.taskTime + '分钟' }}
                                                    </span>
                                                    <span>{{ item.finshStatus.length }}</span>
                                                </a-space>
                                            </a-typography-text>
                                        </a-col>
                                        <a-col :span="4">
                                            <a-popconfirm title="准备好开始计时吗？" ok-text="是的" cancel-text="取消"
                                                @confirm="startTime(item, index)" @cancel="cancel">
                                                <a-button type="text" v-if="taskStartShow !== index"
                                                    style="margin-top: 10px; color: white;">开始</a-button>
                                            </a-popconfirm>

                                            <div class="process-task" v-if="taskStartShow == index">
                                                <!-- <a-progress type="circle" :percent="(alreadySecond / item.taskTime * 60)"
                                                    :width="50" v-if="item.taskDirection == '倒计时'" />
                                                <a-progress type="circle" :percent="2" :width="50"
                                                    v-if="item.taskDirection == '正向计时'" /> -->
                                                <!-- <a-statistic-countdown title="" v-if="item.taskDirection == '倒计时'"
                                                    :value="countDownTime" valueStyle="color:white" @finish="onFinish"
                                                    format="mm:ss" ref="countRef" /> -->
                                                <div class="countdown-time" v-if="item.taskDirection == '倒计时'">
                                                    <span>{{ countdownTime }}</span>
                                                </div>
                                                <div class="forward-time" v-if="item.taskDirection == '正向计时'">
                                                    <span>{{ forwardTime }}</span>
                                                </div>
                                            </div>
                                        </a-col>
                                        <a-col :span="4" style="color: white; padding-left: 15px;"
                                            v-if="taskStartShow == index">
                                            <div>
                                                <a-popover title="编辑时间" trigger="hover" placement="right">
                                                    <template #content>
                                                        <a-row>
                                                            <a-space>
                                                                <a-button type="primary" size="small"
                                                                    @click="resetTask(index, item)">重置</a-button>
                                                                <a-button type="primary" size="small"
                                                                    @click="aheadfinsh(index, item)">提前完成</a-button>
                                                            </a-space>
                                                        </a-row>
                                                    </template>

                                                    <!-- <close-outlined @click="taskStartShow = -1"
                                                style="color: white;"></close-outlined> -->
                                                    <span style="position: relative; top: -2px;">更多</span>
                                                    <double-right-outlined
                                                        style="color: white; font-size: 20px; margin-top: 19px; " />

                                                </a-popover>
                                            </div>
                                        </a-col>

                                    </a-row>
                                    <a-modal v-model:visible="visibleEditShowTask" title="任务详情" @ok="handleOkShowEdit"
                                        :width="400" okText="确定" cancelText="取消" :footer="true">
                                        <a-row>
                                            <a-col :span="5" offset="3"><a-button type="primary"
                                                    @click="showEditTaskModal(editCurrentTask.taskuuid)">
                                                    编辑</a-button></a-col>
                                            <a-modal v-model:visible="visibleEditTask" title="编辑任务" @ok="handleOkEdit"
                                                okText="确定" cancelText="取消">
                                                <a-form :model="editShowData" autocomplete="off" name="taskbasic">
                                                    <a-form-item label="任务名称">
                                                        <a-input v-model:value="editShowData.taskName" :bordered="false"
                                                            placeholder="请输入" />

                                                    </a-form-item>
                                                    <a-form-item label="任务类型">
                                                        <a-radio-group v-model:value="editShowData.taskDirection"
                                                            name="radioGroupEdit" button-style="solid">
                                                            <a-radio value="倒计时">倒计时</a-radio>
                                                            <a-radio value="正向计时">正向计时</a-radio>

                                                        </a-radio-group>
                                                    </a-form-item>
                                                    <a-form-item label="任务时间(分钟)"
                                                        v-if="editShowData.taskDirection == '倒计时' ? true : false">
                                                        <a-input-number
                                                            v-model:value="editShowData.taskTime"></a-input-number>
                                                    </a-form-item>
                                                </a-form>
                                            </a-modal>
                                            <a-col :span="5" offset="6">
                                                <a-popconfirm title="确定删除任务吗" ok-text="Yes" cancel-text="No"
                                                    @confirm="deleteTask(editCurrentTask.taskuuid)" @cancel="cancel">
                                                    <a-button danger>删除</a-button>
                                                </a-popconfirm>
                                            </a-col>
                                        </a-row>
                                        <div style="background: #ececec; padding: 15px;margin-top: 30px;">
                                            <a-row>
                                                <a-col :span="10" offset="1">
                                                    <a-card size="small">
                                                        <a-statistic title="完成次数"
                                                            :value="editCurrentTask.finshStatus.length"
                                                            valueStyle="font-size:22px" style="margin-right: 20px">
                                                            <template #prefix>
                                                                <arrow-up-outlined />
                                                            </template>
                                                        </a-statistic>
                                                    </a-card>
                                                </a-col>
                                                <a-col :span="10" offset="2">
                                                    <a-card size="small">
                                                        <a-statistic title="完成总时长" :value="finshStatusTotal"
                                                            valueStyle="font-size:22px" style="margin-right: 20px">
                                                            <template #prefix>
                                                                <my-icon type="icon-time-circle-fill"></my-icon>
                                                            </template>
                                                        </a-statistic>
                                                    </a-card>
                                                </a-col>
                                            </a-row>

                                        </div>
                                    </a-modal>
                                </div>

                            </div>
                            <a-row style="margin-top: 10px;">
                                <a-col :span="3">
                                    <a-button type="primary" @click="fileTaskList()">归档新建</a-button>
                                </a-col>
                            </a-row>
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </a-col>
            <a-col v-if="!ismemoAndTask" :span="13" offset="1" style="background-color: rgb(250, 250, 250);">
                <a-row style="margin-bottom: 15px;">
                    <a-col :span="4"><span style="font-size: 19px;">目录</span></a-col>
                    <a-col :span="2" offset="18" style="text-align: center;">
                        <a-dropdown :trigger="['click']" placement="bottomRight">
                            <a class="ant-dropdown-link" @click.prevent>
                                <filter-outlined />
                            </a>
                            <template #overlay>
                                <a-menu>
                                    <a-menu-item key="0" @click="forwardmemo">
                                        <a>小灵</a>
                                    </a-menu-item>
                                    <a-menu-item key="1" @click="memoFile">
                                        <a>已归档</a>
                                    </a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </a-col>
                </a-row>

                <div class="tag-manager">
                    <a-row>
                        <a-col :span="22"> <a-space :size="15">
                                <a-button :siz="large" type=""
                                    v-for=" item in  !showMemoFile ? memoTagThree : memoFileTagThree "
                                    @click="findMemoByTag(Object.keys(item)[0])">
                                    {{ Object.keys(item)[0] }}({{ Object.values(item)[0] }})</a-button>

                                <a-button :size="large" shape="round" type="" @click="findMemoAll"><my-icon
                                        type="icon-tag-delete"></my-icon>无标签</a-button>

                            </a-space></a-col>
                        <a-col :span="1" offset="1">
                            <a-tooltip>
                                <template #title>标签管理</template>
                                <my-icon type="icon-tag1"> </my-icon>
                            </a-tooltip>
                        </a-col>
                    </a-row>


                </div>
                <div v-if="!showMemoFile" class="memo-content-right-boder">
                    <div class="memo-content-right">
                        <div class="memo-content-right-top">
                            <a-collapse :bordered="false">
                                <a-collapse-panel key="1" header="置顶">
                                    <a-list item-layout="vertical" size="large" :pagination="pagination"
                                        :data-source="memoListTop">
                                        <template #renderItem="{ item, index }">
                                            <a-row v-on:mouseenter="isShowEdit(index)"
                                                v-on:mouseleave="isHidderEdit(index)">

                                                <a-col :span="21">
                                                    <a-list-item key="item._id"
                                                        :class="showedit == index ? 'div-shadow' : ''"
                                                        class="effect-border">
                                                        <template #actions style="margin-top: 6px;"
                                                            v-if="isEditContent != index">
                                                            <a-space>
                                                                <a-tag
                                                                    v-for="(      text, index      ) in       item.memoListTag      "
                                                                    :key="index" :color="colorTag[index]">
                                                                    {{ text }}
                                                                </a-tag>
                                                            </a-space>
                                                        </template>
                                                        <a-list-item-meta :description="item.createTime">

                                                        </a-list-item-meta>
                                                        <div style="padding: 2px; cursor: text;">
                                                            <a-row v-if="isEditContent != index" align="middle"
                                                                v-for="(      item, index      ) in       item.memoList      "
                                                                :key="index">
                                                                <a-col :span="1" v-if="!item.isCheck">
                                                                    <a-checkbox
                                                                        v-model:checked="item.firstcheck"></a-checkbox>
                                                                </a-col>
                                                                <a-col :span="21">
                                                                    <div id="memo-textarea" @keydown.enter.prevent
                                                                        contenteditable="false"
                                                                        v-contenteditable:[index]="{ lastinput: item.lastinput, data: item.memoList }">
                                                                    </div>
                                                                </a-col>
                                                            </a-row>
                                                            <div class="edit-content" v-if="isEditContent == index">
                                                                <a-row style="margin: 20px 5px 0px 5px; ">
                                                                    <!-- <a-col :span="1" offset="1">
                                                                        <picture-outlined
                                                                            style="font-size: 20px;"></picture-outlined>
                                                                    </a-col> -->
                                                                    <a-col :span="1" offset="1"
                                                                        @click="addmemo(item.memoList)">
                                                                        <carry-out-outlined
                                                                            style="font-size: 20px;"></carry-out-outlined>
                                                                    </a-col>
                                                                </a-row>
                                                                <div class="" @click="refIndex = index"
                                                                    style="padding: 25px;">
                                                                    <!-- <button @click="getContent">获取内容</button> -->
                                                                    <a-row type="flex" justify="center" align="top"
                                                                        v-for="(      el, elindex      ) in       item.memoList      "
                                                                        :key="elindex">
                                                                        <a-col :span="1" v-if="!el.isCheck"
                                                                            style="padding-top: 6px;">
                                                                            <a-checkbox
                                                                                v-model:checked="el.firstcheck"></a-checkbox>
                                                                        </a-col>
                                                                        <a-col :span="21">
                                                                            <div @keyup.delete="deleteCheckbox(elindex, item.memoList)"
                                                                                @keyup.enter="addmemoEnter(elindex, item.memoList)"
                                                                                id="memo-textarea" @keydown.enter.prevent
                                                                                contenteditable="true"
                                                                                v-contenteditable:[elindex]="{ lastinput: el.lastinput, data: item.memoList }"
                                                                                :ref="refIndex == index ? 'itemRefs' : ''">

                                                                            </div>
                                                                        </a-col>
                                                                    </a-row>
                                                                </div>
                                                                <a-row>
                                                                    <a-col :span="11" offset="1">
                                                                        <a-popover title="为你的灵感添加标签" trigger="click"
                                                                            placement="topLeft">
                                                                            <template #content>
                                                                                <a-row>
                                                                                    <a-col :span="22">
                                                                                        <a-input style="padding: 4px;"
                                                                                            v-model:value="valueTag"
                                                                                            :bordered="false"
                                                                                            placeholder="Borderless"
                                                                                            @change="showOldTag" />
                                                                                    </a-col>
                                                                                </a-row>
                                                                                <a-row v-if="!isShowOldTag">
                                                                                    <a-col :span="22"
                                                                                        @click="addNewTag(item.memoListTag)">
                                                                                        <a-button type="text" block="true">
                                                                                            <plus-outlined></plus-outlined>
                                                                                            创建标签：{{ valueTag }}
                                                                                        </a-button>
                                                                                    </a-col>
                                                                                </a-row>
                                                                                <a-row v-if="isShowOldTag"
                                                                                    style="margin-top: 10px; margin-bottom: 10px; padding-left: 2px;">
                                                                                    <a-col :span="18">
                                                                                        <span
                                                                                            style="font-size: 10px;">以下是标签</span>
                                                                                    </a-col>
                                                                                </a-row>
                                                                                <div class="scroll-oldTag"
                                                                                    v-if="isShowOldTag">
                                                                                    <a-list size="small"
                                                                                        item-layout="horizontal"
                                                                                        :data-source="OlddataListTag">
                                                                                        <template #renderItem="{ item }">
                                                                                            <a-list-item
                                                                                                style="margin-top: 5px; cursor: pointer;"
                                                                                                @click="oldAddNewTag(item, memoListTop[index].memoListTag)">
                                                                                                {{ item }}
                                                                                            </a-list-item>
                                                                                        </template>
                                                                                    </a-list>
                                                                                </div>

                                                                            </template>

                                                                            <a-button shape="round">
                                                                                <a-space>
                                                                                    <plus-outlined />
                                                                                    <span>添加标签</span>
                                                                                </a-space>
                                                                            </a-button>
                                                                        </a-popover>
                                                                    </a-col>
                                                                </a-row>
                                                                <div class="showTag">
                                                                    <a-tag closable
                                                                        @close="deleteNewTag(index, item.memoListTag)"
                                                                        v-for="(      itemShowTag, index      ) in        item.memoListTag       "
                                                                        :color="colorTag[index]">
                                                                        {{ itemShowTag }}
                                                                    </a-tag>
                                                                </div>
                                                                <a-row style="margin-top: 10px;">
                                                                    <a-col :span="3">
                                                                        <a-button type="primary"
                                                                            @click="editMemo(item, '1')">完成</a-button>
                                                                    </a-col>
                                                                </a-row>
                                                            </div>
                                                        </div>


                                                    </a-list-item>

                                                </a-col>
                                                <a-col :span="2" v-if="showedit == index"
                                                    style=" margin-left: 5px; margin-top: 30px;">
                                                    <a-space direction="vertical">
                                                        <a-button type=""
                                                            @click="isShowEditContetn(index)"><edit-outlined /></a-button>
                                                        <div>
                                                            <a-popover placement="bottomLeft" :overlayStyle="{ zIndex: 2 }"
                                                                :getPopupContainer="(triggerNode) => triggerNode.parentNode">
                                                                <template #content>
                                                                    <a-space direction="vertical">
                                                                        <a-button size="small" type="text"
                                                                            @click="updateMemoTop(item._id, 0)">取消置顶</a-button>
                                                                        <a-button size="small" type="text"
                                                                            @click="updatefileMemo(item._id)">归档</a-button>
                                                                        <a-button size="small" type="text"
                                                                            @click="deleteMemo(item._id)">删除</a-button>
                                                                    </a-space>


                                                                </template>
                                                                <a-button type=""><more-outlined /></a-button>
                                                            </a-popover>
                                                        </div>


                                                    </a-space>
                                                </a-col>
                                            </a-row>
                                        </template>
                                    </a-list>

                                </a-collapse-panel>
                            </a-collapse>

                        </div>
                        <div class="memo-right-list">
                            <a-row style="margin-bottom: 15px;">
                                <a-col :span="2" style="font-weight: 600;">小灵</a-col>
                            </a-row>
                            <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="memoList">
                                <template #renderItem="{ item, index }">
                                    <a-row v-on:mouseenter="isShowEdit(index)" v-on:mouseleave="isHidderEdit(index)">

                                        <a-col :span="21">
                                            <a-list-item key="item._id" :class="showedit == index ? 'div-shadow' : ''"
                                                class="effect-border">
                                                <template #actions style="margin-top: 6px;" v-if="isEditContent1 != index">
                                                    <a-space>
                                                        <a-tag
                                                            v-for="(      text, index      ) in       item.memoListTag      "
                                                            :key="index" :color="colorTag[index]">
                                                            {{ text }}
                                                        </a-tag>
                                                    </a-space>
                                                </template>
                                                <a-list-item-meta :description="item.createTime">

                                                </a-list-item-meta>
                                                <div style="padding: 2px; cursor: text;">
                                                    <a-row v-if="isEditContent1 != index" align="middle"
                                                        v-for="(      item, index      ) in       item.memoList      "
                                                        :key="index">
                                                        <a-col :span="1" v-if="!item.isCheck">
                                                            <a-checkbox v-model:checked="item.firstcheck"></a-checkbox>
                                                        </a-col>
                                                        <a-col :span="21">
                                                            <div id="memo-textarea" @keydown.enter.prevent
                                                                contenteditable="false"
                                                                v-contenteditable:[index]="{ lastinput: item.lastinput, data: item.memoList }">
                                                            </div>
                                                        </a-col>
                                                    </a-row>
                                                    <div class="edit-content" v-if="isEditContent1 == index">
                                                        <a-row style="margin: 20px 5px 0px 5px; ">
                                                            <!-- <a-col :span="1" offset="1">
                                                                <picture-outlined
                                                                    style="font-size: 20px;"></picture-outlined>
                                                            </a-col> -->
                                                            <a-col :span="1" offset="1" @click="addmemo(item.memoList)">
                                                                <carry-out-outlined
                                                                    style="font-size: 20px;"></carry-out-outlined>
                                                            </a-col>
                                                        </a-row>
                                                        <div class="" @click="refIndex = index" style="padding: 25px;">
                                                            <!-- <button @click="getContent">获取内容</button> -->
                                                            <a-row type="flex" justify="center" align="top"
                                                                v-for="(      el, elindex      ) in       item.memoList      "
                                                                :key="elindex">
                                                                <a-col :span="1" v-if="!el.isCheck"
                                                                    style="padding-top: 6px;">
                                                                    <a-checkbox
                                                                        v-model:checked="el.firstcheck"></a-checkbox>
                                                                </a-col>
                                                                <a-col :span="21">
                                                                    <div @keyup.delete="deleteCheckbox(elindex, item.memoList)"
                                                                        @keyup.enter="addmemoEnter(elindex, item.memoList)"
                                                                        id="memo-textarea" @keydown.enter.prevent
                                                                        contenteditable="true"
                                                                        v-contenteditable:[elindex]="{ lastinput: el.lastinput, data: item.memoList }"
                                                                        :ref="refIndex == index ? 'itemRefs' : ''">

                                                                    </div>
                                                                </a-col>
                                                            </a-row>
                                                        </div>
                                                        <a-row>
                                                            <a-col :span="11" offset="1">
                                                                <a-popover title="为你的灵感添加标签" trigger="click"
                                                                    placement="topLeft">
                                                                    <template #content>
                                                                        <a-row>
                                                                            <a-col :span="22">
                                                                                <a-input style="padding: 4px;"
                                                                                    v-model:value="valueTag"
                                                                                    :bordered="false"
                                                                                    placeholder="Borderless"
                                                                                    @change="showOldTag" />
                                                                            </a-col>
                                                                        </a-row>
                                                                        <a-row v-if="!isShowOldTag">
                                                                            <a-col :span="22"
                                                                                @click="addNewTag(item.memoListTag)">
                                                                                <a-button type="text" block="true">
                                                                                    <plus-outlined></plus-outlined>
                                                                                    创建标签：{{ valueTag }}
                                                                                </a-button>
                                                                            </a-col>
                                                                        </a-row>
                                                                        <a-row v-if="isShowOldTag"
                                                                            style="margin-top: 10px; margin-bottom: 10px; padding-left: 2px;">
                                                                            <a-col :span="18">
                                                                                <span style="font-size: 10px;">以下是标签</span>
                                                                            </a-col>
                                                                        </a-row>
                                                                        <div class="scroll-oldTag" v-if="isShowOldTag">
                                                                            <a-list size="small" item-layout="horizontal"
                                                                                :data-source="OlddataListTag">
                                                                                <template #renderItem="{ item }">
                                                                                    <a-list-item
                                                                                        style="margin-top: 5px; cursor: pointer;"
                                                                                        @click="oldAddNewTag(item, memoList[index].memoListTag)">
                                                                                        {{ item }}
                                                                                    </a-list-item>
                                                                                </template>
                                                                            </a-list>
                                                                        </div>

                                                                    </template>

                                                                    <a-button shape="round">
                                                                        <a-space>
                                                                            <plus-outlined />
                                                                            <span>添加标签</span>
                                                                        </a-space>
                                                                    </a-button>
                                                                </a-popover>
                                                            </a-col>
                                                        </a-row>
                                                        <div class="showTag">
                                                            <a-tag closable @close="deleteNewTag(index, item.memoListTag)"
                                                                v-for="(      itemShowTag, index      ) in        item.memoListTag       "
                                                                :color="colorTag[index]">
                                                                {{ itemShowTag }}
                                                            </a-tag>
                                                        </div>
                                                        <a-row style="margin-top: 10px;">
                                                            <a-col :span="3">
                                                                <a-button type="primary"
                                                                    @click="editMemo(item, '2')">完成</a-button>
                                                            </a-col>
                                                        </a-row>
                                                    </div>
                                                </div>


                                            </a-list-item>
                                        </a-col>
                                        <a-col :span="2" v-if="showedit == index"
                                            style=" margin-left: 5px; margin-top: 30px;">
                                            <a-space direction="vertical">
                                                <a-button type=""
                                                    @click="isShowEditContetn1(index)"><edit-outlined /></a-button>
                                                <div>
                                                    <a-popover placement="bottomLeft" :overlayStyle="{ zIndex: 2 }"
                                                        :getPopupContainer="(triggerNode) => triggerNode.parentNode">
                                                        <template #content>
                                                            <a-space direction="vertical">
                                                                <a-button size="small" type="text"
                                                                    @click="updateMemoTop(item._id, 1)">置顶</a-button>
                                                                <a-button size="small" type="text"
                                                                    @click="updatefileMemo(item._id)">归档</a-button>
                                                                <a-button size="small" type="text"
                                                                    @click="deleteMemo(item._id)">删除</a-button>
                                                            </a-space>


                                                        </template>
                                                        <a-button type=""><more-outlined /></a-button>
                                                    </a-popover>
                                                </div>


                                            </a-space>
                                        </a-col>
                                    </a-row>
                                </template>
                            </a-list>
                        </div>
                    </div>
                </div>
                <div v-if="showMemoFile" class="memofile-content-right-boder">
                    <a-row style="margin-bottom: 10px; margin-top: 15px;">
                        <a-col :span="4" style="font-weight: 600;">已归档小灵</a-col>
                    </a-row>
                    <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="memoFileList">
                        <template #renderItem="{ item, index }">
                            <a-row v-on:mouseenter="isShowEdit(index)" v-on:mouseleave="isHidderEdit(index)">
                                <a-col :span="21">
                                    <a-list-item key="item._id" :class="showedit == index ? 'div-shadow' : ''"
                                        class="effect-border">
                                        <template #actions style="margin-top: 6px;" v-if="isEditContent1 != index">
                                            <a-space>
                                                <a-tag v-for="(      text, index      ) in       item.memoListTag      "
                                                    :key="index" :color="colorTag[index]">
                                                    {{ text }}
                                                </a-tag>
                                            </a-space>
                                        </template>
                                        <a-list-item-meta :description="item.createTime">

                                        </a-list-item-meta>
                                        <div style="padding: 2px; cursor: text;">
                                            <a-row align="middle"
                                                v-for="(      item, index      ) in       item.memoList      " :key="index">
                                                <a-col :span="1" v-if="!item.isCheck">
                                                    <a-checkbox v-model:checked="item.firstcheck"></a-checkbox>
                                                </a-col>
                                                <a-col :span="21">
                                                    <div id="memo-textarea" @keydown.enter.prevent contenteditable="false"
                                                        v-contenteditable:[index]="{ lastinput: item.lastinput, data: item.memoList }">
                                                    </div>
                                                </a-col>
                                            </a-row>

                                        </div>


                                    </a-list-item>
                                </a-col>
                                <a-col :span="2" v-if="showedit == index" style=" margin-left: 5px; margin-top: 30px;">
                                    <a-space direction="vertical">
                                        <div>
                                            <a-popover placement="bottomLeft" :overlayStyle="{ zIndex: 2 }"
                                                :getPopupContainer="(triggerNode) => triggerNode.parentNode">
                                                <template #content>
                                                    <a-space direction="vertical">
                                                        <a-button size="small" type="text"
                                                            @click="cancelMemoFile(item._id)">取消归档</a-button>
                                                        <a-button size="small" type="text"
                                                            @click="deleteMemoFile(item._id)">删除</a-button>
                                                    </a-space>


                                                </template>
                                                <a-button type=""><more-outlined /></a-button>
                                            </a-popover>
                                        </div>


                                    </a-space>
                                </a-col>
                            </a-row>
                        </template>
                    </a-list>
                </div>
            </a-col>

            <a-col v-if="ismemoAndTask" :span="13">
                <div class="task-content-right">
                    <h3>归档的任务</h3>
                    <div class="taskitem-content">
                        <a-card :title="el.createTime" hoverable :bordered="false" style="width: 100%;margin-top: 20px;"
                            v-for="(el, index) in fileTaskData" :headStyle="fileBackColor[el.performance]">
                            <template #extra>
                                完成情况：{{ fileBackColorText[el.performance] }}
                            </template>
                            <template #cover>

                            </template>
                            <template #actions>
                                <a-row>
                                    <a-col :span="4" offset="20">
                                        <a-popconfirm title="确定删除吗？" ok-text="确定" cancel-text="取消"
                                            @confirm="confirmDeleteFileTask(el._id)" @cancel="cancel">
                                            <a-button type="" shape="round" size="small"><close-outlined />删除</a-button>
                                        </a-popconfirm>
                                    </a-col>
                                </a-row>
                            </template>
                            <!-- <a-card-meta :title="'任务名称：' + el.taskName" :description="'任务状态：' + el.taskDirection"
                                v-for="(el, index) in item.taskList"
                                style="margin-top: 10px; border-bottom: 1px solid grey; padding: 10px;">

                            </a-card-meta> -->
                            <a-list item-layout="horizontal" :data-source="el.taskList">
                                <template #renderItem="{ item }">
                                    <a-list-item>
                                        <a-list-item-meta :description="'任务方向：' + item.taskDirection">
                                            <template #title>
                                                任务名称：{{ item.taskName }}
                                            </template>

                                        </a-list-item-meta>
                                        <template #extra v-if="item.taskDirection == '倒计时' ? true : false">
                                            任务时间：{{ item.taskTime }}
                                        </template>
                                    </a-list-item>

                                </template>
                            </a-list>
                        </a-card>
                    </div>
                </div>
            </a-col>
        </a-row>

    </div>
</template>

<script setup>
import { CarryOutOutlined, CaretRightOutlined, FilterOutlined, PictureOutlined, PlusOutlined, EditTwoTone, CloseOutlined, createFromIconfontCN, EditOutlined, MoreOutlined, DoubleRightOutlined } from '@ant-design/icons-vue';
import { FindTagAPI, FileTaskListAPI, DeleteTaskAPI, DeleteTaskFileAPI, UpdateTaskAPI, FinshTaskAPI, AddMemoAPI, AddTaskListAPI, AddTaskAPI, ListMemoAPI, UpdateTopAPI, EditMemoAPI, FileMemoAPI, DeleteMemoAPI, FindListAPI, FindTaskAPI } from '../../../api/clientApi.js'
import { reactive, ref, onMounted, nextTick, computed, provide } from 'vue';
import { cloneDeep } from 'lodash-es';
import { message } from 'ant-design-vue';
import { useclientStore } from '../../../stores/count.js'

const counter = useclientStore()
const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4158111_1ruumo6bmni.js', // 在 iconfont.cn 上生成
});

onMounted(() => {
    FindTagAPI({ userId: counter.clientlogin.id, memoListStatus: 0 }).then(res => {
        //先进行排序
        const sortedEntries = Object.entries(res.data).sort((a, b) => b[1] - a[1]);
        const sortedObj = Object.fromEntries(sortedEntries);
        //做数据转化
        const result = Object.entries(sortedObj).map(([key, value]) => ({ [key]: value }));
        memoTagThree.value = result.slice(0, 3)
    })
    fethmemo({ userId: counter.clientlogin.id, memoListStatus: 0 })
    fethmemofile({ userId: counter.clientlogin.id, memoListStatus: 1 })
    fethtask({ userId: counter.clientlogin.id, taskListStatus: 0 })
    fethtaskfile({ userId: counter.clientlogin.id, taskListStatus: 1 })
    //继续倒计时
    continueCountDown()
    //继续正向计时
    continueTimer()


})
const ismemoAndTask = ref(false)
const ismemoAndTaskMethod = () => {
    ismemoAndTask.value = !ismemoAndTask.value
}


//#region 写入小灵
const activeKey = ref('1')
const itemRefs = ref(null)

const addmemotext = (data) => {
    data.push({
        firstcheck: false,
        lastinput: '',
        isCheck: true
    })
}

// const memovalue = ref('');
let listFromState = reactive({
    memodatas: []
})
//增加复选框，没有就增加，有就消失复选框
const addmemo = (data) => {
    if (data.length == 0) {
        data.push({
            firstcheck: false,
            lastinput: '',
            isCheck: false
        })
    } else {
        const newarr = data.pop();
        newarr.isCheck = !newarr.isCheck
        data.push(newarr)
    }

}
/**
 * 
 * @param {*} index 
 * 1.有数据，有复选框——增加一样有复选框的新行
 * 2 没有数据，有复选框——消失复选框
 * 3 没有数据，没有复选框——新加一行没有复选框的
 */
const addmemoEnter = async (index, data) => {

    if (data[index].lastinput.length == 0 && data[index].isCheck == false) {
        data[index].isCheck = true
    } else {
        if (data[index].isCheck == true) {
            data.push({
                firstcheck: false,
                lastinput: '',
                isCheck: true

            })
            await nextTick();

            itemRefs.value[index + 1].focus()
            ie = true
        } else {
            data.push({
                firstcheck: false,
                lastinput: '',
                isCheck: false

            })
            await nextTick();
            itemRefs.value[index + 1].focus()
            ie = true
        }


    }
}
/**
 * 1.有数据删除——删除数据
 * 2.没有数据删除，有复选框——删除复选框
 * 3.没有数据，没有复选框——删除整行
 */
var ie = false;
const deleteCheckbox = async (index, data) => {
    if (data[index].lastinput.length == 0 && data[index].isCheck == true) {
        if (index > 0) {
            data.pop()
            itemRefs.value[index - 1].focus()
            setEndOfContenteditable(itemRefs.value[index - 1])
            ie = false
            return

        }
        ie = false
        return
    }
    if (ie && data[index].lastinput.length == 0) {
        data[index].isCheck = true
        ie = false
        return
    }
    if ((data[index].lastinput.length) == 0) {
        ie = true
        return
    }
    ie = false
}

//让执行focus时，鼠标在末尾
function setEndOfContenteditable(contentEditableElement) {
    let range, selection;
    if (document.createRange) {
        range = document.createRange();
        range.selectNodeContents(contentEditableElement);
        range.collapse(false);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    } else if (document.selection) {
        range = document.body.createTextRange();
        range.moveToElementText(contentEditableElement);
        range.collapse(false);
        range.select();
    }
}
const getContent = () => {
};
/**
 * 获取Div属性是contenteditable="true"的数据，自定义指令
 */
const VContenteditable = {
    beforeMount(el, binding) {

        el.innerHTML = binding.value.lastinput;
        el.addEventListener('input', () => {
            binding.value.data[binding.arg].lastinput = el.innerHTML;
            binding.instance.$forceUpdate();

        });

    },
    updated(el, binding) {
        if (el.innerHTML !== binding.value.lastinput) {
            el.innerHTML = binding.value.lastinput;
        }
    },
};

const valueTag = ref()
const isShowOldTag = ref(true)
const colorTag = reactive([
    'pink',
    'red',
    'orange',
    'green',
    'cyan',
    'blue',
    'purple'
])
const colorTagIndex = reactive([

])
//用户之前的记录过的标签
let OlddataListTag = reactive([
    'Sprinboot',
    'Vue',
    'Node',
])

//用户新增加的标签
let NewdataListTag = ref([

])
const oldAddNewTag = (index, data) => {


    data.push(index)
    const colorIndex = Math.floor(Math.random() * 7);
    colorTagIndex.push(colorIndex)
}
const addNewTag = (data) => {
    data.push(valueTag.value);
    valueTag.value = ''
    isShowOldTag.value = true
    const colorIndex = Math.floor(Math.random() * 7);
    colorTagIndex.push(colorIndex)

}

const deleteNewTag = (index, data) => {
    data.splice(index, 1)
}

const showOldTag = () => {

    if (valueTag.value.length > 0) {
        isShowOldTag.value = false
    } else {
        isShowOldTag.value = true
    }
}

const addMemoNode = () => {
    AddMemoAPI({ memoList: listFromState.memodatas, memoConfirm: 1, memoListStatus: 0, memoListTag: NewdataListTag.value, isTop: false, userId: counter.clientlogin.id }).then(res => {
        if (res.code == 0) {
            listFromState.memodatas = []
            NewdataListTag.value = []
            message.success("记录成功")
            fethmemo({ userId: counter.clientlogin.id, memoListStatus: 0 })
        }
    })
}
//#endregion

//#region 小灵显示
const memoTagThree = ref()
const memoList = ref([])
const memoListTop = ref([])

//显示侧边栏的编辑和更多按钮
const showedit = ref(2)
const isShowEdit = (index) => {
    showedit.value = index

}
const isHidderEdit = () => {
    showedit.value = null
}


//置顶||取消置顶 功能
const updateMemoTop = (_id, isTop) => {
    UpdateTopAPI({ _id, isTop }).then(res => {
        if (res.code == 0) {
            fethmemo({ userId: counter.clientlogin.id, memoListStatus: 0 })
            if (isTop == true) {
                message.success("置顶成功")

            } else {
                message.success("取消置顶成功")
            }
        }
    })
}


//归档功能
const updatefileMemo = (_id) => {
    FileMemoAPI({ _id, memoListStatus: 1 }).then(res => {
        if (res.code == 0) {
            fethmemo({ userId: counter.clientlogin.id, memoListStatus: 0 })
            fethmemofile({ userId: counter.clientlogin.id, memoListStatus: 1 })

            message.success('归档成功')
        }
    })
}

//删除功能

const deleteMemo = (_id) => {
    DeleteMemoAPI({ _id }).then(res => {
        if (res.code == 0) {
            fethmemo({ userId: counter.clientlogin.id, memoListStatus: 0 })
            message.success('删除成功')

        }
    })
}

const fethmemo = (query) => {
    ListMemoAPI(query).then(res => {
        if (res.code == 0) {
            let memoList1 = []
            let memoListTop1 = []
            res.data.forEach(element => {
                let createTime1 = new Date(element.createTime).getFullYear() + '-' + new Date(element.createTime).getMonth() + '-' + new Date(element.createTime).getDate()
                element.createTime = createTime1
                if (element.isTop) {
                    memoListTop1.push(element)
                } else {
                    memoList1.push(element)

                }
            });
            memoList.value = memoList1;
            memoListTop.value = memoListTop1
        }
    })
}

//#endregion

//#region 小灵编辑
const isEditContent = ref()

const isShowEditContetn = (index) => {
    if (isEditContent.value == index) {
        isEditContent.value = -1
    } else {
        isEditContent.value = index
    }
}
const isEditContent1 = ref()

const isShowEditContetn1 = (index) => {
    if (isEditContent1.value == index) {
        isEditContent1.value = -1
    } else {
        isEditContent1.value = index
    }
}
const editMemo = (data, agr) => {
    EditMemoAPI({ _id: data._id, memoList: data.memoList, memoListTag: data.memoListTag }).then(res => {
        if (res.code == 0) {
            fethmemo({ userId: counter.clientlogin.id, memoListStatus: 0 })
            message.success("修改成功")
        }
        if (agr == '1') {
            isEditContent.value = -1
        } else {
            isEditContent1.value = -1
        }


    })
}
const refIndex = ref()

//#endregion

//#region 归档小灵
const showMemoFile = ref(false)
const memoFileList = ref([])
const memoFileTagThree = ref()
const memoFile = () => {
    showMemoFile.value = true
    FindTagAPI({ userId: counter.clientlogin.id, memoListStatus: 1 }).then(res => {
        //先进行排序
        const sortedEntries = Object.entries(res.data).sort((a, b) => b[1] - a[1]);
        const sortedObj = Object.fromEntries(sortedEntries);
        //做数据转化
        const result = Object.entries(sortedObj).map(([key, value]) => ({ [key]: value }));
        memoFileTagThree.value = result.slice(0, 3)
    })
}
const forwardmemo = () => {
    showMemoFile.value = false
}
const fethmemofile = (query) => {
    ListMemoAPI(query).then(res => {
        if (res.code == 0) {
            res.data.forEach(element => {
                let createTime1 = new Date(element.createTime).getFullYear() + '-' + new Date(element.createTime).getMonth() + '-' + new Date(element.createTime).getDate()
                element.createTime = createTime1
            })
            memoFileList.value = [...res.data];

        }
    })
}
const cancelMemoFile = (_id) => {
    FileMemoAPI({ _id, memoListStatus: 0 }).then(res => {
        if (res.code == 0) {
            message.success('修改成功')
            fethmemofile({ userId: counter.clientlogin.id, memoListStatus: 1 })
            fethmemo({ userId: counter.clientlogin.id, memoListStatus: 0 })
        }
    })
}
const deleteMemoFile = (_id) => {
    DeleteMemoAPI({ _id }).then(res => {
        if (res.code == 0) {
            message.success('删除成功')
            fethmemofile({ userId: counter.clientlogin.id, memoListStatus: 1 })
        }
    })
}
const findMemoByTag = (tagName) => {
    if (!showMemoFile.value) {
        fethmemo({ userId: counter.clientlogin.id, memoListStatus: 0, tagName })
    } else {
        fethmemofile({ userId: counter.clientlogin.id, memoListStatus: 1, tagName })

    }
}

const findMemoAll = () => {
    if (!showMemoFile.value) {
        fethmemo({ userId: counter.clientlogin.id, memoListStatus: 0 })
    } else {
        fethmemofile({ userId: counter.clientlogin.id, memoListStatus: 1 })

    }
}
//#endregion


//#region 任务编辑
const taskStartShow = ref()
//这是查询的用户的总数据
const taskList = ref()
const taskNowdata = ref()
const backimg = ref([
    '../../../../public/images/back1.jpg',
    '../../../../public/images/back2.jpg',
    '../../../../public/images/back3.jpg',
    '../../../../public/images/back4.jpg',
    '../../../../public/images/back5.jpg',
    '../../../../public/images/back6.jpg',
    '../../../../public/images/back7.jpg',
])
const visibleAdd = ref(false)
let NewtaskNoedata = reactive({
    taskName: '',
    taskStatus: 0,
    taskTime: null,
    taskDirection: '倒计时',
    taskBackImg: '',
})
const lastTimeShow = ref(true)
const addTaskItem = () => {
    visibleAdd.value = true
    NewtaskNoedata.taskName = '';
    NewtaskNoedata.taskStatus = 0;
    NewtaskNoedata.taskTime = null;
    NewtaskNoedata.taskDirection = '倒计时';
    NewtaskNoedata.taskBackImg = ''
}
const myTime = ref()
const isSelect = ref(false)
const visibleMyTime = ref(false)
const handleOkAdd = () => {
    const blackIndex = Math.floor(Math.random() * 7);
    NewtaskNoedata.taskBackImg = backimg.value[blackIndex]
    if (NewtaskNoedata.taskTime == null && myTime) {
        NewtaskNoedata.taskTime = myTime.value
    }

    if (JSON.stringify(taskList.value) === '{}') {
        let taskDataClone1 = cloneDeep(NewtaskNoedata);
        AddTaskListAPI({ userId: counter.clientlogin.id, taskList: taskDataClone1 }).then(res => {
            if (res.code == 0) {
                message.success("添加成功")
                fethtask({ userId: counter.clientlogin.id, taskListStatus: 0 })
            } else {
                message.error("添加失败")
            }
        })
    } else {
        let taskDataClone2 = cloneDeep(NewtaskNoedata);
        let _id = taskList.value._id
        AddTaskAPI({ _id, taskList: taskDataClone2 }).then(res => {
            if (res.code == 0) {
                message.success("添加成功")
                fethtask({ userId: counter.clientlogin.id, taskListStatus: 0 })
            } else {
                message.error('添加失败')
            }
        })
    }
    visibleAdd.value = false;
    myTime.value = null
    isSelect.value = false
    lastTimeShow.value = true
}
const confirmMyTime = () => {
    isSelect.value = true
    visibleMyTime.value = false
}

const fethtask = (query) => {
    FindListAPI(query).then(res => {
        if (res.data.length != 0) {
            taskList.value = res.data[0]

            taskNowdata.value = res.data[0].taskList
        } else {
            taskList.value = {}
            taskNowdata.value = []

        }

    })

}

const visibleEditTask = ref(false)
const visibleEditShowTask = ref(false)
const editShowData = ref()
const editCurrentTask = ref()
const showEditTaskShowModal = (item, index) => {
    if (taskStartShow.value == index) {
        return
    }
    visibleEditShowTask.value = true
    editCurrentTask.value = item

}

const finshStatusTotal = computed(() => {

    return editCurrentTask.value.finshStatus.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
})

const showEditTaskModal = (taskuuid) => {
    FindTaskAPI({ _id: taskList.value._id, uuid: taskuuid }).then(res => {
        if (res.code == 0) {
            editShowData.value = res.data.taskList[0]
            visibleEditTask.value = true
        } else {
            message.error('编辑失效')
        }
    })

}

const handleOkEdit = () => {
    UpdateTaskAPI({
        _id: taskList.value._id,
        taskList: {
            taskuuid: editShowData.value.taskuuid,
            taskName: editShowData.value.taskName,
            taskTime: editShowData.value.taskTime,
            taskDirection: editShowData.value.taskDirection
        }
    }).then(res => {
        if (res.code == 0) {
            message.success('编辑任务成功')
            visibleEditTask.value = false;
            fethtask({ userId: counter.clientlogin.id, taskListStatus: 0 })
        }
    })
}

const deleteTask = (taskuuid) => {
    DeleteTaskAPI({ _id: taskList.value._id, taskuuid: taskuuid }).then(res => {
        if (res.code == 0) {
            message.success('删除成功')
            fethtask({ userId: counter.clientlogin.id, taskListStatus: 0 })
            visibleEditShowTask.value = false
        }
    })
}
//#endregion

//#region 计时
//正向计时
const timefor = ref()
const timeend = ref()
const mm = ref(0);
const ss = ref(0);
const forwardTime = ref('00:00')
const alreadySecond = ref(1)

let deleteArr = reactive([

])
const timer = () => {
    ss.value = ss.value + 1
    if (ss.value >= 60) {
        ss.value = 0
        mm.value = mm.value + 1
    }
    forwardTime.value = toDub(mm.value) + ":" + toDub(ss.value)

    localStorage.setItem('mm', mm.value)
    localStorage.setItem('ss', ss.value)
    localStorage.setItem('locforwardTime', forwardTime.value)
}

//加0——格式化数据
const toDub = (n) => {
    if (n < 10) {
        return '0' + n
    } else {
        return '' + n
    }
}

//重置时间
const reset = () => {
    clearInterval(time.value)
    ss.value = 0;
    mm.value = 0;
    forwardTime.value = '00:00'
}

//倒计时
const countdownTime = ref()
const countss = ref(60)
const countmm = ref()
const countdowntimer = (item) => {

    countss.value = countss.value - 1
    localStorage.setItem('countmm', countmm.value)
    localStorage.setItem('countss', countss.value)
    if (countss.value <= 0) {
        countss.value = 60
        countmm.value = countmm.value - 1
    }
    if (countmm.value < 0) {
        let date = new Date()
        let strTime = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()
        finshTask({
            _id: taskList.value._id,
            taskList: {
                taskuuid: item.taskuuid,
                taskName: item.taskName,
                taskStatus: 2,
                taskFinshTime: strTime,
                finshStatus: item.taskTime
            }
        })
        taskStartShow.value = -1

    }

    countdownTime.value = toDub(countmm.value) + ':' + toDub(countss.value)
    localStorage.setItem('loccountdownTime', countdownTime.value)
}

//提前完成
const aheadfinsh = (index, item) => {
    taskStartShow.value = -1
    localStorage.removeItem('taskStartShowIndex')
    localStorage.removeItem('countmm')
    localStorage.removeItem('countss')
    localStorage.removeItem('mm')
    localStorage.removeItem('ss')
    let date = new Date()
    let strTime = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()
    if (item.taskDirection == '倒计时') {
        let diffTime = item.taskTime - countmm.value
        finshTask({
            _id: taskList.value._id,
            taskList: {
                taskuuid: item.taskuuid,
                taskName: item.taskName,
                taskStatus: 2,
                taskFinshTime: strTime,
                finshStatus: diffTime
            }
        })
    } else {
        finshTask({
            _id: taskList.value._id,
            taskList: {
                taskuuid: item.taskuuid,
                taskName: item.taskName,
                taskStatus: 2,
                taskFinshTime: strTime,
                finshStatus: mm.value
            }
        })
    }
    clearInterval(timefor.value)
    clearInterval(timeend.value)
    countmm.value = item.taskTime - 1
    countss.value = 0

}

//完成的函数——提前完成和倒计时结束
const finshTask = (query) => {
    FinshTaskAPI(query).then(res => {
        if (res.code == 0) {
            fethtask({ userId: counter.clientlogin.id, taskListStatus: 0 })
        } else {
            message.error('完成失败')
        }
    })
    clearInterval(timefor.value)
    clearInterval(timeend.value)
}

//重置功能
const resetTask = (index, item) => {
    localStorage.removeItem('taskStartShowIndex')
    localStorage.removeItem('countmm')
    localStorage.removeItem('countss')
    localStorage.removeItem('mm')
    localStorage.removeItem('ss')
    taskStartShow.value = -1
    localStorage.removeItem('taskStartShowIndex')
    countmm.value = item.taskTime - 1
    countss.value = 60
    clearInterval(timefor.value)
    clearInterval(timeend.value)
}

const startTime = (item, index) => {
    taskStartShow.value = index
    localStorage.setItem('taskStartShowIndex', index)
    localStorage.setItem('locitem', JSON.stringify(item))
    if (item.taskDirection == '正向计时') {
        localStorage.removeItem('countmm')
        localStorage.removeItem('countss')
        localStorage.removeItem('loccountdownTime')
        mm.value = 0
        ss.value = 0
        forwardTime.value = '00:00'
        clearInterval(timeend.value)
        timefor.value = setInterval(timer, 1000)
    }
    if (item.taskDirection == '倒计时') {
        localStorage.removeItem('mm')
        localStorage.removeItem('ss')
        localStorage.removeItem('locforwardTime')
        countmm.value = item.taskTime - 1
        countdownTime.value = item.taskTime < 10 ? `0${item.taskTime}:00` : `${item.taskTime}:00`
        clearInterval(timefor.value)
        timeend.value = setInterval(countdowntimer, 1000, item)
    }

}

//继续倒计时
const continueCountDown = () => {
    let loccountmm = localStorage.getItem('countmm')
    let loccountss = localStorage.getItem('countss')
    let taskStartShowIndex = localStorage.getItem('taskStartShowIndex')
    let item = JSON.parse(localStorage.getItem('locitem'))
    let loccountdownTime = localStorage.getItem('loccountdownTime')
    if (loccountmm && loccountss && loccountmm != null) {
        countmm.value = Number(loccountmm)
        countss.value = Number(loccountss)
        taskStartShow.value = Number(taskStartShowIndex)
        countdownTime.value = loccountdownTime
        timeend.value = setInterval(countdowntimer, 1000, item)
        return
    }
    clearInterval(timeend.value)
}

//继续正向计时
const continueTimer = () => {
    let locmm = localStorage.getItem('mm')
    let locss = localStorage.getItem('ss')
    let locforwardTime = localStorage.getItem('locforwardTime')
    let taskStartShowIndex = localStorage.getItem('taskStartShowIndex')
    if (locmm != null && locss != null) {
        mm.value = Number(locmm)
        ss.value = Number(locss)
        forwardTime.value = locforwardTime
        taskStartShow.value = Number(taskStartShowIndex)
        timefor.value = setInterval(timer, 1000)
        return
    }
    clearInterval(timefor.value)
}
//#endregion

//#region 任务归档和展示
const fileTaskList = () => {
    let _id = taskList.value._id;
    let finshStatusArray = [];
    let taskTimeArray = [];
    taskList.value.taskList.forEach(item => {
        finshStatusArray = [...finshStatusArray, ...item.finshStatus]
        if (item.tagTime < 0) {
            message.error("时长数据不规范，小于零")
            return
        }
        taskTimeArray.push(item.taskTime)

    })
    FileTaskListAPI({ _id: _id, finshStatusArray: finshStatusArray, taskTimeArray: taskTimeArray }).then(res => {
        if (res.code == 0) {
            message.success('归档成功')
            fethtask({ userId: counter.clientlogin.id, taskListStatus: 0 })
            fethtaskfile({ userId: counter.clientlogin.id, taskListStatus: 1 })
        }
    })
}
const fileTaskData = ref()
const fileBackColor = reactive([
    { 'backgroundColor': '#f05654' },
    { 'backgroundColor': '#eacd76' },
    { 'backgroundColor': '#afdd22' },
    { 'backgroundColor': '#0c8918' }
])
const fileBackColorText = reactive([
    '很差',
    '一般',
    '较好',
    '很棒'
])
const fethtaskfile = (query) => {
    FindListAPI(query).then(res => {
        if (res.code == 0) {
            res.data.forEach(item => {
                let isperformace = item.performance
                if (isperformace >= 0 && isperformace < 0.5) {
                    item.performance = 0
                } else if (isperformace >= 0.5 && isperformace < 1) {
                    item.performance = 1
                } else if (isperformace >= 1 && isperformace < 1.2) {
                    item.performance = 2
                } else if (isperformace >= 1.2) {
                    item.performance = 3
                }
                let date = new Date(item.createTime)
                item.createTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            })
            fileTaskData.value = res.data

        }

    })
}

const confirmDeleteFileTask = (_id) => {
    DeleteTaskFileAPI({ _id, userId: counter.clientlogin.id }).then(res => {
        if (res.code == 0) {
            message.success("删除成功")
            fethtask({ userId: counter.clientlogin.id, taskListStatus: 0 })
            fethtaskfile({ userId: counter.clientlogin.id, taskListStatus: 1 })
        } else {
            message.error('删除失败')
        }
    })
}
//#endregion
</script>

<style scoped>
.taskitem-content {
    /* background-color: rgb(250, 250, 250); */
    margin-top: 30px;
    background-color: rgb(250, 250, 250);
    padding: 30px;
    height: 780px;
    overflow: auto;
}

.taskitem-content::-webkit-scrollbar {
    width: 8px;
    /* 纵向滚动条宽度 */
    height: 8px;
    /* 横向滚动条高度 */
    background-color: white;
    /* 滚动条整体背景，一般被覆盖着 */
}

/* 滚动条里面的滑块 */
.taskitem-content::-webkit-scrollbar-thumb {
    border-radius: 10px;
    /* 滚动条滑块阴影 */
    background-color: rgba(216, 218, 217);
    /* 滚动条滑块颜色 */
}

/* 滚动条的轨道（里面装有Thumb） */
.taskitem-content::-webkit-scrollbar-track {
    /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
    /* 滚动条轨道阴影 */
    border-radius: 10px;
    /* 滚动条轨道圆角 */
    background-color: white;
    /* 滚动条轨道背景 */
}


.task-content-right {
    width: 85%;
    margin: 10px auto;
    height: 800px;
    padding: 20px;
}

.forward-time {
    text-align: center;
    font-size: 24px;
    line-height: 1.5715;
    color: white;
}

.countdown-time {
    text-align: center;
    font-size: 24px;
    line-height: 1.5715;
    color: white;
}

.process-task {
    margin-top: 10px;
}

.selected {
    background-color: #1890ff;
    color: white;
}

.task-item-left {
    margin-bottom: 10px;
    border: 1px solid rgb(112, 145, 251);
    border-radius: 2px;
    padding: 5px;
    padding-left: 15px;
    margin-left: 1px;
    margin-right: 1px;
    background-size: 100%;
}

.task-item-left :hover {
    transition: transform linear 0.3s;
}

.task-list-left {
    margin-top: 30px;
    border: 2px solid grey;
    border-radius: 20px;
    min-height: 580px;
    max-height: 620px;
    overflow: auto;

}

.task-list-left::-webkit-scrollbar {
    width: 8px;
    /* 纵向滚动条宽度 */
    height: 8px;
    /* 横向滚动条高度 */
    background-color: white;
    /* 滚动条整体背景，一般被覆盖着 */
}

/* 滚动条里面的滑块 */
.task-list-left::-webkit-scrollbar-thumb {
    border-radius: 10px;
    /* 滚动条滑块阴影 */
    background-color: rgba(216, 218, 217);
    /* 滚动条滑块颜色 */
}

/* 滚动条的轨道（里面装有Thumb） */
.task-list-left::-webkit-scrollbar-track {
    /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
    /* 滚动条轨道阴影 */
    border-radius: 10px;
    /* 滚动条轨道圆角 */
    background-color: white;
    /* 滚动条轨道背景 */
}

.memo-content {
    max-width: 1550px;
    min-width: 800px;
    margin: 10px auto;
    height: 620px;
}

.memo-content-left {
    padding-right: 20px;
}

.memo-input {
    border: 1px solid grey;
    border-radius: 20px;
    min-height: 480px;
    margin-bottom: 40px;
    max-height: 580px;
}

.memo-input-content {
    min-width: 250px;
    max-width: 320px;
    margin: 15px auto;
    height: 360px;
    cursor: text;
}

#memo-textarea {
    border: none;
    /* height: 30px; */
    max-height: 9.0072e+15px;
    resize: none;
    width: 100%;
    min-height: 30px;
    padding: 4px 1px;
    line-height: 1.5715;
    vertical-align: bottom;
    transition: all 0.3s, height 0s;
}

#memo-textarea:focus {
    outline: none;
    border: none;
    box-shadow: none;
}

.ant-list-sm .ant-list-item {
    padding: 2px !important;
}

.ant-list-lg .ant-list-item {
    padding: 17px 10px 8px !important;
}

.showTag {
    width: 340px;
    margin-top: 15px;
}

.memo-content-right {
    /* border: 1px solid; */
    width: 98%;
}

.memo-content-right-boder {
    width: 100%;
    height: 560px;
    overflow: auto;
    display: flex;
}

.memofile-content-right-boder {
    width: 100%;
    height: 560px;
    overflow: auto;
}

.tag-manager {
    width: 98%;
    margin: 1px auto;
}

.memo-right-list {
    margin-top: 20px;
    padding: 16px;
}

.div-shadow {

    box-shadow: 0 1px 4px -2px rgba(0, 0, 0, .13), 0 2px 8px 0 rgba(0, 0, 0, .08), 0 8px 16px 4px rgba(0, 0, 0, .04) !important;
}

.effect-border {
    box-shadow: 0 0 1px -1px rgba(0, 0, 0, .08), 0 1px 2px 0 rgba(0, 0, 0, .04), 0 2px 4px 1px rgba(0, 0, 0, .02);
    background-color: white;
    margin-top: 15px;
    border-radius: 8px;
    transition: box-shadow .2s ease-in-out;
}

.scroll-oldTag {
    height: 130px;
    overflow: auto;

}

/* .scroll-oldTag::-webkit-scrollbar-button {
    display: none;
} */

.scroll-oldTag::-webkit-scrollbar {
    width: 8px;
    /* 纵向滚动条宽度 */
    height: 8px;
    /* 横向滚动条高度 */
    background-color: white;
    /* 滚动条整体背景，一般被覆盖着 */
}

/* 滚动条里面的滑块 */
.scroll-oldTag::-webkit-scrollbar-thumb {
    border-radius: 10px;
    /* 滚动条滑块阴影 */
    background-color: rgba(216, 218, 217);
    /* 滚动条滑块颜色 */
}

/* 滚动条的轨道（里面装有Thumb） */
.scroll-oldTag::-webkit-scrollbar-track {
    /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
    /* 滚动条轨道阴影 */
    border-radius: 10px;
    /* 滚动条轨道圆角 */
    background-color: white;
    /* 滚动条轨道背景 */
}
</style>