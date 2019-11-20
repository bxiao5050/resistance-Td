<template>
  <div>
     <!-- 表格 -->
      <div class="table-item">
        <el-table
          :data="_state.comprehensive"
          :cell-style="addStyle"
          :summary-method="getSummaries"
          show-summary
          style="width: 100%">
          <el-table-column  
            v-for="(item, i) in (Object.keys((_state.comprehensive && _state.comprehensive.length)?_state.comprehensive[0]:[]))"
            :key="i" 
            :prop="item"
            :label="item"
            :formatter="formatter"
            :fixed="i<=2?true:false"
            :width="getWidth(item)"
            :sortable="i>1?true:false"
            >
          </el-table-column>
        </el-table>
      </div>
  </div>
</template>

<script>
export default {
  props: ['_config'],
  data() {
    return {
      $_order: 'descending'
    }
  },

  computed: {
    _state() {
      return this.$store.state.h5_delivery_report;
    },
    // 筛选条件
    $$channellist() {
      var allData = this.$store.getters["h5_delivery_report/getComprehensiveList"];
      return allData
    },
  },
  methods: {
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
        || label == '充值'
        || label == '分成充值'){
        value = +value ? value.format(2):value.format(0);

      }
      return value
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
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      var activeData = []; 
      var constData = [];
      columns.forEach((column, index) => {
        var LTVINDEX = 11;//ltv下标
        var REGISTERINDEX = 2; //注册下标
        if (index === 0) {
          sums[index] = '全部';
          return;
        }
        if (index === 1) {
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
        //   sums[index] = (sums[2] / sums[2] * 100).format(2) + '%';
        // }
        if (column.property == '创角率') {
          sums[index] = (sums[3] / sums[2] * 100).format(2) + '%';
          
        }
      });
      sums[7] = (+sums[7]).format(2); //花费
      sums[8] = (+sums[8]).format(2); //充值
      sums[9] = ((sums[8] / sums[7])*100).format(2)+'%'; //ROI(充值/花费)
      sums[10] = (+sums[10]).format(2); //分成充值
      sums[11] = ((sums[10] / sums[7])*100).format(2)+'%'; //分成ROI(分成充值/花费)
      sums[12] = ((sums[12] / sums[2])).format(2); //7日LTV
      sums[13] = ((sums[13] / sums[2])).format(2); //14日LTV
      sums[14] = ((sums[14] / sums[2])).format(2); //30日LTV
      sums[15] = ((sums[15] / sums[2])).format(2)+'%'; //次日留存
      sums[16] = ((sums[16] / sums[2])).format(2)+'%'; //3日留存
      sums[17] = ((sums[17] / sums[2])).format(2)+'%'; //7日留存
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
  }
}
</script>

<style lang="scss">
.reports-market {
  .chart-area,
  .table-item {
    background: rgba(208, 196, 214, 0.5);
    margin: 12px;
    padding: 15px;
  }
}
.el-table {
  tr:first-child {
    th {
      .region {
        font-family: "黑体";
        color: #5b5691;
        font-size: 16px;
      }
    }
  }
}
</style>



