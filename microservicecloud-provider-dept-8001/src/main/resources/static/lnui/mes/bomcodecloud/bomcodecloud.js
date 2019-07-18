//改变checkbox形状
var clicktime = new Date();
var ope="addBomCode"
//数据table
var oTable;
$(function() {
	initBootstrapValidator();
	})
function initBootstrapValidator() {
	$('#bomCodeForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					code : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 2,
								max : 10
							}
						}
					},
					name : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 2,
								max : 10
							}
						}
					},
					versiion : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 2,
								max : 20
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
	// 加载datagrid
	oTable = initTable();
//	com.leanway.dataTableCheckAll("generalInfo", "checkAll", "checkList");
	com.leanway.formReadOnly("bomCodeForm",readOnlyObj);

	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchBomCode);

});

var searchBomCode = function () {

	var searchVal = $("#searchValue").val();

	oTable.ajax.url("../../../"+ln_project+"/bomCode?method=queryBomCodeList&searchValue=" + searchVal).load();
}

//初始化数据表格
var initTable = function () {

	var table = $('#generalInfo').DataTable( {
			"ajax": "../../../"+ln_project+"/bomCode?method=queryBomCodeList",
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
                {"data" : "bomcodeid"},
                { "data": "versiion" }
	         ],
	         "aoColumns": [
	               {
	            	   "mDataProp": "bomcodeid",
	                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
	                		$(nTd).html("<div id='stopPropagation" + iRow +"'>"
									   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                    + "' name='checkList' value='" + sData
                                    + "'><label for='" + sData
                                    + "'></label>");
							 com.leanway.columnTdBindSelectNew(nTd,"generalInfo","checkList");
	                   }
	               },
	               {"mDataProp": "versiion"},
	          ],
	         "oLanguage" : {
	        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
	         },
	         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	         "fnDrawCallback" : function(data) {
	        	 
		          	if (oTable.rows().data().length >= 1) {
		        		$("#addFun").hide();
		        	} else {
		        		$("#addFun").show();
		        	}
	          	
					com.leanway.getDataTableFirstRowId("generalInfo", ajaxLoadBomCode,"more", "checkList");
					 com.leanway.dataTableClickMoreSelect("generalInfo", "checkList", false,
                             oTable, ajaxLoadBomCode,undefined,undefined,"checkAll");
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
var ajaxLoadBomCode =function (bomcodeid) {
	
	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/bomCode",
		data : {
			"method" : "queryBomCodeObject",
			"bomcodeid" : bomcodeid,
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
	com.leanway.formReadOnly("bomCodeForm",readOnlyObj);
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
var addBomCode = function() {
	
	ope="addBomCode";
	// 清空表单
	resetForm();
	com.leanway.removeReadOnly("bomCodeForm",readOnlyObj);
	com.leanway.dataTableUnselectAll("generalInfo", "checkList");
	com.leanway.dataTableUnselectAll("generalInfo", "checkAll");
	//初始化省

	com.leanway.clearTableMapData( "generalInfo" );
}

/**
 * 修改数据
 *
 * */
function updateBomCode() {
	
	ope="updateBomCode";
	var data = oTable.rows('.row_selected').data();
	if(data.length == 0) {
//		alert("请选择要修改的物料清单！");
		lwalert("tipModal", 1, "请选择要修改的物料清单版本")
	} else if(data.length > 1) {
//		alert("只能选择一个物料清单进行修改！");
		lwalert("tipModal", 1, "只能选择一个物料清单进行修改")
	}else{
		com.leanway.removeReadOnly("bomCodeForm",readOnlyObj);
		document.getElementById("versiion").readOnly=true;
	}
}

/**
 * 往里面存数据
 * */

var saveBomCode= function() {
	
	var form  = $("#bomCodeForm").serializeArray();
	//后面确认时应 检测模具编号是否已存在
	var formData = formatFormJson(form);
	$("#bomCodeForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#bomCodeForm').data('bootstrapValidator').isValid()) { // 返回true、false
		if($("#versiion").val()!=""){
				$.ajax ( {
					type : "POST",
					url : "../../../"+ln_project+"/bomCode",
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

								com.leanway.clearTableMapData( "generalInfo" );

								com.leanway.formReadOnly("bomCodeForm",readOnlyObj);

								if(ope=="addBomCode"){
								    oTable.ajax.reload();
								}else{
								    oTable.ajax.reload(null,false);
								}
								lwalert("tipModal", 1, "保存成功");
							} else {
					//				alert("操作失败");
								lwalert("tipModal", 1, "操作失败");
							}
						}
					}
				});
		}else{
			lwalert("tipModal", 1, "版本号不能为空");
		}
	}
}

function deleteBomCode(type){

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
	if (ids.length != 0) {

        var msg = "确定删除选中的" + ids.split(",").length + "条物料清单版本?";

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
		url : "../../../"+ln_project+"/bomCode?method=deleteBomCode",
		data : {
			"conditions" : '{"bomCodeIds":"' + ids + '"}'
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
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败")
				}
			}
		}
	});
}
var resetForm = function () {
    $( '#bomCodeForm' ).each( function ( index ) {
        $('#bomCodeForm')[index].reset( );
    });
}

function versionIsExist(){
	
	var versiion= $("#versiion").val();
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/bomCode",
		data : {
			method : "versionIsExist",
			"versiion":versiion,
		},
		dataType : "text",
		success : function(data) {

            var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				if(!tempData.valid){
					if(!document.getElementById("versiion").readOnly){
	//				alert("版本号已存在");
						lwalert("tipModal", 1, "版本号已存在")
					$("#versiion").val("");
					$("input[name='versiion']").focus();
					}
			 }
			}
		},
		error : function(data) {

		}
	});
}