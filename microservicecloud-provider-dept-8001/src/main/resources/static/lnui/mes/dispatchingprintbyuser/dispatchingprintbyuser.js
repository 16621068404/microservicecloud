


$(function() {

	//时间初始化
	com.leanway.initTimePickYmdForMoreId("#starttime");
	com.leanway.initTimePickYmdForMoreId("#endtime");

	com.leanway.loadTags();
	var date = new Date();
	$("#starttime").val(date.Format("yyyy-MM-dd"));
	$("#endtime").val(date.Format("yyyy-MM-dd"));
	//select2  初始化
	initSelect2("#productionsearchno","../../../../"+ln_project+"/workorderbarcodeprint?method=queryDispatchOrder", "搜索子生产查询号");
//	initSelect2("#groupid","../../../../"+ln_project+"/workorderbarcodeprint?method=queryWorkCenterGroup", "搜索工作中心组");
//	queryWorkCenterGroup();
	queryWorkCenterByUser();
	//为显示好看  按钮隐藏
	$("#printbarcodebutton").hide();
	$("#countview").hide();
});

function queryWorkCenterByUser(){
	 $.ajax({
	        type : "post",
	        url : "../../../../"+ln_project+"/dispatchbarcodeprint",
	        data : {
	            "method" : "queryWorkCenterByUser",
	        },
	        dataType : "text",
	        async : false,
	        success : function(data) {

	            var flag =  com.leanway.checkLogind(data);

	            if(flag){
	                var result = eval("(" + data + ")");
	                if(result.status=="success"){
	                	$("#groupid").val(result.data.groupid);
	                	$("#personcenterid").val(result.data.centerid);
	                	queryArtEquipment();
	                	searchResust();
	                }else{
	    	            lwalert("tipModal", 1, result.info);
	                }
	                
	            }
	        },
	        error : function(data) {
	            lwalert("tipModal", 1, "error！");
	        }
	    });
}
function queryWorkCenterGroup(){
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/workCenterGroup",
        data : {
            "method" : "queryWorkCenterGroup",
        },
        dataType : "text",
        success : function(data) {

            var flag =  com.leanway.checkLogind(data);

            if(flag){
                var result = eval("(" + data + ")");
                var html='<option value="">-----工作组-----</option>';
                for(var i=0; i<result.length;i++){

                    html+='<option value="'+result[i].groupid+'">'+result[i].shortname+'</option>'
                }
                $("#groupid").html(html);
            }
        },
        error : function(data) {
            lwalert("tipModal", 1, "error！");
        }
    });
}

function queryWorkCenter(){

    var groupid = $("#groupid").val();

    var type=0;
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/workCenter",
        data : {
            "method" : "queryWorkCenterByGroup",
            "groupid":groupid,
            "type":type
        },
        dataType : "text",
        success : function(data) {

            var flag =  com.leanway.checkLogind(data);
            if(flag){
                $('#centerid').removeAttr("disabled");
                var result = eval("(" + data + ")");
                var html='<option value="">--机器工作中心--</option>';
                for(var i=0; i<result.length;i++){

                    html+='<option value="'+result[i].centerid+'">'+result[i].shorname+'</option>'

                }
                $("#centerid").html(html);
            }
        },
        error : function(data) {
            lwalert("tipModal", 1, "error！");
        }
    });
}
function queryArtWorkCenter(){
    var groupid = $("#groupid").val();
    var type=1;
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/workCenter",
        data : {
            "method" : "queryWorkCenterByGroup",
            "groupid":groupid,
            "type":type
        },
        dataType : "text",
        success : function(data) {
            var flag =  com.leanway.checkLogind(data);
            if(flag){
                $('#personcenterid').removeAttr("disabled");
                var result = eval("(" + data + ")");
                var html='<option value="">--人工工作中心--</option>';
                for(var i=0; i<result.length;i++){

                    html+='<option value="'+result[i].centerid+'">'+result[i].shorname+'</option>'

                }
                $("#personcenterid").html(html);
            }
        },
        error : function(data) {
            lwalert("tipModal", 1, "error！");
        }
    });
}

function queryEquipment(){
    var centerid = $("#centerid").val();
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/workCenter",
        data : {
            "method" : "queryEquipmentByCenterid",
            "centerid":centerid,
        },
        dataType : "text",
        success : function(data) {
            var flag =  com.leanway.checkLogind(data);
            if(flag){
                $('#equipmentid').removeAttr("disabled");
                var result = eval("(" + data + ")");
                var html='<option value="">--设备台账--</option>';
                for(var i=0; i<result.length;i++){

                    html+='<option value="'+result[i].equipmentid+'">'+result[i].equipmentname+'</option>'

                }
                $("#equipmentid").html(html);
            }
        },
        error : function(data) {
            lwalert("tipModal", 1, "error！");
        }
    });
}

function queryArtEquipment(){
    var centerid = $("#personcenterid").val();
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/workCenter",
        data : {
            "method" : "queryEquipmentByCenterid",
            "centerid":centerid,
        },
        dataType : "text",
        success : function(data) {
            var flag =  com.leanway.checkLogind(data);
            if(flag){
                $('#personequipmentid').removeAttr("disabled");
                var result = eval("(" + data + ")");
                var html='<option value="">--雇员--</option>';
                for(var i=0; i<result.length;i++){

                    html+='<option value="'+result[i].employeeid+'">'+result[i].equipmentname+'</option>'

                }
                $("#personequipmentid").html(html);
            }
        },
        error : function(data) {
            lwalert("tipModal", 1, "error！");
        }
    });
}
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
	var group = $("#groupid").val();
	if(group=='' || group ==null){
		lwalert("tipModal", 1, "请选择工作组！");
		return;
	}
	if (!frontJudge()) {

	} else {
		showMask("mask");
		//序列化form表单数据

		var form = $("#workOrderBarcodePrintForm").serializeArray();
//		var printstatus = $("input[name='printstatus']:checked").val();

	    var orderstatus='';
	    $('input[name="orderstatus"]:checked').each(function(){
	    	orderstatus += $(this).val() + ",";
		});
	    if(orderstatus != ''){
	    	orderstatus = orderstatus.substring(0,orderstatus.length-1);
	    }

		var printstatus ='';
		$('input[name="printstatus"]:checked').each(function(){
		    printstatus=$(this).val();
		});
//		var dispatchingstatus = $("input[name='dispatchingstatus']:checked").val();
		var dispatchingstatus = '';
		$('input[name="dispatchingstatus"]:checked').each(function(){
		    dispatchingstatus=$(this).val();
	    });
		var formData = formatFormJson(form);
		var productionsearchnos = $("#productionsearchno").val();
		var productionsearchno="";
		if(productionsearchnos!=null){
			for(var p = 0; p <productionsearchnos.length; p++){
				if(p<productionsearchnos.length-1){
					productionsearchno+=productionsearchnos[p] +",";
				}else{
					productionsearchno+=productionsearchnos[p]
				}

			}
		}
		$.ajax ( {
			type : "post",
			url : "../../../../"+ln_project+"/dispatchbarcodeprint",
			data : {
				"method":"selectDispatchBarcodeNew",
				"formData" : formData,
				"printstatus":printstatus,
		        "dispatchingstatus":dispatchingstatus,
		        "productionsearchno" : productionsearchno,
		        "orderstatus" : orderstatus

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
						if(result.barcode!=undefined){
							printid =result.barcode; 
							setFormPrint(result.orderList);
							generateQRCode("canvas",result.barcode,0);
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
	for(var i=0;i<result.length;i++){
		//获取选中的工作组 名称
		var groupname = $("#groupid option:checked").text();
		var starttimeform=result[i].starttimeform;
		var endtimeform=result[i].endtimeform;
		var drawcode = result[i].drawcode;
		var plength = result[i].length;
		if(drawcode==null || drawcode == ''){
			drawcode="";
		}else{
			drawcode = "("+drawcode+")";
		}
		if(plength==null || plength ==''){
			plength="";
		}else{

			plength = "("+plength+")";
		}
		if(starttimeform==null){
			starttimeform="";
		}
		if(endtimeform==null){
			endtimeform="";
		}
		
		if (i == 0) {
			tableBodyHtml += "<table width='100%'>";
			tableBodyHtml +="<tr><td align='left'><div id='qrcode0'  style='display:none'></div></td></tr>"
			tableBodyHtml +="<tr><td align='left'><div><img id='image0' src=''/></div></td>"
			tableBodyHtml +="<td valign='bottom'><div id='code0'> </div></td></tr>"
			tableBodyHtml += "</table>";
		//	tableBodyHtml += "<table width='100%' style='table-layout:fixed' class='table table-bordered table-hover'>";
			tableBodyHtml += "<table width='100%'  style='table-layout:fixed;  border-right:0px ;border-bottom:1px solid #000000; margin-top: 10px;'  >";
			

		}
		if(i == 9){
			tableBodyHtml += "  </table>";
			tableBodyHtml += "<p style='page-break-after:always;'></p>";
			tableBodyHtml += "<table width='100%'  style='table-layout:fixed;  border-right:0px ;border-bottom:1px solid #000000; margin-top: 25px;'  >";
		}
		if (i > 9) {
			if ((i+2)%11==0) {
//				tableBodyHtml += "<tr>";
//			/*	tableBodyHtml += "  <td colspan='7' >";
//				tableBodyHtml += "  </td>";*/
//				tableBodyHtml += "  </tr></table>";
				tableBodyHtml += "  </table>";
				tableBodyHtml += "<p style='page-break-after:always;'></p>";
				tableBodyHtml += "<table width='100%'  style='table-layout:fixed;  border-right:0px ;border-bottom:1px solid #000000; margin-top: 25px;'  >";
			}
		}
		if(groupname.indexOf("下料")!=-1){

			tableBodyHtml += " <tr  >";
			//tableBodyHtml += "  <td>类别："+m+"</td>";
			tableBodyHtml += "  <td width='8%' style='border-left:1px solid #000000;border-top:1px solid #000000'> "+result[i].equipmentname+"</br></td>";
			tableBodyHtml += "  <td width='15%' style='border-left:1px solid #000000;border-top:1px solid #000000'> "+result[i].dispatchingnumber+"</br>"+result[i].productionsearchno+"("+result[i].topproductorname+")"+"</td>";
			tableBodyHtml += "  <td width='14%' style='border-left:1px solid #000000;border-top:1px solid #000000'> "+result[i].parentproductorname+"</br>"+result[i].parentdrawcode+"</td>";
			tableBodyHtml += "  <td style='border-left:1px solid #000000;border-top:1px solid #000000'> "+result[i].productorname+"("+result[i].specification+")"+"</br>"+drawcode+""+plength+""+"</td>";
			if((result[i].shortname).length>8){
				tableBodyHtml += "  <td width='14%' style='border-left:1px solid #000000;border-top:1px solid #000000'> "+result[i].shortname+"&nbsp;"+result[i].number+"("+result[i].unitsname+")"+"</td>";

			}else{
				tableBodyHtml += "  <td width='14%' style='border-left:1px solid #000000;border-top:1px solid #000000'> "+result[i].shortname+"</br>"+result[i].number+"("+result[i].unitsname+")"+"</td>";

			}

			tableBodyHtml += "  <td width='13%' style=' border-left:1px solid #000000;border-top:1px solid #000000'> "+starttimeform+"</br>"+endtimeform+"</td>";
			tableBodyHtml += "  <td width='17%' style='padding-top:1px;  border-left:1px solid #000000;border-top:1px solid #000000'> <div id='barcode"+i+"'>"+result[i].orderbarcode+"</div></td>";
			tableBodyHtml += " </tr>";
		}else {// 非下料件

			tableBodyHtml += " <tr  >";
			//tableBodyHtml += "  <td>类别："+m+"</td>";
			tableBodyHtml += "  <td width='8%'  style='border-left:1px solid #000000;border-top:1px solid #000000'> "+result[i].equipmentname+"</br></td>";
			tableBodyHtml += "  <td width='15%' style='border-left:1px solid #000000;border-top:1px solid #000000'>"+result[i].dispatchingnumber+"</br>"+result[i].productionsearchno+"("+result[i].topproductorname+")"+"</td>";
			tableBodyHtml += "  <td width='14%' style='border-left:1px solid #000000;border-top:1px solid #000000'> "+result[i].productorname+"("+result[i].specification+")"+"</br>"+drawcode+""+plength+""+"</td>";

			tableBodyHtml += "  <td width='17%' style='border-left:1px solid #000000;border-top:1px solid #000000'> "+result[i].shortname+"</br>"+result[i].number+"("+result[i].unitsname+")"+"</td>";

			tableBodyHtml += "  <td width='13%' style='border-left:1px solid #000000;border-top:1px solid #000000'> "+starttimeform+"</br>"+endtimeform+"</td>";
			tableBodyHtml += "  <td width='17%' style='padding-top:1px; border-left:1px solid #000000;border-top:1px solid #000000'> <div id='barcode"+i+"'>"+result[i].orderbarcode+"</div></td>";
			tableBodyHtml += " </tr>";
		}

//		tableBodyHtml += " <tr>  <td colspan='7' > </td></tr>";
		/*if(i<result.length-1){
			//按工作中心下的台账分类别  打印方便员工裁剪
			if(result[i].equipmentname!=result[i+1].equipmentname){
				m=m+1;
				tableBodyHtml += " <tr>  <td colspan='7' > </td></tr>";
			}
		}*/
		
        
	}
	$("#printarea").html(tableBodyHtml);
	$("#countData").html(result.length);

	var len = result.length;
	for (var j in result) {
		
		var value =result[j].orderbarcode;
		$("#barcode"+j).barcode(value, btype, settings);	

		
	}
	alert
	if(printid!=""){
		$("#code0").barcode(printid, btype, settings);
	}
	
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
	var starttime= $("#starttime").val();
	var endtime= $("#endtime").val();
	if (starttime == null || starttime == "") {
        lwalert("tipModal", 1, "请填写开始时间！");
    }else if(endtime==null||endtime==""){
		lwalert("tipModal", 1, "请填写结束时间");
	}else if(starttime>endtime){
		lwalert("tipModal", 1, "开始时间不能大于结束时间");
	}else
		backValue=true;
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
	lwalert("tipModal", 2, "您确定已打印成功?","updateDispatchPrintStatus()");
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
