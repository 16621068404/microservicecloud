
$(function() {
    parent.searchBomTrackResult();
});

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
    	var equipmentname = data[i].equipmentname;
    	
		if(equipmentname==null||equipmentname==""){
			equipmentname = data[i].centername;
		}
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
            if (i%7==0) {
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
                  if(dateMap.get(data[i].tracknumber)>(7-(i%7))){
                      datacount = 7-(i%7);
                  }else{
                      datacount = dateMap.get(data[i].tracknumber);
                  }
              }
              var tdStr =  "<td rowspan='" + datacount + "' ><div style= 'text-align:center;font-size:10px'>"+data[i].tracknumber+"</div><div id='tracknumber" + i + "'>"+data[i].barcode+"</div></td>"
              var tracknumbercount = dateMap.get(data[i].tracknumber);
              dateMap.remove(data[i].tracknumber);
              dataMap2.put(data[i].tracknumber,tracknumbercount-datacount);
              tableBodyHtml += tdStr;
          }else if(dataMap2.containsKey(data[i].tracknumber)&&(i%7==0)&&i!=0){
              var datacount=1;
              if(dataMap2.get(data[i].tracknumber)>1){
                  if(dataMap2.get(data[i].tracknumber)>7){
                      datacount = 7;
                  }else{
                      datacount = dataMap2.get(data[i].tracknumber);
                  }
              }
              var tdStr =  "<td rowspan='" + datacount + "' ><div style= 'text-align:center;font-size:10px'>"+data[i].tracknumber+"</div><div id='tracknumber" + i + "'>"+data[i].barcode+"</div></td>"
              var tracknumbercount = dataMap2.get(data[i].tracknumber);
              dataMap2.remove(data[i].tracknumber);
              dataMap2.put(data[i].tracknumber,tracknumbercount-datacount);
              tableBodyHtml += tdStr;
          }
        tableBodyHtml += "<td>"+data[i].dispatchingnumber+"</td>";
        tableBodyHtml += "<td>"+data[i].productionnumber+"<br>("+data[i].productordesc+")</td>";
        tableBodyHtml += "<td>"+equipmentname+"</td>";
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

function printbutton(){
    var bdhtml=window.document.body.innerHTML;
    window.document.body.innerHTML=$('#printarea').html();
    window.print();
    window.document.body.innerHTML=bdhtml;

}

