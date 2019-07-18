/**
 * 导入js文件,路径和引用页面一致
 */
var loader = {};
// 获取XMLHttpRequest对象(提供客户端同http服务器通讯的协议)
loader.getXmlHttpRequest = function() {
	if (window.XMLHttpRequest) // 除了IE外的其它浏览器
		return new XMLHttpRequest();
	else if (window.ActiveXObject) // IE
		return new ActiveXObject("MsXml2.XmlHttp");
},
// 导入内容
loader.includeJsText = function(rootObject, jsText) {
	if (rootObject != null) {
		var oScript = document.createElement("script");
		oScript.type = "text/javascript";
		oScript.text = jsText;
		rootObject.appendChild(oScript);
	}
},
// 导入文件
loader.includeJsSrc = function(rootObject, fileUrl) {
	if (rootObject != null) {
		var oScript = document.createElement("script");
		oScript.type = "text/javascript";
		oScript.src = fileUrl;
		rootObject.appendChild(oScript);
	}
},
// 同步加载
loader.addJs = function(url) {
	var rootObject = document.getElementsByTagName("head")[0];
	var oXmlHttp = loader.getXmlHttpRequest();
	oXmlHttp.onreadystatechange = function() {// 其实当在第二次调用导入js时,因为在浏览器当中存在这个*.js文件了,它就不在访问服务器,也就不在执行这个方法了,这个方法也只有设置成异步时才用到
		if (oXmlHttp.readyState == 4) { // 当执行完成以后(返回了响应)所要执行的
			if (oXmlHttp.status == 200 || oXmlHttp.status == 304) { // 200有读取对应的url文件,404表示不存在这个文件
				loader.includeJsSrc(rootObject, url);
			} else {
				alert('XML request error: ' + oXmlHttp.statusText + ' ('
						+ oXmlHttp.status + ')');
			}
		}
	}
	// 1.True 表示脚本会在 send()
	// 方法之后继续执行，而不等待来自服务器的响应,并且在open()方法当中有调用到onreadystatechange()这个方法。通过把该参数设置为
	// "false"，可以省去额外的 onreadystatechange 代码,它表示服务器返回响应后才执行send()后面的方法.
	// 2.同步执行oXmlHttp.send()方法后oXmlHttp.responseText有返回对应的内容,而异步还是为空,只有在oXmlHttp.readyState
	// == 4时才有内容,反正同步的在oXmlHttp.send()后的操作就相当于oXmlHttp.readyState ==
	// 4下的操作,它相当于只有了这一种状态.
	oXmlHttp.open('GET', url, false);
	// url为js文件时,ie会自动生成'<script_src="*.js"_type="text/javascript"></script>',ff不会
	oXmlHttp.send(null);
	loader.includeJsText(rootObject, oXmlHttp.responseText);
}
loader.addJs("../plugins/jQuery/jQuery-2.1.4.min.js");
loader.addJs("../bootstrap/js/bootstrap.min.js");
loader.addJs("../plugins/bootstrap-validator/js/bootstrapValidator.min.js");
loader.addJs("../plugins/bootstrap-validator/js/language/zh_CN.js");
loader.addJs("../plugins/slimScroll/jquery.slimscroll.min.js");
loader.addJs("../plugins/fastclick/fastclick.js");
loader.addJs("../plugins/datetimepicker/jquery.datetimepicker.js");
loader.addJs("../plugins/select2/select2.full.min.js");
loader.addJs("../plugins/select2/i18n/zh-CN.js");
loader.addJs("../plugins/datatables/jquery.dataTables.js");
loader.addJs("../plugins/datatables/dataTables.bootstrap.js");
loader.addJs("../dist/js/app.min.js");
loader.addJs("../plugins/leanway/framework.js");
loader.addJs("../plugins/leanway/validate.js");
loader.addJs("../plugins/leanway/tools.js");
