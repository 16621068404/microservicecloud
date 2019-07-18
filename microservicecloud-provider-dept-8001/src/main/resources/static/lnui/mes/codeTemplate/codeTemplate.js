//改变checkbox形状
var clicktime = new Date();
var ope="addCodeTemplate"
//数据table
var oTable;
$(function() {
	initBootstrapValidator();
	})
function initBootstrapValidator() {
	$('#codeTemplateForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					prefix : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 1,
								max : 20,
								message: '请输入1到20个字符'
							}
						}
					},
					endvalue : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 1,
								max : 10,
								message: '请输入1到10个字符'
							}
						}
					},
					step : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 1,
								max : 10,
								message: '请输入1到10个字符'
							}
						}
					},
					startvalue: {
						validators : {
							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.resourcescount,
									com.leanway.reg.msg.resourcescount)
						}
					},
					lengthnum:{
						validators : {
							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.resourcescount,
									com.leanway.reg.msg.resourcescount)
						}
					},
				}
			});
}

$ ( function () {
	// 初始化对象
	com.leanway.loadTags();
	// 加载datagrid
	oTable = initTable();
	queryCodeTypeList();
//	com.leanway.dataTableCheckAll("generalInfo", "checkAll", "checkList");
	com.leanway.formReadOnly("codeTemplateForm");
	com.leanway.enterKeyDown("searchValue", searchCodeTemplate);

});

//初始化数据表格
var initTable = function () {

	var table = $('#generalInfo').DataTable( {
			"ajax": "../../../"+ln_project+"/codeTemplate?method=queryCodeTemplateList",
			// "iDisplayLength" : "6",
	        'bPaginate': true,
	        "bDestory": true,
	        "bRetrieve": true,
	        "bFilter":false,
	        "bSort": false,
	        "scrollY":"57vh",
	        "bProcessing": true,
	        "bServerSide": true,
	        'searchDelay':"5000",
	        "columns": [
                {"data" : "templateid"},
                { "data": "codevalue" },
                { "data": "typename" },
                { "data": "prefix" },

	         ],
	         "aoColumns": [
	               {
	            	   "mDataProp": "templateid",
	                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
	                	   $(nTd).html("<div id='stopPropagation" + iRow +"'>"
								   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='checkList' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label>");
						 com.leanway.columnTdBindSelectNew(nTd,"generalInfo", "checkList");
	                   }
	               },
	               {"mDataProp": "codevalue"},
	               { "mDataProp": "typename" },
	               { "mDataProp": "prefix" },

	          ],
	         "oLanguage" : {
	        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
	         },
	         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	         "fnDrawCallback" : function(data) {
					com.leanway.getDataTableFirstRowId("generalInfo", ajaxLoadCodeTemplate,"more", "checkList");
					 com.leanway.dataTableClickMoreSelect("generalInfo", "checkList", false,
                             oTable, ajaxLoadCodeTemplate,undefined,undefined,"checkAll");

					 com.leanway.dataTableCheckAllCheck('generalInfo', 'checkAll', 'checkList');

//                     $('input[type="checkbox"]').icheck({
//                         labelHover : false,
//                         cursor : true,
//                         checkboxClass : 'icheckbox_flat-blue',
//                         radioClass : 'iradio_flat-blue'
//                     });
				}
	    } ).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );

	return table;
}

// 查询到右边显示
var ajaxLoadCodeTemplate =function (templateid) {

	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/codeTemplate",
		data : {
			"method" : "queryCodeTemplateObject",
			"templateid" : templateid,
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				setFormValue(tempData.resultObj);
			}
		}
	});
	com.leanway.formReadOnly("codeTemplateForm");
}

// 填充到HTML表单
function setFormValue (data) {
	resetForm();
	for (var item in data) {
		if (item != "searchValue") {

			$("#" + item).val(data[item]);
		}
	  }

}

//格式化form数据
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
 * 新增
 *
 * */
var addCodeTemplate = function() {

	ope="addCodeTemplate";
	// 清空表单
	resetForm();
	com.leanway.removeReadOnly("codeTemplateForm");
	com.leanway.dataTableUnselectAll("generalInfo", "checkList");
	com.leanway.dataTableUnselectAll("generalInfo", "checkAll");
	//初始化省

	com.leanway.clearTableMapData( "generalInfo" );
}

/**
 * 修改数据
 *
 * */
function updateCodeTemplate() {

	ope="updateCodeTemplate";
	var data = oTable.rows('.row_selected').data();
	if(data.length == 0) {
//		alert("请选择要修改的物料清单！");
		lwalert("tipModal", 1, "请选择要修改的编码规则！");
	} else if(data.length > 1) {
//		alert("只能选择一个物料清单进行修改！");
		lwalert("tipModal", 1, "只能选择一个编码规则进行修改！");
	}else{
		com.leanway.removeReadOnly("codeTemplateForm");
		document.getElementById("templatename").disabled=true;
		document.getElementById("type").disabled = true;
	}
}

/**
 * 往里面存数据
 * */

var saveCodeTemplate= function() {

	document.getElementById("templatename").disabled=false;
	document.getElementById("type").disabled = false;
	var form  = $("#codeTemplateForm").serializeArray();
	//后面确认时应 检测模具编号是否已存在
	var formData = formatFormJson(form);
	$("#codeTemplateForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#codeTemplateForm').data('bootstrapValidator').isValid()) { // 返回true、false
	$.ajax ( {
		type : "POST",
		url : "../../../"+ln_project+"/codeTemplate",
		data : {
			"method":ope,
			"formData" : formData,
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){


				var tempData = $.parseJSON(data);
				if (tempData.resultObj!=null) {

					com.leanway.formReadOnly("codeTemplateForm");

					com.leanway.clearTableMapData( "generalInfo" );

					if(ope=="addCodeTemplate"){
					    oTable.ajax.reload();
					}else{
					    oTable.ajax.reload(null,false);
					}

					lwalert("tipModal", 1, "保存成功！");
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1, "该编码规则已存在，不能保存！");
				}
			}
		}
	});
	}
}

function deleteCodeTemplate(type){

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");

	if (ids.length>0) {
		var msg = "确定删除选中的" + ids.split(",").length + "条编码规则?";

		lwalert("tipModal", 2, msg ,"isSure(" + type + ")");
	} else {
//		alert("至少选择一条记录进行删除操作");
		lwalert("tipModal", 1, "至少选择一条记录进行删除操作！");
	}
}


function isSure(type) {

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
	deleteAjax(ids);
}
//删除物料追踪单
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/codeTemplate?method=deleteCodeTemplate",
		data : {
			"conditions" : '{"ids":"' + ids + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
				if (tempData.code == "1") {
					resetForm();
					com.leanway.clearTableMapData( "generalInfo" );
					oTable.ajax.reload(null,false);
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");
				}
			}
		}
	});
}
var resetForm = function () {
    $( '#codeTemplateForm' ).each( function ( index ) {
        $('#codeTemplateForm')[index].reset( );
    });
    $("#codeTemplateForm").data('bootstrapValidator').resetForm();
}

function queryCodeTypeList() {
	$.ajax({
		type : "get",
		url : "../../../"+ln_project+"/codeTemplate",
		data : {
			method : "queryCodeTypeList",
			conditions : "{}"
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				resetForm();
				setCodeType(data.codeMapType);
				setTemplate(data.codeMapName)

			}
		},
		error : function(data) {

		}
	});
}
var setCodeType = function(data) {
	var html = "";
	for ( var i in data) {
		html += "<option value=" + data[i].codenum + ">" + data[i].codevalue
				+ "</option>";
	}

	$("#type").html(html);
}
var setTemplate = function(data) {
	var html = "";
	for ( var i in data) {
		html += "<option value=" + data[i].codenum + ">" + data[i].codevalue
				+ "</option>";
	}

	$("#templatename").html(html);
}
/**
 * 搜索工作中心
 */
var searchCodeTemplate = function() {

	var searchVal = $("#searchValue").val();

	oTable.ajax.url(
			"../../../"+ln_project+"/codeTemplate?method=queryCodeTemplateList&searchValue="
					+ searchVal).load();
}
