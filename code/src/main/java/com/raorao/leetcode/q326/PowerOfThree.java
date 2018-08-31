package com.raorao.leetcode.q326;

/**
 * 判断一个数是否是3的幂.
 *
 * @author Xiong Raorao
 * @since 2018-08-31-16:11
 */
public class PowerOfThree {

  public boolean isPowerOfThree(int n) {
    while (n >= 3 && n % 3 == 0) {
      n = n / 3;
    }
    return n == 1;
  }
}
