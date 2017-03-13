/**
 * Created by Administrator on 2017/3/13.
 */
($(function () {

    /**
     * 定义headerNavigater对象
     */
    var headerNavigater = {
        init: function () {
            this.bindEvent();
        },
        bindEvent: function () {

            // 二级导航的显示与隐藏
            var $mainNav = $('.front-end-header-item'),
                $subNavContainer = $mainNav.find('ul');
            $mainNav.mouseover(function () {
                var $this = $(this);
                // $mainNav.removeClass('header-active');
                $this.addClass('header-active');
                $this.find('ul').stop().fadeIn();
            }).mouseleave(function () {
                var $this = $(this);
                $this.removeClass('header-active');
                $this.find('ul').stop().fadeOut();
            });
        }
    };
    headerNavigater.init();
}))();