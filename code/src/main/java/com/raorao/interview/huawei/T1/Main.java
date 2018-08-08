package com.raorao.interview.huawei.T1;

import java.util.Scanner;

/**
 * 题目要求：输入任意个字符串，将其中的小写字母变为大写，大写字母变为小写，其他字符不用处理.
 *
 * @author Xiong Raorao
 * @since 2018-08-08-19:01
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    while (scanner.hasNext()) {
      String ss = scanner.nextLine();
      process(ss);
    }
  }

  private static void process(String str) {
    char[] arr = str.toCharArray();
    for (int i = 0; i < arr.length; i++) {
      arr[i] = tranfer(arr[i]);
    }
    System.out.println(new String(arr));
  }

  private static char tranfer(char c) {
    int t = (int) c;
    if (t >= 65 && t <= 90) {
      t = t + 32;
    }else if (t >= 97 && t <= 122) {
      t = t - 32;
    }
    return (char) t;
  }


}
