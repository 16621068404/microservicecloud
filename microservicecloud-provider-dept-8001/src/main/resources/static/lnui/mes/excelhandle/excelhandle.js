
//下载模板
function downloadTemplate(downType) {

	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/uploadFile",
		data : {
			method : "download",
			fileType : downType,
			type : "1"
		},
		dataType : "text",

		success : function(data) {

			var flag =  com.leanway.checkLogind(data);
			if(flag){

			  data = data.replace(/[\'\"\\\b\f\n\r\t]/g, '');
			  var temp = window.parent.open("../../../../"+data,"_blank");
			}
		},
		error : function(data) {

		}
	});
	//window.location.href = "../../uploadFile?method=download&fileType="+downType;
}

//选中事件
$('#uploadFileInput').on('filebatchselected', function(event, files) {
    buttonEnabled("#importButton");
});

var bomMap;
//上传成功事件
$('#uploadFileInput').on('fileuploaded', function(event, data, previewId, index) {
	console.info(data.response)
	var flag =  com.leanway.checkLogind(data.response);

	if(flag){

	resetFormFunc();

	 var tableBodyHtml = "";
	 if(data.response.importType==3){
		 
		 if(data.response.bomResultMap.errorinfo!=undefined&&data.response.bomResultMap.errorinfo[0] != null&&data.response.code==1) {

				for(var key in data.response.bomResultMap.errorinfo) {

					tableBodyHtml+="<li>"+data.response.bomResultMap.errorinfo[key]+"<br>";

				}
				bomMap = data.response.bomResultMap;
				console.info(bomMap);

				tableBodyHtml+="<span style='font-size:16px;color:red;'>您确定要进行替换吗？</span></li>"
				$("#showReplaceResult").html(tableBodyHtml);
				$('#showReplaceModal').modal({backdrop: 'static', keyboard: false});

		 }else{
			 if(data.response.errorData != null&&data.response.errorData.length>0&&data.response.code==1) {

					for(var key in data.response.errorData) {

						var length = data.response.errorData[key].length;

						tableBodyHtml+="<li>"+data.response.errorData[key].slice(0, length-2)+"<br>";
						tableBodyHtml+="<span style='font-size:16px;color:red;'>"+data.response.errorData[key][length-1]+"</span></li>"

					}

					$("#showErrorResult").html(tableBodyHtml);
					$('#myResultModal').modal({backdrop: 'static', keyboard: false});

		 }else{

			lwalert("tipModal", 1, data.response.info);
		 }
		 }
	 }else{
		
		 if(data.response.errorData != null&&data.response.errorData.length>0&&data.response.code==1) {

				for(var key in data.response.errorData) {

					var length = data.response.errorData[key].length;

					tableBodyHtml+="<li>"+data.response.errorData[key].slice(0, length-2)+"<br>";
					tableBodyHtml+="<span style='font-size:16px;color:red;'>"+data.response.errorData[key][length-1]+"</span></li>"

				}

				$("#showErrorResult").html(tableBodyHtml);
				$('#myResultModal').modal({backdrop: 'static', keyboard: false});

	 }else{

		lwalert("tipModal", 1, data.response.info);
	 }
	 }

    

	}

});
function confirmReplace(){
	var params = "{\"replacePbomid\":"+JSON.stringify(bomMap.pbomid)+"}";
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/bom?method=updateComfirmReplace",
		data : {
			"params" : params,
			"levels":bomMap.bomMap
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);
			if(flag){
				bomMap=null;
				$('#showReplaceModal').modal("hide");
				lwalert("tipModal", 1, data.info);

			}
		}
	});
}
//清除表单
function resetFormFunc() {
	$("#importType").val(0);
	buttonDisabled("#importButton");
	initTimePickYmd("starttime");
}
//上传CSV文件
function importExcelFunc() {

	var importType = $("#importType").val();
	if(importType == 0) {
		lwalert("tipModal", 1, "请选择导入类型");
		return false;
	}

	$('#uploadFileInput').fileinput('refresh',{
		uploadExtraData: {importType: importType}
	});

    $('#uploadFileInput').fileinput('upload');

}

//初始化fileinput控件（第一次初始化）
function initFileInput(ctrlId, uploadUrl) {
    $(ctrlId).fileinput({
        language: 'zh', //设置语言
        uploadUrl: uploadUrl, //上传的地址
        allowedFileExtensions : ['csv'],//接收的文件后缀
        showUpload: false, //是否显示上传按钮
        showCaption: true,//是否显示标题
        showPreview: false,
        showRemove: true,
        maxFileCount: 1,
        minFileCount: 1,
        enctype: 'multipart/form-data',
        browseClass: "btn btn-primary", //按钮样式
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>"
    });

}


function selectTime(){
	var exportType = $("#exportType").val();
	if(exportType == 10||exportType == 11){
		$("#myModalLabel").html("请选择需要导出的月份");
		$('#myModal').modal({backdrop: 'static', keyboard: false});
		initTimePickYm("starttime");
	}
}

function confirmtime(){
	var starttime = $("#starttime").val();

	if(starttime==null||starttime==""){

		lwalert("tipModal", 1, "请选择时间");
		return;
	}else{
		$("#myModal").modal("hide");
	}
}

//导出excel文件
function exportExcelFunc() {

	var exportType = $("#exportType").val();
	var starttime = $("#starttime").val();
	if(exportType == 0) {
		//alert("请选择导出类型");
		lwalert("tipModal", 1, "请选择导出类型");
		return false;
	}

	if((exportType=="10"||exportType=="11")&&(starttime==""||starttime==null)){
		$("#myModalLabel").html("请选择需要导出的月份");
		$('#myModal').modal({backdrop: 'static', keyboard: false});
		initTimePickYm("starttime");
		return;
	}
	$("#exportButton").prop("disabled", true);
	$("#exportButton").html("生成中...请等待！");

	$.ajax ({
		type : 'POST',
		url : '../../../../'+ln_project+'/uploadFile?method=dowloadExcel',
		async : true,
		dataType : 'text',
		data : {
			exportType : exportType,
			starttime : starttime,
		},
		success : function(data) {

		    var flag =  com.leanway.checkLogind(data);
			 if(flag){
				 window.location.href = "../../../../"+ln_project+"/uploadFile?method=dowloadExcel&exportType="+exportType+"&starttime="+starttime;

				 $("#exportButton").prop("disabled", false);
				 $("#exportButton").html("导出");
			 }else{
				 $("#exportButton").prop("disabled", false);
				 $("#exportButton").html("导出");
			 }

			}
		});

	//window.location.href = "../../uploadFile?method=dowloadExcel&exportType="+exportType+"&starttime="+starttime;


}

//禁用button
function buttonDisabled(id) {
	$(id).attr({
		"disabled" : "disabled"
	});
}
// 启用button
function buttonEnabled(id) {
	$(id).removeAttr("disabled");
}

$(function(){

	com.leanway.loadTags();

	buttonDisabled("#importButton");

	initFileInput("#uploadFileInput", "../../../../"+ln_project+"/uploadFile?method=uploadExcel");
});