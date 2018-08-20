package com.raorao.leetcode.q088;

/**
 * 归并两个有序数组.
 *
 * @author Xiong Raorao
 * @since 2018-08-20-15:37
 */
public class MergeArray {

  public static void main(String[] args) {
    int[] nums1 = new int[] {1, 2, 3, 0, 0, 0};
    int[] nums2 = new int[] {2, 5, 6};
    new MergeArray().merge(nums1, 3, nums2, 3);
    System.out.println("  ");
  }

  public void merge(int[] nums1, int m, int[] nums2, int n) {
    int[] temp = new int[m + n];
    int i = 0;
    int j = 0;
    int t = 0;
    while (i < m && j < n) {
      temp[t++] = nums1[i] < nums2[j] ? nums1[i++] : nums2[j++];
    }
    while (i < m) {
      temp[t++] = nums1[i++];
    }
    while (j < n) {
      temp[t++] = nums2[j++];
    }

    // temp copy to nums1
    System.arraycopy(temp, 0, nums1, 0, m + n);
  }
}
