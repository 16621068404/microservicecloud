var clicktime = new Date();
var oTable;
$(function() {

oTable=initTable();
getYear();
com.leanway.enterKeyDown("searchValue", searchProductor);
})


// 初始化数据表格
	var initTable = function () {

		var table = $('#generalInfo').DataTable( {
				"ajax": "../../../../"+ln_project+"/productionCycle?method=queryProductorsList",
		        'bPaginate': true,
		        "bDestory": true,
		        "bRetrieve": true,
		        "bFilter":false,
		        "bSort": false,
		        "bProcessing": true,
		        "bServerSide": true,
		        'searchDelay':"5000",
		        "columns": [
	                {"data" : "productorid"},
	                { "data": "productorname" },
	                { "data": "productordesc" },
		         ],
		         "aoColumns": [
		               {
		            	   "mDataProp": "productorid",
		                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
//		                	   if(oData.rate!=null){
//									oData.rate ="<div class='progress'>" +
//											"<div class='progress-bar' role='progressbar' aria-valuenow='"+oData.rate+"' aria-valuemin='0' aria-valuemax='100' style='width:"+oData.rate+"%;'>"+oData.rate+"%" +
//											"</div>" +
//											"</div>";
//								}

		                	   $(nTd).html(
                                       "<input class='regular-checkbox' type='checkbox' id='" + sData
                                               + "' name='checkList' value='" + sData
                                               + "'><label for='" + sData
                                               + "'></label>");
		                   }
		               },
		               {"mDataProp": "productorname"},
		               {"mDataProp": "productordesc"},
		          ],
		         "oLanguage" : {
		        	 "sUrl" : "../../../jslib/datatables/zh-CN.txt"
		         },
		         "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
		         "fnDrawCallback" : function(data) {
		        	 com.leanway.dataTableClick("generalInfo", "checkList", false,
                             oTable, getChartByProductorId);
					}
		    } ).on('xhr.dt', function (e, settings, json) {
				com.leanway.checkLogind(json);
			} );

		return table;
	}

function getChartByProductorId(id){
	
	showMask();
	var year = $("#year").val();
	if(year==-1){
		 year=v;
	 }
	$.ajax ( {
		type : "post",
		url : "../../../../"+ln_project+"/waitTimeRate",
		data : {

			"method" : "queryChartByProductorId",
			 "productorid" : id,
			 "year":year
		},
		dataType : "text",
		async : false,
		success : function ( data ) {

			
			var flag =  com.leanway.checkLogind(data);
			
			if(flag){
			
					var temp = $.parseJSON(data);
		            if(temp.status=="error"){
		                hideMask();
		                lwalert("tipModal",1,temp.info);
		            }else{
						FusionCharts.ready(function () {
							var analysisChart = new FusionCharts({
								type: 'mscolumn3dlinedy',
								renderAt: 'finishproductors-container',
								width:changeWidth("finishproductors-container"),
								height: changeHeigth(),
								dataFormat: 'json',
								dataSource:temp.info
							}).render();
							hideMask();
						});
		            }
            
			}
		}
	});
}


function getYear(){
	var date = new Date();
	var year = date.getFullYear();
	var html = "";
	for(var i=year;i>year-16;i--){

			html += "<option value=" + i + ">" + i
					+ "</option>";
		}
	html += "<option value=-1>" + "其他"
	+ "</option>";
	$("#year").html(html);
	return
}

function getChart(){
	var id;
	$("input[name='checkList']:checked").each(function(i, o) {
		id= $(this).val();
	});
	if(id!="undefined"&&id!=undefined){

		getChartByProductorId(id);
	}
}

var width;
function changeWidth(id) {

	if($(window).width()<768){
		width=$("#"+id).width()*(9/10)
	}else{
		width=$("#"+id).width()*(2/3)
	}

	return width;
}
function changeHeigth() {


	return width*(3/4);
}

var searchProductor= function () {
	//finishProductorsRate
	//productionCycle
	var searchVal = $("#searchValue").val();

	oTable.ajax.url("../../../../"+ln_project+"/productionCycle?method=queryProductorsList&searchValue=" + searchVal).load();
}
var formatFormJson = function(formData) {
	var reg = /,$/gi;
	var data = "{";
	for (var i = 0; i < formData.length; i++) {
		if(formData[i].name == "countinfo"){
			data += "\"" + formData[i].name + "\" : " + formData[i].value + ",";
		}else{
			data += "\"" + formData[i].name + "\" : \"" + formData[i].value + "\",";
		}
	}
	data = data.replace(reg, "");
	data += "}";
	return data;
}
var v;
$.fn.editable = function(config)
{

    $(this).each(function(i,t){

        $(t).change(function(){
            var me=$(this);
            me.find('.customval').remove();
            if(-1 == me.val())
            {
                var ed = $("<input type=\"text\" class=\"form-control\" />");
                me.after(ed).hide();
                ed.blur(function(){
                    v=ed.val();
                    if(null === v ||  v.length ==0){
                        ed.remove();me.val(null).show();
                    }else{
                    	getChart();
                        me.append("<option value=\""+v+"\" class=\"customval\" selected>"+v+"</option>").show();
                        ed.remove();
                    }
                }).focus();
            }
        })
    });
}

$(document).ready(function (e) {
	$("#year").editable(e);
	});


function showMask(){
    $("#mask").css("height",$(document).height());
    $("#mask").css("width",$(document).width());
    $("#mask").show();
  }
  //隐藏遮罩层
  function hideMask(){

    $("#mask").hide();
  }