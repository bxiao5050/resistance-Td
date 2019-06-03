<template>
  <div class="reports-market">
    <!-- 投放报表查询条件 -->
    <my-row class="selection-box">
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
      <section style="padding-left:182px">
        <span style="font-size:15px;paddingRight:10px">游戏</span>
         <el-select v-model="games_value" placeholder="请选择游戏">
          <el-option
            v-for="item in _state.games"
            :key="item.app_id"
            :label="item.app_name"
            :value="item.app_id">
          </el-option>
        </el-select>
      </section>   
      <!-- 查询按钮 -->
      <el-button
         type="info"
        size="medium"
        class="search"
        @click="queryClick()"
        style="margin-left:206px"
      >查询</el-button>
      <el-button type="info" size="medium" @click="excel()">导出表格</el-button>
      <!-- 邮件 -->
      <div style="position:relative;">
        <el-date-picker
          ref="picker"
          v-model="value2"
          align="right"
          type="date"
          style="position:absolute;z-index:-1;width:200px;left:24px;visibility:hidden;"
          @change="pickerChange"
        ></el-date-picker>
        <el-button type="info" size="medium" style="margin: 0 15px" @click="createMail()">邮件生成</el-button>
      </div>
      <el-button type="info" size="medium" @click="checkMail()">邮件查看</el-button>
    </my-row>
    <my-row>
      <el-tabs v-model="taging" @tab-click="tagClick()" style="marginTop:35px">
        <el-tab-pane
          v-if="isSingle"
          v-for="({ label }, tag) in tags"
          :key="tag"
          :label="label"
          :name="tag"
        ></el-tab-pane>
        <!-- 动态组件 -->
        <component :is="main"  :_config="[]" ></component>
      </el-tabs>
    </my-row>
  </div>
</template>

<script>
import tsdp from "src/component/widget/tree-degree-select-box/index.vue";
import api from "src/services/api";
import http from "src/services/http";
// 渠道报表
import channel from "./channel.vue";
// 综合报表
import comprehensive from "./comprehensive.vue";
// 每日报表
import daily from "./daily.vue";
export default {
  name: "reports-market",
  components: {
    tsdp,
    channel,
    comprehensive,
    daily,
  },
  data() {
    return {
      games_value: '',
      isSingle: true,
      mailDate: null,
      
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
      value2: null,
      main: null,
     
      date: null,
      payDate:null,
      taging: null,
      tags: {
        comprehensive: {
          label: "综合报表",
          tag: "comprehensive"
        },
        daily: {
          label: "每日报表",
          tag: "daily"
        },
      },
      isShow:false,
      tags_: null,
      taging_: null,
      in_rpt_type: 1,
      in_view_type: 0,
      in_chart_type: 1,
      in_app_ids:'',
      in_media_source:'',
      in_country:'',

    };
  },
  computed: {

    _state() {
      return this.$store.state.h5_delivery_report;
    },
  },
  watch: {
    date(newData,oldData) {
      var date = newData.map(item => moment(item).format("YYYY-MM-DD"));
      if(new Date(date[0]).getTime()>new Date(this.payDate[1]).getTime()){
        this.date = oldData;
        return Utils.Notification.error({ message: '激活开始时间大于充值结束时间,请重新选择' });
      }else{
        this.$store.commit("h5_delivery_report/setDate", date);
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
      this.$store.commit("h5_delivery_report/setPayDate", date);
    },
    games_value(newValue,oldValue){
        this.$store.commit("h5_delivery_report/setAppId", newValue);
        
    }
  },
  methods: {
    getFilterList() {
      var params = {
        in_reg_date1: this._state.date[0],          //激活开始日期
        in_reg_date2: this._state.date[1],          //激活结束日期
        in_pay_date1:this._state.payDate[0],            //充值开始时间
        in_pay_date2:this._state.payDate[1],            //充值结束时间
        in_app_ids: this.games_value,                    //游戏层级 
        in_media_source: '',                           //渠道
        in_rpt_type: 4,                                //报表类型: 1 查询游戏层级  2 综合报表  3 每日报表   4 渠道(媒体)报表   5 系统对比
        in_country: this.in_country,                               //国家
        in_chart_type: 0,                              //数据展现图表类型 ：0 查询渠道地区信息 1 表格 2 图例
        in_view_type: 1                                //视图类型：1 渠道 2 时间 3 地区
      };
      this.$store.dispatch("h5_delivery_report/getReportInfo", { params, tag: 'channelInfo' });
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
    excel() {
      var timestamp = Date.now()
      // if (this.main === "comprehensive") {
      //   var data = this.$store.getters["h5_delivery_report/getComprehensive"];
      //   var len = data.category.length
      //   for (var i = 0; i < len; i++) {
          // var thead = document.querySelectorAll('.el-table__header thead')[i].innerHTML
          // var tbody = document.querySelectorAll('.el-table__header-wrapper+.el-table__body-wrapper>table:first-child')[i].innerHTML
          // var table = document.createElement('table')
          // table.innerHTML = `<thead>${thead}</thead><tbody>${tbody}</tbody>`

          // Utils.tableToExcel(
          //   table,
          //   false,
          //   (timestamp + i) + '.xls'
          // )
        // }
      // } else {
        var thead = document.querySelector('.el-table__header thead').innerHTML
        var tbody = document.querySelector('.el-table__body tbody').innerHTML
        var table = document.createElement('table')
        table.innerHTML = `<thead>${thead}</thead><tbody>${tbody}</tbody>`
        Utils.tableToExcel(
          table,
          false,
          timestamp + '.xls'
        )
      // }
    },
    checkMail() {
      if (this._state.mailUrl) {
        window.open(http.host + this._state.mailUrl);
      } else {
        this.$notify({
          type: "warning",
          message: "点击生成邮件"
        });
      }
    },
    pickerChange() {
      var date = moment(this.value2).format("YYYY-MM-DD");
      if (confirm("确定生成" + date + "的邮件吗")) {
        this.$data.mailDate = date

        api.user
          .getMail({
            countDate: date,
            gameIds: '19,33,34,36,38,41,46,47,48,57,58,59,60'
          })
          .then(({ code, state }) => {
            if (code === 303) {
              this._state.mailUrl = state;
            } else {
              this.$notify({
                type: "warning",
                message: "邮件生成出现错误"
              });
            }
          });
      }
    },
    tagClick() {
        this.main = this.taging
        if (this.main === "comprehensive") {
          this.in_app_ids = this._state.in_app_ids;
          this.in_media_source = '';
          this.in_rpt_type = 2;
          this.in_country = '';
          this.in_chart_type = 0,            
          this.in_view_type = 0,               
          this.getData('comprehensive')
        }else{
          this.in_app_ids = this._state.in_app_ids;
          this.in_media_source = '';
          this.in_rpt_type = 3;
          this.in_country = '';
          this.in_chart_type = 0,             
          this.in_view_type = 0,               
          this.getData('daily')
        }
        
    },

    dataInit() {
      if (this._state.taging) {
        this.main = this.taging = this._state.taging;
      } else {
        this.main = this.taging = "comprehensive";
      }
      this.date = this._state.date;
      this.payDate = this._state.payDate;
      this.games_value = this._state.games_value;
     
    },
    queryClick(){
      console.log(this.main );
      var tagArr = ['games','comprehensive','daily','channel']
      if (this.games_value) {
          this.main = 'channel';
          this.isSingle = false;
      }else{
          this.main = 'comprehensive';
      }
      console.log(tagArr.indexOf(this.main )+1);
      var index = tagArr.indexOf(this.main )+1
      switch (index) {
        case 2://综合报表
          this.in_app_ids = this._state.allGameId;
          this.in_media_source = '';
          this.in_country = '';
          this.in_rpt_type = 2;
          this.in_chart_type = 0;
          this.in_view_type = 0;
          this.getData(this.main )
          break;
        case 3://每日报表
          this.in_app_ids = this._state.allGameId;
          this.in_media_source = '';
          this.in_country = '';
          this.in_rpt_type = 3;
          this.in_chart_type = 0;
          this.in_view_type = 0;
          this.getData(this.main )
          break;
        case 4://渠道报表
          this.in_app_ids = this.games_value;
          this.in_media_source = '';
          this.in_country = '';
          this.in_rpt_type = 4;
          this.in_chart_type = 1;
          this.in_view_type = 1;
          console.log(this.main);
          
          this.getData(this.main )
          break;
        default:
          break;
      }
    },
    getData(taging_) {
      // 修改动态组件
      if (taging_) this.taging = taging_;
      this.main = this.taging;
      var params = {
        in_reg_date1: this._state.date[0],          //激活开始日期
        in_reg_date2: this._state.date[1],          //激活结束日期
        in_pay_date1:this._state.payDate[0],            //充值开始时间
        in_pay_date2:this._state.payDate[1],            //充值结束时间
        in_app_ids: this.in_app_ids,                    //游戏层级 
        in_media_source: this.in_media_source,                           //渠道
        in_rpt_type: this.in_rpt_type,                 //报表类型 1 查询游戏层级  2 综合报表  3 每日报表  4 渠道(媒体)报表   5 系统对比
        in_country: this.in_country,                               //国家
        in_chart_type: this.in_chart_type,             //数据展现图表类型 ：0 查询渠道地区信息 1 表格 2 图例
        in_view_type: this.in_view_type,               //视图类型：1 渠道 2 时间 3 地区
      };
      this._state.lastQueryParam[this.taging] = params;
      this.$store.dispatch("h5_delivery_report/getReportInfo", { params, tag: this.$store.state.h5_delivery_report.tableIsVisible ? this.taging : 'legend' }).then(
        () => {
          if (this.taging == 'channel' && 　this.$store.state.h5_delivery_report.tableIsVisible) {
            this.getFilterList()
          }
        }
      );
    },
    createMail() {
      this.$refs.picker.showPicker();
    },
  },
  created() {
    this.dataInit();
     var params = {
        in_reg_date1: this._state.date[0],          //激活开始日期
        in_reg_date2: this._state.date[1],          //激活结束日期
        in_pay_date1:this._state.payDate[0],            //充值开始时间
        in_pay_date2:this._state.payDate[1],            //充值结束时间
        in_app_ids: this.in_app_ids,                    //游戏层级 
        in_media_source: "",                           //渠道
        in_rpt_type: this.in_rpt_type,                 //报表类型 1 查询游戏层级  2 综合报表  3 每日报表  4 渠道(媒体)报表   5 系统对比
        in_country: '',                               //国家
        in_chart_type: this.in_chart_type,             //数据展现图表类型 ：0 查询渠道地区信息 1 表格 2 图例
        in_view_type: this.in_view_type,               //视图类型：1 渠道 2 时间 3 地区
      };
      this.$store.dispatch("h5_delivery_report/getReportInfo",{ params, tag:'games'}).then(()=>{
        this.in_app_ids = this._state.allGameId;
        this.in_media_source = '';
        this.in_rpt_type = 2;
        this.in_country = '';
        this.in_chart_type = 0,             //数据展现图表类型 ：0 查询渠道地区信息 1 表格 2 图例
        this.in_view_type = 0,               //视图类型：1 渠道 2 时间 3 地区
        this.getData('comprehensive')
      })
    
  },
  mounted() {
    // 如果加载渠道报表则隐藏报表tab选项
    if (this.games_value) {
      this.isSingle = false;
    }
    this.$refs.picker1.mountPicker();
    this.$refs.picker1.picker.dateShortcuts = this.dateShortcuts
    this.$refs.picker1.picker._parentEl = this.$refs.picker1.$el;
    this.$refs.picker2.mountPicker();
    this.$refs.picker2.picker.dateShortcuts = this.dateShortcuts
    this.$refs.picker2.picker._parentEl = this.$refs.picker2.$el;
    window.addEventListener("keydown", this.onKeyDown);
  },
  destroyed() {
    window.removeEventListener("keydown", this.onKeyDown);
  }
};
</script>

<style lang="scss" scoped>
.os {
  width: 100px;
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
</style>


