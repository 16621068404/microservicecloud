//改变checkbox形状
var clicktime = new Date();
var ope;
//数据table
var readOnlyObj = [{"id":"saveOrUpdateAId","type":"button"}];
var oTable;
$ ( function () {

	//设置input不可用
	com.leanway.formReadOnly("produForm",readOnlyObj);
	//设置radio只读
	$("input[type='radio']").prop("disabled","disabled");
	// 初始化对象
	com.leanway.loadTags();

	// 加载datagrid
	oTable = initTable();

	//初始化数据验证
	initBootstrapValidator()

	com.leanway.dataTableCheckAll("employeeDataTable", "checkAll", "checkList");

	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchProductType);

	//查询产品类型
	getCompanyCode("productortype",5, "#compantPropertyId", "-----产品类型-----");

	//产品类型状态
	getcode("productortype",6);


});

var searchProductType = function () {

	var searchVal = $("#searchValue").val();

	oTable.ajax.url("../../../../"+ln_project+"/producttype?method=findAllprodu&searchValue=" + searchVal).load();
}


//初始化数据表格
var initTable = function() {

	var table = $('#producttypeDataTable')
	.DataTable(
			{
				"ajax": "../../../../"+ln_project+"/producttype?method=findAllprodu",
				//	"iDisplayLength" : "10",
				'bPaginate' : true,
				"bDestory" : true,
				"bRetrieve" : true,
				"bFilter" : false,
				"bSort" : false,
				"sScrollY" : "57vh", // DataTables的高
				// "sScrollX" : 400, // DataTables的宽
				"bAutoWidth" : true, // 宽度自适应
				"bProcessing" : true,
				"bServerSide" : true,
				'searchDelay' : "5000",
				"columns" : [ {
					"data" : "productortypeid"
				}, {
					"data" : "productortypename"
				}, {
					"data" : "value"
				} ],
				"aoColumns" : [
				               {
				            	   "mDataProp" : "productortypeid",
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
				            				   + "'></label>");
			                           com.leanway.columnTdBindSelectNew(nTd,"producttypeDataTable","checkList");
				            	   }
				               },
				               {
				            	   "mDataProp" : "productortypemask"
				               },{
				            	   "mDataProp" : "productortypename"
				               },
				               ],
				               "oLanguage" : {
				            	   "sUrl" : "../../../jslib/datatables/zh-CN.txt"
				               },
				               "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
				               "fnDrawCallback" : function(data) {

				            	   com.leanway.getDataTableFirstRowId("producttypeDataTable", ajaxLoadProType,"more","checkList");
				            	   // 点击dataTable触发事件
				            	   com.leanway.dataTableClickMoreSelect("producttypeDataTable", "checkList", false,
				            			   oTable, ajaxLoadProType,undefined,undefined,"checkAll");

				            	   com.leanway.dataTableCheckAllCheck('producttypeDataTable', 'checkAll', 'checkList');

				               }
			}).on('xhr.dt', function (e, settings, json) {
				com.leanway.checkLogind(json);
			} );
	return table;
}


//根据字典表查询产品类型
var getCompanyCode= function(method, pre,id,textVal){
	$.ajax({
		type : 'get',
		url : '../../../../'+ln_project+'/producttype?method=codeMap',
		async : false,
		data : {
			method : method,
			pre : pre
		},
		dataType : 'text',
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			    var json = eval("(" + data + ")")

				var deviceCalendars = json.data;
				var html="";
				html+="<option value='' selected='selected'>" + textVal+ "</option>";
				for (var i = 0;i<deviceCalendars.length;i++) {
					/**
					 * option 的拼接
					 * */
					html +="<option id="+"codeids"+" value="+ deviceCalendars[i].codemapid+","+deviceCalendars[i].codenum+">"+ deviceCalendars[i].codevalue+"</option>";
				}
				$("#compantPropertyId").html(html);
			}
		},
		error : function(data) {
		}
	});
}
//根据字典表查询状态
var getcode= function(method, pre){
	var autocode;
	$.ajax({
		type : 'get',
		url : '../../../../'+ln_project+'/producttype?method=getcode',
		async : false,
		data : {
			method : method,
			pre : pre
		},
		dataType : 'text',
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			    var html="";
			    var json = eval("(" + data + ")")

				var deviceCalendars = json.data;
				var s=50;
				var c=70;
				var id="1";
				for (var i = 0;i<deviceCalendars.length;i++) {
//					html+="<input id="+id+" name="+"typename"+" style="+"margin-left:"+s+"px"+" type="+"checkbox "
//					+"value="+deviceCalendars[i].codemapid+","+deviceCalendars[i].codenum+","+deviceCalendars[i].codevalue+">"+deviceCalendars[i].codevalue+"";
					html+="<input type='checkbox' name='typename' value=" + deviceCalendars[i].codemapid+","+deviceCalendars[i].codenum+","+deviceCalendars[i].codevalue + " id=" + id + "  class='regular-checkbox'/><label for='" + id+ "'></label>"+deviceCalendars[i].codevalue+"&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp";
					s+=80;
					c+=80;
					id+="1";
				}
				$("#codemapid").html(html);
			}
		},
		error : function(data) {
			lwalert("tipModal",1, "error");
		}
	});
}




//查询到右边显示
var ajaxLoadProType =function (productortypeid) {
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/producttype?method=findAllproduList",
		data : {
			"productortypeid" : productortypeid,
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
	//给产品类型赋值
	var tempType = json.id+","+json.code;
	if (tempType.length!= null) {
		var value = tempType.substring(0);
		$('#compantPropertyId').val(value);
	}
	//给是否快速完工赋值
	var rapidfinish = json.rapidfinish;
	if(rapidfinish!=null ){
		$("input[type='radio'][value="+rapidfinish+"]").prop("checked",true);
	}
	//给产品类型状态赋值
	//循环遍历出需要循环的次数
	var typecovalue = json.typecodevalue;
	var k=0;
	var f=1;
	var g=0;
	for(var s=0;s<=typecovalue.length;s++){
		var id=typecovalue.substring(g,f);
		if(id==":"){
			k++;
		}
		if(f<typecovalue.length){
			f++;
			g++;
		}
	}
	//循环依次匹配是否存在对应的勾选框
	var j=0;
	var id="1";
	var c=0;
	var boxes = document.getElementsByName("typename");
	for(var i=0;i<k-1;i++){
		var code=typecovalue.split(":")[j];
		//这里循环必须要大于三次  因为有三个id
		for(var q=0;q<boxes.length;q++){
			if($("#"+id+"").val()==code){
				boxes[c].checked = true;
				break;
			}
			c++;
			id+="1";
		}
		j++;
	}
	//遍历json，将对应的id初始化到input输入框
	for ( var item in json) {
		if (item != "searchValue") {
			$("#" + item).val(json[item]);

		}
	}
	com.leanway.formReadOnly("produForm",readOnlyObj);
	$("input[name='typename']").prop("disabled",true);
	$("input[name='rapidfinish']").prop("disabled",true);
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
	ope="addprodu";
	// 清空表单
	resetForm();
	//设置input可输入
	com.leanway.removeReadOnly("produForm",readOnlyObj);
	$("input[name='rapidfinish']").prop("disabled",false);
	$("input[name='typename']").prop("disabled",false);
	//取消选中状态
	com.leanway.dataTableUnselectAll("producttypeDataTable","checkList");
	//清除列表选中状态
	var coun=0;
	$("#productortypeid").val("");
	com.leanway.clearTableMapData( "producttypeDataTable" );
}

//删除数据
function deleteprodu(type){

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "producttypeDataTable", "checkList");

	if (ids.length>0) {
        var msg = "确定删除选中的" + ids.split(",").length + "种产品类型?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	} else {
//		alert("至少选择一条记录进行删除操作");
		lwalert("tipModal", 1, "至少选择一条记录进行删除操作！");
	}
}

function isSureDelete(type){
	var ids = com.leanway.getCheckBoxData(type, "producttypeDataTable", "checkList");
	deleteAjax(ids);
}

//删除Ajax
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/producttype?method=deleteprodu",
		data : {
			"produids" : '{"productortypeids":"' + ids + '"}'
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

			    var tempData = $.parseJSON(text);
			    com.leanway.clearTableMapData( "producttypeDataTable" );
				oTable.ajax.reload(null,false);
			}
		}
	});
}
//修改产品类型
function modifyprodu() {
	ope="updateprodu";
	//判断被勾选的状态
	var data = oTable.rows('.row_selected').data();

	if(data.length == 0) {
//		alert("请选择要修改的产品！");
		lwalert("tipModal", 1, "请选择要修改的产品类型！");
	} else if(data.length > 1) {
//		alert("只能选择一个产品进行修改！");
		lwalert("tipModal", 1, "只能选择一个产品类型进行修改！");
	}else{
		//获取选中的数据  填充到右边进行修改
		$("#bodygeneralInfo").find('tr').each(function (index, temp) {
			//获取datatable被选中的数据
			if ($(this).hasClass('row_selected')) {
				var productortypeid=$(this)[0].cells[0].children[0].children[0].value;
				ajaxLoadProType(productortypeid);
			}
		});
		com.leanway.removeReadOnly("produForm",readOnlyObj);
		$("input[name='typename']").prop("disabled",false);
		$("input[name='rapidfinish']").prop("disabled",false);
	}
}

/**
 * 往里面存或修改数据
 * */
var saveprodu = function() {

	var form = $("#produForm").serializeArray();
	var formData = formatFormJson(form);

	// 提交前先验证
	$("#produForm").data('bootstrapValidator').validate();

	// 返回true、false
	if ($('#produForm').data('bootstrapValidator').isValid()) {
	if(judgeRepeat(formData)){
		lwalert("tipModal", 1, "类型码已存在，请进行修改！");
	}else{
		autoAddProductortypecode();
	}
  }

}

function savaOrUpdate(){
	var form = $("#produForm").serializeArray();
	var formData = formatFormJson(form);

	var compantPropertyId=$("#compantPropertyId").val();
	var compantPropertyIdValue=$("#compantPropertyId").children("option:selected").text();
	var productortypeid=$("#productortypeid").val();
	var productortypecode=$("#productortypecode").val();
	var typenames=document.getElementsByName("typename");
	var typecode='';
	var typevalue='';
	var typeid='';
	var idApart="1";
	for(var i=0;i<typenames.length;i++){
		if(document.getElementById(""+idApart+"").checked){
			typeid+=typenames[i].value.split(",")[0];
			typeid+=",";
			typecode+=typenames[i].value.split(",")[1];
			typecode+=",";
			typevalue+=typenames[i].value.split(",")[2];
			typevalue+="-";
		}
		idApart+="1";
	}
	typevalue=typevalue.substring(0,typevalue.length-1);
	typecode=typecode.substring(0,typecode.length-1);
	typeid=typeid.substring(0,typeid.length-1);
	$.ajax ({
		type : "POST",
		url : "../../../../"+ln_project+"/producttype?method="+ope,
		data : {
			"formData" : formData,//表单数据
			"compantPropertyId":compantPropertyId,//类型id
			"compantPropertyIdValue":compantPropertyIdValue,//类型名称

			"typecode":typecode,//业务编码(可销售、可购买...)
			"typevalue":typevalue,//业务值
			"typeid":typeid,//业务id
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			    var tempData = $.parseJSON(data);

				resetForm();
				com.leanway.formReadOnly("produForm",readOnlyObj);
				$("input[name='typename']").prop("disabled",true);
				com.leanway.clearTableMapData( "producttypeDataTable" );
				if(ope=="addprodu"){
				    oTable.ajax.reload();
				}else{
				    oTable.ajax.reload(null,false);
				}
			}
		}
	});
}

/**
 *
 * 当没有填写类型码时  系统自动拼接
 *
 * */
function autoAddProductortypecode(formData){
	var compantPropertyId=$("#compantPropertyId").val();
	var productortypecode=$("#productortypecode").val();
	var typenames=document.getElementsByName("typename");
	var typecode='';
	var typevalue='';
	var idApart="1";
	for(var i=0;i<typenames.length;i++){
		if(document.getElementById(""+idApart+"").checked){
			typecode+=typenames[i].value.split(",")[1];
			typecode+="-";
		}
		idApart+="1";
	}
	typecode=typecode.substring(0,typecode.length-1);
	if(compantPropertyId==""||compantPropertyId==null){
		lwalert("tipModal", 1, "产品类型不能为空！");
		return;
	}else if(typecode=="" || typecode==null){
		lwalert("tipModal", 1, "请勾选产品类型状态！");
		return;
	}else //if(productortypecode==""||productortypecode==null){
	{
		productortypecode=compantPropertyId.split(",")[1]+"("+typecode+")";
		$("#productortypecode").val(productortypecode);
		savaOrUpdate();
//		}else{
//		savaOrUpdate();
	}
}

function judgeRepeat(formData){
	var judgeValue=0;
	$.ajax ({
		type : "POST",
		url : "../../../../"+ln_project+"/producttype?method=judgeRepeat",
		data : {
			"formData" : formData,
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				if (tempData.count >=1) {
					judgeValue=1;
				}

			}
		},
		error : function (  ) {
			lwalert("tipModal", 1, "error！");
		}
	});

	return judgeValue;
}

//重置表单
var resetForm = function () {
	$( '#produForm' ).each( function ( index ) {
		$('#produForm')[index].reset( );
	});
	document.getElementById("1").checked = false;
	document.getElementById("11").checked = false;
	document.getElementById("111").checked = false;

}


function initBootstrapValidator( ) {
	//对应的表单id
	$('#produForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					productortypemask : {
						validators: {
							notEmpty: {
								message: '分类名称不能为空'
							}
							}
					}

				}
			})
}
