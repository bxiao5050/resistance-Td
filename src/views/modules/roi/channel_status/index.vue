<template>
  <div>
    <!-- 游戏菜单 -->
    <my-row>
      <section class="gameBox">
        <div class="title">游戏(单选):
          <el-button
            :class="isSlide?'el-icon-caret-top':'el-icon-caret-bottom'"
            style="padding:6px"
            @click="slide()"
          ></el-button>
        </div>
        <div class="gameList">
          <el-button
            :class="[gameActiveIndex==index?'active':'']"
            v-for="(item,index) in  $$gameList"
            :key="index"
            @click="changeGame(index)"
          >{{item.app_name}}</el-button>
        </div>
      </section>
    </my-row>
    <!-- 区服菜单 -->
    <my-row>
      <section class="zoneBox">
        <div class="title">区服(单选):</div>
        <el-button class="zoneName" @click="searchZone()">{{_state.zoneName}}</el-button>
      </section>
    </my-row>
    <zone-box v-show="$store.state.o_r_channel_status.visibleZone"></zone-box>
     <!-- 日期 -->
    <my-row>
      <section class="timeBox">
        <div class="title">选择时间:</div>
        <section >
          <el-date-picker v-model="date" type="date" placeholder="选择日期"></el-date-picker>
        </section>
        <el-button class="el-icon-refresh" @click="getData()" style="margin-left:15px">查询</el-button>
        <el-button class="el-icon-download" @click="exportData()">导出</el-button>
      </section>
    </my-row>
    <p style="color:red;text-indent: 120px;">1、假期期间的ROI数据可在假期后的第二个工作日正常查看 2、选择时间为北京时间（东八区）</p>
    <!-- 表格 -->
    <div class="table-item ">
      <el-table
        border
        max-height="850"
        :header-cell-style="{background:'#f2f2f2',textAlign:'left'}"
        :data="$store.getters['o_r_channel_status/getChannel']"
      >
        <el-table-column
          v-for="(item, i) in (Object.keys($store.getters['o_r_channel_status/getChannel'][0]?$store.getters['o_r_channel_status/getChannel'][0]:{}))"
          :key="i"
          sortable
          :prop="item"
          :label="item"
          :formatter="formatter"
          :width="i==0 ? 400:(i==9?130:'')"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import zoneBox from './zoneBox.vue'
export default {
  data() {
    return {
      date: null,
      isSlide: true,
      in_query_type:3,
      gameActiveIndex: 0,
    }
  },
  components: {
    zoneBox
  },
  watch: {
    date(data) {
      this.$store.commit("o_r_channel_status/setDate", moment(data).add(0, "day").format("YYYY-MM-DD"));
    },
  },
  created() {
    this.dataInit()
    //获取游戏菜单
    if (!this._state.gameList) {
      this.$store.dispatch("o_r_channel_status/getGame").then(data => {
        // 游戏列表获取成功,设置store里面的游戏id
        this.$store.dispatch("o_r_channel_status/getZone").then(data => {
          // 获取table数据
          if (!this._state.channel) this.getData();
        })

      })
    }
  },
  computed: {
    _state() {
      return this.$store.state.o_r_channel_status;
    },
    $$gameList() {
      return this.$store.getters["o_r_channel_status/getGameList"];
    },
    $$zoneList() {
      return this.$store.getters["o_r_channel_status/getZoneList"];
    },
  },
  methods: {
    slide() {
      this.isSlide = !this.isSlide
      if (parseInt($('.gameList').css('height')) > 50) {
        $(".gameList").animate({ height: "50px" });
      } else {
        $(".gameList").animate({ height: "200px" });
      }
    },
    formatter(row, column, value) {
      var { label } = column
      if (label == "日收入" || label == "总收入") {
        value = +value ? value.format(2) : value.format(0);
      }
      return value
    },
    // 初始化
    dataInit() {
      if (this._state.date) {
        this.date = this._state.date;
      } else {
        this.date = moment().add(-1, "day").format("YYYY-MM-DD")
      }
      if (this._state.gameActiveIndex) {
        this.gameActiveIndex = this._state.gameActiveIndex
      } else {
        this.gameActiveIndex = 0
      }
    },
    // 切换游戏
    changeGame(index) {
      this.gameActiveIndex = index;
      this.$store.commit('o_r_channel_status/setGameActiveIndex', this.gameActiveIndex)
      this.$store.commit('o_r_channel_status/setAreaActiveIndex', 0)
      this.$store.commit('o_r_channel_status/setChannelActiveIndex', -1)
      this.$store.commit('o_r_channel_status/setZoneActivityIndex', -1)
      this.$store.commit('o_r_channel_status/setZoneID', ' ')
      this.$store.commit("o_r_channel_status/setGameID", this.$$gameList[this.gameActiveIndex].app_id)
      // 游戏列表获取成功,设置store里面的游戏id
      this.$store.dispatch("o_r_channel_status/getZone").then(data => {
        // 区服列表获取成功
        this.getData();
      })
    },
    //查询数据
    getData() {
      var params = {
        in_count_date:this._state.date,          //查询时间
        in_app_id:this._state.gameID,            //游戏ID
        in_gamezone_id:this._state.zoneID,       //区服ID
        in_query_type:this.in_query_type,
      }
      this.$store.dispatch("o_r_channel_status/getReportInfo", { params, tag: 'channel' })
    },
    // 导出表格
    exportData() {
      var timestamp = Date.now()
      var thead = document.querySelector('.el-table__header thead').innerHTML
      var tbody = document.querySelector('.el-table__body tbody').innerHTML
      var table = document.createElement('table')
      table.innerHTML = `<thead>${thead}</thead><tbody>${tbody}</tbody>`
      Utils.tableToExcel(
        table,
        false,
        timestamp + '.xls'
      )
    },
    //显示区服选择框
    searchZone() {
      this.$store.commit("o_r_channel_status/setVisibleZone", true)
    },
  }
}
</script>
<style lang="scss" scoped>
.gameBox,
.zoneBox {
  margin-left: 20px;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  .title {
    height: 40px;
    line-height: 40px;
    min-width: 100px;
    display: inline-block;
  }
  .gameList {
    height: 200px;
    overflow: auto;
    button {
      height: 35px;
      padding-top: 10px;
      padding-bottom: 10px;
      min-width: 170px;
      margin: 5px;
    }
  }
  .active {
    color: white;
    background: #5b5691;
  }
  .zoneName {
    min-width: 170px;
    color: white;
    background: #5b5691;
  }
}
.timeBox {
  height: 40px;
  margin: 12px 0px;
  margin-left: 20px;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  .title {
    height: 40px;
    line-height: 40px;
    min-width: 100px;
    display: inline-block;
  }
}

.table-item {
  margin: 20px 10px;
  border: 15px solid #e7e1ea;
}
</style>

