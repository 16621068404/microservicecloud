var zTree = "";
var allExceptionTable;
$ ( function () {
//	initTreeBom();
	com.leanway.initSelect2("#productorid", "../../../../"+ln_project+"/productors?method=queryProductorBySearch", "搜索产品",true);
	com.leanway.initSelect2("#contractid", "../../../"+ln_project+"/invoice?method=querySalesOrder", "搜索合同",true);
	$("input[name=searchBom]").click(function(){
		queryDispatchingReport();
	});
	allExceptionTable = initDispatchingOrderAllException( );
   
})

var treeMethod="queryBomTreeList"
//根据查询条件查询树
var queryTreeByContract = function(){
	zTree = $.fn.zTree.getZTreeObj("treeDemo");
	var contractid = $("#contractid").val();
	if (contractid != null && contractid != "" && typeof(contractid) != "undefined" && contractid != undefined) {
		contractid = contractid.toString();
	}else{
	    lwalert("tipModal", 1, "请选择合同号进行查询!");
	    return;
	}
	var productorid = $("#productorid").val();
	if (productorid != null && productorid != "" && typeof(productorid) != "undefined" && productorid != undefined) {
		productorid = productorid.toString();
	}
	initTreeBom("queryBomTreeByContractAndProductorid&contractid="+contractid+"&productorid="+productorid);
};
var initTreeBom = function (treeMethod) {

	$.fn.zTree.init($("#treeBom"), {
        check : {
            enable : true,
            chkStyle :"checkbox",
            chkboxType : { "Y": "a"},
        },
		async : {
			enable : true,
			url : "../../../../"+ln_project+"/bom?method="+treeMethod,
			autoParam : [ "levels"]
		},
		view : {
			dblClickExpand : false,
			fontCss:getFontCss,
			showLine: true,
		},
		data : {
			key : {
				id : "bomid",
				name : "productorname"
			},
			simpleData : {
				enable : true,
				idKey : "bomid",
				pIdKey : "pid",
				rootPId : ""
			}
		},
		callback : {
			// onRightClick : OnRightClick,
			onClick : onClick,
			onCheck : zTreeOnCheck
		}
	});

}
/**
 * checkBox选中事件
 */
var zTreeOnCheck = function (event, treeId, treeNode) {
	queryDispatchingReport();
};

var getFontCss = function (treeId, treeNode) {
    return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
}

function onClick(e, treeId, treeNode) {

	if ( treeNode.checked ) {
		$.fn.zTree.getZTreeObj("treeBom").checkNode(treeNode, false, false);
	} else {
		$.fn.zTree.getZTreeObj("treeBom").checkNode(treeNode, true, true);
	}
	queryDispatchingReport();
}
function queryDispatchingReport(){
	var zTree = $.fn.zTree.getZTreeObj("treeBom");
	var levels="";
	if (zTree != null && zTree != "undefined" && typeof(zTree) != "undefined") {
		var nodes = zTree.getCheckedNodes(true);
		for (var i = 0; i < nodes.length; i++) {
			levels += nodes[i].levels + ",";
		}
	}
	var contractid = $("#contractid").val();
	if (contractid != null && contractid != "" && typeof(contractid) != "undefined" && contractid != undefined) {
		contractid = contractid.toString();
	}else{
	    lwalert("tipModal", 1, "请选择合同号进行查询!");
	    return;
	}
	// 0：全部，1：下级
	var searchBom =  $('input[name="searchBom"]:checked').val();
        
        $.ajax({
            type : "post",
            url : "../../../"+ln_project+"/productionGroupReport?method=queryDispatchingReport",
            data : {
                "contractid":contractid,
                "levels":levels,
                "searchBom":searchBom
            },
            dataType : "text",
            success : function(data) {
                var flag =  com.leanway.checkLogind(data);
                var tempData = $.parseJSON(data);
                if(flag){
                    hideMask("mask");
                    $("#generalInfo").html(tempData.html);
                    $("table tr td").dblclick(function(){
                    	var val = $(this).attr("id")
                    	if(val!=""&&val!=null){
                            showException(val)
                    	}

                    });
                }
            },
            error : function(data) {

            }
        });
}
function showException(orderids){
	
	var searchCondition = new Object();
	
	searchCondition.orderids = orderids;
	
	var strCondition = encodeURIComponent($.trim(JSON.stringify(searchCondition)));
	
	allExceptionTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryDispatchingOrderException&strCondition=" + strCondition).load();
	
	$('#exceptionDataModal').modal({backdrop: 'static', keyboard: true});
}

var initDispatchingOrderAllException = function ( ) {
	
	var table = $('#allExceptionTable').DataTable( {
		"ajax": '../../../../'+ln_project+'/dispatchingOrder?method=queryDispatchingOrderException',
		//"iDisplayLength" : "10",
/*		"scrollY": "200px",
	    "scrollCollapse": "true",*/
		'bPaginate': true,
		"bDestory": true,
		"bRetrieve": true,
		"bFilter":false,
		"bSort": false,
		"bProcessing": true,
		"bServerSide": true,
		"bInfo" : true,
		"aoColumns": [
		              {
		            	  "mDataProp": "orderexceptionid",
		            	  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
//		            		  $(nTd).html("<input type='checkbox' name='employeeCheckList'  value='" + sData + "'>");
		            		  $(nTd)
		            		  .html("<div id='stopPropagation" + iRow +"'>"
		            				  +"<input class='regular-checkbox' type='checkbox' id='"
		            				  + sData
		            				  + "' name='allExceptionCheckList' value='"
		            				  + sData
		            				  + "'><label for='"
		            				  + sData
		            				  + "'></label>");
                              com.leanway.columnTdBindSelectNew(nTd,"allExceptionTable","allExceptionCheckList");
		            	  }
		              },
		              {"mDataProp": "dispatchingnumber"},
		              {"mDataProp": "productionchildsearchno"},
		              {"mDataProp": "productorname"},
		              {"mDataProp": "codevalue"},
		              {"mDataProp": "exceptiondesc"},
		              {"mDataProp": "exceptiontime"},
		              {"mDataProp": "unitsname"},
		              {"mDataProp": "iscalculate",
						"fnCreatedCell" : function(nTd, sData,
								oData, iRow, iCol) {
							$(nTd).html(iscalculateToName(sData));
						}
		            	  
		              },
		              {"mDataProp": "beencalculate",
						"fnCreatedCell" : function(nTd, sData,
								oData, iRow, iCol) {
							$(nTd).html(beencalculateToName(sData));
						}
		            	  
		              },
		              {"mDataProp": "exceptionstatus",
							"fnCreatedCell" : function(nTd, sData,
									oData, iRow, iCol) {
								$(nTd).html(exceptionstatusToName(sData));
							}
			            	  
			          },
			          {"mDataProp": "comments"}
		              ],
		              "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
		           
		              },
		              "oLanguage" : {
		            	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		              },
		              "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		              "fnDrawCallback" : function(data) {
		            	   
		              }

	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );

	return table;
	
}
var iscalculateToName = function ( status ) {
	var result = "";

	switch (status) {
	case 0:
		result = "是";
		break;
	case 1:
		result = "否";
		break;

	}
	return result;
}

var exceptionstatusToName = function ( status ) {
	var result = "";

	switch (status) {
	case 0:
		result = "正常";
		break;
	case 2:
		result = "警告";
		break;
	case 3:
		result = "异常";
		break;
	}
	return result;
}

var beencalculateToName = function ( status ) {
	var result = "";

	switch (status) {
	case 0:
		result = "未调";
		break;
	case 1:
		result = "已调";
		break;

	}
	return result;
}