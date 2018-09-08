package com.raorao.sword;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-06-10:15
 */
public class Test {

  public static void main(String[] args) {
    //test01();
    //test03();
    test06();
  }

  public static void test01() {
    Solution01 s = new Solution01();
    int[][] data = new int[][] {
        {1, 2, 8, 9},
        {2, 4, 9, 12},
        {4, 7, 10, 13},
        {6, 8, 11, 15}
    };
    boolean r = s.Find(7, data);
    System.out.println(r);
  }

  public static void test03() {
    Solution03 s = new Solution03();
    ListNode root = new ListNode(67);
    root.next = new ListNode(0);
    root.next.next = new ListNode(24);
    root.next.next.next = new ListNode(58);
    ArrayList<Integer> ret = s.printListFromTailToHead(root);
    System.out.println(Arrays.toString(ret.toArray()));
  }

  public static void test06() {
    Solution06 s = new Solution06();
    int[] array = new int[] {3, 4, 5, 1, 2};
    int r = s.minNumberInRotateArray(array);
    System.out.println(r);
  }
}
