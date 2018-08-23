package com.raorao.leetcode.q046;

import java.util.ArrayList;
import java.util.List;

/**
 * 排列.
 *
 * @author Xiong Raorao
 * @since 2018-08-23-8:58
 */
public class Permutation {

  public static void main(String[] args) {
    int[] input = new int[] {1, 2, 3};
    new Permutation().permute(input);
  }

  public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> permutes = new ArrayList<>();
    boolean[] visited = new boolean[nums.length];
    back(nums, new ArrayList<>(), permutes, visited);
    return permutes;
  }

  private void back(int[] arr, List<Integer> level, List<List<Integer>> lists,
      boolean[] visited) {
    if (level.size() == arr.length) {
      lists.add(new ArrayList<>(level));
      return;
    }
    for (int i = 0; i < arr.length; i++) {
      if(visited[i]){
        continue;
      }
      visited[i] = true;
      level.add(arr[i]);
      back( arr, level, lists, visited);
      level.remove(level.size() - 1);
      visited[i] = false;
    }
  }
}
