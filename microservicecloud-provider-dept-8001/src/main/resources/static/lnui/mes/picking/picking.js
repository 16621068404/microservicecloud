var clicktime = new Date();

var oTable;
// var bomTable;
// 页面打开时加载的数据
$(function() {

	// 时间初始化
	com.leanway.initTimePickYmdForMoreId("starttime");
	com.leanway.initTimePickYmdForMoreId("endtime");

	com.leanway.loadTags();

	// select2 组件初始化
	initSelect2("#productionchildsearchno",
			"../../../"+ln_project+"/picking?method=queryProductionchildsearchno", "搜索生产子查询号");

	oTable = initTable();
	$("#printbarcodebutton").hide();
});

// 初始化select2,
/**
 * id: 为要操作的对象 url: url text: 要在select中显示的文本
 */
function initSelect2(id, url, text) {
	$(id).select2({
		placeholder : text,
		allowClear : true,
		language : "zh-CN",
		ajax : {
			url : url,
			dataType : 'json',
			delay : 500,
			data : function(params) {
				return {
					q : params.term, // search term
					page : params.page,
					pageSize : 10
				};
			},
			processResults : function(data, params) {

				var flag = com.leanway.checkLogind(data);

				if (flag) {

					params.page = params.page || 1;
					return {
						results : data.items,
						pagination : {
							more : (params.page * 30) < data.total_count
						}

					}
				}
				;
			},
			cache : false
		},
		escapeMarkup : function(markup) {
			return markup;
		},
		minimumInputLength : 1,
	});
}
// 触发select2选择事件，给隐藏域赋值
$("#productionchildsearchno").on("select2:select", function(e) {
	$("#productionsearchnoView").val($(this).find("option:selected").text());
});

var initTable = function() {

	var table = $('#productionOrderDataTable')
			.DataTable(
					{
						"ajax" : "../../../"+ln_project+"/picking?method=queryProductorOrderBySearchNo",
						// "iDisplayLength" : "10",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"bAutoWidth" : true, // 宽度自适应
						"bProcessing" : true,
						"bServerSide" : true,

						"columns" : [ {
							"data" : "productionorderid"
						}, {
							"data" : "productionnumber"
						}, {
							"data" : "productorname"
						}, {
							"data" : "shortname"
						}, {
							"data" : "specification"
						}, {
							"data" : "number"
						}, {
							"data" : "starttime"
						}, {
							"data" : "endtime"
						} ],
						"aoColumns" : [
								{
									"mDataProp" : "productionorderid",
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
																+ "'><label for='"
																+ sData
																+ "'></label>");
										com.leanway.columnTdBindSelect(nTd);
									}
								}, {
									"mDataProp" : "productionnumber"
								}, {
									"mDataProp" : "productorname"
								}, {
									"mDataProp" : "shortname"
								}, {
									"mDataProp" : "specification"
								}, {
									"mDataProp" : "number"
								}, {
									"mDataProp" : "starttime"
								}, {
									"mDataProp" : "endtime"
								} ],

						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {

							com.leanway.getDataTableFirstRowId(
									"productionOrderDataTable",
									queryBomByProductor, "more");

							// 点击dataTable触发事件
							com.leanway.dataTableClickMoreSelect(
									"productionOrderDataTable", "checkList",
									false, oTable, queryBomByProductor);

							$("#printarea").html("");
							$("#length").html("");

						}

					}).on('xhr.dt', function(e, settings, json) {
				com.leanway.checkLogind(json);
			});
	return table;
}

function queryBomByProductor(id) {

	showMask();

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/picking",
		data : {
			"method" : "queryPickingByProductionorderid",
			"id" : id
		},
		dataType : "text",
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {

				var result = eval("(" + data + ")");

				if (result.length != 0) {

					setFormPrint(result.data, result.length);
					$("#printbarcodebutton").show();
					hideMask();
				} else {

					$("#tableBody").empty();
					$("#printbarcodebutton").hide();
					hideMask();
				}

			}

		},
		error : function(data) {

			lwalert("tipModal", 1, "error！");
		}
	});
}

// 需要打印的form表单填值
function setFormPrint(result, length) {

	showMask();
	var btype = "code128";
	var settings = {
		output : "css",
		bgColor : "#FFFFFF",
		color : "#000000",
		barHeight : "50",
		moduleSize : "5",
		posX : "10",
		posY : "20",
	// addQuietZone: "1"
	};
	var tableBodyHtml = "";
	for (var i = 0; i < result.length; i++) {

		if (i == 0) {
			tableBodyHtml += "<table class='table table-hover'>";
		}
		if (i > 0) {
			if (i % 4 == 0) {
				tableBodyHtml += "<tr>";
				tableBodyHtml += "  <td colspan='6' >";
				tableBodyHtml += "  </td>";
				tableBodyHtml += "  </tr></table>";
				tableBodyHtml += "<p style='page-break-after:always;'></p>";
				tableBodyHtml += "<table class='table table-hover'>";
			}
		}

		if (i > 0) {
			if (result[i].line != result[i - 1].line) {
				tableBodyHtml += "<tr>";
				tableBodyHtml += "  <td colspan='6'>";
				tableBodyHtml += "		<h1><hr  style='height:2px;border:none;border-top:2px dotted #185598;'/></h1>";
				tableBodyHtml += "  </td>";
				tableBodyHtml += "  </tr></table>";
				tableBodyHtml += "<p style='page-break-after:always;'></p>";
				tableBodyHtml += "<table class='table table-hover'>";
			}
		}
		tableBodyHtml += "<tr>";
		// tableBodyHtml += " <td id='barcode" + i + "'> 派工单号: <br>" +
		// result[i].barcode + "</br></td>";
		tableBodyHtml += "  <td width='10%'> 行号:" + result[i].line + "</td>";
		tableBodyHtml += "  <td width='20%'> 工序名称:" + result[i].shortname1
				+ "</td>";
		tableBodyHtml += "  <td width='20%'> 物料名称:" + (result[i].shortname==null?'':result[i].shortname)
				+ "</td>";
		// tableBodyHtml += " <td id='bombarcode" + i + "'> 组件条码:<br>"+
		// result[i].bombarcode + "</br></td>";
		tableBodyHtml += "  <td width='10%'> 数量:" + (result[i].number==null?'':result[i].number) + "</td>";
		tableBodyHtml += "  <td width='20%'> 设备名称:<br>"
				+ result[i].equipmentname + "</br></td>";
		// tableBodyHtml += " <td id='equipbarcode" + i + "'> 台账条码:<br>" +
		// result[i].equipbarcode + "</br></td>";
		tableBodyHtml += "  <td width='20%'> 开始时间:<br>" + result[i].starttime
				+ "</br></td>";
		// tableBodyHtml += " <td> 结束时间<br>"+result[i].endtime+"</br></td>";
		tableBodyHtml += " </tr>";
		tableBodyHtml += "<tr>";
		tableBodyHtml += "  <td colspan='2' align='left'><div id='barcode" + i
				+ "'>" + (result[i].barcode==null?'':result[i].barcode) + "</div></td>";
		tableBodyHtml += "  <td colspan='2' align='left'><div id='bombarcode"
				+ i + "'>" + (result[i].bombarcode==null?'':result[i].bombarcode) + "</div></td>";
		// tableBodyHtml += " <td> </td>";
		tableBodyHtml += "  <td colspan='2' align='left'><div id='equipbarcode"
				+ i + "'>" + (result[i].equipbarcode==null?'':result[i].equipbarcode) + "</div></td>";
		// tableBodyHtml += " <td align='center' id='equipbarcode" + i + "'>
		// 台账条码:<br>" + result[i].equipbarcode + "</br></td>";
		// tableBodyHtml += " <td></td>";
		tableBodyHtml += "</tr>";

		$("#printarea").html(tableBodyHtml);

		for ( var j in result) {
		    // 条码显示 后台传上id值 获取填值
			var value = '';
			if(result[j].barcode!=null){
			    value = result[j].barcode;
		         $("#barcode" + j).barcode(value, btype, settings);
			};
			var value1 = '';
			if (result[j].shortname != null) {
				value1 = result[j].bombarcode;
	            $("#bombarcode" + j).barcode(value1, btype, settings);

			}
			var value2 ='';
			if(result[j].equipbarcode!=null){
			    value2 = result[j].equipbarcode;
		         $("#equipbarcode" + j).barcode(value2, btype, settings);
			}



		}

	}

	lengthHtml = "";
	lengthHtml += "<table class='table table-hover'>";
	lengthHtml += "<tr> <td align='right'>";
	lengthHtml += " 总计" + length + "条数据";
	lengthHtml += " </td> </tr>"
	lengthHtml += "</table>";
	$("#length").html(lengthHtml);
	hideMask();
	// console.info(tableBodyHtml)
}

/**
 *
 * 查询销售订单条码
 *
 */
function searchResult() {

	var productionchildsearchno = $("#productionchildsearchno").val();
	oTable.ajax.url(
			"../../../"+ln_project+"/picking?method=queryProductorOrderBySearchNo&productionchildsearchno="
					+ productionchildsearchno).load();

	$("#tableBody").html("");
	$("#printbarcodebutton").hide();
}

// 格式化form数据
var formatFormJson = function(formData) {
	var reg = /,$/gi;
	var data = "{";
	for (var i = 0; i < formData.length; i++) {
		var tempVal = formData[i].value;

		if (formData[i].name == "ledgerVal") {
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

// 打印机打印
function printBarcode() {
	retainAttr = true;
	$("#printarea").printArea();
}

function showMask() {
	$("#mask").css("height", $(document).height());
	$("#mask").css("width", $(document).width());
	$("#mask").show();
}
// 隐藏遮罩层
function hideMask() {

	$("#mask").hide();
}