var productionOrderTable;
var newProductionOrderTable;
var salesOrderDataTable;
var productionProductorTable;
var productionModuleTable;
var productionProcedureTable;
var htmlStatus = 1;
var createCode;

var clicktime = new Date();
var reg = /,$/gi;

var ope = "addProductionOrder";

var readOnlyObj = [ {
	"id" : "processrouteid",
	"type" : "select"
} ];

var condition = "";

$(function() {

	com.leanway.formReadOnly("productionBusiness,productionLeadTime",
			readOnlyObj);

	// 初始化对象
	com.leanway.loadTags();
	
	//表单验证
	initBootstrapValidator();

	//解决时间控件与bootstrapvalidator的冲突
	$('#producefinishdate').on('changeDate show', function(e) {
        // Revalidate the date when user change it
        $('#productionOrderForm').bootstrapValidator('revalidateField', 'producefinishdate');
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

	// 初始化生产订单(没有被修改过的数据)
	// newProductionOrderTable = initNewProductionOrderTable ();

	// 初始化销售订单table
	// salesOrderDataTable = initSalesOrderTable();

	// 初始化产品
	productionProductorTable = initProductionProductorTable();

	// 初始化组件
	productionModuleTable = initProductionModuleTable();

	// 初始化工序
	productionProcedureTable = initProductionProcedureTable();

	// checkBox全选事件
	// com.leanway.dataTableCheckAll("productionOrderTable", "checkAll",
	// "checkList");
	// com.leanway.dataTableCheckAll("newProductionOrderTable", "newCheckAll",
	// "newCheckList");
	// com.leanway.dataTableCheckAll("salesOrderDataTable", "salesCheckAll",
	// "salesCheckList");
	// com.leanway.dataTableCheckAll("productionModuleTable", "moduleCheckAll",
	// "moduleCheckList");
	com.leanway.dataTableCheckAll("productionProcedureTable",
			"procedureCheckAll", "procedureCheckList");

	// DataTable是否多选及选中后触发的事件
	com.leanway.dataTableClickMoreSelect("productionOrderTable", "checkList",
			false, productionOrderTable, readOnly, selectClick, undefined);
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
	com.leanway
			.initTimePickYmdHmsForMoreId("#starttime,#endtime,#adjuststarttime,#adjustendtime,#practicalstarttime,#practicalendtime");

	// 隐藏功能
	hideEditButton();

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

	com.leanway.initTimePickYmdForMoreId("#adjuststarttimeSearch,#adjustendtimeSearch,#producefinishdate");

	com.leanway.initSelect2("#productionchildsearchnoSearch","../../../"+ln_project+"/productionOrder?method=querySearchNo","查询号(可多选)", true);
	com.leanway.initSelect2("#productorid", "../../../../"+ln_project+"/productors?method=queryProductor", "搜索产品");

    $("#productorid").on("select2:select" , function( e ) {
    	// 根据产品ID查询对应的版本数据
    	if ($(this).val() != "" && typeof($(this).val()) !="undefined" && $(this).val() != undefined) {
    		loadBomCode($(this).val());
    	}
    });

    $("#productorTypeId,#productionchildsearchnoSearch").on("select2:select" , function( e ) {
    	searchProductionOrder();
    });
    
    $("#productorTypeId,#productionchildsearchnoSearch").on("select2:unselect" , function( e ) {
    	searchProductionOrder();
    });
    
    $("#adjuststarttimeSearch,#adjustendtimeSearch").on("change", function(e) {
    	searchProductionOrder();
    });
});

/**
 * 生成生产订单 0：所有的BOM产品，1：当前产品
 */
var addProductionOrder = function ( currentproduction) {

	// 获取预售明细数据
	var form  = $("#productionOrderForm").serializeArray();
	//将数据转换成json数据
	var salesDetailFormData = formatFormBeJson(form);

	$("#productionOrderForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#productionOrderForm').data('bootstrapValidator').isValid()) { // 返回true、false
		//查询子查询号是否已近存在
		isExitSearchcode(salesDetailFormData ,currentproduction);
	}

}

var loadBomCode = function ( productorid ) {

	var html = "";

	$.ajax({
		type: "post",
		url: "../../../../"+ln_project+"/salesOrderDetail",
		data: {
			method: "queryBomCode",
			productorid : productorid
		},
		async : false,
		dataType: "json",
		success: function(data) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {

				for (var i = 0; i < data.length; i++) {
					html += '<option value="' + data[i].bomid + '">' + data[i].bomcodename +'</option>';
				}

				$("#bomid").html(html);
				//重新校验bomid
				$('#productionOrderForm').data('bootstrapValidator').updateStatus('bomid', 'NOT_VALIDATED', null).validateField('bomid');
			}
		}
	});

}

var showAddModal = function ( ) {
	$('#addModal').modal({backdrop: 'static', keyboard: false});

	$('#productionOrderForm').each(function(index) {
		$('#productionOrderForm')[index].reset();
	});
	  //清空Boots的提示
	$("#productionOrderForm").data('bootstrapValidator').resetForm();
	//清空产品和版本里面的内容
	$("#bomid").html("");
	$("#select2-productorid-container").html("");
	$("#productorid").val("");
	$("#bomid").val("");
}

var initCondition = function( day ) {

	// var adjustStartTime = 获取当前时间； YYYY-MM-DD;
	// var adjustEndTime = 当前时间+3天； YYYY-MM-DD;
	var adjustStartTime = new Date();
	// 得到相应的开始时间的年，月，日
	var startYear = adjustStartTime.getFullYear();
	var startMon = adjustStartTime.getMonth() + 1;
	var startDay = adjustStartTime.getDate();
	// 然后将相应的时间转换成相应的yyyy-mm-dd的形式
	var adjustEndTime = adjustStartTime;

	adjustEndTime.setDate(adjustStartTime.getDate() + (day-1));

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
	/*condition = "&status=0&modetype=0&&productionOrderStatus=1&sqlDatas="
			+ encodeURIComponent(sqlJson);*/
	// 拼好条件后加上勾选的
	$("input[type=checkbox][name=productionOrderStatus][value= 1 ]").prop(
			"checked", true);
	$("input[type=checkbox][name=virtual][value= 0 ]").prop("checked", true);
	// 然后给文本框赋值
	$("#adjuststarttimeSearch").val(adjustStartTime);
	$("#adjustendtimeSearch").val(adjustEndTime);
	
	var searchCondition = getSearchConditions();
	var strCondition = encodeURIComponent($.trim(JSON.stringify(searchCondition)));
	condition = "&strCondition=" + strCondition;
}

/**
 * 初始化系统参数
 */
var initSystemConfig = function() {

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "querySystenConfigByName",
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){
				//如果成功的话
				if (text.info == "success") {

					//获取list集合
					var list = text.data;

					//当list为null时
					if( list!=undefined && typeof(list) != "undefinded" && list != null && list.length > 0 && list != ""){

							var configvalue = list[0].configvalue ;
							//调用initCondtion方法
							initCondition(configvalue);
					}

				}else {

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
			url : "../../../"+ln_project+"/bom?method=queryBomTreeList",
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
var zTreeOnCheck = function (event, treeId, treeNode) {
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

// 表单设置只读
var readOnly = function() {
	htmlStatus = 1;
	hideEditButton();
	com.leanway.formReadOnly("productionBusiness,productionLeadTime",
			readOnlyObj);

	// com.leanway.dataTableUnselectAll("newProductionOrderTable",
	// "newCheckList");
}

// 表单设置只读
var newReadOnly = function() {

	htmlStatus = 1;
	hideEditButton();
	com.leanway.formReadOnly("productionBusiness,productionLeadTime",
			readOnlyObj);

	com.leanway.dataTableUnselectAll("productionOrderTable", "checkList");
}

// 选中触发事件
var selectClick = function(id) {

	// 初始化产品DataTable
	productionProductorTable.ajax
			.url(
					"../../../"+ln_project+"/productionOrder?method=queryProductionProductor&productionOrderId="
							+ id).load();

	// 初始化组件DataTable
	productionModuleTable.ajax
			.url(
					"../../../"+ln_project+"/productionOrder?method=queryProductionModule&productionOrderId="
							+ id).load();

	// 初始化工序DatTable
	productionProcedureTable.ajax
			.url(
					"../../../"+ln_project+"/productionOrder?method=queryProductionProcedure&productionOrderId="
							+ id).load();

	// 初始化工艺路线数据
	initProcessrouteSelectData(id);

	// 加载页面文本数据
	loadProductionOrder(id);

}

// 取消触发事件
var unSelectClick = function() {

	clearForm();

	// 初始化产品DataTable
	productionProductorTable.ajax
			.url(
					"../../../"+ln_project+"/productionOrder?method=queryProductionProductor&productionOrderId=0")
			.load();

	// 初始化组件DataTable
	productionModuleTable.ajax
			.url(
					"../../../"+ln_project+"/productionOrder?method=queryProductionModule&productionOrderId=0")
			.load();

	// 初始化工序DataTable
	productionProcedureTable.ajax
			.url(
					"../../../"+ln_project+"/productionOrder?method=queryProductionProcedure&productionOrderId=0")
			.load();
}

// 初始化工艺路线数据()
var initProcessrouteSelectData = function(productionOrderId) {

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/productionOrder",
		data : {
			"method" : "queryProcessrouteData",
			"productionOrderId" : productionOrderId
		},
		dataType : "json",
		async : false,
		success : function(result) {

			var flag = com.leanway.checkLogind(result);

			if (flag) {

				initProcessrouteSelect(result);

			}
		}
	});

}

// 初始化工艺路线下拉框
var initProcessrouteSelect = function(data) {

	if (data != null && data != undefined && typeof (data) != "undefined") {

		var selectHtml = "";

		for (var i = 0; i < data.length; i++) {

			selectHtml += '<option value="' + data[i].routeid + '">'
					+ data[i].shortname + '</option>';

			if (i == 0) {
				$("#processrouteshortname").val(data[i].shortname);
				$("#processroutecode").val(data[i].processroutecodecode);
			}

		}

		$("#processrouteid").html(selectHtml);

	}

}

// 初始化工艺路线数据()
var initProcessroutetData = function() {

	var routeId = $("#processrouteid").val();

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/productionOrder",
		data : {
			"method" : "queryProcessrouteData",
			"routeId" : routeId
		},
		dataType : "json",
		async : false,
		success : function(result) {

			var flag = com.leanway.checkLogind(result);

			if (flag) {

				initProcessrouteText(result);

			}
		}
	});

	// 加载对应的工序
	var productionOrderId = productionOrderTable.rows('.row_selected').data()[0].productionorderid;

	productionProcedureTable.ajax
			.url(
					"../../../"+ln_project+"/productionOrder?method=queryProductionProcedure&productionOrderId="
							+ productionOrderId + "&routeId=" + routeId).load();

	editProductionProcedureTable();
}

// 初始化工艺路线下拉框改变事件
var initProcessrouteText = function(data) {
	$("#processroutename").val(data.code);
	$("#processrouteshortname").val(data.shortname);
	$("#processroutecode").val(data.processroutecodecode);

}

// 修改情况下
var showEditProductionOrder = function(type) {

	if (type == 1) {

		var ids = com.leanway.getDataTableCheckIds("checkList");

		var idLength = ids.split(",").length;

		if (ids.length == 0 || idLength != 1) {
			lwalert("tipModal", 1, "请选择一条生产订单修改");
			// alert("请选择生产订单修改!");
			return;
		}

		var canEdit = productionCanEdit(ids);

		if (canEdit != 0) {
			lwalert("tipModal", 1, "该生产订单已生成派工单，请删除派工单后修改！");
			return;
		}

		$("#saveFun").show();
	} else if (type == 2) {

		var ids = com.leanway.getDataTableCheckIds("newCheckList");

		var idLength = ids.split(",").length;

		if (ids.length == 0 || idLength != 1) {
			lwalert("tipModal", 1, "请选择一条生产订单修改");
			// alert("请选择生产订单修改!");
			return;
		}

		$("#addNewFun").show();


	}

	// 去除只读
	com.leanway.removeReadOnly("productionBusiness,productionLeadTime",
			readOnlyObj);
	$("#expectnumber").prop("readonly", true);

	// 修改
	htmlStatus = 2;

	// 把产品表格变成可编辑表格
	editProductionProductorTable();

	// 把组件表格变成可编辑
	//editProductionModuleTable();

	// 把工序表格变成可编辑
	//editProductionProcedureTable();

	showEditButton();

	$("html,body").animate({scrollTop:$("#box").offset().top},500);
}

/**
 * 派工单
 */
var productionCanEdit = function(id) {

	var result = "";

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/productionOrder",
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

/**
 * 初始化工序数据
 */
var initProcedureSelect = function() {

	var result = "";

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/productionOrder",
		data : {
			"method" : "initProcedureSelect"
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

/**
 * 加载工作中心组对应的工作中心
 */
var initWorkCenter = function(groupId) {

	var result = "";

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/productionOrder",
		data : {
			"method" : "queryWorkCenter",
			"groupId" : groupId
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

/**
 * 初始化工作中心组下拉框
 */
var initGroupSelect = function(data, index) {
	var strHtml = '';

	for (var i = 0; i < data.length; i++) {

		// if (i == 0) {
		// productionProcedureTable.rows().data()[index].groupid =
		// data[i].groupid;
		// }

		strHtml += '<option value="' + data[i].groupid + '">'
				+ data[i].groupname + '</option>';
	}
	return strHtml;

}

/**
 * 初始化工作中心下拉框
 */
var initWorkCenterSelect = function(data, index) {
	var strHtml = '';

	for (var i = 0; i < data.length; i++) {

		// if (i == 0) {
		// productionProcedureTable.rows().data()[index].centerid =
		// data[i].centerid;
		// }

		strHtml += '<option value="' + data[i].centerid + '">'
				+ data[i].centername + '</option>';
	}

	return strHtml;
}

/**
 * 初始化模具下拉框
 */
var initMouldSelect = function(data, index) {
	var strHtml = '';

	for (var i = 0; i < data.length; i++) {

		// if (i == 0) {
		// productionProcedureTable.rows().data()[index].mouldidid =
		// data[i].mouldid;
		// }

		strHtml += '<option value="' + data[i].mouldid + '">'
				+ data[i].mouldname + '</option>';
	}

	return strHtml;
}

/**
 * 初始化时间单位下拉框
 */
var initTimeUnitSelect = function(data, index) {
	var strHtml = '';

	for (var i = 0; i < data.length; i++) {

		// if (i == 0) {
		// productionProcedureTable.rows().data()[index].mouldidid =
		// data[i].mouldid;
		// }

		strHtml += '<option value="' + data[i].unitsid + '">'
				+ data[i].unitsname + '</option>';
	}

	return strHtml;
}

/**
 * 排程参数下拉框
 */
var initScheduleArgsSelect = function() {

	var strHtml = '';
	strHtml += '<option value="0">单件</option>';
	strHtml += '<option value="1">批量</option>';
	strHtml += '<option value="2">定时</option>';

	return strHtml;
}

/**
 * 工作中心组改变后、工作中心也要改变 type:1工作中心组，2：工作中心，3：模具
 */
var procedureChange = function(type, obj, index) {

	if (type == 1) {

		// 组ID赋值
		productionProcedureTable.rows().data()[index].groupid = obj.value;

		// 通过组ID加载对应的工作中心ID、并获取第一条数据赋值给DataTable工作中心值
		var data = initWorkCenter(obj.value);

		if (data.deviceWorkCenter.length == 0) {
			productionProcedureTable.rows().data()[index].centerid = "";
		}

		if (data.personWorkCenter.length == 0) {
			productionProcedureTable.rows().data()[index].personcenterid = "";
		}

		var strHtml = '';

		for (var i = 0; i < data.deviceWorkCenter.length; i++) {

			/**
			 * 第一条数据赋值给DataTable工作中心值
			 */
			if (i == 0) {

				productionProcedureTable.rows().data()[index].centerid = data.deviceWorkCenter[i].centerid;

			}

			strHtml += '<option value="' + data.deviceWorkCenter[i].centerid
					+ '">' + data.deviceWorkCenter[i].centername + '</option>';

		}

		$("#centerid" + index).html(strHtml);

		var personHtml = "";

		for (var i = 0; i < data.personWorkCenter.length; i++) {

			/**
			 * 第一条数据赋值给DataTable工作中心值
			 */
			if (i == 0) {

				productionProcedureTable.rows().data()[index].personcenterid = data.personWorkCenter[i].centerid;

			}

			personHtml += '<option value="' + data.personWorkCenter[i].centerid
					+ '">' + data.personWorkCenter[i].centername + '</option>';

		}

		$("#personcenterid" + index).html(personHtml);

	} else if (type == 2) {

		productionProcedureTable.rows().data()[index].centerid = obj.value;

	} else if (type == 3) {

		productionProcedureTable.rows().data()[index].mouldidid = obj.value;

	} else if (type == 4) {
		productionProcedureTable.rows().data()[index].timeunit = obj.value;

	} else if (type == 5) {
		productionProcedureTable.rows().data()[index].scheduleargs = obj.value;
	} else if (type == 6) {
		productionProcedureTable.rows().data()[index].personcenterid = obj.value;
	}

}

/**
 * 把工序表格变成可编辑
 */
var editProductionProcedureTable = function(flag) {

	if (productionProcedureTable.rows().data().length > 0) {

		var length = 0;

		var dataList = productionProcedureTable.rows().data();

		if (dataList != undefined && typeof (dataList) != "undefined"
				&& dataList.length > 0) {
			length = dataList.length - 1;
		}

		var data = initProcedureSelect();

		$("#productionProcedureTable tbody tr").each(
				function() {

					// 获取该行的下标
					var index = productionProcedureTable.row(this).index();

					if (flag != undefined && typeof (flag) != "undefined"
							&& flag) {

						if (index == length) {

							initEditProductionProcedureTableData(data, index,
									$(this), flag);

						}

					} else {

						initEditProductionProcedureTableData(data, index,
								$(this), flag);

					}
				});

		productionProcedureTable.columns.adjust();
	}
}

var initEditProductionProcedureTableData = function(data, index, obj, flag) {

	// 工作中心组
	var groupSelect = initGroupSelect(data.listGroup, index);

	// 设备工作中心
	var workCenterSelect = initWorkCenterSelect(data.listCenter, index);

	// 人工工作中心
	var personWorkCenterSelect = initWorkCenterSelect(
			data.listpersonWorkCenter, index);

	// 模具
	var mouldSelect = initMouldSelect(data.listMould, index);

	// 时间单位下拉框
	var unitsSelect = initTimeUnitSelect(data.listUnits, index);

	// 排程参数下拉框
	var scheduleArgsSelect = initScheduleArgsSelect();

	// 工序编号
	var procedurename = "<select id='procedurename"
			+ index
			+ "'  name='procedurename' class='form-control select2' style='width: 110px;'>";
	obj.find("td:eq(1)").html(procedurename);

	com.leanway
			.initSelect2(
					"#procedurename" + index,
					"../../../"+ln_project+"/standerProcedure?method=queryProcedureBySearch&flag=productionOrder",
					"搜索标准工序");

	$("#procedurename" + index)
			.append(
					'<option value='
							+ productionProcedureTable.rows().data()[index].procedurename
							+ '>'
							+ productionProcedureTable.rows().data()[index].procedurename
							+ '</option>');
	$("#procedurename" + index).select2("val",
			productionProcedureTable.rows().data()[index].procedurename);

	// select选中数据后 触发事件
	$("#procedurename" + index)
			.on(
					"select2:select",
					function(e) {

						// 赋值
						productionProcedureTable.rows().data()[index].procedureid = $(
								this).val();
						productionProcedureTable.rows().data()[index].procedurename = $(
								"#select2-procedurename" + index + "-container")
								.text();

						// var tempTr = $(this).parents("tr")[0];
						//
						// autoFillProductorInfo($(this).val(), index, tempTr);
					});

	// 行状态（下拉框）
	var lineStatus = '<select class="form-control" id="linestatus" style="width: 80px" onchange="lineStatusChange(2, this,'
			+ index
			+ ')" name="linestatus"> <option value="1">挂起</option><option value="2">关闭</option></select>';
	obj.find("td:eq(2)").html(lineStatus);
	obj.find("td:eq(2)").find("#linestatus").val(
			productionProcedureTable.rows().data()[index].linestatus);

	// 工作中心组
	obj
			.find("td:eq(3)")
			.html(
					'<select name="groupid" style="width: 80px"    id="groupid" onchange="procedureChange(1, this,'
							+ index
							+ ')"  class="form-control" >'
							+ groupSelect + '</select>');
	obj.find("td:eq(3)").find("#groupid").val(
			productionProcedureTable.rows().data()[index].groupid);

	// 编辑情况下，获取工作中心组ID,加载对应的工作中心数据
	if (flag == undefined || typeof (flag) != "undefined" || !flag) {
		var data = initWorkCenter(productionProcedureTable.rows().data()[index].groupid);
		workCenterSelect = initWorkCenterSelect(data.deviceWorkCenter, index);
		personWorkCenterSelect = initWorkCenterSelect(data.personWorkCenter,
				index);
	}

	// 工作中心
	obj.find("td:eq(4)").html(
			'<select name="centerid" style="width: 80px"    id="centerid'
					+ index + '"  onchange="procedureChange(2, this,' + index
					+ ')"  class="form-control" >' + workCenterSelect
					+ '</select>');
	obj.find("td:eq(4)").find("#centerid" + index).val(
			productionProcedureTable.rows().data()[index].centerid);

	// 人工工作中心
	obj.find("td:eq(5)").html(
			'<select name="personcenterid" style="width: 80px"    id="personcenterid'
					+ index + '"  onchange="procedureChange(6, this,' + index
					+ ')"  class="form-control" >' + personWorkCenterSelect
					+ '</select>');
	obj.find("td:eq(5)").find("#personcenterid" + index).val(
			productionProcedureTable.rows().data()[index].personcenterid);

	// 模具
	obj
			.find("td:eq(6)")
			.html(
					'<select name="mouldidid"    id="mouldidid" style="width: 80px"  onchange="procedureChange(3, this,'
							+ index
							+ ')"  class="form-control" >'
							+ mouldSelect + '</select>');
	obj.find("td:eq(6)").find("#mouldidid").val(
			productionProcedureTable.rows().data()[index].mouldidid);

	// 时间单位
	obj
			.find("td:eq(7)")
			.html(
					'<select name="timeunit"    id="timeunit" style="width: 80px"  onchange="procedureChange(4, this,'
							+ index
							+ ')"  class="form-control" >'
							+ unitsSelect + '</select>');
	obj.find("td:eq(7)").find("#timeunit").val(
			productionProcedureTable.rows().data()[index].timeunit);

	// 时间数值
	obj
			.find("td:eq(8)")
			.html(
					'<input type="text" class="form-control" style="width: 80px" onblur="setDataTableValue(this, '
							+ index
							+ ',\'productionProcedureTable\')" name="timing" id="timing" value="'
							+ productionProcedureTable.rows().data()[index].timing
							+ '">');

	// 排程参数
	obj
			.find("td:eq(9)")
			.html(
					'<select name="scheduleargs"    id="scheduleargs" style="width: 80px"  onchange="procedureChange(5, this,'
							+ index
							+ ')"  class="form-control" >'
							+ scheduleArgsSelect + '</select>');
	obj.find("td:eq(9)").find("#scheduleargs").val(
			productionProcedureTable.rows().data()[index].scheduleargs);

	// 批次数值
	obj
			.find("td:eq(10)")
			.html(
					'<input type="text" class="form-control" style="width: 80px" onblur="setDataTableValue(this, '
							+ index
							+ ',\'productionProcedureTable\')" name="batchnumber" id="batchnumber" value="'
							+ productionProcedureTable.rows().data()[index].batchnumber
							+ '">');

	// 批次转移数值
	obj
			.find("td:eq(11)")
			.html(
					'<input type="text" class="form-control" style="width: 80px" onblur="setDataTableValue(this, '
							+ index
							+ ',\'productionProcedureTable\')" name="batchshiftcount" id="batchshiftcount" value="'
							+ productionProcedureTable.rows().data()[index].batchshiftcount
							+ '">');

	// 加工数量
	obj
			.find("td:eq(12)")
			.html(
					'<input type="text" class="form-control" style="width: 80px" onblur="setDataTableValue(this, '
							+ index
							+ ',\'productionProcedureTable\')" name="basicnumber" id="basicnumber" value="'
							+ productionProcedureTable.rows().data()[index].basicnumber
							+ '">');

	// 计划数量
	obj
			.find("td:eq(13)")
			.html(
					'<input type="text" class="form-control" style="width: 80px" onblur="setDataTableValue(this, '
							+ index
							+ ',\'productionProcedureTable\')" name="handlingtime" id="handlingtime" value="'
							+ productionProcedureTable.rows().data()[index].handlingtime
							+ '">');

	// 运行时间
	obj
			.find("td:eq(14)")
			.html(
					'<input type="text" class="form-control" style="width: 80px" onblur="setDataTableValue(this, '
							+ index
							+ ',\'productionProcedureTable\')" name="runtime" id="runtime" value="'
							+ productionProcedureTable.rows().data()[index].runtime
							+ '">');

	// 换模时间
	obj
			.find("td:eq(15)")
			.html(
					'<input type="text" class="form-control" style="width: 80px" onblur="setDataTableValue(this, '
							+ index
							+ ',\'productionProcedureTable\')" name="changetime" id="changetime" value="'
							+ productionProcedureTable.rows().data()[index].changetime
							+ '">');

	// 计划开始时间
	var scheduledstarttime = productionProcedureTable.rows().data()[index].scheduledstarttime;
	if (scheduledstarttime == "null" || scheduledstarttime == null) {
		scheduledstarttime = "";
	}
	obj
			.find("td:eq(16)")
			.html(
					'<input type="text" class="form-control" style="width: 140px" onchange="setDataTableValue(this, '
							+ index
							+ ',\'productionProcedureTable\')" name="scheduledstarttime" id="scheduledstarttime'
							+ index + '" value="' + scheduledstarttime + '">');
	initDateTimeYmdHms("scheduledstarttime" + index);

	// 计划结束时间
	var scheduledendtime = productionProcedureTable.rows().data()[index].scheduledendtime;
	if (scheduledendtime == "null" || scheduledendtime == null) {
		scheduledendtime = "";
	}
	obj
			.find("td:eq(17)")
			.html(
					'<input type="text" class="form-control" style="width: 140px" onchange="setDataTableValue(this, '
							+ index
							+ ',\'productionProcedureTable\')" name="scheduledendtime" id="scheduledendtime'
							+ index + '" value="' + scheduledendtime + '">');
	initDateTimeYmdHms("scheduledendtime" + index);

	// 调整开始时间
	var adjuststarttime = productionProcedureTable.rows().data()[index].adjuststarttime;
	if (adjuststarttime == "null" || adjuststarttime == null) {
		adjuststarttime = "";
	}
	obj
			.find("td:eq(18)")
			.html(
					'<input type="text" class="form-control" style="width: 140px" onchange="setDataTableValue(this, '
							+ index
							+ ',\'productionProcedureTable\')" name="adjuststarttime" id="adjuststarttime'
							+ index + '" value="' + adjuststarttime + '">');
	initDateTimeYmdHms("adjuststarttime" + index);

	// 调整结束时间
	var adjustendtime = productionProcedureTable.rows().data()[index].adjustendtime;
	if (adjustendtime == "null" || adjustendtime == null) {
		adjustendtime = "";
	}
	obj
			.find("td:eq(19)")
			.html(
					'<input type="text" class="form-control" style="width: 140px" onchange="setDataTableValue(this, '
							+ index
							+ ',\'productionProcedureTable\')" name="adjustendtime" id="adjustendtime'
							+ index + '" value="' + adjustendtime + '">');
	initDateTimeYmdHms("adjustendtime" + index);

	/*// 实际开始时间
	var practicalstarttime = productionProcedureTable.rows().data()[index].practicalstarttime;
	if (practicalstarttime == "null" || practicalstarttime == null) {
		practicalstarttime = "";
	}
	obj
			.find("td:eq(20)")
			.html(
					'<input type="text" class="form-control" style="width: 140px" onchange="setDataTableValue(this, '
							+ index
							+ ',\'productionProcedureTable\')" name="practicalstarttime" id="practicalstarttime'
							+ index + '" value="' + practicalstarttime + '">');
	initDateTimeYmdHms("practicalstarttime" + index);

	// 实际结束时间
	var practicalendtime = productionProcedureTable.rows().data()[index].practicalendtime;
	if (practicalendtime == "null" || practicalendtime == null) {
		practicalendtime = "";
	}
	obj
			.find("td:eq(21)")
			.html(
					'<input type="text" class="form-control" style="width: 140px" onchange="setDataTableValue(this, '
							+ index
							+ ',\'productionProcedureTable\')" name="practicalendtime" id="practicalendtime'
							+ index + '" value="' + practicalendtime + '">');
	initDateTimeYmdHms("practicalendtime" + index);

	// 计划换模开始时间
	var scheduledchangestarttime = productionProcedureTable.rows().data()[index].scheduledchangestarttime;
	if (scheduledchangestarttime == "null" || scheduledchangestarttime == null) {
		scheduledchangestarttime = "";
	}
	obj
			.find("td:eq(22)")
			.html(
					'<input type="text" class="form-control" style="width: 140px" onchange="setDataTableValue(this, '
							+ index
							+ ',\'productionProcedureTable\')" name="scheduledchangestarttime" id="scheduledchangestarttime'
							+ index
							+ '" value="'
							+ scheduledchangestarttime
							+ '">');
	initDateTimeYmdHms("scheduledchangestarttime" + index);

	// 计划换模结束时间
	var scheduledchangeendtime = productionProcedureTable.rows().data()[index].scheduledchangeendtime;
	if (scheduledchangeendtime == "null" || scheduledchangeendtime == null) {
		scheduledchangeendtime = "";
	}
	obj
			.find("td:eq(23)")
			.html(
					'<input type="text" class="form-control" style="width: 140px" onchange="setDataTableValue(this, '
							+ index
							+ ',\'productionProcedureTable\')" name="scheduledchangeendtime" id="scheduledchangeendtime'
							+ index
							+ '" value="'
							+ scheduledchangeendtime
							+ '">');
	initDateTimeYmdHms("scheduledchangeendtime" + index);

	// 调整换模开始时间
	var adjustchangestarttime = productionProcedureTable.rows().data()[index].adjustchangestarttime;
	if (adjustchangestarttime == "null" || adjustchangestarttime == null) {
		adjustchangestarttime = "";
	}
	obj
			.find("td:eq(24)")
			.html(
					'<input type="text" class="form-control" style="width: 140px" onchange="setDataTableValue(this, '
							+ index
							+ ',\'productionProcedureTable\')" name="adjustchangestarttime" id="adjustchangestarttime'
							+ index
							+ '" value="'
							+ adjustchangestarttime
							+ '">');
	initDateTimeYmdHms("adjustchangestarttime" + index);

	// 调整换模结束时间
	var adjustchangeendtime = productionProcedureTable.rows().data()[index].adjustchangeendtime;
	if (adjustchangeendtime == "null" || adjustchangeendtime == null) {
		adjustchangeendtime = "";
	}
	obj
			.find("td:eq(25)")
			.html(
					'<input type="text" class="form-control" style="width: 140px" onchange="setDataTableValue(this, '
							+ index
							+ ',\'productionProcedureTable\')" name="adjustchangeendtime" id="adjustchangeendtime'
							+ index + '" value="' + adjustchangeendtime + '">');
	initDateTimeYmdHms("adjustchangeendtime" + index);

	// 实际换模开始时间
	var practicalchangestarttime = productionProcedureTable.rows().data()[index].practicalchangestarttime;
	if (practicalchangestarttime == "null" || practicalchangestarttime == null) {
		practicalchangestarttime = "";
	}
	obj
			.find("td:eq(26)")
			.html(
					'<input type="text" class="form-control" style="width: 140px" onchange="setDataTableValue(this, '
							+ index
							+ ',\'productionProcedureTable\')" name="practicalchangestarttime" id="practicalchangestarttime'
							+ index
							+ '" value="'
							+ practicalchangestarttime
							+ '">');
	initDateTimeYmdHms("practicalchangestarttime" + index);

	// 实际换模结束时间
	var practicalchangeendtime = productionProcedureTable.rows().data()[index].practicalchangeendtime;
	if (practicalchangeendtime == "null" || practicalchangeendtime == null) {
		practicalchangeendtime = "";
	}
	obj
			.find("td:eq(27)")
			.html(
					'<input type="text" class="form-control" style="width: 140px" onchange="setDataTableValue(this, '
							+ index
							+ ',\'productionProcedureTable\')" name="practicalchangeendtime" id="practicalchangeendtime'
							+ index
							+ '" value="'
							+ practicalchangeendtime
							+ '">');
	initDateTimeYmdHms("practicalchangeendtime" + index);*/

}

/**
 * 把组件表格变成可编辑
 */
var editProductionModuleTable = function() {

	if (productionModuleTable.rows().data().length > 0) {

		$("#productionModuleTable tbody tr")
				.each(
						function() {

							// 获取该行的下标
							var index = productionModuleTable.row(this).index();

							// 组件名称
							var modulename = "<select id='modulename"
									+ index
									+ "'  name='modulename' class='form-control select2' style='width: 110px;'>";
							$(this).find("td:eq(1)").html(modulename);
							com.leanway
									.initSelect2(
											"#modulename" + index,
											"../../../"+ln_project+"/productors?method=queryProductorBySearch",
											"搜索组件");

							$("#modulename" + index).append(
									'<option value='
											+ productionModuleTable.rows()
													.data()[index].modulename
											+ '>'
											+ productionModuleTable.rows()
													.data()[index].modulename
											+ '</option>');
							$("#modulename" + index)
									.select2(
											"val",
											productionModuleTable.rows().data()[index].modulename);

							// select选中数据后 触发事件
							$("#modulename" + index)
									.on(
											"select2:select",
											function(e) {

												// 赋值
												productionModuleTable.rows()
														.data()[index].productorid = $(
														this).val();
												productionModuleTable.rows()
														.data()[index].modulename = $(
														"#select2-modulename"
																+ index
																+ "-container")
														.text();

												var tempTr = $(this).parents(
														"tr")[0];
												//
												autoFillProductorInfo($(this)
														.val(), index, tempTr);
											});

							// 组件名称
							var shortname = productionModuleTable.rows().data()[index].shortname;

							if (shortname == "null" || shortname == null) {
								shortname = "";
							}
							$(this)
									.find("td:eq(2)")
									.html(
											'<input type="text" class="form-control" style="width: 110px" onblur="setDataTableValue(this, '
													+ index
													+ ',\'productionModuleTable\')" name="shortname" id="shortname" value="'
													+ shortname + '">');

							// 序列号
							var serialnumber = productionModuleTable.rows()
									.data()[index].serialnumber;

							if (serialnumber == "null" || serialnumber == null) {
								serialnumber = "";
							}
							$(this)
									.find("td:eq(3)")
									.html(
											'<input type="text" class="form-control" style="width: 80px" onblur="setDataTableValue(this, '
													+ index
													+ ',\'productionModuleTable\')" name="serialnumber" id="serialnumber" value="'
													+ serialnumber + '">');

							// 行状态（下拉框）
							var lineStatus = '<select class="form-control" id="linestatus" onchange="lineStatusChange(1, this, '
									+ index
									+ ')" name="linestatus"> <option value="1">挂起</option><option value="2">关闭</option></select>';

							$(this).find("td:eq(4)").html(lineStatus);
							$(this)
									.find("td:eq(4)")
									.find("#linestatus")
									.val(
											productionModuleTable.rows().data()[index].linestatus);

							// 赋初始化挂起
							// productionModuleTable.rows().data()[index].linestatus
							// = 1;

							// 库存单位
							$(this)
									.find("td:eq(5)")
									.html(
											'<input type="text" class="form-control" style="width: 80px" onblur="setDataTableValue(this, '
													+ index
													+ ',\'productionModuleTable\')" name="unitsname" id="unitsname" value="'
													+ productionModuleTable
															.rows().data()[index].unitsname
													+ '">');

							// 需求日期
							var requestdate = productionModuleTable.rows()
									.data()[index].requestdate;
							if (requestdate == "null" || requestdate == null) {
								requestdate = "";
							}
							$(this)
									.find("td:eq(6)")
									.html(
											'<input type="text" class="form-control" style="width: 115px" onblur="setDataTableValue(this, '
													+ index
													+ ',\'productionModuleTable\')" name="requestdate" id="requestdate'
													+ index
													+ '" value="'
													+ requestdate + '">');
							initDateTimeYmdHms("requestdate" + index);

							// 工序
							/*
							 * var moduleidprocedure =
							 * productionModuleTable.rows().data()[index].moduleidprocedure;
							 * if (moduleidprocedure == "null" ||
							 * moduleidprocedure == null) { moduleidprocedure =
							 * ""; } $(this).find("td:eq(6)").html('<input
							 * type="text" class="form-control" style="width:
							 * 80px" onblur="setDataTableValue(this, ' + index +
							 * ',\'productionModuleTable\')"
							 * name="moduleidprocedure" id="moduleidprocedure"
							 * value="' + moduleidprocedure + '">');
							 */
							// 报废率
							$(this)
									.find("td:eq(8)")
									.html(
											'<input type="text" class="form-control" style="width: 80px" onblur="setDataTableValue(this, '
													+ index
													+ ',\'productionModuleTable\')" name="scrappage" id="scrappage" value="'
													+ productionModuleTable
															.rows().data()[index].scrappage
													+ '">');

							// // 已消耗
							// $(this).find("td:eq(9)").html('<input type="text"
							// class="form-control" style="width: 80px"
							// onblur="setDataTableValue(this, ' + index +
							// ',\'productionModuleTable\')"
							// name="consumingnumber" id="consumingnumber"
							// value="' +
							// productionModuleTable.rows().data()[index].consumingnumber
							// + '">');
							//
							// // 未领用
							// $(this).find("td:eq(10)").html('<input
							// type="text" class="form-control" style="width:
							// 80px" onblur="setDataTableValue(this, ' + index +
							// ',\'productionModuleTable\')"
							// name="surplusnumber" id="surplusnumber" value="'
							// +
							// productionModuleTable.rows().data()[index].surplusnumber
							// + '">');
							//
							// // 需求数量
							// $(this).find("td:eq(11)").html('<input
							// type="text" class="form-control" style="width:
							// 80px" onblur="setDataTableValue(this, ' + index +
							// ',\'productionModuleTable\')" name="number"
							// id="number" value="' +
							// productionModuleTable.rows().data()[index].number
							// + '">');

						});

		productionModuleTable.columns.adjust();
	}
}

var lineStatusChange = function(type, obj, index) {

	if (type == 1) {
		productionModuleTable.rows().data()[index].linestatus = obj.value;
	} else {
		productionProcedureTable.rows().data()[index].linestatus = obj.value;
	}
}

// 根据产品ID查询出对应的计量单位填充到DataTable
var autoFillProductorInfo = function(productorId, index, tempTr) {

	$
			.ajax({
				type : "post",
				url : "../../../"+ln_project+"/productors",
				data : {
					method : "findAllProductorsObject",
					productorid : productorId
				},
				dataType : "json",
				success : function(data) {

					var flag = com.leanway.checkLogind(data);

					if (flag) {

						var tempData = data.productorsConditions;
						var unitsid = tempData.unitsname;
						tempTr.cells[4].children[0].value = tempData.unitsname;

						// DataTable赋值
						productionModuleTable.rows().data()[index].unitsname = tempData.unitsname;
						productionModuleTable.rows().data()[index].unitsid = tempData.unitsid;

					}
				}
			});
}

var addModule = function() {

	var orderId = $("#productionorderid").val();

	productionModuleTable.row.add({
		"productionmoduleid" : "",
		"modulename" : "",
		"serialnumber" : "",
		"linestatus" : "",
		"unitsname" : "",
		"requestdate" : "",
		"moduleidprocedure" : "",
		"procedurename" : "",
		"scrappage" : "",
		"consumingnumber" : "",
		"surplusnumber" : "",
		"number" : "",
		"productionorderid" : orderId
	}).draw(false);

	// 把新添加的行置成编辑模式
	// var index = productionModuleTable.rows().data().length - 1;

	editProductionModuleTable();
}

var addProcedure = function() {

	var orderId = $("#productionorderid").val();

	productionProcedureTable.row.add({
		"productionprocedureid" : "",
		"procedurename" : "",
		"linestatus" : "",
		"groupname" : "",
		"centername" : "",
		"mouldname" : "",
		"personcentername" : "",
		"timeunitname" : "",
		"timing" : "",
		"scheduleargs" : "",
		"batchnumber" : "",
		"batchshiftcount" : "",
		"basicnumber" : "",
		"plannumber" : "",
		"runtime" : "",
		"changetime" : "",
		"scheduledstarttime" : "",
		"scheduledendtime" : "",
		"adjuststarttime" : "",
		"adjustendtime" : "",
		"practicalstarttime" : "",
		"practicalendtime" : "",
		"scheduledchangestarttime" : "",
		"scheduledchangeendtime" : "",
		"adjustchangestarttime" : "",
		"adjustchangeendtime" : "",
		"practicalchangestarttime" : "",
		"practicalchangeendtime" : "",
		"productionorderid" : orderId
	}).draw(false);

	// 把新添加的行置成编辑模式
	// var index = productionProcedureTable.rows().data().length - 1;

	editProductionProcedureTable(true);
}

/**
 * 刷新产品
 */
var refresh = function(type) {

	if (confirm("该操作会使正在编辑中的数据恢复到上次保存的版本，是否继续?")) {

		var id = $("#productionorderid").val();

		if (type == 1) {

			// 初始化产品DataTable
			productionProductorTable.ajax
					.url(
							"../../../"+ln_project+"/productionOrder?method=queryProductionProductor&productionOrderId="
									+ id).load();

		} else if (type == 2) {

			// 初始化组件DataTable
			productionModuleTable.ajax
					.url(
							"../../../"+ln_project+"/productionOrder?method=queryProductionModule&productionOrderId="
									+ id).load();

		} else if (type == 3) {

			// 初始化工序DatTable
			productionProcedureTable.ajax
					.url(
							"../../../"+ln_project+"/productionOrder?method=queryProductionProcedure&productionOrderId="
									+ id).load();

			// 初始化工艺路线数据
			initProcessrouteSelectData(id);

			// 加载工序数据
			loadProductionOrder(id, 2);

		}

	}

}

/**
 * 删除数据
 */
var deleteDataTableData = function(type) {

	// 组件
	if (type == 1) {

		$("#productionModuleTable tbody tr")
				.each(
						function() {

							// 获取该行的下标
							var index = productionModuleTable.row(this).index();

							if ($(this).find("td:eq(0)").find(
									"input[name='moduleCheckList']").prop(
									"checked") == true) {
								productionModuleTable.rows(index).remove()
										.draw(false);
							}

						});

		//

		// 工序
	} else if (type == 2) {

		$("#productionProcedureTable tbody tr")
				.each(
						function() {

							// 获取该行的下标
							var index = productionProcedureTable.row(this)
									.index();

							if ($(this).find("td:eq(0)").find(
									"input[name='procedureCheckList']").prop(
									"checked") == true) {
								productionProcedureTable.rows(index).remove()
										.draw(false);
							}

						});

	}

}

/**
 * 把产品变成可编辑表格
 */
var editProductionProductorTable = function() {

	// 获取DataTable所有的数据
	/*
	 * var productorDataList = productionProductorTable.rows().data();
	 *
	 * if (productorDataList != undefined && typeof(productorDataList) !=
	 * "undefined") { // 循环遍历Table数据 for (var i = 0; i <
	 * productorDataList.length; i ++) {
	 *
	 * var productorData = productorDataList[i];
	 *
	 * for (var item in productorData) { // alert(productorData[item]); } } }
	 */

	$("#productionProductorTable tbody tr")
			.each(
					function() {

						// 获取该行的下标
						var index = productionProductorTable.row(this).index();

						// 把第四列转换成Text文本
						$(this)
								.find("td:eq(4)")
								.html(
										'<input type="text" class="form-control" onblur="setDataTableValue(this, '
												+ index
												+ ',\'productionProductorTable\')" name="number" id="number" value="'
												+ productionProductorTable
														.rows().data()[index].number
												+ '">');

					});

	productionProductorTable.columns.adjust();
}

// 改变DataTable对象里的值
var setDataTableValue = function(obj, index, tableName) {

	var tableObj = $("#" + tableName).DataTable();

	// 获取修改的行数据
	var productor = tableObj.rows().data()[index];

	// 循环Json key,value，赋值
	for ( var item in productor) {

		// 当ID相同时，替换最新值
		if (item == obj.name) {

			productor[item] = obj.value;

		}

	}

	// if (tableName == "productionProductorTable") {
	// $("#expectnumber").val(tableObj.rows().data()[index].number);
	// }

	// alert(tableObj.rows().data()[index].number);
}

var getDataTableData = function(tableObj) {

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

// 保存数据
var saveProductionOrder = function() {

	// 生产订单数据
	var arrayForm = $("#productionLeadTime,#productionProcessroute")
			.serializeArray();

	// 产品数据
	var productorProductorData = getDataTableData(productionProductorTable);

	// 组件数据
	var productionModuleData = getDataTableData(productionModuleTable);

	// 工序数据
	var productionProcedureData = getDataTableData(productionProcedureTable);

	// 合并在一起的最终数据
	var formData = formatFormJson(arrayForm, productorProductorData,
			productionModuleData, productionProcedureData);

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/productionOrder",
		data : {
			"method" : "saveProductionOrder",
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
					com.leanway.formReadOnly(
							"productionBusiness,productionLeadTime",
							readOnlyObj);
					productionOrderTable.ajax.reload();
					// newProductionOrderTable.ajax.reload();
					unSelectClick();
					hideEditButton();

				}

			}

		}
	});

}

var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

function generateMixed(n) {
     var res = "";
     for (var i = 0; i < n ; i ++) {
         var id = Math.ceil( Math.random()*35 );
         res += chars[id];
     }
     return res;
}

var showOrderInfo = function ( ) {

	var display =$('#orderInfo').css('display');

	if(display == 'none'){
		$("#orderInfo").show("500");
	} else {
		$("#orderInfo").hide("500");
	}
}

var readProductionOrderProgress = function ( ) {

	$("#orderInfo").css("color" , "#3c8dbc");

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "readDispatchingOrderProgress",
			"createCode" : createCode
		},
		dataType : "json",
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {

				if (data.status == 0  || data.status == 1 ) {

					$("#progressBarDiv").css("width" , data.progressBar);
					$("#progressInfo").html( data.progressBar+ "：" + data.productorname );

					var msg = "子查询号 : "+ data.productionchildsearchno + ", 正生成： " + data.productorname +" 派工单，已执行(s)：" + data.excTime;

					$("#orderInfo").html(msg);

					setTimeout(function () {
						readProductionOrderProgress();

					}, 500);
				} else {

					if (data.status == -1) {
						$("#progressDiv").hide();
						$("#orderInfo").html(data.info);
						$("#orderInfo").css("color" , "red");
						$("#orderInfo").show();
					} else if(data.status == 2) {
						$("#orderInfo").html("");
						$("#progressInfo").html("100%");
						$("#progressBarDiv").css("width" , "100%");
						$("#progressDiv").hide();
						$("#orderInfo").hide();
						$("#createDispatchingOrder").prop("disabled", false);
						$("#createDispatchingOrder").html("生成派工单");
					}
				}

			}

		},
		error : function () {

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
	createCode = myData.getTime() + generateMixed(5) ;
	searchCondition.createCode = createCode;

	// condition.sqlDatas = sqlJson;

	var strCondition = $.trim(JSON.stringify(searchCondition));

	$("#createDispatchingOrder").prop("disabled", true);
	$("#createDispatchingOrder").html("生成中...请等待！");

	$("#progressInfo").html("0%");
    $("#progressBarDiv").css("width" , "0%");
    $("#progressDiv").show();
    $("#orderInfo").hide();

	setTimeout(function () {
		readProductionOrderProgress();
	}, 2000);

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/dispatchingOrder",
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
						//$("#searchValue").val("");
					}

					productionOrderTable.ajax.reload();
				}

			}

		},
		error : function() {

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
	//var parentUserId = parent.window.$("#userId").val();
	//var key = parentUserId + "productinorder" + "searchCondition";
	// 保存当前用户的所选项
	// setLocalVaule( key );
	
	productionOrderTable.ajax.url("../../../"+ln_project+"/productionOrder?method=queryProductionOrderByCenterid&status=0&strCondition="+ strCondition).load();
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
	// newProductionOrderTable.ajax.url("../../productionOrder?method=queryProductionOrderByCenterid&status=2&searchValue="
	// + searchVal+"&orderStatus=" + orderStatus).load();
}

// 初始化数据表格
var initTable = function(condition) {

	var table = $('#productionOrderTable')
			.DataTable(
					{
						"ajax" : "../../../"+ln_project+"/productionOrder?method=queryProductionOrderByCenterid"
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
						"columns" : [ {
							"data" : "productionorderid"
						}, {
							"data" : "productionnumber"
						}, {
							"data" : "productionchildsearchno"
						}, {
							"data" : "productorname"
						}, {
							"data" : "productordesc"
						}, {
							"data" : "processroutename"
						}, {
							"data" : "adjuststarttime"
						}, {
							"data" : "productionorderstatus"
						} ],
						"columnDefs" : [ {
							orderable : false,
							targets : [ 0 ]
						} ],
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
									"mDataProp" : "adjuststarttime"
								},
								{
									"mDataProp" : "productionorderstatus",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd)
												.html(
														productionorderstatusToName(sData));
									}
								} ],
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

						}

					}).on('xhr.dt', function(e, settings, json) {
				com.leanway.checkLogind(json);
				table.columns.adjust();
			});

	return table;
}

var initNewProductionOrderTable = function() {

	var table = $('#newProductionOrderTable')
			.DataTable(
					{
						"ajax" : "../../../"+ln_project+"/productionOrder?method=queryProductionOrderByCenterid&status=2",
						/* "iDisplayLength" : "10", */
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"scrollX" : true,
						"bSort" : true,
						"bProcessing" : true,
						"bServerSide" : true,
						"columnDefs" : [ {
							orderable : false,
							targets : [ 0 ]
						} ],
						"aoColumns" : [
								{
									"mDataProp" : "productionorderid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										// $(nTd).html("<input type='checkbox'
										// name='newCheckList' value='" + sData
										// + "'>");
										$(nTd)
												.html(
														"<div id='stopPropagation"
																+ iRow
																+ "'>"
																+ "<input class='regular-checkbox' type='checkbox' id='"
																+ sData
																+ "' name='newCheckList' value='"
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
									"mDataProp" : "processroutename"
								},
								{
									"mDataProp" : "adjuststarttime"
								},
								{
									"mDataProp" : "productionorderstatus",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd)
												.html(
														productionorderstatusToName(sData));
									}
								} ],
						"fnCreatedRow" : function(nRow, aData, iDataIndex) {

						},
						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},

						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {
							com.leanway
									.setDataTableColumnHide("newProductionOrderTable");
							$("#newCheckAll").prop("checked", false);

						}

					}).on('xhr.dt', function(e, settings, json) {
				com.leanway.checkLogind(json);
			});

	return table;

}

/**
 * 初始化销售订单
 */
var initSalesOrderTable = function() {

	var table = $('#salesOrderDataTable')
			.DataTable(
					{
						"ajax" : '../../../'+ln_project+'salesOrder?method=querySalesOrderByConditons',
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						// "sScrollY" : 450, // DataTables的高
						// "sScrollX" : 400, // DataTables的宽
						"bAutoWidth" : true, // 宽度自适应
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",
						"columns" : [ {
							"data" : "salesorderid"
						}, {
							"data" : "code"
						}, {
							"data" : "compid"
						}, {
							"data" : "salesdate"
						} ],
						"aoColumns" : [
								{
									"mDataProp" : "salesorderid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										// $(nTd).html(
										// "<input type='checkbox'
										// name='salesCheckList' value='"
										// + sData + "'>");
										$(nTd)
												.html(
														"<div id='stopPropagation"
																+ iRow
																+ "'>"
																+ "<input class='regular-checkbox' type='checkbox' id='"
																+ sData
																+ "' name='salesCheckList' value='"
																+ sData
																+ "'><label  for='"
																+ sData
																+ "'></label>");
										com.leanway.columnTdBindSelect(nTd);
									}
								}, {
									"mDataProp" : "code"
								}, {
									"mDataProp" : "compid"
								}, {
									"mDataProp" : "salesdate"
								} ],
						"fnCreatedRow" : function(nRow, aData, iDataIndex) {
							// add selected class
							/*
							 * $(nRow).click(function () {
							 * console.info(aData.createtime) });
							 */
						},
						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {

						}
					}).on('xhr.dt', function(e, settings, json) {
				com.leanway.checkLogind(json);
			});
	return table;
}

/**
 * 初始化产品
 */
var initProductionProductorTable = function() {

	var table = $('#productionProductorTable')
			.DataTable(
					{
						"ajax" : "../../../"+ln_project+"/productionOrder?method=queryProductionProductor",
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
									"mDataProp" : "productionproductorid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										// $(nTd).html("<input type='checkbox'
										// name='productorCheckList' value='" +
										// sData + "'>");
										$(nTd)
												.html(
														"<div id='stopPropagation"
																+ iRow
																+ "'>"
																+ "<input class='regular-checkbox' type='checkbox' id='"
																+ sData
																+ "' name='productorCheckList' value='"
																+ sData
																+ "'><label  for='"
																+ sData
																+ "'></label>");
										com.leanway.columnTdBindSelect(nTd);
									}
								}, {
									"mDataProp" : "productorname"
								}, {
									"mDataProp" : "productordesc"
								}, {
									"mDataProp" : "unitsname"
								}, {
									"mDataProp" : "number"
								}, {
									"mDataProp" : "contractnumber"
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
							// editProductionProductorTable();
							// }

						}
					}).on('xhr.dt', function(e, settings, json) {
				com.leanway.checkLogind(json);
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
						"ajax" : "../../../"+ln_project+"/productionOrder?method=queryProductionModule",
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
								},
								{
									"mDataProp" : "modulename"
								},
								{
									"mDataProp" : "shortname"
								},
								{
									"mDataProp" : "serialnumber"
								},
								{
									"mDataProp" : "linestatus",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd).html(lineStatusToName(sData));
									}
								}, {
									"mDataProp" : "unitsname"
								}, {
									"mDataProp" : "requestdate"
								}, {
									"mDataProp" : "procedurename"
								}, {
									"mDataProp" : "scrappage"
								}, {
									"mDataProp" : "consumingnumber"
								}, {
									"mDataProp" : "surplusnumber"
								}, {
									"mDataProp" : "number"
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
						"ajax" : "../../../"+ln_project+"/productionOrder?method=queryProductionProcedure",
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
									"mDataProp" : "linestatus",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd).html(lineStatusToName(sData));
									}
								},
								{
									"mDataProp" : "groupname"
								},
								{
									"mDataProp" : "centername"
								},
								{
									"mDataProp" : "personcentername"
								},
								{
									"mDataProp" : "mouldname"
								},
								{
									"mDataProp" : "timeunitname"
								},
								{
									"mDataProp" : "timing"
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
								}, {
									"mDataProp" : "scheduledstarttime"
								}, {
									"mDataProp" : "scheduledendtime"
								}, {
									"mDataProp" : "adjuststarttime"
								}, {
									"mDataProp" : "adjustendtime"
								}, {
									"mDataProp" : "practicalstarttime"
								}, {
									"mDataProp" : "practicalendtime"
								}, {
									"mDataProp" : "scheduledchangestarttime"
								}, {
									"mDataProp" : "scheduledchangeendtime"
								}, {
									"mDataProp" : "adjustchangestarttime"
								}, {
									"mDataProp" : "adjustchangeendtime"
								}, {
									"mDataProp" : "practicalchangestarttime"
								}, {
									"mDataProp" : "practicalchangeendtime"
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

// 加载生产订单详细数据
var loadProductionOrder = function(productionorderid, type) {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/productionOrder",
		data : {
			"method" : "queryProductionOrder",
			"productionorderid" : productionorderid
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {

				if (type != undefined && typeof (type) != "undefined"
						&& type == 2) {

					// 设置工艺路线数据
					setProcessrouteValue(data.productionOder)

				} else {
					setFormValue(data.productionOder);
				}

			}

		}
	});

}

var setProcessrouteValue = function(data) {

	for ( var item in data) {

		if (item == "processrouteid" || item == "processroutename"
				|| item == "processrouteshortname"
				|| item == "processroutecode") {
			$("#" + item).val(data[item]);
		}

	}
}

// 给form赋值
var setFormValue = function(data) {

	clearForm();
	for ( var item in data) {
		if (item != "searchValue" ) {

			$("#" + item).val(data[item]);
		}
	}

}

// 格式化form数据
var formatFormJson = function(formData, productorProductorData,
		productionModuleData, productionProcedureData) {

	var data = "{";

	for (var i = 0; i < formData.length; i++) {

		data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";

	}

	data += "\"productorProductorData\" : " + productorProductorData + ",";

	data += "\"productionModuleData\" : " + productionModuleData + ",";

	data += "\"productionProcedureData\" : " + productionProcedureData

	data += "}";

	return data;
}

// 格式化form数据
var  formatFormBeJson = function  (formData) {

	var reg=/,$/gi;

	var data = "{";

	for (var i = 0; i < formData.length; i++) {

		data += "\"" +formData[i].name +"\" : \""+formData[i].value+"\",";

	}

	data = data.replace(reg,"");

	data += "}";

	return data;
}

// 清除页面的form数据
var clearForm = function() {

	// 清空form
	com.leanway.clearForm("productionLeadTime,productionProcessroute");

	// 清空工艺路线下拉框
	// $("#processrouteid").empty();

}

var hideEditButton = function() {
	$("#refreshProductorButton").hide();
	$("#refreshModuleButton").hide();
	$("#addModuleButton").hide();
	$("#deleteModuleButton").hide();
	$("#refreshProcedureButton").hide();
	$("#addProcedureButton").hide();
	$("#deleteProcedureButton").hide();
	$("#saveFun").hide();
	$("#addNewFun").hide();
}

var showEditButton = function() {
	$("#refreshProductorButton").show();
	$("#refreshModuleButton").show();
	$("#addModuleButton").show();
	$("#deleteModuleButton").show();
	$("#refreshProcedureButton").show();
	$("#addProcedureButton").show();
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
		result = "挂起";
		break;
	case 2:
		result = "关闭";
		break;
	default:
		result = "挂起";
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
		url : "../../../"+ln_project+"/productionOrder",
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
	}else if(data.length != 1){
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
 * 同步工单
 */
function transferOrder(type){
	var ids ;
	if(type == 0){

		ids = com.leanway.getCheckBoxData(1, "productionOrderTable", "checkList");
		if (ids.length>0) {

			var transferstatus = $('input[name="issuemode"]:checked').val();
			if(transferstatus=="1"){
				lwalert("tipModal", 1, "工单已同步");
				return;
			}
			var virtual = $('input[name="virtual"]:checked').val();
			if(virtual=="-1"){
				lwalert("tipModal", 1, "请选择非下料件进行同步");
				return;
			}
		} else {

			lwalert("tipModal", 1, "至少选择一条工单进行同步！");
			return;
		}
	}

	$("#transferOrder").prop("disabled",true);
	$("#transferOrder").html("传输中...稍等");
	$("#transferdropdown").prop("disabled",true);
//	lwalert("tipModal", 1, "正在传输数据。。");
//	return;
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/dataSync",
		data : {
			method:"transferOrder",
			"orderids":ids
		},
		dataType : "text",
//		async : false,
		success : function(text) {
			var flag =  com.leanway.checkLogind(text);
			if(flag){
				var tempData = $.parseJSON(text);
				if (tempData.status == "success") {
						lwalert("tipModal", 1, tempData.info);
						productionOrderTable.ajax.reload();
					}else if (tempData.status == "fail") {
						lwalert("tipModal", 1, tempData.info);
					}else if (tempData.status == "error") {
						lwalert("tipModal", 1, tempData.info);
					}
				$("#transferOrder").prop("disabled",false);
				$("#transferOrder").html("同步工单");
				$("#transferdropdown").prop("disabled",false);

			}
		}
	});

}
/**
 * 删除生产订单
 */
function deleteProductionproductor() {
	//判断数据是否为多个
	// 获取勾选的销售订单Id
	var data = productionOrderTable.rows('.row_selected').data();

	if (data.length == 0) {
		lwalert("tipModal", 1, "请勾选订单进行删除生产订单！");
		return;
	}
	var msg = "确定删除选中的" + data.length + "条生产订单?";

	lwalert("tipModal", 2, msg ,"isSureDeleteProduction()");
}

function isSureDeleteProduction() {
	//获取选中的ids,
	var productionOrderids = com.leanway.getDataTableCheckIds("checkList");
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/productionOrder",
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
	var msg= "确定要进行按条件删除吗？";
	lwalert("tipModal", 2, msg ,"isSureDeleteProductionproductorByCondition()");
}
/**
 * 确定删除
 */
function isSureDeleteProductionproductorByCondition() {
	var searchConditionsObj = getSearchConditions();
	var strCondition = $.trim(JSON.stringify(searchConditionsObj));
	
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/productionOrder",
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
	//对应的表单id
	$('#productionOrderForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					productorid : {
						validators : {
							notEmpty : {},
						}
					},
					bomid : {
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

					productionsearchno: {
						validators : {
							notEmpty : {},
						}
					},

					producefinishdate: {
							validators : {
								notEmpty : {},
							}
						}

					}



			})
}
/**
 * 校验生产号是否存在
 */
function isExitSearchcode (salesDetailFormData,currentproduction){
	//获取页面的生产号的值
	var productionsearchno =$("#productionsearchno").val();
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/productionOrder",
		data : {
			"method" : "isExitSearchcode",
			"productionsearchno" : productionsearchno
		},
		dataType : "json",
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if ( flag ) {


				if (text.status == "success") {
					ajaxAddProductionOrder(salesDetailFormData,currentproduction);
				}else {
					lwalert("tipModal", 1, text.info);
				}
			}

		}
	});
}

function ajaxAddProductionOrder(salesDetailFormData,currentproduction) {
	$("#addProductionOrder").prop("disabled", true);
	$("#addProductionOrder").html("保存中...请等待！");

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/productionOrder",
		data : {
			"method" : "addProductionOrder",
			"salesDetailFormData" : salesDetailFormData,
			"currentproduction": currentproduction
		},
		dataType : "json",
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if ( flag ) {

				lwalert("tipModal", 1, text.info);

				if (text.status == "success") {
					productionOrderTable.ajax.reload();
					$('#addModal').modal("hide");
				}

				$("#addProductionOrder").prop("disabled", false);
				$("#addProductionOrder").html("保存");

			}

		}
	});
}

// 加载所有的产品种类
var loadProtype = function ( ) {
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/productors",
		data :{
			"method" : "findAllProtype"
		},
		dataType : "json",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {

			    var json = data;

				var protype = json.productorTypes;
				var html="";

				for (var i = 0;i<protype.length;i++) {
					/**
					 * option 的拼接 + "|" + protype[i].productortypename+
					 * */
					html +="<option value="+ protype[i].productortypeid+">"+protype[i].productortypemask +"</option>";
				}
				
				$("#productorTypeId").html(html);
				
				
			    $("#productorTypeId").select2({
			    	placeholder : "产品类型(可多选)",
			        tags: false,
			        language : "zh-CN",
			        allowClear: true,
			        maximumSelectionLength: 10  //最多能够选择的个数
			    });
			   
			}
		}
	});
}

/**
 * 获取查询条件
 * 
 * type  1：一般查询，2：生成派工单查询
 */
var getSearchConditions = function ( type ) {
	
		var sqlJsonArray = new Array()
	
		if (type == undefined || typeof(type) == "undefined") {
			type = 1;
		}

		var sqlJson = "";
		
		// 勾选的树形结构产品ID
		var levels = "";
		
		var zTree = $.fn.zTree.getZTreeObj("treeBom");

		if (zTree != null && zTree != "undefined" && typeof(zTree) != "undefined") {
			var nodes = zTree.getCheckedNodes(true);
			for (var i = 0; i < nodes.length; i++) {
				levels += nodes[i].levels + ",";
			}
		}

		// 0：全部，1：下级
		var searchBom = $('input[name="searchBom"]:checked').val();

		// 子查询号
		var productionChildSearchNo = $("#productionchildsearchnoSearch").val();
		if (productionChildSearchNo != null && productionChildSearchNo != "" && typeof(productionChildSearchNo) != "undefined" && productionChildSearchNo != undefined) {
			productionChildSearchNo = productionChildSearchNo.toString();
		}

		// 产品类型
		var productorTypeId = $("#productorTypeId").val();
		
		if (productorTypeId != null && productorTypeId != "" && typeof(productorTypeId) != "undefined" && productorTypeId != undefined) {
			productorTypeId = productorTypeId.toString();
		}
		
		// 开始时间
		var adjustStartTime = $("#adjuststarttimeSearch").val();

		// 结束时间
		var adjustEndTime = $("#adjustendtimeSearch").val();
		
		var searchVal = $("#searchValue").val();

		var modetype = com.leanway.getDataTableCheckIds("virtual");

		var productionOrderStatus = com.leanway.getDataTableCheckIds("productionOrderStatus");

		var issuemode = com.leanway.getDataTableCheckIds("issuemode");

		if ($.trim(productionChildSearchNo) != "") {
		/*	sqlJson += "{\"fieldname\":\"po.productionchildsearchno\",\"fieldtype\":\"varchar_select2\",\"value\":\""
					+ productionChildSearchNo
					+ "\",\"logic\":\"and\",\"ope\":\"in\"},";*/
			var searchNoObj = new Object();
			searchNoObj.fieldname = "po.productionchildsearchno";
			searchNoObj.fieldtype = "varchar_select2";
			searchNoObj.value = productionChildSearchNo;
			searchNoObj.logic = "and";
			searchNoObj.ope = "in";
			
			sqlJsonArray.push(searchNoObj);
		}

		if ($.trim(productorTypeId) != "") {
/*			sqlJson += "{\"fieldname\":\"productorTypeId\",\"fieldtype\":\"varchar_select2\",\"value\":\""
					+ productorTypeId
					+ "\",\"logic\":\"and\",\"ope\":\"in\"},";*/
			
			var productorTypeIdObj = new Object();
			productorTypeIdObj.fieldname = "productorTypeId";
			productorTypeIdObj.fieldtype = "varchar_select2";
			productorTypeIdObj.value = productorTypeId;
			productorTypeIdObj.logic = "and";
			productorTypeIdObj.ope = "in";
			
			sqlJsonArray.push(productorTypeIdObj);
		}
		
		if ($.trim(adjustStartTime) != "") {
		/*	sqlJson += "{\"fieldname\":\"po.adjuststarttime\",\"fieldtype\":\"datetime\",\"value\":\""
					+ adjustStartTime + "\",\"logic\":\"and\",\"ope\":\">=\"},";*/
			
			var adjustStartTimeObj = new Object();
			adjustStartTimeObj.fieldname = "po.adjuststarttime";
			adjustStartTimeObj.fieldtype = "datetime";
			adjustStartTimeObj.value = adjustStartTime;
			adjustStartTimeObj.logic = "and";
			adjustStartTimeObj.ope = ">=";
			
			sqlJsonArray.push(adjustStartTimeObj);
		}

		if ($.trim(adjustEndTime) != "") {
/*			sqlJson += "{\"fieldname\":\"po.adjustendtime\",\"fieldtype\":\"datetime\",\"value\":\""
					+ adjustEndTime + "\",\"logic\":\"and\",\"ope\":\"<=\"},";*/
			
			var adjustEndTimeObj = new Object();
			adjustEndTimeObj.fieldname = "po.adjuststarttime";
			adjustEndTimeObj.fieldtype = "datetime";
			adjustEndTimeObj.value = adjustEndTime;
			adjustEndTimeObj.logic = "and";
			adjustEndTimeObj.ope = "<=";
			
			sqlJsonArray.push(adjustEndTimeObj);
		}

	//	sqlJson = sqlJson.replace(reg, "");

	//sqlJson += "]";
	
	
	//sqlJsonArray.push(sqlJson);
 
//	var myData = new Date();
//	createCode = myData.getTime() + generateMixed(5) ;

	var condition = new Object();
//	condition.productionOrderIds = productionOrderIds;
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
	
	/*condition.createCode = createCode;*/

	// condition.sqlDatas = sqlJson;
 
	return condition;
}