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
	// 全选
	 com.leanway.dataTableCheckAll("generalInfo", "checkAll", "checkList");
	 com.leanway.enterKeyDown("searchValue", searchInvoice);
	 
	 initBootstrapValidator();
	 
	 initTimePickYmd("invoicedate");

})

function initBootstrapValidator() {
	$('#invoiceForm').bootstrapValidator({
		excluded : [ ':disabled' ],
		fields : {
			salesorderid : {
				validators : {
					notEmpty : {},
				}
			},
		}
	});
}


// 初始化数据表格
var initTable = function() {

	var table = $('#generalInfo')
			.DataTable(
					{
						"ajax" : "../../../"+ln_project+"/invoice?method=queryInvoiceList",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"scrollY":"250px",
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",
						"columns" : [ {
							"data" : "invoiceid"
						}, {
							"data" : "invoicenumber"
						}, {

							"data" : "invoicedate"
						}, {
							"data" : "username",
						} ],
						"aoColumns" : [
								{
									"mDataProp" : "invoiceid",
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
									"mDataProp" : "invoicenumber"
								}, {
									"mDataProp" : "invoicedate"
								}, {
									"mDataProp" : "username"
								}, ],

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
function ajaxLoadInvoice(invoiceid) {
	
  if (invoiceid != 'undefined'  && invoiceid != 'null' && invoiceid != '') {
	
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/invoice?method=queryInvoiceObject",
		data : {
			"invoiceid" : invoiceid,
		},
		dataType : "text",
		async : false,
		success : function(data) {
			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				$("#invoiceid").val(invoiceid);
				setFormValue(tempData.invoice);

				//给隐藏字段赋值
				invoiceProductorTable.ajax.url( '../../../../'+ln_project+'/invoice?method=queryInvoiceDetailList&invoiceid=' + invoiceid).load();
			}
		}
	});
	
  }else{
	  
	  resetForm();
  }

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
	var salesorderid = data.salesorderid;
	if (salesorderid != null && salesorderid != ""
			&& salesorderid != "null") {
		$("#salesorderid").append(
				'<option value=' + salesorderid + '>'
						+ data.code + '</option>');
		$("#salesorderid").select2("val", [ salesorderid ]);
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
	$("#invoiceForm").data('bootstrapValidator').resetForm();

}

/**
 * 搜索物料追踪单
 */
var searchInvoice = function() {
	 //checkSession();
	var searchVal = $("#searchValue").val();

	oTable.ajax.url(
			"../../../"+ln_project+"/invoice?method=queryInvoiceList&searchValue=" + searchVal)
			.load();
}

//查询出货单
function searchIncoive () {

	 oTable.ajax.url("../../../../"+ln_project+"/invoice?method=queryInvoiceList").load();
	
}


var initProductorTable = function () {
    var editTable = $("#invoiceProductorTable").DataTable({
            "ajax" : '../../../../'+ln_project+'/invoice?method=queryInvoiceDetailList&invoiceid=1',
            'bPaginate': false,
            "bRetrieve": true,
            "bFilter":false,
            "scrollX": true,
            "bSort": false,
            "bProcessing": true,
            "bServerSide": false,
            "aoColumns" : [
            {
                "mDataProp" : "invoicedetail",
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
                "mDataProp" : "unitsname"
            },
            {
                "mDataProp" : "cansendcount"
            },
            {
                "mDataProp" : "sendcount"
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
