package com.raorao.interview.huawei;

import java.util.Scanner;

/**
 * 数制转换.
 *
 * 问题描述：输入一个16进制的字符串，输出对应的10进制的字符串
 *
 * @author Xiong Raorao
 * @since 2018-08-08-10:44
 */
public class Q3 {

  public static void main(String[] args) {
    String a = "0xA";
    System.out.println(process(a));
    Scanner scanner = new Scanner(System.in);
    while (scanner.hasNextLine()) {
      System.out.println(process(scanner.nextLine()));
    }
  }

  public static String process(String ss) {
    if (ss.startsWith("0x")) {
      ss = ss.substring(2);
    }
    int a = Integer.parseInt(ss, 16);
    return String.valueOf(a);
  }
}
