/**
 * Created by Mahao on 2017/4/12.
 */
$(function () {
   var news = {
       init: function () {
           this.bindEvent();
       },
       bindEvent: function (){
            // markdown编辑器初始化
            var simplemde  = new SimpleMDE({
                element: document.getElementById('newsContent'),
            });
            $('.upload-img').click(function () {
                var dialog = new IOT.Dialog({
                    title: '新增企业形象', //标题
                    content: '' +
                    '<div class="row">' +
                    '<form class="col-md-offset-1 col-md-10">'+
                    '<div class="form-group">'+
                    '<label for="fileInput" class="control-label">上传图片：(宽、高比例为1.5:1，参考值为：700像素x469像素)</label>'+
                    '<div class="control-label">'+
                    // '<input type="file" id="fileInput">'+
                    '<div id="zyupload" class="zyupload"></div>  '+
                    '</div>'+
                    '</div>'+
                    '</form>' +
                    '</div>', //内容
                    showClose: true, //是否显示右上角关闭按钮
                    className: '', //自定义弹出框类名
                    cache: false, //是否缓存。若为false则close的时候会remove掉对话框对应的dom元素
                    showOk: true, //显示确定按钮
                    okText: '取消', //确定按钮的文字
                    okCallback: function(){
                    }, //确定按钮的回调
                    showCancel: true, //是否显示取消按钮
                    cancelText: '保存', //取消按钮的文字
                    cancelCallback: function(){

                    } //取消按钮的回调
                });
                dialog.open(function (){
                    news.imageUploader();
                });
            });
            $('.btn-save').click(function (){
                var params = {
                    newsContent: simplemde.val(),
                    newsTitle: $('#newsTitle').val(),
                    newsSubtitle: $('#newsSubtitle').val(),
                    newsType: $('#newsType option:selected').val(),
                    newsAuthor: $('#newsAuthor').val(),
                    newsOrigin: $('#newsOrigin').val()
                };
                $.post('/news/add', params, function (result) {
                    console.log(result)
                });
            })
       },

       // 图片上传
       imageUploader: function () {

           // 初始化插件
           $("#zyupload").zyUpload({
               width            :   "520px",                 // 宽度
               height           :   "auto",                 // 宽度
               itemWidth        :   "140px",                 // 文件项的宽度
               itemHeight       :   "115px",                 // 文件项的高度
               url              :   "/upload/about",            // 上传文件的路径
               fileType         :   ["jpg","png"],// 上传文件的类型
               fileSize         :   51200000,                // 上传文件的大小
               multiple         :   true,                    // 是否可以多个文件上传
               dragDrop         :   false,                    // 是否可以拖动上传文件
               tailor           :   false,                    // 是否可以裁剪图片
               del              :   true,                    // 是否可以删除文件
               finishDel        :   false,  				  // 是否在上传文件完成后删除预览

               /* 外部获得的回调接口 */
               onSuccess: function(file, response){          // 文件上传成功的回调方法
                   var response = $.parseJSON(response);
                   if (response.code == 0) {
                       IOT.tips('图片上传成功', 'success', 800);
                   } else {
                       IOT.tips('图片上传失败', 'error', 800);
                   }
                   var imgUrl = response.imgPath[0].replace('public', '');
                   $("#uploadInf").append("<p>上传成功，文件地址是：" + imgUrl + "</p>");
               },
               onFailure: function(file, response){          // 文件上传失败的回调方法
                   IOT.tips('图片上传失败', 'error', 800);
               }
           });
       },
       copyText: function (obj) {
           var rng = document.body.createTextRange();
           rng.moveToElementText(obj);
           rng.scrollIntoView();
           rng.select();
           rng.execCommand("Copy");
           rng.collapse(false);
           alert("复制成功!");
       }

   };
    news.init()
});