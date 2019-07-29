CREATE TABLE transactions (
    id serial primary key,
    amount numeric,
    accountnumber numeric
);


CREATE TABLE balances (
    accountnumber numeric unique,
    balance numeric
);

CREATE TABLE sessionguard (
    session_number numeric primary key,
    create_time timestamp
);
