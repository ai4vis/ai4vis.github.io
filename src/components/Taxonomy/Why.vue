<template>
    <div id="why" class="myComponent">
        <div class="heading">Why Apply AI to Visualization Data</div>
        <div class="supplymentary">
            The goals of applying AI to visualization data cover a wide
            spectrum, pursued by research efforts from different areas.
        </div>
        <div class="cardWrapper">
            <div class="card" v-for="goal in goals" :key="goal.goal">
                <h5>{{ goal.goal }}</h5>
                {{ goal.description }} <br />

                <img :src="require(`@/assets/${goal.image}`)" height="50" />

                <a-button type="primary" @click="showModal(goal)">
                    Show Details
                </a-button>
            </div>
        </div>

        <a-modal
            :visible="modalVisible"
            :width="800"
            :footer="null"
            @cancel="handleCancel"
            :class="modalContent"
        >
            <h5 :class="cardHeading">{{ modalGoal.goal }}</h5>
            {{ modalGoal.description }}
            <div class="row" style="margin-top: 10px">
                <div
                    class="col-6"
                    style="padding-bottom: 10px"
                    v-for="subcategory in modalGoal.subcategories"
                    :key="subcategory.subcategory"
                >
                    <div class="modalCardWrapper">
                        <div class="modalCardContent" style="">
                            <a-tag color="#108ee9">{{
                                subcategory.subcategory
                            }}</a-tag>
                            <!-- <div class='card-title'>{{ subcategory.subcategory }}</div> -->
                            <div class="subDesc">
                                {{ subcategory.description }}
                            </div>
                            <b>Examples: </b>
                            <span class="example">{{
                                subcategory.example
                            }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script lang='ts'>
import { reactive, toRefs } from "vue";

const GOALS: GoalCard[] = [
    {
        goal: "Visualization Generation",
        image: "generation.jpg",
        description:
            "Visualization Generation outputs a visualization given different user inputs. Depending on the user input, we identify four subcategories.",
        subcategories: [
            {
                subcategory: "Data-based Generation",
                description:
                    "It outputs visualizations given a database or a data-table. These approaches assist in visual data analysis and have been extensively studied over the last decades.",
                example:
                    'Moritz, Dominik, et al. "Formalizing visualization design knowledge as constraints: Actionable and extensible models in draco." IEEE transactions on visualization and computer graphics 25.1 (2018): 438-448.',
            },
            {
                subcategory: "Anchor-based Generation",
                description:
                    "Visual analysis is an iterative process where the next step of analysis often depends on earlier insights. The problem is to recommend a visualization given an anchor visualization",
                example:
                    'Lin, Halden, Dominik Moritz, and Jeffrey Heer. "Dziban: Balancing agency & automation in visualization design via anchored recommendations." Proceedings of the 2020 CHI Conference on Human Factors in Computing Systems. 2020.',
            },
            {
                subcategory: "Design-based Generation",
                description:
                    "It studies the problem of generating visualizations by injecting the target data to a reference design",
                example:
                    'Harper, Jonathan, and Maneesh Agrawala. "Converting basic D3 charts into reusable style templates." IEEE transactions on visualization and computer graphics 24.3 (2017): 1274-1286.',
            },
            {
                subcategory: "Context-based Generation",
                description:
                    "The input only provides some contextual information such as a natural language description or news articles.",
                example:
                    'Cui, Weiwei, et al. "Text-to-viz: Automatic generation of infographics from proportion-related natural language statements." IEEE transactions on visualization and computer graphics 26.1 (2019): 906-916.',
            },
        ],
    },
    {
        goal: "Visualization Enhancement",
        image: "enhancement.jpg",
        description:
            "Visualization Enhancement processes and applies enhancement to an input visualization. Depending on the output, we identify four subcategories.",
        subcategories: [
            {
                subcategory: "Retarget",
                description: "It convert visualizations to another designs.",
                example:
                    'Savva, Manolis, et al. "Revision: Automated classification, analysis and redesign of chart images." Proceedings of the 24th annual ACM symposium on User interface software and technology. 2011.',
            },
            {
                subcategory: "Interactions",
                description:
                    "Some other work explore adding interactions to visualizations to improve the legibility and interactivity.",
                example:
                    'Kong, Nicholas, and Maneesh Agrawala. "Graphical overlays: Using layered elements to aid chart reading." IEEE transactions on visualization and computer graphics 18.12 (2012): 2631-2638.',
            },
            {
                subcategory: "Captions and Annotations",
                description:
                    "It is also common to summarize visualizations to generate natural language descriptions.",
                example:
                    'Demir, Seniz, Sandra Carberry, and Kathleen F. McCoy. "Summarizing information graphics textually." Computational Linguistics 38.3 (2012): 527-574.',
            },
            {
                subcategory: "Question Answering",
                description:
                    "Related to natural language, several recent research challenges machines to perform question answering, that is, to generate answers given a question.",
                example:
                    'Kafle, Kushal, et al. "Dvqa: Understanding data visualizations via question answering." Proceedings of the IEEE conference on computer vision and pattern recognition. 2018.',
            },
        ],
    },
    {
        goal: "Visualization Analysis",
        image: "analysis.png",
        description:
            "With the increasing availability of visualization data, research has constructed visualization database and investigated methods for managing and analyzing these collections",
        subcategories: [
            {
                subcategory: "Retrieval",
                description:
                    "Retrieval has been largely studied in the field of information systems and databases, helping users search for visualizations that match their needs.",
                example:
                    'Chen, Zhe, Michael Cafarella, and Eytan Adar. "Diagramflyer: A search engine for data-driven diagrams." Proceedings of the 24th International Conference on World Wide Web. 2015.',
            },
            {
                subcategory: "Mining",
                description:
                    "Another promising set of work has started to mine visualization collections to derive useful information such as the visualization usage on web.",
                example:
                    'Battle, Leilani, et al. "Beagle: Automated extraction and interpretation of visualizations from the web." Proceedings of the 2018 CHI Conference on Human Factors in Computing Systems. 2018.',
            },
        ],
    },
];

export default {
    components: {},
    setup() {
        const state = reactive({
            goals: GOALS,
            modalVisible: false,
            modalGoal: {},
        });

        const showModal = (goal: any) => {
            state.modalVisible = true;
            state.modalGoal = goal;
        };
        const handleCancel = (e: any) => {
            state.modalVisible = false;
        };
        return {
            ...toRefs(state),
            showModal,
            handleCancel,
        };
    },
};
</script>

<style lang="scss">
.modalContent {
    color: #2b2f33;
}
.subDesc {
    margin-top: 5px;
}
.subDesc {
    margin-bottom: 3px;
}
.example {
    font-style: italic;
    font-size: 12px;
}
</style>