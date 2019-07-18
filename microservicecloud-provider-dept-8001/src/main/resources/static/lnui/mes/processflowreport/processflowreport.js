$(function(){
    com.leanway.initSelect2("#productionchildsearchno","../../../"+ln_project+"/workorderbarcodeprint?method=queryDispatchOrder", "搜索生产查询号",false);
    com.leanway.initSelect2("#productorid","../../../"+ln_project+"/productors?method=queryProductorBySearch", "搜索产品",false);
    
})
function queryProcedureReport(){
    var productionchildsearchno = $("#productionchildsearchno").val();
    var productorid = $("#productorid").val();
    if(productionchildsearchno==''||productionchildsearchno==null||productorid==""||productorid==null){
        lwalert("tipModal",1,"请选择生产子查询号和产品进行查询")
        return;
    }
        showMask("mask");
        $.ajax({
            type : "post",
            url : "../../../"+ln_project+"/productionGroupReport?method=queryProcessFlowReport",
            data : {
                "productionsearchno":productionchildsearchno,
                "productorid":productorid
            },
            dataType : "text",
            success : function(data) {
                var flag =  com.leanway.checkLogind(data);
                if(flag){
                    hideMask("mask");
                    var tempdata = $.parseJSON(data);
                    appendHtml(tempdata);

                }
            },
            error : function(data) {

            }
        });
}

function appendHtml(data){
	var processflowreport = data.processflowreport;
	var tracklist = processflowreport.trackList;
    var html="";
    html+="<thead>"
    html+="<tr>"
    html+="<th>生产订单号</th><th>"+processflowreport.productionnumber+"</th><th>任务数量</th><th>"+processflowreport.number+"</th><th>开始时间</th><th>"+processflowreport.adjuststarttime+"</th><th>结束时间</th><th>"+processflowreport.adjustendtime+"</th><th>工艺路线</th><th colspan='5'>"+processflowreport.processroutelinestr+"</th>"
    html+="</tr>"
    html+="<tr>"
    html+="<th rowspan='2'>物料名称</th><th rowspan='2'>物料代码</th><th rowspan='2'>工作中心</th><th rowspan='2'>工序</th><th rowspan='2'>开始时间</th><th rowspan='2'>结束时间</th><th rowspan='2'>设备</th><th rowspan='2'>模具</th><th colspan='4'>操作工填写</th><th rowspan='2'>流转数量</th><th rowspan='2'>派工单号</th>"
    html+="</tr>"
    html+="<tr>"
	html+="<th>日期</th><th>操作工</th><th>合格数量</th><th>不合格数量</th>"
	html+="</tr>"
    html+="</thead><tbody>"
    for(var i=0;i<tracklist.length;i++){
    	var employee = tracklist[i].employeeDispatchingList;
    	html+="<tr>"
        if(i==0){
    		html+="<td rowspan="+tracklist.length+">"+processflowreport.productordesc+"</td><td rowspan="+tracklist.length+">"+processflowreport.productorname+"</td><td>"+(tracklist[i].centername==null?tracklist[i].personcentername:tracklist[i].centername)+"</td><td>"+tracklist[i].shortname+"</td><td>"+tracklist[i].adjuststarttime+"</td><td>"+tracklist[i].adjustendtime+"</td><td>"+tracklist[i].equipmentname+"</td><td>"+(tracklist[i].mouldname==null?"":tracklist[i].mouldname)+"</td><td>"+(tracklist[i].endtime==null?"":tracklist[i].endtime)+"</td>";
    		html+="<td>";
    		for(var j=0;j<employee.length;j++){
    			html+=employee[j].employeename+"<br>";
    		}
    		html+="</td>";
    		html+="<td>"+(tracklist[i].qualifiedcount==null?"":tracklist[i].qualifiedcount)+"</td><td>"+(tracklist[i].unqualifiedcount==null?"":tracklist[i].unqualifiedcount)+"</td><td>"+tracklist[i].count+"</td><td>"+tracklist[i].dispatchingnumber+"</td>"
        }else{
    		html+="<td>"+(tracklist[i].centername==null?tracklist[i].personcentername:tracklist[i].centername)+"</td><td>"+tracklist[i].shortname+"</td><td>"+tracklist[i].adjuststarttime+"</td><td>"+tracklist[i].adjustendtime+"</td><td>"+tracklist[i].equipmentname+"</td><td>"+(tracklist[i].mouldname==null?"":tracklist[i].mouldname)+"</td><td>"+(tracklist[i].endtime==null?"":tracklist[i].endtime)+"</td>";
    		html+="<td>";
    		for(var j=0;j<employee.length;j++){
    			html+=employee[j].employeename+"<br>";
    		}
    		html+="</td>";
    		html+="<td>"+(tracklist[i].qualifiedcount==null?"":tracklist[i].qualifiedcount)+"</td><td>"+(tracklist[i].unqualifiedcount==null?"":tracklist[i].unqualifiedcount)+"</td><td>"+tracklist[i].count+"</td><td>"+tracklist[i].dispatchingnumber+"</td>"
        }
		html+="</tr>"
    }
	
   
    html+="</tbody>"
    $("#generalInfo").html(html);
}