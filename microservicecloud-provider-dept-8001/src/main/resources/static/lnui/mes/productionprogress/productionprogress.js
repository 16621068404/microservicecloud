

$(function() {

	//时间控件
	loadProductorcategoryid();
	//校验
	initBootstrapValidator();
	com.leanway.loadTags();
	searchBottleneckCondition();

	setInterval(searchBottleneckCondition,2000*60);
});


//加载产品类别
function loadProductorcategoryid(){
	$.ajax ( {
		type : "get",
		url : "../../../../"+ln_project+"/productors?method=loadProductorcategoryid",
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			    var json = eval("(" + data + ")")

				var productorcategoryid = json.data;
			    var html="<option value=''>请选择产品分类</option>";

				for (var i = 0;i<productorcategoryid.length;i++) {
					/**
					 * option 的拼接
					 * */
					html +="<option value="+ productorcategoryid[i].productorcategoryid+">"+ productorcategoryid[i].categoryname+"</option>";
				}
				$("#productorcategoryid").html(html);
			}
		}
	});
}
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
	var productorcategoryid= $("#productorcategoryid").val();
	$("#bottleneckConditionForm").data('bootstrapValidator').validate();

	if($('#bottleneckConditionForm').data('bootstrapValidator').isValid()){

		//var productionorderid= $("#productionorderid").val();
		var startTime= $("#startTime").val();
		var endTime= $("#endTime").val();

		if(startTime>endTime){

			lwalert("tipModal",1 , "开始时间不能大于结束时间！");

		}
		else{

			$.ajax ( {

				type : "post",
				url : "../../../../"+ln_project+"/productionProgress",

				data : {
					"method" : "queryProductionProgress",
					"productorcategoryid" : productorcategoryid
				},
				dataType : "text",
				async : false,
				success : function ( data ) {

					var flag =  com.leanway.checkLogind(data);

					if(flag){

						var tempData = $.parseJSON(data);

                        if(tempData.list!=null){
                        	viewBottleneckEquipmentCodition(tempData.list);
                        }else{
                        	$('#bodyBottleneckCondition').html("");
                        }

					}
				}
			});
		}
	}

}

function viewBottleneckEquipmentCodition(tempData){
	var tempHtml = '';


	for(var i = 0; i < tempData.length; i ++){

		var keyProcessList =tempData[i][0].keyProcessList;
		if(tempData[i]!=null){
			for(var j = 0; j < tempData[i].length; j ++){
				if(j==0){
					tempHtml += '<tr>'+
					'<th style="text-align:center;">合同简码</th>'+
					'<th style="text-align:center;">产品</th>'+
					'<th style="text-align:center;">图号</th>';
					if(keyProcessList!=null){
						for(var m = 0;m<keyProcessList.length;m++){
							tempHtml +='<th style="text-align:center;">' +keyProcessList[m].keyprocessname+'</th>';
						}

					}
				}

				tempHtml += '</tr>';

				var productionchildsearchno = tempData[i][j].productionchildsearchno;
				var productorname = tempData[i][j].productorname;
				var mainprocedureList = tempData[i][j].mainprocedureList;
				var drawcode = tempData[i][j].drawcode;
				tempHtml += '<tr>'+
				'<td align="center">' +productionchildsearchno+ '</td>'+
				'<td align="center">' +productorname+'</td>'+
				'<td align="center">' +drawcode+'</td>';
				if(mainprocedureList!=null){

					for(var m = 0;m<keyProcessList.length;m++){
						var html = "";
						for(var k = 0; k < mainprocedureList.length; k ++){

							    html = "";
								var viewBarColor="";
								var display="";

								if(mainprocedureList[k].keyprocessname==keyProcessList[m].keyprocessname){
									if(mainprocedureList[k].status==0){
										viewBarColor ="bgcolor='#ccc'"
										display="未派工";
									}
									if(mainprocedureList[k].status==1){
										viewBarColor ="bgcolor='#d0dc86'"
											display="未开工";
									}
									if(mainprocedureList[k].status==2){
										viewBarColor ="bgcolor='#52dc91'"
											display="在制";
									}
									if(mainprocedureList[k].status==3){
										viewBarColor ="bgcolor='#b0d5de'"
											display="完工";
									}
									html ='<td align="center"'+viewBarColor+'>' +display+'</td>';
									tempHtml+=html;
									break;
								}

						}
						if(html==""){

							tempHtml+='<td></td>';
						}
					}


				}
				tempHtml +='</tr>';

			}
		}


	}


		$('#bodyBottleneckCondition').html(tempHtml);


}

