$(function(){
    initTimePickYmd("starttime");
    com.leanway.initSelect2("#productionchildsearchno","../../../"+ln_project+"/productionGroupReport?method=querProductionSearchno", "搜索生产查询号",true);
	queryWorkCenterGroup();
	queryProductionGroupReport();
})
function queryWorkCenterGroup(){
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/workCenterGroup",
        data : {
            "method" : "queryWorkCenterGroup",
        },
        dataType : "text",
        success : function(data) {

            var flag =  com.leanway.checkLogind(data);

            if(flag){
                var result = eval("(" + data + ")");
                var html='<option value="">-----工作组-----</option>';
                for(var i=0; i<result.length;i++){

                    html+='<option value="'+result[i].groupid+'">'+result[i].shortname+'</option>'
                }
                $("#groupid").html(html);
            }
        },
        error : function(data) {
            lwalert("tipModal", 1, "error！");
        }
    });
}
function queryProductionGroupReport(){
    var productionchildsearchno = $("#productionchildsearchno").val();
    var productionchildsearchnos = "";
    if(productionchildsearchno!=null){
        for(var j=0;j<productionchildsearchno.length;j++){
            productionchildsearchnos+=productionchildsearchno[j]+","
        }
    }
        showMask("mask");
        $.ajax({
            type : "post",
            url : "../../../"+ln_project+"/productionGroupReport?method=queryProductionGroupReport",
            data : {
                "productionsearchno":productionchildsearchnos.substring(0,productionchildsearchnos.length-1),
                "groupid" : $("#groupid").val(),
                "starttime":$("#starttime").val()

            },
            dataType : "text",
            success : function(data) {
                var flag =  com.leanway.checkLogind(data);

                if(flag){
                    var tempdata = $.parseJSON(data);
                    appendHtml(tempdata);
                    hideMask("mask");

                }
            },
            error : function(data) {

            }
        });
}

function appendHtml(data){
	var date = new Date();
	if($("#starttime").val()!=''){
		date = new Date($("#starttime").val());
	}
	var groupList = data.group;
	var groupreport = data.groupreport;
    var html="";
    html+="<thead>"
    html+="<tr>"
    html+="<td>车型</td><td>产品</td><td>订单数量</td><td>前期预完</td><td>"+((date.getMonth()+1)>12?((date.getMonth()+1)-12):(date.getMonth()+1))+"月</td><td>单位</td><td>采购部材料配套日期</td>"
    for(var i=0;i<groupList.length;i++){
    	html+="<td width='300px'>"+groupList[i].shortname+"开竣工日期</td>"
    }
    html+="<td>累计</td>"
    html+="<td>入库时间</td>"
    html+="<td>发货时间</td>"

	html+="<td>"+((date.getMonth()+2)>12?((date.getMonth()+2)-12):(date.getMonth()+2))+"月</td>"
	html+="<td>"+((date.getMonth()+3)>12?((date.getMonth()+3)-12):(date.getMonth()+3))+"月</td>"
	html+="<td>"+((date.getMonth()+4)>12?((date.getMonth()+4)-12):(date.getMonth()+4))+"月</td>"
    html+="</tr>"
    html+="</thead><tbody>"
    for(var j in groupreport){
    	var plantotalcount = 0;
      html+="<td>"+groupreport[j].contractno+"</td><td>"+groupreport[j].productordesc+"</td><td>"+groupreport[j].note+"</td><td>"+groupreport[j].qualifiedcount+"</td><td>"+groupreport[j].plancount+"</td><td>"+groupreport[j].unitsname+"</td>"
      var purchasetime = groupreport[j].purchasetime;
	  html+="<td>"
      for(var n=0;n<purchasetime.length;n++){
		  html+=purchasetime[n]+"配齐<br>";
      }
	  html+="</td>"
      var grouptime = groupreport[j].grouptime;
      for(var i in grouptime){
    	  var group = grouptime[i];
    	  plantotalcount+=group.length;

    	  html+="<td>"
    	  for(var m=0;m<group.length;m++){
    		  html+=group[m]+"<br>";
    	  }
    	  html+="</td>"
      }
      html+="<td>"+plantotalcount+"</td>"
      var runtime = groupreport[j].runendtime;
	  html+="<td>"
      for(var n=0;n<runtime.length;n++){
		  html+=runtime[n]+"<br>";
      }
	  html+="</td>"
	  var sendtime = groupreport[j].sendtime;
	  html+="<td>"
      for(var n=0;n<sendtime.length;n++){
		  html+=sendtime[n]+"<br>";
      }
	  html+="</td>"
      html+="<td>"+groupreport[j].nextmonth1+"</td><td>"+groupreport[j].nextmonth2+"</td><td>"+groupreport[j].nextmonth3+"</td>"
      html+="</tr>"
    }
    html+="</tbody>"
    $("#generalInfo").html(html);
}