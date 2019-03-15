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
        date: null,
        os: null,
        region: null,
        regionArr: [],
        game: null,
        gameArr: [],
        mailUrl: null,
        taging: null,
        // 实时报表数据
        real:{},
    },
    mutations: {
        setDate(state, data) {
            state.date = data
        },
        setOs(state, data) {
            state.os = data
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
        set_real(state, [key, data]) {
            var _ = getObjectByTimestamp()
            _[key] = data
            state.real = _
        },
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
        getRealData(state, getters){
            var allData = [];    //返回的所有数据
            var dateArr = [];    //天数
            var everyArr = [];   //每天数据
            var xList = [];      //横坐标
            var theadArr = '';   //导出表格数据
                var tbodyArr = '';
            var lineData = []    //多个图表数据
                var activation = []; //激活
                var registered = []; //注册
                var wreck = [];      //创角
                var registrationRate = []; //注册率
                var angerRate = [];  //创角率


            if (state['real'][getters.getIdStr] && state['real'][getters.getIdStr][0].length) {
                allData = state['real'][getters.getIdStr][0]
                //获取日期和横坐标
                for (let index = 0; index < allData.length; index++) {
                    var tr = ''
                    Object.keys(allData[index]).forEach((key, msg) => {
                        tr = tr.concat('<td>'+allData[index][key]+'</td>')
                        if (msg == 0) {
                            if (dateArr.indexOf(allData[index][key].split(' ')[0]) === -1) {
                                dateArr.push(allData[index][key].split(' ')[0])
                            }
                            if (xList.indexOf(allData[index][key].split(' ')[1]) === -1) {
                                xList.push(allData[index][key].split(' ')[1])
                            }
                            
                        }
                    })
                    tbodyArr  = tbodyArr.concat('</tr>',tr,'</tr>')
                }
                //按天数划分数组
                for (let index = 0; index < dateArr.length; index++) {
                    everyArr.push([])
                    for (let flag = 0; flag < allData.length; flag++) {
                        Object.keys(allData[flag]).forEach((key, msg) => {
                            if (msg == 0 && dateArr[index].indexOf(allData[flag][key].split(' ')[0])>=0) {
                                everyArr[index].push(allData[flag])
                            }
                        })
                    }
                }
                // 根据天数数据匹配激活/注册/创角
                for (let index = 0; index < everyArr.length; index++) {
                    activation.push({name:dateArr[index],data:[]})
                    registered.push({name:dateArr[index],data:[]})
                    wreck.push({name:dateArr[index],data:[]})
                    registrationRate.push({name:dateArr[index],data:[]})
                    angerRate.push({name:dateArr[index],data:[]})
                    for (let msg = 0; msg < everyArr[index].length; msg++) {
                        Object.keys(everyArr[index][msg]).forEach((key, flag) => {
                            if (flag == 2) {
                                activation[index].data.push(+everyArr[index][msg][key])
                            }else if(flag == 3){
                                registered[index].data.push(+everyArr[index][msg][key])
                            }else if(flag == 4){
                                wreck[index].data.push(+everyArr[index][msg][key])
                            }else if(flag == 5){
                                registrationRate[index].data.push(+everyArr[index][msg][key])
                            }else if(flag == 6){
                                angerRate[index].data.push(+everyArr[index][msg][key])
                            }
                            
                        })
                    }
                }
                // 获取表头
                Object.keys(allData[0]).forEach((key, msg) => {
                    theadArr = theadArr.concat('<td>'+key+'</td>')
                })
                theadArr  = '<tr>'.concat(theadArr,'</tr>')
                lineData.push(activation,registered,wreck,registrationRate,angerRate)
            }

            // console.log('11111111111',{'dateArr':dateArr,'xList':xList,'everyArr':everyArr,'lineData':lineData,'theadArr':theadArr,'tbodyArr':tbodyArr})
            return {'dateArr':dateArr,'xList':xList,'everyArr':everyArr,'lineData':lineData,'theadArr':theadArr,'tbodyArr':tbodyArr}

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
            var url = '/query/' + rootGetters.getMenu[Config.realTimeMenuId].dataView[0]
            console.log("Params:->", params)

            var promise1 = new Promise((resolve) => {
                http.post(url, params).then(data => {
                    if (data.code == 401) {
                        commit("set_" + tag, [params.in_area_app_ids, data.state]);
                        console.log('tag', data)
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