mui(".mui-scroll-wrapper").scroll()

mui('.mui-slider').slider({
    interval:2000//自动轮播周期，若为0则不自动播放，默认为0；
})

var tools = {
    getSearchObj:function(){
        //获取地址栏参数
        var search = location.search;
        //对search字符串进行解码
        search = decodeURI( search );
        //把? 删除
        search = search.slice(1);
        var arr = search.split('&');
        var obj = {};
        arr.forEach(function(v){
            var key = v.split("=")[0];
            var value = v.split("=")[1];
            obj[key] = value;
        })

        return obj;
    },
    getSearch : function(key){
        return this.getSearchObj()[key];
    }
}