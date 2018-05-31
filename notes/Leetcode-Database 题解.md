<!-- GFM-TOC -->
* [175. Combine Two Tables](#175-combine-two-tables)
* [181. Employees Earning More Than Their Managers](#181-employees-earning-more-than-their-managers)
* [183. Customers Who Never Order](#183-customers-who-never-order)
* [184. Department Highest Salary](#184-department-highest-salary)
* [未完待续...](#未完待续)
<!-- GFM-TOC -->


# 175. Combine Two Tables

https://leetcode.com/problems/combine-two-tables/description/

## Description

Person 表：

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

Address 表：

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

查找 FirstName, LastName, City, State 数据，而不管一个用户有没有填地址信息。

## SQL Schema

```sql
DROP TABLE Person;
CREATE TABLE Person ( PersonId INT, FirstName VARCHAR ( 255 ), LastName VARCHAR ( 255 ) );
DROP TABLE Address;
CREATE TABLE Address ( AddressId INT, PersonId INT, City VARCHAR ( 255 ), State VARCHAR ( 255 ) );
INSERT INTO Person ( PersonId, LastName, FirstName )
VALUES
    ( 1, 'Wang', 'Allen' );
INSERT INTO Address ( AddressId, PersonId, City, State )
VALUES
    ( 1, 2, 'New York City', 'New York' );
```

## Solution

使用左外连接。

```sql
SELECT FirstName, LastName, City, State
FROM Person AS P LEFT JOIN Address AS A
ON P.PersonId = A.PersonId;
```

# 181. Employees Earning More Than Their Managers

https://leetcode.com/problems/employees-earning-more-than-their-managers/description/

## Description

Employee 表：

```html
+----+-------+--------+-----------+
| Id | Name  | Salary | ManagerId |
+----+-------+--------+-----------+
| 1  | Joe   | 70000  | 3         |
| 2  | Henry | 80000  | 4         |
| 3  | Sam   | 60000  | NULL      |
| 4  | Max   | 90000  | NULL      |
+----+-------+--------+-----------+
```

查找所有员工，它们的薪资大于其经理薪资。

## SQL Schema

```sql
DROP TABLE Employee;
CREATE TABLE Employee ( Id INT, NAME VARCHAR ( 255 ), Salary INT, ManagerId INT );
INSERT INTO Employee ( Id, NAME, Salary, ManagerId )
VALUES
    ( '1', 'Joe', '70000', '3' ),
    ( '2', 'Henry', '80000', '4' ),
    ( '3', 'Sam', '60000', NULL ),
    ( '4', 'Max', '90000', NULL );
```

## Solution

```sql
SELECT E1.Name AS Employee
FROM Employee AS E1, Employee AS E2
WHERE E1.ManagerId = E2.Id AND E1.Salary > E2.Salary;
```

# 183. Customers Who Never Order

https://leetcode.com/problems/customers-who-never-order/description/

## Description

Curstomers 表：

```html
+----+-------+
| Id | Name  |
+----+-------+
| 1  | Joe   |
| 2  | Henry |
| 3  | Sam   |
| 4  | Max   |
+----+-------+
```

Orders 表：

```html
+----+------------+
| Id | CustomerId |
+----+------------+
| 1  | 3          |
| 2  | 1          |
+----+------------+
```

查找没有订单的顾客信息：

```html
+-----------+
| Customers |
+-----------+
| Henry     |
| Max       |
+-----------+
```

## SQL Schema

```sql
DROP TABLE Customers;
CREATE TABLE Customers ( Id INT, NAME VARCHAR ( 255 ) );
DROP TABLE Orders;
CREATE TABLE Orders ( Id INT, CustomerId INT );
INSERT INTO Customers ( Id, NAME )
VALUES
    ( '1', 'Joe' ),
    ( '2', 'Henry' ),
    ( '3', 'Sam' ),
    ( '4', 'Max' );
INSERT INTO Orders ( Id, CustomerId )
VALUES
    ( '1', '3' ),
    ( '2', '1' );
```

## Solution

左外链接

```sql
SELECT C.Name AS Customers
FROM Customers AS C LEFT JOIN Orders AS O
ON C.Id = O.CustomerId
WHERE O.CustomerId IS NULL;
```

子查询

```sql
SELECT C.Name AS Customers
FROM Customers AS C
WHERE C.Id NOT IN (
    SELECT CustomerId
    FROM Orders
);
```

# 184. Department Highest Salary

https://leetcode.com/problems/department-highest-salary/description/

## Description

Employee 表：

```html
+----+-------+--------+--------------+
| Id | Name  | Salary | DepartmentId |
+----+-------+--------+--------------+
| 1  | Joe   | 70000  | 1            |
| 2  | Henry | 80000  | 2            |
| 3  | Sam   | 60000  | 2            |
| 4  | Max   | 90000  | 1            |
+----+-------+--------+--------------+
```

Department 表：

```html
+----+----------+
| Id | Name     |
+----+----------+
| 1  | IT       |
| 2  | Sales    |
+----+----------+
```

查找一个 Department 中收入最高者的信息：

```html
+------------+----------+--------+
| Department | Employee | Salary |
+------------+----------+--------+
| IT         | Max      | 90000  |
| Sales      | Henry    | 80000  |
+------------+----------+--------+
```

## SQL Schema

```sql
DROP TABLE Employee;
CREATE TABLE Employee ( Id INT, NAME VARCHAR ( 255 ), Salary INT, DepartmentId INT );
DROP TABLE Department;
CREATE TABLE Department ( Id INT, NAME VARCHAR ( 255 ) );
INSERT INTO Employee ( Id, NAME, Salary, DepartmentId )
VALUES
    ( 1, 'Joe', 70000, 1 ),
    ( 2, 'Henry', 80000, 2 ),
    ( 3, 'Sam', 60000, 2 ),
    ( 4, 'Max', 90000, 1 );
INSERT INTO Department ( Id, NAME )
VALUES
    ( 1, 'IT' ),
    ( 2, 'Sales' );
```

## Solution

```sql
SELECT D.Name AS Department, E.Name AS Employee, E.Salary
FROM Employee AS E, Department AS D,
    (SELECT DepartmentId, MAX(Salary) AS Salary
    FROM Employee
    GROUP BY DepartmentId) AS M
WHERE E.DepartmentId = D.Id
    AND E.DepartmentId = M.DepartmentId
    AND E.Salary = M.Salary;
```

# 未完待续...
