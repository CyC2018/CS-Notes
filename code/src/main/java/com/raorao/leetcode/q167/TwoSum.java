package com.raorao.leetcode.q167;

/**
 * 有序数组的和.
 *
 * @author Xiong Raorao
 * @since 2018-08-17-17:38
 */
public class TwoSum {

  public static void main(String[] args) {
    int[] numbers = {2, 7, 11, 15};
    int target = 9;
    int[] res = twoSum(numbers, target);
    System.out.println(res[0] + " " + res[1]);
  }

  public static int[] twoSum(int[] numbers, int target) {
    if (numbers == null || numbers.length == 0) {
      return new int[0];
    }
    int[] res = new int[2];
    int size = numbers.length;
    int low = 0;
    int high = size - 1;
    while (low < high) {
      if (numbers[low] + numbers[high] == target) {
        res[0] = low + 1;
        res[1] = high + 1;
        break;
      } else if (numbers[low] + numbers[high] < target) {
        low++;
      } else {
        high--;
      }
    }
    return res;
  }
}
