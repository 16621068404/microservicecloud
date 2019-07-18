var equipmentTable;
var employeeTable;
var liuhuaTable,liuhuaCountTable,mouldLoadBalancingTable;
var reg=/,$/gi;
var tableStatus = false;
var tableHeight = "370px";
var clicktime = new Date();
var condition = "";

$ ( function () {

	 if (window.screen.availHeight > 768) {
		 tableHeight = "";
	 }

	// 初始化对象
	com.leanway.loadTags();
	
	showLiuhuaOrder();
	
	com.leanway.enterKeyDown("liuhuaForm #productorname", queryLiuhuaOrder);
	com.leanway.enterKeyDown("liuhuaForm #contractnumber", queryLiuhuaOrder);
    $("#liuhuaForm #adjuststarttime,#liuhuaForm #adjustendtime,#liuhuaForm #productorname,#liuhuaForm #contractnumber").on("change", function(e) {
    	queryLiuhuaOrder();
    });
	com.leanway.initTimePickYmdForMoreId("#adjuststarttime,#adjustendtime,#balancingForm #starttime,#balancingForm #endtime");
	
   $("#balancingForm #starttime,#balancingForm #endtime").on("change", function(e) {
	   queryMouldLoadBalancing();
    });
	
})

 

var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

function generateMixed(n) {
     var res = "";
     for (var i = 0; i < n ; i ++) {
         var id = Math.ceil( Math.random()*35 );
         res += chars[id];
     }
     return res;
}

//格式化form数据
var  formatExceptionFormJson = function  (formData) {

	var reg=/,$/gi;

	var data = "{";

	for (var i = 0; i < formData.length; i++) {

		var val = formData[i].value;

		data += "\"" +formData[i].name +"\" : \""+val+"\",";

	}

	data = data.replace(reg,"");

	data += "}";
	
	//console.log(data);
	
	var exFormData = eval ("(" + data+")");

	var audituser = $("#audituser").val();
	if (audituser != null && audituser != "" && typeof(audituser) != "undefined" && audituser != undefined) {
		audituser = audituser.toString();
	}
	
	exFormData.audituser = audituser;
	
	return JSON.stringify(exFormData);
}

//格式化form数据
var  formatFormJson = function  (formData) {

	var reg=/,$/gi;

	var data = "{";

	for (var i = 0; i < formData.length; i++) {

		var val = formData[i].value;

		data += "\"" +formData[i].name +"\" : \""+val+"\",";

	}

	data = data.replace(reg,"");

	data += "}";

	return data;
}
 
 

var queryLiuhuaOrder = function ( ) {
	var conditions = "&strCondition=" + encodeURIComponent($.trim(JSON.stringify( liuhuaCondictions())));
	liuhuaTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryDispatchingOrder" + conditions).load();
	liuhuaCountTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryDispatchingOrderGroupSum" + conditions).load();
}

var aoColumns;

var showLiuhuaOrder = function ( ) {
	
	var conditions = "&strCondition=" + encodeURIComponent($.trim(JSON.stringify( liuhuaCondictions())));
	
	if (liuhuaTable == null || liuhuaTable == "undefined" || typeof(liuhuaTable) == "undefined") {
		liuhuaTable = initLiuhuaTable(conditions);
	} else {
		liuhuaTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryDispatchingOrder" + conditions).load();
		//liuhuaTable.ajax.reload();
	}
	
	if (liuhuaCountTable  == null || liuhuaCountTable == "undefined" || typeof(liuhuaCountTable) == "undefined") {
		liuhuaCountTable = initLiuhuaCountTable(conditions);
	} else {
		liuhuaCountTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryDispatchingOrderGroupSum" + conditions).load();
		//liuhuaCountTable.ajax.reload();
	}
	
	queryMouldLoadBalancing();
 
}

var queryMouldLoadBalancing = function ( ) {
	
	// 加载模具负载数据
	if (mouldLoadBalancingTable == null || mouldLoadBalancingTable == "undefined" || typeof(mouldLoadBalancingTable) == "undefined") {
		// 加载模具平衡表表头
		loadMouldLoadBalancingTh();
		mouldLoadBalancingTable = initMouldLoadBalancingTable();
	} else {
		mouldLoadBalancingTable.clear();
		mouldLoadBalancingTable.destroy();
		$('#mouldLoadBalancingDiv').empty();
		$("#mouldLoadBalancingDiv").html('<table id="mouldLoadBalancingTable" class="table table-striped table-bordered table-hover" ><thead><tr id = "mouldTh"></tr></thead></table>');
		// 加载模具平衡表表头
		loadMouldLoadBalancingTh();
//		 console.log(aoColumns);
         mouldLoadBalancingTable = initMouldLoadBalancingTable();
	}
	
	//setTimeout(mouldLoadBalancingTable.columns.adjust(),1000);
}

var liuhuaCondictions = function ( flag ) {

	var sqlJsonArray = new Array()
	
	var procedureShortNameObj = new Object();
	procedureShortNameObj.fieldname = "dco.procedurename";
	procedureShortNameObj.fieldtype = "varchar";
	procedureShortNameObj.value = "硫化";
	procedureShortNameObj.logic = "and";
	procedureShortNameObj.ope = "=";
	sqlJsonArray.push(procedureShortNameObj);

	if (flag || flag == undefined || typeof (flag) == "undefined") {
		var unconfirmnumberObj = new Object();
		unconfirmnumberObj.fieldname = "dco.unconfirmnumber";
		unconfirmnumberObj.fieldtype = "int";
		unconfirmnumberObj.value = "0";
		unconfirmnumberObj.logic = "and";
		unconfirmnumberObj.ope = ">";
		sqlJsonArray.push(unconfirmnumberObj);
	}
	
	var productorname = $("#liuhuaForm #productorname").val();
	if ($.trim(productorname) != "") {

		var productornameObj = new Object();
		productornameObj.fieldname = "ppd.productorname";
		productornameObj.fieldtype = "varchar";
		productornameObj.value = productorname;
		productornameObj.logic = "and";
		productornameObj.ope = "like";

		sqlJsonArray.push(productornameObj);
	}
	
	var contractnumber = $("#liuhuaForm #contractnumber").val();
	if ($.trim(contractnumber) != "") {

		var contractnumberObj = new Object();
		contractnumberObj.fieldname = "dco.contractnumber";
		contractnumberObj.fieldtype = "varchar";
		contractnumberObj.value = contractnumber;
		contractnumberObj.logic = "and";
		contractnumberObj.ope = "like";

		sqlJsonArray.push(contractnumberObj);
	}
	

	// 开始时间
	var adjustStartTime = $("#liuhuaForm #adjuststarttime").val();

	// 结束时间
	var adjustEndTime = $("#liuhuaForm #adjustendtime").val();
	
	if ($.trim(adjustStartTime) != "") {

		var adjustStartTimeObj = new Object();
		adjustStartTimeObj.fieldname = "dco.adjuststarttime";
		adjustStartTimeObj.fieldtype = "datetime";
		adjustStartTimeObj.value = adjustStartTime;
		adjustStartTimeObj.logic = "and";
		adjustStartTimeObj.ope = ">=";

		sqlJsonArray.push(adjustStartTimeObj);
	}

	if ($.trim(adjustEndTime) != "") {

		var adjustEndTimeObj = new Object();
		adjustEndTimeObj.fieldname = "dco.adjuststarttime";
		adjustEndTimeObj.fieldtype = "datetime";
		adjustEndTimeObj.value = adjustEndTime;
		adjustEndTimeObj.logic = "and";
		adjustEndTimeObj.ope = "<=";

		sqlJsonArray.push(adjustEndTimeObj);
	}
	
	var condition = new Object();
	condition.sqlDatas = sqlJsonArray;
	condition.dispatchingStatusArrays = "0,1,2";
	
	// var str=  $.trim(JSON.stringify(condition));
	 //return encodeURIComponent(str);
	 return condition;
}

var initLiuhuaTable = function ( condition ) {
	
	var table = $('#liuhuaTable').DataTable( {
		"ajax": "../../../../"+ln_project+"/dispatchingOrder?method=queryDispatchingOrder"  +condition ,
		/*"iDisplayLength" : "10",*/
		'bPaginate': true,
		"bDestory": true,
		"bRetrieve": true,
		"bFilter":false,
		"bSort": true,
		"bProcessing": true,
		"bServerSide": true,
		"bInfo" : true,
		"columnDefs": [
           { orderable: false,targets: [0]},
           { orderable: false,targets: [1]},
           { orderable: false,targets: [2]},
           { orderable: false,targets: [3]},
           { orderable: false,targets: [4]},
           { orderable: false,targets: [5]},
           { orderable: false,targets: [7]}
           ],
           "aoColumns": [
                         {
                             "mDataProp": "orderid",
                             "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
//                                           $(nTd).html("<input type='checkbox' name='checkList'  value='" + sData + "'>");
                                 $(nTd).html("<div id='stopPropagation" + iRow +"'>"
                                         +"<input class='regular-checkbox' type='checkbox' id='"
                                         + sData
                                         + "' name='liuhuaCheckList' value='"
                                         + sData
                                         + "'><label for='"
                                         + sData
                                         + "'></label>");
                                 com.leanway.columnTdBindSelectNew(nTd,"liuhuaTable","liuhuaCheckList");
                             }
                         },
                         {"mDataProp" : "dispatchingnumber"/*,
                    	  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    		 $(nTd).html(sData + "/" + oData.productionnumber);
                    	   }*/
                         },
                         {"mDataProp" : "productorname"},
                         {"mDataProp" : "productordesc"},
                         {"mDataProp" : "drawcode",
                    	  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                			 $(nTd).html(sData + "/" + oData.material);
                    	  } 
                         },
                         {"mDataProp" : "contractnumber"},
                         {"mDataProp" : "unconfirmnumber"},
                         {"mDataProp": "adjuststarttime",
                        	 "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        		 $(nTd).html(sData + "</br>" + oData.adjustendtime);
                        	 }
                         }
                         ],
                         "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
                        	 //alert(aData.productionnumber);
                         },
                         "oLanguage" : {
                        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                         },
                         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                         "fnDrawCallback" : function(data) {
                        	 com.leanway.setDataTableColumnHide("liuhuaTable");
                        	 com.leanway.dataTableUnselectAll("liuhuaTable","checkAll");
                        	 com.leanway.setDataTableSelectNew("liuhuaTable", null, "liuhuaCheckList", null);
                         }

	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
		table.columns.adjust();
	} );

	return table;
	
}

var initLiuhuaCountTable = function ( condition ) {
	
	var table = $('#liuhuaCountTable').DataTable( {
		"ajax": "../../../../"+ln_project+"/dispatchingOrder?method=queryDispatchingOrderGroupSum"  +condition ,
		'bPaginate': true,
		"bDestory": true,
		"bRetrieve": true,
		"bFilter":false,
		"bSort": false,
	/*	"scrollX":true,*/
		"bProcessing": true,
		"bServerSide": true,
		"bInfo" : true,
           "aoColumns": [
                         {"mDataProp" : "productorname"},
                         {"mDataProp" : "productordesc"},
                         {"mDataProp" : "drawcode",
                    	  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                			 $(nTd).html(sData + "/" + oData.material);
                    	  } 
                         },
                         {"mDataProp" : "count"},
                         {"mDataProp" : "unconfirmnumber"},
                         {"mDataProp" : "workingnumber" ,
                       	  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                       		  var v = sData;
                       		  if (v < 0) {
                       			v = 0;
                       		  }
                   			 $(nTd).html(v);
                       	  } 	 
                         },
                         {"mDataProp" : "stocknumber"}
                         ],
                         "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
                        	 //alert(aData.productionnumber);
                         },
                         "oLanguage" : {
                        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                         },
                         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                         "fnDrawCallback" : function(data) {
                        	 
                         }

	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
		table.columns.adjust();
	} );

	return table;
	
}

var loadMouldLoadBalancingTh = function ( ) {
	
	var starttime = $("#balancingForm #starttime").val();
	var endtime = $("#balancingForm #endtime").val();
 
	var obj = new Object();
	obj.starttime = starttime;
	obj.endtime = endtime;
	
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			method : "loadMouldLoadBalancingTh",
			"strCondition" : $.trim(JSON.stringify(obj))
		},
		dataType : "json",
		async : false, 
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {

			/*	if (data.status == "error") {
					lwalert("tipModal", 1,data.info);
				} else {*/
					$("#mouldTh").html(data.html);
					aoColumns = data.columns;
					 $("#balancingForm #starttime").val(data.starttime);
					 $("#balancingForm #endtime").val(data.endtime);
				//}

			}
		},
		error : function(data) {
			lwalert("tipModal", 1,"ajax 请求失败");
		}
	});
	
}


var initMouldLoadBalancingTable = function ( ) {
	
//	var conditions = "&strCondition=" + liuhuaCondictions();
	
	var starttime = $("#balancingForm #starttime").val();
	var endtime = $("#balancingForm #endtime").val();
	
	var obj = liuhuaCondictions(false);
	obj.starttime = starttime;
	obj.endtime = endtime;
	obj.propColumns = aoColumns;
	
	var condition = "&strCondition=" + encodeURIComponent($.trim(JSON.stringify(obj)));
	
	var table = $('#mouldLoadBalancingTable').DataTable( {
		"ajax": "../../../../"+ln_project+"/dispatchingOrder?method=queryMouldLoadBalancingData"  +condition ,
		'bPaginate': true,
		"bDestory": true,
		"bRetrieve": true,
		"bFilter":false,
		"bSort": false,
		"scrollX":true,
		"bProcessing": true,
		"bServerSide": true,
		"bInfo" : true,
         "aoColumns": aoColumns,
         "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
        	 $(nRow).click(function () {
        		 console.log(aData);
        		 var str = "";
        		 var title = "";
        		 for (var key in aData) {
        			 
        			 if (key == "column0000") {
        				 title = aData[key] + "：</br>"
        			 } else if (key.indexOf("_details") != -1) {
        				if (aData[key] != "") {
        					str += key.replace("_details" , "").replace("column","") + ":" +  aData[key] + "</br>";
        				}
        			 }
        			 
        		 }
        		 
        		 lwalert("tipModal", 1,title + str);
        	 });
         },
         "oLanguage" : {
        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
         },
         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
         "fnDrawCallback" : function(data) {
        	 // this.api().columns.adjust();
         }

	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
		table.columns.adjust();
	} );

	return table;
}

var addPlanDataArray;
var createPlan = function ( ) {
	
	$("#addLiuhuaTabletbody").html("");
	
	// 加载硫化工单对应的硫化产品和硫化模具
	 getLiuhuaProductorMould();
	
	// 添加一行
	addRow();
	
	com.leanway.show("addPlanModal");
}


/**
 * 新增一行
 * 
 * @param tableId
 *            表格标识
 */
var addRow = function( ) {

	var productor = null;
	var mould = null;
 
	if (addPlanDataArray.productor != undefined && typeof(addPlanDataArray.productor) != "undefined") {
		productor = addPlanDataArray.productor;
	}
	
	if (addPlanDataArray.mould != undefined && typeof(addPlanDataArray.mould) != "undefined") {
		mould = addPlanDataArray.mould;
	}

	// 拼凑Tr
	var trHtml = '<tr>';

	trHtml += '<td>';
	trHtml += '<select class="form-control">'
	
	// 产品
	for (var i = 0; i < productor.length; i++) {
		trHtml += '<option value="' + productor[i].versionid + '">' + productor[i].productorname + '</option>';
	}
 
	trHtml += '</select>'
	trHtml += '</td>';
	
	trHtml += '<td><input type="number" min="1" max="1" class="input-sm form-control" ></td>';

	trHtml += '<td>';
	
	// 日期
	trHtml += '<input type="text" class="form-control" id="plantime" >'
	
	/*trHtml += '<select class="form-control" onchange="com.leanway.advancedSelectChange(this)">'

	for (var i = 0; i < fieldInfoData.length; i++) {

		if (i == 0) {
			firstType = fieldInfoData[i].fieldType;
		}

		trHtml += '<option value="' + fieldInfoData[i].fieldName + ','
				+ fieldInfoData[i].fieldType + '">'
				+ fieldInfoData[i].displayName + '</option>';
	}

	trHtml += '</select>'*/
	trHtml += '</td>';

	trHtml += '<td>';
	trHtml += '<select id="productormouldid"  multiple="multiple" name="productormouldid" class="input-sm form-control"   style="width: 170px;height : 32px;" >'

	// 模具
	for (var i = 0; i < mould.length; i++) {
		trHtml += '<option value="' + mould[i].versionid + '">' + mould[i].productorname + '</option>';
	}

	trHtml += '</select>'
	trHtml += '</td>';


	trHtml += '<td style="vertical-align:middle"><a style="cursor: pointer;" onclick="com.leanway.delRow(this)">删除</a></td>';
	trHtml += '</tr>';
	
	$("#addLiuhuaTabletbody").append(trHtml);

	com.leanway.initTimePickYmdForMoreId($("#addLiuhuaTabletbody").find("tr:last").find("td:eq(2)").find("input"));
	$("#addLiuhuaTabletbody").find("tr:last").find("td:eq(2)").find("input")
	$("#addLiuhuaTabletbody").find("tr:last").find("td:eq(3)").find("select").select2({placeholder : "模具(可多选)", tags: false, language : "zh-CN", allowClear: true, maximumSelectionLength: 10 });
}

var getLiuhuaProductorMould = function ( ) {
	
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			method : "queryLiuhuaProductorMould",
			"strCondition" : $.trim(JSON.stringify( liuhuaCondictions()))
		},
		dataType : "json",
		async : false, 
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
				addPlanDataArray = data;
			}
		},
		error : function(data) {
			lwalert("tipModal", 1,"ajax 请求失败");
		}
	});
	 
}

var saveLiuhuaOrder = function ( ) {
	
	 var arrayData = new Array();

	// 把选中的行变成可编辑模式
	$("#addLiuhuaTable tbody tr").each( function (index) {

		// 获取文本框的值
		var dateInput = $(this).find("td:eq(2)").find("input");
		var numberInput = $(this).find("td:eq(1)").find("input");
		var mouldversionidSelect = $(this).find("td:eq(3)").find("select");
		var number = numberInput.val();
		var date = dateInput.val();
		var mouldversionid = mouldversionidSelect.val().toString();
		
		if (com.leanway.isNotEmpty(number) && com.leanway.isNotEmpty(date)) {
			var obj = new Object();
			obj.productorversionid = $(this).find("td:eq(0)").find("select").val();
			obj.starttime = date;
			obj.mouldversionid = mouldversionid;
			obj.plannumber = number;
			
			arrayData.push(obj);
		}

	});
	
	var dor = liuhuaCondictions();
	dor.dosdList = arrayData;

	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			method : "saveLiuhuaOrder",
			"strCondition" : $.trim(JSON.stringify(dor))
		},
		dataType : "json",
		async : false, 
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
				 
				if (data.status == "success") {
					
				    lwalert("tipModal", 1, "操作成功!");
				    showLiuhuaOrder();
				    
					$("#addLiuhuaTabletbody").html("");
					
					// 加载硫化工单对应的硫化产品和硫化模具
					 getLiuhuaProductorMould();
					
					// 添加一行
					addRow();
					 
				} else {
					 lwalert("tipModal", 1, data.info);
				}
				
			}
		},
		error : function(data) {
			lwalert("tipModal", 1,"ajax 请求失败");
		}
	});

	
}
  
