
var clicktime = new Date();

$(function() {
	//校验
	//initBootstrapValidator();

	// enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchByKey);

});

/*function sessionJudge(){
	checkSession();
	//初始化公司-select2
	com.leanway.initSelect2("#employeeid", "../../employeespiecework?method=selectEmployee", "搜索雇员");
}*/

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
			"method" : "employeesPieceworkCondition",
			"employeeid":employeeid,
			"isorno" :isorno
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var temp = $.parseJSON(data);

			if (temp.code==2) {
				lwalert("myModal", 2,"系统长时间未操作，登录失效，请重新登录","forwardLogout()");
			}else if(temp.code==1){
				lwalert("myModal", 1,"您的身份特殊，不能够查到相关业务!");
			}else{
				viewTableEmployeesPieceworkCondition(temp.employeesPieceworks);
			}
		}
	});
}


/**
 *
 * table拼接
 *
 * */
/*var viewTableEmployeesPieceworkCondition=function(tempData){

	var tempHtml = '';
	//显示的数据
	tempHtml +=//'<table>'+
		'<tr>'+
		'<th>#</th>'+
		'<th>部门名称</th>'+
		'<th>雇员</th>'+
		'<th>产品</th>'+
		'<th>计件数量</th>'+
		'<th>单价</th>'+
		'<th>合计金额</th>'+
		'</tr>';

	tempHtml += '<tr><th>一月</th><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		//数量
		var count = tempData[i].count-tempData[i].surplusnumber;
		//单价
		var univalent= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
		//总金额
		var totalPiecerate = univalent*count;
		//显示的数据
		if(getMonth== 1){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].deptname+'</td>'+
			'<td>' +tempData[i].name+'</td>'+
			'<td>' +tempData[i].productorname+'</td>'+
			'<td>'+count+'</td>'+
			'<td>'+univalent+'</td>'+
			'<td>'+totalPiecerate+'</td>'+
			'</tr>';
		}
	}

	tempHtml += '<tr><th>二月</th><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		//数量
		var count = tempData[i].count-tempData[i].surplusnumber;
		//单价
		var univalent= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
		//总金额
		var totalPiecerate = univalent*count;
		//显示的数据
		if(getMonth== 2){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].deptname+'</td>'+
			'<td>' +tempData[i].name+'</td>'+
			'<td>' +tempData[i].productorname+'</td>'+
			'<td>'+count+'</td>'+
			'<td>'+univalent+'</td>'+
			'<td>'+totalPiecerate+'</td>'+
			'</tr>';
		}
	}

	tempHtml += '<tr><th>三月</th><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		//数量
		var count = tempData[i].count-tempData[i].surplusnumber;
		//单价
		var univalent= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
		//总金额
		var totalPiecerate = univalent*count;
		//显示的数据
		if(getMonth== 3){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].deptname+'</td>'+
			'<td>' +tempData[i].name+'</td>'+
			'<td>' +tempData[i].productorname+'</td>'+
			'<td>'+count+'</td>'+
			'<td>'+univalent+'</td>'+
			'<td>'+totalPiecerate+'</td>'+
			'</tr>';
		}
	}

	tempHtml += '<tr><th>四月</th><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		//数量
		var count = tempData[i].count-tempData[i].surplusnumber;
		//单价
		var univalent= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
		//总金额
		var totalPiecerate = univalent*count;
		//显示的数据
		if(getMonth== 4){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].deptname+'</td>'+
			'<td>' +tempData[i].name+'</td>'+
			'<td>' +tempData[i].productorname+'</td>'+
			'<td>'+count+'</td>'+
			'<td>'+univalent+'</td>'+
			'<td>'+totalPiecerate+'</td>'+
			'</tr>';
		}
	}

	tempHtml += '<tr><th>五月</th><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		//数量
		var count = tempData[i].count-tempData[i].surplusnumber;
		//单价
		var univalent= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
		//总金额
		var totalPiecerate = univalent*count;
		//显示的数据
		if(getMonth== 5){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].deptname+'</td>'+
			'<td>' +tempData[i].name+'</td>'+
			'<td>' +tempData[i].productorname+'</td>'+
			'<td>'+count+'</td>'+
			'<td>'+univalent+'</td>'+
			'<td>'+totalPiecerate+'</td>'+
			'</tr>';
		}
	}

	tempHtml += '<tr><th>六月</th><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		//数量
		var count = tempData[i].count-tempData[i].surplusnumber;
		//单价
		var univalent= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
		//总金额
		var totalPiecerate = univalent*count;
		//显示的数据
		if(getMonth== 6){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].deptname+'</td>'+
			'<td>' +tempData[i].name+'</td>'+
			'<td>' +tempData[i].productorname+'</td>'+
			'<td>'+count+'</td>'+
			'<td>'+univalent+'</td>'+
			'<td>'+totalPiecerate+'</td>'+
			'</tr>';
		}
	}

	tempHtml += '<tr><th>七月</th><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		//数量
		var count = tempData[i].count-tempData[i].surplusnumber;
		//单价
		var univalent= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
		//总金额
		var totalPiecerate = univalent*count;
		//显示的数据
		if(getMonth== 7){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].deptname+'</td>'+
			'<td>' +tempData[i].name+'</td>'+
			'<td>' +tempData[i].productorname+'</td>'+
			'<td>'+count+'</td>'+
			'<td>'+univalent+'</td>'+
			'<td>'+totalPiecerate+'</td>'+
			'</tr>';
		}
	}

	tempHtml += '<tr><th>八月</th><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		//数量
		var count = tempData[i].count-tempData[i].surplusnumber;
		//单价
		var univalent= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
		//总金额
		var totalPiecerate = univalent*count;
		//显示的数据
		if(getMonth== 8){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].deptname+'</td>'+
			'<td>' +tempData[i].name+'</td>'+
			'<td>' +tempData[i].productorname+'</td>'+
			'<td>'+count+'</td>'+
			'<td>'+univalent+'</td>'+
			'<td>'+totalPiecerate+'</td>'+
			'</tr>';
		}
	}

	tempHtml += '<tr><th>九月</th><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		//数量
		var count = tempData[i].count-tempData[i].surplusnumber;
		//单价
		var univalent= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
		//总金额
		var totalPiecerate = univalent*count;
		//显示的数据
		if(getMonth== 9){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].deptname+'</td>'+
			'<td>' +tempData[i].name+'</td>'+
			'<td>' +tempData[i].productorname+'</td>'+
			'<td>'+count+'</td>'+
			'<td>'+univalent+'</td>'+
			'<td>'+totalPiecerate+'</td>'+
			'</tr>';
		}
	}

	tempHtml += '<tr><th>十月</th><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		//数量
		var count = tempData[i].count-tempData[i].surplusnumber;
		//单价
		var univalent= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
		//总金额
		var totalPiecerate = univalent*count;
		//显示的数据
		if(getMonth== 10){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].deptname+'</td>'+
			'<td>' +tempData[i].name+'</td>'+
			'<td>' +tempData[i].productorname+'</td>'+
			'<td>'+count+'</td>'+
			'<td>'+univalent+'</td>'+
			'<td>'+totalPiecerate+'</td>'+
			'</tr>';
		}
	}

	tempHtml += '<tr><th>十一月</th><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		//数量
		var count = tempData[i].count-tempData[i].surplusnumber;
		//单价
		var univalent= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
		//总金额
		var totalPiecerate = univalent*count;
		//显示的数据
		if(getMonth== 11){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].deptname+'</td>'+
			'<td>' +tempData[i].name+'</td>'+
			'<td>' +tempData[i].productorname+'</td>'+
			'<td>'+count+'</td>'+
			'<td>'+univalent+'</td>'+
			'<td>'+totalPiecerate+'</td>'+
			'</tr>';
		}
	}

	tempHtml += '<tr><th>十二月</th><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		//数量
		var count = tempData[i].count-tempData[i].surplusnumber;
		//单价
		var univalent= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
		//总金额
		var totalPiecerate = univalent*count;
		//显示的数据
		if(getMonth== 12){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].deptname+'</td>'+
			'<td>' +tempData[i].name+'</td>'+
			'<td>' +tempData[i].productorname+'</td>'+
			'<td>'+count+'</td>'+
			'<td>'+univalent+'</td>'+
			'<td>'+totalPiecerate+'</td>'+
			'</tr>';
		}
	}

	$('#bottleneckCondition').html(tempHtml);

}*/

function viewTableEmployeesPieceworkCondition(tempData){


	var tempHtml = '';
	//显示的数据

	var januaryData = "";

	var totalPiecerate1=0;
	var totalPiecerate2=0;
	var totalPiecerate3=0;
	var totalPiecerate4=0;
	var totalPiecerate5=0;
	var totalPiecerate6=0;
	var totalPiecerate7=0;
	var totalPiecerate8=0;
	var totalPiecerate9=0;
	var totalPiecerate10=0;
	var totalPiecerate11=0;
	var totalPiecerate12=0;

	var univalent1=0;
	var univalent2=0;
	var univalent3=0;
	var univalent4=0;
	var univalent5=0;
	var univalent6=0;
	var univalent7=0;
	var univalent8=0;
	var univalent9=0;
	var univalent10=0;
	var univalent11=0;
	var univalent12=0;
	var tempHtml = '';
	//显示的数据
	tempHtml +=//'<table>'+
		'<tr>'+
		'<th></th>'+
		'<th>部门名称</th>'+
		'<th>雇员</th>'+
		'<th>合计金额</th>'+
		'</tr>';
	for(var i = 0; i < tempData.length; i ++){
//		var rate = (yearTotalEffectiveTime/yearTotalRatedTime).toFixed(4)*100+"%";
		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		//显示的数据
		if(getMonth== 1){
			//数量
			var count = tempData[i].count-tempData[i].surplusnumber;
			//单价
			univalent1= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
			//总金额
			totalPiecerate1 = univalent1*count+totalPiecerate1;
		}else if(getMonth== 2){
			//数量
			var count = tempData[i].count-tempData[i].surplusnumber;
			//单价
			univalent2= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
			//总金额
			totalPiecerate2 = univalent2*count+totalPiecerate2;
		}else if(getMonth== 3){
			//数量
			var count = tempData[i].count-tempData[i].surplusnumber;
			//单价
			univalent3= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
			//总金额
			totalPiecerate3 = univalent3*count+totalPiecerate3;
		}else if(getMonth== 4){
			//数量
			var count = tempData[i].count-tempData[i].surplusnumber;
			//单价
			univalent4= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
			//总金额
			totalPiecerate4 = univalent4*count+totalPiecerate4;
		}else if(getMonth== 5){
			//数量
			var count = tempData[i].count-tempData[i].surplusnumber;
			//单价
			univalent5= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
			//总金额
			totalPiecerate5 = univalent5*count+totalPiecerate5;
		}else if(getMonth== 6){
			//数量
			var count = tempData[i].count-tempData[i].surplusnumber;
			//单价
			univalent6= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
			//总金额
			totalPiecerate6 = univalent6*count+totalPiecerate6;
		}else if(getMonth== 7){
			//数量
			var count = tempData[i].count-tempData[i].surplusnumber;
			//单价
			univalent7= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
			//总金额
			totalPiecerate7 = univalent7*count+totalPiecerate7;
		}else if(getMonth== 8){
			//数量
			var count = tempData[i].count-tempData[i].surplusnumber;
			//单价
			univalent8= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
			//总金额
			totalPiecerate8 = univalent8*count+totalPiecerate8;
		}else if(getMonth== 9){
			//数量
			var count = tempData[i].count-tempData[i].surplusnumber;
			//单价
			univalent9= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
			//总金额
			totalPiecerate9 = univalent9*count+totalPiecerate9;
		}else if(getMonth== 10){
			//数量
			var count = tempData[i].count-tempData[i].surplusnumber;
			//单价
			univalent10= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
			//总金额
			totalPiecerate10 = univalent10*count+totalPiecerate10;
		}else if(getMonth== 11){
			//数量
			var count = tempData[i].count-tempData[i].surplusnumber;
			//单价
			univalent11= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
			//总金额
			totalPiecerate11 = univalent11*count+totalPiecerate11;
		}else if(getMonth== 12){
			//数量
			var count = tempData[i].count-tempData[i].surplusnumber;
			//单价
			univalent12= ((tempData[i].piecerate)/(tempData[i].pieceunit)).toFixed(4);
			//总金额
			totalPiecerate12 = univalent12*count+totalPiecerate12;
		}
	}
	if (univalent1!=0) {
		tempHtml += '<tr>'+
		'<td>一月</td>'+
		'<td>' +tempData[0].deptname+'</td>'+
		'<td>' +tempData[0].name+'</td>'+
		'<td>'+totalPiecerate1+'</td>'+
		'</tr>';
	}
	if (univalent2!=0) {
		tempHtml += '<tr>'+
		'<td>二月</td>'+
		'<td>' +tempData[0].deptname+'</td>'+
		'<td>' +tempData[0].name+'</td>'+
		'<td>'+totalPiecerate2+'</td>'+
		'</tr>';
	}
	if (univalent3!=0) {
		tempHtml += '<tr>'+
		'<td>三月</td>'+
		'<td>' +tempData[0].deptname+'</td>'+
		'<td>' +tempData[0].name+'</td>'+
		'<td>'+totalPiecerate3+'</td>'+
		'</tr>';
	}
	if (univalent4!=0) {
		tempHtml += '<tr>'+
		'<td>四月</td>'+
		'<td>' +tempData[0].deptname+'</td>'+
		'<td>' +tempData[0].name+'</td>'+
		'<td>'+totalPiecerate4+'</td>'+
		'</tr>';
	}
	if (univalent5!=0) {
		tempHtml += '<tr>'+
		'<td>五月</td>'+
		'<td>' +tempData[0].deptname+'</td>'+
		'<td>' +tempData[0].name+'</td>'+
		'<td>'+totalPiecerate5+'</td>'+
		'</tr>';
	}
	if (univalent6!=0) {
		tempHtml += '<tr>'+
		'<td>六月</td>'+
		'<td>' +tempData[0].deptname+'</td>'+
		'<td>' +tempData[0].name+'</td>'+
		'<td>'+totalPiecerate6+'</td>'+
		'</tr>';
	}
	if (univalent7!=0) {
		tempHtml += '<tr>'+
		'<td>七月</td>'+
		'<td>' +tempData[0].deptname+'</td>'+
		'<td>' +tempData[0].name+'</td>'+
		'<td>'+totalPiecerate7+'</td>'+
		'</tr>';
	}
	if (univalent8!=0) {
		tempHtml += '<tr>'+
		'<td>八月</td>'+
		'<td>' +tempData[0].deptname+'</td>'+
		'<td>' +tempData[0].name+'</td>'+
		'<td>'+totalPiecerate8+'</td>'+
		'</tr>';
	}
	if (univalent9!=0) {
		tempHtml += '<tr>'+
		'<td>九月</td>'+
		'<td>' +tempData[0].deptname+'</td>'+
		'<td>' +tempData[0].name+'</td>'+
		'<td>'+totalPiecerate9+'</td>'+
		'</tr>';
	}
	if (univalent10!=0) {
		tempHtml += '<tr>'+
		'<td>十月</td>'+
		'<td>' +tempData[0].deptname+'</td>'+
		'<td>' +tempData[0].name+'</td>'+
		'<td>'+totalPiecerate10+'</td>'+
		'</tr>';
	}
	if (univalent11!=0) {
		tempHtml += '<tr>'+
		'<td>十一月</td>'+
		'<td>' +tempData[0].deptname+'</td>'+
		'<td>' +tempData[0].name+'</td>'+
		'<td>'+totalPiecerate11+'</td>'+
		'</tr>';
	}
	if (univalent12!=0) {
		tempHtml += '<tr>'+
		'<td>十二月</td>'+
		'<td>' +tempData[0].deptname+'</td>'+
		'<td>' +tempData[0].name+'</td>'+
		'<td>'+totalPiecerate12+'</td>'+
		'</tr>';
	}


	$('#bottleneckCondition').html(tempHtml);
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
	var isorno = $("#isorno").val();
	$("#bottleneckCondition").empty();
	oTable.ajax.url("../../../../"+ln_project+"/employeespiecework?method=employeesPieceworkYearCondition&year="+year+"&isorno="+isorno).load();
}

//初始化数据表格
var initTable = function() {

	var table = $('#generalInfo')
	.DataTable(
			{
				"ajax" : "../../../../"+ln_project+"/employeespiecework?method=employeesPieceworkYearCondition",
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
				                        		  com.leanway.columnTdBindSelect(nTd);
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

			});

	return table;
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
