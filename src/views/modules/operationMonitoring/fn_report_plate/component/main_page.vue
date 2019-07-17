<template>
  <section id="new-server-monitor">
    <div class="content-header">
      <div style=" width:400px;margin-left: 30px;">
        <el-input placeholder="请输入模板名" v-model="searchTxt" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="queryData">筛选</el-button>
        </el-input>
      </div>
    </div>

    <div class="content-body">
      <card>
        <div slot="header">
          <div class="card-header-title">{{$t('common.DataDetails')}}</div>
          <!-- <div class="export-link">
            <a href="javascript:void(0)" @click="exportData">
              <i class="icon-download"></i>导出数据
            </a>
          </div>-->
        </div>
        <div slot="body">
          <div class="table-item">
            <el-table
              border
              max-height="850"
              :header-cell-style="{background:'#f2f2f2',textAlign:'left'}"
              :data="tableData"
            >
              <el-table-column
                v-for="(item, i) in (Object.keys(tableData[0]?tableData[0]:{}))"
                :key="i"
                :prop="item"
                :label="tableHead[i]"
                :width="i==0 ? 200:(i==0?100:'')"
              ></el-table-column>
              <el-table-column v-if="tableData[0]" label="相关操作" width="120">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="changeRow(scope.$index,)"
                    type="primary"
                    plain
                    size="small"
                  >执行查询</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </card>
      <pagination
        style="padding: 0px 18px;marginBottom:30px"
        v-if="allData.length"
        :total="allData.length"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="cahngePage"
      />
    </div>
  </section>
</template>

<script>
import moduleHeader from 'src/views/modules/module-header'
import card from 'src/components/card.vue'
import Pagination from 'src/components/Pagination/index.vue'
import api from 'src/services/api'
import { log } from 'util';
export default {
  name: 'new-server-monitor',
  components: {
    card, moduleHeader, Pagination
  },
  props: ['changComponents'],
  data() {
    return {
      searchTxt: '',
      header: {
        title: '新服监测',
        definedContent: '',
        isShowIndex: false,
      },
      tableHead: ["模板ID", "模板名", "模板描述", "构建时间"],
      date2: moment().add(-1, 'day').format('YYYY-MM-DD'),
      tableData: [],
      allData: [],
      searchData: [],
      listQuery: {
        page: 1,
        limit: 10
      },
    }
  },
  watch: {
    searchTxt(newValue, oldValue) {
      if (!newValue) {
        this.allData = this.searchData;
        this.tableData = this.allData.slice(0, this.listQuery.limit)
      }
    }
  },
  mounted() {
    this.query();
  },
  methods: {
    cahngePage(data) {
      this.tableData = this.allData.slice((data.page - 1) * this.listQuery.limit, this.listQuery.limit * data.page)
    },
    queryData() {
      if (this.searchTxt) {
        this.allData = this.searchData.filter(data => data['模板名'].toLowerCase().includes(this.searchTxt.toLowerCase()))
        this.tableData = this.allData.slice(0, this.listQuery.limit)
      } else {
        return Utils.Notification.warning({ message: '请输入查询内容' })
      }


    },
    query() {
      var params = {
        in_app_id: this.$store.state['common'].nowgame,
        in_template_id: 0,
        in_params: "",
        in_query_type: 1,
        dataview: this.$store.state.common.nowmenu.dataView[0],
      }
      api.user.getQuery(params).then((data) => {
        if (data.code == 401) {
          // for (let index = 0; index < data.state[0].length; index++) {
          //  Object.keys(data.state[0][index]).forEach((key, flag) => {
          //    if (flag!=1) {
          //       data.state[0][index][key] = +data.state[0][index][key];
          //    }
          //  })
          // }
          this.allData = data.state[0];
          this.searchData = [...data.state[0]]

          this.tableData = data.state[0].slice(0, this.listQuery.limit)
        } else {
          Utils.Notification.error({ message: data.message });
          console.error(data.message);
        }
      })
    },
    exportData() {
      var params = {
        in_count_date: this.date2,
        in_app_id: this.$store.state['common'].nowgame,
        in_gamezone_id: this.$store.getters['Agent/selectedIdList'],
        in_channel_id: this.$store.getters['RegChannel/selected3IdList'],
        dataview: this.$store.state.common.nowmenu.dataView[0],
      }
      api.user.exportData(params)
    },
    changeRow(index) {
      this.$store.commit("fn_report_plate/set_datasheets", this.tableData[index]);
      this.$emit('changComponents', { name: 'queryPage', index: index })
    }

  }
}

</script>

<style lang="scss" scoped>
.table-content {
  overflow: auto;
  width: 100%;
  max-height: 500px;
  white-space: nowrap;
}
</style>