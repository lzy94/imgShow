(function($) {

	$.fn['showImg'] = function(option) {
		var defaults = {
			url: "",
			rotio: 1.2,
		}
		this.option = $.extend({}, defaults, option);
		var $img,
			$EimgCon,
			$image,
			$imgContainer,
			startW,
			startH;

		var metheds = {
			__init: function() {
				var self = this;
				this.__reader(function() {
					setTimeout(function() {
						self.__img();
						self.__event();

					}, 100)
				});
			},
			__reader: function(callback) {
				//渲染
				var html = '<div class="showimg-mask"><div class="img-container"><div class="close-img">×</div>' +
					'<div class="img-con"><div class="img">' +
					'<img src="' + this.option.url + '" draggable="false"/>' +
					'</div></div><div class="img-show-bot"><i class="enlarge"></i><i class="narrow"></i><i class="rotate"></i></div></div></div>';

				this.append(html);

				$img = this.children(".showimg-mask").children(".img-container").children(".img-con").find(".img"),
					$EimgCon = this.children('.showimg-mask').children(".img-container");
				if($img.find("img")[0]) {
					if(typeof callback === "function") {
						callback();
					}
				}

			},
			__event: function() {
				//事件监听
				var self = this;
				//普通点击事件监听
				$EimgCon.find(".close-img").click(function(e) {
					//叉叉
					e.stopPropagation();
					$(this).parents(".showimg-mask").remove();
				}).nextAll(".img-show-bot").children(".enlarge").click(function() {
					//放大按钮
					self.__biggerImage();
				}).next(".narrow").click(function() {
					//缩小按钮
					self.__smallerImage();

				}).next(".rotate").click(function() {
					//旋转按钮
					console.log('旋转')
				});
				self.__browserRedirect(function(e) {
					if(e == "PC") {
						self.__mousePCEvent();
					} else {
						self.__mobileEvent();
					}
				})

				//监听窗口变化
				$(window).resize(function() {
					setTimeout(function() {
						self.__img();
					}, 1000);
				})

			},
			/**
			 * 计算图片
			 */
			__img: function() {
				//计算img及其父元素宽高
				//获取父容器
				$imgContainer = this.children(".showimg-mask").children(".img-container");
				//获得图片
				$image = $imgContainer.children(".img-con").find("img");
				var w = $image.width(),
					h = $image.height();
				//外层容器大小
				var imgCW = $imgContainer.width(),
					imgCH = $imgContainer.height();
				//图片新宽，新高
				if((w / h) >= 1) {
					startW = imgCW,
						startH = h * imgCW / w;
					$image.width(startW).height(startH);
					this.__imgM(imgCW, startW, imgCH, startH);
				} else {
					startW = imgCH * w / h,
						startH = imgCH;
					$image.width(startW).height(startH);
					//获取图片许偏移量
					this.__imgM(imgCW, startW, imgCH, startH);
				}
			},

			/**
			 * 设置图片偏移量
			 * @param {Object} imgCW 父容器 宽
			 * @param {Object} newW  图片宽
			 * @param {Object} imgCH 父容器高
			 * @param {Object} newH  图片高
			 */
			__imgM: function(imgCW, newW, imgCH, newH) {
				//获取图片许偏移量
				var left = (imgCW - newW) / 2,
					top = (imgCH - newH) / 2;
				//				this.option.imgMsg.css(margin, InerM);
				$image.css({
					"left": left,
					"top": top,
				});
			},
			/**
			 * 放大图片
			 */
			__biggerImage: function() {
				var w = $image.width(),
					h = $image.height(),
					newW = w * this.option.rotio,
					newH = h * this.option.rotio,
					cW = $imgContainer.width(),
					cH = $imgContainer.height();
				if(newW >= 1500) return;
				$image.width(newW).height(newH);
				this.__imgM(cW, newW, cH, newH);
			},
			/*
			 * 缩小图片
			 */
			__smallerImage: function() {
				var w = $image.width(),
					h = $image.height(),
					newW = w / this.option.rotio,
					newH = h / this.option.rotio,
					cW = $imgContainer.width(),
					cH = $imgContainer.height();
				if(newW <= 100) return;
				$image.width(newW).height(newH);
				this.__imgM(cW, newW, cH, newH);
			},
			/**
			 * 判断设备
			 * @param {Object} callback
			 */
			__browserRedirect: function(callback) {
				var sUserAgent = navigator.userAgent.toLowerCase();
				var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
				var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
				var bIsMidp = sUserAgent.match(/midp/i) == "midp";
				var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
				var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
				var bIsAndroid = sUserAgent.match(/android/i) == "android";
				var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
				var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
				if(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
					if(typeof callback === "function") {
						callback("mobile");
					}

				} else {
					if(typeof callback === "function") {
						callback("PC");
					}
				}
			},
			/**
			 * 鼠标事件
			 */
			__mousePCEvent: function() {
				$img.find("img").on('mousedown', function(e) {
					var x = e.offsetX,
						y = e.offsetY;
					$(this).on("mousemove", function(e) {
						var moveX = e.offsetX - x,
							moveY = e.offsetY - y,
							left = $(this).position().left + moveX,
							top = $(this).position().top + moveY;
						$(this).css({
							"left": left,
							"top": top
						});
						console.log(moveX)
					})
					return false;
				}).on("mouseup", function(e) {
					$(this).off("mousemove");
				}).on("mouseout", function() {
					$(this).off("mousemove");
				}).on("mouseenter", function() {
					$(this).css("cursor", "move")
				})
			},
			/**
			 * 手势事件
			 */
			__mobileEvent: function() {
				$img.find("img").on("touchstart", function(e) {
					var touch = e.originalEvent,
						startX = touch.changedTouches[0].pageX,
						startY = touch.changedTouches[0].pageY;
					$(this).on("touchmove", function(e) {
						e.preventDefault();
						touch = e.originalEvent.touches[0] ||
							e.originalEvent.changedTouches[0];
						var x = y = 4,
							left, top;
							console.log(touch.pageX - startX)
						if(touch.pageX - startX > 10) {
							left = $(this).position().left + x;
						} else if(touch.pageX - startX < -10) {
							left = $(this).position().left - x;
						}
						if(touch.pageY - startY > 10) {
							top = $(this).position().top + y;
						}
						if(touch.pageY - startY < -10) {
							top = $(this).position().top - y;
						};
						$(this).css({
							"top": top,
							"left": left
						})

					})
				}).on('touchend', function(e) {
					console.log("touchend")
					$(this).off("touchmove");
				})
			}

		}

		$.extend(this, metheds);
		this.__init();
	}
})(jQuery)