package com.raorao.interview.xiecheng.t3;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;
import java.util.Scanner;

/**
 * 输入： 2 p 1 1 p 2 2 g 1 p 2 102 p 3 3 g 1 g 2 g 3
 *
 * 输出： 1 1 -1 3 .
 *
 * @author Xiong Raorao
 * @since 2018-09-04-20:04
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int n = scanner.nextInt();
    scanner.nextLine();
    Op ops;
    D d = new D(n);
    while (scanner.hasNextLine()) {
      String[] tmp = scanner.nextLine().split(" ");
      char op = tmp[0].charAt(0);
      int key = Integer.parseInt(tmp[1]);
      int val = 0;
      if (tmp.length > 2) {
        val = Integer.parseInt(tmp[2]);
      }
      ops = new Op(op, key, val);
      if (ops.op == 'p') {
        d.put(ops.key, ops.val);
      } else if (ops.op == 'g') {
        int res = d.get(ops.key);
        System.out.println(res);
      }
    }
  }

  static class D {

    int size;
    Map<Integer, Integer> map;
    Queue<Integer> queue = new LinkedList<>();

    public D(int size) {
      this.size = size;
      map = new HashMap<>();
    }

    public void put(int key, int val) {
      if (map.size() <= size) {
        map.put(key, val);
        queue.add(key);
      } else {
        int k = queue.poll();
        map.remove(k);
        map.put(key, val);
        queue.remove(key);
        queue.add(key);
      }
    }

    public int get(int key) {
      int res = map.getOrDefault(key, -1);
      queue.remove(key);
      queue.add(key);
      return res;
    }
  }

  private static class Op {

    char op;
    int key;
    int val;

    public Op(char op, int key, int val) {
      this.op = op;
      this.key = key;
      this.val = val;
    }

    public Op() {
    }
  }


}
