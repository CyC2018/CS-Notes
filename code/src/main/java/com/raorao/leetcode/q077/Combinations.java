package com.raorao.leetcode.q077;

import java.util.ArrayList;
import java.util.List;

/**
 * 组合数.
 *
 * @author Xiong Raorao
 * @since 2018-08-27-10:29
 */
public class Combinations {

  public static void main(String[] args) {
    List<List<Integer>> res = new Combinations().combine(4, 2);
    res.forEach(e -> {
      e.forEach(f -> System.out.print(f + " "));
      System.out.println();
    });

  }

  public List<List<Integer>> combine(int n, int k) {
    List<List<Integer>> combinations = new ArrayList<>();
    List<Integer> combineList = new ArrayList<>();
    backtracking(combineList, combinations, 1, k, n);
    return combinations;
  }

  private void backtracking(List<Integer> combineList, List<List<Integer>> combinations, int start,
      int k, final int n) {
    if (k == 0) {
      combinations.add(new ArrayList<>(combineList));
      return;
    }
    for (int i = start; i <= n - k + 1; i++) {  // 剪枝
      combineList.add(i);
      backtracking(combineList, combinations, i + 1, k - 1, n);
      combineList.remove(combineList.size() - 1);
    }
  }

}
