const app = getApp();
Component({
  mixins: [],
  data: {
    weekcount:['日','一','二','三','四','五','六'],
    months:[],
    sel:{
      begin:{act:false,year:0,month:0,day:0,mi:0,di:0},
      end:{act:false,year:0,month:0,day:0,mi:0,di:0}
    }
  },
  props: {
    onSelectEvent:()=>{},
    show:false,
    limit:10,
    price:'',
    num:1
  },
  didMount() {
    var year = new Date().getFullYear();
    var month = new Date().getMonth() +1;
    this.addMonth(year,month);
    this.pushMonth();
    this.pushMonth();
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    addMonth(year,month){ // 月自动增加
      let obj = {days:[],year:year,month:month};
      var week = new Date(year,(month-1),1).getDay();// 获取当月的第一天的星期数
      for (var i = 0; i < week; i++){
        obj.days.push({day: '', disabled:true ,cls: '',act:false,label:''});
      }
      var actDay = this.data.sel.begin.act==false || this.props.price == '' ?null:new Date(this.data.sel.begin.year,this.data.sel.begin.month,this.data.sel.begin.day);
      for(var i = 1 ;i <= this.getDaysCont(year,month);i++){
        var gaps = this.nowDays(year,month,i);
        var cls = gaps < 0 ? 'disabled' : '';
        obj.days.push({cls:cls,disabled:(gaps<0),day:(gaps == 0?"今":i),act:false,label:''});
      }
      this.setData({months:this.data.months.concat(obj)});
    },
    getDaysCont(year,month){ // 获取月份的最大天数
      var leapYear = ((year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)) ? 1:0;
      return [31, 28 + leapYear, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month-1];
    },
    dayToLowerEvent(e){ // 滚动到底部时
      this.pushMonth();
    },
    pushMonth(){
      var lastMonth = this.data.months[this.data.months.length -1];
      let year = lastMonth.year;
      let month = lastMonth.month + 1;
      if(month > 12){
        year = year +1;
        month = 1;
      }
      this.addMonth(year,month);
    },
    nowDays(year,month,day){
      var now = new Date();
      var tow = new Date(year, month-1, day);
      return this.comDays(now,tow);
    },
    comDays(begin,end){
      begin.setHours(0,0,0,0);
      end.setHours(0,0,0,0);
      var times = end.getTime() - begin.getTime();
      return times/(1000 * 60 * 60 *24);
    },
    setDayEvent(e){
      var monthIndex = e.currentTarget.dataset.monthIndex;
      var index = e.currentTarget.dataset.index;
      var month = this.data.months[monthIndex];
      var day = month.days[index];
      if(day.disabled){return;} // 禁用日期不可点击
      if(this.data.sel.begin.act && this.data.sel.end.act){// 开始，结束日期都选择了，则清空
        let update = {sel:{begin:{act:false,year:0,month:0,day:0,mi:0,di:0},end:{act:false,year:0,month:0,day:0,mi:0,di:0}}};
        for(var i = 0 ; i < this.data.months.length; i ++){
          for(var j = 0 ; j < this.data.months[i].days.length; j ++){
            if(this.data.months[i].days[j].act){
              this.setDayinfo(update,i,j,'',false,'');
            }
          }
        }
        this.setData(update);
        return;
      }
      let selObj = {act:true,year:month.year,month:month.month,day:day.day,mi:monthIndex,di:index};
      if(this.data.sel.begin.act == false){ //选择开始日期
        let update = {'sel.begin':selObj};
        this.setDayinfo(update,monthIndex,index,'day-select day-first',true,'开始');
        this.setData(update);
        return;
      }
      let lmitDay = this.selDayGaps(this.data.sel.begin,selObj); // 计算2个日期间隔天数
      if(Math.abs(lmitDay) < this.props.limit){
        my.showToast({type:'fail',content:('最少选择'+this.props.limit+'天')});
        return;
      }
      let update = {sel:{begin:this.data.sel.begin,end:selObj}};
      if(lmitDay < 0){ // 开始结束日期对换
        update.sel.begin = selObj;
        update.sel.end = this.data.sel.begin;
      }
      // 选择结束日期
      let isfirst = true;
      var alldays = 0;
      for(var i = update.sel.begin.mi; i <= update.sel.end.mi;i ++){
        let begin = 0;
        let end = this.data.months[i].days.length - 1;
        if(i == update.sel.begin.mi){ // 开始月
          begin = update.sel.begin.di;
        }
        if(i == update.sel.end.mi){ // 结束月
          end = update.sel.end.di;
        }
        let isend = (i == update.sel.end.mi);
        for(var j = begin ; j <= end; j ++){
          if(this.data.months[i].days[j].disabled){continue;}
          let typeStr = isfirst?'开始':'';
          if(isend && j == end){
            typeStr = '结束';
          }
          alldays += 1;
          this.setDayinfo(update,i,j,('day-select'+(isfirst?' day-first':'')),true,typeStr);
          isfirst = false;
        }
      }
      this.setData(update);
    },
    setDayinfo(obj,mindex,dindex,cls,act,type){
        obj['months['+mindex+'].days['+dindex+"].cls"] = cls; //'day-select day-end';
        obj['months['+mindex+'].days[' + dindex + '].act'] = act; // true;
        obj['months['+mindex+'].days[' + dindex + '].label'] = type; // 'gui';
    },
    selDayGaps(begin,end){
      let bd = new Date(begin.year,begin.month - 1,begin.day);
      let ed = new Date(end.year,end.month - 1,end.day);
      return this.comDays(bd,ed);
    },
    selectEvent(e){
      if(this.data.sel.begin.act == false || this.data.sel.end.act == false){return;}
      var beginDay = this.getBeginDay(this.data.sel.begin);
      let bd = new Date(this.data.sel.begin.year,this.data.sel.begin.month - 1,beginDay);
      let ed = new Date(this.data.sel.end.year,this.data.sel.end.month - 1,this.data.sel.end.day);
      let ret = {
        begin:this.getformatData(this.data.sel.begin),
        end:this.getformatData(this.data.sel.end),
        beginWeek:bd.getDay(),
        endWeek:ed.getDay(),
        beginShow:(this.data.sel.begin.month+'月'+beginDay+'日'),
        endShow:(this.data.sel.end.month+'月'+this.data.sel.end.day+'日')
      };
      this.props.onSelectEvent(ret);
    },
    getformatData(sel){
      var day = this.getBeginDay(sel);
      return sel.year+"-"+(sel.month <= 9?('0'+sel.month):sel.month)+"-"+(day <= 9 ? ('0'+day):day);
    },
    getBeginDay(sel){
      var day = sel.day;
      if(sel.day == '今'){
          day = new Date().getDate();
      }
      return day;
    }
  }
});
