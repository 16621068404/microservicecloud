// 操作方法, 新增或者修改
var ope = "add";

// 新增标题
var addTitle = "新增角色";

// 修改标题
var updateTitle = "修改角色";

// 数据table
var oTable;

var clicktime = new Date();

var compid = "";
var compid1 = "";
$(function() {

	// 初始化对象
	com.leanway.loadTags();

	// 公司ID为空时，显示出关联企业
	var cId = parent.window.compId;

	if (cId == null || $.trim(cId) == "" || cId == undefined
			|| typeof (cId) == "undefined") {
		$("#comFun").show();
		// 初始化下拉框
		com.leanway.initSelect2("#searchCompanyValue", "../../../" + ln_project
				+ "/role?method=getCompanyBySearch", "企业名称");

		// compid = $("#searchCompanyValue").find("option:selected").val();
		// compid = $("#compid").val();
		// var compid = '8c09cbe7-5773-4112-85a1-b1e19cb6e91d';
		// alert(compid);
		// 初始化下拉框

	} else {
		$("#comFun").hide();
		// $("#companySelect2").remove();
		$("#searchCompanyValue").hide();
		// 获取前一个下拉框里面的值

		// 初始化下拉框
		com.leanway.initSelect2("#searchRolesValue", "../../../" + ln_project
				+ "/role?method=getRolesBySearch", "角色名称");
	}

	// 初始化TreeGrid
	initTreetable();

	// 保存按钮绑定事件
	$("#saveRole").click(saveRole);

	// 保存角色关联用户
	$("#saveRoleUser").click(saveRoleUser);

	// 保存角色关联菜单
	$("#saveRoleMenu").click(saveRoleMenu);

	// 关联企业
	$("#saveRoleCompany").click(saveRoleCompany);

	// 表单验证
	initBootstrapValidator();

	// 全选
	$("#checkAll").on(
			"click",
			function() {
				if ($(this).prop("checked") === true) {
					$("input[name='checkList']").prop("checked",
							$(this).prop("checked"));
					$('#grid-data tbody tr').addClass('row_selected');
				} else {
					$("input[name='checkList']").prop("checked", false);
					$('#grid-data tbody tr').removeClass('row_selected');
				}
			});

	$("#startTime").datetimepicker({
		language : 'zh-CN',
		weekStart : 7,
		todayBtn : 1,
		autoclose : 1,
		todayHighlight : 1,
		startView : 2,
		minView : 2,
		forceParse : 0,
		format : 'yyyy-mm-dd'

	});

	$("#deadTime").datetimepicker({
		language : 'zh-CN',
		weekStart : 7,
		todayBtn : 1,
		autoclose : 1,
		todayHighlight : 1,
		startView : 2,
		minView : 2,
		forceParse : 0,
		format : 'yyyy-mm-dd'

	});

	$("#searchCompanyValue").on(
			"select2:select",
			function(e) {
				compid1 = $("#searchCompanyValue").find("option:selected")
						.val();
				com.leanway.initSelect2("#searchRolesValue", "../../../"
						+ ln_project + "/role?method=getRolesBySearch&compid="
						+ compid1, "角色名称");
				getRoleTreeBySearch();

			});
	$("#searchRolesValue").on("select2:select", function(e) {
		getRoleTreeBySearch();
	});

});

glyph_opts = {
	map : {
		doc : "glyphicon glyphicon-file",
		docOpen : "glyphicon glyphicon-file",
		checkbox : "glyphicon glyphicon-unchecked",
		checkboxSelected : "glyphicon glyphicon-check",
		checkboxUnknown : "glyphicon glyphicon-share",
		dragHelper : "glyphicon glyphicon-play",
		dropMarker : "glyphicon glyphicon-arrow-right",
		error : "glyphicon glyphicon-warning-sign",
		expanderClosed : "glyphicon glyphicon-plus-sign",
		expanderLazy : "glyphicon glyphicon-plus-sign", // glyphicon-expand
		expanderOpen : "glyphicon glyphicon-minus-sign", // glyphicon-collapse-down
		folder : "glyphicon glyphicon-folder-close",
		folderOpen : "glyphicon glyphicon-folder-open",
		loading : "glyphicon glyphicon-refresh"
	}
};

// 初始化数据表格
var initTreetable = function() {

	$("#select2-searchCompanyValue-container").html("");
	$("#select2-searchRolesValue-container").html("");

	$("#treetable").fancytree(
			{
				extensions : [ "dnd", "edit", "glyph", "table" ],
				checkbox : true,
				selectMode : 2,
				dnd : {
					focusOnClick : false,
					dragStart : function(node, data) {
						return true;
					},
					dragEnter : function(node, data) {
						return true;
					},
					dragDrop : function(node, data) {
						data.otherNode.copyTo(node, data.hitMode);
					}
				},
				glyph : glyph_opts,
				source : {
					url : "../../../../" + ln_project
							+ "/role?method=getRolesList",
					debugDelay : 10
				},
				table : {
					checkboxColumnIdx : 1,
					nodeColumnIdx : 2
				},
				activate : function(event, data) {

					/*
					 * var ftnode = data.node.tr.ftnode; var tr = ftnode.tr;
					 * 
					 * if (!ftnode.selected) {
					 * $(tr).addClass("fancytree-selected");
					 * $(tr).addClass("fancytree-partsel");
					 * $(tr).find("td").eq(1).find("span").removeClass("glyphicon-unchecked");
					 * $(tr).find("td").eq(1).find("span").addClass("glyphicon-check");
					 * ftnode.selected = true; } else {
					 * $(tr).removeClass("fancytree-selected");
					 * $(tr).removeClass("fancytree-partsel");
					 * $(tr).find("td").eq(1).find("span").addClass("glyphicon-unchecked");
					 * $(tr).find("td").eq(1).find("span").removeClass("glyphicon-check");
					 * ftnode.selected = false; }
					 */

					// $(tr).find("td").eq(1).find("span").hasClass("glyphicon-check");
					// $(node).find(">td").eq(1).find("span").addClass("glyphicon-check");
					// $tdList = $(node.tr).find(">td");
					// $tdList.eq(1).prop("checked", true);
				},
				click : function(event, data) {
					/*
					 * var ftnode = data.node.tr.ftnode; var tr = ftnode.tr;
					 * 
					 * if (!ftnode.selected) {
					 * $(tr).addClass("fancytree-selected");
					 * $(tr).addClass("fancytree-partsel");
					 * $(tr).addClass("fancytree-active");
					 * 
					 * $(tr).find("td").eq(1).find("span").removeClass("glyphicon-unchecked");
					 * $(tr).find("td").eq(1).find("span").addClass("glyphicon-check");
					 * ftnode.selected = true; } else {
					 * $(tr).removeClass("fancytree-active");
					 * $(tr).removeClass("fancytree-selected");
					 * $(tr).removeClass("fancytree-partsel");
					 * $(tr).find("td").eq(1).find("span").addClass("glyphicon-unchecked");
					 * $(tr).find("td").eq(1).find("span").removeClass("glyphicon-check");
					 * ftnode.selected = false; }
					 */
				},
				lazyLoad : function(event, data) {

					data.result = {
						url : "../../../../" + ln_project
								+ "/role?method=getRolesList&levels="
								+ data.node.data.levels,
						debugDelay : 10
					};

				},
				renderColumns : function(event, data) {

					var node = data.node, $tdList = $(node.tr).find(">td");
					$tdList.eq(0).text(node.getIndexHier());
					$tdList.eq(3).text(node.data.compname);
				}
			});

}

// 显示用户
var showUser = function() {

	var selectRole = getTreeGridActiveData();

	if (selectRole.length > 0) {

		// 弹出modal
		$('#userGrid').modal({
			backdrop : 'static',
			keyboard : false
		});

		// 初始化用户Grid
		if (oTable == null || oTable == "undefined"
				|| typeof (oTable) == "undefined") {
			oTable = initTable(selectRole);
		} else {

			// oTable.destroy();
			// oTable = initTable(selectRole);
			oTable.ajax.url(
					"../../../../" + ln_project
							+ "/user?method=getUserList&paginate=false&roleId="
							+ selectRole).load();

			// oTable.fnReloadAjax( "" + selectRole );
		}

	} else {
		// alert("请选择角色进行用户关联!");
		lwalert("tipModal", 1, "请选择角色进行用户关联！");
	}

}

// 保存用户关联
var saveRoleUser = function() {

	// 获取勾选住的用户标识
	var userIds = getDataTableSelectData();

	// 获取勾选住的角色标识
	var roleIds = getTreeGridActiveData();

	if (userIds == null || $.trim(userIds) == "") {
		lwalert("tipModal", 2, "确定清空角色关联的用户吗?", "isSureDeleteSaveUser()");
		// if (confirm("确定清空角色关联的用户吗?")) {
		// ajaxSaveRoleUser(userIds, roleIds);
		// }

	} else {
		ajaxSaveRoleUser(userIds, roleIds);
	}

}

function isSureDeleteSaveUser() {

	var userIds = getDataTableSelectData();

	// 获取勾选住的角色标识
	var roleIds = getTreeGridActiveData();
	ajaxSaveRoleUser(userIds, roleIds);
}
var ajaxSaveRoleUser = function(userIds, roleIds) {

	$.ajax({
		type : "POST",
		url : "../../../../" + ln_project + "/role?method=saveRoleUser",
		data : {
			"userIds" : userIds,
			"roleIds" : roleIds
		},
		dataType : "json",
		async : false,
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {

				if ($.trim(text) == "1") {
					$('#userGrid').modal('hide');
				} else {
					// alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");
				}

			}

		}
	});

}

// 获取选中的DataTable
var getDataTableSelectData = function() {

	var str = "";

	// 拼接选中的checkbox
	$("input[name='checkList']:checked").each(function(i, o) {
		str += $(this).val();
		str += ",";
	});

	if (str.length > 0) {

		str = str.substr(0, str.length - 1);
	}

	return str;

}

// 获取选中的treeGrid 的名称
var getTreeTableActiveName = function() {

	var result = "";

	var node = $("#treetable").fancytree("getActiveNode");

	// 获取选中的用户标识
	if (node != null && node != "undefined" && typeof (node) != "undefined") {
		result = node.data.rolename;
	}

	return result;
}

// 获取选中的treeGrid
var getTreeGridActiveData = function() {

	var roleId = "";

	var node = $("#treetable").fancytree("getActiveNode");

	// 获取选中的用户标识
	if (node != null && node != "undefined" && typeof (node) != "undefined") {
		roleId = node.data.roleid;
	}

	return roleId;

}

// 获取勾选住的TreeGrid
var getTreeGridCheckedData = function() {

	var str = "";

	// 拼接选中的checkbox
	var tree = $("#treetable").fancytree("getTree");

	var nodes = tree.getSelectedNodes();

	if (nodes.length > 0) {

		for (var i = 0; i < nodes.length; i++) {
			str += nodes[i].data.roleid + ",";
		}

	}

	if (str.length > 0) {

		str = str.substr(0, str.length - 1);

	}

	return str;
}

// 新增用户
var addRole = function() {

	ope = "add";

	// 切换标题
	$("#myModalLabel").html(addTitle);

	// 清空表单
	resetFrom();

	$('#myModal').modal({
		backdrop : 'static',
		keyboard : false
	});

}

// 显示编辑数据
var showEditRole = function() {

	var levels = "";
	// levels = node.data.levels;

	var node = $("#treetable").fancytree("getActiveNode");

	if (node != null && node != "undefined" && typeof (node) != "undefined") {

		// 获取选中的用户标识
		var roleId = node.data.roleid;

		ope = "update";

		$("#myModalLabel").html(updateTitle);

		// 获取数据
		getRole(roleId);

	} else {
		// alert('请选择角色后修改!');
		lwalert("tipModal", 1, "请选择角色后修改！");
	}
}

// 加载角色数据
var getRole = function(roleId) {

	$.ajax({
		type : "POST",
		url : "../../../../" + ln_project + "/role?method=getRole",
		data : {
			"roleId" : roleId
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {

				// 表单赋值
				setFormValue(text, roleId);

				$('#myModal').modal({
					backdrop : 'static',
					keyboard : false
				});
				// 显示
				// $("#myModal").modal("show");

			}
		}
	});

}

var setFormValue = function(data, userId) {

	resetFrom();

	var json = eval("(" + data + ")")

	for ( var item in json) {

		if (item != "password") {
			$("#" + item).val(json[item]);
		}
	}

	/*
	 * $("#userName").val( json.userName); $("#area").val( json.area);
	 * $("#mobile").val( json.mobile); $("#phone").val( json.phone);
	 * $("#qq").val( json.qq); $("#wechat").val( json.wechat); $("#weibo").val(
	 * json.weibo); $("#startTime").val( json.startTime); $("#endTime").val(
	 * json.endTime); $("#userId").val(userId);
	 */
}

var deleteRole = function() {

	var str = '';

	// 拼接选中的checkbox
	var tree = $("#treetable").fancytree("getTree");

	var nodes = tree.getSelectedNodes();

	if (nodes.length > 0) {

		for (var i = 0; i < nodes.length; i++) {
			str += nodes[i].data.levels + ",";
		}

	}

	if (nodes.length == 1) {
		lwalert("tipModal", 2, "确定要删除选中的角色吗！", "isSureDelete()");

		// var ids = str.substr(0, str.length - 1);
		//
		// if (confirm("确定要删除选中的角色吗?")) {
		// deleteAjax(ids);
		// }

	} else {
		// alert("至少选择一条记录操作");
		lwalert("tipModal", 1, "至少选择一条记录操作！");
	}

}

function isSureDelete() {

	var str = '';

	// 拼接选中的checkbox
	var tree = $("#treetable").fancytree("getTree");

	var nodes = tree.getSelectedNodes();

	if (nodes.length > 0) {

		for (var i = 0; i < nodes.length; i++) {
			str += nodes[i].data.levels + ",";
		}

	}
	var ids = str.substr(0, str.length - 1);
	var compid = nodes[0].data.compid;
	deleteAjax(ids, compid);
}
// 删除Ajax
var deleteAjax = function(levels, compid) {

	$.ajax({
		type : "POST",
		url : "../../../../" + ln_project + "/role?method=delete",
		data : {
			"levels" : levels,
			"compid" : compid
		},
		dataType : "json",
		async : false,
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {

				if ($.trim(text) == "1") {

					$("#treetable").fancytree(
							{

								source : {
									url : "../../../../" + ln_project
											+ "/role?method=getRolesList",
									debugDelay : 10
								}

							});
				} else {
					// alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");
				}

			}

		}
	});

}

var saveRole = function() {

	var roleId = $("#roleId").val();
	var roleName = $("#roleName").val();
	var startTime = $("#startTime").val();
	var deadTime = $("#deadTime").val();

	var levels = "";

	var node = $("#treetable").fancytree("getActiveNode");
	var compid = "";
	if (node != null && node != "undefined" && typeof (node) != "undefined") {
		levels = node.data.levels;
		compid = node.data.compid;
	}

	// 检测角色名是否已存在
	var canSubmit = checkRoleIsExist(roleName, roleId);
	if (!canSubmit) {
		// alert("角色名已经存在, 请重新输入!");
		lwalert("tipModal", 1, "角色名已存在，请重新输入！");
		return;
	}

	var form = $("#roleForm").serializeArray();
	var formData = formatFormJson(form);
	// 提交前先验证
	$("#roleForm").data('bootstrapValidator').validate();
	// 返回true、false
	if ($('#roleForm').data('bootstrapValidator').isValid()) {

		$.ajax({
			type : "POST",
			url : "../../../../" + ln_project + "/role?method=" + ope,
			data : {
				"formData" : formData,
				"levels" : levels,
				"compid" : compid
			},
			dataType : "json",
			async : false,
			success : function(text) {

				var flag = com.leanway.checkLogind(text);

				if (flag) {

					if ($.trim(text) == "1") {

						closeForm();
						resetFrom();

						$("#treetable").fancytree(
								{
									source : {
										url : "../../../../" + ln_project
												+ "/role?method=getRolesList",
										debugDelay : 10
									}
								});

					} else {
						// alert("操作失败");
						lwalert("tipModal", 1, "操作失败！");
					}

				}

			}
		});
	}

}

// 检测用户是否存在
var checkRoleIsExist = function(userName, userId) {

	var canSubmit = false;

	$.ajax({
		type : "POST",
		url : "../../../../" + ln_project + "/role?method=checkRoleIsExist",
		data : {
			"userName" : userName,
			"userId" : userId
		},
		dataType : "json",
		async : false,
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {

				if ($.trim(text) == "1") {
					canSubmit = true;
				}

			}
		}
	});

	return canSubmit;
}

// 初始化数据表格
var initTable = function(roleId) {

	var table = $('#grid-data')
			.DataTable(
					{
						"ajax" : "../../../../"
								+ ln_project
								+ "/user?method=getUserList&paginate=false&roleId="
								+ roleId,
						/* "iDisplayLength" : "10", */
						'bPaginate' : false,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"bProcessing" : true,
						"bServerSide" : false,
						'searchDelay' : "5000",
						"columns" : [ {
							"data" : "userId"
						}, {
							"data" : "userName"
						}, {
							"data" : "employeeName"
						}, {
							"data" : "mobile"
						}, {
							"data" : "phone"
						}, {
							"data" : "startTime"
						}, {
							"data" : "endTime"
						} ],
						"aoColumns" : [
								{
									"mDataProp" : "userId",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										// $(nTd).html("<input type='checkbox'
										// name='checkList' value='" + sData +
										// "'>");
										$(nTd)
												.html(
														"<div id='stopPropagation"
																+ iRow
																+ "'>"
																+ "<input class='regular-checkbox' type='checkbox' id='"
																+ sData
																+ "' name='checkList' value='"
																+ sData
																+ "'><label for='"
																+ sData
																+ "'></label> </div>");
										com.leanway.columnTdBindSelect(nTd);
									}
								}, {
									"mDataProp" : "userName"
								}, {
									"mDataProp" : "employeeName"
								}, {
									"mDataProp" : "mobile"
								}, {
									"mDataProp" : "phone"
								}, {
									"mDataProp" : "startTime"
								}, {
									"mDataProp" : "endTime"
								}

						],
						"fnCreatedRow" : function(nRow, aData, iDataIndex) {

							if (aData.hasRole == "true") {
								$(nRow).addClass("row_selected");
								$(nRow).find('td').eq(0).find(
										"input[name='checkList']").prop(
										"checked", true)
							}

							/*
							 * //add selected class $(nRow).click(function () {
							 * 
							 * if ($(this).hasClass('row_selected')) {
							 * $(this).removeClass('row_selected');
							 * $(this).find('td').eq(0).find("input[name='checkList']").prop("checked",
							 * false) } else { //
							 * oTable.$('tr.row_selected').removeClass('row_selected');
							 * $(this).addClass('row_selected'); //
							 * $("input[name='checkList']").prop("checked",
							 * false);
							 * $(this).find('td').eq(0).find("input[name='checkList']").prop("checked",
							 * true) }
							 * 
							 * });
							 */
						},
						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {
							// 点击事件
							com.leanway.dataTableClickMoreSelect("grid-data",
									"checkList", true, oTable, undefined,
									undefined, undefined);
						},

					}).on('xhr.dt', function(e, settings, json) {
				com.leanway.checkLogind(json);
			});

	// table.columns.adjust().draw();

	return table;

}

// 弹出菜单模态框
var showMenu = function() {
	// 获取选中的角色标识
	var roleId = getTreeGridActiveData();

	if (roleId != null && roleId.length > 0) {
		// 弹出modal
		$('#menuTree').modal({
			backdrop : 'static',
			keyboard : false
		});

		$.fn.zTree.init($("#menuZtree"), {
			check : {
				enable : true,
				chkStyle : "checkbox",
				chkboxType : {
					"Y" : "ps",
					"N" : "s"
				}
			},
			async : {
				enable : true,
				url : "../../../../" + ln_project
						+ "/menu?method=getMenuTreeList",
				autoParam : [ "levels" ],
				otherParam : {
					"roleId" : roleId
				}
			},
			view : {

				dblClickExpand : false,
				showLine : true,
				selectedMulti : false
			},
			data : {
				key : {
					name : "name"
				},
				simpleData : {
					enable : true,
					idKey : "roleid",
					pIdKey : "pid",
					rootPId : ""
				}
			},
			callback : {
				/*
				 * beforeClick: function(treeId, treeNode) { var zTree =
				 * $.fn.zTree.getZTreeObj("tree"); if (treeNode.isParent) {
				 * zTree.expandNode(treeNode); return false; } },
				 */
				onAsyncSuccess : onAsyncSuccess,
				onClick : onClick
			}
		});

	} else {
		// alert("请选择一条角色进行菜单关联!");
		lwalert("tipModal", 1, "请选择一条角色进行菜单关联！");
		return;
	}

}

// 选中树节点
function onClick(e, treeId, treeNode) {
	if (treeNode.checked) {
		$.fn.zTree.getZTreeObj(treeId).checkNode(treeNode, false, false);
	} else {
		$.fn.zTree.getZTreeObj(treeId).checkNode(treeNode, true, true);
	}

}

// 树形节点一步加载完成
function onAsyncSuccess(event, treeId, treeNode, msg) {

	try {

		var zTree = $.fn.zTree.getZTreeObj("menuZtree");

		asyncNodes(zTree.getNodes());

		if (typeof (treeNode) == "undefined") {

			var zTree = $.fn.zTree.getZTreeObj(treeId);
			var rootNode = zTree.getNodes();

			if (rootNode != null && rootNode.length > 0) {
				for (var i = 0; i < rootNode.length; i++) {
					zTree.selectNode(rootNode[i]);
					zTree.expandNode(rootNode[i], true);
				}
			}
		}
	} catch (e) {
	}
}

function asyncNodes(nodes) {
	if (!nodes)
		return;

	var zTree = $.fn.zTree.getZTreeObj("menuZtree");
	for (var i = 0, l = nodes.length; i < l; i++) {

		if (nodes[i].isParent && nodes[i].zAsync) {
			asyncNodes(nodes[i].children);
		} else {
			zTree.reAsyncChildNodes(nodes[i], "refresh", true);
		}
	}
}

var saveRoleMenu = function() {

	// 获取选中的角色标识
	var roleId = getTreeGridActiveData();

	var checkMenuIds = "";

	var zTree = $.fn.zTree.getZTreeObj("menuZtree");
	var nodes = zTree.getCheckedNodes(true);

	for (var i = 0; i < nodes.length; i++) {
		checkMenuIds += nodes[i].menuid + ",";
	}

	if (checkMenuIds == "") {
		var roleName = getTreeTableActiveName();
		lwalert("tipModal", 2, "确定清空角色【" + roleName + "】关联的菜单？",
				"isSureDeleteSave()");
		// if (confirm("确定清空角色【" + roleName + "】关联的菜单？")) {
		// ajaxSaveRoleMenu(roleId, checkMenuIds);
		// }

	} else {
		ajaxSaveRoleMenu(roleId, checkMenuIds);
	}

}

function isSureDeleteSave() {

	var roleId = getTreeGridActiveData();

	var checkMenuIds = "";

	var zTree = $.fn.zTree.getZTreeObj("menuZtree");
	var nodes = zTree.getCheckedNodes(true);

	for (var i = 0; i < nodes.length; i++) {
		checkMenuIds += nodes[i].menuid + ",";
	}
	ajaxSaveRoleMenu(roleId, checkMenuIds);
}
var ajaxSaveRoleMenu = function(roleId, menuIds) {

	$.ajax({
		type : "POST",
		url : "../../../../" + ln_project + "/menu?method=saveRoleMenu",
		data : {
			"roleId" : roleId,
			"menuIds" : menuIds
		},
		dataType : "json",
		async : false,
		success : function(text) {
			var flag = com.leanway.checkLogind(text);

			if (flag) {

				if ($.trim(text) == "1") {

					$('#menuTree').modal('hide');
				} else {
					// alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");
				}

			}

		}
	});

}

var showCompany = function() {

	// 获取选中的角色标识
	var roleId = getTreeGridActiveData();

	if (roleId == "" || roleId.length == 0) {
		// alert("请选择角色关联企业!");
		lwalert("tipModal", 1, "请选择角色关联企业！");
		return;
	}

	// 弹出modal
	$('#companyModal').modal({
		backdrop : 'static',
		keyboard : false
	});

	initCompanyTree(roleId);

}
var showForms = function() {
	// 获取选中的角色标识
	var roleId = getTreeGridActiveData();

	if (roleId == "" || roleId.length == 0) {
		// alert("请选择角色关联企业!");
		lwalert("tipModal", 1, "请选择角色！");
		return;
	}

	// 弹出modal
	$('#formsModal').modal({
		backdrop : 'static',
		keyboard : false
	});

	initFormsForm(roleId);

}
// 初始化公司树形结构
var initCompanyTree = function(roleId) {
	$.fn.zTree.init($("#companyTree"), {

		check : {
			enable : true,
			chkStyle : "radio",
			chkboxType : {
				"Y" : "p",
				"N" : "p"
			},
			radioType : "all"
		},
		async : {
			enable : true,
			url : "../../../../" + ln_project
					+ "/company?method=getCompanyDataForZtree",
			autoParam : [ "levels" ],
			otherParam : {
				"roleId" : roleId
			}
		},
		view : {

			dblClickExpand : false,
			showLine : true,
			selectedMulti : false
		},
		data : {
			key : {
				name : "compname"
			},
			simpleData : {
				enable : true,
				idKey : "compid",
				pIdKey : "pid",
				rootPId : ""
			}
		},
		callback : {
			/*
			 * beforeClick: function(treeId, treeNode) { var zTree =
			 * $.fn.zTree.getZTreeObj("tree"); if (treeNode.isParent) {
			 * zTree.expandNode(treeNode); return false; } },
			 */
			onAsyncSuccess : onAsyncSuccess,
			onClick : onClick
		}
	});
}

// 初始化公司树形结构
var initFormsForm = function(roleId) {
	// TODO 缺少后台代码
	$.ajax({
		type : "POST",
		url : "../../../../" + ln_project + "/menu?method=saveRoleMenu",
		data : {
			"roleId" : roleId,
			"menuIds" : menuIds
		},
		dataType : "json",
		async : false,
		success : function(text) {
			var flag = com.leanway.checkLogind(text);

			if (flag) {

				if ($.trim(text) == "1") {

					$('#menuTree').modal('hide');
				} else {
					// alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");
				}

			}

		}
	});
}
// 关联角色企业
var saveRoleCompany = function() {

	// 获取选中的角色标识
	var roleId = getTreeGridActiveData();
	var roleName = getTreeTableActiveName();

	var companyId = getZtreeSelectedId("companyTree");
	if (companyId == "") {
		lwalert("tipModal", 2, "确定清空部门【" + roleName + "】关联的企业？",
				"isSureDeleteSaveRole()");
		// if (confirm("确定清空部门【"+roleName+"】关联的企业？")) {
		// ajaxSaveRoleCompany(roleId, companyId);
		// }
	} else {
		ajaxSaveRoleCompany(roleId, companyId);
	}

}

// 关联角色表单
var saveRoleForms = function() {

	// 获取选中的角色标识
	var roleId = getTreeGridActiveData();
	var roleName = getTreeTableActiveName();

	var formsid = getZtreeSelectedId("companyTree");
	if (companyId == "") {
		lwalert("tipModal", 2, "确定清空部门【" + roleName + "】关联的企业？",
				"isSureDeleteSaveRole()");
		// if (confirm("确定清空部门【"+roleName+"】关联的企业？")) {
		// ajaxSaveRoleCompany(roleId, companyId);
		// }
	} else {
		ajaxSaveRoleForms(roleId, formsid);
	}

}

function isSureDeleteSaveRole() {

	// 获取选中的角色标识
	var roleId = getTreeGridActiveData();
	var roleName = getTreeTableActiveName();

	var companyId = getZtreeSelectedId("companyTree");
	ajaxSaveRoleCompany(roleId, companyId);
}

var ajaxSaveRoleCompany = function(roleId, companyId) {

	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/role",
		data : {
			"method" : "saveRoleCompany",
			"roleId" : roleId,
			"companyId" : companyId
		},
		dataType : "text",
		success : function(text) {

			var flag = com.leanway.checkLogind(text);
			if (flag) {

				text = text.replace(/"/g, '');

				if ($.trim(text) == "success") {

					$('#companyModal').modal('hide');

					// 刷新treeTable
					$("#treetable").fancytree(
							{
								source : {
									url : "../../../../" + ln_project
											+ "/role?method=getRolesList",
									debugDelay : 10
								}
							});

				} else {
					// alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");
				}

			}

		}
	});

}
var ajaxSaveRoleForms = function(roleId, formsid) {

	var url = "../../../../" + ln_project + "/";
	$.ajax({
		type : "post",
		url : url,
		data : {
			"method" : "saveRoleForms",
			"roleId" : roleId,
			"companyId" : formsid
		},
		dataType : "text",
		success : function(text) {
			var flag = com.leanway.checkLogind(text);
			if (flag) {

				text = text.replace(/"/g, '');

				if ($.trim(text) == "success") {

					$('#formsModal').modal('hide');

					// 刷新treeTable
					$("#treetable").fancytree(
							{
								source : {
									url : "../../../../" + ln_project
											+ "/role?method=getFormsList",
									debugDelay : 10
								}
							});

				} else {
					// alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");
				}

			}

		}
	});

}
var getZtreeSelectedId = function(zTreeId) {

	var compid = "";

	var zTree = $.fn.zTree.getZTreeObj(zTreeId);
	var nodes = zTree.getCheckedNodes(true);

	if (nodes == null || nodes.length != 1) {
		return compid;
	}

	compid = nodes[0].compid;

	return compid;
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

// 清空form
var clearForm = function() {

	$("#userName").val("");
	$("#password").val("");
	$("#area").val("");
	$("#phone").val("");
	$("#mobile").val("");
	$("#qq").val("");
	$("#weibo").val("");
	$("#wechat").val("");
	$("#startTime").val("");
	$("#endTime").val("");
	$("#userId").val("");

}

// 关闭modal
var closeForm = function() {
	$('#myModal').modal('hide');
}

/**
 * 重置表单
 */
function resetFrom() {
	$('#roleForm').each(function(index) {
		$('#roleForm')[index].reset();
	});
	// 重置表单验证
	$("#roleForm").data('bootstrapValidator').resetForm();
}

function initBootstrapValidator() {
	$('#roleForm').bootstrapValidator({
		excluded : [ ':disabled' ],
		fields : {
			roleName : {
				validators : {
					notEmpty : {
						message : '请输入角色名称'
					}
				}
			}
		}
	})
}

var getRoleTreeBySearch = function() {
	// 通过输入框中的内容来获取相应的树
	var searchRolesValue = $("#searchRolesValue").find("option:selected")
			.text();
	;

	var searchCompanyValue = $("#searchCompanyValue").find("option:selected")
			.text();

	// 然后得到相应的树

	$("#treetable")
			.fancytree(
					{
						extensions : [ "dnd", "edit", "glyph", "table" ],
						checkbox : true,
						selectMode : 1,
						dnd : {
							focusOnClick : false,
							dragStart : function(node, data) {
								return true;
							},
							dragEnter : function(node, data) {
								return true;
							},
							dragDrop : function(node, data) {
								data.otherNode.copyTo(node, data.hitMode);
							}
						},
						glyph : glyph_opts,
						source : {
							url : "../../../../"
									+ ln_project
									+ "/role?method=getRolesListBySelect2&searchRolesValue="
									+ searchRolesValue + "&searchCompanyValue="
									+ searchCompanyValue,
							debugDelay : 10
						},
						table : {
							checkboxColumnIdx : 1,
							nodeColumnIdx : 2
						},
						// activate: function( event, data ) {
						//
						//
						//
						// },
						click : function(event, data) {

						},
						lazyLoad : function(event, data) {

							data.result = {
								url : "../../../../"
										+ ln_project
										+ "/role?method=getRolesListBySelect2&levels="
										+ data.node.data.levels,
								debugDelay : 10
							};

						},
						renderColumns : function(event, data) {

							var node = data.node, $tdList = $(node.tr).find(
									">td");
							$tdList.eq(0).text(node.getIndexHier());
							$tdList.eq(3).text(node.data.compname);
						}
					});

}
