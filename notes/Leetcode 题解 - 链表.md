# Leetcode 题解 - 链表

链表是由节点组成的数据结构，每个节点包含一个值和一个指向下一个节点的指针，因此很多链表相关的问题可以通过递归来解决。以下是一些常见的链表题解。

## 1. 找出两个链表的交点

**题目编号**: 160 - Intersection of Two Linked Lists (简单)

[Leetcode](https://leetcode.com/problems/intersection-of-two-linked-lists/description/) / [力扣](https://leetcode-cn.com/problems/intersection-of-two-linked-lists/description/)

给定两个链表 A 和 B，如果它们相交，则返回相交的节点。如果不相交，则返回 null。相交的情况可以用两个链表的尾部公共部分进行描述，长度分别为 a + c 和 b + c，其中 c 是公共的部分。

我们可以使用两个指针来解决这个问题。以下是实现代码：

```java
public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
    ListNode l1 = headA, l2 = headB;
    while (l1 != l2) {
        l1 = (l1 == null) ? headB : l1.next;
        l2 = (l2 == null) ? headA : l2.next;
    }
    return l1; // 当 l1 == l2 时，这就是交点（或都是 null）
}
```

**思路**：
- 先同时遍历两个链表。
- 如果一个链表遍历完了，就从另一个链表的头部开始遍历。
- 通过这种方式，如果有交点，最终两个指针将会在交点相遇；如果没有交点，则两个指针最终都将为 null。

## 2. 链表反转

**题目编号**: 206 - Reverse Linked List (简单)

[Leetcode](https://leetcode.com/problems/reverse-linked-list/description/) / [力扣](https://leetcode-cn.com/problems/reverse-linked-list/description/)

我们可以通过递归或迭代的方式反转链表。以下是两种方法的实现：

**递归法**：

```java
public ListNode reverseList(ListNode head) {
    if (head == null || head.next == null) {
        return head; // 递归结束条件
    }
    ListNode newHead = reverseList(head.next); // 递归反转后续部分
    head.next.next = head; // 将当前节点指向其前一个节点
    head.next = null; // 将当前节点的后继指针设为 null
    return newHead; // 返回新头节点
}
```

**头插法**：

```java
public ListNode reverseList(ListNode head) {
    ListNode newHead = null; // 新链表的头
    while (head != null) {
        ListNode next = head.next; // 先保存后继节点
        head.next = newHead; // 将当前节点反转
        newHead = head; // 移动新链表的头
        head = next; // 移动到下一个节点
    }
    return newHead; // 返回新链表的头
}
```

## 3. 归并两个有序的链表

**题目编号**: 21 - Merge Two Sorted Lists (简单)

[Leetcode](https://leetcode.com/problems/merge-two-sorted-lists/description/) / [力扣](https://leetcode-cn.com/problems/merge-two-sorted-lists/description/)

将两个有序链表合并成一个新的有序链表，并返回新的链表。新的链表是通过拼接在原链表的节点上得到的。

```java
public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    if (l1 == null) return l2; // 如果 l1 为空，直接返回 l2
    if (l2 == null) return l1; // 如果 l2 为空，直接返回 l1
    if (l1.val < l2.val) {
        l1.next = mergeTwoLists(l1.next, l2); // 递归合并
        return l1; // 返回 l1 作为头节点
    } else {
        l2.next = mergeTwoLists(l1, l2.next); // 递归合并
        return l2; // 返回 l2 作为头节点
    }
}
```

## 4. 从有序链表中删除重复节点

**题目编号**: 83 - Remove Duplicates from Sorted List (简单)

[Leetcode](https://leetcode.com/problems/remove-duplicates-from-sorted-list/description/) / [力扣](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-list/description/)

给定一个有序链表，删除重复的节点，使每个元素只出现一次。

```java
public ListNode deleteDuplicates(ListNode head) {
    if (head == null || head.next == null) return head; // 如果链表为空或只有一个节点，返回
    head.next = deleteDuplicates(head.next); // 递归删除后续重复节点
    return head.val == head.next.val ? head.next : head; // 检查当前节点是否重复
}
```

## 5. 删除链表的倒数第 n 个节点

**题目编号**: 19 - Remove Nth Node From End of List (中等)

[Leetcode](https://leetcode.com/problems/remove-nth-node-from-end-of-list/description/) / [力扣](https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/description/)

删除链表中的倒数第 n 个节点。

```java
public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode fast = head;
    while (n-- > 0) { // 快指针先走 n 步
        fast = fast.next;
    }
    if (fast == null) return head.next; // 删除的节点为头节点
    ListNode slow = head;
    while (fast.next != null) { // 找到倒数第 n 个节点的前一个节点
        fast = fast.next;
        slow = slow.next;
    }
    slow.next = slow.next.next; // 删除节点
    return head; // 返回头节点
}
```

## 6. 交换链表中的相邻结点

**题目编号**: 24 - Swap Nodes in Pairs (中等)

[Leetcode](https://leetcode.com/problems/swap-nodes-in-pairs/description/) / [力扣](https://leetcode-cn.com/problems/swap-nodes-in-pairs/description/)

给定链表 1->2->3->4，应该返回 2->1->4->3。

```java
public ListNode swapPairs(ListNode head) {
    ListNode dummy = new ListNode(-1); // 虚拟头节点
    dummy.next = head;
    ListNode pre = dummy; // 先定义 pre 为虚拟头节点
    while (pre.next != null && pre.next.next != null) {
        ListNode l1 = pre.next; // 第一个节点
        ListNode l2 = pre.next.next; // 第二个节点
        ListNode next = l2.next; // 保存后续节点
        l1.next = next; // 将第一个节点的后继指向后续节点
        l2.next = l1; // 将第二个节点的后继指向第一个节点
        pre.next = l2; // 将预指针指向新的头节点
        pre = l1; // 移动 pre 指针
    }
    return dummy.next; // 返回新链表的头节点
}
```

## 7. 链表求和

**题目编号**: 445 - Add Two Numbers II (中等)

[Leetcode](https://leetcode.com/problems/add-two-numbers-ii/description/) / [力扣](https://leetcode-cn.com/problems/add-two-numbers-ii/description/)

给定两个链表表示两个非负整数，按逆序存储。计算它们的和并返回一个新的链表。

```java
public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    Stack<Integer> l1Stack = buildStack(l1);
    Stack<Integer> l2Stack = buildStack(l2);
    ListNode head = new ListNode(0); // 虚拟头节点
    int carry = 0; // 进位
    while (!l1Stack.isEmpty() || !l2Stack.isEmpty() || carry != 0) {
        int x = l1Stack.isEmpty() ? 0 : l1Stack.pop(); // 弹出 l1 的值
        int y = l2Stack.isEmpty() ? 0 : l2Stack.pop(); // 弹出 l2 的值
        int sum = x + y + carry; // 计算总和
        ListNode node = new ListNode(sum % 10); // 创建新节点
        node.next = head.next;
        head.next = node; // 将新节点放到头部
        carry = sum / 10; // 更新进位
    }
    return head.next; // 返回结果链表
}

private Stack<Integer> buildStack(ListNode l) {
    Stack<Integer> stack = new Stack<>();
    while (l != null) {
        stack.push(l.val); // 将值压入栈中
        l = l.next;
    }
    return stack;
}
```

## 8. 回文链表

**题目编号**: 234 - Palindrome Linked List (简单)

[Leetcode](https://leetcode.com/problems/palindrome-linked-list/description/) / [力扣](https://leetcode-cn.com/problems/palindrome-linked-list/description/)

判断链表是否为回文链表。要求以 O(1) 的空间复杂度实现。

我们可以在链表中间断开，然后反转后半部分，比较两半部分是否相等。

```java
public boolean isPalindrome(ListNode head) {
    if (head == null || head.next == null) return true; // 只有一个节点时返回 true
    ListNode slow = head, fast = head.next;
    while (fast != null && fast.next != null) { // 快慢指针找到中间节点
        slow = slow.next;
        fast = fast.next.next;
    }
    if (fast != null) slow = slow.next; // 如果是奇数节点，使 slow 移动到第二个中间节点
    ListNode secondHalf = reverse(slow); // 反转后半部分
    ListNode copySecondHalf = secondHalf; // 保存反转后的第二部分作为比较用
    while (head != null && secondHalf != null) {
        if (head.val != secondHalf.val) return false; // 比较
        head = head.next;
        secondHalf = secondHalf.next;
    }
    reverse(copySecondHalf); // 反转回原来的链表
    return true; // 如果相等，返回 true
}

private ListNode reverse(ListNode head) {
    ListNode newHead = null; 
    while (head != null) {
        ListNode nextNode = head.next; // 设置后继节点
        head.next = newHead; // 反转指向
        newHead = head; // 移动新头节点
        head = nextNode; 
    }
    return newHead; // 返回反转后的头节点
}
```

## 9. 分隔链表

**题目编号**: 725 - Split Linked List in Parts (中等)

[Leetcode](https://leetcode.com/problems/split-linked-list-in-parts/description/) / [力扣](https://leetcode-cn.com/problems/split-linked-list-in-parts/description/)

将链表分成 k 个部分。每部分的长度尽量相等，前面的部分可能比后面的部分多一个节点。

```java
public ListNode[] splitListToParts(ListNode root, int k) {
    int N = 0;
    ListNode cur = root;
    while (cur != null) { // 计算链表长度
        N++;
        cur = cur.next;
    }
    int mod = N % k; // 多余的节点数量
    int size = N / k; // 每部分的基本长度
    ListNode[] ret = new ListNode[k]; // 存储结果
    cur = root;
    for (int i = 0; cur != null && i < k; i++) {
        ret[i] = cur; // 保存当前部分的头
        int curSize = size + (mod-- > 0 ? 1 : 0); // 当前部分的大小
        for (int j = 0; j < curSize - 1; j++) {
            cur = cur.next; // 移动到当前部分的末尾
        }
        ListNode next = cur.next; // 保存下一个部分的头
        cur.next = null; // 断开当前部分
        cur = next; // 移动到下一个部分的头
    }
    return ret; // 返回结果
}
```

## 10. 链表元素按奇偶聚集

**题目编号**: 328 - Odd Even Linked List (中等)

[Leetcode](https://leetcode.com/problems/odd-even-linked-list/description/) / [力扣](https://leetcode-cn.com/problems/odd-even-linked-list/description/)

给定一个链表，将所有奇数节点放在前面，偶数节点放在后面，并保持相对顺序不变。

```java
public ListNode oddEvenList(ListNode head) {
    if (head == null) return head; // 如果链表为空，返回
    ListNode odd = head, even = head.next, evenHead = even; // 分别指向奇数节点头和偶数节点头
    while (even != null && even.next != null) {
        odd.next = odd.next.next; // 奇数节点的下一个指向下一个奇数节点
        odd = odd.next; // 移动奇数节点指针
        even.next = even.next.next; // 偶数节点的下一个指向下一个偶数节点
        even = even.next; // 移动偶数节点指针
    }
    odd.next = evenHead; // 连接奇数部分和偶数部分
    return head; // 返回头节点
}
```

以上是常见的链表题解及其详细说明，希望对你理解链表的相关操作和解题思路有所帮助！