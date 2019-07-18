
$(function() {
	parent.searchResust();
});




var tableBodyHtml = "";
//需要打印的form表单填值
function setFormPrint(result) {

	parent.getLength(result.length);
//	var productionsearchno = $('#productionsearchno', parent.document).val();
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
	tableBodyHtml = "";
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
		if (i == 0) {
			tableBodyHtml += "<table class='table table-hover'>";
		}
		if (i > 0) {
			if (i%3==0) {
				tableBodyHtml += "</table>";
				tableBodyHtml += "<p style='page-break-after:always;'></p>";
				tableBodyHtml += "<table class='table table-hover'>";
			}
		}
		tableBodyHtml += " <tr>";
		tableBodyHtml += "  <td align='center'><TABLE width='100%'  align='center' padding='0px' border='0px' 	align='center'  cellpadding='0px'  cellspacing='0px' ><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>生产查询号<TD></TR><TR><TD align='center' height='40px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;'>"
			+ result[i].productionsearchno + "</TD></TR></TABLE></td>";
		tableBodyHtml += "  <td align='center'><TABLE width='100%'  align='center' padding='0px' border='0px' 	align='center'  cellpadding='0px'  cellspacing='0px'><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>工序号<TD></TR><TR><TD align='center' height='40px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;'>"
			+ result[i].shortname + "</TD></TR></TABLE></td>";
		tableBodyHtml += "  <td align='center'><TABLE width='100%'  align='center' padding='0px' border='0px' 	align='center'  cellpadding='0px'  cellspacing='0px' ><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>下一工序<TD></TR><TR><TD align='center' height='40px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;'>"
			+ (result[i].nextshortname==null?"":result[i].nextshortname) + "</TD></TR></TABLE></td>";
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
		tableBodyHtml += "  <td  align='center'><TABLE width='100%'  align='center' padding='0px' border='0px' 	align='center'  cellpadding='0px'  cellspacing='0px'><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>产品编码(规格)<TD></TR><TR><TD align='center' height='40px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;padding:4px;'>"
			+ result[i].productorname
			+ "("
			+ result[i].specification
			+ ")"
			+ "<div id='productoridbarcode"
			+ i
			+ "'>"
			+ result[i].productoridbarcode
			+ "</div></TD></TR></TABLE></td>";
    		if(result[i].equipmentname==null){
    		    tableBodyHtml += "  <td align='center'><TABLE width='100%'  align='center' padding='0px' border='0px'     align='center'  cellpadding='0px'  cellspacing='0px' ><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>设备台账<TD></TR><TR><TD align='center' height='40px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;padding:24px;'>"
    	            + (result[i].equipmentname==null?"":result[i].equipmentname)
    	            + "<div id='equipmentbarcode"
    	            + i
    	            + "'>"
    	            + (result[i].equipmentbarcode==null?"":result[i].equipmentbarcode)
    	            + "</div></TD></TR></TABLE></td>";
    		}else{
    		    tableBodyHtml += "  <td align='center'><TABLE width='100%'  align='center' padding='0px' border='0px'     align='center'  cellpadding='0px'  cellspacing='0px' ><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>设备台账<TD></TR><TR><TD align='center' height='40px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;padding:4px;'>"
    	            + (result[i].equipmentname==null?"":result[i].equipmentname)
    	            + "<div id='equipmentbarcode"
    	            + i
    	            + "'>"
    	            + (result[i].equipmentbarcode==null?"":result[i].equipmentbarcode)
    	            + "</div></TD></TR></TABLE></td>";
    		}

    		if(result[i].printstatus!=0&&result[i].printstatus!=null){
                tableBodyHtml += "  <td align='center'><TABLE width='100%'  align='center' padding='0px' border='0px'     align='center'  cellpadding='0px'  cellspacing='0px' ><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>派工单号（已打印"+result[i].printstatus+"次）<TD></TR><TR><TD align='center' height='40px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;padding:4px;'>"
                    + result[i].dispatchingnumber
                    + "<div id='orderbarcode"+ i+ "'>"+ result[i].orderbarcode+ "</div></TD></TR></TABLE></td>";
            }else{
                tableBodyHtml += "  <td align='center'><TABLE width='100%'  align='center' padding='0px' border='0px'   align='center'  cellpadding='0px'  cellspacing='0px' ><TR><TD bgcolor='#3C8DBC' align='center' height='20px' style='font-size:14px;border-radius:5px 5px 0px 0px'>派工单号<TD></TR><TR><TD align='center' height='40px' valign='middle' style='font-size:14px;border:1px solid;border-color:#3C8DBC;padding:4px;'>"
                    + result[i].dispatchingnumber
                    + "<div id='orderbarcode"+ i+ "'>"+ result[i].orderbarcode+ "</div></TD></TR></TABLE></td>";
            }
    		tableBodyHtml += " </tr>";
    		if (i < result.length) {
    			// 按工作中心下的台账分类别 打印方便员工裁剪
    				m = m + 1;
    				tableBodyHtml += "  <tr>";
    				tableBodyHtml += "  <td colspan='10' height='4px'>";
    				tableBodyHtml += "<hr  style='height:2px;border:none;border-top:1px dotted #185598;margin:30px'/>";
    				tableBodyHtml += "  </td>";
    				tableBodyHtml += "  </tr>";
    		}
	}
	$("#printarea").html(tableBodyHtml);
	for ( var j in result) {
		var value = result[j].equipmentbarcode;
		var value1 = result[j].productoridbarcode;
		var value2 = result[j].orderbarcode;

		// 条码显示 后台传上id值 获取填值
		if(value!=null&&value!=""){
		    $("#equipmentbarcode" + j).barcode(value, btype, settings);
		}
		if(value1!=null&&value1!=""){
		$("#productoridbarcode" + j).barcode(value1, btype, settings);
		}
		if(value2!=null&&value2!=""){
		$("#orderbarcode" + j).barcode(value2, btype, settings);
		}
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
	bdhtml=window.document.body.innerHTML;
	window.document.body.innerHTML=$('#printarea').html();
//	window.document.body.innerHTML= tableBodyHtml;
	window.print();
	window.document.body.innerHTML=bdhtml;
}
