
$(function() {

	// 时间初始化
	com.leanway.initTimePickYmdForMoreId("#starttime");
	com.leanway.initTimePickYmdForMoreId("#endtime");

	com.leanway.loadTags();
	// select2 初始化
//	initSelect2("#productionsearchno",
//			"../../workorderbarcodeprint?method=queryDispatchOrder", "搜索子生产查询号");
//	initSelect2("#groupid",
//			"../../workorderbarcodeprint?method=queryWorkCenterGroup",
//	"搜索工作中心组");
	var date = new Date();
	date.add("d",1);
	$("#starttime").val(date.Format("yyyy-MM-dd"));
	$("#endtime").val(date.Format("yyyy-MM-dd"));
	initSelect2("#productionsearchno", "../../../../"+ln_project+"/workorderbarcodeprint?method=queryDispatchOrder", "搜索子生产查询号");
//	"#productionorderid","../../workorderbarcodeprint?method=queryDispatchOrder", "搜索子生产查询号"
	queryWorkCenterGroup();
	// 为显示好看 按钮隐藏
	$("#printBarcode").hide();
	$("#countview").hide();
//	viewIframeToPage();
});
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
//$("#productionsearchno").on("select2:select", function(e) {
//	$("#productionsearchnoView").val($(this).find("option:selected").text());
//});
//$("#groupid").on("select2:select", function(e) {
//	$("#groupname").val($(this).find("option:selected").text());
//});

function viewIframeToPage(){
	if (!frontJudge()) {

	} else {
	    $("#viewiframe").empty();
		var div = document.getElementById("viewiframe");
		var iframe = document.createElement("iframe");
		//iframe.setAttribute("src","test.html");
		iframe.src = 'windowHtml.html';
		iframe.id = 'tableIframe';
		iframe.name = 'tableIframe';
		iframe.scrolling = 'yes';
		iframe.allowtransparency = 'yes';
		iframe.style.width = "100%";
		iframe.style.height = changeSize()+"px";
		iframe.style.border = "none";
		div.appendChild(iframe);
	}
}

/**
 *
 * 查询派工单条码
 *
 */
var searchResult;
function searchResust() {
    showMask();

    var orderstatus='';
    $('input[name="orderstatus"]:checked').each(function(){
    	orderstatus += $(this).val() + ",";
	});
    if(orderstatus != ''){
    	orderstatus = orderstatus.substring(0,orderstatus.length-1);
    }
	// 序列化form表单数据
	var form = $("#workOrderBarcodePrintForm").serializeArray();
//	var printstatus = $("input[name='printstatus']:checked").val();
	var printstatus ='';
	$('input[name="printstatus"]:checked').each(function(){
	    printstatus=$(this).val();
	});
//	var dispatchingstatus = $("input[name='dispatchingstatus']:checked").val();
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



	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/dispatchbarcodeprint",
		data : {
			"method" : "selectDispatchBarcodeNew",
			"formData" : formData,
			"printstatus":printstatus,
	        "dispatchingstatus":dispatchingstatus,
	        "productionsearchno" : productionsearchno,
	        "orderstatus" : orderstatus
		},
		dataType : "text",
		success : function(data) {
		    searchResult=data;
			var flag =  com.leanway.checkLogind(data);

			if(flag){
				// ajax json数据解析
				var result = eval("(" + data + ")");
				if (result.length != 0) {

			//		setFormPrint(result.dispatchBarcodePrints);
					tableIframe.window.setFormPrint(result);
					$("#printBarcode").show();
					$("#countview").show();
				    hideMask();
				} else {
					$("#viewiframe").html("");
					$("#printBarcode").hide();
					$("#countview").hide();
					lwalert("tipModal", 1, "无数据，请重新检查查询条件！");
				    hideMask();
				}

			}
		    hideMask();
		},
		error : function(data) {
		    hideMask();
			lwalert("tipModal", 1, "error！");
		}
	});
}


//查询时 对前台操作的判断
function frontJudge() {
	var backValue = false;
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	var groupid = $("#groupid").val();
	if (starttime == null || starttime == "") {
        lwalert("tipModal", 1, "请填写开始时间！");
    }else if (endtime == null || endtime == "") {
	    lwalert("tipModal", 1, "请填写结束时间！");
	}else if (starttime > endtime) {
		lwalert("tipModal", 1, "开始时间不能大于结束时间！");
	} else
		backValue = true;
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
        },
        dataType : "text",
        success : function(data) {
        },
        error : function(data) {
            lwalert("tipModal", 1, "error！");
        }
    });
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
var width;
function changeSize() {
	var windowheight = $(window).height();
	var titleheight = $("#titleheight").outerHeight(true);
	var formheightclass = $("#formheightclass").outerHeight(true);
//	width=$("#"+id).width()*(9/10)

	width = windowheight -titleheight -formheightclass;
	return width;
}

function workInBussinessSize(id) {

	if($(window).width()<768){
		width=$("#"+id).width()*(3/4)
	}else{
		width=$("#"+id).width()*(1/3)
	}

	return width;
}
function changeHeigth() {


	return width*(3/4);
}

function equipchangeSize(id){
	if($(window).width()<768){
		width=$("#"+id).width()*(1/2)
	}else{
		width=$("#"+id).width()*(1/3)
	}
}

function  getLength(length){
	$("#countData").html(length);
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