// 做到一半发现主题日报的API虽然可以获取，但是已经没有内容了，应该是知乎日报没有主题日报这个版块了
// 所以代码中有关于主题日报的代码我都注释掉了
<template>
    
    <div class="daily">
        <div class="daily-menu">
            <div class="daily-menu-item" :class="{on: type === 'recommend'}" @click="handleClickRecommend">每日推荐</div>
            <!-- <div :class="{on: type === 'daily'}" @click="showThemes = !showThemes">主题日报</div>
            <ul v-show="showThemes">
                <li v-for="item in themes" :key="item.id">
                   <a   @click="handleClickTheme(item.id)"
                        :class="{on: item.id === themeId && type === 'daily'}">{{ item.name }} </a> 
                </li>
            </ul> -->
        </div>
        <div @scroll="handleScroll" class="daily-list" ref="list">
            <template v-if="type === 'recommend'">
                <div v-for="items in list" :key="items.date"><p class="daily-date">{{ formatDate(items.date) }}</p>
                    <Item @click.native="getArtical(item.id)" v-for="item in items.stories" :key="item.id" :data="item"></Item>
                </div>
                <div class="more"><a @click="handleMore">加载更多</a></div>
            </template>
        </div>
        <Artical :articalID="articalID" ref="artical"></Artical>
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
            articalID: 0
        }
    },
    methods:{
        //请求主题列表
        // getThemes: function(){
        //     $.ajax.get('themes').then(res => {
        //         this.themes = res.other;
        //     });
        // },
        //选择主题,获取主题文章列表
        // handleClickTheme: function(id){
        //     this.list = [];
        //     this.type = 'daily';
        //     this.themeId = id;
        //     $.ajax.get('theme/'+id).then(res => {
        //         //type为1的是空文章
        //         this.list = res.stories.filter( item => {
        //             return item.type !== 1; 
        //         })
        //     })
        // },
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
        getArtical: function(articalID){
            this.articalID = articalID; 
            //重新加载文章回到最上面
            this.$nextTick(() => {
                const $artical = document.querySelector('.daily-artical');
                $artical.scrollTo(0, 0); 
                console.log($artical.scrollTop);
            })
        }
    },
    mounted:function(){
        //初始化获取主题推荐的主题列表和每日推荐的文章列表
        // this.getThemes();
        this.handleClickRecommend();
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
}
.daily{
    height: 100%;
    display: flex;
    color: #657180;
}
.daily-menu,
.daily-list{
    /* border: 1px solid #000; */
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
}
.more{
    text-align: center;
    cursor: pointer;
}
</style>
