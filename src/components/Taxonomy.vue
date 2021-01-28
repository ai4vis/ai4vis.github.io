<template>
    <div id="taxonomy">
        <Why />
        <What />
        <How />
    </div>
</template>

<script lang='ts'>
import { reactive, toRefs } from "vue";
import Why from "./Taxonomy/Why.vue";
import What from "./Taxonomy/What.vue";
import How from "./Taxonomy/How.vue";

export default {
    components: { Why, What, How },
    setup() {
        const state = reactive({});

        return {
            ...toRefs(state),
        };
    },
};
</script>

<style lang="scss">
.modalCardWrapper {
    margin-bottom: 10px;
    height: 100%;
}
.modalCardContent {
    border: 1px solid #888;
    padding: 10px 10px;
    height: 100%;
}

#taxonomy {
    padding: 10px 10px 0px 10px;
    font-size: 16px;
    color: #2B2F33;

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
        margin-top: 80px;
    }
    // .heading:first-of-type {
    //     margin-top: 0px;
    // }
    .supplymentary {
        padding-left: 20px;
        margin: 10px 0px 5px 0px;        
    }
    .myComponent {
        margin: 10px 20px;
        // padding: 20px 25px;
    }
    
    .myComponent:first-child {
        .heading {
            margin-top: 0px
        }
    }
    .cardWrapper {
        margin-left: 8px;
        padding: 5px;
        display: flex;
        flex-wrap: wrap;
    }
    .card {
        width: 30%;
        min-height: 280px;
        margin: 5px 10px;
        padding: 15px 20px 10px 20px;
        border: 1px solid lightgrey;
        border-radius: 4px;
        box-shadow: 3px 3px 3px 1px #e8e8e8;
        display: flex;
        flex-direction: column;
        // justify-content: space-around;

        h5 {
            color: #3f74be;
            font-weight: 600;
            font-size: 22px;
        }
    }
    img {
        display: block;
        margin: auto;
    }
}
</style>