/**
 * 初始化产品表数据
 */
var initTable = function(datatableId) {

	var ajax;
	var aoColumns;
	var columns;
	if(datatableId=="generalInfo"){

		ajax ="../../../../"+ln_project+"/productors?method=findAllProductors&reback=Y";

		columns=[ {
			"data" : "productorid"
		} ];

		aoColumns=[
         {
      	   "mDataProp": "productorid",
      	   "fnCreatedCell" : function(nTd, sData,
      			   oData, iRow, iCol) {
      		   $(nTd)
      		   .html("<div id='stopPropagation" + iRow +"'>"
      				   +"<input class='regular-checkbox' type='checkbox' id='"
      				   + sData
      				   + "' name='checkList' value='"
      				   + sData
      				   + "'><label for='"
      				   + sData
      				   + "'></label> </div>");
                 com.leanway.columnTdBindSelectNew(nTd,"generalInfo","checkList");
      	   }
         },
         {"mDataProp": "productorname"},
         {"mDataProp": "productordesc" },
         ];

	}else if(datatableId=="mouldtable"){

		ajax="../../../../"+ln_project+"/mould?method=findAllMould&reback=Y";
		columns=[
         {"data" : "mouldid"},
         { "data": "mouldname" },
         { "data": "compid" },
         ];
		aoColumns=[
                   {
                 	  "mDataProp": "mouldid",
                 	  "fnCreatedCell" : function(nTd, sData,
                 			  oData, iRow, iCol) {
                 		  $(nTd)
                 		  .html("<div id='stopPropagation" + iRow +"'>"
                 				  +"<input class='regular-checkbox' type='checkbox' id='"
                 				  + sData
                 				  + "' name='checkList' value='"
                 				  + sData
                 				  + "'><label for='"
                 				  + sData
                 				  + "'></label>");
                 		  com.leanway.columnTdBindSelectNew(nTd,"mouldtable","checkList");
                 	  }
                   },
                   {"mDataProp": "mouldname"}
                   ];

	}else if(datatableId=="processRouteDataTable"){

		ajax="../../../../"+ln_project+"/processRoute?method=queryProcessRoute&reback=Y";
		columns= [ {
			"data" : "routeid"
		}, {
			"data" : "name"
		}, {
			"data" : "routecode"
		}, {
			"data" : "shortname"
		}, {
			"data" : "code"
		} ];

		aoColumns = [
						{
							"mDataProp" : "routeid",
							 "fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {
                                   $(nTd).html(
                                   		"<div id='stopPropagation"
											+ iRow
											+ "'>"
											+"<input class='regular-checkbox' type='checkbox' id='" + sData
                                                   + "' name='checkList' value='" + sData
                                                   + "'><label for='" + sData
                                                   + "'></label>");
                                   com.leanway.columnTdBindSelectNew(nTd,"processRouteDataTable", "checkList");
                               }
						}, {
							"mDataProp" : "name"
						}, {
							"mDataProp" : "routecode"
						}, {
							"mDataProp" : "shortname"
						}, {
							"mDataProp" : "code"
						} ];
	}else if(datatableId=="businessDataTable"){

		ajax = "../../../../"+ln_project+"/business?method=querybusinessByConditons&reback=Y";
		columns = [ {
 			"data" : "companioname"
 		}, {
 			"data" : "shortname"
 		}, {
 			"data" : "manager"
 		}, {
 			"data" : "phone"
 		} ];
		 aoColumns= [

                      {
                          "mDataProp" : "companionid",
                        "fnCreatedCell" : function(nTd, sData,
									oData, iRow, iCol) {
								$(nTd)
										.html(
												"<div id='stopPropagation"
												+ iRow
												+ "'>"
												+"<input class='regular-checkbox' type='checkbox' id='"
														+ sData
														+ "' name='checkList' value='"
														+ sData
														+ "'><label for='"
														+ sData
														+ "'></label>");
								com.leanway.columnTdBindSelectNew(nTd,"businessDataTable", "checkList");
							}
                      },{
		            	   "mDataProp" : "companioname"
		               }, {
		            	   "mDataProp" : "shortname"
		               }, {
		            	   "mDataProp" : "manager"
		               } , {
		            	   "mDataProp" : "phone"
		               }];


	}else if(datatableId=="localServerDataTable"){

		ajax="../../../../"+ln_project+"/localServer?method=queryLocalServer&reback=Y";
		columns = [ {
			"data" : "serverid"
		}, {
			"data" : "clientname"
		}, {
			"data" : "mac"
		} ];
		aoColumns = [
		               {
		            	   "mDataProp" : "serverid",
		            	   "fnCreatedCell" : function(nTd, sData,
		            			   oData, iRow, iCol) {
		            		   $(nTd)
		            		   .html(
		            				   "<div id='stopPropagation"
										+ iRow
										+ "'>"
										+"<input class='regular-checkbox' type='checkbox' id='"
		            				   + sData
		            				   + "' name='checkList' value='"
		            				   + sData
		            				   + "'><label for='"
		            				   + sData
		            				   + "'></label>");
		            		   com.leanway.columnTdBindSelectNew(nTd,"localServerDataTable", "checkList");
		            	   }
		               }, {
		            	   "mDataProp" : "clientname",
		               }, {
		            	   "mDataProp" : "mac"
		               } ];

	}else if(datatableId=="bomDataTable"){


		ajax = "../../../../"+ln_project+"/bom?method=queryBomBySearch&reback=Y";
		columns = [
		           {"data" : "bomid"},
		                { "data": "productorname" },
		                { "data": "productordesc" },
		                { "data": "gproductorname" },
		                { "data": "gproductordesc" },
		                { "data": "pproductorname" },
		                { "data": "pproductordesc" }
		                ];
		aoColumns = [
		               {
		            	   "mDataProp" : "bomid",
		            	   "fnCreatedCell" : function(nTd, sData,
		            			   oData, iRow, iCol) {
		            		   $(nTd)
		            		   .html(
		            				   "<div id='stopPropagation"
										+ iRow
										+ "'>"
										+"<input class='regular-checkbox' type='checkbox' id='"
		            				   + sData
		            				   + "' name='checkList' value='"
		            				   + sData
		            				   + "'><label for='"
		            				   + sData
		            				   + "'></label>");
		            		   com.leanway.columnTdBindSelectNew(nTd,"bomDataTable", "checkList");
		            	   }
		               },
		               {"mDataProp": "productorname"},
		               {"mDataProp": "productordesc"},
		               {"mDataProp": "gproductorname"},
		               {"mDataProp": "gproductordesc"},
		               {"mDataProp": "pproductorname"},
		               {"mDataProp": "pproductordesc"}
		               ];

	}


	var table = $("#"+datatableId).DataTable(
			{
				"ajax" :ajax ,

				//	"iDisplayLength" : "10",
				'bPaginate' : true,
				"bDestory" : true,
				"bRetrieve" : true,
				"bFilter" : false,
				"bSort" : false,
				"scrollY":"360px",
				"bAutoWidth": true,  //宽度自适应
				"bProcessing" : true,
				"bServerSide" : true,
				'searchDelay' : "5000",
				"columns" : columns,
				"aoColumns" : aoColumns,
				 "oLanguage" : {
				            	   "sUrl" : "../../../jslib/datatables/zh-CN.txt"
				               },
				               "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
				               "fnDrawCallback" : function(data) {

				            	/*   com.leanway.getDataTableFirstRowId("generalInfo",
				            			   ajaxLoadProductors, "more","checkList");*/

				            	   //点击事件
				            	 //  com.leanway.dataTableClickMoreSelect("generalInfo","checkList",false,oTable,ajaxLoadProductors,undefined,undefined);


				               },

			});

	return table;
}

/**
 * 删除数据
 * */
var retableId;
function rebackdata(datatableId){

    colmap = tabmap.get(datatableId);
    retableId=datatableId;
	if (colmap!=undefined) {
		lwalert("tipModal", 2, "确定要还原选中项吗?","isSureRebackData()");
	} else {
		lwalert("tipModal", 1, "至少选择一条记录进行还原操作！");
	}
}
function isSureRebackData(){


    var ids = com.leanway.getDataTableMapIds(retableId);

    rebackDataAjax(ids,retableId);
}
var rebackDataAjax = function(ids,datatableId) {
	var url;
	var data;
	if(datatableId=="generalInfo"){

		url ="../../../../"+ln_project+"/productors";
		data= {method : "rebackProductors","conditions" : '{"productorids":"' + ids + '"}'}
	}else if(datatableId=="mouldtable"){
		//模具还原操作

		url = "../../../../"+ln_project+"/mould";
		data = {
			method:"deleteMould",
			"reback":"Y",
			"conditions" : '{"mouldids":"' + ids + '"}'
		};


	}else if(datatableId=="processRouteDataTable"){
		url = "../../../../"+ln_project+"/processRoute";
		data = {
			method : "deleteProcessRouteByConditions",
			"reback":"Y",
			conditions : '{"processRouteIds":"' + ids + '"}'
		};
	}else if(datatableId=="businessDataTable"){

		url = "../../../../"+ln_project+"/business?method=deletebusiness";
		data = {
			"reback":"Y",
			"conditions" : '{"companionid":"' + ids + '"}'
		};

	}else if(datatableId=="localServerDataTable"){

		url = "../../../../"+ln_project+"/localServer";
		data = {
			method : "deleteLocalServerByConditons",
			"reback":"Y",
			conditions : '{"serverIds":"' + ids + '"}'

		};
	}else if(datatableId=="bomDataTable"){
		url = "../../../../"+ln_project+"/bom?method=rebackBom";
		data = {

				"conditions" : '{"bomIds":"' + ids + '"}'
			};
	}


	$.ajax({

		type : "post",
		url :url ,
		data :data,

		dataType : "text",
		async : false,

		success : function(text) {
			var flag =  com.leanway.checkLogind(text);

			if(flag){
			    var tempData = $.parseJSON(text);

				oTable.ajax.reload();
			}
		}
	});

}


var flag=0;

//数据table
var oTable;
var aTable
function clickOthers2(datatableId){

	oTable = initTable(datatableId);

	aTable=initTable(datatableId);
}

var searchBom= function () {
	//checkSession();
	var searchVal = $("#searchValue").val();
	aTable.ajax.url("../../../../"+ln_project+"/bom?method=queryBomBySearch&searchValue=" + searchVal).load();

}
