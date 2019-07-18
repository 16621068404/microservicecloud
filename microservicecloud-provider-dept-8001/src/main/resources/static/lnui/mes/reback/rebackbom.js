
var flag=0;

var levels = ""
var bomid1 = "";
var stHtml = "";
var strhtml = "";
// 初始化树
var setting = {

	view : {
		dblClickExpand : false
	},

	callback : {
	// onRightClick : OnRightClick
	}
};
var curSrcNode, curType;
function setCurSrcNode(treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	if (curSrcNode) {
		delete curSrcNode.isCur;
		var tmpNode = curSrcNode;
		curSrcNode = null;
	}
	curSrcNode = treeNode;
	if (!treeNode) return;
	curSrcNode.isCur = true;
	zTree.cancelSelectedNode();
}

function isSure(nodes,treeId) {

	var nodes = zTree.getSelectedNodes();
	deleteAjax(nodes[0].levels,treeId);
	zTree.removeNode(nodes[0]);

}
// 删除节点
function removeTreeNode(treeId) {
	//checkSession();
	// hideRMenu();
	var nodes = zTree.getSelectedNodes();
	if (nodes && nodes.length > 0) {
		if (nodes[0].children && nodes[0].children.length > 0) {
//			var msg = "删除母件则母件底下的组件一起删掉！";
			lwalert("tipModal", 2, "还原母件则母件底下的组件一起还原！",isSure(nodes,treeId));

		} else {
			lwalert("tipModal", 2, "你确定要还原吗！",isSure(nodes,treeId));
		}
	} else {
		// alert("请选择要删除的组件");
		lwalert("tipModal", 1, "请选择要还原的组件")
	}
}
// 删除Ajax
var deleteAjax = function(levels,treeId) {

	var url;
	var data;

	if(treeId=="treeDemo"){
		url = "../../../../"+ln_project+"/bom?method=deleteBom";
		data = {
			"conditions" : levels,
			"reback":"Y"
		};
	}else{

		 url = "../../../../"+ln_project+"/companyMap?method=deleteCompanyMap";
	        data = {
	            "conditions" : levels,
	            "reback":"Y"
	        };
	}

	$.ajax({
		type : "post",
		url : url,
		data : data,
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
				if (tempData.code == "1") {
					//	resetForm();
				} else {
					// alert("操作失败");
					lwalert("tipModal", 1, "操作失败")
				}

			}
		}
	});
}

var zTree, treeMenu;
/*$(document).ready(function() {
	$.fn.zTree.init($("#treeDemo"));
	zTree = $.fn.zTree.getZTreeObj("treeDemo");
	// treeMenu = $("#treeMenu");
});*/

var oTable;
var aTable

/*$(function() {
	//checkSession();
	// 初始化对象
	com.leanway.loadTags();
	// 加载datagrid
	oTable = initTree();
//	queryBomCodeList();
	aTable=initTable();
	//queryCodeTypeList();
})*/
function clickOthers(treeId){
	//alert(treeId);
		oTable = initTree(treeId);
		$.fn.zTree.init($(treeId));
		zTree = $.fn.zTree.getZTreeObj(treeId);
}

var treeMethod;
var status="Y";
var initTree = function(treeId) {

	if(treeId=="treeDemo"){
		treeMethod="queryBomTreeList";
	}else{

		treeMethod="queryCompanyMapTreeList";
	}

	getBomTreeList(treeMethod,treeId);
	var zTree = $.fn.zTree.getZTreeObj(treeId);
}

function getBomTreeList(treeMethod,treeId) {
	//checkSession();
	var url ;
	var autoParam ;
	var data;

	if(treeId=="treeDemo"){
		url = "../../../../"+ln_project+"/bom?method="+treeMethod+"&reback="+status;
		autoParam = [ "levels"];
		data = {
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

		};
	}else{

		   url = "../../../../"+ln_project+"/companyMap?method="+treeMethod+"&reback="+status;

		   autoParam =[ "mapid"];

		   data = {

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

	        };

	}


	$.fn.zTree.init($("#"+treeId), {

		async : {
			enable : true,
			url : url,
			autoParam :autoParam
		},
		view : {
			dblClickExpand : false,
			fontCss:getFontCss
		},
		data :data,
		callback : {
			// onRightClick : OnRightClick,
			//onClick : onClick(treeId)
		}
	});
}

function onClick(treeId) {
//alert(zTree.getSelectedNodes()[0])
	var isParent = "false";
	//checkSession();

	if(zTree.getSelectedNodes()[0].pbomid==""||zTree.getSelectedNodes()[0].pbomid==null){
		displaynone();
		isParent = "true";
	}else{
		displayblock();
	}

	if(zTree.getSelectedNodes()[0].bomid){
	    loadBomObject(zTree.getSelectedNodes()[0].bomid, isParent);
	}
	//com.leanway.formReadOnly("bomForm");
}
var loadBomObject = function(bomid,isParent) {
    flag=0;
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/bom?method=queryBomObject",
		data : {
			"bomid" : bomid,
			"isParent" : isParent
		},
		dataType : "text",
		async : false,
		success : function(data) {

			var flag1 =  com.leanway.checkLogind(data);
			if(flag1){
				var tempData = $.parseJSON(data);
				//setFormValue(tempData);
			}
		}
	});
}

var loadLineData = function (obj) {
	var routeid = "";
	if (obj == null) {
	    $("#lineid").html("");
		return;
	}
	if (obj.value ==undefined || typeof(obj.value) == "undefined" || obj.value == "undefined") {
		routeid = obj;
	} else {
		routeid =  obj.value;
	}
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/bom?method=queryProcessRouteLine",
		data : {
			"routeid" :routeid,
		},
		dataType : "json",
		async : false,
		success : function(data) {
			var strHtml = '';

			for (var i = 0; i < data.length; i++) {

				strHtml += '<option value="' + data[i].lineid + '">' + data[i].lineno+'</option>';
			}
			strhtml = strHtml;
			if(flag==0){
			    $("#lineid").html(strHtml);
			}
		}
	});
}

var loadProcessRoute = function (bomId) {

	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/bom?method=queryProcessRoute",
		data : {
			"bomid" : bomId,
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag = com.leanway.checkLogind(data);
			if(flag){
				var strHtml = '';

				if (data == null || data.length == 0) {
				    if(flag==0){
				    $("#lineid").html("");
				    }
				    strhtml="";
				}


				for (var i = 0; i < data.length; i++) {

					if ( i== 0 ) {

						loadLineData(data[i].routeid);
					}

					strHtml += '<option value="' + data[i].routeid + '">' + data[i].code+"("+data[i].routecodeid+")"+'</option>';
				}
				stHtml = strHtml;
				if(flag==0){
				    $("#routeid").html(strHtml);
				}

			}

		}
	});

}


/*function refresh() {
	var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
	var nodes = treeObj.getSelectedNodes();

	if (nodes.length > 0 && !nodes[0].isParent) {
		var node = nodes[0].getParentNode();
		treeObj.reAsyncChildNodes(node[0], "refresh");
	} else if (nodes.length > 0&&ope=="updateBom") {
		var node = nodes[0].getParentNode();
		if(node==null){
			treeObj.reAsyncChildNodes(nodes[0], "refresh");
		}else{
			treeObj.reAsyncChildNodes(node, "refresh");
		}
	} else if (nodes.length > 0) {
		treeObj.reAsyncChildNodes(nodes[0], "refresh");
	}else {
		treeObj.reAsyncChildNodes(null, "refresh");
	}
}*/

function getFontCss(treeId, treeNode) {
    return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
}

var value;
var key;
var nodes;
function changeColor(){
    treeId = "treeDemo";
    value=$("#searchValue").val();
    key="name";

    updateNodes(false);
    if(value != ""){
     var treeObj = $.fn.zTree.getZTreeObj("treeDemo");

       nodes  = treeObj.getNodesByParamFuzzy("productorname", value,null);
        if(nodes && nodes.length>0){
            updateNodes(true);
        }
    }
}
function updateNodes(highlight) {
	var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
	if(nodes==undefined||nodes=="undefined"){
		nodes = treeObj.getNodes();
	}
    for( var i=0; i<nodes.length;  i++) {
    	nodes[i].highlight = highlight;
        treeObj.updateNode(nodes[i]);
    }
}



var searchBom= function () {
	//checkSession();
	var searchVal = $("#searchValue").val();
	aTable.ajax.url("../../../../"+ln_project+"/bom?method=queryBomBySearch&searchValue=" + searchVal).load();

}
var getTree= function (type) {
	var bomid = com.leanway.getDataTableCheckIds("checkList");

	getBomTreeList("querySearchTree&bomid="+bomid+"&type="+type+"&reback="+status);

}

var routeTable;

/*function initEditTable(data){
   var html="";

   for(var i=0;i<data.length;i++){
       loadProcessRoute(data[i].pbomid);
       html+="<tr>"

       html+='<td><input class="form-control"  type="text" value='+data[i].productordesc+' readonly="readonly"></td>';
       html+='<td><select class="form-control" >'+stHtml+'</select></td>';
       html+='<td><select class="form-control" >'+strhtml+'</select></td>';
       html+='<td><input class="form-control"  type="hidden" value='+data[i].bomid+'></td>';
       html+='<td><input class="form-control"  type="hidden" value='+data[i].pbomid+'></td>';
       html+="</tr>"
   }

   $("#tableBody").html(html);
}*/
function updateBom(){

    var reg = /,$/gi;
    var bomList = "[";
    $("#tableBody").find('tr').each(
//    $("#grid-data tbody tr").each(
            function(index, temp) {
                var productordesc = $(this).find("td:nth-child(1)")
                .find("input").val();


                var routeid = $(this).find("td:nth-child(2)").find(
                "option:selected").val();
                var lineid = $(this).find("td:nth-child(3)").find(
                "option:selected").val();
                var bomid = $(this).find("td:nth-child(4)").find("input")
                .val();
                var pbomid = $(this).find("td:nth-child(5)").find("input")
                .val();

//                var productordesc = $(this).find("td:eq(1)")
//                .find("input").val();
//
//
//                var routeid = $(this).find("td:eq(2)").find(
//                "option:selected").val();
//                var lineid = $(this).find("td:eq(3)").find(
//                "option:selected").val();
//                var bomid = $(this).find("td:eq(0)").find("input")
//                .val();
//                var pbomid = $(this).find("td:eq(0)").find("input:checked")
//                .val();
                bomList += "{\"productordesc\" : \"" + productordesc+ "\"," +
                "\"routeid\" : \"" + routeid+ "\"," +
                "\"lineid\" : \"" + lineid+ "\"," +
                "\"bomid\":\"" + bomid + "\"," +
                "\"pbomid\":\""+ pbomid + "\"},";

            });
        bomList = bomList.replace(reg, "");
        bomList+="]"
        $.ajax({
            type : "POST",
            url : "../../../../"+ln_project+"/bom",
            data : {
                "method" : "updateBomList",
                "bomList" :bomList
            },
            dataType : "json",
            async : false,
            success : function(data) {

            	var flag =  com.leanway.checkLogind(data);

    			if(flag){
	                if(data.status="success"){
	                    $('#routeModal').modal("hide");
	                }
	                lwalert("tipModal", 1, data.info);
    			}
            }
        });
}

function initEditRoute(){

    $("#grid-data tbody tr").each(function() {
        var pbomid =  $(this).find("td:eq(0)").find("input").val();
        loadProcessRoute(pbomid);
        $(this).find("td:eq(2)").html('<select class="form-control">'+stHtml+'</select></td>');
        $(this).find("td:eq(3)").html('<select class="form-control">'+strhtml+'</select></td>');
    });

}
function initRouteTable(){
    var levels = zTree.getSelectedNodes()[0].levels;
    var table = $('#grid-data')
    .DataTable(
            {
                "ajax" : "../../../../"+ln_project+"/bom?method=queryBomToCheck&levels="+levels,
                'bPaginate' : true,
                "bDestory" : true,
                "bRetrieve" : true,
                "bFilter" : false,
                "bSort" : false,
                "bProcessing" : true,
                "bServerSide" : true,
                'searchDelay' : "5000",
                "aoColumns" : [
                               {
                                   "mDataProp" : "bomid",
                                   "fnCreatedCell" : function(nTd, sData,
                                           oData, iRow, iCol) {
                                       $(nTd).html("<div id='stopPropagation" + iRow +"'>"
                                               +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                               + "' name='checkList' value='" + sData
                                               + "'><label for='" + sData
                                               + "'></label>");
                                       $(nTd).append('<input class="form-control"  type="hidden" value='+oData.pbomid+'>');
                                       com.leanway.columnTdBindSelect(nTd);
                                   }
                               }, {
                                   "mDataProp" : "productordesc",
                               }, {
                                   "mDataProp" : "routeid"
                               }, {
                                   "mDataProp" : "lineid"
                               }  ],
                               "oLanguage" : {
                                   "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                               },
                               "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                               "fnDrawCallback" : function(data) {

                               },

            }).on('xhr.dt', function (e, settings, json) {
				com.leanway.checkLogind(json);
			} );

    return table;
}


var setCriticalType = function(data) {
    var html = "";
    for ( var i in data) {
        html += "<option value=" + data[i].codemapid + ">" + data[i].codevalue
                + "</option>";
    }

    $("#criticaltype").html(html);
}
function displaynone(){
	$("#count").css('display', 'none');
	$("#label").css('display', 'none');
}

function displayblock(){
	$("#count").css('display', 'block');
	$("#label").css('display', 'block');
}