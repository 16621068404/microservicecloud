

var ope = "getDeptListByLevel";
var equipmentTable;
var reg = /,$/gi;
$(function(){
	$( "#searchCompany" ).autocomplete({
		source: function (req, res){
			var term = req.term;
			$.ajax({
				type: 'get',
				url: '../../../'+ln_project+'company',
				data: {
					method: "autoSearch",
					q: term,
				},
				dataType: 'text',
				success: function(data){

					var flag =  com.leanway.checkLogind(data);

					if(flag){

						var tempData = $.parseJSON(data);
						res($.map(tempData, function(item){
							return {
								label: item.compname,
								value: item.compname,
								compId: item.compid
							}
						}));

					}
				},
				error: function(data){

				}
			});
		},
		select: function( event, ui ) {
//			console.info(ui);

		}
	});

	$('#typeSelectId').change(function(){
		$("#type").val($('#typeSelectId').val());
	});

	//初始化DeptTree
	initDeptTreeTable(ope);
	initBootstrapValidator();
	 //初始化表格只读
    com.leanway.formReadOnly("deptForm");

    buttonDisabled("#saveDeptId");

    com.leanway.loadTags();

	//绑定保存或修改
	$("#saveDeptId").click(function(){
		saveOrUpdateFunc();
	});
	 com.leanway.initSelect2("#searchValue",
	            "../../../"+ln_project+"/dept?method=queryDeptBySearchValue", "搜索部门");
	// 电话特殊格式
 	$("[data-mask]").inputmask();

 	dyscGetProvinceCityCountry("#provinceId", "province", $('#provinceId')
			.val(), $('#cityId').val());
 	
	queryCenterTypeList();
	
	equipmentTable = initEquipmentTable();
	
	$("#addEquipment").prop("disabled",true);
	$("#delEquipment").prop("disabled",true);

    // enter键时候触发查询
    com.leanway.enterKeyDown("employeeSearchValue", searchEmployee);
 
});

//查询
var searchEmployee = function ( ) {

    var searchVal = $("#employeeSearchValue").val();

    /*  {"mDataProp": "name"},
      {"mDataProp": "compname"},
      {"mDataProp": "post"},
      {"mDataProp": "moble"},*/
    // employeeTable.ajax.url('../../employee?method=queryEmployeesByConditons&conditions={"flag":"1","name":"' + conditions + '"}&page={"currentPage":"1"}&searchValue="' + searchVal).load();
    //
    employeeTable.ajax.url("../../../../"+ln_project+"/employee?method=queryEmployeesByComID&searchValue=" + searchVal + "&conditions=").load();
}

function queryCenterTypeList() {

	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/workCenter",
		data : {
			method : "queryCenterTypeList",
			conditions : "{}"
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				resetForm();
				setCenterType(data.codeMap);

			}
		},
		error : function(data) {

		}
	});
}

var setCenterType = function(data) {
	var html = "";
	for ( var i in data) {
		html += "<option value=" + data[i].codevalue + ">" + data[i].codevalue
				+ "</option>";
	}

	$("#centrtype").html(html);
}
//填写数据验证
function initBootstrapValidator() {

	$('#deptForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {

					deptName : {
						validators : {
							notEmpty : {},
						}
					},
					deptcode : {
						validators : {
							notEmpty : {},
						}
					},
					phone : {
						validators : {
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.phone,
									com.leanway.reg.msg.phone)
						}
					},
					fax : {
						validators : {
							//notEmpty : {},
							regexp: {
								regexp: /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/,
								message: '传真号如：123-999 999'
							}
						}
					},
					email : {
						validators : {
							//notEmpty : {},
							regexp : com.leanway.reg.fun(
									com.leanway.reg.decimal.email,
									com.leanway.reg.msg.email)
						}
					},

				}
});

}

function searchCompanyInitTree(){
	var compName = $("#searchCompany").val();

	initSearchCompany(compName);
}

//初始化查出来的公司-ztree
function initSearchCompany(compName) {
	$.fn.zTree.init($("#companyZtree"),  {
        check : {
            enable : true,
            chkStyle :"checkbox",
            chkboxType : { "Y": "s", "N": "s" }
        },
        async: {
        	enable : true,
        	url : "../../../"+ln_project+"/company?method=getCompanyTreeList" ,
        	autoParam : ["levels"],
        	otherParam : {"deptId": $("#selectDeptId").val(), "compName": compName}
        },
        view: {
            dblClickExpand: false,
            showLine: true,
            selectedMulti: false
        },
        data: {
        	key: { name : "compname" },
            simpleData : {
                enable : true,
                idKey : "compid",
                pIdKey :  "pid",
                rootPId : ""
            }
        },
        callback: {
        	/*beforeClick: function(treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj("tree");
                if (treeNode.isParent) {
                    zTree.expandNode(treeNode);
                    return false;
                }
            },*/
           onAsyncSuccess : onAsyncSuccess, onClick : onClick
        }
	});
}

//保存：部门关联公司
var saveDeptLinkCompany = function ( ) {
		// 获取部门Id
		var deptId = getTreeTableActiveId();
		var zTree = $.fn.zTree.getZTreeObj("companyZtree");
		var nodes = zTree.getCheckedNodes(true);

		if ( nodes.length == 0 ) {
//			alert("请选择公司进行关联");
			lwalert("tipModal", 1, "请选择公司关联！");
			return false;
		}
		if(nodes.length > 1) {
//			alert("只能选择一个公司进行关联");
			lwalert("tipModal", 1, "只能选择一个公司进行关联！");
			return false;
		}

		var compId = nodes[0].compid;
		$.ajax ( {
			type : "POST",
			url : "../../../"+ln_project+"/dept",
			data : {
				method: "relevanceCompany",
				deptId: deptId,
				compId: compId
			},
			dataType : "json",
			async : false,
			success : function ( text ) {

				var flag =  com.leanway.checkLogind(text);

				if(flag){

					if ($.trim(text)  == "1") {
						$('#linkCompanyModal').modal('hide');
						//reloadTableDeptTreeTable();
					} else {
	//					alert("操作失败");
						lwalert("tipModal", 1, "操作失败！");
					}

				}
			}
		});
	}

//打开关联公司模态框
function relevanceCompany() {
	var deptId = getTreeTableActiveId();
	if(deptId == "" || deptId == null || deptId.length == 0){
//		alert("请先选择一个部门！");
		lwalert("tipModal", 1, "请先选择一个部门！");
	} else {
		resetLinkCompanyForm();

		$("#selectDeptId").val(deptId);
		$('#linkCompanyModal').modal({backdrop: 'static', keyboard: false});
		//查找出相应的关联公司
		searchCompanyInitTree();
	}
}

// 选中树节点
function onClick(e, treeId, treeNode) {
	if ( treeNode.checked ) {
		$.fn.zTree.getZTreeObj("companyZtree").checkNode(treeNode, false, false);
	} else {
		$.fn.zTree.getZTreeObj("companyZtree").checkNode(treeNode, true, true);
	}
}

// 树形节点一步加载完成
function onAsyncSuccess (event, treeId, treeNode, msg) {
	try {
		if ( typeof( treeNode ) == "undefined" ) {
			//var zTree = $.fn.zTree.getZTreeObj(treeId);
			//var rootNode = zTree.getNodes()[0];
		   // zTree.selectNode(rootNode);
		    //zTree.expandNode(rootNode, true);
		    /* showMstDataInGrid({folderguid: nodes[0].GUID}); */
		}
	} catch (e) {
	}
}

//关联公司方法
function relevanceCompanyFunc() {
	$.ajax({
		type: "post",
		url: "../../../"+ln_project+"/dept",
		data: {
			method: "relevanceCompany",
			companyId: "1234567890",
			deptId: "86d635e7-8b53-4aa1-93f7-92453032b82f"
		},
		dataType: "text",
		success: function(data){


		},
		error: function(data){

		}
	});
}

function deleteDept() {
	var levels = getTreeTableSelectedLevels();
	if(levels == "" || levels == null || levels.length == 0) {
//		alert("请勾选部门进行删除");
		lwalert("tipModal", 1, "请勾选部门进行删除！");

		return false;
	} else {
		levels = levels.substr(0, levels.length - 1);
		lwalert("tipModal", 2, "确定要删除选中的部门吗！","isSureDelete()");
//        if (confirm("确定要删除选中的部门吗?"))  {
//        	deleteAjax(levels);
//        }
	}
}

function isSureDelete(){
	var levels = getTreeTableSelectedLevels();
	levels = levels.substr(0, levels.length - 1);
	deleteAjax(levels);
}

//删除选中的公司
var deleteAjax = function (levels) {
	$.ajax ( {
		type : "POST",
		url : "../../../"+ln_project+"/dept",
		data : {
			method: "delete",
			levels : levels
		},
		dataType : "text",
		async : false,
		success : function ( text ) {


			var flag =  com.leanway.checkLogind(text);

			if(flag){

				var tempData = $.parseJSON(text);
	            if (tempData.result == "1") {
					reloadTable();
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败");
				}

			}

		}
	});
}

function showDept() {
	
	$("#addEquipment").prop("disabled",false);
	$("#delEquipment").prop("disabled",true);
	var deptId = getTreeTableActiveId();
	if(deptId == "" || deptId == null || deptId.length == 0){
//		alert("请选择部门进行编辑");
		lwalert("tipModal", 1, "请选择部门进行编辑！");

		return false;
	}
	com.leanway.removeReadOnly("deptForm");
	$("#code").prop("readonly",true);
	document.getElementById("deptName").readOnly=true;
	document.getElementById("deptcode").readOnly=true;
	document.getElementById("barcode").readOnly=true;
//	document.getElementById("maplevels").disabled = true;
	//$("#deptModalLabel").html("修改部门");
	opeMethod = "update";
	 buttonEnabled("#saveDeptId");
	 $("#typeSelectId").prop("disabled",true);
	 var type = $("#type").val()
	 console.info()
	 //仓库
	 if(type==5){
      	$("#privatetype").prop("disabled",false);
      	$("#centrtype").prop("disabled",true);
      }else if(type==1){
      	$("#centrtype").prop("disabled",false);
      	$("#privatetype").prop("disabled",true);
      }else{
      	$("#privatetype").prop("disabled",true);
      	$("#centrtype").prop("disabled",true);
      }
	 
	 equipmentTableToEdit();
	//getDeptById(deptId);
}

function getDeptById(deptId) {
	$.ajax({
		type: "get",
		url: "../../../"+ln_project+"/dept",
		data: {
			method: "getDeptById",
			deptId: deptId
		},
		dataType: "text",
		success: function(data){

			var flag =  com.leanway.checkLogind(data);

			if(flag){

			   buttonDisabled("#saveDeptId");
			   
			   setFormValue(data);
			   
			   equipmentTable.ajax.url(
						"../../../../"+ln_project+"/workCenter?method=queryEquipmentList&centerid=" + deptId)
						.load();

			}

			//$('#deptModal').modal({backdrop: 'static', keyboard: false});
		},
		error: function(data){

		}
	});
}

function setFormValue(data){
	$("#addEquipment").prop("disabled",true);
	$("#delEquipment").prop("disabled",true);
	resetForm();

	var tempJson = $.parseJSON(data);
	for (var key in tempJson) {
		$("#" + key).val(tempJson[key]);
	}

	$("#typeSelectId").val(tempJson.type);
	
	getPrivateType(1);

	
//	if(item=="type"){
//   	 html += "<option value='"+data[item]+"'>"+data.typename+"</option>";
//   	$("#type").html(html);
//	}

	// 初始化地址
	var addressId = tempJson.addressid;
	if (addressId != '') {

		var outPut = [];
		outPut
		.push("<option value='0' selected='selected'>=请选择=</option>");
		for ( var key in tempJson.cityList) {
			var tempOption;

				tempOption = "<option value='" + tempJson.cityList[key].city
						+ "'>" + tempJson.cityList[key].name + "</option>"

			outPut.push(tempOption);
		}
		$("#cityId").html(outPut.join(''));

		//district下拉框赋值
		var outPut2 = [];
		outPut2
		.push("<option value='0' selected='selected'>=请选择=</option>");
		for ( var key in tempJson.countryList) {
			var tempOption2;

				tempOption2 = "<option value='" + tempJson.countryList[key].district
						+ "'>" + tempJson.countryList[key].name + "</option>"

			outPut2.push(tempOption2);
		}
		$("#districtId").html(outPut2.join(''));


		$('#provinceId').val(tempJson.province);
		$('#cityId').val(tempJson.city);
		$('#districtId').val(tempJson.country);
		$('#registAddress').val(tempJson.location);
		$('#code').val(tempJson.code);
		$("#privatetype").val(tempJson.privatetype);
		
	}
}

//根据AddressId获取地址
function getAddressById(addressId) {

        $.ajax({
				type : 'get',
				url : '../../../'+ln_project+'address',
				data : {
					method : "gain",
					addressId : addressId
				},
				dataType : 'text',
				success : function(data) {

					var flag =  com.leanway.checkLogind(data);

					if(flag){

						var tempData = $.parseJSON(data);
						$('#addressid').val(addressId);
						co
						if(tempData.location!=null){
						$('#registAddress').val(tempData.location);
						}

						// 初始化省、市、县
//						dyscGetProvinceCityCountry("#provinceId", "province", $(
//								'#provinceId').val(), $('#cityId').val());
						dyscGetProvinceCityCountry("#cityId", "city",
								tempData.province, 0);
						dyscGetProvinceCityCountry("#districtId", "district",
								tempData.province, tempData.city);

						$('#provinceId').val(tempData.province);
						$('#cityId').val(tempData.city);
						$('#districtId').val(tempData.country);
						$('#code').val(tempData.code);
					}
				},
				error : function(data) {

				}
			});
}


//Gree Table
glyph_opts = {
		map: {
			doc: "glyphicon glyphicon-file",
			docOpen: "glyphicon glyphicon-file",
			checkbox: "glyphicon glyphicon-unchecked",
			checkboxSelected: "glyphicon glyphicon-check",
			checkboxUnknown: "glyphicon glyphicon-share",
			dragHelper: "glyphicon glyphicon-play",
			dropMarker: "glyphicon glyphicon-arrow-right",
			error: "glyphicon glyphicon-warning-sign",
			expanderClosed: "glyphicon glyphicon-plus-sign",
			expanderLazy: "glyphicon glyphicon-plus-sign",  // glyphicon-expand
			expanderOpen: "glyphicon glyphicon-minus-sign",  // glyphicon-collapse-down
			folder: "glyphicon glyphicon-folder-close",
			folderOpen: "glyphicon glyphicon-folder-open",
			loading: "glyphicon glyphicon-refresh"
	}
};

//初始化dataGrid
var initDeptTreeTable = function (ope) {

    $("#codemaplevels").val("");

	if("getDeptListByLevel" == ope){
		$("#select2-searchValue-container").html("");
	}
	$("#deptTreeTable").fancytree( {
		extensions : ["dnd", "edit", "glyph", "table"],
		checkbox : true,
		selectMode : 3,
		dnd : {
			focusOnClick : false,
			dragStart : function( node, data ) { return true; },
			dragEnter : function( node, data ) { return true; },
			dragDrop : function( node, data ) { data.otherNode.copyTo(node, data.hitMode); }
		},
		glyph : glyph_opts,
		source : {
			url: "../../../"+ln_project+"/dept?method="+ope+"&currentPage="
                                    + $("#currentPage").val(),
			debugDelay: 10
		},
		click: function(event, data) {
            //console.info(data.node.data.deptid)  获取deptid,  //点击事件
			//表单只读
        	com.leanway.formReadOnly("deptForm");
        	//根据选中数据id查询详细信息
        	getDeptById(data.node.data.deptid);
        },
		table : {
			checkboxColumnIdx : 1,
			nodeColumnIdx : 2
		},
		lazyLoad: function( event, data ) {
			data.result = {
				url: "../../../"+ln_project+"/dept?method="+ope+"&level=" + data.node.data.levels+ "&currentPage="
                + $("#currentPage").val(),
				debugDelay: 10
			};
		},
		renderColumns: function(event, data) {
			var node = data.node;
			$tdList = $(node.tr).find(">td");
			$tdList.eq(0).text(node.getIndexHier());

			var type = typeToname(node.data.type);
			
			$tdList.eq(3).text(type);
			$tdList.eq(4).text(node.data.leader);
			$tdList.eq(5).text(node.data.compname);
			$tdList.eq(6).text(node.data.type);
			$tdList.eq(7).text(node.data.phone);
			$tdList.eq(8).text(node.data.fax);
			$tdList.eq(9).text(node.data.email);
			$tdList.eq(10).text(node.data.createtime);
		}
	});
	 // 准备分页
  //  prePageFunc();
	
	
}

var typeToname = function(type) {

	var result = "";

	switch (type) {
	case "1":
		result = "生产部门";
		break;
	case "2":
		result = "财务部门";
		break;
	case "3":
		result = "采购部门";
		break;
	case "4":
		result = "销售部门";
		break;
	case "5":
		result = "仓管部门";
		break;
	default:
		result = "";
		break;
	}

	return result;
}

function prePageFunc() {
    var currentPage = $("#currentPage").val();
    $.ajax({
        type : 'get',
        url : '../../../'+ln_project+'/dept',
        data : {
            method : 'allDept',
            currentPage : currentPage
        },
        dataType : 'text',
        success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

	            var tempData = $.parseJSON(data);
	            // 初始化分页
	            initEasyPageFunc(tempData.pageParam.currentPage, tempData.pageParam.totalPage);
			}
        },
        error : function(data) {

        }
    });

}
//操作方法，新增或者修改
var opeMethod = "add";

//打开Model
function addDept() {
	
	$("#addEquipment").prop("disabled",false);
	$("#delEquipment").prop("disabled",false);
	opeMethod = "add";
	//$('#deptModalLabel').html("新增部门");
	com.leanway.removeReadOnly("deptForm");
	$("#code").prop("readonly",true);
//	document.getElementById("maplevels").disabled = true;
	var codemaplevels = $("#codemaplevels").val();

	resetForm();
	buttonEnabled("#saveDeptId");
	 
	$("#codemaplevels").val(codemaplevels);
	
    //仓库类型和工作中心类型只读
	$("#privatetype").prop("disabled",true);	
	$("#centrtype").prop("disabled",true);
	//$('#deptModal').modal({backdrop: 'static', keyboard: false});
	equipmentTable.ajax.url(
			"../../../../"+ln_project+"/workCenter?method=queryEquipmentList&centerid=1")
			.load();
}

function saveOrUpdateFunc(){
	
	$('#equipVal').val(getDataTableData(equipmentTable));
	
	var level =getTreeTableActiveLevel();
	var deptcode =$("#deptcode").val();

	var form  = $("#deptForm").serializeArray();
	var formData = formatFormJson(form);

	var province = $('#provinceId').val();
	var city = $('#cityId').val();
	var district = $('#districtId').val();
	var addressid = $('#addressid').val();
	var registAddress = $('#registAddress').val();
	var code = $('#code').val();

	
	 $("#deptForm").data('bootstrapValidator').validate(); // 提交前先验证
		if ($('#deptForm').data('bootstrapValidator').isValid()) {//返回true,或则false
			if(opeMethod=="add"){
			$.ajax({
				type : "post",
				url : "../../../"+ln_project+"/dept?method=isDeptNameExist",
				data : {
					deptcode : deptcode ,
					conditions : formData
				},
				dataType : "text",
				success : function(data) {

					var flag =  com.leanway.checkLogind(data);

					if(flag){

						var result = eval("(" + data + ")").valid;
						if (result == true) {//false表示有值


							save(formData,level,province,city,district,addressid,registAddress,code);

						} else {

		//					alert("该计量单位名称已存在");
							lwalert("tipModal", 1, "该部门编码已存在！");
							return;
						}

					}
				},
				error : function(data) {
//					alert("保存失败！");
					lwalert("tipModal", 1, "保存失败！");
				}
			});
			}else{
				save(formData,level,province,city,district,addressid,registAddress,code);
			}

		}
}

function save(formData,level,province,city,district,addressid,registAddress,code){
	
	var parenttype = "";
	var node = $("#deptTreeTable").fancytree("getActiveNode");

    // 获取选中的用户标识
	if (node != null && node != "undefined" && typeof(node) != "undefined") {
		parenttype = node.data.type;
	}
	
	//判断新增类型与选中上级是否一致
	var type = $("#typeSelectId").val();

	if(parenttype != ""&&parenttype != null && parenttype != "undefined" && typeof(parenttype) != "undefined"&&type!=parenttype){
		lwalert("tipModal", 1, "新增部门类型与上级部门类型不一致，请确认后再新增！");
	}else{
		
		 // 返回true、false
		$.ajax({
			type: 'post',
			url: '../../../'+ln_project+'/dept',
			async : false,
			data: {
				method: opeMethod,
				formData: formData,
				level: level,
				province : province,
				city : city,
				district : district,
				addressId : addressid,
				registAddress:registAddress,
				code:code,
			},
			dataType: 'json',
			success: function(data){


				var flag =  com.leanway.checkLogind(data);
				
				if(flag){

					 if (data.status == "true") {
						 
						 equipmentTable.ajax.url(
									"../../../../"+ln_project+"/workCenter?method=queryEquipmentList&centerid=" + 1)
									.load();
						//$("#deptModal").modal("hide");
						com.leanway.formReadOnly("deptForm");
						buttonDisabled("#saveDeptId");
		            	//$("#deptForm").data('bootstrapValidator').resetForm();
						reloadTable();
						
						
					} else {

						lwalert("tipModal", 1, data.info);

					}

				}
			},
			error: function(data){
				lwalert("tipModal", 1, "保存失败");
			}
		});
	}
	
	

}

//重新加载
function reloadTable () {
	$("#deptTreeTable").fancytree({
		source: {url: "../../../"+ln_project+"/dept?method=getDeptListByLevel&currentPage="
                            + $("#currentPage").val(), debugDelay: 10}
	});
}

//获取选择的层级
var getTreeTableActiveLevel = function ( ) {
	var result = "";
	var node = $("#deptTreeTable").fancytree("getActiveNode");

    // 获取选中的用户标识
	if (node != null && node != "undefined" && typeof(node) != "undefined") {
		result = node.data.levels;
	}

   	 return result;
}

//获取选中的treeGrid 的id
var getTreeTableActiveId= function (  ) {
	var result = "";
	var node = $("#deptTreeTable").fancytree("getActiveNode");

    // 获取选中的用户标识
	if (node != null && node != "undefined" && typeof(node) != "undefined") {
		result = node.data.deptid;
	}

   	 return result;
}

//获取checkbox选中的treeGrid 的层级标识
var getTreeTableSelectedLevels= function (  ) {
    var str = '';
    // 拼接选中的checkbox
	var tree = $("#deptTreeTable").fancytree("getTree");
	var nodes = tree.getSelectedNodes();

	if ( nodes.length > 0 ) {
		for ( var i = 0; i < nodes.length ; i++ ) {
			str += nodes[i].data.levels + ",";
		}
	}

	return str;
}

var formatFormJson = function(formData) {
	var reg = /,$/gi;
	var data = "{";
//	for (var i = 0; i < formData.length; i++) {
//		data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
//	}
	for (var i = 0; i < formData.length; i++) {
		if (formData[i].name == "equipVal") {
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

function resetForm() {
	$( '#deptForm' ).each( function ( index ) {

			$('#deptForm')[index].reset( );

        
    });


	$("#deptForm input[type='hidden']").val("");

	$('#typeSelectId').val(0);

	$("#deptForm").data('bootstrapValidator').resetForm();

	$('#cityId,#districtId').empty();
}

function resetLinkCompanyForm() {
	$( '#linkCompanyForm' ).each( function ( index ) {
        $('#linkCompanyForm')[index].reset( );
    });

	$("#companyZtree").empty();
}

//选择省份触发
$('#provinceId').change(
		function() {
			$('#cityId').empty();
			dyscGetProvinceCityCountry("#cityId", "city", $('#provinceId')
					.val(), $('#cityId').val());
			$('#districtId').empty();
		});

// 选择城市触发
$('#cityId').change(
		function() {
			dyscGetProvinceCityCountry("#districtId", "district", $(
					'#provinceId').val(), $('#cityId').val());
		});

// 动态得到省市县
function dyscGetProvinceCityCountry(id, pcd, provinceVal, cityVal) {
	$
			.ajax({
				type : 'get',
				url : '../../../'+ln_project+'/chinaMap',
				async : false,
				data : {
					method : "gain",
					province : provinceVal,
					city : cityVal
				},
				dataType : 'text',
				success : function(data) {

					var flag =  com.leanway.checkLogind(data);

					if(flag){

						var tempData = $.parseJSON(data);
					
						var outPut = [];
						outPut
								.push("<option value='0' selected='selected'>=请选择=</option>");
						for ( var key in tempData) {
							var tempOption;
							if (pcd == "province")
								tempOption = "<option value='"
										+ tempData[key].province + "'>"
										+ tempData[key].name + "</option>"
							else if (pcd == "city")
								tempOption = "<option value='" + tempData[key].city
										+ "'>" + tempData[key].name + "</option>"
							else if (pcd == "district")
								tempOption = "<option value='"
										+ tempData[key].district + "'>"
										+ tempData[key].name + "</option>"

							outPut.push(tempOption);
						}
						$(id).html(outPut.join(''));

					}
				},
				error : function(data) {

				}
			});
}


function getMapTreeList() {

	$.fn.zTree.init($("#treeDemo"), {
		async : {
			enable : true,
			url : "../../../"+ln_project+"/companyMap?method=queryCompanyMapTreeList",
			autoParam : [ "mapid"]
		},

		data : {
			key : {
				id : "mapid",
				maplevels:"levels"
			},
			simpleData : {
				enable : true,
				idKey : "mapid",
				pIdKey : "pid",
				rootPId : ""
			}
		},
		callback : {
			// onRightClick : OnRightClick,
			onClick : treeOnclick
		}
	});
}

function treeOnclick(e, treeId, treeNode) {

	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	nodes = zTree.getSelectedNodes();
	v = "";
	m = "";
	nodes.sort(function compare(a,b){return a.id-b.id;});
	for (var i=0, l=nodes.length; i<l; i++) {
		v += nodes[i].levels + ",";
	}
	if (v.length > 0 ) v = v.substring(0, v.length-1);
//	var mapObj = $("#maplevels");
//	mapObj.attr("value", v);
	$("#maplevels").val(v);
}

function showMenu() {
	var mapObj = $("#maplevels");
	var mapOffset = $("#maplevels").offset();
	$("#menuContent").css({left:mapOffset.left + "px", top:mapOffset.top + mapObj.outerHeight() + "px"}).slideDown("fast");

	$("body").bind("mousedown", onBodyDown);
	getMapTreeList();
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
}

function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}

function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
		hideMenu();
	}
}

function getCode() {
	$("#modalLabel").html("地图");
	$('#myModal').modal({
		backdrop : 'static',
		keyboard : false
	});
	var str = "";
	var provinceValue = $("#provinceId option:selected").text();
	str += provinceValue;
	var cityValue = $("#cityId option:selected").text();
	str += cityValue;
	var districtIdValue = $("#districtId option:selected").text();
	str += districtIdValue;
	var registAddress = $("#registAddress").val();
	str += registAddress;
	document.getElementById("mapKeys").value = str;
	$('#mapFrame').attr('src', '../workCenter/map.html');

}

function queryWorkCenterGroupList() {
	$.ajax({
		type : "get",
		url : "../../../../"+ln_project+"/workCenter",
		data : {
			method : "queryWorkCenterGroupList",
			conditions : "{}"
		},
		dataType : "json",
		success : function(data) {

			var flag =  com.leanway.checkLogind(data);

			if(flag){

				resetForm();
				setWorkCenterGroup(data.workCenterGroupResult);

			}
		},
		error : function(data) {

		}
	});
}
var setWorkCenterGroup = function(data) {
	var html = "";
	for ( var i in data) {
		html += "<option value=" + data[i].groupid + ">" + data[i].groupname
				+ "</option>";
	}

	$("#groupid").html(html);
}
function buttonDisabled(id) {
	$(id).attr({
		"disabled" : "disabled"
	});
}

function buttonEnabled(id) {
	$(id).removeAttr("disabled");
}

$("#searchValue").on("select2:select", function(e) {
    var deptid = $("#searchValue").val();
    initDeptTreeTable("queryDeptTreeBySearchValue&deptid="+deptid);
});

var showRole = function () {
	var deptid = getTreeTableActiveId( );

	if (deptid == null || $.trim(deptid) == "") {
		lwalert("tipModal", 1, "请选择部门后关联角色!");
		return;
	}

	// 弹出modal
	$('#roleTree').modal({backdrop : 'static', keyboard : false});

	//调用共用的方法
	 var opeMethod ="getRolesTreeList";

	 initRoleTree(opeMethod);
}
//选中树节点
function onClick(e, treeId, treeNode) {

	// 获取角色标识
	var roleId = treeNode.roleid;

	// 获取菜单标识
	var selectMenuId  = getTreeTableActiveId();

	if ( treeNode.checked ) {
		$.fn.zTree.getZTreeObj(treeId).checkNode(treeNode, false, false);
	} else {
		$.fn.zTree.getZTreeObj(treeId).checkNode(treeNode, true, true);
	}

}

// 树形节点一步加载完成
function onAsyncSuccess(event, treeId, treeNode, msg) {

	try {
		if ( typeof( treeNode ) == "undefined" ) {
			var zTree = $.fn.zTree.getZTreeObj(treeId);
			var rootNode = zTree.getNodes()[0];
		    zTree.selectNode(rootNode);
		    zTree.expandNode(rootNode, true);
		    /* showMstDataInGrid({folderguid: nodes[0].GUID}); */
		}
	} catch (e) {
	}
}

var initRoleTree = function(opeMethod){

	var deptid = getTreeTableActiveId( );

	 $.fn.zTree.init($("#tree"),  {
		 check : {
	            enable : true,
	            chkStyle :"checkbox",
	            chkboxType : { "Y": "s", "N": "s" }
	        },
	        async: {
	        	enable : true,
	        	url : "../../../"+ln_project+"/dept?method="+opeMethod ,
	        	autoParam : ["levels"],
	        	otherParam : {"deptid" : deptid}
	        },
	        view: {

	            dblClickExpand: false,
	            showLine: true,
	            selectedMulti: false
	        },
	        data: {
	        	key: { name : "rolename" },
	            simpleData : {
	                enable : true,
	                idKey : "roleid",
	                pIdKey :  "pid",
	                rootPId : ""
	            }
	        },
	        callback: {
	            onAsyncSuccess: onAsyncSuccess,onClick:onClick
	      }
	});

}
//保存部门关联角色
var saveDeptRole = function () {

	var deptid = getTreeTableActiveId();

	var checkRoleIds = "";

	var zTree = $.fn.zTree.getZTreeObj("tree");
	var nodes = zTree.getCheckedNodes(true);

	for (var i = 0; i < nodes.length; i++) {
		checkRoleIds += nodes[i].roleid +",";
	}

	if (checkRoleIds == "") {
		var deptname = getTreeTableActiveName();
		lwalert("tipModal", 2, "确定清空菜单【" + deptname + "】关联的角色？","isSureSaveRole()");

	} else {
		ajaxSaveDeptRole(checkRoleIds, deptid);
	}

}
function isSureSaveRole(){

	var deptid = getTreeTableActiveId();

	var checkRoleIds = "";

	var zTree = $.fn.zTree.getZTreeObj("tree");
	var nodes = zTree.getCheckedNodes(true);

	for (var i = 0; i < nodes.length; i++) {
		checkRoleIds += nodes[i].roleid +",";
	}

	ajaxSaveDeptRole(checkRoleIds, deptid);
}

var ajaxSaveDeptRole = function (checkRoleIds, deptid) {

	$.ajax ( {
		type : "POST",
		url : "../../../"+ln_project+"/dept?method=saveDeptRole",
		data : {
			"roleIds" : checkRoleIds,
			"deptId" : deptid
		},
		dataType : "json",
		async : false,
		success : function ( text ) {

			var flag =  com.leanway.checkLogind(text);

			if(flag){

				if ($.trim(text)  == "1") {
					$('#roleTree').modal('hide');
				} else {
	//				alert("操作失败");
					lwalert("tipModal", 1, "操作失败！");
				}

			}

		}
	});

}
//获取选中的treeGrid 的名称
var getTreeTableActiveName= function (  ) {

	var result = "";

	var node = $("#deptTreeTable").fancytree("getActiveNode");

    // 获取选中的用户标识
	if (node != null && node != "undefined" && typeof(node) != "undefined") {
		result = node.data.deptname;
	}

   	 return result;
}

var employeeTable;

// 关联雇员
var showEmployee = function () {
	
	var deptId = getTreeTableActiveId();
	
	if (deptId == "" || deptId.length == 0) {
		
		lwalert("tipModal", 1, "请选择部门关联雇员！");
    	return;
    	
	} else {
		
		var obj = new Object();
		obj.deptid = deptId;
		obj.queryType = 1;
		
		var paramsData = "&conditions=" +  encodeURIComponent($.trim(JSON.stringify(obj)));
	
		// 弹出modal
		$('#employeeModal').modal({backdrop: 'static', keyboard: true});

		if (employeeTable == null || employeeTable == "undefined" || typeof(employeeTable) == "undefined") {
			employeeTable = initEmployeeTable();

		} else {
			employeeTable.ajax.url("../../../../"+ln_project+"/employee?method=queryDepartmentEmployees").load();
		}

		if (saveEmployeeTable == null || saveEmployeeTable == "undefined" || typeof(saveEmployeeTable) == "undefined") {
			saveEmployeeTable = initSaveEmployeeTable(paramsData);
		} else {
			saveEmployeeTable.ajax.url("../../../../"+ln_project+"/employee?method=queryDepartmentEmployees" + paramsData).load();
		}
		
	}

}

//初始化数据表格
var employeeTable;
var initEmployeeTable = function () {
	//com.leanway.checkSession();
	var table = $('#employeeTables').DataTable( {
		"ajax": '../../../../'+ln_project+'/employee?method=queryDepartmentEmployees',
		//"iDisplayLength" : "10",
/*		"scrollY": "200px",
	    "scrollCollapse": "true",*/
		'bPaginate': true,
		"bDestory": true,
		"bRetrieve": true,
		"bFilter":false,
		"bSort": false,
		"bProcessing": true,
		"bServerSide": true,
		"bInfo" : true,
		"aoColumns": [
		              {
		            	  "mDataProp": "employeeid",
		            	  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
//		            		  $(nTd).html("<input type='checkbox' name='employeeCheckList'  value='" + sData + "'>");
		            		  $(nTd)
		            		  .html("<div id='stopPropagation" + iRow +"'>"
		            				  +"<input class='regular-checkbox' type='checkbox' id='"
		            				  + sData
		            				  + "' name='employeeCheckList' value='"
		            				  + sData
		            				  + "'><label for='"
		            				  + sData
		            				  + "'></label>");
                              com.leanway.columnTdBindSelectNew(nTd,"employeeTables","employeeCheckList");
		            	  }
		              },
		              {"mDataProp": "name"},
		              {"mDataProp": "moble"},
		              ],
		              "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
		            	  //add selected class
		            	  $(nRow).dblclick(function () {
		            		  
		            		  com.leanway.dataTableUnselectAll("employeeTables", "employeeCheckList");
		            		  
		            		  addEmployee(aData);
		            		  //	employeeTable.rows(iDataIndex).remove().draw(false);
		            	  });

		            	  $(nRow).click(function () {
		            		  if ($(this).hasClass('row_selected')) {
		            			  $(this).removeClass('row_selected');
		            			  $(this).find('td').eq(0).find("input[name='employeeCheckList']").prop("checked", false)
		            		  } else {
		            			  // employeeTable.$('tr.row_selected').removeClass('row_selected');
		            			  $(this).addClass('row_selected');
		            			  //$("input[name='employeeCheckList']").prop("checked", false);
		            			  $(this).find('td').eq(0).find("input[name='employeeCheckList']").prop("checked", true)
		            		  }
		            	  });
		              },
		              "oLanguage" : {
		            	  "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		              },
		              "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		              "fnDrawCallback" : function(data) {

//		            	  if (employeeTable.rows().data().length == 1) {
//		            		  addEmployee(employeeTable.rows().data()[0]);
//		            	  }

		              }

	} ).on('xhr.dt', function (e, settings, json) {
		com.leanway.checkLogind(json);
	} );

	return table;
}

var saveEmployeeTable;
var initSaveEmployeeTable = function (paramsData) {
	//com.leanway.checkSession();
	var table = $('#saveEmployeeTables').DataTable( {
		"ajax": '../../../../'+ln_project+'/employee?method=queryDepartmentEmployees' + paramsData,
		'bPaginate': false,
		"bDestory": true,
		"bRetrieve": true,
		"bFilter":false,
		"bSort": false,
		"bProcessing": true,
		"bServerSide": false,
		"aoColumns": [
		              {
		            	  "mDataProp": "employeeid",
		            	  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
//		            		  $(nTd).html("<input type='checkbox' name='saveEmployeeCheckList'  value='" + sData + "'>");
		            		  $(nTd)
		            		  .html("<div id='stopPropagation" + iRow +"'>"
		            				  +"<input class='regular-checkbox' type='checkbox' id='"
		            				  + sData
		            				  + "' name='saveEmployeeCheckList' value='"
		            				  + sData
		            				  + "'><label for='"
		            				  + sData
		            				  + "'></label>");
		            		  com.leanway.columnTdBindSelect(nTd);
		            	  }
		              },
		              {"mDataProp": "name"},
		              {"mDataProp": "moble"},
		              ],
		              "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
		            	  //add selected class
		            	  $(nRow).dblclick(function () {
		            		  saveEmployeeTable.rows(iDataIndex).remove().draw(false);


		            		  // 重新添加数据到DataTable，解决index下标错误的问题， 操作步骤，1：先删除第一条数据，第二条时删除不掉
		            		  var tempData = saveEmployeeTable.rows().data();

		            		  saveEmployeeTable.rows().remove().draw(false);

		            		  saveEmployeeTable.rows.add(tempData).draw(false);
		            		  // saveEmployeeTable.rows().add(tempData).draw(false);

		            		  // saveEmployeeTable.ajax.reload(false);
		            	  });

		            	  $(nRow).click(function () {
		            		  if ($(this).hasClass('row_selected')) {
		            			  $(this).removeClass('row_selected');
		            			  $(this).find('td').eq(0).find("input[name='saveEmployeeCheckList']").prop("checked", false)
		            		  } else {
		            			  // employeeTable.$('tr.row_selected').removeClass('row_selected');
		            			  $(this).addClass('row_selected');
		            			  //$("input[name='employeeCheckList']").prop("checked", false);
		            			  $(this).find('td').eq(0).find("input[name='saveEmployeeCheckList']").prop("checked", true)
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

/**
 * 添加雇员
 */
var addEmployee = function ( obj ) {
	//com.leanway.checkSession();
	var canAdd = true;

	// 判断添加的对象在关系表中是否存在
	var dataList = saveEmployeeTable.rows().data();

	if (dataList != undefined && typeof(dataList) != "undefined" && dataList.length > 0) {

		// 循环遍历Table数据
		for (var i = 0; i < dataList.length; i ++) {

			var employeeData = dataList[i];

			if (employeeData.employeeid == obj.employeeid) {
				canAdd = false;
			}

		}
	}

	if (canAdd) {
		obj.createtime = "";
		saveEmployeeTable.row.add(obj).draw( false );
	}

}

/**
 * 保存部门的雇员
 */
var saveDeptEmplee = function ( ) {
	
	var detData = new Object;
	detData.deptId = getTreeTableActiveId();
	detData.listEmployee =  com.leanway.getListTableData(saveEmployeeTable);
	
	$.ajax ( {
		type : "post",
		url : "../../../"+ln_project+"/dept",
		data : {
			"method" : "saveDeptEmplee",
			"detData" : JSON.stringify(detData)
		},
		dataType : "json",
		async : false,
		success : function ( data ) {
 
			if ( com.leanway.checkLogind(data) ) {

				if (data.status == "success") {
					$("#employeeModal").modal("hide");
				} else {
					lwalert("tipModal", 1, data.info);
				}
				
			}

		}
	});
}

/**
 * 左右移动，1：向右移，2：向左移
 */
var toTable = function ( type ) {
	//com.leanway.checkSession();
	if (type == 1) {

		var dataList =  employeeTable.rows('.row_selected').data();

		if (dataList != undefined && dataList.length > 0) {

			for (var i = 0; i < dataList.length; i++) {

				addEmployee(dataList[i]);

			}

		}

	} else if (type == 2) {

		saveEmployeeTable.rows(".row_selected").remove().draw(false);

		// 重新添加数据到DataTable，解决index下标错误的问题， 操作步骤，1：先删除第一条数据，第二条时删除不掉
		var tempData = saveEmployeeTable.rows().data();

		saveEmployeeTable.rows().remove().draw(false);

		saveEmployeeTable.rows.add(tempData).draw(false);

	}

}


//根据部门类型，选择其相应类型
function getPrivateType(search) {
	
    var type = $("#typeSelectId").val();
	
	var codemaplevels = $("#codemaplevels").val();
	console.info(codemaplevels);
	
	if(search==1){
		if(codemaplevels.length==5){
			codemaplevels=""
		}else if(codemaplevels.length>5){
			codemaplevels = codemaplevels.substr(0,codemaplevels.length-4)
			console.info(codemaplevels);
		}
	}
	
	
	
	$.ajax({
				type : 'get',
				url : '../../../'+ln_project+'/dept',
				async : false,
				data : {
					method : "getPrivateType",
					type : type,
					codemaplevels : codemaplevels
				},
				dataType : 'text',
				success : function(data) {

					var flag =  com.leanway.checkLogind(data);

					if(flag){

						var tempData = $.parseJSON(data);
						var html = "";
	                	for (var i = 0; i < tempData.length; i++) {
	                		 html += "<option value='"+tempData[i].codemapid+"'>"+tempData[i].codevalue+"</option>";
	                	}

	                    $("#privatetype").html(html);
	                    
	                    if(search==1){
	                    	$("#privatetype").prop("disabled",true);
	                    	$("#centrtype").prop("disabled",true);
	                    }else{
	                    	 if(type==5){
	 	                    	$("#privatetype").prop("disabled",false);
	 	                    }else if(type==1){
	 	                    	$("#centrtype").prop("disabled",false);
	 	                    }else{
	 	                    	$("#privatetype").prop("disabled",true);
	 	                    	$("#centrtype").prop("disabled",true);
	 	                    }
	 	                    	
	                    }

					}
				},
				error : function(data) {

				}
			});
}

//初始化数据表格
var initEquipmentTable = function() {

	var table = $('#equipmentTable')
			.DataTable(
					{
						"ajax" : "../../../../"+ln_project+"/workCenter?method=queryEquipmentList&centerid=" + 1,
						// "iDisplayLength" : "6",
						'bPaginate' : false,
						"bDestory" : true,
						"bRetrieve" : true,
						"bFilter" : false,
						"bSort" : false,
						"scrollX":true,
						"bProcessing" : true,
						"bServerSide" : false,
						'searchDelay' : "5000",
						"aoColumns" : [
								{
									"mDataProp" : "equipmentid",
									"fnCreatedCell" : function(nTd, sData,
											oData, iRow, iCol) {
										$(nTd)
												.html(
														"<div id='stopPropagation"
																+ iRow
																+ "'>"
																+ "<input class='regular-checkbox' type='checkbox' id='"
																+ sData
																+ "' name='equipCheckList' value='"
																+ sData
																+ "'><label for='"
																+ sData
																+ "'></label>");
			                             com.leanway.columnTdBindSelectNew(nTd,"equipmentTable","equipCheckList");
									}
								}, {
									"mDataProp" : "serialnumber",
								}, {
									"mDataProp" : "equipmentnum"
								}, {
									"mDataProp" : "equipmentname"
								}],
						"oLanguage" : {
							"sUrl" : "../../../jslib/datatables/zh-CN.txt"
						},
						"sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
						"fnDrawCallback" : function(data) {

						},

					}).on('xhr.dt', function (e, settings, json) {
						com.leanway.checkLogind(json);
					} );

	return table;
}

/**
 * 新增一行
 */
var addEquipment = function( ) {
	var centerid = $("#centerid").val();
	equipmentTable.row.add({
		"centerid" : centerid,
		"serialnumber" : "",
		"equipmentnum" : "",
		"equipmentname" : ""		
	}).draw(false);
	equipmentTableToEdit();
}

/**
 * 设备可编辑
 */
var equipmentTableToEdit = function ( ) {
	 if (equipmentTable.rows().data().length > 0) {
         $("#equipmentTable tbody tr").each( function( ) {
        	// 获取该行的下标
             var index = equipmentTable.row(this).index();
        	 // 台账序号
             var serialnumber = equipmentTable.rows().data()[index].serialnumber;
             $(this).find("td:eq(1)").html('<input type="text" class="form-control" style="width:100px" name="serialnumber" id="serialnumber'+index+'" value="'+ serialnumber + '" onblur="setDataTableValue(this, '+ index+ ',\'equipmentTable\')">');
             var equipmentnum = equipmentTable.rows().data()[index].equipmentnum;
             $(this).find("td:eq(2)").html('<input type="text" class="form-control" style="width:100px" name="equipmentnum" id="equipmentnum'+index+'" value="'+ equipmentnum + '" onblur="setDataTableValue(this, '+ index+ ',\'equipmentTable\')">');
             var equipmentname = equipmentTable.rows().data()[index].equipmentname;
             $(this).find("td:eq(3)").html('<input type="text" class="form-control" style="width:100px" name="equipmentname" id="equipmentname'+index+'" value="'+ equipmentname + '" onblur="setDataTableValue(this, '+ index+ ',\'equipmentTable\')">');

         });

         equipmentTable.columns.adjust();
     }
}
/**
 * 删除产品的方法
 */
function delEquipment(){
	//获取dataTabel
	// 删除选中行的数据

		
		$("#equipmentTable tbody tr").each(function() {
	
			// 获取该行的下标
			var index = equipmentTable.row(this).index();
	
			if ($(this).find("td:eq(0)").find("input[name='equipCheckList']").prop("checked") == true) {
				
				
				equipmentTable.rows(index).remove().draw(false);
			}

		});
		
}

var getDataTableData = function(tableObj) {

	var jsonData = "[";

	var dataList = tableObj.rows().data();
	if (dataList != undefined && typeof (dataList) != "undefined" && dataList.length > 0) {

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
    var equip = tableObj.rows().data()[index];
    // 循环Json key,value，赋值
    for ( var item in equip) {
        // 当ID相同时，替换最新值
        if (item == obj.name) {

        	equip[item] = obj.value;

        }

    }
}