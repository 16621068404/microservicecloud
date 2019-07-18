
var clicktime = new Date();
	// 操作方法，新增或修改
var opeMethod = "addUnitConversion";

var oTable;

$(function() {

	//验证初始化
	initBootstrapValidator();
	// 初始化对象
	com.leanway.loadTags();
	//初始化表格
	oTable = initTable();
	//初始化表单可读
	com.leanway.formReadOnly("unitConversionForm");
	//初始化单位下拉框
	queryUnits();
	// 隐藏保存按钮
	$("#saveOrUpdateAId").attr({"disabled" : "disabled"});
	//com.leanway.dataTableCheckAll("unitConversionDataTable", "checkAll", "checkList");
});


//填写数据验证
function initBootstrapValidator() {

	$('#unitConversionForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {

					count1 : {
						validators : {
							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					count2 : {
						validators : {
							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					accuracy : {
						validators : {
							//notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.accuracy,
									com.leanway.reg.msg.accuracy)
						}
					},
					note : {
						validators : {
							//notEmpty : {},
							stringLength : {
								min : 1,
								max : 20
							}
						}
					},

				}
     });
}
function addUnitConversion() {
	opeMethod = "addUnitConversion";

	// 清空表单
	resetForm();
	com.leanway.removeReadOnly("unitConversionForm");
	$("#saveOrUpdateAId").removeAttr("disabled");
	com.leanway.dataTableUnselectAll("unitConversionDataTable","checkList");
	com.leanway.clearTableMapData( "unitConversionDataTable" );

}

//重置表单
function resetForm() {
	$('#unitConversionForm').each(function(index) {
		$('#unitConversionForm')[index].reset();
	});

	$("#unitConversionForm").data('bootstrapValidator').resetForm();
}

//查询计量单位
function queryUnits() {

	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/units",
		data : {
			method : "queryUnitsList",
			conditions : "{}"
		},
		dataType : "json",
		success : function(json) {

			var flag =  com.leanway.checkLogind(json);

			if(flag){

				//下拉框赋值
				setUnits(json.data);
			}
		},
		error : function(data) {

		}
	});
}

//初始化单位类型下拉框
var setUnits = function(data) {
	var html = "";

	for (var i in data) {
		//拼接option
		html +="<option value="+ data[i].unitsid+">"+ data[i].unitsname+"</option>";
	}

	$("#unitsid1").html(html);
	$("#unitsid2").html(html);
}

//初始化数据表格
var initTable = function() {
	var table = $('#unitConversionDataTable')
			.DataTable(
					{
						"ajax" : "../../../../"+ln_project+"/unitConversion?method=queryUnitConversion",
						//"iDisplayLength" : "10",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"scrollY":"215px",
						"bAutoWidth": true,  //宽度自适应
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",
						"columns" : [ {
							"data" : "unitconversionid"
						}, {
							"data" : "count1"
						}, {
							"data" : "unitsname1"
						}, {
							"data" : "count2"
						} ,{
							"data" : "unitsname2"
						},{
							"data" : "accuracy"
						},{
							"data" : "note"
						}],
						"aoColumns" : [
								{
									"mDataProp" : "unitconversionid",
									  "fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
	                                        $(nTd).html(
	                                        		 "<div id='stopPropagation"
													+ iRow
													+ "'>"
													+  "<input class='regular-checkbox' type='checkbox' id='" + sData
	                                                        + "' name='checkList' value='" + sData
	                                                        + "'><label for='" + sData
	                                                        + "'></label>");
                                            com.leanway.columnTdBindSelectNew(nTd,"unitConversionDataTable","checkList");
	                                    }
								}, {
									"mDataProp" : "count1"
								}, {
									"mDataProp" : "unitsname1"
								}, {
									"mDataProp" : "count2"
								},{
									"mDataProp" : "unitsname2"
								},{
									"mDataProp" : "accuracy"
								},{
									"mDataProp" : "note"
								}
						],

						"oLanguage" : {
							"sProcessing" : "正在加载中......",
							"sLengthMenu" : "每页显示 _MENU_ 条记录",
							"sZeroRecords" : "没有数据！",
							"sEmptyTable" : "表中无数据存在！",
							"sInfo" : "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
							"sInfoEmpty" : "显示0到0条记录",
							"sInfoFiltered" : "数据表中共为 _MAX_ 条记录",
							"sSearch" : "查询",
							"oPaginate" : {
								"sFirst" : "首页",
								"sPrevious" : "上一页",
								"sNext" : "下一页",
								"sLast" : "末页"
							}
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {
                            com.leanway.getDataTableFirstRowId("unitConversionDataTable", getUnitConversionById,"more","checkList");

							 // 点击dataTable触发事件
                          com.leanway.dataTableClickMoreSelect("unitConversionDataTable", "checkList", false,
                                oTable, getUnitConversionById,undefined,undefined,"checkAll");
                          com.leanway.dataTableCheckAllCheck('unitConversionDataTable', 'checkAll', 'checkList');

//								$('input[type="checkbox"]').icheck({
//									labelHover : false,
//									cursor : true,
//									checkboxClass : 'icheckbox_flat-blue',
//									radioClass : 'iradio_flat-blue'
//								});

						}

					});

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



//根据opeMethod的值进行保存或更新操作
function saveOrUpdate() {

	var t1 = document.getElementById("unitsid1");
    var unitsid1 = t1.options[t1.selectedIndex].value;
    var t2 = document.getElementById("unitsid2");
    var unitsid2 = t2.options[t2.selectedIndex].value;
	if(unitsid1==unitsid2){

		lwalert("tipModal", 1, "相同单位之间不能转换！");
		return;

	}
    var c1 = $("#count1").val();
    var c2 = $("#count2").val();
    var accuracy = $("#accuracy").val();
    if(c1==""||c1==null||c2==""||c2==null){
    	lwalert("tipModal", 1, "数量不能为空！");
		return;
    }

    var filter  = /^[0-9]{0,}\.{0,1}[0-9]{0,}$/;
    if(!filter.test(c1)||!filter.test(c2)){
    	lwalert("tipModal", 1, "数量请输入数字或小数点！");
		return;
    }

    var filter  = /^[0-9]{0,}\.{0,1}[0-9]{0,}$/;
    if(!filter.test(c1)||!filter.test(c2)){
    	lwalert("tipModal", 1, "数量请输入数字或小数点！");
		return;
    }

    var filter2 = /^[0-9]{0,1}$/;

    if(!filter2.test(accuracy)){
    	lwalert("tipModal", 1, "精确度请输入一位数字！");
		return;
    }
    $("#unitsid1").prop("disabled", false);
	$("#unitsid2").prop("disabled", false);
	var form = $("#unitConversionForm").serializeArray();
	var formData = formatFormJson(form);

	$("#unitConversionForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#unitConversionForm').data('bootstrapValidator').isValid()) { // 返回true、false

	if(opeMethod=="addUnitConversion"){

	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/unitConversion",
		data : {
			"method"   : "queryUnitConversionExist" ,
			conditions : formData
		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);

				if (tempData.resultObj == "0") {

					save(formData);
//					$("#saveOrUpdateAId").attr({"disabled":"disable"});
//					tabmap.clear();
//					colmap.clear();
//					oTable.ajax.reload();

				} else {

	//				alert("该单位转换已存在");
					lwalert("tipModal", 1, "该单位转换已存在！");

				}

			}
		},
		error : function(data) {
//			alert("保存失败！");
			lwalert("tipModal", 1, "保存失败！");
		}
	});
	}else{
		save(formData);
	}
	}
}

//根据opeMethod的值进行保存或更新操作
function save(formData) {

	$("#unitConversionForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#unitConversionForm').data('bootstrapValidator').isValid()) { // 返回true、false
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/unitConversion",
		data : {
			method : opeMethod,
			conditions : formData
		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				  var tempData = $.parseJSON(data);
				 
				  if (tempData.code == "1") {

					$("#saveOrUpdateAId").attr({"disabled":"disable"});
//					oTable.ajax.reload();
					if(opeMethod=="addUnitConversion"){
                        oTable.ajax.reload(); // 自动刷新dataTable
                    }else{
                        oTable.ajax.reload(null,false);
                    }
					lwalert("tipModal", 1,tempData.info);
					//getUnitConversionById(tempData.result.resultObj.unitconversionid);
				} else {

	//				alert(tempData.exception);
					lwalert("tipModal", 1,tempData.info);

				}

			}
		},
		error : function(data) {
//			alert("保存失败！");
			lwalert("tipModal", 1,"保存失败！");
		}
	});
	}
}

//显示编辑数据
function showEditUnitConversion() {
	var data = oTable.rows('.row_selected').data();

	if(data.length == 0) {
//		alert("请选择计量单位转换数据！");
		lwalert("tipModal", 1,"请选择计量单位转换数据！");
	}else if(data.length > 1) {
//		alert("只能选择一个计量单位转换修改！");
		lwalert("tipModal", 1,"只能选择一个计量单位转换修改！");
	} else {
		var unitconversionid = data[0].unitconversionid;

		$("#saveOrUpdateAId").removeAttr("disabled");
		com.leanway.removeReadOnly("unitConversionForm");
		//当选择数据修改将opeMethod的值改为updateUnitConversionByConditons
		opeMethod = "updateUnitConversionByConditons";
		
		$("#unitsid1").prop("disabled", true);
		$("#unitsid2").prop("disabled", true);
	}
}


//根据id查询数据信息在表单中显示
function getUnitConversionById(unitconversionid) {

	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/unitConversion",
		data : {
			method : "queryUnitConversionById",
			conditions : '{"unitconversionid":"' + unitconversionid + '"}'
		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var json = eval("(" + data + ")").resultObj;
				resetForm();
				setFormValue(json);
				$("#saveOrUpdateAId").attr({"disabled" : "disabled"});
				com.leanway.formReadOnly("unitConversionForm");

			}
		},
		error : function(data) {

		}
	});
}


//表单赋值
function setFormValue(data) {

	for ( var item in data) {
		$("#" + item).val(data[item]);
	}
}

//选中计量单位
function deleteUnitConversion(type) {
	// 拼接选中的checkbox
//	$("input[name='checkList']:checked").each(function(i, o) {
//		str += $(this).val();
//		str += ",";
//	});
    if (type == undefined || typeof(type) == "undefined") {
        type = 2;
    }
    var ids = com.leanway.getCheckBoxData(type, "unitConversionDataTable", "checkList");

	if (ids.length != 0) {
	    var msg = "确定删除选中的" + ids.split(",").length + "条计量单位转换吗?";

		lwalert("tipModal", 2,msg,"isSureDelete(" + type + ")");
//		var ids = str.substr(0, str.length - 1);
//		if (confirm("确定要删除选中的计量单位吗?")) {
//			deleteAjax(ids);
//		}
	} else {
//		alert("至少选择一条记录操作");
		lwalert("tipModal", 1,"至少选择一条记录操作！");
	}
}

function isSureDelete(type){
	// 拼接选中的checkbox
//	$("input[name='checkList']:checked").each(function(i, o) {
//		str += $(this).val();
//		str += ",";
//	});
    var ids = com.leanway.getCheckBoxData(type, "unitConversionDataTable", "checkList");

	deleteAjax(ids);
}

//删除计量单位Ajax
var deleteAjax = function(ids) {

	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/unitConversion",
		data : {
			method : "deleteUnitConversionByConditons",
			conditions : '{"unitConversionIds":"' + ids + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {


			var flag =  com.leanway.checkLogind(text);

			if(flag){

			   var tempData = $.parseJSON(text);

			   if (tempData.result.code == "1") {
					oTable.ajax.reload();
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1,"操作失败！");
				}

			}
		}
	});
}
