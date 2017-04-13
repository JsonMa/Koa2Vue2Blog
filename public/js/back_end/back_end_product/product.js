/**
 * Created by Mahao on 2017/4/13.
 */
$(function () {
   var product = {
       init: function () {
         this.bindEvent();
       },
       bindEvent: function () {

           // 查看图片
           $('.img-detail').click(function () {
               var $this = $(this),
                   $parent = $this.parent(),
                   productName = $parent.find('.productName').html(),
                   imgUrl = $this.attr("imgUrl").replace("public", "..");;
               var dialog = new IOT.Dialog({
                   title: '产品详情', //标题
                   content: '' +
                   '<div class="row" style="text-align: center">' +
                   '<h4>'+ productName +'</h4>' +
                   '<img class="product-img" src="'+ imgUrl +'"/>' +
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
                       dialog.close()
                   } //取消按钮的回调
               });
               dialog.open()
           });

           // 产品修改状态
           $('.item-switch').off('click').on('click', function () {
               var $this = $(this),
                   status = $this.attr('status'),
                   series = $this.attr('series');
               id = $this.attr('id');
               $.post("/product/status",{id: id, status: status, series: series},function(result){
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

           // 删除产品
           $('.btn-delete').click(function () {
               var $this = $(this),
                   _id = $this.attr('id'),
                   imgUrl = $this.attr('imgUrl'),
                   imgStructUrl = $this.attr('imgStructUrl'),
                   series = $this.attr('series'),
                   postUrl = '/product/delete';
               imgUrl = imgUrl.indexOf('..') != -1 ? imgUrl.replace('..', 'public'): imgUrl;
               if(imgStructUrl) {
                   imgStructUrl = imgStructUrl.indexOf('..') != -1 ? imgStructUrl.replace('..', 'public'): imgStructUrl;
               }
               IOT.Dialog.confirm('是否删除该条记录？', function () {
                   $.post(postUrl, {id: _id, imgUrl: imgUrl, series: series, imgStructUrl: imgStructUrl}, function (result) {
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
       }
   };
    product.init();
});