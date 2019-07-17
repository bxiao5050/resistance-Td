<template>
  <div>
    <!-- <el-button type="primary" @click="goBack" size = 'small' >返回</el-button> -->
    <el-card class="box-card" style="margin:0 29px">
      <div slot="header" class="clearfix">
        <el-button
          class="el-icon-back"
          @click="goBack"
          size="small"
          style="marginLeft:20px"
        >&nbsp;&nbsp;返回</el-button>
        <span style="font-size:16px">模板名&nbsp;:&nbsp;{{_state.datasheets['模板名']}}</span>
      </div>
      <span class="title">参数设置:</span>
      <section v-for="(item,index) in searchData" :key="index">
        <div v-if="item.param_type==='date'" style="margin:15px;float:left;">
          <span>{{item.param_desc}}</span>
          <el-date-picker v-model="item.value" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </div>
        <div v-else style="margin:15px;float:left;">
          <el-input :placeholder="'请输入'+item.param_desc" v-model="item.value">
            <template slot="prepend">{{item.param_desc}}</template>
          </el-input>
        </div>
      </section>
      <my-row style="marginTop:20px">
        <span class="title">数据格式:</span>
        <section style="padding-right:15px">
          <el-radio v-model="dataFormat" label="1">数据列表</el-radio>
          <el-radio v-model="dataFormat" label="2">CSV文件</el-radio>
        </section>
        <el-button type="primary" @click="queryPageData" size="small">查询</el-button>
      </my-row>
    </el-card>
    
    <div class="content-body">
      <card>
        <div slot="header">
          <div class="card-header-title">查询结果</div>
          <div class="export-link">
            <a href="javascript:void(0)" @click="exportData">
              <i class="icon-download"></i>导出数据
            </a>
          </div>
        </div>
        <!-- 查询结果 -->
        <div slot="body">
          <div class="table-content">
            <!-- <normalTable :tableData="queryData"></normalTable> -->
            <div class="table-item">
            <el-table
              border
              max-height="850"
              :header-cell-style="{background:'#f2f2f2',textAlign:'left'}"
              :data="queryData"
            >
              <el-table-column
                v-for="(item, i) in (Object.keys(queryData[0]?queryData[0]:{}))"
                :key="i"
                :prop="item"
                :label="item"
                :width="i==0 ? 200:(i==0?100:'')"
              ></el-table-column>
            </el-table>
          </div>
          </div>
        </div>
      </card>
    </div>
    <pagination
      style="padding: 0px 18px;marginBottom:30px"
      :total="allData.length"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="cahngePage"
    />
  </div>
</template>
<script>
import card from 'src/components/card.vue'
import api from 'src/services/api'
import normalTable from 'src/components/table/element-table.vue'
import Pagination from 'src/components/Pagination/index.vue'
export default {
  props: ['changComponents'],
  components: {
    card, normalTable,Pagination
  },
  data() {
    return {
      userId: '',
      userName: '',
      dataFormat: "1",
      searchData: [],
      allData:[],
      queryData: [],
      listQuery: {
        page: 1,
        limit: 10
      },
    }
  },
  created() {
    this.query(2)
  },
  computed: {
    _state() {
      return this.$store.state.fn_report_plate;
    },
  },
  methods: {
    goBack() {
      this.$emit('changComponents', { name: 'mainPage', index: -1 })
    },
    cahngePage(data) {
      this.queryData = this.allData.slice((data.page - 1) * this.listQuery.limit, this.listQuery.limit * data.page)
    },
    query(index, params) {
      var params = {
        in_app_id: this.$store.state['common'].nowgame,
        in_template_id: this._state.datasheets.template_id,
        in_params: params ? "in_app_id#" + this.$store.state['common'].nowgame + ',' + params : "",
        in_query_type: index,
        dataview: this.$store.state.common.nowmenu.dataView[0],
      }
      api.user.getQuery(params).then((data) => {
        if (data.code == 401) {
          if (data.state[0][0].template_id) {
            // 搜索列表
            data.state[0].forEach(function (element, i) {
              if (element.param_name === "in_app_id") {
                data.state[0].splice(i, i + 1)
              } else {
                element.value = "";
              }
            });
            this.searchData = data.state[0];
          } else {
            // 表格数据
            this.allData= data.state[0]
            this.queryData = this.allData.slice(0, this.listQuery.limit)
          }
        } else {
          Utils.Notification.error({ message: data.message });
          console.error(data.message);
        }
      })
    },
    queryPageData() {
      if (this.dataFormat==='2') {
        // 导出csv文件
        return this.exportData()
      }
      if (!this.searchData.every((todo) => todo.value)) {
        return Utils.Notification.warning({ message: '请将查询信息填写完整' });
      }
      var params = ""
      var dateArr = []//日期判断
      this.searchData.forEach((element, index) => {
        if (element.param_type === "date") {
          dateArr.push(moment(element.value, 'YYYY-MM-DD HH:mm:ss').valueOf())
          params += (element.param_name + '#' + moment(element.value).add().format("YYYY-MM-DD HH:mm:ss") + ',')
        } else {
          params += (element.param_name + '#' + element.value + ',')
        }
      });
      if (dateArr[0] && dateArr[1] && dateArr[1] < dateArr[0]) {
        return Utils.Notification.warning({ message: '开始日期不能超过结束日期,请重新选择' });
      }
      this.query(3, params)
    },
    exportData() {
      var params = ""
      var dateArr = []//日期判断
      this.searchData.forEach((element, index) => {
        if (element.param_type === "date") {
          dateArr.push(moment(element.value, 'YYYY-MM-DD HH:mm:ss').valueOf())
          params += (element.param_name + '#' + moment(element.value).add().format("YYYY-MM-DD HH:mm:ss") + ',')
        } else {
          params += (element.param_name + '#' + element.value + ',')
        }
      });
      var flag = {
        in_app_id: this.$store.state['common'].nowgame,
        in_template_id: this._state.datasheets.template_id,
        in_params: "in_app_id#" + this.$store.state['common'].nowgame + ',' + params,
        in_query_type: 3,
        dataview: this.$store.state.common.nowmenu.dataView[0],
      }
      api.user.exportData(flag)
    },
  }
}
</script>
<style lang="scss" scoped>
.title {
  display: inline-block;
  padding: 0 15px;
}
</style>
