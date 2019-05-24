import http from 'src/services/http'

export default {
    namespaced: true,
    state: {
        date:moment().add(-1, "day").format("YYYY-MM-DD"),              //日期
        mailUrl: null,  
        service:null,           //数据体
    },
    mutations: {
        setDate(state, data) {
            state.date = data
        },
        set_service(state,data){
            state.service = data
        },
    },
    getters: {
        getService(state,getters){
            var service =[]
            var tbodyArr = []
            var theadArr = []
            if (state.service && state.service[0]) { 
                service = state.service
                var str = ''
                Object.keys(state.service[0][0]).forEach((key,flag)=>{
                    theadArr = theadArr.concat('<td>'+key+'</td>')
                })
                theadArr  = '<tr>'.concat(theadArr,'</tr>')
            }
            return {data:service[0],table:service[1],theadArr:theadArr,tbodyArr:tbodyArr}
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