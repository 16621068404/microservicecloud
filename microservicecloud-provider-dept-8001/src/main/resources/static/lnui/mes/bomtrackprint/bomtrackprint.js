var ids;
$(function() {

	initTimePickYmd("receivingtime");
 // 为显示好看 按钮隐藏
    $("#printbarcodebutton").hide();
    ids = com.leanway.getFlagval();
    if(ids!=""&&ids!=null){
        searchResustByids();
    }


	com.leanway.loadTags();
	//com.leanway.checkSession();


	initSelect2("#centerid", "../../../"+ln_project+"/bomTrack?method=queryCenter&type=1", "搜索生产线");


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
/*$("#tracknumber").on("select2:select", function(e) {
	$("#tracknumbersearchnoView").val($(this).find("option:selected").text());
});*/



/**
 *
 * 查询物料追踪单数据
 *
 */
function searchResust() {

    var receivingtime = $("#receivingtime").val();
    if((receivingtime==null||receivingtime=="")){
		lwalert("tipModal", 1, "请填写备料日期");
		return;
	}

	var centerid = $("#centerid").val();
	if((centerid==null||centerid=="")){
		lwalert("tipModal", 1, "请选择生产线");
		return;
	}

	// 序列化form表单数据
	var form = $("#tracknumberPrintForm").serializeArray();
	var formData = formatFormJson(form);

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/bomtrackprint",
		data : {
			"method" : "selectbombracknumberprintlist",
			"formData" : formData
		},
		dataType : "text",
		async : false,
		success : function(data) {

            var flag =  com.leanway.checkLogind(data);

			if(flag){

				// ajax json数据解析
				var result = eval("(" + data + ")");

				if (result.bomtrackprints.length != 0) {

					setFormPrint(result.bomtrackprints);

				} else {
					$("#tableBody").empty();
					$("#printbarcodebutton").hide();
					lwalert("tipModal", 1, "无数据，请重新检查查询条件！");
				}
			}

		},
		error : function(data) {

			lwalert("tipModal", 1, "error！");
		}
	});
}

Array.prototype.unique3 = function(){
	 var res = [];
	 var json = {};
	 for(var i = 0; i < this.length; i++){
	  if(!json[this[i]]){
	   res.push(this[i]);
	   json[this[i]] = 1;
	  }
	 }
	 return res;
}
/**
 *
 * 根据物料单id的集合查询物料追踪单数据
 *
 */
var bomtrackMap=new Map();
function searchResustByids() {

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/bomtrackprint",
		data : {

		    "method" : "queryBomTrackList",
			"ids" : ids
		},
		dataType : "text",
		async : false,
		success : function(data) {
			
			// ajax json数据解析
			var result = eval("(" + data + ")");

			if (result.length != 0) {


			    appendHtml(result);

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

function appendHtml(bomtrack){
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
    var html="";
    html += "<table class='table table-bordered'>";
    html+="<tr bgcolor='#f4f4f4'><td><div id='barcode'>条码："+bomtrack[0].barcode+"</div></td><td colspan='3'>生产日期:"+bomtrack[0].adjuststarttime+"</td></tr>";

    for(var i=0;i<bomtrack.length;i++){

        if(i>0&&bomtrack[i].barcode!=bomtrack[i-1].barcode){
            html+="<tr bgcolor='#f4f4f4'><td><div id='barcode"+i+"'>条码："+bomtrack[i].barcode+"</div></td><td colspan='3'>生产日期:"+bomtrack[i].adjuststarttime+"</td></tr>";
        }
        html+="<tr>";
        html+="<td>物料编码<div>"+bomtrack[i].productorname+"</div></td>";
        html+="<td>物料名称<div>"+bomtrack[i].shortname+"</div></td>";
        html+="<td>数量<div>"+bomtrack[i].stockcount+"</div></td>";
        html+="<td>库存单位<div>"+bomtrack[i].countunit+"</div></td>";
        html+="</tr>"

    }
    html += " <tr>";
    html += "  <td> <span style='font-size:18px;'>审核人:</span></br></td>";
    html += "  <td style='font-size:18px;' colspan='3'> 制单人:"+bomtrack[0].username+"</br></td>";
    html += " </tr>";
    html+="</tr></table>";
    $("#printarea").html(html);
    $("#printbarcodebutton").show();
    $("#barcode").barcode(bomtrack[0].barcode, btype, settings);
    for ( var j in bomtrack) {
        var value = bomtrack[j].barcode;
        // 条码显示 后台传上id值 获取填值
        if(value!=null&&value!=""){
            $("#barcode"+j).barcode(value, btype, settings);
        }
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

	var m=1;
	tableBodyHtml += "<table class='table table-hover'>";
	tableBodyHtml += " <tr>";
		tableBodyHtml += "  <td> <span style='font-size:18px;'>生产日期:"+result[0].adjustendtime+"</span></br></td>";
		tableBodyHtml += "  <td style='font-size:18px;'> 生产线:"+result[0].centername+"</br></td>";
		tableBodyHtml += "  <td style='font-size:18px;'> 工序名称:"+result[0].proceduredesc+"</br></td>";
	tableBodyHtml += " </tr>";
		/*tableBodyHtml += "  <td style='font-size:18px;'> 工单产品:"+result[0].productorname+"</br></td>";
		tableBodyHtml += "  <td style='font-size:18px;'> 工单产品描述:"+result[0].productordesc+"</br></td>";*/
	tableBodyHtml += " <tr>";
	tableBodyHtml += " </tr>";
	tableBodyHtml += " </table>";
	for(var i=0;i<result.length;i++){
		if (i == 0) {
			tableBodyHtml += "<table class='table table-hover' >";
			tableBodyHtml += " <tr>";
			tableBodyHtml += "  <td width='10%'></br> 生产子查询号<br></br></td>";
			tableBodyHtml += "  <td width='10%'></br> 领用库房<br></br></td>";
			tableBodyHtml += "  <td width='15%'></br> 送往地<br></br></td>";
			tableBodyHtml += "  <td width='15%'></br> 送料时间<br></br></td>";

			tableBodyHtml += "  <td width='10%'> </br>物料编码<br></br></td>";
			tableBodyHtml += "  <td width='10%'></br> 物料名称<br></br></td>";
			tableBodyHtml += "  <td width='10%'> </br>数量<br></br></td>";
			tableBodyHtml += "  <td width='5%'> </br>单位<br></br></td>";
			tableBodyHtml += "  <td width='10%'> </br>备料单号<br></br></td>";
			tableBodyHtml += "  <td width='5%'> </br>库位<br></br></td>";
			tableBodyHtml += " </tr>";
		}
		if (i > 0) {
			if (i%6==0) {
				tableBodyHtml += "<tr>";
				tableBodyHtml += "  <td colspan='10' >";
				tableBodyHtml += "  </td>";
				tableBodyHtml += "  </tr></table>";

				tableBodyHtml += "<p style='page-break-after:always;'></p>";
				tableBodyHtml += "<table class='table table-hover'>";
				tableBodyHtml += " <tr>";
				tableBodyHtml += "  <td width='10%'></br> 生产子查询号<br></br></td>";
				tableBodyHtml += "  <td width='10%'></br> 领用库房<br></br></td>";
				tableBodyHtml += "  <td width='15%'></br> 送往地<br></br></td>";
				tableBodyHtml += "  <td width='10%'></br> 送料时间<br></br></td>";

				tableBodyHtml += "  <td width='10%'> </br>物料编码<br></br></td>";
				tableBodyHtml += "  <td width='10%'></br> 物料名称<br></br></td>";
				tableBodyHtml += "  <td width='10%'> </br>数量<br></br></td>";
				tableBodyHtml += "  <td width='5%'> </br>单位<br></br></td>";
				tableBodyHtml += "  <td width='10%'> </br>备料单号<br></br></td>";
				tableBodyHtml += "  <td width='5%'> </br>库位<br></br></td>";
				tableBodyHtml += " </tr>";
			}

		}

		tableBodyHtml += " <tr>";
		tableBodyHtml += "  <td width='10%'> <br>"+result[i].productionchildsearchno+"</br></td>";
		tableBodyHtml += "  <td width='10%'> <br></br></td>";
		if(result[i].centrtype=="机器"){

			tableBodyHtml += "  <td width='15%'><br> "+result[i].equipmentname+"</br></td>";
		}
		if(result[i].centrtype=="人工"){

			tableBodyHtml += "  <td width='15%'><br> "+result[i].centername+"</br></td>";
		}

		tableBodyHtml += "  <td width='15%'> <br>"+result[i].stocktime+"</br></td>";

		tableBodyHtml += "  <td width='15%'> <br>"+result[i].modulename+"</br></td>";
		tableBodyHtml += "  <td width='15%'> <br>"+result[i].moduledesc+"</br></td>";
		tableBodyHtml += "  <td width='10%'><br>"+result[i].stockcount+"</br></td>";
		tableBodyHtml += "  <td width='5%'><br>"+(result[i].countunit==null?'':result[i].countunit)+"</br></td>";
		//---new
		tableBodyHtml += "  <td width='10%' ><div id='barcode"+i+"'>"+result[i].tracknumber+"</div></td>";
		tableBodyHtml += "  <td width='5%'><br>"+result[i].warehouse+"</br></td>";
		tableBodyHtml += " </tr>";







		tableBodyHtml += " <tr>  <td colspan='10' > </td></tr>";

	}
	tableBodyHtml += "<table class='table table-hover'>";
	tableBodyHtml += " <tr>";
		tableBodyHtml += "  <td> <span style='font-size:18px;'>审核人:</span></br></td>";
		tableBodyHtml += "  <td style='font-size:18px;'> 制单人:"+result[0].username+"</br></td>";
	tableBodyHtml += " </tr>";
	tableBodyHtml += " <tr>";
	tableBodyHtml += " </tr>";
	tableBodyHtml += " </table>";
	$("#printarea").html(tableBodyHtml);
    $("#printbarcodebutton").show();
	for (var j in result) {

        var value =result[j].tracknumber;
        $("#barcode"+j).barcode(value, btype, settings);
    }
}
//需要打印的form表单填值

function setFormPrintByids(result,bomtrackMap){

	var arr =bomtrackMap.keys().unique3();
	var html="";
	for(var i=0;i<arr.length;i++){


		html+=searchResust2(arr[i]);

	}


	$("#printarea").html(html);
	$("#printbarcodebutton").show();

}


function searchResust2(num) {


	// 序列化form表单数据
	var form = $("#tracknumberPrintForm").serializeArray();
	var formData = formatFormJson(form);

	var html="";

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/bomtrackprint",
		data : {
			"method" : "selectbombracknumberprintlist",
			"formData" : num,
			"flag":"Y"
		},
		dataType : "text",
		async : false,
		success : function(data) {

            var flag =  com.leanway.checkLogind(data);

			if(flag){

				// ajax json数据解析
				var result = eval("(" + data + ")");

				if (result.bomtrackprints.length != 0) {

					html+=setFormPrint(result.bomtrackprints);

					 $("#printbarcodebutton").show();

				} else {
					$("#tableBody").empty();
					$("#printbarcodebutton").hide();
					lwalert("tipModal", 1, "无数据，请重新检查查询条件！");
				}
			}

		},
		error : function(data) {

			lwalert("tipModal", 1, "error！");
		}
	});


	return html;

}
//查询时 对前台操作的判断
function frontJudge() {
	var backValue = 0;
	var tracknumber = $("#tracknumber").val();
	if (tracknumber == null) {
		alert("查询条件不能为空");
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
//打印机打印
function printBarcode(){
	retainAttr=true;
	$("#printarea").printArea();
}
