$(function(){
    var key = tools.getSearch("key");
    $(".search_input").val(key);

    render();

    //点击搜索按钮
    $(".search_btn").on("click",function(){
        render();
    })

    //点击a标签 排序功能
    $(".lt_sort a[data-type]").on("click",function(){
        $this = $(this);
        if($this.hasClass("now")){
            $this.find("span").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
        }else{
            $this.addClass("now").siblings().removeClass("now");
            $(".lt_sort span").removeClass("fa-angle-up").addClass("fa-angle-down")
        }

        render();
    })





    function render (){
        var param = {};
        param.page = 1;
        param.pageSize = 100;

        var key = $(".search_input").val().trim();
        if(key===""){
            mui.toast("请输入搜索关键词");
            return false;
        }
        param.proName = key;

        var type = $(".lt_sort a.now").data("type");
        if(type){
            var value = $(".lt_sort a.now").find("span").hasClass("fa-angle-down") ? 2:1;
            param[type] = value;
        }


        $.ajax({
            type:"get",
            url:"/product/queryProduct",
            data:param,
            success:function(data){
                // console.log(data);
                $(".lt_product").html( template("tpl", data) );
            }
        })
    }





})