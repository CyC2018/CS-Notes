package com.raorao.leetcode.q001;

import java.util.HashMap;
import java.util.Map;

/**
 * 题目描述：给定一个整数数组和一个目标值，找出数组中和为目标值的两个数。你可以假设每个输入只对应一种答案，且同样的元素不能被重复利用。
 *
 * @author Xiong Raorao
 * @since 2018-08-20-16:54
 */
public class TwoSum {

  public static void main(String[] args) {
    int[] input = new int[] {12, 7, 11, 15};
    int target = 18;
    int[] ret = new TwoSum().twoSum(input, target);
    System.out.println("ret= " + ret[0] + ", " + ret[1]);
  }

  public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    int[] ret = new int[2];
    for (int i = 0; i < nums.length; i++) {
      int element = target - nums[i];
      if (map.containsKey(element) && map.get(element) != i) {
        if (i < map.get(element)) {
          ret[0] = i;
          ret[1] = map.get(element);
        } else {
          ret[0] = map.get(element);
          ret[1] = i;
        }
        return ret;
      }
      map.put(nums[i], i);
    }
    return new int[0];
  }

}



