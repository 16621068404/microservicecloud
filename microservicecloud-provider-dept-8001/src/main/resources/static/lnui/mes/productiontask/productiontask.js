var dispatchingOrderTable;

var reg=/,$/gi;
var hasData = false;
var id = "";
var parentId = "";
var type = "";
var tableStatus = false;
var tableHeight = "370px";
var clicktime = new Date();
var completeDispatchingTable;
$ ( function () {

	 if (window.screen.availHeight > 768) {
		 tableHeight = "";
		 $("#productionchildsearchno").css("width","240px");
		 $("#productorTypeId").css("width","180px");
	 }

	// 初始化对象
	com.leanway.loadTags();
	$("#adjuststarttime").val((new Date()).Format("yyyy-MM-dd"));
    $("#adjustendtime").val((new Date()).Format("yyyy-MM-dd"));

	// 初始化生产订单
	dispatchingOrderTable = initDispatchingOrder();
	completeDispatchingTable = initCompleteDispatchingOrder();
	com.leanway.dataTableClickMoreSelect("dispatchingOrderTable", "checkList", false, dispatchingOrderTable,undefined,undefined,undefined);

	// 查询触发
	com.leanway.enterKeyDown("searchValue", queryDispatchingOrder);
	com.leanway.enterKeyDown("adjuststarttime", queryDispatchingOrder);
	com.leanway.enterKeyDown("adjustendtime", queryDispatchingOrder);

	$("input[name=dispatchingstatus]").click(function(){
		queryDispatchingOrder();
	});
	com.leanway.initTimePickYmdForMoreId("#adjuststarttime,#adjustendtime");
    queryWorkCenterGroup();
    queryWorkCenter();
    queryArtWorkCenter();
    
})
function queryWorkCenterGroup(){
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/workCenterGroup",
        data : {
            "method" : "queryWorkCenterGroup",
        },
        dataType : "text",
        success : function(data) {

            var flag =  com.leanway.checkLogind(data);

            if(flag){
                var result = eval("(" + data + ")");
                var html='<option value="">-----工作组-----</option>';
                for(var i=0; i<result.length;i++){

                    html+='<option value="'+result[i].groupid+'">'+result[i].shortname+'</option>'
                }
                $("#groupid").html(html);
            }
        },
        error : function(data) {
            lwalert("tipModal", 1, "error！");
        }
    });
}
function queryWorkCenter(){

    var groupid = $("#groupid").val();
    var type=0;
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/workCenter",
        data : {
            "method" : "queryWorkCenterByGroup",
            "groupid":groupid,
            "type":type
        },
        dataType : "text",
        success : function(data) {

            var flag =  com.leanway.checkLogind(data);
            if(flag){
                $('#centerid').removeAttr("disabled");
                var result = eval("(" + data + ")");
                var html='<option value="">--机器工作中心--</option>';
                for(var i=0; i<result.length;i++){

                    html+='<option value="'+result[i].centerid+'">'+result[i].shorname+'</option>'

                }
                $("#centerid").html(html);
            }
        },
        error : function(data) {
            lwalert("tipModal", 1, "error！");
        }
    });
}
function queryArtWorkCenter(){
    var groupid = $("#groupid").val();
    var type=1;
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/workCenter",
        data : {
            "method" : "queryWorkCenterByGroup",
            "groupid":groupid,
            "type":type
        },
        dataType : "text",
        success : function(data) {
            var flag =  com.leanway.checkLogind(data);
            if(flag){
                $('#personcenterid').removeAttr("disabled");
                var result = eval("(" + data + ")");
                var html='<option value="">--人工工作中心--</option>';
                for(var i=0; i<result.length;i++){

                    html+='<option value="'+result[i].centerid+'">'+result[i].shorname+'</option>'

                }
                $("#personcenterid").html(html);
            }
        },
        error : function(data) {
            lwalert("tipModal", 1, "error！");
        }
    });
}
/**
 * 查询派工单
 */
var queryDispatchingOrder = function ( ) {
	com.leanway.clearTableMapData("dispatchingOrderTable");
	var dispatchingstatus = $("input[name=dispatchingstatus]:checked").val();
	var adjuststarttime = $("#adjuststarttime").val();
	var adjustendtime = $("#adjustendtime").val();
	var groupid=$("#groupid").val();
	var centerid=$("#centerid").val();
	var personcenterid=$("#personcenterid").val();
	var searchValue = $("#searchValue").val();
	if(adjuststarttime!=null&&adjuststarttime!=""&&adjustendtime!=null&&adjustendtime!=""){
		if(dispatchingstatus==1){
			$("#compelete").hide();
			$("#unstart").show();
			dispatchingOrderTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryProductionTask&adjuststarttime="+adjuststarttime+"&adjustendtime="+adjustendtime+"&dispatchingstatus="+dispatchingstatus+"&groupid="+groupid+"&centerid="+centerid+"&personcenterid="+personcenterid+"&searchValue="+searchValue).load();
		}else{
			$("#compelete").show();
			$("#unstart").hide();
			completeDispatchingTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryProductionTask&adjuststarttime="+adjuststarttime+"&adjustendtime="+adjustendtime+"&dispatchingstatus="+dispatchingstatus+"&groupid="+groupid+"&centerid="+centerid+"&personcenterid="+personcenterid+"&searchValue="+searchValue).load();
		}
	}else{
        lwalert("tipModal", 1, "请输入开始时间和结束时间");
	}
	
}



var initDispatchingOrder = function ( ) {
	var adjuststarttime = $("#adjuststarttime").val();
	var adjustendtime = $("#adjustendtime").val();
	var dispatchingstatus = $("input[name=dispatchingstatus]:checked").val();
	var groupid=$("#groupid").val();
	var centerid=$("#centerid").val();
	var personcenterid=$("#personcenterid").val();
	var table = $('#dispatchingOrderTable').DataTable( {
		"ajax": "../../../../"+ln_project+"/dispatchingOrder?method=queryProductionTask&adjuststarttime="+adjuststarttime+"&adjustendtime="+adjustendtime+"&dispatchingstatus="+dispatchingstatus+"&groupid="+groupid+"&centerid="+centerid+"&personcenterid="+personcenterid,
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
                                     {"mDataProp" : "productionnumber"},
		                             {"mDataProp" : "productorname"},
		                             {"mDataProp" : "productordesc"},
		                             {"mDataProp" : "drawcode"},
                                     {"mDataProp" : "dispatchingnumber"},
		                             {"mDataProp" : "productionchildsearchno"},
		                             {"mDataProp": "count"},
		                             {"mDataProp": "adjuststarttime"},
		                             {"mDataProp": "adjustendtime"}		                             ],
		                             "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
		                            	 //alert(aData.productionnumber);
		                             },
		                             "oLanguage" : {
		                            	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		                             },
		                             "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		                             "fnDrawCallback" : function(data) {


		                            	 com.leanway.setDataTableColumnHide("dispatchingOrderTable");
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
var initCompleteDispatchingOrder = function ( ) {
	var adjuststarttime = $("#adjuststarttime").val();
	var adjustendtime = $("#adjustendtime").val();
	var dispatchingstatus = $("input[name=dispatchingstatus]:checked").val();
	var groupid=$("#groupid").val();
	var centerid=$("#centerid").val();
	var personcenterid=$("#personcenterid").val();
	var table = $('#dispatchingOrderTableTwo').DataTable( {
		"ajax": "../../../../"+ln_project+"/dispatchingOrder?method=queryProductionTask&adjuststarttime="+adjuststarttime+"&adjustendtime="+adjustendtime+"&dispatchingstatus="+dispatchingstatus+"&groupid="+groupid+"&centerid="+centerid+"&personcenterid="+personcenterid,
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

		               "aoColumns": [


                                     {
                                         "mDataProp": "orderid",
                                         "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
//                                           $(nTd).html("<input type='checkbox' name='checkList'  value='" + sData + "'>");
                                             $(nTd)
                                             .html("<div id='stopPropagation" + iRow +"'>"
                                                     +"<input class='regular-checkbox' type='checkbox' id='"
                                                     + sData
                                                     + "' name='checkListTwo' value='"
                                                     + sData
                                                     + "'><label for='"
                                                     + sData
                                                     + "'></label>");
                                             com.leanway.columnTdBindSelectNew(nTd,"dispatchingOrderTableTwo","checkListTwo");
                                         }
                                     },
                                     {"mDataProp" : "productionnumber"},
		                             {"mDataProp" : "productorname"},
		                             {"mDataProp" : "productordesc"},
		                             {"mDataProp" : "drawcode"},
                                     {"mDataProp" : "dispatchingnumber"},
		                             {"mDataProp" : "productionchildsearchno"},
		                             {"mDataProp": "count"},
		                             {"mDataProp": "totalcount"},
		                             {"mDataProp": "unqualifiedcount"},
		                             {"mDataProp": "qualifiedcount"},
		                             {"mDataProp": "practicalstarttime"},
		                             {"mDataProp": "practicalendtime"}		                             ],
		                             "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
		                            	 //alert(aData.productionnumber);
		                             },
		                             "oLanguage" : {
		                            	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		                             },
		                             "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		                             "fnDrawCallback" : function(data) {


		                            	 com.leanway.setDataTableColumnHide("dispatchingOrderTableTwo");
		                            	 com.leanway.dataTableUnselectAll("dispatchingOrderTableTwo","checkAllTwo");
		                            	 com.leanway.setDataTableSelectNew("dispatchingOrderTableTwo",
	                                              null, "checkListTwo", null);
		                             }

	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
		table.columns.adjust();
	} );

	return table;
}

