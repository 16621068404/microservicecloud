var deviceCalendarTable;

var reg=/,$/gi;

var ope = "addDeviceCalendar";

//全局参数  clicktime
var clicktime=new Date();

var readOnlyObj = [{"id":"maincalendar","type":"radio"}];

$ ( function () {

	com.leanway.formReadOnly("deviceCalendarData,calendarOption,deviceTime",readOnlyObj);

	// 初始化对象
	com.leanway.loadTags();

	// 加载datagrid
	deviceCalendarTable = initTable();

	// checkBox全选事件
//	com.leanway.dataTableCheckAll("deviceCalendar", "checkAll", "checkList");

	// DataTable是否多选及选中后触发的事件
	//com.leanway.dataTableClick ("deviceCalendar", "checkList", false, deviceCalendarTable, readOnly, selectClick,unSelectClick);

	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchCalendar);
	//
	$('input[name="week"]').prop("disabled",true);


});

//表单设置只读
var readOnly = function () {
	com.leanway.formReadOnly("deviceCalendarData,calendarOption,deviceTime",readOnlyObj);
}

/*

// 选中触发事件
var selectClick= function ( id ) {
	loadDeviceCalendar(id);
}

// 取消触发事件
var unSelectClick = function (){

	  clearParam();
}*/

// 新增情况下
var addDeviceCalendar = function () {

	ope = "addDeviceCalendar";
	// 清除页面的隐藏数据
	clearParam();

	com.leanway.clearTableMapData( "deviceCalendar" );

	com.leanway.dataTableUnselectAll("deviceCalendar", "checkList");

	com.leanway.removeReadOnly("deviceCalendarData,calendarOption,deviceTime",readOnlyObj);

	$('input[name="week"]').prop("disabled",false);



}

// 修改情况下
var showEditDeviceCalendar = function () {

	//获取选中行的数据
	var data = deviceCalendarTable.rows('.row_selected').data();

	if (data.length == 0) {
		//alert("请选择工作日历修改!");
		lwalert("tipModal", 1, "请选择工作日历修改!");
		return;
	}
	com.leanway.removeReadOnly("deviceCalendarData,calendarOption,deviceTime",readOnlyObj);

	$("#calendarid").val(data[0].calendarid);

	// 修改
	ope = "updateDeviceCalendar";

	loadDeviceCalendar(data[0].calendarid);

	$('input[name="week"]').prop("disabled",false);

}


// 删除工作中心的工作日历
var deleteDeviceCalendar= function ( type ) {

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "deviceCalendar", "checkList");

	if (ids.length == 0) {

		lwalert("tipModal", 1, "请选择要删除的工作日历!");
		return;

	} else {

		var msg = "确定删除选中的" + ids.split(",").length + "条工作日历?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	}

}

function isSureDelete( type) {

	var ids = com.leanway.getCheckBoxData(type, "deviceCalendar", "checkList");

	ajaxDeleteDeviceCalendarWeek(ids);
}

// ajax删除
var ajaxDeleteDeviceCalendarWeek = function (ids) {

	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/deviceCalendar",
		data : {
			"method" : "deleteDeviceCalendarWeek",
			"paramData" : '{"ids":"'+ ids +'"}'
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				//alert(text.info);
				lwalert("tipModal", 1, text.info);
				if (text.status == "success") {

					var colsmap = tabmap.get("deviceCalendar");
					colsmap.clearmap();

					deviceCalendarTable.ajax.reload();
					clearParam();
				}

			}

		}
	});
}

// 保存数据
var saveDeviceCalendarWeek = function ( ) {

	 var name = $("#name").val();

	if ($.trim(name) == "") {
		//alert("请输入工作日历名称!");
		lwalert("tipModal", 1, "请输入工作日历名称!");
		return;
	}


	var arrayForm  = $("#deviceCalendarData").serializeArray();

	var formData = formatFormJsonForDeviceCalendar(arrayForm);

	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/deviceCalendar",
		data : {
			"method" : ope,
			"paramData" : formData
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

			    //alert(text.info);
				lwalert("tipModal", 1, text.info);

				if (text.status == "success") {

					var colsmap = tabmap.get("deviceCalendar");
					colsmap.clearmap();

					if(ope=="addDeviceCalendar"){
						deviceCalendarTable.ajax.reload();
					}else{
					    deviceCalendarTable.ajax.reload(null,false);
					}
					clearParam();

					//将时段选择重置
					$("#createTime").prop('selectedIndex', 0);
					//清空时间段
					$("#timeText").empty();
					//将星期设置只读。
					$('input[name="week"]').prop("disabled",false);

				}

			}

		}
	});

}

// 创建设备工作日历表格
var createDeviceCalenderTable = function ( ) {

	if ($('input[name="week"]:checked').length == 0) {
		//alert("请勾选星期再生成工作日历！");
		lwalert("tipModal", 1, "请勾选星期再生成工作日历！");
		return;
	}


	//选中的星期
	var checkWeek = "";

	// 获取form的时间段数据
	var form  = $("#deviceTime").serializeArray();

	// 开始时间和结束时间转换成Object 类似 list<Object>
	var formData = formatFormJsonObject(form);


	// 循环formData数据
	var forData = eval("(" + formData + ")");

	for (var i = 0; i < forData.length; i++) {

		var starttime = forData[i].starttime;
		var endtime = forData[i].endtime;

		var startMs = new Date("1970/1/1 " + starttime).getTime();
		var endMs = new Date("1970/1/1 " + endtime).getTime();

		if (startMs >= endMs) {
			lwalert("tipModal", 1, "第" + (i + 1) + "行结束时间不能少于或等于开始时间，请检查后填写!");
			return;
		}

		for (var j = 0; j < forData.length; j ++) {

			if (i == j) {

				continue;

			}

			var tempStartTime = forData[j].starttime;
			var tempEndTime = forData[j].endtime;

			var tempStartMs = new Date("1970/1/1 " + tempStartTime).getTime();
			var tempEndMs = new Date("1970/1/1 " + tempEndTime).getTime();

			if ((startMs >= tempStartMs && startMs <= tempEndMs) || (endMs >=tempStartMs && endMs <=  tempEndMs)) {

				lwalert("tipModal", 1, "日历时间区间有重叠，请检查后填写!");
				return;

			}


		}

	}


	//清除工作日历显示值及隐藏域
	resetVal();
	// 获取选中的星期
	$('input[name="week"]:checked').each( function ( ) {

		// 隐藏文本框赋值
		$("#" + $(this).val()).val(formData);

		// table赋值
		$("#" + $(this).val() + "Table").html( formatJsonTdeviceCalendarTableData(formData));
	});

	// 生成完毕后清空checkbox以及对应的form
	$('input[name="week"]').removeAttr("checked");

	//resetForm("deviceTime");



}

//清除工作日历显示值及隐藏域
var resetVal = function ( ) {
	// 数据为空时候，清除table数据以及隐藏文本框数据
	var str = "monday,tuesday,wednesday,thursday,friday,saturday,sunday";

	var strArray = str.split(",");

	for (var i = 0; i< strArray.length; i ++) {
		$("#" + strArray[i]).val("");
		$("#" + strArray[i] +"Table").html("");
	}

	$("input[type=radio][name=maincalendar][value=0]").prop('checked','true');
}

// 把form数据转换成table数据显示
var formatJsonTdeviceCalendarTableData = function (formData) {

	var result = "";

	var data = eval("(" + formData + ")");

	for (var i = 0; i < data.length; i++) {
		result += data[i].starttime;
		result += "—";
		result += data[i].endtime;
		result += "&nbsp;&nbsp;";
	}

	return result;
}

// 格式化form数据
var  formatFormJsonObject = function  (formData) {


	var data = "[";

	for (var i = 0; i < formData.length; i++) {

		if (i % 2 == 0) {
			data += "{";
		}

		data += "\"" +formData[i].name.substring(0, formData[i].name.length - 1) +"\" : \""+formData[i].value+"\"";

		if (i % 2 == 0) {
			data +=",";
		} else {
			data +="},";
		}
	}

	data = data.replace(reg,"");

	data += "]";

	return data;
}

// 格式化form数据
var  formatFormJsonForDeviceCalendar = function  (formData) {

	var reg=/,$/gi;

	var data = "{";

	for (var i = 0; i < formData.length; i++) {

		var tempVal = formData[i].value;

		if (formData[i].name == "calendarid" || formData[i].name == "name") {
			if (tempVal == "") {
				tempVal = "\"\"";
			} else {
				tempVal = "\"" + tempVal + "\"";
			}

		} else {

			if (tempVal == "") {
				tempVal = "[]";
			}
		}

		data += "\"" +formData[i].name +"\" : "+tempVal+",";

	}

	data = data.replace(reg,"");

	data += "}";

	return data;
}

// 创建时段
var createTimeDom = function (obj) {

	// 获取选中的值
	var val = obj.value;

	var innerHtml = "";

	// 为空时候清空text
	if ($.trim(val) == "") {
		$("#timeText").empty();
		return;
	}

	// 转换
	var intValue = parseInt(val);

	// 循环拼接text
	for (var i = 0; i < intValue; i++) {
		innerHtml += '<div class="form-group">';
		innerHtml += '<div class="col-sm-6">';
		innerHtml += '<input class="form-control" id="starttime' + i + '" name="starttime' + i + '" type="text"  placeholder="开始时间" />';
		innerHtml += '</div>';
		innerHtml += '<div class="col-sm-6">';
		innerHtml += '<input class="form-control" id="endtime' + i + '" name="endtime' + i + '" type="text" placeholder="结束时间" />';
		innerHtml += '</div>';
		innerHtml += '</div>';
	}

	// 添加日期text
	$("#timeText").html(innerHtml);

	// 循环绑定事件
	bindTimeText(intValue);

}

// 绑定开始结束时间
var bindTimeText = function (intValue) {

	for (var i = 0; i < intValue; i++) {

		// 绑定开始时间
		initTimePickHms("starttime" + i);

		// 绑定结束时间
		initTimePickHms("endtime" + i);

	}

}

var searchCalendar = function () {

	var searchVal = $("#searchValue").val();
	//再次加载数据
	deviceCalendarTable.ajax.url("../../../"+ln_project+"/deviceCalendar?method=queryDeviceCalendar&searchValue=" + searchVal).load();
}

// 初始化数据表格
var initTable = function () {

	var table = $('#deviceCalendar').DataTable( {
			"ajax": "../../../"+ln_project+"/deviceCalendar?method=queryDeviceCalendar&calendarid="+calendarid,
			/*"iDisplayLength" : "10",*/
	        'bPaginate': true,
	        "bDestory": true,
	        "bRetrieve": true,
	        "bFilter":false,
	        "bSort": true,
	        "scrollY":"250px",
	        "bProcessing": true,
	        "bServerSide": true,
	        "columnDefs": [
	            {
	            	orderable: false,
	            	targets: [0]
		        }
	          ],
	        "columns": [
                {"data" : "calendarid"},
                { "data": "name" },
	         ],
	         "aoColumns": [
	               {
	            	   "mDataProp": "calendarid",
	                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
//	                       $(nTd).html("<input type='checkbox' name='checkList'  value='" + sData + "'>");
	                	   $(nTd)
                 		  .html("<div id='stopPropagation" + iRow +"'>"
                 				  +"<input class='regular-checkbox' type='checkbox' id='"
                 				  + sData
                 				  + "' name='checkList' value='"
                 				  + sData
                 				  + "'><label for='"
                 				  + sData
                 				  + "'></label>");
                 		  com.leanway.columnTdBindSelectNew(nTd,"deviceCalendar","checkList");
	                   }
	               },
	               {"mDataProp": "name"}
	          ],
//	          "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
//	              //add selected class
//	        	  $(nRow).click(function () {
//
//	        		  // 清除工作中心标识以及隐藏数据
//	        		  com.leanway.formReadOnly("deviceCalendarData,calendarOption,deviceTime",readOnlyObj);
//
//	                  if ($(this).hasClass('row_selected')) {
//	                	  clearParam();
//	                	 // $("#name").val("");
//	                      $(this).removeClass('row_selected');
//	                      $(this).find('td').eq(0).find("input[name='checkList']").prop("checked", false)
//	                  } else {
//	                	  //点击之后显示  所需要的内容
//		        		  loadDeviceCalendar(aData.calendarid);
//
//	                      deviceCalendarTable.$('tr.row_selected').removeClass('row_selected');
//	                      $(this).addClass('row_selected');
//	                      $("input[name='checkList']").prop("checked", false);
//	                      $(this).find('td').eq(0).find("input[name='checkList']").prop("checked", true)
//	                  }
//	              });
	       //   },
	         "oLanguage" : {
	        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
	         },
	         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	     	"fnDrawCallback" : function(data) {
	     		com.leanway.setDataTableColumnHide("deviceCalendar");

	     		readOnly();
//	     		com.leanway.getDataTableClickMoreSelectFirstRowId("deviceCalendar",
//	     				loadDeviceCalendar);
	     		com.leanway.getDataTableFirstRowId(
						"deviceCalendar", loadDeviceCalendar,"more","checkList");
				com.leanway.dataTableClickMoreSelect("deviceCalendar",
            			   "checkList", false, deviceCalendarTable, readOnly, loadDeviceCalendar,undefined,"checkAll");

				com.leanway.dataTableCheckAllCheck('deviceCalendar', 'checkAll', 'checkList');
	     	}

	    } ).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );

	return table;
}

// 加载工作日历
var loadDeviceCalendar = function (calendarid) {

	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/deviceCalendar",
		data : {
			"method" : "queryDeviceCalendarWeek",
			"calendarid" : calendarid
		},
		dataType : "json",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){
			  //清除隐藏数据
			  clearParam();
			  // 加载的数据转换成html显示
			  loadDataInnerHtml( data.weekData );

			  // 工作日历标识、名称
			  $("#calendarid").val(data.calendarData.calendarid);
    		  $("#name").val(data.calendarData.name);
    		  $("input[type=radio][name=maincalendar][value=" + data.calendarData.maincalendar + "]").prop('checked','true');

    		  //将时段选择重置
    		  $("#createTime").prop('selectedIndex', 0);
    		  //清空时间段
    		  $("#timeText").empty();
    		  $('input[name="week"]').removeAttr("checked");
    		  $('input[name="week"]').prop("disabled",true);


			}
		}
	});

}

// 加载的数据转换成html显示
var loadDataInnerHtml = function( data ) {

	if (data != null && data.length > 0) {

		for (var i = 0; i < data.length; i ++) {

			// 英文名称
			var englishname = data[i].englishname;

			// 日工作日历
			var listDeviceCalendarDay = data[i].listDeviceCalendarDay;

			// 标识
			var calendarid = data[i].calendarid;

			// 隐藏文本框赋值
			setHiddenValue(calendarid, englishname, listDeviceCalendarDay);

			// 生成table
			var dayHtml = deviceCalendarDayHtml(listDeviceCalendarDay);

			// 创建日历表格
			$("#" + englishname + "Table").html(dayHtml);

		}

	} else {
		clearParam();
	}

}

// 把日工作日历转换成html
var deviceCalendarDayHtml = function( listDeviceCalendarDay ) {

	var html = "";

	if (listDeviceCalendarDay != null && listDeviceCalendarDay.length > 0) {

		for (var i = 0; i < listDeviceCalendarDay.length; i ++) {

			html += listDeviceCalendarDay[i].starttime;
			html += "—";
			html += listDeviceCalendarDay[i].endtime;
			html += "&nbsp;&nbsp;";

		}

	}

	return html;
}

// 隐藏数据赋值
var setHiddenValue = function (calendarid, englishname, listDeviceCalendarDay) {

	if (listDeviceCalendarDay != null && listDeviceCalendarDay.length > 0) {

		var hiddenVal = "[";

		for (var i = 0; i < listDeviceCalendarDay.length; i++) {

			hiddenVal += "{\"starttime\" : \"" + listDeviceCalendarDay[i].starttime  + "\",\"endtime\" : \""+ listDeviceCalendarDay[i].endtime  +  "\"},";

		}
		hiddenVal = hiddenVal.replace(reg,"");

		hiddenVal += "]";

		$("#" + englishname).val(hiddenVal);

	} else {

		$("#" + englishname).val("");

	}
}

// 清除页面的隐藏数据
var clearParam = function () {

	// 数据为空时候，清除table数据以及隐藏文本框数据
	var str = "monday,tuesday,wednesday,thursday,friday,saturday,sunday,name,calendarid";

	var strArray = str.split(",");

	for (var i = 0; i< strArray.length; i ++) {

		$("#" + strArray[i]).val("");
		$("#" + strArray[i] +"Table").html("");

	}

	$("input[type=radio][name=maincalendar][value=0]").prop('checked','true');

}

/**
 * 重置表单
 */
function resetForm(form ) {
    $('#' + form).each(function (index) {
        $('#' + form)[index].reset();
    });
}

/**
 * 双击重置时间
 */
var editTimeDom = function ( ) {
	if( ope == "addDeviceCalendar" || ope == "updateDeviceCalendar" ) {

		var str = "mondayTable,tuesdayTable,wednesdayTable,thursdayTable,fridayTable,saturdayTable,sundayTable";
		var val = "";
		var count = 0;
		var weekday = "";
		var strArray = str.split(",");

		for (var i = 0; i< strArray.length; i ++) {

			val = $("#" + strArray[i]).html();

			if ( val != "") {

				count = val.split("—").length - 1;

				weekday += strArray[i] + ",";
			}
		}
		if( count > 0 ) {

			weekday = weekday.split(",");

			for ( var i  in weekday ) {

				var day = weekday[i].replace("Table","");

				$( "form input[value='" + day +"']").prop("checked",true);

			}

			$("#createTime").val(count);

			var innerHtml = "";

			// 循环拼接text
			for (var i = 0; i < count; i++) {
				innerHtml += '<div class="form-group">';
				innerHtml += '<div class="col-sm-6">';
				innerHtml += '<input class="form-control" id="starttime' + i + '" name="starttime' + i + '" type="text"  placeholder="开始时间" />';
				innerHtml += '</div>';
				innerHtml += '<div class="col-sm-6">';
				innerHtml += '<input class="form-control" id="endtime' + i + '" name="endtime' + i + '" type="text" placeholder="结束时间" />';
				innerHtml += '</div>';
				innerHtml += '</div>';
			}

			// 添加日期text
			$("#timeText").html(innerHtml);
			// 循环绑定事件
			bindTimeText(count);
		}

		$("input[type=radio][name=maincalendar][value=0]").prop('checked','true');

	}
}