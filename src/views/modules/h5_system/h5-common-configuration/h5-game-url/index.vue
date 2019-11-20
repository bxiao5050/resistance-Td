<template>
  <div>
    <my-row style="padding-left:20px;">
      <!-- 选择游戏 -->
      <el-select v-model="games_value" filterable placeholder="请选择游戏">
        <el-option
          v-for="item in _state.games[0]"
          :key="item.app_id"
          :label="item.app_name"
          :value="item.app_id"
        ></el-option>
      </el-select>
      <!-- url输入框 -->
      <el-input placeholder="请输入内容" v-model="input_url" style="width:500px; margin:0 15px">
        <template slot="prepend">原始URL</template>
      </el-input>
      <el-button type="info" @click="addUrlData">
        <i class="el-icon-plus"/>新增
      </el-button>
    </my-row>
    <hr style="width:100%;margin-bottom: 0;">
    <!-- 表格 -->
    <div class="table-item">
      <el-table
        border
        max-height="760"
        :header-cell-style="{background:'#f2f2f2'}"
        :data="_state.tableData[0]"
        @cell-dblclick='handleCellClick'
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          v-for="(item, i) in (Object.keys((_state.tableData[0] && _state.tableData[0].length)?_state.tableData[0][0]:[]))"
          :key="i"
          :prop="item"
          :label="item"
          :width="getWidth(i)"
          v-if="i<3"
        ></el-table-column>
        <el-table-column
          v-for="(item, i) in (Object.keys((_state.tableData[0] && _state.tableData[0].length)?_state.tableData[0][0]:[]))"
          :key="i"
          :prop="item"
          :label="item"
          v-if="i==3"
        >
        <template slot-scope="scope">
            <el-input v-show="activityIndex == scope.$index" size="small" autofocus type="text" placeholder="请输入url"
            v-model="_state.tableData[0][scope.$index][item]" 
            @blur="blurInput(scope.$index)"
            ></el-input> 
            <span v-show="activityIndex != scope.$index">{{_state.tableData[0][scope.$index][item]}}</span>
        </template>
        </el-table-column>
        <el-table-column
            v-if="(_state.tableData[0] && _state.tableData[0].length)"
            width="160"
            label="操作">
            <template slot-scope="scope">
                <el-button
                @click.native.prevent="changeRow(scope.$index,)"
                type="primary"
                size="small">
                修改
                </el-button>
                <el-button
                @click.native.prevent="deleteRow(scope.$index,)"
                type="danger"
                size="small">
                移除
                </el-button>
            </template>
            </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { log } from 'util';
export default {
  data() {
    return {
      input_url:'',
      games_value: '',
      in_app_url: '',
      in_app_id: 0,
      in_app_name: '',
      in_id: 0,
      activityIndex:-1,
    }
  },
  created() {
    //查询游戏列表和表格数据   
    var params = {
      in_app_id: this.in_app_id,
      in_app_name: this.in_app_name,
      in_app_url: this.in_app_url,
      in_id: this.in_id,
      in_operator_type: 2,
    }
    this.$store.dispatch("h5_game_url/getMOduleData", { params, tag: "tableData", }).then(() => {
      this.getData("games", 1);
    })
  },
  computed: {
    _state() {
      return this.$store.state.h5_game_url
    }
  },
  watch:{
    games_value(newValue,oldValue){
      this.in_app_id = newValue
      this.in_app_name = "";
      this.in_app_url = "";
      this.in_id = 0;
      this.getData("tableData", 2);
    }
  },
  methods: {
    //url修改   
    blurInput(index){
      this.activityIndex = -1
    },
    //添加行的索引值   
      tableRowClassName({row, rowIndex}) {
        row.index = rowIndex;
        return '';
      },
    // 双击修改url
      handleCellClick(row, column, cell, event){
          var {label} = column;
          if (label == 'url') {
              this.activityIndex = row.index;
          }
      },
    // 新增
    addUrlData() {
      if (!this.input_url || !this.games_value) {
        return Utils.Notification.warning({ message: "请将录入数据填写完整" })
      }
      for (let index = 0; index < this._state.tableData[0].length; index++) {
        if (this._state.tableData[0][index]["游戏应用ID"] == this.games_value && this._state.tableData[0][index]['url'] == this.input_url) {
          return Utils.Notification.warning({ message: "当前URL在对应游戏中已存在" })
        }
      }
      var app_name = this._state.games[0].filter((todo) => todo.app_id == this.games_value)[0].app_name;
      this.$store.commit('h5_game_url/setUrl', this.input_url);
      this.$store.commit('h5_game_url/setGameName', app_name);
      this.$store.commit('h5_game_url/setAppId', +this.games_value);
      this.in_app_url = this.input_url;
      this.in_app_id =  +this.games_value;
      this.in_app_name = app_name;
      this.getData("tableData", 3);
    },
    //删除数据
    deleteRow(index,data){
      if (confirm("确认移除？")) {
        this.in_app_id = this._state.tableData[0][index]["游戏应用ID"];
        this.in_app_name = this._state.tableData[0][index]["游戏"];
        this.in_app_url = this._state.tableData[0][index]["url"];
        this.in_id = this._state.tableData[0][index]["序号"];
        this.getData('tableData',4);
      }
    },
    // 修改数据
    changeRow(index){
      if (!this._state.tableData[0][index]['url']) {
            return Utils.Notification.warning({message: '请将url填写完整'})
        }
      if (confirm("确认修改？")) {
        this.in_app_id = this._state.tableData[0][index]["游戏应用ID"];
        this.in_app_name = this._state.tableData[0][index]["游戏"];
        this.in_app_url = this._state.tableData[0][index]["url"];
        this.in_id = this._state.tableData[0][index]["序号"];
        this.getData("tableData", 5);
      }
    },
    getData(name, index) {
      var params = {
        in_app_id: this.in_app_id,
        in_app_name: this.in_app_name,
        in_app_url: this.in_app_url,
        in_id: this.in_id,
        in_operator_type: index,
      }
      this.$store.dispatch("h5_game_url/getMOduleData", { params, tag: name, }).then(()=>{
        index == 3 && (this.input_url="")
        this.activityIndex = -1
      })
    },
    getWidth(index) {
        switch (index) {
            case 0:
                return 80
                break;
            case 1:
                return 150
                break;
            case 2:
                return 150
                break;
            case 4:
                return 150
                break;
            default:
                break;
        }
    },
  },
}
</script>
<style lang="scss" scoped>

.table-item {
  border: 15px solid #e7e1ea;
  width: auto;
  height: auto;
  margin: 20px;
}
.el-table__header{
  background: #f2f2f2;
}
</style>
