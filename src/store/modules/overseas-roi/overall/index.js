import http from 'src/services/http'

export default {
    namespaced: true,
    state: {
        date:[
            moment()
              .add(-7, "day")
              .format("YYYY-MM-DD"),
            moment()
              .add(-1, "day")
              .format("YYYY-MM-DD")
          ],              //日期
        mailUrl: null,  
        overall:null,           //数据体
    },
    mutations: {
        setDate(state, data) {
            state.date = data
        },
        set_overall(state,data){
            state.overall = data
        }
       
        
    },
    getters: {
        getOverall(state,getters){
            var allData = [];
            var xList = [];         //横坐标
            var lineData = [];      //折线图数据
            if (state.overall && state.overall[0]) { 
                allData =state.overall[0]
                Object.keys(allData[0]).forEach((key, msg) => {
                    if (msg>0) {
                        lineData.push({name:key,data:[]})
                    }
                })
                for (let index = 0; index < allData.length; index++) {
                    Object.keys(allData[index]).forEach((key, msg) => {
                        if (msg==0) {
                            xList.push(allData[index][key])
                        }else{
                            if (msg == 5) {
                                allData[index][key]=+allData[index][key].format(2)+'%'
                                lineData[msg-1].data.push(allData[index][key])
                            }else if(msg == 6){
                                allData[index][key]=+allData[index][key].format(2)
                                lineData[msg-1].data.push(allData[index][key])
                            }else{
                                lineData[msg-1].data.push(+allData[index][key])
                            }
                        }
                    })
                }

            }
            lineData.splice(4,1)
            return {title:'图表数据',allData:allData,xList:xList,lineData:lineData}
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
            var url = '/query/' + rootGetters.getMenu[Config.overallId].dataView[0]
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