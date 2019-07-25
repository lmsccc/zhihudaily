// 做到一半发现主题日报的API虽然可以获取，但是已经没有内容了，应该是知乎日报没有主题日报这个版块了
// 所以代码中有关于主题日报的代码我都注释掉了
<template>
    <div class="daily">
        <!-- 以下内容为手机端适配内容 -->
        <div class="daily-header" v-show="isMobile">
            <div class="header-button" @click="clickButton">☰</div>
            <span class="header-title">每日推荐</span>
        </div>
        <!-- 手机端适配内容结束 -->
        <div class="daily-menu" v-show="!isMobile">
            <div class="daily-menu-item" :class="{on: type === 'recommend'}" @click="handleClickRecommend">每日推荐</div>
        </div>
        <div @scroll="handleScroll" class="daily-list" ref="list" v-show="!isSelectArtical">
            <template v-if="type === 'recommend'">
                <div v-for="items in list" :key="items.date"><span class="daily-date">{{ formatDate(items.date) }}</span>
                    <Item @click.native="getArtical(item.id)" v-for="item in items.stories" :key="item.id" :data="item"></Item>
                </div>
                <div class="more"><a @click="handleMore">加载更多</a></div>
            </template>
        </div>
        <Artical :articalID="articalID" ref="artical" v-show="!isMobile || isSelectArtical"></Artical>
    </div>    
</template>
<script>
import $ from './util.js'
import Item from './components/Item.vue'
import Artical from './components/Artical.vue'
export default {
    components: {
        Item,
        Artical
    },
    data: function(){
        return {
            showThemes: false,
            themes: [],
            list:[],
            //标记当前菜单栏中当前点击主题的ID
            themeId: -1,
            //标记当前选择的菜单类别，默认每日推荐
            type: '',
            //默认保存今天的时间
            date: $.getTodayTime(),
            articalID: 0,
            isMobile: false,
            //用于判断移动端是否点击了文章
            isSelectArtical: false
        }
    },
    methods:{
        //请求新闻列表
        handleClickRecommend: function(){
            if(this.type === 'recommend')return;
            this.list = [];
            this.type = 'recommend';
            this.showThemes = false;
            //这个today不是实际的今天，因为请求的时候实际填写的日期是在今天加多一天的
            let today = $.getDate($.getTodayTime() + 86400000);
            $.ajax.get('news/before/' + today).then(res => {
                this.list.push(res);
            })
        },
        formatDate: function(date){
            let month = date.substr(4, 2);
            let day = date.substr(6, 2);
            if(month.substr(0 ,1) === '0') month = month.substr(1, 1);
            if(day.substr(0 ,1) === '0') day = day.substr(1, 1);
            return month + '月' + day + '日';
        },
        //加载更多
        handleMore: function(){
            this.isLoading = true;
            //将日期往前推一天
            this.date = this.date - 86400000;
            //发起请求,这里加回86400000是因为请求的时候链接日期是要加一天的
            $.ajax.get('news/before/' + $.getDate(this.date + 86400000)).then(res => {
                this.list.push(res);
                this.isLoading = false;
            })
        },
        //下滑加载更多
        handleScroll: function(){
            const $list = this.$refs.list;
            if(this.isLoading){
                console.log("isloading!");
                return;
            }
            if($list.scrollTop + document.body.clientHeight >= $list.scrollHeight - 1){
                this.handleMore();
            }
        },
        //获取文章
        getArtical: function(articalID){
            this.articalID = articalID;
            //适配移动端
            if(this.isMobile === true){
                this.isSelectArtical = true;
            } 
            document.querySelector('.header-button').innerText = "←";
            document.querySelector('.header-title').innerText = "返回"
            //重新加载文章回到最上面
            this.$nextTick(() => {
                const $artical = document.querySelector('.daily-artical');
                $artical.scrollTo(0, 0); 
            })
        },
        //判断设备是否为移动端
        getDevice: function(){
            const agents = [
                "android",
                "iphone",
                "ipad",
                "ipod",
                "symbianos",
                "windows phone"
            ];
            let ua = navigator.userAgent.toLowerCase();
            console.log(ua);
            agents.forEach( (device) => {
                if(ua.indexOf(device) >= 0){
                    this.isMobile = true;
                    document.querySelector(".daily").style.display = "block";
                    document.querySelector(".daily-artical").style.width = "100%";
                }
            })
            
        },
        clickButton: function(){
            if(this.isSelectArtical === true){
                this.isSelectArtical = false;
                document.querySelector('.header-button').innerText = "☰";
                document.querySelector('.header-title').innerText = "每日推荐"
            }
        }
    },
    mounted:function(){
        this.handleClickRecommend();
        this.getDevice();
    }
}
</script>
<style>
*{
    margin: 0;
    padding: 0;
}
html,body{
    height: 100%;
    width: 100%;
}
.daily{
    height: 100%;
    width: 100%;
    display: flex;
    color: #657180;
}
.daily-menu,
.daily-list{
    display: inline-block;
    height: 100%;
    overflow: auto;
}
.daily-menu{
    flex-grow: 1
}
.daily-list{
    width: 25%;
    min-width: 355px;
}

.daily-menu{ 
    background-color: #f5f6f9;
    color: #008BED;
}
.daily-menu-item{
    text-align: center;
    padding: 10px 5px;
}
.daily-menu-item:hover{
    background-color: #e3e8ee;
}
.daily-date{
    text-align: center;
    padding: 10px 0 10px 0;
    display: block;
}
.more{
    text-align: center;
    cursor: pointer;
}

.daily-header{
    background-color: #008BED;
    color:#f5f6f9;
    height: 50px;    
}
.header-button{
    display: inline-block;
    padding: 10px 0 10px 20px;
    font-size: 20px;
}
.header-title{
    display: inline-block;
    line-height: 50px;
    margin-left: 20px;
}
</style>
