<template>
    <div id="introduction">
        <div class="row">
            <div class="col-6 myComponent">
                <div id="about">
                    <p class="heading">About</p>
                    <p>
                        Visualizations themselves have become a data format.
                        Akin to other data formats such as text and images,
                        visualizations are increasingly created, stored, shared,
                        and (re-)used with artificial intelligence (AI)
                        techniques. In this survey, we probe the underlying
                        vision of formalizing visualizations as an emerging data
                        format and review the recent advance in applying AI
                        techniques to visualization data. We define
                        visualization data as the digital representations of
                        visualizations in computers and focus on visualizations
                        in information visualization and visual analytic. We
                        build our survey upon a corpus spanning different fields
                        in computer science with an eye toward identifying
                        important common interests. Our resulting taxonomy is
                        organized around WHAT is visualization data and its
                        representation, WHY and HOW to apply AI to visualization
                        data. We highlight a set of common tasks that
                        researchers apply to the visualization data and present
                        a detailed discussion of AI approaches developed to
                        accomplish those tasks. Drawing upon our literature
                        review, we discuss several important research questions
                        surrounding the management and exploitation of
                        visualization data, as well as the role of AI in support
                        of those processes.
                    </p>
                </div>
            </div>
            <div class="col-6 myComponent">
                <div id="corpus">
                    <p class="heading">Corpus</p>
                    We construct a literature corpus by a relation-search
                    approach, that is, graph traversal over the citation and
                    reference networks. Our corpus consists of 98 papers from 10
                    research areas in computer science as classified in
                    <a href="https://csrankings.org">csrankings.org</a>. This
                    indidates the wide and ever-growing research interests of
                    AI4VIS research.<br />
                    <img src="@/assets/paperStats.jpg" height="240" />
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 myComponent">
                <div id="overview">
                    <p class="heading">Overview</p>
                    We organize and categorize AI4VIS research following a well-established why-what-how viewpoint:  <br>
                    <ul>
                        <li><a-tag color="#968E85" class="overview-tag">Why </a-tag>apply AI to visualization data. We identify three common goals for AI4VIS research, 
    namely visualization recommendation, enhancement, and analysis.
    We classify those goals into subcategories to provide a comprehensive response to ongoing discussions like "why should we teach machines to read charts made for humans".</li>
                        <li><a-tag color="#6B4E71" class="overview-tag">What </a-tag>is visualization data. We formalize the concept of visualization data by providing an overview of existing content formats of visualization data as well as their representations.</li>
                        <li><a-tag color="#8CC084" class="overview-tag">How </a-tag>to apply AI to visualization data. Most importantly, we contribute a task abstraction regarding how to apply AI to visualization data. The task abstraction is critical since it allows for domain-agnostic and consistent descriptions of research questions across different disciplines. Besides,
    it facilitates an organized discussion reconciling distinct visualization paper types, that is, a <i>technique</i> paper focuses on a single task, while a <i>system</i> paper might accomplish multiple tasks.
    In total, we note seven common tasks.</li>
                    </ul>
                    <img src="@/assets/overview.jpg" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
export default {
    components: {},
    setup() {},
};
</script>

<style scoped lang="scss">
#introduction {
    padding: 5px 25px 0px 25px;
    font-size: 16px;
    color: #2B2F33;

    div.row {
        margin-bottom: 20px;
    }

    p {
        margin-bottom: 5px;
    }
    .heading {
        font-size: 2rem;
        font-weight: 600;
        height: 34px;
        line-height: 30px;
        margin-bottom: 10px;
    }
    .myComponent {
        margin: 0px 0px;
        // padding: 20px 25px;
    }
    #about,
    #corpus,
    #overview {
        padding: 20px 25px;
        height: 100%;
        border: 1px solid #ccc;
        box-sizing: border-box;
        color: rgba(0,0,0,.65);
        position: relative;
        background: #fff;
        border-radius: 2px;
        transition: all .3s;
        cursor: pointer;
        box-shadow: 3px 3px 3px 1px #e8e8e8;
    }
    #about:hover,
    #corpus:hover,
    #overview:hover {
        box-shadow: 3px 3px 3px 1px lightblue;
    }
    img {
        display: block;
        margin: auto;
    }
    .overview-tag {
        font-weight: 500;
        font-size: 13px;
        padding-bottom: 1px;
    }
}
</style>