

var clicktime = new Date();
com.leanway.reg.decimal.num = /^[0-9]{0,99}$/;
com.leanway.reg.msg.num = "请输入正确的数字";
function initBootstrapValidator() {
	$('#contractForm').bootstrapValidator(
            {
                excluded : [ ':disabled' ],
                fields : {
                	contractno : {
                        validators : {
                            notEmpty : {},
                            remote: {//ajax验证。
                                url: "../../../"+ln_project+"/contract",//验证地址
                                message: '合同号已存在',//提示消息
                                delay :  1000,//每输入一个字符，就发ajax请求，服务器压力还是太大，设置2秒发送一次ajax（默认输入一个字符，提交一次，服务器压力太大）
                                type: 'POST',//请求方式

                                //自定义提交数据，默认值提交当前input value
                                  data: function(validator) {
                                      return {
                                    	  method:"queryContractnoIsExist",

                                      };
                                   }

                            }
                        }
                    },
                    contractname : {
                        validators : {
                            notEmpty : {}
                        }
                    },
                    prioritylevels : {
                        validators : {
                        	notEmpty : {},
                        	regexp: com.leanway.reg.fun(
        							com.leanway.reg.decimal.num,
        							com.leanway.reg.msg.num )
                        }
                    },
                    note : {
                        validators : {
                        	stringLength : {
                                max : 1000
                            }
                        }
                    },
                    companionid: {
                    	validators : {
                            notEmpty : {}
                        }
                    }
                }
            });
}
//审核
function checkContract() {

	
	var ids = com.leanway.getCheckBoxData(1, "contractDataTable", "checkList");
	if (ids.length>0) {
		var msg = "确定" + ids.split(",").length + "个合同通过审核?";

		lwalert("tipModal", 2, msg ,"isSureCheck()");
	} else {
		lwalert("tipModal", 1, "至少选择一条记录进行操作！");
	}
}

function isSureCheck(){

	var ids = com.leanway.getCheckBoxData(1, "contractDataTable", "checkList");

	updateCheckStatus(ids);
}
// 删除Ajax
var updateCheckStatus = function(ids) {

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/contract",
		data : {
			method : "updateCheckStatus",
			conditions : '{"contractids":"' + ids + '", "checkstatus":"' + 1 + '"}'
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				if (data.status == "success") {

					com.leanway.clearTableMapData( "contractDataTable" );
					resetPageForm();
					oTable.ajax.reload(null,false); // 刷新dataTable
					
				} 
				lwalert("tipModal", 1, data.info);

			}
		}
	});
}

//删除销售订单
function deleteContract(type) {

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "contractDataTable", "checkList");
	if (ids.length>0) {
		var msg = "确定删除选中的" + ids.split(",").length + "个合同?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	} else {
//		alert("至少选择一条记录操作");
		lwalert("tipModal", 1, "至少选择一条记录进行操作！");
	}
}

function isSureDelete(type){

	var ids = com.leanway.getCheckBoxData(type, "contractDataTable", "checkList");

	deleteAjax(ids);
}
// 删除Ajax
var deleteAjax = function(ids) {

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/contract",
		data : {
			method : "updateContractStatusByConditons",
			conditions : '{"contractids":"' + ids + '", "status":"' + 1 + '"}'
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				if (data.code == "1") {

					com.leanway.clearTableMapData( "contractDataTable" );
					resetPageForm();
					setTableValue(null);
					oTable.ajax.reload(null,false); // 刷新dataTable

	//				alert("删除成功!");
					lwalert("tipModal", 1, "删除成功！");
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");
				}

			}
		}
	});
}

//点击dataTable触发事件
function clickDataTable(contractId) {
	com.leanway.formReadOnly("contractForm");
	getContractById(contractId);
}


//取消选中dataTable事件
function unSelectDataTableFunc() {

}

//选中DataTable事件
function selectDataTableFunc() {

}

//单个input只读
function inputReadOnly(id) {
	$(id).prop("readonly", true);
}
//修改合同
function showEditContract() {
	//判断合同号是否有值，有，则允许修改
	if($("input[type=checkbox]:checked").length!=1 ){
		lwalert("tipModal", 1, "请选择一个合同进行修改！");
		return;
	}
	if($("#contractno").val()!=null && $("#contractno").val()!=''){
		opeMethod = "updateContractByConditons";
		com.leanway.removeReadOnly("contractForm");
//		var length = $("#tableBody tr").length;
//		if(length>0){
			$("input[name=contracttype]").prop("disabled",true);
//		}else{
//			$('input[name=contracttype]').prop("disabled",false);
//		}
		$("#contractno").prop("readonly",true);
		$("#saveOrUpdateButtonId").prop("disabled",false);


	}else{
		lwalert("tipModal", 1, "请选择一个合同进行修改！");
	}

}



// 格式化form数据
	var  formatFormJson = function  (formData) {
		var reg=/,$/gi;
		var data = "{";
		for (var i = 0; i < formData.length; i++) {
			data += "\"" +formData[i].name +"\" : \""+formData[i].value+"\",";
		}
		data = data.replace(reg,"");
		data += "}";
		return data;
	}

// 操作方法，新增或修改
var opeMethod = "addContract";

//新增
function addContract() {
	opeMethod = "addContract";
	com.leanway.removeReadOnly("contractForm");
	resetPageForm();
	com.leanway.dataTableUnselectAll("contractDataTable","checkList");
	com.leanway.clearTableMapData( "contractDataTable" );
	setTableValue(null);
	$("#saveOrUpdateButtonId").prop("disabled",false);
	$('input[name=contracttype]').prop("disabled",true);
}

function saveOrUpdate() {
	$('input[name=contracttype]').prop("disabled",false);

	if(opeMethod=="updateContractByConditons"){
		$("#contractForm").data('bootstrapValidator').enableFieldValidators("contractno",false);
	}
	$("#contractForm").data('bootstrapValidator').validate(); // 提交前先验证
    if ($('#contractForm').data('bootstrapValidator').isValid()) { // 返回true、false
    	var form  = $("#contractForm").serializeArray();
    	var formData = formatFormJson(form);

    	$.ajax({
    		type : "post",
    		url : "../../../"+ln_project+"/contract",
    		data : {
    			method : opeMethod,
    			conditions : formData
    		},
    		dataType : "json",
    		success : function(data) {

    			var flag =  com.leanway.checkLogind(data);

    			if(flag){

	    			if (data.code == "1") {

	    				com.leanway.formReadOnly("contractForm");
	    				$("#saveOrUpdateButtonId").prop("disabled",true);
	    				$('input[name=contracttype]').prop("disabled",true);
	    				com.leanway.clearTableMapData( "contractDataTable" );

	    				if(opeMethod=="addContract"){
						    oTable.ajax.reload();
						}else{
						    oTable.ajax.reload(null,false);
						}

	//    				alert("保存成功");
	    				lwalert("tipModal", 1, "保存成功！");
	    				$("#contractForm").data('bootstrapValidator').enableFieldValidators("contractno",true);

	    			} else {
	//    				alert(data.exception);
	    				lwalert("tipModal", 1, data.exception);
	    			}

    			}
    		},
    		error : function(data) {
//    			alert("保存失败！");
				lwalert("tipModal", 1, "保存失败！");
    		}
    	});
    }
}

// 重置表单数据
function resetPageForm() {
	$('#contractForm')[0].reset(); // 清空表单
	$("#contractForm input[type='hidden']").val("");
	$("#companionid").val(null).trigger("change"); // select2值给清空
	$("#contractForm").data('bootstrapValidator').resetForm();
};

//初始化数据表格
var initTable = function() {
	var table = $('#contractDataTable')
			.DataTable(
					{
						"ajax" : '../../../'+ln_project+'/contract?method=queryContractByConditons&contracttype=0',
						"iDisplayLength" : "10",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"scrollY":"57vh", // DataTables的高
						//"sScrollX" : 400, // DataTables的宽
						"bAutoWidth" : true, // 宽度自适应
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",
						"aoColumns" : [
								{
									"mDataProp" : "contractid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										  $(nTd).html("<div id='stopPropagation" + iRow +"'>"
												   +"<input class='regular-checkbox' type='checkbox' id='" + sData
				                                   + "' name='checkList' value='" + sData
				                                   + "'><label for='" + sData
				                                   + "'></label>");
										 com.leanway.columnTdBindSelectNew(nTd,"contractDataTable", "checkList");
									}
								}, {
									"mDataProp" : "contractno"
								}, {
									"mDataProp" : "contractname"
								}, {
									"mDataProp" : "modifytime"
								} ],
						"fnCreatedRow" : function(nRow, aData, iDataIndex) {
							// add selected class
						},
						"oLanguage" : {
				        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
				         },
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {
							com.leanway.getDataTableFirstRowId("contractDataTable", getContractById,"more", "checkList");

							 // 点击dataTable触发事件
                            com.leanway.dataTableClickMoreSelect("contractDataTable", "checkList", false,
                                    oTable, getContractById,undefined,undefined,"checkAll");

                            com.leanway.dataTableCheckAllCheck('contractDataTable', 'checkAll', 'checkList');

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

//初始化表格
oTable = initTable();

//根据ID得到合同
function getContractById(contractId) {

	$.ajax({
		type: "get",
		url: "../../../"+ln_project+"/contract",
		data: {
			method: "queryContractById",
			conditions: '{"contractid":"' + contractId + '"}'
		},
		dataType: "json",
		success: function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				setFormValue(data.contract.resultObj);

				setTableValue(data.salesdetail,data.contract.resultObj.contracttype);
				com.leanway.formReadOnly("contractForm");
			}
		},
		error: function(data) {

		}
	});

	$("#saveOrUpdateButtonId").prop("disabled",true);
}

//自动填充表单数据（页面id须与bean保持一致）
function setFormValue(data) {

	resetPageForm();

	for ( var item in data) {

		if ( item == "contracttype" ) {

			$("input[type=radio][name=contracttype][value=" + data[item] + "]").prop('checked','true');

		} else if (item != "searchValue")  {

				$("#" + item).val(data[item]);
		}
	}

	// 给select2赋初值
    var companionId = data.companionid;
    if(companionId != "" && companionId != null && companionId != "null") {
    	setValueToSelect2Func("#companionid", companionId, data.companioname);
    }
}

//ctrlId:select2的ID；idVal:id值；name:文本框的值
function setValueToSelect2Func(ctrlId, idVal, name) {
	$(ctrlId).append('<option value=' + idVal + '>' + name + '</option>');
    $(ctrlId).select2("val", [ idVal ]);
}
$(function() {

	initBootstrapValidator();

	oTable = initTable();

	com.leanway.formReadOnly("contractForm");
	$("#saveOrUpdateButtonId").prop("disabled",true);
	$('input[name=contracttype]').prop("disabled",true);
	com.leanway.loadTags();

	//点击表格
//	com.leanway.dataTableClick("contractDataTable", "checkList", true, oTable, clickDataTable, selectDataTableFunc, unSelectDataTableFunc);

	//全选
	//com.leanway.dataTableCheckAll("contractDataTable", "checkAll", "checkList");

	//初始化公司-select2
//	$("input[name=contracttype]:checked").val();
    com.leanway.initSelect2("#companionid", "../../../"+ln_project+"/company?method=queryCompanyBySelect2&contracttype="+$("input[name=contracttype]:checked").val(), "搜索合作伙伴");

    // enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchContract);
	$("input[name=checkstatus]").click(function(){
		searchContract();
	});

	//合同类型改变 触发事件
	$('input:radio[name="contracttype"]').change( function(){



		com.leanway.initSelect2("#companionid", "../../../"+ln_project+"/company?method=queryCompanyBySelect2&contracttype="+$("input[name=contracttype]:checked").val(), "搜索合作伙伴");
		$("#companionid").val(null).trigger("change");



	})
});

var searchContract = function () {

	var searchVal = $("#searchValue").val();
	var checkstatus =  $('input[name="checkstatus"]:checked').val();

	oTable.ajax.url("../../../"+ln_project+"/contract?method=queryContractByConditons&contracttype=0&searchValue=" + searchVal+"&checkstatus="+checkstatus).load();
}



function setTableValue(data, orderkind) {



	if (orderkind != null && orderkind != undefined && typeof(orderkind) != "undefined" && orderkind == 2) {
		$("#tableTitle").html("采购订单");
		var tableHeadHtml = ""
		tableHeadHtml += " <tr>";
		tableHeadHtml += "  <th width='100px'>" + "采购订单号" + "</th>";
		tableHeadHtml += "  <th width='150px'>" + "到货日期" + "</th>";
		tableHeadHtml += "  <th>" + "产品" + "</th>";
		tableHeadHtml += "  <th width='100px'>" + "产品描述" + "</th>";
		tableHeadHtml += "  <th>" + "数量" + "</th>";
		tableHeadHtml += "  <th>" + "总价" + "</th>";
		tableHeadHtml += "  <th>" + "已收货数量" + "</th>";
		tableHeadHtml += " </tr>";
		$("#tableHead").html(tableHeadHtml);

		var tableBodyHtml = "";
		if ( data != null ) {
			for ( var i in data) {
				tableBodyHtml += " <tr>";
				tableBodyHtml += "  <td>" + data[i].salesorderid + "</td>";
				tableBodyHtml += "  <td>" + data[i].requestdate + "</td>";
				tableBodyHtml += "  <td>" + data[i].productorname + "</td>";
				tableBodyHtml += "  <td>" + data[i].productordesc + "</td>";
				tableBodyHtml += "  <td>" + data[i].number + "</td>";
				tableBodyHtml += "  <td>" + data[i].payment + "</td>";
				tableBodyHtml += "  <td>" + data[i].receivedcount + "</td>";
			}
		}

		$("#tableBody").html(tableBodyHtml);

	} else {
			$("#tableTitle").html("销售订单");
			tableHeadHtml += " <tr>";
			tableHeadHtml += "  <th width='100px'>" + "销售订单号" + "</th>";
			tableHeadHtml += "  <th width='150px'>" + "订单日期" + "</th>";
			tableHeadHtml += "  <th>" + "行号" + "</th>";
			tableHeadHtml += "  <th>" + "产品" + "</th>";
			tableHeadHtml += "  <th width='100px'>" + "产品描述" + "</th>";
			tableHeadHtml += "  <th>" + "关联数量" + "</th>";
			tableHeadHtml += "  <th>" + "生产查询号" + "</th>";
			tableHeadHtml += " </tr>";
			$("#tableHead").html(tableHeadHtml);

			var tableBodyHtml = "";

			if ( data != null ) {
				for ( var i in data) {
					tableBodyHtml += " <tr>";
					tableBodyHtml += "  <td>" + data[i].salesorderid + "</td>";
					tableBodyHtml += "  <td>" + data[i].salesdate + "</td>";
					tableBodyHtml += "  <td>" + data[i].line + "</td>";
					tableBodyHtml += "  <td>" + data[i].productorname + "</td>";
					tableBodyHtml += "  <td>" + data[i].productordesc + "</td>";
					tableBodyHtml += "  <td>" + data[i].number + "</td>";
					tableBodyHtml += "  <td>" + data[i].productionsearchno + "</td>";
				}
			}

			$("#tableBody").html(tableBodyHtml);
	}

}
/**
 * 检查合同号是否相同
 */
function checkContractno(){
	var contractno = $("#contractno").val();
	$.ajax({
		type : "post",
		url  : "../../../"+ln_project+"/contract",
		data : {
			method : "queryContractnoIsExist",
			contractno : contractno
		},
		datatype : "text",
		success : function(data){
			var tempData = $.parseJSON(data);

			if(!tempData.valid){

				lwalert("tipModal", 1, "合同号已存在");
				$("#contractno").val("");

			}
		}
	});

}
