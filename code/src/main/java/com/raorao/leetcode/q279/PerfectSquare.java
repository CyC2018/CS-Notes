package com.raorao.leetcode.q279;

import java.util.ArrayList;
import java.util.List;

/**
 * 完全平方数.
 *
 * 题目描述：给定正整数 n，找到若干个完全平方数（比如 1, 4, 9, 16, ...）使得它们的和等于 n。你需要让组成和的完全平方数的个数最少。
 *
 * @author Xiong Raorao
 * @since 2018-08-22-9:29
 */
public class PerfectSquare {

  public static void main(String[] args) {

  }

  private static List<Integer> generate(int n) {
    List<Integer> ret = new ArrayList<>();
    for (int i = 1; i * i < n; i++) {
      ret.add(i * i);
    }
    return ret;
  }
}
