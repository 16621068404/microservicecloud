
var clicktime = new Date();
var soTable,sodTable,calculatePurchaseTable,viewRelevanceTables;

$ ( function ( ) {
	
	// 初始化表格
	soTable = initSoTable ( );
	
	// 初始化商业合作伙伴
	initCompanion();
	
	initTreeBom();
	
	com.leanway.initTimePickYmdForMoreId("#producefinishdate,#producefinishdate_issue");
	
	//com.leanway.dataTableClickMoreSelect("viewRelevanceTables","relevanceCheck", false, viewRelevanceTables, undefined, undefined,undefined);
	
	//com.leanway.enterKeyDown("relevanceSearchValue", searchPreOrder);
	
} );

/***
 * 初始化销售合同
 */
var initSoTable = function (  ) {
	
	var conditions = "";
	
	var table = $("#soTable").DataTable( {
			"ajax" : "../../../../" + ln_project + "/salesOrder?method=querySoPage" + conditions,
			'bPaginate' : true,
			"bDestory" : true,
			"bRetrieve" : true,
			"bSort" : false,
			"bFilter":false,
			"scrollX": true,
			"bAutoWidth" : true,
			"bProcessing" : true,
			"bServerSide" : true,
			"aoColumns" : [
			    {
			    	"mDataProp" : "salesorderid",
			    	"fnCreatedCell" : function (nTd, sData, oData, iRow, iRow) {
			    		
			    		$(nTd).html("<div id='stopPropagation" + iRow +"'><input class='regular-checkbox' type='checkbox' id='" + sData + "' name='checkList' value='" + sData + "'><label for='" + sData + "'></label>");
	                    com.leanway.columnTdBindSelectNew(nTd,"purchaseOrderTable","checkList");
	                    
			    	}
			    },
			    {
					"mDataProp" : "code"
				},{
					"mDataProp" : "orderkind",
					"fnCreatedCell" : function(nTd, sData,oData, iRow, iCol) {
						var v = "销售";
						if (sData == "0") {
							v = "销售";
						}else if(sData == "1"){
							v = "预投";
						}
						$(nTd).html(v);
					}
				}, 
				  {
					"mDataProp" : "serialno"
				}, 
				{
					"mDataProp" : "companioname"
				}, {
					"mDataProp" : "comments"
				} , {
					"mDataProp" : "createtime"
				}
			],
			"oLanguage" : {
				 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
			},
			"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
			"fnDrawCallback" : function(data) {
				
				com.leanway.getDataTableFirstRowId("soTable", loadSod,false,"checkList");
				com.leanway.dataTableClickMoreSelect("soTable", "checkList", false,  soTable, loadSod,undefined,undefined,"checkAll");
				
			}
			
		} ).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );
	
	return table;
}

var loadSod = function ( soId ) {
	
	var so = new Object();
	var sqlJsonArray = new Array()
	
	so.salesorderid = soId;

	var productoridObj = new Object();
	productoridObj.fieldname = "salesorderid";
	productoridObj.fieldtype = "varchar";
	productoridObj.value = soId;
	productoridObj.logic = "and";
	productoridObj.ope = "=";
	sqlJsonArray.push(productoridObj);
	
	so.sqlDatas = sqlJsonArray;
	
	var conditions = "&conditions=" + com.leanway.encodeURI(so);
 
	if (sodTable == null || sodTable == undefined || typeof(sodTable) == "undefined") {
		// 初始化产品的版本
		sodTable = initSodTable(conditions);
	} else {
		sodTable.ajax.url('../../../../'+ln_project+'/salesOrder?method=querySodPage' + conditions).load();
	}
}

var initSodTable = function ( conditions ) {
	
	var table = $("#sodTable").DataTable( {
			"ajax" : "../../../../" + ln_project + "/salesOrder?method=querySodPage" + conditions,
			'bPaginate' : true,
			"bDestory" : true,
			"bRetrieve" : true,
			"bSort" : false,
			"bFilter":false,
			"scrollX": true,
			"bAutoWidth" : true,
			"bProcessing" : true,
			"bServerSide" : true,
			"aoColumns" : [
			    {
			    	"mDataProp" : "salesorderdetailid",
			    	"fnCreatedCell" : function (nTd, sData, oData, iRow, iRow) {
			    		
			    		$(nTd).html("<div id='stopPropagation" + iRow +"'><input class='regular-checkbox' type='checkbox' id='" + sData + "' name='sodCheckList' value='" + sData + "'><label for='" + sData + "'></label>");
	                    com.leanway.columnTdBindSelectNew(nTd,"purchaseOrderTable","checkList");
	                    
			    	}
			    },
			    {
					"mDataProp" : "productorname"
				}, /*{
					"mDataProp" : "versionname"
				},*/ {
					"mDataProp" : "shortname"
				} , /*{
					"mDataProp" : "productordesc"
				},*/ /*{
					"mDataProp" : "drawcode"
				},*//* {
					"mDataProp" : "plannumber"
				},*/ {
					"mDataProp" : "number"
				}, {
					"mDataProp" : "producefinishdate"
				}, /*{
					"mDataProp" : "prioritylevels"
				},*/ {
					"mDataProp" : "productionsearchno"
				}, /*{
					"mDataProp" : "line"
				},*/ {
					"mDataProp" : "salesstatus",
					"fnCreatedCell" : function(nTd, sData,oData, iRow, iCol) {
						var v = "计划";
						if (sData == "1") {
							v = "确认";
						}else if(sData == "3"){
							v = "投产";
						}else if(sData == "4"){
							v = "关闭";
						}else if(sData == "5"){
							v = "返工";
						}
						$(nTd).html(v);
					}
				}, /*{
					"mDataProp" : "progressstatus",
					"fnCreatedCell" : function(nTd, sData,oData, iRow, iCol) {
						var v = "不显示";
						if (sData == "1") {
							v = "显示";
						}
						$(nTd).html(v);
					}
				},*/ {
					"mDataProp" : "comments"
				}
			],
			"oLanguage" : {
				 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
			},
			"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
			"fnDrawCallback" : function(data) {
				com.leanway.dataTableClickMoreSelect("sodTable", "sodCheckList", false,  sodTable, undefined,undefined,undefined);
			}
			
		} ).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );
	
	return table;
}


/**
 * 初始化合作伙伴
 */
var initCompanion = function ( ) {
	
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/salesOrder",
		data :{
			"method" : "queryCompanion"
		},
		dataType : "json",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
 
				var html="";

				for (var i = 0;i<data.length;i++) {
					html +="<option value="+ data[i].compId+">"+data[i].compName +"</option>";
				}

				$("#companionid").html(html);

			    $("#companionid").select2({
			    	placeholder : "合作伙伴",
			        tags: false,
			        language : "zh-CN",
			        allowClear: true,
			        maximumSelectionLength: 1  //最多能够选择的个数
			    });

			}
		}
	});
	
}

var addSo = function ( ) {
	
	com.leanway.clearForm("soModalForm");
	$("#soModalForm #companionid").select2("val", [""]);
	
	com.leanway.show("addSoModal");
	
}

/**
 * 保存销售合同
 */
var saveSo = function ( ) {
	
	var formData = com.leanway.formatForm("#soModalForm");
	
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/salesOrder",
		data : {
			method : "saveSo",
			conditions: formData
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {

				if (data.status == "error") {
					lwalert("tipModal", 1,data.info);
				} else {
					$("#addSoModal").modal("hide");
					soTable.ajax.reload();
				}

			}
		},
		error : function(data) {
			lwalert("tipModal", 1,"ajax error");
		}
	});
}

/**
 * 修改
 */
var updateSo = function ( ) {
	
	var soId = com.leanway.getDataTableCheckIds("checkList");
	if (soId == "" || soId.indexOf(",") != -1) {
		
		lwalert("tipModal", 1,"请选择一条数据修改！");
		
	} else {
		
		querySo(soId);
		com.leanway.show("addSoModal");
		
	}
	
}

/**
 * 查询销售订单明细
 */
var querySo = function ( soId ) {
	
	com.leanway.clearForm("soModalForm");
	
	var conditions = new Object();
	conditions.salesorderid = soId;
	
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/salesOrder",

		data : {
			method : "querySo",
			"conditions" : JSON.stringify(conditions)
		},
		dataType : "json",
		success : function ( data ) {
			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
				
				com.leanway.setFormValue("soModalForm", data);
				$("#soModalForm #companionid").select2("val", [data.companionid]);	
			 
			}
		},
		error : function(data) {
			lwalert("tipModal", 1,"ajax error");
		}
	});
}

var delSo = function ( ) {

	var soId = com.leanway.getDataTableCheckIds("checkList");
	
	if (soId == "") {
		lwalert("tipModal", 1,"请选择数据进行删除！");
		return;
	}
	
	var msg = "确定删除选中的" + soId.split(",").length + "条数据?";

	lwalert("tipModal", 2, msg ,"sureDelete()");
	
}

var sureDelete = function ( ) {
	var soId = com.leanway.getDataTableCheckIds("checkList");
	
	var conditions = new Object();
	conditions.salesorderids = soId;
	
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/salesOrder",

		data : {
			method : "deleteSo",
			"conditions" : JSON.stringify(conditions)
		},
		dataType : "json",
		success : function ( data ) {
			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
				
				if (data.status == "error") {
					lwalert("tipModal", 1,data.info);
				} else {
					soTable.ajax.reload();
					sodTable.ajax.reload();
				}
			 
			}
		},
		error : function(data) {
			lwalert("tipModal", 1,"ajax error");
		}
	});
	
}

var addSod = function ( ) {
	
	var soId = com.leanway.getDataTableCheckIds("checkList");
	 
	if (soId == "" || soId.indexOf(",") != -1) {
		lwalert("tipModal", 1,"请选择数据！");
	} else {
		com.leanway.clearForm("sodModalForm");
		
		$("#sodModalForm #salesorderid").val(soId);
	//	var sodSVal = com.leanway.getRowSelectedData(sodTable);
		$("#sodModalForm #orderkind").val(soTable.rows('.row_selected').data()[0].orderkind);
		
		com.leanway.show("addSodModal");
	}
	
}

var saveSod = function ( ) {
	
var formData = com.leanway.formatForm("#sodModalForm");
	
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/salesOrder",
		data : {
			method : "saveSod",
			conditions: formData
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {

				if (data.status == "error") {
					lwalert("tipModal", 1,data.info);
				} else {
					$("#addSodModal").modal("hide");
					sodTable.ajax.reload();
				}

			}
		},
		error : function(data) {
			lwalert("tipModal", 1,"ajax error");
		}
	});
	
}

// 加载bom
var showBom = function ( ) {
	
	com.leanway.show("bomModal");
	
}

var initTreeBom = function() {

	$.fn.zTree.init($("#treeBom"), {
		check : { // 勾选框类型(checkbox 或 radio）默认 checkbox
			enable : true, // true 生效
			chkStyle : "radio", // checkbox 或 radio
			radioType: "all"   //对所有节点设置单选
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

function onClick(e, treeId, treeNode) {

	if (treeNode.checked) {
		$.fn.zTree.getZTreeObj("treeBom").checkNode(treeNode, false, false);
	} else {
		$.fn.zTree.getZTreeObj("treeBom").checkNode(treeNode, true, true);
	}

}

var zTreeOnCheck = function(event, treeId, treeNode) {
	
}

var getFontCss = function(treeId, treeNode) {
	return (!!treeNode.highlight) ? {
		color : "#A60000",
		"font-weight" : "bold"
	} : {
		color : "#333",
		"font-weight" : "normal"
	};
}

var saveBom = function ( ) {
	
	var zTree = $.fn.zTree.getZTreeObj("treeBom");

	var bomid = "";
	if (zTree != null && zTree != "undefined" && typeof (zTree) != "undefined") {
		var nodes = zTree.getCheckedNodes(true);
		for (var i = 0; i < nodes.length; i++) {
			bomid = nodes[i].bomid ;
		}
	}
	
	if (bomid == "") {
		lwalert("tipModal", 1,"请选择Bom！");
		return;
	}
	
	// 清空表单
	 $("#bomid,#productorid,#productorname,#versionid,#shortname,#drawcode").val("");
//	 $("#bomid").val("");
//	 $("#productorname").val("");
//	 $("#versionid").val("");
//	 $("#shortname").val("");
//	 $("#drawcode").val("");
	// $("#soModalForm #companionid").select2("val", [""]);
	
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/salesOrder",

		data : {
			method : "queryBomDetail",
			"bomid" : bomid
		},
		dataType : "json",
		success : function ( data ) {
			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
				
				com.leanway.setFormValue("sodModalForm", data);
				$("#bomModal").modal("hide");
			}
		},
		error : function(data) {
			lwalert("tipModal", 1,"ajax error");
		}
	});
	
}

var updateSod = function ( ) {
	
	var sodId = com.leanway.getDataTableCheckIds("sodCheckList");
	 
	if (sodId == "" || sodId.indexOf(",") != -1) {
		lwalert("tipModal", 1,"请选择数据！");
	} else {
		
		com.leanway.clearForm("sodModalForm");
		
		var conditions = new Object();
		conditions.salesorderdetailid = sodId;
		
		$.ajax ( {
			type : "post",
			url : "../../../../"+ln_project+"/salesOrder",

			data : {
				method : "querySod",
				"conditions" : JSON.stringify(conditions)
			},
			dataType : "json",
			success : function ( data ) {
				var flag =  com.leanway.checkLogind(data);

				if ( flag ) {
					
					com.leanway.setFormValue("sodModalForm", data);
					com.leanway.show("addSodModal");
				}
			},
			error : function(data) {
				lwalert("tipModal", 1,"ajax error");
			}
		});
	}
	
}

var checkPurchaseOrderSo = function (type) {
	
	var soId = com.leanway.getDataTableCheckIds("checkList");
	var sodId = com.leanway.getDataTableCheckIds("sodCheckList");
	if((type==1&&soId == "")||(type==2&&sodId == "")){
			lwalert("tipModal", 1,"请选择数据进行确认！");
			return;
	}
	var msg = "确定确认选中的" + soId.split(",").length + "条数据?";

	lwalert("tipModal", 2, msg ,"checkPurchaseSo("+type+")");
	
}

var checkPurchaseSo = function (checktype) {
	var conditions = new Object();
	if(checktype==1){
		var soId = com.leanway.getDataTableCheckIds("checkList");
		conditions.salesorderids = soId;
	}else{
		var sodId = com.leanway.getDataTableCheckIds("sodCheckList");
		conditions.salesorderdetailids = sodId;
	}

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/salesOrder",
		async : false,
		data : {
			method : "checkPurchaseSo",
			"conditions" : JSON.stringify(conditions),
			checktype:checktype
		},
		dataType : "json",
		success : function ( data ) {
			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
				
				if (data.status == "error") {
					lwalert("tipModal", 1,data.info);
				} else {
					lwalert("tipModal", 1,"确认成功");
					sodTable.ajax.reload();
				}
			 
			}
		},
		error : function(data) {
			lwalert("tipModal", 1,"ajax error");
		}
	});
	
}


var delSod = function ( ) {

	var sodId = com.leanway.getDataTableCheckIds("sodCheckList");
	
	if (sodId == "") {
		lwalert("tipModal", 1,"请选择数据进行删除！");
		return;
	}
	
	var msg = "确定删除选中的" + sodId.split(",").length + "条数据?";

	lwalert("tipModal", 2, msg ,"sureDeleteSod()");
	
}

var sureDeleteSod = function ( ) {
	var sodId = com.leanway.getDataTableCheckIds("sodCheckList");
	
	var conditions = new Object();
	conditions.salesorderdetailids = sodId;
	
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/salesOrder",

		data : {
			method : "deleteSod",
			"conditions" : JSON.stringify(conditions)
		},
		dataType : "json",
		success : function ( data ) {
			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
				
				if (data.status == "error") {
					lwalert("tipModal", 1,data.info);
				} else {
					sodTable.ajax.reload();
				}
			 
			}
		},
		error : function(data) {
			lwalert("tipModal", 1,"ajax error");
		}
	});
	
}

var createCode;
//生成生产订单 selectType, 0:销售订单，0：明细
var createProductionOrder = function(selectType, currentproduction) {
	
	var soId = "";
	var sodId = "";
	
	if (selectType == 0) {
		
		soId = com.leanway.getDataTableCheckIds("checkList");
		if ( soId == "" ) {
			lwalert("tipModal", 1, "请选择（销售）合同生成工单！");
			return;
		}
		
	} else {
		
		sodId = com.leanway.getDataTableCheckIds("sodCheckList");
		if ( sodId == "" ) {
			lwalert("tipModal", 1, "请选择产品生成工单！");
			return;
		}
		
	}
 
	showMask("mask");
	$("#progressInfo").html("0%");
	$("#progressBarDiv").css("width", "0%");
	$("#progressDiv").show();
	$("#progressDiv").css("width", "40%");
	$("#orderInfo").hide();

	var myData = new Date();
	createCode = myData.getTime() + com.leanway.generateMixed(5);
	setTimeout(function() {readProductionOrderProgress();}, 2000);

	// 参数
	var conditions = new Object();

	if (selectType == 0) {
		conditions.salesOrderIds = soId;
	} else {
		conditions.salesOrderDetailIds = sodId;
	}
	conditions.type = 1;
	conditions.busType = 0;
	conditions.createCode = createCode;
 
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "addProductionOrder",
			"conditions" : JSON.stringify(conditions)
		},
		dataType : "json",
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {

				lwalert("tipModal", 1, text.info);

				if (selectType == 0) {
					soTable.ajax.reload(null, false);
				} else {
					sodTable.ajax.reload();
				}
				
				hideMask("mask");
			}

		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			lwalert("tipModal", 1,errorThrown);
			hideMask("mask");
		}
	});

}

var readProductionOrderProgress = function() {

	$("#orderInfo").css("color", "#3c8dbc");
	$("#orderInfo2").css("color", "#3c8dbc");
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "readProductionOrderProgress",
			"createCode" : createCode
		},
		async : true,
		dataType : "json",
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {
				if (data == null) {
					setTimeout(function() {
						readProductionOrderProgress();

					}, 500);
				} else {
					if (data.status == 0 || data.status == 1) {

						$("#progressBarDiv").css("width", data.progressBar);
						$("#progressInfo").html(
								data.progressBar + "："
										+ data.parentProductorName);

						var msg = "订单号 : " + data.orderCode + ", 销售明细产品："
								+ data.parentProductorName + ", 正创建产品： "
								+ data.thisProductorName + "，已执行(s)："
								+ data.excTime;

						$("#orderInfo").html(msg);
						$("#orderInfo2").html(msg);

						setTimeout(function() {
							readProductionOrderProgress();

						}, 500);
					} else {

						if (data.status == -1) {
							$("#progressDiv").hide();
							$("#orderInfo").html(data.info);
							$("#orderInfo2").html(data.info);
							$("#orderInfo").css("color", "red");
							$("#orderInfo2").css("color", "red");
							$("#orderInfo").show();
						} else if (data.status == 2) {
							$("#orderInfo").html("");
							$("#orderInfo2").html("");
							$("#progressInfo").html("100%");
							$("#progressBarDiv").css("width", "100%");
							$("#progressDiv").hide();
							$("#orderInfo").hide();
							$("#createOrderFun").prop("disabled", false);
							$("#createOrderFun").html("生成生产订单");
						}
					}
				}

			}

		},
		error : function() {
			$("#orderInfo").html("读取进度异常，但不影响生成工单！");
		}
	});

}

var deletePo = function ( type ) {

	var id = "";
	
	 if ( type == 0 ) {
		 id = com.leanway.getDataTableCheckIds("checkList");
	 } else {
		 id = com.leanway.getDataTableCheckIds("sodCheckList");
	 }

	if (id == "") {
		lwalert("tipModal", 1,"请选择数据进行删除！");
		return;
	}
	
	var msg = "确定删除选中的" + id.split(",").length + "条数据的生产订单?";

	lwalert("tipModal", 2, msg ,"sureDeletePo(" + type + ")");
}

var sureDeletePo = function ( type ) {
	
	console.log(type);
	
	var id = "";
	
	 if ( type == 0 ) {
		 id = com.leanway.getDataTableCheckIds("checkList");
	 } else {
		 id = com.leanway.getDataTableCheckIds("sodCheckList");
	 }
	 
	 $.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "deleteProductionOrder",
			"orderIds" : id,
			"type" : type
		},
		dataType : "json",
		async : false,
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {

				lwalert("tipModal", 1, text.info);
				
				if (text.status == 'success') {
					
					if ( type == 0 ) {
						soTable.ajax.reload(null, false);
					} else {
						sodTable.ajax.reload(null, false);
					}
					
				}
			
			}

		}
	});
	
}

var calculateMrp = function ( selectType ) {
	
	var soId = "";
	var sodId = "";
	
	if (selectType == 0) {
		
		soId = com.leanway.getDataTableCheckIds("checkList");
//		if ( soId == "" ) {
//			lwalert("tipModal", 1, "请选择（销售）合同计算物料需求！");
//			return;
//		}
		
	} else {
		
		sodId = com.leanway.getDataTableCheckIds("sodCheckList");
//		if ( sodId == "" ) {
//			lwalert("tipModal", 1, "请选择产品计算物料需求！");
//			return;
//		}
		
	}
 
	
	// 参数
	var conditions = new Object();
	if (selectType == 0) {
		conditions.salesOrderIds = soId;
	} else {
		conditions.salesOrderDetailIds = sodId;
	}
	
	var strCondition = encodeURIComponent($.trim(JSON.stringify(conditions)));
	
	$('#calculatePurchaseModal').modal({backdrop: 'static', keyboard: true});
	
	if (calculatePurchaseTable == null || calculatePurchaseTable == "undefined" || typeof(calculatePurchaseTable) == "undefined") {
 
		calculatePurchaseTable = initCalculatePurchase(strCondition);
 
	} else {
 
		calculatePurchaseTable.ajax.url("../../../../"+ln_project+"/productionOrder?method=calculatePurchase&conditions=" + strCondition).load();
	}
	
 
//	$.ajax({
//		type : "post",
//		url : "../../../../" + ln_project + "/productionOrder",
//		data : {
//			"method" : "calculatePurchase",
//			"conditions" : JSON.stringify(conditions)
//		},
//		dataType : "json",
//		success : function(text) {
//
//			var flag = com.leanway.checkLogind(text);
//
//			if (flag) {
//
//				 
//
//		 
//			}
//
//		},
//		error : function() {
//			lwalert("tipModal", 1,"ajax error");
//		}
//	});

	
}

var inBatchesOrderDetail = function ( ) {
    var sodid = com.leanway.getDataTableCheckIds("sodCheckList");

    if (sodid == "" || sodid.indexOf(",") != -1) {
        lwalert("tipModal", 1, "请选择一条数据操作！");
        return;
    }
    $('#inBatchesModal').modal({backdrop: 'static', keyboard: true});
}

//	分批下发
function issueOrder () {
    var count_issue = $("#count_issue").val(); // 下发数量
    var producefinishdate_issue = $("#producefinishdate_issue").val(); // 完工日期
    var productionsearchno_issue = $("#productionsearchno_issue").val(); // 生产查询号


    // 获取第一行选中的数据：
    var obj = $("#sodTable").DataTable().rows('.row_selected').data()[0];
    console.log(obj);
    console.log(count_issue);
    console.log(producefinishdate_issue);
    if(count_issue == ""){
        lwalert("tipModal", 1, "下发数量为空");
        return;
    }
    if(producefinishdate_issue == ""){
        lwalert("tipModal", 1, "完工日期为空");
        return;
    }
    if(productionsearchno_issue == ""){
        lwalert("tipModal", 1, "生产查询号为空");
        return;
    }
    if(count_issue > obj.number){
        lwalert("tipModal", 1, "下发数量大于总数");
        return;
    }

    $.ajax({
        type : "post",
        url : "../../../../" + ln_project + "/salesOrderDetail",
        data : {
            "method" : "issueOrder",
            "count_issue" : count_issue,
            "producefinishdate_issue" : producefinishdate_issue,
            "productionsearchno_issue" : productionsearchno_issue,
            "order" : JSON.stringify(obj)
        },
        dataType : "json",
        /* async : false, */
        success : function(data) {

            var flag = com.leanway.checkLogind(data);

            if (flag) {

                if (data.status == "error") {
                    // alert(data.info);
                    salesErrorStatus = "error";
                    lwalert("tipModal", 1, data.info);

                } else {
                    salesErrorStatus = "";
                    sodTable.ajax.reload();
                    $('#inBatchesModal').map(function() {
                        $(this).modal('hide');
                    });
                }
            }
        },
        error : function(data) {

        }
    });

}

var initCalculatePurchase = function ( conditions ) {
	
	var table = $("#calculatePurchaseTable").DataTable( {
			"ajax" : "../../../../" + ln_project + "/productionOrder?method=calculatePurchase&conditions=" + conditions,
			'bPaginate' : false,
			"bDestory" : true,
			"bRetrieve" : true,
			"bSort" : false,
			"bFilter":false,
			"scrollX": true,
			"bAutoWidth" : true,
			"bProcessing" : true,
			"bServerSide" : true,
			"aoColumns" : [
			    {
			    	"mDataProp" : "salesorderdetailid",
			    	"fnCreatedCell" : function (nTd, sData, oData, iRow, iRow) {
			    		
			    		$(nTd).html("<div id='stopPropagation" + iRow +"'><input class='regular-checkbox' type='checkbox' id='" + sData + "' name='cpCheckList' value='" + sData + "'><label for='" + sData + "'></label>");
	                    com.leanway.columnTdBindSelectNew(nTd,"calculatePurchaseTable","cpCheckList");
	                    
			    	}
			    },
			    {
					"mDataProp" : "productorname"
				} , {
					"mDataProp" : "shortname"
				}, {
					"mDataProp" : "productordesc"
				}, {
					"mDataProp" : "drawcode"
				}, {
					"mDataProp" : "number"
				}, {
					"mDataProp" : "stockcount"
				}, {
					"mDataProp" : "unallocatednumber"
				},  {
					"mDataProp" : "contractno"
				}, {
					"mDataProp" : "productionsearchno"
				}, 
			],
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

var relevance = function ( ) {
	
	var detailId = com.leanway.getDataTableCheckIds("sodCheckList");
	
	var selectId = detailId.split(",");
	if (selectId == "") {
		lwalert("tipModal", 1, "请选择合同产品关联！");
		return;
	} else if (selectId.length > 1) {
		lwalert("tipModal", 1, "请选择一条关联！");
		return;
	} else {
		
		if (viewRelevanceTables == null || viewRelevanceTables == "undefined" || typeof (viewRelevanceTables) == "undefined") {
			viewRelevanceTables = initViewRelevanceTables(detailId);
		} else {
			$("#relevanceSearchValue").val("");
			// viewRelevanceTables.ajax.reload();
			viewRelevanceTables.ajax.url('../../../../'+ ln_project+ '/salesOrder?method=queryRelevanceTables&salesOrderDetailId='+ detailId).load();
		}
	
		$('#relevanceModal').modal({backdrop : 'static',keyboard : true});
	
	}
	
}

var initViewRelevanceTables = function(salesOrderDetailId) {

	var table = $('#viewRelevanceTables')
			.DataTable(
					{
						"ajax" : {
							"url" : '../../../../'+ ln_project+ '/salesOrder?method=queryRelevanceTables&salesOrderDetailId='+ salesOrderDetailId,
							"type" : "POST"
						},
						'bPaginate' : false,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"bProcessing" : true,
						"bServerSide" : false,
						"aoColumns" : [
								{
									"mDataProp" : "salesorderdetailid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd)
												.html(
														"<div id='stopPropagation"
																+ iRow
																+ "'>"
																+ "<input class='regular-checkbox' type='checkbox' id='"
																+ sData
																+ "' name='relevanceCheck' value='"
																+ sData
																+ "'><label for='"
																+ sData
																+ "'></label>");
										com.leanway.columnTdBindSelect(nTd);
									}
								}, {
									"mDataProp" : "serialno"
								}, {
									"mDataProp" : "productorname"
								}, {
									"mDataProp" : "productordesc"
								}, {
									"mDataProp" : "drawcode"
								}, {
									"mDataProp" : "productionsearchno"
								}, {
									"mDataProp" : "plannumber"
								}, {
									"mDataProp" : "surplusmatchcount"
								}, {
									"mDataProp" : "relevancecount"
								}
						/* {"mDataProp": "canmatchcount"}, */
						],
						"fnCreatedRow" : function(nRow, aData, iDataIndex) {
							// add selected class

						},
						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						}

					}).on(
					'xhr.dt',
					function(e, settings, json) {
						com.leanway.checkLogind(json);
						com.leanway.dataTableUnselectAll("viewRelevanceTables",
								"relevanceCheckAll");
						// loadProductorTree("1");
					});

	return table;
}

var searchPreOrder = function() {
	var searchValue = $("#relevanceSearchValue").val();
	var detailId = com.leanway.getDataTableCheckIds("editCheck");
	 
	viewRelevanceTables.ajax.url('../../../../'+ ln_project+ '/salesOrder?method=queryRelevanceTables&salesOrderDetailId='+ detailId + '&searchValue=' + searchValue).load();
}

var saveRelevance = function() {

	var salesOrderDetailId = com.leanway.getDataTableCheckIds("editCheck");

	var preSalesOrderId = com.leanway.getDataTableCheckIds("relevanceCheck");

	var data = getDataTableData(viewRelevanceTables, preSalesOrderId);

	var formData = "{\"listRelevanceData\": " + data + "}";

	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/salesOrder",
		data : {
			"method" : "saveRelevance",
			"paramData" : formData,
			"salesOrderDetailId" : salesOrderDetailId
		},
		dataType : "json",
		/* async : false, */
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {

				lwalert("tipModal", 1, text.info);

				if (text.status == "success") {
					viewRelevanceTables.ajax.reload();
				}

			}
		},
		error : function() {
			lwalert("tipModal", 1, "ajax error");
		}
	});

}

var calculateSo = function ( ) {
	
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "calculateSo"
		},
		dataType : "json",
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {

				lwalert("tipModal", 1, text.info);

				soTable.ajax.reload();
			}

		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			lwalert("tipModal", 1,errorThrown);
		}
	});
	
}