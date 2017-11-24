$(function () {

    //渲染左侧
    $.ajax({
        type: "get",
        url: "/category/queryTopCategory",
        success: function (data) {
            console.log(data);
            $(".lt_category_l .mui-scroll").html(template("tpl_l", data));


            //渲染二级分类，默认渲染i==0的那个
            renderSecond(data.rows[0].id)
        }
    });

    //渲染二级分类，要求传递一个一级分类的id
    function renderSecond(id) {
        $.ajax({
            type: "get",
            url: "/category/querySecondCategory",
            data: {
                id: id
            },
            success: function (data) {
                console.log(data);
                $(".lt_category_r .mui-scroll").html(template('tpl_r', data))
            }
        })
    }

    $(".lt_category_l .mui-scroll").on("click", "li", function () {
        $(this).addClass("now").siblings().removeClass("now");

        var id = $(this).data("id");

        renderSecond(id);

        //让右边的区域滚动滚回 0，0
        mui('.mui-scroll-wrapper').scroll()[1].scrollTo(0, 0, 500); //100毫秒滚动到顶2
    })



})