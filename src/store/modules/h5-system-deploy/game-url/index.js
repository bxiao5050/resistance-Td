import http from 'src/services/http'
import {
    Number
} from 'core-js';

export default {
    namespaced: true,
    state:{
        games:[],
        tableData:[],
        in_app_id:0,
        in_app_name:'',
        in_app_url:'',
        in_id:0,
    },
    mutations:{
        set_games(state,data){
            state.games = data;
        },
        set_tableData(state,data){
            state.tableData = data;
        },
        setUrl(state,data){
            state.in_app_url = data;
        },
        setAppId(state,data){
            state.in_app_id = data;
        },
        setGameName(state,data){
            state.in_app_name = data;
        }
    },
    getters:{

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
            var url = '/query/' + rootGetters.getMenu[Config.H5GameUrlId].dataView[0]
            console.log("Params:->", params)
            new Promise((resolve) => {
                http.post(url, params).then(data => {
                    if (data.code == 401) {
                        tag && commit("set_" + tag, data.state);
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

    },




}