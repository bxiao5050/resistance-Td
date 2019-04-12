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
        date:null,
        mailUrl: null,
        // 渠道列表
        channelList: [],
        // 实时报表数据
        reconciliation:[],
        // 渠道下标
        channelListValue:null
    },
    mutations: {
        setDate(state, data) {
            state.date = data
        },
        setChannelListValue(state,data){
            state.channelListValue = data
        },
        set_channelList(state, data) {
            state.channelList = data
        },
        set_reconciliation(state, data) {
            state.reconciliation = data
        },
       
        
    },
    getters: {
        getChannelList(state, getters){
            var channelList = [];    //返回的所有数据
            if (state.channelList && state.channelList[0]) { 
                // console.log('1111111111111', state.channelList[0])
                for (let index = 0; index < state.channelList[0].length; index++) {
                    channelList.push({value:index+1,label:state.channelList[0][index].media_source})
                }
            }
            // console.log('--------------->>>>>', channelList)
            return channelList
        },
        getTableData(state,getters){
            var arr = []
            if (state.reconciliation && state.reconciliation[0]) { 
                arr = state.reconciliation[0]
                // console.log(' state.reconciliation[0]',  state.reconciliation[0])
            }
            return arr


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
            var url = '/query/' + rootGetters.getMenu[Config.reconciliationId].dataView[0]
            console.log("Params:->", params)

            var promise1 = new Promise((resolve) => {
                http.post(url, params).then(data => {
                    if (data.code == 401) {
                        commit("set_" + tag, data.state);
                        // console.log('tag', data)
                        resolve(data.state)
                    } else {
                        this.$notify.warning({
                            message: data.message
                        })
                        consoel.error(message)
                    }
                })
            })
            if (tag.indexOf('zone') !== -1 || tag === 'system') {
                var promise2 = new Promise(resolve => {
                    this.dispatch('overseas_common_realTime/getRegionMap').then(() => {
                        resolve()
                    })
                })
                return Promise.all([
                    promise1,
                    promise2
                ])
            } else {
                return promise1
            }


        }
    }
}