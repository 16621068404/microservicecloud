var reg=/,$/gi;
var tableHeight = "370px";
var clicktime = new Date();
var dispatchingOrderTable;
var initGroupId = "";
var time = "";

$ ( function () {

	 if (window.screen.availHeight > 768) {
		 tableHeight = "500px";
		 $("#productionchildsearchno").css("width","220px");
		 $("#workcenter").css("width","220px");
	 }

	// 初始化对象
	com.leanway.loadTags();
	
    $("#dispatchingstatus").select2({placeholder : "派工单状态",tags: false,language : "zh-CN",allowClear: true,maximumSelectionLength: 2});
    $("#dispatchingstatus").select2("val", ["0"]);
	
	com.leanway.initSelect2("#productionchildsearchno","../../../"+ln_project+"/productionOrder?method=querySearchNo","查询号(可多选)", true);
	
	initWorkCenter();
	// 初始化生产订单
	dispatchingOrderTable = initDispatchingOrder();
 
    
    $("#workcenter,#dispatchingstatus,#productionchildsearchno").on("select2:select" , function( e ) {
    	queryGroupDispatchingOrder();
    });

    $("#workgroup").on("select2:unselect" , function( e ) {
    	$("#workcenter").html("");
    	queryGroupDispatchingOrder();
    });
    
    $("#workcenter,#dispatchingstatus,#productionchildsearchno").on("select2:unselect" , function( e ) {
    	queryGroupDispatchingOrder();
    });
    
	com.leanway.initTimePickYmdForMoreId("#adjuststarttime,#adjustendtime");
	
	com.leanway.enterKeyDown("adjustendtime", queryGroupDispatchingOrder);
	com.leanway.enterKeyDown("searchValue", queryGroupDispatchingOrder);
	
    $("#adjuststarttime,#adjustendtime").on("change", function(e) {
    	queryGroupDispatchingOrder();
    });
    
	$("input[name=orderBySql]").click(function(){
		queryGroupDispatchingOrder();
	});
    
})

var initDispatchingOrder = function (  ) {
	
	var condition ="&strCondition=" +  encodeURIComponent(JSON.stringify(getSearchCondition()));

	var table = $('#dispatchingOrderTable').DataTable( {
		"ajax": "../../../../"+ln_project+"/dispatchingOrder?method=queryGroupDispatchingOrder"  +condition ,
		/*"iDisplayLength" : "10",*/
		'bPaginate': false,
		"bDestory": true,
		"bRetrieve": true,
		"bFilter":false,
		"scrollX":true,
		"scrollY": tableHeight,
		"bSort": false,
		"bProcessing": true,
		"bServerSide": true,
		"columnDefs": [

		               ],
		               "aoColumns": [


                                     {
                                         "mDataProp": "orderid",
                                         "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
//                                           $(nTd).html("<input type='checkbox' name='checkList'  value='" + sData + "'>");
                                             $(nTd).html("<div id='stopPropagation" + iRow +"'>"+"<input class='regular-checkbox' type='checkbox' id='"+ sData+ "' name='checkList' value='"+ sData+ "'><label for='"+ sData+ "'></label>");
                                             com.leanway.columnTdBindSelectNew(nTd,"dispatchingOrderTable","checkList");
                                         }
                                     },
		                             {"mDataProp" : "dispatchingnumber"},
		                             {"mDataProp" : "productionchildsearchno"},
		                             {"mDataProp" : "productionnumber"},
		                             {"mDataProp" : "productionorderbarcode"},
		                             {"mDataProp" : "productorname"},
		                             {"mDataProp" : "drawcode"},
		                             {"mDataProp" : "procedureshortname"},
		                             {"mDataProp" : "contractnumber"},
		                             {"mDataProp" : "compname"},
		                             {"mDataProp": "adjuststarttime"},
		                             {"mDataProp": "adjustendtime"}
/*		                             ,{"mDataProp": "childname"},
		                             {"mDataProp": "childdrawcode"}*/
		                             ],
		                             "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
		                            	 //alert(aData.productionnumber);
		                             },
		                             "oLanguage" : {
		                            	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		                             },
		                             "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		                             "fnDrawCallback" : function(data) {

 
		                             }

			} ).on('xhr.dt', function (e, settings, json) {
				com.leanway.checkLogind(json);
				table.columns.adjust();
			} );

	return table;
}

var initWorkCenter = function ( ) {
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data :{
			"method" : "queryWorkCenter"
		},
		dataType : "json",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {

				var html="";

				for (var i = 0;i<data.length;i++) {
					
					html +="<option value="+ data[i].centerid+">"+data[i].shorname +"</option>";
				}

				$("#workcenter").html(html);

			    $("#workcenter").select2({
			    	placeholder : "工作中心",
			        tags: false,
			        language : "zh-CN",
			        allowClear: true,
			        maximumSelectionLength: 10  //最多能够选择的个数
			    });
			    
 
			}
		}
	});
}

var queryGroupDispatchingOrder = function ( ) {
	
	var condition = encodeURIComponent(JSON.stringify(getSearchCondition()));

	dispatchingOrderTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryGroupDispatchingOrder&strCondition=" + condition ).load();
	
}

var getSearchCondition = function ( ) {
	
	var sqlJsonArray = new Array();
	// 子查询号
	var productionChildSearchNo = $("#productionchildsearchno").val();
	if (productionChildSearchNo != null && productionChildSearchNo != "" && typeof(productionChildSearchNo) != "undefined" && productionChildSearchNo != undefined) {
		productionChildSearchNo = productionChildSearchNo.toString();
	}
	
	// 工作组
	var workgroup = $("#workgroup").val();
	if (workgroup != null && workgroup != "" && typeof(workgroup) != "undefined" && workgroup != undefined) {
		workgroup = workgroup.toString();
	}
	
	// 工作中心
	var workcenter = $("#workcenter").val();
	if (workcenter != null && workcenter != "" && typeof(workcenter) != "undefined" && workcenter != undefined) {
		workcenter = workcenter.toString();
	}
	
	// 派工单状态
	var dispatchingstatus = $("#dispatchingstatus").val();
	if (dispatchingstatus != null && dispatchingstatus != "" && typeof(dispatchingstatus) != "undefined" && dispatchingstatus != undefined) {
		dispatchingstatus = dispatchingstatus.toString();
	} else {
		dispatchingstatus = "0";
	}
	
	var searchValue = $("#searchValue").val();
	
	// 开始时间
	var adjustStartTime = $("#adjuststarttime").val();

	// 结束时间
	var adjustEndTime = $("#adjustendtime").val();
	
	var orderBySql = com.leanway.getDataTableCheckIds("orderBySql");
	
	console.log(orderBySql);
	
	if ($.trim(productionChildSearchNo) != "") {

		var searchNoObj = new Object();
		searchNoObj.fieldname = "dor.productionchildsearchno";
		searchNoObj.fieldtype = "varchar_select2";
		searchNoObj.value = productionChildSearchNo;
		searchNoObj.logic = "and";
		searchNoObj.ope = "in";

		sqlJsonArray.push(searchNoObj);
	}
	
	if ($.trim(adjustStartTime) != "") {

		var adjustStartTimeObj = new Object();
		adjustStartTimeObj.fieldname = "dor.adjuststarttime";
		adjustStartTimeObj.fieldtype = "datetime";
		adjustStartTimeObj.value = adjustStartTime;
		adjustStartTimeObj.logic = "and";
		adjustStartTimeObj.ope = ">=";

		sqlJsonArray.push(adjustStartTimeObj);
	}

	if ($.trim(adjustEndTime) != "") {

		var adjustEndTimeObj = new Object();
		adjustEndTimeObj.fieldname = "dor.adjuststarttime";
		adjustEndTimeObj.fieldtype = "datetime";
		adjustEndTimeObj.value = adjustEndTime;
		adjustEndTimeObj.logic = "and";
		adjustEndTimeObj.ope = "<=";

		sqlJsonArray.push(adjustEndTimeObj);
	}

	var condition = new Object();
	condition.sqlDatas = sqlJsonArray;
	condition.groupid = workgroup;
	condition.centerid = workcenter;
	condition.dispatchingStatusArrays = dispatchingstatus;
	condition.orderBySql = orderBySql;
	condition.searchValue = searchValue;
	return condition;
	
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
 * 高级查询导出派工单
 */
var exportDispatchingOrder = function ( ) {

	console.log(JSON.stringify(getSearchCondition()));
	var condition = encodeURIComponent(JSON.stringify(getSearchCondition()));

	window.location.href = "../../../../"+ln_project+"/dispatchingOrder?method=dowloadGroupOrderExcel&strCondition=" + condition ;
 
}