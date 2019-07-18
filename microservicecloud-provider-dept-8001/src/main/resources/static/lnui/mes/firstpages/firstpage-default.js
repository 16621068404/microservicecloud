


$(function() {


	//首页显示
	viewFirstPage();


});

function viewFirstPage(){

	//checkSession();
	/**
	 *
	 * 销售月度订单图表(饼状图)
	 *
	 * */
	loadPlanRealTotalCount();


	/**
	 *
	 * 生产在制品周计划匹配表
	 *
	 * */
//	loadPlanWorkInProcess();

	/**
	 *
	 * 瓶颈设备生产状况表(列表)
	 *
	 * */
//	queryBottleneckEquipmentProduction();

	/**
	 *
	 * 生产月任务完成情况表
	 *
	 * */
	queryProductionTaskCompletion();

	/**
	 *
	 * 生产不良品原因表
	 *
	 * */
//	defectiveProductsReason();

	/**
	 *
	 * 生产设备完好率图表
	 *
	 * */
	productionEquipmentReadiness();


	/**
	 *
	 * 单订单销售图表(甘特图)
	 *
	 * */
	//selectSingleOrderProgressCondition();
	selectloadPlanWorkInProcess();

}


/**
 *
 * 小数转化为百分数
 *
 * */
var toPercent = function(persentCompare){
	return (Math.round(persentCompare * 10000)/100).toFixed(2) + '%';
}


/**
 *
 * 销售月度订单图表
 *
 * */
function loadPlanRealTotalCount(){

	$.ajax ( {

		type : "POST",
		url : "../../../../"+ln_project+"/firstpage",

		data : {
			method : "selectPlanRealTotalCount"
		},

		dataType : "text",

		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);

				//调用fusioncharts方法  对表数据进行赋值
				selectPlanRealTotalCount(tempData);

			}
		}
	});

}

/**
 *
 * 销售订单图表
 *
 * 总计划数量   总完成数量   仍需要完成数量   正在下单数量  未下单数量
 *
 * planCount      realCount       stillCount      isDoing      needDoing
 *
 * @serialData 2016-1-7
 *
 * @author 熊必强
 *
 * */

function selectPlanRealTotalCount(tempData){


	var fun = new FusionCharts({

		type: 'pie3d',
		renderAt: 'chart-containerSalesordercompletion',
		width:changeSize("salesOrderchartid"),
		height:changeHeigth(),
		dataFormat: 'json',


		dataSource: {

			"chart": {
				"caption": "月度销售情况图",
				"subCaption": "当月状况",
				"paletteColors": "#0075c2,#1aaf5d,#f2c500,#f45b00,#8e0000",
				//"bgColor": "#ffffff",
				"showBorder": "0",
				"use3DLighting": "0",
				"showShadow": "0",
				"enableSmartLabels": "1",
				"startingAngle": "0",
				"showPercentValues": "1",
				"showPercentInTooltip": "0",
				"decimals": "1",
				"captionFontSize": "14",
				"subcaptionFontSize": "14",
				"subcaptionFontBold": "0",
				"toolTipColor": "#ffffff",
				"toolTipBorderThickness": "0",
				"toolTipBgColor": "#000000",
				"toolTipBgAlpha": "80",
				"toolTipBorderRadius": "2",
				"toolTipPadding": "5",
				"showHoverEffect":"1",
				"showLegend": "1",
				"legendBgColor": "#ffffff",
				"legendBorderAlpha": '0',
				"legendShadow": '0',
				"legendItemFontSize": '10',
				//"legendItemFontColor": '#2000',  label的有无
				"legendScrollBgColor":"#00ffaa",
				"bordercolor":"#00ffaa",
				"startingAngle": "120",
				"showLabels": "0",
				"enableMultiSlicing": "0",
				"slicingDistance": "15",
				"showPercentValues": "1",
				"showPercentInTooltip": "0",
				"plotTooltext": " $label : $datavalue",
				"theme": "fint",

			},

			"data": [
			         {
			        	 "label": "月度未下计划数",
			        	 "value": tempData.needDoing
			         },
			         {
			        	 "label": "月度在制数",
			        	 "value": tempData.stillCount
			         },
			         {
			        	 "label": "月度已下计划数",
			        	 "value": tempData.isDoing
			         },
			         {
			        	 "label": "月度总交货数量",
			        	 "value": tempData.realCount
			         },
			         ]
		}

	}).render();

}


/**
 *
 * 生产在制品周计划匹配表
 *
 * */
function loadPlanWorkInProcess(){

	$.ajax ( {

		type : "POST",
		url : "../../../../"+ln_project+"/firstpage",

		data : {
			method : "planWorkInProcessInOneMonth"
		},

		dataType : "text",

		success : function ( data ) {


			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);

					var needConnection=tempData.realCount+tempData.isDoing;

					var notNeedConncetion=tempData.notrealCount+tempData.notisDoing;

					//需求销售图 柱状
					selectloadPlanWorkInProcess(tempData);

					//需求相关和不相关关系   饼状图
					selectloadPlanWorkInProcessConnection(needConnection,notNeedConncetion);

					//非需求销售图 柱状
					selectloadNotPlanWorkInProcess(tempData.notrealCount,tempData.notisDoing);
		  }

		}
	});

}

function selectloadPlanWorkInProcess(planWorkInProcess){

//	planWorkInProcess.realCount=70;
//
//	planWorkInProcess.needDoing=10;
//
//	planWorkInProcess.isDoing=20;

	var fun = new FusionCharts({

		type: 'bar3d',
		renderAt: 'chart-containerLoadPlanWorkInProcess',
		width:changeSize("salesOrderchartid"),
		height:changeHeigth(),
		dataFormat: 'json',
		dataSource: {
			"chart": {
				"caption": "需求相关表",
				"subCaption": "当月状况",
				// "xAxisName": "Stores",
				// "yAxisName": "Sales (in USD)",
				// "numberPrefix": "$",
				"alignCaptionWithCanvas": "0",
				"canvasBgAlpha": "0",
				//Theme
				"theme" : "fint"
			},
			"data": [
			         {
			        	 "label": "实际需求未开工数",
//			        	 "value": planWorkInProcess.needDoing
			        	 "value": 5
			         },
			         {
			        	 "label": "实际需求在制数",
//			        	 "value": planWorkInProcess.isDoing
			        	 "value": 15
			         },
			         {
			        	 "label": "实际需求完成数",
//			        	 "value": planWorkInProcess.realCount
			        	 "value": 0
			         }
			         ]
		}
	})
	.render();
}

function selectloadPlanWorkInProcessConnection(needConnection,notNeedConncetion){

	var fun = new FusionCharts({

		type: 'pie3d',
		renderAt: 'chart-containerNeedConnection',
		width:changeSize("salesOrderchartid"),
		height:changeHeigth(),
		dataFormat: 'json',


		dataSource: {

			"chart": {
				"caption": "需求与非需求对比图",
				"subCaption": "当月状况",
				"paletteColors": "#0075c2,#1aaf5d,#f2c500,#f45b00,#8e0000",
				//"bgColor": "#ffffff",
				"showBorder": "0",
				"use3DLighting": "0",
				"showShadow": "0",
				"enableSmartLabels": "1",
				"startingAngle": "0",
				"showPercentValues": "1",
				"showPercentInTooltip": "0",
				"decimals": "1",
				"captionFontSize": "14",
				"subcaptionFontSize": "14",
				"subcaptionFontBold": "0",
				"toolTipColor": "#ffffff",
				"toolTipBorderThickness": "0",
				"toolTipBgColor": "#000000",
				"toolTipBgAlpha": "80",
				"toolTipBorderRadius": "2",
				"toolTipPadding": "5",
				"showHoverEffect":"1",
				"showLegend": "1",
				"legendBgColor": "#ffffff",
				"legendBorderAlpha": '0',
				"legendShadow": '0',
				"legendItemFontSize": '10',
				//"legendItemFontColor": '#2000',  label的有无
				"bgColor": "#ffffff",
				"showBorder": "0",
				"use3DLighting": "0",
				"showShadow": "0",
				"enableSmartLabels": "0",
				"startingAngle": "310",
				"showLabels": "0",
				"showPercentValues": "1",
				"showLegend": "1",
				"legendShadow": "0",
				"legendBorderAlpha": "0",
				"decimals": "0",
				"captionFontSize": "14",
				"subcaptionFontSize": "14",
				"subcaptionFontBold": "0",
				"toolTipColor": "#ffffff",
				"toolTipBorderThickness": "0",
				"toolTipBgColor": "#000000",
				"toolTipBgAlpha": "80",
				"toolTipBorderRadius": "2",
				"toolTipPadding": "5",
			},

			"data": [
			         {
			        	 "label": "需求相关",
			        	 "value": needConnection
			         },
			         {
			        	 "label": "非需求相关",
			        	 "value": notNeedConncetion
			         }
			         ]
		}

	}).render();
}

function selectloadNotPlanWorkInProcess(notrealCount,notisDoing){

	var fun = new FusionCharts({

		type: 'bar3d',
		renderAt: 'chart-containerNeedAndUnNeed',
		width:changeSize("salesOrderchartid"),
		height:changeHeigth(),
		dataFormat: 'json',
		dataSource: {
			"chart": {
				"caption": "非需求相关表",
				"subCaption": "当月状况",
				// "xAxisName": "Stores",
				// "yAxisName": "Sales (in USD)",
				// "numberPrefix": "$",
				"alignCaptionWithCanvas": "0",
				"canvasBgAlpha": "0",
				//Theme
				"theme" : "fint"
			},
			"data": [
			         {
			        	 "label": "实际非需求完成数",
			        	 "value": notrealCount
			         },
			         {
			        	 "label": "非需求在制数",
			        	 "value": notisDoing
			         }
			         ]
		}
	})
	.render();

}


/**
 *
 * 瓶颈设备生产月状况表
 *
 * 返回数据是  优先级  预期完成 				实际完成
 *
 * @return  prioritylevels,expectnumber,completenumber
 *
 * @serialData 2016-1-11
 *
 * @author 熊必强
 *
 * */
function queryBottleneckEquipmentProduction(){

	$.ajax ( {

		type : "POST",
		url : "../../../../"+ln_project+"/firstpage",

		data : {
			method : "queryBottleneckEquipmentProduction",
		},

		dataType : "text",

		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			viewBottleneckEquipmentProduction(data);

			}
		}
	});

}

function viewBottleneckEquipmentProduction(data){

	var tempData = $.parseJSON(data).bottleneckEquipmentProduction;

	var tempHtml = '';
	var viewBarColor="";
	var viewWordColor="";


	/**
	 *
	 * table的拼接
	 *
	 * */
	for(var i = 0; i < tempData.length; i ++){

		var number=tempData[i].number;
		var completenumber=tempData[i].completenumber;

		var a=completenumber/number;
		//小数化为百分数
		var b=a.toFixed(4);

		var persentCompare=toPercent(b);
		//定义优先级所显示的颜色
		if(tempData[i].prioritylevels==0){

			viewBarColor="<div class='progress progress-xs'><div class='progress-bar progress-bar-danger' style='width: "+persentCompare+"'></div>  </div>";
			viewWordColor="<span class='badge bg-red'>"+persentCompare+"</span>";

		}else if(tempData[i].prioritylevels==1){

			viewBarColor="<div class='progress progress-xs'><div class='progress-bar progress-bar-yellow' style=' "+persentCompare+"'></div>  </div>";
			viewWordColor="<span class='badge bg-yellow'>"+persentCompare+"</span>";

		}else if(tempData[i].prioritylevels==2){

			viewBarColor="<div class='progress progress-xs'><div class='progress-bar progress-bar-primary' style=' "+persentCompare+"'></div>  </div>";
			viewWordColor="<span class='badge bg-blue'>"+persentCompare+"</span>";

		}else{

			viewBarColor="<div class='progress progress-xs'><div class='progress-bar progress-bar-success' style=' "+persentCompare+"'></div>  </div>";
			viewWordColor="<span class='badge bg-green'>"+persentCompare+"</span>";
		}

		//显示的数据
		tempHtml += '<tr>'+
		'<td>' +i+ '</td>'+
		'<td>' +tempData[i].equipmentname+'</td>'+
		'<td>' +tempData[i].serialnumber+'</td>'+
		'<td>' +tempData[i].productionnumber+'</td>'+
		'<td>'+viewBarColor+'</td>'+
		'<td>'+viewWordColor+'</td>'+
		'</tr>';
	}
	tempHtml += '</table>'

		$('#bodyBottleneckCondition').html(tempHtml);


}

/**
 *
 * 生产月任务完成情况表
 *
 * */
function queryProductionTaskCompletion(){

//	$.ajax ( {
//
//		type : "POST",
//		url : "../../../../"+ln_project+"/firstpage",
//
//		data : {
//			method : "queryProductionTaskCompletion",
//		},
//
//		dataType : "text",
//
//		success : function ( data ) {
//
//			var flag =  com.leanway.checkLogind(data);
//
//			if(flag){
//
//				var tempData = $.parseJSON(data);

				//调用fusioncharts方法  对表数据进行赋值
//				viewProductionTaskCompletion(tempData.firstPageCondition);
    viewProductionTaskCompletion()

//			}
//
//		}
//	});

}

/**
 *
 * 生产月任务完成情况表
 *
 * 派工单表中计划数和完成数  调整计划  完成数
 *
 * @serialData 2016-1-12
 *
 * @author 熊必强
 *
 * */
function viewProductionTaskCompletion(productionTaskCompletion){

//	var categories = [ ];
//
//	var category  = [ ] ;
//
//	var dataplanCount = [ ];
//	var dataplanCompletment = [ ];
//	var datarealCount = [ ];
//	var datarealComplement = [ ];
//	for(var i=0;i<productionTaskCompletion.length;i++){
//
//		var groupname=productionTaskCompletion[i].groupname;
//		//计划数
//		var planCount=productionTaskCompletion[i].planCount;
//		//计划完成数
//		var planCompletment=productionTaskCompletion[i].planCompletment;
//		//调整计划数
//		var realCount=productionTaskCompletion[i].realCount;
//		//调整完成数
//		var realComplement=productionTaskCompletion[i].realComplement;
//
//		dataplanCount.push({value : planCount});
//		dataplanCompletment.push({value : planCompletment});
//		datarealCount.push({value : realCount});
//		datarealComplement.push({value : realComplement});
//
//		category.push({ label: groupname});
//		categories.push({category:category});
//	}

	var fun = new FusionCharts({
        type: 'stackedColumn3DLine',
        renderAt: 'chart-containerProductionTaskCompletion',
        width:changeSize("salesOrderchartid"),
		height:changeHeigth(),
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "showvalues": "0",
                "caption": "生产月任务完成情况",
                "subcaption": "当月状况",
            //    "numberprefix": "工时(个)",
                "xaxisname": "机加厂",
                "yaxisname": "产品数量(个)",
                "showBorder": "0",
                "paletteColors": "#0075c2,#1aaf5d,#f2c500",
                "bgColor": "#ffffff",
                "canvasBgColor": "#ffffff",
                "captionFontSize": "14",
                "subcaptionFontSize": "14",
                "subcaptionFontBold": "0",
                "divlineColor": "#999999",
                "divLineIsDashed": "1",
                "divLineDashLen": "1",
                "divLineGapLen": "1",
                "toolTipColor": "#ffffff",
                "toolTipBorderThickness": "0",
                "toolTipBgColor": "#000000",
                "toolTipBgAlpha": "80",
                "toolTipBorderRadius": "2",
                "toolTipPadding": "5",
                "legendBgColor": "#ffffff",
                "legendBorderAlpha": '0',
                "legendShadow": '0',
                "legendItemFontSize": '10',
                "legendItemFontColor": '#666666'
            },
//            "categories":categories,
            "categories":[
                          {
                              "category": [
                                  {
                                      "label": "调整计划数"
                                  },
                                  {
                                      "label": "完成数"
                                  },

                              ]
                          }
                      ],
//            "dataset": [
//                {
//                    "seriesname": "计划数",
//                    "data": dataplanCount
//                },
//                {
//                    "seriesname": "完成数",
//                    "data": dataplanCompletment
//                    "data": 30
//                },{
//                    "seriesname": "调整计划数",
//                    "data": datarealCount
//                    "data": 40
//                }
//                ,{
//                    "seriesname": "调整完成数",
//                    "renderas": "Line",
//                    "color":"#ff0000",
//                    "data": datarealComplement
//                }
//            ]
                      "dataset": [
                                  {
                                      "data": [
                                          {
                                              "value": "40"
                                          },
                                          {
                                              "value": "30"
                                          }
                                      ]
                                  },

                              ]
        }

	}).render();

}

/**
 *
 * 生产不良品原因表
 *
 * */
function defectiveProductsReason(){

	$.ajax ( {

		type : "POST",
		url : "../../../../"+ln_project+"/firstpage",

		data : {
			method : "defectiveProductsReason",
		},

		dataType : "text",

		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				//调用fusioncharts方法  对表数据进行赋值
				defectiveProductsReasonCondition(tempData.defectiveProductsReasonCondition);

			}
		}
	});

}

//uptimedata.push({value : uptime,tooltext : "车间名称："+centername +"{br}完好使用总工时："+uptime+"{br}完好率："+persentCompare});
/**
 *
 * 产品追踪表中生产的不良品原因 defectiveProductsReason
 *
 * @return unqualifiedreason
 *
 * @serialData 2016-1-12
 *
 * @author 熊必强
 *
 * */
function defectiveProductsReasonCondition(defectiveProductsReasonCondition){


	/**
	 *
	 * 拼接fusioncharts的关键数据
	 *
	 *
	 * */
	var categories = [ ];

	var dataset=[ ];

	var category  = [ ] ;


	for(var i=0;i<defectiveProductsReasonCondition.length;i++){

		var groupname=defectiveProductsReasonCondition[i].groupname;

		var n=defectiveProductsReasonCondition[i].unqualifiedcount;

		var x=defectiveProductsReasonCondition[i].unqualifiedreason;

		category.push({ label: x});

		var obj = { seriesname:groupname, data: [ { value:n},{ value:n} ]}

		dataset .push(obj);

		categories.push({category:category});
	}


	var fun =new FusionCharts({

		type: 'mscolumn3d',
		renderAt: 'chart-containerDefectiveProductsReason',
		width: changeSize("defectiveProductsReasonChartId"),
		height:changeHeigth(),
		dataFormat: 'json',
		dataSource: {
			"chart": {
				"caption": "不良品原因状况",
				"subcaption": "当月状况",
				"xAxisname": "工作中心组",
				// "yAxisName": "Revenues (In USD)",
				// "numberPrefix": "个",
				"plotFillAlpha" : "80",

				//Cosmetics
				"paletteColors" : "#0075c2,#1aaf5d",
				"baseFontColor" : "#333333",
				"baseFont" : "Helvetica Neue,Arial",
				"captionFontSize" : "14",
				"subcaptionFontSize" : "14",
				"subcaptionFontBold" : "0",
				"showBorder" : "0",
				"bgColor" : "#ffffff",
				"showShadow" : "0",
				"canvasBgColor" : "#ffffff",
				"canvasBorderAlpha" : "0",
				"divlineAlpha" : "100",
				"divlineColor" : "#999999",
				"divlineThickness" : "1",
				"divLineIsDashed" : "1",
				"divLineDashLen" : "1",
				"divLineGapLen" : "1",
				"usePlotGradientColor" : "0",
				"showplotborder" : "0",
				"valueFontColor" : "#ffffff",
				"placeValuesInside" : "1",
				"showHoverEffect" : "1",
				"rotateValues" : "1",
				"showXAxisLine" : "1",
				"xAxisLineThickness" : "1",
				"xAxisLineColor" : "#999999",
				"showAlternateHGridColor" : "0",
				"legendBgAlpha" : "0",
				"legendBorderAlpha" : "0",
				"legendShadow" : "0",
				"legendItemFontSize" : "10",
				"legendItemFontColor" : "#666666"
			},
			"categories":  categories,

			"dataset": dataset,

			"trendlines": [
			               {
			            	   "line": [
			            	            {
			            	            	"startvalue": "12250",
			            	            	"color": "#0075c2",
			            	            	"displayvalue": "Previous{br}Average",
			            	            	"valueOnRight" : "1",
			            	            	"thickness" : "1",
			            	            	"showBelow" : "1",
			            	            	"tooltext" : "Previous year quarterly target  : $13.5K"
			            	            },
			            	            {
			            	            	"startvalue": "25950",
			            	            	"color": "#1aaf5d",
			            	            	"displayvalue": "Current{br}Average",
			            	            	"valueOnRight" : "1",
			            	            	"thickness" : "1",
			            	            	"showBelow" : "1",
			            	            	"tooltext" : "Current year quarterly target  : $23K"
			            	            }
			            	            ]
			               }
			               ]
		}

	}).render();



}

/**
 *
 * 生产设备完好率图表
 *
 * */
function productionEquipmentReadiness(){

//	$.ajax ( {
//
//		type : "POST",
//		url : "../../../../"+ln_project+"/firstpage",
//
//		data : {
//			method : "productionEquipmentReadiness",
//		},
//
//		dataType : "text",
//
//		success : function ( data ) {
//
//			var flag =  com.leanway.checkLogind(data);
//
//			if(flag){
//
//				var tempData = $.parseJSON(data);
//
//				//调用fusioncharts方法  对表数据进行赋值   设备
//				viewProductionEquipmentReadiness(tempData.productionEquipmentReadiness);

				//工作中心组
//				viewWorkCenterGroupReadiness(tempData.productionGroupReadiness);
                viewWorkCenterGroupReadiness();


//			}
//
//		}
//	});

}



/**
 *
 * 生产设备完好率图表
 *
 *  @return 工作中心设备  计划开始结束时间差 作为总工时
 *
 *  @serialData 2016-1-13
 *
 *  @author 熊必强
 *
 * */
function viewProductionEquipmentReadiness(productionEquipmentReadiness){

	var categories = [ ];

	//var dataset=[ ];

	var category  = [ ] ;

	var totalplantimedata=[ ];

	var uptimedata= [ ];

	for(var i=0;i<productionEquipmentReadiness.length;i++){

		var equipmentname=productionEquipmentReadiness[i].equipmentname;

		var totalplantime=productionEquipmentReadiness[i].uptime;

		var uptime=productionEquipmentReadiness[i].runtime;

		var a=uptime/totalplantime;

		//小数化为百分数

		var b=a.toFixed(3);
		var persentCompare= toPercent(b);


		category.push({ label: equipmentname});

		totalplantimedata.push({value : totalplantime});

		//显示的标签
		uptimedata.push({value : uptime,tooltext : "设备名称："+equipmentname +"{br}完好使用总工时："+uptime+"{br}完好率："+persentCompare});

		categories.push({category:category});
	}


	var fun= new FusionCharts({

		type: 'stackedColumn3DLine',
		renderAt: 'chart-containerProductionEquipmentReadiness',
		width:changeSize("salesOrderchartid"),
		height:changeHeigth(),
		dataFormat: 'json',
		dataSource: {
			"chart": {
				"caption": "工作中心完好率表",
				"subCaption": "当月状况   单位(小时)",
				"xAxisname": "设备名称",
				"yAxisName": "工时",
				//"numberPrefix": "小时",
				"numVisiblePlot" : "12",

				//Cosmetics
				"paletteColors" : "#0075c2,#1aaf5d,#f2c500",
				"baseFontColor" : "#333333",
				"baseFont" : "Helvetica Neue,Arial",
				"captionFontSize" : "14",
				"subcaptionFontSize" : "14",
				"subcaptionFontBold" : "0",
				"showBorder" : "0",
				"bgColor" : "#ffffff",
				"showShadow" : "0",
				"canvasBgColor" : "#ffffff",
				"canvasBorderAlpha" : "0",
				"showValues" : "0",
				"divlineAlpha" : "100",
				"divlineColor" : "#999999",
				"divlineThickness" : "1",
				"divLineIsDashed" : "1",
				"divLineDashLen" : "1",
				"divLineGapLen" : "1",
				"usePlotGradientColor" : "0",
				"showplotborder" : "0",
				"showXAxisLine" : "1",
				"xAxisLineThickness" : "1",
				"xAxisLineColor" : "#999999",
				"showAlternateHGridColor" : "0",
				"showAlternateVGridColor" : "0",
				"legendBgAlpha" : "0",
				"legendBorderAlpha" : "0",
				"legendShadow" : "0",
				"legendItemFontSize" : "10",
				"legendItemFontColor" : "#666666",
				"scrollheight" : "10",
				"flatScrollBars" : "1",
				"scrollShowButtons" : "0",
				"scrollColor" : "#cccccc",
				"showHoverEffect" : "1",
			},
			"categories": categories,
			"dataset": [
			            {
			            	"seriesName": "月度总工时",
			            	"data": totalplantimedata
			            },
			            {
			            	"seriesName": "完好使用总工时",
			            	"renderAs": "line",
			            	"showValues": "0",
			            	"data": uptimedata
			            }
			            ]
		}

	}).render();

}

/**
 *
 * 生产设备完好率图表
 *
 *  @return 工作中心  计划开始结束时间差 作为总工时
 *
 *  @serialData 2016-1-13
 *
 *  @author 熊必强
 *
 * */
function viewWorkCenterGroupReadiness(productionWorkCenterGroupReadiness){


//	var categories = [ ];
//
//	//var dataset=[ ];
//
//	var category  = [ ] ;
//
//	var totalplantimedata=[ ];
//
//	var uptimedata= [ ];
//
//	for(var i=0;i<productionWorkCenterGroupReadiness.length;i++){
//
//		var groupname=productionWorkCenterGroupReadiness[i].centername;
//
//		var totalplantime=productionWorkCenterGroupReadiness[i].uptime;
//
//		var uptime=productionWorkCenterGroupReadiness[i].runtime;
//
//		var a=uptime/totalplantime;
//		//小数化为百分数
//		var b=a.toFixed(4);
//
//		var persentCompare= toPercent(b);
//
//		var uptimes=uptime+"   完好率："+persentCompare;
//
//		category.push({ label: groupname});
//
//		totalplantimedata.push({value : totalplantime});
//
//		//uptimedata.push({value : uptime});
//		uptimedata.push({value : uptime,tooltext : "工作中心："+groupname +"{br}完好使用总工时："+uptime+"{br}完好率："+persentCompare});
//		//var obj = { seriesname:groupname, data: data}
//
//		//dataset .push(obj);
//
//		categories.push({category:category});
//	}


//	var fun= new FusionCharts({
//
//		type: 'stackedColumn3DLine',
//		renderAt: 'chart-containerProductionWorkCenterGroupReadiness',
//		width:changeSize("salesOrderchartid"),
//		height:changeHeigth(),
//		dataFormat: 'json',
//		dataSource: {
//			"chart": {
//				"caption": "工作中心组完好率表",
//				"subCaption": "当月状况  单位(小时)",
//				"xAxisname": "工作中心",
//				"yAxisName": "工时",
//				// "numberPrefix": "小时",
//				"numVisiblePlot" : "12",
//
//				//Cosmetics
//				"paletteColors" : "#0075c2,#1aaf5d,#f2c500",
//				"baseFontColor" : "#333333",
//				"baseFont" : "Helvetica Neue,Arial",
//				"captionFontSize" : "14",
//				"subcaptionFontSize" : "14",
//				"subcaptionFontBold" : "0",
//				"showBorder" : "0",
//				"bgColor" : "#ffffff",
//				"showShadow" : "0",
//				"canvasBgColor" : "#ffffff",
//				"canvasBorderAlpha" : "0",
//				"showValues" : "0",
//				"divlineAlpha" : "100",
//				"divlineColor" : "#999999",
//				"divlineThickness" : "1",
//				"divLineIsDashed" : "1",
//				"divLineDashLen" : "1",
//				"divLineGapLen" : "1",
//				"usePlotGradientColor" : "0",
//				"showplotborder" : "0",
//				"showXAxisLine" : "1",
//				"xAxisLineThickness" : "1",
//				"xAxisLineColor" : "#999999",
//				"showAlternateHGridColor" : "0",
//				"showAlternateVGridColor" : "0",
//				"legendBgAlpha" : "0",
//				"legendBorderAlpha" : "0",
//				"legendShadow" : "0",
//				"legendItemFontSize" : "10",
//				"legendItemFontColor" : "#666666",
//				"scrollheight" : "10",
//				"flatScrollBars" : "1",
//				"scrollShowButtons" : "0",
//				"scrollColor" : "#cccccc",
//				"showHoverEffect" : "1",
//			},
//			"categories": categories,
//			"dataset": [
//			            {
//			            	"seriesName": "月度总工时",
//			            	"data": totalplantimedata
//			            },
//			            {
//			            	"seriesName": "完好使用总工时",
//			            	"renderAs": "line",
//			            	"showValues": "0",
//			            	"data": uptimedata
//			            }
//			            ]
//		}
//
//	}).render();
	var fun = new FusionCharts({
        type: 'stackedColumn3DLine',
        renderAt: 'chart-containerProductionWorkCenterGroupReadiness',
        width:changeSize("salesOrderchartid"),
        height:changeHeigth(),
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "showvalues": "0",
                "caption": "工作中心组完好工时",
                "subcaption": "当月状况  单位(小时)",
            //    "numberprefix": "工时(个)",
                "xaxisname": "工作中心组",
                "yaxisname": "工时",
                "showBorder": "0",
                "paletteColors": "#0075c2,#1aaf5d,#f2c500",
                "bgColor": "#ffffff",
                "canvasBgColor": "#ffffff",
                "captionFontSize": "14",
                "subcaptionFontSize": "14",
                "subcaptionFontBold": "0",
                "divlineColor": "#999999",
                "divLineIsDashed": "1",
                "divLineDashLen": "1",
                "divLineGapLen": "1",
                "toolTipColor": "#ffffff",
                "toolTipBorderThickness": "0",
                "toolTipBgColor": "#000000",
                "toolTipBgAlpha": "80",
                "toolTipBorderRadius": "2",
                "toolTipPadding": "5",
                "legendBgColor": "#ffffff",
                "legendBorderAlpha": '0',
                "legendShadow": '0',
                "legendItemFontSize": '10',
                "legendItemFontColor": '#666666'
            },
            "categories":[
                          {
                              "category": [
                                  {
                                      "label": "机加厂"
                                  },
                                  {
                                      "label": "总装厂"
                                  },

                              ]
                          }
                      ],
                      "dataset": [
                                  {
                                      "data": [
                                          {
                                              "value": "48"
                                          },
                                          {
                                              "value": "37"
                                          }
                                      ]
                                  },

                              ]
        }

    }).render();


}

/**
 *
 * 单订单销售额度查询
 *
 *
 * */
/*
function selectSingleOrderProgressCondition(){

	$.ajax ( {

		type : "POST",
		url : "../../../../"+ln_project+"/firstpage",

		data : {
			method : "selectSingleOrderProgressCondition",
		},

		dataType : "text",

		success : function ( data ) {

			var tempData = $.parseJSON(data);

			//调用fusioncharts方法  对表数据进行赋值
			viewSingleOrderProgressCondition(tempData.singleOrderProgressQuery);

		}
	});

}*/


/**
 * 龚勇
 * 原来那个已经注释了
 */
function selectSingleOrderProgressCondition(){

	$.ajax ( {

		type : "POST",
		url : "../../../../"+ln_project+"/firstpage",

		data : {
			method : "selectproductiongantt",
		},

		dataType : "text",

		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				//alert(tempData.starttime);
				//调用fusioncharts方法  对表数据进行赋值
				viewSingleOrderProgressCondition(tempData.productionorder,tempData.ganttlength);

			}
		}
	});

}
/**
 *
 * 单订单查询  根据订单编号查询  订单编号唯一
 *
 * @return 订单计划开始结束时间   订单实际结束开始时间    产品名称
 *
 * @serialData 2016-1-7
 *
 * @author 熊必强
 *
 * */
function viewSingleOrderProgressCondition(tempData,ganttlength){
	//格式化时间
	Date.prototype.Format = function (fmt) { //author: meizz
		var o = {
				"M+": this.getMonth() + 1, //月份
				"d+": this.getDate(), //日
				"h+": this.getHours(), //小时
				"m+": this.getMinutes(), //分
				"s+": this.getSeconds(), //秒
				"q+": Math.floor((this.getMonth() + 3) / 3), //季度
				"S": this.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}


	//名称
	var process=[];
	//开始时间
	var startdate=[];
	//结束时间
	var enddate=[];
	var gantt=[];
	var id=[];
	var connector=[];
	var category=[];
	var categories=[];
	//当前时间
	var currentdate = new Date().Format("yyyy-MM-dd");
	/*alert(currentdate);*/
	//甘特图从第二条到第四条的线
	var j=1;
	var s=2
	//拼甘特图的总长度
	//获取名称
	var start=ganttlength.start;
	var end=ganttlength.end;
	var day=end.substr(5,2);

	//alert("看看对不"+day);
	//alert(category[0].lable+","+categories.category);
	//拼甘特图
	for(var i=0;i<tempData.length;i++){
		//获取数据已经逻辑处理
		var name=tempData[i].productorname;
		var starttime=tempData[i].starttime.substr(0,10);
		var endtime=tempData[i].endtime.substr(0,10);
		var practicalstarttime=tempData[i].practicalstarttime.substr(0,10);
		var practicalendtime=tempData[i].practicalendtime.substr(0,10);
		var adjuststarttime=tempData[i].adjuststarttime.substr(0,10);
		var adjustendtime=tempData[i].adjustendtime.substr(0,10);
		//判当前时间大约断调整后时间，将，甘特图设置成黑色
		if(currentdate>adjustendtime){

			/*alert(starttime+"++"+endtime+"++=="+practicalstarttime+"++=="+practicalendtime);*/
			process.push({label:name,id:'"'+j+'"'});
			startdate.push({label: starttime});
			enddate.push({label: endtime});
			gantt.push({
				processid:'"' +j+'"',
				start:starttime,
				end:endtime,
				id:'"'+j+'-'+j+'"',
				color: "#008ee4",
				height: "32%",
				toppadding: "12%",
				"font-size": "30px"
			},{
				processid:'"' +j+'"',
				start:adjuststarttime,
				end:adjustendtime,
				id:'"'+j+'"',
				"color": "#6baa01",
				"toppadding": "56%",
				"height": "32%"
			},{
				processid:'"' +j+'"',
				start:practicalstarttime,
				end:currentdate,
				id:'"'+j+'-'+s+'"',
				"color": "#e44a00",
				"toppadding": "56%",
				"height": "32%"
			},{
				processid:'"' +j+'"',
				start:adjustendtime,
				end:currentdate,
				id:'"'+j+'-'+s+'"',
				"color": "black",
				"toppadding": "56%",
				"height": "32%"
			});
			/*alert("对");*/
			var discoun=
				adjuststarttime=adjuststarttime.substr(8,2);
			/*alert("对"+adjuststarttime);*/
		}else{
			//拼接甘特图
			/*alert(starttime+"++"+endtime+"++=="+practicalstarttime+"++=="+practicalendtime);*/
			process.push({label:name,id:'"'+j+'"'});
			startdate.push({label: starttime});
			enddate.push({label: endtime});
			gantt.push({
				processid:'"' +j+'"',
				start:starttime,
				end:endtime,
				id:'"'+j+'-'+j+'"',
				color: "#008ee4",
				height: "32%",
				toppadding: "12%",
				"font-size": "30px"
			},{
				processid:'"' +j+'"',
				start:adjuststarttime,
				end:adjustendtime,
				id:'"'+j+'"',
				"color": "#6baa01",
				"toppadding": "56%",
				"height": "32%"
			},{
				processid:'"' +j+'"',
				start:practicalstarttime,
				end:currentdate,
				id:'"'+j+'-'+s+'"',
				"color": "#e44a00",
				"toppadding": "56%",
				"height": "32%"
			});
		}

		j++;
	}
	connector.push({
		"fromtaskid": "1",
		"totaskid": "1-2",
		"color": "#e44a00",
		"thickness": "2",
		"fromtaskconnectstart_": "1"
	});

	var fun = new FusionCharts({
		type: 'gantt',
		renderAt: 'chart-containerViewSingleOrderProgressCondition',
		width:changeSize("singleOrderProgressChartsId"),
		height: changeHeigth(),
		dataFormat: 'json',
		dataSource:{
			"chart": {
				"caption": "订单生产进度",
				"dateformat": "yyyy-mm-dd",
				"outputdateformat": "yy mns ddds",
				"ganttwidthpercent": "60",
				"ganttPaneDuration": "40",
				"ganttPaneDurationUnit": "d",
				"plottooltext": "$processName",
				"legendBorderAlpha": "0",
				"legendShadow": "0",
				"usePlotGradientColor": "0",
				"showCanvasBorder": "0",
				"flatScrollBars": "2",
				"gridbordercolor": "#333333",
				"gridborderalpha": "20",
				"slackFillColor": "#e44a00",
				"taskBarFillMix": "light+0"
			},
			"categories": [
			               {
			            	   "bgcolor": "#999999",
			            	   "category": [
			            	                {
			            	                	"start": start,
			            	                	"end": end,
			            	                	"label":day+"月销售订单完成状况甘特图",/*
	    	                            "align": "middle",*/
			            	                	"fontcolor": "#FFFFFF ",
			            	                	"fontsize": "18"
			            	                }
			            	                ]
			               }
			               ],
			               "processes": {
			            	   "headertext": "产品{br}名称",
			            	   "fontcolor": "#000000",
			            	   "fontsize": "11",
			            	   "isanimated": "1",
			            	   "bgcolor": "#6baa01",
			            	   "headervalign": "bottom",
			            	   "headeralign": "left",
			            	   "headerbgcolor": "#999999",
			            	   "headerfontcolor": "#ffffff",
			            	   "headerfontsize": "12",
			            	   "align": "left",
			            	   "isbold": "1",
			            	   "bgalpha": "25",
			            	   "process": process,
			               },
			               "datatable": {
			            	   "showprocessname": "1",
			            	   "namealign": "left",
			            	   "fontcolor": "#000000",
			            	   "fontsize": "10",
			            	   "valign": "right",
			            	   "align": "center",
			            	   "headervalign": "bottom",
			            	   "headeralign": "center",
			            	   "headerbgcolor": "#999999",
			            	   "headerfontcolor": "#ffffff",
			            	   "headerfontsize": "12",
			            	   "datacolumn": [
			            	                  {
			            	                	  "bgcolor": "#eeeeee",
			            	                	  "headertext": "开始{br}时间",
			            	                	  "text": startdate
			            	                  },
			            	                  {
			            	                	  "bgcolor": "#eeeeee",
			            	                	  "headertext": "结束{br}时间",
			            	                	  "text": enddate
			            	                  }
			            	                  ]
			               },
			               "tasks": {
			            	   "task":gantt,
			               },
			               "connectors": [
			                              {
			                            	  "connector":connector
			                              }
			                              ],
			                              "milestones": {
			                            	  "milestone": [
			                            	                {
			                            	                	"date": "2/6/2014",
			                            	                	"taskid": "12",
			                            	                	"color": "#f8bd19",
			                            	                	"shape": "star",
			                            	                	"tooltext": "Completion of Phase 1"
			                            	                }
			                            	                ]
			                              },
			                              "legend": {
			                            	  "item":  [
			                            	            {
			                            	            	"label": "计划",
			                            	            	"color": "#008ee4"
			                            	            		// "color": "blue"
			                            	            },
			                            	            {
			                            	            	"label": "确认",
			                            	            	"color": "#6baa01"
			                            	            		//  "color": "green"
			                            	            },
			                            	            {
			                            	            	"label": "完成",
			                            	            	// "color": "red"
			                            	            	"color": "#e44a00"
			                            	            },
			                            	            {
			                            	            	"label": "逾期",
			                            	            	"color": "black"
			                            	            		//"color": "#e44a00"
			                            	            }
			                            	            ]

			                              },
			                              "trendlines": [
			                                             {
			                                            	 "line": [
			                                            	          {
			                                            	        	  "start": "19/6/2014",
			                                            	        	  "displayvalue": "AC Testing",
			                                            	        	  "color": "333333",
			                                            	        	  "thickness": "2",
			                                            	        	  "dashed": "1"
			                                            	          }
			                                            	          ]
			                                             }
			                                             ]
		}
	})
	.render();
}

var width;
function changeSize(id) {

	width=$("#"+id).width()*(9/10)


	return width;
}

function workInBussinessSize(id) {

	if($(window).width()<768){
		width=$("#"+id).width()*(3/4)
	}else{
		width=$("#"+id).width()*(1/3)
	}

	return width;
}
function changeHeigth() {


	return width*(3/4);
}

function equipchangeSize(id){
	if($(window).width()<768){
		width=$("#"+id).width()*(1/2)
	}else{
		width=$("#"+id).width()*(1/3)
	}
}

