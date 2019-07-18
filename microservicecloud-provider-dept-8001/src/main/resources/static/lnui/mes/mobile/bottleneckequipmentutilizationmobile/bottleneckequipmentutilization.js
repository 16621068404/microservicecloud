
var clicktime = new Date();

$(function() {
	//时间初始化
	initDateTimeYmdHms("startCheckTime");
	initDateTimeYmdHms("endCheckTime");

	//客户的select2
	//initSelect2("#companionid", "../../salesChart?method=queryCompanion", "请输入客户名称");
	//sessionJudge();

	oTable = initTable();

	//选择年份
	getYear();

	//校验
	initBootstrapValidator();

	clickOthers();
//	initSelect2("#equipmentid",
//			"../../../workcenterproduction?method=equiptProductionYearConditionBySearch", "搜索瓶颈设备");

});


function workcenterproductionChart(equipmentid){

	var startCheckTime= $("#startCheckTime").val();
	var endCheckTime= $("#endCheckTime").val();
	if(startCheckTime==""||endCheckTime==""){
		lwalert("myModal",1 , "请验证填写不能为空！");
	}
	else{
		if(startCheckTime>endCheckTime){
			lwalert("myModal",1 , "开始时间不能大于结束时间！");

		}else{

			$.ajax ( {
				type : "post",
				url : "../../../../"+ln_project+"/workcenterproduction",
				data : {
					"method" : "equiptProductionCondition",
					"equipmentid" : equipmentid,
					"startCheckTime" : startCheckTime,
					"endCheckTime" : endCheckTime,
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
						if (temp.bWorkCenterProduction.length==0) {
							lwalert("myModal", 1,"无数据");
							$('#workcenterProductionCondition').empty();
						}else{
							viewWorkcenterProductionCondition(temp.bWorkCenterProduction);
						}
					}
				}
			});
		}
	}
}


/**
 *
 * table拼接
 *
 * */
function viewWorkcenterProductionCondition(tempData){


	var tempHtml = '';
	//显示的数据

	var januaryData = "";

	var yearTotalRatedTime1=0;
	var yearTotalEffectiveTime1=0;
	var yearTotalEffectiveTime2=0;
	var yearTotalRatedTime2=0;
	var yearTotalEffectiveTime3=0;
	var yearTotalRatedTime3=0;
	var yearTotalEffectiveTime4=0;
	var yearTotalRatedTime4=0;
	var yearTotalEffectiveTime5=0;
	var yearTotalRatedTime5=0;
	var yearTotalEffectiveTime6=0;
	var yearTotalRatedTime6=0;
	var yearTotalEffectiveTime7=0;
	var yearTotalRatedTime7=0;
	var yearTotalEffectiveTime8=0;
	var yearTotalRatedTime8=0;
	var yearTotalEffectiveTime9=0;
	var yearTotalRatedTime9=0;
	var yearTotalEffectiveTime10=0;
	var yearTotalRatedTime10=0;
	var yearTotalEffectiveTime11=0;
	var yearTotalRatedTime11=0;
	var yearTotalEffectiveTime12=0;
	var yearTotalRatedTime12=0;
	tempHtml +=//'<table>'+
		'<tr>'+
		'<th></th>'+
		'<th>设备名称</th>'+
		'<th>额定时间(小时)</th>'+
		'<th>有效运行时间(小时)</th>'+
		'<th>有效时间率</th>'+
		'</tr>';
	for(var i = 0; i < tempData.length; i ++){
//		var rate = (yearTotalEffectiveTime/yearTotalRatedTime).toFixed(4)*100+"%";
		var str=tempData[i].planstarttime;
		var str= str.split('-');
		var getMonth =str[1];
		var date = str[2];
		var strdate= date.split(' ');
		var getDate=strdate[0];
		//显示的数据
		var yearLastTime;
		if(getMonth== 1){
			yearTotalRatedTime1 += tempData[i].yearTotalRatedTime;
//			if(i<tempData.length-1){
//				if(tempData[i].orderid==tempData[i+1].orderid){
//				}else{
//					yearTotalEffectiveTime1 += tempData[i].yearTotalEffectiveTime;
//				}
//			}else{
				yearTotalEffectiveTime1 += tempData[i].yearTotalEffectiveTime;
//			}
		}else if(getMonth== 2){
			yearTotalRatedTime2 += tempData[i].yearTotalRatedTime;
//			if(i<tempData.length-1){
//				if(tempData[i].orderid==tempData[i+1].orderid){
//
//				}else{
					yearTotalEffectiveTime2 += tempData[i].yearTotalEffectiveTime;
//				}
//			}else{
//				yearTotalEffectiveTime2 += tempData[i].yearTotalEffectiveTime;
//			}


		}else if(getMonth== 3){
			yearTotalRatedTime3 += tempData[i].yearTotalRatedTime;
//			if(i<tempData.length-1){
//				if(tempData[i].orderid==tempData[i+1].orderid){
//				}else{
//					yearTotalEffectiveTime3 += tempData[i].yearTotalEffectiveTime;
//				}
//			}else{
				yearTotalEffectiveTime3 += tempData[i].yearTotalEffectiveTime;
//			}
		}else if(getMonth== 4){
			yearTotalRatedTime4 += tempData[i].yearTotalRatedTime;
//			if(i<tempData.length-1){
//				if(tempData[i].orderid==tempData[i+1].orderid){
//
//				}else{
//					yearTotalEffectiveTime4 += tempData[i].yearTotalEffectiveTime;
//				}
//			}else{
				yearTotalEffectiveTime4 += tempData[i].yearTotalEffectiveTime;
//			}
		}else if(getMonth== 5){
			yearTotalRatedTime5 += tempData[i].yearTotalRatedTime;
//			if(i<tempData.length-1){
//				if(tempData[i].orderid==tempData[i+1].orderid){
//
//				}else{
//					yearTotalEffectiveTime5 += tempData[i].yearTotalEffectiveTime;
//				}
//			}else{
				yearTotalEffectiveTime5 += tempData[i].yearTotalEffectiveTime;
//			}
		}else if(getMonth== 6){
			yearTotalRatedTime6 += tempData[i].yearTotalRatedTime;
//			if(i<tempData.length-1){
//				if(tempData[i].orderid==tempData[i+1].orderid){
//
//				}else{
//					yearTotalEffectiveTime6 += tempData[i].yearTotalEffectiveTime;
//				}
//			}else{
				yearTotalEffectiveTime6 += tempData[i].yearTotalEffectiveTime;
//			}
		}else if(getMonth== 7){
			yearTotalRatedTime7 += tempData[i].yearTotalRatedTime;
//			if(i<tempData.length-1){
//				if(tempData[i].orderid==tempData[i+1].orderid){
//
//				}else{
//					yearTotalEffectiveTime7 += tempData[i].yearTotalEffectiveTime;
//				}
//			}else{
				yearTotalEffectiveTime7 += tempData[i].yearTotalEffectiveTime;
//			}

		}else if(getMonth== 8){
			yearTotalRatedTime8 += tempData[i].yearTotalRatedTime;
//			if(i<tempData.length-1){
//				if(tempData[i].orderid==tempData[i+1].orderid){
//
//				}else{
//					yearTotalEffectiveTime8 += tempData[i].yearTotalEffectiveTime;
//				}
//			}else{
				yearTotalEffectiveTime8 += tempData[i].yearTotalEffectiveTime;
//			}
		}else if(getMonth== 9){
			yearTotalRatedTime9 += tempData[i].yearTotalRatedTime;
//			if(i<tempData.length-1){
//				if(tempData[i].orderid==tempData[i+1].orderid){
//
//				}else{
//					yearTotalEffectiveTime9 += tempData[i].yearTotalEffectiveTime;
//				}
//			}else{
				yearTotalEffectiveTime9 += tempData[i].yearTotalEffectiveTime;
//			}
		}else if(getMonth== 10){
			yearTotalRatedTime10 += tempData[i].yearTotalRatedTime;
//			if(i<tempData.length-1){
//				if(tempData[i].orderid==tempData[i+1].orderid){
//
//				}else{
//					yearTotalEffectiveTime10 += tempData[i].yearTotalEffectiveTime;
//				}
//			}else{
				yearTotalEffectiveTime10 += tempData[i].yearTotalEffectiveTime;
//			}
		}else if(getMonth== 11){
			yearTotalRatedTime11 += tempData[i].yearTotalRatedTime;
//			if(i<tempData.length-1){
//				if(tempData[i].orderid==tempData[i+1].orderid){
//
//				}else{
//					yearTotalEffectiveTime11 += tempData[i].yearTotalEffectiveTime;
//				}
//			}else{
				yearTotalEffectiveTime11 += tempData[i].yearTotalEffectiveTime;
//			}
		}else if(getMonth== 12){
			yearTotalRatedTime12 += tempData[i].yearTotalRatedTime;
//			if(i<tempData.length-1){
//				if(tempData[i].orderid==tempData[i+1].orderid){
//
//				}else{
//					yearTotalEffectiveTime12 += tempData[i].yearTotalEffectiveTime;
//				}
//			}else{
				yearTotalEffectiveTime12 += tempData[i].yearTotalEffectiveTime;
//			}
		}
	}
	if (yearTotalRatedTime1!=0) {
		var rate = ((yearTotalEffectiveTime1/yearTotalRatedTime1)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>一月</td>'+
		'<td>' +tempData[0].equipmentname+'</td>'+
		'<td>' +yearTotalRatedTime1+'</td>'+
		'<td>'+yearTotalEffectiveTime1+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}
	if (yearTotalRatedTime2!=0) {
		var rate = ((yearTotalEffectiveTime2/yearTotalRatedTime2)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>二月</td>'+
		'<td>' +tempData[0].equipmentname+'</td>'+
		'<td>' +yearTotalRatedTime2+'</td>'+
		'<td>'+yearTotalEffectiveTime2+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}
	if (yearTotalRatedTime3!=0) {
		var rate = ((yearTotalEffectiveTime3/yearTotalRatedTime3)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>三月</td>'+
		'<td>' +tempData[0].equipmentname+'</td>'+
		'<td>' +yearTotalRatedTime3+'</td>'+
		'<td>'+yearTotalEffectiveTime3+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}
	if (yearTotalRatedTime4!=0) {
		var rate = ((yearTotalEffectiveTime4/yearTotalRatedTime4)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>四月</td>'+
		'<td>' +tempData[0].equipmentname+'</td>'+
		'<td>' +yearTotalRatedTime4+'</td>'+
		'<td>'+yearTotalEffectiveTime4+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}
	if (yearTotalRatedTime5!=0) {
		var rate = ((yearTotalEffectiveTime5/yearTotalRatedTime5)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>五月</td>'+
		'<td>' +tempData[0].equipmentname+'</td>'+
		'<td>' +yearTotalRatedTime5+'</td>'+
		'<td>'+yearTotalEffectiveTime5+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}
	if (yearTotalRatedTime6!=0) {
		var rate = ((yearTotalEffectiveTime6/yearTotalRatedTime6)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>六月</td>'+
		'<td>' +tempData[0].equipmentname+'</td>'+
		'<td>' +yearTotalRatedTime6+'</td>'+
		'<td>'+yearTotalEffectiveTime6+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}
	if (yearTotalRatedTime7!=0) {
		var rate = ((yearTotalEffectiveTime7/yearTotalRatedTime7)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>七月</td>'+
		'<td>' +tempData[0].equipmentname+'</td>'+
		'<td>' +yearTotalRatedTime7+'</td>'+
		'<td>'+yearTotalEffectiveTime7+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}
	if (yearTotalRatedTime8!=0) {
		var rate = ((yearTotalEffectiveTime8/yearTotalRatedTime8)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>八月</td>'+
		'<td>' +tempData[0].equipmentname+'</td>'+
		'<td>' +yearTotalRatedTime8+'</td>'+
		'<td>'+yearTotalEffectiveTime8+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}
	if (yearTotalRatedTime9!=0) {
		var rate = ((yearTotalEffectiveTime9/yearTotalRatedTime9)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>九月</td>'+
		'<td>' +tempData[0].equipmentname+'</td>'+
		'<td>' +yearTotalRatedTime9+'</td>'+
		'<td>'+yearTotalEffectiveTime9+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}
	if (yearTotalRatedTime10!=0) {
		var rate = ((yearTotalEffectiveTime10/yearTotalRatedTime10)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>十月</td>'+
		'<td>' +tempData[0].equipmentname+'</td>'+
		'<td>' +yearTotalRatedTime10+'</td>'+
		'<td>'+yearTotalEffectiveTime10+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}
	if (yearTotalRatedTime11!=0) {
		var rate = ((yearTotalEffectiveTime11/yearTotalRatedTime11)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>十一月</td>'+
		'<td>' +tempData[0].equipmentname+'</td>'+
		'<td>' +yearTotalRatedTime11+'</td>'+
		'<td>'+yearTotalEffectiveTime11+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}
	if (yearTotalRatedTime12!=0) {
		var rate = ((yearTotalEffectiveTime12/yearTotalRatedTime12)*100).toFixed(2)+"%";
		tempHtml += '<tr>'+
		'<td>十二月</td>'+
		'<td>' +tempData[0].equipmentname+'</td>'+
		'<td>' +yearTotalRatedTime12+'</td>'+
		'<td>'+yearTotalEffectiveTime12+'</td>'+
		'<td>'+rate+'</td>'+
		'</tr>';
	}


	$('#workcenterProductionCondition').html(tempHtml);
}

/*function viewWorkcenterProductionCondition(tempData){


		var tempHtml = '';
		//显示的数据
		tempHtml +=//'<table>'+
			'<tr>'+
			'<th>#</th>'+
			'<th>派工单号</th>'+
			'<th>设备名称</th>'+
			'<th>星期</th>'+
			'<th>额定时间</th>'+
			'<th>有效运行时间</th>'+
//			'<th>有效时间率</th>'+
			'</tr>';

		tempHtml += '<tr><th>一月</th><td></td><td></td><td></td><td></td><td></td></tr>';
		for(var i = 0; i < tempData.length; i ++){

			var str=tempData[i].planstarttime;
			var str= str.split('-');
			var getMonth =str[1];
			var date = str[2];
			var strdate= date.split(' ');
			var getDate=strdate[0];
			var yearTotalRatedTime= tempData[i].yearTotalRatedTime;
			var yearTotalEffectiveTime= tempData[i].yearTotalEffectiveTime;
			var rate = (yearTotalEffectiveTime/yearTotalRatedTime).toFixed(4)*100+"%";
			//显示的数据
			if(getMonth== 1){
				tempHtml += '<tr>'+
				'<td>' +getDate+ '号</td>'+
				'<td>' +tempData[i].dispatchingnumber+'</td>'+
				'<td>' +tempData[i].equipmentname+'</td>'+
				'<td>' +tempData[i].datename+'</td>'+
				'<td>' +yearTotalRatedTime+'</td>'+
				'<td>'+yearTotalEffectiveTime+'</td>'+
	//			'<td>'+rate+'</td>'+
				'</tr>';
			}
		}

		tempHtml += '<tr><th>二月</th><td></td><td></td><td></td><td></td><td></td></tr>';
		for(var i = 0; i < tempData.length; i ++){

			var str=tempData[i].planstarttime;
			var str= str.split('-');
			var getMonth =str[1];
			var date = str[2];
			var strdate= date.split(' ');
			var getDate=strdate[0];
			var yearTotalRatedTime= tempData[i].yearTotalRatedTime;
			var yearTotalEffectiveTime= tempData[i].yearTotalEffectiveTime;
			var rate = (yearTotalEffectiveTime/yearTotalRatedTime).toFixed(4)*100+"%";
			//显示的数据
			if(getMonth== 2){
				tempHtml += '<tr>'+
				'<td>' +getDate+ '号</td>'+
				'<td>' +tempData[i].dispatchingnumber+'</td>'+
				'<td>' +tempData[i].equipmentname+'</td>'+
				'<td>' +tempData[i].datename+'</td>'+
				'<td>' +yearTotalRatedTime+'</td>'+
				'<td>'+yearTotalEffectiveTime+'</td>'+
//				'<td>'+rate+'</td>'+
				'</tr>';
			}
		}

		tempHtml += '<tr><th>三月</th><td></td><td></td><td></td><td></td><td></td></tr>';
		for(var i = 0; i < tempData.length; i ++){

			var str=tempData[i].planstarttime;
			var str= str.split('-');
			var getMonth =str[1];
			var date = str[2];
			var strdate= date.split(' ');
			var getDate=strdate[0];
			var yearTotalRatedTime= tempData[i].yearTotalRatedTime;
			var yearTotalEffectiveTime= tempData[i].yearTotalEffectiveTime;
			var rate = (yearTotalEffectiveTime/yearTotalRatedTime).toFixed(4)*100+"%";
			//显示的数据
			if(getMonth== 3){
				tempHtml += '<tr>'+
				'<td>' +getDate+ '号</td>'+
				'<td>' +tempData[i].dispatchingnumber+'</td>'+
				'<td>' +tempData[i].equipmentname+'</td>'+
				'<td>' +tempData[i].datename+'</td>'+
				'<td>' +yearTotalRatedTime+'</td>'+
				'<td>'+yearTotalEffectiveTime+'</td>'+
		//		'<td>'+rate+'</td>'+
				'</tr>';
			}
		}

		tempHtml += '<tr><th>四月</th><td></td><td></td><td></td><td></td><td></td></tr>';
		for(var i = 0; i < tempData.length; i ++){

			var str=tempData[i].planstarttime;
			var str= str.split('-');
			var getMonth =str[1];
			var date = str[2];
			var strdate= date.split(' ');
			var getDate=strdate[0];
			var yearTotalRatedTime= tempData[i].yearTotalRatedTime;
			var yearTotalEffectiveTime= tempData[i].yearTotalEffectiveTime;
			var rate = (yearTotalEffectiveTime/yearTotalRatedTime).toFixed(4)*100+"%";
			//显示的数据
			if(getMonth== 4){
				tempHtml += '<tr>'+
				'<td>' +getDate+ '号</td>'+
				'<td>' +tempData[i].dispatchingnumber+'</td>'+
				'<td>' +tempData[i].equipmentname+'</td>'+
				'<td>' +tempData[i].datename+'</td>'+
				'<td>' +yearTotalRatedTime+'</td>'+
				'<td>'+yearTotalEffectiveTime+'</td>'+
	//			'<td>'+rate+'</td>'+
				'</tr>';
			}
		}

		tempHtml += '<tr><th>五月</th><td></td><td></td><td></td><td></td><td></td></tr>';
		for(var i = 0; i < tempData.length; i ++){

			var str=tempData[i].planstarttime;
			var str= str.split('-');
			var getMonth =str[1];
			var date = str[2];
			var strdate= date.split(' ');
			var getDate=strdate[0];
			var yearTotalRatedTime= tempData[i].yearTotalRatedTime;
			var yearTotalEffectiveTime= tempData[i].yearTotalEffectiveTime;
			var rate = (yearTotalEffectiveTime/yearTotalRatedTime).toFixed(4)*100+"%";
			//显示的数据
			if(getMonth== 5){
				tempHtml += '<tr>'+
				'<td>' +getDate+ '号</td>'+
				'<td>' +tempData[i].dispatchingnumber+'</td>'+
				'<td>' +tempData[i].equipmentname+'</td>'+
				'<td>' +tempData[i].datename+'</td>'+
				'<td>' +yearTotalRatedTime+'</td>'+
				'<td>'+yearTotalEffectiveTime+'</td>'+
	//			'<td>'+rate+'</td>'+
				'</tr>';
			}
		}

		tempHtml += '<tr><th>六月</th><td></td><td></td><td></td><td></td><td></td></tr>';
		for(var i = 0; i < tempData.length; i ++){

			var str=tempData[i].planstarttime;
			var str= str.split('-');
			var getMonth =str[1];
			var date = str[2];
			var strdate= date.split(' ');
			var getDate=strdate[0];
			var yearTotalRatedTime= tempData[i].yearTotalRatedTime;
			var yearTotalEffectiveTime= tempData[i].yearTotalEffectiveTime;
			var rate = (yearTotalEffectiveTime/yearTotalRatedTime).toFixed(4)*100+"%";
			//显示的数据
			if(getMonth== 6){
				tempHtml += '<tr>'+
				'<td>' +getDate+ '号</td>'+
				'<td>' +tempData[i].dispatchingnumber+'</td>'+
				'<td>' +tempData[i].equipmentname+'</td>'+
				'<td>' +tempData[i].datename+'</td>'+
				'<td>' +yearTotalRatedTime+'</td>'+
				'<td>'+yearTotalEffectiveTime+'</td>'+
	//			'<td>'+rate+'</td>'+
				'</tr>';
			}
		}

		tempHtml += '<tr><th>七月</th><td></td><td></td><td></td><td></td><td></td></tr>';
		for(var i = 0; i < tempData.length; i ++){

			var str=tempData[i].planstarttime;
			var str= str.split('-');
			var getMonth =str[1];
			var date = str[2];
			var strdate= date.split(' ');
			var getDate=strdate[0];
			var yearTotalRatedTime= tempData[i].yearTotalRatedTime;
			var yearTotalEffectiveTime= tempData[i].yearTotalEffectiveTime;
			var rate = (yearTotalEffectiveTime/yearTotalRatedTime).toFixed(4)*100+"%";
			//显示的数据
			if(getMonth== 7){
				tempHtml += '<tr>'+
				'<td>' +getDate+ '号</td>'+
				'<td>' +tempData[i].dispatchingnumber+'</td>'+
				'<td>' +tempData[i].equipmentname+'</td>'+
				'<td>' +tempData[i].datename+'</td>'+
				'<td>' +yearTotalRatedTime+'</td>'+
				'<td>'+yearTotalEffectiveTime+'</td>'+
	//			'<td>'+rate+'</td>'+
				'</tr>';
			}
		}

		tempHtml += '<tr><th>八月</th><td></td><td></td><td></td><td></td><td></td></tr>';
		for(var i = 0; i < tempData.length; i ++){

			var str=tempData[i].planstarttime;
			var str= str.split('-');
			var getMonth =str[1];
			var date = str[2];
			var strdate= date.split(' ');
			var getDate=strdate[0];
			var yearTotalRatedTime= tempData[i].yearTotalRatedTime;
			var yearTotalEffectiveTime= tempData[i].yearTotalEffectiveTime;
			var rate = (yearTotalEffectiveTime/yearTotalRatedTime).toFixed(4)*100+"%";
			//显示的数据
			if(getMonth== 8){
				tempHtml += '<tr>'+
				'<td>' +getDate+ '号</td>'+
				'<td>' +tempData[i].dispatchingnumber+'</td>'+
				'<td>' +tempData[i].equipmentname+'</td>'+
				'<td>' +tempData[i].datename+'</td>'+
				'<td>' +yearTotalRatedTime+'</td>'+
				'<td>'+yearTotalEffectiveTime+'</td>'+
	//			'<td>'+rate+'</td>'+
				'</tr>';
			}
		}

		tempHtml += '<tr><th>九月</th><td></td><td></td><td></td><td></td><td></td></tr>';
		for(var i = 0; i < tempData.length; i ++){

			var str=tempData[i].planstarttime;
			var str= str.split('-');
			var getMonth =str[1];
			var date = str[2];
			var strdate= date.split(' ');
			var getDate=strdate[0];
			var yearTotalRatedTime= tempData[i].yearTotalRatedTime;
			var yearTotalEffectiveTime= tempData[i].yearTotalEffectiveTime;
			var rate = (yearTotalEffectiveTime/yearTotalRatedTime).toFixed(4)*100+"%";
			//显示的数据
			if(getMonth== 9){
				tempHtml += '<tr>'+
				'<td>' +getDate+ '号</td>'+
				'<td>' +tempData[i].dispatchingnumber+'</td>'+
				'<td>' +tempData[i].equipmentname+'</td>'+
				'<td>' +tempData[i].datename+'</td>'+
				'<td>' +yearTotalRatedTime+'</td>'+
				'<td>'+yearTotalEffectiveTime+'</td>'+
	//			'<td>'+rate+'</td>'+
				'</tr>';
			}
		}

		tempHtml += '<tr><th>十月</th><td></td><td></td><td></td><td></td><td></td></tr>';
		for(var i = 0; i < tempData.length; i ++){

			var str=tempData[i].planstarttime;
			var str= str.split('-');
			var getMonth =str[1];
			var date = str[2];
			var strdate= date.split(' ');
			var getDate=strdate[0];
			var yearTotalRatedTime= tempData[i].yearTotalRatedTime;
			var yearTotalEffectiveTime= tempData[i].yearTotalEffectiveTime;
			var rate = (yearTotalEffectiveTime/yearTotalRatedTime).toFixed(4)*100+"%";
			//显示的数据
			if(getMonth== 10){
				tempHtml += '<tr>'+
				'<td>' +getDate+ '号</td>'+
				'<td>' +tempData[i].dispatchingnumber+'</td>'+
				'<td>' +tempData[i].equipmentname+'</td>'+
				'<td>' +tempData[i].datename+'</td>'+
				'<td>' +yearTotalRatedTime+'</td>'+
				'<td>'+yearTotalEffectiveTime+'</td>'+
	//			'<td>'+rate+'</td>'+
				'</tr>';
			}
		}

		tempHtml += '<tr><th>十一月</th><td></td><td></td><td></td><td></td><td></td></tr>';
		for(var i = 0; i < tempData.length; i ++){

			var str=tempData[i].planstarttime;
			var str= str.split('-');
			var getMonth =str[1];
			var date = str[2];
			var strdate= date.split(' ');
			var getDate=strdate[0];
			var yearTotalRatedTime= tempData[i].yearTotalRatedTime;
			var yearTotalEffectiveTime= tempData[i].yearTotalEffectiveTime;
			var rate = (yearTotalEffectiveTime/yearTotalRatedTime).toFixed(4)*100+"%";
			//显示的数据
			if(getMonth== 11){
				tempHtml += '<tr>'+
				'<td>' +getDate+ '号</td>'+
				'<td>' +tempData[i].dispatchingnumber+'</td>'+
				'<td>' +tempData[i].equipmentname+'</td>'+
				'<td>' +tempData[i].datename+'</td>'+
				'<td>' +yearTotalRatedTime+'</td>'+
				'<td>'+yearTotalEffectiveTime+'</td>'+
	//			'<td>'+rate+'</td>'+
				'</tr>';
			}
		}

		tempHtml += '<tr><th>十二月</th><td></td><td></td><td></td><td></td><td></td></tr>';
		for(var i = 0; i < tempData.length; i ++){

			var str=tempData[i].planstarttime;
			var str= str.split('-');
			var getMonth =str[1];
			var date = str[2];
			var strdate= date.split(' ');
			var getDate=strdate[0];
			var yearTotalRatedTime= tempData[i].yearTotalRatedTime;
			var yearTotalEffectiveTime= tempData[i].yearTotalEffectiveTime;
			var rate = (yearTotalEffectiveTime/yearTotalRatedTime).toFixed(4)*100+"%";
			//显示的数据
			if(getMonth== 12){
				tempHtml += '<tr>'+
				'<td>' +getDate+ '号</td>'+
				'<td>' +tempData[i].dispatchingnumber+'</td>'+
				'<td>' +tempData[i].equipmentname+'</td>'+
				'<td>' +tempData[i].datename+'</td>'+
				'<td>' +yearTotalRatedTime+'</td>'+
				'<td>'+yearTotalEffectiveTime+'</td>'+
	//			'<td>'+rate+'</td>'+
				'</tr>';
			}
		}

		$('#workcenterProductionCondition').html(tempHtml);

}*/

var formatFormJson = function(formData) {
	var reg = /,$/gi;
	var fdata = "{";
	for (var i = 0; i < formData.length; i++) {
		fdata += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
	}
	fdata = fdata.replace(reg, "");
	fdata += "}";
	return fdata;
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

function queryProducts() {

	//com.leanway.checkSession();
	var year = $("#year").val();
	$("#workcenterProductionCondition").empty();
	oTable.ajax.url("../../../../"+ln_project+"/workcenterproduction?method=equiptProductionYearCondition&year="+year).load();
}

//初始化数据表格
var initTable = function() {
	//checkSession();
	var table = $('#generalInfo')
	.DataTable(
			{
				"ajax" : "../../../../"+ln_project+"/workcenterproduction?method=equiptProductionYearCondition",
			//	"iDisplayLength" : "10",
				'bPaginate' : true,
				"bDestory" : true,
				"bRetrieve" : true,
				"bFilter" : false,
				"bSort" : false,
				"bProcessing" : true,
				"bServerSide" : true,
				'searchDelay' : "5000",
				"columns": [
				            {"data" : "centerid"},
				            ],
				            "aoColumns": [
				                          {
				                        	  "mDataProp": "equipmentid",
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
				                          {"mDataProp": "equipmentname"},
				                          {"mDataProp": "yearTotalRatedTime"},
				                          {"mDataProp": "yearTotalEffectiveTime"},
				                          {"mDataProp": "rate"}
				                          ],
				                          "oLanguage" : {
				                        	  "sUrl" : "../../../../jslib/datatables/zh-CN.txt"
				                          },
				                          "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
				                          "fnDrawCallback" : function(data) {
				                        	  com.leanway.getDataTableClickMoreSelectFirstRowId("generalInfo",
				                        			  workcenterproductionChart);

				                        	  //点击事件
				                        	  com.leanway.dataTableClickMoreSelect("generalInfo","checkList",false,oTable,workcenterproductionChart,undefined,undefined);
				                          },

			}).on('xhr.dt', function (e, settings, json) {
				com.leanway.checkLogind(json);
			} );

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

function clickOthers(){

//	$("#min1").click(function(){
//		clickOthers2("btn1","btn2");
//		});
//	$("#min2").click(function(){
//		clickOthers2("btn2","btn1");
//		});
	clickOthers2("btn1","btn2");

}

var flag=0;
function clickOthers2(btn1,btn2){
	if(flag==1){
		flag=0;
	}else if(flag==0){
			flag++;
			$("#"+btn2).trigger("click");
	}
}
function back(){
	if($("#box1").hasClass("box box-primary collapsed-box")){
		$("#backFun").html("查看月度明细");
	}else{
		$("#backFun").html("返回年度列表");
	}
	$("#btn1").trigger("click");
	$("#btn2").trigger("click");
}