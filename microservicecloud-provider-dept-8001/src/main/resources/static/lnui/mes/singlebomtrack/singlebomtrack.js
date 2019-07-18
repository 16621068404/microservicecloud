var clicktime = new Date();
$(function() {
    initBootstrapValidator();
})
function initBootstrapValidator() {
    $('#bomTrackForm').bootstrapValidator(
            {
                excluded : [ ':disabled' ],
                fields : {
                    // tracknumber : {
                    // validators : {
                    // notEmpty : {},
                    // remote: {
                    // message: '追踪单号已存在',
                    // url: '../../bomTrack?method=queryIsBomTrackExsit'
                    // },
                    // stringLength : {
                    // min : 2,
                    // max : 10
                    // },
                    // }
                    // },
                    // receivingtime:{
                    // validators : {
                    // notEmpty : {},
                    // }
                    // },
                    // barcode : {
                    // validators : {
                    // notEmpty : {},
                    // stringLength : {
                    // min : 2,
                    // max : 20
                    // }
                    // }
                    // },
                     productionorderid:{
                     validators : {
                     notEmpty : {},
                     }
                     },
                    endline : {
                        validators : {
                            greaterThan : {
                                value : 'startline',
                                message : '不能小于起始值'
                            }
                        }
                    },
                    trackcount : {
                        validators : {
                            notEmpty : {},
                            lessThan : {
                                value : 'remaincount',
                                message : '追踪数不能大于剩余数'
                            },
                            regexp : com.leanway.reg.fun(com.leanway.reg.decimal.resourcescount,
                                    com.leanway.reg.msg.resourcescount)
                        }
                    },
                }
            });
}

var oTable;

var pTable;
$(function() {
    //checkSession("l69");
    // 初始化对象
    com.leanway.loadTags();
    com.leanway.formReadOnly("bomTrackForm");
    // 加载datagrid
    oTable = initTable();
    pTable = initProductorsTable();
    initTimePickYmd("receivingtime");
    initSelect2("#productionorderid", "../../../../"+ln_project+"/bomTrack?method=queryProductionOrder", "搜索生产订单号");
    initSelect2("#barcodevalue", "../../../../"+ln_project+"/bomTrack?method=queryBarcode", "搜索产品条码");
    // 全选
    // com.leanway.dataTableCheckAll("generalInfo", "checkAll", "checkList");
    com.leanway.enterKeyDown("searchValue", searchBomTrack);
    $("#track").prop("disabled", true);
})

// 初始化数据表格
var initTable = function() {

    var table = $('#generalInfo')
            .DataTable(
                    {
                        "ajax" : "../../../../"+ln_project+"/bomTrack?method=querySingleBomTrackList",
                        'bPaginate' : true,
                        "bDestory" : true,
                        "bRetrieve" : true,
                        "bFilter" : false,
                        "bSort" : false,
                        "scrollX" : true,
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
						 com.leanway.columnTdBindSelect(nTd);
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
                            com.leanway.getDataTableFirstRowId("generalInfo",ajaxLoadBomTrack,
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

var initProductorsTable = function () {
    var productionorderid = $("#productionorderid").val();
    var table = $('#productorInfo').DataTable( {
            "ajax": "../../../../"+ln_project+"/productors?method=findAllProductors&productionorderid="+productionorderid,
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
                       "mDataProp": "productorid",
                       "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                           $(nTd).html("<div id='stopPropagation" + iRow +"'>"
                                   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='checkList1' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label>");
                         com.leanway.columnTdBindSelectNew(nTd,new String("productorInfo"),"checkList1");
                       }
                   },
                   {"mDataProp": "productorname"},
                   {"mDataProp": "productordesc"},
              ],

             "oLanguage" : {
                 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
             },
             "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
             "fnDrawCallback" : function(data) {

                 com.leanway.getDataTableFirstRowId("productorInfo",null,"more","checkList1");
                 com.leanway.dataTableClickMoreSelect("productorInfo", "checkList1", false,
                         pTable, undefined,undefined,undefined,"checkAll1");

                 com.leanway.dataTableCheckAllCheck('productorInfo', 'checkAll1', 'checkList1');
             }
        } ).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );
    return table;
}

function loadProductorsTable(){
    pTable = initProductorsTable();
    pTable.destroy();//清空数据表
    pTable = initProductorsTable();
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
	            $("#track").prop("disabled", true);
			}
        }
    });
    com.leanway.formReadOnly("bomTrackForm");
}

function deleteBomTrack() {
    //checkSession("deleteBomTrack");
    var str = '';
    // 拼接选中的checkbox
    $("input[name='checkList']:checked").each(function(i, o) {
        str += $(this).val();
        str += ",";
    });

    if (str.length > 0) {
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
    // 拼接选中的checkbox
    $("input[name='checkList']:checked").each(function(i, o) {
        str += $(this).val();
        str += ",";
    });
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
//    var barcodevalue = data.barcode;
//    if (barcodevalue != null && barcodevalue != "" && barcodevalue != "null") {
//        $("#barcodevalue").append(
//                '<option value=' + barcodevalue + '>' + barcodevalue + '</option>');
//        $("#barcodevalue").select2("val", [ barcodevalue ]);
//    }

}
/**
 * 新增
 *
 */
var addBomTrack = function() {
    //checkSession("addBomTrack");
    // 清空表单
    resetForm();
    com.leanway.removeReadOnly("bomTrackForm");
    com.leanway.dataTableUnselectAll("generalInfo", "checkList");
    com.leanway.dataTableUnselectAll("generalInfo", "checkAll");
    $("#tracknumber").attr("readonly", "readonly");
    $("#track").prop("disabled", false);
    productorstr="";
    com.leanway.clearTableMapData( "productorInfo" );

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
    $("#barcodevalue").val(null).trigger("change");
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
    if ($('#bomTrackForm').data('bootstrapValidator').isValid() && flag) { // 返回true、false
        if (trackDetailVal != "[]") {
            $.ajax({
                type : "POST",
                url : "../../../../"+ln_project+"/bomTrack",
                data : {
                    "method" : "addSingleBomTrack",
                    "formData" : formData,
                },
                dataType : "text",
                async : false,
                success : function(data) {

        			var flag =  com.leanway.checkLogind(data);

        			if(flag){

	                    var tempData = $.parseJSON(data);
	                    if (tempData.code == "1") {
	                        com.leanway.formReadOnly("bomTrackForm");
	                        $("#track").prop("disabled", true);
	                        tabmap.clear();
	    					colmap.clear();
	                        oTable.ajax.reload();
	//                        ajaxLoadBomTrack(tempData.resultObj.trackid);
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
    } else if (!flag) {
        // alert("追踪数不能大于剩余数并且不等于0");
        lwalert("tipModal", 1, "追踪数不能大于剩余数并且不等于0");
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


	                };

    			}
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
    loadProductorsTable();
});

function queryProductionModuleList() {
    //checkSession("queryProductionModuleList");
    var productionorderid = $("#productionorderid").val();
    var startline = $("#startline").val();
    var endline = $("#endline").val();
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/bomTrack",
        data : {
            "method" : "queryProductionModuleList",
            "productionorderid" : productionorderid,
            "startline" : startline,
            "endline" : endline,
        },
        dataType : "text",
        async : false,
        success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

	            var tempData = $.parseJSON(data);
	            setTableValue(tempData);

			}
        }
    });
}
var map = new Map()
var productorstr="";
function queryProductor() {

    //checkSession("queryProductor");
       var str = '';
       colmap = tabmap.get("productorInfo");
       var array = colmap.keys();
       var oldArray = productorstr.split(",");
       for(var j in oldArray){
           map.put(j,oldArray[j]);
       }
        for ( var i in array) {
            if(!map.containsValue(array[i])){
                str += array[i];
                str += ",";
            }
        }
        var ids = str.substr(0, str.length - 1);

    if (str.length==0) {

        lwalert("tipModal", 1, "请勾选未追踪的产品进行追踪");
    }else{
        $.ajax({
            type : "post",
            url : "../../../../"+ln_project+"/bomTrack",
            data : {
                "method" : "queryProductor",
                "productorids" : ids,
            },
            dataType : "text",
            async : false,
            success : function(data) {

    			var flag =  com.leanway.checkLogind(data);

    			if(flag){

	                var tempData = $.parseJSON(data);
	                appendTable(tempData);
	                productorstr = ids;
	                $("#btn").trigger("click");

    			}
            }
        });
    }

}

function appendTable(data) {
    if (data == null) {

    } else {
        var tableBodyHtml = "";
        var row = $("#grid-data").find("tr").length;
        for(var i=0;i<data.length;i++){

        tableBodyHtml += " <tr>";
        tableBodyHtml += "  <td>" + row + "</td>";
        tableBodyHtml += "  <td> <input class='form-control' id='trackingtype' type='text' value='"
                + "计划外追踪" + "' readonly='readonly'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' value='" + data[i].shortname
                + " ' id='modulename'  readonly='readonly' style='width:100px'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' value='"
                + data[i].productordesc + " ' id='productordesc' readonly='readonly'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' value='" + data[i].unitsname
                + " ' id='countunit'  readonly='readonly'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text'  id='usedcount' name='usedcount' onkeyup='isNumber()' onafterpaste='isNumber()' readonly='readonly'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text'  name='remaincount' id='remaincount' onkeyup='isNumber()' onafterpaste='isNumber()' readonly='readonly'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' name='trackcount' id='trackcount' style='border-color: #3c8dbc;' onchange='notGreaterThan()' onkeyup='isNumber()' onafterpaste='isNumber()'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' value=' ' id='line' readonly='readonly'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='hidden' value='' id='bomid' readonly='readonly'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='hidden' value='"
                + data[i].productorid + " ' id='productorid' readonly='readonly'/></td>";
        tableBodyHtml += " </tr>";
        row++;
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
        tableBodyHtml += "  <td> <input class='form-control' type='text' name='trackcount' id='trackcount' style='border-color: #3c8dbc;' onchange='notGreaterThan()' onkeyup='isNumber()' onafterpaste='isNumber()'/></td>";
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
var flag = true;
function notGreaterThan() {
    var remaincount = document.getElementsByName("remaincount");
    var trackcount = document.getElementsByName("trackcount");
    for (var i = 0; i < trackcount.length; i++) {
        if (parseFloat(trackcount[i].value) > parseFloat(remaincount[i].value)
                || parseFloat(trackcount[i].value) == 0) {
            // alert("追踪数不能大于剩余数并且不等于0");
            lwalert("tipModal", 1, "追踪数不能大于剩余数并且不等于0");
            flag = false;
            return false;
        } else {
            flag = true;
        }
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
    tableHeadHtml += "  <th>" + "剩余数量" + "</th>";
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
        tableBodyHtml += "  <td> " + (data[i].usedcount==null?"":data[i].usedcount) + "</td>";
        tableBodyHtml += "  <td> " + (data[i].remaincount==null?"":data[i].remaincount) + "</td>";
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

    oTable.ajax.url("../../../../"+ln_project+"/bomTrack?method=querySingleBomTrackList&searchValue=" + searchVal).load();
}
/**
 * 搜索产品
 */
function searchProductors() {
    //checkSession("searchBomTrack");
    var searchVal = $("#searchValue1").val();
    var productionorderid = $("#productionorderid").val();
    pTable.ajax.url("../../../../"+ln_project+"/productors?method=findAllProductors&productionorderid="+productionorderid+"&searchValue=" + searchVal).draw();
}

var flag = 0;
var initTime = new Date();
var checkTime = initTime;


