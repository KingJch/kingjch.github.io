$(function() {

	var $wapper = $('.wapper'),
		$section1 = $('.section1'),
		$section2 = $('.section2'),
		$section3 = $('.section3'),
		$section4 = $('.section4'),
		$loadWapper = $('.load-waper'),
		$loadSouce = $('.source-num span'),
		$arrows = $('.arrows'),
		$page = $('.page'),
		$calendar = $('.calendar'),
		$blackboard = $('.writing-table'),
		$words = $('.words'),
		$calendarWapper = $('.calendar-wapper'),
		$landscape = $('.landscape'),
		$mountain = $('.mountain'),
		$center = $('.center'),
		$typeWapper = $('.type-wapper'),
		$To = $typeWapper.find('.To'),
		$sayContent = $typeWapper.find('.say-content'),
		$from = $typeWapper.find('.from'),
		$typeAudio = $('.typing-audio')[0],
		$birthdayAudio = $('.birthday-audio')[0];

	var imgSource = [
		"../images/no-color-cake.png",
		"../images/color-cake.png",
		"../images/wall-bg.png",
		"../images/wall.png",
		"../images/blackboard.png",
		"../images/door.png",
		"../images/landscape.png",
		"../images/flowers.png",
		"../images/sign.png",
		"../images/maple-leaf2.png",
		"../images/maple-leaf1.png",
		"../images/cloud.png",
		"../images/top-side.png",
		"../images/left1.png",
		"../images/left1-in.png",
		"../images/left2.png",
		"../images/left2-in.png",
		"../images/center.png",
		"../images/right1.png",
		"../images/right1-in.png",
		"../images/right2.png",
		"../images/right2-in.png",
		"../images/landscape.png",
		"../images/typing-bg.jpg"
	];
	var music_src = [
    "../audio/typing.wav",
    "../audio/birthday-song.mp3",
	];


	for(var i=0;i<music_src.length;i++){
	    loadAudio(music_src[i],function(){
	    });
	}
	new mo.Loader(imgSource,{
		onLoading : function(count,total){
		    $loadSouce.text("(" + parseInt(count/total*100) + "%)");
		},
		onComplete : function(time){
		    $loadSouce.text("(100%)");

		    setTimeout(function(){
		        $loadWapper.css('display','none');
		    }, 200);
		    $section1.show();
		    
		    callbackArr.functionList[0]();
		}
	});

var callbackArr = {
	page: 0,
	slideAble: false,
	functionList: [
		function() {
			/* 监听变换事件! */

			$section2.hide();
			$section3.hide();
			$section4.hide();
			$section1.show();
			$calendarWapper.removeClass('scale-calendar');
			$page[2].addEventListener('webkitAnimationEnd', function() {
				var calendar_timer = setTimeout(function() {
					$calendar.addClass('rotate-calendar');
					clearTimeout(calendar_timer);
				},150);
				var blackboard_timer = setTimeout(function() {
						$blackboard.addClass('rotate-blackboard');
						clearTimeout(blackboard_timer);
						$words.addClass('writing-animation');
					},550);
			},false);
			$words[0].addEventListener('webkitAnimationEnd',function() {$arrows.show();callbackArr.slideAble = true;},false);
		},
		function() {
			callbackArr.slideAble = false;
			$arrows.hide();
			$calendarWapper.addClass('scale-calendar');
			$section1.hide();
			$section2.show();
			$section3.hide();
			$section4.hide();
			setTimeout(function() {$landscape.show();},1200);
		},
		function() {
			callbackArr.slideAble = false;
			$arrows.hide();
			$section1.hide();
			$section2.hide();
			$section3.show();
			$section4.hide();
			$center[0].addEventListener('webkitAnimationEnd',function() {$arrows.show();callbackArr.slideAble = true;},false);
		},
		function() {
			callbackArr.slideAble = false;
			$arrows.hide();
			$section1.hide();
			$section2.hide();
			$section3.hide();
			$section4.show();
			

			var toContent = "To someone:";
			var sayContent = "有很多想说的，但又不知该如何讲起！但还是要说：祝你生日快乐!";
			var fromContent = "From Jch";

			var toObj = new typing(toContent, $To);
				toObj.writing()();

			var typingDelay = 300;
			var sayDelay = toContent.length*typingDelay + 500;
			var fromDelay = sayContent.length*typingDelay + sayDelay + 500;
			setTimeout(function() {
				var sayObj = new typing(sayContent, $sayContent);
					sayObj.writing()();
				},sayDelay);

			setTimeout(function() {
				var fromObj = new typing(fromContent, $from);
					fromObj.writing()();
				},fromDelay);
			$typeAudio.play();

		}
	]

};

	/**
	*typing
	*/
	function typing(string, obj) {
			this.obj = obj;
			this.string = string;
			this.stringL = string.length;
			this.writingL = 0;
		}

	typing.prototype.writing = function() {
		var _this = this;
		var timer;
		return (function() {
			_this.obj.append(_this.string[_this.writingL]);
			_this.writingL++;
			timer = window.setTimeout(arguments.callee, 300);
			if(_this.writingL >= _this.stringL && _this.obj == $from) {
				window.clearTimeout(timer);
				stopVoice($typeAudio);
				$birthdayAudio.play();
			}
		});
	}
	function stopVoice(elem){
	    elem.pause();
	    elem.currentTime = 0.0;
	}
	function loadAudio(src, callback) {
    var audio = new Audio(src);
    audio.onloadedmetadata = callback;
    audio.src = src;
	}
/**touchEvent
 * open the door
 */
var openHandle = (function(target, opt) {
	var ww = $(window).width(),
		$flowers = $('.flowers'),
		$sign = $('.sign'),
		$mountain = $('.mountain'),
		$mapleLeaf = $('.maple-leaf1'),
		isDrawL = false,
		isDrawR = false;
	function touchHandler(target) {
		var _this = this;
			this.target = target;
			this.startX = 0;
			this.startY = 0;
			this.leftX = 0;
			this.rightX = 0;
		target.on('touchstart', function(e) {
			_this.startEvent.call(_this,e);
		});
		target.on('touchmove', function(e) {
			_this.moveEvent.call(_this,e);
		});
		target.on('touchend', function(e) {
			_this.endEvent.call(_this,e);
		});
		target.on('touchcancle', function(e) {
			_this.cancleEvent.call(_this,e);
		});
	}

	touchHandler.prototype.startEvent = function(e) {
		this.startX = e.changedTouches[0].pageX;
		this.startY = e.changedTouches[0].pageY;
		if(this.startX < ww/2) isDrawL = true;
		else isDrawL = false;
		if(this.startX > ww/2) isDrawR = true;
		else isDrawR = false;
	}
	touchHandler.prototype.moveEvent = function(e) {
		var moveX = Math.abs(e.changedTouches[0].pageX);
		if(isDrawL) {
			this.leftX = ww/2 - moveX;
			this.target.css('-webkit-transform','translate3d(-'+ this.leftX+'px,0,0)');
		}
		if(isDrawR) {
			this.rightX = moveX - ww/2 > 0 ? moveX - ww/2 : 0;
			this.target.css('-webkit-transform','translate3d('+ this.rightX+'px,0,0)');
		}
	}
	touchHandler.prototype.endEvent = function(e) {
		if(isDrawL) this.target.css('-webkit-transform','translate3d(-'+ this.leftX+'px,0,0)');
		if(isDrawR) this.target.css('-webkit-transform','translate3d('+ this.rightX +'px,0,0)');
		if(this.rightX >= ww*2/5) $sign.addClass('sign-ainmate');
		if(this.leftX >= ww*2/5) $flowers.addClass('flowers-animate');
		if($sign.hasClass('sign-ainmate') &&　$flowers.hasClass('flowers-animate')) {
				$mountain.addClass('mountain-animate');
				$arrows.show();
				callbackArr.slideAble = true;
			}
	}
	touchHandler.prototype.cancleEvent = function(e) {
		isDrawL = false;
		isDrawR = false;
	}
	var $leftDoor =  $('.door-left');
	var $rightDoor = $('.door-right');
	new touchHandler($leftDoor, opt);
	new touchHandler($rightDoor, opt);
})();
var handler = function(event){
    switch(event['type']){
        case 'swipeup':
            if(callbackArr.slideAble) {
            	callbackArr.page++;
            	if (callbackArr.page >= 4) {
            		callbackArr.page = 4;
            	}
            	callbackArr.functionList[callbackArr.page]();
            }
            
            break;
        case 'swipedown':
           if(callbackArr.slideAble) {
           		callbackArr.page--;
           		if (callbackArr.page < 0) {page = 0;}console.log(callbackArr.page);
            	callbackArr.functionList[callbackArr.page]();
            }

            break;

    }
      
}
var target = document;
var gest = new mo.Gesture(target).addGesture('swipeup swipedown', handler);
});

