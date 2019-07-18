$(function() {
	com.leanway.initTimePickYmdForMoreId("#time");
	var date = new Date();
	$("#time").val(date.Format("yyyy-MM-dd"));
	ajaxCompanyInfo();
});

function ajaxCompanyInfo(){
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/company",
		data : {
			"method" : "queryCompanyInfo",
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				var tempData = $.parseJSON(data);
				setTableValue(tempData);

			}
		}
	});
}

function setTableValue(data){
	tableBodyHtml="";
	tableBodyHtml += " <tr>";
	tableBodyHtml += "  <td>"+data.compName+"</td>";
	tableBodyHtml += "  <td></td>"
	tableBodyHtml += " </tr>";
	$("#tableBody").html(tableBodyHtml);
}

function pull(){
    showMask("mask");
	setTimeout(pullEnd, 2000);
}
function pullEnd(){
    hideMask("mask");  
	lwalert("tipModal", 1, "拉动成功!");
}