<template>
<div>
    <!-- 详细报表查询条件 -->
    <my-row class="selection-box" style="flex-direction: row;">
        <!-- 时间 -->
        <section class="dateTime">
        <div class="date-box-item">
            <span>激活时间</span>
            <el-date-picker
            size="medium"
            :picker-options="pickerOptions1"
            ref="picker1"
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            top="100"
            ></el-date-picker>
        </div>
        <div class="date-box-item">
            <span>充值时间</span>
            <el-date-picker
            size="medium"
            :picker-options="pickerOptions2"
            ref="picker2"
            v-model="payDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            top="100"
            ></el-date-picker>
        </div>
        </section>
        <!-- 游戏 -->
        <section style="padding-left:181px">
        <span style="font-size:15px;paddingRight:10px">游戏</span>
        <el-select v-model="games_value" filterable placeholder="请选择游戏">
            <el-option
            v-for="item in _state.games"
            :key="item.app_id"
            :label="item.app_name"
            :value="item.app_id"
            ></el-option>
        </el-select>
        </section>
        <!-- 渠道 -->
        <section style="padding-left:20px">
        <span style="font-size:15px;paddingRight:10px">渠道</span>
        <el-select v-model="channels_value" filterable placeholder="请选择渠道">
            <el-option
            v-for="(item,i) in _state.channelList"
            :key="i"
            :label="item.media_source"
            :value="item.media_source"
            ></el-option>
        </el-select>
        </section>
        <!-- 查询按钮 -->
        <el-button
        type="info"
        size="medium"
        class="search"
        @click="getData(3,'tableData')"
        style="margin-left:168px"
        >查询</el-button>
        <el-button type="info" size="medium" @click="excel()">导出表格</el-button>
    </my-row>
    <div class="filterBox">
        <el-input placeholder="请输入内容" style="width:350px;margin-right:15px"  v-model="input_tag">
            <template slot="prepend">标签</template>
        </el-input>
        <el-button type="info" size="medium" @click="filterData">筛选</el-button>
    </div>
    <!-- 表格 -->
    <div class="table-item">
        <el-table
            :data="_state.tableData"
            :cell-style="addStyle"
            :summary-method="getSummaries"
            show-summary
            style="width: 100%">
            <el-table-column  
            v-for="(item, i) in (Object.keys((_state.tableData && _state.tableData.length)?_state.tableData[0]:[]))"
            :key="i" 
            :width="i==0?350:''" 
            :prop="item"
            :label="item"
            :formatter="formatter"
            :fixed="i<=2?true:false"
            :sortable='i>0'
            >
            </el-table-column>
        </el-table>
    </div>
</div>
  
  
</template>
<script>
export default {
  data() {
    return {
      date: null,
      payDate: null,
      input_tag:'',
      pickerOptions1: {
        onPick({ minDate, maxDate }) {
          if (!maxDate) {
            this._parentEl.querySelector("input").value = moment(
              minDate
            ).format("YYYY-MM-DD");
          }
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.dateShortcuts('今天', picker)
          }
        }, {
          text: '昨天',
          onClick(picker) {
            picker.dateShortcuts('昨天', picker)
          }
        }, {
          text: '近7天',
          onClick(picker) {
            picker.dateShortcuts('近7天', picker)
          }
        }, {
          text: '近15天',
          onClick(picker) {
            picker.dateShortcuts('近15天', picker)
          }
        }, {
          text: '近30天',
          onClick(picker) {
            picker.dateShortcuts('近30天', picker)
          }
        }, {
          text: '近30-60天',
          onClick(picker) {
            picker.dateShortcuts('近30-60天', picker)
          }
        }, {
          text: '本月',
          onClick(picker) {
            picker.dateShortcuts('本月', picker)
          }
        }, {
          text: '上月',
          onClick(picker) {
            picker.dateShortcuts('上月', picker)
          }
        }, {
          text: '今年',
          onClick(picker) {
            picker.dateShortcuts('今年', picker)
          }
        }, {
          text: '去年',
          onClick(picker) {
            picker.dateShortcuts('去年', picker)
          }
        }]

      },
      pickerOptions2: {
        onPick({ minDate, maxDate }) {
          if (!maxDate) {
            this._parentEl.querySelector("input").value = moment(
              minDate
            ).format("YYYY-MM-DD");
          }
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.dateShortcuts('今天', picker)
          }
        }, {
          text: '昨天',
          onClick(picker) {
            picker.dateShortcuts('昨天', picker)
          }
        }, {
          text: '近7天',
          onClick(picker) {
            picker.dateShortcuts('近7天', picker)
          }
        }, {
          text: '近15天',
          onClick(picker) {
            picker.dateShortcuts('近15天', picker)
          }
        }, {
          text: '近30天',
          onClick(picker) {
            picker.dateShortcuts('近30天', picker)
          }
        }, {
          text: '近30-60天',
          onClick(picker) {
            picker.dateShortcuts('近30-60天', picker)
          }
        }, {
          text: '本月',
          onClick(picker) {
            picker.dateShortcuts('本月', picker)
          }
        }, {
          text: '上月',
          onClick(picker) {
            picker.dateShortcuts('上月', picker)
          }
        }, {
          text: '今年',
          onClick(picker) {
            picker.dateShortcuts('今年', picker)
          }
        }, {
          text: '去年',
          onClick(picker) {
            picker.dateShortcuts('去年', picker)
          }
        }]

      },
      
      
      channels_value:0,
      games_value:0,
      value2: null,
      // 
      in_app_id:0,
      in_app_tag_desc:"",


    }
  },
  computed:{
      _state() {
      return this.$store.state.h5_detailed_report;
    },
    // 筛选条件
    $$channellist() {
      var allData = this.$store.getters["h5_detailed_report/getChannelList"];
      return allData
    },
  },
   watch: {
    date(newData,oldData) {
      var date = newData.map(item => moment(item).format("YYYY-MM-DD"));
      if(new Date(date[0]).getTime()>new Date(this.payDate[1]).getTime()){
        this.date = oldData;
        return Utils.Notification.error({ message: '激活开始时间大于充值结束时间,请重新选择' });
      }else{
        this.$store.commit("h5_detailed_report/setDate", date);
        this.payDate = [date[0],this.payDate[1]]
      }
      
    },
    payDate(data){
      var date = data.map(item => {
        if(typeof item === 'string'){
          return item
        }
        return moment(item).format("YYYY-MM-DD")
      });
      this.$store.commit("h5_detailed_report/setPayDate", date);
    },
    games_value(newValue,oldValue){
      console.log(newValue);
      this.$store.commit("h5_detailed_report/setInAppId", newValue);
      if (!this._state.channelList.length) {
        this.in_app_id = newValue;
        this.getData(2,'channelList')
      }
        
    },
    channels_value(newValue,oldValue){
      this.$store.commit("h5_detailed_report/setChannelId", newValue);
    }
  },
  created() {
    this.dataInit();
    var params = {
        in_reg_date1: this._state.date[0],          //激活开始日期
        in_reg_date2: this._state.date[1],          //激活结束日期
        in_pay_date1:this._state.payDate[0],            //充值开始时间
        in_pay_date2:this._state.payDate[1],            //充值结束时间
        in_app_id: 0,                    //游戏层级 
        in_media_source: "",                           //渠道
        in_app_tag_desc:"",
        in_operator_type:1,
      };
      this.$store.dispatch("h5_detailed_report/getMOduleData",{ params, tag:'games'})
  },
  mounted() {
    this.$refs.picker1.mountPicker();
    this.$refs.picker1.picker.dateShortcuts = this.dateShortcuts
    this.$refs.picker1.picker._parentEl = this.$refs.picker1.$el;
    this.$refs.picker2.mountPicker();
    this.$refs.picker2.picker.dateShortcuts = this.dateShortcuts
    this.$refs.picker2.picker._parentEl = this.$refs.picker2.$el;
    window.addEventListener("keydown", this.onKeyDown);
  },
  methods: {
      getData(index,name) {
        if (index==3 && (!this.games_value || !this.channels_value)) {
          return Utils.Notification.warning({ message: "查询失败,请确认查询信息是否填写完整" })
        }
        var params = {
            in_reg_date1: this._state.date[0],          //激活开始日期
            in_reg_date2: this._state.date[1],          //激活结束日期
            in_pay_date1:this._state.payDate[0],            //充值开始时间
            in_pay_date2:this._state.payDate[1],            //充值结束时间
            in_app_id: this.games_value,                    //游戏层级 
            in_media_source: this.channels_value,                           //渠道
            in_app_tag_desc:this.input_tag,
            in_operator_type: index,               //视图类型：1 渠道 2 时间 3 地区
        };
        this.$store.dispatch("h5_detailed_report/getMOduleData", { params, tag:name })
      },
      filterData(){
        if (this.games_value && this.channels_value && this.input_tag) {
          this.getData(3,'tableData')
        }else{
          return Utils.Notification.warning({ message: "筛选失败,请确认筛选信息是否填写完整" })
        }
        this.input_tag = ''
      },
      excel() {
        var timestamp = Date.now()
        var thead = document.querySelector('.el-table__header thead').innerHTML
        var tbody = document.querySelector('.el-table__body tbody').innerHTML+document.querySelector('.el-table__footer tbody').innerHTML
        var table = document.createElement('table')
        table.innerHTML = `<thead>${thead}</thead><tbody>${tbody}</tbody>`
        Utils.tableToExcel(
        table,
        false,
        timestamp + '.xls'
        )
      },
      dateShortcuts(txt, picker) {
        var date
        switch (txt) {
            case '今天':
            var date_ = new Date
            date = [date_, date_]
            break
            case '昨天':
            var date_ = new Date
            date_.setTime(Date.now() - 3600 * 1000 * 24);
            date = [date_, date_]
            break
            case '近7天':
            var dateBegin = new Date
            var dataEnd = new Date
            dateBegin.setTime(Date.now() - 3600 * 1000 * 24 * 7);
            dataEnd.setTime(Date.now() - 3600 * 1000 * 24);
            date = [dateBegin, dataEnd]
            break
            case '近15天':
            var dateBegin = new Date
            var dataEnd = new Date
            dateBegin.setTime(Date.now() - 3600 * 1000 * 24 * 15);
            dataEnd.setTime(Date.now() - 3600 * 1000 * 24);
            date = [dateBegin, dataEnd]
            break
            case '近30天':
            var dateBegin = new Date
            var dataEnd = new Date
            dateBegin.setTime(Date.now() - 3600 * 1000 * 24 * 30);
            dataEnd.setTime(Date.now() - 3600 * 1000 * 24);
            date = [dateBegin, dataEnd]
            break
            case '近30-60天':
            var dateBegin = new Date
            var dataEnd = new Date
            dateBegin.setTime(Date.now() - 3600 * 1000 * 24 * 60);
            dataEnd.setTime(Date.now() - 3600 * 1000 * 24 * 30);
            date = [dateBegin, dataEnd]
            break
            case '本月':
            var dataEnd = new Date
            var curyear = dataEnd.getFullYear()
            var curmonth = dataEnd.getMonth()
            dateBegin = new Date(curyear, curmonth, 1)
            date = [dateBegin, dataEnd]
            break
            case '上月':
            var dataEnd = new Date
            var curyear = dataEnd.getFullYear()
            var curmonth = dataEnd.getMonth()
            dateBegin = new Date(curyear, curmonth - 1, 1)
            dataEnd = new Date(curyear, curmonth, 0)
            date = [dateBegin, dataEnd]
            break
            case '今年':
            var dataEnd = new Date
            var curyear = dataEnd.getFullYear()
            dateBegin = new Date(curyear, 0, 1)
            date = [dateBegin, dataEnd]
            break
            case '去年':
            var dataEnd = new Date
            var curyear = dataEnd.getFullYear()
            var curmonth = dataEnd.getMonth()
            dateBegin = new Date(curyear - 1, 0, 1)
            dataEnd = new Date(curyear, 0, 0)
            date = [dateBegin, dataEnd]
            break
        }
        picker.$emit('pick', date);
      },
      dataInit() {
        this.date = this._state.date;
        this.payDate = this._state.payDate;
        this.games_value = this._state.appId;
        this.channels_value = this._state.channelId;
      },
      formatter(row, column, value) {
        var {
            label
        } = column
        if (
            label === '注册率'
            || label === '创角率'
            
        ) {
            // value += '%'
            value = +value ? value.format(2)+'%':value.format(0)+'%';
        }else if(label === 'ROI'|| label === '分成ROI'){
            value = (value).format(2) + '%';
        }else if (
            label === '次日留存'
            || label === '3日留存'
            || label === '7日留存'
        ) {
            value = value.format(2) + '%';
        }else if(label === '激活成本'
            || label === '注册成本'
            || label === '创角成本'
            || label == '7日LTV'
            || label == '14日LTV'
            || label == '30日LTV'
            || label == '充值'){
            value = +value ? value.format(2):value.format(0);

        }
        return value
      },
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        var activeData = []; 
        var constData = [];
        var LTVINDEX = 6;//ltv下标
        var REGISTERINDEX = 1; //注册下标
        columns.forEach((column, index) => {
            if (index === 0) {
            sums[index] = '全部';
            return;
            }
            var values = data.map((item) => Number(item[column.property]));
            if (index === REGISTERINDEX) {
            activeData = values
            }

            if(index > LTVINDEX){
            var arr = [];
            for (let index = 0; index < values.length; index++) {
                arr.push(values[index]*(activeData[index]))
            }
            
            values = arr
            }
            if (!values.every(value => isNaN(value))) {
            
            sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);            
                if (!isNaN(value)) {
                return (prev + curr).format(2);
                } else {
                return prev;
                }
            }, 0);
            } else {
            sums[index] = 'N/A';
            }
            // if (column.property == '注册率') {
            // sums[index] = (sums[3] / sums[2] * 100).format(2) + '%';
            // }
            if (column.property == '创角率') {
              sums[index] = ((sums[2] / sums[1]) * 100).format(2) + '%';
              // sums[index] = 888 + '%';
              console.log(11111111,sums[index]);
              
            }
        });
        // sums[7] = (sums[10] / sums[2]).format(2); //激活成本
        // sums[8] = (sums[10] / sums[3]).format(2); //注册成本
        // sums[9] = (sums[10] / sums[4]).format(2); //创角成本
        // sums[12] = ((sums[11] / sums[10])*100).format(2) + '%'; //ROI
        // sums[14] = ((sums[13] / sums[10])*100).format(2) + '%'; //分成ROI

        sums[6] = ((sums[6] / sums[2])).format(2); //7日LTV
        sums[7] = ((sums[7] / sums[2])).format(2); //14日LTV
        sums[8] = ((sums[8] / sums[2])).format(2); //30日LTV
        sums[9] = ((sums[9] / sums[2])).format(2) + '%';
        sums[10] = ((sums[10] / sums[2])).format(2) + '%';
        sums[11] = ((sums[11] / sums[2])).format(2) + '%';
        
        return sums;
      },
      addStyle({ row, column, rowIndex, columnIndex }) {
        function r2g(value, avg) {
            var percent = value;
            if (percent < 30) return "#f9686a";
            else if (percent <= 50) return "#ffc0cb";
            else if (percent <= 70) return "#ffeb85";
            else if (percent <= 90) return "#98fb98";
            else return "#228b22";
        }
        function g2r(value, avg) {
            var middle = avg / 0.5;
            var percent = value / middle;
            if (percent <= 0.2) return "#228b22";
            else if (percent <= 0.4) return "#98fb98";
            else if (percent <= 0.6) return "#ffeb85";
            else if (percent <= 0.8) return "#ffc0cb";
            else return "#f9686a";
        }
        function retColor(mmaObj, data) {
            var avg = mmaObj ? mmaObj.avg : 0;
            var isReversal = mmaObj ? mmaObj.isReversal : true;
            var style = {
            fontWeight: 700,
            color: "#000"
            };
            if (isReversal == true) {
            style["background"] = g2r(data, avg);
            } else {
            style["background"] = r2g(data, avg);
            }
            return style;
        }

        var { label } = column;
        switch (label) {
            case '创角率':
            return retColor(this.$$channellist.mmas[label], row[label]);
            break;
            case '注册成本':
            return retColor(this.$$channellist.mmas[label], row[label]);
            break;
            case '创角成本':
            return retColor(this.$$channellist.mmas[label], row[label]);
            break;
        }

      },
  },

}
</script>
<style lang="scss" scoped>
.filterBox{
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid rgba(208, 196, 214, 0.5);
    border-bottom: 1px solid rgba(208, 196, 214, 0.5);
    padding: 10px 15px;
    margin-top: 20px;
    margin-bottom: 5px;
}
.el-select-dropdown__item {
  text-align: center;
}
.el-tabs {
  width: 100%;
}
.selection {
  margin-left: 15px;
}
.selection-box {
  position: relative;
  .dateTime{
    position: absolute;
    top: -60px;
    left: 165px;
    display: flex;
  }
  .tag {
    margin: 15px 0 15px 16px;
  }
  .r-g {
    font-size: 15px;
    padding-left: 15px;
  }
  margin-top: 5px;
  .mail {
    display: flex;
    // justify-content: flex-end;
    flex-grow: 1;
    margin: 0px 10px 0 0;
    button:nth-child(1) {
      margin-left: 50px;
    }
  }
}
.date-box {
  margin-top: 15px;
}
.date-box-item {
  span {
    font-size: 15px;
    padding-right: 10px;
  }
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 15px;
}
.table-item {
    background: rgba(208, 196, 214, 0.5);
    margin: 12px;
    padding: 15px;
  }
</style>
