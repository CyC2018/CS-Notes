package com.raorao.leetcode.q455;

import java.util.Arrays;

/**
 * 贪心算法、分配饼干问题.
 *
 * 输入：小孩的胃口和饼干的大小
 *
 * @author Xiong Raorao
 * @since 2018-08-16-21:46
 */
public class AssignCookie {

  public static void main(String[] args) {

  }

  public int findContentChildren(int[] g, int[] s) {
    Arrays.sort(g);
    Arrays.sort(s);
    // 先将小孩和饼干排序，先满足胃口小的
    int gi = 0;
    int si = 0;
    while (gi < g.length && si < s.length) {
      if (g[gi] <= s[si]) {
        gi++;
      }
      si++;
    }
    return gi;
  }

}
