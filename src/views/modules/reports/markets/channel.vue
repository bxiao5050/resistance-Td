<template>
  <div>
    <div v-if="$data.$_curChannel">
      <el-button size="medium" @click="back()">
        <span>
          当前渠道:
          <span style="color:#5b5691;font-weight:700">{{$data.$_curChannel}}</span>
          —— 返回
        </span>
      </el-button>
    </div>

    <div class="centerBox">
      <!-- 筛选行 -->
      <section class="btns">
        <el-select class="os" v-model="value" size="medium">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button size="medium" @click="slide(200)">筛选</el-button>
      </section>
      <!-- 图例 -->
      <div class="legendBox" v-show="!$store.state.o_r_delivery.tableIsVisible">
        <div style="text-align: center;">
          <el-select class="os" v-model="lineValue">
            <el-option
              v-for="item in $$legend.lineSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <!-- left -->
        <section class="left">
          <div style="width: 90%;      margin: 10px 10%;">
            <el-autocomplete
              class="inline-input"
              v-model="inputTxt"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              :trigger-on-focus="false"
              @select="handleSelect"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-autocomplete>
          </div>

          <div class="leftList">
            <section
              class="list_"
              v-for="(item,index) in this.leftlistArr"
              :key="index"
              @click="changLeftList(index)"
            >
              <span>{{item.name}}</span>
              <i class="el-icon-circle-plus-outline" v-show="item.visible"></i>
              <i class="el-icon-remove-outline" v-show="!item.visible"></i>
            </section>
          </div>
        </section>
        <!-- right -->
        <section class="right">
          <div class="chartBox">
            <section
              class="list_"
              v-for="(item,index) in this.rightListArr"
              :key="index"
              v-show="item.visible"
              @click="changLeftList(index)"
            >
              <span>{{item.name}}</span>
              <i class="el-icon-remove-outline"></i>
            </section>
          </div>
          <div class="chart-area" ref="chart"></div>
        </section>
      </div>
      <!-- 筛选框 -->
      <section class="filterBox" :style="{right:`${width}px`}">
        <div class="filter_">
          <span>{{filterTitle[0].name}}</span>
          <el-select class="os" v-model="viewValue" size="medium">
            <el-option
              v-for="item in filterTitle[0].options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="filter_">
          <span>{{filterTitle[1].name}}</span>
          <el-select class="os" v-model="systemValue" size="medium">
            <el-option
              v-for="item in filterTitle[1].options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="filter_">
          <span>{{filterTitle[2].name}}</span>
          <el-select class="os" v-model="channelValue" size="medium">
            <el-option
              v-for="item in $$getChannelInfo.channelName"
              :key="item.value"
              :label="item.lable"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="filter_">
          <span>{{filterTitle[3].name}}</span>
          <el-select class="os" v-model="areaValue" size="medium">
            <el-option
              v-for="item in $$getChannelInfo.channelNameData[channelValue==''? 0 : channelValue]"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <el-button type="warning" plain @click="filterReset()">重置</el-button>
        <el-button type="success" plain @click="filterData()">应用</el-button>

      </section>

      <!-- 表格 -->
      <div v-show="$store.state.o_r_delivery.tableIsVisible" class="table-item">
        <el-table
          :data="$store.getters['o_r_delivery/getAllChannel']"
          :cell-style="addStyle"
          :summary-method="getSummaries"
          show-summary
        >
          <el-table-column
            v-for="(item, i) in (Object.keys($store.getters['o_r_delivery/getAllChannel']?$store.getters['o_r_delivery/getAllChannel'][0]:[]))"
            :key="i"
            :prop="item"
            :label="item"
            :formatter="formatter"
            :width="i==0 ? 115:''"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
// import totalFloat from "./total-float";
import http from 'src/services/http';
export default {
  props: ['data', '_config', '_types'],
  components: {
    // totalFloat
  },
  mounted(){
    this.$store.state.o_r_delivery.tableIsVisible = true;
    this.value = 'table'
    console.log('1111111111111111', this.$store.getters['o_r_delivery/getAllChannel'])
  },
  watch: {
    channels(channels) {
      this.$store.commit("o_r_delivery/set_channels", channels);
    }
  },
  data: () => {
    return {
      $_order: "ascending",
      $_chartIsReady: 0,
      $_curChannel: null,
      $_mainKey: null,
      $_sortKey: null,
      $_mainTag: null,
      channels: [],
      newlist: [],
      inputTxt: "",
      value: "table",
      width: -200,
      viewValue: '1',
      systemValue: '2',
      lineValue: 0,
      channelValue: '',
      areaValue: '',
      chart: null,
      restaurants: [ ],
      rightListArr: [],
      leftlistArr: [],
      lineArr: [],
      options: [{ value: "table", label: "表格" }, { value: "legend", label: "图例" },],
      filterTitle: [{ name: '视图', value: '1', options: [{ value: '1', label: '渠道' }, { value: '2', label: '时间' }, { value: '3', label: '地区' },] },
      { name: "系统", value: '2', options: [{ value: '2', label: '全部' }, { value: '0', label: 'IOS' }, { value: '1', label: 'android' },] },
      { name: "渠道", value: 'qb', options: [{ value: 'qb', label: '全部' }] },
      { name: "地区", value: 'qb', options: [{ value: 'qb', label: '全部' }] }],
      lineData: [],
      areaArr: [{ media_source: 'qb', country_name: '全部' }]
    };
  },
  computed: {
    $$getChannelInfo(){
      var getChannelInfo = this.$store.getters["o_r_delivery/getChannelInfo"];
      return getChannelInfo

    },
    // 筛选条件
    $$channellist() {
      var allData = this.$store.getters["o_r_delivery/getChannelList"];
      return allData
    },
    // 图例
    $$legend() {
      var allData = this.$store.getters["o_r_delivery/getLengendData"];
      if (allData && allData.leftlistArr) {
        this.leftlistArr = allData.leftlistArr
        this.rightListArr = allData.rightListArr
        this.lineData = allData.lineData
        // this.leftlistArr = this.$$legend.leftlistArr.slice(0);
         this.$nextTick(() => {
          this.createChart();
          
        });
      }
      return allData
    },
    _state() {
      return this.$store.state.o_r_delivery;
    },
    _key() {
      return this.$store.getters["o_r_delivery/getIdStr"];
    }
  },

  watch:{
    //切换linevalue 恢复默认显示
    lineValue(newValue, oldValue) {
      for (let index = 0; index < this.$$legend.leftlistArr.length; index++) {
        if (index == 0) {
          this.$$legend.leftlistArr[index].visible = false
          this.$$legend.rightListArr[index].visible = true
        }else{
          this.$$legend.leftlistArr[index].visible = true
          this.$$legend.rightListArr[index].visible = false
        }

      }
      this.createChart();
    },
    // 切换图利表格视图
    value(newValue, oldValue) {
      this.$store.state.o_r_delivery.tableIsVisible = !this.$store.state.o_r_delivery.tableIsVisible;
      if (this.$store.state.o_r_delivery.tableIsVisible ) {
        this.filterTitle[0] = { name: '视图', value: '1', options: [{ value: '1', label: '渠道' }, { value: '2', label: '时间' }, { value: '3', label: '地区' },] }
      }else{
        this.filterTitle[0] = { name: '视图', value: '1', options: [{ value: '1', label: '渠道' }, { value: '3', label: '地区' },] }
      }
      // 恢复默认筛选条件
      this.viewValue = '1';
      this.systemValue = '2';
      this.channelValue = '';
      this.areaValue = '';
      this.lineValue = 0;
      var params = {
        in_begin_date: this._state.date[0], //开始日期
        in_end_date: this._state.date[1],   //结束日期
        in_os: this._state.os,                         //系统                  
        in_area_app_ids: this._key,                    //游戏层级 
        in_media_source: "",                           //渠道
        in_rpt_type: 4,                                //报表类型 1 查询游戏层级  2 综合报表  3 每日报表  4 渠道(媒体)报表   5 系统对比
        in_country: '',                                //国家
        in_chart_type: this.$store.state.o_r_delivery.tableIsVisible ? 1:2,           //数据展现图表类型 ：0 查询渠道地区信息 1 表格 2 图例
        in_view_type: 1                                 //视图类型：1 渠道 2 时间 3 地区
      };
      // this._state.lastQueryParam[this.taging] = params;
      this.$store.dispatch("o_r_delivery/getReportInfo", { params, tag: this.$store.state.o_r_delivery.tableIsVisible?'channel':'legend' });
    },
    // 渠道改变，国家恢复默认
    channelValue(newValue, oldValue) {
      this.areaValue = ""
    }
  },
  methods: {
    
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '全部';
          return;
        }
        if (index === 1) {
          sums[index] = '全部';
          return;
        }

        const values = data.map(item => Number(item[column.property]));
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
        if (column.property == '注册率') {
          sums[index] = (sums[3] / sums[2] * 100).format(2) + '%';
        }
        if (column.property == '创角率') {
          sums[index] = (sums[4] / sums[2] * 100).format(2) + '%';
        }
      });
      sums[7] = (sums[10] / sums[2]).format(2);
      sums[8] = (sums[10] / sums[3]).format(2);
      sums[9] = (sums[10] / sums[4]).format(2);
      sums[12] = (sums[11] / sums[10]).format(2) + '%';
      sums[14] = (sums[14] / sums[2]).format(2) + '%';
      sums[15] = (sums[15] / sums[2]).format(2) + '%';
      sums[16] = (sums[16] / sums[2]).format(2) + '%';
      return sums;
    },
    back() {
      this.$data.$_curChannel = null
      this.$store.commit("o_r_delivery/set_is2", false);
    },
    formatter(row, column, value) {
      var {
        label
      } = column
      if (
        label === '注册率'
        || label === '创角率'
        || label === 'ROI'
      ) {
        // value += '%'
        value = +value ? value.format(2)+'%':value.format(0)+'%';

      }
      else if (
        label === '次日留存'
        || label === '3日留存'
        || label === '7日留存'
      ) {
        // value = (value / row[keys[index.activeIndex]] * 100).format(2) + '%';
        value = value.format(2) + '%';
      }else if(label === '激活成本'
        || label === '注册成本'
        || label === '创角成本'
        || label == 'LTV'
        || label == '充值'){
        value = +value ? value.format(2):value.format(0);

      }
      // if (this.$data.$_curChannel && label === keys[index.countryIndex]) {
      //   value = this.$store.state.overseas_common.regionMap[value] || value
      // }
      return value
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
        case '注册率':
          return retColor(this.$$channellist.mmas[label], row[label]);
          break;
        case '创角率':
          return retColor(this.$$channellist.mmas[label], row[label]);
          break;
        case '激活成本':
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
    createChart() {
      var chart = Highcharts.chart(this.$refs.chart, {
        chart: {
          type: 'line'
        },
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: this.$$legend.xList
        },
        yAxis: {
          title: {
            text: ''
          }
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
            events: {
              legendItemClick: function () {
                // return false 即可禁止图例点击响应
                return false;
              }
            }
          }
        },
        credits: {
          enabled: false　　　　　　//去除highcharts的链接
        },
        series:this.lineData[this.lineValue]
      });
      this.$data.$_chartIsReady = Math.random()
      this.chart = chart;
    },
    slide(width) {
      if (this.width == 0) {
        let timer = setInterval(() => {
          this.width -= 10;
          if (this.width == -width) {
            clearInterval(timer);
            this.isShow = !this.isShow
          }
        }, 10);
      } else if (this.width == -width) {
        let timer = setInterval(() => {
          this.width += 10;
          if (this.width == 0) {
            clearInterval(timer);
            this.isShow = !this.isShow
          }
        }, 10);
      }
    },
    changLeftList(index) {
      // true 添加 false 删除
      var series = this.chart.series[index];
      if (this.$$legend.leftlistArr[index].visible) {
        if ((!this.$$legend.leftlistArr[0].visible && index != 0)) {
          Utils.Notification.warning({
            message: '选择了总计，无法选中其他'
          })
          return
        } else if (index == 0 && this.$$legend.leftlistArr.filter(data => !data.visible && data.name != this.$$legend.leftlistArr.name).length) {
          Utils.Notification.warning({
            message: '选择了其他，无法选中总计'
          })
          return
        }
        if (series.visible) {
          series.hide();
        } else {
          series.show();
        }
        this.$$legend.leftlistArr[index].visible = !this.$$legend.leftlistArr[index].visible
        this.$$legend.rightListArr[index].visible = !this.$$legend.rightListArr[index].visible
      } else {
        if (series.visible) {
          series.hide();
        } else {
          series.show();
        }
        this.$$legend.leftlistArr[index].visible = !this.$$legend.leftlistArr[index].visible
        this.$$legend.rightListArr[index].visible = !this.$$legend.rightListArr[index].visible
      }
    },
    querySearch(queryString, cb) {
      var restaurants = this.$$legend.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      for (let index = 0; index < this.leftlistArr.length; index++) {
        var series = this.chart.series[index];
        if (this.leftlistArr[index].name == item.value) {
          if (this.leftlistArr[index].visible) {
            if ((!this.leftlistArr[0].visible && index != 0)) {
              Utils.Notification.warning({
                message: '选择了总计，无法选中其他'
              })
              return
            } else if (index == 0 && this.leftlistArr.filter(data => !data.visible && data.name != this.leftlistArr[0].name).length) {
              Utils.Notification.warning({
                message: '选择了其他，无法选中总计'
              })
              return
            }
            if (series.visible) {
              series.hide();
            } else {
              series.show();
            }
            this.leftlistArr[index].visible = !this.leftlistArr[index].visible
            this.rightListArr[index].visible = !this.rightListArr[index].visible
          } else {
            if (series.visible) {
              series.hide();
            } else {
              series.show();
            }
            this.leftlistArr[index].visible = !this.leftlistArr[index].visible
            this.rightListArr[index].visible = !this.rightListArr[index].visible
          }
        }
      }
    },
    filterData() {
      if (this.$store.state.o_r_delivery.tableIsVisible) {
        this.in_chart_type = 1
        console.log('修改表格数据', )
      } else {
        console.log('获取图例数据')
        this.in_chart_type = 2
      }
      var params = {
        in_begin_date: this._state.date[0], //开始日期
        in_end_date: this._state.date[1],   //结束日期
        in_os: this.$data.systemValue == 2 ? '0,1' : this.$data.systemValue, //系统                  
        in_area_app_ids: this._key,                          //游戏层级 
        in_media_source: this.$$getChannelInfo.channelName[+this.channelValue]['lable'] == '全部' ? '' :this.$$getChannelInfo.channelName[+this.channelValue]['lable'],   //渠道
        in_rpt_type: 4,                                      //报表类型 1 查询游戏层级  2 综合报表  3 每日报表  4 渠道(媒体)报表   5 系统对比
        in_country: this.$data.areaValue == "全部" ? '' : this.$data.areaValue,                     //国家
        in_chart_type: this.in_chart_type,                  //数据展现图表类型 ：0 查询渠道地区信息 1 表格 2 图例
        in_view_type: this.$data.viewValue                     //视图类型：1 渠道 2 时间 3 地区
      };
      this.$store.dispatch("o_r_delivery/getReportInfo", { params, tag: this.$store.state.o_r_delivery.tableIsVisible ? 'channel' :'legend'  });
    },
    filterReset(){
      // 恢复默认筛选条件
      this.viewValue = '1';
      this.systemValue = '2';
      this.channelValue = '';
      this.areaValue = '';
      this.lineValue = 0;
    }
  }
}; 
</script>

<style lang="scss">
.el-table .warning-row {
    background: oldlace;
  }

.el-table .success-row {
  background: #f0f9eb;
}
.row {
  display: flex;
  flex-direction: row;
  margin: 2px 13px;
  width: 100%;
  .channels {
    width: 94%;
  }
}
.has-gutter{
  font-weight: bold
}
.reports-market {
  .el-table__row {
    td.channel {
      padding: 0;
      //   .cell {
      //     cursor: pointer;
      //     line-height: 48px;
      //     &:hover {
      //       background: #5b5691;
      //       color: #fff;
      //     }
      //   }
    }
  }
}

.centerBox {
  width: 100%;
  min-height: 700px;
  // border: 1px solid red;
  .btns {
    display: flex;
    justify-content: flex-end;
    .os {
      width: 100px;
    }
    button {
      margin: 0 15px;
    }
  }
  .legendBox {
    .os {
      min-width: 150px;
    }
    .left {
      width: 15%;
      min-height: 450px;
      // border: 1px solid green;
      float: left;
      .leftList {
        width: 100%;
        max-height: 450px;
        overflow: auto;
        .list_ {
          width: 90%;
          min-height: 45px;
          margin: 5px 5%;
          background: #e7e1ea;
          span {
            width: 70%;
            min-height: 45px;
            text-align: center;
            display: inline-block;
            line-height: 45px;
            cursor: pointer;
          }
          i {
            font-size: 30px;
            color: gray;
            position: relative;
            top: 6px;
          }
        }
      }
    }
    .right {
      width: 85%;
      min-height: 300px;
      // border: 1px solid green;
      float: right;
      .chartBox {
        width: 98.2%;
        border: 15px solid rgba(208, 196, 214, 0.5);
        margin-top: 12px;
        margin-left: 12px;
        // display:flex;
        // justify-content: flex-start;
        // padding: 15px;
        .list_ {
          width: 150px;
          min-height: 45px;
          margin: 10px;
          background: #e7e1ea;
          display: inline-block;
          span {
            width: 70%;
            min-height: 45px;
            text-align: center;
            display: inline-block;
            line-height: 45px;
            cursor: pointer;
          }
          i {
            font-size: 30px;
            color: gray;
            position: relative;
            top: 6px;
          }
        }
      }
    }
  }

  .filterBox {
    width: 200px;
    height: 350px;
    position: absolute;
    top: 50px;
    right: 0;
    z-index: 9;
    border: 1px solid #c0c4cc;
    background: rgba(253, 253, 253, 0.8);
    button {
      width: 75px;
      margin-left: 15px;
      margin-top: 35px;
    }
    .filter_ {
      width: 100%;
      min-height: 60px;
      padding-top: 12px;
      text-align: center;
      border-bottom: 1px solid #c0c4cc;
      span {
        min-width: 35px;
        color: rgb(92, 91, 91);
        text-align: center;
        display: inline-block;
      }
      .os {
        width: 120px;
      }
    }
  }
}
</style>




