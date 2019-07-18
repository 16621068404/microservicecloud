var clicktime = new Date();
var salesErrorStatus ="";
var createCode;
var refashStatus="";
var viewRelevanceTables = null;
var reg=/,$/gi;
//销售订单明细的状态：由String转Integer
function stringConvertInt(Str) {
	var tempInt;
	switch (Str) {
	case "计划":
		tempInt = 1;
		break;
	case "确认":
		tempInt = 2;
		break;
	case "投产":
		tempInt = 3;
		break;
	case "关闭":
		tempInt = 4;
		break;
	}
	return tempInt;
}

function stringProgressConvertInt(Str) {

	var tempInt;
	switch (Str) {
	case "不显示":
		tempInt = 0;
		break;
	case "显示":
		tempInt = 1;
		break;
	}
	return tempInt;
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


var relevance = function ( ) {

	var detailId =  com.leanway.getDataTableCheckIds("editCheck");
	var selectId = detailId.split(",");

	if (selectId=="") {
//		alert("请选择派工单关联雇员!");
	    lwalert("tipModal", 1, "请选择销售明细关联！");
		return;
	} else if (selectId.length > 1){
//		alert("请选择一条派工单进行关联！");
	    lwalert("tipModal", 1, "请选择一条销售明细关联！");
		return;
	} else {

		if (viewRelevanceTables == null || viewRelevanceTables == "undefined" || typeof(viewRelevanceTables) == "undefined") {

			viewRelevanceTables = initViewRelevanceTables(detailId);

		} else {

			$("#relevanceSearchValue").val("");

			// viewRelevanceTables.ajax.reload();
			viewRelevanceTables.ajax.url('../../../../'+ln_project+'/salesOrder?method=queryRelevanceTables&type=1&salesOrderDetailId=' + detailId).load();
		}

		$('#relevanceModal').modal({backdrop: 'static', keyboard: true});
	}
}

var deleteRelevance = function ( ) {
	var preSalesOrderDetailId = com.leanway.getDataTableCheckIds("relevanceCheck");

	if (preSalesOrderDetailId == "") {
		lwalert("tipModal", 1, "请选择预销售明细后进行解除！");
		return;
	} else {
		lwalert("tipModal", 2, "确定解除销售明细和选中的预售明细的关联数据？" ,"ajaxDeleteRelevance()");
	}
}

var ajaxDeleteRelevance = function ( ) {

	var salesOrderDetailId =  com.leanway.getDataTableCheckIds("editCheck");
	var preSalesOrderDetailId = com.leanway.getDataTableCheckIds("relevanceCheck");

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/salesOrder",
		data : {
			"method" : "deleteRelevance",
			"salesOrderDetailId" : salesOrderDetailId,
			"preSalesOrderDetailIds" : preSalesOrderDetailId
		},
		dataType : "json",
	/*	async : false,*/
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				if (text.status == "success") {
					//$('#relevanceModal').modal('hide');
					//
					viewRelevanceTables.ajax.reload();
				}

			}
		},
		error: function(){

		}
	});
}

var savePreSalesOrderDetailRelevance = function () {

	// 获取当前选中的预销售订单，
	var preSalesOrderDetailId = com.leanway.getDataTableCheckIds("relevanceCheck");

	var preSalesOrderDetailIds = preSalesOrderDetailId.split(",");

	if (preSalesOrderDetailIds == "" ) {
//		alert("请选择派工单关联雇员!");
	    lwalert("tipModal", 1, "请选择预销售明细关联！");
		return;
	} else if (preSalesOrderDetailIds.length > 1){
//		alert("请选择一条派工单进行关联！");
	    lwalert("tipModal", 1, "请选择一条预销售明细关联！");
		return;
	} else {

		var zTree = $.fn.zTree.getZTreeObj("treeProductionOrder");
		var nodes = zTree.getCheckedNodes(true);

		if (nodes.length == 0) {
			ajaxSaveRelevance();
			//lwalert("tipModal", 2, "确定清除选中的预销售订单的关联数据？" ,"ajaxSaveRelevance()");

		} else {

			ajaxSaveRelevance();
		}

	}


}

var saveRelevance = function ( ) {

	var salesOrderDetailId =  com.leanway.getDataTableCheckIds("editCheck");

	var preSalesOrderId = com.leanway.getDataTableCheckIds("relevanceCheck");

	var data = getDataTableData(viewRelevanceTables, preSalesOrderId);

	var formData = "{\"listRelevanceData\": "+ data + "}";

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/salesOrder",
		data : {
			"method" : "saveRelevance",
			"paramData" : formData,
			"salesOrderDetailId" : salesOrderDetailId,
			"type":"1"
		},
		dataType : "json",
	/*	async : false,*/
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				lwalert("tipModal", 1, text.info);

				if (text.status == "success") {
					viewRelevanceTables.ajax.reload();
				}

			}
		},
		error: function(){

		}
	});

}

var ajaxSaveRelevance = function () {

	// 获取销售订单行datatableID数据.
	var salesOrderDetailId =  com.leanway.getDataTableCheckIds("editCheck");

	// 获取当前选中的预销售订单，
	var preSalesOrderDetailId = com.leanway.getDataTableCheckIds("relevanceCheck");

	// 获取选中的子查询号和数量
	var jsonData = "[";


	var zTree = $.fn.zTree.getZTreeObj("treeProductionOrder");
	var nodes = zTree.getCheckedNodes(true);

	for (var i = 0;i < nodes.length; i++) {
		var productionorderid = nodes[i].productionorderid;
		if ( productionorderid != null && productionorderid != undefined && typeof(productionorderid) != "undefined" ) {

			jsonData +="{"

			jsonData += '"productionorderid" : "' + nodes[i].productionorderid +'","canmatchnumber" :' + nodes[i].number+ ',"productionchildsearchno" : "' + nodes[i].productionchildsearchno+'","productorid" : "' + nodes[i].productorid +'"';

			jsonData += "},";
		}
	}

	jsonData = jsonData.replace(reg,"");

	jsonData += "]";

	var formData = "{\"listDetailRelevance\": "+ jsonData + "}";

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/salesOrder",
		data : {
			"method" : "savePreSalesOrderDetailRelevance",
			"paramData" : formData,
			"salesOrderDetailId" : salesOrderDetailId,
			"preSalesOrderDetailId" : preSalesOrderDetailId
		},
		dataType : "json",
	/*	async : false,*/
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				lwalert("tipModal", 1, text.info);

				if (text.status == "success") {
					//$('#relevanceModal').modal('hide');
					//
					viewRelevanceTables.ajax.reload();
				}

			}
		},
		error: function(){

		}
	});
}

var searchPreOrder = function ( ) {
	   var searchValue = $("#relevanceSearchValue").val();
	   var detailId =  com.leanway.getDataTableCheckIds("editCheck");
	   var formData = "{\"productorids\": "+ productorids + "}";
	   viewRelevanceTables.ajax.url('../../../../'+ln_project+'/salesOrder?method=queryRelevanceTables&salesOrderDetailId=' + detailId + '&searchValue=' + searchValue+'&paramData='+formData).load();
}

var initViewRelevanceTables = function (salesOrderDetailId) {

	var table = $('#viewRelevanceTables').DataTable( {
		"ajax": '../../../../'+ln_project+'/salesOrder?method=queryRelevanceTables&salesOrderDetailId=' + salesOrderDetailId+"&type=1",
		'bPaginate': false,
		"bDestory": true,
		"bRetrieve": true,
		"bFilter":false,
		"bSort": false,
		"bProcessing": true,
		"bServerSide": false,
		"aoColumns": [
		              {"mDataProp": "salesorderdetailid",
		            	  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
		            		  $(nTd).html("<div id='stopPropagation" + iRow +"'>"
		            				  +"<input class='regular-checkbox' type='checkbox' id='"
		            				  + sData
		            				  + "' name='relevanceCheck' value='"
		            				  + sData
		            				  + "'><label for='"
		            				  + sData
		            				  + "'></label>");
		            		  com.leanway.columnTdBindSelect(nTd);
		            	  }
		              },
		              {"mDataProp": "code"},
		              {"mDataProp": "productionsearchno"},
		              {"mDataProp": "number"},
		              {"mDataProp": "canmatchcount"},
		              {"mDataProp": "relevancecount"},
		              {"mDataProp": "drawcode"},
		              {"mDataProp": "productorname"},
		              {"mDataProp": "productordesc"},
		             /* {"mDataProp": "canmatchcount"},*/
		              ],
		              "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
		            	  //add selected class

		              },
		              "oLanguage" : {
		            	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		              }

	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
		com.leanway.dataTableUnselectAll("viewRelevanceTables","relevanceCheckAll");
		//loadProductorTree("1");
	} );

	return table;
}



var readProductionOrderProgress = function ( ) {

	$("#orderInfo").css("color" , "#3c8dbc");
	$("#orderInfo2").css("color" , "#3c8dbc");
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/productionOrder",
		data : {
			"method" : "readProductionOrderProgress",
			"createCode" : createCode
		},
		async : true,
		dataType : "json",
		success : function ( data ) {
			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
				if(data==null){
					setTimeout(function () {
						readProductionOrderProgress();

					}, 500);
				}else{
					if (data.status == 0  || data.status == 1 ) {

						$("#progressBarDiv").css("width" , data.progressBar);
						$("#progressInfo").html( data.progressBar+ "：" + data.parentProductorName );

						var msg = "订单号 : "+ data.orderCode + ", 销售明细产品：" + data.parentProductorName + ", 正创建产品： " + data.thisProductorName +"，已执行(s)：" + data.excTime;

						$("#orderInfo").html(msg);
						$("#orderInfo2").html(msg);

						setTimeout(function () {
							readProductionOrderProgress();

						}, 500);
					} else {

						if (data.status == -1) {
							$("#progressDiv").hide();
							$("#orderInfo").html(data.info);
							$("#orderInfo2").html(data.info);
							$("#orderInfo").css("color" , "red");
							$("#orderInfo2").css("color" , "red");
							$("#orderInfo").show();
						} else if(data.status == 2) {
							$("#orderInfo").html("");
							$("#orderInfo2").html("");
							$("#progressInfo").html("100%");
							$("#progressBarDiv").css("width" , "100%");
							$("#progressDiv").hide();
							$("#orderInfo").hide();
							$("#createOrderFun").prop("disabled", false);
							$("#createOrderFun").html("生成生产订单");
						}
					}

				}


			}

		},
		error : function () {
			$("#orderInfo").html("读取进度异常，但不影响生成工单！");
		}
	});

}

//生成生产订单 type, 1:生产订单，2：预销售订单
var createProductionOrder = function ( type, busType, currentproduction,selectedDetail) {
    showMask("mask");
	var str = '';
    colmap = tabmap.get("salesOrderDataTable");

    if (colmap == undefined) {
    	hideMask("mask");
	lwalert("tipModal", 1, "请勾选预销售订单生成生产订单！");
	return;
    }

    var array = colmap.keys();

	 for ( var i in array) {
	         str += array[i];
	         str += ",";
	 }
     var salesOrderIds = str.substr(0, str.length - 1);
     var salesOrderDetailIds = com.leanway.getDataTableCheckIds("editCheck");
     if(selectedDetail==2&&salesOrderIds.split(",").length>1){
    	 hideMask("mask");
    	 lwalert("tipModal", 1, "只能勾选一个预销售订单生成生产订单！");
    	 return;
     }else if(selectedDetail==2&&salesOrderDetailIds.length==0){
    	 hideMask("mask");
    	 lwalert("tipModal", 1, "请勾选预销售订单产品生成生产订单！");
    	 return;
     }

	//var salesOrderIds = com.leanway.getDataTableCheckIds("checkList");
//    if (currentproduction == 0) {
//		$("#createOrderFun").prop("disabled", true);
//		$("#createOrderFun").html("生成中...请等待！");
//    } else {
//		$("#createCurOrderFun").prop("disabled", true);
//		$("#createCurOrderFun").html("生成中...请等待！");
//    }

    $("#progressInfo").html("0%");
    $("#progressBarDiv").css("width" , "0%");
    $("#progressDiv").css("width" , "40%");
    $("#progressDiv").show();
    $("#orderInfo").hide();

	var myData = new Date();
	createCode = myData.getTime() + generateMixed(5) ;
	setTimeout(function () {
		readProductionOrderProgress();

	}, 2000);

	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/productionOrder",
		data : {
			"method" : "addProductionOrder",
			"salesOrderIds" : salesOrderIds,
			"type" : type,
			"busType":busType,
			"currentproduction": currentproduction,
			"createCode" : createCode,
			"selectedDetail":selectedDetail,
			"salesOrderDetailIds":salesOrderDetailIds
		},
		dataType : "json",
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				lwalert("tipModal", 1, text.info);
//				 if (currentproduction == 0) {
//					 $("#createOrderFun").prop("disabled", false);
//					 $("#createOrderFun").html("生成生产订单");
//				 } else {
//					 $("#createCurOrderFun").prop("disabled", false);
//					 $("#createCurOrderFun").html("生成当前产品订单");
//				 }
				 refashStatus="1";
				//重新刷新页面
				 oTable.ajax.reload(null, false);
				 hideMask("mask");

			}

		}
	});

}

//将dataTables多行转成jsons
function editDataTableToJsons() {
	var tempJson = [];
	$("#editSalesOrderDetailsTable tbody tr").each(function() {
		var editData = editDataTable.row(this).data();
		var tempData = editDataTableToJson(editData);
		if(tempData != undefined && typeof(tempData) != "undefined"){
			//tempData.line = ($(this).context._DT_RowIndex + 1);  // 得到datatables行号==line
			tempJson.push(tempData);
		}
	});
	return JSON.stringify(tempJson);
}

//将dataTables一行转成json
function editDataTableToJson(editData) {
	if(editData != undefined && typeof(editData) != "undefined"){

		var temp = {"productorid":editData.productorid,
				"bomid" : editData.bomid,
				"equipmentid" : editData.equipmentid,
				"number": editData.number,
				"price": editData.price,
				"producefinishdate": editData.producefinishdate,
				"forecastfinishdate" : editData.forecastfinishdate,
				"prioritylevels": editData.prioritylevels,
				"salesstatus": stringConvertInt(editData.salesstatustext),
				"productionsearchno": editData.productionsearchno,
				"companionid": editData.companionid,
				"unitsid": editData.unitsid,
				"unitsname": editData.unitsname,
				"managerunit": editData.managerunit,
				"line": editData.line,
				"progressstatus":stringProgressConvertInt(editData.progressstatustext),
				"comments":editData.comments,
				//默认数据
				"createtime": editData.createtime,
				"createuser": editData.createuser,
				"modifydate": editData.modifydate,
				"modifyuser": editData.modifyuser,
				"notshipmentsnumber": editData.notshipmentsnumber,
				"salesorderdetailid": editData.salesorderdetailid,
				"salesorderid": editData.salesorderid,
				"shippednumber": editData.shippednumber,
				"sort": editData.sort,
				"status": editData.status
			};
	}
	return temp;
}

//定义公共变量
var editDataTable;
//初始化dataTables-edit
var initEditDataTable = function(salesOrderId) {
	var editTable = $("#editSalesOrderDetailsTable")
			.DataTable(
					{
						"ajax" : '../../../'+ln_project+'/preSalesOrderDetail?method=querySalesOrderDetailByConditons&conditions='+ encodeURI('{"salesorderid": "'+ salesOrderId + '"}'),
						'bPaginate' : false,
//						"iDisplayLength" : "8",
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						//"scrollX": true,
						"bSort" : false,
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
										com.leanway.columnTdBindSelect(nTd);
									}
								},
								{
									"mDataProp" : "productorname"
								},{
									"mDataProp" : "versiion"
								},
								{
									"mDataProp" : "productordesc",
								},
								{
									"mDataProp" : "material"
								},
								{
									"mDataProp" : "unitsname"
								},
								{
									"mDataProp" : "equipmentname"
								},
								{
									"mDataProp" : "number"
								},
								{
									"mDataProp" : "price"
								},
								{
									"mDataProp" : "producefinishdate"
								},{
									"mDataProp" : "forecastfinishdate"
								},
								{
									"mDataProp" : "prioritylevels"
								},
								{
									"mDataProp" : "salesstatustext"
								},
								{
									"mDataProp" : "productionsearchno"
								},{
									"mDataProp" : "progressstatustext"
								},{
									"mDataProp" : "comments"
								},
								{
									"mDataProp" : "line"

								},
								{
									"mDataProp" : "productorid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd)
												.html(
														"<button class='btn btn-primary btn-sm edit-btn' type='button' value='"
														+ sData + "'>编辑</button>");
									}
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
//							 var api = this.api();
//							 var startIndex= api.context[0]._iDisplayStart;//获取到本页开始的条数
//							 api.column(16).nodes().each(function(cell, i) {
//								cell.innerHTML = startIndex + i + 1;
//							});
							 // 点击dataTable触发事件
//                            com.leanway.dataTableClick("editSalesOrderDetailsTable", "editCheck", true,
//                            		editDataTable);

//								$('input[name="editCheck"]').icheck({
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


var loadBomCode = function ( productorid ) {

	var html = "";

	$.ajax({
		type: "post",
		url: "../../../"+ln_project+"/salesOrderDetail",
		data: {
			method: "queryBomCode",
			productorid : productorid
		},
		async : false,
		dataType: "json",
		success: function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				for (var i = 0; i < data.length; i++) {
					html += '<option value="' + data[i].bomid + '">' + data[i].versiion +'</option>';

				}

			}

		}
	});

	return html;
}


var clickEditButton = function(tempThis) {
	var tds=tempThis.parents("tr").children();

	var indexNumber = tempThis.parents("tr").index();

	var productorid = "";

    $.each(tds, function(i,val){
        var jqob=$(val);
        if(i < 1 || jqob.has('button').length ){return true;}//跳过第1项 序号,按钮
        var txt=jqob.text();
        var put;
        if(i == 1) {
        	put = $("<select id='productId"+indexNumber+"' name='productorid' class='form-control select2' style='width: 100%'>");

        	jqob.html(put);

        	com.leanway.initSelect2("#productId"+indexNumber, "../../../"+ln_project+"/productors?method=queryProductor", "搜索产品");

            if (txt != null && txt != "" && txt != "null") {
                $("#productId"+indexNumber).append('<option value=' + txt + '>' + txt + '</option>');
                $("#productId"+indexNumber).select2("val", [ txt ]);
            }
            productorid = editDataTable.row(indexNumber).data().productorid;

            $("#productId"+indexNumber).on("select2:select", function(e) {
            	var tempTr = $(this).parents("tr")[0];
            	editDataTable.row(indexNumber).data().productorid = $(this).val();

            	var html = "";
            	// 根据产品ID查询对应的版本数据
            	if ($(this).val() != "" && typeof($(this).val()) !="undefined" && $(this).val() != undefined) {
            		html = loadBomCode($(this).val());
            	}

            	autoFillProductorInfo($(this).val(), indexNumber, tempTr, indexNumber, html);
            });

        } else if (i == 2) {

        	var html = "";
        	// 根据产品ID查询对应的版本数据
        	if (productorid != "" && typeof(productorid) !="undefined" && productorid != undefined) {
        		html = loadBomCode(productorid);
        	}

        	put=$("<select style='width: 80px' name='bomid' class='form-control' >" + html + "</select>");

        	put.val(editDataTable.row(indexNumber).data().bomid);

        	jqob.html(put);

        } else if(i == 3 || i == 4 || i == 5) {
        	put=$("<input type='text' class='form-control' style='width: 90px'  readonly='readonly'>");
        	put.val(txt);
        	jqob.html(put);
        } else if(i == 6) {
        	put = $("<select id='equipmentid"+indexNumber+"' name='equipmentid' class='form-control select2'  style='width: 120px' >");

        	jqob.html(put);

        	com.leanway.initSelect2("#equipmentid"+indexNumber, "../../../"+ln_project+"/productors?method=loadEquipmentname", "搜索设备台账");

            if (txt != null && txt != "" && txt != "null") {

                $("#equipmentid"+indexNumber).append('<option value=' + txt + '>' + txt + '</option>');
                $("#equipmentid"+indexNumber).select2("val", [ txt ]);
            }

            equipmentid = editDataTable.row(indexNumber).data().equipmentid;

            if (equipmentid != null && equipmentid != "" && equipmentid != "null") {
				$("#equipmentid"+indexNumber).append(
						'<option value=' + equipmentid + '>' + txt
								+ '</option>');
				$("#equipmentid"+indexNumber).select2("val", [ equipmentid ]);
			}

            $("#equipmentid"+indexNumber).on("select2:select", function(e) {
            	var tempTr = $(this).parents("tr")[0];
            	editDataTable.row(indexNumber).data().equipmentid = $(this).val();

            });


        }else if(i == 7) {
        	put=$("<input type='text' style='width: 80px'  class='form-control' name='number'>");
        	put.val(txt);
        	jqob.html(put);
        } else if(i == 9) {
        	put=$("<input type='text' style='width: 110px'  class='form-control' name='editProducefinishdate' value='1'>");
        	put.val(txt);
        	jqob.html(put);

        	if(txt == "" || txt == null) {
        		$("input[name='editProducefinishdate']").val($("#producefinishdate").val());
        	}
        	initTimePickYmd($("input[name='editProducefinishdate']"));
        } else if(i == 12) {
        	put=$("<select class='form-control' style='width: 80px' ><option value='1'>计划</option><option value='2'>确认</option><option value='3'>投产</option><option value='4'>关闭</option></select>");
        	put.val(stringConvertInt(txt));
        	jqob.html(put);
        } else if(i == 13){
        	put=$("<input type='text' style='width: 80px'  class='form-control' id='productionSearchNo"+indexNumber+"'>");
        	put.val(txt);
        	jqob.html(put);

        	$("#productionSearchNo"+indexNumber).blur(function() {
        		isExistProductionSearchNoFunc(indexNumber);
        	});

        } else if(i == 14) {

        	put=$("<select class='form-control' style='width: 80px' ><option value='0'>不显示</option><option value='1'>显示</option></select>");
        	put.val(stringProgressConvertInt(txt));
        	jqob.html(put)

        }else if(i == 15) {

        	put=$("<input type='text' style='width: 80px'  class='form-control' name='comments'>");
        	put.val(txt);
        	jqob.html(put)

        }  else if (i == 16) {
        	put=$("<input type='text' style='width: 80px'  class='form-control' name='line'>");
        	put.val(txt);
        	jqob.html(put)
        } else{
        	put=$("<input type='text'  style='width: 80px' class='form-control'>");
        	put.val(txt);
        	jqob.html(put);
        }

    });
    tempThis.html("保存");
    tempThis.toggleClass("edit-btn");
    tempThis.toggleClass("save-btn");

    editDataTable.columns.adjust();
}

//判断生产查询号是否存在--后台
function isExistProductionSearchNoFunc(indexNumber) {

	// 销售订单标识
	var salesorderid = "";

	// 1：新增，2：修改
	var ope = 1;

	// 0：不混排，1：混排
	var ischaosorder = $('input[name="ischaosorder"]:checked').val();

	// 如果选中的销售订单为混排订单时，允许生产查询号重复
	var data = oTable.rows('.row_selected').data()[0];

	var productionsearchno = $("#productionSearchNo"+indexNumber).val();

	if ($.trim(productionsearchno) == "") {
		return;
	}

	// 新增情况下
	if ( data == undefined || typeof(data) == "undefined" || data == "undefined") {
		ope = 1;
	} else {
		ope = 2;
		salesorderid = data.salesorderid;
	}


	$.ajax({
		type: "get",
		url: "../../../"+ln_project+"/preSalesOrderDetail",
		data: {
			method : "querySalesOrderByProductionSearchNo",
			conditions : '{"salesorderid":"' + salesorderid + '","ischaosorder" : "' + ischaosorder + '","ope":"' + ope + '","productionsearchno":"' + $("#productionSearchNo"+indexNumber).val() + '", "status":"' + 0 + '", "salesorderdetailid":"'+editDataTable.row(indexNumber).data().salesorderdetailid+'"}'
		},
		dataType: 'json',
		success: function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				if(data.status == "error")

					lwalert("tipModal", 1, data.info);

			}
		},
		error: function(data) {

		}
	});
}

var clickSaveButtonFunc = function(tempThis) {

	var indexNumber = tempThis.parents("tr").index();
	 var data = editDataTable.row(indexNumber).data();
	 console.info("data=="+data)
	 if(editDataTableToJson(data).productorid!="undefined"&&editDataTableToJson(data).productorid!=undefined){
    var tds=tempThis.parents("tr").children();
    $.each(tds, function(i,val){
        var jqob=$(val);
        //把input变为字符串
        if(i < 1 || jqob.has('button').length){return true;}
        if(!jqob.has('button').length){
            var txt;
            var val;
            if(i == 1 || i == 2 || i== 6 ||i == 12 || i == 14 ) {

            	txt=jqob.children("select").find("option:selected").text();

            	if (i == 2) {
            		val=jqob.children("select").find("option:selected").val();
            	}

            } else {
            	txt=jqob.children("input").val();
            }

        	if (i == 2) {
        		   editDataTable.cell(jqob).data(val);//修改DataTables对象的数据

        	} else {
        		   editDataTable.cell(jqob).data(txt);//修改DataTables对象的数据
        	}

        	jqob.html(txt);
        }
    });

    editDataTable.row(indexNumber).data().bomid = editDataTable.row(indexNumber).data().versiion;  //BOMID
   // editDataTable.row(indexNumber).data().line = indexNumber;  //行号



    var salesorderid = $("#salesorderid").val();

    if(salesorderid == "" || salesorderid == null || salesorderid == "null"){

    	//alert("请先选择销售订单或添加新的销售订单");

    }else{

	    if(data.salesorderdetailid != "" && data.salesorderdetailid != null && data.salesorderdetailid != "null" ){  //TODO

	    	//新建后改变编辑按钮 保存情况才会出来的。
	    	modifyEditDataTable(editDataTableToJson(data));
	    }else{

	    	//
	    	addSalesOrderDetail(editDataTableToJson(data));


	    }
    }
    tempThis.html("编辑");
    tempThis.toggleClass("edit-btn");
    tempThis.toggleClass("save-btn");
	 }else{
			lwalert("tipModal", 1,"请填写产品");
	 }
}

//自动填充产品信息
function autoFillProductorInfo(productorid, indexNumber, tempTr, indexNumber, html) {
	$.ajax({
		type: "get",
		url: "../../../"+ln_project+"/productors",
		data: {
			method: "findAllProductorsObject",
			productorid: productorid
		},
		dataType: "json",
		success: function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = data.productorsConditions;

				tempTr.cells[2].children[0].innerHTML = html;
				tempTr.cells[3].children[0].value = tempData.productordesc;
				tempTr.cells[4].children[0].value = tempData.material;
				tempTr.cells[5].children[0].value = tempData.unitsname;
				tempTr.cells[6].children[0].value = tempData.equipmentid;

				//给editDataTable赋值
				editDataTable.row(indexNumber).data().unitsid = tempData.unitsid;
				editDataTable.row(indexNumber).data().unitsname = tempData.unitsname;
				editDataTable.row(indexNumber).data().managerunit = tempData.managerunit;
				editDataTable.row(indexNumber).data().equipmentid = tempData.equipmentid;

				var equipmentid = tempData.equipmentid;

				if (equipmentid != null && equipmentid != "" && equipmentid != "null") {
					$("#equipmentid"+indexNumber).append(
							'<option value=' + equipmentid + '>' + tempData.equipmentname
									+ '</option>');
					$("#equipmentid"+indexNumber).select2("val", [ equipmentid ]);
				}

			}
		}
	});
}

//修改可编辑的表格
function modifyEditDataTable(data) {
console.info(data)
	  var productionsearchno = editDataTableToJson(data).productionsearchno;

		if(productionsearchno=="" || productionsearchno == null){

			lwalert("tipModal", 1,"生产查询号不能为空，保存失败，请重新编辑");
			return;
		}

//	 var contractno = editDataTableToJson(data).contractid;
//
//		if(contractno=="" || contractno == null){
//
//			lwalert("tipModal", 1,"合同号不能为空，保存失败，请重新编辑");
//			return;
//		}

	if(parseFloat(data.number)>0){

		var ischaosorder = $('input[name="ischaosorder"]:checked').val();

		$.ajax({
			type: "post",
			url: "../../../"+ln_project+"/preSalesOrderDetail",
			data: {
				method: "updateSalesOrderDetailByConditons",
				conditions : JSON.stringify(data),
				"ischaosorder" : ischaosorder
			},
			dataType: "json",
			async : false,
			success: function(data) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){
					if(data.status == "error") {
						salesErrorStatus = "error" ;
						lwalert("tipModal", 1, data.info);
					}else{
						salesErrorStatus = "";
						editDataTable.ajax.reload();
					}

				}
			},
			error: function(data) {

			}
		});
	}else{
		lwalert("tipModal", 1,"产品数量未填写，保存失败，请重新编辑");
	}

}

//新增可编辑的表格
function addSalesOrderDetail(data) {

    var productionsearchno = editDataTableToJson(data).productionsearchno;

	if(productionsearchno=="" || productionsearchno == null){

		lwalert("tipModal", 1,"生产查询号不能为空，保存失败，请重新编辑");
		return;
	}

	var salesorderid = $("#salesorderid").val();
	if(parseFloat(data.number)>0){
		$.ajax({
			type: "post",
			url: "../../../"+ln_project+"/preSalesOrderDetail",
			data: {
				method: "addSalesOrderDetail",
				salesorderid : salesorderid,
				conditions : JSON.stringify(data)
			},
			dataType: "json",
			async : false,
			success: function(data) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					if(data.status == "error") {
						salesErrorStatus="error";
						lwalert("tipModal", 1, data.info);
					}else{
						salesErrorStatus="";
						editDataTable.ajax.reload();
					}
				}
			},
			error: function(data) {

			}
		});
	}else{
		lwalert("tipModal", 1,"产品数量未填写，保存失败，请重新编辑");
	}
}

//删除销售订单
function deleteSalesOrder(type) {

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "salesOrderDataTable", "checkList");

	if (ids.length>0) {
		 var msg = "确定删除选中的" + ids.split(",").length + "个预销售订单?";

		 lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	} else {

		lwalert("tipModal", 1, "至少选择一条记录操作");
	}
}

function isSureDelete(type){

	var ids = com.leanway.getCheckBoxData(type, "salesOrderDataTable", "checkList");

	queryIsCreateProductionOrder(ids) ;
}
/**
 * 判断能否删除
 */
function queryIsCreateProductionOrder(ids) {

	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/productionOrder",
		data : {
			method : "queryIsCreateProductionOrder",
			"type" :"2",
			"ids" : ids
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				if (data.status == "success") {
					//删除
					deleteAjax(ids);
				} else {
					lwalert("tipModal", 1,data.info);
				}

			}
		}
	});

}

// 删除Ajax
var deleteAjax = function(ids) {

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/preSalesOrder",
		data : {
			method : "updateSalesOrderStatusByConditons",
			conditions : '{"salesorderids":"' + ids + '", "status":"' + 1 + '"}'
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				if (data.code == "1") {

					com.leanway.clearTableMapData( "salesOrderDataTable" );
					oTable.ajax.reload(null,false); // 刷新dataTable

					lwalert("tipModal", 1, "删除成功！");
				} else {

					lwalert("tipModal", 1, data.info);
				}

			}
		}
	});
}

//删除销售订单明细
function deleteSalesOrderDetail() {
	var str = '';
	// 拼接选中的checkbox
	$("input[name='editCheck']:checked").each(function(i, o) {
		str += $(this).val();
		str += ",";
	});

	if (str.length > 0) {
		lwalert("tipModal", 2,"确定要删除选中的预销售订单明细吗?","isSureDeleteDetail()");

	} else {

		lwalert("tipModal", 1, "至少选择一条记录操作！");
	}
}

function isSureDeleteDetail(){
	var str = '';
	// 拼接选中的checkbox
	$("input[name='editCheck']:checked").each(function(i, o) {
		str += $(this).val();
		str += ",";
	});

	var ids = str.substr(0, str.length - 1);
	deleteSalesOrderDetailAjax(ids);
}
// 删除Ajax
var deleteSalesOrderDetailAjax = function(ids) {

	if(ids == "" || ids.length == 0) {
		editDataTable.row('.row_selected').remove().draw( false );
	} else {
		$.ajax({
			type : "post",
			url : "../../../"+ln_project+"/preSalesOrderDetail",
			data : {
				method : "updateSalesOrderDetailStatusByConditons",
				conditions : '{"salesorderdetailids":"' + ids + '", "status":"' + 1 + '"}'
			},

			dataType : "json",
			async : false,

			success : function(data) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					if (data.code == "1") {

						editDataTable.ajax.reload(); // 刷新dataTable

						lwalert("tipModal", 1, "删除成功！");

					} else {

						lwalert("tipModal", 1, data.info);
					}

				}
			}
		});
	}
}

function showEditSalesOrder() {
	var data = oTable.rows('.row_selected').data();
	if (data.length == 0) {
		lwalert("tipModal", 1, "请选择要修改的预销售订单！");
	} else if (data.length > 1) {
		lwalert("tipModal", 1, "只能选择一个预销售订单进行修改！");
	} else {
		if(!$("#box1").hasClass("box box-primary collapsed-box")){
			watchSalesOrder()
		}
	opeMethod = "updateSalesOrderByConditons";
	com.leanway.removeReadOnly("salesOrderForm");
	buttonEnabled("#addEditDataTableId,#deleteEditDataTableId,#batch-edit-btn,#batch-save-btn");
	/*inputReadOnly("#code")*/;
	}
}

// 操作方法，新增或修改
var opeMethod = "addSalesOrder";

function addSalesOrder() {
	if(!$("#box1").hasClass("box box-primary collapsed-box")){
	watchSalesOrder();
	}
	com.leanway.dataTableUnselectAll("salesOrderDataTable", "checkList");
	com.leanway.dataTableUnselectAll("salesOrderDataTable", "checkAll");
	opeMethod = "addSalesOrder";
	com.leanway.removeReadOnly("salesOrderForm");
	/*inputReadOnly("#code");*/
	buttonEnabled("#addEditDataTableId,#deleteEditDataTableId,#batch-edit-btn,#batch-save-btn");
	resetPageForm();

	editDataTable.ajax.url( '../../../'+ln_project+'/preSalesOrderDetail?method=querySalesOrderDetailByConditons&conditions=' + encodeURI('{"salesorderid": "null"}')  ).load();
	com.leanway.clearTableMapData( "salesOrderDataTable" );
}

function saveOrUpdate() {
	salesErrorStatus ="";
    var requestdate = $("#requestdate").val();
    var shippingdate = $("#shippingdate").val();
    var producefinishdate = $("#producefinishdate").val();
	$(".save-btn").click();  //批量保存

	$("#salesOrderDetailList").val(editDataTableToJsons());

	var form  = $("#salesOrderForm").serializeArray();
	var formData = formatFormJson(form);
	if (salesErrorStatus=="") {
	$("#salesOrderForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#salesOrderForm').data('bootstrapValidator').isValid()) { // 返回true、false
	    if(requestdate!=""&&shippingdate!=""&&requestdate>=shippingdate){
            if(shippingdate!=""&&producefinishdate!=""&&shippingdate>=producefinishdate){
	    $.ajax({
		type : "post",
		url : "../../../"+ln_project+"/preSalesOrder",
		data : {
			method : opeMethod,
			conditions: formData
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var colmap = tabmap.get("salesOrderDataTable");
				colmap.clearmap();

				if (data.status == "error") {

					lwalert("tipModal", 1, data.info);
				} else {
					com.leanway.formReadOnly("salesOrderForm");
					com.leanway.clearTableMapData( "salesOrderDataTable" );
					if(opeMethod=="addSalesOrder"){
					    oTable.ajax.reload();
					}else{
					    oTable.ajax.reload(null,false);
					}

					lwalert("tipModal", 1,"保存成功");
				}

			}
		},
		error : function(data) {

			lwalert("tipModal", 1,"保存失败");
		}
	});
            }else{
                lwalert("tipModal", 1,"请填写日期，并且完工日期不能大于装运日期");
            }
        }else{
            lwalert("tipModal", 1,"请填写日期，并且装运日期不能大于交货日期");
        }
	}
	}
}

//格式化form数据
var  formatFormJson = function  (formData) {
	var reg=/,$/gi;
	var data = "{";
	for (var i = 0; i < formData.length; i++) {
		var tempVal = formData[i].value;
		if (formData[i].name == "salesOrderDetailList") {
			if (tempVal == "") {
				tempVal = "[]";
			}
		} else {
			if (tempVal == "") {
				tempVal = "\"\"";
			} else {
				tempVal = "\"" + tempVal + "\"";
			}
		}
		data += "\"" +formData[i].name +"\" : "+tempVal+",";
	}
	data = data.replace(reg,"");
	data += "}";
	return data;
}

// 重置表单数据
function resetPageForm() {
	$('#salesOrderForm')[0].reset(); // 清空表单
	$("#salesOrderForm input[type='hidden']").val("");
	$("#salesOrderForm").data('bootstrapValidator').resetForm();
};

//点击dataTable触发事件
function clickDataTable(salesOrderId) {
	com.leanway.formReadOnly("salesOrderForm");
	buttonDisabled("#addEditDataTableId,#batch-edit-btn,#batch-save-btn");
	getSalesOrderById(salesOrderId);
}


//取消选中dataTable事件
function unSelectDataTableFunc() {

}

//选中DataTable事件
function selectDataTableFunc() {

}

// 初始化数据表格
var initTable = function() {
	var table = $('#salesOrderDataTable')
			.DataTable(
					{
						"ajax" : '../../../'+ln_project+'/preSalesOrder?method=querySalesOrderByConditons',
//						"iDisplayLength" : "8",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
//						"sScrollY" : "250px", // DataTables的高
//						"scrollX": true,
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
							"data" : "salesstatus"
						}, {
							"data" : "contacts"
						}, {
							"data" : "price"
						}, {
							"data" : "salesdate"
						}, {
							"data" : "requestdate"
						}, {
							"data" : "deliveryleadtime"
						},{
							"data" : "salesaddress"

						} ],
						"aoColumns" : [
								{
									"mDataProp" : "salesorderid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd).html("<div id='stopPropagation" + iRow +"'>"
												   +"<input class='regular-checkbox' type='checkbox' id='" + sData
			                                       + "' name='checkList' value='" + sData
			                                       + "'><label for='" + sData
			                                       + "'></label>");
										 com.leanway.columnTdBindSelectNew(nTd,"salesOrderDataTable", "checkList");
									}
								},{
									"mDataProp" : "code"
								}, {
									"mDataProp" : "salesstatus",
										"fnCreatedCell" : function(nTd, sData,
												oData, iRow, iCol) {
											$(nTd)
													.html(
															salestatusToName(sData));
										}
								}, {
									"mDataProp" : "contacts"
								}, {
									"mDataProp" : "price"
								} , {
									"mDataProp" : "salesdate"
								}, {
									"mDataProp" : "requestdate"
								}, {
									"mDataProp" : "deliveryleadtime"
								}, {
									"mDataProp" : "salesaddress"
								} ],
						"fnCreatedRow" : function(nRow, aData, iDataIndex) {
							// add selected class
						},
						"oLanguage" : {
				        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
				         },
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {
							com.leanway.getDataTableFirstRowId("salesOrderDataTable", getSalesOrderById,"more", "checkList");

							 // 点击dataTable触发事件
                            com.leanway.dataTableClickMoreSelect("salesOrderDataTable", "checkList", false,
                                    oTable, getSalesOrderById,undefined,undefined,"checkAll");

                            com.leanway.dataTableCheckAllCheck('salesOrderDataTable', 'checkAll', 'checkList');

						}
					}).on('xhr.dt', function (e, settings, json) {
						com.leanway.checkLogind(json);
					} );
	return table;
}

function getSalesOrderById(salesOrderId) {

	com.leanway.formReadOnly("salesOrderForm");
	buttonDisabled("#addEditDataTableId,#batch-edit-btn,#batch-save-btn");

	$.ajax({
		type: "get",
		url: "../../../"+ln_project+"/preSalesOrder",
		data: {
			method: "querySalesOrderById",
			conditions: '{"salesorderid":"' + salesOrderId + '"}'
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

	
	var detailSearchValue = $("#detailSearchValue").val();
	
	if(refashStatus!="") {
		var ids = com.leanway.getCheckBoxData(1, "salesOrderDataTable", "checkList");
		if (ids.indexOf(",")!=-1){
			ids=ids.substr(0,ids.indexOf(","));
		}
		editDataTable.ajax.url( '../../../'+ln_project+'/preSalesOrderDetail?method=querySalesOrderDetailByConditons&conditions=' + encodeURI('{"salesorderid": "'+ ids + '","productionsearchno": "'+detailSearchValue+'"}') ).load();
		refashStatus="";
	}else{
	//初始化edit dataTables
	editDataTable.ajax.url( '../../../'+ln_project+'/preSalesOrderDetail?method=querySalesOrderDetailByConditons&conditions=' + encodeURI('{"salesorderid": "'+ salesOrderId + '","productionsearchno": "'+detailSearchValue+'"}') ).load();
	}
}

//自动填充表单数据（页面id须与bean保持一致）
function setFormValue(data) {
	resetPageForm();
	var reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
	for ( var item in data) {
		if (item != "searchValue") {
			if (item == "ischaosorder") {
				$("input[type=radio][name=ischaosorder][value=" + data[item] + "]").prop('checked','true');
			} else {
				$("#" + item).val(data[item]);
			}
		}

	}
}

//禁用button
function buttonDisabled(id) {
	$(id).attr({
		"disabled" : "disabled"
	});
}

// 启用button
function buttonEnabled(id) {
	$(id).removeAttr("disabled");
}

function inputReadOnly(id) {
	$(id).prop("readonly", true);
}

//填写数据验证
function initBootstrapValidator() {
	$('#salesOrderForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					deliveryleadtime : {
						validators : {
							//notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.amount,
									com.leanway.reg.msg.amount)
						}
					},
					price : {
						validators : {
							//notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
				}
			});
}
function watchSalesOrder(){
	if($("#box1").hasClass("box box-primary collapsed-box")){
		$("#watchFun").html("查看订单明细");
	}else{
		$("#watchFun").html("返回订单列表");
	}
	$("#btn1").trigger("click");
	$("#btn2").trigger("click");
	$("#btn3").trigger("click");
}
function clickOthers(){
	$("#min1").click(function(){
		clickOthers2("btn1","btn2","btn3");
		});
	$("#min2").click(function(){
		clickOthers2("btn2","btn1","btn3");
		});
	$("#min3").click(function(){
		clickOthers2("btn3","btn1","btn2");
		});

}
var flag=0;
function clickOthers2(btn1,btn2,btn3){
	if(flag==2){
		flag=0
	}else if(flag==0){
			flag++;
			$("#"+btn2).trigger("click");
			flag++;
			$("#"+btn3).trigger("click");
	}
}


//根据交货期和交货提前期计算装货日期
var getShippingdate = function() {

	var requestdate = $("#requestdate").val();
	var deliveryleadtime = $("#deliveryleadtime").val();

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/salesOrder",
		data : {
			method : "getShippingdate",
			conditions : '{"requestdate":"' + requestdate + '", "deliveryleadtime":"' + deliveryleadtime + '"}'
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){
				$("#shippingdate").val(data);
				$("#producefinishdate").val(data);
			}
		}
	});
}
var setShippingdate = function(){
    var requestdate = $("#requestdate").val();
    $("#shippingdate").val(requestdate);
    $("#producefinishdate").val(requestdate);
}
// 数据table
var oTable;

// 需要初始化数据
$(function() {

	initBootstrapValidator();
	com.leanway.formReadOnly("salesOrderForm");

	com.leanway.dataTableClickMoreSelect("viewRelevanceTables", "relevanceCheck", false, viewRelevanceTables, undefined, undefined, undefined);

	buttonDisabled("#addEditDataTableId,#batch-edit-btn,#batch-save-btn");

	// 初始化对象
	com.leanway.loadTags();

	//初始化表格
	oTable = initTable();

	//初始化编辑表格
	editDataTable = initEditDataTable();

	initTimePickYmd("#salesdate, #requestdate, #shippingdate,#producefinishdate");

	//全选
//	com.leanway.dataTableCheckAll("salesOrderDataTable", "checkAll", "checkList");
//	com.leanway.dataTableCheckAll("editSalesOrderDetailsTable", "editCheckAll", "editCheck");

	//多选
//	com.leanway.dataTableClick("salesOrderDataTable", "checkList", true, oTable, clickDataTable, selectDataTableFunc, unSelectDataTableFunc);
	//com.leanway.dataTableClick("editSalesOrderDetailsTable", "editCheck", true, editDataTable);

	//点击编辑按钮
	$("#editSalesOrderDetailsTable tbody").on("click",".edit-btn",function(){
		clickEditButton($(this));
    });

	//点击保存按钮
	$("#editSalesOrderDetailsTable tbody").on("click",".save-btn",function(){
		clickSaveButtonFunc($(this));
	});
	//$(".save-btn").click();
	//批量点击编辑按钮
     $("#batch-edit-btn").click(function(){
         $(".edit-btn").click();
     });
     $("#batch-save-btn").click(function(){
         $(".save-btn").click();
     });

     //新增editDataTable
     $('#addEditDataTableId').on( 'click', function () {
    	 editDataTable.row.add([]).draw( false );
    	 $("#editSalesOrderDetailsTable tbody tr .edit-btn:last").click();
     } );
  	 clickOthers();

  // enter键时候触发查询
 	com.leanway.enterKeyDown("searchValue", searchPreSalesOrder);
 	com.leanway.enterKeyDown("detailSearchValue", searchPreSalesOrderDetail);

 	com.leanway.enterKeyDown("relevanceSearchValue", searchPreOrder);
// 	 if (window.screen.availHeight <= 768) {
//
//		 $("#deliveryleadtimelabel").html('<span title="交货提前期">交货提前</span>');
//
//	 }
});


var searchPreSalesOrder = function () {

	var searchVal = $("#searchValue").val();

	oTable.ajax.url("../../../"+ln_project+"/preSalesOrder?method=querySalesOrderByConditons&searchValue=" + searchVal).load();
}

var searchPreSalesOrderDetail = function () {

	var detailSearchValue = $("#detailSearchValue").val();

	oTable.ajax.url("../../../"+ln_project+"/preSalesOrder?method=querySalesOrderByConditons&detailSearchValue=" + detailSearchValue).load();
}


var initTimePickYmd = function(timeId) {
	$(timeId).datetimepicker({
		    language:  'zh-CN',
		    weekStart: 7,
		    todayBtn:  1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			minView: 2,
			forceParse: 0,
			format: 'yyyy-mm-dd'
	});
}

var deleteProduction = function (salesOrderIds,type,selectedDetail,salesOrderDetailIds) {

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/productionOrder",
		data : {
			"method" : "deleteProductionOrder",
			"salesOrderIds" : salesOrderIds,
			"type" : type,
			"selectedDetail" : selectedDetail ,
			"salesOrderDetailIds" : salesOrderDetailIds
		},
		dataType : "json",
		async: false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				lwalert("tipModal", 1, text.info);
				$("#deleteProduction").prop("disabled", false);
				$("#deleteProduction").html("删除生产订单");
				refashStatus="1";
				//重新刷新页面
				oTable.ajax.url("../../../../"+ln_project+"/preSalesOrder?method=querySalesOrderByConditons").load();
			}

		}
	});

}


/**
 * 检查销售订单对应的生产订单是否已同步
 */
var checkProductionOrderIsSync = function(type ,selectedDetail){


	// 获取勾选的销售订单Id
	var data = oTable.rows('.row_selected').data();

	if (data.length == 0) {
//		alert("请勾选销售订单生成生产订单！");
		lwalert("tipModal", 1, "请勾选订单进行删除生产订单！");
		return;
	}
	if (selectedDetail == 2) {
		if (data.length >1 ) {
			lwalert("tipModal", 1, "只能选取一个预销售订单！");
			return ;
		} else {
			//查看当前的明细的id
			var detaildata = editDataTable.rows('.row_selected').data();
			if (detaildata.length == 0) {
				lwalert("tipModal", 1, "请选择预销售订单产品！");
				return ;
			}
		}
	}

	var salesOrderIds = com.leanway.getDataTableCheckIds("checkList");

	var salesOrderDetailIds = com.leanway.getDataTableCheckIds("editCheck");
	$("#deleteProduction").prop("disabled",true);
	$("#deleteProduction").html("删除中...请等待！");

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/productionOrder",
		data : {
			"method" : "checkProductionOrderIsSync",
			"salesOrderIds" : salesOrderIds,
			"type" : type,
			"selectedDetail" : selectedDetail ,
			"salesOrderDetailIds" : salesOrderDetailIds
		},
		dataType : "json",
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				if(text.status == 'success'){
					if( text.orderInfo != undefined || typeof (dataList) != "undefined"){

						var msg = text.orderInfo+"对应的生产订单已同步，确认删除？";

						lwalert("tipModal", 2, msg , 'deleteProduction("'+salesOrderIds+'","'+type+'","'+selectedDetail+'","'+salesOrderDetailIds+'")');
					}else{
						deleteProduction(salesOrderIds,type,selectedDetail,salesOrderDetailIds);
					}

				}else{
					lwalert("tipModal", 1, text.info);
				}

			}

		}
	});

}


/**
 * 状态变成html
 */
var salestatusToName = function(salesstatus) {
	var result = "";

	switch (salesstatus) {
	case 1:
		result = "";//计划
		break;
	case 2:
//		result ="确认";
		result ='<i class="glyphicon glyphicon-ok"></i>';//√
		break;
	case 3:
		result = "";//先预留的
		break;
	case 4:
//		result ="完成";
		result ='<i class="glyphicon glyphicon-ok"></i>';//另一个勾
		break;
	case 5:
//		result ="订单关闭";
		result ='<i class="glyphicon glyphicon-remove"></i>';//×

	default:
		result = "";
		break;
	}

	return result;
}

/**
 * 获取选中的数据
 */
var getDataTableData = function ( tableObj, selectIds ) {

	var reg=/,$/gi;

	var jsonData = "[";

	var dataList = tableObj.rows().data();

	if (dataList != undefined && typeof(dataList) != "undefined" && dataList.length > 0) {

		// 循环遍历Table数据
		for (var i = 0; i < dataList.length; i ++) {

			var productorData = dataList[i];

			if (selectIds.indexOf(productorData.salesorderdetailid) !=  -1) {
				jsonData += JSON.stringify(productorData) + ",";
			}

		}
	}
	jsonData = jsonData.replace(reg,"");

	jsonData += "]";

	return jsonData;
}

var productorids=null;
function nextLevels(){
	var detailId =  com.leanway.getDataTableCheckIds("editCheck");
	var jsonData = getDataTableDataAll(viewRelevanceTables);
	productorids = jsonData;
	var formData = "{\"productorids\": "+ jsonData + "}";
	viewRelevanceTables.ajax.url('../../../../'+ln_project+'/salesOrder?method=queryRelevanceTables&paramData='+encodeURIComponent(formData)+'&salesOrderDetailId='+detailId).load();
}

/**
 * tableObj datatable对象
 *
 * 获取Table对象数据
 */
var getDataTableDataAll = function(tableObj) {

    var jsonData = "[";

    var dataList = tableObj.rows().data();

    if (dataList != undefined && typeof (dataList) != "undefined"
            && dataList.length > 0) {

        // 循环遍历Table数据
        for (var i = 0; i < dataList.length; i++) {

            var productorData = dataList[i].productorid;

            jsonData += JSON.stringify(productorData) + ",";

        }
    }
    jsonData = jsonData.replace(reg, "");

    jsonData += "]";

    return jsonData;
}
