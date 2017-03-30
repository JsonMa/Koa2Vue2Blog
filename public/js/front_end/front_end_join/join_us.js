/**
 * Created by Mahao on 2017/3/30.
 */
$(function () {
	var joinUs = {
		init: function () {
			this.bindEvent()
		},
		bindEvent() {

			// 隐藏与显示的切换
			$('.job-switcher').click(function () {
				var clickedMode = $(this).attr('clicked');
				if(clickedMode == 'false') {
					$(this).next().fadeIn();
					$(this).removeClass('fa-plus').addClass('fa-minus');
					$(this).attr('clicked', 'true')
				} else {
					$(this).next().fadeOut();
					$(this).removeClass('fa-minus').addClass('fa-plus');
					$(this).attr('clicked', 'false')
				}
			})
		}
	};
	joinUs.init();
});