var clicktime = new Date( );
//表头表格
var bomTrackTable = "";
var oTable = "";
var detail = "";
var opeMethod = "updateDetail";
$(function() {
	// checkSession();
	// 初始化对象
	com.leanway.loadTags();
	// 加载datagrid

	//初始化表头数据
	bomTrackTable = initTable();

	oTable = initDetailTable();

	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchBomTrack);
	
	$("input[name=confirmstatus]").click(function(){
		searchBomTrack();
    });
})


/**
 * 初始化表头表格
 */
//初始化数据表格
var initTable = function () {
	var table = $('#generalInfo').DataTable( {
			"ajax": "../../../"+ln_project+"/stockOrder?method=queryStockOrderList",
			"pageUrl"  :   "bompickingtrackstock/bompickingtrackstock.html",
	        'bPaginate': true,
	        "bDestory": true,
	        "bRetrieve": true,
	        "bFilter":false,
	        "bSort": false,
	        "scrollX": true,
	        "scrollY":"300px",
	        "bProcessing": true,
	        "bServerSide": true,
	        'searchDelay':"5000",
	        "columns": [
                {
							"data" : "trackid"
						},{

							"data" : "tracknumber"
						}, {
							"data" : "productionnumber",
						}, {
							"data" : "plantracknumber",
						}, {
							"data" : "adjuststarttime",
						}, {
							"data" : "receivingtime"
						}
	         ],
	         "aoColumns": [
	               {
	            	   "mDataProp": "trackid",
	                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
	                	   $(nTd).html("<div id='stopPropagation" + iRow +"'>"
								   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='checkBomList' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label>");
						 com.leanway.columnTdBindSelectNew(nTd,"generalInfo","checkBomList");
	                   }
	               },
	               {"mDataProp": "tracknumber"},
	               {"mDataProp": "productionnumber"},
	               {"mDataProp": "plantracknumber"},
	               {"mDataProp": "adjuststarttime"},
	               {"mDataProp": "receivingtime"},
	          ],

	         "oLanguage" : {
	        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
	         },
	         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	         "fnDrawCallback" : function(data) {

					com.leanway.getDataTableFirstRowId("generalInfo", ajaxLoadBomTrackDetail,"more","checkBomList");
					com.leanway.dataTableClickMoreSelect("generalInfo", "checkBomList", false,
							bomTrackTable, ajaxLoadBomTrackDetail,undefined,undefined, 'checkAll');
					com.leanway.dataTableCheckAllCheck('generalInfo', 'checkAll', 'checkBomList');
	         }
	    } ).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );

	return table;
}

var initDetailTable = function () {

		var table = $('#detail').DataTable( {
				"ajax": "../../../"+ln_project+"/stockOrder?method=queryDetailListByTrackid",
				"pageUrl"  :   "bompickingtrackstock/bompickingtrackstock.html",
				'bPaginate': true,
		        "bDestory": true,
		        "bRetrieve": true,
		        "bFilter":false,
		        "bSort": false,
		        "scrollX": true,
		        "scrollY":"250px",
		        "bProcessing": true,
		        "bServerSide": true,
		        'searchDelay':"5000",
		        "columns": [
	                {
								"data" : "trackdetailid"
							},{

								"data" : "productorname"
							},{

								"data" : "productordesc"
							}, {
								"data" : "version",
							}, {
								"data" : "countunit",
							},
				       		{
				       			"data" : "plannumber",
				       		}, {
								"data" : "canstockcount"
							}, {

								"data" : "stockcount"
							}, {

								"data" : "remaincount"
							}, {

								"data" : "pickingcount"
							}, {

								"data" : "planreturncount"
							}, {
								"data" : "name"
							}, {
								"data" : "batch"
							}
//							, {
//								"data" : "subbatch"
//							}, {
//								"data" : "serialnumber"
//							}, {
//								"data" : "shorname"
//							}
		         ],
		         "aoColumns": [
		               {
		            	   "mDataProp": "trackdetailid",
		                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
		                	   $(nTd).html("<div id='stopPropagation" + iRow +"'>"
									   +"<input class='regular-checkbox' type='checkbox' id='" + sData
	                                   + "' name='checkList' value='" + sData
	                                   + "'><label for='" + sData
	                                   + "'></label>");
		                	   //设置dataTables是否可多选
							 com.leanway.columnTdBindSelectNew(nTd,"detail","checkList");
		                   }
		               },
		               {
		       			"mDataProp" : "productorname"
		       		},
		       		{
		       			"mDataProp" : "productordesc",
		       		},
		       		{
		       			"mDataProp" : "version",
		       		},
		       		{
		       			"mDataProp" : "countunit",
		       		},
		       		{
		       			"mDataProp" : "plannumber",
		       		},
		       		{
		       			"mDataProp" : "canstockcount",
		       		},
		       		{
		       			"mDataProp" : "stockcount",
		       		},
		       		{
		       			"mDataProp" : "remaincount",
		       		},
		       		{
		       			"mDataProp" : "pickingcount",
		       		},
		       		{
		       			"mDataProp" : "planreturncount",
		       		},
		       		{
		       			"mDataProp" : "name",
		       		},
		       		{
		       			"mDataProp" : "batch",
		       		}
//		       		,
//		       		{
//		       			"mDataProp" : "subbatch",
//		       		},
//		       		{
//		       			"mDataProp" : "serialnumber",
//		       		},
//		       		{
//		       			"mDataProp" : "shorname",
//		       		}
		          ],

		         "oLanguage" : {
		        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		         },
		         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		         "fnDrawCallback" : function(data) {

		         }
		    } ).on('xhr.dt', function (e, settings, json) {

			} );

		return table;
	}



//入库
function outStore (){

	//获取选中的记录
	var ids = com.leanway.getCheckBoxData(1,"generalInfo", "checkBomList");
	var confirmstatus = $('input[name="confirmstatus"]:checked').val();
	if (confirmstatus==1) {
		lwalert("tipModal",1,"该备料单已经领料,不能执行领料操作");
		return ;
	}

	if (ids.length>0) {
        var msg = "确定对选中的" + ids.split(",").length + "条备料单领料?";

		lwalert("tipModal", 2, msg ,"isSureStore()");
	} else {
		lwalert("tipModal", 1, "至少选择一条记录进行领料操作！");
	}
}

/**
 * 领料操作
 */
function isSureStore() {

	//获取选中的id，然后从中根据id得到相应仓库数据
	var ids = com.leanway.getCheckBoxData(1,"generalInfo", "checkBomList");
	//查看dataTable里面的产品和备料量是否是空的
	var returnTemp = "";
		$("#detail tbody tr").each( function( ) {
			var productordesc = $(this).find("td:eq(1)").text();
			var name = $(this).find("td:eq(6)").text();
			 if (productordesc == undefined || productordesc == null || productordesc == ''){
				returnTemp = "产品不能为空";
			 }
			 if (name == undefined || name == null || name == ''){
				 returnTemp = "仓库不能为空";
			 }
		})
	if(returnTemp == "产品为空"||returnTemp == "仓库为空") {
		lwalert("tipModal",1,returnTemp);
		return ;
	}
	//然后执行操作
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/bomTrack",
		data : {
			"method" : "pickingStock",
			"ids" :ids,
		},
		dataType : "text",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);

				if(tempData.status == "success"){
					//将新增和删除设置为不可选
//					$("#addProductorButton").prop("disabled",true);
//					$("#delProductorButton").prop("disabled",true);
					oTable.ajax.reload();
					lwalert("tipModal", 1, "领料成功！");
				}else{

					lwalert("tipModal", 1, "领料失败！");
				}
			}else{

			}
		}
	});
}




/*
 *
 */
var getTrackDetailByTrackDetailId = function (trackdetailid ) {
	//查询数据
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/bomTrack?method=queryStockProductionDetailList",
		data : {
			"trackDetailId" : trackdetailid,
		},
		dataType : "text",
		async : false,
		success : function(data) {

            var flag =  com.leanway.checkLogind(data);
			if(flag){
				var tempData = $.parseJSON(data);
//				console.info(tempData);
//				editDetailTable();

				detail =tempData.data;

		   }

		}
	});
	com.leanway.formReadOnly("bomTrackForm");

};


/**
 * 搜索物料追踪单
 */
var searchBomTrack = function() {

	var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
	
	var searchVal = $("#searchValue").val();

	bomTrackTable.ajax.url(
			"../../../"+ln_project+"/stockOrder?method=queryStockOrderList&searchValue="
					+ searchVal +"&confirmstatus=" + confirmstatus).load();
}

/**
 * 加载右边的明细的记录
 */
function ajaxLoadBomTrackDetail(trackid){
	var trackid2 =trackid;
	oTable.ajax.url("../../../../"+ln_project+"/stockOrder?method=queryDetailListByTrackid&trackid=" + trackid).load();
}


/**
 *  通过选中明细id查询明细信息
 */
var printLabel = function (type) {
	
	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "detail", "checkList");

	if (ids.length>0) {
			
	        var msg = "确定对选中的" + ids.split(",").length + "条备料明细打印标签?";

			lwalert("tipModal", 2, msg ,"isSurePrintLabel(" + type + ")");
	} else {

		    lwalert("tipModal", 1, "至少选择一条记录进行操作");
	}

}

/**
 *  通过选中明细id查询明细信息
 */
var isSurePrintLabel = function (type) {


	var ids = com.leanway.getCheckBoxData(type, "detail", "checkList");

	$.ajax ( {
		type : "post",
		url : "../../../../" + ln_project + "/stockOrder",
		data : {
			"method" : "queryStockOrderDetailByIds",
			"ids" : ids
		},
		dataType : "json",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {


				if (data.status == "success") {


					var message = data.detailList;
					
					//若为多个直接转到打印页面
					if(message.length>1){
						
						var printName = "仓储部备料标签";
						var printFile = "ccbblbq";
						
//						var report =  "\"Reports\":{\"printName\":\""+printName+"\",\"printFile\": \""+printFile+"\",\"ConnectionString\":\"\",\"QuerySQL\":\"\",\"DetailGrid\":{\"Recordset\": {\"ConnectionString\": \"xml\",\"QuerySQL\": \"\"},\"PrintPreview\":true}}"
//						message = "{\"detail\":"+JSON.stringify(message)+","+report+"}";
						
						com.leanway.sendReportData(printName, printFile, JSON.stringify(message));
						
				    //一个，弹出模态框，填写备注
					}else{
						
						var list = data.detailList;
						
						setLabelPrintFormVal(list[0]);
						// 弹出modal
						$('#labelPrintDiv').modal({backdrop: 'static', keyboard: true});
					}
				
					
				} else {

					lwalert("tipModal", 1, data.info);

				}

			}
		}
	});

}


var setLabelPrintFormVal = function ( data ) {


	for ( var item in data ) {

			$("#" + item).val(data[item]);


	}

}


var printLabelPrintForm = function () {
	
	
	var form  = $("#labelPrintDivForm").serializeArray();
	//后面确认时应 检测模具编号是否已存在
	var formData = formatFormJson(form);
	
	var printName = "仓储部备料标签";
	var printFile = "ccbblbq";
	
	var report =  "\"Reports\":{\"printName\":\""+printName+"\",\"printFile\": \""+printFile+"\",\"ConnectionString\":\"\",\"QuerySQL\":\"\",\"DetailGrid\":{\"Recordset\": {\"ConnectionString\": \"xml\",\"QuerySQL\": \"\"},\"PrintPreview\":true}}"
	var message = "{\"detail\":["+formData+"],"+report+"}";
	
	console.info(message);
	
//	com.leanway.webscoket.client.send(message);
	
	com.leanway.sendReportData(printName, printFile,"["+formData+"]");
	
}

//格式化form数据
var formatFormJson = function(formData) {
	var reg = /,$/gi;
	var data = "{";
	for (var i = 0; i < formData.length; i++) {
		data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
	}
	data = data.replace(reg, "");
	data += "}";
	return data;
}

// 更新备料
function updateStock(){
	// 初始化参数:type 1:当前页面的数据，2：跨页数据
	var type = "1"; 
	// 选择一条备料单
	var ids = com.leanway.getCheckBoxData(type, "detail", "checkList");// 选中行ID
	var obj = $("#detail").DataTable().rows('.row_selected').data()[0];// 选中行数据
	if(ids == null || ids.trim() == null || ids.trim() == ""){
		lwalert("tipModal", 1, "至少选择一条备料单进行操作");
		return;
		
	}else if(ids.split(",").length != 1){
		lwalert("tipModal", 1, "只能选择一条备料明细进行操作");
		return;
	}
	
	jQuery.each(obj, function(i, val) {
		console.log("Key=" + i + ",     Value=" + val);
	})
	// 参数后面都加上2，是因为页面有些参数重复了，然后为了名称统一设置所以都加了2。到请求的时候回统一去掉
	// 把数据显示在弹框上
	$("#batch2").val(obj.batch);// 批次号
	$("#canstockcount2").val(obj.canstockcount);// 剩余应备数量
	$("#caseno2").val(obj.caseno);
//	$("#compid2").val();
	$("#confirmstatus2").val(obj.confirmstatus);
//	$("#createuser2").val();
	$("#line2").val(obj.line);
	$("#mapid2").val(obj.mapid);
	$("#mapproductordetailid2").val(obj.mapproductordetailid);
	$("#materialreceivingid2").val(obj.materialreceivingid);
	$("#name2").val(obj.name);
	$("#orderid2").val(obj.orderid);
	$("#plandetailid2").val(obj.plandetailid);
	$("#pproductordesc2").val(obj.pproductordesc);
	$("#productionmoduleid2").val(obj.productionmoduleid);
	$("#productionnumber2").val(obj.productionnumber);
	$("#productordesc2").val(obj.productordesc);
	$("#productorid2").val(obj.productorid);
	$("#productorname2").val(obj.productorname);
	$("#productorstatus2").val(obj.productorstatus);
	$("#receivingtime2").val(obj.receivingtime2);
	$("#remaincount2").val(obj.remaincount);
	$("#sort2").val(obj.sort);
	$("#status2").val(obj.status);
	$("#stockcount2").val(obj.stockcount);
	$("#stocknumber2").val(obj.stocknumber);
	$("#stocktime2").val(obj.stocktime);
	$("#totalcaseno2").val(obj.totalcaseno);
	$("#trackcount2").val(obj.trackcount);
	$("#trackdetailid2").val(obj.trackdetailid);
	$("#tracknumber2").val(obj.tracknumber);
	// 通过Mapid设置仓库为选中
	// ps：pc端页面相对于移动端页面，少显示了仓库信息。原因：1，数据可以在列表查看到；2：该数据不能修改的；3：因为不是必要的，不显示的话可以减少1次查询。
	// 显示弹框
	com.leanway.show("updateStockModel");
}

// 保存备料单明细
function saveStock(){
	// 验证参数
	if($("#stockcount2").val() == null || $("#stockcount2").val() == "" || $("#stockcount2").val() == "0"){
		lwalert("tipModal", 1, "本次备料数量不能为0");
		return;
	}
	
	// 封装参数
	// 获取表单信息
	var formArray = $("#form_stock").serializeArray();
	// 数组转json字符串
	var formString = formatFormJson(formArray);
	// json字符串转json
	var formJson = JSON.parse(formString);
	// 遍历json
	$.each(formJson,function(key,value) {
	    // 如果key包含2
	    if(key.indexOf(key) >= 0){
	        // 删除掉当前的键值对
	        delete formJson[key];
	        // 添加新的键值对
	        formJson[key.replace("2","")] = value;
	    }
	});
		
	// 发起请求
	$.ajax({
		type: "post",
		url: "../../../"+ln_project+"/stockOrder?method=updateStockOrderDetail",
		data: {
			"formData" : JSON.stringify(formJson)
		},
		dataType: "json",
		success: function(data){
			// 刷新表格 
			$('#detail').DataTable().ajax.reload();
			// 如果成功,隐藏弹框
			if(data.status == "success"){
				$("#updateStockModel").modal("hide");
			}
			lwalert("tipModal", 1, data.info);
		}

	});	
	// 返回
}

// 如果是备料中，则备料单可以修改。否则，禁用按钮
$("[name='confirmstatus']").change(function(){
	if($(this).val() == "0"){
		$("#btn_updateStock").css("display","inline-block");
	}else{
		$("#btn_updateStock").css("display","none");
	}
})

/**
 * 确认领料
 * 逻辑：
 * 1，验证参数
 * 2，封装数据
 * 3，发起请求
 */
function confirmPicking(){
	//=============================== 1，验证参数  =======================================//
	// 初始化参数:type 1:当前页面的数据，2：跨页数据
	var type = "1"; 
	// 获取选中数据:主体ID，主体详细数据；明细ID，明细详细；
	var id_body = com.leanway.getCheckBoxData(type, "generalInfo", "checkBomList");
	var id_detail = com.leanway.getCheckBoxData(type, "detail", "checkList");
	// 详细信息
	var obj_body = $("#generalInfo").DataTable().rows('.row_selected').data()[0];
	// 获取到选中的明细(多条)
	var obj_detail_list = $("#detail").DataTable().rows('.row_selected').data();
	
	// 验证参数
	var flag = false;
	var errorMsg = "";
	if(id_body == "" || id_body == null || typeof(id_body) == "undefind"){
		lwalert("tipModal", 1, "请选择一条备料单据");
		return;
	}
	if(id_body.split(",").length != 1){
		lwalert("tipModal", 1, "只能选择一条备料单据");
		return;
	}
	if(id_detail == "" || id_detail == null || typeof(id_detail) == "undefind"){
		lwalert("tipModal", 1, "请选择一条备料单明细");
		return;
	}
	// 验证状态：只能是已备料的数据；备料计划状态（0：初始；2：已备料；3：已关闭） 判断条件，参照后台代码验证逻辑
	if(obj_body.confirmstatus == null || obj_body.confirmstatus == "5"){
		lwalert("tipModal", 1, "请选择【已备料】的单据");
		return;
	}
	
	// 打印参数
	console.log("obj_body的类型："+typeof(obj_body));
	var temp = "";
	$(JSON.parse(JSON.stringify(obj_body))).each(function(key,val){
		console.log("key="+key+"  value="+val);
	})
	//=============================== 2，封装数据  =======================================//
	// 封装主体
	var obj = new Object();
	obj.barcode = obj_body.barcode;
	obj.compid = obj_body.compid;
	obj.createuser = obj_body.createuser;
	obj.planid = obj_body.planid;
	obj.plantracknumber = obj_body.plantracknumber;
	obj.productionnumber = obj_body.productionnumber;
	obj.productionorderid = obj_body.productionorderid;
	obj.receivingtime = obj_body.receivingtime;
	obj.sort = obj_body.sort;
	obj.status = obj_body.status;
	obj.trackid = obj_body.trackid;
	obj.tracknumber = obj_body.tracknumber;
	// 封装明细
	obj.trackDetailList = new Array();
	$(obj_detail_list).each(function(index, e){
		// 明细信息判断
		// 验证状态：只能是已备料的数据；备料计划状态（0：初始；2：已备料；3：已关闭） 判断条件，参照后台代码验证逻辑
		if(e.confirmstatus == null || e.confirmstatus == "5"){
			flag = true;
			errorMsg = "备料单号为:"+e.batch+"已领料，请不要重复领取";
		}
		
		var detail = new Object();
		detail.adjustendtime = e.adjustendtime;
		detail.adjuststarttime = e.adjuststarttime;
		detail.batch = e.batch;
		detail.canstockcount = e.canstockcount;
		detail.caseno = e.caseno;
		detail.confirmstatus = e.confirmstatus;
		detail.line = e.line;
		detail.mapid = e.mapid;
		detail.mapproductordetailid = e.mapproductordetailid;
		detail.material = e.material;
		detail.materialreceivingid = e.materialreceivingid;
		detail.name = e.name;
		detail.orderid = e.orderid;
		detail.plandetailid = e.plandetailid;
		detail.pproductordesc = e.pproductordesc;
		detail.productionmoduleid = e.productionmoduleid;
		detail.productionnumber = e.productionnumber;
		detail.productionorderid = e.productionorderid;
		detail.productordesc = e.productordesc;
		detail.productorid = e.productorid;
		detail.productorname = e.productorname;
		detail.productorstatus = e.productorstatus;
		detail.receivingtime = e.receivingtime;
		detail.remaincount = e.remaincount;
		detail.sort = e.sort;
		detail.status = e.status;
		detail.stockcount = e.stockcount;
		detail.stocknumber = e.stocknumber;
		detail.stocktime = e.stocktime;
		detail.totalcaseno = e.totalcaseno;
		detail.trackcount = e.trackcount;
		detail.trackdetailid = e.trackdetailid;
		detail.tracknumber = e.tracknumber;
		detail.version = e.version;
		detail.versionid = e.versionid;
		obj.trackDetailList.push(detail);
	})
	
	// 验证
	if(flag){
		lwalert("tipModal", 1, errorMsg);
		return;
	}
	
	//=============================== 3，发起请求  =======================================//
	$.ajax({
		type: "POST",
		url: "../../../"+ln_project+"/stockOrder?method=addPickingOrder",
		data: {
			"stockOrder" : JSON.stringify(obj)
		},
		dataType: "json",
		success: function(data){
			if(data.status == "success"){
				lwalert("tipModal", 1, "领料成功");
			}else{
				lwalert("tipModal", 1, data.info);
			}
		},
		error: function(){
			lwalert("tipModal", 1, data.info);
			return;
		}
	});
	$('#generalInfo,#detail').DataTable().ajax.reload();
}