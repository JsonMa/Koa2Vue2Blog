/**
 * Created by Mahao on 2016/10/26.
 */
;(function(){

	// header导航
	var $link = $('.nav-container');

	// nav control
	$link.mouseover(function () {
		$(this).find('ul').stop().fadeIn();
	}).mouseout(function () {
		$(this).find('ul').stop().fadeOut();
	});

	// email control
	var $mail = $('.mail');
	$(".mail i.close").click(function(){$mail.fadeOut()});
	$(".resume").click(
		function(){
			$mail.fadeIn();
		}
	);

	// IOT Module
	if (!window.IOT) {
		window.IOT = {};
	}
	/**
	 * @Class Dialog
	 * @Desc 对话框模块
	 * 可以用j_dlg_close来标记关闭按钮
	 * ui-dialog-bd代表容器主体，具有20px的margin
	 * ui-dialog-btn代表btn的容器，具有20px的padding和灰色背景。这个容器里的所有.button类都有右边距15px
	 * */
	function Dialog(options){
		this._options = $.extend(true, {
			title: '', //标题
			content: '', //内容
			beforeClose: null, //调用close方法时执行的callback，如果此callback返回false则会阻止窗口的关闭
			showClose: true, //是否显示右上角关闭按钮
			className: '', //自定义弹出框类名
			cache: false, //是否缓存。若为false则close的时候会remove掉对话框对应的dom元素
			showOk: true, //显示确定按钮
			okText: '确定', //确定按钮的文字
			okCallback: null, //确定按钮的回调
			showCancel: true, //是否显示取消按钮
			cancelText: '取消', //取消按钮的文字
			cancelCallback: null //取消按钮的回调
		}, options);

		this._init();
	}
	$('.to-contact-me').click(function(){
		var g_dialog = new IOT.Dialog({
			title: '联系我们',
			content: "<div>电话：123456,123456789</div>",
			showClose: false,
			cache: false,
			showOk: false,
			showCancel: false
		});
		g_dialog.open();
	});
	$.extend(Dialog.prototype, {
		_init: function(){
			this._build();
			this._bindEvent();
		},
		/**
		 * 创建对话框html
		 * */
		_build: function(){
			var options = this._options;
			var html = '<div class="modal fade ' + options.className + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
				'<div class="modal-dialog" role="document">' +
				'<div class="modal-content">' +
				'<div class="modal-header">' +
				(options.showClose ? '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' : '' ) +
				(options.title ? '<h4 class="modal-title">'+ options.title +'</h4>' : '') +
				'</div>'+
				'<div class="modal-body">'+

				'</div>';
			if(options.showOk || options.showCancel){
				html += '<div class="modal-footer">'+
					(options.showOk ? '<button type="button" class="btn btn-primary j_ok" data-dismiss="modal">' + options.okText + '</button>' : '') +
					(options.showCancel ? '<button type="button" class="btn btn-default j_cancel">' + options.cancelText + '</button>' : '') +
					'</div>';
			}

			html += '</div>'+
				'</div>'+
				'</div>';
			this.$root = $(html).appendTo(document.body);
			if(typeof options.content == 'string'){
				options.content = '<div>'+options.content+'</div>';
			}
			this.$root.find('.modal-body').append($(options.content || ''));
			if(this._options.cache === false){ //设置不缓存
				var _this = this;
				this.$root.on('hidden.bs.modal', function (e) {
					_this.$root.remove();
					_this.$root = null;
				});
			}
		},
		_bindEvent: function(){
			var _this = this;
			var options = this._options;
			this.$root.on('click', '.j_dlg_close', function(e){
				e.preventDefault();
				//beforeClose执行结果为false,说明关闭时间被阻止了
				if(options.beforeClose && options.beforeClose.apply(_this) === false){
					return false;
				}
				_this.close();
				if(options.onclose){
					options.onclose.apply(this);
				}
			}).on('click', '.j_ok', function(){
				options.okCallback && options.okCallback.apply(_this);
			}).on('click', '.j_cancel', function(){
				options.cancelCallback && options.cancelCallback.apply(_this);
			});

		},
		/**
		 * 打开对话框
		 * */
		open: function(){
			this.$root.modal({

			});
		},
		/**
		 * 关闭对话框
		 * */
		close: function(){
			this.$root.modal('hide');
		},
		/**
		 * 设置标题
		 * */
		setTitle: function(title){
			this.$root.find('.ui-dialog-tit em').html(title);
		},
		/**
		 * 设置内容
		 * */
		setContent: function(content){
			this.$root.find('.ui-dialog-bd').html(content);
		}
	});

	Dialog.confirm = function(message, ok, cancel){
		var confirmDialog = new IOT.Dialog({
			title: '系统提示', //标题
			content: message, //内容
			beforeClose: null, //调用close方法时执行的callback，如果此callback返回false则会阻止窗口的关闭
			showClose: true, //是否显示右上角关闭按钮
			className: '', //自定义弹出框类名
			cache: false, //是否缓存。若为false则close的时候会remove掉对话框对应的dom元素
			showOk: true, //显示确定按钮
			okText: '确定', //确定按钮的文字
			okCallback: function(){
				ok && ok.call(this);
				confirmDialog.close();
			}, //确定按钮的回调
			showCancel: true, //是否显示取消按钮
			cancelText: '取消', //取消按钮的文字
			cancelCallback: function(){
				cancel && cancel.call(this);
				confirmDialog.close();
			} //取消按钮的回调
		});
		confirmDialog.open();
	};
	IOT.Dialog = Dialog;

})();


/**
 * Created with JetBrains PhpStorm.
 * Desc: tips提示
 * Author: limengjun
 * Date: 14-8-19
 * Time: 上午11:01
 *
 *  IOT.tips('操作成功','success', 3000)  第二个参数可以传
 info: 信息提示
 error: 错误提示,
 warning: 警告
 success: 成功，默认success
 第三个参数是时间，单位毫秒，默认3000
 */
(function(){
	function Tips(options){
		this.content = options.content;
		this.type = options.type;
		this.width = options.width;
		this._config = {
			iconFont: {
				'info': 'fa-info-circle',
				'error': 'fa-times',
				'warning': 'fa-exclamation-circle',
				'success': 'fa-check-circle'
			},
			className: {
				'info': 'standard',
				'error': 'alert',
				'warning': 'warning',
				'success': 'success'
			}
		};
	}
	Tips.prototype = {
		create: function(){
			var ctml=[];
			ctml = ['<div class="alert-box alert-box-pop '+ this._config.className[this.type] +'">'];
			ctml.push('<i class="fa ' + this._config.iconFont[this.type] + '"></i>');
			ctml.push(this.content);
			ctml.push('</div>');

			var objHtml = $(ctml.join(''));
			objHtml.appendTo(document.body);
			return objHtml;
		},
		resetPosition: function(obj){
			var width = obj.width();
			var height = obj.height();
			var scroll = $(window).height() / 2;
			obj.css({
				'margin-left':-width/2-45/2,
				'top': -height/2+scroll+15,
				position: 'fixed',
				left: '50%'
			});
			obj.animate({
				top:-height/2+scroll
			},400);
		},
		hideClose: function(obj){
			obj.remove();
		}
	};
	//创建弹窗主体
	//外部可以扩展
	IOT.tips = function(content, type, timeout){
		timeout = timeout || 3000;
		if(/^\s*$/.test(content) || !content) return false;
		var tip = new Tips({content:content,type:type || "success",timeout:timeout});
		tip.hideClose($('.tisp-'+type))
		var html = tip.create();
		tip.resetPosition(html);
		setTimeout(function(){
			tip.hideClose(html);
		}, timeout);
	};
})();
(function (){
	if(!window.IOT){
		window.IOT = {};
	}
	IOT.post = function(){
		var len = 0;
		var callBack; //回调函数
		var args = [];
		while(arguments[len]){
			if(typeof arguments[len] == 'function'){ //找到了callback
				callBack = arguments[len++];
				args.push(function(){}); //必须第三个参数为function否则第四个参数(json)不会被识别
			}else{
				args.push(arguments[len++]);
			}
		}
		callBack = callBack || function(){}; //若没有回到函数，则默认为空
		$.post.apply($, args).done(function(res){
			callBack.call(this, res);
		}).fail(function(res){
			IOT.tips('请求失败，请稍后再试', 'warning', 3000);
			callBack.call(this, false);
		});
	};
	IOT.button = {
		/**
		 * addLoading form提交的时候给按钮加上laoding图标，更改按钮文字为提交状态，给$button打上正在提交的标签
		 * @param $button 提交按钮
		 * @param buttonContent 提交按钮的innerHTML（不包含图标）
		 * @param buttonIcon 提交按钮图标 如果不传此参数则没有提交按钮。 loading：菊花按钮(目前就只有菊花按钮)
		 * */
		addLoading: function($button, buttonContent, buttonIcon){
			$button.data('isloading', true);

			buttonContent && ($button.html(buttonContent));

			if(buttonIcon){
				var iconHtml = {
					'loading': '<i class="fa fa-spinner fa-pulse fa-1x fa-fw"></i>'
				};
				if(iconHtml[buttonIcon]){
					$(iconHtml[buttonIcon]).prependTo($button);
				}
			}
		},

		/**
		 * removeLoading form提交后取消laoding图标，更改按钮文字为默认状态，取消$button正在提交的标签
		 * @param $button 提交按钮
		 * @param buttonContent 提交按钮的innerHTML（不包含图标）
		 * @param buttonIcon 提交按钮图标 如果不传此参数则没有提交按钮。 loading：菊花按钮(目前就只有菊花按钮)
		 * */
		removeLoading: function($button, buttonContent, buttonIcon){
			$button.data('isloading', false);

			buttonContent && ($button.html(buttonContent));

			if(buttonIcon){
				var iconHtml = {
					'loading': '<i class="fa fa-spinner fa-pulse fa-1x fa-fw"></i>'
				};
				if(iconHtml[buttonIcon]){
					$(iconHtml[buttonIcon]).prependTo($button);
				}
			}
		},
		/**
		 * isLoading 是否正在提交中
		 * @param $button 提交的button
		 * */
		isLoading: function($button){
			return $button.data('isloading');
		}
	};

	/**
	 * 显示服务器报错，服务器返回的错误信息可以是字符串或者对象，如果是对象则包含了错误字段及其对应错误值。目前只显示第一个错误值，忽略其他信息
	 * */
	IOT.showPostError = function(resultMessage, defaultMessage, $postForm, type, during){
		resultMessage = resultMessage || '';
		defaultMessage = defaultMessage || '操作失败,请稍后再试';
		type = type || 'error';
		during = during || 3000;

		//如果服务器返回的resultMessage是对象，显示第一个属性对应的值
		if(typeof resultMessage == 'object'){
			for(var i in resultMessage){
				IOT.tips(resultMessage[i], type, during);
				$postForm && $postForm.find('[name="'+ i +'"]').focus();
				return;
			}
		}

		//15823505830

		//如果服务器返回的resultMessage是字符串，直接显示
		if(typeof resultMessage == 'string' && resultMessage != ''){
			defaultMessage = resultMessage;
		}

		IOT.tips(defaultMessage, type, during);

	};

	IOT.setI18n = function (lang, uri) {
		var date = new Date();
		date.setTime(date.getTime() - 10000);
		document.cookie = 'LANG=""; expires=' + date.toGMTString() + '; path=/';
		date = new Date();
		date.setTime(date.getTime() + 1000*60*60*24*365);
		document.cookie = 'LANG=' + lang + '; expires=' + date.toGMTString() + '; path=/';
		window.location = uri;
	};
	//读取文本
	IOT.readAsText = function(ele,callback){

		if(!_.isFunction(callback)){
			callback = function(){};
		}

		$(ele).on("change",function(e){
			var $ele = $(this);
			var files = this.files[0];
			if(files){
				var reader = new FileReader();
				reader.onload = function(evt){
					var fileString = evt.target.result;
					setTimeout(function(){
						callback(fileString);
					}, 0);
				};
				reader.readAsText(files, "UTF-8");
				$ele.val("");
			}
		});
	};
	//获取地址栏参数
	IOT.getQueryParam = function(){
		var keys = arguments;
		var queryParam = function() {
			this.get = function() {
				var name, value;
				var str = this.href || window.location.href;
				str = str.split("#")[0];
				var num = str.indexOf("?");
				str = str.substr(num + 1); // 取得所有参数 stringvar.substr(start [,length ]
				var arr = str.split("&"); // 各个参数放到数组里
				var param = {};
				for (var i = 0; i < arr.length; i++) {
					num = arr[i].indexOf("=");
					if (num > 0) {
						name = arr[i].substring(0, num);
						value = arr[i].substr(num + 1);
						if (param[name]) {
							var array = param[name];
							if (!(array instanceof Array)) {
								array = [array];
							}
							array.push(value);
							param[name] = array;
						} else {
							param[name] = value;
						}
					}
				}
				var len = keys.length;
				if (len == 1) {
					return param[keys[0]];
				}
				else if(len >= 2){
					var data = {};
					for (var i = 0; i < len; i++) {
						var key = keys[i];
						key && (data[key] = param[key]);
					}
					return data;
				}
				return param;
			};
			return this;
		};
		var query = new queryParam();
		return query.get.apply(this);
	};
	//获取表单数据
	IOT.formData = new function(){
		var that = this;
		var transform = function(value){
			var tmp;
			try{
				tmp = JSON.parse(value);
			}
			catch(e){
				tmp = value;
			}
			return tmp;
		};
		this.elements = function(form){
			form.get && (form = form.get(0));
			var data = {},
				param = {},
				elements = form.elements || ((form.getElementsByTagName("form")[0]||{}).elements || false);
			if(elements == false){
				var list = [];
				var button = form.getElementsByTagName('button');
				var select = form.getElementsByTagName('select');
				var textarea = form.getElementsByTagName('textarea');
				var input = form.getElementsByTagName('input');
				var eles = [];
				var _toArray = function(_arr){
					var _eles = [];
					for(var i=0,len = _arr.length;i<len;i++){
						_eles.push(_arr[i]);
					}
					return _eles;
				};
				list = list.concat(_toArray(button),_toArray(select),_toArray(textarea),_toArray(input));
				for(var i=0,len = list.length;i<len;i++){
					var item = list[i];
					if (item.name) {
						list[item.name] = item;
					}
				}
				elements = list;
			}
			new function() {
				for (var i = 0, len = elements.length; i < len; i++) {
					var item = elements[i];
					if (item.name) {
						data[item.name] = elements[item.name];
					}
				}
			}();
			new function() {
				for (var key in data) {
					var item = data[key];
					if (typeof item == "function") {
						delete data[key];
					} else if (item) {
						param[key] = item;
					}
				}
			}();
			return param;
		};
		this.format = function(form){
			var data = that.elements(form),
				param = {};
			new function() {
				for (var key in data) {
					var item = data[key];
					if (!item.length && (item.type == "checkbox" || item.type == "radio")) {
						item = [item];
					}
					if (item.length && (item.tagName || "").toLocaleLowerCase() != "select") {
						var value;
						for (var i = 0, len = item.length; i < len; i++) {
							var ele = item[i];
							if(ele.type == "checkbox" || ele.type == "radio"){
								if (ele.checked) {
									if (ele.type == "checkbox") {
										if(value){
											if (!(value instanceof Array)) {
												value = value ? [value] : [];
											}
											value.push(transform(ele.value));
										}
										else{
											value = transform(ele.value);
										}
									} else if (ele.type == "radio") {
										value = transform(ele.value);
									}
								}
							}
							else{
								if(value){
									if (!(value instanceof Array)) {
										value = value ? [value] : [];
									}
									value.push(transform(ele.value));
								}
								else{
									value = transform(ele.value);
								}
							}
						}
						param[key] = value || "";
						value = null;
					} else {
						// param[key] = transform(item.value);
						if (!item.dataset.valueType || item.dataset.valueType.toLocaleLowerCase() != "string"){
							param[key] = transform(item.value);
						}else{
							param[key] = item.value;
						}
					}
				}
			}();
			return param;
		};
		return this;
	}();

	if (window.console && window.console.log) {
		console.log('伊尔流体设备制造有限公司欢迎您的加入。' + "\n");
		console.log('职位列表：'+"http://cqyir.com/join");
	}
})();

// 模拟ES5 Array.prototype.forEach
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(f, oThis) {
		if (!f || f.constructor != Function.toString()) return;
		oThis = oThis || window;
		for (var i = 0, len = this.length; i < len; i++) {
			f.call(oThis, this[i], i, this); //p1 上下文环境 p2 数组元素 p3 索引 p4 数组对象
		}
	}
}

//模拟 ES5 Array.prototype.filter
if (!Array.prototype.filter) {
	Array.prototype.filter = function(f, oThis) {
		if (!f || f.constructor != Function.toString()) return;
		oThis = oThis || window;
		var a = [];
		for (var i = 0, len = this.length; i < len; i++) {
			if (f.call(oThis, this[i], i, this)) a.push(this[i]);
		}
		return a;
	}
}

//模拟 ES5 Array.prototype.map
if (!Array.prototype.map) {
	Array.prototype.map = function(f, oThis) {
		if (!f || f.constructor != Function.toString()) return;
		oThis = oThis || window;
		var a = [];
		for (var i = 0, len = this.length; i < len; i++) {
			a.push(f.call(oThis, this[i], i, this));
		}
		return a;
	}
}

//模拟 ES5 Array.prototype.every
if (!Array.prototype.every) {
	Array.prototype.every = function(f, oThis) {
		if (!f || f.constructor != Function.toString()) return;
		oThis = oThis || window;
		for (var i = 0, len = this.length; i < len; i++) {
			if (!f.call(oThis, this[i], i, this)) return false;
		}
		return true;
	}
}

//模拟 ES5 Array.prototype.some
if (!Array.prototype.some) {
	Array.prototype.some = function(f, oThis) {
		if (!f || f.constructor != Function.toString()) return;
		oThis = oThis || window;
		for (var i = 0, len = this.length; i < len; i++) {
			if (f.call(oThis, this[i], i, this)) return true;
		}
		return false;
	}
}

if (!Object.keys) {
	Object.keys = function(o) {
		if (o !== Object(o)) {
			throw new TypeError('Object.keys called on a non-object');
		}
		var k=[], p;
		for (p in o) {
			if (Object.prototype.hasOwnProperty.call(o,p)) {
				k.push(p);
			}
		}
		return k;
	};
}

//JSON from MDN https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
if (!window.JSON) {
	window.JSON = {
		parse: (function () {
			"use strict";

// This is a function that can parse a JSON text, producing a JavaScript
// data structure. It is a simple, recursive descent parser. It does not use
// eval or regular expressions, so it can be used as a model for implementing
// a JSON parser in other languages.

// We are defining the function inside of another function to avoid creating
// global variables.

			var at,     // The index of the current character
				ch,     // The current character
				escapee = {
					'"': '"',
					'\\': '\\',
					'/': '/',
					b: '\b',
					f: '\f',
					n: '\n',
					r: '\r',
					t: '\t'
				},
				text,

				error = function (m) {

// Call error when something is wrong.

					throw {
						name: 'SyntaxError',
						message: m,
						at: at,
						text: text
					};
				},

				next = function (c) {

// If a c parameter is provided, verify that it matches the current character.

					if (c && c !== ch) {
						error("Expected '" + c + "' instead of '" + ch + "'");
					}

// Get the next character. When there are no more characters,
// return the empty string.

					ch = text.charAt(at);
					at += 1;
					return ch;
				},

				number = function () {

// Parse a number value.

					var number,
						string = '';

					if (ch === '-') {
						string = '-';
						next('-');
					}
					while (ch >= '0' && ch <= '9') {
						string += ch;
						next();
					}
					if (ch === '.') {
						string += '.';
						while (next() && ch >= '0' && ch <= '9') {
							string += ch;
						}
					}
					if (ch === 'e' || ch === 'E') {
						string += ch;
						next();
						if (ch === '-' || ch === '+') {
							string += ch;
							next();
						}
						while (ch >= '0' && ch <= '9') {
							string += ch;
							next();
						}
					}
					number = +string;
					if (!isFinite(number)) {
						error("Bad number");
					} else {
						return number;
					}
				},

				string = function () {

// Parse a string value.

					var hex,
						i,
						string = '',
						uffff;

// When parsing for string values, we must look for " and \ characters.

					if (ch === '"') {
						while (next()) {
							if (ch === '"') {
								next();
								return string;
							}
							if (ch === '\\') {
								next();
								if (ch === 'u') {
									uffff = 0;
									for (i = 0; i < 4; i += 1) {
										hex = parseInt(next(), 16);
										if (!isFinite(hex)) {
											break;
										}
										uffff = uffff * 16 + hex;
									}
									string += String.fromCharCode(uffff);
								} else if (typeof escapee[ch] === 'string') {
									string += escapee[ch];
								} else {
									break;
								}
							} else {
								string += ch;
							}
						}
					}
					error("Bad string");
				},

				white = function () {

// Skip whitespace.

					while (ch && ch <= ' ') {
						next();
					}
				},

				word = function () {

// true, false, or null.

					switch (ch) {
						case 't':
							next('t');
							next('r');
							next('u');
							next('e');
							return true;
						case 'f':
							next('f');
							next('a');
							next('l');
							next('s');
							next('e');
							return false;
						case 'n':
							next('n');
							next('u');
							next('l');
							next('l');
							return null;
					}
					error("Unexpected '" + ch + "'");
				},

				value,  // Place holder for the value function.

				array = function () {

// Parse an array value.

					var array = [];

					if (ch === '[') {
						next('[');
						white();
						if (ch === ']') {
							next(']');
							return array;   // empty array
						}
						while (ch) {
							array.push(value());
							white();
							if (ch === ']') {
								next(']');
								return array;
							}
							next(',');
							white();
						}
					}
					error("Bad array");
				},

				object = function () {

// Parse an object value.

					var key,
						object = {};

					if (ch === '{') {
						next('{');
						white();
						if (ch === '}') {
							next('}');
							return object;   // empty object
						}
						while (ch) {
							key = string();
							white();
							next(':');
							if (Object.hasOwnProperty.call(object, key)) {
								error('Duplicate key "' + key + '"');
							}
							object[key] = value();
							white();
							if (ch === '}') {
								next('}');
								return object;
							}
							next(',');
							white();
						}
					}
					error("Bad object");
				};

			value = function () {

// Parse a JSON value. It could be an object, an array, a string, a number,
// or a word.

				white();
				switch (ch) {
					case '{':
						return object();
					case '[':
						return array();
					case '"':
						return string();
					case '-':
						return number();
					default:
						return ch >= '0' && ch <= '9'
							? number()
							: word();
				}
			};

// Return the json_parse function. It will have access to all of the above
// functions and variables.

			return function (source, reviver) {
				var result;

				text = source;
				at = 0;
				ch = ' ';
				result = value();
				white();
				if (ch) {
					error("Syntax error");
				}

// If there is a reviver function, we recursively walk the new structure,
// passing each name/value pair to the reviver function for possible
// transformation, starting with a temporary root object that holds the result
// in an empty key. If there is not a reviver function, we simply return the
// result.

				return typeof reviver === 'function'
					? (function walk(holder, key) {
					var k, v, value = holder[key];
					if (value && typeof value === 'object') {
						for (k in value) {
							if (Object.prototype.hasOwnProperty.call(value, k)) {
								v = walk(value, k);
								if (v !== undefined) {
									value[k] = v;
								} else {
									delete value[k];
								}
							}
						}
					}
					return reviver.call(holder, key, value);
				}({'': result}, ''))
					: result;
			};
		}()),
		stringify: function (vContent) {
			if (vContent instanceof Object) {
				var sOutput = "";
				if (vContent.constructor === Array) {
					for (var nId = 0; nId < vContent.length; sOutput += this.stringify(vContent[nId]) + ",", nId++);
					return "[" + sOutput.substr(0, sOutput.length - 1) + "]";
				}
				if (vContent.toString !== Object.prototype.toString) {
					return "\"" + vContent.toString().replace(/"/g, "\\$&") + "\"";
				}
				for (var sProp in vContent) {
					sOutput += "\"" + sProp.replace(/"/g, "\\$&") + "\":" + this.stringify(vContent[sProp]) + ",";
				}
				return "{" + sOutput.substr(0, sOutput.length - 1) + "}";
			}
			return typeof vContent === "string" ? "\"" + vContent.replace(/"/g, "\\$&") + "\"" : String(vContent);
		}
	};
}


var $profileImg = $('.profile-detail-img');
var $profileDetail = $('.profile-detail-ul');
$profileImg.on('click', function (e) {
	$profileDetail.toggleClass('hide');
	e.stopPropagation();
	e.preventDefault();
});
$(document).on('click', function(){
	$profileDetail.addClass('hide');
});
$(function () {
	function resizeRender(){
		$('.content').css('min-height', Math.max($(window).height() - 45 - 38, $('.menu').height()));
	}
	resizeRender();
});
