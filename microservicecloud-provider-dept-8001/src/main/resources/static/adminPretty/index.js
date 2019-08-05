/*!
 * 版 本 TencheerADMS V6.1.2.0 (http://www.tencheer.cn)
 * Copyright 2011-2016 Tencheer, Inc.
 */
var tablist = {
    closeTab:function(){
      $('.page-tabs-content').find('.active .tab_close').trigger("click");  
    },
    newTab: function (item) {
        var dataId = item.id;
        var dataUrl = item.url;
        var menuName = '<i  class="' + item.icon + '"></i>' + item.title;
        var flag = true;
        if (dataUrl == undefined || $.trim(dataUrl).length == 0) {
            return false;
        }
//        if (dataId!="/main/admin_pretty_desktop") { $(".dock").css("display","none");} else { $(".dock").css("display","");}
        $('.menuTab').each(function () {
            if ($(this).data('id') == dataUrl) {
                if (!$(this).hasClass('active')) {
                    $(this).addClass('active').siblings('.menuTab').removeClass('active');
                    $.tencheertab.scrollToTab(this);
                    $('#mainContent .TENCHEER_iframe').each(function () {
                        if ($(this).data('id') == dataUrl) {
                            $(this).show().siblings('.TENCHEER_iframe').hide();
                            return false;
                        }
                    });
                }
                flag = false;
                return false;
            }
        });
        if (flag) {
            var str = '<a href="javascript:;" class="active menuTab" data-id="' + dataUrl + '">' + menuName + ' <div class="tab_close "></div></a>';
            $('.menuTab').removeClass('active');
            var str1 = '<iframe class="TENCHEER_iframe" id="iframe' + dataId + '" name="iframe' + dataId + '"  width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" seamless></iframe>';
            $('#mainContent').find('iframe.TENCHEER_iframe').hide();
            $('#mainContent').append(str1);
            tencheer.loading({ isShow: true });
            $('#mainContent iframe:visible').load(function () {
                tencheer.loading({ isShow: false });
            });
            $('.menuTabs .page-tabs-content').append(str);
            $.tencheertab.scrollToTab($('.menuTab.active'));
        }
    }
};
(function ($) {
    "use strict";
    
    $.tencheertab = {
        requestFullScreen: function () {
            var de = document.documentElement;
            if (de.requestFullscreen) {
                de.requestFullscreen();
            } else if (de.mozRequestFullScreen) {
                de.mozRequestFullScreen();
            } else if (de.webkitRequestFullScreen) {
                de.webkitRequestFullScreen();
            }
        },
        exitFullscreen: function () {
            var de = document;
            if (de.exitFullscreen) {
                de.exitFullscreen();
            } else if (de.mozCancelFullScreen) {
                de.mozCancelFullScreen();
            } else if (de.webkitCancelFullScreen) {
                de.webkitCancelFullScreen();
            }
        },
        refreshTab: function () {
            var currentId = $('.page-tabs-content').find('.active').attr('data-id');
            var target = $('.TENCHEER_iframe[data-id="' + currentId + '"]');
            var url = target.attr('src');
            tencheer.loading({ isShow: true });
            target.attr('src', url).load(function () {
                tencheer.loading({ isShow: false });
            });
        },
        refershMainTab:function (type){
            var target = $('.TENCHEER_iframe[data-id="/main/admin_pretty_desktop"]');
            var url = "/main/admin_pretty_desktop?type="+type;
            tencheer.loading({ isShow: true });
            target.attr('src', url).load(function () {
                tencheer.loading({ isShow: false });
            });
        },
        activeTab: function () {
            var currentId = $(this).data('id');
            if (!$(this).hasClass('active')) {
                $('#mainContent .TENCHEER_iframe').each(function () {
                    if ($(this).data('id') == currentId) {
                        $(this).show().siblings('.TENCHEER_iframe').hide();
                        return false;
                    }
                });
                $(this).addClass('active').siblings('.menuTab').removeClass('active');
                $.tencheertab.scrollToTab(this);
            }
            var dataId = $(this).attr('data-value');
            if (dataId != "") {
                top.$.cookie('currentmoduleId', dataId, { path: "/" });
            }
        },
        closeOtherTabs: function () {
            $('.page-tabs-content').children("[data-id]").find('.tab_close').parents('a').not(".active").each(function () {
                $('.TENCHEER_iframe[data-id="' + $(this).data('id') + '"]').remove();
                $(this).remove();
            });
            $('.page-tabs-content').css("margin-left", "0");
        },
        closeTab: function () {
            var closeTabId = $(this).parents('.menuTab').data('id');
            var currentWidth = $(this).parents('.menuTab').width();
            if ($(this).parents('.menuTab').hasClass('active')) {
                if ($(this).parents('.menuTab').next('.menuTab').size()) {
                    var activeId = $(this).parents('.menuTab').next('.menuTab:eq(0)').data('id');
                    $(this).parents('.menuTab').next('.menuTab:eq(0)').addClass('active');

                    $('#mainContent .TENCHEER_iframe').each(function () {
                        if ($(this).data('id') == activeId) {
                            $(this).show().siblings('.TENCHEER_iframe').hide();
                            return false;
                        }
                    });
                    var marginLeftVal = parseInt($('.page-tabs-content').css('margin-left'));
                    if (marginLeftVal < 0) {
                        $('.page-tabs-content').animate({
                            marginLeft: (marginLeftVal + currentWidth) + 'px'
                        }, "fast");
                    }
                    $(this).parents('.menuTab').remove();
                    $('#mainContent .TENCHEER_iframe').each(function () {
                        if ($(this).data('id') == closeTabId) {
                            $(this).remove();
                            return false;
                        }
                    });
                }
                if ($(this).parents('.menuTab').prev('.menuTab').size()) {
                    var activeId = $(this).parents('.menuTab').prev('.menuTab:last').data('id');
                    $(this).parents('.menuTab').prev('.menuTab:last').addClass('active');
                    $('#mainContent .TENCHEER_iframe').each(function () {
                        if ($(this).data('id') == activeId) {
                            $(this).show().siblings('.TENCHEER_iframe').hide();
                            return false;
                        }
                    });
                    $(this).parents('.menuTab').remove();
                    $('#mainContent .TENCHEER_iframe').each(function () {
                        if ($(this).data('id') == closeTabId) {
                            $(this).remove();
                            return false;
                        }
                    });
                }
            }
            else {
                $(this).parents('.menuTab').remove();
                $('#mainContent .TENCHEER_iframe').each(function () {
                    if ($(this).data('id') == closeTabId) {
                        $(this).remove();
                        return false;
                    }
                });
                $.tencheertab.scrollToTab($('.menuTab.active'));
            }
            var dataId = $('.menuTab.active').attr('data-value');
            if (dataId != "") {
                top.$.cookie('currentmoduleId', dataId, { path: "/" });
            }
            return false;
        },
        addTab: function () {
            var dataId = $(this).attr('data-id');
            if (dataId != "") {
                top.$.cookie('currentmoduleId', dataId, { path: "/" });
            }
            var dataUrl = $(this).attr('href');
            var menuName = $.trim($(this).html());
            if (dataUrl == undefined || $.trim(dataUrl).length == 0) {
                return false;
            }
            var flag = true;
            $('.menuTab').each(function () {
                if ($(this).data('id') == dataUrl) {
                    if (!$(this).hasClass('active')) {
                        $(this).addClass('active').siblings('.menuTab').removeClass('active');
                        $.tencheertab.scrollToTab(this);
                        $('#mainContent .TENCHEER_iframe').each(function () {
                            if ($(this).data('id') == dataUrl) {
                                $(this).show().siblings('.TENCHEER_iframe').hide();
                                return false;
                            }
                        });
                    }
                    flag = false;
                    return false;
                }
            });
            if (flag) {
                var str = '<a href="javascript:;" class="active menuTab" data-value=' + dataId + ' data-id="' + dataUrl + '">' + menuName + '<div class="tab_close "></div></a>';
                $('.menuTab').removeClass('active');
                var str1 = '<iframe class="TENCHEER_iframe" id="iframe' + dataId + '" name="iframe' + dataId + '"  width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" seamless></iframe>';
                $('#mainContent').find('iframe.TENCHEER_iframe').hide();
                $('#mainContent').append(str1);
                tencheer.loading({ isShow: true });
                $('#mainContent iframe:visible').load(function () {
                    tencheer.loading({ isShow: false });
                });
                $('.menuTabs .page-tabs-content').append(str);
                $.tencheertab.scrollToTab($('.menuTab.active'));
            }
            $(this).parents('.popover-moreMenu').hide();
            $(this).parents('.popover-menu').hide();
            $(this).parents('.popover-menu-sub').hide();
           
            return false;
        },
        scrollTabRight: function () {
            var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
            var tabOuterWidth = $.tencheertab.calSumWidth($(".tzy-tabs").children().not(".menuTabs"));
            var visibleWidth = $(".tzy-tabs").outerWidth(true) - tabOuterWidth;
            var scrollVal = 0;
            if ($(".page-tabs-content").width() < visibleWidth) {
                return false;
            } else {
                var tabElement = $(".menuTab:first");
                var offsetVal = 0;
                while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).next();
                }
                offsetVal = 0;
                while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).next();
                }
                scrollVal = $.tencheertab.calSumWidth($(tabElement).prevAll());
                if (scrollVal > 0) {
                    $('.page-tabs-content').animate({
                        marginLeft: 0 - scrollVal + 'px'
                    }, "fast");
                }
            }
        },
        scrollTabLeft: function () {
            var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
            var tabOuterWidth = $.tencheertab.calSumWidth($(".tzy-tabs").children().not(".menuTabs"));
            var visibleWidth = $(".tzy-tabs").outerWidth(true) - tabOuterWidth;
            var scrollVal = 0;
            if ($(".page-tabs-content").width() < visibleWidth) {
                return false;
            } else {
                var tabElement = $(".menuTab:first");
                var offsetVal = 0;
                while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).next();
                }
                offsetVal = 0;
                if ($.tencheertab.calSumWidth($(tabElement).prevAll()) > visibleWidth) {
                    while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                        offsetVal += $(tabElement).outerWidth(true);
                        tabElement = $(tabElement).prev();
                    }
                    scrollVal = $.tencheertab.calSumWidth($(tabElement).prevAll());
                }
            }
            $('.page-tabs-content').animate({
                marginLeft: 0 - scrollVal + 'px'
            }, "fast");
        },
        scrollToTab: function (element) {
            var marginLeftVal = $.tencheertab.calSumWidth($(element).prevAll()), marginRightVal = $.tencheertab.calSumWidth($(element).nextAll());
            var tabOuterWidth = $.tencheertab.calSumWidth($(".tzy-tabs").children().not(".menuTabs"));
            var visibleWidth = $(".tzy-tabs").outerWidth(true) - tabOuterWidth;
            var scrollVal = 0;
            if ($(".page-tabs-content").outerWidth() < visibleWidth) {
                scrollVal = 0;
            } else if (marginRightVal <= (visibleWidth - $(element).outerWidth(true) - $(element).next().outerWidth(true))) {
                if ((visibleWidth - $(element).next().outerWidth(true)) > marginRightVal) {
                    scrollVal = marginLeftVal;
                    var tabElement = element;
                    while ((scrollVal - $(tabElement).outerWidth()) > ($(".page-tabs-content").outerWidth() - visibleWidth)) {
                        scrollVal -= $(tabElement).prev().outerWidth();
                        tabElement = $(tabElement).prev();
                    }
                }
            } else if (marginLeftVal > (visibleWidth - $(element).outerWidth(true) - $(element).prev().outerWidth(true))) {
                scrollVal = marginLeftVal - $(element).prev().outerWidth(true);
            }
            $('.page-tabs-content').animate({
                marginLeft: 0 - scrollVal + 'px'
            }, "fast");
        },
        calSumWidth: function (element) {
            var width = 0;
            $(element).each(function () {
                width += $(this).outerWidth(true);
            });
            return width;
        },
        closeAllTab:function(){
            $('.page-tabs-content').children("[data-id]").find('.tab_close').parents('a').each(function () {
                $('.TENCHEER_iframe[data-id="' + $(this).data('id') + '"]').remove();
                $(this).remove();
            });
            $('.page-tabs-content').children("[data-id]:first").each(function () {
                    $('.TENCHEER_iframe[data-id="' + $(this).data('id') + '"]').show();
                    $(this).addClass("active");
                });
            $('.page-tabs-content').css("margin-left", "0");
        },
        
        init: function () {
            $('.menuTabs').on('click', '.menuTab .tab_refersh', $.tencheertab.refreshTab);
            $('.menuTabs').on('click', '.menuTab .tab_close', $.tencheertab.closeTab);
            $('.menuTabs').on('click', '.menuTab', $.tencheertab.activeTab);

            $('.tabLeft').on('click', $.tencheertab.scrollTabLeft);
            $('.tabRight').on('click', $.tencheertab.scrollTabRight);
            $('.tabReload').on('click', $.tencheertab.refreshTab);
            $('.tabCloseCurrent').on('click', function () {
                $('.page-tabs-content').find('.active .tab_close').trigger("click");
            });
             $('.tabColumnConfig').on('click', function () {
                 top.tablist.newTab({ id: "列表配置", title:"列表配置", closed: true, icon: "fa fa-edit", url:"/system_manage/grid_column_manage/config" });
             });
            $('.tabCloseAll').on('click', function () {
                $('.page-tabs-content').children("[data-id]").find('.tab_close').parents('a').each(function () {
                $('.TENCHEER_iframe[data-id="' + $(this).data('id') + '"]').remove();
                $(this).remove();
            });
            $('.page-tabs-content').children("[data-id]:first").each(function () {
                    $('.TENCHEER_iframe[data-id="' + $(this).data('id') + '"]').show();
                    $(this).addClass("active");
                });
            $('.page-tabs-content').css("margin-left", "0");
            });
            $('.tabCloseOther').on('click', $.tencheertab.closeOtherTabs);
            $('.fullscreen').on('click', function () {
                if (!$(this).attr('fullscreen')) {
                    $(this).attr('fullscreen', 'true');
                    $.tencheertab.requestFullScreen();
                } else {
                    $(this).removeAttr('fullscreen');
                    $.tencheertab.exitFullscreen();
                }
            });

          
        }
    };
    $.tencheerindex = {
        load: function () {
            $("#mainContent").height($(window).height() - 128);
            $(window).resize(function (e) {
                $("#mainContent").height($(window).height() - 128);
                $.tencheerindex.loadMenu(true);
            });
            //个人中心
            $("#UserSetting").click(function () {
                tablist.newTab({ id: "UserSetting", title: "个人中心", closed: true, icon: "fa fa fa-user", url: contentPath + "/system_manage/person_center" });
            });
        },
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
        loadBranch:function(){
            var login_user_data= JSON.parse(top.tencheer.data.get(["login_user_data"]));
            var branch_no=login_user_data.branch_no;
            var branch_name=branch_no;
            var branch_data= eval(top.tencheer.data.get(["branch_data"]));
            var optionhtml='';
            
            $.each(branch_data, function (i) {
                var row = branch_data[i];
                optionhtml+='<option value="'+row.branch_no+'">'+row.branch_name+'</option>';
                if (row.branch_no==branch_no)
                {
                    branch_name=row.branch_name;
                    top.$.cookie('branch_name',branch_name); 
                }
            });
            $("#branchsite").empty();
            $("#branchsite").append(optionhtml);
            $('#branchsite').val(branch_no);
            if (login_user_data.system_type=='5')
            {

            }
        },
        loadMenu: function (isInit) {
            var login_user_data= JSON.parse(top.tencheer.data.get(["login_user_data"]));
             if (login_user_data.system_type=='0' || login_user_data.system_type=="1" || login_user_data.system_type=="7")
             {
                 if ( login_user_data.is_super=='1' || login_user_data.is_super=='2')
                    {
                        $('#branchsite').removeAttr("disabled");
                    }
             }
             else
             {
//                 $(".roll-nav").css("display","none");
                 $("#login_branch").css("display","none");
             }
             
             $("#txt_company").html("<span>登录公司："+login_user_data.cust_name+"</span>");
             $('#user_name').html("欢迎您,"+login_user_data.user_name);
             if (login_user_data.pic_url!=undefined && login_user_data.pic_url!=null && login_user_data.pic_url !="")
             {
                    $('#user_head').attr('src',login_user_data.pic_url);
             }
             
            var flag = false;
            var topMenuWidth = $('.tzy-Head').width() - $.tencheertab.calSumWidth($(".tzy-Head").children().not(".left-bar"));
           
            var data = top.tencheer.data.get(["authorizeMenu"]);
            
            var _html = "";
            var menuWidth = 0;
            var _html1 = "", _html2 = "";
            var MenuData=eval(data);
            $.each(MenuData, function (i) {
                var row = MenuData[i];
                if (row.parent_id == "0") {
                    var _itemHtml = "";
                    _itemHtml += '<li class="treeview">';
                    _itemHtml += '<a>';
                    _itemHtml += '<i class="' + row.menu_icon + '" style="font-size:18px"></i><span>' + row.menu_name + '</span>';
                    _itemHtml += '</a>';
                    var childNodes = $.tencheerindex.jsonWhere(MenuData, function (v) { return v.parent_id == row.menu_id });
                    if (childNodes.length > 0) {
                        _itemHtml += '<div class="popover-menu"><div class="arrow"><em></em><span></span></div><ul class="treeview-menu">';
                        $.each(childNodes, function (i) {
                            var subrow = childNodes[i];
                            var subchildNodes = $.tencheerindex.jsonWhere(MenuData, function (v) { return v.parent_id == subrow.menu_id });
                            if (subrow.is_split==1){
                                 _itemHtml += '<li style="border-bottom:1px #ddd solid ">';
                            }
                            else
                            {
                                 _itemHtml += '<li>'
                            }

                            if (subchildNodes.length > 0) {
                                _itemHtml += '<a class="menuTreeItem menuItem" href="#"><i class="' + subrow.menu_icon + ' firstIcon"></i>' + subrow.menu_name + '';
                                _itemHtml += '<i class="fa fa-angle-right pull-right"></i></a>';

                                _itemHtml += '<div class="popover-menu-sub"><ul class="treeview-menu">';
                                $.each(subchildNodes, function (i) {
                                    var subchildNodesrow = subchildNodes[i];
                                    if (subchildNodesrow.is_split==1){
                                         _itemHtml += '<li style="border-bottom:1px #ddd solid "><a class="menuItem menuiframe" data-id="' + subchildNodesrow.menu_id + '" href="' + subchildNodesrow.url_address + '"><i class="tab_refersh ' + subchildNodesrow.menu_icon + ' firstIcon"></i>' + subchildNodesrow.menu_name + '</a></li>';
                                    }
                                    else
                                    {
                                        _itemHtml += '<li><a class="menuItem menuiframe" data-id="' + subchildNodesrow.menu_id + '" href="' + subchildNodesrow.url_address + '"><i class="tab_refersh ' + subchildNodesrow.menu_icon + ' firstIcon"></i>' + subchildNodesrow.menu_name + '</a></li>';
                                    }
                                    
                                });
                                _itemHtml += '</ul></div>';
                            } else {
                                _itemHtml += '<a class="menuItem menuiframe" data-id="' + subrow.menu_id + '" href="' + subrow.url_address + '"><i class="tab_refersh ' + subrow.menu_icon + ' firstIcon"></i>' + subrow.menu_name + '</a>';
                            }
                            _itemHtml += '</li>';
                        });
                        _itemHtml += '</ul></div>';
                    }
                    _itemHtml += '</li>';
                    
                    
                    menuWidth += 88;
                    if (menuWidth > topMenuWidth)
                    {
                        _html2 += _itemHtml;
                    }
                    else if ((menuWidth + 88) > topMenuWidth) {
                        _html1 = _itemHtml;
                    }
                    else {
                        _html += _itemHtml;
                    }
                }
            });
            
            if (menuWidth > topMenuWidth) {
                _html2 = _html1 + _html2;
                _html += ' <li class="treeview" id="moreMenu"><a ><i class="fa fa-reorder"></i><span>更多应用</span></a></li>';
                flag = true;
                $(".right-bar").hide();
            }
            else {
                $(".right-bar").show();
                _html += _html1;

        }
//        console.log(_html);
            var shortcutmenudata = top.tencheer.data.get(["shortcutMenu"]);
            var shortcutMenuData=eval(shortcutmenudata);
            var _shortcuthtml='';
            $.each(shortcutMenuData, function (i) {
                var shortcutrow = shortcutMenuData[i];
                 _shortcuthtml += '<li><a class="menuItem menuiframe" data-id="' + shortcutrow.MenuId + '" href="' + shortcutrow.UrlAddress + '"><i class="' + shortcutrow.Menu_Icon + ' firstIcon"></i>' + shortcutrow.Menu_Name + '</a></li>';
            });
            _shortcuthtml +='<li><a class="menuItem menuiframe" onclick="shortcuts()"><i class="fa fa-gear firstIcon"></i>快捷设置</a></li>';
//            $("#shortcuts_menu").html(_shortcuthtml);
            _html+='<li class="treeview"><a><i class="fa fa-dropbox" style="font-size:18px"></i><span>快捷导航</span></a>';
            _html+='<div class="popover-menu"><div class="arrow"><em></em><span></span></div>';
            _html+='<ul class="treeview-menu">';
            _html+= _shortcuthtml;
            _html+=' </ul></div></li>';
            
            if (isInit || flag) {
                $("#top-menu").html(_html);
                if (flag) {
                    $('#moreMenu').append('<div class="popover-moreMenu"><div class="arrow"><em></em><span></span></div><div class="title">......更多应用</div><div class="moresubmenu"></div></div>');
                    $('.moresubmenu').html(_html2);
                    //更多应用菜单点击事件
                    $('.moresubmenu > .treeview > a').unbind();
                    $('.moresubmenu > .treeview > a').on('click', function () {
                        $('.moresubmenu > .treeview > a.active').parent().find('.popover-menu').hide();
                        $('.moresubmenu > .treeview > a.active').removeClass('active');
                        var $li = $(this);
                        $li.addClass('active');
                        $li.parent().find('.popover-menu').show();
                    });
                }
                $("#top-menu>.treeview").unbind();
                $('.popover-menu>ul>li').unbind();
                $("#top-menu>.treeview").hover(
                    function () {
                        var $li = $(this);

                        var $moreMenuPopover = $li.find('.popover-moreMenu');
                        $li.addClass('active');
                        if ($moreMenuPopover.length > 0) {
                            $moreMenuPopover.slideDown(150);
                            $($moreMenuPopover.find('.treeview>a')[0]).trigger('click');
                        }
                        else {
                            var $popover = $li.find('.popover-menu');
                            $popover.slideDown(150);
                        }                        
                    },
                    function () {
                        var $li = $(this);
                        var $popover = $li.find('.popover-menu');
                        var $moreMenuPopover = $li.find('.popover-moreMenu');
                        if ($moreMenuPopover.length == 0) {
                            $popover.slideUp(50);
                        }
                        else {
                            $moreMenuPopover.hide();
                        }
                        $li.removeClass('active');
                    });
                    //快捷导航菜单
//                    $(".shurtcut").hover(
//                            function () {
//                                var $li = $(this);
//                                $li.addClass('active');
//                                var $popover = $li.find('.popover-menu');
//                                $popover.slideDown(150);                   
//                            },
//                            function () {
//                                var $li = $(this);
//                                var $popover = $li.find('.popover-menu');
//                                $popover.slideUp(50);
//                                $li.removeClass('active');
//                    });
                $('.popover-menu>ul>li').hover(
                    function () {
                        var $li = $(this);
                        if ($li.parents('.moresubmenu').length == 0)
                        {
                            var windowWidth = $(window).width();
                            var windowHeight = $(window).height();
                            var $popover = $li.find('.popover-menu-sub');
                            var subHeight = $popover.height();
                            if ((windowWidth - $li.offset().left - 154) < 152) {
                                $popover.css("left", "-156px");
                            }
                            if ((subHeight - 10 + $li.offset().top) > windowHeight) {
                                var marginTop = subHeight - 10 + $li.offset().top - windowHeight + 46;
                                $popover.css('margin-top', '-' + marginTop + 'px');
                            }
                            $li.addClass('active');
                            $popover.slideDown(150);
                        }
                    },
                    function () {
                        var $li = $(this);
                        if ($li.parents('.moresubmenu').length == 0) {
                            var $popover = $li.find('.popover-menu-sub');
                            $li.removeClass('active');
                            $popover.css('margin-top', '-46px');
                            $popover.slideUp(50);
                        }
                    });
                $('.menuiframe').unbind();
                $('.menuiframe').on('click', $.tencheertab.addTab);

                $('.moresubmenu .menuTreeItem ').unbind();
                $('.menuTreeItem ').on('click', function () {
                    $('.moresubmenu .popover-menu-sub').slideUp(300);
                    var $this = $(this);
                    if (!$this.hasClass('active')) {
                        var $sub = $(this).parent().find('.popover-menu-sub');
                        $this.addClass('active');
                        $sub.slideDown(300);
                    }
                    else {
                        $this.removeClass('active');
                    }
                });

            }
        },
        indexOut: function () {
            tencheer.dialogConfirm("注：您确定要安全退出本次登录吗?", function (r) {
                if (r) {
                    tencheer.loading({ isShow: true, text: "正在安全退出..." });
                    window.setTimeout(function () {
                        $.ajax({
                            url: contentPath + "/login/login_out",
                            type: "post",
                            dataType: "json",
                            success: function (data) {
                                window.location.href = contentPath + "/login";
                            }
                        });
                    }, 500);
                }
            });
        }
    };
    $(function () {
        tencheer.init({
            "callBack": function () {
                $.tencheerindex.loadMenu(true);
                $.tencheerindex.loadBranch();
                $.tencheertab.init();
                $.tencheerindex.load();
            },
            "themeType": "4"
        });
    });
})(window.jQuery);

//安全退出
function IndexOut() {
    tencheer.dialogConfirm({
        msg: "注：您确定要安全退出本次登录吗？",
        callBack: function (r) {
            if (r) {
                top.tencheer.login_status="login_exit";
                tencheer.loading({ isShow: true, text: "正在安全退出..." });
                window.setTimeout(function () {
                        $.ajax({
                            url: contentPath + "/login/login_out",
                            type: "post",
                            dataType: "json",
                            success: function (data) {
                                top.$.cookie('tencheer_autologin', '', { path: "/", expires: -1 });
                                top.$.cookie('tencheer_username', '', { path: "/", expires: -1 });
                                top.$.cookie('tencheer_password', '', { path: "/", expires: -1 });
                                window.location.href =contentPath + "/login";
                            }
                        });
                    }, 500);
            }
        }
    });
}
//快捷菜单配置
function shortcuts() {

    var url = "/system_manage/shortcut_manage/index";
    tencheer.dialogOpen({
                id: "Form",
                title: '快捷菜单设置',
                url: url,
                width: "500px",
                height: "650px",
                callBack: function (iframeId) {
                    top.frames[iframeId].AcceptClick();                  
                }
            });
    }
//刷新缓存数据
function refershClientData()
{
    tencheer.confirmAjax({
                msg: "注：您确定要进行清空缓存吗？",
                url: '/system_manage/grid_column_manage/ClearRedisCache',
                param: { "system_type":7},
                success: function (data) {
                    tencheer.dialogMsg({ msg:data.message, type: data.type});
                }
            })
    tencheer.init({
            "callBack": function () {
                $.tencheerindex.loadMenu(true);
            }
        });

}
//切换站点
function switchBranch()
{
    var branch_no=$('#branchsite').val();
    var branch_name=$('#branchsite').find("option:selected").text();

    $.ajax({
             url: "/system_manage/main_frame/switchBranch?branch_no="+branch_no+"&branch_name="+branch_name,
             type: "get",
             dataType: "json",
             async: false,
             success: function (data) {
                 top.$.tencheertab.closeAllTab();
             }
         });
}