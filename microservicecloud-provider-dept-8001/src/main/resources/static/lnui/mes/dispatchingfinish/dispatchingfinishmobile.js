

$(function() {

	com.leanway.loadTags();

	queryChartByYears();
})



function queryChartByYears(){

	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/dispatchingFinish?method=queryDispatchingFinish",
		data : {
			"type" : "mobile"
		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){


				var temp = $.parseJSON(data);
				console.info(temp);

				var myChart = echarts.init(document.getElementById('salesfinish-container'));
				option = temp;
					myChart.setOption(option);
					var container = document.getElementById('salesfinish-container');
					var resizeWorldMapContainer = function () {
						container.style.width = window.innerWidth*9/10+'px';
						container.style.height = window.innerHeight*9/10+'px';
				};

				    //重置容器高宽
				    resizeWorldMapContainer();
				    myChart.resize();

			}
		},
		error : function(data) {
//			alert("保存失败！");
			lwalert("tipModal", 1, "保存失败！");
		}
	});


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

function showMask(){
    $("#mask").css("height",$(document).height());
    $("#mask").css("width",$(document).width());
    $("#mask").show();
  }
  //隐藏遮罩层
  function hideMask(){

    $("#mask").hide();
  }

