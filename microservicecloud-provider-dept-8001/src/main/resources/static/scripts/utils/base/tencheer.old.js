/*!
 * 版 本 TencheerADMS V6.1.1.7 (http://www.tencheer.cn)
 * Copyright 2011-2016 Tencheer, Inc.
 *兼容之前版本的js,不建议使用这些
 * 腾之毅
 */
(function ($) {
    $.fn.ComboBox = function (options) {
        options.maxHeight = options.height;
        return $(this).comboBox(options);
    }
    $.fn.ComboBoxSetValue = function (value) {
        return $(this).comboBoxSetValue(value);
    }
    $.fn.ComboBoxTree = function (options) {
        options.maxHeight = options.height;
        return $(this).comboBoxTree(options);
    }
    $.fn.ComboBoxTreeSetValue = function (value) {
        return $(this).comboBoxTreeSetValue(value);
    }
    $.fn.GetWebControls = function (keyValue) {
        return $(this).getWebControls(keyValue);
    };
    $.fn.SetWebControls = function (data) {
        $(this).setWebControls(data);
    }
//    $.fn.Contextmenu = $.fn.contextmenu;
    $.fn.LeftListShowOfemail = $.fn.leftListShowOfemail;

    $.SaveForm = function (options) {
        tencheer.saveForm(options);
    }
    $.SetForm = function (options) {
        tencheer.setForm(options);
    }
    $.RemoveForm = function (options) {
        tencheer.removeForm(options);
    }
    $.ConfirmAjax = function (options) {
        tencheer.confirmAjax(options);
    }
    $.ExistField = function (controlId, url, param) {
        tencheer.existField(controlId, url, param);
    }
    $.getDataForm = function (options) {
        tencheer.getDataForm(options);
    }
})(window.jQuery);
Loading = function (bool, text) {
    tencheer.loading({ isShow: bool, text: text });
}
tabiframeId = function () {
    return tencheer.tabiframeId();
}
dialogTop = function (msg, type) {
    tencheer.dialogTop({ msg: msg, type: type });
}
dialogAlert = function (msg, type) {
    tencheer.dialogAlert({ msg: msg, type: type });
}
dialogMsg = function (msg, type) {
    tencheer.dialogMsg({ msg: msg, type: type });
}
dialogOpen = function (options) {
    tencheer.dialogOpen(options);
}
dialogContent = function (options) {
    tencheer.dialogContent(options);
}
dialogConfirm = function (msg, callBack) {
    tencheer.dialogConfirm({ msg: msg, callBack: callBack });
}
dialogClose = function () {
    tencheer.dialogClose();
}
reload = function () {
    location.reload();
    return false;
}
newGuid = function () {
    return tencheer.newGuid();
}
formatDate = function (v, format) {
    return tencheer.formatDate(v, format);
};
toDecimal = function (num) {
    return tencheer.toDecimal(num);
}
request = function (keyValue) {
    return tencheer.request(keyValue);
}
changeUrlParam = function (url, key, value) {
    return tencheer.changeUrlParam(url, key, value);
}
$.currentIframe = function () {
    return tencheer.currentIframe();
}
$.isbrowsername = function () {
    return tencheer.isbrowsername();
}
$.download = function (url, data, method) {
    tencheer.downFile({ url: url, data: data, method: method });
};
$.standTabchange = function (object, forid) {
    tencheer.changeStandTab({ obj: object, id: forid });
}
$.isNullOrEmpty = function (obj) {
    return tencheer.isNullOrEmpty(obj);
}
IsNumber = function (obj) {
    return tencheer.isNumber(obj);
}
IsMoney = function (obj) {
    return tencheer.isMoney(obj);
}
$.arrayClone = function (data) {
    return tencheer.arrayCopy(data);
}
$.windowWidth = function () {
    return $(window).width();
}
$.windowHeight = function () {
    return $(window).height();
}
checkedArray = function (id) {
    return tencheer.checkedArray(id);
}
checkedRow = function (id) {
    return tencheer.checkedRow(id);
}


$(function () {
    $(".ui-filter-text").click(function () {
        if ($(this).next('.ui-filter-list').is(":hidden")) {
            $(this).css('border-bottom-color', '#fff');
            $(".ui-filter-list").slideDown(10);
            $(this).addClass("active")
        } else {
            $(this).css('border-bottom-color', '#ccc');
            $(".ui-filter-list").slideUp(10);
            $(this).removeClass("active")
        }
    });
    $(".profile-nav li").click(function () {
        $(".profile-nav li").removeClass("active");
        $(".profile-nav li").removeClass("hover");
        $(this).addClass("active");
    }).hover(function () {
        if (!$(this).hasClass("active")) {
            $(this).addClass("hover");
        }
    }, function () {
        $(this).removeClass("hover");
    });
});


