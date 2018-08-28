package com.raorao.interview.haoweilai.t4;

import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-28-20:47
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    String[] line1 = scanner.nextLine().split(" ");
    int n = Integer.parseInt(line1[0]);
    int m = Integer.parseInt(line1[1]);
    String[] line2 = scanner.nextLine().split(" ");
    int[] score = new int[n];
    for (int i = 0; i < n; i++) {
      score[i] = Integer.parseInt(line2[i]);
    }

    float sum = 0, k;
    for (int i = 0; i < n; i++) {
      sum += score[i];
    }
    sum /= n - m;
    System.out.printf("%.2f", sum);
  }

}
