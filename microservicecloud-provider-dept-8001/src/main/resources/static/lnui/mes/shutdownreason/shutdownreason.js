//改变checkbox形状
var clicktime = new Date();
var ope="addShutdownReason"
//数据table
var oTable;
$(function() {
	initBootstrapValidator();
	})
function initBootstrapValidator() {
	$('#shutdownReasonForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					reasoncode: {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 2,
								max : 10
							}
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
	com.leanway.formReadOnly("shutdownReasonForm");
	com.leanway.enterKeyDown("searchValue", searchShutdownReason);
	$("#saveOrUpdate").attr({
		"disabled" : "disabled"
	});

});

//初始化数据表格
var initTable = function () {

	var table = $('#generalInfo').DataTable( {
			"ajax": "../../../../"+ln_project+"/shutdownreason?method=queryShutDownReasonList",
			// "iDisplayLength" : "6",
			"scrollY":"250px",
	        'bPaginate': true,
	        "bDestory": true,
	        "bRetrieve": true,
	        "bFilter":false,
	        "bSort": false,
	        "bProcessing": true,
	        "bServerSide": true,
	        'searchDelay':"5000",
	        "columns": [
                {"data" : "shutdownreasonid"}
	         ],
	         "aoColumns": [
	               {
	            	   "mDataProp": "shutdownreasonid",
	                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
	                	   $(nTd).html("<div id='stopPropagation" + iRow +"'>"
								   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='checkList' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label>");
                           com.leanway.columnTdBindSelectNew(nTd,"generalInfo","checkList");
	                   }
	               },
	               {"mDataProp": "reasoncode"},
	          ],
	         "oLanguage" : {
	        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
	         },
	         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	         "fnDrawCallback" : function(data) {
					com.leanway.getDataTableFirstRowId("generalInfo", ajaxLoadShutdownReason,"more","checkList");
					 com.leanway.dataTableClickMoreSelect("generalInfo", "checkList", false,
                             oTable, ajaxLoadShutdownReason,undefined,undefined,"checkAll");

					 com.leanway.dataTableCheckAllCheck('generalInfo', 'checkAll', 'checkList');
				}
	    } ).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );

	return table;
}

// 查询到右边显示
var ajaxLoadShutdownReason =function (shutdownreasonid) {

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/shutdownreason",
		data : {
			"method" : "queryShutdownReasonObject",
			"shutdownreasonid" : shutdownreasonid,
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				$("#saveOrUpdate").attr({
					"disabled" : "disabled"
				});
				setFormValue(tempData.resultObj);

			}
		}
	});
	com.leanway.formReadOnly("shutdownReasonForm");
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
var addShutdownReason = function() {

	$("#saveOrUpdate").removeAttr("disabled");
	ope="addShutdownReason";
	// 清空表单
	resetForm();
	com.leanway.removeReadOnly("shutdownReasonForm");
	com.leanway.dataTableUnselectAll("generalInfo", "checkList");
	com.leanway.dataTableUnselectAll("generalInfo", "checkAll");
	//初始化省
	com.leanway.clearTableMapData( "generalInfo" );

}

/**
 * 修改数据
 *
 * */
function updateShutdownReason() {

	ope="updateShutdownReason";
	var data = oTable.rows('.row_selected').data();
	if(data.length == 0) {
		lwalert("tipModal", 1, "请选择要修改停机原因")
	} else if(data.length > 1) {
		lwalert("tipModal", 1, "只能选择一个停机原因进行修改")
	}else{
		com.leanway.removeReadOnly("shutdownReasonForm");
	}
}

/**
 * 往里面存数据
 * */

var saveShutdownReason= function() {

	var form  = $("#shutdownReasonForm").serializeArray();
	//后面确认时应 检测模具编号是否已存在
	var formData = formatFormJson(form);
	$("#shutdownReasonForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#shutdownReasonForm').data('bootstrapValidator').isValid()) { // 返回true、false
		if($("#categoryname").val()!=""){
				$.ajax ( {
					type : "POST",
					url : "../../../../"+ln_project+"/shutdownreason",
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
								if (tempData.code == "1") {
									com.leanway.formReadOnly("shutdownReasonForm");
									tabmap.clear();
									colmap.clear();
									if(ope=="addShutdownReason"){
				                        oTable.ajax.reload(); // 自动刷新dataTable
				                    }else{
				                        oTable.ajax.reload(null,false);
				                    }
									lwalert("tipModal", 1, "保存成功");
								} else {
									lwalert("tipModal", 1, "操作失败");
								}

						}
					}
				});
		}else{
			lwalert("tipModal", 1, "原因不能为空");
		}
	}
}

function deleteShutdownReason(type){

//	var str = '';
//	// 拼接选中的checkbox
//	$("input[name='checkList']:checked").each(function(i, o) {
//		str += $(this).val();
//		str += ",";
//	});
    if (type == undefined || typeof(type) == "undefined") {
        type = 2;
    }
    var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");

	if (ids.length != 0) {
	    var msg = "确定删除选中的" + ids.split(",").length + "条停机原因吗?";

		lwalert("tipModal", 2, msg,"isSure(" + type + ")");
	} else {
		lwalert("tipModal", 1, "至少选择一条记录进行删除操作");
	}
}

function isSure(type) {
	// 拼接选中的checkbox
//	$("input[name='checkList']:checked").each(function(i, o) {
//		str += $(this).val();
//		str += ",";
//	});
    var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");

	deleteAjax(ids);
}
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/shutdownreason?method=deleteShutdownReason",
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
					oTable.ajax.reload();
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败")
				}

			}
		}
	});
}
var resetForm = function () {
    $( '#shutdownReasonForm' ).each( function ( index ) {
        $('#shutdownReasonForm')[index].reset( );
    });
    $("#shutdownReasonForm").data('bootstrapValidator').resetForm();
}

function reasonNameIsExist(){

	var reasoncode= $("#reasoncode").val();
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/shutdownreason",
		data : {
			method : "reasonNameIsExist",
			"reasoncode":reasoncode,
		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				if(!tempData.valid){
					if(!document.getElementById("reasoncode").readOnly&&ope=="addShutdownReason"){
						lwalert("tipModal", 1, "停机原因已存在")
					$("#reasoncode").val("");
					$("input[name='reasoncode']").focus();
					}

			  }
			}
		},
		error : function(data) {

		}
	});
}
var searchShutdownReason= function () {

	var searchVal = $("#searchValue").val();

	oTable.ajax.url("../../../../"+ln_project+"/shutdownreason?method=queryShutDownReasonList&searchValue=" + searchVal).load();
}