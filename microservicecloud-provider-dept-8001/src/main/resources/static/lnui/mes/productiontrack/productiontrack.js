/**
 * 
 * @author 熊必强
 * 
 * 
 * 
 */

var clicktime = new Date();

var readOnlyObj = [ {
	"id" : "saveOrUpdateAId",
	"type" : "button"
}, {
	"id" : "resetform",
	"type" : "button"
}, {
	"id" : "productionorderid",
	"type" : "select"
} ];

// 字母带数字
com.leanway.reg.decimal.value = /^[\u0391-\uFFE5a-zA-Z0-9]{0,}$/;
com.leanway.reg.msg.value = "请输入有效字符";

// 数字
/*
 * com.leanway.reg.decimal.num = /^[1-9]$/; com.leanway.reg.msg.num =
 * "请输入正确的数字";
 */
com.leanway.reg.decimal.num = /^[0-9]{1,}[.]{0,1}[0-9]{0,8}$/;
com.leanway.reg.msg.num = "请输入整数或小数";

$(function() {
	// 初始化对象
	com.leanway.loadTags();

	// 表单设置只读
	com.leanway.formReadOnly("productionTrackForm", readOnlyObj);
	// 加载所有关联表中的数据
	loadConnectionTableId();
	// 加载不合格原因表
	findUnQualified();
	// 校验
	initBootstrapValidator();

	com.leanway.buildTag();
	// 加载datagrid
	oTable = initTable();

	// 初始化表格
	com.leanway.loadTags();
	// select2事件
	initSelect2("#productionorderid", "../../../../" + ln_project
			+ "/productionTrack?method=queryProductionOrderName", "请输入产品订单编号");
	// enter键时候触发查询
	com.leanway.enterKeyDown("queryproductiontrackname",
			queryProductionTrackName);

	// 初始化时间控件
	initDateTimeYmdHms("practicalendtime");
	initDateTimeYmdHms("runendtime");

	// 初始化实际结束事件为disabled
	document.getElementById("practicalendtime").readOnly = true;

	$("input[name=confirmstatus]").click(function() {
		searchProductionTrack();
	});
	initBootstrapValidator();
})

$("input[name=transferstatus]").click(function() {
	searchProductionTrack();
});

function searchProductionTrack() {

	var confirmstatus = $('input[name="confirmstatus"]:checked').val();

	var transferstatus = $('input[name="transferstatus"]:checked').val();
	tabmap.clear();
	colmap.clear();

	oTable.ajax
			.url(
					"../../../../"
							+ ln_project
							+ "/productionTrack?method=findAllProductionTrack&confirmstatus="
							+ confirmstatus + "&transferstatus="
							+ transferstatus).load();
}

$("#storeid").on(
		"select2:select",
		function(e) {

			var name = $(this).find("option:selected").text()

			var productorid = $("#productorid").val();

			var storeid = $(this).find("option:selected").val();

			$("#mapid").val(null).trigger("change");

			initSelect2("#mapid", "../../../../" + ln_project
					+ "/companyMap?method=queryMapBySelect2&name=" + name
					+ "&productorid=" + productorid + "&storeid=" + storeid,
					"请输入仓储名称");

			queryDefaultMap(name, productorid, storeid);

		});

// 条码生产
function queryDefaultMap(name, productorid, storeid) {
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/companyMap",
		data : {
			"method" : "queryDefaultMap",
			"name" : name,
			"productorid" : productorid,
			"storeid" : storeid
		},
		dataType : "text",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {
				var tempData = $.parseJSON(data);
				if (tempData != null) {
					$("#mapid").append(
							'<option value=' + tempData.mapid + '>'
									+ tempData.name + '</option>');

					$("#mapid").select2("val", [ tempData.mapid ]);
				}

			}
		},
		error : function() {
			// alert("error");
			lwalert("tipModal", 1, "error！");
		}
	});
}

// 条码生产
function produceBarCode() {
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/codeTemplate",
		data : {
			"method" : "getSerialTemplate",
			"tablename" : "productiontrack",
			"column" : "endcode",
			"type" : "1",
		},
		dataType : "text",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {

				// alert(data);
				var tempData = $.parseJSON(data);
				document.getElementById("endcode").value = tempData;

			}
		},
		error : function() {
			// alert("error");
			lwalert("tipModal", 1, "error！");
		}
	});
}
/**
 * 
 * 查找不合格原因
 * 
 */
function findUnQualified() {
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/exceptionreason",
		data : {
			method : "findAllExceptionReason",
		},
		dataType : "text",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {
				var result = eval("(" + data + ")");
				var unqualifiedreason = result.data;
				var unqualifiedreasonhtml = "";
				if (unqualifiedreason != null) {
					for (var i = 0; i < unqualifiedreason.length; i++) {
						/**
						 * option 的拼接
						 */
						unqualifiedreasonhtml += "<option value="
								+ unqualifiedreason[i].exceptionid + ">"
								+ unqualifiedreason[i].shortname + "</option>";
					}
					$("#unqualifiedreason").html(unqualifiedreasonhtml);
				}

			}
		}
	});

}

// 触发select2选择事件，给隐藏域赋值(产品订单号)
$("#productionorderid").on("select2:select", function(e) {
	$("#name").val($(this).find("option:selected").text());
});

/**
 * 初始化select2事件
 * 
 * id: 为要操作的对象 url: url text: 要在select中显示的文本
 * 
 */

function initSelect2(id, url, text) {
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

$("#productionorderid").on("select2:select", function(e) {

	queryProductionOrderItem();
});
/**
 * 显示还可以追踪的生产订单
 * 
 */
function queryProductionOrderItem() {
	var productionorderid = $("#productionorderid").val();

	$.ajax({
		type : "get",
		url : "../../../../" + ln_project + "/productionTrack",
		data : {
			method : "queryProductionOrderItem",
			"productionorderid" : productionorderid
		},
		dataType : "text",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {
				var json = eval("(" + data + ")")
				// 填充form表单
				// showTrackDate();
				if (json != null) {
					json.totalcount = "";
					setFormValue(json);
					readonlyFalse();
				}

			}
		}
	});
}
// 加载所有的关联表id数据
function loadConnectionTableId() {
	$.ajax({
		type : 'get',
		url : '../../../../' + ln_project + '/productionTrack',
		data : {
			method : 'selectConnectionTableId',
		},
		dataType : 'text',
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {

				var json = eval("(" + data + ")")
				/**
				 * 加载工作中心id
				 * 
				 */
				var workCenters = json.workCenters;
				var workCentershtml = "";

				for (var i = 0; i < workCenters.length; i++) {
					/**
					 * option 的拼接
					 */
					workCentershtml += "<option value="
							+ workCenters[i].centerid + ">"
							+ workCenters[i].centername + "</option>";
				}
				$("#centerid").html(workCentershtml);

				/**
				 * 加载企业
				 * 
				 */
				var companyBeans = json.companyBeans;
				var companyBeanshtml = "";

				for (var i = 0; i < companyBeans.length; i++) {
					/**
					 * option 的拼接
					 */
					companyBeanshtml += "<option value="
							+ companyBeans[i].compId + ">"
							+ companyBeans[i].compName + "</option>";
				}
				$("#compid").html(companyBeanshtml);

				/**
				 * 加载产品id
				 * 
				 */
				var productor = json.productor;
				var productorhtml = "";

				for (var i = 0; i < productor.length; i++) {
					/**
					 * option 的拼接
					 */
					productorhtml += "<option value="
							+ productor[i].productorid + ">"
							+ productor[i].productorname + "</option>";
				}
				$("#productorid").html(productorhtml);

				/**
				 * 加载计量单位
				 * 
				 */
				var uList = json.uList;
				var uListhtml = "";

				for (var i = 0; i < uList.length; i++) {
					/**
					 * option 的拼接
					 */
					uListhtml += "<option value=" + uList[i].unitsid + ">"
							+ uList[i].unitsname + "</option>";
				}
				$("#unitsid").html(uListhtml);
			}
		},
		error : function(data) {
			// alert("查询出错");
			lwalert("tipModal", 1, "查询出错");
		}
	});
}
// 校验
function initBootstrapValidator() {
	$('#productionTrackForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					qualifiedcount : {
						validators : {
							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.num,
									com.leanway.reg.msg.num)
						}
					},
					unqualifiedcount : {
						validators : {
							/* notEmpty: {}, */
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.num,
									com.leanway.reg.msg.num)
						}
					}
				}
			});

}

// 初始化数据表格
var initTable = function() {
	var confirmstatus = $('input[name="confirmstatus"]:checked').val();
	var transferstatus = $('input[name="transferstatus"]:checked').val();
	var table = $('#generalInfo')
			.DataTable(
					{
						"ajax" : "../../../../"
								+ ln_project
								+ "/productionTrack?method=findAllProductionTrack&confirmstatus="
								+ confirmstatus + "&transferstatus="
								+ transferstatus,
						// "iDisplayLength" : "10",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"scrollX" : true,
						"scrollY" : "57vh",
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",
						"columns" : [ {
							"data" : "trackid"
						}, ],
						"aoColumns" : [
								{
									"mDataProp" : "trackid",
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
									"mDataProp" : "endcode"
								}, {
									"mDataProp" : "productionnumber"
								}, {
									"mDataProp" : "productorname"
								}, {
									"mDataProp" : "createstatus"
								}, ],
						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {

							com.leanway.getDataTableFirstRowId("generalInfo",
									ajaxLoadProductionObject, "more",
									"checkList");

							// 点击dataTable触发事件
							com.leanway.dataTableClickMoreSelect("generalInfo",
									"checkList", false, oTable,
									ajaxLoadProductionObject, undefined,
									undefined, "checkAll");

							com.leanway.dataTableCheckAllCheck('generalInfo',
									'checkAll', 'checkList');

						},

					}).on('xhr.dt', function(e, settings, json) {
				com.leanway.checkLogind(json);
			});

	return table;
}

/**
 * 查询到右边显示
 */
var ajaxLoadProductionObject = function(trackid) {

	com.leanway.formReadOnly("productionTrackForm", readOnlyObj);
	// document.getElementById("printBarcode").disabled=false;
	// document.getElementById("practicalstarttime").disabled=true;
	// document.getElementById("practicalendtime").disabled=true;
	// document.getElementById("totalcount").disabled=true;
	// document.getElementById("qualifiedcount").disabled=true;
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionTrack",
		data : {
			method : "findAllProductionTrackObject",
			"trackid" : trackid,
		},
		dataType : "text",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {

				var result = eval("(" + data + ")");
				setFormValue(result.ProductionTrackConditions);
			}
		}
	});

}

// 模糊查询
function queryProductionTrackName() {

	var searchValue = $("#queryproductiontrackname").val();
	var confirmstatus = $('input[name="confirmstatus"]:checked').val();
	var transferstatus = $('input[name="transferstatus"]:checked').val();

	oTable.ajax
			.url(
					"../../../../"
							+ ln_project
							+ "/productionTrack?method=queryProductionTrackName&searchValue="
							+ searchValue + "&confirmstatus=" + confirmstatus
							+ "&transferstatus=" + transferstatus).load();
}

/**
 * 填充到HTML表单
 */
function setFormValue(data) {

	$("#mapid").val(null).trigger("change");
	$("#storeid").val(null).trigger("change");

	for ( var item in data) {

		$("#" + item).val(data[item]);

	}

	var productionorderid = data.productionorderid;
	if (productionorderid != null && productionorderid != ""
			&& productionorderid != "null") {
		$("#productionorderid").append(
				'<option value=' + productionorderid + '>'
						+ data.productionnumber + '</option>');

		$("#productionorderid").select2("val", [ productionorderid ]);
	}

	/*var storeid = data.storeid;
	if (storeid != null && storeid != "" && storeid != "null") {
		$("#storeid")
				.append(
						'<option value=' + storeid + '>' + data.storename
								+ '</option>');

		$("#storeid").select2("val", [ storeid ]);
	}

	var mapid = data.mapid;
	if (mapid != null && mapid != "" && mapid != "null") {
		$("#mapid").append(
				'<option value=' + mapid + '>' + data.name + '</option>');

		$("#mapid").select2("val", [ mapid ]);
	}
*/
}

// 个别显示需要设置为可变
function readonlyFalse() {
	document.getElementById("totalcount").readOnly = true;
	document.getElementById("qualifiedcount").readOnly = false;
	document.getElementById("unqualifiedcount").readOnly = false;
	document.getElementById("unqualifiedreason").disabled = false;
	document.getElementById("qualifiedcount").readOnly = false;
	document.getElementById("runendtime").readOnly = false;
	document.getElementById("endcode").disabled = false;
	// document.getElementById("storeid").disabled = false;
	document.getElementById("instocknumber").readOnly = false;

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
 * 新增时 清空表单内容 状态依然是不可修改 提示请选择产品订单号
 * 
 */
var addProductionTrack = function() {

	resetForm();
	com.leanway.dataTableUnselectAll("generalInfo", "checkList");
	document.getElementById("saveOrUpdateAId").disabled = false;
	// document.getElementById("totalcount").disabled=false;
	// document.getElementById("qualifiedcount").disabled=false;
	// document.getElementById("instocknumber").disabled=false;
	document.getElementById("productionorderid").disabled = false;
	$("#productionorderid").val(null).trigger("change");
	$("#mapid").val(null).trigger("change");
	$("#storeid").val(null).trigger("change");

	opeMethod = "addProductionTrack";
}

/**
 * 往里面存数据
 */

var saveProductionTrack = function() {

	if (opeMethod == "addProductionTrack") {
		var unqualifiedreason = $("#unqualifiedreason").val();
		var unqualifiedcount = $("#unqualifiedcount").val();
		isDispatchingTracked();
		if (eval(unqualifiedcount) > 0) {
			if (unqualifiedreason == null) {

				lwalert("tipModal", 1, "不合格原因不能为空！");

			} else if (eval(unqualifiedcount) == 0) {

				if (unqualifiedreason != null) {

					lwalert("tipModal", 1, "不合格数量为0，不能填写不合格原因！");

				}

			} else {
				if (!isDispatchingTrack) {
					lwalert("tipModal", 2, "该订单还未进行工序追踪，确定要进行产品追踪吗？",
							"judegeAddProductionTrackTrue()");
				} else {
					judegeAddProductionTrackTrue();
				}

			}

		} else {
			if (!isDispatchingTrack) {
				lwalert("tipModal", 2, "该订单还未进行工序追踪，确定要进行产品追踪吗？",
						"judegeAddProductionTrackTrue()");
			} else {
				judegeAddProductionTrackTrue();
			}
		}
	} else {

		var totalcount = eval($("#totalcount").val());
		var instocknumber = eval($("#instocknumber").val());

		// 入库数量不能大于完工数量
		if (instocknumber > totalcount) {

			lwalert("tipModal", 1, "入库数量不能大于完工数量！");
			document.getElementById("instocknumber").focus;
			return;
		}

		addProductionTrackTrue();
	}

}

/**
 * 
 * 继续判断
 * 
 */
function judegeAddProductionTrackTrue() {
	var totalcount = $("#totalcount").val();
	var qualifiedcount = $("#qualifiedcount").val();
	var surplusnumber = $("#surplusnumber").val();
	var instocknumber = $("#instocknumber").val();
	var practicalstarttime = document.getElementById("practicalstarttime").value;
	var practicalendtime = $("#practicalendtime").val();
	var runendtime = $("#runendtime").val();

	if (eval(totalcount) == 0 && eval(qualifiedcount) == 0
			&& eval(unqualifiedcount) == 0) {
		lwalert("tipModal", 1, "数量填写错误，完工数量、（不）合格数量全为0，保存无效，请核对！");
		return;
	}
	if (eval(totalcount) > eval(surplusnumber)) {

		lwalert("tipModal", 1, "实际完成数量不能大于计划数量！");
		document.getElementById("totalcount").focus;
		return;
	}
	if (eval(qualifiedcount) > eval(surplusnumber)) {

		lwalert("tipModal", 1, "合格数量不能大于计划数量！");
		document.getElementById("qualifiedcount").focus;
		return;
	}

	// 入库数量不能大于完工数量
	if (instocknumber > totalcount) {

		lwalert("tipModal", 1, "入库数量不能大于完工数量！");
		document.getElementById("instocknumber").focus;
		return;
	}

	var productionorderid = $("#productionorderid").val();

	if (productionorderid == "" || productionorderid == null) {

		lwalert("tipModal", 1, "请输入产品订单号！");
		return;

	}

	if (runendtime == null || runendtime == "") {
		lwalert("tipModal", 1, "请填写产品实际追踪时间！");
		return;
	}

	if (surplusnumber == totalcount) {
		if (practicalendtime == null || practicalendtime == "") {

			lwalert("tipModal", 1, "完工数量等于计划数量时，实际结束时间必须填写！");
			return;

		}
		if (practicalendtime < practicalstarttime) {

			lwalert("tipModal", 1, "开始时间不能大于结束时间！");
			return;
		}
		addProductionTrackTrue();

	} else {
		addProductionTrackTrue();
	}

}
function addProductionTrackTrue() {

	// 提交时设置disabled false
	document.getElementById("productorid").disabled = false;
	document.getElementById("compid").disabled = false;
	document.getElementById("unitsid").disabled = false;

	var endcode = $.trim($("#endcode").val());

	var form = $("#productionTrackForm").serializeArray();
	var productionorderid = $("#productionorderid").val();
	var formData = formatFormJson(form);

	$("#productionTrackForm").data('bootstrapValidator').validate();
	if ($('#productionTrackForm').data('bootstrapValidator').isValid()) {
		$.ajax({
			type : "post",
			url : "../../../../" + ln_project + "/productionTrack",
			data : {
				method : opeMethod,
				"productionorderid" : productionorderid,
				"formData" : formData
			},
			dataType : "text",
			async : false,
			success : function(data) {

				var flag = com.leanway.checkLogind(data);

				if (flag) {
					var tempData = $.parseJSON(data);
					if (tempData.code == "1") {
						resetForm();
						tabmap.clear();
						colmap.clear();
						oTable.ajax.reload();
						ajaxLoadProductionObject(tempData.resultObj.trackid);
						lwalert("tipModal", 1, "保存成功！");
					} else {
						lwalert("tipModal", 1, "操作失败！");
					}

				}
			},
			error : function() {

				// document.getElementById("productorid").disabled=true;
				// document.getElementById("unitsid").disabled=true;
				// document.getElementById("compid").disabled=true;
				lwalert("tipModal", 1, "保存失败！");
			}
		});

	}/*
		 * else { // alert("输入字符不合法") lwalert("tipModal", 1, "输入字符不合法！"); }
		 */
}

/**
 * 重置表单
 * 
 */
var resetForm = function() {

	$('#productionTrackForm').each(function(index) {

		$('#productionTrackForm')[index].reset();

	});
	$("#productionTrackForm").data('bootstrapValidator').resetForm();
}

/**
 * 判断不合格数量
 * 
 * 
 */
function judgeUnDone() {

	var surplusnumber = $("#surplusnumber").val();

	var qualifiedcount = $("#qualifiedcount").val();

	if (eval(qualifiedcount) == eval(surplusnumber)) {
		// document.getElementById("practicalendtime").disabled=false;
		document.getElementById("practicalendtime").readOnly = false;
	} else {
		document.getElementById("practicalendtime").readOnly = true;
	}

	if (qualifiedcount != null) {

		document.getElementById("totalcount").readonly = true;

		var x = parseInt(surplusnumber);
		var y = parseInt(qualifiedcount);

		var unqualifiedcount = x - y;

		if (unqualifiedcount < 0) {
			// alert("合格数量不能大于制作数量");
			lwalert("tipModal", 1, "合格数量不能大于未完成数量！");
		} else {
			// document.getElementById("unqualifiedcount").value=surplusnumber-qualifiedcount;
			document.getElementById("totalcount").value = qualifiedcount;
		}
	}
}

/**
 * 
 * 完成数量判断
 * 
 * 当可以填写完成数量时 不能填写不合格数量
 * 
 * 反之 依然
 * 
 */
function totalcountqty() {

	var totalcount = $("#totalcount").val();
	var qualifiedcount = $("#qualifiedcount").val();
	var surplusnumber = $("#surplusnumber").val();
	if (eval(totalcount) != eval(surplusnumber)) {
		document.getElementById("practicalendtime").readOnly = true;
	}
	if (totalcount == null || totalcount == "" || totalcount == 0) {

		document.getElementById("qualifiedcount").readOnly = false;
		document.getElementById("unqualifiedreason").readOnly = false;
		document.getElementById("unqualifiedcount").readOnly = false;

	} else if (eval(totalcount) > eval(surplusnumber)) {

		// alert("实际完成数量不能大于计划数量");
		lwalert("tipModal", 1, "实际完成数量不能大于计划数量！");
		document.getElementById("totalcount").focus;

	} else if (eval(totalcount) == eval(surplusnumber)) {
		// document.getElementById("practicalendtime").disabled=false;
		document.getElementById("practicalendtime").readOnly = false;
	}
}
/**
 * 
 * 输入完工数量时 不能输入合格数量 并且当焦点离开时判断
 * 
 */
function disableCount() {
	var totalcount = $("#totalcount").val();
	document.getElementById("qualifiedcount").readonly = true;
	// document.getElementById("unqualifiedreason").disabled=true;
	// document.getElementById("unqualifiedcount").disabled=true;
	$("#qualifiedcount").val(totalcount);
}

/**
 * 
 * 输入合格数量、不合格数量、不合格原因时 不能输入完工数量
 * 
 */
function disabledqty() {
	document.getElementById("totalcount").readOnly = true;
}
/**
 * 
 * 条形码打印
 * 
 */
function generateBarcode() {
	$("#myModal").modal("show");
	var value = $("#endcode").val();
	var btype = "code128";
	var renderer = "css";
	var settings = {
		output : "css",
		bgColor : "#FFFFFF",
		color : "#000000",
		barHeight : "50",
		moduleSize : "5",
		posX : "10",
		posY : "20",
		addQuietZone : "1"
	};
	if (renderer == 'canvas') {
		clearCanvas();
		$("#barcodeTarget").hide();
		$("#canvasTarget").show().barcode(value, btype, settings);
	} else {
		$("#canvasTarget").hide();
		$("#barcodeTarget").html("").show().barcode(value, btype, settings);
	}
}
// 清除模态框
function clearCanvas() {
	var canvas = $('#canvasTarget').get(0);
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
}
// 打印机打印
function printBarcode() {

	retainAttr = true;
	$("#printarea").printArea();
}

var isDispatchingTrack;
function isDispatchingTracked() {

	var productionsearchno = $("#productionsearchno").val();
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionTrack",
		data : {
			method : "isDispatchingTracked",
			"productionsearchno" : productionsearchno,
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {

				if (data.status == "success") {
					isDispatchingTrack = true;
				} else {
					isDispatchingTrack = false;
				}

			}
		}
	});

}

// 显示编辑数据
function updateProductorTrack() {

	var data = oTable.rows('.row_selected').data();

	if (data.length == 0) {

		lwalert("tipModal", 1, "请选择产品追踪单！");
	} else if (data.length > 1) {

		lwalert("tipModal", 1, "只能选择一条产品追踪单修改！");
	} else {

		var trackid = data[0].trackid;

		var canEdit = trackCanEdit(trackid);

		if (canEdit != 0) {
			lwalert("tipModal", 1, "该产品追踪单已确认入库！");
			return;
		}

		$("#storeid").prop("disabled", false);
		$("#mapid").prop("disabled", false);
		$("#instocknumber").prop("readonly", false)
		document.getElementById("saveOrUpdateAId").disabled = false;

		// 当选择数据修改将opeMethod的值改为updateProductionTrack
		opeMethod = "updateProductorTrack";

	}
}

var trackCanEdit = function(id) {

	var result = "";

	$.ajax({
		type : "post",
		url : "../../../" + ln_project + "/productionTrack",
		data : {
			"method" : "trackCanEdit",
			"trackid" : id
		},
		dataType : "json",
		async : false,
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {
				result = text;
			}
		}
	});

	return result;
}

// 保存数据
var confirmTrack = function() {

	var ids = com.leanway.getCheckBoxData("2", "generalInfo", "checkList");

	if (ids.length > 0) {

		var confirmstatus = $('input[name="confirmstatus"]:checked').val();
		if (confirmstatus == "2") {
			lwalert("tipModal", 1, "选择的追踪单已确认入库！");
			return;
		}
		var msg = "确定对选中的" + ids.split(",").length + "条产品追踪进行入库?";

		lwalert("tipModal", 2, msg, "isSureConfirm()");
	} else {

		lwalert("tipModal", 1, "至少选择一条记录进行确认操作！");
	}

}

// 确认入库ajax
var isSureConfirm = function() {

	var ids = com.leanway.getCheckBoxData("2", "generalInfo", "checkList");

	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionTrack",
		data : {
			method : "confirmProductionTrack",
			"trackids" : ids
		},
		dataType : "text",
		async : false,
		success : function(text) {
			var flag = com.leanway.checkLogind(text);
			if (flag) {
				var tempData = $.parseJSON(text);
				if (tempData.status == "success") {
					lwalert("tipModal", 1, tempData.info);
					oTable.ajax.reload();
					// 传送入库单给U8

				} else {
					lwalert("tipModal", 1, tempData.info);
				}

			}
		}
	});
}

var transferTrack = function(type) {

	// $("#confirmFun").prop("disabled", true);
	// $("#confirmFun").html("传输中...请稍等");
	var method = "transferProductionTrack";
	var ids = com.leanway.getCheckBoxData(1, "generalInfo", "checkList");
	if (type == 1) {

		if (ids.length > 0) {

			var transferstatus = $('input[name="transferstatus"]:checked')
					.val();
			if (transferstatus == "1") {
				lwalert("tipModal", 1, "完工单已同步");
				return;
			}

		} else {

			lwalert("tipModal", 1, "至少选择一条完工单进行同步！");
			return;
		}

		$("#transferFun").prop("disabled", true);
		$("#transferFun").html("传输中...请稍等");

	} else if (type == 2) {
		method = "syncProductionTrack"

		$("#synctrack").prop("disabled", true);
		$("#synctrack").html("传输中...请稍等");
	}

	// lwalert("tipModal", 1, "正在传输数据。。");
	// return;
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/dataSync",
		data : {
			method : method,
			"orderids" : ids
		},
		dataType : "text",
		// async : false,
		success : function(text) {
			var flag = com.leanway.checkLogind(text);
			if (flag) {
				var tempData = $.parseJSON(text);
				if (tempData.status == "success") {
					lwalert("tipModal", 1, tempData.info);
					oTable.ajax.reload();
				} else if (tempData.status == "fail") {
					lwalert("tipModal", 1, tempData.info);
				} else if (tempData.status == "error") {
					lwalert("tipModal", 1, tempData.info);
				}

				if (type == 1) {
					$("#transferFun").prop("disabled", false);
					$("#transferFun").html("同步完工单");
				} else if (type == 2) {
					$("#synctrack").prop("disabled", false);
					$("#synctrack").html("同步完工单");
				}

			}
		},
		error : function(text) {
			if (type == 1) {
				$("#transferFun").prop("disabled", false);
				$("#transferFun").html("同步完工单");
			} else if (type == 2) {
				$("#synctrack").prop("disabled", false);
				$("#synctrack").html("同步完工单");
			}
		}
	});
}


// 
/**
 * 产品追踪删除
 * 思路：1.验证参数；2.封装参数；3.发起请求；4.解析结果；5.返回页面；
 */
$(".btn_del").click(function(){
	// 判断是否已入库
	function judgeResult(list){
		$(list).each(function(index, e){
			var i = 0;
			// 判断入库数量是否大于0
			if(e.instocknumber != null && e.instocknumber > 0){
				return false;
			}
			if(++i == list.length){
				return true;
			}
		});
	}
	
	// 1.验证参数
	// 1：当前页面的数据，2：跨页数据
	var type = "2";
	// 获取选中行
	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
	if(ids < 1){
		lwalert("tipModal", 1, "至少选择一行数据");
		return false;
	}
	// 获取行数据
	var objList = $("#generalInfo").DataTable().rows('.row_selected').data();
	console.log("列表信息："+objList);
	var flag = true;
	var endcode = "";
	$(objList).each(function(index, e){
		var i = 0;
		// 判断入库数量是否大于0
		if(e.instocknumber != null && e.instocknumber > 0){
			flag = false;
			endcode = e.endcode;
			return false;
		}
	});
	if(!flag){
		lwalert("tipModal", 1, "追踪单"+endcode+"包含已入库信息");
		return false;
	}
	// 2.封装参数
	// 追踪单号，数量，生产订单号；
	// 完工数量：totalcount；生产订单id：productionorderid；追踪id：trackid；产品编码：productorname；
	var arrayObj = new Array();
	$(objList).each(function(index, e){
		var obj = new Object;
		obj.totalcount = e.totalcount;
		obj.productionorderid = e.productionorderid;
		obj.trackid = e.trackid;
		obj.productorname = e.productorname;
		arrayObj.push(obj);
	});
	
	// 3.发起请求
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionTrack",
		data : {
			"method" : "deleteProductionTrack",
			"param" : JSON.stringify(arrayObj)
		},
		dataType : "json",
		success : function(data) {
			if(data.code == "1"){
				lwalert("tipModal", 1, "删除成功");
				// 刷新表格
				$('#generalInfo').DataTable().ajax.reload();  
			}else{
				lwalert("tipModal", 1, "删除失败");
				
			}
		}
	});
	
	// 4.解析结果
	
	
	// 5.返回页面
	
	
});
