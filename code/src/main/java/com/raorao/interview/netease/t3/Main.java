package com.raorao.interview.netease.t3;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-08-16:18
 */
public class Main {

  private static ArrayList<Vote> votes = new ArrayList<>();

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int n = scanner.nextInt();
    int m = scanner.nextInt();
    for (int i = 0; i < n; i++) {
      votes.add(new Vote(scanner.nextInt(), scanner.nextInt()));
    }

    votes.sort(Comparator.comparingInt(e -> e.yy));
    int count = 0;
    for (int i = 0; i < votes.size(); i++) {
      if (check(m)) {
        break;
      }
      int x = votes.get(i).xx;
      int y = votes.get(i).yy;
      if (x != 1) {
        x = 1;
        votes.set(i, new Vote(x, y));
        count += y;
      }
    }
    System.out.println(count);

  }

  private static boolean check(int m) {
    Map<Integer, Integer> map = new HashMap<>();
    for (Vote v : votes) {
      map.put(v.xx, map.getOrDefault(v.xx, 0) + 1);
    }

    int xxMax = Integer.MIN_VALUE;
    int yyMax = Integer.MIN_VALUE;
    for (Entry<Integer, Integer> entry : map.entrySet()) {
      if (entry.getValue() > yyMax) {
        xxMax = entry.getKey();
        yyMax = entry.getValue();
      }
    }
    if (map.entrySet().size() == m) {// 一人一票
      return false;
    }
    return xxMax == 1;
  }

  static class Vote {

    int xx;
    int yy;

    public Vote(int xx, int yy) {
      this.xx = xx;
      this.yy = yy;
    }

    public Vote() {
    }
  }
}
