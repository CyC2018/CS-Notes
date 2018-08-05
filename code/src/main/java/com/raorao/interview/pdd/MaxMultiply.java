package com.raorao.interview.pdd;

import java.util.Scanner;

/**
 * 最大乘积.
 *
 * @author Xiong Raorao
 * @since 2018-08-05-17:03
 */
public class MaxMultiply {

  private static int[] arr;
  private static int size;

  public static void main(String[] args) {
    for (int i = 0; i < size; i++) {

    }
  }

  public static void read() {
    Scanner scanner = new Scanner(System.in);
    if (scanner.hasNextInt()) {
      size = scanner.nextInt();
      arr = new int[size];
    }
    if (scanner.hasNextLine()) {
      String[] ss = scanner.nextLine().split(" ");
      for (int i = 0; i < ss.length; i++) {
        arr[i] = Integer.parseInt(ss[i]);
      }
    }
  }
}
