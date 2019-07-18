var equipmentTable;
var ths;
var thss;
var iDays;
var jh;
var wh;
var dates;
var jws;
var clicktime = new Date();
$(function() {
	com.leanway.initSelect2("#personcenterid", "../../../../"+ln_project+"/workCenter?method=queryWorkCenterBySelect&type=2", "搜索人工工作中心",true);
	initTimePickYmd("starttime");
	initTimePickYmd("endtime");

});


//查询日计划数据
function sulfideStatementDate(){
	
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	//产品编码
	var productorname = $("#productorname").val();
	// 人工工作中心
	var personcenterid = $("#personcenterid").val();
	if (personcenterid != null && personcenterid != "" && typeof(personcenterid) != "undefined" && personcenterid != undefined) {
		personcenterid = personcenterid.toString();
	} else {
		lwalert("tipModal", 1,"人工工作中心不能为空！");
		return;
	} 
	
	
	if(starttime==null||starttime==""||endtime==""||endtime==null){
		lwalert("tipModal", 1,"查询日期范围请填写完整！");
		return;
	}else if(starttime>endtime){
		lwalert("tipModal", 1,"开始时间不能大于结束时间！");
		return;
	}
		 $("#mask").show();
			$.ajax ( {
				type : "post",
				url : "../../../"+ln_project+"/productionOrder",
				data : {
					"method" : "querysulfideStatementDate", 
					"starttime":starttime,
					"endtime":endtime,
					"personcenterid":personcenterid,
					"productorname":productorname
						},
				dataType : "json",
				async : true,
				success : function ( data ) {
					var flag =  com.leanway.checkLogind(data);
					if(flag){
                        	viewSulfideStatementDate(data); //展示日报表数据                   
                        	$("#mask").hide();
					}
				}
			});
}


function print() {
    retainAttr = true;
    //当点击打印。
    $("#personcentername").show();//显示
    var personcentername = $('#personcenterid option:selected').text();
    $("#personcentername").val(personcentername)
    $("#table_table").printArea();
    
}


function viewSulfideStatementDate(temp){
	
	loadsulfideStatementTR();
	
	var tempData = temp.date;
	console.info(tempData);  
	var tempHtml = '';
	tempHtml += 
		'<tr>'+
		'<th rowspan="2" style="width:90px;">查询号</th>'+
		'<th rowspan="2" style="width:120px;">派工单号</th>'+
		'<th rowspan="2" style="width:100px;">物料编码</th>'+
		'<th rowspan="2" style="width:120px;">物料名称</th>'+
		'<th>计划需完成数</th>'+
		'<th>实际完成数</th>'+ dates +''+
		//'<th rowspan="2">单位</th>'+dates+''+
		'<th colspan="2">合计</th>'+
		'</tr>';
	tempHtml +=          
		'<tr>'+
		'<th>'+head_1+'</th>'+
		'<th>'+head_2+'</th>'+jws+''+
		'<th>计划数</th>'+
		'<th>完成数</th>'+
		'</tr>';
	
	
	 iDays = (iDays + 1) * 2 + 8; 
	
	if (tempData == null || tempData.length == 0 ){
        tempHtml += '<tr><th colspan='+iDays+' style="text-align: center">没有数据！</th></tr>'
        $('#sulfideStatementTable').html(tempHtml);
    	hideMask();
    	return;
	}
	//封装日计划table表格
	for (var i = 0; i < tempData.length; i++) {
		// 派工单信息。
		var pgdInfo = tempData[i];
		var barcode = pgdInfo.barcode ? pgdInfo.barcode:"";                                     //订单单号   【派工单号】
		var productionsearchno = pgdInfo.productionsearchno ? pgdInfo.productionsearchno:"";    //项目名称   【查询号】
        var material = pgdInfo.material ? pgdInfo.material:"";                                  //产品规格    
        //var number = pgdInfo.number ? pgdInfo.number:"";                                      //订单总数    【生产订单总数】
        var productorname   = pgdInfo.productorname ? pgdInfo.productorname:"";                 //物料编码
        var productordesc      = pgdInfo.productordesc ? pgdInfo.productordesc:"";              //物料名称
        var unitsname   = pgdInfo.unitsname ? pgdInfo.unitsname:"";                             //单位名称
        var datejnumber = pgdInfo.datejnumber;  //日期计划数
        var datewnumber = pgdInfo.datewnumber;  //日完工数
        var specification = pgdInfo.specification ? pgdInfo.specification:""                    //支座设计区域
        tempHtml += '<tr>';
        tempHtml +='<td>'+productionsearchno+'</td>';
        tempHtml +='<td>'+barcode+'</td>';
        tempHtml +='<td>'+productorname+'</td>';
        tempHtml +='<td>'+productordesc+'</td>';
        //tempHtml +='<td></td>';
        //tempHtml +='<td></td>';
       // tempHtml +='<td>'+unitsname+'</td>';
        //封装当天的计划数和完工数
        loadsulfideStatementTRnumber(datejnumber,datewnumber);
        tempHtml += thss;
        tempHtml +='<td>'+jh+'</td>';
        tempHtml +='<td>'+wh+'</td>';
        tempHtml += '</tr>';
       
        
	}
	$('#sulfideStatementTable').html(tempHtml);
	hideMask();
	
	
}




//加载日计划报表表头
var loadsulfideStatementTR = function ( ) {
	
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
 
	var sDate1 = Date.parse(starttime);
	var sDate2 = Date.parse(endtime);
	var dateSpan = sDate2 - sDate1;
	var dateSpan = Math.abs(dateSpan);
	    iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
	var obj = new Object();
	obj.starttime = starttime;
	obj.endtime = endtime;
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			method : "loadsulfideStatementTR",
			"strCondition" : $.trim(JSON.stringify(obj))
		},
		dataType : "json",
		async : false, 
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
				dates = data.html
				jws = data.jws;
				head_1 = data.head_1;
				head_2 = data.head_2;
				
			}
		},
		error : function(data) {
			lwalert("tipModal", 1,"ajax 请求失败");
		}
	});
	
}


//加载日计划报表数据(日期段)
var loadsulfideStatementTRnumber = function (datejnumber,datewnumber) {
	
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
 
	var sDate1 = Date.parse(starttime);
	var sDate2 = Date.parse(endtime);
	var dateSpan = sDate2 - sDate1;
	var dateSpan = Math.abs(dateSpan);
	    iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
	var obj = new Object();
	obj.starttime = starttime;
	obj.endtime = endtime;
	obj.datejnumber = datejnumber;
	obj.datewnumber = datewnumber;
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			method : "loadsulfideStatementTRnumber",
			"strCondition" : $.trim(JSON.stringify(obj))
		},
		dataType : "json",
		async : false, 
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
				thss = data.jws
				  jh = data.jh
			      wh = data.wh	
			}
		},
		error : function(data) {
			lwalert("tipModal", 1,"ajax 请求失败");
		}
	});
	
}






function viewChart(tempData){

    var starttime = $("#starttime").val().replace(/-/g, '/');
    var endtime = $("#endtime").val().replace(/-/g, '/');

	// 创建日期对象
    var starttimedate = new Date(starttime);
    var endtimedate = new Date(endtime);
    endtimedate.setDate(endtimedate.getDate() + 1);

    var starttimec = starttimedate.getTime();
    var endtimec = endtimedate.getTime();
	var time = endtimedate.getTime() - starttimedate.getTime();


	tempHtml2 = "";
	tempHtml1 = "";
	
	var j = 0;
	for(var key in tempData){
		if(chk(j)==='偶数'){
	    //console.log("属性：" + key + ",值："+ tempData[key]); 
	    //第一行
	    tempHtml2 +='<tr><th style="text-align:center;width:35px;"><input type="checkbox" class="cbox checkbox" /></th>';
	    tempHtml2 +='<th>设备</th>';
	    tempHtml2 +='<th>品名</th>';
    	tempHtml2 +='<th>生产批次号</th>';
    	tempHtml2 +='<th>数量</th>';
    	tempHtml2 +='<th>开始交期</th>';
    	tempHtml2 +='<th>结束交期</th>';
    	tempHtml2 +='<th>机械负荷</th>';
    	tempHtml2 +='<th>生产周期</th></tr>';
    	var num = 0;
    	var nums = 0;
    	
        /**
         * tempData 后台返回json数据对象
         * 示例：{"设备名称":{"pgd":["obj","obj"],"cn":"double数值"}}
         */
    	var a = tempData[key];
    	
    	for(var i = 0;i< tempData[key].pgdList.length;i++){
	    	//有多少数据循环多少次
    		var runtime = tempData[key].pgdList[i].runtime;
    		//生产周期
    		var time1 = DateDiff_hour(runtime);
    		//机械负荷
    		var time2 = DateDiff_minute(runtime);
    		
    		var productordesc = tempData[key].pgdList[i].productordesc ? tempData[key].pgdList[i].productordesc:"";
    		var productionchildsearchno = tempData[key].pgdList[i].productionchildsearchno ? tempData[key].pgdList[i].productionchildsearchno:"";
    		var count = tempData[key].pgdList[i].count ? tempData[key].pgdList[i].count:"";
    		var adjuststarttime = tempData[key].pgdList[i].adjuststarttime ? tempData[key].pgdList[i].adjuststarttime:"";
    		var adjustendtime = tempData[key].pgdList[i].adjustendtime ? tempData[key].pgdList[i].adjustendtime:"";
    		
    		
    		
    		tempHtml2 +='<tr><td style="text-align:center;width:35px;"><input role="checkbox" type="checkbox" pgdid="'+tempData[key].pgdList[i].orderid+'" class="cbox checkbox" /></td>';
            tempHtml2 +='<td class="active" align="center" text-align="center">'+key+'</td>';
    		tempHtml2 +='<td>'+productordesc+'</td>';
    		tempHtml2 +='<td>'+productionchildsearchno+'</td>';
    		tempHtml2 +='<td style="text-align:center;">'+count+'</td>';
            // tempHtml2 +='<td>'+adjuststarttime+'</td>';
            // tempHtml2 +='<td>'+adjustendtime+'</td>';

            var adjuststarttime = adjuststarttime.replace(/-/g, '/');
            var adjustendtime = adjustendtime.replace(/-/g, '/');

            // 创建日期对象
            var adjuststarttimedate = new Date(adjuststarttime);
            var adjustendtimedate = new Date(adjustendtime);

            var starttimechild = adjuststarttimedate.getTime();
            var endtimechild = adjustendtimedate.getTime();
            var timechild = endtimechild - starttimechild;

            var scale1 = 0;
			if (!isNaN((starttimechild - starttimec) / time)){
                scale1 = (starttimechild - starttimec) / time * 100;
			}

            var scale2 = 0;
            if (!isNaN( timechild / time)){
            	if (scale1 + (timechild / time * 100) > 100 ) {
                    scale2 = 100 - scale1;
				} else {
                    scale2 = timechild / time * 100;
				}
            }

            tempHtml2 +='<td colspan="2">'+ '<div style="width:'+scale1+'%;height: 36px;white-space: nowrap;float: left;position:relative;z-index:999 ">' + adjuststarttime + "<br>" + adjustendtime +  '</div><div style="background-color: #7DB9DE;width:'+scale2+'%;height: 36px;float: left"></div></div>' + '</td>';

            tempHtml2 +='<td>'+time2+'</td>';
    		tempHtml2 +='<td>'+time1+'</td>';
    		tempHtml2 +='</tr>';
    		num += tempData[key].pgdList[i].count;
    		nums += tempData[key].pgdList[i].runtime;
    		
	    }
    	
    	var jx = DateDiff_minute(nums);
    	//在时间范围内的产能
    	var gd = DateDifffff(tempData[key].cn);
    	tempHtml2 +='<tr bgcolor="#B0C4DE";><th bgcolor="#B0C4DE";>合计</th>';
    	tempHtml2 +='<td bgcolor="#B0C4DE";></td>';
    	tempHtml2 +='<td bgcolor="#B0C4DE";></td>';
    	tempHtml2 +='<td bgcolor="#B0C4DE";></td>';
    	tempHtml2 +='<th bgcolor="#B0C4DE";>'+num.toFixed(3)+'</th>';
    	tempHtml2 +='<th bgcolor="#B0C4DE";>保有时间</th>';
    	tempHtml2 +='<th bgcolor="#B0C4DE";>'+gd+'</th>';
    	tempHtml2 +='<th bgcolor="#B0C4DE";>'+jx+'</th>';
    	tempHtml2 +='<td bgcolor="#B0C4DE";></td></tr>';
    	
    	
    	
    	
	}else{
		 console.log("属性：" + key + ",值："+ tempData[key].pgdList); 
		    //第一行
		    tempHtml1 +='<tr><th style="text-align:center;width:35px;"><input type="checkbox" class="cbox checkbox" /></th>';
		    tempHtml1 +='<th>设备</th>';
		    tempHtml1 +='<th>生产批次号</th>';
	    	tempHtml1 +='<th>品名</th>';
	    	tempHtml1 +='<th>数量</th>';
	    	tempHtml1 +='<th>开始交期</th>';
	    	tempHtml1 +='<th>结束交期</th>';
	    	tempHtml1 +='<th>机械负荷</th>';
	    	tempHtml1 +='<th>生产周期</th></tr>';
	    	var num = 0;
	    	var nums = 0;
	    	
	    	for(var i = 0;i< tempData[key].pgdList.length;i++){
		    	//有多少数据循环多少次
	    		var runtime = tempData[key].pgdList[i].runtime;
	    		//生产周期
	    		var time1 = DateDiff_hour(runtime);
	    		//机械负荷
	    		var time2 = DateDiff_minute(runtime); 
	    		
	    		var productordesc = tempData[key].pgdList[i].productordesc ? tempData[key].pgdList[i].productordesc:"";
	    		var productionchildsearchno = tempData[key].pgdList[i].productionchildsearchno ? tempData[key].pgdList[i].productionchildsearchno:"";
	    		var count = tempData[key].pgdList[i].count ? tempData[key].pgdList[i].count:"";
	    		var adjuststarttime = tempData[key].pgdList[i].adjuststarttime ? tempData[key].pgdList[i].adjuststarttime:"";
	    		var adjustendtime = tempData[key].pgdList[i].adjustendtime ? tempData[key].pgdList[i].adjustendtime:"";
	    		
	    		
	    		tempHtml1 +='<tr><td style="text-align:center;width:35px;"><input role="checkbox" type="checkbox" pgdid="'+tempData[key].pgdList[i].orderid+'" class="cbox checkbox" /></td>';
	            tempHtml1 +='<td class="active" align="center" text-align="center">'+key+'</td>';
	    		tempHtml1 +='<td>'+productordesc+'</td>';
	    		tempHtml1 +='<td>'+productionchildsearchno+'</td>';
	    		tempHtml1 +='<td style="text-align:center;">'+count+'</td>';
	    		// tempHtml1 +='<td>'+adjuststarttime+'</td>';
	    		// tempHtml1 +='<td>'+adjustendtime+'</td>';

                var adjuststarttime = adjuststarttime.replace(/-/g, '/');
                var adjustendtime = adjustendtime.replace(/-/g, '/');

                // 创建日期对象
                var adjuststarttimedate = new Date(adjuststarttime);
                var adjustendtimedate = new Date(adjustendtime);

                var starttimechild = adjuststarttimedate.getTime();
                var endtimechild = adjustendtimedate.getTime();
                var timechild = endtimechild - starttimechild;

                var scale1 = 0;
                if (!isNaN((starttimechild - starttimec) / time)){
                    scale1 = (starttimechild - starttimec) / time * 100;
                }

                var scale2 = 0;
                if (!isNaN( timechild / time)){
                    if (scale1 + (timechild / time * 100) > 100 ) {
                        scale2 = 100 - scale1;
                    } else {
                        scale2 = timechild / time * 100;
                    }
                }

                tempHtml1 +='<td colspan="2">'+ '<div style="width:'+scale1+'%;height: 36px;white-space: nowrap;float: left;position:relative;z-index:999 ">' + adjuststarttime + "<br>" + adjustendtime +  '</div><div style="background-color: #7DB9DE;width:'+scale2+'%;height: 36px;float: left"></div></div>' + '</td>';

	    		tempHtml1 +='<td>'+time2+'</td>';
	    		tempHtml1 +='<td>'+time1+'</td>';
	    		tempHtml1 +='</tr>';
	    		num += tempData[key].pgdList[i].count;
	    		nums += tempData[key].pgdList[i].runtime;
	    		
		    
	    	}
	    	var jx = DateDiff_minute(nums);
	    	//在时间范围内的产能
	    	var gd = DateDifffff(tempData[key].cn);
	    	tempHtml1 +='<tr bgcolor="#B0C4DE";><th bgcolor="#B0C4DE";>合计</th>';
	    	tempHtml1 +='<td bgcolor="#B0C4DE";></td>';
	    	tempHtml1 +='<td bgcolor="#B0C4DE";></td>';
	    	tempHtml1 +='<td bgcolor="#B0C4DE";></td>';
	    	tempHtml1 +='<th bgcolor="#B0C4DE";>'+num.toFixed(3)+'</th>';
	    	tempHtml1 +='<th bgcolor="#B0C4DE";>保有时间</th>';
	    	tempHtml1 +='<th bgcolor="#B0C4DE";>'+gd+'</th>';
	    	tempHtml1 +='<th bgcolor="#B0C4DE";>'+jx+'</th>';
	    	tempHtml1 +='<td bgcolor="#B0C4DE";></td></tr>';
	}
	        j++;
	}  

	$('#bodyBottleneckCondition2').html(tempHtml2);
	$('#bodyBottleneckCondition22').html(tempHtml1);
	
	
}

//初始化数据表格
var initEquipmentTable = function ( id ) {
	//com.leanway.checkSession();
	var table = $('#equipmentTables').DataTable( {
		"ajax": '../../../../'+ln_project+'/dispatchingOrder?method=queryEquipment&id=' + id,
		'bPaginate': true,
		"bDestory": true,
		"bRetrieve": true,
		"bFilter":false,
		"bSort": false,
		"bProcessing": true,
		"bServerSide": true,
		"bInfo" : true,
		"aoColumns": [
		              {
		            	  "mDataProp": "equipmentid",
		            	  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
//		            		  $(nTd).html("<input type='checkbox' name='employeeCheckList'  value='" + sData + "'>");
		            		  $(nTd)
		            		  .html("<div><input class='regular-checkbox' type='checkbox' id='"
		            				  + sData
		            				  + "' name='equipmentCheckList' value='"
		            				  + sData
		            				  + "'><label for='"
		            				  + sData
		            				  + "'></label></div>");

		            	  }
		              },
		              {"mDataProp": "serialnumber"},
		              {"mDataProp": "equipmentnum"},
		              {"mDataProp": "equipmentname"},
		              {"mDataProp": "barcode"},
		              {"mDataProp": "criticalequipment"}
		              ],
		              "fnCreatedRow": function ( nRow, aData, iDataIndex ) {

		              },
		              "oLanguage" : {
		            	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		              },
		              "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		              "fnDrawCallback" : function(data) {
		            	  	com.leanway.dataTableClick("equipmentTables", "equipmentCheckList", false , equipmentTables);

			            	var data =   equipmentTable.rows().data();
			            	var selectId = "";

			            	if (data != null && data.length == 1) {

			            		selectId = data[0].equipmentid;

			            		com.leanway.setDataTableSelect ("equipmentTables", "equipmentCheckList", selectId);
			            	}

		              }

	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );

	return table;
}

/**
 * 查询设备台帐
 */
var searchEquipment = function ( ) {

	var ids = com.leanway.getDataTableCheckIds("checkList");

	var searchValue =  $("#equipmentSearchValue").val();

	equipmentTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryEquipment&searchValue=" + searchValue + "&id=" + ids).load();
}




function viewCenterChart(tempData){
	console.info(tempData)
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	var days = DateDiff(starttime,endtime);
	var now = new Date(starttime.replace(/-/,"/"));
	var tempHtml = '<tr><th width="150px">工作中心/日期</th>';
	for(var m = 0;m<=days;m++){
		tempHtml +='<th width="130px">'+now.Format("yyyy-MM-dd")+'</th>';

		now.setDate(now.getDate()+1);
	}
	tempHtml +='</tr>';
	$('#bodyBottleneckCondition').html(tempHtml);
	
	tempHtml2 = "";
	for(var i = 0; i < tempData.length; i ++){

		var bgcolor="";

		tempHtml2 +='<tr><th width="150px">'+tempData[i].centername+'('+tempData[i].shorname+')' + '</th>';
		var dailyList =tempData[i].dailyList;
		if(dailyList==null){
			continue;
		}
		for(var j = 0; j < dailyList.length; j ++){
			//未超负载
			if(dailyList[j].usedcapacity<dailyList[j].capacity&&dailyList[j].dailycount!=0&&dailyList[j].capacity!=0&&dailyList[j].usedcapacity!=0){
				bgcolor="#00a60e";
		    //满负载
			}else if(dailyList[j].usedcapacity==dailyList[j].capacity&&dailyList[j].dailycount!=0&&dailyList[j].capacity!=0&&dailyList[j].usedcapacity!=0){
				bgcolor="#f3e912";
			//超负载
			}else if(dailyList[j].usedcapacity>dailyList[j].capacity&&dailyList[j].dailycount!=0&&dailyList[j].capacity!=0){
				bgcolor="#dd4b39";
			}else{
				bgcolor="";
			}
			tempHtml2 +='<td width="130px" bgcolor="'+bgcolor+'">'
			+'生产数量:'+dailyList[j].dailycount+'<br>'
			         +'产能:'+dailyList[j].capacity+'秒<br>'
			         +'已用产能:'+dailyList[j].usedcapacity+'秒<br>'
			         +'<input type="hidden" name="dispatching'+i+j+'" id="dispatching'+i+j+'" value="'+dailyList[j].dispatchingList+'"></td>'
		}
		tempHtml2 +='</tr>';
	}
		$('#bodyBottleneckCondition2').html(tempHtml2);
}

function showMask(){

    $("#mask").show();


  }
  //隐藏遮罩层
  function hideMask(){

	  $("#mask").hide();
  }

  function getCentertype(){

			var html = "";

			// 拼接option
			html += "<option value='0'>全部</option>";
			// 拼接option
			html += "<option value='1'>机器</option>";
			// 拼接option
			html += "<option value='2'>人工</option>";

			$("#centertype").html(html);
		
	}