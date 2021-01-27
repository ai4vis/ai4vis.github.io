<template>
    <div class = "filter-panel">
        <h3>
            Application
        </h3>
        <div class="app-list">
            <div
                v-for = "(app, idx) in applications"
                :key = "idx"
                class = "filter-app"
        >
                <div class="app-name-row">
                    <div class="app-name">
                        <a-checkbox 
                            v-model:checked="checked[idx]" 
                            :indeterminate = "indeterminate[idx]"
                            :disabled="disabled[idx]"
                            @change="onCheckApp(e, idx)" 
                        />
                        <a-tooltip>
                            <template v-slot:title>
                                {{ appDesc[idx]}}
                            </template>
                            <h4>{{ formatter(applicationName[idx]) }}
                                <InfoCircleTwoTone
                                    :style="{ paddingLeft: '2px', transform: 'translate(0px, -2px)' }"
                                />
                            </h4>
                        </a-tooltip>
                    </div>
                    <CloseSquareTwoTone  
                        v-show="selectedAppCnt[idx] > 0"
                        :style="{fontSize: '14px', marginRight: '10px', paddingTop: '4px'}"
                        @click="cancelAll(idx)"
                    />
                </div>
                <div class = "app-row">
                    <a-tag
                        v-for = "label in app"
                        :key = "label"
                        class = "tag"
                        :class = "{checkedTag : checkTag(label, applicationName[idx]),
                            isDisable: checkDisable(label, applicationName[idx])
                            }"
                        @click = "handleChange(label, applicationName[idx])"
                    >
                        {{ formatter(label) }}
                    </a-tag>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang=ts>
import { useStore } from "vuex";
import { applications, applicationName, appDesc } from '@/utils/filters'
import { CloseSquareTwoTone, MonitorOutlined, InfoCircleTwoTone  } from '@ant-design/icons-vue'
import { reactive, computed, toRefs, watch } from 'vue';
import { formatter } from '@/utils/helper'

export default {
    name: 'AppFilter',
    components: {
        CloseSquareTwoTone,
        MonitorOutlined,
        InfoCircleTwoTone,
    },

    setup() {
        const store = useStore();

        const state = reactive({
            selectedApps: [] as ApplicationString[],
            activeApps: computed(() => store.getters.activeTags.app),
            checked: [...new Array(4)].map(i=>false),
            disabled: computed(() => store.getters.activeTags.appLevel),
            selectedAppCnt: [...new Array(4)].map(i=>0),
            indeterminate: [...new Array(4)].map(i=>false),
            applicationName: applicationName,
            applications: applications,
            appDesc: appDesc,
        })

        const cancelAll = (appIndex: number) => {
            let appName = state.applicationName[appIndex]
            state.selectedApps = state.selectedApps.filter(sa => {
                if (sa.substring(0, sa.indexOf('[')) === appName) {
                    return
                }
                else {
                    return sa
                }
            })
            state.selectedAppCnt[appIndex] = 0
            state.indeterminate[appIndex] = false
        }

        const handleChange = (tag: string, appName: string) => {
            if (!checkDisable(tag, appName)) {
                let sa = `${appName}[${tag}]` as ApplicationString
                let idx = state.selectedApps.indexOf(sa)
                if ( idx > -1 ) {
                    state.selectedApps.splice(idx, 1)
                    state.selectedAppCnt[idx] -= 1
                    state.indeterminate[idx] = state.selectedAppCnt[idx] !== 0
                }
                else {
                    let appIndex = state.applicationName.indexOf(appName)
                    state.selectedApps.push(sa)
                    state.selectedAppCnt[appIndex] += 1
                    state.indeterminate[appIndex] = true
                    state.checked[appIndex] = false
                }
            }
        };

        const checkTag = (tag: string, appName: string) => {
            let tmp = `${appName}[${tag}]` as ApplicationString
            if (state.selectedApps.indexOf(tmp) > - 1)
                return true
            else 
                return false
        }

        const checkDisable = (tag: string, appName: string) => {
            let appIndex = state.applicationName.indexOf(appName)
            if (state.activeApps[appIndex].indexOf(tag) > -1)
                return true
            else 
                return false
        }

        const onCheckApp = (e: Event, appIndex: number) => {
            if (state.indeterminate[appIndex] === true) {
                cancelAll(appIndex)
                state.checked[appIndex] = true
            }
        }

        watch(
            () => state.selectedApps,
            (newTasks, prevTasks) => {
                let filterPayload: FilterPayload = {
                    type: 'app',
                    content: state.selectedApps
                }
                store.commit('filter', filterPayload)
            },
            {deep: true}
        )

        watch(
            () => state.checked,
            (newChecked, prevChecked) => {
                let content: string[] = []
                state.checked.map((c, idx) => {
                    if (c)
                        content.push(state.applicationName[idx])
                })
                let filterPayload: FilterPayload = {
                    type: 'appLevel',
                    content: content
                }
                store.commit('filter', filterPayload)
            },
            {deep: true}
        )

        return {
            ...toRefs(state),
            formatter,
            cancelAll,
            handleChange,
            checkTag,
            checkDisable,
            onCheckApp
        }
    }
}
</script>

<style scoped>
.filter-panel {
    padding: 10px 15px;
    border-top: 1px solid #ddd;
    border-radius: 4px;
}
.filter-panel h3 {
    font-weight: 600;
    font-size: 20px;
}
.app-name-row {
    border-bottom: 1px solid #ddd;
    margin-bottom: 5px;
    height: 25px;
    display: flex;
    justify-content: space-between;
    background-color: #fafafa;
    padding-left: 5px;
}
.app-name {
    display: flex;
    align-items: center;
}
.app-name h4 {
    margin-bottom: 0px;
    margin-left: 5px;
    font-weight: 500;
    font-size: 14px;
}

.filter-app {
    border-top: 1px solid #ddd;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    border-radius: 4px;
}
.filter-app:last-child {
    border: 1px solid #ddd;
    border-radius: 4px;
}
.app-row {
    display: flex;
    flex-wrap: wrap;
    padding-left: 5px;
}
.tag {
    margin-bottom: 5px;
    margin-right: 3px;
    cursor: pointer;
}
.checkedTag {
    background-color: #1890ff;
    color: #fff;
}
.isDisable {
    cursor: not-allowed;
    color: rgba(0,0,0,.25);
    background-color: #f5f5f5;
    border-color: #d9d9d9;
    text-shadow: none;
    box-shadow: none;
}
.isDisable[ant-click-animating-without-extra-node]:after {
    border: 0 none;
    opacity: 0;
    animation: none 0 ease 0 1 normal;
}
</style>