<template>
    <div
        v-for="(filterName, index) in otherFilterNames"
        :key="index"
        class="filter-panel"
    >
        <div class="filter-name">
            <h3>{{ formatter(filterName) }}</h3>
            <CloseSquareTwoTone  
                v-show="isSelected(filterName)"
                :style="{fontSize: '16px', marginLeft: '5px', paddingTop: '4px'}"
                @click="cancelAll(filterName)"
            />
        </div>
        <div 
            class="filter-others"
        >
            <a-tag
                v-for = "filter in otherFilters[index]"
                :key = "filter"
                class = "tag"
                :class = "{checkedTag : checkTag(filter, filterName),
                    isDisable: checkDisable(filter, filterName)
                }"
                @click = "handleChange(filter, filterName)"
            >
                {{ formatter(filter) }}
                {{ calcFilterPapers(filter, filterName) }}
            </a-tag>
        </div>

    </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { formatter } from '@/utils/helper'
import { CloseSquareTwoTone  } from '@ant-design/icons-vue'
import { reactive, toRefs, computed, watch } from 'vue';
import { otherFilterNames, otherFilters } from '@/utils/filters';

export default {
    name: 'OtherFilter',
    components: {
        CloseSquareTwoTone ,
    },
    setup() {
        const store = useStore();

        const state = reactive({
            filterPaper: computed(() => store.getters.filterPapers as PaperList[]),
            selectedOthers: {
                venueField: [] as string[],
                visDataFormat: [] as string[],
            } as OtherFilters,
            activeOtherFilters: computed(() => store.getters.activeTags.otherFilters),
            otherFilterNames: otherFilterNames,
            otherFilters: otherFilters,
        })

        const handleChange = (tag: string, filterName: string) => {
            if (!checkDisable(tag, filterName)) {
                let tmp = filterName.split(' ').join('')
                tmp = tmp[0].toLowerCase() + tmp.substring(1)
                let fName = tmp as keyof OtherFilters
                let idx = state.selectedOthers[fName].indexOf(tag)
                if ( idx === -1){
                    state.selectedOthers[fName].push(tag)
                }
                else {
                    state.selectedOthers[fName].splice(idx, 1)
                }
            }
        };

        const checkTag = (tag: string, filterName : string) => {
            let tmp = filterName.split(' ').join('')
            tmp = tmp[0].toLowerCase() + tmp.substring(1)
            let fName = tmp as keyof OtherFilters
            if (state.selectedOthers[fName].indexOf(tag) > -1){
                return true     
            }
            else {
                return false
            }
        }

        const checkDisable = (tag: string, filterName: string) => {
            let idx = otherFilterNames.indexOf(filterName)
            if (state.activeOtherFilters[idx].indexOf(tag) > -1){
                return true
            }
            else
                return false
        }

        const isSelected = (filterName: string) => {
            let tmp = filterName.split(' ').join('')
            tmp = tmp[0].toLowerCase() + tmp.substring(1)
            let fName = tmp as keyof OtherFilters
            if (state.selectedOthers[fName].length > 0)
                return true
            else
                return false
        }
        
        const cancelAll = (filterName: string) => {
            let tmp = filterName.split(' ').join('')
            tmp = tmp[0].toLowerCase() + tmp.substring(1)
            let fName = tmp as keyof OtherFilters
            state.selectedOthers[fName] = [] 
        }

        const calcFilterPapers = (tag: string, filterName: string) => {
            if (!checkDisable(tag, filterName)) {
                const results = state.filterPaper.filter(paper => {
                    // @ts-ignore
                    return paper[filterName] === tag
                })
                return `(${results.length})`
            }
            else
                return '(0)'
        }

        watch(
            () => state.selectedOthers,
            (newFilters, prevFilters) => {
                let filterPayload: FilterPayload = {
                    type: 'otherFilters',
                    content: state.selectedOthers
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
            isSelected,
            cancelAll,
            checkDisable,
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
.filter-name {
    display: flex;
    justify-content: space-between;
}
.filter-name h3 {
    font-weight: 600;
    font-size: 20px;
}
.filter-others {
    display: flex;
    flex-wrap: wrap;
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