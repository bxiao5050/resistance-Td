<template>
  <div class="complement">
    <my-row class="selection-box min-width">
      <span class="section-left">日期</span>
      <el-date-picker v-model="dataDate" type="month" placeholder="选择月"></el-date-picker>

      <span class="section-left">游戏</span>
      <el-select v-model="games_value" filterable placeholder="请选择游戏">
        <el-option
          v-for="item in _state.games"
          :key="item.app_id"
          :label="item.app_name"
          :value="item.app_id"
        ></el-option>
      </el-select>
    </my-row>
    <!-- <my-row class="selection-box min-width">
      <span class="section-left">日期</span>
      <el-date-picker v-model="channelDate" type="date" value-format="yyyy-MM-dd"></el-date-picker>

      <span class="section-left">地区/游戏</span>
      <el-button class="selection" @click="data.isShow=!data.isShow">
        <span>已选择：</span>
        <span>{{_rcg}}</span>
      </el-button>

      <div class="date-box-item">
        <span class="section-left">系统</span>
        <el-radio-group v-model="os" size="medium" @change="changeOs">
          <el-radio-button label="1">安卓</el-radio-button>
          <el-radio-button label="0">IOS</el-radio-button>
        </el-radio-group>
      </div>
    </my-row> -->


    <my-col class="min-width">
      <my-row style="margin-top:10px">
        <div class="title">渠道列表</div>
        <span v-if="!_channelList">
          <span class="txtsp">
            <i>-</i> 无渠道列表
            <i>-</i>
            <el-button @click="channelQuery()" size="medium">再次查询</el-button>
          </span>
        </span>

        <span v-if="games_value && _channelList">
          <span class="txtsp">
            <i>-</i>
            {{data.game}}
          </span>
          <!-- <span class="txtsp">
            <i>-</i>
            {{['IOS', '安卓'][_state.os]}}
          </span> -->
          <span class="txtsp" v-if="curChannel">
            <i>-</i>
            {{curChannel}}
            <i>-</i>
            <el-button @click="channelQuery()" size="medium">再次查询</el-button>
          </span>
          <span class="txtsp" v-else>
            <i>-</i>
            <el-button @click="channelQuery()" size="medium">再次查询</el-button>
          </span>
        </span>
      </my-row>
      <my-card class="channel-list-card" v-if="_channelList">
        <el-button
          :class="channel_list_class(item, i)"
          v-for="(item, i) in _channelList"
          :key="i"
          @click="c_list_handler(item, i)"
        >{{item.channelName}} </el-button>
      </my-card>
      <!-- <my-row style="margin-left:16px;" v-if="channelList.length">
        <el-button @click="dataQuery()">
          数据查询
        </el-button>
      </my-row>-->
    </my-col>
    <my-row style="margin-top:10px">
      <div class="title">渠道数据</div>
      <span v-if="curChannel && $$data && $$data.list.regions.length && !loading">
        <el-button @click="dataQuery()" size="medium" style="margin-left:15px;">再次查询</el-button>
        <!-- <i>-</i> -->
        <!-- <el-button @click="recalculate()" size="medium" disabled>
          数据重算
        </el-button>-->
      </span>
      <span v-else>
        <span class="txtsp">
          <i>-</i> 无渠道数据
          <i>-</i>
          <el-button @click="dataQuery()" size="medium">再次查询</el-button>
        </span>
      </span>

      <div v-if="curChannel " class="month-picker">
        <el-button @click="editMonth(0)" size="small" style="margin-left:15px;">上个月</el-button>
        <div class="title">{{curChannel}} - {{curYear}}年{{curMonth}}月</div>
        <el-button @click="editMonth(1)" size="small" style="margin-left:15px;">下个月</el-button>
      </div>
    </my-row>

    <my-row
      v-if="curChannel && $$data && $$data.list.regions.length && !loading"
      style="margin-top:15px;"
    >
      <div class="section-left">过滤</div>
      <el-select
        v-model="filter"
        filterable
        multiple
        size="small"
        style="width:250px;"
        placeholder="国家"
      >
        <!-- <el-option label="国家" :value="null"></el-option> -->
        <el-option v-for="(_, i) in $$data.list.search" :key="i" :label="_.region" :value="i"></el-option>
      </el-select>
    </my-row>
   <my-row style="margin-top:20px;">
      <div v-if="curChannel && $$data && $$data.list.regions.length && !loading" @click="tableClick">
        <el-table height="400" :data="$$data.list.regions" :row-class-name="rowClassName" @cell-dblclick="cell_dbClick" @cell-click="cell_click" ref="table">
          <el-table-column class-name="complement-data-type" prop="region" :label="$$data.keys[$$data.index.regionIndex]" width="110" :formatter="regionFormatter"></el-table-column>
          <el-table-column class-name="complement-data-type" label="数据类型" width="78" :formatter="myFormatter"></el-table-column>
          <el-table-column class-name="complement-data-type editable" v-for="(v, i) in [...Array(_date[2])]" :key="i" :label="i+1+''" width="40" :formatter="myFormatter_"></el-table-column>
          <el-table-column class-name="complement-data-type" label="操作" width="90" :formatter="_myFormatter"></el-table-column>
        </el-table>
      </div>
    </my-row>
  </div>
</template>

<script>
import http from "src/services/http";

export default {
  name: "complement",
  data() {
    return {
      isOn: null,
      loading: false,
      filter: [],
      data: {
        allTxt: "全部（国家/地区）",
        isShow: false,
        region: null,
        game: null,
        regionArr: [],
        gameArr: [],
        callback: this.setRcg
      },
      os: null,
      curChannel: null,
      curYear: null,
      curMonth: null,
      input: null,
      inputParent: null,
      editInput: null,
      editInputParent: null,
      channelDate: moment()
        .add(-1, "day")
        .format("YYYY-MM-DD"),
      dataDate: moment(new Date().setDate(1)).add().format("YYYY-MM-DD"),
      pending: [],
      ctrling: 0,
      shifting: 0,
      // 
      games: [{
        app_id: 0,
        app_name: '越南攻城'
      }, {
        app_id: 1,
        app_name: 'test1'
      }, {
        app_id: 2,
        app_name: 'test2'
      }, {
        app_id: 3,
        app_name: 'test3'
      }, {
        app_id: 4,
        app_name: 'test4'
      }],
      games_value: '',
      in_app_id:0,
      in_media_source:'',
      in_country:'',
      in_repair_data:'',
      in_data_type:0,
    };
  },
  computed: {
    $$data() {
      var data = this.$store.getters["h5_data_supplement/getList"]
      if (data && data.list.regions.length && !this.$data.loading) this.$nextTick(() => {
        this.$_th = this.$refs.table.$refs.headerWrapper.querySelectorAll("th")
      })
      return data;
    },
    _channelList() {
      return this.$store.getters["h5_data_supplement/getChannels"];
    },
    // _rcg() {
    //   var str = "无";
    //   if (this.data.region) {
    //     if (this.data.game) {
    //       str = this.data.game;
    //     }
    //   }
    //   return str;
    // },
    _state() {
      return this.$store.state.h5_data_supplement;
    },
    _date() {
      var end = moment(new Date(this.curYear, this.curMonth, 0)).format(
        "YYYY-MM-DD"
      );
      return [
        moment(new Date(this.curYear, this.curMonth - 1, 1)).format(
          "YYYY-MM-DD"
        ),
        end,
        end.slice(-2) * 1
      ];
    }
  },
  watch: {
    curChannel(data) {
      this.$store.commit("h5_data_supplement/setCurChannel", data);
    },
    isOn(data) {
      this.$store.commit("h5_data_supplement/setOnIndex", data);
    },
    curYear(data) {
      this.$store.commit("h5_data_supplement/setCurYear", data);
    },
    curMonth(data) {
      this.$store.commit("h5_data_supplement/setCurMonth", data);
    },
    //
    dataDate(newValue, oldValue) {
      var data = [moment(newValue.setDate(1)).add().format("YYYY-MM-DD"), moment(newValue).endOf('month').format("YYYY-MM-DD")]
      this.$store.commit("h5_data_supplement/setDataDate", data);
    },
    games_value(newValue,oldValue){
      this.$store.commit("h5_data_supplement/setInAppId", newValue);
      this.data.game = this._state.games.filter(todo=>todo.app_id==newValue)[0].app_name
      this.getData(2,'channelData')

    }
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex % 4 === 0) {
            return [4, 1];
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
    changeOs(val) {
      this.$store.commit("h5_data_supplement/setOs", val);
      this.channelQuery()
    },
    channel_list_class(item, i) {
      var arr = [];
      if (i === this.isOn) {
        arr.push("on");
      }
      if (item.isBulu) {
        arr.push("green");
      } else {
        arr.push("red");
      }
      return arr.join(" ");
    },
    onblurEvent() {
      this.input.value = Number(this.input.value.replace(/(\$|\,)/g, '').replace(/(\。)/g, '.')) || 0
      if (this.input.value >= "0") {
        this.inputParent.innerHTML = this.input.value;
      } else {
        this.inputParent.innerHTML = "0";
      }
      this.input.removeEventListener("blur", this.onblurEvent);
      this.input = this.inputParent = null;
    },
    onblurEvent_() {
      this.editInput.value = Number(this.editInput.value.replace(/(\$|\,)/g, '').replace(/(\。)/g, '.')) || 0
      this.editInputParent.innerHTML = "修改";
      if (this.editInput.value >= "0") {
        this.pending.forEach(target => {
          this.$_th[target.dataset.label * 1 + 1].classList.remove("pending");
          target.innerHTML = this.editInput.value;
          target.classList.remove("pending");
        });
        this.pending = [];
      }
      this.editInput.removeEventListener("blur", this.onblurEvent_);
      this.editInput = this.editInputParent = null;
    },
    cell_dbClick(row, column, cell, event) {
      if (cell.classList.contains("editable")) {
        this.input = document.createElement("input");
        this.inputParent = event.target;
        if (this.inputParent.classList.contains("pending")) {
          this.inputParent.classList.remove("pending");
          this.pending.splice(this.pending.indexOf(this.inputParent), 1);
        }
        this.inputParent.innerHTML = "";
        this.inputParent.append(this.input);
        this.input.setAttribute("class", "cell-inline-input");
        this.input.focus();
        this.input.addEventListener("blur", this.onblurEvent);
        
        // this.$_th[event.target.dataset.label * 1 + 1].classList.remove("pending");
      }
    },
    pendingClear() {
      this.pending.forEach(target => {
        var i = target.dataset.label * 1 + 1;
        this.$_th[i].classList.remove("pending");
        target.classList.remove("pending");
      });
      this.pending = [];
    },
    cell_click(row, column, cell, { target }) {
      if (cell.classList.contains("editable")) {
        var { classList, dataset } = target;
        if (!this.inputParent) {
          if (classList.contains("pending")) {
            classList.remove("pending");
            var i = target.dataset.label * 1 + 1;
            this.$_th[i].classList.remove("pending");
            this.pending.splice(this.pending.indexOf(target), 1);
          } else {
            if (this.pending.length) {
              var isSameRegion = this.pending[0].dataset.region === dataset.region
              var isSameKeyIndex = this.pending[0].dataset.index === dataset.index;
              if (!isSameRegion || !isSameKeyIndex) {
                this.pendingClear();
              }
            }
            console.log(new Date().getTime(), this.ctrling, this.shifting);
            if (!this.ctrling && !this.shifting) {
              this.pending.length && this.pendingClear();
            }
            if (this.shifting && this.pending.length) {
              var start = this.pending[this.pending.length - 1].dataset.label * 1;
              var end = dataset.label * 1;
              if (end - start > 1) {
                var list = document.querySelectorAll('.editable-item[data-region="' + dataset.region + '"][data-index="' + dataset.index + '"]');
                list.forEach((item, i) => {
                  if (item.dataset.label * 1 > start && item.dataset.label * 1 < end) {
                    this.pending.push(item);
                  }
                });
              }
            }
            if (target.classList.contains('editable-item')) {
              this.pending.push(target);
            }

            this.pending.length > 1 && this.pending.sort(function (a, b) {
              return a.dataset.label - b.dataset.label;
            });

            this.pending.forEach(item => {
              var i = item.dataset.label * 1 + 1;
              !this.$_th[i].classList.contains("pending") && this.$_th[i].classList.add("pending");
              !item.classList.contains("pending") && item.classList.add("pending");
            });
          }
        }
      }
    },
    rowClassName({ row, rowIndex }) {
      if (this.filter.length) {
        if (this.filter.indexOf(rowIndex) === -1) {
          return "hide";
        }
      }
      return "";
    },
    regionFormatter(row, column, cellValue) {
      return (
        <div class="cell-inline">
          {this.$store.state.overseas_common.regionMap[cellValue] || cellValue}
        </div>
      );
    },
    myFormatter(row, column, cellValue) {
      return (
        <div class="cell-inline types">
          <div>单价</div>
          <div>注册</div>
          <div>创角</div>
          <div>花费</div>
        </div>
      );
    },
    myFormatter_(row, column) {
      var { keys, index, list, types } = this.$$data;
      var region = row.region;
      var date = column.label.length === 1 ? "0" + column.label : column.label;
      var m = this.curMonth < 10 ? "0" + this.curMonth : this.curMonth;
      date = this.curYear + "-" + m + "-" + date;
      var data = list[region][date];

      return (
        <div class="cell-inline my-pointer">
          {types.map((keyIndex, i) => {
            return (
              <div
                class="editable-item"
                data-region={region}
                data-label={column.label}
                data-i={i}
                data-index={keyIndex}
              >
                {Number(data[keys[keyIndex]])}
              </div>
            );
          })}
        </div>
      );
    },
    _myFormatter(row, column) {
      var { index, list, types } = this.$$data;
      var region = row.region;
      return (
        <div class="cell-inline">
          {types.map((keyIndex, i) => {
            return (
              <div
                onClick={this.editVal.bind(this, { region, keyIndex })}
                class="cell-inline-item"
                data-region={region}
                data-index={keyIndex}
              >
                修改
              </div>
            );
          })}
        </div>
      );
    },
    editVal({ region, keyIndex }) {
      if (this.pending.length) {
        this.editInput = document.createElement("input");
        this.editInputParent = event.target;
        this.editInputParent.innerHTML = "";
        this.editInputParent.append(this.editInput);
        this.editInput.setAttribute("class", "cell-inline-input");
        this.editInput.focus();
        this.editInput.addEventListener("blur", this.onblurEvent_);
      } else {
        if (confirm("确认修改？")) {
          var param = {
            in_begin_date: this._state.dataDate[0],        //开始日期
            in_end_date: this._state.dataDate[1],          //结束日期
            in_app_id: this._state.in_app_id,              //游戏id 
            in_media_source: this.curChannel,              //渠道
            in_country: region,
            in_repair_data:  (() => {
              var map = [];
              var list = document.querySelectorAll(
                '.editable-item[data-region="' +
                region +
                '"][data-index="' +
                keyIndex +
                '"]'
              );
              list.forEach(item => {
                map.push(item.innerHTML * 1);
              });
              return map.join(",");
            })(),
            in_data_type: this.$$data.typeIndex[keyIndex],
            in_operator_type: 4
          };
          this.$store.dispatch('h5_data_supplement/query', param).then(data => {
            if (data.code === 401) {
              this.$notify({
                type: "success",
                message: "修改成功"
              });
            }
            this.$nextTick(() => {
              this.loading = false;

            });
          })
          // var url = "/query/" + 'fn_config_data_repair_h5';
          // http.post(url, param).then(({ code }) => {
          //   if (code === 401) {
          //     this.$notify({
          //       type: "success",
          //       message: "修改成功"
          //     });
          //   }
          // });
        }
      }
    },
    editMonth(bool) {
      if (bool) {
        if (this.curMonth === 12) {
          this.curYear += 1;
          this.curMonth = 1;
        } else {
          this.curMonth += 1;
        }
      } else {
        if (this.curMonth === 1) {
          this.curYear -= 1;
          this.curMonth = 12;
        } else {
          this.curMonth -= 1;
        }
      }
      var time = this.curYear+'-'+((this.curMonth+'').length==1?'0'+this.curMonth:this.curMonth);
      this.dataDate = new Date(time);
      var data = [moment(new Date(time).setDate(1)).add().format("YYYY-MM-DD"), moment(new Date(time)).endOf('month').format("YYYY-MM-DD")]
      this.$store.commit("h5_data_supplement/setDataDate", data);
      this.dataQuery();
    },
    c_list_handler(item, i) {
      // if (this.isOn !== i) {
      //   this.isOn = i;
      //   this.curChannel = item.channelName;
      // }
      this.curChannel = item.channelName;
      this.in_media_source = item.channelName;
        this.dataQuery();
      // this.getData(3,'channelAllData')

    },
    setRcg([region, regionArr, game, gameArr]) {
      this.data.region = region;
      this.data.regionArr = regionArr;
      this.data.game = game;
      this.data.gameArr = gameArr;
      this.channelQuery();
    },
    dataInit() {
      this.os = this._state.os;
      this.games_value = this._state.in_app_id;
      if (this._state.region) this.data.region = this._state.region;
      if (this._state.regionArr) this.data.regionArr = this._state.regionArr;
      if (this._state.game) this.data.game = this._state.game;
      if (this._state.gameArr) this.data.gameArr = this._state.gameArr;
      if (this._state.curChannel) this.curChannel = this._state.curChannel;
      if (this._state.onIndex) this.isOn = this._state.onIndex;
      if (this._state.curYear) this.curYear = this._state.curYear;
      if (this._state.curMonth) this.curMonth = this._state.curMonth;
    },
    dataQuery() {
      this.loading = true;
      var param = {
        in_begin_date: this._state.dataDate[0],          //激活开始日期
        in_end_date: this._state.dataDate[1],          //激活结束日期
        in_app_id: this._state.in_app_id,                    //游戏层级 
        in_media_source: this.curChannel,                           //渠道
        in_country: this.in_country,
        in_repair_data: this.in_repair_data,
        in_data_type: this.in_data_type,
        in_operator_type: 3
      };
      console.log(param)
      this.$store.dispatch('h5_data_supplement/query', param).then(data => {
        this.$nextTick(() => {
          this.loading = false;
        });
      })
    },
    channelQuery() {
      if (!this.data.gameArr[0]) {
        this.$notify({
          type: "warning",
          message: "请选择游戏",
          offset: 50
        });
        return;
      }

      this.$store.commit("h5_data_supplement/setRegion", this.data.region);
      this.$store.commit("h5_data_supplement/setRegionArr", this.data.regionArr);
      this.$store.commit("h5_data_supplement/setGame", this.data.game);
      this.$store.commit("h5_data_supplement/setGameArr", this.data.gameArr);

      var param = {
        in_unite_id: this.data.gameArr[0],
        in_os: this._state.os,
        count_date: this.$data.channelDate
      };
      // var url = "/query/" + this.$store.state.common.nowmenu.dataView[1];
      var url = "/query/" + "query_app_mediasource";
      this.curChannel = null;
      http.post(url, param).then(({ state, code }) => {
        if (code === 401) {
          this.isOn = null;
          this._state.channelData = state[0];
          this._channelList;
        }
      });
    },
    recalculate() {
      var param = {
        gameId: this.data.gameArr[0],
        begin_date: this._date[0],
        end_date: this._date[1],
        os: this.os,
        media_source: this.curChannel
      }
      this.$store.dispatch('h5_data_supplement/recalculate', param).then(data => {
        if (data.code === 401) {
          this.$notify({
            type: "success",
            message: "重算完成"
          });
          // this.dataQuery()
        }
      })
    },
    onKeyDown({ keyCode }) {
      switch (keyCode) {
        case 13:
          this.input && this.input.blur();
          this.editInput && this.editInput.blur();
          break;
        case 16:
          !this.shifting && this.$data.shifting++;
          break;
        case 17:
          !this.ctrling && this.$data.ctrling++;
          break;
      }
    },
    onKeyUp({ keyCode }) {
      switch (keyCode) {
        case 16:
          this.$data.shifting--;
          break;
        case 17:
          this.$data.ctrling--;
          break;
      }
    },
    tableClick(e) {
      e.stopPropagation()
    },
    windowClick() {
      this.pending.length && this.pendingClear();
    },
    getData(index, name) {
      if (index == 3 && (!this.games_value || !this.dataDate)) {
        return Utils.Notification.warning({ message: "查询失败,请确认查询信息是否填写完整" })
      }
      var params = {
        in_begin_date: this._state.dataDate[0],          //激活开始日期
        in_end_date: this._state.dataDate[1],          //激活结束日期
        in_app_id: this._state.in_app_id,                    //游戏层级 
        in_media_source: this.in_media_source,                           //渠道
        in_country: this.in_country,
        in_repair_data: this.in_repair_data,
        in_data_type: this.in_data_type,
        in_operator_type: index
      };
      this.$store.dispatch("h5_data_supplement/getMOduleData", { params, tag: name })

      // this.$store.dispatch("h5_data_supplement/getMOduleData", { params, tag:name })
    },
    // windowScroll(e) {
    //   if (this.$refs.table) {

    //     var table = this.$refs.table
    //     var scroll = this.$root.$children[0].$refs.scroll
    //     var header = table.$refs.headerWrapper.classList;

    //     if (scroll.scrollTop >= table.$el.offsetTop) {
    //       !header.contains("complement-fixed") && header.add("complement-fixed");
    //     } else {
    //       header.contains("complement-fixed") && header.remove("complement-fixed");
    //     }
    //   }

    // }
  },
  created() {
    var store = this.$store;
    this.dataInit();
    var params = {
      in_begin_date: this._state.dataDate[0],          //激活开始日期
      in_end_date: this._state.dataDate[1],          //激活结束日期
      in_app_id: 0,                    //游戏层级 
      in_media_source: '',                           //渠道
      in_country: '',
      in_repair_data: '',
      in_data_type: 0,
      in_operator_type: 1
    };
    this.$store.dispatch("h5_data_supplement/getMOduleData", { params, tag: 'games' })
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("click", this.windowClick);
  },
  mounted() {
    this.$root.$children[0].$refs.scroll.addEventListener(
      "scroll",
      this.windowScroll
    );
  },
  destroyed() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("click", this.windowClick);
    this.$root.$children[0].$refs.scroll.removeEventListener(
      "scroll",
      this.windowScroll
    );
  }
};
</script>
<style lang="scss" scoped>
.month-picker {
  display: flex;
}
.min-width {
  min-width: 570px;
}
.txtsp {
  margin-top: -1px;
}
i {
  position: relative;
  top: -2px;
  padding-left: 8px;
  padding-right: 10px;
}
.title {
  color: #5b5691;
  font-size: 20px;
  font-family: "黑体";
  margin-left: 16px;
}
.selection-box {
  margin-top: 5px;
}
.section-left {
  font-size: 15px;
  padding-left: 16px;
  margin-right: 16px;
}
.os {
  width: 100px;
}
.el-select-dropdown__item {
  text-align: center;
}
.channel-list-card {
  margin: 16px;
  padding: 10px 0 0 0;
  button {
    color: #fff;
    margin: 0 10px 10px 10px;
    &.on {
      background: #5b5691 !important;
    }
    &.red {
      background: red;
    }
    &.green {
      background: green;
    }
  }
}

.cell-inline {
  border-right: 2px solid #ebeef5;
  display: flex;
  height: 175px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // #ebeef5
  div {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    border-bottom: 1px solid #ebeef5;
  }
  &.my-pointer {
    cursor: pointer;
    user-select: none;
  }
}
</style>
<style lang="scss">
td.complement-data-type {
  padding: 0 !important;
  height: 175px;
  .cell {
    padding: 0 !important;
  }
}
td .cell-inline-input {
  width: 100%;
  text-align: center;
  border: 1px dashed #5b5691;
  outline: none;
}
td .cell-inline {
  .cell-inline-item {
    cursor: pointer;
  }
}
.cell-inline .pending {
  color: #fff;
  background: #5b5691;
}
.complement {
  th {
    padding: 0;
    border-top: 1px solid #ebeef5;
    border-right: 2px solid #ebeef5;
    &.pending .cell {
      color: #fff;
      background: #5b5691;
    }
    .cell {
      line-height: 36px;
    }
  }
  .date-box-item {
    label {
      margin-bottom: 0;
    }
  }
}

.complement-fixed {
  position: fixed;
  top: 0;
  z-index: 999;
}
</style>
