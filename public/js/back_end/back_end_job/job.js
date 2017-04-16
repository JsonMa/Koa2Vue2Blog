/**
 * Created by Administrator on 2017/4/16.
 */
/**
 * Created by Mahao on 2017/4/12.
 */
$(function () {
    var job = {
        init: function () {
            this.bindEvent();
        },
        bindEvent: function () {

            // 修改指定岗位状态
            $('.item-switch').off('click').on('click', function () {
                var $this = $(this),
                    status = $this.attr('status');
                id = $this.attr('id');
                $.post("/job/status",{id: id, status: status},function(result){
                    if (result.code == 0) {
                        IOT.tips(result.msg, 'success', 800);
                        setTimeout(function () {
                            window.location.reload();
                        }, 800)
                    } else {
                        IOT.tips(result.msg, 'warning', 800)
                    }
                });
            });

            // 删除指定岗位
            $('.btn-delete').click(function () {
                var $this = $(this),
                    _id = $this.attr('id'),
                    postUrl = '/job/delete';
                IOT.Dialog.confirm('是否删除该条记录？', function () {
                    $.post(postUrl, {id: _id}, function (result) {
                        if (result.code == 0) {
                            IOT.tips(result.msg, 'success', 800);
                            setTimeout(function () {
                                window.location.reload();
                            }, 800)
                        } else {
                            IOT.tips(result.msg, 'warning', 800)
                        }
                    });
                }, function () {
                    return false
                });
            });

            // 查看岗位描述
            $('.jobDescribe').click(function () {
                var $this = $(this),
                    des = $this.attr('des');
                var dialog = new IOT.Dialog({
                    title: '岗位描述详情', //标题
                    content: '' +
                    '<div class="row" style="text-align: center">' +
                    '' + des + '' +
                    '</div>', //内容
                    beforeClose: null, //调用close方法时执行的callback，如果此callback返回false则会阻止窗口的关闭
                    showClose: true, //是否显示右上角关闭按钮
                    className: '', //自定义弹出框类名
                    cache: false, //是否缓存。若为false则close的时候会remove掉对话框对应的dom元素
                    showOk: true, //显示确定按钮
                    okText: '确定', //确定按钮的文字
                    okCallback: function(){
                    }, //确定按钮的回调
                    showCancel: false, //是否显示取消按钮
                    cancelText: '取消', //取消按钮的文字
                    cancelCallback: function(){
                        dialog.close()
                    } //取消按钮的回调
                });
                dialog.open()
            });

            // 查看岗位要求
            $('.jobDemand').click(function () {
                var $this = $(this),
                    demand = $this.attr('demand');
                var dialog = new IOT.Dialog({
                    title: '岗位要求详情', //标题
                    content: '' +
                    '<div class="row" style="text-align: center">' +
                    '' + demand + '' +
                    '</div>', //内容
                    beforeClose: null, //调用close方法时执行的callback，如果此callback返回false则会阻止窗口的关闭
                    showClose: true, //是否显示右上角关闭按钮
                    className: '', //自定义弹出框类名
                    cache: false, //是否缓存。若为false则close的时候会remove掉对话框对应的dom元素
                    showOk: true, //显示确定按钮
                    okText: '确定', //确定按钮的文字
                    okCallback: function(){
                    }, //确定按钮的回调
                    showCancel: false, //是否显示取消按钮
                    cancelText: '取消', //取消按钮的文字
                    cancelCallback: function(){
                        dialog.close()
                    } //取消按钮的回调
                });
                dialog.open()
            });
        },
    };

    // 初始化调用
    job.init();
});