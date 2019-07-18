var onRefundTable;
var ope;
var id="";
//全局参数  clicktime
var clicktime=new Date();
$(function() {
	com.leanway.loadTags();
	onRefundTable = initRefundTable();
	initSelect2("#mapproductorOrderid", "../../../../"+ln_project+"/refund?method=queryOrderIdBySelect2", "搜索生产订单号");
	$("#bt1").hide();
	$("#bt2").hide();
	$("input[name=confirmstatus]").click(function(){
		searchRefundTable();
    });
	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchRefundTable);
	$("#searchValue").val("");
	resetDisable();

});

//初始化select2,
/**
 * id: 为要操作的对象 url: url text: 要在select中显示的文本
 */
initSelect2 = function (id, url, text) {
	$(id).select2({
		placeholder : text,
		language : "zh-CN",
		ajax : {
			url : url,
			dataType : 'json',
			delay : 250,
			data : function(params) {
				return {
					q : params.term, // search term
					page : params.page,
					pageSize : 10
				};
			},
			processResults : function(data, params) {
				params.page = params.page || 1;
				return {
					results : data.items,
					pagination : {
						more : (params.page * 30) < data.total_count
					}
				};
			},
			cache : false
		},
		escapeMarkup : function(markup) {
			return markup;
		},
		minimumInputLength : 1,
	});
}

$("#mapproductorOrderid").on("select2:select", function(e) {
	initTable(id);
});

//初始化数据表格
var initTable = function( id ) {
	if(id == ""){
	var mapproductorOrderid = $("#mapproductorOrderid").val();
	}else{
		mapproductorOrderid = id;
	}
	var refundid = $("#refundid").val();
	 $.ajax({
	        type : "post",
	        url : "../../../"+ln_project+"/refund?method=queryStorageDetail&refundid="+refundid,
	        data : {
	            "mapproductorOrderid" : mapproductorOrderid,
	        },
	        dataType : "text",
	        async : false,
	        success : function(data) {

	            var flag =  com.leanway.checkLogind(data);

	            if(flag){
	                var tempData = $.parseJSON(data);
	                if(data.status="success"){
	                    var listmapprodetail = tempData.data;
	                    setTableValue(listmapprodetail);
	                  for (var i in listmapprodetail) {
	                	  initSelect2("#directionname" + i, "../../../../"+ln_project+"/companyMap?method=queryStoreBySelect2", "请输入仓库名称");
	                	  initSelect2("#workcentername"+ i, "../../../../"+ln_project+"/refund?method=queryWorkcenterBySelect2", "请输入工作中心名称");
	      /*          	  if(listmapprodetail[i].centername == null || listmapprodetail[i].centername == ""){
	                		  $("#refundcount" + i).val(listmapprodetail[i].calloutcount);
	                	//	  $("#mapproductorOrderid" + i).select2().select2("val",calloutcount.centername);
	                	  }else{
	                		  $("#backcount" + i).val(listmapprodetail[i].calloutcount);
	                		  $("#select2-workcentername" + i + "-container").text(calloutcount.centername);
	                	  }*/
	                    }
	                }
	                id = "";
	            }
	        }
	    });
}
//写入表单
var  showInitTable = function( data ){
	    var tableBodyHtml = "";
	    for(var i in data){
	        tableBodyHtml += " <tr>";
	        tableBodyHtml += "  <td>"+ data[i].productorname+"</td>";
	        tableBodyHtml += "  <td> "+data[i].calloutcount+"</td>";
	        tableBodyHtml += "  <td>"+data[i].count+"</td>";
	        tableBodyHtml += "  <td>"+data[i].batch+"</td>";
	        if(data[i].direction == null || data[i].direction ==""){
	        	tableBodyHtml += "  <td>"+data[i].refundcount+"</td>";
		        tableBodyHtml += "  <td>"+data[i].direction+"</td>";
		        tableBodyHtml += "  <td>"+data[i].calloutcount+"</td>";
		        tableBodyHtml += "  <td>"+data[i].centername+"</td>";
	        }else{
	        	tableBodyHtml += "  <td>"+data[i].calloutcount+"</td>";
	  	        tableBodyHtml += "  <td>"+data[i].direction+"</td>";
	  	        tableBodyHtml += "  <td>"+data[i].backcount+"</td>";
	  	        tableBodyHtml += "  <td>"+data[i].centername+"</td>";
	        }
	        tableBodyHtml += " <tr>";

	    }
	    $("#tableBody").html(tableBodyHtml);
}

//写入表单
var setTableValue = function(data) {
    var tableBodyHtml = "";
    for(var i in data){
        tableBodyHtml += " <tr>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' id='productorname' name='productorname' value ='"+data[i].productorname+"' readonly='readonly'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' id='calloutcount' name='calloutcount' value ='"+data[i].calloutcount+"' readonly='readonly'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' id='count' name='count' value ='"+data[i].count+"' readonly='readonly'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' id='batch' name='batch' value ='"+data[i].batch+"' readonly='readonly'/></td>";
        tableBodyHtml += "  <td> <input id='refundcount"+i+"' class='form-control' type='text' name='refundcount' onkeyup='isNumber()' onafterpaste='isNumber()' onfocus='selectRefund("+ i +")' /></td>";
        tableBodyHtml += "  <td style='width:160px'> <select id='directionname"+i+"' class='form-control select2' style='width: 100%;' name='directionname' ></select></td>";
        tableBodyHtml += "  <td> <input id='backcount"+i+"' class='form-control' type='text' name='backcount' onkeyup='isNumber()' onafterpaste='isNumber()' onfocus='selectBack("+ i +")' /></td>";
        tableBodyHtml += " <td style='width:160px'> <select id='workcentername"+i+"' class='form-control select2' style='width: 100%;' name='workcentername' ></select></td>";
        tableBodyHtml += "  <td style='display:none'> <input class='form-control' type='hidden' id='mapproductordetailid' name='mapproductordetailid' value ='"+data[i].mapproductordetailid+"' /></td>";
        tableBodyHtml += "  <td style='display:none'> <input class='form-control' type='hidden' id='productorid' name='productorid' value ='"+data[i].productorid+"'/></td>";
        tableBodyHtml += "  <td style='display:none'> <input class='form-control' type='hidden' id='orderid' name='orderid' value ='"+data[i].orderid+"'/></td>";
        tableBodyHtml += "  <td style='display:none'> <input class='form-control' type='hidden' id='refunddetailid' name='refunddetailid' value ='"+data[i].refunddetailid+"'/></td>";
        tableBodyHtml += " <tr>";
    }
    $("#tableBody").html(tableBodyHtml);
}
//初始化数据表格
var initRefundTable = function() {

	var table = $('#refundDataTable')
	.DataTable(
			{
				"ajax" : "../../../"+ln_project+"/refund?method=queryRefundDetail",
				/* "iDisplayLength" : "10", */
				'bPaginate' : true,
				"bDestory" : true,
				"bRetrieve" : true,
				"bFilter" : false,
				"scrollX" : true,
				"bSort" : false,
				"bProcessing" : true,
				"bServerSide" : true,
				fixedHeader : {
					header : true,
					footer : true
				},
				"columns" : [
				{"data" : "refundid"},
				{"data" : "refundno"},
				{"data" : "createdate"},
				{"data" : "username"}
				],
				"columnDefs" : [ {
					orderable : false,
					targets : [ 0 ]
				} ],
				"aoColumns" : [
						{
							"mDataProp" : "refundid",
							"fnCreatedCell" : function(nTd, sData,
									oData, iRow, iCol) {
								$(nTd)
										.html(
												"<div id='stopPropagation"
														+ iRow
														+ "'>"
														+ "<input class='regular-checkbox' type='checkbox' id='"
														+ sData
														+ "' name='checkList' value='"
														+ sData
														+ "'><label  for='"
														+ sData
														+ "'></label>");
								com.leanway.columnTdBindSelect(nTd);
							}
						},
						{
							"mDataProp" : "refundno"
						},
						{
							"mDataProp" : "createdate"
						},
						{
							"mDataProp" : "username"
						}
						],
				"fnCreatedRow" : function(nRow, aData, iDataIndex) {

				},
				"oLanguage" : {
					"sUrl" : "../../../jslib/datatables/zh-CN.txt"
				},
				"buttons" : [ 'colvis' ],
				"sDom" : "Bfrtip",
				"fnDrawCallback" : function(data) {
 					com.leanway.getDataTableFirstRowId(
							"refundDataTable", loadRefund,"more","checkList");

					com.leanway.dataTableClickMoreSelect("refundDataTable",
	            			   "checkList", false, initRefundTable, resetDisable, loadRefund,undefined,"checkAll");

					com.leanway.dataTableCheckAllCheck('refundDataTable', 'checkAll', 'checkList');
				}

			}).on('xhr.dt', function(e, settings, json) {
		com.leanway.checkLogind(json);
	});
return table;
}
//选择加载内容
var searchRefundTable = function (){
    var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
    var searchValue = $("#searchValue").val();
    onRefundTable.ajax.url("../../../../"+ln_project+"/refund?method=queryRefundDetail&confirmstatus="+confirmstatus+"&searchValue="+searchValue).load();
}

//加载产品及退货数量信息
function loadRefund( refundid ){
 	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/refund",
		data : {
			"method" : "queryRefundInfo",
			"refundid" : refundid
		},
		dataType : "json",
		async : false,
		success : function ( data ) {
			var flag =  com.leanway.checkLogind(data);
			if(flag){
			  $("#refundno").val(data.refundconds.refundno);
    		  $("#barcode").val(data.refundconds.barcode);
    		  //设置用于点击查询详情的orderid
    		  id = data.refundconds.orderid;
    		  $("#select2-mapproductorOrderid-container").text(data.refundconds.productionnumber);
    		  $("#refundreason").val(data.refundconds.refundreason);
    		  var refundconds = data.refunddetaillist;
    		  showInitTable(refundconds);
			}
		}
	});
}

function addRefund(){
	resetSelect();
	ope = "addRefundDetailForProduct";
	//将select2设置成查询生产订单号的orderid作为查询条件
	$("#refundid").val("");
	id ="";
}
//修改
var showRefund = function ( ){
	var data = onRefundTable.rows('.row_selected').data();
	if (data.length == 0) {
		lwalert("tipModal", 1, "请从产品列表里面选择需要退货的产品！");
		return;
	} else if (data.length > 1) {
		lwalert("tipModal", 1, "只能选择一个产品进行退货！");
		return;
	}
	//给refundid赋值
	$("#refundid").val(data[0].refundid);
	//确认修改
	updateRefund( data[0].refundid );
}
//确认修改
var updateRefund = function(refundid){
	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/refund",
		data : {
			"method" : "queryRefundInfo",
			"refundid" : refundid
		},
		dataType : "json",
		async : false,
		success : function ( data ) {
			var flag =  com.leanway.checkLogind(data);
			if(flag){
				if(data.refundconds.confirmstatus == 0){
					ope = "updateRefundDetailForProduct";
					//设置不可以用
					resetDisable();
					//加载表格
					initTable(id);
					//设置保存按钮可用
					$("#saveOrUpdateButtonId").prop("disabled",false);
					//设置退货原因可用
					$("#refundreason").prop("disabled",false);
				}else{
					lwalert("tipModal", 1, "本单已退货不能再进行修改！");
					return;
				}
			}
		}
	});
}
//新增或修改
function saveOrUpdate(){
	var arrayForm  = $("#refundForm").serializeArray();
	var formData = formatFormJson(arrayForm);
	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/refund",
		data : {
			"method" : ope,
			"formData" : formData
		},
		dataType : "json",
		async : false,
		success : function ( text ) {
			var flag =  com.leanway.checkLogind(text);
			if(flag){
			    //alert(text.info);
				lwalert("tipModal", 1, text.info);
				if (text.status == "success") {
					if(ope=="addrefundDetailForProduct"){
						onRefundTable.ajax.reload();
					}else{
						onRefundTable.ajax.reload(null,false);
					}
					onRefundTable.ajax.reload();
					resetDisable();
				}
			}
		}
	});
}

//取消退货
var cancel= function ( ) {
	var ids = com.leanway.getCheckBoxData(1, "refundDataTable", "checkList");
	if (ids.length == 0) {
		lwalert("tipModal", 1, "请选择要取消的退货单!");
		return;
	} else {
		var msg = "确定取消选中的" + ids.split(",").length + "条退货单?";
		lwalert("tipModal", 2, msg ,"isSureDelete(" + 1 + ")");
	}
}

function isSureDelete( type) {

	var ids = com.leanway.getCheckBoxData(type, "refundDataTable", "checkList");

	ajaxDeleteRefundDetail(ids);
}

//ajax删除
var ajaxDeleteRefundDetail = function (ids) {
	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/refund",
		data : {
			"method" : "deleteRefundForDetail",
			"paramData" : '{"refundid":"'+ ids +'"}'
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				//alert(text.info);
				lwalert("tipModal", 1, text.info);
				if (text.status == "success") {
					onRefundTable.ajax.reload();
				}
			}
		}
	});
}
//确认退货
var confirmRefund = function( ) {
	var data = onRefundTable.rows('.row_selected').data();
	if (data.length == 0) {
		lwalert("tipModal", 1, "请从退货列表里面选择需要退货的产品！");
		return;
	} else if (data.length > 1) {
		lwalert("tipModal", 1, "只能选择一个产品进行退货！");
		return;
	} else {
		var msg = "确定取消选中的" + data.length + "条退货单?";
		lwalert("tipModal", 2, msg ,"ajaxConfirmRefund( )");
	}
}
//确认退货
var ajaxConfirmRefund = function(  ){
	var data = onRefundTable.rows('.row_selected').data();
	refundid = data[0].refundid
	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/refund",
		data : {

			"method" : "updateRefundForProduct",
			"paramData" : '{"refundid":"'+ refundid +'"}'
		},
		dataType : "json",
		async : false,
		success : function ( text ) {
			var flag =  com.leanway.checkLogind(text);

			if(flag){
				//alert(text.info);
				lwalert("tipModal", 1, text.info);
				if (text.status == "success") {
					onRefundTable.ajax.reload();
				}
			}
		}
	});
}


//格式化form数据
var formatFormJson = function(formData) {
    var reg = /,$/gi;
    var data = "{";
    for (var i = 0; i < formData.length; i++) {
        data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
    }
    data += "\"refunddetailconditions\" : " + getTableDataToJson("storageTable");
    data += "}";
    return data;
}

//获取table里面的值，并转换成jason
function getTableDataToJson(tableId){
    var reg = /,$/gi;
    // 解析Table数据，值为空的跳过
    var tableJson = "[";
    $("#" + tableId + " tbody tr").each(function(index) {
     // 获取文本框的值
        var inpu = $(this).find("td:eq(8)").find("input");
        var inputVal = inpu.val();
        if (inputVal != null && $.trim(inputVal) != ""&& $.trim(inputVal) != undefined) {
            tableJson += "{\"productorname\":\""
                        + $(this).find("td:eq(0)").find("input").val()
                         + "\",\"calloutcount\":\""
                        + $(this).find("td:eq(1)").find("input").val()
                         + "\",\"count\":\""
                        + $(this).find("td:eq(2)").find("input").val()
                         + "\",\"batch\":\""
                        + $(this).find("td:eq(3)").find("input").val()
                         + "\",\"refundcount\":\""
                        + $(this).find("td:eq(4)").find("input").val()
                         + "\",\"directionname\":\""
                        + $(this).find("td:eq(5)").find("select").val()
                         + "\",\"backcount\":\""
                        + $(this).find("td:eq(6)").find("input").val()
                         + "\",\"workcentername\":\""
                        + $(this).find("td:eq(7)").find("select").val()
                         + "\",\"mapproductordetailid\":\""
                        + $(this).find("td:eq(8)").find("input").val()
                         + "\",\"productorid\":\""
                        + $(this).find("td:eq(9)").find("input").val()
                         + "\",\"orderid\":\""
                        + $(this).find("td:eq(10)").find("input").val()
                            + "\",\"refunddetailid\":\""
                        + $(this).find("td:eq(11)").find("input").val()
                        + "\"},";
            }
    })
    tableJson = tableJson.replace(reg, "");
    tableJson += "]";
    return tableJson;
}
//设置返回数量及返回工作中心disabled
function selectRefund( i ){
	$("#backcount" + i).prop("disabled",true);
	$("#workcentername" + i).prop("disabled",true);
}
//设置退货数量及转移地点disabled
function selectBack( i ){
	$("#refundcount" + i).prop("disabled",true);
	$("#directionname" + i).prop("disabled",true);
}
//取消disabled属性，并重置
function resetSelect(){
	$("#saveOrUpdateButtonId").prop("disabled",false);
	$("#refundno").prop("disabled",false);
	$("#mapproductorOrderid").prop("disabled",false);
	$("#barcode").prop("disabled",false);
	$("#refundreason").prop("disabled",false);
	$("#select2-mapproductorOrderid-container").html("搜索生产订单号");
	$("#refundreason").val("");
	$("#refundno").val("");
	$("#barcode").val("");
	$("#tableBody").html("");
}
//设置disabled属性，并清空
function resetDisable(){
	$("#saveOrUpdateButtonId").prop("disabled",true);
	$("#refundno").prop("disabled",true);
	$("#mapproductorOrderid").prop("disabled",true);
	$("#barcode").prop("disabled",true);
	$("#refundreason").prop("disabled",true);
	$("#tableBody").html("");
}
//确保数据一定为数字
function isNumber() {
    var refundcount = document.getElementsByName("refundcount");
    for (var i = 0; i < refundcount.length; i++) {
    	refundcount[i].value = refundcount[i].value.replace(/[^\d.]/g, '');
    }
}

