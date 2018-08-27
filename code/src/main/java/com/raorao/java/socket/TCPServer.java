package com.raorao.java.socket;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.channels.Channel;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-27-22:39
 */
public class TCPServer {

  public static void main(String[] args) throws Exception {
    String clientSentence;
    String capitalizedSentence;

    //服务器Socket用来建立连接
    ServerSocket welcomeSocket = new ServerSocket(6789);

    while (true) {

      //用这个连接来获取和发送，自客户端发的数据流
      Socket connectionSocket = welcomeSocket.accept();

      //获取来自客户端的字节流
      BufferedReader inFromClient = new BufferedReader(
          new InputStreamReader(connectionSocket.getInputStream()));

      //发送更改后的数据流
      DataOutputStream outToClient = new DataOutputStream(connectionSocket.getOutputStream());

      //读取字节成String字符串
      clientSentence = inFromClient.readLine();

      capitalizedSentence = clientSentence.toUpperCase() + '\n';

      outToClient.writeBytes(capitalizedSentence);
    }
  }

}
