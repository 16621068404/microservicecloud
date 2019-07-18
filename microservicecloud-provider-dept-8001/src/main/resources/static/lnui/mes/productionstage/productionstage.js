var clicktime = new Date();
var ope = "addProductionStage"
$(function() {
	initBootstrapValidator();
	// 初始化对象
	com.leanway.loadTags();
	com.leanway.formReadOnly("productionStageForm");
	// 加载datagrid
	oTable = initTable();

	
	// 全选
	com.leanway.enterKeyDown("searchValue", searchProductionStage);
	com.leanway.initSelect2("#productorid", "../../../" + ln_project
			+ "/productors?method=queryProductorBySearch", "搜索产品");
	com.leanway.initSelect2("#versionid", "../../../" + ln_project
			+ "/productors?method=queryProductorVersionsBySearch", "搜索版本");
});
function initBootstrapValidator() {
	$('#productionStageForm').bootstrapValidator({
		excluded : [ ':disabled' ],
		fields : {
			stagecode : {
				validators : {
					notEmpty : {},

				}
			},
			stagename : {
				validators : {
					notEmpty : {},

				}
			},

			productorid : {
				validators : {
					notEmpty : {},
					
				}
			},
			toptypecode : {
				validators : {
					notEmpty : {},
				}
			},
//			typename : {
//				validators : {
//					notEmpty : {},
//				}
//			},
			stagelevels : {
				validators : {
					stringLength : {
						min : 2,
						max : 2
					},
					regexp : com.leanway.reg.fun(
							com.leanway.reg.decimal.number,
							com.leanway.reg.msg.number)
				}
			},
			versionid : {
				validators : {
					notEmpty : {},
				}
			},
			
		}
	});
}


 

// 初始化计量单位转化下拉框
var setUnitConversion = function(data) {
	var html = "";

	for ( var i in data) {
		// 拼接option
		html += "<option value=" + data[i].unitconversionid + ">"
				+ data[i].note + "</option>";
	}

	$("#unitconversion").html(html);
}

// 初始化数据表格
var initTable = function() {

	var table = $('#generalInfo')
			.DataTable(
					{
						"ajax" : "../../../../"
								+ ln_project
								+ "/productionStage?method=queryProductionStageList",
						// "iDisplayLength" : "6",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",
						"fixedHeader" : true,
						"aoColumns" : [
								{
									"mDataProp" : "stageid",
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
												"generalInfo", "checkList");
									}
								}, {
									"mDataProp" : "stagecode"
								}, {
									"mDataProp" : "stagename"
								}, {
									"mDataProp" : "productordesc"
								}, {
									"mDataProp" : "version"
								},

						],
						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {
							com.leanway.getDataTableFirstRowId("generalInfo",
									ajaxLoadProductionStage, "more",
									"checkList");
							
							
							com.leanway.dataTableClickMoreSelect("generalInfo",
									"checkList", false, oTable,
									ajaxLoadProductionStage, undefined,
									undefined, "checkAll");
						
							com.leanway.dataTableCheckAllCheck('generalInfo',
									'checkAll', 'checkList');
						}
					}).on('xhr.dt', function(e, settings, json) {
				com.leanway.checkLogind(json);
			});

	return table;
}
// 触发select2选择事件，给隐藏域赋值
$("#productorid")
		.on(
				"select2:select",
				function(e) {
					com.leanway
							.initSelect2(
									"#versionid",
									"../../../"
											+ ln_project
											+ "/productors?method=queryProductorVersionsBySearch&productorid="
											+ $(this).val(), "搜索版本");
				});

var ajaxLoadProductionStage = function(stageid) {

	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionStage",
		data : {
			"method" : "queryProductionStageObject",
			"stageid" : stageid,
		},
		dataType : "text",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {

				var tempData = $.parseJSON(data);
				setFormValue(tempData.obj);
				com.leanway.formReadOnly("productionStageForm");

			}
		}
	});
	// 查询计量单位转换
	$.ajax({
		type : "get",
		url : "../../../../" + ln_project + "/unitConversion",
		data : {
			method : "queryUnitConversionWithStageid",
			"stageid" : stageid,
		},
		dataType : "json",
		success : function(json) {

			var flag = com.leanway.checkLogind(json);

			if (flag) {

				// 下拉框赋值
				setUnitConversion(json.data);
			}
		},
		error : function(data) {

		}
	});

}

/**
 * 删除数据
 */
function deleteProductionStage(type) {

	if (type == undefined || typeof (type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");

	if (ids.length == 0) {

		lwalert("tipModal", 1, "请选择要删除的生产阶段!");
		return;

	} else {

		var msg = "确定删除选中的" + ids.split(",").length + "条生产阶段?";

		lwalert("tipModal", 2, msg, "isSureDelete(" + type + ")");
	}

}
function isSureDelete(type) {

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project
				+ "/productionStage?method=deleteProductionStage",
		data : {
			"conditions" : '{"stageid":"' + ids + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {

				var tempData = $.parseJSON(text);
				if (tempData.code == "success") {

					com.leanway.clearTableMapData("generalInfo");

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
 */
function setFormValue(data) {

	resetForm();

	for ( var item in data) {
		if (item != "searchValue") {
			$("#" + item).val(data[item]);
		}

	}
	
	console.log(data);
	// 给select2赋初值
	var productorid = data.productorid;
	if (productorid != null && productorid != "" && productorid != "null") {
		$("#productorid").append(
				'<option value=' + productorid + '>' + data.productorname + "("
						+ data.productordesc + ")" + '</option>');
		$("#productorid").select2("val", [ productorid ]);
	}
	// 给select2赋初值
	var versionid = data.versionid;
	console.info(data.version);
	if (versionid != null && versionid != "" && versionid != "null") {
		$("#versionid")
				.append(
						'<option value=' + versionid + '>' + data.version
								+ '</option>');
		$("#versionid").select2("val", [ versionid ]);
	}

}
/**
 * 修改数据
 * 
 */
function updateProductionStage() {

	ope = "updateProductionStage";
	var data = oTable.rows('.row_selected').data();
	if (data.length == 0) {
		lwalert("tipModal", 1, "请选择要修改的生产阶段！");
	} else if (data.length > 1) {
		lwalert("tipModal", 1, "只能选择一个生产阶段进行修改进行修改！");
	} else {
		com.leanway.removeReadOnly("productionStageForm");
		document.getElementById("stagecode").readOnly = true;
		$("#productorid").prop("disabled", true);
		$("#versionid").prop("disabled", true);
	}
}
// 格式化form数据
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
 */
var addProductionStage = function() {

	ope = "addProductionStage";
	// 清空表单
	resetForm();
	com.leanway.removeReadOnly("productionStageForm");
	com.leanway.dataTableUnselectAll("generalInfo", "checkList");
	com.leanway.dataTableUnselectAll("generalInfo", "checkAll");
	com.leanway.clearTableMapData("generalInfo");
	// 初始化省
}

/**
 * 往里面存数据
 */

var saveProductionStage = function() {
	$("#productorid").prop("disabled", false);
	$("#versionid").prop("disabled", false);
	var form = $("#productionStageForm").serializeArray();
	// 后面确认时应 检测模具编号是否已存在
	var formData = formatFormJson(form);
	$("#productionStageForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#productionStageForm').data('bootstrapValidator').isValid()) { // 返回true、false
		$.ajax({
			type : "POST",
			url : "../../../../" + ln_project + "/productionStage",
			data : {
				"method" : ope,
				"formData" : formData,
			},
			dataType : "text",
			async : false,
			success : function(data) {

				var flag = com.leanway.checkLogind(data);

				if (flag) {

					var tempData = $.parseJSON(data);
					console.info(tempData);
					if (tempData.code == "success") {
						com.leanway.formReadOnly("productionStageForm");

						com.leanway.clearTableMapData("generalInfo");

						if (ope == "addProductionStage") {
							oTable.ajax.reload();
						} else {
							oTable.ajax.reload(null, false);
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
 */
var resetForm = function() {
	$('#productionStageForm').each(function(index) {
		$('#productionStageForm')[index].reset();
	});
	$("#productionStageForm").data('bootstrapValidator').resetForm(true);
	$("#productorid").val(null).trigger("change");
	$("#versionid").val(null).trigger("change");
}
var searchProductionStage = function() {

	var searchVal = $("#searchValue").val();

	oTable.ajax
			.url(
					"../../../../"
							+ ln_project
							+ "/productionStage?method=queryProductionStageList&searchValue="
							+ searchVal).load();
}