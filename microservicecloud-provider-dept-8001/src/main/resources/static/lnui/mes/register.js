

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

// 保存公司
var saveCompany = function() {
    var mobilephone = $("#moblephone").val();
    var code = $("#validatecode").val();
    if(code!=validatecode){
        lwalert("tipModal", 1, "验证码错误,请重新填写！");
        return ;
    }
    if(code==''){
        lwalert("tipModal", 1, "请填写验证码！");
        return ;
    }
	var compantPropertyVal = '0' + $('#compantPropertyId').val();
	var companyRelationVal = '0' + $('#companyRelationId').val();
	var companyTypeVal = '0' + $('#companyTypeId').val();

	var province = $('#provinceId').val();
	var city = $('#cityId').val();
	var district = $('#districtId').val();
	var addressId = $('#AddressIdVal').val();

	if (compantPropertyVal == 0 || companyRelationVal == 0
			|| companyTypeVal == 0) {
//		alert('请选择完整的类型！');
		lwalert("tipModal", 1, "请选择完整类型！");
		return false;
	}

	var type = compantPropertyVal + companyRelationVal + companyTypeVal;
	$('#type').val(type);

	var form = $("#companyForm").serializeArray();
	var formData = formatFormJson(form);
    var employeeForm = $("#employeeForm").serializeArray();
    var employeeFormData = formatFormJson(employeeForm);
    var accountFormData = getDataTableData(bankAccountTable);
    var email = $("#compemail").val();

    var email = $("#compemail").val();
    var invitecode = $("#invitecode").val();

    if(invitecode!=null&&invitecode!=""){

    	var flag = inviteIsExisted();
    	if(flag==false)
    		return;
    }



    $("#companyForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#companyForm').data('bootstrapValidator').isValid()) { // 返回true、false
		$("#employeeForm").data('bootstrapValidator').validate(); // 提交前先验证
		if ($("#employeeForm").data('bootstrapValidator').isValid()) { // 返回true、false
		$.ajax({
			type : "post",
			url : "../../"+ln_project+"/company?method=" + ope,
			data : {
				"formData" : formData,
				"employeeFormData" : employeeFormData,
				"accountFormData" : accountFormData,
				province : province,
				city : city,
				district : district,
				addressId : addressId,
				email : email,
				validatephone:mobilephone

			},
			dataType : "json",
			//async : false,
			success : function(result) {
				if (result.status == "true") {
					lwalert("tipModal", 3,"申请注册信息提交成功!","isSureHref()");
//					if(confirm("申请注册信息提交成功！")){
//
//						window.location.href = "../user?method=returnBack";
//
//					}
				} else {
//					alert(result.info);
					lwalert("tipModal", 1, result.info);
				}

			}
		});
	}
	}
}

var saveNotOfficialCompany = function() {
    var mobilephone = $("#moblephone").val();
    var form = $("#notofficialcompanyForm").serializeArray();
    var formData = formatFormJson(form);
    var employeeForm = $("#notofficialemployeeForm").serializeArray();
    var employeeFormData = formatFormJson(employeeForm);

    var email = $("#compemail").val();
    var invitecode = $("#invitecode").val();
    var code = $("#validatecode").val();

    if(invitecode!=null&&invitecode!=""){
        var flag = inviteIsExisted();
        if(flag==false)
            return;
    }
    if(code!=validatecode){
        lwalert("tipModal", 1, "验证码错误,请重新填写！");
        return ;
    }
    if(code==''){
        lwalert("tipModal", 1, "请填写验证码！");
        return ;
    }
    $("#notofficialcompanyForm").data('bootstrapValidator').validate(); // 提交前先验证
    if ($('#notofficialcompanyForm').data('bootstrapValidator').isValid()) { // 返回true、false
        $("#notofficialemployeeForm").data('bootstrapValidator').validate(); // 提交前先验证
        if ($("#notofficialemployeeForm").data('bootstrapValidator').isValid()) { // 返回true、false
        $.ajax({
            type : "post",
            url : "../../"+ln_project+"/company?method=addNotOfficialCompanyWsInterface",
            data : {
                "formData" : formData,
                "employeeFormData" : employeeFormData,
                 email : email,
                 validatephone:mobilephone

            },
            dataType : "json",
            //async : false,
            success : function(result) {
                if (result.status == "true") {
                    lwalert("tipModal", 3,"申请注册信息提交成功!","isSureHref()");
//                  if(confirm("申请注册信息提交成功！")){
//
//                      window.location.href = "../user?method=returnBack";
//
//                  }
                } else {
//                  alert(result.info);
                    lwalert("tipModal", 1, result.info);
                }

            }
        });
    }
    }
}
function isSureHref(){
	window.location.href = "../../"+ln_project+"/user?method=returnBack";
}
// 重新初始化企业表单
var resetFrom = function() {
	$('#companyForm').each(function(index) {
		$('#companyForm')[index].reset();
	});

	$("#provinceId, #cityId, #districtId").empty();
	$("#companyForm").data('bootstrapValidator').resetForm();
	hide();
	$("#imageId").attr("src", "");
}

//隐藏按钮
var hide = function() {

	$('#compLogoClearId').hide();
	$('#organizationCodePathClearId').hide();
	$('#taxRegistrationPathClearId').hide();
	$('#businessLicensePathClearId').hide();
	$('#idcardimgClearId').hide();
	$('#headimgClearId').hide();
	$('#fileInputDivId').hide();
	$('#compLogoShowImgId').hide();
	$('#organizationCodePathShowImgId').hide();
	$('#taxRegistrationPathShowImgId').hide();
	$('#businessLicensePathShowImgId').hide();
	$('#idcardimgShowImgId').hide();
	$('#headimgShowImgId').hide();

}


// 删除上传的照片
var deleteUploadImgFunc = function(photoId,imageId) {
	//alert(photoId);
	//alert(imageId);
	lwalert("tipModal", 2,"确定要删除已上传的照片吗?",isSureUpload(photoId,imageId));
//	var photopath = $("#" + photoId).val();
//
//	if (confirm("确定要删除已上传的照片吗?")) {
//
//		$.ajax({
//			type : "post",
//			url : "../photo",
//			data : {
//				method : "delete",
//				photoId : photopath
//			},
//			dataType : 'json',
//			success : function(data) {
//
////				alert("图片删除成功！");
//				lwalert("tipModal", 1, "图片删除成功！");
//
//				// 清空隐藏域
//				$("#" + photoId).val("");
//				$("#" + imageId).attr("src", "");
//
//				// check是否有图片已经上传
//				checkPhoto(photoId);
//			},
//		});
//	}
}

function isSureUpload(photoId,imageId){
	var photopath = $("#" + photoId).val();
	$.ajax({
		type : "post",
		url : "../../"+ln_project+"/photo",
		data : {
			method : "deletePhoto",
			photoId : photopath
		},
		dataType : 'json',
		success : function(data) {

//			alert("图片删除成功！");
			lwalert("tipModal", 1, "图片删除成功！");

			// 清空隐藏域
			$("#" + photoId).val("");
			$("#" + imageId).attr("src", "");

			// check是否有图片已经上传
			checkPhoto(photoId);
		},
	});
}
// 操作方法, 新增或者修改
var ope = "addCompany";


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
				type : 'post',
				url : '../../'+ln_project+'/chinaMap',
				async : false,
				data : {
					method : "gain",
					province : provinceVal,
					city : cityVal
				},
				dataType : 'text',
				success : function(data) {
					var tempData = $.parseJSON(data);
					//console.info(tempData);
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
				},
				error : function(data) {

				}
			});
}



// 根据AddressId获取地址
function getAddressById(addressId) {

	$.ajax({
				type : 'get',
				url : '../../'+ln_project+'/address',
				data : {
					method : "gain",
					addressId : addressId
				},
				dataType : 'text',
				success : function(data) {
					var tempData = $.parseJSON(data);
					$('#AddressIdVal').val(addressId);
					$('#registAddress').val(tempData.location);

					// 初始化省、市、县
					dyscGetProvinceCityCountry("#provinceId", "province", $(
							'#provinceId').val(), $('#cityId').val());
					dyscGetProvinceCityCountry("#cityId", "city",
							tempData.province, 0);
					dyscGetProvinceCityCountry("#districtId", "district",
							tempData.province, tempData.city);

					$('#provinceId').val(tempData.province);
					$('#cityId').val(tempData.city);
					$('#districtId').val(tempData.country);
				},
				error : function(data) {

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

//查看是否已经上传了照片
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
		url : "../../"+ln_project+"/photo?method=uploadPhoto",
		type : 'POST',
		data : data,
		dataType : 'json',
		cache : false,
		contentType : false,
		processData : false,
		success : function(data) {

			if (data.status == 'true') {
			var path = input.substr(0, input.length - 2);
			// 给隐藏域赋id
			$("#" + path).val(data.id);
//			alert("上传成功");
			lwalert("tipModal", 1, "上传成功！");
			checkPhoto(path);
			}else{
//				alert('请选择图片格式上传');
				lwalert("tipModal", 1, "请选择图片格式上传！");
			}
		},
		error : function() {
//			alert('上传出错');
			lwalert("tipModal", 1, "上传出错！");

		}
	});

}

// 点击显示图片
var displayPicture = function(id,imageId) {

	var photoId = $("#" + id).val();

	$.ajax({
		type : "post",
		url : "../../"+ln_project+"/photo",
		data : {

			method : "gain",
			"photoId" : photoId
		},
		dataType : "json",
		async : false,
		success : function(text) {

			$("#"+imageId).attr("src", ".." + text.url);
		}
	});
}


// 填写数据验证
function initNotOfficialBootstrapValidator() {

	$('#notofficialcompanyForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {

					compName : {
						validators : {
							notEmpty : {},
						}
					},
	                 compemail : {
	                     validators : {
	                         notEmpty : {},
	                         regexp : com.leanway.reg.fun(com.leanway.reg.decimal.email,
	                                 com.leanway.reg.msg.email)
	                     }
	                 },

					shortName : {
						validators : {
							notEmpty : {},
						}
					},

				}
			});



	 $('#notofficialemployeeForm').bootstrapValidator(
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


	                 moble : {
	                     validators : {
	                         notEmpty : {},
	                         regexp : com.leanway.reg.fun(com.leanway.reg.decimal.mobile,
	                                 com.leanway.reg.msg.mobile)
	                     }
	                 },


	                 idcard : {
	                     validators : {
	                         notEmpty : {},
	                         regexp : com.leanway.reg.fun(com.leanway.reg.decimal.idcard,
	                                 com.leanway.reg.msg.idcard)
	                     }
	                 },

	             }
	         });

}


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
                            // notEmpty : {},
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
                             notEmpty : {},
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
                     compemail : {
                         validators : {
                             notEmpty : {},
                             regexp : com.leanway.reg.fun(com.leanway.reg.decimal.email,
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
                             regexp : com.leanway.reg.fun(com.leanway.reg.decimal.phone,
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

//重置雇员表单数据
function resetPageForm() {
 $('#employeeForm')[0].reset(); // 清空表单
 $("#deptid, #compid").val(null).trigger("change"); // select2值给清空
 $("#province, #city, #country").empty(); // 清空select
 $("#employeeForm").data('bootstrapValidator').resetForm();
 $("#employeeForm input[type='hidden']").val("");
};


//将form表单中的数据转为对象 (bean中嵌套bean)
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

//调用方法：form2json ，序列号对象，并转为json字符串 (bean中嵌套bean)
$.fn.form2json = function() {
 var serializedParams = this.serialize();
 var obj = paramString2obj(serializedParams);
 return JSON.stringify(obj);
}

//初始化select2,
/**
* id: 为要操作的对象 url: url text: 要在select中显示的文本
*/
function initSelect2(id, url, text) {
 $(id).select2({
     placeholder : text,
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
             params.page = params.page || 1;
             return {
                 results : data.items,
                 pagination : {
                     more : (params.page * 30) < data.total_count
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


var initAccountTable = function (){

	var table = $('#bankAccountTable').DataTable({
			"ajax": "../../"+ln_project+"/bankAccount?method=queryBankAccount",
			/*"iDisplayLength" : "10",*/
	        'bPaginate': false,
	        "bRetrieve": true,
	        "bFilter":false,
	       // "scrollX": true,
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
	               {"mDataProp": "accounttype"},
	          ],
	          "fnCreatedRow": function ( nRow, aData, iDataIndex ) {

	          },
	         "oLanguage" : {
	        	 "sUrl" : "plugins/datatables/zh-CN.txt"
	         },
	         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	         "fnDrawCallback" : function(data) {

	        	 // 编辑情况下，把DataTable变成可编辑
	        	 if (htmlStatus == 2) {
	        		 editAccountTable();
	        	 }

	         }
	    } );

	return table;

}


var addAccount= function ( ) {

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
		lwalert("tipModal", 2,"确定要删除选中的银行账号信息吗？","isSureDeleteBank()");
//		var ids = str.substr(0, str.length - 1);
//		if (confirm("确定要删除选中的银行账号信息吗?")) {
//			deleteBankAccountAjax(ids);
//		}
	} else {
//		alert("至少选择一条记录操作");
		lwalert("tipModal", 1, "至少选择一条记录操作！");
	}

}

function isSureDeleteBank(){
	var str = '';
	// 拼接选中的checkbox
	$("input[name='accountCheckList']:checked").each(function(i, o) {
		str += $(this).val();
		str += ",";
	});
	var ids = str.substr(0, str.length - 1);
	deleteBankAccountAjax(ids);

}


//删除银行账户信息Ajax
var deleteBankAccountAjax = function(ids) {
//	$.ajax({
//		type : "post",
//		url : "../bankAccount",
//		data : {
//			method : "deleteBankAccountByConditons",
//			conditions : '{"accountids":"' + ids + '"}'
//		},
//		dataType : "text",
//		async : false,
//		success : function(text) {
//			var tempData = $.parseJSON(text);
//			if (tempData.code == "1") {

				$("#bankAccountTable tbody tr").each(function() {

					// 获取该行的下标
					var index = bankAccountTable.row(this).index();

					if ($(this).find("td:eq(0)").find("input[name='accountCheckList']").prop("checked")  == true) {
						bankAccountTable.rows(index).remove().draw(false);
					}
				});
//			} else {
////				alert("操作失败");
//				lwalert("tipModal", 1, "操作失败！");
//			}
//		}
//	});
}

//查找银行账户类型
var queryAccountType = function() {

    var result="";

	$.ajax({
		type : "post",
		url : "../../"+ln_project+"/bankAccount",
		data : {
			method : "queryAccountType",
			conditions : "{}"
		},
		dataType : "json",
		async : false,
		success : function(data) {

			result = data.accountTypeResult;
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

function emailIsExisted(){
	var email = $("#compemail").val();

	$.ajax({
		type : "post",
		url : "../../"+ln_project+"/company",
		data : {
			method : "emailIsExisted",
			email : email
		},
		dataType : 'json',
		success : function(data) {

			console.info(data);
         if(data.code=="1"){
        	 lwalert("tipModal", 1,"该邮箱已被注册，请重新填写！");
         }
		},
	});
}



 function inviteIsExisted(){

	var flag = true;
	var invitecode = $("#invitecode").val();

	 if(invitecode==null||invitecode==""){

	    	return;
	    }

	$.ajax({
		type : "post",
		url : "../../"+ln_project+"/company",
		data : {
			method : "inviteIsExisted",
			invitecode : invitecode
		},
		dataType : 'json',
		success : function(data) {
         if(data.code=="0"){
        	 lwalert("tipModal", 1,"邀请码"+invitecode+"不存在！");
        	 $("#invitecode").val("");
        	 flag = false;
         }else{
        	 flag = true
         }
		},
	});
	return flag;
}

 var validatecode='';
 function sendMessage(){
     var moblephone = $("#moblephone").val();
     if(moblephone==''){

         lwalert("tipModal", 1,"请填写手机号！");
     }else{
         $.ajax({
             type : "post",
             url : "../../"+ln_project+"/company",
             data : {
                 method : "sendMessageWsInterface",
                 "moblephone" : moblephone,
                 "signName":"注册验证",
                 "templateCode":"SMS_13256753",
                 "product":"连恩智能科技"
             },
             dataType : 'json',
             success : function(data) {
                 if(data.info=="isv.BUSINESS_LIMIT_CONTROL"){
                     lwalert("tipModal", 1,"您操作过于频繁，请一小时后再进行操作");
                 }else if(data.info=="isv.MOBILE_NUMBER_ILLEGAL"){
                	 lwalert("tipModal", 1,"请填写正确的号码！");
                 }else{
                     validatecode=data.code;
                     settime();
                 }

             },
         });
     }

 }

 var countdown=60;
 function settime() {
     if (countdown == 0) {
         $("#sendcode").prop("disabled",false);
         $("#sendcode").html("免费获取验证码");
         countdown = 60;
         return;
     } else {
         $("#sendcode").prop("disabled", true);
         $("#sendcode").html("重新发送(" + countdown + ")");
         countdown--;
     }
 setTimeout(function() {
     settime() }
     ,1000)
 }

var clicktime = new Date();
//数据table
var companyTable;
var bankAccountTable;
var htmlStatus = 1;
var reg=/,$/gi;
var clicktime = new Date();

//需要初始化数据
$(function() {

	initBootstrapValidator();
	initNotOfficialBootstrapValidator();
	$("body").on("click", "#easyPage ul li a", function() {
//		alert("body on click");
		lwalert("tipModal", 1,"body on click");
	});

	// 绑定事件
	$("#saveCompany").click(saveCompany);
	$("#saveNotOfficialCompany").click(saveNotOfficialCompany);
	// 电话特殊格式
	//$("[data-mask]").inputmask();

	//$("[data-ma]").inputmask();

	//隐藏按钮
	hide();

	dyscGetProvinceCityCountry("#provinceId", "province", $('#provinceId')
			.val(), $('#cityId').val());

	bankAccountTable = initAccountTable();

	// 点击dataTable触发事件
    com.leanway.dataTableClick("bankAccountTable", "accountCheckList", true,
   		 bankAccountTable);

    com.leanway.getCodeMap("company", "type","1","#compantPropertyId", "-----所有制性质-----");
    com.leanway.getCodeMap("company", "type","2","#companyTypeId", "-----所有制性质-----");
    com.leanway.getCodeMap("company", "type","3","#companyRelationId", "-----所有制性质-----");

});
