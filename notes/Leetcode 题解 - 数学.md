```markdown
# Leetcode 题解 - 数学

## 素数分解

每一个数都可以分解成素数的乘积，例如 84 = 2<sup>2</sup> * 3<sup>1</sup> * 5<sup>0</sup> * 7<sup>1</sup> * 11<sup>0</sup> * 13<sup>0</sup> * 17<sup>0</sup> * ...

## 整除

设 x = 2<sup>m0</sup> * 3<sup>m1</sup> * 5<sup>m2</sup> * 7<sup>m3</sup> * 11<sup>m4</sup> * ...

设 y = 2<sup>n0</sup> * 3<sup>n1</sup> * 5<sup>n2</sup> * 7<sup>n3</sup> * 11<sup>n4</sup> * ...

如果 x 整除 y（即 y mod x == 0），那么对于所有的 i，必定有 m<sub>i</sub> <= n<sub>i</sub>。

## 最大公约数与最小公倍数

给定两个数 x 和 y，其最大公约数表示为 gcd(x, y)，计算公式为：

gcd(x,y) = 2<sup>min(m0,n0)</sup> * 3<sup>min(m1,n1)</sup> * 5<sup>min(m2,n2)</sup> * ...

而它们的最小公倍数则为：

lcm(x,y) = 2<sup>max(m0,n0)</sup> * 3<sup>max(m1,n1)</sup> * 5<sup>max(m2,n2)</sup> * ...

### 1. 生成素数序列

**题目 204**: 计算小于 n 的素数数量 (Easy)

[Leetcode](https://leetcode.com/problems/count-primes/description/) / [力扣](https://leetcode-cn.com/problems/count-primes/description/)

使用埃拉托斯特尼筛法，每次找到一个素数时，将所有该素数的倍数标记为非素数。

```java
public int countPrimes(int n) {
    boolean[] notPrimes = new boolean[n + 1];
    int count = 0;
    for (int i = 2; i < n; i++) {
        if (notPrimes[i]) {
            continue; // 如果不是素数，跳过
        }
        count++; // 发现一个素数
        // 从 i * i 开始，因为小于 i 的倍数已经在之前被标记过了
        for (long j = (long) (i) * i; j < n; j += i) {
            notPrimes[(int) j] = true; // 标记为非素数
        }
    }
    return count; // 返回素数的数量
}
```

### 2. 最大公约数

计算两个数 a 和 b 的最大公约数：

```java
int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b); // 递归实现
}
```

最小公倍数可通过最大公约数来求得：

```java
int lcm(int a, int b) {
    return a * b / gcd(a, b); // 使用最小公倍数公式
}
```

### 3. 使用位操作和减法求解最大公约数

对于 a 和 b 的最大公约数 f(a, b)，可以根据以下规则进行计算：

- 如果 a 和 b 均为偶数，f(a, b) = 2 * f(a/2, b/2);
- 如果 a 是偶数而 b 是奇数，f(a, b) = f(a/2, b);
- 如果 b 是偶数而 a 是奇数，f(a, b) = f(a, b/2);
- 如果 a 和 b 均为奇数，f(a, b) = f(b, a - b);

下面是利用位操作进行实现的代码：

```java
public int gcd(int a, int b) {
    if (a < b) {
        return gcd(b, a); // 保证 a >= b
    }
    if (b == 0) {
        return a; // 递归结束条件
    }
    boolean isAEven = (a & 1) == 0; // 判断 a 是否为偶数
    boolean isBEven = (b & 1) == 0; // 判断 b 是否为偶数
    if (isAEven && isBEven) {
        return 2 * gcd(a >> 1, b >> 1); // a 和 b 均为偶数
    } else if (isAEven) {
        return gcd(a >> 1, b); // a 为偶数，b 为奇数
    } else if (isBEven) {
        return gcd(a, b >> 1); // a 为奇数，b 为偶数
    } else {
        return gcd(b, a - b); // a 和 b 均为奇数
    }
}
```

## 进制转换

### 1. 7 进制

**题目 504**: 将数字转换为 7 进制 (Easy)

[Leetcode](https://leetcode.com/problems/base-7/description/) / [力扣](https://leetcode-cn.com/problems/base-7/description/)

实现将整数转换为 7 进制的算法：

```java
public String convertToBase7(int num) {
    if (num == 0) {
        return "0"; // 特殊情况处理
    }
    StringBuilder sb = new StringBuilder();
    boolean isNegative = num < 0; // 判断是否为负数
    if (isNegative) {
        num = -num; // 转换为正数进行处理
    }
    while (num > 0) {
        sb.append(num % 7); // 余数作为下一位
        num /= 7; // 除以 7 继续
    }
    String ret = sb.reverse().toString(); // 反转字符串获得正确顺序
    return isNegative ? "-" + ret : ret; // 处理负号
}
```

简化实现：

```java
public String convertToBase7(int num) {
    return Integer.toString(num, 7); // 使用内置函数转换
}
```

### 2. 16 进制

**题目 405**: 将数字转换为十六进制 (Easy)

[Leetcode](https://leetcode.com/problems/convert-a-number-to-hexadecimal/description/) / [力扣](https://leetcode-cn.com/problems/convert-a-number-to-hexadecimal/description/)

对于负数，使用它的补码进行表示：

```java
public String toHex(int num) {
    char[] map = "0123456789abcdef".toCharArray(); // 十六进制字符映射
    if (num == 0) return "0"; // 特殊情况
    StringBuilder sb = new StringBuilder();
    while (num != 0) {
        sb.append(map[num & 0b1111]); // 取最低的 4 位
        num >>>= 4; // 使用无符号右移处理负数
    }
    return sb.reverse().toString(); // 反转结果
}
```

### 3. 26 进制

**题目 168**: Excel 表列标题转换 (Easy)

[Leetcode](https://leetcode.com/problems/excel-sheet-column-title/description/) / [力扣](https://leetcode-cn.com/problems/excel-sheet-column-title/description/)

将整数转换为 Excel 列标题（1 -> A, 2 -> B,..., 27 -> AA）：

```java
public String convertToTitle(int n) {
    if (n == 0) {
        return ""; // 特殊情况
    }
    n--; // 因为是从 1 开始计数
    return convertToTitle(n / 26) + (char) (n % 26 + 'A'); // 递归构造标题
}
```

## 阶乘

### 1. 统计阶乘尾部有多少个 0

**题目 172**: 统计尾部零的个数 (Easy)

[Leetcode](https://leetcode.com/problems/factorial-trailing-zeroes/description/) / [力扣](https://leetcode-cn.com/problems/factorial-trailing-zeroes/description/)

尾部的 0 由 2 和 5 的乘积产生，而 2 的个数通常多于 5，因此只需统计 5 的个数：

```java
public int trailingZeroes(int n) {
    return n == 0 ? 0 : n / 5 + trailingZeroes(n / 5); // 递归计算
}
```

## 字符串加法减法

### 1. 二进制加法

**题目 67**: 二进制字符串相加 (Easy)

[Leetcode](https://leetcode.com/problems/add-binary/description/) / [力扣](https://leetcode-cn.com/problems/add-binary/description/)

实现二进制字符串的加法：

```java
public String addBinary(String a, String b) {
    int i = a.length() - 1, j = b.length() - 1, carry = 0; // 从字符串末尾向前遍历
    StringBuilder str = new StringBuilder();
    while (carry == 1 || i >= 0 || j >= 0) { // 直到所有位加完
        if (i >= 0 && a.charAt(i--) == '1') {
            carry++; // 处理 a 的当前位
        }
        if (j >= 0 && b.charAt(j--) == '1') {
            carry++; // 处理 b 的当前位
        }
        str.append(carry % 2); // 当前位的结果
        carry /= 2; // 计算进位
    }
    return str.reverse().toString(); // 反转结果返回
}
```

### 2. 字符串加法

**题目 415**: 字符串表示的非负数相加 (Easy)

[Leetcode](https://leetcode.com/problems/add-strings/description/) / [力扣](https://leetcode-cn.com/problems/add-strings/description/)

实现字符串形式的加法运算：

```java
public String addStrings(String num1, String num2) {
    StringBuilder str = new StringBuilder();
    int carry = 0, i = num1.length() - 1, j = num2.length() - 1; // 从字符串末尾向前遍历
    while (carry == 1 || i >= 0 || j >= 0) {
        int x = i < 0 ? 0 : num1.charAt(i--) - '0'; // 当前位的值
        int y = j < 0 ? 0 : num2.charAt(j--) - '0'; // 当前位的值
        str.append((x + y + carry) % 10); // 结果位
        carry = (x + y + carry) / 10; // 计算进位
    }
    return str.reverse().toString(); // 反转结果返回
}
```

## 相遇问题

### 1. 改变数组元素使所有的数组元素都相等

**题目 462**: 使数组元素相等的最小移动次数 (Medium)

[Leetcode](https://leetcode.com/problems/minimum-moves-to-equal-array-elements-ii/description/) / [力扣](https://leetcode-cn.com/problems/minimum-moves-to-equal-array-elements-ii/description/)

给定数组，求使数组所有元素相等的最小操作次数。每次操作可以对数组中的任意元素加一或减一。通过改变元素位置到某个特定值来最小化总移动次数，这个值通常选择中位数。

**解法 1：排序法**

时间复杂度：O(N log N)

```java
public int minMoves2(int[] nums) {
    Arrays.sort(nums); // 将数组排序
    int move = 0;
    int l = 0, h = nums.length - 1; // 指针分别指向数组两端
    while (l <= h) {
        move += nums[h] - nums[l]; // 统计移动次数
        l++; // 移动左侧指针
        h--; // 移动右侧指针
    }
    return move; // 返回总移动次数
}
```

**解法 2：快速选择法**

使用快速选择找到中位数，时间复杂度 O(N)。

```java
public int minMoves2(int[] nums) {
    int move = 0;
    int median = findKthSmallest(nums, nums.length / 2); // 找到中位数
    for (int num : nums) {
        move += Math.abs(num - median); // 计算每个元素到中位数的距离
    }
    return move;
}

private int findKthSmallest(int[] nums, int k) {
    int l = 0, h = nums.length - 1;
    while (l < h) {
        int j = partition(nums, l, h);
        if (j == k) {
            break; // 找到第 k 小的元素
        }
        if (j < k) {
            l = j + 1; // 在右侧找
        } else {
            h = j - 1; // 在左侧找
        }
    }
    return nums[k]; // 返回结果
}

private int partition(int[] nums, int l, int h) {
    int i = l, j = h + 1;
    while (true) {
        while (nums[++i] < nums[l] && i < h) ;
        while (nums[--j] > nums[l] && j > l) ;
        if (i >= j) {
            break; // 找到区间位置
        }
        swap(nums, i, j); // 交换元素
    }
    swap(nums, l, j); // 将枢轴放到中间
    return j; // 返回中间位置
}

private void swap(int[] nums, int i, int j) {
    int tmp = nums[i];
    nums[i] = nums[j];
    nums[j] = tmp; // 交换操作
}
```

## 多数投票问题

### 1. 数组中出现次数多于 n / 2 的元素

**题目 169**: 多数元素 (Easy)

[Leetcode](https://leetcode.com/problems/majority-element/description/) / [力扣](https://leetcode-cn.com/problems/majority-element/description/)

求数组中出现次数超过 n/2 的元素。可以通过排序法或 Boyer-Moore 投票算法来解决。

**排序法**：首先对数组进行排序，返回中间元素：

```java
public int majorityElement(int[] nums) {
    Arrays.sort(nums); // 先排序
    return nums[nums.length / 2]; // 返回中位数
}
```

**Boyer-Moore 投票算法**：时间复杂度 O(N)，使用投票计数的方式：

```java
public int majorityElement(int[] nums) {
    int cnt = 0;
    int majority = nums[0]; // 初始化为第一个元素
    for (int num : nums) {
        majority = (cnt == 0) ? num : majority; // 当计数为 0，更新 majority
        cnt = (majority == num) ? cnt + 1 : cnt - 1; // 计数增加或减少
    }
    return majority; // 返回 majority 元素
}
```

## 其它

### 1. 平方数

**题目 367**: 有效的完全平方数 (Easy)

[Leetcode](https://leetcode.com/problems/valid-perfect-square/description/) / [力扣](https://leetcode-cn.com/problems/valid-perfect-square/description/)

判断给定的数是否为完全平方数。我们可以利用平方数间隔逐渐递增的特性，推导出此问题的解法：

```java
public boolean isPerfectSquare(int num) {
    int subNum = 1; // 初始平方数为 1
    while (num > 0) {
        num -= subNum; // 减去当前平方数
        subNum += 2; // 下一个平方数的间隔递增
    }
    return num == 0; // 如果最后为 0，则是完整平方
}
```

### 2. 3 的 n 次方

**题目 326**: 三的幂 (Easy)

[Leetcode](https://leetcode.com/problems/power-of-three/description/) / [力扣](https://leetcode-cn.com/problems/power-of-three/description/)

检查一个数是否为 3 的幂：

```java
public boolean isPowerOfThree(int n) {
    return n > 0 && (1162261467 % n == 0); // 1162261467 是 3 的 19 次方
}
```

### 3. 乘积数组

**题目 238**: 除自身以外数组的乘积 (Medium)

[Leetcode](https://leetcode.com/problems/product-of-array-except-self/description/) / [力扣](https://leetcode-cn.com/problems/product-of-array-except-self/description/)

给定一个数组，创建一个新数组，并使新数组的每个元素为原始数组中除了该位置上的元素以外其他元素的乘积。

要求时间复杂度为 O(N)，且不能使用除法：

```java
public int[] productExceptSelf(int[] nums) {
    int n = nums.length; 
    int[] products = new int[n];
    Arrays.fill(products, 1); // 初始化为 1
    int left = 1;
    for (int i = 1; i < n; i++) {
        left *= nums[i - 1]; // 从左侧计算乘积
        products[i] *= left; // 累加到结果数组
    }
    int right = 1;
    for (int i = n - 2; i >= 0; i--) {
        right *= nums[i + 1]; // 从右侧计算乘积
        products[i] *= right; // 累加到结果数组
    }
    return products; // 返回结果
}
```

### 4. 找出数组中的乘积最大的三个数

**题目 628**: 三个数的最大乘积 (Easy)

[Leetcode](https://leetcode.com/problems/maximum-product-of-three-numbers/description/) / [力扣](https://leetcode-cn.com/problems/maximum-product-of-three-numbers/description/)

给定一个整数数组，找出乘积最大的三个数的乘积：

```java
public int maximumProduct(int[] nums) {
    int max1 = Integer.MIN_VALUE, max2 = Integer.MIN_VALUE, max3 = Integer.MIN_VALUE; // 最大三个数
    int min1 = Integer.MAX_VALUE, min2 = Integer.MAX_VALUE; // 最小两个数
    for (int n : nums) {
        if (n > max1) {
            max3 = max2;
            max2 = max1;
            max1 = n; // 更新最大数
        } else if (n > max2) {
            max3 = max2;
            max2 = n; // 更新第二大数
        } else if (n > max3) {
            max3 = n; // 更新第三大数
        }

        if (n < min1) {
            min2 = min1;
            min1 = n; // 更新最小数
        } else if (n < min2) {
            min2 = n; // 更新第二小数
        }
    }
    return Math.max(max1 * max2 * max3, max1 * min1 * min2); // 返回最大乘积
}
```

以上是一些 Leetcode 数学题目的解法，涵盖了基本的数学原理以及一些高效的算法实现，帮助你在解决相关问题时提供参考。
```