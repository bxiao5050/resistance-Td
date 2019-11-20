<template>
  <div class="module-header">    
    <div class="switch-group">
      <div class="switchs-item" v-for="(item,index) in dateList" :key="index">
        <span class="item-header">{{item.label}}:</span>
        <div class="item-type" v-if="item.isShowDatetype">
          <select class="form-control item-type-select" v-model="datetype">
            <option :value="item.id" v-for="(item,index) in types" :key="index">{{item.name}}</option>
          </select>
        </div>
        <!-- <div class="item-content" v-if="item.isShowDatetype">
          <div class="bt-item" :class="{'check':datetype===item.id}" v-for="(item,index) in types" @click="datetype=item.id" :key="index">{{item.name}}</div>
        </div> -->
        <datepicker class="item-input" :class="{'item-input-range':!item.single}" :daypicker="daypicker" :uid="item.uid" :date="{startDate:item.startDate,endDate:item.endDate}" :single="item.single" :changeDate="item.change"></datepicker>
        <slot name="after-datepicker"></slot>
      </div>
    </div>

    <div class="switch-group" v-if="isShowReg">
      <div class="switchs-item">
        <span class="item-header">{{$t('common.RegChannel')}}:</span>
        <regtrigger class="item-input"></regtrigger>
      </div>
      <div class="switchs-item" v-if="isShowPay">
        <span class="item-header">{{$t('common.PayChannel')}}:</span>
        <paytrigger class="item-input"></paytrigger>
      </div>
    </div>
    <div v-if="isShowSelect==1">
      <span style="padding-left: 45px;">请选择充值金额</span>
      <el-select
          v-model="value1"
          size="small"
          @change="changeMoney"
          filterable
          allow-create
          default-first-option
          placeholder="请选择充值金额">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
      </el-select>
    </div>
    <div v-if="isShowSelect==2">
      <span style="padding-left: 45px;">请选择充值金额</span>
      <el-select
        v-model="value2"
        size="small"
        @change="changeMoney"
        filterable
        allow-create
        default-first-option
        placeholder="请选择充值金额">
        <el-option
          v-for="item in options2"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    
  </div>
</template>

<script>
  import datepicker from "src/components/datepicker"
  import regtrigger from 'modules/channel/register/components/trigger'
  import paytrigger from 'modules/channel/payment/components/trigger'

  export default {
    name: 'module-header',
    components: {
      datepicker,
      regtrigger,
      paytrigger
    },
    props: {
      isShowReg: Boolean,
      isShowPay: Boolean,
      isShowSelect:Number,
      daypicker: Function,
      dayselect: Function,
      changeMoney:Function,
      // header: {
      //   type: Object,
      //   default: () => {
      //     return {
      //       title: '未定义模块名', //菜单模块标题
      //       definedContent: '', //自定义内容
      //       isShowIndex: false, //是否显示指标说明
      //     }
      //   }
      // },
      dateList: {
        type: Array,
        default: () => {
          return [{
            single: true, //是否为单日期组件
            uid: 'date1', //生成的日期组件唯一标识
            label: this.$t('common.Date'), //日期label说明
            startDate: moment().format('YYYY-MM-DD'), //开始日期
            endDate: '', //结束日期(当组件为单日期组件时传空值)
            isShowDatetype: false,
            change: (newDate) => console.log(newDate) //日期变化回调
          }]
        }
      }
    },
    data() {
      return {
        datetype: 1,
        types: [{
          id: 1,
          name: this.$t('common.Day')
        }, {
          id: 2,
          name: this.$t('common.Week')
        }, {
          id: 3,
          name: this.$t('common.Month')
        }, ],
        isShowTip: false,
        options1: [{
          value: '100',
          label: '100'
        }, {
          value: '200',
          label: '200'
        }, {
          value: '300',
          label: '300'
        }, {
          value: '500',
          label: '500'
        }, {
          value: '1000',
          label: '1000'
        }, {
          value: '2000',
          label: '2000'
        }, {
          value: '5000',
          label: '5000'
        }, {
          value: '10000',
          label: '10000'
        }],
        options2: [{
          value: '2000',
          label: '2000'
        }, {
          value: '3000',
          label: '3000'
        }, {
          value: '4000',
          label: '4000'
        }, {
          value: '5000',
          label: '5000'
        }, {
          value: '10000',
          label: '10000'
        }, {
          value: '20000',
          label: '20000'
        }, {
          value: '50000',
          label: '50000'
        }, {
          value: '100000',
          label: '100000'
        }],
        value1: '100',
        value2: '2000',
      }
    },
    watch: {
      datetype(v, ov) {
        if (v != ov) {
          this.$emit('datetypeChange', v)
        }
      }
    },
    
  }
</script>

<style lang="scss" scoped>
  .module-header {
    display: flex;
    font-size: 13px;
    padding: 18px 0 0 0;
    flex-wrap: wrap;
    background-color: #FFF;
    .switch-group {
      margin-bottom: 12px;
      display: flex;
      .switchs-item {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        .item-header {
          display: flex;
          align-items: center;
          margin-left: 17px;
          margin-right: 15px;
          flex-shrink: 0;
        }
        .item-content {
          margin-right: 15px;
          float: left;
          line-height: 30px;
          .bt-item {
            cursor: pointer;
            padding: 0 15px;
            float: left;
            background-color: #fff;
            border: 1px solid #ddd;
            border-right: 0;
            text-align: center;
            &:last-child {
              border-right: 1px solid #ddd;
            }
          }
          .bt-item.check {
            font-weight: 700;
            color: #fff;
            background-color: #fc9153;
            border: 1px solid #fc9153;
          }
        }
      }
    }
    select {
      height: 32px !important;
      /* line-height: 32px; */
      padding: 0px 0px 0 8px;
      box-sizing: border-box;
      border-right: 0;
    }
  }
</style>