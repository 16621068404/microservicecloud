/*!
 * 版 本 TencheerADMS V6.1.2.0 (http://www.tencheer.cn)
 * Copyright 2011-2016 Tencheer, Inc.
 * 公共JS基础库
 * 腾之毅
 */
window.tencheer = {};


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var token;
var lenf;

(function ($, tencheer) {
    "use strict";
    
    //从cookie中读取token
    //从cookie中读取token
    token = getCookie("token")
    
    
    //基础方法
    $.extend(tencheer, {
        //初始化
        init: function (opt) {
            tencheer.theme.type = opt.themeType;
            tencheer.data.init(opt.callBack);
        },
        childInit: function (opt) {
            $('.toolbar').authorizeButton();
            tencheer.theme.setType();
            if (tencheer.excel != undefined)
            {
                tencheer.excel.init();
            }
            tencheer.ajaxLoading(false);
        },
        //皮肤主题
        theme: {
            type: "4",
            setType: function () {
                switch (top.tencheer.theme.type) {
                    case "1"://经典版
                        $('body').addClass('uiDefault');
                        break;
                    case "2"://风尚版
                        $('body').addClass('uiLTE');
                        break;
                    case "3"://炫动版
                        $('body').addClass('uiWindows');
                        break;
                    case "4"://飞扬版
                        $('body').addClass('uiPretty');
                        break;
                }
            }
        },
        //加载提示
        loading: function (ops) {//加载动画显示与否
            var ajaxbg = top.$("#loading_background,#loading_manage");
            if (ops.isShow) {
                ajaxbg.show();
            } else {
                if (top.$("#loading_manage").attr('istableloading') == undefined) {
                    ajaxbg.hide();
                    top.$(".ajax-loader").remove();
                }
            }
            if (!!ops.text) {
                top.$("#loading_manage").html(ops.text);
            } else {
                top.$("#loading_manage").html("正在拼了命为您加载…");
            }
            top.$("#loading_manage").css("left", (top.$('body').width() - top.$("#loading_manage").width()) / 2 - 54);
            top.$("#loading_manage").css("top", (top.$('body').height() - top.$("#loading_manage").height()) / 2);
        },
        ajaxLoading: function (isShow) {
            var $obj = $('#ajaxLoader');
            if (isShow) {
                $obj.show();
            }
            else {
                $obj.fadeOut();
            }
        },
        //获取窗口Id
        tabiframeId: function () {//tab窗口Id
            return top.$(".TENCHEER_iframe:visible").attr("id");
        },
        //获取窗口Id
        tabiframeTitle: function () {//tab窗口Title
            return top.$(".TENCHEER_iframe:visible").attr("title");
        },
        //获取当前窗口
        currentIframe: function () {
            if (top.frames[tencheer.tabiframeId()].contentWindow != undefined) {
                return top.frames[tencheer.tabiframeId()].contentWindow;
            }
            else {
                return top.frames[tencheer.tabiframeId()];
            }
        },
        //获取iframe窗口
        getIframe: function (Id) {
            var obj = top.frames[Id];
            if (obj != undefined) {
                if (obj.contentWindow != undefined) {
                    return obj.contentWindow;
                }
                else {
                    return obj;
                }
            }
            else {
                return null;
            }
        },
        //刷新页面
        reload: function () {
            location.reload();
            return false;
        },
        //提示框
        dialogTop: function (opt) {
            $(".tip_container").remove();
            var bid = parseInt(Math.random() * 100000);
            $("body").prepend('<div id="tip_container' + bid + '" class="tencheer-panel-container tip_container"><div id="tip' + bid + '" class="mtip"><i class="micon"></i><span id="tsc' + bid + '"></span><i id="mclose' + bid + '" class="mclose"></i></div></div>');
            var $this = $(this);
            var $tip_container = $("#tip_container" + bid);
            var $tip = $("#tip" + bid);
            var $tipSpan = $("#tsc" + bid);
            //先清楚定时器
            clearTimeout(window.timer);
            //主体元素绑定事件
            $tip.attr("class", opt.type).addClass("mtip");
            $tipSpan.html(opt.msg);
            $tip_container.slideDown(300);
            //提示层隐藏定时器
            window.timer = setTimeout(function () {
                $tip_container.slideUp(300);
                $(".tip_container").remove();
            }, 5000);
            $("#tip_container" + bid).css("left", ($(window).width() - $("#tip_container" + bid).width()) / 2);
        },
        dialogOpen: function (opt) {
            tencheer.loading({ isShow: true });
            var opt = $.extend({
                id: null,
                title: '系统窗口',
                width: "100px",
                height: "100px",
                url: '',
                shade: 0.3,
                maxmin:true,
                btn: ['确认', '关闭'],
                callBack: null
            }, opt);
            var _url = opt.url;
            var _width = top.tencheer.windowWidth() > parseInt(opt.width.replace('px', '')) ? opt.width : top.tencheer.windowWidth() + 'px';
            var _height = top.tencheer.windowHeight() > parseInt(opt.height.replace('px', '')) ? opt.height : top.tencheer.windowHeight() + 'px';
            top.layer.open({
                id: opt.id,
                type: 2,
                shade: opt.shade,
                title: opt.title,
                fix: false,
                area: [_width, _height],
                content: top.contentPath + _url,
                btn: opt.btn,
                maxmin:true,
                success: function (obj, index) {
                    tencheer.loading({ isShow: false });
                },
                yes: function () {
                    opt.callBack(opt.id);
                }, cancel: function () {
                    if (opt.cancel != undefined) {
                        opt.cancel();
                    }
                    return true;
                }
            });
        },
        dialogRightOpen: function (opt) {
            tencheer.loading({ isShow: true });
            var opt = $.extend({
                id: null,
                title: '系统窗口',
                width: "100px",
                height: "100px",
                url: '',
                offset:'rb',
                shade: 0.3,
                maxmin:true,
                btn: ['确认', '关闭'],
                callBack: null
            }, opt);
            var _url = opt.url;
            var _width = top.tencheer.windowWidth() > parseInt(opt.width.replace('px', '')) ? opt.width : top.tencheer.windowWidth() + 'px';
            var _height = top.tencheer.windowHeight() > parseInt(opt.height.replace('px', '')) ? opt.height : top.tencheer.windowHeight() + 'px';
            top.layer.open({
                id: opt.id,
                type: 2,
                shade: opt.shade,
                title: opt.title,
                fix: false,
                offset:opt.offset,
                area: [_width, _height],
                content: top.contentPath + _url,
                btn: opt.btn,
                maxmin:true,
                success: function (obj, index) {
                    tencheer.loading({ isShow: false });
                },
                yes: function () {
                    opt.callBack(opt.id);
                }, cancel: function () {
                    if (opt.cancel != undefined) {
                        opt.cancel();
                    }
                    return true;
                }
            });
        },
        dialogContent: function (opt) {
            var opt = $.extend({
                id: null,
                title: '系统窗口',
                width: "100px",
                height: "100px",
                content: '',
                btn: ['确认', '关闭'],
                callBack: null
            }, opt);
            top.layer.open({
                id: opt.id,
                type: 1,
                title: opt.title,
                fix: false,
                area: [opt.width, opt.height],
                success: function (obj, index) {
                    tencheer.loading({ isShow: false });
                },
                content: opt.content,
                btn: opt.btn,
                yes: function () {
                    opt.callBack(opt.id);
                }
            });
        },
        dialogAlert: function (opt) {
            if (opt.type == -1) {
                opt.type = 2;
            }
            top.layer.alert(opt.msg, {
                icon: opt.type,
                title: "提示",
                success: function (obj, index) {
                    tencheer.loading({ isShow: false });
                }
            });
        },
        dialogConfirm: function (opt) {
            top.layer.confirm(opt.msg, {
                icon: 7,
                title: "提示",
                btn: ['确认', '取消'],
                success: function (obj, index) {
                    tencheer.loading({ isShow: false });
                }
            }, function () {
                opt.callBack(true);
            }, function () {
                opt.callBack(false);
            });
        },
        dialogConfirmMsg:function (content, callBack) {
            top.layer.confirm(content, {
                icon: 7,
                title: "友情提示",
                btn: ['确认'],
                closeBtn: 0,
            }, function () {
                callBack(true);
            },function () {
                callBack(true);
            });
        },
        dialogMsg: function (opt) {
            if (opt.type == -1) {
                opt.type = 2;
            }
            if (opt.time===undefined){opt.time=3000;}
            top.layer.msg(opt.msg, { icon: opt.type, time: opt.time, shift: 5 });
        },
        
        dialogClose: function () {
            try {
                var index = top.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                var $IsdialogClose = top.$("#layui-layer" + index).find('.layui-layer-btn').find("#IsdialogClose");
                var IsClose = $IsdialogClose.is(":checked");
                if ($IsdialogClose.length == 0) {
                    IsClose = true;
                }
                if (IsClose) {
                    top.layer.close(index);
                } else {
                    location.reload();
                }
            } catch (e) {
                alert(e)
            }
        },
        /*
        最大化弹出对话框（没按钮）
        */
         FullDialog:function(opt) {
            tencheer.loading({ isShow: true });
            var opt = $.extend({
                id: null,
                title: '系统窗口',
                width: "100px",
                height: "100px",
                url: '',
                shade: 0.3,
                callBack: null
            }, opt);
            var _url = opt.url;
            var _width = top.tencheer.windowWidth() > parseInt(opt.width.replace('px', '')) ? opt.width : top.tencheer.windowWidth() + 'px';
            var _height = top.tencheer.windowHeight() > parseInt(opt.height.replace('px', '')) ? opt.height : top.tencheer.windowHeight() + 'px';
            top.layer.open({
                id: opt.id,
                type: 2,
                shade: opt.shade,
                title: opt.title,
                fix: false,
                area: [_width, _height],
                content: top.contentPath + _url,
                btn: opt.btn,
                success: function (obj, index) {
                    tencheer.loading({ isShow: false });
                },
                yes: function () {
                    opt.callBack(opt.id);
                }, cancel: function () {
                    if (opt.cancel != undefined) {
                        opt.cancel();
                    }
                    return true;
                }
            });
        },
        //下载文件
        downFile: function (opt) {
            if (opt.url && opt.data) {
                opt.data = typeof opt.data == 'string' ? opt.data : jQuery.param(opt.data);
                var inputs = '';
                $.each(opt.data.split('&'), function () {
                    var pair = this.split('=');
                    inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
                });
                $('<form action="' + opt.url + '" method="' + (opt.method || 'post') + '">' + inputs + '</form>').appendTo('body').submit().remove();
            };
        },
        //获取url参数值
        request: function (keyValue) {
            var search = location.search.slice(1);
            var arr = search.split("&");
            for (var i = 0; i < arr.length; i++) {
                var ar = arr[i].split("=");
                if (ar[0] == keyValue) {
                    if (unescape(ar[1]) == 'undefined') {
                        return "";
                    } else {
                        return unescape(ar[1]);
                    }
                }
            }
            return "";
        },
        //改变url参数值
        changeUrlParam: function (url, key, value) {
            var newUrl = "";
            var reg = new RegExp("(^|)" + key + "=([^&]*)(|$)");
            var tmp = key + "=" + value;
            if (url.match(reg) != null) {
                newUrl = url.replace(eval(reg), tmp);
            } else {
                if (url.match("[\?]")) {
                    newUrl = url + "&" + tmp;
                }
                else {
                    newUrl = url + "?" + tmp;
                }
            }
            return newUrl;
        },
        //获取游览器名称
        getBrowserName: function () {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isOpera = userAgent.indexOf("Opera") > -1;
            if (isOpera) {
                return "Opera"
            }; //判断是否Opera浏览器
            if (userAgent.indexOf("Firefox") > -1) {
                return "FF";
            } //判断是否Firefox浏览器
            if (userAgent.indexOf("Chrome") > -1) {
                if (window.navigator.webkitPersistentStorage == undefined) {
                    return "Edge";
                }
                if (window.navigator.webkitPersistentStorage.toString().indexOf('DeprecatedStorageQuota') > -1) {
                    return "Chrome";
                } else {
                    return "360";
                }
            }//判断是否Chrome浏览器//360浏览器
            if (userAgent.indexOf("Safari") > -1) {
                return "Safari";
            } //判断是否Safari浏览器
            if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
                return "IE";
            }//判断是否IE浏览器
        },
        //改变树状tab状态
        changeStandTab: function (opt) {
            $(".standtabactived").removeClass("standtabactived");
            $(opt.obj).addClass("standtabactived");
            $('.standtab-pane').css('display', 'none');
            $('#' + opt.id).css('display', 'block');
        },
        //获取窗口宽
        windowWidth: function () {
            return $(window).width();
        },
        //获取窗口高度
        windowHeight: function () {
            return $(window).height();
        },
        //ajax通信方法
        ajax: {
            asyncGet: function (opt) {
                var data = null;
                var opt = $.extend({
                    type: "GET",
                    dataType: "json",
                    async: false,
                    cache: false,
                    success: function (d) {
                        data = d;
                    }
                }, opt);
                $.ajax(opt);
                return data;
            }
        },
        //创建一个GUID
        createGuid: function () {
            var guid = "";
            for (var i = 1; i <= 32; i++) {
                var n = Math.floor(Math.random() * 16.0).toString(16);
                guid += n;
                if ((i == 8) || (i == 12) || (i == 16) || (i == 20)) guid += "-";
            }
            return guid;
        },
        //判断是否为空
        isNullOrEmpty: function (obj) {
            if ((typeof (obj) == "string" && obj == "") || obj == null || obj == undefined) {
                return true;
            }
            else {
                return false;
            }
        },
        //判断是否为数字
        isNumber: function (obj) {
            $("#" + obj).bind("contextmenu", function () {
                return false;
            });
            $("#" + obj).css('ime-mode', 'disabled');
            $("#" + obj).keypress(function (e) {
                if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                  //  return false;
                }
            });
        },
        //判断是否为数值类型
        isNumeric:function (obj){
            var reg = /^[-\+]?\d+(\.\d+)?$/;
            if (!reg.test(obj)) {
                return false;
            } else {
                return true;
            } 
        },
        //判断是否全是整数     
          isInt:  function (obj) {    
               var reg = /^[-\+]?\d+(\.\d+)?$/;
               if (!reg.test(obj)) {
                   return false;
               } else {
                   return true;
               }   
           },
        //判断是否是金钱
        isMoney: function (obj) {
            
            $("#" + obj).bind("contextmenu", function () {
                return false;
            });
            $("#" + obj).css('ime-mode', 'disabled');
            $("#" + obj).bind("keydown", function (e) {
                var key = window.event ? e.keyCode : e.which;
                if (isFullStop(key)) {
                    return $(this).val().indexOf('.') < 0;
                }
                return (isSpecialKey(key)) || ((isNumber(key) && !e.shiftKey));
            });
            function isNumber(key) {
                return key >= 48 && key <= 57
            }
            function isSpecialKey(key) {
                return key == 8 || key == 46 || (key >= 37 && key <= 40) || key == 35 || key == 36 || key == 9 || key == 13
            }
            function isFullStop(key) {
                return key == 190 || key == 110;
            }
        },
        //判断图片是否存在
        isHasImg: function (pathImg) {
            var ImgObj = new Image();
            ImgObj.src = pathImg;
            if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
                return true;
            } else {
                return false;
            }
        },
        //日期格式化yyyy-
        formatDate: function (v, format) {
            if (!v) return "";
            var d = v;
            if (typeof v === 'string') {
                if (v.indexOf("/Date(") > -1)
                    d = new Date(parseInt(v.replace("/Date(", "").replace(")/", ""), 10));
                else
                    d = new Date(Date.parse(v.replace(/-/g, "/").replace("T", " ").split(".")[0]));//.split(".")[0] 用来处理出现毫秒的情况，截取掉.xxx，否则会出错
            }
            var o = {
                "M+": d.getMonth() + 1,  //month
                "d+": d.getDate(),       //day
                "h+": d.getHours(),      //hour
                "m+": d.getMinutes(),    //minute
                "s+": d.getSeconds(),    //second
                "q+": Math.floor((d.getMonth() + 3) / 3),  //quarter
                "S": d.getMilliseconds() //millisecond
            };
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        },
        //转化成十进制
        toDecimal: function (num) {
            if (num == null) {
                num = "0";
            }
            num = num.toString().replace(/\$|\,/g, '');
            if (isNaN(num))
                num = "0";
            var sign = (num == (num = Math.abs(num)));
            num = Math.floor(num * 100 + 0.50000000001);
            var cents = num % 100;
            num = Math.floor(num / 100).toString();
            if (cents < 10)
                cents = "0" + cents;
            for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
                num = num.substring(0, num.length - (4 * i + 3)) + '' +
                        num.substring(num.length - (4 * i + 3));
            return (((sign) ? '' : '-') + num + '.' + cents);
        },
        //文件大小转换
        countFileSize: function (size) {
            if (size < 1024.00)
                return tencheer.toDecimal(size) + " 字节";
            else if (size >= 1024.00 && size < 1048576)
                return tencheer.toDecimal(size / 1024.00) + " KB";
            else if (size >= 1048576 && size < 1073741824)
                return tencheer.toDecimal(size / 1024.00 / 1024.00) + " MB";
            else if (size >= 1073741824)
                return tencheer.toDecimal(size / 1024.00 / 1024.00 / 1024.00) + " GB";
        },
        //数组复制
        arrayCopy: function (data) {
            return $.map(data, function (obj) {
                return $.extend(true, {}, obj);
            });
        },
        stringArray: function (str, strone) {
            var arrayObj = str.split(',');
            arrayObj.splice(arrayObj.indexOf(strone), 1);
            return String(arrayObj);
        },
        //检验是否选中行
        checkedRow: function (id) {
            var isOK = true;
            if (id == undefined || id == "" || id == 'null' || id == 'undefined') {
                isOK = false;
                tencheer.dialogMsg({ msg: '您没有选中任何数据项,请选中后再操作！', type: 0 });
            } else if (id.split(",").length > 1) {
                isOK = false;
                tencheer.dialogMsg({ msg: '很抱歉,一次只能选择一条记录！', type: 0 });
            }
            return isOK;
        },
        //表单操作
        saveForm: function (opt) {
            var opt = $.extend({
                url: "",
                param: [],
                type: "post",
                dataType: "json",
                loading: "正在处理数据...",
                success: null,
                close: true
            }, opt);
            tencheer.loading({ isShow: true, text: opt.loading });
//            if ($('[name=__RequestVerificationToken]').length > 0) {
//                opt.param["__RequestVerificationToken"] = $('[name=__RequestVerificationToken]').val();
//            }
            window.setTimeout(function () {
                $.ajax({
                    url: opt.url,
                    data: opt.param,
                    type: opt.type,
                    dataType: opt.dataType,
                    success: function (data) {
                        if (data.type == "3") {
                            tencheer.dialogAlert({ msg: data.message, type: -1 });
                        } else {
                            tencheer.loading({ isShow: false });
                            tencheer.dialogMsg({ msg: data.message, type: 1 });
                            opt.success(data);
                            if (opt.close == true) {
                                tencheer.dialogClose();
                            }
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        tencheer.loading({ isShow: false });
                        tencheer.dialogMsg({ msg: errorThrown, type: -1 });
                    },
                    beforeSend: function () {
                        tencheer.loading({ isShow: true, text: opt.loading });
                    },
                    complete: function () {
                        tencheer.loading({ isShow: false });
                    }
                });
            }, 500);
        },
        setForm: function (opt) {
            var opt = $.extend({
                url: "",
                param: [],
                type: "get",
                dataType: "json",
                success: null,
                async: false,
                cache: false
            }, opt);
            $.ajax({
                url: opt.url,
                data: opt.param,
                type: opt.type,
                dataType: opt.dataType,
                async: opt.async,
                success: function (data) {
                    if (data != null && data.type == "3") {
                        tencheer.dialogAlert({ msg: data.message, type: -1 });
                    } else {
                        opt.success(data);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    tencheer.dialogMsg({ msg: errorThrown, type: -1 });
                }, beforeSend: function () {
                    tencheer.loading({ isShow: true });
                },
                complete: function () {
                    tencheer.loading({ isShow: false });
                }
            });
        },
        removeForm: function (opt) {
            var opt = $.extend({
                msg: "注：您确定要删除吗？该操作将无法恢复",
                loading: "正在删除数据...",
                url: "",
                param: [],
                type: "post",
                dataType: "json",
                success: null
            }, opt);
            tencheer.dialogConfirm({
                msg: opt.msg,
                callBack: function (r) {
                    if (r) {
                        tencheer.loading({ isShow: true, text: opt.loading });
                        window.setTimeout(function () {
                            var postdata = opt.param;
                            if ($('[name=__RequestVerificationToken]').length > 0) {
                                postdata["__RequestVerificationToken"] = $('[name=__RequestVerificationToken]').val();
                            }
                            $.ajax({
                                url: opt.url,
                                data: postdata,
                                type: opt.type,
                                dataType: opt.dataType,
                                success: function (data) {
                                    if (data.type == "3") {
                                        tencheer.dialogAlert({ msg: data.message, type: -1 });
                                    } else {
                                        tencheer.dialogMsg({ msg: data.message, type: 1 });
                                        opt.success(data);
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    tencheer.loading({ isShow: false });
                                    tencheer.dialogMsg({ msg: errorThrown, type: -1 });
                                },
                                beforeSend: function () {
                                    tencheer.loading({ isShow: true, text: opt.loading });
                                },
                                complete: function () {
                                    tencheer.loading({ isShow: false });
                                }
                            });
                        }, 500);
                    }
                }
            });
        },
        confirmAjax: function (opt) {
            var opt = $.extend({
                msg: "提示信息",
                loading: "正在处理数据...",
                url: "",
                param: [],
                type: "post",
                dataType: "json",
                success: null
            }, opt);
            tencheer.dialogConfirm({
                msg: opt.msg,
                callBack: function (r) {
                    if (r) {
                        tencheer.loading({ isShow: true, text: opt.loading });
                        window.setTimeout(function () {
                            var postdata = opt.param;
                            if ($('[name=__RequestVerificationToken]').length > 0) {
                                postdata["__RequestVerificationToken"] = $('[name=__RequestVerificationToken]').val();
                            }
                            $.ajax({
                                url: opt.url,
                                data: postdata,
                                type: opt.type,
                                dataType: opt.dataType,
                                success: function (data) {
                                    tencheer.loading({ isShow: false });
                                    if (data.type == "3") {
                                        tencheer.dialogAlert({ msg: data.message, type: -1 });
                                    } else {
                                        tencheer.dialogMsg({ msg: data.message, type: 1 });
                                        opt.success(data);
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    tencheer.loading({ isShow: false });
                                    tencheer.dialogMsg({ msg: errorThrown, type: -1 });
                                },
                                beforeSend: function () {
                                    tencheer.loading({ isShow: true, text: opt.loading });
                                },
                                complete: function () {
                                    tencheer.loading({ isShow: false });
                                }
                            });
                        }, 200);
                    }
                }
            });
        },
        existField: function (controlId, url, param) {
            var $control = $("#" + controlId);
            if (!$control.val()) {
                return false;
            }
            var data = {
                keyValue: tencheer.request('keyValue')
            };
            data[controlId] = $control.val();
            var options = $.extend(data, param);
            $.ajax({
                url: url,
                data: options,
                type: "get",
                dataType: "text",
                async: false,
                success: function (data) {
                    if (data.toLocaleLowerCase() == 'false') {
                        ValidationMessage($control, '已存在,请重新输入');
                        $control.attr('fieldexist', 'yes');
                    } else {
                        $control.attr('fieldexist', 'no');
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    tencheer.dialogMsg({ msg: errorThrown, type: -1 });
                }
            });
        },
        getDataForm: function (opt) {
            var opt = $.extend({
                url: "",
                param: [],
                type: "post",
                dataType: "json",
                loading: "正在获取数据...",
                success: null,
                async: false,
                cache: false
            }, opt);
            tencheer.loading({ isShow: true, text: opt.loading });
            if ($('[name=__RequestVerificationToken]').length > 0) {
                opt.param["__RequestVerificationToken"] = $('[name=__RequestVerificationToken]').val();
            }
            $.ajax({
                url: opt.url,
                data: opt.param,
                type: opt.type,
                dataType: opt.dataType,
                async: opt.async,
                success: function (data) {
                    if (data != null && data.type == "3") {
                        tencheer.dialogAlert({ msg: data.message, type: -1 });
                    } else {
                        opt.success(data);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    tencheer.dialogMsg({ msg: errorThrown, type: -1 });
                }, beforeSend: function () {
                    tencheer.loading({ isShow: true });
                },
                complete: function () {
                    tencheer.loading({ isShow: false });
                }
            });
        },
        //获取系统表单字段数据,如果需要对这些字段做权限管控才添加，不然不添加
        getSystemFormFields: function (Id) {
            var formIframe = tencheer.getIframe(Id);
            if (!!formIframe.$) {
                formIframe.$('body').find('[data-systemHideField]').hide();
                if (!!formIframe.getSystemFields) {
                    return formIframe.getSystemFields();//{ "field": id, "label": name, 'type': type }
                }
                else {
                    return [];
                }
            }
            else {
                return false;
            }
        },
        loadSystemForm: function (iframeId, url) {
            var _iframe = document.getElementById(iframeId);
            var _iframeLoaded = function () {
                var formIframe = tencheer.getIframe(iframeId);
                if (!!formIframe.$) {
                    formIframe.$('body').find('[data-systemHideField]').hide();
                }
                tencheer.loading({ "isShow": false });
            };
            if (_iframe.attachEvent) {
                _iframe.attachEvent("onload", _iframeLoaded);
            } else {
                _iframe.onload = _iframeLoaded;
            }
            $('#' + iframeId).attr('src', url);
        },
        getSystemFormData:function(iframeId)//获取系统表单数据
        {
            var formIframe = tencheer.getIframe(iframeId);
            if (!!formIframe && !!formIframe.$) {
                if (!!formIframe.getSystemData) {
                    return formIframe.getSystemData();//{ "field": id, "label": name, 'type': type }
                }
                else {
                    return [];
                }
            }
            else {
                return [];
            }
        },
        saveSystemFormData:function(iframeId,callback)
        {
            var formIframe = tencheer.getIframe(iframeId);
            if (!!formIframe.$) {
                if (!!formIframe.AcceptClick) {
                    formIframe.AcceptClick(callback);//{ "field": id, "label": name, 'type': type }
                }
            }
        },
        setSystemFormFieldsAuthrize: function (iframeId, item) {
            var formIframe = tencheer.getIframe(iframeId);
            if (!!formIframe.$) {
                if (!!formIframe.setSystemFieldsAuthorize) {
                    formIframe.setSystemFieldsAuthorize(item);//{ "field": id, "label": name, 'type': type }
                }
            }
        },
        //创建一个流程
        createProcess: function (postData, callBack) {
            postData.processId = tencheer.createGuid();
            postData.moduleId = top.$.cookie('currentmoduleId');
            tencheer.getDataForm({
                url: "../../FlowManage/FlowLaunch/CreateProcessInstance",
                param: postData,
                loading: "正在创建流程",
                success: function () {
                    callBack(postData.processId);
                }
            });
        },
        //设置输入框tabIndex
        ConfigTabIndex:function(inputElementIds,startIndex){
            var index=startIndex;
            $.each(inputElementIds,function(key,val){
                var isDisabled=$("#"+val).attr('disabled');
                if (isDisabled!="disabled")
                {
                    index++;
                    $("#"+val).attr('tabindex',index);
                }
            }); 
        },
        SetColumnFrozen:function(grid){
            $(grid).jqGrid('setFrozenColumns');
        },
        //创建一个Grid
        CreateGridTable:function(gridTable,gridId){
            var sort_name="";
            var sort_order="";
            var columnJson="";
            var colModelData=[];
            var grid_data =top.tencheer.data.getGrid(gridId);  //获取表格样式配置
            var column_tofit=false;
//            var gridWidth = gridTable.parent().width();
//            if (gridWidth != undefined && grid_data.grid_width!=undefined) {
//                if (gridWidth > grid_data.grid_width) {
//                  //  console.log("gridWidth:"+gridWidth);
//                    column_tofit = true;
//                }
//                else {
//                    column_tofit = false;
//                }
//            }
//            else
//            {
//                column_tofit=false;
//            }
//            if (column_tofit == undefined) column_tofit = true;

            if ("undefined"!=typeof grid_id){
                grid_id=grid_data.grid_id;
               // console.log("grid_id:"+grid_id);
            }
            if ("undefined"!=typeof param_remark){
                if (!tencheer.isNullOrEmpty(grid_data.remark)){
                    param_remark=grid_data.remark;
                }
                console.log("param_remark:"+param_remark);
            }
            var column_data=top.tencheer.data.getColumn(grid_data.grid_id);  //获取表格字段配置
            columnJson=column_data;
            var grid_row=grid_data;
            $.each(column_data, function (i) {
                var row = column_data[i];
                var align=row.column_align;
                if (row.column_align=="靠左") {align="left";}
                if (row.column_align=="居中") {align="center";}
                if (row.column_align=="靠右") {align="right";}
                if (row.column_sort=="升序"){sort_name=sort_name+row.column_code+" asc,"; }
                if (row.column_sort=="降序"){sort_name=sort_name+row.column_code+" desc,";}
                
                var colData = {
                    label : row.column_name,  
                    name :  row.column_code,
                    index : row.column_code,
                    width : row.column_width,  
                    align : align,
                    cellattr:function (){return  'style="'+row.column_style+'"'},
                    hidden: row.is_show=='1' ? false :true ,
                    key:    row.primary_key=='是' ? true : false,
                    editable:row.column_edit=='1' ? true :false,
                    edittype:'text'
                }  
                if (row.column_formatter=="是")
                {
                    if (row.column_code=="action"){colData["sortable"]=false;}
                    colData["formatter"]=function (cellvalue, options, rowObject) {
                            if (row.column_type=="日期型"){
                                return formatDate(cellvalue, 'yyyy-MM-dd');
                            }
                            if (row.column_type=="数值型" && tencheer.isNumber(cellvalue)){
                                return parseFloat(Number(cellvalue));
                            }
                            else
                            {
                                if(typeof formatData === "function") {
                                    return formatData(cellvalue,row.column_code,options, rowObject,row.column_type);
                                }
                                return cellvalue;
                            }
                        };
                }
                if (row.column_frozen=="是")
                {
                    colData["frozen"] =true;
                }
                colModelData.push(colData); 
            });
            if (sort_name.length>3){
                if (sort_name.substring(sort_name.length,sort_name.length - 4)=="asc,"){
                    sort_name=sort_name.substring(0,sort_name.length - 4);
                    sort_order="asc";
                }
                if (sort_name.substring(sort_name.length,sort_name.length - 5)=="desc,"){
                    sort_name=sort_name.substring(0,sort_name.length - 5);
                    sort_order="desc";
                }
            }
            else
            {
                sort_name=grid_row.sort_column;
                sort_order=grid_row.sort_type;
            }

            gridTable.jqGrid('GridUnload'); 
            gridTable.jqGrid({
                url: grid_row.data_url+"?token="+token,
                datatype: "json",
                autowidth: true,
                height:$(window).height(),
                mtype: 'POST',
                rownumbers:grid_row.grid_row_no=='1' ? true : false,    //序号
                colModel:colModelData,  //用拼接好的动态列组合对colModel赋值
                rowNum:grid_row.grid_page=='1' ? grid_row.grid_rownum : 10000,//grid_row.grid_page=='1' ? 30 : 1000,    //当前页显示几条记录
                rowList:[30,50,100,300,500],     //当前面可显示的记录条数
                pager: '#'+grid_row.grid_pager_id,
                viewrecords: true,
                multiSort:true,
                sortname:sort_name,//grid_row.sort_column,//"create_date",
                sortorder: sort_order,//grid_row.sort_type,//"desc",
                multiselectWidth:30,
                multiselect:grid_row.grid_select=='1' ? true : false,  
                caption:"",
                altRows:false,
                shrinkToFit: column_tofit,
                cellsubmit:'clientArray',
                scrollrows:true,
                rownumWidth:45,
                cellEdit:grid_row.grid_edit=='1' ? true : false,
                footerrow:grid_row.grid_summary=='1' ? true : false,
                subGrid: grid_row.sub_grid=='是' ? true : false,
                onSelectAll:function(aRowids,status){
                    gridTable.jqGridNumFieldSum(columnJson);
                },
                onSelectRow:function(rowid,status){
                    gridTable.jqGridNumFieldSum(columnJson);
                }
            });

            if (grid_row.grid_filter=='1')
            {
                gridTable.jqGrid('filterToolbar',{searchOperators : false,autosearch:false,searchOnEnter:false});
                
            }
            if (grid_row.grid_page=='1'){
                gridTable.navGrid('#'+grid_row.grid_pager_id, { edit: false, add: false, del: false ,search:false,refresh:false});
                gridTable.navButtonAdd('#'+grid_row.grid_pager_id,
                    {caption:"",style:"font-size:14px;color:green",buttonicon:"fa fa-file-excel-o",
                        onClickButton: function(){
                            var exportType="all";
                            var ids=$(gridTable).jqGrid('getGridParam','selarrrow');
                            if (ids.length>0){
                                exportType="selected";
                            }
                            var columnModel=$(gridTable).jqGrid('getGridParam', 'colModel');
                            var export_group="";
                            if("undefined"!=typeof excel_export_group)
                            {
                                export_group=excel_export_group;
                            }
                            else
                            {
                                console.log('excel_export_group 未定义');
                            }
                            var data_url="";//$(this).jqGrid('getGridParam','url');
                            if("undefined"!=typeof export_data_url)
                            {
                                data_url=export_data_url;
                            }
                            tencheer.dialogOpen({
                                id: "ExcelExportForm",
                                title:"导出-"+grid_row.grid_name,
                                url: '/system_manage/excel_export_manage/ColumnFilter?export_group='+export_group+'&columnModel='+columnModel+'&gridId='+$(gridTable).attr('id')+'&filename='+grid_row.grid_name+'&exportData='+exportType+"&grid_id="+grid_data.grid_id+"&export_data_url="+escape(data_url) ,
                                width: "780px",
                                height: "500px",
                                btn: ['导出', '关闭'],
                                callBack: function (iframeId) {
                                    top.frames[iframeId].AcceptClick();
                                }
                             });
                        },position:"first"});     
            }
            
            return columnJson;
        },
        subGridColumnConfig: function (gridId){
            var colModelData=[];
            $.ajax({
                url: "/system_manage/authorize_manage/GetUserGridColumnList?grid_id="+gridId,
                type: "get",
                dataType: "json",
                async: false,
                success: function (data) {
                    var column_data=jQuery.parseJSON(data.column_data);
                    $.each(column_data, function (i) {
                        var row = column_data[i];
                        var colData = {
                            label : row.Column_Name,  
                            name :  row.Column_Code,
                            index : row.Column_Code,
                            width : row.Column_Width,  
                            align : row.Column_Align,
                            cellattr:function (){return  'style="'+row.Column_Style+'"'},
                            hidden: row.IsShow=='1' ? false :true ,
                            key:    row.primary_key=='是' ? true : false,
                            editable:row.Column_Edit=='1' ? true :false,
                            edittype:'text'
                        }  
                        if (row.Column_Formatter=="是")
                        {
                            colData["formatter"]=function (cellvalue, options, rowObject) {
                                    if (row.Column_Type=="数值型"){
                                        return parseFloat(Number(cellvalue));
                                    }
                                    if (row.Column_Type=="日期型"){
                                        return formatDate(cellvalue, 'yyyy-MM-dd');
                                    }
                                    else
                                    {
                                        if(typeof formatData === "function") {
                                            return formatData(cellvalue,row.column_code,options, rowObject,row.column_type);
                                        }
                                        return cellvalue;
                                    }
                                };
                        }
                        colModelData.push(colData); 
                    });
                }
            });
            return colModelData;
        },
        //获取字段的配置类型
        getColumnType:function(data,columnCode){
            var columnType="字符型";
            $.each(data, function (i) {
                var row = data[i];
                if (row.column_code==columnCode)
                {
                   columnType=row.column_type;
                   return columnType;
                }
            });
            return columnType;
        },
        //json数据操作
        jsonWhere: function (data, action) {
            if (action == null) return;
            var reval = new Array();
            $(data).each(function (i, v) {
                if (action(v)) {
                    reval.push(v);
                }
            })
            return reval;
        },
        SelectData: function (keyValue){
            var result = '';
            $.ajax({ 
                    type:"post", 
                    async:false, 
                    url:"/system_manage/main_frame/SelectData?keyValue="+keyValue, 
                    success:function(data){
                            result= eval(data); 
                    },
                    dataType:'text'
            });
            return result; 
        }
    });
})(window.jQuery, window.tencheer);

(function($, undefined) {
    $.fn.getCursorPosition = function() {
        var el = $(this).get(0);
        var pos = 0;
        if ('selectionStart' in el) {
            pos = el.selectionStart;
        } else if ('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    }
    $.fn.disable = function() { 
        /// <summary> 
        /// 屏蔽所有元素 
        /// </summary> 
        /// <returns type="jQuery" /> 
        return $(this).find("*").each(function() { 
            $(this).attr("disabled", "disabled"); 
//             $(this).attr("readonly", "readonly");
        }); 
    } 
    $.fn.enable = function() { 
        /// <summary> 
        /// 使得所有元素都有效 
        /// </summary> 
        /// <returns type="jQuery" /> 
        return $(this).find("*").each(function() { 
            $(this).removeAttr("disabled"); 
        }); 
    } 
})(jQuery);
//加法函数，用来得到精确的加法结果 
//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。 
//调用：accAdd(arg1,arg2) 
//返回值：arg1加上arg2的精确结果 
//给Number类型增加一个add方法，调用起来更加方便。 
Number.prototype.add = function (arg) {
    var arg1=arg;
    var reg = /^[-\+]?\d+(\.\d+)?$/;
    if (!reg.test(arg)) {
        arg1=0;
    } 
    var arg2=this;
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
}
/** 
 ** 减法函数，用来得到精确的减法结果 
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。 
 ** 调用：accSub(arg1,arg2) 
 ** 返回值：arg1加上arg2的精确结果 
 **/  
function accSub(arg1, arg2) {  
    var r1, r2, m, n;  
    try {  
        r1 = arg1.toString().split(".")[1].length;  
    }  
    catch (e) {  
        r1 = 0;  
    }  
    try {  
        r2 = arg2.toString().split(".")[1].length;  
    }  
    catch (e) {  
        r2 = 0;  
    }  
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度  
    n = (r1 >= r2) ? r1 : r2;  
    return ((arg1 * m - arg2 * m) / m).toFixed(n);  
}  
// 给Number类型增加一个mul方法，调用起来更加方便。  
Number.prototype.sub = function (arg) {  
    return accSub(arg, this);  
}; 
/** 
 ** 乘法函数，用来得到精确的乘法结果 
 ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。 
 ** 调用：accMul(arg1,arg2) 
 ** 返回值：arg1乘以 arg2的精确结果 
 **/  
function accMul(arg1, arg2) {  
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();  
    try {  
        m += s1.split(".")[1].length;  
    }  
    catch (e) {  
    }  
    try {  
        m += s2.split(".")[1].length;  
    }  
    catch (e) {  
    }  
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);  
}  
  
// 给Number类型增加一个mul方法，调用起来更加方便。  
Number.prototype.mul = function (arg) {  
    return accMul(arg, this);  
};  

/**  
 ** 除法函数，用来得到精确的除法结果 
 ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。 
 ** 调用：accDiv(arg1,arg2) 
 ** 返回值：arg1除以arg2的精确结果 
 **/  
function accDiv(arg1, arg2) {  
    var t1 = 0, t2 = 0, r1, r2;  
    try {  
        t1 = arg1.toString().split(".")[1].length;  
    }  
    catch (e) {  
    }  
    try {  
        t2 = arg2.toString().split(".")[1].length;  
    }  
    catch (e) {  
    }  
    with (Math) {  
        r1 = Number(arg1.toString().replace(".", ""));  
        r2 = Number(arg2.toString().replace(".", ""));  
        return (r1 / r2) * pow(10, t2 - t1);  
    }  
}  

function getCookie(name) { 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
        return unescape(arr[2]); 
    } else { 
        return null; 
    } 
}


//给Number类型增加一个div方法，调用起来更加方便。  
Number.prototype.div = function (arg) {  
    return accDiv(this, arg);  
};  