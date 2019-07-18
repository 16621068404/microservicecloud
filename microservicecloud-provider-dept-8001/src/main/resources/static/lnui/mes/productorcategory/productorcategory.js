//改变checkbox形状
var clicktime = new Date();
var ope="addProductorCategory"
//数据table
var oTable;
$(function() {
	initBootstrapValidator();
	})
function initBootstrapValidator() {
	$('#productorCategoryForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					categoryname: {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 2,
								max : 10
							}
						}
					},

				}
			});
}

$ ( function () {
	// 初始化对象
	com.leanway.loadTags();
	// 加载datagrid
	oTable = initTable();
//	com.leanway.dataTableCheckAll("generalInfo", "checkAll", "checkList");
	com.leanway.formReadOnly("productorCategoryForm");
	com.leanway.enterKeyDown("searchValue", searchCategory);
	loadUnits();
	$("#saveOrUpdate").attr({
		"disabled" : "disabled"
	});

});
//加载所有的计量单位
function loadUnits(){

	$.ajax ( {

		type : "get",
		url : "../../../../"+ln_project+"/productors?method=findAllUnitsid",
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			    var json = eval("(" + data + ")")

				var units = json.units;

				var html="";

				for (var i = 0;i<units.length;i++) {
					/**
					 * option 的拼接
					 */
					html +="<option value="+ units[i].unitsid+">"+ units[i].unitsname+"</option>";
				}
				$("#unitsid").html(html);
			}
		}
	});
}
//初始化数据表格
var initTable = function () {

	var table = $('#generalInfo').DataTable( {
			"ajax": "../../../../"+ln_project+"/productorCategory?method=queryProductorCategoryList",
			// "iDisplayLength" : "6",
	        'bPaginate': true,
	        "bDestory": true,
	        "bRetrieve": true,
	        "bFilter":false,
	        "bSort": false,
	        "scrollY":"57vh",
	        "bProcessing": true,
	        "bServerSide": true,
	        'searchDelay':"5000",
	        "columns": [
                {"data" : "productorcategoryid"},
                { "data": "categoryname" }
	         ],
	         "aoColumns": [
	               {
	            	   "mDataProp": "productorcategoryid",
	                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
	                	   $(nTd).html("<div id='stopPropagation" + iRow +"'>"
								   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='checkList' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label>");
						 com.leanway.columnTdBindSelectNew(nTd,"generalInfo", "checkList");
	                   }
	               },
	               {"mDataProp": "categoryname"},
	          ],
	         "oLanguage" : {
	        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
	         },
	         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	         "fnDrawCallback" : function(data) {
					com.leanway.getDataTableFirstRowId("generalInfo", ajaxLoadProductorCategory,"more", "checkList");
					 com.leanway.dataTableClickMoreSelect("generalInfo", "checkList", false,
                             oTable, ajaxLoadProductorCategory,undefined,undefined,"checkAll");

					 com.leanway.dataTableCheckAllCheck('generalInfo', 'checkAll', 'checkList');
				}
	    } ).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );

	return table;
}

// 查询到右边显示
var ajaxLoadProductorCategory =function (productorcategoryid) {

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/productorCategory",
		data : {
			"method" : "queryProductorCategoryObject",
			"productorcategoryid" : productorcategoryid,
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				$("#saveOrUpdate").attr({
					"disabled" : "disabled"
				});
				setFormValue(tempData.resultObj);

			}
		}
	});
	com.leanway.formReadOnly("productorCategoryForm");
}
// 填充到HTML表单
function setFormValue (data) {
	resetForm();
	for (var item in data) {
		if (item != "searchValue") {

			$("#" + item).val(data[item]);
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



/**
 * 新增
 *
 * */
var addProductorCategory = function() {

	ope="addProductorCategory";

	$("#saveOrUpdate").removeAttr("disabled");
	// 清空表单
	resetForm();
	com.leanway.removeReadOnly("productorCategoryForm");
	com.leanway.dataTableUnselectAll("generalInfo", "checkList");
	com.leanway.dataTableUnselectAll("generalInfo", "checkAll");
	com.leanway.clearTableMapData( "dispatchDataTable" );
}

/**
 * 修改数据
 *
 * */
function updateProductorCategory() {

	ope="updateProductorCategory";
	var data = oTable.rows('.row_selected').data();
	if(data.length == 0) {
		lwalert("tipModal", 1, "请选择要修改产品分类")
	} else if(data.length > 1) {
		lwalert("tipModal", 1, "只能选择一个产品分类进行修改")
	}else{
		$("#saveOrUpdate").removeAttr("disabled");
		com.leanway.removeReadOnly("productorCategoryForm");
	}
}

/**
 * 往里面存数据
 * */

var saveProductorCategory= function() {

	var form  = $("#productorCategoryForm").serializeArray();
	//后面确认时应 检测模具编号是否已存在
	var formData = formatFormJson(form);
	$("#productorCategoryForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#productorCategoryForm').data('bootstrapValidator').isValid()) { // 返回true、false
		if($("#categoryname").val()!=""){
				$.ajax ( {
					type : "POST",
					url : "../../../../"+ln_project+"/productorCategory",
					data : {
						"method":ope,
						"formData" : formData,
					},
					dataType : "text",
					async : false,
					success : function ( data ) {

						var flag =  com.leanway.checkLogind(data);

						if(flag){

							var tempData = $.parseJSON(data);
							if (tempData.code == "1") {
								com.leanway.formReadOnly("productorCategoryForm");

								com.leanway.clearTableMapData( "dispatchDataTable" );
								if(ope=="addProductorCategory"){
								    oTable.ajax.reload();
								}else{
								    oTable.ajax.reload(null,false);
								}

								lwalert("tipModal", 1, "保存成功");
							} else {
								lwalert("tipModal", 1, "操作失败");
							}

						}
					}
				});
		}else{
			lwalert("tipModal", 1, "分类名称不能为空");
		}
	}
}

function deleteProductorCategory(type){

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
	if (ids.length > 0) {
        var msg = "确定删除选中的" + ids.split(",").length + "条产品分类?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	} else {
		lwalert("tipModal", 1, "至少选择一条记录进行删除操作");
	}
}

function isSureDelete(type) {
	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
	deleteAjax(ids);
}
//删除物料追踪单
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/productorCategory?method=deleteProductorCategory",
		data : {
			"conditions" : '{"ids":"' + ids + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
				if (tempData.code == "1") {
					resetForm();
					com.leanway.clearTableMapData( "dispatchDataTable" );
					oTable.ajax.reload(null,false);
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败")
				}

			}
		}
	});
}
var resetForm = function () {
    $( '#productorCategoryForm' ).each( function ( index ) {
        $('#productorCategoryForm')[index].reset( );
    });
    $("#productorCategoryForm").data('bootstrapValidator').resetForm();
}

function categorynameIsExist(){

	var categoryname= $("#categoryname").val();
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/productorCategory",
		data : {
			method : "categorynameIsExist",
			"categoryname":categoryname,
		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				if(!tempData.valid){
					if(!document.getElementById("categoryname").readOnly&&ope=="addProductorCategory"){
						lwalert("tipModal", 1, "分类名称已存在")
					$("#categoryname").val("");
					$("input[name='categoryname']").focus();
					}
				}

			}
		},
		error : function(data) {

		}
	});
}
var searchCategory= function () {

	var searchVal = $("#searchValue").val();

	oTable.ajax.url("../../../../"+ln_project+"/productorCategory?method=queryProductorCategoryList&searchValue=" + searchVal).load();
}
