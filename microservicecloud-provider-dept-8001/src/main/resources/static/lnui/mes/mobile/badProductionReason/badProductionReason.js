


$(function() {
    //加载工作中心
    loadCenter();
    badProductionReasonChart()
});


var selectMonth;
function getLastMonth(){
    var date = new Date();
    var month  = date.getMonth()+1;
    selectMonth = month-1;
//    var startCheckTime = $("#startCheckTime").val();
//    if( $("#startCheckTime").val()==1){
//        lwalert("tipModal", 1,"当前已经是一月份了！");
//    }else{

//        $("#startCheckTime").val(startCheckTime);
//    }
}

function getNextMonth(){
//    var startCheckTime = $("#startCheckTime").val();
//    if( $("#startCheckTime").val()==12){
//        lwalert("tipModal", 1,"当前已经是十二月份了！");
//    }else{
//        startCheckTime = parseInt(startCheckTime)+1;
//        $("#startCheckTime").val(startCheckTime);
//    }
    var date = new Date();
    var month  = date.getMonth()+1;
    selectMonth = month+1;
}
function getNextMonth(){
    var startCheckTime = $("#selectMonth").val();
    if( $("#selectMonth").val()==12){
        lwalert("tipModal", 1,"当前已经是十二月份了！");
    }else{
        startCheckTime = parseInt(startCheckTime)+1;
        $("#selectMonth").val(startCheckTime);
    }
}
function badProductionReasonChart(){
//    if(!pageJudge()){
//        //TODO 不能跳转
//    }else{
        var form = $("#badProductionReasonForm").serializeArray();
        var formData = formatFormJson(form);

        //alert(formData)
        $.ajax ( {
            type : "post",
            url : "../../../../"+ln_project+"/badProductionReason",
            data : {
                "method" : "queryBadProductionReasonData",
                "formData":formData
            },
            dataType : "text",
            async : false,
            success : function ( data ) {

                var temp = $.parseJSON(data);

                FusionCharts.ready(function () {
                    var analysisChart = new FusionCharts({
                        type: 'mscolumn3d',
                        renderAt: 'chart-container',
                        width: changeSize('chart-container'),
                        height: changeHeigth(),
                        dataFormat: 'json',
                        dataSource:temp
                    }).render();
                });
            }
        });
//    }
}

var width;
function changeSize(id) {

    width=$("#"+id).width()*(20/19)


    return width;
}
function changeHeigth() {


    return width;
}
function pageJudge(){
    var backValue;
    var selectMonth=$("#selectMonth").val();
    var centerid=$("#centerid").val();
    var selectMonthStartDay=$("#selectMonthStartDay").val();
    var selectMonthEndDay=$("#selectMonthEndDay").val();
    if (centerid==" "||centerid==null||centerid=="") {
        lwalert("tipModal", 1,"查询车间不能为空");
    }else if(selectMonth==null||selectMonth==""){
        if(selectMonthStartDay==""&&selectMonthEndDay==""){
            lwalert("tipModal", 1,"查询时间不能为空");
            backValue=false;
        }
        else{
            backValue = true;
        }
    }else{
        backValue=true;
    }
    return backValue;
}

var formatFormJson = function(formData) {
    var reg = /,$/gi;
    var data = "{";
    for (var i = 0; i < formData.length; i++) {
        data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
    }
    data = data.replace(reg, "");
    data += "}";
    return data;
}

/**
 *
 * 工作中心的拼接
 *
 * */
function loadCenter(){

    $.ajax ( {
        type : "post",
        url : "../../../../"+ln_project+"/badProductionReason",
        data : {
            "method" : "queryWorkCenter",
        },
        dataType : "text",
        async : false,
        success : function ( data ) {

            var json = eval("(" + data + ")")
            if (json.code==2) {
                lwalert("tipModal", 2,"系统长时间未操作，登录失效，请重新登录","forwardLogout()");
            }else{
                var center = json.workCenters;
                var html="";

                for (var i = 0;i<center.length;i++) {
                    /**
                     * option 的拼接
                     * */
                    html +="<option value="+ center[i].centerid+">"+ center[i].centername+"</option>";
                }
                $("#centerid").html(html);
            }
        }
    });

}


