var clicktime = new Date();
var productionMpsTable;
var productionMpsSumTable;
var tableHeight = "370px";

$ ( function () {

	 if (window.screen.availHeight > 768) {
		 tableHeight = "420px";
	 }

	// 初始化对象
	com.leanway.loadTags();

	// 初始化时间
	initTimePickYmd("requestStartDate");
	initTimePickYmd("requestEndDate");

	// 初始化数据
	productionMpsTable = initProductionMpsTable ( );
	productionMpsSumTable = initProductionMpsSumTable ( );

	//
	$("#saveFun").hide();

} );

/**
 * 创建生产订单
 */
var createProductionOrder = function ( ) {

	var salesOrderDetailIds = com.leanway.getDataTableCheckIds("checkList");

	 if (salesOrderDetailIds.length == 0) {

	    	lwalert("tipModal", 1, "请选择数据生成生产订单！");
			return;

	 } else {

			// 派工单数据
			var data = getDataTableData(productionMpsTable, salesOrderDetailIds);

			var formData = "{\"listSalesOrderDetail\": "+ data + "}";

			$("#createFun").prop("disabled", true);
			$("#createFunInfo").html("生成中...请等待！");


			$.ajax ( {
				type : "post",
				url : "../../../../"+ln_project+"/productionOrder",
				data : {
					"method" : "addProductionOrderForSalesOrderDetail",
					"paramData" : formData
				},
				dataType : "json",
			/*	async : false,*/
				success : function ( text ) {

					var flag =  com.leanway.checkLogind(text);

					if(flag){

						lwalert("tipModal", 1, text.info);
						$("#createFun").prop("disabled", false);
						$("#createFunInfo").html("生成生产订单");

					}
				},
				error: function(){

					$("#createFun").prop("disabled", false);
					$("#createFunInfo").html("生成生产订单");

				}
			});



	    }

}

/**
 * 保存销售订单详细
 */
var saveSalesOrderDetail = function ( ) {

	var checkData = com.leanway.getDataTableCheckIds("checkList");

	 if (checkData.length == 0) {

	    	lwalert("tipModal", 1, "请选择要修改的数据！");
			return;

	    } else {

	    	lwalert("tipModal", 2,"确定要修改选中的数据吗?","isSureSave()");

	    }

}

/**
 * 确认保存
 */
var isSureSave = function ( ) {

	var checkData = com.leanway.getDataTableCheckIds("checkList");

	// 派工单数据
	var data = getDataTableData(productionMpsTable, checkData);

	var formData = "{\"listSalesOrderDetail\": "+ data + "}";

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/productionOrder",
		data : {
			"method" : "saveSalesOrderDetail",
			"paramData" : formData
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				if (text.status == "success") {
					productionMpsTable.ajax.reload();
					productionMpsSumTable.ajax.reload();
				} else {

					lwalert("tipModal", 1, text.info);

				}

			}

		}
	});


}

/**
 * 获取选中的数据
 */
var getDataTableData = function ( tableObj, selectIds ) {

	var reg=/,$/gi;

	var jsonData = "[";

	var dataList = tableObj.rows().data();

	if (dataList != undefined && typeof(dataList) != "undefined" && dataList.length > 0) {

		// 循环遍历Table数据
		for (var i = 0; i < dataList.length; i ++) {

			var productorData = dataList[i];

			if (selectIds.indexOf(productorData.salesorderdetailid) !=  -1) {
				jsonData += JSON.stringify(productorData) + ",";
			}

		}
	}
	jsonData = jsonData.replace(reg,"");

	jsonData += "]";

	return jsonData;
}

/**
 * 编辑销售订单
 */
var editSalesOrderDetail = function ( ) {

	var checkData = com.leanway.getDataTableCheckIds("checkList");

	 if (checkData.length == 0) {

	    	lwalert("tipModal", 1, "请选择要修改的数据！");
			return;

	    } else {

	    	$("#saveFun").show();


	    	// 把选中的行变成可编辑模式
	    	$("#productionMpsTable tbody tr").each( function() {

	    		// 获取该行的下标
	    		var index = productionMpsTable.row(this).index();
	    		var dataId = productionMpsTable.rows().data()[index].salesorderdetailid;

	    		if (checkData.indexOf(dataId) != -1)  {

	    			// 工序编号
	    			var equipmentname = "<select id='equipmentname" + index + "'  name='equipmentname' class='form-control select2' style='width: 130px;'>";

	    			$(this).find("td:eq(1)").html(equipmentname);

	    			com.leanway.initSelect2("#equipmentname"+index, "../../../../"+ln_project+"/productors?method=loadEquipmentname", "搜索设备台账");

	    			$("#equipmentname" + index).append('<option value=' + productionMpsTable.rows().data()[index].equipmentname + '>' + productionMpsTable.rows().data()[index].equipmentname  + '</option>');
	    			$("#equipmentname" + index).select2("val", productionMpsTable.rows().data()[index].equipmentname );

	    			// select选中数据后 触发事件
	    			$("#equipmentname" + index).on("select2:select", function(e) {

	    				// 赋值
	    				productionMpsTable.rows().data()[index].equipmentid = $(this).val();
	    				productionMpsTable.rows().data()[index].equipmentname = $("#select2-equipmentname"+index + "-container").text();

	    			});

	    			$(this).find("td:eq(1)").click(function(event) {
	                    event.stopPropagation();
	                });


	    			// 计划开始时间
	    			var producefinishdate = productionMpsTable.rows().data()[index].producefinishdate;
	    			if (producefinishdate == "null"  || producefinishdate == null) {
	    				producefinishdate = "";
	    			}
	    			$(this).find("td:eq(7)").html('<input type="text" class="form-control" style="width: 125px" onchange="setDataTableValue(this, ' + index + ',\'productionMpsTable\')" name="producefinishdate" id="producefinishdate' + index + '" value="' + producefinishdate + '">');

	    		//	initTimePickYmd("producefinishdate" + index);

	    			$('#producefinishdate' + index).datetimepicker({
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

	    			$("#producefinishdate" + index).click(function(event) {
	                    event.stopPropagation();
	                });


	    		}

	    	});

	    	productionMpsTable.columns.adjust();

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

	 //if (tableName == "productionProductorTable") {
		 //$("#expectnumber").val(tableObj.rows().data()[index].number);
	 //}

	 //alert(tableObj.rows().data()[index].number);
}

/**
 * 查询
 */
var searchSalesOrderDetail = function ( ) {

	var requestStartDate =  $("#requestStartDate").val();
	var requestEndDate = $("#requestEndDate").val();

	// 获取时间类型
	var dateType =  $('input[name="selectDate"]:checked').val();

	productionMpsTable.ajax.url("../../../../"+ln_project+"/productionOrder?method=querySalesOrderDetail&requestStartDate=" + requestStartDate + "&requestEndDate=" + requestEndDate +"&dateType=" + dateType).load();
	productionMpsSumTable.ajax.url("../../../../"+ln_project+"/productionOrder?method=querySalesOrderDetailSum&requestStartDate=" + requestStartDate + "&requestEndDate=" + requestEndDate +"&dateType=" + dateType).load();
}

/**
 * 初始化DataTable
 */
var initProductionMpsTable = function ( ) {

	var table = $('#productionMpsTable').DataTable( {
		"ajax": "../../../../"+ln_project+"/productionOrder?method=querySalesOrderDetail",
		/*"iDisplayLength" : "10",*/
        'bPaginate': false,
        "bDestory": true,
        "bRetrieve": true,
        "bFilter":false,
        "scrollX": true,
        "scrollY": tableHeight,
        "bSort": false,
        "bProcessing": true,
        "bServerSide": true,
        "columnDefs": [
            {
            	orderable: false,
            	targets: [0]
	        }
          ],
         "aoColumns": [
               {
            	   "mDataProp": "salesorderdetailid",
                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                       $(nTd) .html("<div id='stopPropagation" + iRow +"'><input class='regular-checkbox' type='checkbox' id='" + sData + "' name='checkList' value='" + sData + "'><label  for='" + sData + "'></label> </div>");
            		   com.leanway.columnTdBindSelect(nTd);
                   }
               },
               {"mDataProp": "equipmentname"},
               {"mDataProp": "relatednumber",
            	   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                       $(nTd).html(relatednumberToName(sData));
                   }
               },
               {"mDataProp": "code"},
               {"mDataProp": "productorname"},
               {"mDataProp": "drawcode"},
               {"mDataProp": "number"},
               {"mDataProp": "producefinishdate"  }
             /*  {"mDataProp" : "requestdate"}*/
          ],
          "fnCreatedRow": function ( nRow, aData, iDataIndex ) {

          },
         "oLanguage" : {
        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
         },
         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
     	"fnDrawCallback" : function(data) {

     	//	com.leanway.setDataTableColumnHide("productionMpsTable");
     		com.leanway.dataTableClickMoreSelect("productionMpsTable","checkList",false,productionMpsTable,undefined,undefined,undefined);
     		$("#saveFun").hide();
     	}

    } ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );

	return table;

}


var initProductionMpsSumTable = function ( ) {

	var table = $('#productionMpsSumTable').DataTable( {
		"ajax": "../../../../"+ln_project+"/productionOrder?method=querySalesOrderDetailSum",
		/*"iDisplayLength" : "10",*/
        'bPaginate': false,
        "bDestory": true,
        "bRetrieve": true,
        "bFilter":false,
       /* "scrollX": true,*/
        "scrollY": tableHeight,
        "bSort": false,
        "bProcessing": true,
        "bServerSide": true,
        "columnDefs": [
            {
            	orderable: false,
            	targets: [0]
	        }
          ],
         "aoColumns": [
               {"mDataProp": "equipmentname"},
               {"mDataProp": "producefinishdate"},
               {"mDataProp": "number"}
          ],
          "fnCreatedRow": function ( nRow, aData, iDataIndex ) {

          },
         "oLanguage" : {
        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
         },
         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
     	"fnDrawCallback" : function(data) {

     		//com.leanway.setDataTableColumnHide("productionMpsSumTable");
     		//com.leanway.dataTableClickMoreSelect("productionMpsSumTable","sumCheckList",false,productionMpsSumTable,undefined,undefined,undefined);

     	}

    } ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );

	return table;

}

/**
 * 销售订单类型
 */
var relatednumberToName = function ( value ) {

	var result = "销售订单";

	if (value == "-1") {
		result = "预售订单"
	}

	return result;
}