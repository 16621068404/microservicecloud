//改变checkbox形状
var clicktime = new Date();
//数据table
var oTable;

//添加或修改全局变量
var ope;

//按钮是否可用
var buttonObj=[{"id":"saveOrUpdateAId","type":"button"},{"id":"resetFun","type":"button"}];

$ ( function () {
	initBootstrapValidator();
	//设置input不可用
	com.leanway.formReadOnly("boxcForm",buttonObj);
	// 初始化对象
	com.leanway.loadTags();
	// 加载datagrid
	oTable = initTable();
	//保存按钮绑定事件
	$("#saveboxc").click( saveboxc );
	//绑定删除按钮
	$("#deleteboxcli").click(deleteboxcli);

	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchBoxClient);
});

var searchBoxClient = function () {

	var searchVal = $("#searchValue").val();

	oTable.ajax.url("../../../"+ln_project+"/boxclients?method=queryBoxClientTrackList&searchValue=" + searchVal).load();
}
//初始化数据表格
var initTable = function() {
	selectboxclientcatlog();
	var table = $('#boxclientsDataTable')
	.DataTable(
			{
				"ajax": "../../../"+ln_project+"/boxclients?method=queryBoxClientTrackList",
				//"iDisplayLength" : "10",
				'bPaginate' : true,
				"bDestory" : true,
				"bRetrieve" : true,
				"bFilter" : false,
				"bSort" : false,
				"sScrollY" : "320px", // DataTables的高
				// "sScrollX" : 400, // DataTables的宽
				"bAutoWidth" : true, // 宽度自适应
				"bProcessing" : true,
				"bServerSide" : true,
				'searchDelay' : "5000",
				"columns" : [ {
					"data" : "clientid"
				}, {
					"data" : "clientname"
				}, {
					"data" : "mac"
				} ],
				"aoColumns" : [
				               {
				            	   "mDataProp" : "clientid",
				            	   "fnCreatedCell" : function(nTd, sData,
				            			   oData, iRow, iCol) {
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
				            				   + "'></label>");
				            		   com.leanway.columnTdBindSelectNew(nTd,"boxclientsDataTable", "checkList");
				            	   }
				               }, {
				            	   "mDataProp" : "clientname"
				               },
				               {
				            	   "mDataProp" : "mac"
				               }
				               ],
				               "oLanguage" : {
				            	   "sUrl" : "../../../jslib/datatables/zh-CN.txt"
				               },
				               "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
				               "fnDrawCallback" : function(data) {

				            		com.leanway.getDataTableFirstRowId("boxclientsDataTable", ajaxLoadboxclients,"more","checkList");

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
var selectboxclientcatlog=function(){
	$.ajax({
		type:"post",
		url:"../../../"+ln_project+"/boxclients?method=findboxclientcatlog",
		async:false,
		data:{},
		dataType:"text",
		success:function(data){

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			    var json = eval("(" + data + ")");

				var boxclientcatlog = json.boxclientcatlog;
				var html="";
				for (var i = 0;i<boxclientcatlog.length;i++) {
					html +="<option id="+"codeids"+" value="+ boxclientcatlog[i].boxclientcatlogid+">"+ boxclientcatlog[i].boxname+"</option>";
				}
				$("#typename").html(html);
			}
		}
	});
}



/**
 * 往里面存数据
 *
 * @author 熊必强
 *
 * */
var saveboxc = function() {
	$("#boxcForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#boxcForm').data('bootstrapValidator').isValid()) { // 返回true、false
		//如果是增加  则先进行判断   客户端名称不能重复
		if("addboxclients"==ope){

			var repeatValue=judgeReapt();

			if (repeatValue==0) {
				//新增
				saveOrUpdateFun();

			}else if (repeatValue==1){

				lwalert("tipModal", 1, "客户端名称已被占用,请重新填写客户端名称");
			}

		//修改
		}else{
			saveOrUpdateFun();
		}
	}
}


/**
 * 增加或者修改数据
 *
 * @author 熊必强
 *
 * */
function saveOrUpdateFun(){
	var typename=$("#typename").children("option:selected").text();
	var form = $("#boxcForm").serializeArray();
	var boxclientcatlogid=$("#typename").val();
	var formData = formatFormJson(form);
	$.ajax ({
		type : "POST",
		url : "../../../"+ln_project+"/boxclients",
		data : {
			method:ope,
			"formData" : formData,
			"boxclientcatlogid":boxclientcatlogid,
			"typename" :typename
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				if (tempData.code == 1) {

					com.leanway.clearTableMapData( "boxclientsDataTable" );

					resetForm();
					buttonDisabled("#saveOrUpdateAId");
					com.leanway.formReadOnly("boxcForm");

					if(ope=="addboxclients"){
					    oTable.ajax.reload();
					}else{
					    oTable.ajax.reload(null,false);
					}

					//ajaxLoadboxclients(tempData.resultObj.clientid);
				}
			}
		}
	});
}

/**
 *
 * 查询是否重复
 *
 * @author 熊必强
 *
 * @date 2016-03-22
 *
 * */
var judgeReapt = function() {
	var repeatBackValue = 0;
	var clientname = $("#clientname").val();
	$.ajax ({
		type : "POST",
		url : "../../../"+ln_project+"/boxclients",
		data : {
			method:"judgeReaptByClientName",
			"clientname":clientname
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);

				 if (tempData.boxclientrepeatlist>=1) {
					lwalert("tipModal", 1,"客户端名称已被占用，请重新填写！");
					repeatBackValue = 1;
				}
			}
		}
	});
	return repeatBackValue;
}


/**
 * 查询到右边显示
 *
 * @author 熊必强
 *
 * @date 2016-03-22
 *
 * */
var ajaxLoadboxclients =function (clientid) {
	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/boxclients",
		data : {
			method : "findboxcilentsid",
			"clientid" : clientid,
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
}
//自动填充表单数据（页面id须与bean保持一致）
function setFormValue(json) {
	resetForm();
	for (var item in json) {
		if (item != "searchValue" && item != null) {
			$("#" + item).val(json[item]);
		}
	}
	var tempType;
	if(json.boxclientcatlogid!=null){
		tempType=json.boxclientcatlogid;
	}

	if(tempType!=null){
		var value = tempType.substring(0);
		$("#typename").val(value);
	}
	com.leanway.formReadOnly("boxcForm");

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
function addproduct() {
	$("#myModalLabel").html("添加智能盒子类型");
	ope = "addboxclients";
	// 清空表单
	resetForm();
	//设置保存按钮可用
	buttonEnabled("#saveOrUpdateAId, #resetFun");
	//设置input可输入
	com.leanway.removeReadOnly("boxcForm");
	com.leanway.dataTableUnselectAll("boxclientsDataTable","checkList");
	com.leanway.clearTableMapData( "boxclientsDataTable" );
}

//删除数据
function deleteboxcli(type){

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "boxclientsDataTable", "checkList");

	if (ids.length > 0) {

        var msg = "确定删除选中的" + ids.split(",").length + "条智能设备?";

		lwalert("tipModal", 2, msg ,"isSure(" + type + ")");
	} else {
		lwalert("tipModal", 1, "至少选择一条记录进行删除操作");
	}
}

/**
 *
 * @author 祝海丹
 *
 * */
function isSure(type) {

	var ids = com.leanway.getCheckBoxData(type, "boxclientsDataTable", "checkList");

	deleteAjax(ids);
}

//删除Ajax
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/boxclients?method=deleteboxcli",
		data : {
			"boxclientsid" : '{"clientid":"' + ids + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
				if (tempData.code == "1") {

					com.leanway.clearTableMapData( "boxclientsDataTable" );
					oTable.ajax.reload(null,false);
				}else{
					lwalert("tipModal", 1, "操作失败");
				}
			}
		}
	});
}
/**
 * 修改智能盒子
 *
 * @date 2016-03-22
 *
 * @author 熊必强
 *
 * */
function modifyboxcli() {
	ope="updateboxcli";

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
	document.getElementById("clientname").readOnly=true;
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
com.leanway.reg.decimal.clientname =/^[\u0391-\uFFE5a-zA-Z0-9]{0,}$/;
com.leanway.reg.msg.clientname = "请输入正确的客户端名称";

com.leanway.reg.decimal.type =/^[a-zA-Z0-9]{0,}[.]{0,1}[a-zA-Z0-9]{0,}$/;
com.leanway.reg.msg.type = "请输入正确的类型";

com.leanway.reg.decimal.typename =/^[a-zA-Z0-9]{0,}[.]{0,1}[a-zA-Z0-9]{0,}$/;
com.leanway.reg.msg.typename = "请输入正确的类型名称";

com.leanway.reg.decimal.accessable =/^[a-zA-Z0-9]{0,}[.]{0,1}[a-zA-Z0-9]{0,}$/;
com.leanway.reg.msg.accessable = "请输入正确的访问权限";

com.leanway.reg.decimal.mac =/^[\u0391-\uFFE5a-zA-Z0-9]{0,}$/;
com.leanway.reg.msg.mac = "请输入正确的标识码";

function initBootstrapValidator() {
	$('#boxcForm').bootstrapValidator({
		excluded: [':disabled'],
		fields: {
			clientname : {
				validators : {
					notEmpty : {},
				}
			},mac : {
				validators : {
					notEmpty : {},
				}
			}
		}
	});
}
