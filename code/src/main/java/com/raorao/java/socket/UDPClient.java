package com.raorao.java.socket;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-27-22:29
 */
public class UDPClient {

  public static void main(String[] args) throws Exception {
    //读取键盘输入的字节流
    BufferedReader inFromUser = new BufferedReader(new InputStreamReader(System.in));

    //为客户机创建了一个传输信息的门，但是并没与向TCP那样建立连接
    DatagramSocket clientSocket = new DatagramSocket();

    //这行代码调用了DNS查询，查询主机名对应的IP地址，后面要用这个地址来向服务器发送信息
    InetAddress IPAddress = InetAddress.getByName("localhost");

    //需要发送的字节数组
    byte[] sendData;

    //接受的字节数组
    byte[] receiveData = new byte[1024];

    String sentence = inFromUser.readLine();

    //将字符串转为字节放入sendData
    sendData = sentence.getBytes();

    //UDP数据报分组，里面包含想要发送的内容以及目的地址等信息
    DatagramPacket sendPacket = new DatagramPacket(sendData, sendData.length, IPAddress, 9876);

    //用这个‘门’来发送这个数据包
    clientSocket.send(sendPacket);

    //获取数据报分组
    DatagramPacket receivePacket = new DatagramPacket(receiveData, receiveData.length);

    //用‘门’获取数据报
    clientSocket.receive(receivePacket);

    //将获取的数据报转为String类型数据
    String modifiedSentence = new String(receivePacket.getData());

    System.out.println("From Server:" + modifiedSentence);

    //关闭这个门
    clientSocket.close();

  }

}
