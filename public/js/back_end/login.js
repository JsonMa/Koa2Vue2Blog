/**
 * Created by Mahao on 2017/4/7.
 */
$(function(){

    // 登录
    $('#login').on('submit', function(e){
        e.preventDefault();
        var requestUrl = $("#requestUrl").val(),
            $form = $(this);
        $.post("/admin/login", $form.serialize(), function(res){
            if(res.code == 0){

                IOT.tips('验证成功，页面即将跳转！', "success", 1000);
                location.href = requestUrl;
            }else{

                // 返回失败信息
                IOT.tips(res.msg, "error", 1000);
            }
        }, 'json');
    })
});