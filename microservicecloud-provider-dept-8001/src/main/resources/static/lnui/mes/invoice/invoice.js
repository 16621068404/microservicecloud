var clicktime = new Date();
var opeMethod = "addInvoice";
var oTable;
var invoiceProductorTable;
var reg = /,$/gi;

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
	 com.leanway.enterKeyDown("searchvalue", searchIncoive);
	 com.leanway.enterKeyDown("productor", searchIncoive);
	 $("input[name=confirmstatus]").click(function(){
	        searchIncoive();
	  });
	 $("input[name=ordertype]").click(function(){
		    searchIncoive();
	 });
	 var confirmstatus = $('input[name="confirmstatus"]:checked').val();
	 if(confirmstatus!=0){
		$("#updateFun").prop("disabled",true);
		$("#delFun").prop("disabled",true);
	 }else{
		$("#updateFun").prop("disabled",false);
		$("#delFun").prop("disabled",false);
	 }
	 initBootstrapValidator();
	 initTimePickYmd("invoicedate");
	 $("#addProductorButton").prop("disabled",true);
	 $("#delProductorButton").prop("disabled",true);
	 com.leanway.initSelect2("#salesorderid", "../../../"+ln_project+"/invoice?method=querySalesOrder", "搜索合同号");

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
						"pageUrl" : "invoice/invoice.html",
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
									"mDataProp" : "code"
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
	//将新增删除按钮不可点
	$("#addProductorButton").prop("disabled",true);
	$("#delProductorButton").prop("disabled",true);
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
				console.info(tempData)
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

function deleteInvoice(type) {

	 if (type == undefined || typeof(type) == "undefined") {
			type = 2;
		}

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");

	if (ids.length>0) {
        var msg = "确定删除选中的" + ids.split(",").length + "条出货单?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	} else {
		lwalert("tipModal", 1, "至少选择一条记录进行删除操作！");
	}
}

function isSureDelete(type){

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
	deleteAjax(ids);
}
// 删除物料追踪单
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/invoice?method=deleteInvoice",
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
					com.leanway.clearTableMapData( "generalInfo" );
					oTable.ajax.reload(null,false);
				} else {
					lwalert("tipModal", 1, "操作失败！");
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
 * 新增
 *
 */
var addInvoice = function() {
	// 清空表单
	resetForm();
	com.leanway.removeReadOnly("invoiceForm");
	$("#companioname").prop("readonly",true);
	com.leanway.dataTableUnselectAll("generalInfo", "checkAll");
	com.leanway.dataTableUnselectAll("generalInfo", "checkList");
	$("#invoicenumber").attr("readonly","readonly");
	com.leanway.clearTableMapData( "generalInfo" );
	$("#invoiceProductorTable tbody tr").each(function() {

		// 获取该行的下标
		var index = invoiceProductorTable.row(this).index();

		invoiceProductorTable.rows(index).remove().draw(false);

	});


	opeMethod = "addInvoice";
	//然后将新增，删除按钮可选

	$("#addProductorButton").prop("disabled",false);
	$("#delProductorButton").prop("disabled",false);
	//新增一行
	addProductor();
}
/**
 * 重置表单
 *
 */
var resetForm = function() {
	//给隐藏字段赋值
	invoiceProductorTable.ajax.url( '../../../../'+ln_project+'/invoice?method=queryInvoiceDetailList&invoiceid=1').load();
	$('#invoiceForm').each(function(index) {
		$('#invoiceForm')[index].reset();
	});

	$("#tableHead").html("");
	$("#tableBody").html("");

	$("#salesorderid").val(null).trigger("change");
	$("#invoiceForm").data('bootstrapValidator').resetForm();
	
}
/**
 * 往里面存数据
 */

var saveInvoice = function() {
	var form = $("#invoiceForm").serializeArray();
	// 后面确认时应 检测模具编号是否已存在
	var formData = formatFormJson(form);
	$("#invoiceForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#invoiceForm').data('bootstrapValidator').isValid()) {
		//判断出货的发货数量是否为空

		//让用户把 发货数量必填
		var tempData = $.parseJSON(formData);
		if (tempData.invoicedate == undefined || tempData.invoicedate == null ||tempData.invoicedate =='' ){
			lwalert("tipModal", 1, "申请日期不能为空");
			return ;
		}
		var invoiceDetailVal =  tempData.invoiceDetailVal;
		if (invoiceDetailVal ==undefined || invoiceDetailVal==null || invoiceDetailVal ==''||invoiceDetailVal=="[]") {
			lwalert("tipModal", 1, "产品为空，不能进行保存");
			return ;
		}
		for(var i =0 ; i<invoiceDetailVal.length ;i++){
			if (invoiceDetailVal[i].sendcount == undefined ||invoiceDetailVal[i].sendcount ==null || invoiceDetailVal[i].sendcount == ''){

					lwalert("tipModal", 1, "发货数量为空,不能进行保存!!!");
					return ;
			}else if (isNaN(invoiceDetailVal[i].sendcount)){
					lwalert("tipModal", 1, "可发货数只能为数字!!!");
					return ;
			}
		}
		// 返回true、false
		if(formData.invoiceDetailVal!="[]"){
			save(formData);
		}
		}
	   else{
			lwalert("tipModal", 1, "产品为空不能保存！");
		}
}
//保存方法
var save = function(formData){
	if(invoicedate!=""){
			$.ajax({
				type : "POST",
				url : "../../../"+ln_project+"/invoice",
				data : {
					"method" : opeMethod,
					"formData" : formData,
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

						} 
						lwalert("tipModal", 1, tempData.info);
					}
				}
			});
	}else{
		lwalert("tipModal", 1, "申请日期不能为空！");
	}

}



// 格式化form数据
var formatFormJson = function(formData) {

	var data = "{";
	for (var i = 0; i < formData.length; i++) {
		if (formData[i].name == "invoiceDetailVal") {
			data += "\"" + formData[i].name + "\" : " + formData[i].value + ",";
		} else {
			data += "\"" + formData[i].name + "\" : \"" + formData[i].value
					+ "\",";
		}
	}

	data += "\"invoiceDetailVal\" : "+getDataTableData(invoiceProductorTable)+",";
	data = data.replace(reg, "");
	data += "}";
	return data;
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
function isNumber() {
	var trackcount = document.getElementsByName("sendcount");
	for (var i = 0; i < trackcount.length; i++) {

		trackcount[i].value = trackcount[i].value.replace(/[^\d.]/g, '');

	}
}
var vflag = -1;
function notGreaterThan() {
	var complatecount = document.getElementsByName("complatecount");
	var sendcount = document.getElementsByName("sendcount");
	var shippednumber = document.getElementsByName("shippednumber");
	for (var i = 0; i < sendcount.length; i++) {
		var surplusnumber = complatecount[i].value-shippednumber[i].value;
		if (complatecount[i].value!=0&&(parseFloat((sendcount[i].value)) > parseFloat(surplusnumber)||parseFloat(sendcount[i].value)==0)) {
//			alert("发货数量不能大于完工数量");
			lwalert("tipModal", 1, "该产品完工数量"+complatecount[i].value+",已发货数量"+shippednumber[i].value+"," +
					"剩余可发货数量为"+surplusnumber+",填写的发货数量不能大于剩余可发货数量且不等于0！");
			vflag=0;
		} else if(complatecount[i].value==0&&parseFloat((sendcount[i].value)) > parseFloat(complatecount[i].value)){
			lwalert("tipModal", 1, "发货数量不能大于完工数量");
		}else {
			vflag = 1;
		}
	}
}

/**
 * 搜索销售出货单
 */
var searchInvoice = function() {
	resetForm();
	var searchVal = $("#searchValue").val();

	oTable.ajax.url(
			"../../../"+ln_project+"/invoice?method=queryInvoiceList&searchValue=" + searchVal)
			.load();
}

$("#salesorderid").on("select2:select",function(e) {
	var salesorderid = $("#salesorderid").val();
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/invoice",
		data : {
			"method" : "queryOrderDetail",
			"salesorderid" : salesorderid,
		},
		dataType : "text",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				//将新增和删除设置为可选
				$("#addProductorButton").prop("disabled",false);
				$("#delProductorButton").prop("disabled",false);

				var tempData = $.parseJSON(data);
				$("#companioname").val(tempData[0].companioname);
				//将表格变为可编辑状态
				invoiceProductorTableToEdit();
			}
		}
	});

})



/**
 * 出库
 */
function saleStore(){
	var ids = com.leanway.getCheckBoxData(1,"generalInfo", "checkList");
	if (ids.length>0) {
        var msg = "确定对选中的" + ids.split(",").length + "条出货单出库?";

		lwalert("tipModal", 2, msg ,"isSureStore()");
	} else {
		lwalert("tipModal", 1, "至少选择一条记录进行出库操作！");
	}

}

function isSureStore(){

	//首先检查是否是已出库状态
	var confirmstatus = $('input[name="confirmstatus"]:checked').val();

	if (confirmstatus != 0) {
		lwalert("tipModal", 1, "该出库单已出库，不能进行出库操作！");
		return ;
	}

	//获取选中的id，然后从中根据id得到相应仓库数据
	var ids = com.leanway.getCheckBoxData(1,"generalInfo", "checkList");
	//获取销售订单的id
	var salesorderid = $("#salesorderid").val();
	//得到表单里面的数据
	var form = $("#invoiceForm").serializeArray();
	// 后面确认时应 检测模具编号是否已存在
	var formData = formatFormJson(form);
	//获取dataTable里面的数据

	//然后执行操作
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/invoice",
		data : {
			"method" : "saleStore",
			"ids" :ids,
			"salesorderid" : salesorderid,
			"formData" : formData,
		},
		dataType : "text",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);

				if(tempData.status == "success"){
					//将新增和删除设置为不可选
					$("#addProductorButton").prop("disabled",true);
					$("#delProductorButton").prop("disabled",true);
					oTable.ajax.reload();
					lwalert("tipModal", 1, "出库成功！");
				}else{

					lwalert("tipModal", 1, tempData.info);
				}
			}else{

			}
		}
	});
}


//查询出货单
function searchIncoive () {
	resetForm();
	var searchValue = $("#searchvalue").val();
	//获取页面的confirmstatus;
//	 $('input[name="confirmstatus"]:checked').val();
	var confirmstatus = $('input[name="confirmstatus"]:checked').val();
	var ordertype = com.leanway.getDataTableCheckIds("ordertype");
	if(confirmstatus!=0){
		$("#updateFun").prop("disabled",true);
		$("#delFun").prop("disabled",true);
	}else{
		$("#updateFun").prop("disabled",false);
		$("#delFun").prop("disabled",false);
	}
	var productorname = $("#productor").val();
	 oTable.ajax.url("../../../../"+ln_project+"/invoice?method=queryInvoiceList&confirmstatus="+confirmstatus+"&searchValue="+searchValue+"&productorname="+productorname+"&ordertype="+ordertype).load();

}

var initProductorTable = function () {
    var editTable = $("#invoiceProductorTable").DataTable({
            "ajax" : '../../../../'+ln_project+'/invoice?method=queryInvoiceDetailList&invoiceid=1',
            "pageUrl" : "invoice/invoice.html",
            'bPaginate': false,
            "bRetrieve": true,
            "bFilter":false,
            "scrollX": true,
            "bSort": false,
            "bProcessing": true,
            "bServerSide": false,
            "aoColumns" : [
            {
                "mDataProp" : "invoicedetailid",
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
            },
            {
                "mDataProp" : "version"
            },
            {
                "mDataProp" : "batch"
            }
            /*,
            {
                "mDataProp" : "subbatch"
            },
            {
                "mDataProp" : "serialnumber"
            }*/
    		, 
            {
                "mDataProp" : "unitsname"
            },
            {
                "mDataProp" : "cansendcount"
            },
            {
                "mDataProp" : "sendcount"
            },
            {
                "mDataProp" : "complatecount"
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
 * 新增一行
 */
var addProductor = function( ) {
	var orderId = $("#invoiceid").val();
	invoiceProductorTable.row.add({
		"invoicedetailid" : "",
		"productorid" : "",		
		"productordesc" : "",
		"batch" : "",
		"subbatch" : "",
		"serialnumber" : "",
		"unitsname" : "",
		"unitsid" : "",
		"cansendcount" : "",
		"sendcount" : "",
		"invoiceid" : orderId ,
		"salesorderdetailid": "",
		"productorname" : "",
		"version" : "",
		"versionid" : "",
		"complatecount" : ""
	}).draw(false);
	invoiceProductorTableToEdit();
}

/**
 * 采购产品变成可编辑
 */
var invoiceProductorTableToEdit = function ( ) {
		
	var salesorderid = $("#salesorderid").val();
	 if (invoiceProductorTable.rows().data().length > 0) {
         $("#invoiceProductorTable tbody tr").each( function( ) {
             // 获取该行的下标
             var index = invoiceProductorTable.row(this).index();
             var productorid = '';
             if(invoiceProductorTable.rows().data()[index].productorid!=undefined&&opeMethod =="updateInvoice"&&invoiceProductorTable.rows().data()[index].productorid!=''&&invoiceProductorTable.rows().data()[index].productorid!=null){
                 productorid =  "<select id='productorid"+ index+ "'  name='productorid' class='form-control select2' disabled style='width:150px'>";
             }else{
                 productorid =  "<select id='productorid"+ index+ "'  name='productorid' class='form-control select2' style='width:150px'>";
             }
             // 产品编码
             $(this).find("td:eq(1)").html(productorid);
             initSelect2("#productorid" + index,"../../../"+ln_project+"/invoice?method=queryProductorBySalesOrder&salesorderid="+salesorderid,"搜索产品");
             //查询销售订单中存在的产品
             $("#productorid" + index).append('<option value='+ invoiceProductorTable.rows().data()[index].productorid+ '>'+ invoiceProductorTable.rows().data()[index].productorname+ '</option>');
             $("#productorid" + index).select2("val",invoiceProductorTable.rows().data()[index].productorid);    
             var productor = invoiceProductorTable.rows().data()[index].productorid ;
             var batchinfo=invoiceProductorTable.rows().data()[index].batch ;
             var unitsname = invoiceProductorTable.rows().data()[index].unitsname ;
             var cansendcount =invoiceProductorTable.rows().data()[index].cansendcount ;
             var productordesc = invoiceProductorTable.rows().data()[index].productordesc;
             // select选中数据后 触发事件
             $("#productorid" + index).on("select2:select",function(e) {            	 
            	 
            	 invoiceProductorTable.rows().data()[index].salesorderdetailid = $(this).val();
            	 invoiceProductorTable.rows().data()[index].productorname= $(this).find("option:selected").text();
            	 
            	 $("#batch"+index).val(null).trigger("change");
            	 var tempDetailData = querySaleOrderDetail(invoiceProductorTable.rows().data()[index].salesorderdetailid);
            	 invoiceProductorTable.rows().data()[index].productorid = tempDetailData.productorid;
            	 invoiceProductorTable.rows().data()[index].versionid = tempDetailData.versionid;
            	 invoiceProductorTable.rows().data()[index].productordesc = tempDetailData.productordesc;
            	 invoiceProductorTable.rows().data()[index].version = tempDetailData.version;
            	 $("#version"+index).val(tempDetailData.version);
            	 $("#productordesc"+index).val(tempDetailData.productordesc);
            	 initSelect2("#batch" + index, "../../../../"+ln_project+"/transferStore?method=queryBatchByProductorAndMap&productorid="+invoiceProductorTable.rows().data()[index].productorid+"&versionid="+invoiceProductorTable.rows().data()[index].versionid, "搜索批次号");
                 com.leanway.initSelect2("#subbatch" + index, "../../../../"+ln_project+"/transferStore?method=querySubbatchByProductorAndMap&productorid="+invoiceProductorTable.rows().data()[index].productorid+"&batch="+invoiceProductorTable.rows().data()[index].batch+"&versionid="+invoiceProductorTable.rows().data()[index].versionid, "搜索子批次号");
                 com.leanway.initSelect2("#serialnumber" + index, "../../../../"+ln_project+"/transferStore?method=querySerialnumberByProductorAndMap&productorid="+invoiceProductorTable.rows().data()[index].productorid+"&batch="+invoiceProductorTable.rows().data()[index].batch+"&subbatch="+invoiceProductorTable.rows().data()[index].subbatch+"&versionid="+invoiceProductorTable.rows().data()[index].versionid, "搜索序列号");
            	 
             });
             $(this).find("td:eq(2)").html('<input type="text" class="form-control" style="width:200px" readonly name="productordesc" id="productordesc'+index+'" value="'+ productordesc + '">');
             $(this).find("td:eq(3)").html('<input type="text" class="form-control" style="width:80px" readonly name="version" id="version'+index+'" value="'+ invoiceProductorTable.rows().data()[index].version + '">');
             // 库存数量
             var cansendcount = invoiceProductorTable.rows().data()[index].cansendcount;
             if (cansendcount == 'undefined' || cansendcount == null || cansendcount == '') {
            	 cansendcount = "0";
             }
              
             var batch = "<select id='batch"+ index+ "'  name='batch' class='form-control select2' style='width:150px;'>";
             // 批次号
             $(this).find("td:eq(4)").html(batch);
             com.leanway.initSelect2("#batch" + index, "../../../../"+ln_project+"/transferStore?method=queryBatchByProductorAndMap&productorid="+invoiceProductorTable.rows().data()[index].productorid+"&versionid="+invoiceProductorTable.rows().data()[index].versionid, "搜索批次号");
             $("#batch" + index).append('<option value='+ invoiceProductorTable.rows().data()[index].batch+ '>'+ invoiceProductorTable.rows().data()[index].batch+ '</option>');
             $("#batch" + index).select2("val",invoiceProductorTable.rows().data()[index].batch);

             // select选中数据后 触发事件
             $("#batch" + index).on("select2:select",function(e) {

	          	 invoiceProductorTable.rows().data()[index].batch = $(this).val();
                 com.leanway.initSelect2("#subbatch" + index, "../../../../"+ln_project+"/transferStore?method=querySubbatchByProductorAndMap&productorid="+invoiceProductorTable.rows().data()[index].productorid+"&batch="+invoiceProductorTable.rows().data()[index].batch+"&versionid="+invoiceProductorTable.rows().data()[index].versionid, "搜索子批次号");
                 com.leanway.initSelect2("#serialnumber" + index, "../../../../"+ln_project+"/transferStore?method=querySerialnumberByProductorAndMap&productorid="+invoiceProductorTable.rows().data()[index].productorid+"&batch="+invoiceProductorTable.rows().data()[index].batch+"&subbatch="+invoiceProductorTable.rows().data()[index].subbatch+"&versionid="+invoiceProductorTable.rows().data()[index].versionid, "搜索序列号");
                 loadStoreInfo(index,invoiceProductorTable.rows().data()[index].productorid,invoiceProductorTable.rows().data()[index].versionid,invoiceProductorTable.rows().data()[index].batch,invoiceProductorTable.rows().data()[index].serialnumber,invoiceProductorTable.rows().data()[index].subbatch)
             });     
             /*var subbatch = "<select id='subbatch"+ index+ "'  name='subbatch' class='form-control select2' style='width:150px;'>";
             
             // 子批次号
             $(this).find("td:eq(5)").html(subbatch);
             com.leanway.initSelect2("#subbatch" + index, "../../../../"+ln_project+"/transferStore?method=querySubbatchByProductorAndMap&productorid="+invoiceProductorTable.rows().data()[index].productorid+"&batch="+invoiceProductorTable.rows().data()[index].batch+"&versionid="+invoiceProductorTable.rows().data()[index].versionid, "搜索子批次号");
             $("#subbatch" + index).append('<option value='+ invoiceProductorTable.rows().data()[index].subbatch+ '>'+ invoiceProductorTable.rows().data()[index].subbatch+ '</option>');
             $("#subbatch" + index).select2("val",invoiceProductorTable.rows().data()[index].subbatch);

             // select选中数据后 触发事件
             $("#subbatch" + index).on("select2:select",function(e) {

	          	 invoiceProductorTable.rows().data()[index].subbatch = $(this).val();
                 com.leanway.initSelect2("#serialnumber" + index, "../../../../"+ln_project+"/transferStore?method=querySerialnumberByProductorAndMap&productorid="+invoiceProductorTable.rows().data()[index].productorid+"&batch="+invoiceProductorTable.rows().data()[index].batch+"&subbatch="+invoiceProductorTable.rows().data()[index].subbatch+"&versionid="+invoiceProductorTable.rows().data()[index].versionid, "搜索序列号");
	             loadStoreInfo(index,invoiceProductorTable.rows().data()[index].productorid,invoiceProductorTable.rows().data()[index].versionid,invoiceProductorTable.rows().data()[index].batch,invoiceProductorTable.rows().data()[index].serialnumber,invoiceProductorTable.rows().data()[index].subbatch)
             });     
             var serialnumber = "<select id='serialnumber"+ index+ "'  name='serialnumber' class='form-control select2' style='width:150px;'>";
             // 序列号
             $(this).find("td:eq(6)").html(serialnumber);
             com.leanway.initSelect2("#serialnumber" + index, "../../../../"+ln_project+"/transferStore?method=querySerialnumberByProductorAndMap&productorid="+invoiceProductorTable.rows().data()[index].productorid+"&batch="+invoiceProductorTable.rows().data()[index].batch+"&subbatch="+invoiceProductorTable.rows().data()[index].subbatch+"&versionid="+invoiceProductorTable.rows().data()[index].versionid, "搜索序列号");
             $("#serialnumber" + index).append('<option value='+ invoiceProductorTable.rows().data()[index].serialnumber+ '>'+ invoiceProductorTable.rows().data()[index].serialnumber+ '</option>');
             $("#serialnumber" + index).select2("val",invoiceProductorTable.rows().data()[index].serialnumber);

             // select选中数据后 触发事件
             $("#serialnumber" + index).on("select2:select",function(e) {

	          	 invoiceProductorTable.rows().data()[index].serialnumber = $(this).val();
	             loadStoreInfo(index,invoiceProductorTable.rows().data()[index].productorid,invoiceProductorTable.rows().data()[index].versionid,invoiceProductorTable.rows().data()[index].batch,invoiceProductorTable.rows().data()[index].serialnumber,invoiceProductorTable.rows().data()[index].subbatch)
             });     */
             
             //库存单位
             $(this).find("td:eq(5)").html('<input type="text" class="form-control" style="width:100px" readonly name="unitsname" id="unitsname'+index+'" value="'+ invoiceProductorTable.rows().data()[index].unitsname + '">');
             //库存数量
             $(this).find("td:eq(6)").html('<input type="text" class="form-control" style="width:100px" readonly name="cansendcount" id="cansendcount'+index+'" value="'+ cansendcount + '">');
             // 出货数量
             var sendcount = invoiceProductorTable.rows().data()[index].sendcount;
             if (opeMethod == 'updateInvoice'&&(sendcount == null || sendcount ==undefined || sendcount==0 )){
            	 invoiceProductorTable.rows().data()[index].sendcount = "0";
             }
             //已备数量
             $(this).find("td:eq(7)").html('<input type="text" class="form-control" style="width:100px"  onblur="setDataTableValue(this, '+ index+ ',\'invoiceProductorTable\')" name="sendcount" id="sendcount"  value="'+ sendcount + '">');


         });

         invoiceProductorTable.columns.adjust();
     }
}

//查询数量
function loadStoreInfo(index,productorid,versionid,batch,serialnumber,subbatch){
    $.ajax({
        type : "get",
        url : "../../../../"+ln_project+"/transferStore",
        data : {
            method : "queryStoreInfo",
            "productorid" : productorid,
            "batch":batch,
            "versionid":versionid,
            "batch":batch,
            "serialnumber":serialnumber,
            "subbatch":subbatch,
            "type":1
        },
        dataType : "json",
        success : function(data) {
            var flag =  com.leanway.checkLogind(data);
            if(flag){
            	if (data == undefined || data == null) {
            		invoiceProductorTable.rows().data()[index].cansendcount = 0;
            		$("#cansendcount"+index).val(0);
            	}else{
            		invoiceProductorTable.rows().data()[index].cansendcount=data.count;
            		$("#cansendcount"+index).val(data.count);
            		invoiceProductorTable.rows().data()[index].unitsid=data.unitsid;
            		invoiceProductorTable.rows().data()[index].unitsname=data.unitsname;
            		$("#unitsname"+index).val(data.unitsname);
            	}
            }

        },

    });
}
/**
 * 产品状态
 */
var productorStatusToName = function ( status ) {

	var result = "";

	switch (status) {
	case "A":
		result = "合格";
		break;
	case "A1":
		result = "放行";
		break;
	case "Q":
		result = "未检";
		break;
	case "R":
		result = "不合格";
		break;
	case "R1":
		result = "来料不良";
		break;
	case "R2":
		result = "生产不良";
		break;
	case "R3":
		result = "在制";
		break;
	default:
		result = (status||"");
		break;
	}

	return result;
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
var  querySaleOrderDetail  = function (salesorderdetailid){
	var tempDetailData = "";
	//通过销售订单id和产品的id来获取相应的数据
	  $.ajax({
	        type : "post",
	        url : "../../../../"+ln_project+"/invoice",

	        data : {
	            method : "querySaleOrderDetail",
	            "salesorderdetailid":salesorderdetailid,
	        },
	        async : false,
	        dataType : "json",
	        success : function(data) {
	            var flag =  com.leanway.checkLogind(data);

	            if(flag){
	            	//得到相应的销售订单明细
	            	tempDetailData = data.data ;
	            }

	        },

	    });
        return tempDetailData;

}
/**
 * 修改功能
 */
var updateInvoice = function () {
	var data = oTable.rows('.row_selected').data();
	if(data.length!=1){
		lwalert("tipModal", 1, "请选择一条记录进行修改！");
	}
	//首先将方法改为修改方法
	opeMethod = "updateInvoice";
	//获取选中的数据
	//将按钮可点
	$("#saveOrUpdate").prop("disabled",false);
	//将新增和删除也设置为可选
	$("#addProductorButton").prop("disabled",false);
	$("#delProductorButton").prop("disabled",false);
	$("#companionid").prop("disabled",false);
	invoiceProductorTableToEdit();
}
/**
 * 删除产品的方法
 */
function delProductor(){
	//获取dataTabel
	// 删除选中行的数据


		$("#invoiceProductorTable tbody tr").each(function() {

			// 获取该行的下标
			var index = invoiceProductorTable.row(this).index();

			if ($(this).find("td:eq(0)").find("input[name='productorCheck']").prop("checked") == true) {


				invoiceProductorTable.rows(index).remove().draw(false);
			}

		});

}

var  querySaleOrderDetailByOrderidAndProductorid  = function (productorId,salesorderid){

	//通过销售订单id和产品的id来获取相应的数据
	  $.ajax({
	        type : "post",
	        url : "../../../../"+ln_project+"/invoice",

	        data : {
	            method : "querySaleOrderDetailByOrderidAndProductorid",
	            "productorid":productorId,
	            "salesorderid":salesorderid
	        },
	        async : false,
	        dataType : "json",
	        success : function(data) {
	            var flag =  com.leanway.checkLogind(data);

	            if(flag){
	            	//得到相应的销售订单明细
	            	tempDetailData = data.data ;

	            }

	        },

	    });


}
