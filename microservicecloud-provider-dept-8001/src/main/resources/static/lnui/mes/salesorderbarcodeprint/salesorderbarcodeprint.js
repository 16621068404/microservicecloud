


$(function() {
	//时间初始化
	//initDateTimeYmdHms("#starttime");
	//initDateTimeYmdHms("#endtime");
	com.leanway.initTimePickYmdForMoreId("#starttime");
	com.leanway.initTimePickYmdForMoreId("#endtime");
	com.leanway.loadTags();

	initSelect2("#companionid","../../../../"+ln_project+"/salesorderbarcodeprint?method=selectCompanioname", "搜索客户");
	initSelect2("#contractid","../../../../"+ln_project+"/salesorderbarcodeprint?method=selectContractno", "搜索合同号");
	$("#printbarcodebutton").hide();
	$("#countview").hide();
});

//初始化select2,
/**
 * id: 为要操作的对象 url: url text: 要在select中显示的文本
 */
function initSelect2(id, url, text) {
	$(id).select2({
		placeholder : text,
		allowClear: true,
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

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					params.page = params.page || 1;
					return {
						results : data.items,
						pagination : {
							more : (params.page * 30) < data.total_count
						}
					};
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
//触发select2选择事件，给隐藏域赋值
$("#companionid").on("select2:select", function(e) {
	$("#companioname").val($(this).find("option:selected").text());
});
$("#contractid").on("select2:select", function(e) {
	$("#contractno").val($(this).find("option:selected").text());
});

/**
 *
 * 查询销售订单条码
 *
 * */
function searchResust(){
	if(!frontJudge()){
	}else{
	    showMask("mask");
		var form  = $("#salesOrderBarcodePrintForm").serializeArray();
		var formData = formatFormJson(form);

		$.ajax ( {
			type : "post",
			url : "../../../../"+ln_project+"/salesorderbarcodeprint",
			data : {
				"method":"selectSalesOrderBarcodePrint",
				"formData" : formData
			},
			dataType : "text",
			async : false,
			success : function ( data ) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){
				    hideMask("mask");
					var result = eval("(" + data + ")");

					if(result.salesOrderBarcodePrints.length!=0){

						setFormPrint(result.salesOrderBarcodePrints);
						$("#printbarcodebutton").show();
						$("#countview").show();
					}else {
						resetForm();
						$("#printbarcodebutton").hide();
						$("#countview").hide();
						lwalert("tipModal", 1, "无数据，请重新检查查询条件！");
					}

				}

			},
			error : function ( data ) {

				lwalert("tipModal", 1, "error！");
			}
		});
	}
}

function setFormPrint(result){
	var btype = "code128";
	var settings = {
			output:"css",
			bgColor: "#FFFFFF",
			color: "#000000",
			barHeight: "50" ,
			moduleSize: "5",
			posX: "10",
			posY: "20",
			addQuietZone: "1"
	};
	var tableBodyHtml = "";
	if (i == 0) {
		tableBodyHtml += "<table class='table table-hover'>";
	}
	if (i > 0) {
		if (i%5==0) {
			tableBodyHtml += "<tr>";
			tableBodyHtml += "  <td colspan='4' >";
			tableBodyHtml += "  </td>";
			tableBodyHtml += "  </tr></table>";
			tableBodyHtml += "<p style='page-break-after:always;'></p>";
			tableBodyHtml += "<table class='table table-hover'>";
		}
	}
	for (var i in result) {
		tableBodyHtml += " <tr>";
		tableBodyHtml += "  <td> 销售订单号："+result[i].code+"</td>";
		/*tableBodyHtml += "  <td> 产品编码："+result[i].productorname+"</td>";  */
		tableBodyHtml += "  <td> 合同编号："+result[i].contractno+"</td>";
		tableBodyHtml += "  <td> 合同名称："+result[i].contractname+"</td>";
		tableBodyHtml += "  <td id='barcode" + i + "'> 条形码："+result[i].barcode+"</td>";
		tableBodyHtml += " </tr>";
		tableBodyHtml += " <tr>  <td colspan='4'> </td>  </tr>";
	}
	$("#tableBody").html(tableBodyHtml);
	$("#countData").html(result.length);
	for (var j in result) {
		var value =result[j].barcode;
		$("#barcode"+j).barcode(value, btype, settings);
	}
}


//页面值判断
function frontJudge(){
	var backValue=0;
	var companionid=$("#companionid").val();
	var contractid=$("#contractid").val();
	var starttime= $("#starttime").val();
	var endtime= $("#endtime").val();
	if(companionid==null||contractid==null){
//		alert("查询条件不能为空");
	    lwalert("tipModal", 1, "查询条件不能为空！");
	}else if(endtime==null||endtime==""){
		backValue=1;
	}else if(starttime>endtime){
//		alert("开始时间不能大于结束时间");
	    lwalert("tipModal", 1, "开始时间不能大于结束时间！");
	}else backValue=1;
	return backValue;
}

var resetForm = function ( ) {
	/*$( '#salesOrderBarcodePrintForm' ).each( function ( index ) {
		$('#salesOrderBarcodePrintForm')[index].reset( );
	});*/
	$("#tableBody").empty();
}

//格式化form数据
var formatFormJson = function(formData) {
	var reg = /,$/gi;
	var data = "{";
	for (var i = 0; i < formData.length; i++) {
		var tempVal =  formData[i].value;

		if (formData[i].name == "ledgerVal") {
			data += "\"" + formData[i].name + "\" : " + formData[i].value + ",";
		} else {
			data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
		}

	}
	data = data.replace(reg, "");
	data += "}";
	return data;
}


//打印机打印
function printBarcode(){
	retainAttr=true;
	$("#printarea").printArea();
}

