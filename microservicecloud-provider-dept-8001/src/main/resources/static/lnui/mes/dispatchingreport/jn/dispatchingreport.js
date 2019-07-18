$(function() {
	$('#tt')
			.treegrid(
					{
						url : '../../../../jnmes/productionGroupReport?method=queryJnTreeGradeReportWsInterface',
						method : 'get',
						checkbox : true,
						rownumbers : true,
						animate : true,
						collapsible : true,
						fitColumns : true,
						idField : 'id',
						treeField : 'parent',
						columns : [ [ {
							title : '&nbsp;',
							field : 'parent',
							width : 80
						}, {
							title : '客户名称',
							field : 'companioname',
							align : 'center',
							width : 160
						}, {
							title : '合同号',
							field : 'contractnumber',
							align : 'center',
							width : 140
						}, {
							title : '产品名称',
							field : 'productordesc',
							align : 'center',
							width : 140
						}, {
							title : '生产进度',
							field : 'listProcessJson',
							width : 510
						}, {
							title : '投产日期',
							field : 'practicalstarttime',
							align : 'center',
							width : 100
						}, {
							title : '预计完工日期',
							field : 'adjustendtime',
							align : 'center',
							width : 100
						} ] ]
					});
})
function doSearch(value, name) {
	alert(name);
}
var editingId;
function appandNode() {
	if (editingId != undefined) {
		$('#tt').treegrid('select', editingId);
		return;
	}
	var row = $('#tt').treegrid('getSelected');
	if (row) {
		editingId = row.id
		alert(row.id + "展开");
		// $('#tt').treegrid('beginEdit', editingId);
	}
}