# Leetcode 题解 - 图

<!-- GFM-TOC -->
* [Leetcode 题解 - 图](#leetcode-题解---图)
    * [二分图](#二分图)
        * [1. 判断是否为二分图](#1-判断是否为二分图)
    * [拓扑排序](#拓扑排序)
        * [1. 课程安排的合法性](#1-课程安排的合法性)
        * [2. 课程安排的顺序](#2-课程安排的顺序)
    * [并查集](#并查集)
        * [1. 冗余连接](#1-冗余连接)
<!-- GFM-TOC -->

## 二分图

**二分图**是指可以将图的节点分为两个独立的集合，使得图中同一集合的任意两个节点均不相邻。若可以用两种颜色对图中的节点进行着色，并确保相邻的节点颜色不同，则该图为二分图。

### 1. 判断是否为二分图

**题目：** 785\. Is Graph Bipartite? (中等)

[Leetcode链接](https://leetcode.com/problems/is-graph-bipartite/description/) / [力扣链接](https://leetcode-cn.com/problems/is-graph-bipartite/description/)

#### 示例

输入：
```html
[[1,3], [0,2], [1,3], [0,2]]
```
输出：`true`
解释：图的结构如下：
```
0----1
|    |
|    |
3----2
```
我们可以将节点划分为两个组：{0, 2} 和 {1, 3}。

输入：
```html
[[1,2,3], [0,2], [0,1,3], [0,2]]
```
输出：`false`
解释：图的结构如下：
```
0----1
| \  |
|  \ |
3----2
```
无法将节点集划分为两个独立的子集。

#### 解法

我们可以使用深度优先搜索 (DFS) 来判断图是否为二分图。以下是具体实现的代码：

```java
import java.util.Arrays;

public boolean isBipartite(int[][] graph) {
    int[] colors = new int[graph.length];
    Arrays.fill(colors, -1);  // 初始化所有节点的颜色为 -1 (未着色)
    for (int i = 0; i < graph.length; i++) {
        // 对于每个节点，如果未着色，则尝试着色
        if (colors[i] == -1 && !isBipartite(i, 0, colors, graph)) {
            return false;  // 发现冲突，返回 false
        }
    }
    return true;  // 所有节点均可合法着色
}

private boolean isBipartite(int curNode, int curColor, int[] colors, int[][] graph) {
    if (colors[curNode] != -1) {
        return colors[curNode] == curColor;  // 如果已经着色，检查颜色是否一致
    }
    
    colors[curNode] = curColor;  // 着色当前节点
    
    // 遍历当前节点的所有邻接节点
    for (int nextNode : graph[curNode]) {
        // 递归检测邻接节点
        if (!isBipartite(nextNode, 1 - curColor, colors, graph)) {
            return false;  // 发现冲突，返回 false
        }
    }
    return true;  // 当前节点及其邻接节点合法着色
}
```

## 拓扑排序

拓扑排序是用于处理有向无环图 (DAG) 的一种排序方式，常用于先序关系的任务规划中。

### 1. 课程安排的合法性

**题目：** 207\. Course Schedule (中等)

[Leetcode链接](https://leetcode.com/problems/course-schedule/description/) / [力扣链接](https://leetcode-cn.com/problems/course-schedule/description/)

#### 示例

输入：
```html
2, [[1,0]]
```
输出：`true`

输入：
```html
2, [[1,0],[0,1]]
```
输出：`false`

**题目描述：** 给定一个课程列表及其先修课程，判断是否可能完成所有课程。此题无需使用拓扑排序，只需判断有向图中是否存在环。

#### 解法

使用深度优先搜索 (DFS) 检查是否存在环。以下是具体实现的代码：

```java
import java.util.ArrayList;
import java.util.List;

public boolean canFinish(int numCourses, int[][] prerequisites) {
    List<Integer>[] graph = new List[numCourses];
    for (int i = 0; i < numCourses; i++) {
        graph[i] = new ArrayList<>();
    }
    // 构建图的邻接表
    for (int[] pre : prerequisites) {
        graph[pre[0]].add(pre[1]);
    }

    boolean[] globalMarked = new boolean[numCourses];  // 全局标记
    boolean[] localMarked = new boolean[numCourses];   // 局部标记

    for (int i = 0; i < numCourses; i++) {
        if (hasCycle(globalMarked, localMarked, graph, i)) {
            return false;  // 存在环，返回 false
        }
    }
    return true;  // 所有课程合法，无环
}

private boolean hasCycle(boolean[] globalMarked, boolean[] localMarked, List<Integer>[] graph, int curNode) {
    if (localMarked[curNode]) {
        return true;  // 如果当前节点已在局部标记中，说明存在环
    }
    if (globalMarked[curNode]) {
        return false;  // 如果已经全局标记，则不再需检查
    }
    
    globalMarked[curNode] = true;  // 标记当前节点为全局已访问
    localMarked[curNode] = true;    // 标记当前节点为局部已访问
    
    for (int nextNode : graph[curNode]) {
        if (hasCycle(globalMarked, localMarked, graph, nextNode)) {
            return true;  // 发现环，返回 true
        }
    }
    localMarked[curNode] = false;  // 当前节点出栈，局部标记恢复
    return false;  // 无环，返回 false
}
```

### 2. 课程安排的顺序

**题目：** 210\. Course Schedule II (中等)

[Leetcode链接](https://leetcode.com/problems/course-schedule-ii/description/) / [力扣链接](https://leetcode-cn.com/problems/course-schedule-ii/description/)

#### 示例

输入：
```html
4, [[1,0],[2,0],[3,1],[3,2]]
```
输出：`[0,1,2,3]` 或 `[0,2,1,3]`

**题目描述：** 给定课程及其先修课程，返回课程的一个合法学习顺序。使用深度优先搜索 (DFS) 进行拓扑排序，利用一个栈存储后序遍历的结果，对于任意先修关系 v -> w，后序遍历结果可以保证 w 先入栈，因此栈的逆序即为合法学习顺序。

#### 解法

以下是拓扑排序的实现代码：

```java
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

public int[] findOrder(int numCourses, int[][] prerequisites) {
    List<Integer>[] graph = new List[numCourses];
    for (int i = 0; i < numCourses; i++) {
        graph[i] = new ArrayList<>();
    }
    // 构建图的邻接表
    for (int[] pre : prerequisites) {
        graph[pre[0]].add(pre[1]);
    }

    Stack<Integer> postOrder = new Stack<>();  // 存储后序遍历结果
    boolean[] globalMarked = new boolean[numCourses];  // 全局标记
    boolean[] localMarked = new boolean[numCourses];   // 局部标记

    for (int i = 0; i < numCourses; i++) {
        if (hasCycle(globalMarked, localMarked, graph, i, postOrder)) {
            return new int[0];  // 存在环，返回空数组
        }
    }

    int[] orders = new int[numCourses];  // 课程顺序数组
    for (int i = numCourses - 1; i >= 0; i--) {
        orders[i] = postOrder.pop();  // 将栈中的元素存入结果数组
    }
    return orders;  // 返回课程学习顺序
}

private boolean hasCycle(boolean[] globalMarked, boolean[] localMarked, List<Integer>[] graph, int curNode, Stack<Integer> postOrder) {
    if (localMarked[curNode]) {
        return true;  // 发现环，返回 true
    }
    if (globalMarked[curNode]) {
        return false;  // 已遍历过，返回 false
    }
    
    globalMarked[curNode] = true;  // 标记当前节点为全局已访问
    localMarked[curNode] = true;    // 标记当前节点为局部已访问
    
    for (int nextNode : graph[curNode]) {
        if (hasCycle(globalMarked, localMarked, graph, nextNode, postOrder)) {
            return true;  // 发现环，返回 true
        }
    }
    localMarked[curNode] = false;  // 当前节点出栈，局部标记恢复
    postOrder.push(curNode);  // 将当前节点入栈
    return false;  // 无环，返回 false
}
```

## 并查集

**并查集**（Union-Find）是一种常用的数据结构，用于处理动态连通性问题，能够高效地判断两个节点是否在同一集合中，并能合并两个集合。

### 1. 冗余连接

**题目：** 684\. Redundant Connection (中等)

[Leetcode链接](https://leetcode.com/problems/redundant-connection/description/) / [力扣链接](https://leetcode-cn.com/problems/redundant-connection/description/)

#### 示例

输入：
```html
[[1,2], [1,3], [2,3]]
```
输出：`[2,3]`
解释：图的结构如下：
```
  1
 / \
2 - 3
```
**题目描述：** 给定一组边，判断去掉一条边后，图能否成为一棵树。

#### 解法

使用并查集来解决此问题。以下是具体实现的代码：

```java
public int[] findRedundantConnection(int[][] edges) {
    int N = edges.length;
    UF uf = new UF(N);
    for (int[] e : edges) {
        int u = e[0], v = e[1];
        if (uf.connect(u, v)) {
            return e;  // 返回发现的冗余边
        }
        uf.union(u, v);  // 合并两个节点
    }
    return new int[]{-1, -1};  // 如果没有冗余连接
}

private class UF {
    private int[] id;

    UF(int N) {
        id = new int[N + 1];  // 节点编号从 1 开始
        for (int i = 0; i < id.length; i++) {
            id[i] = i;  // 初始化每个节点的父节点为其自身
        }
    }

    void union(int u, int v) {
        int uID = find(u);  // 查找 u 的根节点
        int vID = find(v);  // 查找 v 的根节点
        if (uID == vID) {
            return;  // 如果两节点已在同一集合，不进行合并
        }
        // 合并两个集合
        for (int i = 0; i < id.length; i++) {
            if (id[i] == uID) {
                id[i] = vID;  // 将 u 的所有子节点的父节点指向 v
            }
        }
    }

    int find(int p) {
        return id[p];  // 返回节点 p 的根节点
    }

    boolean connect(int u, int v) {
        return find(u) == find(v);  // 判断两个节点是否连通
    }
}
```

这段代码中，我们首先初始化并查集，然后遍历每条边，利用并查集的查找和合并操作来判断是否出现冗余连接，同时记录下来。最终返回冗余的边。