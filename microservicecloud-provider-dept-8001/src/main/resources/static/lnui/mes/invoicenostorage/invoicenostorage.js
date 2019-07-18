var clicktime = new Date();
var oTable;
var ope="addInvoiceNoStorage";
$(function() {
	// checkSession();
	// 初始化对象
	com.leanway.loadTags();
	com.leanway.formReadOnly("invoiceForm");
	// 加载datagrid
	oTable = initTable();
	// 全选
	// com.leanway.dataTableCheckAll("generalInfo", "checkAll", "checkList");
	 com.leanway.enterKeyDown("searchValue", searchInvoice);
	 initBootstrapValidator();
})
function initBootstrapValidator() {
	$('#invoiceForm').bootstrapValidator({
		excluded : [ ':disabled' ],
		fields : {
			salesorderid : {
				validators : {
					notEmpty : {},
				}
			},
		}
	});
}

// 初始化数据表格
var initTable = function() {

	var table = $('#generalInfo')
			.DataTable(
					{
						"ajax" : "../../../"+ln_project+"/invoice?method=queryInvoiceList",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"scrollY":"250px",
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",
						"columns" : [ {
							"data" : "invoiceid"
						}, {
							"data" : "invoicenumber"
						}, {

							"data" : "invoicedate"
						}, {
							"data" : "username",
						} ],
						"aoColumns" : [
								{
									"mDataProp" : "invoiceid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd).html("<div id='stopPropagation" + iRow +"'>"
												   +"<input class='regular-checkbox' type='checkbox' id='" + sData
			                                       + "' name='checkList' value='" + sData
			                                       + "'><label for='" + sData
			                                       + "'></label>");
										 com.leanway.columnTdBindSelectNew(nTd,"generalInfo",
													"checkList");
									}
								},{
									"mDataProp" : "invoicenumber"
								}, {
									"mDataProp" : "invoicedate"
								}, {
									"mDataProp" : "username"
								}, ],

						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {
							com.leanway.getDataTableFirstRowId("generalInfo",
									ajaxLoadInvoice,"more","checkList");
							com.leanway.dataTableClickMoreSelect("generalInfo",
									"checkList", false, oTable, ajaxLoadInvoice,undefined,undefined,"checkAll");
							com.leanway.dataTableCheckAllCheck('generalInfo', 'checkAll', 'checkList');
						}
					}).on('xhr.dt', function (e, settings, json) {
						com.leanway.checkLogind(json);
					} );

	return table;
}
var invoiceDetail;
/**
 * 加载物料追踪单到右侧显示
 *
 * @param trackid
 */
function ajaxLoadInvoice(invoiceid) {
	if(invoiceid!=null&&"null"!=invoiceid){
		$.ajax({
			type : "post",
			url : "../../../"+ln_project+"/invoice?method=queryInvoiceObject",
			data : {
				"invoiceid" : invoiceid,
			},
			dataType : "text",
			async : false,
			success : function(data) {
				var flag =  com.leanway.checkLogind(data);

				if(flag){

					var tempData = $.parseJSON(data);
					setFormValue(tempData.invoice);
					setTableValue2(tempData.invoiceDetail);
					invoiceDetail = tempData.invoiceDetail;

				}
			}
		});
		com.leanway.formReadOnly("invoiceForm");
	}
	
}

function deleteInvoice(type) {

	 if (type == undefined || typeof(type) == "undefined") {
			type = 2;
		}

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");

	if (ids.length>0) {
        var msg = "确定删除选中的" + ids.split(",").length + "条出货单?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	} else {
//		alert("至少选择一条记录进行删除操作");
		lwalert("tipModal", 1, "至少选择一条记录进行删除操作！");
	}
}

function isSureDelete(type){

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
	deleteAjax(ids);
}
// 删除物料追踪单
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/invoice?method=deleteInvoice",
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
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");
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
		$("#" + item).val(data[item]);
	}

	var salesorderid = data.salesorderid;
	if (salesorderid != null && salesorderid != ""
			&& salesorderid != "null") {
		$("#salesorderid").append(
				'<option value=' + salesorderid + '>'
						+ data.code + '</option>');
		$("#salesorderid").select2("val", [ salesorderid ]);
	}

}
/**
 * 新增
 *
 */
var addInvoice = function() {
	ope="addInvoiceNoStorage";
	// checkSession();
	// 清空表单
	resetForm();
	com.leanway.removeReadOnly("invoiceForm");
	com.leanway.dataTableUnselectAll("generalInfo", "checkAll");
	com.leanway.dataTableUnselectAll("generalInfo", "checkList");
	$("#invoicenumber").attr("readonly","readonly");
	com.leanway.clearTableMapData( "generalInfo" );
}

function updateInvoice(){
	ope = "updateInvoiceNoStorage"
	$("#saveOrUpdate").prop("disabled",false);
	var data = oTable.rows('.row_selected').data();
	if(data.length == 0) {
		lwalert("tipModal", 1, "请选择销售出货单进行修改！");
		return;
	} else if(data.length > 1) {
		lwalert("tipModal", 1, "只能选择一条销售出货单进行修改！");
		return;
	}
	setTableToEdit(invoiceDetail);
	
}
/**
 * 重置表单
 *
 */
var resetForm = function() {
	$('#invoiceForm').each(function(index) {
		$('#invoiceForm')[index].reset();
	});

	$("#tableHead").html("");
	$("#tableBody").html("");

	$("#salesorderid").val(null).trigger("change");
	$("#invoiceForm").data('bootstrapValidator').resetForm();

}
/**
 * 往里面存数据
 */

var saveInvoice = function() {
	 //checkSession();
	 var invoicedate=$("#invoicedate").val();
	var reg = /,$/gi;
	var invoiceDetailVal = "[";

	$("#tableBody").find('tr').each(
			function(index, temp) {
				var shortname = $(this).find("td:nth-child(2)").find("input")
						.val();
				var unitsname = $(this).find("td:nth-child(3)").find("input")
						.val();
				var productionsearchno = $(this).find("td:nth-child(4)").find(
						"input").val();
				var initcount = $(this).find("td:nth-child(5)").find("input")
						.val();
				var complatecount = $(this).find("td:nth-child(6)").find(
						"input").val();
				var cansendcount = $(this).find("td:nth-child(8)").find(
						"input").val();
				var sendcount = $(this).find("td:nth-child(9)").find("input")
						.val();
				var invoicenumber = $(this).find("td:nth-child(10)").find("input")
						.val();
				var unitsid = $(this).find("td:nth-child(11)").find("input")
						.val();
				var productorid = $(this).find("td:nth-child(12)")
						.find("input").val();
				var salesorderdetailid = $(this).find("td:nth-child(13)")
				.find("input").val();
				var oldinvoicenumber = $(this).find("td:nth-child(14)")
				.find("input").val();
				if(oldinvoicenumber==undefined){
					oldinvoicenumber=0;
				}
				var invoicedetailid = $(this).find("td:nth-child(15)")
				.find("input").val();

				invoiceDetailVal += "{\"shortname\" : \"" + shortname
						+ "\",\"unitsname\" : \"" + unitsname
						+ "\",\"productionsearchno\":\"" + productionsearchno
						+ "\"," + "\"initcount\":\"" + initcount
						+ "\",\"complatecount\":\"" + complatecount
						+ "\",\"cansendcount\":\"" + cansendcount
						+ "\",\"sendcount\":\"" + sendcount
						+ "\",\"unitsid\":\"" + unitsid
						+ "\",\"productorid\":\"" + productorid + "\",\"salesorderdetailid\":\"" + salesorderdetailid + "\",\"invoicenumber\":\"" + invoicenumber + "\",\"oldinvoicenumber\":\"" + oldinvoicenumber + "\",\"invoicedetailid\":\"" + invoicedetailid + "\"},";
			});
	invoiceDetailVal = invoiceDetailVal.replace(reg, "");
	invoiceDetailVal += "]";
	$('#invoiceDetailVal').val(invoiceDetailVal);

	var form = $("#invoiceForm").serializeArray();
	// 后面确认时应 检测模具编号是否已存在
	var formData = formatFormJson(form);
	$("#invoiceForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#invoiceForm').data('bootstrapValidator').isValid()) { // 返回true、false
		if(invoiceDetailVal!="[]"){
			if(invoicedate!=""){
				if(vflag==1||ope=="updateInvoiceNoStorage"){
					$.ajax({
						type : "POST",
						url : "../../../"+ln_project+"/invoice",
						data : {
							"method" : ope,
							"formData" : formData,
						},
						dataType : "text",
						async : false,
						success : function(data) {

							var flag =  com.leanway.checkLogind(data);

							if(flag){


								var tempData = $.parseJSON(data);
								if (tempData.status == "success") {

									com.leanway.formReadOnly("invoiceForm");
									com.leanway.clearTableMapData( "generalInfo" );
									oTable.ajax.reload();									
								} 
								lwalert("tipModal", 1, tempData.info);

							}
						}
					});
				}else{
					lwalert("tipModal", 1, "请正确填写发货数量");
				}
			}else{
				lwalert("tipModal", 1, "出货日期不能为空！");
			}
		}else{
			lwalert("tipModal", 1, "产品为空不能保存！");
		}
	}
}
// 格式化form数据
var formatFormJson = function(formData) {
	var reg = /,$/gi;
	var data = "{";
	for (var i = 0; i < formData.length; i++) {
		if (formData[i].name == "invoiceDetailVal") {
			data += "\"" + formData[i].name + "\" : " + formData[i].value + ",";
		} else {
			data += "\"" + formData[i].name + "\" : \"" + formData[i].value
					+ "\",";
		}
	}
	data = data.replace(reg, "");
	data += "}";
	return data;
}

// 数据table
var oTable;

// 需要初始化数据
$(function() {
	initTimePickYmd("invoicedate");
	initSelect2("#salesorderid", "../../../"+ln_project+"/invoice?method=querySalesOrder",
			"搜索销售订单");
});

// 初始化select2,
/**
 * id: 为要操作的对象 url: url text: 要在select中显示的文本
 */
function initSelect2(id, url, text) {
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

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					params.page = params.page || 1;
					return {
						results : data.items,
						pagination : {
							more : (params.page * 30) < data.total_count
						}

				  }
				}
			},
			cache : false
		},
		escapeMarkup : function(markup) {
			return markup;
		},
		minimumInputLength : 1,
	});
}

/**
 * 填充到台账表格(拼接table)
 */
function setTableValue(data) {
	var tableHeadHtml = ""
	tableHeadHtml += " <tr>";
	tableHeadHtml += "  <th>" + "序号" + "</th>";
	tableHeadHtml += "  <th>" + "产品" + "</th>";
	tableHeadHtml += "  <th>" + "计量单位" + "</th>";
	tableHeadHtml += "  <th>" + "生产查询号" + "</th>";
	tableHeadHtml += "  <th>" + "计划数" + "</th>";
	tableHeadHtml += "  <th>" + "完工数量" + "</th>";
	tableHeadHtml += "  <th>" + "已发货数量" + "</th>";
	tableHeadHtml += "  <th>" + "未发货数量" + "</th>";
	tableHeadHtml += "  <th>" + "本单发货数量" + "</th>";
	tableHeadHtml += "  <th>" + "本单开票数量" + "</th>";

	tableHeadHtml += " </tr>";
	$("#tableHead").html(tableHeadHtml);
	var tableBodyHtml = "";
	var row = $("#grid-data").find("tr").length;
	for ( var i in data) {
		tableBodyHtml += " <tr>";
		tableBodyHtml += "  <td>" + row + "</td>";
		tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
				+ data[i].shortname
				+ "' id='shortname'  readonly='readonly' style='width:100px'/></td>";
		tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
				+ data[i].unitsname
				+ "' id='unitsname' readonly='readonly'/></td>";
		tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
				+ data[i].productionsearchno
				+ "' id='productionsearchno' readonly='readonly' style='width:100px'/></td>";
		tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
				+ data[i].number
				+ "' id='initcount'  readonly='readonly' style='width:100px'/></td>";
		tableBodyHtml += "  <td> <input class='form-control' type='text' value='"+data[i].complatecount+"' id='complatecount' name='complatecount' readonly='readonly' style='width:100px'/></td>";
		tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
			+ data[i].shippednumber
			+ "' id='shippednumber' name='shippednumber' readonly='readonly' style='width:100px'/></td>";
		tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
				+ data[i].notshipmentsnumber
				+ "' id='cansendcount' readonly='readonly' style='width:100px'/></td>";
		tableBodyHtml += "  <td> <input class='form-control' type='text'  id='sendcount' name='sendcount' style='border-color: #3c8dbc;' onkeyup='isNumber(&quot;sendcount&quot;)' onafterpaste='isNumber(&quot;sendcount&quot;)' onblur='notGreaterThan()'/></td>";
		tableBodyHtml += "  <td> <input class='form-control' type='text'  id='invoicenumber' name='invoicenumber' style='border-color: #3c8dbc;' onkeyup='isNumber(&quot;invoicenumber&quot;)' onafterpaste='isNumber(&quot;invoicenumber&quot;)'/></td>";
		tableBodyHtml += "  <td style='display:none'> <input class='form-control' type='hidden' value='"
				+ data[i].unitsid + "' id='unitsid' /></td>";
		tableBodyHtml += "  <td style='display:none'> <input class='form-control' type='hidden' value='"
				+ data[i].productorid
				+ "' id='productorid'/></td>";
		tableBodyHtml += "  <td style='display:none'> <input class='form-control' type='hidden' value='"
			+ data[i].salesorderdetailid
			+ "' id='salesorderdetailid'/></td>";
		tableBodyHtml += " </tr>";
		row++;
	}
	$("#tableBody").html(tableBodyHtml);
}
function isNumber(value) {
	var trackcount = document.getElementsByName(value);
	for (var i = 0; i < trackcount.length; i++) {

		trackcount[i].value = trackcount[i].value.replace(/[^\d.]/g, '');

	}
}
var vflag = -1;
function notGreaterThan() {
	var complatecount = document.getElementsByName("complatecount");
	var sendcount = document.getElementsByName("sendcount");
	var shippednumber = document.getElementsByName("shippednumber");
	for (var i = 0; i < sendcount.length; i++) {
		var surplusnumber = complatecount[i].value-shippednumber[i].value;
		if (complatecount[i].value!=0&&(parseFloat((sendcount[i].value)) > parseFloat(surplusnumber)||parseFloat(sendcount[i].value)==0)) {
//			alert("发货数量不能大于完工数量");
			lwalert("tipModal", 1, "该产品完工数量"+complatecount[i].value+",已发货数量"+shippednumber[i].value+"," +
					"剩余可发货数量为"+surplusnumber+",填写的发货数量不能大于剩余可发货数量且不等于0！");
			vflag=0;
			break;
		} else if(complatecount[i].value==0&&parseFloat((sendcount[i].value)) > parseFloat(complatecount[i].value)){
			lwalert("tipModal", 1, "发货数量不能大于完工数量");
			break;
		}else {
			vflag = 1;
		}
	}
}
/**
 * 填充到台账表格(拼接table)
 */
function setTableValue2(data) {
	var tableHeadHtml = ""
	tableHeadHtml += " <tr>";
	tableHeadHtml += "  <th style='width: 25px'>" + "序号" + "</th>";
	tableHeadHtml += "  <th style='width: 25px'>" + "产品" + "</th>";
	tableHeadHtml += "  <th style='width: 25px'>" + "计量单位" + "</th>";
	tableHeadHtml += "  <th style='width: 25px'>" + "生产查询号" + "</th>";
	tableHeadHtml += "  <th style='width: 25px'>" + "计划数" + "</th>";
	tableHeadHtml += "  <th style='width: 25px'>" + "完工数量" + "</th>";
	tableHeadHtml += "  <th style='width: 25px'>" + "已发货数量" + "</th>";
	tableHeadHtml += "  <th style='width: 25px'>" + "未发货数量" + "</th>";
	tableHeadHtml += "  <th style='width: 25px'>" + "总开票数量" + "</th>";
	tableHeadHtml += "  <th style='width: 25px'>" + "本单发货数量" + "</th>";
	tableHeadHtml += "  <th style='width: 25px'>" + "本单开票数量" + "</th>";

	tableHeadHtml += " </tr>";
	$("#tableHead").html(tableHeadHtml);
	var tableBodyHtml = "";
	var j = 1;
	for ( var i in data) {

		tableBodyHtml += " <tr>";
		tableBodyHtml += "  <td>" + j + "</td>";
		tableBodyHtml += "  <td>" + data[i].shortname + "</td>";
		tableBodyHtml += "  <td>" + data[i].unitsname + "</td>"
		tableBodyHtml += "  <td>" + data[i].productionsearchno + "</td>";
		tableBodyHtml += "  <td>" + data[i].initcount + "</td>";
		tableBodyHtml += "  <td> " + data[i].complatecount + "</td>";
		tableBodyHtml += "  <td> " + data[i].shippednumber + "</td>";
		tableBodyHtml += "  <td> " + data[i].cansendcount + "</td>";
		tableBodyHtml += "  <td>" + data[i].oldinvoicenumber + "</td>";
		tableBodyHtml += "  <td>" + data[i].sendcount + "</td>";
		tableBodyHtml += "  <td>" + data[i].invoicenumber + "</td>";
		tableBodyHtml += " </tr>";
		j = j + 1;
	}
	$("#tableBody").html(tableBodyHtml);
}

/**
 * 搜索物料追踪单
 */
var searchInvoice = function() {
	 //checkSession();
	var searchVal = $("#searchValue").val();

	oTable.ajax.url(
			"../../../"+ln_project+"/invoice?method=queryInvoiceList&searchValue=" + searchVal)
			.load();
}

function loadOrder() {
	 //checkSession();
	var salesorderid = $("#salesorderid").val();
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/invoice",
		data : {
			"method" : "queryOrderDetail",
			"salesorderid" : salesorderid,
		},
		dataType : "text",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				setTableValue(tempData);

			}
		}
	});
	
}
function setTableToEdit(data){
	 var tableHeadHtml = ""
			tableHeadHtml += " <tr>";
			tableHeadHtml += "  <th>" + "序号" + "</th>";
			tableHeadHtml += "  <th>" + "产品" + "</th>";
			tableHeadHtml += "  <th>" + "计量单位" + "</th>";
			tableHeadHtml += "  <th>" + "生产查询号" + "</th>";
			tableHeadHtml += "  <th>" + "计划数" + "</th>";
			tableHeadHtml += "  <th>" + "完工数量" + "</th>";
			tableHeadHtml += "  <th>" + "已发货数量" + "</th>";
			tableHeadHtml += "  <th>" + "未发货数量" + "</th>";
			tableHeadHtml += "  <th>" + "本单发货数量" + "</th>";
			tableHeadHtml += "  <th>" + "本单开票数量" + "</th>";

			tableHeadHtml += " </tr>";
			$("#tableHead").html(tableHeadHtml);
			var tableBodyHtml = "";
			var row = $("#grid-data").find("tr").length;
			for ( var i in data) {
				tableBodyHtml += " <tr>";
				tableBodyHtml += "  <td>" + row + "</td>";
				tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
						+ data[i].shortname
						+ "' id='shortname'  readonly='readonly' style='width:100px'/></td>";
				tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
						+ data[i].unitsname
						+ "' id='unitsname' readonly='readonly'/></td>";
				tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
						+ data[i].productionsearchno
						+ "' id='productionsearchno' readonly='readonly' style='width:100px'/></td>";
				tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
						+ data[i].initcount
						+ "' id='initcount'  readonly='readonly' style='width:100px'/></td>";
				tableBodyHtml += "  <td> <input class='form-control' type='text' value='"+data[i].complatecount+"' id='complatecount' name='complatecount' readonly='readonly' style='width:100px'/></td>";
				tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
					+ data[i].shippednumber
					+ "' id='shippednumber' name='shippednumber' readonly='readonly' style='width:100px'/></td>";
				tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
						+ data[i].notshipmentsnumber
						+ "' id='cansendcount' readonly='readonly' style='width:100px'/></td>";
				tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
					+ data[i].sendcount
					+ "' id='sendcount' readonly='readonly' style='width:100px'/></td>";
				tableBodyHtml += "  <td> <input class='form-control' type='text'  id='invoicenumber' name='invoicenumber' value='"+data[i].invoicenumber+"'/></td>";
				tableBodyHtml += "  <td style='display:none'> <input class='form-control' type='hidden' value='"
						+ data[i].unitsid + "' id='unitsid' /></td>";
				tableBodyHtml += "  <td style='display:none'> <input class='form-control' type='hidden' value='"
						+ data[i].productorid
						+ "' id='productorid'/></td>";
				tableBodyHtml += "  <td style='display:none'> <input class='form-control' type='hidden' value='"
					+ data[i].salesorderdetailid
					+ "' id='salesorderdetailid'/></td>";
				tableBodyHtml += "  <td style='display:none'> <input class='form-control' type='text'  id='oldinvoicenumber' name='oldinvoicenumber' value='"+data[i].invoicenumber+"'/></td>";
				tableBodyHtml += "  <td style='display:none'> <input class='form-control' type='text'  id='invoicedetailid' name='invoicedetailid' value='"+data[i].invoicedetailid+"'/></td>";
				tableBodyHtml += " </tr>";
				row++;
			}
			$("#tableBody").html(tableBodyHtml);
}


