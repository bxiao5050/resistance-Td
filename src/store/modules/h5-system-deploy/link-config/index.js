import http from 'src/services/http'
import {
    Number
} from 'core-js';

export default {
    namespaced: true,
    state:{
        filterData:[],
        games:[],
        urlData:[],
        channelData:[],
        tableData:[],
    },
    mutations:{
        set_games(state,data){
            state.games = data;
        },
        set_filterData(state,data){
            state.filterData = data;
        },
        set_urlData(state,data){
            state.urlData = data;
        },
        set_channelData(state,data){
            state.channelData = data;
        },
        set_tableData(state,data){
            state.tableData = data;
        },
    },
    getters:{
        // 对象数组去重
        filterGames(state,commit){
            var hash = {};
            if (state.filterData[0]) {
                return state.filterData[0].reduce(function(item, next) {
                    hash[next.app_id] ? '' : hash[next.app_id] = true && item.push(next);
                    return item
                }, [])
                
            }
            return []
        }
    },
    actions:{
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
            console.log(Config.H5LinkConfiglId,rootGetters.getMenu[Config.H5LinkConfiglId].dataView[0]);
            
            var url = '/query/' + rootGetters.getMenu[Config.H5LinkConfiglId].dataView[0]
            console.log("Params:->", params)
            new Promise((resolve) => {
                http.post(url, params).then(data => {
                    if (data.code == 401) {
                        if (tag && tag==="games") {
                            /***************************** */ 
                            commit("set_filterData",data.state)
                            getters["filterGames"]
                            commit("set_games",getters["filterGames"])
                            commit("set_channelData", data.state[1])
                        }else{
                            commit("set_" + tag, data.state[0])

                        }
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

    },




}