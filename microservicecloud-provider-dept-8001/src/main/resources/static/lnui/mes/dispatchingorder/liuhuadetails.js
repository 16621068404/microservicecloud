var datable;
$(function() {
    // 初始化对象
    com.leanway.loadTags();
    // 全选
    com.leanway.initTimePickYmdForMoreId("#starttime,#endtime,#starttime2,#endtime2");
    com.leanway.initSelect2("#productorid",
			"../../../"+ln_project+"/productors?method=queryProductorBySearch", "搜索产品");
    com.leanway.initSelect2("#mouldid",
			"../../../"+ln_project+"/productors?method=queryProductorBySearch", "搜索模具");
    datable = initTable();
    $("#mouldid,#productorid").on("select2:select" , function( e ) {
    	searchResust();
    });
    $("#starttime,#endtime,#starttime2,#endtime2").on("change", function(e) {
    	searchResust();
    });
	com.leanway.enterKeyDown("dispatchingnumber", searchResust);

})

var initTable = function () {
    var table = $('#tableid').DataTable( {
            "ajax": "../../../../"+ln_project+"/dispatchingOrder?method=queryDispatchingOrderSplitDetails",
            'bPaginate': true,
            "bDestory": true,
            "bRetrieve": true,
            "bFilter":false,
            "bSort": false,
            "bProcessing": true,
            "bServerSide": true,
            'searchDelay':"5000",
             "aoColumns": [
                    {
                       "mDataProp": "mouldorderid",
                       "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                           $(nTd).html("<div id='stopPropagation" + iRow +"'>"
                                   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='checkList' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label>");
                           com.leanway.columnTdBindSelect(nTd,"tableid","checkList");
                       }
                   	},
                   	{"mDataProp": "dispatchingnumber"},
                   	{"mDataProp": "productorname"},
                   	{"mDataProp": "productordesc"},
                   	{"mDataProp": "mouldname"},
                   	{"mDataProp": "moulddesc"},
                   	{"mDataProp": "plannumber"},
                   	{"mDataProp": "starttime"},
                   	{"mDataProp": "endtime"},
                   	{
					"mDataProp": "detailstatus",
					 "fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
							$(nTd).html(detailStatus(sData));
						}
					}

              ],

             "oLanguage" : {
                 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
             },
             "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
             "fnDrawCallback" : function(data) {
             }
        } ).on('xhr.dt', function (e, settings, json) {
            com.leanway.checkLogind(json);
        } );
    
    
    return table;
}
var searchResust = function(){
	var searchCondition = getSearchConditions();
	var strCondition = encodeURIComponent($.trim(JSON.stringify(searchCondition)));
	datable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryDispatchingOrderSplitDetails&strCondition=" + strCondition).load();
    
}
var getSearchConditions = function (  ) {

	var sqlJsonArray = new Array()

	// 子查询号
	var dispatchingnumber = $("#dispatchingnumber").val();
	if (dispatchingnumber != null && dispatchingnumber != "" && typeof(dispatchingnumber) != "undefined" && dispatchingnumber != undefined) {
		dispatchingnumber = dispatchingnumber.toString();
	}

	// 产品类型
	var productorid = $("#productorid").val();

	if (productorid != null && productorid != "" && typeof(productorid) != "undefined" && productorid != undefined) {
		productorid = productorid.toString();
	}
	// 产品类型
	var mouldid = $("#mouldid").val();

	if (mouldid != null && mouldid != "" && typeof(mouldid) != "undefined" && mouldid != undefined) {
		mouldid = mouldid.toString();
	}

	// 开始时间
	var starttime = $("#starttime").val();

	// 结束时间
	var endtime = $("#endtime").val();
	
	// 开始时间
	var starttime2 = $("#starttime2").val();

	// 结束时间
	var endtime2 = $("#endtime2").val();

	if ($.trim(dispatchingnumber) != "") {

		var dispatchingObj = new Object();
		dispatchingObj.fieldname = "d.dispatchingnumber";
		dispatchingObj.fieldtype = "varchar";
		dispatchingObj.value = dispatchingnumber;
		dispatchingObj.logic = "and";
		dispatchingObj.ope = "=";

		sqlJsonArray.push(dispatchingObj);
	}

	if ($.trim(productorid) != "") {

		var productoridObj = new Object();
		productoridObj.fieldname = "p.productorid";
		productoridObj.fieldtype = "varchar_select2";
		productoridObj.value = productorid;
		productoridObj.logic = "and";
		productoridObj.ope = "in";

		sqlJsonArray.push(productoridObj);
	}

	if ($.trim(mouldid) != "") {

		var mouldidObj = new Object();
		mouldidObj.fieldname = "p2.productorid";
		mouldidObj.fieldtype = "varchar";
		mouldidObj.value = mouldid;
		mouldidObj.logic = "and";
		mouldidObj.ope = "=";

		sqlJsonArray.push(mouldidObj);
	}

	if ($.trim(starttime) != "") {

		var starttimeObj = new Object();
		starttimeObj.fieldname = "d.starttime";
		starttimeObj.fieldtype = "datetime";
		starttimeObj.value = starttime;
		starttimeObj.logic = "and";
		starttimeObj.ope = ">=";

		sqlJsonArray.push(starttimeObj);
	}
	
	if ($.trim(starttime2) != "") {

		var starttimeObj = new Object();
		starttimeObj.fieldname = "d.starttime";
		starttimeObj.fieldtype = "datetime";
		starttimeObj.value = starttime2;
		starttimeObj.logic = "and";
		starttimeObj.ope = "<=";

		sqlJsonArray.push(starttimeObj);
	}

	if ($.trim(endtime) != "") {

		var endtimeObj = new Object();
		endtimeObj.fieldname = "d.endtime";
		endtimeObj.fieldtype = "datetime";
		endtimeObj.value = endtime;
		endtimeObj.logic = "and";
		endtimeObj.ope = ">=";

		sqlJsonArray.push(endtimeObj);
	}
	
	if ($.trim(endtime2) != "") {

		var endtimeObj = new Object();
		endtimeObj.fieldname = "d.endtime";
		endtimeObj.fieldtype = "datetime";
		endtimeObj.value = endtime2;
		endtimeObj.logic = "and";
		endtimeObj.ope = "<=";

		sqlJsonArray.push(endtimeObj);
	}


	var condition = new Object();
	condition.sqlDatas = sqlJsonArray;

	return condition;
}

var deleteSplitOrder = function ( ) {
	// 获取选中数据
	var id = com.leanway.getDataTableCheckIds("checkList"); 
	// 验证参数
	if (id == "") {
		lwalert("tipModal", 1, "请选择要删除的单据!");
		return;
	}
	// 获取选中的列表
	var detailObjList = $("#tableid").DataTable().rows('.row_selected').data();
	// 验证状态
	var flag = true; 
	$(detailObjList).each(function(index,e){
		if(e.detailstatus != 0 && e.detailstatus != 1){
			lwalert("tipModal", 1, "已开工的明细不能删除，请重新选择");
			flag = false;
			return;
		}
	})
	if(flag == true){
		// 删除
		var msg = "确定删除选中的" + id.split(",").length + "条单据?";
		lwalert("tipModal", 2, msg ,"isSureDelete()");
	}
	
}

var isSureDelete = function ( ) {
	
	var id = com.leanway.getDataTableCheckIds("checkList"); 
	
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "deleteDispatchingOrderSplitDetails",
			"ids" : id
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

			    lwalert("tipModal", 1, text.info);

				if (text.status == "success") {
 
					datable.ajax.reload(null,false);

				}

			}

		}
	});
}

/**
 * 硫化明细确认
 */
function culcanizationConfirm(){
	// 待确认0:未确认，1：已确认
	//==========================================================验证参数//
	// 初始化参数:type 1:当前页面的数据，2：跨页数据
	var type = "1"; 
	// 获取选中行数据
	var ids = com.leanway.getCheckBoxData(type, "tableid", "checkList");
	var objs = $("#tableid").DataTable().rows('.row_selected').data();
	if(ids == null || ids == "" || typeof(ids) == "undefind"){
		lwalert("tipModal", 1, "至少选择一条数据");
		return;
	}
	if(objs == null || objs == "" || typeof(objs) == "undefind" ){
		lwalert("tipModal", 1, "选中的数据为空");
		return;
	}
	// 状态验证
	for (obj in objs){  
		if(objs[obj].detailstatus > 0){
			lwalert("tipModal", 1, "勾选的列表存在已确认的订单，请重新选择");
			return;
		}
	}  
	//==========================================================提交请求//
	$.ajax({
		type: "POST",
		url : "../../../../"+ln_project+"/dispatchingOrder?method=confirmDetailStatus",
		data: {
			"ids" : ids
		},
		dataType: "json",
		success: function(data){
			if(data.status == "success"){
				lwalert("tipModal", 1, data.info);
			}else{
				if(data.info == null || data.info == ""){
					lwalert("tipModal", 1, "确认失败");
				}else{
					lwalert("tipModal", 1, data.info);
				}
			}
		}
	});
}

/**
 * 硫化明细状态
 */
var detailStatus = function ( status ) {
	//0:未确认；1：已确认；2：开工；3：完工；6：关闭
	var result = "";
	switch (status) {
	case 0:
		result = "未确认";
		break;
	case 1:
		result = "已确认";
		break;
	case 2:
		result = "开工";
		break;
	case 3:
		result = "完工";
		break;
	case 6:
		result = "关闭";
		break;
	default:
		result = "";
		break;
	}
	return result;
}