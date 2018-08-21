package com.raorao.leetcode.q665;

/**
 * 判断是否为非递减数组.
 *
 * 题目描述：判断一个数组能不能只修改一个数就成为非递减数组。
 *
 * @author Xiong Raorao
 * @since 2018-08-21-15:44
 */
public class NoneDecreasingArray {

  public boolean checkPossibility(int[] nums) {
    int count = 0; // 修改次数
    for (int i = 1; i < nums.length && count < 2; i++) {
      if (nums[i] >= nums[i - 1]) {
        continue;
      }
      count++;
      if (i > 1 && nums[i] < nums[i - 2]) {
        nums[i] = nums[i - 1];
      } else {
        nums[i - 1] = nums[i];
      }
    }
    return count < 2;
  }

}
