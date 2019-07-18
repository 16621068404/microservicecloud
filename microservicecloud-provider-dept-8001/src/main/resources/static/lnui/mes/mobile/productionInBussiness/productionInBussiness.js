

$(function() {

    //加载车间
    loadCenter();

    //页面设置只读
    getneedAndUnneedChartData();
});

function getMonth(){
    var date = new Date();
    var month  = date.getMonth()+1;
    $("#selectMonth").val(month);
    document.getElementById("selectMonth").readOnly = true;
}
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
/**
 *
 * 生产在制品计划匹配表
 *
 * 获取内部数据的方法
 *
 * */
function getneedAndUnneedChartData(){
        var form = $("#productionInBussinessForm").serializeArray();
        var formData = formatFormJson(form);
        $.ajax ( {
            type : "post",
            url : "../../../../"+ln_project+"/productionInBussiness",
            data : {
                "method" : "queryNeedAndUnneedData",
                "formData":formData
            },
            dataType : "text",
            async : false,
            success : function ( data ) {
                var temp = $.parseJSON(data);
                if (temp.code==2) {
                    lwalert("tipModal", 2,"系统长时间未操作，登录失效，请重新登录","forwardLogout()");
                }else{
                    //需求和非需求对比图
                    needAndUnneedChart(temp.productionInBussinessCompare);
                    //实际需求表
                    needChart(temp.productionInBussinessInRealNeed);
                    //非需求表
                    unneedChart(temp.productionInBussinessNotInNeed);
                }
            }
        });
}

//最后判断
function theEndJudge(){
    var backBackValue=0;
    var workRange=$("#workRange").val();
    if("2"==workRange){
        if(judgeWorkRange()){
            if (transitionFunction()){
                backBackValue=1;
            }
        }
    }else if (transitionFunction()){
        backBackValue=1;
    }

    return backBackValue;

}

function transitionFunction(){
    var selectWay=$("#selectWay").val();
    var backBackValue=0;
    if("1"==selectWay){
        if(judgeEndWeek()){
            backBackValue=1;
        }
    }else if("2"==selectWay){
        if(judgeEndMonth()){
            backBackValue=1;
        }
    }else alert("请选择查询方式");
    return backBackValue;
}

//最后的工作中心判断
function judgeWorkRange(){
    var backValue=0;
    var centerid=$("#centerid").val();
    if("请选择"==centerid||" "==centerid){
        alert("工作中心不能为空");
    }else backValue=1;

    return backValue;
}

//最后的周判断
function judgeEndWeek(){
    var backValue=0;
    var selectWeek=$("#selectWeek").val();
    var selectWeekStartDay=$("#selectWeekStartDay").val();
    var selectWeekEndDay=$("#selectWeekEndDay").val();
    if(selectWeek==""&&selectWeekStartDay==""&&selectWeekEndDay==""){
        alert("请选择周期日期");
    }else backValue=1;

    return backValue;
}

//最后的月份判断
function judgeEndMonth(){
    var backValue=0;
    var selectMonth=$("#selectMonth").val();
    var selectMonthStartDay=$("#selectMonthStartDay").val();
    var selectMonthEndDay=$("#selectMonthEndDay").val();
    if(selectMonth==""&&selectMonthStartDay==""&&selectMonthEndDay==""){
        alert("请选择月份日期");
    }else backValue=1;
    return backValue;
}

//需求与非需求对比图
function needAndUnneedChart(temp){
    FusionCharts.ready(function () {
        var ageGroupChart = new FusionCharts({
            type: 'pie3d',
            renderAt: 'chart-container',
            width: changeSize('chart-container'),
            height: changeHeigth(),
            dataFormat: 'json',
            dataSource:temp

        }).render();
    });
}

//需求相关表
function needChart(temp){
    FusionCharts.ready(function () {
        var ageGroupChart = new FusionCharts({
            type: 'bar3d',
            renderAt: 'chart-container2',
            width: changeSize('chart-container2'),
            height: changeHeigth(),
            dataFormat: 'json',
            dataSource:temp

        }).render();
    });
}

//非需求相关表
function unneedChart(temp){
    FusionCharts.ready(function () {
        var ageGroupChart = new FusionCharts({
            type: 'bar3d',
            renderAt: 'chart-container3',
            width: changeSize('chart-container3'),
            height: changeHeigth(),
            dataFormat: 'json',
            dataSource:temp

        }).render();
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
/**
 *
 * 工作中心的拼接
 *
 * */
function loadCenter(){

    $.ajax ( {
        type : "post",
        url : "../../../../"+ln_project+"/workCenter",
        data : {
            "method" : "queryWorkCenterList",
        },
        dataType : "text",
        async : false,
        success : function ( data ) {

            var json = eval("(" + data + ")")

            if (json.code==2) {
                lwalert("tipModal", 2,"系统长时间未操作，登录失效，请重新登录","forwardLogout()");
            }else{
                var center=json.data;

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

/**
 *
 * json数据的转化
 *
 * */
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

//初始化时间
function initDate(id) {
    $(id).datetimepicker({
         language:  'zh-CN',
            weekStart: 7,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            minView: 2,
            forceParse: 0,
            format: 'yyyy-mm-dd'
    });
}



/**
 *
 * 页面disabled
 *
 * */
var pageDisabled = function(form, obj) {

    var formArray = form.split(",");

    if (formArray.length > 0) {

        for (var i = 0; i < formArray.length; i++) {
            // input 标签
            $("#" + formArray[i] + " input").prop("disabled", true);
            // select 标签
            $("#" + formArray[i] + " select").prop("disabled", true);
        }

    }

    if (obj != undefined && typeof (obj) != "undefined") {

        for (var i = 0; i < obj.length; i++) {

            if (obj[i].type == "input" || obj[i].type == "textarea") {

                $("#" + obj[i].id).prop("readonly", true);

            } else if (obj[i].type == "button" || obj[i].type == "select") {

                $("#" + obj[i].id).prop("disabled", true);

            }
        }
    }

}
