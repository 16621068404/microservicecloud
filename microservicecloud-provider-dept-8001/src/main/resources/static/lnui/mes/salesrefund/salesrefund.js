var clicktime = new Date( );
var opeMethod = "";
var refundTable;
var refundDetailTable;
var reg=/,$/gi;

$ ( function ( ) {

	// 初始化对象
	com.leanway.loadTags();
	
	com.leanway.formReadOnly("refundForm");
	
	// 初始退货单
	refundTable = initRefundTable();
	refundDetailTable = refundDetailTable( );
	
	 com.leanway.initSelect2("#deliveryid", "../../../../"+ln_project+"/invoice?method=queryInvoiceNumber", "发货单号");
	 
	 com.leanway.initTimePickYmdHmsForMoreId("#refunddate");
	 
	 // select选中数据后 触发事件
	 $("#deliveryid" ).on( "select2:select", function ( e ) {
		 
		 var searchVal = $("#searchValue").val();
		 
		 refundDetailTable.ajax.url( '../../../../'+ln_project+'/refund?method=queryPurchaseRefundDetail&type=3&id=' + $(this).val( ) ).load();
	 });
	 
	 // 已确认/未确认
	 $("input[name=confirmstatusradio]").click( function( ) {
		 
		// 关键字
		var searchValue = $("#searchValue").val();
 
		refundTable.ajax.url( '../../../../'+ln_project+'/refund?method=querySalesRefundList&confirmstatus=' +  $(this).val( ) + "&searchValue=" + searchValue ).load();
	 });
	 
	com.leanway.enterKeyDown("searchValue", searchValueFun);
 
} );

var searchValueFun = function ( ) {
	// 关键字
	var searchVal = $("#searchValue").val();
	
	// 0：未确认，1：已确认
	var confirmstatus =  $('input[name="confirmstatusradio"]:checked').val();

	refundTable.ajax.url( '../../../../'+ln_project+'/refund?method=queryPurchaseRefundList&searchValue=' + searchVal +"&confirmstatus=" + confirmstatus).load();
}



/**
 * 新增按钮
 */
var addRefund = function ( ) {
	opeMethod = "addRefund";
	com.leanway.dataTableUnselectAll("refundTable", "checkList");
	com.leanway.removeReadOnly("refundForm");

	resetForm();
	//$("#purchaseOrderForm").data('bootstrapValidator').resetForm();
	
	refundDetailTable.ajax.url( '../../../../'+ln_project+'/refund?method=queryPurchaseRefundDetail' ).load();
	
}

/**
 * 修改按钮
 */
var updateRefund = function ( ) {
	
	var data = refundTable.rows('.row_selected').data();

	if (data.length == 0) {
		
		lwalert("tipModal", 1, "请选择退货单修改!");
		return;
		
	} else if (data.length > 1) {
		
		lwalert("tipModal", 1, "请选择一条退货单单修改!");
		return;
		
	} else {
		com.leanway.clearTableMapData( "refundTable" );
		//com.leanway.removeReadOnly("refundForm");
		//$("#refundForm").data('bootstrapValidator').resetForm();
 
	}
	
	var confirmstatus =  $('input[name="confirmstatusradio"]:checked').val();
	
	if (confirmstatus == "1") {

		lwalert("tipModal", 1,"已确认的退货单不能修改！");
		return;
	}
	
	
	opeMethod = "updateRefund";
	
	showEditDocument();
	
	editRefundDetailTable( );
}



/**
 * 保存按钮
 */
var saveRefund = function ( ) {
	 
	var form  = $("#refundForm").serializeArray();
	
	var formData = formatFormJson(form);
	 
    $.ajax( {
		type : "post",
		url : "../../../../"+ln_project+"/refund",
		data : {
			method : opeMethod,
			conditions: formData,
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {

				if ( data.status == "error" ) {
					lwalert("tipModal", 1,data.info);
				} else {
					
					com.leanway.formReadOnly("refundForm");
					com.leanway.clearTableMapData( "refundTable" );
					
					if ( opeMethod == "addRefund" ) {
						refundTable.ajax.reload();
					} else {
						refundTable.ajax.reload(null,false);
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

var deleteRefundOrder = function ( type ) {
	
    if ( type == undefined || typeof( type ) == "undefined" ) {
    	type = 1;
	}

	var ids = com.leanway.getCheckBoxData(type, "refundTable", "checkList");

	if (ids.length > 0) {
		
		var confirmstatus =  $('input[name="confirmstatusradio"]:checked').val();
		
		if (confirmstatus == "1") {

			lwalert("tipModal", 1,"已确认的退货单不能删除！");
			return;
		}

		var msg = "确定删除选中的" + ids.split(",").length + "条退货单?";

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

var isSureDelete = function (type) {
	var ids = com.leanway.getCheckBoxData(type, "refundTable", "checkList");
	deleteAjax(ids);
}

// 删除Ajax
var deleteAjax = function( ids ) {

	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/refund",
		data : {
			method : "updateRefundStatus",
			"ids" : ids
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {

				if (data.status == "success") {

					com.leanway.clearTableMapData( "refundTable" );
					refundTable.ajax.reload(); // 刷新dataTable

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

var confirmRefund = function ( ) {
	
	
	var ids = com.leanway.getCheckBoxData(1 , "refundTable", "checkList");

	if ( ids.length > 0 ) {
		
		var confirmstatus =  $('input[name="confirmstatusradio"]:checked').val();
		
		if (confirmstatus == "1") {

			lwalert("tipModal", 1,"已确认的退货单不能再次确认！");
			return;
		}

		var msg = "选中的" + ids.split(",").length + "条退货单是否确认退货?";

		lwalert("tipModal", 2, msg ,"isSureConfirm()");
//		var ids = str.substr(0, str.length - 1);
//		if (confirm("确定要删除选中的销售订单吗?")) {
//			deleteAjax(ids);
//		}
	} else {
//		alert("至少选择一条记录操作");
		lwalert("tipModal", 1,"至少选择一条记录操作");
	}
	
}

/**
 * 确认退货
 */
var isSureConfirm = function ( ) {
	
	var ids = com.leanway.getCheckBoxData(1, "refundTable", "checkList");
	
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/refund",
		data : {
			method : "updateRefundConfirmStatus",
			"ids" : ids,
			"type": "2"
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {

				if (data.status == "success") {

					com.leanway.clearTableMapData( "refundTable" );
					refundTable.ajax.reload(); // 刷新dataTable

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


//格式化form数据
var  formatFormJson = function  (formData) {
 
	var data = "{";

	for (var i = 0; i < formData.length; i++) {

		var val = formData[i].value;
		
		// 变成采购退货单
		if (formData[i].name == "refundtype") {
			val = "2";
		}
		
		data += "\"" +formData[i].name +"\" : \""+val+"\",";

	}
	
	data += "\"refundDetailList\" : " + getDataTableData( refundDetailTable ) +"";
	 
	
//	data = data.replace(reg,"");

	data += "}";

	return data;
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



var initRefundTable = function ( ) {
	
	var table = $('#refundTable').DataTable({
		"ajax" : '../../../../'+ln_project+'/refund?method=querySalesRefundList',
//		"iDisplayLength" : "8",
		'bPaginate' : true,
		"bDestory" : true,
		"bRetrieve" : true,
		"bFilter" : false,
		"bSort" : false,
		"scrollX": true,
		/*"scrollY":"200px",*/
		//"sScrollY" : 450, // DataTables的高
		//"sScrollX" : 400, // DataTables的宽
		"bAutoWidth" : true, // 宽度自适应
		"bProcessing" : true,
		"bServerSide" : true,
		"aoColumns" : [
				{
					"mDataProp" : "refundid",
					"fnCreatedCell" : function(nTd, sData,
							oData, iRow, iRow) {
						$(nTd).html("<div id='stopPropagation" + iRow +"'>"
								   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='checkList' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label>");
                           com.leanway.columnTdBindSelectNew(nTd,"refundTable","checkList");
					}
				}, {
					"mDataProp" : "refundno"
				}, {
					"mDataProp" : "refunddate"
				}, {
					"mDataProp" : "invoicenumber"
				} , {
					"mDataProp" : "code"
				}],
		"fnCreatedRow" : function(nRow, aData, iDataIndex) {
			// add selected class
		},
		"oLanguage" : {
        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
         },
		"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		"fnDrawCallback" : function(data) {
		
			com.leanway.getDataTableFirstRowId("refundTable", getDetailById,false,"checkList");

			 // 点击dataTable触发事件
            com.leanway.dataTableClickMoreSelect("refundTable", "checkList", false,  refundTable, getDetailById,undefined,undefined);

           // com.leanway.dataTableCheckAllCheck('salesOrderDataTable', 'checkAll', 'checkList');
           
          
		}
	}).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );
	
	
	return table;
	
}


/**
 * 退货单ID
 */
var getDetailById = function ( refundId ) {
	
	com.leanway.formReadOnly("refundForm");
	opeMethod = "";
	
	if (refundId == "null") {
		
		resetForm( );
		
	} else {
		// 加载数据
		$.ajax( {
			type : "post",
			url : "../../../../"+ln_project+"/refund",
			data : {
				method : "querySalesRefund",
				"refundId" : refundId
			},
			dataType: "json",
			success: function ( data ) {
	
				var flag =  com.leanway.checkLogind( data );
	
				if ( flag ) {
	
					setFormValue( data );
	
				}
			}
		});
	}
	
	refundDetailTable.ajax.url( '../../../../'+ln_project+'/refund?method=queryPurchaseRefundDetail&type=1&id=' +refundId ).load();
}

/**
 * 赋值
 * 
 * @param data
 */
function setFormValue( data ) {
  
	for ( var item in data ) {
	
		if ( item != "searchValue" ) {
			$("#" + item).val(data[item]);
		}
		
	}

	 var deliveryid = data.deliveryid;
	
	 if (deliveryid != "" && deliveryid != null && deliveryid != "null") {
    	setValueToSelect2Func("#deliveryid", deliveryid, data.invoicenumber);
	 }
}

/**
 * 退货清单
 */
var refundDetailTable = function ( ) {
 
	var editTable = $("#refundDetailTable").DataTable({
		"ajax" : '../../../../'+ln_project+'/refund?method=queryPurchaseRefundDetail',
		'bPaginate': false,
		"bRetrieve": true,
		"bFilter":false,
//		"scrollX": true,
		"bSort": false,
		"bProcessing": true,
		"bServerSide": false,
		"aoColumns" : [
		{
			"mDataProp" : "productorname"
		},
		{
			"mDataProp" : "mapname",
		},
//		{
//			"mDataProp" : "unitsname"
//		},
//		{
//			"mDataProp" : "batch"
//		},
		{
			"mDataProp" : "sendcount"
		},
		{
			"mDataProp" : "receiptcount"
		}],
		"aoColumnDefs" : [ {
			"sDefaultContent": "",
			 "aTargets": [ "_all" ]
		} ],
		"language" : {
			"sUrl" : "../../../jslib/datatables/zh-CN.txt"
		},
		"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		"fnDrawCallback" : function(data) {
 
			if (opeMethod == "addRefund") {
				editRefundDetailTable( );
			}
		}

	}).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );
	
	return editTable;
	
}

/**
 * 编辑Datatable
 */
var editRefundDetailTable = function ( ) {
	 
	if (refundDetailTable.rows().data().length > 0) {

		$("#refundDetailTable tbody tr").each( function( ) {

			// 获取该行的下标
			var index = refundDetailTable.row(this).index();
			
			// 本单退货
			var receiptcount = refundDetailTable.rows().data()[index].receiptcount;
			
			if ( receiptcount == "null" || receiptcount == null) {
				receiptcount = "";
			}
			
			$(this).find("td:eq(3)").html('<input type="text" style="width:100px;" class="form-control input-sm" name="receiptcount" id="receiptcount" onblur="setDataTableValue(this, '+ index+ ',\'refundDetailTable\')"   value="'+ receiptcount + '">');
		 
			
		});

		refundDetailTable.columns.adjust();
	}
	
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

var showEditDocument = function ( ) {
	$("#saveFun").prop("disabled", false);
	$("#refunddate").prop("readonly", false);
}

var hiddenDocument = function ( ) {
	$("#saveFun").prop("disabled",true);
}
 
// 重置表单数据
var resetForm = function ( ) {
	$('#refundForm')[0].reset(); // 清空表单
	$("#refundForm input[type='hidden']").val("");
	$("#deliveryid").val(null).trigger("change");
    //$("#purchaseOrderForm").data('bootstrapValidator').resetForm();
}

function setValueToSelect2Func(ctrlId, idVal, name) {
	$(ctrlId).append('<option value=' + idVal + '>' + name + '</option>');
    $(ctrlId).select2("val", [ idVal ]);
}
