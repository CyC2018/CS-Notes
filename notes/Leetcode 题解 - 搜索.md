# Leetcode 题解 - 搜索

搜索算法广泛应用于树和图中，尤其是深度优先搜索（DFS）和广度优先搜索（BFS）。这些算法不仅限于图的遍历，它们也能够解决许多不同类型的问题，例如路径查找、组合问题，以及更复杂的约束条件问题。以下是对 BFS、DFS 和回溯算法的具体应用和实现例子。

## BFS（广度优先搜索）

广度优先搜索是一种从根节点开始，层层向外遍历的搜索算法。它在每一层中访问所有节点，所有访问的节点与上层节点的距离是相同的。BFS 通常使用队列实现，以便于逐层管理要访问的节点。

### 实现要点
- **队列**：用于存储待访问的节点。
- **标记访问**：为了防止重复访问，同样需要标记已经遍历过的节点。

### 1. 计算在网格中从原点到特定点的最短路径长度

**题目描述**：给定一个网格，其中`0`表示可以经过，`1`表示障碍。求从左上角到右下角的最短路径长度。

```java
public int shortestPathBinaryMatrix(int[][] grids) {
    if (grids == null || grids.length == 0 || grids[0].length == 0) {
        return -1;
    }
    
    // 定义移动方向，上下左右和对角线
    int[][] direction = {{1, -1}, {1, 0}, {1, 1}, {0, -1}, 
                         {0, 1}, {-1, -1}, {-1, 0}, {-1, 1}};
                         
    int m = grids.length, n = grids[0].length;
    Queue<Pair<Integer, Integer>> queue = new LinkedList<>();
    queue.add(new Pair<>(0, 0));  // 从起点开始
    int pathLength = 0;
    
    while (!queue.isEmpty()) {
        int size = queue.size();
        pathLength++;
        while (size-- > 0) {
            Pair<Integer, Integer> cur = queue.poll();
            int cr = cur.getKey(), cc = cur.getValue();
            
            // 如果当前节点是障碍物，跳过
            if (grids[cr][cc] == 1) {
                continue;
            }
            
            // 如果到达右下角，返回路径长度
            if (cr == m - 1 && cc == n - 1) {
                return pathLength;
            }
            
            // 标记已访问
            grids[cr][cc] = 1;
            for (int[] d : direction) {
                int nr = cr + d[0], nc = cc + d[1];
                if (nr < 0 || nr >= m || nc < 0 || nc >= n) {
                    continue;  // 超出边界
                }
                queue.add(new Pair<>(nr, nc));  // 添加新的节点到队列
            }
        }
    }
    return -1;  // 如果没有路径
}
```

### 2. 组成整数的最小平方数数量

**题目描述**：给定一个正整数 n，返回能够通过若干个完全平方数（如 1, 4, 9）相加的最少数量。

```java
public int numSquares(int n) {
    List<Integer> squares = generateSquares(n);
    Queue<Integer> queue = new LinkedList<>();
    boolean[] marked = new boolean[n + 1];
    queue.add(n);
    marked[n] = true;
    int level = 0;  // 用来计数层数，即最小平方数个数

    while (!queue.isEmpty()) {
        int size = queue.size();
        level++;
        while (size-- > 0) {
            int cur = queue.poll();
            for (int s : squares) {
                int next = cur - s;
                if (next < 0) {
                    break;  // 当前平方数大于当前值，停止
                }
                if (next == 0) {
                    return level;  // 找到解
                }
                if (marked[next]) {
                    continue;  // 已访问
                }
                marked[next] = true;
                queue.add(next);  // 加入下一个待访问的数
            }
        }
    }
    return n;  // 不会无限循环，总会输出结果
}

// 生成小于 n 的所有平方数
private List<Integer> generateSquares(int n) {
    List<Integer> squares = new ArrayList<>();
    int square = 1;
    int diff = 3;  // 从 1 开始，1 + (2i - 1) 规律
    while (square <= n) {
        squares.add(square);  
        square += diff;
        diff += 2;  // 每次加的差变大
    }
    return squares;
}
```

### 3. 最短单词路径

**题目描述**：通过改变一个字母，从一个单词变换成另一个单词，求出所需的最少单词变换步骤。每一步的变换都必须是字典中的一个有效单词。

```java
public int ladderLength(String beginWord, String endWord, List<String> wordList) {
    wordList.add(beginWord);
    int N = wordList.size();
    int start = N - 1;
    int end = 0;
    
    // 找到 endWord 的索引
    while (end < N && !wordList.get(end).equals(endWord)) {
        end++;
    }
    
    if (end == N) {
        return 0;  // 如果没找到目标单词
    }
    
    List<Integer>[] graph = buildGraph(wordList);
    return getShortestPath(graph, start, end);
}

private List<Integer>[] buildGraph(List<String> wordList) {
    int N = wordList.size();
    List<Integer>[] graph = new List[N];
    for (int i = 0; i < N; i++) {
        graph[i] = new ArrayList<>();
        for (int j = 0; j < N; j++) {
            if (isConnect(wordList.get(i), wordList.get(j))) {
                graph[i].add(j);  // 认为存在边
            }
        }
    }
    return graph;
}

// 判断两个单词只有一个字母不同
private boolean isConnect(String s1, String s2) {
    int diffCnt = 0;  // 记录不同字符数量
    for (int i = 0; i < s1.length() && diffCnt <= 1; i++) {
        if (s1.charAt(i) != s2.charAt(i)) {
            diffCnt++;
        }
    }
    return diffCnt == 1;
}

// BFS 找到最短路径
private int getShortestPath(List<Integer>[] graph, int start, int end) {
    Queue<Integer> queue = new LinkedList<>();
    boolean[] marked = new boolean[graph.length];
    queue.add(start);
    marked[start] = true;
    int pathLength = 1;  // 路径步数

    while (!queue.isEmpty()) {
        int size = queue.size();
        pathLength++;
        while (size-- > 0) {
            int cur = queue.poll();
            for (int next : graph[cur]) {
                if (next == end) {
                    return pathLength;  // 找到目标
                }
                if (marked[next]) {
                    continue;  // 跳过已访问节点
                }
                marked[next] = true;  
                queue.add(next);  // 加入队列
            }
        }
    }
    return 0;  // 无法到达
}
```

## DFS（深度优先搜索）

深度优先搜索是一种策略，先访问一个新节点，再从此节点访问未被访问的节点。DFS 通常用于可达性问题，以及在遍历中寻找特定条件的路径。

### 实现要点
- **栈**：常常使用递归栈来确保可以回溯。
- **标记访问**：i避免重复访问相同的节点，也需要进行标记。

### 1. 查找最大的连通面积

**题目描述**：给定一个二维网格，0表示水，1表示岛屿。求该网格中连通的最大的岛屿面积。

```java
public int maxAreaOfIsland(int[][] grid) {
    if (grid == null || grid.length == 0) {
        return 0;
    }
    
    int m = grid.length;
    int n = grid[0].length;
    int maxArea = 0;
    
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            maxArea = Math.max(maxArea, dfs(grid, i, j));
        }
    }
    return maxArea;
}

private int dfs(int[][] grid, int r, int c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] == 0) {
        return 0;  // 越界或水域返回0
    }
    
    grid[r][c] = 0;  // 标记为水，避免重复访问
    int area = 1;  // 计算当前节点面积
    
    // 四个方向
    area += dfs(grid, r, c + 1);  // 右
    area += dfs(grid, r, c - 1);  // 左
    area += dfs(grid, r + 1, c);  // 下
    area += dfs(grid, r - 1, c);  // 上
    
    return area;  // 返回一个岛屿的总面积
}
```

### 2. 矩阵中的连通分量数目

**题目描述**：给定一个矩阵，1 表示岛屿，0 表示水。求该矩阵中岛屿的个数。

```java
public int numIslands(char[][] grid) {
    if (grid == null || grid.length == 0) {
        return 0;  // 无法进行搜索
    }
    
    int m = grid.length;
    int n = grid[0].length;
    int islandsNum = 0;
    
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] != '0') {  // 找到一个岛屿
                dfs(grid, i, j);
                islandsNum++;
            }
        }
    }
    return islandsNum;
}

private void dfs(char[][] grid, int i, int j) {
    if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] == '0') {
        return;  // 找到边界或者水域
    }
    
    grid[i][j] = '0';  // 水域化，避免重复
    // 四个方向
    dfs(grid, i + 1, j);  // 下
    dfs(grid, i - 1, j);  // 上
    dfs(grid, i, j + 1);  // 右
    dfs(grid, i, j - 1);  // 左
}
```

### 3. 好友关系的连通分量数目

**题目描述**：给出一个 N x N 的矩阵，其中 M[i][j] 表示第 i 个人和第 j 个人是否是朋友关系，求出朋友圈的数目。

```java
public int findCircleNum(int[][] M) {
    int n = M.length;
    int circleNum = 0;
    boolean[] hasVisited = new boolean[n];
    
    for (int i = 0; i < n; i++) {
        if (!hasVisited[i]) {
            dfs(M, i, hasVisited);  // 遍历该朋友圈
            circleNum++;
        }
    }
    return circleNum;
}

private void dfs(int[][] M, int i, boolean[] hasVisited) {
    hasVisited[i] = true;  // 标记为已访问
    for (int k = 0; k < M.length; k++) {
        if (M[i][k] == 1 && !hasVisited[k]) {  // 如果是朋友且未访问过
            dfs(M, k, hasVisited);  // 递归DFS
        }
    }
}
```

### 4. 填充封闭区域

**题目描述**：将被 `'X'` 包围的 `'O'` 转换为 `'X'`。

```java
public void solve(char[][] board) {
    if (board == null || board.length == 0) {
        return;
    }

    int m = board.length;
    int n = board[0].length;
    
    // 从边界出发，填充与边界连通的 'O'
    for (int i = 0; i < m; i++) {
        dfs(board, i, 0);  // 左边
        dfs(board, i, n - 1);  // 右边
    }
    for (int i = 0; i < n; i++) {
        dfs(board, 0, i);  // 上边
        dfs(board, m - 1, i);  // 下边
    }

    // 处理完边界的 'O' ，现在转换被包围的 'O'
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (board[i][j] == 'T') {
                board[i][j] = 'O';  // 转换为 'O'
            } else if (board[i][j] == 'O') {
                board[i][j] = 'X';  // 转换为 'X'
            }
        }
    }
}

private void dfs(char[][] board, int r, int c) {
    if (r < 0 || r >= board.length || c < 0 || c >= board[0].length || board[r][c] != 'O') {
        return;  // 越界或已经不是 'O'
    }
    board[r][c] = 'T';  // 标记为被访问
    // 深度优先搜索四个方向
    dfs(board, r + 1, c);  // 下
    dfs(board, r - 1, c);  // 上
    dfs(board, r, c + 1);  // 右
    dfs(board, r, c - 1);  // 左
}
```

### 5. 能到达的太平洋和大西洋的区域

**题目描述**：给定一个矩阵，找到能够同时流向太平洋和大西洋的所有位置。

```java
public List<List<Integer>> pacificAtlantic(int[][] matrix) {
    List<List<Integer>> result = new ArrayList<>();
    if (matrix == null || matrix.length == 0) {
        return result;
    }

    int m = matrix.length;
    int n = matrix[0].length;
    boolean[][] canReachP = new boolean[m][n];
    boolean[][] canReachA = new boolean[m][n];

    for (int i = 0; i < m; i++) {
        dfs(i, 0, canReachP);  // 太平洋
        dfs(i, n - 1, canReachA);  // 大西洋
    }
    for (int i = 0; i < n; i++) {
        dfs(0, i, canReachP);  // 太平洋
        dfs(m - 1, i, canReachA);  // 大西洋
    }

    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (canReachP[i][j] && canReachA[i][j]) {
                result.add(Arrays.asList(i, j));  // 加入结果
            }
        }
    }
    
    return result;
}

private void dfs(int r, int c, boolean[][] canReach) {
    if (canReach[r][c]) {
        return;  // 如果已经可以到达则返回
    }
    canReach[r][c] = true;  // 标记为可以到达
    for (int[] d : direction) {  // 遍历四个方向
        int nextR = d[0] + r;
        int nextC = d[1] + c;
        if (nextR < 0 || nextR >= matrix.length || nextC < 0 || nextC >= matrix[0].length
                || matrix[r][c] > matrix[nextR][nextC]) {
            continue;  // 越界，或者避免水流向坡度高的地方
        }
        dfs(nextR, nextC, canReach);
    }
}
```

## Backtracking（回溯）

回溯是一种特定类型的深度优先搜索。它通常应用于排列组合、子集等问题。在回溯中，我们不仅需要找到解，而且需要探索所有可能的解。

### 实现要点
- **标记元素状态**：在访问一个元素时标记其状态，以便在回溯时正确恢复状态。
- **递归**：通过递归函数处理节点层级，如果达到特定条件就回溯。

### 1. 数字键盘组合

**题目描述**：给定一个数字串，返回所有可能的字母组合。

```java
private static final String[] KEYS = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};

public List<String> letterCombinations(String digits) {
    List<String> combinations = new ArrayList<>();
    if (digits == null || digits.length() == 0) {
        return combinations;  // 输入空字符串
    }
    doCombination(new StringBuilder(), combinations, digits);
    return combinations;
}

private void doCombination(StringBuilder prefix, List<String> combinations, final String digits) {
    if (prefix.length() == digits.length()) {
        combinations.add(prefix.toString());  // 找到一个解
        return;
    }
    int curDigits = digits.charAt(prefix.length()) - '0';  // 当前数字位置
    String letters = KEYS[curDigits];
    for (char c : letters.toCharArray()) {
        prefix.append(c);  // 添加当前字母
        doCombination(prefix, combinations, digits);  // 继续选择下一个字母
        prefix.deleteCharAt(prefix.length() - 1);  // 回溯，删除当前字母
    }
}
```

### 2. IP 地址划分

**题目描述**：给定一个字符串，找到所有可能的有效 IP 地址。

```java
public List<String> restoreIpAddresses(String s) {
    List<String> addresses = new ArrayList<>();
    StringBuilder tempAddress = new StringBuilder();
    doRestore(0, tempAddress, addresses, s);
    return addresses;
}

private void doRestore(int k, StringBuilder tempAddress, List<String> addresses, String s) {
    if (k == 4 || s.length() == 0) {  // 找到 4 段或字符串用完
        if (k == 4 && s.length() == 0) {
            addresses.add(tempAddress.toString());  // 添加有效地址
        }
        return;
    }
    for (int i = 0; i < s.length() && i <= 2; i++) {  // 每段最多3位
        if (i != 0 && s.charAt(0) == '0') {
            break;  // 以0开头的多位数不合法
        }
        String part = s.substring(0, i + 1);  // 获取当前部分
        if (Integer.valueOf(part) <= 255) {  // 判断数值是否在 0-255 之间
            if (tempAddress.length() != 0) {
                part = "." + part;  // 添加小数点
            }
            tempAddress.append(part);
            doRestore(k + 1, tempAddress, addresses, s.substring(i + 1));  // 递归填充下一位
            tempAddress.delete(tempAddress.length() - part.length(), tempAddress.length());  // 回溯
        }
    }
}
```

### 3. 在矩阵中寻找字符串

**题目描述**：给定一个二维字符矩阵和一个单词，判断单词是否存在于矩阵中。

```java
private final static int[][] direction = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
private int m, n;

public boolean exist(char[][] board, String word) {
    if (word == null || word.length() == 0) {
        return true;
    }
    if (board == null || board.length == 0 || board[0].length == 0) {
        return false;
    }

    m = board.length;
    n = board[0].length;
    boolean[][] hasVisited = new boolean[m][n];

    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (backtracking(0, r, c, hasVisited, board, word)) {
                return true;  // 找到解
            }
        }
    }
    return false;  // 未能找到
}

private boolean backtracking(int curLen, int r, int c, boolean[][] visited, final char[][] board, final String word) {
    if (curLen == word.length()) {
        return true;  // 完全匹配
    }
    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] != word.charAt(curLen) || visited[r][c]) {
        return false;  // 越界、匹配失败或已访问
    }

    visited[r][c] = true;  // 标记为访问

    for (int[] d : direction) {
        if (backtracking(curLen + 1, r + d[0], c + d[1], visited, board, word)) {
            return true;  // 继续递归
        }
    }

    visited[r][c] = false;  // 回溯要恢复状态

    return false;  // 未找到
}
```

### 4. 输出二叉树中所有从根到叶子的路径

**题目描述**：给定一棵二叉树，返回所有从根到叶子的路径。

```java
public List<String> binaryTreePaths(TreeNode root) {
    List<String> paths = new ArrayList<>();
    if (root == null) {
        return paths;
    }
    List<Integer> values = new ArrayList<>();
    backtracking(root, values, paths);
    return paths;
}

private void backtracking(TreeNode node, List<Integer> values, List<String> paths) {
    if (node == null) {
        return;
    }
    values.add(node.val);  // 添加当前节点值
    if (isLeaf(node)) {
        paths.add(buildPath(values));  // 如果是叶子节点，构建路径
    } else {
        backtracking(node.left, values, paths);  // 递归左子树
        backtracking(node.right, values, paths);  // 递归右子树
    }
    values.remove(values.size() - 1);  // 回溯，移除当前节点
}

private boolean isLeaf(TreeNode node) {
    return node.left == null && node.right == null;  // 判断是否为叶子节点
}

private String buildPath(List<Integer> values) {
    StringBuilder str = new StringBuilder();
    for (int i = 0; i < values.size(); i++) {
        str.append(values.get(i));
        if (i != values.size() - 1) {
            str.append("->");  // 添加箭头
        }
    }
    return str.toString();  // 返回路径字符串
}
```

### 5. 排列

**题目描述**：给定一个不含重复数字的数组，返回它的所有可能的排列。

```java
public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> permutes = new ArrayList<>();
    List<Integer> permuteList = new ArrayList<>();
    boolean[] hasVisited = new boolean[nums.length];
    backtracking(permuteList, permutes, hasVisited, nums);
    return permutes;
}

private void backtracking(List<Integer> permuteList, List<List<Integer>> permutes, boolean[] visited, final int[] nums) {
    if (permuteList.size() == nums.length) {
        permutes.add(new ArrayList<>(permuteList));  // 找到一种排列方式
        return;
    }
    for (int i = 0; i < visited.length; i++) {
        if (visited[i]) {
            continue;  // 已访问的跳过
        }
        visited[i] = true;  // 标记已访问
        permuteList.add(nums[i]);  // 加入当前数字
        backtracking(permuteList, permutes, visited, nums);  // 继续递归
        permuteList.remove(permuteList.size() - 1);  // 回溯，移除数字
        visited[i] = false;  // 恢复状态
    }
}
```

### 6. 含有相同元素求排列

**题目描述**：给定一个可能包含重复数字的数组，返回其所有唯一的排列。

```java
public List<List<Integer>> permuteUnique(int[] nums) {
    List<List<Integer>> permutes = new ArrayList<>();
    List<Integer> permuteList = new ArrayList<>();
    Arrays.sort(nums);  // 排序
    boolean[] hasVisited = new boolean[nums.length];
    backtracking(permuteList, permutes, hasVisited, nums);
    return permutes;
}

private void backtracking(List<Integer> permuteList, List<List<Integer>> permutes, boolean[] visited, final int[] nums) {
    if (permuteList.size() == nums.length) {
        permutes.add(new ArrayList<>(permuteList));  // 找到一种排列
        return;
    }

    for (int i = 0; i < visited.length; i++) {
        if (i != 0 && nums[i] == nums[i - 1] && !visited[i - 1]) {
            continue;  // 防止重复
        }
        if (visited[i]) {
            continue;  // 已访问的跳过
        }
        visited[i] = true;  // 标记访问
        permuteList.add(nums[i]);  // 加入当前数字
        backtracking(permuteList, permutes, visited, nums);  // 继续递归
        permuteList.remove(permuteList.size() - 1);  // 回溯
        visited[i] = false;  // 恢复状态
    }
}
```

### 7. 组合

**题目描述**：给定数字 n 和 k，返回范围 [1, n] 中所有可能的组合（每个组合包含 k 个数字）。

```java
public List<List<Integer>> combine(int n, int k) {
    List<List<Integer>> combinations = new ArrayList<>();
    List<Integer> combineList = new ArrayList<>();
    backtracking(combineList, combinations, 1, k, n);
    return combinations;
}

private void backtracking(List<Integer> combineList, List<List<Integer>> combinations, int start, int k, final int n) {
    if (k == 0) {
        combinations.add(new ArrayList<>(combineList));  // 找到一种组合
        return;
    }
    for (int i = start; i <= n - k + 1; i++) {  // 剪枝
        combineList.add(i);  // 加入当前数字
        backtracking(combineList, combinations, i + 1, k - 1, n);  // 继续
        combineList.remove(combineList.size() - 1);  // 回溯，移除
    }
}
```

### 8. 组合求和

**题目描述**：给定一组候选数字和一个目标数字，找出所有可以使得候选数字相加等于目标数字的组合。

```java
public List<List<Integer>> combinationSum(int[] candidates, int target) {
    List<List<Integer>> combinations = new ArrayList<>();
    backtracking(new ArrayList<>(), combinations, 0, target, candidates);
    return combinations;
}

private void backtracking(List<Integer> tempCombination, List<List<Integer>> combinations,
                          int start, int target, final int[] candidates) {
    if (target == 0) {
        combinations.add(new ArrayList<>(tempCombination));  // 找到一种组合
        return;
    }
    for (int i = start; i < candidates.length; i++) {
        if (candidates[i] <= target) {
            tempCombination.add(candidates[i]);  // 加入当前数字
            backtracking(tempCombination, combinations, i, target - candidates[i], candidates);  // 继续
            tempCombination.remove(tempCombination.size() - 1);  // 回溯，移除数字
        }
    }
}
```

### 9. 含有相同元素的组合求和

**题目描述**：给定一个集合，找到所有独特的组合和，使得它们和为目标数字。

```java
public List<List<Integer>> combinationSum2(int[] candidates, int target) {
    List<List<Integer>> combinations = new ArrayList<>();
    Arrays.sort(candidates);  // 排序以便重复处理
    backtracking(new ArrayList<>(), combinations, new boolean[candidates.length], 0, target, candidates);
    return combinations;
}

private void backtracking(List<Integer> tempCombination, List<List<Integer>> combinations,
                          boolean[] hasVisited, int start, int target, final int[] candidates) {
    if (target == 0) {
        combinations.add(new ArrayList<>(tempCombination));  // 找到一种组合
        return;
    }
    for (int i = start; i < candidates.length; i++) {
        if (i != 0 && candidates[i] == candidates[i - 1] && !hasVisited[i - 1]) {
            continue;  // 防止重复
        }
        if (candidates[i] <= target) {
            tempCombination.add(candidates[i]);  // 加入当前数字
            hasVisited[i] = true;  // 标记为已访问
            backtracking(tempCombination, combinations, hasVisited, i + 1, target - candidates[i], candidates);  // 继续
            hasVisited[i] = false;  // 恢复状态
            tempCombination.remove(tempCombination.size() - 1);  // 回溯
        }
    }
}
```

### 10. 1-9 数字的组合求和

**题目描述**：从 1-9 的数字中选出 k 个数，使得它们的和为 n。

```java
public List<List<Integer>> combinationSum3(int k, int n) {
    List<List<Integer>> combinations = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    backtracking(k, n, 1, path, combinations);
    return combinations;
}

private void backtracking(int k, int n, int start,
                          List<Integer> tempCombination, List<List<Integer>> combinations) {
    if (k == 0 && n == 0) {
        combinations.add(new ArrayList<>(tempCombination));  // 找到一种组合
        return;
    }
    if (k == 0 || n == 0) {
        return;  // 结束条件
    }
    
    for (int i = start; i <= 9; i++) {
        tempCombination.add(i);  // 添加当前数字
        backtracking(k - 1, n - i, i + 1, tempCombination, combinations);  // 继续
        tempCombination.remove(tempCombination.size() - 1);  // 回溯，移除数字
    }
}
```

### 11. 子集

**题目描述**：返回一个数字集合的所有子集。

```java
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> subsets = new ArrayList<>();
    List<Integer> tempSubset = new ArrayList<>();
    for (int size = 0; size <= nums.length; size++) {
        backtracking(0, tempSubset, subsets, size, nums);  // 不同的子集大小
    }
    return subsets;
}

private void backtracking(int start, List<Integer> tempSubset, List<List<Integer>> subsets,
                          final int size, final int[] nums) {
    if (tempSubset.size() == size) {
        subsets.add(new ArrayList<>(tempSubset));  // 找到一种子集
        return;
    }
    for (int i = start; i < nums.length; i++) {
        tempSubset.add(nums[i]);  // 添加当前数字
        backtracking(i + 1, tempSubset, subsets, size, nums);  // 继续
        tempSubset.remove(tempSubset.size() - 1);  // 回溯，移除数字
    }
}
```

### 12. 含有相同元素求子集

**题目描述**：返回一个可能包含重复数字的集合的所有子集。

```java
public List<List<Integer>> subsetsWithDup(int[] nums) {
    Arrays.sort(nums);  // 排序以辅助处理重复
    List<List<Integer>> subsets = new ArrayList<>();
    List<Integer> tempSubset = new ArrayList<>();
    boolean[] hasVisited = new boolean[nums.length];
    for (int size = 0; size <= nums.length; size++) {
        backtracking(0, tempSubset, subsets, hasVisited, size, nums);  // 不同的子集大小
    }
    return subsets;
}

private void backtracking(int start, List<Integer> tempSubset, List<List<Integer>> subsets, boolean[] hasVisited,
                          final int size, final int[] nums) {
    if (tempSubset.size() == size) {
        subsets.add(new ArrayList<>(tempSubset));  // 找到一种子集
        return;
    }
    for (int i = start; i < nums.length; i++) {
        if (i != 0 && nums[i] == nums[i - 1] && !hasVisited[i - 1]) {
            continue;  // 防止重复
        }
        tempSubset.add(nums[i]);  // 添加当前数字
        hasVisited[i] = true;  // 标记为已访问
        backtracking(i + 1, tempSubset, subsets, hasVisited, size, nums);  // 继续
        hasVisited[i] = false;  // 恢复状态
        tempSubset.remove(tempSubset.size() - 1);  // 回溯
    }
}
```

### 13. 分割字符串使得每个部分都是回文数

**题目描述**：给定一个字符串，将其分割成若干部分，使得每一个部分都是回文。

```java
public List<List<String>> partition(String s) {
    List<List<String>> partitions = new ArrayList<>();
    List<String> tempPartition = new ArrayList<>();
    doPartition(s, partitions, tempPartition);
    return partitions;
}

private void doPartition(String s, List<List<String>> partitions, List<String> tempPartition) {
    if (s.length() == 0) {
        partitions.add(new ArrayList<>(tempPartition));  // 找到一种分割方式
        return;
    }
    for (int i = 0; i < s.length(); i++) {
        if (isPalindrome(s, 0, i)) {  // 判断当前前缀是否为回文
            tempPartition.add(s.substring(0, i + 1));  // 找到回文，加入当前分割
            doPartition(s.substring(i + 1), partitions, tempPartition);  // 继续分割剩下部分
            tempPartition.remove(tempPartition.size() - 1);  // 回溯
        }
    }
}

private boolean isPalindrome(String s, int begin, int end) {
    while (begin < end) {
        if (s.charAt(begin++) != s.charAt(end--)) {
            return false;  // 不相等，则非回文
        }
    }
    return true;  // 是回文
}
```

### 14. 数独

**题目描述**：给定一个 9x9 方格，完成数独的求解。

```java
private boolean[][] rowsUsed = new boolean[9][10];
private boolean[][] colsUsed = new boolean[9][10];
private boolean[][] cubesUsed = new boolean[9][10];
private char[][] board;

public void solveSudoku(char[][] board) {
    this.board = board;
    for (int i = 0; i < 9; i++)
        for (int j = 0; j < 9; j++) {
            if (board[i][j] == '.') {
                continue;  // 空格跳过
            }
            int num = board[i][j] - '0';  // 转为数值
            rowsUsed[i][num] = true;
            colsUsed[j][num] = true;
            cubesUsed[cubeNum(i, j)][num] = true;
        }
    backtracking(0, 0);  // 开始回溯
}

private boolean backtracking(int row, int col) {
    while (row < 9 && board[row][col] != '.') {
        row = col == 8 ? row + 1 : row;  // 若到达行尾，则转到下一行
        col = col == 8 ? 0 : col + 1;   // 否则继续本行
    }
    if (row == 9) {
        return true;  // 完成整个数独
    }
    for (int num = 1; num <= 9; num++) {
        if (rowsUsed[row][num] || colsUsed[col][num] || cubesUsed[cubeNum(row, col)][num]) {
            continue;  // 当前值在行、列或小方格中已使用
        }
        rowsUsed[row][num] = colsUsed[col][num] = cubesUsed[cubeNum(row, col)][num] = true;
        board[row][col] = (char) (num + '0');  // 填上当前数值
        if (backtracking(row, col)) {
            return true;  // 回溯成功
        }
        board[row][col] = '.';  // 恢复空格
        rowsUsed[row][num] = colsUsed[col][num] = cubesUsed[cubeNum(row, col)][num] = false;
    }
    return false;  // 无解
}

private int cubeNum(int i, int j) {
    int r = i / 3;
    int c = j / 3;
    return r * 3 + c;  // 将子方格转化为索引
}
```

### 15. N 皇后

**题目描述**：在 n*n 的棋盘上放置 n 个皇后，使得它们不能相互攻击。

```java
private List<List<String>> solutions;
private char[][] nQueens;
private boolean[] colUsed;
private boolean[] diagonals45Used;
private boolean[] diagonals135Used;
private int n;

public List<List<String>> solveNQueens(int n) {
    solutions = new ArrayList<>();
    nQueens = new char[n][n];
    for (int i = 0; i < n; i++) {
        Arrays.fill(nQueens[i], '.');  // 初始化棋盘
    }
    colUsed = new boolean[n];  // 列标记
    diagonals45Used = new boolean[2 * n - 1];  // 45度标记
    diagonals135Used = new boolean[2 * n - 1];  // 135度标记
    this.n = n;
    backtracking(0);  // 从第 0 行开始
    return solutions;  // 返回解决方案
}

private void backtracking(int row) {
    if (row == n) {
        List<String> list = new ArrayList<>();
        for (char[] chars : nQueens) {
            list.add(new String(chars));  // 从棋盘构建解
        }
        solutions.add(list);
        return;
    }

    for (int col = 0; col < n; col++) {
        int diagonals45Idx = row + col;
        int diagonals135Idx = n - 1 - (row - col);
        if (colUsed[col] || diagonals45Used[diagonals45Idx] || diagonals135Used[diagonals135Idx]) {
            continue;  // 如果此列或对角线被占用，则跳过
        }
        nQueens[row][col] = 'Q';  // 放置皇后
        colUsed[col] = diagonals45Used[diagonals45Idx] = diagonals135Used[diagonals135Idx] = true;  // 标记
        backtracking(row + 1);  // 继续放置下一行
        colUsed[col] = diagonals45Used[diagonals45Idx] = diagonals135Used[diagonals135Idx] = false;  // 恢复标记
        nQueens[row][col] = '.';  // 恢复棋盘状态
    }
}
```

通过这些实现，我们可以看到搜索算法在不同问题上的应用。BFS 多用于找到最短路径，DFS 和回溯适合组合的排列等问题。理解这些基础将帮助我们在解决更多复杂问题时做出更好的策略选择。