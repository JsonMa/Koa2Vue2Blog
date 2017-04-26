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

            // tab切换
            $('.switch-tab').on('click',function () {
                var $this = $(this);
                var presentClass = $this.attr('class').split(' ')[0],
				 	$activeItem = $('.product-content-tab').find('.active'),
					activeClass = $activeItem.attr('class').split(' ')[0];
				$activeItem.removeClass('active');
				var $active = $('.' + activeClass + '-container').parent();
				$this.addClass('active');
                var $present = $('.' + presentClass + '-container');
                $present.clone().prependTo($active);
                $present.remove();
            });

			setTimeout(function () {
                $('.flick-title').fadeIn();
                $('.flick-sub-text').fadeIn();
			}, 500);

            // hover效果
			$('.abstract-item').mouseenter(function () {
				$(this).find('.abstract-item-top').removeClass('move-revert-bottom').addClass('move-bottom');
				$(this).find('.abstract-item-middle').removeClass('move-revert-top').addClass('move-top');
				$(this).find('.abstract-item-bottom').removeClass('move-revert-top').addClass('move-top');

            }).mouseleave(function () {
                $(this).find('.abstract-item-top').removeClass('move-bottom').addClass('move-revert-bottom');
                $(this).find('.abstract-item-middle').removeClass('move-top').addClass('move-revert-top');
                $(this).find('.abstract-item-bottom').removeClass('move-top').addClass('move-revert-top');
            })
        }
    };

    // 对象初始化
    indexPage.init()
});
