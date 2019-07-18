$(function(){
    initTimePickYm("starttime");
    com.leanway.initSelect2("#productionchildsearchno","../../../"+ln_project+"/workorderbarcodeprint?method=queryDispatchOrder", "搜索生产子查询号",true);
})

function queryTransferReport(type){
	    var productionchildsearchno = $("#productionchildsearchno").val();
	    var productionchildsearchnos = "";
	    if(productionchildsearchno!=null){
	        for(var j=0;j<productionchildsearchno.length;j++){
	            productionchildsearchnos+=productionchildsearchno[j]+","
	        }
	    }
	    var starttime = $("#starttime").val();
	    if(starttime==""){
	        lwalert("tipModal",1,"请输入日期")
	    }else{
	        showMask("mask");
	        $.ajax({
	            type : "post",
	            url : "../../../"+ln_project+"/productionTrack?method=queryTransferReport",
	            data : {
	                "productionchildsearchno":productionchildsearchnos.substring(0,productionchildsearchnos.length-1),
	                "starttime" : starttime,
	                "type":type
	            },
	            dataType : "text",
	            success : function(data) {

	                var flag =  com.leanway.checkLogind(data);

	                if(flag){
	                    var tempdata = $.parseJSON(data);
	                    if(tempdata.status=="success"){
	                        appendHtml(tempdata.data);
	                    }else{
	                        lwalert("tipModal",1,tempdata.info)
	                    }
	                    hideMask("mask");

	                }
	            },
	            error : function(data) {

	            }
	        });
	    }
}

function appendHtml(data){
     var html="";
   html+='<tr bgcolor="#D4CFCF"><td>产品编码</td><td>产品描述</td><td>图号</td><td>需求数量</td><td>已领用数量</td><td>倒扣数量</td><td>未倒扣数量</td></tr>'
	 for(var i in data){
//		 if(i>0){
//	            html+='<tr><td colspan="10" ><hr  style="height:2px;border:none;border-top:1px dotted #185598;margin:30px"/></td></tr>';
//	     }
//		 var reportList = data[i].reportList;
//		 var productionorder = data[i].productionorder;
//         html+='<tr bgcolor="#D4CFCF"><td>产品编码</td><td>产品描述</td><td>图号</td><td>需求数量</td><td>已领用数量</td><td>倒扣数量</td><td>未倒扣数量</td></tr>'
//         html+='<tr bgcolor="#f4f4f4">';
//         html+='<td colspan="9">'+productionorder.productionnumber+'(产品：'+productionorder.productorname+'|'+productionorder.productordesc+')(数量：'+productionorder.number+')(完工数量:'+productionorder.completenumber+')(已同步数量：'+productionorder.tranferscount+')</td>';
//
//         for(var j=0;j<reportList.length;j++){
//             html+= '<tr><td>'+reportList[j].productorname+'</td><td>'+reportList[j].productordesc+'</td><td>'+reportList[j].drawcode+'</td><td>'+reportList[j].needcount+'</td><td>'+reportList[j].usedcount+'</td><td>'+reportList[j].tranferscount+'</td><td>'+reportList[j].untransfercount+'</td></tr>'
//         }
       html+= '<tr><td>'+data[i].productorname+'</td><td>'+data[i].productordesc+'</td><td>'+data[i].drawcode+'</td><td>'+data[i].needcount+'</td><td>'+data[i].usedcount+'</td><td>'+data[i].tranferscount+'</td><td>'+data[i].untransfercount+'</td></tr>'
     }
    $("#generalInfo").html(html);
}