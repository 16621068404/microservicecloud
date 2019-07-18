var clicktime = new Date();
var ope = "addWorkCenterGroup"
$(function() {
initBootstrapValidator();
})
function initBootstrapValidator() {
	$('#workCenterGroupForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					groupname : {
						validators : {
							notEmpty : {},

						}
					},
					shortname : {
						validators : {
							notEmpty : {},

						}
					},

					length : {
						validators : {
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					width : {
						validators : {
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
				}
			});
}



$ ( function () {

	// 初始化对象
	com.leanway.loadTags();
	com.leanway.formReadOnly("workCenterGroupForm");
	// 加载datagrid
	oTable = initTable();

	// 全选
//	com.leanway.dataTableCheckAll("generalInfo", "checkAll", "checkList");
	com.leanway.enterKeyDown("searchValue", searchWorkCenterGroup);

})

// 初始化数据表格
	var initTable = function () {

		var table = $('#generalInfo').DataTable( {
				"ajax": "../../../../"+ln_project+"/workCenterGroup?method=queryWorkCenterGroupList",
				 //"iDisplayLength" : "6",
		        'bPaginate': true,
		        "bDestory": true,
		        "bRetrieve": true,
		        "bFilter":false,
		        "bSort": false,
		        "bProcessing": true,
		        "bServerSide": true,
		        'searchDelay':"5000",
		        "fixedHeader": true,
		        "columns": [
	                {"data" : "groupid"},
	                { "data": "groupname" },
	                { "data": "shortname" }
		         ],
		         "aoColumns": [
		               {
		            	   "mDataProp": "groupid",
		                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
		                	   $(nTd).html("<div id='stopPropagation" + iRow +"'>"
									   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                       + "' name='checkList' value='" + sData
                                       + "'><label for='" + sData
                                       + "'></label>");
							 com.leanway.columnTdBindSelectNew(nTd,"generalInfo","checkList");
		                   }
		               },
		               {"mDataProp": "groupname"},
		               {"mDataProp": "shortname"},
		          ],
		         "oLanguage" : {
		        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		         },
		         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		         "fnDrawCallback" : function(data) {
						com.leanway.getDataTableFirstRowId("generalInfo", ajaxLoadWorkCenterGroup,"more","checkList");
						 com.leanway.dataTableClickMoreSelect("generalInfo", "checkList", false,
                                 oTable, ajaxLoadWorkCenterGroup,undefined,undefined,"checkAll");

						 com.leanway.dataTableCheckAllCheck('generalInfo', 'checkAll', 'checkList');
//                         $('input[type="checkbox"]').icheck({
//                             labelHover : false,
//                             cursor : true,
//                             checkboxClass : 'icheckbox_flat-blue',
//                             radioClass : 'iradio_flat-blue'
//                         });
					}
		    } ).on('xhr.dt', function (e, settings, json) {
				com.leanway.checkLogind(json);
			} );

		return table;
	}

/**
 * 查询到右边显示
 * */
var ajaxLoadWorkCenterGroup =function (groupid) {

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/workCenterGroup",
		data : {
			"method" : "queryWorkCenterGroupObject",
			"groupid" : groupid,
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				setFormValue(tempData.workCenterGroup);
				setTableValue(tempData.workCenterList);
				com.leanway.formReadOnly("workCenterGroupForm");

			}
		}
	});

}
/**
 * 填充工作中心表格
 * @param data
 */
function setTableValue(data){
	var tableHeadHtml="";
	tableHeadHtml+="<tr>";
	tableHeadHtml+="<th>"+"工作中心编码"+"</th>"
	tableHeadHtml+="<th>"+"工作中心名称"+"</th>"
	tableHeadHtml+="<th>"+"资源数"+"</th>"
	tableHeadHtml+="<th>"+"类型"+"</th>"
	tableHeadHtml+="</tr>";
	$("#tableHead").html(tableHeadHtml);
	var tableBodyHtml = "";

	for (var i in data) {
		tableBodyHtml += " <tr>";
		tableBodyHtml += "  <td>"+data[i].centername+"</td>";
		tableBodyHtml += "  <td>"+data[i].shorname+"</td>";
		tableBodyHtml += "  <td>"+data[i].resourcescount+"</td>";
        tableBodyHtml += "  <td>"+data[i].centrtype+"</td>";
		tableBodyHtml += " </tr>";
	}

	$("#tableBody").html(tableBodyHtml);
}
/**
 * 删除数据
 * */
function deleteWorkCenterGroup( type ) {


	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");

	if (ids.length == 0) {

		lwalert("tipModal", 1, "请选择要删除的工作中心组!");
		return;

	} else {

		var msg = "确定删除选中的" + ids.split(",").length + "条工作中心组?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	}

}

function isSureDelete( type ){

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
	queryIsWorkCenterExsitIn(ids);

}
//判断工作中心组底下是否有工作中心，有则不删除
function queryIsWorkCenterExsitIn(ids){
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/workCenterGroup",
		data : {
			method : "queryIsWorkCenterExsit",
			"ids":ids,
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				if(tempData==1){
//					alert("该工作中心组底下存在工作中心，不能删除");
					lwalert("myModal", 1, "该工作中心组底下存在工作中心，不能删除！");
					return false;
				}else{
					deleteAjax(ids);
				}

			}
		},
		error : function(data) {

		}
	});
}
//删除Ajax
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/workCenterGroup?method=deleteWorkCenterGroup",
		data : {
			"conditions" : '{"workCenterGroupIds":"' + ids + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
				if (tempData.code == "1") {

					com.leanway.clearTableMapData( "generalInfo" );

					resetForm();
					oTable.ajax.reload();
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");
				}

			}
		}
	});
}
/**
 * 填充到HTML表单
 * */
function setFormValue (data) {

	resetForm();

	  for (var item in data) {
		  if (item != "searchValue") {
			  $("#" + item).val(data[item]);
		  }

	  }
	  if(data.url!=null){
		  $("#imageId").attr("src", "../../" + data.url);
	  }else{
	      $("#imageId").attr("src", "../../upload/noimg.jpg");
	  }
}

/**
 * 修改数据
 *
 * */
function updateWorkCenterGroup() {

	ope="updateWorkCenterGroup";
	var data = oTable.rows('.row_selected').data();
	if(data.length == 0) {
//		alert("请选择要修改的工作中心组！");
		lwalert("tipModal", 1, "请选择要修改的工作中心组！");
	} else if(data.length > 1) {
//		alert("只能选择一个工作中心组进行修改！");
		lwalert("tipModal", 1, "只能选择一个工作中心组进行修改！");
	}else{
		com.leanway.removeReadOnly("workCenterGroupForm");
		document.getElementById("groupname").readOnly=true;
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


/**
 * 新增
 *
 * */
var addWorkCenterGroup = function() {

		ope="addWorkCenterGroup";
		// 清空表单
		resetForm();
		$("#imageId").attr("src", "");
		$("#workcentergrouppath").val("");
		com.leanway.removeReadOnly("workCenterGroupForm");
		com.leanway.dataTableUnselectAll("generalInfo", "checkList");
		com.leanway.dataTableUnselectAll("generalInfo", "checkAll");
		com.leanway.clearTableMapData( "generalInfo" );
	//初始化省
}

function queryIsWorkCenterGroupExsit(){

	var groupname= $("#groupname").val();
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/workCenterGroup",
		data : {
			method : "queryIsWorkCenterGroupExsit",
			"groupname":groupname,
		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				if(!tempData.valid){
					if(!document.getElementById("groupname").readOnly){
	//				alert("工作中心组名称已存在");
						lwalert("tipModal", 1, "工作中心组名称已存在！");
					$("#groupname").val("");
					$("input[name='groupname']").focus();
					}
				}

			}
		},
		error : function(data) {

		}
	});
}

/**
 * 往里面存数据
 * */

var saveWorkCenterGroup = function() {

	var groupid= $("#groupid").val();
	var form  = $("#workCenterGroupForm").serializeArray();
	//后面确认时应 检测模具编号是否已存在
	var formData = formatFormJson(form);
	$("#workCenterGroupForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#workCenterGroupForm').data('bootstrapValidator').isValid()) { // 返回true、false
		if ($("#groupname").val()!=""){
			if(($("#workcentergrouppath").val()!=""&&$("#length").val()!=""&&$("#width").val()!=""&&$("#length").val()!=0&&$("#width").val()!=0)||$("#workcentergrouppath").val()==""){
			$.ajax ( {
				type : "POST",
				url : "../../../../"+ln_project+"/workCenterGroup",
				data : {
					"method":ope,
					"formData" : formData,
					"groupid":groupid
				},
				dataType : "text",
				async : false,
				success : function ( data ) {

					var flag =  com.leanway.checkLogind(data);

					if(flag){

						var tempData = $.parseJSON(data);
						if (tempData.code == "1") {
							com.leanway.formReadOnly("workCenterGroupForm");

							com.leanway.clearTableMapData( "generalInfo" );

							if(ope=="addWorkCenterGroup"){
							    oTable.ajax.reload();
							}else{
							    oTable.ajax.reload(null,false);
							}

							lwalert("tipModal", 1, "保存成功！");
						} else {
				//				alert("操作失败");
							lwalert("tipModal", 1, "操作失败！");
						}

					}
				}
			});
		}else{
			lwalert("tipModal", 1, "保存失败！图片已上传，请正确填写长和宽");
		}
		}else{
			lwalert("tipModal", 1, "工作中心组名称不能为空！");
		}
	}
}

/**
 * 重置表单
 *
 * */
var resetForm = function ( ) {
	$( '#workCenterGroupForm' ).each( function ( index ) {
        $('#workCenterGroupForm')[index].reset( );
    });
	$("#groupid").val("");
	$("#tableBody").html("");
	$("#tableHead").html("");
	$("#workCenterGroupForm").data('bootstrapValidator').resetForm();
}

var searchWorkCenterGroup= function () {

	var searchVal = $("#searchValue").val();

	oTable.ajax.url("../../../../"+ln_project+"/workCenterGroup?method=queryWorkCenterGroupList&searchValue=" + searchVal).load();
}


function selectFile(fileId) {

	$("#"+fileId).trigger("click");
}

//上传图片
function uploadFunc(input) {
	// 创建FormData对象

	var data = new FormData();
	// 为FormData对象添加数据
	var fileObj = document.getElementById(input).files[0];
	data.append("file", fileObj);
	if ($("#" + input).val() == "") {
		lwalert("tipModal", 1, "请选择图片上传");
		return;
	}
	// 发送数据
	$.ajax({
		url : "../../../../"+ln_project+"/workCenter?method=upload",
		type : 'POST',
		data : data,
		dataType : 'json',
		cache : false,
		contentType : false,
		processData : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				if (data.status == 'true') {
					var path = input.substr(0, input.length - 2);
					// 给隐藏域赋id
					$("#workcentergrouppath").val(data.id);

					$("#imageId").attr("src", "../../" + data.url);
					lwalert("tipModal",1, "上传成功");

					}else{
						lwalert("tipModal", 1, "请选择图片格式上传");
					}

			}
		},
		error : function() {
			lwalert("tipModal", 1,"上传出错,图片不能超过1M");

		}
	});

}
