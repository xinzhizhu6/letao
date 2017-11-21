NProgress.configure({
    showSpinner: false
});
//注册全局事件 所有的ajax只要开始就会开启进度条
$(document).ajaxStart(function () {
    NProgress.start();
});

//注册全局事件 所有的ajax结束就会关闭进度条
$(document).ajaxStop(function () {
    NProgress.done();
});


//非登陆页面，判断当前用户是否是登录了，如果登录了，就继续，如果没登陆，需要跳转到登录页面。
if (location.href.indexOf("login.html") == -1) {
    $.ajax({
        typy: "get",
        url: "/employee/checkRootLogin",
        success: function (data) {
            if (data.error === 400) {
                location.href = "login.html"
            }
        }
    })
}




//二级分类显示隐藏功能
$(".child").prev().on("click", function () {
    $(this).next().slideToggle();
})

//侧边栏隐藏
$(".icon_menu").on("click", function () {
    $(".lt_aside").toggleClass("now");
    $(".lt_main").toggleClass("now");
})

//退出功能
$(".icon_logout").on("click", function () {
    $("#logoutModal").modal("show");

})

$(".btn_logout").on("click", function () {
    $.ajax({
        type: "get",
        url: "/employee/employeeLogout",
        success: function (data) {
            if (data.success) {
                location.href = "login.html"
            }
        }
    })
})