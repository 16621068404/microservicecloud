var clicktime = new Date();
var oTable;
var details;
var ope = "addMaterialReturn";
$(function() {
	// 初始化对象
	com.leanway.loadTags();
    com.leanway.initTimePickYmdForMoreId("#returntime");
    com.leanway.initSelect2("#trackid",
            "../../../"+ln_project+"/materialReturn?method=queryStockOrderList", "搜索备料单号");
    com.leanway.formReadOnly("materialReturnForm");
    oTable=initTable();
    initBootstrapValidator();
    com.leanway.enterKeyDown("searchValue", searchMaterialReturn);
    $("input[name=confirmstatus]").click(function(){
    	searchMaterialReturn();
	    });
});
function initBootstrapValidator() {
    $('#materialReturnForm').bootstrapValidator(
            {
                excluded : [ ':disabled' ],
                fields : {
                  trackid:{
                      validators : {
                          notEmpty : {},
                      }
                  },
                  returntime : {
                	  validators:{
                		  date : {
                              format : 'YYYY-MM-DD',
                              message : '日期格式不正确'
                          },

                	  }
                  }
                }
            });
}

var searchMaterialReturn = function() {

    var searchVal = $("#searchValue").val();
    var confirmstatus =  $('input[name="confirmstatus"]:checked').val();

    tabmap.clear();
	colmap.clear();

    oTable.ajax.url(
            "../../../"+ln_project+"/materialReturn?method=queryMaterialReturnList&searchValue="
                    + searchVal + "&confirmstatus=" + confirmstatus).load();
}


/**
 * 新增退料单
 */
function addMaterialReturn(){

    com.leanway.removeReadOnly("materialReturnForm");
    resetForm();
    com.leanway.dataTableUnselectAll("generalInfo","checkList");
    com.leanway.clearTableMapData( "generalInfo" );
    ope = "addMaterialReturn";


}

function saveMaterialReturn(){

    var reg=/,$/gi;
    var returnDetailVal = "[";

    $("#tableBody").find('tr').each(function (index, temp) {
    	var returndetailid = $(this).find("td:nth-child(1)").find("input").val();
        var productorname = $(this).find("td:nth-child(2)").find("input").val();
        var productordesc = $(this).find("td:nth-child(3)").find("input").val();
        var countunit = $(this).find("td:nth-child(4)").find("input").val();
        var name = $(this).find("td:nth-child(5)").find("input").val();
        var batch = $(this).find("td:nth-child(6)").find("input").val();
        var subbatch = $(this).find("td:nth-child(7)").find("input").val();
        var serialnumber = $(this).find("td:nth-child(8)").find("input").val();
//        var trackcount = $(this).find("td:nth-child(8)").find("input").val();
//        var trackcount = $(this).find("td:nth-child(9)").find("input").val();
        var returncount = $(this).find("td:nth-child(11)").find("input").val();
        var mapid = $(this).find("td:nth-child(12)").find("select").val();
        var productorstatus = $(this).find("td:nth-child(13)").find("select").val();
        var returnreason = $(this).find("td:nth-child(14)").find("input").val();
        var bomid = $(this).find("td:nth-child(15)").find("input").val();
        var productorid = $(this).find("td:nth-child(16)").find("input").val();
        var remaincount = $(this).find("td:nth-child(17)").find("input").val();
        var usedcount = $(this).find("td:nth-child(18)").find("input").val();
        var orderid = $(this).find("td:nth-child(19)").find("input").val();
        var trackdetailid = $(this).find("td:nth-child(20)").find("input").val();
        var pickingmapid = $(this).find("td:nth-child(21)").find("input").val();
        
        returnDetailVal += "{\"productorname\" : \""+productorname+"\",\"productordesc\" : \""+productordesc+"\",\"countunit\":\""+countunit+"\",\"name\":\""+name +"\",\"batch\":\""+batch+"\",\"subbatch\":\""+subbatch+"\",\"serialnumber\":\""+serialnumber+"\"," +
                "\"returncount\":\""+returncount+"\",\"mapid\":\""+mapid+"\",\"productorstatus\":\""+productorstatus+"\",\"returnreason\":\""+returnreason+"\",\"bomid\":\""+bomid+"\",\"productorid\":\""+productorid+"\",\"remaincount\":\""+remaincount+"\",\"usedcount\":\""+usedcount+"\",\"orderid\":\""+orderid+"\",\"trackdetailid\":\""+trackdetailid+"\",\"pickingmapid\":\""+pickingmapid+"\",\"returndetailid\":\""+returndetailid+"\"}," ;
    });
    returnDetailVal = returnDetailVal.replace(reg,"");
    returnDetailVal += "]";
    $('#returnDetailVal').val(returnDetailVal);
    var form = $("#materialReturnForm").serializeArray();
    // 后面确认时应 检测模具编号是否已存在
    var formData = formatFormJson(form);
    $("#materialReturnForm").data('bootstrapValidator').validate(); // 提交前先验证
    if ($('#materialReturnForm').data('bootstrapValidator').isValid()&&flag) { // 返回true、false
        if(returnDetailVal!="[]"){
        $.ajax({
            type : "POST",
            url : "../../../"+ln_project+"/materialReturn",
            data : {
                "method" : ope,
                "formData" : formData,
            },
            dataType : "text",
            async : false,
            success : function(data) {

    			var flag =  com.leanway.checkLogind(data);

    			if(flag){

					com.leanway.clearTableMapData( "generalInfo" );
                    var tempData = $.parseJSON(data);

                    if(tempData.status=="success"){
                        com.leanway.formReadOnly("materialReturnForm");
                        oTable.ajax.reload();
                    }
                    lwalert("tipModal", 1, tempData.info);

    			}
            }
        });
        }else{
            lwalert("tipModal", 1, "没有物料，不能保存");
        }
    }else if(!flag){
        lwalert("tipModal", 1, "退料数不能大于领料数");
    }
}
$("#trackid").on("select2:select", function(e) {

    queryBomTrackDetailList();
});
/**
 * 查询领料单明细
 */
function queryBomTrackDetailList(){
    var trackid = $("#trackid").val();
    $.ajax ( {
        type : "post",
        url : "../../../"+ln_project+"/materialReturn",
        data : {
            "method" : "queryPickingDetailList",
            "trackid" : trackid,
        },
        dataType : "text",
        async : false,
        success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

	            var tempData = $.parseJSON(data);
	            var bomTrackDetailList = tempData.bomTrackDetailList;
	            setTableValue(bomTrackDetailList);
	            for (var i in bomTrackDetailList) {
                    com.leanway.initSelect2("#mapid" + i,
                            "../../../../"+ln_project+"/companyMap?method=queryMapBySelect2&productorid="+bomTrackDetailList[i].productorid, "搜索仓库位置");
                    $("#mapid" + i).on("select2:select", function(e) {

                    	var name = $(this).find("option:selected").text();

                    	var mapid = $(this).find("option:selected").val()

                        if (mapid != null && mapid != "" && mapid != "null") {
                            $("#mapid" + i).append(
                                    '<option value=' + mapid + '>' + name
                                            + '</option>');
                            $("#mapid" + i).select2("val", [ mapid ]);
                        }
                    });
                    //queryDefaultMap("mapid"+i,bomTrackDetailList[i].productorid,mapid);
                }
//	            $("#productionorderid").val(tempData.bomTrack.productionorderid);

			}
        }
    });
}



/**
 * 填充领料单明细
 */
function setTableValue(data) {
//    var tableHeadHtml = ""
//    tableHeadHtml += " <tr>";
//    tableHeadHtml += " <th style='width: 15px'><input type='checkbox' id='checkDetailAll' onclick='com.leanway.dataTableCheckAll('grid-data', 'checkDetailAll', 'returndetailid')' class='regular-checkbox'><label for='checkDetailAll'></label></td>";
//    tableHeadHtml += "  <th style='width: 125px'>" + "组件" + "</th>";
//    tableHeadHtml += "  <th style='width: 25px'>" + "组件描述" + "</th>";
//    tableHeadHtml += "  <th style='width: 25px'>" + "库存单位" + "</th>";
//    tableHeadHtml += "  <th style='width: 25px'>" + "仓库名称" + "</th>";
//    tableHeadHtml += "  <th style='width: 25px'>" + "批次号" + "</th>";
//    tableHeadHtml += "  <th style='width: 25px'>" + "子批次号" + "</th>";
//    tableHeadHtml += "  <th style='width: 25px'>" + "序列号" + "</th>";
//    tableHeadHtml += "  <th style='width: 25px'>" + "领料数量" + "</th>";
//    tableHeadHtml += "  <th style='width: 25px'>" + "可退料数量" + "</th>";
//    tableHeadHtml += "  <th style='width: 25px'>" + "退料数量" + "</th>";
//    tableHeadHtml += "  <th style='width: 25px'>" + "入库仓库" + "</th>";
//    tableHeadHtml += "  <th style='width: 25px'>" + "退料状态" + "</th>";
//    tableHeadHtml += "  <th style='width: 25px'>" + "退料原因" + "</th>";
//    tableHeadHtml += " </tr>";
//    $("#tableHead").html(tableHeadHtml);
    var tableBodyHtml = "";
    var row = $("#grid-data").find("tr").length;
    for ( var i in data) {
    	var pickingname = data[i].pickingname;
    	var batch = data[i].batch;
    	var subbatch = data[i].subbatch;
    	var serialnumber = data[i].serialnumber ;
    	var pickingmapid = data[i].pickingmapid ;
    	var returnreason = data[i].returnreason ;
    	if (pickingname == undefined || pickingname ==null ) {
    		pickingname ="" ;
    	}
    	if (batch == undefined || batch == null) {
    		batch ="";
    	}
    	if (subbatch == undefined || subbatch == null) {
    		subbatch ="";
    	}
    	if (serialnumber == undefined || serialnumber == null) {
    		serialnumber ="";
    	}
    	if (data[i].pickingmapid == undefined || data[i].pickingmapid == null ) {
    		pickingmapid="";
    	}
    	
    	if (data[i].returnreason == undefined || data[i].returnreason == null ) {
    		returnreason="";
    	}
    	
        tableBodyHtml += " <tr>";
        tableBodyHtml += "  <td ><input type = 'checkbox' name='checkDetailList' id='returndetailid"+i+"' value='"+data[i].returndetailid+"' class='regular-checkbox' ><label for='returndetailid"+i+"'></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' value='"+data[i].productorname+"' id='productorname'  readonly='readonly' style='width:100px'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' value='"+data[i].productordesc+"' id='productordesc' readonly='readonly' style='width:100px'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' value='"+data[i].countunit+"' id='countunit'  readonly='readonly' style='width:100px'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' value='"+pickingname+"' id='name'  readonly='readonly' style='width:100px'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' value='"+batch+"' id='batch'  readonly='readonly' style='width:100px'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' value='"+subbatch+"' id='batch'  readonly='readonly' style='width:100px'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' value='"+serialnumber+"' id='serialnumber'  readonly='readonly' style='width:100px'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' value='"+data[i].pickingcount+"' name='pickingcount' id='pickingcount' readonly='readonly' style='width:100px'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' value='"+data[i].planreturncount+"' name='planreturncount' id='planreturncount' readonly='readonly' style='width:100px'/></td>";
        tableBodyHtml += "  <td> <input class='form-control' type='text' name='returncount' id='returncount"+ i +"'  onchange='notGreaterThan()' onkeyup='isNumber()' onafterpaste='isNumber()' style='width:100px'/></td>";
        tableBodyHtml += "  <td> <select id='mapid"+i+"' class='form-control select2' style='width: 100px;' name='mapid'></select></td>";
        tableBodyHtml += "  <td> <select id='productorstatus"+i+"' class='form-control select2' style='width: 100px;' name='productorstatus'><option value='R1'>来料不良</option><option value='R2'>生产不良</option><option value='A'>良品</option></select></td>";   
        tableBodyHtml += "  <td> <input class='form-control' type='text'  value='"+returnreason+"' id='returnreason' style='width:100px'/></td>";
        tableBodyHtml += "  <td style='display:none'> <input class='form-control' type='hidden' value='"+data[i].bomid+"' id='bomid' readonly='readonly'/></td>";
        tableBodyHtml += "  <td style='display:none'> <input class='form-control' type='hidden' value='"+data[i].productorid+"' id='productorid' readonly='readonly'/></td>";
        tableBodyHtml += "  <td style='display:none'> <input class='form-control' type='hidden' value='"+data[i].remaincount+"' id='remaincount' readonly='readonly'/></td>";
        tableBodyHtml += "  <td style='display:none'> <input class='form-control' type='hidden' value='"+data[i].usedcount+"' id='usedcount' readonly='readonly'/></td>";
        tableBodyHtml += "  <td style='display:none'> <input class='form-control' type='hidden' value='"+data[i].orderid+"' id='orderid' readonly='readonly'/></td>";
        tableBodyHtml += "  <td style='display:none'> <input class='form-control' type='hidden' value='"+data[i].trackdetailid+"' id='trackdetailid' readonly='readonly'/></td>";
        tableBodyHtml += "  <td style='display:none'> <input class='form-control' type='hidden' value='"+pickingmapid+"' id='pickingmapid' readonly='readonly'/></td>";
        tableBodyHtml += "  <td style='display:none'> <input class='form-control' type='hidden' value='"+data[i].returndetailid+"' id='returndetailid' readonly='readonly'/></td>";
        tableBodyHtml += " </tr>";
        row++;
    }
    $("#tableBody").html(tableBodyHtml);
}

/**
 * 填充到台账表格(拼接table)
 */
function setTableValue2(data) {
    var tableBodyHtml = "";
    var j=1;
    for ( var i in data) {

    	if (data[i].pickingname == undefined || data[i].pickingname ==null) {
    		data[i].pickingname= "";
    	}
    	if (data[i].batch == undefined || data[i].batch ==null) {
    		data[i].batch= "";
    	}
    	if (data[i].subbatch == undefined || data[i].subbatch ==null) {
    		data[i].subbatch= "";
    	}
    	if (data[i].serialnumber == undefined || data[i].serialnumber ==null) {
    		data[i].serialnumber= "";
    	}

        data[i].productorstatus= productorstatusToName(data[i].productorstatus);
    	
        tableBodyHtml += " <tr>";
        tableBodyHtml += "  <td ><input type = 'checkbox' name='checkDetailList' id='returndetailid"+i+"' value='"+data[i].returndetailid+"' class='regular-checkbox' ><label for='returndetailid"+i+"'></td>";
        tableBodyHtml += "  <td>"+data[i].productorname+"</td>";
        tableBodyHtml += "  <td>"+data[i].productordesc+"</td>";
        tableBodyHtml += "  <td>"+data[i].countunit+"</td>";
        tableBodyHtml += "  <td>"+data[i].pickingname+"</td>";
        tableBodyHtml += "  <td>"+data[i].batch+"</td>";
        tableBodyHtml += "  <td>"+data[i].subbatch+"</td>";
        tableBodyHtml += "  <td>"+data[i].serialnumber+"</td>";
        tableBodyHtml += "  <td> "+data[i].pickingcount+"</td>";
        tableBodyHtml += "  <td> "+data[i].planreturncount+"</td>";
        tableBodyHtml += "  <td> "+data[i].returncount+"</td>";
        //TODO
        tableBodyHtml += "  <td>"+data[i].name+"</td>";
        tableBodyHtml += "  <td>"+data[i].productorstatus+"</td>";
        tableBodyHtml += "  <td>"+data[i].returnreason+"</td>";

        tableBodyHtml += " </tr>";
        j=j+1;
    }
    $("#tableBody").html(tableBodyHtml);
}
//初始化数据表格
var initTable = function () {

	var confirmstatus =  $('input[name="confirmstatus"]:checked').val();

    var table = $('#generalInfo').DataTable( {
            "ajax": "../../../"+ln_project+"/materialReturn?method=queryMaterialReturnList&confirmstatus="+confirmstatus,
            "pageUrl" : "materialreturn/materialreturn.html",
            'bPaginate': true,
            "bDestory": true,
            "bRetrieve": true,
            "bFilter":false,
            "bSort": false,
            "scrollY":"250px",
            "bProcessing": true,
            "bServerSide": true,
            'searchDelay':"5000",
            "columns": [
                {
                            "data" : "returnid"
                        },{

                            "data" : "returnnumber"
                        }, {
                            "data" : "tracknumber",
                        }
             ],
             "aoColumns": [
                   {
                       "mDataProp": "returnid",
                       "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                           $(nTd).html("<div id='stopPropagation" + iRow +"'>"
                                   +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                   + "' name='checkList' value='" + sData
                                   + "'><label for='" + sData
                                   + "'></label>");
                         com.leanway.columnTdBindSelectNew(nTd,"generalInfo", "checkList");
                       }
                   },
                   {"mDataProp": "returnnumber"},
                   {"mDataProp": "tracknumber"}
              ],

             "oLanguage" : {
                 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
             },
             "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
             "fnDrawCallback" : function(data) {
                    com.leanway.getDataTableFirstRowId("generalInfo", ajaxLoadMaterialReturn,"more", "checkList");
                    com.leanway.dataTableClickMoreSelect("generalInfo", "checkList", false,
                            oTable, ajaxLoadMaterialReturn,undefined,undefined,"checkAll");

                    com.leanway.dataTableCheckAllCheck('generalInfo', 'checkAll', 'checkList');

             }
        } ).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
		} );

    return table;
}

function ajaxLoadMaterialReturn(returnid){
    $.ajax ({
        type : "post",
        url : "../../../"+ln_project+"/materialReturn",
        data : {
            "method" : "queryMaterialReturnObject",
            "returnid" : returnid,
        },
        dataType : "text",
        async : false,
        success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){
	            var tempData = $.parseJSON(data);
	            setFormValue(tempData.material);
                setTableValue2(tempData.materialReturnDetailList);
                details = tempData.materialReturnDetailList;
                com.leanway.formReadOnly("materialReturnForm");
			}
        }
    });
}
/**
 * 判断填的是否是数字
 */
function isNumber(){
    var trackcount = document.getElementsByName("returncount");
    for(var i = 0;i<trackcount.length;i++){

        trackcount[i].value=trackcount[i].value.replace(/[^\d.]/g,'');

    }
}
var flag=true;

function notGreaterThan(){
var planreturncount = document.getElementsByName("planreturncount");
var returncount = document.getElementsByName("returncount");
for(var i = 0;i<planreturncount.length;i++){
    if(parseFloat(planreturncount[i].value)<parseFloat(returncount[i].value)){
        lwalert("tipModal", 1, "退料数量不能大于可退料数量");
        flag=false;
        return false;
    }else{
        flag=true;
    }
}
}

function resetForm(){

    $('#materialReturnForm').each(function(index) {
        $('#materialReturnForm')[index].reset();
    });

//    $("#tableHead").html("");
    $("#tableBody").html("");

    $("#trackid").val("").trigger("change");
    $("#materialReturnForm").data('bootstrapValidator').resetForm();

}
//格式化form数据
var formatFormJson = function(formData) {
    var reg = /,$/gi;
    var data = "{";
    for (var i = 0; i < formData.length; i++) {
        if(formData[i].name == "returnDetailVal"){
            data += "\"" + formData[i].name + "\" : " + formData[i].value + ",";
        }else{
            data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
        }
    }
    data = data.replace(reg, "");
    data += "}";
    return data;
}
/**
 * 填充到HTML表单
 */
function setFormValue(data) {

    resetForm();

	if(data != null && data != "" && data != "null"){
		 for ( var item in data) {
		        $("#" + item).val(data[item]);
		    }

		    var trackid = data.trackid;
		    if (trackid != null && trackid != "" && trackid != "null") {
		        $("#trackid").append(
		                '<option value=' + trackid + '>' + data.tracknumber
		                        + '</option>');
		        $("#trackid").select2("val", [ trackid ]);
		    }
	}

}

function updateMaterialReturn(){
    var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
    var data = oTable.rows('.row_selected').data();
    if(data.length == 0) {
        lwalert("tipModal", 1, "请选择数据进行修改!");
    }else if(data.length>1){
        lwalert("tipModal", 1, "只能选择一条数据进行修改!");
    }else{
        if(confirmstatus==0){
        	com.leanway.clearTableMapData( "returnProductorTable" );
    		com.leanway.removeReadOnly("materialReturnForm");
            //var mapid = $("#mapid").val();
            $("#saveOrUpdate").prop("disabled",false);
            $("#trackid").prop("disabled",true);
            $("#barcode").prop("readonly",true);
            ope = "updateMaterialReturn";
            setTableValue(details);
            for(var i in details){

                $("#returncount"+i).val(details[i].returncount);

                com.leanway.initSelect2("#mapid" + i,
                        "../../../../"+ln_project+"/companyMap?method=queryMapBySelect2&productorid="+details[i].productorid, "搜索仓库位置");
                var mapid = details[i].mapid;
                if (mapid != null && mapid != "" && mapid != "null") {
                    $("#mapid"+i).append(
                            '<option value=' + mapid + '>' + details[i].name
                                    + '</option>');
                    $("#mapid"+i).select2("val", [ mapid ]);
                }
                //产品状态
                var productorstatus = details[i].productorstatus;
                if (productorstatus != null && productorstatus != "" && productorstatus != "null") {
                	
                	if(productorstatus=="来料不良"){
                		productorstatus = "R1";
                	}
                	if(productorstatus=="生产不良"){
                		productorstatus = "R2";
                	}
                	if(productorstatus=="良品"){
                		productorstatus = "A";
                	}
                	
                    $("#productorstatus"+i).val(productorstatus)
                }
            }
        }else{
            lwalert("tipModal", 1, "已确认入库，不能再进行修改!");
        }
    }
}


//保存数据
var confirmMaterialReturn = function() {

	var ids = com.leanway.getCheckBoxData("2", "generalInfo", "checkList");


	if (ids.length>0) {


		var confirmstatus = $('input[name="confirmstatus"]:checked').val();
		if(confirmstatus=="2"){
			lwalert("tipModal", 1, "选择的退料定已确认退货入库！");
			return;
		}
		var msg = "确定对选中的" + ids.split(",").length + "条退料单进行入库?";

		lwalert("tipModal", 2, msg ,"isSureConfirm()");
	} else {

		lwalert("tipModal", 1, "至少选择一条记录进行确认操作！");
	}

}

//确认入库ajax
var isSureConfirm = function() {

	var ids = com.leanway.getCheckBoxData("2", "generalInfo", "checkList");

	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/materialReturn",
		data : {
			method:"confirmMaterialReturn",
			"returnids":ids
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);

				if (tempData.status == "success") {
						lwalert("tipModal", 1, tempData.info);
						 oTable.ajax.reload();
					} else {
						lwalert("tipModal", 1, tempData.info);
					}

			}
		}
	});
}


/**
 * 删除数据
 * */
function deleteMaterialReturn(type){

	  if (type == undefined || typeof(type) == "undefined") {
			type = 2;
		}

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");


	if (ids.length>0) {


		var confirmstatus = $('input[name="confirmstatus"]:checked').val();
		if(confirmstatus=="2"){
			lwalert("tipModal", 1, "选择的追踪单已确认入库，不能删除！");
			return;
		}

		var msg = "确定删除选中的" + ids.split(",").length + "条退料单?";

		lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
	} else {

		lwalert("tipModal", 1, "至少选择一条记录进行删除操作！");
	}

}

function isSureDelete(type){

	var ids = com.leanway.getCheckBoxData(type, "generalInfo", "checkList");


	deleteAjax(ids);
}
//删除Ajax
var deleteAjax = function(ids) {
	$.ajax({
		type : "post",
		url : "../../../../"+ln_project+"/materialReturn",
		data : {
			method:"deleteMaterialReturn",
			"conditions" : '{"returnid":"' + ids + '"}',
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);

				if (tempData.status == "success") {

				    lwalert("tipModal", 1, "删除成功！");
					com.leanway.clearTableMapData( "generalInfo" );
					oTable.ajax.reload();

				}else {
					lwalert("tipModal", 1, tempData.info);
				}

			}
		}
	});
}


/**
 * 产品状态转换
 */
function productorstatusToName(status) {

	var result = "";

	switch (status) {
	case "R1":

		result = "来料不良";
		break;
	case "R2":
		result = "生产不良";
		break;
	case "A":
		result = "良品";
		break;
	default:
		result = "良品";
		break;
	}

	return result;
}


/**
 *  通过选中明细id查询明细信息
 */
var printLabel = function (type) {
	
	if (type == undefined || typeof(type) == "undefined") {
		type = 1;
	}

	var ids = com.leanway.getCheckBoxData(type, "grid-data", "checkDetailList");

	console.info(ids);
	
	if (ids.length>0) {
			
	        var msg = "确定对选中的" + ids.split(",").length + "条退料明细打印标签?";

			lwalert("tipModal", 2, msg ,"connect(" + type + ")");
	} else {

		    lwalert("tipModal", 1, "至少选择一条记录进行操作");
	}

}


//function connect(type){
//	
//	var port = com.leanway.getPort();
//
//	com.leanway.getListenMessage();
//
//	com.leanway.webscoket.connect("ws://localhost:"+port+"/websocket");
//	setTimeout("isSurePrintLabel(" + type + ")",2000);
//}

/**
 *  通过选中明细id查询明细信息
 */
var connect = function (type) {


	var ids = com.leanway.getCheckBoxData(type, "grid-data", "checkDetailList");
//	var reportResult = com.leanway.getReport("materialreturn");
	$.ajax ( {
		type : "post",
		url : "../../../../" + ln_project + "/materialReturn",
		data : {
			"method" : "queryMaterialReturnDetailByIds",
			"ids" : ids
		},
		dataType : "json",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {


				if (data.status == "success") {


					var message = data.returndetailList;
					
					//直接转到打印页面						
					var printName = data.printName;
					var printFile = data.printFile;
//					if (reportResult.reportname != "" && reportResult.reportname != "null" && reportResult.reportname != null) {
//						printName = reportResult.reportname;
//					}
//					if (reportResult.reportfile != "" && reportResult.reportfile != "null" && reportResult.reportfile != null) {
//						printFile = reportResult.reportfile;
//					}
//					var report =  "\"Reports\":{\"printName\":\""+printName+"\",\"printFile\": \""+printFile+"\",\"ConnectionString\":\"\",\"QuerySQL\":\"\",\"DetailGrid\":{\"Recordset\": {\"ConnectionString\": \"xml\",\"QuerySQL\": \"\"},\"PrintPreview\":true}}"
//					message = "{\"detail\":"+JSON.stringify(message)+","+report+"}";
//					
					com.leanway.sendReportData(printName, printFile, message);
//					com.leanway.webscoket.client.send(message);
						
				    
					
				} else {

					lwalert("tipModal", 1, data.info);

				}

			}
		}
	});

}
