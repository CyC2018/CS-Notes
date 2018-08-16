package com.raorao.java.althorithm.offer;

import java.util.ArrayList;
import java.util.Stack;

/**
 * 从尾到头打印链表.
 *
 * @author Xiong Raorao
 * @since 2018-08-16-14:39
 */
public class PrintListEnd2Head {

  public static void main(String[] args) {

  }

  public ArrayList<Integer> printListFromTailToHead(ListNode listNode) {
    Stack<Integer> stack = new Stack<>();
    ArrayList<Integer> res = new ArrayList<>();
    while (listNode != null) {
      stack.push(listNode.val);
      listNode = listNode.next;
    }
    while (!stack.isEmpty()) {
      res.add(stack.pop());
    }
    return res;
  }

  static class ListNode {

    int val;
    ListNode next = null;

    ListNode(int val) {
      this.val = val;
    }
  }
}
