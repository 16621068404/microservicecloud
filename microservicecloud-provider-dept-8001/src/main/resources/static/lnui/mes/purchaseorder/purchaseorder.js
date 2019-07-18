var clicktime = new Date();
var opeMethod = "addPurchaseOrder";
var purchaseOrderTable;
var purchaseProductorTable;
var readOnlyObj = [{"id":"isexcess","type":"radio"}];
var reg = /,$/gi;

$ ( function ( ) {

	// 初始化对象
	com.leanway.loadTags();

	com.leanway.formReadOnly("purchaseOrderForm",readOnlyObj);

	// 初始化采购订单
	purchaseOrderTable = initPurchaseOrderTable();
	purchaseProductorTable = initPurchaseProductorTable();

	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchPurchaseOrder);

	 com.leanway.initSelect2("#companionid", "../../../../"+ln_project+"/company?method=queryCompanyBySelect2&contracttype=0", "供应商");

	 com.leanway.initTimePickYmdForMoreId("#salesdate,#requestdate,#producedate,#retestdate,#incomingdate,#producedate2,#retestdate2,#incomingdate2");
	 hiddenDocument();
	//加载数据验证
	initBootstrapValidator();
	$("input[name=checkstatus]").click(function(){
		searchPurchaseOrder();
	});
} );

/**
 * 新增采购订单
 */
var addPurchaseOrder = function ( ) {
	opeMethod = "addPurchaseOrder";
	com.leanway.clearTableMapData( "purchaseOrderTable" );
	com.leanway.dataTableUnselectAll("purchaseOrderTable", "checkList");
	com.leanway.removeReadOnly("purchaseOrderForm",readOnlyObj);
	showEditDocument();
	resetForm();
	$("#purchaseOrderForm").data('bootstrapValidator').resetForm();
	// 删除对应的产品数据
	delProductor(0);
	// 新增一行数据
	addProductor();
	//$("#salesdate").focus();
}

var updatePurchaseOrder = function ( ) {

	var data = purchaseOrderTable.rows('.row_selected').data();

	if (data.length == 0) {

		lwalert("tipModal", 1, "请选择采购订单修改!");
		return;

	} else if (data.length > 1) {

		lwalert("tipModal", 1, "请选择一条采购订单修改!");
		return;

	} else {
		opeMethod = "updatePurchaseOrder";
		com.leanway.clearTableMapData( "purchaseOrderTable" );
		com.leanway.removeReadOnly("purchaseOrderForm",readOnlyObj);
		$("#purchaseOrderForm").data('bootstrapValidator').resetForm();
		showEditDocument();
		purchaseProductorTableToEdit();
	}
}

/**
 * 保存采购订单
 */
var savePurchaseOrder = function ( ) {

	// 提交前先验证
	 $("#purchaseOrderForm").data('bootstrapValidator').resetForm();
	$("#purchaseOrderForm").data('bootstrapValidator').validate();

	if ($('#purchaseOrderForm').data('bootstrapValidator').isValid()) {

		var form  = $("#purchaseOrderForm").serializeArray();

		var formData = formatFormJson(form);

	    $.ajax({
			type : "post",
			url : "../../../../"+ln_project+"/salesOrder",
			data : {
				method : "savePurchaseOrder",
				conditions: formData,
			},
			dataType : "json",
			success : function(data) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					if (data.status == "error") {
						lwalert("tipModal", 1,data.info);
					} else {
						com.leanway.formReadOnly("purchaseOrderForm",readOnlyObj);
						com.leanway.clearTableMapData( "purchaseOrderTable" );

						if (opeMethod== "addPurchaseOrder" ) {
							purchaseOrderTable.ajax.reload();
						} else {
							purchaseOrderTable.ajax.reload(null,false);
						}

						lwalert("tipModal", 1,"保存成功");
					}

				}
			},
			error : function(data) {
				lwalert("tipModal", 1,"保存失败");
			}
		});

	}

}


// 重置表单数据
function resetForm() {
	$('#purchaseOrderForm')[0].reset(); // 清空表单
	$("#purchaseOrderForm input[type='hidden']").val("");
	$("#companionid").val(null).trigger("change");
    //$("#purchaseOrderForm").data('bootstrapValidator').resetForm();
};

/**
 * 关键字查询
 */
var searchPurchaseOrder = function ( ) {
	 var checkstatus =  $('input[name="checkstatus"]:checked').val();
     var searchValue = $("#searchValue").val();
     purchaseOrderTable.ajax.url("../../../../"+ln_project+"/salesOrder?method=querySalesOrderByConditons&checkstatus="+checkstatus+"&searchValue="+searchValue+"&orderkind=2&conditions="+encodeURI('{"orderkind": 2}')).load();
}

/**
 * 初始化采购订单
 */
var initPurchaseOrderTable = function ( ) {

	var table = $('#purchaseOrderTable').DataTable({
				"ajax" : '../../../../'+ln_project+'/salesOrder?method=querySalesOrderByConditons&orderkind=2&conditions='+ encodeURI('{"orderkind": 2}') ,
//				"iDisplayLength" : "8",
				'bPaginate' : true,
				"bDestory" : true,
				"bRetrieve" : true,
				"bFilter" : false,
				"bSort" : false,
				"scrollX": true,
				"scrollY":"200px",
				//"sScrollY" : 450, // DataTables的高
				//"sScrollX" : 400, // DataTables的宽
				"bAutoWidth" : true, // 宽度自适应
				"bProcessing" : true,
				"bServerSide" : true,
				'searchDelay' : "5000",
				"aoColumns" : [
						{
							"mDataProp" : "salesorderid",
							"fnCreatedCell" : function(nTd, sData,
									oData, iRow, iRow) {
								$(nTd).html("<div id='stopPropagation" + iRow +"'>"
										   +"<input class='regular-checkbox' type='checkbox' id='" + sData
	                                       + "' name='checkList' value='" + sData
	                                       + "'><label for='" + sData
	                                       + "'></label>");
		                           com.leanway.columnTdBindSelectNew(nTd,"purchaseOrderTable","checkList");
							}
						}, {
							"mDataProp" : "code"
						}, {
							"mDataProp" : "salesdate"
						}, {
							"mDataProp" : "requestdate"
						} , {
							"mDataProp" : "price"
						}, {
							"mDataProp" : "companioname"
						}, {
							"mDataProp" : "confirmstatus",
							"fnCreatedCell" : function(nTd, sData,oData, iRow, iCol) {
								$(nTd).html(confirmstatusToName(sData));
							}
						}],
				"fnCreatedRow" : function(nRow, aData, iDataIndex) {
					// add selected class
				},
				"oLanguage" : {
		        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		         },
				"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
				"fnDrawCallback" : function(data) {
					com.leanway.getDataTableFirstRowId("purchaseOrderTable", getOrderById,false,"checkList");

					 // 点击dataTable触发事件
                    com.leanway.dataTableClickMoreSelect("purchaseOrderTable", "checkList", false,  purchaseOrderTable, getOrderById,undefined,undefined,"checkAll");

                   // com.leanway.dataTableCheckAllCheck('salesOrderDataTable', 'checkAll', 'checkList');


				}
			}).on('xhr.dt', function (e, settings, json) {
				com.leanway.checkLogind(json);
			} );
	return table;
}

var initPurchaseProductorTable = function ( ) {
	var editTable = $("#purchaseProductorTable").DataTable({
			"ajax" : '../../../../'+ln_project+'/salesOrderDetail?method=querySalesOrderDetailByConditons&conditions=' + encodeURI('{"salesorderid": "1"}'),
			'bPaginate': false,
			"bRetrieve": true,
			"bFilter":false,
	//		"scrollX": true,
			"bSort": false,
			"bProcessing": true,
			"bServerSide": false,
			"aoColumns" : [
			{
				"mDataProp" : "salesorderdetailid",
				"fnCreatedCell" : function(nTd, sData,
						oData, iRow, iCol) {
					$(nTd).html("<input class='regular-checkbox' type='checkbox' id='" + sData
	                                   + "' name='purchaseProductorCheck' value='" + sData
	                                   + "'><label for='" + sData
	                                   + "'></label>");
					com.leanway.columnTdBindSelect(nTd);
				}
			},
			{
				"mDataProp" : "productorname"
			},
			{
				"mDataProp" : "productordesc",
			},
			{
				"mDataProp" : "version"
			},
			{
				"mDataProp" : "number"
			},
			{
				"mDataProp" : "price"
			},
			{
				"mDataProp" : "payment"
			},
			{
				"mDataProp" : "receivedcount"
			},
			{
				"mDataProp" : "unreceivedcount"
			},

			{
				"mDataProp" : "contractno"
			} ],
			"aoColumnDefs" : [ {
				"sDefaultContent": "",
				 "aTargets": [ "_all" ]
			} ],
			"language" : {
				"sUrl" : "../../../jslib/datatables/zh-CN.txt"
			},
			"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
			"fnDrawCallback" : function(data) {

			}

		}).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );
	return editTable;
}

var confirmstatusToName = function ( status ) {

	var result = "";

	switch (status) {
	case 0:
		result = "未收货";
		break;
	case 1:
		result = "收货中";
		break;
	case 2:
		result = "完成";
		break;
	default:
		result = "未收货";
		break;
	}

	return result;

}

/**
 * @prams orderId 订单标识
 */
var getOrderById = function ( orderId ) {

	 $("#purchaseOrderForm").data('bootstrapValidator').resetForm();

	// 只读
	com.leanway.formReadOnly("purchaseOrderForm",readOnlyObj);
	// 隐藏
	hiddenDocument();

	// 加载数据
	$.ajax( {
		type : "post",
		url : "../../../../"+ln_project+"/salesOrder",
		data : {
			method: "querySalesOrderById",
			conditions: '{"salesorderid":"' + orderId + '"}'
		},
		dataType: "json",
		success: function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				setFormValue(data.resultObj);

			}
		},
		error: function(data) {

		}
	});

	purchaseProductorTable.ajax.url( '../../../../'+ln_project+'/salesOrderDetail?method=querySalesOrderDetailByConditons&conditions=' + encodeURI('{"salesorderid": "'+ orderId + '"}') ).load();

}

/**
 * 赋值
 *
 * @param data
 */
function setFormValue( data ) {

	for ( var item in data ) {

		if ( item == "isexcess" ) {

			$("input[type=radio][name=isexcess][value=" + data[item] + "]").prop('checked','true');

		} else {

			if ( item != "searchValue" ) {
				$("#" + item).val(data[item]);
			}

		}

	}
	console.info(data.companioname);
	 var companionId = data.companionid;

	 if (companionId != "" && companionId != null && companionId != "null") {
    	setValueToSelect2Func("#companionid", companionId, data.companioname);
	 }
}

function setValueToSelect2Func(ctrlId, idVal, name) {
	$(ctrlId).append('<option value=' + idVal + '>' + name + '</option>');
    $(ctrlId).select2("val", [ idVal ]);
}

var showEditDocument = function ( ) {
	$("#saveFun").prop("disabled", false);
	$("#addProductorButton").prop("disabled", false);
	$("#delProductorButton").prop("disabled", false);
}

var hiddenDocument = function ( ) {
	$("#saveFun").prop("disabled",true);
	$("#addProductorButton").prop("disabled",true);
	$("#delProductorButton").prop("disabled",true);
}


// 格式化form数据
var  formatFormJson = function  (formData) {

	var reg=/,$/gi;

	var data = "{";

	for (var i = 0; i < formData.length; i++) {

		var val = formData[i].value;

		// 变成采购订单
		if (formData[i].name == "orderkind") {
			val = "2";
		}

		data += "\"" +formData[i].name +"\" : \""+val+"\",";

	}

	data += "\"salesOrderDetailList\" : "+getDataTableData(purchaseProductorTable)+",";
	data += "\"updateSalesOrder\" : "+getSelectDataTableData(purchaseOrderTable)+"";

//	data = data.replace(reg,"");

	data += "}";

	return data;
}

/**
 * 选中数据
 */
var getSelectDataTableData = function(tableObj) {

	var result = "{}";

	var dataList = tableObj.rows('.row_selected').data();

	if (dataList.length > 0) {
		result = JSON.stringify( dataList[0])
	}

	return  result ;
}


/**
 * tableObj datatable对象
 *
 * 获取Table对象数据
 */
var getDataTableData = function(tableObj) {

	var jsonData = "[";

	var dataList = tableObj.rows().data();

	if (dataList != undefined && typeof (dataList) != "undefined" && dataList.length > 0) {

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




/**
 * 新增一行
 */
var addProductor = function( ) {

	var orderId = $("#salesorderid").val();

	purchaseProductorTable.row.add({
		"salesorderdetailid" : "",
		"productorname" : "",
		"productordesc" : "",
		"number" : "",
		"price" : "",
		"payment" : "",
		"receivedcount" : "",
		"unreceivedcount" : "",
		"contractno" : "",
		"versionid" : "",
		"version" : "",
		"productorid":"",
		"salesorderid" : orderId
	}).draw(false);

	// 把新添加的行置成编辑模式
	// var index = purchaseProductorTable.rows().data().length - 1;

	purchaseProductorTableToEdit();
}

/**
 * 采购产品变成可编辑
 */
var purchaseProductorTableToEdit = function ( ) {

		if (purchaseProductorTable.rows().data().length > 0) {

			$("#purchaseProductorTable tbody tr").each( function( ) {

				// 获取该行的下标
				var index = purchaseProductorTable.row(this).index();

				// 产品编码
				var productorname = "<select id='productorname"+ index+ "'  name='productorname' class='form-control select2' style='width: 150px;'>";
				$(this).find("td:eq(1)").html(productorname);
				com.leanway.initSelect2("#productorname" + index,"../../../"+ln_project+"/productors?method=queryProductorBySearch","搜索产品");

				$("#productorname" + index).append('<option value='+ purchaseProductorTable.rows().data()[index].productorname+ '>'+ purchaseProductorTable.rows().data()[index].productorname+ '</option>');
				$("#productorname" + index).select2("val",purchaseProductorTable.rows().data()[index].productorname);

				// select选中数据后 触发事件
				$("#productorname" + index).on("select2:select",function(e) {
					com.leanway.initSelect2("#versionid"+index,
							"../../../"+ln_project+"/productors?method=queryProductorVersionsBySearch&productorid="+$(this).val(), "搜索版本");
					// 赋值
					purchaseProductorTable.rows().data()[index].productorid = $(this).val();
					purchaseProductorTable.rows().data()[index].productorname = $("#select2-productorname"+ index+ "-container").text();

					var tempTr = $(this).parents("tr")[0];
					//
					autoFillProductorInfo($(this).val(), index, tempTr);
				});
				
				// 产品名称
				var productordesc = purchaseProductorTable.rows().data()[index].productordesc;
				$(this).find("td:eq(2)").html('<input type="text" class="form-control" style="width: 150px" name="productordesc" id="productordesc" readonly value="'+ productordesc + '">');
				// 产品版本
				$(this).find("td:eq(3)").html("<select id='versionid"+ index+ "'  name='versionid' class='form-control select2' style='width: 150px;'>");
				com.leanway.initSelect2("#versionid"+index,
						"../../../"+ln_project+"/productors?method=queryProductorVersionsBySearch&productorid="+purchaseProductorTable.rows().data()[index].productorid, "搜索版本");
				$("#versionid" + index).append('<option value='+ purchaseProductorTable.rows().data()[index].versionid+ '>'+ purchaseProductorTable.rows().data()[index].version+ '</option>');
				$("#versionid" + index).select2("val",purchaseProductorTable.rows().data()[index].versionid);
				// select选中数据后 触发事件
				$("#versionid" + index).on("select2:select",function(e) {

					// 赋值
					purchaseProductorTable.rows().data()[index].versionid = $(this).val();
					purchaseProductorTable.rows().data()[index].version = $("#select2-productorname"+ index+ "-container").text();

				});
				// 数量
				var number = purchaseProductorTable.rows().data()[index].number;
				$(this).find("td:eq(4)").html('<input type="text" class="form-control" style="width: 60px" onblur="setDataTableValue(this, '+ index+ ',\'purchaseProductorTable\')" name="number" id="number" value="'+ number + '">');


				// 单价
				var price = purchaseProductorTable.rows().data()[index].price;
				$(this).find("td:eq(5)").html('<input type="text" class="form-control" style="width: 60px" onblur="setDataTableValue(this, '+ index+ ',\'purchaseProductorTable\')" name="price" id="price" value="'+ price + '">');

				// 总价
				var payment = purchaseProductorTable.rows().data()[index].payment;

				$(this).find("td:eq(6)").html('<input type="text" class="form-control" style="width: 60px" readonly name="payment" id="payment" value="'+ payment + '">');

				// 已收货数量
				var receivedcount = purchaseProductorTable.rows().data()[index].receivedcount;

				$(this).find("td:eq(7)").html('<input type="text" class="form-control" style="width: 60px" readonly name="receivedcount" id="receivedcount" value="'+ receivedcount + '">');

				// 未收货数量
				var unreceivedcount = purchaseProductorTable.rows().data()[index].unreceivedcount;
				$(this).find("td:eq(8)").html('<input type="text" class="form-control" style="width: 60px"  readonly name="unreceivedcount" id="unreceivedcount" value="'+ unreceivedcount + '">');

				// 合同号
				var contractno = "<select id='contractno"+ index+ "'  name='contractno' class='form-control select2' style='width: 150px;'>";
				$(this).find("td:eq(9)").html(contractno);
				com.leanway.initSelect2("#contractno" + index, "../../../../"+ln_project+"/contract?method=queryContractBySelect2&contractType=2", "搜索合同号");

				$("#contractno" + index).append('<option value='+ purchaseProductorTable.rows().data()[index].contractno+ '>'+ purchaseProductorTable.rows().data()[index].contractno+ '</option>');
				$("#contractno" + index).select2("val",purchaseProductorTable.rows().data()[index].contractno);

				// select选中数据后 触发事件
				$("#contractno" + index).on("select2:select",function(e) {

					// 赋值
					purchaseProductorTable.rows().data()[index].contractid = $(this).val();

					purchaseProductorTable.rows().data()[index].contractno = $("#select2-contractno"+ index+ "-container").text();


				});

			});

			purchaseProductorTable.columns.adjust();
		}
}

/**
 * 删除产品
 *
 * @pram type 0：删除全部数据，1：选中checkbox数据
 *
 */
var delProductor = function ( type ) {

	// 删除选中行的数据
	if ( type == 1 ||  type == undefined || typeof(type) == "undefined") {

		$("#purchaseProductorTable tbody tr").each(function() {

			// 获取该行的下标
			var index = purchaseProductorTable.row(this).index();

			if ($(this).find("td:eq(0)").find("input[name='purchaseProductorCheck']").prop("checked") == true) {
				purchaseProductorTable.rows(index).remove().draw(false);
			}

		});

	} else if ( type == 0 ) {

		$("#purchaseProductorTable tbody tr").each(function() {

			// 获取该行的下标
			var index = purchaseProductorTable.row(this).index();

			purchaseProductorTable.rows(index).remove().draw(false);

		});
	}
}

//根据产品ID查询出对应的计量单位填充到DataTable
var autoFillProductorInfo = function(productorId, index, tempTr) {

	$.ajax({
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
//						var unitsid = tempData.unitsname;
						tempTr.cells[2].children[0].value = tempData.productordesc;
//
//						// DataTable赋值
						purchaseProductorTable.rows().data()[index].productorid = tempData.productorid;
						purchaseProductorTable.rows().data()[index].productordesc = tempData.productordesc;
						purchaseProductorTable.rows().data()[index].unitsid = tempData.purchaseunits;
						purchaseProductorTable.rows().data()[index].unitsname = tempData.purchaseunitsname;

					}
				}
			});
}

//改变DataTable对象里的值
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
var checkPurchaseOrder = function(type){
	var ids = com.leanway.getCheckBoxData(1, "purchaseOrderTable", "checkList");
	if (ids.length > 0) {

		var msg = "确定" + ids.split(",").length + "条采购订单通过审核吗?";

		lwalert("tipModal", 2, msg ,"isSureCheck()");
	} else {
		lwalert("tipModal", 1,"至少选择一条记录操作");
	}
}

function isSureCheck(){
	var ids = com.leanway.getCheckBoxData(1, "purchaseOrderTable", "checkList");
	updateCheckStatus(ids);
}
//删除Ajax
var updateCheckStatus = function(ids) {

	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/salesOrder",
		data : {
			method : "updateCheckStatus",
			conditions : '{"salesorderids":"' + ids + '"}'
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				if (data.status == "success") {

					com.leanway.clearTableMapData( "purchaseOrderTable" );
					purchaseOrderTable.ajax.reload(); // 刷新dataTable				
				} 
				lwalert("tipModal", 1,data.info);
			}
		}
	});
}
var deletePurchaseOrder = function ( type ) {

    if (type == undefined || typeof(type) == "undefined") {
		type = 1;
	}

	var ids = com.leanway.getCheckBoxData(type, "purchaseOrderTable", "checkList");

	if (ids.length > 0) {

		var msg = "确定删除选中的" + ids.split(",").length + "条采购订单?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
//		var ids = str.substr(0, str.length - 1);
//		if (confirm("确定要删除选中的销售订单吗?")) {
//			deleteAjax(ids);
//		}
	} else {
//		alert("至少选择一条记录操作");
		lwalert("tipModal", 1,"至少选择一条记录操作");
	}
}

function isSureDelete(type){
	var ids = com.leanway.getCheckBoxData(type, "purchaseOrderTable", "checkList");
	deleteAjax(ids);
}
// 删除Ajax
var deleteAjax = function(ids) {

	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/salesOrder",
		data : {
			method : "updateSalesOrderStatusByConditons",
			conditions : '{"salesorderids":"' + ids + '", "status":"' + 1 + '"}'
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				if (data.status == "success") {

					com.leanway.clearTableMapData( "purchaseOrderTable" );
					purchaseOrderTable.ajax.reload(); // 刷新dataTable

	//				alert("删除成功!");
					lwalert("tipModal", 1,data.info);
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1,data.info);
				}

			}
		}
	});
}

function initBootstrapValidator( ) {
	//对应的表单id
	$('#purchaseOrderForm').bootstrapValidator({
		excluded : [ ':disabled' ],
		fields : {
			salesdate : {
				validators : {
					notEmpty : {}
				}
			},
			requestdate : {
				validators : {
					notEmpty : {}
				}
			},
			companionid: {
				validators: {
					notEmpty: {	}
				}
			}
		}
	})
	$('#labelPrintDivForm').bootstrapValidator({
		excluded : [ ':disabled' ],
		fields : {
			netweight : {
				validators : {
					notEmpty : {}
				}
			},
			batch : {
				validators : {
					notEmpty : {}
				}
			},
			retestdate : {
				validators : {
					notEmpty : {}
				}
			}
		}
	})
	// 表单验证-入库弹框
	$('#form_addWarehousing').bootstrapValidator({
		excluded : [ ':disabled' ],
		fields : {
			netweight2 : {
				validators : {
					notEmpty : {}
				}
			},
			batch2 : {
				validators : {
					notEmpty : {}
				}
			},
			producedate2 : {
				validators : {
					notEmpty : {}
				}
			},
			retestdate2 : {
				validators : {
					notEmpty : {}
				}
			}
		}
	})
}

/**
 * 打印收货标签
 *
 *
 */
function printLabel(){


		var detailid = com.leanway.getDataTableCheckIds("purchaseProductorCheck");

		if (detailid.length == 0) {

			lwalert("tipModal", 1, "请选择一条采购订单明细进行打印!");
			return;

		} else if (detailid.split(",").length > 1) {

			lwalert("tipModal", 1, "请选择一条采购订单明细进行打印!");
			return;

		} else {


			 var purchaseid = $("#purchaseid").val();
			// 弹出模态框，填写打印信息，默认显示已有信息
			loadAddLabelPrintData(detailid);

		}
	}

/**
 * 加载新增安装参数
 */
var loadAddLabelPrintData = function (purchasedetailid) {

	$.ajax ( {
		type : "post",
		url : "../../../../" + ln_project + "/salesOrderDetail",
		data : {
			"method" : "querySalesOrderDetailById",
			"conditions" : "{\"salesorderdetailid\":\""+purchasedetailid+"\",\"status\":\"0\"}"
		},
		dataType : "json",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {

				if (data.status == "success") {


					var	productorkind = data.resultObj.productorkind;



					// 若为原料或料体，显示毛重
					if(productorkind.indexOf("06") !=-1||productorkind.indexOf("32")!=-1||productorkind.indexOf("12")!=-1){

						$("#grossweight").show();
						$("#netweight1").html("净重");
						$("#casespecification").hide();

						if(productorkind.indexOf("06") !=-1){

							$("#environment").show();

						}else{
							$("#environment").hide();
						}


					}else{



						$("#grossweight").hide();
						$("#netweight1").html("装箱数量");
						$("#casespecification").show();
						$("#environment").hide();

					}
					setLabelPrintFormVal( data.resultObj );




					// 弹出modal
					$('#labelPrintDiv').modal({backdrop: 'static', keyboard: true});

				} else {

					lwalert("tipModal", 1, "打印失败！");

				}

			}
		}
	});

}

var setLabelPrintFormVal = function ( data ) {

	
	
	for ( var item in data ) {


// if(item=="netweight"||item=="number"){
// $("#" + item).val(data[item]+"("+data.unitsname+")");
// }else{
			$("#" + item).val(data[item]);
// }


	}
	$("#unitsname").html(data.unitsname);
	$("#unitsname1").html(data.unitsname);

	$("#plannumber").val(data.number);
	$("#orderid").val(data.salesorderdetailid);
}

// 根据采购订单明细生成备料标签
function saveLabelData() {

	//如果为不可超收，数量不能大于采购订单明细数量
	var isexcess = $('input[type="radio"][name="isexcess"]:checked').val();
	var plannumber = $("#plannumber").val();
	var number = $("#number").val();

	if((isexcess=="0"||isexcess==0)&&Number(number)>Number(plannumber)){
		
			lwalert("tipModal", 1, "该订单为不可超收，采购数量不能大于采购订单中的数量");
			
	// 提交前先验证
	}else{
		 $("#labelPrintDivForm").data('bootstrapValidator').resetForm();
			$("#labelPrintDivForm").data('bootstrapValidator').validate();

			if ($('#labelPrintDivForm').data('bootstrapValidator').isValid()) {
					
					var form  = $("#labelPrintDivForm").serializeArray();
				
					// 将数据转换成json数据
					var formData = formatFormJson2(form);
				
					$.ajax ( {
						type : "post",
						url : "../../../../" + ln_project + "/labeldata",
						data : {
							"method" : "saveLabelDatas",
							"formData" : formData
						},
						dataType : "json",
						async : false,
						success : function ( data ) {
				
							var flag =  com.leanway.checkLogind(data);
				
							if ( flag ) {
				
								if (data.status == "success") {
				
									$('#labelPrintDiv').modal('hide');
				
									// 打印数据传递
									var message = data.labelDateList;
				
									var productorkind = data.productortypecode;
				
									var printName = data.labelname;
				
									var printFile="bcbzbq";
				
				
									// 根据产品类型对应不同模板
									/**
									 * 原材料：06；客供原料：32 原材料-包材：14；原材料-客供包材：31
									 * 原材料-客供料体：12；半成品-料体：33 半成品-部品：15；原材料-客供部品：34
									 * 产成品：01；产成品-套装：11
									 */
									if(productorkind.indexOf("06") !=-1||productorkind.indexOf("32")!=-1){
				
										printFile="ylbzbq";
									}
				                   if(productorkind.indexOf("14") !=-1||productorkind.indexOf("31")!=-1){
				
				                	   printFile="bcbzbq";
									}
				                   if(productorkind.indexOf("12") !=-1){
				
				                	   printFile="kgltllbq";
									}
				                   if(productorkind.indexOf("15") !=-1){
				
				                	   printFile="kgbpbq";
									}
				

				                   com.leanway.sendReportData(printName, printFile,message);
//									var report =  "\"Reports\":{\"printName\":\""+printName+"\",\"printFile\": \""+printFile+"\",\"ConnectionString\":\"\",\"QuerySQL\":\"\",\"DetailGrid\":{\"Recordset\": {\"ConnectionString\": \"xml\",\"QuerySQL\": \"\"},\"PrintPreview\":true}}"
//									message = "{\"detail\":"+message+","+report+"}";
				
//									com.leanway.webscoket.client.send(message);
				
				
								} else {
									lwalert("tipModal", 1, data.info);
								}
				
							}
						}
					});
			
			}
	}



}

var sureSaveLabel = function ( ) {
	
	    var listLabel  = $("#listLabel").val();
		
		$.ajax({
			type : "post",
			url : "../../../../" + ln_project + "/labeldata",
			data : {
				"method" : "saveLabelDataList",
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
						lwalert("tipModal", 1, text.info);
					}
					
				}
	
			},
			error : function() {
	
				lwalert("tipModal", 1, "error异常，请重试或联系管理员！");
	
			}
	
		});

}

//格式化form数据
var formatFormJson2 = function(formData) {
	var reg = /,$/gi;
	var data = "{";
	for (var i = 0; i < formData.length; i++) {
		data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
	}


	var companionid  = $("#companionid").val();
	data += "\"companionid\" : \"" + companionid + "\",";
	var salesorderid  = $("#salesorderid").val();
	data += "\"currenttableheadid\" : \"" + salesorderid + "\",";
	data = data.replace(reg, "");
	data += "}";
	return data;
}

var calPurchaseOrder = function ( ) {
	
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "addProductionOrder"
		},
		dataType : "json",
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {

				lwalert("tipModal", 1, text.info);
				
				purchaseOrderTable.ajax.reload();

			}

		},
		error : function() {
			lwalert("tipModal", 1, "error");
		}
	});
	
}


/**
 * 设置采购入库
 * 逻辑：
 * 	1，验证参数
 * 	2，设置页面参数
 * 	3，显示弹框
 */
function createLabel(){
	//===== 1.首先判断入库明细是否选中，如果选中，继续执行；否则，返回提示信息 ======//
	var type = "1";// 初始化参数:type 1:当前页面的数据，2：跨页数据
	var id_detail = com.leanway.getCheckBoxData(type, "purchaseProductorTable", "purchaseProductorCheck");
	if(id_detail == null || id_detail.trim() == null || id_detail.trim() == ""){
		lwalert("tipModal", 1, "至少选择一条入库明细进行操作");
		return;
	}
	
	//===== 2.根据选择明细，查询后，存值到弹框  ======//
	var detailid = com.leanway.getDataTableCheckIds("purchaseProductorCheck");
	var detailObj = $("#purchaseProductorTable").DataTable().rows('.row_selected').data()[0];
	if (detailid.length == 0) {
		lwalert("tipModal", 1, "请选择一条采购订单明细进行打印!");
		return;
	} else if (detailid.split(",").length > 1) {
		lwalert("tipModal", 1, "请选择一条采购订单明细进行打印!");
		return;
	} else {
		// 弹出模态框，填写打印信息，默认显示已有信息
		$.ajax({
			type : "post",
			url : "../../../../" + ln_project + "/salesOrderDetail",
			data : {
				"method" : "querySalesOrderDetailById",
				"conditions" : "{\"salesorderdetailid\":\""+detailid+"\",\"status\":\"0\"}"
			},
			dataType : "json",
			async : false,
			success : function (data) {
				var flag =  com.leanway.checkLogind(data);
				if (flag) {
					if (data.status == "success") {
						// 把查询到的明细信息放入模态框[基础信息]
						if(data.resultObj == null){
							lwalert("tipModal", 1, "入库失败");
							return;
						}
						var obj = data.resultObj;
						$("#companioname2").val(obj.companioname);
						$("#compid2").val(obj.compid);
						$("#compname2").val(obj.compname);
						$("#productorname2").val(obj.productorname);
						$("#productordesc2").val(obj.productordesc);
						$("#material2").val(obj.material);
						$("#code2").val(obj.code);
						// 批次号默认为时间戳
						$("#batch2").val("B"+(new Date()).getTime());
						$("#number2").val(obj.number);
						// 入库数量默认为采购数量
						$("#netweight2").val(obj.number)
						$("#productorid2").val(detailObj.productorid);
						// 把查询到的明细信息放入模态框[特殊字段]
						// 根据产品类型， 页面显示不同字段名称
						var productorkind = obj.productorkind;
						// 若为原料或料体，显示毛重
						if(productorkind.indexOf("06") !=-1||productorkind.indexOf("32")!=-1||productorkind.indexOf("12")!=-1){
							// 此处逻辑按照【打印】功能实现
							$("#div_grossweight2").show();
							$("#div_netweight2").html("净重");
							$("#div_casespecification2").hide();
							if(productorkind.indexOf("06") !=-1){
								$("#div_environment2").show();
							}else{
								$("#div_environment2").hide();
							}
						// 否则，显示装箱数量
						}else{
							$("#div_grossweight2").hide();
							$("#div_netweight2").html("装箱数量");
							$("#div_casespecification2").show();
							$("#div_environment2").hide();
						}
						$("div.div_unitsname2").html(obj.unitsname);
						$("#plannumber2").val(obj.number);
						$("#orderid2").val(obj.orderid);
						$("#versionid2").val(obj.versionid);
						$("#currenttableheadname2").val(obj.currenttableheadname);
						$("#resource2").val(obj.resource);
						$("#productorkind2").val(obj	.productorkind);
						
						
						// 弹出modal
						$('#warehousingModel').modal({backdrop: 'static', keyboard: true});
						// $("#warehousingModel").modal("show");
					} else {
						lwalert("tipModal", 1, "入库失败！");
					}
				}
			}
		});
	}
}

/**
 * 保存标签
 * 逻辑：
 * 	1，保存标签
 * 	2，调用PDA批入方法
 * 	3，
 */
function saveLabel(){
	// 获取采购订单主体信息-是否可超收：0：否；1：是
	var isexcess = $('input[type="radio"][name="isexcess"]:checked').val();
	// 获取计划数量
	var plannumber = $("#plannumber2").val();
	// 获取采购数
	var number = $("#number2").val();
	// 如果数量不可超收，且采购数量大于计划数量
	if((isexcess=="0"||isexcess==0)&&Number(number)>Number(plannumber)){
		lwalert("tipModal", 1, "该订单为不可超收，采购数量不能大于采购订单中的数量");
	// 提交前先验证
	}else{
		// 清除前一次的验证失败的错误信息
		$("#form_addWarehousing").data('bootstrapValidator').resetForm();
		// 表单验证
		$("#form_addWarehousing").data('bootstrapValidator').validate();
		// 如果验证成功
		if ($('#form_addWarehousing').data('bootstrapValidator').isValid()) {
			// 获取表单所有信息(返回的是一个数组)
			var formArray  = $("#form_addWarehousing").serializeArray();
			// 数组转json字符串
			var formDataString = formatFormJson2(formArray);
			// 因为后台，直接是formData转的对象，现在json对象的key里面包含了数值2，比如：order ，现在是order2，所以要把它去掉；
			// json字符串转json对象
			var formDataJson = JSON.parse(formDataString);
			// 遍历json
			$.each(formDataJson,function(key,value) {
				// 如果key包含2
				if(key.indexOf(key) >= 0){
					// 删除掉当前的键值对
					delete formDataJson[key];
					// 添加新的键值对
					formDataJson[key.replace("2","")] = value;
				}
			});
			formDataString = JSON.stringify(formDataJson);
			// 保存标签信息
			$.ajax ( {
				type : "post",
				url : "../../../../" + ln_project + "/labeldata",
				data : {
					"method" : "saveLabelDatas",
					"formData" : formDataString
				},
				dataType : "json",
				async : false,
				success : function ( data ) {
					var flag =  com.leanway.checkLogind(data);
					if ( flag ) {
						if (data.status == "success") {
							// 如果成功，隐藏弹框
							$("#warehousingModel").modal("hide");
							// 如果成功，下面继续执行入库步骤；1，生成收货明细；2，确认入库
							console.log("标签生成成功");
							// lwalert("modelid", 3, "标签生成成功！", function(){});
							// 获取label信息
							if(data.labelDateList == null || data.labelDateList == ""){
								// 标签信息返回异常
								lwalert("tipModal", 1, "入库失败");
								return;
							}
							// list字符串转数组
							var labelDetailArray = JSON.parse(data.labelDateList);
							// 验证转换后的Json,防止转换异常结果为空
							if(labelDetailArray == null || labelDetailArray == "" || labelDetailArray.length == 0){
								// 标签信息转换异常
								lwalert("tipModal", 1, "入库失败");
								return;
							}
							// 页面通过批入方式，所以取出任意一个labelid
							var labelid = labelDetailArray[0].labelid
							$.ajax({
								type: "POST",
								url: "../../../../" + ln_project + "/labeldata",
								data: {
									"method" : "queryLabelDataInfoBatch",
									"tablename" : "1",// 这个参数没用，后台代码没用到，随便传
									"labelid" : labelid,
									"type" : "0"
								},
								dataType: 'json',
								success: function(data){
									if(data.status = "success"){
										// 获取返回参数，封装页面明细列表
										console.log("入库明细data信息：" + data)
										var labelDataConditions = data.labelDataConditions;
										console.log("labelDataConditions="+labelDataConditions);
										if(labelDataConditions == null || labelDataConditions == "" || typeof(labelDataConditions) == "undefind"){
											console.log("查询失败");
											lwalert("tipModal", 1, "入库失败");
											return;
										}
										// 设置头部
										$("#label_productorshortname").val(labelDataConditions.productorshortname);
										$("#label_productorname").val(labelDataConditions.productorname);
										$("#label_batch").val(labelDataConditions.batch);
										$("#label_count").val(labelDataConditions.netweight);
										$("#label_productorshortname").val(labelDataConditions.productordesc);
										$("#detail_code").val(labelDataConditions.code);
										// 首先清空table
										$("table.table_label tr.tr_detail_list").empty();
										// 设置列表
										$.each(labelDetailArray,function(key,val) {
											var tr = "<tr class='tr_detail_list'>";
											tr += "<td><input type='checkbox' name='detailid' value='"+val.labelid+"'></td>";
											tr += "<td>"+(parseInt(key)+1)+"</td>";
											tr += "<td name='caseno'>"+val.caseno+"</td>";
											tr += "<td name='count'>"+val.netweight+"</td>";
											tr += "<td>" +
													"<input type='number' class='conversionrate' min='0' max='100000' name='conversionrate1' value='1'></input>" +
													"/"+ 
													"<input type='number' class='conversionrate' min='0' max='100000' name='conversionrate2' value='1'></input>" +
													"</td>";
											// 下面是隐藏的字段
											tr += "<td class='hide' name='mapid'>"+val.mapid+"</td>";
											tr += "<td class='hide' name='productorid'>"+val.productorid+"</td>";
											tr += "<td class='hide' name='batch'>"+val.batch+"</td>";
											tr += "<td class='hide' name='versionid_detail'>"+val.versionid+"</td>";
											tr += "<td class='hide' name='stockunits'>"+val.stockunits+"</td>";
											tr += "<td class='hide' name='producedate'>"+val.producedate+"</td>";
											tr += "<td class='hide' name='salesorderdetailid'>"+val.orderid+"</td>";
											tr += "</tr>";
											$("table.table_label").append(tr);
										});
										// 仓库信息
										$.ajax({
											url: "../../../../" + ln_project + "/companyMap",
											type: "post",
											data: {
												"method" : "queryAllMap"
											},
											dataType: "json",
											success: function(msg){
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
										
										// 交易类型
										$.ajax({
											url: "../../../../" + ln_project + "/codeMap",
											type: "post",
											data: {
												"method" : "queryCodeMapList",
												"t":"MaterialOutgoingList",
												"c":"MaterialOutgoingList"
											},
											dataType: "json",
											success: function(data){
												// 设置交易类型
												$("#tradetype").empty();
												var option = "<option value='4D-Cxx-001'>--请选择--</option>";
												$.each(data,function(index,e) {
													option += "<option value='"+ e.codevalue +"'>";
													option += e.note;
													option += "</option>";
												});
												
												$("#tradetype").append(option);
											}
										});
										
										// 弹框显示
										$("#warehousingDetailModel").modal("show");
									}else{
										// 如果不成功，返回提示
										lwalert("tipModal", 1, data.info);
									}
								}
							});
						}else{
							// 如果不成功，返回提示
							lwalert("tipModal", 1, data.info);
						}
					}
				}
			});
		}
	}
}

/**
 * 确认入库
 * 逻辑：
 *  1，验证参数
 *  2，封装参数
 * 	3，发送请求
 */
function confirmDetail(){
	// 判断仓库是否选中
	if($("#select_map").val() == null || $("#select_map").val() == ""){
		lwalert("tipModal", 1, "请选择仓库信息");
		return false;
	}
	// 判断换算率是否选中
	var conversionrateList = $("table.table_label").find("input.conversionrate");
	var flag = true;
	$(conversionrateList).each(function(index,e){
		if(e.value == "" || e.value == null){
			flag = false;
			return false;
		}
	})
	if(!flag){
		lwalert("tipModal", 1, "请确认换算率填写完整");
		return false;
	}
	
	// 获取选中明细，封装数据
	// 主体
	var obj = new Object();
	obj.code = $("#detail_code").val();
	// 明细
	obj.additionalDetailList = new Array();
	$("[name='detailid']").each(function(index,e){ //遍历，将所有选中的值放到数组中
		// 如果选中，获取到这一行的数据，封装到对象中
		if($(this).prop('checked') == true){
			var tr = $(this).parent("td").parent("tr");
			// 获取到这一行的td的值
			var ad = new Object();
			ad.mapid = $("#select_map").val();
			ad.count = parseInt($(tr).children("td[name='count']").text());
			ad.productorid = $(tr).children("td[name='productorid']").text();
			ad.batch = $(tr).children("td[name='batch']").text();
			ad.versionid = $(tr).children("td[name='versionid_detail']").text();
			ad.labelid = $(tr).children("td").children("input[name='detailid']").val();
			ad.stockunits = $(tr).children("td[name='stockunits']").text();
			var date = $(tr).children("td[name='producedate']").text();
			ad.producedate = (date == null || date == "")?null:dateFormat1(new Date(date.trim()));
			ad.salesorderdetailid = $(tr).children("td[name='salesorderdetailid']").text();
			ad.conversionrate = $("input[name='conversionrate1']").val()+"/"+$("input[name='conversionrate2']").val();
			ad.tradetype = $("#tradetype").val();
			obj.additionalDetailList.push(ad);
		}
    }); 
	// 判断是否选中
	if(obj.additionalDetailList.length == 0){
		lwalert("tipModal", 1, "请选择入库明细");
		return;
	}
	// 提交入库
	$.ajax({
		type: "POST",
		url: "../../../../" + ln_project + "/deliveryOrder",
		data: {
			"method" : "saveDeliveryOrder",
			"formData" : JSON.stringify(obj),
			"type" : 0
		},
		dataType : "json",
		success: function(msg){
			// 弹框隐藏
			$("#warehousingDetailModel").modal("hide");
			if(msg.status == "success"){
				// 隐藏弹框
				lwalert("tipModal", 1, msg.info);
			}else{
				lwalert("tipModal", 1, msg.info);
			}
		}
	});
}

// 选中所有明细
function detail_selectAll(){
	// 首先判断状态是未选中，还是已选中。如果是未选中，则让所有的选中；如果是已选中，则让所有的都未选中
	// 如果已选中
	if($("#label_selectAll").prop('checked')){
		$("[name='detailid']").prop("checked",true);
	// 如果未选中
	}else{
		$("[name='detailid']").prop("checked",false);
		
	}
}

// 日期格式化带时间
function dateFormat1(date) {
    var datetime = date.getFullYear()
            + "-"// "年"
            + ((date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : "0"
                    + (date.getMonth() + 1))
            + "-"// "月"
            + (date.getDate() < 10 ? "0" + date.getDate() : date
                    .getDate()) + " " + "00:00:00";
    return datetime;
}