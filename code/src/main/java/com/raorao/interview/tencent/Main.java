package com.raorao.interview.tencent;

import java.util.Scanner;

/**
 * 8.31 模拟题.
 *
 * @author Xiong Raorao
 * @since 2018-08-31-20:52
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int k = scanner.nextInt();
    int a = scanner.nextInt();
    int b = scanner.nextInt();
    int x =scanner.nextInt();
    int y = scanner.nextInt();
    System.out.println(process(k,a,b,x,y));
  }

  private static long process(int k, int a, int b, int x, int y) {
    long ans = 0;
    int mod = 1000000007;
    int[][] c = new int[105][105];
    c[0][0] = 1;
    for (int i = 1; i <= 100; i++) {
      c[i][0] = 1;
      for (int j = 1; j <= 100; j++) {
        c[i][j] = (c[i - 1][j - 1] + c[i - 1][j]) % mod;
      }
    }

    for (int i = 0; i <= x; i++) {
      if (i * a <= k && (k - a * i) % b == 0 && (-a * i) / b <= y) {
        ans = (ans + (c[x][i] * c[y][(k - a * i) / b]) % mod) % mod;
      }
    }
    return ans;
  }
}
