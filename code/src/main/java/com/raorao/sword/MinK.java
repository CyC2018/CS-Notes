package com.raorao.sword;

import java.util.ArrayList;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-12-21:01
 */
public class MinK {

  public static void main(String[] args) {
    int[] nums = new int[] {4, 5, 1, 6, 2, 7, 3, 8};
    ArrayList<Integer> list = new MinK().GetLeastNumbers_Solution(nums, 4);
    System.out.println(list.toString());
  }

  public ArrayList<Integer> GetLeastNumbers_Solution(int[] input, int k) {
    ArrayList<Integer> list = new ArrayList<>();
    if (k > input.length) {
      return list;
    }
    int low = 0;
    int high = input.length - 1;
    while (true) {
      int index = partition(input, low, high);
      if (index == k - 1) {
        for (int i = 0; i < k; i++) {
          list.add(input[i]);
        }
        break;
      } else if (index < k) {
        low = index + 1;
      } else {
        high = index - 1;
      }
    }
    return list;
  }

  public int partition(int[] arr, int low, int high) {
    int pivot = arr[low];
    while (low < high) {
      while (arr[high] > pivot && low < high) {
        high--;
      }
      arr[low] = arr[high];
      while (arr[low] <= pivot && low < high) {
        low++;
      }
      arr[high] = arr[low];
    }
    arr[low] = pivot;
    return low;
  }
}
