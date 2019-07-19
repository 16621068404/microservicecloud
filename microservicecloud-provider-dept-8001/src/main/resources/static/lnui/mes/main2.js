var sysBugTable;
$ ( function ( ) {


	// 初始化系统BUG表
	sysBugTable = initSysBugTable();
	// enter键时候触发查询
	//com.leanway.enterKeyDown("searchValue", searchPurchaseOrder);
	// 加载数据验证
	//initBootstrapValidator();

});

/**
 * 
 * 初始化系统BUG表
 * 
 */
var initSysBugTable = function ( ) {
	var editTable = $("#sysBugTable").DataTable({
			"ajax" : 'http://127.0.0.1:8001/sysBugController/findSysBugList',
			"iDisplayLength" : 10,
			'bPaginate': true,
			"bDestory": true,
			"bRetrieve": true,
			"bFilter":false,
			"bSort": false,
			"bProcessing": true,
			"bServerSide": true,
			"bInfo" : true,
			"aoColumns" : [
			{
				"mDataProp" : "bug_id",      //产品id
				"fnCreatedCell" : function(nTd, sData,
						oData, iRow, iCol) {
					$(nTd).html("<input class='regular-checkbox' type='checkbox' id='" + sData
	                                   + "' name='BugCheckList' value='" + sData
	                                   + "'><label for='" + sData
	                                   + "'></label>");
					com.leanway.columnTdBindSelectNew(nTd,"sysBugTable","BugCheckList");
				}
			},
			{
				"mDataProp" : "bug_id"          //bug编号
			},
			{
				"mDataProp" : "module_name",    //bug模块
			},
			{
				"mDataProp" : "bug_type"        //bug类型
			},
			{
				"mDataProp" : "status"          //bug状态
			},
			{
				"mDataProp" : "create_username" //创建者
			},
			{
				"mDataProp" : "modify_username" //修改者
				
			}
			],
			"aoColumnDefs" : [ {
				"sDefaultContent": "",
				 "aTargets": [ "_all" ]
			} ],
			"language" : {
				"sUrl" : "../../jslib/datatables/zh-CN.txt"
			},
			"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
			"fnDrawCallback" : function(data) {
				 com.leanway.dataTableUnselectAll("sysBugTable","bugIdkAll");
            	 com.leanway.setDataTableSelectNew("sysBugTable",null, "BugCheckList", null);
            	 com.leanway.dataTableClick("sysBugTable", "BugCheckList", true , sysBugTable);
				
			}

		}).on('xhr.dt', function (e, settings, json) {
			com.leanway.checkLogind(json);
			
		} );
	return editTable;
}

//页面强制刷新  相当于   Ctrl + F5
var refresh = function ( ) {
	//reload()方法  有一个参数
    //false  可以从缓存中读取，      相当于 f5
    //true   强制从服务器获取页面  相当于 Ctrl + f5
    location.reload(true);  //===================================刷新
	
}
