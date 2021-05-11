<template>
    <div class="filter-panel">
        <div class="filter-name">
            <h3>Representation</h3>
            <CloseSquareTwoTone  
                v-show="Object.keys(selectedFeatures).length > 0"
                :style="{fontSize: '16px', marginLeft: '5px', paddingTop: '4px'}"
                @click="cancelAll"
            />
        </div>
        <div class="feature-row">
            <div
                v-for = "(feature, axisName) in features"
                :key = "axisName"
            >
                <a-tag class="axis-name">
                        {{ formatter(axisName) }}
                </a-tag>
                <a-tag
                    v-for = "label in feature"
                    :key = "label"
                    class = "tag"
                    :class = "{checkedTag : checkTag(label, axisName), 
                        isDisable: checkDisable(label, axisName)
                    }"
                    @click = "handleChange(label, axisName)"
                >
                    {{ formatter(label) }}
                    {{ calcFilterPapers(label, axisName) }}
                </a-tag>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { formatter } from '@/utils/helper'
import { CloseSquareTwoTone  } from '@ant-design/icons-vue'
import { reactive, toRefs, computed, watch } from 'vue';
import { features } from '@/utils/filters';


export default {
    name: 'FeatureFilter',
    components: {
        CloseSquareTwoTone ,
    },
    setup() {
        const store = useStore();

        const state = reactive({
            filterPaper: computed(() => store.getters.filterPapers as PaperList[]),
            selectedFeatures: {} as FEATURE,
            activeFeatures: computed(() => store.getters.activeTags.feature),
            features: features
        })

        const handleChange = (tag: any, axisName: string) => {
            if (!checkDisable(tag, axisName)){
                let tmp = axisName[0].toLowerCase() + axisName.substring(1)
                let aName = tmp as keyof FEATURE
                // no such axis in this feature has been selected
                // OR select other labels in this axis
                if (Object.keys(state.selectedFeatures).indexOf(aName) === -1 
                    || state.selectedFeatures[aName] !== tag) {
                    state.selectedFeatures[aName] = tag
                }
                // cancel the selection
                else if (state.selectedFeatures[aName] === tag) {
                    // only this axis has been selected
                    if (Object.keys(state.selectedFeatures).length === 1) {
                        state.selectedFeatures = {}
                    }
                    else {
                        let index = 1 - Object.keys(state.selectedFeatures).indexOf(aName)
                        let anotherAxis = Object.keys(state.selectedFeatures)[index] as keyof FEATURE
                        state.selectedFeatures = {
                            [anotherAxis]: state.selectedFeatures[anotherAxis]
                        }
                    }
                }
            }
            
        };

        const checkTag = (tag: any, axisName: string) => {
            let tmp = axisName[0].toLowerCase() + axisName.substring(1)
            let aName = tmp as keyof FEATURE
            if (state.selectedFeatures[aName] === tag)
                return true
            
            else
                return false
        }

        const cancelAll = () => {
            state.selectedFeatures = {}
        }

        const checkDisable = (tag: any, axisName: string) => {
            if (state.activeFeatures[axisName].indexOf(tag) > -1){
                return true
            }
            else
                return false
        }

        const calcFilterPapers = (tag: string, axisName: string) => {
            if (!checkDisable(tag, axisName)) {
                const results = state.filterPaper.filter(paper => {
                    if (paper.feature) {
                        for (let ent of Object.entries(paper.feature)) {
                            if (axisName === ent[0] && tag === ent[1]) {
                                return true
                            }
                        }
                        return false
                    }
                    else
                        return false
                })
                return `(${results.length})`
            }
            else
                return '(0)'
        }

        watch(
            () => state.selectedFeatures,
            (newFeatures, prevFilters) => {
                let filterPayload: FilterPayload = {
                    type: 'feature',
                    content: state.selectedFeatures
                }
                store.commit('filter', filterPayload)
            },
            {deep: true}
        )


        return {
            ...toRefs(state),
            formatter,
            handleChange,
            checkTag,
            cancelAll,
            checkDisable,
            calcFilterPapers,
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
.filter-name {
    display: flex;
    justify-content: space-between;
}
.filter-name h3 {
    font-weight: 600;
    font-size: 20px;
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
    margin-right: 4px;
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