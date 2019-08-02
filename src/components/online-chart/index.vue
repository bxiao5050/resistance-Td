<template>
  <section>
    <!-- <p>{{datetype}}</p> -->
    <el-radio-group v-model="chareType">
      <el-radio-button label="图表"></el-radio-button>
      <el-radio-button label="表格"></el-radio-button>
    </el-radio-group>
    <div class="chart-area" ref="chart" v-show="chareType=='图表'"></div>
    <div class="table-area" v-show="chareType=='表格'">
      <el-table :data="datetype.item.tableData"  height="400" style="width: 80%;margin: auto;">
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="data" :label="title[datetype.index]" width="180"></el-table-column>
      </el-table>
    </div>
  </section>
</template>
<script>
export default {
  name: 'inline-chart',
  props: ['chartId', 'datas', 'datetype'],
  data() {
    return {
      chareType: '图表',
      title: ["创角", "充值", "活跃"],
    }
  },
  watch: {

  },
  methods: {
    drawChart: function () {
      let categories = []
      let seriesData = [{
        data: this.data,
        pointStart: 1,
        color: 'skyblue'
      }]
      highchartUtil.drawSparkChart(this.chartId, seriesData)
    },
    createChart() {
      var chart = Highcharts.chart(this.$refs.chart, {
        title: {
          text: "当日" + this.title[this.datetype.index] + ' : ' + this.datetype.item.value
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: this.datetype.item.xAxis
        },
        yAxis: {
          title: {
            text: ''
          }
        },
        credits: {
          enabled: false　　　　　　//去除highcharts的链接
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
        },
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            },
            // pointStart: 2010
          }
        },
        series: [{
          name: this.title[this.datetype.index],
          data: this.datetype.item.list
        }],
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
      });
    }

  },
  mounted() {
    this.createChart(this.title[this.datetype])
  },
  watch: {
    data: {
      deep: true,
      handler: function (v, ov) {
        if (v != ov) {
          // this.drawChart()
          this.createChart(this.title[this.datetype])
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.table-area {
  width: auto;
  height: auto;
}
</style>
