var clicktime = new Date();
// 操作方法，新增或修改工艺路线
var opeMethod = "addProcessRoute";

var opeLineMethod = "addProcessRouteLine";

var oTable;
var wTable;
var processRouteLineTable;
var artWorkCenterTable;
var readOnlyObj = [{"id":"linebalance","type":"radio"}];
var itree;
// 页面初始化
$(function() {

	initBootstrapValidator();
	// 初始化页面时只读
	com.leanway.formReadOnly("processRouteForm,processRouteLineForm",readOnlyObj);

	$("#equipmentid").attr("disabled", "disabled");
	$("#employeeid").attr("disabled", "disabled");
	$("#batchblanking0").prop("disabled",true);
	$("#batchblanking1").prop("disabled",true);
	$("#mainprocedure0").prop("disabled",true);
    $("#mainprocedure1").prop("disabled",true);
    $("#parallel0").prop("disabled",true);
    $("#parallel1").prop("disabled",true);
	// 初始化对象
	com.leanway.loadTags();

	// 初始化表格
	wTable = initWorkCenterTable();
	artWorkCenterTable = initArtWorkCenterTable();
	oTable = initTable();
	processRouteLineTable = initProcessRouteLineTable();

	// 查询计量单位下拉框数据
	queryInitUnits();
	// 查询工艺路线代码下拉框数据
	queryInitProcessRouteCode();
	// 查询路线代码下拉框数据
	queryInitMould();
	// 查找时间单位
	queryInitTimeUnits();
	//加载工资单位
	querySalaryUnits()
	// select2
	initSelect2("#productorname",
			"../../../"+ln_project+"/productors?method=queryProductorBySearch", "搜索产品");
	initSelect2("#procedureid",
			"../../../"+ln_project+"/standerProcedure?method=queryProcedureBySearch", "搜索标准工序");

	initSelect2("#equipmentid",
			"../../../"+ln_project+"/workCenter?method=queryEquipmentBySelect&type=1", "搜索设备台账");

	initSelect2("#employeeid",
			"../../../"+ln_project+"/workCenter?method=queryEquipmentBySelect&type=2", "搜索雇员");
	// 隐藏保存按钮
	$("#saveOrUpdateProcessRouteId").attr({
		"disabled" : "disabled"
	});
	$("#saveOrUpdateLineId").attr({
		"disabled" : "disabled"
	});

	//新增的工作中心enter键时
	com.leanway.enterKeyDown("workcentersearchValue",searchWorkCenter);
	com.leanway.enterKeyDown("artworkcentersearchValue",searchArtWorkCenter);
	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchProcessRoute);

	$("#batch").show();
	$("#time").hide();

	queryKeyProcess();
	

	// 初始化Bom
	initTreeBom();
	
});

function initBootstrapValidator() {
	$('#processRouteForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					shortname : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 1,
								max : 10
							}
						}
					},
					barcode : {
						validators : {
							//notEmpty : {},
							stringLength : {
								min : 2
							}
						}
					},
					code : {
						validators : {
							notEmpty : {},
						}
					},
				}

			});

	$('#processRouteLineForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {

					lineno : {
						validators : {
							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.amount,
									com.leanway.reg.msg.amount)
						}
					},
					settingtime : {
						validators : {
							//notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					preparetime : {
						validators : {
							//notEmpty : {},
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
							//notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					handingtime : {
						validators : {
							//notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},

					managerunit : {
						validators : {
							//notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},

					artificial : {
						validators : {
							// notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.amount,
									com.leanway.reg.msg.amount)
						}
					},

					artificialrate : {
						validators : {
							// notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.amount,
									com.leanway.reg.msg.amount)
						}
					},

					scheduleargs : {
						validators : {
							notEmpty : {},

						}
					},

					timewarnpercent : {
						validators : {
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					batchshiftcount : {
						validators : {
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
//					availableresources : {
//						validators : {
//							notEmpty : {},
//							regexp : com.leanway.reg.fun(
//									com.leanway.reg.decimal.amount,
//									com.leanway.reg.msg.amount)
//						}
//					},
				}
			});

}

var method = function(id) {
	processRouteLineTable.ajax
			.url(
					"../../../"+ln_project+"/processRoute?method=queryProcessRouteLineById&routeid="
							+ id).load();
}

/**
 * 工艺路线表头新增按钮触发方法
 */
function addProcessRoute() {

	opeMethod = "addProcessRoute";

	// 清空表单
	resetForm();
	resetProcessRouteLineForm();

	// 取消表格选中数据
	com.leanway.dataTableUnselectAll("processRouteDataTable", "checkList");
	com.leanway.dataTableUnselectAll("processRouteLineDataTable",
			"processRouteLineCheckList");
	com.leanway.dataTableUnselectAll("workCenterDataTable",
			"workCenterCheckList");
	com.leanway.dataTableUnselectAll("artWorkCenterDataTable",
			"artWorkCenterCheckList");

	com.leanway.removeReadOnly("processRouteForm",readOnlyObj);
//	$("#linebalance").prop("disabled", true);
//	$("#linebalance1").prop("disabled", true);
	document.getElementById("runtime1").readOnly=true;
	document.getElementById("handingtime1").readOnly=true;
	$("#timeunits").prop("disabled", true);
	document.getElementById("groupname").readOnly = true;
	$("#saveOrUpdateProcessRouteId").removeAttr("disabled");
	$("#processRouteForm").data('bootstrapValidator').resetForm();
	com.leanway.clearTableMapData( "processRouteDataTable" );
	
	$("html,body").animate({scrollTop:$("#processRouteForm").offset().top},500);
	
	var productorid = $.fn.zTree.getZTreeObj("treeBom").getSelectedNodes()[0].productorid;
	
	if (productorid != undefined  && typeof(productorid) !="undefined" && productorid != "undefined") {
		
		$("#name").val($.fn.zTree.getZTreeObj("treeBom").getSelectedNodes()[0].productorname);
		$("#productorid").val(productorid);
		var productorname = $.fn.zTree.getZTreeObj("treeBom").getSelectedNodes()[0].productorname;
		if (productorname != null && productorname != "" && productorname != "null") {
			$("#productorname").append(
					'<option value=' + productorid + '>' + productorname
							+ '</option>');

			$("#productorname").select2("val", [ productorid ]);
			//$("#name").val(productorname);
		}
		
	}
	
}

/**
 * 工艺路线行新增按钮触发方法
 */
function addProcessRouteLine() {


	var data = oTable.rows('.row_selected').data();

	if (data.length == 0) {

		lwalert("tipModal", 1, "请选择工艺路线后添加行数据！");
		return;
	} else if (data.length > 1) {

		lwalert("tipModal", 1, "只能选定一个工艺路线添加行数据！");
		return;
	}

	opeLineMethod = "addProcessRouteLine";
	// 清空表单
	resetProcessRouteLineForm();
	$("#equipmentid").attr("disabled", false);
	$("#employeeid").attr("disabled", false);

	$("#batchblanking0").prop("disabled",false);
	$("#batchblanking1").prop("disabled",false);
	$("#mainprocedure0").prop("disabled",false);
    $("#mainprocedure1").prop("disabled",false);
    $("#parallel0").prop("disabled",false);
    $("#parallel1").prop("disabled",false);

	var linebalance = $('input[name="linebalance"]:checked ').val();
//	var runtime = $("#runtime1").val();
//	var handingtime = $("#handingtime1").val();
//	$("#runtime").val(runtime);
//	$("#handingtime").val(handingtime);

	//取消选中
	com.leanway.dataTableUnselectAll("processRouteLineDataTable",
			"processRouteLineCheckList");
	com.leanway.dataTableUnselectAll("workCenterDataTable",
			"workCenterCheckList");
	com.leanway.dataTableUnselectAll("artWorkCenterDataTable",
			"artWorkCenterCheckList");
	$("#procedureid").val(null).trigger("change");
	$("#equipmentid").val(null).trigger("change");
	//$("#equipmentid").val("");
	$("#employeeid").val(null).trigger("change");// select2值给清空
	//$("#employeeid").val("");
	com.leanway.removeReadOnly("processRouteLineForm");

	// BY YZD
	//if(linebalance==1){
	//	document.getElementById("runtime").readOnly = true;
	//	document.getElementById("handingtime").readOnly = true;
	//	$("#timeunit").prop("disabled", true);
	//}
    document.getElementById("proceduredesc").readOnly = true;
	document.getElementById("groupname").readOnly = true;
	$("#saveOrUpdateLineId").removeAttr("disabled");
	$("#processRouteLineForm").data('bootstrapValidator').resetForm();

	com.leanway.clearTableMapData( "processRouteLineDataTable" );
	$("#scheduleargs").prop("disabled", false);
	$("#batch").show();
	$("#time").hide();
	initSelect2("#equipmentid",
			"../../../"+ln_project+"/workCenter?method=queryEquipmentBySelect&type=1", "搜索设备台账");
	initSelect2("#employeeid",
			"../../../"+ln_project+"/workCenter?method=queryEquipmentBySelect&type=2", "搜索雇员");

	var mainprocedure = $('input[name="mainprocedure"]:checked ').val();

	if(linebalance==0){
		$("#keyprocess").prop("disabled", true);
		$("#keyprocess").val("");
	}else{

		queryKeyProcess();
	}
	
	

}

function getKeyProcess(type){
	if(type==1){
		$("#keyprocess").prop("disabled", false);
		queryKeyProcess();
	}else{
		$("#keyprocess").prop("disabled", true);
		$("#keyprocess").val("");
	}
}

//搜索工艺路线
var searchProcessRoute = function() {

	var searchVal = $("#searchValue").val();

	oTable.ajax.url(
			"../../../"+ln_project+"/processRoute?method=queryProcessRoute&searchValue="
					+ searchVal).load();
}

/**
 * 初始化工艺路线表格
 */
var initTable = function() {
	var table = $('#processRouteDataTable')
			.DataTable(
					{
						"ajax" : "../../../"+ln_project+"/processRoute?method=queryProcessRoute",
						//"iDisplayLength" : "10",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
//						"scrollY":"250px",
						"bAutoWidth" : true, // 宽度自适应
						"bProcessing" : true,
						"bServerSide" : true,

						"columns" : [ {
							"data" : "routeid"
						}, {
							"data" : "name"
						}, {
							"data" : "routecode"
						}, {
							"data" : "shortname"
						} ],
//						"columnDefs": [ {
//						    "targets": 1,
//						    "data": "name",
//						    "render": function ( data, type, full, meta ) {
//						      return type === 'display' && data.length > 8 ?
//						        '<span title="'+data+'">'+data.substr( 0, 6 )+'...</span>' :
//						        data;
//						    }
//						  },
//						  {
//	                            "targets": 3,
//	                            "data": "shortname",
//	                            "render": function ( data, type, full, meta ) {
//	                              return type === 'display' && data.length > 8 ?
//	                                '<span title="'+data+'">'+data.substr( 0, 6 )+'...</span>' :
//	                                data;
//	                            }
//	                      } ],
						"aoColumns" : [
								{
									"mDataProp" : "routeid",
									 "fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
	                                        $(nTd).html(
	                                        		"<div id='stopPropagation"
													+ iRow
													+ "'>"
													+"<input class='regular-checkbox' type='checkbox' id='" + sData
	                                                        + "' name='checkList' value='" + sData
	                                                        + "'><label for='" + sData
	                                                        + "'></label>");
	                                        com.leanway.columnTdBindSelectNew(nTd,"processRouteDataTable", "checkList");
	                                    }
								}, {
									"mDataProp" : "name"
								}, {
									"mDataProp" : "routecode"
								}, {
									"mDataProp" : "shortname"
								} ],

						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {


		            		com.leanway.getDataTableFirstRowId("processRouteDataTable", queryProcessRouteById,"more", "checkList");
		            		com.leanway.getDataTableFirstRowId("processRouteDataTable", method,"more", "checkList");
							 // 点击dataTable触发事件
                           com.leanway.dataTableClickMoreSelect("processRouteDataTable", "checkList", false,
                                   oTable, queryProcessRouteById,undefined,undefined,"checkAll");

                           com.leanway.dataTableCheckAllCheck('processRouteDataTable', 'checkAll', 'checkList');
						}

					}).on('xhr.dt', function (e, settings, json) {
						com.leanway.checkLogind(json);
					} );
	return table;
}

// 初始化工艺路线行表格
var initProcessRouteLineTable = function() {

	var table = $('#processRouteLineDataTable')
			.DataTable(
					{
						"ajax" : "../../../"+ln_project+"/processRoute?method=queryProcessRouteLineById",
						/* "iDisplayLength" : "10", */
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
					/*	"scrollY":"250px",*/
						"bAutoWidth" : true, // 宽度自适应
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",
						"columns" : [ {
							"data" : "lineid"
						}, {
							"data" : "lineno"
						}, {
							"data" : "procedurename"
						} ],
						"aoColumns" : [
								{
									"mDataProp" : "lineid",

									 "fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
	                                        $(nTd).html(
	                                        		"<div id='stopPropagation"
													+ iRow
													+ "'>"
													+"<input class='regular-checkbox' type='checkbox' id='" + sData
	                                                        + "' name='processRouteLineCheckList' value='" + sData
	                                                        + "'><label for='" + sData
	                                                        + "'></label>");
	                                        com.leanway.columnTdBindSelectNew(nTd,"processRouteLineDataTable", "processRouteLineCheckList");
	                                    }

								}, {
									"mDataProp" : "lineno"
								}, {
									"mDataProp" : "procedurename"
								},{
									"mDataProp" : "proceduredesc"
								}
								],



						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {


							com.leanway.getDataTableFirstRowId("processRouteLineDataTable", getProcessRouteLineById,"more", "processRouteLineCheckList");
							 // 点击dataTable触发事件
                          com.leanway.dataTableClickMoreSelect("processRouteLineDataTable", "processRouteLineCheckList", false,
                        		  processRouteLineTable, getProcessRouteLineById,undefined,undefined,"checkAllProcessRouteLine");

                          com.leanway.dataTableCheckAllCheck('processRouteLineDataTable', 'checkAllProcessRouteLine', 'processRouteLineCheckList');

						}

					}).on('xhr.dt', function (e, settings, json) {
						com.leanway.checkLogind(json);
					} );

	return table;
}

// 初始化工作中心表格
var initWorkCenterTable = function() {

	var table = $('#workCenterDataTable')
			.DataTable(
					{
						"ajax" : "../../../"+ln_project+"/standerProcedure?method=queryWorkCenter&centrtype=机器",
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
	                                        $(nTd).html("<div id='stopPropagation" + iRow +"'>"
	                                        				+"<input class='regular-checkbox' type='checkbox' id='" + sData
	                                                        + "' name='workCenterCheckList' value='" + sData
	                                                        + "'><label for='" + sData
	                                                        + "'></label>");
	                                        com.leanway.columnTdBindSelectNew(nTd,"workCenterDataTable","workCenterCheckList");

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
			        		 com.leanway.dataTableClickMoreSelect("workCenterDataTable", "workCenterCheckList", false, wTable,loadGroup,undefined,undefined);
							// 点击dataTable触发事件
//							com.leanway.dataTableClick(
//									"workCenterDataTable",
//									"workCenterCheckList", false,
//									wTable,loadGroup);



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
						"ajax" : "../../../"+ln_project+"/standerProcedure?method=queryWorkCenter&centrtype=人工",
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
	                                        $(nTd).html("<div id='stopPropagation" + iRow +"'>"
	                                        				+"<input class='regular-checkbox' type='checkbox' id='" + sData
	                                                        + "' name='artWorkCenterCheckList' value='" + sData
	                                                        + "'><label for='" + sData
	                                                        + "'></label>");
	                                        com.leanway.columnTdBindSelectNew(nTd,"artWorkCenterDataTable","artWorkCenterCheckList");

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
//						com.leanway.dataTableClick(
//								"artWorkCenterDataTable",
//								"artWorkCenterCheckList", false,
//								artWorkCenterTable,loadArtGroup);
			        		 com.leanway.dataTableClickMoreSelect("artWorkCenterDataTable", "artWorkCenterCheckList", false, artWorkCenterTable,loadArtGroup,undefined,undefined);


					}
					}).on('xhr.dt', function (e, settings, json) {
						com.leanway.checkLogind(json);
					} );

	return table;
}


//根据选中的工作中心得到工作中心组
var loadArtGroup = function(centerid) {


	//$("#employeeid").val("");
	$("#employeeid").val(null).trigger("change");
	initSelect2("#employeeid",
			"../../../"+ln_project+"/workCenter?method=queryEquipmentBySelect&centerid="+centerid+"&type=2", "搜索雇员");

	// 选中的工作中心
	var str = '';

	// 拼接选中的checkbox
	$("input[name='workCenterCheckList']:checked").each(function(i, o) {
		str += $(this).val();
		//str += ",";
	});
	if(str.length>0){
		   return;
	}


	//alert(centerid);
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/workCenter",
		data : {
			"method" : "queryGroupByCenter",
			"centerid" : centerid
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				$("#groupid").val(data.workCenter.groupid);
				$("#groupname").val(data.workCenter.groupname);

			}
		}
	});

}

// 根据选中的工作中心得到工作中心组
var loadGroup = function(centerid) {

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/workCenter",
		data : {
			"method" : "queryGroupByCenter",
			"centerid" : centerid
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				$("#groupid").val(data.workCenter.groupid);
				$("#groupname").val(data.workCenter.groupname);

			}
		}
	});

	//$("#equipmentid").val("");
	$("#equipmentid").val(null).trigger("change");

    initSelect2("#equipmentid",
			"../../../"+ln_project+"/workCenter?method=queryEquipmentBySelect&centerid="+centerid+"&type=1", "搜索设备台账");

    queryAvailableresources(centerid);
}

// 初始化select2,
/**
 * id: 为要操作的对象 url: url text: 要在select中显示的文本
 */
function initSelect2(id, url, text) {

	$(id).select2({
		placeholder : text,
		allowClear: true,
		language : "zh-CN",
		ajax : {
			url : url,
			dataType : 'json',
			delay : 250,
			data : function(params) {
				return {
					q : params.term, // search term
					page : params.page,
					//pageSize : 200
				};
			},
			processResults : function(data, params) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					params.page = params.page || 1;
					return {
						results : data.items,
						pagination : {
							more : (params.page * 30) < data.total_count
						}

				}
				};
			},
			cache : false
		},
		escapeMarkup : function(markup) {
			return markup;
		},
		minimumInputLength : 1,
	});
}

// 触发select2选择事件，给隐藏域赋值
$("#productorname").on("select2:select", function(e) {
	$("#name").val($(this).find("option:selected").text());
	$("#productorid").val($(this).find("option:selected").val());
});

$("#equipmentid").on("select2:select", function(e) {
	var equipmentid = $(this).find("option:selected").val();
	var equipmentname = $(this).find("option:selected").text();
//	alert(equipmentid);
//	alert(equipmentname);
	$("#equipmentid").append(
			'<option value=' + equipmentid + '>' + equipmentname
					+ '</option>');
	$("#equipmentid").val($(this).find("option:selected").val());
});


$("#employeeid").on("select2:select", function(e) {
	var employeeid = $(this).find("option:selected").val();
	var empname = $(this).find("option:selected").text();

	$("#employeeid").append(
			'<option value=' + employeeid + '>' + empname
					+ '</option>');
	$("#employeeid").val($(this).find("option:selected").val());
});

$("#procedureid").on("select2:select", function(e) {

	$("#procedurename").val($(this).find("option:selected").text());

	var producedureid = $(this).find("option:selected").val()

    getStanderProcedureById(producedureid);

//	var linebalance = $('input[name="linebalance"]:checked ').val();
//	var routeid = $("#routeid").val();
//	if(linebalance==1){
//		queryProcessRouteData(routeid);
//	}
//
});




/**
 * 根据id查询标准工序信息在表单中显示
 */
function getStanderProcedureById(procedureid) {
	$.ajax({
		type : "get",
		url : "../../../"+ln_project+"/standerProcedure",
		data : {
			method : "queryStanderProcedureById",
			conditions : '{"procedureid":"' + procedureid + '"}'
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				// 表单赋值
				setProcessRouteLineFormValue(data.standerProcedureResult);
				$("#batchblanking0").prop("disabled",false);
			    $("#batchblanking1").prop("disabled",false);
			    $("#mainprocedure0").prop("disabled",false);
			    $("#mainprocedure1").prop("disabled",false);
			    $("#parallel0").prop("disabled",false);
			    $("#parallel1").prop("disabled",false);
				setGroupValue(data.groupresult);
				com.leanway.dataTableUnselectAll("workCenterDataTable","workCenterCheckList");
				com.leanway.dataTableUnselectAll("artWorkCenterDataTable","artWorkCenterCheckList");

				// 工作中心赋值
				setCenterValue(data.groupProcedureResult);
				setArtCenterValue(data.groupProcedureResult);
				$("#batch").show();
				$("#time").hide();

                var str="";
				// 拼接选中的checkbox
				$("input[name='workCenterCheckList']:checked").each(function(i, o) {
					str += $(this).val();
					//str += ",";
				});

				initSelect2("#equipmentid",
						"../../../"+ln_project+"/workCenter?method=queryEquipmentBySelect&centerid="+str+"&type=1", "搜索设备台账");

				// 选中的人工工作中心
				var artStr = '';

				// 拼接选中的checkbox
				$("input[name='artWorkCenterCheckList']:checked").each(function(i, o) {
					artStr += $(this).val();
					//artStr += ",";
				});

				initSelect2("#employeeid",
						"../../../"+ln_project+"/workCenter?method=queryEquipmentBySelect&centerid="+artStr+"&type=2", "搜索雇员");
			}
		},
		error : function(data) {

		}
	});
}


//function queryProcessRouteData(routeid) {
//
//	$.ajax({
//		type : "get",
//		url : "../../processRoute",
//		data : {
//			method : "queryProcessRouteById",
//			conditions : '{"routeid":"' + routeid + '"}'
//		},
//		dataType : "json",
//		success : function(data) {
//
//			$("#runtime").val(data.processRouteResult.runtime1);
//			$("#handingtime").val(data.processRouteResult.handingtime1);
//			console.info(data.processRouteResult);
//		},
//		    $("#timeunit").val(data.processRouteResult.timeunits);
//		error : function(data) {
//
//		}
//	});
//}

// 查询计量单位下拉框数据
function queryInitUnits() {
	$.ajax({
		type : "get",
		url : "../../../"+ln_project+"/units",
		data : {
			method : "queryInitUnits",
			conditions : "{}"
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){
				// 下拉框赋值
				setUnits(data.unitsResult);

			}
		},
		error : function(data) {

		}
	});
}
// 查询时间单位下拉框数据
function queryInitTimeUnits() {
	$.ajax({
		type : "get",
		url : "../../../"+ln_project+"/units",
		data : {
		    method : "queryUnitsByUnitsTypeId",
            "unitsTypeId" : "时间单位"
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				// 下拉框赋值
				setTimeUnits(data.timeUnitsResult);

			}
		},
		error : function(data) {

		}
	});
}

function querySalaryUnits() {
    $.ajax({
        type : "get",
        url : "../../../"+ln_project+"/units",
        data : {
            method : "queryUnitsByUnitsTypeId",
            "unitsTypeId" : "工资单位"
        },
        dataType : "json",
        success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

	            //重置表单数据
	            resetForm();

	            //下拉框赋值
	            setSalaryUnits(data.timeUnitsResult);

			}
        },
        error : function(data) {

        }
    });
}

var setSalaryUnits = function(data) {
    var html = "";
    html +="";
    for (var i in data) {
        //拼接option
        html +="<option value="+ data[i].unitsid+">"+ data[i].unitsname+"</option>";
    }

    $("#salaryunitsid").html(html);
}

// 初始化时间单位下拉框
var setTimeUnits = function(data) {
	var html = "";

	for ( var i in data) {
		// 拼接option
		html += "<option value=" + data[i].unitsid + ">" + data[i].unitsname
				+ "</option>";
	}

	$("#timeunit").html(html);
	$("#timeunits").html(html);
}

// 查询工艺路线代码下拉框数据
function queryInitProcessRouteCode() {
	$.ajax({
		type : "get",
		url : "../../../"+ln_project+"/process",
		data : {
			method : "queryInitProcessRouteCode",
			conditions : "{}"
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				// 下拉框赋值
				setProcessRouteCode(data.processRouteCodeResult);

			}
		},
		error : function(data) {

		}
	});
}

// 查询工艺路线代码下拉框数据
function queryInitMould() {
	$.ajax({
		type : "get",
		url : "../../../"+ln_project+"/mould",
		data : {
			method : "queryInitMould",
			conditions : "{}"
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				// 模具下拉框赋值
				setMould(data.mouldResult);

			}
		},
		error : function(data) {

		}
	});
}

/**
 * 清空工艺路线表头表单
 */
function resetForm() {

	com.leanway.formReadOnly("processRouteForm",readOnlyObj);
	$('#processRouteForm').each(function(index) {
		$('#processRouteForm')[index].reset();
	});

	$("#productorname").val(null).trigger("change"); // select2值给清空
	$("#processRouteForm").data('bootstrapValidator').resetForm();
	$("#processRouteForm input[type='hidden']").val("");
}

/**
 * 清空工艺路线行表单
 */
function resetProcessRouteLineForm() {


	$('#processRouteLineForm').each(function(index) {
		$('#processRouteLineForm')[index].reset();
	});

	$("#procedurename").val("");
	$("#procedureid").val(null).trigger("change"); // select2值给清空
	$("#equipmentid").val(null).trigger("change");
	//$("#employeeid").val("");
	$("#employeeid").val(null).trigger("change");
	$("#processRouteLineForm").data('bootstrapValidator').resetForm();
	$("#processRouteLineForm input[type='hidden']").val("");
}

// 初始化计量单位，工序单位下拉框
var setUnits = function(data) {
	var html = "";

	for ( var i in data) {

		// 拼接option
		html += "<option value=" + data[i].unitsid + ">" + data[i].unitsname
				+ "</option>";
	}
	$("#countunit").html(html);
	$("#roteunitsid").html(html);
}

// 初始化工艺路线代码下拉框
var setProcessRouteCode = function(data) {
	var html = "";

	for ( var i in data) {
		// 拼接option
		html += "<option value=" + data[i].routecodeid + ">" + data[i].versiion + "("+ data[i].name +")"
				+ "</option>";
	}

	$("#routecodeid").html(html);
}
// 初始化模具下拉框
var setMould = function(data) {
	var html = "";

	html += "<option value=" + " " + ">" + " "
	+ "</option>";

	for ( var i in data) {
		// 拼接option
		html += "<option value=" + data[i].mouldid + ">" + data[i].mouldname
				+ "</option>";
	}

	$("#mouldid").html(html);
}

/**
 * 回显工作中心
 *
 * @param data
 */
function setCenterValue(data) {
	// com.leanway.dataTableUnselectAll("workCenterDataTable","workCenterCheckList");

	var checkName = "workCenterCheckList";

	for (var i = 0; i < data.length; i++) {
		var centerId = data[i].centerid;
		 //alert(centerId);
		$('#workCenterDataTable')
				.find('tbody tr')
				.each(
						function(index, item) {

							if($(this)[0].cells[0].children[0]!=undefined&&$(this)[0].cells[0].children[0]!="undefined"){

								var centerIdData = $(this)[0].cells[0].children[0].children[0].value;

								if (centerId == centerIdData) {

									$(this).addClass('row_selected');
									$(this).find('td').eq(0).find(
											"input[name='workCenterCheckList']")
											.prop("checked", true);



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
		//alert(centerId)
		$('#artWorkCenterDataTable')
				.find('tbody tr')
				.each(
						function(index, item) {

							if($(this)[0].cells[0].children[0]!=undefined&&$(this)[0].cells[0].children[0]!="undefined"){

								var centerIdData = $(this)[0].cells[0].children[0].children[0].value;
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

// 保存工艺路线行前的条件判断
function saveOrUpdateLine() {


	var routeid = $("#routeid").val();
	if (routeid == "" || routeid == null) {
//		alert("请选择工艺路线后再添加行！");
		lwalert("tipModal", 1, "请选择工艺路线再添加行！");
		return;
	}

	var procedurename = $("#procedurename").val();
	if (procedurename == "" || procedurename == null) {
//		alert("工序编号不能为空");
		lwalert("tipModal", 1, "工序编号不能为空！");
		return;
	}

	var scheduleargs = $("#scheduleargs").val();
	var batchnumber = $("#batchnumber").val();
//	if(scheduleargs==1){
//		if(batchnumber == "" || batchnumber == null||batchnumber == 0){
//			lwalert("tipModal", 1, "请填写批量数量且大于0");
//			return;
//		}
//	}

	$("#processRouteLineForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#processRouteLineForm').data('bootstrapValidator').isValid()) { // 返回true、false

		$("#scheduleargs").prop("disabled", false);

		var form = $("#processRouteLineForm").serializeArray();
	    var formData = formatFormJson(form);


		saveLine(formData);
	}
}

// 根据opeLineMethod的值进行保存或更新操作
function saveLine(formData) {


	var piecerate= $("#piecerate").val();
	var pieceunit= $("#pieceunit").val();
	if((piecerate!=""&&piecerate!=null)&&(pieceunit==""||pieceunit==null)){
//		alert("标准工序名称不能为空");
		lwalert("tipModal", 1, "请填写计件数量单位！");
		return;
	}

	var equipmentid= $("#equipmentid").val();
	var employeeid= $("#employeeid").val();

	// 选中的工作中心
	var str = '';

	// 拼接选中的checkbox
	$("input[name='workCenterCheckList']:checked").each(function(i, o) {
		str += $(this).val();
		str += ",";
	});
	if(str!=''){
		str = str.substring(0,str.length-1);
	}
	// 选中的人工工作中心
	var artStr = '';

	// 拼接选中的checkbox
	$("input[name='artWorkCenterCheckList']:checked").each(function(i, o) {
		artStr += $(this).val();
		artStr += ",";
	});
	if(artStr!=''){
		artStr = artStr.substring(0,artStr.length-1);
	}
	if(str.length==0&&artStr.length==0){
		lwalert("tipModal", 1, "请选择工作中心！");
		return;
	}

	var routeid = $("#routeid").val();
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/processRoute",
		data : {
			method : opeLineMethod,
			conditions : formData,
			routeid : routeid,
			workCenterIds : str,
			artWorkCenterIds : artStr,
			employeeid : employeeid,
			equipmentid : equipmentid
		},

		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
	            if (tempData.status == "success") {

					$("#saveOrUpdateAId").attr({
						"disabled" : "disable"
					});
					com.leanway.clearTableMapData( "processRouteLineDataTable" );

					if(opeLineMethod=="addProcessRouteLine"){
						processRouteLineTable.ajax.reload();
					}else{
						processRouteLineTable.ajax.reload(null,false);
					}
					com.leanway.formReadOnly("processRouteLineForm",readOnlyObj);
					$("#processRouteLineForm").data('bootstrapValidator').resetForm();
	//				alert("保存成功");
					lwalert("tipModal", 1, tempData.info);
				} else {

	//				alert(tempData.exception);
					lwalert("tipModal", 1, tempData.info);

				}

			}
		},
		error : function(data) {
//			alert("保存失败！");
			lwalert("tipModal", 1, "保存失败！");
		}
	});
}

// 保存工艺路线前的条件判断
function saveOrUpdate() {

	var form = $("#processRouteForm").serializeArray();
	var formData = formatFormJson(form);

	var name = $("#name").val();

	var runtime1 = $("#runtime1").val();
	var handingtime1 = $("#handingtime1").val();
	var linebalance = $('input[name="linebalance"]:checked ').val();
	if (name == "" || name == null) {
//		alert("工艺路线名称不能为空");
		lwalert("tipModal", 1, "工艺路线名称不能为空！");
		return;
	}
	if (linebalance == 1) {
		if(handingtime1==""||runtime1==""){
			lwalert("tipModal", 1, "线装配状态为是时，运行时间和搬运时间不能为空！");
			return;
		}
	}
	$("#processRouteForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#processRouteForm').data('bootstrapValidator').isValid()) { // 返回true、false
		if (opeMethod == "addProcessRoute") {

			$.ajax({
				type : "post",
				url : "../../../"+ln_project+"/processRoute?method=queryProcessRouteExist",
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

	//						alert("该工艺路线已存在");
							lwalert("tipModal", 1, "该工艺路线已存在！");
							return;
						}

					}
				},
				error : function(data) {
//					alert("保存失败！");
					lwalert("tipModal", 1, "保存失败！");
				}
			});
		} else {
			save(formData);
		}

	}

}

/**
 * 根据opeMethod的值进行保存或更新操作
 */
function save(formData) {

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/processRoute",
		data : {
			method : opeMethod,
			conditions : formData,

		},

		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){


					var tempData = $.parseJSON(data);
		           if(tempData.status == "fail"){

		        	   lwalert("tipModal", 1, tempData.info);

					}else if (tempData.status == "success") {

						com.leanway.clearTableMapData( "processRouteDataTable" );
						if(opeMethod=="addProcessRoute"){
						    oTable.ajax.reload();
						}else{
						    oTable.ajax.reload(null,false);
						}
						$("#saveOrUpdateProcessRouteId").attr({
							"disabled" : "disable"
						});
						$("#routeid").val(tempData.result.resultObj.routeid);

						com.leanway.formReadOnly("processRouteForm",readOnlyObj);
						$("#processRouteForm").data('bootstrapValidator').resetForm();
						lwalert("tipModal", 1, tempData.info);

					}

			}
		},
		error : function(data) {
//			alert("保存失败！");
			lwalert("tipModal", 1, "保存失败！");
		}
	});
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

// 根据id查询工艺路线表头信息在表单中显示
function queryProcessRouteById(routeid) {

	$("#saveOrUpdateProcessRouteId").attr({
		"disabled" : "disabled"
	});
	$.ajax({
		type : "get",
		url : "../../../"+ln_project+"/processRoute",
		data : {
			method : "queryProcessRouteById",
			conditions : '{"routeid":"' + routeid + '"}'
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				//取消选中
				com.leanway.dataTableUnselectAll("processRouteLineDataTable","processRouteLineCheckList");
		        com.leanway.dataTableUnselectAll("workCenterDataTable","workCenterCheckList");
		        com.leanway.dataTableUnselectAll("artWorkCenterDataTable","artWorkCenterCheckList");
				method(routeid);
				// 重置表单数据
				resetForm();
				// 表单赋值
				setFormValue(data.processRouteResult);

			}


		},
		error : function(data) {

		}
	});
}

/**
 * 根据id查询工艺路线行信息在表单中显示
 */
function getProcessRouteLineById(lineid) {

	$.ajax({
		type : "get",
		url : "../../../"+ln_project+"/processRoute",
		data : {
			method : "queryProcessRouteLineByLineid",
			conditions : '{"lineid":"' + lineid + '"}'
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

					 resetProcessRouteLineForm();

					 $("#equipmentid").val(null).trigger("change");
					 //$("#employeeid").val("");
					 $("#employeeid").val(null).trigger("change");
					 com.leanway.formReadOnly("processRouteLineForm",readOnlyObj);
					 com.leanway.dataTableUnselectAll("workCenterDataTable","workCenterCheckList");
				     com.leanway.dataTableUnselectAll("artWorkCenterDataTable","artWorkCenterCheckList");
					// 表单赋值
					setProcessRouteLineFormValue(data.processRouteLineResult);

					// 模具赋值
					setMouldValue(data.routeMouldResult);
					// 工作中心赋值
					setCenterValue(data.routeCenterResult);
					//setArtCenterValue(data.routeArtCenterResult);
					setArtCenterValue(data.artRouteCenterResult);

					$("#saveOrUpdateLineId").attr({
						"disabled" : "disabled"
					});

					var str = '';

					// 拼接选中的checkbox
					$("input[name='workCenterCheckList']:checked").each(function(i, o) {
						str += $(this).val();
						//str += ",";
					});


					initSelect2("#equipmentid",
							"../../../"+ln_project+"/workCenter?method=queryEquipmentBySelect&centerid="+str+"&type=1", "搜索设备台账");


					// 选中的人工工作中心
					var artStr = '';

					// 拼接选中的checkbox
					$("input[name='artWorkCenterCheckList']:checked").each(function(i, o) {
						artStr += $(this).val();
						//artStr += ",";
					});

					initSelect2("#employeeid",
							"../../../"+ln_project+"/workCenter?method=queryEquipmentBySelect&centerid="+artStr+"&type=2", "搜索雇员");


					routeCenter = data.routeCenterResult;


					for (var i = 0; i < routeCenter.length; i++) {

						var equipmentid = routeCenter[i].defaultid;
						var equipmentname = routeCenter[i].equipmentname;

						//$("#equipmentid").val(equipmentid);
							if (equipmentid != null && equipmentid != "" && equipmentid != "null") {
								$("#equipmentid").append(
										'<option value=' + equipmentid + '>' + equipmentname
												+ '</option>');
								$("#equipmentid").select2("val", [ equipmentid ]);
							}
						}


					artRouteCenter = data.artRouteCenterResult;

					for (var i = 0; i < artRouteCenter.length; i++) {

						var equipmentid = artRouteCenter[i].defaultid;
						var equipmentname = artRouteCenter[i].equipmentname;

						//$("#employeeid").val(equipmentid);
						if (equipmentid != null && equipmentid != "" && equipmentid != "null") {
							$("#employeeid").append(
									'<option value=' + equipmentid + '>' + equipmentname
											+ '</option>');
							$("#employeeid").select2("val", [ equipmentid ]);
						}
					}

					$("#equipmentid").attr("disabled", "disabled");
					$("#employeeid").attr("disabled", "disabled");

			}

		},
		error : function(data) {

		}
	});
}

// 显示工艺路线表头编辑数据
function showEditProcessRoute() {

	var data = oTable.rows('.row_selected').data();

	if (data.length == 0) {
//		alert("请选择工艺路线！");
		lwalert("tipModal", 1, "请选择工艺路线！");
	} else if (data.length > 1) {
//		alert("只能选择一条工艺路线修改！");
		lwalert("tipModal", 1, "只能选择一个工艺路线修改！");
	} else {
		var routeid = data[0].routeid;

		com.leanway.removeReadOnly("processRouteForm",readOnlyObj);

		$("#productorname").attr("disabled", "disabled");
		$("#linebalance").prop("disabled", false);
		$("#linebalance1").prop("disabled", false);
		var linebalance = $('input[name="linebalance"]:checked ').val();
		if(linebalance==0){
			document.getElementById("runtime1").readOnly = true;
			document.getElementById("handingtime1").readOnly = true;
			$("#timeunits").prop("disabled", true);
		}
		// 当选择数据修改将opeMethod的值改为updateUnitsByConditons
		opeMethod = "updateProcessRouteByConditons";
		$("#saveOrUpdateProcessRouteId").removeAttr("disabled");
		
		$("html,body").animate({scrollTop:$("#processRouteForm").offset().top},500);
	}
}

// 显示工艺路线行编辑数据
function showEditProcessRouteLine() {


	$("#equipmentid").attr("disabled", false);
	$("#employeeid").attr("disabled", false);

	var linebalance = $('input[name="linebalance"]:checked ').val();

	$("#batchblanking0").prop("disabled",false);
	$("#batchblanking1").prop("disabled",false);
	$("#mainprocedure0").prop("disabled",false);
    $("#mainprocedure1").prop("disabled",false);
    $("#parallel0").prop("disabled",false);
    $("#parallel1").prop("disabled",false);
	var data = processRouteLineTable.rows('.row_selected').data();

	if (data.length == 0) {
//		alert("请选择工艺路线行！");
		lwalert("tipModal", 1, "请选择工艺路线行！");
	} else if (data.length > 1) {
//		alert("只能选择一条工艺路线行修改！");
		lwalert("tipModal", 1, "只能选择一个工艺路线行修改！");
	} else {
		var lineid = data[0].lineid;

		com.leanway.removeReadOnly("processRouteLineForm");
		$("#procedureid").attr("disabled", "disabled");
		$("#scheduleargs").prop("disabled", true);
		document.getElementById("groupname").readOnly = true;
		document.getElementById("lineno").readOnly = true;
		document.getElementById("proceduredesc").readOnly = true;

		// BY YZD
		//if(linebalance==1){
		//	document.getElementById("runtime").readOnly=true;
		//	document.getElementById("handingtime").readOnly=true;
		//	$("#timeunit").prop("disabled", true);
		//}

		var mainprocedure = $('input[name="mainprocedure"]:checked ').val();
		if(mainprocedure==1){
			$("#keyprocess").prop("disabled", false);
			//queryKeyProcess();
		}else{
			$("#keyprocess").prop("disabled", true);
			$("#keyprocess").val("");
		}

		//$("#groupname").prop("readonly", true);
		// 当选择数据修改将opeMethodLine的值改为updateUnitsByConditons
		opeLineMethod = "updateProcessRouteLineByConditons";
		$("#saveOrUpdateLineId").removeAttr("disabled");
	}
}

// 为工艺路线表单赋值
function setFormValue(data) {
	resetForm();

	var radioNames = "linebalance";
	for ( var item in data) {
		if (item != "searchValue") {
			if(radioNames.indexOf(item) != -1) {

				$("input[type=radio][name=" + item + "][value=" + data[item] + "]").prop('checked',true);
			} else {
				$("#" + item).val(data[item]);
			}
		}

	}
    //alert($("#name").val());
	// 给select2赋初值
	var productorname = data.name;
	if (productorname != null && productorname != "" && productorname != "null") {
		$("#productorname").append(
				'<option value=' + productorname + '>' + data.name
						+ '</option>');

		$("#productorname").select2("val", [ productorname ]);
		//$("#name").val(productorname);
	}
}

// 为工艺路线行表单赋值
function setProcessRouteLineFormValue(data) {
	if(data==null||data=="null"){
		return;
	}
	 
	resetProcessRouteLineForm();
	var linebalance = $('input[name="linebalance"]:checked ').val();
	var runtime = $('#runtime1').val();
	var handingtime = $('#handingtime1').val();
	var timeunits = $('#timeunits').val();
	$("#batchblanking0").prop("disabled",true);
	$("#batchblanking1").prop("disabled",true);
	$("#mainprocedure0").prop("disabled",true);
    $("#mainprocedure1").prop("disabled",true);
    $("#parallel0").prop("disabled",true);
    $("#parallel1").prop("disabled",true);


	var radioNames = "batchblanking";

	for ( var item in data) {
		//alert(item);
		if(radioNames.indexOf(item) != -1) {
			//alert(item);
			$("input[type=radio][name=" + item + "][value=" + data[item] + "]").prop('checked','true');
		} if("mainprocedure".indexOf(item) != -1){
		    $("input[type=radio][name=" + item + "][value=" + data[item] + "]").prop('checked','true');
		}else if("parallel".indexOf(item) != -1){
			 $("input[type=radio][name=" + item + "][value=" + data[item] + "]").prop('checked','true');
		}else if(item == "runtime"){

			// BY YZD
			//if(linebalance==0){
				$("#" + item).val(data[item]);
			//}else{
			//	$("#" + item).val(runtime);
			//}

		}else if(item == "handingtime"){

			// BY YZD
			//if(linebalance==0){
				$("#" + item).val(data[item]);
			//}else{
			//	$("#" + item).val(handingtime);
			//}
		}else if(item == "timeunitsid"){

			// BY YZD
			//if(linebalance==0){

				$("#timeunit").val(data[item]);
			//}else{

				//$("#timeunit").val(timeunits);
			//}
		}else{

			 if (item != "searchValue") {
				 $("#" + item).val(data[item]);
			 }

		}

	}
	if(data.scheduleargs==1){
		$("#batch").show();
		$("#time").hide();
	}else{
		$("#batch").hide();
		//$("#timing").show();
	}

	if(data.scheduleargs==2){
		$("#batch").hide();
		$("#time").show();
		//$("#timing").val(data.timing);
	}else{
		//$("#batch").show();
		$("#time").hide();
	}
	// 给select2赋初值
	var procedureid = data.procedureid;
	if (procedureid != null && procedureid != "" && procedureid != "null") {
		$("#procedureid").append(
				'<option value=' + procedureid + '>' + data.procedurename
						+ '</option>');
		$("#procedureid").select2("val", [ procedureid ]);
	}

	var mainprocedure = $('input[name="mainprocedure"]:checked ').val();
	if(mainprocedure==0){
//		/$("#keyprocess").prop("disabled", true);
		$("#keyprocess").val("");
	}

}

// 模具回显
function setMouldValue(data) {

	var mouldName = "mouldid";

	for ( var item in data) {
		// alert(data[item]);
		 if (item != "searchValue") {
			 if (mouldName.indexOf(item) != -1) {
					$("#" + item).val(data[item]);
				}
		 }


	}
}
// 选中工艺路线(删除)
function deleteProcessRoute(type) {

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "processRouteDataTable", "checkList");

	if (ids.length>0) {
        var msg = "确定删除选中的" + ids.split(",").length + "条工艺路线?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	} else {
//		alert("至少选择一条记录操作");
		lwalert("tipModal", 1, "至少选择一条记录进行操作！");
	}
}

function isSureDelete(type){

	var ids = com.leanway.getCheckBoxData(type, "processRouteDataTable", "checkList");

	deleteAjax(ids);
}
// 删除工艺路线Ajax
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/processRoute",
		data : {
			method : "deleteProcessRouteByConditions",
			conditions : '{"processRouteIds":"' + ids + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
	             if (tempData.result.code == "1") {
	//				alert("删除成功！");
					lwalert("tipModal", 1, "删除成功！");
					com.leanway.clearTableMapData( "processRouteDataTable" );
					oTable.ajax.reload(null,false);
					processRouteLineTable.ajax.reload();
					resetForm();
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");
				}

			}
		}
	});
}

// 选中工艺路线行(删除)
function deleteProcessRouteLine(type) {

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "processRouteLineDataTable", "processRouteLineCheckList");
	if (ids.length>0) {
        var msg = "确定删除选中的" + ids.split(",").length + "条工艺路线行?";

		lwalert("tipModal", 2, msg ,"isSureDeleteLine(" + type + ")");
	} else {
//		alert("至少选择一条记录操作");
		lwalert("tipModal", 1, "至少选择一条记录进行操作！");
	}
}

function isSureDeleteLine(type){

	var ids = com.leanway.getCheckBoxData(type, "processRouteLineDataTable", "processRouteLineCheckList");

	deleteProcessRouteLineAjax(ids);
}
// 删除工艺路线行Ajax
var deleteProcessRouteLineAjax = function(ids) {

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/processRoute",
		data : {
			method : "deleteProcessRouteLineByConditions",
			conditions : '{"processRouteLineIds":"' + ids + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);

	            if (tempData.result.code == "1") {
	//				alert("删除成功！");
					lwalert("tipModal", 1, "删除成功！");
					com.leanway.clearTableMapData( "processRouteLineDataTable" );
					processRouteLineTable.ajax.reload(null,false);
					resetProcessRouteLineForm();
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");
				}

			}
		}
	});
}

function getBatch(){
	var scheduleargs = $("#scheduleargs").val();
	if(scheduleargs==1){
		$("#batch").show();
	}else{
		$("#batch").hide();
		$("#batchnumber").val("");
	}

	if(scheduleargs==2){
		$("#time").show();
	}else{
		$("#time").hide();
		$("#timing").val("");
	}
}


function queryIsLinenoExsit(){

	var lineno= $("#lineno").val();
	var routeid = $("#routeid").val();
	if(lineno==null||lineno==""){
		return ;
	}


	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/processRoute",
		data : {
			method : "queryIsLinenoExsit",
			"conditions" : "{ }",
			"lineno":lineno,
			"routeid" : routeid
		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				if(!tempData.valid){
					if(!document.getElementById("lineno").readOnly){
	//				alert("该行号已存在");

					lwalert("tipModal", 1, "该行号已存在！");
					$("#lineno").val("");
					}
				}

			}
		},
		error : function(data) {

		}
	});

}


//工作中心组
function setGroupValue(data) {

	var groupName = "groupid,groupname";

	for ( var item in data) {
		 if (item != "searchValue") {
			 if (groupName.indexOf(item) != -1) {
					$("#" + item).val(data[item]);
				}
		 }


	}
}

/**
 *
 * 装配运行时间  搬运时间不可修改
 *
 * */
function notlinebalanceSelect(){
	$("#runtime1").val(null);
	$("#handingtime1").val(null);
	$("#timeunits").val(null);
	document.getElementById("runtime1").readOnly=true;
	document.getElementById("handingtime1").readOnly=true;
	$("#timeunits").prop("disabled", true);
}

/**
 *
 * 装配运行时间  搬运时间可修改
 *
 * */
function linebalanceSelect(){
	$("#runtime1").val(null);
	$("#handingtime1").val(null);
	$("#timeunits").val(null);
	document.getElementById("runtime1").readOnly=false;
	document.getElementById("handingtime1").readOnly=false;
	$("#timeunits").prop("disabled", false);
}

function getMapTreeList(type) {

	if(type==1){
    // checkSession();
	    $.fn.zTree.init($("#treeDemo"), {
	        async : {
	            enable : true,
	            url : "../../../"+ln_project+"/companyMap?method=queryCompanyMapTreeList",
	            autoParam : [ "mapid" ]
	        },

	        data : {
	            key : {
	                id : "mapid",
	                maplevels : "levels"
	            },
	            simpleData : {
	                enable : true,
	                idKey : "mapid",
	                pIdKey : "pid",
	                rootPId : ""
	            }
	        },
	        callback : {
	            // onRightClick : OnRightClick,
	            onClick : click
	        }
	    });
	}else if(type==2){
		   $.fn.zTree.init($("#treeDemo2"), {
		        async : {
		            enable : true,
		            url : "../../../"+ln_project+"/companyMap?method=queryCompanyMapTreeList",
		            autoParam : [ "mapid" ]
		        },

		        data : {
		            key : {
		                id : "mapid",
		                maplevels : "levels"
		            },
		            simpleData : {
		                enable : true,
		                idKey : "mapid",
		                pIdKey : "pid",
		                rootPId : ""
		            }
		        },
		        callback : {
		            // onRightClick : OnRightClick,
		            onClick : click2
		        }
		    });
	}else{
		   $.fn.zTree.init($("#treeDemo3"), {
		        async : {
		            enable : true,
		            url : "../../../"+ln_project+"/companyMap?method=queryCompanyMapTreeList",
		            autoParam : [ "mapid" ]
		        },

		        data : {
		            key : {
		                id : "mapid",
		                maplevels : "levels"
		            },
		            simpleData : {
		                enable : true,
		                idKey : "mapid",
		                pIdKey : "pid",
		                rootPId : ""
		            }
		        },
		        callback : {
		            // onRightClick : OnRightClick,
		            onClick : click3
		        }
		    });
	}
}

function click(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo"), nodes = zTree
            .getSelectedNodes(), v = "";
    m = "";
    nodes.sort(function compare(a, b) {
        return a.id - b.id;
    });
    for (var i = 0, l = nodes.length; i < l; i++) {
        v += nodes[i].levels + ",";
    }
    if (v.length > 0)
        v = v.substring(0, v.length - 1);
    // var mapObj = $("#maplevels");
    // mapObj.attr("value", v);
    $("#maplevelsfrom").val(v);
}

function click2(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo2"), nodes = zTree
            .getSelectedNodes(), v = "";
    m = "";
    nodes.sort(function compare(a, b) {
        return a.id - b.id;
    });
    for (var i = 0, l = nodes.length; i < l; i++) {
        v += nodes[i].levels + ",";
    }
    if (v.length > 0)
        v = v.substring(0, v.length - 1);
    // var mapObj = $("#maplevels");
    // mapObj.attr("value", v);
    $("#maplevelsto").val(v);
}

function click3(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo3"), nodes = zTree
            .getSelectedNodes(), v = "";
    m = "";
    nodes.sort(function compare(a, b) {
        return a.id - b.id;
    });
    for (var i = 0, l = nodes.length; i < l; i++) {
        v += nodes[i].levels + ",";
    }
    if (v.length > 0)
        v = v.substring(0, v.length - 1);
    // var mapObj = $("#maplevels");
    // mapObj.attr("value", v);
    $("#maplevelsfinish").val(v);
}

function showMenu(type) {
	if(type==1){
	    var mapObj = $("#maplevelsfrom");
	    var mapOffset = $("#maplevelsfrom").offset();
	    $("#menuContent").css({
	        left : mapOffset.left + "px",
	        top : mapOffset.top + mapObj.outerHeight() + "px"
	    }).slideDown("fast");

	    $("body").bind("mousedown", onBodyDown);
	    getMapTreeList(type);
	    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
   }else if(type==2){
	     var mapObj = $("#maplevelsto");
	    var mapOffset = $("#maplevelsto").offset();
	    $("#menuContent2").css({
	        left : mapOffset.left + "px",
	        top : mapOffset.top + mapObj.outerHeight() + "px"
	    }).slideDown("fast");

	    $("body").bind("mousedown", onBodyDown2);
	    getMapTreeList(type);
	    var zTree = $.fn.zTree.getZTreeObj("treeDemo2");
   }else{
	     var mapObj = $("#maplevelsfinish");
		    var mapOffset = $("#maplevelsfinish").offset();
		    $("#menuContent3").css({
		        left : mapOffset.left + "px",
		        top : mapOffset.top + mapObj.outerHeight() + "px"
		    }).slideDown("fast");

		    $("body").bind("mousedown", onBodyDown3);
		    getMapTreeList(type);
		    var zTree = $.fn.zTree.getZTreeObj("treeDemo3");
	   }
}
function onBodyDown(event) {
    if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(
            event.target).parents("#menuContent").length > 0)) {
        hideMenu(1);
    }
}

function onBodyDown2(event) {
    if (!(event.target.id == "menuBtn" || event.target.id == "menuContent2" || $(
            event.target).parents("#menuContent2").length > 0)) {
        hideMenu(2);
    }
}

function onBodyDown3(event) {
    if (!(event.target.id == "menuBtn" || event.target.id == "menuContent3" || $(
            event.target).parents("#menuContent3").length > 0)) {
        hideMenu(3);
    }
}
function hideMenu(type) {
	if(type==1){
	    $("#menuContent").fadeOut("fast");
	    $("body").unbind("mousedown", onBodyDown);
	}else if(type==2){
		 $("#menuContent2").fadeOut("fast");
		    $("body").unbind("mousedown", onBodyDown2);
	}else{
		 $("#menuContent3").fadeOut("fast");
		    $("body").unbind("mousedown", onBodyDown3);
	}
}
//查询计量单位下拉框数据
function queryKeyProcess() {
	var routeid = $("#routeid").val();

	$.ajax({
		type : "get",
		url : "../../../"+ln_project+"/keyProcess",
		data : {
			method : "queryAllKeyProcess",
			routeid : routeid
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);
			if(flag){
				// 下拉框赋值
				setKeyProcess(data);

			}
		},
		error : function(data) {

		}
	});
}

//初始化计量单位，工序单位下拉框
var setKeyProcess = function(data) {
	var html = "";

	for ( var i in data) {

		// 拼接option
		html += "<option value=" + data[i].keyid + ">" + data[i].keyprocessname
				+ "</option>";
	}

	$("#keyprocess").html(html);

}
//输入框查询人工工作中心
var searchArtWorkCenter = function() {
	var searchVal = $("#artworkcentersearchValue").val();
	artWorkCenterTable.ajax.url(
			"../../../"+ln_project+"/standerProcedure?method=queryWorkCenter&searchValue="
			+ searchVal+"&centrtype="+"人工").load();
}
//输入框查询机器工作中心
var searchWorkCenter = function(){

	var searchVal = $("#workcentersearchValue").val();
	wTable.ajax.url(
			"../../../"+ln_project+"/standerProcedure?method=queryWorkCenter&searchValue="
					+ searchVal+"&centrtype="+"机器").load();

}

//根据选中的机器工作中心获取该工作中心的可用资源数
var queryAvailableresources = function(centerid) {

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/workCenter",
		data : {
			"method" : "queryAvailableresources",
			"centerid" : centerid
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				$("#availableresources").val(data.availableresources);

			}
		}
	});

	
}

var initTreeBom = function() {

	$.fn.zTree.init($("#treeBom"), {
		check : { // 勾选框类型(checkbox 或 radio）默认 checkbox
			enable : true, // true 生效
			chkStyle : "checkbox", // checkbox 或 radio
			chkboxType : {
				"Y" : "a"
			}
		},
		async : {
			enable : true,
			url : "../../../"+ln_project+"/bom?method=queryBomTreeList",
			autoParam : [ "levels" ]
		},
		view : {
			dblClickExpand : false,
			fontCss : getFontCss,
			showLine : true,
		},
		data : {
			key : {
				id : "bomid",
				name : "productorname"
			},
			simpleData : {
				enable : true,
				idKey : "bomid",
				pIdKey : "pid",
				rootPId : ""
			}
		},
		callback : {
			// onRightClick : OnRightClick,
			onClick : onClick,
			onCheck : zTreeOnCheck
		}
	});

}

/**
 * checkBox选中事件
 */
var zTreeOnCheck = function (event, treeId, treeNode) {
   // alert(treeNode.tId + ", " + treeNode.name + "," + treeNode.checked);
	searchProductionOrder();
};

var getFontCss = function(treeId, treeNode) {
	return (!!treeNode.highlight) ? {
		color : "#A60000",
		"font-weight" : "bold"
	} : {
		color : "#333",
		"font-weight" : "normal"
	};
}

function onClick(e, treeId, treeNode) {

//	if (treeNode.checked) {
//		$.fn.zTree.getZTreeObj("treeBom").checkNode(treeNode, false, false);
//	} else {
//		$.fn.zTree.getZTreeObj("treeBom").checkNode(treeNode, true, true);
//	}
	
	oTable.ajax.url(
			"../../../"+ln_project+"/processRoute?method=queryProcessRoute&productorid="
					+ $.fn.zTree.getZTreeObj("treeBom").getSelectedNodes()[0].productorid).load();
	
//	processRouteLineTable.ajax.url(
//				"../../../"+ln_project+"/processRoute?method=queryProcessRouteLineByProductorid&productorid="
//						+ $.fn.zTree.getZTreeObj("treeBom").getSelectedNodes()[0].productorid).load();
	   
	//searchProductionOrder();

	// var isParent = "false";
	// checkSession();

	// if(zTree.getSelectedNodes()[0].pbomid==""||zTree.getSelectedNodes()[0].pbomid==null){
	// displaynone();
	// isParent = "true";
	// }else{
	// displayblock();
	// }

	// if(zTree.getSelectedNodes()[0].bomid){
	// loadBomObject(zTree.getSelectedNodes()[0].bomid, isParent);
	// }
	// com.leanway.formReadOnly("bomForm");
}

 
