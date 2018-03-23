<!-- GFM-TOC -->
* [I. Basic Concepts] (#1 - Basic Concepts)
    * [Web infrastructure] (#web-based)
    * [URL] (#url)
    * [Request and Response Message] (#Request and Response Message)
* [2. HTTP method] (#2 http-method)
    * [GET: Get Resources] (#get Get Resources)
    * [POST: transport entity body] (#post transport entity body)
    * [HEAD: Get Message Header] (#head Get Message Header)
    * [PUT: upload file] (#put upload file)
    * [PATCH: Partially modify the resource] (#patch partially modified the resource)
    * [DELETE: delete file] (#delete delete file)
    * [OPTIONS: query support method] (#options query support method)
    * [CONNECT: Requires Tunneling Protocol to Connect to Proxy] (#connect requires a tunneling protocol to connect to the proxy)
    * [TRACE: Tracking Path] (#trace Tracking Path)
* [3. HTTP status code] (#3 http-status code)
    * [2XX Success] (#2xx-Success)
    * [3XX Redirect] (#3xx-Redirect)
    * [4XX Client Error] (#4xx - Client Error)
    * [5XX Server Error] (#5xx-Server Error)
* [4. HTTP Header] (#4 http-header)
    * [Universal Header Fields] (#Common Header Field)
    * [Request header field] (#Request header field)
    * [Response header field] (# response header field)
    * [Entity Header Field] (#Entity Header Field)
* [5. Specific application] (#5 specific application)
    * [Cookie](#cookie)
    * [Cache] (#Cache)
    * [Permanent connection] (# persistent connection)
    * [Code] (#Code)
    * [Block Transfer] (#Block Transfer)
    * [Multipart Object Collection] (#Multipart Object Collection)
    * [Scope Request] (#Scope Request)
    * [Content negotiation] (# content negotiation)
    * [virtual host] (# virtual host)
    * [communication data forwarding] (# communication data forwarding)
* [six, https] (#six https)
    * [encryption] (#encryption)
    * [authentication] (#certification)
    * [Integrity] (#Integrity)
* [VII. Comparison of versions] (Comparison of #7 versions)
    * [The difference between HTTP/1.0 and HTTP/1.1] (The difference between #http10- and -http11-)
    * The difference between HTTP/1.1 and HTTP/2.0 (the difference between #http11- and -http20-)
* [Reference materials] (#reference materials)
<!-- GFM-TOC -->


# I. Basic concepts

## Web Fundamentals

- HTTP (HyperText Transfer Protocol).
- Three technologies of the WWW (World Wide Web): HTML, HTTP, URL.
- RFC (Request for Comments, Request for Comments), Internet Design Document.

## URL

- Uniform Resource Indentifier (URI)
- URL (Uniform Resource Locator)
- URN (Uniform Resource Name), for example urn:isbn:0-486-27557-4.

URIs contain URLs and URNs. Currently, WEBs only have URLs that are popular, so basically all URLs are seen.

<div align="center"> <img src="../pics//4102b7d0-39b9-48d8-82ae-ac4addb7ebfb.jpg"/> </div><br>

## Request and Response Messages

### 1. Request message

<div align="center"> <img src="../pics//22b39f77-ac47-4978-91ed-84aaf457644c.jpg"/> </div><br>

### 2. Response message

<div align="center"> <img src="../pics//00d8d345-cd4a-48af-919e-209d2788eca7.jpg"/> </div><br>

# Second, the HTTP method

The **Request message sent by the client** The first line of the request contains the method field.

## GET: Get resources

## POST: Transport Entity Body

The main purpose of POST is not to obtain resources but to transfer data stored in content entities.

Both GET and POST requests can use extra parameters, but GET's parameters appear in the URL as query strings, and POST's parameters are stored in content entities.

```
GET /test/demo_form.asp?name1=value1&name2=value2 HTTP/1.1
```

```
POST /test/demo_form.asp HTTP/1.1
Host: w3schools.com
Name1=value1&name2=value2
```

GET's pass arguments are less secure than POST because GET passed parameters are visible in the URL and may reveal private information. And GET only supports ASCII characters. If the parameter is Chinese, it may be garbled, and POST supports the standard character set.

## HEAD: Get Message Header

Same as the GET method but does not return the body of the message entity.

It is mainly used to confirm the validity of the URL and the date and time of the resource update.

## PUT: upload file

Since no authentication mechanism is available, anyone can upload a file, so there is a security problem and this method is generally not used.

```html
PUT /new.html HTTP/1.1
Host: example.com
Content-type: text/html
Content-length: 16

<p>New File</p>
```

## PATCH: Partially Modifying Resources

PUT can also be used to modify resources, but can only completely replace the original resource, PATCH allows partial modification.

```html
PATCH /file.txt HTTP/1.1
Host: www.example.com
Content-Type: application/example
If-Match: "e0023aa4e"
Content-Length: 100

[description of changes]
```

## DELETE: Delete Files

Contrary to the PUT function, it also does not have an authentication mechanism.

```html
DELETE /file.html HTTP/1.1
```

## OPTIONS: Query Support Methods

Query the method that the specified URL can support.

Will return something like Allow: GET, POST, HEAD, OPTIONS.

## CONNECT: Requires Tunneling Protocol Connection Agent

The requirement is to set up a tunnel when the proxy server communicates, and use SSL (Secure Sockets Layer, Secure Sockets) and TLS (Transport Layer Security) protocols to encrypt the communication content and tunnel it over the network.

```html
CONNECT www.example.com:443 HTTP/1.1
```

<div align="center"> <img src="../pics//5994928c-3d2d-45bd-abb1-adc4f5f4d775.jpg"/> </div><br>

## TRACE: Tracking Path

The server will return the communication path to the client.

When sending a request, enter the value in the Max-Forwards header field, subtract 1 from each server, and stop transmission when the value is 0.

TRACE is not usually used, and it is vulnerable to XST attacks (Cross-Site Tracing), so it will not be used.

<div align="center"> <img src="../pics//c8637fd2-3aaa-46c4-b7d9-f24d3fa04781.jpg"/> </div><br>

#3. HTTP status code

The first line of status in the **response message** returned by the server contains the status code and the reason phrase used to inform the client of the requested result.

| Status Code | Categories | Reason Phrases |
| --- | --- | --- |
| 1XX | Informational (Informational Status Code) | Receiving requests are being processed |
| 2XX | Success (Success Status Code) | Request Normal Processing Complete |
| 3XX | Redirection | Additional actions required to complete the request |
| 4XX | Client Error (Client Error Status Code) | Server Cannot Process Request |
| 5XX | Server Error (Server Error Status Code) | Server Processing Request Error |

## 2XX Success

- **200 OK**

- **204 No Content** : The request has been successfully processed, but the returned response does not contain the main part of the entity. It is generally used when sending information from the client to the server only, without returning data.

- **206 Partial Content** : Indicates that the client has made a scope request. The response message contains the content of the entity specified by Content-Range.

## 3XX Redirects

- **301 Moved Permanently** : Permanent Redirect

- **302 Found** : Temporary Redirection

- **303 See Other** : Same as the 302, but 303 explicitly requires that the client should use the GET method to get the resource.

- Note: Although the HTTP protocol specifies that the POST method should not be changed to the GET method when redirected in the 301 or 302 state, most browsers redirect the POST method to the GET method in the 301, 302, and 303 state redirection.

- ** 304 Not Modified** : If the request packet header contains some conditions, such as: If-Match, If-ModifiedSince, If-None-Match, If-Range, If-Unmodified-Since, but does not meet the conditions, then The server returns a 304 status code.

- **307 Temporary Redirect** : Temporary redirect, similar to the meaning of 302, but 307 requires the browser not to change the redirect request's POST method to the GET method.

## 4XX Client Error

- **400 Bad Request** : There is a syntax error in the request message.

- **401 Unauthorized** : This status code indicates that the sent request requires authentication information (BASIC authentication, DIGEST authentication). If a request has been made before, the user authentication has failed.

<div align="center"> <img src="../pics//b1b4cf7d-c54a-4ff1-9741-cd2eea331123.jpg"/> </div><br>

- **403 Forbidden**: The request was rejected. The server did not need to give the detailed reason for the rejection.

- **404 Not Found**

## 5XX server error

- **500 Internal Server Error** : An error occurred while the server was executing the request.

- **503 Service Unavilable** : The server is temporarily overloaded or maintenance is taking place. It is now unable to process the request.

#4. HTTP Header

There are 4 types of header fields: the generic header field, the request header field, the response header field, and the entity header field.

The various header fields and their meanings are as follows (do not need to be recorded in all for review):

## Common Header Fields

| First field name |
