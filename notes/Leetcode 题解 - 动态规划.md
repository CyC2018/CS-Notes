# Leetcode 题解 - 动态规划
<!-- GFM-TOC -->
* [Leetcode 题解 - 动态规划](#leetcode-题解---动态规划)
    * [斐波那契数列](#斐波那契数列)
        * [1. 爬楼梯](#1-爬楼梯)
        * [2. 强盗抢劫](#2-强盗抢劫)
        * [3. 强盗在环形街区抢劫](#3-强盗在环形街区抢劫)
        * [4. 信件错排](#4-信件错排)
        * [5. 母牛生产](#5-母牛生产)
    * [矩阵路径](#矩阵路径)
        * [1. 矩阵的最小路径和](#1-矩阵的最小路径和)
        * [2. 矩阵的总路径数](#2-矩阵的总路径数)
        * [3. 最大正方形](#3-最大正方形)
    * [数组区间](#数组区间)
        * [1. 数组区间和](#1-数组区间和)
        * [2. 数组中等差递增子区间的个数](#2-数组中等差递增子区间的个数)
        * [3. 最长有效括号](#3-最长有效括号)
    * [分割整数](#分割整数)
        * [1. 分割整数的最大乘积](#1-分割整数的最大乘积)
        * [2. 按平方数来分割整数](#2-按平方数来分割整数)
        * [3. 分割整数构成字母字符串](#3-分割整数构成字母字符串)
    * [最长递增子序列](#最长递增子序列)
        * [1. 最长递增子序列](#1-最长递增子序列)
        * [2. 一组整数对能够构成的最长链](#2-一组整数对能够构成的最长链)
        * [3. 最长摆动子序列](#3-最长摆动子序列)
    * [最长公共子序列](#最长公共子序列)
        * [1. 最长公共子序列](#1-最长公共子序列)
    * [0-1 背包](#0-1-背包)
        * [1. 划分数组为和相等的两部分](#1-划分数组为和相等的两部分)
        * [2. 改变一组数的正负号使得它们的和为一给定数](#2-改变一组数的正负号使得它们的和为一给定数)
        * [3. 01 字符构成最多的字符串](#3-01-字符构成最多的字符串)
        * [4. 找零钱的最少硬币数](#4-找零钱的最少硬币数)
        * [5. 找零钱的硬币数组合](#5-找零钱的硬币数组合)
        * [6. 字符串按单词列表分割](#6-字符串按单词列表分割)
        * [7. 组合总和](#7-组合总和)
    * [股票交易](#股票交易)
        * [1. 需要冷却期的股票交易](#1-需要冷却期的股票交易)
        * [2. 需要交易费用的股票交易](#2-需要交易费用的股票交易)
        * [3. 只能进行两次的股票交易](#3-只能进行两次的股票交易)
        * [4. 只能进行 k 次的股票交易](#4-只能进行-k-次的股票交易)
    * [字符串编辑](#字符串编辑)
        * [1. 删除两个字符串的字符使它们相等](#1-删除两个字符串的字符使它们相等)
        * [2. 编辑距离](#2-编辑距离)
        * [3. 复制粘贴字符](#3-复制粘贴字符)
<!-- GFM-TOC -->


递归和动态规划都是将原问题拆成多个子问题然后求解，区别是动态规划保存了子问题的解，避免重复计算，例如递归求斐波那契数 f(5) 时 f(3) 会被算 2 次。记忆化递归也属于动态规划，只是按自顶向下的顺序计算。

写动态规划要确定 dp 的含义、状态转移方程、初始值和计算顺序。

## 斐波那契数列

### 1. 爬楼梯

70\. Climbing Stairs (Easy)

[Leetcode](https://leetcode.com/problems/climbing-stairs/description/) / [力扣](https://leetcode-cn.com/problems/climbing-stairs/description/)

题目描述：有 N 阶楼梯，每次可以上一阶或者两阶，求有多少种上楼梯的方法。

定义一个数组 dp 存储上楼梯的方法数（为了方便讨论，数组下标从 1 开始），dp[i] 表示走到第 i 个楼梯的方法数目。

第 i 个楼梯可以从第 i-1 和 i-2 个楼梯再走一步到达，走到第 i 个楼梯的方法数为走到第 i-1 和第 i-2 个楼梯的方法数之和。

<div align="center"> <img src="pics/lc-dp-climb-stairs.png" width="440px"/> </div><br>

考虑到 dp[i] 只与 dp[i - 1] 和 dp[i - 2] 有关，因此可以只用两个变量来存储 dp[i - 1] 和 dp[i - 2]，使得原来的 O(N) 空间复杂度优化为 O(1) 复杂度。

```java
public int climbStairs(int n) {
    if (n <= 2) {
        return n;
    }
    int pre2 = 1, pre1 = 2;
    for (int i = 2; i < n; i++) {
        int cur = pre1 + pre2;
        pre2 = pre1;
        pre1 = cur;
    }
    return pre1;
}
```

### 2. 强盗抢劫

198\. House Robber (Medium)

[Leetcode](https://leetcode.com/problems/house-robber/description/) / [力扣](https://leetcode-cn.com/problems/house-robber/description/)

题目描述：抢劫一排住户，但是不能抢邻近的住户，求最大抢劫量。

定义 dp 数组用来存储最大的抢劫量，其中 dp[i] 表示抢到第 i 个住户时的最大抢劫量。

抢第 i 个住户的话，第 i - 1 个住户就不能抢，因此取抢和不抢两种情况的较大值：

<div align="center"> <img src="pics/lc-dp-house-robber.png" width="480px"/> </div><br>

```java
public int rob(int[] nums) {
    int pre2 = 0, pre1 = 0;
    for (int i = 0; i < nums.length; i++) {
        int cur = Math.max(pre2 + nums[i], pre1);
        pre2 = pre1;
        pre1 = cur;
    }
    return pre1;
}
```

### 3. 强盗在环形街区抢劫

213\. House Robber II (Medium)

[Leetcode](https://leetcode.com/problems/house-robber-ii/description/) / [力扣](https://leetcode-cn.com/problems/house-robber-ii/description/)

题目描述：住户围成一圈，首尾两户相邻。

首尾两户不能同时抢，因此分别在 0 \~ n-2（不抢最后一户）和 1 \~ n-1（不抢第一户）中按上一题求解，取较大值。

```java
public int rob(int[] nums) {
    if (nums == null || nums.length == 0) {
        return 0;
    }
    int n = nums.length;
    if (n == 1) {
        return nums[0];
    }
    return Math.max(rob(nums, 0, n - 2), rob(nums, 1, n - 1));
}

private int rob(int[] nums, int first, int last) {
    int pre2 = 0, pre1 = 0;
    for (int i = first; i <= last; i++) {
        int cur = Math.max(pre1, pre2 + nums[i]);
        pre2 = pre1;
        pre1 = cur;
    }
    return pre1;
}
```

### 4. 信件错排

题目描述：有 N 个信和信封，它们被打乱，求每封信都装错信封的方式数量（错排数）。

dp[i] 表示 i 封信都装错的方式数量。第 i 封信装进了第 j 个信封（j ≠ i，有 i - 1 种选法），再看第 j 封信装在哪里：

- 第 j 封信装进第 i 个信封：i 和 j 互相装错，剩下的 i - 2 封信要全部装错，有 dp[i - 2] 种；
- 第 j 封信没有装进第 i 个信封：去掉第 i 封信和第 j 个信封，把第 i 个信封看成第 j 封信不能装的信封，问题就变成 i - 1 封信全部装错，有 dp[i - 1] 种。

两种情况都要乘以 j 的 i - 1 种选法，因此：

<div align="center"> <img src="pics/lc-dp-derangement.png" width="456px"/> </div><br>

### 5. 母牛生产

程序员代码面试指南-P181

题目描述：假设农场中成熟的母牛每年都会生 1 头小母牛，并且永远不会死。第一年农场中有 1 只成熟的母牛，从第二年开始，母牛开始生小母牛。每只小母牛 3 年之后成熟又可以生小母牛。给定整数 N，求 N 年后牛的数量。

第 i 年牛的数量等于第 i-1 年牛的数量加上第 i-3 年牛的数量，这是因为第 i-3 年的牛到第 i 年都已成熟，每头都会生一头小牛：

<div align="center"> <img src="pics/lc-dp-cow.png" width="440px"/> </div><br>

## 矩阵路径

### 1. 矩阵的最小路径和

64\. Minimum Path Sum (Medium)

[Leetcode](https://leetcode.com/problems/minimum-path-sum/description/) / [力扣](https://leetcode-cn.com/problems/minimum-path-sum/description/)

```text
[[1,3,1],
 [1,5,1],
 [4,2,1]]
Given the above grid map, return 7. Because the path 1→3→1→1→1 minimizes the sum.
```

题目描述：求从矩阵的左上角到右下角的最小路径和，每次只能向右和向下移动。

dp[j] 表示走到当前行第 j 列的最小路径和，只用一行滚动更新：更新前的 dp[j] 是上一行的值（从上侧走来），dp[j - 1] 已经是本行的值（从左侧走来）。

```java
public int minPathSum(int[][] grid) {
    if (grid.length == 0 || grid[0].length == 0) {
        return 0;
    }
    int m = grid.length, n = grid[0].length;
    int[] dp = new int[n];
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (j == 0) {
                dp[j] = dp[j];        // 只能从上侧走到该位置
            } else if (i == 0) {
                dp[j] = dp[j - 1];    // 只能从左侧走到该位置
            } else {
                dp[j] = Math.min(dp[j - 1], dp[j]);
            }
            dp[j] += grid[i][j];
        }
    }
    return dp[n - 1];
}
```

### 2. 矩阵的总路径数

62\. Unique Paths (Medium)

[Leetcode](https://leetcode.com/problems/unique-paths/description/) / [力扣](https://leetcode-cn.com/problems/unique-paths/description/)

题目描述：统计从矩阵左上角到右下角的路径总数，每次只能向右或者向下移动。

<div align="center"> <img src="pics/lc-dp-unique-paths.png" width="550px"/> </div><br>

```java
public int uniquePaths(int m, int n) {
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[j] = dp[j] + dp[j - 1];
        }
    }
    return dp[n - 1];
}
```

也可以直接用数学公式求解，这是一个组合问题。机器人总共移动的次数 S=m+n-2，向下移动的次数 D=m-1，那么问题可以看成从 S 中取出 D 个位置的组合数量，这个问题的解为 C(S, D)。

```java
public int uniquePaths(int m, int n) {
    int S = m + n - 2;  // 总共的移动次数
    int D = m - 1;      // 向下的移动次数
    long ret = 1;
    for (int i = 1; i <= D; i++) {
        ret = ret * (S - D + i) / i;
    }
    return (int) ret;
}
```

### 3. 最大正方形

221\. Maximal Square (Medium)

[Leetcode](https://leetcode.com/problems/maximal-square/) / [力扣](https://leetcode.cn/problems/maximal-square/)

题目描述：在由 0 和 1 组成的矩阵中，找出只包含 1 的最大正方形的面积。

dp[i][j] 表示以 (i, j) 为右下角、只包含 1 的最大正方形的边长。当前格为 1 时，边长受左边、上边和左上角的限制，取三者的最小值再加 1。左上角不能省略，例如下面右边的例子只能得到边长 1。

```text
dp[i][j] = min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1

matrix:  1 1 1       dp:  1 1 1        matrix:  0 1       dp:  0 1
         1 1 1            1 2 2                 1 1            1 1
         1 1 1            1 2 3
```

```java
public int maximalSquare(char[][] matrix) {
    int m = matrix.length, n = matrix[0].length, side = 0;
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (matrix[i - 1][j - 1] == '1') {
                dp[i][j] = Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1])) + 1;
                side = Math.max(side, dp[i][j]);
            }
        }
    }
    return side * side;
}
```

## 数组区间

### 1. 数组区间和

303\. Range Sum Query - Immutable (Easy)

[Leetcode](https://leetcode.com/problems/range-sum-query-immutable/description/) / [力扣](https://leetcode-cn.com/problems/range-sum-query-immutable/description/)

```text
Given nums = [-2, 0, 3, -5, 2, -1]

sumRange(0, 2) -> 1
sumRange(2, 5) -> -1
sumRange(0, 5) -> -3
```

求区间 i \~ j 的和，可以转换为 sum[j + 1] - sum[i]，其中 sum[i] 为 0 \~ i - 1 的和。

```java
class NumArray {

    private int[] sums;

    public NumArray(int[] nums) {
        sums = new int[nums.length + 1];
        for (int i = 1; i <= nums.length; i++) {
            sums[i] = sums[i - 1] + nums[i - 1];
        }
    }

    public int sumRange(int i, int j) {
        return sums[j + 1] - sums[i];
    }
}
```

### 2. 数组中等差递增子区间的个数

413\. Arithmetic Slices (Medium)

[Leetcode](https://leetcode.com/problems/arithmetic-slices/description/) / [力扣](https://leetcode-cn.com/problems/arithmetic-slices/description/)

```text
A = [0, 1, 2, 3, 4]

return: 6, for 6 arithmetic slices in A:

[0, 1, 2],
[1, 2, 3],
[0, 1, 2, 3],
[0, 1, 2, 3, 4],
[1, 2, 3, 4],
[2, 3, 4]
```

子区间要求连续、长度至少为 3，公差可以为 0 或负数，例如 [7, 7, 7]、[3, 2, 1]。

dp[i] 表示以 A[i] 为结尾的等差子区间的个数。

当 A[i] - A[i-1] == A[i-1] - A[i-2]，那么 [A[i-2], A[i-1], A[i]] 构成一个等差子区间。而且在以 A[i-1] 为结尾的等差子区间的后面再加上一个 A[i]，一样可以构成新的等差子区间。

```text
dp[2] = 1
    [0, 1, 2]
dp[3] = dp[2] + 1 = 2
    [0, 1, 2, 3], // [0, 1, 2] 之后加一个 3
    [1, 2, 3]     // 新的等差子区间
dp[4] = dp[3] + 1 = 3
    [0, 1, 2, 3, 4], // [0, 1, 2, 3] 之后加一个 4
    [1, 2, 3, 4],    // [1, 2, 3] 之后加一个 4
    [2, 3, 4]        // 新的等差子区间
```

综上，在 A[i] - A[i-1] == A[i-1] - A[i-2] 时，dp[i] = dp[i-1] + 1。

因为等差子区间不一定以最后一个元素为结尾，可以是任意一个元素结尾，因此需要返回 dp 数组累加的结果。

```java
public int numberOfArithmeticSlices(int[] A) {
    if (A == null || A.length == 0) {
        return 0;
    }
    int n = A.length;
    int[] dp = new int[n];
    for (int i = 2; i < n; i++) {
        if (A[i] - A[i - 1] == A[i - 1] - A[i - 2]) {
            dp[i] = dp[i - 1] + 1;
        }
    }
    int total = 0;
    for (int cnt : dp) {
        total += cnt;
    }
    return total;
}
```

### 3. 最长有效括号

32\. Longest Valid Parentheses (Hard)

[Leetcode](https://leetcode.com/problems/longest-valid-parentheses/) / [力扣](https://leetcode.cn/problems/longest-valid-parentheses/)

```text
Input: ")()())"
Output: 4
```

dp[i] 表示以 s[i] 结尾的最长有效括号的长度，只有 s[i] 为 ) 时才可能不为 0。以 s[i - 1] 结尾的有效括号长度为 dp[i - 1]，跳过这一段之后的位置 j = i - dp[i - 1] - 1 如果是 (，就能和 s[i] 配对，长度为 dp[i - 1] + 2，再加上 j 前面紧挨着的有效括号长度 dp[j - 1]。以 "()(())" 为例：

<div align="center"> <img src="pics/lc-dp-valid-parentheses.png" width="560px"/> </div><br>

```java
public int longestValidParentheses(String s) {
    int n = s.length(), ret = 0;
    int[] dp = new int[n];
    for (int i = 1; i < n; i++) {
        if (s.charAt(i) != ')') {
            continue;
        }
        int j = i - dp[i - 1] - 1;
        if (j >= 0 && s.charAt(j) == '(') {
            dp[i] = dp[i - 1] + 2 + (j > 0 ? dp[j - 1] : 0);
            ret = Math.max(ret, dp[i]);
        }
    }
    return ret;
}
```

只用计数可以把空间降到 O(1)：从左往右数左右括号，相等时得到一段有效括号，右括号更多时清零；"(()" 这类左括号一直更多的情况会被漏掉，再从右往左对称地扫一遍。

```java
public int longestValidParentheses(String s) {
    int left = 0, right = 0, ret = 0;
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) == '(') {
            left++;
        } else {
            right++;
        }
        if (left == right) {
            ret = Math.max(ret, 2 * right);
        } else if (right > left) {
            left = right = 0;
        }
    }
    left = right = 0;
    for (int i = s.length() - 1; i >= 0; i--) {
        if (s.charAt(i) == '(') {
            left++;
        } else {
            right++;
        }
        if (left == right) {
            ret = Math.max(ret, 2 * left);
        } else if (left > right) {
            left = right = 0;
        }
    }
    return ret;
}
```

## 分割整数

### 1. 分割整数的最大乘积

343\. Integer Break (Medium)

[Leetcode](https://leetcode.com/problems/integer-break/description/) / [力扣](https://leetcode-cn.com/problems/integer-break/description/)

题目描述：把正整数 n 拆成至少两个正整数的和，求这些整数乘积的最大值。For example, given n = 2, return 1 (2 = 1 + 1); given n = 10, return 36 (10 = 3 + 3 + 4).

dp[i] 表示把 i 拆分后的最大乘积。枚举拆出的第一个数 j，剩下的 i - j 可以继续拆分（j \* dp[i - j]），也可以不拆（j \* (i - j)），不拆可能更大，例如 dp[3] = 2 小于 3。

```java
public int integerBreak(int n) {
    int[] dp = new int[n + 1];
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        for (int j = 1; j <= i - 1; j++) {
            dp[i] = Math.max(dp[i], Math.max(j * dp[i - j], j * (i - j)));
        }
    }
    return dp[n];
}
```

### 2. 按平方数来分割整数

279\. Perfect Squares (Medium)

[Leetcode](https://leetcode.com/problems/perfect-squares/description/) / [力扣](https://leetcode-cn.com/problems/perfect-squares/description/)

题目描述：把 n 表示成若干个完全平方数的和，求最少需要几个。For example, given n = 12, return 3 because 12 = 4 + 4 + 4; given n = 13, return 2 because 13 = 4 + 9.

dp[i] 表示和为 i 的最少平方数个数，枚举最后一个平方数 square，dp[i] = min(dp[i - square] + 1)。

```java
public int numSquares(int n) {
    List<Integer> squareList = generateSquareList(n);
    int[] dp = new int[n + 1];
    for (int i = 1; i <= n; i++) {
        int min = Integer.MAX_VALUE;
        for (int square : squareList) {
            if (square > i) {
                break;
            }
            min = Math.min(min, dp[i - square] + 1);
        }
        dp[i] = min;
    }
    return dp[n];
}

private List<Integer> generateSquareList(int n) {
    List<Integer> squareList = new ArrayList<>();
    int diff = 3;
    int square = 1;
    while (square <= n) {
        squareList.add(square);
        square += diff;
        diff += 2;
    }
    return squareList;
}
```

### 3. 分割整数构成字母字符串

91\. Decode Ways (Medium)

[Leetcode](https://leetcode.com/problems/decode-ways/description/) / [力扣](https://leetcode-cn.com/problems/decode-ways/description/)

题目描述：字母 A \~ Z 分别编码为 1 \~ 26，求一个数字串有多少种解码方法。Given encoded message "12", it could be decoded as "AB" (1 2) or "L" (12).

dp[i] 表示前 i 个字符的解码方法数。第 i 个字符不为 0 时可以单独解码，加上 dp[i - 1]；最后两个字符在 10 \~ 26 之间时可以一起解码，加上 dp[i - 2]。例如 "226" 的 dp 为 [1, 1, 2, 3]。

```java
public int numDecodings(String s) {
    if (s == null || s.length() == 0) {
        return 0;
    }
    int n = s.length();
    int[] dp = new int[n + 1];
    dp[0] = 1;
    dp[1] = s.charAt(0) == '0' ? 0 : 1;
    for (int i = 2; i <= n; i++) {
        int one = Integer.valueOf(s.substring(i - 1, i));
        if (one != 0) {
            dp[i] += dp[i - 1];
        }
        if (s.charAt(i - 2) == '0') {
            continue;
        }
        int two = Integer.valueOf(s.substring(i - 2, i));
        if (two <= 26) {
            dp[i] += dp[i - 2];
        }
    }
    return dp[n];
}
```

## 最长递增子序列

已知一个序列 {S<sub>1</sub>, S<sub>2</sub>,...,S<sub>n</sub>}，取出若干数组成新的序列 {S<sub>i1</sub>, S<sub>i2</sub>,..., S<sub>im</sub>}，其中 i1、i2 ... im 保持递增，即新序列中各个数仍然保持原数列中的先后顺序，称新序列为原序列的一个 **子序列**。

如果在子序列中，当下标 ix > iy 时，S<sub>ix</sub> > S<sub>iy</sub>，称子序列为原序列的一个 **递增子序列**。

定义一个数组 dp 存储最长递增子序列的长度，dp[n] 表示以 S<sub>n</sub> 结尾的序列的最长递增子序列长度。对于一个递增子序列 {S<sub>i1</sub>, S<sub>i2</sub>,...,S<sub>im</sub>}，如果 im < n 并且 S<sub>im</sub> < S<sub>n</sub>，此时 {S<sub>i1</sub>, S<sub>i2</sub>,..., S<sub>im</sub>, S<sub>n</sub>} 为一个递增子序列，递增子序列的长度增加 1。满足上述条件的递增子序列中，长度最长的那个递增子序列就是要找的，在长度最长的递增子序列上加上 S<sub>n</sub> 就构成了以 S<sub>n</sub> 为结尾的最长递增子序列。因此 dp[n] = max{ dp[i]+1 | S<sub>i</sub> < S<sub>n</sub> && i < n} 。

因为在求 dp[n] 时可能无法找到一个满足条件的递增子序列，此时 {S<sub>n</sub>} 就构成了递增子序列，需要对前面的求解方程做修改，令 dp[n] 最小为 1，即：

<div align="center"> <img src="pics/lc-dp-lis.png" width="500px"/> </div><br>

对于一个长度为 N 的序列，最长递增子序列并不一定会以 S<sub>N</sub> 为结尾，因此 dp[N] 不是序列的最长递增子序列的长度，需要遍历 dp 数组找出最大值才是所要的结果，max{ dp[i] | 1 <= i <= N} 即为所求。

### 1. 最长递增子序列

300\. Longest Increasing Subsequence (Medium)

[Leetcode](https://leetcode.com/problems/longest-increasing-subsequence/description/) / [力扣](https://leetcode-cn.com/problems/longest-increasing-subsequence/description/)

```java
public int lengthOfLIS(int[] nums) {
    int n = nums.length;
    int[] dp = new int[n];
    for (int i = 0; i < n; i++) {
        int max = 1;
        for (int j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                max = Math.max(max, dp[j] + 1);
            }
        }
        dp[i] = max;
    }
    return Arrays.stream(dp).max().orElse(0);
}
```

以上解法的时间复杂度为 O(N<sup>2</sup>)，可以使用二分查找将时间复杂度降低为 O(NlogN)。

定义一个 tails 数组，其中 tails[i] 存储所有长度为 i + 1 的递增子序列中最小的末尾元素。对于一个元素 x，

- 如果它大于 tails 数组所有的值，那么把它添加到 tails 后面，表示最长递增子序列长度加 1；
- 如果 tails[i-1] \< x \<= tails[i]，那么更新 tails[i] = x。

例如对于数组 [2,5,3,7,1]：

<div align="center"> <img src="pics/lc-dp-lis-tails.png" width="660px"/> </div><br>

tails 数组保持有序，因此可以用二分查找 x 的位置。需要注意的是，tails 不一定是真实的递增子序列，只有它的长度是答案。

```java
public int lengthOfLIS(int[] nums) {
    int n = nums.length;
    int[] tails = new int[n];
    int len = 0;
    for (int num : nums) {
        int index = binarySearch(tails, len, num);
        tails[index] = num;
        if (index == len) {
            len++;
        }
    }
    return len;
}

private int binarySearch(int[] tails, int len, int key) {
    int l = 0, h = len;
    while (l < h) {
        int mid = l + (h - l) / 2;
        if (tails[mid] == key) {
            return mid;
        } else if (tails[mid] > key) {
            h = mid;
        } else {
            l = mid + 1;
        }
    }
    return l;
}
```

要输出一个最长递增子序列，可以在 O(N<sup>2</sup>) 解法中用 prev[i] 记录 dp[i] 由哪个 j 转移而来，再从 dp 最大的位置沿 prev 往回走。

### 2. 一组整数对能够构成的最长链

646\. Maximum Length of Pair Chain (Medium)

[Leetcode](https://leetcode.com/problems/maximum-length-of-pair-chain/description/) / [力扣](https://leetcode-cn.com/problems/maximum-length-of-pair-chain/description/)

```text
Input: [[1,2], [2,3], [3,4]]
Output: 2
Explanation: The longest chain is [1,2] -> [3,4]
```

题目描述：对于 (a, b) 和 (c, d) ，如果 b \< c，则它们可以构成一条链。

整数对可以按任意顺序选取，链上的左端点一定递增，因此先按左端点排序，再按最长递增子序列的方法求解。

```java
public int findLongestChain(int[][] pairs) {
    if (pairs == null || pairs.length == 0) {
        return 0;
    }
    Arrays.sort(pairs, (a, b) -> (a[0] - b[0]));
    int n = pairs.length;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (pairs[j][1] < pairs[i][0]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    return Arrays.stream(dp).max().orElse(0);
}
```

### 3. 最长摆动子序列

376\. Wiggle Subsequence (Medium)

[Leetcode](https://leetcode.com/problems/wiggle-subsequence/description/) / [力扣](https://leetcode-cn.com/problems/wiggle-subsequence/description/)

```text
Input: [1,7,4,9,2,5]
Output: 6
The entire sequence is a wiggle sequence.

Input: [1,17,5,10,13,15,10,5,16,8]
Output: 7
There are several subsequences that achieve this length. One is [1,17,10,13,10,16,8].

Input: [1,2,3,4,5,6,7,8,9]
Output: 2
```

要求：使用 O(N) 时间复杂度求解。

up、down 分别表示到当前元素为止、最后一步上升和下降的最长摆动子序列长度。nums[i] > nums[i - 1] 时，nums[i] 可以接在最后一步下降的序列后面，up = down + 1；下降时 down = up + 1；相等时都不变。

```java
public int wiggleMaxLength(int[] nums) {
    if (nums == null || nums.length == 0) {
        return 0;
    }
    int up = 1, down = 1;
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] > nums[i - 1]) {
            up = down + 1;
        } else if (nums[i] < nums[i - 1]) {
            down = up + 1;
        }
    }
    return Math.max(up, down);
}
```

## 最长公共子序列

对于两个序列 S1 和 S2，找出它们最长的公共子序列。

定义一个二维数组 dp 用来存储最长公共子序列的长度，其中 dp[i][j] 表示 S1 的前 i 个字符与 S2 的前 j 个字符最长公共子序列的长度。考虑 S1<sub>i</sub> 与 S2<sub>j</sub> 值是否相等，分为两种情况：

- 当 S1<sub>i</sub>==S2<sub>j</sub> 时，那么就能在 S1 的前 i-1 个字符与 S2 的前 j-1 个字符最长公共子序列的基础上再加上 S1<sub>i</sub> 这个值，最长公共子序列长度加 1，即 dp[i][j] = dp[i-1][j-1] + 1。
- 当 S1<sub>i</sub> != S2<sub>j</sub> 时，此时最长公共子序列为 S1 的前 i-1 个字符和 S2 的前 j 个字符最长公共子序列，或者 S1 的前 i 个字符和 S2 的前 j-1 个字符最长公共子序列，取它们的最大者，即 dp[i][j] = max{ dp[i-1][j], dp[i][j-1] }。

综上，最长公共子序列的状态转移方程为：

<div align="center"> <img src="pics/lc-dp-lcs.png" width="660px"/> </div><br>

对于长度为 N 的序列 S<sub>1</sub> 和长度为 M 的序列 S<sub>2</sub>，dp[N][M] 就是序列 S<sub>1</sub> 和序列 S<sub>2</sub> 的最长公共子序列长度。

与最长递增子序列相比，最长公共子序列有以下不同点：

- 针对的是两个序列，求它们的最长公共子序列；
- 在最长递增子序列中，dp[i] 表示以 S<sub>i</sub> 为结尾的最长递增子序列长度，子序列必须包含 S<sub>i</sub> ；在最长公共子序列中，dp[i][j] 表示 S1 中前 i 个字符与 S2 中前 j 个字符的最长公共子序列长度，不一定包含 S1<sub>i</sub> 和 S2<sub>j</sub>；
- 在求最终解时，最长公共子序列中 dp[N][M] 就是最终解，而最长递增子序列中 dp[N] 不是最终解，因为以 S<sub>N</sub> 为结尾的最长递增子序列不一定是整个序列最长递增子序列，需要遍历一遍 dp 数组找到最大者。

### 1. 最长公共子序列

1143\. Longest Common Subsequence

[Leetcode](https://leetcode.com/problems/longest-common-subsequence/) / [力扣](https://leetcode-cn.com/problems/longest-common-subsequence/)

```java
public int longestCommonSubsequence(String text1, String text2) {
    int n1 = text1.length(), n2 = text2.length();
    int[][] dp = new int[n1 + 1][n2 + 1];
    for (int i = 1; i <= n1; i++) {
        for (int j = 1; j <= n2; j++) {
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[n1][n2];
}
```

可以像[矩阵的最小路径和](#1-矩阵的最小路径和)一样只用一行滚动更新，空间降为 O(min(M, N))。左上角 dp[i - 1][j - 1] 在算 dp[j - 1] 时已被覆盖，要提前用变量保存：

```java
public int longestCommonSubsequence(String text1, String text2) {
    if (text1.length() < text2.length()) {   // 让 text2 是较短的那个
        String t = text1;
        text1 = text2;
        text2 = t;
    }
    int n = text2.length();
    int[] dp = new int[n + 1];
    for (int i = 1; i <= text1.length(); i++) {
        int leftUp = 0;                   // dp[i - 1][j - 1]
        for (int j = 1; j <= n; j++) {
            int up = dp[j];               // dp[i - 1][j]，被覆盖前先保存
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                dp[j] = leftUp + 1;
            } else {
                dp[j] = Math.max(up, dp[j - 1]);
            }
            leftUp = up;
        }
    }
    return dp[n];
}
```

## 0-1 背包

有一个容量为 W 的背包和 N 件物品，要用这个背包装下物品的价值最大，这些物品有两个属性：体积 w 和价值 v。

定义一个二维数组 dp 存储最大价值，其中 dp[i][j] 表示前 i 件物品体积不超过 j 的情况下能达到的最大价值。设第 i 件物品体积为 w，价值为 v，根据第 i 件物品是否添加到背包中，可以分两种情况讨论：

- 第 i 件物品没添加到背包，总体积不超过 j 的前 i 件物品的最大价值就是总体积不超过 j 的前 i-1 件物品的最大价值，dp[i][j] = dp[i-1][j]。
- 第 i 件物品添加到背包中，dp[i][j] = dp[i-1][j-w] + v。

第 i 件物品可添加也可以不添加，取决于哪种情况下最大价值更大。因此，0-1 背包的状态转移方程为：

<div align="center"> <img src="pics/lc-dp-knapsack.png" width="520px"/> </div><br>

```java
// W 为背包总体积
// N 为物品数量
// weights 数组存储 N 个物品的重量
// values 数组存储 N 个物品的价值
public int knapsack(int W, int N, int[] weights, int[] values) {
    int[][] dp = new int[N + 1][W + 1];
    for (int i = 1; i <= N; i++) {
        int w = weights[i - 1], v = values[i - 1];
        for (int j = 1; j <= W; j++) {
            if (j >= w) {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - w] + v);
            } else {
                dp[i][j] = dp[i - 1][j];
            }
        }
    }
    return dp[N][W];
}
```

#### 空间优化

在程序实现时可以对 0-1 背包做优化。观察状态转移方程可以知道，前 i 件物品的状态仅与前 i-1 件物品的状态有关，因此可以将 dp 定义为一维数组，其中 dp[j] 既可以表示 dp[i-1][j] 也可以表示 dp[i][j]。此时，

<div align="center"> <img src="pics/lc-dp-knapsack-1d.png" width="540px"/> </div><br>

因为 dp[j-w] 表示 dp[i-1][j-w]，因此不能先求 dp[i][j-w]，防止将 dp[i-1][j-w] 覆盖。也就是说要先计算 dp[i][j] 再计算 dp[i][j-w]，在程序实现时需要按倒序来循环求解。

```java
public int knapsack(int W, int N, int[] weights, int[] values) {
    int[] dp = new int[W + 1];
    for (int i = 1; i <= N; i++) {
        int w = weights[i - 1], v = values[i - 1];
        for (int j = W; j >= 1; j--) {
            if (j >= w) {
                dp[j] = Math.max(dp[j], dp[j - w] + v);
            }
        }
    }
    return dp[W];
}
```

#### 无法使用贪心算法的解释

0-1 背包问题无法使用贪心算法来求解，也就是说不能按照先添加性价比最高的物品来达到最优，这是因为这种方式可能造成背包空间的浪费，从而无法达到最优。考虑下面的物品和一个容量为 5 的背包，如果先添加物品 0 再添加物品 1，那么只能存放的价值为 16，浪费了大小为 2 的空间。最优的方式是存放物品 1 和物品 2，价值为 22。

| id | w | v | v/w |
| --- | --- | --- | --- |
| 0 | 1 | 6 | 6 |
| 1 | 2 | 10 | 5 |
| 2 | 3 | 12 | 4 |

#### 变种

- 完全背包：每种物品的数量无限，例如[找零钱的最少硬币数](#4-找零钱的最少硬币数)；
- 多重背包：每种物品的数量有限制；
- 多维费用背包：物品不仅有重量，还有体积，同时考虑这两种限制，例如 [01 字符构成最多的字符串](#3-01-字符构成最多的字符串)；
- 其它：物品之间相互约束或者依赖。

### 1. 划分数组为和相等的两部分

416\. Partition Equal Subset Sum (Medium)

[Leetcode](https://leetcode.com/problems/partition-equal-subset-sum/description/) / [力扣](https://leetcode-cn.com/problems/partition-equal-subset-sum/description/)

```text
Input: [1, 5, 11, 5]

Output: true

Explanation: The array can be partitioned as [1, 5, 5] and [11].
```

可以看成一个背包大小为 sum/2 的 0-1 背包问题。

```java
public boolean canPartition(int[] nums) {
    int sum = computeArraySum(nums);
    if (sum % 2 != 0) {
        return false;
    }
    int W = sum / 2;
    boolean[] dp = new boolean[W + 1];
    dp[0] = true;
    for (int num : nums) {                 // 0-1 背包一个物品只能用一次
        for (int i = W; i >= num; i--) {   // 从后往前，先计算 dp[i] 再计算 dp[i-num]
            dp[i] = dp[i] || dp[i - num];
        }
    }
    return dp[W];
}

private int computeArraySum(int[] nums) {
    int sum = 0;
    for (int num : nums) {
        sum += num;
    }
    return sum;
}
```

### 2. 改变一组数的正负号使得它们的和为一给定数

494\. Target Sum (Medium)

[Leetcode](https://leetcode.com/problems/target-sum/description/) / [力扣](https://leetcode-cn.com/problems/target-sum/description/)

```text
Input: nums is [1, 1, 1, 1, 1], S is 3.
Output: 5
Explanation:

-1+1+1+1+1 = 3
+1-1+1+1+1 = 3
+1+1-1+1+1 = 3
+1+1+1-1+1 = 3
+1+1+1+1-1 = 3

There are 5 ways to assign symbols to make the sum of nums be target 3.
```

该问题可以转换为 Subset Sum 问题，从而使用 0-1 背包的方法来求解。

可以将这组数看成两部分，P 和 N，其中 P 使用正号，N 使用负号，有以下推导：

```text
                  sum(P) - sum(N) = target
sum(P) + sum(N) + sum(P) - sum(N) = target + sum(P) + sum(N)
                       2 * sum(P) = target + sum(nums)
```

每种添加符号的方式对应一个取正号的子集 P，因此答案是和为 W = (target + sum(nums)) / 2 的子集个数。dp[j] 表示和为 j 的子集个数，dp[0] = 1 对应空集。

```java
public int findTargetSumWays(int[] nums, int S) {
    int sum = computeArraySum(nums);
    if (sum < Math.abs(S) || (sum + S) % 2 != 0) {
        return 0;
    }
    int W = (sum + S) / 2;
    int[] dp = new int[W + 1];
    dp[0] = 1;
    for (int num : nums) {
        for (int i = W; i >= num; i--) {
            dp[i] = dp[i] + dp[i - num];
        }
    }
    return dp[W];
}

private int computeArraySum(int[] nums) {
    int sum = 0;
    for (int num : nums) {
        sum += num;
    }
    return sum;
}
```

DFS 解法：

```java
public int findTargetSumWays(int[] nums, int S) {
    return findTargetSumWays(nums, 0, S);
}

private int findTargetSumWays(int[] nums, int start, int S) {
    if (start == nums.length) {
        return S == 0 ? 1 : 0;
    }
    return findTargetSumWays(nums, start + 1, S + nums[start])
            + findTargetSumWays(nums, start + 1, S - nums[start]);
}
```

### 3. 01 字符构成最多的字符串

474\. Ones and Zeroes (Medium)

[Leetcode](https://leetcode.com/problems/ones-and-zeroes/description/) / [力扣](https://leetcode-cn.com/problems/ones-and-zeroes/description/)

```text
Input: Array = {"10", "0001", "111001", "1", "0"}, m = 5, n = 3
Output: 4

Explanation: There are totally 4 strings can be formed by the using of 5 0s and 3 1s, which are "10","0001","1","0"
```

这是一个多维费用的 0-1 背包问题，有两个背包大小，0 的数量和 1 的数量。

```java
public int findMaxForm(String[] strs, int m, int n) {
    if (strs == null || strs.length == 0) {
        return 0;
    }
    int[][] dp = new int[m + 1][n + 1];
    for (String s : strs) {    // 每个字符串只能用一次
        int ones = 0, zeros = 0;
        for (char c : s.toCharArray()) {
            if (c == '0') {
                zeros++;
            } else {
                ones++;
            }
        }
        for (int i = m; i >= zeros; i--) {
            for (int j = n; j >= ones; j--) {
                dp[i][j] = Math.max(dp[i][j], dp[i - zeros][j - ones] + 1);
            }
        }
    }
    return dp[m][n];
}
```

### 4. 找零钱的最少硬币数

322\. Coin Change (Medium)

[Leetcode](https://leetcode.com/problems/coin-change/description/) / [力扣](https://leetcode-cn.com/problems/coin-change/description/)

```text
Example 1:
coins = [1, 2, 5], amount = 11
return 3 (11 = 5 + 5 + 1)

Example 2:
coins = [2], amount = 3
return -1.
```

题目描述：给一些面额的硬币，要求用这些硬币来组成给定面额的钱数，并且使得硬币数量最少。硬币可以重复使用。

- 物品：硬币
- 物品大小：面额
- 物品价值：数量

因为硬币可以重复使用，因此这是一个完全背包问题。完全背包只需要将 0-1 背包的逆序遍历 dp 数组改为正序遍历即可（见[空间优化](#空间优化)），正序时 dp[i - coin] 可能已经放过本轮的硬币，相当于同一种硬币再放一次。dp[i] 表示凑出金额 i 的最少硬币数。

每次选面额最大的硬币不一定最优，例如 coins = [1, 3, 4]、amount = 6，贪心得到 4 + 1 + 1，最优是 3 + 3。

```java
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);   // amount + 1 表示凑不出
    dp[0] = 0;
    for (int coin : coins) {
        for (int i = coin; i <= amount; i++) {   // 将逆序遍历改为正序遍历
            dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}
```

### 5. 找零钱的硬币数组合

518\. Coin Change II (Medium)

[Leetcode](https://leetcode.com/problems/coin-change-ii/description/) / [力扣](https://leetcode-cn.com/problems/coin-change-ii/description/)

```text
Input: amount = 5, coins = [1, 2, 5]
Output: 4
Explanation: there are four ways to make up the amount:
5=5
5=2+2+1
5=2+1+1+1
5=1+1+1+1+1
```

完全背包问题，dp[i] 记录凑出金额 i 的组合数目。外层遍历硬币、内层遍历金额，硬币按固定的顺序加入，1+2 和 2+1 只算一种。

```java
public int change(int amount, int[] coins) {
    if (coins == null) {
        return 0;
    }
    int[] dp = new int[amount + 1];
    dp[0] = 1;
    for (int coin : coins) {
        for (int i = coin; i <= amount; i++) {
            dp[i] += dp[i - coin];
        }
    }
    return dp[amount];
}
```

### 6. 字符串按单词列表分割

139\. Word Break (Medium)

[Leetcode](https://leetcode.com/problems/word-break/description/) / [力扣](https://leetcode-cn.com/problems/word-break/description/)

```text
s = "leetcode",
dict = ["leet", "code"].
Return true because "leetcode" can be segmented as "leet code".
```

dp[i] 表示 s 的前 i 个字符能否拆分成 dict 中的单词。dict 中的单词没有使用次数的限制，因此这是一个完全背包问题。

与上一题不同，单词在 s 中的先后顺序任意，因此外层遍历位置 i、内层遍历单词。交换两层循环时单词只能按 dict 中的顺序出现，例如 s = "codeleet"、dict = ["leet", "code"] 会得到 false。

```java
public boolean wordBreak(String s, List<String> wordDict) {
    int n = s.length();
    boolean[] dp = new boolean[n + 1];
    dp[0] = true;
    for (int i = 1; i <= n; i++) {
        for (String word : wordDict) {   // 对物品的迭代应该放在最里层
            int len = word.length();
            if (len <= i && word.equals(s.substring(i - len, i))) {
                dp[i] = dp[i] || dp[i - len];
            }
        }
    }
    return dp[n];
}
```

### 7. 组合总和

377\. Combination Sum IV (Medium)

[Leetcode](https://leetcode.com/problems/combination-sum-iv/description/) / [力扣](https://leetcode-cn.com/problems/combination-sum-iv/description/)

```text
nums = [1, 2, 3]
target = 4

The possible combination ways are:
(1, 1, 1, 1)
(1, 1, 2)
(1, 2, 1)
(1, 3)
(2, 1, 1)
(2, 2)
(3, 1)

Note that different sequences are counted as different combinations.

Therefore the output is 7.
```

涉及顺序的完全背包。外层遍历 target、内层遍历 nums，每个金额的最后一个数可以是任意一个 num，(1, 2) 和 (2, 1) 分别计数。以 nums = [1, 2]、target = 3 对比[找零钱的硬币数组合](#5-找零钱的硬币数组合)：

```text
外层遍历硬币（518）：处理 1 后 dp = [1, 1, 1, 1]，处理 2 后 dp = [1, 1, 2, 2]   2 种：1+1+1、1+2
外层遍历金额（377）：dp = [1, 1, 2, 3]                                          3 种：1+1+1、1+2、2+1
```

```java
public int combinationSum4(int[] nums, int target) {
    if (nums == null || nums.length == 0) {
        return 0;
    }
    int[] maximum = new int[target + 1];
    maximum[0] = 1;
    Arrays.sort(nums);
    for (int i = 1; i <= target; i++) {
        for (int j = 0; j < nums.length && nums[j] <= i; j++) {
            maximum[i] += maximum[i - nums[j]];
        }
    }
    return maximum[target];
}
```

## 股票交易

### 1. 需要冷却期的股票交易

309\. Best Time to Buy and Sell Stock with Cooldown (Medium)

[Leetcode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/description/) / [力扣](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/description/)

题目描述：可以进行多次交易，但卖出之后需要有一天的冷却时间才能再次买入。

buy、s1、sell、s2 分别表示当天买入、持有且当天没买、当天卖出、不持有且当天没卖，值为到这一天为止的最大收益。冷却期体现在 buy 只能从前一天的 s2 转移过来。第 0 天的 s1、sell 只是占位初值，不会得到比合法交易更大的收益。

<div align="center"> <img src="pics/lc-dp-stock-cooldown.png" width="660px"/> </div><br>

```java
public int maxProfit(int[] prices) {
    if (prices == null || prices.length == 0) {
        return 0;
    }
    int N = prices.length;
    int[] buy = new int[N];
    int[] s1 = new int[N];
    int[] sell = new int[N];
    int[] s2 = new int[N];
    s1[0] = buy[0] = -prices[0];
    sell[0] = s2[0] = 0;
    for (int i = 1; i < N; i++) {
        buy[i] = s2[i - 1] - prices[i];
        s1[i] = Math.max(buy[i - 1], s1[i - 1]);
        sell[i] = Math.max(buy[i - 1], s1[i - 1]) + prices[i];
        s2[i] = Math.max(s2[i - 1], sell[i - 1]);
    }
    return Math.max(sell[N - 1], s2[N - 1]);
}
```

### 2. 需要交易费用的股票交易

714\. Best Time to Buy and Sell Stock with Transaction Fee (Medium)

[Leetcode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/description/) / [力扣](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/description/)

```text
Input: prices = [1, 3, 2, 8, 4, 9], fee = 2
Output: 8
Explanation: The maximum profit can be achieved by:
Buying at prices[0] = 1
Selling at prices[3] = 8
Buying at prices[4] = 4
Selling at prices[5] = 9
The total profit is ((8 - 1) - 2) + ((9 - 4) - 2) = 8.
```

题目描述：每交易一次，都要支付一定的费用。

状态与[需要冷却期的股票交易](#1-需要冷却期的股票交易)相同，区别是 buy 也可以从前一天的 sell 转移过来，卖出时扣除手续费。

<div align="center"> <img src="pics/lc-dp-stock-fee.png" width="660px"/> </div><br>

```java
public int maxProfit(int[] prices, int fee) {
    int N = prices.length;
    int[] buy = new int[N];
    int[] s1 = new int[N];
    int[] sell = new int[N];
    int[] s2 = new int[N];
    s1[0] = buy[0] = -prices[0];
    sell[0] = s2[0] = 0;
    for (int i = 1; i < N; i++) {
        buy[i] = Math.max(sell[i - 1], s2[i - 1]) - prices[i];
        s1[i] = Math.max(buy[i - 1], s1[i - 1]);
        sell[i] = Math.max(buy[i - 1], s1[i - 1]) - fee + prices[i];
        s2[i] = Math.max(s2[i - 1], sell[i - 1]);
    }
    return Math.max(sell[N - 1], s2[N - 1]);
}
```

### 3. 只能进行两次的股票交易

123\. Best Time to Buy and Sell Stock III (Hard)

[Leetcode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/description/) / [力扣](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iii/description/)

四个变量依次是到当天为止完成第一次买入、第一次卖出、第二次买入、第二次卖出后的最大收益，第二次买入以第一次卖出的收益为起点。

```java
public int maxProfit(int[] prices) {
    int firstBuy = Integer.MIN_VALUE, firstSell = 0;
    int secondBuy = Integer.MIN_VALUE, secondSell = 0;
    for (int curPrice : prices) {
        if (firstBuy < -curPrice) {
            firstBuy = -curPrice;
        }
        if (firstSell < firstBuy + curPrice) {
            firstSell = firstBuy + curPrice;
        }
        if (secondBuy < firstSell - curPrice) {
            secondBuy = firstSell - curPrice;
        }
        if (secondSell < secondBuy + curPrice) {
            secondSell = secondBuy + curPrice;
        }
    }
    return secondSell;
}
```

### 4. 只能进行 k 次的股票交易

188\. Best Time to Buy and Sell Stock IV (Hard)

[Leetcode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/description/) / [力扣](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iv/description/)

maxProfit[i][j] 表示最多交易 i 次、到第 j 天为止的最大收益。第 j 天要么不卖出，收益为 maxProfit[i][j - 1]；要么在之前的某天 m 买入、第 j 天卖出，收益为 prices[j] + max(maxProfit[i - 1][m] - prices[m])，localMax 在遍历 j 时维护这个最大值。k >= n / 2 时次数不构成限制，累加所有上涨的差价即可。

```java
public int maxProfit(int k, int[] prices) {
    int n = prices.length;
    if (k >= n / 2) {   // 这种情况下该问题退化为普通的股票交易问题
        int maxProfit = 0;
        for (int i = 1; i < n; i++) {
            if (prices[i] > prices[i - 1]) {
                maxProfit += prices[i] - prices[i - 1];
            }
        }
        return maxProfit;
    }
    int[][] maxProfit = new int[k + 1][n];
    for (int i = 1; i <= k; i++) {
        int localMax = maxProfit[i - 1][0] - prices[0];
        for (int j = 1; j < n; j++) {
            maxProfit[i][j] = Math.max(maxProfit[i][j - 1], prices[j] + localMax);
            localMax = Math.max(localMax, maxProfit[i - 1][j] - prices[j]);
        }
    }
    return maxProfit[k][n - 1];
}
```

## 字符串编辑

### 1. 删除两个字符串的字符使它们相等

583\. Delete Operation for Two Strings (Medium)

[Leetcode](https://leetcode.com/problems/delete-operation-for-two-strings/description/) / [力扣](https://leetcode-cn.com/problems/delete-operation-for-two-strings/description/)

```text
Input: "sea", "eat"
Output: 2
Explanation: You need one step to make "sea" to "ea" and another step to make "eat" to "ea".
```

可以转换为求两个字符串的最长公共子序列问题：两个字符串都只保留最长公共子序列，其余字符删掉，删除次数为 m + n - 2 \* LCS。

```java
public int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i][j - 1], dp[i - 1][j]);
            }
        }
    }
    return m + n - 2 * dp[m][n];
}
```

### 2. 编辑距离

72\. Edit Distance (Medium)

[Leetcode](https://leetcode.com/problems/edit-distance/description/) / [力扣](https://leetcode-cn.com/problems/edit-distance/description/)

```text
Example 1:

Input: word1 = "horse", word2 = "ros"
Output: 3
Explanation:
horse -> rorse (replace 'h' with 'r')
rorse -> rose (remove 'r')
rose -> ros (remove 'e')
Example 2:

Input: word1 = "intention", word2 = "execution"
Output: 5
Explanation:
intention -> inention (remove 't')
inention -> enention (replace 'i' with 'e')
enention -> exention (replace 'n' with 'x')
exention -> exection (replace 'n' with 'c')
exection -> execution (insert 'u')
```

题目描述：修改一个字符串成为另一个字符串，使得修改次数最少。一次修改操作包括：插入一个字符、删除一个字符、替换一个字符。

dp[i][j] 表示 word1 的前 i 个字符变成 word2 的前 j 个字符的最少操作数。最后一个字符相等时 dp[i][j] = dp[i - 1][j - 1]；不相等时，最后一步是替换、删除或插入，取三者的最小值再加 1：

<div align="center"> <img src="pics/lc-dp-edit-distance.png" width="660px"/> </div><br>

```java
public int minDistance(String word1, String word2) {
    if (word1 == null || word2 == null) {
        return 0;
    }
    int m = word1.length(), n = word2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++) {
        dp[i][0] = i;
    }
    for (int i = 1; i <= n; i++) {
        dp[0][i] = i;
    }
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(dp[i - 1][j - 1], Math.min(dp[i][j - 1], dp[i - 1][j])) + 1;
            }
        }
    }
    return dp[m][n];
}
```

空间复杂度可以和[最长公共子序列](#1-最长公共子序列)一样用一维数组降到 O(N)。

### 3. 复制粘贴字符

650\. 2 Keys Keyboard (Medium)

[Leetcode](https://leetcode.com/problems/2-keys-keyboard/description/) / [力扣](https://leetcode-cn.com/problems/2-keys-keyboard/description/)

题目描述：最开始只有一个字符 A，问需要多少次操作能够得到 n 个字符 A，每次操作可以复制当前所有的字符，或者粘贴。

```text
Input: 3
Output: 3
Explanation:
Initially, we have one character 'A'.
In step 1, we use Copy All operation.
In step 2, we use Paste operation to get 'AA'.
In step 3, we use Paste operation to get 'AAA'.
```

如果 n 有因子 i，可以先得到 n / i 个 A，再复制一次、粘贴 i - 1 次，用 i 步变成 n 个 A。因此总步数是 n 的质因数之和，例如 12 = 2 × 2 × 3，需要 7 步。

```java
public int minSteps(int n) {
    if (n == 1) return 0;
    for (int i = 2; i <= Math.sqrt(n); i++) {
        if (n % i == 0) return i + minSteps(n / i);
    }
    return n;
}
```

```java
public int minSteps(int n) {
    int[] dp = new int[n + 1];
    int h = (int) Math.sqrt(n);
    for (int i = 2; i <= n; i++) {
        dp[i] = i;
        for (int j = 2; j <= h; j++) {
            if (i % j == 0) {
                dp[i] = dp[j] + dp[i / j];
                break;
            }
        }
    }
    return dp[n];
}
```

## 参考资料

- [LeetCode 题库](https://leetcode.com/problemset/)
- 左程云. 程序员代码面试指南：IT 名企算法与数据结构题目最优解 [M]. 电子工业出版社, 2015.
