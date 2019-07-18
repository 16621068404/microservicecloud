//改变checkbox形状
var clicktime = new Date();
var ope="addEquipConfig"
//数据table
var oTable;
$(function() {
    initBootstrapValidator();
    })
function initBootstrapValidator() {
    $('#equipConfigForm').bootstrapValidator(
            {
                excluded : [ ':disabled' ],
                fields : {
                    ip : {
                        validators : {
                            notEmpty : {},
                            stringLength : {
                                min : 2,
                                max : 20
                            }
                        }
                    },
                    domain : {
                        validators : {
                            notEmpty : {},
                            stringLength : {
                                min : 2,
                                max : 20
                            }
                        }
                    },
                }
            });
}
var readOnlyObj = [{"id":"saveOrUpdate","type":"button"}];
$ ( function () {
    //checkSession();
    // 初始化对象
    com.leanway.loadTags();
    // 加载datagrid
    oTable = initTable();
//  com.leanway.dataTableCheckAll("generalInfo", "checkAll", "checkList");
    com.leanway.formReadOnly("equipConfigForm",readOnlyObj);

    // enter键时候触发查询
    com.leanway.enterKeyDown("searchValue", searchEquipConfig);

});

var searchEquipConfig = function () {

    var searchVal = $("#searchValue").val();

    oTable.ajax.url("../../../../"+ln_project+"/bomCode?method=queryBomCodeList&searchValue=" + searchVal).load();
}

//初始化数据表格
var initTable = function () {

    var table = $('#generalInfo').DataTable( {
            "ajax": "../../../../"+ln_project+"/equipConfig?method=queryEquipConfigList",
            // "iDisplayLength" : "6",
            'bPaginate': true,
            "bDestory": true,
            "bRetrieve": true,
            "bFilter":false,
            "bSort": false,
            "bProcessing": true,
            "bServerSide": true,
            'searchDelay':"5000",
             "aoColumns": [
                   {
                       "mDataProp": "equipconfigid",
                       "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                            $(nTd).html("<div id='stopPropagation" + iRow +"'>"
                                       +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                    + "' name='checkList' value='" + sData
                                    + "'><label for='" + sData
                                    + "'></label>");
                             com.leanway.columnTdBindSelectNew(nTd,"generalInfo","checkList");
                       }
                   },
                   {"mDataProp": "ip"},
                   {"mDataProp": "domain"},
              ],
             "oLanguage" : {
                 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
             },
             "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
             "fnDrawCallback" : function(data) {
                    com.leanway.getDataTableFirstRowId("generalInfo", ajaxLoadEquipConfig,"more", "checkList");
                     com.leanway.dataTableClickMoreSelect("generalInfo", "checkList", false,
                             oTable, ajaxLoadEquipConfig,undefined,undefined,"checkAll");
                     com.leanway.dataTableCheckAllCheck('generalInfo', 'checkAll', 'checkList');
                }
        } ).on('xhr.dt', function (e, settings, json) {
            com.leanway.checkLogind(json);
        } );

    return table;
}

// 查询到右边显示
var ajaxLoadEquipConfig =function (equipconfigid) {
    $.ajax ( {
        type : "post",
        url : "../../../../"+ln_project+"/equipConfig",
        data : {
            "method" : "queryEquipConfigObject",
            "equipconfigid" : equipconfigid,
        },
        dataType : "text",
        async : false,
        success : function ( data ) {

            var flag =  com.leanway.checkLogind(data);
            if(flag){

                var tempData = $.parseJSON(data);
                setFormValue(tempData.resultObj);
            }
        }
    });
    com.leanway.formReadOnly("equipConfigForm",readOnlyObj);
}
// 填充到HTML表单
function setFormValue (data) {
    resetForm();
    for (var item in data) {
          $("#" + item).val(data[item]);
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



/**
 * 新增
 *
 * */
var addEquipConfig = function() {
    //checkSession();
    ope="addEquipConfig";
    // 清空表单
    resetForm();
    com.leanway.removeReadOnly("equipConfigForm",readOnlyObj);
    com.leanway.dataTableUnselectAll("generalInfo", "checkList");
    com.leanway.dataTableUnselectAll("generalInfo", "checkAll");
    //初始化省

    com.leanway.clearTableMapData( "generalInfo" );
}

/**
 * 修改数据
 *
 * */
function updateEquipConfig() {
    //checkSession();
    ope="updateEquipConfig";
    var data = oTable.rows('.row_selected').data();
    if(data.length == 0) {
//      alert("请选择要修改的物料清单！");
        lwalert("tipModal", 1, "请选择要修改的设备监控配置")
    } else if(data.length > 1) {
//      alert("只能选择一个物料清单进行修改！");
        lwalert("tipModal", 1, "只能选择一个设备监控配置进行修改")
    }else{
        com.leanway.removeReadOnly("equipConfigForm",readOnlyObj);
    }
}

/**
 * 往里面存数据
 * */

var saveEquipConfig= function() {
    //checkSession();
    var form  = $("#equipConfigForm").serializeArray();
    //后面确认时应 检测模具编号是否已存在
    var formData = formatFormJson(form);
    $("#equipConfigForm").data('bootstrapValidator').validate(); // 提交前先验证
    if ($('#equipConfigForm').data('bootstrapValidator').isValid()) { // 返回true、false
                $.ajax ( {
                    type : "POST",
                    url : "../../../../"+ln_project+"/equipConfig",
                    data : {
                        "method":ope,
                        "formData" : formData,
                    },
                    dataType : "text",
                    async : false,
                    success : function ( data ) {

                        var flag =  com.leanway.checkLogind(data);

                        if(flag){


                            var tempData = $.parseJSON(data);
                            if (tempData.status == "success") {

                                com.leanway.clearTableMapData( "generalInfo" );

                                com.leanway.formReadOnly("equipConfigForm",readOnlyObj);

                                if(ope=="addEquipConfig"){
                                    oTable.ajax.reload();
                                }else{
                                    oTable.ajax.reload(null,false);
                                }
                                lwalert("tipModal", 1, tempData.info);
                            } else {
                    //              alert("操作失败");
                                lwalert("tipModal", 1, tempData.info);
                            }
                        }
                    }
                });
    }
}

function deleteEquipConfig(type){

    if (type == undefined || typeof(type) == "undefined") {
        type = 2;
    }

    var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
    if (ids.length != 0) {

        var msg = "确定删除选中的" + ids.split(",").length + "条设备监控配置?";

        lwalert("tipModal", 2, msg ,"isSure(" + type + ")");
        return;
    } else {
//      alert("至少选择一条记录进行删除操作");
        lwalert("tipModal", 1, "至少选择一条记录进行删除操作");
    }
}

function isSure(type) {

    var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
    deleteAjax(ids);
}
//删除物料追踪单
var deleteAjax = function(ids) {
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/equipConfig?method=deleteEquipConfig",
        data : {
            "equipconfigids" : ids
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
                    oTable.ajax.reload(null,false);

                }
                lwalert("tipModal", 1, tempData.info);
            }
        }
    });
}
var resetForm = function () {
    $( '#equipConfigForm' ).each( function ( index ) {
        $('#equipConfigForm')[index].reset( );
    });
}

