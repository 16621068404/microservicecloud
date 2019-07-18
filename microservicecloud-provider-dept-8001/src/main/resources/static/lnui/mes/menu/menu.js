
// 数据table
var menuTable;

// tag table
var tagTable;
var ope="getMenuList";
jQuery( document ).ready( function( ) {
	//重写模态框的一些方法,防止select2与模态框冲突
	$.fn.modal.Constructor.prototype.enforceFocus = function() {};
	queryTypeList();
	// 初始化对象
	com.leanway.loadTags();

	// 加载datagrid
	menuTable = initMenuTreeTable(ope);

	// 绑定事件
	$("#saveMenu").click( saveMenu );
	$("#saveMenuRole").click( saveMenuRole );
	$("#saveMenuTag").click ( saveMenuTag );


	//数据验证
	initBootstrapValidator();

	// 初始化时间
    initTimePick("startTime");
    initTimePick("endTime");
    com.leanway.initSelect2("#searchValue",
            "../../../"+ln_project+"/menu?method=queryMenuBySearchValue", "搜索菜单");

	// 全选
	$("#checkAll").on("click", function ( ) {
		if ($(this).prop("checked") === true) {
			$("input[name='checkList']").prop("checked", $(this).prop("checked"));
			$('#tagDataTable tbody tr').addClass('row_selected');
		} else {
			$("input[name='checkList']").prop("checked", false);
			$('#tagDataTable tbody tr').removeClass('row_selected');
		}
 	});

	 $("#searchCompanyValue").on("select2:select", function(e) {
	    	var compid = $("#searchCompanyValue").find("option:selected").val();

	    	var opeMethod = "getRolesTreeList&compid="+compid;

	    	initRoleTree(opeMethod);

	    });
	 //获取用户的id
	 var cId =  parent.window.compId;
	 //当用户的id为空时
	 if (cId == null || $.trim(cId) == "" || cId == undefined || typeof(cId) == "undefined" ) {

		 //初始化select2
		 com.leanway.initSelect2("#searchCompanyValue",
			 "../../../"+ln_project+"/role?method=getCompanyBySearch", "企业名称");
	 }else{

		 //隐藏gselect标签
		 $("#searchCompanyValue").hide();
	 }

});
$("#searchValue").on("select2:select", function(e) {
    var menuid = $("#searchValue").val();
    initMenuTreeTable("getMenuTreeBySearchValue&menuid="+menuid);
});


//Gree Table
glyph_opts = {
		map: {
			doc: "glyphicon glyphicon-file",
			docOpen: "glyphicon glyphicon-file",
			checkbox: "glyphicon glyphicon-unchecked",
			checkboxSelected: "glyphicon glyphicon-check",
			checkboxUnknown: "glyphicon glyphicon-share",
			dragHelper: "glyphicon glyphicon-play",
			dropMarker: "glyphicon glyphicon-arrow-right",
			error: "glyphicon glyphicon-warning-sign",
			expanderClosed: "glyphicon glyphicon-plus-sign",
			expanderLazy: "glyphicon glyphicon-plus-sign",  // glyphicon-expand
			expanderOpen: "glyphicon glyphicon-minus-sign",  // glyphicon-collapse-down
			folder: "glyphicon glyphicon-folder-close",
			folderOpen: "glyphicon glyphicon-folder-open",
			loading: "glyphicon glyphicon-refresh"
	}
};



// 初始化dataGrid
var initMenuTreeTable = function (ope) {


	if("getMenuList" == ope){
	$("#select2-searchValue-container").html("");
	}
	$("#menuTreeTable").fancytree( {
		extensions : ["dnd", "edit", "glyph", "table"],
		checkbox : true,
		selectMode : 2,
		dnd : {
			focusOnClick : false,
			dragStart : function( node, data ) { return true; },
			dragEnter : function( node, data ) { return true; },
			dragDrop : function( node, data ) { data.otherNode.copyTo(node, data.hitMode); }
		},
		glyph : glyph_opts,
		source : {
			url: "../../../"+ln_project+"/menu?method="+ope,
			debugDelay: 10
		},
		table : {
			checkboxColumnIdx : 1,
			nodeColumnIdx : 2
		},
		lazyLoad: function( event, data ) {
			data.result = {
				url: "../../../"+ln_project+"/menu?method="+ope+"&levels=" + data.node.data.levels,
				debugDelay: 10
			};
		},
		renderColumns: function(event, data) {
			var node = data.node,
			$tdList = $(node.tr).find(">td");
			$tdList.eq(0).text(node.getIndexHier());
			$tdList.eq(3).text(node.data.link);
			$tdList.eq(4).text(node.data.path);
		}
	});




}

// 保存菜单关联角色
var saveMenuRole = function () {

	var menuId = getTreeTableActiveId();

	var checkRoleIds = "";

	var zTree = $.fn.zTree.getZTreeObj("tree");
	var nodes = zTree.getCheckedNodes(true);

	for (var i = 0; i < nodes.length; i++) {
		checkRoleIds += nodes[i].roleid +",";
	}

	if (checkRoleIds == "") {
		var menuName = getTreeTableActiveName();
		lwalert("tipModal", 2, "确定清空菜单【" + menuName + "】关联的角色？","isSureSaveRole()");
//		if (confirm("确定清空菜单【" + menuName + "】关联的角色？")) {
//			ajaxSaveMenuRole(checkRoleIds, menuId);
//		}

	} else {
		ajaxSaveMenuRole(checkRoleIds, menuId);
	}

}
function isSureSaveRole(){

	var menuId = getTreeTableActiveId();

	var checkRoleIds = "";

	var zTree = $.fn.zTree.getZTreeObj("tree");
	var nodes = zTree.getCheckedNodes(true);

	for (var i = 0; i < nodes.length; i++) {
		checkRoleIds += nodes[i].roleid +",";
	}

	ajaxSaveMenuRole(checkRoleIds, menuId);
}

var ajaxSaveMenuRole = function (checkRoleIds, menuId) {

	$.ajax ( {
		type : "POST",
		url : "../../../"+ln_project+"/menu?method=saveMenuRole",
		data : {
			"roleIds" : checkRoleIds,
			"menuId" : menuId
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				if ($.trim(text)  == "1") {
					$('#roleTree').modal('hide');
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");
				}

			}

		}
	});

}


// 新增菜单
var addMenu = function () {

	ope = "add";

	// 切换标题
	$("#menuModalLabel").html("新增菜单");

	// 清空表单
	resetFrom();

	$('#menuModal').modal({backdrop: 'static', keyboard: false});

}

// 保存用户关联
var saveMenu = function ( ) {

	// 获取选择的菜单
	var levels =getTreeTableActiveLevels();

	var form  = $("#menuForm").serializeArray();
	var formData = formatFormJson(form);
	// 提交前先验证
	$("#menuForm").data('bootstrapValidator').validate();
	// 返回true、false
	if ($('#menuForm').data('bootstrapValidator').isValid()) {
	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/menu?method=" + ope,
		data : {
			"formData" : formData,
			"levels" : levels
		},
		dataType : "json",
		async : false,
		success : function ( result ) {

			//var result =  $.parseJSON( $.trim( text ) );

			var flag =  com.leanway.checkLogind(result);

			if(flag){

				if (result.status == "true") {

					$('#menuModal').modal('hide');
					reloadMenuTreeTable();

				} else {
	//				alert(result.info);
					lwalert("tipModal", 1, result.info);
				}

			}

		}
	});
  }
}

// 删除菜单
var deleteMenu = function ( ) {

	var str = getTreeTableSelectedLevels();

    if ($.trim(str) == "" || str.length == 0 ) {

//    	alert("请勾选菜单进行删除!");
    	lwalert("tipModal", 1, "请勾选菜单进行删除!");
    	return;

    } else {
    	lwalert("tipModal", 2, "确定要删除选中的菜单吗!","isSureDelete()");
        var ids = str.substr(0, str.length - 1);

//        if (confirm("确定要删除选中的菜单吗?"))  {
//        	deleteAjax(ids);
//        }
    }

}

function isSureDelete(){

	var str = getTreeTableSelectedLevels();
	var ids = str.substr(0, str.length - 1);
	deleteAjax(ids);
}

// 删除Ajax
var deleteAjax = function (levels) {

	$.ajax ( {
		type : "POST",
		url : "../../../"+ln_project+"/menu?method=delete",
		data : {
			"levels" : levels
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				if ( $.trim(text) == "1" ) {
					reloadMenuTreeTable();
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败!");
				}

			}

		}
	});

}


// 显示编辑的菜单数据
var showEditMenu = function ( ) {

	var menuId = getTreeTableActiveId();

	if (menuId == null ||  $.trim(menuId) == "" || menuId.length == 0 ) {
//		alert("请选择菜单进行编辑!");
		lwalert("tipModal", 1, "请选择菜单进行编辑!");
		return;
	}

	// 切换方法
	 ope = "update";

	 // 切换标题
	 $("#menuModalLabel").html("修改菜单");

 	 // 获取数据
	 getMenu(menuId);

}

// 加载用户数据
var  getMenu = function ( menuId ) {

	$.ajax ( {
		type : "POST",
		url : "../../../"+ln_project+"/menu?method=getMenu",
		data : {
			"menuId" : menuId
		},
		dataType : "text",
		async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				// 表单赋值
				setFormValue(text);

				$('#menuModal').modal({backdrop: 'static', keyboard: false});

			}
		}
	});
}

// 菜单角色关联
var showRole = function ( ) {
	//com.leanway.checkSession();
	var menuId = getTreeTableActiveId( );

	if (menuId == null || $.trim(menuId) == "") {
//		alert("请选中菜单后关联角色!");
		lwalert("tipModal", 1, "请选择菜单后关联角色!");
		return;
	}

//	$("#searchCompanyValue").val(null).trigger("change");
	$("#select2-searchCompanyValue-container").html("");


	// 弹出modal
	$('#roleTree').modal({backdrop : 'static', keyboard : false});

	//调用共用的方法
	 var opeMethod ="getRolesTreeList";

	 initRoleTree(opeMethod);


}

// 选中树节点
function onClick(e, treeId, treeNode) {

	// 获取角色标识
	var roleId = treeNode.roleid;

	// 获取菜单标识
	var selectMenuId  = getTreeTableActiveId();

	if ( treeNode.checked ) {
		$.fn.zTree.getZTreeObj(treeId).checkNode(treeNode, false, false);
	} else {
		$.fn.zTree.getZTreeObj(treeId).checkNode(treeNode, true, true);
	}

	// 初始化用户Grid
	if (tagTable == null || tagTable == "undefined" || typeof(tagTable) == "undefined") {
		tagTable = initTagTable(selectMenuId, roleId);
	} else {

		//oTable.destroy();
	//	oTable = initTable(selectRole);
		tagTable.ajax.url("../../../"+ln_project+"/tag?method=getTagList&paginate=false&menuId=" + selectMenuId+"&roleId=" + roleId ).load();

	//	oTable.fnReloadAjax( "" + selectRole );
	}

}

// 树形节点一步加载完成
function onAsyncSuccess(event, treeId, treeNode, msg) {

	try {
		if ( typeof( treeNode ) == "undefined" ) {
			var zTree = $.fn.zTree.getZTreeObj(treeId);
			var rootNode = zTree.getNodes()[0];
		    zTree.selectNode(rootNode);
		    zTree.expandNode(rootNode, true);
		    /* showMstDataInGrid({folderguid: nodes[0].GUID}); */
		}
	} catch (e) {
	}
}

// 关联对象
var showTags = function ( ) {

	var selectMenuId  = getTreeTableActiveId();

	if ( selectMenuId == "" || selectMenuId.length == 0 ) {
//		   alert("请选择菜单进行关联!");
		lwalert("tipModal", 1, "请选择菜单进行关联!");
		   return;
	}

	// 弹出modal
	$('#tagModal').modal({backdrop: 'static', keyboard: false});

	// 初始化用户Grid
	if (tagTable != null && tagTable != "undefined" && typeof(tagTable) != "undefined") {
		tagTable.ajax.url("../../../"+ln_project+"/tag?method=getTagList&paginate=false&menuId=" + selectMenuId).load();
	}
	//	tagTable = initTagTable(selectMenuId);
	//} else {

		//oTable.destroy();
	//	oTable = initTable(selectRole);
	//

	//	oTable.fnReloadAjax( "" + selectRole );
	//}

	 $.fn.zTree.init($("#tagRoleTree"),  {
		 check : {
	            enable : true,
	            chkStyle :"radio",
	            chkboxType : { "Y": "p", "N": "p" },
	 			radioType : "all"
	        },
	        async: {
	        	enable : true,
	        	url : "../../../"+ln_project+"/menu?method=getRolesTreeList" ,
	        	autoParam : ["levels"],
	        	otherParam : {"menuId" : selectMenuId,"loadNoRelation" : "true"}
	        },
	        view: {

	            dblClickExpand: false,
	            showLine: true,
	            selectedMulti: false
	        },
	        data: {
	        	key: { name : "rolename" },
	            simpleData : {
	                enable : true,
	                idKey : "roleid",
	                pIdKey :  "pid",
	                rootPId : ""
	            }
	        },
	        callback: {
/*	            beforeClick: function(treeId, treeNode) {
	                var zTree = $.fn.zTree.getZTreeObj("tree");
	                if (treeNode.isParent) {
	                    zTree.expandNode(treeNode);
	                    return false;
	                }
	            },*/
	            onAsyncSuccess: onAsyncSuccess,onClick:onClick
	      }
	});

}


// 初始化对象数据表
var initTagTable = function ( selectMenuId, roleId ) {

	var table = $('#tagDataTable').DataTable( {
		"ajax": "../../../"+ln_project+"/tag?method=getTagList&paginate=false&menuId=" + selectMenuId + "&roleId=" + roleId,
		/* "iDisplayLength" : "10",*/
        'bPaginate': false,
        "bDestory": true,
        "bRetrieve": true,
        "bFilter":false,
        "bSort": false,
        "bProcessing": true,
        "bServerSide": false,
        "columns": [
                    {"data" : "tagid"},
                    {"data" : "tagname"},
                    {"data" : "type"},
                    { "data": "id" },
                    { "data": "event" }
         ],
         "aoColumns": [
                   {
                	   "mDataProp": "tagid",
                       "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                           $(nTd).html("<input type='checkbox' name='checkList'  value='" + sData + "'>");
                       }
                   },
	               {"mDataProp": "tagname"},
	               {"mDataProp": "type"},
	               {"mDataProp": "id"},
	               {"mDataProp": "eventname"}
          ],
          "fnCreatedRow": function ( nRow, aData, iDataIndex ) {

        	  if (aData.hastag == "true") {
        		  $(nRow).addClass("row_selected");
        		  $(nRow).find('td').eq(0).find("input[name='checkList']").prop("checked", true)
        	  }

              //add selected class
        	  $(nRow).click(function () {

                  if ($(this).hasClass('row_selected')) {
                      $(this).removeClass('row_selected');
                      $(this).find('td').eq(0).find("input[name='checkList']").prop("checked", false)
                  } else {
                   //   oTable.$('tr.row_selected').removeClass('row_selected');
                      $(this).addClass('row_selected');
                   //   $("input[name='checkList']").prop("checked", false);
                      $(this).find('td').eq(0).find("input[name='checkList']").prop("checked", true)
                  }

              });
          },
         "oLanguage" : {
             "sProcessing" : "正在加载中......",
             "sLengthMenu" : "每页显示 _MENU_ 条记录",
             "sZeroRecords" : "没有数据！",
             "sEmptyTable" : "表中无数据存在！",
             "sInfo" : "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
             "sInfoEmpty" : "显示0到0条记录",
             "sInfoFiltered" : "数据表中共为 _MAX_ 条记录",
             "sSearch" : "查询",
             "oPaginate" : {
                 "sFirst" : "首页",
                 "sPrevious" : "上一页",
                 "sNext" : "下一页",
                 "sLast" : "末页"
             }
         }

    } ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );

	return table;

}

// 保存菜单关联的对象
var saveMenuTag = function ( ) {

	var selectMenuId  = getTreeTableActiveId();

	// 获取勾选住的用户标识
	var tagIds = getDataTableSelectData ();

	var roleId = getZtreeSelectedId("tagRoleTree");

	var msg = "";
	var roleName = getZtreeSelectedName("tagRoleTree");
	var menuName = getTreeTableActiveName();

	// 角色和对象都为空时, 清除该菜单的关联关系
	if ( $.trim(tagIds) == "" && $.trim(roleId) == "" ) {
//		msg  = "确定清除菜单【" + menuName + "】所有角色的关联对象?";
		lwalert("tipModal", 2, "确定清除菜单【" + menuName + "】所有角色的关联对象?","isSureSaveTag()");
//		if (confirm(msg)) {
//			ajaxSaveMenuTag(selectMenuId, tagIds, roleId);
//		}

	} else if ($.trim(tagIds) == "" && $.trim(roleId) != "") {

//		msg  = "确定清除菜单【" + menuName + "】角色【"+roleName+"】 的关联对象?";
		lwalert("tipModal", 2, "确定清除菜单【" + menuName + "】角色【"+roleName+"】 的关联对象?","isSureSaveMenu()");
//		if (confirm(msg)) {
//			ajaxSaveMenuTag(selectMenuId, tagIds, roleId);
//		}

	} else {
		ajaxSaveMenuTag(selectMenuId, tagIds, roleId);
	}

}
function isSureSaveMenu(){

	var selectMenuId  = getTreeTableActiveId();

	// 获取勾选住的用户标识
	var tagIds = getDataTableSelectData ();

	var roleId = getZtreeSelectedId("tagRoleTree");
	ajaxSaveMenuTag(selectMenuId, tagIds, roleId);
}
function isSureSaveTag(){

	var selectMenuId  = getTreeTableActiveId();

	// 获取勾选住的用户标识
	var tagIds = getDataTableSelectData ();

	var roleId = getZtreeSelectedId("tagRoleTree");
	ajaxSaveMenuTag(selectMenuId, tagIds, roleId);
}
var ajaxSaveMenuTag = function (selectMenuId, tagIds, roleId) {

	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/tag",
		data : {
			"method" : "saveMenuTag",
			"menuId" : selectMenuId,
			"tagIds" : tagIds,
			"roleId" : roleId
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);
			if(flag){

				if (text.status  == "true") {
	//				alert("操作成功!");
					lwalert("tipModal", 1, "操作成功!");
					$('#tagModal').modal('hide');
				} else {
	//				alert("操作失败!");
					lwalert("tipModal", 1, "操作失败!");
				}

			}
		}
	});

}

// 获取选中的DataTable
var getDataTableSelectData = function ( ) {

	var str = "";

    // 拼接选中的checkbox
    $( "input[name='checkList']:checked" ).each( function ( i, o ) {
    	str += $(this).val();
    	str += ",";
    });

    if (str.length > 0) {

    	str = str.substr(0, str.length - 1);
    }

    return str;

}

//获取选中的treeGrid 的名称
var getTreeTableActiveName= function (  ) {

	var result = "";

	var node = $("#menuTreeTable").fancytree("getActiveNode");

    // 获取选中的用户标识
	if (node != null && node != "undefined" && typeof(node) != "undefined") {
		result = node.data.name;
	}

   	 return result;
}

// 获取选中的treeGrid 的id
var getTreeTableActiveId= function (  ) {

	var result = "";

	var node = $("#menuTreeTable").fancytree("getActiveNode");

    // 获取选中的用户标识
	if (node != null && node != "undefined" && typeof(node) != "undefined") {
		result = node.data.menuid;
	}

   	 return result;
}

// 获取选择的层级
var getTreeTableActiveLevels = function ( ) {

	var result = "";

	var node = $("#menuTreeTable").fancytree("getActiveNode");

    // 获取选中的用户标识
	if (node != null && node != "undefined" && typeof(node) != "undefined") {
		result = node.data.levels;
	}

   	 return result;

}

//获取checkbox选中的treeGrid 的层级标识
var getTreeTableSelectedLevels= function (  ) {

    var str = '';

    // 拼接选中的checkbox
	var tree = $("#menuTreeTable").fancytree("getTree");

	var nodes = tree.getSelectedNodes();

	if ( nodes.length > 0 ) {

		for ( var i = 0; i < nodes.length ; i++ ) {
			str += nodes[i].data.levels + ",";
		}

	}

	return str;
}

var getZtreeSelectedName = function (zTreeId) {

	var result = "";

	var zTree = $.fn.zTree.getZTreeObj(zTreeId);
	var nodes = zTree.getCheckedNodes(true);

	if ( nodes == null || nodes.length != 1 ) {
		result = false;
		return result;
	}

	result = nodes[0].rolename

	return result;
}

var getZtreeSelectedId = function (zTreeId) {

	var checkRoleIds = "";

	var zTree = $.fn.zTree.getZTreeObj(zTreeId);
	var nodes = zTree.getCheckedNodes(true);

	if ( nodes == null || nodes.length != 1 ) {
		return checkRoleIds;
	}

	checkRoleIds += nodes[0].roleid

	return checkRoleIds;
}

var getzTreeSelectedIds = function (zTreeId) {

	var checkRoleIds = "";

	var zTree = $.fn.zTree.getZTreeObj(zTreeId);
	var nodes = zTree.getCheckedNodes(true);

	if ( nodes.length == 0 ) {
		return checkRoleIds;
	}

	for (var i = 0; i < nodes.length; i++) {
		checkRoleIds += nodes[i].roleid +",";
	}

	return checkRoleIds;

}

var menuAjax = function () {


}


//重新加载
function reloadMenuTreeTable () {


	$("#menuTreeTable").fancytree({
		source: {url: "../../../"+ln_project+"/menu?method=getMenuList", debugDelay: 10}

	});

}

// 给form赋值
var setFormValue = function (data) {

	resetFrom();

	var json = eval("(" + data + ")")

	  for (var item in json) {

		  if (item != "password") {
			  $("#" + item).val(json[item]);
			  if(item="type"){
				  items = new String(json[item]).split(",");
				  for(var i =0 ;i<items.length;i++){
					  $("input[id='" + items[i] + "']").prop("checked", true);
						$('#' + items[i]).addClass('row_selected');
				  }
			  }

		  }
	  }
}

// 格式化form数据
var  formatFormJson = function  (formData) {

	var reg=/,$/gi;

	var data = "{";

	for (var i = 0; i < formData.length; i++) {
		if(formData[i].name=="type"){
			var str='';
			$('input[name="type"]:checked').each(function(){
				str+=$(this).val()+",";

				});
			formData[i].value=str.substring(0,str.length-1);
		}

		data += "\"" +formData[i].name +"\" : \""+formData[i].value+"\",";

	}

	data = data.replace(reg,"");

	data += "}";

	return data;
}

// 初始化时间
var initTimePick = function  (timeId) {
    $( "#" + timeId ).datetimepicker ( {
    	    language:  'zh-CN',
		    weekStart: 7,
		    todayBtn:  1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			minView: 2,
			forceParse: 0,
			format: 'yyyy-mm-dd'
    } );
}

/**
 * 重置表单
 */
var resetFrom = function ( ) {
    $( '#menuForm' ).each( function ( index ) {
        $('#menuForm')[index].reset( );
    });
    //重置表单验证
    $("#menuForm").data('bootstrapValidator').resetForm();

}

function queryTypeList() {

	$.ajax({
		type : "get",
		url : "../../../"+ln_project+"/menu",
		data : {
			method : "queryTypeList",
			conditions : "{}"
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			  setType(data.codeMap);

			}
		},
		error : function(data) {
		}
	});
}

var setType = function(data) {

	var html = "";
	for ( var i in data) {
		html += data[i].codevalue+":<input type='checkbox' name='type' value=" + data[i].codenum + " id=" + data[i].codenum + "  class='regular-checkbox'/><label for='" + data[i].codenum + "'></label>&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp";
	}
	$("#type").html(html);
}


function initBootstrapValidator( ) {
	$('#menuForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					name : {
						validators : {
							notEmpty : {
								message : '请输入菜单名称'
							}
						}
					}
				}
			})
}

var initRoleTree = function(opeMethod){

	var menuId = getTreeTableActiveId( );

	 $.fn.zTree.init($("#tree"),  {
		 check : {
	            enable : true,
	            chkStyle :"checkbox",
	            chkboxType : { "Y": "s", "N": "s" }
	        },
	        async: {
	        	enable : true,
	        	url : "../../../"+ln_project+"/menu?method="+opeMethod ,
	        	autoParam : ["levels"],
	        	otherParam : {"menuId" : menuId}
	        },
	        view: {

	            dblClickExpand: false,
	            showLine: true,
	            selectedMulti: false
	        },
	        data: {
	        	key: { name : "rolename" },
	            simpleData : {
	                enable : true,
	                idKey : "roleid",
	                pIdKey :  "pid",
	                rootPId : ""
	            }
	        },
	        callback: {
/*	            beforeClick: function(treeId, treeNode) {
	                var zTree = $.fn.zTree.getZTreeObj("tree");
	                if (treeNode.isParent) {
	                    zTree.expandNode(treeNode);
	                    return false;
	                }
	            },*/
	            onAsyncSuccess: onAsyncSuccess,onClick:onClick
	      }
	});

}
