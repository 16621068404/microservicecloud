
var ope="";

//全局参数  clicktime
var clicktime=new Date();

var oTable,mouldCalandar;

//初始化时候方法
$ ( function () {
	// 初始化对象
	com.leanway.loadTags();
	
	initQueryTime();

	// 加载datagrid
	oTable = initTable();

	com.leanway.initTimePickYmdForMoreId("#workday,#workday1,#workday2");
	
	com.leanway.enterKeyDown("searchVal", queryMould);
	com.leanway.enterKeyDown("mcSearchVal", queryMouldCalendar);
    $("#workday1,#workday2").on("change", function(e) {
    	queryMouldCalendar();
    });
	
})

var initQueryTime = function ( ) {
	
	var number = 15;
	
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/productors",
		data : {
			method : "querySettingTime",
			"number" : number
		},
		dataType : "json",
		async : false, 
		success : function ( data ) {
			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
				
				$("#workday1").val(data.t1);
				$("#workday2").val(data.t2);
				//$("#soModalForm #companionid").select2("val", [data.companionid]);	
			 
			}
		},
		error : function(data) {
			lwalert("tipModal", 1,"ajax error");
		}
	});
	
}


 
var queryMould = function ( ) {

	var sv = $("#searchVal").val();
	var condition = new Object();
	condition.searchValue = $.trim(sv);
	var conditions = "&conditions=" + com.leanway.encodeURI(condition);

	oTable.ajax.url("../../../"+ln_project+"/productors?method=queryMould" + conditions).load();
}

var queryMouldCalendar = function ( ) {
	
	var workday1 = $("#workday1").val();
	var workday2 = $("#workday2").val();
	
	var arrayData = com.leanway.getRowSelectedData(oTable);
	var mouldid = "";
	if (arrayData.length > 0 ) {
		mouldid = arrayData[0].productorid;
	} else {
		mouldid = $("#mouldid").val();
	}
	
	var condition = new Object();
	var sqlJsonArray = new Array()

	var mdobj = new Object();
	mdobj.fieldname = "mouldid";
	mdobj.fieldtype = "varchar";
	mdobj.value = mouldid;
	mdobj.logic = "and";
	mdobj.ope = "=";
	sqlJsonArray.push(mdobj);
	
	if ($.trim(workday1) != "") {

		var workday1Obj = new Object();
		workday1Obj.fieldname = "workday";
		workday1Obj.fieldtype = "datetime";
		workday1Obj.value = workday1;
		workday1Obj.logic = "and";
		workday1Obj.ope = ">=";

		sqlJsonArray.push(workday1Obj);
	}
	
	if ($.trim(workday2) != "") {

		var workday2Obj = new Object();
		workday2Obj.fieldname = "workday";
		workday2Obj.fieldtype = "datetime";
		workday2Obj.value = workday2;
		workday2Obj.logic = "and";
		workday2Obj.ope = "<=";

		sqlJsonArray.push(workday2Obj);
	}
	
	condition.mouldid = mouldid;
	condition.searchValue = $.trim( $("#mcSearchVal").val());
	condition.sqlDatas = sqlJsonArray;
	
	var conditions = "&conditions=" + com.leanway.encodeURI(condition);

	mouldCalandar.ajax.url("../../../"+ln_project+"/productors?method=queryMouldCalandarPage" + conditions).load();
	
}

var getSearchCondition = function ( ) {
	
	
}


/**
 * type  1：新增，2：修改
 */
var showMouldModal = function( type ) {
	
	com.leanway.clearForm("mouldModalForm");
	
	var arrayData = com.leanway.getRowSelectedData(oTable);
	
	if (arrayData.length == 0 || arrayData.length > 1) {
		lwalert("tipModal", 1,"请选择一条模具后进行操作！");
		return;
	}
	
	if (type == 2) {
		
		var mcid = com.leanway.getDataTableCheckIds("mcCheckList");
		
		if (mcid == "" || mcid.indexOf(",") != -1) {
			lwalert("tipModal", 1,"请选择一条数据修改！");
			return;
		} else {
			loadMouldCalendar(mcid);
			
		}
		
	}
	
	$("#mouldid").val(arrayData[0].productorid);
	
	com.leanway.show("mouldModal");
}

var saveMouldCalendar = function ( ) {
	
	var formData = com.leanway.formatForm("#mouldModalForm");
	
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/productors",
		data : {
			method : "saveMouldCalendar",
			conditions: formData
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {

				if (data.status == "error") {
					lwalert("tipModal", 1,data.info);
				} else {
					$("#mouldModal").modal("hide");
					mouldCalandar.ajax.reload();
				}

			}
		},
		error : function(data) {
			lwalert("tipModal", 1,"ajax error");
		}
	});
	
}

var loadMouldCalendar = function ( mcid ) {
	
	var conditions = new Object();
	conditions.mouldcalendarid = mcid;
	
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/productors",
		data : {
			method : "queryMouldCalendar",
			"conditions" : JSON.stringify(conditions)
		},
		dataType : "json",
		async : false, 
		success : function ( data ) {
			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
				
				com.leanway.setFormValue("mouldModalForm", data);
				//$("#soModalForm #companionid").select2("val", [data.companionid]);	
			 
			}
		},
		error : function(data) {
			lwalert("tipModal", 1,"ajax error");
		}
	});

	
}


//初始化数据表格
var initTable = function() {

	var table = $('#generalInfo')
	.DataTable(
			{
				"ajax" : "../../../"+ln_project+"/productors?method=queryMould",
		//		"iDisplayLength" : "10",
				'bPaginate' : true,
				"bDestory" : true,
				"bRetrieve" : true,
				"bFilter" : false,
				"bSort" : false,
				"scrollY":"320px",
				"bProcessing" : true,
				"bServerSide" : true,
				'searchDelay' : "5000",
				"columns": [
				            {"data" : "mouldid"},
				            { "data": "mouldname" },
				            { "data": "compid" },
				            ],
				            "aoColumns": [
				                          {
				                        	  "mDataProp": "productorid",
				                        	  "fnCreatedCell" : function(nTd, sData,
				                        			  oData, iRow, iCol) {
				                        		  $(nTd)
				                        		  .html("<div id='stopPropagation" + iRow +"'>"
				                        				  +"<input class='regular-checkbox' type='checkbox' id='"
				                        				  + sData
				                        				  + "' name='checkList' value='"
				                        				  + sData
				                        				  + "'><label for='"
				                        				  + sData
				                        				  + "'></label>");
				                        		  com.leanway.columnTdBindSelectNew(nTd,"generalInfo","checkList");
				                        	  }
				                          },
				                          {"mDataProp": "productorname"},
				                          {"mDataProp": "productordesc"},
				                          {"mDataProp": "material"}
				                          ],
				                          "oLanguage" : {
				                        	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
				                          },
				                          "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
				                          "fnDrawCallback" : function(data) {
				                        	 com.leanway.getDataTableFirstRowId("generalInfo", ajaxLoadMould,"more","checkList");
				                        		com.leanway.dataTableClickMoreSelect("generalInfo","checkList", false, oTable, ajaxLoadMould, undefined,undefined);
									/*		 com.leanway.dataTableCheckAllCheck('generalInfo', 'checkAll', 'checkList');*/
				                          }

			}).on('xhr.dt', function (e, settings, json) {
				com.leanway.checkLogind(json);
			} );

	return table;
}

var ajaxLoadMould = function ( id ) {
	
	$("#mouldid").val(id);
	
	var workday1 = $("#workday1").val();
	var workday2 = $("#workday2").val();
		
	var so = new Object();
	var sqlJsonArray = new Array()

	var obj = new Object();
	obj.fieldname = "mouldid";
	obj.fieldtype = "varchar";
	obj.value = id;
	obj.logic = "and";
	obj.ope = "=";
	sqlJsonArray.push(obj);
	
	if ($.trim(workday1) != "") {
		var workday1Obj = new Object();
		workday1Obj.fieldname = "workday";
		workday1Obj.fieldtype = "datetime";
		workday1Obj.value = workday1;
		workday1Obj.logic = "and";
		workday1Obj.ope = ">=";
		sqlJsonArray.push(workday1Obj);
	}
	
	if ($.trim(workday2) != "") {
		var workday2Obj = new Object();
		workday2Obj.fieldname = "workday";
		workday2Obj.fieldtype = "datetime";
		workday2Obj.value = workday2;
		workday2Obj.logic = "and";
		workday2Obj.ope = "<=";
		sqlJsonArray.push(workday2Obj);
	}
	
	so.sqlDatas = sqlJsonArray;
	so.mouldid = id;
	
	var conditions = "&conditions=" + com.leanway.encodeURI(so);
 
	if (mouldCalandar == null || mouldCalandar == undefined || typeof(mouldCalandar) == "undefined") {
		// 初始化产品的版本
		mouldCalandar = initMouldCalandar(conditions);
	} else {
		mouldCalandar.ajax.url('../../../../'+ln_project+'/productors?method=queryMouldCalandarPage' + conditions).load();
	}
	
}

var initMouldCalandar = function ( conditions ) {
	
	var table = $("#mouldCalandar").DataTable( {
		"ajax" : "../../../../" + ln_project + "/productors?method=queryMouldCalandarPage" + conditions,
		'bPaginate' : true,
		"bDestory" : true,
		"bRetrieve" : true,
		"bSort" : false,
		"bFilter":false,
		"scrollX": true,
		"bAutoWidth" : true,
		"bProcessing" : true,
		"bServerSide" : true,
		"aoColumns" : [
		    {
		    	"mDataProp" : "mouldcalendarid",
		    	"fnCreatedCell" : function (nTd, sData, oData, iRow, iRow) {
		    		
		    		$(nTd).html("<div id='stopPropagation" + iRow +"'><input class='regular-checkbox' type='checkbox' id='" + sData + "' name='mcCheckList' value='" + sData + "'><label for='" + sData + "'></label>");
                    com.leanway.columnTdBindSelectNew(nTd,"mouldCalandar","mcCheckList");
                    
		    	}
		    }, {"mDataProp" : "workday"},
		    {"mDataProp" : "comments"}
		],
		"oLanguage" : {
			 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		},
		"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		"fnDrawCallback" : function(data) {
			com.leanway.dataTableClickMoreSelect("mouldCalandar", "mcCheckList", false,  mouldCalandar, undefined,undefined,undefined);
		}
		
	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );

	return table;
	
}
  
