var condition = "";
$(function() {


	com.leanway.initTimePickYmdHmsForMoreId("#adjuststarttime");
	com.leanway.initTimePickYmdHmsForMoreId("#adjustendtime");

	var d = new Date();
	var date=d.getDate();
	if(date<10){
		date = "0"+date;
	}
	var month = d.getMonth()+1;
	if(month<10){
		month = "0"+month;
	}
	var hours= d.getHours(); //获取系统时，
	if(hours<10){
		hours = "0"+hours;
	}
	var minutes = d.getMinutes(); //分
	if(minutes<10){
		minutes = "0"+minutes;
	}
	var seconds = d.getSeconds(); //秒
	if(seconds<10){
		seconds = "0"+seconds;
	}
	
	var str = d.getFullYear()+"-"+month+"-"+date+"  "+hours+":"+minutes+":"+seconds;

	// $("#adjuststarttime").val(str);
	// $("#adjustendtime").val(str);
	$("#countview").hide();

});


function querySeasonalPlan(){

	//获取订单类型状态
	var orderkind = com.leanway.getDataTableCheckIds("orderkind");
	if(orderkind == ""){
		lwalert("tipModal", 1, "请选择订单类型进行查询!");
	    return;
	}	
	
	showMask();
    var searchCondition  = $("#salesChartForm").serializeArray();
    var strCondition = formatFormJson(searchCondition);

    $.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/seasonalPlan",
		data : {
			"method" : "querySeasonalPlan",
			"formData":strCondition,
			"orderkind":orderkind
		},
		dataType : "json",
		async : true,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){
                hideMask();
                viewPassRateProduction(data);

			}
		}
	});
}

function viewPassRateProduction(temp){
	
	var tempData = temp.data;
	console.info(tempData);
	var tempHtml = '';
	tempHtml +=//'<table>'+
		'<tr>'+
		'<th style="text-align:center;width:35px;"><input type="checkbox"/></th>'+
		'<th>产品编码</th>'+
		'<th>支座规格</th>'+
		'<th>支座设计区域</th>'+
		'<th>订单总数</th>'+  //销售订单
		'<th>待签数</th>'+    //销售代签
		'<th>库存</th>'+
		'<th>有效库存</th>'+
		'<th>无效库存</th>'+
		'<th>需求缺口</th>'+
		'<th>特殊项目需求</th>'+
		'<th>安全库存</th>'+
		'<th>未入库数</th>'+
		'<th>发货数</th>'+
		'</tr>';
	for(var i = 0; i < tempData.length; i ++){
		var productorid = tempData[i].productorid ? tempData[i].productorid:"";
        var productorname = tempData[i].productorname ? tempData[i].productorname:"";
        var specification = tempData[i].specification ? tempData[i].specification:"";
        var performance   = tempData[i].performance ? tempData[i].performance:"";
        var sumCount      = tempData[i].sumCount ? tempData[i].sumCount:"";
        var proSumCount   = tempData[i].proSumCount ? tempData[i].proSumCount:0;
        var finishedCount         = tempData[i].finishedCount ? tempData[i].finishedCount:0;
        var validFinishedCount    = tempData[i].validFinishedCount ? tempData[i].validFinishedCount:0;
        var invalidFinishedCount  = tempData[i].invalidFinishedCount ? tempData[i].invalidFinishedCount:"";
        var demandCount   = tempData[i].demandCount ? tempData[i].demandCount:"";
        
        var uninstocknumber  = tempData[i].uninstocknumber ? tempData[i].uninstocknumber:0;
        var count = tempData[i].count ? tempData[i].count:0;
        if (validFinishedCount < 0){
        	validFinishedCount = 0.0
        }
        if (demandCount < 0){
        	demandCount = 0.0
        }
          
        tempHtml +=//'<table>'+  <tr><td style="text-align:center;width:35px;"><input role="checkbox" type="checkbox" pgdid="'+tempData[key].pgdList[i].orderid+'" class="cbox checkbox" /></td>
            '<tr>'+
            '<td style="text-align:center;width:35px;"><input type="checkbox" productorid="'+productorid+'" /></td>'+
            '<td style="line-height: 29px">' + productorname + '</td>'+
            '<td style="line-height: 29px">' + specification + '</td>'+
            '<td style="line-height: 29px">' + performance + '</td>'+
            '<td style="line-height: 29px">' + sumCount + '</td>'+
            '<td style="line-height: 29px">' + proSumCount + '</td>'+
            '<td style="line-height: 29px">' + finishedCount + '</td>'+
            '<td style="line-height: 29px">' + validFinishedCount + '</td>'+
            '<td style="line-height: 29px">' + invalidFinishedCount + '</td>'+
            '<td style="line-height: 29px">' + demandCount + '</td>'+
            '<td style="line-height: 29px">' + '<input type="text" class="form-control" style="width: 50px;height: 30px">' + '</td>'+
            '<td style="line-height: 29px">' + '' + '</td>'+
            '<td style="line-height: 29px">' + uninstocknumber + '</td>'+
            '<td style="line-height: 29px">' + count + '</td>'+
            '</tr>';
	}

	if (tempData.length == 0){
        tempHtml += '<tr><td colspan="12" style="text-align: center">没有数据！</td></tr>'
	}

	$('#passRateProductionsCondition').html(tempHtml);
	hideMask();

}


function showMask(){


    $("#mask").css("height",$(document).height());
    $("#mask").css("width",$(document).width());
    $("#mask").show();
  }
  //隐藏遮罩层
  function hideMask(){

    $("#mask").hide();
  }


//格式化form数据
var formatFormJson = function(formData) {
    var reg = /,$/gi;
    var data = "{";
    for (var i = 0; i < formData.length; i++) {
        if (formData[i].name != "content") {
            data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
        }/* else {
			data += "\"content\" : " + formData[i].value + ",";
		}*/
    }
    data = data.replace(reg, "");
    data += "}";
    return data;
}



/**
 * 弹出硫化生产订单模态框
 * 
 */
var showVulcanizationModall = function ( ) {
    console.log("===================");  // 2018-12-01 23:00:34
    var starttime = $("#adjuststarttime").val();
    console.log("==================="+starttime);
	var endtime = $("#adjustendtime").val();
	console.log("==================="+endtime);
	
    //获取选中的数据
	var checkboxs = $("#passRateProductionsCondition :checked");
	if ( checkboxs.length == 0  ) {
	    lwalert("tipModal", 1, "请选择数据进行硫化生产订单操作!");
		return;
	} else {
		$('#moveDataModal').modal({backdrop: 'static', keyboard: true});
	}
	//获取选中数据，放到模态框中
	var passRateProductions = $("#passRateProductionsCondition tr");
	 var tempHtml = '';	
	for (var i = 0; i < passRateProductions.length ; i++) {
			
			 if(i == 0){
				 tempHtml +=//'<table>'+
						'<tr>'+
						'<th style="text-align:center;width:35px;"><input type="checkbox" /></th>'+
						'<th>产品编码</th>'+
						'<th>生产查询号</th>'+
						'<th>订单总数</th>'+
						'<th>待签数</th>'+
						'<th>库存</th>'+
						'<th>需求缺口</th>'+
						'<th>开始时间</th>'+
						'<th>结束时间</th>'+
						'</tr>';         //tr         td       input      
			  } else if (!passRateProductions[i].childNodes[0].childNodes[0].checked) {
				  continue;   //$(this).attr("checked")==true
			  } else {
				 var tr = passRateProductions[i]; 
				 console.log("==="+tr.childNodes[0].childNodes[0].getAttribute('productorid'));
					tempHtml +=//'<table>'+
						'<tr>'+
						'<th style="text-align:center;width:35px;"><input type="checkbox" productorid = "'+tr.childNodes[0].childNodes[0].getAttribute('productorid')+'"  /></th>'+
						'<th>'+tr.childNodes[1].innerHTML+'</th>'+
						'<th>'+ '<input type="text" class="form-control" placeholder="查询号" style="width: 100px;height: 30px">'+'</th>'+
						'<th>'+tr.childNodes[4].innerHTML+'</th>'+
						'<th>'+tr.childNodes[5].innerHTML+'</th>'+
						'<th>'+tr.childNodes[7].innerHTML+'</th>'+
						'<th>'+'<input type="text" class="form-control" value="'+tr.childNodes[9].innerHTML+'" style="width: 80px;height: 30px">' +'</th>'+    //
						'<th>'+ '<input type="text" class="form-control time-pick" name = "time" placeholder="开始日期" style="width: 140px;height: 30px">' +'</th>'+
						'<th>'+ '<input type="text" class="form-control time-pick" name = "time" placeholder="结束日期" style="width: 140px;height: 30px">' +'</th>'+
						'</tr>';  //type="text" placeholder="开始日期"
					 }
		 }
	$('#vulcanizationPlanData').html(tempHtml);
	//给开始时间和结束时间，添加时间控件
	com.leanway.initTimePickYmdHmsForMoreId("input.time-pick");
}
 


//点击确定
var determine = function () {
	$('#moveDataModal').modal('hide');
	// 获取模态框中的数据
	var trList = $("#vulcanizationPlanData").find("tr");
	console.log("tr长度：" + trList.length);
	// 循环封装数据
	var objList = new Array();
	$(trList).each(function(index, e){
		if(index == 0){
			return true;
		}else{
			// 创建对象
			var obj = new Object();
			// 获取到th
			var thList = $(e).children();
			// 获取到th下input：$(thList).children()[0];
			// 获取到th下值：$(thList)[0].html();
			obj.productorid = $($(thList).children()[0]).attr("productorid");
			obj.productorname = $($(thList)[1]).html();
			obj.productionsearchno =  $($($(thList)[2]).children()[0]).val();
			obj.sumCount = $($(thList)[3]).html();
			obj.proSumCount = $($(thList)[4]).html();
			obj.finishedCount = $($(thList)[5]).html();
			obj.demandCount = $($($(thList)[6]).children()[0]).val();
			obj.adjuststarttime = $($($(thList)[7]).children()[0]).val();
			obj.adjustendtime = $($($(thList)[8]).children()[0]).val();
			objList.push(obj);
		}
	});
	  json = JSON.stringify(objList);
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "addCurrentPOT",
			"json" : json
		},
		dataType : "json",
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {
				lwalert("tipModal", 1, text.info);
				if (text.status == "success") {
					
				}
			}
		},
		error : function() {
			lwalert("tipModal", 1, "ajax error！");
		}
	});
}


