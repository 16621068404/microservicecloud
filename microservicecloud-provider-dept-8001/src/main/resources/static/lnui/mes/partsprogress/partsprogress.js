

$(function() {

	com.leanway.loadTags();
	com.leanway.initSelect2("#productionchildsearchno",
			"../../../"+ln_project+"/partsProgress?method=querySearchno", "搜索生产子查询号");
	searchBottleneckCondition();
	setInterval(searchBottleneckCondition,2000*60);
	//queryAllProtype();

	initSelect2("#productortypeid",
			"../../../"+ln_project+"/producttype?method=queryProtypeBySelect", "搜索产品类型");

});

function searchBottleneckCondition(){

		var productionchildsearchno = $("#productionchildsearchno").find("option:selected").val();

		var productortypeid = $('#productortypeid').val();
		var ids = "";
		if(productortypeid!=null){
			for(var i = 0; i < productortypeid.length;i++){
				ids += productortypeid[i] + ",";
			}
		}
        showMask();
		$.ajax ( {

			type : "post",
			url : "../../../"+ln_project+"/partsProgress",
			data : {
				"method" : "queryPartsProgress",
				"productionchildsearchno":productionchildsearchno,
				"productortypeid":ids,
					},
			dataType : "text",
			async : true,
			success : function ( data ) {

				var flag =  com.leanway.checkLogind(data);

				if(flag){

					var tempData = $.parseJSON(data);

                    if(tempData.partsProgressList!=null){
                    	viewChart(tempData.partsProgressList);
                    }else{
                    	$('#bodyBottleneckCondition').html("");
                    }

				}
			}
		});

}

function viewChart(tempData){
	var tempHtml = '';


	for(var i = 0; i < tempData.length; i ++){
		var orderList =tempData[i].orderList;

		if(orderList!=null){
			//alert(equipmentList.length)
			for(var j = 0; j < orderList.length; j ++){
				//alert(j)
				if(j==0){

					tempHtml += '<tr>'+
					'<td align="center" bgcolor="#999999">' +orderList[0].productionchildsearchno+ '</td>'+
					'</tr>';
					tempHtml += '<tr>'+
					'<th style="text-align:center;width:50px" bgcolor="#cccccc">产品名称</th>'+
					'<th style="text-align:center;width:50px" bgcolor="#cccccc">工序名称</th>'+
					'<th style="text-align:center;width:50px" bgcolor="#cccccc">零件进度</th>'+
					'<th style="text-align:center;width:50px" bgcolor="#cccccc">计划数</th>'+
					'<th style="text-align:center;width:50px" bgcolor="#cccccc">收料数</th>'+
					'<th style="text-align:center;width:50px" bgcolor="#cccccc">下达数</th>'+
					'<th style="text-align:center;width:50px" bgcolor="#cccccc">完工数</th>'+
					'<th style="text-align:center;width:50px" bgcolor="#cccccc">在制数</th>'+
					'<th style="text-align:center;width:50px" bgcolor="#cccccc">合格数</th>'+
					'<th style="text-align:center;width:50px" bgcolor="#cccccc">不合格数</th>';
					tempHtml += '</tr>';
				}

				var procedureList = orderList[j].procudureList;

				if(procedureList!=null){

					for(var k = 0; k < procedureList.length; k ++){

						var productorname = orderList[j].shortname;
						var shortname = procedureList[k].shortname;
						var number = procedureList[k].number;
						var count = procedureList[k].count;
						var qualifiedcount = procedureList[k].qualifiedcount;
						var unqualifiedcount = procedureList[k].unqualifiedcount;
                        var receiptcount = procedureList[k].receiptcount ? procedureList[k].receiptcount : 0;
						var finishcount = procedureList[k].finishcount;
                        var inbusinesscount = procedureList[k].inbusinesscount;

						var progresspercent=(procedureList[k].progresspercent*100).toFixed(2)+"%";

						var planprogressCompare2;


						if(((procedureList[k].progresspercent*100).toFixed(2))>100){
							 planprogressCompare2 = "100%";
						}else{
							 planprogressCompare2 = progresspercent;
						}
						viewWordColor="<div class='progress'><div class='progress-bar progress-bar-success progress-bar-striped' role='progressbar' aria-valuenow='"+progresspercent+"' aria-valuemin='0' aria-valuemax='500' style='width:"+planprogressCompare2+";'><font color='black'>"+progresspercent+"</font></div></div>"

							//rowspan="'+procedureList.length+'"
							tempHtml += '<tr>';
							if(k==0){
								tempHtml +='<td align="center" bgcolor="#cccccc" rowspan="'+procedureList.length+'" align="center" valign="middle" >' +productorname+ '</td>';
							}

							tempHtml +='<td align="center" bgcolor="#cccccc">' +shortname+ '</td>'+
							'<td align="center" bgcolor="#cccccc">' +viewWordColor+'</td>'+
							'<td align="center" bgcolor="#cccccc"><b>' +number+'</td></b>'+
                            '<td align="center" bgcolor="#cccccc"><b>' +receiptcount+'</td></b>'+
							'<td align="center" bgcolor="#cccccc"><b>' +count+'</td></b>'+
							'<td align="center" bgcolor="#cccccc"><b>' +finishcount+'</b></td>'+
							'<td align="center" bgcolor="#cccccc"><b>' +inbusinesscount+'</b></td>'+
							'<td align="center" bgcolor="#cccccc"><b>' +qualifiedcount+'</b></td>'+
							'<td align="center" bgcolor="#cccccc"><font color="red"><b>' +unqualifiedcount+'</b></font></td>';
						}
					}



			   }
			}
		}
		$('#bodyBottleneckCondition').html(tempHtml);
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


//加载所有的产品种类
  function queryAllProtype(){
  	$.ajax ( {
  		type : "get",
  		url : "../../../"+ln_project+"/productors?method=findAllProtype",
  		dataType : "text",
  		async : false,
  		success : function ( data ) {

  			var flag =  com.leanway.checkLogind(data);

  			if(flag){

  			    var json = eval("(" + data + ")")

  				var protype = json.productorTypes;
  				var html="<option value=''>==请选择==</option>";

  				for (var i = 0;i<protype.length;i++) {
  					/**
  					 * option 的拼接
  					 * */
  					html +="<option value="+ protype[i].productortypeid+">"+protype[i].productortypemask + "</option>";
  				}
  				$("#productortypeid").html(html);
  			}
  		}
  	});
  }

  /**
   * id: 为要操作的对象 url: url text: 要在select中显示的文本
   */
  function initSelect2(id, url, text) {

  	$(id).select2({
  		placeholder : text,
  		allowClear: true,
  		language : "zh-CN",
  		multiple: true,
  		ajax : {
  			url : url,
  			dataType : 'json',
  			delay : 250,
  			data : function(params) {
  				return {
  					q : params.term, // search term
  					page : params.page,
  					//pageSize : 200
  				};
  			},
  			processResults : function(data, params) {

  				var flag =  com.leanway.checkLogind(data);

  				if(flag){

  					params.page = params.page || 1;
  					return {
  						results : data.items,
  						pagination : {
  							more : (params.page * 30) < data.total_count
  						}

  				}
  				};
  			},
  			cache : false
  		},
  		escapeMarkup : function(markup) {
  			return markup;
  		},
  		minimumInputLength : 1,
  	});
  }