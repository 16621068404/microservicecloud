 var tableHeight = "370px";
var clicktime = new Date();
var mapProductorDetailTable;
var allocateViewTable;
$ ( function () {

	// 初始化对象
	com.leanway.loadTags();
	
	 if (window.screen.availHeight > 768) {
		 tableHeight = "";
		 
		 $(".ztree-wrap").height("100%");
	 }
	 
	 initStorageTree();
	 
	 mapProductorDetailTable = initMapProductorDetailTable();
	 allocateViewTable = allocateViewTable();
	$("input[name=searchFlag]").click(function(){
		queryMapProductorDetail();
	});
	
	com.leanway.enterKeyDown("searchValue", queryMapProductorDetail);
	
	com.leanway.initTimePickYmdForMoreId("#expiretime");

	
	$("input[name=productorstatus]").click(function(){
//		com.leanway.clearTableMapData("dispatchingOrderTable");
		queryMapProductorDetail();
	});
})


var initMapProductorDetailTable = function ( conditions ) {
	
	if (conditions == undefined || typeof(conditions) == "undefined" || conditions == "undefined") {
		var obj = new Object();
		conditions = encodeURIComponent($.trim(JSON.stringify(obj)));
	}
	 
	var table = $('#mapProductorDetailTable').DataTable({
		"ajax" : "../../../../" + ln_project + "/mapProductor?method=queryMapProductorDetailList&jsonCondition=" + conditions,
		"pageUrl" : "productorstorage/productorstorage.html",
		'bPaginate' : true,
		"bDestory" : true,
		"bRetrieve" : true,
		"bFilter" : false,
		"bSort" : false,
		"scrollX": true,
		"scrollY": tableHeight,
		"bProcessing" : true,
		"bServerSide" : true,
        "aoColumns": [
          {
        	  "mDataProp": "mapproductordetailid",
        	  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
        		  $(nTd).html(
        				  "<div id='stopPropagation" + iRow +"'>"
        				  +"<input class='regular-checkbox' type='checkbox' id='" + sData
        				  + "' name='checkList' value='" + sData
        				  + "'><label for='" + sData
        				  + "'></label>");
        		  com.leanway.columnTdBindSelectNew(nTd , "mapProductorDetailTable" , "checkList");
        	  }
          },
          {"mDataProp": "mapname"},
          {"mDataProp": "productorname"},
          {"mDataProp": "productordesc" },
          {"mDataProp": "version" },
          {"mDataProp": "material" },
          {"mDataProp": "batch" },
          {"mDataProp": "serialnumber" },
          {"mDataProp": "count" },
          {"mDataProp": "allocatednumber" },
          {"mDataProp": "isallocate" ,
        	  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                  if (sData != "false") {
                      $(nTd).html("<a  style=\"cursor:pointer;\" onclick=\"viewOrder('" + sData + "');\"  id=\"viewRole" + iRow+ "\">查看</a>");
                  } else {
                      $(nTd).html("");
                  }

              }
          },
                    
          {"mDataProp": "productorstatus",
    	  "fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
				$(nTd).html(productorStatusToName(sData));
			}
          },
//          {"mDataProp": "lockstatus",
//           "fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
//  				$(nTd).html(lockStatusToName(sData));
//  			}
//          },
          {"mDataProp": "casedisplay" },
//          {"mDataProp": "incomingdate" },
          {"mDataProp": "expiretime" },
//          {"mDataProp": "retestdate" },
//          {"mDataProp": "retestexpiredate" }
          ],
          "oLanguage" : {
        	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
          },
          "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
          "fnDrawCallback" : function(data) {
        	  
        	  //com.leanway.getDataTableFirstRowId("generalInfo", ajaxLoadProductionObject,"more", "checkList");
        	  com.leanway.dataTableClickMoreSelect("mapProductorDetailTable", "checkList", false, mapProductorDetailTable, undefined, undefined, undefined, "checkAll");
        	  com.leanway.dataTableCheckAllCheck('mapProductorDetailTable', 'checkAll', 'checkList');

          }
	
	}).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
		table.columns.adjust();
	} );

	return table;
}
function viewOrder(mapproductordetailid){
    $('#allocateViewModal').modal({backdrop: 'static', keyboard: true});
	allocateViewTable.ajax.url("../../../../" + ln_project + "/mapProductor?method=queryAllocateDetail&mapproductordetailid="+mapproductordetailid).load();
}
var allocateViewTable = function () {
	
	var table = $('#allocateView').DataTable({
		"ajax" : "../../../../" + ln_project + "/mapProductor?method=queryAllocateDetail",
		"pageUrl" : "productorstorage/productorstorage.html",
		'bPaginate' : false,
		"bDestory" : true,
		"bRetrieve" : true,
		"bFilter" : false,
		"bSort" : false,
		"bProcessing" : true,
		"bServerSide" : true,
        "aoColumns": [
          {"mDataProp": "allocateorder" },
          {"mDataProp": "allocatednumber" },
          ],
          "oLanguage" : {
        	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
          },
          "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
          "fnDrawCallback" : function(data) {
          }
	
	}).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
		table.columns.adjust();
	} );

	return table;
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
		result = "";
		break;
	}

	return result;
}

/**
 * 锁定状态
 */
var lockStatusToName = function ( status ) {

	var result = "";

	switch (status) {
	case 0:
		result = "未锁定";
		break;
	case 1:
		result = "锁定";
		break;
	default:
		result = "未锁定";
		break;
	}

	return result;
}

var initStorageTree = function ( ) {
	
	$.fn.zTree.init($("#storageTree"), {
	   check : {
            enable : true,
            chkStyle :"checkbox",
            chkboxType : { "Y": "a", "N":"a"},
        },
		async : {
			enable : true,
			url : "../../../" + ln_project + "/companyMap?method=queryStoreTreeList",
			autoParam : [ "mapid", "name" ]
		},
		view : {
			dblClickExpand : false,
			nameIsHTML:true
		},
		data : {

			key : {
				id : "mapid",
				name : "name"
			},
			simpleData : {
				enable : true,
				idKey : "mapid",
				pIdKey : "pid",
				rootPId : ""
			}

		},
		callback : {
			onClick : onClick,
			onAsyncSuccess: onAsyncSuccess,
			onCheck : zTreeOnCheck
		}
	});
}

var onClick = function ( e, treeId, treeNode ) {
	
	if ( treeNode.checked ) {
		$.fn.zTree.getZTreeObj("storageTree").checkNode(treeNode, false, false);
	} else {
		$.fn.zTree.getZTreeObj("storageTree").checkNode(treeNode, true, true);
	}
	
	
	queryMapProductorDetail();
 
}
/**
 * checkBox选中事件
 */
var zTreeOnCheck = function (event, treeId, treeNode) {
	queryMapProductorDetail();
};
// 树形节点一步加载完成
var onAsyncSuccess = function (event, treeId, treeNode, msg) {
 
	try {
		if ( typeof( treeNode ) == "undefined" ) {
			
			//加载节点。
			var zTree = $.fn.zTree.getZTreeObj(treeId);
			zTree.expandAll(true);

/*			var rootNode = zTree.getNodes();

			if (rootNode != null && rootNode.length > 0) {
				for (var i = 0;i<rootNode.length; i ++) {
				 //   zTree.selectNode(rootNode[i]);
					//console.log(rootNode[i]);
				   // zTree.expandNode(rootNode[i], true);
 				}
			}*/
		}
	} catch (e) {
	}

}

/**
 * 查询条件
 */
var getSearchConditions = function ( booleanEncode ) {
	
	var strJson;
	
	// 关键字
	var searchVal = $("#searchValue").val();
	
	//到期时间
	var expiretime = $("#expiretime").val();

	// 产品状态
	var productorstatus = com.leanway.getDataTableCheckIds("productorstatus");

	
	// 勾选的树形结构产品ID
	var levels = "";

	var zTree = $.fn.zTree.getZTreeObj("storageTree");

	if (zTree != null && zTree != "undefined" && typeof(zTree) != "undefined") {
		var nodes = zTree.getCheckedNodes(true);
		for (var i = 0; i < nodes.length; i++) {
			levels += nodes[i].levels + ",";
		}
	}

	// 0：全部，1：下级
	var searchFlag =  $('input[name="searchFlag"]:checked').val();
	
	var condition = new Object();
	condition.searchValue = $.trim(searchVal);
	condition.searchFlag = searchFlag;
	condition.levels = levels;
	condition.expiretime = expiretime;
	condition.productorstatus = productorstatus;
	
	if (booleanEncode) {
		strJson = encodeURIComponent($.trim(JSON.stringify(condition)));
	} else {
		strJson = $.trim(JSON.stringify(condition));
	}
	
	return strJson;
}

/**
 * 查询产品明细
 */
var queryMapProductorDetail = function ( ) {
	
	mapProductorDetailTable.ajax.url("../../../../"+ln_project+"/mapProductor?method=queryMapProductorDetailList&jsonCondition=" + getSearchConditions(true)).load();
}


function addApplication(type){

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}
	var ids = com.leanway.getCheckBoxData(type, "mapProductorDetailTable" , "checkList");
	if (ids.length != 0) {

        var msg = "确定对选中的" + ids.split(",").length + "条库存明细生成质检申请?";
		lwalert("tipModal", 2, msg ,"isSure(" + type + ")");
		return;
	} else {

		lwalert("tipModal", 1, "至少选择一条库存明细！");
	}
}

function isSure(type) {

	var ids = com.leanway.getCheckBoxData(type, "mapProductorDetailTable" , "checkList");
	
	addCheckApplication(ids);
}

//生成质检申请单
var addCheckApplication = function(ids) {
	
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/inoutstockOrder?method=addCheckApplication",
		data : {
			"ids" : ids
		},
		dataType : "text",
		async : false,
		success : function(text) {

            var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
				if (tempData.status == "success") {

//					com.leanway.clearTableMapData( "generalInfo" );
//
//					resetForm();
					mapProductorDetailTable.ajax.reload(null,false);
					lwalert("tipModal", 1, tempData.info)
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1, tempData.info)
				}
			}
		}
	});
}
function connect(){
	var data = mapProductorDetailTable.rows('.row_selected').data();
	if(data.length==0){
		lwalert("tipModal", 1, "请选择产品进行打印");
		return;
	}
//	var port = com.leanway.getPort();
//
//
//	com.leanway.getListenMessage();
//
//	com.leanway.webscoket.connect("ws://localhost:"+port+"/websocket");
//	setTimeout("printMapProductorDetail()",2000);
	printMapProductorDetail();
}

function printMapProductorDetail(){
	var detailids = com.leanway.getCheckBoxData(1, "mapProductorDetailTable" , "checkList");
//	var reportResult = com.leanway.getReport("mapproductordetail");
	
//	if(com.leanway.webscoket.isConnected){
    	// 加载数据
    	$.ajax( {
    		async : false,
    		type : "post",
    		url : "../../../../"+ln_project+"/mapProductor",
    		data : {
    			method: "queryLabelDataByDetailids",
    			detailids:detailids
    		},
    		dataType: "json",
    		success: function(data) {

    			var flag =  com.leanway.checkLogind(data);
    			if(flag){

    				var printName = "原料包装标签";				 
					var printFile="ylbzbq";
//					if (reportResult.reportname != "" && reportResult.reportname != "null" && reportResult.reportname != null) {
//						printName = reportResult.reportname;
//					}
//					if (reportResult.reportfile != "" && reportResult.reportfile != "null" && reportResult.reportfile != null) {
//						printFile = reportResult.reportfile;
//					}
					
					com.leanway.sendReportData(printName, printFile, data);

    			}
    		},
    		error: function(data) {

    		}
    	});

//    }
}
