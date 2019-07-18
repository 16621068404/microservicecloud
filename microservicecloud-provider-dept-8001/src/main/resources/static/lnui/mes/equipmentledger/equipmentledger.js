var clicktime = new Date();

$ ( function () {

    // 初始化对象
    com.leanway.loadTags();
    com.leanway.formReadOnly("equipmentForm");
    initTimePickYmd("guaranteedate");
    // 加载datagrid
    oTable = initTable();
    queryWorkCenterGroupList();
    initBootstrapValidator();
    // 全选
//  com.leanway.dataTableCheckAll("generalInfo", "checkAll", "checkList");
    com.leanway.enterKeyDown("searchValue", searchEquipment);
    //将设备状态改为不可改变
    $("#equipstatusid0").prop("disabled",true);
    $("#equipstatusid1").prop("disabled",true);
   /* if (window.screen.availHeight <= 768) {

		 $("#guaranteedatelabel").html('<span title="保修开始日期">保修日期</span>');
	 }*/

})

function initBootstrapValidator() {
    $('#equipmentForm').bootstrapValidator(
            {
                excluded : [ ':disabled' ],
                fields : {
                    guaranteedays : {
                        validators : {
                            regexp : com.leanway.reg.fun(
                                    com.leanway.reg.decimal.number,
                                    com.leanway.reg.msg.number)
                        }
                    },
                }
            });
}

function queryWorkCenterGroupList() {
    $.ajax({
        type : "get",
        url : "../../../../"+ln_project+"/workCenter",
        data : {
            method : "queryWorkCenterGroupList",
            conditions : "{}"
        },
        dataType : "json",
        success : function(data) {

            var flag =  com.leanway.checkLogind(data);

            if(flag){
                setWorkCenterGroup(data.workCenterGroupResult);

            }
        },
        error : function(data) {

        }
    });
}
var setWorkCenterGroup = function(data) {
    var html = "";
    for ( var i in data) {
        html += "<option value=" + data[i].groupid + ">" + data[i].groupname
                + "</option>";
    }
    $("#groupid").html(html);
}
function queryShutdownReasonList(equipmentid){
    $.ajax({
        type : "get",
        url : "../../../../"+ln_project+"/workCenter",
        data : {
            method : "queryShutDownReasonList",
            "equipmentid" : equipmentid
        },
        dataType : "json",
        async : false,
        success : function(data) {

            var flag =  com.leanway.checkLogind(data);
            if(flag){
                setShutdownReason(data);
            }
        },
        error : function(data) {

        }
    });
}
var setShutdownReason = function(data) {
    var html = "";
    html += "<option value=''>======请选择======</option>";
    for ( var i in data) {
        html += "<option value=" + data[i].shutdownreasonid + ">" + data[i].reasoncode
                + "</option>";
    }
    $("#shutdownreasonid").html(html);
}
// 初始化数据表格
    var initTable = function () {

        var table = $('#generalInfo').DataTable( {
                "ajax": "../../../../"+ln_project+"/workCenter?method=queryEquipmentList",
                 //"iDisplayLength" : "6",
                'bPaginate': true,
                "bDestory": true,
                "bRetrieve": true,
                "bFilter":false,
                "bSort": false,
                "bProcessing": true,
                "bServerSide": true,
                'searchDelay':"5000",
                "fixedHeader": true,
                "columns": [
                    {"data" : "equipmentid"},
                    { "data": "serialnumber" },
                    { "data": "centername" },
                    { "data": "groupname" }
                 ],
                 "aoColumns": [
                       {
                           "mDataProp": "equipmentid",
                           "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                               $(nTd).html("<div id='stopPropagation" + iRow +"'>"
                                       +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                       + "' name='checkList' value='" + sData
                                       + "'><label for='" + sData
                                       + "'></label>");
                             com.leanway.columnTdBindSelectNew(nTd,"generalInfo","checkList");
                           }
                       },
                       {"mDataProp": "serialnumber"},
                       {"mDataProp": "centername"},
                       {"mDataProp": "groupname"},
                  ],
                 "oLanguage" : {
                     "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                 },
                 "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                 "fnDrawCallback" : function(data) {
                        com.leanway.getDataTableFirstRowId("generalInfo", ajaxLoadEquipment,"more","checkList");
                         com.leanway.dataTableClickMoreSelect("generalInfo", "checkList", false,
                                 oTable, ajaxLoadEquipment,undefined,undefined,"checkAll");

                         com.leanway.dataTableCheckAllCheck('generalInfo', 'checkAll', 'checkList');
//                         $('input[type="checkbox"]').icheck({
//                             labelHover : false,
//                             cursor : true,
//                             checkboxClass : 'icheckbox_flat-blue',
//                             radioClass : 'iradio_flat-blue'
//                         });
                    }
            } ).on('xhr.dt', function (e, settings, json) {
                com.leanway.checkLogind(json);
            } );

        return table;
    }

/**
 * 查询到右边显示
 * */
var ajaxLoadEquipment =function (equipmentid) {
    queryShutdownReasonList(equipmentid);
    $.ajax ( {
        type : "post",
        url : "../../../../"+ln_project+"/workCenter",
        data : {
            "method" : "queryEquipmentObject",
            "equipmentid" : equipmentid,
        },
        dataType : "text",
        async : false,
        success : function ( data ) {

            var flag =  com.leanway.checkLogind(data);

            if(flag){
                var tempData = $.parseJSON(data);
                setFormValue(tempData);
                com.leanway.formReadOnly("equipmentForm");

            }
        }
    });
    $("#saveOrUpdate").attr({
		"disabled" : "disabled"
	});
    //设置设备状态不可点
    $("#equipstatusid0").prop("disabled",true);
    $("#equipstatusid1").prop("disabled",true);
}


/**
 * 填充到HTML表单
 * */
function setFormValue (data) {

    resetForm();

      for (var item in data) {
          if(item == "equipstatusid"){
              $("input[type=radio][name=" + item + "][value=" + data[item] + "]").prop('checked',true);
          }
          $("#" + item).val(data[item]);
      }

}

/**
 * 修改数据
 *
 * */
function updateEquipment() {

    var data = oTable.rows('.row_selected').data();
    if(data.length == 0) {
        lwalert("tipModal", 1, "请选择要修改的设备台账！");
    } else if(data.length > 1) {
        lwalert("tipModal", 1, "只能选择一个设备台账进行修改！");
    }else{
        com.leanway.removeReadOnly("equipmentForm");
        $("#serialnumber").prop("readonly",true);
        $("#shortname").prop("readonly",true);
        $("#equipmentnum").prop("readonly",true);
        $("#groupid").prop("disabled",true);
        $("#centername").prop("readonly",true);
        //将保存按钮可点
        $("#saveOrUpdate").removeAttr("disabled");
        //将设备状态改为可改变
        $("#equipstatusid0").prop("disabled",false);
        $("#equipstatusid1").prop("disabled",false);

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
 * 往里面存数据
 * */

var saveEquipment = function() {
    $("#groupid").prop("disabled",false);
    var form  = $("#equipmentForm").serializeArray();
    //后面确认时应 检测模具编号是否已存在
    var formData = formatFormJson(form);
    $("#equipmentForm").data('bootstrapValidator').validate(); // 提交前先验证
    if ($('#equipmentForm').data('bootstrapValidator').isValid()) { // 返回true、false
      /*  if($("input[name='equipstatusid']:checked").val()=="12"&&($("#shutdownreasonid").val()==""||$("#shutdownreasonid").val()==undefined||$("#shutdownreasonid").val()=="undefined")){
            lwalert("tipModal", 1, "请填写停机原因");
        }else{*/
        $.ajax ( {
                type : "POST",
                url : "../../../../"+ln_project+"/workCenter",
                data : {
                    "method":"updateEquipment",
                    "formData" : formData,
                },
                dataType : "text",
                async : false,
                success : function ( data ) {

                    var flag =  com.leanway.checkLogind(data);

                    if(flag){

                        var tempData = $.parseJSON(data);
                        if (tempData.status == "success") {
                            com.leanway.formReadOnly("equipmentForm");

                            com.leanway.clearTableMapData( "generalInfo" );

                            oTable.ajax.reload(null,false);


                        }
                        lwalert("tipModal", 1, tempData.info);

                    }
                }
            });
        /*}*/
    }
}

/**
 * 重置表单
 *
 * */
var resetForm = function ( ) {
    $( '#equipmentForm' ).each( function ( index ) {
        $('#equipmentForm')[index].reset( );
    });
    $("#equipmentForm").data('bootstrapValidator').resetForm();
}

var searchEquipment= function () {

    var searchVal = $("#searchValue").val();

    oTable.ajax.url("../../../../"+ln_project+"/workCenter?method=queryEquipmentList&searchValue=" + searchVal).load();
}
