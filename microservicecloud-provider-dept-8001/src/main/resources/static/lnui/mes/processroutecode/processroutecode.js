//改变checkbox形状
var clicktime = new Date();
//数据table
var oTable;
//产品类型码
/*com.leanway.reg.decimal.code = /^[a-zA-Z0-9]{0,}[.]{0,1}[a-zA-Z0-9]{0,}$/;
com.leanway.reg.msg.code = "请输入正确的工艺路线版本码";*/
//产品类型名称
com.leanway.reg.decimal.name =/^[\u0391-\uFFE5a-zA-Z0-9]{0,}$/;
com.leanway.reg.msg.name = "请输入正确的工艺路线版本名称";

com.leanway.reg.decimal.versiion =/^[a-zA-Z0-9]{0,}[.]{0,1}[a-zA-Z0-9]{0,}$/;
com.leanway.reg.msg.versiion = "请输入正确的工艺路线版本号";

function initBootstrapValidator() {
	$('#processForm').bootstrapValidator({
		excluded: [':disabled'],
		fields: {
			/*code : {
				validators : {
					notEmpty : {},
					regexp : com.leanway.reg.fun(
							com.leanway.reg.decimal.code,
							com.leanway.reg.msg.code)
				}
			},*/name : {
				validators : {
					notEmpty : {},
					regexp : com.leanway.reg.fun(
							com.leanway.reg.decimal.name,
							com.leanway.reg.msg.name)
				}
			},versiion : {
				validators : {
					notEmpty : {},
					regexp : com.leanway.reg.fun(
							com.leanway.reg.decimal.versiion,
							com.leanway.reg.msg.versiion)
				}
			}
		}
	});
}

$ ( function () {
	// 初始化对象
	com.leanway.loadTags();
	initBootstrapValidator();
	$("#saveOrUpdateAId").attr({
		"disabled" : "disabled"
	});
	$("#resetFun").attr({
		"disabled" : "disabled"
	});
	// 加载datagrid
	oTable = initTable();
	com.leanway.dataTableCheckAll("processDataTable", "checkAll", "checkList");
	//保存按钮绑定事件
	$("#saveMould").click(saveprocessif);
	//增加按钮清空表格数据(左边输入框的的数据全部清空)
	$("#addprocess").click( addprocess );
	//绑定删除按钮
	$("#deleteprocess").click(deleteprocess);
	//设置input不可用
	com.leanway.formReadOnly("processForm");

	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchProcessRouteCode);

});


var searchProcessRouteCode = function () {

	var searchVal = $("#searchValue").val();

	oTable.ajax.url("../../../"+ln_project+"/process?method=findAllprocess&searchValue=" + searchVal).load();
}

//初始化数据表格
var initTable = function() {
	var table = $('#processDataTable')
	.DataTable(
			{
				"ajax": "../../../"+ln_project+"/process?method=findAllprocess",
				//"iDisplayLength" : "10",
				'bPaginate' : true,
				"bDestory" : true,
				"bRetrieve" : true,
				"bFilter" : false,
				"bSort" : false,
				"sScrollY" : "57vh", // DataTables的高
				// "sScrollX" : 400, // DataTables的宽
				"bAutoWidth" : true, // 宽度自适应
				"bProcessing" : true,
				"bServerSide" : true,
				'searchDelay' : "5000",
				"columns" : [
				             {"data" : "routecodeid"},
				             { "data": "versiion"},
				             { "data": "name"},
				             ],
				             "aoColumns" : [
				                            {
				                            	"mDataProp" : "routecodeid",
				                            	"fnCreatedCell" : function(nTd, sData,
				                            			oData, iRow, iCol) {
				                            		$(nTd)
				                            		.html(
				                            				 "<div id='stopPropagation"
															+ iRow
															+ "'>"
															+"<input class='regular-checkbox' type='checkbox' id='"
				                            				+ sData
				                            				+ "' name='checkList' value='"
				                            				+ sData
				                            				+ "'><label for='"
				                            				+ sData
				                            				+ "'></label>");
				                            		com.leanway.columnTdBindSelectNew(nTd,"processDataTable","checkList");
				                            	}
				                            }, {
				                            	"mDataProp" : "versiion"
				                            }, {
				                            	"mDataProp" : "name"
				                            }],
				                            "oLanguage" : {
				                            	"sUrl" : "../../../jslib/datatables/zh-CN.txt"
				                            },
				                            "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
				                            "fnDrawCallback" : function(data) {

				                            	com.leanway.getDataTableFirstRowId("processDataTable", ajaxLoadprocess,"more", "checkList");

												 // 点击dataTable触发事件
					                           com.leanway.dataTableClickMoreSelect("processDataTable", "checkList", false,
					                                   oTable, ajaxLoadprocess,undefined,undefined,"checkAll");
					                           com.leanway.dataTableCheckAllCheck('processDataTable', 'checkAll', 'checkList');
				                            }
			}).on('xhr.dt', function (e, settings, json) {
				com.leanway.checkLogind(json);
			} );
	return table;
}


//查询到右边显示
var ajaxLoadprocess =function (routecodeid) {
	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/process?method=findAllprocessList",
		data : {
			"routecodeid" : routecodeid,
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				setFormValue(data);
				com.leanway.formReadOnly("processForm");
				$("#saveOrUpdateAId").attr({
					"disabled" : "disabled"
				});
				$("#resetFun").attr({
					"disabled" : "disabled"
				});

			}
		}
	});
}
//填充到HTML表单
function setFormValue (data) {
	resetForm();
	var json = eval("(" + data + ")");
	for (var item in json) {
		if (item != "searchValue") {
			$("#" + item).val(json[item]);
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


//新增时  弹出modal模态框
var addprocess = function() {
	$("#myModalLabel").html("添加产品类型");
	/*ope = "add";*/
	// 清空表单
	resetForm();
	//取消选中状态
	com.leanway.dataTableUnselectAll("processDataTable","checkList");
	//设置input可输入
	com.leanway.removeReadOnly("processForm");
	//将保存按钮表位可用
	$("#saveOrUpdateAId").removeAttr("disabled");
	$("#resetFun").removeAttr("disabled");
	//点击添加按钮，将id输入框的值为空
	/*document.getElementById("code").readOnly=false;*/
	document.getElementById("name").readOnly=false;
	document.getElementById("versiion").readOnly=false;
	$("#routecodeid").val("");
	com.leanway.clearTableMapData( "processDataTable" );
	/*document.getElementById("").value＝' ';*/
	/*$("input").eq(index).prop({"checked":false});
	$("input[name='chk_list']").prop("checked",false);*/

}

//删除数据
function deleteprocess(type){

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "processDataTable", "checkList");
	if (ids.length>0) {
        var msg = "确定删除选中的" + ids.split(",").length + "条工艺路线版本?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	} else {
//		alert("至少选择一条记录进行删除操作");
		lwalert("tipModal", 1, "至少选择一条记录进行删除操作！");
	}
}
function isSureDelete(type){

	var ids = com.leanway.getCheckBoxData(type, "processDataTable", "checkList");
	deleteAjax(ids);
}
//删除Ajax
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/process?method=deleteprocess",
		data : {
			"produids" : '{"routecodeid":"' + ids + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
	            if (tempData.result.code == "1") {
	            	com.leanway.clearTableMapData( "processDataTable" );
					oTable.ajax.reload(null,false);
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");
				}

			}
		}
	});
}
//修改产品类型
function modifyprodu() {
	routecodeid=$("#routecodeid").val();
	/*	document.getElementById("code").readOnly=false;*/
	document.getElementById("name").readOnly=false;
	document.getElementById("versiion").readOnly=false;
	if(routecodeid == "" || routecodeid == null || routecodeid =="null") {
//		alert("请选择要修改的产品类型！");
		lwalert("tipModal", 1, "请选择要修改的产品类型！");
	} else {
		//选中修改保存按钮变为可用
		$("#saveOrUpdateAId").removeAttr("disabled");
		$("#resetFun").removeAttr("disabled");
		//设置input可输入
		com.leanway.removeReadOnly("processForm");
	}
}

//点击保存时，先进行查询数据库是否已经存在
var saveprocessif = function() {
	$("#processForm").data('bootstrapValidator').validate();
	if($('#processForm').data('bootstrapValidator').isValid()){
		var reg=/,$/gi;
		var routecodeid= $("#routecodeid").val();
		var form = $("#processForm").serializeArray();

		var formData = formatFormJson(form);
		$.ajax ({
			type : "POST",
			url : "../../../"+ln_project+"/process?method=findprocess",
			data : {
				"formData" : formData,
			},
			dataType : "text",
			async : false,
			success : function ( data ) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					var tempData = $.parseJSON(data);
					if(tempData.count == 0) {
						saveprocess();
					}else{
						lwalert("tipModal", 1, "版本号和版本已经存在，不能进行保存");
					}

				}
			}
		});
//		}
	}else{
//		alert("你输入的有误!请检查是否正确后再点击保存按钮。");
		lwalert("tipModal", 1, "你输入的有误!请检查是否正确后再点击保存按钮！");
		return;
	}
}
/**
 * 往里面存数据
 * */
var saveprocess = function() {
	$("#processForm").data('bootstrapValidator').validate();
	if($('#processForm').data('bootstrapValidator').isValid()){
		var reg=/,$/gi;
		var routecodeid= $("#routecodeid").val();
		var code= $("#code").val();
		var name= $("#name").val();
		var versiion= $("#versiion").val();
		var form = $("#processForm").serializeArray();

		/*if(code==""||code==null){
			alert("工艺路线版本码不能为空");
			return;
		}else*/
		if(name=="" || name==null){
//			alert("工艺路线版本名称不能为空");
			lwalert("tipModal", 1, "工艺路线版本名称不能为空！");
			return;
		}else if(versiion=="" || versiion==null){
//			alert("工艺路线版本号不能为空");
			lwalert("tipModal", 1, "工艺路线版本号不能为空！");
			return;
		}else if(""==routecodeid || null==routecodeid){
			var formData = formatFormJson(form);
			$.ajax ({
				type : "POST",
				url : "../../../"+ln_project+"/process?method=addprocess",
				data : {
					"formData" : formData,
				},
				dataType : "text",
				async : false,
				success : function ( data ) {

					var flag =  com.leanway.checkLogind(data);

					if(flag){

						var tempData = $.parseJSON(data);
	                    if (tempData.result.code == "1") {
							resetForm();
							//设置按钮不可用，input输入框不可用
							buttonDisabled("#saveOrUpdateAId, #resetFun");
							com.leanway.formReadOnly("processForm");
							com.leanway.clearTableMapData( "processDataTable" );
							oTable.ajax.reload();
						} else {
	//						alert("操作失败");
							lwalert("tipModal", 1, "操作失败！");
						}

					}
				}
			});
		}else if(""==!routecodeid || null==!routecodeid){
			var formData = formatFormJson(form);
			$.ajax ({
				type : "POST",
				url : "../../../"+ln_project+"/process?method=updateprocess",
				data : {
					"formData" : formData,
				},
				dataType : "text",
				async : false,
				success : function ( data ) {

					var flag =  com.leanway.checkLogind(data);

					if(flag){

						var tempData = $.parseJSON(data);
						if (tempData.code == "1") {
							resetForm();
							//设置按钮不可用，input输入框不可用
							buttonDisabled("#saveOrUpdateAId, #resetFun");
							com.leanway.formReadOnly("processForm");
							com.leanway.clearTableMapData( "processDataTable" );
							oTable.ajax.reload(null,false);
						} else {
	//						alert("操作失败");
							lwalert("tipModal", 1, "操作失败！");
							return;
						}

					}
				}
			});
		}
	}else{
//		alert("你输入的有误!请检查是否正确后再点击保存按钮。");
		lwalert("tipModal", 1, "你输入的有误!请检查是否正确后再点击保存按钮！");
		return;
	}
}
//关闭modal
var closeForm = function () {
	$('#moldModal').modal('hide');
}
var resetForm = function () {
	$( '#processForm' ).each( function ( index ) {
		$('#processForm')[index].reset( );
	});
	$("#processForm").data('bootstrapValidator').resetForm();
}
//禁用button
function buttonDisabled(id) {
	$(id).attr({
		"disabled" : "disabled"
	});
}
/*//重置表单
var resetForm = function ( ) {
    $( '#produForm' ).each( function ( index ) {
    $('#produForm')[index].reset( );
    $("#productortypeid").val(null);
    });
}*/

