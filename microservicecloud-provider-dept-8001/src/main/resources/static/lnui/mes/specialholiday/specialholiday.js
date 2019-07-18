var clicktime = new Date();
var oTable; /*命名规则 最好是oTable*/

var reg=/,$/gi; /*正则表达式*/

var ope = "addSpecialholiday";/*默认为新增*/
$(function() {
	initBootstrapValidator();
})
	function initBootstrapValidator() {
		$('#specialHolidayForm').bootstrapValidator(
				{
					excluded : [ ':disabled' ],
					fields : {
						shortname : {
							validators : {
								notEmpty : {},
								stringLength : {
									min : 2,
									max : 10
								}
							}
						},
						specialholidaydesc : {
							validators : {
								notEmpty : {},
								stringLength : {
									min : 2,
									max : 10
								}
							}
						},
						name : {
							validators : {
								notEmpty : {},
								stringLength : {
									min : 2,
									max : 20
								}
							}
						},
					}
				});
	}



$ ( function () { // 页面初始化加载
	initDateTimeYmdHms("starttime");
	initDateTimeYmdHms("endtime");
	com.leanway.formReadOnly("specialHolidayForm");
	com.leanway.loadTags();	// 初始化对象
	oTable = initTable();	// 加载datagrid，左侧列表

	//增加全选事件 (传入参数：tableId, checkAllId, checkBoxName, checkList=是initTable替换的name)
	com.leanway.dataTableCheckAll("specialHoliday", "checkAll", "checkList");

	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchSpecialHoliday);
	$("#saveOrUpdateAId").prop("disabled",true);
});


var searchSpecialHoliday = function () {

	var searchVal = $("#searchValue").val();

	oTable.ajax.url("../../../../"+ln_project+"/holiday?method=querySpecialHoliday&searchValue=" + searchVal).load();
}


/**
 * 新增
 */
var addSpecialholiday = function () {

	ope = "addSpecialHoliday";
	clearParam(); //清除内容

	/**
	 * 取消全选 (传入参数:tableId, checkBoxName)
	 */
	com.leanway.dataTableUnselectAll("specialHoliday", "checkList");
	$("#saveOrUpdateAId").prop("disabled",false);
	removeReadOnly(); //清除只读状态
	com.leanway.clearTableMapData( "specialHoliday" );

}

/**
 * 修改
 */
var showEditSpecialholiday = function () {
	//选择记录的数据
	var data = oTable.rows('.row_selected').data();

	if (data.length == 0) {
//		alert("请选择一条记录修改!");
		lwalert("tipModal", 1, "请选择一条记录修改！");
		return;
	}
	$("#saveOrUpdateAId").prop("disabled",false);
	removeReadOnly();//清除只读状态
	document.getElementById("name").readOnly=true;
	/**
	 * specialholidayid 把val中的值赋给specialholidayid(specialholidayid是form表单中的同名id)
	 */
	$("#specialholidayid").val(data[0].specialholidayid);

	// ajax中传类型 在 controller中找到同名入口
	ope = "updateByConditons";


}

function queryIsNameExsit(){
	var name= $("#name").val();
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/holiday",
		data : {
			method : "queryIsNameExsit",
			"name":name,
		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				if(!tempData.valid){
					if(!document.getElementById("name").readOnly){
	//				alert("工作中心组名称已存在");

						lwalert("tipModal", 1, "该名称已存在！");
						$("#name").val("");
					}
				}

			}
		},
		error : function(data) {

		}
	});
}

//加载记录
var loadSpecialholiday = function (specialholidayid) {

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/holiday",// 是来自basicData_dev.xml中<!-- Holiday controller --> bean  name="/holiday"
		data : {
			"method" : "querySpecialHolidayObject",// method:声明名称 传入 控制层的查询声明
			"specialholidayid" : specialholidayid //specialholidayid:控制层定义的传入参数名称：  值等于传入要查询的id
		},
		dataType : "json",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				//载入其他记录 例如:  loadDataInnerHtml( data );
				setFormValue(data);
				com.leanway.formReadOnly("specialHolidayForm");

			}
		}
	});

}

/*
 * 保存
 */
var saveOrUpdate=function(){

	var form  = $("#specialHolidayForm").serializeArray();
	var formData = formatFormJson(form);
	$("#specialHolidayForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#specialHolidayForm').data('bootstrapValidator').isValid()) { // 返回true、false
		if($("#starttime").val()!=""&&$("#starttime").val()!=null&&$("#endtime").val()!=""&&$("#endtime").val()!=""&&$("#starttime").val()<$("#endtime").val()){
			if($("#name").val()!=""){
			$.ajax ( {
				type : "post",
				url : "../../../../"+ln_project+"/holiday",
				data : {
					"method" : ope,
					"conditions" : formData
				},
				dataType : "text",
				async : false,
				success : function ( text ) {

					var flag =  com.leanway.checkLogind(text);

					if(flag){

						var temp = $.parseJSON(text);
						if (temp.status == "success") {
							tabmap.clear();
							colmap.clear();
							if(ope=="addSpecialholiday"){
                                oTable.ajax.reload(); // 自动刷新dataTable
                            }else{
                                oTable.ajax.reload(null,false);
                            }
							com.leanway.formReadOnly("specialHolidayForm");
							$("#saveOrUpdateAId").prop("disabled",true);
							lwalert("tipModal", 1, "保存成功！");
						} else {
			//				alert("操作失败");
							lwalert("tipModal", 1, "操作失败！");
						}

					}

				}
			});
			}else{
				lwalert("tipModal", 1, "请填写名称");
			}
		}else{
			lwalert("tipModal", 1, "请填写开始时间和结束时间，并且结束时间大于开始时间！");
		}
	}
}

//格式化form数据
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

//删除
var deleteSpecialholiday= function (type) {
//    var ids = com.leanway.getDataTableCheckIds("checkList");//含所有选择的记录

    if (type == undefined || typeof(type) == "undefined") {
        type = 2;
    }
    var ids = com.leanway.getCheckBoxData(type, "specialHoliday", "checkList");

    if (ids.length == 0) {
//    	alert("请选择要删除的记录!");
    	lwalert("tipModal", 1, "请选择要删除的记录！");
    	return;
    }
    else {
        var msg = "确定删除选中的" + ids.split(",").length + "条假期信息吗?";

    	lwalert("tipModal", 2, msg,"isSureDelete(" + type + ")");
//    	if (confirm("确定删除选中的记录?")) {
//    		ajaxDeleteSpecialholiday(ids);
//    	}
    }
}
function isSureDelete(type){
//	   var ids = com.leanway.getDataTableCheckIds("checkList");//含所有选择的记录
       var ids = com.leanway.getCheckBoxData(type, "specialHoliday", "checkList");

	   ajaxDeleteSpecialholiday(ids);
}
/**
 * 清除只读状态(传入参数： 表单Id列表)
 * 查找 <form class="form-horizontal" id="specialHolidayForm">
 */
var removeReadOnly = function () {
	com.leanway.removeReadOnly("specialHolidayForm");
}


//清除页面的数据，新增数据名称相应做添加
var clearParam = function () {

	// 数据为空时候，清除table数据以及隐藏文本框数据,str里面的值是HTML里面ID的值
	var str = "name,shortname,specialholidaydesc,starttime,endtime";

	var strArray = str.split(",");

	for (var i = 0; i< strArray.length; i ++) {
		$("#" + strArray[i]).val("");
	}

}

//ajax删除
var ajaxDeleteSpecialholiday = function (ids) {

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/holiday", // 是来自basicData_dev.xml中<!-- Holiday controller --> bean  name="/holiday"
		data : {
			"method" : "deleteSpecialholiday", //控制层的删除声明
			"paramData" : '{"specialHolidayids":"'+ ids +'"}'  //传入删除的IDS
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				if (text.status == "success") {
					oTable.ajax.reload();
					clearParam();

				}

			}

		}
	});

}



// 初始化数据表格
var initTable = function () {

	var table = $('#specialHoliday').DataTable( {
			"ajax": "../../../../"+ln_project+"/holiday?method=querySpecialHoliday",
			 "iDisplayLength" : "10",
	        'bPaginate': true,
	        "bDestory": true,
	        "bRetrieve": true,
	        "bFilter":false,
	        "bSort": false,
	        "bProcessing": true,
	        "bServerSide": true,
	        'searchDelay':"5000",
	        "columns": [
                {"data" : "specialholidayid"},
                { "data": "name" },
                { "data": "shortname" },

	         ],
	         "aoColumns": [
	               {
	            	   "mDataProp": "specialholidayid",
	                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
//	                       $(nTd).html("<input type='checkbox' name='checkList'  value='" + sData + "'>");
	                	   $(nTd).html("<div id='stopPropagation" + iRow +"'>"
								   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='checkList' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label>");
                           com.leanway.columnTdBindSelectNew(nTd,"specialHoliday","checkList");
	                   }
	               },
	               {"mDataProp": "name"},
	               {"mDataProp": "shortname"}


	          ],
//	          "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
	              //add selected class
//	        	  $(nRow).click(function () {
//
//	        		  // 清除标识以及隐藏数据
//
//
//	                  if ($(this).hasClass('row_selected')) {
//	                	  clearParam();
//	                	 // $("#name").val("");
//	                      $(this).removeClass('row_selected');
//	                      $(this).find('td').eq(0).find("input[name='checkList']").prop("checked", false)
//	                  } else {
//	                	  //点击之后显示  所需要的内容
//		        		 // loadDeviceCalendar(aData.calendarid);
//		        		  $("#name").val(aData.name);
//		        		  $("#shortname").val(aData.shortname);
//		        		  $("#specialholidaydesc").val(aData.specialholidaydesc);
//		        		  $("#starttime").val(aData.starttime);
//		        		  $("#endtime").val(aData.endtime);
//	                      //deviceCalendarTable.$('tr.row_selected').removeClass('row_selected');
//	                      $(this).addClass('row_selected');
//	                      $("input[name='checkList']").prop("checked", false);
//	                      $(this).find('td').eq(0).find("input[name='checkList']").prop("checked", true)
//	                  }
//	              });

//	          },
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
	         },
	         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
	        	   "fnDrawCallback" : function(data) {
	        	 com.leanway.getDataTableFirstRowId("specialHoliday", loadSpecialholiday,"more","checkList");
	        	 com.leanway.dataTableClickMoreSelect("specialHoliday", "checkList", false,
                    oTable, loadSpecialholiday,undefined,undefined,"checkAll");

	        	 com.leanway.dataTableCheckAllCheck('specialHoliday', 'checkAll', 'checkList');
	        	   }
	    } ).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );

	return table;
}

/**
 * 重置表单
 */
function resetForm(form ) {
    $('#' + form).each(function (index) {
        $('#' + form)[index].reset();
    });
    $('#'+form).data('bootstrapValidator').resetForm();
}

function setFormValue (data) {

	   resetForm("specialHolidayForm");
	  for (var item in data) {
		  if (item != "searchValue") {
			  $("#" + item).val(data[item]);

		  }
	  }
}