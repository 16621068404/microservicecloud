package com.springcloud.tool;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import org.apache.commons.lang.StringUtils;


/**
 * 日期工具类 <功能描述>
 * 简单工具类
 * @author 冯光明
 */
public class DateUtils {

	public static final String DATE_FORMAT = "yyyy-MM-dd";
	public static final String DATE_HOUR_FORMAT = "yyyy-MM-dd HH";
	public static final String DATE_MIN_FORMAT = "yyyy-MM-dd HH:mm";
	public static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

	public static final String MONDAY = "MONDAY";
	public static final String TUESDAY = "TUESDAY";
	public static final String WEDNESDAY = "WEDNESDAY";
	public static final String THURSDAY = "THURSDAY";
	public static final String FRIDAY = "FRIDAY";
	public static final String SATURDAY = "SATURDAY";
	public static final String SUNDAY = "SUNDAY";

	/**
	 * 返回星期几,大写英文
	 * 
	 * @param date
	 * @return 星期几,大写英文
	 * @throws Exception(error字符串)
	 */
	public static String findWeekdayName(Date date) throws Exception {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		switch (cal.get(Calendar.DAY_OF_WEEK)) {
		case 1: {
			return SUNDAY;
		}
		case 2: {
			return MONDAY;
		}
		case 3: {
			return TUESDAY;
		}
		case 4: {
			return WEDNESDAY;
		}
		case 5: {
			return THURSDAY;
		}
		case 6: {
			return FRIDAY;
		}
		case 7: {
			return SATURDAY;
		}
		default:
			throw new RuntimeException("error");
		}
	}

	/**
	 * 判断是否为周末
	 * 
	 * @param date
	 * @return [true|false]
	 * @throws Exception(error字符串)
	 */
	public static boolean isWeekendDate(Date date) throws Exception {
		return SATURDAY.equals(findWeekdayName(date)) || SUNDAY.equals(findWeekdayName(date));
	}

	/**
	 * 返回闭合区间中的周末和非周末的列表
	 * 
	 * @param startDate
	 * @param endDate
	 * @return Map<String,List<Date>>[workdayList|weekdayList]
	 * @throws Exception
	 */
	public static Map<String, List<Date>> findWeekend(Date startDate, Date endDate) throws Exception {
		Map<String, List<Date>> resultMap = new HashMap<String, List<Date>>();
		Calendar calStart = Calendar.getInstance();
		calStart.setTime(startDate);
		Calendar calEnd = Calendar.getInstance();
		calEnd.setTime(endDate);
		List<Date> weekendList = new ArrayList<Date>();
		List<Date> workdayList = new ArrayList<Date>();
		for (int i = 0; i < getDayDif(startDate, endDate); i++) {
			calStart.add(Calendar.DAY_OF_MONTH, i);
			if (isWeekendDate(calStart.getTime())) {
				weekendList.add(calStart.getTime());
			} else {
				workdayList.add(calStart.getTime());
			}
		}
		resultMap.put("workday", workdayList);
		resultMap.put("weekend", weekendList);
		return resultMap;
	}

	/**
	 * 判断两个日期是否为同一天 <功能描述>
	 * 
	 * @param firstDate
	 * @param secondDate
	 * @return
	 */
	public static boolean isSameDay(Date firstDate, Date secondDate) {
		boolean isFlag = false;
		Calendar calFirst = Calendar.getInstance();
		calFirst.setTime(firstDate);
		int firstY = calFirst.get(Calendar.YEAR);
		int firstM = calFirst.get(Calendar.MONTH);
		int firstD = calFirst.get(Calendar.DAY_OF_MONTH);
		Calendar calSecond = Calendar.getInstance();
		calSecond.setTime(secondDate);
		int secondY = calSecond.get(Calendar.YEAR);
		int secondM = calSecond.get(Calendar.MONTH);
		int secondD = calSecond.get(Calendar.DAY_OF_MONTH);
		if (firstY == secondY && firstM == secondM && firstD == secondD) {
			isFlag = true;
		}
		return isFlag;
	}

	/**
	 * 获取当前月份 <功能描述>
	 * 
	 * @param date
	 * @return
	 */
	public static int getMonth(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		return cal.get(Calendar.MONTH) + 1;
	}

	/**
	 * 获取当前年份 <功能描述>
	 * 
	 * @param date
	 * @return
	 */
	public static int getYear(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		return cal.get(Calendar.YEAR);
	}

	/**
	 * 
	 * @param date
	 * @return
	 */
	public static Map<String, List<Date>> findWeekDayMap(Date startDate, Date endDate) throws Exception {
		Map<String, List<Date>> resultMap = new HashMap<String, List<Date>>();
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(startDate);
		List<Date> mondayList = new ArrayList<Date>();
		List<Date> tuesdayList = new ArrayList<Date>();
		List<Date> wednesdayList = new ArrayList<Date>();
		List<Date> thursdaydayList = new ArrayList<Date>();
		List<Date> fridayList = new ArrayList<Date>();
		List<Date> saturdayList = new ArrayList<Date>();
		List<Date> sundayList = new ArrayList<Date>();
		Date date = null;
		for (int i = 0; i < getDayDif(startDate, endDate); i++) {
			calendar.add(Calendar.DAY_OF_MONTH, i);
			date = calendar.getTime();
			switch (getWeekdayName(date)) {
			case MONDAY: {
				mondayList.add(date);
				break;
			}
			case TUESDAY: {
				tuesdayList.add(date);
				break;
			}
			case WEDNESDAY: {
				wednesdayList.add(date);
				break;
			}
			case THURSDAY: {
				thursdaydayList.add(date);
				break;
			}
			case FRIDAY: {
				fridayList.add(date);
				break;
			}
			case SATURDAY: {
				saturdayList.add(date);
				break;
			}
			case SUNDAY: {
				sundayList.add(date);
				break;
			}
			}
		}
		resultMap.put("monday", mondayList);
		resultMap.put("tuesday", tuesdayList);
		resultMap.put("wednesday", wednesdayList);
		resultMap.put("thursdayday", thursdaydayList);
		resultMap.put("friday", fridayList);
		resultMap.put("saturday", saturdayList);
		resultMap.put("sunday", sundayList);
		return resultMap;
	}

	/**
	 * 获取時間的星期數 例如2016-5-13 是星期五 返回得到的是星期數
	 * 
	 * @param date
	 * @return
	 */
	public static String getWeekdayName(Date date) throws Exception {
		if (null != date) {
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(date);
			switch (calendar.get(Calendar.DAY_OF_WEEK)) {
			case 1: {
				return SUNDAY;
			}
			case 2: {
				return MONDAY;
			}
			case 3: {
				return TUESDAY;
			}
			case 4: {
				return WEDNESDAY;
			}
			case 5: {
				return THURSDAY;
			}
			case 6: {
				return FRIDAY;
			}
			case 7: {
				return SATURDAY;
			}
			}
		}
		return null;

	}

	/**
	 * 获取两个日期之间的年份差 <功能描述>
	 * 
	 * @param start
	 * @param end
	 * @return
	 */
	public static int getYearDif(Date start, Date end) {
		// 第一个日期
		Calendar startCalendar = Calendar.getInstance();
		startCalendar.setTime(start);
		// 第二个日期
		Calendar endCalendar = Calendar.getInstance();
		endCalendar.setTime(end);
		// 第一个日期的年
		int year = startCalendar.get(Calendar.YEAR);
		// 第二个日期的年
		int year1 = endCalendar.get(Calendar.YEAR);
		return year1 - year;
	}

	/**
	 * 获取两个日期之间的月份差 <功能描述>
	 * 
	 * @param start
	 * @param end
	 * @return
	 */
	public static int getMonthDif(Date start, Date end) {
		// 第一个日期
		Calendar startCalendar = Calendar.getInstance();
		startCalendar.setTime(start);
		// 第二个日期
		Calendar endCalendar = Calendar.getInstance();
		endCalendar.setTime(end);
		// 第一个日期的年、月
		int year = startCalendar.get(Calendar.YEAR);
		int month = startCalendar.get(Calendar.MONTH);
		// 第二个日期的年、月
		int year1 = endCalendar.get(Calendar.YEAR);
		int month1 = endCalendar.get(Calendar.MONTH);

		int result;
		if (month1 > month) {
			result = 12 * (year1 - year) + (month1 - month);
		} else if (month1 < month) {
			result = 12 * (year1 - year - 1) + (12 - month + month1);
		} else {
			result = 12 * (year1 - year);
		}

		/*
		 * int day1 = startCalendar.getTime().getDate(); int day2 =
		 * endCalendar.getTime().getDate(); // 两个月之间的天数差，用于判断是否大于28天 int dayDif=0;
		 * if(day2>day1) { dayDif = day2-day1; } else { dayDif =
		 * 30*(month1-month-1)-day1+day2; } if(dayDif>=28){ result= result+1; }
		 */
		/*
		 * if(year==year1){ result=month1-month;//两个日期相差几个月，即月份差 }else{
		 * result=12*(year1-year)+month1-month;//两个日期相差几个月，即月份差 }
		 */
		return result;
	}

	/**
	 * 获取两个日期之间的天数差 <功能描述>
	 * 
	 * @param start
	 * @param end
	 * @return
	 */
	public static int getDayDif(Date start, Date end) {
		// 第一个日期
		Calendar startCalendar = Calendar.getInstance();
		startCalendar.setTime(start);
		// 第二个日期
		Calendar endCalendar = Calendar.getInstance();
		endCalendar.setTime(end);
		long time1 = startCalendar.getTimeInMillis();
		long time2 = endCalendar.getTimeInMillis();
		long between_days = (time2 - time1) / (1000 * 3600 * 24);
		return Integer.parseInt(String.valueOf(between_days));
	}
	
	  public static void daysOfTwo_1() throws ParseException {
	        SimpleDateFormat sdf=new SimpleDateFormat(DATE_TIME_FORMAT);
	        //跨年的情况会出现问题哦
	        //如果时间为：2016-03-18 11:59:59 和 2016-03-19 00:00:01的话差值为 1
	        Date oDate=sdf.parse("2018-05-14 07:00:00");
	        Date fDate=sdf.parse("2018-05-13 08:00:00");
	        Calendar aCalendar = Calendar.getInstance();
	        aCalendar.setTime(fDate);
	        int day1 = aCalendar.get(Calendar.DAY_OF_YEAR);
	        aCalendar.setTime(oDate);
	        int day2 = aCalendar.get(Calendar.DAY_OF_YEAR);
	        System.out.println(day1);
	        System.out.println(day2);
	        int days=day2-day1;
	        System.out.print(days);
	    }
	
	

	/**
	 * 根据日期获取季度 <功能描述>
	 * 
	 * @param date
	 *            日期
	 * @return
	 */
	public static int getQuarter(Date date) {
		int season = 0;
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		int month = c.get(Calendar.MONTH);
		switch (month) {
		case Calendar.JANUARY:
		case Calendar.FEBRUARY:
		case Calendar.MARCH:
			season = 1;
			break;
		case Calendar.APRIL:
		case Calendar.MAY:
		case Calendar.JUNE:
			season = 2;
			break;
		case Calendar.JULY:
		case Calendar.AUGUST:
		case Calendar.SEPTEMBER:
			season = 3;
			break;
		case Calendar.OCTOBER:
		case Calendar.NOVEMBER:
		case Calendar.DECEMBER:
			season = 4;
			break;
		default:
			break;
		}
		return season;
	}

	/**
	 * 字符串型日期转Date型日期
	 * 
	 * @param date
	 * @return
	 */
	public static Date string2Date(String date) {
		SimpleDateFormat sdf = new SimpleDateFormat(DateUtils.DATE_FORMAT);
		Date result = null;
		try {
			result = sdf.parse(date);
		} catch (Exception e) {
		} finally {
		}
		return result;
	}

	public static Date string2DateHms(String date) {
		SimpleDateFormat sdf = new SimpleDateFormat(DateUtils.DATE_TIME_FORMAT);
		Date result = null;
		try {
			result = sdf.parse(date);
		} catch (Exception e) {
		    e.printStackTrace();
		} finally {
		}
		return result;
	}

	/**
	 * Date型日期转字符串型日期
	 * 
	 * @param date
	 * @param format
	 * @return
	 */
	public static String date2String(Date date, String format) {
		String result = "";
		if (null == date)
			return result;
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		return sdf.format(date);
	}

	/**
	 * 获取时间（无毫秒）
	 * 
	 * @return 返回时间格式（无毫秒）
	 * @author 袁宗迪
	 * @serialData 2017年1月7日
	 */
	public static Date getNowDate() {
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat(DATE_TIME_FORMAT);
		String strDate = sdf.format(date);
		Date result = string2DateHms(strDate);
		return result;
	}
	
	/**
	 * 获取时间 年月日
	 * @return 
	 * @author 袁宗迪
	 * @serialData 2018年5月8日
	 */
   public static Date getNowDateYmd() {
        Date date = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT);
        String strDate = sdf.format(date);
        Date result = string2Date(strDate);
        return result;
    }

	/**
	 * 返回当前时间的年月：201503
	 * 
	 * @param deta
	 * @return
	 * @author 孙波
	 * @date 2015年12月31日
	 */
	public static String data2YearAndMonth() {
		Calendar currentTime = Calendar.getInstance();
		int month = currentTime.get(Calendar.MONDAY) + 1;

		StringBuilder strBuilder = new StringBuilder();
		strBuilder.append(Integer.toString(currentTime.get(Calendar.YEAR)));
		if (month < 10) {
			strBuilder.append("0");
		}
		strBuilder.append(Integer.toString((month)));
		return strBuilder.toString();
	}

	/**
	 * 新增一天
	 * 
	 * @param date
	 *            时间
	 * @param number
	 *            天数
	 * @return 新增后的天数
	 * @author 袁宗迪
	 * @serialData 2016年4月14日
	 */
	public static Date DateAddDay(Date date, int number) {

		Calendar cld = Calendar.getInstance();

		cld.setTime(date);

		cld.add(Calendar.DATE, number);

		return cld.getTime();
	}

	public static Date DateDelDay(Date date, int number) {

		Calendar cld = Calendar.getInstance();

		cld.setTime(date);

		cld.add(Calendar.DATE, -number);

		return cld.getTime();
	}

	public static void main(String[] args) throws ParseException {
        
    
        
        System.out.println(11%4);
	}

	/**
	 * 日期添加天数（从00：00：00开始）
	 * 
	 * @param date
	 *            时间 2015-01-01 12：00：00
	 * @param number
	 *            1天
	 * @return 返回2015-01-02 00：00：00
	 * @author 袁宗迪
	 * @serialData 2016年4月14日
	 */
	public static Date addStartDay(Date date, int number) {

		Calendar cld = Calendar.getInstance();

		cld.setTime(date);

		cld.add(Calendar.DATE, number);
		cld.set(Calendar.HOUR_OF_DAY, 0);
		cld.set(Calendar.MINUTE, 0);
		cld.set(Calendar.SECOND, 0);

		return cld.getTime();
	}

	/**
	 * 日期添加天数（从23：59：58开始）
	 * 
	 * @param date
	 *            时间 2015-01-02 12：00：00
	 * @param number
	 *            1天
	 * @return 返回2015-01-01 23：59：59
	 * @author 袁宗迪
	 * @serialData 2016年4月14日
	 */
	public static Date addEndDay(Date date, int number) {

		Calendar cld = Calendar.getInstance();

		cld.setTime(date);

		cld.add(Calendar.DATE, number);
		cld.set(Calendar.HOUR_OF_DAY, 23);
		cld.set(Calendar.MINUTE, 59);
		cld.set(Calendar.SECOND, 59);

		return cld.getTime();
	}

	/**
	 * 获取下一天，从00：00：00开始
	 * 
	 * @param date
	 *            时间
	 * @return 返回下一天
	 * @author 袁宗迪
	 * @serialData 2016年4月14日
	 */
	public static Date getNextDate(Date date) {

		Calendar cld = Calendar.getInstance();

		cld.setTime(date);
		cld.add(Calendar.DATE, 1);
		cld.set(Calendar.HOUR_OF_DAY, 0);
		cld.set(Calendar.MINUTE, 0);
		cld.set(Calendar.SECOND, 0);

		return cld.getTime();

	}

	/**
	 * 指定日期的月份的最后一天的结束时间,如:传入2016-10-10,得到2016-10-31 23:59:58:9999999
	 * 
	 * @return
	 */
	public static Date getMonthEndDay(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.DAY_OF_MONTH, getMonthDayCount(date) - 1);
		calendar.set(Calendar.HOUR_OF_DAY, 23);
		calendar.set(Calendar.MINUTE, 59);
		calendar.set(Calendar.SECOND, 59);
		calendar.set(Calendar.MILLISECOND, 9999999);
		return calendar.getTime();
	}

	/**
	 * 获取月份的天数
	 * 
	 * @param date
	 * @return
	 */
	public static Integer getMonthDayCount(Date date) {
		Integer count = 30;
		switch (getMonth(date)) {
		case 1:
		case 3:
		case 5:
		case 7:
		case 8:
		case 10:
		case 12: {
			count = 31;
			break;
		}
		case 2: {
			if (isLeapYear(date)) {
				count = 29;
			} else {
				count = 28;
			}
			break;
		}
		}
		return count;
	}

	/**
	 * 是否闰年
	 * 
	 * @param date
	 * @return
	 */
	public static Boolean isLeapYear(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		int year = getYear(date);
		if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
			return true;
		} else {
			return false;
		}
	}

	public static String getTimeUUID() {
		Random random=new Random();    	
    	StringBuffer sb = new StringBuffer(String.valueOf(System.currentTimeMillis()));   
    	String timeUUID = sb.reverse().toString()+random.nextInt(100);
    	return  timeUUID;
	}
	
	/** 
	 * 时间戳转换成日期格式字符串 
	 * @param seconds 精确到秒的字符串 
	 * @param formatStr 
	 * @return 
	 */  
	 public static String timeStamp2Date(String seconds,String format) {  
		String res;
		SimpleDateFormat simpleDateFormat = null;
		if(StringUtils.isNotBlank(format)){
			simpleDateFormat = new SimpleDateFormat(format);
		}else{
			simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		}
        long lt = new Long(seconds);
        Date date = new Date(lt);
        res = simpleDateFormat.format(date);
        return res;
	}  
	 
	 
	 public static Map<String,Integer> getTimeByCalendar(){
		 
		   Map<String,Integer> dateMap = new HashMap<String,Integer>();
		 
	        Calendar cal = Calendar.getInstance();
	        int year = cal.get(Calendar.YEAR);//获取年份
	        int month=cal.get(Calendar.MONTH);//获取月份
	        int day=cal.get(Calendar.DATE);//获取日
//	        int hour=cal.get(Calendar.HOUR);//小时
//	        int minute=cal.get(Calendar.MINUTE);//分           
//	        int second=cal.get(Calendar.SECOND);//秒
//	        int WeekOfYear = cal.get(Calendar.DAY_OF_WEEK);//一周的第几天
//	        System.out.println("现在的时间是：公元"+year+"年"+month+"月"+day+"日      "+hour+"时"+minute+"分"+second+"秒       星期"+WeekOfYear);
	        dateMap.put("year", year);
	        dateMap.put("month", month);
	        dateMap.put("day", day);
	        return dateMap;
	 
	    }
}
