// In SQL, Inner Join is a type of join that returns only the rows that have matching values in both tables.
// It is the most common type of join and is used to combine rows from two or more tables based on a related column between them.
// For example, if we have two tables, "Customers" and "Orders", 
// and we want to retrieve all customers along with their orders,
// we can use an Inner Join to combine the two tables based on the "CustomerID" column that they have in common.

SELECT Customers.CustomerName, Orders.OrderID
FROM Customers
INNER JOIN Orders ON Customers.CustomerID = Orders.CustomerID;

// In SQL, Left Join (or Left Outer Join) is a type of join that returns all the rows from the left table 
// and the matching rows from the right table.
// If there is no match in the right table, the result will contain NULL values for the columns from the right table.
// For example, if we want to retrieve all customers along with their orders, 
// but we also want to include customers who have not placed any orders, 
// we can use a Left Join.

SELECT Customers.CustomerName, Orders.OrderID
FROM Customers
LEFT JOIN Orders ON Customers.CustomerID = Orders.CustomerID;

// Rows disappearing in a Left Join can occur when there are no matching rows in the right table for a given row in the left table.
// For example, if we have a customer who has not placed any orders, 
// that customer's row will still be included in the result of the Left Join,
// but the columns from the Orders table will contain NULL values.