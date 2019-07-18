
var clicktime = new Date();
	// 操作方法，新增或修改
var opeMethod = "addStanderProcedure";

var oTable;
var wTable;
var artWorkCenterTable;
$(function() {

	initBootstrapValidator();
	// 初始化对象
	com.leanway.loadTags();
	//初始化表格
	wTable = initWorkCenterTable();
	oTable = initTable();
	artWorkCenterTable = initArtWorkCenterTable();

	com.leanway.formReadOnly("standerProcedureForm");
	//查找时间单位
	queryTimeUnits();
	querySalaryUnits();

	// 隐藏保存按钮
	$("#saveOrUpdateAId").attr({
		"disabled" : "disabled"
	});

	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchStanderProcedure);

	com.leanway.enterKeyDown("workcentersearchValue",searchWorkCenter);

	com.leanway.enterKeyDown("artworkcentersearchValue",searchArtWorkCenter);

	$("#batchblanking0").prop("disabled",true);
	$("#batchblanking1").prop("disabled",true);

//	 if (window.screen.availHeight <= 768) {
//
//		 $("#pieceunitlabel").html('<span title="计件数量单位">计件单位</span>');
//
//	 }


});

//填写数据验证
function initBootstrapValidator() {

	$('#standerProcedureForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {

					procedurename : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 1,
								max : 20
							}
						}
					},
					shortname : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 1,
								max : 20
							}
						}
					},
					proceduredesc : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 1,
								max : 20
							}
						}
					},
					settingtime : {
						validators : {
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					preparetime : {
						validators : {
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					runtime : {
						validators : {
							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					waittingtime : {
						validators : {
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					handingtime : {
						validators : {
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					piecerate : {
						validators : {
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					pieceunit : {
						validators : {
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},

				}
});

}


var searchStanderProcedure = function () {

	var searchVal = $("#searchValue").val();

	oTable.ajax.url("../../../../"+ln_project+"/standerProcedure?method=queryStanderProcedure&searchValue=" + searchVal).load();
}

function addStanderProcedure() {

	opeMethod = "addStanderProcedure";
	// 清空表单
	resetForm();

	$("#saveOrUpdateAId").removeAttr("disabled");
	$("#resetFun").removeAttr("disabled");
	com.leanway.removeReadOnly("standerProcedureForm");
	com.leanway.dataTableUnselectAll("standerProcedureDataTable","checkList");
	com.leanway.dataTableUnselectAll("workCenterDataTable","workCenterCheckList");
    com.leanway.dataTableUnselectAll("artWorkCenterDataTable","artWorkCenterCheckList");
    com.leanway.clearTableMapData( "standerProcedureDataTable" );

}

//重置表单
function resetForm() {


	$("#batchblanking0").prop("disabled",false);
	$("#batchblanking1").prop("disabled",false);
	$('#standerProcedureForm').each(function(index) {
		$('#standerProcedureForm')[index].reset();
	});
	$("#standerProcedureForm").data('bootstrapValidator').resetForm();

}
//查询工作中心下拉框数据
function queryWorkCenter() {
	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/standerProcedure",
		data : {
			method : "queryWorkCenter",
			conditions : "{}"
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				//下拉框赋值
				setWorkCenter(data.workCenterResult);

			}
		},
		error : function(data) {

		}
	});
}

//查询时间单位下拉框数据
function queryTimeUnits() {
	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/units",
		data : {
		    method : "queryUnitsByUnitsTypeId",
            "unitsTypeId" : "时间单位"
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				//下拉框赋值
				setTimeUnits(data.timeUnitsResult);

			}

		},
		error : function(data) {

		}
	});
}
//工资单位下拉框
function querySalaryUnits() {
    $.ajax({
        type : "get",
        url : "../../../../"+ln_project+"/units",
        data : {
            method : "queryUnitsByUnitsTypeId",
            "unitsTypeId" : "工资单位"
        },
        dataType : "json",
        success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){
	            //下拉框赋值
	            setSalaryUnits(data.timeUnitsResult);
                }
        },
        error : function(data) {

        }
    });
}


//初始化时间单位下拉框
var setTimeUnits = function(data) {
	var html = "";

	for (var i in data) {
		//拼接option
		html +="<option value="+ data[i].unitsid+">"+ data[i].unitsname+"</option>";
	}

	$("#timeunitsid").html(html);
}

var setSalaryUnits = function(data) {
    var html = "";
//    html +="<option value=''></option>";
    for (var i in data) {
        //拼接option
        html +="<option value="+ data[i].unitsid+">"+ data[i].unitsname+"</option>";
    }

    $("#salaryunitsid").html(html);
}


//初始化标准工序数据表格
var initTable = function() {
	var table = $('#standerProcedureDataTable')
			.DataTable(
					{
						"ajax" : "../../../../"+ln_project+"/standerProcedure?method=queryStanderProcedure",
						//"iDisplayLength" : "10",
//						"scrollY":"250px",
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
							"data" : "procedureid"
						}, {
							"data" : "procedurename"
						}, {
							"data" : "shortname"
						}, {
							"data" : "proceduredesc"
						}],
						"aoColumns" : [
								{
									"mDataProp" : "procedureid",
									 "fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
	                                        $(nTd).html(

													"<div id='stopPropagation"
															+ iRow
															+ "'>"
															+"<input class='regular-checkbox' type='checkbox' id='" + sData
	                                                        + "' name='checkList' value='" + sData
	                                                        + "'><label for='" + sData
	                                                        + "'></label>");
                                            com.leanway.columnTdBindSelectNew(nTd,"standerProcedureDataTable","checkList");
	                                    }
								}, {
									"mDataProp" : "procedurename",
								}, {
									"mDataProp" : "shortname"
								}, {
									"mDataProp" : "proceduredesc"
								}
						],

						"oLanguage" : {
				        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
				         },
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {

                            com.leanway.getDataTableFirstRowId("standerProcedureDataTable", getStanderProcedureById,"more","checkList");

							 // 点击dataTable触发事件
                          com.leanway.dataTableClickMoreSelect("standerProcedureDataTable", "checkList", false,
                                  oTable, getStanderProcedureById,undefined,undefined,"checkAll");

                          com.leanway.dataTableCheckAllCheck('standerProcedureDataTable', 'checkAll', 'checkList');

						}

					}).on('xhr.dt', function (e, settings, json) {
						com.leanway.checkLogind(json);
					} );

	return table;
}


//初始化工作中心表格
var initWorkCenterTable = function() {

	var table = $('#workCenterDataTable')
			.DataTable(
					{
						"ajax" : "../../../../"+ln_project+"/standerProcedure?method=queryWorkCenter&centrtype=机器",
						// "iDisplayLength" : "10",
						"scrollY":"250px",
						'bPaginate' : false,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"bAutoWidth" : true, // 宽度自适应
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",
						"columns" : [ {
							"data" : "centerid"
						}, {
							"data" : "shorname"
						}, {
							"data" : "centrtype"
						} ],
						"aoColumns" : [
								{
									"mDataProp" : "centerid",

									  "fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
	                                        $(nTd).html(
	                                                "<input class='regular-checkbox' type='checkbox' id='" + sData
	                                                        + "' name='workCenterCheckList' value='" + sData
	                                                        + "'><label for='" + sData
	                                                        + "'></label>");
	                                    }
								}, {
									"mDataProp" : "shorname",

								}, {
									"mDataProp" : "centrtype",

								} ],

						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {

							// 点击dataTable触发事件
							com.leanway.dataTableClick(
									"workCenterDataTable",
									"workCenterCheckList", false,
									wTable);

						}

					}).on('xhr.dt', function (e, settings, json) {
						com.leanway.checkLogind(json);
					} );

	return table;
}

// 初始化人工工作中心表格
var initArtWorkCenterTable = function() {

	var table = $('#artWorkCenterDataTable')
			.DataTable(
					{
						"ajax" : "../../../../"+ln_project+"/standerProcedure?method=queryWorkCenter&centrtype=人工",
						"scrollY":"250px",
						'bPaginate' : false,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"bAutoWidth" : true, // 宽度自适应
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",
						"columns" : [ {
							"data" : "centerid"
						}, {
							"data" : "shorname"
						}, {
							"data" : "centrtype"
						} ],
						"aoColumns" : [
								{
									"mDataProp" : "centerid",

									 "fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
	                                        $(nTd).html(
	                                                "<input class='regular-checkbox' type='checkbox' id='" + sData
	                                                        + "' name='artWorkCenterCheckList' value='" + sData
	                                                        + "'><label for='" + sData
	                                                        + "'></label>");
	                                    }
								}, {
									"mDataProp" : "shorname",
								}, {
									"mDataProp" : "centrtype",
								} ],

								"oLanguage" : {
									"sUrl" : "../../../jslib/datatables/zh-CN.txt"
								},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {

						// 点击dataTable触发事件
						com.leanway.dataTableClick(
								"artWorkCenterDataTable",
								"artWorkCenterCheckList", false,
								artWorkCenterTable);

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
 * 保存前的条件判断
 */
function saveOrUpdate() {

	var form = $("#standerProcedureForm").serializeArray();
	var formData = formatFormJson(form);

	var procedurename= $("#procedurename").val();
	if(procedurename==""||procedurename==null){

		lwalert("tipModal", 1, "标准工序名称不能为空！");
		return;
	}

	var str = '';
	// 拼接选中的checkbox
	$("input[name='workCenterCheckList']:checked").each(function(i, o) {
		str += $(this).val();
		str += ",";
	});

	$("#standerProcedureForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#standerProcedureForm').data('bootstrapValidator').isValid()) { // 返回true、false
		if(opeMethod=="addStanderProcedure"){

			$.ajax({
				type : "post",
				url : "../../../../"+ln_project+"/standerProcedure?method=queryStanderProcedureExist",
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

									lwalert("tipModal", 1, "该标准工序名称已存在！");
									return;
								}

					}
				},
				error : function(data) {

					lwalert("tipModal", 1, "保存失败！");
				}
			});
		}else{

		save(formData);
		}

	}
}

/**
 * 根据opeMethod的值进行保存或更新操作
 */
function save(formData){


	var t = document.getElementById("timeunitsid");
    var timeunitsid = t.options[t.selectedIndex].value;
	if(timeunitsid==null||timeunitsid==""){
		lwalert("tipModal", 1, "请填写时间单位！");
		return;
	}

	var piecerate= $("#piecerate").val();
	var pieceunit= $("#pieceunit").val();
	if((piecerate!=""&&piecerate!=null)&&(pieceunit==""||pieceunit==null)){

		lwalert("tipModal", 1, "请填写计件数量单位！");
		return;
	}

	// 选中的工作中心
	var str = '';

	// 拼接选中的checkbox
	$("input[name='workCenterCheckList']:checked").each(function(i, o) {
		str += $(this).val();
	});

	// 选中的人工工作中心
	var artStr = '';

	// 拼接选中的checkbox
	$("input[name='artWorkCenterCheckList']:checked").each(function(i, o) {
		artStr += $(this).val();
	});

	if(str.length==0&&artStr.length==0){
		lwalert("tipModal", 1, "请选择工作中心！");
		return;
	}

	$("#standerProcedureForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#standerProcedureForm').data('bootstrapValidator').isValid()) { // 返回true、false
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/standerProcedure",
		data : {
			method : opeMethod,
			conditions : formData,
			workCenterIds : str,
			artWorkCenterIds : artStr

		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			      var tempData = $.parseJSON(data);

                  if (tempData.code == "1") {

                	 com.leanway.clearTableMapData( "standerProcedureDataTable" );
					$("#saveOrUpdateAId").attr({"disabled":"disable"});
					$("#standerProcedureForm").data('bootstrapValidator').resetForm();
					tabmap.clear();
					colmap.clear();
					if(opeMethod=="addStanderProcedure"){
                        oTable.ajax.reload(); // 自动刷新dataTable
                    }else{
                        oTable.ajax.reload(null,false);
                    }
					com.leanway.formReadOnly("standerProcedureForm");

					lwalert("tipModal", 1, "保存成功！");

				} else {

					lwalert("tipModal", 1, tempData.resultexception);

				}

			}
		},
		error : function(data) {

			lwalert("tipModal", 1, "保存失败！");
		}
	});
	}
}
//显示编辑数据
function showEditStanderProcedure() {

	var data = oTable.rows('.row_selected').data();

	if(data.length == 0) {

		lwalert("tipModal", 1, "请选择标准工序！");
	} else if(data.length > 1) {

		lwalert("tipModal", 1, "只能选择一个标准工序修改！");
	}else{

		var procedureid = data[0].procedureid;
		com.leanway.removeReadOnly("standerProcedureForm");

		$("#batchblanking0").prop("disabled",false);
		$("#batchblanking1").prop("disabled",false);
		$("#barcode").prop("readonly", true)
		$("#procedurename").prop("readonly", true)
		$("#saveOrUpdateAId").removeAttr("disabled");
		$("#resetFun").removeAttr("disabled");
		//当选择数据修改将opeMethod的值改为updateUnitsByConditons
		opeMethod = "updateStanderProcedureByConditons";


	}
}

/**
 * 根据id查询标准工序信息在表单中显示
 */
function getStanderProcedureById(procedureid) {

	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/standerProcedure",
		data : {
			method : "queryStanderProcedureById",
			conditions : '{"procedureid":"' + procedureid + '"}'
		},
		dataType : "json",
        success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				//重置表单数据
				resetForm();
				com.leanway.formReadOnly("standerProcedureForm");
				//表单赋值
				setFormValue(data.standerProcedureResult);
				com.leanway.dataTableUnselectAll("workCenterDataTable","workCenterCheckList");
				com.leanway.dataTableUnselectAll("artWorkCenterDataTable","artWorkCenterCheckList");
				//工作中心赋值
				setCenterValue(data.groupProcedureResult);
				setArtCenterValue(data.groupProcedureResult);

				// 隐藏保存按钮
				$("#saveOrUpdateAId").attr({
					"disabled" : "disabled"
				});
				$("#resetFun").attr({
					"disabled" : "disabled"
				});

			}

		},
		error : function(data) {

		}
	});
}



/**
 * 为表单赋值
 * @param data
 */
function setFormValue(data) {

	$("#batchblanking0").prop("disabled",true);
	$("#batchblanking1").prop("disabled",true);

	var radioNames = "batchblanking";

	for ( var item in data) {
		 if (item != "searchValue") {
			 if(radioNames.indexOf(item) != -1) {

					$("input[type=radio][name=" + item + "][value=" + data[item] + "]").prop('checked','true');
				} else {
					$("#" + item).val(data[item]);
				}
		 }


	}

}

/**
 * 回显工作中心
 * @param data
 */
function setCenterValue(data) {

	com.leanway.dataTableUnselectAll("workCenterDataTable","workCenterCheckList");

	var checkName = "workCenterCheckList";

	for ( var i = 0; i < data.length; i++) {
		var centerId = data[i].centerid;

		$('#workCenterDataTable').find('tbody tr').each( function (index, item ) {

			if($(this)[0].cells[0].children[0]!=undefined&&$(this)[0].cells[0].children[0]!="undefined"){
				var centerIdData = $(this)[0].cells[0].children[0].value;

				if (centerId == centerIdData) {

					$(this).addClass('row_selected');
					$(this).find('td').eq(0).find("input[name='workCenterCheckList']").prop("checked", true);

				}

			}
		});


	}
}

function setArtCenterValue(data) {

	var checkName = "artWorkCenterCheckList";

	for (var i = 0; i < data.length; i++) {
		var centerId = data[i].centerid;
		var codevalue = data[i].codevalue;

		$('#artWorkCenterDataTable')
				.find('tbody tr')
				.each(
						function(index, item) {

							if($(this)[0].cells[0].children[0]!=undefined&&$(this)[0].cells[0].children[0]!="undefined"){

								var centerIdData = $(this)[0].cells[0].children[0].value;

								if (centerId == centerIdData) {

									$(this).addClass('row_selected');
									$(this).find('td').eq(0).find(
											"input[name='artWorkCenterCheckList']")
											.prop("checked", true);

								}
							}
						});
	}
}

//选中标准工序
function deleteStanderProcedure(type) {

		// 拼接选中的checkbox
//		$("input[name='checkList']:checked").each(function(i, o) {
//			str += $(this).val();
//			str += ",";
//	});
    if (type == undefined || typeof(type) == "undefined") {
        type = 2;
    }

	var ids = com.leanway.getCheckBoxData(type, "standerProcedureDataTable", "checkList");

	if (ids.length != 0) {
	    var msg = "确定删除选中的" + ids.split(",").length + "条标准工序吗?";

		lwalert("tipModal", 2, msg,"isSureDelete(" + type + ")");

	} else {
		lwalert("tipModal", 1, "至少选择一条记录操作！");
	}
}

function isSureDelete(type){
	// 拼接选中的checkbox
//	$("input[name='checkList']:checked").each(function(i, o) {
//		str += $(this).val();
//		str += ",";
//	});
    var ids = com.leanway.getCheckBoxData(type, "standerProcedureDataTable", "checkList");

	deleteAjax(ids);
}

//删除标准工序Ajax
var deleteAjax = function(ids) {

	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/standerProcedure",
		data : {
			method : "deleteStanderProcedureByConditons",
			conditions : '{"standerProcedureIds":"' + ids + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
				 if (tempData.code == "1") {
					com.leanway.clearTableMapData( "standerProcedureDataTable" );
					oTable.ajax.reload();

				} else {

					lwalert("tipModal", 1, "操作失败！");
				}

			}
		}
	});
}


//根据name查找标准工序
var queryStanderProcedureByName = function() {

	var procedurename = $("#procedurename").val();
	//在这里添加非空判断，否则会出现异常
	if(procedurename!=null&&procedurename!=''){
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/standerProcedure",
		data : {
			method : "queryStanderProcedureByName",
			conditions : '{"procedurename":"' + procedurename + '"}'
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			if(data.standerProcedureResult!=undefined){

				//重置表单数据
				resetForm();
				//表单赋值
				setFormValue(data.standerProcedureResult);
				//工作中心赋值
				setCenterValue(data.groupProcedureResult);
				//人工工作中心赋值
				setArtCenterValue(data.groupProcedureResult);
			}


		  }
		},
		error : function(data) {

		}
	});}
}

/**
 * 搜索工作中心
 */
var searchWorkCenter = function() {
	//alert("123");
	var searchVal = $("#workcentersearchValue").val();

	wTable.ajax.url(
			"../../../../"+ln_project+"/standerProcedure?method=queryWorkCenter&searchValue="
					+ searchVal+"&centrtype="+"机器").load();
}
/**
 * 搜索人工工作中心
 */
var searchArtWorkCenter = function(){
	var searchVal = $("#artworkcentersearchValue").val();
	artWorkCenterTable.ajax.url(
			"../../../../"+ln_project+"/standerProcedure?method=queryWorkCenter&searchValue="
			+ searchVal+"&centrtype="+"人工").load();
}


