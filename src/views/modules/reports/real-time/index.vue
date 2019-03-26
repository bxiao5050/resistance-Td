<template>
  <div class="daiding">
    <!-- 投放报表查询条件 -->
    <my-row class="selection-box">
      <div class="banner">
        <!-- 日期 -->
        <section style="margin-left:20px">
          <el-date-picker v-model="date" type="date" placeholder="选择日期"></el-date-picker>
        </section>
        <!-- 系统 -->
        <section style="margin-left:20px">
          <span style="min-width:40px">系统</span>
          <el-select v-model="os" style="width: 100px; height:40px">
            <el-option
              v-for="(item) in options"
              :key="item.os"
              :label="item.label"
              :value="item.os"
            ></el-option>
          </el-select>
        </section>
        <!-- 时区 -->
        <section style="margin-left:20px">
          <el-select v-model="timeZoneValue" style="width: 100px; height:40px">
            <el-option
              v-for="(item) in timeZone"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </section>
        <!-- 游戏 -->
        <section style="margin-left:20px">
          <el-button size="medium" style="height:40px" @click="data.isShow=true">
            <span>已选择：</span>
            <span>{{_rcg}}</span>
          </el-button>
        </section>
        <el-button size="medium" class="search" @click="getData()" style="margin-left:20px">查询</el-button>
        <div class="mail">
          <el-button class="exportBtn" @click="exportChart(index)" style="margin-left:300px">
            <i class="el-icon-download"></i>导出xls文件
          </el-button>
        </div>
      </div>
    </my-row>
    <!-- 游戏下拉框 -->
    <my-row>
      <tsdp :data="data" v-if="data.isShow"></tsdp>
    </my-row>
    <!-- 激活表 -->
    <section
      :class="['chart',chartName[index].isZoom ? 'zoomClass':'']"
      v-for="(item,index) in ($$getRealData.lineData?$$getRealData.lineData:[])"
      :key="index"
    >
      <!-- 表头 -->
      <section class="thead">
        <strong>{{chartName[index].title}}</strong>
        <section>
          <el-button class="visibleBtn" @click="visibleChart(index)">
            <i :class="chartName[index].hide?'el-icon-minus':'el-icon-plus'"></i>
          </el-button>
          <el-button class="zoomBtn" @click="zoomChart(index)">
            <i class="el-icon-zoom-in"></i>
          </el-button>
        </section>
      </section>
      <!-- 表体 -->
      <div class="chart-area" ref="chart" :id="chartName[index].name" style="height: 300px"></div>
    </section>
    <!-- <tr></tr> -->
  </div>
</template>

<script>
import tsdp from "src/component/widget/real-time-select-box/index.vue";
import http from "src/services/http";
import { debug } from 'util';
import $ from 'jquery';
import { setTimeout, setInterval } from 'timers';

export default {
  components: {
    tsdp
  },
  data() {
    return {
      date: null,
      os: null,
      chart: null,
      $_chartIsReady: 0,
      timeZoneValue: 0,
      chartName: [{ name: 'activation', title: '实时激活数据(延迟1小时)', hide: true, isZoom: false },
      { name: 'registered', title: '实时注册数据(延迟1小时)', hide: true, isZoom: false },
      { name: 'wreck', title: '实时创角数据(延迟1小时)', hide: true, isZoom: false },
      { name: 'registrationRate', title: '实时注册率数据(延迟1小时)', hide: true, isZoom: false },
      { name: 'angerRate', title: '实时创角率数据(延迟1小时)', hide: true, isZoom: false },],
      options: [{
        os: '0,1',
        label: '全部'
      }, {
        os: '0',
        label: 'IOS'
      }, {
        os: '1',
        label: '安卓'
      }],
      timeZone: [{
        value: 0,
        label: '东七区'
      }, {
        value: 1,
        label: '东八区'
      }, {
        value: 2,
        label: '东九区'
      }],
      data: {
        allTxt: "全部",
        isShow: false,
        callback: this.setRcg,
        region: null,           //地区
        regionArr: [],          //一级菜单数组
        game: null,             //游戏名
        gameArr: []             //二级菜单数组
      },
    }
  },
  watch: {
    date(data) {
      var date = [moment(data).add(-2, "day").format("YYYY-MM-DD"), moment(data).format("YYYY-MM-DD")];
      this.$store.commit("o_r_real/setDate", date);
    },
    os(data) {
      this.$store.commit("o_r_real/setOs", data);
    }
  },
  computed: {
    $$getRealData() {
      var allData = this.$store.getters["o_r_real/getRealData"];
      if (allData.lineData[0] && allData.lineData[0].length) {
        this.$nextTick(() => {
          this.createChart();
        });
      }
      return allData

    },
    _state() {
      return this.$store.state.o_r_real;
    },
    _key() {
      return this.$store.getters["o_r_real/getIdStr"];
    },
    _rcg() {
      var str = "";
      var { regionArr, region, gameArr, game } = this.data;
      if (regionArr.length) {
        str += region;
        if (gameArr.length) {
          str += " - " + game;
          var list1 = this.$store.getters["overseas_common_realTime/getList1"];
          var gameId = gameArr[0];
        } else {
          str += " - " + "全部游戏";
        }
      }
      return str;
    },
  },
  methods: {
    // 导出表格
    exportChart(index) {
      var timestamp = Date.now()
      var thead = this.$$getRealData.theadArr
      var tbody = this.$$getRealData.tbodyArr
      var table = document.createElement('table')
      console.log('tag', thead)
      console.log('tag', tbody)
      table.innerHTML = `<thead>${thead}</thead><tbody>${tbody}</tbody>`
      Utils.tableToExcel(
        table,
        false,
        timestamp + '.xls'
      )
    },
    //缩放图表
    zoomChart(index) {
      this.chartName[index].isZoom = !this.chartName[index].isZoom
    },
    //收缩图表
    visibleChart(index) {
      if (this.chartName[index].isZoom) {
        Utils.Notification.warning({
          message: '当前图表为放大状态,无法收缩'
        })
        return
      }
      this.chartName[index].hide = !this.chartName[index].hide;
      if (parseInt($(`#${this.chartName[index].name}`).css('height'))) {
        $(`#${this.chartName[index].name}`).animate({ height: "0px" })

      } else {
        $(`#${this.chartName[index].name}`).animate({ height: "300px" })
      }
    },
    // 获取数据
    getData() {
      this.$store.commit("o_r_real/setRegion", this.data.region);
      this.$store.commit("o_r_real/setRegionArr", this.data.regionArr);
      this.$store.commit("o_r_real/setGame", this.data.game);
      this.$store.commit("o_r_real/setGameArr", this.data.gameArr);
      var params = {
        in_begin_date: this._state.date[0],          //开始日期
        in_end_date: this._state.date[1],             //结束日期
        in_os: this._state.os,                        //系统                  
        in_area_app_ids: this._key,                    //游戏层级 
      };
      this.$store.dispatch("o_r_real/getReportInfo", { params, tag: 'real' }).then(

      );
    },
    // 菜单
    setRcg([region, regionArr, game, gameArr]) {
      this.data.region = region;
      this.data.regionArr = regionArr;
      this.data.game = game;
      this.data.gameArr = gameArr;
    },
    // 
    dataInit() {
      // 日期初始化
      if (this._state.date) {
        this.date = this._state.date[1];
      } else {
        this.date = moment().add(0, "day").format("YYYY-MM-DD")
      }
      // 系统下拉框初始化
      if (this._state.os) {
        this.os = this._state.os;
      } else {
        this.os = "0,1";
      }
      // 
      if (this._state.region) this.data.region = this._state.region;
      if (this._state.regionArr) this.data.regionArr = this._state.regionArr;
      if (this._state.game) this.data.game = this._state.game;
      if (this._state.gameArr) this.data.gameArr = this._state.gameArr;
    },
    createChart() {
      for (let index = 0; index < this.$$getRealData.lineData.length; index++) {
        var chart = Highcharts.chart(this.chartName[index].name, {
          chart: {
            type: 'spline',
          },
          legend: {
            align: 'center', //水平方向位置
            // layout: 'vertical',
            verticalAlign: 'top', //垂直方向位置
            x: 0, //距离x轴的距离
            y: 20 //距离Y轴的距离
          },
          title: {
            text: '',
          },
          subtitle: {
            text: ''
          },
          xAxis: {
            categories: this.$$getRealData.xList,
            crosshair: {
              width: 1,
              color: '#747474'
            }
          },
          yAxis: {
            title: {
              text: ''
            },
            labels: {
              format: '{value:.0f}'//设置y轴显示格式
            },
            crosshair: {
              width: 1,
              color: '#747474'
            }
          },
          tooltip: {
            shared: true,
          },
          plotOptions: {
            line: {
              dataLabels: {
                // 开启数据标签
                enabled: false
              },
              // 关闭鼠标跟踪，对应的提示框、点击事件会失效
              enableMouseTracking: true
            },
            series: {
              // 隐藏拐点
              marker: {
                enabled: false
              },
              events: {
                // legendItemClick: function () {
                //   // return false 即可禁止图例点击响应
                //   return false;
                // }
              }
            }
          },
          credits: {
            enabled: false　　　　　　//去除highcharts的链接
          },
          series: this.$$getRealData.lineData[index],
          navigation: {
            buttonOptions: {
              enabled: true
            }
          }

        });
        this.$data.$_chartIsReady = Math.random()
      }
    },
  },
  created() {
    this.dataInit()
    this.$store.dispatch("overseas_common_realTime/getList1").then(data => {
      if (!this._state.region || !this._state.regionArr.length) {
        this.data.region = this.data.allTxt;
        this.data.regionArr = this.$store.state.overseas_common_realTime.list1All;
      }
      // 菜单获取成功,更新数据
      if (!this._state['real'][this._key]) {
        console.log(new Date())
        this.getData();
        setInterval(() => {
          this.getData();
          console.log(new Date())
        }, 1000*60*60);
      }
    });
  },

}
</script>

<style lang="scss" scoped>
.banner {
  width: 100%;
  display: flex;
  justify-content: start;
  // border: 1px solid;
  .mail {
    display: flex;
    justify-content: flex-end;
    flex-grow: 1;
    margin: 0px 10px 0 0;
  }
}

// 激活表
.chart {
  margin: 20px 10px;
  border: 15px solid #e7e1ea;
  .thead {
    width: 100%;
    height: 40px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    strong {
      height: 35px;
      display: inline-block;
      line-height: 35px;
      padding: 0;
      margin: 0;
      text-align: left;
      font-weight: 400 !important;
      font-size: 13px;
      color: gray;
      padding-left: 15px;
    }
    section {
      .zoomBtn,
      .visibleBtn {
        height: 30px;
        font-size: 12px;
        padding: 0 10px;
        margin-top: 5px;
      }
      .zoomBtn {
        margin-right: 15px;
      }
    }
  }
}
// 缩放样式
.zoomClass {
  width: 100%;
  height: 100%;
  margin: 0px 0px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  background: white;
}
</style>


