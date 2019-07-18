
com.leanway.reg.decimal.value =/^[\u0391-\uFFE5a-zA-Z0-9]{0,}$/;
com.leanway.reg.msg.value = "请输入有效字符";

com.leanway.reg.decimal.resource = /^[0-9]{1,}$/;
com.leanway.reg.msg.resource = "请输入正确的资源数";



var readOnlyObj = [{"id":"saveOrUpdateAId","type":"button"},{"id":"resetform","type":"button"}];

var ope="";

//全局参数  clicktime
var clicktime=new Date();

var oTable;
//初始化时候方法
$ ( function () {


	// 初始化对象
	com.leanway.loadTags();
	//初始化
	initBootstrapValidator();

	// 加载datagrid
	oTable = initTable();



	//表单设置只读
	com.leanway.formReadOnly("ExceptionReasonForm", readOnlyObj);

	// enter键时候触发查询
	com.leanway.enterKeyDown("queryExceptionName", queryExceptionReasonName);

	// 数据表格全选
	com.leanway.dataTableCheckAll("generalInfo","checkAll","checkList");
	/*if (window.screen.availHeight <= 768) {

		 $("#exceptionreasontypelabel").html('<span title="不合格原因类型">不合格类型</span>');

	 }*/

})

//校验输入的值是否特殊字符
function initBootstrapValidator() {
	$('#ExceptionReasonForm').bootstrapValidator({
		excluded: [':disabled'],
		fields: {
			code: {
				validators: {
					notEmpty: {},
					regexp:com.leanway.reg.fun(
							com.leanway.reg.decimal.value,
							com.leanway.reg.msg.value )
				}
			},shortname: {
				validators: {
					notEmpty: {},
				}
			},
		}
	});
}
/**
 * 新增时  清空表单
 *
 * */
var addExceptionReason = function() {

	com.leanway.clearForm("ExceptionReasonForm");
	com.leanway.dataTableUnselectAll("generalInfo", "checkList");
	com.leanway.dataTableUnselectAll("generalInfo", "checkAll");

	com.leanway.removeReadOnly("ExceptionReasonForm",readOnlyObj);

	ope="addExceptionReason";

	$("#exceptionid").val(null);

	//将保存按钮表位可用
	$("#saveOrUpdateAId").removeAttr("disabled");
	//$("#tableBody").empty();

	com.leanway.clearTableMapData( "generalInfo" );

}

//模糊查询
function queryExceptionReasonName(){
	//checkSession();
	var code=$("#queryExceptionName").val();
	oTable.ajax.url("../../../../"+ln_project+"/exceptionreason?method=queryExceptionReasonName&code=" + code).load();

}

//初始化数据表格
var initTable = function() {
	//checkSession();
	var table = $('#generalInfo')
	.DataTable(
			{
				"ajax" : "../../../../"+ln_project+"/exceptionreason?method=findAllExceptionReason",
				"iDisplayLength" : "10",
				'bPaginate' : true,
				"bDestory" : true,
				"bRetrieve" : true,
				"bFilter" : false,
				"bSort" : false,
				"scrollY":"57vh",
				"bProcessing" : true,
				"bServerSide" : true,
				'searchDelay' : "5000",
				"columns": [
				            {"data" : "mouldid"},
				            ],
				            "aoColumns": [
				                          {
				                        	  "mDataProp": "exceptionid",
				                        	  "fnCreatedCell" : function(nTd, sData,
				                        			  oData, iRow, iCol) {
				                        		  $(nTd)
				                        		  .html("<div id='stopPropagation" + iRow +"'>"
				                        				  +"<input class='regular-checkbox' type='checkbox' id='"
				                        				  + sData
				                        				  + "' name='checkList' value='"
				                        				  + sData
				                        				  + "'><label for='"
				                        				  + sData
				                        				  + "'></label> </div>");
				                        		  com.leanway.columnTdBindSelectNew(nTd,"generalInfo","checkList");
				                        	  }
				                          },
				                          {"mDataProp": "code"},
				                          {"mDataProp": "shortname"}
				                          ],
				                          "oLanguage" : {
				                        	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
				                          },
				                          "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
				                          "fnDrawCallback" : function(data) {
				                        	  com.leanway.getDataTableFirstRowId("generalInfo",
				                        			  ajaxLoadExceptionReason,"more","checkList");

				                        	  //点击事件
				                        	  com.leanway.dataTableClickMoreSelect("generalInfo","checkList",false,oTable,ajaxLoadExceptionReason,undefined,undefined,"checkAll");
				                        	  com.leanway.dataTableCheckAllCheck('generalInfo', 'checkAll', 'checkList');

				                          },

			}).on('xhr.dt', function (e, settings, json) {
				com.leanway.checkLogind(json);
			} );

	return table;
}

/**
 * 根据id查询到右边显示
 * */
var ajaxLoadExceptionReason =function (exceptionid) {
	com.leanway.formReadOnly("ExceptionReasonForm", readOnlyObj);
	$("#saveOrUpdateAId").attr({
		"disabled" : "disabled"
	});
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/exceptionreason",
		data : {
			method:"findExceptionReasonObject",
			"exceptionid":exceptionid,
		},
		dataType : "text",
		async : false,
		success : function ( data ) {
			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var result = $.parseJSON(data);

				setFormValue(result);

			}

		}
	});
}

/**
 * 填充到HTML表单
 * */
function setFormValue (json) {
	com.leanway.clearForm("ExceptionReasonForm");
	$("#ExceptionReasonForm").data('bootstrapValidator').resetForm();

	for (var item in json) {
		$("#" + item).val(json[item]);
	}

}

/**
 * 删除数据
 * */
function deleteExceptionReason(type){

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
	if (ids.length>0) {

        var msg = "确定删除选中的" + ids.split(",").length + "条不合格原因?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	} else {
//		alert("至少选择一条记录进行删除操作");
		lwalert("tipModal", 1, "至少选择一条记录进行删除操作！");
	}

}

function isSureDelete(type){

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
	deleteAjax(ids);
}
//删除Ajax
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/exceptionreason",
		data : {
			method:"deleteExceptionReason",
			"formData" : '{"exceptionids":"' + ids + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

			var tempData = $.parseJSON(text);
			if (tempData.code == "1") {

				com.leanway.clearTableMapData( "generalInfo" );
				oTable.ajax.reload(null,false);
				//$("#tableBody").empty();
			} else{
				lwalert("tipModal", 1, "操作失败！");
			}

			}
		}
	});
	//$("#tableBody").empty();
	//theFirstMouldData();
}
//格式化form数据
var formatFormJson = function(formData) {
	var reg = /,$/gi;
	var data = "{";
	for (var i = 0; i < formData.length; i++) {
		var tempVal =  formData[i].value;

		if (formData[i].name == "ledgerVal") {
			data += "\"" + formData[i].name + "\" : " + formData[i].value + ",";
		} else {
			data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
		}

	}
	data = data.replace(reg, "");
	data += "}";
	return data;
}


function saveExceptionReason(){


	$("#ExceptionReasonForm").data('bootstrapValidator').validate();

	if($('#ExceptionReasonForm').data('bootstrapValidator').isValid()){
		//将form 序列化
		var form  = $("#ExceptionReasonForm").serializeArray();
		var formData = formatFormJson(form);

		$.ajax({
			type : "post",
			url : "../../../../"+ln_project+"/exceptionreason?method=queryExceptionReasonExist",
			data : {
				conditions : formData
			},
			dataType : "text",
			success : function(data) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					var result = eval("(" + data + ")").resultObj;
					if (result == "0") {


						save(formData);

					} else {

	//					alert("该计量单位名称已存在");
						lwalert("tipModal", 1, "该不合格编码名称已存在！");
						return;
					}

				}
			},
			error : function(data) {
//				alert("保存失败！");
				lwalert("tipModal", 1, "保存失败！");
			}
		});


	}
}
function save(formData){

	$.ajax ( {
		type : "POST",
		url : "../../../../"+ln_project+"/exceptionreason",
		data : {

			method : ope,
			"formData" : formData,
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				if (tempData.code == "1") {

					com.leanway.clearTableMapData( "generalInfo" );

					$("#saveOrUpdateAId").attr({"disabled":"disable"});
					if(ope=="addExceptionReason"){
					    oTable.ajax.reload();
					}else{
					    oTable.ajax.reload(null,false);
					}

					com.leanway.formReadOnly("ExceptionReasonForm", readOnlyObj);
				}else{
					lwalert("tipModal", 1, "操作失败！");
				}

			}
		}
	});

};

