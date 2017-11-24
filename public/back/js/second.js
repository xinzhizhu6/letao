$(function(){
    var currentPage = 1;
    var pageSize = 5;

    render();

    function render(){
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            success:function(data){
                // console.log(data);
                $("tbody").html( template( "tpl",data ) );

                //渲染分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: currentPage,
                    totalPages: Math.ceil(data.total / pageSize),
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
                    onPageClicked: function (a, b, c, page) {
                      currentPage = page;
                      render();
                    }
                })
            }
        })
    }


    //添加功能 

    $(".btn_add").on("click",function(){
        //显示模态框
        $("#addModal").modal("show");

        //发送ajax请求，获取所有的一级分类数据，渲染下拉框组建
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:1,
                pageSize:100
            },
            success : function(data){
                $(".dropdown-menu").html( template( "tpl2",data ) )
            }
        })
    })

    //给下拉框所有的a标签添加点击事件
    $(".dropdown-menu").on("click","a",function(){
        //1. 设置按钮的内容
        $(".dropdown-text").text( $(this).text() )

        //获取到当前a的id值，设置给categoryId
        $("[name = 'categoryId']").val( $(this).data("id") )

        //改变 让categoryId校验变成成功
        $form.data('bootstrapValidator').updateStatus( "categoryId","VALID");
    })


    //上传图片
    $("#fileupload").fileupload({
        dataType:"json",
        //e：事件对象
        //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
        done:function (e, data) {
          console.log(data);
         //设置给img_box中img的src属性
          $(".img_box img").attr( "src", data.result.picAddr);

          //把图片的地址赋值给brandLogo
          $("[name='brandLogo']").val(  data.result.picAddr );

          //改变 让categoryId校验变成成功
          $form.data('bootstrapValidator').updateStatus( "brandLogo","VALID");
        }
      });

      //校验表单
      var $form = $('#form');
      $form.bootstrapValidator({
        //1. 指定不校验的类型
        excluded: [],
        //2. 指定校验时的图标显示，
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
                        message:"请上传图片"
                    }
                }
            }
        }

      })

      //校验完成事假
      $form.on("success.form.bv",function(e){
        e.preventDefault();

        //发送ajax
        $.ajax({
            type:"post",
            url:"/category/addSecondCategory",
            data:$form.serialize(),
            success:function(data){
                if(data.success){
                    //隐藏模态框
                    $("#addModal").modal("hide");
                    //重新渲染第一页
                    currentPage = 1;
                    render();

                    //重置内容和样式
                    $form.data('bootstrapValidator').resetForm();
                    $form[0].reset();

                    //恢复下拉菜单和组件
                    $(".dropdown-text").text("请选择一级分类");
                    $(".img_box img").attr('src','img/none.png');
                    $("[name='categoryId']").val('');
                    $("[name='brandLogo']").val('');
                }
            }
        })

      })
})



