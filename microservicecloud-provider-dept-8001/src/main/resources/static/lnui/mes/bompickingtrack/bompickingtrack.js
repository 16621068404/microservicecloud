var clicktime = new Date();
var oTable;
var detailTable;
var details;
var ope = "addBomStockTrack";
$(function() {

	// 初始化对象
	com.leanway.loadTags();
	com.leanway.formReadOnly("bomTrackForm");
	var form = $("#searchForm").serializeArray();
	// 加载datagrid
	oTable = initTable();
	
	detailTable = initDetailTable();
	
	$("input[name=confirmstatus]").click(function(){
		searchBomTrack();
    });
	// 全选
//	com.leanway.dataTableCheckAll("generalInfo", "checkAll", "checkList");
	com.leanway.enterKeyDown("searchValue", searchBomTrack);
	

	 initDate("#receivingtime");
	 initDate("#adjuststarttime");
	 initDate("#adjustendtime");
	

})

//初始化数据表格
var initTable = function () {

	var table = $('#generalInfo').DataTable( {
			"ajax": "../../../"+ln_project+"/bomTrack?method=queryBomStockTrackList",
			"pageUrl" : "bompickingtrack/bompickingtrack.html",
	        'bPaginate': true,
	        "bDestory": true,
	        "bRetrieve": true,
	        "bFilter":false,
	        "bSort": false,
	        //"scrollX": true,
	        "scrollY":"55vh",
	        "bProcessing": true,
	        "bServerSide": true,
	        'searchDelay':"5000",
	        "columns": [
                {
							"data" : "trackid"
						},{
							"data" : "tracknumber",
						}, {
							"data" : "productordesc",
						}, {
							"data" : "adjuststarttime",
						}, {
							"data" : "receivingtime",
						}, {
							"data" : "createuser"
						}
	         ],
	         "aoColumns": [
	               {
	            	   "mDataProp": "trackid",
	                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
	                	   $(nTd).html("<div id='stopPropagation" + iRow +"'>"
								   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='checkList' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label>");
						 com.leanway.columnTdBindSelectNew(nTd,"generalInfo","checkList");
	                   }
	               },
	               {"mDataProp": "tracknumber"},
	               {"mDataProp": "productordesc"},
	               {"mDataProp": "adjuststarttime"},
	               {"mDataProp": "receivingtime"},
	               {"mDataProp": "createuser"}
	          ],

	         "oLanguage" : {
	        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
	         },
	         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	         "fnDrawCallback" : function(data) {

					com.leanway.getDataTableFirstRowId("generalInfo", ajaxLoadBomTrack,"more","checkList");
					com.leanway.dataTableClickMoreSelect("generalInfo", "checkList", false,
                            oTable, ajaxLoadBomTrack,undefined,undefined, 'checkAll');
					com.leanway.dataTableCheckAllCheck('generalInfo', 'checkAll', 'checkList');
	         }
	    } ).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );

	return table;
}

//初始化数据表格
var initDetailTable = function (trackid) {

	var table = $('#grid-data').DataTable( {
			"ajax": "../../../"+ln_project+"/bomTrack?method=queryBomTrackDetailList&trackid=1",
			"pageUrl" : "bompickingtrack/bompickingtrack.html",
	        'bPaginate': true,
	        "bDestory": true,
	        "bRetrieve": true,
	        "bFilter":false,
	        "bSort": false,
	        "scrollX": true,
	        "scrollY":"55vh",
	        "bProcessing": true,
	        "bServerSide": true,
	        'searchDelay':"5000",
	        "columns": [
                {
							"data" : "trackdetailid"
						},{

							"data" : "productorname"
						}, {
							"data" : "productordesc",
						}, {
							"data" : "version",
						}, {
							"data" : "countunit",
						}, {
							"data" : "plannumber"
						}, {
							"data" : "canstockcount"
						}, {
							"data" : "batch"
						}, {
							"data" : "storenumber"
						}, {
							"data" : "trackcount"
						}, {
							"data" : "line"
						}, {
							"data" : "dispatchingnumber"
						}, {
							"data" : "adjuststarttime"
						}, {
							"data" : "adjustendtime"
						}
	         ],
	         "aoColumns": [
	               {
	            	   "mDataProp": "trackdetailid",
	                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
	                	   $(nTd).html("<div id='stopPropagation" + iRow +"'>"
								   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='checkDetailList' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label>");
						 com.leanway.columnTdBindSelectNew(nTd,"grid-data","checkDetailList");
	                   }
	               },
	               {"mDataProp": "productorname"},
	               {"mDataProp": "productordesc"},
	               {"mDataProp": "version"},
	               {"mDataProp": "countunit"},
	               {"mDataProp": "plannumber"},
	               {"mDataProp": "canstockcount"},
	               {"mDataProp": "batch"},
	               {"mDataProp": "storenumber"},
	               {"mDataProp": "trackcount"},
	               {"mDataProp": "line"},	               
	               {"mDataProp": "dispatchingnumber"},
	               {"mDataProp": "adjuststarttime"},
	               {"mDataProp": "adjustendtime"},
	          ],

	         "oLanguage" : {
	        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
	         },
	         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	         "fnDrawCallback" : function(data) {

//					com.leanway.getDataTableFirstRowId("grid-data", undefined,"more","checkDetailList");
//					com.leanway.dataTableClickMoreSelect("grid-data", "checkDetailList", false,
//                            detailTable, undefined,undefined,undefined, 'checkDetailAll');
					com.leanway.dataTableCheckAllCheck('grid-data', 'checkDetailAll', 'checkDetailList');
	         }
	    } ).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );

	return table;
}


/**
 * 加载物料追踪单到右侧显示
 * @param trackid
 */
function ajaxLoadBomTrack(trackid){

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/bomTrack?method=queryBomTrackObject",
		data : {
			"trackid" : trackid,
		},
		dataType : "text",
		async : false,
		success : function(data) {

            var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				setFormValue(tempData.bomTrack.resultObj);
				
		   }

		}
	});
	com.leanway.formReadOnly("bomTrackForm");
	
	detailTable.ajax.url("../../../"+ln_project+"/bomTrack?method=queryBomTrackDetailList&trackid="+trackid).load();
	
	// 保存trackid
	$("#trackid").val(trackid);
}


function deleteBomTrack(type){

	
	
	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");

	if (ids.length>0) {
		
//			 var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
//			
//			 if(confirmstatus==1){
//			        lwalert("tipModal", 1, "该备料计划已确认,不能删除！");
//			        return;
//			    }
			
	        var msg = "确定作废选中的" + ids.split(",").length + "条备料单吗?";

			lwalert("tipModal", 2, msg ,"isSure(" + type + ")");
	} else {

		    lwalert("tipModal", 1, "至少选择一条记录进行操作");
	}
}

function isSure(type) {

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
	deleteAjax(ids);
}

//作废备料计划
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/bomTrack?method=deleteStockBomTrack",
		data : {
			"conditions" : '{"ids":"' + ids + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

            var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
				if (tempData.code == "1") {

					resetForm();
					com.leanway.clearTableMapData( "generalInfo" );
					oTable.ajax.reload(null,false);

				} else {

					lwalert("tipModal", 1, "操作失败");

				}
			}
		}
	});
}


/**
 * 填充到HTML表单
 */
function setFormValue(data) {

	resetForm();

	for ( var item in data) {
		if (item != "searchValue") {
			if(item!="productionsearchno"&&item!="productionchildsearchno"&&item!="centerid"&&item!="personcenterid"){
				$("#" + item).val(data[item]);
				}
		}

	}

}


/**
 * 重置表单
 *
 */
var resetForm = function() {
	$('#bomTrackForm').each(function(index) {
		$('#bomTrackForm')[index].reset();
	});

	$("#tableHead").html("");
	$("#tableBody").html("");

	//$("#productionorderid").val(null).trigger("change");
	$("#barcodevalue").val(null).trigger("change");
}


//格式化form数据
var formatFormJson = function(formData) {
	var reg = /,$/gi;
	var data = "{";
	for (var i = 0; i < formData.length; i++) {
		if(formData[i].name == "trackDetailList"){
			data += "\"" + formData[i].name + "\" : " + formData[i].value + ",";
		}else{
			data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
		}
	}
//	
//	data += "\"trackDetailList\" : " + getTableDataToJson("grid-data");
	data = data.replace(reg, "");
	data += "}";
	return data;
}

// 初始化时间
function initDate(id) {
    $(id).datetimepicker({
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

/**
 * 搜索物料追踪单
 */
var searchBomTrack = function() {
	
	
	var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
	var searchVal = $("#searchValue").val();

	oTable.ajax.url(
			"../../../"+ln_project+"/bomTrack?method=queryBomStockTrackList&confirmstatus="+confirmstatus+"&searchValue="
					+ searchVal).load();
	
	
}


function checkBomtrack(){
	
    var ids = com.leanway.getCheckBoxData(1, "generalInfo", "checkList");
    var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
    if(confirmstatus==1){
        lwalert("tipModal", 1, "该备料计划已确认！");
        return;
    }
    if (ids.length == 0) {
        lwalert("tipModal", 1, "请选择备料计划进行确认!");
        return;
    }
    
    
	$.ajax({
		type : "POST",
		url : "../../../"+ln_project+"/bomTrack",
		data : {
			"method" : "updateConfirmstatus",
			"ids" : ids
		},
		dataType : "text",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				if (tempData.status == "success") {


					com.leanway.clearTableMapData( "generalInfo" );

					com.leanway.formReadOnly("bomTrackForm");

					oTable.ajax.reload();

					lwalert("tipModal", 1, "确认成功");

				} else {

					lwalert("tipModal", 1, "操作失败");
				}
			}
		}
	});
}

function closeBomTrack(type){

	
	
	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");

	if (ids.length>0) {
		
	        var msg = "确定关闭选中的" + ids.split(",").length + "条备料单吗?";

			lwalert("tipModal", 2, msg ,"isSureClose(" + type + ")");
	} else {

		    lwalert("tipModal", 1, "至少选择一条记录进行操作");
	}
}

function isSureClose(type) {

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
	console.info(ids);
	closeAjax(ids);
}

//作废备料计划
var closeAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/bomTrack?method=queryBomTrackToClose",
		data : {
			"conditions" : '{"ids":"' + ids + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

            var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
				if (tempData.status == "success") {

					resetForm();
					com.leanway.clearTableMapData( "generalInfo" );
					oTable.ajax.reload(null,false);

				} 
				lwalert("tipModal", 1, tempData.info);
			}
		}
	});
}

// 备料完成
function completePreparation(){
	// 初始化参数:type 1:当前页面的数据，2：跨页数据
	var type = "1";
	// 首先，获取左边列表选中状态
	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
	// 只能选1条
	if(ids == null || ids.trim() == null || ids.trim() == ""){
		lwalert("tipModal", 1, "至少选择一条备料计划进行操作");
		return;
	}else if(ids.split(",").length != 1){
		lwalert("tipModal", 1, "只能选择一条备料计划进行操作");
		return;
	}
	// 获取选中数据
	var obj = $("#generalInfo").DataTable().rows('.row_selected').data()[0];
	// 参数：备料计划：ids；状态传固定值：2；
	lwalert("tipModal", 2, "确定备料完成？",updateConfirmstatus(obj));
}
// 确认备料计划完成
function updateConfirmstatus(obj){
	$.ajax({
		type: "POST",
		url: "../../../"+ln_project+"/bomTrack?method=updateConfirmstatus",
		data: {
			"ids" : obj.trackid,
			"confirmstatus" : 2
		},
		success: function(msg){
			var data = JSON.parse(msg);
			console.log("请求结果：" + data);
			lwalert("tipModal", 1, data.info);
			// 刷新表格 
			$('#generalInfo,#grid-data').DataTable().ajax.reload();
		}
	})
}

// 监听select，根据选择的标签不同，弹框表单放入不同的信息
function labelChange(){
	// 放入标签数量
	var result = $("#select_label").val();
	if(result == null || result.trim() == ""){
		$("#labelCount").val(null);
		$("#productorstatus").val(null);
		return;
	}
	// 放入产品状态
	var arr = result.split(",");
	$("#labelCount").val(arr[0]);
	if(arr[1] != null && arr[1] == "A"){
		$("#productorstatus").val("合格");
	}else{
		$("#productorstatus").val("未检");
	}
}

// 参数验证
function stringCheck(str){
	if(str == null || str == "" || typeof(str) == "undefind"){
		return false;
	}else{
		return true;
	}
}

/**
 * 单条明细进行备料
 */
function updateStock(){
	// 初始化参数:type 1:当前页面的数据，2：跨页数据
	var type = "1";
	var ids = com.leanway.getCheckBoxData(type, "grid-data", "checkDetailList");
	
	// 只能选1条
	if(ids == null || ids.trim() == null || ids.trim() == ""){
		lwalert("tipModal", 1, "至少选择一条备料明细进行操作");
		return;
	}else if(ids.split(",").length != 1){
		lwalert("tipModal", 1, "只能选择一条备料明细进行操作");
		return;
	}else{
		// 1：单次只能操作1条；2：修改状态
		var idArray = ids.split(",");
		if(idArray != null && idArray.length == 1){
			// 把明细ID存起来
			$("#trackdetailid").val(idArray[0]);
			// 获取到选中的行数据
			var obj = $("#grid-data").DataTable().rows('.row_selected').data()[0];
			// 把数据放入弹框
			$("#productorshortname").val(obj.productorname);
			$("#productorname").val(obj.productorname);
			$("#productionmoduleid").val(obj.productionmoduleid);
			// 应备数量：canstockcount 已备数量：trackcount
			var canstockcount = parseInt(((obj.canstockcount == null || obj.canstockcount == "")?0:obj.canstockcount));
			var trackcount = parseInt(((obj.trackcount == null || obj.trackcount == "")?0:obj.trackcount));
			var requiredQuantity = canstockcount - trackcount;
			// 设置剩余应备数量
			$("#requiredQuantity").val(requiredQuantity);
			// 根据物料编码去获取标签列表
			// 查询该备料明细的详细信息
			$.ajax({
				type: "POST",
				url: "../../../"+ln_project+"/bomTrack?method=query",
				data: {
					"productorname":obj.productorname
				},
				dataType: "json",
				success: function(data){
					console.log("请求结果：" + data);
					console.log("标签信息：" + data.result);
					// 标签列表
					var result = data.result;
					var option = "<option value=''>--请选择--</option>";
					// 去除“--请选择--”
					if(result.length > 0){
						$("#select_label").children().remove();
					}
					// 清空select
					$("#select_label").children().remove();
					
					// 组装option
					$(result).each(function(index,e){
						// 放入数量+状态
						option += "<option value='"+(parseInt(e.count)-parseInt(stringCheck(e.allocatednumber)?e.allocatednumber:0))+","+e.productorstatus+"'" +
						// 自定义属性，把标签的信息放入option
						" batch='" +e.batch+"'" +
						" canstockcount='" +e.canstockcount+"'" +
						" createuser='" +e.createuser+"'" +
						" dispatchingnumber='" +e.dispatchingnumber+"'" +
						" line='" +e.line+"'" +
						" mapid='" +e.mapid+"'" +
						" mapproductordetailid='" +e.mapproductordetailid+"'" +
						" orderid='" +e.orderid+"'" +
						" productionmoduleid='" +e.productionmoduleid+"'" +
						" productordesc='" +e.productordesc+"'" +
						" productorid='" +e.productorid+"'" +
						" productorname='" +e.productorname+"'" +
						" productorstatus='" +e.productorstatus+"'" +
						" sort='" +e.sort+"'" +
						" status='" +e.status+"'" +
						" stockcount='" +e.stockcount+"'" +
						" stocknumber='" +e.stocknumber+"'" +
						" trackdetailid='" +e.trackdetailid+"'" +
						" version='" +e.version+"'" +
						" versionid='" +e.versionid+"'" +
						">" +
						"标签" +(index+1)+ "</option>";
					})
					console.log("option=" + option);
					// 放入select
					$("#select_label").append(option);
				},
				error: function(data){
				   
				}
			});
			// 显示弹框
			com.leanway.show("updateDetailModel");
		}
	}
}

//备料明细保存
function updateDetail(){
	//=========================== 参数验证  =========================//
	// 验证参数
	// 如果剩余应备数量为0，则不允许备料
	if($("#requiredQuantity").val() == "0" || $("#requiredQuantity").val() == "" || $("#requiredQuantity").val() < 0){
		lwalert("tipModal", 1, "剩余应备数量为0，不允许备料");
		return;
	}
	// 初始化参数:type 1:当前页面的数据，2：跨页数据
	var type = "1"; 
	var ids_left = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
	var left_Obj = $("#generalInfo").DataTable().rows('.row_selected').data()[0];
	console.log(left_Obj);
	if(ids_left == null || ids_left == "" || ids_left.split(",").length != 1){
		// 隐藏遮罩层(失败时隐藏遮罩层，是因为，弹框所在的层级：z-index 小于 遮罩层。其次：数据执行后，页面的数据会更改，需要重新查询)
		$("#updateDetailModel").modal("hide");
		lwalert("tipModal", 1, "请选择1条备料计划");
		return;
	}
	if($("#select_label option:selected").val() == "" || $("#select_label option:selected").val() == null){
		// 隐藏遮罩层(失败时隐藏遮罩层，是因为，弹框所在的层级：z-index 小于 遮罩层。其次：数据执行后，页面的数据会更改，需要重新查询)
		$("#updateDetailModel").modal("hide");
		lwalert("tipModal", 1, "请选择标签");
		return;
	}
	if($("#stockcount").val() == null || $("#stockcount").val() == 0 || $("#stockcount").val() == ""){
		// 隐藏遮罩层(失败时隐藏遮罩层，是因为，弹框所在的层级：z-index 小于 遮罩层。其次：数据执行后，页面的数据会更改，需要重新查询)
		$("#updateDetailModel").modal("hide");
		lwalert("tipModal", 1, "请输入备料数量");
		return;
	}
	//=========================== 封装json数据  =========================//
	// 1、封装主体信息
	var soc = new Object();
	soc.barcode = $("#barcode").val()+"";
	soc.productionnumber = $("#productionnumber").val()+"";
	soc.receivingtime = $("#receivingtime").val()+"";
	soc.tracknumber = $("#tracknumber").val()+"";
	soc.adjuststarttime = $("#adjuststarttime").val()+"";
	soc.productordesc = $("#Productordesc").val()+"";
	soc.productorname = $("#productorname").val()+"";
	soc.trackid = $("#trackid").val();
	soc.productionorderid = left_Obj.productionorderid;
	// 2、封装明细(获取option自定义标签信息，放到soc的明细list里面)
	// 创建list
	soc.trackDetailList = new Array();
	// 创建明细对象
	var sod = new Object();
	// 获取option自定义信息
	var label_Obj = $("#select_label option:selected");
	sod.batch = stringCheck($(label_Obj).attr("batch"))?$(label_Obj).attr("batch"):null;
	// 剩余应备数量
	sod.canstockcount = stringCheck($("#requiredQuantity").val())?parseInt($("#requiredQuantity").val()):null;//stringCheck($(label_Obj).attr("canstockcount"))?parseInt($(label_Obj).attr("canstockcount")):null;
	
	sod.createuser = stringCheck($(label_Obj).attr("createuser"))?$(label_Obj).attr("createuser"):null;
	sod.dispatchingnumber = stringCheck($(label_Obj).attr("dispatchingnumber"))?$(label_Obj).attr("dispatchingnumber"):null;
	sod.line = stringCheck($(label_Obj).attr("line")) ? parseInt($(label_Obj).attr("line")):null;
	sod.mapid = stringCheck($(label_Obj).attr("mapid"))?$(label_Obj).attr("mapid"):null;
	sod.mapproductordetailid = stringCheck($(label_Obj).attr("mapproductordetailid"))?$(label_Obj).attr("mapproductordetailid"):null;
	sod.orderid = stringCheck($(label_Obj).attr("orderid"))?$(label_Obj).attr("orderid"):null;
	sod.productionmoduleid = $("#productionmoduleid").val();//stringCheck($(label_Obj).attr("productionmoduleid"))?$(label_Obj).attr("productionmoduleid"):null;
	sod.productordesc = stringCheck($(label_Obj).attr("productordesc"))?$(label_Obj).attr("productordesc"):null;
	sod.productorid = stringCheck($(label_Obj).attr("productorid"))?$(label_Obj).attr("productorid"):null;
	sod.productorname = stringCheck($(label_Obj).attr("productorname"))?$(label_Obj).attr("productorname"):null;
	sod.productorstatus = stringCheck($(label_Obj).attr("productorstatus"))?$(label_Obj).attr("productorstatus"):null;
	sod.sort = stringCheck($(label_Obj).attr("sort"))?parseInt($(label_Obj).attr("sort")):null;
	sod.status = stringCheck($(label_Obj).attr("status"))?parseInt($(label_Obj).attr("status")):null;
	// 本次备料数量
	sod.stockcount = stringCheck($("#stockcount").val())?parseInt($("#stockcount").val()):null;//stringCheck($(label_Obj).attr("stockcount"))?parseInt($(label_Obj).attr("stockcount")):null;
	// 不确定是哪个参数，但是多次pda提交，该参数始终为0
	sod.stocknumber = stringCheck($(label_Obj).attr("stocknumber"))?parseInt($(label_Obj).attr("stocknumber")):null;
	sod.trackdetailid = $("#trackdetailid").val();//stringCheck($(label_Obj).attr("trackdetailid"))?$(label_Obj).attr("trackdetailid"):null;
	sod.version = stringCheck($(label_Obj).attr("version"))?$(label_Obj).attr("version"):null;
	sod.versionid = stringCheck($(label_Obj).attr("versionid"))?$(label_Obj).attr("versionid"):null;
	// 赋值
	soc.trackDetailList.push(sod);
	
	var formData = JSON.stringify(soc);
	$.ajax({
		type: "POST",
		url: "../../../"+ln_project+"/bomTrack?method=confirmationOfPreparation",
		data: {
			"formData":formData
		},
		success: function(msg){
			var data = JSON.parse(msg);
			// 隐藏遮罩层(失败时隐藏遮罩层，是因为，弹框所在的层级：z-index 小于 遮罩层。其次：数据执行后，页面的数据会更改，需要重新查询)
			$("#updateDetailModel").modal("hide");
			if(data.status == "success"){
				// 刷新表格 
				$('#generalInfo,#grid-data').DataTable().ajax.reload();
				// 更新标签数量
				$("#labelCount").val(parseInt($("#labelCount").val())-parseInt($("#stockcount").val()));
				lwalert("tipModal", 1, data.info);
			}else if(data.info == "" || data.info == null){
				lwalert("tipModal", 1, "备料失败");
			}else{
				lwalert("tipModal", 1, data.info);
			}
		},
		error: function(data){
			var data = JSON.parse(msg);
			lwalert("tipModal", 2, data.info);
			return;
		}
	});
}

/**
 * 多条数据进行备料
 * 逻辑：把明细列表里面的产品名称，版本ID，批量传递到后台；
 * 在后台进行查询，梳理，封装数据，进行请求。
 */
function batchUpdateStock(ids_right, table, type){
	// 初始化参数:type 1:当前页面的数据，2：跨页数据
	var type = "1";
	// ==========================================获取选中数据
	// 主体数据(备料计划)
	var objArray = $("#generalInfo").DataTable().rows('.row_selected').data();
	// 明细数据(明细列表)
	var ids = com.leanway.getCheckBoxData(type, "grid-data", "checkDetailList");
	var detailArray = $("#grid-data").DataTable().rows('.row_selected').data();
	// ==========================================验证参数
	// 备料计划只能选择一条
	if(objArray == null || objArray.length == 0){
		lwalert("tipModal", 1, "备料计划至少选择一条");
		return;
	}
	if(objArray.length > 1){
		lwalert("tipModal", 1, "备料计划只能选择一条");
		return;
	}
	// 备料明细可以选择多条
	if(ids == null || typeof(ids) == "undefind" || ids.trim() == ""){
		lwalert("tipModal", 1, "至少选择一条备料明细进行操作");
		return;
	}
	// ==========================================封装数据
	// 封装主体
	var body = new Object();
	body.barcode = objArray[0].barcode;
	body.productionnumber = objArray[0].productionnumber;
	body.receivingtime = new Date(objArray[0].receivingtime).Format("yyyy-MM-dd hh:mm:ss.S");
	body.tracknumber = objArray[0].tracknumber;
	body.adjuststarttime = new Date(objArray[0].adjuststarttime).Format("yyyy-MM-dd hh:mm:ss.S");
 	body.productordesc = objArray[0].productordesc;
 	body.productorname = objArray[0].productorname;
 	body.trackid = objArray[0].trackid;
 	body.productionorderid = objArray[0].productionorderid;
	// 封装明细
	var dataArray = new Array();
	// 判断标志
	var flag = true;
	var flagMsg = "";
	$(detailArray).each(function(index,e){
		// 明细校验
		if(e.canstockcount == e.trackcount){
			flag = false;
			// 派工单号
			flagMsg = e.dispatchingnumber;
			return false;
		}
		
		
		var sod = new Object();
		// 把能在页面获取到的数据，封装起来
		sod.productorname = e.productorname;
		sod.versionid = e.versionid;
		sod.productionnumber = objArray[0].productionnumber;
		// 应备数量
		sod.canstockcount = e.canstockcount;
		// 实际备料数量
		sod.trackcount = (e.trackcount==null?0:e.trackcount);
		sod.createuser = e.createuser;
		sod.line = e.line;
		sod.productionmoduleid = e.productionmoduleid;
		sod.trackdetailid = e.trackdetailid;
		
		// 不能在页面获取到的，在后台查询后，封装起来
		// 赋值
		dataArray.push(sod);
	});
	
	if(!flag){
		lwalert("tipModal", 1, "派工单号为"+flagMsg+"的明细已备料！");
		return;
	}
	// ==========================================提交请求
	$.ajax({
		type: "POST",
		url: "../../../"+ln_project+"/bomTrack?method=batchUpdateStock",
		data: {
			"bodyInfo" : JSON.stringify(body),
			"detailInfo" : JSON.stringify(dataArray)
		},
		dataType: "json",
		success: function(data){
			if(data.status == "success"){
				if(data.result == null || data.result.length == 0){
					lwalert("tipModal", 1, data.info);
				}else if(data.result.length > 2){
					lwalert("tipModal", 1, data.result.length+"条明细备料失败");
				}else{
					
					var msg = "";
					$(data.result).each(function(index,e){
						msg += e + "<br>";
					})
						
					lwalert("tipModal", 1, msg);
				}
				// 刷新表格：
				$('#grid-data').DataTable().ajax.reload();
			}else{
				if(data.info == null || data.info == ""){
					lwalert("tipModal", 1, "备料失败");
				}else{
					lwalert("tipModal", 1, data.info);
				}
			}
		}
	});
	
}

