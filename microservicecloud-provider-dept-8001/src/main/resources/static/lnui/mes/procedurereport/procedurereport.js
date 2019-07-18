$(function(){
    com.leanway.initSelect2("#productionchildsearchno","../../../"+ln_project+"/productionGroupReport?method=querProductionSearchno", "搜索生产查询号",false);
//    queryProcedureReport();
})
function queryProcedureReport(){
    var productionchildsearchno = $("#productionchildsearchno").val();
    if(productionchildsearchno==''||productionchildsearchno==null){
        lwalert("tipModal",1,"请选择生产子查询号进行查询")
        return;
    }
        showMask("mask");
        
        var searchType = $('input[name="searchType"]:checked').val();
        
        $.ajax({
            type : "post",
            url : "../../../"+ln_project+"/productionGroupReport?method=queryProcedureReport",
            data : {
                "productionsearchno":productionchildsearchno,
                "searchType":searchType
            },
            dataType : "text",
            success : function(data) {
                var flag =  com.leanway.checkLogind(data);
                if(flag){
                    hideMask("mask");
                    $("#generalInfo").html(data);
                    
//                    var tempdata = $.parseJSON(data);
//                    appendHtml(tempdata);

                }
            },
            error : function(data) {

            }
        });
}

function appendHtml(data){
	var processrouteline = data.processrouteline;
	var procedurereport = data.procedurereport;
    var html="";
    html+="<thead>"
    html+="<tr>"
    html+="<td>编码</td><td>名称</td><td>数量</td>"
    for(var i=processrouteline.length-1;i>=0;i--){
    	html+="<td>"+processrouteline[i].procedurename+"("+processrouteline[i].shortname+")</td>"
    }
    html+="</tr>"
    html+="</thead><tbody>"
    for(var j=0;j<procedurereport.length;j++){
      html+="<td>"+procedurereport[j].productorname+"</td><td>"+procedurereport[j].productordesc+"</td><td>"+procedurereport[j].number+"</td>"
      var proceduretime = procedurereport[j].proceduretime;
      var length = processrouteline.length-procedurereport[j].column-proceduretime.length;
      for(var i=0;i<length;i++){
    	  html+="<td>&nbsp;</td>"
      }
      for(var i=proceduretime.length-1;i>=0;i--){
    	  if(proceduretime[i].dispatchingstatus==2){
    		  html+="<td bgcolor='#f3e912'>"+proceduretime[i].endtime+"</td>"
    	  }else if(proceduretime[i].dispatchingstatus==3){
    		  html+="<td bgcolor='#00a60e'>"+proceduretime[i].endtime+"</td>"
    	  }else if(proceduretime[i].dispatchingstatus==4){
    		  html+="<td bgcolor='#dd4b39'>"+proceduretime[i].endtime+"</td>"
    	  }else if(proceduretime[i].dispatchingstatus==5){
    		  html+="<td bgcolor='#072ae3'><font color='#ffffff'>"+proceduretime[i].endtime+"</font></td>"
    	  }else{
    		  html+="<td>"+proceduretime[i].endtime+"</td>"
    	  }
    	  
      }
      for(var i=0;i<procedurereport[j].column;i++){
    	  html+="<td>&nbsp;</td>"
      }
      html+="</tr>"
    }
    html+="</tbody>"
    $("#generalInfo").html(html);
}
function downloadProcedureReport(){
	 var productionchildsearchno = $("#productionchildsearchno").val();
     if(productionchildsearchno==''||productionchildsearchno==null){
        lwalert("tipModal",1,"请选择生产子查询号进行导出")
        return;
     }
	window.location.href = "../../../../"+ln_project+"/productionGroupReport?method=downloadProcedureReport&productionsearchno="+productionchildsearchno;
}