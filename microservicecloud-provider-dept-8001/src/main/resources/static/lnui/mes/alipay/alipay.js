
var sessionid;
$(function() {

	  getSessionid();

})
function getSessionid(){
	$.ajax ( {
		type : "get",
		url : "../../../"+ln_project+"/alipay",
		data : {
			"method" : "getSessionid",

		},
		dataType : "json",

		async : false,
		success : function ( data ) {
			 var flag =  com.leanway.checkLogind(data);
				if(flag){
					sessionid = data.value;
				}

		}
	});
}

function countMoney(id,count){

	
	switch (id){
	 case "count1":{

		 var price =  $("#price1").val();
		 if(count=="add"){
			 $("#sumcount").val(Number($("#sumcount").val())+Number(price));
		 }else{
			 $("#sumcount").val(Number($("#sumcount").val())-Number(price));
		 }

         break;
     }
	 case "count2":{

		 var price =  $("#price2").val();
		 if(count=="add"){
			 $("#sumcount").val(Number($("#sumcount").val())+Number(price));
		 }else{
			 $("#sumcount").val(Number($("#sumcount").val())-Number(price));
		 }
         break;
     }
	 case "count3":{


		 var price =  $("#price3").val();
		 if(count=="add"){
			 $("#sumcount").val(Number($("#sumcount").val())+Number(price));
		 }else{
			 $("#sumcount").val(Number($("#sumcount").val())-Number(price));
		 }
         break;
     }
	 case "count4":{
		 var price =  $("#price4").val();
		 if(count=="add"){
			 $("#sumcount").val(Number($("#sumcount").val())+Number(price));
		 }else{
			 $("#sumcount").val(Number($("#sumcount").val())-Number(price));
		 }
         break;
     }
	 case "count5":{
		 var price =  $("#price5").val();
		 if(count=="add"){
			 $("#sumcount").val(Number($("#sumcount").val())+Number(price));
		 }else{
			 $("#sumcount").val(Number($("#sumcount").val())-Number(price));
		 }
         break;
     }
	 case "count6":{
		 var price =  $("#price6").val();
		 if(count=="add"){
			 $("#sumcount").val(Number($("#sumcount").val())+Number(price));
		 }else{
			 $("#sumcount").val(Number($("#sumcount").val())-Number(price));
		 }
         break;
     }
	 case "count7":{
		 var price =  $("#price7").val();
		 if(count=="add"){
			 $("#sumcount").val(Number($("#sumcount").val())+Number(price));
		 }else{
			 $("#sumcount").val(Number($("#sumcount").val())-Number(price));
		 }
         break;
     }
	 case "count8":{

		 var price =  $("#price8").val();
		 if(count=="add"){
			 $("#sumcount").val(Number($("#sumcount").val())+Number(price));
		 }else{
			 $("#sumcount").val(Number($("#sumcount").val())-Number(price));
		 }
         break;
     }
	 case "count9":{

		 var price =  $("#price9").val();
		 if(count=="add"){
			 $("#sumcount").val(Number($("#sumcount").val())+Number(price));
		 }else{
			 $("#sumcount").val(Number($("#sumcount").val())-Number(price));
		 }
         break;
     }
	 case "count10":{

		 var price =  $("#price10").val();
		 if(count=="add"){
			 $("#sumcount").val(Number($("#sumcount").val())+Number(price));
		 }else{
			 $("#sumcount").val(Number($("#sumcount").val())-Number(price));
		 }
         break;
     }
	 case "count11":{

		 var price =  $("#price11").val();
		 if(count=="add"){
			 $("#sumcount").val(Number($("#sumcount").val())+Number(price));
		 }else{
			 $("#sumcount").val(Number($("#sumcount").val())-Number(price));
		 }
         break;
     }
	 case "count12":{

		 var price =  $("#price12").val();
		 if(count=="add"){
			 $("#sumcount").val(Number($("#sumcount").val())+Number(price));
		 }else{
			 $("#sumcount").val(Number($("#sumcount").val())-Number(price));
		 }
         break;
     }
	}

}


function resetForm() {
	$('#formData').each(function(index) {
		$('#formData')[index].reset();
	});

}

//function rechargeMoney1(){
//
//	if($("#sumcount").val()==""||$("#sumcount").val()==null){
//		lwalert("tipModal", 1, "请先选择产品!");
//	}else{
//		var sumcount = $("#sumcount").val();
//
//	$.ajax ( {
//		type : "get",
//		url : "../../alipay",
//		data : {
//			"method" : "buildRequest",
//			"sumcount" : sumcount,
//		},
//		dataType : "text",
//
//		async : false,
//		success : function ( data ) {
//			console.info(data)
//            var flag =  com.leanway.checkLogind(data);
//			if(flag){
//				lwalert("tipModal", 2,"确定支付成功？","reloadpage()");
//				var tempData = $.parseJSON(data);
//				//给表单赋值
//				setFormValue(tempData);
//
//			    document.forms['alipaysubmit'].submit();
//
//
//			}
//		}
//	});
//
//	//lwalert("tipModal", 1, "请先提供支付接口!");
//	}
//
//}

function rechargeMoney1(){

	$("#formData").submit();

	var sumcount = $("#sumcount").val();

	$.ajax ( {
			type : "get",
			url : "../../../"+ln_project+"/alipay",
			data : {
				"method" : "zhifubao_pay",
				"sessionid":sessionid,
				"sumcount" :sumcount
			},
			dataType : "text",
			async:false,
			success : function ( data ) {
				var jData =  $.parseJSON(data);
				if(jData.status=="success"){
					lwalert("tipModal", 2,"确定支付成功？","reloadpage()");

				}else{
					lwalert("tipModal", 1, "请先选择产品!");
				}

			}
		});

	   // lwalert("tipModal", 2,"确定支付成功？","reloadpage()");
}

function reloadpage(){

	location.reload();
}

function rechargeMoney2(){

	if($("#sumcount").val()==""||$("#sumcount").val()==null){
		lwalert("tipModal", 1, "请先选择产品!");
	}else{
		var sumcount = $("#sumcount").val();

	$.ajax ( {
		type : "get",
		url : "../../../"+ln_project+"/alipay",
		data : {
			"method" : "weixin_pay",
			"sumcount" : sumcount,
		},
		dataType : "text",

		async : false,
		success : function ( data ) {
			console.info(data)
            var flag =  com.leanway.checkLogind(data);
			if(flag){
				    var url = data;
				        $("#qrcode").html("");
					    if(url!="null"){
					        generateQRCode("canvas",url);
					        $("#qrcode").append("<div>请微信扫码支付</div>");
				        }else{
				        	$("#qrcode").html("<font color='red'>二维码生成出错</font>");
				        }


			}
		}
	});

	//lwalert("tipModal", 1, "请先提供支付接口!");
	}





}
function generateQRCode(rendermethod,url) {

    $("#qrcode").qrcode({
        render: rendermethod, // 渲染方式有table方式（IE兼容）和canvas方式
        text: url, //内容
        height : 128,
        width : 128
    });
}

function setFormValue (data) {
	resetForm();
	for (var item in data) {
		  $("#" + item).val(data[item]);
	  }

}

var resetForm = function () {
    $( '#alipaysubmit' ).each( function ( index ) {
        $('#alipaysubmit')[index].reset( );
    });
}

function askForReceipt(){
	lwalert("tipModal", 1, "金额为0,无法索取发票!");
}

function showMask(){
    $("#mask").css("height",$(document).height());
    $("#mask").css("width",$(document).width());
    $("#mask").show();
  }
  //隐藏遮罩层
  function hideMask(){

    $("#mask").hide();
  }

  $(".add").click(function() {
           // $(this).prev() 就是当前元素的前一个元素，即 text_box
		  $(this).prev().val(parseInt($(this).prev().val()) + 1);

      countMoney($(this).prev().attr("id"),"add");
});

$(".min").click(function() {
      // $(this).next() 就是当前元素的下一个元素，即 text_box
	  if($(this).next().val()==0){
			lwalert("tipModal", 1, "不能再减了!");
	  }else{

		  $(this).next().val(parseInt($(this).next().val()) - 1);

		  countMoney($(this).next().attr("id"),"min");
	  }
});