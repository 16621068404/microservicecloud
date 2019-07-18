


//查询单位类型
function queryAllCompany() {
	$.ajax({
		type : "get",
		url : "../../"+ln_project+"/company",
		data : {
			method : "queryAllCompany",
			conditions : "{}"
		},
		dataType : "json",
		success : function(data) {

			//下拉框赋值
			setCompany(data.data);
		},
		error : function(data) {

		}
	});
}


$("#compId").on("select2:select", function(e) {
	$("#compName").val($(this).find("option:selected").text());
});


//初始化select2,
/**
 * id: 为要操作的对象 url: url text: 要在select中显示的文本
 */
function initSelect2(id, url, text) {
	$(id).select2({
		placeholder : text,
		language : "zh-CN",
		ajax : {
			url : url,
			dataType : 'json',
			delay : 250,
			data : function(params) {
				return {
					q : params.term, // search term
					page : params.page,
					pageSize : 10
				};
			},
			processResults : function(data, params) {
				params.page = params.page || 1;
				return {
					results : data.items,
					pagination : {
						more : (params.page * 30) < data.total_count
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

//初始化单位类型下拉框
var setCompany = function(data) {
	var html = "";

	for (var i in data) {

		//拼接option
		html +="<option value="+ data[i].compid+">"+ data[i].compname+"</option>";
	}

	$("#compId").html(html);
}


var formatFormJson = function(formData) {
	var reg = /,$/gi;
	var data = "{";
	for (var i = 0; i < formData.length; i++) {
		data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
	}
	data = data.replace(reg, "");
	data += "}";
	return data;
}
/**
 * 保存前的条件判断
 */
function saveOrUpdate() {

    var compId = $("#compId").val();
	var userName = $("#userName").val();
	if (userName == "" || userName == null) {
		$("#tips").html("用户名不能为空!");
    	$("#tipModal").modal("show");
		return;
	}

	$.ajax({
		type : "post",
		url : "../../"+ln_project+"/user",
		data : {
			method : "queryUserType",
			conditions : '{"compId":"' + compId + '","userName":"' + userName + '"}'
		},
		dataType : "text",
		success : function(text) {
			//该用户不存在
			if($.trim(text) == '"-1"'){

				$("#tips").html("所属公司下该用户不存在！");
		    	$("#tipModal").modal("show");

		    //超级管理员
			}else if ($.trim(text) == '"1"') {

				$("#tips").html("请与该软件产品开发公司联系! <br><br>"
						          + "联系电话:400-8215-625  <br><br> 邮箱：lean@leanway.com.cn");
		    	$("#tipModal").modal("show");

		    	//普通管理员
			} else {
				$("#tips").html("请与公司系统管理员联系！");
		    	$("#tipModal").modal("show");

			}

		},
		error : function(data) {
//			alert("保存失败！");
			$("#tips").html("保存失败!");
	    	$("#tipModal").modal("show");
		}
	});
}

$(function() {

	//查询所有公司名称
	queryAllCompany();
	initSelect2("#compId", "../../"+ln_project+"/company?method=queryAllCompanyBySearch", "搜索公司");

});
