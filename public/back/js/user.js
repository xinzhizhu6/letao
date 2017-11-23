$(function(){

    var currentPage = 1;
    var pageSize = 5;

    //渲染页面
    render();

    function render(){
        $.ajax({
            type:"get",
            url:"/user/queryUser",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            success:function(data){
                // console.log(data);
                $("tbody").html( template("tpl",data) );
    
                //渲染分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    currentPage:currentPage,
                    totalPages:Math.ceil( data.total / pageSize ),
                    itemTexts: function(type, page, current) { //修改显示文字
                        switch (type) {
                        case "first":
                            return "首页";
                        case "prev":
                            return "上一页";
                        case "next":
                            return "下一页";
                        case "last":
                            return "末页";
                        case "page":
                            return page;
                        }
                    },
                    onPageClicked:function(a,b,c,page){
                        currentPage = page;
                        render();
                    }
                })
            }
        })
    }


    //禁用功能
    $("tbody").on("click",".btn",function(){
        //显示模态框
        $("#userModal").modal("show");
        
        //获取相应的id
        var id = $(this).parent().data("id");
        var isDelete = $(this).hasClass("btn-danger")? 0 : 1;

        $(".btn-confirm").off().on("click",function(){
            $.ajax({
                type:"post",
                url:"/user/updateUser",
                data:{
                    id:id,
                    isDelete:isDelete
                },
                success:function(data){
                    if(data.success){
                        //隐藏模态框
                        $("#userModal").modal("hide");
                        render();
                    }
                }
            })
        })

    })  


})