
var clicktime = new Date();
var addstatus ;
var details;//存放明细 数据
var oTable;
var ope;	//增加 或 修改
//var additionalstatus; //杂人  或 杂出
var confirmstatus; //确认状态
$(function(){
//	additionalstatus = $('input[name="additionalstatus"]:checked').val();
	confirmstatus = $('input[name="confirmstatus"]:checked').val();
	oTable = initInOutTable();

	//设置按钮 是否可用   true  不可以    false  可用
	buttonStatus(true);

	com.leanway.enterKeyDown("searchValue", searchAdditional);
	
	com.leanway.initSelect2("#companionid", "../../../../"+ln_project+"/purchase?method=queryCompanionBySelect2&contracttype=2", "供应商");
//	com.leanway.initSelect2("#deptid", "../../../../"+ln_project+"/dept?method=queryDeptBySearch", "搜索部门");

	com.leanway.initTimePickYmdForMoreId("#producedate,#retestdate,#postdata,#incomingdate","#limitdate");
	
	com.leanway.initSelect2("#operator", "../../../../"+ln_project+"/purchase?method=queryAuditorBySelect2", "搜索经办人");

	initBootstrapValidator();
	
	//查询交易类型
	queryTradeType();
	
	com.leanway.formReadOnly("additionalForm");
	
	$("#pda0").prop("disabled",true);
	$("#pda1").prop("disabled",true);
	
	// 获取部门
	getDeptList();
	
});
//绑定单选框状态改变事件
$("input[name=confirmstatus]").change(function(){
	com.leanway.clearTableMapData("inoutInfo");
	com.leanway.dataTableUnselectAll("inoutInfo","checkList");


	searchAdditional();
});
////绑定单选框状态改变事件
//$("input[name=additionalstatus]").change(function(){
//
//	com.leanway.clearTableMapData("inoutInfo");
//	com.leanway.dataTableUnselectAll("inoutInfo","checkList");
//
//	additionalstatus = $('input[name="additionalstatus"]:checked').val();
//	if(additionalstatus == 0){
//		$("#inoutTitle").text("杂入");//更改标题
//	}
//	if(additionalstatus == 1){
//		$("#inoutTitle").text("杂出");//更改标题
//	}
//	searchAdditional();
//});

//搜索
function searchAdditional(){
	
	 confirmstatus =  $('input[name="confirmstatus"]:checked').val();

    var searchValue = $("#searchValue").val();
    oTable.ajax.url("../../../"+ln_project+"/additional?method=queryAdditional&confirmstatus="+confirmstatus+"&additionalstatus=0&searchValue="+searchValue+"&tablename=additional").load();
	com.leanway.clearTableMapData("inoutInfo");
	com.leanway.dataTableUnselectAll("inoutInfo","checkList");
}

//加载datatable
function initInOutTable(){

	var table = $('#inoutInfo')
    .DataTable(
            {
                "ajax" : "../../../"+ln_project+"/additional?method=queryAdditional&additionalstatus=0&tablename=additional",
                "pageUrl"  :    "additional/additional.html",
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
                           "mDataProp": "additionalid",
                           "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                               $(nTd).html("<div id='stopPropagation" + iRow +"'>"
                                       +"<input class='regular-checkbox' type='checkbox' id='" + sData
                                       + "' name='checkList' value='" + sData
                                       + "'><label for='" + sData
                                       + "'></label>");
                             com.leanway.columnTdBindSelectNew(nTd,"inoutInfo","checkList");
                           }
                       },
                       {"mDataProp": "additionalno"},
//                       {"mDataProp": "mapname"},


                  ],

                "oLanguage" : {
                    "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                },
                "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                "fnDrawCallback" : function(data) {
                    com.leanway.getDataTableFirstRowId("inoutInfo",ajaxLoadAdditional,
                            "more", "checkList");
                    com.leanway.dataTableClickMoreSelect("inoutInfo", "checkList", false,
                            oTable, ajaxLoadAdditional,undefined,undefined,"checkAll");

                    com.leanway.dataTableCheckAllCheck('inoutInfo', 'checkAll', 'checkList');
                }
            }).on('xhr.dt', function (e, settings, json) {
                com.leanway.checkLogind(json);
            } );

return table;

}

//加载明细
function ajaxLoadAdditional(additionalid){
	//加载数据前清空表单
	$("#inoutTable thead").html("");
	$("#inoutTable tbody").html("");

	$.ajax({
		type : "get",
		url  : "../../../"+ln_project+"/additional",
		data : {
			"method" : "queryAdditionalDetail",
			"additionalid" : additionalid
		},
		datetype : "text",
		async : false,
		success : function(data){

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
				var jData = $.parseJSON(data);
	            if(jData.status=="success"){
	            	
	            	com.leanway.formReadOnly("additionalForm");
	            	
	            	$("#pda0").prop("disabled",true);
	            	$("#pda1").prop("disabled",true);
	            	
	            	//加载表头信息
	            	setFormValue(jData.additional);	            	
	            	
	            	var detailList = jData.detailList;
	            	
	            	details = jData.detailList;

	            	//绘画表单
	            	appendTabel(detailList);
	            	//更改按钮状态
	            	buttonStatus("true");
	            }else{
//	            	lwalert("tipModal", 1, jData.info);
	            	details='';
	            }
			}
		}
	})

}



//绘画表单
function appendTabel(data){

	var theadhtml = "";
	var tableBodyHtml = "";

		theadhtml += "<tr>";
		theadhtml += "<th style='width: 30px'> <input type='checkbox' id='editCheckAll' name='editCheckAll' onclick='com.leanway.dataTableCheckAll(\"inoutTable\", \"editCheckAll\", \"boxid\")' class='regular-checkbox' /><label for='editCheckAll'></label></th>";
		theadhtml += "<th>仓库 </th>"
		theadhtml += "<th>品号</th>"
		theadhtml += "<th>品名</th>"
		theadhtml += "<th>版本</th>"
		theadhtml += "<th>数量 </th>"
		theadhtml += "<th>库存单位</th>"	
		theadhtml += "<th>批号</th>"	
//		theadhtml += "<th>单价</th>"
		theadhtml += "<th>产品状态</th>"
//		theadhtml += "<th>是否扫描</th>"
		theadhtml += "<th>限用日期</th>"
		theadhtml += "</tr>";

		for(var i in data){
			
			 var productorstatus= productorstatusToName(data[i].productorstatus);
			 
//			 var labelid= data[i].labelid;
//			 
//			 if(null==labelid||"null"==labelid||""==labelid||undefined==labelid||"undefined"==labelid){
//				 labelid = "未扫描";
// 			}else{
// 				 labelid = "已扫描";
// 			}
			
	    	tableBodyHtml += "<tr>";
	    	tableBodyHtml += "<td ><input type = 'checkbox' name='boxid' id='boxid"+i+"' value= '"+data[i].additionaldetailid+"' class='regular-checkbox' ><label for='boxid"+i+"'></td>";
	    	tableBodyHtml +="<td>"+data[i].mapname+"</td>";
		    tableBodyHtml +="<td>"+data[i].productorname+"</td>";
            tableBodyHtml +="<td>"+data[i].productordesc+"</td>";  
            tableBodyHtml +="<td>"+data[i].version+"</td>"; 
	    	tableBodyHtml +="<td>"+data[i].count+"</td>";
	    	tableBodyHtml +="<td>"+data[i].stockunitsname+"</td>";
	    	tableBodyHtml +="<td>"+data[i].batch+"</td>";
//	    	tableBodyHtml +="<td>"+data[i].price+"</td>";
	    	tableBodyHtml +="<td>"+productorstatus+"</td>";
	    	tableBodyHtml +="<td style='display:none' ><input type='hidden' class='form-control' name='stockunits' value="+data[i].stockunits+"></td>";
	    	tableBodyHtml +="<td style='display:none' ><input type='hidden' class='form-control' name='additionalid' value="+data[i].additionalid+"></td>";
//	    	tableBodyHtml +="<td>"+labelid+"</td>";
	    	tableBodyHtml +="<td>"+data[i].limitdate+"</td>";
	    	tableBodyHtml += "</tr>";
	    } 

	$("#inoutTable thead").html(theadhtml);
    $("#inoutTable tbody").html(tableBodyHtml);

}

//修改
function updateAdditional(){
	// 部门
	$("#deptid").prop("disabled", false);
	
	 var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
	    var data = oTable.rows('.row_selected').data();
	    if(data.length == 0) {
	        lwalert("tipModal", 1, "请选择数据进行修改!");
	    }else if(data.length>1){
	        lwalert("tipModal", 1, "只能选择一条数据进行修改!");
	    }else{
	        if(confirmstatus==0){
	        	
	        	$("#tradetype").prop("disabled", false);
	        	$("#comment").prop("readonly", false);
	        	$("#pda0").prop("disabled",false);
	        	$("#pda1").prop("disabled",false);
	        	//如果该单号有数据，则可进行修改
	            if(details!=''){
	            	var theadhtml = "";
	            	theadhtml += "<tr>";
	            	theadhtml += "<th style='width: 30px'> <input type='checkbox' id='editCheckAll' name='editCheckAll' onclick='com.leanway.dataTableCheckAll(\"inoutTable\", \"editCheckAll\", \"boxid\")' class='regular-checkbox' /><label for='editCheckAll'></label></th>";
	            	theadhtml += "<th>仓库 </th>"
	            	theadhtml += "<th>品号 </th>"
	            	theadhtml += "<th>品名 </th>"
	            	theadhtml += "<th>版本</th>"
	            	theadhtml += "<th>数量 </th>"
	            	theadhtml += "<th>库存单位 </th>"
	            	theadhtml += "<th>批号 </th>"
	            	theadhtml += "<th>产品状态</th>"
	            	theadhtml += "<th>限用日期</th>"
	            	theadhtml += "</tr>";

	            	$("#inoutTable thead").html(theadhtml);
	            	ope = "updateAdditional";
	            	setTableValue(details);
	            	buttonStatus(false);

	            	for(var i in details){
	  	              //  $("#purchasecount"+i).val(details[i].purchasecount);
	  	            	 var mapid = details[i].mapid;
	  	            	 var productorid = details[i].productorid;
	  	            	 var batch =details[i].batch;
	  	            	 var subbatch = details[i].subbatch;
	  	            	 var serialnumber=details[i].serialnumber;
	  	            	 var versionid=details[i].versionid;

	  	            	 if (mapid != null && mapid != "" && mapid != "null") {
	  	                	 initSelect2("#mapid" + i,
	  	 	                        "../../../"+ln_project+"/companyMap?method=queryAllStorageMap", "仓库");
	  	                    $("#mapid"+i).append(
	  	                            '<option value=' + mapid + '>' + details[i].mapname
	  	                                    + '</option>');
	  	                    $("#mapid"+i).select2("val", [ mapid ]);
	  	                }

	  	                if (productorid != null && productorid != "" && productorid != "null") {
	  	                	 initSelect2("#productorid" + i,
	  	 	                        "../../../"+ln_project+"/mapProductor?method=queryProductorByMapId&mapid="+mapid+"", "搜索产品");
	  	                    $("#productorid"+i).append(
	  	                            '<option value=' + productorid + '>' + details[i].productorname
	  	                                    + '</option>');
	  	                    $("#productorid"+i).select2("val", [ productorid ]);
	  	                }
	  	                
	  	              if (versionid != null && versionid != "" && versionid != "null") {
	  	                	 initSelect2("#versionid" + i,
	  	 	                        "../../../"+ln_project+"/mapProductor?method=queryVersionByMapidAndProductorid&mapid="+mapid+"&productorid="+productorid, "搜索产品版本");
	  	                    $("#versionid"+i).append(
	  	                            '<option value=' + versionid + '>' + details[i].version
	  	                                    + '</option>');
	  	                    $("#versionid"+i).select2("val", [ versionid ]);
	  	                }
	  	                
	  	            //产品状态
	  	  		   	var html="";
	  	  			
	  	  			html +="<option value='A'>合格</option>";
	  	  			html +="<option value='A1'>放行</option>";
	  	  			html +="<option value='Q'>未检</option>";
	  	  			html +="<option value='R1'>生产不良</option>";
	  	  			html +="<option value='R2'>来料不良</option>";
	  	  	
	  	  		    $("#productorstatus"+i).html(html);

	  	  		    initTimePickYmd("limitdate"+i);
    
	  	            $("#productorstatus"+i).val(details[i].productorstatus);
	  	            
	  	          
//	  	               if(additionalstatus=='1'){ //杂出
//	  	            	   if (batch != null && batch != "" && batch != "null") {
//	  		                	 initSelect2("#batch" + i,
//	  		 	                        "../../../"+ln_project+"/transferStore?method=queryBatchByProductorAndMap&productorid="+productorid+"&calloutmapid="+mapid+"", "搜索批次号");
//	  		                    $("#batch"+i).append(
//	  		                            '<option value=' + batch + '>' + details[i].batch
//	  		                                    + '</option>');
//	  		                    $("#batch"+i).select2("val", [ batch ]);
//	  		                }
//	  	            	   if (subbatch != null && subbatch != "" && subbatch != "null") {
//	  		                	 initSelect2("#subbatch" + i,
//	  		 	                        "../../../"+ln_project+"/transferStore?method=querySubbatchByProductorAndMap&productorid="+productorid+"&calloutmapid="+mapid+"&batch"+batch+"", "搜索子批次号");
//	  		                    $("#subbatch"+i).append(
//	  		                            '<option value=' + subbatch + '>' + details[i].subbatch
//	  		                                    + '</option>');
//	  		                    $("#subbatch"+i).select2("val", [ subbatch ]);
//	  		                }
//	  		                if (serialnumber != null && serialnumber != "" && serialnumber != "null") {
//	  		                	 initSelect2("#serialnumber" + i,
//	  		 	                        "../../../"+ln_project+"/transferStore?method=querySerialnumberByProductorAndMap&productorid="+productorid+"&calloutmapid="+mapid+"&batch="+batch+"", "搜索序列号");
//	  		                    $("#serialnumber"+i).append(
//	  		                            '<option value=' + serialnumber + '>' + details[i].serialnumber
//	  		                                    + '</option>');
//	  		                    $("#serialnumber"+i).select2("val", [ serialnumber ]);
//	  		                }
//	  	               }
	  	            }
	            }else{
	            	lwalert("tipModal", 1, "该单号无数据可修改,请重新选择!");
	            }


	        }else{
	            lwalert("tipModal", 1, "已确认出入库单，不能再进行修改!");
	        }
	    }

}

function setTableValue(data,type){

   var tableBodyHtml = "";
   
	   for(var i in data){
	       tableBodyHtml += " <tr>";
	       tableBodyHtml += "  <td ><input type = 'checkbox' name='boxid' id='boxid"+i+"' value= '"+data[i].additionaldetailid+"' class='regular-checkbox' ><label for='boxid"+i+"'></td>";
	       tableBodyHtml += "  <td> <select disabled='false' id='mapid"+i+"' name='mapid' style='width: 100px;'  class='form-control select2'></select></td>";

	       tableBodyHtml += "  <td> <select disabled='false' id='productorid"+i+"' name='productorid' style='width: 150px;'  class='form-control select2'></select></td>";
	       tableBodyHtml += "  <td><input  type = 'text' readonly='true' id='productordesc"+i+"' value='"+data[i].productordesc+"' style='width: 200px;' name='productordesc' class='form-control' /></td>";
	       tableBodyHtml += "  <td> <select disabled='false' id='versionid"+i+"' name='versionid' style='width: 200px;'  class='form-control select2'></select></td>";
	       tableBodyHtml += "  <td><input  type = 'text' id='count"+i+"' value='"+data[i].count+"' name='count' onkeyup='isNumber()' onafterpaste='isNumber()' style='width: 100px;' class='form-control' /></td>";
	       tableBodyHtml += "  <td><input  type = 'text' readonly='true' id='stockunitsname"+i+"' value='"+data[i].stockunitsname+"' style='width: 50px;' name='stockunitsname' class='form-control' /></td>";
	       tableBodyHtml += "  <td><input  type = 'text' id='batch"+i+"' value='"+data[i].batch+"' name='batch' style='width: 100px;' class='form-control' /></td>";
//	       tableBodyHtml += "  <td><input  type = 'text' id='price"+i+"' value='"+data[i].price+"' name='price' style='width: 100px;' class='form-control' /></td>";
	       tableBodyHtml += "  <td> <select id='productorstatus"+i+"' name='productorstatus' style='width: 100px;' class='form-control'></select></td>";
	       tableBodyHtml += "  <td><input  type = 'text' id='limitdate"+i+"' value='"+data[i].limitdate+"' name='limitdate' style='width: 100px;' class='form-control' /></td>";
	       tableBodyHtml += "  <td style='display:none'> <input class='form-control' type='hidden' id='stockunits"+i+"' name='stockunits' value ='"+data[i].stockunits+"' /></td>";
	       tableBodyHtml +="   <td style='display:none' ><input class='form-control' type='hidden' name='additionalid' value='"+data[i].additionalid+"'></td>";
	       tableBodyHtml += " </tr>";
//
//
//	       //产品状态
//		   	var html="";
//			
//			html +="<option value='A'>合格</option>";
//			html +="<option value='A1'>放行</option>";
//			html +="<option value='Q'>未检</option>";
//			html +="<option value='R1'>生产不良</option>";
//			html +="<option value='R2'>来料不良</option>";
//	
//		    $("#productorstatus"+i).html(html);
//	        
//	        console.info($("#productorstatus"+i).html());
	   
	   }
	   


   $("#inoutTable tbody").html(tableBodyHtml);
}



//新增杂入
function addIn(){
	// 部门
	$("#deptid").prop("disabled", false);
	
	ope = 'addInOutAdditional';
	com.leanway.clearTableMapData("inoutInfo");
	com.leanway.dataTableUnselectAll("inoutInfo","checkList");
	$("#inoutTitle").text("杂入");  //改标题
	buttonStatus(false);
	resetForm();
		
	$("#tradetype").prop("disabled", false);
	$("#comment").prop("readonly", false);
	$("#pda0").prop("disabled",false);
	$("#pda1").prop("disabled",false);

	var theadhtml = "";
	$("#inoutTable thead").html("");
	$("#inoutTable tbody").html("");
	theadhtml += "<tr>";
	theadhtml += "<th style='width: 30px'> <input type='checkbox' id='editCheckAll' name='editCheckAll' onclick='com.leanway.dataTableCheckAll(\"inoutTable\", \"editCheckAll\", \"boxid\")' class='regular-checkbox' /><label for='editCheckAll'></label></th>";
	theadhtml += "<th>仓库 </th>"
	theadhtml += "<th>品号</th>"
	theadhtml += "<th>品名</th>"
	theadhtml += "<th>版本</th>"
	theadhtml += "<th>数量 </th>"
	theadhtml += "<th>库存单位 </th>"
	theadhtml += "<th>批号 </th>"
	theadhtml += "<th>产品状态</th>"
	theadhtml += "<th>限用日期</th>"
	theadhtml += "<th>换算率</th>"
	theadhtml += "</tr>";

	$("#inoutTable thead").html(theadhtml);
	addstatus="addIn";

}
//增加表格行
function addTable(){
	var i = $("#inoutTable tbody:eq(0)").find("tr").length;
	if(i!=0){
		 i = getLastIdNumber("inoutTable");
	}
	var mapid='';
	var productorid='';
	var versionid = '';
	var batch='';
	var subbatch='';
	if(ope =='addInOutAdditional'){//如果是新增杂入杂出，判断新增的状态
			$("#inoutTable tbody:eq(0)").append("<tr> " +
					"<td ><input type = 'checkbox' name='boxid' id='boxid"+i+"' value='' class='regular-checkbox' ><label for='boxid"+i+"'></td>" +
					"<td> <select id='mapid"+i+"' name='mapid' style='width: 100px;'  class='form-control select2'></select></td>"+
					"<td><select disabled id='productorid"+i+"' name='productorid' style='width: 100px;'  class='form-control select2'></select></td>" +					
					"<td><input type = 'text' id='productordesc"+i+"' name='productordesc' style='width: 100px;'  class='form-control' readonly='true'/></td>"+
					"<td><select disabled id='versionid"+i+"' name='versionid' style='width: 50px;'  class='form-control select2'></select></td>" +
					"<td><input type = 'text' id='count"+i+"'  name='count' onkeyup='isNumber()' onafterpaste='isNumber()' style='width: 100px;' class='form-control' /></td>" +
					"<td><input type = 'text' id='stockunitsname"+i+"' name='stockunitsname' style='width: 50px;'  class='form-control' readonly='true'/></td>"+
					"<td><input type = 'text' id='batch"+i+"'  name='batch' style='width: 50px;' class='form-control' /></td>" +
					"<td> <select id='productorstatus"+i+"' name='productorstatus' style='width: 50px;' class='form-control' ></select></td>"+
					"<td><input type = 'text' id='limitdate"+i+"'  name='limitdate' class='form-control' style='width: 100px;'/></td>" +
					"<td><input type='number' class='conversionrate' min='1' name='conversionrate1' value='1'/>/<input type='number' class='conversionrate' min='1' name='conversionrate2' value='1'/></td>"+
					"<td style='display:none'> <input class='form-control' type='hidden' id='stockunits"+i+"' name='stockunits' value =''/></td>"+
					" </tr>");

	}
	if(ope == 'updateAdditional'){//如果是修改杂入杂出,判断修改出入单的状态
			$("#inoutTable tbody:eq(0)").append("<tr> " +
					"<td ><input type = 'checkbox' name='boxid' id='boxid"+i+"' value='' class='regular-checkbox' ><label for='boxid"+i+"'></td>" +
					"<td> <select id='mapid"+i+"' name='mapid' style='width: 100px;'  class='form-control select2'></select></td>"+
					"<td><select disabled id='productorid"+i+"' name='productorid' style='width: 100px;'  class='form-control select2'></select></td>" +
					"<td><input type = 'text' id='productordesc"+i+"' name='productordesc' style='width: 100px;'  class='form-control' readonly='true'/></td>"+
					"<td><select disabled id='versionid"+i+"' name='versionid' style='width: 50px;'  class='form-control select2'></select></td>" +
					"<td><input type = 'text' id='count"+i+"'  name='count' onkeyup='isNumber()' onafterpaste='isNumber()' style='width: 100px;' class='form-control' /></td>" +
					"<td><input type = 'text' id='stockunitsname"+i+"' name='stockunitsname' style='width: 50px;'  class='form-control' readonly='true'/></td>"+
					"<td><input type = 'text' id='batch"+i+"'  name='batch' style='width: 50px;' class='form-control' /></td>" +
					"<td> <select id='productorstatus"+i+"' name='productorstatus' style='width: 50px;' class='form-control'></select></td>"+
					"<td><input type = 'text' id='limitdate"+i+"'  name='limitdate' class='form-control' style='width: 100px;'/></td>" +
					"<td><input type='number' class='conversionrate' min='1' name='conversionrate1' value='1'/>/<input type='number' class='conversionrate' min='1' name='conversionrate2' value='1'/></td>"+
					"<td style='display:none'> <input class='form-control' type='hidden' id='stockunits"+i+"' name='stockunits' value =''/></td>"+
					"</tr>");

	}
	
	var html="";
	
	html +="<option value='A'>合格</option>";
	html +="<option value='A1'>放行</option>";
	html +="<option value='Q'>未检</option>";
	html +="<option value='R1'>来料不良</option>";
	html +="<option value='R2'>生产不良</option>";

//
    $("#productorstatus"+i).html(html);
    initTimePickYmd("limitdate"+i);
	
	initSelect2("#productorid"+i,"../../../"+ln_project+"/mapProductor?method=queryProductorByMapId&additionalstatus=0", "搜索产品");
	initSelect2("#mapid"+i, "../../../"+ln_project+"/companyMap?method=queryAllStorageMap", "搜索仓库");

	$("#mapid"+i).on("select2:select", function(e) {

		 mapid = $("#mapid"+i+" option:selected").val();

		 $("#productorid"+i).attr("disabled",false);

		 clearData(i,"","","","","");
		//杂入：产品从仓库产品关联表里查
        initSelect2("#productorid"+i,"../../../"+ln_project+"/mapProductor?method=queryProductorByMapId&mapid="+mapid+"&additionalstatus=0", "搜索产品");

	})

		
		
	$("#productorid"+i).on("select2:select", function(e) {

		 productorid = $("#productorid"+i+" option:selected").val();


		 //根据选中产品查集来那个单位名称
		 getProductorById(productorid,i);
		 
		 $("#versionid"+i).attr("disabled",false);
		 
//		 clearData(i,"","","","","");
		//杂入： 如果是杂入  产品从仓库产品关联表里查,杂出 ：   如果是杂出   产品从 仓库产品明细表里查
        initSelect2("#versionid"+i,"../../../"+ln_project+"/mapProductor?method=queryVersionByMapidAndProductorid&mapid="+$("#mapid"+i+" option:selected").val()+"&additionalstatus=0"+"&productorid="+productorid, "搜索版本号");

		 
		
	});
	
	$("#versionid"+i).on("select2:select", function(e) {

		 versionid = $("#versionid"+i+" option:selected").val();


		 //根据选中产品查集来那个单位名称
		 getUnitsByProductoridAndVersionid(productorid,versionid,i);
		 
//		 $("#versionid"+i).attr("disabled",false);
		 
//		 clearData(i,"","","","","");
		//杂入： 如果是杂入  产品从仓库产品关联表里查,杂出 ：   如果是杂出   产品从 仓库产品明细表里查
//       initSelect2("#versionid"+i,"../../../"+ln_project+"/mapProductor?method=queryVersionByMapidAndProductorid&mapid="+$("#mapid"+i+" option:selected").val()+"&additionalstatus=0"+"&productorid="+productorid, "搜索版本号");

		 
		
	});

}

//清除数据
function clearData(index,productorid,batch,subbatch,serialnumber,count){
    $("#productorid"+index).val(productorid).trigger("change");
    $("#batch"+index).val(batch).trigger("change");

    $("#serialnumber"+index).val(serialnumber).trigger("change");

    $("#count"+index).val(count);
    $("#count"+index).prop("disabled",false);

    $("#subbatch"+index).val(subbatch);

//    $("#productorid"+index).val(productorid);
//    $("#batch"+index).val(batch);
//    $("#serialnumber"+index).val(serialnumber);
//    $("#count"+index).val(count);
//    $("#subbatch"+index).val(subbatch);

}


//保存
function saveInOrOut(){
	/*if($("#tradetype").val() == "" || $("#tradetype").val() == null){
		lwalert("tipModal", 1, "请选择交易类型");
		return false;
	}*/
	if($("#deptid").val() == "" || $("#deptid").val() == null){
		lwalert("tipModal", 1, "请选择费用承担部门");
		return false;
	}
	
	$("#saveInOrOut").prop("disabled", true);
	$("#saveInOrOut").html("正在提交中");
	
	var formdata;

	additionalDetailList = getTableDataToJson("inoutTable");
	
	$("#additionalDetailList").val(additionalDetailList)
	var form = $("#additionalForm").serializeArray();
	formdata = formatFormJson(form);
	
	$.ajax({
		type: "post",
		url : "../../../"+ln_project+"/additional",
		data : {
            "method" : ope,
            "formdata" : formdata,
            "additionalStatus" : 0,
            "tradetype":$("#tradetype").val(),
            "deptid":$("#deptid").val()

        },
		datetype: "text",
        success : function(data) {

        	var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
				var jdata = $.parseJSON(data);
	        	 if(jdata.status=='success'){

	        		 $("#saveInOrOut").prop("disabled", false);
	        		 $("#saveInOrOut").html("保存");
	        		 
	        		 com.leanway.clearTableMapData("inoutInfo");
	        	     com.leanway.dataTableUnselectAll("inoutInfo","checkList");
	        		 lwalert("tipModal", 1, jdata.info);
	        		 buttonStatus(true);

	        		 oTable.ajax.reload();

	        	 }else{
	        		 
	        		 $("#saveInOrOut").prop("disabled", false);
	        		 $("#saveInOrOut").html("保存");
	        		 lwalert("tipModal", 1, jdata.info);
	        	 }

			}


        }
	})
}

//删除出入单
function deleteAdditional(type){
	var data = oTable.rows('.row_selected').data();
	var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
	
    if(data.length == 0) {
        lwalert("tipModal", 1, "请选择需要删除的数据!");
        return;
    }else if(confirmstatus == 1){
    	lwalert("tipModal", 1, "该订单已确认，不能删除！");
    	return;
    }else if(confirmstatus == 2){
    	lwalert("tipModal", 1, "该订单进行出/入库，不能删除！");
    	return;
    }else{
    	lwalert("tipModal", 2, "确定要删除选中的出入单吗？","sureDeleteAdditional(2,"+type+") ");
    }

}
//删除出入单明细
function deleteAdditionalDetail(){
	var data = $("#inoutTable tbody input[type=checkbox]:checked");
    if(data.length == 0) {
        lwalert("tipModal", 1, "请选择需要删除的数据!");
        return;
    }
	if(ope == 'addInOutAdditional'){
		 $("input[name=boxid]:checked").each(function(index){

			$(this).parent().parent().remove();
		})
		return;
		//var inventoryid  = oTable.rows('.row_selected').data()[0].inventoryid;
	}

	//console.info(inventoryid);
	var ids = com.leanway.getCheckBoxData(1, "inoutTable", "boxid");

	var arr = ids.split(",");
	//
//	var allIds = $("#inoutTable tbody").find("tr").length;
	var allIds = details.length;
	if(ids.length < 1 || ids ==''){

		if(ope == 'updateAdditional'){
			 $("input[name=boxid]:checked").each(function(index){
				 	if($(this).val() == ''){
				 		$(this).parent().parent().remove();

				 	}
				})

		}else{
			lwalert("tipModal", 1, "请选择需要删除的出入单！！");
		}

		return;
	}
	if(arr.length == allIds){

		lwalert("tipModal", 2, "此操作会删除整个出入单,确定吗？"," sureDeleteAdditional(2,1)");
		return;
	}
	if(arr.length != allIds){
		lwalert("tipModal", 2, "确定要删除选中的数据吗？","sureDeleteAdditional(1,1) ");
		return;
	}
}

//确定删除出入单
function sureDeleteAdditional(type,pagetype){
	var ids;
//	var inventoryid;
	if(type == 1){
		ids = com.leanway.getCheckBoxData(1, "inoutTable", "boxid");

	}else if(type == 2 ){
		if(pagetype == 1){
			ids = com.leanway.getCheckBoxData(1, "inoutInfo", "checkList");

		}else{
			ids = com.leanway.getCheckBoxData(2, "inoutInfo", "checkList");

		}
	}

	$.ajax({
	type : "post",
	url : "../../../"+ln_project+"/additional?method=deleteAdditional",
	traditional: true,  //传递数组 (这里没用到  可以不配)
	data : {
		"type" : type,//  1:盘点明细    2：盘点单
		"ids"  : ids,
	},
	dataType : "text",
	async : false,
	success : function(text) {

		 var flag =  com.leanway.checkLogind(text);

		 if ( flag ) {

		 var jdata = $.parseJSON(text);
    	 if(jdata.status=='success'){

 	    		 if(ope == 'updateAdditional'){
 	    			 $("input[name=boxid]:checked").each(function(index){
 	    				 		$(this).parent().parent().remove();
 	    				})
 	    		}
 	    		 if(type == 2){//删除整个出入单，重新加载table
 	        		 com.leanway.clearTableMapData("inoutInfo");
 	         	     com.leanway.dataTableUnselectAll("inoutInfo","checkList");
 	         	     buttonStatus(true);
 	        		 oTable.ajax.reload();
 	    		 }
 	    		 lwalert("tipModal", 1, jdata.info);
// 	    		 $("#tbody1").html("");
// 	    		 $("#mapid").val("搜索仓库").trigger("change");
 	 //   		 oTable.ajax.reload();
 	    	 }else{
 	    		 lwalert("tipModal", 1, jdata.info);
 	    	 }
 		}
 	}


})
}

//确认杂入杂出
function sureInOut(){
	var ids;
	var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
	if(confirmstatus == 1||confirmstatus == 2){
		lwalert("tipModal", 1, "单号已确认过,无需重复确认！");
		return;
	}

	 ids = com.leanway.getCheckBoxData(1, "inoutInfo", "checkList");
//	console.info(ids);
	if(ids.length<1 || ids ==''){
		lwalert("tipModal", 1, "请选择需要确认的单号！");
		return;
	}

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/additional?method=updateAdditionalToSure",		
		traditional: true,  //传递数组 (这里没用到  可以不配)
		data : {
			"ids" : ids,
			"additionalstatus" : 0,
			"confirmstatus" : 1
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

 			if ( flag ) {
 				 var jdata = $.parseJSON(text);
 	        	 if(jdata.status=='success'){
 	        		 com.leanway.clearTableMapData("inoutInfo");
 	          	    com.leanway.dataTableUnselectAll("inoutInfo","checkList");
 	        		 lwalert("tipModal", 1, jdata.info);

// 	        		 $("#tbody1").html("");
// 	        		 $("#mapid").val("搜索仓库").trigger("change");
 	        		 oTable.ajax.reload();
 	        	 }else{
 	        		 lwalert("tipModal", 1, jdata.info);
 	        	 }

 			}
 		}


	})

}

//确认杂入杂出
function sureInAndInstock(){
	var ids;
	var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
	if(confirmstatus == 2){
		lwalert("tipModal", 1, "单号已确认过,无需重复确认！");
		return;
	}

	 ids = com.leanway.getCheckBoxData(1, "inoutInfo", "checkList");

	if(ids.length<1 || ids ==''){
		lwalert("tipModal", 1, "请选择需要确认的单号！");
		return;
	}

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/additional?method=confirmAdditionalAndInStock",		
		traditional: true,  //传递数组 (这里没用到  可以不配)
		data : {
			"ids" : ids,
			"additionalstatus" : 0,
			"confirmstatus" : 1
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

 			if ( flag ) {
 				 var jdata = $.parseJSON(text);
 	        	 if(jdata.status=='success'){
 	        		 com.leanway.clearTableMapData("inoutInfo");
 	          	    com.leanway.dataTableUnselectAll("inoutInfo","checkList");
 	        		 lwalert("tipModal", 1, jdata.info);

// 	        		 $("#tbody1").html("");
// 	        		 $("#mapid").val("搜索仓库").trigger("change");
 	        		 oTable.ajax.reload();
 	        	 }else{
 	        		 lwalert("tipModal", 1, jdata.info);
 	        	 }

 			}
 		}


	})

}

//限制输入的字符 只能是数字
function isNumber() {
    var calloutcount = document.getElementsByName("count");
    for (var i = 0; i < calloutcount.length; i++) {
        calloutcount[i].value = calloutcount[i].value.replace(/[^\d.]/g, '');
    }
}

//或取表单单选框中最后一个id属性的最后一个值+1
function getLastIdNumber(tableid){
	var elements = $("#"+tableid+" tbody .regular-checkbox");
	
	var id = elements[elements.length-1].getAttribute("id");
	
	var i = $("#inoutTable tbody:eq(0)").find("tr").length;

	if(id.length>6){
		var num = id.substring(id.length-2,id.length);
	}else{
		var num = id.substring(id.length-1,id.length);
	}
	
	return eval(num)+eval(1);
}
//改变按钮状态
function buttonStatus(boolean){

	$("#addTable").prop("disabled",boolean);
	$("#saveInOrOut").prop("disabled",boolean);
	$("#deleteAdditionalDetail").prop("disabled",boolean);

}


//封装表单数据
//type:1 杂入。 2：杂出
function getTableDataToJson(tableId){
    var reg = /,$/gi;

    // 解析Table数据，值为空的跳过
    var tableJson = "[";
    $("#" + tableId + " tbody:eq(0) tr").each(function(index) {
    			
    			
    			var batch = $(this).find("td:eq(5)").find("input").val();
    			
    			if(null==batch||"null"==batch||""==batch||undefined==batch||"undefined"==batch){
    				lwalert("tipModal", 1, "批号请填写完整！");
    			}
    			
    			tableJson += "{\"mapid\":\""
    				+ $(this).find("td:eq(1)").find("select").val()                   
                     + "\",\"productorid\":\""
                    + $(this).find("td:eq(2)").find("select").val()
                     + "\",\"productordesc\":\""
                    + $(this).find("td:eq(3)").find("select").val()
                     + "\",\"versionid\":\""
                     + $(this).find("td:eq(4)").find("select").val()
                     + "\",\"count\":\""
                     + $(this).find("td:eq(5)").find("input").val()
                     + "\",\"stockunits\":\""
                    + $(this).find("td:eq(10)").find("input").val()
                     + "\",\"batch\":\""
                    + $(this).find("td:eq(7)").find("input").val()
//	    			+ "\",\"price\":\""
//	                + $(this).find("td:eq(8)").find("input").val()
	                + "\",\"productorstatus\":\""
	                + $(this).find("td:eq(8)").find("select").val()
	                + "\",\"limitdate\":\""
	                + $(this).find("td:eq(9)").find("input").val()
    				+ "\",\"conversionrate\":\""
    				+ $(this).find("td:eq(10)").find("input[name='conversionrate1']").val()+"/"+$(this).find("td:eq(10)").find("input[name='conversionrate2']").val()
                    if(ope == 'updateAdditional'){
                    
                    	tableJson += "\",\"additionaldetailid\":\""
	                    + $(this).find("td:eq(0)").find("input").val()
	                    + "\",\"additionalid\":\""
	                    + $(this).find("td:eq(11)").find("input").val()
                    
                    }

    			  tableJson += "\"},";

    })
    tableJson = tableJson.replace(reg, "");

    tableJson += "]";

    return tableJson;
}

initSelect2 = function(id, url, text, multiple) {

    if (multiple == undefined || typeof(multiple) == "undefined") {
        multiple = false;
    }

    $(id).select2({
        placeholder : text,
        language : "zh-CN",
        multiple: multiple,
        ajax : {
            url : url,
            dataType : 'json',
            delay : 250,
            data : function(params) {
                return {
                    q : params.term, // search term
                    page : params.page,
                    pageSize : 10
                };
            },
            processResults : function(data, params) {

                var flag = com.leanway.checkLogind(data);

                if (flag) {
                    params.page = params.page || 1;
                    return {
                        results : data.items,
                        pagination : {
                            more : (params.page * 30) < data.total_count
                        }
                    }
                }
                ;
            },
            cache : false
        },
        escapeMarkup : function(markup) {
            return markup;
        },
        minimumInputLength : 1,
    });
}



/**
 * 根据id查询产品信息
 */
function getProductorById(productorid,line) {
	$.ajax({
		type : "POST",
		url : "../../../"+ln_project+"/productors",
		data : {
			 "method" : "findAllProductorsObject",
	         "productorid" : productorid,
		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				 var tempData = $.parseJSON(data);
//				 $("#stockunits"+line).val(tempData.productorsConditions.unitsid);
//				 $("#stockunitsname"+line).val(tempData.productorsConditions.unitsname);
				 $("#productordesc"+line).val(tempData.productorsConditions.productordesc);
	 
			}
		},
		error : function(data) {

		}
	});
}


/**
 * 打印杂入杂出标签
 *
 *
 */
function printLabel(){


	    var detailid = com.leanway.getCheckBoxData(1, "inoutTable", "boxid");

		if (detailid.length == 0) {

			lwalert("tipModal", 1, "请选择一条杂入单明细进行打印!");
			return;

		} else if (detailid.split(",").length > 1) {

			lwalert("tipModal", 1, "请选择一条杂入单明细进行打印!");
			return;

		} else {

			
			var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
			if(confirmstatus == 0){
				lwalert("tipModal", 1, "请确认单据后再进行打印！");
				return;
			}
			// 弹出模态框，填写打印信息，默认显示已有信息
			loadAddLabelPrintData(detailid);

		}
}


/**
 * 加载新增安装参数
 */
var loadAddLabelPrintData = function (additionaldetailid) {

	$.ajax ( {
		type : "post",
		url : "../../../../" + ln_project + "/additional",
		data : {
			"method" : "queryAdditionalDetailByDetailid",
			"additionaldetailid" : additionaldetailid
		},
		dataType : "json",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {



				if (data.status == "success") {
					
					
                 	setLabelPrintFormVal( data.detail );


					// 弹出modal
					$('#labelPrintDiv').modal({backdrop: 'static', keyboard: true});

				} else {

					lwalert("tipModal", 1, data.info);

				}

			}
		}
	});

}



var setLabelPrintFormVal = function ( data ) {

	resetLabelPrintDivForm();
	
	$("#unitsname2").html(data.stockunitsname);
	$("#unitsname1").html(data.stockunitsname);
	$("#unitsname").html(data.stockunitsname);

	$("#unitsid").val(data.stockunits);
	$("#number").val(data.count);
	$("#retestdate").val(data.limitdate);
	

	for ( var item in data ) {

		$("#" + item).val(data[item]);


	}

$("#orderid").val(data.additionaldetailid);
$("#resource").val("additionaldetail");

	// 给select2赋初值
	var operator = data.operator;

	if (operator != null && operator != "" && operator != "null") {
		$("#operator").append(
				'<option value=' + operator + '>' + data.operatorname
						+ '</option>');
		$("#operator").select2("val", [ operator ]);
	}


}


function saveLabelData() {

	
	// 提交前先验证
	 $("#labelPrintDivForm").data('bootstrapValidator').resetForm();
	$("#labelPrintDivForm").data('bootstrapValidator').validate();

	if ($('#labelPrintDivForm').data('bootstrapValidator').isValid()) {
			
			var form  = $("#labelPrintDivForm").serializeArray();
			
			// 将数据转换成json数据
			var formData = formatFormJson(form);
			
			$.ajax ( {
				type : "post",
				url : "../../../../" + ln_project + "/labeldata",
				data : {
					"method" : "saveLabelDatas",
					"formData" : formData
				},
				dataType : "json",
				async : false,
				success : function ( data ) {
		
					var flag =  com.leanway.checkLogind(data);
		
					if ( flag ) {
		
						if (data.status == "success") {
		
							$('#labelPrintDiv').modal('hide');
		
							// 打印数据传递
							var message = data.labelDateList;
		
							var printName = "其他入库标签";
		
							var printFile="qtrkbq";
							
							com.leanway.sendReportData(printName, printFile, message);
		
						} else {
							lwalert("tipModal", 1, data.info);
						}
		
					}
				}
			});
	
	}

}


var formatFormJson = function(formData) {
	var reg = /,$/gi;
	var data = "{";
	for (var i = 0; i < formData.length; i++) {
		
		
		if (formData[i].name == "additionalDetailList") {
			data += "\"" + formData[i].name + "\" : " + formData[i].value + ",";
		} else {
			data += "\"" + formData[i].name + "\" : \"" + formData[i].value
					+ "\",";
		}
	}
	data = data.replace(reg, "");
	data += "}";
	return data;
}

function initBootstrapValidator( ) {

	// 对应的表单id
	$('#labelPrintDivForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {
					netweight : {
						validators : {
							notEmpty : {}
						}
					},
					batch : {
						validators : {
							notEmpty : {}
						}
					},
					retestdate : {
						validators : {
							notEmpty : {}
						}
					}

				}
			})

}


/**
 * 清空表头表单
 */
function resetForm() {


	$('#additionalForm').each(function(index) {
		$('#additionalForm')[index].reset();
	});

//	$("#deptid").val(null).trigger("change"); // select2值给清空s
}

/**
 * 清空工艺路线行表单
 */
function resetLabelPrintDivForm() {


	$('#labelPrintDivForm').each(function(index) {
		$('#labelPrintDivForm')[index].reset();
	});

	$("#companionid").val(null).trigger("change"); // select2值给清空
	$("#operator").val(null).trigger("change");

	$("#labelPrintDivForm").data('bootstrapValidator').resetForm();
	$("#labelPrintDivForm input[type='hidden']").val("");
}

function setFormValue(data) {
	
	if(data==null||data=="null"){
		return;
	}
	resetForm();
	
	var radioNames = "pda";

	for ( var item in data) {
		 if (item != "searchValue") {
			 if(radioNames.indexOf(item) != -1) {

					$("input[type=radio][name=" + item + "][value=" + data[item] + "]").prop('checked','true');
				} else {
					$("#" + item).val(data[item]);
				}
		 }


	}

	
//	for ( var item in data) {
//		
//			 if (item != "searchValue") {
//				 $("#" + item).val(data[item]);
//			 }
//
//
//	}

//	// 给select2赋初值
//	var deptid = data.deptid;
//	if (deptid != null && deptid != "" && deptid != "null") {
//		$("#deptid").append(
//				'<option value=' + deptid + '>' + data.deptname
//						+ '</option>');
//		$("#deptid").select2("val", [ deptid ]);
//	}

}


$("#companionid").on("select2:select", function(e) {
	
	$("#shortname").val($(this).find("option:selected").text());
	
	$("#companionid").val($(this).find("option:selected").val());
	 
});

$("#operator").on("select2:select", function(e) {
	
	$("#operatorname").val($(this).find("option:selected").text());
	$("#operator").val($(this).find("option:selected").val());
	 
});

//查询交易类型
function queryTradeType() {
		
	// 获取交易类型
	$.ajax({
		url: "../../../../" + ln_project + "/codeMap",
		type: "post",
		data: {
			"method" : "queryCodeMapList",
			"t":"OtherWarehousingOrders",
			"c":"OtherWarehousingOrders"
		},
		dataType: "json",
		success: function(data){
			// 清空数据
			$("#tradetype").empty();
			// 把信息放入select
			var option = "<option value='4A-01'>--请选择--</option>";
			$.each(data,function(index,e) {
				option += "<option value='"+ e.codevalue +"'>";
				option += e.note;
				option += "</option>";
			});
			$("#tradetype").append(option);
		}
	});
	
	/*$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/additional",
		data : {
			method : "queryTradeType",
			additionalstatus : 0
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				//下拉框赋值
				setTradeType(data.tradeTypeResult);
			}
		},
		error : function(data) {

		}
	});*/
}


//初始化单位类型下拉框
var setTradeType = function(data) {
	var html = "";

	for (var i in data) {
		//拼接option
		html +="<option value="+ data[i].codenum+">"+ data[i].codevalue+"</option>";
	}

	$("#tradetype").html(html);
}

/**
 * 产品状态转换
 */
function productorstatusToName(status) {

//	html +="<option value='A'>合格</option>";
//	html +="<option value='A1'>放行</option>";
//	html +="<option value='Q'>未检</option>";
//	html +="<option value='R1'>生产不良</option>";
//	html +="<option value='R2'>来料不良</option>";
	
	var result = "";

	switch (status) {
	
	case "A":
		result = "合格";
		break;
	case "A1":
		result = "放行";
		break;
	case "Q":
		result = "未检";
		break;
	case "R1":
		result = "来料不良";
		break;
	case "R2":
		result = "生产不良";
		break;	
	default:
		result = "未检";
		break;
	}

	return result;
}

//关闭出入单
function closeAdditional(type){
	var data = oTable.rows('.row_selected').data();
	var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
	
    if(data.length == 0) {
        lwalert("tipModal", 1, "请选择需要关闭的数据!");
        return;
    }else if(confirmstatus == 2){
    	lwalert("tipModal", 1, "该订单进行出/入库，不能关闭！");
    	return;
    }else{
    	lwalert("tipModal", 2, "确定要关闭选中的出入单吗？","sureCloseAdditional("+type+") ");
    }

}

//确定删除出入单
function sureCloseAdditional(pagetype){
	var ids;

	if(pagetype == 1){
		ids = com.leanway.getCheckBoxData(1, "inoutInfo", "checkList");

	}else{
		ids = com.leanway.getCheckBoxData(2, "inoutInfo", "checkList");

	}	

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/additional?method=updateAdditionalToSure",
		traditional: true,  //传递数组 (这里没用到  可以不配)
		data : {
			"ids" : ids,
			"additionalstatus" : 0,
			"confirmstatus" : 3
		},
		dataType : "text",
		async : false,
		success : function(text) {

			var flag =  com.leanway.checkLogind(text);

 			if ( flag ) {
 				 var jdata = $.parseJSON(text);
 	        	 if(jdata.status=='success'){
 	        		 
 	        		 com.leanway.clearTableMapData("inoutInfo");
 	          	     com.leanway.dataTableUnselectAll("inoutInfo","checkList");
 	        		 lwalert("tipModal", 1, jdata.info);

 	        		 oTable.ajax.reload();
 	        	 }else{
 	        		 lwalert("tipModal", 1, jdata.info);
 	        	 }

 			}
 		}


	})
}

/**
 * 打印已生成的杂入标签
 *
 *
 */
function printExistLabel(){


	    var detailid = com.leanway.getCheckBoxData(1, "inoutTable", "boxid");

		if (detailid.length == 0) {

			lwalert("tipModal", 1, "请选择一条杂入单明细进行打印!");
			return;

		} else if (detailid.split(",").length > 1) {

			lwalert("tipModal", 1, "请选择一条杂入单明细进行打印!");
			return;

		} else {

			
			var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
			if(confirmstatus == 0){
				lwalert("tipModal", 1, "请确认入库后再进行打印！");
				return;
			}
			// 弹出模态框，填写打印信息，默认显示已有信息
			queryLabelPrintData(detailid);

		}
}

/**
 *  通过选中明细id查询明细信息
 */
var queryLabelPrintData = function (detailid) {
	
	$.ajax ( {
		type : "post",
		url : "../../../../" + ln_project + "/additional",
		data : {
			"method" : "queryLabelPrintData",
			"additionaldetailids" : detailid
		},
		dataType : "json",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {


				if (data.status == "success") {


					var message = data.detailList;
	
					var printName = "其他入库标签";
					var printFile = "qtrkbq";			
					
					com.leanway.sendReportData(printName, printFile, JSON.stringify(message));
					

									
				} else {

					lwalert("tipModal", 1, data.info);

				}

			}
		}
	});

}
/**
 * 根据id查询产品信息
 */
function getUnitsByProductoridAndVersionid(productorid,versionid,line) {
	$.ajax({
		type : "POST",
		url : "../../../"+ln_project+"/productionStage",
		data : {
			 "method" : "getUnitsByProductoridAndVersionid",
	         "productorid" : productorid,
	         "versionid" : versionid,
	         "toptypecode" : "14"
		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				 var tempData = $.parseJSON(data);
				 $("#stockunits"+line).val(tempData.result.unitsid2);
				 $("#stockunitsname"+line).val(tempData.result.unitsname2);
//				 $("#productordesc"+line).val(tempData.productorsConditions.productordesc);
	 
			}
		},
		error : function(data) {

		}
	});
}

// 获取部门列表
function getDeptList(){
	$("#deptid").prop("disabled", false);
	$.ajax({
		url: "../../../../" + ln_project + "/dept",
		type: "post",
		data: {
			"method" : "querydeptmentList"
		},
		dataType: "json",
		success: function(data){
			// 清空数据
			$("#deptid").empty();
			// 把信息放入select
			var option = "<option value=''>--请选择--</option>";
			$.each(data.mapJson,function(index,e) {
				option += "<option value='"+ e.deptId +"'>";
				option += e.deptName;
				option += "</option>";
			});
			$("#deptid").append(option);
		}
	});
}