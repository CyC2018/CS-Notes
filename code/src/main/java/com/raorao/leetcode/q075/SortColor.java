package com.raorao.leetcode.q075;

import java.util.Arrays;

/**
 * 荷兰国旗问题.
 *
 * 给定一个包含红色、白色和蓝色，一共 n 个元素的数组，原地对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。
 *
 * 它其实是三向切分快速排序的一种变种，在三向切分快速排序中，每次切分都将数组分成三个区间： 小于切分元素、等于切分元素、大于切分元素，而该算法是将数组分成三个区间：等于红色、等于白色、等于蓝色。
 *
 * 题目描述只有0/1/2三种颜色，分别对应红白蓝
 *
 * @author Xiong Raorao
 * @since 2018-08-21-9:34
 */
public class SortColor {

  public static void main(String[] args) {
    int[] input = new int[] {2,0,1};
    new SortColor().sortColors(input);
    Arrays.stream(input).forEach(e -> System.out.print(e + " "));
  }

  public void sortColors(int[] nums) {
    int low = 0;
    int high = nums.length - 1;
    int pivot = 0;
    while (pivot <= high) {
      if (nums[pivot] == 0) {
        swap(nums, pivot++, low++); // 如果把当前0换到前面去了，换过来的只可能是1或0，因此pivot右移
      } else if (nums[pivot] == 2) {
        swap(nums, pivot, high--); // 如果是2和末尾的交换，可能过来的是0，因此pivot不能右移
      } else {
        pivot++;
      }
    }
  }

  private void swap(int[] arr, int i, int j) {
    int tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
}
