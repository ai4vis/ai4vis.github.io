<template>
    <div id="why" class="myComponent">
        <div class="heading">How Apply AI to Visualization Data</div>
        <div class="supplymentary">We organize the AI approaches with a novel task abstraction. We identify
        7 common tasks for AI4VIS research. A technique paper typically solves a
        single task, while a system paper could consist of multiple components
        each for different tasks. As such, we aim to decompose system papers
        into abstract tasks that allow for a collectively-exhaustive taxonomy of
        tasks. Besides, due to the interdisciplinary nature of our corpus, we
        find tasks are usually described in inconsistent vocabularies. We wish
        to establish a common vocabulary that enables consistent discussions for
        researchers from different areas to communicate the relevance and
        subtleties.</div>
        <div class="cardWrapper">
            <div class="card" v-for="task in tasks" :key="task.name">
                <h5>{{ task.name }}</h5>
                {{ task.description }} <br />

                <img :src="require(`@/assets/${task.image}`)" height="50" />

                <a-button type="primary" @click="showModal(task)">
                    Show Details
                </a-button>
            </div>
        </div>

        <a-modal
            :visible="modalVisible"
            :width="800"
            :footer="null"
            @cancel="handleCancel"
        >
            <h5 class="cardHeading">{{ modalGoal.name }}</h5>
            {{ modalGoal.details.description }} <br />
            
            <div :style="{marginTop: '15px', marginBottom: '10px'}">
                <img
                    :src="require(`@/assets/${modalGoal.details.image}`)"
                    width="400"
                />
            </div>
            <div
                class="cardContent"
                v-for="subcategory in modalGoal.details.categories"
                :key="subcategory.name"
            >
                <a-tag color="green">{{ subcategory.name }}</a-tag
                ><br />
                <div
                    v-for="method in subcategory.childern"
                    :key="method.name"
                >
                    <div class="methodName">{{ method.name }} </div>
                    <span v-if="method.description.length > 0">
                        {{ method.description }}   <br />

                    </span>
                    <span v-if="method.example.length > 0">
                        <b :style="{fontWeight: '500'}">Examples:</b> <span class="example">{{ method.example }}</span>
                    </span>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script lang='ts'>
import { reactive, toRefs } from "vue";

const TASKS: TaskCard[] = [
    {
        name: "Transformation",
        image: "transformation.png",
        description:
            "Transformation is the operation that converts the content formats of visualizations.",
        details: {
            description:
                "It is straightforward to transform visualization programs into graphics by visualization tools or libraries. A more challenging problem is the reverse process, i.e., reconstructing programs from graphics, which we cover in the part. Little research explored the direct transformation in the image space. As such, we do not dedicate a separate discussion on image-to-image transformation at the current stage. Future research could extend our taxonomy with further development in this field.",
            image: "transformationDiagram.png",
            categories: [
                {
                    name: "Method",
                    childern: [
                        {
                            name: "Decomposing",
                            description:
                                "The first phase decomposes visualization graphics into semantic elements (eg axis, mark) through machine learning and computer vision techniques including object detection, classification, and clustering.",
                            example: "",
                        },
                        {
                            name: "Composing",
                            description:
                                "The second phase performs mathematical computation over the decomposed semantic elements to extract visual encoding and/or the underlying data.",
                            example: "",
                        },
                    ],
                },
            ],
        },
    },
    {
        name: "Assessment",
        image: "assessment.png",
        description:
            "It measures the absolute or relative quality of a visualization in terms of scores or rankings",
        details: {
            description:
                "There is a long history of research on teaching machines to assess and rank the quality of data visualizations.",
            image: "assessmentDiagram.png",
            categories: [
                {
                    name: "Output",
                    childern: [
                        {
                            name: "Rankings",
                            description:
                                "To determine the rankings of visualizations.",
                            example:
                                'Mackinlay, Jock. "Automating the design of graphical presentations of relational information." Acm Transactions On Graphics (Tog) 5.2 (1986): 110-141.',
                        },
                        {
                            name: "Scores",
                            description:
                                "Scores are often more desirable since scores measure the absolute quality and therefore benefit down-streaming tasks, e.g., scores can be used as the cost function for optimization.",
                            example:
                                'Moritz, Dominik, et al. "Formalizing visualization design knowledge as constraints: Actionable and extensible models in draco." IEEE transactions on visualization and computer graphics 25.1 (2018): 438-448.',
                        },
                    ],
                },
                {
                    name: "Method",
                    childern: [
                        {
                            name: "Rule-based",
                            description:
                                "Researchers often leverage domain knowledge to design hand-crafted, rule-based metrics that measures the visualization quality.",
                            example:
                                'Ehsan, Humaira, Mohamed A. Sharaf, and Panos K. Chrysanthis. "Muve: Efficient multi-objective view recommendation for visual data exploration." 2016 IEEE 32nd International Conference on Data Engineering (ICDE). IEEE, 2016.',
                        },
                        {
                            name: "Machine Learning",
                            description:
                                "Another line of research seeks to propose more systematical machine learning approaches that learn to rank and/or score visualizations from data collected from empirical studies.",
                            example:
                                'Luo, Yuyu, et al. "Deepeye: Towards automatic data visualization." 2018 IEEE 34th international conference on data engineering (ICDE). IEEE, 2018.',
                        },
                    ],
                },
            ],
        },
    },
    {
        name: "Comparison",
        image: "compare.png",
        description:
            "It estimates the similarity or other metrics between two visualizations.",
        details: {
            description:
                "Characterizing the similarity or other metrics between two visualizations is helpful when dealing with a visualization collection.",
            image: "compareD.png",
            categories: [
                {
                    name: "Method",
                    childern: [
                        {
                            name: "Difference-Based",
                            description:
                                "Perhaps the most straightforward approach for comparing two visualizations is to calculate the difference.",
                            example:
                                'Kim, Younghoon, et al. "Graphscape: A model for automated reasoning about visualization similarity and sequencing." Proceedings of the 2017 CHI Conference on Human Factors in Computing Systems. 2017.',
                        },
                        {
                            name: "Distance-Based",
                            description:
                                "The key idea is to convert a visualization into a feature vector, and compute the distance between two feature vectors according to distance functions.",
                            example:
                                'Vartak, Manasi, et al. "Seedb: Efficient data-driven visualization recommendations to support visual analytics." Proceedings of the VLDB Endowment International Conference on Very Large Data Bases. Vol. 8. No. 13. NIH Public Access, 2015.',
                        },
                    ],
                },
                {
                    name: "Input Space",
                    childern: [
                        {
                            name: "Image Feature",
                            description: "",
                            example:
                                'Saleh, Babak, et al. "Learning style similarity for searching infographics." arXiv preprint arXiv:1505.01214 (2015).',
                        },
                        {
                            name: "Data Feature",
                            description: "",
                            example:
                                'Kandel, Sean, et al. "Profiler: Integrated statistical analysis and visualization for data quality assessment." Proceedings of the International Working Conference on Advanced Visual Interfaces. 2012.',
                        },
                        {
                            name: "Program Feature",
                            description: "",
                            example:
                                'Zhao, Jian, Mingming Fan, and Mi Feng. "ChartSeer: Interactive Steering Exploratory Visual Analysis with Machine Intelligence." IEEE Transactions on Visualization and Computer Graphics (2020).',
                        },
                        {
                            name: "Text Feature",
                            description: "",
                            example:
                                'Oppermann, Michael, Robert Kincaid, and Tamara Munzner. "VizCommender: Computing Text-Based Similarity in Visualization Repositories for Content-Based Recommendations." IEEE Transactions on Visualization and Computer Graphics (2020).',
                        },
                        {
                            name: "Hybrid Feature",
                            description: "",
                            example:
                                'Xu, Shenyu, et al. "Chart Constellations: Effective Chart Summarization for Collaborative and Multi‐User Analyses." Computer Graphics Forum. Vol. 37. No. 3. 2018.',
                        },
                    ],
                },
            ],
        },
    },
    {
        name: "Query",
        image: "query.png",
        description:
            "It refers to the problem of finding the target visualization relevant with a user query within visualization collections.",
        details: {
            description:
                "Querying is the task of retrieving relevant visualizations that satisfy the users' needs from a visualization collection. It is a crucial component of Information Retrieval (IR) systems, which are also known as search engines especially in the context of the web.",
            image: "queryD.png",
            categories: [
                {
                    name: "Method",
                    childern: [
                        {
                            name: "Exact-Match",
                            description:
                                "Exact-match techniques are used for filtering visualizations by strict conditions.",
                            example:
                                'Hoque, Enamul, and Maneesh Agrawala. "Searching the visual style and structure of d3 visualizations." IEEE transactions on visualization and computer graphics 26.1 (2019): 1236-1245.',
                        },
                        {
                            name: "Best-Match",
                            description:
                                "It measure the degree to which a visualization is relevant to the input query.",
                            example:
                                'Chen, Zhe, Michael Cafarella, and Eytan Adar. "Diagramflyer: A search engine for data-driven diagrams." Proceedings of the 24th International Conference on World Wide Web. 2015.',
                        },
                    ],
                },
                {
                    name: "User Input",
                    childern: [
                        {
                            name: "Keywords",
                            description: "",
                            example:
                                'Ray Choudhury, Sagnik, and Clyde Lee Giles. "An architecture for information extraction from figures in digital libraries." Proceedings of the 24th International Conference on World Wide Web. 2015.',
                        },
                        {
                            name: "Natural Language",
                            description: "",
                            example:
                                'Li, Zhuo, et al. "Infographics retrieval: A new methodology." International Conference on Applications of Natural Language to Data Bases/Information Systems. Springer, Cham, 2014.',
                        },
                        {
                            name: "Structural",
                            description: "",
                            example:
                                'Siegel, Noah, et al. "Figureseer: Parsing result-figures in research papers." European Conference on Computer Vision. Springer, Cham, 2016.',
                        },
                        {
                            name: "Example",
                            description: "",
                            example:
                                'Saleh, Babak, et al. "Learning style similarity for searching infographics." arXiv preprint arXiv:1505.01214 (2015).',
                        },
                    ],
                },
            ],
        },
    },
    {
        name: "Reasoning",
        image: "reasoning.png",
        description:
            "It challenges machines to interpret visualizations to derive high-level information such as insights and summaries",
        details: {
            description:
                "Reasoning requires interpreting visualizations to derive high-level information such as insights beyond extracting visual encoding and data via reverse engineering.",
            image: "reasoningD.png",
            categories: [
                {
                    name: "Problem",
                    childern: [
                        {
                            name: "Visual Perceptual Learning",
                            description:
                                "It aims to solve visual tasks by analyzing visual information.",
                            example:
                                'Haehn, Daniel, James Tompkin, and Hanspeter Pfister. "Evaluating ‘graphical perception’with CNNs." IEEE transactions on visualization and computer graphics 25.1 (2018): 641-650.',
                        },
                        {
                            name: "Chart Summarization",
                            description:
                                "It becomes increasingly important with the rapid popularization of visualizations. Most existing approaches generate text summaries such as natural language description or captions",
                            example:
                                'Chen, Charles, et al. "Neural caption generation over figures." Adjunct Proceedings of the 2019 ACM International Joint Conference on Pervasive and Ubiquitous Computing and Proceedings of the 2019 ACM International Symposium on Wearable Computers. 2019.',
                        },                        {
                            name: "Visual Question Answering",
                            description:
                                "It is another emerging research area that aims to answer a natural language question given a visualization image.",
                            example:
                                'Kafle, Kushal, et al. "Dvqa: Understanding data visualizations via question answering." Proceedings of the IEEE conference on computer vision and pattern recognition. 2018.',
                        },
                    ],
                },
                {
                    name: "Method",
                    childern: [
                        {
                            name: "Rule-based",
                            description:
                                "",
                            example:
                                'Kim, Dae Hyun, Enamul Hoque, and Maneesh Agrawala. "Answering questions about charts and generating visual explanations." Proceedings of the 2020 CHI Conference on Human Factors in Computing Systems. 2020.',
                        },
                        {
                            name: "Machine Learning",
                            description:
                                "Another line of research seeks to propose more systematical machine learning approaches that learn to rank and/or score visualizations from data collected from empirical studies.",
                            example:
                                'Kafle, Kushal, et al. "Answering questions about data visualizations using efficient bimodal fusion." Proceedings of the IEEE/CVF Winter Conference on Applications of Computer Vision. 2020.',
                        },
                    ],
                },
            ],
        },
    },
    {
        name: "Recommendation",
        image: "recommendation.png",
        description:
            "It automates the creation of visualizations by suggesting data and/or visual encodings.",
        details: {
            description:
                "Recommendation is an important step for automating the creation of visualizations.",
            image: "recommendationD.png",
            categories: [
                {
                    name: "Method",
                    childern: [
                        {
                            name: "Data Recommendation",
                            description:
                                "It suggests interesting data, insights, or data transformation to be visualized from a database",
                            example:
                                'Demiralp, Cagatay, et al. "Foresight: Recommending Visual Insights." Proceedings of the VLDB Endowment 10.12 (2017).',
                        },
                        {
                            name: "Encoding Recommendation",
                            description:
                                "It determines the visual encoding (including both data and non-data encodings) given the data or other visualization elements",
                            example:
                                'Wu, Aoyu, et al. "MobileVisFixer: Tailoring Web Visualizations for Mobile Phones Leveraging an Explainable Reinforcement Learning Framework." IEEE Transactions on Visualization and Computer Graphics (2020).',
                        },
                                                {
                            name: "Hybrid Recommendation",
                            description:
                                "It decides both data and encodings.",
                            example:
                                'Luo, Yuyu, et al. "Deepeye: Towards automatic data visualization." 2018 IEEE 34th international conference on data engineering (ICDE). IEEE, 2018.',
                        }
                    ],
                },
                {
                    name: "Method",
                    childern: [
                        {
                            name: "Optimization",
                            description:
                                "Optimization requires the careful design of optimization functions which are often the assessment scores.",
                            example:
                                'Luo, Yuyu, et al. "Deepeye: Towards automatic data visualization." 2018 IEEE 34th international conference on data engineering (ICDE). IEEE, 2018.',
                        },
                        {
                            name: "Prediction",
                            description:
                                "Some ML approaches seek to directly learn the mappings between data and visual encodings by training an end-to-end mode.",
                            example:
                                'Hu, Kevin, et al. "Vizml: A machine learning approach to visualization recommendation." Proceedings of the 2019 CHI Conference on Human Factors in Computing Systems. 2019.',
                        },
                    ],
                },
            ],
        },
    },
    {
        name: "Mining",
        image: "mining.png",
        description:
            "It aims to discover insights from visualization databases.",
        details: {
            description:
                "Mining is an emerging task motivated by the rapid popularization and accumulation of visualization data online.",
            image: "miningD.png",
            categories: [
                {
                    name: "Category",
                    childern: [
                        {
                            name: "Mining Design Patterns",
                            description:
                                "The concept of design mining refers to leveraging data mining techniques to derive design principles from existing artifacts.",
                            example:
                    'Battle, Leilani, et al. "Beagle: Automated extraction and interpretation of visualizations from the web." Proceedings of the 2018 CHI Conference on Human Factors in Computing Systems. 2018.',
                        },
                        {
                            name: "Mining Data Patterns",
                            description:
                                "Another line of research aims to explore the data patterns encoded in visualization ensembles.",
                            example:
                                'Zhao, Jian, Mingming Fan, and Mi Feng. "ChartSeer: Interactive Steering Exploratory Visual Analysis with Machine Intelligence." IEEE Transactions on Visualization and Computer Graphics (2020).',
                        },
                    ],
                },
                {
                    name: "Method",
                    childern: [
                        {
                            name: "Statistics",
                            description:
                                "Most systems mostly apply simple statistical analysis",
                            example:
                    'Battle, Leilani, et al. "Beagle: Automated extraction and interpretation of visualizations from the web." Proceedings of the 2018 CHI Conference on Human Factors in Computing Systems. 2018.',
                        },
                        {
                            name: "Clustering",
                            description:
                                "",
                            example:
                                'Smart, Stephen, Keke Wu, and Danielle Albers Szafir. "Color crafting: Automating the construction of designer quality color ramps." IEEE transactions on visualization and computer graphics 26.1 (2019): 1215-1225.',
                        },
                                                {
                            name: "Visual Analytic",
                            description:
                                "It adopts a visual analytic approach by projecting charts into a 2D space whereby supporting clustering analysis and interactive analysis.",
                            example:
                                'Zhao, Jian, Mingming Fan, and Mi Feng. "ChartSeer: Interactive Steering Exploratory Visual Analysis with Machine Intelligence." IEEE Transactions on Visualization and Computer Graphics (2020).',
                        },
                    ],
                },
            ],
        },
    },
];

export default {
    components: {},
    setup() {
        const state = reactive({
            tasks: TASKS,
            modalVisible: false,
            modalGoal: TASKS[0],
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
img {
    display: block;
    margin: auto;
}
.modalContent {
    color: #2B2F33;
}
.methodName {
    font-weight: 700;
    margin-top: 5px;
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