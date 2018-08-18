package com.raorao.java.althorithm;

import java.util.Stack;

/**
 * 汉诺塔问题.
 *
 * 描述：三个柱子，其中一个柱子有N个盘子，要求移动到另外一个盘子上。
 *
 * @author Xiong Raorao
 * @since 2018-08-17-16:41
 */
public class Hanuota {

  static int count = 0;

  public static void main(String[] args) {
    move(3, "A", "B", "C");
    System.out.println("times: " + count);
  }

  public static void move(int n, String A, String B, String C) {
    if (n == 1) {
      System.out.println(A + " ==> " + C);
      count++;
      return;
    }
    move(n - 1, A, C, B);
    move(1, A, B, C);
    move(n - 1, B, A, C);
  }
}
