  
import { Popover } from 'ant-design-vue'
import Vue from 'vue'
import Vuex from 'vuex'
import { createStore } from 'vuex'
import dataService from '../services/dataService'
import { tasks, taskName, features, otherFilters, otherFilterNames, applications, applicationName } from '../utils/filters'

const startYear = 2010;
const endYear = 2020;

export default createStore({
  state: {
    paperList: [] as PaperList[],
    yearCnt: [] as number[],
    filterTag: {} as FilterTag, 
  },
  getters: {
    filterPapers: (state) => {
      let filtered = state.paperList.filter(paper => {
        for (let d in state.filterTag) {
          let dim = d as keyof FilterTag
          if ( dim === 'time' ){
            let start = state.filterTag[dim][0] === startYear ? 1986 : state.filterTag[dim][0]
            if (paper.year < start || paper.year > state.filterTag[dim][1])
              return
          }
          else if ( dim === 'tasks' ) {
            let newTasks: TASK = state.filterTag[dim]
            for (let nt of newTasks) {
              let flag = false
              if (state.filterTag.taskLevel.indexOf(nt.task) === -1 ) {
                for (let paperTask of paper.tasks) {
                  if (paperTask.task === nt.task) {
                    let ntAxis = Object.entries(nt.label)[0][0]
                    let ntLabel = Object.entries(nt.label)[0][1]
                    let paperTaskAxisIdx = Object.keys(paperTask.label).indexOf(ntAxis)
                    let paperTaskLabel = Object.entries(paperTask.label)[paperTaskAxisIdx][1]
                    if (ntLabel === paperTaskLabel){
                      flag = true
                      break
                    }
                  }
                }
                if (!flag) return
              }
            }
          }
          else if ( dim === 'taskLevel') {
            let newTaskLevel = state.filterTag[dim]
            let paperTasks = new Set()
            paper.tasks.map(t => paperTasks.add(t.task))
            for (let nt of newTaskLevel) {
              if (!paperTasks.has(nt)) {
                return
              }
            }
          }
          else if (dim === 'app') {
            let newApps: ApplicationString[] = state.filterTag[dim]
            for (let na of newApps) {
              if (state.filterTag.appLevel.indexOf(na.substring(0, na.indexOf('['))) === -1) {
                if (na === 'Unknown[Unknown]'){
                  if (paper.Application[0] !== 'nan')
                    return false
                }
                else if (paper.Application.indexOf(na) === -1)
                  return false
              }
            }
          }
          else if ( dim === 'appLevel') {
            let newAppLevel = state.filterTag[dim]
            let paperApp = new Set()
            paper.Application.map(a => {
              if (a !== 'nan')
                paperApp.add(a.substring(0, a.indexOf('[')))
              else
                paperApp.add('Unknown')
            })
            for (let na of newAppLevel) {
              if (!paperApp.has(na))
                return
            }
          }
          else if ( dim === 'feature') {
            let newFeatures = state.filterTag[dim]
            if (Object.keys(newFeatures).length !== 0) {
              // paper doesn't have the feature dimension
              if (Object.keys(paper).indexOf('feature') === -1)
                return
              for (let i in newFeatures) {
                let nf = i as keyof FEATURE
                if (paper.feature && paper.feature[nf] !== newFeatures[nf]) {
                  return
                }
              }
            }
          }
          else if ( dim === 'otherFilters' ) {
            let newFilters = state.filterTag[dim]
            if (Object.keys(newFilters).length !== 0) {
              for (let i in newFilters) {
                let index = i as keyof OtherFilters
                if (newFilters[index].length === 0)
                  continue
                else {
                  if (newFilters[index].indexOf(paper[index]) > -1)
                    return paper
                  else
                    return
                }
              }
            }
          }
        }
        return paper
      })
      return filtered as PaperList[]
    },
    activeTags: (state, getters) => {
      let active = {
        tasks: JSON.parse(JSON.stringify(tasks)),
        taskLevel: [...new Array(8)].map(i=>false),
        app: JSON.parse(JSON.stringify(applications)),
        appLevel: [...new Array(8)].map(i => false),
        feature: JSON.parse(JSON.stringify(features)),
        otherFilters: JSON.parse(JSON.stringify(otherFilters))
      }
      for (let paper of getters.filterPapers) {
        // for tasks
        paper.tasks.map((paperTask: TaskObject) => {
          let subTaskIdx = taskName.indexOf(paperTask.task)
          for (let axisValue of Object.entries(paperTask.label)) {
            let axis = axisValue[0]
            let label = axisValue[1]
            let idx = active.tasks[subTaskIdx][axis].indexOf(label)
            if (idx > -1) {
              active.tasks[subTaskIdx][axis].splice(idx, 1)
            }
          }
        })
        // for features
        if (paper.feature) {
          for (let axis in paper.feature) {
            let idx = active.feature[axis].indexOf(paper.feature[axis])
            if (idx > -1) {
              active.feature[axis].splice(idx, 1)
            }
          }
        }
        // for applications 
        for (let pa of paper.Application) {
          if (pa === 'nan') {
            active.app[3] = []
          }
          else {
            let appName = pa.substring(0, pa.indexOf('['))
            let appIndex = applicationName.indexOf(appName)
            let appLabel = pa.substring(pa.indexOf('[') + 1, pa.length - 1)
            let appLabelIndex = active.app[appIndex].indexOf(appLabel)
            if (appLabelIndex > -1){
              active.app[appIndex].splice(appLabelIndex, 1)
            }
          }
        }
        // for other features
        for (let otherFilter in active.otherFilters) {
          let name = otherFilterNames[Number(otherFilter)]
          let idx = active.otherFilters[otherFilter].indexOf(paper[name])
          if (idx > -1) {
            active.otherFilters[otherFilter].splice(idx, 1)
          }
        }
      }
      active.tasks.map((at: Object, idx: number) => {
        // @ts-ignore
        if (Object.entries(at).every(axisValue => axisValue[1].length === tasks[idx][axisValue[0]].length)) {
          active.taskLevel[idx] = true
        }
      })
      active.app.map((aa: string[], idx: number) => {
        if (aa.length === applications[idx].length){
          active.appLevel[idx] = true
        }
      })
      return active
    }
  },
  mutations: {
    init(state, payload: PaperList[]) {
      state.paperList = payload;
      state.filterTag = {
        time: [startYear, endYear],
        tasks: {} as TASK,
        taskLevel: [] as string[],
        app: [] as ApplicationString[],
        appLevel: [] as string[],
        feature: {} as FEATURE,
        otherFilters: {} as OtherFilters
      }
    },
    filter(state, filterPayload: FilterPayload) {
      let tmp = filterPayload.type as keyof FilterTag
      state.filterTag[tmp] = filterPayload.content
    }
  },
  actions: {
    async init({ commit }) {
      let paperList = await dataService.getPaperList();
      commit('init', paperList)
    },
  },
  modules: {
  }
})
