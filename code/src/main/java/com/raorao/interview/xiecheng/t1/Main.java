package com.raorao.interview.xiecheng.t1;

import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-04-19:40
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    long input = scanner.nextLong();

    int count = 0;
    while (input != 0) {
      input = input & (input - 1);
      count++;
    }
    System.out.println(count);
  }
}
