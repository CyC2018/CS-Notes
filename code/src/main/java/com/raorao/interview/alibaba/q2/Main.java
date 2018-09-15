package com.raorao.interview.alibaba.q2;

import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-07-20:05
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    String[] temp = scanner.nextLine().split(",");
    Point target = new Point(Integer.parseInt(temp[0]), Integer.parseInt(temp[1]));
    temp = scanner.nextLine().split(",");

    int n = temp.length / 2;
    Point[] points = new Point[n];
    for (int i = 0; i < n; i += 2) {
      points[i] = new Point(Integer.parseInt(temp[i]), Integer.parseInt(temp[i + 1]));
    }

    int min = Integer.MAX_VALUE;
    int max = Integer.MIN_VALUE;
    for (int i = 0; i < n; i++) {

    }

  }

  private static double s(Point a, Point b, Point c) {
    double l1 = Math.sqrt((a.x - b.x) ^ 2 + (a.y - b.y) ^ 2);
    double l2 = Math.sqrt((a.x - c.x) ^ 2 + (a.y - c.y) ^ 2);
    double l3 = Math.sqrt((b.x - c.x) ^ 2 + (b.y - c.y) ^ 2);
    double p = (l1 + l2 + l3) / 2;
    return Math.sqrt(p * (p - l1) * (p - l2) * (p - l3));
  }

  static class Point {

    int x;
    int y;

    public Point() {
    }

    public Point(int x, int y) {
      this.x = x;
      this.y = y;
    }
  }
}
