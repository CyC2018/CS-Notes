package com.raorao.interview.bytedance.q2;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-12-10:28
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int m = Integer.parseInt(scanner.nextLine());
    List<Node> nodes = new ArrayList<>();
    for (int i = 0; i < m; i++) {
      String[] input = scanner.nextLine().split(";");
      for (String s : input) {
        String[] t = s.split(",");
        int start = Integer.parseInt(t[0]);
        int end = Integer.parseInt(t[1]);
        nodes.add(new Node(start, end));
      }
    }
    List<Node> ret = process(nodes);

    while (process(ret).size() != ret.size()) {
      ret = process(ret);
    }

    // 排序
    ret.sort(Comparator.comparing(o -> o.start));
    StringBuilder sb = new StringBuilder();
    ret.forEach(e -> sb.append(e.start).append(",").append(e.end).append(";"));
    System.out.println(sb.toString().substring(0, sb.toString().length() - 1));
  }

  private static List<Node> process(List<Node> nodes) {
    List<Node> ret = new ArrayList<>();
    ret.add(nodes.get(0));
    int size = nodes.size();
    if (size == 1) {
      System.out.println(ret.get(0).start + "," + ret.get(0).end);
      return ret;
    }
    for (int i = 1; i < size; i++) {
      Node mNode = merge(ret, nodes.get(i));
      if (mNode == null) {
        ret.add(nodes.get(i));
      } else {
        ret.set(mNode.index, mNode);
      }
    }

    return ret;
  }

  private static Node merge(List<Node> nodes, Node b) {
    Node ret = null;
    for (int i = 0; i < nodes.size(); i++) {
      Node tmp = merge(nodes.get(i), b);
      if (tmp != null) {
        ret = tmp;
        ret.index = i;
      }
    }
    return ret;
  }

  private static Node merge(Node a, Node b) {
    if (a.equals(b)) {
      return a;
    }

    // 保证a在前，b在后
    if (a.start > b.start) {
      // 交换a
      Node tmp = a;
      a = b;
      b = tmp;
    }

    if (a.end < b.start) {
      return null;
    } else {
      if (a.end < b.end) {
        return new Node(a.start, b.end);
      }
      if (a.end > b.end) {
        return new Node(a.start, a.end);
      }
    }
    return null;
  }

  static class Node {

    Integer start;
    Integer end;
    int index;

    public Node(int start, int end) {
      this.start = start;
      this.end = end;
    }

    public boolean equals(Node obj) {
      if (obj == null) {
        return false;
      }
      if (start == obj.start && end == obj.end) {
        return true;
      }
      return false;
    }
  }


}
