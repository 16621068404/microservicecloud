 var clicktime = new Date();
 var templateTable;


 var employeeTable;

 var userTable;

$(function(){

	// 对象
	com.leanway.loadTags();

	com.leanway.formReadOnly("templateForm");
	// 初始化模版类型
	initTemplateType();

	userTable = initUserTable();
	// 模版Table
	templateTable = initTemplateTable();

	com.leanway.dataTableClickMoreSelect("templateTable", "checkList",false, templateTable, undefined, loadTemplateData, undefined);

	com.leanway.enterKeyDown("searchValue", queryTemplateCatlate);
//	employeeTable = initEmployee();
	com.leanway.enterKeyDown("searchEmployee", searchEmployee);
});

var queryTemplateCatlate = function ( ) {

	// 关键字
	var searchValue = $("#searchValue").val();

	templateTable.ajax.url("../../../"+ln_project+"/template?method=queryTemplateCatlate&searchValue=" + searchValue).load();
}

var addTemplateCatlate = function ( ) {
	com.leanway.dataTableUnselectAll("templateTable", "checkList");
	removeReadOnly();
	resetForm();
	$("#catlateid").val("");
	$("#templateUploadDiv").show();
	$("#fullFileName").html("未选择文件");
	$("#fileMsg").html("");
}

var updateTemplateCatlate = function ( ) {

	var ids = com.leanway.getCheckBoxData(1, "templateTable", "checkList");

	if (ids.length == 0) {

		lwalert("tipModal", 1, "请点击要修改的模版！");
		return;

	} else if (ids.split(",").length > 1) {

		lwalert("tipModal", 1, "只能选择一条模版进行修改！");
		return;

	} else {
		removeReadOnly();
	}

}

var saveTemplate = function ( ) {

	// 表单数据
	var formObj = $("#templateForm").serializeArray();
	var formData = formatFormJson(formObj);

	// 创建FormData对象
	var data = new FormData();
	// 为FormData对象添加数据
	var fileObj = document.getElementById("path").files[0];

	data.append("file", fileObj);
	data.append("formData", formData);
	data.append("method", "saveTemplate");

	// 发送数据
	$.ajax({
		url : "../../../../"+ln_project+"/template",
		type : 'post',
		data : data,
		dataType : 'json',
		cache : false,
		contentType : false,
		processData : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				if (data.status == 'success') {
					lwalert("tipModal", 1, "保存成功！");
					templateTable.ajax.reload();
				} else {
					lwalert("tipModal", 1, data.info);
				}
			}
		},
		error : function() {
			lwalert("tipModal", 1, "网络或系统异常！");
		}
	});

}


/**
 * 删除模版版本
 *
 * type 1:当前，2：跨页
 *
 */
var deleteTemplate= function ( type ) {

	if (type == undefined || typeof(type) == "undefined") {
		type = 1;
	}

	var ids = com.leanway.getCheckBoxData(type, "templateTable", "checkList");

	if (ids.length == 0) {

		lwalert("tipModal", 1, "请选择要删除的模版!");
		return;

	} else {

		var msg = "确定删除选中的" + ids.split(",").length + "条模版数据?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	}

}

function isSureDelete( type) {

	var ids = com.leanway.getCheckBoxData(type, "deviceCalendar", "checkList");

	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/template",
		data : {
			"method" : "deleteTemplate",
			"catlateIds" : ids
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if ( flag ) {

				if (text.status == "success") {
					templateTable.ajax.reload();
				}

				lwalert("tipModal", 1, text.info);

			}

		},
		error : function() {
			lwalert("tipModal", 1, "网络或系统异常！");
		}
	});
}

var initTemplateTable = function ( ) {

	var table = $('#templateTable').DataTable(
			{
				"ajax" : "../../../"+ln_project+"/template?method=queryTemplateCatlate",
				/* "iDisplayLength" : "10", */
				'bPaginate' : true,
				"bDestory" : true,
				"bRetrieve" : true,
				"bFilter" : false,
				"scrollX" : true,
				"bSort" : false,
				"bProcessing" : true,
				"bServerSide" : true,
				"aoColumns" : [
						{
							"mDataProp" : "catlateid",
							"fnCreatedCell" : function(nTd, sData,
									oData, iRow, iCol) {
								// $(nTd).html("<div
								// id='stopPropagation" + iRow +
								// "'><input type='checkbox'
								// name='checkList' value='" + sData +
								// "'></div>");
								$(nTd)
										.html(
												"<div id='stopPropagation"
														+ iRow
														+ "'>"
														+ "<input class='regular-checkbox' type='checkbox' id='"
														+ sData
														+ "' name='checkList' value='"
														+ sData
														+ "'><label  for='"
														+ sData
														+ "'></label>");
								com.leanway.columnTdBindSelect(nTd);
							}
						},
						{
							"mDataProp" : "templatename"
						},
						{
							"mDataProp" : "typename"
						},
						{
							"mDataProp" : "version"
						},{
							"mDataProp" : "url",
							"fnCreatedCell" : function(nTd, sData,oData, iRow, iCol) {
								var catlateid = oData.catlateid;
								$(nTd).html("<a  style=\"cursor:pointer;\" onclick=\"viewTemplate('" + sData + "','" + catlateid + "');\"  id=\"viewTemplate" + iRow+ "\"><i class='fa fa-eye'></i>预览模版</a>");
							}
						}
					 ],
				"fnCreatedRow" : function(nRow, aData, iDataIndex) {

				},
				"oLanguage" : {
					"sUrl" : "../../../jslib/datatables/zh-CN.txt"
				},
				"buttons" : [ 'colvis' ],
				"sDom" : "Bfrtip",
				"fnDrawCallback" : function(data) {
					$("#checkAll").prop("checked", false);
					com.leanway.getDataTableFirstRowId("templateTable", loadTemplateData,"false","checkList");
				}

			}).on('xhr.dt', function(e, settings, json) {
				com.leanway.checkLogind(json);
				table.columns.adjust();
			});
	return table;
}

/**
 * 预览模版
 */
var viewTemplate = function ( data, catlateId ) {
	data = data + "&pageflag=3&catlateid=" + catlateId;
	parent.window.addTabs({'id':'viewTemplate','title':'模版预览','url':'template/templaterecords.html','close':'true','pageId' : '99f8e3af-45c3-4f12-9e69-48d565dfffee','flagval':data });
}

/**
 * 加载模版数据
 */
var loadTemplateData = function (catlateId) {

	// 隐藏上传按钮
	$("#templateUploadDiv").hide();

	com.leanway.formReadOnly("templateForm");

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/template",
		data : {
			"method" : "queryTemplateCatlateObj",
			"catlateId" : catlateId
		},
		dataType : "json",
		async : true,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if ( flag ) {

				setFormValue(text);
			}

		}
	});

}

/**
 * 表单赋值
 */
var setFormValue = function( data ) {

	if (data == null || data == undefined || typeof(data) == "undefined") {

		resetForm();
	} else {

		for ( var item in data) {
			if (item != "searchValue" ) {
				$("#" + item).val(data[item]);
			}
		}
	}
}

var initTemplateType = function ( ) {

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/template",
		data : {
			"method" : "queryTemplateType",
		},
		dataType : "json",
		async : true,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			var templateTypeHtmlVal = "";

			if ( flag ) {

				for (var i = 0; i < text.length; i ++) {

					templateTypeHtmlVal += "<option value='" + text[i].codemapid + "'>" + text[i].codevalue+ "</option>";

				}

				$("#type").html(templateTypeHtmlVal);

			}

		}
	});

}

/**
 * 选择文件
 *
 * @param fileId
 */
function selectFile(fileId) {
	$("#" + fileId).trigger("click");

	$('#' + fileId).on('change',function(){
		var fileObj = document.getElementById(fileId).files[0];

		$("#fullFileName").html(fileObj.name);

		if (fileObj.name.indexOf(".html") == -1) {
			$("#fileMsg").html("（文件格式不正确，请重新上传！）");
		//	$("#filename").val("");
		} else {
			$("#fileMsg").html("（模版需保存后生效）");

		//	$("#filename").val(fileObj.name.split(".")[0]);
		}
	});
}

var readOnly = function ( ) {

	com.leanway.formReadOnly("templateForm");

}

var removeReadOnly = function ( ) {

	com.leanway.removeReadOnly("templateForm");

	$("#url").prop("readonly", true);
}


/**
 * 重置表单
 */
function resetForm() {

	// 清空表单上的数据
    $('#templateForm').each(function (index) {
        $('#templateForm')[index].reset();
    });

}

// 格式化form数据
var  formatFormJson = function  (formData) {

	var reg=/,$/gi;

	var data = "{";

	for (var i = 0; i < formData.length; i++) {

		data += "\"" +formData[i].name +"\" : \""+formData[i].value+"\",";

	}

	data = data.replace(reg,"");

	data += "}";

	return data;
}

var userType = "";
/**
 * 模板关联角色
 */
function revelanceRoles() {
	//获取选中的模板id,
	var data = templateTable.rows('.row_selected').data();
	if (data.length == 0) {
//		alert("请勾选销售订单生成生产订单！");
		lwalert("tipModal", 1, "请勾选模板关联角色！");
		return;
	} else if (data.length >1) {
		lwalert("tipModal", 1, "只能选取一个进行关联！");
		return;
	} else {
		showRoles();
	}
}



/*
 * 展示角色
 */
function showRoles(){
	com.leanway.clearTableMapData("userTable");
	userTable.ajax.url("../../../../"+ln_project+"/user?method=getUserList").load();
	// 初始化数据表格
	//然后弹框
	$('#rolesModal').modal({backdrop: 'static', keyboard: true});
	initRoleTree();

}
/**
 * 初始化ztree
 */
var initRoleTree = function(){


	 $.fn.zTree.init($("#rollTree"),  {

//		 check : {
//	            enable : true,
//	            chkStyle :"checkbox",
//	            chkboxType : { "Y": "s", "N": "s" }
//	        },
		 edit: {
				enable: false,
				showRemoveBtn: false,
				showRenameBtn: false,
//				drag: {
//					isCopy: false,
//					prev: true,
//					next: true,
//					inner: true
//				}
			},
	        async: {
	        	enable : true,
	        	url : "../../../"+ln_project+"/menu?method=getRolesTreeList" ,
	        	autoParam : ["levels"],
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
	           onClick:onClickUser
	      }
	});

}
//选中树节点
function onClickUser(e, treeId, treeNode) {
	userType = "";
	com.leanway.clearTableMapData("userTable");

	// 获取角色标识
	var roleId = treeNode.roleid;

	// 获取菜单标识
	if ( treeNode.checked ) {
		$.fn.zTree.getZTreeObj(treeId).checkNode(treeNode, false, false);
	} else {
		$.fn.zTree.getZTreeObj(treeId).checkNode(treeNode, true, true);
	//获取模板的id
	var templateId =  com.leanway.getCheckBoxData(1, "templateTable", "checkList");
	userTable.ajax.url("../../../../"+ln_project+"/templateManager?method=getUserByroleid&roleId=" + roleId +"&templateId="+templateId).load();
	}


}

//初始化数据表格
var initUserTable = function () {

	var table = $('#userTable').DataTable( {
			"ajax": "../../../../"+ln_project+"/user?method=getUserList", //对应spring里面的‘/user’bean,method为class里面的方法,方法名不能错。
	        'bPaginate': true, //是否显示分页
	        "bDestory": true,  //重新调用插件
	        "bRetrieve": true, //是否允许从新生成表格
	        "bFilter":false,  //是否启动过滤、搜索功能
	        "bSort": false,  //是否启动各个字段的排序功能
	        "bProcessing": true, //DataTables载入数据时，是否显示‘进度’提示
	        "bServerSide": true,  //是否启动服务器端数据导入
	        'searchDelay':"5000", //
	        "columns": [  //对应页面显示的字段
                {"data" : "userId"}, //对应html的字段名，id要一致
                { "data": "userName" },
                { "data": "compName" },
                { "data": "employeeName" },
                { "data": "mobile" },
                { "data": "phone" },
                { "data": "wechat" },
                { "data": "regist" },
                { "data": "startTime"},
                { "data": "endTime"}
	         ],
	         "aoColumns": [ //对应页面需要加载出来的数据名
	               {
	            	   "mDataProp": "userId",
	                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {  //格式固定,向页面新添新的东西。
	                	   $(nTd)
	            		   .html("<div id='stopPropagation" + iRow +"'>"
	            				   +"<input class='regular-checkbox' type='checkbox' id='"
	            				   + sData
	            				   + "' name='checkUserList' value='"
	            				   + sData
	            				   + "'><label for='"
	            				   + sData
	            				   + "'></label> </div>");
	                	    com.leanway.columnTdBindSelectNew(nTd,"userTable","checkUserList");  //datatable(grid-data)第一列绑定checkBoxName(checkList)选中事件

	                   }
	               },
	               {"mDataProp": "userName"},  //ajax后台过来的数据，需要跟bean里面的属性一致。
	               {"mDataProp": "compName"},

	          ],
	          "fnCreatedRow": function ( nRow, aData, iDataIndex ) { //创建行得时候的回调函数

//	        	  com.leanway.clearTableMapData("userTable");
	        	  if (userType != 2) {
		        	  if (aData.hasRole == "true") {
		        		  //给map赋值
		        		  com.leanway.setDataTableSelectNew("userTable",aData.userId,"checkUserList","add");
		        		  $(nRow).addClass("row_selected");
		        		  $(nRow).find('td').eq(0).find("input[name='checkUserList']").prop("checked", true)
		        	  }
	        	  }
	          },
	         "oLanguage" : { //国际化
	        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
	         },
	         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	         "fnDrawCallback" : function(data) {  //draw画 ，这个应该是重绘的回调函数

	        	 com.leanway.getDataTableFirstRowId("userTable",
							undefined, "more","checkUserList");
	            	   //点击事件
	        	 		//设置DataTable能否选择多条数据及选则后出发（把勾选的数据存在map,前面的checkBox有div）
	            	   com.leanway.dataTableClickMoreSelect("userTable","checkUserList",false,userTable,refeshUserTable,undefined,undefined,"checkUserList");

	         },

	    } ).on('xhr.dt', function (e, settings, json) {  //为指定元素的一个或多个事件绑定事件处理函数。
			com.leanway.checkLogind(json);  //检查登录状态
		} );


	return table;
}

/*
 * 关联用户角色
 */
function saveRelevance() {
	//获取树里面的id
	var zTree = $.fn.zTree.getZTreeObj("rollTree");
	var nodes = zTree.getSelectedNodes();
	if (nodes ==undefined || nodes == null || nodes =="") {
		$("#rolesModal").modal('hide');
		lwalert("tipModal",1,"请选中角色");
	} else {
		//获取用户表里面的记录
		var userids= com.leanway.getCheckBoxData(2, "userTable", "checkUserList");
		if (userids==undefined || userids ==null || userids=="") {
			$("#rolesModal").modal('hide');
			lwalert("tipModal",1,"请勾选用户");
		} else {
			ajaxSaveRelevance();
		}
	}

}

/**
 * 保存关联
 */
function ajaxSaveRelevance() {
	//获取角色的的id和模板的id
	var templateId =  com.leanway.getCheckBoxData(1, "templateTable", "checkList");
//	var roleid = getTreeGridActiveData().roleid;
	var roleid="";
	var zTree = $.fn.zTree.getZTreeObj("rollTree");
	var nodes = zTree.getSelectedNodes();

	for (var i = 0; i < nodes.length; i++) {
		roleid += nodes[i].roleid ;
	}
	var userids = com.leanway.getCheckBoxData(2, "userTable", "checkUserList");
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/templateManager",
		data : {
			"method" : "saveRolesRevelence",
			"templateId" : templateId,
			"roleid" : roleid ,
			"userid" : userids ,
		},
		dataType : "json",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);


			if ( flag ) {
				if(data.info =='success'){
					$("#rolesModal").modal('hide');
					lwalert("tipModal",1,"关联成功");
				} else {
					$("#rolesModal").modal('hide');
					lwalert("tipModal",1,data.info);
				}

			}

		}
	});
}
/**
 *
 */
function refeshUserTable() {
//	com.leanway.clearTableMapData("userTable");
	userType = 2 ;
}

/**
 * 取消关联
 */
function cansoleUserRelevence( type ) {
	//获取角色
	var roleid="";
	var zTree = $.fn.zTree.getZTreeObj("rollTree");
	var nodes = zTree.getSelectedNodes();
	if ( nodes== undefined || nodes==null || nodes=='') {
		$("#rolesModal").modal('hide');
		lwalert("tipModal",1,"请选择相应的角色");
		return ;
	}
	for (var i = 0; i < nodes.length; i++) {
		roleid += nodes[i].roleid ;
	}
	//获取userTable里面的id
	var userId = com.leanway.getCheckBoxData(type, "userTable", "checkUserList");
	//获取模板id
	var templateId =  com.leanway.getCheckBoxData(1, "templateTable", "checkList");
	if (type == 1 || type ==2) {
		ajaxCansoleUserRelevence(type,templateId,roleid,userId);
	} else if(type == 3) {
		ajaxCansoleUserRelevence(type,templateId,roleid);
	}
}

/**
 * ajax取消关联用户
 */
function ajaxCansoleUserRelevence (type,templateId,roleid,userId) {
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/templateManager",
		data : {
			"method" : "cansoleUserRelevence",
			"templateId" : templateId,
			"roleid" : roleid ,
			"userid" : userId ,
			"type" : type
		},
		dataType : "json",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);


			if ( flag ) {
				if(data.status =='success'){
					$("#rolesModal").modal('hide');
					lwalert("tipModal",1,"解除成功");
				} else {
					$("#rolesModal").modal('hide');
					lwalert("tipModal",1,data.info);
				}

			}

		}
	});
}



























































































































































































































var queryTemplateList = function () {
	var catlateid = $("#catlateid").val();
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/templateManager",
		data : {
			"method" : "queryTemplateList",
			"catlateid" : catlateid
		},
		dataType : "json",  //数据类型，前台传到后台的数据类型，以及后台到前台来的数据类型。
		async : false, //异步
		success : function ( data ) {
			var temp = "";
			for(var i in data.data){
				temp += data.data[i].employeeid;
				temp += ",";
			}
			com.leanway.setTableMapData("employeeTable",temp);
		}
	});
}


//var dataList = new Array();

/**
 * 根据名字查询雇员
 */
var searchEmployee = function ( ) {

	com.leanway.clearTableMapData("employeeTable");
	var searchVal = $("#searchEmployee").val();
	employeeTable.ajax.url("../../../../"+ln_project+"/templateManager?method=queryEmployeesList&searchValue=" + searchVal ).load();
}

/**
 * 初始化雇员表
 */
var initEmployee = function ( ) {

	var table = $('#employeeTable').DataTable({
		"ajax" : '../../../../'+ln_project+'/templateManager?method=queryEmployeesList',
//		"iDisplayLength" : "8",
		'bPaginate' : true,
		"bDestory" : true,
		"bRetrieve" : true,
		"bFilter" : false,
		"bSort" : false,
	//	"scrollX": true,   //会造成table不是完全撑开的，
	//	"scrollY":"200px",  //会造成table不是完全撑开
		//"sScrollY" : 450, // DataTables的高
		//"sScrollX" : 400, // DataTables的宽
		"bAutoWidth" : true, // 宽度自适应
		"bProcessing" : true,
		"bServerSide" : true,
		 "columns": [
		             { "data": "employeeid" },
		             { "data": "name"},
		             { "data": "phone"}
		          ],
		"aoColumns" : [
				{
					"mDataProp" : "employeeid",
					"fnCreatedCell" : function(nTd, sData,
							oData, iRow, iRow) {
						$(nTd).html("<div id='stopPropagation" + iRow +"'>"
								   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='checkEmployeeList' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label>");
                           com.leanway.columnTdBindSelectNew(nTd,"employeeTable","checkEmployeeList");
					}
				}, {
					"mDataProp" : "name"
				},  {
					"mDataProp" : "phone"
				}],
		"fnCreatedRow" : function(nRow, aData, iDataIndex) {
		  		  if (aData.templateid != null ){
					var catlateid = $("#catlateid").val()
		  		  	var template = aData.templateid.split(",");
		  		  	for(var i in template){
					  if (catlateid == template[i]) {
		        		  $(nRow).addClass("row_selected");
		        		  $(nRow).find('td').eq(0).find("input[name='checkEmployeeList']").prop("checked", true)
		        	  }
		  		  	}
		  		  }
		},
		"oLanguage" : {
        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
         },
		"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		"fnDrawCallback" : function(data) {
			//多选会有问题。
		//	com.leanway.dataTableClickMoreSelect("employeeTable","checkEmployeeList",true,employeeTable,undefined,undefined,undefined);
		}
	}).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );
	return table;
}
/**
 * 初始化部门树
 */
var initTreeBom = function ( ) {

	$.fn.zTree.init($("#treeBom"), {
        check : {
            enable : true,
            chkStyle :"radio",
            chkboxType : { "Y": "a"},
        },
		async : {
			enable : true,
			url : "../../../../"+ln_project+"/templateManager?method=queryDepartmentTreeList",
			autoParam : [ "levels"]
		},
		view : {
			dblClickExpand : false,
			fontCss:getFontCss,
			showLine: true,
		},
		data : {
			key : {
				id : "deptid",
				name : "deptname"
			},
			simpleData : {
				enable : true,
				idKey : "deptid",
				pIdKey : "pid",
				rootPId : ""
			}
		},
		callback : {
			// onRightClick : OnRightClick,
			onClick : onClick,
		//	onCheck : zTreeOnCheck
		}
	});

}

/**
 * checkBox选中事件
 */
var zTreeOnCheck = function (event, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("treeBom");
	var nodes = zTree.getCheckedNodes(true);
//	console.log(nodes[nodes.length].deptid);
	//	queryDepartment();
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

	queryDepartment();
}


var departid = "";
 /*
  * 查看部门下面的雇员
  */
var queryDepartment = function ( ) {

	com.leanway.clearTableMapData("employeeTable");
	// 勾选的树形结部门ID
	var zTree = $.fn.zTree.getZTreeObj("treeBom");
	var nodes = zTree.getCheckedNodes(true);
	departid = nodes[0].deptid;
	var searchVal = "";
	employeeTable.ajax.url("../../../../"+ln_project+"/templateManager?method=queryEmployeesList&searchValue=" + searchVal + "&departid=" + departid).load();
}

/**
 * 显示
 */
var showEmployee = function () {
	//鼠标选取的行
    if (templateTable.rows('.row_selected').data().length == 0) {
    	lwalert("tipModal", 1, "请选择模板关联雇员！");
    	return;
    } else if (templateTable.rows('.row_selected').data().length > 1){
    	lwalert("tipModal", 1, "请选择一位模板进行关联！");
    	return;
    } else  {
    	//将已有的值置空
    	$("#searchEmployee").val("");
    	// 弹出modal
    	$('#employeeModal').modal({backdrop: 'static', keyboard: false});
    	//加载数据
    	initTreeBom();
    	queryTemplateList();
    	var searchVal = "";
    	var departid = "";
    	// 初始化用户Grid
		if (employeeTable == null || employeeTable == "undefined" || typeof(employeeTable) == "undefined") {
			employeeTable = initEmployee();
		} else {
			employeeTable.ajax.url("../../../../"+ln_project+"/templateManager?method=queryEmployeesList&searchValue=" + searchVal + "&departid=" + departid).load();
		}
	}
}
/**
 * 关联雇员
 */
var associateEmployee = function () {
	 var catlateid = $("#catlateid").val();
	 // init table 向 tabmap放入该tableid， new colmap,在colmap里边放入你保存过的雇员的ID
	 var ids = com.leanway.getCheckBoxData(2, "employeeTable", "checkEmployeeList");
//	var formData = formatForm();
		$.ajax ( {
			type : "post",
			url : "../../../../"+ln_project+"/templateManager",
			data : {
				"method" : "saveRelation",
		//		"paramData" : formData,
				"employeeid" : ids,
				"departid" : departid,
				"catlateid" : catlateid
			},
			dataType : "text",  //数据类型，前台传到后台的数据类型，以及后台到前台来的数据类型。
			async : false, //异步
			success : function ( text ) {
				//
				var flag =  com.leanway.checkLogind(text);

				var tempData = $.parseJSON(text);
				if (tempData.status == "success") {
					employeeTable.ajax.reload(); //重新加载数据，返回DataTables.Api 实例。
					//模态框隐藏
					$('#employeeModal').modal('hide');
					lwalert("tipModal", 1, "已关联成功！");
				}else{
					$('#employeeModal').modal('hide');
					lwalert("tipModal", 1, tempData.info);
				}
			}
		});

}


// 格式化form数据
var  formatForm = function  ( ) {

	 var catlateid = $("#catlateid").val()
	var length = employeeTable.rows('.row_selected').data().length;
	var formData = employeeTable.rows('.row_selected').data();


	var data = "{\"templateowerconditions\" : [";

	for (var i = 0; i <= length-1; i++) {
		data += "{";
		data += "\"employeeid\" : \""+formData[i].employeeid+"\",";
		data += "\"compid\" : \""+formData[i].compid+"\",";
		data += "\"deptid\" : \""+formData[i].deptid+"\",";
		data += "\"templateid\" : \""+catlateid+"\"";
		if (i <= length-2 ){
			data += "},";
		} else {
			data += "}";
		}
	}

	data += "]}";

	return data;
}


