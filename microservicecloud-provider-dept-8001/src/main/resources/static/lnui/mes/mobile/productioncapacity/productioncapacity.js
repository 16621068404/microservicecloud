$(function() {
	getMonth();
	getPieChart();
})



function getPieChart(){
	
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth();
	 if(year==-1){
		 year=v;
	 }
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/productionCapacity",
		data : {

			"method" : "getPieChart",
			 "year":year,
			 "month":month
		},
		dataType : "text",
		async : false,
		success : function ( data ) {
			//console.info(data);
			var temp = $.parseJSON(data);
			console.info(temp);
				FusionCharts.ready(function () {
					var analysisChart = new FusionCharts({
						type: 'pie3d',
						renderAt: 'capacity-container',
						width:changeWidth("capacity-container"),
						height: changeHeigth(),
						dataFormat: 'json',
						dataSource:temp
					}).render();
				});
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
	return;
}



var width;
function changeWidth(id) {

	if($(window).width()<768){
		width=$("#"+id).width()*(10/9)
	}else{
		width=$("#"+id).width()*(2/3)
	}

	return width;
}
function changeHeigth() {


	return width;
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