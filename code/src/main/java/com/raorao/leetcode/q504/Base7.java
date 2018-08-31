package com.raorao.leetcode.q504;


/**
 * 10进制转7进制.
 *
 * @author Xiong Raorao
 * @since 2018-08-31-11:54
 */
public class Base7 {

  public static void main(String[] args) {
    Base7 base7 = new Base7();
    String res = base7.convertToBase7(100);
    System.out.println(res);
  }

  public String convertToBase7(int num) {
    StringBuilder sb = new StringBuilder();
    convertBase(sb, num);
    if (num < 0) {
      sb.append("-");
    }
    return sb.reverse().toString();
  }

  private void convertBase(StringBuilder sb, int num) {
    num = Math.abs(num);
    if (num == 0) {
      sb.append(0);
      return;
    }
    int a = num / 7;
    int b = num % 7;
    sb.append(b);
    if (a >= 7) {
      convertBase(sb, a);
    } else if( a > 0) {
      sb.append(a);
    }
  }


}
