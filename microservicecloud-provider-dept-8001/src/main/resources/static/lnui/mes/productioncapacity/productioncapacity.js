$(function() {

getYear();
getMonth();
getChartByProductorId();
loadProtype();
 
})

// 加载所有的产品种类
var loadProtype = function ( ) {
	
	var year = $("#year").val();
	 if(year==-1){
		 year=v;
	 }
	 
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/productionCapacity",
		data :{
			"method" : "findChartProductorType",
			"year" : year
		},
		dataType : "json",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {


				var protype = data;
				var html="";
				html +="<option value=''>请选择</option>";
				for (var i = 0;i<protype.length;i++) {
					/**
					 * option 的拼接 + "|" + protype[i].productortypename+
					 * */
					html +="<option value="+ protype[i].productortypeid+">"+protype[i].value +"</option>";
				}
				 
				$("#productorTypeId").html(html);


			}
		}
	});
}


function getChartByProductorId(){

	 showMask();
	var year = $("#year").val();
	 if(year==-1){
		 year=v;
	 }
	 
	 var productorTypeId = $("#productorTypeId").val();
	 if (productorTypeId == null || productorTypeId == "null" || productorTypeId == "") {
		 productorTypeId = "";
	 }
	  
	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/productionCapacity",
		data : {

			"method" : "queryChartByProductorId",
			 "year":year,
			 "productorTypeId" : productorTypeId
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var temp = $.parseJSON(data);
					FusionCharts.ready(function () {
						var analysisChart = new FusionCharts({
							type: 'column3d',
							renderAt: 'productioncapacity-container',
							width:changeWidth("productioncapacity-container"),
							height: changeHeigth(),
							dataFormat: 'json',
							dataSource:temp
						}).render();
						hideMask();
					});

			}
		}
	});
	getPieChart();
}

function getPieChart(){

	showMask();
	var year = $("#year").val();
	var month = $("#month").val();
	 if(year==-1){
		 year=v;
	 }
	 
	 var productorTypeId = $("#productorTypeId").val();
	 if (productorTypeId == null || productorTypeId == "null" || productorTypeId == "") {
		 productorTypeId = "";
	 }
	 
	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/productionCapacity",
		data : {

			"method" : "getPieChart",
			 "year":year,
			 "month":month,
			 "productorTypeId" : productorTypeId
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){


				var temp = $.parseJSON(data);

					FusionCharts.ready(function () {
						var analysisChart = new FusionCharts({
							type: 'pie3d',
							renderAt: 'capacity-container',
							width:"800px",
							height: changeHeigth(),
							dataFormat: 'json',
							dataSource:temp
						}).render();
						hideMask();
					});

			}
		}
	});
}


function getYear(){
	var date = new Date();
	var year = date.getFullYear();
	var html = "";
	for(var i=year;i>year-16;i--){

			html += "<option value=" + i + ">" + i
					+ "</option>";
		}
	html += "<option value=-1>" + "其他"
	+ "</option>";
		$("#year").html(html);
	return
}
function getMonth(){
	var html2 = "";
	for(var i=1;i<13;i++){

			html2 += "<option value=" + i + ">" + i
					+ "</option>";
		}
		$("#month").html(html2);
	return
}



var width;
function changeWidth(id) {

	if($(window).width()<768){
		width=$("#"+id).width()*(9/10)
	}else{
		width=$("#"+id).width()*(2/3)
	}

	return width;
}
function changeHeigth() {


	return width*(3/4);
}

var v;
$.fn.editable = function(config)
{

    $(this).each(function(i,t){

        $(t).change(function(){
            var me=$(this);
            me.find('.customval').remove();
            if(-1 == me.val())
            {
                var ed = $("<input type=\"text\" class=\"form-control\"/>");
                me.after(ed).hide();
                ed.blur(function(){
                     v=ed.val();

                    if(null === v ||  v.length ==0){
                        ed.remove();me.val(null).show();
                    }else{
                    	getChartByProductorId();
                        me.append("<option value=\""+v+"\" class=\"customval\" selected>"+v+"</option>").show();
                        ed.remove();
                    }
                }).focus();
            }
        })
    });
}

$(document).ready(function (e) {
	$("#year").editable(e);
	});

function showMask(){
    $("#mask").css("height",$(document).height());
    $("#mask").css("width",$(document).width());
    $("#mask").show();
  }
  //隐藏遮罩层
  function hideMask(){

    $("#mask").hide();
  }