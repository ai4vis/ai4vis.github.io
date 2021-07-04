<template>
  <div>
    <div class="myNav">
        <span class="title">AI4VIS: Survey on Artificial Intelligence Approaches for Data Visualization</span> <br>
        <a-menu v-model:selectedKeys="current" mode="horizontal" class="navSelector" :style="{background: '#263459', color: 'white'}">
          <a-menu-item key="introduction" :style="{fontSize: '16px', fontWeight: '500'}"> Introduction </a-menu-item>
          <a-menu-item key="taxonomy" :style="{fontSize: '16px', fontWeight: '500'}">Taxonomy</a-menu-item>
          <a-menu-item key="overview" :style="{fontSize: '16px', fontWeight: '500'}">Overview</a-menu-item>
          <a-menu-item key="browser" :style="{fontSize: '16px', fontWeight: '500'}">Paper Browser</a-menu-item>
          <a-menu-item key="arxiv" :style="{fontSize: '16px', fontWeight: '500', color: 'white'}"><a href="https://arxiv.org/pdf/2102.01330.pdf"  target="_blank" rel="noopener noreferrer">Link to Arxiv</a></a-menu-item>
        </a-menu>
    </div>
    <Introduction v-if="current[0]==='introduction'" />
    <Introduction v-if="current[0]==='arxiv'" />
    <Taxonomy v-if="current[0]==='taxonomy'" />
    <Overview v-if="current[0]==='overview'" />
    <Collection v-if="current[0]==='browser'" />
  </div>
  <!-- <Collection /> -->
</template>

<script lang="ts">
import 'bootstrap/dist/css/bootstrap.css';

import Collection from './components/Collection.vue';
import Introduction from './components/Introduction.vue';
import Taxonomy from './components/Taxonomy.vue';
import Overview from './components/Overview.vue'

import {useStore} from 'vuex'
import { onMounted, computed, reactive, toRefs, h } from "vue";

export default {
  name: 'App',
  components: {
    Collection,
    Introduction,
    Taxonomy,
    Overview
  },
  computed: {
  },
  setup() {
    const state = reactive({
         current: ['introduction']
    });

    const store = useStore();
    store.dispatch('init');

    return {
      ...toRefs(state)
    }
  }
}
</script>

<style lang='scss' scoped>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.myNav {
    margin: 10px 10px;
    padding: 10px 20px;
    background: #263459;
    color: white;
    // .navSelector {
    //    background: #263459;
    //    color: white;
    // }
    .title {
        font-size: 30px;
        font-weight: 600;
    }
    p, h1, span {
        color: white;
        // margin-left: 10px;
    }
    .tab-title {
      font-size: 16px;
      font-weight: 500;
    }
    a {
      color: white !important;
    }
}
</style>
