var onTable;
var opeMethod;
var reg=/,$/gi;
//全局参数  clicktime
var clicktime=new Date();
$(function(){
	onTable = initTemplateTable();
	com.leanway.formReadOnly("templateForm");
	queryTemplateInfo();
	queryCodeMapInfo();
	com.leanway.enterKeyDown("searchValue", searchValueFun);
	initBootstrapValidator();
	$("#searchValue").val("");
});

var queryTemplateInfo = function ( ) {

	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/template",
		data : {
			method : "queryTemplateInfo",
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {


					var templateList = data.templateList;
					var htmlName="";
					for (var i = 0;i<templateList.length;i++) {
						htmlName+="<option id="+i+" value="+templateList[i].catlateid+">"+templateList[i].templatename+"</option>";
					}
					$("#catlateid").html(htmlName);
			}
		}
	});
}

var queryCodeMapInfo = function ( ) {

	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/template",
		data : {
			method : "queryCodeMapInfo",
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {

					var tagTypeList = data.tagTypeList;
					var dataTypeList = data.dataTypeList
					var htmlTag="";
					var htmlData="";
					for (var i = 0;i<tagTypeList.length;i++) {
						htmlTag+="<option id="+i+" value="+tagTypeList[i].codemapid+">"+tagTypeList[i].codevalue+"</option>";
					}
					for (var i = 0;i<dataTypeList.length;i++) {
						htmlData+="<option id="+i+" value="+dataTypeList[i].codemapid+">"+dataTypeList[i].codevalue+"</option>";
					}
					$("#tagtype").html(htmlTag);
					$("#datatype").html(htmlData);
			}
		}
	});
}


var searchValueFun = function ( ) {
	// 关键字
	var searchValue = $("#searchValue").val();

	//重新加载
	onTable.ajax.url( '../../../../'+ln_project+'/template?method=queryTemplatePropertiesList&searchValue=' + searchValue).load();
}

/**
 * 点击显示详细信息
 *
 */
var getDetailById = function (propertiesId) {
	com.leanway.formReadOnly("templateForm");
	opeMethod = "";

	if (propertiesid == "null") {

		resetForm( );

	} else {
		// 加载数据
		$.ajax( {
			type : "post",
			url : "../../../../"+ln_project+"/template",
			data : {
				method : "queryTemplateDetailById",
				"propertiesId" : propertiesId
			},
			dataType: "json",
			success: function ( data ) {

				var flag =  com.leanway.checkLogind( data );

				if ( flag ) {

					setFormValue( data );

				}
			}
		});
	}
}
/**
 * 赋值
 *
 */
function setFormValue( data ) {

	if(data.extract == false){
		data.extract = 0;
	} else {
		data.extract = 1;
	}
	for ( var item in data ) {

		if ( item != "searchValue" ) {
			$("#" + item).val(data[item]);
		}

	}

}
/**
 * 初始化表单
 */
var initTemplateTable = function ( ) {

	var table = $('#templateTable').DataTable({
		"ajax" : '../../../../'+ln_project+'/template?method=queryTemplatePropertiesList',
//		"iDisplayLength" : "8",
		'bPaginate' : true,
		"bDestory" : true,
		"bRetrieve" : true,
		"bFilter" : false,
		"bSort" : false,
		"scrollX": true,
		/*"scrollY":"200px",*/
		//"sScrollY" : 450, // DataTables的高
		//"sScrollX" : 400, // DataTables的宽
		"bAutoWidth" : true, // 宽度自适应
		"bProcessing" : true,
		"bServerSide" : true,
		"aoColumns" : [
				{
					"mDataProp" : "propertiesid",
					"fnCreatedCell" : function(nTd, sData,
							oData, iRow, iRow) {
						$(nTd).html("<div id='stopPropagation" + iRow +"'>"
								   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='checkList' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label>");
                           com.leanway.columnTdBindSelectNew(nTd,"templateTable","checkList");
					}
				}, {
					"mDataProp" : "propertiesname"
				}, {
					"mDataProp" : "idkey"
				}, {
					"mDataProp" : "templatename"
				}],
		"fnCreatedRow" : function(nRow, aData, iDataIndex) {
			// add selected class
		},
		"oLanguage" : {
        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
         },
		"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		"fnDrawCallback" : function(data) {

			com.leanway.getDataTableFirstRowId("templateTable", getDetailById,false,"checkList");

			 // 点击dataTable触发事件
			com.leanway.dataTableClickMoreSelect("templateTable", "checkList", false, onTable, undefined, getDetailById,undefined,"checkAll");

            com.leanway.dataTableCheckAllCheck('templateTable', 'checkAll', 'checkList');


		}
	}).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );
	return table;
}

/**
 * 新增按钮
 */
var addTemplate = function ( ) {
	opeMethod = "addTemplateProperties";
	com.leanway.removeReadOnly("templateForm");
	resetForm();
}


/**
 * 修改按钮
 */
var updateTemplate = function ( ) {

	var data = onTable.rows('.row_selected').data();

	if (data.length == 0) {

		lwalert("tipModal", 1, "请选择退货单修改!");
		return;

	} else if (data.length > 1) {

		lwalert("tipModal", 1, "请选择一条配置名称修改!");
		return;

	} else {
		com.leanway.clearTableMapData( "templateTable" );
	}

	opeMethod = "updateTemplateProperties";

	com.leanway.removeReadOnly("templateForm");
	$("#propertiesname").prop("disabled",true);
	$("#idkey").prop("disabled",false);

}


/**
 * 保存按钮
 */
var saveTemplate = function ( ) {

	var form  = $("#templateForm").serializeArray();
	var formData = formatFormJson(form);
	// 提交前先验证
	$("#templateForm").data('bootstrapValidator').validate();
	// 返回true、false
	if ($('#templateForm').data('bootstrapValidator').isValid()) {
    $.ajax( {
		type : "post",
		url : "../../../../"+ln_project+"/template",
		data : {
			method : opeMethod,
			conditions: formData,
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {

				if ( data.status == "error" ) {
					lwalert("tipModal", 1,data.info);
				} else {

					com.leanway.formReadOnly("templateForm");
					com.leanway.clearTableMapData( "templateTable" );

					if ( opeMethod == "addTemplateProperties" ) {
						onTable.ajax.reload();
					} else {
						onTable.ajax.reload(null,false);
					}

					lwalert("tipModal", 1,"保存成功");
				}

			}
		},
		error : function(data) {
			lwalert("tipModal", 1,"保存失败");
		}
	});
  }
}

var deleteTemplate = function ( type ) {

    if ( type == undefined || typeof( type ) == "undefined" ) {
    	type = 1;
	}

	var ids = com.leanway.getCheckBoxData(type, "templateTable", "checkList");

	if (ids.length > 0) {


		var msg = "确定删除选中的" + ids.split(",").length + "条配置吗?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
//		var ids = str.substr(0, str.length - 1);
//		if (confirm("确定要删除选中的销售订单吗?")) {
//			deleteAjax(ids);
//		}
	} else {
//		alert("至少选择一条记录操作");
		lwalert("tipModal", 1,"至少选择一条记录操作");
	}
}

var isSureDelete = function (type) {
	var ids = com.leanway.getCheckBoxData(type, "templateTable", "checkList");
	deleteAjax(ids);
}

// 删除Ajax
var deleteAjax = function( ids ) {

	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/template",
		data : {
			method : "updateTemplatePropertiesStatus",
			"ids" : ids
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {

				if (data.status == "success") {

					com.leanway.clearTableMapData( "templateTable" );
					onTable.ajax.reload(); // 刷新dataTable

	//				alert("删除成功!");
					lwalert("tipModal", 1,data.info);
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1,data.info);
				}

			}
		}
	});
}


//格式化form数据
var  formatFormJson = function  (formData) {

	var data = "{";
	//获取模板id
	var catlateid=$("#catlateid").find("option:selected").val();
	//获取控件类型
	var tagtype=$("#tagtype").find("option:selected").val();
	//获取提取
	var extract=$("#extract").find("option:selected").val();
	//获取数据类型
	var datatype=$("#datatype").find("option:selected").val();

	if(extract == 0){
		extract = false;
	} else {
		extract = true;
	}

	for (var i = 0; i < formData.length; i++) {

		data += "\"" +formData[i].name +"\" : \""+ formData[i].value +"\",";
	}

	data += "\"catlateid\" : \""+ catlateid +"\",";
	data += "\"tagtype\" : \""+ tagtype +"\",";
	data += "\"extract\" : \""+ extract +"\",";
	data += "\"datatype\" : \""+ datatype +"\"";

	data += "}";

	return data;
}

/**
 * 设置不可用
 */
function resetForm( ){
	$("#propertiesname").prop("disabled",false);
	$("#propertiesname").val("");
	$("#catlateid").val("");
	$("#idkey").val("").prop("disabled",true);
	$("#extract").val("").prop("disabled",true);
	$("#tagtype").val("").prop("disabled",true);
	$("#datatype").val("").prop("disabled",true);
}
/**
 * 设置为可用
 */
function showOther( ) {
	$("#idkey").prop("disabled",false);
	$("#extract").prop("disabled",false);
	$("#tagtype").prop("disabled",false);
	$("#datatype").prop("disabled",false);
}


function initBootstrapValidator( ) {
	//对应的表单id
	$('#templateForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					propertiesname : {
						validators : {
							notEmpty : {
								message: '配置名称不能为空'
							}
						}
					},
					idkey: {
						validators: {
							notEmpty: {
								message: '页面标识不能为空'
							}
							}
					}
				}
			})
}