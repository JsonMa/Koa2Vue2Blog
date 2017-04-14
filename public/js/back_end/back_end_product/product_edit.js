/**
 * Created by Mahao on 2017/4/14.
 */
$(function () {
    var productEdit = {
        init: function () {
            this.bindEvent();
        },
        bindEvent: function () {

            // 上传产品图片
            $('.upload-img').click(function () {
                var $this = $(this),
                    series =$this.attr('series'),
                    url = '';
                if(series == 'pump') {
                    url = "/upload/product?series=pump"
                } else {
                    url = "/upload/product?series=seal"
                }
                var dialog = new IOT.Dialog({
                    title: '产品图片上传', //标题
                    content: '' +
                    '<div class="row">' +
                    '<form class="col-md-offset-1 col-md-10">'+
                    '<div class="form-group">'+
                    '<label for="fileInput" class="control-label">上传图片：(宽、高比例为1.5:1，参考值为：700像素x469像素)</label>'+
                    '<div class="control-label">'+
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
                    showOk: false, //显示确定按钮
                    okText: '取消', //确定按钮的文字
                    okCallback: function(){
                    }, //确定按钮的回调
                    showCancel: true, //是否显示取消按钮
                    cancelText: '保存', //取消按钮的文字
                    cancelCallback: function(){
                        dialog.close();
                    } //取消按钮的回调
                });
                dialog.open(function (){
                    productEdit.imageUploader(url, function (response) {
                        var res = $.parseJSON(response);
                        $('.response-img').empty();
                        $("<img src='"+ res.imgPath[0].replace('public', '..') +"' style='border: 1px solid #eee; max-width: 400px; max-height: 300px'/>").appendTo($('.response-img'));
                        $('#product-img').val(res.imgPath[0]);
                    })
                })
            });

            // 上传结构图片
            $('.upload-struct-img').click(function () {
                var $this = $(this),
                    series =$this.attr('series'),
                    url = '';
                if(series == 'pump') {
                    url = "/upload/product?series=pump"
                } else {
                    url = "/upload/product?series=seal"
                }
                var dialog = new IOT.Dialog({
                    title: '产品结构图上传', //标题
                    content: '' +
                    '<div class="row">' +
                    '<form class="col-md-offset-1 col-md-10">'+
                    '<div class="form-group">'+
                    '<label for="fileInput" class="control-label">上传图片：(宽、高比例为1.5:1，参考值为：700像素x469像素)</label>'+
                    '<div class="control-label">'+
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
                    showOk: false, //显示确定按钮
                    okText: '取消', //确定按钮的文字
                    okCallback: function(){
                    }, //确定按钮的回调
                    showCancel: true, //是否显示取消按钮
                    cancelText: '保存', //取消按钮的文字
                    cancelCallback: function(){
                        dialog.close();
                    } //取消按钮的回调
                });
                dialog.open(function (){
                    productEdit.imageUploader(url, function(response){
                        var res = $.parseJSON(response);
                        $('.response-struct-img').empty();
                        $("<img src='"+ res.imgPath[0].replace('public', '..') +"' style='border: 1px solid #eee; max-width: 400px; max-height: 300px'/>").appendTo($('.response-struct-img'));
                        $('#product-struct-img').val(res.imgPath[0]);
                    })
                })
            });

            // 保存产品
            if($('.product-form')[0]) {
                $('.product-form').parsley().on('form:submit', function() {
                    var productImg = $('#product-img').val(),
                        series = $('.product-form').attr('series');
                    if(!productImg) {
                        IOT.tips('请上传产品图片', 'error', 1000);
                        return false
                    } else {
                        if(series == 'pump') {
                            var url = "/product/add_pump"
                        } else {
                            var url = "/product/add_seal"
                        }
                        var getData = $('.product-form').serialize();
                        $.ajax({
                            type: "GET",
                            url: url,
                            data: getData,
                            dataType: "json",
                            success: function(response){
                                if(response.code == 0) {
                                    IOT.tips('新建产品成功', 'success', 1000);
                                    setTimeout(function () {
                                        window.location.reload()
                                    }, 1000)
                                } else {
                                    IOT.tips(response.msg, 'error', 1000)
                                }
                            },
                            error: function (err) {
                                console.log(err)
                            }
                        });
                        return false
                    }
                });
            }

            // 修改产品
            if($('.product-form-edit')[0]) {
                $('.product-form-edit').parsley().on('form:submit', function() {
                    var productImg = $('#product-img').val(),
                        series = $('.product-form-edit').attr('series');
                    if(!productImg) {
                        IOT.tips('请上传产品图片', 'error', 1000);
                        return false
                    } else {
                        if(series == 'pump') {
                            var url = "/product/edit_pump";
                        } else {
                            var url = "/product/edit_seal";
                            var imgStructureUrl = $('#product-struct-img').val();
                            if(!imgStructureUrl) {
                                IOT.tips('请上传产品结构图图片', 'error', 1000);
                                return false
                            }
                        }
                        var getData = $('.product-form-edit').serialize();
                        $.ajax({
                            type: "GET",
                            url: url,
                            data: getData,
                            dataType: "json",
                            success: function(response){
                                if(response.code == 0) {
                                    IOT.tips('产品修改成功', 'success', 1000);
                                    setTimeout(function () {
                                        window.location.reload()
                                    }, 1000)
                                } else {
                                    IOT.tips(response.msg, 'error', 1000)
                                }
                            },
                            error: function (err) {
                                console.log(err)
                            }
                        });
                        return false
                    }
                });
            }
        },
        
        // 图片上传
        imageUploader: function (url, callback) {

            // 初始化插件
            $("#zyupload").zyUpload({
                width            :   "520px",                 // 宽度
                height           :   "auto",                 // 宽度
                itemWidth        :   "140px",                 // 文件项的宽度
                itemHeight       :   "115px",                 // 文件项的高度
                url              :   url,  // 上传文件的路径
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
                    if(callback && typeof callback == "function") {
                        callback(response)
                    }
                },
                onFailure: function(file, response){          // 文件上传失败的回调方法
                    IOT.tips('图片上传失败', 'error', 800);
                },
                onComplete: function(response){           	  // 上传完成的回调方法
                }
            });
        }
        
    };
    productEdit.init();
});