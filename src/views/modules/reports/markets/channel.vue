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
        <!-- 表格/图例 -->
        <el-select class="view" v-model="value" size="medium">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button style="marginRight:15px" size="medium" @click="slide(300)">筛选</el-button>
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
      <section class="filterBox" :style="{width:'300px',right:`${width}px`}">
        <!-- 视图 -->
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
        <!-- 系统 -->
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
        <!-- 渠道 -->
        <div class="filter_">
          <span>{{filterTitle[2].name}}</span>
          <el-select class="os" 
          filterable 
          multiple 
          collapse-tags
          v-model="channelValue" size="medium"
           @change="channelSelectAll"
           :filter-method="channelFilter">
            <el-option
              v-for="item in channelOptions"
              :key="item.value"
              :label="item.lable"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <!-- 地区 -->
         <div class="filter_">
          <span>{{filterTitle[3].name}}</span>
          <el-select class="os" 
          filterable 
          collapse-tags
          multiple 
          @change="areaSelectAll"
          v-model="areaValue" size="medium"
           :filter-method="areaFilter">
            <el-option
              v-for="item in areaOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="filter_">
          <el-button type="danger" plain @click="filterReset()">重置</el-button>
          <el-button type="success" plain @click="filterData()">应用</el-button>
        </div>
      </section>
      <!-- 表格 -->
      <div v-show="$store.state.o_r_delivery.tableIsVisible" class="table-item">
        <!-- 标题 -->
         <div style="marginBottom:15px">
          <span>{{filterTitle[4].name}}</span>
          <el-select
          filterable 
          collapse-tags
          multiple 
          @change="titleSelectAll"
          v-model="titleValue" size="medium"
           :filter-method="titleFilter">
            <el-option
              v-for="(item,i) in titleOptions"
              :key="i"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </div>
        <el-table
          :data="$store.getters['o_r_delivery/getAllChannel']"
          :cell-style="addStyle"
          :summary-method="getSummaries"
          show-summary
        >
          <el-table-column
            v-for="(item, i) in (Object.keys($store.getters['o_r_delivery/getAllChannel']?$store.getters['o_r_delivery/getAllChannel'][0]:[]))"
            :key="i"
            v-if='show[i].label'
            :prop="item"
            :label="item"
            :formatter="formatter"
            :fixed="i<=2?true:false"
            :width="getWidth(item)"
            :sortable="i!=1?(i==0?(isSort?true:false):true):false"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
// import totalFloat from "./total-float";
import http from 'src/services/http';
import { log } from 'util';
export default {
  props: ['data', '_config', '_types'],
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
      width: -300,
      viewValue: '1',     //视图下标
      isSort:false,
      systemValue: '2',   //系统下标
      lineValue: 0,       //
      channelValue: [],   //渠道下标
      areaValue: [],      //地区下标
      titleValue: [],     //标题下标
      chart: null,
      restaurants: [ ],
      rightListArr: [],
      leftlistArr: [],
      channelOptions:[],
      channelOptionsCopy:[],
      channelOldOptions: [[]],
      areaOptions:[],
      areaOptionsCopy:[],
      areaOldOptions:[[]],
      titleOptions:[],
      titleOptionsCopy:[],
      titleOldOptions:[[]],
      lineArr: [],
      options: [{ value: "table", label: "表格" }, { value: "legend", label: "图例" },],
      filterTitle: [
      { name: '视图', value: '1', options: [{ value: '1', label: '渠道' }, { value: '2', label: '时间' }, { value: '3', label: '地区' }] },
      { name: "系统", value: '2', options: [{ value: '2', label: '全部' }, { value: '0', label: 'IOS' }, { value: '1', label: 'android' },] },
      { name: "渠道", value: 'qb', options: [{ value: 'qb', label: '全部' }] },
      { name: "地区", value: 'qb', options: [{ value: 'qb', label: '全部' }] },
      { name: "标题", value: 'qb', options: [{ value: 'qb', label: '全部' }] },
      
      ],
      lineData: [],
      areaArr: [{ media_source: 'qb', country_name: '全部' }],
      show:[],
    };
  },
  computed: {
    $$tableSort(){
      return this.$store.getters['o_r_delivery/getAllChannel'];
    },
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
  created(){
    this.dataInit()
    this.$store.state.o_r_delivery.tableIsVisible = true;
    this.value = 'table';
    for(let i = 0;i<22;i++){
        var item = { label: true };
        this.show.push(item);
      }
  },
  watch:{
    $$tableSort(newValue,oldValue){
      if(+this.viewValue == 2){
        this.isSort = true;
      }else{
        this.isSort = false;
      }
    },
    $$getChannelInfo(newValue,oldValue){
      // this.channelOptions = newValue.channelName;
      // this.channelOptionsCopy = newValue.channelName;
      this.channel_init()   
      this.title_init()
    },
    channels(channels) {
      this.$store.commit("o_r_delivery/set_channels", channels);
    },
    //切换linevalue 恢复默认显示
    lineValue(newValue, oldValue) {
      localStorage.setItem("lineValue",newValue)
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
      this.slide(0)
      this.$store.state.o_r_delivery.tableIsVisible = !this.$store.state.o_r_delivery.tableIsVisible;
      if (this.$store.state.o_r_delivery.tableIsVisible ) {
        this.filterTitle[0] = { name: '视图', value: '1', options: [{ value: '1', label: '渠道' }, { value: '2', label: '时间' }, { value: '3', label: '地区' }] }
      }else{
        this.filterTitle[0] = { name: '视图', value: '1', options: [{ value: '1', label: '渠道' }, { value: '3', label: '地区' }] }
      }
      // 恢复默认筛选条件
      this.viewValue = '1';
      this.systemValue = '2';
      this.channel_init()   
      this.title_init()
      // this.areaValue = [];
      this.lineValue = 0;
      var params = {
        in_install_date1: this._state.date[0],          //激活开始日期
        in_install_date2: this._state.date[1],          //激活结束日期
        in_pay_date1:this._state.payDate[0],            //充值开始时间
        in_pay_date2:this._state.payDate[1],            //充值结束时间
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
        // this.areaValue = []
        this.area_init(newValue)       
    },
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      var activeData = []; 
      var constData = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '全部';
          return;
        }
        if (index === 1) {
          sums[index] = '全部';
          return;
        }
        var values = data.map((item) => Number(item[column.property]));
        if (index === 2) {
          activeData = values
        }

        if(index > 13){
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
        if (column.property == '注册率') {
          sums[index] = (sums[3] / sums[2] * 100).format(2) + '%';
        }
        if (column.property == '创角率') {
          sums[index] = (sums[4] / sums[2] * 100).format(2) + '%';
        }
      });
      sums[7] = (sums[10] / sums[2]).format(2); //激活成本
      sums[8] = (sums[10] / sums[3]).format(2); //注册成本
      sums[9] = (sums[10] / sums[4]).format(2); //创角成本
      sums[12] = ((sums[11] / sums[10])*100).format(2) + '%'; //ROI
      sums[14] = ((sums[13] / sums[10])*100).format(2) + '%'; //分成ROI
      sums[15] = ((sums[15] / sums[2])).format(2); //7日LTV
      sums[16] = ((sums[16] / sums[2])).format(2); //14日LTV
      sums[17] = ((sums[17] / sums[2])).format(2); //30日LTV
      sums[18] = ((sums[18] / sums[2])).format(2) + '%';
      sums[19] = ((sums[19] / sums[2])).format(2) + '%';
      sums[20] = ((sums[20] / sums[2])).format(2) + '%';
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
        colors: ['#7cb5ec', '#C106EB', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'], 
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
          categories:  this.$$legend.xList,
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
            // format: '{value:.0f}'//设置y轴显示格式
             formatter: function (index) {
                var indexArr = [3,4,10,11,15,16,17] 
                if (indexArr.includes(+localStorage.getItem("lineValue"))) {
                  return this.value + '%';//y轴加上%
                }else{
                  return this.value
                }
              }
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
      if (width == 0) {
        this.width = -300
        this.isShow = !this.isShow
        return 
      }
      if (this.width == 0) {
        let timer = setInterval(() => {
          this.width -= 20;
          if (this.width == -width) {
            clearInterval(timer);
            this.isShow = !this.isShow
          }
        }, 10);
      } else if (this.width == -width) {
        let timer = setInterval(() => {
          this.width += 20;
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
        this.$store.commit("o_r_delivery/set_filterTitleDataValue",this.titleValue);
        this.in_chart_type = 1
        console.log('修改表格数据', )
         // 视图
        this.$store.commit("o_r_delivery/setViewIndex", this.viewValue);
        this.$store.commit("o_r_delivery/setSystemIndex", this.systemValue);
        this.$store.commit("o_r_delivery/setChannelIndex", this.channelValue);
        this.$store.commit("o_r_delivery/setAreaIndex", this.areaValue);
      } else {
        console.log('获取图例数据')
        this.in_chart_type = 2
      }
      var params = {
        in_install_date1: this._state.date[0],          //激活开始日期
        in_install_date2: this._state.date[1],          //激活结束日期
        in_pay_date1:this._state.payDate[0],            //充值开始时间
        in_pay_date2:this._state.payDate[1],            //充值结束时间
        in_os: this.$data.systemValue == 2 ? '0,1' : this.$data.systemValue, //系统                  
        in_area_app_ids: this._key,                          //游戏层级 
        in_country: this.areaValue.includes("all") ? '' : this.areaValue.join(','),                     //国家
        in_media_source: this.getChannelData(),   //渠道
        in_rpt_type: 4,                                      //报表类型 1 查询游戏层级  2 综合报表  3 每日报表  4 渠道(媒体)报表   5 系统对比
        in_chart_type: this.in_chart_type,                  //数据展现图表类型 ：0 查询渠道地区信息 1 表格 2 图例
        in_view_type: this.$data.viewValue                     //视图类型：1 渠道 2 时间 3 地区
      };
      this.$store.dispatch("o_r_delivery/getReportInfo", { params, tag: this.$store.state.o_r_delivery.tableIsVisible ? 'channel' :'legend'  });
    },
    filterReset(){
      // 恢复默认筛选条件
      this.viewValue = '1';
      this.systemValue = '2';
      this.channel_init();
      this.title_init()
      this.lineValue = 0;
    },
    // 筛选条件初始化
    dataInit(){
      localStorage.setItem("lineValue",0)
      if (this._state.viewIndex) {this.viewValue = this._state.viewIndex}else{this.viewValue = '1'}
      if (this._state.systemIndex) {this.systemValue = this._state.systemIndex}else{this.systemValue = '2'}
      this.channel_init()
      this.title_init()
    },
    getWidth(str) {
      var len = str ? str.length:0;
      if (len <= 2) {
        return 80
      }
      if (len <= 3) {
        return 90
      }
      if (len <= 4) {
        return 100
      }
      if (len <= 6) {
        return 110
      }
      if (len <= 9) {
        return 120
      }
    },
    // 渠道全选
    channelSelectAll(val) {
      let allValues = []
      //保留所有值
      for (let item of this.channelOptions) {
        allValues.push(item.value)
      }
      // 用来储存上一次的值，可以进行对比
      const oldVal = this.channelOldOptions.length === 1 ? [] : this.channelOldOptions[1]
      
      // 若是全部选择
      if ( val.includes('all')) {
        if (this.channelOptionsCopy.length != allValues.length) {
          allValues.shift()
        }
        this.channelValue = allValues
      }
      // 取消全部选中  上次有 当前没有 表示取消全选
      if (oldVal.includes('all') && !val.includes('all')) this.channelValue = []

      // 点击非全部选中  需要排除全部选中 以及 当前点击的选项 
      // 新老数据都有全部选中 
      if (oldVal.includes('all') && val.includes('all')) {
        const index = val.indexOf('all')
        val.splice(index, 1) // 排除全选选项
        this.channelValue = val
      }

      //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes('all') && !val.includes('all')) {
        if (val.length === allValues.length - 1) this.channelValue = ['all'].concat(val)
      }

      //储存当前最后的结果 作为下次的老数据 
      this.channelOldOptions[1] = this.channelValue
    },
    // 地区全选
    areaSelectAll(val) {
      let allValues = []
      //保留所有值
      for (let item of this.areaOptions) {
        allValues.push(item.value)
      }
      // 用来储存上一次的值，可以进行对比
      const oldVal = this.areaOldOptions.length === 1 ? [] : this.areaOldOptions[1]
      
      // 若是全部选择
      if ( val.includes('all')) {
        if (this.areaOptionsCopy.length != allValues.length) {
          allValues.shift()
        }
        this.areaValue = allValues
      }

      // 取消全部选中  上次有 当前没有 表示取消全选
      if (oldVal.includes('all') && !val.includes('all')) this.areaValue = []

      // 点击非全部选中  需要排除全部选中 以及 当前点击的选项 
      // 新老数据都有全部选中 
      if (oldVal.includes('all') && val.includes('all')) {
        const index = val.indexOf('all')
        val.splice(index, 1) // 排除全选选项
        this.areaValue = val
      }

      //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes('all') && !val.includes('all')) {
        if (val.length === allValues.length - 1) this.areaValue = ['all'].concat(val)
      }

      //储存当前最后的结果 作为下次的老数据 
      this.areaOldOptions[1] = this.areaValue
    },
    // 标题全选
    titleSelectAll(val){
      let allValues = []
      //保留所有值
      for (let item of this.titleOptions) {
        allValues.push(item.name)
      }
      // 用来储存上一次的值，可以进行对比
      const oldVal = this.titleOldOptions.length === 1 ? [] : this.titleOldOptions[1]
      
      // 若是全部选择
      if ( val.includes('全部')) {
        if (this.titleOptionsCopy.length != allValues.length) {
          allValues.shift()
        }
        this.titleValue = allValues
      }

      // 取消全部选中  上次有 当前没有 表示取消全选
      if (oldVal.includes('全部') && !val.includes('全部')) this.titleValue = []

      // 点击非全部选中  需要排除全部选中 以及 当前点击的选项 
      // 新老数据都有全部选中 
      if (oldVal.includes('全部') && val.includes('全部')) {
        const index = val.indexOf('全部')
        val.splice(index, 1) // 排除全选选项
        this.titleValue = val
      }
      //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes('全部') && !val.includes('全部')) {
        if (val.length === allValues.length - 1) this.titleValue = ['全部'].concat(val)
      }
      //储存当前最后的结果 作为下次的老数据 
      for (let msg = 0; msg < this._state.filterTitleData.length; msg++) {
       if (this.titleValue.includes(this._state.filterTitleData[msg].name)) {
         if (this._state.filterTitleData[msg].index != -1){
           this.show[this._state.filterTitleData[msg].index].label = true;
         }
       }else{
         if (this._state.filterTitleData[msg].index != -1){
           this.show[this._state.filterTitleData[msg].index].label = false;
         }
       }
       
      }
      this.titleOldOptions[1] = this.titleValue
    },
    // 渠道多选
    channelFilter (val) {
      if (val) { //val存在
          var number = 0;
          this.channelOptions.filter((item) => {
            if (!!~item.lable.indexOf(val) || !!~item.lable.toUpperCase().indexOf(val.toUpperCase())) {
              number++
            }
          })
          if (number > 1) {
            this.channelOptions = this.channelOptions.filter((item) => {
              if ((item.value == "all")|| !!~item.lable.indexOf(val) || !!~item.lable.toUpperCase().indexOf(val.toUpperCase())) {
                return true
              }
            })
          }else if(number == 1){
            this.channelOptions = this.channelOptions.filter((item) => {
              if (!!~item.lable.indexOf(val) || !!~item.lable.toUpperCase().indexOf(val.toUpperCase())) {
                return true
              }
            })
          }else{
             this.channelOptions = []
          }
          
        } else { //val为空时，还原数组
          this.channelOptions = this.channelOptionsCopy;
        }
    },
    // 地区多选
    areaFilter (val) {
      if (val) { //val存在
          var number = 0;
          this.areaOptions.filter((item) => {
            if (!!~item.label.indexOf(val) || !!~item.label.toUpperCase().indexOf(val.toUpperCase())) {
              number++
            }
          })
          if (number==1) {
            this.areaOptions = this.areaOptions.filter((item) => {
              if (!!~item.label.indexOf(val) || !!~item.label.toUpperCase().indexOf(val.toUpperCase())) {
                return true
              }
            })
          }else if(number>1){
            this.areaOptions = this.areaOptions.filter((item) => {
              if ((item.value == "all")|| !!~item.label.indexOf(val) || !!~item.label.toUpperCase().indexOf(val.toUpperCase())) {
                return true
              }
            })
          
          }else{
            this.areaOptions = []
          }
         
        } else { //val为空时，还原数组
          this.areaOptions = this.areaOptionsCopy;
        }
    },
    // 标题多选
    titleFilter(val){
      if (val) { //val存在
          console.log('titleFilter', val)
          var number = 0;
          this.titleOptions.filter((item) => {
            if (!!~item.label.indexOf(val) || !!~item.label.toUpperCase().indexOf(val.toUpperCase())) {
              number++
            }
          })
          if (number==1) {
            this.titleOptions = this.titleOptions.filter((item) => {
              if (!!~item.label.indexOf(val) || !!~item.label.toUpperCase().indexOf(val.toUpperCase())) {
                return true
              }
            })
          }else if(number>1){
            this.titleOptions = this.titleOptions.filter((item) => {
              if ((item.value == "all")|| !!~item.label.indexOf(val) || !!~item.label.toUpperCase().indexOf(val.toUpperCase())) {
                return true
              }
            })
          
          }else{
            this.titleOptions = []
          }
         
        } else { //val为空时，还原数组
          this.titleOptions = this.areaOptionsCopy;
        }
      
    },
    getChannelData(){
      var data = "";
      var all = "";
      if (this.channelValue.includes("all")) {
        return all 
      }else{
        for (let index = 0; index < this.channelValue.length; index++) {
          data += this.$$getChannelInfo.channelName[this.channelValue[index]].lable+','
        }
        return data
      }
    },
    // 渠道初始化
    channel_init(){
      let channelAllValues = []
      if (this._state.channelSelectData.channelName) {
        this.channelOptions = this._state.channelSelectData.channelName;
        this.channelOptionsCopy = this._state.channelSelectData.channelName; 
        for (let item of this._state.channelSelectData.channelName) {
          channelAllValues.push(item.value)
        }
          this.channelValue = channelAllValues
      }else{
        for (let item of this.channelOptions) {
          channelAllValues.push(item.value)
        }
          this.channelValue = channelAllValues
      }
    },
    // 地区初始化
    area_init(newValue){
      if(newValue.length == 0){
            this.areaValue = [];
            return
        } 
        for (let index = 0; index < newValue.length; index++) {
         if (newValue.includes("all")) {
            console.log("渠道包含全部")
            // 地区
            let arr = [];
            let flag = []
            for (let index = 0; index < this.$$getChannelInfo.channelNameData[0].length; index++) {
              if (!arr.includes(this.$$getChannelInfo.channelNameData[0][index].value)) {
                arr.push(this.$$getChannelInfo.channelNameData[0][index].value)
                flag.push(this.$$getChannelInfo.channelNameData[0][index])
              }else{
                // console.log(">>>>>>>>>>>>>>>>",index);
              }
              
            }
            this.areaOptions = flag;
            this.areaOptionsCopy = flag;   
            this.areaValue = arr;
            return
        }else{
          console.log("渠道不包含全部")
          // 地区
          let allArr = [];
          let arr = [];
          let flag = []
          // 合并索索结果
          for (let index = 0; index < newValue.length; index++) {
            allArr = allArr.concat(this.$$getChannelInfo.channelNameData[newValue[index]]);
          }
          // 对结果去重
          for (let index = 0; index < allArr.length; index++) {
            if (!arr.includes(allArr[index].value)) {
              arr.push(allArr[index].value)
              flag.push(allArr[index])
            }
          }
          this.areaOptions = flag;
          this.areaOptionsCopy = flag; 
          this.areaValue = arr;
          
        }        
      }
    },
    // 标题初始化
    title_init(){
      this.titleOptions = this._state.filterTitleData;
      this.titleOptionsCopy = this._state.filterTitleData;
      this.titleValue = this._state.filterTitleDataValue;
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
    }
  }
}

.centerBox {
  width: 100%;
  min-height: 700px;
  .btns {
    display: flex;
    justify-content: flex-end;
    .view {
      width: 100px;
      margin:0 15px;
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
          width: 210px;
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
    width: 300px;
    height: auto;
    position: absolute;
    top: 50px;
    right: 0;
    z-index: 9;
    border: 1px solid #c0c4cc;
    background: white;
    button {
      width: 75px;
      // position: absolute;
      // left: 58px;
      // top: 20px;
    }
    button:nth-child(2){
      left: 160px;
      top: 20px;
    }
    .filter_ {
      width: 100%;
      min-height: auto;
      padding-bottom: 12px;
      padding-top: 12px;
      text-align: center;
      border-bottom: 1px solid #c0c4cc;
      position: relative;
      span {
        min-width: 35px;
        color: rgb(92, 91, 91);
        text-align: center;
        display: inline-block;
      }
      .os {
        width: 200px;
      }
    }
    .filter_:nth-child(5){
      min-height: 80px;
      // border-bottom: 1px solid red;
    }
  }
}
</style>




