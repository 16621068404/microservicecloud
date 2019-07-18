
var clicktime = new Date();

$(function() {
	//时间初始化
	getNowMonth();
//	sessionJudge();
	getYear();
	// 加载datagrid
	oTable = initTable();

	oTablegroup = initTablegroup();

	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchByKey);
	$("#exportbutton").hide();
});


//模糊查询
function searchByKey(){

	var searchValue = $("#searchValue").val();

	oTable.ajax.url("../../../../"+ln_project+"/employeespiecework?method=searchByKey&searchValue=" +searchValue).load();
}

function salesChart(employeeid){

	var isorno = $("#isorno").val();
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/employeespiecework",
		data : {
			"method" : "employeewagereconciliation",
			"employeeid":employeeid,
			"isorno" :isorno
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var temp = $.parseJSON(data);
	            if(temp.code==1){
					lwalert("tipModal", 1,"您的身份特殊，不能够查到相关业务!");
				}else{
					if(temp.employeesPieceworks.length==0){
						$("#exportbutton").hide();
						lwalert("tipModal", 1,"相关雇员无计件数据");
					}else{
						$("#exportbutton").show();
						viewTableEmployeesPieceworkCondition(temp.employeesPieceworks);
					}
				}

			}
		}
	});
}


function salesgroupChart(groupid){

	var isorno = $("#isorno").val();
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/employeespiecework",
		data : {
			"method" : "employeegroupwagereconciliation",
			"groupid":groupid,
			"isorno" :isorno
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var temp = $.parseJSON(data);
	            if(temp.code==1){
					lwalert("tipModal", 1,"您的身份特殊，不能够查到相关业务!");
				}else{
					viewemployeegroupwagereconciliation(temp.employeesPieceworks);
				}

			}
		}
	});
}


var viewemployeegroupwagereconciliation=function(tempData){

	var tempHtml = '';
	//显示的数据
	tempHtml +=//'<table>'+
		'<tr>'+
		'<th></th>'+
//		'<th>部门名称</th>'+
		'<th>追踪单号</th>'+
		'<th>产品编号</th>'+
		'<th>车间</th>'+
		'<th>雇员</th>'+
		'<th>追踪计件数量</th>'+
		'<th>单价</th>'+
		'<th>合计金额</th>'+
		'</tr>';
	var monthcount1=0;
	var monthcount2=0;
	var monthcount3=0;
	var monthcount4=0;
	var monthcount5=0;
	var monthcount6=0;
	var monthcount7=0;
	var monthcount8=0;
	var monthcount9=0;
	var monthcount10=0;
	var monthcount11=0;
	var monthcount12=0;

	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].trackdate;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		//显示的数据
		if(getMonth== 1){
			if(monthcount1==0){
				tempHtml += '<tr><th>一月</th><td colspan="7"></td></tr>';
			}
			tempHtml += concatTable(tempData[i],getDate);
			monthcount1++;
		}
		if(getMonth== 2){
			if(monthcount2==0){
				tempHtml += '<tr><th>二月</th><td colspan="7"></td></tr>';
			}
			tempHtml += concatTable(tempData[i],getDate);
			monthcount2++;
		}
		if(getMonth== 3){
			if(monthcount3==0){
				tempHtml += '<tr><th>三月</th><td colspan="7"></td></tr>';
			}
			tempHtml += concatTable(tempData[i],getDate);
			monthcount3++;
		}
		if(getMonth==4){
			if(monthcount4==0){
				tempHtml += '<tr><th>四月</th><td colspan="7"></td></tr>';
			}
			tempHtml += concatTable(tempData[i],getDate);
			monthcount4++;
		}
		if(getMonth== 5){
			if(monthcount5==0){
				tempHtml += '<tr><th>五月</th><td colspan="7"></td></tr>';
			}
			tempHtml += concatTable(tempData[i],getDate);
			monthcount5++;
		}
		if(getMonth== 6){
			if(monthcount6==0){
				tempHtml += '<tr><th>六月</th><td colspan="7"></td></tr>';
			}
			tempHtml += concatTable(tempData[i],getDate);
			monthcount6++;
		}
		if(getMonth== 7){
			if(monthcount7==0){
				tempHtml += '<tr><th>七月</th><td colspan="7"></td></tr>';
			}
			tempHtml += concatTable(tempData[i],getDate);
			monthcount7++;
		}
		if(getMonth== 8){
			if(monthcount8==0){
				tempHtml += '<tr><th>八月</th><td colspan="7"></td></tr>';
			}
			tempHtml += concatTable(tempData[i],getDate);
			monthcount8++;
		}
		if(getMonth== 9){
			if(monthcount9==0){
				tempHtml += '<tr><th>九月</th><td colspan="7"></td></tr>';
			}
			tempHtml += concatTable(tempData[i],getDate);
			monthcount9++;
		}
		if(getMonth== 10){
			if(monthcount10==0){
				tempHtml += '<tr><th>十月</th><td colspan="7"></td></tr>';
			}

			tempHtml += concatTable(tempData[i],getDate);
			monthcount10++;
		}
		if(getMonth== 11){
			if(monthcount11==0){
				tempHtml += '<tr><th>十一月</th><td colspan="7"></td></tr>';
			}

			tempHtml += concatTable(tempData[i],getDate);
			monthcount11++;
		}
		if(getMonth== 12){
			if(monthcount12==0){
				tempHtml += '<tr><th>十二月</th><td colspan="7"></td></tr>';
			}
			tempHtml += concatTable(tempData[i],getDate);
			monthcount12++;
		}
	}
	$('#bottleneckConditiongroup').html(tempHtml);

}

/**
 *
 * table拼接
 *
 * */
var viewTableEmployeesPieceworkCondition=function(tempData){

	var tempHtml = '';
	//显示的数据
	tempHtml +=//'<table>'+
		'<tr>'+
		'<th></th>'+
//		'<th>部门名称</th>'+
		'<th>追踪单号</th>'+
		'<th>产品编号</th>'+
		'<th>车间</th>'+
		'<th>雇员</th>'+
		'<th>追踪计件数量</th>'+
		'<th>单价</th>'+
		'<th>合计金额</th>'+
		'</tr>';
	var monthcount1=0;
	var monthcount2=0;
	var monthcount3=0;
	var monthcount4=0;
	var monthcount5=0;
	var monthcount6=0;
	var monthcount7=0;
	var monthcount8=0;
	var monthcount9=0;
	var monthcount10=0;
	var monthcount11=0;
	var monthcount12=0;

	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].trackdate;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		//显示的数据
		if(getMonth== 1){
			if(monthcount1==0){
				tempHtml += '<tr><th>一月</th><td colspan="7"></td></tr>';
			}
			tempHtml += concatTable(tempData[i],getDate);
			monthcount1++;
		}
		if(getMonth== 2){
			if(monthcount2==0){
				tempHtml += '<tr><th>二月</th><td colspan="7"></td></tr>';
			}
			tempHtml += concatTable(tempData[i],getDate);
			monthcount2++;
		}
		if(getMonth== 3){
			if(monthcount3==0){
				tempHtml += '<tr><th>三月</th><td colspan="7"></td></tr>';
			}
			tempHtml += concatTable(tempData[i],getDate);
			monthcount3++;
		}
		if(getMonth==4){
			if(monthcount4==0){
				tempHtml += '<tr><th>四月</th><td colspan="7"></td></tr>';
			}
			tempHtml += concatTable(tempData[i],getDate);
			monthcount4++;
		}
		if(getMonth== 5){
			if(monthcount5==0){
				tempHtml += '<tr><th>五月</th><td colspan="7"></td></tr>';
			}
			tempHtml += concatTable(tempData[i],getDate);
			monthcount5++;
		}
		if(getMonth== 6){
			if(monthcount6==0){
				tempHtml += '<tr><th>六月</th><td colspan="7"></td></tr>';
			}
			tempHtml += concatTable(tempData[i],getDate);
			monthcount6++;
		}
		if(getMonth== 7){
			if(monthcount7==0){
				tempHtml += '<tr><th>七月</th><td colspan="7"></td></tr>';
			}
			tempHtml += concatTable(tempData[i],getDate);
			monthcount7++;
		}
		if(getMonth== 8){
			if(monthcount8==0){
				tempHtml += '<tr><th>八月</th><td colspan="7"></td></tr>';
			}
			tempHtml += concatTable(tempData[i],getDate);
			monthcount8++;
		}
		if(getMonth== 9){
			if(monthcount9==0){
				tempHtml += '<tr><th>九月</th><td colspan="7"></td></tr>';
			}
			tempHtml += concatTable(tempData[i],getDate);
			monthcount9++;
		}
		if(getMonth== 10){
			if(monthcount10==0){
				tempHtml += '<tr><th>十月</th><td colspan="7"></td></tr>';
			}

			tempHtml += concatTable(tempData[i],getDate);
			monthcount10++;
		}
		if(getMonth== 11){
			if(monthcount11==0){
				tempHtml += '<tr><th>十一月</th><td colspan="7"></td></tr>';
			}

			tempHtml += concatTable(tempData[i],getDate);
			monthcount11++;
		}
		if(getMonth== 12){
			if(monthcount12==0){
				tempHtml += '<tr><th>十二月</th><td colspan="7"></td></tr>';
			}
			tempHtml += concatTable(tempData[i],getDate);
			monthcount12++;
		}
	}
	$('#bottleneckCondition').html(tempHtml);

}


function concatTable(tempData,getDate){
	var tempHtml ='';
	tempHtml += '<tr>'+
	'<td>' +getDate+ '号</td>'+
	'<td>' +tempData.dispatchingnumber+'</td>'+
	'<td>' +tempData.productorname+'</td>'+
	'<td>' +tempData.groupname+'</td>'+
	'<td>' +tempData.name+'</td>'+
	'<td>' +tempData.count+'</td>'+
	'<td>'+tempData.univalent+'</td>'+
	'<td>'+tempData.totalPiecerate+'</td>'+
	'</tr>';
	return tempHtml;
}

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

function queryProducts() {

	var year = $("#year").val();
	var month = $("#month").val();
	$("#bottleneckCondition").empty();
	$("#bottleneckConditiongroup").empty();
	oTablegroup.ajax.url("../../../../"+ln_project+"/employeespiecework?method=employeesGroupPieceworkMonthCondition&year="+year+"&month="+month).load();
	oTable.ajax.url("../../../../"+ln_project+"/employeespiecework?method=employeesPieceworkMonthCondition&year="+year+"&month="+month).load();

}

//初始化数据表格
var initTable = function() {

	var table = $('#generalInfo')
	.DataTable(
			{
				"ajax" : "../../../../"+ln_project+"/employeespiecework?method=employeesPieceworkMonthCondition",
				//		"iDisplayLength" : "10",
				'bPaginate' : true,
				"bDestory" : true,
				"bRetrieve" : true,
				"bFilter" : false,
				"bSort" : false,
				"bProcessing" : true,
				"bServerSide" : true,
				'searchDelay' : "5000",
				"columns": [
				            {"data" : "employeeid"},
				            ],
				            "aoColumns": [
				                          {
				                        	  "mDataProp": "employeeid",
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
				                        		  //	  com.leanway.columnTdBindSelect(nTd);
				                        	  }
				                          },
				                          {"mDataProp": "name"},
				                          {"mDataProp": "yearTotalPiecerate"}
				                          ],
				                          "oLanguage" : {
				                        	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
				                          },
				                          "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
				                          "fnDrawCallback" : function(data) {
				                        	  com.leanway.getDataTableClickMoreSelectFirstRowId("generalInfo",
				                        			  salesChart);

				                        	  //点击事件
				                        	  com.leanway.dataTableClickMoreSelect("generalInfo","checkList",false,oTable,salesChart,undefined,undefined);
				                          },

			}).on('xhr.dt', function (e, settings, json) {
				com.leanway.checkLogind(json);
			} );

	return table;
}


//初始化数据表格
var initTablegroup = function() {
	//checkSession();
	var table = $('#generalInfogroup')
	.DataTable(
			{
				"ajax" : "../../../../"+ln_project+"/employeespiecework?method=employeesGroupPieceworkMonthCondition",
				//		"iDisplayLength" : "10",
				'bPaginate' : true,
				"bDestory" : true,
				"bRetrieve" : true,
				"bFilter" : false,
				"bSort" : false,
				"bProcessing" : true,
				"bServerSide" : true,
				'searchDelay' : "5000",
				"columns": [
				            {"data" : "groupid"},
				            ],
				            "aoColumns": [
				                          {
				                        	  "mDataProp": "groupid",
				                        	  "fnCreatedCell" : function(nTd, sData,
				                        			  oData, iRow, iCol) {
				                        		  $(nTd)
				                        		  .html("<div id='stopPropagation" + iRow +"'>"
				                        				  +"<input class='regular-checkbox' type='checkbox' id='"
				                        				  + sData
				                        				  + "' name='checkListgroup' value='"
				                        				  + sData
				                        				  + "'><label for='"
				                        				  + sData
				                        				  + "'></label>");
				                        		  com.leanway.columnTdBindSelect(nTd);
				                        	  }
				                          },
				                          {"mDataProp": "groupname"},
				                          {"mDataProp": "yearTotalPiecerate"}
				                          ],
				                          "oLanguage" : {
				                        	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
				                          },
				                          "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
				                          "fnDrawCallback" : function(data) {
				                        	  com.leanway.getDataTableClickMoreSelectFirstRowId("generalInfogroup",
				                        			  salesgroupChart);

				                        	  //点击事件
				                        	  com.leanway.dataTableClickMoreSelect("generalInfogroup","checkListgroup",false,oTablegroup,salesgroupChart,undefined,undefined);
				                          },

			}).on('xhr.dt', function (e, settings, json) {
				com.leanway.checkLogind(json);
			} );

	return table;
}

//导出excel文件
function exportExcelFunc() {

	//com.leanway.checkSession();
	var groupid = '';
	$("input[name='checkListgroup']:checked").each(function(i, o) {
		groupid = $(this).val();
	});
	if(groupid==""){
		lwalert("tipModal", 2,"未选择车间进行操作，是否默认导出全部数据","exportdata()");
	}else{
//		window.location.href = "../../employeespiecework?method=dowloadExcel&groupid="+groupid;
		exportdata(groupid);
	}
}

function exportdata(groupid){
	if(undefined==groupid){
		groupid="";
	}
	window.location.href = "../../../../"+ln_project+"/employeespiecework?method=dowloadExcel&groupid="+groupid;
}


function getYear(){
	var date = new Date();
	var year = date.getFullYear();
	var html = "";
	for(var i=year;i>year-16;i--){

		html += "<option value=" + i + ">" + i
		+ "</option>";
	}

	$("#year").html(html);
	return
}

function getNowMonth(){
	var date = new Date();
	var month = date.getMonth();
	$("#month").val(month+1);
	return
}
