<!DOCTYPE html>

<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Form</title>
    <!--框架必需start-->
    <script src="/statics/scripts/jquery/jquery-1.10.2.min.js"></script>
    <link href="/statics/styles/font-awesome.min.css" rel="stylesheet" />
    <link href="/statics/scripts/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet" />
    <script src="/statics/scripts/plugins/jquery-ui/jquery-ui.min.js"></script>
    <!--框架必需end-->
    <!--bootstrap组件start-->
    <link href="/statics/scripts/bootstrap/bootstrap.min.css" rel="stylesheet" />
    <link href="/statics/scripts/bootstrap/bootstrap.extension.css" rel="stylesheet" />
    <script src="/statics/scripts/bootstrap/bootstrap.min.js"></script>
    <!--bootstrap组件end-->

    <script src="/statics/scripts/plugins/datepicker/WdatePicker.js"></script>
    <link href="/statics/scripts/plugins/tree/tree.css" rel="stylesheet"/>
    <link href="/statics/scripts/plugins/datetime/pikaday.css" rel="stylesheet"/>
    <link href="/statics/scripts/plugins/wizard/wizard.css" rel="stylesheet"/>
    <link href="/statics/styles/tencheer-ui.css" rel="stylesheet"/>

    <script src="/statics/scripts/utils/base/tencheer.base.js?v=20190320"></script>
    <script src="/statics/scripts/utils/base/tencheer.base.plugin.js"></script>
    <script src="/statics/scripts/utils/base/tencheer.old.js"></script>
    <script src="/statics/scripts/utils/base/tencheer.base.extensions.js"></script>
    <script src="/statics/scripts/plugins/tree/tree.js"></script>
    <script src="/statics/scripts/plugins/validator/validator.js"></script>
    <script src="/statics/scripts/plugins/wizard/wizard.js"></script>
    <script src="/statics/scripts/plugins/datetime/pikaday.js"></script>
    <script src="/statics/scripts/plugins/jqgrid/grid.locale-cn.js"></script>
    <script src="/statics/scripts/plugins/jqgrid/jqgrid.full.js"></script>
    
</head>

<body>
<form id="form1">
    <script type="text/javascript">
        var keyValue = request('keyValue');
        var menu_id = tencheer.request('menu_id');
        var menu_name = tencheer.request('menu_name');
        $(function () {
            initControl();
        })
        //初始化控件
        function initControl() {
            //上级
            $("#menu_id").ComboBoxTree({
                url: "/system_manage/menu_manage/getAllMenuTreeJson",
                description: "==请选择==",
                height: "195px",
                allowSearch: true
            });
            //排序字段
             $("#sort_column").ComboBox({
                url: "/system_manage/grid_column_manage/GetColumnDropdownList?grid_id="+keyValue,
                id: "column_code",
                text: "column_name",
                description: "==请选择字段==",
                height: "200px",
                allowSearch: true
            });
            //获取表单
            if (!!keyValue) {
                $.SetForm({
                    url: "/system_manage/grid_column_manage/GetGridFormJson",
                    param: { keyValue: keyValue },
                    success: function (data) {
                        $("#form1").SetWebControls(data);
                    }
                });
            }
            else
            {
                if (!!menu_id){
                    $("#menu_id").attr("data-value",menu_id);
                    $("#menu_id").find(".ui-select-text").html(menu_name);
                }
            }
            
            $('input,textarea,select').keyup(function(e){
                if (e.keyCode == 13) {
                    var nextElement = $('[tabindex="' + (this.tabIndex + 1) + '"]');
                    if (nextElement.length){
                        nextElement.focus();
                    }
                    else
                    {
                        $('[tabindex="1"]').focus();
                    }
                
                }

            });
        }
        //保存表单
    function AcceptClick() {
        if (!$('#form1').Validform()) {
            return false;
        }
        
        var postData = $("#form1").GetWebControls(keyValue);
        if (postData["menu_id"] == "") {
                return false;
            }
        $.SaveForm({
            url: "/system_manage/grid_column_manage/SaveGridForm?keyValue=" + keyValue,
            param: postData,
            loading: "正在保存数据...",
            success: function () {
                $.currentIframe().$("#gridTable").resetSelection();
                $.currentIframe().$("#gridTable").trigger("reloadGrid");
            }
        })
    }
    </script>
    <div style="margin-top: 10px; margin-right: 30px;">
        <input id="grid_id" type="hidden" value="add" />
        <table class="form">
            <tr>
                <th class="formTitle">上级菜单<font face="宋体">*</font></th>
                <td class="formValue">
                     <div id="menu_id" type="selectTree" class="ui-select" >
                      </div>
                </td>
<!--            </tr> 
            <tr>-->
                <th class="formTitle">编码<font face="宋体">*</font></th>
                <td class="formValue">
                    <input id="grid_code" type="text" class="form-control" placeholder="请输入编码" onblur="$.ExistField(this.id, '/system_manage/grid_column_manage/ExistGridCode')" tabindex="2" isvalid="yes" checkexpession="NotNull" />
                </td>
            </tr> 
            <tr>
                <th class="formTitle">名称<font face="宋体">*</font></th>
                <td class="formValue">
                    <input id="grid_name" type="text" class="form-control" placeholder="请输入名称" tabindex="2" isvalid="yes" checkexpession="NotNull" />
                </td>
<!--            </tr> 
            <tr>-->
                <th class="formTitle">显示勾选框<font face="宋体">*</font></th>
                <td class="formValue">
                    <select id="grid_select" class="form-control input-sm"  tabindex="4"  style="width: 100%;text-align: right" >
                        <option value="0">否</option>
                        <option value="1">是</option>
                  </select> 
                </td>
            </tr>
            <tr>
                <th class="formTitle">显示行号<font face="宋体">*</font></th>
                <td class="formValue">
                    <select id="grid_row_no" class="form-control input-sm"  tabindex="4"  style="width: 100%;text-align: right" >
                        <option value="1">是</option>
                        <option value="0">否</option>
                  </select> 
                </td>
<!--            </tr>
            <tr>-->
                <th class="formTitle">显示分页<font face="宋体">*</font></th>
                <td class="formValue">
                    <select id="grid_page" class="form-control input-sm"  tabindex="4"  style="width: 100%;text-align: right" >
                        <option value="0">否</option>
                        <option value="1">是</option>
                  </select> 
                </td>
            </tr>
            <tr>
                <th class="formTitle">显示过滤<font face="宋体">*</font></th>
                <td class="formValue">
                    <select id="grid_filter" class="form-control input-sm"  tabindex="4"  style="width: 100%;text-align: right" >
                        <option value="0">否</option>
                        <option value="1">是</option>
                  </select> 
                </td>
<!--            </tr>
            <tr>-->
                <th class="formTitle">显示汇总<font face="宋体">*</font></th>
                <td class="formValue">
                    <select id="grid_summary" class="form-control input-sm"  tabindex="4"  style="width: 100%;text-align: right" >
                        <option value="0">否</option>
                        <option value="1">是</option>
                  </select> 
                </td>
            </tr>
            <tr>
                <th class="formTitle">可否编辑<font face="宋体">*</font></th>
                <td class="formValue">
                    <select id="grid_edit" class="form-control input-sm"  tabindex="4"  style="width: 100%;text-align: right" >
                        <option value="0">否</option>
                        <option value="1">是</option>
                  </select> 
                </td>
<!--            </tr>
            <tr>-->
                <th class="formTitle">每页记录数<font face="宋体">*</font></th>
                <td class="formValue">
                    <input id="grid_rownum" type="text" class="form-control" placeholder="每页记录数" value="30"/>
                </td>
            </tr>

            <tr>
                <th class="formTitle">表格宽度</th>
                <td class="formValue">
                     <input id="grid_width" type="text" class="form-control" placeholder="请输入表格宽度" tabindex="2"  />
                </td>
<!--            </tr>
            <tr>-->
                <th class="formTitle">表格高度</th>
                <td class="formValue">
                     <input id="grid_height" type="text" class="form-control" placeholder="请输入表格高度" tabindex="2"  />
                </td>
            </tr>
            <tr>
                <th class="formTitle">包含子列表</th>
                <td class="formValue">
                    <select id="sub_grid" class="form-control input-sm"  tabindex="4"  style="width: 100%;text-align: right" >
                        <option value="否">否</option>
                        <option value="是">是</option>
                  </select> 
                </td>
<!--            </tr>
            <tr>-->
                <th class="formTitle">自动宽度</th>
                <td class="formValue">
                    <select id="grid_edit" class="form-control input-sm"  tabindex="4"  style="width: 100%;text-align: right" >
                        <option value="1">是</option>
                        <option value="0">否</option>
                  </select> 
                </td>
            </tr>
                        <tr>
                <th class="formTitle">排序字段<font face="宋体">*</font></th>
                <td class="formValue">
                    <div id="sort_column" type="select" class="ui-select"></div>
                    <!--<input id="sort_column" type="text" class="form-control" placeholder="排序字段" value="create_date" />-->
                </td>
<!--            </tr>
            <tr>-->
                <th class="formTitle">排序方式</th>
                <td class="formValue">
                    <select id="sort_type" class="form-control input-sm"  tabindex="4"  style="width: 100%;text-align: right" >
                        <option value="asc">升序</option>
                        <option value="desc">降序</option>
                  </select> 
                </td>
            </tr>
            <tr>
                <th class="formTitle">数据库表</th>
                <td class="formValue">
                    <input id="table_name" type="text" class="form-control" placeholder="请输入数据库表" />
                </td>
<!--            </tr> 
            <tr>-->
                <th class="formTitle">分页栏标识号</th>
                <td class="formValue">
                     <input id="grid_pager_id" type="text" class="form-control" placeholder="请输入分页栏标识号" />
                    
                </td>
            </tr> 
            <tr>
                <th class="formTitle">数据地址</th>
                <td class="formValue" colspan="3">
                   <input id="data_url" type="text" class="form-control" placeholder="请输入数据地址" />
                </td>
            </tr> 
            <tr>
                <th class="formTitle">参数配置</th>
                <td class="formValue" colspan="3">
                   <input id="remark" type="text" class="form-control" placeholder="请输入相关参数配置" />
                </td>
            </tr> 
        </table>
    </div>
</form>
</body>
</html>
<script>
    (function ($, tencheer) {
        $(function () {
            tencheer.childInit();
        })
    })(window.jQuery, window.tencheer)
</script>
