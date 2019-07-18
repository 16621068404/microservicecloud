


$(function() {

	//时间初始化
	com.leanway.initTimePickYmdForMoreId("#starttime");
	com.leanway.initTimePickYmdForMoreId("#endtime");

	com.leanway.loadTags();
	var date = new Date();
	date.add("d",1);
	$("#starttime").val(date.Format("yyyy-MM-dd"));
	$("#endtime").val(date.Format("yyyy-MM-dd"));
	//select2  初始化
	initSelect2("#productionchildsearchno","../../../../"+ln_project+"/mobileTicketPrint?method=queryDispatchOrder", "搜索子生产查询号",1);
    initSelect2("#contractnumber","../../../../"+ln_project+"/mobileTicketPrint?method=queryDispatchOrder", "搜索合同号",2);
    initSelect2("#productorname","../../../../"+ln_project+"/mobileTicketPrint?method=queryDispatchOrder", "搜索产品编码",3);
    initSelect2("#productordesc","../../../../"+ln_project+"/mobileTicketPrint?method=queryDispatchOrder", "搜索产品名称",4);
//	initSelect2("#groupid","../../../../"+ln_project+"/workorderbarcodeprint?method=queryWorkCenterGroup", "搜索工作中心组");
// 	queryWorkCenterGroup();
	//为显示好看  按钮隐藏
	$("#printbarcodebutton").hide();
	$("#countview").hide();

});

//初始化select2,
/**
 * id: 为要操作的对象 url: url text: 要在select中显示的文本
 */
function initSelect2(id, url, text, typeCode) {
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
					pageSize : 10,
					type : typeCode
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
$("#productionsearchno").on("select2:select", function(e) {
	$("#productionsearchnoView").val($(this).find("option:selected").text());
});
$("#groupid").on("select2:select", function(e) {
	$("#groupname").val($(this).find("option:selected").text());
});

/**
 *
 * 查询派工单条码
 *
 * */

var searchResult;
var printid="";
function searchResust(){
	// var group = $("#groupid").val();

	// if(group=='' || group ==null){
	// 	lwalert("tipModal", 1, "请选择工作组！");
	// 	return;
	// }
	if (!frontJudge()) {

	} else {
		showMask("mask");
		//序列化form表单数据

		var form = $("#workOrderBarcodePrintForm").serializeArray();
		var formData = formatFormJson(form);
		$.ajax ( {
			type : "post",
			url : "../../../../"+ln_project+"/mobileTicketPrint",
			data : {
				"method":"selectMobileTicket",
				"formData" : formData
			},
			dataType : "text",
//			async : false,
			success : function ( data ) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){
					//hideMask("mask");
					//ajax json数据解析
					var result = eval("(" + data + ")");
					searchResult=JSON.stringify(result.orderList);

					if(result.orderList.length!=0){
						if(result.orderList[0].barcode!=undefined){
							setFormPrint(result.orderList[0]);
							generateQRCode("canvas",result.orderList[0].barcode,0);
							var img = document.getElementById("image0"); /// get image element
							var canvas  = document.getElementsByTagName("canvas")[0];
							img.src = canvas.toDataURL()
						}

						$("#printbarcodebutton").show();
						$("#countview").show();
						hideMask("mask");
					}else {
						$("#printarea").html("");

						$("#printbarcodebutton").hide();
						$("#countview").hide();
						lwalert("tipModal", 1, "无数据，请重新检查查询条件！");
						hideMask("mask");
					}

				}

			},
			error : function ( data ) {
				hideMask("mask");
				lwalert("tipModal", 1, "error！");
			}
		});
	}
}
function toUtf8(str) {
	   var out, i, len, c;
	   out = "";
	   len = str.length;
	   for(i = 0; i < len; i++) {
	       c = str.charCodeAt(i);
	       if ((c >= 0x0001) && (c <= 0x007F)) {
	           out += str.charAt(i);
	       } else if (c > 0x07FF) {
	           out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
	           out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
	           out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
	       } else {
	           out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
	           out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
	       }
	   }
	   return out;
	   }
function generateQRCode(rendermethod,url,i) {
	url = toUtf8(url)
    $("#qrcode"+i).qrcode({
        render: rendermethod, // 渲染方式有table方式（IE兼容）和canvas方式
        text: url, //内容
        height : 128,
        width : 128
    });
}

//需要打印的form表单填值
function setFormPrint(result){
	var btype = "code128";
	var settings = {
			output:"css",
			bgColor: "#FFFFFF",
			color: "#000000",
			barHeight: "40" ,
			moduleSize: "5",
			posX: "10",
			posY: "20",
			addQuietZone: "1"
	};
	var tableBodyHtml = "";
	var m=1;
	for(var i=0;i<result.processes.length;i++){
        var productionchildsearchno = result.productionchildsearchno ? result.productionchildsearchno:"";
        var drawcode = result.drawcode ? result.drawcode:"";
        var number = result.number ? result.number:"";
        var count = result.processes[i].count ? result.processes[i].count:"";
        var centername = result.processes[i].centername ? result.processes[i].centername:"";
        var productordesc = result.productordesc ? result.productordesc:"";
        var line = result.processes[i].line ? result.processes[i].line:"";
        var adjustendtime = result.processes[i].adjustendtime ? result.processes[i].adjustendtime:"";
        var dispatchingnumber = result.processes[i].dispatchingnumber ? result.processes[i].dispatchingnumber:"";
        var procedurename = result.processes[i].procedurename ? result.processes[i].procedurename:"";

        var length = result.processes.length-1;
        var endtime = result.processes[length].adjustendtime ? result.processes[length].adjustendtime:"";
        var productionnumber = result.processes[length].productionnumber ? result.processes[length].productionnumber:"";

		if (i == 0) {
			tableBodyHtml += "<table width='100%' style='font-size:15px;'>";
			tableBodyHtml +="<tr><td align='left'><div id='qrcode0'  style='display:none'></div></td></tr>"
			tableBodyHtml +="<tr><td align='left' style='width: 600px'><div style='float: left'><img id='image0' src=''/></div>  <div style='margin-left: 50px;margin-top: 30px;float: left'>" +
				"<span id='productioncode'>生产批次：" + productionchildsearchno + "</span><br><span>品&nbsp&nbsp名：" + productordesc + "</span><br><span>生产单号："+productionnumber+"</span><br>" +
				"<span>图&nbsp&nbsp号："+drawcode+"</span><br><span>发货交期：" + endtime + "</span></div></td>"
			tableBodyHtml +="<td valign='bottom'><div id='code0' style='margin-bottom: 20px'> </div></td></tr>"
			tableBodyHtml += "</table>";

			tableBodyHtml += "<table width='100%'  style='table-layout:fixed;  border-right:0px ;border-bottom:1px solid #000000; margin-top: 10px; font-size:15px;'  >";
			tableBodyHtml += " <tr  >";
			// tableBodyHtml += "  <th width='9%' style='border-left:1px solid #000000;border-top:1px solid #000000'>生产批次</th>";
			// tableBodyHtml += "  <th width='8%' style='border-left:1px solid #000000;border-top:1px solid #000000'>品名</th>";
			tableBodyHtml += "  <th width='10%' style='border-left:1px solid #000000;border-top:1px solid #000000'>派工单号</th>";

			tableBodyHtml += "  <th width='5%' style='border-left:1px solid #000000;border-top:1px solid #000000'>数量</th>";

			tableBodyHtml += "  <th width='5%' style='border-left:1px solid #000000;border-top:1px solid #000000'>工序号</th>";
            tableBodyHtml += "  <th width='10%' style='border-left:1px solid #000000;border-top:1px solid #000000'>工序名称</th>";
			tableBodyHtml += "  <th width='14%' style='padding-top:1px; border-left:1px solid #000000;border-top:1px solid #000000'>部门</th>";
            tableBodyHtml += "  <th width='14%' style='padding-top:1px; border-left:1px solid #000000;border-top:1px solid #000000'>工序交期</th>";
            tableBodyHtml += "  <th width='14%' style='padding-top:1px; border-left:1px solid #000000;border-top:1px solid #000000;border-right:1px solid #000000'>实际成绩</th>";
			tableBodyHtml += " </tr>";

		}

			tableBodyHtml += " <tr  >";
			// tableBodyHtml += "  <td width='9%' style='border-left:1px solid #000000;border-top:1px solid #000000'>"+productionchildsearchno+"</td>";
			// tableBodyHtml += "  <td width='8%' style='border-left:1px solid #000000;border-top:1px solid #000000'>"+productordesc+"</td>";
        tableBodyHtml += "  <td width='10%' style='border-left:1px solid #000000;border-top:1px solid #000000'> "+dispatchingnumber+"</td>";

			tableBodyHtml += "  <td width='5%' style='border-left:1px solid #000000;border-top:1px solid #000000'> "+count+"</td>";

      	  	tableBodyHtml += "  <td width='5%' style='border-left:1px solid #000000;border-top:1px solid #000000'> "+line+"</td>";
      	  	tableBodyHtml += "  <td width='10%' style='border-left:1px solid #000000;border-top:1px solid #000000'> "+procedurename+"</td>";
        	tableBodyHtml += "  <td width='10%' style='border-left:1px solid #000000;border-top:1px solid #000000'> "+centername+"</td>";
        	tableBodyHtml += "  <td width='10%' style='border-left:1px solid #000000;border-top:1px solid #000000'> "+adjustendtime+"</td>";
        	tableBodyHtml += "  <td width='10%' style='border-left:1px solid #000000;border-top:1px solid #000000;border-right:1px solid #000000'> "+ "" +"</td>";
			tableBodyHtml += " </tr>";

			if (i == length){
                tableBodyHtml += " </table>";
			}
	}
	$("#printarea").html(tableBodyHtml);
	$("#countData").html(result.length);

    $("#code0").barcode(result.barcode, btype, settings);
}


function CheckClick(self)

{

 var printstatus0 = document.getElementById("printstatus0");

 var printstatus1 = document.getElementById("printstatus1");
// printstatus0.checked = false;
//
// printstatus1.checked = false;
// if(self.checked){
//     self.checked = true;
// }else{
//     self.checked = false;
// }
if(self.id=='printstatus0'){
    if(!printstatus0.checked){
        printstatus0.checked = false;
    }else{
        printstatus0.checked = true;
        printstatus1.checked = false;
    }
}else{
    if(!printstatus1.checked){
        printstatus1.checked = false;
    }else{
        printstatus1.checked = true;
        printstatus0.checked = false;
    }
}


}
function CheckClick2(self)

{

 var dispatchingstatus0 = document.getElementById("dispatchingstatus0");

 var dispatchingstatus1 = document.getElementById("dispatchingstatus1");

// dispatchingstatus0.checked = false;
//
// dispatchingstatus1.checked = false;
//
// if(self.checked){
//     self.checked = false;
// }else{
//     self.checked = true;
// }
 if(self.id=="dispatchingstatus0"){
     if(!dispatchingstatus0.checked){
         dispatchingstatus0.checked = false;
     }else{
         dispatchingstatus0.checked = true;
         dispatchingstatus1.checked = false;
     }
 }else{
     if(!dispatchingstatus1.checked){
         dispatchingstatus1.checked = false;
     }else{
         dispatchingstatus1.checked = true;
         dispatchingstatus0.checked = false;
     }
 }

}
//查询时  对前台操作的判断
function frontJudge(){
	var backValue = false;
	// var starttime= $("#starttime").val();
	// var endtime= $("#endtime").val();
	// if (starttime == null || starttime == "") {
    //     lwalert("tipModal", 1, "请填写开始时间！");
    // }else if(endtime==null||endtime==""){
	// 	lwalert("tipModal", 1, "请填写结束时间");
	// }else if(starttime>endtime){
	// 	lwalert("tipModal", 1, "开始时间不能大于结束时间");
	// }else
	// 	backValue=true;
    var cx = $("#productionchildsearchno").val();
    var name = $("#productorname").val();
    if (cx == null || cx == ""){
        lwalert("tipModal", 1, "请填写查询号！");
	} else if (name == null || cx == "") {
        lwalert("tipModal", 1, "请填写产品编码！");
	} else {
        backValue=true;
    }
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
	// lwalert("tipModal", 2, "您确定已打印成功?","updateDispatchPrintStatus()");
}

function updateDispatchPrintStatus(){
    var result = "{\"dispatchbarcodelist\":"+searchResult+"}"
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/dispatchbarcodeprint",
        data : {
            "method" : "updateDispatchPrintStatus",
            "formData" : result,
            "printid":printid,
        },
        dataType : "text",
        success : function(data) {
        },
        error : function(data) {
            lwalert("tipModal", 1, "error！");
        }
    });
}
