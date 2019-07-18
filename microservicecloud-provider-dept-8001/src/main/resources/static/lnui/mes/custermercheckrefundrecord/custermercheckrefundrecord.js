var path ="../../../lnfiles/upload/qctemplate/template-3.html";
var url = "";
var catlateid = "123";
var recordid = "91830232-f21b-4c7e-9287-2caf6db1aa00";

$(function(){
//	// 加载模版到页面中
	
	$("#templateIframe").attr("src", path);
//	
	setTimeout(function () {
		changeFrameHeight();
		$("#saveBtn").show();
	}, 200);
//	
	setTimeout(function () {
		setTemplateVal();
	}, 200);
	
});

var saveData = function ( ) {
 

	var formData =  $(window.frames["templateIframe"].contentWindow.document).find("form").serializeArray();
	var strFormData = JSON.stringify(formData);
	 console.info(2);
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
		url : "../../../../"+ln_project+"/templateRecords",
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