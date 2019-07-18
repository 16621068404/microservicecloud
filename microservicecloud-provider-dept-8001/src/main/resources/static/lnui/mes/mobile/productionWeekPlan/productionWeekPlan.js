


$(function() {
    //加载工作中心
    loadCenter();
    productionMonthPlanChart();
});

var starttcheckime;
function getLastMonth(){
    var date = new Date();
    var month  = date.getMonth()+1;
    starttcheckime = month-1;
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
    starttcheckime = month+1;
}

/*function productionMonthPlanChart(){

    var selectWeek=$("#selectWeek").val();
    var centerid=$("#centerid").val();
    if(null==selectWeek||"请选择"==centerid||""==selectWeek||" "==centerid){

        alert("查询条件不能为空！");

    }
    else {

        var form = $("#productionMonthPlanForm").serializeArray();
        var formData = formatFormJson(form);

        $.ajax ( {
            type : "post",
            url : "../../../productionMonthPlan",
            data : {
                "method" : "queryMonthPlanChartData",
                "formData":formData
            },
            dataType : "text",
            async : false,
            success : function ( data ) {

                var temp = $.parseJSON(data);

                FusionCharts.ready(function () {

                    var analysisChart = new FusionCharts({

                        type: 'stackedColumn3DLine',
                        renderAt: 'chart-container',
                        width: '500',
                        height: '350',
                        dataFormat: 'json',
                        dataSource:temp

                    }).render();
                });
            }
        });
    }
}*/

function productionMonthPlanChart(){


        var form = $("#productionMonthPlanForm").serializeArray();
        var formData = formatFormJson(form);
        $.ajax ( {
            type : "post",
            url : "../../../../"+ln_project+"/productionMonthPlan",
            data : {
                "method" : "queryMonthPlanChartData",
                "formData":formData
            },
            dataType : "text",
            async : false,
            success : function ( data ) {

                var temp = $.parseJSON(data);
                if (temp.code==2) {
                    lwalert("tipModal", 2,"系统长时间未操作，登录失效，请重新登录","forwardLogout()");
                }else if(temp.code==1){
                    lwalert("tipModal", 1,"您的身份不能够查到相关数据！");
                }else{
                    FusionCharts.ready(function () {

                        var analysisChart = new FusionCharts({

                            type: 'stackedColumn3DLine',
                            renderAt: 'chart-container',
                            width: changeSize('chart-container'),
                            height: changeHeigth(),
                            dataFormat: 'json',
                            dataSource:temp
                        }).render();
                    });
                }
            },
            error : function ( data ) {
//              alert("error");
                lwalert("tipModal", 1,"error！");
            }
        });



}
var width;
function changeSize(id) {

    width=$("#"+id).width()*(20/19)


    return width;
}
function changeHeigth() {


    return width;
}
//最后判断
function theEndJudge(){

    var backBacklue;

    var centerid=$("#centerid").val();
    var selectWeekType=$("#selectWeekType").val();
    var selectWeek=$("#selectWeek").val();
    var selectWeekStartDay=$("#selectWeekStartDay").val();
    var selectWeekEndDay=$("#selectWeekEndDay").val();
    if("请选择"==centerid||" "==centerid){

//      alert("工作中心不能为空");
        lwalert("tipModal", 1,"工作中心不能为空！");
        backBacklue=0;
    }else if("1"==selectWeekType){
        if(" "==selectWeek||null==selectWeek||""==selectWeek){
//          alert("请选择传统周期区间");
            lwalert("tipModal", 1,"请选择传统周期区间！");
            backBacklue=0;
        }else backBacklue=1;
    }else if("2"==selectWeekType){
        if(" "==selectWeekStartDay&&" "==selectWeekEndDay||""==selectWeekStartDay&&""==selectWeekEndDay){
//          alert("请选择自定义周期");
            lwalert("tipModal", 1,"请选择自定义周期！");
            backBacklue=0;

        }else backBacklue=1;
    }else backBacklue=1;

    return backBacklue;

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

            if(json.code==2){
                lwalert("tipModal", 2,"系统长时间未操作，登录失效，请重新登录","forwardLogout()");
            }/*else if(json.code==1){
                lwalert("tipModal", 1,"您的身份不能够查到相关数据！");
            }*/else{
                var center =json.workCenters;
//                var html="<option value=' '>请选择</option>";
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

