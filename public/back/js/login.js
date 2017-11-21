$(function () {

    //表单校验的功能
    //1. 用户名不能为空
    //2. 用户密码不能为空
    //3. 用户密码的长度是6-12位
    var $form = $("form");

    $form.bootstrapValidator({
        //指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons:{
            valid:'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 指定校验字段
        fields:{
            username:{
                validators:{  
                    notEmpty:{  //判断不能为空
                        message:'用户名不能为空'
                    },
                    callback:{
                        message:'用户名不存在'
                    }
                }
            },
            password:{
                validators:{
                    notEmpty:{
                        message:'密码不能为空'
                    },
                    callback:{
                        message:'密码错误'
                    },
                    stringLength:{
                        min:6,
                        max:12,
                        message:'密码长度必须6-12位'
                    }
                }
            }
        }
    })  

    //需要给表单注册一个校验成功的事件  success.form.bv
    $form.on("success.form.bv",function(e){
        e.preventDefault();

        //发送ajax
        $.ajax({
            type:'post',
            url:'/employee/employeeLogin',
            data:$form.serialize(), //表单序列化
            datatype:JSON,
            success:function(data){
                // console.log(data);
                if(data.success){
                    //登录成功 跳转到主页
                    location.href = "index.html"
                }
                if(data.error === 1000){
                    //用户名不存在
                    // alert("用户名不存在")
                    $form.data('bootstrapValidator').updateStatus('username','INVALID','callback')
                }
                if(data.error === 1001)
                    //密码错误
                    // alert("密码错误")
                    $form.data('bootstrapValidator').updateStatus('password','INVALID','callback')
            }
        })
    })


     //重置功能，重置样式
    $("[type = 'reset']").on('click',function(){
        // $form.data('bootstrapValidator').resetForm();
        $form.data("bootstrapValidator").resetForm();
    })
})      