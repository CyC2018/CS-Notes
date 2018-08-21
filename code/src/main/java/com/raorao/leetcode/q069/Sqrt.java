package com.raorao.leetcode.q069;

/**
 * 求开方.
 *
 * @author Xiong Raorao
 * @since 2018-08-21-16:06
 */
public class Sqrt {

  /**
   * 二分查找实现开方
   */
  public int mySqrt(int x) {
    if (x <= 1) {
      return x;
    }
    int low = 0;
    int high = x;
    while (low <= high) {
      int mid = low + (high - low) / 2;
      int sqrt = x / mid;
      if (sqrt == mid) {
        return mid;
      } else if (mid > sqrt) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }
    return high;
  }
}
