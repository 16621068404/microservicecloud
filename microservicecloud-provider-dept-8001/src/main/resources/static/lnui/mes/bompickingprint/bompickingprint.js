
$(function() {

	// 时间初始化
	com.leanway.initTimePickYmdForMoreId("#starttime");
	com.leanway.initTimePickYmdForMoreId("#endtime");

	com.leanway.loadTags();
	com.leanway.checkSession();
	// select2 初始化
	initSelect2("#productionsearchno",
			"../../../"+ln_project+"/workorderbarcodeprint?method=queryDispatchOrder", "搜索子生产查询号");
	initSelect2("#groupid",
			"../../../"+ln_project+"/workorderbarcodeprint?method=queryWorkCenterGroup",
	"搜索工作中心组");

	// 为显示好看 按钮隐藏
	$("#printbarcodebutton").hide();
});

//初始化select2,
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
			delay : 500,
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
//触发select2选择事件，给隐藏域赋值
$("#productionsearchno").on("select2:select", function(e) {
	$("#productionsearchnoView").val($(this).find("option:selected").text());
});
$("#groupid").on("select2:select", function(e) {
	$("#groupname").val($(this).find("option:selected").text());
});

//<iframe src="index.html" id="iframepage" frameborder="0" 
//scrolling="no" marginheight="0" marginwidth="0" onLoad="iFrameHeight()"></iframe>
function viewIframe(){
	if (!frontJudge()) {

	} else {
		var div = document.getElementById("viewiframe");
		var iframe = document.createElement("iframe");
		//iframe.setAttribute("src","test.html");
		iframe.src = 'windowHtml.html';
		iframe.id = 'tableIframe';
		iframe.name = 'tableIframe';
		iframe.scrolling = 'yes';
		iframe.allowtransparency = 'yes';
		iframe.style.width = "100%";
		iframe.style.height = "500px";
		iframe.style.border = "none";
		div.appendChild(iframe);
	}
}

/**
 * 
 * 查询派工单条码
 * 
 */
function searchResust() {

	// 序列化form表单数据
	var form = $("#workOrderBarcodePrintForm").serializeArray();
	var formData = formatFormJson(form);
	var productionsearchno = $("#productionsearchno").val();
	
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/dispatchbarcodeprint",
		data : {
			"method" : "selectDispatchBarcode",
			"formData" : formData,
			"productionsearchno" : productionsearchno
		},
		dataType : "text",
		async : false,
		success : function(data) {
			// ajax json数据解析
			var result = eval("(" + data + ")");

			if (result.dispatchBarcodePrints.length != 0) {

		//		setFormPrint(result.dispatchBarcodePrints);
				tableIframe.window.setFormPrint(result.dispatchBarcodePrints); 
				$("#printbarcodebutton").show();

			} else {
				$("#tableBody").empty();
				$("#printbarcodebutton").hide();
				lwalert("tipModal", 1, "无数据，请重新检查查询条件！");
			}

		},
		error : function(data) {

			lwalert("tipModal", 1, "error！");
		}
	});
}

//需要打印的form表单填值
function setFormPrint(result) {
	console.info(result);
	var productionsearchno = $("#productionsearchno").val();
	var btype = "code128";
	var settings = {
			output : "css",
			bgColor : "#FFFFFF",
			color : "#000000",
			barHeight : "50",
			moduleSize : "5",
			posX : "10",
			posY : "20",
			addQuietZone : "1"
	};
	var tableBodyHtml = "";
	var m = 1;
	for (var i = 0; i < result.length; i++) {
		var starttimeform = result[i].starttimeform;
		var endtimeform = result[i].endtimeform;
		if (starttimeform == null) {
			starttimeform = "";
		}
		if (endtimeform == null) {
			endtimeform = "";
		}
		tableBodyHtml += " <tr>";
		tableBodyHtml += "  <td align='center'><TABLE width='100%' bgcolor='#F0F0F0' align='center' ><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>生产查询号<TD></TR><TR><TD align='center' height='35px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;'>"
			+ productionsearchno + "</TD></TR></TABLE></td>";
		tableBodyHtml += "  <td align='center'><TABLE width='100%' bgcolor='#F0F0F0' align='center' ><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>工序号<TD></TR><TR><TD align='center' height='35px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;'>"
			+ result[i].shortname + "</TD></TR></TABLE></td>";
		tableBodyHtml += "  <td align='center'><TABLE width='100%' bgcolor='#F0F0F0' align='center' ><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>&nbsp;<TD></TR><TR><TD align='center' height='35px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;'>"
			+ result[i].compid + "</TD></TR></TABLE></td>";
		tableBodyHtml += " </tr>";
		tableBodyHtml += " <tr>";
		tableBodyHtml += "  <td align='center'><TABLE width='100%' bgcolor='#F0F0F0' align='center' ><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>数量<TD></TR><TR><TD align='center' height='35px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;'>"
			+ result[i].number + "</TD></TR></TABLE></td>";
		tableBodyHtml += "  <td align='center'><TABLE width='100%' bgcolor='#F0F0F0' align='center' ><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>开始(调整)<TD></TR><TR><TD align='center' height='35px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;'>"
			+ starttimeform + "</TD></TR></TABLE></td>";
		tableBodyHtml += "  <td align='center'><TABLE width='100%' bgcolor='#F0F0F0' align='center' ><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>结束(调整)<TD></TR><TR><TD align='center' height='35px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;'>"
			+ endtimeform + "</TD></TR></TABLE></td>";
		tableBodyHtml += " </tr>";
		tableBodyHtml += " <tr>";
		tableBodyHtml += "  <td  align='center'><TABLE width='100%' bgcolor='#F0F0F0' align='center' ><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>产品编码(规格)<TD></TR><TR><TD align='center' height='35px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;'>"
			+ result[i].productorname
			+ "("
			+ result[i].specification
			+ ")"
			+ "<div id='productoridbarcode"
			+ i
			+ "'>"
			+ result[i].productoridbarcode
			+ "</div></TD></TR></TABLE></td>";
		tableBodyHtml += "  <td align='center'><TABLE width='100%' bgcolor='#F0F0F0' align='center' ><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>设备台账<TD></TR><TR><TD align='center' height='35px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;'>"
			+ result[i].equipmentname
			+ "<div id='equipmentbarcode"
			+ i
			+ "'>"
			+ result[i].equipmentbarcode
			+ "</div></TD></TR></TABLE></td>";
		tableBodyHtml += "  <td align='center'><TABLE width='100%' bgcolor='#F0F0F0' align='center' ><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>派工单号<TD></TR><TR><TD align='center' height='35px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;'>"
			+ result[i].dispatchingnumber
			+ "<div id='orderbarcode"
			+ i
			+ "'>"
			+ result[i].orderbarcode
			+ "</div></TD></TR></TABLE></td>";
		tableBodyHtml += " </tr>";
		if (i < result.length - 1) {
			// 按工作中心下的台账分类别 打印方便员工裁剪
			if (result[i].equipmentname != result[i + 1].equipmentname) {
				m = m + 1;
				tableBodyHtml += "  <tr>";
				tableBodyHtml += "  <td colspan='10' >";
				tableBodyHtml += "  <br>";
				tableBodyHtml += "<h1><hr  style='height:2px;border:none;border-top:2px dotted #185598;'/></h1>";
				tableBodyHtml += "  <br>";
				tableBodyHtml += "  </td>";
				tableBodyHtml += "  </tr>";
			}
		}
	}
	$("#tableBody").html(tableBodyHtml);
//	document.frames["tableIframe"].document.tableBody.value = tableBodyHtml;
//	document.getElementById("tableIframe").tableBody=tableBodyHtml;
	for ( var j in result) {
		var value = result[j].equipmentbarcode;
		var value1 = result[j].productoridbarcode;
		var value2 = result[j].orderbarcode;

		// 条码显示 后台传上id值 获取填值
		$("#equipmentbarcode" + j).barcode(value, btype, settings);
		$("#productoridbarcode" + j).barcode(value1, btype, settings);
		$("#orderbarcode" + j).barcode(value2, btype, settings);
	}
}

//查询时 对前台操作的判断
function frontJudge() {
	var backValue = 0;
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	var productionsearchno = $("#productionsearchno").val();
	var groupid = $("#groupid").val();
	if (productionsearchno == null || groupid == null) {
		alert("查询条件不能为空");
	} else if (endtime == null || endtime == "") {
		backValue = 1;
	} else if (starttime > endtime) {
		alert("开始时间不能大于结束时间");
	} else
		backValue = 1;
	return backValue;
}

//格式化form数据
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

//打印机打印
function printBarcodeChild() {
	tableIframe.window.printBarcodeview();
	
	
}
