
$(function() {

	var centerid = $("#centerid").val()

    com.leanway.initSelect2("#centername", "../../../../"+ln_project+"/workCenter?method=queryWorkCenterBySelect&type=2", "搜索人工工作中心");
    com.leanway.initSelect2("#equipmentname", "../../../../"+ln_project+"/workCenter?method=queryEquipment&centerid="+centerid+"&type=2", "搜索雇员");
});





$("#centername").on("change", function(e) {

	$("#centerid").val($(this).find("option:selected").val());
	checkCenter();
});



function checkCenter(){

	var centerid = $("#centerid").val();
	com.leanway.initSelect2("#equipmentname", "../../../../"+ln_project+"/workCenter?method=queryEquipment&centerid="+centerid+"&type=2", "搜索雇员");
}

$("#equipmentname").on("change", function(e) {
	$("#equipmentid").val($(this).find("option:selected").val());
});


//导出excel文件
function exportEmployee() {

	var centerid = $("#centerid").val();
	var equipmentid = $("#equipmentid").val();

	window.location.href = "../../../../"+ln_project+"/workCenter?method=exportExcel&centerid="+centerid+"&equipmentid="+equipmentid+"&type=2";


}

function queryEmployeeList(){

	var centerid = $("#centerid").val();
	var equipmentid = $("#equipmentid").val();
    showMask();
    var btype = "code128";
    var settings = {
            output : "css",
            bgColor : "#FFFFFF",
            color : "#000000",
            barHeight : "50",
            moduleSize : "5",
            posX : "10",
            posY : "20",
            addQuietZone : "1"
    };
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/workCenter",
        dataType : "text",
        data : {
			"method" : "downloadDataList",
			"type" : "2",
			"centerid" : centerid,
			"equipmentid" : equipmentid
		},
        success : function(data) {
           var result = $.parseJSON(data);
           var tempData = result.list;
           console.info(result)
           $("#count").html("共<font color='red'>"+result.length+"</font>条数据");
           var html="";
           html+= "<table class='table table-striped table-bordered table-hover'>";
           html+="<tr>"
           for(var i=0;i<result.length;i++){

               if(i!=0&&i%3==0){
                   html+="</tr>"
                   html+="<tr>"
               }
               if (i!=0&&i%27==0) {
                   html += "<tr>";
                   html += "  <td colspan='10' >";
                   html += "  </td>";
                   html += "  </tr></table>";
                   html += "<p style='page-break-after:always;'></p>";
                   html += "<table class='table table-hover'>";
               }
               html+="<td align='center'>"
               html+=tempData[i].equipmentname+"<div id='barcode"+i+"'>"+tempData[i].barcode+"</div>"
               html+="</td>"

           }
           html += "  </tr></table>";
           $("#info").html(html);
           for ( var j in tempData) {
               var value = tempData[j].barcode;
               // 条码显示 后台传上id值 获取填值
               if(value!=null&&value!=""){
                   $("#barcode"+j).barcode(value, btype, settings);
               }
           }
           $("#mask").hide();
        }
    });

}


function print() {
    retainAttr = true;
    $("#info").printArea();
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