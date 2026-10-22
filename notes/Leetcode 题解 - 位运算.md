```markdown
# Leetcode 题解 - 位运算

<!-- GFM-TOC -->
* [Leetcode 题解 - 位运算](#leetcode-题解---位运算)
    * [0. 原理](#0-原理)
    * [1. 统计两个数的二进制表示有多少位不同](#1-统计两个数的二进制表示有多少位不同)
    * [2. 数组中唯一一个不重复的元素](#2-数组中唯一一个不重复的元素)
    * [3. 找出数组中缺失的那个数](#3-找出数组中缺失的那个数)
    * [4. 数组中不重复的两个元素](#4-数组中不重复的两个元素)
    * [5. 翻转一个数的比特位](#5-翻转一个数的比特位)
    * [6. 不用额外变量交换两个整数](#6-不用额外变量交换两个整数)
    * [7. 判断一个数是不是 2 的 n 次方](#7-判断一个数是不是-2-的-n-次方)
    * [8. 判断一个数是不是 4 的 n 次方](#8-判断一个数是不是-4-的-n-次方)
    * [9. 判断一个数的位级表示是否不会出现连续的 0 和 1](#9-判断一个数的位级表示是否不会出现连续的-0-和-1)
    * [10. 求一个数的补码](#10-求一个数的补码)
    * [11. 实现整数的加法](#11-实现整数的加法)
    * [12. 字符串数组最大乘积](#12-字符串数组最大乘积)
    * [13. 统计从 0 \~ n 每个数的二进制表示中 1 的个数](#13-统计从-0-\~-n-每个数的二进制表示中-1-的个数)
<!-- GFM-TOC -->

## 0. 原理

**基本原理** 

在位运算中，0s 表示一串二进制的 0，1s 表示一串二进制的 1。以下是一些基本的位运算规则：

```
x ^ 0s = x       // x 与 0 进行异或结果为 x
x & 0s = 0       // x 与 0 进行与操作结果为 0
x | 0s = x       // x 与 0 进行或操作结果为 x
x ^ 1s = ~x      // x 与 1 进行异或结果为 ~x（取反）
x & 1s = x       // x 与 1 进行与操作结果为 x
x | 1s = 1s      // x 与 1 进行或操作结果为 1s
x ^ x = 0        // x 与自身进行异或结果为 0
x & x = x        // x 与自身进行与操作结果为 x
x | x = x        // x 与自身进行或操作结果为 x
```

利用 `x ^ 1s = ~x` 可以翻转一个数字的比特位，而利用 `x ^ x = 0` 可以将三个数中重复的两个数去除，只留下一个不同数。例如，`1^1^2 = 2`。

使用 `x & 0s = 0` 和 `x & 1s = x` 的性质，可以实现掩码操作。例如，与掩码 `00111100` 进行位与操作只保留与掩码的 1 部分相对应的位。

```
01011011 &
00111100
--------
00011000
```

**位与运算技巧** 

1. **删除最低位的 1**: `n & (n - 1)` 可以去除 n 的最低位的 1。例如，对于二进制 `01011011`，减去 1 得到 `01011010`，两者相与结果为 `01011010`。
   
   ```
   01011011 &
   01011010
   --------
   01011010
   ```

2. **获取最低位的 1**: `n & -n` 可以得到 n 的最低位的 1。`-n` 是 n 的反码加 1，因此 `-n = ~n + 1`。例如，对于二进制的 `10110100`，`-n` 得到 `01001100`，两者相与的结果为 `00000100`。
   
   ```
   10110100 &
   01001100
   --------
   00000100
   ```

3. **另一种删除最低位的 1**: `n - (n & -n)` 也可以去除 n 的最低位的 1，和 `n & (n - 1)` 效果相同。

**移位运算** 

- `>>` 为算术右移，相当于除以 `2^n`，例如 `-7 >> 2 = -2`。
- `>>>` 为无符号右移，左边补 0，例如 `-7 >>> 2 = 1073741822`。
- `<<` 为算术左移，相当于乘以 `2^n`，例如 `-7 << 2 = -28`。

**掩码计算** 

- 获取所有位为接收相当于 `~0`。
- 生成第 `i` 位为 1 的掩码可以通过 `1 << (i - 1)` 来获取，例如 `1 << 4` 生成 `00010000`。
- 生成 1 到 i 位为 1 的掩码则可以使用 `(1 << i) - 1`，例如 `(1 << 4) - 1 = 00001111`。
- 生成 1 到 i 位为 0 的掩码即为对前述掩码取反 `~((1 << i) - 1)`。

**Java 中的位操作**  

```java
static int Integer.bitCount();           // 统计 1 的数量
static int Integer.highestOneBit();      // 获得最高位
static String toBinaryString(int i);     // 转换为二进制表示的字符串
```

## 1. 统计两个数的二进制表示有多少位不同

**461. Hamming Distance (Easy)**

[Leetcode](https://leetcode.com/problems/hamming-distance/) / [力扣](https://leetcode-cn.com/problems/hamming-distance/)

```java
Input: x = 1, y = 4
Output: 2
```

**解析**: 对两个数进行异或操作，结果中位级表示不同的位为 1，统计有多少个 1。

```java
public int hammingDistance(int x, int y) {
    int z = x ^ y; // 计算异或
    int cnt = 0; // 统计不同位数
    while (z != 0) { // 直到 z 为 0
        if ((z & 1) == 1) cnt++; // 统计末尾的 1
        z = z >> 1; // 右移一位
    }
    return cnt;
}
```

**优化解法**: 使用 `z & (z - 1)` 去除 z 的最低位的 1。

```java
public int hammingDistance(int x, int y) {
    int z = x ^ y; // 计算异或
    int cnt = 0; // 统计不同位数
    while (z != 0) { // 直到 z 为 0
        z &= (z - 1); // 去掉最低位的 1
        cnt++; // 计数加 1
    }
    return cnt;
}
```

**更简洁的解法**: 利用 `Integer.bitCount()` 方法来统计 1 的个数。

```java
public int hammingDistance(int x, int y) {
    return Integer.bitCount(x ^ y); // 使用 Java 内置函数
}
```

## 2. 数组中唯一一个不重复的元素

**136. Single Number (Easy)**

[Leetcode](https://leetcode.com/problems/single-number/description/) / [力扣](https://leetcode-cn.com/problems/single-number/description/)

```java
Input: [4,1,2,1,2]
Output: 4
```

**解析**: 两个相同的数进行异或操作的结果为 0，遍历所有数进行异或，最终结果即为单独出现的数。

```java
public int singleNumber(int[] nums) {
    int ret = 0; // 存储结果
    for (int n : nums) { // 遍历所有数字
        ret ^= n; // 进行异或操作
    }
    return ret; // 返回结果
}
```

## 3. 找出数组中缺失的那个数

**268. Missing Number (Easy)**

[Leetcode](https://leetcode.com/problems/missing-number/description/) / [力扣](https://leetcode-cn.com/problems/missing-number/description/)

```java
Input: [3,0,1]
Output: 2
```

**题目描述**: 在 0 到 n 的数组中，只有一个数缺失，要求找到这个缺失的数。

```java
public int missingNumber(int[] nums) {
    int ret = 0; // 存储结果
    for (int i = 0; i < nums.length; i++) { // 遍历索引
        ret ^= i ^ nums[i]; // 计算异或
    }
    return ret ^ nums.length; // 加上 n 的索引
}
```

## 4. 数组中不重复的两个元素

**260. Single Number III (Medium)**

[Leetcode](https://leetcode.com/problems/single-number-iii/description/) / [力扣](https://leetcode-cn.com/problems/single-number-iii/description/)

**解析**: 在一个数组中存在两个不相等的元素。使用异或运算可以将所有元素异或，最后得到的结果是这两个不同元素的异或值。

```java
public int[] singleNumber(int[] nums) {
    int diff = 0; // 存储异或结果
    for (int num : nums) {
        diff ^= num; // 异或所有元素
    }
    
    // 获取不重复元素的最低位不同的那一位
    diff &= -diff; 
    int[] ret = new int[2]; // 数组存储结果
    
    // 根据最低位不同分组
    for (int num : nums) {
        if ((num & diff) == 0) { // 分到第一组
            ret[0] ^= num; // 异或第一组的所有数
        } else { // 分到第二组
            ret[1] ^= num; // 异或第二组的所有数
        }
    }
    return ret; // 返回两个不重复的元素
}
```

## 5. 翻转一个数的比特位

**190. Reverse Bits (Easy)**

[Leetcode](https://leetcode.com/problems/reverse-bits/description/) / [力扣](https://leetcode-cn.com/problems/reverse-bits/description/)

**解析**: 通过对每一位进行移位与掩码结合最终得到翻转后的结果。

```java
public int reverseBits(int n) {
    int ret = 0; // 存储翻转后的结果
    for (int i = 0; i < 32; i++) { // 遍历 32 位
        ret <<= 1; // 左移一位
        ret |= (n & 1); // 取 n 最低位
        n >>>= 1; // 无符号右移
    }
    return ret; // 返回结果
}
```

**优化**: 如果函数调用次数较多，可以将整数拆分为 4 个 byte，缓存每个 byte 对应的比特位翻转，最后再拼接。

```java
private static Map<Byte, Integer> cache = new HashMap<>();

public int reverseBits(int n) {
    int ret = 0; // 存储结果
    for (int i = 0; i < 4; i++) { // 遍历 4 个 byte
        ret <<= 8; // 左移 8 位
        ret |= reverseByte((byte) (n & 0b11111111)); // 翻转 byte
        n >>= 8; // 右移 8 位
    }
    return ret; // 返回结果
}

private int reverseByte(byte b) {
    if (cache.containsKey(b)) return cache.get(b); // 使用缓存
    int ret = 0; // 存储翻转后的结果
    byte t = b; // 临时变量
    for (int i = 0; i < 8; i++) { // 遍历 8 位
        ret <<= 1; // 左移一位
        ret |= t & 1; // 取最低位
        t >>= 1; // 右移一位
    }
    cache.put(b, ret); // 缓存结果
    return ret; // 返回结果
}
```

## 6. 不用额外变量交换两个整数

[程序员代码面试指南 ：P317](#)

**解析**: 利用异或运算可以在不使用额外变量的情况下交换两个整数。

```java
a = a ^ b; // 将 a 和 b 异或，结果存回 a
b = a ^ b; // b 变为原始的 a
a = a ^ b; // a 变为原始的 b
```

## 7. 判断一个数是不是 2 的 n 次方

**231. Power of Two (Easy)**

[Leetcode](https://leetcode.com/problems/power-of-two/description/) / [力扣](https://leetcode-cn.com/problems/power-of-two/description/)

**解析**: 一个数是 2 的 n 次方的条件是其二进制表示中只有一个 1。

```java
public boolean isPowerOfTwo(int n) {
    return n > 0 && Integer.bitCount(n) == 1; // 校验 n 为正且只有一个 1
}
```

**另一个解法**: 利用性质 `n & (n - 1)` 得到的结果为 0。

```java
public boolean isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0; // 校验条件
}
```

## 8. 判断一个数是不是 4 的 n 次方

**342. Power of Four (Easy)**

[Leetcode](https://leetcode.com/problems/power-of-four/) / [力扣](https://leetcode-cn.com/problems/power-of-four/)

**解析**: 4 的 n 次方在二进制表示中只有一个偶数位为 1，利用这一特性可进行判断。

```java
public boolean isPowerOfFour(int num) {
    return num > 0 && (num & (num - 1)) == 0 && (num & 0b01010101010101010101010101010101) != 0;
}
```

**另一种解法**: 使用正则表达式匹配。

```java
public boolean isPowerOfFour(int num) {
    return Integer.toString(num, 4).matches("10*"); // 数字转换为 4 进制并匹配
}
```

## 9. 判断一个数的位级表示是否不会出现连续的 0 和 1

**693. Binary Number with Alternating Bits (Easy)**

[Leetcode](https://leetcode.com/problems/binary-number-with-alternating-bits/description/) / [力扣](https://leetcode-cn.com/problems/binary-number-with-alternating-bits/description/)

**解析**: 如果一个数的二进制表示中没有连续的 0 和 1，将这个数右移一位后进行异或运算，结果应为 `1111...`。

```java
public boolean hasAlternatingBits(int n) {
    int a = (n ^ (n >> 1)); // 计算异或
    return (a & (a + 1)) == 0; // 校验结果是否为 0
}
```

## 10. 求一个数的补码

**476. Number Complement (Easy)**

[Leetcode](https://leetcode.com/problems/number-complement/description/) / [力扣](https://leetcode-cn.com/problems/number-complement/description/)

**解析**: 要求一个数的补码可以通过与一个掩码进行异或得到，而掩码是由 1 组成的完全二进制数。

```java
public int findComplement(int num) {
    if (num == 0) return 1; // 特殊情况
    int mask = 1 << 30; // 计算掩码
    while ((num & mask) == 0) mask >>= 1; // 右移掩码至首个1位
    mask = (mask << 1) - 1; // 拿到有效的掩码
    return num ^ mask; // 计算补码
}
```

**优化解法**: 使用 `Integer.highestOneBit()` 计算掩码。

```java
public int findComplement(int num) {
    if (num == 0) return 1; // 特殊情况
    int mask = Integer.highestOneBit(num); // 找到最高位的 1
    mask = (mask << 1) - 1; // 创建掩码
    return num ^ mask; // 计算补码
}
```

**扩展掩码**: 若掩码需要扩展成数字的全 1 的形式，可以利用以下方法。

```java
mask |= mask >> 1; // 把高 1 向低位传递
mask |= mask >> 2; // ...
mask |= mask >> 4; // ...
mask |= mask >> 8; // ...
mask |= mask >> 16; // ...
```

```java
public int findComplement(int num) {
    int mask = num; // 复制 num 数
    mask |= mask >> 1; 
    mask |= mask >> 2; 
    mask |= mask >> 4;
    mask |= mask >> 8; 
    mask |= mask >> 16; 
    return (mask ^ num); // 返回数的补码
}
```

## 11. 实现整数的加法

**371. Sum of Two Integers (Easy)**

[Leetcode](https://leetcode.com/problems/sum-of-two-integers/description/) / [力扣](https://leetcode-cn.com/problems/sum-of-two-integers/description/)

**解析**: 用异或运算可以得到没有进位的和，而对进位使用与运算和左移来实现。

```java
public int getSum(int a, int b) {
    return b == 0 ? a : getSum((a ^ b), (a & b) << 1); // 递归计算
}
```

## 12. 字符串数组最大乘积

**318. Maximum Product of Word Lengths (Medium)**

[Leetcode](https://leetcode.com/problems/maximum-product-of-word-lengths/description/) / [力扣](https://leetcode-cn.com/problems/maximum-product-of-word-lengths/description/)

**题目描述**: 给定字符串数组，求两个字符串长度的最大乘积，要求这两个字符串不能含有相同字符。

**解析**: 利用 32 位整数作为掩码，记录每个字符串中出现的字符。

```java
public int maxProduct(String[] words) {
    int n = words.length; // 获取字符串数组的长度
    int[] val = new int[n]; // 存储每个字符串的掩码
    
    // 遍历所有字符串
    for (int i = 0; i < n; i++) {
        for (char c : words[i].toCharArray()) {
            val[i] |= 1 << (c - 'a'); // 对应字符的位设置为1
        }
    }
    int ret = 0; // 存储结果
    // 嵌套遍历所有字符串组合
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            // 如果两个字符串没有相同字符
            if ((val[i] & val[j]) == 0) {
                ret = Math.max(ret, words[i].length() * words[j].length()); // 更新最大乘积
            }
        }
    }
    return ret; // 返回结果
}
```

## 13. 统计从 0 \~ n 每个数的二进制表示中 1 的个数

**338. Counting Bits (Medium)**

[Leetcode](https://leetcode.com/problems/counting-bits/description/) / [力扣](https://leetcode-cn.com/problems/counting-bits/description/)

**解析**: 以动态规划的方式计算结果，对于每个数字 `i`，可以通过 `i & (i - 1)` 得到 1 的数量。

```java
public int[] countBits(int num) {
    int[] ret = new int[num + 1]; // 用于存储结果
    for (int i = 1; i <= num; i++) { // 从 1 开始计算
        ret[i] = ret[i & (i - 1)] + 1; // 递推关系
    }
    return ret; // 返回结果
}
```
```