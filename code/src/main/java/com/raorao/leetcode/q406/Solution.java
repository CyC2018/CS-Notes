package com.raorao.leetcode.q406;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 根据身高和序号重组队列.
 *
 * 题目描述：一个学生用两个分量 (h, k) 描述，h 表示身高，k 表示排在前面的有 k 个学生的身高比他高或者和他一样高。\
 *
 * 思路：贪心算法，为了在每次插入操作时不影响后续的操作，身高较高的学生应该先做插入操作，否则身高较小的学生原先正确插入第 k 个位置可能会变成第 k+1 个位置。
 *
 * 身高降序、k 值升序，然后按排好序的顺序插入队列的第 k 个位置中。
 *
 * @author Xiong Raorao
 * @since 2018-08-17-15:22
 */
public class Solution {

  public static void main(String[] args) {
    int[][] input = new int[][] {{7, 0}, {4, 4}, {7, 1}, {5, 0}, {6, 1}, {5, 2}};

  }

    public static int[][] reconstructQueue(int[][] people) {
    if (people == null || people.length == 0 || people[0].length == 0) {
      return new int[0][0];
    }
    Arrays.sort(people, (a, b) -> a[0] == b[0] ? a[1] - b[1] : b[0] - a[0]); //升序排列就是小的放前面，大的放后面；
    List<int[]> queue = new ArrayList<>();
    for (int[] p : people) {
      queue.add(p[1], p);
    }

    return queue.toArray(new int[queue.size()][]);
  }
}
