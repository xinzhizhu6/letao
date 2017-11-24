$(function () {
    var currentPage = 1;
    var pageSize = 5;
    var imgs = [];

    render();

    function render() {
        $.ajax({
            type: "get",
            url: "/product/queryProductDetailList",
            data: {
                page: currentPage,
                pageSize: pageSize,
            },
            success: function (data) {
                // console.log(data);
                $("tbody").html(template("tpl", data));

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

    $(".btn_add").on("click", function () {
        $("#addModal").modal("show");

        //发送ajax请求，获取所有的二级分类数据，渲染下拉菜单中
        $.ajax({
            type: 'get',
            url: "/category/querySecondCategoryPaging",
            data: {
                page: 1,
                pageSize: 100,
            },
            success: function (data) {
                console.log(data);

                $(".dropdown-menu").html(template("tpl2", data));
            }
        })
    })

    //给下拉框中的a设置点击事件
    $(".dropdown-menu").on("click", "a", function () {

        $(".dropdown-text").text($(this).text())

        //2. 把a的id赋值给 隐藏域brandId
        $("[name='brandId']").val($(this).data("id"));

        //3. 手动的把brandId改成成功
        $form.data("bootstrapValidator").updateStatus("brandId", "VALID");
    })

    //表单校验
    var $form = $("form");
    $form.bootstrapValidator({
        //1. 指定不校验的类型
        excluded: [],
        //2. 指定校验时的图标显示，
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            brandId: {
                validators: {
                    notEmpty: {
                        message: "请选择二级分类"
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: "请输入商品名称"
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: "请输入商品描述"
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: "请输入商品库存"
                    },
                    //正则校正
                    regexp: {
                        regexp:/^[1-9]\d*$/,
                        message:"请输入合法库存"
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: "请输入商品尺码"
                    },
                    regexp:{
                        regexp:/^\d{2}-\d{2}$/,
                        message:"请输入合法尺寸"
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: "请输入商品价格"
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: "请输入商品价格"
                    }
                }
            },
            brandLoge:{
                validators:{
                    notEmpty:{
                        message:"请上传3张图片"
                    }
                }
            }
        }
    })


    $("#fileupload").fileupload({
        datatype : "json",
        done:function(e,data){

            if(imgs.length >= 3){
                return false;
              }
            // console.log(data.result);
            //1. 把图片显示到页面中
            $(".img_box").append('<img src="'+ data.result.picAddr +'" width="100" height="100" alt="">');

            //2. 把结果存储起来，添加的时候需要使用
            imgs.push(data.result);
            
            
            //3.判断数组长度,如果是3 手动让brandLogo 校验成功
            if(imgs.length === 3){
                $form.data("bootstrapValidator").updateStatus("brandLogo" , "VALID");
            }else{
                $form.data("bootstrapValidator").updateStatus("brandLogo" , "INVALID");               
            }
        
        }
    })

    //添加商品
    //注册表单校验成功事件
    $form.on("success.form.bv",function(e){
        e.preventDefault();

        var param = $form.serialize();
        param += '&picName1='+imgs[0].picName + '&picAddr1' + imgs[0].picAddr;
        param += '&picName2='+imgs[1].picName + '&picAddr2' + imgs[1].picAddr;
        param += '&picName3='+imgs[2].picName + '&picAddr3' + imgs[2].picAddr;

        $.ajax({
            type:"post",
            url:"/product/addProduct",
            data:param,
            success:function(data){
                if(data.success){
                    //关闭模态框
                    $("#addModal").modal("hide");
                    //重新渲染第一页
                    currentPage = 1;
                    render();
                    //重置表单的内容和样式
                    $form.data("bootstrapValidator").resetForm();
                    $form[0].reset();
                    //下拉菜单重置
                    $(".dropdown-text").text("请选择二级分类");
                    $("[name = 'brandId']").val();
                    $(".img_box img").remove();
                    imgs = [];
                }
            }
        })
    })

})



   