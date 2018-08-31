package com.raorao.leetcode.q462;

/**
 * 改变数组元素使所有的数组元素都相等，求最少的总移动次数.
 *
 * 思路：找出中位数，可以采用排序，然后计算，也可以采用找中位数的方法来计算
 *
 * @author Xiong Raorao
 * @since 2018-08-31-15:22
 */
public class MinMove {

  public static void main(String[] args) {
    int[] input = new int[]{1,2,3};
    int res = new MinMove().minMoves2(input);
    System.out.println(res);
  }

  public int minMoves2(int[] nums) {
    int median = getMedian(nums);
    int count = 0;
    for (int num : nums) {
      count += Math.abs(num - median);
    }
    return count;
  }

  private int getMedian(int[] nums) {
    int low = 0;
    int high = nums.length - 1;
    while (low < high) {
      int m = partition(nums, low, high);
      if (m == nums.length / 2) {
        break;
      }
      if (m < nums.length / 2) {
        low = m + 1;
      } else {
        high = m - 1;
      }
    }
    return nums[nums.length / 2];
  }

  private int partition(int[] nums, int low, int high) {
    int i = low;
    int j = high + 1;
    while (true) {
      while (nums[++i] < nums[low] && i < high) {
        ;
      }
      while (nums[--j] > nums[low] && j > low) {
        ;
      }
      if (i >= j) {
        break;
      }
      swap(nums, i, j);
    }
    swap(nums, low, j);
    return j;
  }

  private void swap(int[] nums, int i, int j) {
    int temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
  }
}
