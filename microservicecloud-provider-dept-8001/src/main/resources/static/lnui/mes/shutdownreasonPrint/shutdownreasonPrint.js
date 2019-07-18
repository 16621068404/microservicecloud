
// 页面打开时加载的数据
$(function() {



	com.leanway.loadTags();

	$("#printbarcodebutton").hide();

	//queryAllExceptionReason();

	var centerid = $("#centerid").val();

    com.leanway.initSelect2("#centerid", "../../../../"+ln_project+"/workCenter?method=queryWorkCenterBySelect", "搜索工作中心");
    com.leanway.initSelect2("#shutdownreasonid", "../../../../"+ln_project+"/workCenter?method=queryShutReason&centerid="+centerid, "搜索停机原因");
});


$("#centerid").on("change", function(e) {

	$("#centername").val($(this).find("option:selected").text());
	checkCenter();
});



function checkCenter(){


	var centerid = $("#centerid").val();

	com.leanway.initSelect2("#shutdownreasonid", "../../../../"+ln_project+"/workCenter?method=queryShutReason&centerid="+centerid, "搜索停机原因");
}

$("#shutdownreasonid").on("change", function(e) {
	$("#reasoncode").val($(this).find("option:selected").text());
});

//导出excel文件
function exportShutdown() {

	var centerid = $("#centerid").val();
	var shutdownreasonid = $("#shutdownreasonid").val();

	window.location.href = "../../../../"+ln_project+"/workCenter?method=exportExcel&centerid="+centerid+"&shutdownreasonid="+shutdownreasonid+"&type=3";


}
//function queryAllExceptionReason() {
//
//	showMask();
//
//	$.ajax({
//		type : "post",
//		url : "../../shutdownreason",
//		data : {
//			"method" : "queryShutDownList",
//		},
//		dataType : "text",
//		success : function(data) {
//
//			var flag =  com.leanway.checkLogind(data);
//
//			if(flag){
//
//				var result = eval("(" + data + ")");
//				if (result.iTotalRecords != 0) {
//
//					setFormPrint(result.data,result.iTotalRecords);
//					$("#printbarcodebutton").show();
//					hideMask();
//				} else {
//
//
//					$("#tableBody").empty();
//					$("#printbarcodebutton").hide();
//					hideMask();
//				}
//
//			}
//
//		},
//		error : function(data) {
//
//			lwalert("tipModal", 1, "error！");
//		}
//	});
//}


function queryShutReasonList() {

	var centerid = $("#centerid").val();
	var shutdownreasonid = $("#shutdownreasonid").val();

	showMask();

	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/workCenter",
		data : {
			"method" : "downloadDataList",
			"type" : "3",
			"centerid" : centerid,
			"shutdownreasonid" : shutdownreasonid
		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var result = eval("(" + data + ")");
				console.info(result)
				if (result.length != 0) {

					setFormPrint(result.list,result.length);
					$("#printbarcodebutton").show();
					hideMask();
				} else {


					$("#printarea").empty();
					$("#count").html("共<font color='red'>0</font>条数据");
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
        html+=result[i].reasoncode+"<div id='barcode"+i+"'>"+result[i].barcode+"</div>"
        html+="</td>"


		$("#printarea").html(html);
		for ( var j in result) {
			var value = result[j].barcode;

			// 条码显示 后台传上id值 获取填值
			$("#barcode" + j).barcode(value, btype, settings);
		}

	}


	hideMask();

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