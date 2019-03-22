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
  </div>
</template>
<script>
import $ from 'jquery'
import zoneBox from './zoneBox.vue'
export default {
  data() {
    return {
      isSlide: true,
      gameActiveIndex: 0,
    }
  },
  components: {
    zoneBox
  },
  created() {
    this.dataInit()
    //获取游戏菜单
    if (!this._state.gameList) {
      this.$store.dispatch("o_r_channel_status/getGame").then(data => {
        // 游戏列表获取成功,设置store里面的游戏id
        this.$store.dispatch("o_r_channel_status/getZone").then(data => {
          // 区服列表获取成功
        //   if (!this._state.overall) this.getData();
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
    $$overall() {
      //   var data = this.$store.getters["o_r_channel_status/getOverall"];
      //   if (data.xList.length) {
      //     this.$nextTick(() => {
      //       this.createChart();
      //     });
      //   }
      //   return data
    }
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
      console.log(this.$$gameList[this.gameActiveIndex].app_id);
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
    // 导出
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
</style>

