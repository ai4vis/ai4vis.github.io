<template>
    <div id="what" class="myComponent">
        <div class="heading">What is Visualization Data</div>
        <div class="supplymentary">
            We define visualization data as the digital representations of
            visualizations in computers. Visualization data can be stored in
            different content formats such as graphics and programs. The choice
            of content formats directly influences the downstream operation
            possibly on the visualization data, since different content formats
            have their own advantages and disadvantages.
        </div>
        <div class="cardWrapper">
            <div class="card" v-for="goal in dataformats" :key="goal.goal">
                <h5>{{ goal.goal }}</h5>
                {{ goal.description }} <br />

                <img :src="require(`@/assets/${goal.image}`)" height="50" />

                <a-button type="primary" @click="showModal(goal)">
                    Show Details
                </a-button>
            </div>
        </div>

        <div class="supplymentary">
            Now that we have considered the different content formats of raw
            visualization data, the next challenge is its representation in AI
            approaches.
        </div>
        <div class="cardWrapper">
            <div class="card" v-for="rep in representations" :key="rep.name">
                <h5>{{ rep.name }}</h5>
                {{ rep.description }} <br />

                <img :src="require(`@/assets/${rep.image}`)" height="50" />
            </div>
        </div>

        <a-modal
            :visible="modalVisible"
            :width="800"
            :footer="null"
            @cancel="handleCancel"
        >
            <h5 class="cardHeading">{{ modalGoal.goal }}</h5>
            {{ modalGoal.description }} <br />
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
                            <span v-if="subcategory.example.length">
                                <b>Examples:</b>
                                <span class="example">{{
                                    subcategory.example
                                }}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script lang='ts'>
import { reactive, toRefs } from "vue";

const DATAFORMATS: GoalCard[] = [
    {
        goal: "Graphics",
        image: "graphics.png",
        description:
            "Graphics are a natural and expressive content format of visualizations since visualizations are defined as a graphical representation of data.",
        subcategories: [
            {
                subcategory: "Raster Graphics",
                description:
                    "It is common to author and store visualization as raster graphics (bitmaps) for easy usage and sharing. However, raster graphics are a standalone and lossy representation of visualizations which loses the visualization semantics.",
                example: "",
            },
            {
                subcategory: "Vector Graphics",
                description:
                    "Vector graphics represents a less lossy alternative. They have advantages over raster graphics in that they can be scalable up without aliasing. Visualizations are usually stored in the Scalable Vector Graphics (SVG) forma, which allows describing visual elements as shapes (e.g., rectangles and text) with styles (e.g., positions and fill-color).",
                example: "",
            },
        ],
    },
    {
        goal: "Program",
        image: "program.png",
        description:
            "Researchers have developed approaches for describing and storing visualizations as computer programs. Programs retain necessary information to construct the visualization like the underlying data.",
        subcategories: [
            {
                subcategory: "Imperative",
                description:
                    "Imperative visualization languages require users to specify step-by-step commands to create the visualization. Programs by imperative languages are open-ended and thus allow the flexible creation of visualizations.",
                example:
                    'Bostock, Michael, Vadim Ogievetsky, and Jeffrey Heer. "D³ data-driven documents." IEEE transactions on visualization and computer graphics 17.12 (2011): 2301-2309.',
            },
            {
                subcategory: "Declarative",
                description:
                    "Declarative visualization languages ask programmers to directly describe the desired results, which is usually referred to visualization specifications. They encapsulate step-by-step commands for visualization reconstruction into semantic components such as data encodings, axes and legend properties.",
                example:
                    'Satyanarayan, Arvind, et al. "Vega-lite: A grammar of interactive graphics." IEEE transactions on visualization and computer graphics 23.1 (2016): 341-350.',
            },
        ],
    },
    {
        goal: "Hybrid",
        image: "hybrid.png",
        description:
            "Recent research proposes several hybrid content formats that incorporate the benefits of both graphics and programs.",
        subcategories: [
            {
                subcategory: "Embed programs into graphics",
                description:
                    "They conceal visualization specifications and meta information within the bitmap image.",
                example:
                    'Zhang, Peiying, Chenhui Li, and Changbo Wang. "VisCode: Embedding Information in Visualization Images using Encoder-Decoder Network." IEEE Transactions on Visualization and Computer Graphics (2020).',
            },
            {
                subcategory: "Organize graphics by programs",
                description:
                    "It formulates interface visualizations as a standalone object built on an action tree. Each intermediate node of the tree represents an interactive actions such as hovering and clicking, and the leaf node stores the resulting visualization image. Therefore, users can interact with the graphics as if they have assess to the original source code and software.",
                example:
                    'Raji, Mohammad, et al. "Dataless Sharing of Interactive Visualization." IEEE Transactions on Visualization and Computer Graphics (2020).',
            },
        ],
    },
];

const REPRESENTATION = [
    {
        name: "Interal Representation",
        image: "internalRepresentation.png",
        description:
            "Visualization programs contain details (e.g. visual style) or semantics (e.g. chart type) that might not meet particular needs of research. Thus, systems express and operate on visualizations in more structured formats by removing unnecessary specifications and adding customized information, which we refer to as internal representations.",
    },

    {
        name: "Feature Engineering",
        image: "featureEng.png",
        description:
            "Feature engineering is the process of using domain knowledge to extract features from raw data. Features are the measurable properties serving as the input to machine learning models. We classify existing approaches according to the feature space, including graphics, program, text and underlying data.",
    },
    {
        name: "Feature Learning",
        image: "featureLearn.png",
        description:
            "Feature learning replaces the manual process by developing automated approaches that automatically discover useful representations (e.g. CNN, Auto-encoder). We classify existing approaches according to the feature space, including graphics, program, text and underlying data.",
    },
];

export default {
    components: {},
    setup() {
        const state = reactive({
            dataformats: DATAFORMATS,
            representations: REPRESENTATION,
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

<style scoped lang="scss">
.modalContent {
    color: #2b2f33;
}
.cardContent {
    margin-top: 20px;
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