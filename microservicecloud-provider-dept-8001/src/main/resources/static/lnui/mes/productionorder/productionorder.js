var productionOrderTable;
var newProductionOrderTable;
var salesOrderDataTable;
var productionProductorTable;
var productionModuleTable;
var productionProcedureTable;
var htmlStatus = 1;
var createCode;
// 1：新增工单，2：追加工单
var addPorderType = 1;

var clicktime = new Date();
var reg = /,$/gi;

var ope = "addProductionOrder";

var readOnlyObj = [ {
	"id" : "processrouteid",
	"type" : "select"
} ];

var condition = "";
var labelDataTable;

$(function() {

	com.leanway.formReadOnly("productionBusiness,productionLeadTime", readOnlyObj);

	// 初始化对象
	com.leanway.loadTags();

	// 表单验证
	initBootstrapValidator();

	// 解决时间控件与bootstrapvalidator的冲突
	$('#adjustendtime').on('changeDate show',function(e) {
				// Revalidate the date when user change it
		$('#productionOrderForm').bootstrapValidator('revalidateField','adjustendtime');
	});

	// 加载产品类型
	loadProtype();

	// 初始化Bom
	initTreeBom();

	// 获取LocalStorage给对应值进行初始化,并给condition进行赋值
	// getLocalStorageCondition();

	initSystemConfig();
	// 初始化生产订单
	productionOrderTable = initTable(condition);

	// 初始化工序
	productionProcedureTable = initProductionProcedureTable();
	
	// 初始化组件
	productionModuleTable = initProductionModuleTable();

	// checkBox全选事件
	// com.leanway.dataTableCheckAll("productionOrderTable", "checkAll",
	// "checkList");
	// com.leanway.dataTableCheckAll("newProductionOrderTable", "newCheckAll",
	// "newCheckList");
	// com.leanway.dataTableCheckAll("salesOrderDataTable", "salesCheckAll",
	// "salesCheckList");
	// com.leanway.dataTableCheckAll("productionModuleTable", "moduleCheckAll",
	// "moduleCheckList");
	com.leanway.dataTableCheckAll("productionProcedureTable","procedureCheckAll", "procedureCheckList");

	// DataTable是否多选及选中后触发的事件
	com.leanway.dataTableClickMoreSelect("productionOrderTable", "checkList",false, productionOrderTable, undefined, selectClick, undefined);
	com.leanway.dataTableClickMoreSelect("productionProcedureTable", "procedureCheckList",false, productionProcedureTable, undefined, queryPmTableData, undefined);
	com.leanway.dataTableClickMoreSelect("productionModuleTable", "moduleCheckList",false, productionModuleTable, undefined, undefined, undefined);
	// com.leanway.dataTableClickMoreSelect ("newProductionOrderTable",
	// "newCheckList", false, newProductionOrderTable, newReadOnly,
	// selectClick,undefined);
	// com.leanway.dataTableClick ("salesOrderDataTable", "salesCheckList",
	// true, salesOrderDataTable, undefined, undefined,undefined);

	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchProductionOrder);
	com.leanway.enterKeyDown("adjuststarttimeSearch", searchProductionOrder);
	com.leanway.enterKeyDown("adjustendtimeSearch", searchProductionOrder);
	com.leanway.enterKeyDown("productionchildsearchnoSearch",
			searchProductionOrder);

	// 初始化时间控件
	com.leanway.initTimePickYmdHmsForMoreId("#starttime,#endtime,#adjuststarttime,#adjustendtime,#practicalstarttime,#practicalendtime");

	$("input[name=virtual]").click(function() {
		searchProductionOrder();
	});

	$("input[name=productionOrderStatus]").click(function() {
		searchProductionOrder();
	});

	$("input[name=searchBom]").click(function() {
		// com.leanway.clearTableMapData("dispatchingOrderTable");
		searchProductionOrder();
	});

	$("input[name=issuemode]").click(function() {
		searchProductionOrder();
	});

	$("input[name=ordertype]").click(function() {
		searchProductionOrder();
	});

	com.leanway.initTimePickYmdForMoreId("#adjuststarttimeSearch,#adjustendtimeSearch,#adjustendtime");

	com.leanway.initSelect2("#productionchildsearchnoSearch", "../../../"+ ln_project + "/productionOrder?method=querySearchNo", "查询号(可多选)",true);
	com.leanway.initSelect2("#productorid", "../../../../" + ln_project+ "/productors?method=queryManuProductor", "搜索产品");
	com.leanway.initSelect2("#socode", "../../../../" + ln_project+ "/productionOrder?method=querySalesOrderCode", "搜索销售订单");

	$("#socode").on("select2:select",function(e) {

		// 根据产品ID查询对应的版本数据
		if ($(this).val() != ""
				&& typeof ($(this).val()) != "undefined"
				&& $(this).val() != undefined) {
			loadSodetail($(this).val());
		}
	});

	$("#productorid").on("select2:select",function(e) {
		// 根据产品ID查询对应的版本数据
		if ($(this).val() != ""
				&& typeof ($(this).val()) != "undefined"
				&& $(this).val() != undefined) {
			
			loadPsv($(this).val());
		}
	});
	
	$("#pmForm #productorid").on("select2:select",function(e) {
		// 根据产品ID查询对应的版本数据
		if ($(this).val() != "" && typeof ($(this).val()) != "undefined" && $(this).val() != undefined) {
			
			loadPmPsv($(this).val()[0]);
		}
	});

	$("#productorTypeId,#productionchildsearchnoSearch").on("select2:select",function(e) {
			searchProductionOrder();
	});

	$("#productorTypeId,#productionchildsearchnoSearch").on("select2:unselect",function(e) {
			searchProductionOrder();
	});

	$("#adjuststarttimeSearch,#adjustendtimeSearch").on("change", function(e) {
		searchProductionOrder();
	});
	
	$("#procedureid").on("select2:select",function(e) {
		querySpDetail($(this).val()[0]);
	});
	
	$("#procedureid").on("select2:unselect",function(e) {
		
		$("#ppForm #centerid").select2("val",[]);
		$("#ppForm #personcenterid").select2("val",[]);
		 
	});
	
	// 加载select2数据
	loadPPSelect2Data();
	loadPMSelect2Data();
	initSelect2Data();
	labelDataTable = initLabelDataTable();
});

/**
 * 生成生产订单 0：所有的BOM产品，1：当前产品
 */
var addProductionOrder = function(currentproduction) {

	// 追加的工单
	// if (addPorderType == 2 ) {
	// $("#productionsearchno").val($("#sosalesorderdetailid
	// option:selected").text());
	// }

	// 获取预售明细数据
	var form = $("#productionOrderForm").serializeArray();
	// 将数据转换成json数据
	var salesDetailFormData = formatFormBeJson(form);

	$("#productionOrderForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#productionOrderForm').data('bootstrapValidator').isValid()) { // 返回true、false

		// 追加的工单
		if (addPorderType == 1||addPorderType == 2) {
			
			ajaxAddProductionOrder(salesDetailFormData, currentproduction);

		} else {

			// 查询子查询号是否已近存在
			isExitSearchcode(salesDetailFormData, currentproduction);

		}

	}

}

var loadPsv = function(productorid) {

	var html = "";

	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productors",
		data : {
			method : "queryPsv",
			productorid : productorid
		},
		async : false,
		dataType : "json",
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {

				for (var i = 0; i < data.length; i++) {
					html += '<option value="' + data[i].versionid + '">'
							+ data[i].versionname + '</option>';
				}

				$("#productionOrderForm #versionid").html(html);
				// 重新校验bomid
				$('#productionOrderForm').data('bootstrapValidator')
						.updateStatus('versionid', 'NOT_VALIDATED', null)
						.validateField('versionid');
 
				loadStage(productorid, data[0].versionid);
			}
		}
	});

}

var loadStage = function (productorid, versionid) {
	if (versionid == undefined || undefined == "undefined"  || typeof(versionid) == "undefined") {
		versionid = $("#productionOrderForm #versionid").val();
	}
	var html = "";
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productors",
		data : {
			method : "queryStage",
			productorid : productorid,
			versionid : versionid
		},
		async : false,
		dataType : "json",
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {

				for (var i = 0; i < data.length; i++) {
					html += '<option value="' + data[i].stageid + '">'
							+ data[i].stagename + '</option>';
				}
 
				$("#stageid").html(html);
				
			}
		}
	});
	
}

var loadAppendOrderInfo = function(productionOrderId) {

	var html = "";

	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionOrder",
		data : {
			method : "queryAppendOrderInfo",
			productionOrderId : productionOrderId
		},
		async : false,
		dataType : "json",
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {

				var productoridHtml = '<option value=' + data.productorid + '>' + data.productorname + '</option>';
				$("#productionOrderForm #productorid").append(productoridHtml);
				$("#productionOrderForm #productorid").select2("val",data.productorid);
				$("#productionOrderForm #number").val(data.number);
				$("#productionOrderForm #adjustendtime").val(data.now);
				loadPsv(data.productorid);
				$("#productionOrderForm #versionid").val(data.versionid);
				$("#productionOrderForm #salesorderid").val(data.salesorderid);
				$("#productionOrderForm #salesorderdetailid").val(data.salesorderdetailid);
				$("#productionOrderForm #contractnumber").val(data.contractnumber);
				$("#productionOrderForm #companionid").val(data.companionid);
				 
				
			//	loadSodetail(data.id, data.salesorderdetailid);

			}
		}
	});

}

var showAddModal = function(type) {

	addPorderType = type;

	var ids = com.leanway.getDataTableCheckIds("checkList");

	// 追加生产订单
	if (type == 1) {

		var idLength = ids.split(",").length;

		if (ids.length == 0 || idLength != 1) {
			lwalert("tipModal", 1, "请选择一条生产订单进行追加！");
			// alert("请选择生产订单修改!");
			return;
		}

		$("#addPoModalLabel").html("追加生产订单");
		$("#appendOrderSo").show();
		$("#addSearchNo").hide();
		
	} else if (type == 0) {
		$("#addPoModalLabel").html("新增生产订单");
		$("#appendOrderSo").hide();
		$("#addSearchNo").show();
		
		
	} else if(type==2){
		var idLength = ids.split(",").length;

		if (ids.length == 0 || idLength != 1) {
			lwalert("tipModal", 1, "请选择一条生产订单进行追加！");
			// alert("请选择生产订单修改!");
			return;
		}
		
		$("#addPoModalLabel").html("追加订单");
		$("#appendOrderSo").hide();
		$("#addSearchNo").show();
	}

	$('#addModal').modal({
		backdrop : 'static',
		keyboard : true
	});

	$('#productionOrderForm').each(function(index) {
		$('#productionOrderForm')[index].reset();
	});
	// 清空Boots的提示
	$("#productionOrderForm").data('bootstrapValidator').resetForm();
	$("#productionOrderForm #busTeype").val(type);
	// $("#select2-code-container").html("");
	// $("#select2-productorid-container").html("");
	// $("#select2-socode-container").html("");
	$("#productionOrderForm #productorid").select2("val", []);
	//$("#socode").select2("val", []);
	$("#versionid").html("");
	$("#stageid").html("");
	//$("#productorid").val("");
	//$("#sosalesorderdetailid").html("");
	
	$("#productionOrderForm #busType").val(type);
	// 选中生产订单追加生产订单
	if (type == 1||type == 2) {

		// 类型
		$("#productionOrderForm #ordertype").val(type);

		// 把选中的工单ID赋值给oldProductionOrderId，进行关联保存
		$("#productionOrderForm #oldproductionorderid").val(ids);

		var selectObj = productionOrderTable.rows('.row_selected').data()[0];
		var productionsearchno = selectObj.productionchildsearchno;

		// 选中工单的查询号赋值
		$("#productionOrderForm #productionsearchno").val(productionsearchno);

		// 根据选中的工单把表单相关信息自动载入
		loadAppendOrderInfo(selectObj.productionorderid);

	} else {
		$("#productionOrderForm #salesorderid").val("");
		$("#productionOrderForm #salesorderdetailid").val("");
	}

}

var initCondition = function(day) {

	// var adjustStartTime = 获取当前时间； YYYY-MM-DD;
	// var adjustEndTime = 当前时间+3天； YYYY-MM-DD;
	var adjustStartTime = new Date();
	// 得到相应的开始时间的年，月，日
	var startYear = adjustStartTime.getFullYear();
	var startMon = adjustStartTime.getMonth() + 1;
	var startDay = adjustStartTime.getDate();
	// 然后将相应的时间转换成相应的yyyy-mm-dd的形式
	var adjustEndTime = adjustStartTime;

	adjustEndTime.setDate(adjustStartTime.getDate() + (day - 1));

	adjustStartTime = startYear + "-"
			+ (startMon < 10 ? "0" + startMon : startMon) + "-"
			+ (startDay < 10 ? "0" + startDay : startDay);
	var endMon = adjustEndTime.getMonth() + 1;
	// 然后将其转换成相应的string格式的数据
	adjustEndTime = adjustEndTime.getFullYear()
			+ "-"
			+ (endMon < 10 ? "0" + endMon : endMon)
			+ "-"
			+ (adjustEndTime.getDate() < 10 ? "0" + adjustEndTime.getDate()
					: adjustEndTime.getDate());

	var sqlJson = "{\"sqlDatas\": [";

	if ($.trim(adjustStartTime) != "") {
		sqlJson += "{\"fieldname\":\"po.adjuststarttime\",\"fieldtype\":\"datetime\",\"value\":\""
				+ adjustStartTime + "\",\"logic\":\"and\",\"ope\":\">=\"},";
	}

	if ($.trim(adjustEndTime) != "") {
		sqlJson += "{\"fieldname\":\"po.adjuststarttime\",\"fieldtype\":\"datetime\",\"value\":\""
				+ adjustEndTime + "\",\"logic\":\"and\",\"ope\":\"<=\"},";
	}

	sqlJson = sqlJson.replace(reg, "");

	sqlJson += "]}";

	// condition = "&status=0&modetype=0&&productionOrderStatus=1";
	/*
	 * condition = "&status=0&modetype=0&&productionOrderStatus=1&sqlDatas=" +
	 * encodeURIComponent(sqlJson);
	 */
	// 拼好条件后加上勾选的
	$("input[type=checkbox][name=productionOrderStatus][value= 1 ]").prop(
			"checked", true);
	$("input[type=checkbox][name=virtual][value= 0 ]").prop("checked", true);
	// 然后给文本框赋值
	$("#adjuststarttimeSearch").val(adjustStartTime);
	$("#adjustendtimeSearch").val(adjustEndTime);

	var searchCondition = getSearchConditions();
	var strCondition = encodeURIComponent($.trim(JSON
			.stringify(searchCondition)));
	condition = "&strCondition=" + strCondition;
}

/**
 * 初始化系统参数
 */
var initSystemConfig = function() {

	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/dispatchingOrder",
		data : {
			"method" : "querySystenConfigByName",
		},
		dataType : "json",
		async : false,
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {
				// 如果成功的话
				if (text.info == "success") {

					// 获取list集合
					var list = text.data;

					// 当list为null时
					if (list != undefined && typeof (list) != "undefinded"
							&& list != null && list.length > 0 && list != "") {

						var configvalue = list[0].configvalue;
						// 调用initCondtion方法
						initCondition(configvalue);
					}

				} else {

				}

			}

		}
	});

}

var initTreeBom = function() {

	$.fn.zTree.init($("#treeBom"), {
		check : { // 勾选框类型(checkbox 或 radio）默认 checkbox
			enable : true, // true 生效
			chkStyle : "checkbox", // checkbox 或 radio
			chkboxType : {
				"Y" : "a"
			}
		},
		async : {
			enable : true,
			url : "../../../" + ln_project + "/bom?method=queryBomTreeList",
			autoParam : [ "levels" ]
		},
		view : {
			dblClickExpand : false,
			fontCss : getFontCss,
			showLine : true,
		},
		data : {
			key : {
				id : "bomid",
				name : "productorname"
			},
			simpleData : {
				enable : true,
				idKey : "bomid",
				pIdKey : "pid",
				rootPId : ""
			}
		},
		callback : {
			// onRightClick : OnRightClick,
			onClick : onClick,
			onCheck : zTreeOnCheck
		}
	});

}

/**
 * checkBox选中事件
 */
var zTreeOnCheck = function(event, treeId, treeNode) {
	// alert(treeNode.tId + ", " + treeNode.name + "," + treeNode.checked);
	searchProductionOrder();
};

var getFontCss = function(treeId, treeNode) {
	return (!!treeNode.highlight) ? {
		color : "#A60000",
		"font-weight" : "bold"
	} : {
		color : "#333",
		"font-weight" : "normal"
	};
}

function onClick(e, treeId, treeNode) {

	if (treeNode.checked) {
		$.fn.zTree.getZTreeObj("treeBom").checkNode(treeNode, false, false);
	} else {
		$.fn.zTree.getZTreeObj("treeBom").checkNode(treeNode, true, true);
	}
	searchProductionOrder();

	// var isParent = "false";
	// checkSession();

	// if(zTree.getSelectedNodes()[0].pbomid==""||zTree.getSelectedNodes()[0].pbomid==null){
	// displaynone();
	// isParent = "true";
	// }else{
	// displayblock();
	// }

	// if(zTree.getSelectedNodes()[0].bomid){
	// loadBomObject(zTree.getSelectedNodes()[0].bomid, isParent);
	// }
	// com.leanway.formReadOnly("bomForm");
}
 
var queryPmTableData = function ( productionprocedureid ) {
	
	// 初始化组件DataTable
	productionModuleTable.ajax.url("../../../"+ ln_project+ "/productionOrder?method=queryProductionModule&productionprocedureid="+ productionprocedureid).load();
	
}
// 选中触发事件
var selectClick = function(id) {

	// 初始化组件DataTable
	productionModuleTable.ajax.url("../../../"+ ln_project+ "/productionOrder?method=queryProductionModule&productionOrderId="+ id).load();

	// 初始化工序DatTable
	productionProcedureTable.ajax.url("../../../"+ ln_project+ "/productionOrder?method=queryProductionProcedure&productionOrderId="+ id).load();

}

// 取消触发事件
var unSelectClick = function() {

	clearForm();

	// 初始化组件DataTable
	productionModuleTable.ajax
			.url(
					"../../../"
							+ ln_project
							+ "/productionOrder?method=queryProductionModule&productionOrderId=0")
			.load();

	// 初始化工序DataTable
	productionProcedureTable.ajax
			.url(
					"../../../"
							+ ln_project
							+ "/productionOrder?method=queryProductionProcedure&productionOrderId=0")
			.load();
}

// 修改情况下
var editProductionOrder = function( ) {
	
	var ids = com.leanway.getDataTableCheckIds("checkList");

	var idLength = ids.split(",").length;

	if (ids.length == 0 || idLength != 1) {
		lwalert("tipModal", 1, "请选择一条生产订单修改");
		// alert("请选择生产订单修改!");
		return;
	}
	
	var canEdit = productionCanEdit(ids);

	if (canEdit != 0) {
		lwalert("tipModal", 1, "已生成派工单，请删除派工单后修改！");
		return;
	} else {
		
		// 赋值
		loadProductionOrder(ids);
		com.leanway.show("poModal");
		
	}

}

/**
 * 派工单
 */
var productionCanEdit = function(id) {

	var result = "";

	$.ajax({
		type : "post",
		url : "../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "productionCanEdit",
			"id" : id
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

//加载生产订单详细数据
var loadProductionOrder = function(productionorderid, type) {
	
	com.leanway.clearForm("poForm");
	
	$.ajax({
		type : "post",
		url : "../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "queryProductionOrder",
			"productionorderid" : productionorderid
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {

				com.leanway.setFormValue("poForm", data.productionOder);
				
			}

		}
	});

}
  
// 保存数据
var savePo = function() {

	// 生产订单数据
	var poData =com.leanway.formatForm("#poForm");

	$.ajax({
		type : "post",
		url : "../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "saveProductionOrder",
			"paramData" : poData
		},
		dataType : "json",
		async : false,
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {
 
				if (text.status == "success") {
					$("#poModal").modal("hide");
					productionOrderTable.ajax.reload();
				} else {
					lwalert("tipModal", 1, text.info);
				}

			}

		}
	});

}

var chars = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C',
		'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
		'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];

function generateMixed(n) {
	var res = "";
	for (var i = 0; i < n; i++) {
		var id = Math.ceil(Math.random() * 35);
		res += chars[id];
	}
	return res;
}

var showOrderInfo = function() {

	var display = $('#orderInfo').css('display');

	if (display == 'none') {
		$("#orderInfo").show("500");
	} else {
		$("#orderInfo").hide("500");
	}
}

var readProductionOrderProgress = function() {

	$("#orderInfo").css("color", "#3c8dbc");

	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/dispatchingOrder",
		data : {
			"method" : "readDispatchingOrderProgress",
			"createCode" : createCode
		},
		dataType : "json",
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {

				if (data != null && data != "null") {
					if (data.status == 0 || data.status == 1) {

						$("#progressBarDiv").css("width", data.progressBar);
						$("#progressInfo").html(
								data.progressBar + "：" + data.productorname);

						var msg = "子查询号 : " + data.productionchildsearchno
								+ ", 正生成： " + data.productorname
								+ " 派工单，已执行(s)：" + data.excTime;

						$("#orderInfo").html(msg);

						setTimeout(function() {
							readProductionOrderProgress();

						}, 500);
					} else {

						if (data.status == -1) {
							$("#progressDiv").hide();
							$("#orderInfo").html(data.info);
							$("#orderInfo").css("color", "red");
							$("#orderInfo").show();
						} else if (data.status == 2) {
							$("#orderInfo").html("");
							$("#progressInfo").html("100%");
							$("#progressBarDiv").css("width", "100%");
							$("#progressDiv").hide();
							$("#orderInfo").hide();
							$("#createDispatchingOrder")
									.prop("disabled", false);
							$("#createDispatchingOrder").html("生成派工单");
						}
					}
				} else {
					setTimeout(function() {
						readProductionOrderProgress();

					}, 1000);
				}

			}

		},
		error : function() {

		}
	});

}

/**
 * type 1：根据ID生成派工单，2：根据查询条件生成派工单 busType 0：普通派工单，1：重复制造派工单 生成派工单
 * 
 */
var createDispatchingOrder = function(type, busType) {

	var searchCondition = new Object();

	var productionOrderIds = "";

	if (type == 1) {
		productionOrderIds = com.leanway.getDataTableCheckIds("checkList");

		if ($.trim(productionOrderIds) == "") {
			lwalert("tipModal", 1, "请选择生产订单生成派工单");
			// alert("请选择生产订单生成派工单!");
			return;
		}

		searchCondition.productionOrderIds = productionOrderIds;

	} else {
		searchCondition = getSearchConditions(2);
	}

	var myData = new Date();
	createCode = myData.getTime() + generateMixed(5);
	searchCondition.createCode = createCode;

	// condition.sqlDatas = sqlJson;

	var strCondition = $.trim(JSON.stringify(searchCondition));

	$("#createDispatchingOrder").prop("disabled", true);
	$("#createDispatchingOrder").html("生成中...请等待！");

	$("#progressInfo").html("0%");
	$("#progressBarDiv").css("width", "0%");
	$("#progressDiv").show();
	$("#orderInfo").hide();

	setTimeout(function() {
		readProductionOrderProgress();
	}, 2000);

	$.ajax({
		type : "post",
		url : "../../../" + ln_project + "/dispatchingOrder",
		data : {
			"method" : "addDispatchingOrder",
			"strCondition" : strCondition
		},
		dataType : "json",
		/* async : false, */
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {

				lwalert("tipModal", 1, text.info);
				// alert(text.info);

				$("#createDispatchingOrder").prop("disabled", false);
				$("#createDispatchingOrder").html("生成派工单");

				if (text.status == "success") {

					if (type == 2) {
						// $("#searchValue").val("");
					}

					productionOrderTable.ajax.reload();
				}

			}

		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			lwalert("tipModal", 1, errorThrown);
			$("#createDispatchingOrder").prop("disabled", true);
			$("#createDispatchingOrder").html("生产派工单");

		}

	});

}

// 查询生产订单
var searchProductionOrder = function() {

	var conditionObj = getSearchConditions();
	var strCondition = encodeURIComponent($.trim(JSON.stringify(conditionObj)));

	// 清除localStorage内所有数据
	// localStorage.clear();
	// 获取当前用户id
	// var parentUserId = parent.window.$("#userId").val();
	// var key = parentUserId + "productinorder" + "searchCondition";
	// 保存当前用户的所选项
	// setLocalVaule( key );

	productionOrderTable.ajax
			.url(
					"../../../"
							+ ln_project
							+ "/productionOrder?method=queryProductionOrderForPage&status=0&strCondition="
							+ strCondition).load();
}

// localStorage 是根据(key , value)存储
// 保存当前用户的所选项

/*******************************************************************************
 * key : 唯一key
 */
var setLocalVaule = function(key) {
	// 创建obj对象
	var obj = new Object();
	var levelsValue = "";
	// 循环获取各个节点
	var zTree = $.fn.zTree.getZTreeObj("treeBom");
	var nodes = zTree.getCheckedNodes(true);

	for (var i = 0; i < nodes.length; i++) {
		levelsValue += nodes[i].levels + ",";
	}
	// 获取id为productionchildsearchnoSearch的值并存放在obj里面{name : value}
	obj.productionchildsearchnoSearch = $("#productionchildsearchnoSearch")
			.val();
	obj.adjuststarttimeSearch = $("#adjuststarttimeSearch").val();
	obj.adjustendtimeSearch = $("#adjustendtimeSearch").val();
	obj.searchValue = $("#searchValue").val();
	obj.levels = levelsValue;
	// 循环获取id=virtual的checkbox里面的value的值
	obj.virtual = com.leanway.getDataTableCheckIds("virtual");

	obj.productionOrderStatus = com.leanway
			.getDataTableCheckIds("productionOrderStatus");

	obj.searchBom = com.leanway.getDataTableCheckIds("searchBom");
	// json 转 string
	var data = JSON.stringify(obj)
	// 保存到localStorage中去
	window.localStorage.setItem(key, data);
}

var getLocalStorageCondition = function() {

	// 判断当前浏览器是否可用localStorage。
	if (window.localStorage) {
		// 获取当前页面的user的值
		var parentUserId = parent.window.$("#userId").val();
		var key = parentUserId + "productinorder" + "searchCondition";
		// 获取localStorage里面key为parentUser的data 并判断其是否存在
		var data = window.localStorage.getItem(key);
		if (data != null && data != undefined && typeof (data) != "undefined") {
			// string 转 json
			data = JSON.parse(data);
			// 为对应id赋值
			$("#productionchildsearchnoSearch").val(
					data.productionchildsearchnoSearch);
			$("#adjuststarttimeSearch").val(data.adjuststarttimeSearch);
			$("#adjustendtimeSearch").val(data.adjustendtimeSearch);
			$("#searchValue").val(data.searchValue);

			$("input[type=radio][name=searchBom][value=" + data.searchBom + "]")
					.prop("checked", true);
			// 取出data里面virtual的值
			var values = data.virtual;
			// 去除","的分割
			var valueArray = values.split(",");
			if (valueArray != null && valueArray != "") {
				// 循环为id=virtual赋value的值
				for (i = 0; i < valueArray.length; i++) {
					$(
							"input[type=checkbox][name=virtual][value="
									+ valueArray[i] + "]")
							.prop("checked", true);
				}
			}

			// 取出data里面productionOrderStatus的值
			var values = data.productionOrderStatus;
			// 去除','的分割
			var valueArray = values.split(",");
			if (valueArray != null && valueArray != "") {
				// 循环为id=productionOrderStatus赋value的值
				for (i = 0; i < valueArray.length; i++) {
					$(
							"input[type=checkbox][name=productionOrderStatus][value="
									+ valueArray[i] + "]")
							.prop("checked", true);
				}
			}

			/*
			 * //循环获取各个节点 var zTree = $.fn.zTree.getZTreeObj("treeBom");
			 * zTree.expandAll(true); if(nodesArray != null && nodesArray !=
			 * ""){ //展开tree节点 for(i = 0; i < nodesArray.length; i++){ //
			 * zTree.expandNode(nodesArray[i], true); // nodesArray[i].open; } }
			 */

			// 子查询号
			var productionChildSearchNo = data.productionchildsearchnoSearch;

			// 开始时间
			var adjustStartTime = data.adjuststarttimeSearch;

			// 结束时间
			var adjustEndTime = data.adjustendtimeSearch;

			var searchVal = data.searchValue;
			var modetype = data.virtual;
			var productionOrderStatus = data.productionOrderStatus;
			var searchBom = data.searchBom;
			var levels = data.levels

			var sqlJson = "{\"sqlDatas\": [";

			if ($.trim(productionChildSearchNo) != "") {
				sqlJson += "{\"fieldname\":\"po.productionchildsearchno\",\"fieldtype\":\"varchar_select2\",\"value\":\""
						+ productionChildSearchNo
						+ "\",\"logic\":\"and\",\"ope\":\"in\"},";
			}

			if ($.trim(adjustStartTime) != "") {
				sqlJson += "{\"fieldname\":\"po.adjuststarttime\",\"fieldtype\":\"datetime\",\"value\":\""
						+ adjustStartTime
						+ "\",\"logic\":\"and\",\"ope\":\">=\"},";
			}

			if ($.trim(adjustEndTime) != "") {
				sqlJson += "{\"fieldname\":\"po.adjuststarttime\",\"fieldtype\":\"datetime\",\"value\":\""
						+ adjustEndTime
						+ "\",\"logic\":\"and\",\"ope\":\"<=\"},";
			}

			sqlJson = sqlJson.replace(reg, "");

			sqlJson += "]}";

			condition = "&status=0&searchValue=" + searchVal + "&modetype="
					+ modetype + "&productionOrderStatus="
					+ productionOrderStatus + "&sqlDatas="
					+ encodeURIComponent(sqlJson) + "&levels=" + levels
					+ "&searchBom=" + searchBom;

		}
	}

}

// 查询最新生产订单
var searchNewProductionOrder = function() {

	var searchVal = $("#newSearchValue").val();
	var orderStatus = $('input[name="newVirtual"]:checked').val();
	// newProductionOrderTable.ajax.url("../../productionOrder?method=queryProductionOrderForPage&status=2&searchValue="
	// + searchVal+"&orderStatus=" + orderStatus).load();
}

// 初始化数据表格
var initTable = function(condition) {

	var table = $('#productionOrderTable')
			.DataTable(
					{
						"ajax" : "../../../"
								+ ln_project
								+ "/productionOrder?method=queryProductionOrderForPage"
								+ condition,
						/* "iDisplayLength" : "10", */
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"scrollX" : true,
						"bSort" : true,
						"bProcessing" : true,
						"bServerSide" : true,
						fixedHeader : {
							header : true,
							footer : true
						},
						"columnDefs": [
						               { orderable: false,targets: [0]},
						               { orderable: false,targets: [3]},
						               { orderable: false,targets: [4]},
						               { orderable: false,targets: [5]}
						
				               ],
						"aoColumns" : [
								{
									"mDataProp" : "productionorderid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										// $(nTd).html("<div
										// id='stopPropagation" + iRow +
										// "'><input type='checkbox'
										// name='checkList' value='" + sData +
										// "'></div>");
										$(nTd)
												.html(
														"<div id='stopPropagation"
																+ iRow
																+ "'>"
																+ "<input class='regular-checkbox' type='checkbox' id='"
																+ sData
																+ "' name='checkList' value='"
																+ sData
																+ "'><label  for='"
																+ sData
																+ "'></label>");
										com.leanway.columnTdBindSelect(nTd);
									}
								},
								{
									"mDataProp" : "productionnumber"
								},
								{
									"mDataProp" : "productionchildsearchno"
								},
								{
									"mDataProp" : "productorname"
								},
								{
									"mDataProp" : "productordesc"
								},
								{
									"mDataProp" : "drawcode"
								},
								{
									"mDataProp" : "number"
								},
								{
									"mDataProp" : "surplusnumber"
								},
								{
									"mDataProp" : "uninstocknumber"
								},
								{
									"mDataProp" : "adjuststarttime"
								},
								{
									"mDataProp" : "adjustendtime"
								},
								{
									"mDataProp" : "barcode"
								},
								{
									"mDataProp" : "productionorderstatus",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd)
												.html(
														productionorderstatusToName(sData));
									}
								}],
						"fnCreatedRow" : function(nRow, aData, iDataIndex) {

						},
						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"buttons" : [ 'colvis' ],
						"sDom" : "Bfrtip",
						"fnDrawCallback" : function(data) {
							com.leanway
									.setDataTableColumnHide("productionOrderTable");
							$("#checkAll").prop("checked", false);
							
							var url = window.location.host;
							
							// 不是迦南的隐藏
							if (url != null && url != "" && url.indexOf("101.7") == -1) {
								table.column( 10 ).visible( false );	
							}  
							
						}

					}).on('xhr.dt', function(e, settings, json) {
				com.leanway.checkLogind(json);
				table.columns.adjust();
			});

	return table;
}

 

 

 
/**
 * 初始化组件
 */
var initProductionModuleTable = function() {

	var table = $('#productionModuleTable')
			.DataTable(
					{
						"ajax" : "../../../"
								+ ln_project
								+ "/productionOrder?method=queryProductionModule",
						/* "iDisplayLength" : "10", */
						'bPaginate' : false,
						"bRetrieve" : true,
						"bFilter" : false,
						"scrollX" : true,
						"bSort" : false,
						"bProcessing" : true,
						"bServerSide" : false,
						"aoColumns" : [
								{
									"mDataProp" : "productionmoduleid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										// $(nTd).html("<input type='checkbox'
										// name='moduleCheckList' value='" +
										// sData + "'>");
										$(nTd)
												.html(
														"<div id='stopPropagation"
																+ iRow
																+ "'>"
																+ "<input class='regular-checkbox' type='checkbox' id='"
																+ sData
																+ "' name='moduleCheckList' value='"
																+ sData
																+ "'><label  for='"
																+ sData
																+ "'></label>");
										com.leanway.columnTdBindSelect(nTd);
									}
								}, {
									"mDataProp" : "line"
								},
								{
									"mDataProp" : "modulename"
								},
								{
									"mDataProp" : "drawcode"
								},
								{
									"mDataProp" : "shortname"
								},
								{
									"mDataProp" : "linestatus",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd).html(lineStatusToName(sData));
									}
								}, {
									"mDataProp" : "number"
								} , {
									"mDataProp" : "unitsname"
								}, {
									"mDataProp" : "requestdate"
								}, {
									"mDataProp" : "scrappage"
								}, {
									"mDataProp" : "consumingnumber"
								}, {
									"mDataProp" : "surplusnumber"
								}],
						"fnCreatedRow" : function(nRow, aData, iDataIndex) {

						},
						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {

							// 编辑情况下，把DataTable变成可编辑
							// if (htmlStatus == 2) {
							// editProductionModuleTable();
							// }

						}
					}).on('xhr.dt', function(e, settings, json) {
				com.leanway.checkLogind(json);
			});

	return table;

}

/**
 * 初始化工序
 */
var initProductionProcedureTable = function() {

	var table = $('#productionProcedureTable')
			.DataTable(
					{
						"ajax" : "../../../"
								+ ln_project
								+ "/productionOrder?method=queryProductionProcedure",
						/* "iDisplayLength" : "10", */
						'bPaginate' : false,
						"bRetrieve" : true,
						"bFilter" : false,
						"scrollX" : true,
						"bSort" : false,
						"bProcessing" : true,
						"bServerSide" : false,
						"aoColumns" : [
								{
									"mDataProp" : "productionprocedureid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										// $(nTd).html("<input type='checkbox'
										// name='procedureCheckList' value='" +
										// sData + "'>");
										$(nTd)
												.html(
														"<div id='stopPropagation"
																+ iRow
																+ "'>"
																+ "<input class='regular-checkbox' type='checkbox' id='"
																+ sData
																+ "' name='procedureCheckList' value='"
																+ sData
																+ "'><label  for='"
																+ sData
																+ "'></label>");
										com.leanway.columnTdBindSelect(nTd);

									}
								},
								{
									"mDataProp" : "procedurename"
								},
								{
									"mDataProp" : "line"
								},
								{
									"mDataProp" : "linestatus",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd).html(lineStatusToName(sData));
									}
								},
								{
									"mDataProp" : "procedurestatus",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {

										var procedurestatus = "未生成";
										if (sData == 1) {
											procedurestatus = "已生成";
										}

										$(nTd).html(procedurestatus);
									}
								},
								{
									"mDataProp" : "centername"
								},
								{
									"mDataProp" : "personcentername"
								},
								{
									"mDataProp" : "timeunitname"
								},
								{
									"mDataProp" : "scheduleargs",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd).html(scheduleargsToName(sData));
									}
								}, {
									"mDataProp" : "batchnumber"
								}, {
									"mDataProp" : "batchshiftcount"
								}, {
									"mDataProp" : "basicnumber"
								}, {
									"mDataProp" : "handlingtime"
								}, {
									"mDataProp" : "runtime"
								}, {
									"mDataProp" : "changetime"
								},  {
									"mDataProp" : "piecerate"
								}, {
									"mDataProp" : "pieceunit"
								}, {
									"mDataProp" : "unitsname"
								} ],
						"fnCreatedRow" : function(nRow, aData, iDataIndex) {

						},
						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {

							// 编辑情况下，把DataTable变成可编辑
							// if (htmlStatus == 2) {
							// editProductionProcedureTable();
							// }

						}
					}).on('xhr.dt', function(e, settings, json) {
				com.leanway.checkLogind(json);
			});

	return table;

}
 

// 格式化form数据
var formatFormBeJson = function(formData) {

	var reg = /,$/gi;

	var data = "{";

	for (var i = 0; i < formData.length; i++) {

		data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";

	}

	data = data.replace(reg, "");

	data += "}";

	return data;
}

 

var hideEditButton = function() {
 
}

var showEditButton = function() {
 
}

var appendProcedure = function() {

	hideEditButton();

	$("html,body").animate({
		scrollTop : $("#moveprocedure").offset().top
	}, 500);

	$("#addProcedureButton").html('<i class="fa fa-plus"></i>&nbsp;添加工序');

	$("#addProcedureButton").show();
	$("#addProcedureModuleButton").show();
	$("#saveProcedureModuleButton").show();
	$("#deleteModuleButton").show();
	$("#deleteProcedureButton").show();
}

/**
 * 工序状态转换
 */
var productionorderstatusToName = function(status) {
	var result = "";

	switch (status) {
	case 1:
		result = "计划";
		break;
	case 2:
		result = "确认";
		break;
	case 3:
		result = "派工";
		break;
	case 4:
		result = "在制";
		break;
	case 5:
		result = "完工";
		break;
	case 6:
		result = "关闭";
		break;

	default:
		result = "计划";
		break;
	}

	return result;
}

/**
 * 行状态转换
 */
var lineStatusToName = function(status) {

	var result = "";

	switch (status) {
	case 1:
		result = "正常";
		break;
	case 2:
		result = "关闭";
		break;
	default:
		result = "正常";
		break;
	}

	return result;
}

/**
 * 排程参数
 */
var scheduleargsToName = function(status) {

	var result = "";

	if (status == 0) {
		result = "单件";
	} else if (status == 1) {
		result = "批量";
	} else if (status == 2) {
		result = "定时";
	}

	/*
	 * switch (status) { case 0: result = "单间"; break; case 1: result = "批量";
	 * break; case 2: result = "定时"; break; }
	 */

	return result;
}

/**
 * 转生产 1:选中数据转生产，2：查询号转生产，3：所有数据转生产
 */
var toProductionOrder = function(type) {

	// 选中的数据标识
	var ids = "";

	// 查询号
	var searchNo = "";

	if (type == 1) {

		ids = com.leanway.getDataTableCheckIds("newCheckList");

		if ($.trim(ids) == "" || ids.length == 0) {

			lwalert("tipModal", 1, "请勾待处理数据后转生产！");
			return;
		}

	} else if (type == 2) {

		searchNo = $("#newSearchValue").val();

		if ($.trim(searchNo) == "") {

			lwalert("tipModal", 1, "请输入查询号后转生产！");
			return;

		}

	}

	$.ajax({
		type : "post",
		url : "../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "toProductionOrder",
			"type" : type,
			"orderIds" : ids,
			"searchValue" : searchNo
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {

				lwalert("tipModal", 1, data.info);

				if (data.status == "success") {
					$("#newSearchValue").val("");
					productionOrderTable.ajax.reload();
					// newProductionOrderTable.ajax.reload();

				}

			}

		}
	});

}

/**
 * 
 * 条形码打印
 * 
 */
function generateBarcode() {

	var value = $("#barcode").val();

	// 获取选中的数据
	var data = productionOrderTable.rows('.row_selected').data();

	var value = "";
	var productionnumberPrint = "";

	if (data == undefined || typeof (data) == "undefined") {
		lwalert("tipModal", 1, "请选择数据!");
		return;
	} else if (data.length != 1) {
		lwalert("tipModal", 1, "请选择一条订单进行打印!");
		return;

	} else {
		value = data[0].barcode;
		productionnumberPrint = data[0].productionnumber;
	}

	// if (productionnumberPrint==""||value=="") {
	// lwalert("tipModal", 1, "请选择订单号！");
	// }else{
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
		$("#viewClient").hide();
		$("#canvasTarget").show().barcode(value, btype, settings);
		$("#viewClient").html("订单号:" + productionnumberPrint);
	} else {
		$("#canvasTarget").hide();
		$("#barcodeTarget").html("").show().barcode(value, btype, settings);
		$("#viewClient").html("订单号:" + productionnumberPrint);
	}

	$("#myModal").modal("show");
	// }
}
function clearCanvas() {
	var canvas = $('#canvasTarget').get(0);
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
}
function printBarcode() {
	retainAttr = true;
	$("#printdiv").printArea();
}

var checkThisBox = function(obj) {

	obj.stopPropagation();

}


/**
 * 删除生产订单
 */
function deleteProductionproductor() {
	// 判断数据是否为多个
	// 获取勾选的销售订单Id
	var data = productionOrderTable.rows('.row_selected').data();

	if (data.length == 0) {
		lwalert("tipModal", 1, "请勾选订单进行删除生产订单！");
		return;
	}
	var msg = "确定删除选中的" + data.length + "条生产订单?";

	lwalert("tipModal", 2, msg, "isSureDeleteProduction()");
}

function isSureDeleteProduction() {
	// 获取选中的ids,
	var productionOrderids = com.leanway.getDataTableCheckIds("checkList");
	$.ajax({
		type : "post",
		url : "../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "deleteProductionOrderByIds",
			"productionorderid" : productionOrderids
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {
				if (data.status == 'success') {
					searchProductionOrder();
				}

				lwalert("tipModal", 1, data.info);
			}

		}
	});
}

/**
 * 查询条件进行删除
 */
function deleteProductionproductorByCondition() {
	var msg = "确定要进行按条件删除吗？";
	lwalert("tipModal", 2, msg, "isSureDeleteProductionproductorByCondition()");
}
/**
 * 确定删除
 */
function isSureDeleteProductionproductorByCondition() {
	var searchConditionsObj = getSearchConditions();
	var strCondition = $.trim(JSON.stringify(searchConditionsObj));

	$.ajax({
		type : "post",
		url : "../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "deleteProductionOrderByCondition",
			"strCondition" : strCondition
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {
				if (data.status == 'success') {
					searchProductionOrder();
					lwalert("tipModal", 1, "删除成功");
				}

				lwalert("tipModal", 1, data.info);
			}

		}
	});

}
/**
 * 新增表单验证
 */
function initBootstrapValidator() {
	// 对应的表单id
	$('#productionOrderForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					productorid : {
						validators : {
							notEmpty : {},
						}
					},
					versionid : {
						validators : {
							notEmpty : {},
						}
					},
					number : {
						validators : {
							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},

					// productionsearchno: {
					// validators : {
					// notEmpty : {},
					// }
					// },

					adjustendtime : {
						validators : {
							notEmpty : {},
						}
					}

				}

			});
	$('#labelDataForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {

					netweight : {
						validators : {
							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					count : {
						validators : {
							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					operator : {
						validators : {
							notEmpty : {}							
						}
					},
					batch : {
						validators : {
							notEmpty : {}							
						}
					},
					producedate : {
						validators : {
							notEmpty : {}							
						}
					},
					retestdate : {
						validators : {
							notEmpty : {}							
						}
					},

				}
});
	$('#updateLabelDataForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {

					netweight : {
						validators : {
							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					operator : {
						validators : {
							notEmpty : {}							
						}
					},
					batch : {
						validators : {
							notEmpty : {}							
						}
					},
					producedate : {
						validators : {
							notEmpty : {}							
						}
					},
					retestdate : {
						validators : {
							notEmpty : {}							
						}
					},

				}
});
}
/**
 * 校验生产号是否存在
 */
function isExitSearchcode(salesDetailFormData, currentproduction) {
	// 获取页面的生产号的值
	var productionsearchno = $("#productionsearchno").val();
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "isExitSearchcode",
			"productionsearchno" : productionsearchno
		},
		dataType : "json",
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {

				if (text.status == "success") {
					ajaxAddProductionOrder(salesDetailFormData,
							currentproduction);
				} else {
					lwalert("tipModal", 1, text.info);
				}
			}

		}
	});
}

function ajaxAddProductionOrder(salesDetailFormData, currentproduction) {
	$("#addProductionOrder").prop("disabled", true);
	$("#addProductionOrder").html("保存中...请等待！");

	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "addCurrentPO",
			"conditions" : salesDetailFormData
		},
		dataType : "json",
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {

				lwalert("tipModal", 1, text.info);

				if (text.status == "success") {
					productionOrderTable.ajax.reload();
					$('#addModal').modal("hide");
				}

				$("#addProductionOrder").prop("disabled", false);
				$("#addProductionOrder").html("保存");

			}

		},
		error : function() {
			$("#addProductionOrder").prop("disabled", false);
			$("#addProductionOrder").html("保存");
			lwalert("tipModal", 1, "ajax error！");
		}
	});
}

// 加载所有的产品种类
var loadProtype = function() {
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productors",
		data : {
			"method" : "findAllProtype"
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {

				var json = data;

				var protype = json.productorTypes;
				var html = "";

				for (var i = 0; i < protype.length; i++) {
					/**
					 * option 的拼接 + "|" + protype[i].productortypename+
					 */
					html += "<option value=" + protype[i].productortypeid + ">"
							+ protype[i].productortypemask + "</option>";
				}

				$("#productorTypeId").html(html);

				$("#productorTypeId").select2({
					placeholder : "产品类型(可多选)",
					tags : false,
					language : "zh-CN",
					allowClear : true,
					maximumSelectionLength : 10
				// 最多能够选择的个数
				});

			}
		}
	});
}

/**
 * 获取查询条件
 * 
 * type 1：一般查询，2：生成派工单查询
 */
var getSearchConditions = function(type) {

	var sqlJsonArray = new Array()

	if (type == undefined || typeof (type) == "undefined") {
		type = 1;
	}

	var sqlJson = "";

	// 勾选的树形结构产品ID
	var levels = "";

	var zTree = $.fn.zTree.getZTreeObj("treeBom");

	if (zTree != null && zTree != "undefined" && typeof (zTree) != "undefined") {
		var nodes = zTree.getCheckedNodes(true);
		for (var i = 0; i < nodes.length; i++) {
			levels += nodes[i].levels + ",";
		}
	}

	// 0：全部，1：下级
	var searchBom = $('input[name="searchBom"]:checked').val();

	// 子查询号
	var productionChildSearchNo = $("#productionchildsearchnoSearch").val();
	if (productionChildSearchNo != null && productionChildSearchNo != ""
			&& typeof (productionChildSearchNo) != "undefined"
			&& productionChildSearchNo != undefined) {
		productionChildSearchNo = productionChildSearchNo.toString();
	}

	// 产品类型
	var productorTypeId = $("#productorTypeId").val();

	if (productorTypeId != null && productorTypeId != ""
			&& typeof (productorTypeId) != "undefined"
			&& productorTypeId != undefined) {
		productorTypeId = productorTypeId.toString();
	}

	// 开始时间
	var adjustStartTime = $("#adjuststarttimeSearch").val();

	// 结束时间
	var adjustEndTime = $("#adjustendtimeSearch").val();

	var searchVal = $("#searchValue").val();

	var modetype = com.leanway.getDataTableCheckIds("virtual");

	var productionOrderStatus = com.leanway
			.getDataTableCheckIds("productionOrderStatus");

	var issuemode = com.leanway.getDataTableCheckIds("issuemode");

	// 追加工单
	var ordertype = com.leanway.getDataTableCheckIds("ordertype");

	if ($.trim(productionChildSearchNo) != "") {
		/*
		 * sqlJson +=
		 * "{\"fieldname\":\"po.productionchildsearchno\",\"fieldtype\":\"varchar_select2\",\"value\":\"" +
		 * productionChildSearchNo + "\",\"logic\":\"and\",\"ope\":\"in\"},";
		 */
		var searchNoObj = new Object();
		searchNoObj.fieldname = "po.productionchildsearchno";
		searchNoObj.fieldtype = "varchar_select2";
		searchNoObj.value = productionChildSearchNo;
		searchNoObj.logic = "and";
		searchNoObj.ope = "in";

		sqlJsonArray.push(searchNoObj);
	}

	if ($.trim(productorTypeId) != "") {
		/*
		 * sqlJson +=
		 * "{\"fieldname\":\"productorTypeId\",\"fieldtype\":\"varchar_select2\",\"value\":\"" +
		 * productorTypeId + "\",\"logic\":\"and\",\"ope\":\"in\"},";
		 */

		var productorTypeIdObj = new Object();
		productorTypeIdObj.fieldname = "productorTypeId";
		productorTypeIdObj.fieldtype = "varchar_select2";
		productorTypeIdObj.value = productorTypeId;
		productorTypeIdObj.logic = "and";
		productorTypeIdObj.ope = "in";

		sqlJsonArray.push(productorTypeIdObj);
	}

	if ($.trim(adjustStartTime) != "") {
		/*
		 * sqlJson +=
		 * "{\"fieldname\":\"po.adjuststarttime\",\"fieldtype\":\"datetime\",\"value\":\"" +
		 * adjustStartTime + "\",\"logic\":\"and\",\"ope\":\">=\"},";
		 */

		var adjustStartTimeObj = new Object();
		adjustStartTimeObj.fieldname = "po.adjuststarttime";
		adjustStartTimeObj.fieldtype = "datetime";
		adjustStartTimeObj.value = adjustStartTime;
		adjustStartTimeObj.logic = "and";
		adjustStartTimeObj.ope = ">=";

		sqlJsonArray.push(adjustStartTimeObj);
	}

	if ($.trim(adjustEndTime) != "") {
		/*
		 * sqlJson +=
		 * "{\"fieldname\":\"po.adjustendtime\",\"fieldtype\":\"datetime\",\"value\":\"" +
		 * adjustEndTime + "\",\"logic\":\"and\",\"ope\":\"<=\"},";
		 */

		var adjustEndTimeObj = new Object();
		adjustEndTimeObj.fieldname = "po.adjuststarttime";
		adjustEndTimeObj.fieldtype = "datetime";
		adjustEndTimeObj.value = adjustEndTime;
		adjustEndTimeObj.logic = "and";
		adjustEndTimeObj.ope = "<=";

		sqlJsonArray.push(adjustEndTimeObj);
	}

	if ($.trim(ordertype) != "") {

		var ordertypeObj = new Object();
		ordertypeObj.fieldname = "po.ordertype";
		ordertypeObj.fieldtype = "int";
		ordertypeObj.value = ordertype;
		ordertypeObj.logic = "and";
		ordertypeObj.ope = "in";

		sqlJsonArray.push(ordertypeObj);
	}

	// sqlJson = sqlJson.replace(reg, "");

	// sqlJson += "]";

	// sqlJsonArray.push(sqlJson);

	// var myData = new Date();
	// createCode = myData.getTime() + generateMixed(5) ;

	var condition = new Object();
	// condition.productionOrderIds = productionOrderIds;
	condition.searchValue = $.trim(searchVal);

	if (type == 1) {
		condition.modetypeArrays = modetype;
		condition.productionOrderStatusArrays = productionOrderStatus;
	} else {
		condition.orderStatusArrays = modetype;
		condition.dispatchingStatusArrays = productionOrderStatus;
	}
	condition.isSueModeArray = issuemode;

	condition.searchBom = searchBom;
	condition.levels = levels;
	condition.sqlDatas = sqlJsonArray;

	/* condition.createCode = createCode; */

	// condition.sqlDatas = sqlJson;
	return condition;
}

var editProductionOrderBatch = function() {

	$("#batchstarttime").val("");

	$("#").html("请选择派工开始时间");
	$('#batchTimeModal').modal({
		backdrop : 'static',
		keyboard : false
	});
	initDateTimeYmdHms("batchstarttime");
}

var batchUpdateProductionOrder = function() {

	// 时间
	var batchStartTime = $("#batchstarttime").val();

	var searchConditions = getSearchConditions()
	var strConditions = $.trim(JSON.stringify(searchConditions))

	$("#batchUpdateTime").prop("disabled", true);
	$("#batchUpdateTime").html("修改中..请等待！");

	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "updateProductionOrderBatch",
			"strConditions" : strConditions,
			"batchStartTime" : batchStartTime
		},
		dataType : "json",
		async : true,
		success : function(text) {

			// alert(text.info);

			var flag = com.leanway.checkLogind(text);

			if (flag) {

				if (text.status == "success") {

					$('#batchTimeModal').modal("hide");
					// $("#saveFun").attr("disabled", true);
					productionOrderTable.ajax.reload(null, false);

				} else {
					lwalert("tipModal", 1, text.info);
				}

				$("#batchUpdateTime").prop("disabled", false);
				$("#batchUpdateTime").html("确定");
			}
		}
	});
}

/**
 * type 1：根据ID快速完工，2：根据查询条件快速完工
 * 
 */
var updateProductionOrderStatus = function(type, status) {

	var productionOrderIds = "";

	if (type == 1) {
		productionOrderIds = com.leanway.getDataTableCheckIds("checkList");

		if ($.trim(productionOrderIds) == "") {
			var info = "请选择生产订单快速完工!";

			if (status == 6) {
				info = "请选择生产订单关闭！";
			}
			lwalert("tipModal", 1, info);
			// alert("请选择生产订单生成派工单!");
			return;
		}

		var msg = "确定快速完工所选工单?"

		if (status == 6) {
			msg = "选择的生产订单确认关闭？";
		}

		lwalert("tipModal", 2, msg, "confirmUpdateProductionOrderStatus("
				+ type + "," + status + ")");

	} else {

		var msg = "确定按查询条件快速完工?"

		if (status == 6) {
			msg = "确定按照查询条件关闭生产订单？";
		}

		lwalert("tipModal", 2, msg, "confirmUpdateProductionOrderStatus("
				+ type + "," + status + ")");

	}

}

var confirmUpdateProductionOrderStatus = function(type, status) {

	var searchCondition = new Object();

	var productionOrderIds = "";

	if (type == 1) {

		productionOrderIds = com.leanway.getDataTableCheckIds("checkList");
		searchCondition.productionorderid = productionOrderIds;

	} else {

		searchCondition = getSearchConditions(1);

	}

	var strCondition = $.trim(JSON.stringify(searchCondition));

	$.ajax({
		type : "post",
		url : "../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "updateProductionOrderStatus",
			"strCondition" : strCondition,
			"productionorderstatus" : status
		},
		dataType : "json",
		async : false,
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {

				lwalert("tipModal", 1, text.info);

				if (text.status == "success") {

					productionOrderTable.ajax.reload();
				}

			}

		},

	});
}

var moveType = 1;

var showMoveModal = function(type) {

	if (type == 1) {
		productionOrderIds = com.leanway.getDataTableCheckIds("checkList");

		if ($.trim(productionOrderIds) == "") {
			lwalert("tipModal", 1, "请选择生产订单平移派工单");
			// alert("请选择生产订单生成派工单!");
			return;
		}
	}

	moveType = type;

	$("#movestarttime").val("");
	$("#movenumber").val("");
	$("input[type=checkbox][name=movetype][value= 0 ]").prop("checked", false);
	$("input[type=checkbox][name=movetype][value= 1 ]").prop("checked", false);
	initTimePickYmd("movestarttime");

	$('#moveDataModal').modal({
		backdrop : 'static',
		keyboard : true
	});
}

var moveDispatchingOrder = function() {

	var searchCondition = new Object();

	var productionOrderIds = "";

	if (moveType == 1) {
		productionOrderIds = com.leanway.getDataTableCheckIds("checkList");

		if ($.trim(productionOrderIds) == "") {
			lwalert("tipModal", 1, "请选择生产订单平移派工单");
			// alert("请选择生产订单生成派工单!");
			return;
		}

		searchCondition.productionOrderIds = productionOrderIds;

	} else {
		searchCondition = getSearchConditions(2);
	}

	var movetype = com.leanway.getDataTableCheckIds("movetype");

	if ($.trim(movetype) == "") {
		lwalert("tipModal", 1, "请选择移动类型！");
		return;
	}

	searchCondition.movenumber = $("#movenumber").val();
	searchCondition.movestarttime = $("#movestarttime").val();
	searchCondition.movetype = movetype;
	searchCondition.timeunits = $("#moveunits").val();
	var strCondition = $.trim(JSON.stringify(searchCondition));

	$.ajax({
		type : "post",
		url : "../../../" + ln_project + "/dispatchingOrder",
		data : {
			"method" : "moveProductionOrderDispatchingOrder",
			"strCondition" : strCondition
		},
		dataType : "json",
		async : false,
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {

				if (text.status == "success") {
					productionOrderTable.ajax.reload();
					$('#moveDataModal').modal("hide");
				}

				lwalert("tipModal", 1, text.info);

			}

		},

	});

}
 

var exportProductionOrder = function() {

	com.leanway.clearTableMapData("productionOrderTable");

	var searchConditions = getSearchConditions()
	var strConditions = encodeURIComponent($.trim(JSON
			.stringify(searchConditions)));

	window.location.href = "../../../../" + ln_project
			+ "/productionOrder?method=downloadExcel&strConditions="
			+ strConditions;

}

/**
 * 保存追加的
 */
var saveAppendData = function() {

	// 生产订单数据
	var arrayForm = $("#productionProcessroute").serializeArray();

	// 产品数据
	var productorProductorData = "[]";

	// 组件数据
	var productionModuleData = getDataTableData(productionModuleTable);

	// 工序数据
	var productionProcedureData = getDataTableData(productionProcedureTable);

	// 合并在一起的最终数据
	var formData = formatFormJson(arrayForm, productorProductorData,
			productionModuleData, productionProcedureData);

	$.ajax({
		type : "post",
		url : "../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "saveAppendProcedureModule",
			"paramData" : formData
		},
		dataType : "json",
		async : false,
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {

				lwalert("tipModal", 1, text.info);
				// alert(text.info);

				if (text.status == "success") {
					com.leanway.clearTableMapData("productionOrderTable");
					// com.leanway.clearTableMapData("newProductionOrderTable");

					productionModuleTable.ajax.reload();
					productionProcedureTable.ajax.reload();
					// newProductionOrderTable.ajax.reload();
					// unSelectClick();
					hideEditButton();

				}

			}

		}
	});
}

var addPProcedure = function ( ) {
	
	var ids = com.leanway.getDataTableCheckIds("checkList");
	var idLength = ids.split(",").length;

	if (ids.length == 0 || idLength != 1) {
		lwalert("tipModal", 1, "请选择一条生产订单新增工序");
		return;
	}
	
	com.leanway.clearForm("ppForm");
	$("#ppForm #procedureid").select2("val", "");
	$("#ppForm #centerid").select2("val", "");
	$("#ppForm #personcenterid").select2("val", "");
	$('#ppForm #salaryunitsid').prop('selectedIndex', 0);
	$('#ppForm #timeunit').prop('selectedIndex', 0);
	
	com.leanway.show("ppModal");
	
	$("#ppForm #productionorderid").val(com.leanway.getDataTableCheckIds("checkList"));
}

//加载工艺数据
var loadPPSelect2Data = function() {
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "queryPPData"
		},
		dataType : "json",
		async : true,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {
				
			
				var html = "";
				var listSpData = data.sp;
				var listCenter = data.center;
				var listPersonCenter = data.personcenter;
				var listUnits = data.listUnits;
				var salaryUnits = data.salaryUnits;
				var listPs = data.listPs;

				for (var i = 0; i < listSpData.length; i++) {
					html += "<option value=" + listSpData[i].procedureid + ">" + listSpData[i].procedurename + "</option>";
				}
				$("#ppForm #procedureid").html(html);
				$("#ppForm #procedureid").select2({placeholder : "标准工序",tags : false,language : "zh-CN",allowClear : true,maximumSelectionLength : 1});

				html = "";
				for (var i = 0; i < listCenter.length; i++) {
					html += "<option value=" + listCenter[i].centerid + ">" + listCenter[i].shorname + "</option>";
				}
				$("#ppForm #centerid").html(html);
				$("#ppForm #centerid").select2({placeholder : "工作中心",tags : false,language : "zh-CN",allowClear : true,maximumSelectionLength : 1});
				
				html = "";
				for (var i = 0; i < listPersonCenter.length; i++) {
					html += "<option value=" + listPersonCenter[i].centerid + ">" + listPersonCenter[i].shorname + "</option>";
				}
				$("#ppForm #personcenterid").html(html);
				$("#ppForm #personcenterid").select2({placeholder : "人工中心",tags : false,language : "zh-CN",allowClear : true,maximumSelectionLength : 1});
				
				html = "";
				for (var i = 0; i < listUnits.length; i++) {
					html += "<option value=" + listUnits[i].unitsid + ">" + listUnits[i].unitsname + "</option>";
				}
				$("#ppForm #timeunit").html(html);
				
				html = "";
				for (var i = 0; i < salaryUnits.length; i++) {
					html += "<option value=" + salaryUnits[i].unitsid + ">" + salaryUnits[i].unitsname + "</option>";
				}
				$("#ppForm #salaryunitsid").html(html);
				
				html = "";
				for (var i = 0; i < listPs.length; i++) {
					html += "<option value=" + listPs[i].productorid + ">" + listPs[i].productorname + "</option>";
				}
				$("#pmForm #productorid").html(html);
				$("#pmForm #productorid").select2({placeholder : "产品",tags : false,language : "zh-CN",allowClear : true,maximumSelectionLength : 1});
			}
		}
	});
}

var querySpDetail = function (id) {
	
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "querySpDetail",
			"procedureid" : id
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {
				$("#ppForm #scheduleargs").val("1");
				$("#ppForm #batchnumber").val("0");
				$("#ppForm #runtime").val(data.runtime);
				$("#ppForm #handlingtime").val(data.handingtime);
				$("#ppForm #settime").val(data.settingtime);
				$("#ppForm #waittime").val(data.waittingtime);
				$("#ppForm #changetime").val(data.preparetime);
				$("#ppForm #centerid").select2("val", data.centerid);
				$("#ppForm #personcenterid").select2("val", data.personcenterid);
				
			}
		},
		error : function() {
			lwalert("tipModal", 1, "ajax error！");
		}
	});
}



var savePp = function ( ) {
	
	var ppData = com.leanway.formatForm("#ppForm");

	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "savePp",
			"data" : ppData
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {
				
				if (data.status == "success") {
					$("#ppModal").modal("hide");
					productionProcedureTable.ajax.reload();
				} else {
					lwalert("tipModal", 1, text.info);
				}
				
			}
		},
		error : function() {
			lwalert("tipModal", 1, "ajax error！");
		}
	});
	
}

var editPProcedure = function ( ) {
	
	var ids = com.leanway.getDataTableCheckIds("checkList");
	var idLength = ids.split(",").length;

	if (ids.length == 0 || idLength != 1) {
		lwalert("tipModal", 1, "请选择一条生产订单修改工序");
		return;
	}
	
	var pids = com.leanway.getDataTableCheckIds("procedureCheckList");
	var pidLengths = pids.split(",").length;

	if (pids.length == 0 || pidLengths != 1) {
		lwalert("tipModal", 1, "请选择一条工序修改");
		return;
	}
	
	com.leanway.clearForm("ppForm");
	$("#ppForm #procedureid").select2("val", "");
	$("#ppForm #centerid").select2("val", "");
	$("#ppForm #personcenterid").select2("val", "");
	
	$("#ppForm #productionorderid").val(com.leanway.getDataTableCheckIds("checkList"));
	$("#ppForm #productionprocedureid").val(com.leanway.getDataTableCheckIds("procedureCheckList"));
	
	queryPp(pids);
	com.leanway.show("ppModal");
	
}

var queryPp = function ( productionprocedureid ) {
	
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "queryPp",
			"productionprocedureid" : productionprocedureid
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {
				 
				com.leanway.setFormValue("ppForm", data);
				$("#ppForm #scheduleargs").val("1");
				$("#ppForm #batchnumber").val("0");
				$("#ppForm #procedureid").select2("val", data.procedureid);
				$("#ppForm #centerid").select2("val", data.centerid);
				$("#ppForm #personcenterid").select2("val", data.personcenterid);
			}
		},
		error : function() {
			lwalert("tipModal", 1, "ajax error！");
		}
	});
	
}


//加载组件数据
var loadPMSelect2Data = function() {
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "queryPMData"
		},
		dataType : "json",
		async : true,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {
				
			
				var html = "";

				var listPs = data.listPs;
 
				for (var i = 0; i < listPs.length; i++) {
					html += "<option value=" + listPs[i].productorid + ">" + listPs[i].productorname + "</option>";
				}
				$("#pmForm #productorid").html(html);
				$("#pmForm #productorid").select2({placeholder : "产品",tags : false,language : "zh-CN",allowClear : true,maximumSelectionLength : 1});
			}
		}
	});
}

var addPModule = function ( ) {
	
	var ids = com.leanway.getDataTableCheckIds("checkList");
	var idLength = ids.split(",").length;

	if (ids.length == 0 || idLength != 1) {
		lwalert("tipModal", 1, "请选择一条生产订单增加组件！");
		return;
	}
	
	var pids = com.leanway.getDataTableCheckIds("procedureCheckList");
	var pidLengths = pids.split(",").length;

	if (pids.length == 0 || pidLengths != 1) {
		lwalert("tipModal", 1, "请选择一条工序增加组件！");
		return;
	}
	
	// 检查工序是否能满足新增条件
	var result = checkPP(pids);
	
	if (result.status == 1) {
		lwalert("tipModal", 1, result.text);
		return;
	}
	
	com.leanway.clearForm("pmForm");
	//$("#pmForm #productorid").select2("val", "");
	$("#pmForm #productionorderid").val(com.leanway.getDataTableCheckIds("checkList"));
	$("#pmForm #productionprocedureid").val(com.leanway.getDataTableCheckIds("procedureCheckList"));
	
	com.leanway.show("pmModal");
	
}

/**
 * 检查是否能够新增组件
 */
var checkPP = function ( pids ) {
	
	var ppResult;
	
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "checkAddPm",
			"productionprocedureid" : pids
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {
				ppResult = data;
			 
			}
		},
		error : function() {
			lwalert("tipModal", 1, "ajax error！");
		}
	});
	
	return ppResult;
}

var editPModule = function ( ) {
	
	var pids = com.leanway.getDataTableCheckIds("procedureCheckList");
	var pidLengths = pids.split(",").length;

	if (pids.length == 0 || pidLengths != 1) {
		lwalert("tipModal", 1, "请选择工序修改组件！");
		return;
	}
	
	var mids = com.leanway.getDataTableCheckIds("moduleCheckList");
	var midLengths = mids.split(",").length;

	if (mids.length == 0 || midLengths != 1) {
		lwalert("tipModal", 1, "请选择一条组件进行修改！");
		return;
	}
	
	com.leanway.clearForm("pmForm");
	
	$("#pmForm #productionorderid").val(com.leanway.getDataTableCheckIds("checkList"));
	$("#pmForm #productionprocedureid").val(pids);
	$("#pmForm #productionmoduleid").val(mids);
	
	queryPm(mids);
	com.leanway.show("pmModal");
}

var queryPm = function ( productionmoduleid ) {
	
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "queryPm",
			"productionmoduleid" : productionmoduleid
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {
				 
				$("#pmForm #number").val(data.number);
				$("#pmForm #productorid").select2("val", data.productorid);

			}
		},
		error : function() {
			lwalert("tipModal", 1, "ajax error！");
		}
	});
	
}

var savePm = function ( ) {
	
	var pmData = com.leanway.formatForm("#pmForm");

	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "savePm",
			"data" : pmData
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {
				
				if (data.status == "success") {
					$("#pmModal").modal("hide");
					productionModuleTable.ajax.reload();
				} else {
					lwalert("tipModal", 1, data.info);
				}
				
			}
		},
		error : function() {
			lwalert("tipModal", 1, "ajax error！");
		}
	});
	
}
var printLabel = function ( ) {
	
	var listLabel  = $("#listLabel").val("");
	
	var ids = com.leanway.getDataTableCheckIds("checkList");
	var idLength = ids.split(",").length;

	if (ids.length == 0 || idLength != 1) {
		lwalert("tipModal", 1, "请选择一条派工单进行装箱标签打印！");
		return;
	}
		
	loadAddProductorPackingData(ids);
}

var loadAddProductorPackingData = function ( ids ) {
	
	$.ajax({
		type : "post",
		url : "../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "queryFormLabelData",
			"productionorderid" : ids
		},
		dataType : "json",
		/* async : false, */
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {
				
				if(text.status=="success"){					
					setProductorPackingFormVal( text.labelData );
					setProductorBoxNumber(text.boxData);
					
					var productortypecode = text.labelData.productortypecode;
		
					$("#package").html("包装数量");
					
					// 弹出modal
					$('#labelDataDiv').modal({backdrop: 'static', keyboard: true});
				}else{
					
					lwalert("tipModal", 1, text.info);

				}
			
			}

		},
		error : function() {

			lwalert("tipModal", 1, "error异常，请重试或联系管理员！");

		}

	});
	
}

var setProductorBoxNumber = function ( arrayData ) {
	
	if (arrayData != undefined && typeof(arrayData) != "undefined" && arrayData.length > 0) {
		
		var defaultNumber = 0;
		var html = "";
		
		for (var i =0; i < arrayData.length; i ++ ) {
			
			var obj = arrayData[i];
			
			if (i == 0) {
				defaultNumber = obj.netweight;
			}
			
			html +="<option value="+ obj.packunits+">"+obj.unitsname +"</option>";
			
			$("#unitsname").val(obj.unitsname);
		}
		
		$("#casespecification").html(html);
		$("#netweight").val(defaultNumber);
		
	}
	
}

var setProductorPackingFormVal = function ( data ) {
	 
	  for (var item in data) {
		  if (item != "mapid") {
			  $("#labelDataDiv #" + item).val(data[item]);
		  } else {
			 
			  $("#labelDataDiv #mapid").select2("val", data[item]);
		  }
		 
	  }
	  
}

var initSelect2Data = function ( ) {

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/companyMap",
		data :{
			"method" : "queryAllMap"
		},
		dataType : "json",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
			 
				var listMap = data;
				
				var html="";

				for (var i = 0;i<listMap.length;i++) {
					/**
					 * option 的拼接 + "|" + protype[i].productortypename+
					 * */
					html +="<option value="+ listMap[i].mapid+">"+listMap[i].name +"</option>";
				}
				 
				$("#labelDataDiv #mapid").html(html);


			    $("#labelDataDiv #mapid").select2({
			    	placeholder : "存储地点",
			        tags: false,
			        language : "zh-CN",
			        allowClear: true,
			        maximumSelectionLength: 1
			    });

			}
		}
	});
	
}

var saveLabelData = function ( ) {
	
	var form  = $("#labelDataForm").serializeArray();
	//将数据转换成json数据
	var formData = formatFormJson(form);		
		var reportResult = com.leanway.getPort("saveProductorPacking");
		
		$("#labelDataForm").data('bootstrapValidator').validate(); // 提交前先验证
		if ($('#labelDataForm').data('bootstrapValidator').isValid()) { // 返回true、false
			$.ajax({
				type : "post",
				url : "../../../" + ln_project + "/productionOrder",
				data : {
					"method" : "addLabelData",
					"formData" : formData
				},
				dataType : "json",
				/* async : false, */
				success : function(text) {
		
					var flag = com.leanway.checkLogind(text);
		
					if (flag) {
						
						if (text.status == "success") {							
							$("#listLabel").val(text.listLabel);
							
							// 标签名称
							var printName = "成品装箱标签";					 
							var printFile="cpzxbq";
							if (reportResult.reportname != "" && reportResult.reportname != "null" && reportResult.reportname != null) {
								printName = reportResult.reportname;
							}
							if (reportResult.reportfile != "" && reportResult.reportfile != "null" && reportResult.reportfile != null) {
								printFile = reportResult.reportfile;
							}
							
							com.leanway.sendReportData(printName, printFile, text.listLabel);
							
							//隐藏填写数据模态框
							$('#labelDataDiv').modal('hide');
	
							lwalert("tipModal", 2, "是否已打印" ,"sureSaveLabel()");
															
						}  else {
							lwalert("tipModal", 1, text.info);
						}
						
					}
		
				},
				error : function() {
		
					lwalert("tipModal", 1, "error异常，请重试或联系管理员！");
		
				}
		
			});
			
		}
	
}

var sureSaveLabel = function ( ) {
	
    var listLabel  = $("#listLabel").val();
	
	$.ajax({
		type : "post",
		url : "../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "saveLabelData",
			"listLabel" : listLabel
		},
		dataType : "json",
		/* async : false, */
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {
				
				if (text.status == "success") {
					
					var listLabel  = $("#listLabel").val("");
					
					$('#tipModal').modal('hide');			
				}  else {
					
					var listLabel  = $("#listLabel").val("");
					lwalert("tipModal", 1, text.info);
				}
				
			}

		},
		error : function() {

			lwalert("tipModal", 1, "error异常，请重试或联系管理员！");

		}

	});

}

var printOldLabel = function ( ) {

	var listLabel  = $("#listLabel").val("");
	
	var ids = com.leanway.getDataTableCheckIds("checkList");
	var idLength = ids.split(",").length;
	
	if (ids.length == 0 || idLength != 1) {
		lwalert("tipModal", 1, "请选择一条派工单进行装箱标签重打！");
		return;
	}
	
	loadProductorPackingData();
}

/**
*  通过选中明细id查询明细信息
*/
var loadProductorPackingData = function () {


	var ids = com.leanway.getDataTableCheckIds("checkList");
	
	var reportResult = com.leanway.getReport("printOldLabel");	
	
	$.ajax ( {
		type : "post",
		url : "../../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "queryDispatchingOrderPrintedLabelList",
			"productionorderid" : ids
		},
		dataType : "json",
		async : false,
		success : function ( data ) {
	
			var flag =  com.leanway.checkLogind(data);
	
			if ( flag ) {
	
	
				if (data.status == "success") {
	
	
					var message = data.data;
					
					// 标签名称
					var printName = "成品装箱标签";
					var printFile="cpzxbq";
					if (reportResult.reportname != "" && reportResult.reportname != "null" && reportResult.reportname != null) {
						printName = reportResult.reportname;
					}
					if (reportResult.reportfile != "" && reportResult.reportfile != "null" && reportResult.reportfile != null) {
						printFile = reportResult.reportfile;
					}
					
					com.leanway.sendReportData(printName, printFile,message);
	
				    
					
				} else {
	
					lwalert("tipModal", 1, data.info);
	
				}
	
			}
		}
	});

}

var updateOldLabel = function ( ) {

	resetForm();
	
	var listLabel  = $("#listLabel").val("");
	
	var ids = com.leanway.getDataTableCheckIds("checkList");
	// 获取行数据：
	var detailObj = $("#productionOrderTable").DataTable().rows('.row_selected').data()[0];
	// 保存生产订单总数量到弹框
	$("#number2").val(detailObj.number);
	
	var idLength = ids.split(",").length;
	
	if (ids.length == 0 || idLength != 1) {
		lwalert("tipModal", 1, "请选择一条派工单进行装箱标签修改！");
		return;
	}
	
	var strCondition = productionOrderTable.rows('.row_selected').data()[0];
	strCondition.caseno1 = $("#caseno1").val();
	strCondition.caseno2 = $("#caseno2").val();
	strCondition.batch = $("#batch1").val();
	strCondition.pagetype = 1;
	
	labelDataTable.ajax.url("../../../" + ln_project + "/productionOrder?method=queryDispatchingOrderPrintedLabelList&productionorderid="+ids+"&strCondition=" + encodeURIComponent($.trim(JSON.stringify(strCondition)))).load();
	
	// 根据组件ID加载出列表
	$('#showLabelDataDiv').modal({backdrop: 'static', keyboard: true});
	
	// 弹框显示前，先把仓库信息查询出来
	$.ajax({
		url: "../../../../" + ln_project + "/companyMap",
		type: "post",
		data: {
			"method" : "queryAllMap"
		},
		dataType: "json",
		success: function(msg){
			console.log("仓库信息" + msg);
			// 首先清空原来的
			$("#select_map").empty();
			// 把仓库信息放入select
			var option = "<option value=''>--请选择--</option>";
			$.each(msg,function(key,val) {
				option += "<option value='"+ val.mapid +"'>";
				option += val.name;
				option += "</option>";
			});
			$("#select_map").append(option);
		}
	});
	
	// 获取交易类型
	$.ajax({
		url: "../../../../" + ln_project + "/codeMap",
		type: "post",
		data: {
			"method" : "queryCodeMapList",
			"t":"FinishedWarehouse",
			"c":"FinishedWarehouse"
		},
		dataType: "json",
		success: function(data){
			// 清空数据
			$("#tradetype").empty();
			// 把信息放入select
			var option = "<option value='46-01'>--请选择--</option>";
			$.each(data,function(index,e) {
				option += "<option value='"+ e.codevalue +"'>";
				option += e.note;
				option += "</option>";
			});
			$("#tradetype").append(option);
		}
	});
}

var searchLabelData = function ( ) {

	var ids = com.leanway.getDataTableCheckIds("checkList");
	// 选中的组件
	var strCondition = productionOrderTable.rows('.row_selected').data()[0];
	strCondition.caseno1 = $("#caseno1").val();
	strCondition.caseno2 = $("#caseno2").val();
	strCondition.batch = $("#batch1").val();
	strCondition.pagetype = 1;
	
	labelDataTable.ajax.url("../../../" + ln_project + "/productionOrder?method=queryDispatchingOrderPrintedLabelList&productionorderid="+ids+"&strCondition=" + encodeURIComponent($.trim(JSON.stringify(strCondition)))).load();

}

//初始化标准工序数据表格
var initLabelDataTable = function() {
	var table = $('#labelDataTable')
			.DataTable(
					{
						"ajax" : "../../../../"+ln_project+"/productionOrder?method=queryDispatchingOrderPrintedLabelList",
						//"iDisplayLength" : "10",
						"pageUrl" : "productionorder/productionorder.html",
//						"scrollY":"250px",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"bAutoWidth": true,  //宽度自适应
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",
						"columns" : [ {
							"data" : "labelid"
						}, {
							"data" : "productorname"
						}, {
							"data" : "productordesc"
						}, {
							"data" : "specification"
						}, {
							"data" : "netweight"
						}, {
							"data" : "batch"
						}, {
							"data" : "shortname"
						}, {
							"data" : "caseno"
						}, {
							"data" : "labelstatus"
						}],
						"aoColumns" : [
								{
									"mDataProp" : "labelid",
									 "fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
	                                        $(nTd).html(

													"<div id='stopPropagation"
															+ iRow
															+ "'>"
															+"<input class='regular-checkbox' type='checkbox' id='" + sData
	                                                        + "' name='labelDataCheckList' value='" + sData
	                                                        + "'><label for='" + sData
	                                                        + "'></label>");
                                            com.leanway.columnTdBindSelectNew(nTd,"labelDataTable","labelDataCheckList");
	                                    }
								}, {
									"mDataProp" : "productorname",
								}, {
									"mDataProp" : "productordesc"
								}, {
									"mDataProp" : "specification"
								}, {
									"mDataProp" : "netweight"
								}, {
									"mDataProp" : "batch"
								}, {
									"mDataProp" : "shortname"
								}, {
									"mDataProp" : "caseno"
								},{
									"mDataProp": "labelstatus",
									 "fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
											$(nTd).html(labelStatusToName(sData));
										}
								},{"mDataProp" : "conversionrate",
									"fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
                                        $(nTd).html(
												"<input type='number' min='0' class='form-control w-60 conversionrate1' value='1'></input>:" +
												"<input type='number' min='0' class='form-control w-60 conversionrate2'value='1'></input>");
                                        com.leanway.columnTdBindSelectNew(nTd,"labelDataTable","labelDataCheckList");
                                    }
								}
						],

						"oLanguage" : {
				        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
				         },
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {

//							 // 点击dataTable触发事件
                          com.leanway.dataTableClickMoreSelect("labelDataTable", "labelDataCheckList", false,
                        		  labelDataTable, undefined,undefined,undefined,"labelDataCheckAll");

                          com.leanway.dataTableCheckAllCheck('labelDataTable', 'labelDataCheckAll', 'labelDataCheckList');

						}

					}).on('xhr.dt', function (e, settings, json) {
						com.leanway.checkLogind(json);
					} );

	return table;
}
/**
 * 锁定状态
 */
var labelStatusToName = function ( status ) {
	//0:未入库；1：已生成入库单；2：确认入库
	var result = "";
	switch (status) {
	case 0:
		result = "未入库";
		break;
	case 1:
		result = "已生成入库单";
		break;
	case 2:
		result = "确认入库";
		break;
	default:
		result = "";
		break;
	}
	return result;
}

/**
 *  通过选中明细id查询明细信息
 */
var showEditLabelData = function (type) {

	updatetype = type;
	
	var labelid = com.leanway.getDataTableCheckIds("labelDataCheckList");
	

	var idLength = labelid.split(",").length;

	if ((labelid.length == 0|| idLength == 0)&&updatetype==1) {
		lwalert("tipModal", 1, "请至少选择一个标签数据进行修改！");
		return;
	}
	
	var ids = com.leanway.getDataTableCheckIds("checkList");
	// 选中的组件
	var strCondition = productionOrderTable.rows('.row_selected').data()[0];
	strCondition.caseno1 = $("#caseno1").val();
	strCondition.caseno2 = $("#caseno2").val();
	strCondition.batch = $("#batch1").val();
	strCondition.updatetype = updatetype;
	strCondition.productionorderid = ids;
	strCondition.labelid = labelid;

	$.ajax({
		type : "post",
		url : "../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "queryDispatchingOrderPrintedLabelList",
			"productionorderid" : ids,
			"strCondition" : $.trim(JSON.stringify(strCondition))
		},
		dataType : "json",
		/* async : false, */
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {
				
				if(text.status=="success"){					 
					
					resetForm();					
					setLabelDataFormVal( text.data[0] );
					setProductorBoxNumber(text.boxData);					
					// 弹出modal
					$('#updateLabelDataDiv').modal({backdrop: 'static', keyboard: true});
				}else{
					
					lwalert("tipModal", 1, text.info);

				}				
			}

		},
		error : function() {

			lwalert("tipModal", 1, "error异常，请重试或联系管理员！");

		}

	});
	

}

var setLabelDataFormVal = function ( data ) {
	 
	  for (var item in data) {
		  $("#updateLabelDataDiv #" + item).val(data[item]); 
	  }
	  
}


var updateLabelData = function ( ) {
		
	var form  = $("#updateLabelDataForm").serializeArray();
	//将数据转换成json数据
	var formData = formatFormJson(form);
		
	var ids = com.leanway.getDataTableCheckIds("checkList");
	var labelid = com.leanway.getDataTableCheckIds("labelDataCheckList");
	// 选中的组件
	var strCondition = productionOrderTable.rows('.row_selected').data()[0];
	strCondition.caseno1 = $("#caseno1").val();
	strCondition.caseno2 = $("#caseno2").val();
	strCondition.batch = $("#batch1").val();
	strCondition.updatetype = updatetype;
	strCondition.productionorderid = ids;
	strCondition.labelid = labelid;
	
		
	$("#updateLabelDataForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#updateLabelDataForm').data('bootstrapValidator').isValid()) { // 返回true、false
		$.ajax({
			type : "post",
			url : "../../../" + ln_project + "/productionOrder",
			data : {
				"method" : "updateLabelData",
				"formData" : formData,
				"strCondition" : $.trim(JSON.stringify(strCondition))
			},
			dataType : "json",
			/* async : false, */
			success : function(text) {
	
				var flag = com.leanway.checkLogind(text);
	
				if (flag) {
					
					if (text.status == "success") {
													
						
						//隐藏填写数据模态框
						$('#updateLabelDataDiv').modal('hide');
						
						labelDataTable.ajax.reload(null,false);
						
					}  else {
						
						lwalert("tipModal", 1, text.info);
					}
					
				}
	
			},
			error : function() {
	
				lwalert("tipModal", 1, "error异常，请重试或联系管理员！");
	
			}
	
		});
		
	}	 
}
//重置表单
function resetForm() {
	
	$('#labelDataForm').each(function(index) {
		$('#labelDataForm')[index].reset();
	});
	$("#labelDataForm").data('bootstrapValidator').resetForm();
	
	$('#updateLabelDataForm').each(function(index) {
		$('#updateLabelDataForm')[index].reset();
	});
	$("#updateLabelDataForm").data('bootstrapValidator').resetForm();
	
	$('#searchform').each(function(index) {
		$('#searchform')[index].reset();
	});
	
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

// 完工入库
$("#btn_wipCompletion").click(function(){
	// 判断换算率是否填写
	function getConversionrate(){
		var conversionrateList = $("table.table_label").find("input.conversionrate");
		var i = 0;
		$(conversionrateList).each(function(index,e){
			if(e.value == "" || e.value == null){
				return false;
			}
			i++;
		})
		if(i == conversionrateList.length){
			return true;
		}
	}
	//============================= 验证参数 ==================================//
	// 初始化参数:type 1:当前页面的数据，2：跨页数据
	var type = "1"; 
	// 获取选中数据
	var ids1 = com.leanway.getCheckBoxData(type, "productionOrderTable", "checkList");// 订单信息
	var ids2 = com.leanway.getCheckBoxData(type, "labelDataTable", "labelDataCheckList");// 标签信息
	
	if(ids1 == null || ids1 == ""){
		lwalert("tipModal", 1, "至少选中一条订单信息");
		return;
	}
	if(ids1.split(",").length > 1){
		lwalert("tipModal", 1, "只能选中一条订单信息数据");
		return;
	}
	if(ids2 == null || ids2 == ""){
		lwalert("tipModal", 1, "至少选中一条标签信息");
		return;
	}
	// 获取选中行信息
	var obj_order = $("#productionOrderTable").DataTable().rows('.row_selected').data()[0];// 选中的订单信息
	var obj_label_list = $("#labelDataTable").DataTable().rows('.row_selected').data();// 选中的标签
	if(obj_order == null || obj_order == ""){
		lwalert("tipModal", 1, "选中订单信息为空");
		return;
	}
	var mapid = $("#select_map").val();
	if(mapid == null || mapid == ""){
		lwalert("tipModal", 1, "请选择仓库信息");
		return;
	}
	var productorStatus = $("#select_productorStatus").val();
	if(productorStatus == null || productorStatus == ""){
		lwalert("tipModal", 1, "请选择产品状态");
		return;
	}
	// 换算率，交易类型
	// 判断换算率是否选中
	if(!getConversionrate()){
		lwalert("tipModal", 1, "请确认换算率填写完整");
		return false;
	}
	// 判断交易类型是否选中
	/*if($("#tradetype").val() == null || $("#tradetype").val() == ""){
		lwalert("tipModal", 1, "请选择交易类型信息");
		return;
	}*/
	
	//============================= 封装请求 ==================================//
	// 封装信息
	var list = new Array();
	$(obj_label_list).each(function(index,obj_label){
		var obj_param = new Object();
		obj_param.compid = obj_order.compid;
		obj_param.versionid =  obj_order.versionid;
		obj_param.productionnumber =  obj_order.productionnumber;
		obj_param.version =  obj_order.version;
		
		obj_param.mapid = mapid;
		obj_param.productorstatus =  productorStatus;
		obj_param.number = $("#number2").val();
		
		obj_param.caseno = parseInt(obj_label.caseno);
		obj_param.labelid = obj_label.labelid;
		if(obj_label.labelstatus == "2" || obj_label.labelstatus == 2){
			lwalert("tipModal", 1, "批号为" + obj_label.batch +"的产品已入库");
			return;
		}
		obj_param.labelstatus = parseInt(obj_label.labelstatus);
		obj_param.netweight = parseInt(obj_label.netweight);
		obj_param.orderid =  obj_label.orderid;
		obj_param.producedate =  obj_label.producedate;
		obj_param.productorid =  obj_label.productorid;
		obj_param.resource =  obj_label.resource;
		obj_param.totalcaseno =  parseInt(obj_label.totalcaseno);
		obj_param.casedisplay =  obj_label.casedisplay;
		obj_param.productordesc =  obj_label.productordesc;
		obj_param.productorkind =  obj_label.productorkind;
		obj_param.productorname =  obj_label.productorname;
		obj_param.totalcount =  parseInt(obj_label.netweight);// 总计.
		obj_param.batch = obj_label.batch;
		// 2018年10月19日20:41:34 添加字段：转换率，交易类型
		obj_param.tradetype = $("#tradetype").val();
		var con1 = $("#"+obj_label.labelid).parent("div").parent("td").parent().children("td:last").children("input.conversionrate1").val();
		var con2 = $("#"+obj_label.labelid).parent("div").parent("td").parent().children("td:last").children("input.conversionrate2").val();
		obj_param.conversionrate = con1+"/"+con2;
		
		list.push(obj_param);
	})  
	
	
	// 发请求
	$.ajax({
		type: "POST",
		url: "../../../../" + ln_project + "/productionTrack?method=confirmToStorageByTrack",
		data: {
			"paramData":JSON.stringify(list)
		},
		dataType: "json",
		success: function(data){
			if(data.status == "success"){
				// 刷新表格：
				$('#labelDataTable').DataTable().ajax.reload();
				lwalert("tipModal", 1, data.info);
			}else{
				if(data.info == "" || data.info == null){
					lwalert("tipModal", 1, "入库失败");
				}else{
					lwalert("tipModal", 1, data.info);
				}
			}
		}
	});
})

/*$("#btn_wipCompletion").click(function(){
	//============================= 验证参数 ==================================//
	// 初始化参数:type 1:当前页面的数据，2：跨页数据
	var type = "1"; 
	// 获取选中数据
	var ids1 = com.leanway.getCheckBoxData(type, "productionOrderTable", "checkList");// 订单信息
	var ids2 = com.leanway.getCheckBoxData(type, "labelDataTable", "labelDataCheckList");// 标签信息
	
	if(ids1 == null || ids1 == ""){
		lwalert("tipModal", 1, "至少选中一条订单信息");
		return;
	}
	if(ids1.split(",").length > 1){
		lwalert("tipModal", 1, "只能选中一条订单信息数据");
		return;
	}
	if(ids2 == null || ids2 == ""){
		lwalert("tipModal", 1, "至少选中一条标签信息");
		return;
	}
	if(ids2.split(",").length > 1){
		lwalert("tipModal", 1, "只能选中一条标签信息");
		return;
	}
	// 获取选中行信息
	var obj_order = $("#productionOrderTable").DataTable().rows('.row_selected').data()[0];// 选中的订单信息
	var obj_label = $("#labelDataTable").DataTable().rows('.row_selected').data()[0];// 选中的标签
	if(obj_label.labelstatus == "2" || obj_label.labelstatus == 2){
		lwalert("tipModal", 1, "该产品已入库");
		return;
	}
	if(obj_order == null || obj_order == ""){
		lwalert("tipModal", 1, "选中订单信息为空");
		return;
	}
	if(obj_label == null || obj_label == ""){
		lwalert("tipModal", 1, "选中标签信息为空");
		return;
	}
	var mapid = $("#select_map").val();
	if(mapid == null || mapid == ""){
		lwalert("tipModal", 1, "请选择仓库信息");
		return;
	}
	var productorStatus = $("#select_productorStatus").val();
	if(productorStatus == null || productorStatus == ""){
		lwalert("tipModal", 1, "请选择产品状态");
		return;
	}
	
	//============================= 封装请求 ==================================//
	// 封装信息
	var list = new Array();
	var obj_param = new Object();
	
	obj_param.caseno = parseInt(obj_label.caseno);
	obj_param.compid = obj_order.compid;
	obj_param.labelid = obj_label.labelid;
	obj_param.labelstatus = parseInt(obj_label.labelstatus);
	obj_param.mapid = mapid;
	obj_param.netweight = parseInt(obj_label.netweight);
	obj_param.orderid =  obj_label.orderid;
	obj_param.producedate =  obj_label.producedate;
	obj_param.productorid =  obj_label.productorid;
	obj_param.resource =  obj_label.resource;
	obj_param.totalcaseno =  parseInt(obj_label.totalcaseno);
	obj_param.versionid =  obj_order.versionid;
	obj_param.casedisplay =  obj_label.casedisplay;
	obj_param.productionnumber =  obj_order.productionnumber;
	obj_param.productordesc =  obj_label.productordesc;
	obj_param.productorkind =  obj_label.productorkind;
	obj_param.productorname =  obj_label.productorname;
	obj_param.productorstatus =  productorStatus;
	obj_param.totalcount =  parseInt(obj_label.netweight);// 总计
	if(productorStatus == "A" || productorStatus == "A1"){
		obj_param.qualifiedcount =  parseInt(obj_label.netweight);// 合格
		obj_param.unqualifiedcount = 0;// 不合格
	}else{
		obj_param.qualifiedcount =  0;// 合格
		obj_param.unqualifiedcount = parseInt(obj_label.netweight);// 不合格
	}
	obj_param.version =  obj_order.version;
	for (key in obj_param){
		console.log("key="+key+"  value="+obj_param[key])
	}
	
	list.push(obj_param);
	
	// 发请求
	$.ajax({
		type: "POST",
		url: "../../../../" + ln_project + "/productionTrack?method=confirmToStorageByTrack",
		data: {
			"paramData":JSON.stringify(list)
		},
		dataType: "json",
		success: function(data){
			if(data.status == "success"){
				// 刷新表格：
				$('#labelDataTable').DataTable().ajax.reload();
				lwalert("tipModal", 1, data.info);
			}else{
				if(data.info == "" || data.info == null){
					lwalert("tipModal", 1, "入库失败");
				}else{
					lwalert("tipModal", 1, data.info);
				}
			}
		}
	});
})*/

var appendBomTrack = function ( ) {
	
	var data = productionModuleTable.rows('.row_selected').data();

	if (data.length == 0) {
		lwalert("tipModal", 1, "请勾选组件生成备料计划！");
		return;
	}
	
	var mcids = com.leanway.getDataTableCheckIds("moduleCheckList");
	
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/dispatchingOrder",
		data : {
			"method" : "appendBomTrack",
			"productionmoduleid" : mcids
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {
				lwalert("tipModal", 1, data.info);
				if (data.status == "success") {
					productionModuleTable.ajax.reload();
				}
			}
		},
		error : function() {
			lwalert("tipModal", 1, "ajax error！");
		}
	});
	
}

var loadPmPsv = function(productorid) {

	var html = "";
	$("#pmForm #versionid").html("");
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productors",
		data : {
			"method" : "queryPsv",
			"productorid" : productorid
		},
		async : false,
		dataType : "json",
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {

				for (var i = 0; i < data.length; i++) {
					html += '<option value="' + data[i].versionid + '">' + data[i].versionname + '</option>';
				}

				$("#pmForm #versionid").html(html);
			}
		}
	});

}

//点击计划触发按钮
var planToTrigger = function () {
	
	//获取选中的生产订单ID
	var checkboxs = $("#productionOrderTable :checked");
	if ( checkboxs.length == 0  ) {
		   lwalert("tipModal", 1, "请选择生产订单进行触发操作!");
		   return;
	} else if ( checkboxs.length > 1 ){
		   lwalert("tipModal", 1, "请选择一条生产订单进行触发操作!");
		   return;
	}
	var scdids = checkboxs[0].value;
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "addSCcurrentPW",
			"scdids" : scdids
		},
		dataType : "json",
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {
				lwalert("tipModal", 1, text.info);
				if (text.status == "success") {
					
				}
			}
		},
		error : function() {
			lwalert("tipModal", 1, "ajax error！");
		}
	});
}
