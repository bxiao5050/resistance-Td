import http from 'src/services/http'

export default {
    namespaced: true,
    state: {
        date:moment().add(-1, "day").format("YYYY-MM-DD"),              //日期
        mailUrl: null,  
        channel:null,           //数据体
    },
    mutations: {
        setDate(state, data) {
            state.date = data
        },
        set_channel(state,data){
            state.channel = data
        }
    },
    getters: {
        getChannel(state,getters){
            var allData = [];
            if (state.channel && state.channel[0]) { 
                for (let index = 0; index < state.channel[0].length; index++) {
                    Object.keys(state.channel[0][index]).forEach((key, flag) => {
                        if(key === '总收入' ){
                            state.channel[0][index][key] = +state.channel[0][index][key];
                        }
                    })
                }
                allData = state.channel[0]
            }
            return allData
        }
    },
    actions: {
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