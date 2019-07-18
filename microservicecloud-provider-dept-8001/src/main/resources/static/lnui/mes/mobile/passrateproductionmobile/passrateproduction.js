$(function() {


});


function passRateProductionChart(){

	var year= new Date().getFullYear;
	$("#year").val(year);
	var form = $("#salesChartForm").serializeArray();
	var formData = formatFormJson(form);

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/passrateproduction",
		data : {
			"method" : "passRateProduction",
			"formData":formData
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){
				var temp = $.parseJSON(data);

				if (temp.code==2) {
					lwalert("myModal", 2,"系统长时间未操作，登录失效，请重新登录","forwardLogout()");
				}else if(temp.code==1){
					lwalert("myModal", 1,"您的身份特殊，不能够查到相关业务!");
				}else{
					/*FusionCharts.ready(function () {
								var ageGroupChart = new FusionCharts({
									type: 'mscolumn3dlinedy',
									renderAt: 'chart-container',
									width: '600',
									height: '450',
									dataFormat: 'json',
									dataSource:temp

								}).render();
							});*/
					if (temp.passRateProductions.length==0) {
						lwalert("myModal", 1,"无数据");
						$('#passRateProductionsCondition').empty();
					}else{
						viewPassRateProduction(temp.passRateProductions);
					}
				}
			}
		}
	});
}

function viewPassRateProduction(tempData){


	var tempHtml = '';
	//显示的数据

	var januaryData = "";

	var count1=0;
	var unqualified1=0;
	var qualified1=0;
	var count2=0;
	var unqualified2=0;
	var qualified2=0;
	var count3=0;
	var unqualified3=0
	var qualified3=0;
	var count4=0;
	var unqualified4=0;
	var qualified4=0;
	var count5=0;
	var unqualified5=0;
	var qualified5=0;
	var count6=0;
	var unqualified6=0;
	var qualified6=0;
	var count7=0;
	var unqualified7=0;
	var qualified7=0;
	var count8=0;
	var unqualified8=0;
	var qualified8=0;
	var count9=0;
	var unqualified9=0;
	var qualified9=0;
	var count10=0;
	var unqualified10=0;
	var qualified10=0;
	var count11=0;
	var unqualified11=0;
	var qualified11=0;
	var count12=0;
	var unqualified12=0;
	var qualified12=0;
	tempHtml +=//'<table>'+
		'<tr>'+
		'<th> </th>'+
		'<th>单据总数</th>'+
		'<th>合格总数</th>'+
		'<th>合格率</th>'+
		'</tr>';
	for(var i = 0; i < tempData.length; i ++){
//		var rate = (yearTotalEffectiveTime/yearTotalRatedTime).toFixed(4)*100+"%";
		var str=tempData[i].endtime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		//显示的数据
		if(getMonth== 1){
			count1 += tempData[i].count01;
			unqualified1 +=tempData[i].unqualifiedcount01;

		}else if(getMonth== 2){
			count2 += tempData[i].count01;
			unqualified2 +=tempData[i].unqualifiedcount01;

		}else if(getMonth== 3){
			count3 += tempData[i].count01;
			unqualified3 +=tempData[i].unqualifiedcount01;
		}else if(getMonth== 4){
			count4 += tempData[i].count01;
			unqualified4 +=tempData[i].unqualifiedcount01;
		}else if(getMonth== 5){
			count5 += tempData[i].count01;
			unqualified5 +=tempData[i].unqualifiedcount01;
		}else if(getMonth== 6){
			count6 += tempData[i].count01;
			unqualified6 +=tempData[i].unqualifiedcount01;
		}else if(getMonth== 7){
			count7 += tempData[i].count01;
			unqualified7 +=tempData[i].unqualifiedcount01;
		}else if(getMonth== 8){
			count8 += tempData[i].count01;
			unqualified8 +=tempData[i].unqualifiedcount01;
		}else if(getMonth== 9){
			count9 += tempData[i].count01;
			unqualified9 +=tempData[i].unqualifiedcount01;
		}else if(getMonth== 10){
			count10 += tempData[i].count01;
			unqualified10 +=tempData[i].unqualifiedcount01;
		}else if(getMonth== 11){
			count11 += tempData[i].count01;
			unqualified11 +=tempData[i].unqualifiedcount01;
		}else if(getMonth== 12){
			count12 += tempData[i].count01;
			unqualified12 +=tempData[i].unqualifiedcount01;
		}
	}
	qualified1 = count1 -unqualified1;
	qualified2 = count2 -unqualified2;
	qualified3 = count3 -unqualified3;
	qualified4 = count4 -unqualified4;
	qualified5 = count5 -unqualified5;
	qualified6 = count6 -unqualified6;
	qualified7 = count7 -unqualified7;
	qualified8 = count8 -unqualified8;
	qualified9 = count9 -unqualified9;
	qualified10 = count10 -unqualified10;
	qualified11 = count11 -unqualified11;
	qualified12 = count12 -unqualified12;
	if (count1!=0) {
		var rate = ((qualified1/count1)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>一月</td>'+
		'<td>' +count1+'</td>'+
		'<td>'+qualified1+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}
	if (count2!=0) {
		var rate = ((qualified2/count2)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>二月</td>'+
		'<td>' +count2+'</td>'+
		'<td>'+qualified2+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}
	if (count3!=0) {
		var rate = ((qualified3/count3)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>三月</td>'+
		'<td>' +count3+'</td>'+
		'<td>'+qualified3+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}
	if (count4!=0) {
		var rate = ((qualified4/count4)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>四月</td>'+
		'<td>' +count4+'</td>'+
		'<td>'+qualified4+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}
	if (count5!=0) {
		var rate = ((qualified5/count5)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>五月</td>'+
		'<td>' +count5+'</td>'+
		'<td>'+qualified5+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}
	if (count6!=0) {
		var rate = ((qualified6/count6)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>六月</td>'+
		'<td>' +count6+'</td>'+
		'<td>'+qualified6+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}
	if (count7!=0) {
		var rate = ((qualified7/count7)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>七月</td>'+
		'<td>' +count7+'</td>'+
		'<td>'+qualified7+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}
	if (count8!=0) {
		var rate = ((qualified8/count8)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>八月</td>'+
		'<td>' +count8+'</td>'+
		'<td>'+qualified8+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}
	if (count9!=0) {
		var rate = ((qualified9/count9)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>九月</td>'+
		'<td>' +count9+'</td>'+
		'<td>'+qualified9+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}
	if (count10!=0) {
		var rate = ((qualified10/count10)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>十月</td>'+
		'<td>' +count10+'</td>'+
		'<td>'+qualified10+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}
	if (count11!=0) {
		var rate = ((qualified10/count10)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>十一月</td>'+
		'<td>' +count11+'</td>'+
		'<td>'+qualified11+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}
	if (count12!=0) {
		var rate = ((qualified12/count12)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>十二月</td>'+
		'<td>' +count12+'</td>'+
		'<td>'+qualified12+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}


	$('#passRateProductionsCondition').html(tempHtml);
}

/*function viewPassRateProduction(tempData){
	var tempHtml = '';
	//显示的数据
	tempHtml +=//'<table>'+
		'<tr>'+
		'<th>#</th>'+
		'<th>物料清单</th>'+
		'<th>工艺路线</th>'+
		'<th>单据总数</th>'+
		'<th>合格总数</th>'+
		'<th>合格率</th>'+
		'</tr>';

	tempHtml += '<tr><th>一月</th><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		var unqualifiedcount= tempData[i].unqualifiedcount;
		var qualifiedcount= tempData[i].qualifiedcount;
		var count = unqualifiedcount+qualifiedcount;
		var rate = (qualifiedcount/count).toFixed(4)*100+"%";
		//显示的数据
		if(getMonth== 1){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].bomname+'</td>'+
			'<td>' +tempData[i].processroutename+'</td>'+
			'<td>' +count+'</td>'+
			'<td>'+qualifiedcount+'</td>'+
			'<td>'+ rate +'</td>'+
			'</tr>';
		}
	}

	tempHtml += '<tr><th>二月</th><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		var unqualifiedcount= tempData[i].unqualifiedcount;
		var qualifiedcount= tempData[i].qualifiedcount;
		var count = unqualifiedcount+qualifiedcount;
		var rate = (qualifiedcount/count).toFixed(4)*100+"%";
		//显示的数据
		if(getMonth== 2){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].bomname+'</td>'+
			'<td>' +tempData[i].processroutename+'</td>'+
			'<td>' +count+'</td>'+
			'<td>'+qualifiedcount+'</td>'+
			'<td>'+ rate +'</td>'+
			'</tr>';
		}
	}

	tempHtml += '<tr><th>三月</th><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		var unqualifiedcount= tempData[i].unqualifiedcount;
		var qualifiedcount= tempData[i].qualifiedcount;
		var count = unqualifiedcount+qualifiedcount;
		var rate = (qualifiedcount/count).toFixed(4)*100+"%";
		//显示的数据
		if(getMonth== 3){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].bomname+'</td>'+
			'<td>' +tempData[i].processroutename+'</td>'+
			'<td>' +count+'</td>'+
			'<td>'+qualifiedcount+'</td>'+
			'<td>'+ rate +'</td>'+
			'</tr>';
		}
	}

	tempHtml += '<tr><th>四月</th><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		var unqualifiedcount= tempData[i].unqualifiedcount;
		var qualifiedcount= tempData[i].qualifiedcount;
		var count = unqualifiedcount+qualifiedcount;
		var rate = (qualifiedcount/count).toFixed(4)*100+"%";
		//显示的数据
		if(getMonth== 4){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].bomname+'</td>'+
			'<td>' +tempData[i].processroutename+'</td>'+
			'<td>' +count+'</td>'+
			'<td>'+qualifiedcount+'</td>'+
			'<td>'+ rate +'</td>'+
			'</tr>';
		}
	}

	tempHtml += '<tr><th>五月</th><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		var unqualifiedcount= tempData[i].unqualifiedcount;
		var qualifiedcount= tempData[i].qualifiedcount;
		var count = unqualifiedcount+qualifiedcount;
		var rate = (qualifiedcount/count).toFixed(4)*100+"%";
		//显示的数据
		if(getMonth== 5){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].bomname+'</td>'+
			'<td>' +tempData[i].processroutename+'</td>'+
			'<td>' +count+'</td>'+
			'<td>'+qualifiedcount+'</td>'+
			'<td>'+ rate +'</td>'+
			'</tr>';
		}
	}

	tempHtml += '<tr><th>六月</th><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		var unqualifiedcount= tempData[i].unqualifiedcount;
		var qualifiedcount= tempData[i].qualifiedcount;
		var count = unqualifiedcount+qualifiedcount;
		var rate = (qualifiedcount/count).toFixed(4)*100+"%";
		//显示的数据
		if(getMonth== 6 ){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].bomname+'</td>'+
			'<td>' +tempData[i].processroutename+'</td>'+
			'<td>' +count+'</td>'+
			'<td>'+qualifiedcount+'</td>'+
			'<td>'+ rate +'</td>'+
			'</tr>';
		}
	}

	tempHtml += '<tr><th>七月</th><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		var unqualifiedcount= tempData[i].unqualifiedcount;
		var qualifiedcount= tempData[i].qualifiedcount;
		var count = unqualifiedcount+qualifiedcount;
		var rate = (qualifiedcount/count).toFixed(4)*100+"%";
		//显示的数据
		if(getMonth== 7){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].bomname+'</td>'+
			'<td>' +tempData[i].processroutename+'</td>'+
			'<td>' +count+'</td>'+
			'<td>'+qualifiedcount+'</td>'+
			'<td>'+ rate +'</td>'+
			'</tr>';
		}
	}

	tempHtml += '<tr><th>八月</th><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		var unqualifiedcount= tempData[i].unqualifiedcount;
		var qualifiedcount= tempData[i].qualifiedcount;
		var count = unqualifiedcount+qualifiedcount;
		var rate = (qualifiedcount/count).toFixed(4)*100+"%";
		//显示的数据
		if(getMonth== 8){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].bomname+'</td>'+
			'<td>' +tempData[i].processroutename+'</td>'+
			'<td>' +count+'</td>'+
			'<td>'+qualifiedcount+'</td>'+
			'<td>'+ rate +'</td>'+
			'</tr>';
		}
	}

	tempHtml += '<tr><th>九月</th><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		var unqualifiedcount= tempData[i].unqualifiedcount;
		var qualifiedcount= tempData[i].qualifiedcount;
		var count = unqualifiedcount+qualifiedcount;
		var rate = (qualifiedcount/count).toFixed(4)*100+"%";
		//显示的数据
		if(getMonth== 9){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].bomname+'</td>'+
			'<td>' +tempData[i].processroutename+'</td>'+
			'<td>' +count+'</td>'+
			'<td>'+qualifiedcount+'</td>'+
			'<td>'+ rate +'</td>'+
			'</tr>';
		}
	}

	tempHtml += '<tr><th>十月</th><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		var unqualifiedcount= tempData[i].unqualifiedcount;
		var qualifiedcount= tempData[i].qualifiedcount;
		var count = unqualifiedcount+qualifiedcount;
		var rate = (qualifiedcount/count).toFixed(4)*100+"%";
		//显示的数据
		if(getMonth== 10){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].bomname+'</td>'+
			'<td>' +tempData[i].processroutename+'</td>'+
			'<td>' +count+'</td>'+
			'<td>'+qualifiedcount+'</td>'+
			'<td>'+ rate +'</td>'+
			'</tr>';
		}
	}

	tempHtml += '<tr><th>十一月</th><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		var unqualifiedcount= tempData[i].unqualifiedcount;
		var qualifiedcount= tempData[i].qualifiedcount;
		var count = unqualifiedcount+qualifiedcount;
		var rate = (qualifiedcount/count).toFixed(4)*100+"%";
		//显示的数据
		if(getMonth== 11){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].bomname+'</td>'+
			'<td>' +tempData[i].processroutename+'</td>'+
			'<td>' +count+'</td>'+
			'<td>'+qualifiedcount+'</td>'+
			'<td>'+ rate +'</td>'+
			'</tr>';
		}
	}

	tempHtml += '<tr><th>十二月</th><td></td><td></td><td></td><td></td><td></td></tr>';
	for(var i = 0; i < tempData.length; i ++){

		var str=tempData[i].starttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		var unqualifiedcount= tempData[i].unqualifiedcount;
		var qualifiedcount= tempData[i].qualifiedcount;
		var count = unqualifiedcount+qualifiedcount;
		var rate = (qualifiedcount/count).toFixed(4)*100+"%";
		//显示的数据
		if(getMonth== 12){
			tempHtml += '<tr>'+
			'<td>' +getDate+ '号</td>'+
			'<td>' +tempData[i].bomname+'</td>'+
			'<td>' +tempData[i].processroutename+'</td>'+
			'<td>' +count+'</td>'+
			'<td>'+qualifiedcount+'</td>'+
			'<td>'+ rate +'</td>'+
			'</tr>';
		}
	}

	$('#passRateProductionsCondition').html(tempHtml);
}*/

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

//校验
function initBootstrapValidator() {
	$('#salesChartForm').bootstrapValidator({
		excluded: [':disabled'],
		fields: {
			startCheckTime: {
				validators: {
					notEmpty: {},
				}
			},endCheckTime: {
				validators: {
					notEmpty: {},
				}
			},isorno: {
				validators: {
					notEmpty: {},
				}
			}
		}
	});

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
