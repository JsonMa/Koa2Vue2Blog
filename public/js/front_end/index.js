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
	        
	        // 首页轮播图
	        $('.flicker-example').flicker({
		        auto_flick_delay: 5
	        });

	        // 产品中心轮播初始化
	        $('#magnetic').bxSlider({
		        slideWidth: 240,
		        minSlides: 1,
		        maxSlides: 4,
		        moveSlides: 1,
		        slideMargin: 10
	        });
	        $('#chemical').bxSlider({
		        slideWidth: 240,
		        minSlides: 1,
		        maxSlides: 4,
		        moveSlides: 1,
		        slideMargin: 10
	        });
	        $('#pitot').bxSlider({
		        slideWidth: 240,
		        minSlides: 1,
		        maxSlides: 4,
		        moveSlides: 1,
		        slideMargin: 10
	        });
	        $('#seal').bxSlider({
		        slideWidth: 240,
		        minSlides: 1,
		        maxSlides: 4,
		        moveSlides: 1,
		        slideMargin: 10
	        });
        },
        bindEvent: function () {
            $('.switch-tab').click(function () {
                var $this = $(this);
                var presentClass = $this.attr('class').split(' ')[0],
				 	$activeItem = $('.product-content-tab').find('.active'),
					activeClass = $activeItem.attr('class').split(' ')[0];
				$activeItem.removeClass('active');
				$('.' + activeClass + '-container').fadeOut();
				$this.addClass('active')
				$('.' + presentClass + '-container').fadeIn();
            })
        }
    };

    // 对象初始化
    indexPage.init()
});
