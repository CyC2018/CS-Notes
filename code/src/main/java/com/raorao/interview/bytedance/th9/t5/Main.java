package com.raorao.interview.bytedance.th9.t5;

import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-09-11:07
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int n = scanner.nextInt();
    int m = scanner.nextInt();
    int[][] matrix = new int[n][n];
    for (int i = 0; i < n; i++) {
      for (int j = 0; j < n; j++) {
        if (i == j) {
          matrix[i][j] = 0;
        } else {
          matrix[i][j] = -1;
        }
      }
    }
    for (int i = 0; i < m; i++) {
      int a = scanner.nextInt();
      int b = scanner.nextInt();
      matrix[a - 1][b - 1] = 0;
    }
    for (int k = 0; k < n; k++) {
      for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
          if (matrix[i][j] < 0 && matrix[i][k] + matrix[k][j] == 0) {
            matrix[i][j] = 0;
          }
        }
      }
    }

    int ret = 0;
    for (int j = 0; j < n; j++) {
      int i;
      for (i = 0; i < n; i++) {
        if (matrix[i][j] < 0) {
          break;
        }
      }
      if (i == n) {
        ret++;
      }
    }

    System.out.println(ret);

  }


}
