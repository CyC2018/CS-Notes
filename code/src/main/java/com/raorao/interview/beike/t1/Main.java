package com.raorao.interview.beike.t1;

import java.util.Arrays;
import java.util.Comparator;
import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-18-19:53
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    String line1 = scanner.nextLine();
    String[] items = line1.split(" ");
    int n = Integer.parseInt(items[0]);
    int p1 = Integer.parseInt(items[1]);
    int p2 = Integer.parseInt(items[2]);
    int p3 = Integer.parseInt(items[3]);
    int t1 = Integer.parseInt(items[4]);
    int t2 = Integer.parseInt(items[5]);
    Interval[] intervals = new Interval[n];
    for (int i = 0; i < n; i++) {
      String[] temp = scanner.nextLine().split(" ");
      intervals[i] = new Interval(Integer.parseInt(temp[0]), Integer.parseInt(temp[1]));
    }
    System.out.println(compute(n, p1, p2, p3, t1, t2, intervals));


  }

  public static int compute(int n, int p1, int p2, int p3, int t1, int t2, Interval[] intervals) {
    int count = 0;
    Arrays.sort(intervals, Comparator.comparingInt(e -> e.end));
    for (int i = 0; i < n; i++) {
      count += p1 * (intervals[i].end - intervals[i].start);
      if (i < n - 1) {
        count += intevalSum(p1, p2, p3,t1, t2,  intervals[i + 1].start - intervals[i].end);
      }
    }
    return count;
  }

  public static int intevalSum(int p1, int p2, int p3, int t1, int t2,  int interval) {
    if (interval <= 0) {
      return 0;
    } else if (interval <= t1) {
      return p1 * interval;
    } else if (interval <= t1 + t2) {
      return p1 * t1 + p2 * (interval - t1);
    } else {
      return p1 * t1 + p2 * t2 + p3 * (interval - t1 - t2);
    }
  }

  static class Interval {

    int end;
    private int start;

    public Interval(int start, int end) {
      this.start = start;
      this.end = end;
    }
  }
}
