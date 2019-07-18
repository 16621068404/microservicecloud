var clicktime = new Date();
// 数据字典表
var oTable;
// 系统配置表
var cTable;
$(function() {
	// 初始化表格
	// 初始化对象
	com.leanway.loadTags();
	oTable = initTable();

	cTable = initconfigTabel();
	//绑定回车查询事件
	com.leanway.enterKeyDown("CodeMapSearchValue", searchCodeMap);
	com.leanway.enterKeyDown("SysConfigSearchValue", searchSysConfig);
})
// 初始化数据表格
var initTable = function() {

	var table = $('#configTables')
			.DataTable(
					{
						"ajax" : "../../../../"+ln_project+"/systemconfig?method=querySystemConfigByCodeMap",
						// "iDisplayLength" : "6",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"scrollX":true,
						"scrollY" : "57vh",
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",
						"columns" : [ {
							"data" : "columnname"
						}, {
							"data" : "codevalue"
						}, {
							"data" : "note"
						} ],
						"aoColumns" : [
								{
									"mDataProp" : "codemapid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd)
												.html(
														"<div id='stopPropagation"
																+ iRow
																+ "'>"
																+ "<input class='regular-checkbox' type='checkbox' id='"
																+ sData
																+ "' name='checkList' value='"
																+ sData
																+ "'><label for='"
																+ sData
																+ "'></label>");
										com.leanway.columnTdBindSelectNew(nTd,
												"configTables", "checkList");
									}
								}, {
									"mDataProp" : "configname"
								}, {
									"mDataProp" : "configvalue"
								}, {
									"mDataProp" : "configdesc"
								}, ],
						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {

							// com.leanway.getDataTableFirstRowId("generalInfo",
							// ajaxLoadBomCode,"more", "checkList");
							com.leanway
									.dataTableClickMoreSelect("configTables",
											"checkList", false, oTable,
											undefined, undefined, undefined,
											"checkAll");
							com.leanway.dataTableCheckAllCheck('configTables',
									'checkAll', 'checkList');

							// $('input[type="checkbox"]').icheck({
							// labelHover : false,
							// cursor : true,
							// checkboxClass : 'icheckbox_flat-blue',
							// radioClass : 'iradio_flat-blue'
							// });
						},
					/*
					 * "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
					 * $(nRow).click(function () { alert("a"); var dataList =
					 * oTable.rows('.row_selected').data();
					 * console.info("data:z"+dataList.length); }) }
					 */
					}).on('xhr.dt', function(e, settings, json) {
				com.leanway.checkLogind(json);
			});

	return table;
}
// 初始加载配置表
var initconfigTabel = function() {
	var table = $('#saveconfigTables')
			.DataTable(
					{
						"ajax" : "../../../../"+ln_project+"/systemconfig?method=querySystemConfig",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"scrollX":true,
						"scrollY" : "57vh",
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",

						"aoColumns" : [
								{
									"mDataProp" : "systemconfigid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd).html(
														"<div id='stopPropagation"
																+ iRow
																+ "'>"
																+ "<input class='regular-checkbox' type='checkbox' id='"
																+ sData
																+ "' name='checkList1' value='"
																+ sData
																+ "'><label for='"
																+ sData
																+ "'></label>");
										com.leanway.columnTdBindSelectNew(nTd,
														"saveconfigTables",
														"checkList1");
									}
								},
								{
									"mDataProp" : "configname"
								},
								{
									"mDataProp" : "configvalue"
								},
								{
									"mDataProp" : "configdesc"
								},
								{
									"mDataProp" : "isenable",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd).html(systemConfigIsenableToName(sData));
									}

								},{
									"mDataProp" : "systemconfigid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd).html(
														"<div id='stopPropagation"
																+ iRow
																+ "'>"
																+ "<input  type='hidden' id='"
																+ sData
																+ "' name='systemconfigid' value='"
																+ sData
																+ "'style='display:none'><label for='"
																+ sData
																+ "'></label>");

								},
								"visible": false,
								}],
						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {
							// com.leanway.getDataTableFirstRowId("generalInfo",
							// ajaxLoadBomCode,"more", "checkList");
							com.leanway.dataTableClickMoreSelect(
									"saveconfigTables", "checkList1", false,
									cTable, undefined, undefined, undefined,
									"checkAll1");
							com.leanway.dataTableCheckAllCheck(
									'saveconfigTables', 'checkAll1',
									'checkList1');

							// $('input[type="checkbox"]').icheck({
							// labelHover : false,
							// cursor : true,
							// checkboxClass : 'icheckbox_flat-blue',
							// radioClass : 'iradio_flat-blue'
							// });
						},
						"fnCreatedRow" : function(nRow, aData, iDataIndex) {

						}
					}).on('xhr.dt', function(e, settings, json) {
				com.leanway.checkLogind(json);
			});

	return table;
}

var systemConfigIsenableToName = function(status){
	var result="";
	switch(status){
	case 0:
		result = "是";
		break;
	case 1:
		result = "否";
		break;
	default:
		result = "否";
		break;
	}
	return result;
}

var toTable = function() {
	var dataList = oTable.rows('.row_selected').data();

	if (dataList != undefined && dataList.length > 0) {

		// for (var i = 0; i < dataList.length; i++) {
		//
		// addSystemConfig(dataList[i]);
		// }
		var formatdata = getDataTableData(dataList);
		saveSysConfig(formatdata);

	}
}

// var configname;
// var configvalue;
// var configdesc;
// var addSystemConfig = function(obj) {
// var canAdd = true;
//
// // 判断添加的对象在关系表中是否存在
// var dataList = cTable.rows().data();
//
// if (dataList != undefined && typeof (dataList) != "undefined"
// && dataList.length > 0) {
//
// // 循环遍历Table数据
// for (var i = 0; i < dataList.length; i++) {
//
// var codemapData = dataList[i];
//
// if (codemapData.codemapid == obj.codemapid) {
// canAdd = false;
// }
//
// }
// }
//
// if (canAdd) {
// configname = obj.configname;
// configvalue = obj.configvalue;
// configdesc = obj.configdesc;
// // 调用异步保存
// saveSysConfig(configname, configvalue, configdesc);
// cTable.row.add(obj).draw(false);
// }
// }

var saveSysConfig = function(listConfig) {
	var formData = "{\"listConfig\": " + listConfig + "}";
	$.ajax({
		"url" : "../../../../"+ln_project+"/systemconfig?method=saveSysConfig",
		"dataType" : "text",
		"data" : {
			/*
			 * "configname" : name, "configvalue" : value, "configdesc" : desc
			 */
			"formData" : formData
		},
		"success" : function(data) {
			var Jdata = $.parseJSON(data);
			if (Jdata.status == "success") {
				cTable.ajax.reload();
				lwalert("tipModal", 1, "添加成功!");
			} else if (Jdata.status == "fail") {
				lwalert("tipModal", 1, Jdata.info);
			}
		}
	})
}

var searchCodeMap = function() {
	var searchVal = $("#CodeMapSearchValue").val();
	oTable.ajax
			.url(
					"../../../../"+ln_project+"/systemconfig?method=querySystemConfigByCodeMap&searchValue="
							+ searchVal).load();
}

var searchSysConfig = function() {
	var searchVal = $("#SysConfigSearchValue").val();
	cTable.ajax.url(
			"../../../../"+ln_project+"/systemconfig?method=querySystemConfig&searchValue="
					+ searchVal).load();
}

var showEdit = function(){

	 var data = cTable.rows('.row_selected').data();
		if(data.length == 0) {
//			alert("请选择数据！");
			lwalert("tipModal", 1, "请选择系统配置！");
		} else if(data.length > 1) {
//			alert("只能选择一条数据进行修改！");
			lwalert("tipModal", 1, "只能选择一条系统配置数据进行修改！");
		}else {

	//		opeMethod = "updateCodeMapByConditons";
			$("#formModal").modal("show");
			var systemconfigid =  cTable.rows('.row_selected').data()[0].systemconfigid;
			querySystemConfigById(systemconfigid);
		}

}

function querySystemConfigById(systemconfigid) {
	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/systemconfig",
		data : {
			method : "querySystemConfigById",
			systemconfigid : systemconfigid
		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var json = eval("(" + data + ")").resultObj;

				resetForm();

				setFormValue(json);
			}
		},
		error : function(data) {

		}
	});
}

//修改保存系统配置
function saveOrUpdate(){
	var form = $("#systemConfigForm").serializeArray();
	var formData = formatFormJson(form);

	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/systemconfig",
		data : {
			method : "updateSystemConfig",
			formData : formData
		},
		dataType : "text",
		success : function(data) {
			var Jdata = $.parseJSON(data);
			if(Jdata.status == "success"){
				cTable.ajax.reload();
				$("#formModal").modal("hide");
				lwalert("tipModal",1,"修改成功");
			}else{
				$("#formModal").modal("hide");
				lwalert("tipModal",1,"修改失败");
			}
		}
	})
}


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


//重置表单
var resetForm = function () {
	$( '#systemConfigForm' ).each( function ( index ) {
		$('#systemConfigForm')[index].reset( );
	});

}

function setFormValue(data) {
	if(data.isenable == 1){
		$("#"+1).prop("checked",true);
		$("#"+0).prop("checked",false);
	}else{
		$("#"+0).prop("checked",true);
		$("#"+1).prop("checked",false);
	}
	for ( var item in data) {
		$("#" + item).val(data[item]);
	}
}

var getDataTableData = function(tableObj) {

	var reg = /,$/gi;
	var jsonData = "[";
//	// 判断添加的对象在关系表中是否存在
//	var dataList = cTable.rows().data();

	$("#configTables tbody tr")
			.each(
					function() {
//						var canAdd = true;
//						// 获取该行的下标
						var index = tableObj.row(this).index();
						if ($(this).find("td:eq(0)").find(
								"input[name='checkList']").prop("checked") == true) {
							var productorData = tableObj.rows(index).data()[0];


								if(!isExistCodeMapId(productorData.codemapid)){
									jsonData += JSON.stringify(productorData) + ",";
								}

//							}

						}

					});

	jsonData = jsonData.replace(reg, "");

	jsonData += "]";

	return jsonData;
}

//判断系统配置中是否有codemapid
var isExistCodeMapId = function(codemapid){
	var result = true;
	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/systemconfig",
		data : {
			method : "queryCodeMapId",
			codemapid : codemapid
		},
		dataType : "text",
		async : false,
		success : function(data) {
			var Jdata = $.parseJSON(data);
				result = Jdata.status;
		}
	})

	return result;
}