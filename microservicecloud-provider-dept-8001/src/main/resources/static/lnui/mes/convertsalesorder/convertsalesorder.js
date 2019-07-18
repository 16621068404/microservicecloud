
var clicktime = new Date();

//关联
function preSalesOrder2SalesOrderFunc() {

	//判断detail都选中状态
	var str = '';
	// 拼接选中的checkbox
	$("#editSalesOrderDetailsTable input[name='editCheck']:checked").each(function(i, o) {
		str += $(this).val();
		str += ",";
	});

	var preStr = "";
	$("#preEditSalesOrderDetailsTable input[name='preEditCheck']:checked").each(function(i, o) {
		preStr += $(this).val();
		preStr += ",";
	});
	if (str.length > 0 && preStr.length > 0) {

		var detailId = str.substr(0, str.length - 1);
		var preDetailId = preStr.substr(0, str.length - 1);
		if(str.length==preStr.length){
		$.ajax({
			type: "post",
			url: "../../../"+ln_project+"/salesOrder",
			data: {
				method: "preSalesOrderSalesOrder",
				detailId: detailId,
				preDetailId: preDetailId
			},
			dataType: "json",
			success: function(data) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					if (data.status == "success") {
						preODetailTable.ajax.reload(); // 刷新dataTable
						oDetailTable.ajax.reload();
	//					alert("关联成功！");

					}
					lwalert("tipModal", 1,data.info );

				}
			},
			error: function(data) {

			}
		});
		}else{
//			alert("销售订单产品必须和预销售订单产品相同")
			lwalert("tipModal", 1, "销售订单产品必须和预销售订单产品相同！");
		}
	} else {
//		alert("请选择销售订单明细或与预销售订单明细！");
		lwalert("tipModal", 1, "请选择销售订单产品或预销售订单产品！");
	}
}

//初始化dataTables-edit
var initEditDataTable = function(salesOrderId) {
	var editTable = $("#editSalesOrderDetailsTable")
			.DataTable(
					{
						"ajax" : '../../../'+ln_project+'salesOrderDetail?method=querySalesOrderDetail&conditions=' + encodeURI('{"salesorderid": "'+ salesOrderId + '"}'),
						'bPaginate' : true,
						"iDisplayLength" : "8",
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"scrollY":"250px",
						"bJQueryUI" : true,
						"bAutoWidth" : true, // 宽度自适应
						"bProcessing" : true,
						"bServerSide" : false,// 开启服务器模式
						'searchDelay' : "5000",
						"aoColumns" : [
								{
									"mDataProp" : "salesorderdetailid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd).html(
												"<input class='regular-checkbox' type='checkbox' id='" + sData
			                                       + "' name='editCheck' value='" + sData
			                                       + "'><label for='" + sData
			                                       + "'></label>");
									}
								},
								{
									"mDataProp" : "productorname"
								},
								{
									"mDataProp" : "productordesc",
								},
								{
									"mDataProp" : "specification"
								},
								{
									"mDataProp" : "unitsname"
								},
								{
									"mDataProp" : "relatednumber"
								},
								/*{
									"mDataProp" : "price"
								},
								{
									"mDataProp" : "requestdate"
								},
								{
									"mDataProp" : "prioritylevels"
								},
								{
									"mDataProp" : "salesstatustext"
								},*/
								{
									"mDataProp" : "productionsearchno"
								}/*,
								{
									"mDataProp" : "contractno"
								}*/ ],
						"aoColumnDefs" : [ {
							"sDefaultContent": "",
							 "aTargets": [ "_all" ]
						} ],
						"language" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {

							 // 点击dataTable触发事件
                            com.leanway.dataTableClick("editSalesOrderDetailsTable", "editCheck", true,
                            		oDetailTable);


//								$("#editSalesOrderDetailsTable"+' input[name="editCheck"]').icheck({
//									labelHover : false,
//									cursor : true,
//									checkboxClass : 'icheckbox_flat-blue',
//									radioClass : 'iradio_flat-blue'
//								});
						}

					}).on('xhr.dt', function (e, settings, json) {
						com.leanway.checkLogind(json);
					} );
	return editTable;
}

//初始化dataTables-edit(Pre)
var initPreEditDataTable = function(salesOrderId) {
	var editTable = $("#preEditSalesOrderDetailsTable")
			.DataTable(
					{
						"ajax" : '../../../'+ln_project+'preSalesOrderDetail?method=querySalesOrderDetailByConditons&conditions='+ encodeURI('{"salesorderid": "'+ salesOrderId + '"}'),
						'bPaginate' : true,
						"iDisplayLength" : "8",
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"scrollY":"250px",
						"bJQueryUI" : true,
						"bAutoWidth" : true, // 宽度自适应
						"bProcessing" : true,
						"bServerSide" : false,// 开启服务器模式
						'searchDelay' : "5000",
						"aoColumns" : [
								{
									"mDataProp" : "salesorderdetailid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd).html(
												"<input class='regular-checkbox' type='checkbox' id='" + sData
			                                       + "' name='preEditCheck' value='" + sData
			                                       + "'><label for='" + sData
			                                       + "'></label>");
									}
								},
								{
									"mDataProp" : "productorname"
								},
								{
									"mDataProp" : "productordesc",
								},
								{
									"mDataProp" : "specification"
								},
								{
									"mDataProp" : "unitsname"
								},
								{
									"mDataProp" : "number"
								},
								/*{
									"mDataProp" : "price"
								},
								{
									"mDataProp" : "requestdate"
								},
								{
									"mDataProp" : "prioritylevels"
								},
								{
									"mDataProp" : "salesstatustext"
								},*/
								{
									"mDataProp" : "productionsearchno"
								}/*,
								{
									"mDataProp" : "companioname"
								} */],
						"aoColumnDefs" : [ {
							"sDefaultContent": "",
							 "aTargets": [ "_all" ]
						} ],
						"language" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {

							 // 点击dataTable触发事件
                            com.leanway.dataTableClick("preEditSalesOrderDetailsTable", "preEditCheck", true,
                            		preODetailTable);


//								$("#preEditSalesOrderDetailsTable"+' input[name="editCheck"]').icheck({
//									labelHover : false,
//									cursor : true,
//									checkboxClass : 'icheckbox_flat-blue',
//									radioClass : 'iradio_flat-blue'
//								});
						}

					}).on('xhr.dt', function (e, settings, json) {
						com.leanway.checkLogind(json);
					} );
	return editTable;
}

// 初始化数据表格
//tableId: 操作的tableId; dataUrl:表格URL; tableObject:表格对象; clickFunc:单击方法
var initTable = function(tableId, dataUrl, tableObject, defaultDataFunc, checkboxName, onClick) {
	var table = $("#"+tableId)
			.DataTable(
					{
						"ajax" : dataUrl,
						"iDisplayLength" : "8",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"scrollY":"250px", // DataTables的高
						//"sScrollX" : 400, // DataTables的宽
						"bAutoWidth" : true, // 宽度自适应
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",
						"columns" : [ {
							"data" : "salesorderid"
						}, {
							"data" : "code"
						}, {
							"data" : "contacts"
						}, {
							"data" : "salesdate"
						} ],
						"aoColumns" : [
								{
									"mDataProp" : "salesorderid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										 $(nTd).html(
												"<input class='regular-checkbox' type='checkbox' id='" + sData
				                                       + "' name='"+checkboxName+"' value='" + sData
				                                       + "'><label for='" + sData
				                                       + "'></label>");
									}
								}, {
									"mDataProp" : "code"
								}, {
									"mDataProp" : "contacts"
								}, {
									"mDataProp" : "salesdate"
								} ],
						"fnCreatedRow" : function(nRow, aData, iDataIndex) {
							// add selected class
						},
						"oLanguage" : {
				        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
				         },
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {

							com.leanway.getDataTableFirstRowId(tableId, onClick,"more",checkboxName);

							 // 点击dataTable触发事件
                            com.leanway.dataTableClick(tableId, checkboxName, false,
                            		oTable, onClick);

//								$("#"+tableId+' input[type="checkbox"]').icheck({
//									labelHover : false,
//									cursor : true,
//									checkboxClass : 'icheckbox_flat-blue',
//									radioClass : 'iradio_flat-blue'
//								});
						}
					}).on('xhr.dt', function (e, settings, json) {
						com.leanway.checkLogind(json);
					} );
	return table;
}

var initPreTable = function(tableId, dataUrl, tableObject, defaultDataFunc, checkboxName, onClick) {
	var table = $("#"+tableId)
			.DataTable(
					{
						"ajax" : dataUrl,
						"iDisplayLength" : "8",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"sScrollY" : "250px", // DataTables的高
						//"sScrollX" : 400, // DataTables的宽
						"bAutoWidth" : true, // 宽度自适应
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",
						"columns" : [ {
							"data" : "salesorderid"
						}, {
							"data" : "code"
						}, {
							"data" : "contacts"
						}, {
							"data" : "salesdate"
						} ],
						"aoColumns" : [
								{
									"mDataProp" : "salesorderid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										 $(nTd).html(
													"<input class='regular-checkbox' type='checkbox' id='" + sData
				                                       + "' name='"+checkboxName+"' value='" + sData
				                                       + "'><label for='" + sData
				                                       + "'></label>");
									}
								}, {
									"mDataProp" : "code"
								}, {
									"mDataProp" : "contacts"
								}, {
									"mDataProp" : "salesdate"
								} ],
						"fnCreatedRow" : function(nRow, aData, iDataIndex) {
							// add selected class
						},
						"oLanguage" : {
				        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
				         },
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {
							com.leanway.getDataTableFirstRowId(tableId, onClick,"more",checkboxName);

							 // 点击dataTable触发事件
                            com.leanway.dataTableClick(tableId, checkboxName, false,
                            		preOTable, onClick);

//								$("#"+tableId+' input[type="checkbox"]').icheck({
//									labelHover : false,
//									cursor : true,
//									checkboxClass : 'icheckbox_flat-blue',
//									radioClass : 'iradio_flat-blue'
//								});
						}
					}).on('xhr.dt', function (e, settings, json) {
						com.leanway.checkLogind(json);
					} );
	return table;
}
//销售订单默认数据
function firstDataRowFunc() {

}

//预销售订单默认数据(Pre)
function firstPreDataRowFunc() {

}

//单击dataTable事件
function onClickDataTableFunc(salesOrderId) {

	getSalesOrderById(salesOrderId);
}

//单击dataTable事件(Pre)
function onClickPreDataTableFunc(salesOrderId) {

	getPreSalesOrderById(salesOrderId);
}

function getSalesOrderById(salesOrderId) {

	//初始化edit dataTables
	oDetailTable.ajax.url( '../../../'+ln_project+'salesOrderDetail?method=querySalesOrderDetail&conditions=' + encodeURI('{"salesorderid": "'+ salesOrderId + '"}') ).load();
}

function getPreSalesOrderById(salesOrderId) {

	//初始化edit dataTables
	preODetailTable.ajax.url( '../../../'+ln_project+'preSalesOrderDetail?method=querySalesOrderDetailByConditons&conditions=' + encodeURI('{"salesorderid": "'+ salesOrderId + '"}') ).load();
}

//自动填充表单数据（页面id须与bean保持一致）
function setFormValue(data) {
	resetPageForm();
	for ( var item in data) {
		$("#" + item).val(data[item]);
	}
}

var searchSalesOrder = function () {

	var searchVal = $("#searchValue").val();

	oTable.ajax.url("../../../"+ln_project+"/salesOrder?method=querySalesOrderByConditons&searchValue=" + searchVal).load();
}

var searchPreSalesOrder = function () {

	var searchVal = $("#searchValue2").val();

	preOTable.ajax.url("../../../"+ln_project+"/preSalesOrder?method=querySalesOrderByConditons&searchValue=" + searchVal).load();
}

// 数据table
var preOTable;
var oTable;

var preODetailTable;
var oDetailTable;

$(function(){

	oTable = initTable("salesOrderDataTable", "../../../"+ln_project+"/salesOrder?method=querySalesOrderByConditons", oTable, firstDataRowFunc, "checkList", onClickDataTableFunc);
	preOTable = initPreTable("preSalesOrderDataTable", "../../../"+ln_project+"/preSalesOrder?method=querySalesOrderByConditons", preOTable, firstPreDataRowFunc, "preCheckList", onClickPreDataTableFunc);

	oDetailTable = initEditDataTable();
	preODetailTable = initPreEditDataTable();

	com.leanway.loadTags();

	//全选
//	com.leanway.dataTableCheckAll("salesOrderDataTable", "checkAll", "checkList");
//	com.leanway.dataTableCheckAll("preSalesOrderDataTable", "preCheckAll", "preCheckList");

	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchSalesOrder);

	// enter键时候触发查询
 	com.leanway.enterKeyDown("searchValue2", searchPreSalesOrder);


});

