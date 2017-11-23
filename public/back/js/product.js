$(function () {
    var currentPage = 1;
    var pageSize = 5;

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

        $("form").data('bootstrapValidator').updateStatus("brandId", "VALID");
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
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: "请输入商品尺码"
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
        }
    })


})