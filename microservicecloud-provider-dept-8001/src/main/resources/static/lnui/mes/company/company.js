var clicktime = new Date();

// Gree Table 初始化配置
glyph_opts = {
	map : {
		doc : "glyphicon glyphicon-file",
		docOpen : "glyphicon glyphicon-file",
		checkbox : "glyphicon glyphicon-unchecked",
		checkboxSelected : "glyphicon glyphicon-check",
		checkboxUnknown : "glyphicon glyphicon-share",
		// dragHelper : "glyphicon glyphicon-play",
		// dropMarker : "glyphicon glyphicon-arrow-right",
		error : "glyphicon glyphicon-warning-sign",
		expanderClosed : "glyphicon glyphicon-plus-sign",
		expanderLazy : "glyphicon glyphicon-plus-sign", // glyphicon-expand
		expanderOpen : "glyphicon glyphicon-minus-sign", // glyphicon-collapse-down
		folder : "glyphicon glyphicon-folder-close",
		folderOpen : "glyphicon glyphicon-folder-open",
		loading : "glyphicon glyphicon-refresh"
	}
};

// 初始化dataGrid
var initCompanyTreeTable = function() {
	$("#companyTreeTable")
			.fancytree(
					{
						extensions : [ "dnd", "edit", "glyph", "table" ],
						checkbox : true,
						selectMode : 3,
						dnd : {
							focusOnClick : false,
							dragStart : function(node, data) {
								return true;
							},
							dragEnter : function(node, data) {
								return true;
							},
							dragDrop : function(node, data) {
								data.otherNode.copyTo(node, data.hitMode);
							}
						},
						glyph : glyph_opts,
						source : {
							url : "../../../"+ln_project+"/company?method=getCompanyListByLevel&currentPage="
									+ $("#currentPage").val(),
							debugDelay : 10
						},
						table : {
							checkboxColumnIdx : 1,
							nodeColumnIdx : 2
						},
						lazyLoad : function(event, data) {
							data.result = {
								url : "../../../"+ln_project+"/company?method=getCompanyListByLevel&level="
										+ data.node.data.levels
										+ "&currentPage="
										+ $("#currentPage").val(),
								debugDelay : 10
							};
						},

						renderColumns : function(event, data) {
							var node = data.node;
							$tdList = $(node.tr).find(">td");
							$tdList.eq(0).text(node.getIndexHier());
							$tdList.eq(3).text(node.data.shortName);
						},

						click : function(event, data) {
							// 表单只读
							com.leanway.formReadOnly("companyForm");

							// 根据选中数据id查询详细信息
							getCompanyById(data.node.data.compid);

							//htmlStatus为1时为不可编辑
							htmlStatus = 1;

							//根据compid查找对应银行账户信息
							bankAccountTable.ajax.url("../../../"+ln_project+"/bankAccount?method=queryBankAccount&compid=" + data.node.data.compid).load();
						}

					});
	// 准备分页
	prePageFunc();
}


function prePageFunc() {
	var currentPage = $("#currentPage").val();
	$.ajax({
		type : 'get',
		url : '../../../'+ln_project+'/company',
		data : {
			method : 'getFirstLevelCompany',
			currentPage : currentPage
		},
		dataType : 'text',
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);

				// 初始化分页
				initEasyPageFunc(tempData.currentPage, tempData.totalPage);
			}
		},
		error : function(data) {

		}
	});

}

// 重新加载
function reloadTable() {
	$("#companyTreeTable")
			.fancytree(
					{
						source : {
							url : "../../../"+ln_project+"/company?method=getCompanyListByLevel&currentPage="
									+ $("#currentPage").val(),
							debugDelay : 10
						}
					});
}

// 获取选择的层级
var getTreeTableActiveLevels = function() {
	var result = "";
	var node = $("#companyTreeTable").fancytree("getActiveNode");

	// 获取选中的用户标识
	if (node != null && node != "undefined" && typeof (node) != "undefined") {
		result = node.data.levels;
	}

	return result;
}

// 获取选中的treeGrid 的id
var getTreeTableActiveId = function() {

	var result = "";
	var node = $("#companyTreeTable").fancytree("getActiveNode");

	// 获取选中的用户标识
	if (node != null && node != "undefined" && typeof (node) != "undefined") {
		result = node.data.compid;
	}

	return result;
}

// 获取checkbox选中的treeGrid 的层级标识
var getTreeTableSelectedLevels = function() {

	var str = '';

	// 拼接选中的checkbox
	var tree = $("#companyTreeTable").fancytree("getTree");
	var nodes = tree.getSelectedNodes();

	if (nodes.length > 0) {
		for (var i = 0; i < nodes.length; i++) {
			str += nodes[i].data.levels + ",";
		}
	}

	return str;
}

//初始化申请注册表格
var initCompanyApplyTable = function() {

	var table = $('#companyApplyDataTable')
			.DataTable(
					{
						"ajax" : "../../../"+ln_project+"/company?method=queryCompanyApply",
						//"iDisplayLength" : "10",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
			            //"sScrollX" : 400, //DataTables的宽
						"scrollY":"250px",
						"bAutoWidth": true,  //宽度自适应
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",
						"columns" : [ {
							"data" : "compid"
						}, {
							"data" : "compname"
						}, {
							"data" : "shortname"
						}],
						"aoColumns" : [
								{
									"mDataProp" : "compid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd)
												.html(
														"<input class='regular-checkbox' type='checkbox' id='"
																+ sData
																+ "' name='checkList' value='"
																+ sData
																+ "'><label for='"
																+ sData
																+ "'></label>");
									}
								}, {
									"mDataProp" : "compname"
								}, {
									"mDataProp" : "shortname"
								}
						],

						"oLanguage" : {
				        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
				         },
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {

					        // 点击dataTable触发事件
                          com.leanway.dataTableClick("companyApplyDataTable", "checkList", true,
                          		companyApplyTable, getCompanyById);


//								$('input[type="checkbox"]').icheck({
//									labelHover : false,
//									cursor : true,
//									checkboxClass : 'icheckbox_flat-blue',
//									radioClass : 'iradio_flat-blue'
//								});
						}

					}).on('xhr.dt', function (e, settings, json) {
						com.leanway.checkLogind(json);
					} );

	return table;
}

/**
* 通过申请
*/
var passApply = function (type) {

	var str = '';
	// 拼接选中的checkbox
	$("input[name='checkList']:checked").each(function(i, o) {
		str += $(this).val();
		str += ",";
	});

	if (str.length > 0) {

		var ids = str.substr(0, str.length - 1);
		if(type=="2"){
//		if (confirm("确定所选公司通过申请?")) {
//			passAjax(ids);
//		}
			lwalert("tipModal", 2,"确定所选公司通过申请?","isSurepass()");
		}else{
//			if (confirm("确定所选公司不通过申请?")) {
//				unpassAjax(ids);
//			}
			lwalert("tipModal", 2,"确定所选公司不通过申请?","isSureunpass()");
		}

	} else {
//		alert("至少选择一条记录操作");
		lwalert("tipModal", 1, "至少选择一条记录操作！");
	}

}
function isSurepass(){
	var str = '';
	// 拼接选中的checkbox
	$("input[name='checkList']:checked").each(function(i, o) {
		str += $(this).val();
		str += ",";
	});


	var ids = str.substr(0, str.length - 1);
	passAjax(ids);
}

function isSureunpass(ids){
	var str = '';
	// 拼接选中的checkbox
	$("input[name='checkList']:checked").each(function(i, o) {
		str += $(this).val();
		str += ",";
	});


	var ids = str.substr(0, str.length - 1);
	unpassAjax(ids);
}
//企业通过注册申请
var passAjax = function(ids) {

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/company",
		data : {
			method : "passApplyCompany",
			conditions : '{"companyids":"' + ids + '", "status":"' + 0 + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);

				if (tempData.code == "1") {
					companyApplyTable.ajax.reload();
					reloadTable();
	//				alert("申请通过！");
					lwalert("tipModal", 1, "申请通过！");
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");
				}
			}
		}
	});
}


//企业不通过注册申请
var unpassAjax = function(ids) {

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/company",
		data : {
			method : "passApplyCompany",
			conditions : '{"companyids":"' + ids + '", "status":"' + 1 + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
				if (tempData.code == "1") {
					companyApplyTable.ajax.reload();
					reloadTable();
	//				alert("申请不通过！");
					lwalert("tipModal", 1, "申请不通过！");
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");
				}
			}
		}
	});
}

//查询账户类型
var queryAccountType = function() {

  var result="";

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/bankAccount",
		data : {
			method : "queryAccountType",
			conditions : "{}"
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			 result = data.accountTypeResult;
			}
		}
	});

	return result;
}

//初始化账户类型下拉框
var setAccountType = function(data,index) {
	var html = "";

	for (var i in data) {
		//拼接option
		html +="<option value="+ data[i].codenum+">"+ data[i].codevalue+"</option>";
	}

	return html;
}


var getDataTableData = function ( tableObj ) {
	var jsonData = "[";

	var dataList = tableObj.rows().data();

	if (dataList != undefined && typeof(dataList) != "undefined" && dataList.length > 0) {

		// 循环遍历Table数据
		for (var i = 0; i < dataList.length; i ++) {

			var accountData = dataList[i];
			jsonData += JSON.stringify(accountData) + ",";

		}
	}
	jsonData = jsonData.replace(reg,"");

	jsonData += "]";

	return jsonData;
}


// 保存公司信息
var saveCompany = function() {

	// 获取选择的菜单
	var level = getTreeTableActiveLevels();
	console.log(level);
	var compantPropertyVal = '0' + $('#compantPropertyId').val();
	var companyRelationVal = '0' + $('#companyRelationId').val();
	var companyTypeVal = '0' + $('#companyTypeId').val();

	var province = $('#provinceId').val();
	var city = $('#cityId').val();
	var district = $('#districtId').val();
	var addressId = $('#AddressIdVal').val();
    var code = $('#code').val();

	if (compantPropertyVal == 0 || companyRelationVal == 0
			|| companyTypeVal == 0) {
//		alert('请选择完整的类型！');
		lwalert("tipModal", 1, "请选择完整类型！");
		return false;
	}

	var type = compantPropertyVal + companyRelationVal + companyTypeVal;
	$('#type').val(type);

	//公司基本信息
	var form = $("#companyForm").serializeArray();
	var formData = formatFormJson(form);

    //银行账户信息
	var accountFormData = getDataTableData(bankAccountTable);

	$("#companyForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#companyForm').data('bootstrapValidator').isValid()) { // 返回true、false

		$.ajax({

			type : "post",
			url : "../../../"+ln_project+"/company?method=" + ope,
			data : {
				"formData" : formData,
				"accountFormData" : accountFormData,
				"level" : level,
				province : province,
				city : city,
				district : district,
				addressId : addressId,
				code : code,
			},
			dataType : "json",
			async : false,
			success : function(result) {

				var flag =  com.leanway.checkLogind(result);

				if(flag){

					if (result.status == "true") {

						//隐藏编辑框添加和删除按钮
						$("#addAccountButton").hide();
					 	$("#deleteAccountButton").hide();
					 	//重新加载银行账户信息为不可编辑
					 	htmlStatus = 1;
						bankAccountTable.ajax.url("../../../"+ln_project+"/bankAccount?method=queryBankAccount&compid=" + result.id).load();

						com.leanway.formReadOnly("companyForm");
						$("#companyForm").data('bootstrapValidator').resetForm();
						reloadTable();

					} else {
	//					alert(result.info);
						lwalert("tipModal", 1, result.info);
					}

				}

			}
		});
	}
}


// 重新初始化企业表单
var resetFrom = function() {
	$('#companyForm').each(function(index) {
		$('#companyForm')[index].reset();
	});

	$("#cityId, #districtId").empty();
	$("#companyForm").data('bootstrapValidator').resetForm();
	hide();
	$("#imageId").attr("src", "");
}

//隐藏公司上传图片删除与查看按钮
var hide = function() {

	$('#compLogoClearId').hide();
	$('#organizationCodePathClearId').hide();
	$('#taxRegistrationPathClearId').hide();
	$('#businessLicensePathClearId').hide();
	$('#compLogoShowImgId').hide();
	$('#organizationCodePathShowImgId').hide();
	$('#taxRegistrationPathShowImgId').hide();
	$('#businessLicensePathShowImgId').hide();

}

//隐藏雇员上传图片删除与查看按钮
var hideEmp  = function() {

		$('#idcardimgClearId').hide();
		$('#headimgClearId').hide();
		$('#idcardimgShowImgId').hide();
		$('#headimgShowImgId').hide();

}

// 删除上传的照片
var deleteUploadImgFunc = function(photoId,imageId) {

	lwalert("tipModal", 2, "确定要删除已上传的照片吗！",isSure(photoId,imageId));

}

function isSure(photoId,imageId){


	var photopath = $("#" + photoId).val();

		$.ajax({
			type : "post",
			url : "../../../"+ln_project+"/photo",
			data : {
				method : "deletePhoto",
				photoId : photopath
			},
			dataType : 'json',
			success : function(data) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					$("#" + photoId).val("");
					$("#" + imageId).attr("src", "");
					// check是否有图片已经上传
					checkPhoto(photoId);
	//				alert("图片删除成功！");
					lwalert("tipModal", 1, "图片删除成功");
					// 清空隐藏域

				}
			},

		});
}
// 操作方法, 新增或者修改
var ope = "add";

 

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
				url : '../../../'+ln_project+'/chinaMap',
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

// 新增公司
var addCompany = function() {

	ope = "add";
	// 清空表单
	resetFrom();

	// 默认显示上传按钮
	$("#compLogoPhotoId").show();
	$("#organizationCodePathPhotoId").show();
	$("#taxRegistrationPathPhotoId").show();
	$("#businessLicensePathPhotoId").show();

	com.leanway.removeReadOnly("companyForm");
	//法人代表不可修改
	$("#name").prop("readonly", true)

	// 初始化省
	dyscGetProvinceCityCountry("#provinceId", "province", $('#provinceId')
			.val(), $('#cityId').val());
	$("#cityId, #districtId").empty();
	bankAccountTable.ajax.url("../../../"+ln_project+"/bankAccount?method=queryBankAccount&compid=" + 0).load();
	$("#addAccountButton").show();
 	$("#deleteAccountButton").show();
}

// 修改公司
var showCompany = function() {
	var compId = getTreeTableActiveId();

	if (compId == null || $.trim(compId) == "" || compId.length == 0) {
//		alert("请选择公司进行编辑!");
		lwalert("tipModal", 1,"请选择公司进行编辑");
		return false;
	}

	com.leanway.removeReadOnly("companyForm");
	//$("#compName").prop("readonly", true);
	$("#name").prop("readonly", true);
	$("#invitecode").prop("readonly", true);
	$("#registrationcode").prop("readonly", true);
	$("#code").prop("readonly",true);
	ope = "update";

	getCompanyById(compId);
	$("#addAccountButton").show();
 	$("#deleteAccountButton").show();

 	//银行账户信息表格变为可编辑框
 	htmlStatus = 2;
	editAccountTable();
}


// 删除公司
var deleteCompany = function() {
	var str = getTreeTableSelectedLevels();

	if ($.trim(str) == "" || str.length == 0) {
//		alert("请勾选公司进行删除!");
		lwalert("tipModal", 1,"请勾选公司进行删除");
		return false;
	} else {
		var ids = str.substr(0, str.length - 1);
		lwalert("tipModal", 2,"确定要删除选中的公司吗","isSureDeleteCompany()");
//		if (confirm("确定要删除选中的公司吗?")) {
//			deleteAjax(ids);
//		}
	}
}

function isSureDeleteCompany(){
	var str = getTreeTableSelectedLevels();
	var ids = str.substr(0, str.length - 1);
	deleteAjax(ids);
}
// 根据ID查出数据
function getCompanyById(compid) {
	$.ajax({
		type : "get",
		url : "../../../"+ln_project+"/company?method=getCompanyById",
		data : {
			"compid" : compid,
			conditions : '{"compid":"' + compid + '"}'
		},
		dataType : "json",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				setFormValue(text.companyBean);
				htmlStatus = 1;
				bankAccountTable.ajax.url("../../../"+ln_project+"/bankAccount?method=queryBankAccount&compid=" + text.compid).load();
			}
		}
	});
}

// 初始化表单
function setFormValue(data) {
	resetFrom();

	$("#addAccountButton").hide();
 	$("#deleteAccountButton").hide();
	var json = eval("(" + data + ")");

	var tempType = json.type;
	if (tempType!=null&&tempType!="null"&&tempType.length == 6) {
		var compantPropertyVal = tempType.substring(0, 2);
		var companyRelationVal = tempType.substring(2, 4);
		var companyTypeVal = tempType.substring(4, 6);

		$('#compantPropertyId').val(parseInt(compantPropertyVal));
		$('#companyRelationId').val(parseInt(companyRelationVal));
		$('#companyTypeId').val(parseInt(companyTypeVal));
	}

	for ( var key in json) {
		$("#" + key).val(json[key]);
	}

	$("#AddressIdVal").val(json.registAdderss);

	// 初始化省
//	dyscGetProvinceCityCountry("#provinceId", "province", $('#provinceId')
//			.val(), $('#cityId').val());

	// 初始化地址
	var addressId = json.registAddress;
	if (addressId != '') {
		setAddress(json);
	}

	hide();
	checkPhoto('compLogo');
	checkPhoto('organizationCodePath');
	checkPhoto('taxRegistrationPath');
	checkPhoto('businessLicensePath');
}

function setAddress(data){
	$('#AddressIdVal').val(data.registAddress);
	$('#registAddress').val(data.location);

	// 初始化省、市、县
//	dyscGetProvinceCityCountry("#provinceId", "province", $(
//			'#provinceId').val(), $('#cityId').val());
//	dyscGetProvinceCityCountry("#cityId", "city",
//			data.province, 0);
//	dyscGetProvinceCityCountry("#districtId", "district",
//			data.province, data.city);
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
	$('#code').val(data.code);
}

// 根据AddressId获取地址
function getAddressById(addressId) {

        $.ajax({
				type : 'get',
				url : '../../../'+ln_project+'address',
				data : {
					method : "gain",
					addressId : addressId
				},
				dataType : 'text',
				success : function(data) {

					var flag =  com.leanway.checkLogind(data);

					if(flag){

						var tempData = $.parseJSON(data);
						$('#AddressIdVal').val(addressId);
						$('#registAddress').val(tempData.location);

						// 初始化省、市、县
//						dyscGetProvinceCityCountry("#provinceId", "province", $(
//								'#provinceId').val(), $('#cityId').val());
						dyscGetProvinceCityCountry("#cityId", "city",
								tempData.province, 0);
						dyscGetProvinceCityCountry("#districtId", "district",
								tempData.province, tempData.city);

						$('#provinceId').val(tempData.province);
						$('#cityId').val(tempData.city);
						$('#districtId').val(tempData.country);
						$('#code').val(tempData.code);
					}
				},
				error : function(data) {

				}
			});
}

// 删除选中的公司
var deleteAjax = function(levels) {
	$.ajax({
		type : "POST",
		url : "../../../"+ln_project+"/company?method=delete",
		data : {
			"levels" : levels
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
			    if (tempData.result == "1") {
					reloadTable();
				} else {

					lwalert("tipModal", 1, "操作失败");
				}
			}
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

function checkPhoto(photoid) {

	var id = $("#" + photoid).val();
	if (id == "" || id == null) {
		$("#" + photoid + "PhotoId").show();
		$("#" + photoid + "ClearId").hide();
		$("#" + photoid + "ShowImgId").hide();
	} else {
		$("#" + photoid + "PhotoId").hide();
		$("#" + photoid + "ShowImgId").show();
		$("#" + photoid + "ClearId").show();
	}
}
// 上传图片
function uploadFunc(input) {
	// 创建FormData对象
	var data = new FormData();
	// 为FormData对象添加数据
	var fileObj = document.getElementById(input).files[0];
	data.append("file", fileObj);
	if ($("#" + input).val() == "") {
//		alert("请选择图片上传");
		lwalert("tipModal", 1, "请选择图片上传");
		return;
	}
	// 发送数据
	$.ajax({
		url : "../../../"+ln_project+"/photo?method=uploadPhoto",
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
					$("#" + path).val(data.id);

					lwalert("tipModal", 1, "上传成功");
					checkPhoto(path);
					}else{

						lwalert("tipModal", 1, "请选择图片格式上传");
					}
			}
		},
		error : function() {

			lwalert("tipModal", 1,"上传出错");

		}
	});

}

// 点击显示图片
var displayPicture = function(id,imageId) {

	var photoId = $("#" + id).val();
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/photo",
		data : {
			method : "gain",
			"photoId" : photoId
		},
		dataType : "json",
		async : false,
		success : function(text) {
			var flag =  com.leanway.checkLogind(text);

			if(flag){
				
				if (text.url != null) {
					$("#"+imageId).attr("src", "../../../" + text.url);
				}else{
					$("#"+imageId).attr("src", "../../../lnfiles/upload/noimg.jpg");
				}
			    
				
			}
		}
	});
}

// 填写数据验证
function initBootstrapValidator() {

	$('#companyForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {

					compName : {
						validators : {
							notEmpty : {},
						}
					},
					registeredCapital : {
						validators : {
						 notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					salesAmount : {
						validators : {
							// notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					profit : {
						validators : {
							// notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					staffSize : {
						validators : {
							 notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.amount,
									com.leanway.reg.msg.amount)
						}
					},
					email : {
						validators : {
							// notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.email,
									com.leanway.reg.msg.email)
						}
					},
					qq : {
						validators : {
							// notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.qq,
									com.leanway.reg.msg.qq)
						}
					},
					shortName : {
						validators : {
							notEmpty : {},
						}
					},
					organizationCode : {
						validators : {
							notEmpty : {},
						}
					},
					taxRegistration : {
						validators : {
							notEmpty : {},
						}
					},
					businessLicense : {
						validators : {
							notEmpty : {},
						}
					},
					phone : {
						validators : {
							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.phone,
									com.leanway.reg.msg.phone)
						}
					},
				}
			});


	 $('#employeeForm').bootstrapValidator(
	         {
	             excluded : [ ':disabled' ],
	             fields : {
	                 name : {
	                     validators : {
	                         notEmpty : {},
	                         stringLength : {
	                             min : 2,
	                             max : 10
	                         }
	                     }
	                 },
	                 age : {
	                     validators : {
	                         notEmpty : {},
	                         regexp : com.leanway.reg.fun(com.leanway.reg.decimal.age,
	                                 com.leanway.reg.msg.age)
	                     }
	                 },
	                 post : {
	                     validators : {
	                         stringLength : {
	                             max : 50
	                         }
	                     }
	                 },
	                 moble : {
	                     validators : {
	                         notEmpty : {},
	                         regexp : com.leanway.reg.fun(com.leanway.reg.decimal.mobile,
	                                 com.leanway.reg.msg.mobile)
	                     }
	                 },
	                 phone : {
							validators : {
								notEmpty : {},
								regexp : com.leanway.reg.fun(
										com.leanway.reg.decimal.phone,
										com.leanway.reg.msg.phone)
							}
						},
	                 title : {
	                     validators : {
	                         notEmpty : {},
	                         stringLength : {
	                             max : 50
	                         }
	                     }
	                 },
	                 idcard : {
	                     validators : {
	                         notEmpty : {},
	                         regexp : com.leanway.reg.fun(com.leanway.reg.decimal.idcard,
	                                 com.leanway.reg.msg.idcard)
	                     }
	                 },
	                 email : {
	                     validators : {
	                         notEmpty : {},
	                         regexp : com.leanway.reg.fun(com.leanway.reg.decimal.email,
	                                 com.leanway.reg.msg.email)
	                     }
	                 },
	                 qq : {
	                     validators : {
	                         notEmpty : {},
	                         regexp : com.leanway.reg.fun(com.leanway.reg.decimal.qq,
	                                 com.leanway.reg.msg.qq)
	                     }
	                 },
	                 wechat : {
	                     validators : {
	                         stringLength : {
	                             max : 50
	                         }
	                     }
	                 },
	                 weibo : {
	                     validators : {
	                         stringLength : {
	                             max : 50
	                         }
	                     }
	                 },
	                 dingding : {
	                     validators : {
	                         stringLength : {
	                             max : 50
	                         }
	                     }
	                 },
	                 type : { // 待定
	                     validators : {
	                         regexp : com.leanway.reg.fun(com.leanway.reg.decimal.qq,
	                                 com.leanway.reg.msg.qq),
	                         stringLength : {
	                             max : 50
	                         }
	                     }
	                 },
	                 note : {
	                     validators : {
	                         stringLength : {
	                             max : 1000
	                         }
	                     }
	                 }
	             }
	         });

}
//触发上传
function selectFile(fileId) {
	$("#"+fileId).trigger("click");
}


var addAccount= function() {

	bankAccountTable.row.add({
		"accountid": "",
		"address" : "",
		"bankname" : "",
		"accountname" : "",
		"bankaccount" : "",
		"accounttype" : "",
	}).draw( false );


	editAccountTable();
}

/**
 * 把银行账户表格变成可编辑
 */
var editAccountTable = function (flag) {

	if (bankAccountTable.rows().data().length > 0) {

        var length = 0;

		var dataList = bankAccountTable.rows().data();

		if (dataList != undefined && typeof(dataList) != "undefined" && dataList.length > 0) {
			length = dataList.length - 1;
		}
		var data = queryAccountType();

		$("#bankAccountTable tbody tr").each(function() {

			// 获取该行的下标
			var index = bankAccountTable.row(this).index();

			var address = bankAccountTable.rows().data()[index].address;
			if (flag != undefined && typeof(flag) != "undefined" && flag) {

				if (index == length) {

					initEditBankAccouutTableData(data, index, $(this), flag);

				}

			} else {

				initEditBankAccouutTableData(data, index, $(this), flag);

			}

		});
	}
}

var initEditBankAccouutTableData = function ( data , index, obj, flag) {

	var typeSelect = setAccountType(data, index);

	obj.find("td:eq(1)").html('<input type="text" class="form-control" style="width: 80px" onblur="setDataTableValue(this, ' + index + ',\'bankAccountTable\')" name="address" id="address" value="' + bankAccountTable.rows().data()[index].address  + '">');
	// 开户行名称
	var bankname = bankAccountTable.rows().data()[index].bankname;

	if (bankname == "null" || bankname == null) {
		 bankname = "";
	}
	obj.find("td:eq(2)").html('<input type="text" class="form-control" style="width: 80px" onblur="setDataTableValue(this, ' + index + ',\'bankAccountTable\')" name="bankname" id="bankname" value="' + bankAccountTable.rows().data()[index].bankname  + '">');


	// 账户名称
	obj.find("td:eq(3)").html('<input type="text" class="form-control" style="width: 80px" onblur="setDataTableValue(this, ' + index + ',\'bankAccountTable\')" name="accountname" id="accountname" value="' + bankAccountTable.rows().data()[index].accountname + '">');

	// 公司账号
	var bankaccount = bankAccountTable.rows().data()[index].bankaccount;
	if (bankaccount == "null"  || bankaccount == null) {
		bankaccount = "";
	}
	obj.find("td:eq(4)").html('<input type="text" class="form-control" style="width: 115px" onblur="setDataTableValue(this, ' + index + ',\'bankAccountTable\')"  name="bankaccount" id="bankaccount' + index + '" value="' +bankaccount + '">');

	// 账户类型（下拉框）
	//var accounttype = '<select class="form-control"  onchange="accountTypeChange(this,' + index + ')" id="accounttype'+index+'"  name="accounttype">';
	obj.find("td:eq(5)").html('<select name="accounttype"    id="accounttype" style="width: 80px"  onchange="accountTypeChange(this,' + index + ')"  class="form-control" >' + typeSelect + '</select>');
	obj.find("td:eq(5)").find("#accounttype").val(bankAccountTable.rows().data()[index].accounttype);


}


var accountTypeChange =function (obj , index) {
	bankAccountTable.rows().data()[index].accounttype = obj.value;

}
//改变DataTable对象里的值
var setDataTableValue = function( obj, index, tableName ) {

	var tableObj =  $("#" + tableName).DataTable();

	// 获取修改的行数据
	var account =  tableObj.rows().data()[index];

	// 循环Json key,value，赋值
	 for (var item in account) {

		 // 当ID相同时，替换最新值
		 if (item == obj.name) {

			 account[item] = obj.value;

		 }

	 }

}


/**
 * 删除数据
 */
var deleteDataTableData = function () {

	var str = '';
	// 拼接选中的checkbox
	$("input[name='accountCheckList']:checked").each(function(i, o) {
		str += $(this).val();
		str += ",";
	});


	if (str.length > 0) {
		var ids = str.substr(0, str.length - 1);
		lwalert("tipModal", 2,"确定要删除选中的银行账号信息吗","isSureBankAccount()");
//		if (confirm("确定要删除选中的银行账号信息吗?")) {
//			deleteBankAccountAjax(ids);
//		}
	} else {
//		alert("至少选择一条记录操作");
		lwalert("tipModal", 1, "至少选择一条记录操作");
	}

}

function isSureBankAccount(){
	var str = '';
	// 拼接选中的checkbox
	$("input[name='accountCheckList']:checked").each(function(i, o) {
		str += $(this).val();
		str += ",";
	});


	var ids = str.substr(0, str.length - 1);
	deleteBankAccountAjax(ids);
}


//删除银行账号信息Ajax
var deleteBankAccountAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/bankAccount",
		data : {
			method : "deleteBankAccountByConditons",
			conditions : '{"accountids":"' + ids + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
				if (tempData.code == "1") {

					$("#bankAccountTable tbody tr").each(function() {

						// 获取该行的下标
						var index = bankAccountTable.row(this).index();

						if ($(this).find("td:eq(0)").find("input[name='accountCheckList']").prop("checked")  == true) {
							bankAccountTable.rows(index).remove().draw(false);
						}
					});
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败");
				}

			}
		}
	});
}

/**
 * 初始化银行账号信息表格
 */
 var initAccountTable = function (){

		var table = $('#bankAccountTable').DataTable( {
				"ajax": "../../../"+ln_project+"/bankAccount?method=queryBankAccount",
				/*"iDisplayLength" : "10",*/
		        'bPaginate': false,
		        "bRetrieve": true,
		        "bFilter":false,
		        //"scrollX": true,
		        "bSort": false,
		        "bProcessing": true,
		        "bServerSide": false,
		         "aoColumns": [
		               {
		            	   "mDataProp": "accountid",
		            	   "fnCreatedCell" : function(nTd, sData,
									oData, iRow, iCol) {
								$(nTd)
										.html(
												"<input class='regular-checkbox' type='checkbox' id='"
														+ sData
														+ "' name='accountCheckList' value='"
														+ sData
														+ "'><label for='"
														+ sData
														+ "'></label>");
							}

		               },
		               {"mDataProp": "address"},
		               {"mDataProp": "bankname"},
		               {"mDataProp": "accountname"},
		               {"mDataProp": "bankaccount"},
		               {"mDataProp": "codevalue"},
		          ],
		          "fnCreatedRow": function ( nRow, aData, iDataIndex ) {

		          },
		         "oLanguage" : {
		        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		         },
		         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		         "fnDrawCallback" : function(data) {

		        	 // 编辑情况下，把DataTable变成可编辑
		        	 if (htmlStatus == 2) {
		        		 editAccountTable();
		        	 }


		         }
		    } ).on('xhr.dt', function (e, settings, json) {
				com.leanway.checkLogind(json);
			} );

		return table;

 }
 function showEditEmployee() {

	 var chairman = $("#chairMan").val();

		ope = "update";

		// 获取数据
		getEmployeeById(chairman);
	}
 var getEmployeeById = function(employeeid) {

		$.ajax({
			type : "get",
			url : "../../../"+ln_project+"/employee",
			data : {
				method : "queryEmployeeById",
				conditions : '{"employeeid":"' + employeeid + '"}'
			},
			dataType : "text",
			success : function(data) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					var json = eval("(" + data + ")").resultObj;
					setEmpFormValue(json);

					$('#empModal').modal({
						backdrop : 'static',
						keyboard : false
					});

				}

			},
			error : function(data) {

			}
		});
	}


//自动填充表单数据（页面id须与bean保持一致）
 function setEmpFormValue(data) {
 	resetPageForm();
 	for ( var item in data) {
 		$("#employeeForm" + "  input[name=" + item + "]").val(data[item]);
 		$("#employeeForm" + "  select[name=" + item + "]").val(data[item]);
 	}

 	// 给地址赋值
 	if (data.address != null) {
 		setAddressFunction(data.address);
 	}

 	// 给select2赋初值
 	var deptId = data.deptid;
 	if (deptId != null && deptId != "" && deptId != "null") {
 		$("#deptid")
 				.append(
 						'<option value=' + deptId + '>' + data.department
 								+ '</option>');
 		// $("#deptid").select2("val", [ deptId ]);
 	}

 	// 给select2赋初值
 	var compId = data.compid;
 	if (compId != "" && compId != null && compId != "null") {
 		$("#compid").append(
 				'<option value=' + compId + '>' + data.compname + '</option>');
 		// $("#compid").select2("val", [ compId ]);
 	}
 }

 function resetPageForm() {
 	$('#employeeForm')[0].reset(); // 清空表单
 	$("#deptid, #compid").val(null).trigger("change"); // select2值给清空
 	$("#province, #city, #country").empty(); // 清空select
    $("#employeeForm").data('bootstrapValidator').resetForm();
 	$("#employeeForm input[type='hidden']").val("");
 };

 function setAddressFunction(tempData) {
 	// 初始化省、市、县
 	dyscGetProvinceCityCountry("#province", "province", $('#province').val(),
 			$('#city').val());
 	dyscGetProvinceCityCountry("#city", "city", tempData.province, 0);
 	dyscGetProvinceCityCountry("#country", "district", tempData.province,
 			tempData.city);

 	$('#province').val(tempData.province);
 	$('#city').val(tempData.city);
 	$('#country').val(tempData.country);
 	$('#location').val(tempData.location);
 }

 function saveOrUpdate() {

			var formData = $("#employeeForm").form2json();
			$("#employeeForm").data('bootstrapValidator').validate(); // 提交前先验证
			if ($('#employeeForm').data('bootstrapValidator').isValid()) { // 返回true、false

			$.ajax({
				type : "post",
				url : "../../../"+ln_project+"/employee",
				data : {
					method : "updateEmployeeByConditons",
					conditions : decodeURIComponent(formData).replace(/\+/gi, " ")
				// decodeURIComponent: 用于处理时间编码；replace(/\+/gi," ")：将所有+替换成" "
				},
				dataType : "text",
				success : function(data) {

					var flag =  com.leanway.checkLogind(data);

					if(flag){

						var tempData = $.parseJSON(data);
						if (tempData.code == "1") {
							$('#empModal').modal('hide');
						} else {
	//						alert(tempData.exception);
							lwalert("tipModal", 1, tempData.exception);
						}

					}
				},
				error : function(data) {
//					alert("保存失败！");
					lwalert("tipModal", 1,"保存失败！");
				}
			});
        }
	}


 $.fn.form2json = function() {
		var serializedParams = this.serialize();
		var obj = paramString2obj(serializedParams);
		return JSON.stringify(obj);
	}

	// 将form表单中的数据转为对象 (bean中嵌套bean)
	function paramString2obj(serializedParams) {
		var obj = {};
		function evalThem(str) {
			var attributeName = str.split("=")[0];
			var attributeValue = str.split("=")[1];
			if (!attributeValue) {
				return;
			}
			var array = attributeName.split(".");
			for (var i = 1; i < array.length; i++) {
				var tmpArray = Array();
				tmpArray.push("obj");
				for (var j = 0; j < i; j++) {
					tmpArray.push(array[j]);
				}
				;
				var evalString = tmpArray.join(".");
				if (!eval(evalString)) {
					eval(evalString + "={};");
				}
			}
			eval("obj." + attributeName + "='" + attributeValue + "';");
		}
		var properties = serializedParams.split("&");
		for (var i = 0; i < properties.length; i++) {
			evalThem(properties[i]);
		}
		return obj;
	}

	/**
	 * 生产基础数据
	 */
	var createBaseData = function ( ) {
		// 获取选中的公司
		var node = $("#companyTreeTable").fancytree("getActiveNode");

		var companyId = "";

		// 获取选中的用户标识
		if (node != null && node != "undefined" && typeof (node) != "undefined") {
			companyId = node.data.compid;
		}

		$.ajax ( {
			type : "post",
			url : "../../../"+ln_project+"/company",
			data : {
				"method" : "createBaseData",
				"companyId" : companyId
			},
			dataType : "json",
			async : false,
			success : function ( text ) {
//				alert(text.info);
				var flag =  com.leanway.checkLogind(text);

				if(flag){

				   lwalert("tipModal", 1,text.info);

				}
			}
		});

	}


	/**
	 * 生产基础数据
	 */
	var sendEmail = function ( ) {
		// 获取选中的公司
		var node = $("#companyTreeTable").fancytree("getActiveNode");

		var companyId = "";

		// 获取选中的用户标识
		if (node != null && node != "undefined" && typeof (node) != "undefined") {
			companyId = node.data.compid;
		}

		$.ajax ( {
			type : "post",
			url : "../../../"+ln_project+"/company",
			data : {
				"method" : "sendEmail",
				"companyId" : companyId
			},
			dataType : "json",
			async : false,
			success : function ( text ) {
//				alert(text.info);
				var flag =  com.leanway.checkLogind(text);

				if(flag){

				   lwalert("tipModal", 1,text.info);

				}
			}
		});

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
		$('#mapFrame').attr('src', '../workCenter/map.html');

	}

	 //数据table
	 var companyTable;
	 var companyApplyTable;
	 var bankAccountTable;
	 var htmlStatus = 1;
	 var reg=/,$/gi;
	 var clicktime = new Date();

	 jQuery(document).ready(function() {

	 	initBootstrapValidator();
	 	$("body").on("click", "#easyPage ul li a", function() {
//	 		alert("body on click");
	 		lwalert("tipModal", 1,"body on click");
	 	});

	 	// 加载datagrid
	 	companyTable = initCompanyTreeTable();

	    companyApplyTable = initCompanyApplyTable();
	 	bankAccountTable = initAccountTable();
	 	// 绑定事件
	 	$("#saveCompany").click(saveCompany);

	 	// 电话特殊格式
	 	$("[data-mask]").inputmask();

	 	$("[data-ma]").inputmask();

	 	// 初始化表格只读
	 	com.leanway.formReadOnly("companyForm");
	 	//com.leanway.dataTableCheckAll("companyApplyDataTable", "checkAll", "checkList");
	 	// 点击dataTable触发事件
	    com.leanway.dataTableClick("bankAccountTable", "accountCheckList", true,
	   		 bankAccountTable);

	 	hide();
	 	hideEmp();
	 	$("#addAccountButton").hide();
	 	$("#deleteAccountButton").hide();

	 	com.leanway.loadTags();

	 	com.leanway.getCodeMap("company", "type","1","#compantPropertyId", "-----所有制性质-----");
	 	com.leanway.getCodeMap("company", "type","2","#companyTypeId", "-----所有制性质-----");
	 	com.leanway.getCodeMap("company", "type","3","#companyRelationId", "-----所有制性质-----");
	 	
	 	dyscGetProvinceCityCountry("#provinceId", "province", $(
				'#provinceId').val(), $('#cityId').val());
	 });

