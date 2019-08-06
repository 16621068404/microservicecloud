package com.springcloud.tool;

import java.math.BigDecimal;

public class MathUtils {
    /**
     * 进行加法运算
     * 
     * @param d1
     * @param d2
     * @return
     * @author 冯光明
     * @serialData 2017年1月17日
     */
    public static double add(double d1, double d2) {
        BigDecimal b1 = new BigDecimal(String.valueOf(d1));
        BigDecimal b2 = new BigDecimal(String.valueOf(d2));
        return b1.add(b2).doubleValue();
    }

    /**
     * // 进行减法运算
     * 
     * @param d1
     * @param d2
     * @return
     * @author 冯光明
     * @serialData 2017年1月17日
     */
    public static double sub(double d1, double d2) {
        BigDecimal b1 = new BigDecimal(String.valueOf(d1));
        BigDecimal b2 = new BigDecimal(String.valueOf(d2));
        double result = b1.subtract(b2).doubleValue();
        return result;
    }

    /**
     * // 进行乘法运算
     * 
     * @param d1
     * @param d2
     * @return
     * @author 冯光明
     * @serialData 2017年1月17日
     */
    public static double mul(double d1, double d2) {
        BigDecimal b1 = new BigDecimal(String.valueOf(d1));
        BigDecimal b2 = new BigDecimal(String.valueOf(d2));
        return b1.multiply(b2).doubleValue();
    }

    public static double mul(double d1, double d2, boolean round, int roundLenth) {
        BigDecimal b1 = new BigDecimal(String.valueOf(d1));
        BigDecimal b2 = new BigDecimal(String.valueOf(d2));
        double result = b1.multiply(b2).doubleValue();

        if (round) {
            result = round(result, roundLenth);
        }

        return result;
    }

    /**
     * // 进行除法运算
     * 
     * @param d1
     * @param d2
     * @param len
     * @return
     * @author 冯光明
     * @serialData 2017年1月17日
     */
    public static double div(double d1, double d2, int len) {
        BigDecimal b1 = new BigDecimal(String.valueOf(d1));
        BigDecimal b2 = new BigDecimal(String.valueOf(d2));
        return b1.divide(b2, len, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    /**
     * // 进行四舍五入操作
     * 
     * @param d
     * @param len
     * @return
     * @author 冯光明
     * @serialData 2017年1月17日
     */
    public static double round(double d, int len) {

        BigDecimal b1 = new BigDecimal(d);
        BigDecimal b2 = new BigDecimal(1);
        // 任何一个数字除以1都是原数字
        // ROUND_HALF_UP是BigDecimal的一个常量，表示进行四舍五入的操作

        return b1.divide(b2, len, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    /**
     * 比较2个数据, -1 小于 0 等于 1 大于
     * 
     * @param d1
     * @param d2
     * @return
     * @author 冯光明
     * @serialData 2017年1月17日
     */
    public static int compareTo(double d1, double d2) {

        BigDecimal data1 = new BigDecimal(String.valueOf(d1));
        BigDecimal data2 = new BigDecimal(String.valueOf(d2));

        int result = data1.compareTo(data2);
        return result;
    }

    public static void main(String[] args) {
        System.out.println(round(6.666666, 6));
    }
}
