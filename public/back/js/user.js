$(function () {

    //去后端获取数据 渲染页面
    var currentPage = 1;
    var pageSize = 5;

    //渲染页面
    render();
    
    function render() {
        //发送ajax请求
        $.ajax({
            type: "get",
            url: "/user/queryUser",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function (data) {

                var html = template("tpl", data);
                $("tbody").html(html);

                //渲染分页页面
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: currentPage,
                    totalPages: Math.ceil(data.total / pageSize),
                    onPageClicked: function (a, b, c, page) {
                        currentPage = page;
                        render()
                    }
                })
            }
        })
    }

    //禁用功能
    $("tbody").on("click",".btn",function(){
        $("#userModal").modal("show");

        //获取点击的按钮的id 和 isDelete ;
        var id = $(this).parent().data("id");
        var isDelete = $(this).hasClass("btn-danger") ? 0 : 1;

        $(".btn-confirm").off().on("click",function(){
            $.ajax({
                type:"post",
                url:"/user/updateUser",
                data:{
                    id : id,
                    isDelete :isDelete
                },
                success:function(data){
                    if(data.success){
                        //关闭模态框
                        $("#userModal").modal("hide");
                        //重新渲染
                        render()
                    }
                }
            })
        })

    })

})