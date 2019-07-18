var tradetype;
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

	
	//com.leanway.initSelect2("#deptid", "../../../../"+ln_project+"/dept?method=querydeptmentList", "搜索部门",true);
	
	com.leanway.enterKeyDown("searchValue", searchAdditional);
	
	com.leanway.initSelect2("#companionid", "../../../../"+ln_project+"/purchase?method=queryCompanionBySelect2&contracttype=2", "供应商");
//	com.leanway.initSelect2("#deptid", "../../../../"+ln_project+"/dept?method=queryDeptBySearch", "搜索部门");

	com.leanway.initTimePickYmdForMoreId("#producedate,#retestdate,#postdata");
	
	com.leanway.initSelect2("#operator", "../../../../"+ln_project+"/purchase?method=queryAuditorBySelect2", "搜索经办人");

	initBootstrapValidator();
	

	//查询交易类型
	queryTradeType();
	
	//查询部门
	queryDeptType();
	
	
	com.leanway.formReadOnly("additionalForm");
	
});
//绑定单选框状态改变事件
$("input[name=confirmstatus]").change(function(){
	com.leanway.clearTableMapData("inoutInfo");
	com.leanway.dataTableUnselectAll("inoutInfo","checkList");


	searchAdditional();
});

//搜索
function searchAdditional(){
	 confirmstatus =  $('input[name="confirmstatus"]:checked').val();
//	 additionalstatus = $('input[name="additionalstatus"]:checked').val();
    var searchValue = $("#searchValue").val();
    oTable.ajax.url("../../../"+ln_project+"/additional?method=queryAdditional&confirmstatus="+confirmstatus+"&additionalstatus=1&searchValue="+searchValue+"&tablename=additional").load();
	com.leanway.clearTableMapData("inoutInfo");
	com.leanway.dataTableUnselectAll("inoutInfo","checkList");
}

//加载datatable
function initInOutTable(){

	var table = $('#inoutInfo')
    .DataTable(
            {
                "ajax" : "../../../"+ln_project+"/additional?method=queryAdditional&additionalstatus=1&tablename=additional",
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


                  ],

                "oLanguage" : {
                    "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                },
                "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                "fnDrawCallback" : function(data) {
//                    com.leanway.getDataTableFirstRowId("inoutInfo",ajaxLoadAdditional,
//                            "more", "checkList");
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
function appendTabel(data,type){


//	$("#tbody2").html("");
	var theadhtml = "";
	var tableBodyHtml = "";


		theadhtml += "<tr>";
		theadhtml += "<th style='width: 30px'> <input type='checkbox' id='editCheckAll' name='editCheckAll' onclick='com.leanway.dataTableCheckAll(\"inoutTable\", \"editCheckAll\", \"boxid\")' class='regular-checkbox' /><label for='editCheckAll'></label></th>";
		
		theadhtml += "<th>仓库 </th>"
		theadhtml += "<th>产品编码 </th>"
		theadhtml += "<th>产品名称</th>"
		theadhtml += "<th>版本</th>"
		theadhtml += "<th>批次号</th>"
		theadhtml += "<th>产品状态</th>"
	    theadhtml += "<th>可调数量/杂出数量 </th>"
	    theadhtml += "<th>库存单位</th>"
	    theadhtml += "<th>换算率</th>"
//	    theadhtml += "<th>单价</th>"
		
//		theadhtml += "<th>批次号 </th>"
//		theadhtml += "<th>子批次号 </th>"
//		theadhtml += "<th>序列号 </th>"
		
		theadhtml += "</tr>";

		for(var i in data){
			
			var productorstatus= productorstatusToName(data[i].productorstatus);
			
	    	tableBodyHtml += "<tr>";
	    	tableBodyHtml += "<td ><input type = 'checkbox' name='boxid' id='boxid"+i+"' value= '"+data[i].additionaldetailid+"' class='regular-checkbox' ><label for='boxid"+i+"'></td>";

	    	tableBodyHtml +="<td>"+data[i].mapname+"</td>";
		    tableBodyHtml +="<td>"+data[i].productorname+"</td>";

	    	tableBodyHtml +="<td>"+data[i].productordesc+"</td>";
	    	
	       	tableBodyHtml +="<td>"+data[i].version+"</td>"
	       	tableBodyHtml +="<td>"+data[i].batch+"</td>";
	       	tableBodyHtml +="<td>"+data[i].productorstatus+"</td>";
	    	tableBodyHtml +="<td>"+data[i].count+"</td>";
	    	tableBodyHtml +="<td>"+data[i].stockunitsname+"</td>";
	    	tableBodyHtml +="<td>"+data[i].conversionrate+"</td>";
	    	
//	    	tableBodyHtml +="<td>"+data[i].price+"</td>";
	    	
//	    	tableBodyHtml +="<td>"+data[i].batch+"</td>";
//	    	tableBodyHtml +="<td>"+data[i].subbatch+"</td>";
//	    	tableBodyHtml +="<td>"+data[i].serialnumber+"</td>";	    
	    	tableBodyHtml +="<td style='display:none' ><input type='hidden' class='form-control' name='stockunits' value="+data[i].stockunits+"></td>";
	    	tableBodyHtml +="<td style='display:none' ><input type='hidden' class='form-control' name='additionalid' value="+data[i].additionalid+"></td>";
	    	tableBodyHtml += "</tr>";
	    }

	$("#inoutTable thead").html(theadhtml);
    $("#inoutTable tbody").html(tableBodyHtml);

}

//修改
function updateAdditional(){
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
	        	//费用承担部门 （部门管理）
	        	$("#deptid").prop("disabled", false);
	        	//钢包号
	        	$("#ladlenumber").prop("readonly", false);

	        	//如果该单号有数据，则可进行修改
	            if(details!=''){
	            	ope = "updateAdditional";
	            	setTableValue(details);
	            	buttonStatus(false);

	            	for(var i in details){

	  	            	 var mapid = details[i].mapid;
	  	            	 var productorid = details[i].productorid;
	  	            	 var versionid=details[i].versionid;
	  	            	 var batch =details[i].batch;
	  	            	 var subbatch = details[i].subbatch;
	  	            	 var serialnumber=details[i].serialnumber;
	  	            	 var productorstatus=details[i].productorstatus;

	  	            	 if (mapid != null && mapid != "" && mapid != "null") {
	  	            		initSelect2("#mapid"+i, "../../../"+ln_project+"/companyMap?method=queryAllStorageMap", "搜索仓库");
	  	                    $("#mapid"+i).append(
	  	                            '<option value=' + mapid + '>' + details[i].mapname
	  	                                    + '</option>');
	  	                    $("#mapid"+i).select2("val", [ mapid ]);
	  	                }

	  	                if (productorid != null && productorid != "" && productorid != "null") {
	  	                	 initSelect2("#productorid" + i,
	  	 	                        "../../../"+ln_project+"/additional?method=queryProductorByMapId&mapid="+mapid+"", "搜索产品");
	  	                    $("#productorid"+i).append(
	  	                            '<option value=' + productorid + '>' + details[i].productorname
	  	                                    + '</option>');
	  	                    $("#productorid"+i).select2("val", [ productorid ]);
	  	                }
	  	              if (versionid != null && versionid != "" && versionid != "null") {
	  	            	 initSelect2("#versionid"+i,"../../../"+ln_project+"/mapProductor?method=queryVersionByMapidAndProductorid&additionalstatus=1"+"&productorid="+productorid, "搜索版本号");
	  	                    $("#versionid"+i).append(
	  	                            '<option value=' + versionid + '>' + details[i].version
	  	                                    + '</option>');
	  	                    $("#versionid"+i).select2("val", [ versionid ]);
	  	                }
	  	              
	  	            if (batch != null && batch != "" && batch != "null") {
	  	            	initSelect2("#batch"+i,"../../../"+ln_project+"/transferStore?method=queryBatchByProductorAndMap&productorid="+$("#productorid"+i+" option:selected").val()+"&calloutmapid="+$("#mapid"+i+" option:selected").val()+"", "搜索批次号");
	  	                    $("#batch"+i).append(
	  	                            '<option value=' + batch + '>' + details[i].batch
	  	                                    + '</option>');
	  	                    $("#batch"+i).select2("val", [ batch ]);
	  	                }
	  	                
	  	          //产品状态
	  	  		   	var html="";
	  	  			
	  	  			html +="<option value='A'>合格</option>";
	  	  			html +="<option value='A1'>放行</option>";
	  	  			html +="<option value='Q'>未检</option>";
	  	  			html +="<option value='R1'>生产不良</option>";
	  	  			html +="<option value='R2'>来料不良</option>";
	  	  	html +="<option value='R3'>在制</option>";
	  	  		    $("#productorstatus"+i).html(html);
    
	  	            $("#productorstatus"+i).val(productorstatus);
	  	                
	  	             

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
	       
	       tableBodyHtml += "  <td> <select disabled='false' id='mapid"+i+"' name='mapid' style='width: 150px;'  class='form-control select2'></select></td>";
	       tableBodyHtml += "  <td> <select disabled='false' id='productorid"+i+"' name='productorid' style='width: 150px;'  class='form-control select2'></select></td>";

	    	
	       tableBodyHtml += "  <td><input  type = 'text' readonly='true' id='productordesc"+i+"' value="+data[i].productordesc+" style='width: 150px;' name='productordesc' class='form-control' /></td>";
	    	  
	       tableBodyHtml += "  <td> <select disabled='false' id='versionid"+i+"' name='versionid' style='width: 70px;'  class='form-control select2'></select></td>";
	       tableBodyHtml += "  <td> <select disabled='false' id='batch"+i+"' name='batch' style='width: 150px;'  class='form-control select2'></select></td>";
	       tableBodyHtml += "  <td> <select disabled='false' id='productorstatus"+i+"' name='productorstatus' style='width: 150px;'  class='form-control select2'></select></td>";
	       tableBodyHtml += "  <td><input  type = 'text' id='count"+i+"' value="+data[i].count+" name='count' style='width: 100px;' onkeyup='isNumber()' onafterpaste='isNumber()' class='form-control' /></td>";
	       tableBodyHtml += "  <td><input  type = 'text' readonly='true' id='stockunitsname"+i+"' value='"+data[i].stockunitsname+"' name='stockunitsname' style='width: 50px;' class='form-control' /></td>";
	       tableBodyHtml += "  <td><input  type = 'text' readonly='true' id='conversionrate"+i+"' value='"+data[i].conversionrate+"' name='conversionrate' style='width: 50px;' class='form-control' /></td>";
	       //<td><input type = 'number' id='conversionrate"+i+"' min='1' style='width: 50px' name='conversionrate1' value='1' class='form-control conversionrate' />/<input type = 'number' id='conversionrate"+i+"' min='1' style='width: 50px' name='conversionrate2' value='1' class='form-control conversionrate' /></td>
//	       tableBodyHtml += "  <td><input  type = 'text' id='price"+i+"' value='"+data[i].price+"' name='price' class='form-control' style='width: 50px;' /></td>";
//	       tableBodyHtml += "  <td> <input  type = 'text' disabled='false' id='mapname"+i+"' value='"+data[i].mapname+"' name='mapname' style='width: 100px;'  class='form-control'/></td>";
//	       tableBodyHtml += "  <td> <input  type = 'text' disabled='false' id='batch"+i+"' value='"+data[i].batch+"' name='batch' style='width: 150px;'  class='form-control'/></td>";
//	       tableBodyHtml += "  <td> <input  type = 'text' disabled='false' id='subbatch"+i+"' value='"+data[i].subbatch+"' name='subbatch' style='width: 150px;'  class='form-control'/></td>";
//
//	       tableBodyHtml += "  <td> <input disabled='false' id='serialnumber"+i+"' value='"+data[i].serialnumber+"' name='serialnumber' style='width: 150px;'  class='form-control'/></td>";

//	       tableBodyHtml += "  <td> <input  type = 'hidden' disabled='false' id='mapid"+i+"' value='"+data[i].mapid+"' name='mapid' style='width: 150px;'  class='form-control'/></td>";
	       tableBodyHtml += "  <td style='display:none'> <input class='form-control' type='hidden' id='stockunits"+i+"' name='stockunits' value ="+data[i].stockunits+" /></td>";
	       tableBodyHtml += "   <td style='display:none' ><input class='form-control' type='hidden' name='additionalid' value="+data[i].additionalid+"></td>";
	       
	       tableBodyHtml += " </tr>";

	   }


   $("#inoutTable tbody").html(tableBodyHtml);
}


//新增杂出
function addOut(){
	
	ope = 'addInOutAdditional'
	com.leanway.clearTableMapData("inoutInfo");
	com.leanway.dataTableUnselectAll("inoutInfo","checkList");
	$("#inoutTitle").text("杂出");  //改标题
	buttonStatus(false);
	
	resetForm();
	

	$("#tradetype").prop("disabled", false);
	$("#comment").prop("readonly", false);
	$("#deptid").prop("disabled", false);
	$("#ladlenumber").prop("readonly", false);

	var theadhtml = "";
		$("#inoutTable thead").html("");
		$("#inoutTable tbody").html("");
		theadhtml += "<tr>";
		theadhtml += '<th style="width: 30px"> <input type="checkbox" id="editCheckAll" name="editCheckAll" onclick="com.leanway.dataTableCheckAll(&quot;inoutTable&quot;, &quot;editCheckAll&quot;, &quot;boxid&quot;)" class="regular-checkbox" /><label for="editCheckAll"></label></th>';
		
		theadhtml += "<th>仓库 </th>"
		theadhtml += "<th>产品编码 </th>"
		theadhtml += "<th>产品名称</th>"
		theadhtml += "<th>版本</th>"
		theadhtml += "<th>批次号 </th>"
		theadhtml += "<th>产品状态 </th>"
		theadhtml += "<th>可调数量/杂出数量 </th>"
		theadhtml += "<th>库存单位 </th>"
	    theadhtml += "<th>转换率</th>"
//		theadhtml += "<th>单价 </th>"
		
//		
//		theadhtml += "<th>子批次号 </th>"
//		theadhtml += "<th>序列号 </th>"
		
		theadhtml += "</tr>";

	$("#inoutTable thead").html(theadhtml);

	addstatus="addOut";

}
//增加表格行
function addTable(){

	var i = $("#inoutTable tbody:eq(0)").find("tr").length;

	if(i!=0){
		 i = getLastIdNumber("inoutTable");
	}
	//getAttribute

	var mapid='';
	var productorid='';
	var batch='';
	var subbatch='';
	if(ope =='addInOutAdditional'){//如果是新增杂入杂出，判断新增的状态

			$("#inoutTable tbody:eq(0)").append("<tr> " +
					"<td ><input type = 'checkbox' name='boxid' id='boxid"+i+"' value='' class='regular-checkbox' ><label for='boxid"+i+"'></td>" +
					"<td><select id='mapid"+i+"' name='mapid' style='width: 150px;'  class='form-control select2'></select></td>" +
					"<td><select id='productorid"+i+"' name='productorid' style='width: 150px;'  class='form-control select2'></select></td>" +
					"<td><input type = 'text' id='productordesc"+i+"' name='productordesc' style='width: 150px;'  class='form-control' readonly='true'/></td>"+
					"<td><select id='versionid"+i+"' name='versionid' style='width: 70px;'  class='form-control select2' readonly='true'></select></td>" +					
					"<td><select id='batch"+i+"' name='batch' style='width: 150px;'  class='form-control select2'></select></td>" +
					"<td> <select id='productorstatus"+i+"' name='productorstatus' style='width: 100px;' class='form-control' ></select></td>"+
					"<td><input type = 'text' id='count"+i+"' name='count' style='width: 100px;' onkeyup='isNumber()' onafterpaste='isNumber()' class='form-control' /></td>" +
					"<td><input type = 'text' id='stockunitsname"+i+"' name='stockunitsname' style='width: 50px;'  class='form-control' readonly='true'/></td>"+
					"<td><input type = 'number' id='conversionrate"+i+"' min='1' style='width: 50px' name='conversionrate1' value='1' class='form-control conversionrate' />/<input type = 'number' id='conversionrate"+i+"' min='1' style='width: 50px' name='conversionrate2' value='1' class='form-control conversionrate' /></td>"+	
                    "<td style='display:none'> <input class='form-control' type='hidden' id='stockunits"+i+"' name='stockunits'/></td>"+
                    "<td style='display:none'> <input class='form-control' type='hidden' id='mapid"+i+"' name='mapid' /></td>"+
					" </tr>");

	}
	if(ope == 'updateAdditional'){//如果是修改杂入杂出,判断修改出入单的状态

			$("#inoutTable tbody:eq(0)").append("<tr> " +
					"<td ><input type = 'checkbox' name='boxid' id='boxid"+i+"' value='' class='regular-checkbox' ><label for='boxid"+i+"'></td>" +
					"<td><select id='mapid"+i+"' name='mapid' style='width: 150px;'  class='form-control select2'></select></td>" +
					"<td><select id='productorid"+i+"' name='productorid' style='width: 150px;'  class='form-control select2'></select></td>" +
					"<td><input type = 'text' id='productordesc"+i+"' name='productordesc' style='width: 150px;'  class='form-control' readonly='true'/></td>"+					
					"<td><select id='versionid"+i+"' name='versionid' style='width: 150px;'  class='form-control select2'></select></td>" +
					"<td><select id='batch"+i+"' name='batch' style='width: 150px;'  class='form-control select2'></select></td>" +
					"<td> <select id='productorstatus"+i+"' name='productorstatus' style='width: 100px;' class='form-control' ></select></td>"+				
					"<td><input type = 'text' id='count"+i+"' name='count' onkeyup='isNumber()' style='width: 100px;' onafterpaste='isNumber()' class='form-control' /></td>" +
					"<td><input type = 'text' id='stockunitsname"+i+"' name='stockunitsname' style='width: 50px;'  class='form-control' readonly='true'/></td>"+
					"<td><input type = 'text' id='conversionrate"+i+"' name='conversionrate' style='width: 50px;'  class='form-control' /></td>"+
					"<td style='display:none'> <input class='form-control' type='hidden' id='stockunits"+i+"' name='stockunits'/></td>"+
	                "<td style='display:none'> <input class='form-control' type='hidden' id='mapid"+i+"' name='mapid' /></td>"+
				    " </tr>");
		}

	
    var html="";
	
	html +="<option value='A'>合格</option>";
	html +="<option value='A1'>放行</option>";
	html +="<option value='Q'>未检</option>";
	html +="<option value='R1'>来料不良</option>";
	html +="<option value='R2'>生产不良</option>";
	html +="<option value='R3'>在制</option>";


    $("#productorstatus"+i).html(html);
	
	initSelect2("#mapid"+i, "../../../"+ln_project+"/companyMap?method=queryAllStorageMap", "搜索仓库");
	initSelect2("#productorid"+i,"../../../"+ln_project+"/additional?method=queryProductorByMapId&additionalstatus=1", "搜索产品");
	initSelect2("#versionid"+i,"../../../"+ln_project+"/mapProductor?method=queryVersionByMapidAndProductorid&additionalstatus=1", "搜索版本号");
	initSelect2("#batch"+i,"../../../"+ln_project+"/transferStore?method=queryBatchByProductorAndMap&productorid="+$("#productorid"+i+" option:selected").val()+"&calloutmapid="+$("#mapid"+i+" option:selected").val()+"", "搜索批次号");
	$("#mapid"+i).on("select2:select", function(e) {

		 mapid = $("#mapid"+i+" option:selected").val();

		 $("#productorid"+i).attr("disabled",false);


		//杂入：产品从仓库产品关联表里查
       initSelect2("#productorid"+i,"../../../"+ln_project+"/mapProductor?method=queryProductorByMapId&mapid="+mapid+"&additionalstatus=1", "搜索产品");
       initSelect2("#versionid"+i,"../../../"+ln_project+"/mapProductor?method=queryVersionByMapidAndProductorid&additionalstatus=1", "搜索版本号");
       initSelect2("#batch"+i,"../../../"+ln_project+"/transferStore?method=queryBatchByProductorAndMap&productorid="+$("#productorid"+i+" option:selected").val()+"&calloutmapid="+$("#mapid"+i+" option:selected").val()+"", "搜索批次号");

	})
	
	$("#productorid"+i).on("select2:select", function(e) {
		 productorid = $("#productorid"+i+" option:selected").val();
		 //根据选中产品查集来那个单位名称
		 getProductorById(productorid,i);
		 $("#versionid"+i).attr("disabled",false);
         initSelect2("#versionid"+i,"../../../"+ln_project+"/mapProductor?method=queryVersionByMapidAndProductorid&additionalstatus=1"+"&productorid="+productorid, "搜索版本号");
         initSelect2("#batch"+i,"../../../"+ln_project+"/transferStore?method=queryBatchByProductorAndMap&productorid="+$("#productorid"+i+" option:selected").val()+"&calloutmapid="+$("#mapid"+i+" option:selected").val()+"", "搜索批次号");
	});
	
	$("#versionid"+i).on("select2:select", function(e) {
		versionid = $("#versionid"+i+" option:selected").val();
        initSelect2("#batch"+i,"../../../"+ln_project+"/transferStore?method=queryBatchByProductorAndMap&productorid="+$("#productorid"+i+" option:selected").val()+"&calloutmapid="+$("#mapid"+i+" option:selected").val()+"&versionid="+versionid, "搜索批次号");
        getUnitsByProductoridAndVersionid(productorid,versionid,i,mapid);
	});
	$("#batch"+i).on("select2:select", function(e) {
			
		
			//根据选产品id,批次号，产品版本，杂出仓库，查询可调用数量
			productorid = $("#productorid"+i+" option:selected").val();
			batch = $("#batch"+i+" option:selected").val();
			versionid = $("#versionid"+i+" option:selected").val(); 
			var calloutmapid = $("#mapid"+i+" option:selected").val();
			//根据选产品id,批次号，产品版本，杂出仓库，查询可调用数量
			loadStoreInfo(productorid,batch,calloutmapid,i,versionid);
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
	
	$("#saveInOrOut").prop("disabled", true);
	$("#saveInOrOut").html("正在提交中");
	
	var formdata;

	function getConversionrate(){
		var conversionrateList = $("#inoutInfo").find("input.conversionrate");
		if(conversionrateList != null){
			$(conversionrateList).each(function(i,e){
				if(e.value == null || e.value == ""){
					return false;
				}
			})
		}else{
			return false;
		}
		return true;
	}
	
	if($("#tradetype").val() == null || $("#tradetype").val() == ""){
		lwalert("tipModal", 1, "请选择交易类型");
		return;
	}
	
	tradetype = $("#tradetype").val();
	comment = $("#comment").val();
	var deptid = $("#deptid").val();
	// 换算率
	if(!getConversionrate()){
		lwalert("tipModal", 1, "请输入换算率");
		return;
	}
	
	
	
	// 获取行ID：
	var additionalid = com.leanway.getCheckBoxData("1", "inoutInfo", "checkList");

	if(ope == 'addInOutAdditional'){
		additionalDetailList = getTableDataToJson1("inoutTable");
	} else {
		additionalDetailList = getTableDataToJson2("inoutTable");
	}
	
	$("#additionalDetailList").val(additionalDetailList);
	var form = $("#additionalForm").serializeArray();
	formdata = formatFormJson(form);
	
	$.ajax({
		type: "post",
		url : "../../../"+ln_project+"/additional",
		data : {
            "method" : ope,
            "formdata" : formdata,
            "additionalStatus" : 1,
            "additionalid":additionalid,
            "tradetype" : tradetype,
            "comment" : comment,
            "deptid" : deptid

        },
		datetype: "text",
        success : function(data) {

        	var flag =  com.leanway.checkLogind(data);

			if ( flag ) {
				var jdata = $.parseJSON(data);
	        	 if(jdata.status=='success'){

	        		 $("#saveInOrOut").prop("disabled",false);
	        		 $("#saveInOrOut").html("保存");
	        		 
	        		 com.leanway.clearTableMapData("inoutInfo");
	        	     com.leanway.dataTableUnselectAll("inoutInfo","checkList");
	        		 lwalert("tipModal", 1, jdata.info);
	        		 buttonStatus(true);

	        		 oTable.ajax.reload();

	        	 }else{
	        		 
	        		 $("#saveInOrOut").prop("disabled",false);
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

	 ids = com.leanway.getCheckBoxData(2, "inoutInfo", "checkList");
//	console.info(ids);
	if(ids.length<1 || ids ==''){
		lwalert("tipModal", 1, "请选择需要确认的单号！");
		return;
	}

	$.ajax({
		type : "post",
		url : "../../../"+ln_project+"/additional?method=confirmAdditionalAndOutStock",
		traditional: true,  //传递数组 (这里没用到  可以不配)
		data : {
			"ids" : ids,
			"additionalstatus" : 1,
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

//onkeyup="isNumber()" onafterpaste="isNumber()"
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

  			tableJson += "{\"mapid\":\""
  				+ $(this).find("td:eq(1)").find("select").val()
  				 + "\",\"productorid\":\""
  				+ $(this).find("td:eq(2)").find("select").val()
  				 + "\",\"productordesc\":\""
                  + $(this).find("td:eq(3)").find("input").val()
                  + "\",\"versionid\":\""
                  + $(this).find("td:eq(4)").find("select").val()
                  + "\",\"batch\":\""
                  + $(this).find("td:eq(5)").find("select").val()
                   + "\",\"productorstatus\":\""
                  + $(this).find("td:eq(6)").find("select").val()
                   + "\",\"count\":\""
                  + $(this).find("td:eq(7)").find("input").val()  
                  + "\",\"stockunitsname\":\""
                  + $(this).find("td:eq(8)").find("input").val()
                  + "\",\"conversionrate\":\""
                  + $(this).find("td:eq(9)").find("input[name='conversionrate1']").val()+"/"+ $(this).find("td:eq(9)").find("input[name='conversionrate2']").val()
                 
//                   + "\",\"mapid\":\""
//                  + $(this).find("td:eq(11)").find("input").val()
//                   + "\",\"price\":\""
//                  + $(this).find("td:eq(5)").find("input").val()
//                   + "\",\"batch\":\""
//                  + $(this).find("td:eq(7)").find("input").val()
//                  + "\",\"subbatch\":\""
//                  + $(this).find("td:eq(8)").find("input").val()
//                   + "\",\"serialnumber\":\""
//  		     	+ $(this).find("td:eq(9)").find("input").val();
//                  
                  if(ope == 'updateAdditional'   ){
                      
                  	tableJson += "\",\"additionaldetailid\":\""
	                    + $(this).find("td:eq(0)").find("input").val()
	                    + "\",\"additionalid\":\""
	                    + $(this).find("td:eq(9)").find("input").val()
	                    + $(this).find("td:eq(10)").find("input").val()
	                    + "\"},";
                  
                  }else{
                  	
                  	tableJson += "\"},";
                  }
                  
                  
  		
  })
  tableJson = tableJson.replace(reg, "");

  tableJson += "]";

  return tableJson;
}

//type:1 杂入。 2：杂出
function getTableDataToJson1(tableId){
    var reg = /,$/gi;

    // 解析Table数据，值为空的跳过
    var tableJson = "[";
    $("#" + tableId + " tbody:eq(0) tr").each(function(index) {

    			tableJson += "{\"mapid\":\""
    				+ $(this).find("td:eq(1)").find("select").val()
    				 + "\",\"productorid\":\""
    				+ $(this).find("td:eq(2)").find("select").val()
    				 + "\",\"productordesc\":\""
                    + $(this).find("td:eq(3)").find("input").val()
                    + "\",\"versionid\":\""
                    + $(this).find("td:eq(4)").find("select").val()
                    + "\",\"batch\":\""
                    + $(this).find("td:eq(5)").find("select").val()
                     + "\",\"productorstatus\":\""
                    + $(this).find("td:eq(6)").find("select").val()
                     + "\",\"count\":\""
                    + $(this).find("td:eq(7)").find("input").val()  
                    + "\",\"stockunitsname\":\""
                    + $(this).find("td:eq(8)").find("input").val()
                    + "\",\"conversionrate\":\""
                    + $(this).find("td:eq(9)").find("input[name='conversionrate1']").val()+"/"+ $(this).find("td:eq(9)").find("input[name='conversionrate2']").val()
                   
//                     + "\",\"mapid\":\""
//                    + $(this).find("td:eq(11)").find("input").val()
//                     + "\",\"price\":\""
//                    + $(this).find("td:eq(5)").find("input").val()
//                     + "\",\"batch\":\""
//                    + $(this).find("td:eq(7)").find("input").val()
//                    + "\",\"subbatch\":\""
//                    + $(this).find("td:eq(8)").find("input").val()
//                     + "\",\"serialnumber\":\""
//    		     	+ $(this).find("td:eq(9)").find("input").val();
//                    
                    if(ope == 'updateAdditional'   ){
                        
                    	tableJson += "\",\"additionaldetailid\":\""
	                    + $(this).find("td:eq(0)").find("input").val()
	                    + "\",\"additionalid\":\""
	                    + $(this).find("td:eq(9)").find("input").val()
	                    + $(this).find("td:eq(10)").find("input").val()
	                    + "\"},";
                    
                    }else{
                    	
                    	tableJson += "\"},";
                    }
                    
                    
    		
    })
    tableJson = tableJson.replace(reg, "");

    tableJson += "]";

    return tableJson;
}


//封装表单数据(修改)
//type:1 杂入。 2：杂出
function getTableDataToJson2(tableId){
  var reg = /,$/gi;

  // 解析Table数据，值为空的跳过
  var tableJson = "[";
  $("#" + tableId + " tbody:eq(0) tr").each(function(index) {

  			tableJson += "{\"mapid\":\""
  				+ $(this).find("td:eq(1)").find("select").val()
  				 + "\",\"productorid\":\""
  				+ $(this).find("td:eq(2)").find("select").val()
  				 + "\",\"productordesc\":\""
                  + $(this).find("td:eq(3)").find("input").val()
                  + "\",\"versionid\":\""
                  + $(this).find("td:eq(4)").find("select").val()
                  + "\",\"batch\":\""
                  + $(this).find("td:eq(5)").find("select").val()
                   + "\",\"productorstatus\":\""
                  + $(this).find("td:eq(6)").find("select").val()
                   + "\",\"count\":\""
                  + $(this).find("td:eq(7)").find("input").val()  
                  + "\",\"stockunitsname\":\""
                  + $(this).find("td:eq(8)").find("input").val()
                  + "\",\"conversionrate\":\""
                  + $(this).find("td:eq(9)").find("input").val()
                 
//                   + "\",\"mapid\":\""
//                  + $(this).find("td:eq(11)").find("input").val()
//                   + "\",\"price\":\""
//                  + $(this).find("td:eq(5)").find("input").val()
//                   + "\",\"batch\":\""
//                  + $(this).find("td:eq(7)").find("input").val()
//                  + "\",\"subbatch\":\""
//                  + $(this).find("td:eq(8)").find("input").val()
//                   + "\",\"serialnumber\":\""
//  		     	+ $(this).find("td:eq(9)").find("input").val();
//                  
                  if(ope == 'updateAdditional'   ){
                      
                  	tableJson += "\",\"additionaldetailid\":\""
	                    + $(this).find("td:eq(0)").find("input").val()
	                    + "\",\"additionalid\":\""
	                    + $(this).find("td:eq(9)").find("input").val()
	                    + $(this).find("td:eq(10)").find("input").val()
	                    + "\"},";
                  
                  }else{
                  	
                  	tableJson += "\"},";
                  }
                  
                  
  		
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

			lwalert("tipModal", 1, "请至少选择一条杂入单明细进行打印!");
			return;

		}else {

			
			var confirmstatus =  $('input[name="confirmstatus"]:checked').val();
			if(confirmstatus == 0){
				lwalert("tipModal", 1, "请确认单据后再进行打印！");
				return;
			}
			
			loadAddLabelPrintData(1);

		}
}



/**
 * 加载新增安装参数
 */
var loadAddLabelPrintData = function (type) {

	 var additionaldetailids = com.leanway.getCheckBoxData(type, "inoutTable", "boxid");

	$.ajax ( {
		type : "post",
		url : "../../../../" + ln_project + "/additional",
		data : {
			"method" : "queryAdditionalDetailByIds",
			"additionaldetailids" : additionaldetailids
		},
		dataType : "json",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {



				if (data.status == "success") {
                    var message = data.detailList;
					console.info(message)
//					//若为多个直接转到打印页面
//					if(message.length == 1){
//
//	                 	setLabelPrintFormVal( message[0] );
//
//						// 弹出modal
//						$('#labelPrintDiv').modal({backdrop: 'static', keyboard: true});
//						
//					}else{
						
						
						var printName = "其他出库标签";
						var printFile = "qtckbq";
						
						com.leanway.sendReportData(printName, printFile, message);
//					}
					
					

				} else {

					lwalert("tipModal", 1, data.info);

				}

			}
		}
	});

}



var setLabelPrintFormVal = function ( data ) {

	resetLabelPrintDivForm();
	
	$("#unitsname1").html(data.stockunitsname);
	$("#unitsname").html(data.stockunitsname);

	$("#unitsid").val(data.stockunits);
//	$("#number").val(data.count);
	for ( var item in data ) {

		$("#" + item).val(data[item]);


	}
	
	
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
		
			var printName = "其他出库标签";
			var printFile = "qtckbq";
			
			com.leanway.sendReportData(printName, printFile, message);

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
	
	for ( var item in data) {
		
			 if (item != "searchValue") {
				 $("#" + item).val(data[item]);
			 }


	}

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
/*function queryTradeType() {
	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/additional",
		data : {
			method : "queryTradeType",
			additionalstatus : 1
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
	});
}*/




function queryTradeType() {
	
	// 获取交易类型
	$.ajax({
		url: "../../../../" + ln_project + "/codeMap",
		type: "post",
		data: {
			"method" : "queryCodeMapList",
			"t":"OtherOutgoingBills",
			"c":"OtherOutgoingBills"
		},
		dataType: "json",
		success: function(data){
			// 清空数据
			$("#tradetype").empty();
			// 把信息放入select
			var option = "<option value=''>--请选择--</option>";
			$.each(data,function(index,e) {
				option += "<option value='"+ e.codevalue +"'>";
				option += e.note;
				option += "</option>";
			});
			$("#tradetype").append(option);
		}
	});
}


function queryDeptType() {
	
	// 获取部门
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


//初始化单位类型下拉框
//var setTradeType = function(data) {
//	var html = "";
//
//	for (var i in data) {
//		//拼接option
//		html +="<option value="+ data[i].codenum+">"+ data[i].codevalue+"</option>";
//	}
//
//	$("#tradetype").html(html);
//}

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
			"additionalstatus" : 1,
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
 * 产品状态转换
 */
function productorstatusToName(status) {
	
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


/**
 * 根据id查询产品信息
 */
function getUnitsByProductoridAndVersionid(productorid,versionid,line,mapid) {
	$.ajax({
		type : "POST",
		url : "../../../"+ln_project+"/productionStage",
		data : {
			 "method" : "getUnitsByProductoridAndVersionid",
	         "productorid" : productorid,
	         "versionid" : versionid,
	         "toptypecode" : "14",
	         "mapid" : mapid
		},
		dataType : "text",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				 var tempData = $.parseJSON(data);
				 $("#stockunits"+line).val(tempData.result.unitsid);
				 $("#stockunitsname"+line).val(tempData.result.unitsname);
	 
			}
		},
		error : function(data) {

		}
	});
}



//加载可杂出数量
function loadStoreInfo(productorid,batch,calloutmapid,line,versionid){
    $.ajax({
        type : "get",
        url : "../../../../"+ln_project+"/transferStore",
        data : {
            method : "queryStoreInfo",
            "productorid" : productorid,
            "batch":batch,
            "calloutmapid":calloutmapid,  //杂出仓库
            "versionid":versionid
        },
        dataType : "json",
        success : function(data) {
            var flag =  com.leanway.checkLogind(data);
            if(flag){
            	if(data!=null){
                     $("#count"+line).val(data.count);  
            	}else{
            		 $("#count"+line).val("");  
            	}
            }
        },
    });
}