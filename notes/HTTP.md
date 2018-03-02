<!-- GFM-TOC -->
* [基础概念](#基础概念)
    * [Web 基础](#web-基础)
    * [URL](#url)
    * [请求和响应报文](#请求和响应报文)
* [HTTP 方法](#http-方法)
    * [GET：获取资源](#get获取资源)
    * [POST：传输实体主体](#post传输实体主体)
    * [HEAD：获取报文首部](#head获取报文首部)
    * [PUT：上传文件](#put上传文件)
    * [DELETE：删除文件](#delete删除文件)
    * [OPTIONS：查询支持的方法](#options查询支持的方法)
    * [TRACE：追踪路径](#trace追踪路径)
    * [CONNECT：要求用隧道协议连接代理](#connect要求用隧道协议连接代理)
* [HTTP 状态码](#http-状态码)
    * [2XX 成功](#2xx-成功)
    * [3XX 重定向](#3xx-重定向)
    * [4XX 客户端错误](#4xx-客户端错误)
    * [5XX 服务器错误](#5xx-服务器错误)
* [HTTP 首部](#http-首部)
    * [通用首部字段](#通用首部字段)
    * [请求首部字段](#请求首部字段)
    * [响应首部字段](#响应首部字段)
    * [实体首部字段](#实体首部字段)
* [具体应用](#具体应用)
    * [Cookie](#cookie)
    * [缓存](#缓存)
    * [持久连接](#持久连接)
    * [编码](#编码)
    * [分块传输](#分块传输)
    * [多部分对象集合](#多部分对象集合)
    * [范围请求](#范围请求)
    * [内容协商](#内容协商)
    * [虚拟主机](#虚拟主机)
    * [通信数据转发](#通信数据转发)
* [HTTPs](#https)
    * [加密](#加密)
    * [认证](#认证)
    * [完整性](#完整性)
* [HTTP/1.0 与 HTTP/1.1 的区别](#http10-与-http11-的区别)
<!-- GFM-TOC -->


# 基础概念

## Web 基础

- HTTP（HyperText Transfer Protocol，超文本传输协议）。
- WWW（World Wide Web）的三种技术：HTML、HTTP、URL。
- RFC（Request for Comments，征求修正意见书），互联网的设计文档。

## URL

- URI（Uniform Resource Indentifier，统一资源标识符）
- URL（Uniform Resource Locator，统一资源定位符）
- URN（Uniform Resource Name，统一资源名称），例如 urn:isbn:0-486-27557-4 。

URI 包含 URL 和 URN，目前 WEB 只有 URL 比较流行，所以见到的基本都是 URL。

![](https://github.com/CyC2018/InterviewNotes/blob/master/pics//4102b7d0-39b9-48d8-82ae-ac4addb7ebfb.jpg)

## 请求和响应报文

**请求报文**

![](https://github.com/CyC2018/InterviewNotes/blob/master/pics//22b39f77-ac47-4978-91ed-84aaf457644c.jpg)

**响应报文**

![](https://github.com/CyC2018/InterviewNotes/blob/master/pics//00d8d345-cd4a-48af-919e-209d2788eca7.jpg)

# HTTP 方法

客户端发送的请求报文第一行为请求行，包含了方法字段。

## GET：获取资源

## POST：传输实体主体

POST 主要目的不是获取资源，而是传输实体主体数据。

GET 和 POST 的请求都能使用额外的参数，但是 GET 的参数是以查询字符串出现在 URL中，而 POST 的参数存储在实体主体部分。

```
GET /test/demo_form.asp?name1=value1&name2=value2 HTTP/1.1
```
```
POST /test/demo_form.asp HTTP/1.1
Host: w3schools.com
name1=value1&name2=value2
```

GET 的传参方式相比于 POST 安全性较差，因为 GET 传的参数在 URL 是可见的，可能会泄露私密信息。并且 GET 只支持 ASCII 字符，如果参数为中文则可能会出现乱码，而 POST 支持标准字符集。

## HEAD：获取报文首部

和 GET 方法一样，但是不返回报文实体主体部分。

主要用于确认 URL 的有效性以及资源更新的日期时间等。

## PUT：上传文件

由于自身不带验证机制，任何人都可以上传文件，因此存在安全性问题，一般 WEB 网站不使用该方法。

## DELETE：删除文件

与 PUT 功能相反，并且同样不带验证机制。

## OPTIONS：查询支持的方法

查询指定的 URL 能够支持的方法。

会返回 Allow: GET, POST, HEAD, OPTIONS 这样的内容。

## TRACE：追踪路径

服务器会将通信路径返回给客户端。

发送请求时，在 Max-Forwards 首部字段中填入数值，每经过一个服务器就会减 1，当数值为 0 时就停止传输。

TRACE 一般不会使用，并且它容易受到 XST 攻击（Cross-Site Tracing，跨站追踪），因此更不会去使用它。

![](https://github.com/CyC2018/InterviewNotes/blob/master/pics//c8637fd2-3aaa-46c4-b7d9-f24d3fa04781.jpg)

## CONNECT：要求用隧道协议连接代理

主要使用 SSL（Secure Sokets Layer，安全套接字）和 TLS（Transport Layer Security，传输层安全）协议把通信内容加密后经网络隧道传输。

![](https://github.com/CyC2018/InterviewNotes/blob/master/pics//5994928c-3d2d-45bd-abb1-adc4f5f4d775.jpg)

# HTTP 状态码

服务器返回的响应报文中第一行为状态行，包含了状态码以及原因短语，来告知客户端请求的结果。

| 状态码 | 类别 | 原因短语 |
| --- | --- | --- |
| 1XX | Informational（信息性状态码） | 接收的请求正在处理 |
| 2XX | Success（成功状态码） | 请求正常处理完毕 |
| 3XX | Redirection（重定向状态码） | 需要进行附加操作以完成请求 |
| 4XX | Client Error（客户端错误状态码） | 服务器无法处理请求 |
| 5XX | Server Error（服务器错误状态码） | 服务器处理请求出错 |

## 2XX 成功

- **200 OK**

- **204 No Content**：请求已经成功处理，但是返回的响应报文不包含实体的主体部分。一般在只需要从客户端往服务器发送信息，而不需要返回数据时使用。

- **206 Partial Content**

## 3XX 重定向

- **301 Moved Permanently**：永久性重定向

- **302 Found**：临时性重定向

- **303 See Other**

- 注：虽然 HTTP 协议规定 301、302 状态下重定向时不允许把 POST 方法改成 GET 方法，但是大多数浏览器都会 在 301、302 和 303 状态下的重定向把 POST 方法改成 GET 方法。

- **304 Not Modified**：如果请求报文首部包含一些条件，例如：If-Match，If-ModifiedSince，If-None-Match，If-Range，If-Unmodified-Since，但是不满足条件，则服务器会返回 304 状态码。

- **307 Temporary Redirect**：临时重定向，与 302 的含义类似，但是 307 要求浏览器不会把重定向请求的 POST 方法改成 GET 方法。

## 4XX 客户端错误

- **400 Bad Request**：请求报文中存在语法错误

- **401 Unauthorized**：该状态码表示发送的请求需要有通过 HTTP 认证（BASIC 认证、DIGEST 认证）的认证信息。如果之前已进行过一次请求，则表示用户认证失败。

![](https://github.com/CyC2018/InterviewNotes/blob/master/pics//b1b4cf7d-c54a-4ff1-9741-cd2eea331123.jpg)

- **403 Forbidden**：请求被拒绝，服务器端没有必要给出拒绝的详细理由。

- **404 Not Found**

## 5XX 服务器错误

- **500 Internal Server Error**：服务器正在执行请求时发生错误

- **503 Service Unavilable**：该状态码表明服务器暂时处于超负载或正在进行停机维护，现在无法处理请求。

# HTTP 首部

有 4 种类型的首部字段：通用首部字段、请求首部字段、响应首部字段和实体首部字段。

各种首部字段及其含义如下（不需要全记，仅供查阅）：

## 通用首部字段

| 首部字段名 | 说明 |
| -- | -- |
| Cache-Control | 控制缓存的行为 |
| Connection | 逐跳首部、 连接的管理 |
| Date | 创建报文的日期时间 |
| Pragma | 报文指令 |
| Trailer | 报文末端的首部一览 |
| Transfer-Encoding | 指定报文主体的传输编码方式 |
| Upgrade | 升级为其他协议 |
| Via | 代理服务器的相关信息 |
| Warning | 错误通知 |

## 请求首部字段

| 首部字段名 | 说明 |
| -- | -- |
| Accept | 用户代理可处理的媒体类型 |
| Accept-Charset | 优先的字符集 |
| Accept-Encoding | 优先的内容编码 |
| Accept-Language | 优先的语言（自然语言） |
| Authorization | Web认证信息 |
| Expect | 期待服务器的特定行为 |
| From | 用户的电子邮箱地址 |
| Host | 请求资源所在服务器 |
| If-Match | 比较实体标记（ETag） |
| If-Modified-Since | 比较资源的更新时间 |
| If-None-Match | 比较实体标记（与 If-Match 相反） |
| If-Range | 资源未更新时发送实体 Byte 的范围请求 |
| If-Unmodified-Since | 比较资源的更新时间（与If-Modified-Since相反） |
| Max-Forwards | 最大传输逐跳数 |
| Proxy-Authorization | 代理服务器要求客户端的认证信息 |
| Range | 实体的字节范围请求 |
| Referer | 对请求中 URI 的原始获取方 |
| TE | 传输编码的优先级 |
| User-Agent | HTTP 客户端程序的信息 |

## 响应首部字段

| 首部字段名 | 说明 |
| -- | -- |
| Accept-Ranges | 是否接受字节范围请求 |
| Age | 推算资源创建经过时间 |
| ETag | 资源的匹配信息 |
| Location | 令客户端重定向至指定URI |
| Proxy-Authenticate | 代理服务器对客户端的认证信息 |
| Retry-After | 对再次发起请求的时机要求 |
| Server | HTTP服务器的安装信息 |
| Vary | 代理服务器缓存的管理信息 |
| WWW-Authenticate | 服务器对客户端的认证信息 |

## 实体首部字段

| 首部字段名 | 说明 |
| -- | -- |
| Allow | 资源可支持的HTTP方法 |
| Content-Encoding | 实体主体适用的编码方式 |
| Content-Language | 实体主体的自然语言 |
| Content-Length | 实体主体的大小（单位： 字节） |
| Content-Location | 替代对应资源的URI |
| Content-MD5 | 实体主体的报文摘要 |
| Content-Range | 实体主体的位置范围 |
| Content-Type | 实体主体的媒体类型 |
| Expires | 实体主体过期的日期时间 |
| Last-Modified | 资源的最后修改日期时间 |

# 具体应用

## Cookie

HTTP 协议是无状态的，主要是为了让 HTTP 协议尽可能简单，使得它能够处理大量事务。HTTP/1.1 引入 Cookie 来保存状态信息。

服务器发送的响应报文包含 Set-Cookie 字段，客户端得到响应报文后把 Cookie 内容保存到浏览器中。下次再发送请求时，从浏览器中读出 Cookie 值，在请求报文中包含 Cookie 字段，这样服务器就知道客户端的状态信息了。Cookie 状态信息保存在客户端浏览器中，而不是服务器上。

![](https://github.com/CyC2018/InterviewNotes/blob/master/pics//ff17c103-750a-4bb8-9afa-576327023af9.png)

Set-Cookie 字段有以下属性：

| 属性 | 说明 |
| -- | -- |
| NAME=VALUE | 赋予 Cookie 的名称和其值（必需项） |
| expires=DATE | Cookie 的有效期（若不明确指定则默认为浏览器关闭前为止） |
| path=PATH | 将服务器上的文件目录作为 Cookie 的适用对象（若不指定则默认为文档所在的文件目录） |
| domain=域名 | 作为 Cookie 适用对象的域名（若不指定则默认为创建 Cookie 的服务器的域名） |
| Secure | 仅在 HTTPS 安全通信时才会发送 Cookie |
| HttpOnly | 加以限制，使 Cookie 不能被 JavaScript 脚本访问 |

**Session 和 Cookie 区别**

Session 是服务器用来跟踪用户的一种手段，每个 Session 都有一个唯一标识：Session ID。当服务器创建了一个 Session 时，给客户端发送的响应报文就包含了 Set-Cookie 字段，其中有一个名为 sid 的键值对，这个键值对就是 Session ID。客户端收到后就把 Cookie 保存在浏览器中，并且之后发送的请求报文都包含 Session ID。HTTP 就是通过 Session 和 Cookie 这两种方式一起合作来实现跟踪用户状态的，Session 用于服务器端，Cookie 用于客户端。

**浏览器禁用 Cookie 的情况**

会使用 URL 重写技术，在 URL 后面加上 sid=xxx 。

**使用 Cookie 实现用户名和密码的自动填写**

网站脚本会自动从 Cookie 中读取用户名和密码，从而实现自动填写。

## 缓存

有两种缓存方法：让代理服务器进行缓存和让客户端浏览器进行缓存。

Cache-Control 用于控制缓存的行为。Cache-Control: no-cache 有两种含义，如果是客户端向缓存服务器发送的请求报文中含有该指令，表示客户端不想要缓存的资源；如果是源服务器向缓存服务器发送的响应报文中含有该指令，表示缓存服务器不能对资源进行缓存。

Expires 字段可以用于告知缓存服务器该资源什么时候会过期。当首部字段 Cache-Control 有指定 max-age 指令时，比起首部字段 Expires，会优先处理 max-age 指令。

## 持久连接

当浏览器访问一个包含多张图片的 HTML 页面时，除了请求访问 HTML 页面资源，还会请求图片资源，如果每进行一次 HTTP 通信就要断开一次 TCP 连接，连接建立和断开的开销会很大。**持久连接** 只需要进行一次 TCP 连接就能进行多次 HTTP 通信。HTTP/1.1 开始，所有的连接默认都是持久连接。

![](https://github.com/CyC2018/InterviewNotes/blob/master/pics//c73a0b78-5f46-4d2d-a009-dab2a999b5d8.jpg)

持久连接需要使用 Connection 首部字段进行管理。HTTP/1.1 开始 HTTP 默认是持久化连接的，如果要断开 TCP 连接，需要由客户端或者服务器端提出断开，使用 Connection: close；而在 HTTP/1.1 之前默认是非持久化连接的，如果要维持持续连接，需要使用 Keep-Alive。

管线化方式可以同时发送多个请求和响应，而不需要发送一个请求然后等待响应之后再发下一个请求。

![](https://github.com/CyC2018/InterviewNotes/blob/master/pics//6943e2af-5a70-4004-8bee-b33d60f39da3.jpg)

## 编码

编码（Encoding）主要是为了对实体进行压缩。常用的编码有：gzip、compress、deflate、identity，其中 identity 表示不执行压缩的编码格式。

## 分块传输

分块传输（Chunked Transfer Coding）可以把数据分割成多块，让浏览器逐步显示页面。

## 多部分对象集合

一份报文主体内可含有多种类型的实体同时发送，每个部分之间用 boundary 字段定义的分隔符进行分隔；每个部分都可以有首部字段。

例如，上传多个表单时可以使用如下方式：

![](https://github.com/CyC2018/InterviewNotes/blob/master/pics//2279cc60-9714-4e0e-aac9-4c348e0c2165.png)

## 范围请求

如果网络出现中断，服务器只发送了一部分数据，范围请求使得客户端能够只请求未发送的那部分数据，从而避免服务器端重新发送所有数据。

在请求报文首部中添加 Range 字段，然后指定请求的范围，例如 Range:bytes=5001-10000。请求成功的话服务器发送 206 Partial Content 状态。

## 内容协商

通过内容协商返回最合适的内容，例如根据浏览器的默认语言选择返回中文界面还是英文界面。

涉及以下首部字段：Accept、Accept-Charset、Accept-Encoding、Accept-Language、Content-Language。

## 虚拟主机

使用虚拟主机技术，使得一台服务器拥有多个域名，并且在逻辑上可以看成多个服务器。

## 通信数据转发

**代理**

代理服务器接受客户端的请求，并且转发给其它服务器。

代理服务器一般是透明的，不会改变 URL。

使用代理的主要目的是：缓存、网络访问控制以及访问日志记录。

![](https://github.com/CyC2018/InterviewNotes/blob/master/pics//c07035c3-a9ba-4508-8e3c-d8ae4c6ee9ee.jpg)

**网关**

与代理服务器不同的是，网关服务器会将 HTTP 转化为其它协议进行通信，从而请求其它非 HTTP 服务器的服务。

![](https://github.com/CyC2018/InterviewNotes/blob/master/pics//81375888-6be1-476f-9521-42eea3e3154f.jpg)

**隧道**

使用 SSL 等加密手段，为客户端和服务器之间建立一条安全的通信线路。

![](https://github.com/CyC2018/InterviewNotes/blob/master/pics//64b95403-d976-421a-8b45-bac89c0b5185.jpg)

# HTTPs

HTTP 有以下安全性问题：

1. 使用明文进行通信，内容可能会被窃听；
2. 不验证通信方的身份，通信方的身份有可能遭遇伪装；
3. 无法证明报文的完整性，报文有可能遭篡改。

HTTPs 并不是新协议，而是 HTTP 先和 SSL（Secure Socket Layer）通信，再由 SSL 和 TCP 通信。通过使用 SSL，HTTPs 提供了加密、认证和完整性保护。

## 加密

有两种加密方式：对称密钥加密和公开密钥加密。对称密钥加密的加密和解密使用同一密钥，而公开密钥加密使用一对密钥用于加密和解密，分别为公开密钥和私有密钥。公开密钥所有人都可以获得，通信发送方获得接收方的公开密钥之后，就可以使用公开密钥进行加密，接收方收到通信内容后使用私有密钥解密。

对称密钥加密的缺点：无法安全传输密钥；公开密钥加密的缺点：相对来说更耗时。

HTTPs 采用 **混合的加密机制**，使用公开密钥加密用于传输对称密钥，之后使用对称密钥加密进行通信。（下图中，共享密钥即对称密钥）

![](https://github.com/CyC2018/InterviewNotes/blob/master/pics//110b1a9b-87cd-45c3-a21d-824623715b33.jpg)

## 认证

通过使用 **证书** 来对通信方进行认证。证书中有公开密钥数据，如果可以验证公开密钥的确属于通信方的，那么就可以确定通信方是可靠的。

数字证书认证机构（CA，Certificate Authority）可以对其颁发的公开密钥证书对其进行验证。

进行 HTTPs 通信时，服务器会把证书发送给客户端，客户端取得其中的公开密钥之后，就可以开始通信。

使用 OpenSSL 这套开源程序，每个人都可以构建一套属于自己的认证机构，从而自己给自己颁发服务器证书。浏览器在访问该服务器时，会显示“无法确认连接安全性”或“该网站的安全证书存在问题”等警告消息。

客户端证书需要用户自行安装，只有在业务需要非常高的安全性时才使用客户端证书，例如网上银行。

## 完整性

SSL 提供摘要功能来验证完整性。

# HTTP/1.0 与 HTTP/1.1 的区别

HTTP/1.1 新增了以下内容：

- 默认为长连接；
- 提供了范围请求功能；
- 提供了虚拟主机的功能；
- 多了一些缓存处理字段；
- 多了一些状态码；
