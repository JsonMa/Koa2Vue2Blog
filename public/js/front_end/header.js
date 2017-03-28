/**
 * Created by Mahao on 2017/3/28.
 */
$(function(){
	lanrenzhijia(".drop-menu-effect");
});
function lanrenzhijia(_this){
	$(_this).each(function(){
		var $this = $(this);
		var theMenu = $this.find(".submenu");
		var tarHeight = theMenu.height();
		theMenu.css({height:0});
		$this.hover(
			function(){
				$(this).addClass("mj_hover_menu");
				theMenu.stop().show().animate({height:tarHeight},400);
			},
			function(){
				$(this).removeClass("mj_hover_menu");
				theMenu.stop().animate({height:0},400,function(){
					$(this).css({display:"none"});
				});
			}
		);
	});
}