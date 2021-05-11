<template>
    <div id="overview">
         <div class="heading">Literature Overview</div>
         <div class="supplymentary">
            This table presents an overview of the surveyed papers.
        </div>
        <table>
            <thead>
                <tr class="categories">
                    <td rowspan="1"></td>
                    <th colspan="3">WHY</th>
                    <th colspan="6">WHAT</th>
                    <th colspan="8">HOW</th>
                </tr>
                <tr class="subcategories">
                    <td></td>
                    <th class="subcategory"
                        v-for="(subcate, index) in labels"
                        :key="index"
                        :class="{pad: isLastLabel(index)}"
                    >
                        <div> <span> {{ subcate.name }} </span> </div>
                        <p><label><img :src="require(`@/assets/${subcate.image}`)" height="20"/></label></p>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="paper in paperList"
                    :key="paper.idx"
                >
                    <td>
                        <a class="authors" :href="`#${paper.idx}`"> {{ showAuthors(paper.idx) }} </a>
                    </td>
                    <td
                        v-for="(subcate, index) in labels"
                        :key="index"
                    >
                        <div class="refLabel"
                            :style="{background: isLabeled(paper, subcate)}"
                        ></div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div id="referenceList">
            <div class="heading">Reference List</div>
            <div
                class="citation"
                v-for="paper in paperList"
                :key="paper.idx"
                :id="paper.idx"
            >
                <p>
                    {{ formatterAuthor(paper.authors) }}.
                    ({{ paper.year }})
                    <span><b>{{ paper.title }}.</b></span>
                    {{ ` ` }}
                    <em>{{ paper.journal }}</em>.
                    doi: <a :href="`http://dx.doi.org/${paper.doi}`">{{paper.doi}}</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import { computed, reactive, toRefs } from "vue";
import { useStore } from "vuex";

const whyLabel: OverviewLabel[] = [
    {
        name: "Visualization Generation",
        image: "generation.jpg",
        type: 'Application',
        idx: 'Generation',
    },
    {
        name: "Visualization Enhancement",
        image: "enhancement.jpg",
        type: 'Application',
        idx: 'Enhance'
    },
    {
        name: "Visualization Analysis",
        image: "analysis.png",
        type: 'Application',
        idx: 'Analysis'
    }
]

const whatLabel: OverviewLabel[] = [
    {
        name: "Graphics",
        image: "graphics.png",
        type: 'visDataFormat',
        idx: 'Graphics',
    },
    {
        name: "Program",
        image: "program.png",
        type: 'visDataFormat',
        idx: "Program",
    },
    {
        name: "Hybrid",
        image: "hybrid.png",
        type: 'visDataFormat',
        idx: "Hybrid",
    },
    {
        name: "Feature Engineering",
        image: "featureEng.png",
        type: 'feature',
        idx: 'Engineering'
    },
    {
        name: "Feature Learning",
        image: "featureLearn.png",
        type: 'feature',
        idx: 'Learning'
    }
]

const howLable: OverviewLabel[] = [
    {
        name: "Transformation",
        image: "transformation.png",
        type: 'tasks',
        idx: 'Transformation',
    },
    {
        name: "Assessment",
        image: "assessment.png",
        type: 'tasks',
        idx: 'Assess',
    },
    {
        name: "Comparison",
        image: "compare.png",
        type: 'tasks',
        idx: 'Compare',
    },
    {
        name: "Query",
        image: "query.png",
        type: 'tasks',
        idx: 'Querying'
    },
    {
        name: "Reasoning",
        image: "reasoning.png",
        type: 'tasks',
        idx: 'Reasoning',
    },
    {
        name: "Recommendation",
        image: "recommendation.png",
        type: 'tasks',
        idx: 'Recommend'
    },
    {
        name: "Mining",
        image: "mining.png",
        type: 'tasks',
        idx: 'Mine'
    },
];



export default {
    components: { },
    setup() {
        const store = useStore();

        const state = reactive({
            paperList: computed(() => store.state.paperList),
            labels: [...whyLabel, ...whatLabel, ...howLable] as OverviewLabel[],
        });

        const isLastLabel = (index: number) => {
            return index === (whyLabel.length - 1) 
                || index === (whyLabel.length + whatLabel.length - 1)
                || index === (whyLabel.length + whatLabel.length + howLable.length - 1)
        }

        const showAuthors = (paperIdx: string) => {
            const regAuthor = /[a-z]+/g
            const regYear = /[0-9]+/g
            const author = paperIdx.match(regAuthor)
            const year = paperIdx.match(regYear)
            if (author && year) {
                return `${author[0].slice(0,1).toUpperCase()}${author[0].slice(1)} et al. (${year[0]})`
            }
            else 
                return ''
        }

        const isLabeled = (paper: PaperList, column: OverviewLabel) => {
            if (column.type === 'Application') {
                for (let app of paper[column.type]) {
                    if (app.match(column.idx)) {
                        return 'rgb(150, 142, 133)'
                    }
                }
            }
            else if (column.type === 'visDataFormat') {
                if (paper.visDataFormat === column.idx) {
                    return 'rgb(107, 78, 113)'
                }
            }
            else if (column.type === 'feature' && paper.feature) {
                if (paper.feature.method && paper.feature.method.match(column.idx)) {
                    return 'rgb(62, 123, 155)'
                }
            }
            else if (column.type === 'tasks') {
                for (let task of paper[column.type]) {
                    if (task.task.match(column.idx)) {
                        return 'rgb(140, 192, 132)'
                    }
                    else if (column.idx === 'Transformation' && task.task === 'ReverseEngineering') {
                        return 'rgb(140, 192, 132)'
                    }
                }
            }
            return '#f0f0f0'
        }

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

        return {
            ...toRefs(state),
            isLastLabel,
            showAuthors,
            isLabeled,
            formatterAuthor,
        };
    },
};
</script>

<style scoped lang="scss">
.heading {
    font-size: 22px;
    font-weight: 700;
    color: #363636;
    height: 50px;
    line-height: 30px;
    background-color: transparent;
    box-shadow: 0 1px 2px rgba(10, 10, 10, 0.1);
    display: flex;
    align-items: center;
    padding-left: 20px;
    margin-bottom: 10px;
}

#overview {
    padding: 10px 10px 0px 10px;
    font-size: 16px;
    color: #2B2F33;
    margin: 10px 20px;

    .supplymentary {
        padding-left: 20px;
        margin-bottom: 20px;        
    }

    table {
        th {
            font-weight: bold;
            padding: 0px;
            padding-bottom: 20px;
            height: auto;
            text-align: center;
        }
        th.subcategory {
            height: 150px;
            width: 40px;
            // min-width: 40px;
            // max-width: 40px;
            position: relative;
            vertical-align: bottom;
            padding: 0;
            font-size: 12px;
            line-height: 1.0;
            bottom: 10px;

            div {
                position: relative;
                top: 0px;
                left: 55px;
                height: 130px;
                overflow: hidden;
                -ms-transform: skew(-45deg,0deg);
                -moz-transform: skew(-45deg,0deg);
                -webkit-transform: skew(-45deg, 0deg);
                -o-transform: skew(-45deg,0deg);
                transform: skew(-45deg,0deg);

                span {
                    transform: skew(45deg,0deg) rotate(315deg);
                    -ms-transform: skew(45deg,0deg) rotate(315deg);
                    -moz-transform: skew(45deg,0deg) rotate(315deg);
                    -webkit-transform: skew(45deg,0deg) rotate(315deg);
                    -o-transform: skew(45deg,0deg) rotate(315deg);
                    position: absolute;
                    bottom: 60px;
                    left: -63px;
                    display: inline-block;
                    width: 170px;
                    text-align: left;
                    white-space: nowrap;
                }
            }
        }
        th.pad {
            padding-right: 20px !important;
            width: 60px;
        }
        tbody {
            tr {
                td:first-child {
                    text-align: right;
                    min-width: 17em;
                    padding-left: 0px;
                    padding-right: 20px;
                    font-size: 12px;
                }
                td {
                    .refLabel {
                        width: 15px;
                        height: 15px;
                        background: #f0f0f0;
                        border-radius: 3px;
                        padding-left: 10px;
                    }
                    .authors {
                        color: #1890ff;
                    }
                }
            }
        }
    }
}
#referenceList {
    margin: 80px 20px 0px 20px;
    width: 80%;

    .citation {
        font-size: 1em;
        line-height: 1.4;
        padding-left: 20px;
    }
}
</style>