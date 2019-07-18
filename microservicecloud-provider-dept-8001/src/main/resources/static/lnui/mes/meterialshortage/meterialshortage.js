$(function(){
    initTimePickYmd("starttime");
    com.leanway.initSelect2("#productortypeid", "../../../"+ln_project+"/producttype?method=queryProtypeBySelect", "搜索产品类型",true);
    com.leanway.initSelect2("#productionchildsearchno","../../../"+ln_project+"/workorderbarcodeprint?method=queryDispatchOrder", "搜索生产子查询号",true);

})
var initTimePickYmd = function(timeId) {

    $("#" + timeId).datetimepicker({
        language : 'zh-CN',
        weekStart : 7,
        todayBtn : 1,
        autoclose : 1,
        todayHighlight : 1,
        startView : 2,
        minView : 2,
        forceParse : 0,
        format : 'yyyy-mm-dd'
    });
}

function queryMeterialShortage(type){
    var productortypeid = $("#productortypeid").val();
    var productortypeids="";
    if(productortypeid!=null){
        for(var i=0;i<productortypeid.length;i++){
            productortypeids+=productortypeid[i]+","
        }
    }
    var productionchildsearchno = $("#productionchildsearchno").val();
    var productionchildsearchnos = "";
    if(productionchildsearchno!=null){
        for(var j=0;j<productionchildsearchno.length;j++){
            productionchildsearchnos+=productionchildsearchno[j]+","
        }
    }
    console.info(productionchildsearchnos);
    var starttime = $("#starttime").val();
    if(starttime==""&&type==1){
        lwalert("tipModal",1,"请输入预计成套日期")
    }else if(productionchildsearchnos==""&&type==1){
        lwalert("tipModal",1,"请搜索生产子查询号")
    }else{
        showMask("mask");
        $.ajax({
            type : "post",
            url : "../../../"+ln_project+"/bom?method=queryBomCanUsed",
            data : {
                "productortypeid":productortypeids.substring(0,productortypeids.length-1),
                "productionchildsearchno":productionchildsearchnos.substring(0,productionchildsearchnos.length-1),
                "starttime" : starttime,
                "type":type,

            },
            dataType : "text",
            success : function(data) {

                var flag =  com.leanway.checkLogind(data);

                if(flag){
                    var tempdata = $.parseJSON(data);
                    if(tempdata.status=="success"){
                        appendHtml(tempdata.info,type);
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

function appendHtml(data,type){
    console.info(data);
    var html="";
    for(var m =0;m<data.length;m++ ){
        if(m>0){
            html+='<tr><td colspan="10" ><hr  style="height:2px;border:none;border-top:1px dotted #185598;margin:30px"/></td></tr>';
        }
        if(type==1){
            for(var i=data[m].length-1;i>=0;i--){

                if(i==data[m].length-1){
                    html+='<tr bgcolor="#D4CFCF"><td>产品名称</td><td>完工数量</td><td>在制可完工数量</td><td>需求数量(一)</td><td>缺料数量(一)</td><td>需求数量(二)</td><td>缺料数量(二)</td><td>需求数量(三)</td><td>缺料数量(三)</td></tr>'
                }
                html+='<tr bgcolor="#f4f4f4">';
                html+='<td colspan="9">'+data[m][i].parent.productordesc+'(可齐套数量:'+data[m][i].parent.completecount+')</td>';

                for(var j=0;j<data[m][i].childrens.length;j++){
                    html+= '<tr><td bgcolor="#A5A1A1">'+data[m][i].childrens[j].productordesc+'</td><td bgcolor="#A5A1A1">'+data[m][i].childrens[j].finishcount+'</td><td bgcolor="#A5A1A1">'+data[m][i].childrens[j].inbusinessNum+'</td><td bgcolor="#BBB7B7">'+data[m][i].childrens[j].daycount.one.needcount+'</td><td bgcolor="#BBB7B7">'+data[m][i].childrens[j].daycount.one.shortcount+'</td><td bgcolor="#D4CFCF">'+data[m][i].childrens[j].daycount.two.needcount+'</td><td bgcolor="#D4CFCF">'+data[m][i].childrens[j].daycount.two.shortcount+'</td><td bgcolor="#EAE8E8">'+data[m][i].childrens[j].daycount.three.needcount+'</td><td bgcolor="#EAE8E8">'+data[m][i].childrens[j].daycount.three.shortcount+'</td></tr>'
                }
        }
        }else{
            for(var i=data[m].length-1;i>=0;i--){
                if(i==data[m].length-1){
                    html+='<tr bgcolor="#D4CFCF"><td>产品名称</td><td>完工数量</td><td>在制可完工数量</td><td>需求数量</td><td>缺料数量</td></tr>'
                }
                html+='<tr bgcolor="#f4f4f4">';
                html+='<td colspan="9">'+data[m][i].parent.productordesc+'(可齐套数量:'+data[m][i].parent.completecount+')</td>';

                for(var j=0;j<data[m][i].childrens.length;j++){
                    html+= '<tr><td>'+data[m][i].childrens[j].productordesc+'</td><td>'+data[m][i].childrens[j].finishcount+'</td><td>'+data[m][i].childrens[j].inbusinessNum+'</td><td>'+data[m][i].childrens[j].daycount.one.needcount+'</td><td>'+data[m][i].childrens[j].daycount.one.shortcount+'</td></tr>'
                }
            }
        }

    }
    $("#generalInfo").html(html);

}