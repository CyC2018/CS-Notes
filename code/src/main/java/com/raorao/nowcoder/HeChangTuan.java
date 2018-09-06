package com.raorao.nowcoder;

import java.util.Scanner;

/**
 * 牛客网：合唱团问题
 *
 * https://www.nowcoder.com/questionTerminal/661c49118ca241909add3a11c96408c8?orderByHotValue=1&mutiTagIds=593&page=1&onlyReference=false.
 *
 * @author Xiong Raorao
 * @since 2018-09-06-23:21
 */
public class HeChangTuan {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int n = scanner.nextInt();
    int[] a = new int[n + 1];
    for (int i = 1; i < n + 1; i++) {
      a[i] = scanner.nextInt();
    }
    int kk = scanner.nextInt();
    int dd = scanner.nextInt();

    // 规划数组
    long[][] f = new long[n + 1][kk + 1];
    long[][] g = new long[n + 1][kk + 1];

    //初始化k = 1
    for (int one = 1; one <= n; one++) {
      f[one][1] = a[one];
      g[one][1] = a[one];
    }

    // 自底向上递推
    for (int k = 2; k <= kk; k++) {
      for (int one = k; one <= n; one++) {
        // 求解当one和k定下来的时候，最大的分割点
        long tempMax = Long.MIN_VALUE;
        long tempMin = Long.MAX_VALUE;
        for (int left = Math.max(k - 1, one - dd); left <= one - 1; left++) {
          if (tempMax < Math.max(f[left][k - 1] * a[one], g[left][k - 1] * a[one])) {
            tempMax = Math.max(f[left][k - 1] * a[one], g[left][k - 1] * a[one]);
          }
          if (tempMin > Math.min(f[left][k - 1] * a[one], g[left][k - 1] * a[one])) {
            tempMin = Math.min(f[left][k - 1] * a[one], g[left][k - 1] * a[one]);
          }
          f[one][k] = tempMax;
          g[one][k] = tempMin;
        }
      }
    }
    //n选k最大的需要从最后一个最大的位置选
    long result = Long.MIN_VALUE;
    for (int one = kk; one <= n; one++) {
      if (result < f[one][kk]) {
        result = f[one][kk];
      }
    }
    System.out.println(result);

  }
}
