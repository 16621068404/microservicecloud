var datable;
$(function() {
    // 初始化对象
    com.leanway.loadTags();
    // 全选
    initTimePickYm("starttime");
    com.leanway.initSelect2("#centerid",
			"../../../"+ln_project+"/workCenter?method=queryWorkCenterBySelect&type=3", "搜索工作中心");
    datable = initTable();
    $("input[name=paystatus]").click(function(){
    	searchResust();
	});
    
    $("#starttime").val((new Date()).Format("yyyy-MM"));
})

var initTable = function () {
    var starttime = $("#starttime").val();
    var centerid = $("#centerid").val();
    var paystatus = $('input[name="paystatus"]:checked').val();
    var coefficient = $("#coefficient").val();
    var id='';
    var table = $('#tableid').DataTable( {
            "ajax": "../../../../"+ln_project+"/dispatchingOrderTrack?method=queryPayRollStatisticList&starttime="+starttime+"&centerid="+centerid+"&paystatus="+paystatus+"&coefficient="+coefficient,
            'bPaginate': false,
            "bDestory": true,
            "bRetrieve": true,
            "bFilter":false,
            "scrollY":"70vh",
            "bSort": false,
            "bProcessing": true,
            "bServerSide": true,
            'searchDelay':"5000",
             "aoColumns": [
                   {
                       "mDataProp": "payrollid",
                       "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                           $(nTd).html("<div id='stopPropagation" + iRow +"'>"
                                   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='checkList' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label>");
                           com.leanway.columnTdBindSelect(nTd,"tableid","checkList");
                      	   id+=sData+",";
                       }
                   },
                   {"mDataProp": "centername"},
                   {"mDataProp": "productordesc"},
                   {"mDataProp": "procedureshortname"},
                   {"mDataProp": "unitprice"},
                   {"mDataProp": "number"},
                   {"mDataProp": "backnumber"},
                   {"mDataProp": "pickcount"},
                   {"mDataProp": "payamount"},
                   {"mDataProp": "finishdate"},
                   {"mDataProp": "practicalpay"},
                   {"mDataProp": "practicalpaydate"},

              ],

             "oLanguage" : {
                 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
             },
             "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
             "fnDrawCallback" : function(data) {
            	 if(paystatus!=1){
                	 productorTableToEdit();
//                	 if(id!=undefined&&id.length>0){
//                		 var ids = id.substring(0,id.length-1).split(",");
//                		 for(var i in ids){
//                  		   com.leanway.setDataTableSelect("tableid","checkList",ids[i]);
//                		 }
//                	 }
            	 }
             }
        } ).on('xhr.dt', function (e, settings, json) {
            com.leanway.checkLogind(json);
        } );
    
    
    return table;
}
var searchResust = function(){
    datable=initTable();
    datable.destroy();//清空数据表
    datable = initTable();
    
}

var productorTableToEdit = function ( ) {
    if (datable.rows().data().length > 0) {

        $("#tableid tbody tr").each( function( ) {


            // 获取该行的下标
            var index = datable.row(this).index();
            datable.rows().data()[index].practicalpay = datable.rows().data()[index].payamount==null?"":datable.rows().data()[index].payamount;

            $(this).find("td:eq(10)").html('<input type="text" class="form-control" style="width: 100px"  onblur="setDataTableValue(this, '+ index+ ',\'tableid\')" name="practicalpay" id="practicalpay" onkeyup="isNumber()" onafterpaste="isNumber()" value="'+ datable.rows().data()[index].practicalpay+'">');
            datable.rows().data()[index].practicalpaydate = (new Date()).Format("yyyy-MM");
            // 是否检验
            $(this).find("td:eq(11)").html('<input type="text" class="form-control" style="width: 100px"  onchange="setDataTableValue(this, '+ index+ ',\'tableid\')" name="practicalpaydate" id="practicalpaydate'+index+'" value="'+(new Date()).Format("yyyy-MM")+'">');
            initTimePickYm("practicalpaydate"+index);
            
        });

        datable.columns.adjust();
    }
}

var setDataTableValue = function(obj, index, tableName) {

    var tableObj = $("#" + tableName).DataTable();

    // 获取修改的行数据
    var productor = tableObj.rows().data()[index];

    // 循环Json key,value，赋值
    for ( var item in productor) {

        // 当ID相同时，替换最新值
        if (item == obj.name) {

            productor[item] = obj.value;

        }

    }

}

function isNumber() {
    var practicalpay = document.getElementsByName("practicalpay");
    for (var i = 0; i < practicalpay.length; i++) {

    	practicalpay[i].value = practicalpay[i].value.replace(/[^\d.]/g, '');

    }
}
var nullflag=true;
function updateResust(){
	
    var paystatus = $('input[name="paystatus"]:checked').val();
    var coefficient = $("#coefficient").val();
    console.info(coefficient);
    if(paystatus==1){
        lwalert("tipModal", 1, "该数据已发放，不能再进行发放");
        return;
    }
	  var str = '';
	    // 拼接选中的checkbox
	    $("input[name='checkList']:checked").each(function(i, o) {
	        str += $(this).val();
	        str += ",";
	    });
	    var ids = str.substr(0, str.length - 1);
	    if (ids.length>0) {
	        formData = "{\"payRollStatisticList\" : "+getDataTableData(datable)+"}";
	        if(nullflag){
	        	$.ajax({
		            type : "post",
		            url : "../../../../"+ln_project+"/dispatchingOrderTrack?method=updatePayRollStatistic",
		            data : {
		                "formData" : formData,
		                "coefficient":coefficient
		            },
		            dataType : "json",
		            async : false,
		            success : function(text) {

		                var flag =  com.leanway.checkLogind(text);

		                if(flag){
		                	if(text.status=="success"){
				                  datable.ajax.reload();
		                	}
		                    lwalert("tipModal", 1, text.info);
		                }
		            }
		        });
		    } 
        }else {
		        lwalert("tipModal", 1, "请选择要发放的数据");
	    }
	        
}

var getDataTableData = function ( tableObj ) {
	nullflag=true;
    var reg=/,$/gi;
    var jsonData = "[";
    $("#tableid tbody tr").each(function() {

        // 获取该行的下标
        var index = tableObj.row(this).index();
        if ($(this).find("td:eq(0)").find("input[name='checkList']").prop("checked")  == true) {
            var productorData = tableObj.rows(index).data()[0]
            console.info(productorData);
            if(productorData.practicalpay===""||productorData.practicalpay===null||productorData.practicalpay==="null"||productorData.practicalpay===undefined){
            	nullflag = false;
            	lwalert("tipModal", 1, "实际发放金额未填写，不能进行发放");
    	        return;
            }
            if(productorData.practicalpaydate==""||productorData.practicalpaydate==null||productorData.practicalpaydate=="null"||productorData.practicalpaydate==undefined){
            	nullflag = false;
            	lwalert("tipModal", 1, "实际发放月份未填写，不能进行发放");
    	        return;
            }
            jsonData += JSON.stringify(productorData) + ",";
        }

    });

    jsonData = jsonData.replace(reg,"");

    jsonData += "]";

    return jsonData;
}
function downloadPayRoll(){
	var starttime = $("#starttime").val();
	var centerid = $("#centerid").val();
    var paystatus = $('input[name="paystatus"]:checked').val();
    var centername = $('#centerid').find("option:selected").text();
	if(starttime!=''){
	    window.location.href = "../../../../"+ln_project+"/dispatchingOrderTrack?method=downloadPayRoll&starttime=" + starttime + "&centerid=" + centerid+"&paystatus="+paystatus;
	    $("#starttime").val(starttime);
		$("input[type=radio][name=paystatus][value=" + paystatus + "]").prop('checked','true');
		setValueToSelect2Func("#centerid",centerid,centername);
		
	}else{
		lwalert("tipModal", 1,"请输入日期");

	}
			
}

function setValueToSelect2Func(ctrlId, idVal, name) {
	$(ctrlId).append('<option value=' + idVal + '>' + name + '</option>');
    $(ctrlId).select2("val", [ idVal ]);
}