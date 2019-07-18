document.oncontextmenu=false;
var ln_project="newmesone";
var ln_page = "mes";
var com = {};
com.leanway = {};
com.leanway.url = "";
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt) { // author: meizz
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
/**
 * js中更改日期 y年， m月， d日， h小时， n分钟，s秒
 */
Date.prototype.add = function (part, value) {
    value *= 1;
    if (isNaN(value)) {
        value = 0;
    }
    switch (part) {
        case "y":
            this.setFullYear(this.getFullYear() + value);
            break;
        case "m":
            this.setMonth(this.getMonth() + value);
            break;
        case "d":
            this.setDate(this.getDate() + value);
            break;
        case "h":
            this.setHours(this.getHours() + value);
            break;
        case "n":
            this.setMinutes(this.getMinutes() + value);
            break;
        case "s":
            this.setSeconds(this.getSeconds() + value);
            break;
        default:

    }
}

var chars = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C',
      		'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
      		'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];

  com.leanway.generateMixed = function ( n ) {
  	var res = "";
  	for (var i = 0; i < n; i++) {
  		var id = Math.ceil(Math.random() * 35);
  		res += chars[id];
  	}
  	return res;
  }

com.leanway.show = function ( id ) {
	$('#' + id).modal({backdrop: 'static', keyboard: true});
}

com.leanway.isNotEmpty = function ( val ) {
	
	var result = false;
	
	if (val != null && $.trim(val) != "") {
		result = true;
	}
	
	return result;
}


//给form赋值
com.leanway.setFormValue = function (form, data ) {
	
	for ( var item in data) {
		
		if (item != "searchValue") {
			$("#" + form + " #" + item).val(data[item]);
		}
		
	}

}

/**
 * 赋值
 * 
 * $("#form).setFormData(data);
 */
$.fn.setFormData = function (data) {
	for (var key in data) {
		
		var $this = this;
	    var $tag = $this.find('[name=' + key + ']');
	   
	    if ($tag.attr("type")== "radio" || $tag.attr("type")== "checkbox") {
 
	    	$tag.prop('checked',false);
 
	        var item = data[key].toString().split(',');
	     
	        $.each(item, function (i, val) {
	          var $curTag = $this.find('[name=' + key + '][value=' + val + ']');
	          $curTag.prop('checked','true');
	        })
	 	      
        }else {
        	$tag.val(data[key])
         }
	 
	  }
};

/**
 * get方法时参数编码
 * 
 * @param obj
 * @returns
 */
com.leanway.encodeURI = function ( obj ) {
	return encodeURIComponent($.trim(JSON.stringify(obj)));
}

/**
 * 获取table list
 * @param tableObj
 * @returns {Array}
 */
com.leanway.getListTableData = function( tableObj ) {

	var dArray = new Array();

	var dataList = tableObj.rows().data();

	if (dataList != undefined && typeof (dataList) != "undefined"
			&& dataList.length > 0) {

		// 循环遍历Table数据
		for (var i = 0; i < dataList.length; i++) {

			dArray.push(dataList[i]);
		}
	}

	return dArray;
}


/**
 * 把table对象转换成strjson list
 * 
 * @param tableObj
 * @returns {String}
 */
com.leanway.getStrTableData = function( tableObj ) {

	var jsonData = "[";

	var dataList = tableObj.rows().data();

	if (dataList != undefined && typeof (dataList) != "undefined"
			&& dataList.length > 0) {

		// 循环遍历Table数据
		for (var i = 0; i < dataList.length; i++) {

			var productorData = dataList[i];

			jsonData += JSON.stringify(productorData) + ",";

		}
	}
	jsonData = jsonData.replace(reg, "");

	jsonData += "]";

	return jsonData;
}

/**
 * 把form转换成json数据
 * @param formArray
 * @returns {String}
 */
com.leanway.formatForm = function  (formArray) {
	
	var formData = $(formArray).serializeArray();

	var reg=/,$/gi;

	var data = "{";

	for (var i = 0; i < formData.length; i++) {

		var val = formData[i].value;

		data += "\"" +formData[i].name +"\" : \""+val+"\",";

	}

	data = data.replace(reg,"");

	data += "}";

	return data;
}

/**
 * 把form对象数据转成json对象
 * @param formData
 * @returns {String}
 */
com.leanway.formatFormJson = function  (formData) {
	var reg=/,$/gi;

	var data = "{";

	for (var i = 0; i < formData.length; i++) {

		var val = formData[i].value;

		data += "\"" +formData[i].name +"\" : \""+val+"\",";

	}

	data = data.replace(reg,"");

	data += "}";

	return data;
}


function forwardLogout() {
	window.parent.location.href = "../../../"+ln_project+"/user?method=logout&url=" + com.leanway.getHttpUrl();
}

/**
 * 生产指令单
 * 
 * @param printName
 * @param printFile
 * @param detail
 */
com.leanway.sendSCZLDReportData = function (printName, printFile, detail) {
	
	
	if (detail == null || detail.length == 0) {
		lwalert("tipModal", 1, "数据异常，请刷新后再试！");
		return;
	}
	 
	 if (typeof (detail) == "string") {
		 detail = eval("(" + detail + ")");
	 }
	 
	 var groupMap = new Map();
	 
	 // 分组
	for (var g = 0 ; g <detail.length; g++ ) {
		var order = detail[g];
		var gMasterObj = new Object();
		
		for (var key in order) {
			
			if (key != "listDispatchingOrder" && key != "listPickingMain" && key != "listPickingChildAll" && key != "listSpecialHoliday" && key != "bomProductorMap" && key != "productionModuleMap" && key !="orderProcessRouteMap" && key != "productorProcessRouteLineMap" && key != "centerDeviceCalendarParams" ) {
				gMasterObj[key] = order[key];
			}  
			
		}
		
		for (var key in gMasterObj) {
			
			
			if (key == "groupshortname") {
				
				if (!groupMap.containsKey(gMasterObj[key])) {
					groupMap.put(gMasterObj[key], gMasterObj[key]);
				}
				
			}
			 
		}
	}
	
	var groupKeys = groupMap.keys();
	
	a:for (var gk = 0; gk < groupKeys.length; gk++ ) {
		
		var groupKeyName = groupKeys[gk];
		
		b:for (var i = 0 ; i <detail.length; i++ ) {
			
			var order = detail[i];
		
			// 生产指令卡
			
			var Master;
			var MasterObj = new Object();
			// 派工单
			var detail1 = null;
			var detail1Array = new Array();
			// 领料单
			var detail2 = null;
			var length2 = 0;
			var detail2Array = new Array();
			
			var addData3 = null;
			var addData3_bak = null;
			var detail3 = null;
			var length3 = 0;
			var detail3Array = new Array();
			
			for (var key in order) {
				
				if (key != "listDispatchingOrder" && key != "listPickingMain" && key != "listPickingChildAll" && key != "listSpecialHoliday" && key != "bomProductorMap" && key != "productionModuleMap" && key !="orderProcessRouteMap" && key != "productorProcessRouteLineMap" && key != "centerDeviceCalendarParams" ) {
					MasterObj[key] = order[key];
				} else {
					
					if (key == "listDispatchingOrder") {
						detail1Array = order[key];
					} else if (key == "listPickingChildAll") {
						//detail2Array = eval("(" + JSON.stringify(order[key]) + ")");
						detail2Array = order[key];
						//detail3Array = order[key];
					}
					
				}
				
			}
		 
			if (groupKeyName != MasterObj.groupshortname) {
				continue b;
			}
			
			// 把生产订单数据复制给派工单
			if (detail1Array != null && detail1Array.length > 0) {
				
				for (var k = 0; k < detail1Array.length; k ++) {
						
					for (var key in MasterObj) {
						 
						detail1Array[k]["m_" + key] = MasterObj[key];
					}
				}
				
			}
			
			// 备料单所有数据
			if (detail2Array != null && detail2Array.length > 0) {
				
				for (var j = 0; j < detail2Array.length; j ++) {
					
					for (var key in MasterObj) {
						detail2Array[j]["mm_" + key] = MasterObj[key];
					}
					
				}
				
			}
			
			length2 = detail2Array.length;
			
			// 备料单istyj = 是 && bself = 1的显示
			if (detail2Array != null && detail2Array.length > 0) {
				
				for (var z = 0; z < detail2Array.length; z ++) {
					var d2aObj = detail2Array[z];
					// addData3_bak =eval("(" + JSON.stringify(d2aObj) + ")");
//					if ((d2aObj.istyj == null || d2aObj.istyj == "null" ||  d2aObj.istyj  == "" || d2aObj.istyj =="否" ) && (d2aObj.bself != null && d2aObj.bself == "1")) {
//						
//				//		detail2Array[z].showflag = 1;
//					//	addData3 = eval("(" + JSON.stringify(d2aObj) + ")");
//						//detail3Array.push(d2aObj);
//					} else {
//						detail3Array.push(d2aObj);
//					//	detail2Array[z].showflag = 0;
//						
//					}
					
					if (((d2aObj.istyj  != null && d2aObj.istyj =="是" ) && (d2aObj.bself != null && d2aObj.bself == "1")) || (d2aObj.bpurchase != null && d2aObj.bpurchase == "1")) {
						detail3Array.push(d2aObj);
					}
					
				}
			}
			
	//		if (addData3 == null || addData3 == undefined || typeof(addData3) == "undefined" ) {
	//			addData3 = addData3_bak;
	//		}
	//		
	//		console.log(addData3);
	//		
	//		// 把addData3的其他属性变成0，除了仓库
	//		for (var key in addData3) {
	//			
	//			if (key != "whcode") {
	//				addData3[key] = "";
	//			}
	//		}
	//		console.log(addData3);
	//		
	//		
	//		// detail3 的数据要大于=detail2
	//		var length3 =  detail3Array.length;
	//		
	//		var addDataNumber = length2 - length3;
	//		
	//		if (addDataNumber > 0) {
	//			
	//			for (var x = 0; x < addDataNumber; x ++) {
	//				
	//				detail3Array.push(addData3);
	//				
	//			}
	//			
	//		}
	
			// Master = JSON.stringify(MasterObj);
			detail1 = JSON.stringify(detail1Array);
			detail2 = JSON.stringify(detail2Array);
			detail3 = JSON.stringify(detail3Array);
		  
			var report =  "\"Reports\":{\"printName\":\""+printName+"\",\"printFile\": \""+printFile+"\",\"ConnectionString\":\"\",\"QuerySQL\":\"\",\"DetailGrid\":{\"Recordset\": {\"ConnectionString\": \"xml\",\"QuerySQL\": \"\"},\"PrintPreview\":false}}"
		
			var message = "{\"detail1\":"+detail1+",\"detail2\":"+detail2+",\"detail3\":"+detail3+","+report+"}";
			
			var r = com.leanway.printByJson(message);
		
			if (!r) {
				
				if (!com.leanway.webscoket.isConnected ) {
					var port = com.leanway.getPort();
					//com.leanway.getListenMessage();
					com.leanway.webscoket.connect("ws://localhost:"+port+"/websocket")
				}
				
				setTimeout(function () {
					com.leanway.webscoket.client.send(message);
				}, 1000);
				
			}
				
		}
	}
 
	
	$("#printPOModal").prop("disabled", false);
	$("#printPOModal").html("打印");
}

com.leanway.sendReportData = function (printName, printFile, detail) {
	
	  if (typeof (detail) == "object") {
		  detail = JSON.stringify(detail);
	  }
	
	var report =  "\"Reports\":{\"printName\":\""+printName+"\",\"printFile\": \""+printFile+"\",\"ConnectionString\":\"\",\"QuerySQL\":\"\",\"DetailGrid\":{\"Recordset\": {\"ConnectionString\": \"xml\",\"QuerySQL\": \"\"},\"PrintPreview\":true}}"

	var message = "{\"detail\":"+detail+","+report+"}";
	console.log(message);
	
	var r = com.leanway.printByJson(message);
 
	if (!r) {
		
		if (!com.leanway.webscoket.isConnected ) {
			var port = com.leanway.getPort();
			//com.leanway.getListenMessage();
			com.leanway.webscoket.connect("ws://localhost:"+port+"/websocket")
		}
		
		setTimeout(function () {
			com.leanway.webscoket.client.send(message);
		}, 1000);
		
	}
}
/**
 * 根据当前页面和对象ID获取配置的模版
 * 
 * @param tagId
 * @returns
 */
com.leanway.getReport = function ( tagId ) {
	
	var result;
	
	var pageId = com.leanway.getCurrentPageId();
	  
	$.ajax({
		type : "post",
	    url : "../../../"+ln_project+"/tag",
	    data : {
	      "method" : "getReportTagInfo",
	      "pageId" : pageId,
	      "tagId" : tagId
	    },
	    dataType : "json",
	    async : false,
	    success : function( data ) {

	    	result = data;
	    	
	    },
		error : function() {

			lwalert("tipModal", 1, "error异常，请重试或联系管理员！");

		}

  	});
	  
  return result;
}

com.leanway.getPort = function(){
	
	var port = "";
	
	if(undefined!=typeof(printInfo)&&"undefined"!=typeof(printInfo)&&null!=printInfo&&"null"!=printInfo){		 
		
		port = printInfo.listenPort;		
		 
	}else{
		 
		port = "25555";
		 
	}
	
	return port;
}

com.leanway.getListenMessage = function(){
	
	var listenMessage = false;
	
	if(undefined!=typeof(printInfo)&&"undefined"!=typeof(printInfo)&&null!=printInfo&&"null"!=printInfo){		 
		
		listenMessage = printInfo.bListen;		
		 
	}
	
	if(listenMessage == false){
		
		alert("请打开云桌面中的监听程序！");
	}

	return;
}

com.leanway.printByJson = function(message){
	var result = false;
	
	try {
		
		if(undefined!=typeof(printInfo)&&"undefined"!=typeof(printInfo)&&null!=printInfo&&"null"!=printInfo){		 
			result = true;
			var rs = printInfo.printByJson(message);
			if (rs != "OK") {
				alert(rs);
			}
		}  

	} catch(e) {
		result = false;
	}

	return result;
}

com.leanway.viewImageByUrl = function(url){
		
	if(undefined!=typeof(printInfo)&&"undefined"!=typeof(printInfo)&&null!=printInfo&&"null"!=printInfo){	
		console.info(printInfo)
		return printInfo.viewImageByUrl(url);
		 
	}else {
		
		return false;     
	}
	
}


var jiananDataSyncAll = function(type){
	 
	$("#bomSync").prop("disabled", true);
	$("#bomSync").html("同步中...");
	
	 
	if ( type == "bom") {
		var productorname = $("#syncproductorname").val();
		type += "&productorname=" + productorname;
	}
	
	$.ajax ( {
		type : "post",
		// url : "../../../../"+ln_project+"/dataSync",
		url : "../../../../"+ln_project+"/dataSync?method=importAllExcel&type=" + type,
// data : {
// "method" : "addDataSync",
// "synctype" : 0
// },
		dataType : "json",
		/* async : false, */
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){
				
				var tableBodyHtml = "";
				
				 if(text.errorList != null && text.errorList.length>0) {
					 result = -1;

					for(var key in text.errorList) {

						var length = text.errorList[key].length;

						tableBodyHtml+="<li>"+text.errorList[key].slice(0, length-2)+"<br>";
						tableBodyHtml+="<span style='font-size:16px;color:red;'>"+text.errorList[key][length-1]+"</span></li>"

					}

					$("#showErrorResult").html(tableBodyHtml);
					$("#myResultModal").modal({backdrop: "static", keyboard: false});

				 }else{
	
					lwalert("tipModal", 1, text.info);
					
				 }
				
				$("#bomSync").prop("disabled", false);
				$("#bomSync").html("同步");

			}

		},
		error : function(data) {
			$("#bomSync").prop("disabled", false);
			$("#bomSync").html("同步");
		}
	});

}

/**
 * 迦南同步
 */
var jiananDataSync = function(type){
 
	$("#jiananDataSync").prop("disabled", true);
	$("#jiananDataSync").html("同步中...");
	
	 
	if ( type == "bom") {
		var productorname = $("#syncproductorname").val();
		type += "&productorname=" + productorname;
	}
	
	$.ajax ( {
		type : "post",
		// url : "../../../../"+ln_project+"/dataSync",
		url : "../../../../"+ln_project+"/dataSync?method=startExcelImport&type=" + type,
// data : {
// "method" : "addDataSync",
// "synctype" : 0
// },
		dataType : "json",
		/* async : false, */
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){
				
				var tableBodyHtml = "";
				
				 if(text.errorList != null && text.errorList.length>0) {
					 result = -1;

					for(var key in text.errorList) {

						var length = text.errorList[key].length;

						tableBodyHtml+="<li>"+text.errorList[key].slice(0, length-2)+"<br>";
						tableBodyHtml+="<span style='font-size:16px;color:red;'>"+text.errorList[key][length-1]+"</span></li>"

					}

					$("#showErrorResult").html(tableBodyHtml);
					$("#myResultModal").modal({backdrop: 'static', keyboard: false});

				 }else{
	
					lwalert("tipModal", 1, text.info);
					
				 }
				
				$("#jiananDataSync").prop("disabled", false);
				$("#jiananDataSync").html("同步");

			}

		},
		error : function(data) {
			$("#jiananDataSync").prop("disabled", false);
			$("#jiananDataSync").html("同步");
		}
	});

}

com.leanway.checkLogind = function(data) {
	
	var flag = true;

	try {

		if (typeof (data) == "object") {

			if (data.sessionStatus == "-1") {
				com.leanway.url = com.leanway.getHttpUrl();
				var info = data.error;
			 
				if (info == "" || info == undefined || typeof(info) == "undefined") {
					info = "登录超时，请重新登录！";
				}
				
				lwalert("tipModal", 2, info, "com.leanway.logout()");
				flag = false;
			}

		} else {

			var evalData = eval("(" + data + ")");

			if (typeof (evalData) == "object") {

				if (evalData.sessionStatus == "-1") {
					
					var info = evalData.error;
					 
					if (info == "" || info == undefined || typeof(info) == "undefined") {
						info = "登录超时，请重新登录！";
					}

					com.leanway.url = com.leanway.getHttpUrl();
					lwalert("tipModal", 2, info,"com.leanway.logout()");
					flag = false;
				}

			}else{
			    var objData = eval("(" + evalData + ")");
			    if (typeof (objData) == "object") {

	                if (objData.sessionStatus == "-1") {
	                	
	                	var info = objData.error;
	                 
						if (info == "" || info == undefined || typeof(info) == "undefined") {
							info = "登录超时，请重新登录！";
						}
						
	                    com.leanway.url = com.leanway.getHttpUrl();
	                    lwalert("tipModal", 2, info,"com.leanway.logout()");
	                    flag = false;
	                }

	            }
			}
		}

	} catch (e) {
		return true;
	}
	return flag;

}

com.leanway.logout = function() {

	if (com.leanway.url != "") {
		var newUrl = com.leanway.url;
		window.parent.location.href = newUrl;
	}
}

com.leanway.getHttpUrl = function ( )  {
	var allUrl = window.parent.location.href;
	var urlVal = allUrl.split("/lnui")[0];
	return urlVal;
}

var lwalert = function(modalId, type, info, fun) {
	switch (type) {
	case 1: {
		$("#tips").html(info);
		$("#sure")
				.html(
						"<button type='button' class='btn btn-primary' data-dismiss='modal'>确定</button>");
		$("#" + modalId).modal("show");
		break;
	}
	case 2: {

		$("#tips").html(info);
		$("#sure")
				.html(
						"<button type='button' class='btn btn-primary' data-dismiss='modal' onclick='"
								+ fun
								+ "'>确定</button>"
								+ "<button type='button' class='btn btn-primary' data-dismiss='modal'>取消</button>");
		$("#" + modalId).modal("show");
		break;
	}

	case 3: {

		$("#tips").html(info);
		$("#sure")
				.html(
						"<button type='button' class='btn btn-primary' data-dismiss='modal' onclick='"
								+ fun
								+ "'>确定</button>");
		$("#" + modalId).modal("show");
		break;
	}
		// case 3: {
		// $("#" + id).modal("show");
		// break;
		// }
	default: {
		$("#tips").html(info);
		$("#sure")
				.html(
						"<button type='button' class='btn btn-primary'  data-dismiss='modal'>确定</button>");
		$("#" + modalId).modal("show");
	}
	}
}
/**
 * enter触发事件
 * 
 * @param inputId
 *            元素ID
 * @param keyDownMethod
 *            按键事件
 * @returns
 */
com.leanway.enterKeyDown = function(inputId, keyDownMethod) {

	$("#" + inputId).keydown(function(e) {

		if (e.keyCode == 13) {

			keyDownMethod.call();

		}

	});
}

/**
 * 初始化页面时只读
 * 
 * @param form
 *            表单Id
 * @Param obj
 *            其他对象
 * @returns
 */
com.leanway.formReadOnly = function(form, obj) {

	var formArray = form.split(",");

	if (formArray.length > 0) {

		for (var i = 0; i < formArray.length; i++) {

			// input 标签
			$("#" + formArray[i] + " input").prop("readonly", true);

			// button 标签
			$("#" + formArray[i] + " button").prop("disabled", true);

			// select 标签
			$("#" + formArray[i] + " select").prop("disabled", true);

			// textarea 标签
			$("#" + formArray[i] + " textarea").prop("readonly", true);

		}

	}

	if (obj != undefined && typeof (obj) != "undefined") {

		for (var i = 0; i < obj.length; i++) {

			if (obj[i].type == "input" || obj[i].type == "textarea") {

				$("#" + obj[i].id).prop("readonly", true);

			} else if (obj[i].type == "button" || obj[i].type == "select") {

				$("#" + obj[i].id).prop("disabled", true);

			} else if (obj[i].type == "input" || obj[i].type == "radio") {

				$("input[name='" + obj[i].id + "']").prop("disabled", true);

			}
		}
	}

}

/**
 * 移除form只读状态
 * 
 * @param form
 *            表单Id
 * @Param obj
 *            其他对象
 * @returns
 */
com.leanway.removeReadOnly = function(form, obj) {

	var formArray = form.split(",");

	if (formArray.length > 0) {

		for (var i = 0; i < formArray.length; i++) {

			// input标签
			$("#" + formArray[i] + " input").prop("readonly", false);

			// button 标签
			$("#" + formArray[i] + " button").prop("disabled", false);

			// select 标签
			$("#" + formArray[i] + " select").prop("disabled", false);

			// textarea
			$("#" + formArray[i] + " textarea").prop("readonly", false);
		}
	}

	if (obj != undefined && typeof (obj) != "undefined") {

		for (var i = 0; i < obj.length; i++) {

			if (obj[i].type == "input" || obj[i].type == "textarea") {

				$("#" + obj[i].id).prop("readonly", false);

			} else if (obj[i].type == "button" || obj[i].type == "select") {

				$("#" + obj[i].id).prop("disabled", false);

			} else if (obj[i].type == "input" || obj[i].type == "radio") {

				$("input[name='" + obj[i].id + "']").prop("disabled", false);

			}
		}
	}
}

// 加载页面对象信息
com.leanway.loadTags = function() {

	var pageId = com.leanway.getCurrentPageId();
	// var flagval = com.leanway.getFlagval();
	// console.info(flagval)
	com.leanway.getPageTags(pageId);

}

//构建页面的设置信息
com.leanway.buildTag = function(id, type, status) {

  // 不可用状态
  if (status == "disabled") {

    $("#" + id).attr("disabled", true);

    // 是A标签的话, 还要去除click事件
    if (type == "a") {
      $("#" + id).unbind();
      $("#" + id).attr("onclick", "");
    }

    // 启用状态
  } else if (status == "enabled") {
    $("#" + id).attr("disabled", false);

    // 只读状态
  } else if (status == "readonly") {
    $("#" + id).attr("readonly", true);

    // 隐藏状态
  } else if (status == "hidden") {
    $("#" + id).hide();
  } else if (status == "show") {
    $("#" + id).show();
  }
}

// 加载页面的对象设置信息
com.leanway.getPageTags = function(pageId) {

	var tagsJson = "";

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/tag",
		data : {
			"method" : "queryAccessPageTags",
			"pageId" : pageId
		},
		dataType : "text",
	/* async : false, */
		success : function(text) {

			tagsJson = $.trim(text);

			var result = eval("(" + tagsJson + ")");

			for ( var i in result) {

				// 页面Id
				var id = result[i].id;

				// 页面类型(1：input, 2 : a ,3 : textarea)
				var type = result[i].type;

				// 状态( 1:disabled, 2: enabled, 3:readonly , 4: hidden)
				var status = result[i].event;

				com.leanway.buildTag(id, type, status);

			}
		}
	});

}

/**
 * 构建高级查询
 * 
 * @param fieldInfo
 *            字段信息 Json 集合
 * @param modalId
 *            模态标识
 * @param formId
 *            表单标识
 * @param tableId
 *            表格标识
 * @Param method
 *            回调方法
 */
com.leanway.buildAdvancedTable = function(fieldInfo, modalId, formId, tableId,
		method,method2) {

	if ($("#" + modalId).html() == undefined
			|| typeof ($("#" + modalId).html()) == "undefined") {

		var tableHtml = '<div>';
		tableHtml += '<div class="row">';
		tableHtml += '<div class="col-sm-12" >';
		tableHtml += '<div class="modal fade " id="'
				+ modalId
				+ '" tabindex="-1" role="dialog"  aria-labelledby="myModalLabel"  aria-hidden="true">';
		tableHtml += '<div class="modal-dialog" style="width:700px;">';
		tableHtml += '<div class="modal-content">';
		tableHtml += '<div class="modal-header">';
		tableHtml += '<button type="button" class="close"  data-dismiss="modal" aria-hidden="true"> &times;</button>'
		tableHtml += '<h4 class="modal-title" id="myModalLabel">高级查询</h4>';
		tableHtml += '</div>';
		tableHtml += '<div class="modal-body" >';
		tableHtml += '<div class="box-body">';

		// 添加一个隐藏文本，保存字段Json数组
		tableHtml += "<input type='hidden' class='form-control' id='" + tableId
				+ "fieldInfo' value = '" + fieldInfo + "'>";

		tableHtml += '<form class="form-horizontal" id="' + formId + '" >';
		tableHtml += '<table class="table table-striped table-bordered" id="'
				+ tableId + '">';
		tableHtml += ' <thead>';
		tableHtml += ' <tr>';
		tableHtml += '<th>连接符</th>';
		tableHtml += '<th>字段名</th>';
		tableHtml += '<th>运算符</th>';
		tableHtml += '<th>查询值</th>';
		tableHtml += '<th><a style="cursor: pointer;" onclick="com.leanway.addRow(\''
				+ tableId + '\')">添加</a></th>';
		tableHtml += '</tr>';
		tableHtml += '</thead>';
		tableHtml += '<tbody id="' + tableId + 'tbody">';
		tableHtml += '</tbody>';
		tableHtml += '</table>';
		tableHtml += '</form>';
		tableHtml += '</div>';
		tableHtml += '</div>';
		tableHtml += '<div class="modal-footer">';
		tableHtml += '<button type="button" class="btn btn-default"  id="modalClose" data-dismiss="modal">关闭</button>';
		tableHtml += '<button type="button" class="btn btn-primary"  onclick="com.leanway.advancedSqlData(\''
				+ tableId
				+ '\','
				+ method
				+ ',\''
				+ modalId
				+ '\')">查询</button>';
		if(method2!=undefined){
			tableHtml += '<button type="button" class="btn btn-primary"  onclick="com.leanway.advancedSqlData(\''
				+ tableId
				+ '\','
				+ method2
				+ ',\''
				+ modalId
				+ '\')">导出</button>';
		}

		tableHtml += '</div>';
		tableHtml += '</div>';
		tableHtml += '</div>';
		tableHtml += '</div>';
		tableHtml += '</div>';
		tableHtml += '</div>';
		tableHtml += '</div>';

		$("section.content").append(tableHtml);

		// 添加一行
		// com.leanway.addRow(tableId);

	} else {

		// 把选中的行变成可编辑模式
		$("#" + tableId + " tbody tr").each(function(index) {
			// if (index != 0) {
				$(this).remove();
		// }

		});

		/*
		 * $('#' + formId).each(function(index) { $('#' +
		 * formId)[index].reset(); });
		 */
		// com.leanway.addRow(tableId);
	}

	com.leanway.addRow(tableId);

	// 弹出modal
	$('#' + modalId).modal({
		backdrop : 'static',
		keyboard : true
	});
}

/**
 * 
 * @param tableId
 *            表格ID
 * @param method
 *            方法名
 * @param modalId
 *            模态ID
 */
com.leanway.advancedSqlData = function(tableId, method, modalId) {

	var sqlReg = /,$/gi;

	// 解析Table数据，值为空的跳过
	var sqlJson = "{\"sqlDatas\": [";

	// 把选中的行变成可编辑模式
	$("#" + tableId + " tbody tr").each(
			function(index) {

				// 获取文本框的值
				var inpu = $(this).find("td:eq(3)").find("input");
				var inputVal = inpu.val();

				if (inputVal != null && $.trim(inputVal) != "") {

					sqlJson += "{\"fieldname\":\""
							+ $(this).find("td:eq(1)").find("select").val()
									.split(",")[0]
							+ "\",\"fieldtype\":\""
							+ $(this).find("td:eq(1)").find("select").val()
									.split(",")[1] + "\",\"value\":\""
							+ inputVal + "\",\"logic\":\""
							+ $(this).find("td:eq(0)").find("select").val()
							+ "\",\"ope\":\""
							+ $(this).find("td:eq(2)").find("select").val()
							+ "\"},";

				}

			});

	sqlJson = sqlJson.replace(sqlReg, "");

	sqlJson += "]}";

	method.call(this, sqlJson);

	$('#' + modalId).modal('hide');
}

/**
 * 新增一行
 * 
 * @param tableId
 *            表格标识
 */
com.leanway.addRow = function(tableId) {

	// 获取字段信息转换成Html拼入表格中
	var fieldInfoData = $("#" + tableId + "fieldInfo").val();

	// 转换成Json
	fieldInfoData = eval("(" + fieldInfoData + ")");

	var firstType = "varchar";

	// 拼凑Tr
	var trHtml = '<tr>';

	trHtml += '<td>';
	trHtml += '<select class="form-control">'
	trHtml += '<option value="and">并且</option>';
	trHtml += '<option value="or">或者</option>';
	trHtml += '</select>'
	trHtml += '</td>';

	trHtml += '<td>';
	trHtml += '<select class="form-control" onchange="com.leanway.advancedSelectChange(this)">'

	for (var i = 0; i < fieldInfoData.length; i++) {

		if (i == 0) {
			firstType = fieldInfoData[i].fieldType;
		}

		trHtml += '<option value="' + fieldInfoData[i].fieldName + ','
				+ fieldInfoData[i].fieldType + '">'
				+ fieldInfoData[i].displayName + '</option>';
	}

	trHtml += '</select>'
	trHtml += '</td>';

	trHtml += '<td>';
	trHtml += '<select class="form-control">'

	if (firstType == "datetime" || firstType == "int") {
		trHtml += '<option value="=">等于</option>';
		trHtml += '<option value=">=">大于等于</option>';
		trHtml += '<option value="<=">小于等于</option>';

	} else {
		trHtml += '<option value="like">模糊</option>';
		trHtml += '<option value="!=">不等于</option>';
		trHtml += '<option value="=">等于</option>';
	}

	trHtml += '</select>'
	trHtml += '</td>';

	trHtml += '<td><input type="text" class="form-control" ></td>';
	trHtml += '<td style="vertical-align:middle"><a style="cursor: pointer;" onclick="com.leanway.delRow(this)">删除</a></td>';
	trHtml += '</tr>';
	$("#" + tableId + "tbody").append(trHtml);

}

/**
 * 下拉框Change事件
 * 
 * @param obj
 *            选中的select对象
 */
com.leanway.advancedSelectChange = function(obj) {

	var fieldType = $(obj).val().split(",")[1];
	var selectHtml = "";

	if (fieldType != undefined && typeof (fieldType) != undefined) {

		if (fieldType == "datetime" || fieldType == "int") {

			selectHtml += '<option value="=">等于</option>';
			selectHtml += '<option value=">=">大于等于</option>';
			selectHtml += '<option value="<=">小于等于</option>';

			if (fieldType == "datetime" ) {

				com.leanway.initTimePickYmdForMoreId($(obj).parent().parent().find("td:eq(3)").find("input"));

			}

		} else {

			selectHtml += '<option value="like">模糊</option>';
			selectHtml += '<option value="=">等于</option>';
			selectHtml += '<option value="!=">不等于</option>';

			// 去除绑定事件
			$(obj).parent().parent().find("td:eq(3)").find("input").unbind();

			// 重置Dom元素，防止日期控件绑定无效
			$(obj).parent().parent().find("td:eq(3)").html('<input type="text" class="form-control" >');
		}

		$(obj).parent().parent().find("td:eq(2)").find("select").html(
				selectHtml);

	}

}

/**
 * 删除行
 * 
 * @param obj
 *            td里的对象
 */
com.leanway.delRow = function(obj) {
	$(obj).parent().parent().remove();
}

// 获取dataTable第一条记录
// tableId: dataTable的ID; loadData:方法名
com.leanway.getDataTableFirstRowId = function(tableId, loadData, isMoreSelect,
		checkBoxName) {
//	com.leanway.setDataTableSelectNew(tableId,
//			null, checkBoxName, null);
	$("#" + tableId)
			.find("tbody tr")
			.each(

					function(index, item) {
						var cellsLength = $(this)[0].cells.length;
						if (cellsLength != 1) {
							var tr = $(this);
							var childrenData = ""// 当前checkbox的值
							if (isMoreSelect == undefined
									|| typeof (isMoreSelect) == "undefined"
									|| $.trim(isMoreSelect) == "") {
								childrenData = $(this)[0].cells[0].children[0];
							} else {
								childrenData = $(this)[0].cells[0].children[0].children[0];
							}

							if (childrenData != undefined
									&& typeof (childrenData) != "undefined") {
								var dataId = childrenData.value;
								if (index == 0) {
									// tr.addClass('row_selected');
									// childrenData.checked = true;
									if (loadData != null
											&& loadData != undefined) {
										loadData.call(this, dataId);
									}

								}
							}
							;
						}
					});
}

// 获取dataTable第一条记录
// tableId: dataTable的ID; loadData:方法名
com.leanway.getDataTableClickMoreSelectFirstRowId = function(tableId, loadData) {
	$("#" + tableId)
			.find("tbody tr")
			.each(
					function(index, item) {
						var cellsLength = $(this)[0].cells.length;
						if (cellsLength != 1) {
							var tr = $(this);
							var childrenData = $(this)[0].cells[0].children[0].children[0];// 当前checkbox的值
							if (childrenData != undefined
									&& typeof (childrenData) != "undefined") {
								var dataId = childrenData.value;
								if (index == 0) {
									tr.addClass('row_selected');
									childrenData.checked = true;
									loadData.call(this, dataId);
								}
							}
							;
						}
					});
}

/**
 * 
 * datatable第一列绑定checkBox选中事件
 * 
 * NTD datatable的某行第一列
 * 
 */
com.leanway.columnTdBindSelectNew = function(nTd, tableId, checkBoxName) {

	$(nTd).click(
			function(event) {

				event.stopPropagation();

				var thisValue = $(this).find("input").val();
				if ($(this).find("input").prop("checked") == false) {

					$(this).find("input").prop("checked", true);
					$(this).parent().addClass('row_selected');

				// console.log("check click 0" + $(this).find("input").val())
//					com.leanway.setDataTableSelectNew(tableId, thisValue,
//							checkBoxName, "add");

				} else if ($(this).find("input").prop("checked") == true) {

					$(this).find("input").prop("checked", false);
					$(this).parent().removeClass('row_selected');
				// console.log("check click 1")
//					com.leanway.setDataTableSelectNew(tableId, thisValue,
//							checkBoxName, "del");
				}
			});
}

/**
 * 
 * datatable第一列绑定checkBox选中事件
 * 
 * NTD datatable的某行第一列
 * 
 */
com.leanway.columnTdBindSelect = function(nTd) {

	$(nTd).click(function(event) {

		event.stopPropagation();

		if ($(this).find("input").prop("checked") == false) {

			$(this).find("input").prop("checked", true);
			$(this).parent().addClass('row_selected');

		} else if ($(this).find("input").prop("checked") == true) {

			$(this).find("input").prop("checked", false);
			$(this).parent().removeClass('row_selected');
		}
	});
}

/**
 * 隐藏DataTable 第一列CheckBox排序
 * 
 * @param tableId
 *            DataTable ID
 */
com.leanway.setDataTableColumnHide = function(tableId) {

	if ($('#' + tableId + " thead tr th:first").hasClass("sorting_asc")) {
		$('#' + tableId + " thead tr th:first").removeClass("sorting_asc");
	}

	// scrollX true时，会生产另外的表头
	$("#" + tableId + "_wrapper").find(".dataTables_scroll").find(
			".dataTables_scrollHead").find(
			".dataTables_scrollHeadInner table  thead tr th:first")
			.removeClass("sorting_asc");

}

/**
 * 获取选中的DataTable 数据标识ID,
 * 
 * @param tableId
 *            DataTable定义的ID
 * @param checkBoxName
 *            checkBox的NAME
 * 
 * @return
 */
com.leanway.getDataTableCheckIds = function(checkBoxName) {

	var strId = "";

	var reg = /,$/gi;

	// 拼接选中的checkbox
	$("input[name='" + checkBoxName + "']:checked").each(function(i, o) {
		strId += $(this).val();
		strId += ",";
	});

	if (strId.length > 0) {
		strId = strId.replace(reg, "");
	}

	return strId;
}

/**
 * 获取分页选中的DataTable 数据标识ID,
 * 
 * @param tableId
 *            DataTable定义的ID
 * 
 * @return
 */
com.leanway.getDataTableMapIds = function(tableId) {
    var str = '';

     colmap = tabmap.get(tableId);
     var array = colmap.keys();
     for ( var i in array) {
         str += array[i];
         str += ",";
     }
    var ids = str.substr(0, str.length - 1);
    return ids;
}

com.leanway.dataTableCheckAllCheck= function(tableId, checkAllId, checkBoxName) {

		if($("input[name='" + checkBoxName + "']").length-$("input[name='" + checkBoxName + "']:checked").length > 0){

			$("#" + checkAllId).prop("checked",false);
		}else if($("input[name='" + checkBoxName + "']").length>0){

			$("#" + checkAllId).prop("checked",true);

		}else{

			$("#" + checkAllId).prop("checked",false);
		}

}

// 数据表格全选
com.leanway.dataTableCheckAllNoSave = function(tableId, checkAllId, checkBoxName) {


	if ($("#" + checkAllId).prop("checked") == true) {

		$("input[name='" + checkBoxName + "']").prop("checked", true);
		$('#' + tableId + ' tbody tr').addClass('row_selected');

	} else {

		$("input[name='" + checkBoxName + "']").prop("checked", false);
		$('#' + tableId + ' tbody tr').removeClass('row_selected');

	}
}

// 数据表格全选
com.leanway.dataTableCheckAll = function(tableId, checkAllId, checkBoxName) {


	if ($("#" + checkAllId).prop("checked") == true) {

		$("input[name='" + checkBoxName + "']").prop("checked", true);
		$('#' + tableId + ' tbody tr').addClass('row_selected');

		// 拼接选中的checkbox
		$("input[name='" + checkBoxName + "']:checked").each(function(i, o) {

//			com.leanway.setDataTableSelectNew(tableId, $(this).val(),
//					checkBoxName, "add");
		});
	} else {

        $("input[name='" + checkBoxName + "']:checked").each(function(i, o) {

//			com.leanway.setDataTableSelectNew(tableId, $(this).val(),
//					checkBoxName, "del");
		});
		$("input[name='" + checkBoxName + "']").prop("checked", false);
		$('#' + tableId + ' tbody tr').removeClass('row_selected');


	}
}

/**
 * 取消全选
 * 
 * @param value
 * @param element
 * @returns
 */
com.leanway.dataTableUnselectAll = function(tableId, checkBoxName,checkAllName) {

	com.leanway.clearTableMapData(tableId);
	$("input[name='" + checkBoxName + "']").prop("checked", false);
	if(checkAllName!=undefined){
		$("input[name='" + checkAllName + "']").prop("checked", false);
	}
	$('#' + tableId + ' tbody tr').removeClass('row_selected');
}

// 数据表格全选
com.leanway.dataTableCheckBoxClick = function(tableId, checkBoxName, multiple,
		tableObj, onClick, selectClick, unSelectClick) {
	if ($("#" + checkAllId).checked) {
		$("input[name='" + checkBoxName + "']").prop("checked", true);
		$('#' + tableId + ' tbody tr').addClass('row_selected');
	} else {
		$("input[name='" + checkBoxName + "']").prop("checked", false);
		$('#' + tableId + ' tbody tr').removeClass('row_selected');
	}
}
/**
 * 设置DataTable能否选择多条数据及选则后出发（没有把勾选的数据存在map,前面的checkBox没有div）
 * 
 * @param tableId
 *            DataTable定义的ID
 * @param checkBoxName
 *            checkBox的NAME
 * @param multiple
 *            是否多选。true:多选，false:单选
 * @param tableObj
 *            DataTable对象
 * @param click
 *            点击触发事件
 * @param selectClick
 *            选中时触发的事件
 * @param unSelectClick
 *            取消时触发的事件
 * 
 */
com.leanway.dataTableClick = function(tableId, checkBoxName, multiple,
		tableObj, onClick, selectClick, unSelectClick) {
	// 点击dataTable触发事件
	$('#' + tableId)
			.on(
					'click',
					'tbody tr',
					function(e) {
						var now = new Date();
						var thisValue = $(this)[0].cells[0].children[0].value;// 当前checkbox的值
						var ck = $(this).find('td').eq(0).find(
								"input[name='" + checkBoxName + "']");
						var tr = $(this);
						if ((now - clicktime) > 200) {
							if (onClick != undefined
									&& typeof (onClick) != "undefined") {
								onClick.call(this, thisValue);
							}
							if (tr.hasClass('row_selected')) {
								if (unSelectClick != undefined
										&& typeof (unSelectClick) != "undefined") {
									unSelectClick.call(this, thisValue);
								}
								tr.removeClass('row_selected');
								ck.prop("checked", false);
							} else {
								if (selectClick != undefined
										&& typeof (selectClick) != "undefined") {
									selectClick.call(this, thisValue);
								}
								if (!multiple) {
									tr.parent().find("tr").removeClass(
											'row_selected');
									// ck.prop("checked", false);
									$("input[name='" + checkBoxName + "']")
											.prop("checked", false);

								}
								tr.addClass('row_selected');
								ck.prop("checked", true);
							}
							clicktime = now;
						} else {
							if (tr.hasClass('row_selected')) {
								ck.prop("checked", true);
							} else {
								ck.prop("checked", false);
							}
						}
					});
}

/**
 * 设置DataTable能否选择多条数据及选则后出发（把勾选的数据存在map,前面的checkBox有div）
 * 
 * @param tableId
 *            DataTable定义的ID
 * @param checkBoxName
 *            checkBox的NAME
 * @param multiple
 *            是否多选。true:多选，false:单选
 * @param tableObj
 *            DataTable对象
 * @param click
 *            点击触发事件
 * @param selectClick
 *            选中时触发的事件
 * @param unSelectClick
 *            取消时触发的事件
 * 
 */
com.leanway.dataTableClickMoreSelect = function(tableId, checkBoxName,
		multiple, tableObj, onClick, selectClick, unSelectClick,checkAllId) {

	// 点击dataTable触发事件
	$('#' + tableId)
			.on(
					'click',
					'tbody tr',
					function(e) {
						/*
						 * for (var int = 0; int < tabmap.length; int++) { if
						 * (array[int] != null || onClick != undefined || typeof
						 * (onClick) != "undefined") { array[int].clear(); } }
						 */

						var now = new Date();
						var thisValue = "";

						if ($(this)[0].cells[0].children.length != 0 ){
							thisValue = $(this)[0].cells[0].children[0].children[0].value;// 当前checkbox的值
						}

//						com.leanway.setDataTableSelectNew(tableId,
//								thisValue, checkBoxName, null);
//						colmap.clearmap();
					// tabmap.clearmap();
						var ck = $(this).find('td').eq(0).find(
								"input[name='" + checkBoxName + "']");
						var tr = $(this);
						if ((now - clicktime) > 200) {
							if (onClick != undefined
									|| typeof (onClick) != "undefined") {
								onClick.call(this, thisValue);
							/* console.log(1) */
							}
							if (tr.hasClass('row_selected')) {
								// console.log(2)
								// 注释去掉没有选中的情况下的方法
// if (unSelectClick != undefined
// || typeof (unSelectClick) != "undefined") {
// unSelectClick.call(this, thisValue);
// }

								if (selectClick != undefined
										|| typeof (selectClick) != "undefined") {
									// console.log(3)
									selectClick.call(this, thisValue);
								}

								tr.parent().find("tr").removeClass(
								'row_selected');
						        $("input[name='" + checkBoxName + "']")
								.prop("checked", false);

						       // tr.addClass('row_selected');
						       // ck.prop("checked", true);

								$("#"+checkAllId).prop("checked",false);

//								com.leanway.setDataTableSelectNew(tableId, thisValue,
//										checkBoxName, "add");
								// com.leanway.setDataTableSelect(tableId,
								// thisValue,checkBoxName);
							} else {
								if (selectClick != undefined
										|| typeof (selectClick) != "undefined") {
									// console.log(3)
									selectClick.call(this, thisValue);
								}
								if (!multiple) {
									// console.log(4)

									tr.parent().find("tr").removeClass(
											'row_selected');
									// ck.prop("checked", false);
									$("input[name='" + checkBoxName + "']")
											.prop("checked", false);

									$("#"+checkAllId).prop("checked",false);

//									com.leanway.setDataTableSelectNew(tableId, thisValue,
//											checkBoxName, "add");
								}

								 tr.addClass('row_selected');
								 ck.prop("checked", true);

							}
							clicktime = now;
						} else {
							if (tr.hasClass('row_selected')) {
								ck.prop("checked", true);
//								if(colmap==null){
//									colmap= new Map();
//								}
//								colmap.put(thisValue, thisValue);
//								tabmap.put(tableId, colmap);
							} else {
								ck.prop("checked", false);
							}
						}
						// com.leanway.setDataTableSelect(tableId,
						// thisValue,checkBoxName);

					});

}

/**
 * 设置DataTable自动选中
 * 
 * @param tableId
 *            DataTable定义的ID
 * @param checkBoxName
 *            checkBox的NAME
 * @param dataIds
 *            要选中的数据标识("A","B")
 * 
 */
com.leanway.setDataTableSelect = function(tableId, checkBoxName, dataIds) {
	if (dataIds != undefined && typeof (dataIds) != "undefined"
			&& $.trim(dataIds) != "") {
		var arrayIds = dataIds.split(",");
		for (var i = 0; i < arrayIds.length; i++) {
			var checkId = arrayIds[i];

			$("#" + tableId)
					.find("tbody tr")
					.each(
							function(index, item) {
								var id = $(this)[0].cells[0].children[0].children[0].value;
								if (checkId == id) {
									$(this).addClass('row_selected');
									$(this).find('td').eq(0).find(
											"input[name='" + checkBoxName
													+ "']").prop("checked",
											true);
//									com.leanway.setDataTableSelectNew(tableId, id,
//				                            checkBoxName, "add");
								}
							});
		}

	}

}

/**
 * 设置DataTable自动选中
 * 
 * @param tableId
 *            DataTable定义的ID
 * @param checkBoxName
 *            checkBox的NAME
 * @param dataIds
 *            要选中的数据标识("A","B")
 * 
 */
com.leanway.setDataTableSelectNoSave = function(tableId, checkBoxName, dataIds) {
	if (dataIds != undefined && typeof (dataIds) != "undefined"
			&& $.trim(dataIds) != "") {
		var arrayIds = dataIds.split(",");
		for (var i = 0; i < arrayIds.length; i++) {
			var checkId = arrayIds[i];

			$("#" + tableId)
					.find("tbody tr")
					.each(
							function(index, item) {
								var id = $(this)[0].cells[0].children[0].children[0].value;
								if (checkId == id) {
									$(this).addClass('row_selected');
									$(this).find('td').eq(0).find(
											"input[name='" + checkBoxName
													+ "']").prop("checked",
											true);									
								}
							});
		}

	}

}

var tabmap = new Map();
com.leanway.setDataTableSelectNew = function(tableId, dataId, checkBoxName,
		state) {
	colmap = tabmap.get(tableId);
	if (colmap == null) {
		colmap = new Map();
		tabmap.put(tableId, colmap);
	}
	// alert(colmap)
	if (state == "add") {
		// console.log("======log===========" + colmap.containsKey(dataId))
		// 判断是否有重复的key
		if (colmap.containsKey(dataId) == false) {
			colmap.put(dataId, dataId);
			tabmap.put(tableId, colmap);
		}
		// console.log("add==" + colmap.size());
	}
	if (state == "del") {
		// console.log(colmap)
		colmap.remove(dataId);
		// console.log("del==" + colmap.size());
	}
	var array = colmap.keys();

	for ( var i in array) {

		var checkId = array[i];

		$("#" + tableId).find("tbody tr").each(
				function(index, item) {

					if ($(this)[0].cells[0] != undefined && typeof($(this)[0].cells[0]) != "undefined" && $(this)[0].cells[0].children[0] != undefined && typeof($(this)[0].cells[0].children[0]) != "undefined" && $(this)[0].cells[0].children[0].children[0] != undefined && typeof($(this)[0].cells[0].children[0].children[0]) != "undefined") {

						var id = $(this)[0].cells[0].children[0].children[0].value;

						if (checkId == id) {
							// console.log("checkId=================" +
							// checkId);
							// console.log("id=================" + id);
							$(this).addClass('row_selected');
							$(this).find('td').eq(0).find(
									"input[name='" + checkBoxName + "']").prop(
									"checked", true);
						}
					}

				});

	}

}

/**
 * 获取表格选中的数据
 * 
 * @param tableObj
 * @returns
 */
com.leanway.getRowSelectedData = function ( tableObj ) {
	var dataList = tableObj.rows('.row_selected').data()
	return dataList;
}

/**
 * 
 * 
 * @param type
 *            1:当前页面的数据，2：跨页数据
 * @param tableName
 *            Map的key名称
 * @param checkBoxName
 *            datatables的checkbox名称
 */
com.leanway.getCheckBoxData = function (type, tableName , checkBoxName)  {

	 var ids = "";

	 if (type == 1) {

		 ids = com.leanway.getDataTableCheckIds(checkBoxName);

	 } else if (type == 2) {
		 ids = com.leanway.getDataTableCheckIds(checkBoxName);
//		 colmap = tabmap.get(tableName);
//
//		 if (colmap != undefined && typeof(colmap) != "undefined") {
//
//			 var array = colmap.keys();
//
//			 for ( var i in array) {
//				 ids += array[i];
//				 ids += ",";
//			 }
//
//			 ids = ids.substr(0, ids.length - 1);
//
//		 }

	 }

	 return ids;

}

/**
 * 清除tableid map的数据
 */
com.leanway.clearTableMapData = function ( tableId ) {

	if (tabmap != null && tabmap != undefined && typeof(tabmap) != "undefined" && tabmap.get(tableId) != null && tabmap.get(tableId) != undefined && typeof(tabmap.get(tableId)) != "undefined") {
		var colsmap = tabmap.get(tableId);
		colsmap.clearmap();
	}

}

/**
 * 设置DataTable
 * 
 * @param tableId
 *            DataTable定义的ID
 * @param ids
 *            要保存的数据("A","B")
 * 
 */
com.leanway.setTableMapData = function ( tableId, ids) {
	if(tabmap.get(tableId) != null && tabmap.get(tableId) != undefined && typeof(tabmap.get(tableId)) != "undefined" ){
		tabmap.clearmap();
	// tabmap.remove(tableId);
	}
	ids = ids.split(",");
	colmap.clearmap();
// console.log(ids);
/*
 * console.log("tabmap:"); console.log(tabmap); console.log("colmap:");
 * console.log(colmap);
 */
	for (var i = 0; i < ids.length - 1;i++) {
		colmap.put(ids[i],ids[i]);
	}
	tabmap.put(tableId, colmap);
}

com.leanway.getCurrentPageId = function() {

	var currentPageId = com.leanway.getQueryString("pageId");
	/*
	 * // 获取激活着的tabId var tabId = $("li.active", parent.document).attr('id'); //
	 * 截取 var subIframeId = tabId.substring(4, tabId.length); // 拼接 var ifameId =
	 * "tab_iframe_" + subIframeId; // 获取Iframe Src var iframeSrc = $("#" +
	 * ifameId, parent.document).attr('src');
	 */
	return currentPageId;

}

com.leanway.getFlagval = function() {

	var flagval = com.leanway.getQueryString("flagval");
	/*
	 * // 获取激活着的tabId var tabId = $("li.active", parent.document).attr('id'); //
	 * 截取 var subIframeId = tabId.substring(4, tabId.length); // 拼接 var ifameId =
	 * "tab_iframe_" + subIframeId; // 获取Iframe Src var iframeSrc = $("#" +
	 * ifameId, parent.document).attr('src');
	 */
	return flagval;

}

com.leanway.getQueryString = function(name) {

	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

/**
 * 时间控件
 * 
 * @param timeIds
 *            #+元素ID
 */
com.leanway.initTimePickYmdForMoreId = function(timeIds) {

	$(timeIds).datetimepicker({
		language : 'zh-CN',
		weekStart : 7,
		todayBtn : 1,
		autoclose : 1,
		todayHighlight : 1,
		startView : 2,
		minView : 2,
		forceParse : 0,
		format : 'yyyy-mm-dd'
	});

}

com.leanway.initTimePickYmdHmsForMoreId = function(timeIds) {

	$(timeIds).datetimepicker({
		language : 'zh-CN',
		weekStart : 7,
		todayBtn : 1,
		autoclose : 1,
		todayHighlight : 1,
		startView : 2,
		forceParse : 0,
		showMeridian : 1,
		format : 'yyyy-mm-dd hh:ii:ss'
	});

}

// 初始化时间
var initTimePickYmd = function(timeId) {

	$("#" + timeId).datetimepicker({
		language : 'zh-CN',
		weekStart : 7,
		todayBtn : 1,
		autoclose : 1,
		todayHighlight : 1,
		startView : 2,
		minView : 2,
		forceParse : 0,
		format : 'yyyy-mm-dd'
	});
}

// 初始化时间
var initTimePickYm = function(timeId) {

	$("#" + timeId).datetimepicker({
		language : 'zh-CN',
		weekStart : 7,
		todayBtn : 1,
		autoclose : 1,
		todayHighlight : 1,
		startView : 2,
		minView : 2,
		forceParse : 0,
		format : 'yyyy-mm'
	});
}
// 初始化时间
var initTimePickY = function(timeId) {

	$(timeId).datetimepicker({
		language : 'zh-CN',
		weekStart : 7,
		todayBtn : 1,
		autoclose : 1,
		todayHighlight : 1,
		startView : 'decade',
		minView : 'decade',
		maxViewMode:2,
		minViewMode:2,
		format : 'yyyy'
	});
}
// 初始化时间
var initTimePickM = function(timeId) {

	$(timeId).datetimepicker({
		language : 'zh-CN',
		weekStart : 7,
		todayBtn : 1,
		autoclose : 1,
		todayHighlight : 1,
		startView : 3,
		minView : 3,
		forceParse : 0,
		format : 'mm'
	});
}

// 初始化时间， 2015-03-03 13:24:14
var initDateTimeYmdHms = function(dataTimeId) {

	$("#" + dataTimeId).datetimepicker({
		language : 'zh-CN',
		weekStart : 7,
		todayBtn : 1,
		autoclose : 1,
		todayHighlight : 1,
		startView : 2,
		forceParse : 0,
		showMeridian : 1,
		format : 'yyyy-mm-dd hh:ii:ss'
	});
}

// 初始化时间
var initTimePickHms = function(timeId) {
	$("#" + timeId).datetimepicker({
		language : 'zh-CN',
		autoclose : 1,
		startView : 1,
		minView : 0,
		maxView : 1,
		forceParse : 0,
		format : 'hh:ii'
	});
}

/**
 * 清空form元素
 * 
 * @param formIds
 *            formID(传多值时:"a,b,c")
 */
com.leanway.clearForm = function(formIds) {

	var formArray = formIds.split(",");

	if (formArray.length > 0) {

		for (var i = 0; i < formArray.length; i++) {

			$(':input', "#" + formArray[i]).not(':button, :submit, :reset')
					.val('').removeAttr('checked').removeAttr('selected');

		}
	}

}


com.leanway.clearForm2 = function (form) {
	$(':input', form).each(function() {
		var type = this.type;
		var tag = this.tagName.toLowerCase();
		if (type == 'text' || type == 'password' || tag == 'textarea' || type == "hidden") {
			this.value = "";
		} else if (type == 'checkbox' || type == 'radio') {
			this.checked = false;
		} else if (tag == 'select') {
			/*this.selectedIndex = -1;*/
		} else {
			
		}
	})
}
// 显示遮罩层
function showMask(id){
    $("#"+id).css("height",$(document).height());
    $("#"+id).css("width",$(document).width());
    $("#"+id).show();
  }
  // 隐藏遮罩层
  function hideMask(id){

    $("#"+id).hide();
  }

// 初始化select2,
/**
 * id: 为要操作的对象 url: url text: 要在select中显示的文本
 */
com.leanway.initSelect2 = function(id, url, text, multiple) {

	if (multiple == undefined || typeof(multiple) == "undefined") {
		multiple = false;
	}

	$(id).select2({
		placeholder : text,
		allowClear: true,
		language : "zh-CN",
		multiple: multiple,
		ajax : {
			url : url,
			dataType : 'json',
			delay : 250,
			data : function(params) {
				return {
					q : params.term, // search term
					page : params.page,
					pageSize : 10
				};
			},
			processResults : function(data, params) {

				var flag = com.leanway.checkLogind(data);

				if (flag) {
					params.page = params.page || 1;
					return {
						results : data.items,
						pagination : {
							more : (params.page * 30) < data.total_count
						}
					}
				}
				;
			},
			cache : false
		},
		escapeMarkup : function(markup) {
			return markup;
		},
		minimumInputLength : 1,
	});
}

/**
 * 获取数据字典
 * 
 * @param t
 *            t
 * @param c
 *            c
 * @param pre
 *            pre
 * @param id
 *            元素ID
 * @param textVal
 *            默认值
 */
com.leanway.getCodeMap = function (t, c, p, id, textVal) {

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/codeMap",
		async : false,
		data : {
			method : "queryCodeMapList",
			p : p,
			t : t,
			c : c,
		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				var outPut = [];
				outPut.push("<option value='0' selected='selected'>" + textVal
						+ "</option>");
				for ( var key in tempData) {
					outPut.push("<option value='"
							+ tempData[key].codenum.replace(/\b(0+)/gi, "") + "'>"
							+ tempData[key].codevalue + "</option>");
				}
				$(id).html(outPut.join(""));
			}
		},
		error : function(data) {

		}
	});

}


/**
 * 正整数.
 * 
 * @param value
 * @param element
 * @returns
 */
com.leanway.positiveInteger = function(value) {
	var decimal = /^[1-9]\d*$/;
	return (decimal.test(value));
}
/**
 * 数字
 * 
 * @param value
 * @param element
 * @returns
 */
com.leanway.numberDeleteNull = function(value) {
	var decimal = /^\d*$/;
	return (decimal.test(value.trim()));
}
/**
 * 手机
 * 
 * @param value
 * @param element
 * @returns
 */
com.leanway.mobile = function(value) {
	var decimal = /^\d{11,12}$/;
	return (decimal.test(value));
}
/**
 * 中文、字母和数字
 * 
 * @param value
 * @param element
 * @returns
 */
com.leanway.correctName = function(value) {
	var decimal = /^[a-z-A-Z0-9\u4E00-\u9FA5]+$/;
	return (decimal.test(value));
}
/**
 * 正确的字典编码（只能由字母和数字组成）
 * 
 * @param value
 * @param element
 * @returns
 */
com.leanway.corrDictCd = function(value) {
	var decimal = /^[a-zA-Z0-9]+$/;
	return (decimal.test(value));
}
/**
 * 正确的日期格式
 * 
 * @param value
 * @param element
 * @returns
 */
com.leanway.corrDate = function(value) {
	var decimal = /((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/ig;
	return (decimal.test(value));
}
/**
 * 正整数
 * 
 * @param value
 * @param element
 * @returns
 */
com.leanway.folatAndInt = function(value) {
	var decimal = /^\d+|\d+\.\d+$/;
	return (decimal.test(value));
}
/**
 * 1-10位数字
 * 
 * @param value
 * @param element
 * @returns
 */
com.leanway.numberNotNull = function(value) {
	var decimal = /^[0-9]{1,10}$/;
	return (decimal.test(value));
}
/**
 * 0-10位数字
 * 
 * @param value
 * @param element
 * @returns
 */
com.leanway.numberNull = function(value) {
	var decimal = /^[0-9]{0,10}$/;
	return decimal.test(value);
}
/**
 * 浮点数
 */
com.leanway.floatAndInt = function(value) {
	var decimal = /^[0-9]{0,}\.{0,1}[0-9]{0,}$/;
	return (decimal.test(value));
}
/**
 * 正确的名称（只能由中文、字母、·和数字组成）
 * 
 * @param value
 * @param element
 * @returns
 */
com.leanway.correctBrandName = function(value) {
	var decimal = /^[a-zA-Z0-9\u4E00-\u9FA5\s]+$/;
	return (decimal.test(value));
}

/**
 * 中文、字母和数字(100以内)
 * 
 * @param value
 * @param element
 * @returns
 */
com.leanway.correctName = function(value) {
	var decimal = /^[a-zA-Z0-9 \u4E00-\u9FA5]{0,100}$/;
	return (decimal.test(value));
}
/**
 * 中文、字母和数字(100以内)
 * 
 * @param value
 * @param element
 * @returns
 */
com.leanway.correctNameNotNull = function(value) {
	var decimal = /^[a-zA-Z0-9 \u4E00-\u9FA5]{1,100}$/;
	return (decimal.test(value));
}
/**
 * 20位以内的数组或字母组合
 * 
 * @param value
 * @param element
 * @returns
 */
com.leanway.productBathNo = function(value) {
	var decimal = /^[a-zA-Z0-9]{1,20}$/;
	return (decimal.test(value));
}
/**
 * 汉字
 * 
 * @param value
 * @param element
 * @returns
 */
com.leanway.china = function(value) {
	var decimal = /^[\u4e00-\u9fa5]{0,}$/;
	return (decimal.test(value));
}

// ====================================================================
com.leanway.reg = {};
com.leanway.reg.fun = function(regx, msg) {
	var reg = {
		regexp : regx,
		message : msg
	}
	return reg;
}

com.leanway.reg.decimal = {}
com.leanway.reg.msg = {};

// 固定电话
// com.leanway.reg.decimal.phone =
// /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
// com.leanway.reg.msg.phone = "雇员电话如：010-66886688或者11位的手机号码";

com.leanway.reg.decimal.phone = /^((\(\d{3,4}\)|\d{3,4}-|\s)?\d{8})$/;
com.leanway.reg.msg.phone = "雇员电话如：010-66886688或者0102-66886688";
// 年龄
com.leanway.reg.decimal.age = /^[0-9]{1,3}$/;
com.leanway.reg.msg.age = "请输入正确的年龄";

// 手机
com.leanway.reg.decimal.mobile = /^1(3[0-9]|4[57]|5[0-35-9]|8[0-9]|70)\d{8}$/;
com.leanway.reg.msg.mobile = "请输入正确的手机号";

// 身份证
com.leanway.reg.decimal.idcard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
com.leanway.reg.msg.idcard = "请输入合法的身份证";

// 邮箱
com.leanway.reg.decimal.email = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
com.leanway.reg.msg.email = "请输入正确的邮箱";

// QQ
com.leanway.reg.decimal.qq = /^[1-9][0-9]{4,}$/;
com.leanway.reg.msg.qq = "请输入正确的QQ";

// 雇员性质
com.leanway.reg.decimal.type = /^[0-9]{1,2}$/;
com.leanway.reg.msg.type = "请输入0~99数字";

// 时间
com.leanway.reg.decimal.time = /^[0-9]{1,}\.{0,1}[0-9]{0,}$/;
com.leanway.reg.msg.time = "请输入整数或者小数";

// 数量
com.leanway.reg.decimal.amount = /^[0-9]{1,10}$/;
com.leanway.reg.msg.amount = "请输入整数";
// 年份
com.leanway.reg.decimal.year = /^[0-9]{4,4}$/;
com.leanway.reg.msg.year = "请输入四位数字";
// accuracy
com.leanway.reg.decimal.accuracy = /^[0-9]{0,1}$/;
com.leanway.reg.msg.accuracy = "请输入1位数字";
com.leanway.reg.decimal.number = /^\d*$/;
com.leanway.reg.msg.number = "请输入数字";
// 验证人员规模
com.leanway.reg.decimal.staffsize =/^[0-9]{0,5}[-]{0,1}[0-9]{0,7}$/;
com.leanway.reg.msg.staffsize = "请输入正确的公司人数，如:100-200";
// 邮编
com.leanway.reg.decimal.postcode = /^[1-9][0-9]{5,5}$/;
com.leanway.reg.msg.postcode = "请输入正确的邮编";
// 密码
com.leanway.reg.decimal.password =/^(\w){6,18}$/;   // ^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/;
com.leanway.reg.msg.password = "请输入6-18位密码"
// 用户名
com.leanway.reg.decimal.userName =/^(\w){6,18}$/;     // /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/;
com.leanway.reg.msg.userName = "请输入6-18位用户名"

/**
 * MAP对象，实现MAP功能
 * 
 * 接口： size() 获取MAP元素个数 isEmpty() 判断MAP是否为空 clear() 删除MAP所有元素 put(key, value)
 * 向MAP中增加元素（key, value) remove(key) 删除指定KEY的元素，成功返回True，失败返回False get(key)
 * 获取指定KEY的元素值VALUE，失败返回NULL element(index)
 * 获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL containsKey(key)
 * 判断MAP中是否含有指定KEY的元素 containsValue(value) 判断MAP中是否含有指定VALUE的元素 values()
 * 获取MAP中所有VALUE的数组（ARRAY） keys() 获取MAP中所有KEY的数组（ARRAY）
 * 
 * 例子： var map = new Map();
 * 
 * map.put("key", "value"); var val = map.get("key") ……
 * 
 */
function Map() {
	this.elements = new Array();

	// 获取MAP元素个数
	this.size = function() {
		return this.elements.length;
	}

	// 判断MAP是否为空
	this.isEmpty = function() {
		return (this.elements.length < 1);
	}

	// 删除MAP所有元素
	this.clear = function() {
		this.elements = new Array();
	}
	this.clearmap = function() {
		this.elements = new Array();
	}

	// 向MAP中增加元素（key, value)
	this.put = function(_key, _value) {
		this.elements.push({
			key : _key,
			value : _value
		});
	}

	// 删除指定KEY的元素，成功返回True，失败返回False
	this.remove = function(_key) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					this.elements.splice(i, 1);
					return true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	}

	// 获取指定KEY的元素值VALUE，失败返回NULL
	this.get = function(_key) {
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					return this.elements[i].value;
				}
			}
		} catch (e) {
			return null;
		}
	}

	// 获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
	this.element = function(_index) {
		if (_index < 0 || _index >= this.elements.length) {
			return null;
		}
		return this.elements[_index];
	}

	// 判断MAP中是否含有指定KEY的元素
	this.containsKey = function(_key) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	}

	// 判断MAP中是否含有指定VALUE的元素
	this.containsValue = function(_value) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].value == _value) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	}

	// 获取MAP中所有VALUE的数组（ARRAY）
	this.values = function() {
		var arr = new Array();
		for (i = 0; i < this.elements.length; i++) {
			arr.push(this.elements[i].value);
		}
		return arr;
	}

	// 获取MAP中所有KEY的数组（ARRAY）
	this.keys = function() {
		var arr = new Array();
		for (i = 0; i < this.elements.length; i++) {
			arr.push(this.elements[i].key);
		}
		return arr;
	}

}