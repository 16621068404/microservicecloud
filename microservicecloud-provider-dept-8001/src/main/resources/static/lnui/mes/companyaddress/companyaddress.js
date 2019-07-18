var ope = "addCompanyMap";
var clicktime = new Date();
$(function() {

    initBootstrapValidator();
    $("#saveOrUpdate").prop("disabled",true);

})

function initBootstrapValidator() {
    $('#companyMapForm').bootstrapValidator(
            {
                excluded : [ ':disabled' ],
                fields : {
                    name : {
                        validators : {
                            notEmpty : {},
                        }
                    },
                    mapcode : {
                        validators : {
                            notEmpty : {},
                        }
                    },
                }
            });
}
var levels = ""
var pmapid = "";
var levelsvalue = "";
var html="";
// 初始化树
var setting = {

    view : {
        dblClickExpand : false

    },

    callback : {
    // onRightClick : OnRightClick
    }
};


var addCount = 1;
// 添加节点
function addTreeNode() {
    html="";

    $("#saveOrUpdate").prop("disabled",false);

    ope = "addCompanyMap";

    if (zTree.getSelectedNodes()[0]) {


        levels = zTree.getSelectedNodes()[0].levels;
        pmapid = zTree.getSelectedNodes()[0].mapid;
        levelsvalue = zTree.getSelectedNodes()[0].levelsvalue;
        queryTypevalue(2);
        var newNode = {
    	        name : ""
    	    };

        newNode.checked = zTree.getSelectedNodes()[0].checked;
//        if(levels.split("_").length<=4){
//            com.leanway.removeReadOnly("companyMapForm");
//            newNode.checked = zTree.getSelectedNodes()[0].checked;
//        }else{
//            lwalert("tipModal", 1, "您已添加到最底层，不能再进行添加");
//        }
    } else {
        lwalert("tipModal", 1, "请选择中一个节点进行添加");
    }

//    switch (levels.split("_").length) {
//
//    case 1:
//        html += "<option value='workcentergroup'>车间</option>";
//        html += "<option value='store'>仓库</option>";
//        html += "<option value='officebuilding'>办公楼</option>";
//        break;
//    case 2:
//        html += "<option value='productionline'>生产线</option>";
//        html += "<option value='reservoir'>库区 </option>";
//        html += "<option value='floor'>楼层</option>";
//        break;
//    case 3:
//        html += "<option value='groupno'>设备群组号</option>";
//        html += "<option value='shelves'>货架</option>";
//        html += "<option value='housenumber'>门牌号</option>";
//        break;
//    case 4:
//        html += "<option value='equipment'>设备点</option>";
//        html += "<option value='serialnumber'>编号</option>";
//        html += "<option value='seatnumber'>座位号</option>";
//        break;
//
//    default:
//        html += "<option value='area'>厂区</option>";
//        break;
//    }
//    $("#type").html(html);
}
// 修改节点
function modifyTreeNode() {
    //checkSession();
    $("#saveOrUpdate").prop("disabled",false);

    var nodes = zTree.getSelectedNodes();
    if (nodes.length == 0) {
        lwalert("tipModal", 1, "请选择需要修改的节点");
    }else if (nodes[0].mapid=="undefined"||nodes[0].mapid==undefined) {
        lwalert("tipModal", 1, "该组件还未保存信息，不能修改");
    }  else {
        com.leanway.removeReadOnly("companyMapForm");
        $("#name").prop("readonly", true);
        $("#mapcode").prop("readonly", true);
        $("#type").prop("disabled", true);
        ope = "updateCompanyMap";
    }
}


function isSure(nodes) {
    var nodes = zTree.getSelectedNodes();
    zTree.removeNode(nodes[0]);
    deleteAjax(nodes[0].levels);
}
// 删除节点
function removeTreeNode() {
   // checkSession();
    // hideRMenu();
    var nodes = zTree.getSelectedNodes();
    if (nodes && nodes.length > 0) {
        if (nodes[0].children && nodes[0].children.length > 0) {
//          var msg = "删除母件则母件底下的组件一起删掉！";
            lwalert("tipModal", 2, "删除母件则母件底下的组件一起删掉！","isSure()");

        } else {
            lwalert("tipModal", 2, "你确定要删除吗！","isSure()");
        }
    } else {
        // alert("请选择要删除的组件");
        lwalert("tipModal", 1, "请选择要删除的组件")
    }
}
// 删除Ajax
var deleteAjax = function(levels) {
    $.ajax({
        type : "post",
        url : "../../../"+ln_project+"/companyMap?method=deleteCompanyMap",
        data : {
            "conditions" : levels
        },
        dataType : "text",
        async : false,
        success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

	            var tempData = $.parseJSON(text);
	            if (tempData.code == "1") {
	                resetForm();
	            } else {
	                // alert("操作失败");
	                lwalert("tipModal", 1, "操作失败")
	            }

			}
        }
    });
}

var zTree, treeMenu;
$(document).ready(function() {
    $.fn.zTree.init($("#treeDemo"));
    zTree = $.fn.zTree.getZTreeObj("treeDemo");
    // treeMenu = $("#treeMenu");
});

var oTable;

$(function() {
    // 初始化对象
    com.leanway.loadTags();
    oTable = initTree();
    com.leanway.formReadOnly("companyMapForm");
    com.leanway.initSelect2("#searchValue",
            "../../../"+ln_project+"/companyMap?method=queryCompanyMapBySearchValue", "搜索企业布局");
})
$("#searchValue").on("select2:select", function(e) {
    var levels = $("#searchValue").val();
    queryCompanyMapTreeList("queryMapTreeBySearchValue&levels="+levels);
});

var treeMethod="queryCompanyMapTreeList";
var initTree = function() {
    queryCompanyMapTreeList(treeMethod);
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
}

function queryCompanyMapTreeList(treeMethod) {

    $.fn.zTree.init($("#treeDemo"), {
        async : {
            enable : true,
            url : "../../../"+ln_project+"/companyMap?method="+treeMethod,
            autoParam : [ "mapid"]
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

            // onRightClick : OnRightClick,
            onClick : onClick
        }
    });
}

function onClick() {

    $("#saveOrUpdate").prop("disabled",true);
    if(zTree.getSelectedNodes()[0].mapid){
        loadCompanyMapObject(zTree.getSelectedNodes()[0].mapid);
    }
    com.leanway.formReadOnly("companyMapForm");
}
var loadCompanyMapObject = function(mapid) {
    $.ajax({
        type : "post",
        url : "../../../"+ln_project+"/companyMap?method=queryCompanyMapObject",
        data : {
            "mapid" : mapid,
        },
        dataType : "text",
        async : false,
        success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

	            var tempData = $.parseJSON(data);
	            setFormValue(tempData.CompanyMap);

			}
        }
    });
}


/**
 * 填充到HTML表单
 */
function setFormValue(data) {
    html="";
    resetForm();
    for ( var item in data) {
        $("#" + item).val(data[item]);
        if(item=="type"){
        	 html += "<option value='"+data[item]+"'>"+data.typename+"</option>";
        	$("#type").html(html);
//       if(data[item]=="area"){
//           html += "<option value='area'>厂区</option>";
//       }else if(data[item]=="workcentergroup"){
//           html += "<option value='workcentergroup'>车间</option>";
//       }else if(data[item]=="store"){
//           html += "<option value='store'>仓库</option>";
//       }else if(data[item]=="officebuilding"){
//           html += "<option value='officebuilding'>办公楼</option>";
//       }else if(data[item]=="productionline"){
//           html += "<option value='productionline'>生产线</option>";
//       }else if(data[item]=="reservoir"){
//           html += "<option value='reservoir'>库区 </option>";
//       }else if(data[item]=="floor"){
//           html += "<option value='floor'>楼层</option>";
//       }else if(data[item]=="groupno"){
//           html += "<option value='groupno'>设备群组号</option>";
//       }else if(data[item]=="shelves"){
//           html += "<option value='shelves'>货架</option>";
//       }else if(data[item]=="housenumber"){
//           html += "<option value='housenumber'>门牌号</option>";
//       }else if(data[item]=="equipment"){
//           html += "<option value='equipment'>设备点</option>";
//       }else if(data[item]=="serialnumber"){
//           html += "<option value='serialnumber'>编号</option>";
//       }else if(data[item]=="seatnumber"){
//           html += "<option value='seatnumber'>座位号</option>";
//       }else{
//           html += "<option value=''></option>";
//       }
//        $("#type").html(html);
    }
    }
}

var addCompanyMap = function() {
    html="";
    // 新增父节点取消节点被选中状态
    zTree.cancelSelectedNode();
    com.leanway.removeReadOnly("companyMapForm");
    resetForm();
    pmapid = "";
    levels = "";
    queryTypevalue(1);
//    html += "<option value='area'>厂区</option>";
//    $("#type").html(html);
    $("#saveOrUpdate").prop("disabled",false);
}
function refresh() {
    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
    var nodes = treeObj.getSelectedNodes();

    if (nodes.length > 0 && !nodes[0].isParent) {
        var node = nodes[0].getParentNode();
        treeObj.reAsyncChildNodes(node[0], "refresh");
    } else if (nodes.length > 0&&ope=="updateConpanyMap") {
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
}

var saveCompanyMap = function() {

    $("#type").prop("disabled", false);
    var form = $("#companyMapForm").serializeArray();
    $("#companyMapForm").data('bootstrapValidator').validate(); // 提交前先验证
    if ($('#companyMapForm').data('bootstrapValidator').isValid()) { // 返回true、false
        var formData = formatFormJson(form);
        $.ajax({
            type : "POST",
            url : "../../../"+ln_project+"/companyMap",
            data : {
                "method" : ope,
                "formData" : formData,
                "pmapid" : pmapid,
                "levels" : levels,
                "levelsvalue" : levelsvalue
            },
            dataType : "text",
            async : false,
            success : function(data) {

    			var flag =  com.leanway.checkLogind(data);

    			if(flag){

	                var tempData = $.parseJSON(data);
	                if (tempData.status == "success") {
	                    com.leanway.formReadOnly("companyMapForm");
	                    refresh();
	                    $("#saveOrUpdate").prop("disabled",true);
	                    html="";
	                    lwalert("tipModal", 1, tempData.info);
	                } else {
	                    // alert("该组件与母件相同，不能保存");
	                    lwalert("tipModal", 1, tempData.info);
	                }

    			}
            }
        });
    }
}


/**
 * 重置表单
 *
 */
var resetForm = function() {
    $('#companyMapForm').each(function(index) {
        $('#companyMapForm')[index].reset();
    });
    mapid1 = "";
    $("#mapid").val("");
	$("#companyMapForm").data('bootstrapValidator').resetForm();



}
// 格式化form数据
var formatFormJson = function(formData) {
    var reg = /,$/gi;
    var data = "{";
    for (var i = 0; i < formData.length; i++) {
        data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
    }
    data = data.replace(reg, "");
    data += "}";
    return data;
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

function queryTypevalue(addtype){

	var codemaplevels="";
	 if(addtype==2){
		 codemaplevels = $("#codemaplevels").val();
	 }
        $.ajax({
            type : "POST",
            url : "../../../"+ln_project+"/codeMap",
            data : {
                "method" : "queryCompanyMapType",
                "codemaplevels" : codemaplevels,
            },
            dataType : "text",
            async : false,
            success : function(data) {

    			var flag =  com.leanway.checkLogind(data);

    			if(flag){

	                var tempData = $.parseJSON(data);
	                if (tempData.length>0) {

	                	resetForm();
	                	com.leanway.removeReadOnly("companyMapForm");


	                	var html = "";
	                	for (var i = 0; i < tempData.length; i++) {
	                		 html += "<option value='"+tempData[i].codemapid+"'>"+tempData[i].codevalue+"</option>";
	                	}

	                    $("#type").html(html);

	                }else{
	                	lwalert("tipModal", 1, "您已添加到最底层，不能再进行添加");
	                }

    			}
            }
        });
}
