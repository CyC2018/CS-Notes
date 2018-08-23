package com.raorao.leetcode.q257;

import java.util.ArrayList;
import java.util.List;

/**
 * 输出二叉树的叶子节点的路径.
 *
 * @author Xiong Raorao
 * @since 2018-08-23-8:24
 */
public class BinaryTreePath {

  public static void main(String[] args) {
    TreeNode root = new TreeNode(1);
    TreeNode left = new TreeNode(2);
    left.right = new TreeNode(5);
    TreeNode right = new TreeNode(3);
    root.left = left;
    root.right = right;
    List<String> str = new BinaryTreePath().binaryTreePaths(root);
    str.forEach(System.out::println);
  }

  public List<String> binaryTreePaths(TreeNode root) {
    List<String> path = new ArrayList<>();
    if (root == null) {
      return path;
    }
    List<TreeNode> values = new ArrayList<>();
    back(values, root, path);
    return path;
  }

  private void back(List<TreeNode> values, TreeNode root, List<String> path) {
    if (root == null) {
      return;
    }
    values.add(root);
    if (root.left == null && root.right == null) {
      path.add(build(values));
    }
    back(values, root.left, path);
    back(values, root.right, path);
    values.remove(root);
  }

  private String build(List<TreeNode> node) {
    StringBuilder sb = new StringBuilder();
    node.forEach(e -> sb.append(e.val).append("->"));
    String tmp = sb.toString();
    return tmp.substring(0, tmp.length() - 2);
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
