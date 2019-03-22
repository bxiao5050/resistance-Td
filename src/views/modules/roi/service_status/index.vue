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
    <!-- 日期 -->
    <my-row>
      <section class="timeBox">
        <div class="title">选择时间:</div>
        <!-- 日期 -->
        <section>
          <el-date-picker v-model="date" type="date" placeholder="选择日期"></el-date-picker>
        </section>
        <el-button class="el-icon-refresh" @click="getData()" style="margin-left:15px">查询</el-button>
        <el-button class="el-icon-download" @click="exportData()">导出</el-button>
      </section>
    </my-row>
    <p style="color:red;text-indent: 120px;">1、假期期间的ROI数据可在假期后的第二个工作日正常查看 2、选择时间为北京时间（东八区）</p>
    <!-- 表格 -->
    <div class="table-item money">
      <el-table
        border
        align="left"
        :header-cell-style="{background:'#f2f2f2'}"
        :data="$store.getters['o_r_service_status/getService'].data"
      >
        <el-table-column
          v-for="(item, i) in (Object.keys($store.getters['o_r_service_status/getService'].data?$store.getters['o_r_service_status/getService'].data[0]:[]))"
          :key="i"
          :prop="item"
          :label="item"
          :formatter="formatter"
        ></el-table-column>
      </el-table>
    </div>
    <!--  -->
    <div class="table-item testcss">
      <el-table
        border
        max-height="850"
        :header-cell-style="{background:'#f2f2f2',textAlign:'left'}"
        :data="$store.getters['o_r_service_status/getService'].table"
      >
        <el-table-column
          v-for="(item, i) in (Object.keys($store.getters['o_r_service_status/getService'].table?$store.getters['o_r_service_status/getService'].table[0]:[]))"
          :key="i"
          :sortable="i==1"
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
export default {
  data() {
    return {
      date: null,
      isSlide: true,
      gameActiveIndex: 0,
      in_query_type: 2,
    }
  },
  watch: {
    date(data) {
      this.$store.commit("o_r_service_status/setDate", moment(data).add(0, "day").format("YYYY-MM-DD"));
    },
  },
  created() {
    this.dataInit()
    //获取游戏菜单
    if (!this._state.gameList) {
      this.$store.dispatch("o_r_service_status/getGame").then(data => {
        // 区服列表获取成功
        if (!this._state.service) this.getData();

      })
    }
  },
  computed: {
    _state() {
      return this.$store.state.o_r_service_status;
    },
    $$gameList() {
      return this.$store.getters["o_r_service_status/getGameList"];
    },
    $$service() {
      return this.$store.getters["o_r_service_status/getService"];
    }
  },
  methods: {
    formatter(row, column, value) {
      var { label } = column
      if (label == "总ROI") {
        value = +value ? (value * 100).format(2) + '%' : value.format(0) + '%';
      } else if (label == "总收益") {
        value = +value ? value.format(2) : value.format(0);
      } else if (label == "回本天数" || label == "剩余回本天数") {
        value = +value ? value.format(0) : value.format(0);
      }
      return value
    },
    slide() {
      this.isSlide = !this.isSlide
      if (parseInt($('.gameList').css('height')) > 50) {
        $(".gameList").animate({ height: "50px" });
      } else {
        $(".gameList").animate({ height: "180px" });
      }
    },
    // 切换游戏
    changeGame(index) {
      this.gameActiveIndex = index;
      console.log(this.$$gameList[this.gameActiveIndex].app_id);
      this.$store.commit('o_r_service_status/setGameActiveIndex', this.gameActiveIndex)
      this.$store.commit("o_r_service_status/setGameID", this.$$gameList[this.gameActiveIndex].app_id)
      // 区服列表获取成功
      this.getData();
    },
    // 导出
    exportData() {
      var thead = document.querySelector('.money thead').innerHTML
      var tbody = document.querySelector('.money tbody').innerHTML + `
        <tr class="el-table__row">
            <td rowspan="1" colspan="1" class="el-table_22_column_222 style = color: red;">
                <div class="cell">743.32</div>
            </td>
            <td rowspan="1" colspan="1" class="el-table_22_column_223  ">
                <div class="cell">617.33</div>
            </td>
            <td rowspan="1" colspan="1" class="el-table_22_column_224  ">
                <div class="cell">10060155.07</div>
            </td>
            <td rowspan="1" colspan="1" class="el-table_22_column_225  ">
                <div class="cell">311613.54</div>
            </td>
            <td rowspan="1" colspan="1" class="el-table_22_column_226  ">
                <div class="cell">1485.07%</div>
            </td>
            <td rowspan="1" colspan="1" class="el-table_22_column_227  ">
                <div class="cell">4316057.79</div>
            </td>
        </tr>
        <tr class="el-table__row">
            <td rowspan="1" colspan="1" class="el-table_22_column_222  ">
                <div class="cell">743.32</div>
            </td>
            <td rowspan="1" colspan="1" class="el-table_22_column_223  ">
                <div class="cell">617.33</div>
            </td>
            <td rowspan="1" colspan="1" class="el-table_22_column_224  ">
                <div class="cell">10060155.07</div>
            </td>
            <td rowspan="1" colspan="1" class="el-table_22_column_225  ">
                <div class="cell">311613.54</div>
            </td>
            <td rowspan="1" colspan="1" class="el-table_22_column_226  ">
                <div class="cell">1485.07%</div>
            </td>
            <td rowspan="1" colspan="1" class="el-table_22_column_227  ">
                <div class="cell">4316057.79</div>
            </td>
        </tr>`
      var table = document.createElement('table')
      table.innerHTML = `<thead>${thead}</thead><tbody>${tbody}</tbody>`
      Utils.tableToExcel(
        table,
        false,
        Date.now() + '.xls'
      )
      var thead = document.querySelector('.testcss thead').innerHTML
      var tbody = document.querySelector('.testcss tbody').innerHTML
      var table = document.createElement('table')
      table.innerHTML = `<thead>${thead}</thead><tbody>${tbody}</tbody>`
      Utils.tableToExcel(
        table,
        false,
        Date.now() + '.xls'
      )
    },
    // 初始化
    dataInit() {
      if (this._state.date) {
        this.date = this._state.date;
      } else {
        this.date = moment().add(-1, "day").format("YYYY-MM-DD");
      }
      //
      if (this._state.gameActiveIndex) {
        this.gameActiveIndex = this._state.gameActiveIndex
      } else {
        this.gameActiveIndex = 0
      }

    },
    //查询数据
    getData() {
      var params = {
        in_count_date: this._state.date,   //开始日期
        in_app_id: this._state.gameID,       //游戏ID                  
        in_gamezone_id: this._state.zoneID,   //区服ID 
        in_query_type: this.in_query_type,    //查询类型              
      }
      this.$store.dispatch("o_r_service_status/getReportInfo", { params, tag: 'service' })
    },
  },
}
</script>
<style lang="scss" scoped>
.gameBox {
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
    height: 180px;
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
  width: 90%;
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
