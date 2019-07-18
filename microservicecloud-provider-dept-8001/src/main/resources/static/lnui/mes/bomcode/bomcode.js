//改变checkbox形状
var clicktime = new Date();
var ope="addBomCode"
//数据table
var oTable;
$(function() {
	initBootstrapValidator();
	})
function initBootstrapValidator() {
	$('#bomCodeForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					name : {
						validators : {
							notEmpty : {},
							stringLength : {
								min : 2,
								max : 10
							}
						}
					},
					versiion : {
						validators : {
							notEmpty : {},
//							stringLength : {
//								min : 2,
//								max : 20
//							}
						}
					},
				}
			});
}
var readOnlyObj = [{"id":"saveOrUpdate","type":"button"}];
$ ( function () {
	// 初始化对象
	com.leanway.loadTags();
	// 加载datagrid
	oTable = initTable();
//	oTable.Init();
//	com.leanway.dataTableCheckAll("generalInfo", "checkAll", "checkList");
	com.leanway.formReadOnly("bomCodeForm",readOnlyObj);

	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchBomCode);

});

var searchBomCode = function () {

	var searchVal = $("#searchValue").val();

	oTable.ajax.url("../../../"+ln_project+"/bomCode?method=queryBomCodeList&searchValue=" + searchVal).load();
}

//初始化数据表格
var initTable = function () {

	var table = $('#generalInfo').DataTable( {
			"ajax": "../../../"+ln_project+"/bomCode?method=queryBomCodeList",
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
                {"data" : "bomcodeid"},
                { "data": "versiion" }
	         ],
	         "aoColumns": [
	               {
	            	   "mDataProp": "bomcodeid",
	                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
	                		$(nTd).html("<div id='stopPropagation" + iRow +"'>"
									   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                    + "' name='checkList' value='" + sData
                                    + "'><label for='" + sData
                                    + "'></label>");
							 com.leanway.columnTdBindSelectNew(nTd,"generalInfo","checkList");
	                   }
	               },
	               {"mDataProp": "versiion"},
	               {"mDataProp": "name"},
	          ],
	         "oLanguage" : {
	        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
	         },
	         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	         "fnDrawCallback" : function(data) {
					com.leanway.getDataTableFirstRowId("generalInfo", ajaxLoadBomCode,"more", "checkList");
					 com.leanway.dataTableClickMoreSelect("generalInfo", "checkList", false,
                             oTable, ajaxLoadBomCode,undefined,undefined,"checkAll");
					 com.leanway.dataTableCheckAllCheck('generalInfo', 'checkAll', 'checkList');
//                     $('input[type="checkbox"]').icheck({
//                         labelHover : false,
//                         cursor : true,
//                         checkboxClass : 'icheckbox_flat-blue',
//                         radioClass : 'iradio_flat-blue'
//                     });
				}
	    } ).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );

	return table;
}
//var initTable = function () {
//    var oTableInit = new Object();
//    //初始化Table
////    var oTableInit = function () {
//    	oTableInit = $('#generalInfo').bootstrapTable({
//
//            url: '../../bomCode?method=queryBomCodeList',         //请求后台的URL（*）
//            method: 'get',                      //请求方式（*）
//            toolbar: '#toolbar',                //工具按钮用哪个容器
//            striped: true,                      //是否显示行间隔色
//            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
//            pagination: true,                   //是否显示分页（*）
//            sortable: false,                     //是否启用排序
//            sortOrder: "asc",                   //排序方式
//            queryParams: queryParams,//传递参数（*）
//            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
//            pageNumber:1,                       //初始化加载第一页，默认第一页
//            pageSize: 10,                       //每页的记录行数（*）
//            pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
//            strictSearch: true,
//            clickToSelect: true,                //是否启用点击选中行
//            height: 460,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
//            uniqueId: "bomcodeid",                     //每一行的唯一标识，一般为主键列
//            cardView: false,                    //是否显示详细视图
//            detailView: false,                   //是否显示父子表
//            search: true,                        //是否显示搜索文本框
//            showRefresh: true,                   //是否显示刷新按钮
//            showColumns: true,
//            showToggle: true,
//            singleSelect: false,                 //是否单选
//            selectItemName: "checkList",         //checkbox
//            maintainSelected:"true",
//            silent: true,
//            showExport: true,//显示导出按钮
//            exportDataType: "basic",//导出类型
//            //行样式调整
//            rowStyle: function (row, index) {
//                //这里有5个取值代表5中颜色['active', 'success', 'info', 'warning', 'danger'];
//                var strclass = "";
//                if (row.status == 0) {
//                    strclass = 'info';//还有一个active
//                }
//
//                return { classes: strclass }
//            },
//            columns: [{
//
//            	 //field:'bomcodeid',
//                 checkbox: true,
//
//                },{
//
//                field: 'versiion',
//                title: '版本号',
//                sortable: true,
//                editable:true,
//            }
//                ],
//
//
//               //父子表
////                onExpandRow: function (index, row, $detail) {
////                	oTableInit.InitSubTable(index, row, $detail);
////                },
//
//                //表内编辑
//                onEditableSave: function (field, row, oldValue, $el) {
//                	alert(field)
//                    $.ajax({
//                        type: "get",
//                        url: "../../bomCode?method=updateBomCode",
//                        data: { formData: JSON.stringify(row) },
//                        success: function (data, status) {
//                            if (status == "success") {
//                                alert("编辑成功");
//                            }
//                        },
//                        error: function () {
//                            alert("Error");
//                        },
//                        complete: function () {
//
//                        }
//
//                    });
//                },
//            //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
//            //设置为limit可以获取limit, offset, search, sort, order
//             queryParamsType : "limit",
//             onLoadSuccess: function(data){
//            	 com.leanway.checkLogind(data);
//            	 console.info(data)
//            	 //lwalert("tipModal", 1, "加载成功")
//              },
//              onLoadError: function(){  //加载失败时执行
//            	  lwalert("tipModal", 1, "加载失败")
//              },
//
//             //点击行
//             onClickRow: function(row,obj){
//                  console.info(row)
//                  obj.css("background-color", "green");
//            	ajaxLoadBomCode(row.bomcodeid);
//            	},
//
//
//
//        });
//    	//初始化子表格(无线循环)
//    	oTableInit.InitSubTable = function (index, row, $detail) {
//
//    	    var parentid = row.bomcodeid;
//    	    var cur_table = $detail.html('<table></table>').find('table');
//    	    $(cur_table).bootstrapTable({
//    	        url: '../../bomCode?method=queryBomCodeList',
//    	        method: 'get',
//    	        queryParams: { bomcodeid: parentid },
//    	        ajaxOptions: { bomcodeid: parentid },
//    	        clickToSelect: true,
//    	        detailView: true,//父子表
//    	        uniqueId: "bomcodeid",
//    	        pageSize: 10,
//    	        pageList: [10, 25],
//    	        columns: [{
//    	            checkbox: true
//    	        }, {
//    	            field: 'versiion',
//    	            title: '版本'
//    	        }, {
//    	            field: 'name',
//    	            title: '说明'
//    	        }],
//    	        //无线循环取子表，直到子表里面没有记录
//    	        onExpandRow: function (index, row, $Subdetail) {
//    	        	oTableInit.InitSubTable(index, row, $Subdetail);
//    	        }
//    	    });
//    	};
//
////    };
//    	//$('#generalInfo').bootstrapTable('hideColumn', 'bomcodeid');  //隐藏列
//    return oTableInit;
//};
////得到查询的参数
//function queryParams(params) {
//var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
//    limit: params.limit,   //页面大小
//    offset: params.offset,  //页码
//    versiion: params.search, //搜索框中输入的值
//
//
//};
//
//
//return temp;
//};



// 查询到右边显示
var ajaxLoadBomCode =function (bomcodeid) {

	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/bomCode",
		data : {
			"method" : "queryBomCodeObject",
			"bomcodeid" : bomcodeid,
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

            var flag =  com.leanway.checkLogind(data);
			if(flag){

				var tempData = $.parseJSON(data);
				setFormValue(tempData.resultObj);
			}
		}
	});
	com.leanway.formReadOnly("bomCodeForm",readOnlyObj);
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
var addBomCode = function() {

	ope="addBomCode";
	// 清空表单
	resetForm();
	com.leanway.removeReadOnly("bomCodeForm",readOnlyObj);
	com.leanway.dataTableUnselectAll("generalInfo", "checkList");
	com.leanway.dataTableUnselectAll("generalInfo", "checkAll");
	//初始化省

	com.leanway.clearTableMapData( "generalInfo" );
}

/**
 * 修改数据
 *
 * */
function updateBomCode() {

	ope="updateBomCode";

//    var data = $.map(oTable.bootstrapTable('getSelections'), function (row) {
//       return row;
//    });

	var data = oTable.rows('.row_selected').data();
	if(data.length == 0) {
//		alert("请选择要修改的物料清单！");
		lwalert("tipModal", 1, "请选择要修改的物料清单版本")
	} else if(data.length > 1) {
//		alert("只能选择一个物料清单进行修改！");
		lwalert("tipModal", 1, "只能选择一个物料清单版本进行修改")
	}else{
		com.leanway.removeReadOnly("bomCodeForm",readOnlyObj);
		document.getElementById("versiion").readOnly=true;
	}
}

/**
 * 往里面存数据
 * */

var saveBomCode= function() {

	var form  = $("#bomCodeForm").serializeArray();
	//后面确认时应 检测模具编号是否已存在
	var formData = formatFormJson(form);
	$("#bomCodeForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#bomCodeForm').data('bootstrapValidator').isValid()) { // 返回true、false
		if($("#versiion").val()!=""){
				$.ajax ( {
					type : "POST",
					url : "../../../"+ln_project+"/bomCode",
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

								com.leanway.clearTableMapData( "generalInfo" );

								com.leanway.formReadOnly("bomCodeForm",readOnlyObj);

								if(ope=="addBomCode"){
								    oTable.ajax.reload();
								}else{
								    oTable.ajax.reload(null,false);
								}
								lwalert("tipModal", 1, "保存成功");
							} else {
					//				alert("操作失败");
								lwalert("tipModal", 1, "操作失败");
							}
						}
					}
				});
		}else{
			lwalert("tipModal", 1, "版本号不能为空");
		}
	}
}

function deleteBomCode(type){

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}
	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
	if (ids.length != 0) {

        //var msg = "确定删除选中的" + ids.length + "条物料清单版本?";
        var msg = "确定删除选中的" + ids.split(",").length + "条物料清单版本?";
		lwalert("tipModal", 2, msg ,"isSure(" + type + ")");
		return;
	} else {
//		alert("至少选择一条记录进行删除操作");
		lwalert("tipModal", 1, "至少选择一条记录进行删除操作");
	}
}

function isSure(type) {

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
	deleteAjax(ids);
}
//删除物料追踪单
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/bomCode?method=deleteBomCode",
		data : {
			"conditions" : '{"bomCodeIds":"' + ids + '"}'
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
    $( '#bomCodeForm' ).each( function ( index ) {
        $('#bomCodeForm')[index].reset( );
    });
    $("#bomCodeForm").data('bootstrapValidator').resetForm();
}

function versionIsExist(){

	var versiion= $("#versiion").val();
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/bomCode",
		data : {
			method : "versionIsExist",
			"versiion":versiion,
		},
		dataType : "text",
		success : function(data) {

            var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				if(!tempData.valid){
					if(!document.getElementById("versiion").readOnly){
	//				alert("版本号已存在");
						lwalert("tipModal", 1, "版本号已存在")
					$("#versiion").val("");
					$("input[name='versiion']").focus();
					}
			 }
			}
		},
		error : function(data) {

		}
	});
}
