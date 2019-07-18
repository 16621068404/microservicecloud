
var clicktime = new Date();
	// 操作方法，新增或修改
var opeMethod = "addUnits";
var oTable;

$(function() {

	//验证
	initBootstrapValidator();
	// 初始化对象
	com.leanway.loadTags();
	//初始化表格
	oTable = initTable();
	//查询单位类型
	queryUnitsType();
	//计量单位全选
	//com.leanway.dataTableCheckAll("unitsDataTable", "checkAll", "checkList");
	com.leanway.formReadOnly("unitsForm");
	// 隐藏保存按钮
	$("#saveOrUpdateAId").attr({
		"disabled" : "disabled"
	});

	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchUnits);
});


//填写数据验证
function initBootstrapValidator() {

	$('#unitsForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {

					symbol : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 1,
								max : 20
							}
						}
					},
					barcode : {
						validators : {
							//notEmpty : {},
							stringLength : {
								min : 2,
								max : 20
							}
						}
					},

				}
});

}
function addUnits() {

	opeMethod = "addUnits";

	// 清空表单
	resetForm();
	com.leanway.removeReadOnly("unitsForm");
	com.leanway.dataTableUnselectAll("unitsDataTable","checkList");
	$("#saveOrUpdateAId").removeAttr("disabled");
	com.leanway.clearTableMapData( "unitsDataTable" );
}

function resetForm() {
	$('#unitsForm').each(function(index) {
		$('#unitsForm')[index].reset();
	});
	$("#unitsForm").data('bootstrapValidator').resetForm();
}


//查询默认的计量单位


//查询单位类型
function queryUnitsType() {
	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/units",
		data : {
			method : "queryUnitsType",
			conditions : "{}"
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				//下拉框赋值
				setUnitsType(data.unitsTypeResult);
			}
		},
		error : function(data) {

		}
	});
}



//初始化单位类型下拉框
var setUnitsType = function(data) {
	var html = "";

	for (var i in data) {
		//拼接option
		html +="<option value="+ data[i].codenum+">"+ data[i].codevalue+"</option>";
	}

	$("#unitsTypeId").html(html);
}

var searchUnits = function () {

	var searchVal = $("#searchValue").val();

	oTable.ajax.url("../../../../"+ln_project+"/units?method=queryUnits&searchValue=" + searchVal).load();
}

//初始化数据表格
var initTable = function() {
	var table = $('#unitsDataTable')
			.DataTable(
					{
						"ajax" : "../../../../"+ln_project+"/units?method=queryUnits",
						//"iDisplayLength" : "10",
						"scrollY":"370px",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"bAutoWidth": true,  //宽度自适应
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",

						"columns" : [ {
							"data" : "unitsid"
						}, {
							"data" : "unitsname"
						}, {
							"data" : "codevalue"
						}, {
							"data" : "note"
						} ,{
							"data" : "symbol"
						},{
							"data" : "shortname"
						}],
						"aoColumns" : [
								{
									"mDataProp" : "unitsid",
									  "fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
	                                        $(nTd).html(
	                                        		 "<div id='stopPropagation"
													+ iRow
													+ "'>"
													+ "<input class='regular-checkbox' type='checkbox' id='" + sData
	                                                        + "' name='checkList' value='" + sData
	                                                        + "'><label for='" + sData
	                                                        + "'></label>");
	                                         com.leanway.columnTdBindSelectNew(nTd,"unitsDataTable","checkList");
	                                    }
								}, {
									"mDataProp" : "unitsname"
								}, {
									"mDataProp" : "codevalue"
								}, {
									"mDataProp" : "note"
								},{
									"mDataProp" : "symbol"
								},{
									"mDataProp" : "shortname"
								}
						],

						"language" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {

							com.leanway.getDataTableFirstRowId("unitsDataTable", getUnitsById,"more","checkList");

							 // 点击dataTable触发事件
                           com.leanway.dataTableClickMoreSelect("unitsDataTable", "checkList", false,
                                 oTable, getUnitsById,undefined,undefined,"checkAll");

                           com.leanway.dataTableCheckAllCheck('unitsDataTable', 'checkAll', 'checkList');
//								$('input[type="checkbox"]').icheck({
//									labelHover : false,
//									cursor : true,
//									checkboxClass : 'icheckbox_flat-blue',
//									radioClass : 'iradio_flat-blue'
//								});
//
						}


					}).on('xhr.dt', function (e, settings, json) {
        				com.leanway.checkLogind(json);
        			} );

	return table;
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
 * 根据opeMethod的值进行保存或更新操作
 */
function saveOrUpdate() {

	var form = $("#unitsForm").serializeArray();
	var formData = formatFormJson(form);

	var unitsname= $("#unitsname").val();
	if(unitsname==""||unitsname==null){

		lwalert("tipModal", 1, "单位名称不能为空！");
		return;
	}

	$("#unitsForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#unitsForm').data('bootstrapValidator').isValid()) { // 返回true、false
	if(opeMethod=="addUnits"){

		$.ajax({
			type : "post",
			url : "../../../../"+ln_project+"/units",
			data : {
				"method"   : "queryUnitsExist",
				conditions : formData
			},
			dataType : "text",
			success : function(data) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					var result = eval("(" + data + ")").resultObj;
					if (result == "0") {


						save(formData);
						$("#saveOrUpdateAId").attr({"disabled":"disable"});
						oTable.ajax.reload();

					} else {

	//					alert("该计量单位名称已存在");
						lwalert("tipModal", 1, "该计量单位名称已存在！");
						return;
					}

				}
			},
			error : function(data) {
//				alert("保存失败！");
				lwalert("tipModal", 1, "保存失败！");
			}
		});
	}else{

	save(formData);
	}
	}

}


function save(formData) {

	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/units",
		data : {
			method : opeMethod,
			conditions : formData
		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			var tempData = $.parseJSON(data);

	           if (tempData.result.code == "1") {



						$("#saveOrUpdateAId").attr({"disabled":"disable"});

						com.leanway.formReadOnly("unitsForm");
						if(opeMethod=="addUnits"){
	                        oTable.ajax.reload(); // 自动刷新dataTable
	                    }else{
	                        oTable.ajax.reload(null,false);
	                    }

						getUnitsById(tempData.result.resultObj.unitsid);

					}else{
					lwalert("tipModal", 1, tempData.result.exception);
				}

			}
		},
		error : function(data) {
//			alert("保存失败！");
			lwalert("tipModal", 1, "保存失败！");
		}
	});
}

//显示编辑数据
function showEditUnits() {
	var data = oTable.rows('.row_selected').data();

	if(data.length == 0) {

		lwalert("tipModal", 1, "请选择计量单位！");
	} else if(data.length > 1) {

		lwalert("tipModal", 1, "只能选择一个计量单位进行修改！");
	}else {
		var unitsid = data[0].unitsid;

		$("#saveOrUpdateAId").removeAttr("disabled");

		com.leanway.removeReadOnly("unitsForm");
		$("#unitsname").prop("readonly", true)
		//当选择数据修改将opeMethod的值改为updateUnitsByConditons
		opeMethod = "updateUnitsByConditons";
	}
}

/**
 * 根据id查询数据信息在表单中显示
 */
var getUnitsById = function(unitsid){

	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/units",
		data : {
			method : "queryUnitsById",
			conditions : '{"unitsid":"' + unitsid + '"}'
		},
		dataType : "text",

		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var json = eval("(" + data + ")").resultObj;
				resetForm();
				setFormValue(json);
				$("#saveOrUpdateAId").attr({
					"disabled" : "disabled"
				});
				com.leanway.formReadOnly("unitsForm");

			}
		},
		error : function(data) {

		}
	});
}


//根据name查找计量单位
var queryUnitsByName = function() {

	var unitsname = $("#unitsname").val();
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/units",
		data : {
			method : "queryUnitsByName",
			conditions : '{"unitsname":"' + unitsname + '"}'
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				//重置表单数据
				//resetForm();
				//表单赋值
				setFormValue(data.unitsResult);

			}

		},
		error : function(data) {

		}
	});
}


function setFormValue(data) {

	for ( var item in data) {
		if (item != "searchValue") {

			$("#" + item).val(data[item]);
		}
	}


}

//选中计量单位
function deleteUnits(type) {

    if (type == undefined || typeof(type) == "undefined") {
        type = 2;
    }

    //获取选中的checkbox
    var ids = com.leanway.getCheckBoxData(type, "unitsDataTable", "checkList");

	if (ids.length != 0) {

	    var msg = "确定删除选中的" + ids.split(",").length + "条计量单位吗?";

		lwalert("tipModal", 2, msg,"isSureDelete(" + type + ")");

	} else {

		lwalert("tipModal", 1, "至少选择一条记录操作！");
	}
}

function isSureDelete(type){

    var ids = com.leanway.getCheckBoxData(type, "unitsDataTable", "checkList");

	deleteAjax(ids);
}

//删除计量单位Ajax
var deleteAjax = function(ids) {

	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/units",
		data : {
			method : "deleteUnitsByConditons",
			conditions : '{"unitsIds":"' + ids + '"}'
		},
		dataType : "text",
		async : false,

		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);

				  if (tempData.result.status == "success") {

					lwalert("tipModal", 1, "删除成功！");
					oTable.ajax.reload();

				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");
				}

			}
		}
	});
}

