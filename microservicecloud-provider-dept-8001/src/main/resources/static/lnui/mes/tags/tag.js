
//操作方法, 新增或者修改
var ope = "add";

//数据table
var tagTable;

var clicktime = new Date();

$( function () {

	// 初始化对象
	com.leanway.loadTags();

	//初始化表格
	tagTable = initTable();

	//初始化表单验证
	initBootstrapValidator();

	// 绑定事件
	$("#saveTag").click( saveTag );

	// 初始化时间
	com.leanway.initTimePickYmdForMoreId("#startTime,#endTime");

	// 全选
	/*$("#checkAll").on("click", function ( ) {
		if ($(this).prop("checked") === true) {
			$("input[name='checkList']").prop("checked", $(this).prop("checked"));
			$('#tagDataTable tbody tr').addClass('row_selected');
		} else {
			$("input[name='checkList']").prop("checked", false);
			$('#tagDataTable tr').removeClass('row_selected');
			        }
		 	});*/

	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchTags);
});

var searchTags = function () {

	var searchVal = $("#searchValue").val();

	tagTable.ajax.url("../../../../"+ln_project+"/tag?method=getTagList&searchValue=" + searchVal).load();
}

var addTag = function ( ) {

	ope = "add";

	// 切换标题
	$("#tagModalLabel").html("新增对象");

	// 清空表单
	resetFrom();

	// 加载一级菜单节点
	loadMenuList();

	$('#tagModal').modal({backdrop: 'static', keyboard: false});

	$("#id").prop("disabled",false);
	$("#firLevelMenu").prop("disabled",false);
	$("#menuId").prop("disabled",false);
}

var showEditTag = function () {
	// 获取选中的对象
	var tagId = getDataTableSelectedId();

	if (tagId == "" || tagId.length == 0) {
		lwalert("tipModal", 1, "请选择对象进行修改！");
		return;
	}

	if (tagTable.rows('.row_selected').data().length > 1) {
		lwalert("tipModal", 1, "请选择一个对象进行修改！");
		return;
	}

	loadMenuList(tagId);
	// 切换方法
	ope = "update";

	// 切换标题
	$("#tagModalLabel").html("修改对象");

	getTag(tagId);

	$("#id").prop("disabled",true);
	$("#firLevelMenu").prop("disabled",true);
	$("#menuId").prop("disabled",true);
}

var firLevelsChange = function () {

	var menuId = $("#firLevelMenu").val();
	/*	 var tagId = $("#tagId").val();*/
	loadSecMenuList(menuId);
}

// 加载一级节点
var loadMenuList = function (tagId) {

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/tag",
		data : {
			"method" : "getMenuList",
			"tagId" : tagId
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var selectHtml = "";
				var selectedId = "";

				for (var i in text) {

					if (tagId != null && $.trim(tagId) != "" ) {

						var selected = "";

						if (text[i].selected == "true") {
							selected = 'selected="selected"';
							selectedId = text[i].menuid;
						}

						selectHtml +='<option ' + selected + ' value="' +  text[i].menuid + '">' + text[i].name + '</option>';

					} else {
						selectHtml +='<option value="' +  text[i].menuid + '">' + text[i].name + '</option>';
					}

				}

				if (selectedId == "") {
					selectedId = text[0].menuid;
				}

				$("#firLevelMenu").html(selectHtml);

				loadSecMenuList(selectedId);
			}

		}
	});

}

// 加载二级节点
var loadSecMenuList =  function (menuId) {

	$.ajax ( {
		type : "POST",
		url : "../../../../"+ln_project+"/tag",
		data : {
			"method" : "getMenuList",
			"menuId" : menuId
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var selectHtml = "";
				for (var i in text) {
					selectHtml +='<option value="' +  text[i].menuid + '">' + text[i].name + '</option>';
				}
				// 二级节点
				$("#menuId").html(selectHtml);

			}
		}

	});

}


//加载用户数据
var  getTag = function ( tagId ) {

	$.ajax ( {
		type : "POST",
		url : "../../../../"+ln_project+"/tag?method=getTag",
		data : {
			"tagId" : tagId
		},
		dataType : "text",
		async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				// 表单赋值
				setFormValue(text);
				$('#tagModal').modal({backdrop: 'static', keyboard: false});

			}
		}
	});
}

var saveTag = function () {
	$("#firLevelMenu").prop("disabled",false);
	$("#menuId").prop("disabled",false);
	$("#id").prop("disabled",false);
	var form  = $("#tagForm").serializeArray();
	var formData = formatFormJson(form);
	console.info(formData);

	// 提交前先验证
	$("#tagForm").data('bootstrapValidator').validate();

	// 返回true、false
	if ($('#tagForm').data('bootstrapValidator').isValid()) {
	  $.ajax ( {
	  	  type : "post",
		  url : "../../../../"+ln_project+"/tag" ,
		  data : {
			"method"   : ope ,
			"formData" : formData
		  },
		  dataType : "json",
		  async : false,
		  success : function ( result ) {

			var flag =  com.leanway.checkLogind(result);

			if(flag){

				//var result =  $.parseJSON( $.trim( text ) );

				if (result.status == "true") {

					var colsmap = tabmap.get("tagDataTable");
					colsmap.clearmap();

					$('#tagModal').modal('hide');

					if (ope == "add") {
						tagTable.ajax.reload();
					} else {
						tagTable.ajax.reload(null, false);
					}

				} else {
	//				alert(result.info);
					lwalert("tipModal", 1, result.info);
				}

			}

		}
	});
  }
}

var deleteTag = function ( type ) {

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "tagDataTable", "checkList");

	if (ids.length == 0) {

		lwalert("tipModal", 1, "请选择要删除的对象!");
		return;

	} else {

		var msg = "确定删除选中的" + ids.split(",").length + "条对象?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	}


}

function isSureDelete( type ) {
	var ids = com.leanway.getCheckBoxData(type, "tagDataTable", "checkList");
	deleteAjax(ids);
}
//删除Ajax
var deleteAjax = function (ids) {

	$.ajax ( {
		type : "POST",
		url : "../../../../"+ln_project+"/tag",
		data : {
			"method" : "delete",
			"ids" : ids
		},
		dataType : "json",
		async : false,
		success : function ( result ) {

			var flag =  com.leanway.checkLogind(result);

			if(flag){

				if (result.status == "true") {

					var colsmap = tabmap.get("tagDataTable");
					colsmap.clearmap();

					$('#tagModal').modal('hide');
					tagTable.ajax.reload();

				} else {
	//				alert(result.info);
					lwalert("tipModal", 1, result.info);
				}

			}

		}
	});

}

//初始化数据表格
var initTable = function () {

	var table = $('#tagDataTable').DataTable( {
		"ajax": "../../../../"+ln_project+"/tag?method=getTagList",
		/* "iDisplayLength" : "10",*/
		'bPaginate': true,
		"bDestory": true,
		"bRetrieve": true,
		"bFilter":false,
		"bSort": false,
		"bProcessing": true,
		"bServerSide": true,
		'searchDelay':"5000",
		"columns": [
		            {"data" : "tagid"},
		            {"data" : "tagname"},
		            {"data" : "type"},
		            {"data" : "mname"},
		            { "data": "id" },
		            { "data": "name" },
		            { "data": "event" },
		            { "data": "starttime"},
		            { "data": "endtime"}
		            ],
		            "aoColumns": [
		                          {
		                        	  "mDataProp": "tagid",
		                        	  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
		                        		  //         $(nTd).html("<input type='checkbox' name='checkList'  value='" + sData + "'>");
		                        		  $(nTd)
		                        		  .html("<div id='stopPropagation" + iRow +"'>"
		                        				  +"<input class='regular-checkbox' type='checkbox' id='"
		                        				  + sData
		                        				  + "' name='checkList' value='"
		                        				  + sData
		                        				  + "'><label for='"
		                        				  + sData
		                        				  + "'></label> </div>");
	                                         com.leanway.columnTdBindSelectNew(nTd,"tagDataTable","checkList");
		                        	  }
		                          },
		                          {"mDataProp": "tagname"},
		                          {"mDataProp": "type"},
		                          {"mDataProp" : "mname"},
		                          {"mDataProp": "id"},
		                  /*        {"mDataProp": "name"},*/
		                          {"mDataProp": "eventname" }/*,
		                          {"mDataProp": "starttime"},
		                          {"mDataProp": "endtime"}*/
		                          ],
		                          "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
		                        	  //add selected class
		                        	  $(nRow).click(function () {

		                        	  });
		                          },
		                          "oLanguage" : {
		                        	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		                          },
		                          "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		                          "fnDrawCallback" : function(data) {

		                        	  //点击事件
		                        	  com.leanway.dataTableClickMoreSelect("tagDataTable","checkList",false,tagTable,undefined,undefined,undefined);
		                        	  com.leanway.setDataTableSelectNew("tagDataTable",
		                                      null, "checkList", null);
		                          },
	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );

	return table;
}

//获取勾选的的DataTable
var getDataTableChecktDatas = function ( ) {

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

//获取选中的dataTable数据
var getDataTableSelectedId = function () {

	var tagId  = "";

	if (tagTable.rows('.row_selected').data().length > 0 ) {
		tagId= tagTable.rows('.row_selected').data()[0].tagid;
	}

	return tagId;
}

//给form赋值
var setFormValue = function (data) {

	resetFrom();

	var json = eval("(" + data + ")")

	for (var item in json) {

		if (item != "password") {
			$("#" + item).val(json[item]);
		}
	}
}

//格式化form数据
var  formatFormJson = function  (formData) {

	var reg=/,$/gi;

	var data = "{";

	for (var i = 0; i < formData.length; i++) {

		if (formData[i].name  != "firLevelMenu") {

			data += "\"" +formData[i].name +"\" : \""+formData[i].value+"\",";

		}
	}

	data = data.replace(reg,"");

	data += "}";

	return data;
}

//初始化时间
//var initTimePick = function  (timeId) {
//	$( "#" + timeId ).datetimepicker ( {
//		lang:'ch',
//		format:"Y-m-d",      //格式化日期
//		timepicker:false,    //关闭时间选项
//		yearStart:2000,     //设置最小年份
//		yearEnd:2050,        //设置最大年份
//		todayButton:false    //关闭选择今天按钮
//	} );
//}

/**
 * 重置表单
 */
var resetFrom = function ( ) {
	$( '#tagForm' ).each( function ( index ) {
		$('#tagForm')[index].reset( );
	});

	//清空Boots的提示
	 $("#tagForm").data('bootstrapValidator').resetForm();
}


function initBootstrapValidator( ) {
	//对应的表单id
	$('#tagForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					tagName : {
						validators: {
							notEmpty: {
								message: '对象名称不能为空'
							}
							}
					},
					id : {
						validators: {
							notEmpty: {
								message: 'id不能为空'
							}
							}
					}

				}
			})
}
