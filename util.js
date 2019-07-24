import axios from 'axios';

const Util = {
    //请求服务的时候向这两个地址请求，不要直接向知乎服务器请求
    imgPath: 'http://127.0.0.1:8021/img/',
    apiPath: 'http://127.0.0.1:8020',
    cssPath: 'http://127.0.0.1:8022/css1/'
};

//创建一个axios实例
Util.ajax = axios.create({
    baseURL: Util.apiPath
});

//ajax响应拦截器
Util.ajax.interceptors.response.use(res => {
    return res.data;
})
//获取今天的时间戳
Util.getTodayTime = function(){
    const date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    return date.getTime();
}
//获取日期，格式为年月日，例如20190718
Util.getDate = function( timestamp = (new Date()).getTime()){
    const date = new Date(timestamp);
    console.log(date);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    const day = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate();
    console.log(year+month+day);
    return year + month + day;
}

export default Util;
