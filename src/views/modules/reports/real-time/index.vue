<template>
  <div class="daiding">
    <div class="banner">
      <section>
        <span>选择时间：</span>
        <el-date-picker
            v-model="time"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
      </section>
      <section>
        <span style="min-width:40px">系统</span>
        <el-select class="os" v-model="os" size="medium">
          <el-option v-for="(item) in options" :key="item.value" :label="item.label" :value="item.os"></el-option>
        </el-select>
      </section>
      </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      time:"",
      os: '01',
      options: [{
        os: '01',
        label: '全部'
      },{
        os: '0',
        label: 'IOS'
      }, {
        os: '1',
        label: '安卓'
      }],
    }
  },
  // data: () => {
  //   return {
  //     data: {
  //       isShow: false,
  //       region: null,
  //       game: null,
  //       regionArr: [],
  //       gameArr: [],
  //     },
  //   }
  // },
  computed: {
    _rcg() {
      var str = ''
      if (this.data.region) {
        str += this.data.region
        if (this.data.game) {
          str += ' - ' + this.data.game
        } else {
          str += ' - ' + '全部游戏'
        }
      }
      return str
    }
  },
  methods: {
    dataInit() {

    }
  },
  created() {
    this.dataInit()
  }
}
</script>

<style lang="scss" scoped>
.banner{
  width: 100%;
  display: flex;
  justify-content: space-between;
  border: 1px solid;
}
</style>


