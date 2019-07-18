var com = {};
com.leanway = {};
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
 * enter触发事件
 * 
 * @param inputId 元素ID
 * @param keyDownMethod 按键事件
 * @returns
 */
com.leanway.enterKeyDown = function (inputId, keyDownMethod) {

	$("#" + inputId).keydown(function (e) {
		
		if (e.keyCode == 13) {
			
			keyDownMethod.call();
			
		}
		
	});
}

/**
 * 初始化页面时只读
 * 
 * @param form 表单Id
 * @Param obj 其他对象
 * @returns
 */
com.leanway.formReadOnly = function ( form , obj) {
	
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

	if (obj != undefined && typeof(obj) != "undefined") {

		for (var i = 0; i < obj.length; i++) {

			if (obj[i].type == "input" || obj[i].type== "textarea") {
			
				$("#" + obj[i].id).prop("readonly", true);
				
			} else if (obj[i].type == "button" || obj[i].type == "select") {
				
				$("#" + obj[i].id).prop("disabled", true);
				
			}
		}
	}

}

/**
 * 移除form只读状态
 * 
 * @param form 表单Id
 * @Param obj 其他对象
 * @returns
 */
com.leanway.removeReadOnly = function ( form, obj ) {
	
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
	
	if (obj != undefined && typeof(obj) != "undefined") {

		for (var i = 0; i < obj.length; i++) {

			if (obj[i].type == "input" || obj[i].type== "textarea") {
			
				$("#" + obj[i].id).prop("readonly", false);
				
			} else if (obj[i].type == "button" || obj[i].type == "select") {
				
				$("#" + obj[i].id).prop("disabled", false);
				
			}
		}
	}
}


// 加载页面对象信息
com.leanway.loadTags = function() {

	var pageId = com.leanway.getCurrentPageId();

	var result = eval("(" + com.leanway.getPageTags(pageId) + ")");

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

// 构建页面的设置信息
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
	}

}

// 加载页面的对象设置信息
com.leanway.getPageTags = function(pageId) {

	var tagsJson = "";

	$.ajax({
		type : "post",
		url : "../../tag",
		data : {
			"method" : "getPageTagsInfo",
			"pageId" : pageId
		},
		dataType : "text",
		async : false,
		success : function(text) {
			tagsJson = $.trim(text);
		}
	});

	return tagsJson;
}

//获取dataTable第一条记录
//tableId: dataTable的ID; loadData:方法名
com.leanway.getDataTableFirstRowId = function (tableId, loadData ) {
	
	$("#" + tableId).find("tbody tr").each(function(index, item) {
		var cellsLength = $(this)[0].cells.length;
		
		if(cellsLength != 1) {
			
			var childrenData = $(this)[0].cells[0].children[0];
			
			if (childrenData != undefined && typeof(childrenData) != "undefined") {
				
				var dataId = childrenData.value;
				
				if (index == 0) {
					
					loadData.call(this, dataId);
					
				}
			}
	
		}
	});
}

/**
 * 隐藏DataTable 第一列CheckBox排序
 * 
 * @param tableId DataTable ID
 */
com.leanway.setDataTableColumnHide = function (tableId) {
	
	if ($('#' + tableId + " thead tr th:first").hasClass("sorting_asc")) {
		$('#' + tableId + " thead tr th:first").removeClass("sorting_asc");
	}
	
	// scrollX true时，会生产另外的表头
	$("#" + tableId + "_wrapper").find(".dataTables_scroll").find(".dataTables_scrollHead").find(".dataTables_scrollHeadInner table  thead tr th:first").removeClass("sorting_asc");
	
}


/**
 * 获取选中的DataTable 数据标识ID,
 * 
 * @param tableId DataTable定义的ID
 * @param checkBoxName checkBox的NAME

 * @return 
 */
com.leanway.getDataTableCheckIds = function (checkBoxName) {
	
	var strId = "";
	
	var reg = /,$/gi; 
	
    // 拼接选中的checkbox
    $( "input[name='" + checkBoxName + "']:checked" ).each( function (i, o) {
    	strId += $(this).val();
    	strId += ",";
    });
    
    if (strId.length > 0) {
    	strId = strId.replace(reg, ""); 
    }
   
    return strId;
}

// 数据表格全选
com.leanway.dataTableCheckAll = function(tableId, checkAllId, checkBoxName) {

	// 全选
	$("#" + checkAllId).on(
			"click",
			function() {
				if ($(this).prop("checked") == true) {
					$("input[name='" + checkBoxName + "']").prop("checked",
							$(this).prop("checked"));
					$('#' + tableId + ' tbody tr').addClass('row_selected');
				} else {
					$("input[name='" + checkBoxName + "']").prop("checked",
							false);
					$('#' + tableId + ' tbody tr').removeClass('row_selected');
				}
			});

}

/**
 * 取消全选
 * 
 * @param value
 * @param element
 * @returns
 */
com.leanway.dataTableUnselectAll= function (tableId, checkBoxName){
	
	$("input[name='" + checkBoxName + "']").prop("checked", false);
	$('#' + tableId + ' tbody tr').removeClass('row_selected');
	
}


/**
 * 设置DataTable能否选择多条数据及选则后出发
 * 
 * @param tableId DataTable定义的ID
 * @param checkBoxName checkBox的NAME
 * @param multiple 是否多选。true:多选，false:单选
 * @param tableObj DataTable对象
 * @param click 点击触发事件
 * @param selectClick 选中时触发的事件
 * @param unSelectClick 取消时触发的事件
 * 
 */
com.leanway.dataTableClick = function (tableId, checkBoxName, multiple, tableObj, onClick, selectClick, unSelectClick) {
	
	//点击dataTable触发事件
	$('#' + tableId).on('click', 'tbody tr', function(e) {
		
		if (onClick != undefined && typeof(onClick) != "undefined") {
			onClick.call(this, $(this)[0].cells[0].children[0].value);
		}
		 
		if ($(this).hasClass('row_selected')) {
			
			if (unSelectClick != undefined && typeof(unSelectClick) != "undefined") {
				unSelectClick.call(this, $(this)[0].cells[0].children[0].value);
			}
		  
			$(this).removeClass('row_selected');
			$(this).find('td').eq(0).find("input[name='" + checkBoxName + "']").prop("checked", false)
	      
	  } else {
		  
		  if (selectClick != undefined && typeof(selectClick) != "undefined") {
			  selectClick.call(this,  $(this)[0].cells[0].children[0].value);
		  }
		  
		  if ( !multiple ) {
			  tableObj.$('tr.row_selected').removeClass('row_selected');
			  $("input[name='"+checkBoxName+"']").prop("checked", false);
		  }
	
		  	$(this).addClass('row_selected');
			$(this).find('td').eq(0).find("input[name='" + checkBoxName + "']").prop("checked", true)
	  	}

	});
	
}

/**
 * 设置DataTable能否选择多条数据及选则后出发
 * 
 * @param tableId DataTable定义的ID
 * @param checkBoxName checkBox的NAME
 * @param multiple 是否多选。true:多选，false:单选
 * @param tableObj DataTable对象
 * @param click 点击触发事件
 * @param selectClick 选中时触发的事件
 * @param unSelectClick 取消时触发的事件
 * 
 */
com.leanway.dataTableClickMoreSelect = function (tableId, checkBoxName, multiple, tableObj, onClick, selectClick, unSelectClick) {
	
	//点击dataTable触发事件
	$('#' + tableId).on('click', 'tbody tr', function(e) {
		
		var value = $(this)[0].cells[0].children[0].children[0].value;
		
		if (onClick != undefined && typeof(onClick) != "undefined") {
			onClick.call(this, value);
		}
		 
		if ($(this).hasClass('row_selected')) {
			
			if (unSelectClick != undefined && typeof(unSelectClick) != "undefined") {
				unSelectClick.call(this, value);
			}
		  
			$(this).removeClass('row_selected');
			$(this).find('td').eq(0).find("input[name='" + checkBoxName + "']").prop("checked", false)
	      
	  } else {
		  
		  if (selectClick != undefined && typeof(selectClick) != "undefined") {
			  selectClick.call(this,  value);
		  }
		  
		  if ( !multiple ) {
			  tableObj.$('tr.row_selected').removeClass('row_selected');
			  $("input[name='"+checkBoxName+"']").prop("checked", false);
		  }
	
		  	$(this).addClass('row_selected');
			$(this).find('td').eq(0).find("input[name='" + checkBoxName + "']").prop("checked", true)
	  	}

	});
	
}

/**
 * 设置DataTable自动选中
 * 
 * @param tableId DataTable定义的ID
 * @param checkBoxName checkBox的NAME
 * @param dataIds 要选中的数据标识("A","B")
 * 
 */
com.leanway.setDataTableSelect = function ( tableId, checkBoxName, dataIds) {
	
	if (dataIds != undefined && typeof(dataIds) != "undefined" && $.trim(dataIds) != "") {
		
		var arrayIds = dataIds.split(",");
		
		for ( var i = 0; i < arrayIds.length; i++) {
			var checkId = arrayIds[i];
			
			$("#" + tableId).find("tbody tr").each( function ( index, item ) {
				
				var id = $(this)[0].cells[0].children[0].value;
			
				if (checkId == id) {
					
					$(this).addClass('row_selected');
					$(this).find('td').eq(0).find("input[name='" + checkBoxName + "']").prop("checked", true)
					
				}
			});
			
		}
		
	}
	
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
 * @param timeIds #+元素ID 
 */
com.leanway.initTimePickYmdForMoreId = function (timeIds) {
	
    $( timeIds ).datetimepicker ( {
    	lang:'ch',
    	format:"Y-m-d",      //格式化日期
    	timepicker:false,    //关闭时间选项
    	yearStart:2000,     //设置最小年份
    	yearEnd:2050,        //设置最大年份
    	todayButton:true    //关闭选择今天按钮
    } );
    
}

// 初始化时间
var initTimePickYmd = function  (timeId) {
    $( "#" + timeId ).datetimepicker ( {
    	lang:'ch',
    	format:"Y-m-d",      //格式化日期
    	timepicker:false,    //关闭时间选项
    	yearStart:2000,     //设置最小年份
    	yearEnd:2050,        //设置最大年份
    	todayButton:true    //关闭选择今天按钮
    } );
}

//初始化时间， 2015-03-03 13:24:14
var initDateTimeYmdHms = function (dataTimeId) {
	$("#"+dataTimeId).datetimepicker({
		lang : 'ch',
		format : "Y-m-d H:i:s", // 格式化日期
		timepicker:true,    //关闭时间选项
		yearStart : 2000, // 设置最小年份
		yearEnd : 2050, // 设置最大年份
		todayButton : true
		// 关闭选择今天按钮
	});
}

//初始化时间
var initTimePickHms = function(timeId) {
	$("#" + timeId).datetimepicker({
		lang : 'ch',
		datepicker : false,
		format : 'H:i',
		step : 1
	});
}
/**
 * 清空form元素
 * 
 * @param formIds formID(传多值时:"a,b,c")
 */
com.leanway.clearForm = function (formIds) {
	
	var formArray = formIds.split(",");
	
	if (formArray.length > 0) {
		
		for (var i = 0; i < formArray.length; i++) {
			
			$(':input',"#" + formArray[i]).not(':button, :submit, :reset').val('').removeAttr('checked').removeAttr('selected'); 
			
		}
	}
 
}

var lwalert = function(modalId, type, info, fun) {
	switch (type) {
	case 1: {
		$("#tips").html(info);
		$("#sure").html(
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
		// case 3: {
		// $("#" + id).modal("show");
		// break;
		// }
	default: {
		$("#tips").html(info);
		$("#sure").html(
		"<button type='button' class='btn btn-primary'  data-dismiss='modal'>确定</button>");
		$("#" + modalId).modal("show");
	}
	}
}

//初始化select2,
/**
 * id: 为要操作的对象 url: url text: 要在select中显示的文本
 */
com.leanway.initSelect2 = function (id, url, text) {
	$(id).select2({
		placeholder : text,
		language : "zh-CN",
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
				params.page = params.page || 1;
				return {
					results : data.items,
					pagination : {
						more : (params.page * 30) < data.total_count
					}
				};
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

//固定电话
com.leanway.reg.decimal.phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
com.leanway.reg.msg.phone = "雇员电话如：010-66886688或者11位的手机号码";

//年龄
com.leanway.reg.decimal.age = /^[0-9]{1,3}$/;
com.leanway.reg.msg.age = "请输入正确的年龄";

//手机
com.leanway.reg.decimal.mobile = /^\d{11,12}$/;
com.leanway.reg.msg.mobile = "请输入正确的手机号";

//身份证
com.leanway.reg.decimal.idcard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
com.leanway.reg.msg.idcard = "请输入合法的身份证";

//邮箱
com.leanway.reg.decimal.email = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
com.leanway.reg.msg.email = "请输入正确的邮箱";

//QQ
com.leanway.reg.decimal.qq = /^[1-9][0-9]{4,}$/;
com.leanway.reg.msg.qq = "请输入正确的QQ";

//雇员性质
com.leanway.reg.decimal.type = /^[0-9]{1,2}$/;
com.leanway.reg.msg.type = "请输入0~99数字";

//时间
com.leanway.reg.decimal.time = /^[0-9]{0,}\.{0,1}[0-9]{0,}$/;
com.leanway.reg.msg.time = "请输入数字或小数点";

//数量
com.leanway.reg.decimal.amount = /^[0-9]{1,10}$/;
com.leanway.reg.msg.amount = "请输入1至10位数字";
//accuracy
com.leanway.reg.decimal.accuracy = /^[0-9]{0,1}$/;
com.leanway.reg.msg.accuracy = "请输入1位数字";
