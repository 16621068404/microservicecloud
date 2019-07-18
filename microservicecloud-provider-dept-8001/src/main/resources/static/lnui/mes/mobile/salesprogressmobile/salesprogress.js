
var clicktime = new Date();

var oTable;
var procedureTable;
$(function() {

	//初始化表格
	oTable = initTable();
	queryProducts();
});



function queryProducts() {

	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var starttime = year+"-"+month+"-01";
	var endtime = year+"-"+month+1+"-01";

	if(starttime==""||starttime==null||endtime==""||endtime==null){
		lwalert("tipModal", 1, "生产订单日期区间请填写完整！");
		return;
		}

	if(starttime>endtime){
		lwalert("tipModal", 1, "开始时间不能大于结束时间！");
		return;
	}
	//根据选定的生产订单日期区间查询该时间范围内有派工单的产品
	oTable.ajax.url("../../../../"+ln_project+"/salesprogress?method=queryProducts&starttime="+starttime+"&endtime="+endtime).load();

}

//初始化产品数据表格
var initTable = function() {
	var table = $('#standerProcedureDataTable')
			.DataTable(
					{
						"ajax" : "../../../../"+ln_project+"/salesprogress?method=queryProducts",
						//"iDisplayLength" : "10",
						'bPaginate' : true,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"bAutoWidth": true,  //宽度自适应
						"bProcessing" : true,
						"bServerSide" : true,
						'searchDelay' : "5000",
						"columns" : [ {
							"data" : "productionorderid"
						}, {
							"data" : "productorname"
						}, {
							"data" : "productionsearchno"
						}, {
							"data" : "productionchildsearchno"
						}, {
							"data" : "number"
						}],
						"aoColumns" : [
								{
									"mDataProp" : "productionorderid",
									 "fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
	                                        $(nTd).html(
	                                                "<input class='regular-checkbox' type='checkbox' id='" + sData
	                                                        + "' name='checkList' value='" + sData
	                                                        + "'><label for='" + sData
	                                                        + "'></label>");
	                                    }
								}, {
									"mDataProp" : "productorname",
								}, {
									"mDataProp" : "productionsearchno"
								}, {
									"mDataProp" : "productionchildsearchno"
								}, {
									"mDataProp" : "number"
								}
						],

						"oLanguage" : {
				        	 "sUrl" : "../../../../jslib/datatables/zh-CN.txt"
				         },
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {
							com.leanway.getDataTableFirstRowId("standerProcedureDataTable",queryProcedureByProductDay);
					     	com.leanway.setDataTableColumnHide("standerProcedureDataTable");

					        // 点击dataTable触发事件
                            com.leanway.dataTableClick("standerProcedureDataTable", "checkList", false,
                                    oTable, queryProcedureByProductDay);
						}

					});

	return table;
}


/**
 * 根据生产订单id查询相应的工序信息
 */
function queryProcedureByProductDay(productionorderid) {


	//alert(productionorderid)
    	if(productionorderid==null||productionorderid==""||productionorderid=='undefined'){
    		var productionorderid = '';
    		// 拼接选中的checkbox
    		$("input[name='checkList']:checked").each(function(i, o) {
    			productionorderid += $(this).val();
    		});
    	}
	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/salesprogress",
		data : {
			method : "queryTimeByOrder",
			"productionorderid": productionorderid
		},
		dataType : "json",
        success : function(data) {

        	console.info(data.weekList)
        //拼接甘特图
        getDayGantt(data.listdis,data.time,data.num);
        //	getMonthGantt(data.listdis,data.time,data.num,data.weekList);
		},
		error : function(data) {

		}
	});

}

/**
 * 根据生产订单id查询相应的工序信息
 */
function queryProcedureByProductMonth() {

	var str = '';

	$("input[name='checkList']:checked").each(function(i, o) {
		str += $(this).val();
	});
	//alert(ids)
	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/salesprogress",
		data : {
			method : "queryTimeByOrder",
			"productionorderid": str
		},
		dataType : "json",
        success : function(data) {

        	console.info(data.weekList)
        //拼接甘特图
        //getDayGantt(data.listdis,data.time,data.num);
        getMonthGantt(data.listdis,data.time,data.num,data.weekList);
		},
		error : function(data) {

		}
	});

}

function getDayGantt(listdis,time,num){


	$("#myModalLabel").html("工序完成进度");
	$('#myModal').modal({backdrop: 'static', keyboard: false});
    var process=[];
	var start=[];
	var end = [];
	var month=[];
	var gantt=[];
	var startdate=[];
	var enddate=[];
	var connectors=[];
	var pProductor=[];
	var specification=[];
	var shortname=[];
	var currentdate = new Date().Format("yyyy-MM-dd hh:mm:ss");
	var newdatestart=new Date(time.minstarttime.replace(/-/g,"/"));
	var newdateend=new Date(time.maxendtime.replace(/-/g,"/"));
	var startdates2=newdatestart;
	startdates2.setHours(00);
	startdates2.setMinutes(00);
	startdates2.setSeconds(00);

	var enddates2=newdateend;

	enddates2.setHours(24);
	enddates2.setMinutes(00);
	enddates2.setSeconds(00);
	startdates2=startdates2.Format('yyyy-MM-dd hh:mm:ss');
	enddates2=enddates2.Format('yyyy-MM-dd hh:mm:ss');

	var start=startdates2;
	var end=enddates2;
	console.info(num)
	console.info("==="+startdates2)
	console.info("==="+enddates2)

	for(var i=0;i<=num;i++){

		var startdates=new Date(time.minstarttime.replace(/-/g,"/"));
		var enddates=new Date(time.maxendtime.replace(/-/g,"/"));
		//多个月
		//第一个月开始时间为最小开始时间，结束时间为月末
		if(num>0&&i==0){

			startdates.setHours(00);
			startdates.setMinutes(00);
			startdates.setSeconds(00);
            //enddates =new Date(time.maxendtime.replace(/-/g,"/"));
			//enddates.setMonth(startdates.getMonth());
			enddates.setDate(startdates.getDate());
			enddates.setHours(24);
			enddates.setMinutes(00);
			enddates.setSeconds(00);
			//enddates.setDate(setDateValue(enddates));
		//最后一个月开始时间为1号，结束时间为最大时间
		}else if(num>0&&i==num){

			startdates=new Date(time.minstarttime.replace(/-/g,"/"));
			//startdates.setMonth(startdates.getMonth()+i);
			startdates.setDate(startdates.getDate()+i);
			startdates.setHours(00);
			startdates.setMinutes(00);
			startdates.setSeconds(00);
			enddates=new Date(time.maxendtime.replace(/-/g,"/"));
			enddates.setHours(24);
			enddates.setMinutes(00);
			enddates.setSeconds(00);
		//中间月份开始时间为1号，结束根据月份取最大值
		}else if(num>0&&i>0&&i<num){
			startdates=new Date(time.minstarttime.replace(/-/g,"/"));
			//startdates.setMonth(startdates.getMonth()+i);
			startdates.setDate(startdates.getDate()+i);
			startdates.setHours(00);
			startdates.setMinutes(00);
			startdates.setSeconds(00);
			enddates=new Date(time.minstarttime.replace(/-/g,"/"));
			//enddates.setMonth(enddates.getMonth()+i);
			enddates.setDate(enddates.getDate()+i);
			enddates.setHours(24);
			enddates.setMinutes(00);
			enddates.setSeconds(00);
		}
		startdates=startdates.Format('yyyy-MM-dd hh:mm:ss');
		enddates=enddates.Format('yyyy-MM-dd hh:mm:ss');
		console.info(startdates);
		console.info(enddates);
		month.push({
			"start":startdates,
			"end":enddates,
			"label": startdates.substr(0,10)+"日"
		});
	}

	//循环显示派工单
	if(listdis!=null){
		for(var i=0;i<listdis.length;i++){

			console.info(i+listdis[i].starttime.substr(0,19));
			console.info(i+listdis[i].endtime.substr(0,19));


			            var endtime=listdis[i].endtime.substr(0,19);
							   process.push({
										"label": listdis[i].procedurename,
										"id": '"' +i+'"',
									});
							    pProductor.push({label: listdis[i].pProductor});
								specification.push({label: listdis[i].specification});
								shortname.push({label: listdis[i].shortname});
								gantt.push({
									"label": "计划",
									"processid": '"' +i+'"',
									"start": listdis[i].starttime.substr(0,19),
									"end": endtime,
									"id": '"'+i+'-1"',
									"color": "#FFFF00",
									"height": "25%",
									"toppadding": "12%",
									"font-size": "30px"
								});
						var practicalstarttime='';
						var practicalendtime='';
						var practicalstarttimes=listdis[i].practicalstarttime;/*.substr(0,10);*/
						var practicalendtimes=listdis[i].practicalendtime;/*.substr(0,10);*/

						//判断实际开始和实际结束时间是否存在
						if(practicalstarttimes!=null){
							practicalstarttime=practicalstarttimes.substr(0,19);
						}
						if(practicalendtimes!=null){
							practicalendtime=practicalendtimes.substr(0,19);
						}
						//若实际开始时间不为空，拼接实际时间甘特图
						 if(listdis[i].practicalstarttime!=null){
							 //若实际结束时间为空,结束时间为当前时间
							 if(listdis[i].practicalendtime==null){
								 //practicalendtime = currentdate;
								 //如果当前时间大于计划结束时间
								 if(currentdate>endtime){

													gantt.push({
													"label": "滞后(在制)",
													"processid": '"' +i+'"',
													"start": practicalstarttime,
													"end": currentdate,
													"id": '"' +i+'"',
													"color": "#e44a00",
													"height": "25%",
													"toppadding": "56%",
													"font-size": "30px"

												});
				                 //当前时间小于计划结束时间
								 }else{

										gantt.push({
										"label": "在制",
										"processid": '"' +i+'"',
										"start": practicalstarttime,
										"end": currentdate,
										"id":'"' +i+'"',
										"color": "#6baa01",
										"height": "25%",
										"toppadding": "56%",
										"font-size": "30px"

									});

								 }

							 //若实际结束时间不为空，比较实际结束时间与计划结束时间
							 }else{
								 //实际结束时间大于计划结束时间
								 if(practicalendtime>listdis[i].endtime){

												gantt.push({
												"label": "滞后",
												"processid": '"' +i+'"',
												"start": practicalstarttime,
												"end": practicalendtime,
												"id": '"' +i+'"',
												"color": "#e44a00",
												"height": "25%",
												"toppadding": "56%",
												"font-size": "30px"
											});
//								 //实际结束时间小于计划结束时间
								 }else{

										gantt.push({
										    "label": "完成",
											"processid": '"' +i+'"',
											"start": practicalstarttime,
											"end": practicalendtime,
											"id": '"'+i+'"',
											"color": "#008ee4",
											"height": "25%",
											"toppadding": "56%",
											"font-size": "30px"

										});

								 }
							 }
						 }
				  	}

					}



	FusionCharts.ready(function () {
	    var cnstrctnPlan = new FusionCharts({
	        type: 'gantt',
	        renderAt: 'chart-container',
	        width: changeWidth("myModal"),
	        height: changeHeight(),
	        dataFormat: 'json',
	        dataSource: {
	            "chart": {
	                "caption": "工序完成进度甘特图",
	                "subcaption": "计划/实际",
	                "dateformat": "yyyy-mm-dd HH:mn:ss",
					"outputdateformat": "yyyy-mm-dd hh:mn:ss",
	                "ganttwidthpercent": "70",
	                "ganttPaneDuration": "24",
	                "ganttPaneDurationUnit": "h",
	                "plottooltext": "$processName{br}$label{br}  开始时间 $start{br} 结束时间 $end",
	                "legendBorderAlpha": "0",
	                "legendShadow": "0",
	                "usePlotGradientColor": "0",
	                "showCanvasBorder": "1",
	                "flatScrollBars": "1",
	                "gridbordercolor": "#333333",
	                "gridborderalpha": "20",
	                "slackFillColor": "#e44a00",
	                "taskBarFillMix": "light+0"
	            },
	            "categories": [
	                {
	                    "bgcolor": "#999999",
	                    "align": "middle",
	                    "fontcolor": "#ffffff",
	                    "fontsize": "12",
	                    "category": [
		            	                {
		            	                	"start": start,
		            	                	"end": end,
		            	                	"label":"工序完成进度",
		            	                	"align": "middle",
		            	                	"fontcolor": "#FFFFFF ",
		            	                	"fontsize": "18"
		            	                }
		            	                ]
	                },
	                {
	                    "bgcolor": "#999999",
	                    "align": "middle",
	                    "fontcolor": "#ffffff",
	                    "fontsize": "12",
	                    "category":month
	                },
	            ],
	            "processes": {
	                "headertext": "工序{br}名称",
	                "fontcolor": "#000000",
	                "fontsize": "11",
	                "isanimated": "1",
	                "bgcolor": "#6baa01",
	                "headervalign": "bottom",
	                "headeralign": "center",
	                "headerbgcolor": "#999999",
	                "headerfontcolor": "#ffffff",
	                "headerfontsize": "12",
	                "align": "left",
	                "isbold": "1",
	                "bgalpha": "25",
	                "process":process
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
	       	                        "headertext": "组件{br}名称",
	       	                        "text":shortname
	       	                    },{
	       	                        "bgcolor": "#eeeeee",
	       	                        "headertext": "母件{br}名称",
	       	                        "text":pProductor
	       	                    },
	       	                    {
	       	                        "bgcolor": "#eeeeee",
	       	                        "headertext": "母件{br}规格",
	       	                        "text": specification
	       	                    }
	       	                ]
	            },

	            "tasks": {
	            	   "task":gantt,
	               },
	            "connectors":connectors,

	            "milestones": {
	                "milestone": [
	                    /*{
	                        "date": "21/8/2008",
	                        "taskid": "10",
	                        "color": "#f8bd19",
	                        "shape": "star",
	                        "tooltext": "New estimated moving date"
	                    }*/
	                ]
	            },
	            "legend": {
	                "item": [
 	                    {
	                        "label": "计划",
	                        "color": "#FFFF00"
	                    },
	                    {
	                        "label": "在制",
	                        "color": "#6baa01"
	                    },
	                    {
	                        "label": "完成",
	                        "color": "#008ee4"
	                    },
	                    {
	                        "label": "滞后",
	                        "color": "#e44a00"
	                    }
	                ]
	            }
	        }
	    })
	    .render();
	});
}

 //根据月份确定当月最大天数
 function setDateValue(date){
	var month=date.getMonth()+1;
	var year = date.getFullYear();
	var day=30;
	 if(month=='1'||month=='3'||month=='5'||month=='7'||month=='8'||month=='10'||month=='12'){
		 day=31;
	 }else if(month=='4'||month=='6'||month=='9'||month=='11'){
		 day=30;
	 }else if(month=='2'&&year%4==0){
		 day=29;
	 }else{
		 day=28;
	 }

	 return day;
 }
 var width;
 function changeWidth(id) {

 		width=$("#"+id).width()*(4/7)

 	return width;
 }

 function changeHeight() {

		return width*(4/5);
	}

//导出excel文件
 function exportExcelFunc() {

 	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();

	if(starttime==""||starttime==null||endtime==""||endtime==null){
		lwalert("tipModal", 1, "生产订单日期区间请填写完整！");
		return;
		}
 	window.location.href = "../../../"+ln_project+"/salesprogress?method=dowloadExcel&starttime="+starttime+"&endtime="+endtime;


 }

 function getMonthGantt(listdis,time,num,weeklist){


		$("#myModalLabel").html("工序完成进度");
		$('#myModal').modal({backdrop: 'static', keyboard: false});
	    var process=[];
		var start=[];
		var end = [];
		var month=[];
		var gantt=[];
		var startdate=[];
		var enddate=[];
		var connectors=[];
		var pProductor=[];
		var specification=[];
		var shortname=[];
		var currentdate = new Date().Format("yyyy-MM-dd hh:mm:ss");
		var newdatestart=new Date(time.minstarttime.replace(/-/g,"/"));
		var newdateend=new Date(time.maxendtime.replace(/-/g,"/"));
		var startdates2=newdatestart;
		startdates2.setHours(00);
		startdates2.setMinutes(00);
		startdates2.setSeconds(00);

		var enddates2=newdateend;

		enddates2.setHours(24);
		enddates2.setMinutes(00);
		enddates2.setSeconds(00);
		startdates2=startdates2.Format('yyyy-MM-dd hh:mm:ss');
		enddates2=enddates2.Format('yyyy-MM-dd hh:mm:ss');

		var start=startdates2;
		var end=enddates2;
		console.info(num)
		console.info("==="+startdates2)
		console.info("==="+enddates2)
		if(weeklist!=null){
			for(var i=0;i<weeklist.length;i++){
				console.info(weeklist[0]+i)
				var startdates=new Date(weeklist[i].starttime.replace(/-/g,"/"));
				startdates.setHours(00);
				startdates.setMinutes(00);
				startdates.setSeconds(00);

				var enddates=new Date(weeklist[i].endtime.replace(/-/g,"/"));
				enddates.setHours(23);
				enddates.setMinutes(59);
				enddates.setSeconds(59);


				startdates=startdates.Format('yyyy-MM-dd hh:mm:ss');
				enddates=enddates.Format('yyyy-MM-dd hh:mm:ss');
				console.info(startdates);
				console.info(enddates);
				month.push({
					"start":startdates,
					"end":enddates,
					"label": startdates.substr(0,10)+"日--"+enddates.substr(6,5)+"日"
				});
			}
     }

		//循环显示派工单
		if(listdis!=null){
			for(var i=0;i<listdis.length;i++){

				console.info(i+listdis[i].starttime.substr(0,19));
				console.info(i+listdis[i].endtime.substr(0,19));


				            var endtime=listdis[i].endtime.substr(0,19);
								   process.push({
											"label": listdis[i].procedurename,
											"id": '"' +i+'"',
										});
								    pProductor.push({label: listdis[i].pProductor});
									specification.push({label: listdis[i].specification});
									shortname.push({label: listdis[i].shortname});
									gantt.push({
										"label": "计划",
										"processid": '"' +i+'"',
										"start": listdis[i].starttime.substr(0,19),
										"end": endtime,
										"id": '"'+i+'-1"',
										"color": "#FFFF00",
										"height": "25%",
										"toppadding": "12%",
										"font-size": "30px"
									});
							var practicalstarttime='';
							var practicalendtime='';
							var practicalstarttimes=listdis[i].practicalstarttime;/*.substr(0,10);*/
							var practicalendtimes=listdis[i].practicalendtime;/*.substr(0,10);*/

							//判断实际开始和实际结束时间是否存在
							if(practicalstarttimes!=null){
								practicalstarttime=practicalstarttimes.substr(0,19);
							}
							if(practicalendtimes!=null){
								practicalendtime=practicalendtimes.substr(0,19);
							}
							//若实际开始时间不为空，拼接实际时间甘特图
							 if(listdis[i].practicalstarttime!=null){
								 //若实际结束时间为空,结束时间为当前时间
								 if(listdis[i].practicalendtime==null){
									 //practicalendtime = currentdate;
									 //如果当前时间大于计划结束时间
									 if(currentdate>endtime){

														gantt.push({
														"label": "滞后(在制)",
														"processid": '"' +i+'"',
														"start": practicalstarttime,
														"end": currentdate,
														"id": '"' +i+'"',
														"color": "#e44a00",
														"height": "25%",
														"toppadding": "56%",
														"font-size": "30px"

													});
					                 //当前时间小于计划结束时间
									 }else{

											gantt.push({
											"label": "在制",
											"processid": '"' +i+'"',
											"start": practicalstarttime,
											"end": currentdate,
											"id":'"' +i+'"',
											"color": "#6baa01",
											"height": "25%",
											"toppadding": "56%",
											"font-size": "30px"

										});

									 }

								 //若实际结束时间不为空，比较实际结束时间与计划结束时间
								 }else{
									 //实际结束时间大于计划结束时间
									 if(practicalendtime>listdis[i].endtime){

													gantt.push({
													"label": "滞后",
													"processid": '"' +i+'"',
													"start": practicalstarttime,
													"end": practicalendtime,
													"id": '"' +i+'"',
													"color": "#e44a00",
													"height": "25%",
													"toppadding": "56%",
													"font-size": "30px"
												});
//									 //实际结束时间小于计划结束时间
									 }else{

											gantt.push({
											    "label": "完成",
												"processid": '"' +i+'"',
												"start": practicalstarttime,
												"end": practicalendtime,
												"id": '"'+i+'"',
												"color": "#008ee4",
												"height": "25%",
												"toppadding": "56%",
												"font-size": "30px"

											});

									 }
								 }
							 }
					  	}

						}



		FusionCharts.ready(function () {
		    var cnstrctnPlan = new FusionCharts({
		        type: 'gantt',
		        renderAt: 'chart-container',
		        width: changeWidth("myModal"),
		        height: changeHeight(),
		        dataFormat: 'json',
		        dataSource: {
		            "chart": {
		                "caption": "工序完成进度甘特图",
		                "subcaption": "计划/实际",
		                "dateformat": "yyyy-mm-dd HH:mm:ss",
						"outputdateformat": "yyyy-mm-dd",
		                "ganttwidthpercent": "70",
		                "ganttPaneDuration": "7",
		                "ganttPaneDurationUnit": "d",
		                "plottooltext": "$processName{br}$label{br}  开始时间 $start{br} 结束时间 $end",
		                "legendBorderAlpha": "0",
		                "legendShadow": "0",
		                "usePlotGradientColor": "0",
		                "showCanvasBorder": "1",
		                "flatScrollBars": "1",
		                "gridbordercolor": "#333333",
		                "gridborderalpha": "20",
		                "slackFillColor": "#e44a00",
		                "taskBarFillMix": "light+0"
		            },
		            "categories": [
		                {
		                    "bgcolor": "#999999",
		                    "align": "middle",
		                    "fontcolor": "#ffffff",
		                    "fontsize": "12",
		                    "category": [
			            	                {
			            	                	"start": start,
			            	                	"end": end,
			            	                	"label":"工序完成进度",
			            	                	"align": "middle",
			            	                	"fontcolor": "#FFFFFF ",
			            	                	"fontsize": "18"
			            	                }
			            	                ]
		                },
		                {
		                    "bgcolor": "#999999",
		                    "align": "middle",
		                    "fontcolor": "#ffffff",
		                    "fontsize": "12",
		                    "category":month
		                },
		            ],
		            "processes": {
		                "headertext": "工序{br}名称",
		                "fontcolor": "#000000",
		                "fontsize": "11",
		                "isanimated": "1",
		                "bgcolor": "#6baa01",
		                "headervalign": "bottom",
		                "headeralign": "center",
		                "headerbgcolor": "#999999",
		                "headerfontcolor": "#ffffff",
		                "headerfontsize": "12",
		                "align": "left",
		                "isbold": "1",
		                "bgalpha": "25",
		                "process":process
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
		       	                        "headertext": "组件{br}名称",
		       	                        "text":shortname
		       	                    },{
		       	                        "bgcolor": "#eeeeee",
		       	                        "headertext": "母件{br}名称",
		       	                        "text":pProductor
		       	                    },
		       	                    {
		       	                        "bgcolor": "#eeeeee",
		       	                        "headertext": "母件{br}规格",
		       	                        "text": specification
		       	                    }
		       	                ]
		            },

		            "tasks": {
		            	   "task":gantt,
		               },
		            "connectors":connectors,

		            "milestones": {
		                "milestone": [
		                    /*{
		                        "date": "21/8/2008",
		                        "taskid": "10",
		                        "color": "#f8bd19",
		                        "shape": "star",
		                        "tooltext": "New estimated moving date"
		                    }*/
		                ]
		            },
		            "legend": {
		                "item": [
	 	                    {
		                        "label": "计划",
		                        "color": "#FFFF00"
		                    },
		                    {
		                        "label": "在制",
		                        "color": "#6baa01"
		                    },
		                    {
		                        "label": "完成",
		                        "color": "#008ee4"
		                    },
		                    {
		                        "label": "滞后",
		                        "color": "#e44a00"
		                    }
		                ]
		            }
		        }
		    })
		    .render();
		});
	}