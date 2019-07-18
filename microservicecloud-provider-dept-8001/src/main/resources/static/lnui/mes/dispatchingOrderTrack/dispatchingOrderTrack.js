var clicktime = new Date();
// 操作方法，新增或修改
var opeMethod = "addDispatchingOrderTrack";

var oTable;
var wTable;
var employeeTable;
var htmlStatus = 1;
var reg=/,$/gi;

function readOnly(){
	com.leanway.formReadOnly("procedureTrackForm,runtime");
//	com.leanway.formReadOnly("settingtime");
//	com.leanway.formReadOnly("preparetime");
//	com.leanway.formReadOnly("runtime");
//	com.leanway.formReadOnly("waittingtime");
//	com.leanway.formReadOnly("handingtime");
//	com.leanway.formReadOnly("changemouldtime");
}
function removeReadOnly(){
	com.leanway.removeReadOnly("procedureTrackForm,runtime");
//	com.leanway.removeReadOnly("settingtime");
//	com.leanway.removeReadOnly("preparetime");
//	com.leanway.removeReadOnly("runtime");
//	com.leanway.removeReadOnly("waittingtime");
//	com.leanway.removeReadOnly("handingtime");
//	com.leanway.removeReadOnly("changemouldtime");
}
$(function() {

	initBootstrapValidator();
	// 初始化对象
	com.leanway.loadTags();

//	//初始化编辑表格
//	wTable = initShutDownTable();
	//初始化表格
	oTable = initTable();
	//初始化员工编辑表格
//	employeeTable = initEmployeeTable();
	readOnly();

	loadWorkCenter();

	loadEmploy();
	querySalaryUnits();
	//select2
	initSelect2("#orderid", "../../../../"+ln_project+"/dispatchingOrderTrack?method=queryDispatchingOrder", "搜索派工单号");
	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchDispatchingOrderTrack);
	queryExceptionReasonList();
	com.leanway.initTimePickYmdHmsForMoreId("#trackdate,#pickingtime,#endtime,#starttime4,#endtime4")

	com.leanway.initSelect2("#shutdownreasonid", "../../../../"+ln_project+"/shutdownreason?method=queryShutdownReason", "搜索停机原因");

	$("#addEditDataTableId").hide();
 	$("#deleteEditDataTableId").hide();
	$("#addEmployeeDataTableId").hide();
 	$("#deleteEmployeeDataTableId").hide();
 	$("#saveOrUpdateAId").prop("disabled",true);

	$("input[name=transferstatus]").click(function() {
		searchDispatchingOrderTrack();
	});

});




//填写数据验证
function initBootstrapValidator() {

	$('#procedureTrackForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					orderid : {
						validators : {
							notEmpty : {},
						}
					},

					unqualifiedcount : {
						validators : {
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					qualifiedcount : {
						validators : {
							notEmpty : {},
							between: {
								min: 0.0000000000000000001,
								max: 'remaincount',
								message: '合格数量大于0，小于剩余数'
							},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					remaincount : {
						validators : {
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},
					runtime : {
						validators : {
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.time,
									com.leanway.reg.msg.time)
						}
					},

				}
			});

}
function addDispatchingOrderTrack() {

	opeMethod = "addDispatchingOrderTrack";
	$("#saveOrUpdateAId").prop("disabled",false);
	// 清空表单
	resetForm();
	removeReadOnly();
	com.leanway.dataTableUnselectAll("procedureTrackDataTable","checkList");
	$("#shortname").attr("readonly","readonly");
	$("#piecerate").attr("readonly","readonly");
	$("#pieceunit").attr("readonly","readonly");
	$("#totalpiecerate").attr("readonly","readonly");
	$("#line").attr("readonly","readonly");
	$("#unitsname").attr("readonly","readonly");
	$("#timeunit").attr("readonly","readonly");
	$("#totalcount").attr("readonly","readonly");
	$("#remaincount").attr("readonly","readonly");
	$("#trickcode").attr("readonly","readonly");
	$("#centerid").attr("disabled","disabled");
	$("#equipmentid").attr("disabled","disabled");
	$("#endtime").attr("readonly","readonly");
	$("#salaryunitsid").attr("disabled","disabled");

	$("#addEditDataTableId").show();
 	$("#deleteEditDataTableId").show();
	$("#addEmployeeDataTableId").show();
 	$("#deleteEmployeeDataTableId").show();
 	com.leanway.clearTableMapData( "procedureTrackDataTable" );
	wTable.ajax.url( "../../../../"+ln_project+"/dispatchingOrderTrack?method=queryShutDownReasonByDisid&trackid="+ 0).load();
	employeeTable.ajax.url( "../../../../"+ln_project+"/dispatchingOrderTrack?method=queryEmployeeByDisid&trackid="+ 0).load();

}

//重置表单
function resetForm() {

	$('#procedureTrackForm').each(function(index) {
		$('#procedureTrackForm')[index].reset();
	});

	$('#runtime').each(function(index) {
		$('#runtime')[index].reset();
	});

	$("#orderid").val("").trigger("change");
	$("#shutdownreasonid").val("").trigger("change");

	$("#procedureTrackForm input[type='hidden']").val("");
	$("#centerid").val("");
	$("#equipmentid").val("");
	$("#procedureTrackForm").data('bootstrapValidator').resetForm();

}
//初始化数据表格
var initTable = function () {

	var table = $('#procedureTrackDataTable').DataTable( {
		"ajax": "../../../../"+ln_project+"/dispatchingOrderTrack?method=queryDispatchingOrderTrackList",
		'bPaginate': true,
		"bDestory": true,
		"bRetrieve": true,
		"bFilter":false,
		"bSort": false,
		"scrollX": true,
		"scrollY":"55vh",
		"bProcessing": true,
		"bServerSide": true,
		'searchDelay':"5000",
		"columns": [
		            {
		            	"data" : "trackid"
		            },{

		            	"data" : "trickcode"
		            }, {
		            	"data" : "dispatchingnumber",
		            }, {
		            	"data" : "trackdate"
		            }, {
		            	"data" : "createstatus"
		            }
		            ],
		            "aoColumns": [
		                          {
		                        	  "mDataProp": "trackid",
		                        	  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
		                        		  $(nTd).html("<div id='stopPropagation" + iRow +"'>"
		                        				  +"<input class='regular-checkbox' type='checkbox' id='" + sData
		                        				  + "' name='checkList' value='" + sData
		                        				  + "'><label for='" + sData
		                        				  + "'></label>");
		                        		  com.leanway.columnTdBindSelectNew(nTd,"procedureTrackDataTable", "checkList");
		                        	  }
		                          },
		                          {"mDataProp": "trickcode"},
		                          {"mDataProp": "dispatchingnumber"},
		                          {"mDataProp": "trackdate"},
		                          {"mDataProp": "createstatus"},
		                          ],

		                          "oLanguage" : {
		                        	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		                          },
		                          "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		                          "fnDrawCallback" : function(data) {
		                        	  com.leanway.getDataTableFirstRowId("procedureTrackDataTable", ajaxLoadDispatchingOrderTrack,"more", "checkList");
		                        	  com.leanway.dataTableClickMoreSelect("procedureTrackDataTable", "checkList", false,
		                        			  oTable, ajaxLoadDispatchingOrderTrack,undefined,undefined,"checkAll");
		                        	  com.leanway.dataTableCheckAllCheck('dispatchDataTable', 'checkAll', 'checkList');

		                          }
	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );

	return table;
}
var ajaxLoadDispatchingOrderTrack=function(trackid){

	$("#saveOrUpdateAId").prop("disabled",true);
	$("#addEditDataTableId").hide();
 	$("#deleteEditDataTableId").hide();
	$("#addEmployeeDataTableId").hide();
 	$("#deleteEmployeeDataTableId").hide();
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrderTrack?method=queryDispatchingOrderTrackObject",
		data : {
			trackid : trackid,
		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				resetForm();
				var tempData = $.parseJSON(data);
				setFormValue(tempData.dispatchingOrderTrack.resultObj);
				setFormValue2(tempData.DispatchingOrderTrackTime);
//				setWorkcenterShutdown(tempData.dispatchingOrderTrack.resultObj);

				var trackid =tempData.dispatchingOrderTrack.resultObj.trackid;
				//alert(trackid);
//				wTable.ajax.url( "../../../../"+ln_project+"/dispatchingOrderTrack?method=queryShutDownReasonByDisid&trackid="+ trackid).load();
//				employeeTable.ajax.url( "../../../../"+ln_project+"/dispatchingOrderTrack?method=queryEmployeeByDisid&trackid="+ trackid).load();

			}
		},
		error : function(data) {
//			alert("加载失败！");
			lwalert("tipModal", 1,"加载失败");
		}
	});


	com.leanway.formReadOnly("procedureTrackForm");
	com.leanway.formReadOnly("runtime");
}


function setWorkcenterShutdown(data){

	var shutdownreasonid = data.shutdownreasonid;
	if (shutdownreasonid != null && shutdownreasonid != "" && shutdownreasonid != "null") {
		$("#shutdownreasonid").append(
				'<option value=' + shutdownreasonid + '>' + data.reasoncode
						+ '</option>');
		$("#shutdownreasonid").select2("val", [ shutdownreasonid ]);
	}

}

function setFormValue2(data) {
	for(var i in data){
		$("#"+data[i].typename +"  input[name=starttime]").val(data[i].starttime);
		$("#"+data[i].typename +"  input[name=endtime]").val(data[i].endtime);
//		$("#"+data[i].typename +"  input[name=adjuststarttime]").val(data[i].adjuststarttime);
//		$("#"+data[i].typename +"  input[name=adjustendtime]").val(data[i].adjustendtime);
//		$("#"+data[i].typename +"  input[name=practicalstarttime]").val(data[i].practicalstarttime);
//		$("#"+data[i].typename +"  input[name=practicalendtime]").val(data[i].practicalendtime);
	}
}
var formatFormJson = function(formData) {
	var piecerate = $("#piecerate").val();
	var pieceunit = $("#pieceunit").val();
	var salaryunitsid = $("#salaryunitsid").val();
	var reg = /,$/gi;
	var data = "{";
	for (var i = 0; i < formData.length; i++) {
		if(formData[i].name == "trackTimeVal"){
			data += "\"" + formData[i].name + "\" : " + formData[i].value + ",";
		}else{
			data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
		}
	}
	
	data += "\"piecerate\" : \"" + piecerate + "\",";
	data += "\"pieceunit\" : \"" + pieceunit + "\",";
	data += "\"salaryunitsid\" : \"" + salaryunitsid + "\",";
	data = data.replace(reg, "");
	data += "}";
	return data;
}

/**
 * 根据opeMethod的值进行保存或更新操作
 */
function save(formData){

	//当完工数量等于剩余数量时   运行时间未填写  将结束时间赋值为运行时间
	var finishtime = $("#totalcount").val();
	var remaincount = $("#remaincount").val();
	var endtime1 = $("#endtime").val();
	var endtime2 = $("#endtime4").val();
	if(eval(finishtime)==eval(remaincount)){
		if(endtime1==null||endtime1==""){
			$("#endtime").val(endtime2);
		}
	}
	var reg=/,$/gi;
	var trackTimeVal = "[";
	var starttime = document.getElementsByName("starttime");
	var endtime = document.getElementsByName("endtime");
	document.getElementById("centerid").disabled=false;
	document.getElementById("equipmentid").disabled=false;
	
	var exceptionreason = $("#exceptionreason").val();
	
//	var adjuststarttime = document.getElementsByName("adjuststarttime");
//	var adjustendtime = document.getElementsByName("adjustendtime");
//	var practicalstarttime = document.getElementsByName("practicalstarttime");
//	var practicalendtime = document.getElementsByName("practicalendtime");
	for(var i=0;i<starttime.length;i++){
		var j = i+1;
//		trackTimeVal += "{\"starttime\" : \""+starttime[i].value+"\",\"endtime\" : \""+endtime[j].value+"\",\"adjuststarttime\":\""+adjuststarttime[i].value+"\"," +
//		"\"adjustendtime\":\""+adjustendtime[i].value+"\",\"practicalstarttime\":\""+practicalstarttime[i].value+"\",\"practicalendtime\":\""+practicalendtime[i].value+"\"}," ;
		trackTimeVal += "{\"starttime\" : \""+starttime[i].value+"\",\"endtime\" : \""+endtime[j].value+"\"}," ;
	}
	trackTimeVal = trackTimeVal.replace(reg,"");
	trackTimeVal += "]";
	$('#trackTimeVal').val(trackTimeVal);
	var form  = $("#procedureTrackForm").serializeArray();
	var formData = formatFormJson(form);

	var shutdownFormData = getDataTableData(wTable);
	var employeeFormData = getDataTableData(employeeTable);
	$("#procedureTrackForm").data('bootstrapValidator').validate(); // 提交前先验证
	if ($('#procedureTrackForm').data('bootstrapValidator').isValid()) { // 返回true、false
		if($("#starttime4").val()!=""&&$("#starttime4").val()!=null&&$("#endtime4").val()!=""&&$("#endtime4").val()!=""&&$("#starttime4").val()<$("#endtime4").val()){
			if($("#endtime").val()!=""&&$("#endtime").val()!=null&&$("#endtime").val()!=$("#endtime4").val()){
				lwalert("tipModal", 1, "完工时间必须等于运行结束时间！");
			}else{
			$.ajax({
				type : "post",
				url : "../../../../"+ln_project+"/dispatchingOrderTrack",
				data : {
					method : opeMethod,
					formData : formData,
					shutdownFormData:shutdownFormData,
					employeeFormData:employeeFormData,
				},
				dataType : "text",
				success : function(data) {

					var flag =  com.leanway.checkLogind(data);

					if(flag){

						var tempData = $.parseJSON(data);
						if (tempData.status == "success") {
							com.leanway.formReadOnly("procedureTrackForm");
							com.leanway.formReadOnly("runtime");
							com.leanway.clearTableMapData( "procedureTrackDataTable" );
							oTable.ajax.reload();
							$("#addEditDataTableId").hide();
						 	$("#deleteEditDataTableId").hide();
							$("#addEmployeeDataTableId").hide();
						 	$("#deleteEmployeeDataTableId").hide();
							$("#saveOrUpdateAId").prop("disabled",true);

						}
							lwalert("tipModal", 1,tempData.info);


					}
				},
				error : function(data) {
					lwalert("tipModal", 1,"保存失败");
				}
			});
			}
		}else{
			lwalert("tipModal", 1,"请填写运行开始时间和运行结束时间,并且运行结束时间不能小于运行开始时间");
		}
	}
}



var getDataTableData = function ( tableObj ) {
	var jsonData = "[";

	var dataList = tableObj.rows().data();

	if (dataList != undefined && typeof(dataList) != "undefined" && dataList.length > 0) {

		// 循环遍历Table数据
		for (var i = 0; i < dataList.length; i ++) {

			var accountData = dataList[i];
			jsonData += JSON.stringify(accountData) + ",";

		}
	}
	jsonData = jsonData.replace(reg,"");

	jsonData += "]";

	return jsonData;
}

/**
 * 为表单赋值
 * @param data
 */

function setFormValue(data) {
	for ( var item in data) {

		$("#" + item).val(data[item]);
	}
	$("#runtime1").val(data.runtime);
	var orderid = data.orderid;
	if (orderid != null && orderid != "" && orderid != "null") {
		$("#orderid").append(
				'<option value=' + orderid + '>' + data.dispatchingnumber
				+ '</option>');
		$("#orderid").select2("val", [ orderid ]);
	}
	if(data.equipmentname==null){
		data.equipmentname="";
	}
	var shutdownreasonid = data.shutdownreasonid;
	if (shutdownreasonid != null && shutdownreasonid != "" && shutdownreasonid != "null") {
		$("#shutdownreasonid").append(
				'<option value=' + shutdownreasonid + '>' + data.reasoncode
				+ '</option>');
		$("#shutdownreasonid").select2("val", [ shutdownreasonid ]);
	}
	$("#equipmentid").html("");
    $("#equipmentid")
    .append(
            '<option value=' + data.equipmentid + '>' + data.equipmentname
            + '</option>');
}

function deleteDispatchingOrderTrack(type){

	if (type == undefined || typeof(type) == "undefined") {
		type = 2;
	}

	var ids = com.leanway.getCheckBoxData(type, "procedureTrackDataTable", "checkList");

	if (ids.length>0) {

        var msg = "确定删除选中的" + ids.split(",").length + "条工序追踪?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	} else {
		lwalert("tipModal", 1,"至少选择一条记录进行删除操作");
	}
}

function isSureDelete(type){

	var ids = com.leanway.getCheckBoxData(type, "procedureTrackDataTable", "checkList");
	deleteAjax(ids);
}
//删除工序追踪单
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrderTrack?method=deleteDispatchingOrderTrack",
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
					com.leanway.clearTableMapData( "procedureTrackDataTable" );
					oTable.ajax.reload(null,false);
				} else {
					lwalert("tipModal", 1,"操作失败");
				}

			}
		}
	});
}

//初始化select2,
/**
 * id: 为要操作的对象 url: url text: 要在select中显示的文本
 */
function initSelect2(id, url, text) {
	$(id).select2({
		placeholder : text,
		language : "zh-CN",
		ajax : {
			url : url,
			dataType : 'json',
			delay : 250,
			data : function(params) {
				return {
					q : params.term, // search term
					page : params.page,
					pageSize : 10
				};
			},
			processResults : function(data, params) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					params.page = params.page || 1;
					return {
						results : data.items,
						pagination : {
							more : (params.page * 30) < data.total_count
						}

				}
				};
			},
			cache : false
		},
		escapeMarkup : function(markup) {
			return markup;
		},
		minimumInputLength : 1,
	});
}

//触发select2选择事件，给隐藏域赋值
$("#orderid").on("select2:select", function(e) {

	$("#dispatchingnumber").val($(this).find("option:selected").text());
	loadData();
	//var orderid = $(this).find("option:selected").val()
});

$("#shutdownreasonid").on("select2:select", function(e) {

	$("#reasoncode").val($(this).find("option:selected").text());

	//var orderid = $(this).find("option:selected").val()
});



var searchDispatchingOrderTrack = function() {

	var searchVal = $("#searchValue").val();
	var transferstatus = $('input[name="transferstatus"]:checked').val();

	oTable.ajax.url(
			"../../../../"+ln_project+"/dispatchingOrderTrack?method=queryDispatchingOrderTrackList&searchValue="
			+ searchVal+"&transferstatus="+transferstatus).load();
}

function loadData(){

	var orderid   = $("#orderid").val();
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrderTrack?method=queryData",
		data : {
			"orderid" : orderid
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);

				var data=tempData.resultObj;
				if (tempData.code == "1") {
	//				$("#settingtime1").val(data.settingtime);
	//				$("#preparetime1").val(data.preparetime);
	//				$("#runtime1").val(data.runtime);
	//				$("#handingtime1").val(data.handingtime);
	//				$("#changetime").val(data.changetime);

	//			    $("#unitsname").val(data.unitsname);
	//				$("#timeunit").val(data.note);
	//				$("#line").val(data.line);
	//				$("#remaincount").val(data.surplusnumber);
	//				$("#procedureid").val(data.procedureid)
	//				$("#unitsid").val(data.unitsid);
	//
	//				$("#timeunitsid").val(data.timeunit);
	//				$("#shortname").val(data.shortname);
	//				$("#pieceunit").val(data.pieceunit);
	//				$("#piecerate").val(data.piecerate);
	//				$("#centerid").val(data.centerid);
				    if(data.trackid!=null&&data.trackid!=""){
		                employeeTable.ajax.url( "../../../../"+ln_project+"/dispatchingOrderTrack?method=queryEmployeeByDisid&trackid="+ data.trackid).load();
		                setFormValue2(data.trackTimeVal);
				    }else{

				        employeeTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryEmployees&flag=2&id=" + orderid).load();

				    }
				    if(data.centerid==null||data.centerid==""){
				    	data.centerid = data.personcenterid
				    }
				    setFormValue(data);


					var centerid = $("#centerid").val();
				}

			}
		}
	});
}
function toTotalCount(){
	var qualifiedcount = $("#qualifiedcount").val();
	var remaincount = $("#remaincount").val();
	var piecerate=parseFloat($("#pieceunit").val());
	var pieceunit=parseFloat($("#piecerate").val());
	var totalpiecerate=FloatCalFun.floatMulti(FloatCalFun.floatDiv(pieceunit,piecerate),qualifiedcount)

	$("#totalcount").val(qualifiedcount);
	var n = Number(totalpiecerate);
	if (!isNaN(n)){
		$("#totalpiecerate").val(n.toFixed(2));
	}
	if(qualifiedcount==remaincount){
		$("#endtime").attr("readonly",false);
	}
}

var FloatCalFun=new Object();
//获取参数精度，如果为整数则精度为0
FloatCalFun._getPrecision=function(arg){
	if(arg.toString().indexOf(".")==-1){
		return 0;
	}else{
		return arg.toString().split(".")[1].length;
	}

}
//获取小数的整数形式
FloatCalFun._getIntFromFloat=function(arg){
	if(arg.toString().indexOf(".")==-1){
		return arg;
	}else{
		return Number(arg.toString().replace(".",""));
	}
}
////除法
//arg1 被除数
//arg2 除数
FloatCalFun.floatDiv=function(arg1,arg2){
	var precision1=this._getPrecision(arg1);
	var precision2=this._getPrecision(arg2);
	var int1=this._getIntFromFloat(arg1);
	var int2=this._getIntFromFloat(arg2);
	var result=(int1/int2)*Math.pow(10,precision2-precision1);
	return result;
}


//乘法
FloatCalFun.floatMulti=function(arg1,arg2){
	var precision1=this._getPrecision(arg1);
	var precision2=this._getPrecision(arg2);
	var tempPrecision=0;

	tempPrecision+=precision1;
	tempPrecision+=precision2;
	var int1=this._getIntFromFloat(arg1);
	var int2=this._getIntFromFloat(arg2);
	return (int1*int2)*Math.pow(10,-tempPrecision);
}

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

				var temp = $.parseJSON(data);
	             if(temp.code==1){
					lwalert("myModal", 1,"您的身份特殊，不能够查到相关业务!");
				}else{
					var center = temp.workCenters;
					var html="";
					for (var i = 0;i<center.length;i++) {
						/**
						 * option 的拼接
						 * */
						html +="<option value="+ center[i].centerid+">"+ center[i].centername+"</option>";
					}
					$("#centerid").html(html);
				}

			}
		}
	});
}

function loadEmploy(){

	 var result="";
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/employee",
		data : {
			"method" : "queryEmployeesByConditons",
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var temp = $.parseJSON(data);
	             if(temp.code==1){
					lwalert("myModal", 1,"您的身份特殊，不能够查到相关业务!");
				}else{

					result=temp.data;
					var employee = temp.data;
					var html="";
					for (var i = 0;i<employee.length;i++) {
						/**
						 * option 的拼接
						 * */
						html +="<option value="+ employee[i].employeeid+">"+ employee[i].name+"</option>";
					}
					$("#employeeid").html(html);
				}

			}
		}
	});

	return result;
}

function queryExceptionReasonList(){
	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/dispatchingOrderTrack?method=queryExceptionReasonList",
		data : {

		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
				setExceptionReason(tempData);

			}
		}
	});
}

var setExceptionReason = function(data) {
	var html = "";
	html += "<option value=''>===请选择===</option>";
	for ( var i in data) {
		html += "<option value=" + data[i].exceptionid + ">" + data[i].shortname
		+ "</option>";
	}
	$("#exceptionid").html(html);
}

function generateBarcode(){
	$("#myModal").modal("show");
	var value = $("#barcode").val();
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

function clearCanvas(){
	var canvas = $('#canvasTarget').get(0);
	var ctx = canvas.getContext('2d');
	ctx.clearRect (0, 0, canvas.width, canvas.height);
	ctx.strokeRect (0, 0, canvas.width, canvas.height);
}

function a(){
	retainAttr=true;
	$("#barcodeTarget").printArea();
}

//工资单位下拉框
function querySalaryUnits() {
    $.ajax({
        type : "get",
        url : "../../../../"+ln_project+"/units",
        data : {
            method : "queryUnitsByUnitsTypeId",
            "unitsTypeId" : "工资单位"
        },
        dataType : "json",
        success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){
	            //重置表单数据
	            resetForm();

	            //下拉框赋值
	            setSalaryUnits(data.timeUnitsResult);

			}
        },
        error : function(data) {

        }
    });
}

var setSalaryUnits = function(data) {
    var html = "";
    html +="<option value=''></option>";
    for (var i in data) {
        //拼接option
        html +="<option value="+ data[i].unitsid+">"+ data[i].unitsname+"</option>";
    }

    $("#salaryunitsid").html(html);
}



/**
 * 初始化停机原因信息表格
 */
 var initShutDownTable = function(){

	 var table = $('#editShutdownReasonTable').DataTable( {
			    "ajax" : '../../../../'+ln_project+'/dispatchingOrderTrack?method=queryShutDownReasonByDisid',
				/*"iDisplayLength" : "10",*/
		        'bPaginate': false,
		        "bRetrieve": true,
		        "bFilter":false,
		        //"scrollX": true,
		        "bSort": false,
		        "bProcessing": true,
		        "bServerSide": false,
		        "aoColumns" : [
								{
									"mDataProp" : "equipmentfaultid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd).html(
														"<input class='regular-checkbox' type='checkbox' id='" + sData
					                                       + "' name='shutdownCheckList' value='" + sData
					                                       + "'><label for='" + sData
					                                       + "'></label>");
										com.leanway.columnTdBindSelect(nTd);
									}
								},
								{
									"mDataProp" : "reasoncode"
								},
								{
									"mDataProp" : "starttime"
								},
								{
									"mDataProp" : "endtime"
								},{
									"mDataProp" : "name"
								}],
		          "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
		          },
		         "oLanguage" : {
		        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		         },
		         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		         "fnDrawCallback" : function(data) {

		        	 // 编辑情况下，把DataTable变成可编辑
		        	 if (htmlStatus == 2) {
		        		 editDataTable();
		        	 }

		         }
		    } ).on('xhr.dt', function (e, settings, json) {
				com.leanway.checkLogind(json);
			} );

		return table;

 }


//点击停机原因添加按钮
var addShutdownReason= function () {
	wTable.row.add({
			"equipmentfaultid": "",
			"reasoncode" : "",
			"starttime" : "",
			"endtime" : "",
			"name" : "",
		}).draw( false );
		editDataTable();
	}

/**
 * 把停机原因表格变成可编辑
 */
var editDataTable = function () {

	if (wTable.rows().data().length > 0) {
        var length = 0;
		var dataList = wTable.rows().data();
		if (dataList != undefined && typeof(dataList) != "undefined" && dataList.length > 0) {
			length = dataList.length - 1;
		}
		$("#editShutdownReasonTable tbody tr").each(function() {

			var index = wTable.row(this).index();
			console.info(wTable.row(this).index());


			if (index == length) {

				initEditShutdownReasonTableData(index, $(this));
			}

		});
	}
}


//改变DataTable对象里的值
var setDataTableValue = function( obj, index, tableName ) {


	var tableObj =  $("#" + tableName).DataTable();

	// 获取修改的行数据
	var account =  tableObj.rows().data()[index];

	// 循环Json key,value，赋值
	 for (var item in account) {

		 // 当ID相同时，替换最新值
		 if (item == obj.name) {

			 account[item] = obj.value;

		 }

	 }

}

var initEditShutdownReasonTableData = function (index, obj) {

	obj.find("td:eq(1)").html('<select id="shutdownreasonid'+index+'" name="shutdownreasonid" class="form-control" style="width: 80px" onchange="setDataTableValue(this, ' + index + ',\'editShutdownReasonTable\')" value="' + wTable.rows().data()[index].shutdownreasonid  + '">');


	var centerid = $("#centerid").val();
	com.leanway.initSelect2("#shutdownreasonid"+index, "../../../../"+ln_project+"/shutdownreason?method=queryShutdownReason&centerid="+centerid, "搜索停机原因");

	// select选中数据后 触发事件
	$("#shutdownreasonid"+index).on("select2:select", function(e) {

		// 赋值
		wTable.rows().data()[index].shutdownreasonid = $(this).val();
	});

	var starttime = wTable.rows().data()[index].starttime;
	if (starttime == "null"  || starttime == null) {
		starttime = "";
	}
	//开始时间
	obj.find("td:eq(2)").html('<input type="text" class="form-control" style="width: 80px" onchange="setDataTableValue(this, ' + index + ',\'editShutdownReasonTable\')" name="starttime" id="starttime'+index+'" value="' + starttime  + '">');
	initDateTimeYmdHms("starttime"+index);

	var endtime = wTable.rows().data()[index].endtime;
	if (endtime == "null"  || endtime == null) {
		endtime = "";
	}
	// 结束时间
	obj.find("td:eq(3)").html('<input type="text" class="form-control" style="width: 80px" onchange="setDataTableValue(this, ' + index + ',\'editShutdownReasonTable\')" name="endtime" id="endtime'+index+'" value="' + endtime + '">');
	initDateTimeYmdHms("endtime"+index);

    obj.find("td:eq(4)").html('<select id="employeeid'+index+'" name="employeeid" class="form-control" style="width: 80px" onchange="setDataTableValue(this, ' + index + ',\'editShutdownReasonTable\')" value="' + wTable.rows().data()[index].employeeid  + '">');

	com.leanway.initSelect2("#employeeid"+index, "../../../../"+ln_project+"/employee?method=queryEmployeeBySelect2", "搜索员工");


	// select选中数据后 触发事件
	$("#employeeid"+index).on("select2:select", function(e) {

		// 赋值
		wTable.rows().data()[index].employeeid = $(this).val();

	});

}


/**
 * 删除数据
 */
var deleteDataTableData = function () {

	var str = '';
	// 拼接选中的checkbox
	$("input[name='shutdownCheckList']:checked").each(function(i, o) {
		str += $(this).val();
		str += ",";
	});


	if (str.length > 0) {

		// 获取该行的下标
		$("#editShutdownReasonTable tbody tr").each(function() {
		var index = wTable.row(this).index();

		if ($(this).find("td:eq(0)").find("input[name='shutdownCheckList']").prop("checked")  == true) {
			wTable.rows(index).remove().draw(false);
		}
		});
	} else {
		lwalert("tipModal", 1, "至少选择一条记录操作！");
	}

}


/**
 * 初始化雇员信息表格
 */
 var initEmployeeTable = function(){

	 var table = $('#editEmployeeTable').DataTable( {
			    "ajax" : '../../../../'+ln_project+'/dispatchingOrderTrack?method=queryEmployeeByDisid',
				/*"iDisplayLength" : "10",*/
		        'bPaginate': false,
		        "bRetrieve": true,
		        "bFilter":false,
		        //"scrollX": true,
		        "bSort": false,
		        "bProcessing": true,
		        "bServerSide": false,
		        "aoColumns" : [
								{
									"mDataProp" : "id",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd).html(
														"<input class='regular-checkbox' type='checkbox' id='" + sData
					                                       + "' name='employeeCheckList' value='" + sData
					                                       + "'><label for='" + sData
					                                       + "'></label>");
										com.leanway.columnTdBindSelect(nTd);
									}
								},
								{
									"mDataProp" : "name"
								}],
		          "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
		          },
		         "oLanguage" : {
		        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		         },
		         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		         "fnDrawCallback" : function(data) {

		        	 // 编辑情况下，把DataTable变成可编辑
		        	 if (htmlStatus == 2) {
		        		 editEmployeeDataTable();
		        	 }

		         }
		    } ).on('xhr.dt', function (e, settings, json) {
				com.leanway.checkLogind(json);
			} );

		return table;

 }




/**
 * 把员工表格变成可编辑
 */
var editEmployeeDataTable = function () {

	if (employeeTable.rows().data().length > 0) {
        var length = 0;
		var dataList = employeeTable.rows().data();
		if (dataList != undefined && typeof(dataList) != "undefined" && dataList.length > 0) {
			length = dataList.length - 1;
		}

		$("#editEmployeeTable tbody tr").each(function() {

			var index = employeeTable.row(this).index();

			if (index == length) {

				initEditEmployeeTableData(index, $(this));
			}


		});
	}
}


//点击雇员添加按钮
var addEmployee= function () {
	employeeTable.row.add({
			"id": "",
			"name" : "",
		}).draw( false );
	editEmployeeDataTable();
	}
//根据派工单id查询雇员
var queryEmployee = function(orderid) {

	//com.leanway.checkSession()
	var html = "";
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			method : "queryEmployee",
			orderid : orderid
		},
		dataType : "json",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				result = data.employeeList;

				for (var i in result) {

					//拼接option
					html +="<option value="+ result[i].employeeid+">"+ result[i].name+"</option>";
				}


			}

		}
	});

	return html;
}


var initEditEmployeeTableData = function (index, obj) {

	var orderid = $("#orderid").val();
	var employeeSelect = queryEmployee(orderid);
	obj.find("td:eq(1)").html('<select name="employeeid" id="employeeid" style="width: 80px"  onchange="employeeChange(this,' + index + ')"  class="form-control" >' + employeeSelect + '</select>');
	obj.find("td:eq(1)").find("#employeeid").val(employeeTable.rows().data()[index].employeeid);
}

var employeeChange =function (obj , index) {
	employeeTable.rows().data()[index].employeeid = obj.value;

}


/**
 * 删除数据
 */
var deleteEmployeeDataTableData = function () {

	var str = '';
	// 拼接选中的checkbox
	$("input[name='employeeCheckList']:checked").each(function(i, o) {
		str += $(this).val();
		str += ",";
	});


	if (str.length > 0) {

		// 获取该行的下标
		$("#editEmployeeTable tbody tr").each(function() {
		var index = employeeTable.row(this).index();

		if ($(this).find("td:eq(0)").find("input[name='employeeCheckList']").prop("checked")  == true) {
			employeeTable.rows(index).remove().draw(false);
		}
		});
	} else {

		lwalert("tipModal", 1, "至少选择一条记录操作！");
	}

}



function countRuntime(){
	var start = $('#starttime4').val();
	var end = $('#endtime4').val();
	var centerid = $('#centerid').val();
	var timeunitsid = $('#timeunitsid').val();
	if(start!=""&&end!=""){
		if(start>end){
			lwalert("tipModal", 1,"运行开始时间不能大于结束时间！");
			return;
		}
	    $.ajax({
	        type : "post",
	        url : "../../../../"+ln_project+"/dispatchingOrderTrack",
	        data : {
	            method : "queryCalculateRuntime",
	            starttime : start,
	            endtime:end,
	            centerid:centerid,
	            timeunitsid:timeunitsid

	        },
	        dataType : "json",
	        async : false,
	        success : function(data) {

	            var flag =  com.leanway.checkLogind(data);

	            if(flag){
	              if(data.status=="success"){
	                  $("#runtime1").val(data.info);
	              }


	            }

	        }
	    });
	}
}

function transferWorkTime(type){

	var ids ;
	if(type == 0){

		ids = com.leanway.getCheckBoxData(1, "productionOrderTable", "checkList");
		if (ids.length>0) {

			var transferstatus = $('input[name="transferstatus"]:checked').val();
			if(transferstatus=="1"){
				lwalert("tipModal", 1, "工时已同步");
				return;
			}

		} else {

			lwalert("tipModal", 1, "至少选择一条追踪单进行同步！");
			return;
		}
	}

	$("#transferWorkTime").prop("disabled",true);
	$("#transferWorkTime").html("传输中...稍等");
	$("#transferdropdown").prop("disabled",true);
//	lwalert("tipModal", 1, "正在传输数据。。");
//	return;
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/dataSync",
		data : {
			method:"transferWorkTime",
			"orderids":ids
		},
		dataType : "text",
//		async : false,
		success : function(text) {
			var flag =  com.leanway.checkLogind(text);
			if(flag){
				var tempData = $.parseJSON(text);
				if (tempData.status == "success") {
						lwalert("tipModal", 1, tempData.info);
						oTable.ajax.reload();
					}else if (tempData.status == "fail") {
						lwalert("tipModal", 1, tempData.info);
					}else if (tempData.status == "error") {
						lwalert("tipModal", 1, tempData.info);
					}
				$("#transferWorkTime").prop("disabled",false);
				$("#transferWorkTime").html("同步工时");
				$("#transferdropdown").prop("disabled",false);

			}
		}
	});

}

