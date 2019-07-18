
$(function(){

	com.leanway.loadTags();

	//加载页面时判断session是否失效
	//com.leanway.checkSession();


});

/**
 * 导入
 */
var importData = function ( ) {

	var importType = $("#importType").val();

	if (importType == "" || $.trim(importType) == "") {

		lwalert("tipModal", 1, "请选择导入源！");
		return;
	}

	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/otherSystemImport",
		data : {
			"method" : "importData"
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

	//		alert(text.info);

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				if (text.status == "success") {
					lwalert("tipModal", 1, "销售订单导入成功！");
				}

			}
		}
	});

}