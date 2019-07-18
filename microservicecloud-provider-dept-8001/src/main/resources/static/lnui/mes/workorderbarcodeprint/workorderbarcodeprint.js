

//页面打开时加载的数据
$(function() {
	//时间初始化
	com.leanway.initTimePickYmdForMoreId("#starttime");
	com.leanway.initTimePickYmdForMoreId("#endtime");

	com.leanway.loadTags();

	//select2 组件初始化
	initSelect2("#productionsearchno","../../../../"+ln_project+"/workorderbarcodeprint?method=queryProductionChildSearchNo", "搜索子生产查询号");
	//initSelect2("#productionsearchno","../../../../"+ln_project+"/workorderbarcodeprint?method=queryProductionsearchno", "搜索生产查询号");
	initSelect2("#groupid","../../../../"+ln_project+"/workorderbarcodeprint?method=queryWorkCenterGroup", "搜索工作中心组");

	/* var ui =document.getElementById("printbarcodebutton");
	    ui.style.visibility="hidden";*/
	/*$("#countview").hide();
	$("#printbarcodebutton").css('display', 'none');*/
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
$("#productionsearchno").on("select2:select", function(e) {
	$("#productionsearchnoView").val($(this).find("option:selected").text());
});
$("#groupid").on("select2:select", function(e) {
	$("#groupname").val($(this).find("option:selected").text());
});

/**
 *
 * 查询销售订单条码
 *
 * */
function searchResust(){
	if(!frontJudge()){

	}else{

		var modetype = com.leanway.getDataTableCheckIds("modetype");

		//序列化form表单数据
		var form  = $("#workOrderBarcodePrintForm").serializeArray();
		var formData = formatFormJson(form);

		//alert(form);
		//alert(formData);
		$.ajax ( {
			type : "post",
			url : "../../../../"+ln_project+"/workorderbarcodeprint",
			data : {
				"method":"selectSalesWorkOrderBarcodePrint",
				"formData" : formData,
				"modetype":modetype
			},
			dataType : "text",
			async : false,
			success : function ( data ) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					//ajax json数据解析
					var result = eval("(" + data + ")");

					if(result.workOrderBarcodePrints.length!=0){

						setFormPrint(result.workOrderBarcodePrints);
						$("#printbarcodebutton").show();
						$("#countview").show();
					}else {
						$("#tableBody").empty();
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


//需要打印的form表单填值
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
	for (var i in result) {

		var starttimeform=result[i].starttimeform;
		var endtimeform=result[i].endtimeform;
		if(starttimeform==null){
			starttimeform="";
		}
		if(endtimeform==null){
			endtimeform="";
		}

		if (i == 0) {
			tableBodyHtml += "<table class='table table-hover'>";
		}
		if (i > 0) {
			if (i%8==0) {
				tableBodyHtml += "<tr>";
				tableBodyHtml += "  <td colspan='7' >";
				tableBodyHtml += "  </td>";
				tableBodyHtml += "  </tr></table>";
				tableBodyHtml += "<p style='page-break-after:always;'></p>";
				tableBodyHtml += "<table class='table table-hover'>";
			}
		}
		tableBodyHtml += " <tr>";
		tableBodyHtml += "  <td width='120px'> 子查询号<br>"+result[i].productionchildsearchno+"</br></td>";
		tableBodyHtml += "  <td > 产品编码<br>"+result[i].productorname+"("+result[i].length+")"+"</td>";
		tableBodyHtml += "  <td width='160px'> 产品名称<br>"+result[i].shortname+"</br></td>";
		tableBodyHtml += "  <td width='80px'> 数量<br>"+result[i].number+"</td>";
		tableBodyHtml += "  <td width='100px'> 开始时间<br>"+starttimeform+"</br></td>";
		tableBodyHtml += "  <td width='100px'> 结束时间<br>"+endtimeform+"</br></td>";
		tableBodyHtml += "  <td width='150px' id='barcode" + i + "'> 条形码："+result[i].barcode+"</td>";
		tableBodyHtml += " </tr>";
		//tableBodyHtml += " <tr>  <td colspan='7' > </td></tr>";
	}
	$("#printarea").html(tableBodyHtml);
	$("#countData").html(result.length);
	for (var j in result) {
		var value =result[j].barcode;
		//条码显示  后台传上id值 获取填值
		$("#barcode"+j).barcode(value, btype, settings);
	}
}

//查询时  对前台操作的判断
function frontJudge(){
	var backValue=0;
	var starttime= $("#starttime").val();
	var endtime= $("#endtime").val();
	var productionsearchno=$("#productionsearchno").val();
	var groupid=$("#groupid").val();
	//if(productionsearchno==null||groupid==null){
	if(productionsearchno==null){
		lwalert("tipModal", 1, "查询条件不能为空！");

	}else if(endtime==null||endtime==""){
		backValue=1;
	}else if(starttime>endtime){

		lwalert("tipModal", 1, "开始时间不能大于结束时间！");

	}else backValue=1;
	return backValue;
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
