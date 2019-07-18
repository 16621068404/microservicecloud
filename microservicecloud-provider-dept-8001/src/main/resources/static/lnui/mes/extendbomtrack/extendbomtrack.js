var clicktime = new Date();
$(function() {
    initBootstrapValidator();
})
function initBootstrapValidator() {
    $('#bomTrackForm').bootstrapValidator(
            {
                excluded : [ ':disabled' ],
                fields : {
                     productionorderid:{
                     validators : {
                     notEmpty : {},
                     }
                     },
                }
            });
}

var oTable;


$(function() {
   // checkSession("l69");
    // 初始化对象
    com.leanway.loadTags();
    com.leanway.formReadOnly("bomTrackForm");
    // 加载datagrid
    oTable = initTable();
    // 全选
    // com.leanway.dataTableCheckAll("generalInfo", "checkAll", "checkList");
    com.leanway.enterKeyDown("searchValue", searchBomTrack);
    $("#barcodevalue").prop("readOnly",true);
})

// 初始化数据表格
var initTable = function() {

    var table = $('#generalInfo')
            .DataTable(
                    {
                        "ajax" : "../../../../"+ln_project+"/bomTrack?method=queryExtendBomTrackList",
                        'bPaginate' : true,
                        "bDestory" : true,
                        "bRetrieve" : true,
                        "bFilter" : false,
                        "bSort" : false,
                        //"scrollX" : true,
                        "scrollY":"250px",
                        "bProcessing" : true,
                        "bServerSide" : true,
                        'searchDelay' : "5000",
                        "columns" : [ {
                            "data" : "trackid"
                        }, {

                            "data" : "tracknumber"
                        }, {
                            "data" : "productionnumber",
                        }, {
                            "data" : "receivingtime"
                        } ],
             "aoColumns": [
                   {
                       "mDataProp": "trackid",
                       "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                           $(nTd).html("<div id='stopPropagation" + iRow +"'>"
                                   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='checkList' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label>");
                         com.leanway.columnTdBindSelectNew(nTd,"generalInfo", "checkList");
                       }
                   },
                   {"mDataProp": "tracknumber"},
                   {"mDataProp": "productionnumber"},
                   {"mDataProp": "receivingtime"},
              ],

                        "oLanguage" : {
                            "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                        },
                        "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                        "fnDrawCallback" : function(data) {
                            com.leanway.getDataTableFirstRowId("generalInfo", ajaxLoadBomTrack,
                                    "more", "checkList");
                            com.leanway.dataTableClickMoreSelect("generalInfo", "checkList", false,
                                    oTable, ajaxLoadBomTrack,undefined,undefined,"checkAll");

                            com.leanway.dataTableCheckAllCheck('generalInfo', 'checkAll', 'checkList');
                            // $('input[type="checkbox"]').icheck({
                            // labelHover : false,
                            // cursor : true,
                            // checkboxClass : 'icheckbox_flat-blue',
                            // radioClass : 'iradio_flat-blue'
                            // });
                        }
                    }).on('xhr.dt', function (e, settings, json) {
        				com.leanway.checkLogind(json);
        			} );

    return table;
}

/**
 * 加载物料追踪单到右侧显示
 *
 * @param trackid
 */
function ajaxLoadBomTrack(trackid) {
    //checkSession("ajaxLoadBomTrack");
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/bomTrack?method=queryBomTrackObject",
        data : {
            "trackid" : trackid,
        },
        dataType : "text",
        async : false,
        success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

	            var tempData = $.parseJSON(data);
	            setFormValue(tempData.bomTrack.resultObj);
	            setTableValue2(tempData.bomTrackDetailList);

			}
        }
    });
    com.leanway.formReadOnly("bomTrackForm");
}

function deleteBomTrack() {


	colmap = tabmap.get("generalInfo");

    if (colmap!=undefined) {
        // var ids = str.substr(0, str.length - 1);
        // if (confirm("确定要删除选中的物料追踪单吗?")) {
        // deleteAjax(ids);
        // }
        lwalert("tipModal", 2, "你确定要删除吗", "isSure()");
    } else {
        // alert("至少选择一条记录进行删除操作");
        lwalert("tipModal", 1, "至少选择一条记录进行删除操作");
    }
}
function isSure() {

	var str = '';
    colmap = tabmap.get("generalInfo");
    var array = colmap.keys();

	 for ( var i in array) {
	         str += array[i];
	         str += ",";
	 }
     var ids = str.substr(0, str.length - 1);
    deleteAjax(ids);
}
// 删除物料追踪单
var deleteAjax = function(ids) {
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/bomTrack?method=deleteBomTrack",
        data : {
            "conditions" : '{"ids":"' + ids + '"}'
        },
        dataType : "text",
        async : false,
        success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

	            var tempData = $.parseJSON(text);
	            if (tempData.code == "1") {
	                resetForm();
	                oTable.ajax.reload();
	            } else {
	                // alert("操作失败");
	                lwalert("tipModal", 1, "操作失败");
	            }

			}
        }
    });
}
/**
 * 填充到HTML表单
 */
function setFormValue(data) {

    resetForm();

    for ( var item in data) {
        $("#" + item).val(data[item]);
    }

    var productionorderid = data.productionorderid;
    if (productionorderid != null && productionorderid != "" && productionorderid != "null") {
        $("#productionorderid").append(
                '<option value=' + productionorderid + '>' + data.productionnumber + '</option>');
        $("#productionorderid").select2("val", [ productionorderid ]);
    }

}
/**
 * 新增
 *
 */
var addBomTrack = function() {
   // checkSession("addBomTrack");
    // 清空表单
    resetForm();
    com.leanway.removeReadOnly("bomTrackForm");
    com.leanway.dataTableUnselectAll("generalInfo", "checkList");
    com.leanway.dataTableUnselectAll("generalInfo", "checkAll");
    $("#tracknumber").attr("readonly", "readonly");
    $("#barcodevalue").prop("readOnly",false);
}
/**
 * 重置表单
 *
 */
var resetForm = function() {
    $('#bomTrackForm').each(function(index) {
        $('#bomTrackForm')[index].reset();
    });

    $("#tableHead").html("");
    $("#tableBody").html("");

    $("#productionorderid").val(null).trigger("change");
}
/**
 * 往里面存数据
 */

var saveBomTrack = function() {
    //checkSession("saveBomTrack");
    var tracknumber = $("#tracknumber").val();
    var reg = /,$/gi;
    var trackDetailVal = "[";

    $("#tableBody").find('tr').each(
            function(index, temp) {
                var trackingtype = $(this).find("td:nth-child(2)").find("input").val();
                var modulename = $(this).find("td:nth-child(3)").find("input").val();
                var productordesc = $(this).find("td:nth-child(4)").find("input").val();
                var countunit = $(this).find("td:nth-child(5)").find("input").val();
                var usedcount = $(this).find("td:nth-child(6)").find("input").val();
                var remaincount = $(this).find("td:nth-child(7)").find("input").val();
                var trackcount = $(this).find("td:nth-child(8)").find("input").val();
                var line = $(this).find("td:nth-child(9)").find("input").val();
                var bomid = $(this).find("td:nth-child(10)").find("input").val();
                var productorid = $(this).find("td:nth-child(11)").find("input").val();
                var productionmoduleid = $(this).find("td:nth-child(12)").find("input").val();
                trackDetailVal += "{\"trackingtype\" : \"" + trackingtype
                        + "\",\"modulename\" : \"" + modulename + "\",\"productordesc\":\""
                        + productordesc + "\"," + "\"countunit\":\"" + countunit
                        + "\",\"usedcount\":\"" + usedcount + "\",\"remaincount\":\"" + remaincount
                        + "\",\"trackcount\":\"" + trackcount + "\",\"line\":\"" + line
                        + "\",\"bomid\":\"" + bomid + "\",\"productorid\":\"" + productorid
                        + "\",\"productionmoduleid\":\"" + productionmoduleid + "\"},";
            });
    trackDetailVal = trackDetailVal.replace(reg, "");
    trackDetailVal += "]";
    $('#trackDetailVal').val(trackDetailVal);
    var form = $("#bomTrackForm").serializeArray();
    // 后面确认时应 检测模具编号是否已存在
    var formData = formatFormJson(form);
    $("#bomTrackForm").data('bootstrapValidator').validate(); // 提交前先验证
    if ($('#bomTrackForm').data('bootstrapValidator').isValid()) { // 返回true、false
        if (trackDetailVal != "[]") {
            $.ajax({
                type : "POST",
                url : "../../../../"+ln_project+"/bomTrack",
                data : {
                    "method" : "addExtendBomTrack",
                    "formData" : formData,
                },
                dataType : "text",
                async : false,
                success : function(data) {

        			var flag =  com.leanway.checkLogind(data);

        			if(flag){

	                    var tempData = $.parseJSON(data);
	                    if (tempData.code == "1") {

	                    	com.leanway.clearTableMapData( "generalInfo" );

	                        com.leanway.formReadOnly("bomTrackForm");

	                        oTable.ajax.reload();
	                        ajaxLoadBomTrack(tempData.resultObj.trackid);
	                        lwalert("tipModal", 1, "保存成功");
	                    } else {
	                        // alert("操作失败");
	                        lwalert("tipModal", 1, "操作失败");
	                    }

        			}
                }
            });
        } else {
            lwalert("tipModal", 1, "没有物料，不能保存");
        }
    }
}
// 格式化form数据
var formatFormJson = function(formData) {
    var reg = /,$/gi;
    var data = "{";
    for (var i = 0; i < formData.length; i++) {
        if (formData[i].name == "trackDetailVal") {
            data += "\"" + formData[i].name + "\" : " + formData[i].value + ",";
        } else {
            data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
        }
    }
    data = data.replace(reg, "");
    data += "}";
    return data;
}
// 初始化时间
function initDate(id) {
    $(id).datetimepicker({
        lang : 'ch',
        format : "Y-m-d H:i:s", // 格式化日期
        timepicker : true, // 关闭时间选项
        yearStart : 2000, // 设置最小年份
        yearEnd : 2050, // 设置最大年份
        todayButton : true
    // 关闭选择今天按钮
    });
}
// 数据table
var oTable;

// 需要初始化数据
$(function() {

    initTimePickYmd("#receivingtime");
    initSelect2("#productionorderid", "../../../../"+ln_project+"/bomTrack?method=queryProductionOrder", "搜索生产订单号");
});
// 初始化年月日
var initTimePickYmd = function(timeId) {
	$(timeId).datetimepicker({
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
// 初始化select2,
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
$("#productionorderid").on("select2:select", function(e) {
    $("#productionnumber").val($(this).find("option:selected").text());
});



function queryProductorsByBarcode() {
    //checkSession("queryProductor");
    var productionorderid = $("#productionorderid").val();
    var barcodevalue = $("#barcodevalue").val();

    if(productionorderid == null || productionorderid == "" || productionorderid == " "){
        lwalert("tipModal", 1, "请搜索生产订单");
    }else{
        if (barcodevalue == null || barcodevalue == "" || barcodevalue == " ") {

        } else {
            $.ajax({
                type : "post",
                url : "../../../../"+ln_project+"/bomTrack",
                data : {
                    "method" : "queryModuleByProductorCode",
                    "barcodevalue" : barcodevalue,
                    "productionorderid":productionorderid
                },
                dataType : "text",
                async : false,
                success : function(data) {

        			var flag =  com.leanway.checkLogind(data);

        			if(flag){

	                    var tempData = $.parseJSON(data);
	                    appendTable(tempData);

        			}
                }
            });
        }
    }

}

function appendTable(data) {
    if (data == null) {

    } else {
        var tableHeadHtml = ""
            tableHeadHtml += " <tr>";
            tableHeadHtml += "  <th style='width: 25px'>" + "序号" + "</th>";
            tableHeadHtml += "  <th style='width: 25px'>" + "跟踪类型" + "</th>";
            tableHeadHtml += "  <th style='width: 125px'>" + "组件" + "</th>";
            tableHeadHtml += "  <th style='width: 25px'>" + "组件描述" + "</th>";
            tableHeadHtml += "  <th style='width: 25px'>" + "库存单位" + "</th>";
            tableHeadHtml += "  <th style='width: 25px'>" + "已消耗量" + "</th>";
            tableHeadHtml += "  <th style='width: 25px'>" + "超额数量" + "</th>";
            tableHeadHtml += "  <th style='width: 25px'>" + "追踪数量" + "</th>";
            tableHeadHtml += "  <th style='width: 25px'>" + "工序行号" + "</th>";
            tableHeadHtml += " </tr>";
            $("#tableHead").html(tableHeadHtml);
        var tableBodyHtml = "";
        var row = $("#grid-data").find("tr").length;
        for(var i=0;i<data.length;i++){
            if(data[i].surplusnumber<=0){
                tableBodyHtml += " <tr>";
                tableBodyHtml += "  <td>" + row + "</td>";
                tableBodyHtml += "  <td> <input class='form-control' id='trackingtype' type='text' value='"
                        + "超额追踪" + "' readonly='readonly'/></td>";
                tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
                        + data[i].modulename
                        + "' id='modulename'  readonly='readonly' style='width:100px'/></td>";
                tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
                        + data[i].moduledesc
                        + "' id='productordesc' readonly='readonly' style='width:100px'/></td>";
                tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
                        + data[i].unitsname + "' id='countunit'  readonly='readonly'/></td>";
                tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
                        + data[i].consumingnumber
                        + "' name='usedcount' id='usedcount' readonly='readonly'/></td>";
                tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
                        + Math.abs(data[i].surplusnumber)
                        + "' name='remaincount' id='remaincount' readonly='readonly'/></td>";
                tableBodyHtml += "  <td> <input class='form-control' type='text' name='trackcount' id='trackcount' style='border-color: #3c8dbc;' onkeyup='isNumber()' onafterpaste='isNumber()'/></td>";
                tableBodyHtml += "  <td> <input class='form-control' type='text' value='" + data[i].line
                        + "' id='line' readonly='readonly'/></td>";
                tableBodyHtml += "  <td> <input class='form-control' type='hidden' value='" + data[i].bomid
                        + "' id='bomid' readonly='readonly'/></td>";
                tableBodyHtml += "  <td> <input class='form-control' type='hidden' value='"
                        + data[i].productorid + "' id='productorid' readonly='readonly'/></td>";
                tableBodyHtml += "  <td> <input class='form-control' type='hidden' value='"
                        + data[i].productionmoduleid
                        + "' id='productionmoduleid' readonly='readonly'/></td>";
                tableBodyHtml += " </tr>";
                row++;
            }else{
                lwalert("tipModal", 1, "该组件的计划数量还未追踪完，不能进行超额追踪，请到物料追踪进行追踪");
            }
        }

        $("#tableBody").append(tableBodyHtml);
    }
}
/**
 * 填充到台账表格(拼接table)
 */
function setTableValue(data) {
    var tableHeadHtml = ""
    tableHeadHtml += " <tr>";
    tableHeadHtml += "  <th style='width: 25px'>" + "序号" + "</th>";
    tableHeadHtml += "  <th style='width: 25px'>" + "跟踪类型" + "</th>";
    tableHeadHtml += "  <th style='width: 125px'>" + "组件" + "</th>";
    tableHeadHtml += "  <th style='width: 25px'>" + "组件描述" + "</th>";
    tableHeadHtml += "  <th style='width: 25px'>" + "库存单位" + "</th>";
    tableHeadHtml += "  <th style='width: 25px'>" + "已消耗量" + "</th>";
    tableHeadHtml += "  <th style='width: 25px'>" + "剩余数量" + "</th>";
    tableHeadHtml += "  <th style='width: 25px'>" + "追踪数量" + "</th>";
    tableHeadHtml += "  <th style='width: 25px'>" + "工序行号" + "</th>";
    tableHeadHtml += " </tr>";
    $("#tableHead").html(tableHeadHtml);
    var tableBodyHtml = "";
    var row = $("#grid-data").find("tr").length;
    for ( var i in data) {
        tableBodyHtml += " <tr>";
        tableBodyHtml += "  <td>" + row + "</td>";
        tableBodyHtml += "  <td> <input class='form-control' id='trackingtype' type='text' value='"
                + "工单" + "' readonly='readonly'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
                + data[i].modulename
                + "' id='modulename'  readonly='readonly' style='width:100px'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
                + data[i].moduledesc
                + "' id='productordesc' readonly='readonly' style='width:100px'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
                + data[i].unitsname + "' id='countunit'  readonly='readonly'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
                + data[i].consumingnumber
                + "' name='usedcount' id='usedcount' readonly='readonly'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
                + data[i].surplusnumber
                + "' name='remaincount' id='remaincount' readonly='readonly'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' name='trackcount' id='trackcount' style='border-color: #3c8dbc;' onkeyup='isNumber()' onafterpaste='isNumber()'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' value='" + data[i].line
                + "' id='line' readonly='readonly'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='hidden' value='" + data[i].bomid
                + "' id='bomid' readonly='readonly'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='hidden' value='"
                + data[i].productorid + "' id='productorid' readonly='readonly'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='hidden' value='"
                + data[i].productionmoduleid
                + "' id='productionmoduleid' readonly='readonly'/></td>";
        tableBodyHtml += " </tr>";
        row++;
    }
    $("#tableBody").html(tableBodyHtml);
}
function isNumber() {
    var trackcount = document.getElementsByName("trackcount");
    for (var i = 0; i < trackcount.length; i++) {

        trackcount[i].value = trackcount[i].value.replace(/[^\d.]/g, '');

    }
    var usedcount = document.getElementsByName("usedcount");
    for (var i = 0; i < usedcount.length; i++) {

        usedcount[i].value = usedcount[i].value.replace(/[^\d.]/g, '');

    }
    var remaincount = document.getElementsByName("remaincount");
    for (var i = 0; i < remaincount.length; i++) {

        remaincount[i].value = remaincount[i].value.replace(/[^\d.]/g, '');

    }
}

/**
 * 填充到台账表格(拼接table)
 */
function setTableValue2(data) {
    var tableHeadHtml = ""
    tableHeadHtml += " <tr>";
    tableHeadHtml += "  <th>" + "序号" + "</th>";
    tableHeadHtml += "  <th>" + "跟踪类型" + "</th>";
    tableHeadHtml += "  <th>" + "组件" + "</th>";
    tableHeadHtml += "  <th>" + "组件描述" + "</th>";
    tableHeadHtml += "  <th>" + "库存单位" + "</th>";
    tableHeadHtml += "  <th>" + "已消耗量" + "</th>";
    tableHeadHtml += "  <th>" + "超额数量" + "</th>";
    tableHeadHtml += "  <th>" + "追踪数量" + "</th>";
    tableHeadHtml += "  <th>" + "工序行号" + "</th>";
    tableHeadHtml += " </tr>";
    $("#tableHead").html(tableHeadHtml);
    var tableBodyHtml = "";
    var j = 1;
    for ( var i in data) {

        tableBodyHtml += " <tr>";
        tableBodyHtml += "  <td>" + j + "</td>";
        tableBodyHtml += "  <td>" + data[i].trackingtype + "</td>";
        tableBodyHtml += "  <td>" + data[i].productorname + "</td>";
        tableBodyHtml += "  <td>" + data[i].productordesc + "</td>";
        tableBodyHtml += "  <td>" + data[i].countunit + "</td>";
        tableBodyHtml += "  <td> " + data[i].usedcount + "</td>";
        tableBodyHtml += "  <td> " + Math.abs(data[i].remaincount) + "</td>";
        tableBodyHtml += "  <td>" + data[i].trackcount + "</td>";
        tableBodyHtml += "  <td>" + data[i].line + "</td>";
        tableBodyHtml += " </tr>";
        j = j + 1;
    }
    $("#tableBody").html(tableBodyHtml);
}

/**
 * 搜索物料追踪单
 */
function searchBomTrack() {
    //checkSession("searchBomTrack");
    var searchVal = $("#searchValue").val();

    oTable.ajax.url("../../../../"+ln_project+"/bomTrack?method=queryExtendBomTrackList&searchValue=" + searchVal).load();
}

var flag = 0;

function forwardLogout() {
    window.parent.location.href = "../../../../"+ln_project+"/user?method=logout";
}