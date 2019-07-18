var clicktime = new Date( );

var oTable = "";
var detailTable ="";
var opeMethod = "addUpgradesql";
var argVal = "" ;
var logid2 = "";
var logstatus ="";
var paramsValues = new Array();
var loginfoValues = new Array();
var selectSqlArray=new Array();
var operationnumber = "";
$(function() {
	
	// 初始化对象
	com.leanway.loadTags();
	
	oTable = initTable();
	
	
	//加载明细
	detailTable = initDetailTable();
	//初始化点击按钮事件
	
	$("input[name=execute]").click(function(){
		queryUpgradesqllog();
	});
	$("input[name=sqlall]").click(function(){
		queryUpgradesqllogDetail();
	});
})

/**
 * 初始化表头表格
 */
//初始化数据表格
var initTable = function () {

	var table = $('#generalInfo').DataTable( {
			"ajax": "../../../"+ln_project+"/upgradesql?method=getLocalFileList",
	        'bPaginate': false,
	        "bDestory": true,
	        "bRetrieve": true,
	        "bFilter":false,
	        "bSort": false,
	        "scrollX": true,
	        "scrollY": "57vh",
//	        "scrollY":"250px",
	        "bProcessing": true,
	        "bServerSide": true,
	        'searchDelay':"5000",
	         "aoColumns": [
	               {
	            	   "mDataProp": "logid",
	                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
	                	   $(nTd).html("<div id='stopPropagation" + iRow +"'>"
								   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='checkupgreadesql' value='" + sData
                                   + "'><label id='label"+sData+  "'for='" + sData
                                   + "'></label>");
						 com.leanway.columnTdBindSelectNew(nTd,"generalInfo","checkupgreadesql");
	                   }
	               },
	               {"mDataProp": "filename"},
	               {"mDataProp": "isexecute"},
	               {"mDataProp": "createtime"},
	          ],

	         "oLanguage" : {
	        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
	         },
	         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	         "fnDrawCallback" : function(data) {
	        	 //回调
	        	 com.leanway.getDataTableFirstRowId("generalInfo", ajaxUpgradesqldetaillog,"more","checkupgreadesql");
	        	
	        	 com.leanway.dataTableClickMoreSelect("generalInfo", "checkupgreadesql", false,
                         oTable, ajaxUpgradesqldetaillog,undefined,undefined, 'checkAll');
					 
	         }
	    } ).on('xhr.dt', function (e, settings, json) {
	    	com.leanway.checkLogind(json);
		} );

	return table;
}
/**
 * 初始化明细表
 */
var initDetailTable = function () {
	var table = $('#detail').DataTable( {
		"ajax": "../../../"+ln_project+"/upgradesql?method=getLocalFileDetailList",
        'bPaginate': false,
        "bDestory": true,
        "bRetrieve": true,
        "bFilter":false,
        "bSort": false,
        "bAutoWidth": true,
        "scrollX": true,
        "scrollY": "63vh",
//        "scrollY":"425px",
//        "scrollY":tableHeight,
        "bProcessing": true,
        "bServerSide": true,
        'searchDelay':"5000",
         "aoColumns": [
               {
            	   "mDataProp": "logid",
                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                	   $(nTd).html("<div id='stopPropagation" + iRow +"'>"
							   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                               + "' name='checkDetail' value='" + sData
                               + "'><label for='" + sData
                               + "'></label>");
					 com.leanway.columnTdBindSelectNew(nTd,"checkDetail","detail");
                   }
               },
               { "mDataProp": "executesql" ,
               "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
            	   if (sData == undefined || sData == null  ) {
             		  $(nTd).html("");
            	   } else{
             		  if (sData != "false") {
             			  if (sData.length >= 25){
             				 paramsValues[iRow] = sData;
             				  $(nTd).html("<a  style=\"cursor:pointer;\" onclick=\"viewSql\('" + iRow + "'\);\"  id=\"viewEmployee" + iRow+ "\">"+sData.substr( 0, 27 )+"...</a>");
             			  }else {
             				  $(nTd).html(sData);
             			  }
             		  	} else {
             		  		$(nTd).html("");
             		  	}
            	   }

               } },
               {"mDataProp": "sqlstatus"},
               { "mDataProp": "loginfo" ,
              "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
            	  if (sData == undefined || sData == null  ) {
            		  $(nTd).html("");
            	  } else{
              		 if (sData != "false") {
              			 if (sData.length >= 9){
              				loginfoValues[iRow] = sData ;
              				 $(nTd).html("<a  style=\"cursor:pointer;\" onclick=\"viewLog('" + iRow + "');\"  id=\"viewEmployee" + iRow+ "\">"+sData.substr( 0, 11 )+"...</a>");
              			 }else {
              				 $(nTd).html(sData);
              			 }
              		 } else {
              			 $(nTd).html("");
              		 }
            	  }
               }, },
               {"mDataProp": "operationnumber"},
               {"mDataProp": "createtime"},
          ],

         "oLanguage" : {
        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
         },
         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
         "fnDrawCallback" : function(data) {
				com.leanway.dataTableCheckAllCheck('detail', 'checkDetailAll', 'checkDetail');
         }
    } ).on('xhr.dt', function (e, settings, json) {
	} );

	return table;
}

function ajaxUpgradesqldetaillog(logid){
	if (operationnumber != undefined && operationnumber!= null && operationnumber !="" ) {
		//刷新
		detailTable.ajax.url("../../../../"+ln_project+"/upgradesql?method=getLocalFileDetailListByOperationnumber&operationnumber="+operationnumber).load();
		operationnumber ="" ;
	}else {
		
		if (logstatus == "0") {
			logid = logid2;
		}
		var sqlallStatus = com.leanway.getDataTableCheckIds("sqlall");
		//然后将logid2设置为空
		detailTable.ajax.url("../../../../"+ln_project+"/upgradesql?method=getLocalFileDetailList&logid=" + logid+"&sqlallStatus=" +sqlallStatus).load();
		logid2 = "";
		logstatus = "" ;
	}
	
}

function executeSql(type) {
	// 1：根据选中的SQL文件执行对应的SQL(argVal:传递文件路径)，2：未执行的文件全部执行（argVal:不需要），3：执行异常的SQL语句（argVal:传异常SQL），4：把选中的SQL文件标记成已执行（argVal:文件名），5：未执行的文件全部标记成已执行（不需要）
	
	//获取选中的dataTable的ids
	
	var ids = com.leanway.getCheckBoxData(1, "generalInfo", "checkupgreadesql");
	logid2 = ids;
	if ( type == 1 ) {
		if (ids.length<=0) {
			lwalert("tipModal", 1, "请至少选择一条数据库日志执行操作");
			return ;
		}
		argVal = ids ;
	}else if ( type == 2) {
		argVal = "";
	}else if ( type == 4 ) {
		if (ids.length<=0) {
			lwalert("tipModal", 1, "请至少选择一条数据库日志执行操作");
			return ;
		}
		argVal = ids ;
	}else if (type == 5){
		argVal = "";
	}
	ajaxExecuteSql(type);
}
//执行sql
function ajaxExecuteSql(type){
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/upgradesql",
		data : {
			"method": "executeSql",
			"type" : type,
			"argVal": argVal
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){
					var ids = com.leanway.getCheckBoxData(1, "generalInfo", "checkupgreadesql");
					//设置一个类型
					if ( type ==1 || type ==2 ) {
						//获取操作号
						operationnumber =data.operationnumber;
					}else {
						logstatus = "0";
						//
						logid2 = ids;
					}
					
					//获取页面的复选框的值
					var executeStatus = com.leanway.getDataTableCheckIds("execute");
					//刷新页面
					oTable.ajax.url("../../../../"+ln_project+"/upgradesql?method=getLocalFileList&executeStatus="+executeStatus).load();
					//刷新另一个dataTable
				
					
					lwalert("tipModal", 1, data.info);
			}
		}
	});
}

/**
 * 查询数据库日志
 */
function queryUpgradesqllog() {
	//获取页面的checkbox的值
	var executeStatus = com.leanway.getDataTableCheckIds("execute");
	
	oTable.ajax.url("../../../../"+ln_project+"/upgradesql?method=getLocalFileList&executeStatus="+executeStatus).load();
}
/**
 * 查询数据库日志明细
*/
function  queryUpgradesqllogDetail(){
	//获取页面的checkbox的值
	var sqlallStatus = com.leanway.getDataTableCheckIds("sqlall");
	//获取页面的logid的值
	var logid2 = com.leanway.getCheckBoxData(1, "generalInfo", "checkupgreadesql");
	//刷新
	detailTable.ajax.url("../../../../"+ln_project+"/upgradesql?method=getLocalFileDetailList&logid=" + logid2 +"&sqlallStatus=" +sqlallStatus).load();
}
/**
 * 展示超链接的内容(sql)
 */
function viewSql(rows) {
		// 弹出modal
	$("#sqlView").html(paramsValues[rows]);
	$('#veiwSql').modal({backdrop: 'static', keyboard: true});
}
function viewLog(rows){
	
	$("#sqlView").html(loginfoValues[rows]);
	$('#veiwSql').modal({backdrop: 'static', keyboard: true});
}

/**
 * 展示文件里面的sql
 */
function viewSelectSql(){
	var string = "";
	for (var i=0 ;i<selectSqlArray.length;i++) {
		string +=selectSqlArray[i].executesql+"<hr/>";
	}
	if (string == "") {
		
		$("#sqlView").html("沒有SQL语句");
	}
	$("#sqlView").html(string);
	$('#veiwSql').modal({backdrop: 'static', keyboard: true});
}
/**
 * 查看sql
 */
function selectSql(){
	//获取选中的dataTable的id
	var data = oTable.rows('.row_selected').data();
	var ids = com.leanway.getCheckBoxData(1, "generalInfo", "checkupgreadesql");
	//获取ids
	if (data.length>1) {
		lwalert("tipModal", 1, "只能选择一个文件查看SQL！");
	} else if (data.length == 0 ) {
		lwalert("tipModal", 1, "请选择一个文件查看SQL！");
	} else {
		if (ids ==undefined || ids== null || ids =='') {
			lwalert("tipModal", 1, "请选择一个文件查看SQL！");
		}else {
			showSelectSql(ids);
		}
	}

}
/**
 * 查看sqlajax
 * @param ids
 */
function showSelectSql(ids){
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/upgradesql",
		data : {
			"method": "getSql",
			"ids": ids
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){
				 selectSqlArray = data.data ;
				 //然后用模态框显示
				 if(selectSqlArray !=undefined || selectSqlArray != null ){
					 viewSelectSql();
				 }
			}
		}
	});
}
