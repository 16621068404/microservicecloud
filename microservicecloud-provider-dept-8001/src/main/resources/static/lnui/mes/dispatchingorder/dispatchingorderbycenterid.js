var dispatchingOrderTable;
var equipmentTable;
var employeeTable;
var saveEmployeeTable;
var viewEmployeeTable;
var reg=/,$/gi;
var hasData = false;
var id = "";
var parentId = "";
var type = "";
var tableStatus = false;
var tableHeight = "370px";
var clicktime = new Date();
var condition = "";

$ ( function () {

	 if (window.screen.availHeight > 768) {
		 tableHeight = "";
		 $("#productionchildsearchno").css("width","240px");
		 $("#productorTypeId").css("width","180px");
	 }

	// 初始化对象
	com.leanway.loadTags();
	
	// 产品类型
	loadProtype();
	
	//添加系統参数
	initSystemConfig();
	// 初始化生产订单
	dispatchingOrderTable = initDispatchingOrder( );
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


	// enter键时候触发查询
	com.leanway.enterKeyDown("searchBarCode", queryBarCode);

	// 查询触发
	com.leanway.enterKeyDown("searchValue", queryDispatchingOrder);
	com.leanway.enterKeyDown("productionchildsearchno", queryDispatchingOrder);
	com.leanway.enterKeyDown("adjuststarttime", queryDispatchingOrder);
	com.leanway.enterKeyDown("adjustendtime", queryDispatchingOrder);
	com.leanway.enterKeyDown("groupname", queryDispatchingOrder);
	com.leanway.enterKeyDown("procedureshortname", queryDispatchingOrder);

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

	$("#saveFun").attr("disabled", true);


	initTreeBom();

	com.leanway.initTimePickYmdForMoreId("#adjuststarttime,#adjustendtime");
	
	//初始化select2下拉框
	//com.leanway.initSelect2("#productionchildsearchno","../../../"+ln_project+"/dispatchingOrder?method=querySearchNo", "按生产号查询",true);
	com.leanway.initSelect2("#productionchildsearchno","../../../"+ln_project+"/productionOrder?method=querySearchNo","查询号(可多选)", true);
	
    $("#productorTypeId,#productionchildsearchno").on("select2:select" , function( e ) {
    	queryDispatchingOrder();
    });
    
    $("#productorTypeId,#productionchildsearchno").on("select2:unselect" , function( e ) {
    	queryDispatchingOrder();
    });
    
    $("#adjuststarttime,#adjustendtime,#groupname,#procedureshortname").on("change", function(e) {
    	queryDispatchingOrder();
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
    		'产品编码: '+(data.productorname==null?"":data.productorname)+'<br>'+
    		'产品图号: '+(data.drawcode==null?"":data.drawcode)+'<br>'+
    		'工序: '+(data.line==null?"":data.line)+'<br>'+
    	    '工作中心: '+(data.centername==null?"":data.centername)+'<br>'+
    		'人工工作中心: '+(data.personcentername==null?"":data.personcentername)+'<br>'+
           '模具: '+(data.mouldname==null?"":data.mouldname)+'<br>'+
           '模具台账: '+(data.ledgername==null?"":data.ledgername)+'<br>'+
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

	dispatchingOrderTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryDispatchingOrderByCenterid&searchValue=" + searchVal + "&orderStatus=" + orderStatus +"&sqlDatas=" + encodeURIComponent(jsonData) + "&dispatchingstatus=" + dispatchingStatus).load();

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

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "saveEquipmentDispatching",
			"orderId" : orderId,
			"equipmentId" : equipmentId
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
                $(this).find("td:eq(8)").html('<input type="text" class="form-control" style="width: 40px" onchange="setDataTableValue(this, ' + index + ',\'dispatchingOrderTable\')" name="count" id="count' + index + '" value="' + dispatchingOrderTable.rows().data()[index].count + '">');

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
	var strCondition = encodeURIComponent($.trim(JSON.stringify(searchCondition)));

	dispatchingOrderTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryDispatchingOrderByCenterid&strCondition=" + strCondition).load();
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
		"ajax": "../../../../"+ln_project+"/dispatchingOrder?method=queryDispatchingOrderByCenterid"  +condition ,
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
		               { orderable: false,targets: [3]},
		               { orderable: false,targets: [5]},
		               { orderable: false,targets: [6]},
		               { orderable: false,targets: [7]},
		               { orderable: false,targets: [8]},
		               { orderable: false,targets: [10]},
		               { orderable: false,targets: [11]}
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
		                             {"mDataProp" : "dispatchingnumber"},
		                             {"mDataProp" : "productionchildsearchno"},
		                             {"mDataProp" : "productordesc"},
		                             {"mDataProp" : "procedureshortname"},
		                             {"mDataProp" : "groupshortname"},
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
		                             {"mDataProp": "count"},
		                             {"mDataProp": "surplusnumber"},
//		                             {"mDataProp": "line"},
//		                             {"mDataProp": "starttime"},
//		                             {"mDataProp": "endtime"},
		                             {"mDataProp": "adjuststarttime"},
		                           /*  {"mDataProp": "adjustendtime"},*/
//		                             {"mDataProp": "practicalstarttime"},
//		                             {"mDataProp": "practicalendtime"},
//		                             {"mDataProp": "changestarttime"},
//		                             {"mDataProp": "changeendtime"}
		                             {
                                         "mDataProp": "",
                                         "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {

                                                 $(nTd).addClass("details-control");

                                         }
                                     }
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


	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "dowloadExcel",
			"searchValue":searchVal,
			"orderStatus":orderStatus,
			"dispatchingstatus":dispatchingStatus

		},
		dataType : "text",
		/*async : false,*/
		success : function ( data ) {
			var flag =  com.leanway.checkLogind(data);

			if(flag){

					 window.location.href = "../../../../"+ln_project+"/dispatchingOrder?method=dowloadExcel&searchValue=" + searchVal + "&orderStatus=" + orderStatus +"&sqlDatas=" + encodeURIComponent(jsonData) + "&dispatchingstatus=" + dispatchingStatus;
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
	$("#returnDafaulttime").prop("disabled", true);
	$("#returnDafaulttime").html("恢复中");

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "returnDafaulttime",		
		},
		dataType : "json",
		/*async : false,*/
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

	// 工单状态
	var dispatchingStatus = com.leanway.getDataTableCheckIds("dispatchingstatus");
 
	// 下料订单
	var orderStatus =  com.leanway.getDataTableCheckIds("virtual");

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
		sqlJson += "{\"fieldname\":\"sp.shortname\",\"fieldtype\":\"varchar\",\"value\":\""+ procedureShortName + "\",\"logic\":\"and\",\"ope\":\"like\"},";
		var procedureShortNameObj = new Object();
		procedureShortNameObj.fieldname = "sp.shortname";
		procedureShortNameObj.fieldtype = "varchar";
		procedureShortNameObj.value = procedureShortName;
		procedureShortNameObj.logic = "and";
		procedureShortNameObj.ope = "like";
		sqlJsonArray.push(procedureShortNameObj);
	}

	var condition = new Object();
	condition.searchValue = $.trim(searchVal);
	condition.orderStatusArrays = orderStatus;
	condition.dispatchingStatusArrays = dispatchingStatus;
	condition.searchBom = searchBom;
	condition.levels = levels;
	condition.sqlDatas = sqlJsonArray;

	return condition;
}
