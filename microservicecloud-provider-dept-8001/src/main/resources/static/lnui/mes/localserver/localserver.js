var clicktime = new Date();
//操作方法，新增或修改
var opeMethod = "addLocalServer";

var oTable;
var backValue;
$(function() {

	// 初始化对象
	com.leanway.loadTags();
	// 初始化表格
	oTable = initTable();

	// 查询服务器类型
	selectboxclientcatlog();
	// 查询企业
	queryAllCompany();
	//查询工作中心组
	loadWorkGroup();

	com.leanway.formReadOnly("localServerForm");

	//禁用保存按钮
	$("#saveOrUpdateAId").attr({
		"disabled" : "disabled"
	});

	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchLocalServer);


});

var searchLocalServer = function () {

	var searchVal = $("#searchValue").val();

	oTable.ajax.url("../../../"+ln_project+"/localServer?method=queryLocalServer&searchValue=" + searchVal).load();
}

function addLocalServer() {

	opeMethod = "addLocalServer";

	// 清空表单
	resetForm();

	$("#saveOrUpdateAId").removeAttr("disabled");
	com.leanway.removeReadOnly("localServerForm");
	com.leanway.dataTableUnselectAll("localServerDataTable", "checkList");
	com.leanway.clearTableMapData( "localServerDataTable" );
}

//重置表单
function resetForm() {

	$('#localServerForm').each(function(index) {
		$('#localServerForm')[index].reset();
	});

}

//初始化现场服务器数据表格
var initTable = function() {
	var table = $('#localServerDataTable')
	.DataTable(
			{
				"ajax" : "../../../"+ln_project+"/localServer?method=queryLocalServer",
				//"iDisplayLength" : "10",
				'bPaginate' : true,
				"bDestory" : true,
				"bRetrieve" : true,
				"bFilter" : false,
				"bSort" : false,
				"scrollY":"320px",
				"bAutoWidth" : true, // 宽度自适应
				"bProcessing" : true,
				"bServerSide" : true,
				'searchDelay' : "5000",
				"columns" : [ {
					"data" : "serverid"
				}, {
					"data" : "clientname"
				}, {
					"data" : "mac"
				} ],
				"aoColumns" : [
				               {
				            	   "mDataProp" : "serverid",
				            	   "fnCreatedCell" : function(nTd, sData,
				            			   oData, iRow, iCol) {
				            		   $(nTd)
				            		   .html(
				            				   "<div id='stopPropagation"
												+ iRow
												+ "'>"
												+"<input class='regular-checkbox' type='checkbox' id='"
				            				   + sData
				            				   + "' name='checkList' value='"
				            				   + sData
				            				   + "'><label for='"
				            				   + sData
				            				   + "'></label>");
				            		   com.leanway.columnTdBindSelectNew(nTd,"localServerDataTable", "checkList");
				            	   }
				               }, {
				            	   "mDataProp" : "clientname",
				               }, {
				            	   "mDataProp" : "mac"
				               } ],

				               "oLanguage" : {
				            	   "sUrl" : "../../../jslib/datatables/zh-CN.txt"
				               },
				               "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
				               "fnDrawCallback" : function(data) {


				            		com.leanway.getDataTableFirstRowId("localServerDataTable", getLocalServerById,"more", "checkList");

									 // 点击dataTable触发事件
		                           com.leanway.dataTableClickMoreSelect("localServerDataTable", "checkList", false,
		                                   oTable, getLocalServerById,undefined,undefined,"checkAll");

		                           com.leanway.dataTableCheckAllCheck('localServerDataTable', 'checkAll', 'checkList');

				               }

			}).on('xhr.dt', function (e, settings, json) {
				com.leanway.checkLogind(json);
			} );

	return table;
}

/**
 * 保存前的条件判断
 */
function saveOrUpdate() {

	if("addLocalServer"==opeMethod){
		var form = $("#localServerForm").serializeArray();
		var formData = formatFormJson(form);
		$.ajax({
			type : "post",
			url : "../../../"+ln_project+"/localServer",
			data : {
				method : "judgeReapt",
				conditions : formData,
			},
			dataType : "text",
			success : function(data) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					var tempData = $.parseJSON(data);
					 if(tempData.localServers>=1){
						lwalert("tipModal", 1, "客户端名称已被使用，请重新输入！");
					} else if(tempData.localServer>=1){
						lwalert("tipModal", 1, "该公司已存在服务器！");
					}else{
						saveOrUpdateTrue();
					}

				}
			},
		});
	}else{
		saveOrUpdateTrue();
	}
}

/**
 *
 *
 * */
function saveOrUpdateTrue(){

	//com.leanway.checkSession();

	var form = $("#localServerForm").serializeArray();
	var formData = formatFormJson(form);

	var clientname = $("#clientname").val();
	if (clientname == "" || clientname == null) {
//		alert("客户端名称不能为空");
		lwalert("tipModal", 1, "客户端名称不能为空！");
		return;
	}

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/localServer",
		data : {
			method : opeMethod,
			conditions : formData,

		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				 if (tempData.code == "1") {

					com.leanway.clearTableMapData( "localServerDataTable" );

					$("#saveOrUpdateAId").attr({
						"disabled" : "disable"
					});


					if(opeMethod=="addLocalServer"){
					    oTable.ajax.reload();
					}else{
					    oTable.ajax.reload(null,false);
					}

					com.leanway.formReadOnly("localServerForm");
	//				alert("保存成功");
					lwalert("tipModal", 1, "保存成功！");

				} else {

	//				alert(tempData.exception);
					lwalert("tipModal", 1, tempData.result.exception);

				}

			}
		},
		error : function(data) {
//			alert("保存失败！");
			lwalert("tipModal", 1, "保存失败！");
		}
	});
}


/*function judgeReapt(){
	var form = $("#localServerForm").serializeArray();
	var formData = formatFormJson(form);
	$.ajax({
		type : "post",
		url : "../../localServer",
		data : {
			method : "judgeReapt",
			conditions : formData,
		},
		dataType : "text",
		success : function(data) {
			var tempData = $.parseJSON(data);
			if(tempData.code == "2"){
				lwalert("tipModal", 2,"系统长时间未操作，登录失效，请重新登录","forwardLogout()");
				backValue = false;
			}
			else if(tempData.localServers>=1){
				lwalert("tipModal", 1, "客户端名称已被使用，请重新输入！");
				backValue = false;
			} else{
				backValue = true;
			}
		},
	});
	return backValue;
}*/

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

//显示编辑数据
function showEditLocalServer() {

	var data = oTable.rows('.row_selected').data();

	if (data.length == 0) {

//		alert("请选择服务器！");
		lwalert("tipModal", 1, "请选择服务器！");

	} else if (data.length > 1) {

//		alert("只能选择一个服务器修改！");
		lwalert("tipModal", 1, "请选择一个服务器修改！");

	} else {

		var serverid = data[0].serverid;

		com.leanway.removeReadOnly("localServerForm");

		$("#clientname").prop("readonly", true)
		$("#saveOrUpdateAId").removeAttr("disabled");

		// 当选择数据修改将opeMethod的值改为updateUnitsByConditons
		opeMethod = "updateLocalServerByConditons";
	}
}

/**
 * 根据id查询现场服务器信息在表单中显示
 */
function getLocalServerById(serverid) {
	$.ajax({
		type : "get",
		url : "../../../"+ln_project+"/localServer",
		data : {

			method : "queryLocalServerById",
			conditions : '{"serverid":"' + serverid + '"}'

		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				// 重置表单数据
				resetForm();
				com.leanway.formReadOnly("localServerForm");
				$("#saveOrUpdateAId").attr({
					"disabled" : "disabled"
				});
				// 表单赋值
				setFormValue(data.localServerResult);

			}

		},
		error : function(data) {

		}
	});
}

/**
 * 为表单赋值
 *
 * @param data
 */
function setFormValue(data) {

	for ( var item in data) {
		if (item != "searchValue") {
			$("#" + item).val(data[item]);

		}

	}
}

//删除选中服务器
function deleteLocalServer(type) {

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "localServerDataTable", "checkList");
	if (ids.length>0) {
        var msg = "确定删除选中的" + ids.split(",").length + "个现场服务器?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	} else {

//		alert("至少选择一条记录操作");
		lwalert("tipModal", 1, "至少选择一条记录操作！");

	}
}

function isSureDelete(type){

	var ids = com.leanway.getCheckBoxData(type, "localServerDataTable", "checkList");

	deleteAjax(ids);
}
//删除现场服务器Ajax
var deleteAjax = function(ids) {

	$.ajax({

		type : "post",
		url : "../../../"+ln_project+"/localServer",
		data : {
			method : "deleteLocalServerByConditons",
			conditions : '{"serverIds":"' + ids + '"}'

		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);

	            if (tempData.code == "1") {

	            	com.leanway.clearTableMapData( "localServerDataTable" );
					oTable.ajax.reload(null,false);

				} else {

	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");

				}

			}
		}
	});
}

/**
 * 查询服务器类型
 */
var selectboxclientcatlog = function() {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/localServer?method=queryServerType",
		async : false,
		data : {},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var json = eval("(" + data + ")");
				var data = json.serverTypeResult;
				//alert(data);
				var html = "";

				for ( var i in data) {
					// 拼接option
					html += "<option value=" + data[i].codemapid + ">"
					+ data[i].codevalue + "</option>";
				}

				$("#typeid").html(html);

			}
		}
	});
}

/**
 * 查询企业
 */
var queryAllCompany = function() {
	$.ajax({
		type : 'POST',
		url : '../../../'+ln_project+'company?method=queryAllCompany',
		async : false,
		data : {

		},
		dataType : 'text',
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var json = eval("(" + data + ")");
				var data = json.data;
				var html = "";
				for (var i = 0; i < data.length; i++) {

					html += "<option id=" + "codeids" + " value=" + data[i].compid
					+ ">" + data[i].compname + "</option>";

				}
				$("#compid").html(html);

			}
		}
	});
}

/**
 * 加载工作中心组
 */
var loadWorkGroup = function() {
	$.ajax({
		type : 'POST',
		url : '../../../'+ln_project+'workCenterGroup?method=queryWorkCenterGroupList',
		async : false,
		data : {

		},
		dataType : 'text',
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var json = eval("(" + data + ")");

					var data = json.data;
					var html = "";
					for (var i = 0; i < data.length; i++) {

						html += "<option id=" + "groupids" + " value=" + data[i].groupid
						+ ">" + data[i].groupname + "</option>";

					}
					$("#groupid").html(html);
			}

		}
	});
}
