/**
 * Created by Administrator on 2017/4/16.
 */
$(function () {
    var job = {
        init: function () {
            this.bindEvent();
        },
        bindEvent: function (){

            // 岗位描述-markdown编辑器初始化
            var describeSimplemde  = new SimpleMDE({
                element: document.getElementById('jobDescribe')
            });

            // 岗位要求-markdown编辑器初始化
            var demandSimplemde  = new SimpleMDE({
                element: document.getElementById('jobDemand')
            });

            // 保存新闻内容
            $('.btn-save').click(function (){
                var $this = $(this),
                    btnMode = $this.attr('mode'),
                    postString = btnMode == 'create'? '/job/add': '/job/edit',
                    params = {
                        jobDescribe: describeSimplemde.value(),  // 岗位描述
                        jobDemand: demandSimplemde.value(),  // 岗位要求
                        jobName: $('#jobName').val(),
                        jobType: $('#jobType option:selected').val(),
                    },
                    id = $this.attr('id');
                if(id) {
                    params.id = id
                }
                if (params.jobDescribe && params.jobDemand && params.jobName && params.jobType) {
                    $.post(postString, params, function (result) {
                        if(result.code == 0) {
                            IOT.tips(result.msg, 'success', 1000)
                        } else {
                            IOT.tips(result.msg, 'error', 1000)
                        }
                    });
                } else {
                    IOT.tips('所有内容均不能未空！', 'warning', 1500)
                }
            })
        }
    };
    job.init()
});