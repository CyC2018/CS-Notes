package com.raorao.interview.pdd;

import java.util.Scanner;

/**
 * 旋转的字符串.
 *
 * 题目要求： 求给定的数字的字符串
 *
 * @author Xiong Raorao
 * @since 2018-08-05-19:04
 */
public class Square {

  private static void process(String ss) {
    char[] arr = ss.toCharArray();
    int a;
    char[][] result;
    if (ss.length() == 0) {
      System.out.println();
    }
    if (ss.length() % 4 == 0) {
      a = ss.length() / 4 + 1;
      result = new char[a][a];

      // 第一行
      for (int i = 0; i < a; i++) {
        result[0][i] = arr[i];
      }

      // 最后一行
      for (int i = 0; i < a; i++) {
        result[a - 1][a - i - 1] = arr[2 * a - 2 + i];
      }

      // 右边
      for (int i = 0; i < a - 2; i++) {
        result[i + 1][a - 1] = arr[a + i];
      }

      // 左边
      for (int i = 0; i < a - 2; i++) {
        result[a - 2 - i][0] = arr[3 * a - 2 + i];
      }

      // 打印
      print(result);
    }
  }

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    while (scanner.hasNextLine()) {
      process(scanner.nextLine());
    }
  }

  private static void print(char[][] arr) {
    int a = arr.length;
    for (int i = 0; i < a; i++) {
      for (int j = 0; j < a; j++) {
        if (i == 0 || j == 0 || i == a - 1 || j == a - 1) {
          System.out.print(arr[i][j] + "");
        } else {
          System.out.print(" ");
        }
      }
      System.out.println();
    }
  }

}
