/**
 * Created by Mahao on 2017/4/11.
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
                $.post("/enterprise/status",{id: id, status: status},function(result){
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

            // 新增荣誉资质
            $('.add-enterprise').click(function () {
                var dialog = new IOT.Dialog({
                    title: '新增企业形象', //标题
                    content: '' +
                    '<div class="row">' +
                    '<form class="col-md-offset-1 col-md-10">'+
                    '<div class="form-group">'+
                    '<label for="inputEmail3" class="control-label">形象名称：</label>'+
                    '<input type="text" class="form-control" id="inputName" name="name" placeholder="请输企业风采名称" required>'+
                    '<input type="hidden" class="form-control" id="imgUrl" name="imgUrl">'+
                    '</div>'+
                    '<div class="form-group">'+
                    '<label for="inputPassword3" class="control-label">形象描述：</label>'+
                    '<textarea id="imgDes" class="form-control" rows="3" name="des" placeholder="请输入企业风采描述"></textarea>'+
                    '</div>'+
                    '<div class="form-group">'+
                    '<label for="fileInput" class="control-label">上传图片：(宽、高比例为1.5:1，参考值为：700像素x469像素)</label>'+
                    '<div class="control-label">'+
                    // '<input type="file" id="fileInput">'+
                    '<div id="zyupload" class="zyupload"></div>  '+
                    '</div>'+
                    '</div>'+
                    // '<button type="submit" id = "honorSubmit" class="btn btn-default" style="display: none"></button>'+
                    '</form>' +
                    '</div>', //内容
                    beforeClose: function () {
                        return false
                    }, //调用close方法时执行的callback，如果此callback返回false则会阻止窗口的关闭
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
                        var params = {
                            name: $('#inputName').val(),
                            imgUrl: $('#imgUrl').val(),
                            imgDes: $('#imgDes').val()
                        };
                        if (params.imgUrl !='' && params.name !='') {
                            $.post('/enterprise/add', params, function(res){
                                if (res.code == 0) {
                                    IOT.tips(res.msg, 'success', 800);
                                    setTimeout(function () {
                                        window.location.reload()
                                    }, 800)
                                } else {
                                    IOT.tips(res.msg, 'error', 800)
                                }
                            });
                        } else if(params.imgUrl == '') {
                            IOT.tips('图片地址不能为空，请上传图片！', 'warning' ,'800')
                        } else {
                            IOT.tips('名称不能为空！', 'warning' ,'800')
                        }
                    } //取消按钮的回调
                });
                dialog.open(function (){
                    index.imageUploader()
                })
            });

            // 删除荣誉资质
            $('.btn-delete').click(function () {
                var $this = $(this),
                    _id = $this.attr('id'),
                    imgUrl = $this.attr('imgUrl'),
                    postUrl = '/enterprise/delete';
                IOT.Dialog.confirm('是否删除该条记录？', function () {
                    $.post(postUrl, {id: _id, imgUrl: imgUrl}, function (result) {
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

            // 企业风采详情
            $('.btn-detail').click(function () {
                var $this = $(this),
                    $parent = $this.parent(),
                    honorName = $parent.find('.honorName').html(),
                    enterpriseImgUrl = $this.attr("imgUrl").replace("public", "..");;
                var dialog = new IOT.Dialog({
                    title: '企业风采详情', //标题
                    content: '' +
                    '<div class="row" style="text-align: center">' +
                    '<h4>'+ honorName +'</h4>' +
                    '<img class="enterprise-img" src="'+ enterpriseImgUrl +'"/>' +
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

            // 图片上传插件
        },

        // 图片上传
        imageUploader: function () {

            // 初始化插件
            $("#zyupload").zyUpload({
                width            :   "520px",                 // 宽度
                height           :   "auto",                 // 宽度
                itemWidth        :   "140px",                 // 文件项的宽度
                itemHeight       :   "115px",                 // 文件项的高度
                url              :   "/upload/about",  // 上传文件的路径
                fileType         :   ["jpg","png"],// 上传文件的类型
                fileSize         :   51200000,                // 上传文件的大小
                multiple         :   true,                    // 是否可以多个文件上传
                dragDrop         :   false,                    // 是否可以拖动上传文件
                tailor           :   false,                    // 是否可以裁剪图片
                del              :   true,                    // 是否可以删除文件
                finishDel        :   false,  				  // 是否在上传文件完成后删除预览
                /* 外部获得的回调接口 */
                onSelect: function(selectFiles, allFiles){    // 选择文件的回调方法  selectFile:当前选中的文件  allFiles:还没上传的全部文件

                },
                onDelete: function(file, files){              // 删除一个文件的回调方法 file:当前删除的文件  files:删除之后的文件
                },
                onSuccess: function(file, response){          // 文件上传成功的回调方法
                    IOT.tips('图片上传成功', 'success', 800);
                    var res = $.parseJSON(response);
                    $('#imgUrl').val(res.imgPath[0])
                },
                onFailure: function(file, response){          // 文件上传失败的回调方法

                },
                onComplete: function(response){           	  // 上传完成的回调方法
                }
            });
        }
    };

    // 初始化调用
    index.init();
});