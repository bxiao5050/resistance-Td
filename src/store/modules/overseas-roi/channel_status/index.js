import http from 'src/services/http'
import {
    Number
} from 'core-js';

function getObjectByTimestamp() {
    return {
        timestamp: new Date().getTime()
    }
}

export default {
    namespaced: true,
    state: {
        date:null,              //日期
        gameID:null,            //游戏Id
        zoneID:null,            //区服Id
        zoneName:null,
        mailUrl: null,  
        gameList:null,          //一级菜单游戏列表
        zoneList:null,          //二级菜单区服列表
        gameActiveIndex:null,
        areaActiveIndex:-2,      
        channelActiveIndex:-2,
        zoneActivityIndex:-2,
        visibleZone:false,
        channel:null,           //数据体
    },
    mutations: {
        setDate(state, data) {
            state.date = data
        },
        setGameID(state,data){
            state.gameID = data
        },
        setZoneID(state,data){
            state.zoneID = data
        },
        setVisibleZone(state,data){
            state.visibleZone = data
        },
        setZoneName(state,data){
            state.zoneName = data
        },
        setGameActiveIndex(state,data){
            state.gameActiveIndex = data
        },
        setAreaActiveIndex(state,data){
            state.areaActiveIndex = data
        },
        setChannelActiveIndex(state,data){
            state.channelActiveIndex = data
        },
        setZoneActivityIndex(state,data){
            state.zoneActivityIndex = data
        },
        setGameList(state,data){
            state.gameList = data
        },
        setZoneList(state,data){
            state.zoneList = data
        },
        set_channel(state,data){
            state.overall = data
        }
       
        
    },
    getters: {
        getGameList(state, getters){
            var gameList = [];    
            if (state.gameList && state.gameList[0]) { 
                console.log('gameList--->', state.gameList[0])
                gameList = state.gameList[0]
            }
            return gameList
        },
        getZoneList(state,getters){
            var arr = []
            var areaNameArr = []    //地区
            var channelArr = []     //渠道
            var zoneNameArr = []    //区服
            if (state.zoneList && state.zoneList[0]) { 
                console.log('zoneList--->',  state.zoneList[0])
                arr = state.zoneList[0]
                // 获取地区菜单
                for (let index = 0; index < arr.length; index++) {
                    if (!areaNameArr.includes(arr[index].region_name)) {
                        areaNameArr.push(arr[index].region_name)
                    }
                }
                // 渲染渠道菜单
                for (let index = 0; index < areaNameArr.length; index++) {
                    channelArr.push([])
                    for (let msg = 0; msg < arr.length; msg++) {
                        if(!channelArr[index].includes(arr[msg].agent_name)){
                            channelArr[index].push(arr[msg].agent_name)
                        }
                    }
                }
                //渲染区服菜单
                for (let index = 0; index < areaNameArr.length; index++) {
                    zoneNameArr.push([])//一个地区对应一个大区服[[],...]
                    for (let msg = 0; msg < channelArr[index].length; msg++) {
                        zoneNameArr[index].push([])//一个地区的每一个渠道对应一个大区服里面的次区服[[[]],...]
                        var cha =  arr.filter(todo => todo.agent_name == channelArr[index][msg])
                        for (let num = 0; num < cha.length; num++) {
                            Object.keys(cha[num]).forEach((key, flag) => {
                                if (flag == 5) {
                                    if (!zoneNameArr[index][msg].indexOf(cha[num][key])>=0) {
                                        zoneNameArr[index][msg].push(cha[num])
                                    }
                                }
                            })
                        }
                        
                    }
                }               
            }
            console.log('overallData---->>>', {zoneNameArr:zoneNameArr,channelArr:channelArr,areaNameArr:areaNameArr})
            return {arr:arr,zoneNameArr:zoneNameArr,channelArr:channelArr,areaNameArr:areaNameArr}
        },
        getChannel(state,getters){
            var allData = [];
            if (state.overall && state.overall[0]) { 
                allData =state.overall[0]

            }
            console.log('overall--->>>>',allData)
            return allData
        }
    },
    actions: {
        getGame(context) {
            var {
                state,
                getters,
                rootGetters,
                commit
            } = context
            return new Promise((resolve, reject) => {
                if (!state.list1) {
                    var param = {
                        // querytype: 1,
                        in_begin_date: '2019-01-01', //开始日期
                        in_end_date: '2019-01-01',   //结束日期
                        in_app_id: 0,                //游戏ID                  
                        in_gamezone_id:' ',          //区服ID 
                        in_date_type:1,              //日期类型
                        in_query_type:1,             //查询类型              
                    }
                    var url = '/query/' + rootGetters.getMenu[Config.overallId].dataView[0]
                    http.post(url, param).then(({
                        state,
                        code
                    }) => {
                        if (code === 401) {
                            commit('setGameList', state)
                            commit('setGameID', state[0][0].app_id)
                            resolve()
                            return this.getZone()
                        }
                    })
                } else {
                    resolve()
                }
            })
        },
        getZone(context) {
            var {
                state,
                getters,
                rootGetters,
                commit
            } = context
            return new Promise((resolve, reject) => {
                if (!state.list1) {
                    var param = {
                        // querytype: 1,
                        in_begin_date: '2019-01-01', //开始日期
                        in_end_date: '2019-01-01',   //结束日期
                        in_app_id: state.gameID, //游戏ID                  
                        in_gamezone_id:' ',          //区服ID 
                        in_date_type:1,              //日期类型
                        in_query_type:2,             //查询类型              
                    }
                    var url = '/query/' + rootGetters.getMenu[Config.overallId].dataView[0]
                    http.post(url, param).then(({
                        state,
                        code
                    }) => {
                        if (code === 401) {
                            commit('setZoneList', state)
                            commit('setZoneID', state[0][0].region_id)
                            commit('setZoneName', state[0][0].region_name)
                            resolve()
                        }
                    })
                } else {
                    resolve()
                }
            })
        },
        getReportInfo(context, {
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
            var url = '/query/' + rootGetters.getMenu[Config.channelId].dataView[0]
            console.log("Params:->", params)

            var promise1 = new Promise((resolve) => {
                http.post(url, params).then(data => {
                    if (data.code == 401) {
                        commit("set_" + tag, data.state);
                        resolve(data.state)
                    } else {
                        this.$notify.warning({
                            message: data.message
                        })
                        consoel.error(message)
                    }
                })
            })
        }
    }
}