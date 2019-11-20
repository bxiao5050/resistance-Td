import http from 'src/services/http'
import {
    Number
} from 'core-js';

export default {
    namespaced: true,
    state:{
        tableData:[],
    },
    mutations:{
        set_tableData(state,data){
            state.tableData = data;
        },
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
            console.log(Config.H5ChannelConfiglId,rootGetters.getMenu[Config.H5ChannelConfiglId].dataView[0]);
            
            var url = '/query/' + rootGetters.getMenu[Config.H5ChannelConfiglId].dataView[0]
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