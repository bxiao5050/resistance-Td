<template>
  <div>
    <!-- 分成补充查询条件 -->
    <my-row class="selection-box">
      <div class="banner">
        <!-- 日期 -->
        <section style="margin-left:20px">
          <el-date-picker v-model="date" type="date" placeholder="选择日期"></el-date-picker>
        </section>
        <!-- 游戏 -->
        <section style="margin-left:20px">
          <el-select v-model="gameListIndex" @change="changeGame(gameListIndex)" style="width: 200px; height:40px">
            <el-option
              v-for="(item) in $$gameList"
              :key="item.app_id"
              :label="item.app_name"
              :value="item.app_id"
            ></el-option>
          </el-select>
        </section>
        <!-- 比例 -->
        <section style="margin-left:20px;display:flex">
          <span style="width: 40px;line-height: 40px;">比例&nbsp;:</span>
          <input v-model="proportion" type='number' class="number"  placeholder="请输入小数" />
        </section>
        <!-- 添加 -->
        <el-button size="medium" class="search" @click="addData()" style="margin-left:20px">添加</el-button>
      </div>
    </my-row>
    <!-- 移除对话框 -->
    <el-dialog
        title="移除数据提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        :before-close="Undelete"
        center>
        <span>该操作具有一定风险,你确认继续吗?</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="Undelete">取 消</el-button>
            <el-button type="danger" @click="confirmDeletion">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 表格 -->
      <div v-show="$store.state.o_r_delivery.tableIsVisible" class="table-item">
        <el-table
          class="tb-edit"
          border
          :header-cell-style="{background:'#f2f2f2'}"
          :data="$store.getters['o_c_divided_into/getTableData']"
          @cell-dblclick='handleCellClick'
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            v-for="(item, i) in (Object.keys($store.getters['o_c_divided_into/getTableData'].length?$store.getters['o_c_divided_into/getTableData'][0]:[]))"
            :key="i"
            :sortable="i>3"
            :prop="item"
            :label="item"
            :width="i==4 ? 280:''"
            v-if="(i>2 && i<5)"
          >
          </el-table-column>
          <el-table-column
            v-for="(item, i) in (Object.keys($store.getters['o_c_divided_into/getTableData'].length?$store.getters['o_c_divided_into/getTableData'][0]:[]))"
            :key="i"
            :sortable="i==5"
            :prop="item"
            :label="item"
            :width="i==4 ? 280:''"
            v-if="i==5"
          >
          <template slot-scope="scope">
                <el-input v-show="activityIndex == scope.$index" size="small" autofocus type="text" placeholder="请输入小数"
                v-model="$store.getters['o_c_divided_into/getTableData'][scope.$index][item]" 
                @blur="blurInput(scope.$index)"
                ></el-input> 
                <span v-show="activityIndex != scope.$index">{{$store.getters['o_c_divided_into/getTableData'][scope.$index][item]}}</span>
            </template>
          </el-table-column>
           <el-table-column
            v-if="$store.getters['o_c_divided_into/getTableData'].length!=0"
            label="操作"
            width="160">
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
export default {
  data() {
    return {
      gameListIndex:'',  
      date: '',         //日期
      proportion:'',    //比例
      delIndex:0,      //del下标
      activityIndex:-1,
      centerDialogVisible:false,

    }
  },
  computed:{
     $$gameList() {
      return this.$store.getters["o_c_divided_into/getGameList"];
    },
    $$getTableData(){
      return this.$store.getters["o_c_divided_into/getTableData"];
    },
    _state() {
      return this.$store.state.o_c_divided_into;
    },
  },
  created() {
    this.dataInit();
    // 获取渠道列表,
    if (!this._state.gameList.length) this.getData('gameList','');
  },
  watch: {
      date(data){
        this.$store.commit("o_c_divided_into/setDate",  moment(data).add(0, "day").format("YYYY-MM-DD"));
      },
      // 比例
      proportion(data){
        this.$store.commit("o_c_divided_into/setProportion",  data.format(4));
      }
  },
  methods:{
      //分成比例修改   
      blurInput(index){
        this.activityIndex = -1
      },
      //添加行的索引值   
      tableRowClassName({row, rowIndex}) {
        row.index = rowIndex;
        return '';
      },
     // 双击修改分成比例  
      handleCellClick(row, column, cell, event){
          var {label} = column;
          console.log('row[column.property]',String(row[column.property] ))
          if (label == '分成比例') {
              if (String(row[column.property]).indexOf("%")>=0) {
                this.$store.getters['o_c_divided_into/getTableData'][row.index]['分成比例'] = parseInt(''+this.$store.getters['o_c_divided_into/getTableData'][row.index]['分成比例'])/100
              }
              this.activityIndex = row.index
          }
      },
    // 切换游戏
    changeGame(index){
        this.$store.commit("o_c_divided_into/setGameListIndex",  index);
        this.getData('dividedInto',2)
    },
    //删除数据
    deleteRow(index,data){
        this.delIndex = this.$store.getters['o_c_divided_into/getTableData'][index]['序号']
        this.centerDialogVisible = true;
    },
    // 确认删除
    confirmDeletion(){
        this.getData('dividedInto',4);
        this.centerDialogVisible = false;
    },
    // 取消删除
    Undelete(){
        this.centerDialogVisible = false;
        this.delIndex = 0;
    },
    // 修改数据
    changeRow(index){
        if (!this.$store.getters['o_c_divided_into/getTableData'][index]['分成比例']) {
            Utils.Notification.warning({
                message: '请将分成比例填写完整'
            })
            return
        }
        if (this.activityIndex<0) {
            return Utils.Notification.warning({message: '请先选择修改的内容'})
        }
        var params = {
          in_count_date: this._state.date,       //开始日期
          in_app_id: this._state.gameListIndex,  //游戏id
          in_percent:this.$store.getters['o_c_divided_into/getTableData'][index]['分成比例'],     //分成比例
          in_id:this.$store.getters['o_c_divided_into/getTableData'][index]['序号'],                    //分成比例序号(删除传参)
          in_operator_type:5,                //查询类型(1:游戏列表,2:查询分成比例,3:新增分成比例,4:删除)
        };
        this.$store.dispatch("o_c_divided_into/getReportInfo", { params, tag: 'dividedInto' }).then(()=>{
            this.activityIndex = -1;
        })
    },
    //添加数据
    addData(){
         if (!this.date || !this.gameListIndex || !this.proportion) {
          Utils.Notification.warning({
              message: '请将添加信息填写完整'
          })
          return
        }else if (this.$store.getters['o_c_divided_into/getTableData'][0] && this.$store.getters['o_c_divided_into/getTableData'][0]['最后录入时间']) {
            var lastTime = new Date(this.$store.getters['o_c_divided_into/getTableData'][0]['最后录入时间']).getTime() ;
            var newTime = new Date(this.date).getTime();
            if (newTime <= lastTime) {
                Utils.Notification.warning({
                    message: '当前补充时间小于或等于最后录入时间,请重新选择'
                })
                return
            }
        }
        if(this.proportion <= 0 || this.proportion>1){
                Utils.Notification.warning({
                    message: '当前分成比例填写错误,请重新输入'
                })
                return
        }
        this.getData('dividedInto',3)
    },
    // 更新数据
    getData(tag,index) {
      if (tag == 'gameList') {
        // 获取渠道
        var params = {
          in_count_date: '2019-01-01',       //开始日期
          in_app_id: 0,                     //游戏id
          in_percent:0.00,                   //分成比例
          in_id:0,                           //分成比例序号(删除传参)
          in_operator_type:1,                //查询类型(1:游戏列表,2:查询分成比例,3:新增分成比例,4:删除)
        };
      } else {
        // 获取数据
        var params = {
          in_count_date: this._state.date,       //开始日期
          in_app_id: this._state.gameListIndex,  //游戏id
          in_percent:+this._state.proportion,     //分成比例
          in_id:this.delIndex,                    //分成比例序号(删除传参)
          in_operator_type:index,                //查询类型(1:游戏列表,2:查询分成比例,3:新增分成比例,4:删除)
        };
      }
      this.$store.dispatch("o_c_divided_into/getReportInfo", { params, tag: tag })
    },
    // 初始化
    dataInit() {
      // 日期初始化
      if (this._state.date) {
        this.date = this._state.date;
      } else {
        this.date = moment().add(-1, "day").format("YYYY-MM-DD")
      }
      //分成比例
        // if (this._state.proportion) {
        //     this.proportion = this._state.proportion
        // }else{
        //     this.proportion = ''
        // }
      // 游戏下拉框初始化
      if (this._state.gameListIndex) {
        this.gameListIndex = this._state.gameListIndex;
      } else {
        this.gameListIndex = ' ';
      }
    },
  }
}
</script>
<style lang="scss" scoped>

input[type=number] {
    -moz-appearance:textfield;
}
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.banner {
  width: 100%;
  display: flex;
  justify-content: start;
  // border: 1px solid;
  .mail{
    display: flex;
    justify-content: flex-end;
    flex-grow: 1;
    margin: 0px 10px 0 0;
  }
  .number{
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    color: #606266;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    width: 100px;
  }
}

.table-item{
  border: 15px solid #e7e1ea;
  width: 750px;
  height: auto;
  margin: 20px;
}
</style>

