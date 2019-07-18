var clicktime = new Date();
var condition = "";
$ ( function () {
	com.leanway.initTimePickYmdForMoreId("#adjuststarttime,#adjustendtime");

	var d = new Date();
	var date=d.getDate();
	if(date<10){
		date = "0"+date;
	}
	var str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+date;

	$("#adjuststarttime").val(str);
	$("#adjustendtime").val(str);
	// 初始化生产订单
	dispatchingOrderTable = initDispatchingOrder();
	
	com.leanway.initSelect2("#productionorderbarcode", "../../../../"+ln_project+"/productionOrder?method=queryBarcodeBySelect", "搜索生产流转卡号",true);
	com.leanway.initSelect2("#centerid", "../../../../"+ln_project+"/workCenter?method=queryWorkCenterBySelect&type=1", "搜索工作中心",true);
	com.leanway.initSelect2("#personcenterid", "../../../../"+ln_project+"/workCenter?method=queryWorkCenterBySelect&type=2", "搜索人工工作中心",true);
	com.leanway.initSelect2("#orderid", "../../../../"+ln_project+"/dispatchingOrder?method=queryDispatchingOrderBySelect", "搜索派工单号",true);
	com.leanway.enterKeyDown("adjuststarttime", queryMaterialFlowReport);
	com.leanway.enterKeyDown("adjustendtime", queryMaterialFlowReport);
	 $("#productionorderbarcode,#centerid,#personcenterid,#orderid").on("select2:select" , function( e ) {
		 queryMaterialFlowReport();
    });
	 $("input[name=transfer]").click(function(){
		 queryMaterialFlowReport();
	});
}
);
var initDispatchingOrder = function ( ) {
    showMask("mask");
    var searchCondition = getSearchConditions();
	var condition = encodeURIComponent($.trim(JSON.stringify(searchCondition)));
	var table = $('#dispatchingOrderTable').DataTable( {
		"ajax": "../../../../"+ln_project+"/dispatchingOrder?method=queryMaterialFlowReport&strCondition="+condition ,
		"iDisplayLength" : "0",
		'bPaginate': false,
		"bDestory": true,
		"bRetrieve": true,
		"bFilter":false,
		"scrollY":"67vh",
		"bSort": false,
		"bProcessing": true,
		"bServerSide": true,
		"columnDefs": [
			
            {
                "render": function ( data, type, row ) {
                    return data +'<br>'+ row.productordesc+'<br>'+row.material;
                },
                "targets": 0
            }, {
                "render": function ( data, type, row ) {
                    return data +'<br>'+ row.productionorderbarcode;
                },
                "targets": 3
            },
            {
                "render": function ( data, type, row ) {
                    return data +'<br>'+ (row.centername||"")+'<br>'+row.personcentername;
                },
                "targets": 4
            },
            {
                "render": function ( data, type, row ) {
                    return data +'<br>'+ row.adjustendtime;
                },
                "targets": 8
            },{
                "render": function ( data, type, row ) {
                    return (data||"") +'<br>'+ (row.practicalendtime||"");
                },
                "targets": 10
            },
            {
                "render": function ( data, type, row ) {
                	if(data>0){
                        return "<font color='#FFFFFF'>"+(data||"") +'('+ (row.ordercount||"")+")<br>收料地址："+(row.receiptplace||"")+"</font>";
                	}else{
                		return "";
                	}
                },
                "createdCell": function (td, cellData, rowData, row, col) {
                    if ( cellData > 0 ) {
                      $(td).css('background-color', 'red')
                    }
                 },
                "targets": 12
            },
            
            
            { "visible": false,  "targets": [ 1 ] },
            { "visible": false,  "targets": [ 2 ] },
            { "visible": false,  "targets": [ 5 ] },
            { "visible": false,  "targets": [ 6 ] },
            { "visible": false,  "targets": [ 9 ] },
            { "visible": false,  "targets": [ 11 ] },
            { "visible": false,  "targets": [ 16 ] }
        ],
        "aoColumns": [


//                     {
//                         "mDataProp": "orderid",
//                         "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
////                                           $(nTd).html("<input type='checkbox' name='checkList'  value='" + sData + "'>");
//                             $(nTd)
//                             .html("<div id='stopPropagation" + iRow +"'>"
//                                     +"<input class='regular-checkbox' type='checkbox' id='"
//                                     + sData
//                                     + "' name='checkList' value='"
//                                     + sData
//                                     + "'><label for='"
//                                     + sData
//                                     + "'></label>");
//                             com.leanway.columnTdBindSelectNew(nTd,"dispatchingOrderTable","checkList");
//                         }
//                     },
                     {"mDataProp" : "productorname"},
                     {"mDataProp" : "productordesc"},
                     {"mDataProp" : "material"},
                     {"mDataProp" : "dispatchingnumber"},
                     {"mDataProp" : "procedureshortname"},
                     {"mDataProp" : "centername"},
                     {"mDataProp" : "personcentername"},
                     {"mDataProp": "count"},
                     {"mDataProp": "adjuststarttime"},
                     {"mDataProp": "adjustendtime"},
                     {"mDataProp": "practicalstarttime"},
                     {"mDataProp": "practicalendtime"},
                     {"mDataProp": "unreceiptcount"},
                     {"mDataProp": "receiptcount"},
                     {"mDataProp": "surplusnumber"},
                     {"mDataProp": "completecount"},
                     {"mDataProp": "productionorderbarcode"},
                     
                     ],
                     "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
                    	 //alert(aData.productionnumber);
                     },
                     "oLanguage" : {
                    	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                     },
                     "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                     "fnDrawCallback" : function(data) {
                         hideMask("mask");
                     }

	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
		table.columns.adjust();
	} );

	return table;
}
/**
 * 查询派工单
 */
var queryMaterialFlowReport = function ( ) {
	showMask("mask");
	com.leanway.clearTableMapData("dispatchingOrderTable");

	var searchCondition = getSearchConditions();
	var strCondition = encodeURIComponent($.trim(JSON.stringify(searchCondition)));
	var transfer =  com.leanway.getDataTableCheckIds("transfer");
	dispatchingOrderTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryMaterialFlowReport&strCondition=" + strCondition+"&transfer="+transfer).load();
}

var getSearchConditions = function (  ) {

	var sqlJsonArray = new Array()

	var sqlJson = "";
	// 开始时间
	var adjustStartTime = $("#adjuststarttime").val();

	// 结束时间
	var adjustEndTime = $("#adjustendtime").val();

	// 生产流转卡号
	var barcode = $("#productionorderbarcode").val();
	if (barcode != null && barcode != "" && typeof(barcode) != "undefined" && barcode != undefined) {
		barcode = barcode.toString();
	}
	// 工作中心
	var centerid = $("#centerid").val();
	if (centerid != null && centerid != "" && typeof(centerid) != "undefined" && centerid != undefined) {
		centerid = centerid.toString();
	}
	// 人工工作中心
	var personcenterid = $("#personcenterid").val();
	if (personcenterid != null && personcenterid != "" && typeof(personcenterid) != "undefined" && personcenterid != undefined) {
		personcenterid = personcenterid.toString();
	}
	// 派工单号
	var orderid = $("#orderid").val();
	if (orderid != null && orderid != "" && typeof(orderid) != "undefined" && orderid != undefined) {
		orderid = orderid.toString();
	}
	// 关键字
	var searchVal = $("#searchValue").val();
	var lastworkcenter = $("#lastworkcenter").val();
	if ($.trim(barcode) != "") {

		var barcodeNoObj = new Object();
		barcodeNoObj.fieldname = "po.barcode";
		barcodeNoObj.fieldtype = "varchar_select2";
		barcodeNoObj.value = barcode;
		barcodeNoObj.logic = "and";
		barcodeNoObj.ope = "in";

		sqlJsonArray.push(barcodeNoObj);
	}

	if ($.trim(centerid) != "") {

		var centeridObj = new Object();
		centeridObj.fieldname = "dco.centerid";
		centeridObj.fieldtype = "varchar_select2";
		centeridObj.value = centerid;
		centeridObj.logic = "and";
		centeridObj.ope = "in";

		sqlJsonArray.push(centeridObj);
	}
	if ($.trim(personcenterid) != "") {

		var personcenteridObj = new Object();
		personcenteridObj.fieldname = "dco.personcenterid";
		personcenteridObj.fieldtype = "varchar_select2";
		personcenteridObj.value = personcenterid;
		personcenteridObj.logic = "and";
		personcenteridObj.ope = "in";

		sqlJsonArray.push(personcenteridObj);
	}
	if ($.trim(orderid) != "") {

		var orderidObj = new Object();
		orderidObj.fieldname = "dco.orderid";
		orderidObj.fieldtype = "varchar_select2";
		orderidObj.value = orderid;
		orderidObj.logic = "and";
		orderidObj.ope = "in";

		sqlJsonArray.push(orderidObj);
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

	var condition = new Object();
	condition.searchValue = $.trim(searchVal);
	condition.sqlDatas = sqlJsonArray;
	condition.lastworkcenter = lastworkcenter;

	return condition;
}