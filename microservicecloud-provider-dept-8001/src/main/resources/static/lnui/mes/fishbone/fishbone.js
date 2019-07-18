

$(function() {

	com.leanway.initSelect2("#productorname","../../../../"+ln_project+"/productors?method=queryProductorBySearchName", "搜索物料编码");
    com.leanway.initSelect2("#productionsearchno","../../../"+ln_project+"/workorderbarcodeprint?method=queryDispatchOrder", "搜索生产子查询号");

});

// 初始化树
var setting = {

    view : {
        dblClickExpand : false
    },

    callback : {
    // onRightClick : OnRightClick
    }
};
function getFontCss(treeId, treeNode) {
    return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
}
function onClick() {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    console.info(zTree.getSelectedNodes()[0]);
    if(zTree.getSelectedNodes()[0].productorname){
        getFishBone(zTree.getSelectedNodes()[0].productorname);
    }
}
var initTree = function() {
    getBomTreeList();
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
}

/**
 * 加载树
 * @param productorname
 */
function getBomTreeList(productorname) {
    var productorname = $("#productorname").val();
    //checkSession();
    $.fn.zTree.init($("#treeDemo"), {
        async : {
            enable : true,
            url : "../../../../"+ln_project+"/bom?method=queryTreeByProductorName&productorname="+productorname,
            autoParam : [ "levels"]
        },
        view : {
            dblClickExpand : false,
            fontCss:getFontCss
        },
        data : {
            key : {
                id : "bomid",
                name : "productordesc"
            },
            simpleData : {
                enable : true,
                idKey : "bomid",
                pIdKey : "pid",
                rootPId : ""
            }
        },
        callback : {
            // onRightClick : OnRightClick,
            onClick : onClick
        }
    });
}

/**
 * 结构图
 * @param productorname
 */
function getFishBone(productorname,type){
    showMask("mask");
    if(productorname=="undefined"||productorname==undefined){
        productorname = $("#productorname").val();
    }
    var productionsearchno = $("#productionsearchno").val();

    $.ajax ( {
        type : "get",
        url : "../../../../"+ln_project+"/bom",
        data : {

            "method" : "queryFishBone",
            productorname : productorname,
            productionsearchno:productionsearchno,
            type:type
        },
        dataType : "text",
        success : function ( data ) {

            var flag =  com.leanway.checkLogind(data);

            if(flag){

                var temp = $.parseJSON(data);
                if(temp.status=="success"){
                    var y=(temp.info.maxXY.y)*60;
                    if(y<200){
                        y=(temp.info.maxXY.y)*100;
                    }
                    var x = temp.info.maxXY.x;
                    if(x<15){
                        x = temp.info.maxXY.x*80;
                    }else{
                        x = temp.info.maxXY.x*60;
                    }
                    FusionCharts.ready(function () {

                        var constructionPlan = new FusionCharts({
                            type: 'dragnode',
                            renderAt: 'chart-container',
                            width: x,
                            height: y,
                            dataFormat: 'json',
                            dataSource:temp.info.fishBone
                        }).render();
                        hideMask("mask");
                    });
                }else{
                    hideMask("mask");
                    lwalert("tipModal", 1, temp.info);
                }

                }
        }
    });

}

/**
 * 结构图
 * @param productorname
 */
function getKeyFishBone(productorname){

    showMask("mask");
    if(productorname=="undefined"||productorname==undefined){
        productorname = $("#productorname").val();
    }
    var productionsearchno = $("#productionsearchno").val();

    $.ajax ( {
        type : "get",
        url : "../../../../"+ln_project+"/bom",
        data : {

            "method" : "queryKeyFishBone",
            productorname : productorname,
            productionsearchno:productionsearchno,
        },
        dataType : "text",
        success : function ( data ) {
            var flag =  com.leanway.checkLogind(data);

            if(flag){

                var temp = $.parseJSON(data);

                if(temp.status=="success"){
                    if(temp.info.keypath.totalweight==0){
                        hideMask("mask");
                        lwalert("tipModal", 1, "关键路径的长度为0，请修改工艺路线运行时间、批量数以及产品批次数量，重新获取关键路径");
                    }else{
                        var y=(temp.info.maxXY.y)*60;
                        if(y<200){
                            y=(temp.info.maxXY.y)*100;
                        }

                        var x = temp.info.maxXY.x;
                        if(x<15){
                            x = temp.info.maxXY.x*80;
                        }else{
                            x = temp.info.maxXY.x*45;
                        }
                        hideMask("mask");
                        FusionCharts.ready(function () {

                            var constructionPlan = new FusionCharts({
                                type: 'dragnode',
                                renderAt: 'chart-container',
                                width: x,
                                height: y,
                                dataFormat: 'json',
                                dataSource:temp.info.fishBone
                            }).render();
                            hideMask("mask");
                        });
                    }
                }else{
                    hideMask("mask");
                    lwalert("tipModal", 1, temp.info);
                }

                }
        }
    });

}


/**
 * 对比图
 * @param productorname
 */
function getCompareDiagram(type){
    showMask("mask");

    var productorname = $("#productorname").val();

    var productionsearchno = $("#productionsearchno").val();

    $.ajax ( {
        type : "get",
        url : "../../../../"+ln_project+"/bom",
        data : {

            "method" : "queryCompareDiagram",
            productorname : productorname,
            productionsearchno:productionsearchno,
            type:type
        },
        dataType : "text",
        success : function ( data ) {

            var flag =  com.leanway.checkLogind(data);

            if(flag){

                var temp = $.parseJSON(data);
                if(temp.status=="success"){
                    FusionCharts.ready(function () {

                        var smoPlan = new FusionCharts({
                            type: 'gantt',
                            renderAt: 'chart-container',
                            width: window.innerWidth*0.85,
                            height: window.innerHeight*0.7,
                            dataFormat: 'json',
                            dataSource:temp.info
                        }).render();
                        hideMask("mask");
                    });
                }else{
                    hideMask("mask");
                    lwalert("tipModal", 1, temp.info);
                }

                }
        }
    });

}

/**
 * 获取生产查询号
 */
function getSearchno(){
    var productorname = $("#productorname").val();
    $.ajax ( {
        type : "get",
        url : "../../../../"+ln_project+"/bom",
        data : {

            "method" : "querySearchNoByProductorname",
            productorname : productorname,
        },
        dataType : "text",
        async : false,
        success : function ( data ) {

            var flag =  com.leanway.checkLogind(data);

            if(flag){

                var temp = $.parseJSON(data);
                var html="";
                for(var i=0;i<temp.length;i++){
                    html+='<option value="'+temp[i]+'">'+temp[i]+'</option>'
                }
                $("#productionsearchno").html(html);
                }
        }
    });
}