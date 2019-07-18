var productorTable;
var batchSerialNumberTable;
var storeInfoTable;
var trackSourceTable;
var clicktime = new Date();

$( function ( ) {
	
	// 初始化对象
	com.leanway.loadTags();
	
	// 初始化产品datatable
	productorTable = initProductorTable( );
	
	// DataTable是否多选及选中后触发的事件
	com.leanway.dataTableClickMoreSelect("showProductorTable", "productorCheck",false, productorTable, undefined, loadbatchSerialNumber, undefined);
	com.leanway.dataTableClickMoreSelect("batchSerialNumberTable", "checkList",false, batchSerialNumberTable, undefined, loadTrackSourceTable, undefined);
   
	//enter键时候触发查询
	com.leanway.enterKeyDown("searchValue", searchProductors);

} );

var productorTrack = function ( ) {
	
	var productorId =  productorTable.rows('.row_selected').data()[0].userId;
	
}

var productorSource = function ( ) {
	
}

var loadbatchSerialNumber = function ( productorId ) {
	
	//显示选中产品批次信息
	if (batchSerialNumberTable == null || batchSerialNumberTable == "undefined" || typeof(batchSerialNumberTable) == "undefined") {
		batchSerialNumberTable = initBatchSerialNumberTable(productorId);
	} else {
		batchSerialNumberTable.ajax.url('../../../../'+ln_project+'/productors?method=queryProductorBatchSerialNumber&productorId=' + productorId).load();
	}
	
	//右侧上方产品名称及库存数量
	loadStoreInfo(productorId);
	
	//显示选中产品仓库存货信息
	if (storeInfoTable == null || storeInfoTable == "undefined" || typeof(storeInfoTable) == "undefined") {
		storeInfoTable = initStoreInfoTable(productorId);
	} else {
		storeInfoTable.ajax.url('../../../../'+ln_project+'/inoutstockOrder?method=queryStoreInfoByProductorid&productorId=' + productorId).load();
	}

}

var initProductorTable = function ( ) {
 
	var table = $('#showProductorTable').DataTable( {
		"ajax": '../../../../'+ln_project+'/productors?method=queryProductorInfo',
		'bPaginate' : true,
		"bDestory" : true,
		"bRetrieve" : true,
		"bFilter" : false,
//		"scrollX" : true,
		"scrollY" : "200px",
		"bSort" : false,
		"bProcessing" : true,
		"bServerSide" : true,
		"aoColumns" : [
		  {"mDataProp" : "productorid",
    	  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
    		  $(nTd).html("<div id='stopPropagation" + iRow +"'>"
    				  +"<input class='regular-checkbox' type='checkbox' id='"
    				  + sData
    				  + "' name='productorCheck' value='"
    				  + sData
    				  + "'><label for='"
    				  + sData
    				  + "'></label>");
    		  com.leanway.columnTdBindSelect(nTd);
    	  }
		  },
		  {"mDataProp" : "productordesc"},
	      {"mDataProp" : "productortypename"}
	   ],
      "fnCreatedRow": function ( nRow, aData, iDataIndex ) {

      },
      "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
      "oLanguage" : {
    	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
      }
	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );

	return table;
}

var initBatchSerialNumberTable = function( productorId ) {
	
	var table = $('#batchSerialNumberTable').DataTable( {
		"ajax": '../../../../'+ln_project+'/productors?method=queryProductorBatchSerialNumber&productorId=' + productorId,
		'bPaginate' : true,
		"bDestory" : true,
		"bRetrieve" : true,
		"bFilter" : false,
//		"scrollX" : true,
		"scrollY" : "200px",
		"bSort" : false,
		"bProcessing" : true,
		"bServerSide" : true,
		"aoColumns" : [
        {"mDataProp" : "mapproductordetailid",
		  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
			  $(nTd).html("<div id='stopPropagation" + iRow +"'>"
					  +"<input class='regular-checkbox' type='checkbox' id='"
					  + sData
					  + "' name='checkList' value='"
					  + sData
					  + "'><label for='"
					  + sData
					  + "'></label>");
			  com.leanway.columnTdBindSelect(nTd);
		  }
	      },
		  {"mDataProp" : "batch"},
	      {"mDataProp" : "subbatch"},
	      {"mDataProp" : "serialnumber"}
	   ],
      "fnCreatedRow": function ( nRow, aData, iDataIndex ) {

      },
      "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
      "oLanguage" : {
    	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
      }
	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );
	
	return table;
}

var searchProductors = function () {

	var searchVal = $("#searchValue").val();

	productorTable.ajax.url("../../../../"+ln_project+"/productors?method=queryProductorInfo&searchValue=" + searchVal).load();
}

function loadStoreInfo(productorId){
    $.ajax({
        type : "get",
        url : "../../../../"+ln_project+"/transferStore",
        data : {
            method : "queryStoreInfo",
            "productorid" : productorId,           
        },
        dataType : "json",
        success : function(data) {
            var flag =  com.leanway.checkLogind(data);

            if(flag){
            	
            	resetForm();
            	
            	if(data != null && data != "undefined" && typeof(data) != "undefined"){
            		 $("#productorName").val(data.productorname);
                     $("#productorCount").val(data.count);
            	}
            	               
            }

        },

    });
}

var initStoreInfoTable = function( productorId ) {
	
	var table = $('#storeInfoTable').DataTable( {
		"ajax": '../../../../'+ln_project+'/inoutstockOrder?method=queryStoreInfoByProductorid&productorId=' + productorId,
		'bPaginate' : true,
		"bDestory" : true,
		"bRetrieve" : true,
		"bFilter" : false,
//		"scrollX" : true,
		"scrollY" : "120px",
		"bSort" : false,
		"bProcessing" : true,
		"bServerSide" : true,
		"aoColumns" : [
		  {"mDataProp" : "mapname"},
	      {"mDataProp" : "areaname"},
		  {"mDataProp" : "locationname"},
	      {"mDataProp" : "shelvename"},
		  {"mDataProp" : "count"}
	   ],
      "fnCreatedRow": function ( nRow, aData, iDataIndex ) {

      },
      "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
      "oLanguage" : {
    	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
      }
	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );
	
	return table;
}

var resetForm = function () {
    $( '#productorData' ).each( function ( index ) {
        $('#productorData')[index].reset( );
    });
}

var initTrackSourceTable = function( mapproductordetailid ) {
	
	var table = $('#trackSourceTable').DataTable( {
		"ajax": '../../../../'+ln_project+'/inoutstockOrder?method=queryResourceProductorInfo&mapproductordetailid=' + mapproductordetailid,
		'bPaginate' : true,
		"bDestory" : true,
		"bRetrieve" : true,
		"bFilter" : false,
//		"scrollX" : true,
		"scrollY" : "140px",
		"bSort" : false,
		"bProcessing" : true,
		"bServerSide" : true,
		"aoColumns" : [
		  {"mDataProp" : "time"},
	      {"mDataProp" : "productorname"},
		  {"mDataProp" : "productortypename"},
	      {"mDataProp" : "count"},
		  {"mDataProp" : "name"},
		  {"mDataProp" : "invoiceid"},
		  {"mDataProp" : "trackid"},
		  {"mDataProp" : "orderid"},
		  {"mDataProp" : "productionorderid"},
		  {"mDataProp" : "salesorderid"},
		  {"mDataProp" : "contractno"}
	   ],
      "fnCreatedRow": function ( nRow, aData, iDataIndex ) {

      },
      "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
      "oLanguage" : {
    	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
      }
	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );
	
	return table;
}

var loadTrackSourceTable = function ( mapproductordetailid ) {		
	
	//显示选中产品批次信息
	if (trackSourceTable == null || trackSourceTable == "undefined" || typeof(trackSourceTable) == "undefined") {
		trackSourceTable = initTrackSourceTable(mapproductordetailid);
	} else {
		trackSourceTable.ajax.url('../../../../'+ln_project+'/inoutstockOrder?method=queryResourceProductorInfo&mapproductordetailid=' + mapproductordetailid).load();
	}
}