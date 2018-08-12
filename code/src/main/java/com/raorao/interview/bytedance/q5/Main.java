package com.raorao.interview.bytedance.q5;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-12-10:16
 */
public class Main {

  public static void main(String[] args) {

  }

  private static void process(int n, int m, int[] s, int[] t) {

  }

  private static int getMin(int[] src) {
    int min = Integer.MAX_VALUE;
    for (int i = 0; i < src.length; i++) {
      if (min > src[i]) {
        min = src[i];
      }
    }
    return min;
  }

  private static int getMax(int[] src) {
    int max = Integer.MIN_VALUE;
    for (int i = 0; i < src.length; i++) {
      if (max < src[i]) {
        max = src[i];
      }
    }
    return max;
  }

  static class ZB {

    public int s;
    public int t;
  }

}
