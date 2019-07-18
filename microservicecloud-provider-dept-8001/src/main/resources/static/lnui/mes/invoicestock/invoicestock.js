var clicktime = new Date();
var opeMethod = "addInvoice";
var oTable;
var invoiceProductorTable;
var reg = /,$/gi;
var tempDetailData = "";

$(function() {
	// checkSession();
	// 初始化对象
	com.leanway.loadTags();
	com.leanway.formReadOnly("invoiceForm");
	// 加载datagrid
	oTable = initTable();
	invoiceProductorTable = initProductorTable();
	 com.leanway.enterKeyDown("searchvalue", searchIncoive);
	 com.leanway.enterKeyDown("productor", searchIncoive);
	 $("input[name=confirmstatus]").click(function(){
	        searchIncoive();
	  });
	 var confirmstatus = $('input[name="confirmstatus"]:checked').val();
	 if(confirmstatus!=0){
		 if(confirmstatus==2){	
			$("#deleteFun").prop("disabled",true);
			$("#unConfirm").prop("disabled",true);
		 }else{
			$("#deleteFun").prop("disabled",false);
		 }
		$("#confirm").prop("disabled",true);
	 }else{
		$("#confirm").prop("disabled",false);
		$("#deleteFun").prop("disabled",false);
		$("#unConfirm").prop("disabled",false);
	 }
})

// 初始化数据表格
var initTable = function() {

	var table = $('#generalInfo')
			.DataTable(
					{
                        "ajax" : "../../../../"+ln_project+"/invoice?method=queryAdditional&tablename=invoicestock",
						"pageUrl" : "invoicestock/invoicestock.html",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"scrollY":"150px",
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",						
						"aoColumns" : [
								{
									"mDataProp" : "additionalid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd).html("<div id='stopPropagation" + iRow +"'>"
												   +"<input class='regular-checkbox' type='checkbox' id='" + sData
			                                       + "' name='checkList' value='" + sData
			                                       + "'><label for='" + sData
			                                       + "'></label>");
										 com.leanway.columnTdBindSelectNew(nTd,"generalInfo",
													"checkList");
									}
								},{
									"mDataProp" : "additionalno"
								}, {
									"mDataProp" : "postdate"
								}, {
									"mDataProp" : "invoicenumber"
								}, {
									"mDataProp" : "companioname"
								} ],

						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {
							com.leanway.getDataTableFirstRowId("generalInfo",
									ajaxLoadInvoice,"more","checkList");
							com.leanway.dataTableClickMoreSelect("generalInfo",
									"checkList", false, oTable, ajaxLoadInvoice,undefined,undefined,"checkAll");
							com.leanway.dataTableCheckAllCheck('generalInfo', 'checkAll', 'checkList');
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
function ajaxLoadInvoice(additionalid) {
  if (additionalid != 'undefined'  && additionalid != 'null' && additionalid != '') {

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/invoice?method=queryAdditionalObject",
		data : {
			"formdata" : "{\"additionalid\":\""+additionalid+"\"}",
		},
		dataType : "text",
		async : false,
		success : function(data) {
			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				setFormValue(tempData);
				//给隐藏字段赋值
				invoiceProductorTable.ajax.url( '../../../../'+ln_project+'/invoice?method=queryGroupByDetailList&additionalid=' + additionalid).load();
			}
		}
	});

  }else{

	  resetForm();
  }
  //
  com.leanway.formReadOnly("invoiceForm");
}


/**
 * 填充到HTML表单
 */
function setFormValue(data) {
	resetForm();
	for ( var item in data) {
		$("#" + item).val(data[item]);
	}
}

/**
 * 重置表单
 *
 */
var resetForm = function() {
	$('#invoiceForm').each(function(index) {
		$('#invoiceForm')[index].reset();
	});


}

//查询出货单
function searchIncoive () {
	resetForm();
	invoiceProductorTable.ajax.url( '../../../../'+ln_project+'/invoice?method=queryGroupByDetailList&additionalid=1').load();
	var searchVal = $("#searchvalue").val();
	var productor = $("#productor").val();
	//获取页面的confirmstatus;
	var confirmstatus = $('input[name="confirmstatus"]:checked').val();
	 if(confirmstatus!=0){
		 	if(confirmstatus==2){		
				$("#deleteFun").prop("disabled",true);
				$("#unConfirm").prop("disabled",true);
			 }else{
				$("#deleteFun").prop("disabled",false);
				$("#unConfirm").prop("disabled",false);
			 }
			$("#confirm").prop("disabled",true);
	 }else{
			$("#confirm").prop("disabled",false);
			$("#deleteFun").prop("disabled",false);
			$("#unConfirm").prop("disabled",false);
	 }
	 oTable.ajax.url("../../../../"+ln_project+"/invoice?method=queryAdditional&tablename=invoicestock&confirmstatus="+confirmstatus+"&searchValue="+searchVal+"&productorname="+productor).load();

}

var initProductorTable = function () {
    var editTable = $("#invoiceProductorTable").DataTable({
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
                "mDataProp" : "productorname"
            },
            {
                "mDataProp" : "productordesc"
            },{
                "mDataProp" : "version"
            }
            ,{
                "mDataProp" : "material"
            },{
                "mDataProp" : "mapname"
            },  
              {
                "mDataProp" : "batch"
              },
                           
            {
                "mDataProp" : "stockunitsname"
            },
            {
                "mDataProp" : "count"
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
 * tableObj datatable对象
 *
 * 获取Table对象数据
 */
var getDataTableData = function(tableObj) {

	var jsonData = "[";

	var dataList = tableObj.rows().data();
	if (dataList != undefined && typeof (dataList) != "undefined" && dataList.length > 0) {

		// 循环遍历Table数据
		for (var i = 0; i < dataList.length; i++) {
			var productorData = dataList[i];

			jsonData += JSON.stringify(productorData) + ",";

		}
	}
	jsonData = jsonData.replace(reg, "");

	jsonData += "]";

	return jsonData;
}
/**
 * 修改功能
 */
var updateInvoiceStock = function () {
	var data = oTable.rows('.row_selected').data();
	if(data.length!=1){
		lwalert("tipModal", 1, "请选择一条记录进行修改！");
	}
	//将按钮可点
	$("#saveOrUpdate").prop("disabled",false);
	invoiceProductorTableToEdit();
}
//保存方法
var saveInvoice = function(){
			$.ajax({
				type : "POST",
				url : "../../../"+ln_project+"/additional",
				data : {
					"method" : "updateStockDetail",
					"paramData" : getDataTableData(invoiceProductorTable),
				},
				dataType : "text",
				async : false,
				success : function(data) {

					var flag =  com.leanway.checkLogind(data);

					if(flag){


						var tempData = $.parseJSON(data);
						if (tempData.status == "success") {

							//将新增和删除设置为不可选
							$("#addProductorButton").prop("disabled",true);
							$("#delProductorButton").prop("disabled",true);
							com.leanway.formReadOnly("invoiceForm");

							com.leanway.clearTableMapData( "generalInfo" );
							oTable.ajax.reload();
//							ajaxLoadInvoice(tempData.result.resultObj.invoiceid);

						} 
						lwalert("tipModal", 1, tempData.info);
					}
				}
			});

}
/**
 * 采购产品变成可编辑
 */
var invoiceProductorTableToEdit = function ( ) {
	
	var productorId = "";
	
	 if (invoiceProductorTable.rows().data().length > 0) {
         $("#invoiceProductorTable tbody tr").each( function( ) {
             // 获取该行的下标
             var index = invoiceProductorTable.row(this).index();
             var packnum = invoiceProductorTable.rows().data()[index].packnum;
	         //件数
	         $(this).find("td:eq(8)").html('<input type="text" class="form-control" style="width:100px"  onblur="setDataTableValue(this, '+ index+ ',\'invoiceProductorTable\')" name="packnum" id="packnum"  value="'+ (packnum||"") + '">');
             var specification = invoiceProductorTable.rows().data()[index].specification;
	         //规格
	         $(this).find("td:eq(9)").html('<input type="text" class="form-control" style="width:100px"  onblur="setDataTableValue(this, '+ index+ ',\'invoiceProductorTable\')" name="specification" id="specification"  value="'+ (specification||"") + '">');
         });

         invoiceProductorTable.columns.adjust();
     }
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

function confirm(){
	var ids = com.leanway.getCheckBoxData(1, "generalInfo", "checkList");
	if(ids.length<=0){
		lwalert("tipModal", 1, "请选择销售备货单进行确认！");
		return;
	}
	lwalert("tipModal", 2, "您确订将该备货单进行确认吗？确认后无法取消！" ,"confirmInvoiceStock()");
}
function confirmInvoiceStock(){
	var ids = com.leanway.getCheckBoxData(1, "generalInfo", "checkList");
	if(ids.length<=0){
		lwalert("tipModal", 1, "请选择销售备货单进行确认！");
		return;
	}
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/invoice?method=updateConfirmStatus",
		data : {
			"additionalid" : ids,
			"confirmstatus":"1"
		},
		dataType : "text",
		async : false,
		success : function(data) {
			var flag =  com.leanway.checkLogind(data);

			if(flag){
				resetForm();
				invoiceProductorTable.ajax.url( '../../../../'+ln_project+'/invoice?method=queryGroupByDetailList&additionalid=1').load();
				oTable.ajax.reload();
			}
		}
	});
}
function deleteInvoiceStock(type) {

	 if (type == undefined || typeof(type) == "undefined") {
			type = 1;
		}

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");

	if (ids.length>0) {
       var msg = "确定删除选中的" + ids.split(",").length + "条备货单?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	} else {
		lwalert("tipModal", 1, "至少选择一条记录进行删除操作！");
	}
}

function isSureDelete(type){

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
	deleteAjax(ids);
}
//删除物料追踪单
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/invoice?method=deleteInvoiceStock",
		data : {
			"additionalid" : ids
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
				if (tempData.status == "success") {
					resetForm();
					com.leanway.clearTableMapData( "generalInfo" );
					invoiceProductorTable.ajax.url( '../../../../'+ln_project+'/invoice?method=queryGroupByDetailList&additionalid=1').load();
					oTable.ajax.reload(null,false);
				} 
				lwalert("tipModal", 1, tempData.info);
				

			}
		}
	});
}

function unConfirm(){
	var ids = com.leanway.getCheckBoxData(1, "generalInfo", "checkList");
	if(ids.length<=0){
		lwalert("tipModal", 1, "请选择销售备货单进行反审核！");
		return;
	}
	
	 var confirmstatus = $('input[name="confirmstatus"]:checked').val();
	
	 if(confirmstatus==0){
		 lwalert("tipModal", 1, "销售备货单还未进行审核，不能执行反审核！");
			return;
	 }

	 if(confirmstatus==2){
		 lwalert("tipModal", 1, "该销售备货单已出货，不能执行反审核！");
			return;
	 }
	lwalert("tipModal", 2, "您确订将该备货单进行反审核吗？" ,"unConfirmInvoiceStock()");
}
function unConfirmInvoiceStock(){
	var ids = com.leanway.getCheckBoxData(1, "generalInfo", "checkList");
	if(ids.length<=0){
		lwalert("tipModal", 1, "请选择销售备货单进行反审核！");
		return;
	}
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/invoice?method=updateConfirmStatus",
		data : {
			"additionalid" : ids,
			"confirmstatus":"0"
		},
		dataType : "text",
		async : false,
		success : function(data) {
			var flag =  com.leanway.checkLogind(data);

			if(flag){
				resetForm();
				invoiceProductorTable.ajax.url( '../../../../'+ln_project+'/invoice?method=queryGroupByDetailList&additionalid=1').load();
				oTable.ajax.reload();
			}
		}
	});
}