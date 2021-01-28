<template>
    <div class="siderbar">
        <div class="stat">
            <h3 class="filterHeader">Paper Displayed</h3>
            <h2>{{ filterPapers.length }} / {{ paperList.length }}</h2>
        </div>
        <TimeFilter></TimeFilter>
        <div class="scroll">
            <OtherFilter></OtherFilter>
            <FeatureFilter></FeatureFilter>
            <TaskFilter></TaskFilter>
            <AppFilter></AppFilter>
        </div>
    </div>
</template>

<script lang='ts'>
import { onMounted, computed, reactive, toRefs, watch } from "vue";
import { useStore } from "vuex";
import TimeFilter from "./TimeFilter.vue";
import TaskFilter from "./TaskFilter.vue";
import FeatureFilter from "./FeatureFilter.vue";
import OtherFilter from "./OtherFilter.vue";
import AppFilter from "./AppFilter.vue";

export default {
    name: "Filter",
    components: {
        TimeFilter,
        TaskFilter,
        FeatureFilter,
        OtherFilter,
        AppFilter,
    },
    setup() {
        const store = useStore();

        const state = reactive({
            paperList: computed(() => store.state.paperList as PaperList[]),
            filterPapers: computed(
                () => store.getters.filterPapers as PaperList[]
            ),
        });

        return {
            ...toRefs(state),
        };
    },
};
</script>

<style scoped>
.siderbar {
    margin-top: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.filterHeader {
    font-size: 20px;
    margin-bottom: 6px;
    font-weight: 600;
}
.stat {
    padding: 10px 15px;
    border-bottom: 1px solid #ddd;
    border-radius: 4px;
}
.stat h2 {
    font-size: 28px;
    line-height: 28px;
    font-weight: bold;
    margin: 0px;
    text-align: center;
}
.scroll {
    overflow-y: scroll;
    height: 770px;
}
.scroll::-webkit-scrollbar {
    width: 5px;
}
.scroll::-webkit-scrollbar-track {
    border-radius: 5px;
    background-color: #f7f7f7;
}

.scroll::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: lightblue;
}
</style>