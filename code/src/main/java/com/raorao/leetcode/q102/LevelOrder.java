package com.raorao.leetcode.q102;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import java.util.Stack;

/**
 * 二叉树的层次遍历.
 *
 * @author Xiong Raorao
 * @since 2018-08-22-10:43
 */
public class LevelOrder {

  public static void main(String[] args) {

  }

  public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> ret = new ArrayList<>();
    if (root == null) {
      return ret;
    }
    Queue<TreeNode> queue = new LinkedList<>();
    queue.add(root);
    while (!queue.isEmpty()) {
      int levelSize = queue.size();
      List<Integer> levelList = new ArrayList<>();
      while (levelSize-- > 0) {
        TreeNode node = queue.poll();
        if (node != null) {
          levelList.add(node.val);
          if (node.left != null) {
            queue.add(node.left);
          }
          if (node.right != null) {
            queue.add(node.right);
          }
        }
      }
      ret.add(levelList);
    }
    return ret;
  }

  public List<List<Integer>> levelOrderBottom(TreeNode root) {
    List<List<Integer>> ret = new ArrayList<>();
    if (root == null) {
      return ret;
    }
    Queue<TreeNode> queue = new LinkedList<>();
    queue.add(root);
    Stack<List<Integer>> listStack = new Stack<>();
    while (!queue.isEmpty()) {
      int levelSize = queue.size();
      List<Integer> levelList = new ArrayList<>();
      while (levelSize-- > 0) {
        TreeNode node = queue.poll();
        if (node != null) {
          levelList.add(node.val);
          if (node.left != null) {
            queue.add(node.left);
          }
          if (node.right != null) {
            queue.add(node.right);
          }
        }
      }
      listStack.add(levelList);
    }
    while (!listStack.isEmpty()) {
      ret.add(listStack.pop());
    }
    return ret;
  }


  static class TreeNode {

    int val;
    TreeNode left;
    TreeNode right;

    TreeNode(int x) {
      val = x;
    }
  }

}
