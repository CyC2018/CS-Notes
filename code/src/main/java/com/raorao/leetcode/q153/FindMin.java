package com.raorao.leetcode.q153;

/**
 * 旋转后的有序数组的最小数字.
 *
 * 当年拼多多二面的算法题啊
 *
 * @author Xiong Raorao
 * @since 2018-08-21-16:33
 */
public class FindMin {

  public static void main(String[] args) {
    int[] input = new int[] {4, 5, 6, 7, 0, 1, 2};
    int res = findMin(input);
    System.out.println(res);
  }

  public static int findMin(int[] nums) {
    int low = 0;
    int high = nums.length - 1;
    while (low < high) {
      int mid = low + (high - low) / 2;
      if (nums[mid] <= nums[high]) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }
    return nums[low];
  }

  public static int findMax(int[] nums) {
    int low = 0;
    int high = nums.length - 1;
    while (low < high) {
      int mid = low + (high - low) / 2;
      if (nums[mid] >= nums[low]) {
        low = mid;
      } else {
        high = mid - 1;
      }
    }
    return nums[high];
  }
}
