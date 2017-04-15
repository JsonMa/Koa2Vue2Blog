/**
 * Created by Administrator on 2017/4/5.
 */
$(function () {
   var Contact = {
       init: function () {
           this.bindEvent();
           this.drawMap();
       },
       bindEvent: function () {
           window.Parsley.addValidator('user', {
               validateString: function(value) {
                   var re1 = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9])*$/;
                   if(!re1.test(value)){//
                       return false; // 检验未通过
                   }
                   return true;// 检验通过
               }
           });
           window.Parsley.addValidator('phone', {
               validateString: function(value) {
                   var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                   if(!myreg.test(value)){
                       return false; // 检验未通过
                   }
                   return true;// 检验通过
               }
           });
           window.Parsley.addValidator('email', {
               validateString: function(value) {
                   var filter=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                   if(!filter.test(value)){
                       return false; // 检验未通过
                   }
                   return true;// 检验通过
               }
           });
           $('#contact_form').parsley().on('form:submit', function() {
               var formData = $('#contact_form').serialize();
               $.ajax({
                   type: "GET",
                   url: "/contact/add",
                   data: formData,
                   dataType: "json",
                   success: function(response){
                       if(response.code == 0) {
                           IOT.tips('留言提交成功，我们将尽快与您取得联系！', 'success', 1500);
                           setTimeout(function () {
                               window.location.reload()
                           }, 1500)
                       } else {
                           IOT.tips(response.msg, 'error', 1000)
                       }
                   },
                   error: function (err) {
                       console.log(err)
                   }
               });
               return false; // Don't submit form for this demo
           });
       },
       drawMap: function () {

           //创建和初始化地图函数：
           function initMap(){
               createMap();//创建地图
               setMapEvent();//设置地图事件
               addMapControl();//向地图添加控件
               addMarker();//向地图中添加marker
           }

           //创建地图函数：
           function createMap(){
               var map = new BMap.Map("dituContent");//在百度地图容器中创建一个地图
               var point = new BMap.Point(106.466041,29.736451);//定义一个中心点坐标
               map.centerAndZoom(point,16);//设定地图的中心点和坐标并将地图显示在地图容器中
               window.map = map;//将map变量存储在全局
           }

           //地图事件设置函数：
           function setMapEvent(){
               map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
               map.enableScrollWheelZoom();//启用地图滚轮放大缩小
               map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
               map.enableKeyboard();//启用键盘上下左右键移动地图
           }

           //地图控件添加函数：
           function addMapControl(){
               //向地图中添加缩略图控件
               var ctrl_ove = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:1});
               map.addControl(ctrl_ove);
               //向地图中添加比例尺控件
               var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
               map.addControl(ctrl_sca);
           }

           //标注点数组
           var markerArr = [{title:"重庆伊尔流体设备制造有限公司",content:"重庆伊尔流体设备制造有限公司",point:"106.461442|29.73395",isOpen:0,icon:{w:23,h:25,l:46,t:21,x:9,lb:12}}];
           //创建marker
           function addMarker(){
               for(var i=0;i<markerArr.length;i++){
                   var json = markerArr[i];
                   var p0 = json.point.split("|")[0];
                   var p1 = json.point.split("|")[1];
                   var point = new BMap.Point(p0,p1);
                   var iconImg = createIcon(json.icon);
                   var marker = new BMap.Marker(point,{icon:iconImg});
                   var iw = createInfoWindow(i);
                   var label = new BMap.Label(json.title,{"offset":new BMap.Size(json.icon.lb-json.icon.x+10,-20)});
                   marker.setLabel(label);
                   map.addOverlay(marker);
                   label.setStyle({
                       borderColor:"#808080",
                       color:"#333",
                       cursor:"pointer"
                   });

                   (function(){
                       var index = i;
                       var _iw = createInfoWindow(i);
                       var _marker = marker;
                       _marker.addEventListener("click",function(){
                           this.openInfoWindow(_iw);
                       });
                       _iw.addEventListener("open",function(){
                           _marker.getLabel().hide();
                       })
                       _iw.addEventListener("close",function(){
                           _marker.getLabel().show();
                       })
                       label.addEventListener("click",function(){
                           _marker.openInfoWindow(_iw);
                       })
                       if(!!json.isOpen){
                           label.hide();
                           _marker.openInfoWindow(_iw);
                       }
                   })()
               }
           }
           //创建InfoWindow
           function createInfoWindow(i){
               var json = markerArr[i];
               var iw = new BMap.InfoWindow("<b class='iw_poi_title' title='" + json.title + "'>" + json.title + "</b><div class='iw_poi_content'>"+json.content+"</div>");
               return iw;
           }
           //创建一个Icon
           function createIcon(json){
               var icon = new BMap.Icon("http://app.baidu.com/map/images/us_mk_icon.png", new BMap.Size(json.w,json.h),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(json.x,json.h)});
               return icon;
           }

           initMap();//创建和初始化地图
       }
   };
   Contact.init();
});