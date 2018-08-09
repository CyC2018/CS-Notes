package com.raorao.java.althorithm;

/**
 * 01背包问题.
 *
 * 题目描述：有n个物品，每个物品有对应的重量和价值，在包的容量限制下，求最大的价值。
 *
 * @author Xiong Raorao
 * @since 2018-08-09-15:21
 */
public class Bag {

  public static void main(String[] args) {
    int[] w = new int[] {2, 3, 4, 5};
    int[] v = new int[] {3, 4, 5, 6};
    System.out.println(maxValue(w, v, 8));
  }

  public static int maxValue(int[] w, int[] v, int capacity) {
    int n = w.length;// 物品的数量
    int[][] f = new int[n + 1][capacity + 1]; // 背包最优解，f[i][j]表示的是当前背包容量j,前i个物品最佳组合对应的价值;
    for (int i = 1; i <= n; i++) {
      for (int j = 1; j <= capacity; j++) {
        if (j < w[i-1]) {
          f[i][j] = f[i - 1][j];
        } else {
          f[i][j] = Math.max(f[i - 1][j], f[i - 1][j - w[i - 1]] + v[i - 1]);
        }
      }
    }
    return f[n][capacity];
  }

}
