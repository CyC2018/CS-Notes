package com.raorao.java.althorithm.bintree;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * 二叉树的层次遍历.
 *
 * 描述：输入一个二叉树的根节点，输出
 *
 * @author Xiong Raorao
 * @since 2018-08-11-10:50
 */
public class LevelOrder {


  public static void main(String[] args) {
    TreeNode root = new TreeNode(1);
    TreeNode left = new TreeNode(2);
    left.left = new TreeNode(4);
    root.left = left;
    TreeNode right = new TreeNode(3);
    right.right = new TreeNode(5);
    root.right = right;

    List<List<Integer>> ret = levelOrder(root);
    ret.stream().forEach(e -> {
      e.stream().forEach(f -> System.out.print(f + "\t"));
      System.out.println();
    });
  }


  public static List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> ret = new ArrayList<>();
    if (root == null) {
      return ret;
    }
    LinkedList<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    List<Integer> level = new ArrayList<>();
    int flag = 0;
    while (!queue.isEmpty()) {
      TreeNode node = queue.poll();
      System.out.print(node.val + " ");
      flag--;
      if(flag == 0){
        System.out.println();
      }
      if (level.size() > 0) {
        ret.add(level);
      }
      if (node.left != null) {
        queue.offer(node.left);
      }
      if (node.right != null) {
        queue.offer(node.right);
      }
      flag = queue.size();

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
