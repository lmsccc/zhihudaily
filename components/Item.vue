<template>
    <div class="daily-item">
        <div class="daily-image" v-if="data.images">
            <img :src="imgPath + data.images[0]">
        </div>
        <div class="daily-title">{{ data.title }}</div>
    </div>        
</template>
<script>
import $ from '../util.js'
export default {
    props: {
        data:{
            type: Object
        }
    },
    data: function(){
        return {
            imgPath: $.imgPath
        }
    },
}
</script>
<style>
.daily-item{
    padding: 20px 10px 20px 10px;
    text-align: center;
}
.daily-item:hover{
    background-color: #f5f6f9;
}
.daily-image img{
    width: 100px;
    border-radius: 10%;
}
.daily-image,
.daily-title{
    display: inline-block;
    vertical-align: middle;
}
.daily-title{
    width: 200px;
    padding-left: 20px;
}
</style>
