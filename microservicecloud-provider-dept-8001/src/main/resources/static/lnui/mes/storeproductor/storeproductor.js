var clicktime = new Date();
var cTable,employeeTable,saveEmployeeTable,viewEmployeeTable;
var reg=/,$/gi;
var readOnlyObj = [{"id":"ismultibarcode","type":"radio"},{"id":"isnegativestock","type":"radio"},];
var searchValue="";
$ ( function () {
    initBootstrapValidator()
    cTable = initRelateTable();
    getCodeMap("serialnumber","mapproductor","serialnumber");
    getCodeMap("batch","mapproductor","batch");
    getUnits("stockunits","");
    getUnits("packunits","");
    getUnits("purchaseunits","");
    getUnits("expirationunits","时间单位");

    com.leanway.formReadOnly("mapProductorForm",readOnlyObj);
    com.leanway.enterKeyDown("searchRelateValue", searchProductors);
})

function initBootstrapValidator() {
    $('#mapProductorForm').bootstrapValidator(
            {
                excluded : [ ':disabled' ],
                fields : {
                    maxstocknumber : {
                        validators : {
                            notEmpty : {},
                            regexp : com.leanway.reg.fun(
                                    com.leanway.reg.decimal.time,
                                    com.leanway.reg.msg.time)

                        }
                    },
                    minstocknumber : {
                        validators : {
                            notEmpty : {},
                            regexp : com.leanway.reg.fun(
                                    com.leanway.reg.decimal.time,
                                    com.leanway.reg.msg.time)

                        }
                    },
                    safetystocknumber : {
                        validators : {
                            notEmpty : {},
                            regexp : com.leanway.reg.fun(
                                    com.leanway.reg.decimal.time,
                                    com.leanway.reg.msg.time)

                        }
                    },
                    batch : {
                        validators : {
                            notEmpty : {},

                        }
                    },
                    serialnumber : {
                        validators : {
                            notEmpty : {},

                        }
                    },
                    qualitycontrol : {
                        validators : {
                            notEmpty : {},

                        }
                    },
                    expiration: {
                        validators : {
                            regexp : com.leanway.reg.fun(
                                    com.leanway.reg.decimal.time,
                                    com.leanway.reg.msg.time)

                        }
                    },
                    packunitscenvert: {
                        validators : {
                            regexp : com.leanway.reg.fun(
                                    com.leanway.reg.decimal.time,
                                    com.leanway.reg.msg.time)

                        }
                    },
                }
            });
}

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

//初始化数据表格
var initRelateTable = function() {
    var table = $('#contactInfo')
    .DataTable(
            {
                "ajax" : "../../../../"+ln_project+"/mapProductor?method=queryRelateProductors",
                //  "iDisplayLength" : "10",
                'bPaginate' : true,
                "bDestory" : true,
                "bRetrieve" : true,
                "bFilter" : false,
                "bSort" : false,
                "scrollY":"57vh",
                "bAutoWidth": true,  //宽度自适应
                "bProcessing" : true,
                "bServerSide" : true,
                'searchDelay' : "5000",
                "aoColumns" : [
                               {
                                   "mDataProp": "mapproductorid",
                                   "fnCreatedCell" : function(nTd, sData,
                                           oData, iRow, iCol) {
                                       $(nTd)
                                       .html("<div id='stopPropagation" + iRow +"'>"
                                               +"<input class='regular-checkbox' type='checkbox' id='"
                                               + sData
                                               + "' name='checkListTwo' value='"
                                               + sData
                                               + "'><label for='"
                                               + sData
                                               + "'></label> </div>");
                                       com.leanway.columnTdBindSelectNew(nTd,"contactInfo","checkListTwo");
                                   }
                               },
                               {"mDataProp": "name" },
                               {"mDataProp": "productorname"},
                               {"mDataProp": "productordesc" },
                               {"mDataProp": "version" },
                               {
                                   "mDataProp": "rolename",
                                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                                       if (sData != "false") {
                                           $(nTd).html("<a  style=\"cursor:pointer;\" onclick=\"viewRole('" + sData + "');\"  id=\"viewRole" + iRow+ "\">查看</a>");
                                       } else {
                                           $(nTd).html("");
                                       }

                                   }
                               },
                               ],
                               "oLanguage" : {
                                   "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                               },
                               "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                               "fnDrawCallback" : function(data) {

                                   com.leanway.getDataTableFirstRowId("contactInfo",
                                           loadProductor, "more","checkListTwo");
                                   //点击事件
                                   com.leanway.dataTableClickMoreSelect("contactInfo","checkListTwo",false,cTable,loadProductor,undefined,undefined,"checkAllTwo");

                                   com.leanway.dataTableCheckAllCheck('contactInfo', 'checkAllTwo', 'checkListTwo');
                               },

            }).on('xhr.dt', function (e, settings, json) {
                com.leanway.checkLogind(json);
            } );;

    return table;
}


var loadProductor = function(mapProductorid){
    com.leanway.formReadOnly("mapProductorForm",readOnlyObj);
    $.ajax({
        type : "get",
        url : "../../../../"+ln_project+"/mapProductor",
        data : {
            method : "queryMapProductorObject",
            "mapProductorid" : mapProductorid,
        },
        dataType : "json",
        success : function(data) {
            var flag =  com.leanway.checkLogind(data);

            if(flag){
                setFormValue(data);
            }

        },

    });
}
function setFormValue(data) {
    resetForm();
    for ( var item in data) {
        if(item=="ismultibarcode"){
            $("input[type=radio][name=" + item + "][value=" + data[item] + "]").prop('checked',true);
        }
        if(item=="isnegativestock"){
            $("input[type=radio][name=" + item + "][value=" + data[item] + "]").prop('checked',true);
        }
        $("#"+item).val(data[item]);
    }

}

function resetForm(){

    $('#mapProductorForm').each(function(index) {
        $('#mapProductorForm')[index].reset();
    });

    $("#mapProductorForm").data('bootstrapValidator').resetForm();

}

function updateMapProductor(){
    var data = cTable.rows('.row_selected').data();
    if(data.length == 0) {
        lwalert("tipModal", 1, "请选择数据进行修改!");
    }else if(data.length>1){
        lwalert("tipModal", 1, "只能选择一条数据进行修改!");
    }else{
        com.leanway.removeReadOnly("mapProductorForm",readOnlyObj);
        $("#stockunits").prop("disabled",true);
        $("#packunits").prop("disabled",true);
        $("#purchaseunits").prop("disabled",true);
        $("#productorname").prop("readonly",true);
        $("#productordesc").prop("readonly",true);
        $("#saveOrUpdate").prop("disabled",false);
    }
}

function saveMapProductor(){
    $("#stockunits").prop("disabled",false);
    $("#packunits").prop("disabled",false);
    $("#purchaseunits").prop("disabled",false);
    $("#mapProductorForm").data('bootstrapValidator').validate(); // 提交前先验证
    if ($('#mapProductorForm').data('bootstrapValidator').isValid()) { // 返回true、false
        var form = $("#mapProductorForm").serializeArray();
        var formData = formatFormJson(form);
        $.ajax({
            type : "post",
            url : "../../../../"+ln_project+"/mapProductor",
            data : {
                method : "updateMapProductor",
                "formData" : formData,
            },
            dataType : "json",
            success : function(data) {
                var flag =  com.leanway.checkLogind(data);

                if(flag){
                    if(data.status=="success"){
                        com.leanway.formReadOnly("mapProductorForm",readOnlyObj);
                        cTable.ajax.reload();
                    }
                    lwalert("tipModal", 1, data.info);

                }

            },

        });
    }

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

    /**
     * 关联雇员
     */
var showEmployee = function ( ) {
    $("#employeeSearchValue").val("");
    //获取checkbox值
    var value = com.leanway.getDataTableCheckIds("checkListTwo");
    var values = value.split(",");
    if (value=="") {
        lwalert("tipModal", 1, "请选择产品关联雇员!");
        return;
    } else if (values.length > 1){
        lwalert("tipModal", 1, "只能选择一个产品进行关联！");
        return;
    } else {

        tableStatus = false;

        // 弹出modal
        $('#employeeModal').modal({backdrop: 'static', keyboard: true});

        var ids = com.leanway.getDataTableCheckIds("checkListTwo");

        if (employeeTable == null || employeeTable == "undefined" || typeof(employeeTable) == "undefined") {
            employeeTable = initEmployeeTable(ids);

        } else {
            employeeTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryEmployees&flag=1").load();
        }

        if (saveEmployeeTable == null || saveEmployeeTable == "undefined" || typeof(saveEmployeeTable) == "undefined") {
            saveEmployeeTable = initSaveEmployeeTable(ids);

        } else {
            saveEmployeeTable.ajax.url("../../../../"+ln_project+"/mapProductor?method=queryEmployees&maproductorid="+ids).load();
        }

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

//初始化数据表格
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
                              com.leanway.columnTdBindSelectNew(nTd,"employeeTables","employeeCheckList");
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

var initSaveEmployeeTable = function (ids) {
    //com.leanway.checkSession();
    var table = $('#saveEmployeeTables').DataTable( {
        "ajax": '../../../../'+ln_project+'/mapProductor?method=queryEmployees&maproductorid='+ids,
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

var initViewEmployeeTable = function (id) {

    //com.leanway.checkSession();
    var table = $('#viewEmployeeTables').DataTable( {
        "ajax": '../../../../'+ln_project+'/mapProductor?method=queryEmployees&maproductorid='+id,
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
    // 派工单数据
    var data = getDataTableData(saveEmployeeTable);

    var formData = "{\"listEmployee\": "+ data + ",\"mapproductorid\":\"" + ids + "\"}";

    $.ajax ( {
        type : "post",
        url : "../../../../"+ln_project+"/mapProductor",
        data : {
            "method" : "saveMapProductorEmployee",
            "paramData" : formData
        },
        dataType : "json",
        async : false,
        success : function ( text ) {

            var flag =  com.leanway.checkLogind(text);

            if(flag){

                if (text.status == "success") {
                    $('#employeeModal').modal('hide');
                    cTable.ajax.reload();
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

/**
 * 查看雇员
 */
var viewEmployee = function ( maproductorid ) {
    // 弹出modal
    $('#veiwEmployeeModal').modal({backdrop: 'static', keyboard: true});

    if (viewEmployeeTable == null || viewEmployeeTable == "undefined" || typeof(viewEmployeeTable) == "undefined") {
        viewEmployeeTable = initViewEmployeeTable(maproductorid);

    } else {
        viewEmployeeTable.ajax.url("../../../../"+ln_project+"/mapProductor?method=queryEmployees&maproductorid=" + maproductorid).load();
    }


}

var searchProductors = function(){
    var searchValue = $("#searchRelateValue").val();

    cTable.ajax.url("../../../../"+ln_project+"/mapProductor?method=queryRelateProductors&searchValue="+searchValue).load();
}

/**
 * 关联角色 0:正常一条关联，1：选中的产品关联，2：所有产品关联
 */
var showRole = function ( type ) {
	
    //获取checkbox值
    var value = com.leanway.getDataTableCheckIds("checkListTwo");
    var values = value.split(",");
    if (value=="" && (type == 0 || type == 1)) {
        lwalert("tipModal", 1, "请选择产品关联角色!");
        return;
    } else if (values.length > 1 && (type == 0)){
        lwalert("tipModal", 1, "只能选择一个产品进行关联！");
        return;
    } else {
    	
    	if(type==3){
    		  // 产品类型
//    	    productorTypeId = $("#productortypeid").val();
    	    searchValue = $("#searchRelateValue").val();
    	    
//    		if (productorTypeId != null && productorTypeId != "" && typeof(productorTypeId) != "undefined" && productorTypeId != undefined) {
//    			productorTypeId = productorTypeId.toString();
//    		}

    	}
    	
    	
    	saveRoleType = type;

        tableStatus = false;

        // 弹出modal
        $('#roleTree').modal({backdrop: 'static', keyboard: true});
        
        $("#saveMapproductorRole").show();

    	//获取选择行的相对应的值
//    	var treeUserId = oTable.rows('.row_selected').data()[0].userId;
//
//    	var compId =  oTable.rows('.row_selected').data()[0].compId;
    	
    	var ids = com.leanway.getDataTableCheckIds("checkListTwo");

		// 弹出modal
		$('#roleTree').modal({backdrop: 'static', keyboard: true});
		//调用显示树
		 $.fn.zTree.init($("#tree"),  {
		        check : {
		        	//设置 zTree 的节点上是否显示 checkbox / radio 默认值: false
		            enable : true,
		            //勾选框类型(checkbox 或 radio）[setting.check.enable = true 时生效]默认值："checkbox"
		            chkStyle :"checkbox",
		            //勾选 checkbox 对于父子节点的关联关系。[setting.check.enable = true 且 setting.check.chkStyle = "checkbox" 时生效] 默认值：{ "Y": "ps", "N": "ps" }
		            chkboxType : { "Y": "s", "N": "s" }
		        },
		        async: {
		        	//设置 zTree 是否开启异步加载模式默认值：false
		        	enable : true,
		        	url : "../../../../"+ln_project+"/role?method=getAllRolesTreeList" ,
		        	//异步加载时需要自动提交父节点属性的参数。[setting.async.enable = true 时生效] 默认值：[ ]
		        	autoParam : ["levels"],
		        	//Ajax 请求提交的静态参数键值对。[setting.async.enable = true 时生效] 默认值：[ ]
		        	otherParam : {"mapproductorid" : ids}
		        },
		        view: {
		        	//双击节点时，是否自动展开父节点的标识 默认值: true
		            dblClickExpand: false,
		            //设置 zTree 是否显示节点之间的连线。 默认值：true
		            showLine: true,
		            //设置是否允许同时选中多个节点。  默认值: true
		            selectedMulti: false
		        },
		        data: {
		        	//name:zTree节点数据保存节点名称的属性名称。
		        	key: { name : "rolename" },
		            simpleData : {
		            	/*确定 zTree 初始化时的节点数据、异步加载时的节点数据、或 addNodes 方法中输入的 newNodes 数据是否采用简单数据模式 (Array)
		            	不需要用户再把数据库中取出的 List 强行转换为复杂的 JSON 嵌套格式  默认值：false*/
		                enable : true,
		                //节点数据中保存唯一标识的属性名称。[setting.data.simpleData.enable = true 时生效]  默认值："id"
		                idKey : "roleid",
		                //节点数据中保存其父节点唯一标识的属性名称。[setting.data.simpleData.enable = true 时生效]  默认值："pId"
		                pIdKey :  "pid",
		                //用于修正根节点父节点数据，即 pIdKey 指定的属性值。[setting.data.simpleData.enable = true 时生效] 默认值：null
		                rootPId : ""
		            }
		        },
		        callback: {

		        /*	用于捕获异步加载正常结束的事件回调函数  默认值：null
		        	如果设置了 setting.callback.beforeAsync 方法，且返回 false，将无法触发 onAsyncSuccess / onAsyncError 事件回调函数。
		        	*/
		            onAsyncSuccess: onAsyncSuccess,
		            //用于捕获节点被点击的事件回调函数
		            onClick:onClick
		      }
		});
 

    }



  }

//选中树节点
function onClick(e, treeId, treeNode) {
	//选中节点
	if ( treeNode.checked ) {
		//根据 treeId 获取 zTree 对象的方法。       勾选 或 取消勾选 单个节点。参数(treeNode, checked, checkTypeFlag, callbackFlag)
		//参数说明(需要勾选 或 取消勾选 的节点数据,checked = true 表示勾选节点,checkTypeFlag = true 表示按照 setting.check.chkboxType 属性进行父子节点的勾选联动操作
		//callbackFlag = true 表示执行此方法时触发 beforeCheck & onCheck 事件回调函数  省略此参数，等同于 false)
		$.fn.zTree.getZTreeObj("tree").checkNode(treeNode, false, false);
	} else {
		$.fn.zTree.getZTreeObj("tree").checkNode(treeNode, true, true);
	}

}

// 树形节点一步加载完成
function onAsyncSuccess(event, treeId, treeNode, msg) {

/*		try {
		if ( typeof( treeNode ) == "undefined" ) {
			var zTree = $.fn.zTree.getZTreeObj(treeId);
			var rootNode = zTree.getNodes()[0];
		    zTree.selectNode(rootNode);
		    zTree.expandNode(rootNode, true);
		     showMstDataInGrid({folderguid: nodes[0].GUID});
		}
	} catch (e) {
	}*/

	try {
		if ( typeof( treeNode ) == "undefined" ) {
			//加载节点。
			var zTree = $.fn.zTree.getZTreeObj(treeId);
			var rootNode = zTree.getNodes();

			if (rootNode != null && rootNode.length > 0) {
				for (var i = 0;i<rootNode.length; i ++) {
					//选中指定节点
				    zTree.selectNode(rootNode[i]);
				    // 展开 /折叠 指定的节点  参数(treeNode, expandFlag, sonSign(默认 false), focus(默认true), callbackFlag(默认 false))
				    zTree.expandNode(rootNode[i], true);
				}
			}
		}
	} catch (e) {
	}

}

// 保存库存产品与角色关联
function saveRole() {


		var checkRoleIds = "";
	
		var zTree = $.fn.zTree.getZTreeObj("tree");
		var nodes = zTree.getCheckedNodes(true);
	
		for (var i = 0;i < nodes.length; i++) {
			checkRoleIds += nodes[i].roleid +",";
		}
	
//		var userId = oTable.rows('.row_selected').data()[0].userId;
	
		if ( checkRoleIds == "" ) {
//			var userName =  oTable.rows('.row_selected').data()[0].userName;
			lwalert("tipModal", 2, "确定清空选中产品地点的角色吗?","isSureSaveMapProductorRole()");
	
	//		 if (confirm("确定清空选中用户[" + userName + "]的角色吗?"))  {
	//			 ajaxSaveUserRole(userId, checkRoleIds);
	//		 }
	
		} else {
	
			 ajaxSaveMapProductorRole(checkRoleIds);
	
		}


}


function isSureSaveMapProductorRole(){

	var checkRoleIds = "";

	var zTree = $.fn.zTree.getZTreeObj("tree");
	var nodes = zTree.getCheckedNodes(true);

	for (var i = 0;i < nodes.length; i++) {
		checkRoleIds += nodes[i].roleid +",";
	}

	ajaxSaveMapProductorRole(checkRoleIds);
}
var ajaxSaveMapProductorRole = function (checkRoleIds) {

	var ids = com.leanway.getDataTableCheckIds("checkListTwo");

    //查询条件searchValue
    var formData = "{\"roleids\": \""+ checkRoleIds + "\",\"mapproductorid\":\"" + ids + "\",\"saveRoleType\":" + saveRoleType +",\"searchValue\":\"" + searchValue + "\"}";
	
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/mapProductor",
		data : {   //传输到后台的数据，通过getParameter()获取。
			"method" : "saveMapProductorRole",
			"paramData" : formData,
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				if ($.trim(text.status)  == "success") {
					$('#roleTree').modal('hide');
					 cTable.ajax.reload(null, false);
				} else {
//					alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");
				}

			}

		}
	});

}

/**
 * 查看角色
 */
var viewRole = function ( maproductorid ) {
	
    // 弹出modal
    $('#roleTree').modal({backdrop: 'static', keyboard: true});
    
    $("#saveMapproductorRole").hide();
	//调用显示树
	 $.fn.zTree.init($("#tree"),  {
	        check : {
	        	//设置 zTree 的节点上是否显示 checkbox / radio 默认值: false
	            enable : true,
	            //勾选框类型(checkbox 或 radio）[setting.check.enable = true 时生效]默认值："checkbox"
	            chkStyle :"checkbox",
	            //勾选 checkbox 对于父子节点的关联关系。[setting.check.enable = true 且 setting.check.chkStyle = "checkbox" 时生效] 默认值：{ "Y": "ps", "N": "ps" }
	            chkboxType : { "Y": "s", "N": "s" }
	        },
	        async: {
	        	//设置 zTree 是否开启异步加载模式默认值：false
	        	enable : true,
	        	url : "../../../../"+ln_project+"/role?method=getAllRolesTreeList" ,
	        	//异步加载时需要自动提交父节点属性的参数。[setting.async.enable = true 时生效] 默认值：[ ]
	        	autoParam : ["levels"],
	        	//Ajax 请求提交的静态参数键值对。[setting.async.enable = true 时生效] 默认值：[ ]
	        	otherParam : {"mapproductorid" : maproductorid}
	        },
	        view: {
	        	//双击节点时，是否自动展开父节点的标识 默认值: true
	            dblClickExpand: false,
	            //设置 zTree 是否显示节点之间的连线。 默认值：true
	            showLine: true,
	            //设置是否允许同时选中多个节点。  默认值: true
	            selectedMulti: false
	        },
	        data: {
	        	//name:zTree节点数据保存节点名称的属性名称。
	        	key: { name : "rolename" },
	            simpleData : {
	            	/*确定 zTree 初始化时的节点数据、异步加载时的节点数据、或 addNodes 方法中输入的 newNodes 数据是否采用简单数据模式 (Array)
	            	不需要用户再把数据库中取出的 List 强行转换为复杂的 JSON 嵌套格式  默认值：false*/
	                enable : true,
	                //节点数据中保存唯一标识的属性名称。[setting.data.simpleData.enable = true 时生效]  默认值："id"
	                idKey : "roleid",
	                //节点数据中保存其父节点唯一标识的属性名称。[setting.data.simpleData.enable = true 时生效]  默认值："pId"
	                pIdKey :  "pid",
	                //用于修正根节点父节点数据，即 pIdKey 指定的属性值。[setting.data.simpleData.enable = true 时生效] 默认值：null
	                rootPId : ""
	            }
	        },
	        callback: {

	        /*	用于捕获异步加载正常结束的事件回调函数  默认值：null
	        	如果设置了 setting.callback.beforeAsync 方法，且返回 false，将无法触发 onAsyncSuccess / onAsyncError 事件回调函数。
	        	*/
	            onAsyncSuccess: onAsyncSuccess,
	            //用于捕获节点被点击的事件回调函数
	            onClick:onClick
	      }
	});

}

