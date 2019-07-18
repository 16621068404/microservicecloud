var clicktime = new Date();
var ope = "addEquipmentCalendar"
$(function(){
	initDateTimeYmdHms("starttime");
	initDateTimeYmdHms("endtime");
	initBootstrapValidator();
	// 初始化对象
	com.leanway.loadTags();
	com.leanway.formReadOnly("equipmentCalendarForm");
	// 加载datagrid
	oTable = initTable();
	// 全选
	com.leanway.enterKeyDown("search", searchEquipmentCalendar);
	com.leanway.initSelect2("#equipmentid",
			"../../../"+ln_project+"/workCenter?method=queryEquipmentBySelect", "搜索设备/雇员");
});
function queryEquipmentBySelect(centrtype){	
	if(centrtype.value=="人工"){
		com.leanway.initSelect2("#equipmentid",
				"../../../"+ln_project+"/workCenter?method=queryEmployeeList", "搜索设备/雇员");
	}else{
		com.leanway.initSelect2("#equipmentid",
				"../../../"+ln_project+"/workCenter?method=queryEquipmentBySelect", "搜索设备/雇员");
	}
	$("#equipmentid").val(null).trigger("change");
}
function initBootstrapValidator() {
	$('#equipmentCalendarForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					name : {
						validators : {
							notEmpty : {},

						}
					},
					shortname : {
						validators : {
							notEmpty : {},

						}
					},

					equipmentid : {
						validators : {
							notEmpty : {},
						}
					},
				}
			});
}
//初始化数据表格
var initTable = function () {

	var table = $('#generalInfo').DataTable( {
			"ajax": "../../../../"+ln_project+"/equipmentCalendar?method=queryEquipmentCalendarList",
			 //"iDisplayLength" : "6",
	        'bPaginate': true,
	        "bDestory": true,
	        "bRetrieve": true,
	        "bFilter":false,
	        "bSort": false,
	        "bProcessing": true,
	        "bServerSide": true,
	        'searchDelay':"5000",
	        "fixedHeader": true,
	         "aoColumns": [
	               {
	            	   "mDataProp": "equipmentcalendarid",
	                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
	                	   $(nTd).html("<div id='stopPropagation" + iRow +"'>"
								   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='checkList' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label>");
						 com.leanway.columnTdBindSelectNew(nTd,"generalInfo","checkList");
	                   }
	               },
	               {"mDataProp": "name"},
	               {"mDataProp": "shortname"},
	               {"mDataProp": "equipempname"},

	          ],
	         "oLanguage" : {
	        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
	         },
	         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	         "fnDrawCallback" : function(data) {
					com.leanway.getDataTableFirstRowId("generalInfo", ajaxLoadEquipmentCalendar,"more","checkList");
					 com.leanway.dataTableClickMoreSelect("generalInfo", "checkList", false,
                             oTable, ajaxLoadEquipmentCalendar,undefined,undefined,"checkAll");

					 com.leanway.dataTableCheckAllCheck('generalInfo', 'checkAll', 'checkList');
				}
	    } ).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );

	return table;
}

var ajaxLoadEquipmentCalendar =function (equipmentcalendarid) {

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/equipmentCalendar",
		data : {
			"method" : "queryEquipmentCalendarObject",
			"equipmentCalendarid" : equipmentcalendarid,
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				setFormValue(tempData.obj);
				com.leanway.formReadOnly("equipmentCalendarForm");

			}
		}
	});

}

/**
 * 删除数据
 * */
function deleteEquipmentCalendar( type ) {


	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");

	if (ids.length == 0) {

		lwalert("tipModal", 1, "请选择要删除的生产阶段!");
		return;

	} else {

		var msg = "确定删除选中的" + ids.split(",").length + "条生产阶段?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	}

}
function isSureDelete( type ){

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/equipmentCalendar?method=deleteEquipmentCalendar",
		data : {
			"conditions" : '{"equipmentcalendarid":"' + ids + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
				if (tempData.code == "success") {

					com.leanway.clearTableMapData( "generalInfo" );

					resetForm();
					oTable.ajax.reload();
				} else {
					lwalert("tipModal", 1, "操作失败！");
				}

			}
		}
	});
}
/**
 * 填充到HTML表单
 * */
function setFormValue (data) {
	resetForm();

	  for (var item in data) {
		  if (item != "searchValue") {
			  $("#" + item).val(data[item]);
		  }

	  }
	// 给select2赋初值
	var equipmentid = data.equipmentid;
	if (equipmentid != null && equipmentid != "" && equipmentid != "null") {
		$("#equipmentid").append(
				'<option value=' + equipmentid + '>' + data.equipempname
						+ '</option>');
		$("#equipmentid").select2("val", [ equipmentid ]);
	}
}
/**
 * 修改数据
 *
 * */
function updateEquipmentCalendar() {

	ope="updateEquipmentCalendar";
	var data = oTable.rows('.row_selected').data();
	if(data.length == 0) {
		lwalert("tipModal", 1, "请选择要修改的生产阶段！");
	} else if(data.length > 1) {
		lwalert("tipModal", 1, "只能选择一个生产阶段进行修改进行修改！");
	}else{
		com.leanway.removeReadOnly("equipmentCalendarForm");
		document.getElementById("name").readOnly=true;
		$("#equipmentid").prop("disabled",true);
		$("#centrtype").prop("disabled",true);
	}
}
//格式化form数据
var formatFormJson = function(formData) {
	var reg = /,$/gi;
	var data = "{";
	for (var i = 0; i < formData.length; i++) {
		data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
	}
	data = data.replace(reg, "");
	data += "}";
	return data;
}
/**
 * 新增
 *
 * */
var addEquipmentCalendar = function() {

		ope="addEquipmentCalendar";
		// 清空表单
		resetForm();
		com.leanway.removeReadOnly("equipmentCalendarForm");
		com.leanway.dataTableUnselectAll("generalInfo", "checkList");
		com.leanway.dataTableUnselectAll("generalInfo", "checkAll");
		com.leanway.clearTableMapData( "generalInfo" );
	//初始化省
}

/**
 * 往里面存数据
 * */

var saveEquipmentCalendar = function() {
	$("#equipmentid").prop("disabled",false);
	$("#centrtype").prop("disabled",false);
	var form  = $("#equipmentCalendarForm").serializeArray();
	//后面确认时应 检测模具编号是否已存在
	var formData = formatFormJson(form);
	$("#equipmentCalendarForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#equipmentCalendarForm').data('bootstrapValidator').isValid()) { // 返回true、false
			$.ajax ( {
				type : "POST",
				url : "../../../../"+ln_project+"/equipmentCalendar",
				data : {
					"method":ope,
					"formData" : formData,
				},
				dataType : "text",
				async : false,
				success : function ( data ) {

					var flag =  com.leanway.checkLogind(data);

					if(flag){

						var tempData = $.parseJSON(data);
						if (tempData.code == "success") {
							com.leanway.formReadOnly("equipmentCalendarForm");

							com.leanway.clearTableMapData( "generalInfo" );

							if(ope=="addEquipmentCalendar"){
							    oTable.ajax.reload();
							}else{
							    oTable.ajax.reload(null,false);
							}
						} 
						lwalert("tipModal", 1, tempData.msg);

					}
				}
			});
	}
}
/**
 * 重置表单
 *
 * */
var resetForm = function ( ) {
	$( '#equipmentCalendarForm' ).each( function ( index ) {
        $('#equipmentCalendarForm')[index].reset( );
    });
	$("#equipmentCalendarForm").data('bootstrapValidator').resetForm();
	$("#equipmentid").val(null).trigger("change");
}
var searchEquipmentCalendar= function () {

	var searchVal = $("#search").val();

	oTable.ajax.url("../../../../"+ln_project+"/equipmentCalendar?method=queryEquipmentCalendarList&searchValue=" + searchVal).load();
}