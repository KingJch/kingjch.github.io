var phoneWidth = parseInt(window.screen.width);
var phoneScale = phoneWidth/640;

var ua = navigator.userAgent;
if (/Android (\d+\.\d+)/.test(ua)){
	var version = parseFloat(RegExp.$1);
	// andriod 2.3
	if(version>2.3){
		document.write('<meta name="viewport" content="width=640, minimum-scale = '+phoneScale+', maximum-scale = '+phoneScale+', target-densitydpi=device-dpi">');
	// andriod 2.3以上
	}else{
		document.write('<meta name="viewport" content="width=640, target-densitydpi=device-dpi">');
	}
	// 其他系统
} else {
	document.write('<meta name="viewport" content="width=640, user-scalable=no, target-densitydpi=device-dpi">');
}

var alertTip = {

	// //弹出的dom结构
	// 错误的提示
	errorTip: function(content, f, time) {
		if(typeof f === 'function'){
				layer.open({
				    content: content,
				    time: time?time:10,
				    success: function(elem){
					    f();
					}   
				});
		}
		else{
			layer.open({
			    content: content,
			    time: time?time:2
			});
		}
	}
};

var publicDom = {

	// 一些配置项
	config: {
		rootUrl: "http://120.85.132.110:9090",
		url: "http://120.85.132.110:9090/UiOperation.ashx", // 请求接口的url
		storage: "", // 这个是localStorage的对象存储
		storageName: "accountMsgEl", // 本地storage的item的名字
		videoTimer: 1, // 通知后台观看视频 分钟单位
		operatorId: "", // 
		type: "LeaningManager", // 请求的类型
		securityType: "PortalSecurity", // 门户安全类型
		userDafultImg: "../../plugins/img/head-pic-default.png", // 默认用户头像
		loginUrl: 'login.html'
	},

	ctrl : {

		//把input file 转换成 base64
		convert2Base64 : function(input){
			if(input.type !== 'file')
				throw Error('Type error!');
			var file = input.files;
			if(file.length === 0)
				throw Error('Empty file');
			file = file[0];
			var reader;
			try{
				reader = new FileReader();
			}
			catch(e){
				throw Error('Do not support image preview.');
			}
			var dtd = $.Deferred();
			reader.onload = function(evt){
	        	dtd.resolve(evt.target.result);
	        };
	        reader.readAsDataURL(file);

	        return dtd;//返回Deferred对象
	    },

	    /**
	     * 获取等级对应的图标
	     * 直接返回需要渲染的dom
	     */
	    getLevel : function() {
	    	var totalPoint = publicDom.getStorageParam('TotalPoint');
	    	var LEVEL_STAR = 'level-star';
	    	var LEVEL_MASTER = 'level-master';
	    	var LEVEL_DIAMOND = 'level-diamond';
	    	var MAX_ICON_COUNT = 4;//最多展示的图标数量

	    	//range表示方法为 (]
	    	var LEVEL = [
	    		{
	    			range : -Infinity,
	    			name : '',
	    			icon : LEVEL_STAR,
	    			count : 1
	    		},
	    		{
	    			range : 0,
	    			name : '新人',
	    			icon : LEVEL_STAR,
	    			count : 2
	    		},
	    		{
	    			range : 10,
	    			name : '小学生',
	    			icon : LEVEL_STAR,
	    			count : 3
	    		},
	    		{
	    			range : 30,
	    			name : '中学生',
	    			icon : LEVEL_STAR,
	    			count : 4
	    		},
	    		{
	    			range : 90,
	    			name : '高中生',
	    			icon : LEVEL_MASTER,
	    			count : 1
	    		},
	    		{
	    			range : 140,
	    			name : '大学生',
	    			icon : LEVEL_MASTER,
	    			count : 2
	    		},
	    		{
	    			range : 200,
	    			name : '研究生',
	    			icon : LEVEL_MASTER,
	    			count : 3
	    		},
	    		{
	    			range : 250,
	    			name : '博士',
	    			icon : LEVEL_MASTER,
	    			count : 4
	    		},
	    		{
	    			range : 300,
	    			name : '博士后',
	    			icon : LEVEL_DIAMOND,
	    			count : 1
	    		},
	    		{
	    			range : 350,
	    			name : '教授',
	    			icon : LEVEL_DIAMOND,
	    			count : 2
	    		},
	    		{
	    			range : 400,
	    			name : '教授',
	    			icon : LEVEL_DIAMOND,
	    			count : 3
	    		},
	    		{
	    			range : 450,
	    			name : '教授',
	    			icon : LEVEL_DIAMOND,
	    			count : 4,
	    			suffix : '<i class="level-icon">N</i>'
	    		},
	    		{
	    			range : Infinity,
	    			name : '教授N',
	    			icon : LEVEL_DIAMOND,
	    			count : 4
	    		},
	    	];
	    	for(var i = 0,len = LEVEL.length; i<len-1; i++) {
	    		var low = LEVEL[i].range;
	    		var high = LEVEL[i+1].range;
	    		if(low < totalPoint && totalPoint <= high) {
	    			break;
	    		}
	    	}
	    	var domStr = '';
	    	for(var j = 0, len = LEVEL[i].count; j<len; j++) {
	    		domStr += '<i class="level-icon '+ LEVEL[i].icon + '"></i>';
	    	}
	    	if(LEVEL[i].suffix) {
	    		domStr += LEVEL[i].suffix;
	    	}

	    	var gap = LEVEL[i+1].range - totalPoint + 1;
	    	var originGap = LEVEL[i+1].range - LEVEL[i].range;
	    	if(gap === Infinity) {
	    		gap = (gap - 450)%50;
	    		originGap = 50;
	    	}
	    	return {domStr : domStr, gap : gap, status : LEVEL[i].name, nextStatus : LEVEL[i+1].name, originGap : originGap };
	    },
	},
	
	//获取localstorage里面的用户信息
	getStorageParam : function(key, value){
		var storage = publicDom.config.storage;//reference of localstorage object
		storage = storage || JSON.parse(localStorage.getItem(publicDom.config.storageName));
		if(value === undefined)//read
			return storage[key];
		storage[key] = value;
		localStorage.setItem(publicDom.config.storageName, JSON.stringify(storage));
	},

	// 获取url的参数
	getParamByUrl: function() {

	   var url = window.location.search; //获取url中"?"符后的字串
	   var theRequest = {};

	   if (url.indexOf("?") !== -1) {

	      var str = url.substr(1),
	      	  strs = str.split("&");
	      for(var i = 0; i < strs.length; i ++) {

	         theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
	      }
	   }
	   return theRequest;
	},

	// 获取页面的token等信息
	getParam: function(methodVal, typeVal) { 

		var storage = JSON.parse(localStorage.getItem(publicDom.config.storageName)),
			accountToken,
			accountBUId;

		if(storage) { 
			accountToken = storage.Token;
			accountBUId = storage.BUId;
		} else { // 如果没打开过这个网，或者注销了用户之后，去其他页面会弹出登录
			
			alertTip.errorTip('请登录', function() {

				window.location.href = publicDom.config.loginUrl;
			},1000);
		}

		publicDom.config.operatorId = storage.UserID;
		publicDom.config.storage = storage;
		return {
			token: accountToken,
			buId: accountBUId,
			method: methodVal,
			type: typeVal ? typeVal : publicDom.config.type
		};
	},
	

	// 请求数据接口
	getData: function(type, url, param, f, isAsync, err) {
		publicDom.getDataNoCheck(type, url, param, f, isAsync, err);
	},


	//请求数据接口(不检查是否过期)
	getDataNoCheck: function(type, url, param, f, isAsync, err) {
		var ajaxParam  = {
			type: type,
			url: url,
			data: param,
			async: isAsync !== false,
			timeout: 60000,
			success: function(data) {
				
				var jsonData;
				try{
					jsonData = $.parseJSON(data);

				}catch(e) { // 返回值不是json格式
					
					if(typeof f !== 'function') { // 如果没有回调函数,抛出异常。

						throw new Error('请求数据之后，没有回调函数!');
					}
					f(data);
					return;
				}
				if(jsonData.errorCode === -1||jsonData.errorCode === -2){
					// 如果token过期了
					alertTip.errorTip('用户超时!', function() {

						window.localStorage.removeItem(publicDom.config.storageName);
						window.localStorage.removeItem("timer");
						window.localStorage.removeItem(publicDom.config.appDomStorage);
						window.localStorage.removeItem(publicDom.config.platformDomStorage);
						window.localStorage.removeItem(publicDom.config.basicManageStorage);
						window.location.href = publicDom.config.loginUrl;
					},2000);
					
				} else {

					if(typeof f !== 'function') { // 如果没有回调函数,抛出异常。

						throw new Error('请求数据之后，没有回调函数!');
					}
					// 没过期。执行下面函数。
					f(data);
				}
			},
			error: function(xhr,textStatus) {
				alertTip.errorTip('无法连接服务器', err);
			}
		};
		$.ajax(ajaxParam);
	},

	// 检测权限
	checkPower: function(roleKey, f) {
		var url = this.config.url,
			param = publicDom.getParam('IsInRoleKey',this.config.securityType),
			newParam = {
				type: param.type,
				method: param.method,
				BUId: param.buId,
				token: param.token,
				userId:  publicDom.getStorageParam('UserID'),
				RoleKey: roleKey
			};
		function callBack(data) {

			if(data === 'True') {

				f(true);
			} else {

				f(false);
			}
		}
		publicDom.getDataNoCheck('post', url, newParam, callBack, false);
	},

	//一些基本的校验工具函数
	validate : {
		//校验字符串取出所有空格，换行符后是否为空
		isEmpty : function(str){
			return str.replace(/\s*/g,'').length === 0;
		}
	},

	// 暂存数据
	tempData: {
		manager: ''
	},

	// 时间戳
	timer: ''
};