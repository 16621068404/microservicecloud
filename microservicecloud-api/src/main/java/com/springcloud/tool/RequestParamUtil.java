package com.springcloud.tool;

import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

/**
 * Request获取参数的工具类
 * 
 */
public final class RequestParamUtil {

    /**
     * 构造函数
     */
    private RequestParamUtil() {

    }

    /**
     * 获取指定参数名的字符串值。
     * 
     * @param request JSP Page的Request对象
     * @param name 参数名称
     * @return 参数名的字符串值，如果没有此参数名，则返回null。
     */
    public static String getParameter(HttpServletRequest request, String name) {
        return getParameter(request, name, false);
    }

    /**
     * 获取指定参数名的字符串值。
     * 
     * @param request JSP Page的Request对象
     * @param name 参数名称
     * @param emptyStringsOK 如果emptyStringsOK为TRUE，即使getParameter为null或者为空字符串，也返回getParameter原始值
     * @return 参数名的字符串值，如果没有此参数名，则返回null。
     */
    public static String getParameter(HttpServletRequest request, String name, boolean emptyStringsOK) {
        String temp = request.getParameter(name);
        if (temp != null) {
            if (StringUtil.isEmpty(temp) && !emptyStringsOK) {
                return "";
            } else {
                return temp;
            }
        } else {
            return "";
        }
    }

    /**
     * 获取指定参数名的字符串数组。
     * 
     * @param request JSP Page的Request对象
     * @param name 参数名称
     * @return 不为空并且不为空字符串的字符串数组。
     */
    public static String[] getParameters(HttpServletRequest request, String name) {
        if (name == null) {
            return new String[0];
        }
        String[] paramValues = request.getParameterValues(name);
        if (paramValues == null || paramValues.length == 0) {
            return new String[0];
        } else {
            java.util.ArrayList<String> values = new java.util.ArrayList<String>(paramValues.length);
            for (int i = 0; i < paramValues.length; i++) {
                if (paramValues[i] != null && !StringUtil.isEmpty(paramValues[i])) {
                    values.add(paramValues[i]);
                }
            }
            return (String[])values.toArray(new String[] {});
        }
    }

    /**
     * 获取指定参数名的Boolean参数值。
     * 
     * @param request JSP Page的Request对象
     * @param name 参数名称
     * @return 参数值为true或者on则返回TRUE，否则为False。
     */
    public static boolean getBooleanParameter(HttpServletRequest request, String name) {
        return getBooleanParameter(request, name, false);
    }

    /**
     * 获取指定参数名的Boolean参数值。
     * 
     * @param request JSP Page的Request对象
     * @param name 参数名称
     * @param defaultVal 默认值，参数值不等于true、false、on、off时，返回默认值
     * @return 参数值为true或者on则返回TRUE，否则为False。
     */
    public static boolean getBooleanParameter(HttpServletRequest request, String name, boolean defaultVal) {
        String temp = request.getParameter(name);
        if ("true".equals(temp) || "on".equals(temp) || "1".equals(temp)) {
            return true;
        } else if ("false".equals(temp) || "off".equals(temp) || "0".equals(temp)) {
            return false;
        } else {
            return defaultVal;
        }
    }

    /**
     * 获取指定参数名的Integer参数值。
     * 
     * @param request JSP Page的Request对象
     * @param name 参数名称
     * @param defaultNum 默认值，参数值不等于integer类型或者无法查找到参数名时，返回默认值
     * @return 参数名的Integer值，参数值不等于integer类型或者无法查找到参数名时，返回默认值
     */
    public static int getIntParameter(HttpServletRequest request, String name, int defaultNum) {
        String temp = request.getParameter(name);

        int num = StringUtil.tryParseInteger(temp, defaultNum);
        return num;

    }

    /**
     * 获取指定参数名的Integer数组。
     * 
     * @param request JSP Page的Request对象
     * @param name 参数名称
     * @param defaultNum 默认值，参数值不等于integer类型或者无法查找到参数名时，返回默认值
     * @return int组合
     */
    public static int[] getIntParameters(HttpServletRequest request, String name, int defaultNum) {
        String[] paramValues = request.getParameterValues(name);
        if (paramValues == null || paramValues.length == 0) {
            return new int[0];
        }
        int[] values = new int[paramValues.length];
        for (int i = 0; i < paramValues.length; i++) {
            try {
                values[i] = Integer.parseInt(paramValues[i]);
            } catch (Exception e) {
                values[i] = defaultNum;
            }
        }
        return values;
    }

    /**
     * 获取指定参数名的Double参数值
     * 
     * @param request JSP Page的Request对象
     * @param name 参数名称
     * @param defaultNum 默认值，参数值不等于Double类型或者无法查找到参数名时，返回默认值
     * @return 参数名的Double值，参数值不等于Double类型或者无法查找到参数名时，返回默认值
     */
    public static double getDoubleParameter(HttpServletRequest request, String name, double defaultNum) {
        String temp = request.getParameter(name);
        if (temp != null && !StringUtil.isEmpty(temp)) {
            double num = defaultNum;
            try {
                num = Double.parseDouble(temp);
            } catch (Exception ignored) {
                ignored.printStackTrace();
            }
            return num;
        } else {
            return defaultNum;
        }
    }

    /**
     * 获取指定参数名的long参数值
     * 
     * @param request JSP Page的Request对象
     * @param name 参数名称
     * @param defaultNum 默认值，参数值不等于long类型或者无法查找到参数名时，返回默认值
     * @return 参数名的long值，参数值不等于long类型或者无法查找到参数名时，返回默认值
     */
    public static long getLongParameter(HttpServletRequest request, String name, long defaultNum) {
        String temp = request.getParameter(name);
        if (temp != null && !StringUtil.isEmpty(temp)) {
            long num = defaultNum;
            try {
                num = Long.parseLong(temp);
            } catch (Exception ignored) {
                ignored.printStackTrace();
            }
            return num;
        } else {
            return defaultNum;
        }
    }

    /**
     * 获取指定参数名的long参数值
     * 
     * @param request JSP Page的Request对象
     * @param name 参数名称
     * @param defaultNum 默认值，参数值不等于long类型或者无法查找到参数名时，返回默认值
     * @return long数组
     */
    public static long[] getLongParameters(HttpServletRequest request, String name, long defaultNum) {
        String[] paramValues = request.getParameterValues(name);
        if (paramValues == null || paramValues.length == 0) {
            return new long[0];
        }
        long[] values = new long[paramValues.length];
        for (int i = 0; i < paramValues.length; i++) {
            try {
                values[i] = Long.parseLong(paramValues[i]);
            } catch (Exception e) {
                values[i] = defaultNum;
            }
        }
        return values;
    }

    /**
     * 获取需要解码的指定参数名的字符串值。
     * 
     * @param request JSP Page的Request对象
     * @param name 参数名称
     * @return 参数名的字符串值，如果没有此参数名，则返回空字符串。
     * @author 袁宗迪
     * @date 2014-11-14
     */
    public static String getDecodeParameter(HttpServletRequest request, String name) {
        try {
            return new String(getParameter(request, name, false).getBytes("ISO-8859-1"), "UTF-8");
        } catch (Exception ex) {

            return "";
        }
    }

    /**
     * 对URL参数进行编码
     * 
     * @param value 待编码值
     * @return 编码后的值
     */
    public static String encodeURIComponent(String value) {
        try {
            if (StringUtil.isEmpty(value)) {
                return "";
            } else {
                return URLEncoder.encode(value, "UTF-8");
            }
        } catch (Exception ex) {
            return "";
        }

    }
    
    /** 
     * 从request中获得参数Map，并返回可读的Map 
     *  
     * @param request 
     * @return 
     */  
    @SuppressWarnings({ "unchecked", "rawtypes" })  
    public static Map<String, Object> getParameterMap(HttpServletRequest request) {  
        // 参数Map  
        Map properties = request.getParameterMap();  
        // 返回值Map  
        Map returnMap = new HashMap();  
        Iterator entries = properties.entrySet().iterator();  
        Map.Entry entry;  
        String name = "";  
        String value = "";  
        while (entries.hasNext()) {  
            entry = (Map.Entry) entries.next();  
            name = (String) entry.getKey();  
            Object valueObj = entry.getValue();  
            if(null == valueObj){  
                value = "";  
            }else if(valueObj instanceof String[]){  
                String[] values = (String[])valueObj;  
                for(int i=0;i<values.length;i++){  
                    value = values[i] + ",";  
                }  
                value = value.substring(0, value.length()-1);  
            }else{  
                value = valueObj.toString();  
            }  
            returnMap.put(name, value);  
        }  
        return returnMap;  
    }  
}
