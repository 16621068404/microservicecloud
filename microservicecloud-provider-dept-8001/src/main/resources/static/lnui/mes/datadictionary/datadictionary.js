var ope = "addDataDictionary";
var flag=0;
$(function() {
    $("#saveOrUpdate").prop("disabled",true);
	initBootstrapValidator();

	$.fn.zTree.init($("#treeDemo"));
	zTree = $.fn.zTree.getZTreeObj("treeDemo");
	// 初始化对象
	com.leanway.loadTags();
	// 加载datagrid
	oTable = initTree();
	com.leanway.formReadOnly("dictionaryForm");
	displaynone();
	com.leanway.initSelect2("#compid", "../../../../"+ln_project+"/company?method=queryCompanyBySearch", "搜索公司");
	initForm();
	//	com.leanway.initSelect2("#searchValue",
//            "../../../"+ln_project+"/codeMap?method=queryCodeMapBySearchValue", "搜索数据字典");
})

//	$("#searchValue").on("select2:select", function(e) {
//	    var levels = $("#searchValue").val();
//	    getDataTreeList("queryMapTreeBySearchValue&levels="+levels);
//	});



//填写数据验证
function initBootstrapValidator() {
	
	$('#dictionaryForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {

					levelsvalue : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 1,
								max : 20
							}
						}
					},					
				}
});

}

//填写数据验证
function initBootstrapValidator2() {

	$('#dictionaryForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {

					tablename : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 1,
								max : 20
							}
						}
					},
					columnname : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 1,
								max : 20
							}
						}
					},
					codenum : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 1,
								max : 30
							}
						}
					},
					codevalue : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 1,
								max : 20
							}
						}
					},
					prefix : {
						validators : {
							notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.amount,
									com.leanway.reg.msg.amount)
						}
					},
				}
});

}


var levels = ""
var codemapid1 = "";
// 初始化树
var setting = {

	view : {
		dblClickExpand : false
	},

	callback : {
	// onRightClick : OnRightClick
	}
};
// 添加节点
function addTreeNode() {
	
    $("#saveOrUpdate").prop("disabled",false);
	resetForm();
	ope = "addDataDictionary";
	var newNode = {
		name : ""
	};

	if (zTree.getSelectedNodes()[0]) {
		resetForm();
		levels = zTree.getSelectedNodes()[0].levels;
		codemapid1 = zTree.getSelectedNodes()[0].codemapid;
		com.leanway.removeReadOnly("dictionaryForm");
		newNode.checked = zTree.getSelectedNodes()[0].checked;
		flag=0;
		
		displayblock();
		$("#levelsvalue").css('display', 'none');
		$("#levelsvalue1").css('display', 'none');
		
		$("#dictionaryForm").data('bootstrapValidator').destroy();
		initBootstrapValidator2();
	
	} else {

		lwalert("tipModal", 1, "请选择相应的上级")
	}

}
// 修改节点
function modifyTreeNode() {

    $("#saveOrUpdate").prop("disabled",false);
   
	var nodes = zTree.getSelectedNodes();
	if (nodes.length == 0) {
		
		lwalert("tipModal", 1, "请选择需要修改的数据");
	}else if (nodes[0].codemapid=="undefined"||nodes[0].codemapid==undefined) {
		
		lwalert("tipModal", 1, "该条数据还未保存信息，不能修改");
	}  else {
		
		$("#codemapid").val(nodes[0].codemapid);
		$.ajax({
			type : "post",
			url : "../../../"+ln_project+"/codeMap?method=queryDataDictionaryObject",
			data : {
				"codemapid" : nodes[0].codemapid,
			},
			dataType : "text",
			async : false,
			success : function(data) {

				var flag =  com.leanway.checkLogind(data);
				if(flag){

					var tempData = $.parseJSON(data);
					setFormValue(tempData);
				}
			}
		});
		if (nodes[0].getParentNode() != null) {
			codemapid1 = nodes[0].getParentNode().codemapid;
		}

		com.leanway.removeReadOnly("dictionaryForm");
		$("#tablename").prop("readonly",true);
		$("#columnname").prop("readonly",true);
		$("#codenum").prop("readonly",true);
		ope = "updateDataDictionary";
	}
}

function isSure(nodes) {
	var nodes = zTree.getSelectedNodes();
	deleteAjax(nodes[0].levels);
	zTree.removeNode(nodes[0]);

}

function removeTreeNode() {

	var nodes = zTree.getSelectedNodes();
	if (nodes && nodes.length > 0) {
		if (nodes[0].children && nodes[0].children.length > 0) {

			lwalert("tipModal", 2, "删除该条数据将同其下的数据一起删掉！","isSure()");

		} else {
			lwalert("tipModal", 2, "你确定要删除吗！","isSure()");
		}
	} else {
		
		lwalert("tipModal", 1, "请选择要删除的数据")
	}
}
// 删除Ajax
var deleteAjax = function(levels) {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/codeMap?method=deleteDataDictionary",
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
					lwalert("tipModal", 1, "删除成功！")
				} else {
					
					lwalert("tipModal", 1, "操作失败")
				}

			}
		}
	});
}

var zTree;
var oTable;
var treeMethod="queryDataTreeList";
var initTree = function() {
	getDataTreeList(treeMethod);
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
}

function getDataTreeList(treeMethod) {
	$.fn.zTree.init($("#treeDemo"), {
		async : {
			enable : true,
			url : "../../../"+ln_project+"/codeMap?method="+treeMethod,
			autoParam : [ "levels"]
		},
		view : {
			dblClickExpand : false,
			fontCss:getFontCss
		},
		data : {
			key : {
				id : "codemapid",
				name : "levelsvalue"
			},
			simpleData : {
				enable : true,
				idKey : "codemapid",
				pIdKey : "pid",
				rootPId : ""
			}
		},
		callback : {
			onClick : onClick
		}
	});
}

//树形节点一步加载完成
function onAsyncSuccess (event, treeId, treeNode, msg) {


    try {

        var zTree = $.fn.zTree.getZTreeObj("treeDemo");

        asyncNodes(zTree.getNodes());
        if ( typeof( treeNode ) == "undefined" ) {

            var zTree = $.fn.zTree.getZTreeObj(treeId);
            var rootNode = zTree.getNodes();

            if (rootNode != null && rootNode.length > 0) {
                for (var i = 0;i<rootNode.length; i ++) {
                    zTree.selectNode(rootNode[i]);
                    zTree.expandNode(rootNode[i], true);
                }
            }
        }
    } catch (e) {
    }
}

function asyncNodes(nodes) {
    if (!nodes) return;

    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    for (var i=0, l=nodes.length; i<l; i++) {

        if (nodes[i].isParent && nodes[i].zAsync) {
            zTree.selectNode(nodes[i]);
            zTree.expandNode(nodes[i], true);
            asyncNodes(nodes[i].children);
        } else {
            zTree.reAsyncChildNodes(nodes[i], "refresh", true);
        }
    }
}


function onClick() {

	var isParent = "false";
	if(zTree.getSelectedNodes()[0].parentid==""||zTree.getSelectedNodes()[0].parentid==null){
		
		isParent = "true";
	}
	if(zTree.getSelectedNodes()[0].codemapid){
	    loadDataObject(zTree.getSelectedNodes()[0].codemapid, isParent);
	}
}
var loadDataObject = function(codemapid,isParent) {
    flag=0;
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/codeMap?method=queryDataDictionaryObject",
		data : {
			"codemapid" : codemapid,
			"isParent" : isParent
		},
		dataType : "text",
		async : false,
		success : function(data) {

			var flag1 =  com.leanway.checkLogind(data);
			if(flag1){
				
				resetForm();
				
				displayblock();
				$("#levelsvalue").css('display', 'block');
				$("#levelsvalue1").css('display', 'block');
				com.leanway.formReadOnly("dictionaryForm");
//				var tempData = $.parseJSON(data);

				if($.parseJSON(data).tablename=""||$.parseJSON(data).tablename==null||$.parseJSON(data).tablename==false){
					$("#dictionaryForm").data('bootstrapValidator').destroy();
					initBootstrapValidator();
					displaynone();
					$("#levelsvalue").css('display', 'block');
					$("#levelsvalue1").css('display', 'block');
				}else{
					$("#dictionaryForm").data('bootstrapValidator').destroy();
					initBootstrapValidator2();
					displayblock();
					$("#levelsvalue").css('display', 'none');
					$("#levelsvalue1").css('display', 'none');
				}
				setFormValue($.parseJSON(data));
			}
		}
	});
}

/**
 * 填充到HTML表单
 */
function setFormValue(data) {
	resetForm();

	for ( var item in data) {

		$("#" + item).val(data[item]);

	}
	var compId = data.compid;
	if (compId != "" && compId != null && compId != "null") {
		$("#compid").append(
				'<option value=' + compId + '>' + data.compname + '</option>');
		$("#compid").select2("val", [ compId ]);
	}

}

var addDataDictionary = function() {
	
//    resetForm();
    $("#saveOrUpdate").prop("disabled",false);
    ope = "addDataDictionary";
	// 新增父节点取消节点被选中状态
	//zTree.cancelSelectedNode();
	//	codemapid1 = "";
	//	levels = "";
    displaynone();
    $("#levelsvalue").css('display', 'block');
    $("#levelsvalue1").css('display', 'block');
	com.leanway.removeReadOnly("dictionaryForm");
	var newNode = {
			name : ""
		};

	if (zTree.getSelectedNodes()[0]) {
		resetForm();
		levels = zTree.getSelectedNodes()[0].levels;
		codemapid1 = zTree.getSelectedNodes()[0].codemapid;
		com.leanway.removeReadOnly("dictionaryForm");
		newNode.checked = zTree.getSelectedNodes()[0].checked;
		flag=0;
	} 

	$("#dictionaryForm").data('bootstrapValidator').destroy();
	initBootstrapValidator();
}
function refresh() {
	
	var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
	var nodes = treeObj.getSelectedNodes();
	if (nodes.length > 0 && !nodes[0].isParent) {
		var node = nodes[0].getParentNode();
		treeObj.reAsyncChildNodes(node[0], "refresh");
	} else if (nodes.length > 0&&ope=="updateDataDictionary") {
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
var saveDataDictionary = function() {

	var form = $("#dictionaryForm").serializeArray();
	$("#dictionaryForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#dictionaryForm').data('bootstrapValidator').isValid()) { // 返回true、false		
		var formData = formatFormJson(form);
		$.ajax({
			type : "POST",
			url : "../../../"+ln_project+"/codeMap",
			data : {
				"method" : ope,
				"formData" : formData,
				"codemapid1" : codemapid1,
				"levels" : levels
			},
			dataType : "text",
			async : false,
			success : function(data) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					var tempData = $.parseJSON(data);
					if (tempData.status == "success") {
					    com.leanway.formReadOnly("dictionaryForm");
						refresh();
						lwalert("tipModal", 1, tempData.info);
					} else {
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
	$('#dictionaryForm').each(function(index) {
		$('#dictionaryForm')[index].reset();
	});
	codemapid1 = "";
	$("#codemapid1").val("");
	$("#compid").val(null).trigger("change");


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

       nodes  = treeObj.getNodesByParamFuzzy("tablename", value,null);
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

function displaynone(){
	
	$("#tablename1").css('display', 'none');	
	$("#codenum1").css('display', 'none');	
	$("#prefix1").css('display', 'none');	
	if(compid==""&&compid==null){	
		$("#fieldtype1").css('display', 'none');		
	}
}
function displayblock(){
	
	$("#tablename1").css('display', 'block');
	$("#codenum1").css('display', 'block');	
	$("#prefix1").css('display', 'block');
	var compid = window.parent.compId;
	//若企业为空显示
	if(compid==""&&compid==null){	
		$("#fieldtype1").css('display', 'block');	
	}
}

function initForm(){
	var compid = window.parent.compId;
	if(compid!=""&&compid!=null){
		$("#fieldtype1").css('display', 'none');
	}
}
