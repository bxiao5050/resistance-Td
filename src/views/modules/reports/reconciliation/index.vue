<template>
  <div class="daiding">
    <!-- 对账报表查询条件 -->
    <my-row class="selection-box">
      <div class="banner">
        <!-- 日期 -->
        <div class="date-box-item">
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

        <!-- 渠道 -->
        <section style="margin-left:20px">
          <el-select v-model="channelListValue" filterable  style="width: 200px; height:40px">
            <el-option
              v-for="(item) in $$ChannelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </section>
        <!-- 查詢 -->
        <el-button
          size="medium"
          class="search"
          @click="getData('reconciliation')"
          style="margin-left:20px"
        >查询</el-button>
      </div>
    </my-row>
    <!-- 表格 -->
    <div class="table-item">
      <el-table
        border
        :header-cell-style="{background:'#f2f2f2'}"
        :data="$store.getters['o_r_reconciliation/getTableData']"
      >
        <el-table-column
          v-for="(item, i) in (Object.keys($store.getters['o_r_reconciliation/getTableData'].length?$store.getters['o_r_reconciliation/getTableData'][0]:[]))"
          :key="i"
          :prop="item"
          :label="item"
          :width="i==0 ? 115:''"
          v-if="i!=0"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {

  data() {
    return {
      date: null,
      input:'',
      source: '',
      $_chartIsReady: 0,
      channelListValue:'',
      visibleChannelSelect:false,
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
    }
  },
  watch: {
    date(data) {
      var date = data.map(item => moment(item).format("YYYY-MM-DD"));
      this.$store.commit("o_r_reconciliation/setDate", date);
    },
    channelListValue(newValue, oldValue) {
      this.$store.commit("o_r_reconciliation/setChannelListValue", newValue);
    }
  },
  computed: {
    $$ChannelList() {
      return this.$store.getters["o_r_reconciliation/getChannelList"];
    },
    _state() {
      return this.$store.state.o_r_reconciliation;
    },

  },
  created() {
    this.dataInit()
    // 获取渠道列表,
    if (!this._state.channelList.length) this.getData('channelList');
  },
  mounted() {
    this.$refs.picker1.mountPicker();
    this.$refs.picker1.picker.dateShortcuts = this.dateShortcuts
    this.$refs.picker1.picker._parentEl = this.$refs.picker1.$el;
  },
  methods: {
    // 获取数据
    getData(tag) {
      if (tag == 'channelList') {
        // 获取渠道
        var params = {
          in_begin_date: '2019-01-01',   //开始日期
          in_end_date: '2019-01-02',    //结束日期
          in_media_source: '',          //渠道                  
          in_operator_type: 1,          //查询类型(1:渠道列表,2:数据) 
        };
      } else {
        // 获取数据
        if (!this.date.length || this.channelListValue == '') {
          Utils.Notification.warning({
            message: '请将查询信息填写完整'
          })
          return
        }
        var params = {
          in_begin_date: this._state.date[0],       //开始日期
          in_end_date: this._state.date[1],         //结束日期
          in_media_source: this.$$ChannelList[this.channelListValue - 1].label,             //渠道                  
          in_operator_type: 2,                      //查询类型(1:渠道列表,2:数据)  
        };
      }
      this.$store.dispatch("o_r_reconciliation/getReportInfo", { params, tag: tag })
    },
    //日期
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
      // 日期初始化
      if (this._state.date) {
        this.date = this._state.date;
      } else {
        this.date = [
          moment()
            .add(-1, "day")
            .format("YYYY-MM-DD"),
          moment()
            .add(-1, "day")
            .format("YYYY-MM-DD")
        ];
      }
      // 渠道下拉框初始化
      if (this._state.channelListValue) {
        this.channelListValue = this._state.channelListValue;
      } else {
        this.channelListValue = '';
      }
    },

  },


}
</script>

<style lang="scss" scoped>
.banner {
  width: 100%;
  display: flex;
  justify-content: start;
  position: relative;
  // border: 1px solid;
}

.table-item {
  border: 15px solid #e7e1ea;
  width: 600px;
  height: auto;
  margin: 20px;
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
// 激活表
</style>


