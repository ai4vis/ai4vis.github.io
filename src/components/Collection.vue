<template>
    <div v-if="paperList.length > 0" class="myContainer">
        <div class="controls">
            <!-- <h1 class="title">AI4VIS Survey</h1> -->
            <!-- <a class="about" href="">About</a> -->
            <Filter> </Filter>
        </div>
        <div class="paperList">
            <div
                class="paper"
                v-for="paper in filterPapers"
                :key="paper.idx"
                @click="showDetails(paper)"
            >
                <div :style="{ display: 'flex', justifyContent: 'center' }">
                    <img
                        class="paper-thumbnail"
                        :src="`./thumbnail/${paper.idx}.png`"
                    />
                </div>
                <span class="paperTitle">
                    <b> {{ paper.title }} </b>
                </span>
                <div>
                    <a-tooltip>
                        <template #title>
                            {{ paper.journal }}
                        </template>
                        <a-tag class="paperVenue">{{ paper.venue }}</a-tag>
                    </a-tooltip>
                    <a-tag class="paperYear">{{ paper.year }}</a-tag>
                </div>
            </div>
            <PaperDetail
                v-if="isVisible"
                v-model:isVisible="isVisible"
                v-model:paper="selectedPaper"
            />
        </div>
    </div>
</template>

<script lang='ts'>
import { onMounted, computed, reactive, toRefs, h } from "vue";
import { useStore } from "vuex";

import PaperDetail from "./PaperDetail.vue";
import Filter from "./Filter/Filter.vue";

export default {
    components: {
        PaperDetail,
        Filter,
    },
    setup() {
        const store = useStore();

        const state = reactive({
            paperList: computed(() => store.state.paperList),
            filterPapers: computed(() => store.getters.filterPapers),
            isVisible: false,
            selectedPaper: {} as PaperList,
        });

        const showDetails = (paper: PaperList) => {
            state.isVisible = true;
            state.selectedPaper = paper;
        };

        const getImgSrc = (imgSrc: string) => {
            return;
        };

        return {
            ...toRefs(state),
            showDetails,
            getImgSrc,
        };
    },
};
</script>

<style scoped lang="scss">
.myContainer {
    display: flex;
    margin: 5px 10px;
}
.controls {
    flex-direction: column;
    min-width: 300px;
    max-width: 300px;
}

.about {
    text-decoration: none;
    border-bottom: 1px solid;
}
.paperList {
    margin-left: 8px;
    padding: 5px;
    display: flex;
    flex-wrap: wrap;
}
.paper {
    width: 280px;
    height: 280px;
    margin: 5px 10px;
    padding: 5px 10px;
    border: 1px solid lightgrey;
    border-radius: 4px;
    box-shadow: 3px 3px 3px 1px #e8e8e8;;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.paper-thumbnail {
    height: 150px;
    display: block;
    border: 0;
    margin-bottom: 5px;
    overflow: hidden;
}
.paperTitle {
    line-height: 125%;
    margin-bottom: 4px;
}
.paperVenue {
    background-color: #eeeeee;
}
.paperYear {
    background-color: transparent;
    border-color: transparent;
    padding: 0px;
}
.paper:hover {
    box-shadow: 4px 4px 10px 1px lightblue;
}
</style>