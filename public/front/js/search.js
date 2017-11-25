$(function () {

    //分装一个函数 获取本地存储的数据
    function getHistory() {
        //1 获取到lt_search_history对应的值，就是一个json字符串
        var history = localStorage.getItem("lt_search_history") || '[]';
        //console.log(history);
        //获取到的数据转成json字符串格式
        var arr = JSON.parse(history);
        // console.log(arr)

        return arr;
    }

    //渲染数据
    function render() {
        var arr = getHistory();
        $(".lt_history").html(template("tpl", {
            arr: arr
        }));
    }

    render();


    //清空历史记录
    $(".lt_history").on("click", ".btn_empty", function () {
        // console.log(1)
        localStorage.removeItem("lt_search_history");
        render();
    })

    //3. 删除搜索列表
    //3.1 注册点击事件
    //3.2 获取到点击的对应的index
    //3.3 获取历史记录 得到数组
    //3.4 删除数组对应下标的值
    //3.5 重新设置到缓存里面
    //3.6 重新渲染

    $(".lt_history").on("click", ".btn_delete", function () {
        var arr = getHistory();
        var index = $(this).data("index");

        arr.splice(index, 1);

        //将数组重新存到缓存时要转化为json格式
        localStorage.setItem("lt_search_history", JSON.stringify(arr));
        render();
    })

    //4. 添加搜索列表
    //4.1 注册点击事件
    //4.2 获取到输入的关键字
    //4.3 获取到历史记录，得到数组
    //4.4 把关键字添加到数组最前面
    //4.5 重新设置到缓存里面
    //4.6 重新渲染

    $(".search_btn").on("click",function(){
        var key = $(".search_input").val();

        var arr = getHistory();
        //判断输入的值是否存在数组中 如果有就删除掉
        var index = arr.indexOf( key );
        if(index != -1){
            arr.splice(index , 1);
        }
        //如果数组长度超过10个 就删除最早的一个
        if(arr.length >= 10){
            arr.pop();
        }

        arr.unshift(key);

        localStorage.setItem("lt_search_history",JSON.stringify(arr));

        render();
    })
})