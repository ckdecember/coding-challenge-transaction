var express = require('express');
var router = express.Router();

const db = require('../db')

/* transfer */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* need to add for POST */

router.post('/', function(req, res, next) {
    //async (req, res) => {}

    var fromaccount = req.body.fromaccount;
    var toaccount = req.body.toaccount;
    var amountmoney = req.body.amountmoney;

    //The request should be a POST request to the method /transfer with the payload: {from:account, to:account, amount:money}.

    /*
    CREATE TABLE transactions (
        id serial primary key,
        amount numeric,
        accountnumber numeric
    );

    CREATE TABLE balances (
        accountnumber numeric unique,
        balance numeric
    );

    The response should return the following payload: {id:transaction_id, from:{id:account, balance:current_balance},to:{id:account,balance:current_balance}, transfered:transfer_amount}
    */



    /*
    var transfer_response = {}
    transfer_response['id'] = transaction_id;
    var from_balance = from_current_balance;
    var to_curbalance = to_current_balance;
    var transfered_amount = amountmoney;
    */

    /* BEGIN, COMMIT.*/

    db.query("SELECT * FROM transactions");

    /*
    db.query('INSERT INTO transactions (id, amount, accountnumber) \
        VALUES (DEFAULT, $1::int, $2::text', -amountmoney, fromaccount)
        .then( (result) =>
            res.send("HI")
        )*/

    
    
    /*db.query('INSERT INTO transactions (id, amount, accountnumber) \
        VALUES (DEFAULT, $1::int, $2::text', amountmoney, toaccount);*/
    // insert into transactions (id, amount, accountnumber) values (DEFAULT, amountmoney, toaccount )

    //WHERE unitname = $1::text', [req.params.unitname])

    /*
    db.query('SELECT fields \
    FROM transactions \
    ORDER BY unitname')
    .then((result) => 
        res.render('units/index', {
            'scriptvar': "boo",
            'unitlist': result.rows,
            'headers': result.fields
        }
    ))
    .catch((err) => console.error('error executing query', err.stack));

    const evols = await db.query('SELECT DISTINCT evolution \
    FROM units \
    WHERE unitname = $1::text', [req.params.unitname])
        .then( (result) => {return result} )
        .catch( (err) => console.error('error executing query', err.stack));
    */

    res.render('transfer', { 
        title: 'MO MONEY TRANSFERRED',
        fromaccount: fromaccount
    });
 
});

module.exports = router;
