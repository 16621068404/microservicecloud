var clicktime = new Date();
var productorTable,oTable;
var reg = /,$/gi;
var opeMethod = "addTransferStore";
$(function() {
	//初始化交易类型
	querytransferrType();
    $("#addProductorButton").prop("disabled",true);
    $("#delProductorButton").prop("disabled",true);
    $("#saveProductorButton").prop("disabled",true);
    $("#tradetype").prop("disabled",true);
    $("input[name='allotttransferr']").prop("disabled",true);
    $("#comment").prop("disabled",true);
    $("#plannedDeliveryDate").prop("disabled",true);
    $("#planTheDeliveryDate").prop("disabled",true);
    productorTable = initProductorTable();
    oTable = initTable();
    $("input[name=confirmstatus]").click(function(){
        searchTransferStore();
    });
    var confirmstatus = $('input[name="confirmstatus"]:checked').val();
	 if(confirmstatus!=0){
		$("#editFun").prop("disabled",true);
		$("#deleteFun").prop("disabled",true);
	 }else{
		$("#editFun").prop("disabled",false);
		$("#deleteFun").prop("disabled",false);
	 }
    com.leanway.enterKeyDown("searchOrderValue", searchTransferStore);
	com.leanway.enterKeyDown("templateSearchValue", searchTemplate);
	
	initTimePickYmd("plannedDeliveryDate");
	initTimePickYmd("planTheDeliveryDate");

});

//获取交易类型
var querytransferrType = function () {
	
	// 获取交易类型
	$.ajax({
		url: "../../../../" + ln_project + "/codeMap",
		type: "post",
		data: {
			"method" : "queryCodeMapList",
			"t":"TransferList",
			"c":"TransferList"	
		},
		dataType: "json",
		success: function(data){
			// 清空数据
			$("#tradetype").empty();
			// 把信息放入select
			var option = "<option value=''>--请选择转仓类型--</option>";
			$.each(data,function(index,e) {
				option += "<option value='"+ e.codevalue +"'>";
				option += e.note;
				option += "</option>";
			});
			$("#tradetype").append(option);
		}
	});	

	$.ajax({
		url: "../../../../" + ln_project + "/codeMap",
		type: "post",
		data: {
			"method" : "queryCodeMapList",
			"t":"AllocationList",
			"c":"AllocationList"
		},
		dataType: "json",
		success: function(data){
			// 把信息放入select
			var option = "<option value=''>--请选择调拨类型--</option>";
			$.each(data,function(index,e) {
				option += "<option value='"+ e.codevalue +"'>";
				option += e.note;
				option += "</option>";
			});
			$("#tradetype").append(option);
		}
	});
}




var searchTransferStore = function (){
    var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
    if(confirmstatus == 2){
		$("#editFun").prop("disabled",true);
		$("#deleteFun").prop("disabled",true);
	 }else{
		$("#editFun").prop("disabled",false);
		$("#deleteFun").prop("disabled",false);
	 }
    var searchValue = $("#searchOrderValue").val();
    oTable.ajax.url("../../../../"+ln_project+"/additional?method=queryAdditional&tablename=transferstore&confirmstatus="+confirmstatus+"&searchValue="+searchValue).load();

}
//初始化数据表格
var initTable = function() {

    var table = $('#generalInfo')
            .DataTable(
                    {
                        "ajax" : "../../../../"+ln_project+"/additional?method=queryAdditional&tablename=transferstore",
                        "pageUrl"  :   "transferstore/transferstore.html",
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
                                       com.leanway.columnTdBindSelectNew(nTd,"generalInfo","checkList");                                   }
                               },
                               {"mDataProp": "additionalno"},
                               {"mDataProp": "comment"}
                          ],

                        "oLanguage" : {
                            "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                        },
                        "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                        "fnDrawCallback" : function(data) {
                        	
                            com.leanway.getDataTableFirstRowId("generalInfo",ajaxLoadTransferStore,
                                    "more", "checkList");
                            com.leanway.dataTableClickMoreSelect("generalInfo", "checkList", false,
                                    oTable, ajaxLoadTransferStore,undefined,undefined,"checkAll");

//                            com.leanway.dataTableCheckAllCheck('generalInfo', 'checkAll', 'checkList');
                        }
                    }).on('xhr.dt', function (e, settings, json) {
                        com.leanway.checkLogind(json);
                    } );

    return table;
}

//加载明细。
var initProductorTable = function () {
    var editTable = $("#productorTable").DataTable({
            "ajax" : '../../../../'+ln_project+'/additional?method=queryAdditionalDetailByConditions&conditions=' + encodeURI('{"additionalid": "1"}'),
            "pageUrl"  :   "transferstore/transferstore.html",
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
                "mDataProp" : "mapname2"
            },
            {
                "mDataProp" : "productorname"
            },
            {
                "mDataProp" : "productordesc"
            },
            {
                "mDataProp" : "version"
            },
            {
                "mDataProp" : "batch"
            },
//            {
//                "mDataProp" : "subbatch"
//            },
//            {
//                "mDataProp" : "serialnumber"
//            },
            {
                "mDataProp" : "countnew"
            },
            {
                "mDataProp" : "stockunitsname"
            },
            {
                "mDataProp" : "count"
            },
            {
                "mDataProp" : "conversionrate"
            }
            ],
            "aoColumnDefs" : [ {
                "sDefaultContent": "",
                 "aTargets": [ "_all" ]
            } ],
            "language" : {
                "sUrl" : "../../../jslib/datatables/zh-CN.txt"
            },
            "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
            "fnDrawCallback" : function(oSettings) {
            	if(oSettings.jqXHR != null){
            	var data = jQuery.parseJSON(oSettings.jqXHR.responseText);//获取后台方式 直接可以拿到json 之后进行处理
            	
            	console.log("data======"+data);
            	// 获取主体
            	var additional = data.additional;
            	// 设置页面主体
            	//加载表头信息
            	setFormValue(additional);	  
            	}
            }

        }).on('xhr.dt', function (e, settings, json) {
            com.leanway.checkLogind(json);
        } );
    return editTable;
}

/**
 * 新增一行
 */
var addProductor = function( ) {
    var data = oTable.rows('.row_selected').data();
    var transferid = "";
    if(data.length>0){
        transferid =data[0].additionalid;
    }

    productorTable.row.add({
        "additionaldetailid" : null,
        "mapid":null,
        "mapid2":null,
        "productorid" : null,
        "productordesc" : "",
        "batch":null,
        "subbatch":null,
        "serialnumber":null,
        "countnew" : "",
        "stockunitsname":"",
        "stockunits":"",
        "count" : "",
        "versionid":"",
        "version":"",
        "additionalid" : transferid,
        "conversionrate":""
    }).draw(false);

    productorTableToEdit();
    //新增行时默认给新增行的调入地点调出地点赋上一行的值
//    var length = productorTable.rows().data().length-1;
//    if(length>0){
//        $("#mapid" + length).append('<option value='+ productorTable.rows().data()[length-1].mapid+ '>'+ productorTable.rows().data()[length-1].mapname+ '</option>');
//        $("#mapid" + length).select2("val",productorTable.rows().data()[length-1].mapid);
//        productorTable.rows().data()[length].mapid = productorTable.rows().data()[length-1].mapid;
//        productorTable.rows().data()[length].mapname = productorTable.rows().data()[length-1].mapname
//
//        $("#mapid2" + length).append('<option value='+ productorTable.rows().data()[length-1].mapid2+ '>'+ productorTable.rows().data()[length-1].mapname2+ '</option>');
//        $("#mapid2" + length).select2("val",productorTable.rows().data()[length-1].mapid2);
//        productorTable.rows().data()[length].mapid2 = productorTable.rows().data()[length-1].mapid2;
//        productorTable.rows().data()[length].mapname2 = productorTable.rows().data()[length-1].mapname2
//        initSelect2("#productorid" + length,"../../../"+ln_project+"/transferStore?method=queryProductorByMap&calloutmapid="+productorTable.rows().data()[length].mapid+"&receiptmapid="+productorTable.rows().data()[length].mapid2,"搜索产品");
//    }
}

/**
 * 采购产品变成可编辑
 */
var productorTableToEdit = function ( ) {

        if (productorTable.rows().data().length > 0) {

            $("#productorTable tbody tr").each( function( ) {

                // 获取该行的下标
                var index = productorTable.row(this).index();
                //调出仓
                var calloutmapid = "";
                if(productorTable.rows().data()[index].mapid!=undefined&&opeMethod =="updateAdditional"){
                    calloutmapid = '<select id="mapid'+index+'" name="mapid" class="form-control select2" disabled style="width: 140px"></select>'
                }else{
                    calloutmapid = '<select id="mapid'+index+'" name="mapid" class="form-control select2" style="width: 140px"></select>'
                }
                $(this).find("td:eq(1)").html(calloutmapid);
                initSelect2("#mapid" + index,"../../../"+ln_project+"/companyMap?method=queryAllStorageMap","搜索调出地点");
                $("#mapid" + index).append('<option value='+ productorTable.rows().data()[index].mapid+ '>'+ productorTable.rows().data()[index].mapname+ '</option>');
                $("#mapid" + index).select2("val",productorTable.rows().data()[index].mapid);
                // select选中数据后 触发事件
                $("#mapid" + index).on("select2:select",function(e) {
                    // 赋值
                    productorTable.rows().data()[index].mapid = $(this).val();

                    clearData(index,"","","","","","","","")
                    productorTable.rows().data()[index].mapname = $(this).find("option:selected").text();
                    initSelect2("#productorid" + index,"../../../"+ln_project+"/transferStore?method=queryProductorByMap&calloutmapid="+productorTable.rows().data()[index].mapid+"&receiptmapid="+productorTable.rows().data()[index].mapid2,"搜索产品");
                });

                //调入仓
                var receiptmapid ='';
                if(productorTable.rows().data()[index].mapid2!=undefined&&opeMethod =="updateAdditional"){
                    receiptmapid = '<select id="mapid2'+index+'" name="mapid2" class="form-control select2" disabled style="width: 140px"></select>'
                }else{
                    receiptmapid = '<select id="mapid2'+index+'" name="mapid2" class="form-control select2" style="width: 140px"></select>'
                }
                $(this).find("td:eq(2)").html(receiptmapid);
                    initSelect2("#mapid2" + index,"../../../"+ln_project+"/companyMap?method=queryAllStorageMap","搜索调入地点");
                $("#mapid2" + index).append('<option value='+ productorTable.rows().data()[index].mapid2+ '>'+ productorTable.rows().data()[index].mapname2+ '</option>');
                $("#mapid2" + index).select2("val",productorTable.rows().data()[index].mapid2);

                // select选中数据后 触发事件
                $("#mapid2" + index).on("select2:select",function(e) {

                    // 赋值
                    productorTable.rows().data()[index].mapid2 = $(this).val();
                    productorTable.rows().data()[index].mapname2 = $(this).find("option:selected").text();
                    clearData(index,"","","","","","","","")
                    initSelect2("#productorid" + index,"../../../"+ln_project+"/transferStore?method=queryProductorByMap&calloutmapid="+productorTable.rows().data()[index].mapid+"&receiptmapid="+productorTable.rows().data()[index].mapid2,"搜索产品");
                });

                //产品
                var productorid = '';
                if(productorTable.rows().data()[index].productorid!=undefined&&opeMethod =="updateAdditional"){
                    productorid =  "<select id='productorid"+ index+ "'  onchange=checkShow("+ index +")  name='productorid' class='form-control select2' disabled style='width: 130px'>";

                }else{
                    productorid =  "<select id='productorid"+ index+ "' onchange=checkShow("+ index +")  name='productorid' class='form-control select2' style='width: 130px'>";
                }
                // 产品编码
                $(this).find("td:eq(3)").html(productorid);
                initSelect2("#productorid" + index,"../../../"+ln_project+"/transferStore?method=queryProductorByMap&calloutmapid="+productorTable.rows().data()[index].mapid+"&receiptmapid="+productorTable.rows().data()[index].mapid2,"搜索产品");

                $("#productorid" + index).append('<option value='+ productorTable.rows().data()[index].productorid+ '>'+ productorTable.rows().data()[index].productorname+ '</option>');
                $("#productorid" + index).select2("val",productorTable.rows().data()[index].productorid);
                // select选中数据后 触发事件
                $("#productorid" + index).on("select2:select",function(e) {
                    // 赋值
                    productorTable.rows().data()[index].productorid = $(this).val();
                    productorTable.rows().data()[index].productorname = $(this).find("option:selected").text();
                    clearData(index,$(this).val(),"","","","","","","")
                    initSelect2("#versionid" + index, "../../../../"+ln_project+"/additional?method=queryVersionByMapidAndProductorid&productorid="+productorTable.rows().data()[index].productorid+"&mapid="+productorTable.rows().data()[index].mapid, "搜索版本号");
                    initSelect2("#batch" + index, "../../../../"+ln_project+"/transferStore?method=queryBatchByProductorAndMap&productorid="+productorTable.rows().data()[index].productorid+"&calloutmapid="+productorTable.rows().data()[index].mapid+"&versionid="+productorTable.rows().data()[index].versionid, "搜索");
                    initSelect2("#serialnumber" + index, "../../../../"+ln_project+"/transferStore?method=querySerialnumberByProductorAndMap&productorid="+productorTable.rows().data()[index].productorid+"&calloutmapid="+productorTable.rows().data()[index].mapid+"&batch="+productorTable.rows().data()[index].batch+"&versionid="+productorTable.rows().data()[index].versionid, "搜索序列号");
                    initSelect2("#subbatch" + index, "../../../../"+ln_project+"/transferStore?method=querySubbatchByProductorAndMap&productorid="+productorTable.rows().data()[index].productorid+"&calloutmapid="+productorTable.rows().data()[index].mapid+"&batch="+productorTable.rows().data()[index].batch+"&versionid="+productorTable.rows().data()[index].versionid, "搜索子批次号");
                    
                    loadStoreInfo(index,productorTable.rows().data()[index].productorid,productorTable.rows().data()[index].batch,productorTable.rows().data()[index].mapid,productorTable.rows().data()[index].subbatch,productorTable.rows().data()[index].serialnumber,productorTable.rows().data()[index].versionid);
 
                });
                 // 产品名称
                 var productordesc = productorTable.rows().data()[index].productordesc;
                 $(this).find("td:eq(4)").html('<input type="text" class="form-control"  style="width: 130px" readonly name="productordesc" id="productordesc'+index+'" value="'+ productordesc + '">');

                 
                //版本
                var version = '';
                if(productorTable.rows().data()[index].versionid!=undefined&&productorTable.rows().data()[index].versionid!=""&&opeMethod =="updateAdditional"){
                	version = "<select id='versionid"+ index+ "'  name='versionid' class='form-control select2' disabled style='width: 70px'>";
                }else{
                	version = "<select id='versionid"+ index+ "'  name='versionid' class='form-control select2' style='width: 70px'>";
                }
              
                $(this).find("td:eq(5)").html(version);
                initSelect2("#versionid" + index, "../../../../"+ln_project+"/additional?method=queryVersionByMapidAndProductorid&productorid="+productorTable.rows().data()[index].productorid+"&mapid="+productorTable.rows().data()[index].mapid, "搜索版本号");
                $("#versionid" + index).append('<option value='+ productorTable.rows().data()[index].versionid+ '>'+ productorTable.rows().data()[index].version+ '</option>');
                $("#versionid" + index).select2("val",productorTable.rows().data()[index].versionid);
             // select选中数据后 触发事件
                $("#versionid" + index).on("select2:select",function(e) {
                    // 赋值
                    productorTable.rows().data()[index].versionid = $(this).val();
                    productorTable.rows().data()[index].version = $(this).find("option:selected").text();
                    clearData(index,productorTable.rows().data()[index].productorid,"","","","","","",productorTable.rows().data()[index].versionid);
                    //initSelect2("#batch" + index, "../../../../"+ln_project+"/transferStore?method=queryBatchByProductorAndMap&productorid="+productorTable.rows().data()[index].productorid+"&calloutmapid="+productorTable.rows().data()[index].mapid+"&versionid="+productorTable.rows().data()[index].versionid, "搜索批次号");
                    //initSelect2("#subbatch" + index, "../../../../"+ln_project+"/transferStore?method=querySubbatchByProductorAndMap&productorid="+productorTable.rows().data()[index].productorid+"&calloutmapid="+productorTable.rows().data()[index].mapid+"&batch="+productorTable.rows().data()[index].batch+"&versionid="+productorTable.rows().data()[index].versionid, "搜索子批次号");
                    //initSelect2("#serialnumber" + index, "../../../../"+ln_project+"/transferStore?method=querySerialnumberByProductorAndMap&productorid="+productorTable.rows().data()[index].productorid+"&calloutmapid="+productorTable.rows().data()[index].mapid+"&batch="+productorTable.rows().data()[index].batch+"&versionid="+productorTable.rows().data()[index].versionid, "搜索序列号");
                    loadStoreInfo(index,productorTable.rows().data()[index].productorid,productorTable.rows().data()[index].batch,productorTable.rows().data()[index].mapid,productorTable.rows().data()[index].subbatch,productorTable.rows().data()[index].serialnumber,productorTable.rows().data()[index].versionid);

                });
                //批次号
                var batch = '';
                if(productorTable.rows().data()[index].batch!=undefined&&productorTable.rows().data()[index].batch!=""&&opeMethod =="updateAdditional"){
                    batch = "<select id='batch"+ index+ "'  name='batch' class='form-control select2' disabled style='width: 80px'>";
                }else{
                    batch = "<select id='batch"+ index+ "'  name='batch' class='form-control select2' disabled style='width: 80px'>";
                }

                $(this).find("td:eq(6)").html(batch);
                initSelect2("#batch" + index, "../../../../"+ln_project+"/transferStore?method=queryBatchByProductorAndMap&productorid="+productorTable.rows().data()[index].productorid+"&calloutmapid="+productorTable.rows().data()[index].mapid+"&versionid="+productorTable.rows().data()[index].versionid, "搜索");

                $("#batch" + index).append('<option value='+ productorTable.rows().data()[index].batch+ '>'+ productorTable.rows().data()[index].batch+ '</option>');
                $("#batch" + index).select2("val",productorTable.rows().data()[index].batch);

                // select选中数据后 触发事件
                $("#batch" + index).on("select2:select",function(e) {

                    // 赋值
                    productorTable.rows().data()[index].batch = $(this).val();
                    clearData(index,productorTable.rows().data()[index].productorid,$(this).val(),"","","","","",productorTable.rows().data()[index].versionid)
                    initSelect2("#subbatch" + index, "../../../../"+ln_project+"/transferStore?method=querySubbatchByProductorAndMap&productorid="+productorTable.rows().data()[index].productorid+"&calloutmapid="+productorTable.rows().data()[index].mapid+"&batch="+productorTable.rows().data()[index].batch, "搜索子批次号");
                    initSelect2("#serialnumber" + index, "../../../../"+ln_project+"/transferStore?method=querySerialnumberByProductorAndMap&productorid="+productorTable.rows().data()[index].productorid+"&calloutmapid="+productorTable.rows().data()[index].mapid+"&batch="+productorTable.rows().data()[index].batch, "搜索序列号");
                    loadStoreInfo(index,productorTable.rows().data()[index].productorid,productorTable.rows().data()[index].batch,productorTable.rows().data()[index].mapid,productorTable.rows().data()[index].subbatch,productorTable.rows().data()[index].serialnumber,productorTable.rows().data()[index].versionid);

                });

                /*//子批次号
                var subbatch = '';
                if(productorTable.rows().data()[index].subbatch!=undefined&&productorTable.rows().data()[index].subbatch!=""&&opeMethod =="updateAdditional"){
                    subbatch = "<select id='subbatch"+ index+ "'  name='subbatch' class='form-control select2' disabled style='width: 130px'>";
                }else{
                    subbatch = "<select id='subbatch"+ index+ "'  name='subbatch' class='form-control select2' style='width: 130px'>";
                }

                $(this).find("td:eq(6)").html(subbatch);
                initSelect2("#subbatch" + index, "../../../../"+ln_project+"/transferStore?method=querySubbatchByProductorAndMap&productorid="+productorTable.rows().data()[index].productorid+"&calloutmapid="+productorTable.rows().data()[index].mapid+"&batch="+productorTable.rows().data()[index].batch+"&versionid="+productorTable.rows().data()[index].versionid, "搜索子批次号");

                $("#subbatch" + index).append('<option value='+ productorTable.rows().data()[index].subbatch+ '>'+ productorTable.rows().data()[index].subbatch+ '</option>');
                $("#subbatch" + index).select2("val",productorTable.rows().data()[index].subbatch);

                // select选中数据后 触发事件
                $("#subbatch" + index).on("select2:select",function(e) {
                    // 赋值
                    productorTable.rows().data()[index].subbatch = $(this).val();
                    clearData(index,productorTable.rows().data()[index].productorid,productorTable.rows().data()[index].batch,$(this).val(),"","","","",productorTable.rows().data()[index].versionid)
                    initSelect2("#serialnumber" + index, "../../../../"+ln_project+"/transferStore?method=querySerialnumberByProductorAndMap&productorid="+productorTable.rows().data()[index].productorid+"&calloutmapid="+productorTable.rows().data()[index].mapid+"&batch="+productorTable.rows().data()[index].batch+"&subbatch="+$(this).val()+"&versionid="+productorTable.rows().data()[index].versionid, "搜索序列号");

                    loadStoreInfo(index,productorTable.rows().data()[index].productorid,productorTable.rows().data()[index].batch,productorTable.rows().data()[index].mapid,productorTable.rows().data()[index].subbatch,productorTable.rows().data()[index].serialnumber,productorTable.rows().data()[index].versionid);

                });

                //序列号
                var serialnumber = '';
                if(productorTable.rows().data()[index].serialnumber!=undefined&&productorTable.rows().data()[index].serialnumber!=""&&opeMethod =="updateAdditional"){
                    serialnumber = "<select id='serialnumber"+ index+ "'  name='serialnumber' class='form-control select2' disabled style='width: 130px'>";
                }else{
                    serialnumber = "<select id='serialnumber"+ index+ "'  name='serialnumber' class='form-control select2' style='width: 130px'>";
                }
                $(this).find("td:eq(7)").html(serialnumber);
                initSelect2("#serialnumber" + index, "../../../../"+ln_project+"/transferStore?method=querySerialnumberByProductorAndMap&productorid="+productorTable.rows().data()[index].productorid+"&calloutmapid="+productorTable.rows().data()[index].mapid+"&batch="+productorTable.rows().data()[index].batch+"&subbatch="+productorTable.rows().data()[index].subbatch+"&versionid="+productorTable.rows().data()[index].versionid, "搜索序列号");
                $("#serialnumber" + index).append('<option value='+ productorTable.rows().data()[index].serialnumber+ '>'+ productorTable.rows().data()[index].serialnumber+ '</option>');
                $("#serialnumber" + index).select2("val",productorTable.rows().data()[index].serialnumber);
                $("#serialnumber" + index).on("select2:select",function(e) {
                    productorTable.rows().data()[index].serialnumber = $(this).val();
                    loadStoreInfo(index,productorTable.rows().data()[index].productorid,productorTable.rows().data()[index].batch,productorTable.rows().data()[index].mapid,productorTable.rows().data()[index].subbatch,productorTable.rows().data()[index].serialnumber,productorTable.rows().data()[index].versionid);
                });*/
                // 可调出数量
                var countnew = productorTable.rows().data()[index].countnew;
                $(this).find("td:eq(7)").html('<input type="text" class="form-control" style="width: 50px" readonly name="countnew" id="countnew'+index+'" value="'+ countnew + '">');
                // 库存单位
                var stockunitsname = productorTable.rows().data()[index].stockunitsname;
                $(this).find("td:eq(8)").html('<input type="text" class="form-control" style="width: 50px" readonly name="stockunitsname" id="stockunitsname'+index+'" value="'+ stockunitsname + '">');
                // 调出数量
                var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
                var count = productorTable.rows().data()[index].count;
                if(count!=undefined&&opeMethod =="updateAdditional"&&confirmstatus == 0){
                    $(this).find("td:eq(9)").html('<input type="text" class="form-control" style="width: 50px"  onblur="setDataTableValue(this, '+ index+ ',\'productorTable\')" name="count" id="count" onkeyup="isNumber()" onafterpaste="isNumber()" value="'+ count + '">');
                }else if(count!=undefined&&opeMethod =="updateAdditional"&&confirmstatus == 1){
                	$(this).find("td:eq(9)").html('<input type="text" class="form-control"  readonly style="width: 50px"  onblur="setDataTableValue(this, '+ index+ ',\'productorTable\')" name="count" id="count" onkeyup="isNumber()" onafterpaste="isNumber()" value="'+ count + '">');
                }else{
                	$(this).find("td:eq(9)").html('<input type="text" class="form-control"  style="width: 50px"  onblur="setDataTableValue(this, '+ index+ ',\'productorTable\')" name="count" id="count" onkeyup="isNumber()" onafterpaste="isNumber()" value="'+ count + '">');
                }
                 // 换算率
                var conversionrate = productorTable.rows().data()[index].conversionrate;
                if(productorTable.rows().data()[index].conversionrate!=undefined&&opeMethod =="updateAdditional"){
                	$(this).find("td:eq(10)").html('<input type="text" class="form-control conversionrate" style="width: 50px"  name="conversionrate" id="conversionrate'+index+'" value="'+ conversionrate + '">');
                } else {
                	// 换算率
                    $(this).find("td:eq(10)").html('<input type="number" class="form-control conversionrate" min="1" style="width: 50px" name="conversionrate1" value="1">/<input type="number" class="form-control conversionrate" min="1" style="width: 50px" name="conversionrate2" value="1">');
                }
              

                /*  if (productorTable.rows().data()[index].catlateid!=undefined&&opeMethod =="updateAdditional") {
                	// 是否检验
                    $(this).find("td:eq(10)").html('<div style="width:60px;"> <select   class="form-control"  onchange=checkValue('+ index +') val=""  name="qualitycheck" id="qualitycheck'+ index +'">  <option value="0" >否</option>  <option value="1" selected="selected" >是</option> </select> </div>');
                    // 质检信息
                    $(this).find("td:eq(11)").html('<div style="width: 70px" > <a   name="viewTemplate"   onclick="viewTemplate('+ index +');" id="viewTemplate'+ index+ '">&nbsp配置</a></div>');
                } else {
                	 // 是否检验
                    $(this).find("td:eq(10)").html('<div style="width:60px;"> <select  style="display: none;" class="form-control"  onchange=checkValue('+ index +') val=""  name="qualitycheck" id="qualitycheck'+ index +'">  <option value="0" selected="selected">否</option>  <option value="1">是</option> </select> </div>');
                    // 质检信息
                    $(this).find("td:eq(11)").html('<div style="width: 70px" > <a  style="display: none;" name="viewTemplate"   onclick="viewTemplate('+ index +');" id="viewTemplate'+ index+ '">&nbsp配置</a></div>');
                }*/
                /*$(this).find("td:eq(12)").html('<div> <input style="display: none;" class="form-control" name="employeeid" id="employeeid'+index+'"> </div>');
                $(this).find("td:eq(13)").html('<div> <input style="display: none;" class="form-control" name="transferstoredetaillist" id="transferstoredetaillist'+index+'"> </div>');*/
                
            });

            productorTable.columns.adjust();
        }
}
/**
 * 显示是否显示
 */
var checkShow = function ( index ) {
	$("#qualitycheck" + index).css('display', 'block');
}


/**
 * 判断是否显示
 */
var checkValue = function ( index ) {
	if($("#qualitycheck" + index).val() == 1 ){
		$("#viewTemplate" + index).css('display', 'block');
	} else {
		//改变DataTable对象里的值
	    $("#productorTable").DataTable().rows().data()[index].catlateid = "";
	    $("#productorTable").DataTable().rows().data()[index].employeeid = "";
		$("#viewTemplate" + index).css('display', 'none');
	}
}

//雇员table
var employeeTables;
//模板table
var savedTemplateTables;
//产品id
var productoridforsearch = "";
//入库的仓库id
var mapid ="";
//雇员id
var employeeid = "";
// 记录条行
var indexmark = 0;
/**
 * 显示
 */
var viewTemplate = function ( index ) {
	//清理map已经保存过了的数据。避免勾选错误
	com.leanway.clearTableMapData("saveTemplateTables");
	com.leanway.clearTableMapData("employeeTables");
	// 弹出modal
	$('#templateModal').modal({backdrop: 'static', keyboard: true});
	//查询条件置空
	$("#templateSearchValue").val("");
	//设置入库仓库的id
	mapid = productorTable.rows().data()[index].receiptmapid
	//设置产品的id
	productoridforsearch = productorTable.rows().data()[index].productorid;
	//记录第几行
	indexmark = index;
	checkTemplate(productoridforsearch,mapid);
	if (employeeTables == null || employeeTables == "undefined" || typeof(employeeTables) == "undefined") {
		employeeTables = initEmployeeTables( productoridforsearch );
		savedTemplateTables = initSavedTemplateTables( productoridforsearch );
	} else {
		$("#templateSearchValue").val("");
		employeeTables.ajax.url("../../../../"+ln_project+"/transferStore?method=queryEmployeeList&productorid=" + productoridforsearch + "&mapid=" + mapid).load();
		savedTemplateTables.ajax.url("../../../../"+ln_project+"/transferStore?method=querySavedTemplateTables&productorid=" + productoridforsearch + "&mapid=" + mapid).load();
	}
}

/**
 * 初始化模板表
 */
var initEmployeeTables = function (productorid  ) {
	var table = $('#employeeTables').DataTable({
		"ajax" : '../../../../'+ln_project+'/transferStore?method=queryEmployeeList&productorid=' + productorid + "&mapid=" + mapid,
//		"iDisplayLength" : "8",
		'bPaginate' : true,
		"bDestory" : true,
		"bRetrieve" : true,
		"bFilter" : false,
		"bSort" : false,
	//	"scrollX": true,   //会造成table不是完全撑开的，
	//	"scrollY":"200px",  //会造成table不是完全撑开
		//"sScrollY" : 450, // DataTables的高
		//"sScrollX" : 400, // DataTables的宽
		/*"bAutoWidth" : true,*/ // 宽度自适应
		"bProcessing" : true,
		"bServerSide" : true,
		 "columns": [
		             { "data": "employeeid" },
		             { "data": "name"},
		             { "data": "deptname"},
		             { "data": "phone"}
		          ],
		"aoColumns" : [
				{
					"mDataProp" : "employeeid",
					"fnCreatedCell" : function(nTd, sData,
							oData, iRow, iRow) {
						$(nTd).html("<div id='stopPropagation" + iRow +"'>"
								   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='employeeCheckList' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label> </div>");
                           com.leanway.columnTdBindSelectNew(nTd,"employeeTables","employeeCheckList");
					}
				}, {
					"mDataProp" : "name"
				},  {
					"mDataProp" : "deptname"
				},{
					"mDataProp" : "phone"
				}],
		"fnCreatedRow" : function(nRow, aData, iDataIndex) {

		},
		"oLanguage" : {
        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
         },
		"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		"fnDrawCallback" : function(data) {
              /* //点击事件
               com.leanway.dataTableClickMoreSelect("templateTables","templateCheckList",false,templateTables,loadTemplate,undefined,undefined,undefined);*/
			// 方法延时,2个table时，页面加载缓慢，如果不延时会出现没有勾选上的情况。
			setTimeout(function () {
				com.leanway.setDataTableSelect("employeeTables","employeeCheckList",savedemployeeid);
			}, 100);

		}
	}).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );
	return table;
}
/**
 * 初始化质检表
 */
var initSavedTemplateTables = function ( productorid ) {
	var table = $('#saveTemplateTables').DataTable({
		"ajax" : '../../../../'+ln_project+'/transferStore?method=querySavedTemplateTables&productorid=' + productorid + "&mapid=" + mapid,
//		"iDisplayLength" : "8",
		'bPaginate' : true,
		"bDestory" : true,
		"bRetrieve" : true,
		"bFilter" : false,
		"bSort" : false,
	//	"scrollX": true,   //会造成table不是完全撑开的，
	//	"scrollY":"200px",  //会造成table不是完全撑开
		//"sScrollY" : 450, // DataTables的高
		//"sScrollX" : 400, // DataTables的宽
		"bAutoWidth" : true, // 宽度自适应
		"bProcessing" : true,
		"bServerSide" : true,
		 "columns": [
		             { "data": "catlateid" },
		             { "data": "templatename"},
		             { "data": "version"},
		             { "data": "name"}
		          ],
		"aoColumns" : [
				{
					"mDataProp" : "catlateid",
					"fnCreatedCell" : function(nTd, sData,
							oData, iRow, iRow) {
						$(nTd).html("<div id='stopPropagation" + iRow +"'>"
								   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='saveTemplateCheckList' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label> </div>");
                           com.leanway.columnTdBindSelectNew(nTd,"saveTemplateTables","saveTemplateCheckList");
					}
				}, {
					"mDataProp" : "templatename"
				},{
					"mDataProp" : "version"
				},{
					"mDataProp" : "name"
				}],
		"fnCreatedRow" : function(nRow, aData, iDataIndex) {
		},
		"oLanguage" : {
        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
         },
		"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		"fnDrawCallback" : function(data) {
			//多选会有问题。
		//	com.leanway.dataTableClickMoreSelect("employeeTable","checkEmployeeList",true,employeeTable,undefined,undefined,undefined);
			// 方法延时,2个table时，页面加载缓慢，如果不延时会出现没有勾选上的情况。
			setTimeout(function () {
				com.leanway.setDataTableSelect("saveTemplateTables","saveTemplateCheckList",savedcatlateid);
			}, 100);
		}
	}).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );


	return table;
}

/**
 * 查询模板
 */
var searchTemplate = function () {

	var productorid = productoridforsearch;
	var searchValue = "";
	if($("#templateSearchValue").val() != ""){
		searchValue =  $("#templateSearchValue").val();
	}

	employeeTables.ajax.url("../../../../"+ln_project+"/transferStore?method=queryTemplateList&searchValue=" + searchValue +"&mapid=" + mapid).load();

}

//已经保存了的雇员id
var savedemployeeid = "";
//已经保存了的模板id
var savedcatlateid = "";
/**
 *
 */
var checkTemplate = function ( productorid,receiptmapid ) {
	var resourceid ="";
	if(productorTable.rows().data()[indexmark].transferdetailid != null && productorTable.rows().data()[indexmark].transferdetailid != ""
		&& productorTable.rows().data()[indexmark].transferdetailid != undefined ){
		resourceid = productorTable.rows().data()[indexmark].transferdetailid;
	}
	$.ajax ( {
	type : "post",
	url : "../../../../"+ln_project+"/transferStore",
	data : {
		"method" : "checkTemplate",
		"productorid" : productorid,
		"mapid" : receiptmapid,
		"resourceid" :resourceid
	},
	dataType : "json",
	async : false,
	success : function ( data ) {

		var flag =  com.leanway.checkLogind(data);

		if(data){
			if (data.data.employeeid != null && data.data.employeeid != "") {
				savedemployeeid = data.data.employeeid;
			}
			if (data.data.catlateid != null && data.data.catlateid != "") {
				savedcatlateid = data.data.catlateid;
			}

		}

	}
});
}

/**
 * 保存质检模板
 */
var saveTemplate = function ( ) {
		//改变DataTable对象里的值
	    var tableObj = $("#productorTable").DataTable();
	    // 获取修改的行数据
	    var productor = tableObj.rows().data()[indexmark];

	    productor.employeeid = com.leanway.getCheckBoxData(2, "employeeTables", "employeeCheckList");
	    productor.catlateid= com.leanway.getCheckBoxData(2, "saveTemplateTables", "saveTemplateCheckList");
		$('#templateModal').modal('hide');
		//重新加载table但不会重置分页
		employeeTables.ajax.reload();
		 //重新加载table会重置分页
		savedTemplateTables.ajax.reload();
}



//=============================================================================================

//删除出入单  【明细】
function deleteTransferStoreDetail(){
	var data = $("#productorTable tbody input[type=checkbox]:checked");
    if(data.length == 0) {
        lwalert("tipModal", 1, "请选择需要删除的数据!");
        return;
    }
	if(opeMethod == 'addInOutAdditional'){
		 $("input[name=productorCheck]:checked").each(function(index){
			$(this).parent().parent().remove();
		})  //  input  td  tr   页面删除该行
 		return;
	}
	var ids = com.leanway.getCheckBoxData(1, "productorTable", "productorCheck");     //明细id
	var arr = ids.split(",");
	if(ids.length < 1 || ids ==''){
		if(ope == 'updateAdditional'){
			 $("input[name=productorCheck]:checked").each(function(index){
				 	if($(this).val() == ''){
				 		$(this).parent().parent().remove();//修改操作时，新增的明细，未点击保存，在页面上删除【 页面删除】
				 	}
				})
		}else{
			lwalert("tipModal", 1, "请选择需要删除的出入单！！");
		}
		return;
	}
	if(arr.length != 0){             //删除该表头下选中所有的明细
		lwalert("tipModal", 2, "确定要删除选中的数据吗？","sureDeleteAdditionalDetail(1,1) ");
		return;
	}
}


//确定删除杂出明细单  【明细】
function sureDeleteAdditionalDetail(type,pagetype){
	var ids;
	if(type == 1){
		ids = com.leanway.getCheckBoxData(1, "productorTable", "productorCheck");
	}else{
			ids = com.leanway.getCheckBoxData(2, "productorTable", "productorCheck");
	}
	var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
	$.ajax({
	type : "post",
	url : "../../../"+ln_project+"/additional?method=deleteAdditionalDetailOut",
	traditional: true,  //传递数组 (这里没用到  可以不配)
	data : {
		"type" : type,   
		"ids"  : ids,
		"confirmstatus" : 0
	},
	dataType : "text",
	async : false,
	success : function(text) {
		 var flag =  com.leanway.checkLogind(text);
		 if ( flag ) {
		 var jdata = $.parseJSON(text);
    	 if(jdata.status=='success'){

 	    		 if(opeMethod == 'updateAdditional'){
 	    			 $("input[name=productorCheck]:checked").each(function(index){
 	    				 		$(this).parent().parent().remove();
 	    				})
 	    		}
 	    		 if(type == 2){//删除整个出入单，重新加载table
 	        		 com.leanway.clearTableMapData("productorTable");
 	         	     com.leanway.dataTableUnselectAll("productorTable","productorCheck");
 	        		 oTable.ajax.reload();
 	    		 }
 	    		 lwalert("tipModal", 1, jdata.info);   //  lwalert("tipModal", 1,data.info);
 	    	 }else{
 	    		 lwalert("tipModal", 1, jdata.info);
 	    	 }
 		}
 	}
})
}


//==================================================================
/**
 * 删除产品
 *
 * @pram type 0：删除全部数据，1：选中checkbox数据
 *
 */
var delProductor = function ( type ) {


    // 删除选中行的数据
    if ( type == 1 ||  type == undefined || typeof(type) == "undefined") {

        $("#productorTable tbody tr").each(function() {

            // 获取该行的下标
            var index = productorTable.row(this).index();

            if ($(this).find("td:eq(0)").find("input[name='productorCheck']").prop("checked") == true) {
                productorTable.rows(index).remove().draw(false);
            }

        });

    } else if ( type == 0 ) {

        $("#productorTable tbody tr").each(function() {

            // 获取该行的下标
            var index = productorTable.row(this).index();

            productorTable.rows(index).remove().draw(false);

        });
    }
}

function loadStoreInfo(index,productorid,batch,calloutmapid,subbatch,serialnumber,versionid){
    $.ajax({
        type : "get",
        url : "../../../../"+ln_project+"/transferStore",
        data : {
            method : "queryStoreInfo",
            "productorid" : productorid,
            "batch":batch,
            "calloutmapid":calloutmapid,
            "serialnumber":serialnumber,
            "subbatch":subbatch,
            "versionid":versionid
        },
        dataType : "json",
        success : function(data) {
            var flag =  com.leanway.checkLogind(data);

            if(flag){
            	if(data!=null){
            		productorTable.rows().data()[index].stockunits=data.unitsid;
                    productorTable.rows().data()[index].countnew=data.count;
                    productorTable.rows().data()[index].productordesc=data.productordesc;
                    $("#stockunitsname"+index).val(data.unitsname);
                    $("#countnew"+index).val(data.count);
                    $("#productordesc"+index).val(data.productordesc);
            	}else{
            		productorTable.rows().data()[index].stockunits="";
                    productorTable.rows().data()[index].countnew="";
                    productorTable.rows().data()[index].productordesc="";
                    $("#stockunitsname"+index).val("");
                    $("#countnew"+index).val("");
                    $("#productordesc"+index).val("");
                    
            	}
                
            }

        },

    });
}

function saveTransferStore(){
	function getConversionrate(){
		var conversionrateList = $("#productorTable").find("input.conversionrate");
		if(conversionrateList != null){
			$(conversionrateList).each(function(i,e){
				if(e.value == null || e.value == ""){
					return false;
				}
			})
		}else{
			return false;
		}
		return true;
	}
	
	if( ($("#tradetype").val() == null || $("#tradetype").val() == "")){
		lwalert("tipModal", 1, "请选择交易类型");
		return;
	}
	
	//调拨转仓单选框
	var allotttransferr = $("#additionalForm input[type='radio']:checked").val();
	var tradetype =  $("#tradetype").val();
	var comment = $("#comment").val();
	//计划发货日期
	var plannedDeliveryDate = $("#plannedDeliveryDate").val();
	//计划到货日期
	var planTheDeliveryDate = $("#planTheDeliveryDate").val();
	
	
	// 换算率
	if(!getConversionrate()){
		lwalert("tipModal", 1, "请输入换算率");
		return;
	}
	if(getDataTableData(productorTable)=="[]"){
        lwalert("tipModal", 1, "未添加产品明细，不能保存！");
        return;
    }
	
    formData = "{\"tablename\":\"transferstore\",\"additionalDetailList\" : "+getDataTableData(productorTable)+"}";   
    $.ajax({
        type : "get",
        url : "../../../../"+ln_project+"/additional",
        data : {
            method : opeMethod,
            formdata:formData,
            "tradetype" : tradetype,
            "allotttransferr" : allotttransferr,
            "comment" : comment,
            "plannedDeliveryDate" : plannedDeliveryDate,
            "planTheDeliveryDate" : planTheDeliveryDate
        },
        dataType : "json",
        success : function(data) {
            var flag =  com.leanway.checkLogind(data);

            if(flag){
                if(data.status=="success"){
                    $("input[type=radio][name=confirmstatus][value=0]").prop('checked',true);
                    searchTransferStore();
                    oTable.ajax.reload();
                    productorTable.ajax.reload();
                }
                lwalert("tipModal", 1, data.info);
            }

        },

    });
}


/**
 * tableObj datatable对象
 *
 * 获取Table对象数据
 */
var getDataTableData = function(tableObj) {
    var jsonData = "[";

    var dataList = tableObj.rows().data();

    if (dataList != undefined && typeof (dataList) != "undefined"
            && dataList.length > 0) {
    	
    	// 获取交易类型 conversionrate1
    	var tradetype = $("#tradetype").val();
    	
    if(opeMethod == 'addInOutAdditional'){
    	var tdList = $("#productorTable").find("input.conversionrate").parent("td");
        // 循环遍历Table数据
        for (var i = 0; i < dataList.length; i++) {
            var productorData = dataList[i];
            // 封装换算率
            $(tdList).each(function(j,e){
            	if(j == i){
            		if(opeMethod == 'addInOutAdditional'){
	            		var conversionrate = $(e).children("input[name='conversionrate1']").val()+"/"+$(e).children("input[name='conversionrate2']").val();
	            		productorData.conversionrate = conversionrate;
            		}
            	}
            })
            
            jsonData += JSON.stringify(productorData) + ",";
        }
     	} else {
   		
   		 for (var i = 0; i < dataList.length; i++) {
    	            var productorData = dataList[i];
    	            // 封装换算率
    	            var conversionrate = $("#conversionrate"+i).val();
            		productorData.conversionrate = conversionrate;
    	            jsonData += JSON.stringify(productorData) + ",";
    	        }
    		
            }
    
    	}
    jsonData = jsonData.replace(reg, "");
    jsonData += "]";
    return jsonData;
}
//改变DataTable对象里的值
var setDataTableValue = function(obj, index, tableName) {

    var tableObj = $("#" + tableName).DataTable();

    // 获取修改的行数据
    var productor = tableObj.rows().data()[index];

    // 循环Json key,value，赋值
    for ( var item in productor) {

        // 当ID相同时，替换最新值
        if (item == obj.name) {

            productor[item] = obj.value;

        }

    }

}

function ajaxLoadTransferStore(transferid){
    $("#addProductorButton").prop("disabled",true);
    $("#delProductorButton").prop("disabled",true);
    $("#saveProductorButton").prop("disabled",true);
    productorTable.ajax.url('../../../../'+ln_project+'/additional?method=queryAdditionalDetailByConditions&conditions=' + encodeURI('{"additionalid": \"'+transferid+'\"}')).load();

}

var updateTransferStore = function ( ) {

    var data = oTable.rows('.row_selected').data();
    if (data.length == 0) {

        lwalert("tipModal", 1, "请选择转移出入库单修改!");
        return;

    } else if (data.length > 1) {

        lwalert("tipModal", 1, "只能选择一条转移出入库单修改!");
        return;

    } else {

        var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
        if(confirmstatus == 1){
            $("#addProductorButton").prop("disabled",true);
            $("#delProductorButton").prop("disabled",false);
            $("#saveProductorButton").prop("disabled",true);
            opeMethod = "updateAdditional";
            com.leanway.clearTableMapData( "generalInfo" );
            productorTableToEdit();
            $("select[name=qualitycheck]").css('display', 'block');
        } else if(confirmstatus == 0){
        	 $("#addProductorButton").prop("disabled",false);
             $("#delProductorButton").prop("disabled",false);
             $("#saveProductorButton").prop("disabled",false);
             opeMethod = "updateAdditional";
             com.leanway.clearTableMapData( "generalInfo" );
             productorTableToEdit();
             $("select[name=qualitycheck]").css('display', 'block');
        }else{
            lwalert("tipModal", 1, "已出库的单据，不能再进行修改！");
        }

    }
}

/**
 * 新增采购订单
 */
var addTransferStore = function ( ) {

    $("#tradetype").prop("disabled",false);
	$("input[name='allotttransferr']").prop("disabled",false);
	$("#comment").prop("disabled",false);
    opeMethod = "addInOutAdditional";
    $("#addProductorButton").prop("disabled",false);
    $("#delProductorButton").prop("disabled",false);
    $("#saveProductorButton").prop("disabled",false);
    com.leanway.clearTableMapData( "generalInfo" );  
    com.leanway.clearTableMapData( "productorTable" ); 
   // com.leanway.dataTableUnselectAll("generalInfo", "checkList");  productorTable
    resetForm();
    // 删除对应的产品数据
    delProductor(0);
    //$("#additionalForm").reset();
    // 新增一行数据
    //addProductor();   
    //清空table表单
    //$("#productorTable tbody").html("");
}

function isNumber() {
    var calloutcount = document.getElementsByName("calloutcount");
    for (var i = 0; i < calloutcount.length; i++) {

        calloutcount[i].value = calloutcount[i].value.replace(/[^\d.]/g, '');

    }
}

function addStore(){
        var ids = com.leanway.getCheckBoxData(1, "generalInfo", "checkList");
        var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
        if(confirmstatus==1){
            lwalert("tipModal", 1, "已确认入库，不能再进行确认");
            return;
        }
        if(ids.length==0){
            lwalert("tipModal", 1, "请选择转移单，再进行确认");
            return;
        }
        $.ajax({
            type : "get",
            url : "../../../../"+ln_project+"/transferStore",
            data : {
                method : "confirmTransferStore",
                ids:ids

            },
            dataType : "json",
            success : function(data) {
                var flag =  com.leanway.checkLogind(data);
                if(flag){
                    if(data.code=="success"){
                        oTable.ajax.reload();
                        productorTable.ajax.reload();
                        com.leanway.clearTableMapData( "generalInfo" );
                    }
                    lwalert("tipModal", 1, data.msg);
                }

            },

        });
}

function clearData(index,productorid,batch,subbatch,serialnumber,count,calloutcount,unitsname,versionid){
    $("#productorid"+index).val(productorid).trigger("change");
    $("#versionid"+index).val(versionid).trigger("change");
    $("#batch"+index).val(batch).trigger("change");

    $("#serialnumber"+index).val(serialnumber).trigger("change");
    $("#subbatch"+index).val(subbatch).trigger("change");;

    $("#countnew"+index).val(count);
    $("#stockunitsname"+index).val(unitsname);

    productorTable.rows().data()[index].productorid = productorid
    productorTable.rows().data()[index].versionid = versionid
    productorTable.rows().data()[index].batch = batch
    productorTable.rows().data()[index].subbatch = subbatch

    productorTable.rows().data()[index].serialnumber = serialnumber
    productorTable.rows().data()[index].countnew = count
    productorTable.rows().data()[index].stockunitsname = unitsname

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
var deleteTransferStore = function ( type ) {

    if (type == undefined || typeof(type) == "undefined") {
        type = 1;
    }
    var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
    if(confirmstatus != 2){  //已经转移的单据是不可以删除的
        var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");

        if (ids.length > 0) {

            var msg = "确定删除选中的" + ids.split(",").length + "条转移单?";

            lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
        } else {
            lwalert("tipModal", 1,"至少选择一条记录操作");
        }
    }else{
        lwalert("tipModal", 1, "已确认出入库，不能再进行删除！");
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
        url : "../../../../"+ln_project+"/additional?method=deleteAdditional",
        data : {
        	ids :ids,
        	type:2
        },
        dataType : "json",
        async : false,
        success : function(data) {

            var flag =  com.leanway.checkLogind(data);

            if(flag){

                if (data.status == "success") {

                    com.leanway.clearTableMapData( "generalInfo" );
                    oTable.ajax.reload(); // 刷新dataTable
                    productorTable.ajax.reload();
                    lwalert("tipModal", 1,data.info);
                } else {
                    lwalert("tipModal", 1,data.info);
                }

            }
        }
    });
}

$("input[name='allotttransferr']").change(function(){
	// 1：转仓；2：调拨
	if($(this).val() == 1){  
		$("#plannedDeliveryDate").prop("disabled",true);
	    $("#planTheDeliveryDate").prop("disabled",true);
		// 获取交易类型
		$.ajax({
			url: "../../../../" + ln_project + "/codeMap",
			type: "post",
			data: {
				"method" : "queryCodeMapList",
				"t":"TransferList",
				"c":"TransferList"
			},
			dataType: "json",
			success: function(data){
				// 清空数据
				$("#tradetype").empty();
				// 把信息放入select
				var option = "<option value=''>--请选择转仓类型--</option>";
				$.each(data,function(index,e) {
					option += "<option value='"+ e.codevalue +"'>";
					option += e.note;
					option += "</option>";
				});
				$("#tradetype").append(option);
			}
		});
	}else{
		$("#plannedDeliveryDate").prop("disabled",false);
	    $("#planTheDeliveryDate").prop("disabled",false);
		// 获取交易类型
		$.ajax({
			url: "../../../../" + ln_project + "/codeMap",
			type: "post",
			data: {
				"method" : "queryCodeMapList",
				"t":"AllocationList",
				"c":"AllocationList"
			},
			dataType: "json",
			success: function(data){
				// 清空数据
				$("#tradetype").empty();
				// 把信息放入select
				var option = "<option value=''>--请选择调拨类型--</option>";
				$.each(data,function(index,e) {
					option += "<option value='"+ e.codevalue +"'>";
					option += e.note;
					option += "</option>";
				});
				$("#tradetype").append(option);
			}
		});
	}
})

function setFormValue(data) {
	
	if(data==null||data=="null"){
		return;
	}
	resetForm();
	
	
	// 给表头赋值
	$("#comment").val(data.comment);
	$("#plannedDeliveryDate").val(data.plannedDeliveryDate);
	$("#planTheDeliveryDate").val(data.planTheDeliveryDate);
	if(data.allotttransferr === "1"){
		 $("#allotttransferr1").attr("checked",'checked');
		 $("#allotttransferr2").attr("checked",false);
		 $("#tradetype").val(data.tradetype);
	 } else if(data.allotttransferr === "2"){
		 $("#allotttransferr1").attr("checked",false);
		 $("#allotttransferr2").attr("checked",'checked');
		 $("#tradetype").val(data.tradetype);
	 } else {
		 $("#allotttransferr1").attr("checked", false);
		 $("#allotttransferr2").attr("checked",false);
	 } 
}

function resetForm() {


	$('#additionalForm').each(function(index) {
		$('#additionalForm')[index].reset();
	});

}
