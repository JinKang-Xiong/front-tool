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
                                                                                id="memo-textarea"
                                                                                @keydown.enter.prevent
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
                                                                                        <a-button type="text"
                                                                                            block="true">
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
                                                                                        <template
                                                                                            #renderItem="{ item }">
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
                                                            <a-popover placement="bottomLeft"
                                                                :overlayStyle="{ zIndex: 2 }"
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
                            <a-list item-layout="vertical" size="large" :pagination="pagination"
                                :data-source="memoList">
                                <template #renderItem="{ item, index }">
                                    <a-row v-on:mouseenter="isShowEdit(index)" v-on:mouseleave="isHidderEdit(index)">

                                        <a-col :span="21">
                                            <a-list-item key="item._id" :class="showedit == index ? 'div-shadow' : ''"
                                                class="effect-border">
                                                <template #actions style="margin-top: 6px;"
                                                    v-if="isEditContent1 != index">
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
                                                                                <span
                                                                                    style="font-size: 10px;">以下是标签</span>
                                                                            </a-col>
                                                                        </a-row>
                                                                        <div class="scroll-oldTag" v-if="isShowOldTag">
                                                                            <a-list size="small"
                                                                                item-layout="horizontal"
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