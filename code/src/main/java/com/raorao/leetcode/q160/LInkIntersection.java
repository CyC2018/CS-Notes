package com.raorao.leetcode.q160;

/**
 * 寻找链表相交的点.
 *
 * @author Xiong Raorao
 * @since 2018-09-02-17:42
 */
public class LInkIntersection {

  /**
   * 第一种方法，两个链表逐个遍历
   */
  public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
    ListNode listA = headA;
    ListNode listB = headB;
    while (listA != listB) {
      listA = listA == null ? headB : listA.next;
      listB = listB == null ? headA : listB.next;
    }
    return listA;
  }

  /**
   * 第二种方法：将其中的一个链表的尾巴连接到另外一个头，寻找链表的环入口。
   */

  public ListNode solution2(ListNode headA, ListNode headB) {
    if(headA == null || headB == null){
      return null;
    }
    ListNode tailA = headA;
    while (tailA.next != null) {
      tailA = tailA.next;
    }
    tailA.next = headB; // A的结尾接上B,接下来寻找环节点
    ListNode slow = headA;
    ListNode fast = headA;
    while (fast != null && fast.next != null){
      slow = slow.next;
      fast = fast.next.next;
      if(slow == fast){
        break;
      }
    }
    // 得到相遇点，slow置位链表头，fast和slow速度一致
    if(fast == null || fast.next == null){
      return null;
    }
    slow = headA;
    while (slow != fast){
      slow = slow.next;
      fast = fast.next;
    }
    return slow;
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
