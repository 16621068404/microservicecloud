//改变checkbox形状
var clicktime = new Date();
var ope="addKeyProcess"
//数据table
var oTable;
var cataTable;
$(function() {
	initBootstrapValidator();
	})
function initBootstrapValidator() {
	$('#keyProcessForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					keyprocessname : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 1,
								max : 4
							}
						}
					},
				}
			});
}
var readOnlyObj = [{"id":"saveOrUpdate","type":"button"}];
$ ( function () {

	// 初始化对象
	com.leanway.loadTags();

	cataTable = initCatagoryTable();
	// 加载datagrid
	oTable = initTable();

	com.leanway.formReadOnly("keyProcessForm",readOnlyObj);

	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchKeyProcess);


});

var searchKeyProcess = function () {

	var searchVal = $("#searchValue").val();

	oTable.ajax.url("../../../"+ln_project+"/keyProcess?method=queryKeyProcessList&searchValue=" + searchVal).load();
}

//初始化数据表格
var initTable = function () {

	var table = $('#generalInfo').DataTable( {
			"ajax": "../../../"+ln_project+"/keyProcess?method=queryKeyProcessList",
			// "iDisplayLength" : "6",
	        'bPaginate': true,
	        "bDestory": true,
	        "bRetrieve": true,
	        "bFilter":false,
	        "bSort": false,
	        "scrollY":"320px",
	        "bProcessing": true,
	        "bServerSide": true,
	        'searchDelay':"5000",
	        "columns": [
                {"data" : "keyid"},
                { "data": "keyprocessname" }
	         ],
	         "aoColumns": [
	               {
	            	   "mDataProp": "keyid",
	                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
	                		$(nTd).html("<div id='stopPropagation" + iRow +"'>"
									   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                    + "' name='checkList' value='" + sData
                                    + "'><label for='" + sData
                                    + "'></label>");
							 com.leanway.columnTdBindSelectNew(nTd,"generalInfo","checkList");
	                   }
	               },
	               {"mDataProp": "keyprocessname"},
	          ],
	         "oLanguage" : {
	        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
	         },
	         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	         "fnDrawCallback" : function(data) {
					com.leanway.getDataTableFirstRowId("generalInfo", ajaxLoadKeyProcess,"more", "checkList");
					com.leanway.dataTableClickMoreSelect("generalInfo", "checkList", false,
                             oTable, ajaxLoadKeyProcess,undefined,undefined,"checkAll");
					com.leanway.dataTableCheckAllCheck('generalInfo', 'checkAll', 'checkList');

				}
	    } ).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );

	return table;
}


// 查询到右边显示
var ajaxLoadKeyProcess =function (keyid) {
		$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/keyProcess",
		data : {
			"method" : "queryKeyProcessObject",
			"keyid" : keyid,
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

            var flag =  com.leanway.checkLogind(data);
			if(flag){

				com.leanway.dataTableUnselectAll("generalCataInfo","checkCataList");

				var tempData = $.parseJSON(data);

				setFormValue(tempData.keyProcess);
				setCatagoryValue(tempData.keyCataResult);
			}
		}
	});
	com.leanway.formReadOnly("keyProcessForm",readOnlyObj);
}
// 填充到HTML表单
function setFormValue (data) {
	resetForm();
	for (var item in data) {
		  $("#" + item).val(data[item]);
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
var addKeyProcess = function() {

	 com.leanway.dataTableUnselectAll("generalCataInfo","checkCataList");
	//checkSession();
	ope="addKeyProcess";
	// 清空表单
	resetForm();
	com.leanway.removeReadOnly("keyProcessForm",readOnlyObj);
	com.leanway.dataTableUnselectAll("generalInfo", "checkList");
	com.leanway.dataTableUnselectAll("generalInfo", "checkAll");
	//初始化省

	com.leanway.clearTableMapData( "generalInfo" );
}

/**
 * 修改数据
 *
 * */
function updateKeyProcess() {

	ope="updateKeyProcess";

	var data = oTable.rows('.row_selected').data();
	if(data.length == 0) {

		lwalert("tipModal", 1, "请选择要修改的物料清单版本")
	} else if(data.length > 1) {

		lwalert("tipModal", 1, "只能选择一个物料清单进行修改")
	}else{

		com.leanway.removeReadOnly("keyProcessForm",readOnlyObj);
		$("#keyprocessname").prop("readonly", true);

	}
}

/**
 * 往里面存数据
 * */

var saveKeyProcess= function() {

	// 选中的工作中心
	var str = '';

	// 拼接选中的checkbox
	$("input[name='checkCataList']:checked").each(function(i, o) {
		str += $(this).val();
		str += ",";
	});

	var form  = $("#keyProcessForm").serializeArray();
	//后面确认时应 检测模具编号是否已存在
	var formData = formatFormJson(form);
	$("#keyProcessForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#keyProcessForm').data('bootstrapValidator').isValid()) { // 返回true、false
				$.ajax ( {
					type : "POST",
					url : "../../../"+ln_project+"/keyProcess",
					data : {
						"method":ope,
						"formData" : formData,
						catagoryIds : str,
					},
					dataType : "text",
					async : false,
					success : function ( data ) {

						var flag =  com.leanway.checkLogind(data);
                        var tempData = $.parseJSON(data);
						if(flag){

							if (tempData.status == "success") {

								com.leanway.clearTableMapData( "generalInfo" );

								com.leanway.formReadOnly("keyProcessForm",readOnlyObj);

								if(ope=="addKeyProcess"){
								    oTable.ajax.reload();
								}else{
								    oTable.ajax.reload(null,false);
								}
								lwalert("tipModal", 1, tempData.info);
							} else {

								lwalert("tipModal", 1,tempData.info);
							}
						}
					}
				});
	}
}

function deleteKeyProcess(type){

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}
	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");

	if (ids.length != 0) {

        //var msg = "确定删除选中的" + ids.length + "条物料清单版本?";
        var msg = "确定删除选中的" + ids.split(",").length + "条关键工序";
		lwalert("tipModal", 2, msg ,"isSure(" + type + ")");
		return;
	} else {
//		alert("至少选择一条记录进行删除操作");
		lwalert("tipModal", 1, "至少选择一条记录进行删除操作");
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
		url : "../../../"+ln_project+"/keyProcess?method=deleteKeyProcess",
		data : {
			"conditions" : '{"keyProcessIds":"' + ids + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

            var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
				if (tempData.code == "1") {

					com.leanway.clearTableMapData( "generalInfo" );

					resetForm();
					oTable.ajax.reload(null,false);
				} else {

					lwalert("tipModal", 1, "操作失败")
				}
			}
		}
	});
}
var resetForm = function () {
    $( '#keyProcessForm' ).each( function ( index ) {
        $('#keyProcessForm')[index].reset( );
    });
}


var initCatagoryTable = function () {

	var table = $('#generalCataInfo').DataTable( {
			"ajax": "../../../"+ln_project+"/productors?method=loadProductorcategoryid",
			// "iDisplayLength" : "6",
	        'bPaginate': false,
	        "bDestory": true,
	        "bRetrieve": true,
	        "bFilter":false,
	        "bSort": false,
	        "scrollY":"320px",
	        "bProcessing": true,
	        "bServerSide": true,
	        'searchDelay':"5000",
	        "columns": [
                {"data" : "productorcategoryid"},
                { "data": "categoryname" }
	         ],
	         "aoColumns": [
	               {
	            	   "mDataProp": "productorcategoryid",
	                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
	                	   $(nTd).html("<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='checkCataList' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label>");
						 com.leanway.columnTdBindSelectNew(nTd,"generalCataInfo", "checkCataList");
	                   }
	               },
	               {"mDataProp": "categoryname"},
	          ],
	         "oLanguage" : {
	        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
	         },
	         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	         "fnDrawCallback" : function(data) {
	        	// 点击dataTable触发事件
					com.leanway.dataTableClick(
							"generalCataInfo",
							"checkCataList", false,
							cataTable,undefined);
				}
	    } ).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );

	return table;
}


/**
 * 回显工作中心
 *
 * @param data
 */
function setCatagoryValue(data) {

	var checkName = "checkCataList";

	for (var i = 0; i < data.length; i++) {
		var productorcategoryid = data[i].productorcategoryid;

		$('#generalCataInfo')
				.find('tbody tr')
				.each(
						function(index, item) {

							var productorcategoryidData = $(this)[0].cells[0].children[0].value;
							if(productorcategoryidData != undefined && productorcategoryidData != "undefined"){


								if (productorcategoryid == productorcategoryidData) {

									$(this).addClass('row_selected');
									$(this).find('td').eq(0).find(
											"input[name='checkCataList']")
											.prop("checked", true);
								}
							}


						});

	}
}