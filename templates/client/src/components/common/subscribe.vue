<template>
  <div class="subscribe-time" v-show="setting.display">
    <div class="subscribe-content">
      <div class="subscribe-date" v-if="setting.dateBlock == true">
        <div class="subscribe-date-scroll">
          <div class="subscribe-date-list" @tap="selectDate(index,'dateList')" :class="item.is_active == true ? 'subscribe-date-list-active' : ''" v-for="(item,index) in dateList">{{item.date}}</div>
          </div>
      </div>
      <div class="subscribe-scroll" :class="setting.dateBlock == false ? 'subscribe-time-list-width' : ''">
        <div class="subscribe-time">
            <div class="subscribe-time-list" @tap="selectDate(index,'timeList')" :class="item.is_active == true ? 'subscribe-time-list-active' : ''" v-for="(item,index) in timeList">{{item.date}}</div>
        </div>
      </div>
      <div class="subscribe-cancel" @click="elementDisplay">取消</div>
    </div>
    <div class="mast" @click="elementDisplay"></div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: 'SubscribeTime',
  data () {
    return {
      timeList:[],
      dateList:[],
      reduce:"-",
      colon:":",
      space:" ",
      selectTime:{}
    }
  },
  props:{
    setting:{},    
  },
  methods: {
    elementDisplay: function () {
      this.setting['display'] = false;
    },
    getTimeList: function () {
      // let nowYMD = this.getYearMonthDate();
      // let nowTime = this.timestampToTime();
      // let YMD = this.timestampToTime(this.getTimestamp());

      // 算出选择了那个日期
      for(let i = 0; i < this.dateList.length; i++){
        if(this.dateList[i]['is_active']){
          var activeIndex = i;
        }

      }

      if(this.timeList.length > 0){
        this.timeList = [];
      }
      // 日期
      let startTime = this.getYearMonthDate() + this.space + this.setting.startTime;
      let endTime= this.getYearMonthDate() + this.space + this.setting.endTime;
      let nowTime = this.getYearMonthDate() + this.space + this.timestampToTime();
      // 日期时间戳
      let startTimestamp = Math.round(new Date((this.getYearMonthDate() + this.space + this.setting.startTime).replace(/-/g,"/")) / 1000);
      let endTimestamp=  Math.round(new Date((this.getYearMonthDate() + this.space + this.setting.endTime).replace(/-/g,"/")) / 1000);
      let nowTimestamp = this.getTimestamp();

      // 判断结束时间是否小于开始时间，那样就是第二天了
      if(endTimestamp < startTimestamp){
        endTimestamp = Math.round(new Date((this.getYearMonthDate(1) + this.space + this.setting.endTime).replace(/-/g,"/")) / 1000);
      }
      // 判断当前日期是否大于开始时间
      if(nowTimestamp > startTimestamp){
        // 获取到加完20分钟后的时间戳，判断是否大于当前结束时间
        var lastNumber = this.timestampToTime().substring(4);
        // 需要添加的分钟
        var moreTime = 10 - parseInt(lastNumber);
        // 添加后的时间戳
        var addTime = this.getTimestamp() + 60 * moreTime;
      }else{
        // 获取到加完20分钟后的时间戳，判断是否大于当前结束时间
        var lastNumber = startTime.substring(4);
        // 需要添加的分钟
        var moreTime = 10 - parseInt(lastNumber);
        // 添加后的时间戳
        var addTime = startTimestamp + 60 * moreTime;
      }

      let argument = {
        startTime: startTime,
        endTime: endTime,
        nowTime: nowTime,
        startTimestamp: startTimestamp,
        endTimestamp: endTimestamp,
        nowTimestamp: nowTimestamp,
        addTime: addTime,
        moreTime: moreTime,
        activeIndex: activeIndex
      }

      if(this.dateList[0]['is_active']){
        this.timeAlgorithm(argument);
      }else{
        this.timeAlgorithm(argument);
      }

      this.$nextTick(() => {
        let timeScroll = new BScroll('.subscribe-scroll',{
            scrollY: true,
            tap:"selectDate,elementDisplay"
        });
      })
    },
    timeAlgorithm: function (params) {
      let restrainTime1 = params['addTime'] + 60 * this.setting.interval;
      let restrainTime2 = params['endTimestamp'] - 60 * this.setting.interval;
      // 判断是不是大于最后的可以接单的时间
      if(restrainTime1 < restrainTime2){
        params['addTime'] = params['addTime'] + 60 * this.setting.interval;
        // 算出选择了那个日期的时间戳和日期
        params['setAddTime'] = params['addTime'] + (60 * this.setting.interval) + (24 * 60 * 60 * params['activeIndex']) - 60 * this.setting.interval;
        // 一开始第一个高亮
        let is_active = (this.setting.defaultTime &&  this.timeList.length == 0) ? true : false;
        // 把获取到的时间push进去
        this.timeList.push({
          is_active:is_active,
          date:this.timestampToTime(params['addTime'],true),
          picker:this.timestampToTime(params['setAddTime']),
          timestamp:params['setAddTime']
        });
        // console.log(this.timestampToTime(params['addTime']));
        this.timeAlgorithm(params);
      }
    },
    getTimestamp: function (){
      // 获取当前时间戳
      let date = new Date();
      let year = date.getFullYear() + this.reduce + this.addZero(date.getMonth() + 1) + this.reduce + this.addZero(date.getDate());
      let currentdate = this.addZero(date.getHours()) + this.colon + this.addZero(date.getMinutes());
      let timestamp = Math.round(new Date((year + this.space +currentdate).replace(/-/g,"/")) / 1000);
      return timestamp;
    },
    timestampToTime: function (timestamp,bool) {
      // 获取当前时分或日期 格式: 15:30 或 2018-06-08 15:30
      let date = '';

      if(timestamp){
        date = new Date(timestamp * 1000);
      }else{
        date = new Date();
      }

      let year = date.getFullYear() + this.reduce + this.addZero(date.getMonth() + 1) + this.reduce + this.addZero(date.getDate());
      let currentdate = this.addZero(date.getHours()) + this.colon + this.addZero(date.getMinutes());
      // 返回时分或返回年月日
      if(timestamp && !bool){
        return year + this.space + currentdate;
      }else{
        return currentdate;
      }     
    },
    getYearMonthDate: function (number) {
      // 获取年月日
      let date = new Date();
      if(number){
        // 设置多少天的日期
        date.setTime(date.getTime() + (24 * 60 * 60 * 1000) * number);
      }      
      let year = date.getFullYear() + this.reduce + this.addZero(date.getMonth() + 1) + this.reduce + this.addZero(date.getDate());
      return year;
    },
    getDateList: function (len) {
      if(this.dateList.length > 0){
        this.dateList = [];
      }
      for(let i = 0; i < len; i++){
        let date = new Date();
        date.setTime(date.getTime() + (24 * 60 * 60 * 1000) * i);
        let currentdate = this.addZero(date.getMonth() + 1) + this.reduce + this.addZero(date.getDate());
        this.dateList.push({
          is_active: i == 0 ? true : false,
          date:currentdate
        });
      }

      this.$nextTick(() => {
        if(this.setting.dateBlock){
          let dateScroll = new BScroll('.subscribe-date',{
              scrollY: true,
              tap:"selectDate,elementDisplay"
          });
        }       
      })
    },
    addZero: function (time) {
      if (time <= 9) {
          time = "0" + time;
      }
      return time;
    },
    selectDate: function (index,name) {
      for(let i = 0; i < this[name].length; i++){
        this.$set(this[name][i], 'is_active', false);
      }
      this.$set(this[name][index], 'is_active', true);
      if(name == 'dateList'){
        this.getTimeList();
        console.dir(this.timeList);
      }else if(name == 'timeList'){
        // this.$emit('confirmEvent',this[name][index]);
        this.selectTime = this[name][index];
        this.$emit("update:selectTime", this.selectTime);
        this.elementDisplay();
      }
      console.dir(this.dateList);
    },
    defaultTime: function () {
      if(this.setting.defaultTime){
        // 防止返回的时候，默认选择第一个，下单完成清除掉
        if(sessionStorage.date){
          this.selectTime = {
            date:sessionStorage.date,
            picker:sessionStorage.picker
          };
          this.$emit("update:selectTime", this.selectTime);
        }else{
          console.dir(this.selectTime);
          this.selectTime = this.timeList[0];
          this.$emit("update:selectTime", this.selectTime);
        }        
      }
    }  
  },
  mounted: function () {
    this.getDateList(this.setting.dateLength);
    this.getTimeList();
    this.defaultTime();
  },
  computed: {

  },
  watch: {
    setting: {  
　　　　handler(newValue, oldValue) {
            if(newValue.display){
              this.getDateList(this.setting.dateLength);
              this.getTimeList();
              // 默认选中
              if(this.selectTime.date != ''){
                for(let i = 0; i < this.timeList.length; i++){
                  if(this.selectTime.date == this.timeList[i]['date']){
                    this.$set(this['timeList'][i], 'is_active', true);
                  }else{
                    this.$set(this['timeList'][i], 'is_active', false);
                  }
                }
              }
              console.dir(this.selectTime);
            }               
　　　　},  
　　　　deep: true  
　　} 
  },
  components: {

  }
}
</script>
<style scoped>
/*.table-scroll{
  overflow: hidden;
  height: 100%;
}
.table-scroll .table-list{
  width: 100%;
  padding-bottom: 10px;
}*/

.subscribe-content{
  height: 250px;
  width: 100%;
  background: #fff;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 1003;
}
.subscribe-content .subscribe-date{
  width: 35%;
  height: 210px;
  background: #e7e7e7;
  overflow: hidden;
  /*overflow: scroll;*/
}
.subscribe-content .subscribe-scroll{
  width: 65%;
  height: 210px;
}
.subscribe-date{
  /*float: left;*/
  overflow: scroll;
  position: absolute;
  top: 0;
  left: 0;
}
.subscribe-scroll{
  position: absolute;
  top: 0;
  left: 35%;
  overflow: hidden;
}
/*.subscribe-content:after{
  content: "";
  width: 0;
  height: 0;
  display: block;
  visibility: hidden;
  clear: both;
}*/
/*日期*/
.subscribe-date-list{
  height: 42px;
  line-height: 42px;
  border-bottom: 1px solid #fff;
  font-size: 14px;
  text-align: center;
  color: #333;
}
.subscribe-date-list:last-child{
  border-bottom: none;
}
.subscribe-date-list-active{
  background: #fff;
  color: #ff6600;
}
/*时间*/
.subscribe-time{

}
.subscribe-time-list{
  width: 100%;
  height: 35px;
  line-height: 35px;
  padding-left: 20px;
  font-size: 14px;
  color: #666;
}
.subscribe-time-list-active{
  color: #ff6600;
}
/*取消按钮*/
.subscribe-content .subscribe-cancel{
  width: 100%;
  height: 39px;
  line-height: 40px;
  border-top: 1px solid #ccc;
  text-align: center;
  font-size: 14px;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 1003;
}
/*遮罩层*/
.mast{
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  /*background: rgba(0, 0, 0.3);*/
  background: #000;
  z-index:1002;
}
.subscribe-content .subscribe-time-list-width{
  width: 100%!important;
  left:0;
  padding: 0;
  text-align: center;
}
.subscribe-time-list-width .subscribe-time{
  width: 100%;
}
.subscribe-time-list-width .subscribe-time-list{
  padding-left: 0px;
}
</style>