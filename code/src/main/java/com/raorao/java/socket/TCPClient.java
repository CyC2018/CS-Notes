package com.raorao.java.socket;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.Socket;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-27-22:40
 */
public class TCPClient {

  public static void main(String[] args) throws Exception {
    //创建两个String类型的字符串用来发送和接受
    String sentence;
    String modifiedSentence;

    //创建输入流，用来接受键盘输入
    BufferedReader inFromUser = new BufferedReader(new InputStreamReader(System.in));

    //创建一个Socket类型的 clientSocket 用来发起服务器和客户机之间的连接
    Socket clientSocket = new Socket("127.0.0.1", 6789);

    //创建向服务器发送信息的输出流
    DataOutputStream outToServer = new DataOutputStream(clientSocket.getOutputStream());

    //创建输入流，用来接收来自服务器的字节流
    BufferedReader inFormServer = new BufferedReader(
        new InputStreamReader(clientSocket.getInputStream()));

    //读流数据
    sentence = inFromUser.readLine();

    //向服务器发送sentence的字节数据
    outToServer.writeBytes(sentence + '\n');

    //获取字节流数据为String
    modifiedSentence = inFormServer.readLine();

    System.out.println("Form Server :" + modifiedSentence);
  }
}
