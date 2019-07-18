var condition = "";
var valuei;
var trHtml;
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

//查询钢板采购需求报表数据
function querySeasonalPlan(){
	 var star = $("#adjuststarttime").val();
	 var end = $("#adjustendtime").val();

	showMask();
    var searchCondition  = $("#salesChartForm").serializeArray();
    var strCondition = formatFormJson(searchCondition);
    $.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/productionOrder",
		data : {
			"method" : "querySteelPlatePurchaseDemand",
			"formData":strCondition,
			"star":star,
			"end":end
		},
		dataType : "json",
		async : true,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);
				if (flag) {
					lwalert("tipModal", 1, data.info);
					if (data.status == "success") {
						 hideMask();
						 viewPassRateProduction(data);
					}
				}
		},
		error : function() {
			lwalert("tipModal", 1, "ajax error！");
		}
	});
}

function viewPassRateProduction(temp){
	
	var tempData = temp.data;
	console.info(tempData);
	var tempHtml = '';
	tempHtml +=//'<table>'+
		'<tr>'+
		'<th style="text-align:center;width:10px;"><input type="checkbox"/></th>'+
		'<th style="line-height: auto" width: auto;>产品编码</th>'+
		'<th style="line-height: auto" width: auto;>产品名称</th>'+
		'<th style="line-height: auto" width: auto;>钢板库</th>'+
		//'<th style="line-height: auto" width: auto;>型号</th>'+
		'<th style="line-height: auto" width: auto;>计划需求/差异数(销售)</th>'+  //销售订单
		'<th style="line-height: auto" width: auto;>计划需求/差异数(销售+代签)</th>'+ //销售代签
		'<th style="line-height: auto" width: auto;>钢板在线未使用量</th>'+
		'<th style="line-height: auto" width: auto;>机加库</th>'+
		'<th style="line-height: auto" width: auto;>抛丸库</th>'+
		'<th style="line-height: auto" width: auto;>喷涂库</th>'+
		//'<th style="line-height: auto" width: auto;>硫化库</th>'+
		//'<th style="line-height: auto" width: auto;>力学库</th>'+
		//'<th style="line-height: auto" width: auto;>成品库</th>'+
		'<th style="line-height: auto" width: auto;>差异数(销售+代签)</th>'+
		'<th style="line-height: auto" width: auto;>日产能</th>'+
		'<th style="line-height: auto" width: auto;>在途未收货</th>'+
		'<th style="line-height: auto" width: auto;>现库存可用天</th>'+
		'<th style="line-height: auto" width: auto;>现库存+在途可用天</th>'+
		'<th style="line-height: auto" width: auto;>钢卷库/折合</th>'+
		'<th style="line-height: auto" width: auto;>订购数</th>'+
		'<th style="line-height: auto" width: auto;>订购后可用天</th>'+
		
		'</tr>';
	if (tempData.length == 0){
        tempHtml += '<tr><td colspan="22" style="text-align: center">没有数据！</td></tr>'
        return;	
	}
	
	
	for(var i = 0; i < tempData.length; i ++){
        var productorname = tempData[i].productorname ? tempData[i].productorname:"";  //产品编码
        var productordesc = tempData[i].productordesc ? tempData[i].productordesc:"";  //产品名称
        var material   = tempData[i].material ? tempData[i].material:"";               //产品型号
        var xsjnums       = tempData[i].xsjnums ? tempData[i].xsjnums:0.0;              //销售类型的需求数量  
        var xscount       = tempData[i].xscount ? tempData[i].xscount:0.0;                 //销售类型的差异数量  
        var xandsjnums       = tempData[i].xandsjnums ? tempData[i].xandsjnums:0.0;     //销售类型+设计代签的需求数量  
        var xqcount       = tempData[i].xqcount ? tempData[i].xqcount:0.0;                 //销售类型+设计代签的差异数量==========差异数量 
        var gbzw       = tempData[i].gbzw ? tempData[i].gbzw:0.0;                       //钢板在线未使用量
        var gbtotalcount       = tempData[i].gbtotalcount ? tempData[i].gbtotalcount:0.0;//钢板库存
        var jjtotalcount      = tempData[i].jjtotalcount ? tempData[i].jjtotalcount:0.0;  //机加库存
        var pwtotalcount    = tempData[i].pwtotalcount ? tempData[i].pwtotalcount:0.0;   //抛丸库存
        var pttotalcount   = tempData[i].pttotalcount ? tempData[i].pttotalcount:0.0;    //喷涂库存  
        //var luk   = tempData[i].luk ? tempData[i].luk:0.0;                               //硫化后支座库存 
        //var lxk   = tempData[i].luk ? tempData[i].lxk:0.0;                               //力学后支座库存
        //var zunum   = tempData[i].zunum ? tempData[i].zunum:0.0;                         //产成品支座库存
        var gbmolddailycapacity  = tempData[i].gbmolddailycapacity ? tempData[i].gbmolddailycapacity:0.0; //日产能  gbmolddailycapacity
        var ztnum = tempData[i].ztnum ? tempData[i].ztnum:0.0;                           //钢板在途未收货数
        var canproday = tempData[i].canproday ? tempData[i].canproday:0.0;             //现有库存可生产天数
        var zcanproday = tempData[i].zcanproday ? tempData[i].zcanproday:0.0;             //现有库存+在途可生产天数
        var gjtotalcount = tempData[i].gjtotalcount ? tempData[i].gjtotalcount:"";             //钢卷库存 /折合
        var gjconversiongbnumber = tempData[i].gjconversiongbnumber ? tempData[i].gjconversiongbnumber:""; 
       /* if (xscount < 0){
        	xscount = 0.0
        }*/
        var productorid = tempData[i].productorid ? tempData[i].productorid:"";  
        tempHtml +=//'<table>'+  <tr><td style="text-align:center;width:35px;"><input role="checkbox" type="checkbox" pgdid="'+tempData[key].pgdList[i].orderid+'" class="cbox checkbox" /></td>
            '<tr>'+
            '<td style="text-align:center;width:10px;"><input type="checkbox" productorid="'+productorid+'" /></td>'+
            '<td style="line-height: auto">' + productorname + '</td>'+
            '<td style="line-height: auto">' + productordesc + '</td>'+
            '<td style="line-height: auto">' + gbtotalcount + '</td>'+
            //'<td style="line-height: auto">' + material + '</td>'+
            '<td style="line-height: auto">' + xsjnums+" / "+xscount+ '</td>'+
            '<td style="line-height: auto">' + xandsjnums+" / "+xqcount+ '</td>'+
            '<td style="line-height: auto">' + gbzw + '</td>'+
            '<td style="line-height: auto">' + jjtotalcount + '</td>'+
            '<td style="line-height: auto">' + pwtotalcount + '</td>'+
            '<td style="line-height: auto">' + pttotalcount + '</td>'+
            //'<td style="line-height: auto">' + luk + '</td>'+
            //'<td style="line-height: auto">' + lxk + '</td>'+
            //'<td style="line-height: auto">' + zunum + '</td>'+
            '<td style="line-height: auto">' + xqcount + '</td>'+
            '<td style="line-height: auto">' + gbmolddailycapacity + '</td>'+
            '<td style="line-height: auto">' + ztnum + '</td>'+
            '<td style="line-height: auto">' + canproday + '</td>'+
            '<td style="line-height: auto">' + zcanproday + '</td>'+
            '<td style="line-height: auto">' + gjtotalcount+"/"+gjconversiongbnumber+ '</td>'+
            '<td style="line-height: 80px">' + '<input type="text" class="form-control" style="width: 35px;height: 30px">' + '</td>'+
            '<td style="line-height: 80px">' + '<input type="text" class="form-control" style="width: 35px;height: 30px">' + '</td>'+
            '</tr>';
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

//var getLiuhuaProductorMould = function ( ) {
//	
//	$.ajax({
//		type : "post",
//		url : "../../../../"+ln_project+"/dispatchingOrder",
//		data : {
//			method : "queryLiuhuaMould"
//			
//		},
//		dataType : "json",
//		async : false, 
//		success : function(data) {
//
//			var flag =  com.leanway.checkLogind(data);
//
//			if ( flag ) {
//				addPlanDataArray = data;
//			}
//		},
//		error : function(data) {
//			lwalert("tipModal", 1,"ajax 请求失败");
//		}
//	});
//}

//加载产品的版本信息
var loadPsv = function(productorid) {

	var html = "";

	$.ajax({
		type : "post",
		url : "../../../../" + ln_project + "/productors",
		data : {
			method : "queryPsv",
			productorid : productorid
		},
		async : false,
		dataType : "json",
		success : function(data) {

			var flag = com.leanway.checkLogind(data);

			if (flag) {

				var addPlanDataArray = data;
				var mould = null;
				if (addPlanDataArray != undefined && typeof(addPlanDataArray) != "undefined") {
					mould = addPlanDataArray;
				}
				trHtml = "";
				// 模具
				for (var i = 0; i < mould.length; i++) {
					trHtml += '<option value="' + mould[i].versionid + '">' + mould[i].versionname + '</option>';
				}
			}
		},
		error : function(data) {
			lwalert("tipModal", 1,"ajax 请求失败");
		}
	});

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
	
//	getLiuhuaProductorMould();
//	var mould = null;
//	if (addPlanDataArray.mould != undefined && typeof(addPlanDataArray.mould) != "undefined") {
//		mould = addPlanDataArray.mould;
//	}
//	var trHtml = "";
//	// 模具
//	for (var i = 0; i < mould.length; i++) {
//		trHtml += '<option value="' + mould[i].versionid + '">' + mould[i].productorname + '</option>';
//	}
//	
	
	
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
						'<th>完工时间</th>'+
						'<th>产品版本</th>'+
						'</tr>';         //tr         td       input      
			  } else if (!passRateProductions[i].childNodes[0].childNodes[0].checked) {
				  continue;   //如果这一行没有被选中，跳过
			  } else {
				 var tr = passRateProductions[i]; 
				 console.log("==="+tr.childNodes[0].childNodes[0].getAttribute('productorid'));
				    
				 
				 var productorid = tr.childNodes[0].childNodes[0].getAttribute('productorid');
				    loadPsv(productorid);
					
				 
				 //可用天数   // 投产数量 / 日产能  + 可生产天数
				    var candays  =  parseFloat(tr.childNodes[11].innerHTML) / parseFloat(tr.childNodes[12].innerHTML) + parseFloat(tr.childNodes[13].innerHTML);
					tempHtml +=//'<table>'+
						'<tr>'+
						'<th style="text-align:center;width:35px;"><input type="checkbox" productorid = "'+tr.childNodes[0].childNodes[0].getAttribute('productorid')+'"  /></th>'+
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
						//'<th>'+ '<input type="text" class="form-control time-pick" name = "time" placeholder="开始日期" style="width: 150px;height: 30px">' +'</th>'+
						'<th>'+ '<input type="text" class="form-control time-pick" name = "time" placeholder="完工时间" style="width: 150px;height: 30px">' +'</th>'+
						'<th>'+ '<select name="versionid" multiple="multiple" class="form-control input-sm" style="width: 150px;height : 32px;">"'+trHtml+'"</select>' +'</th>'+
						'</tr>'; 
					 }
		 }
	$('#vulcanizationPlanData').html(tempHtml);
	//给开始时间和结束时间，添加时间控件
	com.leanway.initTimePickYmdHmsForMoreId("input.time-pick");
	$("select[name='versionid']").select2({placeholder : "版本(单选)", tags: false, language : "zh-CN", allowClear: true, maximumSelectionLength: 10 });
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
			obj.productorid = $($(thList).children()[0]).attr("productorid");
			obj.productorname = $($(thList)[1]).html();
			obj.productionsearchno =  $($($(thList)[2]).children()[0]).val();
			obj.demandCount = $($($(thList)[15]).children()[0]).val();
			//obj.adjuststarttime = $($($(thList)[17]).children()[0]).val();
			obj.adjustendtime = $($($(thList)[17]).children()[0]).val();
			obj.versionid = $($($(thList)[18]).children()[0]).find("option:selected").val();
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


