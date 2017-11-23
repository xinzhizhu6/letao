$(function () {
    //去后端获取数据 渲染页面
    var currentPage = 1;
    var pageSize = 5;

    render();

    function render() {
        //发生ajax请求
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function (data) {
                // console.log(data);
                //动态添加数据
                $('tbody').html(template('tpl', data));

                //分页功能
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: currentPage,
                    totalPages: Math.ceil(data.total / pageSize),
                    onPageClicked: function (a, b, c, page) {
                        currentPage = page;
                        render();
                    }
                })
            }
        })
    }

    //添加二级分类
    $(".btn_add").on("click",function(){
        //显示模态框
        $("#addModal").modal("show");

        //获取一级分类数据 渲染下拉框
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:1,
                pageSize:100
            },
            success:function(data){
                console.log(data);

                $(".dropdown-menu").html( template("tpl2",data) );
            }
        })
    })

    //给下拉框中所有的a标签注册点击事件
    $(".dropdown-menu").on("click","a",function(){
        //1. 设置按钮的内容
        $(".dropdown-text").text( $(this).text() )

        //获取到当前a的id值，设置给categoryId
        $("[name='categoryId']").val($(this).data("id"));

        $form.data("bootstrapValidator").updateStatus('categoryId','VALID');
    })

    //初始化图片上传
    $("#fileupload").fileupload({
        dataType:"json",
        //e：事件对象
        //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
        done:function (e, data) {
          console.log(data);

          $(".img_box img").attr("src",data.result.picAddr);

          //把图片的地址赋值给brandLogo
          $("[name='brandLogo']").val(data.result.picAddr);

        $form.data("bootstrapValidator").updateStatus('brandLogo','VALID');
        
          
        }
    });


    //表单校验
    var $form = $('#form');
    $form.bootstrapValidator({
        excluded: [],//不校验的内容
        feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            categoryId:{
                validators:{
                    notEmpty:{
                        message:"请选择一级分类"
                    }
                }
            },
            brandName:{
                validators:{
                    notEmpty:{
                        message:"请输入二级分类"
                    }
                }
            },
            brandLogo:{
                validators:{
                    notEmpty:{
                        message:'请上传品牌图片'
                    }
                }
            }
        }
    })

    $form.on("success.form.bv",function(e){
        e.preventDefault();

        //发送ajax
        $.ajax({
            type:'post',
            url:'/category/addSecondCategory',
            data: $form.serialize(),
            success:function(data){

                if(data.success){
                    //1. 关闭模态框
                    $("#addModal").modal("hide");
                    //2. 重新渲染第一页
                    currentPage = 1;
                    render();
                }
            }

        })

        //重置样式
        $form[0].reset();
        $form.data('bootstrapValidator').resetForm();

        //重置下拉组件和图片
        $(".dropdown-text").text("请选择一级分类");
        $(".img_box img").attr("src",'img/none.png');


    })

})