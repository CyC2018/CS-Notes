package com.raorao.leetcode.q039;

import java.util.ArrayList;
import java.util.List;

/**
 * 组合求和.
 *
 * @author Xiong Raorao
 * @since 2018-08-27-10:44
 */
public class CombinationSum {

  public static void main(String[] args) {
    int[] candidates = new int[] {2, 3, 6, 7};
    int target = 7;
    List<List<Integer>> res = new CombinationSum().combinationSum(candidates, target);
    res.forEach(e -> {
      e.forEach(f -> System.out.print(f + " "));
      System.out.println();
    });
  }


  public List<List<Integer>> combinationSum(int[] candidates, int target) {
    List<List<Integer>> sums = new ArrayList<>();
    backTracking(candidates, new ArrayList<>(), sums, 0, target);
    return sums;
  }

  private void backTracking(int[] candidates, ArrayList<Integer> tempList, List<List<Integer>> sums,
      int start, int target) {
    if (target == 0) {
      sums.add(new ArrayList<>(tempList));
      return;
    }
    for (int i = start; i < candidates.length; i++) {
      if (candidates[i] <= target) {
        tempList.add(candidates[i]);
        backTracking(candidates, tempList, sums, i , target - candidates[i]);
        tempList.remove(tempList.size() - 1);
      }
    }
  }
}
