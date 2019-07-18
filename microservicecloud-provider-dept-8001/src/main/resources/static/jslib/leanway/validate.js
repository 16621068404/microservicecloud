// ====================================================================
com.leanway.reg = {};
com.leanway.reg.fun = function(regx, msg) {
	var reg = {
		regexp : regx,
		message : msg
	}
	return reg;
}

com.leanway.reg.decimal = {}
com.leanway.reg.msg = {};

// 固定电话
com.leanway.reg.decimal.phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
com.leanway.reg.msg.phone = "雇员电话如：010-66886688或者11位的手机号码";

// 年龄
com.leanway.reg.decimal.age = /^[0-9]{1,3}$/;
com.leanway.reg.msg.age = "请输入正确的年龄";

// 手机
com.leanway.reg.decimal.mobile = /^\d{11,12}$/;
com.leanway.reg.msg.mobile = "请输入正确的手机号";

// 身份证
com.leanway.reg.decimal.idcard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
com.leanway.reg.msg.idcard = "请输入合法的身份证";

// 邮箱
com.leanway.reg.decimal.email = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
com.leanway.reg.msg.email = "请输入正确的邮箱";

// QQ
com.leanway.reg.decimal.qq = /^[1-9][0-9]{4,}$/;
com.leanway.reg.msg.qq = "请输入正确的QQ";

// 雇员性质
com.leanway.reg.decimal.type = /^[0-9]{1,2}$/;
com.leanway.reg.msg.type = "请输入0~99数字";

/**
 * 正整数.
 *
 * @param value
 * @param element
 * @returns
 */
com.leanway.positiveInteger = function(value) {
	var decimal = /^[1-9]\d*$/;
	return (decimal.test(value));
}

/**
 * 数字
 *
 * @param value
 * @param element
 * @returns
 */
com.leanway.numberDeleteNull = function(value) {
	var decimal = /^\d*$/;
	return (decimal.test(value.trim()));
}
/**
 * 手机
 *
 * @param value
 * @param element
 * @returns
 */
com.leanway.mobile = function(value) {
	var decimal = /^\d{11,12}$/;
	return (decimal.test(value));
}
/**
 * 中文、字母和数字
 *
 * @param value
 * @param element
 * @returns
 */
com.leanway.correctName = function(value) {
	var decimal = /^[a-z-A-Z0-9\u4E00-\u9FA5]+$/;
	return (decimal.test(value));
}
/**
 * 正确的字典编码（只能由字母和数字组成）
 *
 * @param value
 * @param element
 * @returns
 */
com.leanway.corrDictCd = function(value) {
	var decimal = /^[a-zA-Z0-9]+$/;
	return (decimal.test(value));
}
/**
 * 正确的日期格式
 *
 * @param value
 * @param element
 * @returns
 */
com.leanway.corrDate = function(value) {
	var decimal = /((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/ig;
	return (decimal.test(value));
}
/**
 * 正整数
 *
 * @param value
 * @param element
 * @returns
 */
com.leanway.folatAndInt = function(value) {
	var decimal = /^\d+|\d+\.\d+$/;
	return (decimal.test(value));
}
/**
 * 1-10位数字
 *
 * @param value
 * @param element
 * @returns
 */
com.leanway.numberNotNull = function(value) {
	var decimal = /^[0-9]{1,10}$/;
	return (decimal.test(value));
}
/**
 * 0-10位数字
 *
 * @param value
 * @param element
 * @returns
 */
com.leanway.numberNull = function(value) {
	var decimal = /^[0-9]{0,10}$/;
	return decimal.test(value);
}
/**
 * 浮点数
 */
com.leanway.floatAndInt = function(value) {
	var decimal = /^[0-9]{0,}\.{0,1}[0-9]{0,}$/;
	return (decimal.test(value));
}
/**
 * 正确的名称（只能由中文、字母、·和数字组成）
 *
 * @param value
 * @param element
 * @returns
 */
com.leanway.correctBrandName = function(value) {
	var decimal = /^[a-zA-Z0-9\u4E00-\u9FA5\s]+$/;
	return (decimal.test(value));
}

/**
 * 中文、字母和数字(100以内)
 *
 * @param value
 * @param element
 * @returns
 */
com.leanway.correctName = function(value) {
	var decimal = /^[a-zA-Z0-9 \u4E00-\u9FA5]{0,100}$/;
	return (decimal.test(value));
}
/**
 * 中文、字母和数字(100以内)
 *
 * @param value
 * @param element
 * @returns
 */
com.leanway.correctNameNotNull = function(value) {
	var decimal = /^[a-zA-Z0-9 \u4E00-\u9FA5]{1,100}$/;
	return (decimal.test(value));
}
/**
 * 20位以内的数组或字母组合
 *
 * @param value
 * @param element
 * @returns
 */
com.leanway.productBathNo = function(value) {
	var decimal = /^[a-zA-Z0-9]{1,20}$/;
	return (decimal.test(value));
}
/**
 * 汉字
 *
 * @param value
 * @param element
 * @returns
 */
com.leanway.china = function(value) {
	var decimal = /^[\u4e00-\u9fa5]{0,}$/;
	return (decimal.test(value));
}

//请输入正确的资源数
com.leanway.reg.decimal.resourcescount = /^[1-9]\d*$/;
com.leanway.reg.msg.resourcescount = "请输入正整数";
com.leanway.reg.decimal.managerunit = /^[0-9]\d*$/;
com.leanway.reg.msg.managerunit = "请输入数字";
com.leanway.reg.decimal.prefix=/^[A-Z]+$|^[a-z]+$/;
com.leanway.reg.msg.prefix="请输入正确的格式";
com.leanway.reg.decimal.time = /^[0-9]{0,}\.{0,1}[0-9]{0,}$/;
com.leanway.reg.msg.time = "请输入数字或小数点";
com.leanway.reg.decimal.amount = /^[0-9]{1,10}$/;
com.leanway.reg.msg.amount = "请输入整数";