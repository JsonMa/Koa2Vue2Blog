/**
 * Created by Mahao on 2017/4/7.
 */
$(function(){

    // 登录
    $('#login').on('submit', function(e){
        e.preventDefault();
        var $form = $(this),
            form = $form.attr("from-data");
        $.post("/admin/login", $form.serialize(), function(res){
            if(res.code == 0){

                //处理成功时的响应
                if(form) {
                    location.href = form;
                } else {
                    location.href = '/admin/index';
                }
            }else{

                // 返回失败信息
                IOT.tips(res.msg, "error", 1000);
            }
        }, 'json');
    })
});