<template>
    <a-modal
        :visible="isVisible"
        :width="800"
        :footer="null"
        @cancel="handleCancel"
    >
        <h2>{{ paper.title }} ({{ paper.year }})</h2>
        <p class="authors">
            <a-tag color="pink">Author</a-tag>
            {{ formatterAuthor(paper.authors) }}
        </p>
        <p class="venue">
            <a-tag color="red">Conference/Journal</a-tag>

            <span class="badge">{{ paper.venueField }}</span>
            {{ paper.journal }}
        </p>
        <p>
            <a-tag color="orange">DOI</a-tag>
            <a :href="`http://dx.doi.org/${paper.doi}`">{{ paper.doi }}</a>
        </p>
        <a-tag color="green"> How to Read? </a-tag>
        The Summary section below shows the labels for this paper. One paper usually targets one <b>goal</b> by accomplishing one or more <b>tasks</b> (although some technique papers focus on solving one task without specifying the goal). We label <b>task</b> for each (sub-)section, as shown in the Paper Content section.

        <a-divider orientation="left" :style="{ margin: '10px 0' }">
            Summary
        </a-divider>
        <div class="summary">
            <div class="summary-item">
                <div class="summary-item-name">Visualization Data:</div>
                <div class="summary-item-content">
                    <b>{{ paper.visDataFormat }}</b>
                </div>
            </div>
            <div class="summary-item">
                <div class="summary-item-name">Goal:</div>
                <div
                    class="summary-item-content"
                    v-for="application in paper.Application"
                    :key="application"
                >
                    <div v-if="application !== 'nan'">
                        <b
                            >{{
                                application.substring(
                                    0,
                                    application.indexOf("[")
                                )
                            }}:</b
                        >
                        {{
                            formatter(
                                application.substring(
                                    application.indexOf("[") + 1,
                                    application.length - 1
                                )
                            )
                        }}
                    </div>
                    <b v-else>
                        {{ application }}
                    </b>
                </div>
            </div>
            <div class="summary-item" v-if="paper.feature">
                <div
                    class="summary-item-name"
                    :style="{ backgroundColor: '#e8fcd4' }"
                >
                    Representation:
                </div>
                <div class="summary-item-content">
                    <div>
                        <b>Method: </b>
                        {{ paper.feature.method }}
                    </div>
                    <div>
                        <b>Input Feature Space:</b>
                        {{ paper.feature.inputFeatureSpace }}
                    </div>
                </div>
            </div>
        </div>
        <div class="summary">
            <div
                class="summary-item"
                v-if="Object.keys(paper.tasks).length > 0"
            >
                <div
                    class="summary-item-name"
                    :style="{ backgroundColor: '#e6f7ff' }"
                >
                    Task:
                </div>
                <div class="summary-task">
                    <div
                        v-for="(taskContent, idx) in paper.tasks"
                        :key="idx"
                        class="summary-task-content"
                    >
                        <span class="summary-task-name">
                            T{{ idx + 1 }}: {{ formatter(taskContent.task) }}:
                        </span>
                        <div
                            v-for="(axisValue, axisName) in taskContent.label"
                            :key="axisName"
                            class="summary-task-axis"
                        >
                            <b>{{ formatter(axisName) }}:</b>
                            {{ formatter(axisValue) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <a-divider orientation="left" :style="{ margin: '0px 0px 10px 0px' }">
            Paper Content
        </a-divider>
        <div class="content">
            <div v-for="(label, index) in labels" :key="label[0]">
                <div class="content-row" v-if="isShowing[index][1]">
                    <div
                        :class="[
                            'sectionTitle',
                            sectionLevel[label[0].split('.').length - 1],
                        ]"
                    >
                        <div v-if="!hasChild(index)">
                            <DownOutlined
                                :style="{ color: 'white', fontSize: '12px' }"
                            />
                        </div>
                        <div v-else>
                            <DownOutlined
                                :rotate="rotations[index]"
                                :style="{ fontSize: '12px' }"
                                @click="showSections(index)"
                            />
                        </div>
                        <div style="text-transform: capitalize">
                            {{ label[1] }}
                        </div>
                    </div>
                    <div
                        class="label"
                        v-if="label.length > 2 && label[2].length > 1"
                    >
                        <template
                            v-for="labelTag in label[2].split('|')"
                            :key="labelTag"
                        >
                            <a-tag
                                :class="[
                                    labelTag[0] !== 'F'
                                        ? 'label-task'
                                        : 'label-feature',
                                ]"
                                :style="{
                                    margin: '1px 3px 1px 3px',
                                    padding: '0px 5px',
                                }"
                            >
                                <!-- <MonitorOutlined :style="{marginRight: '3px'}"/> -->
                                <b>{{ formatTaskName(labelTag) }}</b>
                                {{ formatLabel(labelTag) }}
                            </a-tag>
                        </template>
                        <div
                            class="remark"
                            v-if="label.length > 3 && label[3].length > 1"
                        >
                            <a-tooltip>
                                <template v-slot:title>
                                    {{ getRemark(label) }}
                                </template>
                                <InfoCircleTwoTone
                                    :style="{ paddingLeft: '2px' }"
                                />
                            </a-tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script lang="ts">
import { computed, reactive, toRefs, onMounted } from "vue";
import axios from "axios";
import {
    InfoCircleTwoTone,
    DownOutlined,
    MonitorOutlined,
} from "@ant-design/icons-vue";
import { formatter } from "@/utils/helper";
import { taskName } from "@/utils/filters";

export default {
    props: {
        isVisible: { type: Boolean },
        paper: { type: Object },
    },
    components: {
        InfoCircleTwoTone,
        DownOutlined,
        MonitorOutlined,
    },
    setup(props: any, context: any) {
        const state = reactive({
            labels: new Array(),
            tags: new Set(),
            rotations: new Array(),
            isShowing: new Array(),
            taskName: taskName,
        });

        const getTags = async () => {
            let data = (
                await axios.get(`./paperSectionLabels/${props.paper.idx}.csv`)
            ).data;
            let rows = data.split("\n");
            state.labels = [];
            state.tags.clear();
            rows.map((row: string, index: number) => {
                // delete the table head
                if (index !== 0) {
                    let tmp = row.split(",");
                    // the row is not empty
                    if (tmp.length > 1) {
                        state.labels[index - 1] = tmp;
                        if (tmp.length > 2 && tmp[2].length > 1) {
                            // this row has labels
                            let sectionNumber = tmp[0].split(".");
                            // e.g., sec. 3.2.2 has labels, section 3 and 3.2 should be unfolded initially
                            if (sectionNumber.length === 3) {
                                state.tags.add(sectionNumber[0]);
                                state.tags.add(
                                    sectionNumber[0] + "." + sectionNumber[1]
                                );
                            }
                            // e.g., sec. 3.2 has labels, section 3 should be unfolded, but section 3.2 is folded initially
                            else if (sectionNumber.length === 2) {
                                state.tags.add(sectionNumber[0]);
                            }
                        }
                    }
                }
            });
            state.rotations = state.labels.map((label) => {
                let sectionNumber = label[0].split(".");
                if (
                    sectionNumber.length === 1 &&
                    state.tags.has(sectionNumber[0])
                )
                    return 0;
                // else if (sectionNumber.length === 2 && (state.tags.has(sectionNumber[0]) || state.tags.has(sectionNumber[0]+'.'+sectionNumber[1])))
                else if (
                    sectionNumber.length === 2 &&
                    state.tags.has(sectionNumber[0] + "." + sectionNumber[1])
                )
                    return 0;
                return -90;
            });

            let sectionLabel = 0;
            state.isShowing = state.labels.map((label, index) => {
                let sectionNumber = label[0].split(".");
                if (sectionNumber.length === 1) {
                    sectionLabel = index;
                    return [sectionLabel, true];
                } else if (sectionNumber.length === 2) {
                    if (state.rotations[sectionLabel] === 0) {
                        return [sectionLabel, true];
                    } else {
                        return [sectionLabel, false];
                    }
                } else if (sectionNumber.length === 3) {
                    if (
                        state.rotations[index - Number(sectionNumber[2])] === 0
                    ) {
                        return [sectionLabel, true];
                    } else {
                        return [sectionLabel, false];
                    }
                }
            });
            // console.log('in PaperDetail:', state.labels, state.tags, state.rotations)
        };
        onMounted(getTags);

        const sectionLevel = ["section", "subSection", "subSubSection"];

        const handleCancel = (e: any) => {
            context.emit("update:isVisible", !props.isVisible);
        };

        const hasChild = (index: number) => {
            if (index === state.labels.length - 1) return false;
            let current = state.labels[index][0].split(".");
            let next = state.labels[index + 1][0].split(".");
            if (current.length < next.length) {
                return true;
            }
            return false;
        };

        const getRemark = (label: string[]) => {
            let remark = label[3];
            for (let i = 4; i < label.length; i++) {
                remark = remark + "," + label[i];
            }
            return remark;
        };

        const showSections = (index: number) => {
            let sectionNumber = state.labels[index][0].split(".");
            state.rotations[index] = state.rotations[index] === -90 ? 0 : -90;
            if (sectionNumber.length === 2) {
                // e.g., section 3.2
                for (
                    let i = index + 1;
                    i < state.labels.length &&
                    state.labels[i][0].split(".").length === 3;
                    i++
                ) {
                    state.isShowing[i][1] =
                        state.rotations[index] === -90 ? false : true;
                }
            } else if (sectionNumber.length === 1) {
                // e.g., section 3
                for (
                    let i = index + 1;
                    i < state.labels.length && state.isShowing[i][0] === index;
                    i++
                ) {
                    state.isShowing[i][1] =
                        state.rotations[index] === -90 ? false : true;
                    if (state.labels[i][0].split(".").length === 2) {
                        state.rotations[i] =
                            state.rotations[index] === -90 ? -90 : 0;
                    }
                }
            }
        };

        const formatLabel = (label: string) => {
            if (label.search("Transformation") > -1) {
                return "[G2G]";
            }
            let subLabel = label.substring(label.indexOf("["), label.length);
            const regex = /\[[A-Za-z\-]+\]/g;
            let detail = "";
            let tmp = subLabel.match(regex);
            if (tmp) {
                let t = tmp as string[];
                detail = tmp.map((i) => "[" + formatter(i) + "]").join("");
            }
            return detail;
        };

        const formatTaskName = (label: string) => {
            let taskName = label.substring(0, label.indexOf("["));
            if (taskName === "Feature") {
                return taskName;
            } else {
                let subLabel = label.substring(
                    label.indexOf("["),
                    label.length
                );
                const regex = /\[[A-Za-z\-]+\]/g;
                let tmp = subLabel.match(regex) as string[];
                if (subLabel.search("[G2G]") > -1) tmp = ["[G2G]"];
                if (tmp) {
                    let subLabels = tmp.map((s) =>
                        s.substring(1, s.length - 1)
                    );
                    let index = 0;
                    for (let pt of props.paper.tasks) {
                        if (pt.task === taskName) {
                            let idx = 0;
                            let notMatch = false;
                            for (let axis of Object.entries(pt.label)) {
                                if (
                                    axis[1] !== subLabels[idx] &&
                                    axis[1] !== ""
                                ) {
                                    notMatch = true;
                                    break;
                                }
                                idx += 1;
                            }
                            if (!notMatch) break;
                        }
                        index += 1;
                    }

                    return `T${index + 1}: ${formatter(taskName)}`;
                }
            }
        };

        const formatterAuthor = (authors: string[]) => {
            return authors
                .map((author) => {
                    let tmp = author.split(",");
                    let output = "";
                    for (let idx = tmp.length - 1; idx > -1; idx--) {
                        output += " " + tmp[idx];
                    }
                    return output;
                })
                .join(", ");
        };

        const formatterApplication = (application: string) => {
            const regex = /\[[A-Za-z]+\]/g;
            let tmp = application.substring(
                application.search(regex) + 1,
                application.length - 1
            );
            let output =
                application.substring(0, application.search(regex)) +
                ": " +
                formatter(tmp);
            return output;
        };

        return {
            ...toRefs(state),
            sectionLevel,
            handleCancel,
            hasChild,
            getRemark,
            showSections,
            formatter,
            formatLabel,
            formatTaskName,
            formatterAuthor,
            formatterApplication,
        };
    },
};
</script>

<style scoped>
.content {
    margin: 0px 10px;
}
.badge {
    margin-top: -3px;
    display: inline-block;
    min-width: 10px;
    padding: 3px 7px;
    font-size: 12px;
    line-height: 1;
    color: rgba(0, 0, 0, 0.65);
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    background-color: #bae7ff;
    border-radius: 10px;
}
.summary {
    padding: 0px 0px 0px 25px;
    display: flex;
    margin-bottom: 20px;
}

.summary-item {
    display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
}
.summary-item-name {
    background-color: #fafafa;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    padding: 3px 15px 3px 5px;
    border-bottom: 1px solid #ddd;
}
.summary-item-content {
    display: flex;
    flex-direction: column;
    padding: 3px 15px 3px 5px;
    font-size: 14px;
}
.summary-item-content b {
    font-weight: 500;
}
.summary-task {
    display: flex;
}
.summary-task-name {
    font-size: 14px;
    font-weight: 600;
}
.summary-task-axis {
    padding: 2px 10px 2px 23px;
    font-size: 12px;
}
.summary-task-content {
    padding: 3px 5px;
    border-right: 1px solid #ddd;
}
.summary-task-content:last-child {
    border-right: 0px;
}
.summary-task-content b {
    font-weight: 500;
    font-style: italic;
}
.content-row {
    display: flex;
    justify-content: space-between;
}
.label {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    width: 300px;
    margin: 1.5px 0px;
}
.label b {
    font-weight: 500;
}
.sectionTitle {
    display: flex;
    align-items: center;
}
.section {
    font-weight: 500;
    font-size: 16px;
    padding: 2px 0px;
}
.subSection {
    transform: translate(20px, 0px);
    padding: 1px 0px;
}
.subSubSection {
    transform: translate(40px, 0px);
    font-size: 12px;
}
.anticon-down {
    padding-right: 5px;
}
.anticon-right {
    padding-right: 5px;
}
.label-feature {
    color: #1ac43f;
    background: #e8fcd4;
    border-color: #b7eb8f;
}
.label-task {
    color: #1890ff;
    background: #e6f7ff;
    border-color: #91d5ff;
}
.ant-divider-horizontal.ant-divider-with-text-left::before,
.ant-divider-horizontal.ant-divider-with-text-left::after {
    border-top: 1px solid #bbb;
}
p {
    margin-bottom: 2px;
}
</style>