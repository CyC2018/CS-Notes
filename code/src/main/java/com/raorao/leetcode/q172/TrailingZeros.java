package com.raorao.leetcode.q172;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-31-12:49
 */
public class TrailingZeros {

  public static void main(String[] args) {
    int res = trailingZeroes(10);
    System.out.println(res);
  }

  public static int trailingZeroes(int n) {
    return n == 0 ? 0 : n / 5 + trailingZeroes(n / 5);
  }
}
