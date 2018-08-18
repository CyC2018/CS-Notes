package com.raorao.leetcode.q435;

import java.util.Arrays;
import java.util.Comparator;

/**
 * 题目描述：计算让一组区间不重叠所需要移除的最少区间个数.
 *
 * 贪心策略：计算最多能组成的不重叠区间个数，然后用区间总个数减去不重叠区间的个数。
 *
 * 在每次选择中，区间的结尾最为重要，选择的区间结尾越小，留给后面的区间的空间越大，那么后面能够选择的区间个数也就越大。
 *
 * 按区间的结尾进行排序，每次选择结尾最小，并且和前一个区间不重叠的区间。
 *
 * @author Xiong Raorao
 * @since 2018-08-16-22:00
 */
public class Solution {

  public static void main(String[] args) {

  }

  public int eraseOverlapIntervals(Interval[] intervals) {

    if (intervals.length == 0) {
      return 0;
    }
    Arrays.sort(intervals, Comparator.comparingInt(e -> e.end));
    int count = 1;
    int lastEnd = intervals[0].end;
    for (int i = 1; i < intervals.length; i++) {
      if (intervals[i].start < lastEnd) {
        continue;
      }
      lastEnd = intervals[i].end;
      count++;
    }
    return intervals.length - count;
  }

  static class Interval {

    int start;
    int end;

    Interval() {
      start = 0;
      end = 0;
    }

    Interval(int s, int e) {
      start = s;
      end = e;
    }
  }

}
