var dispatchingOrderTable,dispatchingOrderException,allExceptionTable;
var equipmentTable;
var employeeTable;
var saveEmployeeTable;
var viewEmployeeTable;
var viewSplitOrderTables;
var addPlanDataArray;
var reg=/,$/gi;
var hasData = false;
var id = "";
var parentId = "";
var type = "";
var tableStatus = false;
var tableHeight = "370px";
var clicktime = new Date();
var condition = "";
var readonly = [{"id":"saveException","type":"button"}];
$ ( function () {

	 if (window.screen.availHeight > 768) {
		 tableHeight = "";
		 $("#productionchildsearchno").css("width","220px");
		 $("#productorTypeId").css("width","140px");
	 }

	// 初始化对象
	com.leanway.loadTags();

	// 产品类型
	loadProtype();

	//添加系統参数
	initSystemConfig();
	// 初始化生产订单
	dispatchingOrderTable = initDispatchingOrder( );
	
	// 派工单异常
	dispatchingOrderException = initDispatchingOrderException( );
	
	allExceptionTable = initDispatchingOrderAllException( );
	
	/**
	 * 显示派工单明细
	 */
	showDetail();

	// checkBox全选事件
//	com.leanway.dataTableCheckAll("dispatchingOrderTable", "checkAll", "checkList");
//	com.leanway.dataTableCheckAll("employeeTables", "employeeCheckAll", "employeeCheckList");
//	com.leanway.dataTableCheckAll("saveEmployeeTables", "saveEmployeeCheckAll", "saveEmployeeCheckList");

	//com.leanway.dataTableClick ("dispatchingOrderTable", "checkList", true, dispatchingOrderTable);
	com.leanway.dataTableClickMoreSelect("dispatchingOrderTable", "checkList", false, dispatchingOrderTable,undefined,undefined,undefined);
	com.leanway.dataTableClickMoreSelect("exceptionTable", "exceptionCheckList", false, dispatchingOrderException,loadOrderException,undefined,undefined);
	com.leanway.dataTableClickMoreSelect("allExceptionTable", "allExceptionCheckList", false, allExceptionTable,undefined,undefined,undefined);

	// enter键时候触发查询
	com.leanway.enterKeyDown("searchBarCode", queryBarCode);

	// 查询触发
	com.leanway.enterKeyDown("searchValue", queryDispatchingOrder);
	com.leanway.enterKeyDown("productionchildsearchno", queryDispatchingOrder);
	com.leanway.enterKeyDown("adjuststarttime", queryDispatchingOrder);
	com.leanway.enterKeyDown("adjustendtime", queryDispatchingOrder);
	com.leanway.enterKeyDown("groupname", queryDispatchingOrder);
	com.leanway.enterKeyDown("procedureshortname", queryDispatchingOrder);
	com.leanway.enterKeyDown("material", queryDispatchingOrder);
	com.leanway.enterKeyDown("employeeSearchValue", searchEmployee);
	com.leanway.enterKeyDown("equipmentSearchValue", searchEquipment);
	
	$("input[name=virtual]").click(function(){
//		com.leanway.clearTableMapData("dispatchingOrderTable");
		queryDispatchingOrder();
	});

	$("input[name=searchBom]").click(function(){
//		com.leanway.clearTableMapData("dispatchingOrderTable");
		queryDispatchingOrder();
	});

	$("input[name=dispatchingstatus]").click(function(){
//		com.leanway.clearTableMapData("dispatchingOrderTable");
		queryDispatchingOrder();
	});
	$("input[name=bomstatus]").click(function(){
//		com.leanway.clearTableMapData("dispatchingOrderTable");
		queryDispatchingOrder();
	});

	$("#saveFun").attr("disabled", true);


	initTreeBom();

	com.leanway.initTimePickYmdForMoreId("#adjuststarttime,#adjustendtime,#excreatetime,#excreatetime_end");

	//初始化select2下拉框
	//com.leanway.initSelect2("#productionchildsearchno","../../../"+ln_project+"/dispatchingOrder?method=querySearchNo", "按生产号查询",true);
	com.leanway.initSelect2("#productionchildsearchno","../../../"+ln_project+"/productionOrder?method=querySearchNo","查询号(可多选)", true);
	
	// 异常调整查询号
	com.leanway.initSelect2("#exsearchno","../../../"+ln_project+"/productionOrder?method=querySearchNo","查询号(可多选)", true);
	
	// 审核人
	com.leanway.initSelect2("#audituser","../../../"+ln_project+"/dispatchingOrder?method=queryEmployeeSelect","审核人", true);
	
	
	// 派工单查询
    $("#productorTypeId,#productionchildsearchno").on("select2:select" , function( e ) {
    	queryDispatchingOrder();
    });

    $("#productorTypeId,#productionchildsearchno").on("select2:unselect" , function( e ) {
    	queryDispatchingOrder();
    });

    $("#adjuststarttime,#adjustendtime,#groupname,#procedureshortname,#material").on("change", function(e) {
    	queryDispatchingOrder();
    });
    
    // 异常查询
    $("#exexceptionid,#exsearchno").on("select2:select" , function( e ) {
    	searchException();
    });
    $("#exexceptionid,#exsearchno").on("select2:unselect" , function( e ) {
    	searchException();
    });
    $("#exproductorname,#exdrawcode,#excreateusername,#exadjustuser,#excreatetime,#excreatetime_end").on("change", function(e) {
    	searchException();
    });
    
	com.leanway.enterKeyDown("exproductorname", searchException);
	com.leanway.enterKeyDown("exdrawcode", searchException);
	com.leanway.enterKeyDown("excreateusername", searchException);
	com.leanway.enterKeyDown("exadjustuser", searchException);
    
    queryInitTimeUnits();
    getDispatchingOrderException();
    com.leanway.formReadOnly("exceptionForm", readonly);
    
    loadPMSelect2Data();
    
	$("#pmForm #productorid").on("select2:select",function(e) {
		// 根据产品ID查询对应的版本数据
		if ($(this).val() != "" && typeof ($(this).val()) != "undefined" && $(this).val() != undefined) {
			
			loadPmPsv($(this).val()[0]);
		}
	});
    
})

/**
 * 初始化condition参数
 */
var initCondition = function ( day ) {
	console.log(day);
	var adjustStartTime = new Date();
	//得到相应的开始时间的年，月，日
	var startYear = adjustStartTime.getFullYear();
	var startMon  = adjustStartTime.getMonth()+1;
	var startDay  = adjustStartTime.getDate();
	//然后将相应的时间转换成相应的yyyy-mm-dd的形式
	var adjustEndTime = adjustStartTime;

	adjustEndTime.setDate(adjustStartTime.getDate()+(day-1));

	adjustStartTime = startYear + "-" + (startMon<10?"0"+startMon:startMon) + "-" + (startDay<10?"0"+startDay:startDay);
	var endMon = adjustEndTime.getMonth()+1 ;
	//然后将其转换成相应的string格式的数据
	adjustEndTime = adjustEndTime.getFullYear() + "-" + (endMon<10?"0"+endMon:endMon) + "-" + (adjustEndTime.getDate()<10?"0"+adjustEndTime.getDate():
		adjustEndTime.getDate()) ;

	var sqlJson = "{\"sqlDatas\": [";

	if ($.trim(adjustStartTime) != "") {
		sqlJson += "{\"fieldname\":\"dco.adjuststarttime\",\"fieldtype\":\"datetime\",\"value\":\""+ adjustStartTime + "\",\"logic\":\"and\",\"ope\":\">=\"},";
	}

	if ($.trim(adjustEndTime) != "") {
		sqlJson += "{\"fieldname\":\"dco.adjuststarttime\",\"fieldtype\":\"datetime\",\"value\":\""+ adjustEndTime + "\",\"logic\":\"and\",\"ope\":\"<=\"},";
	}

	sqlJson = sqlJson.replace(reg, "");

	sqlJson += "]}";
//	condition = "&status=0&modetype=0&&productionOrderStatus=1";
//	?method=queryDispatchingOrder&searchValue=" + searchVal + "&orderStatus=" + orderStatus +"&sqlDatas=" + encodeURIComponent(jsonData) + "&dispatchingstatus=" + dispatchingStatus
	// condition = "&status=0&dispatchingstatus=0,2&productionOrderStatus=1&sqlDatas=" + encodeURIComponent(sqlJson);

	//拼好条件后加上勾选的
	 $("input[type=checkbox][name=virtual][value= 0 ]").prop("checked", true);
	 $("input[type=checkbox][name=dispatchingstatus][value= 0 ]").prop("checked", true);
	 $("input[type=checkbox][name=dispatchingstatus][value= 2 ]").prop("checked", true);
	//然后给文本框赋值
	 $("#adjuststarttime").val(adjustStartTime);
	 $("#adjustendtime").val(adjustEndTime);

	var searchCondition = getSearchConditions();
	var strCondition = encodeURIComponent($.trim(JSON.stringify(searchCondition)));
	condition = "&strCondition=" + strCondition;

}

/**
 * 初始化系统参数
 */
var initSystemConfig = function ( ) {


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

var initTreeBom = function ( ) {

	$.fn.zTree.init($("#treeBom"), {
        check : {
            enable : true,
            chkStyle :"checkbox",
            chkboxType : { "Y": "a"},
        },
		async : {
			enable : true,
			url : "../../../../"+ln_project+"/bom?method=queryBomTreeList",
			autoParam : [ "levels"]
		},
		view : {
			dblClickExpand : false,
			fontCss:getFontCss,
			showLine: true,
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
	queryDispatchingOrder();
};

var getFontCss = function (treeId, treeNode) {
    return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
}

function onClick(e, treeId, treeNode) {

	if ( treeNode.checked ) {
		$.fn.zTree.getZTreeObj("treeBom").checkNode(treeNode, false, false);
	} else {
		$.fn.zTree.getZTreeObj("treeBom").checkNode(treeNode, true, true);
	}
	queryDispatchingOrder();

	//var isParent = "false";
	//checkSession();

	//if(zTree.getSelectedNodes()[0].pbomid==""||zTree.getSelectedNodes()[0].pbomid==null){
	//	displaynone();
		//isParent = "true";
	//}else{
		//displayblock();
//	}

	//if(zTree.getSelectedNodes()[0].bomid){
	    //loadBomObject(zTree.getSelectedNodes()[0].bomid, isParent);
//	}
//	com.leanway.formReadOnly("bomForm");
}

//  隐藏列
function hiddenColumns(){

  $('a.toggle-vis').on( 'click', function (e) {

        e.preventDefault();

        // Get the column API object
        var column = dispatchingOrderTable.column( $(this).attr('data-column') );

        // Toggle the visibility
        try {
            column.visible( ! column.visible() );
        } catch ( e ) {
            dispatchingOrderTable.ajax.reload(null,false);
        }


    } );

}
/**
 * 点加好显示派工单详细信息
 */
function showDetail(){
    var detailRows = [];

    $('#dispatchingOrderTable tbody').on( 'click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = dispatchingOrderTable.row( tr );

        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data()) ).show();
            tr.addClass('shown');
        }
    } );
}
function format ( data ) {

    return '生产订单号: '+(data.productionnumber==null?"":data.productionnumber)+'<br>'+
    		'生产流转卡号: '+(data.productionorderbarcode==null?"":data.productionorderbarcode)+'<br>'+
    		'产品描述: '+(data.productordesc==null?"":data.productordesc)+'<br>'+
    		'材料规格: '+(data.material==null?"":data.material)+'<br>'+
    	/*	'工序: '+(data.line==null?"":data.line)+'<br>'+*/
    	    '工作中心: '+(data.centername==null?"":data.centername)+'<br>'+
    		'人工工作中心: '+(data.personcentername==null?"":data.personcentername)+'<br>'+
        /*   '模具: '+(data.mouldname==null?"":data.mouldname)+'<br>'+
           '模具台账: '+(data.ledgername==null?"":data.ledgername)+'<br>'+*/
           '调整结束时间: '+(data.adjustendtime==null?"":data.adjustendtime)+'<br>'+
           '计划开始时间: '+(data.starttime==null?"":data.starttime)+'<br>'+
           '计划结束时间: '+(data.endtime==null?"":data.endtime)+'<br>'+
           '实际开始时间: '+(data.practicalstarttime==null?"":data.practicalstarttime)+'<br>'+
           '实际结束时间: '+(data.practicalendtime==null?"":data.practicalendtime)+'<br>'
//           '换摸开始时间: '+(data.changestarttime==null?"":data.changestarttime)+'<br>'+
//           '换摸结束时间: '+(data.changeendtime==null?"":data.changeendtime)+'<br>'

}


/**
 * 高级查询
 */
var advancedSearch = function ( ) {

	// 字段信息
	var fieldInfoData = '[';
	fieldInfoData += '{"fieldName" : "dco.productionchildsearchno","fieldType":"varchar","displayName" : "子查询号"},';
	fieldInfoData += '{"fieldName" : "po.productionnumber","fieldType":"varchar","displayName" : "生产订单号"},';
	fieldInfoData += '{"fieldName" : "ppd.productorname","fieldType":"varchar","displayName" : "产品编码"},';
	fieldInfoData += '{"fieldName" : "ppd.productordesc","fieldType":"varchar","displayName" : "产品名称"},';
	fieldInfoData += '{"fieldName" : "sp.shortname","fieldType":"varchar","displayName" : "工序短名"},';
	fieldInfoData += '{"fieldName" : "en.equipmentname","fieldType":"varchar","displayName" : "设备台帐"},';
	fieldInfoData += '{"fieldName" : "m.mouldname","fieldType":"varchar","displayName" : "模具"},';
	fieldInfoData += '{"fieldName" : "ms.ledgername","fieldType":"varchar","displayName" : "模具台帐"},';
	fieldInfoData += '{"fieldName" : "cn.centername","fieldType":"varchar","displayName" : "工作中心"},';
	fieldInfoData += '{"fieldName" : "cnn.centername","fieldType":"varchar","displayName" : "人工工作中心"},';
	fieldInfoData += '{"fieldName" : "wcg.groupname","fieldType":"varchar","displayName" : "工作中心组"},';
	fieldInfoData += '{"fieldName" : "dco.starttime","fieldType":"datetime","displayName" : "计划开始时间"},';
	fieldInfoData += '{"fieldName" : "dco.endtime","fieldType":"datetime","displayName" : "计划结束时间"},';
	fieldInfoData += '{"fieldName" : "dco.adjuststarttime","fieldType":"datetime","displayName" : "调整开始时间"},';
	fieldInfoData += '{"fieldName" : "dco.adjustendtime","fieldType":"datetime","displayName" : "调整结束时间"},';
	fieldInfoData += '{"fieldName" : "dco.practicalstarttime","fieldType":"datetime","displayName" : "实际开始时间"},';
	fieldInfoData += '{"fieldName" : "dco.practicalendtime","fieldType":"datetime","displayName" : "实际结束时间"}';
	fieldInfoData += ']';

	// 构建查询Table
	com.leanway.buildAdvancedTable(fieldInfoData, "advancedSearchModal", "advancedSearchForm", "advancedSearchTable", "advancedQuery","exportAdvancedDispatchingOrder");

}

var advancedQuery = function ( jsonData ) {

	com.leanway.clearTableMapData("dispatchingOrderTable");

	var dispatchingStatus =  $('input[name="dispatchingstatus"]:checked').val();

	var orderStatus =  $('input[name="virtual"]:checked').val();

	var searchVal ="";

	var bomStatus =  $('input[name="bomstatus"]:checked').val();

	dispatchingOrderTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryDispatchingOrder&searchValue=" + searchVal + "&orderStatus=" + orderStatus +"&sqlDatas=" + encodeURIComponent(jsonData) + "&dispatchingstatus=" + dispatchingStatus+"&bomstatus="+bomStatus).load();

}

/**
 * 确认派工单
 */
var sureDispatchingOrder = function ( ) {

	var ids = com.leanway.getDataTableCheckIds("checkList");

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "sureDispatchingOrder",
			"ids" : ids
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

	//		alert(text.info);
			var flag =  com.leanway.checkLogind(text);

			if(flag){

				if (text.status == "success") {
					com.leanway.clearTableMapData("dispatchingOrderTable");
				    lwalert("tipModal", 1, "操作成功!");
					dispatchingOrderTable.ajax.reload();
				} else {
					 lwalert("tipModal", 1, text.info);
				}


			}

		}
	});

}
/**
 * 是否批量确认订单
 */
var sureDispatchingOrderBatch = function ( ) {
	var searchConditions = getSearchConditions()
	var strConditions = $.trim(JSON.stringify(searchConditions))
	console.log(strConditions);
	if (strConditions == "") {

		lwalert("tipModal", 1, "请选择相应的查询条件!");
		return;

	} else {

		var msg = "对查询出的订单进行确认?";

		lwalert("tipModal", 2, msg ,"batchSureDispatchingOrder()");
	}

}
/**
 * 确认批量确认订单
 */
var batchSureDispatchingOrder = function ( ) {

	var searchConditions = getSearchConditions()

	var strConditions = $.trim(JSON.stringify(searchConditions))

	lwalert("tipModal", 1, "确认中..请耐心等待！");

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "sureDispatchingOrderBatch",
			"strConditions" : strConditions
		},
		dataType : "json",
		async : true,
		success : function ( text ) {

//			alert(text.info);

			var flag =  com.leanway.checkLogind(text);

			if(flag){


				if (text.status == "success") {

					$('#tipModal').modal("hide");

					dispatchingOrderTable.ajax.reload(null,false);

				}else{
					lwalert("tipModal", 1,text.info);
				}
			}
		}
	});

}

/**
 * 保存设备
 */
var saveEquipmentDispatch = function ( ) {
	//com.leanway.checkSession();
	var orderId = com.leanway.getDataTableCheckIds("checkList");
	var equipmentId =  com.leanway.getDataTableCheckIds("equipmentCheckList")

	if (equipmentId == null || $.trim(equipmentId) == "") {
		 lwalert("tipModal", 1, "请为派工单分配设备台帐!");
		return;
	}
	
	var equipmentname = equipmentTable.rows('.row_selected').data()[0].equipmentname;

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "saveEquipmentDispatching",
			"orderId" : orderId,
			"equipmentId" : equipmentId,
			"equipmentname" : equipmentname
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

	//		alert(text.info);
			var flag =  com.leanway.checkLogind(text);

			if(flag){

				if (text.status == "success") {
					$('#equipmentModal').modal('hide');
					dispatchingOrderTable.ajax.reload(null, false);
				}

			}

		}
	});

}

/**
 * 保存关联雇员
 */
var saveEmployeeDispatch = function ( ) {

	//com.leanway.checkSession();
	var ids = com.leanway.getDataTableCheckIds("checkList");

	// 派工单数据
	var data = getDataTableData(saveEmployeeTable);

	var formData = "{\"listEmployee\": "+ data + ",\"ids\":\"" + ids + "\"}";

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "saveEmployeeDispatching",
			"paramData" : formData
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

	//		alert(text.info);
			var flag =  com.leanway.checkLogind(text);

			if(flag){

				if (text.status == "success") {
					$('#employeeModal').modal('hide');
					dispatchingOrderTable.ajax.reload();
				}

			}

		}
	});

}

/**
 * 关联设备
 */
var showEquipment = function ( ) {

	$("#equipmentSearchValue").val("");

	//获取checkbox值
	var value = com.leanway.getDataTableCheckIds("checkList");

	var values = value.split(",");
	if ( value == "" ) {

	    lwalert("tipModal", 1, "请选择派工单分配设备!");
		return;
	} else if (values.length > 1){

	    lwalert("tipModal", 1, "请选择一条派工单分配设备！");
		return;
	} else {

		// 弹出modal
		$('#equipmentModal').modal({backdrop: 'static', keyboard: true});

		var ids = com.leanway.getDataTableCheckIds("checkList");

		if (equipmentTable == null || equipmentTable == "undefined" || typeof(equipmentTable) == "undefined") {
			equipmentTable = initEquipmentTable(ids);

		} else {
			equipmentTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryEquipment&id=" + ids).load();
		}

	}

}

/**
 * 关联雇员
 */
var showEmployee = function ( ) {
	//com.leanway.checkSession();
	$("#employeeSearchValue").val("");
	//获取checkbox值
	var value = com.leanway.getDataTableCheckIds("checkList");
	var values = value.split(",");
	if (value=="") {
//		alert("请选择派工单关联雇员!");
	    lwalert("tipModal", 1, "请选择派工单关联雇员!");
		return;
	} else if (values.length > 1){
//		alert("请选择一条派工单进行关联！");
	    lwalert("tipModal", 1, "请选择一条派工单进行关联！");
		return;
	} else {

		tableStatus = false;

		// 弹出modal
		$('#employeeModal').modal({backdrop: 'static', keyboard: true});

		var ids = com.leanway.getDataTableCheckIds("checkList");

		if (employeeTable == null || employeeTable == "undefined" || typeof(employeeTable) == "undefined") {
			employeeTable = initEmployeeTable(ids);

		} else {
			employeeTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryEmployees&flag=1&id=" + ids).load();
		}

		if (saveEmployeeTable == null || saveEmployeeTable == "undefined" || typeof(saveEmployeeTable) == "undefined") {

			saveEmployeeTable = initSaveEmployeeTable(ids);

		} else {
			saveEmployeeTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryEmployees&flag=2&id=" + ids).load();
		}

	}


	/*    var ids = com.leanway.getDataTableCheckIds("checkList");

    if (ids.length == 0) {

    	alert("请选择派工单进行操作!");
    	return;

    } */

}

/**
 * 左右移动，1：向右移，2：向左移
 */
var toTable = function ( type ) {
	//com.leanway.checkSession();
	if (type == 1) {

		var dataList =  employeeTable.rows('.row_selected').data();

		if (dataList != undefined && dataList.length > 0) {

			for (var i = 0; i < dataList.length; i++) {

				addEmployee(dataList[i]);

			}

		}

	} else if (type == 2) {

		saveEmployeeTable.rows(".row_selected").remove().draw(false);

		// 重新添加数据到DataTable，解决index下标错误的问题， 操作步骤，1：先删除第一条数据，第二条时删除不掉
		var tempData = saveEmployeeTable.rows().data();

		saveEmployeeTable.rows().remove().draw(false);

		saveEmployeeTable.rows.add(tempData).draw(false);

	}

}

/**
 * 查询雇员
 */
var searchEmployee = function () {
	//com.leanway.checkSession();
	tableStatus = true;

	var ids = com.leanway.getDataTableCheckIds("checkList");

	var searchValue =  $("#employeeSearchValue").val();

	if ($.trim(searchValue) == "") {
		tableStatus = false;
	}

	employeeTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryEmployees&flag=1&searchValue=" + searchValue + "&id=" + ids).load();

}

/**
 * 查询设备台帐
 */
var searchEquipment = function ( ) {

	var ids = com.leanway.getDataTableCheckIds("checkList");

	var searchValue =  $("#equipmentSearchValue").val();

	equipmentTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryEquipment&searchValue=" + searchValue + "&id=" + ids).load();
}

/**
 * 添加雇员
 */
var addEmployee = function ( obj ) {
	//com.leanway.checkSession();
	var canAdd = true;

	// 判断添加的对象在关系表中是否存在
	var dataList = saveEmployeeTable.rows().data();

	if (dataList != undefined && typeof(dataList) != "undefined" && dataList.length > 0) {

		// 循环遍历Table数据
		for (var i = 0; i < dataList.length; i ++) {

			var employeeData = dataList[i];

			if (employeeData.employeeid == obj.employeeid) {
				canAdd = false;
			}

		}
	}

	if (canAdd) {
		saveEmployeeTable.row.add(obj).draw( false );
	}

}

var initDispatchingOrderException = function ( orderId ) {
	
	var table = $('#exceptionTable').DataTable( {
		"ajax": '../../../../'+ln_project+'/dispatchingOrder?method=queryDispatchingOrderException&orderId=' + orderId,
		//"iDisplayLength" : "10",
/*		"scrollY": "200px",
	    "scrollCollapse": "true",*/
		'bPaginate': true,
		"bDestory": true,
		"bRetrieve": true,
		"bFilter":false,
		"bSort": false,
		"bProcessing": true,
		"bServerSide": true,
		"bInfo" : true,
		"aoColumns": [
		              {
		            	  "mDataProp": "orderexceptionid",
		            	  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
//		            		  $(nTd).html("<input type='checkbox' name='employeeCheckList'  value='" + sData + "'>");
		            		  $(nTd)
		            		  .html("<div id='stopPropagation" + iRow +"'>"
		            				  +"<input class='regular-checkbox' type='checkbox' id='"
		            				  + sData
		            				  + "' name='exceptionCheckList' value='"
		            				  + sData
		            				  + "'><label for='"
		            				  + sData
		            				  + "'></label>");
                              com.leanway.columnTdBindSelectNew(nTd,"exceptionTable","exceptionCheckList");
		            	  }
		              },
		              {"mDataProp": "codevalue"},
		      /*        {"mDataProp": "iscalculate",
						"fnCreatedCell" : function(nTd, sData,
								oData, iRow, iCol) {
							$(nTd).html(iscalculateToName(sData));
						}
		            	  
		              },*/
		              {"mDataProp": "beencalculate",
						"fnCreatedCell" : function(nTd, sData,
								oData, iRow, iCol) {
							$(nTd).html(beencalculateToName(sData));
						}
		            	  
		              },
		              {"mDataProp": "exceptionstatus",
							"fnCreatedCell" : function(nTd, sData,
									oData, iRow, iCol) {
								$(nTd).html(exceptionstatusToName(sData));
							}
			            	  
			              }
		              ],
		              "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
		           
		              },
		              "oLanguage" : {
		            	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		              },
		              "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		              "fnDrawCallback" : function(data) {
		            	  
		            	  com.leanway.getDataTableFirstRowId("exceptionTable", loadOrderException,false,"exceptionCheckList");
		              }

	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );

	return table;
	
}

var initDispatchingOrderAllException = function ( ) {
	
	var table = $('#allExceptionTable').DataTable( {
		"ajax": '../../../../'+ln_project+'/dispatchingOrder?method=queryDispatchingOrderException',
		//"iDisplayLength" : "10",
/*		"scrollY": "200px",
	    "scrollCollapse": "true",*/
		'bPaginate': true,
		"bDestory": true,
		"bRetrieve": true,
		"bFilter":false,
		"bSort": false,
		"bProcessing": true,
		"bServerSide": true,
		"bInfo" : true,
		"aoColumns": [
		              {
		            	  "mDataProp": "orderexceptionid",
		            	  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
//		            		  $(nTd).html("<input type='checkbox' name='employeeCheckList'  value='" + sData + "'>");
		            		  $(nTd)
		            		  .html("<div id='stopPropagation" + iRow +"'>"
		            				  +"<input class='regular-checkbox' type='checkbox' id='"
		            				  + sData
		            				  + "' name='allExceptionCheckList' value='"
		            				  + sData
		            				  + "'><label for='"
		            				  + sData
		            				  + "'></label>");
                              com.leanway.columnTdBindSelectNew(nTd,"allExceptionTable","allExceptionCheckList");
		            	  }
		              },
		              {"mDataProp": "dispatchingnumber"},
		              {"mDataProp": "productionchildsearchno"},
		              {"mDataProp": "productorname"},
		              {"mDataProp": "drawcode"},
		              {"mDataProp": "rootmaterial"},
		              {"mDataProp": "codevalue"},
		              {"mDataProp": "exceptiondesc"},
		              
		              
		              {"mDataProp": "createtime"},
		              {"mDataProp": "cuserworkcenter"},
		              {"mDataProp": "createusername"},
		
		              {"mDataProp": "executeuser"},
		              {"mDataProp": "opinion"},
		              {"mDataProp": "exceptiontime"},
		              {"mDataProp": "unitsname"},
		              {"mDataProp": "iscalculate",
						"fnCreatedCell" : function(nTd, sData,
								oData, iRow, iCol) {
							$(nTd).html(iscalculateToName(sData));
						}
		            	  
		              },
		              /*{"mDataProp": "beencalculate",
						"fnCreatedCell" : function(nTd, sData,
								oData, iRow, iCol) {
							$(nTd).html(beencalculateToName(sData));
						}
		            	  
		              },*/
		              {"mDataProp": "exceptionstatus",
							"fnCreatedCell" : function(nTd, sData,
									oData, iRow, iCol) {
								$(nTd).html(exceptionstatusToName(sData));
							}
			            	  
			          },
			          {"mDataProp": "comments"}
		              ],
		              "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
		           
		              },
		              "oLanguage" : {
		            	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		              },
		              "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		              "fnDrawCallback" : function(data) {
		            	   
		              }

	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );

	return table;
	
}

//初始化数据表格
var initEmployeeTable = function (id) {
	//com.leanway.checkSession();
	var table = $('#employeeTables').DataTable( {
		"ajax": '../../../../'+ln_project+'/dispatchingOrder?method=queryEmployees&flag=1&id=' + id,
		//"iDisplayLength" : "10",
/*		"scrollY": "200px",
	    "scrollCollapse": "true",*/
		'bPaginate': true,
		"bDestory": true,
		"bRetrieve": true,
		"bFilter":false,
		"bSort": false,
		"bProcessing": true,
		"bServerSide": true,
		"bInfo" : true,
		"aoColumns": [
		              {
		            	  "mDataProp": "employeeid",
		            	  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
//		            		  $(nTd).html("<input type='checkbox' name='employeeCheckList'  value='" + sData + "'>");
		            		  $(nTd)
		            		  .html("<div id='stopPropagation" + iRow +"'>"
		            				  +"<input class='regular-checkbox' type='checkbox' id='"
		            				  + sData
		            				  + "' name='employeeCheckList' value='"
		            				  + sData
		            				  + "'><label for='"
		            				  + sData
		            				  + "'></label>");
                              com.leanway.columnTdBindSelectNew(nTd,"employeeTables","employeeCheckList");
		            	  }
		              },
		              {"mDataProp": "name"},
		              {"mDataProp": "moble"},
		              {"mDataProp": "department"},
		              ],
		              "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
		            	  //add selected class
		            	  $(nRow).dblclick(function () {
		            		  addEmployee(aData);
		            		  //	employeeTable.rows(iDataIndex).remove().draw(false);
		            	  });

		            	  $(nRow).click(function () {
		            		  if ($(this).hasClass('row_selected')) {
		            			  $(this).removeClass('row_selected');
		            			  $(this).find('td').eq(0).find("input[name='employeeCheckList']").prop("checked", false)
		            		  } else {
		            			  // employeeTable.$('tr.row_selected').removeClass('row_selected');
		            			  $(this).addClass('row_selected');
		            			  //$("input[name='employeeCheckList']").prop("checked", false);
		            			  $(this).find('td').eq(0).find("input[name='employeeCheckList']").prop("checked", true)
		            		  }
		            	  });
		              },
		              "oLanguage" : {
		            	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		              },
		              "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		              "fnDrawCallback" : function(data) {

		            	  if (tableStatus && employeeTable.rows().data().length == 1) {
		            		  addEmployee(employeeTable.rows().data()[0]);
		            	  }

		              }

	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );

	return table;
}

var initSaveEmployeeTable = function (id) {
	//com.leanway.checkSession();
	var table = $('#saveEmployeeTables').DataTable( {
		"ajax": '../../../../'+ln_project+'/dispatchingOrder?method=queryEmployees&flag=2&id=' + id,
		'bPaginate': false,
		"bDestory": true,
		"bRetrieve": true,
		"bFilter":false,
		"bSort": false,
		"bProcessing": true,
		"bServerSide": false,
		"aoColumns": [
		              {
		            	  "mDataProp": "employeeid",
		            	  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
//		            		  $(nTd).html("<input type='checkbox' name='saveEmployeeCheckList'  value='" + sData + "'>");
		            		  $(nTd)
		            		  .html("<div id='stopPropagation" + iRow +"'>"
		            				  +"<input class='regular-checkbox' type='checkbox' id='"
		            				  + sData
		            				  + "' name='saveEmployeeCheckList' value='"
		            				  + sData
		            				  + "'><label for='"
		            				  + sData
		            				  + "'></label>");
		            		  com.leanway.columnTdBindSelect(nTd);
		            	  }
		              },
		              {"mDataProp": "name"},
		              {"mDataProp": "moble"},
		              {"mDataProp": "department"},
		              ],
		              "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
		            	  //add selected class
		            	  $(nRow).dblclick(function () {
		            		  saveEmployeeTable.rows(iDataIndex).remove().draw(false);


		            		  // 重新添加数据到DataTable，解决index下标错误的问题， 操作步骤，1：先删除第一条数据，第二条时删除不掉
		            		  var tempData = saveEmployeeTable.rows().data();

		            		  saveEmployeeTable.rows().remove().draw(false);

		            		  saveEmployeeTable.rows.add(tempData).draw(false);
		            		  // saveEmployeeTable.rows().add(tempData).draw(false);

		            		  // saveEmployeeTable.ajax.reload(false);
		            	  });

		            	  $(nRow).click(function () {
		            		  if ($(this).hasClass('row_selected')) {
		            			  $(this).removeClass('row_selected');
		            			  $(this).find('td').eq(0).find("input[name='saveEmployeeCheckList']").prop("checked", false)
		            		  } else {
		            			  // employeeTable.$('tr.row_selected').removeClass('row_selected');
		            			  $(this).addClass('row_selected');
		            			  //$("input[name='employeeCheckList']").prop("checked", false);
		            			  $(this).find('td').eq(0).find("input[name='saveEmployeeCheckList']").prop("checked", true)
		            		  }
		            	  });

		              },
		              "oLanguage" : {
		            	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		              }

	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );

	return table;
}

//初始化数据表格
var initEquipmentTable = function ( id ) {
	//com.leanway.checkSession();
	var table = $('#equipmentTables').DataTable( {
		"ajax": '../../../../'+ln_project+'/dispatchingOrder?method=queryEquipment&id=' + id,
		//"iDisplayLength" : "10",
/*		"scrollY": "200px",
	    "scrollCollapse": "true",*/
		'bPaginate': true,
		"bDestory": true,
		"bRetrieve": true,
		"bFilter":false,
		"bSort": false,
		"bProcessing": true,
		"bServerSide": true,
		"bInfo" : true,
		"aoColumns": [
		              {
		            	  "mDataProp": "equipmentid",
		            	  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
//		            		  $(nTd).html("<input type='checkbox' name='employeeCheckList'  value='" + sData + "'>");
		            		  $(nTd)
		            		  .html("<div><input class='regular-checkbox' type='checkbox' id='"
		            				  + sData
		            				  + "' name='equipmentCheckList' value='"
		            				  + sData
		            				  + "'><label for='"
		            				  + sData
		            				  + "'></label></div>");

		            	  }
		              },
		              {"mDataProp": "serialnumber"},
		              {"mDataProp": "equipmentnum"},
		              {"mDataProp": "equipmentname"},
		              {"mDataProp": "barcode"},
		              {"mDataProp": "criticalequipment"}
		              ],
		              "fnCreatedRow": function ( nRow, aData, iDataIndex ) {

		              },
		              "oLanguage" : {
		            	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		              },
		              "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		              "fnDrawCallback" : function(data) {
		            	  	com.leanway.dataTableClick("equipmentTables", "equipmentCheckList", false , equipmentTables);

			            	var data =   equipmentTable.rows().data();
			            	var selectId = "";

			            	if (data != null && data.length == 1) {

			            		selectId = data[0].equipmentid;

			            		com.leanway.setDataTableSelect ("equipmentTables", "equipmentCheckList", selectId);
			            	}

		              }

	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );

	return table;
}

var initViewEmployeeTable = function (id) {
	//com.leanway.checkSession();
	var table = $('#viewEmployeeTables').DataTable( {
		"ajax": '../../../../'+ln_project+'/dispatchingOrder?method=queryEmployees&flag=2&id=' + id,
		'bPaginate': false,
		"bDestory": true,
		"bRetrieve": true,
		"bFilter":false,
		"bSort": false,
		"bProcessing": true,
		"bServerSide": false,
		"aoColumns": [
		              {"mDataProp": "name"},
		              {"mDataProp": "moble"},
		              ],
		              "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
		            	  //add selected class
		              },
		              "oLanguage" : {
		            	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		              }

	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );

	return table;
}

/**
 * 获取选中的数据
 */
var getSelectDataTableData = function ( tableObj, selectIds ) {

	var reg=/,$/gi;

	var jsonData = "[";

	var dataList = tableObj.rows().data();

	if (dataList != undefined && typeof(dataList) != "undefined" && dataList.length > 0) {

		// 循环遍历Table数据
		for (var i = 0; i < dataList.length; i ++) {

			var disData = dataList[i];

			if (selectIds.indexOf(disData.orderid) !=  -1) {
				jsonData += JSON.stringify(disData) + ",";
			}

		}
	}
	jsonData = jsonData.replace(reg,"");

	jsonData += "]";

	return jsonData;
}

/**
 * 保存派工单
 */
var saveDispatchingOrder = function ( ) {
	//com.leanway.checkSession();

	var checkData = com.leanway.getDataTableCheckIds("checkList");

	 if (checkData.length == 0) {

	    	lwalert("tipModal", 1, "请勾选要修改的数据！");
			return;

	    } else {
	    	/*var checkData = com.leanway.getDataTableCheckIds("checkList");

	    	// 选中的派工单数据
	    	var dispatchingOrderData = getSelectDataTableData(dispatchingOrderTable, checkData);
	    	var arr = $.parseJSON(dispatchingOrderData);

	    	for(var i=0;i<arr.length;i++){
	    		if(arr[i].count<arr[i].surplusnumber){
	    			lwalert("tipModal", 1,"修改数量不能小于剩余数量！");
	    			return;
	    		}
	    	}*/

	    	lwalert("tipModal", 2,"确定要修改勾选的数据吗?","isSureZero()");

	    }

}
var isSureZero = function(){
	var checkData = com.leanway.getDataTableCheckIds("checkList");

	// 选中的派工单数据
	var dispatchingOrderData = getSelectDataTableData(dispatchingOrderTable, checkData);

	var formData = "{\"listDispatchingOrder\": "+ dispatchingOrderData + "}";

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "queryIsZero",
			"paramData" : formData
		},
		dataType : "text",
		async : false,
		success : function ( text ) {
			var tjson = $.parseJSON(text);
			if(tjson.status=="error"){
				lwalert("tipModal", 1,tjson.info);
			}else if(tjson.status=="zero"){
				lwalert("tipModal", 2,tjson.info,"isSureSave()");
			}else{
				isSureSave();
			}

		}
	})
}
var isSureSave = function ( )  {

	var checkData = com.leanway.getDataTableCheckIds("checkList");

	// 选中的派工单数据
	var dispatchingOrderData = getSelectDataTableData(dispatchingOrderTable, checkData);

	var formData = "{\"listDispatchingOrder\": "+ dispatchingOrderData + "}";

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "saveDispatchingOrder",
			"paramData" : formData
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

//			alert(text.info);

			var flag =  com.leanway.checkLogind(text);

			if(flag){


				if (text.status == "success") {

					$("#saveFun").attr("disabled", true);
					dispatchingOrderTable.ajax.reload(null,false);

				}else{
					lwalert("tipModal", 1,text.info);
				}
			}
		}
	});

}

var editDispatchingOrderBatch = function ( ) {

	$("#batchstarttime").val("");

	$("#batchTimeModalLabel").html("请选择派工开始时间");
	$('#batchTimeModal').modal({backdrop: 'static', keyboard: false});
	initDateTimeYmdHms("batchstarttime");
}

var batchUpdateDispatchingOrder = function ( ) {

	// 时间
	var batchStartTime = $("#batchstarttime").val();

	var searchConditions = getSearchConditions()
	var strConditions = $.trim(JSON.stringify(searchConditions))

	//&searchValue=" +  + "&orderStatus=" + orderStatus + "&dispatchingstatus=" + dispatchingStatus +"&sqlDatas=" + encodeURIComponent(sqlJson) +"&levels=" + levels + "&searchBom=" + searchBom

	$("#batchUpdateTime").prop("disabled", true);
	$("#batchUpdateTime").html("修改中..请等待！");

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "updateDispatchingOrderBatch",
			"strConditions" : strConditions,
			"batchStartTime" : batchStartTime
		},
		dataType : "json",
		async : true,
		success : function ( text ) {

//			alert(text.info);

			var flag =  com.leanway.checkLogind(text);

			if(flag){


				if (text.status == "success") {

					$('#batchTimeModal').modal("hide");
				//	$("#saveFun").attr("disabled", true);
					dispatchingOrderTable.ajax.reload(null,false);

				}else{
					lwalert("tipModal", 1,text.info);
				}

				$("#batchUpdateTime").prop("disabled", false);
				$("#batchUpdateTime").html("确定");
			}
		}
	});



//	var condition = new Object();
////	condition.productionOrderIds = productionOrderIds;
//	condition.searchValue = searchVal;
//	condition.dispatchingStatusArrays = productionOrderStatus;
//	condition.isSueModeArray = issuemode;
//	condition.orderStatusArrays = modetype;
//	condition.searchBom = searchBom;
//	condition.levels = levels;
//	condition.createCode = createCode;
//
//	// condition.sqlDatas = sqlJson;
//
//	var strCondition = $.trim(JSON.stringify(condition));


}

/**
 * 修改数据 加工数量 和 调整开始时间和调整结束时间
 */
var editDispatchingOrder = function ( ) {
	//com.leanway.checkSession();
	var checkData = com.leanway.getDataTableCheckIds("checkList");

	if (checkData.length == 0) {

//		alert("请选择要修改的派工单!");
	    lwalert("tipModal", 1, "请选择要修改的派工单!");
		return;

	} else {


		$("#saveFun").attr("disabled", false);

		// 把选中的行变成可编辑模式
		$("#dispatchingOrderTable tbody tr").each(function() {

			// 获取该行的下标
			var index = dispatchingOrderTable.row(this).index();
			var dataId = dispatchingOrderTable.rows().data()[index].orderid;

			if (checkData.indexOf(dataId) != -1)  {

//				$(this).find("td:eq(10)").html('<input type="text" class="form-control" style="width: 80px" onblur="setDataTableValue(this, ' + index + ',\'dispatchingOrderTable\')" name="count" id="count' + index + '" value="' + dispatchingOrderTable.rows().data()[index].count + '">');
                //$(this).find("td:eq(8)").html('<input type="text" class="form-control" style="width: 40px" onchange="setDataTableValue(this, ' + index + ',\'dispatchingOrderTable\')" name="count" id="count' + index + '" value="' + dispatchingOrderTable.rows().data()[index].count + '">');

				$("#count" + index).click(function(event) {
					event.stopPropagation();
				});

				// 计划开始时间
				var adjuststarttime = dispatchingOrderTable.rows().data()[index].adjuststarttime;
				if (adjuststarttime == "null"  || adjuststarttime == null) {
					adjuststarttime = "";
				}
//				$(this).find("td:eq(15)").html('<input type="text" class="form-control" style="width: 160px" onblur="setDataTableValue(this, ' + index + ',\'dispatchingOrderTable\')" name="adjuststarttime" id="adjuststarttime' + index + '" value="' + adjuststarttime + '">');
				$(this).find("td:eq(10)").html('<input type="text" class="form-control" style="width: 140px" onchange="setDataTableValue(this, ' + index + ',\'dispatchingOrderTable\')" name="adjuststarttime" id="adjuststarttime' + index + '" value="' + adjuststarttime + '">');

				initDateTimeYmdHms("adjuststarttime" + index);
				$("#adjuststarttime" + index).click(function(event) {
					event.stopPropagation();
				});
				var comments = (dispatchingOrderTable.rows().data()[index].comments==null?"":dispatchingOrderTable.rows().data()[index].comments)
                $(this).find("td:eq(11)").html('<input type="text" class="form-control" style="width: 80px" onchange="setDataTableValue(this, ' + index + ',\'dispatchingOrderTable\')" name="comments" id="comments' + index + '" value="' + comments + '">');
                $("#comments" + index).click(function(event) {
					event.stopPropagation();
				});
				// 计划开始时间
	/*			var adjustendtime = dispatchingOrderTable.rows().data()[index].adjustendtime;
				if (adjustendtime == "null"  || adjustendtime == null) {
					adjustendtime = "";
				}
//				$(this).find("td:eq(16)").html('<input type="text" class="form-control" style="width: 160px" onblur="setDataTableValue(this, ' + index + ',\'dispatchingOrderTable\')" name="adjustendtime" id="adjustendtime' +index  + '"  value="' + adjustendtime + '">');
                $(this).find("td:eq(9)").html('<input type="text" class="form-control" style="width: 140px" onchange="setDataTableValue(this, ' + index + ',\'dispatchingOrderTable\')" name="adjustendtime" id="adjustendtime' +index  + '"  value="' + adjustendtime + '">');

				initDateTimeYmdHms("adjustendtime" + index);

				$("#adjustendtime" + index).click(function(event) {
					event.stopPropagation();
				});*/
			}
		});
		dispatchingOrderTable.columns.adjust();

	}
}

//改变DataTable对象里的值
var setDataTableValue = function( obj, index, tableName ) {
	var tableObj =  $("#" + tableName).DataTable();

	// 获取修改的行数据
	var productor =  tableObj.rows().data()[index];

	// 循环Json key,value，赋值
	for (var item in productor) {

		// 当ID相同时，替换最新值
		if (item == obj.name) {

			productor[item] = obj.value;

		}

	}

	//if (tableName == "productionProductorTable") {
	//$("#expectnumber").val(tableObj.rows().data()[index].number);
	//}

	//alert(tableObj.rows().data()[index].number);
}

/**
 * 替换数据
 */
var updateDispatchingOrder = function ( ) {
	//com.leanway.checkSession();
	if (!hasData) {
//		alert("条码未定义到对应的数据，不能替换！");
	    lwalert("tipModal", 1, "条码未定义到对应的数据，不能替换！");
		return;
	}

	var ids = com.leanway.getDataTableCheckIds("checkList");

	if (ids.length == 0) {

//		alert("请选择要替换的派工单!");
	    lwalert("tipModal", 1, "请选择要替换的派工单!");
		return;

	} else {
        lwalert("tipModal", 2, "确定替换选中的派工单?", "isSureUpdate()");

//		if (confirm("确定替换选中的派工单?")) {
//			ajaxUpdateDispatchingOrder(ids);
//		}

	}

}

function isSureUpdate(){
    var ids = com.leanway.getDataTableCheckIds("checkList");
    ajaxUpdateDispatchingOrder(ids);
}
/**
 * 修改替换
 */
var ajaxUpdateDispatchingOrder = function ( ids ) {
	//com.leanway.checkSession();
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "updateDispatchingOrder",
			"ids" : ids,
			"id" : id,
			"parentId" : parentId,
			"type" : type
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

//				alert(text.info);
			    lwalert("tipModal", 1, text.info);

				if (text.status == "success") {

					dispatchingOrderTable.ajax.reload(null,false);

				}
			}
		}
	});

}


/**
 * 查询条码
 */
var queryBarCode = function ( ) {

	var barCode = $("#searchBarCode").val();

	if($.trim(barCode) == "") {
		hasData = false;
		id = "";
		parentId = "";
		type = "";
		$("#msgInfo").html("");
		return;
	}

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "queryBarCode",
			"barCode" : barCode
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				if (text.status == "error") {
					hasData = false;
					id = "";
					parentId = "";
					type = "";
//					alert(text.info);
					lwalert("tipModal", 1, text.info);

				} else if (text.status == "success") {

					if (text.data == null) {
						hasData = false;
						id = "";
						parentId = "";
						type = "";
						$("#msgInfo").html("条码未定义，查询不到数据！");
					} else {

						// 该条码是设备台帐的情况下
						if (text.type == "1") {

							hasData = true;
							id =  text.data.equipmentid;
							parentId = text.data.centerid;
							type = 1;
							var  info = " 设备台帐：" + text.data.equipmentname + "    工作中心：" +  text.data.centername;
							$("#msgInfo").html(info);

						} else if (text.type == "2") {

							hasData = true;
							id =  text.data.ledgerid;
							parentId = text.data.mouldsid;
							type = 2;
							var  info = " 模具台帐：" + text.data.ledgername + "    模具：" +  text.data.mouldname;
							$("#msgInfo").html(info);

						} else if (text.type == "3") {

							type = 3;
							hasData = true;
							id =  text.data.employeeid;
							parentId = text.data.name;
							var  info = " 雇员：" + text.data.name
							$("#msgInfo").html(info);

						}

					}

				}

			}
		}
	});


}

/**
 * 检查派工单是否有相关的追踪单相关
 */
var checkDispatchingOrderHaveTrack = function(type){

	var searchConditions = getSearchConditions()
	var strConditions = $.trim(JSON.stringify(searchConditions))

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "dispatchingOrderTable", "checkList");

	if(type!=3){//非条件删除，判断是否有勾选数据

		if (ids.length == 0) {

			lwalert("tipModal", 1, "请选择要删除的派工单!");
			return;

		}
	}

		$.ajax ( {
			type : "post",
			url : "../../../../"+ln_project+"/dispatchingOrder",
			data : {
				"method" : "checkDispatchingOrderHaveTrack",
				"ids" : ids,
				"strConditions" : strConditions,
				"deleteType": type
			},
			dataType : "json",
			async : true,
			success : function ( text ) {

				var flag =  com.leanway.checkLogind(text);

				if(flag){

//					alert(text.info);

					if (text.status == "success") {

						//检查结果：派工单有追踪单
						if(text.orderNumber != undefined && typeof(text.orderNumber) != "undefined"){

							if(type != 3){//非条件 删除

								var msg = text.orderNumber+"已生成追踪单，确认删除？";
								lwalert("tipModal", 2, msg , "isSureDelete(" + type + ")");

							}else{//条件 删除

								var msg = "根据条件删除的派工单中"+text.orderNumber+"已生成追踪单，确认删除？";
								lwalert("tipModal", 2, msg ,"isSuredeleteDispatchingOrderByCondition()");

							}
						//检查结果：派工单无追踪单
						}else{

							if(type != 3){//非条件删除

								var msg = "确定删除选中的" + ids.split(",").length + "条派工单?";
								lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");

							}else{//条件 删除

								var msg ="确定要根据条件进行删除?";
								lwalert("tipModal", 2, msg ,"isSuredeleteDispatchingOrderByCondition()");

							}

						}

					}else{
						lwalert("tipModal", 1, text.info);
					}

				}

			}
		});




}

/**
 * 删除派工单
 */
var deleteDispatchingOrder = function ( type ) {

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "dispatchingOrderTable", "checkList");

	if (ids.length == 0) {

		lwalert("tipModal", 1, "请选择要删除的派工单!");
		return;

	} else {

		var msg = "确定删除选中的" + ids.split(",").length + "条派工单?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	}

}

function isSureDelete( type ){

	var ids = com.leanway.getCheckBoxData(type, "dispatchingOrderTable", "checkList");

     ajaxDeleteDispatchingOrder(ids);
}

/**
 * 删除派工单
 */
var ajaxDeleteDispatchingOrder = function ( ids ) {

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "deleteDispatchingOrder",
			"ids" : ids
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

//				alert(text.info);
			    lwalert("tipModal", 1, text.info);

				if (text.status == "success") {

					com.leanway.clearTableMapData( "dispatchingOrderTable" );

					dispatchingOrderTable.ajax.reload(null,false);

				}

			}

		}
	});

}

/**
 * 查询派工单
 */
var queryDispatchingOrder = function ( ) {

	com.leanway.clearTableMapData("dispatchingOrderTable");

	var searchCondition = getSearchConditions();
//	console.info(searchCondition);
	var strCondition = encodeURIComponent($.trim(JSON.stringify(searchCondition)));

	dispatchingOrderTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryDispatchingOrder&strCondition=" + strCondition).load();
}

/**
 * 查看雇员
 */
var viewEmployee = function ( orderId ) {

	// 弹出modal
	$('#veiwEmployeeModal').modal({backdrop: 'static', keyboard: true});

	if (viewEmployeeTable == null || viewEmployeeTable == "undefined" || typeof(viewEmployeeTable) == "undefined") {
		viewEmployeeTable =	initViewEmployeeTable(orderId);

	} else {
		viewEmployeeTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryEmployees&flag=2&id=" + orderId).load();
	}


}

var initDispatchingOrder = function ( ) {
	console.log(condition);
	var table = $('#dispatchingOrderTable').DataTable( {
		"ajax": "../../../../"+ln_project+"/dispatchingOrder?method=queryDispatchingOrder"  +condition ,
		/*"iDisplayLength" : "10",*/
		'bPaginate': true,
		"bDestory": true,
		"bRetrieve": true,
		"bFilter":false,
		"scrollX":true,
		"scrollY": tableHeight,
		"bSort": true,
		"bProcessing": true,
		"bServerSide": true,
		"columnDefs": [
		               { orderable: false,targets: [0]},
		               { orderable: false,targets: [1]},
		               { orderable: false,targets: [3]},
		               { orderable: false,targets: [4]},
		               { orderable: false,targets: [6]},
		               { orderable: false,targets: [7]},
		               { orderable: false,targets: [10]}
		               ],
		               "aoColumns": [


                                     {
                                         "mDataProp": "orderid",
                                         "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
//                                           $(nTd).html("<input type='checkbox' name='checkList'  value='" + sData + "'>");
                                             $(nTd)
                                             .html("<div id='stopPropagation" + iRow +"'>"
                                                     +"<input class='regular-checkbox' type='checkbox' id='"
                                                     + sData
                                                     + "' name='checkList' value='"
                                                     + sData
                                                     + "'><label for='"
                                                     + sData
                                                     + "'></label>");
                                             com.leanway.columnTdBindSelectNew(nTd,"dispatchingOrderTable","checkList");
                                         }
                                     },
		                             {"mDataProp" : "dispatchingnumber",
	                            	  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
	                            		 $(nTd).html(sData + "/" + oData.productionnumber);
	                            	   }
		                             },
		                             {"mDataProp" : "productionchildsearchno"},
		                             {"mDataProp" : "productorname"},
		                             {"mDataProp" : "productordesc"},
		                             {"mDataProp" : "drawcode",
	                            	  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                            			 $(nTd).html(sData + "/" + oData.material);
	                            	  } 
		                             },
		                             {"mDataProp" : "line",
		                            	 "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
		                            		 
		                            		var procedurename = oData.procedurename == null ? "" : oData.procedurename;
		                            				 
		                            		 $(nTd).html(sData + "/" + procedurename);
		                            	   }
		                             },
		                             {"mDataProp" : "equipmentname"},
		                         /*    {"mDataProp" : "productionnumber"},*/
//		                             {"mDataProp": "centername"},
//		                             {"mDataProp": "equipmentname"},
//		                             {"mDataProp": "mouldname"},
//		                             {"mDataProp": "ledgername"},
		                             {
		                            	 "mDataProp": "employeename",
		                            	 "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {

		                            		 if (sData != "false") {
		                            			 $(nTd).html("<a  style=\"cursor:pointer;\" onclick=\"viewEmployee('" + sData + "');\"  id=\"viewEmployee" + iRow+ "\">查看</a>");
		                            		 } else {
		                            			 $(nTd).html("");
		                            		 }

		                            	 }
		                             },
		                             {"mDataProp": "count",
		                            	 "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
		                            		 $(nTd).html(sData + "/" + oData.surplusnumber);
		                            	 }
		                             },

		                             {"mDataProp": "adjuststarttime",
		                            	 "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
		                            		 $(nTd).html(sData + "</br>" + oData.adjustendtime);
		                            	 }
		                             },
		                             {"mDataProp": "comments"},
		                             {"mDataProp": "rubber"}
//		                             {"mDataProp": "split",
//		                            	 "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
//		                            		  
//		                            		 if (sData == "true") {
//		                            			 $(nTd).html("<a  style='cursor:pointer;' onclick='viewSplitOrder(" + iRow + ");'  id='viewSplitOrder" + iRow+ "'>查看</a>");
//		                            		 }
//		                            		
//		                            	 }
//		                             }
		                             ],
		                             "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
		                            	 //alert(aData.productionnumber);
		                             },
		                             "oLanguage" : {
		                            	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		                             },
		                             "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		                             "fnDrawCallback" : function(data) {


		                            	 com.leanway.setDataTableColumnHide("dispatchingOrderTable");
		                            		$("#saveFun").attr("disabled", true);

		                            	 var length = dispatchingOrderTable.rows().data().length;

		                            	 if (length > 0) {
		                            		 for (var i = 0; i < length; i ++) {
		                            			 $("#viewEmployee" + i).click(function(event) {
		                            				 event.stopPropagation();
		                            			 });
		                            		 }
		                            	 }
		                            	 //alert(data.productionnumber);
		                            	 //com.leanway.dataTableClick("generalInfo","checkList",true,oTable,ajaxLoadProductionObject,undefined,undefined);
		                            	 //	com.leanway.dataTableClick ("dispatchingOrderTable", "checkList", true, dispatchingOrderTable);
		                            	 com.leanway.dataTableUnselectAll("dispatchingOrderTable","checkAll");
		                            	 com.leanway.setDataTableSelectNew("dispatchingOrderTable",
	                                              null, "checkList", null);
		                             }

	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
		table.columns.adjust();
	} );

	return table;
}

var getDataTableData = function ( tableObj ) {
	var jsonData = "[";

	var dataList = tableObj.rows().data();

	if (dataList != undefined && typeof(dataList) != "undefined" && dataList.length > 0) {

		// 循环遍历Table数据
		for (var i = 0; i < dataList.length; i ++) {

			var productorData = dataList[i];

			jsonData += JSON.stringify(productorData) + ",";

		}
	}
	jsonData = jsonData.replace(reg,"");

	jsonData += "]";

	return jsonData;
}

/**
 *
 * 条形码打印
 *
 */
function generateBarcode(){


	// 获取选中的数据
	var data =  dispatchingOrderTable.rows('.row_selected').data()[0];

	var value = "";
	var dispatchingnumberPrint = "";

	if (data == undefined || typeof(data) == "undefined") {
	    lwalert("tipModal", 1, "请选择数据!");
	    return;
	} else {
		value = data.barcode;
		dispatchingnumberPrint = data.dispatchingnumber;
	}

	var btype = "code128";
	var renderer = "css";
	var settings = {
			output:"css",
			bgColor: "#FFFFFF",
			color: "#000000",
			barHeight: "50" ,
			moduleSize: "5",
			posX: "10",
			posY: "20",
			addQuietZone: "1"
	};
	if (renderer == 'canvas'){
		clearCanvas();
		$("#barcodeTarget").hide();
		$("#canvasTarget").show().barcode(value, btype, settings);
	} else {
		$("#canvasTarget").hide();
		$("#barcodeTarget").html("").show().barcode(value, btype, settings);
		$("#viewClient").html(dispatchingnumberPrint);
	}

	$("#myModal").modal("show");
}
//清除模态框
function clearCanvas(){
	var canvas = $('#canvasTarget').get(0);
	var ctx = canvas.getContext('2d');
	ctx.clearRect (0, 0, canvas.width, canvas.height);
	ctx.strokeRect (0, 0, canvas.width, canvas.height);
}
//打印机打印
function printBarcode(){
	retainAttr=true;
	$("#printdiv").printArea();
}

//点击事件触发
var createBarCode =function(orderId){

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "queryDispatchingOrderData",
			"orderId" : orderId
		},
		dataType : "json",
		async : false,
		success : function ( text ) {
			//	$("#barCode").val(1234);
			var flag =  com.leanway.checkLogind(text);

			if(flag){

				$("#barCode").val(text.barcode);
				$("#dispatchingnumberPrint").val(text.dispatchingnumber);

			}
		}
	});

}

var clearBarCode = function ( ) {
	$("#barCode").val("");
}


function confirmtime(){
	var optimizestarttime = $("#optimizestarttime").val();

	if(optimizestarttime==null||optimizestarttime==""){
	    lwalert("tipModal", 1, "请选择时间");
		return;
	}else{
		$("#timeModal").modal("hide");
		send(optimizestarttime);
	}
}


/**
 * 生成派工单
 */
var optimizeDispatchingOrder = function( ) {

	$("#timeModalLabel").html("请选择派工开始时间");
	$('#timeModal').modal({backdrop: 'static', keyboard: false});
	initTimePickYmd("optimizestarttime");


}


var send = function(optimizestarttime){
	$("#optimizeDispatchingOrder").prop("disabled", true);
	$("#optimizeDispatchingOrder").html("优化中...请等待！");

	 $("#progressInfo").html("0%");
	 $("#progressBarDiv").css("width" , "0%");
	 $("#progressDiv").show();
	 $("#orderInfo").hide();

	 var myData = new Date();
	 createCode = myData.getTime() + generateMixed(5) ;

	 setTimeout(function () {
		 readDispatchingOrderProgress();

	 }, 2000);

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "optimizeDispatchingOrder",
			"optimizestarttime" : optimizestarttime,
			"createCode" : createCode
		},
		dataType : "json",
		/*async : false,*/
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				lwalert("tipModal", 1, text.info);

				dispatchingOrderTable.ajax.reload();

				$("#optimizeDispatchingOrder").prop("disabled", false);
				$("#optimizeDispatchingOrder").html("优化派工");
			}

		},
		error: function(){

			$("#optimizeDispatchingOrder").prop("disabled", true);
			$("#optimizeDispatchingOrder").html("优化派工");

		}

	});

}


/**
 * 高级查询导出派工单
 */
var exportDispatchingOrder = function ( ) {

	com.leanway.clearTableMapData("dispatchingOrderTable");

	var searchConditions = getSearchConditions()
	var strConditions = encodeURIComponent($.trim(JSON.stringify(searchConditions)));

	window.location.href = "../../../../"+ln_project+"/dispatchingOrder?method=dowloadExcel&strConditions=" + strConditions ;

	/*$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "dowloadExcel",
			"strConditions" :strConditions
		},
		dataType : "text",
		async : false,
		success : function ( data ) {
			var flag =  com.leanway.checkLogind(data);

			if(flag){

			 window.location.href = "../../../../"+ln_project+"/dispatchingOrder?method=dowloadExcel&searchValue=" + searchVal + "&orderStatus=" + orderStatus + "&dispatchingstatus=" + dispatchingStatus +"&sqlDatas=" + encodeURIComponent(sqlJson) +"&levels=" + levels + "&searchBom=" + searchBom;
		     lwalert("tipModal", 1,"导出成功！");

			}

		},
		error: function(){
			 lwalert("tipModal", 1, "导出失败!请重新导出!");

		}
 });*/
}


/**
 * 导出派工单
 */
var exportAdvancedDispatchingOrder = function ( jsonData ) {

	com.leanway.clearTableMapData("dispatchingOrderTable");

	var dispatchingStatus =  $('input[name="dispatchingstatus"]:checked').val();

	var orderStatus =  $('input[name="virtual"]:checked').val();

	var searchVal = $("#searchValue").val();
	var bomStatus =  $('input[name="bomstatus"]:checked').val();

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "dowloadExcel",
			"searchValue":searchVal,
			"orderStatus":orderStatus,
			"dispatchingstatus":dispatchingStatus,
			"bomstatus":bomstatus

		},
		dataType : "text",
		/*async : false,*/
		success : function ( data ) {
			var flag =  com.leanway.checkLogind(data);

			if(flag){

					 window.location.href = "../../../../"+ln_project+"/dispatchingOrder?method=dowloadExcel&searchValue=" + searchVal + "&orderStatus=" + orderStatus +"&sqlDatas=" + encodeURIComponent(jsonData) + "&dispatchingstatus=" + dispatchingStatus+"&bomstatus="+bomStatus;
					 lwalert("tipModal", 1,"导出成功！");

			}

		},
		error: function(){

			lwalert("tipModal", 1, "导出失败!请重新导出!");
		}
 });
}


/**
 * id: 为要操作的对象 url: url text: 要在select中显示的文本
 */
function initSelect2(id, url, text) {

	$(id).select2({
		placeholder : text,
		allowClear: true,
		language : "zh-CN",
		multiple: true,
		ajax : {
			url : url,
			dataType : 'json',
			delay : 250,
			data : function(params) {
				return {
					q : params.term, // search term
					page : params.page,
					//pageSize : 200
				};
			},
			processResults : function(data, params) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					params.page = params.page || 1;
					return {
						results : data.items,
						pagination : {
							more : (params.page * 30) < data.total_count
						}

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

var returnDafaulttime = function(){
	
	var msg ="确定要根据条件恢复派工单默认时间?";
	lwalert("tipModal", 2, msg ,"excuseReturnDafaulttime()");

}

var excuseReturnDafaulttime = function ( ) {
	
	$("#returnDafaulttime").prop("disabled", true);
	$("#returnDafaulttime").html("恢复中");

	var searchCondition = getSearchConditions();
	var strCondition = $.trim(JSON.stringify(searchCondition));

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "returnDafaulttime",
			"strConditions" : strCondition
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				lwalert("tipModal", 1, text.info);

				dispatchingOrderTable.ajax.reload();

				$("#returnDafaulttime").prop("disabled", false);
				$("#returnDafaulttime").html("恢复默认时间");
			}

		},
		error: function(){

			$("#returnDafaulttime").prop("disabled", true);
			$("#returnDafaulttime").html("恢复默认时间");

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

var readDispatchingOrderProgress = function ( ) {

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
					$("#progressInfo").html( data.progressBar+ "：" + data.orderCode );

					var msg = "派工单号 : "+ data.orderCode + ", 产品编码：" + data.productorname + ", 工序： " + data.procedurename +",已执行(s)：" + data.excTime;

					$("#orderInfo").html(msg);

					setTimeout(function () {
						readDispatchingOrderProgress();

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
						$("#optimizeDispatchingOrder").prop("disabled", false);
						$("#optimizeDispatchingOrder").html("优化派工");
					}
				}

			}

		},
		error : function () {

		}
	});

}

function deleteDispatchingOrderByCondition(){
	var msg ="确定要根据条件进行删除?";
	lwalert("tipModal", 2, msg ,"isSuredeleteDispatchingOrderByCondition()");
}

/**
 * 根据查询条件进行删除
 */
function isSuredeleteDispatchingOrderByCondition() {

	var searchConditions = getSearchConditions()
	var strConditions = $.trim(JSON.stringify(searchConditions))

	//删除
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "deleteDispatchingOrderByCondition",
			"strConditions" : strConditions
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

//			alert(text.info);

			var flag =  com.leanway.checkLogind(text);

			if(flag){


				if (text.status == "success") {
					com.leanway.clearTableMapData( "dispatchingOrderTable" );
				//	$("#saveFun").attr("disabled", true);
					lwalert("tipModal", 1,"删除成功");
					dispatchingOrderTable.ajax.reload(null,false);

				}else{
					lwalert("tipModal", 1,text.info);
				}
			}
		}
	});

}

//加载所有的产品种类
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

var getSearchConditions = function (  ) {

	var sqlJsonArray = new Array()

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
	var searchBom =  $('input[name="searchBom"]:checked').val();

	// 子查询号
	var productionChildSearchNo = $("#productionchildsearchno").val();
	if (productionChildSearchNo != null && productionChildSearchNo != "" && typeof(productionChildSearchNo) != "undefined" && productionChildSearchNo != undefined) {
		productionChildSearchNo = productionChildSearchNo.toString();
	}

	// 产品类型
	var productorTypeId = $("#productorTypeId").val();

	if (productorTypeId != null && productorTypeId != "" && typeof(productorTypeId) != "undefined" && productorTypeId != undefined) {
		productorTypeId = productorTypeId.toString();
	}

	// 开始时间
	var adjustStartTime = $("#adjuststarttime").val();

	// 结束时间
	var adjustEndTime = $("#adjustendtime").val();

	// 工作组
	var groupName = $("#groupname").val();

	// 工序
	var procedureShortName = $("#procedureshortname").val();
	//材料规格
	var material = $("#material").val();

	// 工单状态
	var dispatchingStatus = com.leanway.getDataTableCheckIds("dispatchingstatus");

	// 下料订单
	var orderStatus =  com.leanway.getDataTableCheckIds("virtual");
	var bomStatus = com.leanway.getDataTableCheckIds("bomstatus");

	// 关键字
	var searchVal = $("#searchValue").val();

	if ($.trim(productionChildSearchNo) != "") {

		var searchNoObj = new Object();
		searchNoObj.fieldname = "dco.productionchildsearchno";
		searchNoObj.fieldtype = "varchar_select2";
		searchNoObj.value = productionChildSearchNo;
		searchNoObj.logic = "and";
		searchNoObj.ope = "in";

		sqlJsonArray.push(searchNoObj);
	}

	if ($.trim(productorTypeId) != "") {

		var productorTypeIdObj = new Object();
		productorTypeIdObj.fieldname = "productorTypeId";
		productorTypeIdObj.fieldtype = "varchar_select2";
		productorTypeIdObj.value = productorTypeId;
		productorTypeIdObj.logic = "and";
		productorTypeIdObj.ope = "in";

		sqlJsonArray.push(productorTypeIdObj);
	}

	if ($.trim(adjustStartTime) != "") {

		var adjustStartTimeObj = new Object();
		adjustStartTimeObj.fieldname = "dco.adjuststarttime";
		adjustStartTimeObj.fieldtype = "datetime";
		adjustStartTimeObj.value = adjustStartTime;
		adjustStartTimeObj.logic = "and";
		adjustStartTimeObj.ope = ">=";

		sqlJsonArray.push(adjustStartTimeObj);
	}

	if ($.trim(adjustEndTime) != "") {

		var adjustEndTimeObj = new Object();
		adjustEndTimeObj.fieldname = "dco.adjuststarttime";
		adjustEndTimeObj.fieldtype = "datetime";
		adjustEndTimeObj.value = adjustEndTime;
		adjustEndTimeObj.logic = "and";
		adjustEndTimeObj.ope = "<=";

		sqlJsonArray.push(adjustEndTimeObj);
	}

	if ($.trim(groupName) != "") {

		var groupNameObj = new Object();
		groupNameObj.fieldname = "wcg.shortname";
		groupNameObj.fieldtype = "varchar";
		groupNameObj.value = groupName;
		groupNameObj.logic = "and";
		groupNameObj.ope = "like";

		sqlJsonArray.push(groupNameObj);
	}

	if ($.trim(procedureShortName) != "") {
		sqlJson += "{\"fieldname\":\"dco.procedurename\",\"fieldtype\":\"varchar\",\"value\":\""+ procedureShortName + "\",\"logic\":\"and\",\"ope\":\"like\"},";
		var procedureShortNameObj = new Object();
		procedureShortNameObj.fieldname = "dco.procedurename";
		procedureShortNameObj.fieldtype = "varchar";
		procedureShortNameObj.value = procedureShortName;
		procedureShortNameObj.logic = "and";
		procedureShortNameObj.ope = "like";
		sqlJsonArray.push(procedureShortNameObj);
	}
	if ($.trim(material) != "") {
		sqlJson += "{\"fieldname\":\"ppd.material\",\"fieldtype\":\"varchar\",\"value\":\""+ material + "\",\"logic\":\"and\",\"ope\":\"=\"},";
		var materialObj = new Object();
		materialObj.fieldname = "ppd.material";
		materialObj.fieldtype = "varchar";
		materialObj.value = material;
		materialObj.logic = "and";
		materialObj.ope = "=";
		sqlJsonArray.push(materialObj);
	}

	var condition = new Object();
	condition.searchValue = $.trim(searchVal);
	condition.orderStatusArrays = orderStatus;
	condition.dispatchingStatusArrays = dispatchingStatus;
	condition.searchBom = searchBom;
	condition.levels = levels;
	condition.sqlDatas = sqlJsonArray;
	condition.bomstatus = bomStatus

	return condition;
}
/**
 * 获取当前月的第一天
 */
function getCurrentMonthFirst(){
 var date=new Date();
 date.setDate(1);
 return date.Format("yyyy-MM-dd");
}
/**
 * 获取当前月的最后一天
 */
function getCurrentMonthLast(){
 var date=new Date();
 var currentMonth=date.getMonth();
 var nextMonth=++currentMonth;
 var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
 var oneDay=1000*60*60*24;
 return new Date(nextMonthFirstDay-oneDay).Format("yyyy-MM-dd");
}
function exportDispatchingOrderMonth(){
	$("#exportModal").modal("show");
	initTimePickYmd("exportstarttime");
	initTimePickYmd("exportendtime");
	$("#exportstarttime").val(getCurrentMonthFirst());
	$("#exportendtime").val(getCurrentMonthLast());
}

function downloadDispatchingOrder(){
	var starttime = $("#exportstarttime").val();
	var endtime = $("#exportendtime").val();
	if(starttime!=''&&endtime!=''){
	    window.location.href = "../../../../"+ln_project+"/dispatchingOrder?method=downloadDispatchingOrder&starttime=" + starttime + "&endtime=" + endtime;
	    $("#exportModal").modal("hide");
	}else{
		lwalert("tipModal", 1,"请输入开始时间和结束时间");

	}

}

var getDispatchingOrderException = function ( ) {
	
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/codeMap",
		data : {
		    method : "queryCodeMapList",
            "t" : "dispatchingorder",
            "c" : "exceptionreason"
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
				
				var html = "";
				for ( var i in data) {
					html += "<option value=" + data[i].codemapid + ">" + data[i].codevalue+ "</option>";
				}
 
				$("#exceptionid").html(html);
				$("#exexceptionid").html(html);
				
				 $("#exexceptionid").select2({
				    	placeholder : "异常类型(可多选)",
				        tags: false,
				        language : "zh-CN",
				        allowClear: true,
				        maximumSelectionLength: 5  //最多能够选择的个数
				    });
			}
		},
		error : function(data) {

		}
	});
	
}


//查询时间单位下拉框数据
function queryInitTimeUnits() {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/units",
		data : {
		    method : "queryUnitsByUnitsTypeId",
            "unitsTypeId" : "时间单位"
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
				
				var unData = data.timeUnitsResult;
 
				var html = "";
				
				for ( var i in unData) {
					// 拼接option
					html += "<option value=" + unData[i].unitsid + ">" + unData[i].unitsname+ "</option>";
				}

				$("#timeunits").html(html);
				$("#exmodaltimeunits").html(html);
			}
		},
		error : function(data) {

		}
	});
}

var loadOrderException = function ( id ) {
	
	 com.leanway.formReadOnly("exceptionForm", readonly);
	 
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/dispatchingOrder",
		data : {
		    method : "loadOrderException",
            "orderexceptionid" : id
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
				
				 for (var item in data) {
				
					 
					 if (item == "audituser") {
						 var strAudituser = data[item];
					 
						 var userArray = new Array();
						 
						 if (strAudituser != null && strAudituser != "" && typeof(strAudituser) != "undefined" && strAudituser != "()") {
							 
							 var audituserHtml = "";
							 
							 var strAudituserArray =  strAudituser.split(",");
							 
							 for (var i = 0;i < strAudituserArray.length; i++) {
								 userArray.push(strAudituserArray[i]);
								 audituserHtml +="<option value="+ strAudituserArray[i]+">"+strAudituserArray[i] +"</option>";
							 }
							 
							 $("#audituser").html(audituserHtml);
						 
							 $("#exceptionForm #audituser").select2("val", userArray);
							 
						 } else {
							 $("#exceptionForm #audituser").select2("val", "");
						 }
						
						
						 
					 } else {
						 $("#exceptionForm #" + item).val(data[item]);
					 }
				  }
				
			}
		},
		error : function(data) {

		}
	});
	
}

var addException = function ( ) {
	
	 com.leanway.dataTableUnselectAll("exceptionTable","exceptionCheckList","exceptionCheckList");
	  $('#exceptionForm').each(function (index) {
	        $('#exceptionForm')[index].reset();
  	  });
	  
	  $("#exceptionForm #orderid").val($("#disorderid").val());
	  
	com.leanway.removeReadOnly("exceptionForm",  [{"id":"saveException","type":"button"}]);
	//com.leanway.formReadOnly("",  [{"id":"comments","type":"textarea"}]);
	
	// 清空审核人
	 $("#exceptionForm #audituser").select2("val", "");
	 
	// 把工单班组赋值
	var centername = dispatchingOrderTable.rows('.row_selected').data()[0].personcentername;
	var dispatchingnumber = dispatchingOrderTable.rows('.row_selected').data()[0].dispatchingnumber;
	 
	$("#cuserworkcenter").val(centername);
	$("#dispatchingnumber").val(dispatchingnumber);
	
	$("#comments").prop("readonly", true);
	$("#opinion").prop("readonly", true);
}

var exceptionOrder = function ( ) {
	
	var value = com.leanway.getDataTableCheckIds("checkList");

	var values = value.split(",");
	if ( value == "" ) {

	    lwalert("tipModal", 1, "请选择派工单设置异常!");
		return;
	} else if (values.length > 1){

	    lwalert("tipModal", 1, "请选择一条派工单设置异常！");
		return;
	} else { 
		
		  $('#exceptionForm').each(function (index) {
		        $('#exceptionForm')[index].reset();
	  	  });
		
		$("#exceptionForm #audituser").select2("val", "");
		  
		$("#disorderid").val(value);
		$("#orderid").val(value);
		
		var searchCondition = new Object();
		searchCondition.orderids = value;
		
		var strCondition = encodeURIComponent($.trim(JSON.stringify(searchCondition)));
		
		dispatchingOrderException.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryDispatchingOrderException&strCondition=" + strCondition).load();
		
		$('#exceptionModal').modal({backdrop: 'static', keyboard: true});
	}
	
}

var saveException = function ( ) {
	var form  = $("#exceptionForm").serializeArray();
	 
	var formData = formatExceptionFormJson(form);
	
//	var audituser = $("#audituser").val();
//	if (audituser != null && audituser != "" && typeof(audituser) != "undefined" && audituser != undefined) {
//		audituser = audituser.toString();
//		
//		var arrayaudituser = audituser.split(",");
//		
//		if (arrayaudituser.length > 1) {
//			 lwalert("tipModal", 1, "请选择一个审核人！");
//			return;
//		}
//	} else {
//	   lwalert("tipModal", 1, "请选择一个审核人！");
//		return;
//	}
	 
	//var orderid = com.leanway.getDataTableCheckIds("checkList");
	
    $.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			method : "saveException",
			formData: formData
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				if (data.status == "error") {
					lwalert("tipModal", 1,data.info);
				} else {
					com.leanway.formReadOnly("exceptionForm", readonly);
		 
					dispatchingOrderException.ajax.reload();
					 
					//$('#exceptionModal').modal("hide");
				}

			}
		},
		error : function(data) {
			lwalert("tipModal", 1,"保存失败");
		}
	});
}


//格式化form数据
var  formatExceptionFormJson = function  (formData) {

	var reg=/,$/gi;

	var data = "{";

	for (var i = 0; i < formData.length; i++) {

		var val = formData[i].value;

		data += "\"" +formData[i].name +"\" : \""+val+"\",";

	}

	data = data.replace(reg,"");

	data += "}";
	
	//console.log(data);
	
	var exFormData = eval ("(" + data+")");

	var audituser = $("#audituser").val();
	if (audituser != null && audituser != "" && typeof(audituser) != "undefined" && audituser != undefined) {
		audituser = audituser.toString();
	}
	
	exFormData.audituser = audituser;
	
	return JSON.stringify(exFormData);
}

//格式化form数据
var  formatFormJson = function  (formData) {

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
var iscalculateToName = function ( status ) {
	var result = "";

	switch (status) {
	case 0:
		result = "是";
		break;
	case 1:
		result = "否";
		break;

	}
	return result;
}

var exceptionstatusToName = function ( status ) {
	var result = "";

	switch (status) {
	case 0:
		result = "正常";
		break;
	case 2:
		result = "警告";
		break;
	case 3:
		result = "异常";
		break;
	}
	return result;
}

var beencalculateToName = function ( status ) {
	var result = "";

	switch (status) {
	case 0:
		result = "未调";
		break;
	case 1:
		result = "已调";
		break;

	}
	return result;
}
function setOrderPriority(){
	var orderid = com.leanway.getDataTableCheckIds("checkList");
	var values = orderid.split(",");
	$("#production").val("");
	$("#sale").val("");
	$("#purchase").val("");
	if(values.length==1&&orderid!=""){
		$.ajax({
			type : "post",
			url : "../../../../"+ln_project+"/dispatchingOrder",
			data : {
				method : "queryDispatchingOrderData",
				"orderId" : orderid
			},
			dataType : "json",
			success : function(data) {
	
				var flag =  com.leanway.checkLogind(data);
	
				if ( flag ) {
					$("#production").val(data.production);
					$("#sale").val(data.sale);
					$("#purchase").val(data.purchase);

				}
			},
			error : function(data) {
				lwalert("tipModal", 1,"操作失败");
			}
		});
	}else if (orderid=="" ){
	    lwalert("tipModal", 1, "请选择派工单进行修改!");
	    return;
	}
	$('#productionModal').modal({backdrop: 'static', keyboard: true});
}

function updateProductorSalePurchase(){
	var orderid = com.leanway.getDataTableCheckIds("checkList");
	var production = $("#production").val();
	var sale = $("#sale").val();
	var purchase = $("#purchase").val();
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			method : "updateProductorSalePurchase",
			"orderId" : orderid,
			"production":production,
			"sale":sale,
			"purchase":purchase
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
				if(data.status=="success"){
					$('#productionModal').modal("hide");
				}
				lwalert("tipModal", 1,data.info);
			}
		},
		error : function(data) {
			lwalert("tipModal", 1,"操作失败");
		}
	});
}

var exceptionOrderCalculate = function ( type  ) {
	
	var orderid = "";
	var orderexceptionid = "";
	var executeExceptionData = "";
	var isCalculate = false;
	
	// 在新增异常界面进行优化【按钮被隐藏】
	if ( type == 1) {
		
		orderid = com.leanway.getDataTableCheckIds("checkList");
		orderexceptionid = com.leanway.getDataTableCheckIds("exceptionCheckList");
		
		if (orderid == "") {
			orderid = $("#orderid").val();
		}
		
		var values = orderid.split(",");
		
		if ( values == "" ) {
	
		    lwalert("tipModal", 1, "请选择派工单进行异常操作!");
			return;
		} else if (values.length > 1){
	
		    lwalert("tipModal", 1, "请选择一条派工单进行异常操作！");
			return;
		} else {
			isCalculate = true;
		}
	
		// 选中异常快速优化
	} else if (type == 2) {
		
		orderexceptionid =  com.leanway.getDataTableCheckIds("allExceptionCheckList");
		
		if (orderexceptionid == "") {
			  lwalert("tipModal", 1, "请选择异常进行优化操作！");
				return;
		} else {
			isCalculate = true;
		}
		
	} else if ( type == 3) {
		// 选中异常填写处理意见优化
		var form  = $("#executeExceptionModalForm").serializeArray();
		executeExceptionData = formatFormJson(form);
		orderexceptionid =  com.leanway.getDataTableCheckIds("allExceptionCheckList");
		isCalculate = true;
	}

	if (isCalculate) {
		
		$.ajax({
			type : "post",
			url : "../../../../"+ln_project+"/dispatchingOrder",
			data : {
				method : "exceptionOrderCalculate",
				"orderid" : "",
				"orderexceptionid" : orderexceptionid,
				"executeExceptionData" : executeExceptionData
			},
			dataType : "json",
			success : function(data) {

				var flag =  com.leanway.checkLogind(data);

				if ( flag ) {

					if (data.status == "error") {
						lwalert("tipModal", 1,data.info);
					} else {
						
						if ( type == 1) {
							allExceptionTable.ajax.reload();
						}  else if ( type == 2) {
							allExceptionTable.ajax.reload();
						}else if ( type == 3) {
							allExceptionTable.ajax.reload();
							$("#executeExceptionModal").modal("hide");
						}
						//dispatchingOrderTable.ajax.reload();
						
						
					}

				}
			},
			error : function(data) {
				lwalert("tipModal", 1,"操作失败");
			}
		});
		
	}
	
}

/**
 * type 1：根据ID快速完工，2：根据查询条件快速完工
 *
 */
var updatedispatchingstatus = function(type, status) {	

	var productionOrderIds = "";

	if (type == 1) {
		orderId = com.leanway.getDataTableCheckIds("checkList");

		if ($.trim(orderId) == "") {
			var info = "请选择派工单关闭！";
 
			lwalert("tipModal", 1, info);
			// alert("请选择生产订单生成派工单!");
			return;
		}

		 var msg = "确认关闭选中的派工单？"

	     lwalert("tipModal", 2, msg ,"confirmUpdateDispatchingOrderStatus("+type+","  + status +")");

	} else {

	    var msg = "确定按查询条件关闭派工单？"

		lwalert("tipModal", 2, msg ,"confirmUpdateDispatchingOrderStatus("+type+","+ status +")");

	}
	
}

var confirmUpdateDispatchingOrderStatus = function(type, status) {
	
	var searchCondition = new Object();
	
	var orderId = "";
	
	if (type == 1) {
		
		orderId = com.leanway.getDataTableCheckIds("checkList");
		searchCondition.orderids = orderId;

	} else {
	    searchCondition = getSearchConditions();
	}
	
	var strCondition = $.trim(JSON.stringify(searchCondition));

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "updateDispatchingOrderStatus",
			"strCondition" : strCondition,
			"dispatchingstatus" : status
		},
		dataType : "json",
		async : false, 
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {

				lwalert("tipModal", 1, text.info);

				if (text.status == "success") {

					dispatchingOrderTable.ajax.reload();
				}

			}

		},

	});
}

var showExceptionOrder = function ( ) {
	
	var orderids = com.leanway.getDataTableCheckIds("checkList");
	
	var searchCondition = new Object();
	
	if (orderids != "" && orderids.length != 0) {
		searchCondition.orderids = orderids;
	} else {
	    searchCondition = getSearchConditions();
	}
	
	var strCondition = encodeURIComponent($.trim(JSON.stringify(searchCondition)));
	var exCondition = encodeURIComponent($.trim(JSON.stringify(getExSearchConditions())));
	
	allExceptionTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryDispatchingOrderException&strCondition=" + strCondition + "&exCondition=" + exCondition).load();
	
	$('#exceptionDataModal').modal({backdrop: 'static', keyboard: true});
}

var updatedispatchingcenter = function ( ) {
	
    var msg = "确定修正派工单的工作组(修正成工艺路线的工作组)？"

	lwalert("tipModal", 2, msg ,"ajaxUpdateDispatchingCenter()");
	
}

var ajaxUpdateDispatchingCenter = function ( ) {
	
	var orderids = com.leanway.getDataTableCheckIds("checkList");
	
	var searchCondition = new Object();
	
	if (orderids != "" && orderids.length != 0) {
		searchCondition.orderids = orderids;
	} else {
		searchCondition = getSearchConditions();
	}
	
	searchCondition.dispatchingStatusArrays = "0,1,2";
	
	var strCondition = $.trim(JSON.stringify(searchCondition))
	
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "updateDispatchingCenter",
			"strCondition" : strCondition,
			"dispatchingstatus" : status
		},
		dataType : "json",
		async : false, 
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {

				lwalert("tipModal", 1, text.info);

				if (text.status == "success") {
					
					dispatchingOrderTable.ajax.reload();
				}

			}

		},

	});
	
}

var showMoveModal = function ( ) {
	
	var orderid = com.leanway.getDataTableCheckIds("checkList");
	
	var values = orderid.split(",");
	
	if ( values == "" ) {

	    lwalert("tipModal", 1, "请选择派工单进行平移操作!");
		return;
	} else if (values.length > 1){

	    lwalert("tipModal", 1, "请选择一条派工单进行平移操作！");
		return;
	} else {
		
		$('#moveDataModal').modal({backdrop: 'static', keyboard: true});
		
	}
}

var moveDispatchingOrder = function ( ) {
	var orderid = com.leanway.getDataTableCheckIds("checkList");
	var movetype = com.leanway.getDataTableCheckIds("movetype");
	
	var searchCondition = new Object();
	searchCondition.movenumber = $("#movenumber").val();
	searchCondition.movetype = movetype;
	searchCondition.timeunits = $("#moveunits").val();
	searchCondition.orderid = orderid;
	var strCondition = $.trim(JSON.stringify(searchCondition));
	
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "moveDispatchingOrder",
			"strCondition" : strCondition
		},
		dataType : "json",
		async : false, 
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {

				if (text.status == "success") {
					dispatchingOrderTable.ajax.reload();
					$('#moveDataModal').modal("hide");
				}
				
				lwalert("tipModal", 1, text.info);

			}

		},

	});
}

var searchException = function ( ) {
	
	var orderids = com.leanway.getDataTableCheckIds("checkList");
	
	var searchCondition = new Object();
	
	if (orderids != "" && orderids.length != 0) {
		searchCondition.orderids = orderids;
	} else {
	    searchCondition = getSearchConditions();
	}
	
	var dorCondition = encodeURIComponent($.trim(JSON.stringify(searchCondition)));
	
	 
	var exCondition = encodeURIComponent($.trim(JSON.stringify(getExSearchConditions())));
	
	allExceptionTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryDispatchingOrderException&strCondition=" + dorCondition + "&exCondition=" + exCondition).load();
	
}

var getExSearchConditions = function ( ) {
	
	var sqlJsonArray = new Array()
	
	// 子查询号
	var exsearchno = $("#exsearchno").val();
	if (exsearchno != null && exsearchno != "" && typeof(exsearchno) != "undefined" && exsearchno != undefined) {
		exsearchno = exsearchno.toString();
	}
	
	// 产品类型
	var exexceptionid = $("#exexceptionid").val();

	if (exexceptionid != null && exexceptionid != "" && typeof(exexceptionid) != "undefined" && exexceptionid != undefined) {
		exexceptionid = exexceptionid.toString();
	}
	
	// 产品
	var exproductorname = $("#exproductorname").val();
	
	// 图号
	var exdrawcode = $("#exdrawcode").val();
	
	// 提报人
	var excreateusername = $("#excreateusername").val();
	
	// 处理人
	var exexecuteuser = $("#exexecuteuser").val();
	
	// 开始时间
	var excreatetime = $("#excreatetime").val();

	// 开始时间
	var excreatetime_end = $("#excreatetime_end").val();
	
	console.log(exsearchno);
	if ($.trim(exsearchno) != "") {

		var searchNoObj = new Object();
		searchNoObj.fieldname = "dor.productionchildsearchno";
		searchNoObj.fieldtype = "varchar_select2";
		searchNoObj.value = exsearchno;
		searchNoObj.logic = "and";
		searchNoObj.ope = "in";

		sqlJsonArray.push(searchNoObj);
	}
	
	if ($.trim(exexceptionid) != "") {

		var exexceptionidObj = new Object();
		exexceptionidObj.fieldname = "doe.exceptionid";
		exexceptionidObj.fieldtype = "varchar_select2";
		exexceptionidObj.value = exexceptionid;
		exexceptionidObj.logic = "and";
		exexceptionidObj.ope = "in";

		sqlJsonArray.push(exexceptionidObj);
	}
	
	if ($.trim(exproductorname) != "") {

		var exproductornameObj = new Object();
		exproductornameObj.fieldname = "ps.productorname";
		exproductornameObj.fieldtype = "varchar";
		exproductornameObj.value = exproductorname;
		exproductornameObj.logic = "and";
		exproductornameObj.ope = "like";

		sqlJsonArray.push(exproductornameObj);
	}
	
	if ($.trim(exdrawcode) != "") {

		var exdrawcodeObj = new Object();
		exdrawcodeObj.fieldname = "ps.drawcode";
		exdrawcodeObj.fieldtype = "varchar";
		exdrawcodeObj.value = exdrawcode;
		exdrawcodeObj.logic = "and";
		exdrawcodeObj.ope = "like";

		sqlJsonArray.push(exdrawcodeObj);
	}
	
	
	
	if ($.trim(excreateusername) != "") {

		var excreateusernameObj = new Object();
		excreateusernameObj.fieldname = "doe.createusername";
		excreateusernameObj.fieldtype = "varchar";
		excreateusernameObj.value = excreateusername;
		excreateusernameObj.logic = "and";
		excreateusernameObj.ope = "like";

		sqlJsonArray.push(excreateusernameObj);
	}
 
	
	if ($.trim(exexecuteuser) != "") {

		var exadjustuserObj = new Object();
		exadjustuserObj.fieldname = "doe.adjustuser";
		exadjustuserObj.fieldtype = "varchar";
		exadjustuserObj.value = exexecuteuser;
		exadjustuserObj.logic = "and";
		exadjustuserObj.ope = "like";

		sqlJsonArray.push(exadjustuserObj);
	}
 
	
	if ($.trim(excreatetime) != "") {

		var excreatetimeObj = new Object();
		excreatetimeObj.fieldname = "doe.createtime";
		excreatetimeObj.fieldtype = "datetime";
		excreatetimeObj.value = excreatetime;
		excreatetimeObj.logic = "and";
		excreatetimeObj.ope = ">=";

		sqlJsonArray.push(excreatetimeObj);
	}

	if ($.trim(excreatetime_end) != "") {

		var excreatetime_endObj = new Object();
		excreatetime_endObj.fieldname = "doe.createtime";
		excreatetime_endObj.fieldtype = "datetime";
		excreatetime_endObj.value = excreatetime_end;
		excreatetime_endObj.logic = "and";
		excreatetime_endObj.ope = "<=";

		sqlJsonArray.push(excreatetime_endObj);
	}
	
	var condition = new Object();
	condition.sqlDatas = sqlJsonArray;
	return condition;
	
}

var showExecuteException = function ( ) {
	
	var orderexceptionid =  com.leanway.getDataTableCheckIds("allExceptionCheckList");
	
	if (orderexceptionid == "") {
		  lwalert("tipModal", 1, "请选择异常进行优化操作！");
			return;
	} else {
		$("input[type=radio][name=iscalculate][value= 0 ]").prop("checked", true);
		$("#executeExceptionModalForm #opinion").val("");
		$("#executeExceptionModalForm #exmodalexceptiontime").val("");
		$('#executeExceptionModal').modal({backdrop: 'static', keyboard: true});
	}
}

var viewSplitOrder = function ( obj ) {
	var detailList = dispatchingOrderTable.rows().data()[obj].detailList;
	
	var dataSet = new Array();
	
	for (var i = 0 ; i < detailList.length; i++) {
		
		var rowArray = new Array();
		
		rowArray.push(detailList[i].dispatchingnumber);
		rowArray.push(detailList[i].productorname);
		rowArray.push(detailList[i].mouldname);
		rowArray.push(detailList[i].plannumber);
		rowArray.push(detailList[i].starttime);
		rowArray.push(detailList[i].endtime);
		
		dataSet.push(rowArray);
	}
 
	if (viewSplitOrderTables) {
		viewSplitOrderTables.api().clear();
		viewSplitOrderTables.api().destroy();
	}

	viewSplitOrderTables = $('#viewSplitOrderTables').dataTable( {
        "data": dataSet,
        'bPaginate': false,
        "bServerSide": false,
        "columns": [
            { "title": "派工单号" },
            { "title": "产品" },
            { "title": "模具" },
            { "title": "数量" },
            { "title": "开始时间" },
            { "title": "结束时间" }
        ],
        "oLanguage" : {
       	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
        },
    } );
	
	
	
	com.leanway.show("viewSplitOrderModal");
}

var addPModule = function ( ) {
	
	var ids = com.leanway.getDataTableCheckIds("checkList");
	var idLength = ids.split(",").length;

	if (ids.length == 0 || idLength != 1) {
		lwalert("tipModal", 1, "请选择一条派工单增加组件！");
		return;
	}
	
	// 检查工序是否能满足新增条件
	 
	com.leanway.clearForm("pmForm");
	//$("#pmForm #productorid").select2("val", "");
	$("#pmForm #productionorderid").val(dispatchingOrderTable.rows('.row_selected').data()[0].productionorderid);
	$("#pmForm #productionprocedureid").val(dispatchingOrderTable.rows('.row_selected').data()[0].procedureid);
	$("#pmForm #orderid").val(dispatchingOrderTable.rows('.row_selected').data()[0].orderid);
	com.leanway.show("pmModal");
	
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



var getLiuhuaProductorMould = function ( ) {
	
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			method : "queryLiuhuaMould"
			
		},
		dataType : "json",
		async : false, 
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
				addPlanDataArray = data;
			}
		},
		error : function(data) {
			lwalert("tipModal", 1,"ajax 请求失败");
		}
	});
}
var inBatchesDispatching = function ( ) {

	
    var ids = com.leanway.getDataTableCheckIds("checkList");
    var idLength = ids.split(",").length;

    if (ids.length == 0 || idLength != 1) {
        lwalert("tipModal", 1, "请选择一条派工单进行拆分！");
        return;
    }
    var pgdid = ids.split(",")[0];

    $.ajax({
        type : "post",
        url : "../../../../" + ln_project + "/dispatchingOrder",
        data : {
            "method" : "queryEquipmentnameList",
            "centerid" : dispatchingOrderTable.rows('.row_selected').data()[0].centerid,
            "pgdid":pgdid
        },
        dataType : "json",
        async : false,
        success : function(data) {

            var flag = com.leanway.checkLogind(data);

            if (flag) {
            	  if (data.status == "error") {
                      lwalert("tipModal", 1, data.info);
            	  }
            	
            	
				if (data.data){
					var inBatchFormHtmlDom = document.getElementById("inBatchForm");
					var inBatchFormHtml = "";
					 
                    for (let i = 0; i < data.data.length; i++) {
                    	if (i == 0){
                    		inBatchFormHtml += "<input class=\"form-control\" id=\"orderid\" name=\"orderid\" type=\"hidden\" />";
						}
                    	
                    	 inBatchFormHtml += "<input class=\"form-control\" id=\"equipmentid"+i+"\" name=\"equipmentid"+i+"\" type=\"hidden\"  />";
 						 inBatchFormHtml += "<div class=\"form-group\">\n" +
                             "\n" +
                             "\t\t\t\t\t\t\t\t\t<label class=\"col-sm-1 control-label\" for=\"equipmentname"+i+"\">设备</label>\n" +
                             "\t\t\t\t\t\t\t\t\t<div class=\"col-sm-2\">\n" +
                             "\t\t\t\t\t\t\t\t\t\t<input class=\"form-control equipment\" id=\"equipmentname"+i+"\" name=\"equipmentname"+i+"\" type=\"text\" placeholder=\"" + data.data[i].equipmentname + "\" style=\"width: 150px;\" />\n" +
                             "\t\t\t\t\t\t\t\t\t</div>\n" +
                             "\n" +
                             "\t\t\t\t\t\t\t\t\t<label class=\"col-sm-1 control-label\" for=\"materialandcount"+i+"\">材料库存和规格</label>\n" +
                             "\t\t\t\t\t\t\t\t\t<div class=\"col-sm-2\">\n" +
                             "\t\t\t\t\t\t\t\t\t\t<input class=\"form-control materialandcount\" id=\"materialandcount"+i+"\" name=\"materialandcount"+i+"\" type=\"text\" placeholder=\"" + data.data[i].materialandcount + "\" style=\"width: auto;\" />\n" +
                             "\t\t\t\t\t\t\t\t\t</div>\n" +
                             "\n" +
                             "\t\t\t\t\t\t\t\t\t<label class=\"col-sm-1 control-label\" for=\"gyswcount"+i+"\">未交货数</label>\n" +
                             "\t\t\t\t\t\t\t\t\t<div class=\"col-sm-2\">\n" +
                             "\t\t\t\t\t\t\t\t\t\t<input class=\"form-control gyswcount\" id=\"gyswcount"+i+"\" name=\"gyswcount"+i+"\" type=\"text\" placeholder=\"" + data.data[i].gyswcount + "\" style=\"width: 60px;\" />\n" +
                             "\t\t\t\t\t\t\t\t\t</div>\n" +
                             "\n" +
                             "\t\t\t\t\t\t\t\t\t<label class=\"col-sm-1 control-label\" for=\"number"+i+"\">拆分数量</label>\n" +
                             "\t\t\t\t\t\t\t\t\t<div class=\"col-sm-2\">\n" +
                             "\t\t\t\t\t\t\t\t\t\t<input class=\"form-control\" id=\"number"+i+"\" name=\"number"+i+"\" type=\"number\" placeholder=\"数量\" style=\"width: 150px;\" />\n" +
                             "\t\t\t\t\t\t\t\t\t</div>\n" +
                             "\n" +
                             "\t\t\t\t\t\t\t\t\t<label class=\"col-sm-1 control-label\" for=\"rubber"+i+"\">胶料号</label>\n" +
                             "\t\t\t\t\t\t\t\t\t<div class=\"col-sm-2\">\n" +
                             "\t\t\t\t\t\t\t\t\t\t<input class=\"form-control\" id=\"rubber"+i+"\" name=\"rubber"+i+"\" type=\"rubber\" placeholder=\"胶料号\" style=\"width: 150px;\" />\n" +
                             "\t\t\t\t\t\t\t\t\t</div>\n" +
                             "\n" +
 							"<label class=\"col-sm-1 control-label\" for=\"adjuststarttime" + i + "\">开始时间</label>\n" +
                             "<div class=\"col-sm-2\">\n" +
                             "\t<input type=\"text\" placeholder=\"开始时间\" id =\"adjuststarttime"+ i +"\"  name = \"adjuststarttime" + i + "\" class=\"form-control\" style=\"width: 150px; height : 32px;\">\n" +
                             "</div>\n" +
                             "\n" +
                             "<label class=\"col-sm-1 control-label\" for=\"adjustendtime" + i + "\">结束时间</label>\n" +
                             "<div class=\"col-sm-2\">\n" +
                             "\t<input type=\"text\" placeholder=\"结束时间\" id =\"adjustendtime" + i + "\"  name = \"adjustendtime" + i + "\" class=\"form-control\" style=\"width: 150px; height : 32px;\">\n" +
                             "</div>" +
                             "\t\t\t\t\t\t\t\t</div>";
                    	
                    	
                    	
                    	
                    	
                    	
                            /*inBatchFormHtml += "<input class=\"form-control\" id=\"equipmentid"+i+"\" name=\"equipmentid"+i+"\" type=\"hidden\"  />";
                            inBatchFormHtml += "<input class=\"form-control\" id=\"productormouldid"+i+"\" name=\"productormouldid"+i+"\" type=\"hidden\"  />";
						inBatchFormHtml += ""
							+ "<div class='form-group'>"
								+ "<label class='col-sm-1 control-label' for='equipmentname"+i+"'>设备</label>"
								+ "<div class='col-sm-1'>"
									+ "<input class='form-control equipment' id='equipmentname"+i+"' name='equipmentname"+i+"' type='text' placeholder='" + data.data[i].equipmentname + "' style='width: 100px;'>"
								+ "</div>"
								+ "<label class='col-sm-1 control-label' for='productormouldid"+i+"'>模具</label>"
								+ "<div class=\"col-sm-1\">"
									+ "<select name='productormouldid' multiple='multiple' class='form-control input-sm' style='width: 150px;height : 32px;'>"
										+ trHtml
		                            + "</select>"
								+ "</div>"
								+ "<label class='col-sm-1 control-label' for='endtimeid'"+i+"'>最后时间</label>"
								+ "<div class='col-sm-1'>"
							        + "<input class='form-control endtimeid' id='endtimeid"+i+"' name='endtimeid"+i+" type='text' placeholder='最后时间' style=\"width: 150px;\">"
								+ "</div>"
								+ "<label class=\"col-sm-1 control-label\" for=\"number"+i+"\">拆分数量</label>"
								+ "<div class='col-sm-1'>"
								   + "<input class=\"form-control\" id=\"number"+i+"\" name=\"number"+i+"\" type=\"number\" placeholder=\"数量\" style=\"width: 100px;\">"
								+ "</div>"
								+ "<label class=\"col-sm-1 control-label\" for=\"adjuststarttime" + i + "\">开始时间</label>"
								+ "<div class='col-sm-1'>"
					              + "<input type=\"text\" placeholder=\"开始时间\" id =\"adjuststarttime"+ i +"\"  name = \"adjuststarttime" + i + "\" class=\"form-control\" style=\"width: 150px; height : 32px;\">"
								+ "</div>"
								+ "<label class=\"col-sm-1 control-label\" for=\"adjustendtime" + i + "\">结束时间</label>"
								+ "<div class='col-sm-1'>"
								   + "<input type=\"text\" placeholder=\"结束时间\" id =\"adjustendtime" + i + "\"  name = \"adjustendtime" + i + "\" class=\"form-control\" style=\"width: 150px; height : 32px;\">"
								+ "</div>"
							+ "</div>";*/
                    }
                    inBatchFormHtmlDom.innerHTML = inBatchFormHtml;

                    $(".equipment").prop("readonly", true);
                    $(".materialandcount").prop("readonly", true);
                    $(".gyswcount").prop("readonly", true);

                    com.leanway.clearForm("inBatchForm");
                    var initTimePickYmdForMoreIds = "";
                    for (let i = 0; i < data.data.length; i++) {
                        $("#equipmentid" + i).val(data.data[i].equipmentid);
                        $("#equipmentname" + i).val(data.data[i].equipmentname);
                        $("#adjuststarttime" + i).val(dispatchingOrderTable.rows('.row_selected').data()[0].adjuststarttime);
                        $("#adjustendtime" + i).val(dispatchingOrderTable.rows('.row_selected').data()[0].adjustendtime);

                        if (i == data.data.length - 1){
                            initTimePickYmdForMoreIds += "#adjuststarttime" + i + ",";
                            initTimePickYmdForMoreIds += "#adjustendtime" + i;
						} else {
                            initTimePickYmdForMoreIds += "#adjuststarttime" + i + ",";
                            initTimePickYmdForMoreIds += "#adjustendtime" + i + ",";
						}
                    }
                    $("#inBatchForm #orderid").val(dispatchingOrderTable.rows('.row_selected').data()[0].orderid);
                    com.leanway.initTimePickYmdHmsForMoreId(initTimePickYmdForMoreIds);

                    com.leanway.show("inBatchModal");

				} else {
                    lwalert("tipModal", 1, "该派工单工作中心无设备台账！");
				}
            }
        },
        error : function() {
            lwalert("tipModal", 1, "ajax error！");
        }
    });
    //$("select[name='productormouldid']").select2({placeholder : "模具(可多选)", tags: false, language : "zh-CN", allowClear: true, maximumSelectionLength: 10 });
}


var saveInBatch = function ( ) {

    var inBatchData = com.leanway.formatForm("#inBatchForm");

    $.ajax({
        type : "post",
        url : "../../../../" + ln_project + "/dispatchingOrder",
        data : {
            "method" : "inBatchDispatchingOrder",
            "data" : inBatchData
        },
        dataType : "json",
        async : false,
        success : function(data) {

            var flag = com.leanway.checkLogind(data);

            if (flag) {


                if (data.status == "error") {
                    // alert(data.info);
                    salesErrorStatus = "error";
                    lwalert("tipModal", 1, data.info);

                } else {
                    dispatchingOrderTable.ajax.reload();
                    $("#inBatchModal").modal("hide");
                }

            }
        },
        error : function() {
            lwalert("tipModal", 1, "ajax error！");
        }
    });

}

// 同步外协加工
function synOutsourcingProcessing(type){
	// 1：当前选中数据；2：查询条件同步；
	//=============== 获取数据 ===============//
	var list = null;
	if(type == 1){
		// 获取选中数据
		list = $("#dispatchingOrderTable").DataTable().rows('.row_selected').data();
	}else{
		// 获取查询到的所有数据
		list = $('#dispatchingOrderTable').DataTable().rows().data();
	}
	console.log(list);
	
	//=============== 封装数据 ===============//
	var productionorderid = "";
	$(list).each(function(index,e){
		productionorderid += e.productionorderid+",";
	});
	// 验证参数
	if(productionorderid == null || productionorderid.trim() == ""){
		lwalert("tipModal", 1, "至少选择一条数据");
		return false;
	}
	
	//=============== 发起数据 ===============//
	$.ajax({
		type : "post",
        url : "../../../../" + ln_project + "/dispatchingOrder?method=synOutsourcingProcessing",
	   	data: {
	   		"ids":productionorderid
	   	},
	   	dataType: "json",
	   	success: function(data){
	   		lwalert("tipModal", 1, data.info);
	   	}
	});
	

}


//点击计划触发按钮  (派工单界面，点击计划触发按钮，生成生产订单)
var planToTrigger = function () {
	
	//获取选中的派工单
	var checkboxs = $("#dispatchingOrderTable :checked");
	if ( checkboxs.length == 0  ) {
		   lwalert("tipModal", 1, "请选择派工单进行触发操作!");
		   return;
	} else if ( checkboxs.length > 1 ){
		   lwalert("tipModal", 1, "请选择一条派工单进行触发操作!");
		   return;
	}
	var pgdid = checkboxs[0].value;
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "addSCcurrentPOT",
			"pgdid" : pgdid
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







