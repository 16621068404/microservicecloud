

$(function(){
	$("#minChartTime").val("");
	$("#maxChartTime").val("");
	initTimePickYmd("minChartTime");
	initTimePickYmd("maxChartTime");
	//表单只读
	com.leanway.formReadOnly("sellgantt");
	com.leanway.loadTags();

	//时间不可选
	document.getElementById('minChartTime').disabled=true;
	document.getElementById('maxChartTime').disabled=true;
	document.getElementById('selectbusiness').disabled=false;
	com.leanway.initSelect2("#selectbusiness", "../../../../"+ln_project+"/business?method=queryCompanionBySelect2&contracttype=0", "搜索客户");



	//加载客户
//	inquirysellbills();
});

/**
 * 龚勇
 * 甘特图下拉框选择数据
 */



/**
 * 根据时间合作伙伴
 */
/*function inquirysellbills(){
	var starttime=$("#minChartTime").val();
	var endtime=$("#maxChartTime").val();
	$.ajax({
		type:"post",
		url: "../../../../"+ln_project+"/salesordergantt",
		data:{
			method:"findbusinessbill",
			"starttime":starttime,
			"endtime":endtime
		},
		datatype:"text",
		async:false,
		success:function (data){
			var flag =  com.leanway.checkLogind(data);

			if(flag){

			    var json = eval("(" + data+ ")");

				var deviceCalendars = json.buiness;
				var html="";
				html+="<option>--请选择客户--</option>";
				for (var i = 0;i<deviceCalendars.length;i++) {
					html+="<option id="+i+" value="+deviceCalendars[i].companionid+">"+deviceCalendars[i].companioname+"</option>";
				}
				$("#selectbusiness").html(html);
			}
		},
		error : function(data) {
		}

	});
}*/

function changeBegin(){
	//根据销售订单查询行，显示产品名称。编码。数量
	salesorderdetail();

	document.getElementById('sellbill').disabled=false;
}
//查询销售订单
function salesorderdetail(){
	var companionid=$("#selectbusiness").val();
	$.ajax({
		type:"post",
		url:"../../../../"+ln_project+"/salesordergantt?method=findsalesorderdetail",
		data:{
			"companionid":companionid,
		},
		dateType:"text",
		async:false,
		success:function(data){

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			    var json = eval("(" + data + ")")

				var deviceCalendars = json.salesorder;
				var html="";
				html+="<option>--请选择销售订单--</option>";
				for (var i = 0;i<deviceCalendars.length;i++) {
					html+="<option id="+i+" value="+deviceCalendars[i].salesorderid+">"+deviceCalendars[i].code+"</option>";
				}
				$("#sellbill").html(html);
			}
		}
	});
}

function  closeDetils(){

	//document.getElementById('detail').disabled=true;
	document.getElementById('minChartTime').disabled=false;
	document.getElementById('maxChartTime').disabled=false;
	document.getElementById('minChartTime').readOnly=false;
	document.getElementById('maxChartTime').readOnly=false;

}


function searchValue(){
	document.getElementById('gantetud').disabled=false;

}

//选择销售订单是触发的事件(查询销售单明细)
function onbuil(){

	document.getElementById('detail').disabled=false;

	var salesorderid=$("#sellbill").val();
	$.ajax({
		type:"post",
		url:"../../../../"+ln_project+"/salesordergantt?method=findselldetail",
		data:{
			"salesorderid":salesorderid
		},
		dataType:"text",
		async:false,
		success:function(data){

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			    var json = eval("(" + data + ")")

				var deviceCalendars = json.detail;
				var html="";
				html+="<option>--请选择销售订单--</option>";
				for (var i = 0;i<deviceCalendars.length;i++) {
					html+="<option id="+i+" value="+deviceCalendars[i].salesorderdetailid+">"+deviceCalendars[i].shortname+"-"+deviceCalendars[i].productorname+"-"+deviceCalendars[i].number+"</option>";
				}
				$("#detail").html(html);
			}
		}
	});
}
//选择明细触发的事件
function details(){

	//document.getElementById('sellbill').disabled=true;
	document.getElementById('productionsearchno').disabled=false;
	document.getElementById('maxChartTime').disabled=false;
	document.getElementById('minChartTime').disabled=false;

	var salesorderdetailid=$("#detail").val();

	$.ajax({
		type:"post",
		url:"../../../../"+ln_project+"/salesordergantt?method=findproductionsearchno",
		data:{
			"salesorderdetailid":salesorderdetailid
		},
		dataType:"text",
		async:false,
		success:function(data){

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			    var json = eval("(" + data + ")")

				var deviceCalendars = json.inquirymark;
				var html="";
				html+="<option>--请选择销售订单--</option>";
				for (var i = 0;i<deviceCalendars.length;i++) {
					html+="<option id="+i+" value="+deviceCalendars[i].productionsearchno+">"+deviceCalendars[i].productionsearchno+"</option>";
				}
				$("#productionsearchno").html(html);
			}
		}
	});
}

//格式化form数据
var formatFormJson = function(formData) {
	var reg = /,$/gi;
	var data = "{";
	for (var i = 0; i < formData.length; i++) {
		data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
	}
	data = data.replace(reg, "");
	data += "}";
	return data;
}



/**
 * 获取销售单号，查询数据，显示甘特图
 */
/*function gantetu() {
	var productionsearchno=$("#inquirymark").val();
	var code="SOH20160100010";
	var form  = $("#sellgantt").serializeArray();
	var formData = formatFormJson(form);
	"formData":formData,
	$.ajax({
		type:"post",
		url: "../../salesordergantt",
		data:{
			method:"codeproductiongantt",
			"productionsearchno":productionsearchno
		},
		datatype:"text",
		async:false,
		success:function (data){
			var tempData = $.parseJSON(data);
			if(tempData.size==0){
				alert("次销售单本月无安排生产计划");

			}else{
				viewSingleOrderProgressCondition(tempData.productionorder,tempData.ganttlength);

			}
		}
	});
}*/
function gantetu() {
	var form  = $("#sellgantt").serializeArray();
	var productionsearchno = $("#productionsearchno").val();
	var formData = formatFormJson(form);
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/salesordergantt",
		data : {
			method : "codeproductiongantt",
			"formData":formData,
			"productionsearchno":productionsearchno
		},
		datatype : "text",
		async : false,
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			    var tempData = $.parseJSON(data);

				if (tempData.size == 0) {
					lwalert("tipModal", 1, "次销售单本月无安排生产计划！");
				} else {
					viewSingleOrderProgressCondition(tempData.productionorder,tempData.ganttlength);
				}
			}
		}
	});
}


/**
 * 龚勇
 * 甘特图数据
 */
/*function selectSingleOrderProgressCondition(){
	var productionsearchno=$("#inquirymark").val();
	$.ajax ( {
		type : "POST",
		url : "../../salesordergantt",

		data : {
			method : "selectproductiongantt",
			"productionsearchno":productionsearchno
		},

		dataType : "text",
		async : false,

		success : function ( data ) {

			var tempData = $.parseJSON(data);
			//alert(tempData.starttime);
			//调用fusioncharts方法  对表数据进行赋值
			viewSingleOrderProgressCondition(tempData.productionorder,tempData.ganttlength);
		}
	});

}
function inquirysellbill() {
	var code=$("#sellbill").val();
	var code="SOH20160100010";
	if(code==null || code==""){
		alert("请选择销售单号");
		return;
	}else{
		$.ajax({
			type:"post",
			url: "../..lesordergantt",
			data:{
				method:"codeproductiongantt",
				"code":code
			},
			datatype:"text",
			async:false,
			success:function (data){
				var tempData = $.parseJSON(data);
				if(tempData.size==0){
					alert("次销售单本月无安排生产计划");

				}else{
					viewSingleOrderProgressCondition(tempData.productionorder,tempData.ganttlength);

						alert();
				}
			}
		});
	}

}*/
//计算月差
function getMonths(date1 , date2){
	//用-分成数组
	date1 = date1.split("-");
	date2 = date2.split("-");
	//获取年,月数
	var year1 = parseInt(date1[0]) ,
	month1 = parseInt(date1[1]) ,
	year2 = parseInt(date2[0]) ,
	month2 = parseInt(date2[1]) ,
	//通过年,月差计算月份差
	months = (year2 - year1) * 12 + (month2-month1) + 1;
	return months;
}
function   DateAdd(interval,number,date) {
	var dateValue=date;
	switch(interval)
	{
	case   "y "   :   {
		date.setFullYear(date.getFullYear()+number);
		return   date;
		break;
	}
	case   "q "   :   {
		date.setMonth(date.getMonth()+number*3);
		return   date;
		break;
	}
	case   "m "   :   {
		dateValue.setMonth(date.getMonth()+number);
		return   dateValue;
		break;
	}
	case   "w "   :   {
		date.setDate(date.getDate()+number*7);
		return   date;
		break;
	}
	case   "d "   :   {
		date.setDate(date.getDate()+number);
		return   date;
		break;
	}
	case   "h "   :   {
		date.setHours(date.getHours()+number);
		return   date;
		break;
	}
	case   "m "   :   {
		date.setMinutes(date.getMinutes()+number);
		return   date;
		break;
	}
	case   "s "   :   {
		date.setSeconds(date.getSeconds()+number);
		return   date;
		break;
	}
	default   :   {
		date.setDate(d.getDate()+number);
		return   date;
		break;
	}
	}
}
//格式化时间
Date.prototype.format = function(format)
{
	var o =
	{
			"M+" : this.getMonth()+1, //month
			"d+" : this.getDate(),    //day
			"h+" : this.getHours(),   //hour
			"m+" : this.getMinutes(), //minute
			"s+" : this.getSeconds(), //second
			"q+" : Math.floor((this.getMonth()+3)/3),  //quarter
			"S" : this.getMilliseconds() //millisecond
	}
	if(/(y+)/.test(format))
		format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("("+ k +")").test(format))
			format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
	return format;
}


/**
 *
 * 单订单查询  根据订单编号查询  订单编号唯一
 *
 * @return 订单计划开始结束时间   订单实际结束开始时间    产品名称
 *
 * @serialData 2016-1-7
 *
 * @author 龚勇
 *
 * */
var viewSingleOrderProgressCondition=function(tempData,ganttlength){
	//获取合作伙伴名称
	var business=$("#selectbusiness").find("option:selected").text();
	//获取明细
	var mingxi=$("#detail").find("option:selected").text();

	//获取表头信息  上海连恩智能科技（变压器-CG/2016/088）合同201602088生产执行情况图表
	var businessmingxi="";
	businessmingxi+=business+"("+mingxi+")"+"合同";
	if (tempData==null) {
		businessmingxi+="*******";
	}else{
		businessmingxi+=tempData[0].contractno;
	}
	businessmingxi+="生产执行情况图表";



	//alert("甘特图");
	//名称
	var process=[];
	//开始时间
//	var startdate="["+$('#minChartTime').val()+"]";
	var startdate=[];
	//结束时间
//	var enddate="["+$('#maxChartTime').val()+"]";
	var enddate=[];
	var gantt=[];
	var id=[];
	var connector=[];
	var category=[];
	var categories=[];
	//月份
	var month=[];
	//当前时间
	var currentdate = new Date().Format("yyyy-MM-dd");
	//甘特图从第二条到第四条的线
	var j=1;
	var s=2;
	var u=1;
	//拼甘特图的总长度
	//获取名称
	var date='';
	var start=$('#minChartTime').val();
	/*Date s=start;
		date=date.setMonth(s.getMonth() - 1);*/
	var end=$('#maxChartTime').val();
	//alert(start+"+++++"+date);
	//获取月份差
	var monthdiffer=getMonths(start,end);
	var s="ssss";
	for(var i=0;i<monthdiffer;i++){
		var newdatestart=new Date(start);
		var newdateend=new Date(end);
		var startdates=newdatestart;
		var enddates=newdateend;

		startdates.setMonth(startdates.getMonth()+i);
		/*alert("开始时间"+startdates.toLocaleDateString());*/


		enddates.setMonth(enddates.getMonth()+i+1);
		/*alert("结束时间"+enddates.toLocaleDateString());*/
		startdates=startdates.format('yyyy-MM-dd');
		enddates=enddates.format('yyyy-MM-dd');
		var test = start.substr(0,7);
		/*	startdate=startdate.toLocaleDateString().replace("/","-");
			enddate=enddate.toLocaleDateString().replace("/","-");
			startdate=startdate.replace("/","-");
			enddate=enddate.replace("/","-");*/
		/*alert("开始时间"+startdates+"结束时间"+enddates);*/
		/*var statime='';
			var entime='';
			statime=startdates;
			entime=enddates*/
		var star=startdates.substr(0,7);
		month.push({
			"start":startdates,
			"end":enddates,
			"label": star+"月"
		});

	}











	var day=end.substr(5,2);
	//实际开始和结束
	var practicalstarttime='';
	var practicalendtime='';
	//拼甘特图
	if(tempData!=null){
		for(var i=0;i<tempData.length;i++){
			//获取数量
			var number=0;
			number=tempData[i].number;//数量
			var surplusnumber=0;
			surplusnumber=tempData[i].surplusnumber;//剩余数量
			var completenumber=tempData[i].completenumber;//完成数量
			//alert("数量"+number+"剩余数量"+surplusnumber+"完成数量"+completenumber);
			//获取数据已经逻辑处理
			var name=tempData[i].productorname;
			var productordesc=tempData[i].productordesc;
			//alert(productordesc);
			var starttime=tempData[i].starttime.substr(0,10);
			var endtime=tempData[i].endtime.substr(0,10);
			var practicalstarttimes=tempData[i].practicalstarttime;/*.substr(0,10);*/
			var practicalendtimes=tempData[i].practicalendtime;/*.substr(0,10);*/
			//判断实际开始和实际结束时间是否存在
			if(practicalstarttimes!=null){
				practicalstarttime=practicalstarttimes.substr(0,10);
			}else if(practicalendtimes=null){
				practicalendtime=practicalendtimes.substr(0,10);
			}
			var adjuststarttime=tempData[i].adjuststarttime;//.substr(0,10);
			var adjustendtime=tempData[i].adjustendtime;//.substr(0,10);


			//判断是否存在实际开始时间，如果没有则不拼接第二天甘特图
			if(practicalstarttimes==null){
				//alert("没有");
				process.push({label:"总数:"+number+"{br}"+name+"{br}"+productordesc+"{br}完成"+completenumber+"{br}剩余:"+surplusnumber,id:'"'+j+'"'});
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
				});
			}else if(practicalstarttimes!=null){
				//alert("有");
				//如果存在实际开始时间，则判断剩余数量，如果剩余数量为零，则将甘特图第二条显示为红色
				if(surplusnumber==0){
					//判断实际结束时间是否大于计划结束时间
					if(practicalendtime>endtime){
						//alert("黑色");
						process.push({label:"总数:"+number+"{br}"+name+"{br}"+productordesc+"{br}完成"+completenumber+"{br}剩余:"+surplusnumber,id:'"'+j+'"'});
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
							start:practicalstarttime,
							end:currentdate,
							id:'"'+j+'"',
							"color": "black",
							"toppadding": "56%",
							"height": "32%"
						});
					}else{
						//alert("红色");
						process.push({label:"总数:"+number+"{br}"+name+"{br}"+productordesc+"{br}完成"+completenumber+"{br}剩余:"+surplusnumber,id:'"'+j+'"'});
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
							start:practicalstarttime,
							end:currentdate,
							id:'"'+j+'"',
							"color": "#e44a00",
							"toppadding": "56%",
							"height": "32%"
						});}

				}else{
					//判断当前时间是否大于计划结束时间
					if(currentdate>endtime){
						//alert("黑色");
						process.push({label:"总数:"+number+"{br}"+name+"{br}"+productordesc+"{br}完成"+completenumber+"{br}剩余:"+surplusnumber,id:'"'+j+'"'});
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
							start:practicalstarttime,
							end:currentdate,
							id:'"'+j+'"',
							"color": "black",
							"toppadding": "56%",
							"height": "32%"
						});
					}else{
						//alert("绿色");
						process.push({label:"总数:"+number+"{br}"+name+"{br}"+productordesc+"{br}完成"+completenumber+"{br}剩余:"+surplusnumber,id:'"'+j+'"'});
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
							start:practicalstarttime,
							end:currentdate,
							id:'"'+j+'"',
							"color": "#6baa01",
							"toppadding": "56%",
							"height": "32%"
						});
					}

				}

			}
			connector.push({
				"fromtaskid": "1",
				"totaskid": "1-2",
				"color": "#e44a00",
				"thickness": "2",
				"fromtaskconnectstart_": "1"
			});
			j++;
		}
	}
	var fun = new FusionCharts({
		type: 'gantt',
		renderAt: 'chart-containerViewSingleOrderProgressCondition',
		width: '1000',
		height: '600',
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
			            	                	"label":businessmingxi+"月销售订单完成状况甘特图",
			            	                	"align": "middle",
			            	                	"fontcolor": "#FFFFFF ",
			            	                	"fontsize": "18"
			            	                }
			            	                ]
			               },{
			            	   "bgcolor": "#ffffff",
			            	   "fontcolor": "#333333",
			            	   "fontsize": "20",
			            	   "align": "center",
			            	   "category":month,
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
			                            	  /*"connector":connector*/
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
			                            	            	"label": "确认（在制）",
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
