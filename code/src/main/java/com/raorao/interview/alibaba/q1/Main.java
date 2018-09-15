package com.raorao.interview.alibaba.q1;

import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-07-19:45
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int N = scanner.nextInt();
    int[] arr = new int[N];
    for (int i = 0; i < N; i++) {
      arr[i] = scanner.nextInt();
    }
    if (N < 6) {
      System.out.println(0);
      return;
    }


  }

}
