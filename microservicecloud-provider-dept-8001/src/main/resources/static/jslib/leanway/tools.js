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

//初始化时间， 2015-03-03 13:24:14
var initDateTimeYmdHms = function (dataTimeId) {
	$(dataTimeId).datetimepicker({
		lang : 'ch',
		format : "Y-m-d H:i:s", // 格式化日期
		timepicker : false, // 关闭时间选项
		yearStart : 2000, // 设置最小年份
		yearEnd : 2050, // 设置最大年份
		todayButton : true
		// 关闭选择今天按钮
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
