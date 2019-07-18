$(function(){
    com.leanway.initSelect2("#productionsearchno", "../../../../"+ln_project+"/bomTrack?method=queryProductionsearchno", "请输入生产查询号");
})

var findDispatchingOrderBySearchno = function(){
    var productionsearchno = $("#productionsearchno").val();
    $.ajax({
        type:"post",
        url:"../../../../"+ln_project+"/sendDispatchingOrder?method=queryDispatchingOrderBySearchno",
        data:{
            "productionsearchno":productionsearchno
        },
        dataType:"json",
        success:function(data){
        	
			var flag =  com.leanway.checkLogind(data);
			
			if(flag){
	        	
	            if(data.status="success"){
	                var html='';
	                var tempdata = data.data;
	                for(var i = 0;i<tempdata.length;i++){
	                    html+="<tr>";
	                    html+="<td>"+tempdata[i].dispatchingnumber+"</td>";
	                    html+="<td>"+tempdata[i].productionchildsearchno+"</td>";
	                    html+="<td>"+tempdata[i].procedureid+"</td>";
	                    html+="<td>"+tempdata[i].line+"</td>";
	                    html+="<td>"+tempdata[i].starruntime+"</td>";
	                    html+="<td>"+tempdata[i].planruntime+"</td>";
	                    html+="<td>"+tempdata[i].practicalruntime+"</td>";
	                    html+="<td>"+tempdata[i].contrastruntime+"</td>";
	                    html+="<td>"+tempdata[i].runtimerate+"</td>";
	                    html+="<td>"+tempdata[i].timeunit+"</td>";
	                    html+="</tr>";
	                }
	             $("#tableBody").html(html);
	             $("#count").show();
	             $("#countData").html(tempdata.length);
	            }
	            lwalert("tipModal", 1, data.info);
	            
			}
        }

    })
}