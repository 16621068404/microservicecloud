$(function() {

    // 时间初始化
    com.leanway.initTimePickYmdForMoreId("#starttime");
    com.leanway.initTimePickYmdForMoreId("#endtime");

    com.leanway.loadTags();

    var date = new Date();
    date.add("d",1);
    $("#starttime").val(date.Format("yyyy-MM-dd"));
    $("#endtime").val(date.Format("yyyy-MM-dd"));
    com.leanway.initSelect2("#productionchildsearchno", "../../../../"+ln_project+"/workorderbarcodeprint?method=queryDispatchOrder", "搜索生产子查询号",true);
    com.leanway.initSelect2("#productortypeid", "../../../"+ln_project+"/producttype?method=queryProtypeBySelect", "搜索产品类型",true);
    com.leanway.initSelect2("#productorid", "../../../"+ln_project+"/productors?method=queryProductorsByProductorType", "搜索产品",true);
    queryWorkCenterGroup();
    $("input[name=modetype]").click(function(){
        viewIframeToPage();
    });
    $("input[name=status]").click(function(){
        viewIframeToPage();
    });
    $("input[name=printstatus]").click(function(){
        viewIframeToPage();
    });
});
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

function queryWorkCenter(){

    var groupid = $("#groupid").val();

    var type=0;
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/workCenter",
        data : {
            "method" : "queryWorkCenterByGroup",
            "groupid":groupid,
            "type":type
        },
        dataType : "text",
        success : function(data) {

            var flag =  com.leanway.checkLogind(data);
            if(flag){
                $('#centerid').removeAttr("disabled");
                var result = eval("(" + data + ")");
                var html='<option value="">--机器工作中心--</option>';
                for(var i=0; i<result.length;i++){

                    html+='<option value="'+result[i].centerid+'">'+result[i].shorname+'</option>'

                }
                $("#centerid").html(html);
            }
        },
        error : function(data) {
            lwalert("tipModal", 1, "error！");
        }
    });
}
function queryArtWorkCenter(){
    var groupid = $("#groupid").val();
    var type=1;
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/workCenter",
        data : {
            "method" : "queryWorkCenterByGroup",
            "groupid":groupid,
            "type":type
        },
        dataType : "text",
        success : function(data) {
            var flag =  com.leanway.checkLogind(data);
            if(flag){
                $('#personcenterid').removeAttr("disabled");
                var result = eval("(" + data + ")");
                var html='<option value="">--人工工作中心--</option>';
                for(var i=0; i<result.length;i++){

                    html+='<option value="'+result[i].centerid+'">'+result[i].shorname+'</option>'

                }
                $("#personcenterid").html(html);
            }
        },
        error : function(data) {
            lwalert("tipModal", 1, "error！");
        }
    });
}
function queryEquipment(){
    var centerid = $("#centerid").val();
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/workCenter",
        data : {
            "method" : "queryEquipmentByCenterid",
            "centerid":centerid,
        },
        dataType : "text",
        success : function(data) {
            var flag =  com.leanway.checkLogind(data);
            if(flag){
                $('#equipmentid').removeAttr("disabled");
                var result = eval("(" + data + ")");
                var html='<option value="">--工作中心台账--</option>';
                for(var i=0; i<result.length;i++){

                    html+='<option value="'+result[i].equipmentid+'">'+result[i].equipmentname+'</option>'

                }
                $("#equipmentid").html(html);
            }
        },
        error : function(data) {
            lwalert("tipModal", 1, "error！");
        }
    });
}
function queryArtEquipment(){
    var centerid = $("#personcenterid").val();
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/workCenter",
        data : {
            "method" : "queryEquipmentByCenterid",
            "centerid":centerid,
        },
        dataType : "text",
        success : function(data) {
            var flag =  com.leanway.checkLogind(data);
            if(flag){
                $('#personequipmentid').removeAttr("disabled");
                var result = eval("(" + data + ")");
                var html='<option value="">--雇员--</option>';
                for(var i=0; i<result.length;i++){

                    html+='<option value="'+result[i].employeeid+'">'+result[i].equipmentname+'</option>'

                }
                $("#personequipmentid").html(html);
            }
        },
        error : function(data) {
            lwalert("tipModal", 1, "error！");
        }
    });
}
$("#productortypeid").on("select2:select", function(e) {
    var productortypeid = $("#productortypeid").val();
    com.leanway.initSelect2("#productorid", "../../../"+ln_project+"/productors?method=queryProductorsByProductorType&productortypeid="+productortypeid, "搜索产品",true);
});
var result;
function  searchBomTrackResult(){
	if(frontJudge()){

    showMask("mask");
    var productionchildsearchno = $("#productionchildsearchno").val();
    var productortypeid = $("#productortypeid").val();
    var productorid = $("#productorid").val();
    var modetype = $("input[name='modetype']:checked").val();
    var status = $("input[name='status']:checked").val();
    var printstatus = $("input[name='printstatus']:checked").val();

    var form = $("#bomDispatchingPrintForm").serializeArray();
    var formData = formatFormJson(form);
    $.ajax({
        type : "post",
        traditional: true,
        url : "../../../../"+ln_project+"/picking",
        data : {
            "method" : "queryBomDispatching",
            "productionchildsearchno":productionchildsearchno,
            "productortypeid":productortypeid,
            "productorid":productorid,
            "modetype":modetype,
            "status":status,
            "printstatus":printstatus,
            "formData":formData
        },
        dataType : "text",
       // async : false,
        success : function(data) {
            var flag =  com.leanway.checkLogind(data);
            if(flag){
                result = data;
                var tempdata = $.parseJSON(data);
                if(tempdata.length!=0){
                    tableIframe.window.setTableValue(tempdata);

                	$("#printBarcode").show();
                }else{
                	$("#printarea").html("");
                	$("#printBarcode").hide();
                	lwalert("tipModal", 1, "无数据，请重新检查查询条件！");
                }

                hideMask("mask");
            }
        },
        error : function(data) {

        }
    });
	}
}

function frontJudge() {
	var backValue = false;
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();

	if (starttime == null || starttime == "") {
        lwalert("tipModal", 1, "请填写开始时间！");
    }else if (endtime == null || endtime == "") {
	    lwalert("tipModal", 1, "请填写结束时间！");
	}else if (starttime > endtime) {
		lwalert("tipModal", 1, "开始时间不能大于结束时间！");
	} else
		backValue = true;
	return backValue;
}

function setTableValue(data){
    var btype = "code128";
    var settings = {
            output:"css",
            bgColor: "#FFFFFF",
            color: "#000000",
            barHeight: "50" ,
            moduleSize: "5",
            posX: "10",
            posY: "20",
            addQuietZone: "1"
    };
    var tableBodyHtml="";
    var dateMap = new Map();
    var dataMap2 = new Map();
    for ( var i in data) {
      if (dateMap.containsKey(data[i].tracknumber)) {
          var count = dateMap.get(data[i].tracknumber);
          dateMap.remove(data[i].tracknumber);
          dateMap.put(data[i].tracknumber, count + 1);
      } else {
          dateMap.put(data[i].tracknumber, 1);
      }
    }
    for(var i=0;i<data.length;i++){
        if (i == 0) {

            tableBodyHtml += "<table class='table table-striped table-bordered table-hover'>";
            tableBodyHtml += "<tr>";
            tableBodyHtml += "<td >备料单号</td>";
            tableBodyHtml += "<td >派工单号</td>";
            tableBodyHtml += "<td>生产订单号（产品）</td>";
            tableBodyHtml += "<td>设备台账</td>";
            tableBodyHtml += "<td>调整开始日期</td>";
            tableBodyHtml += "<td >配送产品名称</td>";
            tableBodyHtml += "<td >配送产品编码</td>";
            if($("input[name='status']:checked").val()==0){
                tableBodyHtml += " <td>领料数量</td>";
                tableBodyHtml += " <td>领料时间</td>";
            }else{
                tableBodyHtml += " <td>备料数量</td>";
                tableBodyHtml += " <td>备料时间</td>";
            }

            tableBodyHtml += " <td>条码</td>";
            tableBodyHtml += " </tr>";

        }
        if (i > 0) {
            if (i%5==0) {
                tableBodyHtml += "</table>";
                tableBodyHtml += "<p style='page-break-after:always;'></p>";
                tableBodyHtml += "<table class='table table-striped table-bordered table-hover'>";
                tableBodyHtml += "<tr>";
                tableBodyHtml += "<td>备料单号</td>";
                tableBodyHtml += "<td>派工单号</td>";
                tableBodyHtml += "<td>生产订单号（产品）</td>";
                tableBodyHtml += "<td>设备台账</td>";
                tableBodyHtml += "<td>调整开始日期</td>";
                tableBodyHtml += "<td>配送产品名称</td>";
                tableBodyHtml += "<td>配送产品编码</td>";
                if($("input[name='status']:checked").val()==0){
                    tableBodyHtml += " <td>领料数量</td>";
                    tableBodyHtml += " <td>领料时间</td>";
                }else{
                    tableBodyHtml += " <td>备料数量</td>";
                    tableBodyHtml += " <td>备料时间</td>";
                }
                tableBodyHtml += " <td>条码</td>";
                tableBodyHtml += " </tr>";
            }
        }
          tableBodyHtml += " <tr>";
          if (dateMap.containsKey(data[i].tracknumber)) {
              var datacount=1;
              if(dateMap.get(data[i].tracknumber)>1){
                  if(dateMap.get(data[i].tracknumber)>(5-(i%5))){
                      datacount = 5-(i%5);
                  }
              }
              var tdStr =  "<td rowspan='" + datacount + "' ><div style= 'text-align:center;font-size:10px'>"+data[i].tracknumber+"</div><div id='tracknumber" + i + "'>"+data[i].barcode+"</div></td>"
              var tracknumbercount = dateMap.get(data[i].tracknumber);
              dateMap.remove(data[i].tracknumber);
              dataMap2.put(data[i].tracknumber,tracknumbercount-(5-(i%5)));
              tableBodyHtml += tdStr;
          }else if(dataMap2.containsKey(data[i].tracknumber)&&(i%5==0)&&i!=0){
              var datacount=1;
              if(dataMap2.get(data[i].tracknumber)>1){
                  if(dataMap2.get(data[i].tracknumber)>5){
                      datacount = 5;
                  }else{
                      datacount = dataMap2.get(data[i].tracknumber);
                  }
              }
              var tdStr =  "<td rowspan='" + datacount + "' ><div style= 'text-align:center;font-size:10px'>"+data[i].tracknumber+"</div><div id='tracknumber" + i + "'>"+data[i].barcode+"</div></td>"
              var tracknumbercount = dataMap2.get(data[i].tracknumber);
              dataMap2.remove(data[i].tracknumber);
              dataMap2.put(data[i].tracknumber,tracknumbercount-5);
              tableBodyHtml += tdStr;
          }
        tableBodyHtml += "<td>"+data[i].dispatchingnumber+"</td>";
        tableBodyHtml += "<td>"+data[i].productionnumber+"<br>("+data[i].productordesc+")</td>";
        tableBodyHtml += "<td>"+data[i].equipmentname+"</td>";
        tableBodyHtml += "<td>"+data[i].adjuststarttime+"</td>";
        tableBodyHtml += "<td>"+data[i].shortname+"</td>";
        tableBodyHtml += "<td>"+data[i].productorname+"</td>";
        if($("input[name='status']:checked").val()==0){
            tableBodyHtml += " <td>"+data[i].pickingcount+"</td>";
            tableBodyHtml += " <td>"+data[i].pickingtime+"</td>";
        }else{
            tableBodyHtml += " <td>"+data[i].stockcount+"</td>";
            tableBodyHtml += " <td>"+data[i].stocktime+"</td>";
        }

        tableBodyHtml += " <td ><div id='barcode" + i + "'>"+data[i].detailBarcode+"<div></td>";
        tableBodyHtml += " </tr>";

    }
    $("#printarea").html(tableBodyHtml);
    for (var j in data) {
        var detailValue =data[j].detailBarcode;
        var value = data[j].barcode;
        if(detailValue!=undefined){
            $("#barcode"+j).barcode(detailValue, btype, settings);
        }
        $("#tracknumber"+j).barcode(value, btype, settings);
    }
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

function printbutton(){
    tableIframe.window.printbutton();


    lwalert("tipModal", 2, "您确定已打印成功?","updateBomTackPrintStatus()");
}
function updateBomTackPrintStatus(){
    var resultData = "{\"bomTacklist\":"+result+"}"
    console.info(resultData);
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/picking",
        data : {
            "method" : "updateBomTrackPrintStatus",
            "formData" : resultData,
        },
        dataType : "text",
        success : function(data) {
        },
        error : function(data) {
            lwalert("tipModal", 1, "error！");
        }
    });
}

function viewIframeToPage(){
    if (!frontJudge()) {

    } else {
        $("#viewiframe").empty();
        var div = document.getElementById("viewiframe");
        var iframe = document.createElement("iframe");
        iframe.src = 'windowHtml.html';
        iframe.id = 'tableIframe';
        iframe.name = 'tableIframe';
        iframe.scrolling = 'yes';
        iframe.allowtransparency = 'yes';
        iframe.style.width = "100%";
        iframe.style.height = changeSize()+"px";
        iframe.style.border = "none";
        div.appendChild(iframe);
    }
}

var width;
function changeSize() {
    var windowheight = $(window).height();
    var titleheight = $("#titleheight").outerHeight(true);
    var formheightclass = $("#formheightclass").outerHeight(true);
    width = (windowheight -titleheight -formheightclass)*0.85;
    return width;
}
