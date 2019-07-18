
$(function() {
	parent.searchResust(); 
});




/**
 * 
 * 查询派工单条码
 * 
 */
/*function searchResust() {

	// 序列化form表单数据window.parent.document.getElementByIdx_x("元素id");
	var form = $("#workOrderBarcodePrintForm").serializeArray();
	var formData = formatFormJson(form);
	alert(formData)
	$.ajax({
		type : "post",
		url : "../../dispatchbarcodeprint",
		data : {
			"method" : "selectDispatchBarcode",
			"formData" : formData
		},
		dataType : "text",
		async : false,
		success : function(data) {
			// ajax json数据解析
			var result = eval("(" + data + ")");

			if (result.dispatchBarcodePrints.length != 0) {

				setFormPrint(result.dispatchBarcodePrints);
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
}*/

//需要打印的form表单填值
function setFormPrint(result) {
	console.info(result);
	var productionsearchno = $('#productionsearchno', parent.document).val();
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
		tableBodyHtml += "  <td align='center'><TABLE width='100%'  align='center' padding='0px' border='0px' 	align='center'  cellpadding='0px'  cellspacing='0px' ><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>生产查询号<TD></TR><TR><TD align='center' height='40px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;'>"
			+ productionsearchno + "</TD></TR></TABLE></td>";
		tableBodyHtml += "  <td align='center'><TABLE width='100%'  align='center' padding='0px' border='0px' 	align='center'  cellpadding='0px'  cellspacing='0px'><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>工序号<TD></TR><TR><TD align='center' height='40px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;'>"
			+ result[i].shortname + "</TD></TR></TABLE></td>";
		tableBodyHtml += "  <td align='center'><TABLE width='100%'  align='center' padding='0px' border='0px' 	align='center'  cellpadding='0px'  cellspacing='0px' ><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>&nbsp;<TD></TR><TR><TD align='center' height='40px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;'>"
			+ result[i].compid + "</TD></TR></TABLE></td>";
		tableBodyHtml += " </tr>";
		tableBodyHtml += " <tr>";
		tableBodyHtml += "  <td align='center'><TABLE width='100%'  align='center' padding='0px' border='0px' 	align='center'  cellpadding='0px'  cellspacing='0px'><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>数量<TD></TR><TR><TD align='center' height='40px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;'>"
			+ result[i].number + "</TD></TR></TABLE></td>";
		tableBodyHtml += "  <td align='center'><TABLE width='100%'  align='center' padding='0px' border='0px' 	align='center'  cellpadding='0px'  cellspacing='0px'><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>开始(调整)<TD></TR><TR><TD align='center' height='40px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;'>"
			+ starttimeform + "</TD></TR></TABLE></td>";
		tableBodyHtml += "  <td align='center'><TABLE width='100%'  align='center' padding='0px' border='0px' 	align='center'  cellpadding='0px'  cellspacing='0px'><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>结束(调整)<TD></TR><TR><TD align='center' height='40px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;'>"
			+ endtimeform + "</TD></TR></TABLE></td>";
		tableBodyHtml += " </tr>";
		tableBodyHtml += " <tr>";
		tableBodyHtml += "  <td  align='center'><TABLE width='100%'  align='center' padding='0px' border='0px' 	align='center'  cellpadding='0px'  cellspacing='0px'><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>产品编码(规格)<TD></TR><TR><TD align='center' height='40px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;'>"
			+ result[i].productorname
			+ "("
			+ result[i].specification
			+ ")"
			+ "<div id='productoridbarcode"
			+ i
			+ "'>"
			+ result[i].productoridbarcode
			+ "</div></TD></TR></TABLE></td>";
		tableBodyHtml += "  <td align='center'><TABLE width='100%'  align='center' padding='0px' border='0px' 	align='center'  cellpadding='0px'  cellspacing='0px' ><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>设备台账<TD></TR><TR><TD align='center' height='40px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;'>"
			+ result[i].equipmentname
			+ "<div id='equipmentbarcode"
			+ i
			+ "'>"
			+ result[i].equipmentbarcode
			+ "</div></TD></TR></TABLE></td>";
		tableBodyHtml += "  <td align='center'><TABLE width='100%'  align='center' padding='0px' border='0px' 	align='center'  cellpadding='0px'  cellspacing='0px' ><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>派工单号<TD></TR><TR><TD align='center' height='40px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;'>"
			+ result[i].dispatchingnumber
			+ "<div id='orderbarcode"+ i+ "'>"+ result[i].orderbarcode+ "</div></TD></TR></TABLE></td>";
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
function printBarcodeview() {
	retainAttr = true;
	window.document.body.innerHTML=$('#printarea').html();
	window.print();
}
