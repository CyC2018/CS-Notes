package com.raorao.leetcode.q215;

import java.util.PriorityQueue;

/**
 * 求未排序数组的第K大元素.
 *
 * @author Xiong Raorao
 * @since 2018-08-20-16:34
 */
public class Kth {

  public static void main(String[] args) {
    int[] input = new int[] {3, 2, 1, 5, 6, 4};
    int k = 2;
    int result = new Kth().findKthLargest2(input, k);
    System.out.println(result);
    //Arrays.stream(input).forEach(e -> System.out.print(e + " "));
  }

  /**
   * 解法一：构建大顶堆
   */
  public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> queue = new PriorityQueue<>();
    for (int num : nums) {
      queue.add(num);
      if (queue.size() > k) {
        queue.poll();
      }
    }
    return queue.peek();
  }

  /**
   * 解法二：快速选择，时间复杂度O(N)，空间复杂度O(1)
   */
  public int findKthLargest2(int[] nums, int k) {
    k = nums.length - k;
    int l = 0, h = nums.length - 1;
    while (l < h) {
      int j = partition(nums, l, h);
      if (j == k) {
        break;
      } else if (j < k) {
        l = j + 1;
      } else {
        h = j - 1;
      }
    }
    return nums[k];
  }

  private int partition(int[] a, int l, int h) {
    int i = l, j = h + 1;
    while (true) {
      while (a[++i] < a[l] && i < h) {

      }
      while (a[--j] > a[l] && j > l) {

      }
      if (i >= j) {
        break;
      }
      swap(a, i, j);
    }
    swap(a, l, j);
    return j;
  }

  private void swap(int[] a, int i, int j) {
    int t = a[i];
    a[i] = a[j];
    a[j] = t;
  }

}
