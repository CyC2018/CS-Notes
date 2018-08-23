package com.raorao.leetcode.q547;

/**
 * 朋友圈.
 *
 * @author Xiong Raorao
 * @since 2018-08-22-17:08
 */
public class FriendCycle {

  public static void main(String[] args) {
    int[][] M = new int[][] {
        {1, 1, 0},
        {1, 1, 0},
        {0, 0, 1}};
    int result = new FriendCycle().findCircleNum(M);
    System.out.println(result);
  }

  public int findCircleNum(int[][] M) {
    if (M == null || M.length == 0) {
      return 0;
    }
    int n = M.length;// 朋友圈人数
    int num = 0;
    boolean[] hasVisited = new boolean[n];
    for (int i = 0; i < n; i++) {
      if (!hasVisited[i]) {
        dfs(M, hasVisited, i);
        num++;
      }
    }
    return num;
  }

  private void dfs(int[][] M, boolean[] hasVisited, int i) {
    hasVisited[i] = true;
    for (int k = 0; k < M.length; k++) {
      if (M[i][k] == 1 && !hasVisited[k]) {
        dfs(M, hasVisited, k);
      }
    }
  }
}
