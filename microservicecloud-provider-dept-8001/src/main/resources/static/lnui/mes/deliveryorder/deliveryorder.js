var clicktime = new Date();
var ope = "addDeliveryOrder";
var details;
var oTable;
var productorTable
$(function() {
	initDateTimeYmdHms("deliverydate");
    oTable = initTable();
    productorTable = initProductorTable();
    com.leanway.formReadOnly("deliveryOrderForm");
    $("input[name=confirmstatus]").click(function(){
        searchDeliveryOrder();
    });
    com.leanway.enterKeyDown("searchOrderValue", searchDeliveryOrder);
    initBootstrapValidator();
})

function initBootstrapValidator() {
    $('#deliveryOrderForm').bootstrapValidator(
            {
                excluded : [ ':disabled' ],
                fields : {
                    salesorderid : {
                        validators : {
                            notEmpty : {},

                        }
                    },
                    mapid : {
                        validators : {
                            notEmpty : {},

                        }
                    },
                }
            });
}

var searchDeliveryOrder = function (){
    resetForm();
    var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
    var searchValue = $("#searchOrderValue").val();
    oTable.ajax.url("../../../../"+ln_project+"/invoice?method=queryAdditional&tablename=deliveryorder&confirmstatus="+confirmstatus+"&searchValue="+searchValue).load();

}
//初始化数据表格
var initTable = function() {

    var table = $('#generalInfo')
            .DataTable(
                    {
                        "ajax" : "../../../../"+ln_project+"/invoice?method=queryAdditional&tablename=deliveryorder",
                        'bPaginate' : true,
                        "bDestory" : true,
                        "bRetrieve" : true,
                        "bFilter" : false,
                        "bSort" : false,
                        "scrollX" : true,
                        "bProcessing" : true,
                        "bServerSide" : true,
                        'searchDelay' : "5000",

                         "aoColumns": [
                               {
                                   "mDataProp": "additionalid",
                                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                                       $(nTd).html("<div id='stopPropagation" + iRow +"'>"
                                               +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                               + "' name='checkList' value='" + sData
                                               + "'><label for='" + sData
                                               + "'></label>");
                                     com.leanway.columnTdBindSelectNew(nTd,"generalInfo","checkList");
                                   }
                               },
                               {"mDataProp": "additionalno"},
                               {"mDataProp": "code"},
                               {"mDataProp": "companioname"},
                          ],

                        "oLanguage" : {
                            "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                        },
                        "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                        "fnDrawCallback" : function(data) {
                            com.leanway.getDataTableFirstRowId("generalInfo",ajaxLoadDeliveryOrder,
                                    "more", "checkList");
                            com.leanway.dataTableClickMoreSelect("generalInfo", "checkList", false,
                                    oTable, ajaxLoadDeliveryOrder,undefined,undefined,"checkAll");
                        }
                    }).on('xhr.dt', function (e, settings, json) {
                        com.leanway.checkLogind(json);
                    } );

    return table;
}

function ajaxLoadDeliveryOrder(additionalid){
    com.leanway.formReadOnly("deliveryOrderForm");
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/invoice?method=queryAdditionalObject",
        data : {
        	"formdata" : "{\"additionalid\":\""+additionalid+"\",\"tablename\":\"deliveryorder\"}",
        },
        dataType : "text",
        async : false,
        success : function(data) {

            var flag =  com.leanway.checkLogind(data);

            if(flag){

                var tempData = $.parseJSON(data);
                setFormValue(tempData);
                productorTable.ajax.url( '../../../../'+ln_project+'/invoice?method=queryGroupByDetailList&additionalid=' + additionalid).load();

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
       $("#"+item).val(data[item]);

    }
}

var resetForm = function() {
    $('#deliveryOrderForm').each(function(index) {
        $('#deliveryOrderForm')[index].reset();
    });

}


//格式化form数据
var formatFormJson = function(formData) {
    var reg = /,$/gi;
    var data = "{";
    for (var i = 0; i < formData.length; i++) {
        data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
    }
    data += "\"deliveryOrderDetailList\" : " + getTableDataToJson("productorTable");
    data += "}";
    return data;
}

var deleteDeliveryOrder = function ( type ) {

    if (type == undefined || typeof(type) == "undefined") {
        type = 1;
    }
    var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
    if(confirmstatus==0){
        var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");

        if (ids.length > 0) {

            var msg = "确定删除选中的" + ids.split(",").length + "条采购入库单?";

            lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
        } else {
            lwalert("tipModal", 1,"至少选择一条记录操作");
        }
    }else{
        lwalert("tipModal", 1, "已确认入库，不能再进行删除！");
    }
}

function isSureDelete(type){
    var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
    deleteAjax(ids);
}
// 删除Ajax
var deleteAjax = function(ids) {

    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/deliveryOrder",
        data : {
            method : "deleteDeliveryOrder",
            deliveryid :ids
        },
        dataType : "json",
        async : false,
        success : function(data) {

            var flag =  com.leanway.checkLogind(data);

            if(flag){

                if (data.status == "success") {

                    com.leanway.clearTableMapData( "generalInfo" );
                    oTable.ajax.reload(); // 刷新dataTable

                    lwalert("tipModal", 1,data.info);
                } else {
                    lwalert("tipModal", 1,data.info);
                }

            }
        }
    });
}
initSelect2 = function(id, url, text, multiple) {

    if (multiple == undefined || typeof(multiple) == "undefined") {
        multiple = false;
    }

    $(id).select2({
        placeholder : text,
        language : "zh-CN",
        multiple: multiple,
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

                var flag = com.leanway.checkLogind(data);

                if (flag) {
                    params.page = params.page || 1;
                    return {
                        results : data.items,
                        pagination : {
                            more : (params.page * 30) < data.total_count
                        }
                    }
                }
                ;
            },
            cache : false
        },
        escapeMarkup : function(markup) {
            return markup;
        },
        minimumInputLength : 1,
    });
}

var getDataTableData = function ( tableObj ) {
	var reg=/,$/gi;
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
var initProductorTable = function () {
    var editTable = $("#productorTable").DataTable({
            "ajax" : '../../../../'+ln_project+'/invoice?method=queryGroupByDetailList&additionalid=1',
            "pageUrl" : "invoicestock/invoicestock.html",
            'bPaginate': false,
            "bRetrieve": true,
            "bFilter":false,
            "scrollX": true,
            "bSort": false,
            "bProcessing": true,
            "bServerSide": false,
            "aoColumns" : [
            {
                "mDataProp" : "additionaldetailid",
                "fnCreatedCell" : function(nTd, sData,
                        oData, iRow, iCol) {
                    $(nTd).html("<input class='regular-checkbox' type='checkbox' id='" + sData
                                       + "' name='productorCheck' value='" + sData
                                       + "'><label for='" + sData
                                       + "'></label>");
                    com.leanway.columnTdBindSelect(nTd);
                }
            },
            {
                "mDataProp" : "mapname"
            },
            {
                "mDataProp" : "productorname"
            },{
                "mDataProp" : "productordesc"
            }
            ,{
                "mDataProp" : "version"
            },                        
            {
                "mDataProp" : "stockunitsname"
            },
            {
                "mDataProp" : "count"
            },
                           
            {
                "mDataProp" : "batch"
            },
                           
            {
                "mDataProp" : "confirmstatus",
          	    "fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
      				$(nTd).html(confirmstatusToName(sData));
      			}
            }],
            "aoColumnDefs" : [ {
                "sDefaultContent": "",
                 "aTargets": [ "_all" ]
            } ],
            "language" : {
                "sUrl" : "../../../jslib/datatables/zh-CN.txt"
            },
            "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
            "fnDrawCallback" : function(data) {

            }

        }).on('xhr.dt', function (e, settings, json) {
            com.leanway.checkLogind(json);
        } );
    return editTable;
}
/**
 * 产品状态
 */
var confirmstatusToName = function ( status ) {

	var result = "";

	switch (status) {
	case "0":
		result = "否";
		break;
	case "1":
		result = "是";
		break;
	default:
		result = "否";
		break;
	}

	return result;
}

// 审核通过
function applyConfirm(){
	// 初始化参数:type 1:当前页面的数据，2：跨页数据
	var type = "1"; 
	// 获取选中的数据
	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
	if(ids == null || ids == "" || typeof(ids) == "undefind"){
		lwalert("tipModal", 1, "至少选择一条数据");
		return;
	}
	$.ajax({
		type: "POST",
		url: "../../../../"+ln_project+"/deliveryOrder?method=addMapProductorDetail",
		data: {
			"ids":ids
		},
		dataType: "json",
		success: function(data){
			// 刷新表格 
			$('#generalInfo').DataTable().ajax.reload();
			lwalert("tipModal", 1,data.info);
		}
	});
	
}

//如果是备料中，则备料单可以修改。否则，禁用按钮
$("[name='confirmstatus']").change(function(){
	if($(this).val() == "0"){
		$("#btn_applyConfirm").css("display","inline-block");
	}else{
		$("#btn_applyConfirm").css("display","none");
	}
})