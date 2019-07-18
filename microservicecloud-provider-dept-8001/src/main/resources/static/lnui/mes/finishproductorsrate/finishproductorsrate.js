$(function() {
	//com.leanway.checkSession();
	// 初始化对象
	com.leanway.loadTags();
    getYear();
    $("#saveOrUpdate").attr("disabled",true);
})



function getChartByProductorId(){
	//com.leanway.checkSession();
	showMask()
	var reg=/,$/gi;
	var info = "[";
	var selectyear = document.getElementsByName("selectyear");
	var sendcount = document.getElementsByName("sendcount");
	var unsendcount = document.getElementsByName("unsendcount");
	var date = new Date();
	var year = date.getFullYear();
	var year2 = $("#year").val();
	for(var i=0;i<year-year2;i++){
		if(sendcount[i].value==""||sendcount[i].value==null){
			sendcount[i].value=0;
		}
		if(unsendcount[i].value==""||unsendcount[i].value==null){
			unsendcount[i].value=0;
		}
		info += "{\"selectyear\" : \""+selectyear[i].value+"\",\"sendcount\" : \""+sendcount[i].value+"\",\"unsendcount\" : \""+unsendcount[i].value+"\"}," ;
	}
	info = info.replace(reg,"");
	info += "]";
	$('#countinfo').val(info);

	var form  = $("#chartForm").serializeArray();
	var formData = formatFormJson(form);
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/finishProductorsRate",
		data : {

			"method" : "queryChartByProductorId",
			 "formData":formData
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var temp = $.parseJSON(data);
					FusionCharts.ready(function () {
						var analysisChart = new FusionCharts({
							type: 'mscolumn3dlinedy',
							renderAt: 'finishproductors-container',
							width:changeWidth("finishproductors-container"),
							height: changeHeigth(),
							dataFormat: 'json',
							dataSource:temp
						}).render();
						hideMask();
					});

			}
		}
	});
}


function getYear(){
	var date = new Date();
	var year = date.getFullYear();
	var html = "";
	for(var i=year;i>year-16;i--){

			html += "<option value=" + i + ">" + i
					+ "</option>";
		}
	$("#year").html(html);
	return
}

function saveShipment(){
	var reg=/,$/gi;
	var info = "[";
	var selectyear = document.getElementsByName("selectyear");
	var sendcount = document.getElementsByName("sendcount");
	var unsendcount = document.getElementsByName("unsendcount");
	for(var i=0;i<selectyear.length;i++){
		info += "{\"year\" : \""+selectyear[i].value+"\",\"shipment\" : \""+sendcount[i].value+"\",\"notshipment\" : \""+unsendcount[i].value+"\"}," ;
	}
	info = info.replace(reg,"");
	info += "]";
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/finishProductorsRate",
		data : {

			"method" : "saveShipment",
			 "formData":info
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var temp = $.parseJSON(data);
				lwalert("tipModal",1,temp.info);

			}
		}
	});
}

function getChart(){
	var html = "";
	var str = '';
	$("#saveOrUpdate").attr("disabled",false);
	// 拼接选中的checkbox
		var date = new Date();
		var year = date.getFullYear();
		var year2 = $("#year").val();
		if(year!=year2){
			for(var i=0;i<parseInt(year)-parseInt(year2);i++){
			    html+="<div class='form-group'>";
				html+="<label class='col-sm-2 control-label' for='year"+i+"'>年份</label>" +
						"<div class='col-sm-2 '><input class='form-control' id='year"+i+"' name='selectyear' type='text' value='"+(parseInt(year2)+i)+"' readonly='readonly'/></div>" +
				"<label class='col-sm-2 control-label' for='sendcount'"+i+"'>出货数</label>" +
				"<div class='col-sm-2 '>"+
					"<input class='form-control' id='sendcount"+i+"' name='sendcount' type='text' placeholder='出货总数' />" +
				"</div>" +
				"<label class='col-sm-2 control-label' for='unsendcount"+i+"'>未出货数</label>" +
				"<div class='col-sm-2 '>" +
					"<input class='form-control' id='unsendcount"+i+"' name='unsendcount' type='text' placeholder='未出货总数' />" +
				"</div></div>"
			}
			$("#info").html(html);
		$.ajax ( {
			type : "post",
			url : "../../../../"+ln_project+"/finishProductorsRate",
			data : {

				"method" : "queryShipmentList",
				 "year":year2
			},
			dataType : "text",
			async : false,
			success : function ( data ) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					var temp = $.parseJSON(data);
					for(var i = 0;i<temp.length;i++){
						for(var j=0;j<parseInt(year)-parseInt(year2);j++){
						if(temp[i].year==$("#year"+j).val()){
							$("#sendcount"+j).val(temp[i].shipment);
							$("#unsendcount"+j).val(temp[i].notshipment);
						}
						}
					}

				}
			}
		});
		}else{
			$("#info").html("");
		}

}


var width;
function changeWidth(id) {

	if($(window).width()<768){
		width=$("#"+id).width()*(9/10)
	}else{
		width=$("#"+id).width()*(14/15)
	}

	return width;
}
function changeHeigth() {


	return width*(3/4);
}

var formatFormJson = function(formData) {
	var reg = /,$/gi;
	var data = "{";
	for (var i = 0; i < formData.length; i++) {
		if(formData[i].name == "countinfo"){
			data += "\"" + formData[i].name + "\" : " + formData[i].value + ",";
		}else{
			data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
		}
	}
	data = data.replace(reg, "");
	data += "}";
	return data;
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