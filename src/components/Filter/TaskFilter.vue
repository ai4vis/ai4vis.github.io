<template>
    <div class = "filter-panel">
        <h3>
            Task
        </h3>
        <div class="task-list">
            <div
                v-for = "(task, idx) in tasks"
                :key = "idx"
                class = "filter-task"
        >
                <div class="task-name-row">
                    <div class="task-name">
                        <a-checkbox 
                            v-model:checked="checked[idx]" 
                            :indeterminate = "indeterminate[idx]"
                            :disabled="disabled[idx]"
                            @change="onCheckTask(e, idx)" 
                        />
                        <a-tooltip>
                            <template v-slot:title>
                                {{ taskDesc[idx]}}
                            </template>
                            <h4>{{ formatter(taskName[idx]) }}
                                <InfoCircleTwoTone
                                    :style="{ paddingLeft: '2px', transform: 'translate(0px, -2px)'}"
                                />
                            </h4>
                        </a-tooltip>
                    </div>
                    <CloseSquareTwoTone  
                        v-show="selectedTasksCnt[idx] > 0"
                        :style="{fontSize: '14px', marginRight: '10px', paddingTop: '4px'}"
                        @click="cancelAll(idx)"
                    />
                </div>
                <div
                    v-for = "(axis, axisName) in task"
                    :key = "axisName"
                    class = "task-row"
                >
                    <a-tag class="axis-name">
                        {{ formatter(axisName) }}:
                    </a-tag>
                    <a-tag
                        v-for = "label in axis"
                        :key = "label"
                        class = "tag"
                        :class = "{checkedTag : checkTag(label, axisName, taskName[idx]),
                            isDisable: checkDisable(label, axisName, taskName[idx])
                            }"
                        @click = "handleChange(label, axisName, taskName[idx])"
                    >
                        {{ formatter(label) }}
                        {{ calcFilterPapers(label, axisName, taskName[idx]) }}
                    </a-tag>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang=ts>
import { useStore } from "vuex";
import { taskName, tasks, taskDesc } from '@/utils/filters'
import { CloseSquareTwoTone, MonitorOutlined, InfoCircleTwoTone  } from '@ant-design/icons-vue'
import { reactive, computed, toRefs, watch } from 'vue';
import { formatter } from '@/utils/helper'

export default {
    name: 'TaskFilter',
    components: {
        CloseSquareTwoTone,
        MonitorOutlined,
        InfoCircleTwoTone,
    },

    setup() {
        const store = useStore();

        const state = reactive({
            filterPaper: computed(() => store.getters.filterPapers as PaperList[]),
            selectedTasks: [] as TASK,
            activeTasks: computed(() => store.getters.activeTags.tasks),
            checked: [...new Array(8)].map(i=>false),
            disabled: computed(() => store.getters.activeTags.taskLevel),
            selectedTasksCnt: [...new Array(8)].map(i=>0),
            indeterminate: [...new Array(8)].map(i=>false),
            taskName: taskName,
            tasks: tasks,
            taskDesc: taskDesc,
        })
        
        const cancelAll = (subTaskIndex: number) => {
            state.selectedTasks = state.selectedTasks.filter(st => {
                if (st.task !== state.taskName[subTaskIndex]) {
                    return st
                }
                else
                    return
            })
            state.selectedTasksCnt[subTaskIndex] = 0
            state.indeterminate[subTaskIndex] = false
        }

        const handleChange = (tag: string, axisName: string, subTaskName: string) => {
            if (!checkDisable(tag, axisName, subTaskName)) {
                let tAxis = axisName[0].toLowerCase() + axisName.substring(1)
                let subTaskIndex = state.taskName.indexOf(subTaskName)
                // cancel the selction of a tag
                for (let idx in state.selectedTasks) {
                    let st = state.selectedTasks[idx]
                    let stAxis = Object.entries(st.label)[0][0]
                    let stLabel = Object.entries(st.label)[0][1]
                    if (st.task === subTaskName && stAxis === tAxis && tag === stLabel) {
                        state.selectedTasks.splice(Number(idx), 1)
                        state.selectedTasksCnt[subTaskIndex] -= 1
                        state.indeterminate[subTaskIndex] = state.selectedTasksCnt[subTaskIndex] !== 0
                        return
                    }
                }
                // select the tag
                let newSubTask = {
                    [tAxis]: tag
                }
                let newSt: TaskObject = {
                    task: subTaskName as TaskType,
                    label: newSubTask
                }
                state.selectedTasks.push(newSt)
                state.selectedTasksCnt[subTaskIndex] += 1
                // set intermediate of the subTask-level filter: true
                state.indeterminate[subTaskIndex] = true
                state.checked[subTaskIndex] = false
            }
        };

        const checkTag = (tag: string, axisName: string, subTaskName: string) => {
            for (let st of state.selectedTasks) {
                let tAxis = axisName[0].toLowerCase() + axisName.substring(1)
                let stAxis = Object.entries(st.label)[0][0]
                let stLabel = Object.entries(st.label)[0][1]
                if (subTaskName === st.task && tAxis === stAxis && tag === stLabel )
                    return true
                else 
                    continue
            }
            return false
        }

        const checkDisable = (tag: string, axisName: string, subTaskName: string) => {
            let index = state.taskName.indexOf(subTaskName)
            let subTask = state.activeTasks[index]
            if (subTask[axisName].indexOf(tag) > -1)
                return true
            else
                return false
        }

        const onCheckTask = (e: Event, subTaskIndex: number) => {
            if (state.indeterminate[subTaskIndex] === true) {
                cancelAll(subTaskIndex)
                state.checked[subTaskIndex] = true
            }
        }

        const calcFilterPapers = (tag: string, axisName: string, subTaskName: string) => {
            if (!checkDisable(tag, axisName, subTaskName)) {
                // console.log(tag, axisName, subTaskName)
                const results = state.filterPaper.filter(paper => {
                    const tasks = paper.tasks.filter(task => task.task.match(subTaskName))
                    //@ts-ignore
                    return tasks.filter(t => t.label[axisName] === tag).length > 0
                })
                return `(${results.length})`
            }
            else
                return '(0)'
        }

        watch(
            () => state.selectedTasks,
            (newTasks, prevTasks) => {
                let filterPayload: FilterPayload = {
                    type: 'tasks',
                    content: state.selectedTasks
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
                        content.push(state.taskName[idx])
                })
                let filterPayload: FilterPayload = {
                    type: 'taskLevel',
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
            onCheckTask,
            calcFilterPapers
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
.task-name-row {
    border-bottom: 1px solid #ddd;
    margin-bottom: 5px;
    height: 25px;
    display: flex;
    justify-content: space-between;
    background-color: #fafafa;
    padding-left: 5px;
}
.task-name {
    display: flex;
    align-items: center;
}
.task-name h4 {
    margin-bottom: 0px;
    margin-left: 5px;
    font-weight: 600;
    font-size: 14px;
}

.filter-task {
    border-top: 1px solid #ddd;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    border-radius: 4px;
}
.filter-task:last-child {
    border: 1px solid #ddd;
    border-radius: 4px;
}
.task-row {
    display: flex;
    flex-wrap: wrap;
    padding-left: 5px;
}
.axis-name {
    background-color: transparent;
    border-color: transparent;
    padding: 0px;
    font-weight: 600;
    margin-right: 3px;
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