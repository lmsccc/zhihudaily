<template>
<div class="daily-artical">
    <div class="dailt-artical-content">
        <link rel="stylesheet" :href="cssHref">
        <div class="daily-artical-title">{{ data.title }}</div>
        <div class="daily-artical-body" v-html="data.body"></div>
    </div>
    <div class="daily-artical-comments" v-show="comments.length">
        <span>评论（{{ comments.length }}）</span>
        <div class="artical-comment" v-for="comment in comments" :key="comment.id">
            <div class="comment-avatar">
                <img :src="comment.avatar">
            </div>
            <div class="comment-content">
                <div class="comment-author">{{comment.author }}</div>
                <div class="comment-time" v-time="comment.time"></div>
                <div class="comment-text">{{ comment.content }}</div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import $ from '../util.js'
import time from '../directives/time.js'
export default {
    directives:{
        time
    },
    props: {
        articalID:{
            type: Number,
            default: 0
        },
        
    },
    data: function(){
        return {
            data: {},
            cssHref: '',
            comments: []
        }
    },
    methods: {
        getArtical(){
            $.ajax.get('news/' + this.articalID).then(res => {
                res.body = res.body.replace(/src="http/g, 'src="' + $.imgPath + 'http');
                res.body = res.body.replace(/src="https/g, 'src="' + $.imgPath + 'https');
                this.data = res;
                this.cssHref = $.cssPath + this.data.css[0];
            });
            this.getComments();
            //返回文章顶部

        },
        getComments(){
            this.comments = [];
            $.ajax.get('story/' + this.articalID + '/short-comments').then(res => {
                this.comments = res.comments.map(comment => {
                    comment.avatar =  $.imgPath + comment.avatar;
                    return comment;
                })
            })
        }
    },
    watch: {
        articalID: function(val){
            if(val) this.getArtical();
        }
    }
}
</script>
<style>
.daily-artical{
    display: inline-block;
    height: 100%;
    overflow: auto;
}
.daily-artical{
    width: 65%;
}
.daily-artical-title{
    color: black;
    font-size: 30px;
    padding: 10px 0 10px 10px
}
.img-place-holder{
    display: none;
}
.daily-artical-comments{
    padding: 10px;
}
.artical-comment{
    padding: 10px;
}
.comment-avatar img{
    width: 50px;
    height: 50px;
    border-radius: 5px;
    float: left;
}
.comment-avatar{
    float: left;
}
.comment-content{
    margin-left: 65px;
}
.comment-content div{
    padding: 0px 0 5px 0px;
}
.comment-time{
    font-size: 14px;
}
</style>
