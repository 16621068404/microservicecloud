var clicktime = new Date();
var employeecheckapplicationTable ;
var viewEmployeeTable ;
var viewTemplateCatlateTable ;
var nowForm = "baocaiForm";
var nowFormExtend = "rawMaterialForm";
var nowFormExtendDiff = "baocaiFormExtend";
var myDropzone;
var readOnlyObj = [{"id":"checkresult","type":"radio"},{"id":"ispass","type":"radio"},{"id":"saveCheckApplication","type":"button"}];
var readOnlyObjExtend = ["al2o3check","mgocheck","caocheck","sio2check","lossonignitioncheck","alcheck","sicheck","carboncheck","fe2o3check","tio2check","k2ocheck","na2ocheck","cr2o3check","zro2check","siccheck","porecheck","bulkdensitycheck","flexuralcheck","withstandvoltagecheck","linearchangecheck","moisturecheck","ashspecificationcheck","addwatercheck","coagulationtimecheck","mobilitycheck","solidcontentcheck","residualcarboncheck","viscositycheck","elsechemistrycheck","elsephysicscheck","elseperforcheck","elseviscositycheck"];
var retesttype;
var displayallorder = 0;
var synctype;
var type = "";
var aoColumns;
var editType = "";
$(function() {
	loadAoColumns();
	querySystemConfig();
	initBootstrapValidator();
	// 页面对象
	com.leanway.loadTags();

	// Dropzone自动载入false
	Dropzone.options.myAwesomeDropzone = false;
	Dropzone.autoDiscover = false;
	// 产品类型
//	loadProtype();
	// 初始化Table
	employeecheckapplicationTable = initEmployeecheckapplicationTable() ;
	com.leanway.initTimePickYmdForMoreId("#date");

	// 初始化上传
	//initDropz();
//	com.leanway.enterKeyDownBatch("#searchValue,#resourceno,#productorname,#batch", searchCheckApplication);

	com.leanway.formReadOnly(nowFormExtendDiff, readOnlyObj);
	com.leanway.formReadOnly(nowForm, readOnlyObj);
	com.leanway.formReadOnly(nowFormExtend, readOnlyObj);
	formCheckBoxReadOnly();
	

	//$("#dropz").hide();

	$("input[name=confirmstatus]").click(function(){
//		com.leanway.clearTableMapData("dispatchingOrderTable");
		searchCheckApplication();
	});
	
	initDate("#retestexpiredate2");
	
	$("input[name=displayallorder]").click(function() {
	
		searchCheckApplication();
	});
	$("#productorTypeId").on("select2:select" , function( e ) {
		searchCheckApplication();
    });

	if (com.leanway.getQueryString("type") == "1"){
        $("#productordescEx").hide();
        $("#tableData0").hide();
	} else {
        $("#tableData1").hide();
	}
});

/**
 * checkbox只读
 */
function formCheckBoxReadOnly() {
	for (var i = 0; i < readOnlyObjExtend.length; i++){
		$("input[name='" + readOnlyObjExtend[i] + "']").prop("disabled", true);
//		$("input[name='" + readOnlyObjExtend[i] + "'][type='checkbox']").prop("checked", true);

	}
}

function formCheckBoxremoveReadOnly() {
	if (com.leanway.getQueryString("type") != "1" && editType != "1"){
        for (var i = 0; i < readOnlyObjExtend.length; i++){
            $("input[name='" + readOnlyObjExtend[i] + "']").prop("disabled", false);
//		$("input[name='" + readOnlyObjExtend[i] + "'][type='checkbox']").prop("checked", true);

        }

		if ($("#entrustdate").val() == "") {
            com.leanway.initTimePickYmdHmsForMoreId("#entrustdate");
            var d = new Date();
            var date=d.getDate();
            if(date<10){
                date = "0"+date;
            }
            var month = d.getMonth()+1;
            if(month<10){
                month = "0"+month;
            }
            var hours= d.getHours(); //获取系统时，
            if(hours<10){
                hours = "0"+hours;
            }
            var minutes = d.getMinutes(); //分
            if(minutes<10){
                minutes = "0"+minutes;
            }
            var seconds = d.getSeconds(); //秒
            if(seconds<10){
                seconds = "0"+seconds;
            }

            var str = d.getFullYear()+"-"+month+"-"+date+" "+hours+":"+minutes+":"+seconds;

            $("#entrustdate").val(str);
		}


	} else {
        $("#entrustnumber,#entrustdate,#characteristics,#texture,#inspectCount").prop("readonly", true);
	}
}

/**
 * 检验表单显示区分
 */
function formShowDifferentiate() {
	if (com.leanway.getQueryString("type") != "1"){
		$("#baocaiFormExtend").hide();
		$("#baocaiForm").show();
		return true;
	} else {
		$("#baocaiForm").hide();
		$("#baocaiFormExtend").show();
		return false;
	}
}

/**
 * 新增表单验证
 */
function initBootstrapValidator() {
	$('#rawMaterialForm').bootstrapValidator(
			{
				excluded : [ ':disabled' ],
				fields : {

					entrustnumber : {
						validators : {
							notEmpty : {}
						}
					},
					entrustdate : {
						validators : {
							notEmpty : {}
						}
					},
					characteristics : {
						validators : {
							notEmpty : {}							
						}
					},
					texture : {
						validators : {
							notEmpty : {}							
						}
					},
					inspectCount : {
						validators : {
							notEmpty : {}							
						}
					},
				}
});
}

//加载所有的产品种类
var loadProtype = function ( ) {
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/productors",
		data :{
			"method" : "findAllProtype"
		},
		dataType : "json",
		async : false,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {

			    var json = data;

				var protype = json.productorTypes;
				var html="";

				for (var i = 0;i<protype.length;i++) {
					/**
					 * option 的拼接 + "|" + protype[i].productortypename+
					 * */
					html +="<option value="+ protype[i].productortypeid+">"+protype[i].productortypemask +"</option>";
				}

				$("#productorTypeId").html(html);


			    $("#productorTypeId").select2({
			    	placeholder : "产品类型(可多选)",
			        tags: true,
			        language : "zh-CN",
			        allowClear: true,
			        maximumSelectionLength: 10  //最多能够选择的个数
			    });

			}
		}
	});
}

//初始化时间
function initDate(id) {
	$(id).datetimepicker({
	   	language:  'zh-CN',
	    weekStart: 7,
	    todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0,
		format: 'yyyy-mm-dd'
	});
}

var editCheckApplication = function ( ) {

	var applicationIds = com.leanway.getDataTableCheckIds("checkList");
	
	// 0:未处理，1：已处理
	var val = com.leanway.getDataTableCheckIds("confirmstatus");
	
	if (applicationIds == "" || applicationIds.indexOf(",") != -1) {
		lwalert("tipModal", 1, "请勾选一条申请单编辑！");
		return;
	} if ( val == 1){
		lwalert("tipModal", 1, "已审核的质检申请单不能编辑！");
		return;
	} else {
		
		// com.leanway.removeReadOnly(nowForm, readOnlyObj);
        if (editType != "1" || editType == "1" && com.leanway.getQueryString("type") == "1") {
            com.leanway.removeReadOnly(nowFormExtend, readOnlyObj);
		}

		formCheckBoxremoveReadOnly();
		
		$("#dropz").show();

		if (val == 0) {
//			$("input[type=radio][name=checkresult][value=0]").prop('checked',true);
			$("input[type=radio][name=ispass][value=0]").prop('checked',true);
		}

	}

}

var saveCheckApplicationAccessory = function ( applicationId, photoId, file) {

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/checkapplication",
		data : {
			"method" : "saveCheckApplicationAccessory",
			"applicationid" : applicationId,
			"photoid" : photoId
		},
		dataType : "json",
		async : true,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {

				if (data.status == "error") {

					lwalert("tipModal", 1, data.info);
					myDropzone.removeFile(file)
				} else {
					changeAccessoryNumber(applicationId, 1, 1);
				}

			}

		}
	});

}

var fancyBoxDelFile = function (photoId, type ) {
	com.leanway.confirm(2, {
        title    : '删除提示',
        message  : '确定删除该附件？',
        callback : function (value) {
            if (value) {
            	deleteFile(photoId, type);
            } else {
            	 reloadAccessory();
            }
        }
    });
}


var deleteFile = function (photoId, type ) {

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/checkapplication",
		data : {
			"method" : "deleteCheckApplicationAccessory",
			"photoId" : photoId
		},
		dataType : "json",
		async : true,
		success : function ( text ) {

			if (type == 2) {
				reloadAccessory(type);
			} else {
				reloadAccessory(type)
			}

			var id = com.leanway.getDataTableCheckIds("checkList");

			// 刷新table中显示的数量
			changeAccessoryNumber(id, 1 , 2);
		}
	});

}

var reloadAccessory = function ( type ) {


	// 刷新控件数据
	var applicationId = com.leanway.getDataTableCheckIds("checkList");

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/checkapplication",
		data : {
			"method" : "queryCheckApplicationData",
			"applicationid" : applicationId
		},
		dataType : "json",
		async : true,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {

				if (myDropzone != undefined && typeof(myDropzone) != "undefined") {

					// 销毁 && 清空 && 初始化 && 重置
					myDropzone.destroy();
					$("#dropz").html("");
					initDropz();
					myDropzone.emit("reset");

					var listAccessory = data.listAccessory;

					// 把已上传的文件显示到Dropzone控件中
					initDropzoneData(listAccessory);

					if (type == 2) {
						viewApplicationAccessory(applicationId);
					}
				} else {
					initDropz();
				}


			}

		}
	});


}

var initDropz= function (  ) {

	$("#dropz").dropzone({
		url: "../../../../"+ln_project+"/template?method=uploadQcImg&tbl=checkapplication",
		maxFiles: 10,
		thumbnailWidth:230,
		thumbnailHeight:230,
		uploadMultiple : false,
		parallelUploads: 10,
		dictMaxFilesExceeded: "您最多只能上传10个文件！",
		addRemoveLinks:true,
		dictRemoveFile:"移除文件",
		dictCancelUpload: "取消上传",
		dictCancelUploadConfirmation: "你确定要取消上传吗?",
		autoProcessQueue:true,
		dictResponseError: '文件上传失败!',
		maxFilesize: 20,
		acceptedFiles: ".jpg,.png,.gif",
		dictDefaultMessage : "点击此处添加附件！",
		dictInvalidFileType: "你不能上传该类型文件，只能是图片类型！",
		dictRemoveFileConfirmation : "确定删除该附件？",
		init : function( ) {

			myDropzone = this;

			this.on("addedfile", function(file) {

				var id = com.leanway.getDataTableCheckIds("checkList");

				if ((id == "" || id.indexOf(",") != -1) && (file.accepted != true)) {
					this.removeFile(file);
					lwalert("tipModal", 1, "请选择一条数据进行上传附件！");
					return;
				} else {

					// 添加点击事件
					file.previewElement.addEventListener("click", function() {
						previewImg(file);
					});
				}

			});

			this.on("removedfile", function(file) {

				// row 140 上传文件异常后removeFile时没有fileId
				if (file.fileId != undefined && typeof(file.fileId) != "undefined") {
					var id = com.leanway.getDataTableCheckIds("checkList");
					com.leanway.setMapValue(id, file.fileId,"checkList", "del");

					// 发起ajax到后台进行删除文件
					deleteFile(file.fileId);
				}
			});

			this.on("success", function(file, json) {
console.info(json);
				var flag =  com.leanway.checkLogind(json);

				if ( flag ) {
					// successmultiple
					json = eval("(" + json + ")");
				//	saveRowPhotoId(json.photoId, file);
					file.fileId = json.photoId;
					file.fileUrl = json.url;

					// 把上传的图片和当前申请单进行业务数据绑定
					var id = com.leanway.getDataTableCheckIds("checkList");
					saveCheckApplicationAccessory(id, json.photoId, file);
				}

		    });

		   this.on("error", function(file, errorMessage, XMLHttpRequest) {

			   lwalert("tipModal", 1, "上传附件异常，请联系管理员！");
			   this.removeFile(file);

           });

			this.on("complete", function(){
				// completemultiple
		    })
		}
	});

/*var mockFile = { name: "123.jpg", accepted:true};
	myDropzone.emit("addedfile", mockFile);
	myDropzone.emit("thumbnail", mockFile, "http://edms.kitesky.com/upload/image/20170422/52edf3c2aabf171315d968d9af814d0c.jpg");
	myDropzone.emit("complete", mockFile);*/

}


// 把图片数据绑到控件
var initDropzoneData = function ( listAccessory ) {

	if (listAccessory != null && listAccessory.length > 0) {
		for (var i = 0; i <  listAccessory.length; i++ ) {
			var file = listAccessory[i];

			var mockFile = { name: file.photoName, accepted:true, size :file.size, fileId :file.photoId,fullurl:file.fullurl};
			myDropzone.emit("addedfile", mockFile);
			myDropzone.emit("thumbnail", mockFile, file.fullurl);
			myDropzone.emit("complete", mockFile);

		}
	}

	//myDropzone.removeAllFiles();

}

var viewApplicationAccessory = function ( applicationId ) {

		$.ajax ( {
			type : "post",
			url : "../../../../"+ln_project+"/checkapplication",
			data : {
				"method" : "queryCheckApplicationData",
				"applicationid" : applicationId
			},
			dataType : "json",
			async : true,
			success : function ( data ) {

				var flag =  com.leanway.checkLogind(data);

				if ( flag ) {

					// fancyBox数据集合
					var fancyboxArray = new Array();

					var listAccessory = data.listAccessory;

					if (listAccessory != null && listAccessory.length > 0) {
						for (var i = 0; i <  listAccessory.length; i++ ) {
							var file = listAccessory[i];

							 // 创建fancybox对应的属性和属性数据
							 var fileObj = new Object();
							 // src
							 fileObj.src = file.fullurl;
							 fileObj.fileId = file.photoId;

							 // opts
							 var optsObj = new Object();
							 // 标题
							 optsObj.caption = file.photoName;
							 fileObj.opts = optsObj;

							 fancyboxArray.push(fileObj);

						}

						$.fancybox.open(fancyboxArray, {
							onInit : function( instance,current ) {
								instance.$refs.delbtn = $('<a data-fancybox-close class="fancybox-button" onclick="">删除</a>').appendTo( instance.$refs.buttons );
							},
							beforeMove: function( instance, current ) {
								instance.$refs.delbtn.attr('onclick', 'fancyBoxDelFile(\'' + current.fileId+ '\',\'2\');');
							},
							loop : false,
							hash : "test",
							thumbs  : {
								showOnStart  : false
							}
						});
					}

				}

			}
		});


}

var isSureDelete = function ( accepted ) {

}

var loadFormData = function ( applicationId ) {
	//console.log(myDropzone);
	//myDropzone.disable();
	//myDropzone.emit("reset");
	//myDropzone.destroy();

	if (myDropzone != undefined && typeof(myDropzone) != "undefined") {

		// 销毁 && 清空 && 初始化 && 重置
		myDropzone.destroy();
		$("#dropz").html("");
		initDropz();
		myDropzone.emit("reset");

	} else {
		initDropz();
	}

	Dropzone.confirm = function(question, accepted, rejected) {
		  // Ask the question, and call accepted() or rejected() accordingly.
		  // CAREFUL: rejected might not be defined. Do nothing in that case.
		  // Open customized confirmation dialog window
		com.leanway.confirm(2, {
            title    : '删除提示',
            message  : '确定删除该附件？',
            callback : function (value) {
                if (value) {
                	accepted();

                } else {
                //	rejected();
                }
            }
        });

	};

	//Dropzone.options.myAwesomeDropzone = false;
	//Dropzone.autoDiscover = false;

	$( '#baocaiForm' ).each( function ( index ) {
		$('#baocaiForm')[index].reset( );
	});

	if (applicationId == "" ) {
		return;
	}
	
	formShowDifferentiate();

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/checkapplication",
		data : {
			"method" : "queryCheckApplicationData",
			"applicationid" : applicationId
		},
		dataType : "json",
		async : true,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {

				var checkapplicationdata = data.data ;
				$("#applicationid").val(applicationId) ;

//				// 包材表单
//				if (checkapplicationdata.codenum == "001") {
//					nowForm = "yuancailiaoForm";
//				}else if (checkapplicationdata.codenum == "003") {
//					nowForm = "waifawaigouForm";
//				} else if (checkapplicationdata.codenum == "002") {
//					nowForm = "banchengpingForm";
//				} else if ( checkapplicationdata.codenum == "004") {
//					nowForm = "baocaiForm";
//				} else{
//					nowForm = "baocaiForm";
//				}

			//	$("#dropz").hide();
				com.leanway.formReadOnly(nowFormExtendDiff, readOnlyObj);
				com.leanway.formReadOnly(nowForm, readOnlyObj);
				com.leanway.formReadOnly(nowFormExtend, readOnlyObj);
				formCheckBoxReadOnly();
//				// 隐藏所有form
//				$("#baocaiForm,#waifawaigouForm,#banchengpingForm,#yuancailiaoForm").hide();
//
//				// 显示申请单类型的form
//				$("#" + nowForm).show();
				$("#rawMaterialForm").hide();
				if (synctype == "lier"){
					if (checkapplicationdata.code == "06"){
						$("#rawMaterialForm").show();
					}
				}
				
				var content = checkapplicationdata.content;
				$("#" + nowForm + " #content").val(content);

				var contentJson =$.parseJSON(content);
				editType = contentJson.type;
				com.leanway.clearForm2("#" + nowForm);
				com.leanway.clearForm2("#" + nowFormExtend);
				setFormValue(nowForm, contentJson,checkapplicationdata);
				setFormValue(nowFormExtendDiff, contentJson,checkapplicationdata);
				setFormExtendValue(nowFormExtend, contentJson);
				setFormCheckbox(contentJson);
				var listAccessory = data.listAccessory;
				
				// 把已上传的文件显示到Dropzone控件中
				initDropzoneData(listAccessory);
			}

		}
	});

}

// 查询系统参数配置
var querySystemConfig = function ( ) {

	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/checkapplication",
		data : {
			"method" : "querySystemConfig",
		},
		dataType : "json",
		async : false,
		success : function ( data ) {
			if (data){
                synctype = data.configvalue;
			}
		}
	});
}

var saveCheckApplicationData = function ( ) {

    for (var i = 0; i < readOnlyObjExtend.length; i++){
        $("input[name='" + readOnlyObjExtend[i] + "']").prop("disabled", false);
    }

	var applicationId = com.leanway.getDataTableCheckIds("checkList");
	var form  = $("#" + nowForm).serializeArray();
	var formData = formatFormJson(form);
	var content = $("#" + nowForm + " #content").val();
	var formExtend  = $("#" + nowFormExtend).serializeArray();
	if (com.leanway.getQueryString("type") == "1") {
        formExtend.push({name: "type", value: "1"});
	} else {
        formExtend.push({name: "type", value: "0"});
	}
	var formDataExtend = formatFormJson(formExtend);
	$("#rawMaterialForm").data('bootstrapValidator').resetForm();
	$("#rawMaterialForm").data('bootstrapValidator').validate();
	if ($('#rawMaterialForm').data('bootstrapValidator').isValid()){
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/checkapplication",
		data : {
			"method" : "saveCheckApplicationData",
			"formData" : formData,
			"formDataExtend" : formDataExtend,
			"content" : content,
			"applicationid" : applicationId,
		},
		dataType : "json",
		async : true,
		success : function ( data ) {

			var flag =  com.leanway.checkLogind(data);

			if ( flag ) {

				lwalert("tipModal", 1, data.info);

				employeecheckapplicationTable.ajax.reload();

			}

		}
	});
	}
}

var initEmployeecheckapplicationTable = function() {

	var searchCondition = getSearchConditions();
	var strCondition = encodeURIComponent($.trim(JSON.stringify(searchCondition)));
	var table = $('#employeecheckapplicationTable')
	.DataTable(
			{
				"ajax" : "../../../../"+ln_project+"/checkapplication?method=queryCheckApplicationList&type=" + type + "&strCondition=" + strCondition,
//				"iDisplayLength" : 10,//分页显示的行数
				"pageUrl"  :  "checkapplication/checkapplication.html",
				//"iTotalRecords":"5",
				'bPaginate' : true,
				"bDestory" : true,
				"bRetrieve" : true,
				"bFilter" : false,
				"bSort" : false,
				//"scrollY":"250px",
				"bProcessing" : true,
				"bServerSide" : true,
				'searchDelay' : "5000",
				"aoColumns" : aoColumns,
		           "oLanguage" : {
		        	   "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		           },
		           "sDom" : "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		           "fnDrawCallback" : function(data) {
		        		com.leanway.getDataTableFirstRowId(
								"employeecheckapplicationTable", loadFormData,"more","checkList");
		        	   com.leanway.dataTableClickMoreSelect("employeecheckapplicationTable", "checkList", false,
		        			   employeecheckapplicationTable, loadFormData,undefined,undefined,"checkAll");

		           },

			}).on('xhr.dt', function (e, settings, json) {
				com.leanway.checkLogind(json);
				table.columns.adjust();
				com.leanway.formReadOnly(nowFormExtendDiff, readOnlyObj);
				com.leanway.formReadOnly(nowForm, readOnlyObj);
				com.leanway.formReadOnly(nowFormExtend, readOnlyObj);
			//	$("#dropz").hide();
			} );

	return table;
}


function setFormValue(formId, data,checkapplicationdata) {

	for ( var item in data) {
		  if (item == "checkresult" || item == "ispass"){
              $("input[type=radio][name=" + item + "][value=" + data[item] + "]").prop('checked',true);
          }else {

        	  if (item != "searchValue") {
        		  $("#" + formId + " #" + item).val(data[item]);
        	  }
          }


	}
	  $("#" + formId + " #totalnumber").val(checkapplicationdata.totalnumber);
	  $("#" + formId + " #productorname").val(checkapplicationdata.productorname);
	  $("#" + formId + " #productordesc").val(checkapplicationdata.productordesc);
	  $("#" + formId + " #material").val(checkapplicationdata.material);

}

function setFormExtendValue(formId, data) {

	for ( var item in data) {
		  if (item == "checkresult" || item == "ispass"){
              $("input[type=radio][name=" + item + "][value=" + data[item] + "]").prop('checked',true);
          }else {
        	  if (item != "searchValue" && item.indexOf("check") == -1) {
        		  $("#" + formId + " #" + item).val(data[item]);
        	  }
          }

	}

}

function setFormCheckbox(data) {

	for ( var item in data) {

			for (var i = 0; i < readOnlyObjExtend.length; i++){
				if(data[item] == "1" && item == readOnlyObjExtend[i]){
					$("input[name='" + readOnlyObjExtend[i] + "'][type='checkbox']").prop("checked", true);
				}
			}
	}
}

/**
 * 展示模板信息
 */
function viewTemplate (templateids,eventids,templateactionids) {

		$('#veiwTemplateCatlateModal').modal({backdrop: 'static', keyboard: true});

	    if (viewTemplateCatlateTable == null || viewTemplateCatlateTable == "undefined" || typeof(viewTemplateCatlateTable) == "undefined") {
	    	viewTemplateCatlateTable = initViewTemplateCatlateTable(templateids,eventids,templateactionids);

	    } else {
	    	viewTemplateCatlateTable.ajax.url("../../../../"+ln_project+"/checkapplication?method=queryTemplatecatlateByTemplateIds&catlateid=" + templateids+"&eventids="+eventids +"&templateactionids="+templateactionids).load();
	    }
}

function viewEmployee(employeeids) {

	 	$('#veiwEmployeeModal').modal({backdrop: 'static', keyboard: true});

	    if (viewEmployeeTable == null || viewEmployeeTable == "undefined" || typeof(viewEmployeeTable) == "undefined") {
	        viewEmployeeTable = initViewEmployeeTable(employeeids);

	    } else {
	        viewEmployeeTable.ajax.url("../../../../"+ln_project+"/checkapplication?method=queryEmployeesByEmployeesIds&employeeids=" + employeeids).load();
	    }

}
//初始化雇员列表
var initViewEmployeeTable = function (id) {

    //com.leanway.checkSession();
    var table = $('#viewEmployeeTables').DataTable( {
        "ajax": '../../../../'+ln_project+'/checkapplication?method=queryEmployeesByEmployeesIds&employeeids='+id,
        'bPaginate': false,
        "bDestory": true,
        "bRetrieve": true,
        "bFilter":false,
        "bSort": false,
        "bProcessing": true,
        "bServerSide": false,
        "aoColumns": [
                      {"mDataProp": "name"},
                      {"mDataProp": "moble"},
                      ],
                      "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
                          //add selected class
                      },
                      "oLanguage" : {
                          "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                      }

    } ).on('xhr.dt', function (e, settings, json) {
        com.leanway.checkLogind(json);
    } );

    return table;
}
//初始化模板列表
var initViewTemplateCatlateTable = function(id,eventids,templateactionids){
	   var table = $('#viewTemplateCatlateTable').DataTable( {
	        "ajax": '../../../../'+ln_project+'/checkapplication?method=queryTemplatecatlateByTemplateIds&catlateid='+id+'&eventids='+eventids+'&templateactionids='+templateactionids,
	        'bPaginate': false,
	        "bDestory": true,
	        "bRetrieve": true,
	        "bFilter":false,
	        "bSort": false,
	        "bProcessing": true,
	        "bServerSide": false,
	        "aoColumns": [
	                      {"mDataProp": "templatename"},
	                      {"mDataProp": "version"},
	                      {"mDataProp": "name"},
	                      ],
	                      "fnCreatedRow": function ( nRow, aData, iDataIndex ) {
	                      },
	                      "oLanguage" : {
	                          "sUrl" : "../../../jslib/datatables/zh-CN.txt"
	                      }

	    } ).on('xhr.dt', function (e, settings, json) {
	        com.leanway.checkLogind(json);
	    } );

	    return table;
}

function searchCheckApplication () {

	// 获取查询条件的值
	var searchCondition = getSearchConditions();
	var strCondition = encodeURIComponent($.trim(JSON.stringify(searchCondition)));

	employeecheckapplicationTable.ajax.url("../../../../"+ln_project+"/checkapplication?method=queryCheckApplicationList&type=" + type + "&strCondition=" + strCondition).load();
}

/**
 * 将单据转变成名称
 */
function noToName(sData) {
	var result = "";
	if(sData!= undefined && sData!= null && sData!='' ){
		if (sData =='deliveryorderdetail') {
			result = "采购入库";
		} else if (sData == 'additionaldetail') {
			result = "杂入杂出" ;
		} else if( sData == "productiontrack") {
			result = "完工入库";
		}else if(sData=="salesrefunddetail"){
			result = "销售退货";
		}
		
	}
	return result ;
}

//格式化form数据
var formatFormJson = function(formData) {
	var reg = /,$/gi;
	var data = "{";
	for (var i = 0; i < formData.length; i++) {
		if (formData[i].name != "content") {
			data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
		}/* else {
			data += "\"content\" : " + formData[i].value + ",";
		}*/
	}
	data = data.replace(reg, "");
	data += "}";
	return data;
}

var getSearchConditions = function (  ) {

	var sqlJsonArray = new Array()

	var sqlJson = "";

	// 0：未处理，1：已处理
	var confirmstatus =  $('input[name="confirmstatus"]:checked').val();

	// 关键字
	var searchVal = $("#searchValue").val();
	
	var resourceno = $("#resourceno").val();
	
	var productorname = $("#productorname").val();

    var productordesc = $("#productordescEx").val();
	
	var batch = $("#batch").val();
//	// 产品类型
//	var productorTypeId = $("#productorTypeId").val();
//
//	if (productorTypeId != null && productorTypeId != "" && typeof(productorTypeId) != "undefined" && productorTypeId != undefined) {
//		productorTypeId = productorTypeId.toString();
//	}

	
	//是否显示所有质检单
	var displayallorder =  $('input[name="displayallorder"]:checked').val();
	var date = $("#date").val();
	
	if ($.trim(resourceno) != "") {

		var resourceNoObj = new Object();
		resourceNoObj.fieldname = "cha.resourceno";
		resourceNoObj.fieldtype = "varchar";
		resourceNoObj.value = resourceno;
		resourceNoObj.logic = "and";
		resourceNoObj.ope = "like";

		sqlJsonArray.push(resourceNoObj);
	}
//	if ($.trim(productorTypeId) != "") {
//
//		var productorTypeIdObj = new Object();
//		productorTypeIdObj.fieldname = "pt.productorTypeId";
//		productorTypeIdObj.fieldtype = "varchar_select2";
//		productorTypeIdObj.value = productorTypeId;
//		productorTypeIdObj.logic = "and";
//		productorTypeIdObj.ope = "in";
//
//		sqlJsonArray.push(productorTypeIdObj);
//	}

	if ($.trim(productorname) != "") {

		var productorNameObj = new Object();
		productorNameObj.fieldname = "ps.productorname";
		productorNameObj.fieldtype = "varchar";
		productorNameObj.value = productorname;
		productorNameObj.logic = "and";
		productorNameObj.ope = "like";

		sqlJsonArray.push(productorNameObj);
	}

    if ($.trim(productordesc) != "") {

        var productorDescObj = new Object();
        productorDescObj.fieldname = "ps.productordesc";
        productorDescObj.fieldtype = "varchar";
        productorDescObj.value = productordesc;
        productorDescObj.logic = "and";
        productorDescObj.ope = "like";

        sqlJsonArray.push(productorDescObj);
    }
	
	if ($.trim(batch) != "") {

		var batchObj = new Object();
		batchObj.fieldname = "cha.batch";
		batchObj.fieldtype = "varchar";
		batchObj.value = batch;
		batchObj.logic = "and";
		batchObj.ope = "like";

		sqlJsonArray.push(batchObj);
	}

	var condition = new Object();
	condition.searchValue = $.trim(searchVal);
	condition.confirmstatus = confirmstatus;
/*	condition.resourceno = resourceno;
	condition.productorname = productorname;
	condition.batch = batch;*/
	condition.sqlDatas = sqlJsonArray;
	condition.displayallorder = displayallorder;
	condition.date = date;
	return condition;
}

var previewImg = function (file ) {

	var fancyboxArray = new Array();

	 // 创建fancybox对应的属性和属性数据
	 var fileObj = new Object();
	 // src
	 fileObj.src = file.fullurl;
	 // opts
	 var optsObj = new Object();
	 // 标题
	 optsObj.caption = file.name;
	 fileObj.opts = optsObj;

	 var flag = com.leanway.viewImageByUrl(fileObj.src);

	 if(flag==false){
		 fancyboxArray.push(fileObj);

		 $.fancybox.open(fancyboxArray, {
	      loop : false,
	      hash : "test",
	      thumbs  : {
	    	  showOnStart  : false
	      	}
		 });
		 
	 }
	 
	 
	 

}

/**
 * id：DataUuid
 * number ：操作数量，
 * type 1:增加，2：减少
 */
var changeAccessoryNumber = function (id, number, type ) {

	$("#employeecheckapplicationTable tbody tr").each( function() {

		var index = employeecheckapplicationTable.row(this).index();
		var applicationid = employeecheckapplicationTable.rows().data()[index].applicationid;

		if (id == applicationid) {

			var td = $(this).find("td:eq(6)");
			var data = td.find("#viewDivId").html()

			// 为空时新增
			if ((data == undefined || typeof data == "undefined") && type == 1) {

				td.find("#viewDivId").html("<i class='fa fa-eye'></i>预览[1]");

			// 为空时删除
			} if ((data == undefined || typeof data == "undefined") && type == 2) {

			} else {

				var dataArray = data.split("预览[");
				var number = parseInt(dataArray[1].replace("]"));

				// 新增的情况下
				if (type == 1) {

					number = number + 1;

					td.find("#viewDivId").html("<i class='fa fa-eye'></i>预览[" + number + "]");

				// 减的情况下
				} else {
					number = number - 1;

					if (number == 0) {
						td.find("#viewDivId").html("")
					} else {
						td.find("#viewDivId").html("<i class='fa fa-eye'></i>预览[" + number + "]");
					}

				}

			}

		}

	})
}

var auditPorductor = function ( type ) {
	
	var val = com.leanway.getDataTableCheckIds("confirmstatus");
	
	if (val == 1) {
		lwalert("tipModal", 1, "已质检的申请不能再次质检!");
        return;
	}
	

	if (val == 2) {
		lwalert("tipModal", 1, "质检申请已关闭不能进行质检!");
        return;
	}
	
	
	var searchCondition = new Object();

	if (type == 1 || type == 3 || type == 11) {
		
		var ids = com.leanway.getDataTableCheckIds("checkList");
		
		if ( ids == "" ) {
			
			lwalert("tipModal", 1, "请选择质检单进行质检!");
	        return;
		}
		
		searchCondition.applicationIds = ids;
	} else {
		searchCondition = getSearchConditions();
	}
	
		    
	    var msg = "确定对质检申请进行审核？";

		lwalert("tipModal", 2, msg ,"isSureAuditPorductor(" + type +")");

}

var isSureAuditPorductor = function (type) {
	
	var searchCondition = new Object();

	if (type == 1 || type == 3 || type == 11) {
		
		var ids = com.leanway.getDataTableCheckIds("checkList");

		
		searchCondition.applicationIds = ids;
	} else {
		searchCondition = getSearchConditions();
	}
	
	var strCondition = $.trim(JSON.stringify(searchCondition));
	
		$.ajax ( {
			type : "post",
			url : "../../../../"+ln_project+"/checkapplication",
			data : {
				"method" : "auditCheckApplication",
				"strCondition" : strCondition,
				"type" : type
			},
			dataType : "json",
			async : true,
			success : function ( data ) {
	
				var flag =  com.leanway.checkLogind(data);
	
				if ( flag ) {
	
					if (data.status == "success") {
						
						employeecheckapplicationTable.ajax.reload(null,false);
	
					} else {
						
						lwalert("tipModal", 1, data.info);
	
					}
	
				}
	
			}
		});
}

var auditRetestdate = function ( type ) {
	
	retesttype = type;
	
	var val = com.leanway.getDataTableCheckIds("confirmstatus");
	
	if (val == 1) {
		lwalert("tipModal", 1, "已质检的申请不能再修改复检时间!");
        return;
	}
	
	if (val == 2) {
		lwalert("tipModal", 1, "质检申请已关闭不能再修改复检时间!");
        return;
	}
	
	var searchCondition = new Object();

	if (type == 1 || type == 3 || type == 11) {
		
		var ids = com.leanway.getDataTableCheckIds("checkList");
		
		if ( ids == "" ) {
			
			lwalert("tipModal", 1, "请选择质检单进行修改!");
	        return;
		}
		
		searchCondition.applicationIds = ids;
	} else {
		searchCondition = getSearchConditions();
	}
	
		    
	    $('#timeModal').modal({backdrop: 'static', keyboard: true});
//	    var msg = "确定对质检申请进行审核？";
//
//		lwalert("timeModal", 2, msg ,"isSureAuditRetestdate(" + type +")");

}


var isSureAuditRetestdate = function () {
	
	var searchCondition = new Object();

	if (retesttype == 1) {
		
		var ids = com.leanway.getDataTableCheckIds("checkList");

		
		searchCondition.applicationIds = ids;
	} else {
		searchCondition = getSearchConditions();
	}
	
	var retestexpiredate = $('#retestexpiredate2').val();
	
	var strCondition = $.trim(JSON.stringify(searchCondition));
	
		$.ajax ( {
			type : "post",
			url : "../../../../"+ln_project+"/checkapplication",
			data : {
				"method" : "updateRetestdate",
				"strCondition" : strCondition,
				"type" : retesttype,
				"retestexpiredate" : retestexpiredate
			},
			dataType : "json",
			async : true,
			success : function ( data ) {
	
				var flag =  com.leanway.checkLogind(data);
	
				if ( flag ) {
	
					if (data.status == "success") {
						
						$('#timeModal').modal('hide');
						employeecheckapplicationTable.ajax.reload(null,false);
	
					} else {
						
						lwalert("tipModal", 1, data.info);
	
					}
	
				}
	
			}
		});
}


//关闭质检申请
var closeapplication = function ( type ) {
	
	var val = com.leanway.getDataTableCheckIds("confirmstatus");
	
	if (val == 1) {
		lwalert("tipModal", 1, "已质检的申请不能关闭!");
        return;
	}
	
	if (val == 2) {
		lwalert("tipModal", 1, "质检申请已关闭!");
        return;
	}
	
	
	var searchCondition = new Object();

	if (type == 1 || type == 3 || type == 11) {
		
		var ids = com.leanway.getDataTableCheckIds("checkList");
		
		if ( ids == "" ) {
			
			lwalert("tipModal", 1, "请选择质检单进行质检!");
	        return;
		}
		
		searchCondition.applicationIds = ids;
	} else {
		searchCondition = getSearchConditions();
	}
	
		    
	    var msg = "确定对质检申请进行关闭？";

		lwalert("tipModal", 2, msg ,"isSureCloseapplication(" + type +")");

}

var isSureCloseapplication = function (type) {
	
	var searchCondition = new Object();

	if (type == 1 || type == 3 || type == 11) {
		
		var ids = com.leanway.getDataTableCheckIds("checkList");

		
		searchCondition.applicationIds = ids;
	} else {
		searchCondition = getSearchConditions();
	}
	
	var strCondition = $.trim(JSON.stringify(searchCondition));
	
		$.ajax ( {
			type : "post",
			url : "../../../../"+ln_project+"/checkapplication",
			data : {
				"method" : "closeApplication",
				"strCondition" : strCondition,
				"type" : type
			},
			dataType : "json",
			async : true,
			success : function ( data ) {
	
				var flag =  com.leanway.checkLogind(data);
	
				if ( flag ) {
	
					if (data.status == "success") {
						
						employeecheckapplicationTable.ajax.reload(null,false);
	
					} else {
						
						lwalert("tipModal", 1, data.info);
	
					}
	
				}
	
			}
		});
}

var loadAoColumns = function () {

    type = com.leanway.getQueryString("type");
    $("#tableEntrustnumber").hide();
    $("#tableProductordesc").hide();

    if (type == "1") {
        $("#tableEntrustnumber").show();
        $("#tableProductorname").hide();
        aoColumns = [
            {
                "mDataProp" : "applicationid",
                "fnCreatedCell" : function(nTd, sData,
                                           oData, iRow, iCol) {
                    $(nTd).html("<div id='stopPropagation" + iRow +"'>"
                        +"<input class='regular-checkbox' type='checkbox' id='" + sData
                        + "' name='checkList' value='" + sData
                        + "'><label for='" + sData
                        + "'></label>");
                    com.leanway.columnTdBindSelectNew(nTd,"employeecheckapplicationTable","checkList");
                }
            }, /*{
							"mDataProp" : "resourceno"

						},*/ {
                "mDataProp" : "tablename" ,
                "fnCreatedCell" : function(nTd, sData,oData, iRow, iCol) {
                    $(nTd).html(noToName(sData));
                }
            },
//
//						{	"mDataProp" : "templatename"/* ,
//							"fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
//	                                   if (sData != "false") {
//	                                       $(nTd).html("<a  style=\"cursor:pointer;\" onclick=\"viewTemplate('" + oData.catlateid  + "' , '" + oData.eventid  +"' , '" +oData.templateactionid+"');\"  id=\"viewTemplate" + iRow+ "\">查看</a>");
//	                                   } else {
//	                                       $(nTd).html("");
//	                                   }
//
//	                               }*/
//						},
            { "mDataProp" : "entrustnumber" },
            { "mDataProp" : "batch" },
            // { "mDataProp" : "productorname" },
            { "mDataProp" : "version" },
            {
                "mDataProp" : "entrustdate"
            },
            //								{
            //									"mDataProp" : "name" ,
            //									"fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
            //	                                       if (sData != "false") {
            //	                                           $(nTd).html("<a  style=\"cursor:pointer;\" onclick=\"viewEmployee('" + sData + "');\"  id=\"viewEmployee" + iRow+ "\">查看</a>");
            //	                                       } else {
            //	                                           $(nTd).html("");
            //	                                       }
            //
            //	                                   }
            //								},
            {	"mDataProp" : "applicationaccessory" ,
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {

                    if (sData > 0) {
                        $(nTd).html("<a  style=\"cursor:pointer;\" onclick=\"viewApplicationAccessory('" + oData.applicationid  + "');\"  id=\"viewTemplate" + iRow+ "\"><div id='viewDivId'><i class='fa fa-eye'></i>预览[" + sData + "]</div></a>");
                    } else {
                        $(nTd).html("");
                    }

                }
            } ]
	} else {
        $("#tableProductordesc").show();
        aoColumns = [
            {
                "mDataProp" : "applicationid",
                "fnCreatedCell" : function(nTd, sData,
                                           oData, iRow, iCol) {
                    $(nTd).html("<div id='stopPropagation" + iRow +"'>"
                        +"<input class='regular-checkbox' type='checkbox' id='" + sData
                        + "' name='checkList' value='" + sData
                        + "'><label for='" + sData
                        + "'></label>");
                    com.leanway.columnTdBindSelectNew(nTd,"employeecheckapplicationTable","checkList");
                }
            }, /*{
							"mDataProp" : "resourceno"

						},*/ {
                "mDataProp" : "tablename" ,
                "fnCreatedCell" : function(nTd, sData,oData, iRow, iCol) {
                    $(nTd).html(noToName(sData));
                }
            },
//
//						{	"mDataProp" : "templatename"/* ,
//							"fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
//	                                   if (sData != "false") {
//	                                       $(nTd).html("<a  style=\"cursor:pointer;\" onclick=\"viewTemplate('" + oData.catlateid  + "' , '" + oData.eventid  +"' , '" +oData.templateactionid+"');\"  id=\"viewTemplate" + iRow+ "\">查看</a>");
//	                                   } else {
//	                                       $(nTd).html("");
//	                                   }
//
//	                               }*/
//						},
            { "mDataProp" : "productordesc" },
            { "mDataProp" : "batch" },
            { "mDataProp" : "productorname" },
            { "mDataProp" : "version" },
            {
                "mDataProp" : "createtime"
            },
            //								{
            //									"mDataProp" : "name" ,
            //									"fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
            //	                                       if (sData != "false") {
            //	                                           $(nTd).html("<a  style=\"cursor:pointer;\" onclick=\"viewEmployee('" + sData + "');\"  id=\"viewEmployee" + iRow+ "\">查看</a>");
            //	                                       } else {
            //	                                           $(nTd).html("");
            //	                                       }
            //
            //	                                   }
            //								},
            {	"mDataProp" : "applicationaccessory" ,
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {

                    if (sData > 0) {
                        $(nTd).html("<a  style=\"cursor:pointer;\" onclick=\"viewApplicationAccessory('" + oData.applicationid  + "');\"  id=\"viewTemplate" + iRow+ "\"><div id='viewDivId'><i class='fa fa-eye'></i>预览[" + sData + "]</div></a>");
                    } else {
                        $(nTd).html("");
                    }

                }
            } ]
	}

}