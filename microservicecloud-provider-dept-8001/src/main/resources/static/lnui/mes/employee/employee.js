var clicktime = new Date();
// 重置表单数据
function resetPageForm() {
	$('#employeeForm')[0].reset(); // 清空表单
	$("#deptid, #compid").val(null).trigger("change"); // select2值给清空
	$("#city, #country").empty(); // 清空select
	$("#employeeForm").data('bootstrapValidator').resetForm();
	$("#employeeForm input[type='hidden']").val("");
	hideEmp();
	$("#empImageId").attr("src", "");
};

// 初始化验证input
function initBootstrapValidator() {
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
//							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.age,
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
//							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.mobile,
									com.leanway.reg.msg.mobile)
						}
					},
					phone : {
						validators : {
//							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.phone,
									com.leanway.reg.msg.phone)
						}
					},
					title : {
						validators : {
//							notEmpty : {},
							stringLength : {
								max : 50
							}
						}
					},
					idcard : {
						validators : {
//							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.idcard,
									com.leanway.reg.msg.idcard)
						}
					},
					email : {
						validators : {
//							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.email,
									com.leanway.reg.msg.email)
						}
					},
					qq : {
						validators : {
//							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.qq,
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
//					type : { // 待定
//						validators : {
//							regexp : com.leanway.reg.fun(
//									com.leanway.reg.decimal.qq,
//									com.leanway.reg.msg.qq),
//							stringLength : {
//								max : 50
//							}
//						}
//					},
					note : {
						validators : {
							stringLength : {
								max : 1000
							}
						}
					},
					barcode : {
						validators : {
//							notEmpty : {},

						}
					}

				}
			});
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

// 调用方法：form2json ，序列号对象，并转为json字符串 (bean中嵌套bean)
$.fn.form2json = function() {
	var serializedParams = this.serialize();
	var obj = paramString2obj(serializedParams);
	return JSON.stringify(obj);
}

// 删除雇员信息（将status变为1， 默认为0）
function deleteEmployee(type) {

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "employeeDataTable", "checkList");

	if (ids.length>0) {

        var msg = "确定删除选中的" + ids.split(",").length + "个雇员?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	} else {
//		alert("至少选择一条记录操作");
		lwalert("tipModal", 1, "至少选择一条记录操作！");
	}
}

function isSureDelete(type){

	var ids = com.leanway.getCheckBoxData(type, "employeeDataTable", "checkList");

	deleteAjax(ids);
}
// 删除Ajax
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/employee",
		data : {
			method : "updateEmployeeStatusByConditons",
			conditions : '{"employeeids":"' + ids + '", "status":"' + 1 + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

			var tempData = $.parseJSON(text);
				if (tempData.code == "1") {

					com.leanway.clearTableMapData( "employeeDataTable" );
					oTable.ajax.reload(null,false); // 刷新dataTable
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");
				}

			}
		}
	});
}

// 显示编辑数据
function showEditEmployee() {
	var employeeid = $("#employeeid").val();

	if (employeeid == "" || employeeid == null || employeeid == "null") {

//		alert("请选择雇员！");
		lwalert("tipModal", 1, "请选择雇员！");

	} else {

		com.leanway.removeReadOnly("employeeForm");
		buttonEnabled("#saveOrUpdateAId");
		opeMethod = "updateEmployeeByConditons";
//		dyscGetProvinceCityCountry("#province", "province", $('#province')
//				.val(), $('#city').val());
//		$("#barcode").prop("readonly",true);
	}
}

// 根据ID查出雇员
var getEmployeeById = function(employeeid) {
	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/employee",
		data : {
			method : "queryEmployeeById",
			conditions : '{"employeeid":"' + employeeid + '"}'
		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var json = eval("(" + data + ")").resultObj;
				buttonDisabled("#saveOrUpdateAId");
				com.leanway.formReadOnly("employeeForm");
				setFormValue(json);
			}
		},
		error : function(data) {

		}
	});
}

// 自动填充表单数据（页面id须与bean保持一致）
function setFormValue(data) {
	resetPageForm();
	for ( var item in data) {
		if (item != "searchValue") {
			$("#" + item).val(data[item]);
		}

	}

	// 给地址赋值
	if (data.address != null) {
		setAddressFunction(data);
	}

	// 给select2赋初值
	var deptId = data.deptid;
	if (deptId != null && deptId != "" && deptId != "null") {
		$("#deptid")
				.append(
						'<option value=' + deptId + '>' + data.department
								+ '</option>');
		$("#deptid").select2("val", [ deptId ]);
	}

	// 给select2赋初值
	var compId = data.compid;
	if (compId != "" && compId != null && compId != "null") {
		$("#compid").append(
				'<option value=' + compId + '>' + data.compname + '</option>');
		$("#compid").select2("val", [ compId ]);
	}

	hideEmp();
	checkPhoto('idcardimg');
	checkPhoto('headimg');
}

function setAddressFunction(tempData) {
//	// 初始化省、市、县
//	dyscGetProvinceCityCountry("#province", "province", $('#province').val(),
//			$('#city').val());
//	dyscGetProvinceCityCountry("#city", "city", tempData.province, 0);
//	dyscGetProvinceCityCountry("#country", "district", tempData.province,
//			tempData.city);

	var outPut = [];
	outPut
	.push("<option value='0' selected='selected'>=请选择=</option>");
	for ( var key in tempData.cityList) {
		var tempOption;

			tempOption = "<option value='" + tempData.cityList[key].city
					+ "'>" + tempData.cityList[key].name + "</option>"

		outPut.push(tempOption);
	}
	$("#city").html(outPut.join(''));

	//district下拉框赋值
	var outPut2 = [];
	outPut2
	.push("<option value='0' selected='selected'>=请选择=</option>");
	for ( var key in tempData.countryList) {
		var tempOption2;

			tempOption2 = "<option value='" + tempData.countryList[key].district
					+ "'>" + tempData.countryList[key].name + "</option>"

		outPut2.push(tempOption2);
	}
	$("#country").html(outPut2.join(''));

	$('#province').val(tempData.address.province);
	$('#city').val(tempData.address.city);
	$('#country').val(tempData.address.country);
	$('#location').val(tempData.address.location);
}

function saveOrUpdate() {

	$("#employeeForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#employeeForm').data('bootstrapValidator').isValid()) { // 返回true、false

		var formData = $("#employeeForm").form2json();
		$.ajax({
			type : "post",
			url : "../../../../"+ln_project+"/employee",
			data : {
				method : opeMethod,
				conditions : decodeURIComponent(formData).replace(/\+/gi, " ")
			// decodeURIComponent: 用于处理时间编码；replace(/\+/gi," ")：将所有+替换成" "
			},
			dataType : "text",
			success : function(data) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					var tempData = $.parseJSON(data);
					if (tempData.code == "1") {

						com.leanway.clearTableMapData( "employeeDataTable" );

						buttonDisabled("#saveOrUpdateAId");
						com.leanway.formReadOnly("employeeForm");

						if(opeMethod=="addEmployee"){
						    oTable.ajax.reload();
						}else{
						    oTable.ajax.reload(null,false);
						}
					} else {
	//					alert(tempData.exception);
						lwalert("tipModal", 1, tempData.exception);
					}

				}
			},
			error : function(data) {
//				alert("保存失败！");
				lwalert("tipModal", 1, "保存失败！");
			}
		});
	}
}

// 操作方法，新增或修改
var opeMethod = "addEmployee";

// 点击新增
function addEmployee() {
	opeMethod = "addEmployee";

	// 清空表单
	resetPageForm();
	com.leanway.removeReadOnly("employeeForm");

	// 初始化省
//	dyscGetProvinceCityCountry("#province", "province", $('#province').val(),
//			$('#city').val());
	buttonEnabled("#saveOrUpdateAId");
	$("#idcardimgPhotoId").show();
	$("#headimgPhotoId").show();
	com.leanway.dataTableUnselectAll("employeeDataTable","checkList");
	com.leanway.clearTableMapData( "employeeDataTable" );
}

// 选择省份触发
$('#province').change(function() {
	var provinceVal = $('#province').val();
	$('#city, #country').empty();
	dyscGetProvinceCityCountry("#city", "city", provinceVal, $('#city').val());
});

// 选择城市触发
$('#city').change(
		function() {
			var cityVal = $('#city').val();
			dyscGetProvinceCityCountry("#country", "district", $('#province')
					.val(), cityVal);
		});

// 动态得到省市县
/**
 * id：需要操作的对象 pcd：表示类型{province，city，district} provinceVal：省份的值 cityVal：城市的值
 */
function dyscGetProvinceCityCountry(id, pcd, provinceVal, cityVal) {

	$.ajax({
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

				// 加载省市县
				initProvinceCityCountry(id, data, pcd);

			}
		},
		error : function(data) {

		}
	});
}

function initProvinceCityCountry(id, data, pcd) {
	var tempData = $.parseJSON(data);
	var outPut = [];
	outPut.push("<option value='0' selected='selected'>=请选择=</option>");
	for ( var key in tempData) {
		var tempOption;
		if (pcd == "province")
			tempOption = "<option value='" + tempData[key].province + "'>"
					+ tempData[key].name + "</option>"
		else if (pcd == "city")
			tempOption = "<option value='" + tempData[key].city + "'>"
					+ tempData[key].name + "</option>"
		else if (pcd == "district")
			tempOption = "<option value='" + tempData[key].district + "'>"
					+ tempData[key].name + "</option>"

		outPut.push(tempOption);
	}
	$(id).html(outPut.join(''));
}

// 初始化数据表格


var initTable = function() {
	var table = $('#employeeDataTable')
	.DataTable(
			{
				"ajax" : "../../../../"+ln_project+"/employee?method=queryEmployeesByConditons",
				"iDisplayLength" : 10,//分页显示的行数
				//"iTotalRecords":"5",
				'bPaginate' : true,
				"bDestory" : true,
				"bRetrieve" : true,
				"bFilter" : false,
				"bSort" : false,
				//"scrollY":"250px",
				"bProcessing" : true,
				"bServerSide" : true,
				'searchDelay' : "5000",
				"columns" : [ {
					"data" : "employeeid"
				}, {
					"data" : "name"
				}, {
					"data" : "compname"
				} ],
				"aoColumns" : [
								{
									"mDataProp" : "employeeid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										  $(nTd).html("<div id='stopPropagation" + iRow +"'>"
					            				   +"<input class='regular-checkbox' type='checkbox' id='" + sData
					            				   + "' name='checkList' value='" + sData
					            				   + "'><label for='" + sData
					            				   + "'></label>");
					            		   com.leanway.columnTdBindSelectNew(nTd,"employeeDataTable","checkList");
									}
								}, {
									"mDataProp" : "name"
								}, {
									"mDataProp" : "compname"
								} ],
				               "oLanguage" : {
				            	   "sUrl" : "../../../jslib/datatables/zh-CN.txt"
				               },
				               "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
				               "fnDrawCallback" : function(data) {
				            		com.leanway.getDataTableFirstRowId(
											"employeeDataTable", getEmployeeById,"more","checkList");
									 com.leanway.dataTableClickMoreSelect("employeeDataTable",
					            			   "checkList", false, oTable,getEmployeeById,undefined,undefined,"checkAll");

									 com.leanway.dataTableCheckAllCheck('employeeDataTable', 'checkAll', 'checkList');
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
					pageSize : 10
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
$("#deptid").on("select2:select", function(e) {
	$("#department").val($(this).find("option:selected").text());
});

$("#compid").on("select2:select", function(e) {
	$("#compname").val($(this).find("option:selected").text());
});

// 初始化时间
function initDate(id) {
	$(id).datetimepicker({
	   	language:  'zh-CN',
	    weekStart: 7,
	    todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0,
		format: 'yyyy-mm-dd'
	});
}

// 禁用button
function buttonDisabled(id) {
	$(id).attr({
		"disabled" : "disabled"
	});
}

// 启用button
function buttonEnabled(id) {
	$(id).removeAttr("disabled");
}
var hideEmp = function() {

	$('#idcardimgClearId').hide();
	$('#headimgClearId').hide();
	$('#fileInputDivId').hide();
	$('#idcardimgShowImgId').hide();
	$('#headimgShowImgId').hide();

}

// 触发上传
function selectFile(fileId) {
	$("#" + fileId).trigger("click");
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
		lwalert("tipModal", 1, "请选择图片上传！");
		return;
	}
	// 发送数据
	$.ajax({
		url : "../../../../"+ln_project+"/photo?method=uploadPhoto",
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
	//				alert("上传成功");
					lwalert("tipModal", 1, "上传成功！");
					checkPhoto(path);
				} else {
	//				alert('请选择图片格式上传');
					lwalert("tipModal", 1, "请选择图片格式上传！");
				}

			}
		},
		error : function() {
//			alert('上传出错');
			lwalert("tipModal", 1, "上传出错！");

		}
	});

}

// 点击显示图片
var displayPicture = function(id, imageId) {

	var photoId = $("#" + id).val();
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/photo",
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

// 删除上传的照片
var deleteUploadImgFunc = function(photoId, imageId) {

	lwalert("tipModal", 2, "确定要删除已上传的照片吗！",isSure(photoId,imageId));

}

function isSure(photoId,imageId){
	var photopath = $("#" + photoId).val();


	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/photo",
		data : {
			method : "deletePhoto",
			photoId : photopath
		},
		dataType : 'json',
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				lwalert("tipModal", 1, "图片删除成功！");
				// 清空隐藏域
				$("#" + photoId).val("");
				$("#" + imageId).attr("src", "");

				// check是否有图片已经上传
				checkPhoto(photoId);

			}
		},

	});
}

function compareTime(){
	var starttime = $("#employdate").val();
	var endtime = $("#enddate").val();
	if(starttime>endtime){
		lwalert("tipModal", 1, "雇佣时间不能晚于合同截止时间！");
		}
}


var searchEmployee = function () {

	var searchVal = $("#searchValue").val();

	oTable.ajax.url("../../../../"+ln_project+"/employee?method=queryEmployeesByConditons&searchValue=" + searchVal).load();
}
// 数据table
var oTable;

// 需要初始化数据
$(function() {
	initBootstrapValidator();

	com.leanway.loadTags();

	// 隐藏保存、重置按钮
	buttonDisabled("#saveOrUpdateAId");

	oTable = initTable();

	initDate("#employdate, #enddate");

	initSelect2("#deptid", "../../../../"+ln_project+"/dept?method=queryDeptBySearch", "搜索部门");
	initSelect2("#compid", "../../../../"+ln_project+"/company?method=queryCompanyBySearch", "搜索公司");
	// 初始化表格只读
	com.leanway.formReadOnly("employeeForm");
	hideEmp();
	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchEmployee);

	// 初始化省、市、县
	dyscGetProvinceCityCountry("#province", "province", $('#province').val(),
			$('#city').val());
//	if (window.screen.availHeight <= 768) {
//
//		 $("#enddatelabel").html('<span title="合同截止日期">合同截止期</span>');
//	 }

});

