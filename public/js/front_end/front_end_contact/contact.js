/**
 * Created by Administrator on 2017/4/5.
 */
$(function () {
   var Contact = {
       init: function () {
           this.bindEvent();
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
           $('#contact_form').parsley().on('field:validated', function() {
               var ok = $('.parsley-error').length === 0;
           }).on('form:submit', function() {
               alert('111');
                   return false; // Don't submit form for this demo
               });
       }
   };
   Contact.init();
});