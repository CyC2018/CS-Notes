package com.raorao.interview.beike.bk0903.t3;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-03-20:16
 */
public class Main {

  private static final int MAXN = 1 << 5 + 10;
  private static List<Edge> edges = new ArrayList<>();
  private static List<List<Integer>> g = new ArrayList<>(MAXN);
  private static List<List<Integer>> p = new ArrayList<>(MAXN);
  private static int dfsClock;
  private static int bccCnt;
  private static int[] pre = new int[MAXN];
  private static int[] T = new int[MAXN];
  private static List<List<Integer>> gg = new ArrayList<>(MAXN);
  private static int[] d = new int[MAXN];

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    String[] line1 = scanner.nextLine().split(" ");
    int n = Integer.parseInt(line1[0]);
    int m = Integer.parseInt(line1[1]);
    if (n + m == 0) {
      return;
    }
    for (int i = 0; i < m; i++) {
      String[] line = scanner.nextLine().split(" ");
      int a = Integer.parseInt(line[0]);
      int b = Integer.parseInt(line[1]);
      Edge e = new Edge(a, b);
      edges.add(e);
      e = new Edge(b, a);
      edges.add(e);
      int mm = edges.size();
      g.get(a-1).add(mm - 2);
      g.get(b-1).add(mm - 1);
    }
    findBcc(n);
    for (int i = 0; i < n; i++) {
      gg.get(i).clear();
    }
    for (int i = 1; i <= n; i++) {
      for (int j = 1; j < p.get(i).size(); j++) {
        int v = p.get(i).get(j);
        if (T[i] != T[v]) {
          gg.get(T[i]).add(T[v]);
        }
      }
    }
    Arrays.fill(d, 0);
    dfs(1, 1);
    int maxn = 0;
    int flag = 0;
    for (int i = 1; i < bccCnt; i++) {
      if (d[i] > maxn) {
        maxn = d[i];
        flag = i;
      }
    }
    Arrays.fill(d, 0);
    dfs(flag, 1);
    maxn = 0;
    for (int i = 1; i <= bccCnt; i++) {
      if (d[i] > maxn) {
        maxn = d[i];
      }
    }
    System.out.println(bccCnt - maxn);
  }

  private static int dfs1(int u, int fa) {
    int lowu = pre[u] = ++dfsClock;
    for (int i = 0; i < g.get(u).size(); i++) {
      int mm = g.get(u).get(i);
      int v = edges.get(mm).v;
      if (fa == (mm ^ 1)) {
        continue;
      }
      if (pre[v] == 0) {
        int lowv = dfs1(v, mm);
        lowu = Math.min(lowu, lowv);
        if (lowv > pre[u]) {
          p.get(v).add(u);
          p.get(u).add(v);
        }
      } else if (pre[v] < pre[u]) {
        lowu = Math.min(pre[v], lowu);
      }
    }
    return lowu;
  }

  private static void dfs2(int u, int fa) {
    T[u] = bccCnt;
    for (int i = 0; i < g.get(u).size(); i++) {
      int v = edges.get(g.get(u).get(i)).v;
      boolean f = true;
      for (int j = 0; j < p.get(u).size(); j++) {
        int vv = p.get(u).get(j);
        if (v == vv) {
          f = false;
          break;
        }
      }
      if (!f || T[v] != 0) {
        continue;
      }
      dfs2(v, u);
    }
  }

  private static void findBcc(int n) {
    dfsClock = 0;
    bccCnt = 0;
    Arrays.fill(pre, 0);
    Arrays.fill(T, 0);
    for (int i = 1; i <= n; i++) {
      if (pre[i] == 0) {
        dfs1(i, -1);
      }
    }
    for (int i = 1; i <= n; i++) {
      if (T[i] == 0) {
        bccCnt++;
        dfs2(i, -1);
      }
    }
  }

  private static void dfs(int u, int dep) {
    d[u] = dep;
    for (int i = 0; i < gg.get(u).size(); i++) {
      int v = gg.get(u).get(i);
      if (d[v] == 0) {
        dfs(v, dep + 1);
      }
    }
  }

  static class Edge {

    int u;
    int v;

    public Edge() {
    }

    public Edge(int a, int b) {
      u = a;
      v = b;
    }
  }
}
