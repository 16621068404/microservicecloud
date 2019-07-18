var clicktime = new Date();
var opeMethod = "addPurchaseOrder";
var purchaseOrderTable;
var purchaseProductorTable;
var readOnlyObj = [{"id":"isexcess","type":"radio"}];
var reg = /,$/gi;

$ ( function ( ) {

	// 初始化对象
	com.leanway.loadTags();

    queryAllMap();
} );

function queryAllMap() {
    $.ajax({
        url: "../../../../" + ln_project + "/salesOrderAndShipments",
        type: "post",
        data: {
            "method" : "querySalesOrderAndShipments",
			"compid" : "123"
        },
        dataType: "json",
        success: function(data){
            var flag =  com.leanway.checkLogind(data);
            if (flag) {
                var tbody = document.querySelector("tbody");
                var trtr = document.querySelector("#trtr");

                var temp = 0;
                for(var i=0;i<data.data.length;i++){
                    if (data.data[i].detailList.length > temp){
                        temp = data.data[i].detailList.length;
                    }
                }
                if (!temp) {
                    temp = 1;
                }
                for(var i=0;i<data.data.length;i++){
                    var contractname = data.data[i].contractname ? data.data[i].contractname:"";
                    var code         = data.data[i].code ? data.data[i].code:"";
                    var contacts     = data.data[i].contacts ? data.data[i].contacts:"";
                    var linkmethod   = data.data[i].linkmethod ? data.data[i].linkmethod:"";
                    var standard     = data.data[i].standard ? data.data[i].standard:"";
                    var drawcode     = data.data[i].drawcode ? data.data[i].drawcode:"";
                    var performance  = data.data[i].performance ? data.data[i].performance:"";
                    var number       = data.data[i].number ? data.data[i].number:"";
                    var sendcount    = data.data[i].sendcount ? data.data[i].sendcount:"";
                    var cansendcount = data.data[i].cansendcount ? data.data[i].cansendcount:"";
                    var settle       = data.data[i].settle ? data.data[i].settle:"";
                    var comments     = data.data[i].comments ? data.data[i].comments:"";
                    var releasedate  = data.data[i].releasedate ? data.data[i].releasedate:"";
                    var requestdate  = data.data[i].requestdate ? data.data[i].requestdate:"";

                    var str = "";
                    str += "<tr><td></td><td>" + contractname + "</td><td>" + code + "</td><td>" + contacts + "</td><td>" + linkmethod + "</td><td>" + standard + "</td><td>" + drawcode + "</td><td>" + performance + "</td><td>" + number + "</td><td>" + sendcount + "</td><td>" + cansendcount + "</td><td>" + settle + "</td>";
                    for (let j = 0; j < temp; j++){

                        if (data.data[i].detailList[j] != undefined){
                            var count  = data.data[i].detailList[j].count ? data.data[i].detailList[j].count:"";
                            var postdate  = data.data[i].detailList[j].postdate ? data.data[i].detailList[j].postdate:"";
                            str += "<td>" + count + "</td><td>" + postdate + "</td>";
                        } else {
                            str += "<td>" + "" + "</td><td>" + "" + "</td>";
                        }
                    }
                    str += "<td>" + releasedate + "</td><td>" + requestdate + "</td><td>" + "" + "</td><td>" + comments + "</td></tr>";
                    tbody.innerHTML += str;
                }
                var a =  temp * 2 + "";
                $("#trtd").attr("colspan", a);
                //  批次明细
                for (let i = 0; i < temp; i++) {
                    trtr.innerHTML += "<th>数量</th><th>日期</th>";
                }
                if (data.data.length == 0){
                    tbody.innerHTML += "<tr><td colspan='18' style='text-align: center'>没有数据！</td></tr>";
                }
                if (temp > 3){
                    var width = temp-3;
                    var table = document.getElementById("purchaseProductorTable");
                    table.style.width = width * 400 + 2000 + "px";
                }
            }
        }
    });
}

// 获取json 的长度
function getJsonLength(jsonData) {
    var length = 0;
    for(var ever in jsonData) {
        length++;
    }
    return length;
}