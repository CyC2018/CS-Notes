package com.raorao.interview.pdd.t4;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.PriorityQueue;
import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-30-20:03
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int N = scanner.nextInt();
    int L = scanner.nextInt();
    String[] words = new String[N];
    char[][] chars = new char[N][];
    for (int i = 0; i < N; i++) {
      words[i] = scanner.next();
      chars[i] = words[i].toCharArray();
    }
    List<String> wordList = Arrays.asList(words);
    List<PriorityQueue<Character>> cols = new ArrayList<>();
    for (int i = 0; i < L; i++) {
      PriorityQueue<Character> queue = new PriorityQueue<>();
      for (int j = 0; j < N; j++) {
        queue.add(chars[j][i]);
      }
      cols.add(queue);
    }
    String res = process(wordList, cols, L);
    System.out.println(res);
  }

  private static String process(List<String> words, List<PriorityQueue<Character>> cols,
      int length) {
    StringBuilder sb = new StringBuilder();
    back(sb, words, cols, 0, length);
    return sb.toString();
  }

  private static void back(StringBuilder sb, List<String> words,
      List<PriorityQueue<Character>> cols,
      int k, int length) {
    if (k == length) {
      if (words.contains(sb.toString())) {
        sb.deleteCharAt(sb.length() - 1);
      } else {
        return;
      }
    }
    sb.append((char) cols.get(k).poll());
    back(sb, words, cols, k + 1, length);

  }
}
