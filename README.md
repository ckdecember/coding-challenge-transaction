# Transactions at a bank

Write some code to handle a transfer of money between two banks.

Full details https://github.com/Samariya57/coding_challenges/blob/master/transactions.md

Consider transactional safety and consistency, use Node.JS, and a relational DB system.

Solution:

For the web component, Node.JS's express kit along with ejs for templating.  For the database side, use postgresql with a simple schema

TABLE transactions
  - reference (unique)
  - amount
  - account nr

This keeps track of all running transactions.

TABLE balances
  - account nr (unique)
  - balance

This rolls up all transactions to give you the current balance.

## Double transactions!
To stop double transaction entries, we added a random session id as a hidden field.  This will be recorded to help prevent accidental double clicks from triggering the actual transaction.

We added another table called
TABLE sessionguard
- session_number (unique)
- create_time 

