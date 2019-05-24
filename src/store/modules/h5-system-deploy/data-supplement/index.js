import http from 'src/services/http'
var date = new Date()
export default {
  namespaced: true,
  state: {
    os: '1',
    onIndex: null,
    region: null,
    regionArr: [],
    game: null,
    gameArr: [],
    curChannel: null,
    curYear: date.getFullYear(),
    curMonth: date.getMonth() + 1,
    channelData: null,
    channel: {
      source: null,
      list: null,
      keys: null,
      index: {
        channelIndex: 0,
        dateIndex: 1
      },
    },
    data: {
      map: null,
      source: null,
      list: null,
      keys: null,
      index: {
        regionIndex: 0,
        dateIndex: 1,
        registerIndex: 2,
        createIndex: 3,
        costIndex: 4,
        unitIndex: 5
      },
      types: null,
      typeIndex: {}
    },
    
    // 
    dataDate:[moment(new Date().setDate(1)).add().format("YYYY-MM-DD"), moment(new Date()).endOf('month').format("YYYY-MM-DD")],
    games:[],
    in_app_id:'',
    channelAllData:[],
  },
  mutations: {
    setCurChannel(state, data) {
      state.curChannel = data
    },
    setOs(state, data) {
      state.os = data
    },
    setOnIndex(state, data) {
      state.onIndex = data
    },
    setCurYear(state, data) {
      state.curYear = data
    },
    setCurMonth(state, data) {
      state.curMonth = data
    },
    setRegion(state, data) {
      state.region = data
    },
    setRegionArr(state, data) {
      state.regionArr = data
    },
    setGame(state, data) {
      state.game = data
    },
    setGameArr(state, data) {
      state.gameArr = data
    },
    setDataDate(state,data){
      state.dataDate = data
    },
    set_games(state,data){
      state.games = data
    },
    set_channelData(state,data){
      state.channelData = data
    },
    set_channelAllData(state,data){
      state.channelAllData =data
    },
    setInAppId(state,data){
      state.in_app_id = data
    }
  },
  getters: {
    getIdStr(state) {
      if (state.gameArr.length) {
        return state.gameArr[0]
      }
      if (state.regionArr.length) {
        return state.regionArr.join(',')
      }
      return ''
    },
    getChannels(state) {
      if (state.channelData && state.channelData.length) {
        state.channel.list = []
        state.channel.source = {}
        if (!state.channel.keys) {
          state.channel.keys = Object.keys(state.channelData[0])
          console.log(state.channel.keys)
        }
        var {
          keys,
          index
        } = state.channel
        state.channelData.forEach(item => {
          var channelName = item[keys[index.channelIndex]]
          var date = item[keys[index.dateIndex]]
          if (!state.channel.source.hasOwnProperty(channelName)) {
            state.channel.source[channelName] = item
            state.channel.list.push({
              channelName,
              date,
              isBulu: (date && date !== 'null') ? 1 : 0
            })
          }
        })
        state.channel.list.sort((a, b) => {
          return b.isBulu - a.isBulu
        })
        return state.channel.list
      } else {
        return null
      }
    },

    getList(state) {
      if (state.data.source && state.data.source.length) {
        state.data.list = {
          dates: {},
          regions: [],
          search: []
        }
        if (!state.data.keys) {
          state.data.keys = Object.keys(state.data.source[0])
          console.log(state.data.keys)
        }
        var {
          keys,
          index,
          source,
          list,
          map
        } = state.data
        if (!state.data.types) {
          state.data.types = [
            index.unitIndex,
            index.registerIndex,
            index.createIndex,
            index.costIndex,
          ]
          state.data.typeIndex[index.unitIndex] = 1
          state.data.typeIndex[index.registerIndex] = 2
          state.data.typeIndex[index.createIndex] = 3
          state.data.typeIndex[index.costIndex] = 4
        }

        var regionKey = keys[index.regionIndex]
        source.forEach(item => {
          var region = item[regionKey]
          var date = item[keys[index.dateIndex]]
          if (!list[region]) {
            list[region] = {}
            list.dates[region] = []
            list.regions.push({
              region
            })
            list.search.push({
              region: map[region] ? [region] + '，' + region : region
            })
          }
          list[region][date] = item
          list.dates[region].push(date)
        })
        list.regions.forEach(_ => {
          list.dates[_.region].sort()
        })
        return state.data
      } else {
        return null
      }
    }
  },
  actions: {
    getMOduleData(context, {
      params,
      tag,
    }) {
        var {
            commit,
            state,
            dispatch,
            getters,
            rootGetters,
            rootState,
        } = context
        console.log(Config.H5DataSupplementId,rootGetters.getMenu[Config.H5DataSupplementId].dataView[0]);
        
        var url = '/query/' + rootGetters.getMenu[Config.H5DataSupplementId].dataView[0]
        console.log("Params:->", params)
        new Promise((resolve) => {
            http.post(url, params).then(data => {
                if (data.code == 401) {
                    tag && commit("set_" + tag, data.state[0]);
                    console.log("set_"+tag,data.state);
                    
                    resolve(data.state)
                } else {
                    this.$notify.warning({
                        message: data.message
                    })
                    consoel.error(message)
                }
            })
        })
    },
    query(context, param) {
      var {
        commit,
        state,
        dispatch,
        getters,
        rootGetters,
        rootState,
      } = context

      var regionPromise = new Promise(resolve => {
        this.dispatch('overseas_common/getRegionMap').then(() => {
          resolve()
        })
      })
      var url = '/query/' + rootGetters.getMenu[Config.H5DataSupplementId].dataView[0]
      return new Promise(resolve => {
        http.post(url, param).then(data => {
          if (data.code === 401) {
            regionPromise.then(() => {
              state.data.map = rootState.overseas_common.regionMap
              state.data.source = data.state[0];
              resolve(data)
            })
          }
        })
      })
    },
    recalculate(context, param) {
      var {
        commit,
        state,
        dispatch,
        getters,
        rootGetters,
        rootState,
      } = context

      var url = '/query/' + 'recalculate_app_install_country_cost'
      return new Promise((resolve) => {
        http.post(url, param).then(data => {
          resolve(data)
        })
      })
    }

  }
}