var Time = {
    getUnix: function(){
        var date = new Date();
        return date.getTime();
    },
    getTodayUnix: function(){
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date.getTime();
    },
    getYearUnix: function(){
        var date = new Date();
        date.setMonth(1);
        date.setDate(1);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date.getTime();
    },
    getLastDate: function(time){
        var date = new Date(time);
        var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() + 1 < 10 ? '0' + (date.getDate() + 1) : date.getDate() + 1;
        return date.getFullYear() + '-' + month + '-' + day
    },
    getFormatTime: function(timestamp){
        var now = this.getUnix();
        var today = this.getTodayUnix();
        var year = this.getYearUnix();
        var timer = (now - timestamp) / 1000; //转换成秒
        var tip = '';
        if(timer <= 0){
            tip = '刚刚';
        }else if(timer <= 60){  //一分钟内
            tip = '刚刚';
        }else if(timer <= 3600){    //一小时内
            tip = Math.floor(timer/60) + '分钟前';
        }else if(timer >= 3600 && (timestamp - today >= 0)){    // 一天内
            tip = Math.floor(timer/3600) + '小时前';
        } else if(timer/86400 <= 31){    //一个月内
            tip = Math.ceil(timer/86400) + '天前';
        }else{
            tip = this.getLastDate(timestamp);
        }
        return tip;
    },
}

export default  {
        bind: function(el,binding){
            el.innerHTML = Time.getFormatTime(binding.value*1000);
            el.__timeout__ = setInterval(function(){
                el.innerHTML = Time.getFormatTime(binding.value*1000);
            },6000)
        },
        unbind: function(el){
            clearInterval(el.__timeout__);
            delete el.__timeout__;
        }
}