var clicktime = new Date();

function initBootstrapValidator() {
	$('#bomTrackForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					endline : {
						validators : {
							greaterThan: {
		                        value: 'startline',
		                        message: '不能小于起始值'
		                    }
						}
					},
					trackcount : {
						validators : {
							notEmpty : {},
							lessThan: {
		                        value: 'remaincount',
		                        message: '追踪数不能大于剩余数'
		                    },
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.resourcescount,
									com.leanway.reg.msg.resourcescount)
						}
					},
				}
			});
}

var oTable;
var detailTable;
var trackid;
var tData;

$(function() {

	// 初始化对象
	com.leanway.loadTags();
	com.leanway.formReadOnly("bomTrackForm");
    trackid = com.leanway.getFlagval();

	// 加载datagrid
	oTable = initTable(trackid);
	detailTable = initDetailTable(trackid);
	// 全选
//	com.leanway.dataTableCheckAll("generalInfo", "checkAll", "checkList");
	com.leanway.enterKeyDown("searchValue", searchBomTrack);
    initBootstrapValidator();

	$("#tracknumber1").show();
	$("#trackid1").hide();

	initDate("#pickingtime");
})

//初始化数据表格
var initTable = function (trackid) {

	var table = $('#generalInfo').DataTable( {
			"ajax": "../../../"+ln_project+"/bomTrack?method=queryBomTrackList",
	        'bPaginate': true,
	        "bDestory": true,
	        "bRetrieve": true,
	        "bFilter":false,
	        "bSort": false,
	        //"scrollX": true,
	        "scrollY":"250px",
	        "bProcessing": true,
	        "bServerSide": true,
	        'searchDelay':"5000",
	        "columns": [
                {
							"data" : "trackid"
						},{

							"data" : "tracknumber"
						}, {
							"data" : "productionchildsearchno",
						}, {
							"data" : "pickingtime"
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
	               {"mDataProp": "productionchildsearchno"},
	               {"mDataProp": "pickingtime"},
	          ],

	         "oLanguage" : {
	        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
	         },
	         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	         "fnDrawCallback" : function(data) {

	        	 if(trackid==null||trackid==""||trackid==undefined){

					com.leanway.getDataTableFirstRowId("generalInfo", ajaxLoadBomTrack,"more","checkList");

	        	 }else{

	        		 picking(trackid);

	        	 }

	        	 com.leanway.dataTableClickMoreSelect("generalInfo", "checkList", false,
                         oTable, ajaxLoadBomTrack,undefined,undefined,"checkAll");
	        	 com.leanway.dataTableCheckAllCheck('generalInfo', 'checkAll', 'checkList');


	         }
	    } ).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );

	return table;
}


//初始化数据表格
var initDetailTable = function (trackid) {

	var table = $('#detail').DataTable( {
			"ajax": "../../../"+ln_project+"/bomTrack?method=queryBomTrackDetailList",
	        'bPaginate': false,
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
						}, {
							"data" : "productordesc",
						}, {
							"data" : "countunit"
						}, {
							"data" : "remaincount"
						}, {
							"data" : "stockcount"
						}, {
							"data" : "trackcount"
						}, {
							"data" : "line"
						}, {
							"data" : "dispatchingnumber"
						}, {
							"data" : "barcode"
						}, {
							"data" : "maplevelsto"
						}
	         ],
	         "aoColumns": [
	               {
	            	   "mDataProp": "trackdetailid",
	                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
	                	   $(nTd).html("<div id='stopPropagation" + iRow +"'>"
								   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='checkList2' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label>");
						 com.leanway.columnTdBindSelectNew(nTd,"detail","checkList2");
	                   }
	               },
	               {"mDataProp": "productorname"},
	               {"mDataProp": "productordesc"},
	               {"mDataProp": "countunit"},
	               {"mDataProp": "remaincount"},
	               {"mDataProp": "stockcount"},
	               {"mDataProp": "trackcount"},
	               {"mDataProp": "line"},
	               {"mDataProp": "dispatchingnumber"},
	               {"mDataProp": "barcode"},
	               {"mDataProp": "maplevelsto"},
	          ],

	         "oLanguage" : {
	        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
	         },
	         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	         "fnDrawCallback" : function(data) {

	        	 if(tData!=undefined){
                     for(var i = 0;i<tData.data.length;i++){
                    	 //console.info(tData.data[i].trackdetailid)
                         com.leanway.setDataTableSelect("detail","checkList2",tData.data[i].trackdetailid);
                     }
                 }

	        	 com.leanway.dataTableClick("detail", "checkList2", false,
                         detailTable, undefined,undefined,undefined);


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

	detailTable.ajax
	.url(
			"../../../"+ln_project+"/bomTrack?method=queryBomTrackDetailList&trackid="
					+trackid ).load();

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/bomTrack?method=queryBomTrackedObject",
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
				//setTableValue2(tempData.bomTrackDetailList);

			}
		}
	});
	com.leanway.formReadOnly("bomTrackForm");
	$("#trackid1").hide();
	$("#tracknumber1").show();
}

function deleteBomTrack(){

	colmap = tabmap.get("employeeDataTable");

	if (colmap!=undefined) {

		lwalert("tipModal", 2, "你确定要删除吗","isSure()");

	} else {

		lwalert("tipModal", 1, "至少选择一条记录进行删除操作");
	}
}

var map = new Map();
function isSure() {
	var str = '';

	colmap = tabmap.get("employeeDataTable");
	var array = colmap.keys();

		 for ( var i in array) {
		     if(!map.containsValue(array[i])){
		         str += array[i];
		         str += ",";
		     }
		 }
	 var ids = str.substr(0, str.length - 1);
	 deleteAjax(ids);
}

//删除物料追踪单
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/bomTrack?method=deleteBomTrack",
		data : {
			"conditions" : '{"ids":"' + ids + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(text);
				if (tempData.code == "1") {
					resetForm();
					oTable.ajax.reload();
				} else {
	//				alert("操作失败");
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
		if(item!="trackid"){
		$("#" + item).val(data[item]);
	    }
	}


	$("#trackid2").val(data.trackid);
//	var trackid = data.trackid;
//	if (trackid != null && trackid != "" && trackid != "null") {
//		$("#trackid").append(
//				'<option value=' + trackid + '>' + data.tracknumber
//						+ '</option>');
//		$("#trackid").select2("val", [ trackid ]);
//	}

}

function setFormValue2(data) {

	resetForm();

//	for ( var item in data) {
//		$("#" + item).val(data[item]);
//	}
	var trackid = data.trackid;
	if (trackid != null && trackid != "" && trackid != "null") {
		$("#trackid").append(
				'<option value=' + trackid + '>' + data.tracknumber
						+ '</option>');
		$("#trackid").select2("val", [ trackid ]);
	}

}
/**
 * 新增
 *
 */
var addBomTrack = function() {

	// 清空表单
	resetForm();
	com.leanway.removeReadOnly("bomTrackForm");
	com.leanway.dataTableUnselectAll("generalInfo", "checkList");
	com.leanway.dataTableUnselectAll("generalInfo", "checkAll");
	//$("#tracknumber").attr("readonly","readonly");
	$("#tracknumber1").hide();
	$("#trackid1").show();
	com.leanway.initSelect2("#trackid",
    		"../../../"+ln_project+"/bomTrack?method=queryStockBomTrackList", "搜索备料单号");

	detailTable.ajax
	.url("../../../"+ln_project+"/bomTrack?method=queryBomTrackDetailList").load();
	$("#trackid").val(null).trigger("change");

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

	//$("#trackid").val(null).trigger("change");
}
/**
 * 往里面存数据
 */
var saveBomTrack = function() {

	var ids = com.leanway.getCheckBoxData(1, "detail", "checkList2");
	if(ids == null || ids == undefined || ids == ""){
		lwalert("tipModal", 1,"请至少选择一个物料进行领料！");
	}
	$('#trackDetailVal').val("[]");
	var form = $("#bomTrackForm").serializeArray();
	// 后面确认时应 检测模具编号是否已存在
	var formData = formatFormJson(form);

	$("#bomTrackForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#bomTrackForm').data('bootstrapValidator').isValid()&&flag) { // 返回true、false
		//if(trackDetailVal!="[]"){
		$.ajax({
			type : "POST",
			url : "../../../"+ln_project+"/bomTrack",
			data : {
				"method" : "addBomTrack",
				"formData" : formData,
				 "ids":  ids ,
			},
			dataType : "text",
			async : false,
			success : function(data) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					var tempData = $.parseJSON(data);

					if (tempData.code == "1") {

						com.leanway.formReadOnly("bomTrackForm");

						lwalert("tipModal", 2,tempData.info,"refresh()");

					} else {
						//alert("操作失败");
						lwalert("tipModal", 1, tempData.info);
					}
				}
			}
		});
//		}else{
//			lwalert("tipModal", 1, "没有物料，不能保存");
//		}
	}else if(!flag){
//			alert("追踪数不能大于剩余数并且不等于0");
		lwalert("tipModal", 1, "追踪数不能大于剩余数并且不等于0");
	}
}


function refresh(){
	parent.window.addTabs({'id':'bomtrack','title':'备料单领料','url':'bomtrack/bomtrack.html','close':'true','pageId' : '08d55344-1a55-49d2-bbc8-7c0dda8b8685'})
}
//格式化form数据
var formatFormJson = function(formData) {
	var reg = /,$/gi;
	var data = "{";
	for (var i = 0; i < formData.length; i++) {
		if(formData[i].name == "trackDetailVal"){
			data += "\"" + formData[i].name + "\" : " + formData[i].value + ",";
		}else{
			data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
		}
	}
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
// 数据table
var oTable;

// 需要初始化数据
$(function() {

    initDate("#receivingtime");
    com.leanway.initSelect2("#trackid",
    		"../../../"+ln_project+"/bomTrack?method=queryStockBomTrackList", "搜索备料单号");
});


//根据备料单号查询备料单信息进行领料
function queryStockBomTrackDeatilList(){

	var trackid = $("#trackid").val();

	detailTable.ajax
	.url(
			"../../../"+ln_project+"/bomTrack?method=queryBomTrackDetailList&trackid="
					+trackid+"&type=Y" ).load();

	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/bomTrack",
		data : {
			"method" : "queryStockBomTrackDeatilList",
			"trackid" : trackid,
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				tData = $.parseJSON(data);

				//setFormValue(tempData.bomTrack.resultObj);
				if(tData.bomTrack.resultObj!=null){
					$("#trackid2").val(tData.bomTrack.resultObj.trackid);
					$("#tracknumber").val(tData.bomTrack.resultObj.tracknumber);
				}

				//setTableValue(tempData.bomTrackDetailList);
			}
		}
	});
}

///**
// * 填充到台账表格(拼接table)
// */
//function setTableValue(data) {
//	var tableHeadHtml = ""
//	tableHeadHtml += " <tr>";
//	tableHeadHtml += "  <th style='width: 25px'>" + "序号" + "</th>";
//	tableHeadHtml += "  <th style='width: 25px'>" + "跟踪类型" + "</th>";
//	tableHeadHtml += "  <th style='width: 125px'>" + "组件" + "</th>";
//	tableHeadHtml += "  <th style='width: 25px'>" + "组件描述" + "</th>";
//	tableHeadHtml += "  <th style='width: 25px'>" + "库存单位" + "</th>";
//	tableHeadHtml += "  <th style='width: 25px'>" + "未领料量" + "</th>";
//	tableHeadHtml += "  <th style='width: 25px'>" + "备料量" + "</th>";
//	tableHeadHtml += "  <th style='width: 25px'>" + "追踪数量" + "</th>";
//	tableHeadHtml += "  <th style='width: 25px'>" + "工序行号" + "</th>";
//	tableHeadHtml += "  <th style='width: 125px'>" + "派工单号" + "</th>";
//	tableHeadHtml += "  <th style='width: 125px'>" + "条码" + "</th>";
//	tableHeadHtml += "  <th style='width: 125px'>" + "送料地址" + "</th>";
//	tableHeadHtml += " </tr>";
//	$("#tableHead").html(tableHeadHtml);
//	var tableBodyHtml = "";
//	var row = $("#grid-data").find("tr").length;
//	for ( var i in data) {
//		tableBodyHtml += " <tr>";
//		tableBodyHtml += "  <td>" + row+ "</td>";
//		tableBodyHtml += "  <td> <input class='form-control' id='trackingtype' type='text' value='"+"工单"+"' readonly='readonly'/></td>";
//		tableBodyHtml += "  <td> <input class='form-control' type='text' value='"+data[i].modulename+" ' id='modulename'  readonly='readonly' style='width:100px'/></td>";
//		tableBodyHtml += "  <td> <input class='form-control' type='text' value='"+data[i].productordesc+" ' id='productordesc' readonly='readonly' style='width:100px'/></td>";
//		tableBodyHtml += "  <td> <input class='form-control' type='text' value='"+data[i].countunit+" ' id='countunit'  readonly='readonly'/></td>";
//		tableBodyHtml += "  <td> <input class='form-control' type='text' value='"+data[i].remaincount+" ' name='remaincount' id='remaincount' readonly='readonly'/></td>";
//		tableBodyHtml += "  <td> <input class='form-control' type='text' value='"+data[i].stockcount+" ' name='stockcount' id='stockcount' readonly='readonly' style='width:60px'/></td>";
//		tableBodyHtml += "  <td> <input class='form-control' type='text' value='"+data[i].stockcount+" ' name='trackcount' id='trackcount' readonly='readonly'/></td>";
//		//tableBodyHtml += "  <td> <input class='form-control' type='text' name='trackcount' id='trackcount' style='border-color: #3c8dbc;' onchange='notGreaterThan()' onkeyup='isNumber()' onafterpaste='isNumber()'/></td>";
//		tableBodyHtml += "  <td> <input class='form-control' type='text' value='"+data[i].line+" ' id='line' readonly='readonly'/></td>";
//		tableBodyHtml += "  <td> <input class='form-control' type='text' value='"+data[i].dispatchingnumber+" ' id='dispatchingnumber' style='width: 100px' readonly='readonly'/></td>";
//		tableBodyHtml += "  <td> <input class='form-control' type='text' value='"+data[i].barcode+" ' id='barcode' style='width: 100px' readonly='readonly'/></td>";
//		tableBodyHtml += "  <td> <input class='form-control' type='text' value='"+data[i].maplevelsto+" ' id='maplevelsto' style='width: 100px' readonly='readonly'/></td>";
//		tableBodyHtml += "  <td> <input class='form-control' type='hidden' value='"+data[i].bomid+"' id='bomid' readonly='readonly'/></td>";
//		tableBodyHtml += "  <td> <input class='form-control' type='hidden' value='"+data[i].productorid+" ' id='productorid' readonly='readonly'/></td>";
//		tableBodyHtml += "  <td> <input class='form-control' type='hidden' value='"+data[i].trackdetailid+" ' id='trackdetailid' readonly='readonly'/></td>";
//		tableBodyHtml += "  <td> <input class='form-control' type='hidden' value='"+data[i].consumingnumber+" ' id='usedcount' readonly='readonly'/></td>";
//		tableBodyHtml += "  <td> <input class='form-control' type='hidden' value='"+data[i].orderid+" ' id='orderid' readonly='readonly'/></td>";
//		tableBodyHtml += "  <td> <input class='form-control' type='hidden' value='"+data[i].productionmoduleid+" ' id='productionmoduleid' readonly='readonly'/></td>";
//		tableBodyHtml += " </tr>";
//		row++;
//	}
//	$("#tableBody").html(tableBodyHtml);
//}
	function isNumber(){
		var trackcount = document.getElementsByName("trackcount");
		for(var i = 0;i<trackcount.length;i++){

			trackcount[i].value=trackcount[i].value.replace(/[^\d.]/g,'');

		}
		var usedcount = document.getElementsByName("usedcount");
		for(var i = 0;i<usedcount.length;i++){

			usedcount[i].value=usedcount[i].value.replace(/[^\d.]/g,'');

		}
		var remaincount = document.getElementsByName("remaincount");
		for(var i = 0;i<remaincount.length;i++){

			remaincount[i].value=remaincount[i].value.replace(/[^\d.]/g,'');

		}
}
var flag=true;
function notGreaterThan(){
	var remaincount = document.getElementsByName("remaincount");
	var trackcount = document.getElementsByName("trackcount");
	for(var i = 0;i<trackcount.length;i++){
		if(parseFloat(trackcount[i].value)>parseFloat(remaincount[i].value)||parseFloat(trackcount[i].value)==0){
//			alert("追踪数不能大于剩余数并且不等于0");
			lwalert("tipModal", 1, "追踪数不能大于剩余数并且不等于0");
			flag=false;
			return false;
		}else{
			flag=true;
		}
	}
}
///**
// * 填充到台账表格(拼接table)
// */
//function setTableValue2(data) {
//	var tableHeadHtml = ""
//	tableHeadHtml += " <tr>";
//	tableHeadHtml += "  <th>" + "序号" + "</th>";
//	tableHeadHtml += "  <th>" + "跟踪类型" + "</th>";
//	tableHeadHtml += "  <th>" + "组件" + "</th>";
//	tableHeadHtml += "  <th>" + "组件描述" + "</th>";
//	tableHeadHtml += "  <th>" + "库存单位" + "</th>";
//	tableHeadHtml += "  <th>" + "未领料量" + "</th>";
//	tableHeadHtml += "  <th>" + "备料量" + "</th>";
//	tableHeadHtml += "  <th>" + "追踪数量" + "</th>";
//	tableHeadHtml += "  <th>" + "工序行号" + "</th>";
//	tableHeadHtml += "  <th>" + "派工单号" + "</th>";
//	tableHeadHtml += "  <th>" + "条码" + "</th>";
//	tableHeadHtml += "  <th>" + "送料地址" + "</th>";
//	tableHeadHtml += " </tr>";
//	$("#tableHead").html(tableHeadHtml);
//	var tableBodyHtml = "";
//	var j=1;
//	for ( var i in data) {
//
//		tableBodyHtml += " <tr>";
//		tableBodyHtml += "  <td>" + j + "</td>";
//		tableBodyHtml += "  <td>"+"工单"+"</td>";
//		tableBodyHtml += "  <td>"+data[i].productorname+"</td>";
//		tableBodyHtml += "  <td>"+data[i].productordesc+"</td>";
//		tableBodyHtml += "  <td>"+data[i].countunit+"</td>";
//		tableBodyHtml += "  <td> "+data[i].remaincount+"</td>";
//		tableBodyHtml += "  <td> "+data[i].stockcount+"</td>";
//		tableBodyHtml += "  <td>"+data[i].trackcount+"</td>";
//		tableBodyHtml += "  <td>"+data[i].line+"</td>";
//		tableBodyHtml += "  <td>"+data[i].dispatchingnumber+"</td>";
//		tableBodyHtml += "  <td>"+data[i].barcode+"</td>";
//		tableBodyHtml += "  <td>"+data[i].maplevelsto+"</td>";
//		tableBodyHtml += " </tr>";
//		j=j+1;
//	}
//	$("#tableBody").html(tableBodyHtml);
//}

/**
 * 搜索物料追踪单
 */
var searchBomTrack = function() {
	//checkSession();
	var searchVal = $("#searchValue").val();

	oTable.ajax.url(
			"../../../"+ln_project+"/bomTrack?method=queryBomTrackList&searchValue="
					+ searchVal).load();
}


/**
 * 备料计划点击下一步查询方法
 * @param trackid
 */
function picking(trackid){

	if(trackid!=null&&trackid!=""){
		resetForm();
		com.leanway.removeReadOnly("bomTrackForm");
		com.leanway.dataTableUnselectAll("generalInfo", "checkList");
		com.leanway.dataTableUnselectAll("generalInfo", "checkAll");

		$("#tracknumber1").hide();
		$("#trackid1").show();
		com.leanway.initSelect2("#trackid",
	    		"../../../"+ln_project+"/bomTrack?method=queryStockBomTrackList", "搜索备料单号");
		queryBomTrack(trackid);
		queryStockBomTrackDeatil(trackid);

	}
}

function queryBomTrack(trackid){

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

				if(tempData.bomTrack.resultObj!=null){
					setFormValue2(tempData.bomTrack.resultObj);
				}

			}
		}
	});
}

function queryBomTrackObject(trackid){

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
				//setTableValue2(tempData.bomTrackDetailList);
			}
		}
	});
}

function queryStockBomTrackDeatil(trackid){


	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/bomTrack?method=queryBomTrackDetailList",
		data : {
			"trackid" : trackid,
			"type":"Y"
		},
		dataType : "text",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				 tData = $.parseJSON(data);

			}
		}
	});

	detailTable.ajax
	.url(
			"../../../"+ln_project+"/bomTrack?method=queryBomTrackDetailList&trackid="
					+trackid+"&type=Y" ).load();

}