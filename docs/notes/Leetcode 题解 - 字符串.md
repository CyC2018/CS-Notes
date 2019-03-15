<!-- GFM-TOC -->
* [字符串循环移位包含](#字符串循环移位包含)
* [字符串循环移位](#字符串循环移位)
* [字符串中单词的翻转](#字符串中单词的翻转)
* [两个字符串包含的字符是否完全相同](#两个字符串包含的字符是否完全相同)
* [计算一组字符集合可以组成的回文字符串的最大长度](#计算一组字符集合可以组成的回文字符串的最大长度)
* [字符串同构](#字符串同构)
* [回文子字符串个数](#回文子字符串个数)
* [判断一个整数是否是回文数](#判断一个整数是否是回文数)
* [统计二进制字符串中连续 1 和连续 0 数量相同的子字符串个数](#统计二进制字符串中连续-1-和连续-0-数量相同的子字符串个数)
<!-- GFM-TOC -->


# 字符串循环移位包含

[编程之美 3.1](#)

```html
s1 = AABCD, s2 = CDAA
Return : true
```

给定两个字符串 s1 和 s2，要求判定 s2 是否能够被 s1 做循环移位得到的字符串包含。

s1 进行循环移位的结果是 s1s1 的子字符串，因此只要判断 s2 是否是 s1s1 的子字符串即可。

# 字符串循环移位

[编程之美 2.17](#)

```html
s = "abcd123" k = 3
Return "123abcd"
```

将字符串向右循环移动 k 位。

将 abcd123 中的 abcd 和 123 单独翻转，得到 dcba321，然后对整个字符串进行翻转，得到 123abcd。

# 字符串中单词的翻转

[程序员代码面试指南](#)

```html
s = "I am a student"
Return "student a am I"
```

将每个单词翻转，然后将整个字符串翻转。

# 两个字符串包含的字符是否完全相同

[242. Valid Anagram (Easy)](https://leetcode.com/problems/valid-anagram/description/)

```html
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

# 计算一组字符集合可以组成的回文字符串的最大长度

[409. Longest Palindrome (Easy)](https://leetcode.com/problems/longest-palindrome/description/)

```html
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

# 字符串同构

[205. Isomorphic Strings (Easy)](https://leetcode.com/problems/isomorphic-strings/description/)

```html
Given "egg", "add", return true.
Given "foo", "bar", return false.
Given "paper", "title", return true.
```

记录一个字符上次出现的位置，如果两个字符串中的字符上次出现的位置一样，那么就属于同构。

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

# 回文子字符串个数

[647. Palindromic Substrings (Medium)](https://leetcode.com/problems/palindromic-substrings/description/)

```html
Input: "aaa"
Output: 6
Explanation: Six palindromic strings: "a", "a", "a", "aa", "aa", "aaa".
```

从字符串的某一位开始，尝试着去扩展子字符串。

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

# 判断一个整数是否是回文数

[9. Palindrome Number (Easy)](https://leetcode.com/problems/palindrome-number/description/)

要求不能使用额外空间，也就不能将整数转换为字符串进行判断。

将整数分成左右两部分，右边那部分需要转置，然后判断这两部分是否相等。

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

# 统计二进制字符串中连续 1 和连续 0 数量相同的子字符串个数

[696. Count Binary Substrings (Easy)](https://leetcode.com/problems/count-binary-substrings/description/)

```html
Input: "00110011"
Output: 6
Explanation: There are 6 substrings that have equal number of consecutive 1's and 0's: "0011", "01", "1100", "10", "0011", and "01".
```

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




</br><div align="center">欢迎关注公众号，获取最新文章！</div></br></br>
<div align="center"><img width="180px" src="https://cyc-1256109796.cos.ap-guangzhou.myqcloud.com/%E5%85%AC%E4%BC%97%E5%8F%B7.jpg"></img></div>
