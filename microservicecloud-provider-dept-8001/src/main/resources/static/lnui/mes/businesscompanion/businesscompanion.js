//改变checkbox形状 //数据table //新增或修改方法
var clicktime = new Date();
var opeMethod = "addbusiness";
var oTable;
var companyTable;
var companyApplyTable;
var bankAccountTable;
var htmlStatus = 1;
var reg=/,$/gi;

var readonly = [{"id":"saveCompanyData","type":"button"},{"id":"deleteAccountButton","type":"button"},{"id":"addAccountButton","type":"button"}];

// 需要初始化数据
$(function() {
	com.leanway.loadTags();
	oTable = initTable();
	bankAccountTable = initAccountTable();
	com.leanway.formReadOnly("businessForm", readonly);
});

//删除数据
 function deletebusiness(type){

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

    var ids = com.leanway.getCheckBoxData(type, "businessDataTable", "checkList");

 	if (ids.length>0) {

        var msg = "确定删除选中的" + ids.split(",").length + "个商业合作伙伴?";

		lwalert("tipModal", 2, msg ,"isSure2(" + type + ")");;

 	} else {
// 		alert("至少选择一条记录进行删除操作");
 		lwalert("tipModal", 1, "至少选择一条记录进行删除操作");
 	}
 }

 function isSure2(type){

	 var ids = com.leanway.getCheckBoxData(type, "businessDataTable", "checkList");
	 deleteAjax(ids);

 }
 function isSure() {
	 var str = '';
	 	// 拼接选中的checkbox
	 	$("input[name='accountCheckList']:checked").each(function(i, o) {
	 		str += $(this).val();
	 		str += ",";
	 	});
	 	var ids = str.substr(0, str.length - 1);

	 		deleteBankAccountAjax(ids);
 }
// 删除Ajax
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/business?method=deletebusiness",
		data : {
			conditions : '{"companionid":"' + ids + '", "status":"'+1+'"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
				if (tempData.code == "1") {

					com.leanway.clearTableMapData( "businessDataTable" );
					oTable.ajax.reload(); // 自动刷新dataTable
					oTable.ajax.reload(null,false); // 刷新dataTable
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败");
				}
			}
		}
	});
}

// 根据ID查出合作伙伴
var queryCompanyBusinessData = function  ( compid ) {
	com.leanway.formReadOnly("businessForm", readonly);
	$.ajax({
		type : "post",
		url : "../../../" + ln_project + "/company",
		data : {
			"method" : "queryCompanyBusinessData",
			"compid" : compid
		},
		dataType : "json",
		success : function( data ) {

			var flag =  com.leanway.checkLogind(data);

			if (flag) {
				setFormValue(data);
			}
			
		},error : function(data) {
			lwalert("tipModal", 1, "ajax请求异常！");
		}
	});
	
	
	bankAccountTable.ajax.url('../../../' + ln_project + '/bankAccount?method=queryBankAccount&compid=' + compid).load();
	 
}

//保存操作
function saveCompanyData() {
	
	var formData = $("#businessForm").serializeArray();
	var arrayForm = formatSaveFormJson(formData);

	$.ajax({
		type : "post",
		url : "../../../" + ln_project + "/company",
		data : {
			"method" : "saveCompanyData",
			"data" : arrayForm
		},
		dataType : "json",
		success : function( data ) {

			var flag =  com.leanway.checkLogind(data);

			if (flag) {
				
				if (data.status == "success") {
					
					oTable.ajax.reload();
					
				} else {
					
					lwalert("tipModal", 1, data.info);
					
				}
				
			}
			
		},error : function(data) {
			lwalert("tipModal", 1, "ajax请求异常！");
		}
	});
	 
	
}

var formatSaveFormJson = function  (formData) {

	
	var obj = new Object();
	
	for (var i = 0; i < formData.length; i++) {
		
		if (formData[i].name == "ctype") {
			obj[formData[i].name] = com.leanway.getDataTableCheckIds("ctype");
		} else {
			obj[formData[i].name] = formData[i].value;
		}

	}
	 
	obj.bankaccount = com.leanway.getListTableData(bankAccountTable);

	return JSON.stringify(obj);
}

//自动填充表单数据（页面id须与bean保持一致）
function setFormValue(json) {
	
	resetForm();
	
	for ( var item in json) {
		 if (item == "searchValue") {
			
		 } else if (item == "ctype") {
			
			 var ctypeArray = json[item].split(",");
			 for (var i = 0; i < ctypeArray.length; i++) {
				 $("input[type=checkbox][name=ctype][value= " + ctypeArray[i] +" ]").prop("checked", true);
			 }
			 
		 } else {
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

// 点击新增
function addbusiness() {
	com.leanway.removeReadOnly("businessForm", undefined);
	$("#saveCompanyData").attr("disabled", false);
	$("#addAccountButton").attr("disabled", false);
	$("#deleteAccountButton").attr("disabled", false);
	resetForm();
	
	 bankAccountTable.rows().remove().draw(false);
}

//修改（修改按钮不用清空id）
function showEditbusiness() {

	var companionid = oTable.rows('.row_selected').data();

	if(companionid.length == 0) {

		lwalert("tipModal", 1, "请选择商业合作伙伴！");
	} else if(companionid.length > 1) {

		lwalert("tipModal", 1, "只能选择一个商业合作伙伴进行修改！");
	}else{

		opeMethod = "updatebusiness";
		//设置可输入
		com.leanway.removeReadOnly("businessForm");
		//用于判断是否可输入
		buttonEnabled("#saveOrUpdateAId");
		$("#companioname").prop("readonly", true);

		htmlStatus = 1;
		editAccountTable();
	 
	}
	
	$("#saveCompanyData").attr("disabled", false);
	$("#addAccountButton").attr("disabled", false);
	$("#deleteAccountButton").attr("disabled", false);
}
// 重置表单数据
function resetForm() {
	 $("input[type=checkbox][name=ctype][value= 0 ]").prop("checked", false);
	 $("input[type=checkbox][name=ctype][value= 1 ]").prop("checked", false);
	 
	//$('#businessForm')[0].reset(); // 清空表单
	
	
	 $('#businessForm').each(function (index) {
	        $('#businessForm')[index].reset();
	 });
	 
	 $("#compId").val("");

};

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
				// 加载省市县
				initProvinceCityCountry(id, data, pcd);
			}
		},
		error : function(data) {

		}
	});
}
//地址
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
//全选
//com.leanway.dataTableCheckAll("bankAccountTable", "accountCheckAll", "checkList");

//初始化数据表格
var initTable = function(){
    var table = $('#businessDataTable')
            .DataTable(
                    {
                    	"ajax" : '../../../'+ln_project+'/company?method=queryCompanyBusiness',
                        //"iDisplayLength" : "10",
                    	/*"rowReorder": {
                            "selector": 'td:nth-child(2)'
                        },*/
        				'bPaginate' : false,
        				"bDestory" : true,
        				"bRetrieve" : true,
        				"bFilter" : false,
        				"bSort" : false,
        				"scrollY":"57vh",
        				"bAutoWidth": true,
        				"bProcessing" : true,
        				"bServerSide" : true,
        				'searchDelay' : "5000",
                        "aoColumns" : [

                                {
                                    "mDataProp" : "compId",
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
										com.leanway.columnTdBindSelectNew(nTd,"businessDataTable", "checkList");
									}
                                },{
         		            	   "mDataProp" : "compName"
         		               }, {
         		            	   "mDataProp" : "shortName"
         		               }],
                        "language" : {
                            "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                        },
                        "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                        "fnDrawCallback" : function(data) {

                          com.leanway.getDataTableFirstRowId("businessDataTable", queryCompanyBusinessData,"more", "checkList");

 							 // 点击dataTable触发事件
                           com.leanway.dataTableClickMoreSelect("businessDataTable", "checkList", false,
                                   oTable, queryCompanyBusinessData,undefined,undefined,"checkAll");

                           com.leanway.dataTableCheckAllCheck('businessDataTable', 'checkAll', 'checkList');

                        }
                    }).on('xhr.dt', function (e, settings, json) {
        				com.leanway.checkLogind(json);
        			} );
    return table;
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
    //$("input[type='checkbox']").prop("disabled", false);
}





//数据table
/*var companyTable;
var companyApplyTable;
var bankAccountTable;*/



/*var addAccount= function ( ) {
	//var compId = $("#compId").val();
	bankAccountTable.row.add({
		"accountid": "",
		"address" : "",
		"bankname" : "",
		"accountname" : "",
		"bankaccount" : "",
		"accounttype" : "",
	}).draw( false );


	editAccountTable();
}*/
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
/**
 * 把银行账户表格变成可编辑
 */
var editAccountTable = function () {
	// 账号类型
	//var typeSelect = initMouldSelect(data.listMould, index);
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
			//var address = bankAccountTable.rows().data()[index].address;

//			if (flag != undefined && typeof(flag) != "undefined" && flag) {

//				if (index == length) {

//					initEditBankAccouutTableData(data, index, $(this), flag);

//				}

//			} else {

				initEditBankAccouutTableData(data, index, $(this));

//			}

		});
	}
}

var initEditBankAccouutTableData = function ( data , index, obj) {

    var typeSelect = setAccountType(data, index);

    obj.find("td:eq(1)").html('<input type="text" class="form-control" style="width: 100%" onblur="setDataTableValue(this, ' + index + ',\'bankAccountTable\')" name="address" id="address" value="' + bankAccountTable.rows().data()[index].address  + '">');
    // 开户行名称
    var bankname = bankAccountTable.rows().data()[index].bankname;

    if (bankname == "null" || bankname == null) {
         bankname = "";
    }
    obj.find("td:eq(2)").html('<input type="text" class="form-control" style="width: 100%" onblur="setDataTableValue(this, ' + index + ',\'bankAccountTable\')" name="bankname" id="bankname" value="' + bankAccountTable.rows().data()[index].bankname  + '">');


    // 账户名称
    obj.find("td:eq(3)").html('<input type="text" class="form-control" style="width: 100%" onblur="setDataTableValue(this, ' + index + ',\'bankAccountTable\')" name="accountname" id="accountname" value="' + bankAccountTable.rows().data()[index].accountname + '">');

    // 公司账号
    var bankaccount = bankAccountTable.rows().data()[index].bankaccount;
    if (bankaccount == "null"  || bankaccount == null) {
        bankaccount = "";
    }
    obj.find("td:eq(4)").html('<input type="text" class="form-control" style="width: 100%" onblur="setDataTableValue(this, ' + index + ',\'bankAccountTable\')"  name="bankaccount" id="bankaccount' + index + '" value="' +bankaccount + '">');


    // 账户类型（下拉框）
    //var accounttype = '<select class="form-control"  onchange="accountTypeChange(this,' + index + ')" id="accounttype'+index+'"  name="accounttype">';
    obj.find("td:eq(5)").html('<select name="accounttype"    id="accounttype" style="width: 100%"  onchange="accountTypeChange(this,' + index + ')"  class="form-control" >' + typeSelect + '</select>');
    obj.find("td:eq(5)").find("#accounttype").val(bankAccountTable.rows().data()[index].accounttype);


}
var accountTypeChange =function (obj , index) {
	bankAccountTable.rows().data()[index].accounttype = obj.value;

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



 //点击银行账户添加按钮
 var addAccount= function ( ) {
		//var compId = $("#compId").val();
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
// 		if (confirm("确定要删除选中的银行账号信息吗?")) {
// 			deleteBankAccountAjax(ids);
// 		}

 		lwalert("tipModal", 2, "你确定要删除选择的银行账号信息吗？","isSure()");
 	} else {
// 		alert("至少选择一条记录操作");
 		lwalert("tipModal", 1, "至少选择一条记录进行操作");
 	}

 }


//删除银行
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

					oTable.ajax.reload(); // 自动刷新dataTable
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败");
				}
			}
		}
	});
}

 //获取银行账户信息
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
//初始化账户类型下拉框
 var setAccountType = function(data,index) {
 	var html = "";
 	for (var i in data) {
 		//拼接option
 		html +="<option value="+ data[i].codenum+">"+ data[i].codevalue+"</option>";
 	}
 	return html;
 }

//查询单位类型
 function queryBusinessType() {
 	$.ajax({
 		type : "get",
 		url : "../../../"+ln_project+"/business",
 		data : {
 			method : "queryBusinessType",
 			conditions : "{}"
 		},
 		dataType : "json",
 		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

	 			//下拉框赋值
	 		//	setBusinessType(data.businessTypeResult);
				var html="";
				//html+="<option value='' selected='selected'></option>";
				for (var i = 0;i<data.businessTypeResult.length;i++) {
					/**
					 * option 的拼接
					 * */
	//				html +="<input name='businesstype' readonly='readonly' type='checkbox' value='"+ data.businessTypeResult[i].codenum+"'>"+"</>"+ data.businessTypeResult[i].codevalue;
	                html+="<input type='checkbox' name='businesstype' value=" + data.businessTypeResult[i].codenum+" id=" + data.businessTypeResult[i].codenum + "  class='regular-checkbox'/><label for='" + data.businessTypeResult[i].codenum+ "'></label>"+data.businessTypeResult[i].codevalue+"&nbsp;&nbsp;&nbsp;";

				}
				$("#businesstype").html(html);
			}
 		},
 		error : function(data) {

 		}
 	});
 }

 
 

 