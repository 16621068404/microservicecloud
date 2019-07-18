
var clicktime = new Date();
	// 操作方法，新增或修改
var opeMethod = "addDispatcharg";

var oTable;

$(function() {

	initBootstrapValidator();
	// 初始化对象
	com.leanway.loadTags();

	oTable = initTable();

    // 初始化表单只读
	com.leanway.formReadOnly("dispatchargForm");
	//单选只读
	radioReadOnly()
	//保存按钮只读
	$("#saveOrUpdateAId").attr({
		"disabled" : "disabled"
	});
	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchDispatcharg);


});

//填写数据验证
function initBootstrapValidator() {

	$('#dispatchargForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {


					argname : {
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
					argdesc : {
						validators : {
							//notEmpty : {},
							stringLength : {
								min : 1,
								max : 20
							}
						}
					},

					capacity : {
						validators : {
							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},

					blankingdays : {
						validators : {
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.amount,
									com.leanway.reg.msg.amount)
						}
					},
				}
});

}
function addDispatcharg() {
	opeMethod = "addDispatcharg";

	// 清空表单
	resetForm();

	$("#saveOrUpdateAId").removeAttr("disabled");
	com.leanway.removeReadOnly("dispatchargForm");
	//radioRemoveReadOnly();
	radioReadOnly();
	$("#batch0").prop("disabled",false);
	$("#batch1").prop("disabled",false);
	$("#timearg0").prop("disabled",false);
	$("#timearg1").prop("disabled",false);
	com.leanway.dataTableUnselectAll("dispatchDataTable","checkList");
	com.leanway.clearTableMapData( "dispatchDataTable" );
}

function resetForm() {
	$('#dispatchargForm').each(function(index) {
		$('#dispatchargForm')[index].reset();
	});
	//radioRemoveReadOnly();
	radioReadOnly();
	$("#dispatchargForm").data('bootstrapValidator').resetForm();
}

var searchDispatcharg = function () {

	var searchVal = $("#searchValue").val();
	oTable.ajax.url("../../../../"+ln_project+"/dispatcharg?method=queryDispatcharg&searchValue=" + searchVal).load();
}
//初始化数据表格
var initTable = function() {
	var table = $('#dispatchDataTable')
			.DataTable(
					{
						"ajax" : "../../../../"+ln_project+"/dispatcharg?method=queryDispatcharg",
						//"iDisplayLength" : "10",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"scrollY":"55vh",
						"bAutoWidth": true,  //宽度自适应
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",
						"columns" : [ {
							"data" : "argid"
						}, {
							"data" : "argname"
						}, {
							"data" : "shortname"
						}, {
							"data" : "argdesc"
						}],
						"aoColumns" : [
								{
									"mDataProp" : "argid",
									  "fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
	                                        $(nTd).html(

													"<div id='stopPropagation"
															+ iRow
															+ "'>"
															+"<input class='regular-checkbox' type='checkbox' id='" + sData
	                                                        + "' name='checkList' value='" + sData
	                                                        + "'><label for='" + sData
	                                                        + "'></label>");
	                                        com.leanway.columnTdBindSelectNew(nTd,"dispatchDataTable", "checkList");
	                                    }
								}, {
									"mDataProp" : "argname"
								}, {
									"mDataProp" : "shortname"
								}, {
									"mDataProp" : "argdesc"
								}
						],

						"oLanguage" : {
				        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
				         },
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {
							com.leanway.getDataTableFirstRowId("dispatchDataTable", queryDispatchargById,"more", "checkList");

							 // 点击dataTable触发事件
                            com.leanway.dataTableClickMoreSelect("dispatchDataTable", "checkList", false,
                                   oTable, queryDispatchargById,undefined,undefined,"checkAll");


                            com.leanway.dataTableCheckAllCheck('dispatchDataTable', 'checkAll', 'checkList');
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

function saveOrUpdate() {

	$("#batch0").prop("disabled",false);
	$("#batch1").prop("disabled",false);

	var form = $("#dispatchargForm").serializeArray();
	var formData = formatFormJson(form);

	$("#dispatchargForm").data('bootstrapValidator').validate(); // 提交前先验证
   if ($('#dispatchargForm').data('bootstrapValidator').isValid()) { // 返回true、false
   if(opeMethod=="addDispatcharg"){

		$.ajax({
			type : "post",
			url : "../../../../"+ln_project+"/dispatcharg?method=queryDispatchargExist",
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
					$("#saveOrUpdateAId").attr({"disabled":"disable"});

				} else {

					lwalert("tipModal", 1, "派工参数名称已存在！");
					$("#batch0").prop("disabled",true);
					$("#batch1").prop("disabled",true);
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

function save(formData){

	$.ajax({
	type : "post",
	url : "../../../../"+ln_project+"/dispatcharg",
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
				$("#resetFun").attr({"disabled":"disable"});

				com.leanway.clearTableMapData( "dispatchDataTable" );

				if(opeMethod=="addDispatcharg"){
				    oTable.ajax.reload();
				}else{
				    oTable.ajax.reload(null,false);
				}

				com.leanway.formReadOnly("dispatchargForm");
				radioReadOnly();

			} else {

				lwalert("tipModal", 1, tempData.exception);

			}
		}
	},
	error : function(data) {

		lwalert("tipModal", 1, "保存失败！");
	}
});
}


//显示编辑数据
function showEditDispatcharg() {
	var data = oTable.rows('.row_selected').data();

	if(data.length == 0) {

		lwalert("tipModal", 1, "请选择一条派工参数进行修改！")

	} else if(data.length > 1) {

		lwalert("tipModal", 1, "只能选择一条派工参数进行修改！");
	}else {
		var argid = data[0].argid;

		com.leanway.removeReadOnly("dispatchargForm");
		document.getElementById("argname").readOnly=true;

		opeMethod = "updateDispatchargByConditons";

		radioReadOnly();
		$("#batch0").prop("disabled",false);
		$("#batch1").prop("disabled",false);
		$("#timearg0").prop("disabled",false);
		$("#timearg1").prop("disabled",false);
		$("#sinbatch0").prop("disabled",true);
		$("#sinbatch1").prop("disabled",true);
		$("#saveOrUpdateAId").removeAttr("disabled");

	}
}

//根据id查找派工参数详细信息
function queryDispatchargById(argid) {
	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/dispatcharg",
		data : {
			method : "queryDispatchargById",
			conditions : '{"argid":"' + argid + '"}'
		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var json = eval("(" + data + ")").resultObj;
				resetForm();
				com.leanway.formReadOnly("dispatchargForm");
				//保存按钮只读
				$("#saveOrUpdateAId").attr({
					"disabled" : "disabled"
				});
				setFormValue(json);

			}
		},
		error : function(data) {

		}
	});
}


function setFormValue(data) {

	radioReadOnly();
	var radioNames = "device,mould,batch,sinbatch,timearg";

	for ( var item in data) {

		if(radioNames.indexOf(item) != -1) {

			$("input[type=radio][name=" + item + "][value=" + data[item] + "]").prop('checked','true');

		} else {

			$("#" + item).val(data[item]);

		}

	}
}


//选中派工参数
function deleteDispatcharg(type) {

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "dispatchDataTable", "checkList");

	if (ids.length>0) {

        var msg = "确定删除选中的" + ids.split(",").length + "条派工参数?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	} else {

		lwalert("tipModal", 1, "至少选择一条记录操作！");
	}
}

function isSureDelete(type){

	var ids = com.leanway.getCheckBoxData(type, "dispatchDataTable", "checkList");
	deleteAjax(ids);
}

//删除派工参数Ajax
var deleteAjax = function(ids) {

	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/dispatcharg",
		data : {
			method : "deleteDispatchargByConditons",
			conditions : '{"argids":"' + ids + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

            var flag =  com.leanway.checkLogind(text);

			if(flag){
				var tempData = $.parseJSON(text);
				if (tempData.code == "1") {

					com.leanway.clearTableMapData( "dispatchDataTable" );
					oTable.ajax.reload(null,false);

				} else {

					lwalert("tipModal", 1, "操作失败！");

				}
			}
		}
	});
}
function checkNumber(){

	 var capacity = $("#capacity").val();
    if(isNaN(capacity)||capacity<=0||!(/^\d+$/.test(capacity))){

    	//lwalert("tipModal", 1, "请输入数字！");
       $("#capacity").val("");
       return false;
  }
}

//设置单选只读
function radioReadOnly(){
	$("#device0").prop("disabled",true);
	$("#device1").prop("disabled",true);
	$("#mould0").prop("disabled",true);
	$("#mould1").prop("disabled",true);
	$("#timearg0").prop("disabled",true);
	$("#timearg1").prop("disabled",true);
	$("#batch0").prop("disabled",true);
	$("#batch1").prop("disabled",true);
	$("#sinbatch0").prop("disabled",true);
	$("#sinbatch1").prop("disabled",true);

}

//移除单选只读
function radioRemoveReadOnly(){


	$("#device0").prop("disabled",false);
	$("#device1").prop("disabled",false);
	$("#mould0").prop("disabled",false);
	$("#mould1").prop("disabled",false);
	$("#timearg0").prop("disabled",false);
	$("#timearg1").prop("disabled",false);
	$("#batch0").prop("disabled",false);
	$("#batch1").prop("disabled",false);
	$("#sinbatch0").prop("disabled",false);
	$("#sinbatch1").prop("disabled",false);


}
