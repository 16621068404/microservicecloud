var clicktime = new Date();
var oTable,cTable,zTree,storeTree,mapTable,viewEmployeeTable;
var reg=/,$/gi;
$ ( function () {
    $.fn.zTree.init($("#treeDemo"));
    zTree = $.fn.zTree.getZTreeObj("treeDemo");
    storeTree = initTree();
    oTable = initTable();
    cTable = initRelateTable();
    mapTable = initMapTable();
    $("input[name=type]").click(function(){
        searchCompanyMap();
    });
    $("input[name=storagetype]").click(function(){
        searchCompanyMap();
    });
    
    loadProtype();
    $("#productorTypeId").on("select2:select" , function( e ) {
    	searchProductors();
    });
})

// 加载所有的产品种类
var loadProtype = function ( ) {
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/productors",
		data :{
			"method" : "findAllProtype"
		},
		dataType : "json",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {

			    var json = data;

				var protype = json.productorTypes;
				var html="";

				for (var i = 0;i<protype.length;i++) {
					/**
					 * option 的拼接 + "|" + protype[i].productortypename+
					 * */
					html +="<option value="+ protype[i].productortypeid+">"+protype[i].productortypemask +"</option>";
				}

				$("#productorTypeId").html(html);


			    $("#productorTypeId").select2({
			    	placeholder : "产品类型(可多选)",
			        tags: false,
			        language : "zh-CN",
			        allowClear: true,
			        maximumSelectionLength: 10  //最多能够选择的个数
			    });

			}
		}
	});
}
var searchProductors = function(){
    var searchValue = $("#searchValue").val();
    var levels = "";
    var storagetype = $('input[name="storagetype"]:checked').val();
    var type =  $('input[name="type"]:checked').val();
    var nodes = zTree.getCheckedNodes(true);
    for (var i = 0;i < nodes.length; i++) {
        levels += nodes[i].levels +",";
    }
 // 产品类型
	var productorTypeId = $("#productorTypeId").val();

	if (productorTypeId != null && productorTypeId != "" && typeof(productorTypeId) != "undefined" && productorTypeId != undefined) {
		productorTypeId = productorTypeId.toString();
	}
    oTable.ajax.url("../../../../"+ln_project+"/mapProductor?method=queryUnralateProductors&levels="+levels+ "&type=" + type+ "&storagetype=" + storagetype+"&searchValue="+searchValue+"&productorTypeId="+productorTypeId).load();
}

var treeMethod="queryStoreTreeList";
var initTree = function() {
    queryCompanyMapTreeList(treeMethod);
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
}

function queryCompanyMapTreeList(treeMethod) {

    $.fn.zTree.init($("#treeDemo"), {
        check : {
            enable : true,
            chkStyle :"checkbox",
            chkboxType : { "Y": "a"},
        },
        async : {
            enable : true,
            url : "../../../"+ln_project+"/companyMap?method="+treeMethod+"&type=1",
            autoParam : [ "mapid","name"]
        },
        view : {
            dblClickExpand : false,
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
            onCheck : zTreeOnCheck

        }
    });
}
function onClick(e, treeId, treeNode) {

    if ( treeNode.checked ) {
        $.fn.zTree.getZTreeObj("treeDemo").checkNode(treeNode, false, false);
    } else {
        $.fn.zTree.getZTreeObj("treeDemo").checkNode(treeNode, true, true);
    }
    searchCompanyMap();
//    if(zTree.getSelectedNodes()[0].mapid){
//        com.leanway.clearTableMapData( "generalInfo" );
//        com.leanway.clearTableMapData( "contactInfo" );
//        oTable=initTable(" not in ",zTree.getSelectedNodes()[0].levels);
//        oTable.destroy();//清空数据表
//        oTable = initTable(" not in ",zTree.getSelectedNodes()[0].levels);
//        cTable=initRelateTable(" in ",zTree.getSelectedNodes()[0].levels);
//        cTable.destroy();//清空数据表
//        cTable = initRelateTable(" in ",zTree.getSelectedNodes()[0].levels);
//    }
}

var zTreeOnCheck = function (event, treeId, treeNode) {
    searchCompanyMap();
 };

//初始化数据表格
var initTable = function(levels) {
    var table = $('#generalInfo')
    .DataTable(
            {
                "ajax" : "../../../../"+ln_project+"/mapProductor?method=queryUnralateProductors&levels="+levels,
                //  "iDisplayLength" : "10",
                'bPaginate' : true,
                "bDestory" : true,
                "bRetrieve" : true,
                "bFilter" : false,
                "bSort" : false,
                "scrollY":"50vh",
                "bAutoWidth": true,  //宽度自适应
                "bProcessing" : true,
                "bServerSide" : true,
                'searchDelay' : "5000",
                "aoColumns" : [
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
                                               + "'></label> </div>");
                                       com.leanway.columnTdBindSelectNew(nTd,"generalInfo","checkList");
                                   }
                               },
                               {"mDataProp": "productorname"},
                               {"mDataProp": "productordesc" },
                               ],
                               "oLanguage" : {
                                   "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                               },
                               "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                               "fnDrawCallback" : function(data) {

                                   com.leanway.getDataTableFirstRowId("generalInfo",
                                           undefined, "more","checkList");
                                   //点击事件
                                   com.leanway.dataTableClickMoreSelect("generalInfo","checkList",false,oTable,undefined,undefined,undefined,"checkAll");

                                   com.leanway.dataTableCheckAllCheck('generalInfo', 'checkAll', 'checkList');
                               },

            }).on('xhr.dt', function (e, settings, json) {
                com.leanway.checkLogind(json);
            } );;

    return table;
}

//初始化数据表格
var initRelateTable = function(levels) {
    var table = $('#contactInfo')
    .DataTable(
            {
                "ajax" : "../../../../"+ln_project+"/mapProductor?method=queryRelateProductors&levels="+levels,
                //  "iDisplayLength" : "10",
                'bPaginate' : true,
                "bDestory" : true,
                "bRetrieve" : true,
                "bFilter" : false,
                "bSort" : false,
                "scrollY":"57vh",
                "bAutoWidth": true,  //宽度自适应
                "bProcessing" : true,
                "bServerSide" : true,
                'searchDelay' : "5000",
                "aoColumns" : [
                               {
                                   "mDataProp": "mapproductorid",
                                   "fnCreatedCell" : function(nTd, sData,
                                           oData, iRow, iCol) {
                                       $(nTd)
                                       .html("<div id='stopPropagation" + iRow +"'>"
                                               +"<input class='regular-checkbox' type='checkbox' id='"
                                               + sData
                                               + "' name='checkListTwo' value='"
                                               + sData
                                               + "'><label for='"
                                               + sData
                                               + "'></label> </div>");
                                       com.leanway.columnTdBindSelectNew(nTd,"contactInfo","checkListTwo");
                                   }
                               },
                               {"mDataProp": "name" },
                               {"mDataProp": "productorname"},
                               {"mDataProp": "productordesc" },
                               {"mDataProp": "version" },

                               ],
                               "oLanguage" : {
                                   "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                               },
                               "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                               "fnDrawCallback" : function(data) {

                                   com.leanway.getDataTableFirstRowId("contactInfo",
                                           undefined, "more","checkListTwo");
                                   //点击事件
                                   com.leanway.dataTableClickMoreSelect("contactInfo","checkListTwo",false,cTable,undefined,undefined,undefined,"checkAllTwo");

                                   com.leanway.dataTableCheckAllCheck('contactInfo', 'checkAllTwo', 'checkListTwo');
                               },

            }).on('xhr.dt', function (e, settings, json) {
                com.leanway.checkLogind(json);
            } );;

    return table;
}

var initMapTable = function() {
    var table = $('#mapInfo')
    .DataTable(
            {
                "ajax" : "../../../../"+ln_project+"/mapProductor?method=queryCompanyMap",
                //  "iDisplayLength" : "10",
                'bPaginate' : true,
                "bDestory" : true,
                "bRetrieve" : true,
                "bFilter" : false,
                "bSort" : false,
                "scrollY":"50vh",
                "bAutoWidth": true,  //宽度自适应
                "bProcessing" : true,
                "bServerSide" : true,
                'searchDelay' : "5000",
                "aoColumns" : [
                               {
                                   "mDataProp": "mapid",
                                   "fnCreatedCell" : function(nTd, sData,
                                           oData, iRow, iCol) {
                                       $(nTd)
                                       .html("<div id='stopPropagation" + iRow +"'>"
                                               +"<input class='regular-checkbox' type='checkbox' id='"
                                               + sData
                                               + "' name='mapCheckList' value='"
                                               + sData
                                               + "'><label for='"
                                               + sData
                                               + "'></label> </div>");
                                       com.leanway.columnTdBindSelectNew(nTd,"mapInfo","mapCheckList");
                                   }
                               },
                               {"mDataProp": "name"},
                               {"mDataProp": "type" },
                               {"mDataProp": "storagetype" },
                               {"mDataProp": "code" },
                               ],
                               "oLanguage" : {
                                   "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                               },
                               "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                               "fnDrawCallback" : function(data) {

                                   com.leanway.getDataTableFirstRowId("mapInfo",
                                           undefined, "more","mapCheckList");
                                   //点击事件
                                   com.leanway.dataTableClickMoreSelect("mapInfo","mapCheckList",false,oTable,undefined,undefined,undefined,"mapCheckAll");

                                   com.leanway.dataTableCheckAllCheck('mapInfo', 'mapCheckAll', 'mapCheckList');
                               },

            }).on('xhr.dt', function (e, settings, json) {
                com.leanway.checkLogind(json);
            } );;

    return table;
}

var relateProductors = function(){
    var mapids = com.leanway.getCheckBoxData(2, "mapInfo", "mapCheckList");
    if(mapids.length>0){
        var ids = com.leanway.getCheckBoxData(2, "generalInfo", "checkList");
        if (ids.length == 0) {

            lwalert("tipModal", 1, "请选择产品再进行关联!");
            return;

        }
        $.ajax({
            type : "get",
            url : "../../../../"+ln_project+"/mapProductor",
            data : {
                method : "addMapProductor",
                "mapids" : mapids,
                "ids":ids
            },
            dataType : "json",
            success : function(data) {
                var flag =  com.leanway.checkLogind(data);

                if(flag){
                    if(data.status="success"){
                        com.leanway.clearTableMapData( "generalInfo" );
                        oTable.ajax.reload();
                        cTable.ajax.reload();
                    }
                    lwalert("tipModal", 1, data.info);

                }

            },
            error : function(data) {
                lwalert("tipModal", 1, "关联失败!");
            }
        });
    }else{
        lwalert("tipModal", 1, "请在左侧仓库信息列表选择需所关联的仓库!");
    }
}

var searchCompanyMap = function (){
    com.leanway.clearTableMapData("mapInfo");
    com.leanway.clearTableMapData("generalInfo");
    var levels = "";
    var type =  $('input[name="type"]:checked').val();
    var storagetype = $('input[name="storagetype"]:checked').val();
    var searchMapValue = $("#searchMapValue").val();
    var searchValue = $("#searchValue").val();
    var searchRelateValue = $("#searchRelateValue").val();
    var nodes = zTree.getCheckedNodes(true);
    for (var i = 0;i < nodes.length; i++) {
        levels += nodes[i].levels +",";
    }
    
    console.info(levels);
    mapTable.ajax.url("../../../../"+ln_project+"/mapProductor?method=queryCompanyMap&&levels=" + levels + "&type=" + type+ "&storagetype=" + storagetype+"&searchValue="+searchMapValue).load();
    oTable.ajax.url("../../../../"+ln_project+"/mapProductor?method=queryUnralateProductors&levels="+levels+ "&type=" + type+ "&storagetype=" + storagetype+"&searchValue="+searchValue).load();
    cTable.ajax.url("../../../../"+ln_project+"/mapProductor?method=queryRelateProductors&levels="+levels+ "&type=" + type+ "&storagetype=" + storagetype+"&searchValue="+searchRelateValue).load();

}

function relateAllProductors(relatetype){
    var levels = "";
    var type =  $('input[name="type"]:checked').val();
    var storagetype = $('input[name="storagetype"]:checked').val();
    var nodes = zTree.getCheckedNodes(true);
    for (var i = 0;i < nodes.length; i++) {
        levels += nodes[i].levels +",";
    }

    var mapids = com.leanway.getCheckBoxData(2, "mapInfo", "mapCheckList");
    if(mapids.length==0){
        lwalert("tipModal", 1, "请在左侧仓库信息列表选择需所关联的仓库!");
        return ;
     }
    
    // 产品类型
	var productorTypeId = $("#productorTypeId").val();

	if (productorTypeId != null && productorTypeId != "" && typeof(productorTypeId) != "undefined" && productorTypeId != undefined) {
		productorTypeId = productorTypeId.toString();
	}
    $.ajax({
        type : "get",
        url : "../../../../"+ln_project+"/mapProductor",
        data : {
            method : "addAllMapProductor",
            "mapids" : mapids,
            "levels":levels,
            "type":type,
            "storagetype":storagetype,
            "relatetype":relatetype,
            "productorTypeId":productorTypeId
        },
        dataType : "json",
        success : function(data) {
            var flag =  com.leanway.checkLogind(data);

            if(flag){
                if(data.status="success"){
                    com.leanway.clearTableMapData( "generalInfo" );
                    oTable.ajax.reload();
                    cTable.ajax.reload();
                }
                lwalert("tipModal", 1, data.info);

            }

        },

    });


}
var searchProductors = function(){
    var searchValue = $("#searchValue").val();
    var levels = "";
    var storagetype = $('input[name="storagetype"]:checked').val();
    var type =  $('input[name="type"]:checked').val();
    var nodes = zTree.getCheckedNodes(true);
    for (var i = 0;i < nodes.length; i++) {
        levels += nodes[i].levels +",";
    }
    oTable.ajax.url("../../../../"+ln_project+"/mapProductor?method=queryUnralateProductors&levels="+levels+ "&type=" + type+ "&storagetype=" + storagetype+"&searchValue="+searchValue).load();
}

var searchRelateProductors = function(){
    var searchValue = $("#searchRelateValue").val();
    var levels = "";
    var storagetype = $('input[name="storagetype"]:checked').val();
    var type =  $('input[name="type"]:checked').val();
    var nodes = zTree.getCheckedNodes(true);
    for (var i = 0;i < nodes.length; i++) {
        levels += nodes[i].levels +",";
    }
    cTable.ajax.url("../../../../"+ln_project+"/mapProductor?method=queryRelateProductors&levels="+levels+ "&type=" + type+ "&storagetype=" + storagetype+"&searchValue="+searchValue).load();
}

var searchMapValue=function(){
    var levels = "";
    var type =  $('input[name="type"]:checked').val();
    var storagetype = $('input[name="storagetype"]:checked').val();
    var searchMapValue = $("#searchMapValue").val();
    var nodes = zTree.getCheckedNodes(true);
    for (var i = 0;i < nodes.length; i++) {
        levels += nodes[i].levels +",";
    }

    mapTable.ajax.url("../../../../"+ln_project+"/mapProductor?method=queryCompanyMap&&levels=" + levels + "&type=" + type+ "&storagetype=" + storagetype+"&searchValue="+searchMapValue).load();
}
var initViewEmployeeTable = function (id) {

    //com.leanway.checkSession();
    var table = $('#viewEmployeeTables').DataTable( {
        "ajax": '../../../../'+ln_project+'/mapProductor?method=queryEmployees&maproductorid='+id,
        'bPaginate': false,
        "bDestory": true,
        "bRetrieve": true,
        "bFilter":false,
        "bSort": false,
        "bProcessing": true,
        "bServerSide": false,
        "aoColumns": [
                      {"mDataProp": "name"},
                      {"mDataProp": "moble"},
                      ],
                      "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
                          //add selected class
                      },
                      "oLanguage" : {
                          "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                      }

    } ).on('xhr.dt', function (e, settings, json) {
        com.leanway.checkLogind(json);
    } );

    return table;
}
/**
 * 查看雇员
 */
var viewEmployee = function ( maproductorid ) {
    // 弹出modal
    $('#veiwEmployeeModal').modal({backdrop: 'static', keyboard: true});

    if (viewEmployeeTable == null || viewEmployeeTable == "undefined" || typeof(viewEmployeeTable) == "undefined") {
        viewEmployeeTable = initViewEmployeeTable(maproductorid);

    } else {
        viewEmployeeTable.ajax.url("../../../../"+ln_project+"/mapProductor?method=queryEmployees&maproductorid=" + maproductorid).load();
    }


}


function deleteMapProductor(){
    var ids = com.leanway.getCheckBoxData(2, "contactInfo", "checkListTwo");
    if(ids.length==0){
        lwalert("tipModal", 1, "请选择一个产品进行解除关联！");
        return;
    }
    var msg = "确定解除仓库与产品的关联关系吗，此操作将把该仓库所有下级与该产品的关联关系一起进行解除?";

    lwalert("tipModal", 2, msg ,"isSureDelete()");
}

function isSureDelete(){
    var ids = com.leanway.getCheckBoxData(2, "contactInfo", "checkListTwo");
    $.ajax ( {
        type : "post",
        url : "../../../../"+ln_project+"/mapProductor",
        data : {
            "method" : "deleteMapProductor",
            "ids" : ids
        },
        dataType : "json",
        async : false,
        success : function ( text ) {

            var flag =  com.leanway.checkLogind(text);

            if(flag){
                if(text.status="success"){
                    oTable.ajax.reload();
                    cTable.ajax.reload();
                }
                lwalert("tipModal", 1, text.info);

            }

        }
    });
}
