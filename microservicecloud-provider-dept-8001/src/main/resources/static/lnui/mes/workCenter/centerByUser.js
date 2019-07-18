var clicktime = new Date();
var ope = "addWorkCenter";

$(function() {
	initBootstrapValidator();
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
                    groupid : {
                        validators : {
                            notEmpty : {},
                        }
                    },
					// barcode : {
					// validators : {
					// stringLength : {
					// min : 2,
					// max : 100
					// }
					// }
					// },
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

var oTable;
var shutDownTable;
$(function() {
	// 初始化对象
	com.leanway.loadTags();
	com.leanway.formReadOnly("workCenterForm");
	com.leanway.formReadOnly("addressForm");
	// 加载datagrid
	oTable = initTable();
	shutDownTable = initShutDownTable();
	queryCalendarList();
	queryDispatchList();
	queryWorkCenterGroupList();
	queryCenterTypeList()
	// com.leanway.initSelect2("#shutdownreasonid",
	// "../../shutdownreason?method=queryShutdownReason", "搜索停机原因");
	// 全选
	// com.leanway.dataTableCheckAll("generalInfo", "checkAll", "checkList");
	com.leanway.enterKeyDown("searchValue", searchWorkCenter);
	$("#addEquipButton").hide();

	dyscGetProvinceCityCountry("#provinceId", "province", $('#provinceId')
			.val(), $('#cityId').val());
	$("#mainworkcenter0").prop("disabled",true);
	$("#mainworkcenter1").prop("disabled",true);
})

function queryWorkCenterGroupList() {
	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/workCenter",
		data : {
			method : "queryWorkCenterGroupList",
			conditions : "{}"
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				resetForm();
				setWorkCenterGroup(data.workCenterGroupResult);

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

var setWorkCenterGroup = function(data) {
	var html = "";
	for ( var i in data) {
		html += "<option value=" + data[i].groupid + ">" + data[i].groupname
				+ "</option>";
	}

	$("#groupid").html(html);
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
						"ajax" : "../../../../"+ln_project+"/workCenter?method=queryWorkCenterListByUser",
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
							setWorkcenterShutdown(data.jqXHR.responseJSON.checked);
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
			    $("#addEquipButton").hide();
				resetForm();
				var tempData = $.parseJSON(data);

				setFormValue(tempData.workCenter);

				var str = '';
				for (var i = 0; i < tempData.workCentersShutdown.length; i++) {
					str += tempData.workCentersShutdown[i].shutdownreasonid;
					str += ",";
				}
				var ids = str.substr(0, str.length - 1);

				shutDownTable.ajax.url(
						"../../../../"+ln_project+"/shutdownreason?method=queryShutDownList&ids=" + ids)
						.load();

				setWorkcenterShutdown(tempData.workCentersShutdown);
				setTableValue(tempData.equipmentLegerList,tempData.workCenter);
				equipmentLegerData = tempData.equipmentLegerList;
				type = tempData.workCenter.centrtype;
				count = tempData.workCenter.resourcescount;
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

/**
 * 填充到台账表格(拼接table)
 */
function setTableValue(data,workCenter) {
	var tableHeadHtml = ""
	tableHeadHtml += " <tr>";
	tableHeadHtml += "  <th>" + "设备状态" + "</th>";
	tableHeadHtml += "  <th>" + "台账序号" + "</th>";
	tableHeadHtml += "  <th>" + "台帐编号" + "</th>";
	tableHeadHtml += "  <th>" + "台帐名称" + "</th>";
	tableHeadHtml += "  <th>" + "台账条码" + "</th>";
	tableHeadHtml += "  <th>" + "MAC地址" + "</th>";
	tableHeadHtml += "  <th>" + "关键设备" + "</th>";
	tableHeadHtml += "  <th>" + "完好工时" + "</th>";
	tableHeadHtml += "  <th>" + "图片" + "</th>";
	tableHeadHtml += " </tr>";
	$("#tableHead").html(tableHeadHtml);
	var tableBodyHtml = "";
	for ( var i in data) {
		if (data[i].equipmentnum == null) {
			data[i].equipmentnum = "";
		}
		imageId = data[i].url;
		tableBodyHtml += " <tr>";
		tableBodyHtml += "  <td>" + statusConvertToName(workCenter,data[i].equipstatusid) + "</td>";
		tableBodyHtml += "  <td>" + data[i].serialnumber + "</td>";
		tableBodyHtml += "  <td>" + data[i].equipmentnum + "</td>";
		tableBodyHtml += "  <td>" + data[i].equipmentname + "</td>";
		tableBodyHtml += "  <td>" + data[i].barcode + "</td>";
		tableBodyHtml += "  <td>"
				+ (data[i].clientname == null ? "" : data[i].clientname)
				+ "</td>";
		if (data[i].criticalequipment == "1") {
			tableBodyHtml += "  <td>是</td>";
		} else {
			tableBodyHtml += "  <td>否</td>";
		}
		tableBodyHtml += "  <td>" + data[i].uptime + "</td>";
		tableBodyHtml += "  <td><button  type='button' class='btn btn-primary btn-xs' onclick='display(&quot;"
				+ data[i].url + "&quot;)'>查 看</button></td>";
		tableBodyHtml += " </tr>";
	}
	$("#tableBody").html(tableBodyHtml);

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
	resetForm();
	for ( var item in data) {
		if (item != "searchValue") {
			$("#" + item).val(data[item]);
		}

	}
	if (data.url != null) {
		$("#imageId").attr("src", "../../../" + data.url);
	} else {
//		$("#imageId").attr("src", "../../upload/noimg.jpg");
		$("#imageId").attr("src", "../../../lnfiles/upload/noimg.jpg");
	}

	// 初始化省
//	dyscGetProvinceCityCountry("#provinceId", "province", $('#provinceId')
//			.val(), $('#cityId').val());
	$('#provinceId').val(data.province);
	$('#cityId').empty();
	$('#districtId').empty();

	// 初始化地址
	var addressId = data.addressid;
	if (addressId != ''&& addressId!=null) {

		$('#addressid').val(addressId);

//		dyscGetProvinceCityCountry("#cityId", "city",
//				data.province, 0);
//		dyscGetProvinceCityCountry("#districtId", "district",
//				data.province, data.city);
		//city下拉框赋值
		var outPut = [];
		outPut
		.push("<option value='0' selected='selected'>=请选择=</option>");
		for ( var key in data.cityList) {
			var tempOption;

				tempOption = "<option value='" + data.cityList[key].city
						+ "'>" + data.cityList[key].name + "</option>"

			outPut.push(tempOption);
		}
		$("#cityId").html(outPut.join(''));

		//district下拉框赋值
		var outPut2 = [];
		outPut2
		.push("<option value='0' selected='selected'>=请选择=</option>");
		for ( var key in data.countryList) {
			var tempOption2;

				tempOption2 = "<option value='" + data.countryList[key].district
						+ "'>" + data.countryList[key].name + "</option>"

			outPut2.push(tempOption2);
		}
		$("#districtId").html(outPut2.join(''));
		$('#provinceId').val(data.province);
		$('#cityId').val(data.city);
		$('#districtId').val(data.country);
		$('#registAddress').val(data.location);
		$('#code').val(data.code);


		var radioNames = "mainworkcenter";

		for ( var item in data) {
			//alert(item);
			if(radioNames.indexOf(item) != -1) {
				//alert(item);
				$("input[type=radio][name=" + item + "][value=" + data[item] + "]").prop('checked','true');
			}
		}
	}
}

//// 根据AddressId获取地址
//function getAddressById(addressId) {
//
//	$
//			.ajax({
//				type : 'get',
//				url : '../../address',
//				data : {
//					method : "gain",
//					addressId : addressId
//				},
//				dataType : 'text',
//				success : function(data) {
//
//					var flag =  com.leanway.checkLogind(data);
//
//					if(flag){
//
//						var tempData = $.parseJSON(data);
//						$('#addressid').val(addressId);
//
//						// 初始化省、市、县
////						dyscGetProvinceCityCountry("#provinceId", "province", $(
////								'#provinceId').val(), $('#cityId').val());
//
//						dyscGetProvinceCityCountry("#cityId", "city",
//								tempData.province, 0);
//						dyscGetProvinceCityCountry("#districtId", "district",
//								tempData.province, tempData.city);
//
//						$('#provinceId').val(tempData.province);
//						$('#cityId').val(tempData.city);
//						$('#districtId').val(tempData.country);
//						$('#code').val(tempData.code);
//
//					}
//				},
//				error : function(data) {
//
//				}
//			});
//}

// 触发select2选择事件，给隐藏域赋值
// $("#reasoncode").on("select2:select", function(e) {
//
// $("#reasoncode").val($(this).find("option:selected").text());

// var orderid = $(this).find("option:selected").val()
// });

/**
 * 修改数据
 *
 */
function updateWorkCenter() {

	$("#selectId").css("display", "block");
	$("#uploadButton").css("display", "block");
	ope = "updateWorkCenter";
	var data = oTable.rows('.row_selected').data();
	workcenterpath = $("#workcenterpath").val();
	if (data.length == 0) {
		// alert("请选择要修改的工作中心！");
		lwalert("tipModal", 1, "请选择要修改的工作中心！");
	} else if (data.length > 1) {
		// alert("只能选择一个工作中心进行修改！");
		lwalert("tipModal", 1, "只能选择一个工作中心进行修改！");
	} else {

		com.leanway.removeReadOnly("workCenterForm");
		com.leanway.removeReadOnly("addressForm");

		document.getElementById("centername").readOnly = true;
		document.getElementById("uptime").readOnly = true;
		document.getElementById("resourcescount").readOnly = true;
		document.getElementById("centrtype").disabled = true;
		document.getElementById("maplevels").disabled = true;
		$("#mainworkcenter0").prop("disabled",false);
	    $("#mainworkcenter1").prop("disabled",false);
		$("#addEquipButton").show();
		var tableHeadHtml = ""
		tableHeadHtml += " <tr>";
		tableHeadHtml += "  <th>" + "台账序号" + "</th>";
		tableHeadHtml += "  <th>" + "台账编号" + "</th>";
		tableHeadHtml += "  <th>" + "台账名称" + "</th>";
		tableHeadHtml += "  <th>" + "台账条码" + "</th>";
		tableHeadHtml += "  <th>" + "MAC地址" + "</th>";
		tableHeadHtml += "  <th>" + "关键设备" + "</th>";
		tableHeadHtml += "  <th>" + "完好工时" + "</th>";
		tableHeadHtml += "  <th>" + "图片" + "</th>";
		tableHeadHtml += " </tr>";
		$("#tableHead").html(tableHeadHtml);

		var tableBodyHtml = "";
		for (var i = 0; i < count; i++) {
			if (equipmentLegerData[i].equipmentnum == null) {
				equipmentLegerData[i].equipmentnum = "";
			}
			imageId = equipmentLegerData[i].url;
			tableBodyHtml += " <tr>";
			tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
					+ equipmentLegerData[i].serialnumber
					+ "' id='serialnumber'  readonly='readonly' style='width: 100px;'/></td>";
			tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
					+ equipmentLegerData[i].equipmentnum
					+ "' id='serialnumber'   style='width: 100px;'/></td>";
			if (type == "人工") {
				tableBodyHtml += "<td><select id='equipmentname"
						+ i
						+ "'  name='equipmentname' class='form-control select2' style='width: 100px;'></td>";
				tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
                    + equipmentLegerData[i].barcode
                    + "' id='barcode' style='width: 100px;' readonly='readonly'/></td>";
			} else {
				tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
						+ equipmentLegerData[i].equipmentname
						+ "' id='equipmentname' style='width: 100px;'/></td>";
				tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
                    + equipmentLegerData[i].barcode
                    + "' id='barcode' style='width: 100px;'/></td>";
			}

			tableBodyHtml += "<td><select id='clientid"
					+ i
					+ "'  name='clientid' class='form-control select2' style='width: 110px;'></td>";

			if (equipmentLegerData[i].criticalequipment == 1) {
				tableBodyHtml += "  <td><input type='radio' name='criticalequipment"
						+ i
						+ "'  value='1' checked/>是 <input type='radio' name='criticalequipment"
						+ i + "'  value='0'/>否 </td>";
			} else {
				tableBodyHtml += "  <td><input type='radio' name='criticalequipment"
						+ i
						+ "' value='1'/>是 <input type='radio' name='criticalequipment"
						+ i + "' value='0' checked/>否 </td>";
			}

			tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
					+ equipmentLegerData[i].uptime
					+ "' id='uptime' style='width: 100px;' onkeyup='isNumber()' onafterpaste='isNumber()' name='uptime'/></td>";
			tableBodyHtml += "  <td style='display:none'> <input type='hidden' value='"
					+ equipmentLegerData[i].equipmentid
					+ "' id='equipmentid' style='width: 100px;'/></td>";
			tableBodyHtml += "  <td style='display:none'> <input type='hidden' value='"
					+ equipmentLegerData[i].equipmentpath
					+ "' name='equipmentpath'  id='equipmentpath" + i
					+ "' style='width: 100px;'/></td>";
			tableBodyHtml += "  <td><button  type='button' class='btn btn-primary btn-xs' onclick='displayPicture(&quot;equipmentpath"
					+ i + "&quot;)'>查 看</button></td>";
			tableBodyHtml += " </tr>";

		}

		$("#tableBody").html(tableBodyHtml);
		for (var i = 0; i < count; i++) {
			if (type == "人工") {
				com.leanway.initSelect2("#equipmentname" + i,
						"../../../../"+ln_project+"/workCenter?method=queryEmployeeList", "搜索雇员");
			}
			com.leanway.initSelect2("#clientid" + i,
					"../../../../"+ln_project+"/workCenter?method=queryBoxClients", "搜索MAC地址");
		}
		for (var j = 0; j < equipmentLegerData.length; j++) {
			if (type == "人工") {
				$("#equipmentname" + j).append(
						'<option value=' + equipmentLegerData[j].employeeid
								+ '>' + equipmentLegerData[j].equipmentname
								+ '</option>');
				$("#equipmentname" + j).select2("val",
						equipmentLegerData[j].employeeid);
			}
			$("#clientid" + j).append(
					'<option value=' + equipmentLegerData[j].clientid + '>'
							+ equipmentLegerData[j].clientname + '</option>');
			$("#clientid" + j).select2("val", equipmentLegerData[j].clientid);
		}

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

	ope = "addWorkCenter";
	// 清空表单
	resetForm();
//	$("#imageId").attr("src", "../../files/upload/noimg.jpg");
	$("#imageId").attr("src", "../../../lnfiles/upload/noimg.jpg");
	$("#workcenterpath").val("");
	com.leanway.removeReadOnly("workCenterForm");
	com.leanway.removeReadOnly("addressForm");
	$("#mainworkcenter0").prop("disabled",false);
    $("#mainworkcenter1").prop("disabled",false);
    $("#code").prop("readonly",true);
	document.getElementById("maplevels").disabled = true;
	com.leanway.dataTableUnselectAll("generalInfo", "checkList");
	com.leanway.dataTableUnselectAll("generalInfo", "checkAll");
	com.leanway.dataTableUnselectAll("shutDownInfo", "checkListShutDown");
	com.leanway.clearTableMapData( "generalInfo" );

	dyscGetProvinceCityCountry("#provinceId", "province", $('#provinceId')
			.val(), $('#cityId').val());

	$('#cityId').empty();
	$('#districtId').empty();
	$('#code').val("");
	$('#maplevels').val("");
	$('#registAddress').val("");

}
function addEquip() {

	$("#selectId").css("display", "block");
	$("#uploadButton").css("display", "block");
	var centrtype = $("#centrtype").val();
	var resourcescount = $("#resourcescount").val();
	var centername = $("#centername").val();
	var barcode = $("#barcode").val();
	var employee;

	// $.ajax({
	// type : "post",
	// url : "../../workCenter?method=queryEmployeeList",
	// data : {
	// "conditions" : {}
	// },
	// dataType : "text",
	// async : false,
	// success : function(text) {
	// var tempData = $.parseJSON(text);
	// employee=tempData;
	//
	// }
	// });
	if (!document.getElementById("resourcescount").readOnly) {
		var tableHeadHtml = ""
		tableHeadHtml += " <tr>";
		tableHeadHtml += "  <th>" + "台账序号" + "</th>";
		tableHeadHtml += "  <th>" + "台账编号" + "</th>";
		tableHeadHtml += "  <th>" + "台账名称" + "</th>";
		tableHeadHtml += "  <th>" + "台账条码" + "</th>";
		tableHeadHtml += "  <th>" + "MAC地址" + "</th>";
		tableHeadHtml += "  <th>" + "关键设备" + "</th>";
		tableHeadHtml += "  <th>" + "完好工时" + "</th>";
		tableHeadHtml += "  <th>" + "图片" + "</th>";
		tableHeadHtml += " </tr>";
		$("#tableHead").html(tableHeadHtml);

		var tableBodyHtml = "";

		for (var i = 0; i < resourcescount; i++) {

			tableBodyHtml += " <tr>";
			tableBodyHtml += "  <td> <input class='form-control' type='text' name='serialnumber' id='serialnumber' value='"
					+ centername
					+ "_"
					+ i
					+ "' readonly='readonly'  style='width: 100px;'/></td>";
			// tableBodyHtml += " <td> <select id='equipmentname"+i+"'
			// name='equipmentname'></select></td>";
			tableBodyHtml += "  <td> <input class='form-control' type='text'  name='equipmentnum' id='equipmentnum' style='width: 100px;'/></td>";
			if (centrtype == "人工") {
				tableBodyHtml += "<td><select id='equipmentname"
						+ i
						+ "'  name='equipmentname' class='form-control select2' style='width: 110px;'></td>";
				tableBodyHtml += "  <td> <input class='form-control' type='text'  name='barcode' id='barcode' value='' style='width: 100px;' readonly='readonly'/></td>";
			} else {
				tableBodyHtml += "  <td> <input class='form-control' type='text'  name='equipmentname' id='equipmentname' value='"
						+ centername + i + "' style='width: 100px;'/></td>";
				tableBodyHtml += "  <td> <input class='form-control' type='text'  name='barcode' id='barcode' value='' style='width: 100px;'/></td>";
			}

			tableBodyHtml += "<td><select id='clientid"
					+ i
					+ "'  name='clientid' class='form-control select2' style='width: 110px;'></td>";
			tableBodyHtml += "  <td><input type='radio' name='criticalequipment"
					+ i
					+ "'  value='1'/>是 <input type='radio' name='criticalequipment"
					+ i + "' value='0' checked/>否 </td>";
			tableBodyHtml += "  <td> <input class='form-control' type='text'  name='uptime' id='uptime' style='width: 100px;' onkeyup='isNumber()' onafterpaste='isNumber()'/></td>";
			tableBodyHtml += "  <td style='display:none'> <input type='hidden' value='' id='equipmentid' style='width: 100px;'/></td>";
			tableBodyHtml += "  <td style='display:none'> <input type='hidden' value='' id='equipmentpath"
					+ i
					+ "' name='equipmentpath' style='width: 100px;' /></td>";
			tableBodyHtml += "  <td><button  type='button' class='btn btn-primary btn-xs' onclick='displayPicture(&quot;equipmentpath"
					+ i + "&quot;)'>查 看</button></td>";
			tableBodyHtml += " </tr>";

		}

		$("#tableBody").html(tableBodyHtml);
		var html = "";
		for ( var i in employee) {

			html += "<option value=" + employee[i].name + ">"
					+ employee[i].name + "</option>";

		}
		for (var i = 0; i < resourcescount; i++) {

			// $("#equipmentname"+i).html(html);
			com.leanway.initSelect2("#equipmentname" + i,
					"../../../../"+ln_project+"/workCenter?method=queryEmployeeList", "搜索雇员");
			com.leanway.initSelect2("#clientid" + i,
					"../../../../"+ln_project+"/workCenter?method=queryBoxClients", "搜索MAC地址");
		}
		// }else{
		// $("#tableBody").html("");
		// $("#tableHead").html("");
		// }
	}
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

	document.getElementById("centrtype").disabled = false;
	if (arr.length != $.unique(arr).length&&$("#centrtype").val()!="人工") {
        flag = false;
    }
	var centerid = $("#centerid").val();
	var centername = $("#centername").val();
	var shorname = $("#shorname").val();
	var barcode = $("#barcode").val();
	var resourcescount = $("#resourcescount").val();
	var groupid = $("#groupid").val();
	var calendarid = $("#calendarid").val();
	var centrtype = $("#centrtype").val();
	var argid = $("#argid").val();
	var province = $('#provinceId').val();
	var city = $('#cityId').val();
	var district = $('#districtId').val();
	var addressid = $('#addressid').val();
	var registAddress = $('#registAddress').val();
	var maplevels = $('#maplevels').val();
	var code = $('#code').val();
	var mainworkcenter = $('input[name="mainworkcenter"]:checked ').val();

	var reg = /,$/gi;
	var equipVal = "[";

	// 选中的停机原因
	var str = '';

	// 拼接选中的checkbox
	$("input[name='checkListShutDown']:checked").each(function(i, o) {
		str += $(this).val();
		str += ",";
	});
	var employeeid="";
	$("#tableBody").find('tr').each(
			function(index, temp) {
				var serialnumber = $(this).find("td:nth-child(1)")
						.find("input").val();
				var equipmentnum = $(this).find("td:nth-child(2)")
						.find("input").val();
				if (centrtype == "人工") {
					var equipmentname = $(this).find("td:nth-child(3)").find(
							"option:selected").text();
					employeeid = $(this).find("td:nth-child(3)").find(
                    "option:selected").val();
				} else {
					var equipmentname = $(this).find("td:nth-child(3)").find(
							"input").val();
				}
				var barcode = $(this).find("td:nth-child(4)").find("input")
						.val();
				var clientid = $(this).find("td:nth-child(5)").find(
						"option:selected").val();
				var criticalequipment = $(this).find("td:nth-child(6)").find(
						'input:radio:checked').val();
				var uptime = $(this).find("td:nth-child(7)").find("input")
						.val();
				var equipmentid = $(this).find("td:nth-child(8)").find("input")
						.val();
				var equipmentpath = $(this).find("td:nth-child(9)").find(
						"input").val();
				equipVal += "{\"serialnumber\" : \"" + serialnumber + "\","
						+ "\"equipmentnum\" : \"" + equipmentnum + "\","
						+ "\"equipmentname\" : \"" + equipmentname + "\","
						+ "\"barcode\":\"" + barcode + "\","
						+ "\"clientid\":\"" + clientid + "\","
						+ "\"criticalequipment\":\"" + criticalequipment
						+ "\"," + "\"uptime\":\"" + uptime + "\","
						+ "\"equipmentid\":\"" + equipmentid + "\","
						+ "\"employeeid\":\"" + employeeid + "\","
						+ "\"equipmentpath\":\"" + equipmentpath + "\"},";
			});
	equipVal = equipVal.replace(reg, "");
	equipVal += "]";
	$('#equipVal').val(equipVal);
	var form = $("#workCenterForm").serializeArray();
	// 后面确认时应 检测模具编号是否已存在
	var formData = formatFormJson(form);
	// var shutdownreasonid = $("#shutdownreasonid").val();
	// var shutdownreason= JSON.stringify(shutdownreasonid);

	$("#workCenterForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#workCenterForm').data('bootstrapValidator').isValid()) {// 返回true、false
		if (($("#workcenterpath").val() != "" && $("#length").val() != ""
				&& $("#width").val() != "" && $("#length").val() != 0 && $(
				"#width").val() != 0)
				|| $("#workcenterpath").val() == "") {
			if ($("#centername").val() != "") {

				if (flag) {
				    if(str.length>0){
					$.ajax({
						type : "POST",
						url : "../../../../"+ln_project+"/workCenter",
						data : {
							"method" : ope,
							formData : formData,
							"centerid" : centerid,
							"calendarid" : calendarid,
							"argid" : argid,
							"shutdownreason" : str,
							province : province,
							city : city,
							district : district,
							addressId : addressid,
							registAddress : registAddress,
							maplevels : maplevels,
							code : code,
							mainworkcenter : mainworkcenter
						},
						dataType : "text",
						async : false,
						success : function(data) {

							var flag =  com.leanway.checkLogind(data);

							if(flag){

								var tempData = $.parseJSON(data);
								if (tempData.status == "success") {
									com.leanway.formReadOnly("workCenterForm");
									com.leanway.formReadOnly("addressForm");

									com.leanway.clearTableMapData( "generalInfo" );
									if(ope=="addWorkCenter"){
		                                oTable.ajax.reload();
		                            }else{
		                                oTable.ajax.reload(null,false);
		                            }
									// ajaxLoadWorkCenter(tempData.resultObj.centerid);
									$("#addEquipButton").hide();
									lwalert("tipModal", 1, tempData.info);
								} else {
									// alert("操作失败");
									lwalert("tipModal", 1, tempData.info);
								}

							}
						}
					});
				    }else{
				        lwalert("tipModal", 1, "请勾选停机原因");
				    }
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

	$("#centerid").val("");
	$("#tableHead").html("");
	$("#tableBody").html("");
	$("#uptime").val("");
	$("#shutdownreasonid").empty();
	com.leanway.dataTableUnselectAll("shutDownInfo", "checkListShutDown");
	$("#workCenterForm").data('bootstrapValidator').resetForm();
}
/**
 * 搜索工作中心
 */
var searchWorkCenter = function() {

	var searchVal = $("#searchValue").val();

	oTable.ajax.url(
			"../../../../"+ln_project+"/workCenter?method=queryWorkCenterListByUser&searchValue="
					+ searchVal).load();
	$("#searchValue").val("");
}
/**
 * 资源数加1
 */
function addResourcecount() {
	var resourcescount = $("#resourcescount").val();
	$("#resourcescount").val(parseInt(resourcescount) + 1);
}

function addEquipment() {

	$("#selectId").css("display", "block");
	$("#uploadButton").css("display", "block");
	var centrtype = $("#centrtype").val();
	var centername = $("#centername").val();
	var barcode = $("#barcode").val();
	var employee;
	var tableBodyHtml = "";
	var i = $("#grid-data").find("tr").length;
	tableBodyHtml += " <tr>";
	tableBodyHtml += "  <td> <input class='form-control' type='text' name='serialnumber' id='serialnumber' value='"
			+ centername
			+ "_"
			+ i
			+ "' readonly='readonly'  style='width: 100px;'/></td>";
	tableBodyHtml += "  <td> <input class='form-control' type='text'  name='equipmentnum' id='equipmentnum' value='' style='width: 100px;'/></td>";
	if (centrtype == "人工") {
		tableBodyHtml += "<td><select id='equipmentname"
				+ i
				+ "'  name='equipmentname' class='form-control select2' style='width: 110px;'></td>";
		tableBodyHtml += "  <td> <input class='form-control' type='text'  name='barcode' id='barcode' value='' style='width: 100px;' readonly='readonly'/></td>";
	} else {
		tableBodyHtml += "  <td> <input class='form-control' type='text'  name='equipmentname' id='equipmentname' value='"
				+ centername + i + "' style='width: 100px;'/></td>";
		tableBodyHtml += "  <td> <input class='form-control' type='text'  name='barcode' id='barcode' value='"
            + barcode + i + "' style='width: 100px;'/></td>";
	}

	tableBodyHtml += "<td><select id='clientid"
			+ i
			+ "'  name='clientid' class='form-control select2' style='width: 110px;'></td>";
	tableBodyHtml += "  <td><input type='radio' name='criticalequipment" + i
			+ "'  value='1'/>是 <input type='radio' name='criticalequipment" + i
			+ "' value='0' checked/>否 </td>";
	tableBodyHtml += "  <td> <input class='form-control' type='text'  name='uptime' id='uptime' style='width: 100px;' onkeyup='isNumber()' onafterpaste='isNumber()'/></td>";
	tableBodyHtml += "  <td style='display:none'> <input type='hidden' value='' id='equipmentid' style='width: 100px;'/></td>";
	tableBodyHtml += "  <td style='display:none'> <input type='hidden' value='" + workcenterpath
			+ "' name='equipmentpath'  id='equipmentpath" + i
			+ "' style='width: 100px;'/></td>";
	tableBodyHtml += "  <td><button  type='button' class='btn btn-primary btn-xs' onclick='displayPicture(&quot;equipmentpath"
			+ i + "&quot;)'>查 看</button></td>";
	tableBodyHtml += " </tr>";
	$("#tableBody").append(tableBodyHtml);
	var html = "";
	for ( var i in employee) {

		html += "<option value=" + employee[i].name + ">" + employee[i].name
				+ "</option>";

	}

	com.leanway.initSelect2("#equipmentname" + i,
			"../../../../"+ln_project+"/workCenter?method=queryEmployeeList", "搜索雇员");
	com.leanway.initSelect2("#clientid" + i,
			"../../../../"+ln_project+"/workCenter?method=queryBoxClients", "搜索MAC地址");
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
//		lwalert("tipModal", 1, "请选择图片上传");
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
$('#provinceId').change(
		function() {
			$('#cityId').empty();
			dyscGetProvinceCityCountry("#cityId", "city", $('#provinceId')
					.val(), $('#cityId').val());
			$('#districtId').empty();
		});

// 选择城市触发
$('#cityId').change(
		function() {
			dyscGetProvinceCityCountry("#districtId", "district", $(
					'#provinceId').val(), $('#cityId').val());
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
	var provinceValue = $("#provinceId option:selected").text();
	str += provinceValue;
	var cityValue = $("#cityId option:selected").text();
	str += cityValue;
	var districtIdValue = $("#districtId option:selected").text();
	str += districtIdValue;
	var registAddress = $("#registAddress").val();
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