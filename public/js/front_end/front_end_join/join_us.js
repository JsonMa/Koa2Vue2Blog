/**
 * Created by Mahao on 2017/3/30.
 */
$(function () {
	var joinUs = {
		init: function () {
			this.bindEvent()
		},
		bindEvent: function() {

			// 隐藏与显示的切换
			$('.detail-bottom').on('click', '.job-switcher', function () {
				var clickedMode = $(this).attr('clicked');
				if(clickedMode == 'false') {
					$(this).parent().find('.job-container').fadeIn();
					$(this).removeClass('fa-plus').addClass('fa-minus');
					$(this).attr('clicked', 'true')
				} else {
					$(this).parent().find('.job-container').fadeOut();
					$(this).removeClass('fa-minus').addClass('fa-plus');
					$(this).attr('clicked', 'false')
				}
			})
		}
	};
	joinUs.init();
});