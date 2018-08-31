package com.raorao.leetcode.q367;

/**
 * 判断有效的完全平方数.
 *
 * @author Xiong Raorao
 * @since 2018-08-31-16:04
 */
public class PerfectSquare {

  /**
   * 利用平方数的差为等差数列的性质来计算
   */
  public boolean isPerfectSquare(int num) {
    int sub = 1;
    while (num > 0) {
      num -= sub;
      sub += 2;
    }
    return num == 0;
  }
}
