package com.raorao.interview.iqiyi.t1;

import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-15-10:42
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    String input = scanner.nextLine();
    String s1 = input.substring(0, 3);
    String s2 = input.substring(3, 6);
    int front = s1.charAt(0) + s1.charAt(1) + s1.charAt(2) - '0' * 3;
    int end = s2.charAt(0) + s2.charAt(1) + s2.charAt(2) - '0' * 3;
    if (Math.abs(front - end) == 0) {
      System.out.println(0);
    } else if (Math.abs(front - end) <= 9) {
      System.out.println(1);
    } else if (Math.abs(front - end) <= 18) {
      System.out.println(2);
    } else {
      System.out.println(3);
    }
  }
}
