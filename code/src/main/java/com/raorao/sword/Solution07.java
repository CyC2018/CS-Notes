package com.raorao.sword;

/**
 * 斐波那契数列.
 *
 * @author Xiong Raorao
 * @since 2018-09-08-22:03
 */
public class Solution07 {

  public static void main(String[] args) {
    int re = new Solution07().Fibonacci(5);
    System.out.println(re);
  }

  public int Fibonacci(int n) {
    int pre = 1;
    int cur = 1;
    if (n == 0) {
      return 0;
    } else if (n <= 2) {
      return 1;
    }
    for (int i = 3; i <= n; i++) {
      int temp = pre + cur;
      pre = cur;
      cur = temp;
    }
    return cur;
  }
}
