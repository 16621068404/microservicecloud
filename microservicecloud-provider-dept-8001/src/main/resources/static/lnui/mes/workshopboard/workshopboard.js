

$(function() {

	//校验
	initBootstrapValidator();
	com.leanway.loadTags();
	searchBottleneckCondition();
	initDateTimeYmdHms("currentdate");
		
});

/**
 * 
 * 校验数据
 * 
 * */
//校验
function initBootstrapValidator() {
	$('#bottleneckConditionForm').bootstrapValidator({
		excluded: [':disabled'],
		fields: {
			productionorderid: {
				validators: {
					notEmpty: {},
				}
			},startTime: {
				validators: {
					notEmpty: {},
				}
			},endtime: {
				validators: {
					notEmpty: {},
				}
			}
		}
	});

}

/**
 * 
 * 瓶颈设备生产状况表
 * 
 * */
function searchBottleneckCondition(){

	var currentdate = $("#currentdate").val();
			$.ajax ( {
				
				type : "post",
//				url : "../../workshopBoard",
				url : "../../../../"+ln_project+"/workshopBoard",
				data : {
					"method" : "queryTaskProgress",	
					"currentdate":currentdate
				},
				dataType : "text",
				async : false,
				success : function ( data ) {
					
					var flag =  com.leanway.checkLogind(data);
					
					if(flag){
					
						var tempData = $.parseJSON(data);

						if(tempData.status == "success"){
							if(tempData.list.length>0){
	                        	viewBottleneckEquipmentCodition(tempData.list);
	                        }else{
	                        	$('#bodyBottleneckCondition').html("");
	                        	lwalert("tipModal", 1, "无相关数据，请重新填写查询条件！");
	                        }
						}else{
							lwalert("tipModal", 1, tempData.info);
						}
                        
						
					}
				}
			});		

}

function viewBottleneckEquipmentCodition(tempData){

	var tempHtml = '';
	
	
	for(var i = 0; i < tempData.length; i ++){		
		var equipmentList =tempData[i].equipmentList;
		
		if(tempData[i]!=null){
			//alert(equipmentList.length)
			for(var j = 0; j < equipmentList.length; j ++){
				//alert(j)
				if(j==0){

					tempHtml += '<tr>'+
					'<td align="center" bgcolor="#999999">' +equipmentList[0].groupname+ '</td>'+ 
					'</tr>';
					tempHtml += '<tr>'+
					'<th style="text-align:center;width:50px" bgcolor="#cccccc">设备台账编码</th>'+ 
					'<th style="text-align:center;width:50px" bgcolor="#cccccc">计划进度</th>'+
					'<th style="text-align:center;width:50px" bgcolor="#cccccc">非计划产能比</th>'+
					'<th style="text-align:center;border-right-color:#333333;width:50px" bgcolor="#cccccc">时间进度</th>'+
					'<th style="text-align:center;width:50px" bgcolor="#cccccc">设备台账编码</th>'+ 
					'<th style="text-align:center;width:50px" bgcolor="#cccccc">计划进度</th>'+
					'<th style="text-align:center;width:50px" bgcolor="#cccccc">非计划产能比</th>'+
					'<th style="text-align:center;width:50px" bgcolor="#cccccc">时间进度</th>';
					tempHtml += '</tr>';				
				}
				
				
				
				var equipmentnum = equipmentList[j].equipmentnum;
				var planprogress = equipmentList[j].planprogress;
				var unplanprogress = equipmentList[j].unplanprogress;
				var timeprogress = equipmentList[j].timeprogress;
				//var b=planprogress.toFixed(4);
				var planprogressCompare=(planprogress*100).toFixed(2)+"%";               		
				var unplanprogressCompare=(unplanprogress*100).toFixed(2)+"%";
				var planprogressCompare2;
				var unplanprogressCompare2;
				
				
				if(((planprogress*100).toFixed(2))>100){
					 planprogressCompare2 = "100%";
				}else{
					 planprogressCompare2 = planprogressCompare;
				}
				if(((unplanprogress*100).toFixed(2))>100){
					unplanprogressCompare2 = "100%";
				}else{
					unplanprogressCompare2 = unplanprogressCompare;
				}
				
				if(timeprogress+0.25>unplanprogress+planprogress){

					viewWordColor="<div class='progress'><div class='progress-bar progress-bar-danger progress-bar-striped' role='progressbar' aria-valuenow='"+(planprogress*100).toFixed(2)+"' aria-valuemin='0' aria-valuemax='500' style='width:"+planprogressCompare2+";'><font color='black'>"+planprogressCompare+"</font> </div></div>"
					viewWordColor2="<div class='progress'><div class='progress-bar progress-bar-danger progress-bar-striped' role='progressbar' aria-valuenow='"+(unplanprogress*100).toFixed(2)+"' aria-valuemin='0' aria-valuemax='500' style='width:"+unplanprogressCompare2+";'><font color='black'>"+unplanprogressCompare+"</font></div></div>"
				}else{
					
					viewWordColor="<div class='progress'><div class='progress-bar progress-bar-success progress-bar-striped' role='progressbar' aria-valuenow='"+(planprogress*100).toFixed(2)+"' aria-valuemin='0' aria-valuemax='500' style='width:"+planprogressCompare2+";'><font color='black'>"+planprogressCompare+"</font> </div></div>"
					viewWordColor2="<div class='progress'><div class='progress-bar progress-bar-success progress-bar-striped' role='progressbar' aria-valuenow='"+(unplanprogress*100).toFixed(2)+"' aria-valuemin='0' aria-valuemax='500' style='width:"+unplanprogressCompare2+";'><font color='black'>"+unplanprogressCompare+"</font></div></div>"
				}		
				
				var timeprogressCompare=(timeprogress*100).toFixed(2)+"%";
				var timeprogressCompare2;
				if(((timeprogress*100).toFixed(2))>100){
					timeprogressCompare2 = "100%";
				}else{
					timeprogressCompare2 = timeprogressCompare;
				}

				viewWordColor3="<div class='progress'><div class='progress-bar progress-bar-success progress-bar-striped' role='progressbar' aria-valuenow='"+(timeprogress*100).toFixed(2)+"' aria-valuemin='0' aria-valuemax='500' style='width:"+timeprogressCompare2+";'><font color='black'>"+timeprogressCompare+"</font></div></div>"
				if(j%2==0){
					
					tempHtml += '<tr>'+
					'<td align="center" bgcolor="#cccccc">' +equipmentnum+ '</td>'+ 
					'<td align="center" bgcolor="#cccccc">' +viewWordColor+ '</td>'+ 
					'<td align="center" bgcolor="#cccccc">' +viewWordColor2+'</td>'+
					'<td align="center" bgcolor="#cccccc" style="border-right-color:#333333;">' +viewWordColor3+'</td>';
										
			   }
				if(j%2==1){
				
				   //tempHtml += '<td bgcolor="#b0d5de"></td>'+
				   tempHtml +='<td align="center" bgcolor="#cccccc">' +equipmentnum+ '</td>'+
					'<td align="center" bgcolor="#cccccc">' +viewWordColor+ '</td>'+ 
					'<td align="center" bgcolor="#cccccc">' +viewWordColor2+'</td>'+
					'<td align="center" style="border-right-color:#52dc91;" bgcolor="#cccccc">' +viewWordColor3+'</td>';
				   tempHtml +='</tr>';
					
					}			  			     
			   }								
			}
		}
		$('#bodyBottleneckCondition').html(tempHtml);

		//marque(370,19,"icefable1C","box1leftC")
}

