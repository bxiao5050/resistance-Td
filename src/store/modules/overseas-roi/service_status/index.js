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
        mailUrl: null,  
        gameList:null,          //一级菜单游戏列表
        service:null,           //数据体
        gameActiveIndex:null,

    },
    mutations: {
        setDate(state, data) {
            state.date = data
        },
        setGameID(state,data){
            state.gameID = data
        },
        setGameList(state,data){
            state.gameList = data
        },
        set_service(state,data){
            state.service = data
        },
        setGameActiveIndex(state,data){
            state.gameActiveIndex = data
        },
        
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
        getService(state,getters){
            var service =[]
            var tbodyArr = []
            var theadArr = []
            if (state.service && state.service[0]) { 
                console.log('gameList--->', state.gameList)
                service = state.service
                var str = ''
                console.log('tag', )
                Object.keys(state.service[0][0]).forEach((key,flag)=>{
                    theadArr = theadArr.concat('<td>'+key+'</td>')
                })
                theadArr  = '<tr>'.concat(theadArr,'</tr>')
            }
            console.log('data----->>>>', theadArr)
            return {data:service[0],table:service[1],theadArr:theadArr,tbodyArr:tbodyArr}
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
            var url = '/query/' + rootGetters.getMenu[Config.serviceId].dataView[0]
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