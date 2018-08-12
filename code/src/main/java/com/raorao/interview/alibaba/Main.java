package com.raorao.interview.alibaba;

import java.util.Scanner;

/**
 * 从坐标原点出发，依次经过几个目标点，直到回到原点，问最短路径多少.
 *
 * @author Xiong Raorao
 * @since 2018-08-11-8:28
 */
public class Main {

  private static int times = 0;
  private static int minCost = Integer.MAX_VALUE;

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);

    // 初始化
    int N =  Integer.parseInt(scanner.nextLine());

    boolean[] mark = new boolean[N];
    Node[] nodes = new Node[N];
    for (int i = 0; i < N; i++) {
      String[] coordinate = scanner.nextLine().split(",");
      int x = Integer.parseInt(coordinate[0]);
      int y = Integer.parseInt(coordinate[1]);
      nodes[i] = new Node(x, y);
    }

    route(mark, nodes, -1, N, 0, 0);
    System.out.println(minCost);
  }

  public static int distance(Node from, Node to) {
    return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
  }

  /**
   * 求解路径
   * @param mark 标记该点是否走过
   * @param nodes 所有的坐标点
   * @param now 第几个目标点
   * @param N 总目标点数
   * @param step 已经走过的目标点数
   * @param cost 花费路程
   */
  private static void route(boolean[] mark, Node[] nodes, int now, int N, int step, int cost) {

    // 如果step == N 说明所有点一定都走过了
    if (step > N) {
      minCost = Math.min(minCost, cost + Math.abs(nodes[now].x) + Math.abs(nodes[now].y));
      return;
    }

    if (now >= 0 && mark[now]) {
      return;
    }

    if (now >= 0) {
      mark[now] = true;
    }

//        System.out.println(step + ": " + cost);

    for (int i = 0; i < N; i++) {
      route(mark, nodes, i, N, step + 1,
          cost + (now < 0 ? Math.abs(nodes[i].x) + Math.abs(nodes[i].y)
              : distance(nodes[i], nodes[now])));
    }

    if (now >= 0) {
      mark[now] = false;
    }
  }

  private static class Node {

    public int x;
    public int y;

    public Node(int x, int y) {
      this.x = x;
      this.y = y;
    }

  }

}
