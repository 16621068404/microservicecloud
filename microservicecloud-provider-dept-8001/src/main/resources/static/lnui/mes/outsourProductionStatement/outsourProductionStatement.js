var condition = "";
var valuei;
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

//查询外协生产情况数据
function querySeasonalPlan(){
	
	showMask();
    var searchCondition  = $("#salesChartForm").serializeArray();
    var strCondition = formatFormJson(searchCondition);
    $.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/productionOrder",
		data : {
			"method" : "queryOutsourProductionStatement",
			"formData":strCondition
			
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
	
	var tempData = temp.date;
	console.info(tempData);
	var tempHtml = '';
	tempHtml +=//'<table>'+
		'<tr>'+
		'<th>外协厂商</th>'+
		'<th>生产查询号</th>'+
		'<th>派工单号</th>'+
		'<th>物料编码</th>'+
		'<th>物料名称</th>'+
		'<th>规格型号</th>'+
		'<th>成品库存</th>'+  
		'<th>材料规格和库存</th>'+    
		'<th>已下达计划数</th>'+
		'<th>未完成数</th>'+
		'<th>备注</th>'+
		'</tr>';
	if (tempData == null || tempData == undefined ||tempData.length == 0){
        tempHtml += '<tr><th colspan="11" style="text-align: center">没有数据！</th></tr>'
        $('#passRateProductionsCondition').html(tempHtml);
        return;	
	}
	
	var countHJ = 0.0;           //合计总计划数
	var surplusnumberHJ = 0.0;   //合计总完成数
	for(var i = 0; i < tempData.length; i ++){
		var productionsearchno = tempData[i].productionsearchno ? tempData[i].productionsearchno:"";  //生产查询号
		var dispatchingnumber = tempData[i].dispatchingnumber ? tempData[i].dispatchingnumber:"";     //派工单号
        var productorname = tempData[i].productorname ? tempData[i].productorname:"";  //产品编码
        var productordesc = tempData[i].productordesc ? tempData[i].productordesc:"";  //产品名称
        var material   = tempData[i].material ? tempData[i].material:"";               //产品型号
        var bcpcount   = tempData[i].bcpcount ? tempData[i].bcpcount:"";               //半成品库存
        var ymaterialandclcount   = tempData[i].ymaterialandclcount ? tempData[i].ymaterialandclcount:"";                  //材料库存
        var equipmentname   = tempData[i].equipmentname ? tempData[i].equipmentname:"";//外协商名称
        var count = tempData[i].count ? tempData[i].count:"";                          //计划数
        var surplusnumber = tempData[i].surplusnumber ? tempData[i].surplusnumber:"";  //未完成数
        var comments = tempData[i].comments ? tempData[i].comments:"";                 //备注
//        var xscount       = tempData[i].xscount ? tempData[i].xscount:"";              //销售类型的需求数量
//        var dosage   = tempData[i].dosage ? tempData[i].dosage:0;                      //用量
//        var xqcount         = tempData[i].xqcount ? tempData[i].xqcount:0;             //销售 + 设计代签 需求数量
//        var jjtotalcount      = tempData[i].jjtotalcount ? tempData[i].jjtotalcount:0; //机加库存
//        var pwtotalcount    = tempData[i].pwtotalcount ? tempData[i].pwtotalcount:0;   //抛丸库存
//        var pttotalcount   = tempData[i].pttotalcount ? tempData[i].pttotalcount:0;    //喷涂
//        var uninstocknumber  = tempData[i].uninstocknumber ? tempData[i].uninstocknumber:0; //未入库数
//        var xycount = tempData[i].xycount ? tempData[i].xycount:0;                          //差异数量
//        var mouldnumbercapacity = tempData[i].mouldnumbercapacity ? tempData[i].mouldnumbercapacity:0; //日产能
//        var moulddaily = tempData[i].moulddaily ? tempData[i].moulddaily:0;             //可用天数
//        
//        if (xscount < 0){
//        	xscount = 0.0
//        }
//        if (xqcount < 0){
//        	xqcount = 0.0
//        }
//        if (xycount < 0){
//        	xycount = 0.0
//        }
//        var bomid = tempData[i].bomid ? tempData[i].bomid:"";  
        
        tempHtml +=  //'<table>'+  <tr><td style="text-align:center;width:35px;"><input role="checkbox" type="checkbox" pgdid="'+tempData[key].pgdList[i].orderid+'" class="cbox checkbox" /></td>
            '<tr>'+
            '<td style="line-height: 29px">' + equipmentname + '</td>'+
            '<td style="line-height: 29px">' + productionsearchno + '</td>'+
            '<td style="line-height: 29px">' + dispatchingnumber + '</td>'+
            '<td style="line-height: 29px">' + productorname + '</td>'+
            '<td style="line-height: 29px">' + productordesc + '</td>'+
            '<td style="line-height: 29px">' + material + '</td>'+
            '<td style="line-height: 29px">' + bcpcount + '</td>'+
            '<td style="line-height: 29px">' + ymaterialandclcount + '</td>'+
            '<td style="line-height: 29px">' + count + '</td>'+
            '<td style="line-height: 29px">' + surplusnumber + '</td>'+
            '<td style="line-height: 29px">' + comments + '</td>'+
            '</tr>';
        
        countHJ += count;
        surplusnumberHJ += surplusnumber;
	}
	tempHtml +=
	 '<tr>'+
	 '<td style="line-height: 39px"></td>'+
	 '<td style="line-height: 39px"></td>'+
     '<td style="line-height: 39px"></td>'+
     '<td style="line-height: 39px"></td>'+
     '<td style="line-height: 39px"></td>'+
     '<td style="line-height: 39px"></td>'+
     '<td style="line-height: 39px"></td>'+
     '<th style="line-height: 39px">' + "合计" + '</th>'+
     '<th style="line-height: 39px">' + countHJ + '</hd>'+
     '<th style="line-height: 39px">' + surplusnumberHJ + '</hd>'+
     '<td style="line-height: 39px"></td>'+
     '</tr>';
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
 * 弹出外协计划生产订单模态框
 * 
 */
var showVulcanizationModall = function ( ) {
    console.log("===================");  
    var starttime = $("#adjuststarttime").val();
    console.log("==================="+starttime);
	var endtime = $("#adjustendtime").val();
	console.log("==================="+endtime);
	
    //获取选中的数据
	var checkboxs = $("#passRateProductionsCondition :checked");
	if ( checkboxs.length == 0  ) {
	    lwalert("tipModal", 1, "请选择数据进行外协计划生产订单操作!");
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
						'<th>产品名称</th>'+
						'<th>型号</th>'+
						'<th>需求数量(销售)</th>'+
						'<th>用量</th>'+
						'<th>需求数量(销售与代签)</th>'+
						'<th>机加库存量</th>'+
						'<th>抛丸库存量</th>'+
						'<th>喷涂库存量</th>'+
						'<th>未入库数</th>'+
						'<th>差异数量</th>'+
						'<th>日产能</th>'+
						'<th>可生产天数</th>'+  //13
						'<th>投产数量</th>'+   //差异数量 
						'<th>可用天数</th>'+   // 投产数量 / 日产能  + 可生产天数
						'<th>开始时间</th>'+
						'<th>结束时间</th>'+
						'</tr>';         //tr         td       input      
			  } else if (!passRateProductions[i].childNodes[0].childNodes[0].checked) {
				  continue;   //如果这一行没有被选中，跳过
			  } else {
				 var tr = passRateProductions[i]; 
				 console.log("==="+tr.childNodes[0].childNodes[0].getAttribute('bomid'));
				    //可用天数   // 投产数量 / 日产能  + 可生产天数
				    var candays  =  parseFloat(tr.childNodes[11].innerHTML) / parseFloat(tr.childNodes[12].innerHTML) + parseFloat(tr.childNodes[13].innerHTML);
					tempHtml +=//'<table>'+
						'<tr>'+
						'<th style="text-align:center;width:35px;"><input type="checkbox" bomid = "'+tr.childNodes[0].childNodes[0].getAttribute('bomid')+'"  /></th>'+
						'<th>'+tr.childNodes[1].innerHTML+'</th>'+
						'<th>'+ '<input type="text" class="form-control" placeholder="查询号" style="width: 100px;height: 30px">'+'</th>'+
						'<th>'+tr.childNodes[2].innerHTML+'</th>'+
						'<th>'+tr.childNodes[3].innerHTML+'</th>'+
						'<th>'+tr.childNodes[4].innerHTML+'</th>'+
						'<th>'+tr.childNodes[5].innerHTML+'</th>'+
						'<th>'+tr.childNodes[6].innerHTML+'</th>'+
						'<th>'+tr.childNodes[7].innerHTML+'</th>'+
						'<th>'+tr.childNodes[8].innerHTML+'</th>'+
						'<th>'+tr.childNodes[9].innerHTML+'</th>'+
						'<th>'+tr.childNodes[10].innerHTML+'</th>'+
						'<th>'+tr.childNodes[11].innerHTML+'</th>'+ // 差异数量
						'<th>'+'<input type="text" readonly class="form-control" id = "rcn'+i+'" value="'+tr.childNodes[12].innerHTML+'" style="width: 80px;height: 30px">'+'</th>'+ // 日产能
						'<th>'+'<input type="text" readonly class="form-control" id = "kct'+i+'" value="'+tr.childNodes[13].innerHTML+'" style="width: 80px;height: 30px">'+'</th>'+ // 可生产天数
						'<th>'+'<input type="text" class="form-control" onblur="capture(this)" id = "tcs'+i+'" value="'+tr.childNodes[11].innerHTML+'" style="width: 80px;height: 30px">' +'</th>'+    //
						'<th>'+'<input type="text" readonly class="form-control" id = "kyt'+i+'" value="'+candays+'" style="width: 80px;height: 30px">'+'</th>'+ 
						'<th>'+ '<input type="text" class="form-control time-pick" name = "time" placeholder="开始日期" style="width: 150px;height: 30px">' +'</th>'+
						'<th>'+ '<input type="text" class="form-control time-pick" name = "time" placeholder="结束日期" style="width: 150px;height: 30px">' +'</th>'+
						'</tr>'; 
					 }
		 }
	$('#vulcanizationPlanData').html(tempHtml);
	//给开始时间和结束时间，添加时间控件
	com.leanway.initTimePickYmdHmsForMoreId("input.time-pick");
}
   

function capture(data) { 
	var str = data.id;
	var value = data.value;
	var id = str.substr(3,str.length-3);
	var str2 = "rcn"+id;
	//日产能
	var cn =  $("#"+str2).val();
	//可生产天数
	var str3 = "kct"+id;
	var kct =  $("#"+str3).val();
	//可用天数   // 投产数量 / 日产能  + 可生产天数
    var candays  =  parseFloat(value) / parseFloat(cn) + parseFloat(kct);
	var str1 = "kyt"+id;
    $("#"+str1).val(candays);
}  




//点击确定
var determine = function () {
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
			obj.bomid = $($(thList).children()[0]).attr("bomid");
			obj.productorname = $($(thList)[1]).html();
			obj.productionsearchno =  $($($(thList)[2]).children()[0]).val();
			obj.demandCount = $($($(thList)[15]).children()[0]).val();
			obj.adjuststarttime = $($($(thList)[17]).children()[0]).val();
			obj.adjustendtime = $($($(thList)[18]).children()[0]).val();
			objList.push(obj);
		}
	});
	  json = JSON.stringify(objList);
	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productionOrder",
		data : {
			"method" : "addCurrentPOTw",
			"json" : json
		},
		dataType : "json",
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {
				if (text.status == "success") {
					$('#moveDataModal').modal('hide');
					lwalert("tipModal", 1, text.info); 
				} else {
					lwalert("tipModal", 1, text.info);
				}
			}
		},
		error : function() {
			lwalert("tipModal", 1, "ajax error！");
		}
	});
}


