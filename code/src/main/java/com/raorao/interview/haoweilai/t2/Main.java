package com.raorao.interview.haoweilai.t2;

import java.util.Scanner;


/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-28-19:12
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int t = Integer.parseInt(scanner.nextLine());
    int[] res = new int[t];
    int[][] input = new int[t][2];
    for (int i = 0; i < t; i++) {
      String[] tmp = scanner.nextLine().split(" ");
      input[i][0] = Integer.parseInt(tmp[0]);
      input[i][1] = Integer.parseInt(tmp[1]);
    }
    for (int i = 0; i < t; i++) {
      res[i] = process(input[i][0], input[i][1]);
    }
    for (int i = 0; i < res.length; i++) {
      System.out.println(res[i]);
    }

  }

  private static int process(int x, int k) {
    int y = 1;
    while (k > 0) {
      boolean bool = x + y == (x | y);
      if (bool) {
        y++;
        k--;
      } else {
        y++;
      }
    }
    return y-1;
  }

}
