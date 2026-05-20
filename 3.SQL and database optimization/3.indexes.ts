// Indexes speed reads because they allow the database to quickly locate the data without having to scan the entire table. 
// However, they can slow down writes because the database has to update the index every time a record is inserted, 
// updated, or deleted. Therefore, it's important to carefully consider which columns to index based on the read 
// and write patterns of your application.

// Composite indexes are indexes that include multiple columns. They can be useful for queries that filter on multiple columns,
// as they allow the database to use the index to quickly locate the relevant records.
//  However, composite indexes can also be larger and slower to update than single-column indexes, 
// so it's important to carefully consider which columns to include in a composite index based on the specific 
// queries that your application will be executing.

// High-cardinality indexes are indexes on columns that have a large number of unique values. 
// They can be useful for queries that filter on those columns,
// as they allow the database to quickly locate the relevant records. 
// However, high-cardinality indexes can also be larger and slower to update than low-cardinality indexes,
