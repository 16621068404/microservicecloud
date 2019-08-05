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
        var menu_id = request('menu_id');
        var grid_id = request('grid_id');
        $(function () {
            initControl();
            $('[tabindex="1"]').focus();
        })
        //初始化控件
        function initControl() {
            //获取表单
            if (!!keyValue) {
                $.SetForm({
                    url: "/system_manage/grid_column_manage/GetColumnFormJson",
                    param: { keyValue: keyValue },
                    success: function (data) {
                        $("#form1").SetWebControls(data);
                    }
                });
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
        function AcceptClick() {
            if (!$('#form1').Validform()) {
                return false;
            }
            var postData = $("#form1").GetWebControls(keyValue);
            postData["menu_id"]=menu_id;
            postData["grid_id"]=grid_id;
            $.SaveForm({
                url: "/system_manage/grid_column_manage/SaveColumnForm?keyValue=" + keyValue,
                param: postData,
                loading: "正在保存数据...",
                success: function () {
                    tencheer.getIframe("column_list").$("#gridcolumnTable").resetSelection();
                    tencheer.getIframe("column_list").$("#gridcolumnTable").trigger("reloadGrid");

                }
            })
        }
    </script>
    <div style="margin-top: 10px; margin-right: 30px;">
        <input id="column_id" type="hidden" value="add" />
        <table class="form">
            <tr>
                <th class="formTitle">编号<font face="宋体">*</font></th>
                <td class="formValue">
                    <input id="column_code" type="text" class="form-control" placeholder="请输入编号" tabindex="1" isvalid="yes" checkexpession="NotNull" />
                </td>
            </tr>
            <tr>
                <th class="formTitle">名称<font face="宋体">*</font></th>
                <td class="formValue">
                    <input id="column_name" type="text" class="form-control" placeholder="请输入名称" tabindex="2" isvalid="yes" checkexpession="NotNull" />
                </td>
            </tr>
            <tr>
                <th class="formTitle">字段类型<font face="宋体">*</font></th>
                <td class="formValue">
                    <select id="column_type" class="form-control input-sm"   tabindex="7" style="width: 100%;text-align: right" >
                        <option value="字符型">字符型</option>
                        <option value="数值型">数值型</option>
                        <option value="日期型">日期型</option>
                  </select> 
                    <!--<input id="column_width" type="text" class="form-control" placeholder="请输入字段类型" tabindex="4" isvalid="yes" checkexpession="Num" />-->
                </td>
            </tr>
            <tr>
                <th class="formTitle">对齐方向<font face="宋体">*</font></th>
                <td class="formValue">
                   <select id="column_align" class="form-control input-sm"   tabindex="6" style="width: 100%;text-align: right" >
                        <option value="center">居中</option>
                        <option value="left">靠左</option>
                        <option value="right">靠右</option>
                  </select> 
                </td>
            </tr>
             <tr>
                <th class="formTitle">显示宽度<font face="宋体">*</font></th>
                <td class="formValue">
                    <input id="column_width" type="text" value="80" class="form-control" placeholder="请输入显示宽度" tabindex="5" isvalid="yes" checkexpession="Num" />
                </td>
            </tr>
            <tr>
                <th class="formTitle">排序<font face="宋体">*</font></th>
                <td class="formValue">
                    <input id="sort_code" type="text" value="0" class="form-control" placeholder="请输入排序" tabindex="3" isvalid="yes" checkexpession="Num" />
                </td>
            </tr>            
            <tr>
                <th class="formTitle">是否显示<font face="宋体">*</font></th>
                <td class="formValue">
                    <select id="is_show" class="form-control input-sm"  tabindex="4"  style="width: 100%;text-align: right" >
                        <option value="1">是</option>
                        <option value="0">否</option>
                  </select> 
                    <!--<input id="is_show" type="text" class="form-control" placeholder="请输入是否显示" tabindex="3" isvalid="yes" checkexpession="Num" />-->
                </td>
            </tr>
            <tr>
                <th class="formTitle">是否主键</th>
                <td class="formValue">
                    <select id="primary_key" class="form-control input-sm"   tabindex="8" style="width: 100%;text-align: right" >
                        <option value="否">否</option>
                        <option value="是">是</option>
                  </select> 
                </td>
            </tr>
            <tr>
                <th class="formTitle">是否必输</th>
                <td class="formValue">
                    <select id="must_input" class="form-control input-sm"   tabindex="8" style="width: 100%;text-align: right" >
                        <option value="否">否</option>
                        <option value="是">是</option>
                    </select> 
                </td>
            </tr>
            <tr>
                <th class="formTitle">是否编辑</th>
                <td class="formValue">
                    <select id="column_edit" class="form-control input-sm"   tabindex="8" style="width: 100%;text-align: right" >
                        <option value="0">否</option>
                        <option value="1">是</option>
                    </select> 
                </td>
            </tr>

            <tr>
                <th class="formTitle">是否格式化</th>
                <td class="formValue">
                    <select id="column_formatter" class="form-control input-sm"   tabindex="8" style="width: 100%;text-align: right" >
                        <option value="否">否</option>
                        <option value="是">是</option>
                    </select> 
                </td>
            </tr>
            <tr>
                <th class="formTitle">显示样式</th>
                <td class="formValue">
                    <input id="column_style" type="text" class="form-control"  tabindex="9" />
                </td>
            </tr>  <tr>
                <th class="formTitle">改变事件</th>
                <td class="formValue">
                    <input id="onchange" type="text" class="form-control"  tabindex="9" />
                </td>
            </tr>  
            <tr>
                    <th class="formTitle">所占列数<font face="宋体">*</font></th>
                    <td class="formValue">
                        <select id="proportion" class="form-control input-sm" tabindex="4" style="width: 100%;text-align: right">
                            <option value="1">一列</option>
                            <option value="2">二列</option>
                            <option value="3">三列</option>
                            <option value="4">四列</option>
                            <option value="5">五列</option>
                        </select>
                    </td>
                </tr>
            <tr>
                <th class="formTitle" valign="top" style="padding-top: 4px;">备注
                </th>
                <td class="formValue">
                    <textarea id="remark" class="form-control" style="height: 70px;"></textarea>
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
