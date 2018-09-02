package com.raorao.leetcode.q628;

/**
 * 求数组最大的三个数的乘积.
 *
 * @author Xiong Raorao
 * @since 2018-09-02-17:20
 */
public class MaximumProduct {

  public static void main(String[] args) {

  }

  public int maximumProduct(int[] nums) {
    int m1 = Integer.MIN_VALUE;
    int m2 = Integer.MIN_VALUE;
    int m3 = Integer.MIN_VALUE;
    int min1 = Integer.MAX_VALUE;
    int min2 = Integer.MAX_VALUE;
    for (int num : nums) {
      if (num > m1) {
        // 后移一位
        m3 = m2;
        m2 = m1;
        m1 = num;
      } else if (num > m2) {
        m3 = m2;
        m2 = num;
      } else if (num > m3) {
        m3 = num;
      }

      // 考虑到负数的可能
      if(num < min1){
        min2 = min1;
        min1 = num;
      }else if(num < min2){
        min2 = num;
      }
    }
    return Math.max(m1*m2*m3, m1*min1*min2);
  }

}
