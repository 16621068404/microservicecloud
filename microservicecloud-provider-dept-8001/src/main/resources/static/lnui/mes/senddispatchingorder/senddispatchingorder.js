$(function() {
    // 初始化对象
    com.leanway.loadTags();
    // 全选
    // com.leanway.dataTableCheckAll("generalInfo", "checkAll", "checkList");
    com.leanway.initTimePickYmdForMoreId("#starttime");
})
$(function() {
    initBootstrapValidator();
})
function initBootstrapValidator() {
    $('#sendDispatchingOrderForm').bootstrapValidator(
            {
                excluded : [ ':disabled' ],
                fields : {
                    days : {
                        validators : {
                            notEmpty : {},
                            integer: {
                                message: '请填写整数'
                            }
                        }
                    },
                }
            });
}
/**
 * MAP对象，实现MAP功能
 *
 * 接口：<br>
 * size() 获取MAP元素个数<br>
 * isEmpty() 判断MAP是否为空<br>
 * clear() 删除MAP所有元素<br>
 * put(key, value) 向MAP中增加元素（key, value)<br>
 * remove(key) 删除指定KEY的元素，成功返回True，失败返回False<br>
 * get(key) 获取指定KEY的元素值VALUE，失败返回NULL<br>
 * element(index) 获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL<br>
 * containsKey(key) 判断MAP中是否含有指定KEY的元素<br>
 * containsValue(value) 判断MAP中是否含有指定VALUE的元素<br>
 * values() 获取MAP中所有VALUE的数组（ARRAY）<br>
 * keys() 获取MAP中所有KEY的数组（ARRAY）<br>
 *
 * 例子：<br>
 * var map = new Map();<br>
 * map.put("key", "value"); var val = map.get("key") ……
 */
function Map() {
    this.elements = new Array();

    // 获取MAP元素个数
    this.size = function() {
        return this.elements.length;
    }

    // 判断MAP是否为空
    this.isEmpty = function() {
        return (this.elements.length < 1);
    }

    // 删除MAP所有元素
    this.clear = function() {
        this.elements = new Array();
    }

    // 向MAP中增加元素（key, value)
    this.put = function(_key, _value) {
        this.elements.push({
            key : _key,
            value : _value
        });
    }

    // 删除指定KEY的元素，成功返回True，失败返回False
    this.remove = function(_key) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    this.elements.splice(i, 1);
                    return true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    }

    // 获取指定KEY的元素值VALUE，失败返回NULL
    this.get = function(_key) {
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    return this.elements[i].value;
                }
            }
        } catch (e) {
            return null;
        }
    }

    // 获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
    this.element = function(_index) {
        if (_index < 0 || _index >= this.elements.length) {
            return null;
        }
        return this.elements[_index];
    }

    // 判断MAP中是否含有指定KEY的元素
    this.containsKey = function(_key) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    bln = true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    }

    // 判断MAP中是否含有指定VALUE的元素
    this.containsValue = function(_value) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].value == _value) {
                    bln = true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    }

    // 获取MAP中所有VALUE的数组（ARRAY）
    this.values = function() {
        var arr = new Array();
        for (i = 0; i < this.elements.length; i++) {
            arr.push(this.elements[i].value);
        }
        return arr;
    }

    // 获取MAP中所有KEY的数组（ARRAY）
    this.keys = function() {
        var arr = new Array();
        for (i = 0; i < this.elements.length; i++) {
            arr.push(this.elements[i].key);
        }
        return arr;
    }

}

//function searchResust() {
//    showMask();
//    var starttime = $("#starttime").val();
//    var days = $("#days").val();
//    $("#sendDispatchingOrderForm").data('bootstrapValidator').validate(); // 提交前先验证
//    if ($('#sendDispatchingOrderForm').data('bootstrapValidator').isValid()) {//
//    if (starttime != "") {
//        $.ajax({
//            type : "get",
//            url : "../../sendDispatchingOrder?method=queryDispatchingOrderList",
//            data : {
//                "starttime" : starttime,
//                "days" : days
//            },
//            dataType : "json",
//            success : function(text) {
//
//    			var flag =  com.leanway.checkLogind(text);
//
//    			if(flag){
//    			        hideMask();
//		                var dateMap = new Map();
//		                for ( var i in text) {
//		                    if (dateMap.containsKey(text[i].adjuststarttime)) {
//		                        var count = dateMap.get(text[i].adjuststarttime);
//		                        dateMap.remove(text[i].adjuststarttime);
//		                        dateMap.put(text[i].adjuststarttime, count + 1);
//		                    } else {
//		                        dateMap.put(text[i].adjuststarttime, 1);
//		                    }
//		                }
//		                var tableBodyHtml = "";
//		                tableBodyHtml += " <tr>";
//		                tableBodyHtml += " <td>日期</td>";
//		                tableBodyHtml += " <td>工作中心台账</td>";
//		                tableBodyHtml += " <td>派工单号</td>";
//		                tableBodyHtml += " <td>生产子查询号</td>";
//		                tableBodyHtml += " <td>虚拟件图号</td>";
//		                tableBodyHtml += " <td width='160px'>虚拟件</td>";
//		                tableBodyHtml += " <td>虚拟件数量</td>";
//		                tableBodyHtml += " <td width='160px'>原材料</td>";
//		                tableBodyHtml += " <td>原材料数量</td>";
//		                tableBodyHtml += " </tr>";
//		                for ( var i in text) {
//		                    tableBodyHtml += " <tr>";
//		                    if (dateMap.containsKey(text[i].adjuststarttime)) {
//		                        var tdStr = "  <td rowspan='" + dateMap.get(text[i].adjuststarttime) + "'>"
//		                                + text[i].adjuststarttime + "</td>";
//		                        dateMap.remove(text[i].adjuststarttime);
//		                        tableBodyHtml += tdStr;
//		                    }
//		                    tableBodyHtml += "  <td>" + text[i].equipmentname + "</td>";
//		                    tableBodyHtml += "  <td>" + text[i].dispatchingnumber + "</td>";
//		                    tableBodyHtml += "  <td>" + text[i].productionchildsearchno + "</td>";
//		                    tableBodyHtml += "  <td>" + text[i].productorname + "</td>";
//		                    tableBodyHtml += "  <td>" + text[i].productordesc + "</td>";
//		                    tableBodyHtml += "  <td>" + text[i].count + "</td>";
//		                    tableBodyHtml += "  <td>" + text[i].meterial + "</td>";
//		                    tableBodyHtml += "  <td>" + text[i].meterialcount + "</td>";
//		                    tableBodyHtml += " </tr>";
//
//		                }
//		                $("#tableBody").html(tableBodyHtml);
//		            }
//          }
//        });
//    } else {
//        lwalert("tipModal", 1, "请填写查询起始日");
//    }
//    }
//    // MergeDateCells(tableid);
//}
var datable;
var searchResust = function(){
    datable=initTable();
    datable.destroy();//清空数据表
    datable = initTable();
}
//var initTable = function () {
//    var starttime = $("#starttime").val();
//    var days = $("#days").val();
//    $("#sendDispatchingOrderForm").data('bootstrapValidator').validate(); // 提交前先验证
//    if ($('#sendDispatchingOrderForm').data('bootstrapValidator').isValid()) {//
//        if (starttime != "") {
//            var table = $('#tableid').DataTable( {
//                    "ajax": "../../../../"+ln_project+"/sendDispatchingOrder?method=queryDispatchingOrderList&starttime="+starttime+"&days="+days,
//                    'bPaginate': false,
//                    "bDestory": true,
//                    "bRetrieve": true,
//                    "bFilter":false,
//                    "scrollY":"350px",
//                    "bSort": false,
//                    "bProcessing": true,
//                    "bServerSide": true,
//                    'searchDelay':"5000",
//                     "aoColumns": [
//                           {
//                               "mDataProp": "orderid",
//                               "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
//                                   $(nTd).html("<div id='stopPropagation" + iRow +"'>"
//                                           +"<input class='regular-checkbox' type='checkbox' id='" + sData
//                                           + "' name='checkList' value='" + sData
//                                           + "'><label for='" + sData
//                                           + "'></label>");
//                                   com.leanway.columnTdBindSelect(nTd,"generalInfo","checkList");
//                               }
//                           },
//                           {"mDataProp": "adjuststarttime"},
//                           {"mDataProp": "equipmentname"},
//                           {"mDataProp": "dispatchingnumber"},
//                           {"mDataProp": "productionchildsearchno"},
//                           {"mDataProp": "productordesc"},
//                           {"mDataProp": "productorname"},
//                           {"mDataProp": "count"},
//                           {"mDataProp": "meterial"},
//                           {"mDataProp": "meterialcount"},
//                      ],
//
//                     "oLanguage" : {
//                         "sUrl" : "../../../jslib/datatables/zh-CN.txt"
//                     },
//                     "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
//                     "fnDrawCallback" : function(data) {
//
//                     }
//                } ).on('xhr.dt', function (e, settings, json) {
//                    com.leanway.checkLogind(json);
//                } );
//        }else {
//          lwalert("tipModal", 1, "请填写查询起始日");
//        }
//    }
//    return table;
//}
var initTable = function () {
    var starttime = $("#starttime").val();
    var days = $("#days").val();
    $("#sendDispatchingOrderForm").data('bootstrapValidator').validate(); // 提交前先验证
    if ($('#sendDispatchingOrderForm').data('bootstrapValidator').isValid()) {//
        if (starttime != "") {
            var table = $('#tableid').DataTable( {
                    "ajax": "../../../../"+ln_project+"/sendDispatchingOrder?method=queryMaterialList&starttime="+starttime+"&days="+days,
                    'bPaginate': false,
                    "bDestory": true,
                    "bRetrieve": true,
                    "bFilter":false,
                    "scrollY":"450px",
                    "bSort": false,
                    "bProcessing": true,
                    "bServerSide": true,
                    'searchDelay':"5000",
                     "aoColumns": [
                           {"mDataProp": "centername"},
                           {"mDataProp": "equipmentname"},
                           {"mDataProp": "material"},
                           {"mDataProp": "meterial"},
                           {"mDataProp": "meterialcount"},
                      ],

                     "oLanguage" : {
                         "sUrl" : "../../../jslib/datatables/zh-CN.txt"
                     },
                     "sDom": "<'row-fluid'<'span6 myBtnBox'><'span6'f>r>t<'row-fluid'<'span6'i><'span6 'p>>",
                     "fnDrawCallback" : function(data) {

                     }
                } ).on('xhr.dt', function (e, settings, json) {
                    com.leanway.checkLogind(json);
                } );
        }else {
          lwalert("tipModal", 1, "请填写查询起始日");
        }
    }
    return table;
}


//function updateResust() {
//
//    var starttime = $("#starttime").val();
//    var days = $("#days").val();
//    if (starttime != "" && days != "") {
//        $.ajax({
//            type : "post",
//            url : "../../sendDispatchingOrder?method=updateSendDispatchingOrder",
//            data : {
//                "starttime" : starttime,
//                "days" : days
//            },
//            dataType : "json",
//            async : false,
//            success : function(text) {
//
//    			var flag =  com.leanway.checkLogind(text);
//
//    			if(flag){
//
//                  lwalert("tipModal", 1, text.info);
//
//    			}
//            }
//        });
//    } else {
//        lwalert("tipModal", 1, "请填写合并下料天数和查询起始日");
//    }
//}
function updateResust() {
    var str = '';
    // 拼接选中的checkbox
    $("input[name='checkList']:checked").each(function(i, o) {
        str += $(this).val();
        str += ",";
    });
    var ids = str.substr(0, str.length - 1);
    if (ids.length>0) {
        $.ajax({
            type : "post",
            url : "../../../../"+ln_project+"/sendDispatchingOrder?method=updateSendDispatchingOrderList",
            data : {
                "ids" : ids,
            },
            dataType : "json",
            async : false,
            success : function(text) {

                var flag =  com.leanway.checkLogind(text);

                if(flag){
                  datable.ajax.reload();
                  lwalert("tipModal", 1, text.info);

                }
            }
        });
    } else {
        lwalert("tipModal", 1, "请选择要下发的派工单");
    }
}
/**
 * 日期相同合并单元格
 *
 * @param tab
 */
function MergeDateCells(tab) {
    // 从第二行开始，排除标题行
    var startRow = 1;
    // 循环记录表格中td的内容,用来判断td中的value是否发生了改变
    var tdTempV = "";
    // 如果td的值相同,那么变量加1, 否则将临时变量加入集合中
    var rowCount = 1;
    // 得到相同内容的行数的集合
    var totalcount = new Array();

    for (var i = 1; i < tab.rows.length; i++) {
        // 首先拿出来td的值
        var tdText = tab.rows[i].cells[0].innerText;
        // 如果是第一次走循环,直接continue;
        if (i == startRow) {
            tdTempV = tdText;
            continue;
        }
        // 如果当前拿出来的值和出处的值相同,那么将临时数量加1，否则添加到集合里面
        if (tdTempV == tdText) {
            rowCount++;
        } else {
            totalcount.push(rowCount);
            tdTempV = tdText;
            rowCount = 1;
        }

        // 判断是否是循环的最后一次,如果是最后一次那个直接将当前的数量存储到集合里面
        if (i == tab.rows.length - 1) {
            totalcount.push(rowCount);
        }
    }
    // 临时变量,再循环中判断是否和数组中的一项值相同
    var tNum = 0;
    // 注意这个循环是倒着来的
    for (var i = tab.rows.length - 1; i >= startRow; i--) {
        // 临时变量,存储td
        var tTd = tab.rows[i].cells[0];
        tNum++;
        // 如果发现tNum和数组中最后一个值相同,那么就可以断定相同的td已经结束[只是其中一个]
        if (tNum == totalcount[totalcount.length - 1]) {
            // 给当前td添加rowSpan属性
            tTd.setAttribute("rowSpan", totalcount[totalcount.length - 1]);
            // 将数组的最后一个元素弹出
            totalcount.pop();
            tNum = 0;
        } else {
            // 删除当前td
            tab.rows[i].removeChild(tTd);
        }
    }
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