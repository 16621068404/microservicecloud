var clicktime = new Date();
var oTable;
var ope;
var details;
var detailTable;
$(function() {
	 $("#addproductor").prop("disabled",true);
	 $("#deleteInventoryDetail").prop("disabled",true);
	 $("#saveOrUpdate").prop("disabled",true);
	//加载所有仓库
	//initmap();
	 com.leanway.initSelect2("#mapid", "../../../"+ln_project+"/companyMap?method=queryAllStorageMap", "搜索仓库");

	 //搜索该仓库下的产品
//	 com.leanway.initSelect2("#productorid", "../../../"+ln_project+"/mapProductor?method=queryProductorByMap", "搜索产品");
	 com.leanway.initSelect2("#productorid","../../../"+ln_project+"/mapProductor?method=queryProductorByMapId", "搜索产品");
	 
	//加载datatable  盘点单
	oTable = initInventory();
	detailTable = initInventoryDetail();

	$("#mapid").prop("disabled",true);
	$("#productorid").prop("disabled",true);
	$("#searchDetail").prop("disabled",true);

	 com.leanway.enterKeyDown("searchValue", searchInventory);

})
//绑定单选框点击事件
    $("input[name=confirmstatus]").change(function(){
    	com.leanway.clearTableMapData("inventoryInfo");
    	com.leanway.dataTableUnselectAll("inventoryInfo","checkList");

        searchInventory();
    });



function searchInventory(){
	var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
    var searchValue = $("#searchValue").val();
    oTable.ajax.url("../../../"+ln_project+"/additional?method=queryAdditional&confirmstatus="+confirmstatus+"&searchValue="+searchValue+"&tablename=inventory").load();
    com.leanway.clearTableMapData("inventoryInfo");
	com.leanway.dataTableUnselectAll("inventoryInfo","checkList");
}
//加载datatable  盘点单
function initInventory(){

	var table = $('#inventoryInfo')
    .DataTable(
            {
                "ajax" : "../../../"+ln_project+"/additional?method=queryAdditional&tablename=inventory",
                "pageUrl"  :   "inventory/inventory.html",
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
                             com.leanway.columnTdBindSelectNew(nTd,"inventoryInfo","checkList");
                           }
                       },
                       {"mDataProp": "additionalno"}

                  ],

                "oLanguage" : {
                    "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                },
                "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                "fnDrawCallback" : function(data) {
                    com.leanway.getDataTableFirstRowId("inventoryInfo",ajaxLoadInventory,
                            "more", "checkList");
                    com.leanway.dataTableClickMoreSelect("inventoryInfo", "checkList", false,
                            oTable, ajaxLoadInventory,undefined,undefined,"checkAll");

                    com.leanway.dataTableCheckAllCheck('inventoryInfo', 'checkAll', 'checkList');
                }
            }).on('xhr.dt', function (e, settings, json) {
                com.leanway.checkLogind(json);
            } );

return table;

}

//加载datatable  盘点单
function initInventoryDetail(){

	var table = $('#inventoryProductorTable')
    .DataTable(
            {
                "ajax" : "../../../"+ln_project+"/additional?method=queryAdditionalDetailBypage",
                "pageUrl"  :   "inventory/inventory.html",
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
                           "mDataProp": "additionaldetailid",
                           "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                               $(nTd).html("<div id='stopPropagation" + iRow +"'>"
                                       +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                       + "' name='checkDetailList' value='" + sData
                                       + "'><label for='" + sData
                                       + "'></label>");
                             com.leanway.columnTdBindSelectNew(nTd,"inventoryProductorTable","checkDetailList");
                           }
                       },
                       {"mDataProp": "productorname"},
                       {"mDataProp": "productordesc"},
                       {"mDataProp": "version"},
                       {"mDataProp": "batch"},
                       {"mDataProp": "count"},
                       {"mDataProp": "productorstatus"},
                       {"mDataProp": "countnew"}

                  ],

                "oLanguage" : {
                    "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                },
                "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                "fnDrawCallback" : function(data) {
//                    com.leanway.getDataTableFirstRowId("inventoryInfo",ajaxLoadInventory,
//                            "more", "checkList");
//                    com.leanway.dataTableClickMoreSelect("inventoryInfo", "checkList", false,
//                            oTable, ajaxLoadInventory,undefined,undefined,"checkAll");
//
//                    com.leanway.dataTableCheckAllCheck('inventoryInfo', 'checkAll', 'checkList');
                }
            }).on('xhr.dt', function (e, settings, json) {
//                com.leanway.checkLogind(json);
            } );

return table;

}
//加载盘点单信息
function ajaxLoadInventory(additionalid){

    $("#addproductor").prop("disabled",true);
    $("#deleteInventoryDetail").prop("disabled",true);
    $("#mapid").prop("disabled",true);
    $("#productorid").prop("disabled",true);
	$("#searchDetail").prop("disabled",true);
    $("#saveOrUpdate").prop("disabled",true);
    //加载前清空表单
    $("#mapid").val("搜索仓库").trigger("change");
    $("#tbody1").html("");

    detailTable.ajax.url("../../../../"+ln_project+"/additional?method=queryAdditionalDetailBypage&additionalid=" + additionalid).load();
//	$.ajax({
//		type : "get",
//		url  : "../../../"+ln_project+"/inventory",
//		data : {
//			"method" : "queryInventoryDetail",
//			"inventoryid" : inventoryid
//		},
//		datetype : "text",
//		async : false,
//		success : function(data){
//
//			var flag =  com.leanway.checkLogind(data);
//
//			if ( flag ) {
//
//					var jData = $.parseJSON(data);
//					if(jData.status=="success"){
//	            	var detailList = jData.detailList;
//	            	details = jData.detailList;
//	            	//给仓库selected赋值
//	            //	com.leanway.initSelect2("#mapid", "../../../"+ln_project+"/companyMap?method=queryAllStorageMap", "搜索仓库");
//	            	 $("#mapid").append(
//	                         '<option value=' + detailList[0].mapid + '>' +detailList[0].mapname
//	                                 + '</option>');
//	                 $("#mapid").select2("val", [ detailList[0].mapid ]);
//	            	appendTabel(detailList);
//	            }else{
//	            	details = '';
//	            }
//			}
//		}
//	})

}
//绘画表单
function appendTabel(data){

	var tableBodyHtml = "";
//	$("#tbody2").html("");
    for(var i in data){
    	
    	var practicalcount;
    	
    	if (data[i].practicalcount == undefined || data[i].practicalcount == null ) {
    		practicalcount="";
    	}
    	
    	tableBodyHtml += "<tr>";
    	tableBodyHtml += "<td ><input type = 'checkbox' name='boxid' id='boxid"+i+"' value= '"+data[i].inventorydetailid+"' class='regular-checkbox' ><label for='boxid"+i+"'></td>";
    	tableBodyHtml +="<td>"+data[i].productorname+"</td>";
    	tableBodyHtml +="<td>"+data[i].storagecount+"</td>";
    	tableBodyHtml +="<td>"+data[i].productorstatus+"</td>";
    	tableBodyHtml +="<td>"+practicalcount+"</td>";
    	tableBodyHtml +="<td style = 'display:none'>"+data[i].stockunits+"</td>";
    	tableBodyHtml += "</tr>";
    }
    $("#tbody1").html(tableBodyHtml);

}
//修改盘点单
function updateInventory(){
	 var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
	    var data = oTable.rows('.row_selected').data();
	    if(data.length == 0) {
	        lwalert("tipModal", 1, "请选择数据进行修改!");
	    }else if(data.length>1){
	        lwalert("tipModal", 1, "只能选择一条数据进行修改!");
	    }else{
	        if(confirmstatus==0){

	        	 $("#saveOrUpdate").prop("disabled",false);
	            $("#addproductor").prop("disabled",false);
	            $("#deleteInventoryDetail").prop("disabled",false);
	            $("#mapid").prop("disabled",true);
	            $("#productorid").prop("disabled",true);
	        	$("#searchDetail").prop("disabled",true);
	            ope = "updateInventory";
	            setTableValue(details);
	            for(var i in details){
	              //  $("#purchasecount"+i).val(details[i].purchasecount);
	            	 var productorid = details[i].productorid;
	                com.leanway.initSelect2("#productorid" + i,
	                        "../../../"+ln_project+"/productors?method=queryAllProductor", "搜索产品");

	                if (productorid != null && productorid != "" && productorid != "null") {
	                    $("#productorid"+i).append(
	                            '<option value=' + productorid + '>' + details[i].productorname
	                                    + '</option>');
	                    $("#productorid"+i).select2("val", [ productorid ]);
	                }
	            }
	        }else{
	            lwalert("tipModal", 1, "已确认盘点，不能再进行修改!");
	        }
	    }

}

function setTableValue(data){

    var tableBodyHtml = "";
    for(var i in data){
        tableBodyHtml += " <tr>";
        tableBodyHtml += "  <td ><input type = 'checkbox' name='boxid' id='boxid"+i+"' value= '"+data[i].inventorydetailid+"' class='regular-checkbox' ><label for='boxid"+i+"'></td>";
        tableBodyHtml += "  <td> <select disabled='false' id='productorid"+i+"' name='productorid' style='width: 150px;'  class='form-control select2'></select></td>";
        tableBodyHtml += "  <td><input disabled='false' type = 'text' id='storagecount"+i+"' value="+data[i].storagecount+" name='storagecount' class='form-control' /></td>";
        tableBodyHtml += "  <td><input disabled='false' type = 'text' id='productorstatus"+i+"' value="+data[i].productorstatus+" name='productorstatus' class='form-control' /></td>";
        tableBodyHtml += "  <td><input type = 'text' id='practicalcount"+i+"' value="+data[i].practicalcount+" name='practicalcount' onkeyup='isNumber()' onafterpaste='isNumber()' class='form-control' /></td>";
        tableBodyHtml += "	<td style='display:none'> <input class='form-control' type='hidden' id='stockunits"+i+"' name='stockunits' value ="+data[i].stockunits+" /></td>";
        tableBodyHtml += " </tr>";

    }
    $("#inventoryProductorTable tbody").html(tableBodyHtml);
}

//加载所有仓库
//function initmap(){
//	$.ajax({
//		type: "post",
//		url : "../../../"+ln_project+"/companyMap",
//		data : {
//            "method" : "queryAllMap",
//        },
//		datetype: "text",
////		async : false,
//        success : function(data) {
//        	 var tempData = $.parseJSON(data);
//             var html = "";
//             for ( var i in tempData) {
//                 html += "<option value=" + tempData[i].mapid + ">" + tempData[i].name
//                         + "</option>";
//             }
//
//             $("#mapid").html(html);
//        }
//	})
//
//}
//加载产品


//增加产品
function addproductor(){

	//在增加盘点产品之前判断是否选中盘点仓库
	if($("select[name=mapid] :selected").val() == null){
		lwalert("tipModal", 1, "请选择需要盘点的仓库!");
		return;
	}
	var i = $("#inventoryProductorTable tbody:eq(0)").find("tr").length;
	if(i!=0){
		 i = getLastIdNumber("inventoryProductorTable");
	}

	$("#inventoryProductorTable tbody:eq(0)").append("<tr> " +
			"<td ><input type = 'checkbox' name='boxid' id='boxid"+i+"' value='' class='regular-checkbox' ><label for='boxid"+i+"'></td>" +

			"<td> <select id='productorid"+i+"' name='productorid' style='width: 150px;'  class='form-control select2'></select></td>"+
			"<td><input disabled type = 'text' id='storagecount"+i+"' name='storagecount' class='form-control' /></td>" +
			"<td><input disabled type = 'text' id='productorstatus"+i+"'  name='productorstatus' class='form-control' /></td>" +
			"<td><input type = 'text' id='practicalcount"+i+"' name='practicalcount' onkeyup='isNumber()' onafterpaste='isNumber()' class='form-control' /></td>" +
			"<td style='display:none'> <input class='form-control' type='hidden' id='stockunits"+i+"' name='stockunits' value =''/></td>"+
			" </tr>");

	com.leanway.initSelect2("#productorid"+i,
			"../../../"+ln_project+"/productors?method=queryAllProductor", "搜索产品");

	$("#productorid"+i).on("select2:select", function(e) {

		var mapid = $("#mapid option:selected").val();
		if(mapid == null || mapid == ''){
			lwalert("tipModal", 1, "请选择仓库！");
			$("#productorid"+i).val("搜索产品").trigger("change");
			return;
		}
		var productorid = $("#productorid"+i).val();
		for(var a=0; a<i ; a++){
			if($("#productorid"+a).val()==productorid){

				lwalert("tipModal", 1, "该产品已在产品盘点列表,请重新输入");
				$("#productorid"+i).val("搜索产品").trigger("change");
			//	$("#select2-productorid"+i+"-container").attr("title","搜索产品");
			//	$("#select2-productorid"+i+"-container").text("");
				return;
			}
		}
		aloadproductordetail(mapid,productorid,i);
	});

}

//加载产品库存数量
function aloadproductordetail(mapid,productorid,i){

	$.ajax({
		type: "post",
		url : "../../../"+ln_project+"/inventory",
		data : {
            "method" : "queryProductorStore",
            "mapid"  : mapid,
            "productorid" : productorid,
            "barcodevalue" : ''
        },
		datetype: "text",
		async : false,
        success : function(data) {

        	var flag =  com.leanway.checkLogind(data);
 			if(flag){
 	        	if(data!=null){
 	            	var jdata = $.parseJSON(data);
 	            	if(jdata.inventoryDetail!=null){
 	            		console.info(jdata.inventoryDetail);
 	                	$("#storagecount"+i).val(jdata.inventoryDetail.storagecount);
 	                	$("#productorstatus"+i).val(jdata.inventoryDetail.productorstatus);
 	                	$("#stockunits"+i).val(jdata.inventoryDetail.stockunits);
 	                	$("#productorid"+i).val(productorid);
 	            	}

 	        	}
 			}

        }
	})

}

//新增盘点单
function addInventory(){
	ope = "addInventory";
	//清select2
	$("#mapid").val("搜索仓库").trigger("change");
		//com.leanway.initSelect2("#mapid", "../../../"+ln_project+"/companyMap?method=queryAllStorageMap", "搜索仓库");
//	$("#confirmstatus1").prop("checked","checked");
	com.leanway.clearTableMapData("inventoryInfo");
	com.leanway.dataTableUnselectAll("inventoryInfo","checkList");
	 $("#saveOrUpdate").prop("disabled",false);
	$("#addproductor").prop("disabled",false);
	$("#deleteInventoryDetail").prop("disabled",false);
	$("#mapid").prop("disabled",false);
	$("#productorid").prop("disabled",false);
	$("#searchDetail").prop("disabled",false);
	$("#inventoryProductorTable tbody").html("");
}

//保存盘点单
function saveInventory(){
	var mapid = $("#mapid").val();
	var productorid = $("#productorid").val();
	if(ope=='addInventory'){

		if($("select[name=mapid] :selected").val()==null){
			lwalert("tipModal", 1, "请选择需要盘点的仓库!");
			return;
		}
//		if($("select[name=productorid] :selected").val()==null){
//			lwalert("tipModal", 1, "请选择需要盘点的产品!");
//			return;
//		}

//		$("select[name=productorid] :selected").each(function(index){
//			console.info(this);
//		})
	}
//	var formdate = "{\"inventoryDetailList\" : " + getTableDataToJson("inventoryProductorTable") +"}";

	if( ope == 'updateInventory' ){
		var inventoryid  = oTable.rows('.row_selected').data()[0].inventoryid;
	}

	$.ajax({
		type: "post",
		url : "../../../"+ln_project+"/additional",
		data : {
            "method" : ope,
            "mapid" : mapid,
            "productorid" : productorid,
//            "formdate" : formdate,
            "inventoryid" : inventoryid
        },
		datetype: "text",
        success : function(data) {

        	var flag =  com.leanway.checkLogind(data);
 			if(flag){
 				 var jdata = $.parseJSON(data);
 	        	 if(jdata.status=='success'){
 	        		 lwalert("tipModal", 1, jdata.info);
 	        		 $("#addproductor").prop("disabled",true);
 	        		 $("#deleteInventoryDetail").prop("disabled",true);
 	        		 $("#mapid").prop("disabled",false);
 	        		$("#productorid").prop("disabled",false);
 	        		$("#searchDetail").prop("disabled",false);
 	        		 $("#saveOrUpdate").prop("disabled",true);
 	        		 com.leanway.clearTableMapData("inventoryInfo");
 	        	    com.leanway.dataTableUnselectAll("inventoryInfo","checkList");
 	        		 oTable.ajax.reload();

 	        	 }else{
 	        		 lwalert("tipModal", 1, jdata.info);
 	        	 }
 			}
        }
	})
}
//删除盘点单
function deleteInventory(type){
	var data = oTable.rows('.row_selected').data();
	var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
    if(data.length == 0) {
        lwalert("tipModal", 1, "请选择需要删除的数据!");
        return;
    }else if(confirmstatus == 2){
    	lwalert("tipModal", 1, "已确认过盘点，无法删除");
    }else{

    	lwalert("tipModal", 2, "确定要删除选中的盘点单吗？","sureDeleteInventory(2,"+type+") ");
    }

}
//删除盘点单明细
function deleteInventoryDetail(){

	var data = $("#inventoryProductorTable tbody input[type=checkbox]:checked");
    if(data.length == 0) {
        lwalert("tipModal", 1, "请选择需要删除的数据!");
        return;
    }
	if(ope == 'addInventory'){
		 $("input[name=boxid]:checked").each(function(index){

			$(this).parent().parent().remove();
		})
		return;
		//var inventoryid  = oTable.rows('.row_selected').data()[0].inventoryid;
	}

	//console.info(inventoryid);
	var ids = com.leanway.getCheckBoxData(1, "inventoryProductorTable", "boxid");
	var arr = ids.split(",");
	//
//	var allIds = $("#inventoryProductorTable tbody").find("tr").length;
	var allIds = details.length;

	if(ids.length < 1 || ids ==''){

		if(ope == 'updateInventory'){
			 $("input[name=boxid]:checked").each(function(index){
				 	if($(this).val() == ''){
				 		$(this).parent().parent().remove();

				 	}
				})

		}else{
			lwalert("tipModal", 1, "请选择需要删除的产品！！");
		}

		return;
	}
	if(arr.length == allIds){

		lwalert("tipModal", 2, "此操作会删除整个盘点单,确定吗？"," sureDeleteInventory(2,1)");
		return;
	}
	if(arr.length != allIds){
		lwalert("tipModal", 2, "确定要删除选中的盘点产品吗？","sureDeleteInventory(1,1) ");
		return;
	}
}

//确定删除盘点明细
function sureDeleteInventory(type,pagetype){
	var ids;
//	var inventoryid;
	if(type == 1){
		ids = com.leanway.getCheckBoxData(1, "inventoryProductorTable", "boxid");

	}else if(type == 2 ){
		if(pagetype == 1){
			ids = com.leanway.getCheckBoxData(1, "inventoryInfo", "checkList");

		}else{
			ids = com.leanway.getCheckBoxData(2, "inventoryInfo", "checkList");
		}
	}

	$.ajax({
	type : "post",
	url : "../../../"+ln_project+"/additional?method=deleteAdditional",
	traditional: true,  //传递数组 (这里没用到  可以不配)
	data : {
		"type" : type,//  1:盘点明细    2：盘点单
		"ids"  : ids,
	},
	dataType : "text",
	async : false,
	success : function(text) {

		var flag =  com.leanway.checkLogind(text);
			if(flag){
				 var jdata = $.parseJSON(text);
		    	 if(jdata.status=='success'){

		    		 if(ope == 'updateInventory'){
		    			 $("input[name=boxid]:checked").each(function(index){
		    				 		$(this).parent().parent().remove();
		    				})
		    		}
		    		 if(type == 2){//删除整个盘点单，重新加载table
		        		 $("#tbody1").html("");
		        		 $("#mapid").val("搜索仓库").trigger("change");
		        		 oTable.ajax.reload();
		    		 }
		    		 lwalert("tipModal", 1, jdata.info);

		    	 }else{
		    		 lwalert("tipModal", 1, jdata.info);
		    	 }
			}
	}
})
}
//确认盘点
function sureInventory(){

	var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
	if(confirmstatus == 1 ){
		lwalert("tipModal", 1, "已确认过盘点,无需重复确认！");
		return;
	}

	var ids = com.leanway.getCheckBoxData(2, "inventoryInfo", "checkList");

	if(ids.length<1 || ids ==''){
		lwalert("tipModal", 1, "请选择需要确认盘点的产品！");
		return;
	}

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/additional?method=updateAdditionalToSure",
		traditional: true,  //传递数组 (这里没用到  可以不配)
		data : {
			"ids" : ids,
			"confirmstatus" : 1
		},
		dataType : "text",
		async : false,
		success : function(text) {
			var flag =  com.leanway.checkLogind(text);
			if(flag){
				 var jdata = $.parseJSON(text);
	        	 if(jdata.status=='success'){

	        		 lwalert("tipModal", 1, "确认成功");
	        		 $("#tbody1").html("");
	        		 $("#mapid").val("搜索仓库").trigger("change");
	        		 oTable.ajax.reload();
	        	 }else{
	        		 lwalert("tipModal", 1, "确认失败");
	        	 }
			}

		}
	})

}
//只能输入数字
function isNumber() {
    var calloutcount = document.getElementsByName("practicalcount");
    for (var i = 0; i < calloutcount.length; i++) {
        calloutcount[i].value = calloutcount[i].value.replace(/[^\d.]/g, '');
    }
}
//或取表单单选框中最后一个id属性的最后一个值+1
function getLastIdNumber(tableid){
	var elements = $("#"+tableid+" tbody .regular-checkbox");
	var id = elements[elements.length-1].getAttribute("id");
	var num = id.substring(id.length-1,id.length);

	return eval(num)+eval(1);
}

//将表单数据转换成json串
function getTableDataToJson(tableId){
    var reg = /,$/gi;

    // 解析Table数据，值为空的跳过
    var tableJson = "[";
    $("#" + tableId + " tbody:eq(0) tr").each(function(index) {
     // 获取文本框的值
//        var inpu = $(this).find("td:eq(9)").find("input");
//        var inputVal = inpu.val();
//
//        if (inputVal != null && $.trim(inputVal) != ""&& $.trim(inputVal) != undefined) {
    		if($(this).find("td:eq(1)").find("select").val()!=null){
    			tableJson += "{\"productorid\":\""
                    + $(this).find("td:eq(1)").find("select").val()
                     + "\",\"inventorydetailid\":\""
                    + $(this).find("td:eq(0)").find("input").val()
                     + "\",\"storagecount\":\""
                    + $(this).find("td:eq(2)").find("input").val()
                     + "\",\"productorstatus\":\""
                    + $(this).find("td:eq(3)").find("input").val()
                     + "\",\"practicalcount\":\""
                    + $(this).find("td:eq(4)").find("input").val()
                    + "\",\"stockunits\":\""
                    + $(this).find("td:eq(5)").find("input").val()
                    + "\"},";
    		}


    //        }
    })
    tableJson = tableJson.replace(reg, "");

    tableJson += "]";
    return tableJson;
}


$("#mapid").on("select2:select", function(e) {

//	$("#procedurename").val($(this).find("option:selected").text());

	var mapid = $(this).find("option:selected").val()

	//搜索该仓库下的产品
	 com.leanway.initSelect2("#productorid", "../../../"+ln_project+"/mapProductor?method=queryProductorByMapId&mapid="+mapid, "搜索产品");
	 

});


//查询盘点信息
function searchMapProductorDetail(){
	
	var mapid = $("#mapid").val();
	var productorid = $("#productorid").val();
	if(ope=='addInventory'){

		if(mapid==null){
			lwalert("tipModal", 1, "请选择需要盘点的仓库!");
			return;
		}
//		if($("select[name=productorid] :selected").val()==null){
//			lwalert("tipModal", 1, "请选择需要盘点的产品!");
//			return;
//		}
	}
	
	
	detailTable.ajax.url("../../../../"+ln_project+"/inoutstockOrder?method=queryMapProductorDetailByConditions&mapid=" + mapid +"&productorid="+productorid).load();
	
//	$.ajax({
//		type : "post",
//		url : "../../../"+ln_project+"/inoutstockOrder?method=queryMapProductorDetailByConditions",
//		traditional: true,  
//		data : {
//			"mapid" : mapid,
//			"productorid" : productorid
//		},
//		dataType : "text",
//		async : false,
//		success : function(text) {
//			var flag =  com.leanway.checkLogind(text);
//			if(flag){
//				 var jdata = $.parseJSON(text);
//	        	 if(jdata.status=='success'){
//	        		 
//	        		 var detailList = jdata.data;
//	        		 appendTabel(detailList);
//	        	 }else{
//	        		 lwalert("tipModal", 1, "盘点失败");
//	        	 }
//			}
//
//		}
//	})

}

var exeprint = function ( ) {
	
	var ids = com.leanway.getCheckBoxData(2, "inventoryInfo", "checkList");
	var confirmstatus =  $('input[name="confirmstatus"]:checked').val();

    if(ids.length == 0) {
        lwalert("tipModal", 1, "请选择盘点单进行打印!");
        return;
    }else if(confirmstatus == 1){
    	lwalert("tipModal", 1, "该盘点单还未确认！");
    }else if(ids.split(",").length > 1) {

    	lwalert("tipModal", 1, "只能选择一个盘点单！");
    }else{
    	lwalert("tipModal", 2, "确定打印该盘点单？","sureprint()");
    }
}

var sureprint = function ( ) {
	
	var inventoryid = com.leanway.getCheckBoxData(2, "inventoryInfo", "checkList");
	

	if ( com.leanway.webscoket.isConnected ) {

		  $.ajax({
			  type : "post",
			  url : "../../../../"+ln_project+"/inventory",
			  dataType : "json",
			  data : {
				  "method" : "queryInventoryAndDetail",
				  "inventoryid" : inventoryid
			  },
			  success : function(data) {
				  
				  
				  var reportResult = com.leanway.getReport("exeprint");
					
				    // 标签名称
					var printName = "盘点报表";
					
					if (reportResult.reportname != "" && reportResult.reportname != "null" && reportResult.reportname != null) {
						 
						printName = reportResult.reportname;
					}
					 
					var printFile="pdbb";
					
					if (reportResult.reportfile != "" && reportResult.reportfile != "null" && reportResult.reportfile != null) {
						printFile = reportResult.reportfile;
					}
					var report =  "\"Reports\":{\"printName\":\""+printName+"\",\"printFile\": \""+printFile+"\",\"ConnectionString\":\"\",\"QuerySQL\":\"\",\"DetailGrid\":{\"Recordset\": {\"ConnectionString\": \"xml\",\"QuerySQL\": \"\"},\"PrintPreview\":true}}"
					var message = "{\"detail\":"+JSON.stringify(data.detailList)+",\"Master\":"+JSON.stringify(data.inventory)+","+report+"}";

					com.leanway.printByJson(message);
//					com.leanway.webscoket.client.send(message);
					
//					var report =  "\"Report\":{\"FileName\": \""+printname+"\",\"ConnectionString\":\"\",\"QuerySQL\":\"\",\"DetailGrid\":{\"Recordset\": {\"ConnectionString\": \"xml\",\"QuerySQL\": \"\"},\"PrintPreview\":true}}"
//    				message = "{\"detail\":"+JSON.stringify(detail)+",\"Master\":"+JSON.stringify(master)+","+report+"}";
					//console.log(printFile);
//					com.leanway.sendReportData(printName, printFile, data.detailList);
				  
			  }
		      
		  });
	  } else {
		  
		 
		  	var port = com.leanway.getPort();

			com.leanway.getListenMessage();

			com.leanway.webscoket.connect("ws://localhost:"+port+"/websocket");
			
			 setTimeout(function () {
		
				  $.ajax({
					  type : "post",
					  url : "../../../../"+ln_project+"/inventory",
					  dataType : "json",
					  data : {
						  "method" : "queryInventoryAndDetail",
						  "inventoryid" : inventoryid
					  },
					  success : function(data) {
						  
						  console.info(data.detailList)
						  
						  var reportResult = com.leanway.getReport("exeprint");
//						  console.log(reportResult);
							
							
							// 标签名称
							var printName = "盘点报表";
							
							if (reportResult.reportname != "" && reportResult.reportname != "null" && reportResult.reportname != null) {
								 
								printName = reportResult.reportname;
							}
							 
							var printFile="pdbb";

							
							if (reportResult.reportfile != "" && reportResult.reportfile != "null" && reportResult.reportfile != null) {
								printFile = reportResult.reportfile;
							}
							
							var report =  "\"Reports\":{\"printName\":\""+printName+"\",\"printFile\": \""+printFile+"\",\"ConnectionString\":\"\",\"QuerySQL\":\"\",\"DetailGrid\":{\"Recordset\": {\"ConnectionString\": \"xml\",\"QuerySQL\": \"\"},\"PrintPreview\":true}}"
							var message = "{\"detail\":"+JSON.stringify(data.detailList)+",\"Master\":"+JSON.stringify(data.inventory)+","+report+"}";
							
							com.leanway.printByJson(message);
							
//							printInfo.PrintByJson(message);
							
//							com.leanway.webscoket.client.send(message);
							//console.log(printFile);
//							com.leanway.sendReportData(printName, printFile, data.detailList);
						  
					  }
				      
				  });

			 }, 500);

			
	  }
  }

//确认调整库存
function adjustInventory(){

	var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
	if(confirmstatus != 2 ){
		lwalert("tipModal", 1, "该盘点单还未盘点，请盘点后再确认调整！");
		return;
	}
	
	if(confirmstatus == 3 ){
		lwalert("tipModal", 1, "该盘点单已调整库存！");
		return;
	}

	var ids = com.leanway.getCheckBoxData(2, "inventoryInfo", "checkList");

	if(ids.length<1 || ids ==''){
		lwalert("tipModal", 1, "请选择需要确认盘点的产品！");
		return;
	}else{
		
		lwalert("tipModal", 2, "确定调整库存？","sureAdjustInventory()");
	}
}


//确认调整库存
function sureAdjustInventory(){

	var ids = com.leanway.getCheckBoxData(2, "inventoryInfo", "checkList");
	
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/additional?method=adjustInventory",
		traditional: true,  
		data : {
			"ids" : ids
		},
		dataType : "text",
		async : false,
		success : function(text) {
			var flag =  com.leanway.checkLogind(text);
			if(flag){
				 var jdata = $.parseJSON(text);
	        	 if(jdata.status=='success'){

	        		 lwalert("tipModal", 1, "确认成功");
	        		 $("#tbody1").html("");
	        		 $("#mapid").val("搜索仓库").trigger("change");
	        		 oTable.ajax.reload();
	        	 }else{
	        		 lwalert("tipModal", 1, jdata.info);
	        	 }
			}

		}
	})

}

