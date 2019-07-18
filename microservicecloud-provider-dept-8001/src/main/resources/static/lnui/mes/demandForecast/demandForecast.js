var clicktime = new Date();
var oTable;
var demandTable;
var opeMethod="addDemandForecast";
var reg = /,$/gi;
$(function() {
	com.leanway.initSelect2("#productorid",
			"../../../"+ln_project+"/productors?method=queryAllProductor", "搜索产品");
	com.leanway.formReadOnly("forecastForm");
	$("#starttime").prop("readOnly",false);
	$("#endtime").prop("readOnly",false);
	oTable = initTable();
	demandTable = initDemandTable();
	com.leanway.initTimePickYmdForMoreId("#starttime, #endtime");
	$("#addDemandForecastButton").prop("disabled",true)
	$("#delDemandForecastButton").prop("disabled",true)
    com.leanway.enterKeyDown("searchOrderValue", searchDemandForecast);

});
var checkDemandid="";
function searchDemandForecast(){
	 var searchValue = $("#searchOrderValue").val();
     oTable.ajax.url("../../../../"+ln_project+"/demandForecast?method=queryDemandForecastList&searchValue="+searchValue).load();
}
function searchDemandForecastDetail(){
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	var time = "{";
	time+="\"starttime\" : \""+starttime+"\",";
	time+="\"endtime\" : \""+endtime+"\"";
	time+="}";
	demandTable.ajax.url("../../../../"+ln_project+"/demandForecast?method=queryDemandForecastDetail&time="+time+"&demandid="+checkDemandid).load();
}
function addForecast(){
	$("#addDemandForecastButton").prop("disabled",false)
	$("#delDemandForecastButton").prop("disabled",false)
	com.leanway.removeReadOnly("forecastForm");
	$("#productordesc").prop("readOnly",true);
	$("#unitsname").prop("readOnly",true);
	$("#salesunitsname").prop("readOnly",true);
	resetForm();	
	com.leanway.clearTableMapData( "generalInfo" );
    com.leanway.dataTableUnselectAll("generalInfo", "checkList");
    // 删除对应的产品数据
    delDemandForecast(0);
	addDemandForecast();
	opeMethod="addDemandForecast";
	
}

function updateForecast(){
	 var data = oTable.rows('.row_selected').data();
	    if (data.length == 0) {

	        lwalert("tipModal", 1, "请选择数据修改!");
	        return;

	    } else if (data.length > 1) {

	        lwalert("tipModal", 1, "只能选择一条数据修改!");
	        return;

	    } else {
	    	$("#saveOrUpdate").prop("disabled",false);
	    	$("#addDemandForecastButton").prop("disabled",false)
	    	$("#delDemandForecastButton").prop("disabled",false)
	    	opeMethod="updateDemandForecast";
	    	demandTableToEdit();
	    }
	
}

$("#productorid").on("select2:select",function(e) {
	getUnit($(this).val());
});
var getUnit = function(productorid){
    $.ajax({
        type : "POST",
        url : "../../../"+ln_project+"/productors",
        data : {
            "method" : "queryProductorsUnits",
            "productorid" : productorid,

        },
        dataType : "text",
        async : false,
        success : function(data) {
            var tempData = $.parseJSON(data);
            $("#productordesc").val(tempData.productordesc);
            $("#unitsname").val(tempData.unitsname);
            $("#salesunitsname").val(tempData.salesunitsname);		
        }
    });
}
//初始化数据表格
var initTable = function() {

    var table = $('#generalInfo')
            .DataTable(
                    {
                        "ajax" : "../../../../"+ln_project+"/demandForecast?method=queryDemandForecastList",
                        'bPaginate' : true,
                        "bDestory" : true,
                        "bRetrieve" : true,
                        "bFilter" : false,
                        "bSort" : false,
                        "scrollX" : true,
                        "bProcessing" : true,
                        "bServerSide" : true,
                        'searchDelay' : "5000",

                         "aoColumns": [
                               {
                                   "mDataProp": "demandid",
                                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                                       $(nTd).html("<div id='stopPropagation" + iRow +"'>"
                                               +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                               + "' name='checkList' value='" + sData
                                               + "'><label for='" + sData
                                               + "'></label>");
                                       com.leanway.columnTdBindSelectNew(nTd,"generalInfo","checkList");                                   }
                               },
                               {"mDataProp": "productorname"},
                               {"mDataProp": "productordesc"},

                          ],

                        "oLanguage" : {
                            "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                        },
                        "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                        "fnDrawCallback" : function(data) {
                            com.leanway.getDataTableFirstRowId("generalInfo",ajaxLoadDemandForecast,
                                    "more", "checkList");
                            com.leanway.dataTableClickMoreSelect("generalInfo", "checkList", false,
                                    oTable, ajaxLoadDemandForecast,undefined,undefined,"checkAll");

                        }
                    }).on('xhr.dt', function (e, settings, json) {
                        com.leanway.checkLogind(json);
                    } );

    return table;
}
var initDemandTable = function () {
    var editTable = $("#demandTable").DataTable({
            "ajax" : "../../../../"+ln_project+"/demandForecast?method=queryDemandForecastDetail",
            'bPaginate': false,
            "bRetrieve": true,
            "bFilter":false,
            "scrollX": true,
            "bSort": false,
            "bProcessing": true,
            "bServerSide": false,
            "aoColumns" : [
            {
                "mDataProp": "demanddetailid",
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html("<div id='stopPropagation" + iRow +"'>"
                            +"<input class='regular-checkbox' type='checkbox' id='" + sData
                            + "' name='demandCheckList' value='" + sData
                            + "'><label for='" + sData
                            + "'></label>");
                    com.leanway.columnTdBindSelect(nTd);
                }
            },
            {"mDataProp": "year"},
            {"mDataProp": "month"},
            {"mDataProp": "totalcount"},
            {"mDataProp": "firstcount"},
            {"mDataProp": "secondcount"},
            {"mDataProp": "thirdcount"},
            {"mDataProp": "forthcount"},
            {"mDataProp": "fifthcount"},
            {"mDataProp": "sixthcount"},
            {"mDataProp": "starttime"},
            {"mDataProp": "endtime"},],
            "aoColumnDefs" : [ {
                "sDefaultContent": "",
                 "aTargets": [ "_all" ]
            } ],
            "language" : {
                "sUrl" : "../../../jslib/datatables/zh-CN.txt"
            },
            "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
            "fnDrawCallback" : function(data) {

            }

        }).on('xhr.dt', function (e, settings, json) {
            com.leanway.checkLogind(json);
        } );
    return editTable;
}

/**
 * 新增一行
 */
var addDemandForecast = function( ) {
    var data = oTable.rows('.row_selected').data();
    var demandid = "";
    if(data.length>0){
    	demandid =data[0].demandid;

    }
    demandTable.row.add({
        "demanddetailid" : null,
        "year":"",
        "month":"",
        "cnmonth" : "",
        "totalcount":"",
        "firstcount":"",
        "secondcount":"",
        "thirdcount" : "",
        "forthcount":"",
        "fifthcount" : "",
        "sixthcount" : "",
        "starttime" : "",
        "endtime" : "",
        "demandid" : demandid
    }).draw(false);

    demandTableToEdit();
   
}

var demandTableToEdit = function ( ) {

    if (demandTable.rows().data().length > 0) {

        $("#demandTable tbody tr").each( function( ) {
            // 获取该行的下标
            var index = demandTable.row(this).index();
           
            //年               
            var year = demandTable.rows().data()[index].year;
            $(this).find("td:eq(1)").html('<input type="text" class="form-control"  style = "width:50px" name="year" id="year'+index+'" value="'+ year + '" onchange="setDataTableValue(this, '+ index+ ',\'demandTable\');getTime('+index+')"/>');
            //月      
            var month = demandTable.rows().data()[index].month;
            $(this).find("td:eq(2)").html('<input type="text" class="form-control"  style = "width:50px" name="month" id="month'+index+'" value="'+ month + '" onchange="setDataTableValue(this, '+ index+ ',\'demandTable\');getTime('+index+')"/>');
            
            //总量                        
            var totalcount = demandTable.rows().data()[index].totalcount;
            $(this).find("td:eq(3)").html('<input type="text" class="form-control"  style = "width:50px" name="totalcount" id="totalcount'+index+'" value="'+ totalcount + '" readonly/>');
           
            //第1周数量    
            var firstcount = (demandTable.rows().data()[index].firstcount==null?"":demandTable.rows().data()[index].firstcount);
            $(this).find("td:eq(4)").html('<input type="text" class="form-control"  style = "width:50px" name="firstcount" id="firstcount'+index+'" value="'+ firstcount + '" onblur="setDataTableValue(this, '+ index+ ',\'demandTable\');getTotalCount('+ index+ ')" onkeyup="isNumber(&quot;firstcount&quot;)" onafterpaste="isNumber(&quot;firstcount&quot;)"/>');
            
            //第2周数量     
            var secondcount = (demandTable.rows().data()[index].secondcount==null?"": demandTable.rows().data()[index].secondcount);
            $(this).find("td:eq(5)").html('<input type="text" class="form-control"  style = "width:50px" name="secondcount" id="secondcount'+index+'" value="'+ secondcount + '" onblur="setDataTableValue(this, '+ index+ ',\'demandTable\');getTotalCount('+ index+ ')" onkeyup="isNumber(&quot;secondcount&quot;)" onafterpaste="isNumber(&quot;secondcount&quot;)"/>');
            
            //第3周数量
            var thirdcount = (demandTable.rows().data()[index].thirdcount ==null?"":demandTable.rows().data()[index].thirdcount);
            $(this).find("td:eq(6)").html('<input type="text" class="form-control"  style = "width:50px" name="thirdcount" id="thirdcount'+index+'" value="'+ thirdcount + '" onblur="setDataTableValue(this, '+ index+ ',\'demandTable\');getTotalCount('+ index+ ')" onkeyup="isNumber(&quot;thirdcount&quot;)" onafterpaste="isNumber(&quot;thirdcount&quot;)"/>');
          
            //第4周数量 
            var forthcount = (demandTable.rows().data()[index].forthcount==null?"": demandTable.rows().data()[index].forthcount);
            $(this).find("td:eq(7)").html('<input type="text" class="form-control"  style = "width:50px" name="forthcount" id="forthcount'+index+'" value="'+ forthcount + '" onblur="setDataTableValue(this, '+ index+ ',\'demandTable\');getTotalCount('+ index+ ')" onkeyup="isNumber(&quot;forthcount&quot;)" onafterpaste="isNumber(&quot;forthcount&quot;)"/>');
           
            //第5周数量
            var fifthcount = (demandTable.rows().data()[index].fifthcount ==null?"":demandTable.rows().data()[index].fifthcount);
            $(this).find("td:eq(8)").html('<input type="text" class="form-control"  style = "width:50px" name="fifthcount" id="fifthcount'+index+'" value="'+ fifthcount + '" onblur="setDataTableValue(this, '+ index+ ',\'demandTable\');getTotalCount('+ index+ ')" onkeyup="isNumber(&quot;fifthcount&quot;)" onafterpaste="isNumber(&quot;fifthcount&quot;)"/>');
            
            //第6周数量
            var sixthcount = (demandTable.rows().data()[index].sixthcount ==null?"":demandTable.rows().data()[index].sixthcount);
            $(this).find("td:eq(9)").html('<input type="text" class="form-control"  style = "width:50px" name="sixthcount" id="sixthcount'+index+'" value="'+ sixthcount + '" onblur="setDataTableValue(this, '+ index+ ',\'demandTable\');getTotalCount('+ index+ ')" onkeyup="isNumber(&quot;sixthcount&quot;)" onafterpaste="isNumber(&quot;sixthcount&quot;)"/>');
           
            //开始日期     
            var starttime = demandTable.rows().data()[index].starttime;
            $(this).find("td:eq(10)").html('<input type="text" class="form-control" style = "width:100px"  readonly name="starttime" id="starttime'+index+'" value="'+ starttime + '"/>');
            
            //结束日期
            var endtime = demandTable.rows().data()[index].endtime;
            $(this).find("td:eq(11)").html('<input type="text" class="form-control" style = "width:100px"  readonly name="endtime" id="endtime'+index+'" value="'+ endtime + '" />');
            initTimePickY($("input[name='year']"));
            initTimePickM($("input[name='month']"));
        });

        demandTable.columns.adjust();
    }
}

//获取月总数
function getTotalCount(index){
	var totalcount = 0;
	var firstcount = ($("#firstcount"+index).val()==""?0:$("#firstcount"+index).val());
	var secondcount =($("#secondcount"+index).val()==""?0:$("#secondcount"+index).val());
	var thirdcount = ($("#thirdcount"+index).val()==""?0:$("#thirdcount"+index).val());
	var forthcount = ($("#forthcount"+index).val()==""?0:$("#forthcount"+index).val());
	var fifthcount = ($("#fifthcount"+index).val()==""?0:$("#fifthcount"+index).val());
	var sixthcount = ($("#sixthcount"+index).val()==""?0:$("#sixthcount"+index).val());
	
	totalcount= parseInt(firstcount)+parseInt(secondcount)
				+parseInt(thirdcount)+parseInt(forthcount)
				+parseInt(fifthcount)+parseInt(sixthcount);
	$("#totalcount"+index).val(totalcount);
	demandTable.rows().data()[index].totalcount = totalcount;

}
function delDemandForecast(type){
	 // 删除选中行的数据
    if ( type == 1 ||  type == undefined || typeof(type) == "undefined") {

        $("#demandTable tbody tr").each(function() {

            // 获取该行的下标
            var index = demandTable.row(this).index();

            if ($(this).find("td:eq(0)").find("input[name='demandCheckList']").prop("checked") == true) {
            	demandTable.rows(index).remove().draw(false);
            }

        });

    } else if ( type == 0 ) {

        $("#demandTable tbody tr").each(function() {

            // 获取该行的下标
            var index = demandTable.row(this).index();

            demandTable.rows(index).remove().draw(false);

        });
    }
}

function getTime(index){
	 var year = $("#year"+index).val();
     var month = $("#month"+index).val();
     if(year!=""&&month!=""&&year!=null&&month!=null){
    	 $.ajax({
             type : "get",
             url : "../../../../"+ln_project+"/demandForecast",
             data : {
                 method : "getTime",
                 year:year,
                 month:month
             },
             dataType : "json",
             success : function(data) {
                 var flag =  com.leanway.checkLogind(data);

                 if(flag){
                	 $("#starttime"+index).val(data.starttime);
                	 $("#endtime"+index).val(data.endtime);
                	 demandTable.rows().data()[index].starttime = data.starttime;
                	 demandTable.rows().data()[index].endtime = data.endtime;

                 }

             },

         });
     } 
}
function ajaxLoadDemandForecast(demandid){
	checkDemandid = demandid;
	$.ajax({
        type : "get",
        url : "../../../../"+ln_project+"/demandForecast",
        data : {
            method : "queryDemandForecastObject",
            demandid:demandid

        },
        dataType : "json",
        success : function(data) {
            var flag =  com.leanway.checkLogind(data);

            if(flag){
            	setFormValue(data);
            }

        },

    });
	demandTable.ajax.url("../../../../"+ln_project+"/demandForecast?method=queryDemandForecastDetail&demandid="+demandid).load();
}

/**
 * 赋值
 *
 * @param data
 */
function setFormValue( data ) {
    com.leanway.formReadOnly("forecastForm");
    $("#starttime").prop("readOnly",false);
	$("#endtime").prop("readOnly",false);
	$("#addDemandForecastButton").prop("disabled",true)
	$("#delDemandForecastButton").prop("disabled",true)
	for ( var item in data ) {
		$("#" + item).val(data[item]);
	}
	// 给select2赋初值
	var productorid = data.productorid;
	if (productorid != null && productorid != "" && productorid != "null") {
		$("#productorid").append(
				'<option value=' + productorid + '>' + data.productorname+"("+data.productordesc+")"
						+ '</option>');
		$("#productorid").select2("val", [ productorid ]);
	}
}
var resetForm = function ( ) {
	$('#forecastForm')[0].reset(); // 清空表单
	$("#forecastForm input[type='hidden']").val("");
	$("#productorid").val(null).trigger("change");
}
function saveDemandForecast(){
	var form  = $("#forecastForm").serializeArray();

	var formData = formatFormJson(form);
    $.ajax({
        type : "get",
        url : "../../../../"+ln_project+"/demandForecast",
        data : {
            method : opeMethod,
            formData:formData

        },
        dataType : "json",
        success : function(data) {
            var flag =  com.leanway.checkLogind(data);

            if(flag){
                if(data.status=="success"){
                   oTable.ajax.reload();
                   com.leanway.formReadOnly("forecastForm");
                }
                lwalert("tipModal", 1, data.info);
            }

        },

    });
}

function deleteForecast(type){
	 if (type == undefined || typeof(type) == "undefined") {
	        type = 1;
	    }
        var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");

        if (ids.length > 0) {

            var msg = "确定删除选中的" + ids.split(",").length + "条数据?";

            lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
        } else {
            lwalert("tipModal", 1,"至少选择一条数据操作");
        }
	   
}

function isSureDelete(type){
    var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");
    $.ajax({
        type : "post",
        url : "../../../../"+ln_project+"/demandForecast",
        data : {
            method : "deleteDemandForecast",
            demandid :ids
        },
        dataType : "json",
        async : false,
        success : function(data) {

            var flag =  com.leanway.checkLogind(data);

            if(flag){

                if (data.status == "success") {
                	resetForm();
                    oTable.ajax.reload();
                    demandTable.ajax.reload();
                    com.leanway.clearTableMapData( "generalInfo" );
                } 
                lwalert("tipModal", 1,data.info);

            }
        }
    });
}
//格式化form数据
var  formatFormJson = function  (formData) {

	var reg=/,$/gi;

	var data = "{";

	for (var i = 0; i < formData.length; i++) {

		var val = formData[i].value;
		data += "\"" +formData[i].name +"\" : \""+val+"\",";

	}

	data += "\"detailList\" : "+getDataTableData(demandTable);

	data += "}";

	return data;
}
/**
 * tableObj datatable对象
 *
 * 获取Table对象数据
 */
var getDataTableData = function(tableObj) {

    var jsonData = "[";

    var dataList = tableObj.rows().data();

    if (dataList != undefined && typeof (dataList) != "undefined"
            && dataList.length > 0) {

        // 循环遍历Table数据
        for (var i = 0; i < dataList.length; i++) {

            var productorData = dataList[i];

            jsonData += JSON.stringify(productorData) + ",";

        }
    }
    jsonData = jsonData.replace(reg, "");

    jsonData += "]";

    return jsonData;
}
//改变DataTable对象里的值
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

function isNumber(value) {
	var checkValue = document.getElementsByName(value);
	for (var i = 0; i < checkValue.length; i++) {

		checkValue[i].value = checkValue[i].value.replace(/[^\d.]/g, '');

	}
}