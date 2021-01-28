<template>
    <div id="time-filter">
        <h3 class="filterHeader">Filter by Publish Year</h3>
        <a-slider
            range
            v-model:value="yearRange"
            :min="startYear"
            :max="endYear"
            :step="1"
            :marks="marks"
            :tip-formatter="formatSlider"
        />
        <div class="distribution">
            <div
                v-for="(cnt, index) in yearCnt"
                :key="index"
            >
                <a-tooltip v-if="index < 3" placement="topLeft">
                    <template #title>
                        {{ formatSlider(Number(index) + startYear) }}:
                        {{ cnt }} papers in this year, {{ filterYearCnt[index] }} selected
                    </template>
                    <div :style="{ height: `${cnt * 2}px` }" class="bar">
                        <div 
                            :style="{ height: `${filterYearCnt[index] * 2}px`}"
                            class = "inner-bar"
                            :class="{
                                unselected: index < yearRange[0] - startYear || index > yearRange[1] - startYear,
                            }"
                        >
                        </div>
                    </div>
                </a-tooltip>

                <a-tooltip v-else placement="top">
                    <template #title>
                        {{ formatSlider(Number(index) + startYear) }}:
                        {{ cnt }} papers in this year, {{ filterYearCnt[index] }} selected
                    </template>
                    <div :style="{ height: `${cnt * 2}px` }" class="bar">
                        <div 
                            :style="{ height: `${filterYearCnt[index] * 2}px`}"
                            class = "inner-bar"
                            :class="{
                                unselected: index < yearRange[0] - startYear || index > yearRange[1] - startYear,
                            }"
                        >
                        </div>
                    </div> 
                </a-tooltip>
            </div>
        </div>
    </div>
</template>
<script lang='ts'>
import { computed, reactive, toRefs, h, watch } from "vue";
import { useStore } from "vuex";

export default {
    name: "TimeFilter",
    components: {},
    setup() {
        const store = useStore();

        const startYear = 2010;
        const endYear = 2020;

        const state = reactive({
            paperList: computed(() => store.state.paperList as PaperList[]),
            yearCnt: computed(() =>
                computeYearCnt(store.state.paperList as PaperList[])
            ),
            filterYearCnt: computed(() => 
                computeYearCnt(store.getters.filterPapers as PaperList[])
            ),
            yearRange: [startYear, endYear],
            marks: {
                [startYear]: {
                    style: {
                        marginTop: "1px",
                        transform: "translate(-10px, 0px)",
                    },
                    label: h("b", "2010 and early"),
                },
                [endYear]: {
                    style: {
                        marginTop: "1px",
                    },
                    label: h("b", "2020"),
                },
            },
        });

        const computeYearCnt = (paperList: PaperList[]) => {
            let yearCnt = [...new Array(endYear - startYear + 1)].map(
                (i) => 0
            ) as number[];
            paperList.map((paper) => {
                // compute year
                if (Number(paper.year) <= startYear) {
                    yearCnt[0]++;
                } else {
                    yearCnt[Number(paper.year) - startYear]++;
                }
            });
            return yearCnt;
        };

        const formatSlider = (value: number) => {
            // console.log(value)
            if (value === startYear) {
                return `${value} and early`;
            } else return value;
        };

        watch(
            () => state.yearRange,
            (yr, prevCount) => {
                let filterPayload: FilterPayload = {
                    type: 'time',
                    content: yr
                }
                store.commit('filter', filterPayload)
            }
        );

        return {
            ...toRefs(state),
            startYear, 
            endYear,
            formatSlider,
        };
    },
};
</script>

<style scoped>
#time-filter {
    padding: 10px 15px;
    border: 1px solid #ddd;
}
.filterHeader {
    font-size: 20px;
    margin-bottom: 2px;
    font-weight: 600;
}
.distribution {
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 266px;
    display: flex;
    align-items: flex-end;
    padding-top: 5px;
}
.distribution .bar {
    border-left: 0.5px solid #ddd;
    border-right: 0.5px solid #ddd;
    border-top: 0.5px solid #ddd;
    width: 24px;
    display: flex;
    flex-direction: column-reverse;
}
.distribution .inner-bar {
    background: lightblue;
}
.distribution .unselected {
    background: transparent;
    transition: background 0.8s;
}
</style>