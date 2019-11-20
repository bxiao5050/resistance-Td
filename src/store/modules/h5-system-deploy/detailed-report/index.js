import http from 'src/services/http'
import {
    Number
} from 'core-js';

export default {
    namespaced: true,
    state:{
        date: [
            moment()
              .add(-1, "day")
              .format("YYYY-MM-DD"),
            moment()
              .add(-1, "day")
              .format("YYYY-MM-DD")
          ],
        payDate:[
            moment()
              .add(-1, "day")
              .format("YYYY-MM-DD"),
            moment()
              .add(-1, "day")
              .format("YYYY-MM-DD")
          ],
        tableData:[],
        mailUrl: null,
        games_value:'',
        channels_value:'',
        games:[],
        channelList:[],
        appId:'',
        channelId:'',

    },
    mutations:{
        setDate(state, data) {
            state.date = data
        },
        setInAppId(state,data){
            state.appId = data;
        },
        setChannelId(state,data){
            state.channelId = data;

        },
        setPayDate(state, data) {
            state.payDate = data
        },
        set_tableData(state,data){
            state.tableData = data;
        },
        set_games(state,data){
            state.games = data;
        },
        set_channelList(state,data){
            state.channelList = data;
        }
    },
    getters:{
        getChannelList(state,getters){
            var mmas = {}
            var allData = []
            if (state.tableData && state.tableData.length) {
              allData = state.tableData;
              // 获取mmas
              var titleArr = {};
              Object.keys(allData[0]).forEach((key, index) => {
                  //预期数据结构
                  if (index>=5 && index<=9) {
                    titleArr[key] = {avg:0,count:0,isReversal:false,max:0,min:0,total:0}
                  }
              })
              Object.assign(mmas,titleArr)
              Object.keys(mmas).forEach((key,index)=>{
                allData.filter(todo => todo[key])
                var total = 0;
                var count = 0;
                var dataArr = [];
                for (let msg = 0; msg < allData.filter(todo => todo[key]).length; msg++) {
                  total += +allData.filter(todo => todo[key])[msg][key];
                  dataArr.push(+allData.filter(todo => todo[key])[msg][key]) 
                  if (+allData.filter(todo => todo[key])[msg][key]) {
                    count++
                  }
                  
                }
                if (key == '创角成本' || key == '注册成本' || key == '激活成本') {
                  mmas[key].isReversal = true;
                }
                mmas[key].total = total;
                mmas[key].count = count;
                mmas[key].avg = count ? (total/count).format(2) : 0;
                mmas[key].max = eval("Math.max(" + dataArr + ")");
                mmas[key].min = eval("Math.min(" + dataArr + ")");
              })
              // console.log('mmasmmasmmasmmasmmasmmasmmasmmasmmas————————————————————————',mmas)
            }
            return {'data':allData,'mmas':mmas}
          },

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
            console.log(Config.H5DetailedReportId,rootGetters.getMenu[Config.H5DetailedReportId].dataView[0]);
            
            var url = '/query/' + rootGetters.getMenu[Config.H5DetailedReportId].dataView[0]
            console.log("Params:->", params)
            new Promise((resolve) => {
                http.post(url, params).then(data => {
                    if (data.code == 401) {
                        tag && commit("set_" + tag, data.state[0]);
                        console.log("set_"+tag,data.state[0]);
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