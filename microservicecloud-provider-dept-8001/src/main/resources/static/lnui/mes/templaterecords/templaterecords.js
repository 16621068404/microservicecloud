
var catlateid = "";
var recordid = "";

//1：预览查看（htmlurl），2：读取数据（记录ID && 模版ID）, 1：写入()，
var pageFlag = com.leanway.getQueryString("pageFlag");

// iframe Url
var iframeUrl = com.leanway.getQueryString("flagval");
 
$(function(){
	
	 
	
	iframeUrl = "../../.." + iframeUrl;
	
	// 加载模版到页面中
	$("#templateIframe").attr("src", iframeUrl);
	
	setTimeout(function () {changeFrameHeight();}, 200);
	
	setTimeout(function () {
		//setTemplateVal();
	}, 200);
	
	// 预览 || 查看数据的情况下的情况下
	if ((pageFlag != undefined && pageFlag != "undefined" && typeof(pageFlag) !="undefined") && (pageFlag == "1" || pageFlag == "2")) {
		$("#saveBtn").hide();
	}
	
});

var saveData = function ( ) {
 

	var formData =  $(window.frames["templateIframe"].contentWindow.document).find("form").serializeArray();
	var strFormData = JSON.stringify(formData);
	 
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/template",
		data : {
			"method" : "saveTemplateRecordsData",
			"catlateid" : catlateid,
			"strFormData" : strFormData
		},
		dataType : "json",
		async : true,
		success : function ( text ) {
				
			var flag =  com.leanway.checkLogind(text);

			if (flag) {
				 
				if (text.status == "success") {
					 lwalert("tipModal", 1, "操作成功!");
				}else {
					 lwalert("tipModal", 1, text.info);
				}

			}

		},
		error : function ( data ) {
			
		}
	});
}

var setTemplateVal = function ( ) {
	
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/template",
		data : {
			"method" : "queryTemplateRecordsData",
			"recordid" : recordid
		},
		dataType : "json",
		async : true,
		success : function ( text ) {
				
			var flag =  com.leanway.checkLogind(text);
			 
			if (flag) {
				console.log(text.catlatevalue);
				setVal(text.catlatevalue);
			}

		},
		error : function ( data ) {
			
		}
	});
	
}

function setVal(strVal) {
	
	var jsonVal = eval("(" + strVal + ")");
	
	var templateDocument =  $(window.frames["templateIframe"].contentWindow.document);
	
	for (var i = 0; i <jsonVal.length; i ++) {
		templateDocument.find("#" +jsonVal[i].name).val(jsonVal[i].value);
	}
	
		// input 标签
	templateDocument.find("#form1 input").each(function(index, element) {
		
        $(this).parent().html("<span id='" + $(this).attr('id')+ "'>" + $(this).val() + "</span>");
    });
	
	templateDocument.find("#form1 textarea").each(function(index, element) {
        $(this).parent().html("<span id='" + $(this).attr('id')+ "'>" + $(this).val() + "</span>");
    });
	
	$("#saveBtn").hide();
}

/**
 * 高度自适应
 */
function changeFrameHeight(){
	var ifm= document.getElementById("templateIframe");   
	var subWeb = document.frames ? document.frames["templateIframe"].document : ifm.contentDocument;   
	if(ifm != null && subWeb != null) {
	   ifm.height = subWeb.body.scrollHeight;
	   ifm.width = subWeb.body.scrollWidth;
	} 
}

window.onresize=function(){  
    changeFrameHeight();  
} 