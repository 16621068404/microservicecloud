


$(function() {


    // productionWorkCenterChart();

    //加载工作中心
    loadWorkCenter();
    loadEquip();
    productionWorkCenterChart();
});

function getMonth(){
    var date = new Date();
    var month  = date.getMonth()+1;
    $("#startCheckTime").val(month);
    document.getElementById("startCheckTime").readOnly = true;
}
var startCheckTime;
function getLastMonth(){
    var date = new Date();
    var month  = date.getMonth()+1;
    startCheckTime = month-1;
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
    startCheckTime = month+1;
}
function productionWorkCenterChart(){


    var form = $("#productionEquipForm").serializeArray();
    var formData = formatFormJson(form);

    var starttime=$("#startCheckTime").val();
    var workshop=$("#workshop").val();
    var centerid=$("#centerid").val();


    if(centerid==null&&workshop==null){
        lwalert("tipModal", 1,"请在车间和设备之间至少选择一种进行查询！");
    }
    else{
        $.ajax ( {
            type : "post",
            url : "../../../../"+ln_project+"/productionEquip",
            data : {

                "method" : "queryProductionWorkCenterChartData",
                formData:formData

            },
            dataType : "text",
            async : false,
            success : function ( data ) {

                var temp = $.parseJSON(data);
                if (temp.code==2) {
                    lwalert("tipModal", 2, "在线时间过长,为安全请选择确定进行重新登入！","forwardLogout()");
                }else if (temp.code==1) {
                    lwalert("tipModal", 1,"您的身份不能够查到相关数据！");
                }else{
                    FusionCharts.ready(function () {
                        var analysisChart = new FusionCharts({
                            type: 'stackedColumn3DLine',
                            renderAt: 'workcenter-container',
                            width: changeSize("workcenter-container"),
                            height: changeHeigth(),
                            dataFormat: 'json',
                            dataSource:temp
                        }).render();
                    });
                }
            }
        });
    }

}

var width;
function changeSize(id) {

    width=$("#"+id).width()*(20/19)


    return width;
}
function changeHeigth() {


    return width*(4/3);
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
 * 加载工作中心
 *
 *
 * */
function loadWorkCenter(){

    $.ajax ( {
        type : "post",
        url : "../../../../"+ln_project+"/workCenter",
        data : {
            "method" : "queryWorkCenterGroupList",
        },
        dataType : "text",
        async : false,
        success : function ( data ) {

            var json = eval("(" + data + ")")
            if (json.code==2) {
                lwalert("tipModal", 2, "在线时间过长,为安全请选择确定进行重新登入！","forwardLogout()");
            }else{
                var workshopCenter=json.workCenterGroupResult;

//                var html="<option value=' '>请选择</option>";
                var html="";
                for (var i = 0;i<workshopCenter.length;i++) {
                    /**
                     * option 的拼接
                     * */
                    html +="<option value="+ workshopCenter[i].groupid+">"+ workshopCenter[i].groupname+"</option>";
                }
                $("#workshop").html(html);
            }
        }
    });

}

/**
 *
 * 根据工作中心加载设备名称
 *
 * */
function loadEquip(){

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
                lwalert("tipModal", 2, "在线时间过长,为安全请选择确定进行重新登入！","forwardLogout()");
            }else{
                var equipment=json.data;

                var html="<option value=' '>请选择</option>";

                for (var i = 0;i<equipment.length;i++) {
                    /**
                     * option 的拼接
                     * */
                    html +="<option value="+ equipment[i].centerid+">"+ equipment[i].centername+"</option>";
                }
                $("#centerid").html(html);
            }
        }
    });

}

