var clicktime = new Date();
// 重置表单数据
function resetPageForm() {
	$('#weixinparamForm')[0].reset(); // 清空表单

	$("#weixinparamForm").data('bootstrapValidator').resetForm();
	$("#weixinparamForm input[type='hidden']").val("");
	hideEmp();
	//$("#empImageId").attr("src", "");
};

// 初始化验证input
function initBootstrapValidator() {
	$('#weixinparamForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					appid : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 2,
								max : 8
							}
						}
					},
					appsecret : {
						validators : {
							notEmpty : {}
						
						}
					},
					note : {
						validators : {
							stringLength : {
								max : 1000
							}
						}
					}
				}
			});
}

// 将form表单中的数据转为对象 (bean中嵌套bean)
function paramString2obj(serializedParams) {
	var obj = {};
	function evalThem(str) {
		var attributeName = str.split("=")[0];
		var attributeValue = str.split("=")[1];
		if (!attributeValue) {
			return;
		}
		var array = attributeName.split(".");
		for (var i = 1; i < array.length; i++) {
			var tmpArray = Array();
			tmpArray.push("obj");
			for (var j = 0; j < i; j++) {
				tmpArray.push(array[j]);
			}
			;
			var evalString = tmpArray.join(".");
			if (!eval(evalString)) {
				eval(evalString + "={};");
			}
		}
		eval("obj." + attributeName + "='" + attributeValue + "';");
	}
	var properties = serializedParams.split("&");
	for (var i = 0; i < properties.length; i++) {
		evalThem(properties[i]);
	}
	return obj;
}

// 调用方法：form2json ，序列号对象，并转为json字符串 (bean中嵌套bean)
$.fn.form2json = function() {
	var serializedParams = this.serialize();
	var obj = paramString2obj(serializedParams);
	return JSON.stringify(obj);
}

// 删除雇员信息（将status变为1， 默认为0）
function deleteWeixinparam() {

	
	var str = '';
	// 拼接选中的checkbox
	$("input[name='checkList']:checked").each(function(i, o) {
		str += $(this).val();
		str += ",";
	});
	
	if (str.length > 0) {
		var ids = str.substr(0, str.length - 1);
		
		if (confirm("确定要删除吗?")) {
			deleteAjax(ids);
		}
	} else {
		alert("至少选择一条记录操作");
	}
}

// 删除Ajax
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/weixinparam",
		data : {
			method : "updateWeixinparamStatusByConditons",
			conditions : '{"paramid":"' + ids + '", "status":"' + 1 + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {
			var tempData = $.parseJSON(text);
			if (tempData.code == "1") {
				oTable.ajax.reload(); // 刷新dataTable
			} else {
				alert("操作失败");
			}
		}
	});
}

// 显示编辑数据
function showEditweixinparam() {
	var paramid = $("#paramid").val();

	if (paramid == "" || paramid == null || paramid == "null") {

		alert("请选项！");

	} else {

		com.leanway.removeReadOnly("weixinparamForm");
		buttonEnabled("#saveOrUpdateAId");
		opeMethod = "updateWeixinparamByConditons";
	/*	dyscGetProvinceCityCountry("#province", "province", $('#province')
				.val(), $('#city').val());*/

	}
}

// 根据ID查出雇员
var getWeixinparamById = function(paramid) {

	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/weixinparam",
		data : {
			method : "selectWeinxinparamByid",
			conditions : '{"paramid":"' + paramid + '"}'
		},
		dataType : "text",
		success : function(data) {
			var json = eval("(" + data + ")").resultObj;
			com.leanway.formReadOnly("weixinparamForm");
			setFormValue(json);
		},
		error : function(data) {

		}
	});
}

// 自动填充表单数据（页面id须与bean保持一致）
function setFormValue(data) {
	resetPageForm();

	for ( var item in data) {
		$("#" + item).val(data[item]);
	}

	hideEmp();
/*	checkPhoto('idcardimg');
	checkPhoto('headimg');*/
}



function saveOrUpdate() {
	$("#weixinparamForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#weixinparamForm').data('bootstrapValidator').isValid()) { // 返回true、false
		var formData = $("#weixinparamForm").form2json();
		$.ajax({
			type : "post",
			url : "../../../../"+ln_project+"/weixinparam",
			data : {
				method : opeMethod,
				conditions : decodeURIComponent(formData).replace(/\+/gi, " ")
			// decodeURIComponent: 用于处理时间编码；replace(/\+/gi," ")：将所有+替换成" "
			},
			dataType : "text",
			success : function(data) {
				var tempData = $.parseJSON(data);
				if (tempData.code == "1") {
					buttonDisabled("#saveOrUpdateAId, #resetFun");
					com.leanway.formReadOnly("weixinparamForm");
					oTable.ajax.reload(); // 自动刷新dataTable
				} else {
					alert(tempData.exception);
				}
			},
			error : function(data) {
				alert("保存失败！");
			}
		});
	}
}

// 操作方法，新增或修改
var opeMethod = "addweixinparam";

// 点击新增
function addweixinparam() {
	opeMethod = "addweixinparam";

	// 清空表单
	resetPageForm();
	com.leanway.removeReadOnly("weixinparamForm");
	//保存和重置按钮激活
	buttonEnabled("#saveOrUpdateAId, #resetFun");
}
// 初始化数据表格
var initTable = function() {
	var table = $('#weixinparamDataTable')
			.DataTable(
					{
						"ajax" : '../../../../'+ln_project+'/weixinparam?method=findWeixinparamList',
						"iDisplayLength" : "8",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						/* "sScrollY" : 450, */// DataTables的高
						// "sScrollX" : 400, // DataTables的宽
						"bAutoWidth" : true, // 宽度自适应
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",
						"columns" : [ {
							"data" : "paramid"
						}, {
							"data" : "appid"
						}, {
							"data" : "appsecret"
						} ],
						"aoColumns" : [
								{
									"mDataProp" : "paramid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd)
												.html(
														"<input class='regular-checkbox' type='checkbox' id='"
																+ sData
																+ "' name='checkList' value='"
																+ sData
																+ "'><label for='"
																+ sData
																+ "'></label>");
									}
								}, {
									"mDataProp" : "appid"
								}, {
									"mDataProp" : "appsecret"
								} ],
						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {
							com.leanway.getDataTableFirstRowId(
									"weixinparamDataTable", getWeixinparamById);
						}
					});
	return table;
}

// 初始化select2,
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

// 触发select2选择事件，给隐藏域赋值
$("#paramid").on("select2:select", function(e) {
	$("#weixinparam").val($(this).find("option:selected").text());
});

$("#compid").on("select2:select", function(e) {
	$("#compname").val($(this).find("option:selected").text());
});

// 初始化时间
function initDate(id) {
	$(id).datetimepicker({
		lang : 'ch',
		format : "Y-m-d H:i:s", // 格式化日期
		timepicker : false, // 关闭时间选项
		yearStart : 2000, // 设置最小年份
		yearEnd : 2050, // 设置最大年份
		todayButton : true
	// 关闭选择今天按钮
	});
}

// 禁用button
function buttonDisabled(id) {
	$(id).attr({
		"disabled" : "disabled"
	});
}

// 启用button
function buttonEnabled(id) {
	$(id).removeAttr("disabled");
}
var hideEmp = function() {

	$('#idcardimgClearId').hide();
	$('#headimgClearId').hide();
	$('#fileInputDivId').hide();
	$('#idcardimgShowImgId').hide();
	$('#headimgShowImgId').hide();

}


// 数据table
var oTable;

// 需要初始化数据
$(function() {
	initBootstrapValidator();
	// 隐藏保存、重置按钮
	buttonDisabled("#saveOrUpdateAId, #resetFun");

	oTable = initTable();

	/*initDate("#weixinparamDataTable, #enddate");*/
	// 初始化表格只读
	com.leanway.formReadOnly("weixinparamForm");
	// 点击dataTable触发事件
	com.leanway.dataTableClick("weixinparamDataTable", "checkList", true, oTable,
			getWeixinparamById);
//	com.leanway.dataTableClickMoreSelect("weixinparamDataTable", "checkList", true, oTable,
//			getWeixinparamById);
	hideEmp();
});
