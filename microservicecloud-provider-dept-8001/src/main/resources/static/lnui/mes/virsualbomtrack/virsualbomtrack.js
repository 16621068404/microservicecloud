var clicktime = new Date();

var oTable;
$(function() {

    // 初始化对象
    com.leanway.loadTags();
    oTable = initBomTable();
    // 加载datagrid
    // 全选
//  com.leanway.dataTableCheckAll("generalInfo", "checkAll", "checkList");
    com.leanway.initTimePickYmdForMoreId("#starttime");
    datable=initTable();


})


//初始化数据表格
var initTable = function () {
    var starttime = $("#starttime").val();
    var productionchildsearchno = $("#productionchildsearchno").val()
    var productorid = $("#productorid").val()
    var centerid = $("#centerid").val()
    var table = $('#generalInfo').DataTable( {
            "ajax": "../../../../"+ln_project+"/sendDispatchingOrder?method=querySendDispatchingOrderList&starttime="+starttime+"&productionchildsearchno="+productionchildsearchno+"&productorid="+productorid+"&centerid="+centerid,
            'bPaginate': true,
            "bDestory": true,
            "bRetrieve": true,
            "bFilter":false,
            "scrollX": true,
            "scrollY":"300px",
            "bSort": false,
            "bProcessing": true,
            "bServerSide": true,
            'searchDelay':"5000",
            "columns": [
                {
                            "data" : "orderid"
                        },{

                            "data" : "senddate"
                        }, {
                            "data" : "productionchildsearchno"
                        }, {
                            "data" : "dispatchingnumber"
                        }, {
                            "data" : "adjuststarttime"
                        }, {
                            "data" : "equipmentname",
                        }, {

                            "data" : "productordesc"
                        }, {
                            "data" : "productorname",
                        }, {
                            "data" : "count"
                        }, {
                            "data" : "meterial"
                        }, {
                            "data" : "meterialcount"
                        }
             ],
             "aoColumns": [
                   {
                       "mDataProp": "orderid",
                       "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                           $(nTd).html("<div id='stopPropagation" + iRow +"'>"
                                   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='checkList' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label>");
                           com.leanway.columnTdBindSelect(nTd,"generalInfo","checkList");
                       }
                   },
                   {"mDataProp": "senddate"},
                   {"mDataProp": "productionchildsearchno"},
                   {"mDataProp": "dispatchingnumber"},
                   {"mDataProp": "adjuststarttime"},
                   {"mDataProp": "equipmentname"},
                   {"mDataProp": "productordesc"},
                   {"mDataProp": "productorname"},
                   {"mDataProp": "count"},
                   {"mDataProp": "meterial"},
                   {"mDataProp": "meterialcount"},
              ],

             "oLanguage" : {
                 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
             },
             "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
             "fnDrawCallback" : function(data) {

            	com.leanway.dataTableClickMoreSelect("generalInfo","checkList",false,initTable,undefined,undefined,undefined);

             }
        } ).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );
    return table;
}
var datable;
var init = function(){
    datable=initTable();
    datable.destroy();//清空数据表
    datable = initTable();
}

var initBomTable = function () {

    var table = $('#trackInfo').DataTable( {
        "ajax": "../../../../"+ln_project+"/virsualBomTrack?method=queryBomTrackList",
            'bPaginate': true,
            "bDestory": true,
            "bRetrieve": true,
            "bFilter":false,
            "scrollX": true,
            "bSort": false,
            "bProcessing": true,
            "bServerSide": true,
            'searchDelay':"5000",
            "columns": [
                        {
                            "data" : "materialreceivingid"
                        }
             ],
             "aoColumns": [
                   {
                       "mDataProp": "materialreceivingid",
                       "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                           $(nTd).html("<div id='stopPropagation" + iRow +"'>"
                                   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='checkList1' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label>");
                           com.leanway.columnTdBindSelectNew(nTd,"trackInfo","checkList1");
                       }
                   },
                   {"mDataProp": "tracknumber"},
                   {"mDataProp": "barcode"},
                   {"mDataProp": "dispatchingnumber"},
                   {"mDataProp": "adjuststarttime"},
                   {"mDataProp": "equipmentname"},
                   {"mDataProp": "productionnumber"},
                   {"mDataProp": "productordesc"},
                   {"mDataProp": "stockcount"},
                   {"mDataProp": "stocktime"},
              ],

             "oLanguage" : {
                 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
             },
             "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
             "fnDrawCallback" : function(data) {
//                 com.leanway.getDataTableFirstRowId("trackInfo", null,"more","checkList1");

             	com.leanway.dataTableClickMoreSelect("trackInfo","checkList1",false,initTable,undefined,undefined,undefined);

                 if($('#trackInfo tbody tr').find("td").text()!="没有数据！"&&tdata!=undefined){
                 for(var i = 0;i<tdata.data.length;i++){
                     com.leanway.setDataTableSelect("trackInfo","checkList1",tdata.data[i].materialreceivingid);
                 }

                 }
                 if($('#trackInfo tbody tr').find("td").text()!="没有数据！"){
                     com.leanway.setDataTableSelectNew("trackInfo",
                             null, "checkList1", null);

                     com.leanway.dataTableCheckAllCheck('trackInfo', 'checkAll1', 'checkList1');
                 }



             }
        } ).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );

    return table;
}


var tdata;
function addTrack(){

    var orderList = getDataTableData(datable);
    var formData = "{\"orderList\": "+ orderList + "}";
    if(orderList!="[]"){
        $.ajax({
            type : "post",
            url : "../../../../"+ln_project+"/virsualBomTrack?method=addTrack",
            data : {
                "formData" :formData
            },
            dataType : "text",
            async : false,
            success : function(text) {

    			var flag =  com.leanway.checkLogind(text);

    			if(flag){

	                tdata = $.parseJSON(text);
	                if (tdata.status == "success") {
	                    oTable.ajax.reload();
	                    init();
	                }
                    lwalert("tipModal", 1, tdata.info);

    			}
            }
        });
    }else{
        lwalert("tipModal", 1, "请先查询，勾选需要备料的记录，再进行备料");
    }

}

var getDataTableData = function ( tableObj ) {

    var reg=/,$/gi;
    var jsonData = "[";
    $("#generalInfo tbody tr").each(function() {

        // 获取该行的下标
        var index = tableObj.row(this).index();
        if ($(this).find("td:eq(0)").find("input[name='checkList']").prop("checked")  == true) {
            var productorData = tableObj.rows(index).data()[0]
            jsonData += JSON.stringify(productorData) + ",";
        }

    });

//    var dataList = tableObj.rows().data();

//    if (dataList != undefined && typeof(dataList) != "undefined" && dataList.length > 0) {
//
//        // 循环遍历Table数据
//        for (var i = 0; i < dataList.length; i ++) {
//
//            var productorData = dataList[i];
//
//            jsonData += JSON.stringify(productorData) + ",";
//
//        }
//    }
    jsonData = jsonData.replace(reg,"");

    jsonData += "]";

    return jsonData;
}


function deleteBomTrack(){

    var str = '';
    // 拼接选中的checkbox
    $("input[name='checkList1']:checked").each(function(i, o) {
        str += $(this).val();
        str += ",";
    });

    if (str.length > 0) {
//      var ids = str.substr(0, str.length - 1);
//      if (confirm("确定要删除选中的物料追踪单吗?")) {
//          deleteAjax(ids);
//      }
        lwalert("tipModal", 2, "你确定要废弃吗","isSure()");
    } else {
//      alert("至少选择一条记录进行删除操作");
        lwalert("tipModal", 1, "至少选择一条记录进行操作");
    }
}
function isSure() {
    var str = '';
    // 拼接选中的checkbox
    $("input[name='checkList1']:checked").each(function(i, o) {
        str += $(this).val();
        str += ",";
    });
    var ids = str.substr(0, str.length - 1);
    deleteAjax(ids);
}
//删除物料追踪单
var deleteAjax = function(ids) {
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/virsualBomTrack?method=deleteBomTrack",
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
	                oTable.ajax.reload();
	                datable.ajax.reload();
	            } else {
	//              alert("操作失败");
	                lwalert("tipModal", 1, "操作失败");
	            }

			}
        }
    });
}

// 初始化时间
function initDate(id) {
    $(id).datetimepicker({
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
// 数据table
var oTable;

// 需要初始化数据
$(function() {

    initDate("#receivingtime");
    initSelect2("#productionchildsearchno",
            "../../../../"+ln_project+"/virsualBomTrack?method=queryProductionchildsearchno", "搜索生产子查询号");
    initSelect2("#productorid",
            "../../../../"+ln_project+"/productors?method=queryProductorBySearch", "搜索组件");
    initSelect2("#centerid",
            "../../../../"+ln_project+"/virsualBomTrack?method=queryWorkCenterList", "搜索工作中心");

});

//初始化select2,
/**
 * id: 为要操作的对象 url: url text: 要在select中显示的文本
 */
function initSelect2(id, url, text) {
    $(id).select2({
        placeholder : text,
        allowClear: true,
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



/**
 * 搜索物料追踪单
 */
var searchBomTrack = function() {

    var searchVal = $("#searchValue").val();

    oTable.ajax.url(
            "../../../../"+ln_project+"/virsualBomTrack?method=queryBomTrackList&searchValue="
                    + searchVal).load();
}
function next(){

    var flagval='';
//    $("input[name='checkList1']:checked").each(function(i, o) {
//        flagval += $(this).val();
//        flagval += ",";
//    });

//    flagval = flagval.substr(0, flagval.length - 1);
    flagval = com.leanway.getDataTableMapIds("trackInfo");
    parent.window.addTabs({'id':'meterialpicking','title':'图纸下料件领料','url':'meterialpicking/meterialpicking.html','close':'true','pageId' : 'ba744852-79c3-4f2a-ba06-d28397e036ca','flagval':flagval })
}

function print(){
    checkSession();
    var flagval='';
//    $("input[name='checkList1']:checked").each(function(i, o) {
//        flagval += $(this).val();
//        flagval += ",";
//    });
//    flagval = flagval.substr(0, flagval.length - 1);
    flagval = com.leanway.getDataTableMapIds("trackInfo");
    parent.window.addTabs({'id':'bomtrackprint','title':'备料追踪打印','url':'bomtrackprint/bomtrackprint.html','close':'true','pageId' : 'ba744852-79c3-4f2a-ba06-d28397e036ca','flagval':flagval })
}


function checkSession(){
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/workCenterGroup?method=checkSession",
        dataType : "json",
        async : false,
        success : function(text) {
            if(text.status!=true){
                lwalert("myModal", 2,"系统长时间未操作，登录失效，请重新登录","forwardLogout()");

            }
        }
    });
}

function forwardLogout(){
    window.parent.location.href = "../../../../"+ln_project+"/user?method=logout";
}