<template>
  <div>
    <my-row style="padding-left:20px;">
      <!-- 输入渠道 -->
      <el-input placeholder="请输入内容" v-model="input_channel_name" style="width:500px; margin:0 15px">
        <template slot="prepend">渠道名称</template>
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
        @cell-dblclick="handleCellClick"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          v-for="(item, i) in (Object.keys((_state.tableData[0] && _state.tableData[0].length)?_state.tableData[0][0]:[]))"
          :key="i"
          :prop="item"
          :label="item"
          :width="115"
          v-if="i==0"
        ></el-table-column>
        <el-table-column
          v-for="(item, i) in (Object.keys((_state.tableData[0] && _state.tableData[0].length)?_state.tableData[0][0]:[]))"
          :key="i"
          :prop="item"
          :label="item"
          v-if="i==1"
        >
          <template slot-scope="scope">
            <el-input
              v-show="activityIndex == scope.$index"
              size="small"
              autofocus
              type="text"
              placeholder="请输入url"
              v-model="_state.tableData[0][scope.$index][item]"
              @blur="blurInput(scope.$index)"
            ></el-input>
            <span v-show="activityIndex != scope.$index">{{_state.tableData[0][scope.$index][item]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" v-if="(_state.tableData[0] && _state.tableData[0].length)">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="changeRow(scope.$index,)"
              type="primary"
              size="small"
            >修改</el-button>

            <el-button
              @click.native.prevent="deleteRow(scope.$index,)"
              type="danger"
              size="small"
            >移除</el-button>
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
      input_channel_name: "",
      new_channel_name: '',
      in_media_source: "",
      in_id: 0,
      activityIndex: -1,
    }
  },
  created() {
    //查询游戏列表和表格数据   
    var params = {
      in_media_source: this.in_media_source,
      in_id: this.in_id,
      in_operator_type: 1,
    }
    this.$store.dispatch("h5_channel_config/getMOduleData", { params, tag: "tableData", })
  },
  computed: {
    _state() {
      return this.$store.state.h5_channel_config
    }
  },
  methods: {
    //url修改   
    blurInput(index) {
      this.activityIndex = -1
    },
    //添加行的索引值   
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
      return '';
    },
    // 双击修改url
    handleCellClick(row, column, cell, event) {
      var { label } = column;
      if (label == '渠道') {
        this.activityIndex = row.index;
      }
    },
    
    // 新增
    addUrlData() {
      // 判断渠道名称是否为空
      if (!this.input_channel_name) {
        return Utils.Notification.warning({ message: "请将渠道名称填写完整" })
      }
      var oldArr = []
      this.in_media_source = this.input_channel_name;
      // 判断渠道名称是否已存在
      if (this._state.tableData[0].length) {
        for (let index = 0; index < this._state.tableData[0].length; index++) {
          oldArr.push(this._state.tableData[0][index]['渠道'])
        }
        if (oldArr.includes(this.input_channel_name)) {
          return Utils.Notification.warning({ message: "该渠道名已存在,请勿重复操作" })
        }
      }
      this.getData(2);
    },
    //删除数据
    deleteRow(index, data) {
      if (confirm("确认移除？")) {
        this.in_id = this._state.tableData[0][index]["序号"];
        this.getData(3);
      }
    },
    // 修改数据
    changeRow(index) {
      if (!this._state.tableData[0][index]['渠道']) {
        return Utils.Notification.warning({ message: '请将渠道名称填写完整再提交' })
      }
      if (confirm("确认修改？")) {
        this.in_id = this._state.tableData[0][index]["序号"];
        this.in_media_source = this._state.tableData[0][index]['渠道'];
        this.getData(4);
      }

      
    },
    getData(index) {
      var params = {
        in_media_source: this.in_media_source,
        in_id: this.in_id,
        in_operator_type: index,
      }
      this.$store.dispatch("h5_channel_config/getMOduleData", { params, tag: "tableData", }).then(()=>{
          if (index === 2) {
              this.input_channel_name = ""
          }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.table-item {
  border: 15px solid #e7e1ea;
  width: 800px;
  height: auto;
  margin: 20px;
}
.el-table__header {
  background: #f2f2f2;
}
</style>
