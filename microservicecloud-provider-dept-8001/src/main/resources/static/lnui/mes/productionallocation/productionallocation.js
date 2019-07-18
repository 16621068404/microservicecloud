var oTable;

$(function() {

	//搜索产品
	com.leanway.initSelect2("#productorid","../../../"+ln_project+"/productors?method=queryProductorBySearch", "搜索产品");
	//搜索生产订单
	com.leanway.initSelect2("#productionorderid", "../../../"+ln_project+"/productionTrack?method=queryProductionOrderName", "请输入生产订单编号");

	oTable = initTable();
});


////触发select2选择事件，给隐藏域赋值
//$("#productorname").on("select2:select", function(e) {
//	
//	$("#productorname").val($(this).find("option:selected").text());
//	$("#productorid").val($(this).find("option:selected").val());
//	console.info($(this).find("option:selected").text())
//	console.info($(this).find("option:selected").val())
//});
//
////触发select2选择事件，给隐藏域赋值
//$("#productionordernumber").on("select2:select", function(e) {
//	$("#productionordernumber").val($(this).find("option:selected").text());
//	$("#productionorderid").val($(this).find("option:selected").val());
//	console.info($(this).find("option:selected").text())
//	console.info($(this).find("option:selected").val())
//});


function queryAllocationList(){

	var productorid  = $("#productorid").val();
	var productionorderid = $("#productionorderid").val();
    showMask();
	oTable.ajax.url(
			"../../../../"+ln_project+"/productionOrder?method=queryAllocationList&productorid="+productorid+"&productionorderid="+productionorderid).load();
	hideMask();
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
  
//初始化标准工序数据表格
  var initTable = function() {
	  
	var productorid  = $("#productorid").val();
	var productionorderid = $("#productionorderid").val();
  	var table = $('#allocationDataTable')
  			.DataTable(
  					{
  						"ajax" : "../../../../"+ln_project+"/productionOrder?method=queryAllocationList&productorid="+productorid+"&productionorderid="+productionorderid,
  						//"iDisplayLength" : "10",
//  						"scrollY":"250px",
  						'bPaginate' : true,
  						"bDestory" : true,
  						"bRetrieve" : true,
  						"bFilter" : false,
  						"bSort" : false,
  						"bAutoWidth": true,  //宽度自适应
  						"bProcessing" : true,
  						"bServerSide" : true,
  						'searchDelay' : "5000",
  						"columns" : [{
  							"data" : "productorname"
  						}, {
  							"data" : "productordesc"
  						}, {
  							"data" : "allocationtype"
  						}, {
  							"data" : "stockunits"
  						}, {
  							"data" : "certificateno"
  						}, {
  							"data" : "mapid"
  						}, {
  							"data" : "batch"
  						}, {
  							"data" : "subbatch"
  						}, {
  							"data" : "serialnumber"
  						}, {
  							"data" : "count"
  						}, {
  							"data" : "pproductorname"
  						}],
  						"aoColumns" : [
  							    {
  									"mDataProp" : "productorname",
  								}, {
  									"mDataProp" : "productordesc"
  								}, {
  									"mDataProp" : "allocationtype"
  								}, {
  									"mDataProp" : "stockunits"
  								}, {
  									"mDataProp" : "certificateno"
  								}, {
  									"mDataProp" : "mapid"
  								}, {
  									"mDataProp" : "batch"
  								}, {
  									"mDataProp" : "subbatch"
  								}, {
  									"mDataProp" : "serialnumber"
  								}, {
  									"mDataProp" : "count"
  								}, {
  									"mDataProp" : "pproductorname"
  								}
  						],

  						"oLanguage" : {
  				        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
  				         },
  						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
  						"fnDrawCallback" : function(data) {

  							
  						}

  					}).on('xhr.dt', function (e, settings, json) {
  						com.leanway.checkLogind(json);
  					} );

  	return table;
  }