/**
 * Created by Administrator on 2017/3/13.
 */
$(function () {

    // 定义indexPage对象
    var indexPage = {
        init: function () {
            this.bindEvent();

            // swiper初始化
            var mySwiper = new Swiper ('.swiper-container', {
                autoplay: 5000,//可选选项，自动滑动
                loop: true,
                // 如果需要分页器
                pagination: '.swiper-pagination',
                // 如果需要前进后退按钮
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev'
            });
	        
	        // 产品中心swiper初始化
	        var productSwiper = new Swiper('.product-content-container',{
		        slidesPerView : 3,
		        slidesPerGroup : 3,
		        paginationClickable: true,
		        // 如果需要分页器
		        // pagination: '.productSwiper-pagination',
		        // 如果需要前进后退按钮
		        nextButton: '.swiper-button-next',
		        prevButton: '.swiper-button-prev'
	        })
        },
        bindEvent: function () {
        }
    };

    // 对象初始化
    indexPage.init()
});
