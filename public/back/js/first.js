$(function(){
    var currentPage = 1;
    var pageSize = 5;

    render()

    function render(){
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:currentPage,
                pageSize:pageSize,
            },
            success:function(data){
    
                $("tbody").html( template("tpl",data) );
    
                //渲染分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    currentPage:currentPage,
                    totalPages:Math.ceil(data.total / pageSize),
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

    //添加功能
    $(".btn_add").on("click",function(){
        $("#addModal").modal('show');
    })

    //表单校验功能
    var $form = $('#form');
    $form.bootstrapValidator({
        feedbackIcons:{
            valid: 'glyphicon glyphicon-ok',
            invalid:'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            categoryName:{
                validators:{
                    notEmpty:{
                        message:"请输入一级分类"
                    }
                }
            }
        }
    })

    //表单校验成功事件
    $form.on("success.form.bv",function(e){
        e.preventDefault();

        $.ajax({
            type:"post",
            url:"/category/addTopCategory",
            data:$form.serialize(),
            success:function(data){
                if(data.success){
                    //关闭模态框
                    $("#addModal").modal('hide');

                    //重新渲染第一页
                    currentPage = 1;
                    render();

                    //把模态框中的数据重置
                    $form.data("bootstrapValidator").resetForm();
                    $form[0].reset();
                }
            }
        })
    })
})