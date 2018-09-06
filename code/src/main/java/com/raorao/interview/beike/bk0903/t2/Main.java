package com.raorao.interview.beike.bk0903.t2;

import java.util.Arrays;
import java.util.Comparator;
import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-03-19:39
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int n = Integer.parseInt(scanner.nextLine());
    Point[] points = new Point[n];
    for (int i = 0; i < n; i++) {
      String[] line = scanner.nextLine().split(" ");
      points[i] = new Point(Integer.parseInt(line[0]), Integer.parseInt(line[1]));
    }
    //Arrays.sort(points, Comparator.comparing(e -> e.x));
    process(n, points);
  }

  private static void process(int n, Point[] points) {
    int[] res = new int[n];
    for (int i = 0; i < n; i++) {
      int count = 1;
      int tmp = points[i].h + points[i].x;
      for (int j = 0; j < n; j++) {
        if (i != j && points[i].x < points[j].x && tmp >= points[j].x) {
          count++;
        }
      }
      if(i == n-1){
        count--;
      }
      res[i] = count;
    }
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < n; i++) {
      if (i == n - 1) {
        sb.append(res[i]);
      } else {
        sb.append(res[i]).append(" ");
      }
    }
    System.out.println(sb.toString());
  }

  static class Point {

    int x;
    int h;

    public Point(int x, int h) {
      this.x = x;
      this.h = h;
    }
  }
}
