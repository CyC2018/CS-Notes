# Leetcode 题解 - 字符串
<!-- GFM-TOC -->
* [Leetcode 题解 - 字符串](#leetcode-题解---字符串)
    * [1. 字符串循环移位包含](#1-字符串循环移位包含)
    * [2. 字符串循环移位](#2-字符串循环移位)
    * [3. 字符串中单词的翻转](#3-字符串中单词的翻转)
    * [4. 两个字符串包含的字符是否完全相同](#4-两个字符串包含的字符是否完全相同)
    * [5. 计算一组字符集合可以组成的回文字符串的最大长度](#5-计算一组字符集合可以组成的回文字符串的最大长度)
    * [6. 字符串同构](#6-字符串同构)
    * [7. 回文子字符串个数](#7-回文子字符串个数)
    * [8. 判断一个整数是否是回文数](#8-判断一个整数是否是回文数)
    * [9. 统计二进制字符串中连续 1 和连续 0 数量相同的子字符串个数](#9-统计二进制字符串中连续-1-和连续-0-数量相同的子字符串个数)
    * [10. 最长回文子串](#10-最长回文子串)
    * [11. 字符串相乘](#11-字符串相乘)
    * [12. 比较版本号](#12-比较版本号)
    * [参考资料](#参考资料)
<!-- GFM-TOC -->


## 1. 字符串循环移位包含

《编程之美》3.1

```text
s1 = AABCD, s2 = CDAA
Return : true
```

给定两个字符串 s1 和 s2，要求判定 s2 是否能够被 s1 做循环移位得到的字符串包含。

s1 进行循环移位的结果是 s1s1 的子字符串，因此只要判断 s2 是否是 s1s1 的子字符串即可。需要注意的是，循环移位不改变长度，还要先判断 s2 不比 s1 长，例如 s2 = ABA 是 s1s1 = ABAB 的子串，却不可能被 AB 的循环移位包含。

## 2. 字符串循环移位

《编程之美》2.17

```text
s = "abcd123" k = 3
Return "123abcd"
```

将字符串向右循环移动 k 位。

将 abcd123 中的 abcd 和 123 单独翻转，得到 dcba321，然后对整个字符串进行翻转，得到 123abcd。

## 3. 字符串中单词的翻转

《程序员代码面试指南》

```text
s = "I am a student"
Return "student a am I"
```

将每个单词翻转，然后将整个字符串翻转。

## 4. 两个字符串包含的字符是否完全相同

242\. Valid Anagram (Easy)

[Leetcode](https://leetcode.com/problems/valid-anagram/description/) / [力扣](https://leetcode.cn/problems/valid-anagram/description/)

```text
s = "anagram", t = "nagaram", return true.
s = "rat", t = "car", return false.
```

可以用 HashMap 来映射字符与出现次数，然后比较两个字符串出现的字符数量是否相同。

由于本题的字符串只包含 26 个小写字符，因此可以使用长度为 26 的整型数组对字符串出现的字符进行统计，不再使用 HashMap。

```java
public boolean isAnagram(String s, String t) {
    int[] cnts = new int[26];
    for (char c : s.toCharArray()) {
        cnts[c - 'a']++;
    }
    for (char c : t.toCharArray()) {
        cnts[c - 'a']--;
    }
    for (int cnt : cnts) {
        if (cnt != 0) {
            return false;
        }
    }
    return true;
}
```

## 5. 计算一组字符集合可以组成的回文字符串的最大长度

409\. Longest Palindrome (Easy)

[Leetcode](https://leetcode.com/problems/longest-palindrome/description/) / [力扣](https://leetcode.cn/problems/longest-palindrome/description/)

```text
Input : "abccccdd"
Output : 7
Explanation : One longest palindrome that can be built is "dccaccd", whose length is 7.
```

使用长度为 256 的整型数组来统计每个字符出现的个数，每个字符有偶数个可以用来构成回文字符串。

因为回文字符串最中间的那个字符可以单独出现，所以如果有单独的字符就把它放到最中间。

```java
public int longestPalindrome(String s) {
    int[] cnts = new int[256];
    for (char c : s.toCharArray()) {
        cnts[c]++;
    }
    int palindrome = 0;
    for (int cnt : cnts) {
        palindrome += (cnt / 2) * 2;
    }
    if (palindrome < s.length()) {
        palindrome++;   // 这个条件下 s 中一定有单个未使用的字符存在，可以把这个字符放到回文的最中间
    }
    return palindrome;
}
```

## 6. 字符串同构

205\. Isomorphic Strings (Easy)

[Leetcode](https://leetcode.com/problems/isomorphic-strings/description/) / [力扣](https://leetcode.cn/problems/isomorphic-strings/description/)

```text
Given "egg", "add", return true.
Given "foo", "bar", return false.
Given "paper", "title", return true.
```

记录一个字符上次出现的位置，如果两个字符串中的字符上次出现的位置一样，那么就属于同构。代码中存的是 i + 1，用数组初值 0 表示“还没出现过”；如果存 i，第一次出现在位置 0 的字符会和没出现过的字符混淆，例如 "ab" 和 "aa" 会被误判为同构。

```java
public boolean isIsomorphic(String s, String t) {
    int[] preIndexOfS = new int[256];
    int[] preIndexOfT = new int[256];
    for (int i = 0; i < s.length(); i++) {
        char sc = s.charAt(i), tc = t.charAt(i);
        if (preIndexOfS[sc] != preIndexOfT[tc]) {
            return false;
        }
        preIndexOfS[sc] = i + 1;
        preIndexOfT[tc] = i + 1;
    }
    return true;
}
```

## 7. 回文子字符串个数

647\. Palindromic Substrings (Medium)

[Leetcode](https://leetcode.com/problems/palindromic-substrings/description/) / [力扣](https://leetcode.cn/problems/palindromic-substrings/description/)

```text
Input: "aaa"
Output: 6
Explanation: Six palindromic strings: "a", "a", "a", "aa", "aa", "aaa".
```

每个回文串都有一个中心：长度为奇数时是一个字符，长度为偶数时是两个相邻字符之间。长度为 N 的字符串共有 2N - 1 个中心，从每个中心向两边扩展，两端字符相等就多得到一个回文子串，不相等就停止。例如 "aaa" 以中间的 a 为中心，依次得到 "a" 和 "aaa"。

```java
private int cnt = 0;

public int countSubstrings(String s) {
    for (int i = 0; i < s.length(); i++) {
        extendSubstrings(s, i, i);     // 奇数长度
        extendSubstrings(s, i, i + 1); // 偶数长度
    }
    return cnt;
}

private void extendSubstrings(String s, int start, int end) {
    while (start >= 0 && end < s.length() && s.charAt(start) == s.charAt(end)) {
        start--;
        end++;
        cnt++;
    }
}
```

## 8. 判断一个整数是否是回文数

9\. Palindrome Number (Easy)

[Leetcode](https://leetcode.com/problems/palindrome-number/description/) / [力扣](https://leetcode.cn/problems/palindrome-number/description/)

进阶要求不将整数转换为字符串进行判断。

将整数分成左右两部分，右边那部分需要转置，然后判断这两部分是否相等。每次把 x 的最后一位移到 right 上，直到 right 不小于 x，这时已经处理了一半的位数。例如 12321 得到 x = 12、right = 123，位数为奇数，比较 x 和 right / 10。末尾为 0 的正数不可能是回文数，需要先排除，否则 10 会得到 x = 0、right = 1，x 等于 right / 10，被误判为回文数。

```java
public boolean isPalindrome(int x) {
    if (x == 0) {
        return true;
    }
    if (x < 0 || x % 10 == 0) {
        return false;
    }
    int right = 0;
    while (x > right) {
        right = right * 10 + x % 10;
        x /= 10;
    }
    return x == right || x == right / 10;
}
```

## 9. 统计二进制字符串中连续 1 和连续 0 数量相同的子字符串个数

696\. Count Binary Substrings (Easy)

[Leetcode](https://leetcode.com/problems/count-binary-substrings/description/) / [力扣](https://leetcode.cn/problems/count-binary-substrings/description/)

```text
Input: "00110011"
Output: 6
Explanation: There are 6 substrings that have equal number of consecutive 1's and 0's: "0011", "01", "1100", "10", "0011", and "01".
```

满足条件的子串一定跨过一个 0 和 1 的交界，左半边全是一种字符，右半边全是另一种。相邻的两组连续字符长度为 preLen 和 curLen 时，交界处能组成 min(preLen, curLen) 个子串，例如 "000" 和 "11" 之间是 "01" 和 "0011"。

代码在遍历时边走边计数：当前这组每多一个字符，只要前一组还有足够的字符与它配对（preLen \>= curLen），就多一个子串。

```java
public int countBinarySubstrings(String s) {
    int preLen = 0, curLen = 1, count = 0;
    for (int i = 1; i < s.length(); i++) {
        if (s.charAt(i) == s.charAt(i - 1)) {
            curLen++;
        } else {
            preLen = curLen;
            curLen = 1;
        }

        if (preLen >= curLen) {
            count++;
        }
    }
    return count;
}
```

## 10. 最长回文子串

5\. Longest Palindromic Substring (Medium)

[Leetcode](https://leetcode.com/problems/longest-palindromic-substring/) / [力扣](https://leetcode.cn/problems/longest-palindromic-substring/)

```text
Input: s = "babad"
Output: "bab"（"aba" 也是正确答案）
```

和[回文子字符串个数](#7-回文子字符串个数)一样从中心扩展：回文串的中心可能是一个字符，也可能是两个字符之间，以每个位置为中心分别向两边扩展，记录最长的回文。时间复杂度为 O(N<sup>2</sup>)，空间复杂度为 O(1)。

```java
private int start = 0, maxLen = 0;

public String longestPalindrome(String s) {
    for (int i = 0; i < s.length(); i++) {
        extend(s, i, i);     // 奇数长度
        extend(s, i, i + 1); // 偶数长度
    }
    return s.substring(start, start + maxLen);
}

private void extend(String s, int l, int r) {
    while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
        l--;
        r++;
    }
    if (r - l - 1 > maxLen) {
        maxLen = r - l - 1;
        start = l + 1;
    }
}
```

## 11. 字符串相乘

43\. Multiply Strings (Medium)

[Leetcode](https://leetcode.com/problems/multiply-strings/) / [力扣](https://leetcode.cn/problems/multiply-strings/)

```text
Input: num1 = "123", num2 = "45"
Output: "5535"
```

题目描述：以字符串形式给出两个非负整数，返回它们的乘积，不能把字符串直接转换为整数。

模拟竖式乘法。乘积最多有 m + n 位，用数组 digits 按从高位到低位的顺序保存。num1[i] 与 num2[j] 相乘的结果落在 digits[i + j + 1] 上，先把所有乘积累加到对应位置，最后从低位到高位统一处理进位。例如 123 × 45 中，个位相乘的 3 × 5 落在 digits[2 + 1 + 1] = digits[4]，也就是乘积的最低位。

```java
public String multiply(String num1, String num2) {
    int m = num1.length(), n = num2.length();
    int[] digits = new int[m + n];
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            digits[i + j + 1] += (num1.charAt(i) - '0') * (num2.charAt(j) - '0');
        }
    }
    for (int k = m + n - 1; k > 0; k--) {
        digits[k - 1] += digits[k] / 10;
        digits[k] %= 10;
    }
    int k = 0;
    while (k < m + n - 1 && digits[k] == 0) {
        k++;
    }
    StringBuilder sb = new StringBuilder();
    for (; k < m + n; k++) {
        sb.append(digits[k]);
    }
    return sb.toString();
}
```

## 12. 比较版本号

165\. Compare Version Numbers (Medium)

[Leetcode](https://leetcode.com/problems/compare-version-numbers/) / [力扣](https://leetcode.cn/problems/compare-version-numbers/)

```text
Input: version1 = "1.01", version2 = "1.001"
Output: 0
Input: version1 = "1.0.1", version2 = "1"
Output: 1
```

题目描述：版本号由 . 分隔的修订号组成，从左到右依次比较修订号的整数值，前导 0 忽略，缺少的修订号视为 0。

用两个指针分别扫描两个字符串，每次各解析出一段修订号的整数值进行比较，不需要先把字符串分割成数组。

```java
public int compareVersion(String version1, String version2) {
    int i = 0, j = 0;
    while (i < version1.length() || j < version2.length()) {
        int x = 0, y = 0;
        while (i < version1.length() && version1.charAt(i) != '.') {
            x = x * 10 + version1.charAt(i++) - '0';
        }
        while (j < version2.length() && version2.charAt(j) != '.') {
            y = y * 10 + version2.charAt(j++) - '0';
        }
        if (x != y) {
            return x > y ? 1 : -1;
        }
        i++;
        j++;
    }
    return 0;
}
```

## 参考资料

- [LeetCode 题库](https://leetcode.com/problemset/)
- 《编程之美》小组. 编程之美 [M]. 电子工业出版社, 2008.
- 左程云. 程序员代码面试指南 [M]. 电子工业出版社, 2015.
