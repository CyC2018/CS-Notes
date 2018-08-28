package com.raorao.interview.haoweilai.t1;

import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-28-19:01
 */
public class Main2 {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    String input = scanner.nextLine();
    System.out.println(process(input));
  }


  private static boolean isOk(String input, int start, int end) {
    int k = 0;
    for (int i = start; i < end; i++) {
      k = 10 * k + input.charAt(i) - '0';
    }
    return (k % 3 == 0);
  }

  private static int process(String str) {
    if (str == null || str.length() == 0) {
      return 0;
    }
    int len = str.length();
    int[] v = new int[len + 1];
    for (int i = 1; i <= len; i++) {
      int j = i - 1;
      while (!isOk(str, j, i) && j > 0) {
        j--;
      }
      if (isOk(str, j, i)) {
        v[i] = Math.max(v[i - 1], v[j] + 1);
      } else {
        v[i] = v[i - 1];
      }
    }
    return v[len];
  }
}
