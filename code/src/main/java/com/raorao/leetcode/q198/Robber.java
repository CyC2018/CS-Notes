package com.raorao.leetcode.q198;

/**
 * 强盗抢劫.
 *
 * @author Xiong Raorao
 * @since 2018-08-23-10:09
 */
public class Robber {

  public static void main(String[] args) {
    int[] input = new int[] {1, 2, 3, 1};
    int result = new Robber().rob(input);
    System.out.println(result);
  }

  public int rob(int[] nums) {
    if (nums == null || nums.length == 0) {
      return 0;
    }
    int n = nums.length;
    int pre1 = 0;
    int pre2 = 0;
    int pre3 = 0;
    for (int i = 0; i < n; i++) {
      int cur = Math.max(pre2, pre3) + nums[i];
      pre3 = pre2;
      pre2 = pre1;
      pre1 = cur;
    }
    return Math.max(pre1, pre2);
  }
}
