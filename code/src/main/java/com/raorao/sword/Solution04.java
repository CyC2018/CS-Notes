package com.raorao.sword;

/**
 * 重建二叉树.
 *
 * 已知前序和中序遍历，重建二叉树
 *
 * @author Xiong Raorao
 * @since 2018-09-06-10:38
 */
public class Solution04 {

  public TreeNode reConstructBinaryTree(int[] pre, int[] in) {
    if (pre == null || in == null || pre.length != in.length) {
      return null;
    }
    return construct(pre, in, 0, pre.length - 1, 0, in.length - 1);
  }

  private TreeNode construct(int[] pre, int[] in, int preStart, int preEnd, int inStart,
      int inEnd) {
    // 递归终止条件
    if (preStart > preEnd || inStart > inEnd) {
      return null;
    }

    int rootValue = pre[preStart];
    TreeNode root = new TreeNode(rootValue);

    // 找到根节点在中序遍历的位置
    int rootInorder = inStart;
    while (true) {
      if (in[rootInorder] == rootValue) {
        int leftLength = rootInorder - inStart;
        root.left = construct(pre, in, preStart + 1, preStart + leftLength, inStart,
            rootInorder - 1);
        root.right = construct(pre, in, preStart + leftLength + 1, preEnd, rootInorder + 1, inEnd);
        break;
      } else {
        rootInorder++;
      }
    }
    return root;
  }
}
