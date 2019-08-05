<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
</head>
    <!--框架必需start-->
    <script src="/statics/scripts/jquery/jquery-1.10.2.min.js"></script>
    <link href="/statics/styles/font-awesome.min.css" rel="stylesheet" />
    <link href="/statics/scripts/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet" />
    <script src="/statics/scripts/plugins/jquery-ui/jquery-ui.min.js"></script>
    <!--框架必需end-->
    <!--bootstrap组件start-->
    <link href="/statics/scripts/bootstrap/bootstrap.min.css" rel="stylesheet" />
    <script src="/statics/scripts/bootstrap/bootstrap.min.js"></script>
    <link href="/statics/scripts/bootstrap/bootstrap-toggle.min.css" rel="stylesheet" />
    <script src="/statics/scripts/bootstrap/bootstrap-toggle.min.js"></script>
    <!--bootstrap组件end-->
    <script src="/statics/scripts/utils/base/tencheer.base.js?v=20190320"></script>
    <script src="/statics/scripts/utils/base/tencheer.base.plugin.js"></script>
    <script src="/statics/scripts/utils/base/tencheer.old.js"></script>

<style>
    tr{cursor: pointer;}
</style>
<script>
   // var columnHtml = request('columnHtml');   
    $(document).ready(function(){
            //console.log(columnHtml);
            var $parentobj =top.frames[tencheer.tabiframeId()];
            var data=$parentobj.columnJson;
            $.each(data, function (i) {
                var row = data[i];
                //console.log(row.Column_Label);
                $("#columnList tbody tr:eq("+i+")").find('td').eq(0).html(row.Column_Label);
                if (row.IsShow=='1')
                {
                  $("#columnList tbody tr:eq("+i+")").find('td').eq(1).find('input[type=checkbox]').bootstrapToggle('on');
                }
                else
                {
                    $("#columnList tbody tr:eq("+i+")").find('td').eq(1).find('input[type=checkbox]').bootstrapToggle('off');
                }
                $("#columnList tbody tr:eq("+i+")").css("display", "");
            });
        var fixHelperModified = function(e, tr) {
                    var $originals = tr.children();
                    var $helper = tr.clone();
                    $helper.children().each(function(index) {
                        $(this).width($originals.eq(index).width())
                    });
                    return $helper;
                },
                updateIndex = function(e, ui) {
                    $('td.index', ui.item.parent()).each(function (i) {
                        $(this).html(i + 1);
                    });
                };
        $("#columnList tbody").sortable({
            axis:'y',
            helper: fixHelperModified,
            stop: updateIndex
        }).disableSelection();
    });
    function AcceptClick() {
        var visibleList=new Array();
        var novisibleList=new Array();
        $("#columnList tr").each(function(){
                var colname=$(this).find('td').eq(0).text();
                var isvisible=$(this).find('td').eq(1).find('input[type=checkbox]').prop('checked');
                if (isvisible)
                {
                    visibleList.push(colname);
                }
                else
                {
                   novisibleList.push(colname);
                }
            });
            $.SaveForm({
                    url: "/system_manage/authorize_manage/SaveUserColumn",
                    param: { "moduleid":"999","visible": visibleList, "novisible":novisibleList },
                    close:false,
                    loading: "正在保存数据...",
                    success: function (data) {
                       var $parentobj =top.frames[tencheer.tabiframeId()];
                       $parentobj.CreateGrid();
                       tencheer.dialogClose();
                    }
                });
     }
</script>
<body>
    <div id="gridTable">
    <table id="columnList" class="table table-responsive  table-condensed">
    <tbody>
        <tr style="display: none">
            <td>0</td>
            <td style="text-align:right"><input type="checkbox" data-toggle="toggle"  data-size="mini" data-onstyle="success"></td>
        </tr>
        <tr style="display: none">
            <td>1</td>
            <td style="text-align:right"><input type="checkbox" data-toggle="toggle" checked data-size="mini" data-onstyle="success"></td>
        </tr>
        <tr style="display: none">
            <td>2</td>
            <td style="text-align:right"><input type="checkbox" data-toggle="toggle" checked data-size="mini" data-onstyle="success"></td>
        </tr>
        <tr style="display: none">
            <td>3</td>
            <td style="text-align:right"><input type="checkbox" data-toggle="toggle" checked data-size="mini" data-onstyle="success"></td>
        </tr>
        <tr style="display: none">
            <td>4</td>
            <td style="text-align:right"><input type="checkbox" data-toggle="toggle" checked data-size="mini" data-onstyle="success"></td>
        </tr>
        <tr style="display: none">
            <td>5</td>
            <td style="text-align:right"><input type="checkbox" data-toggle="toggle" checked data-size="mini" data-onstyle="success"></td>
        </tr>
        <tr style="display: none">
            <td>6</td>
            <td style="text-align:right"><input type="checkbox" data-toggle="toggle" checked data-size="mini" data-onstyle="success"></td>
        </tr>
        <tr style="display: none">
            <td>7</td>
            <td style="text-align:right"><input type="checkbox" data-toggle="toggle" checked data-size="mini" data-onstyle="success"></td>
        </tr>
        <tr style="display: none">
            <td>8</td>
            <td style="text-align:right"><input type="checkbox" data-toggle="toggle" checked data-size="mini" data-onstyle="success"></td>
        </tr>
        <tr style="display: none">
            <td>9</td>
            <td style="text-align:right"><input type="checkbox" data-toggle="toggle" checked data-size="mini" data-onstyle="success"></td>
        </tr>
        <tr style="display: none">
            <td>10</td>
            <td style="text-align:right"><input type="checkbox" data-toggle="toggle" checked data-size="mini" data-onstyle="success"></td>
        </tr>
        <tr style="display: none">
            <td>11</td>
            <td style="text-align:right"><input type="checkbox" data-toggle="toggle" checked data-size="mini" data-onstyle="success"></td>
        </tr>
        <tr style="display: none">
            <td>12</td>
            <td style="text-align:right"><input type="checkbox" data-toggle="toggle" checked data-size="mini" data-onstyle="success"></td>
        </tr>
        <tr style="display: none">
            <td>13</td>
            <td style="text-align:right"><input type="checkbox" data-toggle="toggle" checked data-size="mini" data-onstyle="success"></td>
        </tr>
        <tr style="display: none">
            <td>14</td>
            <td style="text-align:right"><input type="checkbox" data-toggle="toggle" checked data-size="mini" data-onstyle="success"></td>
        </tr>
        <tr style="display: none">
            <td>15</td>
            <td style="text-align:right"><input type="checkbox" data-toggle="toggle" checked data-size="mini" data-onstyle="success"></td>
        </tr>
        <tr style="display: none">
            <td>16</td>
            <td style="text-align:right"><input type="checkbox" data-toggle="toggle" checked data-size="mini" data-onstyle="success"></td>
        </tr>
        <tr style="display: none">
            <td>17</td>
            <td style="text-align:right"><input type="checkbox" data-toggle="toggle" checked data-size="mini" data-onstyle="success"></td>
        </tr>
        <tr style="display: none">
            <td>18</td>
            <td style="text-align:right"><input type="checkbox" data-toggle="toggle" checked data-size="mini" data-onstyle="success"></td>
        </tr>
        <tr style="display: none">
            <td>19</td>
            <td style="text-align:right"><input type="checkbox" data-toggle="toggle" checked data-size="mini" data-onstyle="success"></td>
        </tr>
        <tr style="display: none">
            <td>20</td>
            <td style="text-align:right"><input type="checkbox" data-toggle="toggle" checked data-size="mini" data-onstyle="success"></td>
        </tr>
    </tbody>
</table>
    </div>
</body>
</html>

<script>
    $(function () {
        tencheer.childInit();
    })
    
</script>