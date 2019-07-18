var clicktime = new Date();
var oTable;
var dTable;
var flagval;
$(function() {

    // 初始化对象
    com.leanway.loadTags();
    //初始化备料单数据表格
    oTable = initBomTable();
    //初始化领料单数据表格
    dTable = initTable();
    com.leanway.initSelect2("#trackid",
            "../../../"+ln_project+"/virsualBomTrack?method=queryStockList", "搜索备料单号");
    com.leanway.initTimePickYmdForMoreId("#stocktime");
    flagval = com.leanway.getFlagval();
    queryBomListToSelect();
    com.leanway.enterKeyDown("searchValue", searchMeterialPicking);
})
var datable;
var init = function(){
    datable=initBomTable();
    datable.destroy();//清空数据表
    datable = initBomTable();
}
var initBomTable = function () {
    var tracknumber = $("#trackid").val();
    var stocktime = $("#stocktime").val();
    var table = $('#trackInfo').DataTable( {
        "ajax": "../../../"+ln_project+"/virsualBomTrack?method=queryBomTrackList&tracknumber="+tracknumber+"&stocktime="+stocktime,
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
                 if(flagval!=undefined){
                     if($('#trackInfo tbody tr').find("td").text()!="没有数据！"){
                         com.leanway.setDataTableSelect("trackInfo","checkList1",flagval);

                     }
//                     parent.window.$("#tab_iframe_tab_meterialpicking").attr("src","meterialpicking/meterialpicking.html?pageId=17912a73-b54e-495f-afae-341be5e0c470");
                 }
                 if($('#trackInfo tbody tr').find("td").text()!="没有数据！"){
                     com.leanway.setDataTableSelectNew("trackInfo",
                             null, "checkList1", null);
                     com.leanway.dataTableCheckAllCheck('trackInfo', 'checkAll', 'checkList');
                 }

          		com.leanway.dataTableClickMoreSelect("trackInfo","checkList1",false,initBomTable,undefined,undefined,undefined);

             }
        } ).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );

    return table;
}



var initTable = function () {

    var table = $('#Info').DataTable( {
        "ajax": "../../../"+ln_project+"/virsualBomTrack?method=queryPickingList",
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
                                   + "' name='checkList' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label>");
                         com.leanway.columnTdBindSelect(nTd);
                       }
                   },
                   {"mDataProp": "tracknumber"},
                   {"mDataProp": "barcode"},
                   {"mDataProp": "dispatchingnumber"},
                   {"mDataProp": "equipmentname"},
                   {"mDataProp": "productionnumber"},
                   {"mDataProp": "productordesc"},
                   {"mDataProp": "remaincount"},
                   {"mDataProp": "trackcount"},
                   {"mDataProp": "stocktime"},
                   {"mDataProp": "pickingtime"},
              ],

             "oLanguage" : {
                 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
             },
             "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
             "fnDrawCallback" : function(data) {
                 if(tdata!=undefined){
                     for(var i = 0;i<tdata.data.length;i++){
                         com.leanway.setDataTableSelect("Info","checkList",tdata.data[i].trackid);
                     }
                     }
           		com.leanway.dataTableClickMoreSelect("Info","checkList",false,initTable,undefined,undefined,undefined);

             }
        } ).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );

    return table;
}


var tdata;
//领料
var picking = function(type) {

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "trackInfo", "checkList1");
    if (ids.length>0) {

        var msg = "确定对选中的" + ids.split(",").length + "条备料单进行领料?";

		lwalert("tipModal", 2, msg ,"isSurePicking(" + type + ")");
	} else {
//		alert("至少选择一条记录操作");
		lwalert("tipModal", 1, "至少选择一条记录操作！");
	}


}


function isSurePicking(type){

	var ids = com.leanway.getCheckBoxData(type, "trackInfo", "checkList1");

	$.ajax({
        type : "post",
        url : "../../../"+ln_project+"/virsualBomTrack?method=updatePicking",
        data : {
            "conditions" : '{"ids":"' + ids + '"}'
        },
        dataType : "text",
        async : false,
        success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

	            tdata = $.parseJSON(text);
	            if (tdata.status == "success") {

	            	com.leanway.clearTableMapData( "trackInfo" );
	            	init();
	                dTable.ajax.reload();
	            }
	                lwalert("tipModal", 1, tdata.info);

			}
        }
    });
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
        lwalert("tipModal", 2, "你确定要删除吗","isSure()");
    } else {
//      alert("至少选择一条记录进行删除操作");
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
//删除物料追踪单
var deleteAjax = function(ids) {
    $.ajax({
        type : "post",
        url : "../../../"+ln_project+"/virsualBomTrack?method=deleteBomTrack",
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
	//              alert("操作失败");
	                lwalert("tipModal", 1, "操作失败");
	            }

			}
        }
    });
}

function queryBomListToSelect(){

    $.ajax({
        type : "post",
        url : "../../../"+ln_project+"/virsualBomTrack?method=queryBomListToSelect",
        dataType : "text",
        async : false,
        success : function(text) {

            var flag =  com.leanway.checkLogind(text);

            if(flag){

                var tdata = $.parseJSON(text);
                if (tdata.status == "success") {
                   var colmap= new Map();
                   var data = tdata.info;
                   for(var i=0;i<data.length;i++){
                       colmap.put(data[i].trackid,data[i].trackid);

                   }
                   tabmap.put("trackInfo",colmap);
                   if(data.length>0){
                       isSurePicking(2);
                   }
                }


            }
        }
    });
}

function searchMeterialPicking(){
    var searchVal = $("#searchValue").val();

    dTable.ajax.url("../../../"+ln_project+"/virsualBomTrack?method=queryPickingList&searchValue=" + searchVal).load();
}