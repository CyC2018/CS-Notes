package com.raorao.leetcode.q141;

import java.util.ArrayList;
import java.util.List;

/**
 * 判断链表是否存在环.
 *
 * 两种方法：一种采用外存来存储节点 另外一种，采用快慢指针的方法
 *
 * @author Xiong Raorao
 * @since 2018-08-20-15:49
 */
public class IsLinkCycle {


  public boolean hasCycle(ListNode head) {
    if (head == null) {
      return false;
    }
    List<ListNode> nodes = new ArrayList<>();
    ListNode node = head;
    while (node != null) {
      if (!nodes.contains(node)) {
        nodes.add(node);
        node = node.next;
      } else {
        return true;
      }
    }
    return false;
  }

  public boolean hasCycle2(ListNode head) {
    if (head == null || head.next == null) {
      return false;
    }
    ListNode slow = head;
    ListNode fast = head.next;
    while (fast != null && fast.next != null) {
      if (slow == fast) {
        return true;
      }
      slow = slow.next;
      fast = fast.next.next;
    }
    return false;
  }

  static class ListNode {

    int val;
    ListNode next;

    ListNode(int x) {
      val = x;
      next = null;
    }
  }
}
