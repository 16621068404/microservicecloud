var zTree, treeMenu, oTable;
var employeeTable,saveEmployeeTable,viewEmployeeTable;
var reg=/,$/gi;
$(function() {
	$("#saveOrUpdate").prop("disabled", true);
	//从数据字典加载出库规则
	getCodeMap("outboundrule","companymap","outboundrule");
	//从数据字典加载仓库类型
	getCodeMap("storagetype","companymap","storagetype");
	$.fn.zTree.init($("#treeDemo"));

	zTree = $.fn.zTree.getZTreeObj("treeDemo");
	// 初始化对象
	com.leanway.loadTags();
	initBootstrapValidator();
	oTable = initTree();
	com.leanway.formReadOnly("companyMapForm");
	getUnits("areaunit","面积单位");
	getUnits("volumeunit","体积单位");
	getUnits("temperatureunit","温度单位");

})

var getUnits = function(id,type){
    $.ajax({
        type : "get",
        url : "../../../../"+ln_project+"/units",
        data : {
            method : "queryUnitsByUnitsTypeId",
            "unitsTypeId" : type
        },
        dataType : "json",
        success : function(data) {

            var flag =  com.leanway.checkLogind(data);

            if(flag){
                var tempData = data.timeUnitsResult;
                var html = "";
                for ( var i in tempData) {
                    html += "<option value=" + tempData[i].unitsid + ">" + tempData[i].unitsname
                            + "</option>";
                }

                $("#"+id).html(html);

            }
        },
        error : function(data) {

        }
    });
}

//关闭modal  清空选中的map
//$("#modalClose").on("click",function(){
//
//	com.leanway.clearTableMapData("employeeTables");
//})
//$(".close").on("click",function(){
//
//	com.leanway.clearTableMapData("employeeTables");
//})

function initBootstrapValidator() {
	$('#companyMapForm').bootstrapValidator({
		excluded : [ ':disabled' ],
		fields : {
			area : {
				validators : {

					regexp : {
						regexp : /^[0-9.]+$/,
						message : '输入不合法'
					}
				}
			},
			volume : {
				validators : {

					regexp : {
						regexp : /^[0-9.]+$/,
						message : '输入不合法'
					}
				}
			},
        	temperature : {
        		validators : {

        			regexp: {
        				regexp : /^[0-9.]+$/,
						message : '输入不合法'
                    }
        }
    }
		}
	});
}
//初始化雇员
var initEmployeeTable = function (id) {
    //com.leanway.checkSession();
    var table = $('#employeeTables').DataTable( {
        "ajax": '../../../../'+ln_project+'/dispatchingOrder?method=queryEmployees&flag=1&id=' + id,
        //"iDisplayLength" : "10",
/*      "scrollY": "200px",
        "scrollCollapse": "true",*/
        'bPaginate': true,
        "bDestory": true,
        "bRetrieve": true,
        "bFilter":false,
        "bSort": false,
        "bProcessing": true,
        "bServerSide": true,
        "bInfo" : true,
        "aoColumns": [
                      {
                          "mDataProp": "employeeid",
                          "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
//                            $(nTd).html("<input type='checkbox' name='employeeCheckList'  value='" + sData + "'>");
                              $(nTd)
                              .html("<div id='stopPropagation" + iRow +"'>"
                                      +"<input class='regular-checkbox' type='checkbox' id='"
                                      + sData
                                      + "' name='employeeCheckList' value='"
                                      + sData
                                      + "'><label for='"
                                      + sData
                                      + "'></label>");
                              com.leanway.columnTdBindSelect(nTd);
                          }
                      },
                      {"mDataProp": "name"},
                      {"mDataProp": "moble"},
                      ],
                      "fnCreatedRow": function ( nRow, aData, iDataIndex ) {

                          //add selected class
                          $(nRow).dblclick(function () {
                              addEmployee(aData);
                              //    employeeTable.rows(iDataIndex).remove().draw(false);
                          });

                          $(nRow).click(function () {
                              if ($(this).hasClass('row_selected')) {
                                  $(this).removeClass('row_selected');
                                  $(this).find('td').eq(0).find("input[name='employeeCheckList']").prop("checked", false)
                              } else {
                                  // employeeTable.$('tr.row_selected').removeClass('row_selected');
                                  $(this).addClass('row_selected');
                                  //$("input[name='employeeCheckList']").prop("checked", false);
                                  $(this).find('td').eq(0).find("input[name='employeeCheckList']").prop("checked", true)
                              }
                          });
                      },
                      "oLanguage" : {
                          "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                      },
                      "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                      "fnDrawCallback" : function(data) {

                          if (tableStatus && employeeTable.rows().data().length == 1) {
                              addEmployee(employeeTable.rows().data()[0]);
                          }

                      }

    } ).on('xhr.dt', function (e, settings, json) {
        com.leanway.checkLogind(json);
    } );

    return table;
}
var initSaveEmployeeTable = function (params) {
    //com.leanway.checkSession();
    var table = $('#saveEmployeeTables').DataTable( {
        "ajax": '../../../../'+ln_project+'/mapProductor?method=queryEmployees'+params,
        'bPaginate': false,
        "bDestory": true,
        "bRetrieve": true,
        "bFilter":false,
        "bSort": false,
        "bProcessing": true,
        "bServerSide": false,
        "aoColumns": [
                      {
                          "mDataProp": "employeeid",
                          "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
//                            $(nTd).html("<input type='checkbox' name='saveEmployeeCheckList'  value='" + sData + "'>");
                              $(nTd)
                              .html("<div id='stopPropagation" + iRow +"'>"
                                      +"<input class='regular-checkbox' type='checkbox' id='"
                                      + sData
                                      + "' name='saveEmployeeCheckList' value='"
                                      + sData
                                      + "'><label for='"
                                      + sData
                                      + "'></label>");
                              com.leanway.columnTdBindSelect(nTd);
                          }
                      },
                      {"mDataProp": "name"},
                      {"mDataProp": "moble"},
                      ],
                      "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
                          //add selected class
                          $(nRow).dblclick(function () {
                              saveEmployeeTable.rows(iDataIndex).remove().draw(false);


                              // 重新添加数据到DataTable，解决index下标错误的问题， 操作步骤，1：先删除第一条数据，第二条时删除不掉
                              var tempData = saveEmployeeTable.rows().data();

                              saveEmployeeTable.rows().remove().draw(false);

                              saveEmployeeTable.rows.add(tempData).draw(false);
                              // saveEmployeeTable.rows().add(tempData).draw(false);

                              // saveEmployeeTable.ajax.reload(false);
                          });

                          $(nRow).click(function () {
                              if ($(this).hasClass('row_selected')) {
                                  $(this).removeClass('row_selected');
                                  $(this).find('td').eq(0).find("input[name='saveEmployeeCheckList']").prop("checked", false)
                              } else {
                                  // employeeTable.$('tr.row_selected').removeClass('row_selected');
                                  $(this).addClass('row_selected');
                                  //$("input[name='employeeCheckList']").prop("checked", false);
                                  $(this).find('td').eq(0).find("input[name='saveEmployeeCheckList']").prop("checked", true)
                              }
                          });

                      },
                      "oLanguage" : {
                          "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                      }

    } ).on('xhr.dt', function (e, settings, json) {
        com.leanway.checkLogind(json);
    } );

    return table;
}


var levels = ""
var pmapid = "";
var html = "";


// 修改节点
function modifyTreeNode() {
	ope = "updateConpanyMap";
	var nodes = zTree.getSelectedNodes();
	if (nodes.length == 0) {
		lwalert("tipModal", 1, "请选择需要修改的节点!");
	}else if(nodes[0].parent==''){
		lwalert("tipModal", 1, "请选择仓库进行修改!");
	} else if (nodes[0].mapid == "undefined" || nodes[0].mapid == undefined) {
		lwalert("tipModal", 1, "该组件还未保存信息，不能修改");
	} else {
		$("#saveOrUpdate").prop("disabled", false);
		com.leanway.removeReadOnly("companyMapForm");
		$("#name").prop("readonly", true);
		$("#mapcode").prop("readonly", true);
		$("#typename").prop("disabled", true);
	}
}

/**
 * 左右移动，1：向右移，2：向左移
 */
var toTable = function ( type ) {
    //com.leanway.checkSession();
    if (type == 1) {

        var dataList =  employeeTable.rows('.row_selected').data();

        if (dataList != undefined && dataList.length > 0) {

            for (var i = 0; i < dataList.length; i++) {

                addEmployee(dataList[i]);

            }

        }

    } else if (type == 2) {

        saveEmployeeTable.rows(".row_selected").remove().draw(false);

        // 重新添加数据到DataTable，解决index下标错误的问题， 操作步骤，1：先删除第一条数据，第二条时删除不掉
        var tempData = saveEmployeeTable.rows().data();

        saveEmployeeTable.rows().remove().draw(false);

        saveEmployeeTable.rows.add(tempData).draw(false);

    }

}
var initViewEmployeeTable = function (id) {
    //com.leanway.checkSession();
    var table = $('#viewEmployeeTables').DataTable( {
        "ajax": '../../../../'+ln_project+'/mapProductor?method=queryEmployees&mapid='+id,
        'bPaginate': false,
        "bDestory": true,
        "bRetrieve": true,
        "bFilter":false,
        "bSort": false,
        "bProcessing": true,
        "bServerSide": false,
        "aoColumns": [
                      {"mDataProp": "name"},
                      {"mDataProp": "moble"},
                      ],
                      "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
                          //add selected class
                      },
                      "oLanguage" : {
                          "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                      }

    } ).on('xhr.dt', function (e, settings, json) {
        com.leanway.checkLogind(json);
    } );

    return table;
}


/**
 * 查询雇员
 */
var searchEmployee = function () {
    tableStatus = true;

    var ids = com.leanway.getDataTableCheckIds("checkListTwo");

    var searchValue =  $("#employeeSearchValue").val();

    if ($.trim(searchValue) == "") {
        tableStatus = false;
    }

    employeeTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryEmployees&flag=1&searchValue=" + searchValue).load();

}
/**
 * 添加雇员
 */
var addEmployee = function ( obj ) {
    //com.leanway.checkSession();
    var canAdd = true;

    // 判断添加的对象在关系表中是否存在
    var dataList = saveEmployeeTable.rows().data();

    if (dataList != undefined && typeof(dataList) != "undefined" && dataList.length > 0) {

        // 循环遍历Table数据
        for (var i = 0; i < dataList.length; i ++) {

            var employeeData = dataList[i];

            if (employeeData.employeeid == obj.employeeid) {
                canAdd = false;
            }

        }
    }

    if (canAdd) {
        saveEmployeeTable.row.add(obj).draw( false );
    }

}


/**
 * 保存关联雇员
 */
var saveMapProductorEmployee = function ( ) {

    var ids = com.leanway.getDataTableCheckIds("checkListTwo");
    var node = zTree.getSelectedNodes()[0];
    var mapid = node.mapid;
    // 派工单数据
    var data = getDataTableData(saveEmployeeTable);

    var formData = "{\"listEmployee\": "+ data + ",\"mapproductorid\":\"" + ids + "\",\"mapid\":\""+mapid+"\"}";

    $.ajax ( {
        type : "post",
        url : "../../../../"+ln_project+"/mapProductor",
        data : {
            "method" : ope,
            "paramData" : formData
        },
        dataType : "json",
        async : false,
        success : function ( text ) {

            var flag =  com.leanway.checkLogind(text);

            if(flag){

                if (text.status == "success") {
                    com.leanway.clearTableMapData("employeeTables");
                    refreshParentNode();//刷新该节点的父节点

                    $('#employeeModal').modal('hide');
                }

            }

        }
    });

}

var getDataTableData = function ( tableObj ) {
    var jsonData = "[";

    var dataList = tableObj.rows().data();

    if (dataList != undefined && typeof(dataList) != "undefined" && dataList.length > 0) {

        // 循环遍历Table数据
        for (var i = 0; i < dataList.length; i ++) {

            var productorData = dataList[i];

            jsonData += JSON.stringify(productorData) + ",";

        }
    }
    jsonData = jsonData.replace(reg,"");

    jsonData += "]";

    return jsonData;
}




var treeMethod = "queryStoreTreeList";
var initTree = function() {
	queryCompanyMapTreeList(treeMethod);
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
}
//设置 ztree
var setting = {
		async : {
			enable : true,
			url : "../../../"+ln_project+"/companyMap?method=" + treeMethod,
			autoParam : [ "mapid", "name" ]
		},
		view : {
			dblClickExpand : false,
			nameIsHTML:true
		},
		data : {

			key : {
				id : "mapid",
				name : "name"
			},
			simpleData : {
				enable : true,
				idKey : "mapid",
				pIdKey : "pid",
				rootPId : ""
			}

		},
		callback : {

			onClick : onClick
		}
	}

function queryCompanyMapTreeList(treeMethod) {

	$.fn.zTree.init($("#treeDemo"),setting );
}



var ope;
function onClick() {

	$("#saveOrUpdate").prop("disabled", true);

	if (zTree.getSelectedNodes()[0].mapid) {
		loadCompanyMapObject(zTree.getSelectedNodes()[0].mapid);
	}
	com.leanway.formReadOnly("companyMapForm");
}
var loadCompanyMapObject = function(mapid) {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/companyMap?method=queryCompanyMapObject",
		data : {
			"mapid" : mapid,
		},
		dataType : "text",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {

				var tempData = $.parseJSON(data);

				setFormValue(tempData.CompanyMap);

			}
		}
	});
}
//从数据字典获取数据
var getCodeMap = function(id,tablename,columnname){
    $.ajax({
        type : "POST",
        url : "../../../"+ln_project+"/codeMap",
        data : {
            "method" : "queryCodeMapList",
            "t":tablename,
            "c":columnname

        },
        dataType : "text",
        async : false,
        success : function(data) {
            var tempData = $.parseJSON(data);
            var html = "";
            for ( var i in tempData) {
                html += "<option value=" + tempData[i].codemapid + ">" + tempData[i].codevalue
                        + "</option>";
            }

            $("#"+id).html(html);
        }
    });
}

/**
 * 关联雇员
 */
var showMapEmployee = function(){
    ope="saveMapEmployee";

    if(zTree.getSelectedNodes()[0]!=undefined && zTree.getSelectedNodes()[0].parent!=''){

        var ids = zTree.getSelectedNodes()[0].mapid;
        tableStatus = false;

        // 弹出modal
        $('#employeeModal').modal({backdrop: 'static', keyboard: true});


        if (employeeTable == null || employeeTable == "undefined" || typeof(employeeTable) == "undefined") {
            employeeTable = initEmployeeTable(ids);

        } else {
            employeeTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryEmployees&flag=1").load();
        }

        if (saveEmployeeTable == null || saveEmployeeTable == "undefined" || typeof(saveEmployeeTable) == "undefined") {

            saveEmployeeTable = initSaveEmployeeTable('&mapid=' + ids);

        } else {
            saveEmployeeTable.ajax.url("../../../../"+ln_project+"/mapProductor?method=queryEmployees&mapid=" + ids).load();
        }


    }else{
        lwalert("tipModal", 1, "请选择仓库再进行关联!");
    }
}
/**
 * 查看雇员
 */
var viewEmployee = function(mapid){
	$('#veiwEmployeeModal').modal({backdrop: 'static', keyboard: true});

    if (viewEmployeeTable == null || viewEmployeeTable == "undefined" || typeof(viewEmployeeTable) == "undefined") {
        viewEmployeeTable = initViewEmployeeTable(mapid);

    } else {
        viewEmployeeTable.ajax.url("../../../../"+ln_project+"/mapProductor?method=queryEmployees&mapid=" + mapid).load();
    }

}

//var viewMapEmployee=function(){
//    if(zTree.getSelectedNodes()[0]!=undefined && zTree.getSelectedNodes()[0].parent!=''){
//        var ids = zTree.getSelectedNodes()[0].mapid;
//        // 弹出modal
//        $('#veiwEmployeeModal').modal({backdrop: 'static', keyboard: true});
//
//        if (viewEmployeeTable == null || viewEmployeeTable == "undefined" || typeof(viewEmployeeTable) == "undefined") {
//            viewEmployeeTable = initViewEmployeeTable(ids);
//        }else {
//            viewEmployeeTable.ajax.url("../../../../"+ln_project+"/mapProductor?method=queryEmployees&mapid=" + ids).load();
//        }
//
//    }else{
//        lwalert("tipModal", 1, "请选择仓库再进行查看!");
//    }
//}

/**
 * 填充到HTML表单
 */
function setFormValue(data) {
	html = "";
	resetForm();

	for ( var item in data) {
		$("#" + item).val(data[item]);
		//        if(item=="type"){
		//             html += "<option value='"+data[item]+"'>"+data.typename+"</option>";
		//            $("#type").html(html);
		//    }
	}
}


//刷新当前节点
function refreshNode() {
  /*根据 treeId 获取 zTree 对象*/
  var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
  type = "refresh",
  silent = false,
  /*获取 zTree 当前被选中的节点数据集合*/
  nodes = zTree.getSelectedNodes();
  /*强行异步加载父节点的子节点。[setting.async.enable = true 时有效]*/
  zTree.reAsyncChildNodes(nodes[0], type, silent);
}
//刷新当前节点父节点
function refreshParentNode() {
  var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
  type = "refresh",
  silent = false,
  nodes = zTree.getSelectedNodes();
  /*根据 zTree 的唯一标识 tId 快速获取节点 JSON 数据对象*/
  var parentNode = zTree.getNodeByTId(nodes[0].parentTId);
  /*选中指定节点*/
  zTree.selectNode(parentNode);
  zTree.reAsyncChildNodes(parentNode, type, silent);
}

//function refresh() {
//	var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
//	var nodes = treeObj.getSelectedNodes();
//
//	if (nodes.length > 0 && !nodes[0].isParent) {
//		var node = nodes[0].getParentNode();
//		treeObj.reAsyncChildNodes(node[0], "refresh");
//	} else if (nodes.length > 0 && ope == "updateConpanyMap") {
//		var node = nodes[0].getParentNode();
//		if (node == null) {
//			treeObj.reAsyncChildNodes(nodes[0], "refresh");
//		} else {
//			treeObj.reAsyncChildNodes(node, "refresh");
//		}
//	} else if (nodes.length > 0) {
//		treeObj.reAsyncChildNodes(nodes[0], "refresh");
//	} else {
//		treeObj.reAsyncChildNodes(null, "refresh");
//	}
//}

var saveCompanyMap = function() {

	$("#type").prop("disabled", false);
	var form = $("#companyMapForm").serializeArray();
	$("#companyMapForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#companyMapForm').data('bootstrapValidator').isValid()) { // 返回true、false
		var formData = formatFormJson(form);
		$.ajax({
			type : "POST",
			url : "../../../"+ln_project+"/companyMap",
			data : {
				"method" : "updateCompanyMap",
				"formData" : formData,
				"pmapid" : pmapid,
				"levels" : levels
			},
			dataType : "text",
			async : false,
			success : function(data) {

				var flag = com.leanway.checkLogind(data);

				if (flag) {

					var tempData = $.parseJSON(data);
					if (tempData.status == "success") {
						com.leanway.formReadOnly("companyMapForm");
						refreshNode();//刷新节点
						onClick();//再次出发点击节点事件
						$("#saveOrUpdate").prop("disabled", true);
						html = "";
						lwalert("tipModal", 1, tempData.info);
					} else {
						lwalert("tipModal", 1, tempData.info);
					}

				}
			}
		});
	}
}



/**
 * 重置表单
 *
 */
var resetForm = function() {
	$('#companyMapForm').each(function(index) {
		$('#companyMapForm')[index].reset();
	});
	mapid1 = "";
	$("#mapid").val("");
	//    $("#companyMapForm").data('bootstrapValidator').resetForm();

}
// 格式化form数据
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

function updateNodes(highlight) {
	var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
	if (nodes == undefined || nodes == "undefined") {
		nodes = treeObj.getNodes();
	}
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].highlight = highlight;
		treeObj.updateNode(nodes[i]);
	}
}
