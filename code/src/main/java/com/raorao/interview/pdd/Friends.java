package com.raorao.interview.pdd;

import java.util.ArrayList;
import java.util.Scanner;

/**
 * 题目描述： .
 *
 * @author Xiong Raorao
 * @since 2018-08-05-20:03
 */
public class Friends {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    while (scanner.hasNextLine()) {
      String[] input = scanner.nextLine().split(" ");
      int userNum = Integer.parseInt(input[0]);
      int targetUser = Integer.parseInt(input[1]);
      int[][] relation = new int[userNum][userNum];
      for (int i = 0; i < userNum && scanner.hasNextLine(); i++) {
        String ss = scanner.nextLine();
        String[] users = ss.split(" ");
        for (String s : users) {
          int user = Integer.parseInt(s);
          relation[i][user] = 1;
          relation[i][i] = 1;
        }
        //System.out.println(" line " + i );
      }
      //System.out.println(" out: ");
      System.out.println(process(relation, targetUser, userNum));
    }

  }

  private static int process(int[][] relation, int targetUser, int userNum) {
    // 判断最可能的好友
    ArrayList<Integer> stranger = new ArrayList<>();
    for (int i = 0; i < userNum; i++) {
      if (relation[targetUser][i] != 1) {
        stranger.add(i);
      }
    }

    if (userNum == 1) {
      return -1;
    }

    // 判断哪个陌生人和自己的共同好友多
    if (stranger.size() == 1) {
      return stranger.get(0);
    }
    int resultUser = 0;
    int maxFriends = getSameFriend(relation, stranger.get(0), targetUser, userNum);
    for (int i = 1; i < stranger.size(); i++) {
      int temp = getSameFriend(relation, stranger.get(i), targetUser, userNum);
      if (temp > maxFriends) {
        maxFriends = temp;
        resultUser = stranger.get(i);
      }
    }
    return resultUser;
  }

  private static int getSameFriend(int[][] relation, int user1, int user2, int userNum) {
    int count = 0;
    for (int i = 0; i < userNum; i++) {
      if (relation[user1][i] == 1 && relation[user2][i] == 1) {
        count++;
      }
    }
    return count;
  }
}
