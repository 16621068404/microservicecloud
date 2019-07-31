package com.springcloud.tool;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 简单工具类
 * @author 冯光明
 *
 */
public class StringUtil {

	private static final Pattern INT_PATTERN = Pattern.compile("[0-9]+");

	private static final String TIME_PATTERN = "yyyy-MM-dd HH:mm:ss";

	private static Class<StringUtil> clazz = StringUtil.class;

	/**
	 * 去除Xml中的回车和空格
	 * @param string
	 */
	public static String replaceBlank(String string) {
		Pattern p = Pattern.compile("\\s*|\t|\r|\n");
		Matcher m = p.matcher(string);
		String after = m.replaceAll("");
		return after;
	}

	public static String emptyAsNull(String value) {
		if (value == null) {
			return value;
		}
		if (value.trim().equals("")) {
			return null;
		} else {
			return value;
		}
	}




	/**
	 * 功能描述: 判断字符串是否是空或空串
	 * 
	 * @param str
	 * @return 是否是空或空串
	 */
	public static boolean isNullOrBlank(String str) {
		return str == null || "".equals(str);
	}

	/**
	 * 功能描述: 判断字符串是否是整数字符串
	 * 
	 * @param str
	 * @return 是否是整数字符串
	 */
	public static boolean isIntStr(String str) {
		if (null == str) {
			return false;
		}
		return INT_PATTERN.matcher(str).matches();
	}

	/**
	 * 功能描述: 判断字符串是否是整数字符串
	 * 
	 * @param str
	 * @return 是否是非空整数字符串
	 */
	public static boolean isNotEmptyInteger(String str) {
		if (null == str) {
			return false;
		}
		return INT_PATTERN.matcher(str).matches();
	}

	/**
	 * 功能描述: 判断对象为大于等于0的整数
	 * 
	 * @param str
	 * @return 是否是非空整数字符串
	 */
	public static boolean isNotEmptyIntegerObj(Object obj) {
		if (StringUtil.isEmpty(obj)) {
			return false;
		}
		// -1为不能转化整数的字符串设的默认值，此方法只判断大于等于0的整数，可为-1
		if (toInteger(obj.toString(), -1) >= 0) {
			return true;
		} else {
			return false;
		}
	}

	
	/**
	 * 将传入对象转换为字符串
	 * @param obj
	 * @return 字符串，对象为null时，返回""
	 */
	public static String toString(Object obj) {
		String str = "";
		if (obj != null) {
			str = String.valueOf(obj);
		}
		return str;
	}

	/**
	 * 将字符串转化整数
	 * 
	 * @param integer
	 *            需验证的字符串
	 * @param def
	 *            验证不成功的默认值
	 * @return
	 */
	public static int toInteger(String integer, int def) {
		int ret;
		try {
			ret = Integer.parseInt(integer);
		} catch (NumberFormatException nfx) {
			ret = def;
		}
		return ret;
	}

	/**
	 * 功能描述: 根据时间对象取得格式化的字符串
	 * 
	 * @param t：时间对象
	 * @return 时间字符串
	 */
	public static String getTimestampToStr(Timestamp t) {
		SimpleDateFormat format = new SimpleDateFormat(TIME_PATTERN);
		return format.format(t);
	}

	/**
	 * 功能描述：获取当前时间
	 * 
	 * @return 返回值
	 */
	public static String getNowTime() {
		String date = new SimpleDateFormat(TIME_PATTERN).format(new Date()).toString();
		return date;
	}

	public static String getNowTimeM() {
		String date = new SimpleDateFormat("yyMMddHHmmssSSS").format(new Date()).toString();
		return date;
	}

	/**
	 * 判断str是否为空
	 * 
	 * @param str
	 * @return
	 * @return boolean
	 */
	public static boolean isEmpty(Object str) {
		if (str == null || "null".equalsIgnoreCase(str.toString())) {
			return true;
		} else if (str instanceof String) {
			if (((String) str).isEmpty()) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 判断str是否为空
	 * 
	 * @param str
	 * @return boolean
	 */
	public static boolean isNotEmpty(Object str) {
		return !isEmpty(str);
	}

	/**
	 * 将 数组转为 用逗号分隔的字符串
	 * 
	 * @param values
	 *            Object[]
	 * @return 用逗号分隔的字符串，如：'1','2','3','4'
	 */
	public static String toStr(Object[] values) {
		StringBuffer str = new StringBuffer();
		str.append("'" + values[0] + "'");
		for (int i = 1; i < values.length; i++) {
			str.append(",'" + values[i] + "'");
		}
		return str.toString();
	}

	/**
	 * 将 List转为 用逗号分隔的字符串
	 * 
	 * @param values
	 *            List
	 * @return 用逗号分隔的字符串，如：'1','2','3','4'
	 */
	public static String toStr(List<?> values) {
		return toStr(values.toArray());
	}

	/**
	 * 将 Map转为 用逗号分隔的字符串
	 * @return 用逗号分隔的字符串，如：'1','2','3','4'
	 */
	public static String toStr(Map<?, ?> values) {
		return toStr(values.values().toArray());
	}

	public static String getRandoms(int size) {
		String sRand = "";
		Random random = new Random();
		for (int i = 0; i < 5; i++) {

			String rand = String.valueOf(random.nextInt(10));
			sRand += rand;
		}
		return sRand;
	}

	/**
	 * 将字符串转换成Integer型数据。如果转换失败，则返回默认值
	 * 
	 * @param value
	 *            需要转换的字符串内容
	 * @param defaultValue
	 *            默认Integer值
	 * @return Integer数据
	 */
	public static int tryParseInteger(String value, int defaultValue) {
		try {
			int result = Integer.parseInt(value);
			return result;
		} catch (Exception ex) {
			// ex.printStackTrace();
			return defaultValue;
		}
	}

	/**
	 * 字符串转换成Date型数据，如果转换失败，则返回默认值
	 * 
	 * @param value
	 *            需要转换的字符串内容
	 * @param dateFormatString
	 *            字符串格式内容
	 * @param defaultValue
	 *            默认Date值
	 * @return Date值
	 */
	public static java.util.Date tryParseDate(String value, String dateFormatString, java.util.Date defaultValue) {
		try {
			SimpleDateFormat sdf = new SimpleDateFormat(dateFormatString);
			java.util.Date result = sdf.parse(value);
			return result;
		} catch (Exception ex) {
			return defaultValue;
		}
	}

	/**
	 *  将字符串转换成Double型数据。如果转换失败，则返回默认值
	 *  @param value
	 */
	public static double tryParseDouble(String value, double defaultValue) {
		try {
			double result = Double.parseDouble(value);
			return result;
		} catch (Exception ex) {
			// ex.printStackTrace();
			return defaultValue;
		}
	}

	/**
	 * 描述：适用于aa,bb,cc, 转换成'aa','bb','cc'
	 * 参数： ids
	 * 时间：2019年7月15日17:22:44
	 * 作者：冯光明
	 */
	public static String conversionDataForIn(String ids) {
		if (isEmpty(ids)) {
			return "";
		}
		StringBuilder argFieldCondition = new StringBuilder("");
		String[] tempStr = ids.split(",");
		// 异常情况
		if (tempStr.length < 0) {
			return "";
		}
		for (int i = 0; i < tempStr.length; i++) {
			if (!StringUtil.isEmpty(tempStr[i])) {
				argFieldCondition.append("'" + tempStr[i] + "',");
			}
		}
		if (argFieldCondition != null && argFieldCondition.length() > 0 && !"".equals(argFieldCondition.toString())) {
			argFieldCondition.deleteCharAt(argFieldCondition.length() - 1);
		}
		return argFieldCondition.toString();
	}

	
	/**
	 * 对字符进行utf-8解码
	 * @param s
	 */
	public static String utf8Dcode(String s) {
		String str = null;
		try {
			if (s != null && s.length() != 0)
				str = URLDecoder.decode(s, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return str;
	}

	/**
	 * 对字符进行gbk解码
	 * 
	 */
	public static String gbkDecode(String s) {
		String str = null;
		try {
			if (s != null && s.length() != 0)
				str = URLDecoder.decode(s, "GBK");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return str;
	}

	
	/**
	 * 判断字符串是否为数字
	 * @return
	 */
	public static boolean isNumeric(String str) {
		Pattern pattern = Pattern.compile("[0-9]*");
		Matcher isNum = pattern.matcher(str);
		if (!isNum.matches()) {
			return false;
		}
		return true;
	}

	
	/**
	 * 字符串去掉特殊字符
	 * 
	 * @param source
	 * @param element
	 * @return
	 */
	public static String trimFirstAndLastChar(String source, char element) {
		boolean beginIndexFlag = true;
		boolean endIndexFlag = true;
		do {
			int beginIndex = source.indexOf(element) == 0 ? 1 : 0;
			int endIndex = source.lastIndexOf(element) + 1 == source.length() ? source.lastIndexOf(element)
					: source.length();
			source = source.substring(beginIndex, endIndex);
			beginIndexFlag = (source.indexOf(element) == 0);
			endIndexFlag = (source.lastIndexOf(element) + 1 == source.length());
		} while (beginIndexFlag || endIndexFlag);
		return source;
	}

	
	/**
	 * 
	 * 将英文逗号替换为中文逗号
	 * 
	 */
	public static String transferComma(String string) {
		String comma = "，";
		string = string.replaceAll(",", comma);
		System.out.println(string);
		return string;
	}

	
	



	

}
