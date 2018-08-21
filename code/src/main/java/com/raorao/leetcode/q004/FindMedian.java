package com.raorao.leetcode.q004;

/**
 * 寻找中位数.
 *
 * 问题描述：给定两个有序的数组，然后寻找两个有序数组的中位数。
 *
 * 利用二分法的思想。时间复杂度为O(log(min(M,N)) 空间复杂度O(1)
 *
 * @author Xiong Raorao
 * @since 2018-08-21-11:57
 */
public class FindMedian {

  public static void main(String[] args) {
    int[] nums1 = new int[] {1, 3};
    int[] nums2 = new int[] {2};
    System.out.println(new FindMedian().findMedianSortedArrays(nums1, nums2));
  }

  /*
   * @param A: An integer array
   * @param B: An integer array
   * @return: a double whose format is *.5 or *.0
   */
  public double findMedianSortedArrays(int[] A, int[] B) {
    int n = A.length + B.length;

    if (n % 2 == 0) {
      return (findKth(A, B, n / 2) + findKth(A, B, n / 2 + 1)) / 2.0;
    }

    return findKth(A, B, n / 2 + 1);
  }

  // k is not zero-based, it starts from 1
  public int findKth(int[] A, int[] B, int k) {
    if (A.length == 0) {
      return B[k - 1];
    }
    if (B.length == 0) {
      return A[k - 1];
    }

    int start = Math.min(A[0], B[0]);
    int end = Math.max(A[A.length - 1], B[B.length - 1]);

    // find first x that >= k numbers is smaller or equal to x
    while (start + 1 < end) {
      int mid = start + (end - start) / 2;
      if (countSmallerOrEqual(A, mid) + countSmallerOrEqual(B, mid) < k) {
        start = mid;
      } else {
        end = mid;
      }
    }

    if (countSmallerOrEqual(A, start) + countSmallerOrEqual(B, start) >= k) {
      return start;
    }

    return end;
  }

  private int countSmallerOrEqual(int[] arr, int number) {
    int start = 0, end = arr.length - 1;

    // find first index that arr[index] > number;
    while (start + 1 < end) {
      int mid = start + (end - start) / 2;
      if (arr[mid] <= number) {
        start = mid;
      } else {
        end = mid;
      }
    }

    if (arr[start] > number) {
      return start;
    }

    if (arr[end] > number) {
      return end;
    }

    return arr.length;
  }
}
