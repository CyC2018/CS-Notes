```markdown
# HTTP
<!-- GFM-TOC -->
* [HTTP](#http)
    * [一 、基础概念](#一-基础概念)
        * [请求和响应报文](#请求和响应报文)
        * [URL](#url)
    * [二、HTTP 方法](#二http-方法)
        * [GET](#get)
        * [HEAD](#head)
        * [POST](#post)
        * [PUT](#put)
        * [PATCH](#patch)
        * [DELETE](#delete)
        * [OPTIONS](#options)
        * [CONNECT](#connect)
        * [TRACE](#trace)
    * [三、HTTP 状态码](#三http-状态码)
        * [1XX 信息](#1xx-信息)
        * [2XX 成功](#2xx-成功)
        * [3XX 重定向](#3xx-重定向)
        * [4XX 客户端错误](#4xx-客户端错误)
        * [5XX 服务器错误](#5xx-服务器错误)
    * [四、HTTP 首部](#四http-首部)
        * [通用首部字段](#通用首部字段)
        * [请求首部字段](#请求首部字段)
        * [响应首部字段](#响应首部字段)
        * [实体首部字段](#实体首部字段)
    * [五、具体应用](#五具体应用)
        * [连接管理](#连接管理)
        * [Cookie](#cookie)
        * [缓存](#缓存)
        * [内容协商](#内容协商)
        * [内容编码](#内容编码)
        * [范围请求](#范围请求)
        * [分块传输编码](#分块传输编码)
        * [多部分对象集合](#多部分对象集合)
        * [虚拟主机](#虚拟主机)
        * [通信数据转发](#通信数据转发)
    * [六、HTTPS](#六https)
        * [加密](#加密)
        * [认证](#认证)
        * [完整性保护](#完整性保护)
        * [HTTPS 的缺点](#https-的缺点)
    * [七、HTTP/2.0](#七http20)
        * [HTTP/1.x 缺陷](#http1x-缺陷)
        * [二进制分帧层](#二进制分帧层)
        * [服务端推送](#服务端推送)
        * [首部压缩](#首部压缩)
    * [八、HTTP/1.1 新特性](#八http11-新特性)
    * [九、GET 和 POST 比较](#九get-和-post-比较)
        * [作用](#作用)
        * [参数](#参数)
        * [安全](#安全)
        * [幂等性](#幂等性)
        * [可缓存](#可缓存)
        * [XMLHttpRequest](#xmlhttprequest)
    * [参考资料](#参考资料)
<!-- GFM-TOC -->


## 一 、基础概念

### 请求和响应报文

在 HTTP 通信中，客户端向服务器发送请求报文，服务器根据请求报文中的信息进行处理，并将处理结果通过响应报文返回给客户端。

#### 请求报文结构：

1. 第一行包含请求方法、URL 和协议版本。
2. 接下来的多行是请求首部字段，每个字段由名称和值组成。
3. 一个空行用来分隔首部字段和消息主体（Body）。
4. 最后是请求的内容主体（可选）。

```http
GET http://www.example.com/ HTTP/1.1
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Cache-Control: max-age=0
Host: www.example.com
If-Modified-Since: Thu, 17 Oct 2019 07:18:26 GMT
If-None-Match: "3147526947+gzip"
Proxy-Connection: keep-alive
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 xxx

param1=1&param2=2
```

#### 响应报文结构：

1. 第一行包含协议版本、状态码及其描述，最常见的是 `200 OK` 表示请求成功。
2. 接下来的多行是响应首部字段。
3. 一个空行分隔首部和内容主体。
4. 最后是响应的内容主体。

```http
HTTP/1.1 200 OK
Age: 529651
Cache-Control: max-age=604800
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 648
Content-Type: text/html; charset=UTF-8
Date: Mon, 02 Nov 2020 17:53:39 GMT
Etag: "3147526947+ident+gzip"
Expires: Mon, 09 Nov 2020 17:53:39 GMT
Keep-Alive: timeout=4
Last-Modified: Thu, 17 Oct 2019 07:18:26 GMT
Proxy-Connection: keep-alive
Server: ECS (sjc/16DF)
Vary: Accept-Encoding
X-Cache: HIT

<!doctype html>
<html>
<head>
    <title>Example Domain</title>
	<!-- 省略 ... --> 
</body>
</html>
```

### URL

HTTP 使用 URL（**U**niform **R**esource **L**ocator，统一资源定位符）来定位资源，URL 是 URI（**U**niform **R**esource **I**dentifier，统一资源标识符）的子集。URL 基于 URI 提供了定位能力。URI 除了包含 URL，还包含 URN（Uniform Resource Name，统一资源名称），URN 仅用于定义资源的名称，并不具备定位该资源的能力。例如 `urn:isbn:0451450523` 定义了一本书名，但并不能说明如何找到这本书。

<div align="center"> <img src="https://cs-notes-1256109796.cos.ap-guangzhou.myqcloud.com/8441b2c4-dca7-4d6b-8efb-f22efccaf331.png" width="500px"> </div><br>

- [维基百科：统一资源标志符](https://zh.wikipedia.org/wiki/统一资源标志符)
- [维基百科：URL](https://en.wikipedia.org/wiki/URL)
- [RFC 2616：3.2.2 HTTP URL](https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.2.2)
- [关于 URI, URL 和 URN 的区别](https://stackoverflow.com/questions/176264/what-is-the-difference-between-a-uri-a-url-and-a-urn)

## 二、HTTP 方法

客户端发送的请求报文中，第一行为请求行，包含请求方法。

### GET

> 用于获取资源

在各种网络请求中，GET 方法是最常用的。

### HEAD

> 获取报文首部

HEAD 方法类似于 GET 方法，但不返回报文的主体部分。通常用来验证 URL 的有效性或获取资源的更新时间。

### POST

> 传输实体主体

POST 方法通常用于传输数据，而 GET 方法主要用于获取资源。详见第九章关于 POST 与 GET 的比较。

### PUT

> 上传文件

PUT 方法可以上传文件，但因不具备身份验证机制，安全性较差，因此不建议广泛使用。

```http
PUT /new.html HTTP/1.1
Host: example.com
Content-type: text/html
Content-length: 16

<p>New File</p>
```

### PATCH

> 对资源进行部分修改

PATCH 方法用于部分更新资源，而 PUT 方法则是完全替代原始资源。

```http
PATCH /file.txt HTTP/1.1
Host: www.example.com
Content-Type: application/example
If-Match: "e0023aa4e"
Content-Length: 100

[description of changes]
```

### DELETE

> 删除资源

与 PUT 方法相对，DELETE 方法用于删除资源，同样不带验证机制。

```http
DELETE /file.html HTTP/1.1
```

### OPTIONS

> 查询支持的方法

OPTIONS 方法查询指定 URL 能够支持哪些请求方法。响应中会返回 `Allow: GET, POST, HEAD, OPTIONS` 等信息。

### CONNECT

> 在与代理服务器通信时建立隧道

CONNECT 方法用于建立 SSL（安全套接层）和 TLS（传输层安全）协议的加密隧道。

```http
CONNECT www.example.com:443 HTTP/1.1
```

<div align="center"> <img src="https://cs-notes-1256109796.cos.ap-guangzhou.myqcloud.com/dc00f70e-c5c8-4d20-baf1-2d70014a97e3.jpg" width=""/> </div><br>

### TRACE

> 追踪请求路径

TRACE 方法用于追踪请求路径，服务器会将完整的请求路径返回给客户端。发送请求时，可以在 `Max-Forwards` 首部字段指定跳转的最大次数。

TRACE 方法通常不会被广泛使用，且容易受到 XST（跨站追踪）攻击。

- [RFC 2616：9 方法定义](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html)

## 三、HTTP 状态码

服务器返回的响应报文中，第一行为状态行，包含状态码及其描述，用于告知客户端请求的结果。

| 状态码 | 类别 | 含义 |
| :---: | :---: | :---: |
| 1XX | Informational（信息性状态码） | 表示接收的请求正在处理 |
| 2XX | Success（成功状态码） | 表示请求已正常处理 |
| 3XX | Redirection（重定向状态码） | 表示需要进行附加操作以完成请求 |
| 4XX | Client Error（客户端错误状态码） | 表示服务器无法处理请求 |
| 5XX | Server Error（服务器错误状态码） | 表示服务器处理请求出错 |

### 1XX 信息

- **100 Continue**：说明到目前为止都很正常，客户端可以继续发送请求或者忽略这个响应。

### 2XX 成功

- **200 OK**：请求成功。
- **204 No Content**：请求成功处理，但不返回数据主体。多用于只需要从客户端往服务器发送信息的操作。
- **206 Partial Content**：指示客户端发起的范围请求成功，响应中包含由 `Content-Range` 指定范围的内容。

### 3XX 重定向

- **301 Moved Permanently**：永久重定向。
- **302 Found**：临时重定向。
- **303 See Other**：与 302 相同，但明确要求客户端使用 GET 方法获取资源。
- **304 Not Modified**：如果请求中包含条件（如 `If-Modified-Since`），并且条件不满足，则返回该状态码。
- **307 Temporary Redirect**：临时重定向，要求浏览器不将重定向请求的 POST 方法改为 GET 方法。

### 4XX 客户端错误

- **400 Bad Request**：请求报文中存在语法错误。
- **401 Unauthorized**：该状态码表示请求需要认证信息。
- **403 Forbidden**：请求被拒绝。
- **404 Not Found**：请求的资源未找到。

### 5XX 服务器错误

- **500 Internal Server Error**：服务器在执行请求时出错。
- **503 Service Unavailable**：服务器暂时无法处理请求，可能因过载或维护。

## 四、HTTP 首部

HTTP 中有四种类型的首部字段：通用首部字段、请求首部字段、响应首部字段和实体首部字段。

### 通用首部字段

| 首部字段名 | 说明 |
| :--: | :--: |
| Cache-Control | 控制缓存的行为 |
| Connection | 控制不再转发给代理的首部字段，管理持久连接 |
| Date | 报文创建的日期时间 |
| Pragma | 报文指令 |
| Trailer | 报文末端首部的概览 |
| Transfer-Encoding | 指定报文主体的传输编码方式 |
| Upgrade | 升级为其他协议 |
| Via | 代理服务器的相关信息 |
| Warning | 警告消息 |

### 请求首部字段

| 首部字段名 | 说明 |
| :--: | :--: |
| Accept | 用户代理可处理的媒体类型 |
| Accept-Charset | 优先的字符集 |
| Accept-Encoding | 优先的内容编码 |
| Accept-Language | 优先的语言（自然语言） |
| Authorization | Web 认证信息 |
| Expect | 期待服务器的特定行为 |
| From | 用户的电子邮箱地址 |
| Host | 请求资源所在的服务器 |
| If-Match | 比较实体标签（ETag） |
| If-Modified-Since | 比较资源的最后更新时间 |
| If-None-Match | 比较实体标签 |
| If-Range | 资源未更新时发送的实体字节范围请求 |
| If-Unmodified-Since | 资源更新时间的比较 |
| Max-Forwards | 最大传输逐跳数 |
| Proxy-Authorization | 代理服务器要求的客户端认证信息 |
| Range | 请求的实体字节范围 |
| Referer | 获取请求中 URI 的来源 |
| TE | 传输编码的优先级 |
| User-Agent | HTTP 客户端程序的信息 |

### 响应首部字段

| 首部字段名 | 说明 |
| :--: | :--: |
| Accept-Ranges | 是否接受字节范围请求 |
| Age | 资源创建经过的时间 |
| ETag | 资源的匹配信息 |
| Location | 重定向到的 URI |
| Proxy-Authenticate | 代理服务器对客户端的认证信息 |
| Retry-After | 再次发起请求的适宜时机 |
| Server | HTTP 服务器的相关信息 |
| Vary | 代理服务器缓存的管理信息 |
| WWW-Authenticate | 服务器对客户端的认证信息 |

### 实体首部字段

| 首部字段名 | 说明 |
| :--: | :--: |
| Allow | 资源可支持的 HTTP 方法 |
| Content-Encoding | 实体主体的编码方式 |
| Content-Language | 实体主体的自然语言 |
| Content-Length | 实体主体的大小 |
| Content-Location | 替代资源的 URI |
| Content-MD5 | 实体主体的报文摘要 |
| Content-Range | 实体主体的位置范围 |
| Content-Type | 实体主体的媒体类型 |
| Expires | 实体主体过期的时间 |
| Last-Modified | 资源的最后修改时间 |

## 五、具体应用

### 连接管理

<div align="center"> <img src="https://cs-notes-1256109796.cos.ap-guangzhou.myqcloud.com/HTTP1_x_Connections.png" width="800"/> </div><br>

#### 1. 短连接与长连接

在访问一个包含多张图片的 HTML 页面时，若每次都新建 TCP 连接，则会造成较大开销。长连接只需建立一次 TCP 连接，便能进行多次 HTTP 通信。

- 从 HTTP/1.1 开始，默认使用长连接。
- 要断开连接，需由客户端或服务器发起请求，使用 `Connection: close`。
- 在 HTTP/1.1 之前，默认使用短连接。

#### 2. 流水线

在默认情况下，HTTP 请求按顺序发出，后一个请求需等当前请求的响应返回后才能发出。而流水线允许在同一长期连接上连续发出请求，无需等待响应，从而减少延迟。

### Cookie

HTTP 协议是无状态的，为了提高性能而使其能够处理大量事务。从 HTTP/1.1 开始，引入 Cookie 以保存状态信息。

Cookie 是由服务器发给用户浏览器的一小块数据，浏览器会在后续请求中携带 Cookie，以此告知服务器是否是同一用户。由于每次请求都需要携带 Cookie 数据，会造成额外的性能开销（尤其在移动环境中）。

#### 1. 用途

- 会话状态管理（如用户登录状态、购物车等）
- 个性化设置（如用户自定义设置、主题等）
- 浏览器行为跟踪（如用户行为分析）

#### 2. 创建过程

服务器发送的响应报文中包含 `Set-Cookie` 首部字段，客户端在收到后会将 Cookie 保存。

```http
HTTP/1.0 200 OK
Content-type: text/html
Set-Cookie: yummy_cookie=choco
Set-Cookie: tasty_cookie=strawberry

[page content]
```

在后续请求中，客户端将 Cookie 信息携带至服务器。

```http
GET /sample_page.html HTTP/1.1
Host: www.example.org
Cookie: yummy_cookie=choco; tasty_cookie=strawberry
```

#### 3. 分类

- 会话 Cookie：仅在会话期内有效，浏览器关闭后自动删除。
- 持久性 Cookie：指定过期时间（`Expires`）后有效。

```http
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT;
```

#### 4. 作用域

`Domain` 字段指定哪些主机可以接收 Cookie。若未指定，默认为当前文档的主机（不包括子域名）。`Path` 字段用于指定哪些路径可以接收 Cookie。

#### 5. JavaScript 操作

浏览器通过 `document.cookie` 属性可以创建或访问非 `HttpOnly` 标记的 Cookie。

```javascript
document.cookie = "yummy_cookie=choco";
document.cookie = "tasty_cookie=strawberry";
console.log(document.cookie);
```

#### 6. HttpOnly

标记为 `HttpOnly` 的 Cookie 不能被 JavaScript 访问，这是为了防止跨站脚本攻击（XSS）。

```http
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly
```

#### 7. Secure

标记为 `Secure` 的 Cookie 仅可通过 HTTPS 请求发送给服务器。但即使设置了 `Secure`，敏感信息也不应通过 Cookie 传输。

#### 8. Session

用户信息可以存储在服务器端的 Session 中，安全性较高。Session 存储在文件、数据库或 Redis 中。

使用 Session 维护用户登录状态的过程如下：

1. 用户登录时，提交用户名和密码。
2. 服务器验证信息，存储用户数据于 Redis，并生成 Session ID。
3. 服务器响应报文的 `Set-Cookie` 包含 Session ID，客户端保存该 Cookie。
4. 后续请求中，客户端携带 Session ID，服务器查询 Redis 返回用户信息。

确保 Session ID 的安全性，定期更新以防止泄露。需在较高安全性场景中，如转账操作，二次身份验证（如密码、短信验证码）为提升安全性。

#### 9. 浏览器禁用 Cookie

若浏览器禁用 Cookie，会影响状态保存。此时可考虑 URL 重写，把 Session ID作为 URL 参数传递。

#### 10. Cookie 与 Session 选择

- Cookie 只支持 ASCII 字符，Session 支持更复杂数据。
- Cookie 易被恶意访问，存储隐私数据时需加密，而 Session 更加安全。
- 大型网站不推荐将所有用户信息存储进 Session，以避免开销过大。

### 缓存

#### 1. 优点

- 减轻服务器负担；
- 降低客户端获取资源的延迟：缓存通常存于内存中，因此读取速度更快。

#### 2. 实现方法

- 代理服务器进行缓存；
- 客户端浏览器进行缓存。

#### 3. Cache-Control

HTTP/1.1通过 `Cache-Control` 首部字段控制缓存。

**3.1 禁止缓存**  

`no-store` 指令表示禁止缓存任何请求或响应。

```http
Cache-Control: no-store
```

**3.2 强制确认缓存**  

`no-cache` 指令要求缓存服务器在使用缓存前，必须先向源服务器进行验证。

```http
Cache-Control: no-cache
```

**3.3 私有与公共缓存**  

`private` 指定资源为私有缓存，仅能被单个用户使用。

```http
Cache-Control: private
```

`public` 指定资源为公共缓存，可以被多个用户使用。

```http
Cache-Control: public
```

**3.4 缓存过期机制**  

- `max-age` 指令用于指定缓存资源的有效时间。
- `Expires` 暗示何时资源过期。

在 HTTP/1.1 中 `max-age` 指令优先处理。在 HTTP/1.0 中则会被忽略。

#### 4. 缓存验证

`ETag` 字段标识资源的唯一性，客户端可以在后续请求中将 `ETag` 值放入 `If-None-Match` 字段，来验证缓存的有效性。

```http
If-None-Match: "82e22293907ce725faf67773957acd12"
```

`Last-Modified` 首部字段指示资源的最后修改时间，客户端可以在请求中添加 `If-Modified-Since` 来验证。如果服务器发现资源未修改，则返回 304 Not Modified。

```http
If-Modified-Since: Wed, 21 Oct 2015 07:28:00 GMT
```

### 内容协商

内容协商用于返回最合适的内容，例如根据浏览器默认语言选择响应的语言版本。

#### 1. 类型

**1.1 服务端驱动型**  

客户端设置 `Accept`、`Accept-Charset`、`Accept-Encoding` 和 `Accept-Language` 等 HTTP 首部，服务器根据这些字段返回相应资源。

此方法存在的问题包括：

- 服务器无法获取客户端的全部信息；
- 客户端提供的信息冗长且有隐私风险；
- 不同展现形式的资源会降低共享缓存的效率，增加服务器的复杂性。

**1.2 代理驱动型**  

服务器可以返回 `300 Multiple Choices` 或 `406 Not Acceptable`，客户端从中选择最适合的资源。

#### 2. Vary

```http
Vary: Accept-Language
```

在使用内容协商的情况下，只有缓存服务器中的缓存满足条件时，才能使用该缓存，否则要向源服务器请求。

### 内容编码

内容编码操作用于对消息进行压缩，从而减少传输的数据量。常用的内容编码包括：gzip、compress、deflate、identity。

浏览器会在请求中发送 `Accept-Encoding` 首部，指明其支持的压缩算法，服务器选择一种并使用该算法对响应消息进行压缩，并通过 `Content-Encoding` 首部告知。

### 范围请求

如果网络中断，服务器只发送了部分数据，范围请求可避免重新发送所有数据，仅请求未发送的部分。

#### 1. Range

请求报文中可添加 `Range` 首部字段指定请求的字节范围。

```http
GET /z4d4kWk.jpg HTTP/1.1
Host: i.imgur.com
Range: bytes=0-1023
```

请求成功时，服务器返回 `206 Partial Content` 状态码。

```http
HTTP/1.1 206 Partial Content
Content-Range: bytes 0-1023/146515
Content-Length: 1024
...
(binary content)
```

#### 2. Accept-Ranges

响应首部 `Accept-Ranges` 用于告知客户端是否能处理范围请求，可接受的值为 `bytes` 或 `none`。

```http
Accept-Ranges: bytes
```

#### 3. 响应状态码

- 成功请求时，返回 `206 Partial Content` 状态码。
- 请求范围越界时，返回 `416 Requested Range Not Satisfiable` 状态码。
- 不支持范围请求时，返回 `200 OK` 状态码。

### 分块传输编码

分块传输编码（Chunked Transfer Encoding）将数据分为多个块逐步发送，便于浏览器逐步显示内容，提高用户体验。

### 多部分对象集合

报文主体可以包含多种类型的实体，每个部分之间由边界（boundary）分隔，每个部分可以有独立的首部字段。常用于上传多个文件的场景。

```http
Content-Type: multipart/form-data; boundary=AaB03x

--AaB03x
Content-Disposition: form-data; name="submit-name"

Larry
--AaB03x
Content-Disposition: form-data; name="files"; filename="file1.txt"
Content-Type: text/plain

... contents of file1.txt ...
--AaB03x--
```

### 虚拟主机

HTTP/1.1 引入虚拟主机技术，使得一台服务器能够处理多个域名，从逻辑上看似多台服务器。

### 通信数据转发

#### 1. 代理

代理服务器接受客户端请求转发至其它服务器。使用代理服务器的主要目的包括：

- 进行缓存
- 负载均衡
- 网络访问控制
- 记录访问日志

代理分为正向代理和反向代理：

- 正向代理：用户可感知其存在。

<div align="center"> <img src="https://cs-notes-1256109796.cos.ap-guangzhou.myqcloud.com/a314bb79-5b18-4e63-a976-3448bffa6f1b.png" width=""/> </div><br>

- 反向代理：用户无法感知其存在。

<div align="center"> <img src="https://cs-notes-1256109796.cos.ap-guangzhou.myqcloud.com/2d09a847-b854-439c-9198-b29c65810944.png" width=""/> </div><br>

#### 2. 网关

网关服务器将 HTTP 通信转换为其它协议，供非 HTTP 服务器使用。

#### 3. 隧道

使用 SSL 等加密手段，在客户端和服务器之间建立安全通信链路。

## 六、HTTPS

HTTPS 解决了 HTTP 的安全性问题，包括：

- 使用明文通信，可能被窃听；
- 无法验证通信方的身份，避免伪装；
- 报文完整性无法保证，可能遭篡改。

HTTPS 是在 HTTP 基础上使用 SSL（安全套接层）实现的，加密通信后提供安全性。

通过 SSL，HTTPS 实现了加密（防窃听）、认证（防伪装）和完整性保护（防篡改）。

<div align="center"> <img src="https://cs-notes-1256109796.cos.ap-guangzhou.myqcloud.com/ssl-offloading.jpg" width="700"/> </div><br>

### 加密

#### 1. 对称密钥加密

对称密钥加密（Symmetric-Key Encryption）使用相同的密钥进行加密和解密。

- 优点：推导速度快；
- 缺点：密钥无法安全传输。

<div align="center"> <img src="https://cs-notes-1256109796.cos.ap-guangzhou.myqcloud.com/7fffa4b8-b36d-471f-ad0c-a88ee763bb76.png" width="600"/> </div><br>

#### 2. 非对称密钥加密

非对称密钥加密（Public-Key Encryption）使用不同的密钥进行加密和解密。公开密钥公开，私钥则保留给通信接收方。

- 优点：可以安全地传输公开密钥；
- 缺点：推导速度相对较慢。

<div align="center"> <img src="https://cs-notes-1256109796.cos.ap-guangzhou.myqcloud.com/39ccb299-ee99-4dd1-b8b4-2f9ec9495cb4.png" width="600"/> </div><br>

#### 3. HTTPS Mixed 加密方式

HTTPS 结合了对称和非对称加密的优势：

- 使用非对称加密安全地传输对称密钥（Session Key）；
- 之后使用对称密钥进行数据传输，以保证效率。

<div align="center"> <img src="https://cs-notes-1256109796.cos.ap-guangzhou.myqcloud.com/How-HTTPS-Works.png" width="600"/> </div><br>

### 认证

HTTPS 通过使用数字证书对通信方进行认证。数字证书由受信赖的数字证书认证机构（CA）颁发。

服务器运营人员向 CA 提出请求，CA 在验证身份后对公开密钥进行签名。该签名与公开密钥绑定在一起，形成数字证书。

当建立 HTTPS 通信时，服务器将证书发送给客户端。客户端验证签名，通过后开始通信。

<div align="center"> <img src="https://cs-notes-1256109796.cos.ap-guangzhou.myqcloud.com/2017-06-11-ca.png" width=""/> </div><br>

### 完整性保护

SSL 通过报文摘要保证报文的完整性。

HTTP 提供了 MD5 报文摘要功能，但要注意它并不安全，因为篡改后的报文能重新计算 MD5 值。HTTPS 的报文摘要功能结合了加密和认证，因此能有效保护报文完整性。

### HTTPS 的缺点

- 加密解密过程会导致速度较慢；
- 可能需要支付证书高额费用。

## 七、HTTP/2.0

### HTTP/1.x 缺陷

HTTP/1.x 实现简单牺牲了性能，存在以下问题：

- 客户必须使用多个连接以实现并发，导致延迟高；
- 未压缩请求和响应首部，引入不必要的网络流量；
- 不支持有效的资源优先级，底层 TCP 连接利用率低下。

### 二进制分帧层

HTTP/2.0 将报文分成 HEADERS 帧和 DATA 帧，以二进制格式传输。

<div align="center"> <img src="https://cs-notes-1256109796.cos.ap-guangzhou.myqcloud.com/86e6a91d-a285-447a-9345-c5484b8d0c47.png" width="400"/> </div><br>

在通信过程中，会有一个 TCP 连接支撑任意数量的双向数据流（Stream）。

- 数据流的唯一标识符和可选优先级信息用于承载双向信息。
- 消息（Message）对应完整的一系列帧。
- 帧（Frame）是最小的通信单位，来自不同数据流的帧可交错发送，最终会根据帧头的标识符重新组装。

<div align="center"> <img src="https://cs-notes-1256109796.cos.ap-guangzhou.myqcloud.com/af198da1-2480-4043-b07f-a3b91a88b815.png" width="600"/> </div><br>

### 服务端推送

HTTP/2.0 允许服务器在客户端请求资源时，自动推送相关的资源给客户端，减少后续请求的次数。例如，当客户端请求 `page.html` 时，服务器也将 `script.js` 和 `style.css` 一并发送。

<div align="center"> <img src="https://cs-notes-1256109796.cos.ap-guangzhou.myqcloud.com/e3f1657c-80fc-4dfa-9643-bf51abd201c6.png" width="800"/> </div><br>

### 首部压缩

HTTP/1.1 的首部字段通常包含大量内容，且每次重复发送。HTTP/2.0 维护一个包含之前见过的首部字段的动态表，从而避免重复传输。

同时，HTTP/2.0 使用 Huffman 编码对首部字段进行压缩。

<div align="center"> <img src="https://cs-notes-1256109796.cos.ap-guangzhou.myqcloud.com/_u4E0B_u8F7D.png" width="600"/> </div><br>

## 八、HTTP/1.1 新特性

- 默认使用长连接
- 支持流水线
- 支持同时建立多个 TCP 连接
- 支持虚拟主机
- 新增状态码 `100`
- 支持分块传输编码
- 新增缓存处理指令 `max-age`

## 九、GET 和 POST 比较

### 作用

- GET：用于获取资源。
- POST：用于传输实体主体数据。

### 参数

GET 和 POST 请求都可使用额外参数，但 GET 参数出现在 URL 中，POST 参数在消息主体中。虽说 POST 参数在消息主体中更为隐蔽，但可被抓包工具（如 Fiddler）查看。

GET 请求的参数应进行 URL 编码。

```http
GET /test/demo_form.asp?name1=value1&name2=value2 HTTP/1.1
```

```http
POST /test/demo_form.asp HTTP/1.1
Host: w3schools.com
name1=value1&name2=value2
```

### 安全

- GET 方法是安全的，不会改变服务器状态。
- POST 方法不安全，因为它的目的是传送实体主体内容，可能导致状态改变。

安全方法包括 GET、HEAD、OPTIONS 等；不安全方法包括 POST、PUT、DELETE。

### 幂等性

幂等方法，执行一次与多次效果一致。即多次执行不会改变服务器状态。所有安全方法都是幂等的，GET、HEAD、PUT 和 DELETE 能在正确实现的条件下都是幂等的，只有 POST 方法不是。

```http
GET /pageX HTTP/1.1   → 幂等
GET /pageX HTTP/1.1   → 幂等
GET /pageX HTTP/1.1   → 幂等
```

```http
POST /add_row HTTP/1.1   → 添加一行
POST /add_row HTTP/1.1   → 添加第二行
POST /add_row HTTP/1.1   → 添加第三行
```

```http
DELETE /idX/delete HTTP/1.1   → 返回 200（若 idX 存在）
DELETE /idX/delete HTTP/1.1   → 返回 404（已经删除）
DELETE /idX/delete HTTP/1.1   → 返回 404
```

### 可缓存

响应可被缓存需要满足以下条件：

1. 请求方法是可缓存的（GET 和 HEAD 可缓存，PUT 和 DELETE 不可缓存，POST 在大多数情况下不可缓存）。
2. 响应的状态码是可缓存的（如：200, 203, 204, 206 等）。
3. 响应的 `Cache-Control` 首部字段没有设置不缓存。

### XMLHttpRequest

`XMLHttpRequest` 是一种 API，允许在客户端和服务器之间进行数据传输，支持局部更新页面而不刷新整个页面。

- POST 方法时，浏览器会先发送 Header 然后再发送 Data；不同浏览器表现不同，某些浏览器会将二者一起发送。
- GET 方法的 Header 和 Data 将一并发送。

## 参考资料

- 上野宣. 图解 HTTP[M]. 人民邮电出版社, 2014.
- [MDN : HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)
- [HTTP/2 简介](https://developers.google.com/web/fundamentals/performance/http2/?hl=zh-cn)
- [htmlspecialchars](http://php.net/manual/zh/function.htmlspecialchars.php)
- [Difference between file URI and URL in java](http://java2db.com/java-io/how-to-get-and-the-difference-between-file-uri-and-url-in-java)
- [How to Fix SQL Injection Using Java PreparedStatement & CallableStatement](https://software-security.sans.org/developer-how-to/fix-sql-injection-in-java-using-prepared-callable-statement)
- [浅谈 HTTP 中 GET 与 POST 的区别](https://www.cnblogs.com/hyddd/archive/2009/03/31/1426026.html)
- [Are http:// and www really necessary?](https://www.webdancers.com/are-http-and-www-necesary/)
- [HTTP (HyperText Transfer Protocol)](https://www.ntu.edu.sg/home/ehchua/programming/webprogramming/HTTP_Basics.html)
- [Web-VPN: Secure Proxies with SPDY & Chrome](https://www.igvita.com/2011/12/01/web-vpn-secure-proxies-with-spdy-chrome/)
- [File:HTTP persistent connection.svg](http://en.wikipedia.org/wiki/File:HTTP_persistent_connection.svg)
- [Proxy server](https://en.wikipedia.org/wiki/Proxy_server)
- [What Is This HTTPS/SSL Thing And Why Should You Care?](https://www.x-cart.com/blog/what-is-https-and-ssl.html)
- [What is SSL Offloading?](https://securebox.comodo.com/ssl-sniffing/ssl-offloading/)
- [Sun Directory Server Enterprise Edition 7.0 Reference - Key Encryption](https://docs.oracle.com/cd/E19424-01/820-4811/6ng8i26bn/index.html)
- [An Introduction to Mutual SSL Authentication](https://www.codeproject.com/Articles/326574/An-Introduction-to-Mutual-SSL-Authentication)
- [The Difference Between URLs and URIs](https://danielmiessler.com/study/url-uri/)
- [Cookie 与 Session 的区别](https://juejin.im/entry/5766c29d6be3ff006a31b84e#comment)
- [COOKIE 和 SESSION 有什么区别](https://www.zhihu.com/question/19786827)
- [Cookie/Session 的机制与安全](https://harttle.land/2015/08/10/cookie-session.html)
- [HTTPS 证书原理](https://shijianan.com/2017/06/11/https/)
- [What is the difference between a URI, a URL and a URN?](https://stackoverflow.com/questions/176264/what-is-the-difference-between-a-uri-a-url-and-a-urn)
- [XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)
- [XMLHttpRequest (XHR) Uses Multiple Packets for HTTP POST?](https://blog.josephscott.org/2009/08/27/xmlhttprequest-xhr-uses-multiple-packets-for-http-post/)
- [Symmetric vs. Asymmetric Encryption – What are differences?](https://www.ssl2buy.com/wiki/symmetric-vs-asymmetric-encryption-what-are-differences)
- [Web 性能优化与 HTTP/2](https://www.kancloud.cn/digest/web-performance-http2)
- [HTTP/2 简介](https://developers.google.com/web/fundamentals/performance/http2/?hl=zh-cn)
```
