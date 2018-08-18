package com.raorao.leetcode.q452;

import java.util.Arrays;
import java.util.Comparator;

/**
 * 用最少数量的箭引爆气球.
 *
 * 思路：其实和计算不重叠区间的是一样的，
 *
 * @author Xiong Raorao
 * @since 2018-08-17-14:53
 */
public class Solution {

  public int findMinArrowShots(int[][] points) {
    if (points == null || points.length == 0) {
      return 0;
    }
    Point[] p = new Point[points.length];
    for (int i = 0; i < points.length; i++) {
      p[i] = new Point(points[i][0], points[i][1]);
    }
    Arrays.sort(p, Comparator.comparingInt(e -> e.end));
    int count = 1;
    int lastEnd = p[0].end;
    for (int i = 1; i < p.length; i++) {
      if (p[i].start <= lastEnd) {
        continue;
      }
      lastEnd = p[i].end;
      count++;
    }
    return p.length - count;
  }

  static class Point {

    int start;
    int end;


    public Point(int start, int end) {
      this.start = start;
      this.end = end;
    }
  }
}
