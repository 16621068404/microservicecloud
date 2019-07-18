

//改变checkbox形状
var clicktime = new Date();
//数据table
var oTable;

//增加或修改
var ope;

//按钮
var buttonObj=[{"id":"saveOrUpdateAId","type":"button"},{"id":"resetFun","type":"button"}];

$ ( function () {
	initBootstrapValidator();
	//设置input不可用
	com.leanway.formReadOnly("boxcForm",buttonObj);
	// 初始化对象
	com.leanway.loadTags();
	// 加载datagrid
	oTable = initTable();
	//查询企业
	queryusers();
	//保存按钮绑定事件
	$("#saveboxc").click( saveboxc );
	//绑定删除按钮
	$("#deleteboxcli").click(deleteboxcli);

	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchBoxclientCatlog);
});

var searchBoxclientCatlog = function () {

	var searchVal = $("#searchValue").val();

	oTable.ajax.url("../../../"+ln_project+"/boxclientcatlog?method=queryboxclientcatlog&searchValue=" + searchVal).load();
}


//初始化数据表格
var initTable = function() {
	var table = $('#boxclientsDataTable')
	.DataTable(
			{
				"ajax": "../../../"+ln_project+"/boxclientcatlog?method=queryboxclientcatlog",
				//"iDisplayLength" : "10",
				'bPaginate' : true,
				"bDestory" : true,
				"bRetrieve" : true,
				"bFilter" : false,
				"bSort" : false,
				"scrollY":"320px", // DataTables的高
				// "sScrollX" : 400, // DataTables的宽
				"bAutoWidth" : true, // 宽度自适应
				"bProcessing" : true,
				"bServerSide" : true,
				'searchDelay' : "5000",
				"columns" : [ {
					"data" : "boxtype"
				}, {
					"data" : "boxname"
				}],
				"aoColumns" : [
				               {
				            	   "mDataProp" : "boxclientcatlogid",
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
				            		   com.leanway.columnTdBindSelectNew(nTd,"boxclientsDataTable", "checkList");
				            	   }
				               }, {
				            	   "mDataProp" : "boxname"
				               },
				               {
				            	   "mDataProp" : "boxtype"
				               },
				               ],
				               "oLanguage" : {
				            	   "sUrl" : "../../../jslib/datatables/zh-CN.txt"
				               },
				               "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
				               "fnDrawCallback" : function(data) {

				            	   com.leanway.getDataTableFirstRowId("boxclientsDataTable", ajaxLoadboxclients,"more", "checkList");

									 // 点击dataTable触发事件
		                            com.leanway.dataTableClickMoreSelect("boxclientsDataTable", "checkList", false,
		                                  oTable, ajaxLoadboxclients,undefined,undefined,"checkAll");
		                            com.leanway.dataTableCheckAllCheck('boxclientsDataTable', 'checkAll', 'checkList');

				               }
			}).on('xhr.dt', function (e, settings, json) {
				com.leanway.checkLogind(json);
			} );
	return table;
}
/**
 * 查询企业
 */
var queryusers=function() {
	$.ajax ({
		type : 'POST',
		url : '../../../'+ln_project+'boxclientcatlog?method=queryusers',
		async : false,
		dataType : 'text',
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

		        var json = eval("(" + data + ")");

				var deviceCalendars = json.boxclientcatlog;
				var html="";
				for (var i = 0;i<deviceCalendars.length;i++) {
					html +="<option id="+"codeids"+" value="+ deviceCalendars[i].compid+">"+ deviceCalendars[i].compname+"</option>";
				}
				$("#compid").html(html);
			}
		}
	});
}



/**
 *
 * 往里面存或者修改数据数据之前判断
 *
 * @author 熊必强
 *
 * */
var saveboxc = function() {
	$("#boxcForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#boxcForm').data('bootstrapValidator').isValid()) { // 返回true、false*/
		//增加时判断name是否可用
		if ("addboxclientcatlog"== ope) {
			var backValue=queryBoxByName();
			if(backValue==0){
				saveOrUpdate();
			}
		}else{//修改的时候不需要判断
			saveOrUpdate();
		}
	}
}
/**
 *
 * 当条件为增加时，判断盒子名称是否可用
 *
 * @author 熊必强
 *
 * */
function queryBoxByName(){

	var judgeBackValue;

	var form = $("#boxcForm").serializeArray();
	var formData = formatFormJson(form);
	var compid = $("#compid").val();

	$.ajax ({
		type : "POST",
		url : "../../../"+ln_project+"/boxclientcatlog",
		data : {
			method : "queryBoxByName",
			"formData" : formData,
			"compid":compid
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
			    if(tempData.boxByNameList>=1){
					judgeBackValue = 1;
					lwalert("tipModal", 1, "盒子名称已经被占用，请进行修改！");
				}else{
					judgeBackValue = 0;
				}
			}
		}
	});
	return judgeBackValue;
}

/**
 *
 * 修改或者存储
 *
 * @author 熊必强
 *
 * */
function saveOrUpdate(){
	var form = $("#boxcForm").serializeArray();
	var formData = formatFormJson(form);
	var compid = $("#compid").val();
	var authorization = $("#authorization").val();
	$.ajax ({
		type : "POST",
		url : "../../../"+ln_project+"/boxclientcatlog",
		data : {
			method : ope,
			"formData" : formData,
			"compid":compid,
			"authorization":authorization
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				if (tempData.code == "1") {
					resetForm();
					buttonDisabled("#saveOrUpdateAId, #resetFun");
					com.leanway.formReadOnly("boxcForm");

					com.leanway.clearTableMapData( "boxclientsDataTable" );

					if(ope=="addboxclientcatlog"){
					    oTable.ajax.reload();
					}else{
					    oTable.ajax.reload(null,false);
					}

				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");
				}
			}
		}
	});
}


//查询到右边显示
var ajaxLoadboxclients =function (boxclientcatlogid) {
	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/boxclientcatlog?method=findboxcilentcatlogid",
		data : {
			"boxclientcatlogid" : boxclientcatlogid,
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var json = eval("(" + data + ")");

				setFormValue(json);
			}
		}
	});
	com.leanway.formReadOnly("boxcForm",buttonObj);
}
//自动填充表单数据（页面id须与bean保持一致）
function setFormValue(json) {
	/*console.info(json);*/
	resetForm();

	for (var item in json) {
		if (item != "searchValue") {
			$("#" + item).val(json[item]);

		}
	}

}

//格式化form数据
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

//增加按钮
function addboxclientcatlog() {
	ope="addboxclientcatlog";
	//$("#myModalLabel").html("添加盒子类型");
	// 清空表单
	resetForm();
	//设置input可输入
	com.leanway.removeReadOnly("boxcForm",buttonObj);
	//取消选中状态
	com.leanway.dataTableUnselectAll("boxclientsDataTable", "checkList");
	$("#boxclientcatlogid").val(null);

	com.leanway.clearTableMapData( "boxclientsDataTable" );
}

//删除数据
function deleteboxcli(type){

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "boxclientsDataTable", "checkList");

	if (ids.length != 0) {

        var msg = "确定删除选中的" + ids.split(",").length + "条智能盒子?";
		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");

	} else {
		lwalert("tipModal", 1, "至少选择一条记录进行删除操作！");
	}
}

function isSureDelete(type){

	var ids = com.leanway.getCheckBoxData(type, "boxclientsDataTable", "checkList");

	deleteAjax(ids);
}
//删除Ajax
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/boxclientcatlog?method=deleteboxclientcatlog",
		data : {
			"Boxclientcid" : '{"boxclientcatlogid":"' + ids + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
				 if (tempData.code == "1"){

					 com.leanway.clearTableMapData( "boxclientsDataTable" );

					 oTable.ajax.reload(null,false);
				}else{
					lwalert("tipModal", 1, "操作失败！");
				}
			}
		}
	});
}
//修改产品类型
function updateboxclientcatlog() {

	ope="updateboxclientcatlog";

	var data = oTable.rows('.row_selected').data();
	if(data.length == 0) {
		lwalert("tipModal", 1, "请选择要修改的客户端！");
	} else if(data.length > 1) {
		lwalert("tipModal", 1, "只能选择一个客户端进行修改！");
	}else{
		$("#bodygeneralInfo").find('tr').each(function (index, temp) {
			//获取datatable被选中的数据
			if ($(this).hasClass('row_selected')) {

				var clientid=$(this)[0].cells[0].children[0].children[0].value;

				ajaxLoadboxclients(clientid);
			}

		});
	}
	com.leanway.removeReadOnly("boxcForm",buttonObj);
	document.getElementById("boxname").readOnly=true;
}




//关闭modal
var closeForm = function () {
	$('#moldModal').modal('hide');
}

//重置表单
var resetForm = function () {
	$( '#boxcForm' ).each( function ( index ) {
		$('#boxcForm')[index].reset( );
	});
    $("#boxcForm").data('bootstrapValidator').resetForm();

}

//禁用button
function buttonDisabled(id) {
	$(id).attr({
		"disabled" : "disabled"
	});
}
//启用button
function buttonEnabled(id) {
	$(id).removeAttr("disabled");
}

//名称
com.leanway.reg.decimal.boxname =/^[\u0391-\uFFE5a-zA-Z0-9]{0,30}$/;
com.leanway.reg.msg.boxname = "请输入正确的法人代表";

function initBootstrapValidator() {
	$('#boxcForm').bootstrapValidator({
		excluded: [':disabled'],
		fields: {
			boxname : {
				validators : {
					notEmpty : {},
					regexp : com.leanway.reg.fun(
							com.leanway.reg.decimal.boxname,
							com.leanway.reg.msg.boxname)
				}
			},boxtype : {
				validators : {
					notEmpty : {},
				}
			},/*compid : {
				validators : {
					notEmpty : {},
				}
			}*/
		}
	});
}
