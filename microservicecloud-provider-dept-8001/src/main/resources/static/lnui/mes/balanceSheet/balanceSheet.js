var equipmentTable;
var clicktime = new Date();
$(function() {

	
	var ids;
	com.leanway.initSelect2("#centerid", "../../../../"+ln_project+"/workCenter?method=queryWorkAllCenterBySelect&type=2", "搜索工作中心",true);
	
	
	com.leanway.loadTags();
	initTimePickYmd("starttime");
	initTimePickYmd("endtime");

	 document.getElementById("content").style.width=$(window).width();
	 document.getElementById("dcontent").style.width=$(window).width();

	 getCentertype();
	
});


function queryDispatchingorder(line,row){

	$.ajax ( {

		type : "post",
		url : "../../../"+ln_project+"/balanceSheet",
		data : {
			"method" : "queryDispatchingorder",
			"line":line,
			"row":row
				},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				console.info(tempData);

				 if(tempData.orderList!=null&&tempData.orderList.length>0){
                 	viewDispatchingOrder(tempData.orderList);
                 }

			}
		}
	});

}

function viewDispatchingOrder(orderList){
	$('#dispatchingModal').modal({backdrop: 'static', keyboard: true});

	var tempHtml = '<tr"><th>派工单号</th>'
		          +'<th>工单号</th>'
		          +'<th>产品名称</th>'
		          +'<th>工序名称</th>'
		          +'<th>工序行号</th>'
		          +'<th>设备名称</th>'
		          +'<th>机器工作中心</th>'
		          +'<th>人工工作中心</th>'
		          +'<th>调整开始时间</th>'
		          +'<th>调整结束时间</th>'
		          +'<th>加工数量</th>'
		          +'<th>当天运行时间</th></tr>';
	for(var i = 0; i < orderList.length; i ++){
		tempHtml +='<tr><td>'+orderList[i].dispatchingnumber+'</td>'
		         +'<td>'+orderList[i].productionnumber+'</td>'
		         +'<td>'+orderList[i].productordesc+'</td>'
		         +'<td>'+orderList[i].procedurename+'</td>'
		         +'<td>'+orderList[i].line+'</td>'
		         +'<td>'+orderList[i].equipmentname+'</td>'
		         +'<td>'+orderList[i].centername+'</td>'
		         +'<td>'+orderList[i].personcentername+'</td>'
		         +'<td>'+orderList[i].adjuststarttime+'</td>'
		         +'<td>'+orderList[i].adjustendtime+'</td>'
		         +'<td>'+orderList[i].count+'</td>';
		         var dispatchingCapacityList = orderList[i].dispatchingCapacityList;
		         console.info(dispatchingCapacityList)
		         for(var j = 0; j < dispatchingCapacityList.length; j ++){
		        	 tempHtml +='<td>'+dispatchingCapacityList[j].usedcapacity+'</td></tr>';

		         }

		$('#dispatchingorderList').html(tempHtml);
	}
}

//最后点击模态框的平移按钮，完成平移
var moveDispatchingOrder = function ( ) {
	//获取派工单ID
	var checkboxs = $("#table_table :checked");
	var pgdids = [];
	for(var i = 0; i < checkboxs.length; i++) {
		pgdids.push(checkboxs[i].getAttribute('pgdid'));
	}
	var orderid = pgdids[0];
	var movetype = com.leanway.getDataTableCheckIds("movetype");
	var searchCondition = new Object();
	searchCondition.movenumber = $("#movenumber").val();
	searchCondition.movetype = movetype;
	searchCondition.timeunits = $("#moveunits").val();
	searchCondition.orderid = orderid;
	var strCondition = $.trim(JSON.stringify(searchCondition));
	
	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "moveDispatchingOrder",
			"strCondition" : strCondition
		},
		dataType : "json",
		async : false, 
		success : function(text) {

			var flag = com.leanway.checkLogind(text);

			if (flag) {

				if (text.status == "success") {
					$('#moveDataModal').modal("hide");
					search();
				}
				
				//lwalert("tipModal", 1, text.info);
				//search();
			}

		},

	});
}

function search(){
	
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();

	if(starttime==null||starttime==""||endtime==""||endtime==null){
		lwalert("tipModal", 1,"查询日期范围请填写完整！");
		return;
	}else if(starttime>endtime){
		lwalert("tipModal", 1,"开始时间不能大于结束时间！");
		return;
	}
	         var centerid = $("#centerid").val()[0];
	         
	         
	         
			 $("#mask").show();

			$.ajax ( {

				type : "post",
				url : "../../../"+ln_project+"/balanceSheet",
				data : {
					"method" : "queryDispatchingOrderByTime", 
					"starttime":starttime,
					"endtime":endtime,
					"centerid":centerid
						},
				dataType : "json",
				async : true,
				success : function ( data ) {

					var flag =  com.leanway.checkLogind(data);

					if(flag){

						

                        if(data!=null){  //此时tempData.resultMap还是一个map集合【key,value】
                        		viewChart(data);                    
                        	 $("#mask").hide();
                        }else{
                        	$('#bodyBottleneckCondition').html("");
                        	$("#mask").hide();

                        }

					}
				}
			});

}

function DateDiff(sDate1, sDate2){ //sDate1和sDate2是2002-12-18格式
	var aDate, oDate1, oDate2, iDays
	aDate = sDate1.split("-")
	oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) //转换为12-18-2002格式
	aDate = sDate2.split("-")
	oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
	iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 /24) //把相差的毫秒数转换为天数
	return iDays;
	}
//把毫秒数转换为小时   hour
function DateDiff_hour(time){ //sDate1和sDate2是2002-12-18格式
	hours = keepTwoDecimalFull((Math.abs(time) / 1000 / 60 / 60)); //把相差的毫秒数转换为小时
	return hours;
	}
//把毫秒数转换为分  minute
function DateDiff_minute(time){ //sDate1和sDate2是2002-12-18格式
	minutes = keepTwoDecimalFull((Math.abs(time) / 1000 / 60)); //把相差的毫秒数转换为分
	return minutes;
	}
//把秒数转换为分
function DateDifffff(time){ //sDate1和sDate2是2002-12-18格式
	minutes = keepTwoDecimalFull((Math.abs(time) / 60)); //把相差的秒数转换为分
	return minutes;
	}

//判断是否能整除2
 function chk(num){
	  return ( (num%2 ==0) ?"偶数":"奇数");  //判断是否能整除2
	}

//四舍五入保留2位小数（不够位数，则用0替补）
function keepTwoDecimalFull(num) {
		 var result = parseFloat(num);
		 if (isNaN(result)) {
		 alert('传递参数错误，请检查！');
		 return false;
	         }
		 result = Math.round(num * 100) / 100;
		 var s_x = result.toString();
		 var pos_decimal = s_x.indexOf('.');
		 if (pos_decimal < 0) {
		 pos_decimal = s_x.length;
		 s_x += '.';
		     }
		 while (s_x.length <= pos_decimal + 2) {
		 s_x += '0';
		     }
		 return s_x;
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

/**
 * 关联设备
 */
var showEquipment = function ( ) {
    //所有选中的input选择（单选框、复选框）
	
	var checkboxs = $("#table_table :checked");
	var pgdids = [];
	for(var i = 0; i < checkboxs.length; i++) {
		pgdids.push(checkboxs[i].getAttribute('pgdid'));
	}
      console.log(pgdids);
	if ( pgdids == null ) {

	    lwalert("tipModal", 1, "请选择派工单分配设备!");
		return;
	} else if (pgdids.length > 1){

	    lwalert("tipModal", 1, "请选择一条派工单分配设备！");
		return;
	} else {
		// 弹出modal
		$('#equipmentModal').modal({backdrop: 'static', keyboard: true});
        //派工单ID
		  ids = pgdids[0];

		if (equipmentTable == null || equipmentTable == "undefined" || typeof(equipmentTable) == "undefined") {
			equipmentTable = initEquipmentTable(ids);

		} else {
			equipmentTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryEquipment&id=" + ids).load();
		}

	}

}



/**
 * 弹出平移模态框
 * 
 */
var showMoveModal = function ( ) {
    console.log("===================");
	var checkboxs = $("#table_table :checked");
	var pgdids = [];
	for(var i = 0; i < checkboxs.length; i++) {
		pgdids.push(checkboxs[i].getAttribute('pgdid'));
	}
	
	if ( pgdids == null ) {

	    lwalert("tipModal", 1, "请选择派工单进行平移操作!");
		return;
	} else if (pgdids.length > 1){

	    lwalert("tipModal", 1, "请选择一条派工单进行平移操作！");
		return;
	} else {
		
		$('#moveDataModal').modal({backdrop: 'static', keyboard: true});
		
	}
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

/**
 *修改派工单的时间
 * 
 */
var editDispatchingOrder = function ( ) {

	$("#batchstarttime").val("");

	$("#batchTimeModalLabel").html("请选择派工开始时间");
	
	var checkboxs = $("#table_table :checked");
	var pgdids = [];
	for(var i = 0; i < checkboxs.length; i++) {
		pgdids.push(checkboxs[i].getAttribute('pgdid'));
	}  
	if ( pgdids == null ) {

	    lwalert("tipModal", 1, "请选择派工单进行修改!");
		return;
	} else if (pgdids.length >= 1){

	$('#batchTimeModal').modal({backdrop: 'static', keyboard: false});
	initDateTimeYmdHms("batchstarttime");
	
	}
}


/**
 * 
 * 修改派工单的时间
 * 
 */
var updateDispatchingOrder = function ( ) {
	
	// 时间
	var batchStartTime = $("#batchstarttime").val();
	//获取派工单ID
	var checkboxs = $("#table_table :checked");
	
	var orderid = '';
	
	for(var i = 0; i < checkboxs.length; i++) {
		orderid += checkboxs[i].getAttribute('pgdid')+',';
	}
	console.log(orderid);
	
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "saveUpdateDispatchingOrder",
			"batchStartTime" : batchStartTime,
			"orderid" : orderid
			
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){


				if (text.status == "success") {

					$('#batchTimeModal').modal("hide");
					search();
				}else{
					lwalert("tipModal", 1,text.info);
				}
			}
		}
	});
	
	
	
}



/**
 * 保存设备
 */
var saveEquipmentDispatch = function ( ) {

	var orderId = ids;
	var equipmentId =  com.leanway.getDataTableCheckIds("equipmentCheckList")

	if (equipmentId == null || $.trim(equipmentId) == "") {
		 lwalert("tipModal", 1, "请为派工单分配设备台帐!");
		return;
	}
	
	var equipmentname = equipmentTable.rows('.row_selected').data()[0].equipmentname; 
	
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingOrder",
		data : {
			"method" : "saveEquipmentDispatching",
			"orderId" : orderId,
			"equipmentId" : equipmentId,
			"equipmentname" : equipmentname
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

	//		alert(text.info);
			var flag =  com.leanway.checkLogind(text);

			if(flag){

				if (text.status == "success") {
					$('#equipmentModal').modal('hide');
					search();
				}

			}

		}
	});

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