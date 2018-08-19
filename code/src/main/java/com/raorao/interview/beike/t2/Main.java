package com.raorao.interview.beike.t2;

import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-18-20:35
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int n = Integer.parseInt(scanner.nextLine());
    String[] line = scanner.nextLine().split(" ");
    int[] data = new int[n];
    for (int i = 0; i < n; i++) {
      data[i] = Integer.parseInt(line[i]);
    }

    int count = 0;
    for (int i = 0; i < 5; i++) {
      for (int j = 0; j < 5; j++) {
        count += Math.abs(data[i] - data[j]);
      }
    }
    System.out.println(count);
  }
}
