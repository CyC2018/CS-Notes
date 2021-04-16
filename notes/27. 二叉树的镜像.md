# 27. 二叉树的镜像

[牛客网](https://www.nowcoder.com/practice/a9d0ecbacef9410ca97463e4a5c83be7?tpId=13&tqId=11171&tab=answerKey&from=cyc_github)

## 题目描述

<div align="center"> <img src="https://cs-notes-1256109796.cos.ap-guangzhou.myqcloud.com/0c12221f-729e-4c22-b0ba-0dfc909f8adf.jpg" width="300"/> </div><br>

## 解题思路

```java
public TreeNode Mirror(TreeNode root) {
    if (root == null)
        return root;
    swap(root);
    Mirror(root.left);
    Mirror(root.right);
    return root;
}

private void swap(TreeNode root) {
    TreeNode t = root.left;
    root.left = root.right;
    root.right = t;
}
```
