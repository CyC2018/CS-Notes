package com.raorao.interview.huawei.T2;

import java.util.Scanner;

/**
 * 题目描述：小偷来到了一个神秘的王宫，突然眼前一亮，发现5个宝贝，每个宝贝的价值都不一样，且重量也不一样，但是小偷的背包携带重量 有限，所以他不得不在宝贝中做出选择，才能使偷到的财富最大，请你帮助小偷计算一下。.
 *
 * @author Xiong Raorao
 * @since 2018-08-08-19:15
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    while (scanner.hasNext()) {
      String line1 = scanner.nextLine();
      String line2 = scanner.nextLine();
      String[] s1 = line1.split(",");
      String[] s2 = line2.split(",");
      int[] weights = new int[s1.length];
      int[] values = new int[s2.length];
      for (int i = 0; i < s1.length; i++) {
        weights[i] = Integer.parseInt(s1[i]);
      }
      for (int i = 0; i < s2.length; i++) {
        values[i] = Integer.parseInt(s2[i]);
      }
      int capacity = Integer.parseInt(scanner.nextLine());
      System.out.println(process(values, weights, capacity));
    }
  }

  public static int process(int[] weight, int[] value, int capacity) {
    int n = weight.length;
    int[][] maxvalue = new int[n + 1][capacity + 1];

    for (int i = 0; i < capacity + 1; i++) {
      maxvalue[0][i] = 0;
    }
    for (int i = 0; i < n + 1; i++) {
      maxvalue[i][0] = 0;
    }
    for (int i = 1; i <= n; i++) {
      for (int j = 1; j <= capacity; j++) {
        maxvalue[i][j] = maxvalue[i - 1][j];
        if (weight[i - 1] <= j) {
          if (maxvalue[i - 1][j - weight[i - 1]] + value[i - 1] > maxvalue[i - 1][j]) {
            maxvalue[i][j] = maxvalue[i - 1][j - weight[i - 1]] + value[i - 1];
          }
        }
      }
    }
    return maxvalue[n][capacity];
  }

}
