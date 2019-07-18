var oTable;
var clicktime = new Date();
var reg=/,$/gi;
$(function(){
    oTable = initTable();
    com.leanway.dataTableClickMoreSelect("productorTable", "checkList", false, oTable,undefined,undefined,undefined);
    com.leanway.enterKeyDown("searchValue", queryProductorstorage);
})
// 初始化数据表格
    var initTable = function () {

        var table = $('#productorTable').DataTable( {
                "ajax": "../../../"+ln_project+"/productors?method=queryProductorStorage",
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
                    {"data" : "productorid"},
                    { "data": "productorname" },
                    { "data": "productordesc" },
                    { "data": "shortname" },
                    { "data": "specification" },
                    { "data": "storagenumber" }
                 ],
                 "aoColumns": [
                       {
                           "mDataProp": "productorid",
                           "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                           $(nTd).html("<div id='stopPropagation" + iRow +"'>"
                                   +"<input class='regular-checkbox' type='checkbox' id='"
                                   + sData
                                   + "' name='checkList' value='"
                                   + sData
                                   + "'><label for='"
                                   + sData
                                   + "'></label>");
                           com.leanway.columnTdBindSelect(nTd);
                       }
                       },
                       {"mDataProp": "productorname"},
                       {"mDataProp": "productordesc"},
                       {"mDataProp": "shortname"},
                       {"mDataProp": "specification"},
                       {"mDataProp": "unitsname"},
                       {"mDataProp": "storagenumber"},
                  ],
                 "oLanguage" : {
                     "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                 },
                 "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                 "fnDrawCallback" : function(data) {
                     com.leanway.setDataTableColumnHide("productorTable");
                     com.leanway.dataTableClick("productorTable", "checkList",false);
                    }
            } ).on('xhr.dt', function (e, settings, json) {
                com.leanway.checkLogind(json);
            } );

        return table;
    }

function queryProductorstorage(){
    var searchValue = $("#searchValue").val();
    oTable.ajax.url("../../../"+ln_project+"/productors?method=queryProductorStorage&searchValue=" + searchValue).load();
}
//修改优先级
function modifyStoragenumber(){

    if (oTable.rows().data().length > 0) {
        $("#saveFun").attr("disabled", false);
        $("#productorTable tbody tr").each(function() {

            // 获取该行的下标
            var index = oTable.row(this).index();

            // 把第四列转换成Text文本
            $(this).find("td:eq(6)").html('<input type="text" class="form-control" style="width:80px" onblur="setDataTableValue(this, ' + index + ',\'productorTable\')" name="storagenumber" id="storagenumber" value="' + (oTable.rows().data()[index].storagenumber==null?"":oTable.rows().data()[index].storagenumber) + '">');

        });

        oTable.columns.adjust();
    }

}
//改变DataTable对象里的值
var setDataTableValue = function( obj, index, tableName ) {

    var tableObj =  $("#" + tableName).DataTable();

    // 获取修改的行数据
    var productor =  tableObj.rows().data()[index];
    // 循环Json key,value，赋值
    for (var item in productor) {

        // 当ID相同时，替换最新值
        if (item == obj.name) {

            productor[item] = obj.value;
        }

    }


}

var getAllDataTableData = function ( tableObj ) {

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
function saveStoragenumber(){
    var productors = getAllDataTableData(oTable);
    var formData = "{\"productorList\": "+ productors + "}";
    $.ajax ( {
        type : "POST",
        url : "../../../"+ln_project+"/productors",
        data : {
            "method":"addStoragenumber",
            "formData":formData,
        },
        dataType : "text",
        async : false,
        success : function ( data ) {

            var flag =  com.leanway.checkLogind(data);

            if(flag){


                var tempData = $.parseJSON(data);
                if (tempData.status == "success") {
                    oTable.ajax.reload();
                }
                lwalert("tipModal", 1, tempData.info);
            }
        }
    });
}
