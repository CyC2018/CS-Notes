package com.raorao.sword;

import java.util.ArrayList;
import java.util.Deque;
import java.util.LinkedList;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-06-10:28
 */
public class Solution03 {

  public ArrayList<Integer> printListFromTailToHead(ListNode listNode) {
    if (listNode == null) {
      return new ArrayList<>();
    }
    ListNode root = listNode;
    Deque<Integer> stack = new LinkedList<>();
    while (root != null) {
      stack.push(root.val);
      root = root.next;
    }
    ArrayList<Integer> ret = new ArrayList<>();
    while (!stack.isEmpty()) {
      ret.add(stack.pop());
    }
    return ret;
  }
}
