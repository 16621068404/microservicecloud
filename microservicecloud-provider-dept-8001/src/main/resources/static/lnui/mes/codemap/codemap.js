
var clicktime = new Date();
// 操作方法，新增或修改
var opeMethod = "addCodeMap";

var oTable;
var datable;
//初始化
$(function() {

	initBootstrapValidator();
	// 初始化对象
	com.leanway.loadTags();

	oTable = initTable();
    datable=initDetailTable(null);
	// 隐藏保存按钮
	$("#saveOrUpdateAId").attr({
		"disabled" : "disabled"
	});
    //初始化时表单只读
//	com.leanway.formReadOnly("codeMapForm");

	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchCodeMap);

});

//填写数据验证
function initBootstrapValidator() {

	$('#codeMapForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {


					tablename : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 1,
								max : 20
							}
						}
					},
					columnname : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 1,
								max : 25
							}
						}
					},
//					note : {
//						validators : {
//							notEmpty : {},
//							stringLength : {
//								min : 1,
//								max : 20
//							}
//						}
//					},
					codenum : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 1,
								max : 30
							}
						}
					},
					codevalue : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 1,
								max : 20
							}
						}
					},
					prefix : {
						validators : {
							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.amount,
									com.leanway.reg.msg.amount)
						}
					},
				}
});

}

var searchCodeMap = function () {

	var searchVal = $("#searchValue").val();

	oTable.ajax.url("../../../"+ln_project+"/codeMap?method=queryCodeMap&searchValue=" + searchVal).load();
}


//初始化数据表格
var initTable = function() {
	var table = $('#codeMapDataTable')
			.DataTable(
					{
						"ajax" : "../../../"+ln_project+"/codeMap?method=queryCodeMap",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"bAutoWidth": true,  //宽度自适应
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",
//						"columnDefs": [
//						 	            {
//						 	            	orderable: false,
//						 	            	targets: [0]
//						 		        }
//						 	          ],
						"columns" : [
						              {"data" : "codemapid"},
						              {"data" : "tablename"},
						              {"data" : "columnname"},
//						              {"data" : "prefix"},
//						              {"data" : "codenum"},
//						              {"data" : "codevalue"}
						              ],
//						              "columnDefs": [ {
//										    "targets": 1,
//										    "data": "tablename",
//										    "render": function ( data, type, full, meta ) {
//										      return type === 'display' && data.length > 8 ?
//										        '<span title="'+data+'">'+data.substr( 0, 6 )+'...</span>' :
//										        data;
//										    }
//										  },
//										  {
//					                            "targets": 2,
//					                            "data": "columnname",
//					                            "render": function ( data, type, full, meta ) {
//					                              return type === 'display' && data.length > 8 ?
//					                                '<span title="'+data+'">'+data.substr( 0, 6 )+'...</span>' :
//					                                data;
//					                            }
//					                      } ,
//										  {
//					                            "targets": 3,
//					                            "data": "prefix",
//					                            "render": function ( data, type, full, meta ) {
//					                              return type === 'display' && data.length > 8 ?
//					                                '<span title="'+data+'">'+data.substr( 0, 6 )+'...</span>' :
//					                                data;
//					                            }
//					                      } ,
//					                      {
//					                              "targets": 4,
//					                              "data": "codenum",
//					                              "render": function ( data, type, full, meta ) {
//					                                return type === 'display' && data.length > 8 ?
//					                                  '<span title="'+data+'">'+data.substr( 0, 6 )+'...</span>' :
//					                                  data;
//					                              }
//					                       } ,
//					                       {
//					                              "targets": 5,
//					                              "data": "codevalue",
//					                              "render": function ( data, type, full, meta ) {
//					                                return type === 'display' && data.length > 8 ?
//					                                  '<span title="'+data+'">'+data.substr( 0, 6 )+'...</span>' :
//					                                  data;
//					                              }
//					                       }],
						"aoColumns" : [
								{
									"mDataProp" : "codemapid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd).html(
												 "<div id='stopPropagation"
												+ iRow
												+ "'>"
												+"<input class='regular-checkbox' type='checkbox' id='" + sData
                                                 + "' name='checkList' value='" + sData
                                                 + "'><label for='" + sData
                                                 + "'></label>");
										 com.leanway.columnTdBindSelectNew(nTd,"codeMapDataTable", "checkList");
									}
								},
								{"mDataProp" : "tablename"},
								{"mDataProp" : "columnname"},
//								{"mDataProp" : "prefix"},
//								{"mDataProp" : "codenum"},
//								{"mDataProp" : "codevalue"}
						],

						"oLanguage" : {
				        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
				         },
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {

							com.leanway.getDataTableFirstRowId("codeMapDataTable", init,"more","checkList");

							 // 点击dataTable触发事件
                            com.leanway.dataTableClickMoreSelect("codeMapDataTable", "checkList", false,
                                  oTable, init,undefined,undefined,"checkAll");
                            com.leanway.dataTableCheckAllCheck('codeMapDataTable', 'checkAll', 'checkList');

							}

					}).on('xhr.dt', function (e, settings, json) {
						com.leanway.checkLogind(json);
					} );

	return table;
}
var init = function(codemapid){
    datable=initDetailTable(codemapid);
    datable.destroy();//清空数据表
    datable = initDetailTable(codemapid);
}

var initDetailTable = function(codemapid) {
    var table = $('#codeMapDetail')
            .DataTable(
                    {
                        "ajax" : "../../../"+ln_project+"/codeMap?method=queryDetailCodeMap&codemapid="+codemapid,
                        'bPaginate' : true,
                        "bDestory" : true,
                        "bRetrieve" : true,
                        "bFilter" : false,
                        "bSort" : false,
                        "bAutoWidth": true,  //宽度自适应
                        "bProcessing" : true,
                        "bServerSide" : true,
                        'searchDelay' : "5000",
                        "aoColumns" : [
                                {
                                    "mDataProp" : "codemapid",
                                    "fnCreatedCell" : function(nTd, sData,
                                            oData, iRow, iCol) {
                                        $(nTd).html(
                                                 "<div id='stopPropagation"
                                                + iRow
                                                + "'>"
                                                +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                                 + "' name='checkList2' value='" + sData
                                                 + "'><label for='" + sData
                                                 + "'></label>");
                                         com.leanway.columnTdBindSelectNew(nTd,"codeMapDetail", "checkList2");
                                    }
                                },
                              {"mDataProp" : "codenum"},
                              {"mDataProp" : "codevalue"},
                              {"mDataProp" : "prefix"},
                              {"mDataProp" : "replaceFiledtype"},
                              {"mDataProp" : "note"}
                        ],

                        "oLanguage" : {
                             "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                         },
                        "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                        "fnDrawCallback" : function(data) {
                             // 点击dataTable触发事件
                            com.leanway.dataTableClickMoreSelect("codeMapDetail", "checkList2", false,
                                  oTable, undefined,undefined,undefined,"checkAll2");
                            com.leanway.dataTableCheckAllCheck('codeMapDetail', 'checkAll2', 'checkList2');

                            }

                    }).on('xhr.dt', function (e, settings, json) {
                        com.leanway.checkLogind(json);
                    } );

    return table;
}

//点击新增按钮
function addCodeMap() {
	opeMethod = "addCodeMap";

	// 清空表单
	resetForm();
	com.leanway.removeReadOnly("codeMapForm");
	com.leanway.dataTableUnselectAll("codeMapDetail","checkList2");
//	$("#saveOrUpdateAId").removeAttr("disabled");

	com.leanway.clearTableMapData( "codeMapDetail" );
	$("#formModal").modal("show");
	if(oTable.rows('.row_selected').data().length!=0){
	 var tablename = oTable.rows('.row_selected').data()[0].tablename;
     var columnname = oTable.rows('.row_selected').data()[0].columnname;

	 $("#tablename").val(tablename);
	 $("#columnname").val(columnname);
	 $("#tablename").prop("readonly",true);
     $("#columnname").prop("readonly",true);
	}

	// 当checkbox被选择的时候radio就隐藏
	var i=0;
	//遍历所有的checkbox
	$(":checkbox").each(function(){
	//如果有checkbox被选中
		if(this.checked == true){
			i++;
		}
	});
	if(i == 0){
		//如果i=0 就把radio显示出来
		$("#hidefieldtype").show();
	}else{
		//否则 就把radio隐藏
		$("#hidefieldtype").hide();
	}

}

function resetForm() {
	$('#codeMapForm').each(function(index) {
		$('#codeMapForm')[index].reset();
	});
	$("#codeMapForm").data('bootstrapValidator').resetForm();

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

	var form = $("#codeMapForm").serializeArray();
	var formData = formatFormJson(form);

	 $("#codeMapForm").data('bootstrapValidator').validate(); // 提交前先验证
		if ($('#codeMapForm').data('bootstrapValidator').isValid()) {
			$.ajax({
				type : "post",
				url : "../../../"+ln_project+"/codeMap",
				data : {
					method : opeMethod,
					conditions : formData
				},
				dataType : "text",
				success : function(data) {
					var tempData = $.parseJSON(data);
					var flag =  com.leanway.checkLogind(data);

					if(flag){

						 if (tempData.status == "success") {

							$("#saveOrUpdateAId").attr({"disabled":"disable"});
//							com.leanway.formReadOnly("codeMapForm");
							 $("#formModal").modal("hide");

							com.leanway.clearTableMapData( "codeMapDataTable" );

							if(opeMethod=="addCodeMap"){
							    if(oTable.rows('.row_selected').data().length==0){
	                              oTable.ajax.reload();
							    }
							    datable.ajax.reload();
							}else{
							    datable.ajax.reload(null,false);
							}

						} else {
							lwalert("tipModal", 1, tempData.info);
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
function showEditCodeMap() {
//	var data = oTable.rows('.row_selected').data();
    var data = datable.rows('.row_selected').data();
	if(data.length == 0) {

		lwalert("tipModal", 1, "请选择字典明细！");
	} else if(data.length > 1) {

		lwalert("tipModal", 1, "只能选择一条字典明细数据进行修改！");
	}else {
		var unitsid = data[0].unitsid;

		opeMethod = "updateCodeMapByConditons";
		$("#formModal").modal("show");

		var codemapid =  datable.rows('.row_selected').data()[0].codemapid;

		queryCodeMapById(codemapid)
		 $("#tablename").prop("readonly",true);
	     $("#columnname").prop("readonly",true);
	     $("#codenum").prop("readonly",true);
	}
	$("#hidefieldtype").show();

}

function queryCodeMapById(codemapid) {
	$.ajax({
		type : "get",
		url : "../../../"+ln_project+"/codeMap",
		data : {
			method : "queryCodeMapById",
			conditions : '{"codemapid":"' + codemapid + '"}'
		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);



			if(flag){

				var json = eval("(" + data + ")").resultObj;

				resetForm();
//				com.leanway.formReadOnly("codeMapForm");
				$("#saveOrUpdateAId").attr({
					"disabled" : "disabled"
				});
				setFormValue(json);

				//根据后台传来的值选择对应的radio
				$("input[type=radio][name=fieldtype][value=" + json.fieldtype + "]").prop('checked','true');
			}
		},
		error : function(data) {

		}
	});
}


function setFormValue(data) {

	for ( var item in data) {
		$("#" + item).val(data[item]);
	}

}


//选中数据
function deleteCodeMap(type) {

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "codeMapDetail", "checkList2");

	if (ids.length>0) {
        var msg = "确定删除选中的" + ids.split(",").length + "条字典明细?";

		lwalert("tipModal", 2, msg ,"isSure(" + type + ")");
	} else {
//		alert("至少选择一条记录操作");
		lwalert("tipModal", 1, "请选择一条字典明细进行操作！");
	}
}

function isSure(type) {

	var ids = com.leanway.getCheckBoxData(type, "codeMapDetail", "checkList2");

	deleteAjax(ids);
}

//删除数据Ajax
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/codeMap",
		data : {
			method : "deleteCodeMapByConditons",
			conditions : '{"codeMapIds":"' + ids + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);

				 if (tempData.result.code == "1") {

					 com.leanway.clearTableMapData( "codeMapDataTable" );
					 datable.ajax.reload(null,false);
				      } else {
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");
				}
			}
		}
	});
}
