package com.raorao.leetcode.q002;

import java.util.List;

/**
 * 两数相加.
 *
 * 给定两个非空链表来表示两个非负整数。位数按照逆序方式存储，它们的每个节点只存储单个数字。将两数相加返回一个新的链表。
 *
 * @author Xiong Raorao
 * @since 2018-08-20-17:27
 */
public class AddTwoNumbers {

  public static void main(String[] args) {
//    ListNode l1 = new ListNode(2);
//    l1.next = new ListNode(4);
//    l1.next.next = new ListNode(3);
//    ListNode l2 = new ListNode(5);
//    l2.next = new ListNode(6);
//    l2.next.next = new ListNode(4);
    ListNode l1 = new ListNode(5);
    ListNode l2 = new ListNode(5);
    ListNode ret = new AddTwoNumbers().addTwoNumbers(l1, l2);
    while (ret != null) {
      System.out.print(ret.val + " ");
      ret = ret.next;
    }
  }

  public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    int bit = 0; // 进位标识
    ListNode ret = new ListNode(0);
    ListNode root = ret;
    ListNode node1 = l1;
    ListNode node2 = l2;
    while (node1 != null || node2 != null || bit > 0) {
      int sum = 0;
      if (node1 != null && node2 != null) {
        sum = node1.val + node2.val + bit;
      } else if (node2 != null) {
        sum = node2.val + bit;
      } else if (node1 != null) {
        sum = node1.val + bit;
      } else {
        sum = bit;
      }

      if (sum > 9) {
        bit = sum / 10;
        // 链表尾插法
        ret.next = new ListNode(sum % 10);
        ret = ret.next;
      } else {
        ret.next = new ListNode(sum);
        ret = ret.next;
        bit = 0;
      }
      if (node1 != null) {
        node1 = node1.next;
      }
      if (node2 != null) {
        node2 = node2.next;
      }
    }

    return root.next;
  }

  static class ListNode {

    int val;
    ListNode next;

    ListNode(int x) {
      val = x;
    }
  }
}
