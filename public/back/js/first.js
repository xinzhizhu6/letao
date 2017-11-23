$(function () {
    //去后端获取数据 渲染页面
    var currentPage = 1;
    var pageSize = 5;

    //渲染页面
    render();

    function render() {
        //请求ajax
        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize,
            },
            success: function (data) {
                console.log(data);

                $("tbody").html(template("tpl", data));

                //渲染分页
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

    //点击添加分类 模块框显示
    $(".btn_add").on("click",function(){
        $("#addModal").modal("show");
    })


    //表单校验 
    var $form = $('form');
    $form.bootstrapValidator({
        feedbackIcons:{
            valid: 'glyphicon glyphicon-ok',
            invalid:'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        fields:{
            categoryName : {
                validators:{
                    notEmpty:{
                        message : "请输入一级分类名称"
                    }
                }
            }
        }
    })

    //注册表单校验成功事件
    $form.on("success.form.bv",function(e){
        //阻止默认事件的发生
        e.preventDefault();

        //发送ajax的请求
        $.ajax({
            type:"post",
            url:"/category/addTopCategory",
            data:$form.serialize(),
            success:function(data){
                //关闭模态框
                $("#addModal").modal("hide");

                //重新渲染第一面
                currentPage = 1;
                render();

                //清除表单数据
                $form.data("bootstrapValidator").resetForm();
                $form[0].reset();
            }
        })
    })
})