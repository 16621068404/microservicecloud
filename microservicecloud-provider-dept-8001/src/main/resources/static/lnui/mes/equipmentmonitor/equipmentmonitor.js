$(function() {
    queryAllEquipmentList();
    setInterval(queryAllEquipmonitor,1000);
})
function queryAllEquipmentList(){
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/workCenter?method=queryAllEquipmentList",
        dataType : "text",
        async : false,
        success : function(data) {
           var tempData = $.parseJSON(data);
          console.info(tempData);
           var html="";
           for(var i=0;i<tempData.length;i++){
               if(i==0){
                   html += '<div class="col-sm-12 bg-light-blue-active color-palette">' + "工作中心：" + tempData[i].centername + '</div><div class="col-sm-12">&nbsp</div>';
                   html += "<div class='col-sm-3'>";
                   html += " <div class='info-box'>"
                   html += "  <span class='info-box-icon bg-default' id="+tempData[i].equipmentid+"><i class='fa fa-close' id="+tempData[i].equipmentid+tempData[i].serialnumber+"></i></span>";
                   html += "  <div class='info-box-contentv' style='width:100%'>";
                   html += "   <span class='info-box-text' style='font-size:18px'>&nbsp;"+(tempData[i].serialnumber.length>6?(tempData[i].serialnumber.substring(0,6)+'<br>&nbsp;'+tempData[i].serialnumber.substring(6,tempData[i].serialnumber.length)):tempData[i].serialnumber)+"</span>";
                   html += "   <span class='info-box-number' id="+tempData[i].equipmentid+tempData[i].barcode+">&nbsp;离线</span>";
                   html += "  </div>";
                   html += " </div>";
                   html += "</div>";
               }else if (i > 0
                       && null != tempData[i].centername
                       && null != tempData[i - 1].centername
                       && tempData[i].centername != tempData[i - 1].centername) {
                   html += '<div class="col-sm-12 bg-light-blue-active color-palette">' + "工作中心：" + tempData[i].centername + '</div><div class="col-sm-12">&nbsp</div>';
                   html += "<div class='col-sm-3'>";
                   html += " <div class='info-box'>"
                   html += "  <span class='info-box-icon bg-default' id="+tempData[i].equipmentid+"><i class='fa fa-close' id="+tempData[i].equipmentid+tempData[i].serialnumber+"></i></span>";
                   html += "  <div class='info-box-contentv' style='width:100%'>";
                   html += "   <span class='info-box-text' style='font-size:18px'>&nbsp;"+(tempData[i].serialnumber.length>6?(tempData[i].serialnumber.substring(0,6)+'<br>&nbsp;'+tempData[i].serialnumber.substring(6,tempData[i].serialnumber.length)):tempData[i].serialnumber)+"</span>";
                   html += "   <span class='info-box-number' id="+tempData[i].equipmentid+tempData[i].barcode+">&nbsp;离线</span>";

                   html += "  </div>";
                   html += " </div>";
                   html += "</div>";
               }else{
                   html += "<div class='col-sm-3'>";
                   html += " <div class='info-box'>"
                   html += "  <span class='info-box-icon bg-default' id="+tempData[i].equipmentid+"><i class='fa fa-close' id="+tempData[i].equipmentid+tempData[i].serialnumber+"></i></span>";
                   html += "  <div class='info-box-contentv'>";
                   html += "   <span class='info-box-text' style='font-size:18px'>&nbsp;"+(tempData[i].serialnumber.length>6?(tempData[i].serialnumber.substring(0,6)+'<br>&nbsp;'+tempData[i].serialnumber.substring(6,tempData[i].serialnumber.length)):tempData[i].serialnumber)+"</span>";
                   html += "   <span class='info-box-number' id="+tempData[i].equipmentid+tempData[i].barcode+">&nbsp;离线</span>";

                   html += "  </div>";
                   html += " </div>";
                   html += "</div>";
               }
           }
           $("#status").html(html);
        }
    });
}

var onlinecount=0;
var offlinecount=0;
function queryAllEquipmonitor(){
    onlinecount=0;
    offlinecount=0;
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/equipmentMonitor?method=queryEquipmentMonitor",
        dataType : "text",
        async : false,
        success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

		            var tempData = $.parseJSON(data);
		            for(var i=0;i<tempData.length;i++){
		                switch (tempData[i].equipStatus) {
		                case "running":{
		                    changeClass(tempData[i].equipmentid,"info-box-icon bg-green");
		                    changeClass(tempData[i].equipmentid+tempData[i].serialnumber,"fa fa-play");
		                    changetext(tempData[i].equipmentid+tempData[i].barcode,tempData[i].equipStatus);
		                    onlinecount++;
		                    break;
		                }
		                case "start":{
		                    changeClass(tempData[i].equipmentid,"info-box-icon bg-aqua");
		                    changeClass(tempData[i].equipmentid+tempData[i].serialnumber,"fa fa-forward");
		                    changetext(tempData[i].equipmentid+tempData[i].barcode,tempData[i].equipStatus);
		                    onlinecount++;
		                    break;
		                }
		                case "pause":{
		                    changeClass(tempData[i].equipmentid,"info-box-icon bg-yellow");
		                    changeClass(tempData[i].equipmentid+tempData[i].serialnumber,"fa fa-pause");
		                    changetext(tempData[i].equipmentid+tempData[i].barcode,tempData[i].equipStatus+"["+tempData[i].reason+"]");
		                    onlinecount++;
		                    break;
		                }
		                case "error":{
		                    changeClass(tempData[i].equipmentid,"info-box-icon bg-red");
		                    changeClass(tempData[i].equipmentid+tempData[i].serialnumber,"fa fa-warning");
		                    changetext(tempData[i].equipmentid+tempData[i].barcode,tempData[i].equipStatus);
		                    onlinecount++;
		                    break;
		                }
		                case "stop":{
		                	changeClass(tempData[i].equipmentid,"info-box-icon bg-default");
		                    changeClass(tempData[i].equipmentid+tempData[i].serialnumber,"fa fa-power-off");
		                    changetext(tempData[i].equipmentid+tempData[i].barcode,tempData[i].equipStatus);
		                    onlinecount++;
		                    break;
		                }
		                case "quit":{
                            changeClass(tempData[i].equipmentid,"info-box-icon bg-default");
                            changeClass(tempData[i].equipmentid+tempData[i].serialnumber,"fa fa-close");
                            changetext(tempData[i].equipmentid+tempData[i].barcode,"离线");
                            offlinecount++;
                            break;
                        }
//		                case "12":{
//                          changeClass(tempData[i].equipmentid,"info-box-icon bg-green");
//                          changeClass(tempData[i].serialnumber,"fa fa-play");
//                          changetext(tempData[i].barcode,statusConvertToName(tempData[i].equipStatus));
//                          onlinecount++;
//                          break;
//                      }
//		                case "13":{
//                            changeClass(tempData[i].equipmentid,"info-box-icon bg-yellow");
//                            changeClass(tempData[i].serialnumber,"fa fa-pause");
//                            changetext(tempData[i].barcode,statusConvertToName(tempData[i].equipStatus));
//                            onlinecount++;
//                            break;
//                        }
		                default:{
		                    changeClass(tempData[i].equipmentid,"info-box-icon bg-default");
		                    changeClass(tempData[i].equipmentid+tempData[i].serialnumber,"fa fa-close");
		                    changetext(tempData[i].equipmentid+tempData[i].barcode,"离线");
		                    offlinecount++;
		                    break;
		                }
		                }
		            }

			}
        }
    });
}

function statusConvertToName(status){

    var result = "";
        switch (status) {
        case "12":
            result = "正常";
          break;
        case "13":
            result = "停机";
          break;
        default:
            result = "正常";
        break;
        }
    return result;
}
function changeClass(id,style){

    $("#"+id).attr("class",style);
}
function changetext(id,text){
    $("#"+id).html("&nbsp;"+text);
}