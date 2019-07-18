
var clicktime = new Date();
var thisTime=new Date();

var productorIssuedTable;
var units;
// 单位转换
var unitconversionList;
var oTable;
// 单位转换状态（新增，修改）
var unitstatus ='';
var ope="";
var vtable = null;

var readOnlyObj = [{"id":"saveOrUpdateAId","type":"button"},{"id":"acquisition","type":"radio"},{"id":"serialnumber","type":"radio"},{"id":"batch","type":"radio"},{"id":"barcode","type":"radio"},{"id":"saveProductorVersion","type":"button"}];


$ ( function () {
	// 初始化对象
	com.leanway.loadTags();

	// 初始化子公司datatable
	//productorIssuedTable = initProductorCompanyTable();


	// 校验
	initBootstrapValidator();


	com.leanway.buildTag();
	// 加载datagrid
	oTable = initTable();

	// 查询单位
	//queryUnits();

	// 页面初始化只读
	com.leanway.formReadOnly("ProductorsForm,pvform", readOnlyObj);
 
	// 初始化select2事件
	//com.leanway.initSelect2("#equipmentid", "../../../../"+ln_project+"/productors?method=loadEquipmentname", "请输入设备编号");


	// 子公司全选
// com.leanway.dataTableCheckAll("productorIssued","checkCompany","checkSonCompany");


	// 取消全选
// com.leanway.dataTableUnselectAll("productorIssued","checkSonCompany");


	// 选中时触发的事件
	//com.leanway.dataTableClick("productorIssued","checkSonCompany",true,productorIssuedTable,undefined,undefined,undefined);

	// 设置按钮 是否可用 true 不可以 false 可用
	//buttonStatus(true);

	// 加载工作中心
// loadWorkCenter();
	// 加载设备台账
// loadEquipmentname();
	// 加载所有的产品计量单位
//	loadUnits();
	// 加载所有的产品种类
	loadProtype();
	// 查找产品关联的总公司
//	selectHeadCompany();
	// 加载产品类别
	loadProductorcategoryid();
	// enter键时候触发查询
	com.leanway.enterKeyDown("queryProductorsname", queryProductorByName);

})

/**
 * 
 * 新增时 清空表单 并且查找出总公司下的所有子公司
 * 
 */
var addProductors = function() {
 
	ope="saveProductors";

	com.leanway.removeReadOnly("ProductorsForm",readOnlyObj);

	// 清空表单
	resetForm();
	com.leanway.clearTableMapData( "generalInfo" );

	com.leanway.dataTableUnselectAll("generalInfo", "checkList");
	com.leanway.dataTableUnselectAll("generalInfo", "checkAll");
	
	$("#ptype,#pversion").show();

	// 新增时查找该公司下的所有子公司
	//var levels=$('#levels').val();
	//searchProductorsCompany(levels);

	// 自动勾选
	//$('#checkCompany').click();


}


// 加载所有的产品种类
function loadProtype(){
	$.ajax ( {
		type : "get",
		url : "../../../../"+ln_project+"/productors?method=findAllProtype",
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			    var json = eval("(" + data + ")")

				var protype = json.productorTypes;
				var html="";

				for (var i = 0;i<protype.length;i++) {
					/**
					 * option 的拼接
					 */
					html +="<option value="+ protype[i].productortypeid+">"+protype[i].productortypemask + "|" + protype[i].productortypename+"</option>";
				}
				$("#ProductorsForm #productortypeid").html(html);
				$("#pvform #productortypeid").html(html);
			}
		}
	});
}

// 加载产品类别
function loadProductorcategoryid(){
	$.ajax ( {
		type : "get",
		url : "../../../../"+ln_project+"/productors?method=loadProductorcategoryid",
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			    var json = eval("(" + data + ")")

				var productorcategoryid = json.data;
				var html="";

				for (var i = 0;i<productorcategoryid.length;i++) {
					/**
					 * option 的拼接
					 */
					html +="<option value="+ productorcategoryid[i].productorcategoryid+">"+ productorcategoryid[i].categoryname+"</option>";
				}
				$("#ProductorsForm #productorcategoryid").html(html);
				$("#pvform #productorcategoryid").html(html);
			}
		}
	});
}

/**
 * 查找产品总公司
 * 
 */
function selectHeadCompany(){
	$.ajax ( {
		type : "get",
		url : "../../../../"+ln_project+"/productors?method=selectHeadCompany",
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			    var json = eval("(" + data + ")")

				var headcompany = json.pHeadListConditions;
				if(headcompany!=null){
					setHeadCompany(headcompany);
				}
			}
		}
	});
}

// 加载总公司数据
function setHeadCompany(headcompany){
	var html="";
	/**
	 * option 的拼接
	 */
	if(headcompany!=null){

		html +="<option value="+ headcompany.compid+">"+ headcompany.compname+"</option>";
		$("#headcompanyid").html(html);

	}



	// 隐藏模糊查询子公司条件
	$("#levels").val(headcompany.levels);
}
// 加载所有的计量单位
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
				$("#salesunitsid").html(html);
				$("#purchaseunits").html(html);
				$("#packunits").html(html);
			}
		}
	});
}
// 加载工作中心
function loadWorkCenter(){
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/badProductionReason",
		data : {
			"method" : "queryWorkCenter",
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			    var json = eval("(" + data + ")")

				var center =json.workCenters;
				var html="<option value=' '>请选择</option>";

				for (var i = 0;i<center.length;i++) {
					/**
					 * option 的拼接
					 */
					html +="<option value="+ center[i].centerid+">"+ center[i].centername+"</option>";
				}
				$("#centerid").html(html);

			}
		}
	});
}

// 校验
function initBootstrapValidator() {
	$('#ProductorsForm').bootstrapValidator({
		excluded: [':disabled'],
		fields: {
			productorname: {
				validators: {
					notEmpty: {},
				}
			},specification: {
				validators: {
					notEmpty: {},
				}
			},productordesc: {
				validators: {
					notEmpty: {},
				}
			},
// centerid: {
// validators: {
// notEmpty: {},
// }
// },
		}
	});
}

/**
 * 判断是否产品名称重复
 */

var judgeByProductorName = function() {

	var judgeBackValue;
	var productorname= $("#productorname").val();

	if(productorname==""||productorname==null){

		lwalert("tipModal", 1, "产品编码名称不能为空！");
		return;
	}
		// 后面确认时应 检测模具编号是否已存在
		$.ajax ( {
			type : "POST",
			url : "../../../../"+ln_project+"/productors",
			data : {

				method : "judgeByProductorName",
				"productorname":productorname,
			},
			dataType : "text",
			async : false,
			success : function ( data ) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

				    var tempData = $.parseJSON(data);

					if (tempData.productorsNameNum >=1) {
						lwalert("tipModal", 1, "产品名称已被占用,请重新填写产品编码");
						judgeBackValue=false;
					}else {
						judgeBackValue=true;
					}
				}
			}
		});

	return judgeBackValue;
}

function isSureCheck(){
	var judgeBackValue;
	var productorname= $("#productorname").val();
	queryProductorName(productorname);
	judgeBackValue=false;
}


// 初始化数据表格
var initTable = function() {
	var table = $('#generalInfo')
	.DataTable(
			{
				"ajax" : "../../../../"+ln_project+"/productors?method=findAllProductors",
				// "iDisplayLength" : "10",
				'bPaginate' : true,
				"bDestory" : true,
				"bRetrieve" : true,
				"bFilter" : false,
				"bSort" : false,
				/*"scrollY":"57vh",*/
				"bAutoWidth": true,  // 宽度自适应
				"bProcessing" : true,
				"bServerSide" : true,
				'searchDelay' : "5000",
				"columnDefs": [ {
				    "targets": 2,
				    "data": "productordesc",
				    "render": function ( data, type, full, meta ) {
				      return type === 'display' && data.length > 12 ?
				        '<span title="'+data+'">'+data.substr( 0, 10 )+'...</span>' :
				        data;
				    }
				  } ],
				"aoColumns" : [
				               {
				            	   "mDataProp": "productorid",
				            	   "fnCreatedCell" : function(nTd, sData,
				            			   oData, iRow, iCol) {
				            		   $(nTd)
				            		   .html("<div id='stopPropagation" + iRow +"'>"
				            				   +"<input class='regular-checkbox' type='checkbox' id='"
				            				   + sData
				            				   + "' name='checkList' value='"
				            				   + sData
				            				   + "'><label for='"
				            				   + sData
				            				   + "'></label> </div>");
                                       com.leanway.columnTdBindSelectNew(nTd,"generalInfo","checkList");
				            	   }
				               },
				               {"mDataProp": "productorname"},
				               {"mDataProp": "productordesc" },
				               ],
				               "oLanguage" : {
				            	   "sUrl" : "../../../jslib/datatables/zh-CN.txt"
				               },
				               "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
				               "fnDrawCallback" : function(data) {

				            	   com.leanway.getDataTableFirstRowId("generalInfo",ajaxLoadProductors, "more","checkList");

				            	   // 点击事件
				            	   com.leanway.dataTableClickMoreSelect("generalInfo","checkList",false,oTable,ajaxLoadProductors,undefined,undefined,"checkAll");

				            	   com.leanway.dataTableCheckAllCheck('generalInfo', 'checkAll', 'checkList');
				               },

			});

	return table;
}


/**
 * 查询到右边显示
 */
function queryProductorName(productorname) {

	if(productorname==undefined){
		productorname = $("#productorname").val();
	}
	// 显示的时候不能修改
	com.leanway.formReadOnly("ProductorsForm",readOnlyObj);
	document.getElementById("printBarcodebutton").disabled=false;
	var queryProductorsname= $("#queryProductorsname").val();// name

	if(productorname!=null){

		searchByName(productorname);

	}else{
		if(queryProductorsname==null||queryProductorsname==""){
// alert("查询的产品编号不能为空");
			lwalert("tipModal", 1, "查询的产品编号不能为空！");
		}else{
			searchByName();
		}
	}
}

function searchByName(productorname){
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/productors?method=findAllProductorsObject",
		data : {
			"productorname" : productorname,
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			    var result = eval("(" + data + ")");

				// 填充form表单
				setFormValue(result.productorsConditions);
				// 加载总公司数据productorIssued=null;
				if (result.headcompanyid!=null) {
				//	setHeadCompany(result.headcompanyid);
				}
				//selectCompnayproductorsByProid(result.productorsConditions.productorid);
			}
		},error : function ( data ) {
			lwalert("tipModal", 1, "error");
		}
	});

}

/**
 * 查询到右边显示
 */
var ajaxLoadProductors =function (productorid) {
	
	var so = new Object();
	var sqlJsonArray = new Array()
	
	so.productorid = productorid;

	var productoridObj = new Object();
	productoridObj.fieldname = "productorid";
	productoridObj.fieldtype = "varchar";
	productoridObj.value = productorid;
	productoridObj.logic = "and";
	productoridObj.ope = "=";
	sqlJsonArray.push(productoridObj);
	
	so.sqlDatas = sqlJsonArray;
	
	var conditions = "&conditions=" + com.leanway.encodeURI(so);
 
	if (vtable == null || vtable == undefined || typeof(vtable) == "undefined") {
		// 初始化产品的版本
		vtable = initVTable(conditions);
	} else {
		vtable.ajax.url('../../../../'+ln_project+'/productors?method=queryProductorVersionForPage' + conditions).load();
	}


	// 显示的时候不能修改
	com.leanway.formReadOnly("ProductorsForm", readOnlyObj);

	//selectCompnayproductorsByProid(productorid);
	$("#ptype,#pversion").hide();
//

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/productors",

		data : {
			method : "findAllProductorsObject",
			"productorid" : productorid,
		},

		dataType : "text",

		success : function ( data ) {
			var flag =  com.leanway.checkLogind(data);

			if(flag){

			    var result = eval("(" + data + ")");

				setFormValue(result.productorsConditions);

				// 加载单位转换
				// ajaxUnitConversion(productorid);
				// 如果有选中行，则将按钮打开
				/*var data = oTable.rows('.row_selected').data();
				if(data.length > 0) {
					buttonStatus(false);
				}
				if (result.headcompanyid!=null) {
					setHeadCompany(result.headcompanyid);
				}*/
			}
		}
	});

}

var initVTable = function ( conditions ) {

	//com.leanway.checkSession();
	var table = $('#vtable').DataTable( {
		"ajax": '../../../../'+ln_project+'/productors?method=queryProductorVersionForPage' + conditions,
		'bPaginate': false,
		"bDestory": true,
		"bRetrieve": true,
		"bFilter":false,
		"bSort": false,
		"bProcessing": true,
		"bServerSide": false,
		"aoColumns": [
              {
	        	  "mDataProp": "versionid",
	        	  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
	//		            		  $(nTd).html("<input type='checkbox' name='saveEmployeeCheckList'  value='" + sData + "'>");
	        		  $(nTd)
	        		  .html("<div id='stopPropagation" + iRow +"'>"
	        				  +"<input class='regular-checkbox' type='checkbox' id='"
	        				  + sData
	        				  + "' name='vCheckList' value='"
	        				  + sData
	        				  + "'><label for='"
	        				  + sData
	        				  + "'></label>");
	        		  com.leanway.columnTdBindSelect(nTd);
	        	  }
              },
              {"mDataProp": "version"},
              {"mDataProp": "versionname"}
              ],
              "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
            	  
              },
              "oLanguage" : {
            	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
              },"fnDrawCallback" : function(data) {

            	   com.leanway.getDataTableFirstRowId("vtable", queryProductorVersion, "more","vCheckList");
            	   // 点击事件
            	   com.leanway.dataTableClickMoreSelect("vtable","vCheckList",false,vtable,queryProductorVersion,undefined,undefined,"vCheckAll");
            	   com.leanway.dataTableCheckAllCheck('vtable', 'vCheckAll', 'vCheckList');
            	   
               },

	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
		com.leanway.dataTableUnselectAll("vtable", "vCheckAll");
		com.leanway.dataTableUnselectAll("vtable", "vCheckList");
		
	} );

	return table;
	
}

var queryProductorVersion = function (versionId) {
	
	com.leanway.formReadOnly("pvform",[{"id":"saveProductorVersion","type":"button"}]);	
	
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/productors",
		data : {
			"method" : "queryProductorVersion",
			"versionid" : versionId
		},
		dataType : "json",
		async : true,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
				
				com.leanway.setFormValue("pvform", data);
			     
			}
		},error : function ( data ) {
			lwalert("tipModal", 1, "ajax error！");
		}
	});
	
}

var ajaxUnitConversion = function(productorid){

	 $("#unitConversionTable tbody").html('');

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/unitConversion",
		data : {
			method : "findUnitConversionByProductionid",
			"productorid" : productorid,
		},

		dataType : "text",

		success : function ( data ) {
			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var jdata = $.parseJSON(data);
			    unitconversionList = jdata.unitList;
				setUnitConversion(unitconversionList);

			}
		}
	});
}

// 模糊查询
function queryProductorByName(){

	var searchValue = $("#queryProductorsname").val();

	oTable.ajax.url("../../../../"+ln_project+"/productors?method=queryProductorByName&searchValue=" + searchValue).load();
}
/**
 * 根据产品id 查找子公司
 * 
 * @author 熊必强
 */
function selectCompnayproductorsByProid(productorid){


	productorIssuedTable.ajax.url("../../../../"+ln_project+"/productors?method=selectCompnayproductorsByProid&productorid=" + productorid).load();

}
/**
 * 删除数据
 */
function deleteProductors(type){

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");

	if (ids.length>0) {
        var msg = "确定删除选中的" + ids.split(",").length + "个产品?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	} else {
// alert("至少选择一条记录进行删除操作");
		lwalert("tipModal", 1, "至少选择一条记录进行删除操作！");
	}
}

function isSureDelete(type){

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
	deleteAjax(ids);

}
// 删除Ajax
var deleteAjax = function(ids) {

	$.ajax({

		type : "post",
		url : "../../../../"+ln_project+"/productors",
		data : {
			method : "deleteProductors",
			"conditions" : '{"productorids":"' + ids + '"}'
		},

		dataType : "text",
		async : false,

		success : function(text) {
			var flag =  com.leanway.checkLogind(text);

			if(flag){
			    var tempData = $.parseJSON(text);
			    com.leanway.clearTableMapData( "generalInfo" );
				oTable.ajax.reload(null,false);
			}
		}
	});

}
/**
 * 填充到HTML表单
 */
function setFormValue (data) {
// resetForm();
    $("#ProductorsForm").data('bootstrapValidator').resetForm();
	var equipmentid = data.equipmentid;
	var equipmentname = data.equipmentname;
	if (equipmentid == null || equipmentid == "" || equipmentid == "null") {
		equipmentid="";
		equipmentname="";
	}
	/*$("#equipmentid").append(
			'<option value=' + equipmentid + '>' + data.equipmentname
			+ '</option>');
	$("#equipmentid").select2("val", [ equipmentid ]);*/

	var radioNames = "batch,barcode,serialnumber";
	for ( var item in data) {
		
		if(radioNames.indexOf(item) != -1) {
			if(data[item]==null){
				data[item]=1;
			}
			$("input[type=radio][name=" + item + "][value=" + data[item] + "]").prop('checked',true);
		} else {
			if (item != "searchValue") {
				$("#" + item).val(data[item]);
			}

		}

	}
}
// 触发select2选择事件，给隐藏域赋值
$("#equipmentid").on("select2:select", function(e) {

	$("#equipmentname").val($(this).find("option:selected").text());

	// var orderid = $(this).find("option:selected").val()
});


/**
 * 修改数据
 * 
 */
function modifyProductors() {

	ope="updateProductors";


	// 判断被勾选的状态
	var data = oTable.rows('.row_selected').data();

	if(data.length == 0) {
// alert("请选择要修改的产品！");
		lwalert("tipModal", 1, "请选择要修改的产品！");
	} else if(data.length > 1) {
// alert("只能选择一个产品进行修改！");
		lwalert("tipModal", 1, "只能选择一个产品进行修改！");
	}else{

		// 获取选中的数据 填充到右边进行修改
		$("#bodygeneralInfo").find('tr').each(function (index, temp) {
			// 获取datatable被选中的数据
			if ($(this).hasClass('row_selected')) {
				var productorid=$(this)[0].cells[0].children[0].children[0].value;
				ajaxLoadProductors(productorid);
			}

		});

		com.leanway.removeReadOnly("ProductorsForm",readOnlyObj);

		document.getElementById('productorname').readOnly=true;

		$("#headcompanyid").attr({
			"disabled" : "disabled"
		});
		buttonStatus(false);

		// 将datatable code 字段变成可修改
		$("#bodyproductorIssued").find('tr').each(function (index, temp) {
			// 获取datatable被选中的数据

			// alert($(this).find("td:nth-child(3)").html());

			// 这句话没作用？？、=================================================
			$(this).find("td:nth-child(3)").html("<input type='text' value='"+$(this).find("td:nth-child(3)").html()+"'>");

		});
		$("#connectioncompid").removeAttr("disabled");
	}


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

// 新增时加载子公司datatable
var searchProductorsCompany = function (levels) {

	productorIssuedTable.ajax.url("../../../../"+ln_project+"/productors?method=selectCompnayproductors&levels=" + levels).load();

}

// 定义ProductorCompanyTable 对象

var initProductorCompanyTable = function() {

	var table = $('#productorIssued')
	.DataTable(
			{
				"ajax" : "../../../../"+ln_project+"/productors?method=selectCompnayproductors",
				"iDisplayLength" : "10",
				'bPaginate' : true,
				"bDestory" : true,
				"bRetrieve" : true,
				"bFilter" : false,
				"bSort" : false,
				"bProcessing" : true,
				"bServerSide" : true,
				'searchDelay' : "5000",
				"columns" : [ {
					"data" : "compid"
				} ],
				"aoColumns" : [
				               {
				            	   "mDataProp": "compid",
				            	   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
				            		// $(nTd).html("<div id='stopPropagation"+
									// iRow +"<input type='checkbox'
									// name='checkSonCompany' value='" + sData +
									// "'>");
				            		   $(nTd)
				            		   .html("<div id='stopPropagation" + iRow +"'>"
				            				   +"<input class='regular-checkbox' type='checkbox' id='"
				            				   + sData
				            				   + "' name='checkSonCompany' value='"
				            				   + sData
				            				   + "'><label for='"
				            				   + sData
				            				   + "'></label> </div>");
				            		   com.leanway.columnTdBindSelect(nTd);
				            	   }
				               },
				               {"mDataProp": "compname" },
				               {"mDataProp": "code" ,
				            	   "sDefaultContent": '<input type="text" name="code" id="code" >'
				               },
				               ],
				               /*
								 * "columnDefs": [ { "targets": [ 1 ],
								 * //隐藏第1列，从第0列开始 "visible": false } ] ,
								 */
				               "oLanguage" : {
				            	   "sUrl" : "../../../jslib/datatables/zh-CN.txt"
				               },
				               "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
				               "fnDrawCallback" : function(data) {

// $('input[name="checkSonCompany"]').icheck({
// labelHover : false,
// cursor : true,
// checkboxClass : 'icheckbox_flat-blue',
// radioClass : 'iradio_flat-blue'
// });
				               },

			}).on('xhr.dt', function (e, settings, json) {
				com.leanway.checkLogind(json);
			} );

	return table;
}

// 格式化form数据
var  formatFormJsonForProductorsCompany = function  (formData) {

	var reg=/,$/gi;

	var data = "{";

	for (var i = 0; i < formData.length; i++) {

		var tempVal = formData[i].value;

		if (formData[i].name == "productorsCompanyVal" ) {
			if (tempVal == "") {
				tempVal = "[]";
			}

		} else {

			if (tempVal == "") {
				tempVal = "\"\"";
			} else {
				tempVal = "\"" + tempVal + "\"";
			}
		}

		data += "\"" +formData[i].name +"\" : "+tempVal+",";

	}

	data = data.replace(reg,"");

	data += "}";

	return data;
}
/**
 * 往里面存数据
 */

var saveProductors = function() {

	var barcodevalue=$("#barcodevalue").val();
	 
	if(barcodevalue==null||barcodevalue==""||barcodevalue==" "){
		produceBarCode();
	}

	// 新增时判断是否有关键字段 也就是产品编号不能重复
	if(ope=="saveProductors"){
		var judgeValue=judgeByProductorName();
		// 存在为假
		if(judgeValue==true){

			saveOrUpdate();
		}

	}
	// 修改时 不需要判断
	else{

		saveOrUpdate();

	}

}

/**
 * 增加或者是修改
 * 
 */
function saveOrUpdate(){
	// 校验
	$("#ProductorsForm").data('bootstrapValidator').validate();


	if($('#ProductorsForm').data('bootstrapValidator').isValid()){


		// 获取修改的产品编号
		var productorname=$('#productorname').val();


		// 获取datatable子公司数据
		var reg=/,$/gi;
		var productorsCompanyVal = "[";

		$("#bodyproductorIssued").find('tr').each(function (index, temp) {


			// 获取datatable被选中的数据
			if ($(this).hasClass('row_selected')) {

				// var
				// senderid=$(this)[0].cells[0].children[0].children[0].value;
				var senderid=$(this)[0].cells[0].children[0].value;

				var code=($(this).find("td:nth-child(3)").find("input").val());

				productorsCompanyVal += "{\"senderid\" : \""+senderid+"\",\"code\":\""+code+"\"}," ;
			}

		});
		productorsCompanyVal = productorsCompanyVal.replace(reg,"");
		productorsCompanyVal += "]";
		// datatable 中的数据放到formData中
		$('#productorsCompanyVal').val(productorsCompanyVal);

//		var	unitsData = "{\"unitList\" : " + getTableDataToJson("unitConversionTable") +"}";

// if(ope=='updateProductors'){
//
// saveUnitConversion();
// }
		// 序列化 以及格式化
		var form  = $("#ProductorsForm").serializeArray();
		var formData = formatFormJsonForProductorsCompany(form);
		var equipmentid=$("#equipmentid").val();
		var str = '';
		var ids = str.substr(0, str.length - 1);
		$.ajax ( {
			type : "POST",
			url : "../../../../"+ln_project+"/productors",
			data : {
				"method" : ope,
				"formData" : formData
				/*"unitsData": unitsData*/
			},
			dataType : "text",
			async : false,
			success : function ( data ) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

				// var tempData = $.parseJSON(data);
				    var tempData=eval("(" + data + ")");
				    com.leanway.clearTableMapData( "generalInfo" );
				    if(ope=="saveProductors"){
				    	if(tempData.status=='error'){
				    		lwalert("tipModal", 1, tempData.info);
				    	}else{
				    		lwalert("tipModal", 1, tempData.info);
				    		oTable.ajax.reload();
				    	}
					}else{
						if(tempData.status=='error'){
				    		lwalert("tipModal", 1, tempData.info);
				    		console.info(tempData.info)
				    	}else{
				    		lwalert("tipModal", 1, tempData.info);
				 // oTable.ajax.reload();
				    		oTable.ajax.reload(null,false);
				    	}
					}
				    buttonStatus(true);
			// ajaxLoadProductors(tempData.resultObj.productorid);
				}
			}
		});

	}
	else {
// alert("填写字符不合法");
		lwalert("tipModal", 1, "填写字符不合法！");
	}
}
/**
 * 增加单位转换
 */
var addUnitConversion = function(){
	  var data = oTable.rows('.row_selected').data();
		if(data.length == 0) {
		    lwalert("tipModal", 1, "请选择数据！");
		    return;
		}else if(data.length>1){
		    lwalert("tipModal", 1, "只能选择一条数据进行新增!");
		    return;
		}

	if(unitstatus == 'updateUnitConversion'){
		unitstatus == 'updateUnitConversion'
	}else{
		unitstatus = 'addUnitConversion';
	}
	var i = $("#unitConversionTable tbody:eq(0)").find("tr").length;

// if(i!=0){
// i = getLastIdNumber("inoutTable");
// }
	// getAttribute
			$("#unitConversionTable tbody:eq(0)").append("<tr> " +
					"<td style=''><input style='width' type = 'checkbox' name='unitconversionid' id='unitconversionid"+i+"' value='' class='regular-checkbox' ><label for='unitconversionid"+i+"'></td>" +
					"<td style='width:25%'><input  class='form-control' type='text' name='count1' id='count1"+i+"'   ></td>" +
					"<td style='width:15%'> <select class='form-control' id='unitsid1"+i+"' name='unitsid1' ></select></td>"+
					"<td style='text-align:center;'><span style='font-size:20px;'>=<span></td>"+
					"<td style='width:25%'><input class='form-control' type='text' name='count2' id='count2"+i+"'  ></td>" +
					"<td style='width:15%'> <select class='form-control' id='unitsid2"+i+"' name='unitsid2' ></select></td>"+// "<td><input
																																// type
																																// =
																																// 'text'
																																// id='practicalcount"+i+"'
																																// name='practicalcount'
																																// class='form-control'
																																// /></td>"
																																// +
				// "<td style='display:none'> <input class='form-control'
				// type='hidden' id='stockunits"+i+"' name='stockunits' value
				// =''/></td>"+
					" </tr>");
			setUnits(units,"unitsid1"+i,"unitsid2"+i);
}
/**
 * 删除单位转换
 */
var deleteUnitConversion = function(){

	unitstatus ='updateUnitConversion';
	var data = $("#unitConversionTable tbody input[type=checkbox]:checked");
	if(data.length == 0) {
		lwalert("tipModal", 1, "请选择需要删除的数据!");
		return;
	}

// if(unitstatus =='addUnitConversion'){
		$("input[name=unitconversionid]:checked").each(function(index){

			$(this).parent().parent().remove();
		})
		return;

// }
		// var inventoryid = oTable.rows('.row_selected').data()[0].inventoryid;
}
/**
 * 修改单位转换
 */
var editUnitConversion = function(){
	unitstatus = 'updateUnitConversion';
	  var data = oTable.rows('.row_selected').data();
	    if(data.length == 0) {
	        lwalert("tipModal", 1, "请选择数据进行修改!");
	    }else if(data.length>1){
	        lwalert("tipModal", 1, "只能选择一条数据进行修改!");
	    }else{
	    // var tableBodyHtml;
	    	 $("#unitConversionTable tbody").html('');
	    	for(var i in unitconversionList){

	    		$("#unitConversionTable tbody:eq(0)").append("<tr> " +
						"<td style=''><input style='width' type = 'checkbox' name='unitconversionid' id='unitconversionid"+i+"'  class='regular-checkbox' ><label for='unitconversionid"+i+"'></td>" +
						"<td style='width:25%'><input  class='form-control' type='text' name='count1' id='count1"+i+"'   ></td>" +
						"<td style='width:15%'> <select class='form-control' id='unitsid1"+i+"' name='unitsid1' ></select></td>"+
						"<td style='text-align:center;'><span style='font-size:20px;'>=<span></td>"+
						"<td style='width:25%'><input class='form-control' type='text' name='count2' id='count2"+i+"'  ></td>" +
						"<td style='width:15%'> <select class='form-control' id='unitsid2"+i+"' name='unitsid2' ></select></td>"+// "<td><input
																																	// type
																																	// =
																																	// 'text'
																																	// id='practicalcount"+i+"'
																																	// name='practicalcount'
																																	// class='form-control'
																																	// /></td>"
																																	// +
					// "<td style='display:none'> <input class='form-control'
					// type='hidden' id='stockunits"+i+"' name='stockunits'
					// value =''/></td>"+
						" </tr>");
				setUnits(units,"unitsid1"+i,"unitsid2"+i);

	    		$("#unitconversionid"+i).val(unitconversionList[i].unitconversionid);
	    		console.info(unitconversionList[i].unitconversionid)
	    		$("#count1"+i).val(unitconversionList[i].count1);
	    		$("#unitsid1"+i).val(unitconversionList[i].unitsid1);
	    		$("#count2"+i).val(unitconversionList[i].count2);
	    		$("#unitsid2"+i).val(unitconversionList[i].unitsid2);
	    	}
	   // $("#unitConversionTable tbody").html(tableBodyHtml);
	    }
}
/**
 * 保存单位转换
 */
var saveUnitConversion = function(){

	var data = oTable.rows('.row_selected').data();

	if(data.length == 0) {
// alert("请选择要修改的产品！");
		lwalert("tipModal", 1, "请选择对应的产品！");
	} else if(data.length > 1) {
// alert("只能选择一个产品进行修改！");
		lwalert("tipModal", 1, "只能选择一个产品！");
	}else{
		var productorid = data[0].productorid
		var	formdata = "{\"unitList\" : " + getTableDataToJson("unitConversionTable") +"}";

		var method = '';
		if(unitstatus == 'addUnitConversion'){
			method = "addUnitConversionForProductor"
		}else if(unitstatus == 'updateUnitConversion'){
			method = "updateUnitConversion"
		}
		if(method == '' || method == undefined){
			return;
		}
		if(formdata.unitList == ''){
			lwalert("tipModal", 1, "无数据，保存失败！");
		}
		$.ajax ( {
			type : "post",
			url : "../../../../"+ln_project+"/unitConversion",
			data : {
				"method" : method,
				"formdata" : formdata,
				"productorid":productorid
			},
			dataType : "json",
// async : false,
			success : function ( text ) {

				var flag =  com.leanway.checkLogind(text);

				if(flag){
					if(text.status == 'success'){
						lwalert("tipModal", 1, text.info);

						 com.leanway.clearTableMapData("generalInfo");
			        	// com.leanway.dataTableUnselectAll("generalInfo","unitconversionid");

						oTable.ajax.reload();
						unitstatus = '';
					}else{
						lwalert("tipModal", 1, text.info);
					}
					buttonStatus(false);

				}

			}
		});


	}

}


/**
 * 同步数据
 */
var dataSync = function(){

	$("#dataSync").prop("disabled", true);
	$("#dataSync").html("同步中...");
	$.ajax ( {
		type : "post",
		 url : "../../../../"+ln_project+"/dataSync",
		//url : "../../../../"+ln_project+"/dataSync?method=startExcelImport&typ=productor",
		data : {
			"method" : "addDataSync",
			"synctype" : 0
		},
		dataType : "json",
// async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){
				if(text.status == 'success'){
					lwalert("tipModal", 1, text.info);
					oTable.ajax.reload();
				}else{
					lwalert("tipModal", 1, text.info);
				}
				$("#dataSync").prop("disabled", false);
				$("#dataSync").html("同步数据");

			}

		}
	});

}



// 查询计量单位
function queryUnits() {

	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/units",
		data : {
			method : "queryUnitsList",
			conditions : "{}"
		},
		dataType : "json",
		success : function(json) {

			var flag =  com.leanway.checkLogind(json);

			if(flag){

				// 下拉框赋值
			// setUnits(json.data);
			units = json.data;
			}
		},
		error : function(data) {

		}
	});
}

// 初始化单位类型下拉框
var setUnits = function(data,id1,id2) {
	var html = "";

	for (var i in data) {
		// 拼接option
		html +="<option value="+ data[i].unitsid+">"+ data[i].unitsname+"</option>";
	}

	$("#"+id1).html(html);
	$("#"+id2).html(html);
}


var setUnitConversion = function(data){
	var tableBodyHtml;
	for(var i in data){
    	tableBodyHtml += "<tr>";
    	tableBodyHtml += "<td ><input type = 'checkbox' name='unitconversionid' id='unitconversionid"+i+"' value= '"+data[i].unitconversionid+"' class='regular-checkbox' ><label for='unitconversionid"+i+"'></td>";
    	tableBodyHtml +="<td>"+data[i].count1+"</td>";
    	tableBodyHtml +="<td>"+data[i].unitsname1+"<input type='hidden' value='"+data[i].unitsid1+"' /></td>";

    	tableBodyHtml +="<td style='text-align:center;'>=</td>";
    	tableBodyHtml +="<td>"+data[i].count2+"</td>";
    	tableBodyHtml +="<td>"+data[i].unitsname2+"<input type='hidden' value='"+data[i].unitsid1+"'/></td>";
    	tableBodyHtml += "</tr>";
// $("#unticonversionid"+i).val(data[i].unticonversionid);
// $("#count1"+i).val(data[i].count1);
// $("#unitsid1"+i).val(data[i].unitsid1)
// $("#count2"+i).val(data[i].count2);
// $("#unitsid2"+i).val(data[i].unitsid2)
    }
	 $("#unitConversionTable tbody").html(tableBodyHtml);
}

function getTableDataToJson(tableId){
    var reg = /,$/gi;

    // 解析Table数据，值为空的跳过
    var tableJson = "[";

    $("#" + tableId + " tbody:eq(0) tr").each(function(index) {

    		tableJson += "{\"unitconversionid\":\""
				+ $(this).find("td:eq(0)").find("input").val()
                + "\",\"count1\":\""
                if($(this).find("td:eq(1)").find("input[type=text]").val() != undefined){
                	tableJson += $(this).find("td:eq(1)").find("input").val()
                }else{
                	tableJson += $(this).find("td:eq(1)").text()
                }
    		tableJson += "\",\"unitsid1\":\""
                 if($(this).find("td:eq(2)").find("select").val() != undefined){
                	 tableJson += $(this).find("td:eq(2)").find("select").val()
                 }else{
                	 tableJson += $(this).find("td:eq(2)").find("input").val()
                 }
    		tableJson += "\",\"count2\":\""
                 if($(this).find("td:eq(4)").find("input[type=text]").val() !=undefined){
                	 tableJson += $(this).find("td:eq(4)").find("input").val()
                 }else{
                	 tableJson += $(this).find("td:eq(4)").text()

                 }
    		tableJson += "\",\"unitsid2\":\""
                 if($(this).find("td:eq(5)").find("select").val() != undefined){
                	 tableJson += $(this).find("td:eq(5)").find("select").val()
                 }else{
                	 tableJson += $(this).find("td:eq(5)").find("input").val()
                 }
    		tableJson += "\"},";



    })
    tableJson = tableJson.replace(reg, "");

    tableJson += "]";
    return tableJson;
}
// 改变按钮状态
function buttonStatus(boolean){

//	$("#addUnitConversion").attr("disabled",boolean);
//	$("#editUnitConversion").attr("disabled",boolean);
//	$("#deleteUnitConversion").attr("disabled",boolean);
//	$("#saveUnitConversion").attr("disabled",boolean);

}

/**
 * 重置表单
 * 
 */
var resetForm = function ( ) {
	$( '#ProductorsForm' ).each( function ( index ) {
		$('#ProductorsForm')[index].reset( );
		$("#productorid").val("");
		$("#compid").val("");
	});
	// select2 清空
	// $("#productorname").val(null).trigger("change");
	$("#equipmentname").val("");
	$("#equipmentid").val("").trigger("change");

}

/**
 * 
 * 条形码打印
 * 
 */
function generateBarcode(){
	$("#myModal").modal("show");
	var value = $.trim($("#barcodevalue").val());
	var btype = "code128";
	var renderer = "css";
	var settings = {
			output:"css",
			bgColor: "#FFFFFF",
			color: "#000000",
			barHeight: "50" ,
			moduleSize: "5",
			posX: "10",
			posY: "20",
			addQuietZone: "1"
	};
	if (renderer == 'canvas'){
		clearCanvas();
		$("#barcodeTarget").hide();
		$("#canvasTarget").show().barcode(value, btype, settings);
	} else {
		$("#canvasTarget").hide();
		$("#barcodeTarget").html("").show().barcode(value, btype, settings);
	}
}
// 清除模态框
function clearCanvas(){
	var canvas = $('#canvasTarget').get(0);
	var ctx = canvas.getContext('2d');
	ctx.clearRect (0, 0, canvas.width, canvas.height);
	ctx.strokeRect (0, 0, canvas.width, canvas.height);
}
// 打印机打印
function printBarcode(){
	retainAttr=true;
	$("#printarea").printArea();
}


// 条码生产
function produceBarCode(){
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/codeTemplate",
		data : {
			"method" : "getSerialTemplate",
			"tablename":"productors",
			"column":"barcodevalue",
			"type":"1",
		},
		dataType : "text",
		async : false,
		success : function ( data ) {
			var flag =  com.leanway.checkLogind(data);

			if(flag){
				var tempData = $.parseJSON(data);
				document.getElementById("barcodevalue").value=tempData;

			}
		},
		error : function (  ) {
			lwalert("tipModal", 1, "error");
		}
	});
}

var addPv = function ( ) {
	
	com.leanway.dataTableUnselectAll("vtable", "vCheckList");
	com.leanway.dataTableUnselectAll("vtable", "vCheckAll");
	
	com.leanway.removeReadOnly("pvform",[{"id":"saveProductorVersion","type":"button"}]);
	
	$( '#pvform' ).each( function ( index ) {
		$('#pvform')[index].reset( );
	});
	
	$("#versionid").val("");
}

var editPv = function ( ) {
	
	var versionId = com.leanway.getDataTableCheckIds("vCheckList");
	
	if (versionId == "" || versionId.indexOf(",") != "-1") {
		lwalert("tipModal", 1, "请选择一条数据进行修改！");
	} else {
		com.leanway.removeReadOnly("pvform",[{"id":"saveProductorVersion","type":"button"}]);
	}
	
}

var saveProductorVersion = function ( ) {
	
	var pvData = com.leanway.formatForm("#pvform");
	var productorid = $("#productorid").val();
	
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/productors",
		data : {
			"method" : "saveProductorVersion",
			"pvData" : pvData,
			"productorid" : productorid
		},
		dataType : "json",
		async : true,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
				
				if ( data.status == "success" ) {
					vtable.ajax.reload();
				} else {
					lwalert("tipModal", 1, data.info);
				}
			     
			}
		},error : function ( data ) {
			lwalert("tipModal", 1, "ajax error！");
		}
	});
	
}