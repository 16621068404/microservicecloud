var clicktime = new Date();

var oTable;
// var bomTable;
// 页面打开时加载的数据
$(function() {



	com.leanway.loadTags();

	$("#printbarcodebutton").hide();

	//queryAllExceptionReason();
});



function queryAllExceptionReason() {

	showMask();

	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/exceptionreason",
		data : {
			"method" : "queryAllExceptionReason",
		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var result = eval("(" + data + ")");

				if (result.length != 0) {

					setFormPrint(result.data,result.length);
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
function setFormPrint(result,length) {

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
	    addQuietZone: "1"
	};

    $("#count").html("共<font color='red'>"+length+"</font>条数据");
    var html="";
    html+= "<table class='table table-striped table-bordered table-hover'>";
    html+="<tr>"
    for(var i=0;i<result.length;i++){

        if(i!=0&&i%3==0){
            html+="</tr>"
            html+="<tr>"
        }
        if (i!=0&&i%27==0) {
            html += "<tr>";
            html += "  <td colspan='10' >";
            html += "  </td>";
            html += "  </tr></table>";
            html += "<p style='page-break-after:always;'></p>";
            html += "<table class='table table-hover'>";
        }
        html+="<td align='center'>"
        html+=result[i].shortname+"<div id='barcode"+i+"'>"+result[i].barcode+"</div>"
        html+="</td>"


		$("#printarea").html(html);
		for ( var j in result) {
			var value = result[j].barcode;

			// 条码显示 后台传上id值 获取填值
			$("#barcode" + j).barcode(value, btype, settings);
		}

	}

	lengthHtml = "";
	lengthHtml += "<table class='table table-hover'>";
	lengthHtml += "<tr> <td align='right'>";
	lengthHtml +=" 总计"+length+"条数据";
	lengthHtml +=" </td> </tr>"
	lengthHtml += "</table>";
	//$("#count").html(lengthHtml);
	hideMask();
	//console.info(tableBodyHtml)
}

/**
 *
 * 查询销售订单条码
 *
 */
function searchResult() {

	var productionchildsearchno = $("#productionchildsearchno").val();
	oTable.ajax.url(
			"../../../../"+ln_project+"/picking?method=queryProductorOrderBySearchNo&productionchildsearchno="
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
function print() {
	retainAttr = true;
	$("#printarea").printArea();
}

function showMask(){
    $("#mask").css("height",$(document).height());
    $("#mask").css("width",$(document).width());
    $("#mask").show();
  }
  //隐藏遮罩层
  function hideMask(){

    $("#mask").hide();
  }