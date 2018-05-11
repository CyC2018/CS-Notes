<!-- GFM-TOC -->
* [175. Combine Two Tables](#175-combine-two-tables)
* [未完待续...](#未完待续)
<!-- GFM-TOC -->


# 175. Combine Two Tables

https://leetcode.com/problems/combine-two-tables/description/

## Describe

Table: Person

```html
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| PersonId    | int     |
| FirstName   | varchar |
| LastName    | varchar |
+-------------+---------+
PersonId is the primary key column for this table.
```

Table: Address

```html
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| AddressId   | int     |
| PersonId    | int     |
| City        | varchar |
| State       | varchar |
+-------------+---------+
AddressId is the primary key column for this table.
```

取出 FirstName, LastName, City, State 数据，而不管一个用户有没有填地址信息。

## SQL Schema

```sql
CREATE TABLE Person ( PersonId INT, FirstName VARCHAR ( 255 ), LastName VARCHAR ( 255 ) );
CREATE TABLE Address ( AddressId INT, PersonId INT, City VARCHAR ( 255 ), State VARCHAR ( 255 ) );
TRUNCATE TABLE Person;
INSERT INTO Person ( PersonId, LastName, FirstName )
VALUES
    ( 1, 'Wang', 'Allen' );
TRUNCATE TABLE Address;
INSERT INTO Address ( AddressId, PersonId, City, State )
VALUES
    ( 1, 2, 'New York City', 'New York' );
```

## Solution

使用左外连接。

```sql
SELECT FirstName, LastName, City, State
FROM Person AS p LEFT JOIN address AS a
ON p.PersonId = a.PersonId;
```

# 未完待续...
