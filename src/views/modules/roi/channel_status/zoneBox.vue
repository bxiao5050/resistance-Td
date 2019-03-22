<template>
    <div>
        <section class="zoneBox">
            <!-- 地区 -->
            <div class="areaBox">
                <span>选择地区(单选):</span>
                <div class="areaList">
                    <el-button
                        :class="[areaActiveIndex==index?'active':'']"
                        v-for="(item,index) in  $$zoneList.areaNameArr"
                        :key="index"
                        @click="changeArea(index)"
                    >{{item}}</el-button>
                </div>
            </div>
            <!-- 渠道 -->
            <div class="channelBox">
                <span>选择代理商(单选):</span>
                <div class="areaList">
                    <el-button
                        :class="[channelActiveIndex==index?'active':'']"
                        v-for="(item,index) in  $$zoneList.channelArr[this.areaActiveIndex]"
                        :key="index"
                        @click="changeChannel(index)"
                    >{{item}}</el-button>
                </div>
            </div>
            <!-- 区服 -->
            <div class="zone">
                <span>选择区服(单选):</span>
                <div class="zoneList">
                    <el-button
                        :class="[zoneActivityIndex==index?'active':'']"
                        v-for="(item,index) in  $$zoneList.zoneNameArr[this.areaActiveIndex]?$$zoneList.zoneNameArr[this.areaActiveIndex][this.channelActiveIndex]:[]"
                        :key="index"
                        @click="changeZone(index)"
                    >{{item.name}}</el-button>
                </div>
            </div>
        </section>
        <el-button style="float:right;margin:0 20px" @click="close">关闭窗口</el-button>
        <el-button style="float:right" @click="changeBtn">确认修改</el-button>
    </div>
</template>
<script>
export default {
    data(){
        return{
            areaActiveIndex:0,
            channelActiveIndex:-1,
            zoneActivityIndex:-1,
        }
    },
    computed:{
         _state() {
            return this.$store.state.o_r_channel_status;
        },
        $$zoneList(){
            var data = this.$store.getters["o_r_channel_status/getZoneList"]; 
            if (data && data.zoneNameArr.length) {
                this.dataInit()
            }
            return data
        }
    },
    created(){
        if (this._state.gameID) {
           this.dataInit()
        }
    },
    methods: {
        close(){
            this.$store.commit("o_r_channel_status/setVisibleZone",false)
            this.dataInit()
            
        },
        changeBtn(){
            this.$store.commit("o_r_channel_status/setVisibleZone",false)
            this.$store.commit('o_r_channel_status/setAreaActiveIndex',this.areaActiveIndex)
            this.$store.commit('o_r_channel_status/setChannelActiveIndex',this.channelActiveIndex)
            this.$store.commit('o_r_channel_status/setZoneActivityIndex',this.zoneActivityIndex)
            if (this.zoneActivityIndex>=0) {                
                this.$store.commit('o_r_channel_status/setZoneID',this.$$zoneList.zoneNameArr[this.areaActiveIndex][this.channelActiveIndex][this.zoneActivityIndex].zoneId)
                this.$store.commit('o_r_channel_status/setZoneName',this.$$zoneList.zoneNameArr[this.areaActiveIndex][this.channelActiveIndex][this.zoneActivityIndex].name)
            }else{
                this.$store.commit('o_r_channel_status/setZoneID', ' ')
                if (this.channelActiveIndex>=0) {
                    this.$store.commit('o_r_channel_status/setZoneName',this.$$zoneList.channelArr[this.areaActiveIndex][this.channelActiveIndex])
                }else{
                    this.$store.commit('o_r_channel_status/setZoneName',this.$$zoneList.areaNameArr[this.areaActiveIndex])
                }
            }
        },
        changeArea(index){
            this.areaActiveIndex = index;
            this.channelActiveIndex = -1;
            this.zoneActivityIndex = -1;
        },
        changeChannel(index){
            this.channelActiveIndex = index;
            this.zoneActivityIndex = -1;
        },
        changeZone(index){
            this.zoneActivityIndex = index;
        },
        dataInit(){
            if (this._state.areaActiveIndex>=0) {
                this.areaActiveIndex = this._state.areaActiveIndex
            }else{
                this.areaActiveIndex = 0
            }
            if (this._state.channelActiveIndex>=0) {
                this.channelActiveIndex = this._state.channelActiveIndex
            }else{
                this.channelActiveIndex = -1
            }
            if (this._state.zoneActivityIndex>=0) {
                this.zoneActivityIndex = this._state.zoneActivityIndex
            }else{
                this.zoneActivityIndex = -1
            }
            
        }
    },
}
</script>
<style lang="scss" scoped>
.zoneBox{
    width: 99%;
    height: 500px;
    margin: 10px;
    // display: flex;
    // justify-content: flex-start;
    border: 15px solid #e7E1Ea;
    .areaBox,
    .channelBox,{
        width: 100%;
        height: 85px;
        padding: 10px;
        display: flex;
        justify-content: flex-start;
        border-bottom: 15px solid #e7e1ea;
        span{
            display: inline-block;
            min-width: 120px;
            height: 50px;
            line-height: 50px;
            text-align: center;
        }
        .areaList{
            display: flex;
            overflow: auto;
        }
    }
    .zone{
         width: 100%;
        height: 300px;
        padding: 10px;
        overflow: auto;
         display: flex;
        justify-content: flex-start;
        border-bottom: 1px solid #e7e1ea;
         span{
            display: inline-block;
            min-width: 120px;
            height: 50px;
            line-height: 50px;
            text-align: center;
        }
        button{
            margin: 5px;
        }
    }
}
.active{
      color: white;
      background: #5b5691;
  }
</style>

