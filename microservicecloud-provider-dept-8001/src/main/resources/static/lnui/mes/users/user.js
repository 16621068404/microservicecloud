
	// 操作方法, 新增或者修改
	var ope = "add";

	// 新增标题
	var addTitle = "新增用户";

	// 修改标题
	var updateTitle = "修改用户";

	// 数据table
	var oTable;

	// 雇员
	var employeeTable;

	var clicktime = new Date();

	$ ( function () {

		// 初始化对象
		com.leanway.loadTags();

		// 加载datagrid
		oTable = initTable();

		//加载数据验证
		initBootstrapValidator();

		// 保存按钮绑定事件
		$("#saveUser").click( saveUser );

		$("#updateUser").click( updateUser );

		// 保存角色关联事件
		$("#saveUserRole").click( saveUserRole );

		// 关联雇员
		$("#saveUserEmployee").click( saveUserEmployee );

		// 全选
		com.leanway.dataTableCheckAll("grid-data", "checkAll", "checkList");
		com.leanway.dataTableCheckAll("employeeTables", "employeeCheckAll", "employeeCheckList");
		com.leanway.initTimePickYmdForMoreId("#startTime,#endTime");

		// enter键时候触发查询
		com.leanway.enterKeyDown("searchValue", searchUsers);
		com.leanway.enterKeyDown("searchEmployee", searchEmployee);


//	    $("#startTime").datetimepicker({
//	    	lang:'ch',
//	    	format:"Y-m-d",      //格式化日期
//	    	timepicker:false,    //关闭时间选项
//	    	yearStart:2000,     //设置最小年份
//	    	yearEnd:2050,        //设置最大年份
//	    	todayButton:false    //关闭选择今天按钮
//
//	    });
//
//	    $("#endTime").datetimepicker({
//	    	lang:'ch',
//	    	format:"Y-m-d",      //格式化日期
//	    	timepicker:false,    //关闭时间选项
//	    	yearStart:2000,     //设置最小年份
//	    	yearEnd:2050,        //设置最大年份
//	    	todayButton:false    //关闭选择今天按钮
//
//	    });

/*	    $("#startTime").daterangepicker({
	    	singleDatePicker: true,
	    	format : 'YYYY-MM-DD'
	    });*/


	});


	//查询
	var searchEmployee = function ( ) {

		var searchVal = $("#searchEmployee").val();

		 /*  {"mDataProp": "name"},
           {"mDataProp": "compname"},
           {"mDataProp": "post"},
           {"mDataProp": "moble"},*/
	   // employeeTable.ajax.url('../../employee?method=queryEmployeesByConditons&conditions={"flag":"1","name":"' + conditions + '"}&page={"currentPage":"1"}&searchValue="' + searchVal).load();
		//
		employeeTable.ajax.url("../../../../"+ln_project+"/employee?method=queryEmployeesByComID&searchValue=" + searchVal + "&conditions=").load();

	}

	var searchUsers = function () {

		var searchVal = $("#searchValue").val();

		oTable.ajax.url("../../../../"+ln_project+"/user?method=getUserList&searchValue=" + searchVal).load();
	}


	// 初始化数据表格
	var initTable = function () {

		var table = $('#grid-data').DataTable( {
				"ajax": "../../../../"+ln_project+"/user?method=getUserList", //对应spring里面的‘/user’bean,method为class里面的方法,方法名不能错。
		        'bPaginate': true, //是否显示分页
		        "bDestory": true,  //重新调用插件
		        "bRetrieve": true, //是否允许从新生成表格
		        "bFilter":false,  //是否启动过滤、搜索功能
		        "bSort": false,  //是否启动各个字段的排序功能
		        "bProcessing": true, //DataTables载入数据时，是否显示‘进度’提示
		        "bServerSide": true,  //是否启动服务器端数据导入
		        'searchDelay':"5000", //
		        "columns": [  //对应页面显示的字段
	                {"data" : "userId"}, //对应html的字段名，id要一致
	                { "data": "userName" },
	                { "data": "compName" },
	                { "data": "employeeName" },
	                { "data": "mobile" },
	                { "data": "phone" },
	                { "data": "wechat" },
	                { "data": "regist" },
	                { "data": "startTime"},
	                { "data": "endTime"}
		         ],
		         "aoColumns": [ //对应页面需要加载出来的数据名
		               {
		            	   "mDataProp": "userId",
		                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {  //格式固定,向页面新添新的东西。
		                	   $(nTd)
		            		   .html("<div id='stopPropagation" + iRow +"'>"
		            				   +"<input class='regular-checkbox' type='checkbox' id='"
		            				   + sData
		            				   + "' name='checkList' value='"
		            				   + sData
		            				   + "'><label for='"
		            				   + sData
		            				   + "'></label> </div>");
		                	    com.leanway.columnTdBindSelectNew(nTd,"grid-data","checkList");  //datatable(grid-data)第一列绑定checkBoxName(checkList)选中事件

		                   }
		               },
		               {"mDataProp": "userName"},  //ajax后台过来的数据，需要跟bean里面的属性一致。
		               {"mDataProp": "compName"},
		               {"mDataProp": "employeeName"},
		               {"mDataProp": "mobile"},
		               {"mDataProp": "phone"},
		               {"mDataProp": "wechat"},
		               {"mDataProp": "regist"}
/*		               { "mDataProp": "startTime"},
		               { "mDataProp": "endTime"}*/

		          ],
		          "fnCreatedRow": function ( nRow, aData, iDataIndex ) { //创建行得时候的回调函数
		              //add selected class
		        	 /* $(nRow).click(function () {

		                  if ($(this).hasClass('row_selected')) {
		                      $(this).removeClass('row_selected');
		                      $(this).find('td').eq(0).find("input[name='checkList']").prop("checked", false)
		                  } else {
		                      oTable.$('tr.row_selected').removeClass('row_selected');
		                      $(this).addClass('row_selected');
		                      $("input[name='checkList']").prop("checked", false);
		                      $(this).find('td').eq(0).find("input[name='checkList']").prop("checked", true)
		                  }
		              });*/
		          },
		         "oLanguage" : { //国际化
		        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		         },
		         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		         "fnDrawCallback" : function(data) {  //draw画 ，这个应该是重绘的回调函数

	/*			       	  com.leanway.setDataTableSelectNew("grid-data",
				                  null, "checkList", null);
*/
		            	   //点击事件
		        	 		//设置DataTable能否选择多条数据及选则后出发（把勾选的数据存在map,前面的checkBox有div）
		            	   com.leanway.dataTableClickMoreSelect("grid-data","checkList",false,oTable,undefined,undefined,undefined,"checkAll");

	//	            	   com.leanway.dataTableCheckAllCheck('grid-data', 'checkAll', 'checkList');
		         },

		    } ).on('xhr.dt', function (e, settings, json) {  //为指定元素的一个或多个事件绑定事件处理函数。
				com.leanway.checkLogind(json);  //检查登录状态
			} );


		return table;
	}

	var saveUserEmployee = function () {

		// 从oTable(自定义的初始化用表中)提取选中的行的userId(就是这样写的)
		var userId = oTable.rows('.row_selected').data()[0].userId;
		//var userName = oTable.rows('.row_selected').data()[0].userName;
		var employeeId = "";
		//判断选中行的长度
		if (employeeTable.rows('.row_selected').data().length == 0) {
			lwalert("tipModal", 2, "确定解绑用户【" + oTable.rows('.row_selected').data()[0].userName + "】的雇员关联关系?","isSureSave()");
//			if (confirm("确定解绑用户【" + userName + "】的雇员关联关系?")) {
//				ajaxSaveUserEmployee(userId,employeeId );
//			}

		} else if (employeeTable.rows('.row_selected').data().length > 1){

//			alert("请选择一位雇佣进行关联！");
			lwalert("tipModal", 1, "请选择一位雇佣关联！");
			return;

		}else  {

			  // 雇员ID
			  employeeId = employeeTable.rows('.row_selected').data()[0].employeeid;

			  userName = $("#userNamePost").val();
			  //保存用户雇员
			  ajaxSaveUserEmployee(userId,employeeId, userName);
		}

	}
	//保存选中的用户雇员
	function isSureSave(){
		// 从oTable(自定义的初始化用表中)提取选中的行的userId(就是这样写的)
		var userId = oTable.rows('.row_selected').data()[0].userId;
		var userName = oTable.rows('.row_selected').data()[0].userName;

		var employeeId = "";
		ajaxSaveUserEmployee(userId,employeeId, userName);
	}
	var ajaxSaveUserEmployee = function (userId, employeeId, userName) {

		$.ajax ( {
			type : "post",
			url : "../../../../"+ln_project+"/user",
			data : {
				"method" : "saveUserEmployee",
				"userId" : userId,
				"employeeId" : employeeId,
				"userName" : userName
			},
			dataType : "text",  //数据类型，前台传到后台的数据类型，以及后台到前台来的数据类型。
			async : false, //异步
			success : function ( text ) {  //text 由dataType 定义的类型，包裹ajax的数据。   成功时显示如: 1 , success ,json数据

				//
				var flag =  com.leanway.checkLogind(text);

				var tempData = $.parseJSON(text);
				if (tempData.status == "success") {
					oTable.ajax.reload(); //重新加载数据，返回DataTables.Api 实例。
					//加载模态框
					$('#employeeModal').modal('hide');
				}else{

					lwalert("tipModal", 1, tempData.info);
				}


				/*if(flag){

						//去除字符串空格
					if ($.trim(text)  == "success") {

						oTable.ajax.reload(); //重新加载数据，返回DataTables.Api 实例。
						//加载模态框
						$('#employeeModal').modal('hide');
					} else {
	//					alert("操作失败");
						//lwalert("tipModal", 1);
						lwalert("tipModal", 1, "操作失败！");
					}

				}*/

			}
		});

	}

	// 关联雇员
	var showEmployee = function () {
		//鼠标选取的行
	    if (oTable.rows('.row_selected').data().length == 0) {
//	    	alert("请选择用户关联雇员!");
	    	lwalert("tipModal", 1, "请选择用户关联雇员！");
	    	return;
	    } else if (oTable.rows('.row_selected').data().length > 1){
//	    	alert("请选择一位用户进行关联！");
	    	lwalert("tipModal", 1, "请选择一位用户进行关联！");
	    	return;
	    } else  {
	    	//将已有的值置空
	    	$("#searchEmployee").val("");

	    	// 弹出modal
	    	$('#employeeModal').modal({backdrop: 'static', keyboard: false});

	    	$("#userNamePost").val( oTable.rows('.row_selected').data()[0].userName );

	    				//获取鼠标选取的行的comId
	    	var compId =  oTable.rows('.row_selected').data()[0].compId;
	    	//判断表单是否为空，或者未定义。
			if (employeeTable == null || employeeTable == "undefined" || typeof(employeeTable) == "undefined") {
				//初始化表格
				employeeTable = initEmployeeTable(compId);
			} else {
				//oTable.destroy();
				//	oTable = initTable(selectRole);
				//employeeTable = initEmployeeTable(compId);

				//post传值格式。
			    employeeTable.ajax.url('../../../../'+ln_project+'/employee?method=queryEmployeesByComID&conditions=' + encodeURI('{"flag":"1","compid":"' + compId + '"}&page={"currentPage":"1"}')).load();
				//employeeTable.ajax.reload();
				//employeeTable.ajax.url("../../employee?method=queryEmployeesByConditons&conditions={}&page={'currentPage':'1'}").load();
			//	oTable.fnReloadAjax( "" + selectRole );
			}
	    }

	}
	// 初始化数据表格
	var initEmployeeTable = function (compId) {

		var table = $('#employeeTables').DataTable( {
				"ajax": '../../../../'+ln_project+'/employee?method=queryEmployeesByComID&conditions='+encodeURI('{"flag":"1","compid":"' + compId + '"}&page={"currentPage":"1"}'),
				'bPaginate': true,   //是否显示分页
		        "iDisplayLength" : "10", //显示多少个
//				"scrollY":"300px",
//				"scrollCollapse": "true",
//			    "paging": "false",
		        "bDestory": true,   //重新调用插件
		        "bRetrieve": true,  //是否允许从新生成表格
		        "bFilter":false,  //是否启动过滤、搜索功能
		        "bSort": false,  //是否启动各个字段的排序功能
		        "bProcessing": true,   //DataTables载入数据时，是否显示‘进度’提示
		        "bServerSide": true,  //是否启动服务器端数据导入
		        'searchDelay':"5000", //
		        "columns": [  //前台展示的字段，对应html里面的table
	                {"data" : "employeeid"},
	                { "data": "name" },
	                { "data": "post" },
	                { "data": "moble" }
		         ],
		         "aoColumns": [  //对应后台的数据，要跟bean的字段名相同。
		               {
		            	   "mDataProp": "employeeid",
		                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
		         //              $(nTd).html("<input type='checkbox' name='employeeCheckList'  value='" + sData + "'>");
		                	   $(nTd)
		            		   .html("<div id='stopPropagation" + iRow +"'>"
		            				   +"<input class='regular-checkbox' type='checkbox' id='"
		            				   + sData
		            				   + "' name='employeeCheckList' value='"
		            				   + sData
		            				   + "'><label for='"
		            				   + sData
		            				   + "'></label> </div>");
		            		   com.leanway.columnTdBindSelect(nTd);
		                   }
		               },
		               {"mDataProp": "name"},
		               {"mDataProp": "compname"},
		               {"mDataProp": "post"},
		               {"mDataProp": "moble"},
		          ],
		          "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
		              //add selected class
		        	  $(nRow).click(function () {
		                  if ($(this).hasClass('row_selected')) {
		                      $(this).removeClass('row_selected');
		                      $(this).find('td').eq(0).find("input[name='employeeCheckList']").prop("checked", false)
		                  } else {
		                	  employeeTable.$('tr.row_selected').removeClass('row_selected');
		                      $(this).addClass('row_selected');
		                      $("input[name='employeeCheckList']").prop("checked", false);
		                      $(this).find('td').eq(0).find("input[name='employeeCheckList']").prop("checked", true)
		                  }
		              });


		          },
		         "oLanguage" : {
		        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		         }

		    } ).on('xhr.dt', function (e, settings, json) {
				com.leanway.checkLogind(json);
			} );

		return table;
	}

	var showRole = function () {

		//var userId = getDataTableSelectData ();
		//判断选择行的行数，
	    if (oTable.rows('.row_selected').data().length == 1) {
	    	//获取选择行的相对应的值
	    	var treeUserId = oTable.rows('.row_selected').data()[0].userId;

	    	var compId =  oTable.rows('.row_selected').data()[0].compId;

			// 弹出modal
			$('#roleTree').modal({backdrop: 'static', keyboard: false});
			//调用显示树
			 $.fn.zTree.init($("#tree"),  {
		        check : {
		        	//设置 zTree 的节点上是否显示 checkbox / radio 默认值: false
		            enable : true,
		            //勾选框类型(checkbox 或 radio）[setting.check.enable = true 时生效]默认值："checkbox"
		            chkStyle :"checkbox",
		            //勾选 checkbox 对于父子节点的关联关系。[setting.check.enable = true 且 setting.check.chkStyle = "checkbox" 时生效] 默认值：{ "Y": "ps", "N": "ps" }
		            chkboxType : { "Y": "s", "N": "s" }
		        },
		        async: {
		        	//设置 zTree 是否开启异步加载模式默认值：false
		        	enable : true,
		        	url : "../../../../"+ln_project+"/role?method=getRolesTreeList" ,
		        	//异步加载时需要自动提交父节点属性的参数。[setting.async.enable = true 时生效] 默认值：[ ]
		        	autoParam : ["levels"],
		        	//Ajax 请求提交的静态参数键值对。[setting.async.enable = true 时生效] 默认值：[ ]
		        	otherParam : {"userId" : treeUserId, "compId" : compId}
		        },
		        view: {
		        	//双击节点时，是否自动展开父节点的标识 默认值: true
		            dblClickExpand: false,
		            //设置 zTree 是否显示节点之间的连线。 默认值：true
		            showLine: true,
		            //设置是否允许同时选中多个节点。  默认值: true
		            selectedMulti: false
		        },
		        data: {
		        	//name:zTree节点数据保存节点名称的属性名称。
		        	key: { name : "rolename" },
		            simpleData : {
		            	/*确定 zTree 初始化时的节点数据、异步加载时的节点数据、或 addNodes 方法中输入的 newNodes 数据是否采用简单数据模式 (Array)
		            	不需要用户再把数据库中取出的 List 强行转换为复杂的 JSON 嵌套格式  默认值：false*/
		                enable : true,
		                //节点数据中保存唯一标识的属性名称。[setting.data.simpleData.enable = true 时生效]  默认值："id"
		                idKey : "roleid",
		                //节点数据中保存其父节点唯一标识的属性名称。[setting.data.simpleData.enable = true 时生效]  默认值："pId"
		                pIdKey :  "pid",
		                //用于修正根节点父节点数据，即 pIdKey 指定的属性值。[setting.data.simpleData.enable = true 时生效] 默认值：null
		                rootPId : ""
		            }
		        },
		        callback: {
	/*	            beforeClick: function(treeId, treeNode) {
		                var zTree = $.fn.zTree.getZTreeObj("tree");
		                if (treeNode.isParent) {
		                    zTree.expandNode(treeNode);
		                    return false;
		                }
		            },*/

		        /*	用于捕获异步加载正常结束的事件回调函数  默认值：null
		        	如果设置了 setting.callback.beforeAsync 方法，且返回 false，将无法触发 onAsyncSuccess / onAsyncError 事件回调函数。
		        	*/
		            onAsyncSuccess: onAsyncSuccess,
		            //用于捕获节点被点击的事件回调函数
		            onClick:onClick
		      }
		});

	    } else {
//		   alert("请选择用户进行角色关联!");
	    	lwalert("tipModal", 1, "请选择一个用户进行角色关联！");
	    }

	}

	// 树形结构参数信息


	// 选中树节点
	function onClick(e, treeId, treeNode) {
		//选中节点
		if ( treeNode.checked ) {
			//根据 treeId 获取 zTree 对象的方法。       勾选 或 取消勾选 单个节点。参数(treeNode, checked, checkTypeFlag, callbackFlag)
			//参数说明(需要勾选 或 取消勾选 的节点数据,checked = true 表示勾选节点,checkTypeFlag = true 表示按照 setting.check.chkboxType 属性进行父子节点的勾选联动操作
			//callbackFlag = true 表示执行此方法时触发 beforeCheck & onCheck 事件回调函数  省略此参数，等同于 false)
			$.fn.zTree.getZTreeObj("tree").checkNode(treeNode, false, false);
		} else {
			$.fn.zTree.getZTreeObj("tree").checkNode(treeNode, true, true);
		}

	}

	// 树形节点一步加载完成
	function onAsyncSuccess(event, treeId, treeNode, msg) {

/*		try {
			if ( typeof( treeNode ) == "undefined" ) {
				var zTree = $.fn.zTree.getZTreeObj(treeId);
				var rootNode = zTree.getNodes()[0];
			    zTree.selectNode(rootNode);
			    zTree.expandNode(rootNode, true);
			     showMstDataInGrid({folderguid: nodes[0].GUID});
			}
		} catch (e) {
		}*/

		try {
			if ( typeof( treeNode ) == "undefined" ) {
				//加载节点。
				var zTree = $.fn.zTree.getZTreeObj(treeId);
				var rootNode = zTree.getNodes();

				if (rootNode != null && rootNode.length > 0) {
					for (var i = 0;i<rootNode.length; i ++) {
						//选中指定节点
					    zTree.selectNode(rootNode[i]);
					    // 展开 /折叠 指定的节点  参数(treeNode, expandFlag, sonSign(默认 false), focus(默认true), callbackFlag(默认 false))
					    zTree.expandNode(rootNode[i], true);
					}
				}
			}
		} catch (e) {
		}

	}

	// 保存角色关联
	var saveUserRole = function () {

		var checkRoleIds = "";

		var zTree = $.fn.zTree.getZTreeObj("tree");
		var nodes = zTree.getCheckedNodes(true);

		for (var i = 0;i < nodes.length; i++) {
			checkRoleIds += nodes[i].roleid +",";
		}

		var userId = oTable.rows('.row_selected').data()[0].userId;

		if ( checkRoleIds == "" ) {
			var userName =  oTable.rows('.row_selected').data()[0].userName;
			lwalert("tipModal", 2, "确定清空选中用户[" + userName + "]的角色吗?","isSureSaveUser()");

//			 if (confirm("确定清空选中用户[" + userName + "]的角色吗?"))  {
//				 ajaxSaveUserRole(userId, checkRoleIds);
//			 }

		} else {

			 ajaxSaveUserRole(userId, checkRoleIds);

		}


	}

	function isSureSaveUser(){

		var checkRoleIds = "";

		var zTree = $.fn.zTree.getZTreeObj("tree");
		var nodes = zTree.getCheckedNodes(true);

		for (var i = 0;i < nodes.length; i++) {
			checkRoleIds += nodes[i].roleid +",";
		}

		var userId = oTable.rows('.row_selected').data()[0].userId;
		 ajaxSaveUserRole(userId, checkRoleIds);
	}
	var ajaxSaveUserRole = function (userId, checkRoleIds) {

		$.ajax ( {
			type : "post",
			url : "../../../../"+ln_project+"/role",
			data : {   //传输到后台的数据，通过getParameter()获取。
				"method" : "saveUserRole",
				"userIds" : userId,
				"roleIds" : checkRoleIds
			},
			dataType : "json",
			async : false,
			success : function ( text ) {

				var flag =  com.leanway.checkLogind(text);

				if(flag){

					if ($.trim(text)  == "1") {
						$('#roleTree').modal('hide');
					} else {
	//					alert("操作失败");
						lwalert("tipModal", 1, "操作失败！");
					}

				}

			}
		});

	}

	// 获取选中的DataTable
	var getDataTableSelectData = function ( ) {

		var str = "";

	    // 拼接选中的checkbox  						.each(function(index,element)
	    $( "input[name='checkList']:checked" ).each( function ( i, o ) {
	    	str += $(this).val();
	    	str += ",";
	    });
	    //?
	    if (str.length > 0) {

	    	str = str.substr(0, str.length - 1);
	    }

	    return str;

	}

	// 新增用户
	var addUser = function () {

		ope = "add";

		// 清空表单
		resetUserForm();
		//加载模态框
		$('#myModal').modal({backdrop: 'static', keyboard: false});

	}

	// 显示编辑数据
	function showEditUser() {
		//判断选择的行的行数
	    if (oTable.rows('.row_selected').data().length > 0) {

	    	// 获取选中的用户标识
	    	 var userId = oTable.rows('.row_selected').data()[0].userId;

	    	 ope = "update";
	    	 //写入模态框的title
	    	 $("#myModalLabel").html(updateTitle);

	    	 // 获取数据
	    	 getUser(userId);

	    } else {
//	        alert('请点击选择一条记录后操作。');
	    	lwalert("tipModal", 1, "请点击选择一条记录后操作！");
	    }
	}

function getPassword( ) {
		//判断是否有选中框
	 if (oTable.rows('.row_selected').data().length > 0) {

	    	// 获取选中的用户标识
	    	 var userId = oTable.rows('.row_selected').data()[0].userId;

	    	 $.ajax ( {
	 			type : "POST",
	 			url : "../../../../"+ln_project+"/user",
	 			data : {
	 				"method" : "getUser",
	 				"userId" : userId
	 			},
	 			dataType : "json",
	 			async : false,
	 			success : function ( json ) {


	 				var flag =  com.leanway.checkLogind(json);

	 				if(flag){

 						//清空表单
 						resetPasswordForm();

 						//设置userName为只读属性
 						$('#myModalReset #userName').prop("readonly",true);
 						//设置值在表单上显示的值。
 						 $("#myModalReset #userName").val(json.userName);
 						 $("#myModalReset #userId").val(json.userId);
	 					//弹出模态框
	 					$('#myModalReset').modal({backdrop: 'static', keyboard: false});

	 				}
	 			}
	 		});


	    } else {
	    	//提示框
	    	lwalert("tipModal", 1, "请点击选择一条记录后操作！");
	    }

}

	function passwordReset( ){

		var userId = $("#myModalReset #userId").val();
		var password = $("#myModalReset #password").val();
		var confirmPassword = $("#myModalReset #confirmPassword").val();

		// 输入密码的情况下, 进行md5加密
		if ($.trim(password) != "" && password.length > 0) {
			password =  $.md5(password);
			confirmPassword = $.md5(confirmPassword);
		}
		//表单的数据序列化成数组
		var form  = $("#resetPasswordForm").serializeArray();
		//将数据转换成json数据
		var formData = formatFormJson(form);

		// 提交前先验证
		$("#resetPasswordForm").data('bootstrapValidator').validate();

		// 返回true、false
		if ($('#resetPasswordForm').data('bootstrapValidator').isValid()) {

			$.ajax ( {
				type : "POST",
				url : "../../../../"+ln_project+"/user",   //查找spring对应的'/user' bean。
				data : {
					"method" : "resetPassword",  //对应的class类的方法
					"password" : password,
					"confirmPassword" : confirmPassword,
					"userId" : userId
				},
				dataType : "json",
				async : false,
				success : function ( text ) {
								//检查是否是登录状态
					var flag =  com.leanway.checkLogind(text);

					if(flag){
							//去除首位的空格
						if ($.trim(text) == "1") {
										//获取指定KEY的元素值VALUE，失败返回NULL
							var colsmap = tabmap.get("grid-data");
							//清理colsmap
							colsmap.clearmap();
							//关闭模态框
							closeModal();

							//重置表单
							resetPasswordForm();

							//重新加载table
							oTable.ajax.reload(null, false);

						} else {
		//					alert("操作失败");
							lwalert("tipModal", 1, $.trim(text));
						}

					}

				}
			});
		}
}

	// 加载用户数据
function getUser( userId ) {

		$.ajax ( {
			type : "POST",
			url : "../../../../"+ln_project+"/user",
			data : {
				"method" : "getUser",
				"userId" : userId
			},
			dataType : "text",
			async : false,
			success : function ( text ) {


				var flag =  com.leanway.checkLogind(text);

				if(flag){

					// 表单赋值
					setFormValue(text, userId);
					//加载模态框
					$('#myModalUpdate').modal({backdrop: 'static', keyboard: false});
					// 显示
					//$("#myModal").modal("show");

				}
			}
		});

	}
	//把值渲染到表单上
	function setFormValue (data, userId) {
		//情况表单数据
		resetUptateForm();
		$('#myModalUpdate #userName').prop("readonly",true);
					//函数可计算某个字符串，并执行其中的的 JavaScript 代码。
		var json = eval("(" + data + ")")
			//把对应的值渲染到对应的属性上。
		  for (var item in json) {
			  if (item != "password") {
				  $("#myModalUpdate #" + item).val(json[item]);
			  }
		  }
	}

	//删除用户提示框
	function deleteUser ( type ) {


		if (type == undefined || typeof(type) == "undefined") {
			type = 2;
		}
				//得到选取框的数据
		var ids = com.leanway.getCheckBoxData(type, "grid-data", "checkList");

		if (ids.length == 0) {

			lwalert("tipModal", 1, "请选择要删除的用户!");
			return;

		} else {

			var msg = "确定删除选中的" + ids.split(",").length + "条用户?";

			lwalert("tipModal", 2, msg ,"isSureDelete(" + type + ")");
		}


	}

	function isSureDelete( type ){
		var ids = com.leanway.getCheckBoxData(type, "grid-data", "checkList");

		deleteAjax(ids);
	}
	// 删除Ajax
	var deleteAjax = function (ids) {

		$.ajax ( {
			type : "POST",
			url : "../../../../"+ln_project+"/user",
			data : {
				"method" : "delete",
				"id" : ids
			},
			dataType : "json",
			async : false,
			success : function ( text ) {

				var flag =  com.leanway.checkLogind(text);

				if(flag){

					if ( $.trim(text) == "1" ) {
								//获取指定key 的value
						var colsmap = tabmap.get("grid-data");
						//情况colsmap
						colsmap.clearmap();
						//重新加载表数据(分页重置)
						oTable.ajax.reload();
					} else {
	//					alert("操作失败");
						lwalert("tipModal", 1, "操作失败！");
					}

				}

			}
		});

	}

	var updateUser = function() {

		//表单序列化
		var form  = $("#uptateUserForm").serializeArray();
		var formData = formatFormJson(form);

		// 提交前先验证
		$("#uptateUserForm").data('bootstrapValidator').validate();

		// 返回true、false
		if ($('#uptateUserForm').data('bootstrapValidator').isValid()) {
			$.ajax ( {
				type : "POST",
				url : "../../../../"+ln_project+"/user",
				data : {
					"method" : "update",
					"formData" : formData,
				},
				dataType : "json",
				async : false,
				success : function ( text ) {
					var flag =  com.leanway.checkLogind(text);
					if(flag){

						if ($.trim(text) == "1") {

							var colsmap = tabmap.get("grid-data");
							//清理colsmap
							colsmap.clearmap();
							//关闭模态框
							closeModal();
							//清空表单
							resetUptateForm();
							//刷新表格数据，分页信息不会重置
							oTable.ajax.reload(null, false);

						} else {
							//弹出提示框
							lwalert("tipModal", 1, $.trim(text));
						}
					}
				}
			});
		}
	}

	var saveUser = function() {
		var userId = $("#userForm #userId").val();
		var userName = $("#userForm #userName").val();
		var password = $("#userForm #password").val();
		var confirmPassword = $("#userForm #confirmPassword").val

		// 检测用户名是否已存在
		var canSubmit =  checkUserIsExist(userName,userId);
		if (!canSubmit) {
			lwalert("tipModal", 1, "用户名已存在请重新输入！");
			return;
		}

		// 输入密码的情况下, 进行md5加密
		if ($.trim(password) != "" && password.length > 0) {
			password =  $.md5(password);
			//confirmPassword = $.md5(confirmPassword);
		}

		var form  = $("#userForm").serializeArray();
		var formData = formatFormJson(form);

		// 提交前先验证
		$("#userForm").data('bootstrapValidator').validate();

		// 返回true、false
		if ($('#userForm').data('bootstrapValidator').isValid()) {

			$.ajax ( {
				type : "POST",
				url : "../../../../"+ln_project+"/user",
				data : {
					"method" : "add",
					"formData" : formData,
					"password" : password,
					"confirmPassword" : confirmPassword
				},
				dataType : "json",
				async : false,
				success : function ( text ) {

					var flag =  com.leanway.checkLogind(text);

					if(flag){

						if ($.trim(text) == "1") {

						/*	var colsmap = tabmap.get("grid-data");
							//清除colsmap
							colsmap.clearmap();*/

							//关闭模态框
							closeModal();
							//清楚表单数据以及验证
							resetUserForm();
							//重新加载表数据(分页重置)
							oTable.ajax.reload();


						} else {
		//					alert("操作失败");
							lwalert("tipModal", 1, $.trim(text));
						}

					}

				}
			});
		}
	}

	// 检测用户是否存在
	var checkUserIsExist = function (userName, userId) {

		var canSubmit = false;

		$.ajax ( {
			type : "POST",
			url : "../../../../"+ln_project+"/user",
			data : {
				"method" : "checkUserIsExist",
				"userName" : userName,
				"userId" : userId
			},
			dataType : "json",
			async : false,
			success : function ( text ) {

				var flag =  com.leanway.checkLogind(text);

				if(flag){

					if ($.trim(text) == "1") {
						canSubmit = true;
					}

				}
			}
		});

		return canSubmit;
	}

	// 格式化form数据
	var  formatFormJson = function  (formData) {

		var reg=/,$/gi;

		var data = "{";

		for (var i = 0; i < formData.length; i++) {

			data += "\"" +formData[i].name +"\" : \""+formData[i].value+"\",";

		}

		data = data.replace(reg,"");

		data += "}";

		return data;
	}

	// 清空form
	var clearForm =function () {

		 $("#userName").val("");
		 $("#password").val("");
		 $("#area").val("");
		 $("#phone").val("");
		 $("#mobile").val("");
		 $("#qq").val("");
		 $("#weibo").val("");
		 $("#wechat").val("");
		 $("#startTime").val("");
		 $("#endTime").val("");
		 $("#userId").val("");

	}

	// 关闭modal
	var closeModal = function () {
		$('#myModal').modal('hide');
		$('#myModalUpdate').modal('hide');
		$('#myModalReset').modal('hide');
	}

	/**
	 * 重置表单
	 */
	function resetUserForm() {
		//清空表单上的数据
	    $('#userForm').each(function (index) {
	        $('#userForm')[index].reset();
	    });
	    //清空Boots的提示
		$("#userForm").data('bootstrapValidator').resetForm();
	}

	function resetUptateForm( ) {
		//清空表单上的数据
		 $('#uptateUserForm').each(function (index) {
		        $('#uptateUserForm')[index].reset();
		 });
		//清空Boots的提示
		 $("#uptateUserForm").data('bootstrapValidator').resetForm();
	}
	function resetPasswordForm( ) {
		//清空表单上的数据
		 $('#resetPasswordForm').each(function (index) {
		        $('#resetPasswordForm')[index].reset();
		 });
		//清空Boots的提示
		 $("#resetPasswordForm").data('bootstrapValidator').resetForm();
	}

	function initBootstrapValidator( ) {
		//对应的表单id
		$('#userForm').bootstrapValidator(
				{
					excluded : [ ':disabled' ],
					fields : {
						userName : {
							validators : {
								notEmpty : {},
								regexp : com.leanway.reg.fun(
										com.leanway.reg.decimal.userName,
										com.leanway.reg.msg.userName)
							}
						},
						mobile : {
							validators : {
								notEmpty : {},
								regexp : com.leanway.reg.fun(
										com.leanway.reg.decimal.mobile,
										com.leanway.reg.msg.mobile)
							}
						},
						password: {
							validators: {
								notEmpty: {	},
								regexp : com.leanway.reg.fun(
										com.leanway.reg.decimal.password,
										com.leanway.reg.msg.password),
								}
							},
						confirmPassword: {
							validators: {
								notEmpty: {	},
								identical: {
									field: 'password',
									message: '密码需要跟确认密码一致'
									}
								}
						}

					}
				})
			$('#uptateUserForm').bootstrapValidator(
				{
					excluded : [ ':disabled' ],
					fields : {
						mobile : {
							validators : {
								notEmpty : {},
								regexp : com.leanway.reg.fun(
										com.leanway.reg.decimal.mobile,
										com.leanway.reg.msg.mobile)
							}
						}
					}
				})
			$('#resetPasswordForm').bootstrapValidator(
				{
					excluded : [ ':disabled' ],
					fields : {
						password: {
							validators: {
								notEmpty: {	},
								regexp : com.leanway.reg.fun(
										com.leanway.reg.decimal.password,
										com.leanway.reg.msg.password)
								}
							},
						confirmPassword: {
							validators: {
								notEmpty: {	},
								identical: {
									field: 'password',
									message: '确认密码需要跟密码一致'
									},
								}
						}
					}
				})
	}