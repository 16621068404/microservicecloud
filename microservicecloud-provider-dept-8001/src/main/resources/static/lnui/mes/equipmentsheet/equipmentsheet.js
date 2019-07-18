var dispatchingTable;
$(function() {

	com.leanway.loadTags();

	initTimePickYmd("starttime");
	initTimePickYmd("endtime");
	dispatchingTable = initDispatchingOrder()
	 document.getElementById("content").style.width=$(window).width();
	 document.getElementById("dcontent").style.width=$(window).width();

});



function queryDispatchingorder(ids){

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


var initDispatchingOrder = function ( ) {
	
	var table = $('#dispatchingOrderTable').DataTable( {
		"ajax": "../../../../"+ln_project+"/dispatchingOrder?method=queryDispatchingOrderByOrderids" ,
		'bPaginate': false,
		"bDestory": true,
		"bRetrieve": true,
		"bFilter":false,
		"bSort": false,
		"bProcessing": true,
		"bServerSide": true,
		"bInfo" : true,
		"aoColumns": [


            {"mDataProp" : "dispatchingnumber"},
            {"mDataProp" : "productordesc"},
            {"mDataProp" : "procedureshortname"},
            {"mDataProp" : "groupshortname"},
            {"mDataProp" : "equipmentname"},
        
            {"mDataProp": "count"},
            {"mDataProp": "surplusnumber"},
            {"mDataProp": "adjuststarttime"},
            {"mDataProp": "adjustendtime"},
            {"mDataProp": "practicalstarttime"},
            {"mDataProp": "practicalendtime"},
                           
          
            ],
		              "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
		           
		              },
		              "oLanguage" : {
		            	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		              },
		              "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		              "fnDrawCallback" : function(data) {
		            	   
		              }

	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );

	return table;
	
}
function queryDispatchingOrder(orderids){
	console.info(orderids);
	dispatchingTable.ajax.url("../../../../"+ln_project+"/dispatchingOrder?method=queryDispatchingOrderByOrderids&orderids=" + orderids).load();
	
	$('#dispatchingModal').modal({backdrop: 'static', keyboard: true});
}
function searchBottleneckCondition(){

			var starttime = $("#starttime").val();
			var endtime = $("#endtime").val();

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
				url : "../../../"+ln_project+"/productionGroupReport",
				data : {
					"method" : "queryEquipmentSheet",
					"starttime":starttime,
					"endtime":endtime,
						},
				dataType : "text",
				async : true,
				success : function ( data ) {

					var flag =  com.leanway.checkLogind(data);

					if(flag){

						var tempData = $.parseJSON(data);

                        if(tempData!=null){

                    		viewChart(tempData);
                        	
                    		$("table tr td").dblclick(function(){
                            	var val = $(this).attr("id")
                            	if(val!=""&&val!=null){
                                    queryDispatchingOrder(val)
                            	}

                            });

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

function viewChart(tempData){

	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	var days = DateDiff(starttime,endtime);
	var now = new Date(starttime.replace(/-/,"/"));
	var tempHtml = '<tr><th width="130px">产线/日期</th>';
	for(var m = 0;m<=days;m++){
		tempHtml +='<th width="130px">'+now.Format("yyyy-MM-dd")+'</th>';

		now.setDate(now.getDate()+1);
	}
	tempHtml +='</tr>';
	$('#bodyBottleneckCondition').html(tempHtml);
	tempHtml2 = "";
	for(var i = 0; i < tempData.length; i ++){

		var bgcolor="";

		tempHtml2 +='<tr><th width="130px">'+tempData[i].equipmentname+'</th>';

		var dailyList =tempData[i].timeList;
		for(var j = 0; j < dailyList.length; j ++){
			tempHtml2 +='<td width="130px" id='+dailyList[j].orderids+'>计划数量:'+dailyList[j].count+'<br>'
			         +'剩余数量:'+dailyList[j].surplusnumber+'<br>'
			         +'完工数量:'+(parseFloat(dailyList[j].count) - parseFloat(dailyList[j].surplusnumber))+'<br>'
			         +'</td>'
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

  
