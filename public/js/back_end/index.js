/**
 * Created by Administrator on 2017/4/8.
 */
$(function () {
    var index = {
        init: function () {
            this.bindEvent();
        },
        bindEvent: function () {

            // 修改状态
            $('.item-switch').off('click').on('click', function () {
                var $this = $(this),
                    status = $this.attr('status');
                    id = $this.attr('id');
                $.post("/honor/status",{id: id, status: status},function(result){
                    if (result.code == 0) {
                        IOT.tips(result.msg, 'success', 1000)
                    } else {
                        IOT.tips(result.msg, 'warning', 1000)
                    }
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000)
                });
            });

            // 新增荣誉资质
            $('.add-honor').click(function () {
                var dialog = new IOT.Dialog({
                    title: '系统提示', //标题
                    content: '<div><p>这是什么</p></div>', //内容
                    beforeClose: null, //调用close方法时执行的callback，如果此callback返回false则会阻止窗口的关闭
                    showClose: true, //是否显示右上角关闭按钮
                    className: '', //自定义弹出框类名
                    cache: false, //是否缓存。若为false则close的时候会remove掉对话框对应的dom元素
                    showOk: true, //显示确定按钮
                    okText: '确定', //确定按钮的文字
                    okCallback: function(){
                    }, //确定按钮的回调
                    showCancel: true, //是否显示取消按钮
                    cancelText: '取消', //取消按钮的文字
                    cancelCallback: function(){
                        dialog.close()
                    } //取消按钮的回调
                });
                dialog.open()
            });

            // 删除荣誉资质
            $('.btn-delete').click(function () {
                var $this = $(this),
                    _id = $this.attr('id'),
                    postUrl = '/honor/delete';
                IOT.Dialog.confirm('是否删除该条记录？', function () {
                    $.post(postUrl, {id: _id}, function (result) {
                        if (result.code == 0) {
                            IOT.tips(result.msg, 'success', 1000)
                        } else {
                            IOT.tips(result.msg, 'warning', 1000)
                        }
                        setTimeout(function () {
                            window.location.reload();
                        }, 1000)
                    });
                }, function () {
                    return
                });
            });

            // 荣誉资质详情
            $('.btn-detail').click(function () {
                var $this = $(this),
                    $parent = $this.parent(),
                    honorName = $parent.find('.honorName').html(),
                    honorImgUrl = $this.attr("imgUrl");
                var dialog = new IOT.Dialog({
                    title: '荣誉详情', //标题
                    content: '' +
                    '<div class="row" style="text-align: center">' +
                    '<h4>'+ honorName +'</h4>' +
                    '<img class="honor-img" src="'+ honorImgUrl +'"/>' +
                    '</div>', //内容
                    beforeClose: null, //调用close方法时执行的callback，如果此callback返回false则会阻止窗口的关闭
                    showClose: true, //是否显示右上角关闭按钮
                    className: '', //自定义弹出框类名
                    cache: false, //是否缓存。若为false则close的时候会remove掉对话框对应的dom元素
                    showOk: true, //显示确定按钮
                    okText: '确定', //确定按钮的文字
                    okCallback: function(){
                    }, //确定按钮的回调
                    showCancel: true, //是否显示取消按钮
                    cancelText: '取消', //取消按钮的文字
                    cancelCallback: function(){
                    } //取消按钮的回调
                });
                dialog.open()

            })

        }
    };

    // 初始化调用
    index.init();
});