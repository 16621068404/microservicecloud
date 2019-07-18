var clicktime = new Date();
var ope = "addWorkCenter";
var equipmentTable;
var oTable;
var shutDownTable;
var reg = /,$/gi;
var viewProductorTable;
var saveProductorTable;
$(function() {
	
	initBootstrapValidator();
	// 初始化对象
	com.leanway.loadTags();
	com.leanway.formReadOnly("workCenterForm");
	com.leanway.formReadOnly("addressForm");
	// 加载datagrid
	oTable = initTable();
//	shutDownTable = initShutDownTable();
	equipmentTable = initEquipmentTable();
	queryCalendarList();
	queryDispatchList();
//	queryDeptList();
	com.leanway.enterKeyDown("searchValue", searchWorkCenter);
	$("#addEquipButton").hide();

	dyscGetProvinceCityCountry("#province", "province", $('#province')
			.val(), $('#city').val());
	$("#mainworkcenter0").prop("disabled",true);
	$("#mainworkcenter1").prop("disabled",true);
	loadUnits();
	$("#addEquipment").prop("disabled",true);
	$("#delEquipment").prop("disabled",true);
	viewProductorTable = initViewProductorTable();

	saveProductorTable = initSaveProductorTable();
	
})
function initBootstrapValidator() {
	$('#workCenterForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					centername : {
						validators : {
							notEmpty : {},
						}
					},

					shorname : {
						validators : {
							notEmpty : {},
						}
					},
					centrtype : {
                        validators : {
                            notEmpty : {},

                        }
                    },
                    argid : {
                        validators : {
                            notEmpty : {},
                        }
                    },
//                    deptid : {
//                        validators : {
//                            notEmpty : {},
//                        }
//                    },
					resourcescount : {
						validators : {
							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.resourcescount,
									com.leanway.reg.msg.resourcescount)
						}
					},
					length : {
						validators : {
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					width : {
						validators : {
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					dailymaxcapacity : {
						validators : {
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
				}
			});
}


function queryDeptList() {
	
	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/dept",
		data : {
			method : "queryDeptList",
		},
		dataType : "json",
		success : function(data) {
			var flag =  com.leanway.checkLogind(data);

			if(flag){
				if(data.code="success"){
					setDeptList(data.data);
				}

			}
		},
		error : function(data) {
		}
	});
}
function queryCalendarList() {

	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/workCenter",
		data : {
			method : "queryCalendarList",
			conditions : "{}"
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				resetForm();
				setCalendar(data.deviceCalendarResult);

			}
		},
		error : function(data) {

		}
	});
}
function queryDispatchList() {
	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/workCenter",
		data : {
			method : "queryDispatchList",
			conditions : "{}"
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				resetForm();
				setDispatch(data.dispatchargResult);

			}
		},
		error : function(data) {

		}
	});
}
function queryCenterTypeList() {

	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/workCenter",
		data : {
			method : "queryCenterTypeList",
			conditions : "{}"
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				resetForm();
				setCenterType(data.codeMap);

			}
		},
		error : function(data) {

		}
	});
}
var setCenterType = function(data) {
	var html = "";
	for ( var i in data) {
		html += "<option value=" + data[i].codevalue + ">" + data[i].codevalue
				+ "</option>";
	}

	$("#centrtype").html(html);
}

var setDeptList = function(data) {

	var html = "";
	for ( var i in data) {
		html += "<option value=" + data[i].deptId + ">" + data[i].deptName
				+ "</option>";
	}

	$("#deptid").html(html);
}
var setCalendar = function(data) {
	var html = "";
	for ( var i in data) {
		html += "<option value=" + data[i].calendarid + ">" + data[i].name
				+ "</option>";
	}

	$("#calendarid").html(html);
}
var setDispatch = function(data) {
	var html = "";
	for ( var i in data) {
		html += "<option value=" + data[i].argid + ">" + data[i].argname
				+ "</option>";
	}

	$("#argid").html(html);
}
// 初始化数据表格
var initTable = function() {

	var table = $('#generalInfo')
			.DataTable(
					{
						"ajax" : "../../../../"+ln_project+"/workCenter?method=queryWorkCenterList",
						// "iDisplayLength" : "6",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
//						"scrollY":"57vh",
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",
						"columns" : [ {
							"data" : "centerid"
						}, {
							"data" : "centername",
						}, {
							"data" : "shorname"
						} ],
						"aoColumns" : [
								{
									"mDataProp" : "centerid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd)
												.html(
														"<div id='stopPropagation"
																+ iRow
																+ "'>"
																+ "<input class='regular-checkbox' type='checkbox' id='"
																+ sData
																+ "' name='checkList' value='"
																+ sData
																+ "'><label for='"
																+ sData
																+ "'></label>");
			                             com.leanway.columnTdBindSelectNew(nTd,"generalInfo","checkList");
									}
								}, {
									"mDataProp" : "centername",
								}, {
									"mDataProp" : "shorname"
								}, {
									"mDataProp" : "username"
								}  ],
						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {
							com.leanway.getDataTableFirstRowId("generalInfo",
									ajaxLoadWorkCenter, "more","checkList");
//							if(data._iRecordsTotal!=0){
							com.leanway.dataTableClickMoreSelect("generalInfo",
									"checkList", false, oTable,
									ajaxLoadWorkCenter,undefined,undefined,"checkAll");
//							}
							com.leanway.dataTableCheckAllCheck('generalInfo', 'checkAll', 'checkList');

							// $('input[type="checkbox"]').icheck({
							// labelHover : false,
							// cursor : true,
							// checkboxClass : 'icheckbox_flat-blue',
							// radioClass : 'iradio_flat-blue'
							// });
						},

					}).on('xhr.dt', function (e, settings, json) {
						com.leanway.checkLogind(json);
					} );

	return table;
}
//初始化数据表格
var initEquipmentTable = function() {

	var table = $('#equipmentTable')
			.DataTable(
					{
						"ajax" : "../../../../"+ln_project+"/workCenter?method=queryEquipmentList",
						// "iDisplayLength" : "6",
						'bPaginate' : false,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"scrollX":true,
						"bProcessing" : true,
						"bServerSide" : false,
						'searchDelay' : "5000",
						"aoColumns" : [
								{
									"mDataProp" : "equipmentid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd)
												.html(
														"<div id='stopPropagation"
																+ iRow
																+ "'>"
																+ "<input class='regular-checkbox' type='checkbox' id='"
																+ sData
																+ "' name='equipCheckList' value='"
																+ sData
																+ "'><label for='"
																+ sData
																+ "'></label>");
			                             com.leanway.columnTdBindSelectNew(nTd,"equipmentTable","equipCheckList");
									}
								}, {
									"mDataProp" : "codevalue",
								}, {
									"mDataProp" : "serialnumber",
								}, {
									"mDataProp" : "equipmentnum"
								}, {
									"mDataProp" : "equipmentname"
								}, {
									"mDataProp" : "barcode"
								}, {
									"mDataProp" : "criticalequipment",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd).html(criticalToName(sData));
									}
								}, {
									"mDataProp" : "uptime"
								}/*, {
									"mDataProp" : "url",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd).html("<button  type='button' class='btn btn-primary btn-xs' onclick='display(&quot;"
										+ sData + "&quot;)'>查 看</button>");
									}
								}*/  , {
									"mDataProp" : "equipdailymaxcapacity"
								}, {
									"mDataProp" : "capacityunitsname",
								}, {
									"mDataProp" : "status",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd).html(statusToName(sData));
									}
								} ],
						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {

						},

					}).on('xhr.dt', function (e, settings, json) {
						com.leanway.checkLogind(json);
					} );

	return table;
}
function criticalToName(status){
    var result = "";
        switch (status) {
        case 1:
            result = "是";
          break;
        case 0:
            result = "否";
          break;
        default:
            result = "是";
        break;
        }
    return result;
}
function statusToName(status){
    var result = "";
        switch (status) {
        case 1:
            result = "停用";
          break;
        case 0:
            result = "正常";
          break;
        default:
            result = "正常";
        break;
        }
    return result;
}
var initShutDownTable = function() {

	var table = $('#shutDownInfo')
			.DataTable(
					{
						"ajax" : "../../../../"+ln_project+"/shutdownreason?method=queryShutDownList",
						// "iDisplayLength" : "6",
						'bPaginate' : false,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",
						"columns" : [ {
							"data" : "shutdownreasonid"
						} ],
						"aoColumns" : [
								{
									"mDataProp" : "shutdownreasonid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd)
												.html(
														"<div id='stopPropagation"
																+ iRow
																+ "'>"
																+ "<input class='regular-checkbox' type='checkbox' id='"
																+ sData
																+ "' name='checkListShutDown' value='"
																+ sData
																+ "'><label for='"
																+ sData
																+ "'></label>");
										com.leanway.columnTdBindSelect(nTd);
									}
								}, {
									"mDataProp" : "reasoncode"
								}, ],
						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						// "sDom": "<'row-fluid'<'span6
						// myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6
						// 'p>>",
						"fnDrawCallback" : function(data) {

							// com.leanway.setDataTableColumnHide("shutDownInfo");
							com.leanway.dataTableClickMoreSelect(
									"shutDownInfo", "checkListShutDown", true,
									shutDownTable);
						//	setWorkcenterShutdown(data.jqXHR.responseJSON);
						}
					}).on('xhr.dt', function (e, settings, json) {
						com.leanway.checkLogind(json);
					} );

	return table;
}
var equipmentLegerData;
var type;
var count;
var equipmentname;
/**
 * 查询到右边显示
 */
var ajaxLoadWorkCenter = function(centerid) {
	$("#contactModule").prop("disabled",false);
	if( centerid==null|| centerid==""|| centerid == undefined){
		return ;
	}
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/workCenter?method=queryWorkCenterObject",
		data : {
			"centerid" : centerid,
		},
		dataType : "text",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){
				resetForm();
				var tempData = $.parseJSON(data);
				setFormValue(tempData.workCenter);
				setAddressFormValue(tempData.workCenter);

//				var str = '';
//				for (var i = 0; i < tempData.workCentersShutdown.length; i++) {
//					str += tempData.workCentersShutdown[i].shutdownreasonid;
//					str += ",";
//				}
//				var ids = str.substr(0, str.length - 1);

				equipmentTable.ajax.url(
						"../../../../"+ln_project+"/workCenter?method=queryEquipmentList&centerid=" + centerid)
						.load();

//				setWorkcenterShutdown(tempData.workCentersShutdown);

				com.leanway.formReadOnly("workCenterForm");
			    com.leanway.formReadOnly("addressForm");
			    $("#mainworkcenter0").prop("disabled",true);
			    $("#mainworkcenter1").prop("disabled",true);

				}
		}
	});

}

function setWorkcenterShutdown(data) {
	// alert(data);
	// var checkName = "checkListShutDown";
	for (var i = 0; i < data.length; i++) {
		var shutdownreasonid = data[i].shutdownreasonid;
		$('#shutDownInfo')
				.find('tbody tr')
				.each(
						function(index, item) {

							var shutdownreasonIdData = $(this)[0].cells[0].children[0].children[0].value;
							if (shutdownreasonid == shutdownreasonIdData) {

								$(this).addClass('row_selected');
								$(this).find('td').eq(0).find(
										"input[name='checkListShutDown']")
										.prop("checked", true);

							}
						});

	}
}

function queryIsWorkCenterExsit() {

	var centername = $("#centername").val();
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/workCenter",
		data : {
			method : "queryIsWorkCenterExsit",
			"centername" : centername,
		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				if (!tempData.valid) {
					if (!document.getElementById("centername").readOnly) {
						// alert("工作中心名称已存在");
						lwalert("tipModal", 1, "工作中心名称已存在！");
						$("#centername").val("");
					}
				}

			}
		},
		error : function(data) {

		}
	});
}

function statusConvertToName(workCenter,status){
    var result = "";
        switch (status) {
        case "12":
            result = "正常";
          break;
        case "13":
            result = "停机";
          break;
        default:
            result = "正常";
        break;
        }
    return result;
}
function display(url) {

    if(url==null||url=="null"){
        $("#image").attr("src", "../../../lnfiles/upload/noimg.jpg");
    }else{
        $("#image").attr("src", "../../.." + url);

    }

	$("#selectId").css("display", "none");
	$("#uploadButton").css("display", "none");
	$("#imageModal").modal("show");
}
/**
 * 删除数据
 */
function deleteWorkCenter( type ) {


	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");

	if (ids.length == 0) {

		lwalert("tipModal", 1, "请选择要删除的工作中心!");
		return;

	} else {

		var msg = "确定删除选中的" + ids.split(",").length + "条工作中心?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	}

}

function isSureDelete( type ) {
	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
	deleteAjax(ids);
}
// 删除Ajax
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/workCenter?method=deleteWorkCenter",
		data : {
			"conditions" : '{"workCenterIds":"' + ids + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
				if (tempData.status == "success") {
					com.leanway.clearTableMapData( "generalInfo" );
					resetForm();
					oTable.ajax.reload();
				} else {
					// alert("操作失败");
					lwalert("tipModal", 1, tempData.info);
				}

			}
		}
	});
}
/**
 * 填充到HTML表单
 */
function setFormValue(data) {
	$("#addEquipment").prop("disabled",true);
	$("#delEquipment").prop("disabled",true);
	resetForm();
	var radioNames = "mainworkcenter";
	for ( var item in data) {
		if (item != "searchValue") {
			$("#" + item).val(data[item]);
		}
		if(radioNames.indexOf(item) != -1) {
			$("input[type=radio][name=" + item + "][value=" + data[item] + "]").prop('checked','true');
		}
	}

	if (data.url != null) {
		$("#imageId").attr("src", "../../../" + data.url);
	} else {
		$("#imageId").attr("src", "../../../lnfiles/upload/noimg.jpg");
	}

}

/**
 * 填充到HTML表单
 */
function setAddressFormValue(data) {
	
	var cityList = data.cityList;
	var countryList = data.countryList;
    var cityhtml = "";
    var countryhtml = "";
	for(var i in cityList){
		
		cityhtml+="<option value='"+cityList[i].city+"'>"+cityList[i].name+"</option>"
	}
	$("#city").html(cityhtml);
	for(var i in countryList){
		countryhtml+="<option value='"+countryList[i].district+"'>"+countryList[i].name+"</option>"
	}
	$("#country").html(countryhtml);
	for ( var item in data) {
			$("#" + item).val(data[item]);
	}
}

/**
 * 修改数据
 *
 */
function updateWorkCenter() {
	$("#addEquipment").prop("disabled",false);
	$("#delEquipment").prop("disabled",true);
	$("#contactModule").prop("disabled",true);
	$("#selectId").css("display", "block");
	$("#uploadButton").css("display", "block");
	ope = "updateWorkCenter";
	var data = oTable.rows('.row_selected').data();
	workcenterpath = $("#workcenterpath").val();
	if (data.length == 0) {
		lwalert("tipModal", 1, "请选择要修改的工作中心！");
	} else if (data.length > 1) {
		lwalert("tipModal", 1, "只能选择一个工作中心进行修改！");
	} else {

		com.leanway.removeReadOnly("workCenterForm");
		com.leanway.removeReadOnly("addressForm");

		document.getElementById("centername").readOnly = true;
		document.getElementById("uptime").readOnly = true;
		$("#mainworkcenter0").prop("disabled",false);
	    $("#mainworkcenter1").prop("disabled",false);
		equipmentTableToEdit();
	}
}
// 格式化form数据
var formatFormJson = function(formData) {
	var reg = /,$/gi;
	var data = "{";
	for (var i = 0; i < formData.length; i++) {
		if (formData[i].name == "equipVal") {
			data += "\"" + formData[i].name + "\" : " + formData[i].value + ",";
		} else {
			data += "\"" + formData[i].name + "\" : \"" + formData[i].value
					+ "\",";
		}
	}
	data = data.replace(reg, "");
	data += "}";
	return data;
}

/**
 * 新增
 *
 */
var addWorkCenter = function() {
	// 清空表单
	resetForm();
	$("#addEquipment").prop("disabled",false);
	$("#delEquipment").prop("disabled",false);
	$("#contactModule").prop("disabled",true);
	$("#city").html("");
	$("#country").html("");
	ope = "addWorkCenter";
	$("#imageId").attr("src", "../../../lnfiles/upload/noimg.jpg");
	$("#workcenterpath").val("");
	com.leanway.removeReadOnly("workCenterForm");
	com.leanway.removeReadOnly("addressForm");
	$("#mainworkcenter0").prop("disabled",false);
    $("#mainworkcenter1").prop("disabled",false);
    $("#code").prop("readonly",true);
	com.leanway.dataTableUnselectAll("generalInfo", "checkList");
	com.leanway.dataTableUnselectAll("generalInfo", "checkAll");
	com.leanway.dataTableUnselectAll("shutDownInfo", "checkListShutDown");
	com.leanway.clearTableMapData( "generalInfo" );

	dyscGetProvinceCityCountry("#province", "province", $('#province')
			.val(), $('#city').val());
	equipmentTable.ajax.url(
			"../../../../"+ln_project+"/workCenter?method=queryEquipmentList&centerid=1")
			.load();

}

var equipledgerpath;
function displayPicture(equipmentpath) {

	equipledgerpath = equipmentpath;
	var photoid = $("#" + equipledgerpath).val();
	if (photoid != "") {
		$.ajax({
			type : "post",
			url : "../../../../"+ln_project+"/workCenter?method=queryPhotoObject",
			data : {
				"photoid" : photoid,
			},
			dataType : "text",
			async : false,
			success : function(data) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					var tempData = $.parseJSON(data);
					if (tempData.status == "success") {
						// 给隐藏域赋id
						$("#image").attr("src", "../../../" + tempData.resultObj.url);
						$("#imageModal").modal("show");
					} else {
						$("#image").attr("src", "");
						$("#imageModal").modal("show");
					}

				}
			}
		});
	} else {
	    $("#image").attr("src", "../../../lnfiles/upload/noimg.jpg");
		$("#imageModal").modal("show");
	}
}
/**
 * 往里面存数据
 */

var saveWorkCenter = function() {

	var flag = true;
	var arr = [];
	$("#tableBody").find('tr').each(function(index, temp) {
		arr.push($(this).find("td:nth-child(4)").find("input").val());
	});
	//判断条码是否相同
	if (arr.length != $.unique(arr).length) {
        flag = false;
    }
//	// 选中的停机原因
//	var str = '';
//
//	// 拼接选中的checkbox
//	$("input[name='checkListShutDown']:checked").each(function(i, o) {
//		str += $(this).val();
//		str += ",";
//	});
	$('#equipVal').val(getDataTableData(equipmentTable));
	console.info($('#equipVal').val());
	var form = $("#workCenterForm").serializeArray();
	var formData = formatFormJson(form);
    var addressForm = $("#addressForm").serializeArray();
    var addressData = formatFormJson(addressForm);
	$("#workCenterForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#workCenterForm').data('bootstrapValidator').isValid()) {// 返回true、false
		if (($("#workcenterpath").val() != "" && $("#length").val() != ""
				&& $("#width").val() != "" && $("#length").val() != 0 && $(
				"#width").val() != 0)
				|| $("#workcenterpath").val() == "") {
			if ($("#centername").val() != "") {

				if (flag) {
					$.ajax({
						type : "POST",
						url : "../../../../"+ln_project+"/workCenter",
						data : {
							"method" : ope,
							formData : formData,
							addressData:addressData,
//							"shutdownreason" : str,
						},
						dataType : "text",
						async : false,
						success : function(data) {

							var flag =  com.leanway.checkLogind(data);

							if(flag){

								var tempData = $.parseJSON(data);
								console.info(tempData);
								if (tempData.code == "success") {
									com.leanway.formReadOnly("workCenterForm");
									com.leanway.formReadOnly("addressForm");

									com.leanway.clearTableMapData( "generalInfo" );
									if(ope=="addWorkCenter"){
		                                oTable.ajax.reload();
		                            }else{
		                                oTable.ajax.reload(null,false);
		                            }
									
								} 
								lwalert("tipModal", 1, tempData.msg+"!");

							}
						}
					});
				} else {
					lwalert("tipModal", 1, "设备台账条码重复，不能保存");
				}
			} else {
				lwalert("tipModal", 1, "工作中心名称不能为空");
			}
		} else {
			lwalert("tipModal", 1, "保存失败！图片已上传，请正确填写长和宽");
		}
	}
}

/**
 * 重置表单
 *
 */
var resetForm = function() {
	$('#workCenterForm').each(function(index) {
		$('#workCenterForm')[index].reset();
	});
	$('#addressForm').each(function(index) {
		$('#addressForm')[index].reset();
	});

	$("#workCenterForm").data('bootstrapValidator').resetForm();
}
/**
 * 搜索工作中心
 */
var searchWorkCenter = function() {

	var searchVal = $("#searchValue").val();

	oTable.ajax.url(
			"../../../../"+ln_project+"/workCenter?method=queryWorkCenterList&searchValue="
					+ searchVal).load();
	$("#searchValue").val("");
}

/**
 * 新增一行
 */
var addEquipment = function( ) {
	var centerid = $("#centerid").val();
	equipmentTable.row.add({
		"centerid" : centerid,
		"serialnumber" : "",
		"equipmentnum" : "",
		"equipmentname" : "",
		"criticalequipment" : "",
		"uptime" : "",
		"equipmentid" : "",
		"equipdailymaxcapacity" : "",
		"capacityunitsid" : "",
		"equipstatusid" : "" ,
		"barcode":""
	}).draw(false);
	equipmentTableToEdit();
}

/**
 * 设备可编辑
 */
var equipmentTableToEdit = function ( ) {
	 if (equipmentTable.rows().data().length > 0) {
         $("#equipmentTable tbody tr").each( function( ) {
        	// 获取该行的下标
             var index = equipmentTable.row(this).index();
             //日最大产能单位
          	var typeid = '<select class="form-control" id="type'+index+'" onchange="typeChange(this, '
          			+ index
          			+ ')" name="type" style="width: 80px;"></select>';

          	$(this).find("td:eq(1)").html(typeid);
          	loadType("type"+index);
          	$(this).find("td:eq(1)").find("#type"+index).val(
          			equipmentTable.rows().data()[index].type);
        	 // 台账序号
             var serialnumber = equipmentTable.rows().data()[index].serialnumber;
             $(this).find("td:eq(2)").html('<input type="text" class="form-control" style="width:100px" name="serialnumber" id="serialnumber'+index+'" value="'+ serialnumber + '" onblur="setDataTableValue(this, '+ index+ ',\'equipmentTable\')">');
             var equipmentnum = equipmentTable.rows().data()[index].equipmentnum;
             $(this).find("td:eq(3)").html('<input type="text" class="form-control" style="width:100px" name="equipmentnum" id="equipmentnum'+index+'" value="'+ equipmentnum + '" onblur="setDataTableValue(this, '+ index+ ',\'equipmentTable\')">');
             var equipmentname = equipmentTable.rows().data()[index].equipmentname;
             $(this).find("td:eq(4)").html('<input type="text" class="form-control" style="width:100px" name="equipmentname" id="equipmentname'+index+'" value="'+ equipmentname + '" onblur="setDataTableValue(this, '+ index+ ',\'equipmentTable\')">');
             var barcode = equipmentTable.rows().data()[index].barcode;
             $(this).find("td:eq(5)").html('<input type="text" class="form-control" style="width:100px" name="barcode" readonly id="barcode'+index+'" value="'+ barcode + '" onblur="setDataTableValue(this, '+ index+ ',\'equipmentTable\')">');
             var criticalequipment = equipmentTable.rows().data()[index].criticalequipment;
             //关键设备
         	var critical = '<select class="form-control" id="criticalequipment" onchange="criticalequipmentChange(this, '
         			+ index
         			+ ')" name="criticalequipment"> <option value="1">是</option><option value="2">否</option></select>';

         	$(this).find("td:eq(6)").html(critical);
         	$(this).find("td:eq(6)").find("#criticalequipment").val(
         			equipmentTable.rows().data()[index].criticalequipment);
            var uptime = equipmentTable.rows().data()[index].uptime;
             $(this).find("td:eq(7)").html("<input class='form-control' type='text'  name='uptime' id='uptime' value='"+ uptime + "' style='width: 100px;' onkeyup='isNumber()' onafterpaste='isNumber()' onblur='setDataTableValue(this, "+ index+ ",\"equipmentTable\")'/>");
             /*$(this).find("td:eq(8)").html("<button  type='button' class='btn btn-primary btn-xs' onclick='displayPicture(&quot;equipmentpath"
         			+ i + "&quot;)'>查 看</button>");*/
             var equipdailymaxcapacity = equipmentTable.rows().data()[index].equipdailymaxcapacity;
             $(this).find("td:eq(8)").html("<input class='form-control' type='text'  name='equipdailymaxcapacity' id='equipdailymaxcapacity' value='"+equipdailymaxcapacity+"' style='width: 100px;' onblur='setDataTableValue(this, "+ index+ ",\"equipmentTable\")'/>");
             //日最大产能单位
         	var capacityunitsid = '<select class="form-control" id="capacityunitsid'+index+'" onchange="capacityunitsidChange(this, '
         			+ index
         			+ ')" name="capacityunitsid" style="width: 80px;"></select>';

         	$(this).find("td:eq(9)").html(capacityunitsid);
         	loadUnits("capacityunitsid"+index);
         	$(this).find("td:eq(9)").find("#capacityunitsid"+index).val(
         			equipmentTable.rows().data()[index].capacityunitsid);
         	 //状态
         	var status = '<select class="form-control" id="status" onchange="statusChange(this, '
         			+ index
         			+ ')" name="status"> <option value="0">正常</option><option value="1">停用</option></select>';

         	$(this).find("td:eq(10)").html(status);
         	$(this).find("td:eq(10)").find("#status").val(
         			equipmentTable.rows().data()[index].status);   
         	
         });

         equipmentTable.columns.adjust();
     }
}
//改变DataTable对象里的值
var setDataTableValue = function(obj, index, tableName) {

    var tableObj = $("#" + tableName).DataTable();
    // 获取修改的行数据
    var productor = tableObj.rows().data()[index];
    // 循环Json key,value，赋值
    for ( var item in productor) {
        // 当ID相同时，替换最新值
        if (item == obj.name) {

            productor[item] = obj.value;

        }

    }
}

/**
 * 删除产品的方法
 */
function delEquipment(){
	//获取dataTabel
	// 删除选中行的数据

		
		$("#equipmentTable tbody tr").each(function() {
	
			// 获取该行的下标
			var index = equipmentTable.row(this).index();
	
			if ($(this).find("td:eq(0)").find("input[name='equipCheckList']").prop("checked") == true) {
				
				
				equipmentTable.rows(index).remove().draw(false);
			}

		});
		
}
var criticalequipmentChange = function(obj, index) {

	equipmentTable.rows().data()[index].criticalequipment = obj.value;
}
var capacityunitsidChange = function(obj, index) {

	equipmentTable.rows().data()[index].capacityunitsid = obj.value;
}
var typeChange = function(obj, index) {

	equipmentTable.rows().data()[index].type = obj.value;
}

var statusChange = function(obj, index) {

	equipmentTable.rows().data()[index].status = obj.value;
}
// 触发上传
function selectFile(fileId) {

	var resourcescount = $("#resourcescount").val();
	if (resourcescount != "") {
		$("#" + fileId).trigger("click");
	} else {
		lwalert("tipModal", 1, "请填写资源数后上传图片，否则无法复制图片到设备台账");
	}
}

var workcenterpath;
var imageId;
// 上传图片
function uploadFunc(input) {

	// 创建FormData对象
	var data = new FormData();
	// 为FormData对象添加数据
	var fileObj = document.getElementById(input).files[0];
	data.append("file", fileObj);
	if ($("#" + input).val() == "") {
		lwalert("tipModal", 1, "请选择图片上传");
		return;
	}
	// 发送数据
	$.ajax({
		url : "../../../../"+ln_project+"/workCenter?method=upload",
		type : 'POST',
		data : data,
		dataType : 'json',
		cache : false,
		contentType : false,
		processData : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				if (data.status == 'true') {
					var path = input.substr(0, input.length - 2);
					// 给隐藏域赋id
					$("#workcenterpath").val(data.id);
					$("#imageId").attr("src", "../../../" + data.url);
					imageId = data.url;
					workcenterpath = data.id;
					lwalert("tipModal", 2, "上传成功,需要更新该工作中心所有设备台账图片吗？",
							"refreshEquipPicture()");

				} else {
					lwalert("tipModal", 1, "请选择图片格式上传");
				}

			}
		},
		error : function() {
			lwalert("tipModal", 1, "上传出错,图片不能超过1M");

		}
	});

}
function refreshEquipPicture() {
	var resourcescount = $("#resourcescount").val();
	for (var i = 0; i < resourcescount; i++) {
		$("#equipmentpath" + i).val(workcenterpath);
	}

}
function upload(input) {
	// 创建FormData对象

	var data = new FormData();
	// 为FormData对象添加数据
	var fileObj = document.getElementById(input).files[0];
	data.append("file", fileObj);
	if ($("#" + input).val() == "") {
		return;
	}
	// 发送数据
	$.ajax({
		url : "../../../../"+ln_project+"/workCenter?method=upload",
		type : 'POST',
		data : data,
		dataType : 'json',
		cache : false,
		contentType : false,
		processData : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				if (data.status == 'true') {
					// 给隐藏域赋id
					$("#" + equipledgerpath).val(data.id);

					$("#image").attr("src", "../../../" + data.url);
				} else {
					// lwalert("tipModal", 1, "请选择图片格式上传");
				}

			}
		},
		error : function() {
			lwalert("tipModal", 1, "上传出错,图片不能超过1M");

		}
	});

}

function isNumber() {
	var trackcount = document.getElementsByName("uptime");
	for (var i = 0; i < trackcount.length; i++) {

		trackcount[i].value = trackcount[i].value.replace(/[^\d.]/g, '');

	}
}

// 选择省份触发
$('#province').change(
		function() {
			$('#city').empty();
			dyscGetProvinceCityCountry("#city", "city", $('#province')
					.val(), $('#city').val());
			$('#country').empty();
		});

// 选择城市触发
$('#city').change(
		function() {
			dyscGetProvinceCityCountry("#country", "district", $(
					'#province').val(), $('#city').val());
		});

// 动态得到省市县
function dyscGetProvinceCityCountry(id, pcd, provinceVal, cityVal) {

	$
			.ajax({
				type : 'get',
				url : '../../../../'+ln_project+'/chinaMap',
				async : false,
				data : {
					method : "gain",
					province : provinceVal,
					city : cityVal
				},
				dataType : 'text',
				success : function(data) {

					var flag =  com.leanway.checkLogind(data);

					if(flag){

						var tempData = $.parseJSON(data);

						var outPut = [];
						outPut
								.push("<option value='0' selected='selected'>=请选择=</option>");
						for ( var key in tempData) {
							var tempOption;
							if (pcd == "province")
								tempOption = "<option value='"
										+ tempData[key].province + "'>"
										+ tempData[key].name + "</option>"
							else if (pcd == "city")
								tempOption = "<option value='" + tempData[key].city
										+ "'>" + tempData[key].name + "</option>"
							else if (pcd == "district")
								tempOption = "<option value='"
										+ tempData[key].district + "'>"
										+ tempData[key].name + "</option>"

							outPut.push(tempOption);
						}
						$(id).html(outPut.join(''));

					}
				},
				error : function(data) {

				}
			});
}

function getMapTreeList() {
	// checkSession();
	$.fn.zTree.init($("#treeDemo"), {
		async : {
			enable : true,
			url : "../../../../"+ln_project+"/companyMap?method=queryCompanyMapTreeList",
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
	$("#maplevels").val(v);
}

function showMenu() {
	var mapObj = $("#maplevels");
	var mapOffset = $("#maplevels").offset();
	$("#menuContent").css({
		left : mapOffset.left + "px",
		top : mapOffset.top + mapObj.outerHeight() + "px"
	}).slideDown("fast");

	$("body").bind("mousedown", onBodyDown);
	getMapTreeList();
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
}

function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}

function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(
			event.target).parents("#menuContent").length > 0)) {
		hideMenu();
	}
}

function getCode() {
	$("#modalLabel").html("地图");
	$('#myModal').modal({
		backdrop : 'static',
		keyboard : false
	});
	var str = "";
	var provinceValue = $("#province option:selected").text();
	str += provinceValue;
	var cityValue = $("#city option:selected").text();
	str += cityValue;
	var districtIdValue = $("#country option:selected").text();
	str += districtIdValue;
	var registAddress = $("#location").val();
	str += registAddress;
	document.getElementById("mapKeys").value = str;
	$('#mapFrame').attr('src', 'map.html');

}
var userTable;
function addCenterEmployee(){
	//鼠标选取的行
    if (oTable.rows('.row_selected').data().length == 0) {
    	lwalert("tipModal", 1, "请选择工作中心关联用户！");
    	return;
    } else if (oTable.rows('.row_selected').data().length > 1){
    	lwalert("tipModal", 1, "只能选择一个工作中心关联用户！");
    	return;
    } else  {
    	//将已有的值置空
    	$("#userSearchValue").val("");

    	// 弹出modal
    	$('#userModal').modal({backdrop: 'static', keyboard: false});

    	var compId =  oTable.rows('.row_selected').data()[0].compId;
    	//判断表单是否为空，或者未定义。
		if (userTable == null || userTable == "undefined" || typeof(userTable) == "undefined") {
			//初始化表格
			userTable = initUserTable(compId);
		} else {
			//post传值格式。
			userTable.ajax.url('../../../../'+ln_project+'/user?method=getUserList').load();

		}
    }

}

var initUserTable = function() {

	var table = $('#userTables')
			.DataTable(
					{
						"ajax" : "../../../../"+ln_project+"/user?method=getUserList",
						// "iDisplayLength" : "6",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
//						"scrollY":"57vh",
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",
						"aoColumns" : [
								{
									"mDataProp" : "userId",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd)
					            		   .html(
					            				   "<input class='regular-checkbox' type='checkbox' id='"
					            				   + sData
					            				   + "' name='userCheckList' value='"
					            				   + sData
					            				   + "'><label for='"
					            				   + sData
					            				   + "'></label>");
									}
								}, {"mDataProp": "userName"},
					               {"mDataProp": "employeeName"},],
						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {
							com.leanway.dataTableClick(
									"userTables",
									"userCheckList", false,
									userTable);
						},

					}).on('xhr.dt', function (e, settings, json) {
						com.leanway.checkLogind(json);
					} );

	return table;
}
var searchUsers = function () {

	var searchVal = $("#userSearchValue").val();

	userTable.ajax.url("../../../../"+ln_project+"/user?method=getUserList&searchValue=" + searchVal).load();
}
var saveCenterUser = function(){
	var centerid = oTable.rows('.row_selected').data()[0].centerid;
	var userName = oTable.rows('.row_selected').data()[0].username;
	var data = userTable.rows('.row_selected').data()[0];
	if(userName!=null&&data==undefined){
    	lwalert("tipModal", 2, "你确定要将雇员【"+userName+"】和该工作中心解绑吗？","isSureSaveCenterUser()");
	}else{
		isSureSaveCenterUser();
	}

}

function isSureSaveCenterUser(){
	var centerid = oTable.rows('.row_selected').data()[0].centerid;
	var data = userTable.rows('.row_selected').data()[0];
	var userid = null;
	if(data!=undefined){
		userid = data.userId;
	}
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/workCenter?method=saveCenterUser",
		data : {
			centerid:centerid,
			userid : userid
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
				if (tempData.status == "success") {
					com.leanway.clearTableMapData( "userTables" );
					resetForm();
					oTable.ajax.reload();
					$('#userModal').modal("hide");
				}
				if(userid!=null){
					lwalert("tipModal", 1, tempData.info);
				}


			}
		}
	});
}


//加载所有的计量单位
function loadUnits(unitsid){
	$.ajax ( {

		type : "get",
		url : "../../../../"+ln_project+"/productors?method=findAllUnitsid",
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			    var json = eval("(" + data + ")")

				var units = json.units;
				var html="";
				for (var i = 0;i<units.length;i++) {
					/**
					 * option 的拼接
					 * */
					html +="<option value="+ units[i].unitsid+">"+ units[i].unitsname+"</option>";
				}
				$("#"+unitsid).html(html);
			}
		}
	});
}
function loadType(typeid){
	$.ajax ( {

		type : "get",
		url : "../../../../"+ln_project+"/codeMap?method=queryCodeMapList",
		data : {
			t:"equipmentledger",
			c : "type"
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			    var json = eval("(" + data + ")")

				var html="";
				for (var i = 0;i<json.length;i++) {
					/**
					 * option 的拼接
					 * */
					html +="<option value="+ json[i].codemapid+">"+ json[i].codevalue+"</option>";
				}
				$("#"+typeid).html(html);
			}
		}
	});
}
var getDataTableData = function(tableObj) {

	var jsonData = "[";

	var dataList = tableObj.rows().data();
	if (dataList != undefined && typeof (dataList) != "undefined" && dataList.length > 0) {

		// 循环遍历Table数据
		for (var i = 0; i < dataList.length; i++) {
			var productorData = dataList[i];

			jsonData += JSON.stringify(productorData) + ",";

		}
	}
	jsonData = jsonData.replace(reg, "");

	jsonData += "]";

	return jsonData;
} 
//关联模具
var showProductors = function () {
	//获取选中的数据
	var data = equipmentTable.rows('.row_selected').data();
	 if(data.length == 0) {
	        lwalert("tipModal", 1, "请选择设备台账进行关联!");
	 }else if(data.length>1){
	        lwalert("tipModal", 1, "只能选择一条数据进行修改!");
	 }else{

    	 //获取选中的仓库的id和产品的id
		 var equipmentid = data[0].equipmentid;
		 var centerid = data[0].centerid;
		 //初始化表格，弹框
		 viewProductorTable.ajax.url("../../../"+ln_project+"/productors?method=queryProductorbyEquipmentid&equipmentid="+equipmentid+"&type=1&centerid="+centerid).load();
		 saveProductorTable.ajax.url("../../../"+ln_project+"/productors?method=queryProductorbyEquipmentid&equipmentid="+equipmentid+"&type=2&centerid="+centerid).load();
		 $("#veiwProductorModal").modal({backdrop: 'static', keyboard: true});


	 }
}
//初始化模板左边表格
var initViewProductorTable = function(equipmentid) {
	var table = $('#viewProductorsTable')
     .DataTable(
             {
            	 "ajax" : "../../../"+ln_project+"/productors?method=queryProductorbyEquipmentid&equipmentid="+equipmentid+"&type=1",
                 'bPaginate' : false,
                 "bDestory" : true,
                 "bRetrieve" : true,
                 "bFilter" : false,
                 "bSort" : false,
//                 "scrollX" : true,
                 "bProcessing" : true,
                 "bServerSide" : true,
                 'searchDelay' : "5000",

                  "aoColumns": [
                        {
                            "mDataProp": "productorid",
                            "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                                $(nTd).html("<div id='stopPropagation" + iRow +"'>"
                                        +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                        + "' name='viewProductorList' value='" + sData
                                        + "'><label for='" + sData
                                        + "'></label>");
                              com.leanway.columnTdBindSelectNew(nTd,"viewProductorsTable","viewProductorList");
                            }
                        },
                    	{
							"mDataProp" : "productorname"
						},
						{
							"mDataProp" : "productordesc"
						},
                   ],

                   "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
		            	  $(nRow).dblclick(function () {
		            		  addProductor(aData);
		            	  });

		            	  $(nRow).click(function () {
		            		  if ($(this).hasClass('row_selected')) {
		            			  $(this).removeClass('row_selected');
		            			  $(this).find('td').eq(0).find("input[name='viewProductorsAll']").prop("checked", false)
		            		  } else {
		            			  $(this).addClass('row_selected');
		            			  $(this).find('td').eq(0).find("input[name='viewProductorsAll']").prop("checked", true)
		            		  }
		            	  });
		              },

                 "oLanguage" : {
                     "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                 },
                 "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                 "fnDrawCallback" : function(data) {
                     com.leanway.getDataTableFirstRowId("viewProductorsTable",undefined,
                             "more", "viewProductorList");
                     com.leanway.dataTableClickMoreSelect("viewProductorsTable", "viewProductorList", false,
                    		 viewProductorTable, undefined,undefined,undefined,"viewProductorsAll");

                 }
             }).on('xhr.dt', function (e, settings, json) {
                 com.leanway.checkLogind(json);
             } );

		return table;
}


//左右移动，1：向右移，2：向左移
function toTable(type) {

	if (type == 1) {

		var dataList =  viewProductorTable.rows('.row_selected').data();

		if (dataList != undefined && dataList.length > 0) {

			for (var i = 0; i < dataList.length; i++) {

				addProductor(dataList[i]);

			}

		}

	} else if (type == 2) {

		saveProductorTable.rows(".row_selected").remove().draw(false);

		// 重新添加数据到DataTable，解决index下标错误的问题， 操作步骤，1：先删除第一条数据，第二条时删除不掉
		var tempData = saveProductorTable.rows().data();

		saveProductorTable.rows().remove().draw(false);

		saveProductorTable.rows.add(tempData).draw(false);

	}
}

/*
 *保存方法
 */
function saveProductors() {
	//获取右边表格里面的数据
	//拼接json
	var equipmentid = com.leanway.getDataTableCheckIds("equipCheckList");
	var saveProductorData =getDataTableData(saveProductorTable);
	var formData = "{\"productorList\": "+ saveProductorData + ",\"equipmentid\":\"" + equipmentid + "\"}";
	 $.ajax({
	        type : "POST",
	        url : "../../../"+ln_project+"/workCenter",
	        data : {
	            "method" : "saveProductor",
	            "paramData" : formData
	        },
	        dataType : "json",
	        async : false,
	        success : function(data) {

	            var flag =  com.leanway.checkLogind(data);

	            if(flag){


	                if (data.code == "success") {
	                    //刷新两个表格
	                	//给detail赋值
	                	$("#veiwProductorModal").modal('hide');
	                	//获取选中的收货单id
	                	equipmentTable.ajax.reload(null, false);
	                }else{
	                	$("#veiwProductorModal").modal('hide');
	                	lwalert("tipModal", 1, data.info);
	                }

	            }
	        }
	    });

}

function addProductor(obj) {
	var canAdd = true;

	// 判断添加的对象在关系表中是否存在
	var dataList = saveProductorTable.rows().data();
	if (dataList != undefined && typeof(dataList) != "undefined" && dataList.length > 0) {

		// 循环遍历Table数据
		for (var i = 0; i < dataList.length; i ++) {

			var productorData = dataList[i];
			if (productorData.productorid == obj.productorid) {
				canAdd = false;
			}

		}
	}

	if (canAdd) {
		saveProductorTable.row.add(obj).draw( false );
	}
}

//初始化右边初始化模板左边表格
var initSaveProductorTable = function(equipmentid) {
	var table = $('#saveProductorsTable')
     .DataTable(
             {
                 "ajax" : "../../../"+ln_project+"/productors?method=queryProductorbyEquipmentid&equipmentid="+equipmentid+"&type=2",
                 "pageUrl"  :  "workcenter/workcenter.html",
                 'bPaginate' : false,
                 "bDestory" : true,
                 "bRetrieve" : true,
                 "bFilter" : false,
                 "bSort" : false,
//                 "scrollX" : true,
                 "bProcessing" : true,
                 "bServerSide" : false,
                 'searchDelay' : "5000",

                  "aoColumns": [
                        {
                            "mDataProp": "productorid",
                            "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                                $(nTd).html("<div id='stopPropagation" + iRow +"'>"
                                        +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                        + "' name='saveProductorsList' value='" + sData
                                        + "'><label for='" + sData
                                        + "'></label>");
                              com.leanway.columnTdBindSelectNew(nTd,"saveProductorsAll","saveProductorsList");
                            }
                        },
                    	{
							"mDataProp" : "productorname"
						},
						{
							"mDataProp" : "productordesc"
						},
                   ],

	                   "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
			            	  $(nRow).dblclick(function () {
			            		  saveProductorTable.rows(iDataIndex).remove().draw(false);


			            		  // 重新添加数据到DataTable，解决index下标错误的问题， 操作步骤，1：先删除第一条数据，第二条时删除不掉
			            		  var tempData = saveProductorTable.rows().data();

			            		  saveProductorTable.rows().remove().draw(false);

			            		  saveProductorTable.rows.add(tempData).draw(false);			            	  });

			            	  $(nRow).click(function () {
			            		  if ($(this).hasClass('row_selected')) {
			            			  $(this).removeClass('row_selected');
			            			  $(this).find('td').eq(0).find("input[name='saveProductorsAll']").prop("checked", false)
			            		  } else {
			            			  $(this).addClass('row_selected');
			            			  $(this).find('td').eq(0).find("input[name='saveProductorsAll']").prop("checked", true)
			            		  }
			            	  });
			              },

                 "oLanguage" : {
                     "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                 },
                 "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                 "fnDrawCallback" : function(data) {
                     com.leanway.dataTableClickMoreSelect("saveProductorsTable", "saveProductorsList", false,
                    		 saveProductorTable, undefined,undefined,undefined,"saveProductorsAll");

                 }
             }).on('xhr.dt', function (e, settings, json) {
                 com.leanway.checkLogind(json);
             } );

		return table;
}

var printCenter = function ( ) {
	
	// 获取选中的数据
	var data = oTable.rows('.row_selected').data();
	
	var value = "";
	//var productionnumberPrint = "";

	if (data == undefined || typeof (data) == "undefined") {
		lwalert("tipModal", 1, "请选择数据!");
		return;
	} else if (data.length != 1) {
		lwalert("tipModal", 1, "请选择一条数据进行打印!");
		return;

	} else {
		value = data[0].centerid;
	//	productionnumberPrint = data[0].productionnumber;
	}
	
	 $("#qrcode").html("");
     generateQRCode("canvas",value);
  //   $("#qrcode").append("<div><a href='"+url+"' class='btn btn-primary'>download</a></div>");
	    
     var img = document.getElementById("printimage"); /// get image element
     var canvas  = document.getElementsByTagName("canvas")[0];  /// get canvas element
      img.src = canvas.toDataURL();                     /// update image
 	        
	$("#printModal").modal("show");
}

function generateQRCode(rendermethod,value) {

    $("#qrcode").qrcode({
        render: rendermethod, // 渲染方式有table方式（IE兼容）和canvas方式
        text: value, //内容
        height : 128,
        width : 128
    });
}

function printBarcode() {
	

	
	$("#printdiv").printArea();
}