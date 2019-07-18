var ope = "addBom";
var clicktime = new Date();
var flag=0;
var processRouteLineTable;
$(function() {
    $("#saveOrUpdate").prop("disabled",true);
	initBootstrapValidator();

	initTimePickYmd("isvalidendtime");
	initTimePickYmd("isvalidstarttime");

	$.fn.zTree.init($("#treeDemo"));
	zTree = $.fn.zTree.getZTreeObj("treeDemo");

	// 初始化对象
	com.leanway.loadTags();
	// 加载datagrid
	oTable = initTree();
	com.leanway.formReadOnly("bomForm");
	initSelect2("#productorid",
			"../../../"+ln_project+"/productors?method=queryProductorNotExsitInBom", "搜索产品");
	com.leanway.initSelect2("#versionid",
			"../../../"+ln_project+"/productors?method=queryProductorVersionsBySearch", "搜索版本");
	com.leanway.initSelect2("#stageid",
			"../../../"+ln_project+"/productionStage?method=queryProductionStageBySelect", "搜索生产阶段");
	aTable=initTable();
	queryCodeTypeList();
	com.leanway.enterKeyDown("searchValue", searchBom);
	initFileInput("#uploadFileInput", "../../../../"+ln_project+"/bom?method=excelUploadBom");
	processRouteLineTable = initProcessRouteLineTable()
	com.leanway.initSelect2("#procedureid",
			"../../../"+ln_project+"/standerProcedure?method=queryProcedureBySearch", "搜索标准工序");
	// 查询计量单位下拉框数据
	queryInitUnits();
	// 查找时间单位
	queryInitTimeUnits();
	com.leanway.formReadOnly("processRouteLineForm");
})
function uploadTreeNode(){
 	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
 	if(! zTree.getSelectedNodes()[0]){
		lwalert("tipModal", 1, "请选择节点进行导入替换");
		return;
 	}
	$("#importModal").modal("show");

}

//上传成功事件
$('#uploadFileInput').on('fileuploaded', function(event, data, previewId, index) {
	var flag =  com.leanway.checkLogind(data.response);

	if(flag){

	 var tableBodyHtml = "";

     if(data.response.errorData[0] != null&&data.response.status=="success") {

				for(var key in data.response.errorData) {

					var length = data.response.errorData[key].length;

					tableBodyHtml+="<li>"+data.response.errorData[key].slice(0, length-2)+"<br>";
					tableBodyHtml+="<span style='font-size:16px;color:red;'>"+data.response.errorData[key][length-1]+"</span></li>"

				}

				$("#showErrorResult").html(tableBodyHtml);
				$('#myResultModal').modal({backdrop: 'static', keyboard: false});

	 }else if(data.response.status=="error"){

			lwalert("tipModal", 1, data.response.info);
	 }else{
		    var zTree = $.fn.zTree.getZTreeObj("treeDemo");

//			var node = zTree.getSelectedNodes()[0].getParentNode();
//			if(node!=null){
//				zTree.reAsyncChildNodes(node, "refresh");
//			}else{
				zTree.reAsyncChildNodes(null, "refresh");
//			}
			$("#importModal").modal("hide");
			aTable.ajax.reload();
			lwalert("tipModal", 1, data.response.info);
	 }

	}

});

function rebackTreeNode(){

	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	if(!zTree.getSelectedNodes()[0]){
		lwalert("tipModal", 1, "请选中要恢复的节点！");
	}else{
		lwalert("tipModal", 2, "你确定要恢复吗？恢复后导入的数据将清除","isSureReback()");

	}
}
function isSureReback(){
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	var logid = zTree.getSelectedNodes()[0].logid;
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/bom?method=rebackImportBom",
		data : {
			"logid" : logid,
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);
			if(flag){
				if(data.status=="success"){
					var zTree = $.fn.zTree.getZTreeObj("treeDemo");

					var node = zTree.getSelectedNodes()[0].getParentNode();
					if(node!=null){
						zTree.reAsyncChildNodes(node, "refresh");
					}else{
						zTree.reAsyncChildNodes(null, "refresh");
					}
					aTable.ajax.reload();
				}
				lwalert("tipModal", 1, data.info);

			}
		}
	});
}
//上传CSV文件
function importExcelFunc() {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	var bomid = zTree.getSelectedNodes()[0].bomid;
	$('#uploadFileInput').fileinput('refresh',{
		uploadExtraData: {bomid:bomid}
	});

    $('#uploadFileInput').fileinput('upload');

}
//初始化fileinput控件（第一次初始化）
function initFileInput(ctrlId, uploadUrl) {
    $(ctrlId).fileinput({
        language: 'zh', //设置语言
        uploadUrl: uploadUrl, //上传的地址
        allowedFileExtensions : ['xls','xlsx'],//接收的文件后缀
        showUpload: false, //是否显示上传按钮
        showCaption: true,//是否显示标题
        showPreview: false,
        showRemove: true,
        maxFileCount: 1,
        minFileCount: 1,
        enctype: 'multipart/form-data',
        browseClass: "btn btn-primary", //按钮样式
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>"
    });

}
function initBootstrapValidator() {
	$('#bomForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					serialno : {
						validators : {
							stringLength : {
								min : 2,
								max : 20
							}
						}
					},
					pbomcount : {
						validators : {
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time )
						}
					},
					productorid : {
						validators : {
							notEmpty : {},

						}
					},
					versionid : {
						validators : {
							notEmpty : {},

						}
					},
					stageid : {
						validators : {
							notEmpty : {},

						}
					},				
					managerunit:{
						validators : {
						regexp : com.leanway.reg.fun(
								com.leanway.reg.decimal.managerunit,
								com.leanway.reg.msg.managerunit)
						}
					},
					attritionrate:{
						validators : {
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
							}
					},
					zetomsno:{
                        validators : {
                            regexp : com.leanway.reg.fun(
                                    com.leanway.reg.decimal.amount,
                                    com.leanway.reg.msg.amount)
                            }
                    },
				}
			});
}
var levels = ""
var bomid1 = "";
var stHtml = "";
var strhtml = "";

var addCount = 1;
// 添加节点
function addTreeNode() {
    $("#saveOrUpdate").prop("disabled",false);
	resetForm();
	$("#routeid").html("");
    $("#lineid").html("");
	ope = "addBom"
	displayblock();
	var newNode = {
		name : ""
	};

	if (zTree.getSelectedNodes()[0]) {
		resetForm();
		levels = zTree.getSelectedNodes()[0].levels;
		bomid1 = zTree.getSelectedNodes()[0].bomid;
		com.leanway.removeReadOnly("bomForm");
		document.getElementById("unitsname").readOnly = true;
	    document.getElementById("productortypeid").readOnly = true;
	    document.getElementById("material").readOnly = true;
        document.getElementById("length").readOnly = true;
        $("#productordesc").prop("readonly",true);
		newNode.checked = zTree.getSelectedNodes()[0].checked;
		flag=0;
		$("#pbomcount").val(1);
		loadProcessRoute(bomid1);
	} else {
		lwalert("tipModal", 1, "请选择相应的母件")
	}

}
// 修改节点
function modifyTreeNode() {
    $("#saveOrUpdate").prop("disabled",false);
	var nodes = zTree.getSelectedNodes();
	if (nodes.length == 0) {
		lwalert("tipModal", 1, "请选择需要修改的组件");
	}else if (nodes[0].bomid=="undefined"||nodes[0].bomid==undefined) {
		lwalert("tipModal", 1, "该组件还未保存信息，不能修改");
	}  else {
//		document.getElementById("bomid").value = nodes[0].bomid;
//		$.ajax({
//			type : "post",
//			url : "../../../"+ln_project+"/bom?method=queryBomObject",
//			data : {
//				"bomid" : nodes[0].bomid,
//			},
//			dataType : "text",
//			async : false,
//			success : function(data) {
//
//				var flag =  com.leanway.checkLogind(data);
//				if(flag){
//
//					var tempData = $.parseJSON(data);
//					setFormValue(tempData);
//				}
//			}
//		});
		if (nodes[0].getParentNode() != null) {
			bomid1 = nodes[0].getParentNode().bomid;
			levels = nodes[0].levels;
		}
		if(nodes[0].pbomid==""||nodes[0].pbomid==null){
			displaynone();
		}else{
			displayblock();
		}
		com.leanway.removeReadOnly("bomForm");
		document.getElementById("productorid").disabled = true;
		document.getElementById("versionid").disabled = true;
		document.getElementById("stageid").disabled = true;
		document.getElementById("unitsname").readOnly = true;
		document.getElementById("productortypeid").readOnly = true;
		document.getElementById("material").readOnly = true;
	    document.getElementById("length").readOnly = true;
	    $("#productordesc").prop("readonly",true);
		ope = "updateBom";
	}
}

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
function copyTreeNode() {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
	nodes = zTree.getSelectedNodes();
	if (nodes.length == 0) {
		lwalert("tipModal", 1, "请选择一个物料")
		return;
	}else if(nodes[0].bomid=="undefined"||nodes[0].bomid==undefined){
		lwalert("tipModal", 1, "该组件还未保存信息，不能复制");
	}
	curType = "copy";
	setCurSrcNode(nodes[0]);
}

function pasteTreeNode() {
	if (!curSrcNode) {
		lwalert("tipModal", 1, "请选择一个物料进行复制")
		return;
	}
	var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
	nodes = zTree.getSelectedNodes(),
	targetNode = nodes.length>0? nodes[0]:null;
	if(targetNode==null){
		lwalert("tipModal", 1, "请选择一个要粘贴的物料")
	}else{
			if (curSrcNode === targetNode) {
				lwalert("tipModal", 1,"复制与粘贴所选的物料相同，不能粘贴");
				return;
			}else if (curType === "copy") {
				$.ajax({
					type : "post",
					url : "../../../"+ln_project+"/bom?method=addPasteBoms",
					data : {
						"srcBomid" : curSrcNode.bomid,
						"targetBomid" : targetNode.bomid,
					},
					dataType : "json",
					async : false,
					success : function(data) {

						var flag =  com.leanway.checkLogind(data);

						if(flag){

							if(data.status=="success"){
								zTree.reAsyncChildNodes(targetNode, "refresh");
								aTable.ajax.reload();
							    lwalert("tipModal", 1,data.info);
							}else{
								 lwalert("tipModal", 1,data.info);
							}

						}
					}
				});
			}
			setCurSrcNode();
			delete targetNode.isCur;
			zTree.selectNode(targetNode);
	}
}

function isSure(type) {
	var nodes = zTree.getSelectedNodes();
	deleteAjax(nodes[0].levels,nodes[0].bomid,type);

}
// 删除节点
function removeTreeNode(type) {
	var nodes = zTree.getSelectedNodes();
	if (nodes && nodes.length > 0) {
		if (nodes[0].children && nodes[0].children.length > 0) {
			if(type==2){
				lwalert("tipModal", 2, "确定删除当前物料吗！","isSure("+type+")");
			}else{
				lwalert("tipModal", 2, "删除母件则母件底下的组件一起删掉！","isSure("+type+")");
			}

		} else {
			lwalert("tipModal", 2, "你确定要删除吗！","isSure("+type+")");
		}
	} else {
		lwalert("tipModal", 1, "请选择要删除的组件")
	}
}
// 删除Ajax
var deleteAjax = function(levels,bomid,type) {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/bom?method=deleteBom",
		data : {
			"conditions" : levels,
			"type":type,
			"bomid":bomid
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
				if (tempData.status == "success") {
					resetForm();
					var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
					var nodes = treeObj.getSelectedNodes();
					treeObj.reAsyncChildNodes(null, "refresh");
					aTable.ajax.reload();
				}
				lwalert("tipModal", 1, tempData.info);

			}
		}
	});
}

var zTree, treeMenu;
var oTable;
var aTable

var treeMethod="queryBomTreeList";
var initTree = function() {
	getBomTreeList(treeMethod);
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
}

function getBomTreeList(treeMethod) {
	$.fn.zTree.init($("#treeDemo"), {
		// edit: {
		// 	enable: true,
		// 	showRemoveBtn: false,
		// 	showRenameBtn: false,
		// 	drag: {
		// 		isCopy: false,
		// 		prev: true,
		// 		next: true,
		// 		inner: true
		// 	}
		// },
		async : {
			enable : true,
			url : "../../../"+ln_project+"/bom?method="+treeMethod,
			autoParam : [ "levels"]
		},
		view : {
			dblClickExpand : false,
			fontCss:getFontCss
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
			onClick : onClick,
			// beforeDrop:zTreeBeforeDrop,
			// onDrop: zTreeOnDrop
		}
	});
}
function zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType) {
	var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
	if(targetNode!=null){
		treeObj.reAsyncChildNodes(targetNode, "refresh");
	}else{
		treeObj.reAsyncChildNodes(null, "refresh");
}};
function zTreeBeforeDrop(treeId, treeNodes, targetNode, moveType) {
	var candrag=false;
	var targetbomid = null;
	if(targetNode!=null){
		targetbomid = targetNode.bomid;
		if(treeNodes[0].productorid==targetNode.productorid){
		    lwalert("tipModal", 1,"拖拽的节点不能和目标节点相同");
			candrag = false;
		    return false;
		}
	}
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/bom?method=updateDragBoms",
		data : {
			"srcBomid" : treeNodes[0].bomid,
			"targetBomid" : targetbomid,
		},
		dataType : "json",
		async : false,
		success : function(data) {
			var flag =  com.leanway.checkLogind(data);

			if(flag){
				if(data.status=="success"){
					candrag = true;
					aTable.ajax.reload();
					lwalert("tipModal", 1,"拖拽成功，请重新对目标节点和源节点进行审核");
				}else{
					 candrag = false;
					 lwalert("tipModal", 1,data.info);
				}

			}
		}
	});

	return candrag;
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
	if(zTree.getSelectedNodes()[0].pbomid==""||zTree.getSelectedNodes()[0].pbomid==null){
		displaynone();
		isParent = "true";
	}else{
		displayblock();
	}
	if(zTree.getSelectedNodes()[0].bomid){
		console.info(zTree.getSelectedNodes()[0].levels);
	    loadBomObject(zTree.getSelectedNodes()[0].bomid, isParent);
	    processRouteLineTable.ajax
		.url(
				"../../../"+ln_project+"/processRoute?method=queryProcessRouteLineByProductorid&productorid="
						+ zTree.getSelectedNodes()[0].productorid+"&stageid="+zTree.getSelectedNodes()[0].stageid+"&versionid="+zTree.getSelectedNodes()[0].versionid).load();
	}
	com.leanway.formReadOnly("bomForm");
}

var loadBomObject = function(bomid,isParent) {
    $("#saveOrUpdate").prop("disabled",true);
    flag=0;
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/bom?method=queryBomObject",
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
				setFormValue(tempData);
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
		url : "../../../"+ln_project+"/bom?method=queryProcessRouteLine",
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
		url : "../../../"+ln_project+"/bom?method=queryProcessRoute",
		data : {
			"bomid" : bomId,
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var isLogin = com.leanway.checkLogind(data);
			if(isLogin){
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
					strHtml += '<option value="' + data[i].routeid + '">' + data[i].shortname+"("+(data[i].version==null?'':data[i].version)+")"+'</option>';
				}
				stHtml = strHtml;
				if(flag==0){
				    $("#routeid").html(strHtml);
				}

			}

		}
	});

}

/**
 * 填充到HTML表单
 */
function setFormValue(data) {
	resetForm();

	var bomData = data.bom;
	var processRouteData = data.listProcessRoute;
	var strHtml = '';

	for (var i = 0; i < processRouteData.length; i++) {
		strHtml += '<option value="' + processRouteData[i].routeid + '">' + processRouteData[i].shortname+"("+processRouteData[i].version+")" +'</option>';
	}
	$("#routeid").html(strHtml);


	for ( var item in bomData) {

		if (item == "routeid") {

			loadLineData(bomData[item]);
		}

		if(item == "checkstatus"){
		    $("input[type=radio][name=" + item + "][value=" + bomData[item] + "]").prop('checked',true);
		}
		$("#" + item).val(bomData[item]);

	}
	if(bomData["starttime"]==null||bomData["starttime"]=="null"){
	    $("#starttime").html("未启用");
	}else{
	    $("#starttime").html(bomData["starttime"]);
	}
	// 给select2赋初值
	var productorid = bomData.productorid;
	if (productorid != null && productorid != "" && productorid != "null") {
		$("#productorid").append(
				'<option value=' + productorid + '>' + bomData.productorname+"("+bomData.productordesc+")"
						+ '</option>');
		$("#productorid").select2("val", [ productorid ]);
	}
	// 给select2赋初值
	var versionid = bomData.versionid;
	if (versionid != null && versionid != "" && versionid != "null") {
		$("#versionid").append(
				'<option value=' + versionid + '>' + bomData.version+ '</option>');
		$("#versionid").select2("val", [ versionid ]);
	}
	// 给select2赋初值
	var stageid = bomData.stageid;
	if (stageid != null && stageid != "" && stageid != "null") {
		$("#stageid").append(
				'<option value=' + stageid + '>' + bomData.stagecode+"("+bomData.stagename+")"
						+ '</option>');
		$("#stageid").select2("val", [ stageid ]);
	}
}

var addBom = function() {
    resetForm();
    $("#saveOrUpdate").prop("disabled",false);
	// 新增父节点取消节点被选中状态
	zTree.cancelSelectedNode();
	com.leanway.removeReadOnly("bomForm");
	document.getElementById("unitsname").readOnly = true;
	document.getElementById("productortypeid").readOnly = true;
	document.getElementById("material").readOnly = true;
    document.getElementById("length").readOnly = true;
    $("#productordesc").prop("readonly",true);
	displaynone();
	// 清空表单
	$("#routeid").html("");
	$("#lineid").html("");
	bomid1 = "";
	levels = "";
}
function refresh() {
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
}
var saveBom = function() {
	var productorid = $("#productorid").val();
	document.getElementById("productorid").disabled = false;
	document.getElementById("versionid").disabled = false;
	document.getElementById("stageid").disabled = false;
	var form = $("#bomForm").serializeArray();
	$("#bomForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#bomForm').data('bootstrapValidator').isValid()) { // 返回true、false
		if($("#productorid").val()!=null&&$("#productorid").val()!=""&&$("#productorid").val()!="undefined"){
		var formData = formatFormJson(form);
		$.ajax({
			type : "POST",
			url : "../../../"+ln_project+"/bom",
			data : {
				"method" : ope,
				"formData" : formData,
				"bomid1" : bomid1,
				"levels" : levels
			},
			dataType : "text",
			async : false,
			success : function(data) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					var tempData = $.parseJSON(data);
					if (tempData.status == "success") {
					    $("#checkstatus0").prop("checked",true);
					    com.leanway.formReadOnly("bomForm");
						aTable.ajax.reload();
						displayblock();
						refresh();
						lwalert("tipModal", 1, tempData.info);
					} else {
						lwalert("tipModal", 1, tempData.info);
					}

				}
			}
		});
	}else{
		lwalert("tipModal", 1, "产品不能为空，保存失败");
	}
	}
}
// 初始化select2,
/**
 * id: 为要操作的对象 url: url text: 要在select中显示的文本
 */
function initSelect2(id, url, text) {
	$(id).select2({
		placeholder : text,
		language : "zh-CN",
		ajax : {
			url : url,
			dataType : 'json',
			delay : 250,
			data : function(params) {
				return {
					q : params.term, // search term
					page : params.page,
					pageSize : 10
				};
			},
			processResults : function(data, params) {
				params.page = params.page || 1;
				return {
					results : data.items,
					pagination : {
						more : (params.page * 30) < data.total_count
					}
				};
			},
			cache : false
		},
		escapeMarkup : function(markup) {
			return markup;
		},
		minimumInputLength : 1,
	});
}
// 触发select2选择事件，给隐藏域赋值
$("#productorid").on("select2:select", function(e) {
	$("#versionid").val(null).trigger("change");
	$("#stageid").val(null).trigger("change");
	com.leanway.initSelect2("#versionid",
			"../../../"+ln_project+"/productors?method=queryProductorVersionsBySearch&productorid="+$(this).val(), "搜索版本");
	com.leanway.initSelect2("#stageid",
			"../../../"+ln_project+"/productionStage?method=queryProductionStageBySelect&productorid="+$(this).val()+"&versionid="+$("#versionid").val(), "搜索生产阶段");
});
//触发select2选择事件，给隐藏域赋值
$("#versionid").on("select2:select", function(e) {
	$("#stageid").val(null).trigger("change");
	var productorid = $("#productorid").val();
	com.leanway.initSelect2("#stageid",
			"../../../"+ln_project+"/productionStage?method=queryProductionStageBySelect&versionid="+$(this).val()+"&productorid="+productorid, "搜索生产阶段");
});

/**
 * 重置表单
 *
 */
var resetForm = function() {
	$('#bomForm').each(function(index) {
		$('#bomForm')[index].reset();
	});
	bomid1 = "";
	$("#bomid").val("");
	$("#bomForm").data('bootstrapValidator').resetForm();
	$("#productorid").val("").trigger("change");
	$("#versionid").val(null).trigger("change");
	$("#stageid").val(null).trigger("change");


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

function forwardLogout(){
	window.parent.location.href = "../../../"+ln_project+"/user?method=logout";
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

//初始化数据表格
var initTable = function () {
	var table = $('#generalInfo').DataTable( {
			"ajax": "../../../"+ln_project+"/bom?method=queryBomBySearch",
	        'bPaginate': true,
	        "bDestory": true,
	        "bRetrieve": true,
	        "bFilter":false,
	        "bSort": false,
	        "bProcessing": true,
	        "bServerSide": true,
	        'searchDelay':"5000",
	        "columns": [
                {"data" : "bomid"},
                { "data": "productorname" },
                { "data": "productordesc" },
                { "data": "gproductorname" },
                { "data": "gproductordesc" },
                { "data": "pproductorname" },
                { "data": "pproductordesc" },
	         ],
	         "aoColumns": [
	               {
	            	   "mDataProp": "bomid",
	                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
	                	   $(nTd).html("<div id='stopPropagation" + iRow +"'>"
								   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='checkList' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label>");
                           com.leanway.columnTdBindSelectNew(nTd,"generalInfo","checkList");
	                   }
	               },
	               {"mDataProp": "productorname"},
	               {"mDataProp": "productordesc"},
	               {"mDataProp": "gproductorname"},
	               {"mDataProp": "gproductordesc"},
	               {"mDataProp": "pproductorname"},
	               {"mDataProp": "pproductordesc"},

	          ],
	         "oLanguage" : {
	        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
	         },
	         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	         "fnDrawCallback" : function(data) {
            	 com.leanway.setDataTableSelectNew("generalInfo",
                          null, "checkList", null);
        		 com.leanway.dataTableClickMoreSelect("generalInfo", "checkList", false, aTable,undefined,undefined,undefined);


//
				}
	    } ).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );

	return table;
}

var searchBom= function () {
	var searchVal = $("#searchValue").val();
	aTable.ajax.url("../../../"+ln_project+"/bom?method=queryBomBySearch&searchValue=" + searchVal).load();

}
var getTree= function (type) {
	var bomid = com.leanway.getCheckBoxData(2, "generalInfo", "checkList");
	if(bomid!=""){
		getBomTreeList("querySearchTree&bomid="+bomid+"&type="+type);

	}else
		lwalert("tipModal", 1, "请展开物料清单，选中一条数据");
}
var getUnit = function(){
    var productorid=$("#productorid").val();
    var versionid = $("#versionid").val();
    var paramData="{\"productorid\":\""+productorid+"\",\"versionid\":\""+versionid+"\"}";
    if(versionid!=null&&versionid!=""&&versionid!=undefined){
    	 $.ajax({
    	        type : "POST",
    	        url : "../../../"+ln_project+"/productors",
    	        data : {
    	            "method" : "queryProductorInfoByVersionid",
    	            "paramData" : paramData,

    	        },
    	        dataType : "text",
    	        async : false,
    	        success : function(data) {
    	            var tempData = $.parseJSON(data);
    	            $("#productordesc").val(tempData.productordesc);
    	            $("#unitsname").val(tempData.unitsname);
    	            $("#productortypeid").val(tempData.productortypemask+"|"+tempData.productortypename);
    	            $("#material").val(tempData.material);
    	            $("#length").val(tempData.length);
    	        }
    	    });
    }
   
}
var routeTable;
function checkTreeNode(){

    flag=1;
    if (zTree.getSelectedNodes()[0]) {
        showMask();
        var levels = zTree.getSelectedNodes()[0].levels;
        $.ajax({
            type : "POST",
            url : "../../../"+ln_project+"/bom",
            data : {
                "method" : "queryBomToCheck",
                "levels" :levels
            },
            dataType : "json",
            success : function(data) {
            	var flag =  com.leanway.checkLogind(data);

    			if(flag){

	                if(data.status!="error"){
	                    if(data.data.length>0){
	                        initEditTable(data.data);
	                        $('#routeModal').modal({backdrop: 'static', keyboard: false});
	                    }else{
	                       hideMask();
	                       $("#checkstatus1").prop("checked",true);
	                       lwalert("tipModal", 1, "审核成功");
	                    }
	                }else{
	                    hideMask();
	                    lwalert("tipModal", 1, data.info);
	                }
	    			}
            },

        });
    }else{
        hideMask();
        lwalert("tipModal", 1, "请选择物料进行审核，将从该物料的顶层进行审核");
    }
}

function initEditTable(data){
   var html="";

   for(var i=0;i<data.length;i++){
       loadProcessRoute(data[i].pbomid);
       html+="<tr>"
       var productorname  = data[i].productorname+"("+data[i].productordesc+")";
       html+='<td><input class="form-control"  type="text" value='+productorname+' readonly="readonly"></td>';
       html+='<td><select class="form-control" >'+stHtml+'</select></td>';
       html+='<td><select class="form-control" >'+strhtml+'</select></td>';
       html+='<td><input class="form-control"  type="hidden" value='+data[i].bomid+'></td>';
       html+='<td><input class="form-control"  type="hidden" value='+data[i].pbomid+'></td>';
       html+="</tr>"
   }
   hideMask();
   $("#tableBody").html(html);
}
function updateBom(){
    var reg = /,$/gi;
    var bomList = "[";
    $("#tableBody").find('tr').each(
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
            url : "../../../"+ln_project+"/bom",
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
                "ajax" : "../../../"+ln_project+"/bom?method=queryBomToCheck&levels="+levels,
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

/**
 * 搜索关键件类型
 */
function queryCodeTypeList() {
    $.ajax({
        type : "get",
        url : "../../../"+ln_project+"/bom",
        data : {
            method : "queryCriticalTypeList",
        },
        dataType : "json",
        success : function(data) {
            resetForm();
            setCriticalType(data);
        },
        error : function(data) {

        }
    });
}
var setCriticalType = function(data) {
    var html = "";
    for ( var i in data) {
        html += "<option value=" + data[i].codemapid + ">" + data[i].codevalue
                + "</option>";
    }

    $("#criticaltype").html(html);
}

function createBatchnumber(type){

	var levels = ""
	if(zTree.getSelectedNodes()[0]){
		levels = zTree.getSelectedNodes()[0].levels;
	}else{
        lwalert("tipModal", 1, "请选中节点进行生成");
	}
	$.ajax({
		type : "POST",
        url : "../../../"+ln_project+"/bom",
        data : {
            method : "updateProductorBatchnumber",
            type : type,
            levels : levels
        },
        dataType : "json",
        success : function(data) {
        	var flag =  com.leanway.checkLogind(data);

			if(flag){
                lwalert("tipModal", 1, data.info);
			}
        },
        error : function(data) {

        }
    });

}
function displaynone(){
	$("#count").css('display', 'none');
	$("#label").css('display', 'none');
	$("#unitsnamediv").removeClass('col-sm-2').addClass('col-sm-4');
	$("#unitsnamelab").removeClass('col-sm-1').addClass('col-sm-2');
}

function displayblock(){
	$("#count").css('display', 'block');
	$("#label").css('display', 'block');
	$("#unitsnamediv").removeClass('col-sm-4').addClass('col-sm-2');
	$("#unitsnamelab").removeClass('col-sm-2').addClass('col-sm-1');
}
function showMask(){

    $("#mask").css("height",$(document).height());
    $("#mask").css("width",$(document).width());
    $("#mask").show();
  }
  //隐藏遮罩层
  function hideMask(){
    $("#mask").hide();
  }

  //导出选中节点及以下的组件
  function downloadTreeNode() {

  	var nodes = zTree.getSelectedNodes();
  	if (nodes.length == 0) {
  		lwalert("tipModal", 1, "请选择需要导出的组件");
  	}else if (nodes[0].bomid=="undefined"||nodes[0].bomid==undefined) {
  		// alert("请选择需要修改的组件");
  		lwalert("tipModal", 1, "该组件还未保存信息，不能导出");
  	} else {
  		document.getElementById("bomid").value = nodes[0].bomid;
  		$.ajax({
  			type : "post",
  			url : "../../../"+ln_project+"/bom?method=downloadBom",
  			data : {
  				"bomid" : nodes[0].bomid,
  			},
  			dataType : "text",
  			async : false,
  			success : function(data) {

  				var flag =  com.leanway.checkLogind(data);
  				if(flag){

  					 if(flag){
  						 window.location.href = "../../../"+ln_project+"/bom?method=downloadBom&bomid="+nodes[0].bomid;

  						 $("#downloadFun").prop("disabled", false);
  						 $("#downloadFun").html("导出");
  					 }else{
  						 $("#downloadFun").prop("disabled", false);
  						 $("#downloadFun").html("导出");
  					 }

  				}
  			}
  		});
  	}
  }

  /**
   * 高级查询
   */
  var advancedSearch = function ( ) {

  	// 字段信息
  	var fieldInfoData = '[';
  	fieldInfoData += '{"fieldName" : "p.productorname","fieldType":"varchar","displayName" : "产品编码"},';
  	fieldInfoData += '{"fieldName" : "p.productordesc","fieldType":"varchar","displayName" : "产品长名"},';
  	fieldInfoData += '{"fieldName" : "p.material","fieldType":"varchar","displayName" : "产品规格"},';
  	fieldInfoData += '{"fieldName" : "pr.name","fieldType":"varchar","displayName" : "上级工艺路线"},';
  	fieldInfoData += '{"fieldName" : "sp.proceduredesc","fieldType":"varchar","displayName" : "工序描述"},';
  	fieldInfoData += ']';

  	// 构建查询Table
  	com.leanway.buildAdvancedTable(fieldInfoData, "advancedSearchModal", "advancedSearchForm", "advancedSearchTable", "advancedQuery");

  }

  var advancedQuery = function ( jsonData ) {

		com.leanway.clearTableMapData("generalInfo");
		aTable.ajax.url("../../../"+ln_project+"/bom?method=queryBomBySearch&sqlDatas="  + encodeURIComponent(jsonData)).load();
	}
  
//初始化工艺路线行表格
  var initProcessRouteLineTable = function() {

  	var table = $('#processRouteLineDataTable')
  			.DataTable(
  					{
  						"ajax" : "../../../"+ln_project+"/processRoute?method=queryProcessRouteLineById",
  						/* "iDisplayLength" : "10", */
  						'bPaginate' : true,
  						"bDestory" : true,
  						"bRetrieve" : true,
  						"bFilter" : false,
  						"bSort" : false,
  						"scrollY":"250px",
  						"bAutoWidth" : true, // 宽度自适应
  						"bProcessing" : true,
  						"bServerSide" : true,
  						'searchDelay' : "5000",
  						"columns" : [ {
  							"data" : "lineid"
  						}, {
  							"data" : "lineno"
  						}, {
  							"data" : "procedurename"
  						} ],
  						"aoColumns" : [
  								{
  									"mDataProp" : "lineid",

  									 "fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
  	                                        $(nTd).html(
  	                                        		"<div id='stopPropagation"
  													+ iRow
  													+ "'>"
  													+"<input class='regular-checkbox' type='checkbox' id='" + sData
  	                                                        + "' name='processRouteLineCheckList' value='" + sData
  	                                                        + "'><label for='" + sData
  	                                                        + "'></label>");
  	                                        com.leanway.columnTdBindSelectNew(nTd,"processRouteLineDataTable", "processRouteLineCheckList");
  	                                    }

  								}, {
  									"mDataProp" : "lineno"
  								}, {
  									"mDataProp" : "procedurename"
  								},{
  									"mDataProp" : "proceduredesc"
  								}
  								],



  						"oLanguage" : {
  							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
  						},
  						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
  						"fnDrawCallback" : function(data) {


  							com.leanway.getDataTableFirstRowId("processRouteLineDataTable", getProcessRouteLineById,"more", "processRouteLineCheckList");
  							 // 点击dataTable触发事件
                            com.leanway.dataTableClickMoreSelect("processRouteLineDataTable", "processRouteLineCheckList", false,
                          		  processRouteLineTable, getProcessRouteLineById,undefined,undefined,"checkAllProcessRouteLine");

                            com.leanway.dataTableCheckAllCheck('processRouteLineDataTable', 'checkAllProcessRouteLine', 'processRouteLineCheckList');

  						}

  					}).on('xhr.dt', function (e, settings, json) {
  						com.leanway.checkLogind(json);
  					} );

  	return table;
  }
  
  /**
   * 根据id查询工艺路线行信息在表单中显示
   */
  function getProcessRouteLineById(lineid) {

  	$.ajax({
  		type : "get",
  		url : "../../../"+ln_project+"/processRoute",
  		data : {
  			method : "queryProcessRouteLineByLineid",
  			conditions : '{"lineid":"' + lineid + '"}'
  		},
  		dataType : "json",
  		success : function(data) {

  			var flag =  com.leanway.checkLogind(data);

  			if(flag){

  					 resetProcessRouteLineForm();
					 com.leanway.formReadOnly("processRouteLineForm");
  					// 表单赋值
  					setProcessRouteLineFormValue(data.processRouteLineResult);
console.info(data.processRouteLineResult);
  					$("#saveOrUpdateLineId").attr({
  						"disabled" : "disabled"
  					});

  			}

  		},
  		error : function(data) {

  		}
  	});
  }
  
  /**
   * 清空工艺路线行表单
   */
  function resetProcessRouteLineForm() {


  	$('#processRouteLineForm').each(function(index) {
  		$('#processRouteLineForm')[index].reset();
  	});

  	$("#procedurename").val("");
  	$("#procedureid").val(null).trigger("change"); // select2值给清空
  	$("#processRouteLineForm input[type='hidden']").val("");
  }
  
//为工艺路线行表单赋值
  function setProcessRouteLineFormValue(data) {
  	if(data==null||data=="null"){
  		return;
  	}
  	resetProcessRouteLineForm();

  	for ( var item in data) {
  		if(item=="lineid"){
  			$("#lineidTwo").val(data[item]);
  		}else if(item=="routeid"){
  			continue;
  		}else{
  			$("#" + item).val(data[item]);
  		}
  	}

  	// 给select2赋初值
  	var procedureid = data.procedureid;
  	if (procedureid != null && procedureid != "" && procedureid != "null") {
  		$("#procedureid").append(
  				'<option value=' + procedureid + '>' + data.procedurename
  						+ '</option>');
  		$("#procedureid").select2("val", [ procedureid ]);
  	}


  }
//查询计量单位下拉框数据
  function queryInitUnits() {
  	$.ajax({
  		type : "get",
  		url : "../../../"+ln_project+"/units",
  		data : {
  			method : "queryInitUnits",
  			conditions : "{}"
  		},
  		dataType : "json",
  		success : function(data) {

  			var flag =  com.leanway.checkLogind(data);

  			if(flag){
  				// 下拉框赋值
  				setUnits(data.unitsResult);

  			}
  		},
  		error : function(data) {

  		}
  	});
  }
  // 查询时间单位下拉框数据
  function queryInitTimeUnits() {
  	$.ajax({
  		type : "get",
  		url : "../../../"+ln_project+"/units",
  		data : {
  		    method : "queryUnitsByUnitsTypeId",
              "unitsTypeId" : "时间单位"
  		},
  		dataType : "json",
  		success : function(data) {

  			var flag =  com.leanway.checkLogind(data);

  			if(flag){

  				// 下拉框赋值
  				setTimeUnits(data.timeUnitsResult);

  			}
  		},
  		error : function(data) {

  		}
  	});
  }
//初始化时间单位下拉框
  var setTimeUnits = function(data) {
  	var html = "";

  	for ( var i in data) {
  		// 拼接option
  		html += "<option value=" + data[i].unitsid + ">" + data[i].unitsname
  				+ "</option>";
  	}

  	$("#timeunit").html(html);
  	$("#timeunits").html(html);
  }
//初始化计量单位，工序单位下拉框
  var setUnits = function(data) {
  	var html = "";

  	for ( var i in data) {

  		// 拼接option
  		html += "<option value=" + data[i].unitsid + ">" + data[i].unitsname
  				+ "</option>";
  	}
  	$("#countunit").html(html);
  	$("#roteunitsid").html(html);
  }
  
//显示工艺路线行编辑数据
  function showEditProcessRouteLine() {
  	var data = processRouteLineTable.rows('.row_selected').data();

  	if (data.length == 0) {
  		lwalert("tipModal", 1, "请选择工艺路线行！");
  	} else if (data.length > 1) {
  		lwalert("tipModal", 1, "只能选择一个工艺路线行修改！");
  	} else {
  		var lineid = data[0].lineid;

  		com.leanway.removeReadOnly("processRouteLineForm");
  		$("#procedureid").attr("disabled", "disabled");
		document.getElementById("lineno").readOnly = true;
		document.getElementById("proceduredesc").readOnly = true;
  		$("#saveOrUpdateLineId").removeAttr("disabled");
  	}
  }
  
//根据opeLineMethod的值进行保存或更新操作
  function saveLine() {
    var form = $("#processRouteLineForm").serializeArray();
    var formData = formatFormJson(form);
  	$.ajax({
  		type : "post",
  		url : "../../../"+ln_project+"/processRoute",
  		data : {
  			method : "updateProcessRouteLineSimple",
  			conditions : formData,
  		},

  		dataType : "text",
  		success : function(data) {

  			var flag =  com.leanway.checkLogind(data);

  			if(flag){

  				var tempData = $.parseJSON(data);
  	            if (tempData.status == "success") {

  					$("#saveOrUpdateAId").attr({
  						"disabled" : "disable"
  					});
  					com.leanway.clearTableMapData( "processRouteLineDataTable" );
					processRouteLineTable.ajax.reload(null,false);
  					com.leanway.formReadOnly("processRouteLineForm");
  					lwalert("tipModal", 1, tempData.info);
  				} else {

  					lwalert("tipModal", 1, tempData.info);

  				}

  			}
  		},
  		error : function(data) {
  			lwalert("tipModal", 1, "保存失败！");
  		}
  	});
  }
  
  var showBomDataSyncModal = function ( ) {
	  $("#syncproductorname").val("");
	  $('#syncmodal').modal({backdrop: 'static', keyboard: true});
	  
  }
 